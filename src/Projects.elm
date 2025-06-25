module Projects exposing (Model, Msg, page)

import Browser.Events exposing (onAnimationFrameDelta, onKeyDown, onKeyUp)
import Common exposing (..)
import Embed.Youtube
import Embed.Youtube.Attributes
import GLSL
import Html exposing (Html)
import Html.Attributes exposing (class)
import Html.Events as Html
import Json.Decode as Decode
import WebGL.Texture exposing (Texture)



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
## Study Timer [[GitHub](https://github.com/JoelWantsCoffee/uni-timer)] [[Website](/uni-timer)]
A Pomodoro timer I cobbled together in my first year of undergrad. Somehow it seems to have survived beyond graduation in 2022. The background—artfully drawn in Microsoft Paint—captures the atmosphere of Room 102, Building 31A during SWOTVAC, Semester 2, 2019 at UQ.
""" ]


minecraft : Html Msg
minecraft =
    Html.div []
        [ md """
## Programmable Minecraft Computer
""" ]


wordle : Html Msg
wordle =
    Html.div []
        [ md """
## Optimal Wordle
""" ]


software : Html Msg
software =
    Html.div []
        [ md """
## Software Renderer
""" ]


learning : Html Msg
learning =
    Html.div []
        [ md """
## Neural Network Image Generation
""" ]


euclidean : Model -> Html Msg
euclidean m =
    Html.div []
        [ md """
## Noneuclidean Rendering
"""
        , Maybe.map (GLSL.view <| m.time / 1000) m.texture
            |> Maybe.map (\scene -> scene [ class "rounded-md border border-flu-300 overflow-clip aspect-square w-64 mx-auto bg-flu-100" ])
            |> Maybe.withDefault (Html.text "")
        ]


fluid : Html Msg
fluid =
    Html.div []
        [ md """
## High Performance Fluid Simulation [[GitHub](https://github.com/JoelWantsCoffee/fluid-sim)]
A fluid sim coded in C, complete with `CUDA` and `AVX` optimizations. I built this for the (excellent!) *COSC3500: High-Performance Computing* course at UQ. Here's a project reflection video.
"""
        , Embed.Youtube.fromString "-RVnkuJ1Oao"
            |> Embed.Youtube.attributes
                [ Embed.Youtube.Attributes.width 480
                , Embed.Youtube.Attributes.height 270
                ]
            |> Embed.Youtube.toHtml
            |> (\x -> Html.div [ class "w-full flex" ] [ Html.div [ class "grow" ] [], Html.div [ class "rounded-md border border-flu-300 overflow-clip bg-flu-100" ] [ x ], Html.div [ class "grow" ] [] ])
        ]



-- ACTUAL CODE


view : Model -> List (Html Msg)
view m =
    List.map bubble
        [ hpolys
        , sotrue
        , fluid
        , euclidean m
        , wordle
        , learning
        , minecraft
        , software
        , timer
        ]


type alias Keys =
    { w : Bool, a : Bool, s : Bool, d : Bool }


keys : Keys
keys =
    { w = False, a = False, s = False, d = False }


type alias Model =
    { texture : Maybe Texture, time : Float, keys : Keys }


type Msg
    = SetTexture (Maybe Texture)
    | SetKeys Keys
    | TimeChange Float


init : ( Model, Cmd Msg )
init =
    ( { texture = Nothing, time = 0.0, keys = keys }, Cmd.map SetTexture GLSL.load )


page : Page Model Msg
page =
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg m =
    case msg of
        SetTexture t ->
            ( { m | texture = t }, Cmd.none )

        SetKeys k ->
            ( { m | keys = k }, Cmd.none )

        TimeChange t ->
            ( { m | time = m.time + t }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    onAnimationFrameDelta TimeChange
