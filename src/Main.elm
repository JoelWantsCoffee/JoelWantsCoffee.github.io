module Main exposing (main)

import Html exposing (..)
import Html.Attributes exposing (..)
import List
import Markdown
import Html.Events exposing (onClick)

type Msg = Noth

navbar = div [ class "navbar" ] [ 
        div [ 
            style "flex" "1",
            style "padding-left" "2em"
         ] [ text "Joel's Website" ],
        ul [
            style "flex" "1",
            style "text-align" "right"
        ] [ 
            li [] [ text "Home" ],
            li [] [ text "Contact" ],
            text "|"
        ]
    ]

scroll x = div [ class "main" ] [ 
    div [ 
            style "display" "flex", 
            style "flex-direction" "column",
            style "align-items" "center"
        ] x
 ]


markdown x = Markdown.toHtml [class "content"] x

tmp = markdown """
# Some heading

idk some text probabling explaing something about computer graphics or cheese or something honestly who knows at this poing ngl

## Cheese

```
public class main {
  public static int main( String[][] args ) {
    return 0;
  }
}
```

$\\displaystyle\\sum_{n=1}^\\infty n = -\\frac{1}{2}$
"""

pan i c o = div [ class "pan", onClick o ] [ 
    div [ class "pan-image" ] [ i ],
    div [ class "pan-content" ] [ c ]
 ]

art x = div [ class "art" ] [ x ]

view model = div [ class "whole-page" ] [
        navbar,
        scroll [
            -- pan (text "img") (markdown "# title\na brief description") Noth,
            art tmp
        ]
        
    ]
    


main =
    view "dummy model"