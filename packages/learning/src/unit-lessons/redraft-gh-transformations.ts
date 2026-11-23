// GCSE Higher, "Transformations", on the stepped template (docs/proposals/lesson-stepped.md):
// negative scale factors, combined transformations and invariant points, and area and volume
// scale factors. Transformations are shown on the grid; scale factors are number work.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { combined, ghTransformations, jugs, negative } from "./gh-transformations.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, UnitLesson } from "./types.ts";

const TR = ghTransformations;
const WORDS = "A rule in words: the numbers are the picture.";
const P = (x: number, y: number): Point => ({ x, y });
const table = (head: string[], rows: string[][]): Picture => ({ kind: "table", head, rows });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

/** A shape and its image under scale factor k about the origin. */
const enlarged = (k: number): Picture => {
  const shape = [P(1, 1), P(2, 1), P(1, 3)];
  return {
    kind: "graph",
    range: { xMin: -6, xMax: 6, yMin: -6, yMax: 6 },
    shapes: [
      { points: shape, tone: "object", label: "A" },
      { points: shape.map((p) => P(k * p.x, k * p.y)), tone: "image", label: "B" },
    ],
    points: [P(0, 0)],
  };
};

// ---------------------------------------------------------------------------------------------
// Negative scale factors.

const NEG = "gh-transformations/negative-enlargement";
const negMethod = [
  "From the centre to each point.",
  "Multiply by the scale factor: negative goes back through the centre.",
  "Plot each image point.",
];
const sf = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick(
    "A to B: the scale factor, centre (0, 0)?",
    right,
    others,
    "Size, then which side of the centre.",
    {
      asks: "factor",
      picture,
      ...extra,
    },
  );

const negativeLesson = stepped(find(TR, NEG), {
  method: negMethod,
  variation: {
    relationship: "a scale factor's size and sign",
    unknowns: ["point", "factor"],
    surface: ["smaller", "the same size", "the same side"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Out the other side",
        ["**A negative scale factor puts the image through the centre, upside down.**"],
        negative,
        "Scale factor −2: twice the size, on the far side.",
      ),
      reworded(TR, NEG, "Scale factor −2 from (0, 0) sends (1, 2) to", { tag: "The rule" }),

      ...owned(TR, NEG, "Warm-up", "Check you remember"),

      methodCard("The method", negMethod, negative),
      workedFrom(TR, NEG),
      calc(
        "Your turn",
        "Enlarge (3, −2), scale factor −2, centre (0, 0).",
        undefined,
        [
          ["New $x$:", "-6", "3 × −2."],
          ["New $y$:", "4", "−2 × −2."],
        ],
        "(−6, 4).",
      ),

      calc(
        "Practise",
        "Enlarge (4, 6), scale factor $-\\frac12$, centre (0, 0).",
        undefined,
        [
          ["New $x$:", "-2", "4 × −½."],
          ["New $y$:", "-3", "6 × −½."],
        ],
        "(−2, −3).",
      ),
      ...owned(TR, NEG, "Together", "Practise"),
      ...owned(TR, NEG, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Where does (2, 1) go? Centre (0, 0). Watch what changes.",
        [
          pick("Scale factor 2", "(4, 2)", ["(−4, −2)", "(2, 1)"], "× 2.", { asks: "point" }),
          pick("Scale factor −2", "(−4, −2)", ["(4, 2)", "(−2, −1)"], "× −2.", {
            asks: "point",
            changed: "Negative.",
          }),
          pick("Scale factor −1", "(−2, −1)", ["(2, 1)", "(−4, −2)"], "× −1.", {
            asks: "point",
            changed: "Minus one.",
          }),
          pick("Scale factor $-\\frac12$", "(−1, −0.5)", ["(1, 0.5)", "(−4, −2)"], "× −½.", {
            asks: "point",
            changed: "A fraction.",
          }),
        ],
        "Multiply both coordinates by the scale factor.",
      ),

      questionSet(
        "Variation",
        "Read the grid. Watch what changes.",
        [
          sf(enlarged(-2), "−2", ["2", "$-\\frac12$"], {
            expect: [
              "B is twice A, on the other side of (0, 0). Ben says scale factor 2. Right?",
              "No",
              "The other side means negative: −2.",
              [["Yes", "Which side of the centre is B?"]],
            ],
          }),
          sf(enlarged(2), "2", ["−2", "$\\frac12$"], { changed: "The same side." }),
          sf(enlarged(-1), "−1", ["1", "−2"], { changed: "The same size." }),
          sf(enlarged(-0.5), "$-\\frac12$", ["−2", "$\\frac12$"], { changed: "Smaller." }),
        ],
        "Other side: negative. Smaller: a fraction.",
      ),
      own(TR, NEG, "Spot the mistake"),

      own(TR, NEG, "Exit check"),

      reworded(
        TR,
        NEG,
        "“Describe fully the single transformation that maps B to A.”",
        { tag: "Real life", title: "Describe fully the single transformation mapping B to A." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A negative scale factor puts the image through the centre, upside down.**"],
        negative,
        [
          "**A negative scale factor puts the image through the centre, upside down.**",
          "Scale factor −1 is a half-turn.",
          "B back to A: the reciprocal, $-\\frac12$.",
        ],
        DONE,
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Combining transformations.

const COMB = "gh-transformations/combined";
const combMethod = [
  "Do the first transformation.",
  "Do the second to the image.",
  "Compare start and end; describe one move.",
];
const point = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "One at a time, on the new point.", { asks: "point", ...extra });
const fixed = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Which points don't move?", { asks: "invariant", ...extra });

const combinedLesson = stepped(find(TR, COMB), {
  method: combMethod,
  variation: {
    relationship: "two moves as one",
    unknowns: ["point", "invariant"],
    surface: ["the other order", "a rotation", "a translation"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "One after the other",
        [
          "**Do one transformation, then the next on the image; then describe one that does both.**",
        ],
        combined,
        "Points that don't move are invariant.",
      ),
      reworded(TR, COMB, "Reflect in the $x$-axis, then in the $y$-axis. (x, y) becomes", {
        tag: "The rule",
        title: "Reflect in the $x$-axis, then the $y$-axis. (x, y) becomes",
      }),

      ...owned(TR, COMB, "Warm-up", "Check you remember"),

      methodCard("The method", combMethod, combined),
      workedFrom(TR, COMB),
      calc(
        "Your turn",
        "Reflect (4, 1) in the $y$-axis, then in $y = x$.",
        undefined,
        [
          ["After the first: $(?, 1)$, ? =", "-4", "Change the $x$ sign."],
          ["After the second: $(1, ?)$, ? =", "-4", "Swap $x$ and $y$."],
        ],
        "(1, −4).",
      ),

      calc(
        "Practise",
        "Translate (2, 3) by $\\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix}$, then reflect in the $x$-axis.",
        undefined,
        [
          ["After the translation: $(3, ?)$, ? =", "1", "3 − 2."],
          ["After the reflection: $(3, ?)$, ? =", "-1", "Change the $y$ sign."],
        ],
        "(3, −1).",
      ),
      ...owned(TR, COMB, "Together", "Practise"),
      ...owned(TR, COMB, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Where does (3, 1) end up? Watch what changes.",
        [
          point("Reflect in $x$-axis, then $y$-axis", "(−3, −1)", ["(3, 1)", "(1, 3)"]),
          point("Reflect in $y$-axis, then $x$-axis", "(−3, −1)", ["(3, −1)", "(−1, −3)"], {
            changed: "The other order.",
          }),
          point("Reflect in $x$-axis twice", "(3, 1)", ["(3, −1)", "(−3, −1)"], {
            changed: "The same line twice.",
          }),
          point("Reflect in $y = x$, then the $x$-axis", "(1, −3)", ["(−1, 3)", "(3, −1)"], {
            changed: "A diagonal line.",
          }),
        ],
        "The second move acts on the image.",
      ),

      questionSet(
        "Variation",
        "Invariant points. Watch what changes.",
        [
          fixed("Reflection in $y = x$", "Every point on $y = x$", ["Only (0, 0)", "None"], {
            expect: [
              "Leo says reflecting in $x = 1$ then $x = 3$ gives no change. Right?",
              "No",
              "Two parallel reflections make a translation: 4 to the right.",
              [["Yes", "Where does (0, 0) end up?"]],
            ],
          }),
          fixed("Rotation 90° about (0, 0)", "Only (0, 0)", ["Every point", "None"], {
            changed: "A rotation.",
          }),
          fixed("Translation", "None", ["Only (0, 0)", "Every point"], {
            changed: "A translation.",
          }),
          fixed(
            "Enlargement, scale factor 3, centre (1, 1)",
            "Only (1, 1)",
            ["None", "Only (0, 0)"],
            {
              changed: "An enlargement.",
            },
          ),
        ],
        "Invariant points sit on the mirror line, or at the centre.",
      ),
      own(TR, COMB, "Spot the mistake"),

      own(TR, COMB, "Exit check"),

      reworded(
        TR,
        COMB,
        "“Describe fully the single transformation from A to C.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        [
          "**Do one transformation, then the next on the image; then describe one that does both.**",
        ],
        combined,
        [
          "**Do one transformation, then the next on the image; then describe one that does both.**",
          "Reflect in both axes: a 180° rotation.",
          "Invariant: points that don't move.",
        ],
        DONE,
      ),
    ],
    WORDS,
  ),
});

// ---------------------------------------------------------------------------------------------
// Area and volume scale factors.

const SF = "gh-transformations/area-volume-sf";
const sfMethod = [
  "Find the length scale factor $k$.",
  "Area × $k^2$; volume × $k^3$.",
  "Going back: square root or cube root.",
];
const SCALES = table(
  ["Length × ", "Area × ", "Volume × "],
  [
    ["2", "4", "8"],
    ["3", "9", "27"],
  ],
);
const factor = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Square for area; cube for volume.", { asks: "scale", ...extra });
const back = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Root back to the length factor.", { asks: "length", ...extra });

const areaVolume = stepped(find(TR, SF), {
  method: sfMethod,
  variation: {
    relationship: "length, area and volume factors",
    unknowns: ["scale", "length"],
    surface: ["area or volume", "working back", "a bigger factor"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Square for area, cube for volume",
        ["**Lengths × k means areas × k² and volumes × k³.**"],
        SCALES,
        "Double every length: 4 times the area, 8 times the volume.",
      ),
      reworded(TR, SF, "Lengths × 3: area ×", { tag: "The rule" }),

      ...owned(TR, SF, "Warm-up", "Check you remember"),

      methodCard("The method", sfMethod, SCALES),
      workedFrom(TR, SF),
      calc(
        "Your turn",
        "Two similar boxes: lengths × 3. Small one holds 20 cm³.",
        undefined,
        [
          ["Volume scale factor:", "27", "3³."],
          ["Large box holds:", "540", "20 × 27.", { after: "cm³" }],
        ],
        "540 cm³.",
      ),

      calc(
        "Practise",
        "Similar cones: volumes 16 cm³ and 128 cm³.",
        undefined,
        [
          ["Volume scale factor:", "8", "128 ÷ 16."],
          ["Length scale factor:", "2", "∛8."],
        ],
        "Lengths × 2.",
      ),
      ...owned(TR, SF, "Together", "Practise"),
      ...owned(TR, SF, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Lengths × 2. Watch what changes.",
        [
          factor("Area scale factor", "4", ["2", "8"]),
          factor("Volume scale factor", "8", ["4", "6"], { changed: "Volume." }),
          factor("Lengths × 5: area", "25", ["5", "125"], { changed: "A bigger factor." }),
          factor("Lengths × 5: volume", "125", ["25", "15"], { changed: "Volume again." }),
        ],
        "Area: square. Volume: cube.",
      ),

      questionSet(
        "Variation",
        "Find the length scale factor. Watch what changes.",
        [
          back("Volumes 16 and 128", "2", ["8", "4"], {
            expect: [
              "Volume factor 8. Zoe says the length factor is 8 too. Right?",
              "No",
              "Cube root: $\\sqrt[3]{8} = 2$.",
              [["Yes", "Which power links length and volume?"]],
            ],
          }),
          back("Areas 16 and 144", "3", ["9", "128"], { changed: "Areas." }),
          back("Volumes 2 and 54", "3", ["27", "52"], { changed: "Bigger." }),
          back("Areas 50 and 2", "$\\frac15$", ["$\\frac{1}{25}$", "5"], {
            changed: "Getting smaller.",
          }),
        ],
        "Area: square root. Volume: cube root.",
      ),
      reworded(
        TR,
        SF,
        "Where did it go wrong?",
        { title: "Spot Zoe's slip", text: "Tins: 16 and 128 cm³. Small: 3 cm tall." },
        "Spot the mistake",
      ),

      own(TR, SF, "Exit check"),

      reworded(
        TR,
        SF,
        "“How much does the large jug hold?”",
        { tag: "Real life", picture: jugs },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Lengths × k means areas × k² and volumes × k³.**"],
        SCALES,
        [
          "**Lengths × k means areas × k² and volumes × k³.**",
          "Back from volume: cube root.",
          "Double the height: 8 times the volume.",
        ],
        DONE,
      ),
    ],
    WORDS,
  ),
});

export const ghTransformationsStepped: [string, UnitLesson[]][] = [
  [NEG, [negativeLesson]],
  [COMB, [combinedLesson]],
  [SF, [areaVolume]],
];
