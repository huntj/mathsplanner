# @mathsplanner/render

Turns a `Question` object into an accessible HTML string with no browser dependency: maths through KaTeX with HTML and MathML output (bad LaTeX throws rather than reaching students), options for choice, order and match answers, and, on request, answers, misconceptions and the worked solution. `questionStyles` holds the base CSS. The gallery, the practice app and the print tool all use it, so a question looks the same everywhere. Diagrams are labelled placeholders until `@mathsplanner/diagrams` draws them in Phase 3.
