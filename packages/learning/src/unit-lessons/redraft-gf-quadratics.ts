// GCSE Foundation, "Quadratics", on the stepped template (docs/proposals/lesson-stepped.md):
// solving by factorising, solutions from a graph, roots and intercepts, turning points, and roots
// by algebra. Graph questions are asked on the curve; algebra is its own picture.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { curve, gfQuadratics } from "./gf-quadratics.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Range, UnitLesson } from "./types.ts";

const QU = gfQuadratics;
const ALGEBRA = "Algebra: the equation is the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const steps = (...lines: string[]): Picture =>
  maths(`\\begin{array}{l} ${lines.join(" \\\\ ")} \\end{array}`);
// Near-square ranges, so each curve keeps its shape on a phone.
const MID: Range = { xMin: -4, xMax: 6, yMin: -5, yMax: 6 };
const RIGHT: Range = { xMin: -3, xMax: 7, yMin: -5, yMax: 6 };
const LOW: Range = { xMin: -5, xMax: 6, yMin: -7, yMax: 4 };
const DEEP: Range = { xMin: -6, xMax: 4, yMin: -10, yMax: 2 };
const mainPic = curve(1, -2, -3, [], [], MID);
const or = (a: string, b: string) => `$x = ${a}$ or $x = ${b}$`;
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Solving by factorising.

const FACT = "gf-quadratics/factorising";
const factMethod = ["Rearrange to $= 0$.", "Factorise.", "Set each bracket to 0: two answers."];
const ZERO = steps("x^2 + x - 12 = 0", "(x + 4)(x - 3) = 0", "x = -4 \\text{ or } x = 3");

const factorising = stepped(find(QU, FACT), {
  method: factMethod,
  variation: {
    relationship: "a product equal to zero",
    unknowns: ["solution"],
    surface: ["the signs", "a common factor", "a different right-hand side"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Zero product",
        ["**Get 0 on one side, factorise, then set each bracket to 0.**"],
        ZERO,
        "If two things multiply to 0, one of them is 0.",
      ),
      reworded(QU, FACT, "Solve $(x - 2)(x + 5) = 0$", { tag: "The rule" }),

      ...owned(QU, FACT, "Warm-up", "Check you remember"),

      methodCard("The method", factMethod, ZERO),
      workedFrom(QU, FACT),
      calc(
        "Your turn",
        "Solve $x^2 + 7x + 12 = 0$.",
        undefined,
        [
          ["$(x + 3)(x +$", "4", "Multiply to 12, add to 7.", { after: "$) = 0$" }],
          ["$x = -3$ or $x =$", "-4", "$x + 4 = 0$."],
        ],
        or("-3", "-4"),
      ),

      calc(
        "Practise",
        "Solve $x^2 - 2x - 15 = 0$.",
        undefined,
        [
          ["$(x - 5)(x +$", "3", "Multiply to −15, add to −2.", { after: "$) = 0$" }],
          ["$x = 5$ or $x =$", "-3", "$x + 3 = 0$."],
        ],
        or("5", "-3"),
      ),
      ...owned(QU, FACT, "Together", "Practise"),
      ...owned(QU, FACT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve. Watch what changes.",
        [
          pick(
            "$(x - 3)(x - 5) = 0$",
            or("3", "5"),
            [or("-3", "-5"), "$x = 15$"],
            "Each bracket.",
            {
              asks: "solution",
            },
          ),
          pick("$(x + 3)(x - 5) = 0$", or("-3", "5"), [or("3", "-5"), "$x = -15$"], "Flip each.", {
            asks: "solution",
            changed: "A plus sign.",
          }),
          pick("$x(x - 5) = 0$", or("0", "5"), ["$x = 5$ only", "$x = -5$"], "$x = 0$ counts.", {
            asks: "solution",
            changed: "Just $x$.",
          }),
          pick(
            "$(x - 5)^2 = 0$",
            "$x = 5$ only",
            [or("5", "-5"), "$x = 25$"],
            "One bracket, twice.",
            {
              asks: "solution",
              changed: "A repeated bracket.",
            },
          ),
        ],
        "Each bracket gives a solution: flip its sign.",
      ),

      questionSet(
        "Variation",
        "Solve. Watch what changes.",
        [
          pick("$x^2 - 4x = 5$", or("5", "-1"), [or("5", "9"), or("0", "4")], "Get 0 first.", {
            asks: "solution",
            expect: [
              "For $x^2 - 4x = 5$, Raj writes $x(x - 4) = 5$, so $x = 5$. Right?",
              "No",
              "Get 0 first: $x^2 - 4x - 5 = 0$, so $(x - 5)(x + 1) = 0$.",
              [["Yes", "Does a product of 5 tell you each part?"]],
            ],
          }),
          pick("$x^2 - 4x = 0$", or("0", "4"), ["$x = 4$ only", "$x = -4$"], "$x(x - 4) = 0$.", {
            asks: "solution",
            changed: "Equals 0 already.",
          }),
          pick("$x^2 - 4x = 12$", or("6", "-2"), [or("-6", "2"), or("12", "16")], "Subtract 12.", {
            asks: "solution",
            changed: "Equals 12.",
          }),
          pick("$x^2 - 4 = 0$", or("2", "-2"), ["$x = 2$ only", "$x = 4$"], "$(x + 2)(x - 2)$.", {
            asks: "solution",
            changed: "No $x$ term.",
          }),
        ],
        "Always get 0 on one side first.",
      ),
      own(QU, FACT, "Spot the mistake"),

      own(QU, FACT, "Exit check"),

      reworded(
        QU,
        FACT,
        "“$x(x + 3) = 28$. Find the width $x$.”",
        { tag: "Real life", title: "A garden is $x$ by $x + 3$, area 28 m². Width?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Get 0 on one side, factorise, then set each bracket to 0.**"],
        ZERO,
        [
          "**Get 0 on one side, factorise, then set each bracket to 0.**",
          "$(x + 4) = 0$ gives $x = -4$: flip the sign.",
          "$x^2 = 7x$: don't divide by $x$; you'd lose $x = 0$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Solutions from a graph.

const GRAPH = "gf-quadratics/from-graph";
const graphMethod = [
  "Write it as curve = number.",
  "Draw the line $y =$ that number.",
  "Read the $x$ values where they cross.",
];
const BOWL = curve(1, -4, 0, [], [], RIGHT);
const at = (c: number) => curve(1, -4, 0, [], [{ m: 0, c }], RIGHT);
const onMain = (c: number) => curve(1, -2, -3, [], [{ m: 0, c }], MID);
const count = (prompt: string, c: number, right: string, extra: Record<string, unknown> = {}) =>
  pick(
    prompt,
    right,
    ["Two", "One", "None"].filter((n) => n !== right),
    "Count the crossings.",
    {
      asks: "count",
      picture: onMain(c),
      ...extra,
    },
  );

const fromGraph = stepped(find(QU, GRAPH), {
  method: graphMethod,
  variation: {
    relationship: "where the curve meets a line",
    unknowns: ["solution", "count"],
    surface: ["a line higher up", "touching the bottom", "below the curve"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Where it crosses",
        ["**The solutions are where the curve meets the line.**"],
        mainPic,
        "For $= 0$, the line is the $x$-axis.",
      ),
      reworded(QU, GRAPH, "From the graph, solve $x^2 - 2x - 3 = 0$", { tag: "The rule" }),

      ...owned(QU, GRAPH, "Warm-up", "Check you remember"),

      methodCard("The method", graphMethod, mainPic),
      workedFrom(QU, GRAPH),
      calc(
        "Your turn",
        "Solve $x^2 - 2x - 3 = 5$ from the graph.",
        onMain(5),
        [
          ["Left crossing: $x =$", "-2", "Down from where they meet."],
          ["Right crossing: $x =$", "4", "Down from where they meet."],
        ],
        or("-2", "4"),
      ),

      calc(
        "Practise",
        "Solve $x^2 - 4 = 0$ from the graph.",
        curve(1, 0, -4, [], [], { xMin: -4, xMax: 4, yMin: -5, yMax: 4 }),
        [
          ["Left root: $x =$", "-2", "Where it crosses the $x$-axis."],
          ["Right root: $x =$", "2", "Where it crosses the $x$-axis."],
        ],
        or("-2", "2"),
      ),
      ...owned(QU, GRAPH, "Together", "Practise"),
      ...owned(QU, GRAPH, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve from the graph. Watch what changes.",
        [
          pick("$x^2 - 4x = 0$", or("0", "4"), ["$x = 2$", "$x = -4$"], "The $x$-axis.", {
            asks: "solution",
            picture: BOWL,
          }),
          pick(
            "$x^2 - 4x = 5$",
            or("-1", "5"),
            [or("0", "4"), "$x = 5$ only"],
            "The line $y = 5$.",
            {
              asks: "solution",
              picture: at(5),
              changed: "A line higher up.",
            },
          ),
          pick(
            "$x^2 - 4x = -4$",
            "$x = 2$ only",
            [or("0", "4"), "No solutions"],
            "It just touches.",
            {
              asks: "solution",
              picture: at(-4),
              changed: "Touching the bottom.",
            },
          ),
          pick("$x^2 - 4x = -5$", "No solutions", ["$x = 2$", or("-1", "5")], "They never meet.", {
            asks: "solution",
            picture: at(-5),
            changed: "Below the curve.",
          }),
        ],
        "Two crossings, one touch, or none.",
      ),

      questionSet(
        "Variation",
        "How many solutions? Watch what changes.",
        [
          count("$x^2 - 2x - 3 = 2$", 2, "Two", {
            expect: [
              "The line $y = 2$ crosses at $x \\approx -1.4$ and $3.4$. Ben writes $x = 2$. Right?",
              "No",
              "The solutions are the $x$ values: about −1.4 and 3.4.",
              [["Yes", "Is 2 an $x$ value or a $y$ value?"]],
            ],
          }),
          count("$x^2 - 2x - 3 = -4$", -4, "One", { changed: "The bottom of the curve." }),
          count("$x^2 - 2x - 3 = -5$", -5, "None", { changed: "Below the curve." }),
          count("$x^2 - 2x - 3 = 5$", 5, "Two", { changed: "Higher up." }),
        ],
        "Read $x$ values, and count the crossings.",
      ),
      own(QU, GRAPH, "Spot the mistake"),

      own(QU, GRAPH, "Exit check"),

      reworded(
        QU,
        GRAPH,
        "“Use the graph to solve $x^2 - 2x - 3 = 0$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The solutions are where the curve meets the line.**"],
        mainPic,
        [
          "**The solutions are where the curve meets the line.**",
          "$= 0$: read where it crosses the $x$-axis.",
          "A line that misses the curve: no solutions.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Roots and intercepts.

const ROOTS = "gf-quadratics/roots-intercepts";
const rootsMethod = [
  "$y$-intercept: put $x = 0$. It's $c$.",
  "Roots: set $y = 0$ and factorise.",
  "Roots are $(x, 0)$; the intercept is $(0, y)$.",
];
const MARKED = curve(
  1,
  -2,
  -3,
  [
    { x: -1, y: 0 },
    { x: 3, y: 0 },
    { x: 0, y: -3 },
  ],
  [],
  MID,
);

const roots = stepped(find(QU, ROOTS), {
  method: rootsMethod,
  variation: {
    relationship: "crossings of the axes",
    unknowns: ["intercept", "roots"],
    surface: ["the signs", "no number term", "brackets"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two kinds of crossing",
        ["**Roots** cross the x-axis. The **y-intercept** crosses the y-axis."],
        MARKED,
        "For $y = ax^2 + bx + c$, the $y$-intercept is $c$.",
      ),
      reworded(QU, ROOTS, "$y$-intercept of $y = x^2 + 4x + 5$", { tag: "The rule" }),

      ...owned(QU, ROOTS, "Warm-up", "Check you remember"),

      methodCard("The method", rootsMethod, MARKED),
      workedFrom(QU, ROOTS),
      calc(
        "Your turn",
        "Read $y = x^2 - x - 6$.",
        curve(1, -1, -6, [], [], LOW),
        [
          ["$y$-intercept: $(0,$", "-6", "The number term.", { after: "$)$" }],
          ["Roots: $x = -2$ and $x =$", "3", "$(x + 2)(x - 3)$."],
        ],
        "Intercept (0, −6); roots −2 and 3.",
      ),

      calc(
        "Practise",
        "Read $y = (x + 1)(x - 4)$.",
        curve(1, -3, -4, [], [], { xMin: -4, xMax: 6, yMin: -7, yMax: 4 }),
        [
          ["Roots: $x = -1$ and $x =$", "4", "$x - 4 = 0$."],
          ["$y$-intercept: $(0,$", "-4", "$1 \\times (-4)$.", { after: "$)$" }],
        ],
        "Roots −1 and 4; intercept (0, −4).",
      ),
      ...owned(QU, ROOTS, "Together", "Practise"),
      ...owned(QU, ROOTS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The $y$-intercept. Watch what changes.",
        [
          pick("$y = x^2 + 3x + 2$", "(0, 2)", ["(2, 0)", "(0, 3)"], "Put $x = 0$.", {
            asks: "intercept",
          }),
          pick("$y = x^2 + 3x - 2$", "(0, −2)", ["(0, 2)", "(−2, 0)"], "Put $x = 0$.", {
            asks: "intercept",
            changed: "Minus 2.",
          }),
          pick("$y = 3x^2 + x$", "(0, 0)", ["(0, 3)", "(0, 1)"], "No number term.", {
            asks: "intercept",
            changed: "No number term.",
          }),
          pick("$y = (x + 2)(x + 5)$", "(0, 10)", ["(0, 7)", "(0, 2)"], "$2 \\times 5$.", {
            asks: "intercept",
            changed: "Brackets.",
          }),
        ],
        "Put $x = 0$: the number left is the intercept.",
      ),

      questionSet(
        "Variation",
        "The roots. Watch what changes.",
        [
          pick("$y = (x - 2)(x - 4)$", "2 and 4", ["−2 and −4", "8"], "Each bracket = 0.", {
            asks: "roots",
            expect: [
              "For $y = (x - 2)(x - 4)$, Kim gives roots −2 and −4. Right?",
              "No",
              "$x - 2 = 0$ when $x = 2$: roots 2 and 4.",
              [["Yes", "What makes $x - 2$ equal 0?"]],
            ],
          }),
          pick("$y = (x + 2)(x - 4)$", "−2 and 4", ["2 and −4", "−8"], "Flip each sign.", {
            asks: "roots",
            changed: "A plus.",
          }),
          pick("$y = x(x - 4)$", "0 and 4", ["4 only", "−4"], "$x = 0$ is a root.", {
            asks: "roots",
            changed: "Just $x$.",
          }),
          pick("$y = x^2 - 4$", "−2 and 2", ["4 and −4", "2 only"], "$(x + 2)(x - 2)$.", {
            asks: "roots",
            changed: "No $x$ term.",
          }),
        ],
        "Roots: each bracket equal to 0.",
      ),
      own(QU, ROOTS, "Spot the mistake"),

      own(QU, ROOTS, "Exit check"),

      reworded(
        QU,
        ROOTS,
        "“Write down the roots and the $y$-intercept of $y = x^2 - 2x - 3$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Roots** cross the x-axis. The **y-intercept** crosses the y-axis."],
        MARKED,
        [
          "**Roots** cross the x-axis. The **y-intercept** crosses the y-axis.",
          "Roots are $(x, 0)$; the intercept is $(0, c)$.",
          "$(x - 2)$ gives the root $x = 2$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Turning points.

const TURN = "gf-quadratics/turning-points";
const turnMethod = [
  "Find the roots.",
  "Halfway between them: the turning point's $x$.",
  "Put that $x$ in to find $y$.",
];
const LOWEST = curve(
  1,
  -2,
  -3,
  [
    { x: -1, y: 0 },
    { x: 3, y: 0 },
    { x: 1, y: -4 },
  ],
  [],
  MID,
);
const point = (
  prompt: string,
  picture: Picture,
  right: string,
  others: string[],
  extra: Record<string, unknown> = {},
) => pick(prompt, right, others, "Halfway, then put $x$ in.", { asks: "point", picture, ...extra });

const turning = stepped(find(QU, TURN), {
  method: turnMethod,
  variation: {
    relationship: "the turning point halfway between the roots",
    unknowns: ["x", "point"],
    surface: ["a negative root", "moved up", "upside down"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Halfway between the roots",
        ["**The turning point is halfway between the roots.**"],
        LOWEST,
        "∪ shape: a minimum. ∩ shape: a maximum.",
      ),
      reworded(QU, TURN, "$y = -x^2 + 4$ has", { tag: "The rule" }),

      ...owned(QU, TURN, "Warm-up", "Check you remember"),

      methodCard("The method", turnMethod, LOWEST),
      workedFrom(QU, TURN),
      calc(
        "Your turn",
        "Find the turning point of $y = x^2 - 4x + 3$.",
        curve(1, -4, 3, [], [], { xMin: -2, xMax: 6, yMin: -2, yMax: 6 }),
        [
          ["Roots: 1 and", "3", "$(x - 1)(x - 3)$."],
          ["Halfway: $x =$", "2", "Between 1 and 3."],
          ["$y =$", "-1", "$4 - 8 + 3$."],
        ],
        "(2, −1), a minimum.",
      ),

      calc(
        "Practise",
        "Find the turning point of $y = x^2 + 2x - 8$.",
        curve(1, 2, -8, [], [], DEEP),
        [
          ["Roots: −4 and", "2", "$(x + 4)(x - 2)$."],
          ["Halfway: $x =$", "-1", "Between −4 and 2."],
          ["$y =$", "-9", "$1 - 2 - 8$."],
        ],
        "(−1, −9), a minimum.",
      ),
      ...owned(QU, TURN, "Together", "Practise"),
      ...owned(QU, TURN, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The turning point's $x$. Watch what changes.",
        [
          pick("Roots 2 and 6", "4", ["3", "8"], "Halfway.", { asks: "x" }),
          pick("Roots −2 and 6", "2", ["4", "−4"], "Add, then halve.", {
            asks: "x",
            changed: "A negative root.",
          }),
          pick("Roots 0 and 9", "4.5", ["9", "4"], "Half of 9.", {
            asks: "x",
            changed: "An odd gap.",
          }),
          pick("Roots −5 and −1", "−3", ["3", "−2"], "Add, then halve.", {
            asks: "x",
            changed: "Both negative.",
          }),
        ],
        "Add the roots and halve.",
      ),

      questionSet(
        "Variation",
        "Find the turning point. Watch what changes.",
        [
          point(
            "$y = x^2 - 4x$",
            curve(1, -4, 0, [], [], RIGHT),
            "(2, −4)",
            ["(2, 4)", "(−4, 2)"],
            {
              expect: [
                "For $y = x^2 - 4x$, Mia gets $x = 2$, then $y = 4 - 8 = 4$. Right?",
                "No",
                "$4 - 8 = -4$: the turning point is (2, −4).",
                [["Yes", "What is $4 - 8$?"]],
              ],
            },
          ),
          point(
            "$y = x^2 - 4x + 4$",
            curve(1, -4, 4, [], [], RIGHT),
            "(2, 0)",
            ["(0, 2)", "(2, 4)"],
            {
              changed: "Moved up 4.",
            },
          ),
          point("$y = x^2 - 2x$", curve(1, -2, 0, [], [], MID), "(1, −1)", ["(−1, 1)", "(2, 0)"], {
            changed: "Roots 0 and 2.",
          }),
          point(
            "$y = -x^2 + 4x$",
            curve(-1, 4, 0, [], [], RIGHT),
            "(2, 4), a maximum",
            ["(2, −4), a minimum", "(4, 2)"],
            { changed: "Upside down." },
          ),
        ],
        "Halfway between the roots, then work out $y$ with care.",
      ),
      own(QU, TURN, "Spot the mistake"),

      own(QU, TURN, "Exit check"),

      reworded(
        QU,
        TURN,
        "“Write down the coordinates of the turning point of $y = x^2 - 2x - 3$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The turning point is halfway between the roots.**"],
        LOWEST,
        [
          "**The turning point is halfway between the roots.**",
          "Put that $x$ in to find $y$.",
          "∪: a minimum. ∩: a maximum.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Roots by algebra.

const DEDUCE = "gf-quadratics/deduce-roots";
const deduceMethod = ["Set $y = 0$.", "Factorise.", "Each bracket = 0: flip its sign."];
const SKETCH = curve(1, 2, -8, [], [], DEEP);
const SIDE: Range = { xMin: -6, xMax: 6, yMin: -7, yMax: 5 };
const which = (
  picture: Picture,
  right: string,
  others: string[],
  extra: Record<string, unknown> = {},
) =>
  pick("Which equation is this?", right, others, "Read the roots, then flip the signs.", {
    asks: "equation",
    picture,
    ...extra,
  });

const deduce = stepped(find(QU, DEDUCE), {
  method: deduceMethod,
  variation: {
    relationship: "brackets and the roots they give",
    unknowns: ["roots", "equation"],
    surface: ["a root moves", "both roots move", "a repeated root"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Roots from factors",
        ["**Set y = 0 and factorise: each bracket gives a root.**"],
        SKETCH,
        "$(x + 4)(x - 2)$: roots −4 and 2.",
      ),
      reworded(QU, DEDUCE, "Roots of $y = x^2 - x - 12$", { tag: "The rule" }),

      ...owned(QU, DEDUCE, "Warm-up", "Check you remember"),

      methodCard("The method", deduceMethod, SKETCH),
      workedFrom(QU, DEDUCE),
      calc(
        "Your turn",
        "Find the roots of $y = x^2 + x - 6$.",
        undefined,
        [
          ["$(x + 3)(x -$", "2", "Multiply to −6, add to 1.", { after: "$)$" }],
          ["Roots: $x = -3$ and $x =$", "2", "$x - 2 = 0$."],
        ],
        "Roots −3 and 2.",
      ),

      calc(
        "Practise",
        "Find the roots of $y = x^2 - 8x$.",
        undefined,
        [
          ["$x(x -$", "8", "Take out $x$.", { after: "$)$" }],
          ["Roots: $x = 0$ and $x =$", "8", "$x - 8 = 0$."],
        ],
        "Roots 0 and 8.",
      ),
      ...owned(QU, DEDUCE, "Together", "Practise"),
      ...owned(QU, DEDUCE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The roots. Watch what changes.",
        [
          pick("$y = x^2 + 5x + 6$", "−2 and −3", ["2 and 3", "6"], "$(x + 2)(x + 3)$.", {
            asks: "roots",
          }),
          pick("$y = x^2 - 5x + 6$", "2 and 3", ["−2 and −3", "−6"], "$(x - 2)(x - 3)$.", {
            asks: "roots",
            changed: "Minus $5x$.",
          }),
          pick("$y = x^2 - x - 6$", "3 and −2", ["−3 and 2", "6"], "$(x - 3)(x + 2)$.", {
            asks: "roots",
            changed: "Minus 6.",
          }),
          pick("$y = x^2 - 36$", "6 and −6", ["36", "6 only"], "$(x + 6)(x - 6)$.", {
            asks: "roots",
            changed: "No $x$ term.",
          }),
        ],
        "Factorise, then flip each bracket's sign.",
      ),

      questionSet(
        "Variation",
        "Which equation? Watch what changes.",
        [
          which(
            curve(1, -5, 4, [], [], SIDE),
            "$y = (x - 1)(x - 4)$",
            ["$y = (x + 1)(x + 4)$", "$y = (x - 1)(x + 4)$"],
            {
              expect: [
                "For $y = (x - 1)(x - 4)$, Leo gives roots −1 and −4. Right?",
                "No",
                "Each bracket is 0 at $x = 1$ and $x = 4$.",
                [["Yes", "What makes $x - 1$ equal 0?"]],
              ],
            },
          ),
          which(
            curve(1, 3, -4, [], [], SIDE),
            "$y = (x - 1)(x + 4)$",
            ["$y = (x + 1)(x - 4)$", "$y = (x - 1)(x - 4)$"],
            { changed: "One root moves left." },
          ),
          which(
            curve(1, -3, -4, [], [], SIDE),
            "$y = (x + 1)(x - 4)$",
            ["$y = (x - 1)(x + 4)$", "$y = (x - 1)(x - 4)$"],
            { changed: "Both roots move." },
          ),
          which(
            curve(1, -4, 4, [], [], SIDE),
            "$y = (x - 2)^2$",
            ["$y = (x + 2)^2$", "$y = (x - 2)(x + 2)$"],
            { changed: "It just touches." },
          ),
        ],
        "A root at 4 comes from $(x - 4)$.",
      ),
      own(QU, DEDUCE, "Spot the mistake"),

      own(QU, DEDUCE, "Exit check"),

      reworded(
        QU,
        DEDUCE,
        "“Sketch $y = x^2 + 2x - 8$. Where does it cross the $x$-axis?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Set y = 0 and factorise: each bracket gives a root.**"],
        SKETCH,
        [
          "**Set y = 0 and factorise: each bracket gives a root.**",
          "$(x + 4)$ gives the root $x = -4$.",
          "$(x - 3)^2$ touches the $x$-axis once.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

export const gfQuadraticsStepped: [string, UnitLesson[]][] = [
  [FACT, [factorising]],
  [GRAPH, [fromGraph]],
  [ROOTS, [roots]],
  [TURN, [turning]],
  [DEDUCE, [deduce]],
];
