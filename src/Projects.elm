module Projects exposing (Model, Msg, page)

import Common exposing (..)
import Embed.Youtube
import Embed.Youtube.Attributes
import Html exposing (Html)
import Html.Attributes exposing (class)
import Html.Events as Html



-- PROJECTS


hpolys : Html Msg
hpolys =
    Html.div []
        [ md """
## Haskell Polynomial Factoring [[GitHub](https://github.com/JoelWantsCoffee/Haskell-Polynomials)]
My honours thesis project - polynomial factoring in Haskell. The project includes all of the computer-algebra pieces needed to factor polynomials over the integers and finite fields, all built from the ground up.
""" ]


timer : Html Msg
timer =
    Html.div []
        [ md """
## Distressed Study Timer [[GitHub](https://github.com/JoelWantsCoffee/uni-timer)] [[Website](/uni-timer)]
This is a pomodoro study timer that I coded up during the first year of my undergrad. Somehow, it's continued to find use ever after my graduation in 2022. The background (drawn in microsoft paint) attempts to capture the atmosphere present in Room 102 of the UQ Social Sciences Annexe (Building 31A) during the SWOTVAC of Semester 2, 2019. 
""" ]


fluid : Html Msg
fluid =
    Html.div []
        [ md """
## 2D Fluid Simultion [[GitHub](https://github.com/JoelWantsCoffee/fluid-sim)]
A fluid sim written in C, with `CUDA` and `AVX` implementations. I built this a for the (excellent) course *High-Performance Computing (COSC3500)* at the University of Queensland. Here's a project reflection video I submitted for the course - can you tell it was recorded in the throws of covid? 
"""
        , Embed.Youtube.fromString "-RVnkuJ1Oao"
            |> Embed.Youtube.attributes
                [ Embed.Youtube.Attributes.width 480
                , Embed.Youtube.Attributes.height 270
                ]
            |> Embed.Youtube.toHtml
            |> (\x -> Html.div [ class "w-full flex" ] [ Html.div [ class "grow" ] [], Html.div [ class "rounded-md border border-flu-300 overflow-clip" ] [ x ], Html.div [ class "grow" ] [] ])
        ]



-- ACTUAL CODE


view : Model -> List (Html Msg)
view _ =
    List.map (Html.map (Maybe.withDefault ()) << bubble) [ hpolys, timer, fluid ]


type alias Model =
    ()


type alias Msg =
    ()


init : ( Model, Cmd Msg )
init =
    ( (), Cmd.none )


page : Page Model Msg
page =
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    case msg of
        () ->
            ( (), Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
