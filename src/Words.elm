module Words exposing (Model, Msg, page)

import Common exposing (..)
import Dict exposing (Dict)
import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Html.Events exposing (onClick)
import List
import List.Extra as List
import Markdown


type Model
    = Bluetack
    | ServiceDeskOne


type Msg
    = Msg Model



-- ACTUAL CODE


view : Model -> List (Html Msg)
view m =
    [ Html.div [ class "w-full h-full relative" ]
        [ Html.div [ class "h-full overflow-y-scroll" ]
            [ case m of
                ServiceDeskOne ->
                    serviceDeskOne

                Bluetack ->
                    Html.text ""
            ]
        , Html.div [ class "absolute top-0 left-0 p-8 flex flex-col gap-2 select-none" ]
            [ Html.a [ class "w-[0px] text-3xl times-new-roman pb-4 cursor-pointer hover:underline", Attr.href "/" ] [ Html.text "Joel Richardson" ]
            , sidebarItem m ServiceDeskOne

            -- , sidebarItem m Bluetack
            ]
        ]
    ]


sidebarItem : Model -> Model -> Html Msg
sidebarItem m m2 =
    Html.div [ class <| "font-light " ++ ifThenElse (m == m2) "text-flu-500" "text-flu-400 hover:underline cursor-pointer", onClick (Msg m2) ] [ Html.text (toString m2) ]


toString : Model -> String
toString m =
    case m of
        ServiceDeskOne ->
            "Service Desk One"

        Bluetack ->
            "Blue-tack"


init : ( Model, Cmd Msg )
init =
    ( ServiceDeskOne, Cmd.none )


page : Page Model Msg
page =
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg _ =
    case msg of
        Msg m ->
            ( m, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none



--


serviceDeskOne : Html msg
serviceDeskOne =
    Html.div [ class "w-2/5 mx-auto py-16 prose" ]
        [ md """
# Service Desk One

I cross the room and make it to service desk one. I place my things on the counter and look to the small lady sitting opposite me. Her eyes are fixed on me. 

> What are you here for?

Her eyes snap down to the counter, to my forms and my id. She answers her own question. 

> A working with children's check.

She says it flatly, her mind obviously elsewhere. Her eyes move along the counter and come to rest on the remnants of my lunch: a plastic tray, covered in quick-sale tags, labelled chopped fruit.

> Lunch!
> Lunch is good!
> I just had lunch too.
> Don't worry, I'm just having some fun.

She takes up my forms and starts entering something into her computer. She types for a minute, then stops to look at me.

> No. 
> Is this your first time here?
> Why haven't you been here before?
> You're supposed to have new south wales license.
> If you're here for longer than three months, you're supposed to request a new south wales license.
> It's... no, no, don't worry.
> The police won't know how long you've been here.
> It's a technicality.
> It's up to you, whatever you want.

She turns back to her computer desk, produces a form, and places it on the counter. 

> You fill this in so you can get on the system.
> I'll do this.
> That is teamwork.

I search the counter top for a pen. She sees me looking, gets down from her chair, walks about a metre to a set of draws, and produces a fresh pen. She gives it to me.

> There are never any pens these days.
> Teamwork.
> I'm just having some fun.
> Because, look around---
> No one has fun anymore.

I turn to look around. The waiting room is full of waiting people. They don't all look glum; the people standing in front of service desk two are laughing. I turn back to the woman.

> Queensland must be cheaper. 
> It's expensive here.

I tell her that I think Brisbane is catching up to Sydney, cost of living wise.

> It's because everyone here is running to Brisbane.
> The people in Brisbane won't like it.
> Soon all the states will be angry at each other.
> And no one will think about immigrants anymore.
> Sorry, I'm just being an immigrant. 
> I'm just having some fun.
> No one has fun anymore.
> And it doesn't even matter who you vote for.
> The greens, one nation---all of the votes will go back to the two parties.
> And they're both the same.
> Everyone is the same.

She lowers her voice conspiratorially:

> But I think labour's better.

She quickly returns to her normal volume.

> But I'm just being an immigrant.
> I'm just having fun.

She trails off for a moment, concentrating on her computer, then starts mumbling to herself as she types.

> Who are you?
> You are:
> Joel...
> William...
> Richardson...
> Do you ever think about that?

She fixes her eyes on me once again.

> That that isn't who really who you are?
> That that's just a name some people gave you, and other people call you?
> You know?
> Who are you really?

&emsp;

&emsp;

I finish filling in my form and slide it across the counter to her. She pushes my ID back to me. 

> Teamwork.

She prints off something and hands it to me---a temporary working with children's check, for use until my proper one arrives. I collect my things.

> Do you read?
> You should read this book.
> It's a wonderful book.
> The author is brilliant.

She writes the name of the book on a scrap of paper and slides it across the counter to me.

> Don't buy it though.
> You're at the university.
> You're like me -- poor.
> Get it from the library.

I tell her to have a good afternoon. I wave goodbye.

> Come back sometime.
> Tell me if you like it.
""" ]
