#version 300 es

precision highp float;
precision highp sampler2D;

in vec2 uv;
out vec4 out_color;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec4 u_mouse;
uniform sampler2D u_textures[16];

#define pi 3.14159265
#define epsilon 0.01
#define MAX_ITERATIONS 1000
#define INF 1.0 / 0.0

#pragma region rotate

mat2x2 rot2(vec2 v, float a){
  return mat2x2(
      cos(a), -sin(a),
      sin(a), cos(a)
    );
}

mat3x3 rot3z(float a)
{
  return mat3x3(
      cos(a), -sin(a), 0,
      sin(a), cos(a), 0,
      0, 0, 1
    );
}

mat3x3 rot3y(float a)
{
  return mat3x3(
      cos(a), 0, sin(a),
      0, 1, 0,
      -sin(a), 0, cos(a)
    );
}

mat3x3 rot3x(float a)
{
  return mat3x3(
      1, 0, 0,
      0, cos(a), -sin(a),
      0, sin(a), cos(a)
    );
}

#pragma endregion

vec2 fromPolar2(vec2 v)
{
  return vec2(cos(v.x), sin(v.x)) * v.y;
}

vec3 fromPolar3(vec3 v)
{
  return rot3y(v.x) * rot3x(v.y) * vec3(0., 0., 1.);
}


float linePlaneIntersect(mat2x3 line, mat2x3 plane)
{
    float denom = dot(line[1], plane[1]);
    if (abs(denom) < epsilon) return INF;
    return dot(plane[0] - line[0], plane[1]) / denom;
}

float linePlaneIntersect(mat2x3 line, mat3x3 plane)
{
    vec3 n = cross(plane[1], plane[2]);
    float n2 = dot(n, n);
    if (n2 < epsilon) return INF;
    n *= 1. / sqrt(n2);
    float denom = dot(line[1], n);
    if (abs(denom) < epsilon) return INF;
    float t = dot(plane[0] - line[0], n) / denom;

    vec3  P  = line[0] + line[1] * t;
    vec3  rel = P - plane[0];

    float u = dot(rel, plane[1]) / dot(plane[1], plane[1]);
    float v = dot(rel, plane[2]) / dot(plane[2], plane[2]);

    if (u < -epsilon || u > 1.0 + epsilon || v < -epsilon || v > 1.0 + epsilon) return INF;

    return t;
}

vec3 mirror(vec3 dir, vec3 normal)
{
    float len2 = dot(normal, normal);
    if (len2 < epsilon) return dir;
    return dir - 2.0 * dot(dir, normal) / len2 * normal;
}

mat2x3 transport(vec3 pos, vec3 dir, float l)
{
    mat3x3 plane = mat3x3(vec3(1., -1.0, 10.), vec3(0., 6., 0.), vec3(-2., 0., 0.));
    mat2x3 line  = mat2x3(pos, dir);

    float t = linePlaneIntersect(line, plane);

    if (t == INF || t < 0.0 || t > l)
        return mat2x3(pos + dir * l, dir);

    vec3 hitPos = pos + dir * t;
    vec3 refl   = mirror(dir, cross(plane[1], plane[2]));

    return mat2x3(hitPos + refl * (l - t), refl);
}

float sphere(vec3 p, float r)
{
  return sqrt(dot(p, p)) - r;
}

float sdf(vec3 pos)
{
  pos = pos - vec3(0., 0., 0.);
  return min( pos.y + 1.0, sphere(pos - vec3(-2., 0.9 + sin(u_time), 5.0), 1.0)) ;
}

vec3 normal(vec3 p)
{
  vec2 h = vec2(epsilon, 0.);
  return normalize( vec3(sdf(p+h.xyy) - sdf(p-h.xyy),
      sdf(p+h.yxy) - sdf(p-h.yxy),
      sdf(p+h.yyx) - sdf(p-h.yyx)));
}

#define lerp(x, y, p) (((1. - p)*x) + (p*y))

void main()
{
  vec2 mouse = u_mouse.xy / u_resolution;

  vec3 pos = vec3(0.);

  float fov = pi/2.;

  vec3 polar = vec3( lerp(-fov/2., fov/2., uv.x), lerp(-fov/2., fov/2., uv.y), 1.0 );
  vec3 dir = polar; // fromPolar3(polar);

  float dist = 0.;
  vec3 oc = vec3(dir.y);

  int i = 0;
  for (i = 0; i < MAX_ITERATIONS; i++)
  {
    float l = sdf(pos);
    if (l < epsilon)
    {
      float n = max(0.1, dot( normal(pos), normalize(vec3(0.5, 1., -0.5))));
      if (pos.y + 1. < epsilon) oc = vec3(texture(u_textures[0], vec2(pos.x, pos.z)));
      else oc = vec3(1.0);
      oc *= n;
      break;
    } else if (l > 1./epsilon) { dist = 1. / 0.; break; }
    dist += l;
    mat2x3 t = transport(pos, dir, l);
    pos = t[0];
    dir = t[1];
  }

  oc *= max(0.5, 1. / pow(dist, .1));
  out_color = vec4(oc.x, oc.y, oc.z, 1.);

  if (i == MAX_ITERATIONS) out_color = vec4(1.0, 0., 0., 0.0);
}