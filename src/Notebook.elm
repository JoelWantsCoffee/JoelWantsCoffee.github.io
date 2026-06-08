module Notebook exposing (Model, Msg, page)

import Common exposing (..)
import Dict exposing (Dict)
import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Html.Events exposing (onClick)
import Http
import Json.Decode as D
import List
import List.Extra as List


type alias Flags =
    { url : String }


type alias Path =
    String


type alias Unloaded_ =
    { name : String, path : String, download_url : Maybe String }


type File
    = Unloaded Unloaded_
    | Folder (List ( String, File ))
    | Markdown String
    | Pdf String


type alias Model =
    { selected : Maybe Path, notes : Dict Path File }


type Msg
    = Select Path
    | FileGet Path (Result Http.Error File)


file : D.Decoder File
file =
    D.oneOf
        [ folder
        ]


unloaded : D.Decoder Unloaded_
unloaded =
    D.map3 Unloaded_
        (D.field "name" D.string)
        (D.field "path" D.string)
        (D.field "download_url" (D.nullable D.string))


folder : D.Decoder File
folder =
    D.map Folder <|
        D.list <|
            D.map2 Tuple.pair (D.field "name" D.string) (D.map Unloaded unloaded)


markdowns : D.Decoder (Dict String String)
markdowns =
    D.list
        (D.map2 Tuple.pair
            (D.field "path" D.string)
            (D.field "download_url" (D.nullable D.string))
        )
        |> D.map
            (List.filterMap
                (\( a, b ) ->
                    ifThenElse (String.right 3 a == ".md") (Just <| String.dropRight 3 a) Nothing
                        |> Maybe.map2 (flip Tuple.pair) b
                )
            )
        |> D.map Dict.fromList



-- ACTUAL CODE


requestNote : String -> String -> Cmd Msg
requestNote name url =
    Http.get { url = url, expect = Http.expectString (FileGet name) }


mapOdd : (a -> a) -> List a -> List a
mapOdd f =
    List.indexedMap (\i -> ifThenElse (modBy 2 i == 1) f identity)


cleanMaths : String -> String
cleanMaths =
    String.split "\n"
        >> List.filterMap (String.split "%" >> List.head)
        >> String.join " "
        >> String.replace "\\def" "\\gdef"
        >> String.replace "\\" "\\\\"
        >> String.replace "_" "\\_"
        -- >> String.replace "align*" "aligned"
        >> String.replace "*" "\\*"


clean : String -> String
clean str =
    String.split "$$" str
        |> List.indexedMap
            (\i ->
                ifThenElse (modBy 2 i == 0)
                    (String.split "$"
                        >> mapOdd cleanMaths
                        >> String.join "$"
                    )
                    (cleanMaths
                        >> (++) "$$ "
                        >> flip (++) " $$"
                    )
            )
        |> String.concat


view : Model -> List (Html Msg)
view m =
    [ Html.div [ class "w-full h-full flex academic" ]
        [ Html.div
            [ class "top-0 left-0 p-8 flex flex-col gap-2 select-none w-1/5 h-full" ]
            (Html.a [ class "w-[0px] text-3xl times-new-roman pb-4 cursor-pointer hover:underline", Attr.href "/" ] [ Html.text "Joel Richardson" ]
                :: List.map (sidebarItem m) (Dict.keys m.notes)
            )
        , Html.div [ class "h-full w-4/5 overflow-y-scroll overflow-x-clip" ]
            [ Html.div [ class "pr-16 py-16" ]
                [ case Dict.get m.selected m.notes of
                    Just file ->
                        md_ ("# " ++ m.selected ++ "\n" ++ file)

                    Nothing ->
                        md_ "# Oops! Nothing here."
                ]
            ]
        ]
    ]


sidebarItem : Model -> String -> Html Msg
sidebarItem m m2 =
    Html.div [ class <| "font-light " ++ ifThenElse (m.selected == m2) "text-flu-800" "text-flu-400 hover:underline cursor-pointer", onClick (Select m2) ] [ Html.text m2 ]


init : Flags -> ( Model, Cmd Msg )
init f =
    ( Model Nothing Dict.empty, Http.get { url = f.url, expect = Http.expectJson (FileGet <| FileId f.url) markdowns } )


default : Dict String String
default =
    Dict.fromList
        [ ( "README"
          , "Hello!\n \nThese are my notes. I can't promise everything here is correct.\n \nEnjoy.\n \n \nJoel"
          )
        ]


page : Page Model Msg
page =
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg m =
    Tuple.mapSecond (\l -> Cmd.batch [ render {}, l ]) <|
        case msg of
            Select f ->
                ( { m | selected = f }, Cmd.none )

            InitGet res ->
                case res of
                    Result.Ok a ->
                        ( { m | notes = Dict.union m.notes (Dict.map (\k _ -> "# Loading: " ++ k) a) }, (Dict.values >> Cmd.batch) (Dict.map requestNote a) )

                    Result.Err _ ->
                        ( m, Cmd.none )

            FileGet name res ->
                case res of
                    Result.Ok file ->
                        ( { m | notes = Dict.insert name (clean file) m.notes }, Cmd.none )

                    Result.Err _ ->
                        ( { m | notes = Dict.remove name m.notes }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
