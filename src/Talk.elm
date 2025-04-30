module Talk exposing (Model, Msg, page)

import Common exposing (..)
import Html exposing (Html)
import Html.Events as Html



-- TALKS


algebras : Html Msg
algebras =
    Html.div [] [ md """
## Algebras of the Tangent Bundle Monad (April 2025) [[Link](https://centre-of-australian-category-theory.github.io/seminar/talks/1854)] [[Slides](/data/1854slides.pdf)]
My first talk for the Australian Category Seminar. This talk introduces my MRes project, focusing on algebras of the tangent bundle monad in the category of affine schemes.
""" ]


ssets : Html Msg
ssets =
    Html.div [] [ md """
## Simplicial Sets, Simply (August 2024) [[Slides](https://uqmss.org/assets/slides/2024/wk4_joel_richardson.pdf)]
My second talk for the UQ Mathematics Student Society, introducing delta sets. In hindsight, I probably should have avoided category-theoretic terminology—it confused more than it clarified. Still, I'm very pleased with how the visuals turned out.
""" ]


berlekamp : Html Msg
berlekamp =
    Html.div [] [ md """
## Finding Factors in Berlekamp's Algebra (April 2024) [[Slides](https://uqmss.org/assets/slides/2024/wk9_joel_richardson.pdf)]
My first talk for the UQ Mathematics Student Society, exploring Berlekamp's factoring algorithm. Overall, I'm quite happy with the result.
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
