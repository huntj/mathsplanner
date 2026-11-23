// GCSE Higher, "Circles and vector proof", on the stepped template
// (docs/proposals/lesson-stepped.md): the equation of a circle, the tangent to a circle, and
// vector proofs. (Circle theorems are in redraft-gh-circle-theorems.ts.) Circles are drawn on
// axes with their numbers marked, so the words say only what to find.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { ghCircles, plain, tangent, triangleVectors } from "./gh-circles.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { DrawingPic, Point, UnitLesson } from "./types.ts";

const CI = ghCircles;
const ALGEBRA = "Algebra: the equation is the picture.";
const P = (x: number, y: number): Point => ({ x, y });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

/** A circle about the origin on axes, its radius marked where it crosses the x-axis. */
const ring = (r: string): DrawingPic => ({
  kind: "drawing",
  frame: { xMin: -6.5, xMax: 7, yMin: -6.5, yMax: 6.5 },
  items: [
    { line: [P(-6, 0), P(6, 0)], arrow: 1, tone: "soft" },
    { line: [P(0, -6), P(0, 6)], arrow: 1, tone: "soft" },
    { arc: P(0, 0), r: 5, from: 0, to: 360 },
    { line: [P(0, 0), P(5, 0)], tone: "find" },
    { text: r, at: P(2.5, 0.5), tone: "find" },
  ],
});

// ---------------------------------------------------------------------------------------------
// The equation of a circle.

const EQN = "gh-circles/circle-equation";
const eqnMethod = [
  "Centre (0, 0): $x^2 + y^2 = r^2$.",
  "The radius is $\\sqrt{\\text{the number}}$.",
  "On the circle? Put the point in and check.",
];
const on = (prompt: string, right: string, extra: object = {}) =>
  pick(
    prompt,
    right,
    ["Yes", "No"].filter((a) => a !== right),
    "Square both, then add.",
    {
      asks: "on",
      ...extra,
    },
  );

const equation = stepped(find(CI, EQN), {
  method: eqnMethod,
  variation: {
    relationship: "x² + y² = r² for every point",
    unknowns: ["radius", "on"],
    surface: ["swapped", "a negative", "inside the circle"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Pythagoras again",
        ["**A circle with centre (0, 0) and radius r:**", "$x^2 + y^2 = r^2$."],
        plain,
        "The marked point: $9 + 16 = 25$, so it's on the circle.",
      ),
      reworded(CI, EQN, "Radius of $x^2 + y^2 = 49$", { tag: "The rule" }),

      ...owned(CI, EQN, "Warm-up", "Check you remember"),

      methodCard("The method", eqnMethod, plain),
      workedFrom(CI, EQN),
      calc(
        "Your turn",
        "Write the equation of this circle.",
        ring("6"),
        [["$r^2 =$", "36", "6 × 6."]],
        "$x^2 + y^2 = 36$.",
      ),

      calc(
        "Practise",
        "Is (5, 12) on $x^2 + y^2 = 169$?",
        undefined,
        [["$5^2 + 12^2 =$", "169", "25 + 144."]],
        "Yes: it's on the circle.",
      ),
      ...owned(CI, EQN, "Together", "Practise"),
      ...owned(CI, EQN, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The radius. Watch what changes.",
        [
          pick("$x^2 + y^2 = 25$", "5", ["25", "12.5"], "√25.", { asks: "radius" }),
          pick("$x^2 + y^2 = 100$", "10", ["100", "50"], "√100.", {
            asks: "radius",
            changed: "Bigger.",
          }),
          pick("$x^2 + y^2 = 2$", "$\\sqrt2$", ["2", "1"], "Not a square number.", {
            asks: "radius",
            changed: "Not a square.",
          }),
          pick("$x^2 + y^2 = 12$", "$2\\sqrt3$", ["$3\\sqrt2$", "6"], "√12, simplified.", {
            asks: "radius",
            changed: "A surd to simplify.",
          }),
        ],
        "The radius is the square root.",
      ),

      questionSet(
        "Variation",
        "On $x^2 + y^2 = 25$? Watch what changes.",
        [
          on("(3, 4)", "Yes", {
            expect: [
              "Ben checks (1, 5) on $x^2 + y^2 = 25$ by working out $1 + 5$. Right?",
              "No",
              "Square each: $1 + 25 = 26$, so it's not on it.",
              [["Yes", "What does $x^2$ ask you to do?"]],
            ],
          }),
          on("(4, 3)", "Yes", { changed: "Swapped." }),
          on("(−3, 4)", "Yes", { changed: "A negative." }),
          on("(2, 4)", "No", { changed: "Inside the circle." }),
        ],
        "Square, add, compare with $r^2$.",
      ),
      own(CI, EQN, "Spot the mistake"),

      own(CI, EQN, "Exit check"),

      reworded(
        CI,
        EQN,
        "“Is (3, 4) on the circle? Where does it cross the $y$-axis?”",
        { tag: "Real life", title: "Is the marked point on it? Where does it cross the $y$-axis?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A circle with centre (0, 0) and radius r:**", "$x^2 + y^2 = r^2$."],
        plain,
        [
          "**A circle with centre (0, 0) and radius r:** $x^2 + y^2 = r^2$.",
          "$x^2 + y^2 = 36$ has radius 6, not 36.",
          "Check a point: square, add, compare.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// The tangent to a circle.

const TAN = "gh-circles/tangent";
const tanMethod = [
  "Radius gradient: $y \\div x$ at the point.",
  "Tangent gradient: the negative reciprocal.",
  "Put the point in $y = mx + c$ to find $c$.",
];
const flip = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Flip the fraction and change the sign.", {
    asks: "gradient",
    ...extra,
  });

const tangentLesson = stepped(find(CI, TAN), {
  method: tanMethod,
  variation: {
    relationship: "a tangent perpendicular to the radius",
    unknowns: ["gradient", "tangent"],
    surface: ["swapped point", "below the axis", "on an axis"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Radius, then perpendicular",
        ["**The tangent is perpendicular to the radius: use the negative reciprocal gradient.**"],
        tangent,
        "Radius gradient $\\frac43$; tangent $-\\frac34$.",
      ),
      reworded(CI, TAN, "The tangent and the radius meet at", { tag: "The rule" }),

      ...owned(CI, TAN, "Warm-up", "Check you remember"),

      methodCard("The method", tanMethod, tangent),
      workedFrom(CI, TAN),
      calc(
        "Your turn",
        "Tangent to $x^2 + y^2 = 20$ at (2, 4).",
        undefined,
        [
          ["Radius gradient:", "2", "4 ÷ 2."],
          ["Tangent gradient, as a decimal:", "-0.5", "Negative reciprocal of 2."],
          ["$4 = -0.5 \\times 2 + c$, so $c =$", "5", "4 + 1."],
        ],
        "$y = -\\frac12 x + 5$.",
      ),

      calc(
        "Practise",
        "Tangent to $x^2 + y^2 = 10$ at (3, 1).",
        undefined,
        [
          ["Radius gradient $\\frac13$. Tangent gradient:", "-3", "Negative reciprocal."],
          ["$1 = -3 \\times 3 + c$, so $c =$", "10", "1 + 9."],
        ],
        "$y = -3x + 10$.",
      ),
      ...owned(CI, TAN, "Together", "Practise"),
      ...owned(CI, TAN, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Radius gradient to tangent gradient. Watch what changes.",
        [
          flip("Radius gradient 2", "$-\\frac12$", ["−2", "$\\frac12$"]),
          flip("Radius gradient $\\frac12$", "−2", ["$-\\frac12$", "2"], {
            changed: "A fraction.",
          }),
          flip("Radius gradient −3", "$\\frac13$", ["3", "$-\\frac13$"], { changed: "Negative." }),
          flip("Radius gradient $\\frac25$", "$-\\frac52$", ["$-\\frac25$", "$\\frac52$"], {
            changed: "Not a unit fraction.",
          }),
        ],
        "Perpendicular gradients multiply to −1.",
      ),

      questionSet(
        "Variation",
        "Tangent gradient at the point. Watch what changes.",
        [
          pick(
            "At (3, 4) on $x^2 + y^2 = 25$",
            "$-\\frac34$",
            ["$-\\frac43$", "$\\frac43$"],
            "Radius $\\frac43$.",
            {
              asks: "tangent",
              expect: [
                "Radius gradient $\\frac43$. Leo makes the tangent $-\\frac43$. Right?",
                "No",
                "Flip it as well: $-\\frac34$.",
                [["Yes", "Did he flip the fraction?"]],
              ],
            },
          ),
          pick("At (4, 3)", "$-\\frac43$", ["$-\\frac34$", "$\\frac34$"], "Radius $\\frac34$.", {
            asks: "tangent",
            changed: "Swapped.",
          }),
          pick("At (4, −3)", "$\\frac43$", ["$-\\frac43$", "$-\\frac34$"], "Radius $-\\frac34$.", {
            asks: "tangent",
            changed: "Below the axis.",
          }),
          pick("At (0, 5)", "0: a flat line", ["5", "Undefined"], "The radius is upright.", {
            asks: "tangent",
            changed: "On the $y$-axis.",
          }),
        ],
        "Find the radius gradient first.",
      ),
      own(CI, TAN, "Spot the mistake"),

      own(CI, TAN, "Exit check"),

      reworded(
        CI,
        TAN,
        "“Find the tangent at (3, 4).”",
        { tag: "Real life", title: "Find the equation of the tangent at the marked point." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The tangent is perpendicular to the radius: use the negative reciprocal gradient.**"],
        tangent,
        [
          "**The tangent is perpendicular to the radius: use the negative reciprocal gradient.**",
          "Flip and change the sign.",
          "Then find $c$ from the point.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Vector proofs.

const VEC = "gh-circles/vector-proof";
const vecMethod = [
  "Write each vector by a route.",
  "Simplify.",
  "A multiple: parallel. A multiple and a shared point: collinear.",
];
const LINE = ["Collinear", "Parallel only", "Not parallel"];
const line = (prompt: string, right: string, extra: object = {}) =>
  pick(
    prompt,
    right,
    LINE.filter((l) => l !== right),
    "A multiple? A shared point?",
    {
      asks: "collinear",
      ...extra,
    },
  );
const parallel = (prompt: string, right: string, extra: object = {}) =>
  pick(
    prompt,
    right,
    ["Yes", "No"].filter((a) => a !== right),
    "Is it a number times $\\mathbf{a} + 2\\mathbf{b}$?",
    {
      asks: "parallel",
      ...extra,
    },
  );

const vectorProof = stepped(find(CI, VEC), {
  method: vecMethod,
  variation: {
    relationship: "a multiple of a vector",
    unknowns: ["parallel", "collinear"],
    surface: ["negative", "no shared point", "not a multiple"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Multiples mean parallel",
        ["**If one vector is a number times another, the lines are parallel.**"],
        triangleVectors,
        "A multiple and a shared point: the points lie in a line.",
      ),
      reworded(
        CI,
        VEC,
        "$\\overrightarrow{PQ} = 3\\mathbf{c}$ and $\\overrightarrow{RS} = \\mathbf{c}$ mean",
        { tag: "The rule" },
      ),

      ...owned(CI, VEC, "Warm-up", "Check you remember"),

      methodCard("The method", vecMethod, triangleVectors),
      workedFrom(CI, VEC),
      calc(
        "Your turn",
        "$\\overrightarrow{AB} = 2\\mathbf{a} + 4\\mathbf{b}$, $\\overrightarrow{CD} = \\mathbf{a} + 2\\mathbf{b}$.",
        undefined,
        [
          [
            "$\\overrightarrow{AB} = ? \\times \\overrightarrow{CD}$, ? =",
            "2",
            "Each term doubled.",
          ],
        ],
        "AB is parallel to CD, and twice as long.",
      ),

      calc(
        "Practise",
        "$\\overrightarrow{PQ} = \\mathbf{a} - \\mathbf{b}$, $\\overrightarrow{QR} = 3\\mathbf{a} - 3\\mathbf{b}$.",
        undefined,
        [["$\\overrightarrow{QR} = ? \\times \\overrightarrow{PQ}$, ? =", "3", "Take out 3."]],
        "Parallel and sharing Q: P, Q and R are collinear.",
      ),
      ...owned(CI, VEC, "Together", "Practise"),
      ...owned(CI, VEC, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Parallel to $\\mathbf{a} + 2\\mathbf{b}$? Watch what changes.",
        [
          parallel("$3\\mathbf{a} + 6\\mathbf{b}$", "Yes"),
          parallel("$2\\mathbf{a} + 2\\mathbf{b}$", "No", { changed: "Only one doubled." }),
          parallel("$-\\mathbf{a} - 2\\mathbf{b}$", "Yes", { changed: "Negative." }),
          parallel("$\\frac12\\mathbf{a} + \\mathbf{b}$", "Yes", { changed: "A half." }),
        ],
        "Parallel: every term times the same number.",
      ),

      questionSet(
        "Variation",
        "P, Q and R? Watch what changes.",
        [
          line(
            "$\\overrightarrow{PQ} = \\mathbf{a} + \\mathbf{b}$, $\\overrightarrow{QR} = 2\\mathbf{a} + 2\\mathbf{b}$",
            "Collinear",
            {
              expect: [
                "N is the midpoint of AB. Leo writes $\\overrightarrow{BN} = \\frac12(\\mathbf{b} - \\mathbf{a})$. Right?",
                "No",
                "B to A is end − start: $\\mathbf{a} - \\mathbf{b}$.",
                [["Yes", "Which way does B to A go?"]],
              ],
            },
          ),
          line(
            "$\\overrightarrow{PQ} = \\mathbf{a} + \\mathbf{b}$, $\\overrightarrow{RS} = 2\\mathbf{a} + 2\\mathbf{b}$",
            "Parallel only",
            {
              changed: "No shared point.",
            },
          ),
          line(
            "$\\overrightarrow{PQ} = \\mathbf{a} + \\mathbf{b}$, $\\overrightarrow{QR} = 2\\mathbf{a} + \\mathbf{b}$",
            "Not parallel",
            {
              changed: "Not a multiple.",
            },
          ),
          line(
            "$\\overrightarrow{PQ} = \\mathbf{a} + \\mathbf{b}$, $\\overrightarrow{QR} = -3\\mathbf{a} - 3\\mathbf{b}$",
            "Collinear",
            {
              changed: "A negative multiple.",
            },
          ),
        ],
        "Parallel needs a multiple; collinear needs a shared point too.",
      ),
      own(CI, VEC, "Spot the mistake"),

      own(CI, VEC, "Exit check"),

      reworded(
        CI,
        VEC,
        "“Prove MN is parallel to OA.” The key line:",
        { tag: "Real life", picture: triangleVectors },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**If one vector is a number times another, the lines are parallel.**"],
        triangleVectors,
        [
          "**If one vector is a number times another, the lines are parallel.**",
          "Collinear: a multiple and a shared point.",
          "A to B is $\\mathbf{b} - \\mathbf{a}$: end − start.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

export const ghCirclesStepped: [string, UnitLesson[]][] = [
  [EQN, [equation]],
  [TAN, [tangentLesson]],
  [VEC, [vectorProof]],
];
