module Main exposing (main)

import Browser
import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Html.Events as Html
import List
import Markdown



-- -------------------------------
-- BOILER PLATE
-- -------------------------------


type alias Model =
    {}


type alias Flags =
    {}


type alias Msg =
    {}


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : Flags -> ( Model, Cmd Msg )
init _ =
    ( {}, Cmd.none )


view : Model -> Html Msg
view _ =
    Html.div [ class "flex flex-col place-items-center bg-flu-50 space-y-4 min-h-screen" ] <|
        List.concat
            [ [ topBar ]
            , List.map (List.singleton >> Html.div [ class "w-3/4 mb-12 p-4 border border-flu-300 bg-flu-0 rounded-lg" ]) [ about, berlekamp ]
            , [ Html.div [ class "w-full p-4 pb-8 text-flu-300 text-center" ] [ Html.text "that's it - the end." ] ]
            ]


update : Msg -> Model -> ( Model, Cmd Msg )
update _ m =
    ( m, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none


md : String -> Html msg
md x =
    Markdown.toHtml
        [ class "content" ]
        x



-- -------------------------------
-- ACTUAL STUFF
-- -------------------------------


topBar : Html msg
topBar =
    Html.div
        [ class "w-full p-6 space-x-6 flex text-lg items-center font-bold border border-flu-300 bg-flu-0" ]
        [ Html.div [ class "grow" ] []
        , Html.div [] [ Html.text "Joel Richardson" ]
        , Html.div [ class "grow" ] []
        , Html.div [ class "w-0 h-0 overflow-clip" ] [ Html.text "$\\newcommand{\\ideal}[1]{\\left\\langle\\,#1\\,\\right\\rangle}$ $\\renewcommand{\\deg}[1]{\\text{deg}\\left(#1\\right)}$ $\\newcommand{\\set}[1]{ \\left\\{ \\, #1 \\, \\right\\} }$ $\\newcommand{\\F}[0]{\\mathbb{F}}$ $\\renewcommand{\\leq}[0]{\\leqslant}$ $\\renewcommand{\\geq}[0]{\\geqslant}$ $\\newcommand{\\defeq}[0]{\\overset{\\scriptsize\\textnormal{def}}{=}}$" ]

        -- , Html.div [] [ Html.text "Home" ]
        -- , Html.a [ class "cursor-pointer", Attr.href "mailto:joelwrichardson01@gmail.com" ] [ Html.text "Contact" ]
        ]


berlekamp : Html msg
berlekamp =
    Html.div []
        [ md """
# Berlekamp's Algorithm

Let $\\F_p$ be the finite field of order prime $p$, and suppose that $f \\in \\F_p[x]$ is a squarefree polynomial. What are the irreducible factors of $f$?

One traditional method for answering this question was given by Elwyn Berlekamp, in his 1967 paper *[Factoring polynomials over finite fields](https://ieeexplore.ieee.org/document/6768643)*. As a part of my honours thesis I implemented his method, but I wasn't able to find any fantastic resources on it. So here's my shot at explaining it!

For our first foothold, we'll notice that our method doesn't really need to find *every* irreducible factor of $f$. Or at least, it doesn't need to find every factor in one go. If a method can produce even just one non-trivial divisor of $f$ (i.e. a non-unit divisor that isn't a unit multiple of $f$), then we can repeadly apply the method until we've found every factor. Code that does that might look something like this:

```hs
-- this code is pretty easy to verify using induction.
factor :: Polynomial -> Set Polynomial
factor f = case findNonTrivialDivisor f of
    Just g_1 -> do
        let g_2 = f / g_1
        return $ Set.union ( factor g_1 ) ( factor g_2 )
    Nothing -> 
        return $ Set.singleton f -- f is irreducible
```

Perhaps the term "non-trivial divisor" is a little obfuscating. We want a non-trivial divisor because *intuitively* we're trying to split $f$ into two *meaningful* parts - two parts both containing some of the factors of $f$. """
        , Html.iframe [ class "quiver-embed w-full h-64 text-center", Attr.src "https://q.uiver.app/#q=WzAsMyxbMSwwLCJmPShmXzFmXzJmXzMpKGZfNFxcbGRvdHMgZl9uKSJdLFswLDIsImdfMT0oZl8xZl8yZl8zKSJdLFsyLDIsImdfMj0oZl80XFxsZG90cyBmX24pIl0sWzAsMiwiIiwyLHsiY3VydmUiOi0yfV0sWzAsMSwiIiwwLHsiY3VydmUiOjJ9XV0=&embed" ] []
        , md """
And once we've found one piece, $g_1 \\in \\F_p[x]$, we can trivially find $g_2 = f / g_1$. With this idea, *splitting the factors $f$*, in mind, it's natural to express what we want of $g_1$ as follows:

- We require that $g_1$ divides $f$
- We require that at least one factor of $f$ divides $g_1$
- We require that at least one factor of $f$ doesn't divide $g_1$

Better still, we can throw away the first requirement; the map $g \\mapsto \\gcd{(f,\\,g)}$, when applied to a polynomial satisfying (2) and (3), will produce a polynomial satisfying all three requirements. This is obvious, given a couple seconds thought. Alright, so now we're trying to find a polynomial $g_1$ such that:

- At least one factor of $f$ divides $g_1$
- At least one factor of $f$ doesn't divide $g_1$

Let's turn our attention to the set we're searching over - at the moment this is $\\F_p[x]$, which is pretty big, so it'd be handy to find a smaller set. One candidate is $D_f = \\set{ g \\in \\F_p[x] \\;|\\; \\deg{g} < \\deg{f} }$ which is both smaller than $\\F_p[x]$ and contains every non-trivial divisor of $f$. But we can do better; with all this talk of divisors, this problem feels very much like $\\text{mod}$ territory. So how about the ring of polynomials $\\text{mod } f$? (Note that this forms a subset of $D_f$)

$$A_f \\; \\defeq \\; \\F_p[x]/\\ideal{f}$$

Before we do anything, we need to verify that $A_f$ contains all the factors of $f$. Or rather,  whether the factors of $f$ distinct in $A_f$. A tidy application of the chinese remainder theorem gets the job done. Suppose $f$ has factors $f_1,\\,f_2,\\,\\ldots,\\,f_n$. The chinese remainder theorem yeilds a ring isomorphism

$$ \\begin{align\\*} \\phi : A_f \\; \\to& \\;\\; \\F_p[x]/ \\ideal{f_1} \\times \\F_p[x]/ \\ideal{f_2} \\times \\cdots \\times \\F_p[x]/ \\ideal{f_n} \\\\\\\\
    \\\\\\\\
    g \\; \\mapsto& \\;\\; (r_1,\\,r_2,\\,\\ldots,\\,r_n)
\\end{align\\*}$$

We consider how $\\phi$ acts on the factors of $f$. It's clear (given a seconds thought) that $\\phi(f_i)$ is zero in it's $i^{\\text{th}}$ component, and (given a couple seconds thought) that it is non-zero in every other component (i.e. because each $f_i$ is irreducible, and therefore they do not divide each other). So each factor of $f$ is indeed distinct in $A_f$. Moreover, we can apply $\\phi$ to get another perspective on our $g_1$ requirements. We're trying to find a polynomial $g_1$ such that $\\phi(g_1)$ is non-zero, but is zero in at least one component.

Can we find an even smaller set to search? One thing to consider is that in $A_f$ the factors of $f$ are all fixed under exponentiation by positive integers. So we might think about limiting our set to only points fixed under exponentiation - but exponentiation to what power? Well if we try any old value, say two, we'll run into a hiccup; we might lose the ability add. Suppose $g,\\, h \\in A_f$ are such that $g = g^2$ and $h = h^2$. It follows that $(gh)^2 = gh$, but it does not follow that $(g + h)^2 = g + h$. Instead we can try exponentiation to the $p^{\\text{th}}$ power. Consider the map

$$ \\begin{align\\*} Q_f : A_f \\; \\to& \\;\\; A_f \\\\\\\\
    g \\; \\mapsto& \\;\\; g^{\\, p}
\\end{align\\*} $$

We can apply the freshman's dream to see that the fixed points of $Q_f$ form a ring.

$$ \\begin{align\\*}
    \\forall \\, g,h \\in \\text{fix} (Q_f) \\quad\\quad& Q_f(gh) = (gh)^p = g^ph^p = gh\\\\\\\\
    &Q_f(g + h) = (g + h)^p = g^p + h^p = g + h
\\end{align\\*} $$

The fixed points of $Q_f$ turn out to be pretty useful, so we're going to give them a name.

$$ B_f \\;\\defeq\\; \\text{fix} (Q_f)$$

This is called the Berlekamp subalgebra of $A_f$. Now, it follows from Fermat's little theorem that $Q_f$ is linear, check this out:

$$ \\forall \\, t \\in \\F_p,\\, u,v \\in \\F_p[x] \\quad\\quad Q_f(tu + v) = {(tu + v)}^p = t^p u^p + v^p = tQ_f(u) + Q_f(v) $$

This is a pretty major win for us - it gives a fast method to produce elements of $B_f$. Watch this:

$$B_f = \\text{fix} (Q_f) = \\ker(Q_f - \\text{id})$$

We can encode $(Q_f - \\text{id})$ as a matrix, then use gassian elimination (or some other method) to produce a basis, $B$, of its nullspace. The elements of $B_f$ are preciely the linear combinations of $B$! But we're not done yet. Take some dummy variable $h$. Then the following equality holds in $\\F_p$:

$$ \\prod\\_{c \\in \\F\\_p} (h + c) = h^p - h$$

I plan to write another post proving this equality (the proof involves a pretty sweet application of combinatorics and group theory), but for now we'll just take it as given. That $h^p - p$ is just screaming $B_f$, so sure enough we'll sub in any $h \\in B\\_f$ to get the following equality (which holds in $\\F\\_p[x]$)

$$\\forall h\\in B\\_f,\\quad \\prod\\_{c \\in \\F\\_p} (h + c) = 0 \\mod f$$

Somewhat magically, this equality basically completes our algorithm. If that $h$ is a non-zero in $B_f$ and a non-unit $F\\_p[x]$ then it must be that one of the $(h + c)$ terms is a multiple of a non-trivial divisor of $f$! 

```hs
findNonTrivialDivisor :: Polynomial -> Maybe Polynomial
findNonTrivialDivisor f = case nullspaceBasis (berlekampMatrix f) of
    basis | length basis < 2 -> Nothing
    basis -> do
        let h = head basis                   
        find ( isNonZeroNonUnit ) [ gcd f (h + c) | c <- field ]
        -- don't forget to apply that ^^^ gcd we talked about earlier!
```

But we can do better. What if we lift the $\\text{gcd}$ into the product?

$$\\prod\\_{c \\in \\F\\_p} \\gcd{(f,\\,h + c)}$$

All we've really done is remove some factors from the product - precisely the factors that aren't in $f$ - so the product as a whole must still be a mutliple of $f$ (i.e. zero $\\text{mod } f$). So every factor in the product is also in $f$, and every factor in $f$ is also in the product. Could they be equal? They are equal if the product has no repeated factors, which is pretty easy to verify:

Suppose for some non-equal $s,\\,t \\in \\F\\_p$ the terms $\\gcd{(f,h+s)}$ and $\\gcd{(f,h+t)}$ share a factor $q$. Then $h+s$ and $h+t$ also share $q$. Morever, $q$ divides their difference, $s - t$. Since $q$ isn't a unit, this is impossible. 

So we get the following equality:

$$f = \\prod\\_{c \\in \\F\\_p} \\gcd{(f,\\,h + c)}$$

Using this equality we can improve our algorithm:

```hs
factorBerlekamp :: Polynomial -> Set Polynomial
factorBerlekamp f = case nullspaceBasis (berlekampMatrix f) of
    basis | length basis < 2 -> do
        return $ basis
    basis -> do
        let h = head basis
        let terms = filter ( isNonZeroNonUnit ) [ gcd f (h + c) | c <- field ]
        return $ Set.unionMap factorBerlekamp terms
```

So that's general gist of Berlekamp's agloritm. Thanks for reading!

*I'll leave the following note without proof: the vector space dimension of $B_f$ is equal to the number of factors of $f$, which I think that is pretty dang cool.*
"""

        -- If we manage to find some $g_1$ that satifies the latter
        -- Let's spend some times thinking about those latter two requirements (if we manage to find some $g_1$ that satisfies them and not the first we simply apply the map )
        -- We can get expression the latter two requirements as follows
        -- Okay, that's a start, but how are we going to find a non-trivial divisor of $f$? Let's call our non-trivial divisor $g$, and think about what it actually means for $g$ to be a non-trivial divsor of $f$. Infact (this part is a little heady, bear with me) let's examine how the factors of $f$ divide $g$.
        -- Or said another way, how are we going to find a $g \\in \\mathbb{F}_p[x]$ that is a divisor of $f$ and  at least one of the factors of $f$ divides $g$ and at least one doesn't.
        -- If we consider each of the factors of $f$ (call them ) divide $g$
        -- Let's break that down a little. If every factor of $f$ divides $g$ then $$
        -- , when we consider the
        -- $$r$$
        -- if $f$ has factors $f_1,\\, f_2,\\, \\ldots,\\, f_n$ how can we find a such that
        -- $$ (r_1,\\, \\ldots,\\, r_n) \\in \\mathbb{F}_p[x]/ \\ideal{f_1} \\times \\cdots \\times \\mathbb{F}_p[x]/ \\ideal{f_n} $$
        -- such that at least one $r_i$ is zero.
        -- We first construct an algebra.
        -- $$A_f \\; \\overset{\\scriptsize\\textnormal{def}}{=} \\; \\mathbb{F}_p[x]/ \\ideal{f}$$
        -- To which apply the chinese remainder theorem to producing an
        -- And note the property that if the irreducible factors of $f$ are $f_1,\\, f_2,\\, \\cdots ,\\, f_n $
        -- $$ A_f \\cong \\mathbb{F}_p[x]/ \\ideal{f_1} \\times \\cdots \\times \\mathbb{F}_p[x]/ \\ideal{f_n} $$
        ]


about : Html msg
about =
    Html.div [ class "space-x-8 flex" ]
        [ Html.div [ class "w-2/3 flex flex-col" ]
            [ md
                """
# About Me

**Hi! I'm Joel.** I study **Mathematics** and **Computer Science** at the *[University of Queensland](https://www.uq.edu.au/)* in Brisbane, Australia.

Here's what I've been up to recently:
"""
            , Html.table [ class "mt-2 rounded-lg border border-flu-300 p-4" ] <|
                List.reverse <|
                    List.map (List.map (List.singleton >> Html.td [ class "border border-flu-300 p-2 align-top" ]) >> Html.tr [])
                        [ [ md "**2022**", md "Completed a dual **Bachelor of Mathematics** / **Bachelor of Computer Science** with majors in Pure Mathematics and Programming Languages" ]
                        , [ md "**2022 - 2024**", md "Developed **compilers** and **programming languages** for *[Planwisely](https://www.planwisely.io/)*, at Veitch Lister Consulting" ]
                        , [ md "**2023**", md "Completed an **honours thesis** about polynomial factoring, under the supervision of *[Dr. Paul Vrbik](https://eecs.uq.edu.au/profile/1193/paul-vrbik)*" ]
                        ]
            , Html.div [ class "mt-3" ] [ Html.text "When I'm not up to those things, I like to sing, draw, and write. And play volleyball." ]
            , Html.div [ class "mt-3" ] [ Html.text "A full copy of my cv is available ", Html.a [ Attr.href "./Joel_Richardson_website_cv.pdf", class "italic underline" ] [ Html.text "here" ] ]
            ]
        , Html.div [ class "w-1/3" ] [ Html.img [ Attr.src "https://lh3.googleusercontent.com/pw/ABLVV84uHoktVcNwxAKcFJ8wxMQ-4EEStJ5-SLBE-MEvHYhHy5-dNbFOk0LLjecZ3IfKiHmORxx3VfVsvPfn-oeVE_5k3JiLDaHUKwBsgrWgvuwtj2z_tX0dYxcLTxrhC5Ai6tI9_ZR0Mugsa6ID-VPB_x9NYg=w1182-h1576-s-no-gm", class "h-full rounded-lg border border-flu-300 object-cover" ] [] ]
        ]



-- tmp =
--     markdown """
-- # Test
-- idk some text probabling explaing something about computer graphics or cheese or something honestly who knows at this poing ngl
-- ## Cheese
-- ```
-- public class main {
--   public static int main( String[][] args ) {
--     return 0;
--   }
-- }
-- ```
-- $\\displaystyle\\sum_{n=1}^\\infty n = -\\frac{1}{2}$
-- """
