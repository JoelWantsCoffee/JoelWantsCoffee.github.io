module Home exposing (Model, Msg, page)

import Common exposing (..)
import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Html.Events as Html


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
    [ Html.map (Maybe.withDefault ()) <| article Nothing about ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    case msg of
        () ->
            ( (), Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


about : Html msg
about =
    Html.div [ class "space-x-6 flex" ]
        [ Html.div [ class "flex-auto flex flex-col" ]
            [ md
                """
# About Me

**Hi, I'm Joel.** Here's a few things I've been up to recently:
"""
            , mdCodeLike """
*2025* Studying an **MRes. in Mathematics** at Macquarie University
- Thesis project in category theory

*2024* Completed a **B. Computer Science (honours)** at UQ
- Thesis project in computer algebra
- Received first class honours

*2024* **Tutoring mathematics** at the University of Queensland (UQ)

*2023* **Software Engineering** at Veitch Lister Consulting
- Built type systems and programming languages

*2022* Completed a dual **B. Mathematics / B. Computer Science** at UQ
"""
            , Html.div [ class "mt-3" ] [ Html.text "I also like to sing, draw, and write. A copy of my full cv is available ", Html.a [ Attr.href "./Joel_Richardson_website_cv.pdf", class "italic underline" ] [ Html.text "here" ], Html.text "." ]
            ]
        , Html.div [ class "flex-none w-1/3" ] [ Html.img [ Attr.src "pfp.jpg", class "w-full h-full rounded-lg border border-flu-300 object-cover object-left" ] [] ]
        ]
