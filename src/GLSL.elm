module GLSL exposing (load, view)

{-
   Draw a circle in the fragment shader.

   This example is based on:
   http://www.geeks3d.com/20130705/shader-library-circle-disc-fake-sphere-in-glsl-opengl-glslhacker/
-}

import Html exposing (Attribute, Html)
import Html.Attributes exposing (height, style, width)
import Math.Vector2 exposing (Vec2)
import Math.Vector3 exposing (Vec3, vec3)
import Task exposing (attempt)
import WebGL exposing (Mesh, Shader)
import WebGL.Texture exposing (Texture)


load =
    attempt Result.toMaybe <| WebGL.Texture.load "data/grass.jpg"


view : Float -> Texture -> List (Attribute msg) -> Html msg
view t text a =
    WebGL.toHtml a
        [ WebGL.entity
            vertexShader
            fragmentShader
            mesh
            { u_time = t, u_texture = text }
        ]



-- Mesh


mesh : Mesh { position : Vec3 }
mesh =
    WebGL.triangles
        [ ( { position = vec3 -1 1 0 }
          , { position = vec3 1 1 0 }
          , { position = vec3 -1 -1 0 }
          )
        , ( { position = vec3 -1 -1 0 }
          , { position = vec3 1 1 0 }
          , { position = vec3 1 -1 0 }
          )
        ]



-- Shaders


vertexShader : Shader { position : Vec3 } { u_time : Float, u_texture : Texture } { uv : Vec2 }
vertexShader =
    [glsl|
        attribute vec3 position;
        varying vec2 uv;

        void main () {
            gl_Position = vec4(position, 1.0);
            uv = position.xy;
        }
    |]


fragmentShader : Shader {} { u_time : Float, u_texture : Texture } { uv : Vec2 }
fragmentShader =
    [glsl| // backported from version 300 es by chat
precision highp float;

/* ------------- interface ------------- */
varying vec2 uv;
uniform float u_time;
uniform sampler2D u_texture;

/* ------------- constants ------------- */
const float PI 		= 3.14159265;
const float EPSILON = 0.01;
const float INF		= 1e20;
const int MAX_ITERATIONS = 1000;

/* ------------- helper structs -------- */
struct Line {
    vec3 p;   // point
    vec3 d;   // direction (not normalised here on purpose)
    mat3 b;   // basis
};

struct RectPlane {
    vec3 p;   // one corner
    vec3 u;   // span-vector #1 (width)
    vec3 v;   // span-vector #2 (height)
};

/* ------------- rotations ------------- */
mat2 rot2(float a){
    float c = cos(a), s = sin(a);
    return mat2( c, -s,
                 s,  c);
}
/* square matrices are fine in ES 100 so rot3* stay the same */
mat3 rot3z(float a){
    float c = cos(a), s = sin(a);
    return mat3( c,-s,0.,
                 s, c,0.,
                 0.,0.,1.);
}
mat3 rot3y(float a){
    float c = cos(a), s = sin(a);
    return mat3( c,0., s,
                 0.,1.,0.,
                -s,0., c);
}
mat3 rot3x(float a){
    float c = cos(a), s = sin(a);
    return mat3(1.,0.,0.,
                0., c,-s,
                0., s, c);
}

mat3 axisAngle(vec3 axis, float a){
    axis      = normalize(axis);
    float s   = sin(a);
    float c   = cos(a);
    float ic  = 1.0 - c;
    return mat3(
        c + axis.x*axis.x*ic,
        axis.x*axis.y*ic - axis.z*s,
        axis.x*axis.z*ic + axis.y*s,

        axis.y*axis.x*ic + axis.z*s,
        c + axis.y*axis.y*ic,
        axis.y*axis.z*ic - axis.x*s,

        axis.z*axis.x*ic - axis.y*s,
        axis.z*axis.y*ic + axis.x*s,
        c + axis.z*axis.z*ic
    );
}

vec3 fromPolar3(vec3 v){
  return rot3y(v.x) * rot3x(v.y) * vec3(0., 0., v.z);
}

/* ------------- geometry -------------- */
float linePlaneIntersect(Line line, vec3 planeP, vec3 planeN){
    float denom = dot(line.d, planeN);
    if(abs(denom) < EPSILON) return INF;
    return dot(planeP - line.p, planeN)/denom;
}

/*  bounded rectangle */
float linePlaneIntersect(Line line, RectPlane pl){
    vec3 n = normalize(cross(pl.u, pl.v));
    float denom = dot(line.d, n);
    if(abs(denom) < EPSILON) return INF;

    float t = dot(pl.p - line.p, n)/denom;
    vec3  hit = line.p + line.d * t;
    vec3  rel = hit - pl.p;

    float u = dot(rel, pl.u) / dot(pl.u, pl.u);
    float v = dot(rel, pl.v) / dot(pl.v, pl.v);

    return (u < -EPSILON || u > 1.+EPSILON ||
            v < -EPSILON || v > 1.+EPSILON) ? INF : t;
}

vec3 mirror(vec3 dir, vec3 normal){
    return dir - 2.0 * dot(dir,normal) / dot(normal,normal) * normal;
}

/* reflect-and-advance along a “portal” rectangle */
Line transport(Line ray, float l){
    RectPlane pl = RectPlane(
        vec3( 1., -1., 10.),   // corner
        vec3( 0.,  6.,  0.),   // width  vector
        vec3(-2.,  0.,  0.)    // height vector
    );

    float t  = linePlaneIntersect(ray, pl);

    if(t==INF || t<0.0 || t>l) 
    { 
        ray.p += ray.d*l;
        return ray;
    }

    ray.p += ray.d*t;

    float scale = 1.0;
    vec3 n = cross(pl.u,pl.v);
    ray.d = mirror(ray.d, n);
    ray.d.x *= scale;
    ray.d.z *= scale;
    if (ray.b != mat3(0.))
    {
        ray.b = mat3(mirror(ray.b[0], n), mirror(ray.b[1], n), mirror(ray.b[2], n));
        ray.b[0] *= scale;
        ray.b[2] *= scale;
    }

    ray.p += ray.d*(l - t);
    return ray;
}

/* ----------- scene SDF --------------- */
float box(vec3 p, vec3 b){
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)), 0.0);
}

float torus(vec3 p, vec2 t){
    vec2 q = vec2(length(p.xz)-t.x, p.y);
    return length(q)-t.y;
}

float sphere(vec3 p,float r){ return length(p) - r; }

float sdf(vec3 p)
{
    /* ------------- static floor ---------------------------------- */
    float floorY = p.y + 1.0;

    /* ------------- wobbling sphere ------------------------------- */
    float ball = sphere(p - vec3(-2.0,
                                 0.9 + 0.4*sin(u_time*1.3),
                                 5.0),
                        1.0);

    /* ------------- torus that slowly spins ----------------------- */
    vec3  torPos = p - vec3(3.0, 0.0, 4.0);
    torPos.xz    = rot2(u_time*0.4) * torPos.xz;
    float dough  = torus(torPos, vec2(1.2, 0.35));

    /* ------------- tiled boxes for background -------------------- */
    // vec3  rep    = p;
    // rep.xz = mod(rep.xz, 10.0) - 2.0;           // repeat every 4 units
    float cubes  = box(p - vec3(0.0, -0.25, 0.0), vec3(0.5));

    /* ------------- combine --------------------------------------- */
    return min(min(floorY, ball),
               min(dough, cubes));
}

vec3 calcNormal(vec3 p){
    vec2 h = vec2(EPSILON,0.);
    return normalize(vec3(
        sdf(p+h.xyy) - sdf(p-h.xyy),
        sdf(p+h.yxy) - sdf(p-h.yxy),
        sdf(p+h.yyx) - sdf(p-h.yyx)
    ));
}

Line makeCamera(mat3 b, float t){
    vec3 pos = vec3( 5.0 * sin(t*0.5),
                     0.7 * sin(t*0.3) + 1.5,
                    -4.0 * cos(t*0.5) + 4.0 );

    Line cam = Line(vec3(0.), normalize(pos), b);
    cam = transport(cam, sqrt(dot(pos, pos)) );

    vec3 tgt = vec3( 0.0, 0.5, 10.0 ); // centre of the mirror
    cam.d = normalize(tgt - pos);

    return cam;
}


mat3 makeBasis(vec3 fwd){
    fwd = normalize(fwd);

    vec3 tmpUp = (abs(fwd.y) > 0.99)          // too close to ±Y?
               ? vec3(0.0, 0.0, 1.0)          // use Z instead
               : vec3(0.0, 1.0, 0.0);

    vec3 right = normalize(cross(tmpUp, fwd));
    vec3 up    = cross(fwd, right);           // already unit-length

    return mat3(right, up, fwd);              // columns = (x,y,z)
}

/* ------------- main ------------------ */
void main(){
    /* camera pos and dir -------------------------------------------------- */

    float fov = PI * 0.5;
    mat3 id = mat3(1.);
    vec3 fwd = normalize( uv.x * fov * 0.5 * id[0] + uv.y * fov * 0.5 * id[1] + id[2] );

    Line cam = makeCamera(makeBasis(fwd), u_time);

    cam.d = cam.b[2];
    cam.b = mat3(0.);

    /* ray-march ----------------------------------------------------------- */
    float distAcc = 0.;
    vec3  color   = vec3(0.5, 0.8, 1.);  // arbitrary start

    for(int i=0;i<MAX_ITERATIONS;++i){
        float l = sdf(cam.p);
        if(l < EPSILON){                         /* hit                      */
            vec3 n = calcNormal(cam.p);
            float lighting = max(0.05, dot(n, normalize(vec3(0.5,1.,-0.5))));
            if(cam.p.y + 1. < EPSILON) color = texture2D(u_texture, cam.p.xz).rgb;
            else color = vec3(1.);
            color *= lighting;
            break;
        }
        else if(l > 1./EPSILON){ distAcc = INF; break; }

        distAcc += l;
        cam = transport(cam,l);
    }

    // color *= max(0.5, 1. / pow(distAcc, 0.1));

    /* cheap distance fog ------------------------------------------------ */
    float fog = clamp(exp(-0.0001 * distAcc * distAcc), 0.0, 1.0);
    color = mix(vec3(0.6,0.7,0.8), color, fog);

    /* rim-light accent on silhouettes ----------------------------------- */
    vec3  viewDir = normalize(cam.d);
    float rim     = pow(1.0 - max(dot(calcNormal(cam.p), viewDir), 0.0), 3.0);
    color += 0.25 * rim;
    color = vec3(pow(color.x, 1.5), pow(color.y, 1.5), pow(color.z, 1.5));

    gl_FragColor = vec4(color,1.);
}
|]
