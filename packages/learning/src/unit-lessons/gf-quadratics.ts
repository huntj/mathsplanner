// GCSE Foundation, "Quadratics", as five short lessons, one just before each skill: solving by
// factorising, approximate solutions from a graph, roots and intercepts on a graph, turning
// points, and deducing roots algebraically. Each recaps the Key Stage 3 idea quickly, builds it to
// GCSE level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, Point, Range, UnitLesson } from "./types.ts";

const U = "gf-quadratics";
const range: Range = { xMin: -3, xMax: 5, yMin: -5, yMax: 6 };
const curve = (
  a: number,
  b: number,
  c: number,
  points: Point[] = [],
  lines: { m: number; c: number }[] = [],
  shown: Range = range,
): Picture => ({
  kind: "graph",
  range: shown,
  curves: [{ kind: "quadratic", a, b, c }],
  ...(points.length ? { points } : {}),
  ...(lines.length ? { lines } : {}),
});
// y = x² − 2x − 3 = (x + 1)(x − 3): roots −1 and 3, y-intercept −3, turning point (1, −4).
const main = curve(1, -2, -3);

export const gfQuadratics: UnitLesson[] = [
  lesson(
    U,
    "factorising",
    "GF-A18.a",
    "Solving by factorising",
    "If two things multiply to 0, one of them is 0.",
    [
      problem("The garden", [
        "A rectangular garden is $x$ m wide and $(x + 3)$ m long, with area 28 m². So $x(x + 3) = 28$, or $x^2 + 3x - 28 = 0$. “Find the width.”",
        "By the end of this lesson, you can solve quadratics like this by factorising.",
      ]),
      choose(
        "Warm-up",
        "Factorise $x^2 + 3x - 28$",
        "$(x + 7)(x - 4)$",
        "Multiply to −28, add to 3.",
        [
          ["$(x - 7)(x + 4)$", "That gives $-3x$."],
          ["$(x + 14)(x - 2)$", "They add to 12."],
        ],
      ),
      choose(
        "Warm-up",
        "If $a \\times b = 0$, then",
        "$a = 0$ or $b = 0$",
        "Only zero gives zero.",
        [["$a = b$", "Not necessarily."]],
      ),
      explain(
        "Discover",
        "Zero product",
        [
          "Get 0 on one side, factorise, then set each bracket equal to 0. That gives the **two solutions**.",
          "$(x + 7)(x - 4) = 0$ means $x + 7 = 0$ or $x - 4 = 0$: $x = -7$ or $x = 4$.",
        ],
        { kind: "maths", tex: "(x + 7)(x - 4) = 0 \\Rightarrow x = -7 \\text{ or } x = 4" },
      ),
      choose("Discover", "Solve $(x - 2)(x + 5) = 0$", "$x = 2$ or $x = -5$", "Each bracket = 0.", [
        ["$x = -2$ or $x = 5$", "Mind the signs: $x - 2 = 0$ gives 2."],
        ["$x = 10$", "Each bracket separately."],
      ]),
      worked(
        "The garden",
        "Solve $x^2 + 3x - 28 = 0$.",
        [
          ["$(x + 7)(x - 4) = 0$", "Factorise."],
          ["$x = -7$ or $x = 4$", "Each bracket = 0."],
          ["Width 4 m", "A length can't be negative."],
        ],
        "Check: $4 \\times 7 = 28$ ✓",
      ),
      steps(
        "Together",
        "Solve $x^2 - 5x + 6 = 0$",
        "Factorise.",
        [
          [
            "Factorise:",
            "$(x - 2)(x - 3) = 0$",
            ["$(x + 2)(x + 3) = 0$", "Add to −5."],
            "$(x - 2)(x - 3)$",
          ],
          [
            "Solutions:",
            "$x = 2$ or $x = 3$",
            ["$x = -2$ or $x = -3$", "Set each bracket to 0."],
            "2 or 3",
          ],
        ],
        "Two solutions.",
      ),
      steps(
        "Together",
        "Solve $x^2 = 7x$",
        "Get 0 on one side first.",
        [
          [
            "Rearrange:",
            "$x^2 - 7x = 0$",
            ["Divide by $x$", "That loses the $x = 0$ solution."],
            "$x(x - 7) = 0$",
          ],
          ["Solutions:", "$x = 0$ or $x = 7$", ["$x = 7$ only", "$x = 0$ works too."], "0 or 7"],
        ],
        "Never divide by $x$: you lose a solution.",
      ),
      choose("Your turn", "Solve $x^2 + 6x + 8 = 0$", "$x = -2$ or $x = -4$", "$(x + 2)(x + 4)$.", [
        ["$x = 2$ or $x = 4$", "Signs flip."],
        ["$x = -8$", "Two solutions."],
      ]),
      choose("Your turn", "Solve $x^2 - 9 = 0$", "$x = 3$ or $x = -3$", "$(x + 3)(x - 3)$.", [
        ["$x = 3$ only", "$(-3)^2 = 9$ too."],
        ["$x = 9$", "Square root, both signs."],
      ]),
      choose(
        "Watch out",
        "Jo solves $x^2 + x - 6 = 0$ as $(x + 3)(x - 2)$, so $x = 3$ or $x = -2$. What's wrong?",
        "The signs flip: $x = -3$ or $x = 2$",
        "$x + 3 = 0$ gives $x = -3$.",
        [["Nothing", "Check: $3^2 + 3 - 6 = 6 \\ne 0$."]],
      ),
      mistake(
        "Raj solves $x^2 - 4x = 5$.",
        ["$x(x - 4) = 5$", "So $x = 5$ or $x - 4 = 5$", "$x = 5$ or $x = 9$"],
        1,
        "Get 0 first: $x^2 - 4x - 5 = 0$, so $(x - 5)(x + 1) = 0$: $x = 5$ or $-1$.",
      ),
      choose(
        "Back to the problem",
        "“$x(x + 3) = 28$. Find the width $x$.”",
        "4 m",
        "$(x + 7)(x - 4) = 0$; reject −7.",
        [
          ["−7 m", "A width can't be negative."],
          ["7 m", "$7 \\times 10 = 70$."],
        ],
      ),
      quiz([
        [
          [
            "$x^2 + 5x + 6 = 0$",
            "$x = -2$ or $-3$",
            ["$x = 2$ or $3$", "$x = -6$"],
            "$(x + 2)(x + 3)$.",
          ],
          [
            "$x^2 - 7x + 10 = 0$",
            "$x = 2$ or $5$",
            ["$x = -2$ or $-5$", "$x = 10$"],
            "$(x - 2)(x - 5)$.",
          ],
        ],
        [
          ["$x^2 - 3x = 0$", "$x = 0$ or $3$", ["$x = 3$ only", "$x = -3$"], "$x(x - 3)$."],
          ["$x^2 + 8x = 0$", "$x = 0$ or $-8$", ["$x = -8$ only", "$x = 8$"], "$x(x + 8)$."],
        ],
        [
          ["$x^2 - 16 = 0$", "$x = \\pm 4$", ["$x = 4$", "$x = 8$"], "$(x + 4)(x - 4)$."],
          ["$x^2 - 25 = 0$", "$x = \\pm 5$", ["$x = 5$", "$x = 12.5$"], "$(x + 5)(x - 5)$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "from-graph",
    "GF-A18.b",
    "Solutions from a graph",
    "Where the curve crosses the x-axis, or a line, gives the solutions.",
    [
      problem(
        "Read it off",
        [
          "“Use the graph of $y = x^2 - 2x - 3$ to solve $x^2 - 2x - 3 = 0$.” And “to solve $x^2 - 2x - 3 = 2$.”",
          "By the end of this lesson, you can solve from a graph, even when it doesn't factorise.",
        ],
        main,
      ),
      choose("Warm-up", "On the $x$-axis, $y$ =", "0", "No height.", [
        ["1", "The axis is $y = 0$."],
      ]),
      typed("Warm-up", "$(-1)^2 - 2(-1) - 3$", "0", "$1 + 2 - 3$.", "0."),
      explain(
        "Discover",
        "Where it crosses",
        [
          "Solutions of $x^2 - 2x - 3 = 0$ are where the curve meets $y = 0$: the **x-axis**. Here, $x = -1$ and $x = 3$.",
          "To solve $\\ldots = 2$, draw the line $y = 2$ and read the $x$ values where they cross.",
        ],
        curve(1, -2, -3, [
          { x: -1, y: 0 },
          { x: 3, y: 0 },
        ]),
      ),
      choose(
        "Discover",
        "From the graph, solve $x^2 - 2x - 3 = 0$",
        "$x = -1$ or $x = 3$",
        "Where it meets the $x$-axis.",
        [
          ["$x = -3$", "That's the $y$-intercept."],
          ["$x = 1$", "That's the turning point."],
        ],
        { picture: main },
      ),
      worked(
        "Equals 2",
        "Solve $x^2 - 2x - 3 = 2$ from the graph.",
        [
          ["Draw $y = 2$", "A horizontal line."],
          ["It crosses at $x \\approx -1.4$ and $x \\approx 3.4$", "Read across and down."],
        ],
        "Approximate answers, read from the graph.",
        curve(1, -2, -3, [], [{ m: 0, c: 2 }]),
      ),
      steps(
        "Together",
        "Solve $x^2 - 2x - 3 = -3$",
        "Use the graph.",
        [
          ["Draw the line", "$y = -3$", ["$x = -3$", "Horizontal: $y = -3$."], "$y = -3$"],
          ["It crosses at", "$x = 0$ and $x = 2$", ["$x = -3$", "Read the $x$ values."], "0 or 2"],
        ],
        "Check: $0 - 0 - 3 = -3$ ✓",
        curve(1, -2, -3, [], [{ m: 0, c: -3 }]),
      ),
      choose(
        "Together",
        "Solving $x^2 - 2x - 3 = -5$ from the graph",
        "No solutions: the curve never goes that low",
        "Its lowest point is −4.",
        [
          ["$x = 1$", "At $x = 1$, $y = -4$."],
          ["Two solutions", "The line misses the curve."],
        ],
        { picture: main },
      ),
      choose(
        "Your turn",
        "How many solutions does $x^2 - 2x - 3 = -4$ have?",
        "One: $x = 1$",
        "The line touches the turning point.",
        [
          ["Two", "It only touches."],
          ["None", "It touches at (1, −4)."],
        ],
        { picture: main },
      ),
      choose("Your turn", "Graph solutions are usually", "approximate", "Read from a drawing.", [
        ["exact", "Unless they land on grid lines."],
      ]),
      choose(
        "Watch out",
        "Ana solves $x^2 - 2x - 3 = 0$ by reading where the curve crosses the $y$-axis: −3. What's wrong?",
        "Solutions to $= 0$ are on the $x$-axis",
        "$y = 0$ there.",
        [["Nothing", "−3 is the $y$-intercept."]],
      ),
      mistake(
        "Ben solves $x^2 - 2x - 3 = 2$.",
        ["Draw $y = 2$", "Crosses at $x \\approx -1.4$ and $3.4$", "So $x = 2$"],
        2,
        "The solutions are the $x$ values: about −1.4 and 3.4.",
      ),
      choose(
        "Back to the problem",
        "“Use the graph to solve $x^2 - 2x - 3 = 0$.”",
        "$x = -1$ or $x = 3$",
        "Where $y = 0$.",
        [
          ["$x = -3$", "That's on the $y$-axis."],
          ["$x = 1$", "That's the turning point."],
        ],
        { picture: main },
      ),
      quiz([
        [
          [
            "Solutions to $f(x) = 0$ are where the curve meets",
            "the $x$-axis",
            ["the $y$-axis", "the turning point"],
            "$y = 0$.",
          ],
          ["To solve $f(x) = 4$, draw", "$y = 4$", ["$x = 4$", "$y = x + 4$"], "Horizontal line."],
        ],
        [
          [
            "From the graph: $x^2 - 2x - 3 = 0$",
            "$-1$ and $3$",
            ["$1$ and $-3$", "$-3$ only"],
            "Crossings.",
            main,
          ],
          [
            "From this graph: where is $y = 0$?",
            "$x = -1$ or $3$",
            ["$x = 1$", "$x = 0$"],
            "Crossings.",
            main,
          ],
        ],
        [
          [
            "A line missing the curve means",
            "no solutions",
            ["one solution", "two solutions"],
            "No crossing.",
          ],
          ["A line touching the curve once means", "one solution", ["none", "two"], "Touch."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "roots-intercepts",
    "GF-A11.a",
    "Roots and intercepts",
    "Roots are where y = 0; the y-intercept is where x = 0.",
    [
      problem(
        "Label the graph",
        [
          "“For the graph of $y = x^2 - 2x - 3$, write down the roots and the $y$-intercept.”",
          "By the end of this lesson, you can read them, and find them without a graph.",
        ],
        main,
      ),
      typed("Warm-up", "$y$ when $x = 0$ in $y = x^2 - 2x - 3$", "-3", "Put $x = 0$.", "−3."),
      choose("Warm-up", "The $y$-axis is where", "$x = 0$", "No distance across.", [
        ["$y = 0$", "That's the $x$-axis."],
      ]),
      explain(
        "Discover",
        "Two kinds of crossing",
        [
          "**Roots**: where the curve crosses the **x-axis** ($y = 0$). A quadratic has 0, 1 or 2 roots.",
          "**y-intercept**: where it crosses the **y-axis** ($x = 0$). For $y = ax^2 + bx + c$, it's $c$.",
        ],
        curve(1, -2, -3, [
          { x: -1, y: 0 },
          { x: 3, y: 0 },
          { x: 0, y: -3 },
        ]),
      ),
      choose("Discover", "$y$-intercept of $y = x^2 + 4x + 5$", "(0, 5)", "$c = 5$.", [
        ["(5, 0)", "On the $y$-axis, $x = 0$."],
        ["(0, 4)", "Put $x = 0$."],
      ]),
      worked(
        "Label it",
        "Roots and $y$-intercept of $y = x^2 - 2x - 3$.",
        [
          ["Roots: $x = -1$ and $x = 3$", "Crossing the $x$-axis."],
          ["$y$-intercept: (0, −3)", "Crossing the $y$-axis; $c = -3$."],
        ],
        "Write roots as $x$ values, intercepts as points.",
        main,
      ),
      steps(
        "Together",
        "$y = x^2 - 4$",
        "Roots and intercept.",
        [
          ["$y$-intercept:", "(0, −4)", ["(−4, 0)", "$x = 0$."], "(0, −4)"],
          [
            "Roots ($x^2 = 4$):",
            "$x = 2$ and $x = -2$",
            ["$x = 4$", "Square root, both signs."],
            "±2",
          ],
        ],
        "Symmetrical about the $y$-axis.",
      ),
      choose(
        "Together",
        "A quadratic that never crosses the $x$-axis has",
        "no real roots",
        "It sits entirely above (or below).",
        [["one root", "It doesn't touch."]],
      ),
      choose("Your turn", "$y$-intercept of $y = 2x^2 - x + 7$", "(0, 7)", "$c = 7$.", [
        ["(0, 2)", "That's $a$."],
        ["(7, 0)", "$x = 0$."],
      ]),
      choose(
        "Your turn",
        "Roots of $y = (x - 1)(x + 5)$",
        "$x = 1$ and $x = -5$",
        "Each bracket = 0.",
        [
          ["$x = -1$ and $x = 5$", "Signs flip."],
          ["$x = -5$ only", "Two brackets, two roots."],
        ],
      ),
      choose(
        "Watch out",
        "Ed writes the roots as (0, −1) and (0, 3). What's wrong?",
        "Roots are on the $x$-axis: (−1, 0) and (3, 0)",
        "$y = 0$ at a root.",
        [["Nothing", "Those points are on the $y$-axis."]],
      ),
      mistake(
        "Kim reads $y = x^2 - 6x + 8$.",
        ["$y$-intercept: (0, 8)", "Roots: $(x - 2)(x - 4)$", "Roots at $x = -2$ and $x = -4$"],
        2,
        "$x - 2 = 0$ gives $x = 2$: roots 2 and 4.",
      ),
      choose(
        "Back to the problem",
        "“Write down the roots and the $y$-intercept of $y = x^2 - 2x - 3$.”",
        "Roots −1 and 3; $y$-intercept (0, −3)",
        "From the graph.",
        [
          ["Roots 1 and −3; intercept (0, 3)", "Read carefully."],
          ["Root (1, −4)", "That's the turning point."],
        ],
        { picture: main },
      ),
      quiz([
        [
          ["$y$-intercept of $y = x^2 + 3x - 10$", "(0, −10)", ["(0, 3)", "(−10, 0)"], "$c$."],
          ["$y$-intercept of $y = x^2 - 5$", "(0, −5)", ["(−5, 0)", "(0, 5)"], "$c$."],
        ],
        [
          ["Roots of $y = (x + 2)(x - 6)$", "−2 and 6", ["2 and −6", "−12"], "Flip signs."],
          ["Roots of $y = x(x - 4)$", "0 and 4", ["4 only", "−4"], "Each factor."],
        ],
        [
          ["Roots are where", "$y = 0$", ["$x = 0$", "the curve turns"], "$x$-axis."],
          ["A quadratic can have", "0, 1 or 2 roots", ["exactly 2", "3 roots"], "Up to 2."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "turning-points",
    "GF-A11.b",
    "Turning points",
    "The lowest (or highest) point, halfway between the roots.",
    [
      problem(
        "The bridge arch",
        [
          "A bridge's arch follows a parabola. Engineers need its highest point. For a U-shaped graph like $y = x^2 - 2x - 3$, it's the lowest point.",
          "“Write down the coordinates of the turning point.” By the end of this lesson, you can find it.",
        ],
        main,
      ),
      typed("Warm-up", "Halfway between −1 and 3", "1", "Add and halve.", "1."),
      typed("Warm-up", "$1^2 - 2(1) - 3$", "-4", "$1 - 2 - 3$.", "−4."),
      explain(
        "Discover",
        "Halfway between the roots",
        [
          "A quadratic graph is **symmetrical**. Its **turning point** sits on the line of symmetry, **halfway** between the roots.",
          "If $a > 0$ it's a ∪ with a **minimum**; if $a < 0$ it's a ∩ with a **maximum**.",
        ],
        curve(1, -2, -3, [{ x: 1, y: -4 }]),
      ),
      choose("Discover", "$y = -x^2 + 4$ has", "a maximum", "Negative $x^2$: ∩ shape.", [
        ["a minimum", "$a < 0$: it turns at the top."],
      ]),
      worked(
        "The turning point",
        "Turning point of $y = x^2 - 2x - 3$.",
        [
          ["Roots −1 and 3; halfway: $x = 1$", "Line of symmetry."],
          ["$y = 1 - 2 - 3 = -4$", "Substitute."],
          ["Turning point (1, −4), a minimum", "∪ shape."],
        ],
        "Read it from the graph, or calculate.",
        main,
      ),
      steps(
        "Together",
        "$y = x^2 - 6x + 5$",
        "Turning point.",
        [
          [
            "Roots ($(x - 1)(x - 5)$):",
            "1 and 5",
            ["−1 and −5", "Flip signs."],
            "Halfway: $x = 3$",
          ],
          ["$y$ at $x = 3$:", "−4", ["4", "$9 - 18 + 5$."], "(3, −4)"],
        ],
        "A minimum at (3, −4).",
      ),
      choose(
        "Together",
        "Line of symmetry of $y = x^2 - 2x - 3$",
        "$x = 1$",
        "Through the turning point.",
        [
          ["$y = 1$", "It's vertical: $x = 1$."],
          ["$x = -4$", "That's the $y$ value."],
        ],
        { picture: main },
      ),
      choose("Your turn", "Roots 2 and 8. The turning point's $x$", "5", "Halfway.", [
        ["6", "Add and halve: 10 ÷ 2."],
        ["10", "Halve it."],
      ]),
      choose(
        "Your turn",
        "Turning point of $y = x^2 + 1$",
        "(0, 1), a minimum",
        "Lowest at $x = 0$.",
        [
          ["(1, 0)", "At $x = 0$, $y = 1$."],
          ["(0, 1), a maximum", "∪ shape: minimum."],
        ],
      ),
      choose(
        "Watch out",
        "Sam says every quadratic's turning point is at $x = 0$. Is he right?",
        "No: only when the graph is symmetrical about the $y$-axis",
        "It's halfway between the roots.",
        [["Yes", "$y = x^2 - 2x - 3$ turns at $x = 1$."]],
      ),
      mistake(
        "Mia finds the turning point of $y = x^2 - 4x$.",
        ["Roots: 0 and 4", "Halfway: $x = 2$", "$y = 4 - 8 = 4$"],
        2,
        "$4 - 8 = -4$: turning point (2, −4).",
      ),
      choose(
        "Back to the problem",
        "“Write down the coordinates of the turning point of $y = x^2 - 2x - 3$.”",
        "(1, −4)",
        "Halfway between −1 and 3.",
        [
          ["(−4, 1)", "$x$ first."],
          ["(0, −3)", "That's the $y$-intercept."],
        ],
        { picture: main },
      ),
      quiz([
        [
          ["Roots 0 and 6: turning point $x$", "3", ["6", "0"], "Halfway."],
          ["Roots −3 and 5: turning point $x$", "1", ["4", "2"], "Halfway."],
        ],
        [
          ["$y = x^2 - 2x + 1$ turning point", "(1, 0)", ["(0, 1)", "(−1, 0)"], "$(x - 1)^2$."],
          ["$y = x^2 + 4x$ turning point", "(−2, −4)", ["(2, 12)", "(−4, 0)"], "Roots 0, −4."],
        ],
        [
          ["$a > 0$: the turning point is a", "minimum", ["maximum", "root"], "∪."],
          ["$a < 0$: the turning point is a", "maximum", ["minimum", "root"], "∩."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "deduce-roots",
    "GF-A11.c",
    "Roots by algebra",
    "Factorise to find where the graph crosses the x-axis.",
    [
      problem("Sketch it", [
        "“Sketch the graph of $y = x^2 + 2x - 8$, showing where it crosses the axes.” No graph is given: you deduce the roots.",
        "By the end of this lesson, you can find the roots and sketch the curve.",
      ]),
      choose(
        "Warm-up",
        "Factorise $x^2 + 2x - 8$",
        "$(x + 4)(x - 2)$",
        "Multiply to −8, add to 2.",
        [
          ["$(x - 4)(x + 2)$", "That gives $-2x$."],
          ["$(x + 8)(x - 1)$", "They add to 7."],
        ],
      ),
      typed("Warm-up", "$y$-intercept of $y = x^2 + 2x - 8$ (the $y$ value)", "-8", "$c$.", "−8."),
      explain(
        "Discover",
        "Roots from factors",
        [
          "Set $y = 0$ and factorise: each bracket gives a root. With the $y$-intercept ($c$) and the ∪ or ∩ shape, you can sketch it.",
          "$(x + 4)(x - 2) = 0$: roots $x = -4$ and $x = 2$.",
        ],
        // Its own range: roots −4 and 2, turning point (−1, −9).
        curve(
          1,
          2,
          -8,
          [
            { x: -4, y: 0 },
            { x: 2, y: 0 },
          ],
          [],
          { xMin: -6, xMax: 4, yMin: -10, yMax: 6 },
        ),
      ),
      choose(
        "Discover",
        "Roots of $y = x^2 - x - 12$",
        "$x = 4$ and $x = -3$",
        "$(x - 4)(x + 3)$.",
        [
          ["$x = -4$ and $x = 3$", "Signs flip."],
          ["$x = 12$", "Factorise."],
        ],
      ),
      worked(
        "Sketch it",
        "Sketch $y = x^2 + 2x - 8$.",
        [
          ["Roots: $x = -4$, $x = 2$", "Factorise."],
          ["$y$-intercept: (0, −8)", "$c = -8$."],
          ["∪ shape, turning at $x = -1$", "Halfway between the roots."],
        ],
        "Mark both roots and the intercept on the sketch.",
      ),
      steps(
        "Together",
        "Roots of $y = x^2 - 6x$",
        "Common factor.",
        [
          ["Factorise:", "$x(x - 6)$", ["$(x - 6)^2$", "Take out $x$."], "$x(x - 6)$"],
          ["Roots:", "$x = 0$ and $x = 6$", ["$x = 6$ only", "$x = 0$ too."], "0 and 6"],
        ],
        "The curve passes through the origin.",
      ),
      choose(
        "Together",
        "Roots of $y = x^2 - 49$",
        "$x = 7$ and $x = -7$",
        "Difference of squares.",
        [
          ["$x = 49$", "Square root."],
          ["$x = 7$ only", "Both signs."],
        ],
      ),
      choose(
        "Your turn",
        "Roots of $y = x^2 + 7x + 10$",
        "$x = -2$ and $x = -5$",
        "$(x + 2)(x + 5)$.",
        [
          ["$x = 2$ and $x = 5$", "Signs flip."],
          ["$x = -10$", "Factorise."],
        ],
      ),
      choose(
        "Your turn",
        "Where does $y = (x - 3)^2$ touch the $x$-axis?",
        "Only at $x = 3$",
        "A repeated root.",
        [
          ["At $x = 3$ and $x = -3$", "Both brackets are $x - 3$."],
          ["Nowhere", "It touches at 3."],
        ],
      ),
      choose(
        "Watch out",
        "Raj says the roots of $y = (x + 6)(x - 1)$ are 6 and −1. What's wrong?",
        "Set each bracket to 0: $x = -6$ and $x = 1$",
        "The signs flip.",
        [["Nothing", "Check: $(6 + 6)(6 - 1) \\ne 0$."]],
      ),
      mistake(
        "Leo finds the roots of $y = x^2 - 5x + 4$.",
        ["Factorise: $(x - 1)(x - 4)$", "Set to 0", "Roots −1 and −4"],
        2,
        "$x - 1 = 0$ gives $x = 1$: roots 1 and 4.",
      ),
      choose(
        "Back to the problem",
        "“Sketch $y = x^2 + 2x - 8$. Where does it cross the $x$-axis?”",
        "At $x = -4$ and $x = 2$",
        "$(x + 4)(x - 2)$.",
        [
          ["At $x = 4$ and $x = -2$", "Signs flip."],
          ["At $y = -8$", "That's the $y$-axis."],
        ],
      ),
      quiz([
        [
          ["Roots of $y = x^2 + x - 2$", "1 and −2", ["−1 and 2", "2 only"], "$(x + 2)(x - 1)$."],
          ["Roots of $y = x^2 - 2x - 15$", "5 and −3", ["−5 and 3", "15"], "$(x - 5)(x + 3)$."],
        ],
        [
          ["Roots of $y = x^2 - 10x$", "0 and 10", ["10 only", "−10"], "$x(x - 10)$."],
          ["Roots of $y = x^2 + 3x$", "0 and −3", ["−3 only", "3"], "$x(x + 3)$."],
        ],
        [
          ["$y = (x + 1)^2$ meets the $x$-axis", "once, at $-1$", ["twice", "never"], "Repeated."],
          ["$y = x^2 + 5$ meets the $x$-axis", "never", ["once", "twice"], "Always ≥ 5."],
        ],
      ]),
    ],
  ),
];
