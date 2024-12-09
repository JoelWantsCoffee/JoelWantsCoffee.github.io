module Main exposing (main)

import Article
import Browser
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
import Url exposing (Url)



-- -------------------------------
-- BOILER PLATE
-- -------------------------------


type SubModel
    = Home Home.Model
    | Article Article.Model
    | Talk Talk.Model
    | Projects Projects.Model
    | Empty


type Msg
    = HomeMsg Home.Msg
    | ArticleMsg Article.Msg
    | TalkMsg Talk.Msg
    | ProjectsMsg Projects.Msg
    | LinkClicked Browser.UrlRequest
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

            Just _ ->
                ( Empty, Cmd.none )

            Nothing ->
                Tuple.mapBoth Home (Cmd.map HomeMsg) Home.page.init


view : Model -> Browser.Document Msg
view model =
    { title = "Joel Richardson"
    , body =
        List.singleton <|
            Html.div [ class "h-screen w-screen bg-flu-50" ] <|
                [ Html.div [ class "h-[10%]" ] [ topBar model.url.fragment ]
                , Html.div [ class "h-[90%] overflow-scroll" ] <|
                    (Html.div [ class "flex flex-col place-items-center space-y-6" ] >> List.singleton) <|
                        List.concat
                            [ [ Html.div [] [] ]
                            , case model.model of
                                Empty ->
                                    [ Html.div [ class "text-flu-600 font-bold text-2xl pt-8" ] [ Html.text "Whoops! There's nothing here." ] ]

                                Home m ->
                                    List.map (Html.map HomeMsg) (Home.page.view m)

                                Talk m ->
                                    List.map (Html.map TalkMsg) (Talk.page.view m)

                                Projects m ->
                                    List.map (Html.map ProjectsMsg) (Projects.page.view m)

                                Article m ->
                                    List.map (Html.map ArticleMsg) (Article.page.view m)
                            , [ Html.div [ class "w-full p-4 pb-8 text-flu-300 text-center" ] [ Html.text "that's it - the end." ] ]
                            ]
                ]
    }


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

        ( LinkClicked (Browser.External s), _ ) ->
            ( model, Nav.load s )

        ( LinkClicked (Browser.Internal u), _ ) ->
            ( model, Nav.load (Url.toString u) )

        ( Reset u, _ ) ->
            init u model.key

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



-- -------------------------------
-- ACTUAL STUFF
-- -------------------------------


topBar : Maybe String -> Html msg
topBar s =
    Html.div
        [ class "transition-fast w-full p-6 space-x-6 flex text-lg items-center border border-flu-300 bg-flu-0" ]
        [ Html.a [ Attr.href "", class <| ifThenElse (Nothing == s) "" "", class "cursor-pointer hover:underline font-bold" ] [ Html.text "Joel Richardson" ]
        , Html.div [ class "grow" ] []
        , Html.div [ class "w-1/3 flex space-x-6 items-center" ]
            [ Html.a [ Attr.href "#projects", class <| ifThenElse (Just "projects" == s) "font-bold" "", class "flex-1 grow text-right cursor-pointer hover:underline" ] [ Html.text "Projects" ]
            , Html.a [ Attr.href "#articles", class <| ifThenElse (Just "articles" == s) "font-bold" "", class "flex-1 grow text-center cursor-pointer hover:underline" ] [ Html.text "Articles " ]
            , Html.a [ Attr.href "#talks", class <| ifThenElse (Just "talks" == s) "font-bold" "", class "flex-1 grow text-left cursor-pointer hover:underline" ] [ Html.text "Talks" ]
            ]
        , Html.div [ class "grow" ] []
        , Html.div [ class "pointer-events-none opacity-0" ] [ Html.text "Joel Richardson____" ]

        -- , Html.div [] [ Html.text "Home" ]
        -- , Html.a [ class "cursor-pointer", Attr.href "mailto:joelwrichardson01@gmail.com" ] [ Html.text "Contact" ]
        ]
