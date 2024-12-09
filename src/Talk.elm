module Talk exposing (Model, Msg, page)

import Common exposing (..)
import Html exposing (Html)
import Html.Events as Html



-- TALKS


berlekamp : Html Msg
berlekamp =
    Html.div [] [ md """
## Finding factors in Berlekamp's Algebra (April 2024)
I gave this talk at the UQ Mathematics Student Society - it's about Berlekamp's factoring algorithm. I'm pretty happy with how it turned out. The slides are available [here](https://uqmss.org/assets/slides/2024/wk9_joel_richardson.pdf).
""" ]


ssets : Html Msg
ssets =
    Html.div [] [ md """
## Simplicial Sets, Simply (August 2024)
I gave this talk at the UQ Mathematics Student Society too - it's about delta sets. In retrospect, I should have refrained from using any category theory words - they were confusing to many and useful to no one. I'm quite happy with the pictures though. [These](https://uqmss.org/assets/slides/2024/wk4_joel_richardson.pdf) are the slides.
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
    List.map (Html.map (Maybe.withDefault ()) << article Nothing) [ berlekamp, ssets ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    case msg of
        () ->
            ( (), Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
