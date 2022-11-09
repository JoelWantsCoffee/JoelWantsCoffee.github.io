module Main exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import List


titlePage = div [ class "title-page" ] [
    img [ src "assets/design.svg" ] [],
    p [ class "title" ] [ text "Joel"], 
    div [ class "subtitle" ]
            (List.map (\a -> 
                div [ 
                        style "display" "flex", 
                        style "flex-direction" "row"
                    ] <| List.map (\(x, y) -> p [ style "font-weight" x ] [ text y]) a)
            [
                [ ("500", "Mathematics"), ("200", "&") ],
                [ ("500", "Computer Science")] ,
                [ ("300", "student") ]
            ])
    ]

topBar = div [ class "bar" ] <|
        List.map ( div [ class "head-button" ] ) [
            [ text "about" ],
            [ text "home" ],
            [ text "contact" ]
        ]

scrollDown = div [ class "bar" ] [ 
    div [ 
            style "display" "flex", 
            style "flex-direction" "column",
            style "align-items" "center"
        ] [
            div [ style "marginBottom" "10px" ] [text "scroll down"], 
            div [ class "scroll" ] [ ]
        ]
 ]

pannel = div [ class "pannel" ] [ text "chese" ]

view model = div [ class "whole-page" ] [
        topBar,
        titlePage,
        scrollDown,
        pannel
    ]
    


main =
    view "dummy model"