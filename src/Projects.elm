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
## Polynomial Factoring in Haskell [[GitHub](https://github.com/JoelWantsCoffee/Haskell-Polynomials)]
My Honours thesis project, a haskell program to factor polynomials. All built and verified from the ground up.
""" ]


sotrue : Html Msg
sotrue =
    Html.div []
        [ md """
## So True! — A Theorem Verifier [[GitHub](https://github.com/mitchellholt/DisneyMusicVEVO-Z-O-M-B-I-E-S-Someday)]
[Mitchell](https://mitchellholt.github.io/) and I hacked this together at the 2022 UQ Computing Society Hackathon. In theory, it can verify proofs in first-order logic. In practice, it's hanging by a thread—it was a fun project.
""" ]


timer : Html Msg
timer =
    Html.div []
        [ md """
## Distressed Study Timer [[GitHub](https://github.com/JoelWantsCoffee/uni-timer)] [[Website](/uni-timer)]
A Pomodoro timer I cobbled together in my first year of undergrad. Somehow it seems to have survived beyond graduation in 2022. The background—artfully drawn in Microsoft Paint—captures the atmosphere of Room 102, Building 31A during SWOTVAC, Semester 2, 2019 at UQ.
""" ]


fluid : Html Msg
fluid =
    Html.div []
        [ md """
## 2D Fluid Simulation [[GitHub](https://github.com/JoelWantsCoffee/fluid-sim)]
A fluid sim coded in C, complete with `CUDA` and `AVX` optimizations. I built this for the (excellent!) *COSC3500: High-Performance Computing* course at UQ. Here's a project reflection video.
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
    List.map (Html.map (Maybe.withDefault ()) << bubble) [ hpolys, sotrue, timer, fluid ]


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
