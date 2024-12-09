port module Common exposing (..)

import Html exposing (Html)
import Html.Attributes exposing (class)
import Html.Events as Html
import Markdown


type alias Page model msg =
    { view : model -> List (Html msg)
    , update : msg -> model -> ( model, Cmd msg )
    , init : ( model, Cmd msg )
    , subscriptions : model -> Sub msg
    }


md : String -> Html msg
md x =
    Markdown.toHtml
        [ class "content" ]
        x


mdCodeLike : String -> Html msg
mdCodeLike x =
    Markdown.toHtml
        [ class "content_codelike" ]
        x


article : Maybe Bool -> Html msg -> Html (Maybe msg)
article open art =
    case open of
        Nothing ->
            Html.div [ class "w-3/4 mb-12 p-4 border border-flu-300 bg-flu-0 rounded-lg" ] [ Html.map Just art ]

        Just o ->
            Html.div [ class <| "w-3/4 mb-12 p-4 border border-flu-300 bg-flu-0 rounded-lg relative " ++ ifThenElse o "h-auto" "h-16 overflow-y-clip" ]
                [ Html.div
                    [ class "absolute m-4 top-[-1px] right-0 h-8 w-8 rounded-full border border-flu-300 grid place-items-center font-light text-flu-600 transition-all hover:bg-flu-50 cursor-pointer"
                    , Html.onClick Nothing
                    ]
                    [ Html.div [ class "-translate-y-px pointer-events-none" ] [ Html.text <| ifThenElse o "-" "+" ] ]
                , Html.map Just art
                ]


ifThenElse c a b =
    if c then
        a

    else
        b


port render : {} -> Cmd msg
