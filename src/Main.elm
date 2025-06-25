module Main exposing (main)

import Article
import Browser
import Browser.Dom as Dom
import Browser.Navigation as Nav
import Common exposing (..)
import Home
import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Html.Events as Html
import List
import List.Extra as List
import Projects
import Talk
import Task
import Url exposing (Url)
import Words



-- -------------------------------
-- BOILER PLATE
-- -------------------------------


type SubModel
    = Home Home.Model
    | Article Article.Model
    | Talk Talk.Model
    | Projects Projects.Model
    | Words Words.Model
    | Empty


type Msg
    = HomeMsg Home.Msg
    | ArticleMsg Article.Msg
    | TalkMsg Talk.Msg
    | ProjectsMsg Projects.Msg
    | WordsMsg Words.Msg
    | LinkClicked Browser.UrlRequest
    | NoOp
    | Reset Url.Url


type alias Model =
    { key : Nav.Key
    , url : Url.Url
    , model : SubModel
    }


setSubModel : Model -> (a -> SubModel) -> a -> Model
setSubModel m f s =
    { m | model = f s }


type alias Flags =
    {}


main : Program Flags Model Msg
main =
    Browser.application
        { init = \_ -> init
        , view = view
        , update = update
        , subscriptions = subscriptions
        , onUrlRequest = LinkClicked
        , onUrlChange = Reset
        }


init : Url -> Nav.Key -> ( Model, Cmd Msg )
init url key =
    Tuple.mapFirst (Model key url) <|
        case url.fragment of
            Just "articles" ->
                Tuple.mapBoth Article (Cmd.map ArticleMsg) Article.page.init

            Just "talks" ->
                Tuple.mapBoth Talk (Cmd.map TalkMsg) Talk.page.init

            Just "projects" ->
                Tuple.mapBoth Projects (Cmd.map ProjectsMsg) Projects.page.init

            Just "words" ->
                Tuple.mapBoth Words (Cmd.map WordsMsg) Words.page.init

            Just "cv" ->
                Tuple.mapBoth Home (Cmd.map HomeMsg) Home.page.init
                    |> Tuple.mapSecond
                        (\cmd ->
                            Cmd.batch
                                [ cmd
                                , Dom.getViewportOf "main"
                                    |> Task.andThen
                                        (\vp ->
                                            if vp.viewport.height > vp.viewport.y then
                                                Dom.setViewportOf "main" 0 vp.viewport.height

                                            else
                                                Task.succeed ()
                                        )
                                    |> Task.attempt (\_ -> NoOp)
                                , Nav.pushUrl key (Url.toString { url | fragment = Nothing })
                                ]
                        )

            Just _ ->
                ( Empty, Cmd.none )

            Nothing ->
                Tuple.mapBoth Home (Cmd.map HomeMsg) Home.page.init


view : Model -> Browser.Document Msg
view model =
    { title = "Joel Richardson"
    , body =
        List.singleton <|
            Html.div [ class "h-screen w-screen p-3" ] [ viewInner model ]
    }


viewInner : Model -> Html Msg
viewInner model =
    case model.model of
        Empty ->
            academic model <| [ Html.div [ class "text-flu-600 font-bold text-2xl pt-8" ] [ Html.text "Whoops! There's nothing here." ] ]

        Home m ->
            home model <| List.map (Html.map HomeMsg) (Home.page.view m)

        Talk m ->
            academic model <| List.map (Html.map TalkMsg) (Talk.page.view m)

        Projects m ->
            academic model <| List.map (Html.map ProjectsMsg) (Projects.page.view m)

        Article m ->
            academic model <| List.map (Html.map ArticleMsg) (Article.page.view m)

        Words m ->
            creative <| List.map (Html.map WordsMsg) (Words.page.view m)


academic : Model -> List (Html Msg) -> Html Msg
academic model contents =
    Html.div [ class "academic w-full h-full bg-flu-50" ]
        [ Html.div [ class "h-[9.1%] w-full bg-flu-0" ] [ topBar model.url.fragment ]
        , Html.div [ class "h-[1px] bg-flu-200" ] []
        , Html.div [ class "h-[90.9%] w-full overflow-scroll" ] <|
            (Html.div [ class "flex flex-col place-items-center space-y-6" ] >> List.singleton) <|
                List.concat
                    [ [ Html.div [] [] ]
                    , contents
                    , [ Html.div [ class "w-full p-4 pb-8 text-flu-300 text-center" ] [ Html.text "that's it - the end." ] ]
                    ]
        ]


home : Model -> List (Html Msg) -> Html Msg
home model contents =
    Html.div [ class "home w-full h-full bg-flu-0" ]
        [ Html.div [ class "h-full w-full overflow-scroll", Attr.id "main" ] <|
            (Html.div [ class "flex flex-col place-items-center space-y-6" ] >> List.singleton) <|
                List.concat
                    [ [ Html.div [ class "w-full" ] [ topBar model.url.fragment ] ]
                    , contents
                    , [ Html.div [ class "w-full p-4 pb-8 text-flu-300 text-center" ] [ Html.text "that's it - the end." ] ]
                    ]
        ]


creative : List (Html Msg) -> Html Msg
creative contents =
    Html.div [ class "creative w-full h-full bg-flu-50 overflow-clip" ] contents


update : Msg -> Model -> ( Model, Cmd Msg )
update message model =
    case ( message, model.model ) of
        ( HomeMsg msg, Home m ) ->
            Tuple.mapBoth (setSubModel model Home) (Cmd.map HomeMsg) (Home.page.update msg m)

        ( TalkMsg msg, Talk m ) ->
            Tuple.mapBoth (setSubModel model Talk) (Cmd.map TalkMsg) (Talk.page.update msg m)

        ( ProjectsMsg msg, Projects m ) ->
            Tuple.mapBoth (setSubModel model Projects) (Cmd.map ProjectsMsg) (Projects.page.update msg m)

        ( ArticleMsg msg, Article m ) ->
            Tuple.mapBoth (setSubModel model Article) (Cmd.map ArticleMsg) (Article.page.update msg m)

        ( WordsMsg msg, Words m ) ->
            Tuple.mapBoth (setSubModel model Words) (Cmd.map WordsMsg) (Words.page.update msg m)

        ( LinkClicked (Browser.External s), _ ) ->
            ( model, Nav.load s )

        ( LinkClicked (Browser.Internal u), _ ) ->
            ( model, Nav.load (Url.toString u) )

        ( Reset u, _ ) ->
            init u model.key

        ( NoOp, _ ) ->
            ( model, Cmd.none )

        _ ->
            update (Reset model.url) model


subscriptions : Model -> Sub Msg
subscriptions model =
    case model.model of
        Empty ->
            Sub.none

        Home m ->
            Sub.map HomeMsg (Home.page.subscriptions m)

        Article m ->
            Sub.map ArticleMsg (Article.page.subscriptions m)

        Talk m ->
            Sub.map TalkMsg (Talk.page.subscriptions m)

        Projects m ->
            Sub.map ProjectsMsg (Projects.page.subscriptions m)

        Words m ->
            Sub.map WordsMsg (Words.page.subscriptions m)



-- -------------------------------
-- ACTUAL STUFF
-- -------------------------------


topBar : Maybe String -> Html msg
topBar s =
    Html.div
        [ class "transition-fast w-full text-md flex flex-row p-3" ]
        [ Html.div [ class "p-3 space-x-2 flex flex-row w-auto" ] [ Html.a [ class "font-bold cursor-pointer select-none", Attr.href "" ] [ Html.text "Joel Richardson" ], Html.div [] [ Html.text "Mathematics HDR Student" ] ]
        , Html.div [ class "grow" ] []
        , Html.div [ class "p-3 space-x-3 flex flex-row font-bold" ]
            [ Html.a [ Attr.href (ifThenElse (Nothing == s) "#cv" ""), class "hover:underline" ] [ Html.text "CV" ]
            , Html.a [ Attr.href "#projects", class <| ifThenElse (Just "projects" == s) "underline" "hover:underline" ] [ Html.text "Research & Projects" ]
            , Html.a [ Attr.href "#articles", class <| ifThenElse (Just "articles" == s) "underline" "hover:underline" ] [ Html.text "Articles" ]
            ]
        ]



-- Html.div
--     [ class "transition-fast w-full p-3 space-x-6 flex text-lg items-center border border-flu-300 bg-flu-0" ]
--     [ Html.a [ Attr.href "", class <| ifThenElse (Nothing == s) "" "", class "cursor-pointer hover:underline font-bold" ] [ Html.text "Joel Richardson" ]
--     , Html.div [ class "grow" ] []
--     , Html.div [ class "w-1/3 flex space-x-6 items-center" ]
--         [ Html.a [ Attr.href "#projects", class <| ifThenElse (Just "projects" == s) "font-bold" "hover:underline", class "flex-1 grow text-right" ] [ Html.text "Projects" ]
--         , Html.a [ Attr.href "#talks", class <| ifThenElse (Just "talks" == s) "font-bold" "hover:underline", class "flex-1 grow text-center" ] [ Html.text "Talks" ]
--         , Html.a [ Attr.href "#articles", class <| ifThenElse (Just "articles" == s) "font-bold" "hover:underline", class "flex-1 grow text-left" ] [ Html.text "Articles " ]
--         ]
--     , Html.div [ class "grow" ] []
--     , Html.div [ class "pointer-events-none opacity-0" ] [ Html.text "Joel Richardson____" ]
--     -- , Html.div [] [ Html.text "Home" ]
--     -- , Html.a [ class "cursor-pointer", Attr.href "mailto:joelwrichardson01@gmail.com" ] [ Html.text "Contact" ]
--     ]
