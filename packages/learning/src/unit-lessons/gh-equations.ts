// GCSE Higher, "Equations, iteration and inequalities", as six short lessons, one just before
// each skill: solving equations from graphs, linear and quadratic simultaneous equations,
// iteration, regions for inequalities in two variables, quadratic inequalities and set notation.
// Each recaps the Foundation idea quickly, builds it to Higher level, names the common mistakes
// and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, UnitLesson } from "./types.ts";

const U = "gh-equations";

const crossing: Picture = {
  kind: "graph",
  range: { xMin: -2, xMax: 6, yMin: -2, yMax: 8 },
  lines: [
    { m: 2, c: -1 },
    { m: -1, c: 5 },
  ],
  points: [{ x: 2, y: 3 }],
};
const lineCurve: Picture = {
  kind: "graph",
  range: { xMin: -4, xMax: 4, yMin: -2, yMax: 10 },
  lines: [{ m: 1, c: 2 }],
  curves: [{ kind: "quadratic", a: 1, b: 0, c: 0 }],
  points: [
    { x: -1, y: 1 },
    { x: 2, y: 4 },
  ],
};
const region: Picture = {
  kind: "graph",
  range: { xMin: -1, xMax: 6, yMin: -1, yMax: 6 },
  lines: [
    { m: 0, c: 1 },
    { m: -1, c: 5 },
  ],
  verticals: [1],
  points: [{ x: 2, y: 2 }],
};
const parabola: Picture = {
  kind: "graph",
  range: { xMin: -4, xMax: 4, yMin: -10, yMax: 8 },
  curves: [{ kind: "quadratic", a: 1, b: 0, c: -9 }],
  points: [
    { x: -3, y: 0 },
    { x: 3, y: 0 },
  ],
};
const iterations: Picture = {
  kind: "table",
  head: ["n", "0", "1", "2", "3"],
  rows: [["$x_n$", "2", "2.080", "2.068", "2.070"]],
};

export const ghEquations: UnitLesson[] = [
  lesson(
    U,
    "from-graphs",
    "GH-A17",
    "Solving equations with graphs",
    "Where two graphs cross, their equations are equal.",
    [
      problem(
        "Read it off",
        [
          "The graphs of $y = 2x - 1$ and $y = 5 - x$ are drawn. “Use the graph to solve $2x - 1 = 5 - x$.”",
          "By the end of this lesson, you can solve equations from where graphs meet.",
        ],
        crossing,
      ),
      typed("Warm-up", "$y = 2x - 1$ when $x = 2$", "3", "$4 - 1$.", "3."),
      typed("Warm-up", "$y = 5 - x$ when $x = 2$", "3", "$5 - 2$.", "3."),
      explain(
        "Discover",
        "Equal where they meet",
        [
          "At the crossing point both graphs have the same $y$ for the same $x$. So that $x$ solves left side = right side.",
          "Read the $x$-coordinate of the crossing. Graph answers are approximate unless they land on grid points.",
        ],
        crossing,
      ),
      choose(
        "Discover",
        "The lines cross at",
        "(2, 3)",
        "Read the point.",
        [
          ["(3, 2)", "$x$ first."],
          ["(0, 5)", "That's one $y$-intercept."],
        ],
        { picture: crossing },
      ),
      worked(
        "The problem",
        "Solve $2x - 1 = 5 - x$ from the graph.",
        [
          ["Crossing at (2, 3)", "Read it."],
          ["So $x = 2$", "The $x$-coordinate."],
        ],
        "Check: $3x = 6$.",
        crossing,
      ),
      steps(
        "Together",
        "Use $y = x^2$ to solve $x^2 = x + 2$",
        "Draw a line.",
        [
          [
            "Draw the line",
            "$y = x + 2$",
            ["$y = 2$", "The other side of the equation."],
            "$y = x + 2$",
          ],
          [
            "It crosses $y = x^2$ at",
            "$x = -1$ and $x = 2$",
            ["$y = 1$ and $y = 4$", "Read the $x$-values."],
            "$-1$ and 2",
          ],
        ],
        "Two crossings: two solutions.",
        lineCurve,
      ),
      choose("Together", "To solve $x^2 - 3 = 0$ using $y = x^2$, draw", "$y = 3$", "$x^2 = 3$.", [
        ["$y = -3$", "Rearrange first."],
        ["$x = 3$", "A horizontal line."],
      ]),
      choose(
        "Your turn",
        "The $y$ in the answer to $2x - 1 = 5 - x$ is",
        "not needed: only $x$ solves it",
        "Read $x$.",
        [["the answer", "The equation is in $x$."]],
      ),
      choose("Your turn", "$y = x^2$ and $y = 5$ cross at about", "$x = \\pm 2.2$", "$\\sqrt5$.", [
        ["$x = 5$", "$5^2 = 25$."],
        ["$x = 2.5$", "Square root, not half."],
      ]),
      choose(
        "Watch out",
        "Ivy gives the $y$-coordinate of the crossing as the solution. What's wrong?",
        "The equation is in $x$: give the $x$-value",
        "Read across.",
        [["Nothing", "Both graphs share that $x$."]],
      ),
      mistake(
        "Ben uses $y = x^2$ to solve $x^2 - x - 2 = 0$.",
        ["Rearrange: $x^2 = x + 2$", "Draw $y = x - 2$", "Read the crossings"],
        1,
        "The line is $y = x + 2$.",
      ),
      choose(
        "Back to the problem",
        "“Use the graph to solve $2x - 1 = 5 - x$.”",
        "$x = 2$",
        "Crossing (2, 3).",
        [
          ["$x = 3$", "That's $y$."],
          ["$x = 5$", "That's an intercept."],
        ],
        { picture: crossing },
      ),
      quiz([
        [
          ["Graphs cross at (4, 1). The solution is", "$x = 4$", ["$x = 1$", "$x = 5$"], "$x$."],
          ["Graphs cross at (−1, 6). The solution is", "$x = -1$", ["$x = 6$", "$x = 5$"], "$x$."],
        ],
        [
          [
            "To solve $x^2 = 2x + 3$ with $y = x^2$, draw",
            "$y = 2x + 3$",
            ["$y = 3$", "$y = 2x$"],
            "Other side.",
          ],
          [
            "To solve $x^2 + x = 4$ with $y = x^2$, draw",
            "$y = 4 - x$",
            ["$y = 4$", "$y = x + 4$"],
            "Rearrange.",
          ],
        ],
        [
          [
            "Two crossing points means",
            "two solutions",
            ["one solution", "no solutions"],
            "Count them.",
          ],
          [
            "No crossing points means",
            "no real solutions",
            ["one solution", "infinitely many"],
            "Never equal.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "linear-quadratic",
    "GH-A19",
    "Linear and quadratic simultaneous equations",
    "Substitute the linear one into the quadratic, then solve.",
    [
      problem(
        "A line and a curve",
        [
          "“Solve the simultaneous equations $y = x^2$ and $y = x + 2$.” A line can cross a curve twice.",
          "By the end of this lesson, you can solve it algebraically.",
        ],
        lineCurve,
      ),
      choose("Warm-up", "Factorise $x^2 - x - 2$", "$(x - 2)(x + 1)$", "−2 and 1.", [
        ["$(x + 2)(x - 1)$", "Gives $+x$."],
        ["$(x - 2)(x - 1)$", "Gives $+2$."],
      ]),
      typed("Warm-up", "If $x = -1$, $y = x + 2 =$", "1", "$-1 + 2$.", "1."),
      explain(
        "Discover",
        "Substitute",
        [
          "Make $x$ or $y$ the subject of the **linear** equation, then substitute into the quadratic. You get a quadratic in one letter.",
          "Solve it, then substitute each answer back into the linear equation to find its partner. There are usually two pairs.",
        ],
        lineCurve,
      ),
      choose(
        "Discover",
        "Substituting $y = x + 2$ into $y = x^2$ gives",
        "$x^2 = x + 2$",
        "Replace $y$.",
        [
          ["$x + 2 = 2$", "Replace $y$ in $y = x^2$."],
          ["$y^2 = x + 2$", "Replace $y$, not $x$."],
        ],
      ),
      worked(
        "The problem",
        "$y = x^2$ and $y = x + 2$.",
        [
          ["$x^2 - x - 2 = 0$, so $(x - 2)(x + 1) = 0$", "Substitute, rearrange."],
          ["$x = 2$ or $x = -1$", "Solve."],
          ["$y = 4$ or $y = 1$: (2, 4) and (−1, 1)", "Back into $y = x + 2$."],
        ],
        "They match the crossing points.",
        lineCurve,
      ),
      steps(
        "Together",
        "Solve $x^2 + y^2 = 25$ and $y = x + 1$",
        "A circle and a line.",
        [
          [
            "Substitute:",
            "$x^2 + (x + 1)^2 = 25$, so $2x^2 + 2x - 24 = 0$",
            ["$x^2 + x + 1 = 25$", "Square the whole bracket."],
            "$x^2 + x - 12 = 0$",
          ],
          [
            "Solve:",
            "$x = 3, y = 4$ or $x = -4, y = -3$",
            ["$x = 3$ or $-4$ only", "Find each $y$."],
            "(3, 4) and (−4, −3)",
          ],
        ],
        "Pair each $x$ with its $y$.",
      ),
      choose("Together", "Solve $y = 2x$ and $y = x^2$", "(0, 0) and (2, 4)", "$x^2 - 2x = 0$.", [
        ["$x = 2$ only", "Don't divide by $x$: you lose 0."],
        ["(2, 4) only", "$x = 0$ works too."],
      ]),
      choose(
        "Your turn",
        "$y = x^2 - 3$ and $y = 2x$: the quadratic",
        "$x^2 - 2x - 3 = 0$",
        "Substitute and rearrange.",
        [
          ["$x^2 + 2x - 3 = 0$", "Take $2x$ across."],
          ["$x^2 - 3 = 0$", "Use both equations."],
        ],
      ),
      choose("Your turn", "So the solutions", "(3, 6) and (−1, −2)", "$(x - 3)(x + 1)$.", [
        ["(3, 6) only", "Two answers."],
        ["(−3, −6) and (1, 2)", "Signs."],
      ]),
      choose(
        "Watch out",
        "Kim finds $x = 2$ and $x = -1$, then stops. What's missing?",
        "The $y$-values: each solution is a pair",
        "Substitute back.",
        [["Nothing", "Give coordinates."]],
      ),
      mistake(
        "Leo solves $y = x + 1$ and $x^2 + y^2 = 13$.",
        ["$x^2 + x^2 + 1 = 13$", "$2x^2 = 12$", "$x = \\pm\\sqrt6$"],
        0,
        "$(x + 1)^2 = x^2 + 2x + 1$, so $2x^2 + 2x - 12 = 0$: $x = 2$ or $-3$.",
      ),
      choose(
        "Back to the problem",
        "“Solve $y = x^2$ and $y = x + 2$.”",
        "$x = 2, y = 4$ and $x = -1, y = 1$",
        "Two pairs.",
        [
          ["$x = 2$ or $-1$", "Give $y$ too."],
          ["$x = 4, y = 2$ and $x = 1, y = -1$", "Swapped."],
        ],
        { picture: lineCurve },
      ),
      quiz([
        [
          [
            "$y = x^2$, $y = 4$: solutions",
            "(2, 4), (−2, 4)",
            ["(2, 4) only", "(4, 2), (4, −2)"],
            "±2.",
          ],
          [
            "$y = x^2$, $y = 9$: solutions",
            "(3, 9), (−3, 9)",
            ["(3, 9) only", "(9, 3), (9, −3)"],
            "±3.",
          ],
        ],
        [
          [
            "Substitute the",
            "linear into the quadratic",
            ["quadratic into the linear", "either, then add"],
            "Rearrange the line.",
          ],
          ["Usually there are", "two solution pairs", ["one", "four"], "Line meets curve twice."],
        ],
        [
          ["$y = x^2$, $y = 3x$: $x$-values", "0 and 3", ["3 only", "−3 and 3"], "$x(x - 3)$."],
          ["$y = x^2$, $y = 5x$: $x$-values", "0 and 5", ["5 only", "−5 and 5"], "$x(x - 5)$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "iteration",
    "GH-A20",
    "Iteration",
    "Feed each answer back into the formula until it settles.",
    [
      problem(
        "Closer and closer",
        [
          "“Show that $x^3 + 2x - 13 = 0$ has a solution between 2 and 3.” Then “Use $x_{n+1} = \\sqrt[3]{13 - 2x_n}$ with $x_0 = 2$ to find it to 2 decimal places.”",
          "By the end of this lesson, you can do both.",
        ],
        iterations,
      ),
      typed("Warm-up", "$2^3 + 2(2) - 13$", "-1", "$8 + 4 - 13$.", "−1."),
      typed("Warm-up", "$3^3 + 2(3) - 13$", "20", "$27 + 6 - 13$.", "20."),
      explain(
        "Discover",
        "Sign change, then repeat",
        [
          "If the expression is negative at one value and positive at another, it crosses 0 in between: there's a solution there.",
          "An **iteration formula** gives the next estimate from the last. Put $x_0$ in to get $x_1$, then $x_1$ to get $x_2$, and so on until the answers agree to the accuracy asked.",
        ],
        iterations,
      ),
      choose(
        "Discover",
        "−1 at $x = 2$ and 20 at $x = 3$ shows",
        "a solution between 2 and 3",
        "Sign change.",
        [
          ["no solution", "It changes sign."],
          ["the solution is 2.5", "Only that it's between."],
        ],
      ),
      worked(
        "The iteration",
        "$x_{n+1} = \\sqrt[3]{13 - 2x_n}$, $x_0 = 2$.",
        [
          ["$x_1 = \\sqrt[3]{9} = 2.080$", "First."],
          ["$x_2 = 2.068$, $x_3 = 2.070$, $x_4 = 2.069$", "Repeat."],
          ["$x = 2.07$ (2 d.p.)", "They agree."],
        ],
        "Use the ANS key: type the formula once and press = repeatedly.",
        iterations,
      ),
      steps(
        "Together",
        "Where the formula comes from",
        "Rearrange $x^3 + 2x - 13 = 0$.",
        [
          ["$x^3 =$", "$13 - 2x$", ["$2x - 13$", "Move $2x - 13$ across."], "$13 - 2x$"],
          [
            "So",
            "$x = \\sqrt[3]{13 - 2x}$",
            ["$x = 13 - 2x^3$", "Cube root both sides."],
            "The iteration formula",
          ],
        ],
        "Then add the $n$ and $n + 1$ labels.",
      ),
      choose(
        "Together",
        "To show the answer is 2.07 to 2 d.p., check the sign at",
        "2.065 and 2.075",
        "The bounds of 2.07.",
        [
          ["2.06 and 2.08", "Use half a hundredth either side."],
          ["2 and 3", "Too wide."],
        ],
      ),
      typed(
        "Your turn",
        "$x_{n+1} = \\frac{10}{x_n + 3}$, $x_0 = 2$. $x_1$",
        "2",
        "$\\frac{10}{5}$.",
        "2.",
      ),
      choose("Your turn", "$x_1 = x_0$ there means", "2 is an exact solution", "It stays put.", [
        ["the formula fails", "It has settled."],
        ["start again", "It's found it."],
      ]),
      choose(
        "Watch out",
        "Ola uses $x_0$ every time instead of the latest answer. What's wrong?",
        "Feed each new answer back in",
        "That's iteration.",
        [["Nothing", "Otherwise nothing changes."]],
      ),
      mistake(
        "Ben shows $x^3 - 5 = 0$ has a root between 1 and 2.",
        ["At 1: $1 - 5 = -4$", "At 2: $8 - 5 = 3$", "Both small, so the root is 1.5"],
        2,
        "A sign change shows a root lies between 1 and 2, not where. (It's about 1.71.)",
      ),
      choose(
        "Back to the problem",
        "“Find the solution to 2 decimal places.”",
        "2.07",
        "$x_3 = 2.070$, $x_4 = 2.069$.",
        [
          ["2.08", "That's $x_1$: keep iterating."],
          ["2.1", "2 d.p."],
        ],
        { picture: iterations },
      ),
      quiz([
        [
          [
            "$f(1) = -2$, $f(2) = 5$ shows",
            "a root between 1 and 2",
            ["no root", "a root at 1.5"],
            "Sign change.",
          ],
          [
            "$f(3) = 4$, $f(4) = 9$ shows",
            "nothing about a root there",
            ["a root between 3 and 4", "a root at 3"],
            "No sign change.",
          ],
        ],
        [
          ["$x_{n+1} = \\frac{x_n}{2} + 1$, $x_0 = 4$: $x_1$", "3", ["2", "5"], "$2 + 1$."],
          ["Then $x_2$", "2.5", ["3", "1.5"], "$1.5 + 1$."],
        ],
        [
          [
            "Iterate until answers",
            "agree to the accuracy asked",
            ["reach 0", "change sign"],
            "Settle.",
          ],
          [
            "An iteration formula comes from",
            "rearranging the equation",
            ["the graph only", "guessing"],
            "x = …",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "regions",
    "GH-A22.a",
    "Inequalities in two variables",
    "Draw each boundary line, then find the side that fits.",
    [
      problem(
        "The region R",
        [
          "“Show the region R that satisfies $y \\geq 1$, $x \\geq 1$ and $x + y \\leq 5$.” And “Is (2, 2) in R?”",
          "By the end of this lesson, you can draw and read regions.",
        ],
        region,
      ),
      typed("Warm-up", "$x + y$ at (2, 2)", "4", "2 + 2.", "4."),
      choose("Warm-up", "Is $4 \\leq 5$?", "yes", "4 is less.", [["no", "4 < 5."]]),
      explain(
        "Discover",
        "Lines, then sides",
        [
          "Turn each inequality into a line: $y = 1$, $x = 1$, $x + y = 5$. Solid lines for ≤ or ≥, dashed for < or >.",
          "Test a point (like (0, 0)) to find which side satisfies each one. The region is where all of them overlap.",
        ],
        region,
      ),
      choose("Discover", "$y < 3$ is drawn with", "a dashed line", "Strict inequality.", [
        ["a solid line", "Solid for ≤."],
        ["no line", "The boundary shows where it stops."],
      ]),
      worked(
        "Region R",
        "$y \\geq 1$, $x \\geq 1$, $x + y \\leq 5$.",
        [
          ["Above $y = 1$, right of $x = 1$", "First two."],
          ["Below $x + y = 5$: test (0, 0): 0 ≤ 5 ✓", "Third."],
          ["R is the triangle with corners (1, 1), (4, 1), (1, 4)", "Overlap."],
        ],
        "Shade it and label R.",
        region,
      ),
      steps(
        "Together",
        "Is (2, 2) in R?",
        "Check each.",
        [
          ["$y \\geq 1$ and $x \\geq 1$:", "yes, both", ["no", "2 ≥ 1."], "Yes"],
          ["$x + y \\leq 5$:", "4 ≤ 5: yes", ["no", "4 is less."], "In R"],
        ],
        "It must pass every one.",
        region,
      ),
      choose(
        "Together",
        "Is (4, 2) in R?",
        "no: $4 + 2 = 6 > 5$",
        "Fails one.",
        [["yes", "Check $x + y$."]],
        { picture: region },
      ),
      choose("Your turn", "Which point satisfies $y > 2x$?", "(1, 3)", "3 > 2.", [
        ["(2, 3)", "3 > 4 is false."],
        ["(1, 2)", "2 > 2 is false."],
      ]),
      choose(
        "Your turn",
        "The region $x + y < 4$ is",
        "below the line $x + y = 4$",
        "Test (0, 0).",
        [
          ["above it", "(0, 0) gives 0 < 4."],
          ["on it", "Strict: not on."],
        ],
      ),
      choose(
        "Watch out",
        "Kim shades the side that doesn't fit. How to avoid it?",
        "Test a point not on the line",
        "(0, 0) is easy.",
        [["Always shade above", "It depends on the inequality."]],
      ),
      mistake(
        "Leo draws $y \\leq 2x + 1$.",
        ["Line $y = 2x + 1$, dashed", "Test (0, 0): 0 ≤ 1 ✓", "Region below the line"],
        0,
        "≤ includes the line: draw it solid.",
      ),
      choose(
        "Back to the problem",
        "“Is (2, 2) in R?”",
        "Yes: it satisfies all three",
        "Check each.",
        [
          ["No: it's on a line", "It isn't on any boundary."],
          ["Only two of them", "All three hold."],
        ],
        { picture: region },
      ),
      quiz([
        [
          ["$y \\geq 3$ uses a", "solid line", ["dashed line", "curve"], "Includes."],
          ["$x < -1$ uses a", "dashed line", ["solid line", "curve"], "Strict."],
        ],
        [
          ["Does (3, 1) satisfy $x + y \\leq 4$?", "yes", ["no", "only on the line"], "4 ≤ 4."],
          ["Does (3, 2) satisfy $x + y < 5$?", "no", ["yes", "only if solid"], "5 < 5 is false."],
        ],
        [
          [
            "The region of several inequalities is",
            "where all overlap",
            ["any one", "the lines only"],
            "All true.",
          ],
          ["A good test point is usually", "(0, 0)", ["on the line", "(100, 100)"], "Easy."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "quadratic-inequalities",
    "GH-A22.b",
    "Quadratic inequalities",
    "Find the roots, sketch the curve, then read where it's above or below 0.",
    [
      problem(
        "Between or outside?",
        [
          "“Solve $x^2 - 9 < 0$.” And “Solve $x^2 - x - 6 \\geq 0$.” Squaring makes these different from linear inequalities.",
          "By the end of this lesson, you can solve both with a sketch.",
        ],
        parabola,
      ),
      typed("Warm-up", "Positive root of $x^2 - 9 = 0$", "3", "$x^2 = 9$.", "3."),
      choose("Warm-up", "Factorise $x^2 - x - 6$", "$(x - 3)(x + 2)$", "−3 and 2.", [
        ["$(x + 3)(x - 2)$", "Gives $+x$."],
        ["$(x - 6)(x + 1)$", "Gives $-5x$."],
      ]),
      explain(
        "Discover",
        "Sketch it",
        [
          "Solve = 0 to find the roots. Sketch the ∪ through them. **Below** the axis ($< 0$) is **between** the roots; **above** ($> 0$) is **outside** them.",
          "So $x^2 - 9 < 0$ is $-3 < x < 3$: one inequality, two ends.",
        ],
        parabola,
      ),
      choose(
        "Discover",
        "Where is $x^2 - 9$ negative?",
        "between −3 and 3",
        "Below the axis.",
        [
          ["$x < 3$", "$x = -5$ gives 16."],
          ["outside ±3", "That's where it's positive."],
        ],
        { picture: parabola },
      ),
      worked(
        "The second",
        "Solve $x^2 - x - 6 \\geq 0$.",
        [
          ["Roots: $(x - 3)(x + 2) = 0$: 3 and −2", "Factorise."],
          ["∪ shape: above the axis outside the roots", "Sketch."],
          ["$x \\leq -2$ or $x \\geq 3$", "Two parts."],
        ],
        "≥ includes the roots.",
      ),
      steps(
        "Together",
        "Solve $x^2 + 2x - 8 \\leq 0$",
        "Roots first.",
        [
          [
            "Roots:",
            "$x = -4$ and $x = 2$",
            ["$x = 4$ and $x = -2$", "$(x + 4)(x - 2)$."],
            "−4, 2",
          ],
          [
            "$\\leq 0$ is",
            "$-4 \\leq x \\leq 2$",
            ["$x \\leq -4$ or $x \\geq 2$", "Below the axis: between."],
            "$-4 \\leq x \\leq 2$",
          ],
        ],
        "Between the roots.",
      ),
      choose("Together", "Solve $x^2 > 16$", "$x < -4$ or $x > 4$", "Outside.", [
        ["$x > 4$", "$(-5)^2 = 25 > 16$ too."],
        ["$-4 < x < 4$", "That's $< 16$."],
      ]),
      choose("Your turn", "Solve $x^2 - 25 \\leq 0$", "$-5 \\leq x \\leq 5$", "Between.", [
        ["$x \\leq 5$", "$x = -6$ fails."],
        ["$x \\leq -5$ or $x \\geq 5$", "That's ≥ 0."],
      ]),
      choose("Your turn", "Solve $(x - 1)(x - 4) > 0$", "$x < 1$ or $x > 4$", "Outside.", [
        ["$1 < x < 4$", "That's < 0."],
        ["$x > 4$", "Both sides."],
      ]),
      choose(
        "Watch out",
        "Zoe solves $x^2 < 9$ as $x < 3$. What's wrong?",
        "Negatives below −3 fail: it's $-3 < x < 3$",
        "Two ends.",
        [["Nothing", "$(-4)^2 = 16 > 9$."]],
      ),
      mistake(
        "Raj solves $x^2 - x - 6 \\geq 0$.",
        ["Roots −2 and 3", "Above the axis", "$-2 \\leq x \\leq 3$"],
        2,
        "Above the axis is outside the roots: $x \\leq -2$ or $x \\geq 3$.",
      ),
      choose(
        "Back to the problem",
        "“Solve $x^2 - 9 < 0$.”",
        "$-3 < x < 3$",
        "Between.",
        [
          ["$x < 3$", "Both ends."],
          ["$x < -3$ or $x > 3$", "That's > 0."],
        ],
        { picture: parabola },
      ),
      quiz([
        [
          ["$x^2 < 4$", "$-2 < x < 2$", ["$x < 2$", "$x < -2$ or $x > 2$"], "Between."],
          ["$x^2 < 1$", "$-1 < x < 1$", ["$x < 1$", "$x < -1$ or $x > 1$"], "Between."],
        ],
        [
          [
            "$x^2 \\geq 36$",
            "$x \\leq -6$ or $x \\geq 6$",
            ["$x \\geq 6$", "$-6 \\leq x \\leq 6$"],
            "Outside.",
          ],
          ["$x^2 > 49$", "$x < -7$ or $x > 7$", ["$x > 7$", "$-7 < x < 7$"], "Outside."],
        ],
        [
          ["$(x - 2)(x - 5) < 0$", "$2 < x < 5$", ["$x < 2$ or $x > 5$", "$x < 5$"], "Between."],
          ["$(x + 1)(x - 3) > 0$", "$x < -1$ or $x > 3$", ["$-1 < x < 3$", "$x > 3$"], "Outside."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "set-notation",
    "GH-A22.c",
    "Set notation for solutions",
    "Write solution sets with braces: {x : −3 < x < 3}.",
    [
      problem("Exam notation", [
        "“Solve $x^2 - 9 < 0$, giving your answer in set notation.” And “List the integers in the set.”",
        "By the end of this lesson, you can write and read solution sets.",
      ]),
      choose("Warm-up", "Solve $x^2 - 9 < 0$", "$-3 < x < 3$", "Between the roots.", [
        ["$x < 3$", "Both ends."],
        ["$x > 3$", "Inside."],
      ]),
      typed("Warm-up", "How many integers $n$ have $-3 < n < 3$?", "5", "−2, −1, 0, 1, 2.", "5."),
      explain("Discover", "Braces and a colon", [
        "**{x : −3 < x < 3}** reads “the set of $x$ such that $x$ is between −3 and 3”.",
        "For two parts use ∪ (or): {x : x ≤ −2} ∪ {x : x ≥ 3}. **∈** means “is a member of”, so 2 ∈ {1, 2, 3}.",
      ]),
      choose("Discover", "{x : x > 4} means", "all numbers greater than 4", "Such that.", [
        ["just 4", "Greater than."],
        ["4 and 5 only", "All of them."],
      ]),
      worked(
        "The problem",
        "$x^2 - 9 < 0$ in set notation.",
        [
          ["$-3 < x < 3$", "Solve."],
          ["$\\{x : -3 < x < 3\\}$", "Set notation."],
          ["Integers: {−2, −1, 0, 1, 2}", "List."],
        ],
        "Use braces for a list too.",
      ),
      steps(
        "Together",
        "Write $x \\leq -2$ or $x \\geq 3$ in set notation",
        "Two parts.",
        [
          [
            "First part:",
            "$\\{x : x \\leq -2\\}$",
            ["$\\{x \\leq -2\\}$", "Include $x :$."],
            "$\\{x : x \\leq -2\\}$",
          ],
          [
            "Join with",
            "∪",
            ["∩", "∩ would need both at once."],
            "$\\{x : x \\leq -2\\} \\cup \\{x : x \\geq 3\\}$",
          ],
        ],
        "∪ for “or”.",
      ),
      choose("Together", "Is 5 ∈ {x : x < 5}?", "no", "Strictly less.", [
        ["yes", "5 < 5 is false."],
      ]),
      choose("Your turn", "Integers in {x : 1 ≤ x < 4}", "{1, 2, 3}", "Includes 1, not 4.", [
        ["{2, 3}", "≤ includes 1."],
        ["{1, 2, 3, 4}", "< excludes 4."],
      ]),
      choose(
        "Your turn",
        "$x^2 > 4$ in set notation",
        "$\\{x : x < -2\\} \\cup \\{x : x > 2\\}$",
        "Outside.",
        [
          ["$\\{x : -2 < x < 2\\}$", "That's < 4."],
          ["$\\{x : x > 2\\}$", "Both parts."],
        ],
      ),
      choose(
        "Watch out",
        "Ivy writes two parts joined by ∩. What's wrong?",
        "No number is in both: use ∪ for “or”",
        "Union.",
        [["Nothing", "∩ means both at once."]],
      ),
      mistake(
        "Ben writes the solution of $x^2 \\leq 16$.",
        ["$-4 \\leq x \\leq 4$", "Set: $\\{x : -4 < x < 4\\}$", "Done"],
        1,
        "Keep ≤: $\\{x : -4 \\leq x \\leq 4\\}$.",
      ),
      choose(
        "Back to the problem",
        "“Give your answer in set notation.”",
        "$\\{x : -3 < x < 3\\}$",
        "Braces, colon.",
        [
          ["$x = \\{-3, 3\\}$", "That lists two numbers."],
          ["$\\{-3 < 3\\}$", "Include $x :$."],
        ],
      ),
      quiz([
        [
          ["{x : x ≥ 0} contains", "0", ["only positives", "only negatives"], "≥ includes."],
          ["{x : x < 0} contains", "−1", ["0", "1"], "Negatives."],
        ],
        [
          ["∪ means", "or (union)", ["and (intersection)", "not"], "Either."],
          ["∈ means", "is a member of", ["is not in", "equals"], "Belongs."],
        ],
        [
          [
            "Integers in {x : −1 < x ≤ 2}",
            "{0, 1, 2}",
            ["{−1, 0, 1, 2}", "{0, 1}"],
            "Not −1; includes 2.",
          ],
          [
            "Integers in {x : 0 ≤ x < 3}",
            "{0, 1, 2}",
            ["{1, 2}", "{0, 1, 2, 3}"],
            "Includes 0, not 3.",
          ],
        ],
      ]),
    ],
  ),
];
