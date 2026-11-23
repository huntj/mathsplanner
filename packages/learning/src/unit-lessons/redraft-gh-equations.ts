// GCSE Higher, "Equations and inequalities", on the stepped template
// (docs/proposals/lesson-stepped.md): solving with graphs, linear and quadratic simultaneous
// equations, iteration, regions, quadratic inequalities and set notation. Graph questions are
// asked on the graph; the algebra is its own picture.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { ghEquations } from "./gh-equations.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, Range, UnitLesson } from "./types.ts";

const EQ = ghEquations;
const ALGEBRA = "Algebra: the equations are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const steps = (...lines: string[]): Picture =>
  maths(`\\begin{array}{l} ${lines.join(" \\\\ ")} \\end{array}`);
const table = (head: string[], rows: string[][]): Picture => ({ kind: "table", head, rows });
interface Curve {
  kind: "quadratic";
  a: number;
  b: number;
  c: number;
}
const graph = (
  range: Range,
  lines: [number, number][] = [],
  curves: Curve[] = [],
  points: Point[] = [],
  verticals: number[] = [],
): Picture => ({
  kind: "graph",
  range,
  ...(lines.length ? { lines: lines.map(([m, c]) => ({ m, c })) } : {}),
  ...(curves.length ? { curves } : {}),
  ...(points.length ? { points } : {}),
  ...(verticals.length ? { verticals } : {}),
});
const quad = (a: number, b: number, c: number): Curve => ({ kind: "quadratic", a, b, c });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Solving equations with graphs.

const GRAPHS = "gh-equations/from-graphs";
const graphsMethod = [
  "Draw both sides as graphs.",
  "Find where they cross.",
  "Read the $x$-values: those are the solutions.",
];
const MEET = graph({ xMin: -2, xMax: 6, yMin: -2, yMax: 7 }, [
  [2, -1],
  [-1, 5],
]);
const SQUARE: Range = { xMin: -4, xMax: 4, yMin: -2, yMax: 7 };
const roots = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Solve it from the graph.", right, others, "Read the $x$-value at each crossing.", {
    asks: "solve",
    picture,
    ...extra,
  });

const fromGraphs = stepped(find(EQ, GRAPHS), {
  method: graphsMethod,
  variation: {
    relationship: "crossings as solutions",
    unknowns: ["solve", "line"],
    surface: ["a higher line", "a sloping line", "one crossing"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Equal where they meet",
        ["**Where two graphs cross, their equations are equal. Read the x-value.**"],
        MEET,
        "The $y$-value isn't the answer: the equation is in $x$.",
      ),
      reworded(EQ, GRAPHS, "The lines cross at", { tag: "The rule" }),

      ...owned(EQ, GRAPHS, "Warm-up", "Check you remember"),

      methodCard("The method", graphsMethod, MEET),
      workedFrom(EQ, GRAPHS),
      calc(
        "Your turn",
        "Solve $x^2 = 4$ from the graph.",
        graph(SQUARE, [[0, 4]], [quad(1, 0, 0)]),
        [
          ["Left crossing: $x =$", "-2", "Down from the crossing."],
          ["Right crossing: $x =$", "2", "Down from the crossing."],
        ],
        "$x = -2$ or $x = 2$.",
      ),

      calc(
        "Practise",
        "Solve $x^2 = x + 2$ from the graph.",
        graph(SQUARE, [[1, 2]], [quad(1, 0, 0)]),
        [
          ["Left crossing: $x =$", "-1", "Down from the crossing."],
          ["Right crossing: $x =$", "2", "Down from the crossing."],
        ],
        "$x = -1$ or $x = 2$.",
      ),
      ...owned(EQ, GRAPHS, "Together", "Practise"),
      ...owned(EQ, GRAPHS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which line do you draw with $y = x^2$? Watch what changes.",
        [
          pick("$x^2 = 3$", "$y = 3$", ["$y = -3$", "$x = 3$"], "The right-hand side.", {
            asks: "line",
          }),
          pick("$x^2 = 2x$", "$y = 2x$", ["$y = 2$", "$y = x$"], "The right-hand side.", {
            asks: "line",
            changed: "A sloping line.",
          }),
          pick(
            "$x^2 - x - 2 = 0$",
            "$y = x + 2$",
            ["$y = x - 2$", "$y = 2$"],
            "Move $x$ and 2 across.",
            {
              asks: "line",
              changed: "Rearrange first.",
            },
          ),
          pick(
            "$x^2 + x - 6 = 0$",
            "$y = 6 - x$",
            ["$y = x - 6$", "$y = 6$"],
            "Move $x$ and −6 across.",
            {
              asks: "line",
              changed: "A falling line.",
            },
          ),
        ],
        "Make one side $x^2$; draw the other side.",
      ),

      questionSet(
        "Variation",
        "Solve from the graph. Watch what changes.",
        [
          roots(
            graph(SQUARE, [[1, 2]], [quad(1, 0, 0)]),
            "$x = -1$ or $x = 2$",
            ["$x = 4$ or $x = 1$", "$x = 2$ only"],
            {
              expect: [
                "For $x^2 - x - 2 = 0$, Ben draws $y = x - 2$ with $y = x^2$. Right?",
                "No",
                "Rearranged, $x^2 = x + 2$: draw $y = x + 2$.",
                [["Yes", "What is $x^2 - x - 2 = 0$ rearranged?"]],
              ],
            },
          ),
          roots(
            graph(SQUARE, [[0, 1]], [quad(1, 0, 0)]),
            "$x = -1$ or $x = 1$",
            ["$x = 1$ only", "$x = 0$"],
            {
              changed: "A flat line.",
            },
          ),
          roots(
            graph(SQUARE, [[2, -1]], [quad(1, 0, 0)]),
            "$x = 1$ only",
            ["$x = -1$ or $x = 1$", "$x = 2$"],
            {
              changed: "One crossing.",
            },
          ),
          roots(
            graph(SQUARE, [[0, -1]], [quad(1, 0, 0)]),
            "No solutions",
            ["$x = -1$", "$x = 0$"],
            {
              changed: "Below the curve.",
            },
          ),
        ],
        "Count the crossings; read each $x$.",
      ),
      own(EQ, GRAPHS, "Spot the mistake"),

      own(EQ, GRAPHS, "Exit check"),

      reworded(
        EQ,
        GRAPHS,
        "“Use the graph to solve $2x - 1 = 5 - x$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Where two graphs cross, their equations are equal. Read the x-value.**"],
        MEET,
        [
          "**Where two graphs cross, their equations are equal. Read the x-value.**",
          "Rearrange so one side is the graph you have.",
          "No crossing: no solution.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Linear and quadratic simultaneous equations.

const LQ = "gh-equations/linear-quadratic";
const lqMethod = [
  "Make $y$ (or $x$) the subject of the linear one.",
  "Substitute into the quadratic; solve.",
  "Find each partner value: answers come in pairs.",
];
const PAIRS = steps("y = x^2,\\ y = x + 2", "x^2 - x - 2 = 0", "(2, 4) \\text{ and } (-1, 1)");
const LINE_CURVE = graph(
  { xMin: -4, xMax: 4, yMin: -2, yMax: 7 },
  [[1, 2]],
  [quad(1, 0, 0)],
  [
    { x: -1, y: 1 },
    { x: 2, y: 4 },
  ],
);
const pair = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Substitute, solve, then find each $y$.", {
    asks: "pairs",
    ...extra,
  });

const linearQuadratic = stepped(find(EQ, LQ), {
  method: lqMethod,
  variation: {
    relationship: "a line substituted into a curve",
    unknowns: ["quadratic", "pairs"],
    surface: ["a steeper line", "a constant term", "a circle"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Substitute",
        ["**Substitute the linear equation into the quadratic. Answers come in pairs.**"],
        LINE_CURVE,
        "The pairs are where the line meets the curve.",
      ),
      reworded(EQ, LQ, "Substituting $y = x + 2$ into $y = x^2$ gives", { tag: "The rule" }),

      ...owned(EQ, LQ, "Warm-up", "Check you remember"),

      methodCard("The method", lqMethod, PAIRS),
      workedFrom(EQ, LQ),
      calc(
        "Your turn",
        "Solve $y = x^2$ and $y = 3x + 4$.",
        undefined,
        [
          ["$x^2 - 3x - 4 = 0$: $x = 4$ or $x =$", "-1", "$(x - 4)(x + 1)$."],
          ["When $x = 4$, $y =$", "16", "$4^2$."],
          ["When $x = -1$, $y =$", "1", "$(-1)^2$."],
        ],
        "(4, 16) and (−1, 1).",
      ),

      calc(
        "Practise",
        "Solve $x^2 + y^2 = 10$ and $y = x + 2$.",
        undefined,
        [
          ["$2x^2 + 4x - 6 = 0$: $x = 1$ or $x =$", "-3", "$x^2 + 2x - 3 = (x + 3)(x - 1)$."],
          ["When $x = 1$, $y =$", "3", "1 + 2."],
          ["When $x = -3$, $y =$", "-1", "−3 + 2."],
        ],
        "(1, 3) and (−3, −1).",
      ),
      ...owned(EQ, LQ, "Together", "Practise"),
      ...owned(EQ, LQ, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The quadratic you get. Watch what changes.",
        [
          pick(
            "$y = x^2$, $y = 2x + 3$",
            "$x^2 - 2x - 3 = 0$",
            ["$x^2 + 2x + 3 = 0$", "$x^2 = 3$"],
            "Move $2x + 3$ across.",
            {
              asks: "quadratic",
            },
          ),
          pick(
            "$y = x^2$, $y = 4x$",
            "$x^2 - 4x = 0$",
            ["$x^2 = 4$", "$x^2 + 4x = 0$"],
            "Move $4x$ across.",
            {
              asks: "quadratic",
              changed: "No constant.",
            },
          ),
          pick(
            "$y = x^2 + 1$, $y = 2x + 4$",
            "$x^2 - 2x - 3 = 0$",
            ["$x^2 - 2x + 5 = 0$", "$x^2 + 2x - 3 = 0$"],
            "Move it all across.",
            {
              asks: "quadratic",
              changed: "A constant on the curve.",
            },
          ),
          pick(
            "$x^2 + y^2 = 5$, $y = x + 1$",
            "$2x^2 + 2x - 4 = 0$",
            ["$2x^2 - 4 = 0$", "$x^2 + x - 4 = 0$"],
            "$(x + 1)^2 = x^2 + 2x + 1$.",
            {
              asks: "quadratic",
              changed: "A circle.",
            },
          ),
        ],
        "Substitute, then get 0 on one side.",
      ),

      questionSet(
        "Variation",
        "Solve. Watch what changes.",
        [
          pair(
            "$y = x^2$, $y = x + 6$",
            "(3, 9) and (−2, 4)",
            ["$x = 3$ or $x = -2$", "(9, 3) and (4, −2)"],
            {
              expect: [
                "Leo writes $x^2 + (x + 1)^2 = x^2 + x^2 + 1$. Right?",
                "No",
                "$(x + 1)^2 = x^2 + 2x + 1$: don't lose the middle term.",
                [["Yes", "What is $(x + 1)^2$ expanded?"]],
              ],
            },
          ),
          pair("$y = x^2$, $y = 2x$", "(0, 0) and (2, 4)", ["(2, 4) only", "$x = 0$ or $x = 2$"], {
            changed: "Through the origin.",
          }),
          pair("$y = x^2$, $y = 9$", "(3, 9) and (−3, 9)", ["(3, 9) only", "$x = \\pm 3$"], {
            changed: "A flat line.",
          }),
          pair(
            "$y = x^2 - 3$, $y = 2x$",
            "(3, 6) and (−1, −2)",
            ["(3, 6) only", "(−3, −6) and (1, 2)"],
            {
              changed: "The curve moved down.",
            },
          ),
        ],
        "Give both values in each pair.",
      ),
      own(EQ, LQ, "Spot the mistake"),

      own(EQ, LQ, "Exit check"),

      reworded(
        EQ,
        LQ,
        "“Solve $y = x^2$ and $y = x + 2$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Substitute the linear equation into the quadratic. Answers come in pairs.**"],
        LINE_CURVE,
        [
          "**Substitute the linear equation into the quadratic. Answers come in pairs.**",
          "Find $y$ for each $x$.",
          "$(x + 1)^2 = x^2 + 2x + 1$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Iteration.

const ITER = "gh-equations/iteration";
const iterMethod = [
  "A sign change shows a root lies between two values.",
  "Put $x_0$ in the formula to get $x_1$.",
  "Feed each answer back until they agree.",
];
const SETTLE = table(["n", "0", "1", "2", "3"], [["$x_n$", "1", "1.5", "1.4", "1.42"]]);
const sign = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Does the sign change?", { asks: "root", ...extra });

const iteration = stepped(find(EQ, ITER), {
  method: iterMethod,
  variation: {
    relationship: "a formula fed its own answer",
    unknowns: ["next", "root"],
    surface: ["a new start", "a different formula", "no sign change"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Sign change, then repeat",
        ["**A sign change shows a root. Feed each answer back in until it settles.**"],
        SETTLE,
        "Stop when the answers agree to the accuracy asked.",
      ),
      reworded(EQ, ITER, "−1 at $x = 2$ and 20 at $x = 3$ shows", { tag: "The rule" }),

      ...owned(EQ, ITER, "Warm-up", "Check you remember"),

      methodCard("The method", iterMethod, SETTLE),
      workedFrom(EQ, ITER),
      calc(
        "Your turn",
        "$x_{n+1} = \\frac{x_n}{2} + 3$, $x_0 = 2$.",
        undefined,
        [
          ["$x_1 =$", "4", "1 + 3."],
          ["$x_2 =$", "5", "2 + 3."],
          ["$x_3 =$", "5.5", "2.5 + 3."],
        ],
        "Heading towards 6.",
      ),

      calc(
        "Practise",
        "Show $x^3 - 4x - 1 = 0$ has a root between 2 and 3.",
        undefined,
        [
          ["At $x = 2$:", "-1", "8 − 8 − 1."],
          ["At $x = 3$:", "14", "27 − 12 − 1."],
        ],
        "A sign change: a root lies between 2 and 3.",
      ),
      reworded(EQ, ITER, "Where the formula comes from", { tag: "Practise" }),
      reworded(EQ, ITER, "To show the answer is 2.07 to 2 d.p., check the sign at", {
        tag: "Practise",
        title: "To show the root is 2.07 (2 d.p.), test",
      }),
      ...owned(EQ, ITER, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find $x_1$. Watch what changes.",
        [
          pick("$x_{n+1} = \\frac{x_n}{2} + 1$, $x_0 = 4$", "3", ["2", "5"], "2 + 1.", {
            asks: "next",
          }),
          pick("$x_{n+1} = \\frac{x_n}{2} + 1$, $x_0 = 10$", "6", ["5", "11"], "5 + 1.", {
            asks: "next",
            changed: "A new start.",
          }),
          pick("$x_{n+1} = \\frac{12}{x_n + 1}$, $x_0 = 3$", "3", ["4", "12"], "12 ÷ 4.", {
            asks: "next",
            changed: "A new formula.",
          }),
          pick("$x_{n+1} = \\sqrt{x_n + 6}$, $x_0 = 3$", "3", ["9", "2.4"], "√9.", {
            asks: "next",
            changed: "A root.",
          }),
        ],
        "Put the latest value in.",
      ),

      questionSet(
        "Variation",
        "A root between the two? Watch what changes.",
        [
          sign("$f(1) = -4$, $f(2) = 3$", "Yes: the sign changes", ["No", "It's 1.5"], {
            expect: [
              "$f(1) = -4$, $f(2) = 3$. Ben says the root is 1.5. Right?",
              "No",
              "A sign change only shows it's between 1 and 2: iterate to find it.",
              [["Yes", "Does a sign change give the root itself?"]],
            ],
          }),
          sign(
            "$f(1) = 4$, $f(2) = 3$",
            "No sign change here",
            ["Yes: the sign changes", "It's 1.5"],
            {
              changed: "Both positive.",
            },
          ),
          sign(
            "$f(1) = -4$, $f(2) = -1$",
            "No sign change here",
            ["Yes: the sign changes", "It's 2"],
            {
              changed: "Both negative.",
            },
          ),
          sign(
            "$f(2.065) = -0.1$, $f(2.075) = 0.2$",
            "Yes: the sign changes",
            ["No", "It's 2.07"],
            {
              changed: "Checking a rounded answer.",
            },
          ),
        ],
        "Negative to positive, or positive to negative: a root.",
      ),
      own(EQ, ITER, "Spot the mistake"),

      own(EQ, ITER, "Exit check"),

      reworded(
        EQ,
        ITER,
        "“Find the solution to 2 decimal places.”",
        {
          tag: "Real life",
          title: "Iterate $x_{n+1} = \\sqrt[3]{13 - 2x_n}$. The root to 2 d.p.?",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A sign change shows a root. Feed each answer back in until it settles.**"],
        SETTLE,
        [
          "**A sign change shows a root. Feed each answer back in until it settles.**",
          "Use the latest value each time.",
          "Check a rounded root with a sign change.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Inequalities in two variables.

const REG = "gh-equations/regions";
const regMethod = [
  "Draw each boundary: solid for ≤ or ≥, dashed for < or >.",
  "Test a point off the line.",
  "The region fits every inequality.",
];
const R = graph(
  { xMin: -1, xMax: 6, yMin: -1, yMax: 6 },
  [
    [0, 1],
    [-1, 5],
  ],
  [],
  [],
  [1],
);
const inR = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Check every inequality.", { asks: "in", picture: R, ...extra });

const regions = stepped(find(EQ, REG), {
  method: regMethod,
  variation: {
    relationship: "points tested against boundaries",
    unknowns: ["side", "in"],
    surface: ["on a line", "outside one", "a corner"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Lines, then sides",
        ["**Draw each boundary line, then test a point to find the right side.**"],
        R,
        "Region R: $y \\ge 1$, $x \\ge 1$, $x + y \\le 5$.",
      ),
      reworded(EQ, REG, "$y < 3$ is drawn with", { tag: "The rule" }),

      ...owned(EQ, REG, "Warm-up", "Check you remember"),

      methodCard("The method", regMethod, R),
      workedFrom(EQ, REG),
      calc(
        "Your turn",
        "Test (0, 0) in $y \\le 2x + 1$.",
        undefined,
        [["$2 \\times 0 + 1 =$", "1", "Put $x = 0$ in."]],
        "0 ≤ 1 is true: (0, 0)'s side, below the line.",
      ),

      calc(
        "Practise",
        "Test (0, 0) in $x + 2y > 6$.",
        undefined,
        [["$0 + 2 \\times 0 =$", "0", "Put both in."]],
        "0 > 6 is false: the other side, above the line.",
      ),
      ...owned(EQ, REG, "Together", "Practise"),
      ...owned(EQ, REG, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which side? Watch what changes.",
        [
          pick("$y > 2$", "Above $y = 2$", ["Below $y = 2$", "On $y = 2$"], "Bigger $y$: up.", {
            asks: "side",
          }),
          pick(
            "$x < 3$",
            "Left of $x = 3$",
            ["Right of $x = 3$", "Below $y = 3$"],
            "Smaller $x$: left.",
            {
              asks: "side",
              changed: "An upright line.",
            },
          ),
          pick(
            "$x + y \\le 4$",
            "Below $x + y = 4$",
            ["Above $x + y = 4$", "Left of $x = 4$"],
            "Test (0, 0).",
            {
              asks: "side",
              changed: "A sloping line.",
            },
          ),
          pick("$y \\ge 2x$", "Above $y = 2x$", ["Below $y = 2x$", "Right of it"], "Test (0, 1).", {
            asks: "side",
            changed: "Through the origin.",
          }),
        ],
        "Test a point not on the line.",
      ),

      questionSet(
        "Variation",
        "Is the point in R? Watch what changes.",
        [
          inR("(2, 2)", "Yes", ["No"], {
            expect: [
              "Leo draws $y \\le 2x + 1$ with a dashed line. Right?",
              "No",
              "≤ includes the line: draw it solid.",
              [["Yes", "Is a point on the line included in ≤?"]],
            ],
          }),
          inR("(4, 2)", "No: 4 + 2 > 5", ["Yes"], { changed: "Further right." }),
          inR("(3, 2)", "Yes: on the line, which counts", ["No: it's on the line"], {
            changed: "On a solid line.",
          }),
          inR("(0, 3)", "No: x < 1", ["Yes"], { changed: "Left of the region." }),
        ],
        "In R means every inequality holds.",
      ),
      own(EQ, REG, "Spot the mistake"),

      own(EQ, REG, "Exit check"),

      reworded(EQ, REG, "“Is (2, 2) in R?”", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Draw each boundary line, then test a point to find the right side.**"],
        R,
        [
          "**Draw each boundary line, then test a point to find the right side.**",
          "Solid for ≤ or ≥; dashed for < or >.",
          "The region satisfies every inequality.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Quadratic inequalities.

const QI = "gh-equations/quadratic-inequalities";
const qiMethod = [
  "Solve = 0 for the roots.",
  "Sketch the ∪ through them.",
  "< 0: between the roots. > 0: outside them.",
];
const BOWL = graph(
  { xMin: -5, xMax: 5, yMin: -10, yMax: 6 },
  [],
  [quad(1, 0, -9)],
  [
    { x: -3, y: 0 },
    { x: 3, y: 0 },
  ],
);
const solve = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Roots, sketch, then read above or below.", {
    asks: "solve",
    ...extra,
  });

const quadraticInequalities = stepped(find(EQ, QI), {
  method: qiMethod,
  variation: {
    relationship: "above or below the axis",
    unknowns: ["roots", "solve"],
    surface: ["the sign flipped", "or equal", "factorised"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Sketch it",
        ["**Find the roots and sketch. Below the axis is between them; above is outside.**"],
        BOWL,
        "$x^2 - 9 < 0$: $-3 < x < 3$.",
      ),
      reworded(EQ, QI, "Where is $x^2 - 9$ negative?", { tag: "The rule" }),

      ...owned(EQ, QI, "Warm-up", "Check you remember"),

      methodCard("The method", qiMethod, BOWL),
      workedFrom(EQ, QI),
      calc(
        "Your turn",
        "Solve $x^2 - 2x - 8 < 0$.",
        undefined,
        [
          ["Roots: −2 and", "4", "$(x + 2)(x - 4)$."],
          ["So $-2 < x <$", "4", "Below the axis: between."],
        ],
        "$-2 < x < 4$.",
      ),

      calc(
        "Practise",
        "Solve $x^2 + x - 12 \\ge 0$.",
        undefined,
        [
          ["Roots: 3 and", "-4", "$(x - 3)(x + 4)$."],
          ["So $x \\le -4$ or $x \\ge$", "3", "Above the axis: outside."],
        ],
        "$x \\le -4$ or $x \\ge 3$.",
      ),
      ...owned(EQ, QI, "Together", "Practise"),
      ...owned(EQ, QI, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The roots. Watch what changes.",
        [
          pick("$x^2 - 16 < 0$", "−4 and 4", ["4 only", "16"], "$x^2 = 16$.", { asks: "roots" }),
          pick("$(x - 1)(x - 5) > 0$", "1 and 5", ["−1 and −5", "5 only"], "Each bracket = 0.", {
            asks: "roots",
            changed: "Factorised.",
          }),
          pick("$x^2 - 3x < 0$", "0 and 3", ["3 only", "−3 and 3"], "$x(x - 3)$.", {
            asks: "roots",
            changed: "No number term.",
          }),
          pick("$x^2 + 2x - 15 \\ge 0$", "−5 and 3", ["5 and −3", "15"], "$(x + 5)(x - 3)$.", {
            asks: "roots",
            changed: "Three terms.",
          }),
        ],
        "The roots are where the curve meets the axis.",
      ),

      questionSet(
        "Variation",
        "Solve. Watch what changes.",
        [
          solve(
            "$x^2 - x - 6 \\ge 0$",
            "$x \\le -2$ or $x \\ge 3$",
            ["$-2 \\le x \\le 3$", "$x \\ge 3$"],
            {
              expect: [
                "For $x^2 - x - 6 \\ge 0$, Raj writes $-2 \\le x \\le 3$. Right?",
                "No",
                "≥ 0 is above the axis: outside the roots.",
                [["Yes", "Is the curve above or below the axis between the roots?"]],
              ],
            },
          ),
          solve(
            "$x^2 - x - 6 \\le 0$",
            "$-2 \\le x \\le 3$",
            ["$x \\le -2$ or $x \\ge 3$", "$x \\le 3$"],
            {
              changed: "The sign flipped.",
            },
          ),
          solve("$x^2 - x - 6 < 0$", "$-2 < x < 3$", ["$-2 \\le x \\le 3$", "$x < 3$"], {
            changed: "Strictly less.",
          }),
          solve("$x^2 < 9$", "$-3 < x < 3$", ["$x < 3$", "$x < -3$ or $x > 3$"], {
            changed: "Just a square.",
          }),
        ],
        "Below: between. Above: outside.",
      ),
      own(EQ, QI, "Spot the mistake"),

      own(EQ, QI, "Exit check"),

      reworded(EQ, QI, "“Solve $x^2 - 9 < 0$.”", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Find the roots and sketch. Below the axis is between them; above is outside.**"],
        BOWL,
        [
          "**Find the roots and sketch. Below the axis is between them; above is outside.**",
          "$x^2 < 9$: $-3 < x < 3$, not $x < 3$.",
          "≤ and ≥ include the roots.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Set notation for solutions.

const SET = "gh-equations/set-notation";
const setMethod = [
  "Solve the inequality.",
  "Write it in braces: {x : …}.",
  "Two parts: join with ∪.",
];
const BRACES = steps("-3 < x < 3", "\\{x : -3 < x < 3\\}");
const write = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "{x : the inequality}; ∪ for “or”.", { asks: "write", ...extra });

const setNotation = stepped(find(EQ, SET), {
  method: setMethod,
  variation: {
    relationship: "solutions as sets",
    unknowns: ["integers", "write"],
    surface: ["or equal", "two parts", "negatives"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Braces and a colon",
        ["**Write {x : …} for “the set of x such that…”. Join two parts with ∪.**"],
        BRACES,
        "∈ means “is in the set”.",
      ),
      reworded(EQ, SET, "{x : x > 4} means", { tag: "The rule" }),

      ...owned(EQ, SET, "Warm-up", "Check you remember"),

      methodCard("The method", setMethod, BRACES),
      workedFrom(EQ, SET),
      calc(
        "Your turn",
        "List the integers in {x : −2 ≤ x < 2}.",
        undefined,
        [
          ["The smallest:", "-2", "≤ includes −2."],
          ["The largest:", "1", "< leaves out 2."],
        ],
        "{−2, −1, 0, 1}.",
      ),

      calc(
        "Practise",
        "How many integers are in {x : 0 < x ≤ 5}?",
        undefined,
        [["Count:", "5", "1, 2, 3, 4, 5."]],
        "{1, 2, 3, 4, 5}.",
      ),
      ...owned(EQ, SET, "Together", "Practise"),
      ...owned(EQ, SET, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Integers in the set. Watch what changes.",
        [
          pick("{x : 1 < x < 4}", "{2, 3}", ["{1, 2, 3, 4}", "{1, 2, 3}"], "Leave out both ends.", {
            asks: "integers",
          }),
          pick("{x : 1 ≤ x < 4}", "{1, 2, 3}", ["{2, 3}", "{1, 2, 3, 4}"], "Include 1.", {
            asks: "integers",
            changed: "Or equal at 1.",
          }),
          pick("{x : 1 ≤ x ≤ 4}", "{1, 2, 3, 4}", ["{1, 2, 3}", "{2, 3}"], "Include both.", {
            asks: "integers",
            changed: "Or equal at both.",
          }),
          pick("{x : −2 < x ≤ 1}", "{−1, 0, 1}", ["{−2, −1, 0, 1}", "{−1, 0}"], "Leave out −2.", {
            asks: "integers",
            changed: "Negatives.",
          }),
        ],
        "< leaves the end out; ≤ keeps it in.",
      ),

      questionSet(
        "Variation",
        "In set notation. Watch what changes.",
        [
          write(
            "$-4 \\le x \\le 4$",
            "$\\{x : -4 \\le x \\le 4\\}$",
            ["$\\{x : -4 < x < 4\\}$", "$\\{-4, 4\\}$"],
            {
              expect: [
                "For $-4 \\le x \\le 4$, Ben writes $\\{x : -4 < x < 4\\}$. Right?",
                "No",
                "Keep the ≤ signs: $\\{x : -4 \\le x \\le 4\\}$.",
                [["Yes", "Are −4 and 4 in the solution?"]],
              ],
            },
          ),
          write(
            "$-4 < x < 4$",
            "$\\{x : -4 < x < 4\\}$",
            ["$\\{x : -4 \\le x \\le 4\\}$", "$\\{-3, 3\\}$"],
            {
              changed: "Strict.",
            },
          ),
          write(
            "$x < -4$ or $x > 4$",
            "$\\{x : x < -4\\} \\cup \\{x : x > 4\\}$",
            ["$\\{x : x < -4\\} \\cap \\{x : x > 4\\}$", "$\\{x : -4 < x < 4\\}$"],
            { changed: "Two parts." },
          ),
          write("$x \\ge 0$", "$\\{x : x \\ge 0\\}$", ["$\\{0\\}$", "$\\{x : x > 0\\}$"], {
            changed: "One part.",
          }),
        ],
        "Keep the signs; ∪ joins two parts.",
      ),
      own(EQ, SET, "Spot the mistake"),

      own(EQ, SET, "Exit check"),

      reworded(
        EQ,
        SET,
        "“Give your answer in set notation.”",
        { tag: "Real life", title: "Solve $x^2 - 9 < 0$. Give your answer in set notation." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Write {x : …} for “the set of x such that…”. Join two parts with ∪.**"],
        BRACES,
        [
          "**Write {x : …} for “the set of x such that…”. Join two parts with ∪.**",
          "Keep the < or ≤ exactly.",
          "∩ for two parts would leave nothing.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

export const ghEquationsStepped: [string, UnitLesson[]][] = [
  [GRAPHS, [fromGraphs]],
  [LQ, [linearQuadratic]],
  [ITER, [iteration]],
  [REG, [regions]],
  [QI, [quadraticInequalities]],
  [SET, [setNotation]],
];
