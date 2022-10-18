module Main exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)


view model =
    div [ class "jumbotron" ]
        [ h1 [] [ text "Joel Richardson" ]
        , p [] [ text "was here" ]
        ]


main =
    view "dummy model"