module Home exposing (Model, Msg, page)

import Common exposing (..)
import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Html.Events as Html
import List.Extra as List


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
    [ about, cv ]


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
    Html.div [ class "grid place-content-center py-32" ]
        [ Html.div [ class "flex flex-row space-x-6 bg-flu-0" ]
            [ Html.div [ class "flex-none w-[380px]" ] [ Html.img [ Attr.src "pfp.jpg", class "w-full aspect-square rounded-[2.5rem] object-cover object-left" ] [] ]
            , Html.div [ class "flex flex-col py-4 space-y-2 justify-center" ]
                [ Html.div [ class "text-5xl font-bold flex-col w-0 pt-2" ] [ Html.text "Joel Richardson" ]
                , Html.div [ class "text-2xl" ] [ Html.text "Mathematics HDR Student" ]
                , Html.div [ class "flex flex-row space-x-3 py-3" ] <|
                    List.map (\( l, t ) -> Html.a [ class "text-xl grid place-content-center bg-flu-200 hover:bg-flu-0 hover:border border-flu-200 w-[128px] h-[64px] rounded-full cursor-pointer select-none transition duration-150 ease-in-out", Attr.href l ] [ Html.div [ class "" ] [ Html.text t ] ])
                        [ ( "#cv", "CV" ), ( "#projects", "Projects" ) ]
                ]
            ]
        ]


cv : Html msg
cv =
    Html.section
        [ class "px-6", Attr.id "cv" ]
        [ Html.div [ class "pt-12 pb-3 px-64" ] [ me ]
        , Html.div [ class "px-64 pt-8 pb-24" ] <| List.singleton <| Html.a [ Attr.href "/Joel_Richardson_website_cv.pdf", class "bg-flu-200 cursor-pointer select-none rounded-full text-xl hover:bg-flu-0 border border-flu-200 px-6 py-3 transition duration-150 ease-in-out" ] [ Html.text "Download Full CV" ]
        , Html.div [ class "space-y-16" ] <| List.map (List.singleton >> Html.div [ class "py-12 px-64 bg-flu-200" ]) [ edu, work, talk ]
        ]


me : Html msg
me =
    md """
# About Me
I'm a Master of Research student at Macquarie University, studying category theory. Before moving to Sydney, I lived in Brisbane where I completed my undergraduate degrees at the University of Queensland and worked as Software Engineer. In my spare time I like to sing, draw, and write.
"""


edu : Html msg
edu =
    md """
# Education

**Master of Research (Mathematics)**
*Project on Monads and Tangent Categories supervised by JS Lemay*
*2025 - 2025*&ensp;Macquarie University


**Bachelor of Computer Science (Honours)**
*First class honours* ⋅ *Project on Computer Algebra supervised by Paul Vrbik*
*2023 - 2024*&ensp;The University of Queensland


**Bachelor of Mathematics / Bachelor of Computer Science**
*Majors in Pure Mathematics and Programming Languages*
*2019 - 2022*&ensp;The University of Queensland
"""


work : Html msg
work =
    md """
# Employment

**Software Engineer**&ensp;Veitch Lister Consulting
*Building Type Systems and Programming Languages*
*Nov 2022 - Feb 2024,&emsp;Sep 2024 - Jan 2025*


**Tutor**&ensp;The University of Queensland
*Teaching Mathematics and Computer Science*
*Feb 2022 - Nov 2022,&emsp;Feb 2024 - Nov 2024*
"""


talk : Html msg
talk =
    md """
# Talks

**Algebras of the Tangent Bundle Monad** **[[Link](https://centre-of-australian-category-theory.github.io/seminar/talks/1854)] [[Slides](/data/1854slides.pdf)]**
*Apr 2025*&ensp;Australian Category Seminar, Macquarie University


**Simplicial Sets, Simply** **[[Slides](https://uqmss.org/assets/slides/2024/wk4_joel_richardson.pdf)]**
*Aug 2024*&ensp;UQ Mathematics Student Society, The University of Queensland


**Lambda Calculus**
*Jun 2024*&ensp;Trinity Bay State High School


**Finding Factors in Berlekamp's Algebra** **[[Slides](https://uqmss.org/assets/slides/2024/wk9_joel_richardson.pdf)]**
*Apr 2024*&ensp;UQ Mathematics Student Society, The University of Queensland
"""
