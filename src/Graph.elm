module Graph exposing (view)

import Dict
import Html exposing (Html)
import Html.Attributes as Html
import Math.Vector2 exposing (Vec2)
import Svg exposing (..)
import Svg.Attributes as Att exposing (..)


fromTuple ( x, y ) =
    Math.Vector2.fromRecord { x = x, y = y }


toTuple v =
    Math.Vector2.toRecord v |> (\{ x, y } -> ( x, y ))


type alias Box =
    { w : ( Float, Float ), h : ( Float, Float ) }


type alias Graph comparable msg =
    { nodes : List comparable
    , edges : List ( comparable, comparable )
    , bbox : Box
    , view : comparable -> ( Html msg, ( Float, Float ) )
    }


view : Graph comparable msg -> Html msg
view g =
    let
        nodes =
            List.map (\n -> ( n, g.view n )) g.nodes |> Dict.fromList

        edges =
            (\f -> List.map (Tuple.mapBoth f f))
                (flip Dict.get nodes >> Maybe.map Tuple.second >> Maybe.withDefault ( 0.5, 0.5 ))
                g.edges
    in
    svg
        [ width "100%", height "100%", preserveAspectRatio "xMidYMid slice", viewBox <| xpos g.bbox 0 ++ " " ++ ypos g.bbox 0 ++ " " ++ xpos g.bbox 1 ++ " " ++ ypos g.bbox 1 ]
    <|
        List.concat
            [ edges
                |> List.map
                    (\( p1, p2 ) ->
                        arrowBetweenPoints g.bbox -0.6 p1 p2
                    )
            , [ arrowheadMarker ]
            , Dict.values nodes
                |> List.concatMap
                    (\( h, ( px, py ) ) ->
                        [ circle
                            [ cx <| xpos g.bbox px
                            , cy <| ypos g.bbox py
                            , overflow "visible"
                            , fill "white"
                            , r "10"
                            ]
                            []
                        , foreignObject
                            [ overflow "visible"
                            , x <| xpos g.bbox px
                            , y <| ypos g.bbox py
                            ]
                            [ Html.div [ Html.class "overflow-visible grid place-items-center w-[25px] h-[25px] -translate-y-1/2 -translate-x-1/2" ] [ h ] ]
                        ]
                    )
            ]


lerppos : ( Float, Float ) -> Float -> Float
lerppos ( bot, top ) v =
    bot + (top - bot) * v


xpos : Box -> Float -> String
xpos { w, h } a =
    String.fromInt (round (lerppos w a))


ypos : Box -> Float -> String
ypos { w, h } a =
    String.fromInt (round (lerppos h a))


arrowBetweenPoints : Box -> Float -> ( Float, Float ) -> ( Float, Float ) -> Svg msg
arrowBetweenPoints b s ( x1, y1 ) ( x2, y2 ) =
    let
        start =
            fromTuple ( x1, y1 )

        end =
            fromTuple ( x2, y2 )

        makeNormal start_ end_ =
            Math.Vector2.normalize (Math.Vector2.sub end_ start_) |> toTuple |> (\( x, y ) -> ( -y, x )) |> fromTuple

        normal =
            makeNormal start end

        length =
            Math.Vector2.distance start end

        midpoint start_ end_ =
            Math.Vector2.scale 0.5 (Math.Vector2.add start_ end_)

        curvemidpoint =
            Math.Vector2.add (midpoint start end) (Math.Vector2.scale (0.5 * s * length) normal)

        control start_ end_ =
            toTuple (Math.Vector2.add (midpoint start_ end_) (Math.Vector2.scale (s * Math.Vector2.distance start_ end_ / 2) (makeNormal start_ end_)))
    in
    g []
        [ Svg.path
            [ d <| describePath b s start curvemidpoint (control start curvemidpoint)
            , fill "none"
            , stroke "black"
            , strokeWidth "2"
            , markerEnd "url(#arrow)"
            ]
            []
        , Svg.path
            [ d <| describePath b s curvemidpoint end (control curvemidpoint end)
            , fill "none"
            , stroke "black"
            , strokeWidth "2"
            ]
            []
        ]


describePath : Box -> Float -> Vec2 -> Vec2 -> ( Float, Float ) -> String
describePath b s start end control =
    if s == 0 then
        "M" ++ toStringTuple b (toTuple start) ++ " L" ++ toStringTuple b (toTuple end)

    else
        "M" ++ toStringTuple b (toTuple start) ++ " Q" ++ toStringTuple b control ++ " " ++ toStringTuple b (toTuple end)


toStringTuple : Box -> ( Float, Float ) -> String
toStringTuple b ( x, y ) =
    xpos b x ++ " " ++ ypos b y


arrowheadMarker : Svg msg
arrowheadMarker =
    defs []
        [ marker
            [ id "arrow"
            , viewBox "0 0 15 15"
            , refX "5"
            , refY "5"
            , markerWidth "6"
            , markerHeight "6"
            , orient "auto-start-reverse"
            ]
            [ Svg.path [ d "M 0 0 L 10 5 L 0 10 z", fill "black" ] [] ]
        ]


flip : (a -> b -> c) -> (b -> a -> c)
flip f b a =
    f a b
