port module Main exposing (main)

import Browser
import Graph
import Html exposing (Html)
import Html.Attributes as Attr exposing (class)
import Html.Events as Html
import List
import List.Extra as List
import Markdown


port render : {} -> Cmd msg



-- -------------------------------
-- BOILER PLATE
-- -------------------------------


type alias Model =
    { bijection : List (Maybe Int) }


type alias Flags =
    {}


type Msg
    = SetBijection ( Int, Maybe Int )
    | SetBijectionPrime Int


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
    ( { bijection = [ Nothing, Just 0, Just 0 ] }, Cmd.none )


view : Model -> Html Msg
view m =
    Html.div [ class "flex flex-col place-items-center bg-flu-50 space-y-4 min-h-screen" ] <|
        List.concat
            [ [ topBar ]
            , List.map (List.singleton >> Html.div [ class "w-3/4 mb-12 p-4 border border-flu-300 bg-flu-0 rounded-lg" ]) [ about, berlekamp, nice m ]
            , [ Html.div [ class "w-full p-4 pb-8 text-flu-300 text-center" ] [ Html.text "that's it - the end." ] ]
            ]


update : Msg -> Model -> ( Model, Cmd Msg )
update msg m =
    case msg of
        SetBijection ( i, o ) ->
            ( { m | bijection = List.setAt i o m.bijection }, Cmd.none )

        SetBijectionPrime i ->
            ( { m | bijection = List.range 0 (i - 1) |> List.map (\k -> List.getAt k m.bijection |> Maybe.withDefault Nothing) }, render {} )


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

        -- , Html.div [] [ Html.text "Home" ]
        -- , Html.a [ class "cursor-pointer", Attr.href "mailto:joelwrichardson01@gmail.com" ] [ Html.text "Contact" ]
        ]


berlekamp : Html msg
berlekamp =
    Html.div []
        [ md """
# Berlekamp's Algorithm

Let $\\F_p$ be the finite field of order prime $p$, and suppose that $f \\in \\F_p[x]$ is a squarefree polynomial. How can we find the factors of $f$?

An answer to this question was given by Elwyn Berlekamp in his 1967 paper *[Factoring polynomials over finite fields](https://ieeexplore.ieee.org/document/6768643)*. In my honours thesis I implemented his algorithm, though I couldn't find any fantastic resources on it. Here's my shot at explaining it — I hope you find his algorithm as interesting as I did.

We're going to think about our problem, *factoring a polynomial over a finite field*, and chip away at it until we run into Berlekamp's algorithm.

For our first foothold, we'll notice that any factorization algorithm doesn't really need to find *every* irreducible factor of $f$. Or at least, it doesn't need to find every factor in one go. If an algorithm can produce even just one non-trivial divisor of $f$ (i.e. a non-unit divisor that isn't a unit multiple of $f$), then we can repeatedly apply the algorithm until we've found every factor. Code that does that might look something like this:

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

Let's turn our attention to the set we're searching over - currently, it's $\\F_p[x]$, which is pretty big, so it'd be handy to find a smaller set. One candidate is $D_f = \\set{ g \\in \\F_p[x] \\;|\\; \\deg{g} < \\deg{f} }$ which is both smaller than $\\F_p[x]$ and contains every non-trivial divisor of $f$. But we can do better; with all this talk of divisors, this problem feels very much like $\\text{mod}$ territory. So how about the ring of polynomials $\\text{mod } f$? (Note that this forms a subset of $D_f$)

$$A_f \\; \\defeq \\; \\F_p[x]/\\ideal{f}$$

Before we do anything, we need to verify that $A_f$ contains all the factors of $f$. Or rather,  whether the factors of $f$ distinct in $A_f$. A tidy application of the chinese remainder theorem gets the job done. Suppose $f$ has factors $f_1,\\,f_2,\\,\\ldots,\\,f_n$. The chinese remainder theorem yeilds a ring isomorphism

$$ \\begin{aligned} \\phi : A_f \\; \\to& \\;\\; \\F_p[x]/ \\ideal{f_1} \\times \\F_p[x]/ \\ideal{f_2} \\times \\cdots \\times \\F_p[x]/ \\ideal{f_n} \\\\\\\\
    \\\\\\\\
    g \\; \\mapsto& \\;\\; (r_1,\\,r_2,\\,\\ldots,\\,r_n)
\\end{aligned}$$

We consider how $\\phi$ acts on the factors of $f$. It's clear (given a seconds thought) that $\\phi(f_i)$ is zero in it's $i^{\\text{th}}$ component, and (given a couple seconds thought) that it is non-zero in every other component (i.e. because each $f_i$ is irreducible, and therefore they do not divide each other). So each factor of $f$ is indeed distinct in $A_f$. Moreover, we can apply $\\phi$ to get another perspective on our $g_1$ requirements. We're trying to find a polynomial $g_1$ such that $\\phi(g_1)$ is non-zero, but is zero in at least one component.

Can we find an even smaller set to search? One thing to consider is that in $A_f$ the factors of $f$ are all fixed under exponentiation by positive integers. So we might think about limiting our set to only points fixed under exponentiation — but exponentiation to what power? Well if we try any old value, say two, we'll run into a hiccup; we might lose the ability add. Suppose $g,\\, h \\in A_f$ are such that $g = g^2$ and $h = h^2$. It follows that $(gh)^2 = gh$, but it does not follow that $(g + h)^2 = g + h$. Instead, we can try exponentiation to the $p^{\\text{th}}$ power. Consider the map

$$ \\begin{aligned} Q_f : A_f \\; \\to& \\;\\; A_f \\\\\\\\
    g \\; \\mapsto& \\;\\; g^{\\, p}
\\end{aligned} $$

We can apply the freshman's dream to see that the fixed points of $Q_f$ form a ring.

$$ \\begin{aligned}
    \\forall \\, g,h \\in \\text{fix} (Q_f) \\quad\\quad& Q_f(gh) = (gh)^p = g^ph^p = gh\\\\\\\\
    &Q_f(g + h) = (g + h)^p = g^p + h^p = g + h
\\end{aligned} $$

The fixed points of $Q_f$ turn out to be pretty useful, so we're going to give them a name.

$$ B_f \\;\\defeq\\; \\text{fix} (Q_f)$$

This is called the Berlekamp subalgebra of $A_f$. Now, it follows from Fermat's little theorem that $Q_f$ is linear, check this out:

$$ \\forall \\, t \\in \\F_p,\\, u,v \\in \\F_p[x] \\quad\\quad Q_f(tu + v) = {(tu + v)}^p = t^p u^p + v^p = tQ_f(u) + Q_f(v) $$

This is a pretty major win for us - it gives a fast method to produce elements of $B_f$. Watch this:

$$B_f = \\text{fix} (Q_f) = \\ker(Q_f - \\text{id})$$

We can encode $(Q_f - \\text{id})$ as a matrix, then use Gaussian elimination (or some other method) to produce a basis, $B$, of its nullspace. The elements of $B_f$ are precisely the linear combinations of $B$! But we're not done yet. Take some dummy variable $h$. Then the following equality holds in $\\F_p$:

$$ \\prod\\_{c \\in \\F\\_p} (h + c) = h^p - h$$

I plan to write another post to prove this equality, which involves an interesting application of combinatorics and group theory. For now, however, we'll take it as given. That $h^p - h$ is just screaming $B_f$, so sure enough we'll sub in any $h \\in B\\_f$ to get the following equality (which holds in $\\F\\_p[x]$)

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

All we've really done is remove some factors from the product - precisely the factors that aren't in $f$ - so the product as a whole must still be a multiple of $f$ (i.e. zero $\\text{mod } f$). So every factor in the product is also in $f$, and every factor in $f$ is also in the product. Could they be equal? They are equal if the product has no repeated factors, which is pretty easy to verify:

Suppose for some non-equal $s,\\,t \\in \\F\\_p$ the terms $\\gcd{(f,h+s)}$ and $\\gcd{(f,h+t)}$ share a factor $q$. Then $h+s$ and $h+t$ also share $q$. Moreover, $q$ divides their difference, $s - t$. Since $q$ isn't a unit, this is impossible. 

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

So that's the general gist of Berlekamp's algoritm. Thanks for reading!

*I'll leave the following note without proof: the vector space dimension of $B_f$ is equal to the number of factors of $f$. I think this is pretty dang cool.*
"""
        ]


nice : Model -> Html Msg
nice m =
    Html.div []
        [ md """
# Nice Bijection

Suppose $n$ is a natural number and $x$ is free. Consider the following product.

$$P(n) \\; \\defeq \\prod_{0 \\, \\leq \\, i \\, < \\, n} (x + i) \\; = \\; x(x+1)(x+2)\\cdots(x+n-1)$$

Can we say anything about how, in general, $P(n)$ expands? I think this is a fairly interesting question; $P(n)$ feels very structured, but it isn't obvious whether that structure will hand us any nice formulas. Let's try expanding a few examples.

$$ \\begin{aligned} 
    P(1) \\; &= \\; x \\\\\\\\
    P(2) \\; &= \\; x^2 + x \\\\\\\\
    P(3) \\; &= \\; x^3 + 3x^2 + 2x \\\\\\\\
    P(4) \\; &= \\; x^4 + 6x^3 + 11x^2 + 6x  \\\\\\\\
    P(5) \\; &= \\; x^5 + 10x^4 + 35x^3 + 50x^2 + 24x \\\\\\\\
    P(6) \\; &= \\; x^6 + 15 x^5 + 85 x^4 + 225 x^3 + 274 x^2 + 120 x\\\\\\\\
    P(7) \\; &= \\; x^7 + 21x^6 + 175x^5 + 735x^4 + 1624x^3 + 1764x^2 + 720x\\\\\\\\
    P(8) \\; &= \\; x^8 + 28 x^7 + 322 x^6 + 1960 x^5 + 6769 x^4 + 13132 x^3 + 13068 x^2 + 5040 x
\\end{aligned} $$

That's a lot of numbers, and they all look pretty random. The $P(5)$ case does stick out to me though. $10,\\, 35,$ and $50$ are multiples of $5$, and $24$ is almost a multiple of $5$. The $P(7)$ case is similar — $21,\\, 175,\\, 735,\\, 1624,\\,$ and $1764$ are multiples of $7$, and $720$ is almost $721$. $721$ is a multiple of $7$. And I suppose the same pattern holds for $P(2)$ and $P(3)$. Perhaps this pattern is worthy of investigation. Let's take a look at $P(n)$ with coefficients modulo $n$ 

$$ \\begin{aligned} 
    P(2) \\; &\\equiv \\; x^2 - x \\mod 2 \\\\\\\\
    P(3) \\; &\\equiv \\; x^3 - x \\mod 3 \\\\\\\\
    P(4) \\; &\\equiv \\; x^4 + 2x^3 - x^2 + 2x \\mod 4 \\\\\\\\
    P(5) \\; &\\equiv \\; x^5 - x \\mod 5 \\\\\\\\
    P(6) \\; &\\equiv \\; x^6 + 3 x^5 + x^4 + 3 x^3 - 2 x^2 \\mod 6 \\\\\\\\
    P(7) \\; &\\equiv \\; x^7 - x \\mod 7 \\\\\\\\
    P(8) \\; &\\equiv \\; x^8 + 4 x^7 + 2 x^6 + x^4 + 4 x^3 + 4 x^2 \\mod 8
\\end{aligned} $$

The cases in which $n$ is prime are all looking suspicious, so let's investigate further.

$$ \\begin{aligned} 
    P(2) \\; &\\equiv \\; x^2 - x \\mod 2 \\\\\\\\
    P(3) \\; &\\equiv \\; x^3 - x \\mod 3 \\\\\\\\
    P(5) \\; &\\equiv \\; x^5 - x \\mod 5 \\\\\\\\
    P(7) \\; &\\equiv \\; x^7 - x \\mod 7 \\\\\\\\
    P(11) \\; &\\equiv \\; x^{11} - x \\mod 11 \\\\\\\\
    P(13) \\; &\\equiv \\; x^{13} - x \\mod 13 \\\\\\\\
    P(17) \\; &\\equiv \\; x^{17} - x \\mod 17 \\\\\\\\
\\end{aligned} $$

Surely that's a pattern; these examples beg a question. Is it true that the following statment holds for every prime $p$?

$$ \\prod_{0 \\, \\leq \\, i \\, < \\, p} (x+i) \\;\\; {\\overset{\\scriptsize\\textnormal{?}}{=}} \\;\\; x^p - x \\mod p $$

In order to answer this question we'll have to figure out what's going on here. Where do the coefficents in the expansion of $P(p)$ actually come from? We can start by giving them labels. Write

$$P(p) = a\\_1x + a\\_2x^2 + \\cdots + a\\_{p-1}x^{p-1} + x^p$$ 

It's pretty easy to figure $a_1$ out. Specifically, we see

$$a_1 = 1\\cdot 2\\cdot 3 \\cdot \\ldots \\cdot (p-1)$$

The terms of this product are exactly the non-zero elements of the field of integers modulo $p$. The reader may show that every term but $1$ and $p-1 \\equiv -1$ is cancelled by its inverse. This yeilds $$a_1 = 1\\cdot (p-1) \\equiv -1 \\mod p$$

But what about every other $a_i$? It seems almost magical that they might all conspire to equal zero modulo $p$; this problem seems impenetrable. However we have one foothold — it really seems like some kind of inclusion/exclusion business going on. Let me explain what I mean. A common algorithm for expanding brackets involves taking every possible choice of one term from each brackets, then summing the products of each choice. In the case of $P(3)$ this is as follows.

$$ \\begin{aligned}
    \\hl{x}(\\hl{x}+1\\,)(\\hl{x}+2\\,) &\\quad \\rightsquigarrow \\quad x\\cdot x\\cdot x = x^3 \\\\\\\\
    \\hl{x}(\\hl{x}+1)(x+\\hl{2}) &\\quad\\rightsquigarrow\\quad x \\cdot x \\cdot 2 = 2x^2 \\\\\\\\
    \\hl{x}(x+\\hl{1})(\\hl{x}+2) &\\quad\\rightsquigarrow\\quad x \\cdot 1 \\cdot x = x^2 \\\\\\\\
    \\hl{x}(x+\\hl{1})(x+\\hl{2}) &\\quad\\rightsquigarrow\\quad x \\cdot 1 \\cdot 2 = 2x
\\end{aligned} $$

$$ \\implies \\; P(3) \\, = \\, x^3 + 2x^2 + x^2 + 2x $$

Despite the clunkiness of my explanation, I do think this is a very natural idea. Indeed, I'd bet that you already use this algorithm, perhaps even without realizing it; the *FOIL* method is exactly this algorithm applied to a pair of brackets. Sure, you might say, but does this algorithm actually take us anywhere? To me this idea takes us into combinatorics territory. Instead of thinking about expanding $p$ pairs of brackets we can think about making $p$ choices. The value of each $a_ix^i$ is then the sum of the choices in which we picked $x$, $i$ times. Consider the products from the choices above in which we picked $x$ twice.

$$a\\_2x^2 = \\sum \\; \\text{results of choices with $x$ picked twice } = x^2 + 2x^2 = 3x^2$$

This is all a bit vague. We need to formalize. Let's start by turning our product into a set of sets.

$$ P_p \\; = \\; \\set{\\set{x},\\, \\set{x,\\,1},\\, \\set{x,\\,2},\\, \\ldots \\, ,\\, \\set{x,\\,p-1}} $$

Now we can restate $P(p)$

$$ P(p) \\; = \\; \\prod\\_{A \\,\\in\\, P\\_p} \\sum\\_{a \\,\\in\\, A} a $$

Next, we'll use the cartesian product.

$$ C(S) \\; \\defeq \\; \\prod\\_{A \\,\\in\\, S} A $$

Now, each element of $C(P_p)$ corresponds to exactly one choice of terms in $P(p)$. We can use $\\hl{\\text{highlight}}$ notation as shorthand (really longhand) for the elements of $C(P_p)$. For example, in the case of $C(P_3)$

$$ \\begin{aligned}
    \\hl{x}(\\hl{x}+1)(x+\\hl{2}) &\\quad\\defeq\\quad (x,\\,x,\\,2) \\\\\\\\
    \\hl{x}(x+\\hl{1})(\\hl{x}+2) &\\quad\\defeq\\quad (x,\\,1,\\,x) 
\\end{aligned} $$

We can now state our algorithm for expanding brackets. Denote the $i^{\\text{th}}$ component of $c \\in C(S)$ with $c_i$. Our algorithm is as follows.

$$ \\prod\\_{A \\,\\in\\, S} \\sum\\_{a \\,\\in\\, A} a \\; = \\; \\sum\\_{c \\,\\in\\, C(S)} \\; \\prod\\_{1 \\, \\leq \\, i \\, \\leq \\, |S|} \\; c_i $$

Using $\\prod c$ to denote the product of the components of $c$, we can write

$$ P(p) \\; = \\; \\sum\\_{c \\,\\in\\, C(P_p)} \\; \\prod c$$

Let's recap. We have these choices $c \\in C(P_p)$, we know the coefficient $a_i$ has something to do with (is a weighted count of?) the choices $c$ in which $x$ appears $i$, and we'd like to move further into combinatorics territory. 

Now, it'd be great if we found some way to move into a counting problem. But, rather annoyingly, we have this "weighted count" business going on — $(x,\\,x,\\,2)$ and $(x,\\,1,\\,x)$ contribute to $a_2$ differently, despite both containing $x$ twice. It would be nice if our choices had a bit more symmetry to them, if each component of our choices were either $x$ or not $x$; either $x$ or $1$. What if we unfold each $(x+i)$ into a $(x+1+1+\\cdots+1)$?

$$ \\begin{aligned} 
    P(3) \\; &= \\; x(x+1)(x+1+1) \\\\\\\\
    &= \\; (x^2+x)(x+1+1) \\\\\\\\
    &= \\; x^2(x+1+1) + x(x+1+1) \\\\\\\\
    &= \\; x^3+x^2+x^2 + x^2+x+x \\\\\\\\
\\end{aligned} $$

We can still apply our algorithm, although we do need to redefine $P_p$, indexing the ones.

$$P\\_p \\;\\defeq\\; \\Big\\\\{\\set{x},\\, \\set{x,\\,1\\_1},\\, \\set{x,\\,1\\_1,\\,1\\_2},\\, \\ldots ,\\, \\\\{\\, x,\\, 1\\_1,\\, 1\\_2,\\, \\ldots,\\, 1\\_{p - 1} \\, \\\\} \\Big\\\\} $$

Now suppose $c \\in C(P_p)$. If $i$ components of $c$ are $x$, we have that $\\prod c = x^i$. It follows that the $a_i$ is equal to the number of distinct choices with $x$ picked $i$ times. 

$$a_i = \\Big|\\,\\set{c \\in C(P_p) \\;:\\; x \\text{ appears in } i \\text{ components of } c}\\,\\Big|$$

In our example, $P(3)$, there are $3$ choices with $x$ picked twice, so $a_2 = 3$.

$$\\begin{aligned} 
    \\hl{x}(x+\\hl{1})(\\hl{x}+1+1) \\; &\\quad \\overset{\\scriptsize\\Pi\\,}{\\longmapsto} \\quad \\; x^2 \\\\\\\\
    \\hl{x}(\\hl{x} + 1)(x+\\hl{1} + 1) \\; &\\quad \\overset{\\scriptsize\\Pi\\,}{\\longmapsto} \\quad \\; x^2 \\\\\\\\
    \\hl{x}(\\hl{x} + 1)(x+1+\\hl{1}) \\; &\\quad \\overset{\\scriptsize\\Pi\\,}{\\longmapsto} \\quad \\; x^2 
\\end{aligned}$$

This is cool, but it's still a bit tricky to think about. Can we come up with another perspective on these choices? Let's say we generate a choice, starting from the set containing the most terms, then the second most, down to the set containing $x$. Then at the $i^{\\text{th}}$ step in our sequence we have possible choices of $x$ and $p-i$ ones. Let's give ourselves some mental breathing room by supposing we never choose $x$, so at the $i^{\\text{th}}$ step we can choose between $p-i$ ones. This is exactly like ordering cards from a deck of $p-1$ cards! Picking the $k^{\\text{th}}$ one corresponds to picking the $k^{\\text{th}}$ remaining card from the deck. We can visualize this in the case of $P(3)$. Denote the king and queen cards with $\\textbf{K}$ and $\\textbf{Q}$.

$$ \\begin{aligned} 
    x\\big(x +\\hl{1} + 1 \\big)\\big(x + \\hl{1} \\big) & \\quad\\, \\rightsquigarrow \\quad x\\big(x + \\hl{\\textbf K} + {\\textbf Q} \\big)\\big(x + \\hl{\\textbf Q\\,}\\big) \\quad \\rightsquigarrow \\quad \\big(\\, {\\textbf K},\\, {\\textbf Q} \\, \\big) \\\\\\\\
    x\\big(x + 1 + \\hl{1} \\big)\\big(x + \\hl{1} \\big) & \\quad\\, \\rightsquigarrow \\quad x\\big(x + {\\textbf K} + \\hl{\\textbf Q} \\big)\\big(x + \\hl{\\textbf K\\,}\\big) \\quad \\rightsquigarrow \\quad \\big(\\, {\\textbf Q},\\, {\\textbf K} \\, \\big)
\\end{aligned} $$

So the fact that $a_1 = 2$ corresponds to the fact that there are $2$ ways to order $2$ cards. Now we're pretty close to understanding our whole problem through a nice counting lense — we just need to find a way to understand a choice containing an $x$. Each $1$ represents picking some distinct object. An $x$ ought to represent something meaningfully different. In my imagination I order a scrambled mess of cards by placing them, one at a time, onto a deck. What an $x$ represents starting a new deck? Then $a_i$ is equal to the the number of ways to arrange $p$ cards into $i$ decks. Our only trouble is that the number of remaining cards should decrease after we choose $x$. Let's just say the highest available card is always used to start a new pile. This will also make sense of the $(x)$ term of $P(p)$; before you can start ordering cards into decks, you have to start a deck. Again, we can visualize this in the case of $P(3)$.

$$ \\begin{aligned} 
    \\hl{\\text{new pile with \\textbf{K}}}\\big(\\hl{\\text{new pile with \\textbf{Q}}} + {\\textbf Q} + {\\textbf J} \\big)\\big(\\text{new pile with \\textbf J} + \\hl{\\textbf J\\,}\\big) \\quad &\\rightsquigarrow \\quad \\big(\\, {\\textbf K}\\, \\big) \\;\\; \\big(\\, {\\textbf Q},\\, {\\textbf J} \\, \\big) \\\\\\\\
    \\hl{\\text{new pile with \\textbf{K}}}\\big(\\text{new pile with \\textbf{Q}} + \\hl{\\textbf Q} + {\\textbf J} \\big)\\big(\\text{new pile with \\textbf J} + \\hl{\\textbf J\\,}\\big) \\quad &\\rightsquigarrow \\quad \\big(\\, {\\textbf K},\\, {\\textbf Q},\\, {\\textbf J} \\, \\big) \\\\\\\\
    \\hl{\\text{new pile with \\textbf{K}}}\\big(\\text{new pile with \\textbf{Q}} + {\\textbf Q} + \\hl{\\textbf J} \\big)\\big(\\text{new pile with \\textbf Q} + \\hl{\\textbf Q\\,}\\big) \\quad &\\rightsquigarrow \\quad \\big(\\, {\\textbf K},\\, {\\textbf J},\\, {\\textbf Q} \\, \\big) \\\\\\\\
\\end{aligned} $$

To recap, for $i>1$, the coefficient $a_i$ in the expansion of $P(p)$ is equal to the number of ways to arrange $p$ cards (remember we're inlcuding the $x+0$ term) into $i$ piles, modulo the choice of the first card of each pile. Woah, let's simplify this a bit. "An ordered list modulo choice of first element"... that sounds a lot like a cycle. Quick recap: a cycle of set $A$ is a collection of pairs $Q \\in \\mathcal{P}(S^2)$ of size equal to $A$ such that

$$ \\bigcup\\_{(a,b) \\,\\in\\, Q} a \\; = \\; A \\; = \\; \\bigcup\\_{(a,b) \\,\\in\\, Q} b $$

For instance if $A = \\set{a,\\,b,\\,c}$ then the set $\\set{(a,c),\\,(c,b),\\,(b,a)}$ is a cycle of $A$. We can visualize any cycle as a directed graph."""
        , Html.div [ class "w-full flex justify-center items-center pt-4 h-[120px]" ] [ funnyBijection_ 200 mathchar [ Nothing, Just 1, Just 0 ] ]
        , md """
Is our correspondence, call it $f$, a bijective map from a choice in $C(P_p)$ to an arrangement of $p$ objects into a set of cycles? It's not hard to construct its inverse. Suppose $f(c)$ is any set of cycles. We start with the cycle containing ${\\textbf K}$ and walk through it. Each subsequent term in the cycle corresponds to the next compontent of our choice $c$ in the obvious way. Once we return to ${\\textbf K}$, add an $x$ as the next component of $c$, and move onto the cycle that contains the largest remaining element. We repeat until we've exhausted every cycle. Let's look at some examples — suppose our set of $p$ objects is $\\set{a,\\,b,\\,c,\\, \\cdots}$. In the case of $P(3)$, the choice $(x,\\,x,\\,x)$ corresponds to the set of three $3$ one-cycles, each containing an element of $\\set{a,\\,b,\\,c}$
"""
        , Html.div [ class "w-full mx-auto my-1 flex flex-row justify-center items-center" ]
            [ math "\\hl{x}(\\hl{x} + 1 + 1)(\\hl{x} + 1)"
            , math "\\quad\\quad\\overset{\\scriptsize f}{\\longmapsto}"
            , funnyBijection [ Nothing, Nothing, Nothing ]
            ]
        , md "The choice $(x,\\, 1\\_1,\\, x)$ corresponds to the following set containing a two-cycle and a one-cycle."
        , Html.div [ class "w-full mx-auto my-1 flex flex-row justify-center items-center" ]
            [ math "\\hl{x}(x + \\hl{1} + 1)(\\hl{x} + 1)"
            , math "\\quad\\quad\\overset{\\scriptsize f}{\\longmapsto}"
            , funnyBijection [ Nothing, Just 0, Nothing ]
            ]
        , md "The choice $(x,\\, 1\\_2,\\, x)$ corresponds to another set of cycles."
        , Html.div [ class "w-full mx-auto my-1 flex flex-row justify-center items-center" ]
            [ math "\\hl{x}(x + 1 + \\hl{1})(\\hl{x} + 1)"
            , math "\\quad\\quad\\overset{\\scriptsize f}{\\longmapsto}"
            , funnyBijection [ Nothing, Just 1, Nothing ]
            ]
        , md "The following tool allows for the exploration of arbitrary choices. *Hint: trying clicking an $\\mathit{x}$ or a $\\mathit{1}$ in the tool.*"
        , Html.div [ class " pt-8 pb-4 flex flex-row gap-8 justify-center items-center w-full" ] (List.map (\i -> Html.div [ Html.onClick (SetBijectionPrime i), class <| "rounded-md py-2 px-3 cursor-pointer hover:bg-flu-200 " ++ ifThenElse (List.length m.bijection == i) " bg-flu-200 " "" ] [ math <| "P(" ++ showInt i ++ ")" ]) [ 3, 5, 7 ])
        , Html.map SetBijection (funnyBicjectionPanel m.bijection)
        , md """
Getting back to our original point, we have that $a_i$ is equal to the number of ways to arrage $p$ objects into an $i$-set of cycles. 

$$ a\\_i \\,=\\, \\Big| \\set{ c \\in C(P_p) \\,:\\, |f(c)| = i } \\Big| $$

We wanted to show that $a_i$ is a multiple of $p$. So now we want to show "the number of ways to arrage $p$ objects into an $i$-set of cycles" is a multiple of $p$. Let's denote

$$A_{p,\\,i} \\,\\defeq\\; \\set{ c \\in (f \\circ C)(P_p) \\,:\\, |c| = i } $$

Now that we're working with a set, we can take a more literal perspective on multiples and divisors. To say that $a\\_i$ is a multiple of $p$ is to say that $A\\_{p,\\,i}$ can be divided into disjoint subsets, each containing $p$ elements. So how might we divide the elements of $A\\_{p,\\,i}$? Perhaps we ought to look at some examples, $A\\_{3,\\,2}$ contains exactly three elements so we don't actually need to divide it. Let's look at the next smallest case, $A\\_{5,\\,4}$, which contains ten elements. Remember, we're trying to split this into (two) disjoint subsets of size five. 
"""

        -- , Html.div
        --     [ class "flex flex-row w-full gap-6 p-6 place-center justify-center" ]
        --     [ Html.div [ class "my-auto" ] [ Html.text "$$\\huge \\Bigg\\{$$" ]
        --     , funnyBijection [ Nothing, Just 0, Nothing ]
        --     , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
        --     , funnyBijection [ Nothing, Just 1, Nothing ]
        --     , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
        --     , funnyBijection [ Nothing, Nothing, Just 0 ]
        --     , Html.div [ class "my-auto" ] [ Html.text "$$\\huge \\Bigg\\}$$" ]
        --     ]
        -- $$\\Big\\\\{ \\set{[a,b],\\,[c]},\\, \\set{[c,a],\\,[b]},\\, \\set{[b,c],\\,[a]} \\Big\\\\}$$
        --         , md """
        -- Notice that in $A\\_{3,\\,2}$ to move from one set of cycles to the next, is to shift the labels. That is, if we lift the following *shifting map* $\\varphi$ to act on $A\\_{3,\\,2}$ (i.e. by applying to each element of each cycle in each set) and repeadely apply it, we will reach all of $A\\_{3,\\,2}$.
        -- $$ \\begin{aligned}
        -- \\varphi \\; : \\; \\set{ a,\\,b,\\,c } \\;&\\to\\; \\set{ a,\\,b,\\,c } \\\\\\\\
        --     a \\;&\\mapsto\\; b \\\\\\\\
        --     b \\;&\\mapsto\\; c \\\\\\\\
        --     c \\;&\\mapsto\\; a \\\\\\\\
        -- \\end{aligned}$$
        -- We can say $A\\_{3,\\,2}$ that an orbit of $\\varphi$. If use swap out our labels $\\set{ a,\\,b,\\,c }$ for numbers $\\set{ 1,\\,2,\\,3 }$ we can define a more general map
        -- $$ \\begin{aligned}
        -- \\varphi \\; : \\; \\F_p \\;&\\to\\; \\F_p  \\\\\\\\
        --     k \\;&\\mapsto\\; (k + 1) \\; \\text{ mod }\\; p
        -- \\end{aligned}$$
        -- On $A\\_{3,\\,2}$ there was only one orbit of $\\varphi$ and it had $3$ elements. What if we apply $\\varphi$ to another set, say $A\\_{5,\\,4}$? In this case there are two orbits. One is generated by $f(x,1\\_1,x,x,x)$ and the other by $f(x,1\\_2,x,x,x)$.
        --         """
        , Html.div
            [ class "flex flex-row w-full gap-3 pt-6 px-6 place-center justify-center" ]
            [ Html.div [ class "my-auto" ] [ Html.text "$$\\huge \\Bigg\\{$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Just 0, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Nothing, Just 0, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Nothing, Nothing, Just 0, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Nothing, Nothing, Nothing, Just 0 ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Just 1, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            ]
        , Html.div
            [ class "flex flex-row w-full gap-3 pb-6 px-6 place-center justify-center" ]
            [ Html.div [ class "my-auto" ] [ Html.text "$$\\huge \\;$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Nothing, Just 1, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Nothing, Nothing, Just 1, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Just 2, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Nothing, Just 2, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Just 3, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge \\Bigg\\}$$" ]
            ]
        , md """
Perhaps, you have some ideas, perhaps you don't. I claim that, even in writing out our set, we've stumbled into a hint. The trick is to think about *how many elements each arrow skips*. Look at the order we wrote the elements in. We naturally put first the sets with cycles *skipping no elements*, then those *skipping one element*, and so on. Let's rewrite our set in a way that these *element skips* easier to compare. The order of our labels, $a,\\, b ,\\, c ,\\, \\ldots$, is arbitrary; let's shift them around to place the label that's projecting an arrow first."""
        , Html.div
            [ class "flex flex-row w-full gap-3 pt-6 px-6 place-center justify-center" ]
            [ Html.div [ class "my-auto" ] [ Html.text "$$\\huge \\Bigg\\{$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Just 0, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 ((+) 1 >> modBy 5 >> mathchar) [ Nothing, Just 0, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 ((+) 2 >> modBy 5 >> mathchar) [ Nothing, Just 0, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 ((+) 3 >> modBy 5 >> mathchar) [ Nothing, Just 0, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 mathchar [ Nothing, Just 1, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            ]
        , Html.div
            [ class "flex flex-row w-full gap-3 pb-6 px-6 place-center justify-center" ]
            [ Html.div [ class "my-auto" ] [ Html.text "$$\\huge \\;$$" ]
            , funnyBijection_ 130 ((+) 1 >> modBy 5 >> mathchar) [ Nothing, Just 1, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 ((+) 2 >> modBy 5 >> mathchar) [ Nothing, Just 1, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 ((+) 3 >> modBy 5 >> mathchar) [ Nothing, Just 1, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 ((+) 4 >> modBy 5 >> mathchar) [ Nothing, Just 1, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge ,$$" ]
            , funnyBijection_ 130 ((+) 4 >> modBy 5 >> mathchar) [ Nothing, Just 0, Nothing, Nothing, Nothing ]
            , Html.div [ class "my-auto" ] [ Html.text "$$\\huge \\Bigg\\}$$" ]
            ]
        , md """
Ah-ha! Now we have two, very obvious, disjoint subsets of size five. This is good; we ought to formalize our *skipping elements* business. When we say "these two memebers of $A\\_{p,\\,i}$ have the same element skips" we really mean "these two memebers of $A\\_{p,\\,i}$ look the same after element shifting". So let's formalize element shifting. We begin by swapping our $p$ letter labels $\\set{a,\\,b,\\, c,\\, \\cdots\\,}$ for integers $\\set{0,1,\\ldots, p - 1}$. Now a *label shift* is simply one or more applications of the following shifting function (applications to each label in each cycle).

$$ \\varphi \\;:\\; j \\; \\longmapsto \\; j + 1 \\mod p$$  

Now "two memebers of $A\\_{p,\\,i}$ look the same modulo element shifting" if they are both members of the same orbit of $\\varphi$. Notice that every orbit of $\\varphi$ (in $A\\_{p,\\,i}$) has size at most $p$ because $\\varphi^p = 1$; there are $10$ elements in $A\\_{5,\\,4}$ hence it was split by $\\varphi$ into at least two orbits. Now, if we can show that every $\\varphi$ orbit has size exactly $p$, we'll be done. We will have solved our whole problem. Consider how $\\varphi$ acts on $c \\in A\\_{p,\\,i}$ with $1 < i < p$. First we ought to verify that $\\varphi(c)$ is actually an element of $A\\_{p,\\,i}$. Luckily, this follows immediately from the bijectivity of $\\varphi$. It only remains to show that $\\varphi^k(c) \\neq c$ for $0 < k < p$. This part is a little trickier. 

Suppose, for the sake of contradiction, that $\\varphi^k(c) = c$. It must be that $\\varphi^k$ is a bijection on the cycles in $c$. Indeed, to say that $\\varphi^k(c) = c$ is to say that $\\varphi^k$ is a bijection on $c$. Moreover, it's clear that $\\varphi^k$ isn't the identity — indeed, $k$ is neither zero nor $p$. Hmm. It's a bit unclear where to go from here. I suppose, for lack of a more insightful claim, since $\\varphi^k$ is a bijection on $c$ it has an inverse which is is also a bijection on $c$. Can we find more bijections? Obviously $\\varphi^p$ (i.e. the identity function) is one. Moreover, the composition of two bijections is a bijection. So, with function composition, $\\varphi^k$, and $\\varphi^p$, we can generate a set (call it $B$) of bijections. What are the elements of this set? Suppose $\\varphi^m$ is an element of $B$, then:

$$ \\underbrace{\\, \\varphi^m \\,\\circ\\, \\varphi^m \\,\\circ\\, \\cdots \\,\\circ\\, \\varphi^m \\,}\\_{n \\text{ times}} \\; = \\; \\varphi^{nm}$$

So $B$ contains each $\\varphi^{nk}$. Next we consider the effect of $\\varphi^p$.

$$\\varphi^m \\; = \\; \\varphi^m \\,\\circ \\underbrace{ \\, \\varphi^p \\,\\circ\\, \\varphi^p \\,\\circ\\, \\cdots \\,\\circ\\, \\varphi^p \\, }\\_{n \\text{ times}} \\; = \\; \\varphi^{m + np}$$

Combining these facts we find that $ B \\,=\\, \\set{ \\varphi^{ nk \\text{ mod } p } \\;|\\; n \\in \\N } $. Now this is a bit interesting. Taking $n = k^{-1} \\ \\text{ mod } p$ we find that $\\varphi$ is an element of $B$. 

$$B = \\set{ 1,\\, \\varphi,\\, \\varphi^2,\\, \\ldots,\\, \\varphi^{p-1}}$$

Surely this is impossible! Let's think about how $\\varphi$ acts on $j \\in \\set{0,\\,1,\\,2,\\,\\ldots,\\, p - 1}$. Denote by $\\chi(j)$ the cycle in $c$ that contains $j$. It follows from the bijectivity of $\\varphi$ that all of the elements in one cycle of $c$ map into the same other cycle in $c$. Stated formally, 

$$ (\\varphi \\circ \\chi)(j) \\; = \\; (\\chi \\circ \\varphi)(j) $$

It follows that the size of cycles in $c$ is invariant under $\\varphi$: 

$$\\begin{aligned}
\\big| \\chi(j) \\big| \\; &= \\; \\big| (\\varphi \\circ \\chi)(j) \\big| \\\\\\\\
&=\\; \\big| (\\chi \\circ \\varphi)(j) \\big| \\\\\\\\
&= \\; \\big| \\chi(\\, j + 1 \\mod p \\,) \\big|
\\end{aligned}$$

$$\\big| \\chi(0) \\big| = \\big| \\chi(1) \\big| = \\big| \\chi(2) \\big| = \\cdots = \\big| \\chi(p-1) \\big|$$

So every cycle in $c$ has the same number of elements. Call it $q$. On the other hand, $c$ contains $i$ cycles, each of our $p$ objects appearing in exactly one.

$$p \\;=\\; i\\,\\cdot\\, q$$

But $p$ is prime and $1 \\neq i \\neq p$; this is impossible. Thus the statement $\\varphi^k(c) = c$ is false, and every orbit of $\\varphi$ contains $p$ elements. It follows that $A\\_{p,\\, i}$ can be divided into disjoint subsets of size of $p$, and that $a_i$ is divisable $p$. 

$$P(p) \\;\\equiv\\; x^p - x \\mod p$$
        """
        ]



-- opts =
--     [ Nothing, Just 0, Just 1, Just 0, Just 0 ]


funnyBicjectionPanel : List (Maybe Int) -> Html ( Int, Maybe Int )
funnyBicjectionPanel opts =
    let
        p =
            List.length opts

        xc =
            List.count ((==) Nothing) opts
    in
    Html.div [ class "flex flex-col items-center justify-center max-w-[800px] mx-auto my-4 py-4 px-8" ]
        [ Html.div [ class "flex flex-row items-stretch justify-center w-full" ]
            [ Html.div [ class "flex flex-col min-w-1/3 overflow-clip rounded-lg border border-flu-200 p-4 justify-center pointer-events-none" ] <|
                List.map
                    (\i ->
                        Html.div
                            [ class "relative flex flex-row items-center" ]
                        <|
                            let
                                curr =
                                    List.getAt i opts |> Maybe.withDefault Nothing

                                -- place n =
                                --     Attr.style "transform" <| "translateX(calc((" ++ String.fromInt n ++ " + 1) * 39.5px + 3px))"
                            in
                            List.concat
                                [ [ math "(" ]
                                , [ Html.div
                                        [ class "cursor-pointer rounded-md pointer-events-auto"
                                        , class <| ifThenElse (curr == Nothing) "bg-hl-1" "hover:bg-hl-11"
                                        , Html.onClick ( i, Nothing )
                                        ]
                                        [ math "\\large \\,x\\,"
                                        ]
                                  ]
                                , List.concatMap
                                    (\k ->
                                        [ math "\\large +"
                                        , Html.div
                                            [ class "cursor-pointer rounded-md pointer-events-auto"
                                            , class <| ifThenElse (curr == Just k) "bg-hl-1" "hover:bg-hl-11"
                                            , Html.onClick ( i, Just k )
                                            ]
                                            [ math "\\large \\,1\\," ]
                                        ]
                                    )
                                    (List.range 0
                                        (if i == 0 then
                                            -1

                                         else
                                            p - i - 1
                                        )
                                    )
                                , [ math ")" ]
                                ]
                    )
                    (List.range 0 (p - 1))
            , Html.div [ class "p-8 my-auto" ] [ math "\\overset{\\scriptsize f}{\\longmapsto}" ]
            , Html.div [ class "w-min px-4 rounded-lg border border-flu-200 flex flex-col justify-center items-center" ] [ funnyBijection opts ]
            ]
        , Html.div [ class "flex flex-row items-center justify-center gap-1" ] <|
            List.concat
                [ [ Html.div [ class " pt-5 " ]
                        [ math <|
                            "$\\large P("
                                ++ String.fromInt p
                                ++ ") = \\prod_{ 0\\leq i < "
                                ++ String.fromInt p
                                ++ "} (x + i) = \\,$"
                        ]
                  ]
                , expand p
                    |> List.sortBy Tuple.second
                    |> List.reverse
                    |> List.map
                        (\( a, i ) ->
                            [ Html.div [ class <| ifThenElse (i == xc) "bg-hl-1" "" ] [ math <| "\\large " ++ showInt a ++ "x^{" ++ showInt i ++ "}" ] ]
                        )
                    |> List.intercalate [ math "\\large + " ]
                ]
        ]


showInt : Int -> String
showInt i =
    case i of
        1 ->
            ""

        _ ->
            String.fromInt i


ifThenElse c a b =
    if c then
        a

    else
        b


expand : Int -> List ( Int, Int )
expand p =
    List.range 0 (p - 1)
        |> List.map (\x -> 1 :: List.repeat x 0)
        |> List.cartesianProduct
        |> List.map List.sum
        |> (\lst -> List.map (\i -> ( List.count ((==) i) lst, i )) (List.range 1 p))


mathchar : Int -> Html msg
mathchar i =
    Char.fromCode (97 + i) |> String.fromChar |> math


funnyBijection : List (Maybe Int) -> Html msg
funnyBijection =
    funnyBijection_ 150 mathchar


funnyBijection_ : Int -> (Int -> Html msg) -> List (Maybe Int) -> Html msg
funnyBijection_ h f lst =
    Html.div
        [ class <| "flex w-max flex-row", Attr.style "height" <| String.fromInt h ++ "px" ]
        [ let
            p =
                List.length lst

            nodes =
                List.range 1 p
          in
          Graph.view
            { nodes = nodes
            , edges = makeBijection nodes lst |> List.concatMap pairs
            , bbox = { w = ( 0, 300 ), h = ( 0, 200 ) }
            , view =
                \i ->
                    ( f (i - 1), ( toFloat i / toFloat (p + 1), 0.5 ) )
            }
        ]


pairs : List a -> List ( a, a )
pairs lst =
    pairs_ lst
        ++ Maybe.withDefault [] (Maybe.map2 (\a b -> [ ( b, a ) ]) (List.head lst) (List.last lst))


pairs_ : List a -> List ( a, a )
pairs_ lst =
    case lst of
        h1 :: h2 :: t ->
            ( h1, h2 ) :: pairs_ (h2 :: t)

        _ ->
            []


mapFirst : (a -> a) -> List a -> List a
mapFirst f lst =
    case lst of
        h :: t ->
            f h :: t

        [] ->
            []


makeBijection : List Int -> List (Maybe Int) -> List (List Int)
makeBijection objects inlst =
    case inlst of
        (Just h) :: t ->
            makeBijection (List.removeAt h objects) t
                |> mapFirst (List.getAt h objects |> Maybe.withDefault -1 |> (::))

        Nothing :: t ->
            makeBijection (List.removeAt 0 objects) t
                |> mapFirst (List.getAt 0 objects |> Maybe.withDefault -1 |> (::))
                |> (\l -> [] :: l)

        [] ->
            [ [] ]


lol =
    [ md """
Thinking modulo $p$ it seems reasonable that most those should cancel out
We know that multiplicative inverses moudlo $p$ are unique, and that $1^{-1} = 1$

Perhaps walking through 

For a start, 



Now we can talk about each coefficient, and dig into that inclusion/exclusion business.

In the $P(5)$ we have

$$a_2 = (1\\cdot 2\\cdot 3) + (1\\cdot 2\\cdot 4) + (1\\cdot 3\\cdot 4) + (2\\cdot 3\\cdot 4)$$

I recently came across this result. I think it's pretty sweet (and I reckon you'll enjoy it too), but before we can get into it we have to have a chat about polynomials. Specifically, we need to recall that ***a polynomial is not a function*** (at least, not to us).

It's true that we do often think about polynomials as though they are functions. Indeed, it's natural to associate **polynomials** and **functions** using the evaluation homomorphism. 

$$ \\begin{aligned} eval \\; : R[\\alpha] \\; \\to& \\;\\; (\\, R \\; \\to \\; R \\,) \\\\\\\\
    (\\, a\\_0 + a\\_1\\alpha + \\cdots + a\\_n\\alpha^n \\,) \\; \\mapsto& \\;\\; 
    (\\, x \\; \\mapsto \\; a\\_0 + a\\_1x + \\cdots + a\\_nx^n \\,)
\\end{aligned} $$

However, this can cause us trouble if we aren't careful - we need to remember that the evaluation homomorphism is not injective. Consider the following example.

$$ \\begin{aligned} f \\, :& \\;\\; (\\Z/4\\Z)[x] \\\\\\\\
    & \\;\\; x^{4}-2x^{3}-x^{2}-2x
\\end{aligned} $$

Clearly $f$ isn't the zero polynomial, but it turns out that $f$ is equal to the zero polynomial under the evaluation homomorphism. I've illustrated this with the following plots.
        """
    , Html.div [ class "w-fill h-[300px] flex flex-row p-4" ] <|
        [ Html.div [ class "grow" ]
            [ Html.div [ class "text-center gap-4 h-full w-full flex flex-col" ]
                [ desmos "https://www.desmos.com/calculator/lhdp5j1kb8"
                , math "x^{4}-2x^{3}-x^{2}-2"
                ]
            ]
        , Html.div [ class "grid place-items-center h-full p-6" ] [ md "$\\equiv$" ]
        , Html.div [ class "grow" ]
            [ Html.div [ class "text-center gap-4 h-full w-full flex flex-col" ]
                [ desmos "https://www.desmos.com/calculator/w3zyzi0uao"
                , math "x^{4}-2x^{3}-x^{2}-2 \\mod 4"
                ]
            ]
        , Html.div [ class "grid place-items-center h-full p-6" ] [ md "$\\equiv$" ]
        , Html.div [ class "grow" ]
            [ Html.div [ class "text-center gap-4 h-full w-full flex flex-col" ]
                [ desmos "https://www.desmos.com/calculator/zixfdu65sv"
                , math "0"
                ]
            ]
        ]
    , md """
Alright, with that out of the way we can get into the result. We begin by fixing any prime $p$; we're going to think about a product in $\\F_p[x]$.

$$\\prod_{c \\in \\F_p} (x + c)$$

How does this product expand? If we write

$$\\prod_{c \\in \\F\\_p} (x + c) = x^{p} + a\\_{p-1}x^{p-1} + \\cdots + a\\_2x^2 + a\\_1x$$

Can we say anthing about each (or any) of the coefficients? Working through a couple of examples might reveal a pattern. Let's start with $\\F\\_3[x]$.

$$\\begin{aligned}
 \\prod_{c \\in \\F\\_3} (x + c) &= x(x+1)(x+2) \\\\\\\\
    &= x^3 + (1 + 2)x^2 + (1\\cdot 2)x \\\\\\\\
    &= x^3 + 3x^2 + 2x \\\\\\\\
    &= x^3 - x
\\end{aligned} $$

Alright, how about $\\F\\_5[x]$?

$$\\begin{aligned}
 \\prod_{c \\in \\F\\_5} (x + c) &= x(x+1)(x+2)(x+3)(x+4) \\\\\\\\
    &= (1 + 2 + 3 + 4)x^4 \\\\\\\\
    &\\quad\\quad + \\, (1\\cdot 2 + 1\\cdot 3 + 1\\cdot 4 + 2\\cdot 3 + 2\\cdot 4 + 3\\cdot 4)x^3 \\\\\\\\
    &\\quad\\quad + \\, (1\\cdot 2\\cdot 3 + 1\\cdot 2\\cdot 4 + 1\\cdot 3\\cdot 4 + 2\\cdot 3\\cdot 4)x^2 \\\\\\\\
    &\\quad\\quad + \\, (1\\cdot 2\\cdot 3\\cdot 4)x \\\\\\\\
    &\\quad \\\\\\\\
    &= x^5 + 10x^4 + 35x^3 + 50x^2 + 24x \\\\\\\\
    &= x^5 - x
\\end{aligned} $$

How about $\\F\\_7[x]$?

$$\\begin{aligned}
 \\prod_{c \\in \\F\\_7} (x + c) &= x(x+1)(x+2)(x+3)(x+4)(x+5)(x+6) \\\\\\\\
    &= x^7 + 21x^6 + 175x^5 + 735x^4 + 1624x^3 + 1764x^2 + 720x \\\\\\\\
    &= x^7 - x
\\end{aligned} $$

This is getting pretty suspicious. Our product doesn't feel particularly well behaved - could it really be that

$$\\prod_{c \\in \\F_p} (x + c) = x^p - x$$

holds in general? Let's dig into the problem.
        """
    ]


math : String -> Html msg
math str =
    Markdown.toHtml
        [ class "md-math" ]
        ("$" ++ str ++ "$")


desmos : String -> Html msg
desmos url =
    Html.div [ class "overflow-clip rounded-lg border border-flu-100 w-full h-full" ] [ Html.iframe [ class "h-[101%] w-[101%]", Attr.src <| url ++ "?embed" ] [] ]


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
            , Html.div [ class "mt-3" ] [ Html.text "When I'm not up to those things, I like to sing, draw, write, and play volleyball." ]
            , Html.div [ class "mt-3" ] [ Html.text "A full copy of my cv is available ", Html.a [ Attr.href "./Joel_Richardson_website_cv.pdf", class "italic underline" ] [ Html.text "here" ] ]
            ]
        , Html.div [ class "w-1/3" ] [ Html.img [ Attr.src "https://lh3.googleusercontent.com/pw/AP1GczMnZRMJyUz8-gdOuBLBCwntJRTblbN-y-H7YyRUmyOMc2n_a64JLnaFWxhezYTngmWhKoxBhNeoDAm-3neJzX2iC1vYu7auvlX7qjOHwSbWKbvmJsTNjkbm_DmJN84qqaOzlpkxg8nu7vyO0Rkblyh_rQ=w2076-h1576-s-no-gm", class "h-full rounded-lg border border-flu-300 object-cover" ] [] ]
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
