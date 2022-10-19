module Main exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import List


titlePage = div [ class "title-page" ] [
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

view model = div [] [
    titlePage
    ]
    


main =
    view "dummy model"