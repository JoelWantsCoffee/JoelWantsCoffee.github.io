module Talk exposing (Model, Msg, page)

import Common exposing (..)
import Html exposing (Html)
import Html.Events as Html



-- TALKS


algebras : Html Msg
algebras =
    Html.div [] [ md """
## Thinking about the algebras of tangent bundle monad (April 2025) [[Link](https://centre-of-australian-category-theory.github.io/seminar/talks/1854)] [[Slides](/data/1854slides.pdf)]
My first talk for the australian category seminar - it's an intro to my MRes project, which is all about the algebras of tangent bundle monad in the category of affine schemes.
""" ]


ssets : Html Msg
ssets =
    Html.div [] [ md """
## Simplicial Sets, Simply (August 2024) [[Slides](https://uqmss.org/assets/slides/2024/wk4_joel_richardson.pdf)]
My second talk for the UQ Mathematics Student Society - it's about delta sets. In retrospect, I should have refrained from using any category theory words. I think they were confusing to many and useful to no one. I'm quite happy with the pictures though.
""" ]


berlekamp : Html Msg
berlekamp =
    Html.div [] [ md """
## Finding factors in Berlekamp's Algebra (April 2024) [[Slides](https://uqmss.org/assets/slides/2024/wk9_joel_richardson.pdf)]
My first talk for the UQ Mathematics Student Society - it's about Berlekamp's factoring algorithm. I'm pretty happy with how it turned out.
""" ]



-- ACTUAL CODE


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


view : Model -> List (Html Msg)
view _ =
    List.map (Html.map (Maybe.withDefault ()) << bubble) [ algebras, ssets, berlekamp ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    case msg of
        () ->
            ( (), Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
