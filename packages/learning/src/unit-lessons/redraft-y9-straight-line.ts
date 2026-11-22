// Year 9, "The equation of a straight line", on the stepped template
// (docs/proposals/lesson-stepped.md): the gradient, the intercept, parallel lines, rearranging into
// y = mx + c, and what m and c mean in real life. Gradients and intercepts read off a graph are
// asked on the graph; working with the equation is algebra, its own picture.
import { ask, calc, explain, methodCard, questionSet, quiz, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, Range, UnitLesson } from "./types.ts";
import { y9StraightLine } from "./y9-straight-line.ts";

const SL = y9StraightLine;
const ALGEBRA = "Working with the equation: the equation is the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const box: Range = { xMin: 0, xMax: 7, yMin: 0, yMax: 10 };
/** The line through two points, with the points marked. */
const through = (a: Point, b: Point, range: Range = box): Picture => {
  const m = (b.y - a.y) / (b.x - a.x);
  return { kind: "graph", range, lines: [{ m, c: a.y - m * a.x }], points: [a, b] };
};
const ruled = (m: number, c: number, range: Range): Picture => ({
  kind: "graph",
  range,
  lines: [{ m, c }],
});
const p = (x: number, y: number): Point => ({ x, y });

// ---------------------------------------------------------------------------------------------
// The gradient.

const GRADIENT = "y9-straight-line/gradient";
const gradientMethod = [
  "Up: take the y-values away.",
  "Across: take the x-values away, in the same order.",
  "Gradient = up ÷ across.",
];
const RISE = through(p(1, 2), p(4, 8));

const gradient = stepped(find(SL, GRADIENT), {
  method: gradientMethod,
  variation: {
    relationship: "gradient = up ÷ across between two points",
    unknowns: ["gradient", "up"],
    surface: ["flatter lines", "steeper lines", "sloping down"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "How steep?",
        ["**Gradient = up ÷ across, between any two points.**"],
        RISE,
        "From (1, 2) to (4, 8): up 6, across 3, so the gradient is 2.",
      ),
      reworded(SL, GRADIENT, "Which way does a negative gradient go?", { tag: "The rule" }),

      ...owned(SL, GRADIENT, "Warm-up", "Check you remember"),

      methodCard("The method", gradientMethod, RISE),
      workedFrom(SL, GRADIENT),
      calc(
        "Your turn",
        "Find the gradient.",
        through(p(1, 3), p(4, 9)),
        [
          ["Up: $9 - 3 =$", "6", "Take the y-values away."],
          ["Across: $4 - 1 =$", "3", "Take the x-values away."],
          ["Gradient:", "2", "Up ÷ across."],
        ],
        "The gradient is 2.",
      ),

      calc(
        "Practise",
        "Find the gradient.",
        through(p(0, 7), p(2, 1)),
        [
          ["Up: $1 - 7 =$", "-6", "It goes down."],
          ["Across: $2 - 0 =$", "2", "Same order."],
          ["Gradient:", "-3", "Up ÷ across."],
        ],
        "The gradient is −3.",
      ),
      ...owned(SL, GRADIENT, "Together", "Practise"),
      ...owned(SL, GRADIENT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("Find the gradient.", "2", "Up 4, across 2.", "2.", {
            asks: "gradient",
            picture: through(p(1, 1), p(3, 5)),
          }),
          ask("How far up from the first point?", "4", "5 − 1.", "4.", {
            asks: "up",
            changed: "Just the up.",
            picture: through(p(1, 1), p(3, 5)),
          }),
          ask("Find the gradient.", ["0.5", "1/2"], "Up 2, across 4.", "0.5.", {
            asks: "gradient",
            changed: "Flatter.",
            picture: through(p(1, 1), p(5, 3)),
          }),
          ask("Find the gradient.", ["-2", "−2"], "Down 4, across 2.", "−2.", {
            asks: "gradient",
            changed: "Sloping down.",
            picture: through(p(0, 4), p(2, 0)),
          }),
        ],
        "Up over across, signs and all.",
      ),

      questionSet(
        "Variation",
        "Find the gradient. Watch what changes.",
        [
          ask("Find the gradient.", "3", "Up 6, across 2.", "3.", {
            asks: "gradient",
            picture: through(p(2, 1), p(4, 7)),
            expect: [
              "Jo divides across by up: $2 \\div 6$. Right?",
              "No",
              "Up ÷ across: $6 \\div 2 = 3$.",
              [["Yes", "Up goes on top."]],
            ],
          }),
          ask("Find the gradient.", "2", "Up 4, across 2.", "2.", {
            asks: "gradient",
            changed: "Less steep.",
            picture: through(p(2, 1), p(4, 5)),
          }),
          ask("Find the gradient.", ["0.5", "1/2"], "Up 2, across 4.", "0.5.", {
            asks: "gradient",
            changed: "Further across.",
            picture: through(p(2, 1), p(6, 3)),
          }),
          ask("Find the gradient.", ["-3", "−3"], "Down 6, across 2.", "−3.", {
            asks: "gradient",
            changed: "Going down.",
            picture: through(p(2, 7), p(4, 1)),
          }),
        ],
        "More up for the same across: steeper.",
      ),
      own(SL, GRADIENT, "Spot the mistake"),

      own(SL, GRADIENT, "Exit check"),

      reworded(SL, GRADIENT, "Is the ramp too steep?", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Gradient = up ÷ across, between any two points.**"],
        RISE,
        [
          "**Gradient = up ÷ across, between any two points.**",
          "Take the values away in the same order.",
          "Down from left to right: a negative gradient.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// The intercept.

const INTERCEPT = "y9-straight-line/intercept";
const interceptMethod = [
  "Write $y = mx + c$ with the gradient in.",
  "Put in the point's x and y.",
  "Solve for c.",
];
const near: Range = { xMin: -4, xMax: 4, yMin: -4, yMax: 7 };
const CROSS = ruled(2, 3, near);

const intercept = stepped(find(SL, INTERCEPT), {
  method: interceptMethod,
  variation: {
    relationship: "c: where the line crosses the y-axis",
    unknowns: ["intercept"],
    surface: ["below zero", "from a point", "on the axis"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Where it starts",
        ["**c is where the line crosses the y-axis, at x = 0.**"],
        CROSS,
        "At x = 0, mx is 0, so y is just c.",
      ),
      reworded(SL, INTERCEPT, "Where does $y = 2x + 3$ cross the y-axis?", { tag: "The rule" }),
      reworded(SL, INTERCEPT, "Move the intercept", { tag: "The rule" }),

      ...owned(SL, INTERCEPT, "Warm-up", "Check you remember"),

      methodCard("The method", interceptMethod, CROSS),
      workedFrom(SL, INTERCEPT),
      calc(
        "Your turn",
        "Gradient 3, through (2, 11). Find c.",
        undefined,
        [
          ["$3 \\times 2 =$", "6", "mx at the point."],
          ["$c = 11 - 6 =$", "5", "What's left of y."],
        ],
        "$y = 3x + 5$.",
      ),

      calc(
        "Practise",
        "Gradient −2, through (3, 4). Find c.",
        undefined,
        [
          ["$-2 \\times 3 =$", "-6", "mx at the point."],
          ["$c = 4 - (-6) =$", "10", "Take away a negative: add."],
        ],
        "$y = -2x + 10$.",
      ),
      ...owned(SL, INTERCEPT, "Together", "Practise"),
      ...owned(SL, INTERCEPT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find c. Watch what changes.",
        [
          ask("Read c from the graph.", "4", "Where it crosses.", "4.", {
            asks: "intercept",
            picture: ruled(1, 4, near),
          }),
          ask("Read c from the graph.", ["-3", "−3"], "Below zero.", "−3.", {
            asks: "intercept",
            changed: "Below zero.",
            picture: ruled(2, -3, near),
          }),
          ask("$y = 9 - 2x$. Find c.", "9", "The number on its own.", "9.", {
            asks: "intercept",
            changed: "Written backwards.",
          }),
          ask("Gradient 2, through (1, 7). Find c.", "5", "7 − 2.", "5.", {
            asks: "intercept",
            changed: "From a point.",
          }),
        ],
        "c is y when x is 0.",
      ),

      questionSet(
        "Variation",
        "Gradient 2. Find c. Watch what changes.",
        [
          ask("Through (3, 11).", "5", "11 − 6.", "5.", {
            asks: "intercept",
            expect: [
              "For (3, 11), Ana works out c = 11 + 6 = 17. Right?",
              "No",
              "Take away: c = 11 − 6 = 5.",
              [["Yes", "Check: 2 × 3 + 17 isn't 11."]],
            ],
          }),
          ask("Through (3, 8).", "2", "8 − 6.", "2.", {
            asks: "intercept",
            changed: "A lower point.",
          }),
          ask("Through (3, 4).", ["-2", "−2"], "4 − 6.", "−2.", {
            asks: "intercept",
            changed: "Below the axis.",
          }),
          ask("Through (0, 4).", "4", "It's on the y-axis.", "4.", {
            asks: "intercept",
            changed: "On the y-axis.",
          }),
        ],
        "Put the point in, then solve for c.",
      ),
      own(SL, INTERCEPT, "Spot the mistake"),

      own(SL, INTERCEPT, "Exit check"),

      reworded(SL, INTERCEPT, "A taxi fare", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**c is where the line crosses the y-axis, at x = 0.**"],
        CROSS,
        [
          "**c is where the line crosses the y-axis, at x = 0.**",
          "From a point: $7 = 3 \\times 2 + c$, so $c = 1$.",
          "$y = 6 - x$ crosses at (0, 6).",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Parallel lines.

const PARALLEL = "y9-straight-line/parallel";
const parallelMethod = [
  "Copy the gradient: parallel lines share m.",
  "Find c: read it, or put in a point.",
  "Write $y = mx + c$.",
];
const TWO_RAILS: Picture = {
  kind: "graph",
  range: { xMin: -3, xMax: 3, yMin: -6, yMax: 8 },
  lines: [
    { m: 2, c: 1 },
    { m: 2, c: -3 },
  ],
};

const parallel = stepped(find(SL, PARALLEL), {
  method: parallelMethod,
  variation: {
    relationship: "parallel lines: the same gradient, a different intercept",
    unknowns: ["gradient", "intercept", "equation"],
    surface: ["a point off the axis", "on the axis", "the same line"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Parallel lines",
        ["**Parallel lines have the same gradient.**"],
        TWO_RAILS,
        "$y = 2x + 1$ and $y = 2x - 3$: only c is different.",
      ),
      reworded(SL, PARALLEL, "Which two lines are parallel?", { tag: "The rule" }),

      ...owned(SL, PARALLEL, "Warm-up", "Check you remember"),

      methodCard("The method", parallelMethod, TWO_RAILS),
      workedFrom(SL, PARALLEL),
      calc(
        "Your turn",
        "Parallel to $y = 3x - 2$, through (0, 4).",
        undefined,
        [
          ["$m =$", "3", "The same gradient."],
          ["$c =$", "4", "It crosses at (0, 4)."],
        ],
        "$y = 3x + 4$.",
      ),

      calc(
        "Practise",
        "Parallel to $y = 4x + 1$, through (2, 3).",
        undefined,
        [
          ["$m =$", "4", "The same gradient."],
          ["$3 = 4 \\times 2 + c$, so $c =$", "-5", "3 − 8."],
        ],
        "$y = 4x - 5$.",
      ),
      ...owned(SL, PARALLEL, "Together", "Practise"),
      ...owned(SL, PARALLEL, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Parallel to $y = 5x - 1$. Watch what changes.",
        [
          ask("Its gradient?", "5", "The same m.", "5.", { asks: "gradient" }),
          ask("Through (0, 3): its c?", "3", "It crosses at 3.", "3.", {
            asks: "intercept",
            changed: "Now c.",
          }),
          ask("Through (1, 8): its c?", "3", "8 − 5.", "3.", {
            asks: "intercept",
            changed: "A point off the axis.",
          }),
          ask(
            "Which is parallel to $y = -2x + 1$?",
            "$y = -2x + 7$",
            "The same m.",
            "$y = -2x + 7$.",
            {
              asks: "equation",
              changed: "A new line.",
              others: ["$y = 2x + 1$", "$y = x - 2$"],
            },
          ),
        ],
        "Same m; find c.",
      ),

      questionSet(
        "Variation",
        "Parallel to $y = 5x + 2$. Watch the point.",
        [
          ask("Through (1, 9)?", "$y = 5x + 4$", "c = 9 − 5.", "$y = 5x + 4$.", {
            asks: "equation",
            others: ["$y = 4x + 5$", "$y = 5x + 9$"],
            expect: [
              "Through (1, 9), Ben writes $y = 4x + 5$. Right?",
              "No",
              "Keep m = 5; c = 4: $y = 5x + 4$.",
              [["Yes", "Which number is the gradient?"]],
            ],
          }),
          ask("Through (2, 9)?", "$y = 5x - 1$", "c = 9 − 10.", "$y = 5x - 1$.", {
            asks: "equation",
            changed: "A different point.",
            others: ["$y = 5x + 9$", "$y = 2x + 5$"],
          }),
          ask("Through (0, 9)?", "$y = 5x + 9$", "On the y-axis.", "$y = 5x + 9$.", {
            asks: "equation",
            changed: "On the y-axis.",
            others: ["$y = 9x + 5$", "$y = 5x + 2$"],
          }),
          ask("Through (0, 2)?", "The same line", "It's already on it.", "$y = 5x + 2$ itself.", {
            asks: "equation",
            changed: "A point on the line.",
            others: ["$y = 5x$", "$y = 2x + 5$"],
          }),
        ],
        "m stays; the point decides c.",
      ),
      own(SL, PARALLEL, "Spot the mistake"),

      quiz([
        [
          [
            "Which is parallel to $y = 4x - 3$?",
            "$y = 4x + 7$",
            ["$y = 3x - 4$", "$y = -4x + 3$"],
            "The same gradient, 4.",
          ],
          [
            "Which line is parallel to $y = -x + 2$?",
            "$y = -x - 5$",
            ["$y = x + 2$", "$y = 2x - 1$"],
            "The same gradient, −1.",
          ],
        ],
        [
          [
            "Parallel to $y = 3x + 1$, through (0, 5)?",
            "$y = 3x + 5$",
            ["$y = 5x + 3$", "$y = 3x + 1$"],
            "m = 3, c = 5.",
          ],
          [
            "Parallel to $y = 2x - 4$, through (0, 1)?",
            "$y = 2x + 1$",
            ["$y = x + 2$", "$y = 2x - 4$"],
            "m = 2, c = 1.",
          ],
        ],
        [
          ["Parallel to $y = 2x$, through (2, 9). c?", "5", ["9", "2"], "9 − 4."],
          ["Parallel to $y = 3x$, through (1, 7). c?", "4", ["7", "3"], "7 − 3."],
        ],
      ]),

      reworded(SL, PARALLEL, "Railway tracks", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Parallel lines have the same gradient.**"],
        TWO_RAILS,
        [
          "**Parallel lines have the same gradient.**",
          "Copy m; find c from a point.",
          "$y = 3x + 1$ and $y = 3 + x$ aren't parallel.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Into y = mx + c.

const REARRANGE = "y9-straight-line/rearrange";
const rearrangeMethod = [
  "Move the x term to the other side.",
  "Divide every term by the number in front of y.",
  "Write it as $y = mx + c$.",
];
const REARRANGED = maths("2y + 4x = 6 \\;\\Rightarrow\\; y = -2x + 3");

const rearrange = stepped(find(SL, REARRANGE), {
  method: rearrangeMethod,
  variation: {
    relationship: "an equation rearranged into y = mx + c",
    unknowns: ["gradient", "intercept", "equation"],
    surface: ["a number in front of y", "minus signs", "just y"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Into y = mx + c",
        ["**Get y on its own, then read m and c.**"],
        REARRANGED,
        "Divide every term by the number in front of y.",
      ),
      reworded(SL, REARRANGE, "$y = 7 - 3x$ is the same line as", { tag: "The rule" }),
      reworded(SL, REARRANGE, "Get y on its own", { tag: "The rule" }),

      ...owned(SL, REARRANGE, "Warm-up", "Check you remember"),

      methodCard("The method", rearrangeMethod, REARRANGED),
      workedFrom(SL, REARRANGE),
      calc(
        "Your turn",
        "Rearrange $3y + 6x = 9$.",
        undefined,
        [
          ["$3y = 9 -$", "6x", "Move the x term."],
          ["Divide by 3: $m =$", "-2", "The number with x."],
          ["$c =$", "3", "The number on its own."],
        ],
        "$y = -2x + 3$.",
      ),

      calc(
        "Practise",
        "Rearrange $2y - 8x = 10$.",
        undefined,
        [
          ["$m =$", "4", "$2y = 8x + 10$, then halve."],
          ["$c =$", "5", "Halve the 10."],
        ],
        "$y = 4x + 5$.",
      ),
      ...owned(SL, REARRANGE, "Together", "Practise"),
      ...owned(SL, REARRANGE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("The gradient of $y + 2x = 5$?", ["-2", "−2"], "$y = 5 - 2x$.", "−2.", {
            asks: "gradient",
          }),
          ask("The intercept of $y + 2x = 5$?", "5", "$y = 5 - 2x$.", "5.", {
            asks: "intercept",
            changed: "Now c.",
          }),
          ask("The gradient of $3y + 6x = 5$?", ["-2", "−2"], "Divide by 3.", "−2.", {
            asks: "gradient",
            changed: "A number in front of y.",
          }),
          ask("Rearrange $2y = 4x - 6$.", "$y = 2x - 3$", "Halve everything.", "$y = 2x - 3$.", {
            asks: "equation",
            changed: "The whole equation.",
            others: ["$y = 4x - 6$", "$y = 2x - 6$"],
          }),
        ],
        "y on its own, then read.",
      ),

      questionSet(
        "Variation",
        "Find the gradient. Watch what changes.",
        [
          ask("$2y + 6x = 8$", ["-3", "−3"], "Divide every term by 2.", "−3.", {
            asks: "gradient",
            expect: [
              "For $2y + 6x = 8$, Isla says the gradient is −6. Right?",
              "No",
              "Divide every term by 2: $y = 4 - 3x$, gradient −3.",
              [["Yes", "Divide by the 2 in front of y."]],
            ],
          }),
          ask("$2y - 6x = 8$", "3", "$2y = 6x + 8$.", "3.", {
            asks: "gradient",
            changed: "Minus, not plus.",
          }),
          ask("$3y + 6x = 8$", ["-2", "−2"], "Divide by 3.", "−2.", {
            asks: "gradient",
            changed: "A 3 in front of y.",
          }),
          ask("$y + 6x = 8$", ["-6", "−6"], "Already just y.", "−6.", {
            asks: "gradient",
            changed: "Just y.",
          }),
        ],
        "Divide every term by what's in front of y.",
      ),
      own(SL, REARRANGE, "Spot the mistake"),

      own(SL, REARRANGE, "Exit check"),

      reworded(SL, REARRANGE, "Will the roads meet?", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Get y on its own, then read m and c.**"],
        REARRANGED,
        [
          "**Get y on its own, then read m and c.**",
          "Divide every term by the number in front of y.",
          "$2y = 6x + 4$: gradient 3, not 6.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// What the line means.

const MEANING = "y9-straight-line/meaning";
const meaningMethod = [
  "The number on its own is the start: its value at 0.",
  "The number with the letter is the rate: the change for each 1.",
  "Say it with units: £ per hour, cm per week.",
];
const CANDLE = ruled(-2, 12, { xMin: 0, xMax: 6, yMin: 0, yMax: 12 });

const meaning = stepped(find(SL, MEANING), {
  method: meaningMethod,
  variation: {
    relationship: "a real line: its rate, its start, and its values",
    unknowns: ["rate", "start", "value"],
    surface: ["faster rates", "taller starts", "not a whole number"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "What the line means",
        ["**The gradient is a rate; the intercept is where it starts.**"],
        CANDLE,
        "A negative gradient: it's going down, like a candle burning.",
      ),
      reworded(SL, MEANING, "A taxi costs $C = 2d + 3$ pounds for d km. What does the 3 mean?", {
        tag: "The rule",
        title: "Taxi: $C = 2d + 3$. What does the 3 mean?",
      }),
      reworded(SL, MEANING, "And what does the 2 mean?", { tag: "The rule" }),

      ...owned(SL, MEANING, "Warm-up", "Check you remember"),

      methodCard("The method", meaningMethod, CANDLE),
      workedFrom(SL, MEANING),
      calc(
        "Your turn",
        "A pool: $V = 50 + 20t$ litres after t minutes.",
        undefined,
        [
          ["Litres at the start:", "50", "The number on its own."],
          ["Litres added each minute:", "20", "The number with t."],
          ["After 5 minutes:", "150", "$50 + 20 \\times 5$."],
        ],
        "It starts at 50 litres and gains 20 a minute.",
      ),

      calc(
        "Practise",
        "A battery: $B = 90 - 6h$ % after h hours.",
        undefined,
        [["Empty when $90 - 6h = 0$: $h =$", "15", "$90 \\div 6$.", { after: "hours" }]],
        "It lasts 15 hours.",
      ),
      ...owned(SL, MEANING, "Together", "Practise"),
      ...owned(SL, MEANING, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Bike hire: $C = 15h + 10$ pounds.",
        [
          ask("The cost per hour, in £?", "15", "The number with h.", "£15.", { asks: "rate" }),
          ask("The fixed charge, in £?", "10", "The number on its own.", "£10.", {
            asks: "start",
            changed: "Now the start.",
          }),
          ask("The cost for 3 hours, in £?", "55", "$15 \\times 3 + 10$.", "£55.", {
            asks: "value",
            changed: "Now use it.",
          }),
          ask("Hours for a £70 bill?", "4", "$15h + 10 = 70$.", "4 hours.", {
            asks: "value",
            changed: "Backwards.",
          }),
        ],
        "Rate with the letter; start on its own.",
      ),

      questionSet(
        "Variation",
        "A candle. When does it burn out? t =",
        [
          ask("$h = 12 - 2t$", "6", "12 ÷ 2.", "6 hours.", {
            asks: "value",
            expect: [
              "For $h = 12 - 2t$, Kofi says it burns out after 2 hours. Right?",
              "No",
              "It loses 2 cm an hour from 12 cm: 6 hours.",
              [["Yes", "How many 2s in 12?"]],
            ],
          }),
          ask("$h = 12 - 3t$", "4", "12 ÷ 3.", "4 hours.", {
            asks: "value",
            changed: "It burns faster.",
          }),
          ask("$h = 18 - 3t$", "6", "18 ÷ 3.", "6 hours.", {
            asks: "value",
            changed: "Taller.",
          }),
          ask("$h = 15 - 2t$", "7.5", "15 ÷ 2.", "7.5 hours.", {
            asks: "value",
            changed: "Not a whole number.",
          }),
        ],
        "Burn-out time = start ÷ rate.",
      ),
      own(SL, MEANING, "Spot the mistake"),

      quiz([
        [
          [
            "Party: $C = 20g + 50$. The 50 is",
            "a fixed charge",
            ["the cost per guest", "the number of guests"],
            "The number on its own.",
          ],
          [
            "Gym: $C = 30m + 25$. The 25 is",
            "a joining fee",
            ["the monthly cost", "the months"],
            "The number on its own.",
          ],
        ],
        [
          ["Taxi: $C = 2d + 4$. Cost of a 0 km ride?", "£4", ["£2", "£0"], "At 0 km, just the 4."],
          ["Taxi: $C = 3d + 5$. Cost of a 0 km ride?", "£5", ["£3", "£0"], "At 0 km, just the 5."],
        ],
        [
          ["Tank: $V = 120 - 8t$. Empty after how many minutes?", "15", ["8", "120"], "120 ÷ 8."],
          ["Tank: $V = 90 - 5t$. Empty after how many minutes?", "18", ["5", "90"], "90 ÷ 5."],
        ],
      ]),

      reworded(SL, MEANING, "A burning candle", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**The gradient is a rate; the intercept is where it starts.**"],
        CANDLE,
        [
          "**The gradient is a rate; the intercept is where it starts.**",
          "$C = 30h + 45$: £45 call-out, £30 an hour.",
          "Negative gradient: going down.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

export const y9StraightLineStepped: [string, UnitLesson[]][] = [
  [GRADIENT, [gradient]],
  [INTERCEPT, [intercept]],
  [PARALLEL, [parallel]],
  [REARRANGE, [rearrange]],
  [MEANING, [meaning]],
];
