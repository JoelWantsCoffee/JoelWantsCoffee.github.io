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


type alias Metadata =
    { name : String, path : Path, download_url : Maybe String }


type File
    = Folder Bool (List Metadata)
    | Markdown String
    | Pdf


type alias Model =
    { flags : Flags, selected : Maybe Path, data : Dict Path ( Metadata, File ), loading : Int }


type Msg
    = Select Metadata
    | FileGet Metadata (Result Http.Error File)


file : Metadata -> D.Decoder File
file m =
    if Nothing == m.download_url then
        folder

    else
        case List.last (String.split "." m.path) of
            Just "md" ->
                markdown

            Just "pdf" ->
                pdf

            _ ->
                D.fail "Unknown file type."


metadata : D.Decoder Metadata
metadata =
    D.map3 Metadata
        (D.field "name" D.string)
        (D.field "path" D.string)
        (D.field "download_url" (D.nullable D.string))


folder : D.Decoder File
folder =
    D.map (Folder False) (D.list metadata)


markdown : D.Decoder File
markdown =
    D.map Markdown D.string


pdf : D.Decoder File
pdf =
    D.map (\_ -> Pdf) D.string



-- ACTUAL CODE


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


clean : File -> File
clean f =
    case f of
        Markdown str ->
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
                |> Markdown

        a ->
            a


view : Model -> List (Html Msg)
view m =
    [ Html.div [ class "w-full h-full flex academic" ]
        [ Html.div
            [ class "top-0 left-0 p-8 flex flex-col gap-2 select-none w-1/5 h-full" ]
            (Html.a [ class "w-[0px] text-3xl times-new-roman pb-4 cursor-pointer hover:underline", Attr.href "/" ] [ Html.text "Joel Richardson" ]
                :: List.map (Tuple.second >> Tuple.first >> sidebarItem m) (Dict.toList m.data)
            )
        , Html.div [ class "h-full w-4/5 overflow-y-scroll overflow-x-clip" ]
            [ Html.div [ class "pr-16 py-16" ]
                [ case Maybe.andThen (flip Dict.get m.data) m.selected of
                    Just ( meta, Pdf ) ->
                        Html.iframe [ Attr.src (Maybe.withDefault "" meta.download_url), class "w-full h-full" ] []

                    Just ( meta, Markdown str ) ->
                        md_ ("# " ++ meta.name ++ "\n" ++ str)

                    Just ( _, Folder _ _ ) ->
                        md_ "# Oops! We don't display folders."

                    Nothing ->
                        md_ <| "# Oops! This file doesn't exist!\n" ++ String.join "\n" (Dict.keys m.data)
                ]
            ]
        ]
    ]


sidebarFile : Model -> Metadata -> Html Msg
sidebarFile m m2 =
    Html.div [ class <| "font-light " ++ ifThenElse (m.selected == Just m2.path) "text-flu-800" "text-flu-400 hover:underline cursor-pointer", onClick (Select m2) ] [ Html.text m2.name ]


sidebarItem : Model -> Metadata -> Html Msg
sidebarItem m meta =
    case Dict.get meta.path m.data of
        Just ( _, Folder True lst ) ->
            sidebarFolder m meta lst

        _ ->
            sidebarFile m meta


sidebarFolder : Model -> Metadata -> List Metadata -> Html Msg
sidebarFolder m m_ lst =
    Html.div []
        [ Html.div [ class "font-light text-flu-400 cursor-pointer" ] [ Html.text m_.name ]
        , Html.div [ class "pl-1 w-full" ] (List.map (sidebarItem m) lst)
        ]


load : Flags -> Metadata -> Cmd Msg
load f m =
    case m.download_url of
        Just url ->
            Http.get { url = url, expect = Http.expectString (Result.map Markdown >> FileGet m) }

        Nothing ->
            Http.get { url = f.url ++ m.path, expect = Http.expectJson (FileGet m) (file m) }


init : Flags -> ( Model, Cmd Msg )
init f =
    ( Model f Nothing Dict.empty 1, load f (Metadata "/" "" Nothing) )


page : Page Model Msg
page =
    { init = init { url = "https://api.github.com/repos/JoelWantsCoffee/PhD-Notes/contents/" }
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


toggleFolder : Path -> Model -> Model
toggleFolder p m =
    case Dict.get p m.data of
        Just ( meta, Folder b lst ) ->
            { m | data = Dict.insert meta.path ( meta, Folder (not b) lst ) m.data }

        _ ->
            m


update : Msg -> Model -> ( Model, Cmd Msg )
update msg m =
    Tuple.mapSecond (\l -> Cmd.batch [ render {}, l ]) <|
        case msg of
            Select meta ->
                let
                    m_ =
                        case meta.download_url of
                            Just _ ->
                                { m | selected = Just meta.path }

                            Nothing ->
                                toggleFolder meta.path m
                in
                if Dict.member meta.path m.data then
                    ( m_, Cmd.none )

                else
                    ( { m_ | loading = m_.loading + 1 }, load m_.flags meta )

            FileGet meta res ->
                case res of
                    Result.Ok f ->
                        ( { m | loading = m.loading - 1, data = Dict.insert meta.path ( meta, clean f ) m.data }, Cmd.none )

                    Result.Err _ ->
                        ( { m | loading = m.loading - 1, data = Dict.remove meta.path m.data }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
