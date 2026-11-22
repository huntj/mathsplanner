// GCSE Foundation, "Vectors", on the stepped template (docs/proposals/lesson-stepped.md): column
// vectors, adding and subtracting, multiplying by a number, and routes in diagrams. Arrows on
// squared paper and the parallelogram OABC are the pictures; the columns are their own picture.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfVectors, paper, parallelogram, scaled, shift, triangle, vec } from "./gf-vectors.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Screen, UnitLesson } from "./types.ts";

const VE = gfVectors;
const COLUMNS = "Column vectors: the numbers are the picture.";
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";
/** A lesson's own worked example, drawn. */
const workedOn = (id: string, picture: Picture): Screen => {
  const w = workedFrom(VE, id);
  return w.kind === "worked" ? { ...w, picture } : w;
};
/** One arrow on squared paper, unlabelled. */
const arrow = (from: [number, number], by: [number, number]) => paper(6, 5, [{ from, by }]);

// ---------------------------------------------------------------------------------------------
// Translations as vectors.

const COLUMN = "gf-vectors/column-vectors";
const columnMethod = [
  "Count across: right is +, left is −.",
  "Count up: up is +, down is −.",
  "Across on top, up below.",
];
const name = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Write the vector for the arrow.", right, others, "Across first, then up.", {
    asks: "vector",
    picture,
    ...extra,
  });
const between = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "End − start, for each number.", { asks: "between", ...extra });

const columns = stepped(find(VE, COLUMN), {
  method: columnMethod,
  variation: {
    relationship: "across and up as a column",
    unknowns: ["vector", "between"],
    surface: ["leftwards", "downwards", "the other way"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Top across, bottom up",
        ["**The top number is across; the bottom number is up.**"],
        shift,
        "Negative top: left. Negative bottom: down.",
      ),
      reworded(VE, COLUMN, `${vec(-2, 5)} means`, { tag: "The rule" }),

      ...owned(VE, COLUMN, "Warm-up", "Check you remember"),

      methodCard("The method", columnMethod, shift),
      workedFrom(VE, COLUMN),
      calc(
        "Your turn",
        "Write the vector for the arrow.",
        arrow([1, 4], [4, -3]),
        [
          ["Across:", "4", "Right is +."],
          ["Up:", "-3", "Down is −."],
        ],
        vec(4, -3),
      ),

      calc(
        "Practise",
        `Translate (3, 1) by ${vec(-2, 4)}.`,
        undefined,
        [
          ["New $x$:", "1", "3 − 2."],
          ["New $y$:", "5", "1 + 4."],
        ],
        "(1, 5).",
      ),
      ...owned(VE, COLUMN, "Together", "Practise"),
      ...owned(VE, COLUMN, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Name each arrow. Watch what changes.",
        [
          name(arrow([1, 1], [3, 2]), vec(3, 2), [vec(2, 3), vec(-3, -2)]),
          name(arrow([4, 1], [-3, 2]), vec(-3, 2), [vec(3, 2), vec(2, -3)], {
            changed: "Leftwards.",
          }),
          name(arrow([4, 3], [-3, -2]), vec(-3, -2), [vec(3, 2), vec(-2, -3)], {
            changed: "Left and down.",
          }),
          name(arrow([3, 4], [0, -3]), vec(0, -3), [vec(-3, 0), vec(0, 3)], {
            changed: "Straight down.",
          }),
        ],
        "Across on top, up below; signs for direction.",
      ),

      questionSet(
        "Variation",
        "From one point to another. Watch what changes.",
        [
          between("A(4, 1) to B(1, 3)", vec(-3, 2), [vec(3, 2), vec(-3, -2)], {
            expect: [
              "From A(4, 1) to B(1, 3), Ben works out across as $4 - 1 = 3$. Right?",
              "No",
              "End − start: $1 - 4 = -3$, so 3 left.",
              [["Yes", "Does B lie to the left or right of A?"]],
            ],
          }),
          between("B(1, 3) to A(4, 1)", vec(3, -2), [vec(-3, 2), vec(3, 2)], {
            changed: "The other way.",
          }),
          between("A(4, 1) to C(4, 5)", vec(0, 4), [vec(4, 0), vec(0, -4)], {
            changed: "Straight up.",
          }),
          between("A(4, 1) to D(−1, −2)", vec(-5, -3), [vec(5, 3), vec(-3, -5)], {
            changed: "Negatives.",
          }),
        ],
        "End − start, top and bottom.",
      ),
      own(VE, COLUMN, "Spot the mistake"),

      own(VE, COLUMN, "Exit check"),

      reworded(
        VE,
        COLUMN,
        `“Write the vector that takes P back after ${vec(4, 3)}.”`,
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The top number is across; the bottom number is up.**"],
        shift,
        [
          "**The top number is across; the bottom number is up.**",
          "From A to B: B − A.",
          "Going back: change both signs.",
        ],
        DONE,
      ),
    ],
    COLUMNS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Adding and subtracting vectors.

const ADD = "gf-vectors/add-subtract";
const addMethod = [
  "Line up the columns.",
  "Add or subtract the tops.",
  "Then the bottoms; watch the signs.",
];
const sum = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Tops together, bottoms together.", { asks: "sum", ...extra });
const difference = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Take away a negative: add.", { asks: "difference", ...extra });

const addSubtract = stepped(find(VE, ADD), {
  method: addMethod,
  variation: {
    relationship: "columns added or taken away",
    unknowns: ["sum", "difference"],
    surface: ["a negative top", "both negative", "the reverse"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Nose to tail",
        ["**Add the tops, then the bottoms. On a diagram, go nose to tail.**"],
        triangle,
        "Subtracting **b** is adding it backwards.",
      ),
      reworded(VE, ADD, `${vec(2, 1)} + ${vec(1, 4)}`, { tag: "The rule" }),

      ...owned(VE, ADD, "Warm-up", "Check you remember"),

      methodCard("The method", addMethod, triangle),
      workedFrom(VE, ADD),
      calc(
        "Your turn",
        `Find ${vec(3, -1)} + ${vec(-5, 4)}.`,
        undefined,
        [
          ["Top:", "-2", "3 + (−5)."],
          ["Bottom:", "3", "−1 + 4."],
        ],
        vec(-2, 3),
      ),

      calc(
        "Practise",
        `Find ${vec(1, -2)} − ${vec(-3, 4)}.`,
        undefined,
        [
          ["Top:", "4", "1 − (−3)."],
          ["Bottom:", "-6", "−2 − 4."],
        ],
        vec(4, -6),
      ),
      ...owned(VE, ADD, "Together", "Practise"),
      ...owned(VE, ADD, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Add. Watch what changes.",
        [
          sum(`${vec(3, 2)} + ${vec(1, 4)}`, vec(4, 6), [vec(3, 8), vec(2, -2)]),
          sum(`${vec(3, 2)} + ${vec(-1, 4)}`, vec(2, 6), [vec(4, 6), vec(-3, 8)], {
            changed: "A negative top.",
          }),
          sum(`${vec(3, 2)} + ${vec(-1, -4)}`, vec(2, -2), [vec(4, 6), vec(2, 6)], {
            changed: "Both negative.",
          }),
          sum(`${vec(3, 2)} + ${vec(-3, -2)}`, vec(0, 0), [vec(6, 4), vec(-6, -4)], {
            changed: "The reverse.",
          }),
        ],
        "A vector plus its reverse goes nowhere.",
      ),

      questionSet(
        "Variation",
        "Subtract. Watch what changes.",
        [
          difference(`${vec(4, 1)} − ${vec(2, -2)}`, vec(2, 3), [vec(2, -1), vec(6, -1)], {
            expect: [
              "For $1 - (-2)$, Leo writes $1 - 2 = -1$. Right?",
              "No",
              "Taking away a negative adds: $1 + 2 = 3$.",
              [["Yes", "What is $1 - (-2)$?"]],
            ],
          }),
          difference(`${vec(4, 1)} − ${vec(2, 2)}`, vec(2, -1), [vec(2, 3), vec(6, 3)], {
            changed: "A positive bottom.",
          }),
          difference(`${vec(4, 1)} − ${vec(-2, 2)}`, vec(6, -1), [vec(2, -1), vec(2, 3)], {
            changed: "A negative top.",
          }),
          difference(`${vec(4, 1)} − ${vec(4, 1)}`, vec(0, 0), [vec(8, 2), vec(1, 4)], {
            changed: "Itself.",
          }),
        ],
        "Take away each number, minding the signs.",
      ),
      reworded(
        VE,
        ADD,
        "Where did it go wrong?",
        { text: `Leo finds **a** − **b**: **a** = ${vec(4, 1)}, **b** = ${vec(2, -2)}.` },
        "Spot the mistake",
      ),

      own(VE, ADD, "Exit check"),

      reworded(
        VE,
        ADD,
        "“Write the single vector for the whole journey.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Add the tops, then the bottoms. On a diagram, go nose to tail.**"],
        triangle,
        [
          "**Add the tops, then the bottoms. On a diagram, go nose to tail.**",
          "**a** − **b**: take away each number.",
          "$1 - (-2) = 3$.",
        ],
        DONE,
      ),
    ],
    COLUMNS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Multiplying a vector by a number.

const SCALAR = "gf-vectors/scalar";
const scalarMethod = [
  "Multiply the top.",
  "Multiply the bottom.",
  "A negative number turns it round.",
];
const times = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Multiply both numbers.", { asks: "scale", ...extra });
const combine = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Multiply first, then add or subtract.", {
    asks: "combine",
    ...extra,
  });

const scalar = stepped(find(VE, SCALAR), {
  method: scalarMethod,
  variation: {
    relationship: "a vector scaled, then combined",
    unknowns: ["scale", "combine"],
    surface: ["negative", "a half", "subtract"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Scaling",
        ["**Multiply both numbers. A negative number turns the vector round.**"],
        scaled,
        "3**a** is parallel to **a**, and three times as long.",
      ),
      reworded(VE, SCALAR, `2 × ${vec(-1, 3)}`, { tag: "The rule" }),

      ...owned(VE, SCALAR, "Warm-up", "Check you remember"),

      methodCard("The method", scalarMethod, scaled),
      workedFrom(VE, SCALAR),
      calc(
        "Your turn",
        `Find 3 × ${vec(2, -5)}.`,
        undefined,
        [
          ["Top:", "6", "3 × 2."],
          ["Bottom:", "-15", "3 × (−5)."],
        ],
        vec(6, -15),
      ),

      calc(
        "Practise",
        `**a** = ${vec(1, 2)}, **b** = ${vec(3, -1)}. Find 2**a** + **b**.`,
        undefined,
        [
          ["Top:", "5", "2 + 3."],
          ["Bottom:", "3", "4 − 1."],
        ],
        vec(5, 3),
      ),
      ...owned(VE, SCALAR, "Together", "Practise"),
      ...owned(VE, SCALAR, "Your turn", "Practise"),
      questionSet(
        "Practise",
        `Multiply ${vec(2, -1)}. Watch what changes.`,
        [
          times("× 2", vec(4, -2), [vec(4, -1), vec(2, -2)]),
          times("× 3", vec(6, -3), [vec(6, -1), vec(5, 2)], { changed: "Three times." }),
          times("× −1", vec(-2, 1), [vec(2, -1), vec(-2, -1)], { changed: "Negative." }),
          times("× ½", vec(1, -0.5), [vec(4, -2), vec(1, -1)], { changed: "A half." }),
        ],
        "Both numbers, every time.",
      ),

      questionSet(
        "Variation",
        `**a** = ${vec(1, 3)}, **b** = ${vec(4, -1)}. Watch what changes.`,
        [
          combine("2**a** + **b**", vec(6, 5), [vec(6, 2), vec(5, 4)], {
            expect: [
              `Zoe writes 2**a** as ${vec(2, 3)}. Right?`,
              "No",
              `Double both numbers: 2**a** = ${vec(2, 6)}.`,
              [["Yes", "Did she double the bottom?"]],
            ],
          }),
          combine("**a** + 2**b**", vec(9, 1), [vec(6, 5), vec(9, 5)], {
            changed: "Double **b** instead.",
          }),
          combine("2**a** − **b**", vec(-2, 7), [vec(6, 5), vec(2, 7)], { changed: "Subtract." }),
          combine("−**a**", vec(-1, -3), [vec(1, 3), vec(-1, 3)], { changed: "Negative." }),
        ],
        "Scale each vector, then combine.",
      ),
      reworded(
        VE,
        SCALAR,
        "Where did it go wrong?",
        { text: `Zoe finds 2**a** + **b**: **a** = ${vec(1, 3)}, **b** = ${vec(4, -1)}.` },
        "Spot the mistake",
      ),

      own(VE, SCALAR, "Exit check"),

      reworded(
        VE,
        SCALAR,
        "“Write 3**a** − 2**b** as a column vector.” Top number?",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply both numbers. A negative number turns the vector round.**"],
        scaled,
        [
          "**Multiply both numbers. A negative number turns the vector round.**",
          "$k$**a** is parallel to **a**.",
          "Scale first, then add or subtract.",
        ],
        DONE,
      ),
    ],
    COLUMNS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Vectors in diagrams.

const ROUTE = "gf-vectors/diagrams";
const routeMethod = [
  "Pick a route along known vectors.",
  "With an arrow: +. Against it: −.",
  "Add them up and simplify.",
];
const route = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "With an arrow: +. Against it: −.", {
    asks: "route",
    picture: parallelogram,
    ...extra,
  });
const middle = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Halfway along a side is half its vector.", {
    asks: "midpoint",
    picture: parallelogram,
    ...extra,
  });

const diagrams = stepped(find(VE, ROUTE), {
  method: routeMethod,
  variation: {
    relationship: "a route as a sum of known vectors",
    unknowns: ["route", "midpoint"],
    surface: ["backwards", "two steps", "a midpoint"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Follow a route",
        ["**Follow a route along known vectors: with an arrow, add; against it, subtract.**"],
        parallelogram,
        "Going from A to O is −**a**.",
      ),
      reworded(VE, ROUTE, "$\\overrightarrow{CB}$ is", { tag: "The rule" }),

      ...owned(VE, ROUTE, "Warm-up", "Check you remember"),

      methodCard("The method", routeMethod, parallelogram),
      workedOn(ROUTE, parallelogram),
      calc(
        "Your turn",
        `**a** = ${vec(4, 0)}, **c** = ${vec(1, 3)}. Find $\\overrightarrow{OB}$.`,
        parallelogram,
        [
          ["Top:", "5", "4 + 1."],
          ["Bottom:", "3", "0 + 3."],
        ],
        `$\\overrightarrow{OB}$ = **a** + **c** = ${vec(5, 3)}.`,
      ),

      calc(
        "Practise",
        `**a** = ${vec(4, 0)}, **c** = ${vec(1, 3)}. Find $\\overrightarrow{AC}$.`,
        parallelogram,
        [
          ["Top:", "-3", "1 − 4."],
          ["Bottom:", "3", "3 − 0."],
        ],
        `$\\overrightarrow{AC}$ = **c** − **a** = ${vec(-3, 3)}.`,
      ),
      ...owned(VE, ROUTE, "Together", "Practise"),
      ...owned(VE, ROUTE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Write each in **a** and **c**. Watch what changes.",
        [
          route("$\\overrightarrow{OA}$", "**a**", ["**c**", "−**a**"]),
          route("$\\overrightarrow{AO}$", "−**a**", ["**a**", "**c**"], { changed: "Backwards." }),
          route("$\\overrightarrow{OB}$", "**a** + **c**", ["**a** − **c**", "**c** − **a**"], {
            changed: "Two steps.",
          }),
          route("$\\overrightarrow{AB}$", "**c**", ["**a**", "−**c**"], {
            changed: "Parallel to OC.",
          }),
        ],
        "Equal and parallel sides have the same vector.",
      ),

      questionSet(
        "Variation",
        "Midpoints. Watch what changes.",
        [
          middle(
            "M is the midpoint of CB. Find $\\overrightarrow{OM}$.",
            "**c** + ½**a**",
            ["**c** + **a**", "½**c** + **a**"],
            {
              expect: [
                "M is the midpoint of CB. Kim writes $\\overrightarrow{OM}$ = **c** + **a**. Right?",
                "No",
                "C to M is only half of **a**: **c** + ½**a**.",
                [["Yes", "Does M sit at B?"]],
              ],
            },
          ),
          middle(
            "N is the midpoint of AB. Find $\\overrightarrow{ON}$.",
            "**a** + ½**c**",
            ["**a** + **c**", "½**a** + **c**"],
            { changed: "The other side." },
          ),
          middle(
            "M is the midpoint of OA. Find $\\overrightarrow{MB}$.",
            "½**a** + **c**",
            ["**a** + **c**", "½**a** − **c**"],
            { changed: "Start at a midpoint." },
          ),
          middle(
            "X is the midpoint of OB. Find $\\overrightarrow{OX}$.",
            "½**a** + ½**c**",
            ["**a** + **c**", "½**a** + **c**"],
            { changed: "A diagonal." },
          ),
        ],
        "Half a side: half its vector.",
      ),
      own(VE, ROUTE, "Spot the mistake"),

      own(VE, ROUTE, "Exit check"),

      reworded(
        VE,
        ROUTE,
        "“Write $\\overrightarrow{AC}$ in terms of **a** and **c**.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Follow a route along known vectors: with an arrow, add; against it, subtract.**"],
        parallelogram,
        [
          "**Follow a route along known vectors: with an arrow, add; against it, subtract.**",
          "Backwards along **a** is −**a**.",
          "Halfway along **a** is ½**a**.",
        ],
        DONE,
      ),
    ],
    COLUMNS,
  ),
});

export const gfVectorsStepped: [string, UnitLesson[]][] = [
  [COLUMN, [columns]],
  [ADD, [addSubtract]],
  [SCALAR, [scalar]],
  [ROUTE, [diagrams]],
];
