// GCSE Foundation, "Straight-line graphs", on the stepped template
// (docs/proposals/lesson-stepped.md): functions, plotting, parallel lines, a line from a point and
// a gradient or from two points, and what gradients and intercepts mean. Lines are drawn on
// graphs; working with the equation is algebra, its own picture.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, Range, UnitLesson } from "./types.ts";
import { gfStraightLine } from "./gf-straight-line.ts";

const SL = gfStraightLine;
const ALGEBRA = "Working with the equation: the equation is the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const p = (x: number, y: number): Point => ({ x, y });
const ruled = (lines: [number, number][], range: Range, points: Point[] = []): Picture => ({
  kind: "graph",
  range,
  lines: lines.map(([m, c]) => ({ m, c })),
  ...(points.length ? { points } : {}),
});
const neg = (n: number): string[] => [`${n}`, `−${-n}`];
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });

// ---------------------------------------------------------------------------------------------
// Functions.

const FUNCTIONS = "gf-straight-line/functions";
const funcMethod = [
  "Forwards: do each step in order.",
  "Backwards: start from the output.",
  "Undo the last step first, with inverses.",
];
const MACHINE = maths("x \\xrightarrow{\\times 3} 3x \\xrightarrow{-1} 3x - 1");

const functions = stepped(find(SL, FUNCTIONS), {
  method: funcMethod,
  variation: {
    relationship: "a function's input and output",
    unknowns: ["output", "input"],
    surface: ["the order of the steps", "negative inputs", "running it backwards"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Function machines",
        ["**Forwards: follow the rule. Backwards: undo each step in reverse.**"],
        MACHINE,
        "Each input gives exactly one output.",
      ),
      reworded(SL, FUNCTIONS, "Feed the machine", { tag: "The rule" }),

      ...owned(SL, FUNCTIONS, "Warm-up", "Check you remember"),

      methodCard("The method", funcMethod, MACHINE),
      workedFrom(SL, FUNCTIONS),
      calc(
        "Your turn",
        "Rule: × 3, then − 4.",
        undefined,
        [
          ["Output for 6:", "14", "6 × 3, then − 4."],
          ["Output 11. Input:", "5", "11 + 4, then ÷ 3."],
        ],
        "14, and 5.",
      ),

      calc(
        "Practise",
        "Rule: + 5, then × 2.",
        undefined,
        [
          ["Output for 3:", "16", "(3 + 5) × 2."],
          ["Output 30. Input:", "10", "30 ÷ 2, then − 5."],
        ],
        "16, and 10.",
      ),
      ...owned(SL, FUNCTIONS, "Together", "Practise"),
      ...owned(SL, FUNCTIONS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Rule: × 2, then + 6. Watch what changes.",
        [
          ask("Output for 4?", "14", "4 × 2 + 6.", "14.", { asks: "output" }),
          ask("Output for −4?", neg(-2), "−8 + 6.", "−2.", {
            asks: "output",
            changed: "A negative input.",
          }),
          ask("Output for 0?", "6", "0 + 6.", "6.", { asks: "output", changed: "Zero in." }),
          ask("Output 20. Input?", "7", "20 − 6, then ÷ 2.", "7.", {
            asks: "input",
            changed: "Backwards.",
          }),
        ],
        "Backwards, undo the last step first.",
      ),

      questionSet(
        "Variation",
        "Watch the order of the steps.",
        [
          ask("× 3, then + 2. Output 17. Input?", "5", "17 − 2, then ÷ 3.", "5.", {
            asks: "input",
            expect: [
              "× 3 then + 2: Ola undoes × 3 first. Right?",
              "No",
              "Undo + 2 first: $17 - 2 = 15$, then $15 \\div 3 = 5$.",
              [["Yes", "Which step was done last?"]],
            ],
          }),
          ask("+ 2, then × 3. Output 18. Input?", "4", "18 ÷ 3, then − 2.", "4.", {
            asks: "input",
            changed: "Steps swapped.",
          }),
          ask("+ 2, then × 3. Input 5. Output?", "21", "(5 + 2) × 3.", "21.", {
            asks: "output",
            changed: "Forwards.",
          }),
          ask("× 3, then + 2. Input 5. Output?", "17", "5 × 3 + 2.", "17.", {
            asks: "output",
            changed: "Swapped back.",
          }),
        ],
        "The order of the steps changes the answer.",
      ),
      own(SL, FUNCTIONS, "Spot the mistake"),

      own(SL, FUNCTIONS, "Exit check"),

      reworded(
        SL,
        FUNCTIONS,
        "“A booth multiplies by 1.2, then subtracts 2. Leah gets €40. How many pounds did she change?”",
        { tag: "Real life", title: "× 1.2, then − 2. Leah gets €40. Pounds in?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Forwards: follow the rule. Backwards: undo each step in reverse.**"],
        MACHINE,
        [
          "**Forwards: follow the rule. Backwards: undo each step in reverse.**",
          "+ 2, then × 5 on 3: $(3 + 2) \\times 5 = 25$.",
          "Undo the last step first.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Plotting straight lines.

const PLOT = "gf-straight-line/plot";
const plotMethod = [
  "Put each x into the equation to find y.",
  "Plot each (x, y) point.",
  "Rule a line through them all.",
];
const wide: Range = { xMin: -3, xMax: 3, yMin: -4, yMax: 6 };
const TABLE_LINE = ruled([[1, 1]], wide, [p(-2, -1), p(0, 1), p(2, 3)]);

const plot = stepped(find(SL, PLOT), {
  method: plotMethod,
  variation: {
    relationship: "an equation and the points on its line",
    unknowns: ["y", "on the line"],
    surface: ["negative x", "points swapped", "x = 0"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Table, points, line",
        ["**Make a table of x and y, plot the points, rule the line.**"],
        TABLE_LINE,
        "Plot three: two fix the line, one checks it.",
      ),

      ...owned(SL, PLOT, "Warm-up", "Check you remember"),

      methodCard("The method", plotMethod, TABLE_LINE),
      workedFrom(SL, PLOT),
      calc(
        "Your turn",
        "Complete the table for $y = 2x + 3$.",
        undefined,
        [
          ["$x = -2$: $y =$", "-1", "$2(-2) + 3$."],
          ["$x = 0$: $y =$", "3", "$0 + 3$."],
          ["$x = 2$: $y =$", "7", "$4 + 3$."],
        ],
        "−1, 3 and 7.",
      ),

      calc(
        "Practise",
        "Complete the table for $y = \\frac12 x + 1$.",
        undefined,
        [
          ["$x = -2$: $y =$", "0", "Half of −2 is −1."],
          ["$x = 0$: $y =$", "1", "$0 + 1$."],
          ["$x = 4$: $y =$", "3", "$2 + 1$."],
        ],
        "0, 1 and 3.",
      ),
      ...owned(SL, PLOT, "Together", "Practise"),
      ...owned(SL, PLOT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Is it on $y = 2x + 1$? Watch what changes.",
        [
          pick("$(1, 3)$", "Yes", ["No"], "2 × 1 + 1.", {
            asks: "on the line",
            picture: ruled([[2, 1]], { xMin: -3, xMax: 4, yMin: -5, yMax: 7 }),
          }),
          pick("$(3, 1)$", "No", ["Yes"], "2 × 3 + 1 is 7.", {
            asks: "on the line",
            changed: "Swapped.",
            picture: ruled([[2, 1]], { xMin: -3, xMax: 4, yMin: -5, yMax: 7 }),
          }),
          pick("$(-1, -1)$", "Yes", ["No"], "2 × −1 + 1.", {
            asks: "on the line",
            changed: "Negatives.",
            picture: ruled([[2, 1]], { xMin: -3, xMax: 4, yMin: -5, yMax: 7 }),
          }),
          pick("$(0, 2)$", "No", ["Yes"], "At x = 0, y is 1.", {
            asks: "on the line",
            changed: "x is 0.",
            picture: ruled([[2, 1]], { xMin: -3, xMax: 4, yMin: -5, yMax: 7 }),
          }),
        ],
        "Put x in: does it give the y?",
      ),

      questionSet(
        "Variation",
        "$y = 3x - 2$. Find y. Watch what changes.",
        [
          ask("$x = -1$", neg(-5), "$-3 - 2$.", "−5.", {
            asks: "y",
            expect: [
              "Sid gets −1 for $x = -1$. Right?",
              "No",
              "$3 \\times -1 = -3$, and $-3 - 2 = -5$.",
              [["Yes", "3 × −1 is −3."]],
            ],
          }),
          ask("$x = -2$", neg(-8), "$-6 - 2$.", "−8.", { asks: "y", changed: "Further left." }),
          ask("$x = 0$", neg(-2), "$0 - 2$.", "−2.", { asks: "y", changed: "Zero." }),
          ask("$x = 2$", "4", "$6 - 2$.", "4.", { asks: "y", changed: "Positive." }),
        ],
        "Brackets round negatives: $3(-1)$.",
      ),
      own(SL, PLOT, "Spot the mistake"),

      own(SL, PLOT, "Exit check"),

      reworded(
        SL,
        PLOT,
        "“Complete the table for $y = 2x - 1$ for $x = -2$ to 2.”",
        { tag: "Real life", title: "$y = 2x - 1$: the y-values for $x = -2$ to 2?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Make a table of x and y, plot the points, rule the line.**"],
        TABLE_LINE,
        [
          "**Make a table of x and y, plot the points, rule the line.**",
          "A point off the line: check its sum.",
          "$3(-1) - 2 = -5$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Parallel lines.

const PARALLEL = "gf-straight-line/parallel";
const parMethod = [
  "Write each line as y = mx + c.",
  "Compare the gradients, m.",
  "Same m: parallel. Use c for where it crosses.",
];
const TWO = ruled(
  [
    [2, 1],
    [2, -3],
  ],
  { xMin: -3, xMax: 4, yMin: -6, yMax: 7 },
);

const parallel = stepped(find(SL, PARALLEL), {
  method: parMethod,
  variation: {
    relationship: "parallel lines share a gradient",
    unknowns: ["parallel", "gradient"],
    surface: ["different c", "terms swapped", "2y or 3y"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Parallel lines",
        ["**Parallel lines have the same gradient, m.**"],
        TWO,
        "Changing c slides a line up or down.",
      ),
      reworded(SL, PARALLEL, "Slide it parallel", { tag: "The rule" }),

      ...owned(SL, PARALLEL, "Warm-up", "Check you remember"),

      methodCard("The method", parMethod, TWO),
      workedFrom(SL, PARALLEL),
      calc(
        "Your turn",
        "Parallel to $y = 3x + 2$, through $(0, -5)$.",
        undefined,
        [
          ["Gradient:", "3", "The same as the first."],
          ["c:", "-5", "Where it crosses the y-axis."],
        ],
        "$y = 3x - 5$.",
      ),

      calc(
        "Practise",
        "Is $3y = 6x + 9$ parallel to $y = 2x - 1$?",
        undefined,
        [["Divide by 3. Gradient:", "2", "6 ÷ 3."]],
        "Both have gradient 2: parallel.",
      ),
      ...owned(SL, PARALLEL, "Together", "Practise"),
      ...owned(SL, PARALLEL, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Parallel to $y = 2x + 1$? Watch what changes.",
        [
          pick("$y = 2x - 5$", "Yes", ["No"], "Both have m = 2.", { asks: "parallel" }),
          pick("$y = 5x + 1$", "No", ["Yes"], "m is 5.", {
            asks: "parallel",
            changed: "Different m.",
          }),
          pick("$y = 1 + 2x$", "Yes", ["No"], "m is still 2.", {
            asks: "parallel",
            changed: "Order swapped.",
          }),
          pick("$y = -2x + 1$", "No", ["Yes"], "m is −2.", {
            asks: "parallel",
            changed: "Negative m.",
          }),
        ],
        "Only m decides: c doesn't matter.",
      ),

      questionSet(
        "Variation",
        "Find the gradient. Watch what changes.",
        [
          ask("$2y = 6x - 4$", "3", "Divide by 2 first.", "3.", {
            asks: "gradient",
            expect: [
              "For $2y = 6x - 4$, Lily says the gradient is 6. Right?",
              "No",
              "Divide by 2 first: $y = 3x - 2$.",
              [["Yes", "Get y on its own first."]],
            ],
          }),
          ask("$y = 6x - 4$", "6", "Already y = mx + c.", "6.", {
            asks: "gradient",
            changed: "Just y.",
          }),
          ask("$3y = 6x - 4$", "2", "Divide by 3.", "2.", { asks: "gradient", changed: "3y." }),
          ask("$y - 6x = 4$", "6", "Add 6x to both sides.", "6.", {
            asks: "gradient",
            changed: "Rearranged.",
          }),
        ],
        "Get y on its own before reading m.",
      ),
      own(SL, PARALLEL, "Spot the mistake"),

      own(SL, PARALLEL, "Exit check"),

      reworded(
        SL,
        PARALLEL,
        "“One rail is $y = 3x + 1$. Which line is parallel to it?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Parallel lines have the same gradient, m.**"],
        TWO,
        [
          "**Parallel lines have the same gradient, m.**",
          "$2y = 6x - 4$ has gradient 3: divide first.",
          "$y = 3 + x$ has gradient 1.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// A line from a point and a gradient.

const POINT = "gf-straight-line/point-gradient";
const pointMethod = [
  "Write y = mx + c with the gradient in.",
  "Put in the point's x and y.",
  "Solve for c, then write the equation.",
];
const AT = ruled([[3, -2]], { xMin: -1, xMax: 4, yMin: -3, yMax: 10 }, [p(2, 4)]);

const pointGradient = stepped(find(SL, POINT), {
  method: pointMethod,
  variation: {
    relationship: "a gradient and a point fix c",
    unknowns: ["c"],
    surface: ["negative x", "negative gradient", "a point on the axis"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Find c from a point",
        ["**Put the point into y = mx + c, then solve for c.**"],
        AT,
        "Gradient 3 through (2, 4): $4 = 6 + c$, so $c = -2$.",
      ),

      ...owned(SL, POINT, "Warm-up", "Check you remember"),

      methodCard("The method", pointMethod, AT),
      workedFrom(SL, POINT),
      calc(
        "Your turn",
        "Gradient 3, through $(4, 5)$.",
        undefined,
        [["$5 = 12 + c$, so $c =$", "-7", "Take 12 from both sides."]],
        "$y = 3x - 7$.",
      ),

      calc(
        "Practise",
        "Gradient −2, through $(1, 6)$.",
        undefined,
        [["$6 = -2 + c$, so $c =$", "8", "Add 2 to both sides."]],
        "$y = -2x + 8$.",
      ),
      ...owned(SL, POINT, "Together", "Practise"),
      ...owned(SL, POINT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Gradient 2. Find c. Watch what changes.",
        [
          ask("Through $(1, 7)$", "5", "$7 = 2 + c$.", "5.", { asks: "c" }),
          ask("Through $(2, 7)$", "3", "$7 = 4 + c$.", "3.", { asks: "c", changed: "x is 2." }),
          ask("Through $(-1, 7)$", "9", "$7 = -2 + c$.", "9.", {
            asks: "c",
            changed: "A negative x.",
          }),
          ask("Through $(0, 7)$", "7", "On the y-axis.", "7.", {
            asks: "c",
            changed: "On the axis.",
          }),
        ],
        "Put the point in, then solve.",
      ),

      questionSet(
        "Variation",
        "Find c. Watch the signs.",
        [
          ask("Gradient 4, through $(-2, 1)$", "9", "$1 = -8 + c$.", "9.", {
            asks: "c",
            expect: [
              "Gradient 4, through $(-2, 1)$: Max gets $c = -7$. Right?",
              "No",
              "$1 = -8 + c$, so $c = 1 + 8 = 9$.",
              [["Yes", "Undo −8 by adding 8."]],
            ],
          }),
          ask("Gradient −4, through $(-2, 1)$", neg(-7), "$1 = 8 + c$.", "−7.", {
            asks: "c",
            changed: "Negative gradient.",
          }),
          ask("Gradient −4, through $(2, 1)$", "9", "$1 = -8 + c$.", "9.", {
            asks: "c",
            changed: "Positive x.",
          }),
          ask("Gradient 4, through $(2, 1)$", neg(-7), "$1 = 8 + c$.", "−7.", {
            asks: "c",
            changed: "Both positive.",
          }),
        ],
        "Brackets round negatives keep the signs right.",
      ),
      own(SL, POINT, "Spot the mistake"),

      own(SL, POINT, "Exit check"),

      reworded(
        SL,
        POINT,
        "“Find the equation of the line with gradient 2 through $(3, 11)$.”",
        { tag: "Real life", title: "Gradient 2, through $(3, 11)$. Equation?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Put the point into y = mx + c, then solve for c.**"],
        AT,
        [
          "**Put the point into y = mx + c, then solve for c.**",
          "The point's y isn't c, unless x is 0.",
          "$2 = 5(-1) + c$ gives $c = 7$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// A line through two points.

const TWO_POINTS = "gf-straight-line/two-points";
const twoMethod = [
  "Gradient: change in y ÷ change in x.",
  "Put one point into y = mx + c.",
  "Solve for c.",
];
const PAIR = ruled([[2, -1]], { xMin: 0, xMax: 5, yMin: -2, yMax: 8 }, [p(1, 1), p(3, 5)]);

const twoPoints = stepped(find(SL, TWO_POINTS), {
  method: twoMethod,
  variation: {
    relationship: "two points fix a line",
    unknowns: ["gradient", "line"],
    surface: ["steeper", "going down", "a point on the axis"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two points, one line",
        ["**Gradient = change in y ÷ change in x. Then find c.**"],
        PAIR,
        "Use either point to find c.",
      ),
      reworded(SL, TWO_POINTS, "Gradient between $(1, 2)$ and $(3, 8)$", { tag: "The rule" }),

      ...owned(SL, TWO_POINTS, "Warm-up", "Check you remember"),

      methodCard("The method", twoMethod, PAIR),
      workedFrom(SL, TWO_POINTS),
      calc(
        "Your turn",
        "The line through $(1, 5)$ and $(3, 11)$.",
        undefined,
        [
          ["Gradient:", "3", "6 up, 2 across."],
          ["$5 = 3 + c$, so $c =$", "2", "Take 3 away."],
        ],
        "$y = 3x + 2$.",
      ),

      calc(
        "Practise",
        "The line through $(0, 6)$ and $(3, 0)$.",
        undefined,
        [
          ["Gradient:", "-2", "Down 6, across 3."],
          ["c:", "6", "It crosses the y-axis at 6."],
        ],
        "$y = -2x + 6$.",
      ),
      ...owned(SL, TWO_POINTS, "Together", "Practise"),
      ...owned(SL, TWO_POINTS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find the gradient. Watch what changes.",
        [
          ask("$(1, 2)$ and $(3, 6)$", "2", "4 up, 2 across.", "2.", { asks: "gradient" }),
          ask("$(1, 2)$ and $(3, 10)$", "4", "8 up, 2 across.", "4.", {
            asks: "gradient",
            changed: "Steeper.",
          }),
          ask("$(1, 2)$ and $(5, 4)$", ["0.5", "1/2"], "2 up, 4 across.", "0.5.", {
            asks: "gradient",
            changed: "Flatter.",
          }),
          ask("$(1, 6)$ and $(3, 2)$", neg(-2), "4 down, 2 across.", "−2.", {
            asks: "gradient",
            changed: "Going down.",
          }),
        ],
        "Up over across, signs and all.",
      ),

      questionSet(
        "Variation",
        "Find the line. Watch what changes.",
        [
          pick(
            "$(1, 5)$ and $(2, 7)$",
            "$y = 2x + 3$",
            ["$y = \\frac12 x + 3$", "$y = 2x + 5$"],
            "Up 2, across 1.",
            {
              asks: "line",
              expect: [
                "$(1, 5)$ and $(2, 7)$: Mo gets gradient $\\frac12$. Right?",
                "No",
                "Up 2, across 1: gradient 2.",
                [["Yes", "Up goes on top."]],
              ],
            },
          ),
          pick(
            "$(1, 5)$ and $(2, 8)$",
            "$y = 3x + 2$",
            ["$y = 3x + 5$", "$y = \\frac13 x + 5$"],
            "Up 3, across 1.",
            {
              asks: "line",
              changed: "Steeper.",
            },
          ),
          pick(
            "$(0, 5)$ and $(1, 8)$",
            "$y = 3x + 5$",
            ["$y = 5x + 3$", "$y = 3x + 8$"],
            "c is 5.",
            {
              asks: "line",
              changed: "One on the axis.",
            },
          ),
          pick(
            "$(1, 5)$ and $(2, 3)$",
            "$y = -2x + 7$",
            ["$y = 2x + 3$", "$y = -2x + 5$"],
            "Down 2.",
            {
              asks: "line",
              changed: "Going down.",
            },
          ),
        ],
        "Gradient first, then c.",
      ),
      own(SL, TWO_POINTS, "Spot the mistake"),

      own(SL, TWO_POINTS, "Exit check"),

      reworded(
        SL,
        TWO_POINTS,
        "“The meter reads £7 after 2 miles and £13 after 5 miles. Find the equation of the line.”",
        { tag: "Real life", title: "£7 after 2 miles, £13 after 5. The line?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Gradient = change in y ÷ change in x. Then find c.**"],
        PAIR,
        [
          "**Gradient = change in y ÷ change in x. Then find c.**",
          "Up over across, not across over up.",
          "Check c with the other point.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// What a gradient means.

const GRADIENTS = "gf-straight-line/gradients";
const gradMethod = [
  "Pick two points on the line.",
  "Gradient = change in y ÷ change in x.",
  "Give it units: y-units per x-unit.",
];
const RATE = ruled([[1.5, 1]], { xMin: 0, xMax: 6, yMin: 0, yMax: 9 }, [p(0, 1), p(4, 7)]);

const gradients = stepped(find(SL, GRADIENTS), {
  method: gradMethod,
  variation: {
    relationship: "a gradient is a rate: y per x",
    unknowns: ["gradient", "meaning"],
    surface: ["going down", "different units", "further across"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A gradient is a rate",
        ["**Gradient = change in y ÷ change in x: a rate, with units.**"],
        RATE,
        "Litres per minute, pounds per mile.",
      ),
      reworded(SL, GRADIENTS, "Read the gradient", { tag: "The rule" }),

      ...owned(SL, GRADIENTS, "Warm-up", "Check you remember"),

      methodCard("The method", gradMethod, RATE),
      workedFrom(SL, GRADIENTS),
      calc(
        "Your turn",
        "Find the gradient.",
        ruled([[2, 1]], { xMin: 0, xMax: 6, yMin: 0, yMax: 10 }, [p(0, 1), p(4, 9)]),
        [
          ["Change in y:", "8", "Take the y-values away."],
          ["Change in x:", "4", "Take the x-values away."],
          ["Gradient:", "2", "8 ÷ 4."],
        ],
        "The gradient is 2.",
      ),

      calc(
        "Practise",
        "A taxi: £3 at 0 miles, £15 at 6 miles.",
        undefined,
        [["Gradient:", "2", "12 ÷ 6.", { after: "pounds per mile" }]],
        "£2 per mile.",
      ),
      ...owned(SL, GRADIENTS, "Together", "Practise"),
      reworded(SL, GRADIENTS, "Gradient between $(2, 1)$ and $(6, 13)$", { tag: "Practise" }),
      reworded(
        SL,
        GRADIENTS,
        "A graph of cost (£) against hours worked has gradient 9. This means",
        { tag: "Practise", title: "Cost (£) against hours: gradient 9. This means" },
      ),
      questionSet(
        "Practise",
        "What does the gradient mean? Watch what changes.",
        [
          pick(
            "Cost (£) against hours. Gradient 12.",
            "£12 per hour",
            ["12 hours", "£12 to start"],
            "y per x.",
            {
              asks: "meaning",
            },
          ),
          pick(
            "Distance (km) against hours. Gradient 60.",
            "60 km per hour",
            ["60 hours", "60 km in total"],
            "km per hour.",
            { asks: "meaning", changed: "Distance." },
          ),
          pick(
            "Water (litres) against minutes. Gradient −5.",
            "It drains 5 litres a minute",
            ["It fills 5 litres a minute", "It holds 5 litres"],
            "Negative: going down.",
            { asks: "meaning", changed: "Negative." },
          ),
          pick(
            "Pay (£) against days. Gradient 80.",
            "£80 a day",
            ["80 days", "£80 in total"],
            "£ per day.",
            {
              asks: "meaning",
              changed: "Days.",
            },
          ),
        ],
        "The gradient is y per x.",
      ),

      questionSet(
        "Variation",
        "Find the gradient. Watch what changes.",
        [
          ask("$(0, 50)$ to $(10, 30)$", neg(-2), "−20 ÷ 10.", "−2.", {
            asks: "gradient",
            expect: [
              "$(0, 50)$ to $(10, 30)$: Ed gets gradient 2. Right?",
              "No",
              "$30 - 50 = -20$, and $-20 \\div 10 = -2$.",
              [["Yes", "Is it going up or down?"]],
            ],
          }),
          ask("$(0, 50)$ to $(10, 90)$", "4", "40 ÷ 10.", "4.", {
            asks: "gradient",
            changed: "Going up.",
          }),
          ask("$(0, 50)$ to $(5, 90)$", "8", "40 ÷ 5.", "8.", {
            asks: "gradient",
            changed: "Half as far across.",
          }),
          ask("$(0, 50)$ to $(20, 90)$", "2", "40 ÷ 20.", "2.", {
            asks: "gradient",
            changed: "Twice as far across.",
          }),
        ],
        "Going down: a negative gradient.",
      ),
      own(SL, GRADIENTS, "Spot the mistake"),

      own(SL, GRADIENTS, "Exit check"),

      reworded(
        SL,
        GRADIENTS,
        "“The bath goes from 20 to 80 litres in 5 minutes. Work out the gradient and say what it represents.”",
        { tag: "Real life", title: "20 to 80 litres in 5 minutes. The gradient means?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Gradient = change in y ÷ change in x: a rate, with units.**"],
        RATE,
        [
          "**Gradient = change in y ÷ change in x: a rate, with units.**",
          "Read the axes' values, not the squares.",
          "Going down: negative.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// What an intercept means.

const INTERCEPTS = "gf-straight-line/intercepts";
const intMethod = [
  "y-intercept: put x = 0. It's c.",
  "x-intercept: put y = 0 and solve.",
  "In real life, the y-intercept is the start.",
];
const CROSSES = ruled([[1, -3]], { xMin: -2, xMax: 5, yMin: -5, yMax: 3 }, [p(0, -3), p(3, 0)]);

const intercepts = stepped(find(SL, INTERCEPTS), {
  method: intMethod,
  variation: {
    relationship: "where a line crosses each axis",
    unknowns: ["meaning", "x-intercept"],
    surface: ["plus or minus c", "x taken away", "no c"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two intercepts",
        ["**y-intercept: where x = 0, the start. x-intercept: where y = 0.**"],
        CROSSES,
        "The y-intercept is c in y = mx + c.",
      ),
      reworded(SL, INTERCEPTS, "Where does $y = 2x - 4$ cross the $x$-axis?", { tag: "The rule" }),

      ...owned(SL, INTERCEPTS, "Warm-up", "Check you remember"),

      methodCard("The method", intMethod, CROSSES),
      workedFrom(SL, INTERCEPTS),
      calc(
        "Your turn",
        "$y = 4x - 12$.",
        undefined,
        [
          ["y-intercept: $y =$", "-12", "Put x = 0."],
          ["x-intercept: $x =$", "3", "$4x = 12$."],
        ],
        "$(0, -12)$ and $(3, 0)$.",
      ),

      calc(
        "Practise",
        "$y = 10 - 2x$.",
        undefined,
        [
          ["y-intercept: $y =$", "10", "Put x = 0."],
          ["x-intercept: $x =$", "5", "$2x = 10$."],
        ],
        "$(0, 10)$ and $(5, 0)$.",
      ),
      ...owned(SL, INTERCEPTS, "Together", "Practise"),
      ...owned(SL, INTERCEPTS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "What does the number mean? Watch what changes.",
        [
          pick(
            "Phone: $C = 10m + 15$. The 15 is",
            "a one-off fee",
            ["the cost a month", "the months"],
            "At m = 0.",
            {
              asks: "meaning",
            },
          ),
          pick(
            "Phone: $C = 10m + 15$. The 10 is",
            "the cost a month",
            ["a one-off fee", "the months"],
            "The gradient.",
            {
              asks: "meaning",
              changed: "The other number.",
            },
          ),
          pick(
            "Candle: $h = 30 - 2t$. The 30 is",
            "its height at the start",
            ["how fast it burns", "when it's gone"],
            "At t = 0.",
            { asks: "meaning", changed: "Going down." },
          ),
          pick(
            "Candle: $h = 30 - 2t$. When is $h = 0$?",
            "After 15 hours",
            ["After 30 hours", "After 2 hours"],
            "$2t = 30$.",
            { asks: "x-intercept", changed: "The other intercept." },
          ),
        ],
        "The y-intercept is where it starts.",
      ),

      questionSet(
        "Variation",
        "Where does it cross the x-axis? Watch the signs.",
        [
          ask("$y = 5x - 10$", "2", "$5x = 10$.", "$x = 2$.", {
            asks: "x-intercept",
            expect: [
              "For $y = 5x - 10$, Zara writes $5x = -10$. Right?",
              "No",
              "Add 10 to both sides: $5x = 10$, so $x = 2$.",
              [["Yes", "Undo − 10 by adding."]],
            ],
          }),
          ask("$y = 5x + 10$", neg(-2), "$5x = -10$.", "$x = -2$.", {
            asks: "x-intercept",
            changed: "Plus 10.",
          }),
          ask("$y = 10 - 5x$", "2", "$5x = 10$.", "$x = 2$.", {
            asks: "x-intercept",
            changed: "x is taken away.",
          }),
          ask("$y = 5x$", "0", "$5x = 0$.", "$x = 0$.", { asks: "x-intercept", changed: "No c." }),
        ],
        "Put y = 0, then solve with care.",
      ),
      own(SL, INTERCEPTS, "Spot the mistake"),

      own(SL, INTERCEPTS, "Exit check"),

      reworded(
        SL,
        INTERCEPTS,
        "“The cost is £50 for 1 hour and £80 for 2 hours. Find the $y$-intercept and explain what it means.”",
        { tag: "Real life", title: "£50 for 1 hour, £80 for 2. The y-intercept means?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**y-intercept: where x = 0, the start. x-intercept: where y = 0.**"],
        CROSSES,
        [
          "**y-intercept: where x = 0, the start. x-intercept: where y = 0.**",
          "$4x - 8 = 0$ gives $x = 2$.",
          "Check where the axis really is.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

export const gfStraightLineStepped: [string, UnitLesson[]][] = [
  [FUNCTIONS, [functions]],
  [PLOT, [plot]],
  [PARALLEL, [parallel]],
  [POINT, [pointGradient]],
  [TWO_POINTS, [twoPoints]],
  [GRADIENTS, [gradients]],
  [INTERCEPTS, [intercepts]],
];
