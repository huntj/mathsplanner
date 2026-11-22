// GCSE Foundation, "Pythagoras and trigonometry", on the stepped template
// (docs/proposals/lesson-stepped.md): Pythagoras' theorem, a length by trigonometry, an angle by
// trigonometry, and the exact values of sin, cos and tan. Every triangle question is asked on its
// triangle: the sides and angles are labelled, and the words say only what to find.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfTrigonometry } from "./gf-trigonometry.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Screen, ShapePic, UnitLesson } from "./types.ts";
import { legs, tri, type Tri } from "./y9-trigonometry.ts";

const TR = gfTrigonometry;
const NUMBER = "A calculation on the triangle: the numbers are the picture.";
/** A right-angled triangle with θ given as an angle, sides labelled. */
const t = (deg: number, sides: Omit<Tri, "deg">): ShapePic =>
  tri({ deg, angle: `${deg}°`, ...sides });
const table = (head: string[], rows: string[][]): Picture => ({ kind: "table", head, rows });
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
  const w = workedFrom(TR, id);
  return w.kind === "worked" ? { ...w, picture } : w;
};

// ---------------------------------------------------------------------------------------------
// Pythagoras' theorem.

const PYTH = "gf-trigonometry/pythagoras";
const pythMethod = [
  "Find the hypotenuse: opposite the right angle.",
  "Hypotenuse: add the squares. Shorter side: subtract.",
  "Square root.",
];
const ABC = legs("a", "b", "c");
const side = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick(
    "Find the missing side, to 1 d.p.",
    right,
    others,
    "Add for c; subtract for a shorter side.",
    {
      asks: "side",
      picture,
      ...extra,
    },
  );
const hyp = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Find c, to 1 d.p.", right, others, "Square, add, square root.", {
    asks: "hypotenuse",
    picture,
    ...extra,
  });

const pythagoras = stepped(find(TR, PYTH), {
  method: pythMethod,
  variation: {
    relationship: "a² + b² = c² in a right-angled triangle",
    unknowns: ["side", "hypotenuse"],
    surface: ["the hypotenuse given", "equal sides", "not a whole number"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Squares on the sides",
        ["**Square the two shorter sides and add: that makes the hypotenuse squared.**"],
        ABC,
        "$a^2 + b^2 = c^2$. For a shorter side, subtract instead.",
      ),
      reworded(TR, PYTH, "Which side is the hypotenuse?", { tag: "The rule" }),

      ...owned(TR, PYTH, "Warm-up", "Check you remember"),

      methodCard("The method", pythMethod, ABC),
      workedOn(PYTH, legs("6 cm", "8 cm", "c")),
      calc(
        "Your turn",
        "Find c.",
        legs("9 cm", "12 cm", "c"),
        [
          ["$9^2 + 12^2 =$", "225", "81 + 144."],
          ["$c = \\sqrt{225} =$", "15", "Square root.", { after: "cm" }],
        ],
        "$c = 15$ cm.",
      ),

      calc(
        "Practise",
        "Find a, to 1 d.p.",
        legs("a", "7 cm", "9 cm"),
        [
          ["$9^2 - 7^2 =$", "32", "81 − 49."],
          ["$a = \\sqrt{32} =$", "5.7", "Round to 1 d.p.", { after: "cm" }],
        ],
        "$a = 5.7$ cm.",
      ),
      ...owned(TR, PYTH, "Together", "Practise"),
      ...owned(TR, PYTH, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find the missing side. Watch what changes.",
        [
          side(legs("6 cm", "8 cm", "?"), "10 cm", ["14 cm", "2 cm"]),
          side(legs("?", "8 cm", "10 cm"), "6 cm", ["12.8 cm", "2 cm"], {
            changed: "The hypotenuse is given.",
          }),
          side(legs("4 cm", "4 cm", "?"), "5.7 cm", ["8 cm", "32 cm"], {
            changed: "Equal sides.",
          }),
          side(legs("?", "12 cm", "20 cm"), "16 cm", ["23.3 cm", "8 cm"], {
            changed: "Bigger numbers.",
          }),
        ],
        "Longest side: add. Shorter side: subtract.",
      ),

      questionSet(
        "Variation",
        "Find c. Watch what changes.",
        [
          hyp(legs("3 cm", "4 cm", "c"), "5 cm", ["3.7 cm", "7 cm"], {
            expect: [
              "Sides 3 and 4. Mia works out $3^2 + 4^2 = 6 + 8$. Right?",
              "No",
              "$3^2 = 9$ and $4^2 = 16$: $c^2 = 25$, so $c = 5$.",
              [["Yes", "Is $3^2$ the same as $3 \\times 2$?"]],
            ],
          }),
          hyp(legs("6 cm", "8 cm", "c"), "10 cm", ["14 cm", "5 cm"], {
            changed: "Double the sides.",
          }),
          hyp(legs("3 cm", "5 cm", "c"), "5.8 cm", ["8 cm", "4 cm"], {
            changed: "Not a whole number.",
          }),
          hyp(legs("5 cm", "5 cm", "c"), "7.1 cm", ["10 cm", "50 cm"], {
            changed: "Equal sides.",
          }),
        ],
        "Square, add, then square root.",
      ),
      own(TR, PYTH, "Spot the mistake"),

      own(TR, PYTH, "Exit check"),

      reworded(
        TR,
        PYTH,
        "“A 5 m ladder, foot 1.5 m from the wall. How high does it reach, to 2 d.p.?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Square the two shorter sides and add: that makes the hypotenuse squared.**"],
        ABC,
        [
          "**Square the two shorter sides and add: that makes the hypotenuse squared.**",
          "$a^2 + b^2 = c^2$; a shorter side: $c^2 - b^2$.",
          "$3^2 = 9$, not 6.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Trigonometry for a length.

const LENGTH = "gf-trigonometry/length";
const lengthMethod = [
  "Label H, O and A from θ.",
  "Pick sin, cos or tan for the two sides you need.",
  "Unknown on top: multiply. On the bottom: divide.",
];
const SOH = tri({ deg: 35, opp: "O", adj: "A", hyp: "H" });
const ratio = (picture: Picture, right: string, extra: object = {}) =>
  pick(
    "Which ratio links the two sides?",
    right,
    ["sin", "cos", "tan"].filter((r) => r !== right),
    "Label H, O and A first.",
    { asks: "ratio", picture, ...extra },
  );
const length = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Find x, to 3 s.f.", right, others, "Pick the ratio, then × or ÷.", {
    asks: "length",
    picture,
    ...extra,
  });

const lengthLesson = stepped(find(TR, LENGTH), {
  method: lengthMethod,
  variation: {
    relationship: "a side from an angle and another side",
    unknowns: ["ratio", "length"],
    surface: ["a bigger angle", "the hypotenuse given", "x on the bottom"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "SOH CAH TOA",
        ["**SOH CAH TOA: pick the ratio with the side you know and the side you want.**"],
        SOH,
        "$\\sin\\theta = \\frac{O}{H}$, $\\cos\\theta = \\frac{A}{H}$, $\\tan\\theta = \\frac{O}{A}$.",
      ),
      reworded(TR, LENGTH, "Label the sides from θ", { tag: "The rule" }),

      ...owned(TR, LENGTH, "Warm-up", "Check you remember"),

      methodCard("The method", lengthMethod, SOH),
      workedOn(LENGTH, t(12, { hyp: "5 m", opp: "h" })),
      calc(
        "Your turn",
        "Find x, to 3 s.f.",
        t(35, { hyp: "10 cm", opp: "x" }),
        [["$x = 10 \\sin 35° =$", "5.74", "O and H: sin. Multiply.", { after: "cm" }]],
        "$x = 5.74$ cm.",
      ),

      calc(
        "Practise",
        "Find h, to 3 s.f.",
        t(40, { adj: "7 cm", hyp: "h" }),
        [
          [
            "$h = 7 \\div \\cos 40° =$",
            "9.14",
            "A and H: cos. h is on the bottom.",
            { after: "cm" },
          ],
        ],
        "$h = 9.14$ cm.",
      ),
      ...owned(TR, LENGTH, "Together", "Practise"),
      ...owned(TR, LENGTH, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which ratio? Watch what changes.",
        [
          ratio(t(35, { hyp: "10 cm", opp: "x" }), "sin"),
          ratio(t(35, { hyp: "10 cm", adj: "x" }), "cos", { changed: "The adjacent." }),
          ratio(t(35, { adj: "10 cm", opp: "x" }), "tan", { changed: "No hypotenuse." }),
          ratio(t(35, { opp: "10 cm", hyp: "x" }), "sin", { changed: "The hypotenuse to find." }),
        ],
        "The two sides you use choose the ratio.",
      ),

      questionSet(
        "Variation",
        "Find x. Watch what changes.",
        [
          length(t(25, { adj: "10 cm", opp: "x" }), "4.66 cm", ["21.4 cm", "9.06 cm"], {
            expect: [
              "Angle 25°, adjacent 10. Kim writes $\\tan 25° = \\frac{10}{x}$. Right?",
              "No",
              "$\\tan = \\frac{O}{A} = \\frac{x}{10}$, so $x = 10 \\tan 25° = 4.66$.",
              [["Yes", "Which side goes on top in tan?"]],
            ],
          }),
          length(t(35, { adj: "10 cm", opp: "x" }), "7.00 cm", ["14.3 cm", "5.74 cm"], {
            changed: "A bigger angle.",
          }),
          length(t(35, { hyp: "10 cm", opp: "x" }), "5.74 cm", ["8.19 cm", "7.00 cm"], {
            changed: "The hypotenuse is given.",
          }),
          length(t(35, { opp: "10 cm", hyp: "x" }), "17.4 cm", ["5.74 cm", "12.2 cm"], {
            changed: "x on the bottom.",
          }),
        ],
        "On top: multiply. On the bottom: divide.",
      ),
      own(TR, LENGTH, "Spot the mistake"),

      own(TR, LENGTH, "Exit check"),

      reworded(
        TR,
        LENGTH,
        "“A 5 m ramp at 12°. How high does it rise, to 3 s.f.?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**SOH CAH TOA: pick the ratio with the side you know and the side you want.**"],
        SOH,
        [
          "**SOH CAH TOA: pick the ratio with the side you know and the side you want.**",
          "Unknown on top: multiply. On the bottom: divide.",
          "Calculator in degrees.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Trigonometry for an angle.

const ANGLE = "gf-trigonometry/angle";
const angleMethod = [
  "Label the two sides you know.",
  "Work out the ratio: O/H, A/H or O/A.",
  "Inverse: SHIFT, then sin, cos or tan.",
];
const EVEN = tri({ deg: 45, opp: "5 cm", adj: "5 cm" });
const inverse = (picture: Picture, right: string, extra: object = {}) =>
  pick(
    "Which do you use to find θ?",
    right,
    ["$\\sin^{-1}$", "$\\cos^{-1}$", "$\\tan^{-1}$"].filter((r) => r !== right),
    "Which two sides are given?",
    { asks: "inverse", picture, ...extra },
  );
const angle = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Find θ, to 1 d.p.", right, others, "Ratio, then the inverse.", {
    asks: "angle",
    picture,
    ...extra,
  });

const angleLesson = stepped(find(TR, ANGLE), {
  method: angleMethod,
  variation: {
    relationship: "an angle from two sides",
    unknowns: ["inverse", "angle"],
    surface: ["the opposite", "no hypotenuse", "swapped sides"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Inverse trig",
        ["**To find an angle, work out the ratio, then use the inverse: sin⁻¹, cos⁻¹ or tan⁻¹.**"],
        EVEN,
        "Here $\\tan\\theta = 1$, so $\\theta = 45°$.",
      ),
      reworded(TR, ANGLE, "Label the sides from θ", { tag: "The rule" }),

      ...owned(TR, ANGLE, "Warm-up", "Check you remember"),

      methodCard("The method", angleMethod, EVEN),
      workedOn(ANGLE, tri({ deg: 21.8, opp: "2.4 m", adj: "6 m" })),
      calc(
        "Your turn",
        "Find θ, to 1 d.p.",
        tri({ deg: 41.8, opp: "6 cm", hyp: "9 cm" }),
        [["$\\theta = \\sin^{-1}(6 \\div 9) =$", "41.8", "O and H: sin⁻¹.", { after: "°" }]],
        "θ = 41.8°.",
      ),

      calc(
        "Practise",
        "Find θ, to 1 d.p.",
        tri({ deg: 51.3, adj: "5 cm", hyp: "8 cm" }),
        [["$\\theta = \\cos^{-1}(5 \\div 8) =$", "51.3", "A and H: cos⁻¹.", { after: "°" }]],
        "θ = 51.3°.",
      ),
      ...owned(TR, ANGLE, "Together", "Practise"),
      ...owned(TR, ANGLE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which inverse? Watch what changes.",
        [
          inverse(tri({ deg: 40, opp: "5 cm", hyp: "8 cm" }), "$\\sin^{-1}$"),
          inverse(tri({ deg: 50, adj: "5 cm", hyp: "8 cm" }), "$\\cos^{-1}$", {
            changed: "The adjacent.",
          }),
          inverse(tri({ deg: 32, opp: "5 cm", adj: "8 cm" }), "$\\tan^{-1}$", {
            changed: "No hypotenuse.",
          }),
          inverse(tri({ deg: 58, opp: "8 cm", adj: "5 cm" }), "$\\tan^{-1}$", {
            changed: "Swapped sides.",
          }),
        ],
        "The two sides you know choose the inverse.",
      ),

      questionSet(
        "Variation",
        "Find θ. Watch what changes.",
        [
          angle(tri({ deg: 36.9, adj: "8 cm", hyp: "10 cm" }), "36.9°", ["53.1°", "38.7°"], {
            expect: [
              "Adjacent 8, hypotenuse 10. Leo writes $\\cos\\theta = \\frac{10}{8}$. Right?",
              "No",
              "$\\cos\\theta = \\frac{A}{H} = \\frac{8}{10}$, so $\\theta = 36.9°$.",
              [["Yes", "Can a cosine be bigger than 1?"]],
            ],
          }),
          angle(tri({ deg: 53.1, opp: "8 cm", hyp: "10 cm" }), "53.1°", ["36.9°", "38.7°"], {
            changed: "The opposite.",
          }),
          angle(tri({ deg: 38.7, opp: "8 cm", adj: "10 cm" }), "38.7°", ["53.1°", "36.9°"], {
            changed: "No hypotenuse.",
          }),
          angle(tri({ deg: 51.3, opp: "10 cm", adj: "8 cm" }), "51.3°", ["38.7°", "36.9°"], {
            changed: "Swapped.",
          }),
        ],
        "Hypotenuse on the bottom, always.",
      ),
      own(TR, ANGLE, "Spot the mistake"),

      own(TR, ANGLE, "Exit check"),

      reworded(
        TR,
        ANGLE,
        "“The roof rises 2.4 m over 6 m. Find the angle, to 1 d.p.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**To find an angle, work out the ratio, then use the inverse: sin⁻¹, cos⁻¹ or tan⁻¹.**"],
        EVEN,
        [
          "**To find an angle, work out the ratio, then use the inverse: sin⁻¹, cos⁻¹ or tan⁻¹.**",
          "The hypotenuse goes on the bottom.",
          "SHIFT, then the ratio.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Exact sin and cos.

const EXACT = "gf-trigonometry/exact-sin-cos";
const exactMethod = [
  "Half-equilateral: 1, √3, 2. Right isosceles: 1, 1, √2.",
  "Read O/H or A/H from the triangle.",
  "Use it in place of a calculator.",
];
const SINCOS = table(
  ["", "0°", "30°", "45°", "60°", "90°"],
  [
    ["sin", "0", "$\\frac12$", "$\\frac{\\sqrt2}{2}$", "$\\frac{\\sqrt3}{2}$", "1"],
    ["cos", "1", "$\\frac{\\sqrt3}{2}$", "$\\frac{\\sqrt2}{2}$", "$\\frac12$", "0"],
  ],
);
const value = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Picture the special triangle.", { asks: "value", ...extra });
const exactly = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Find x exactly.", right, others, "Hypotenuse × the exact value.", {
    asks: "length",
    picture,
    ...extra,
  });

const exactSinCos = stepped(find(TR, EXACT), {
  method: exactMethod,
  variation: {
    relationship: "exact values from the special triangles",
    unknowns: ["value", "length"],
    surface: ["cos, not sin", "60° or 30°", "45°"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "From special triangles",
        ["**Know sin and cos of 0°, 30°, 45°, 60° and 90° without a calculator.**"],
        SINCOS,
        "sin goes up as cos comes down.",
      ),
      reworded(TR, EXACT, "$\\sin 30° =$", { tag: "The rule" }),

      ...owned(TR, EXACT, "Warm-up", "Check you remember"),

      methodCard("The method", exactMethod, SINCOS),
      workedOn(EXACT, t(30, { hyp: "10", opp: "x" })),
      calc(
        "Your turn",
        "Find x exactly.",
        t(60, { hyp: "12 cm", adj: "x" }),
        [["$x = 12 \\times \\frac12 =$", "6", "cos 60° = ½.", { after: "cm" }]],
        "$x = 6$ cm.",
      ),

      calc(
        "Practise",
        "Find x exactly.",
        t(30, { hyp: "4 cm", adj: "x" }),
        [
          [
            "$x = 4 \\times \\frac{\\sqrt3}{2} =$",
            "2",
            "cos 30° = √3/2.",
            { after: "$\\sqrt3$ cm" },
          ],
        ],
        "$x = 2\\sqrt3$ cm.",
      ),
      ...owned(TR, EXACT, "Together", "Practise"),
      ...owned(TR, EXACT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Exact values. Watch what changes.",
        [
          value("$\\sin 30°$", "$\\frac12$", ["$\\frac{\\sqrt3}{2}$", "1"]),
          value("$\\cos 30°$", "$\\frac{\\sqrt3}{2}$", ["$\\frac12$", "$\\frac{\\sqrt2}{2}$"], {
            changed: "cos, not sin.",
          }),
          value("$\\sin 60°$", "$\\frac{\\sqrt3}{2}$", ["$\\frac12$", "$\\sqrt3$"], {
            changed: "60°.",
          }),
          value("$\\sin 45°$", "$\\frac{\\sqrt2}{2}$", ["$\\sqrt2$", "$\\frac12$"], {
            changed: "45°.",
          }),
        ],
        "sin 30° = cos 60° = ½.",
      ),

      questionSet(
        "Variation",
        "Find x exactly. Watch what changes.",
        [
          exactly(t(30, { hyp: "8 cm", opp: "x" }), "4 cm", ["$4\\sqrt3$ cm", "8 cm"], {
            expect: [
              "Sides 1, 1, $\\sqrt2$. Ivy writes $\\sin 45° = \\frac{\\sqrt2}{1}$. Right?",
              "No",
              "O over H: $\\frac{1}{\\sqrt2} = \\frac{\\sqrt2}{2}$.",
              [["Yes", "Can a sine be bigger than 1?"]],
            ],
          }),
          exactly(t(60, { hyp: "8 cm", opp: "x" }), "$4\\sqrt3$ cm", ["4 cm", "$8\\sqrt3$ cm"], {
            changed: "60°.",
          }),
          exactly(t(60, { hyp: "8 cm", adj: "x" }), "4 cm", ["$4\\sqrt3$ cm", "16 cm"], {
            changed: "The adjacent.",
          }),
          exactly(t(45, { hyp: "8 cm", opp: "x" }), "$4\\sqrt2$ cm", ["4 cm", "$8\\sqrt2$ cm"], {
            changed: "45°.",
          }),
        ],
        "Hypotenuse × the exact sin or cos.",
      ),
      own(TR, EXACT, "Spot the mistake"),

      own(TR, EXACT, "Exit check"),

      reworded(
        TR,
        EXACT,
        "“Write down the exact value of $\\cos 60°$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Know sin and cos of 0°, 30°, 45°, 60° and 90° without a calculator.**"],
        SINCOS,
        [
          "**Know sin and cos of 0°, 30°, 45°, 60° and 90° without a calculator.**",
          "sin 30° = cos 60° = ½.",
          "sin 45° = cos 45° = √2/2.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Exact tan.

const TAN = "gf-trigonometry/exact-tan";
const tanMethod = [
  "O over A in the special triangles.",
  "Half-equilateral: 1, √3, 2. Right isosceles: 1, 1.",
  "Opposite = adjacent × tan θ.",
];
const TANS = table(
  ["", "0°", "30°", "45°", "60°"],
  [["tan", "0", "$\\frac{\\sqrt3}{3}$", "1", "$\\sqrt3$"]],
);
const which = (picture: Picture, right: string, extra: object = {}) =>
  pick(
    "Find θ.",
    right,
    ["30°", "45°", "60°"].filter((a) => a !== right),
    "tan θ = O ÷ A: which exact value?",
    { asks: "angle", picture, ...extra },
  );

const exactTan = stepped(find(TR, TAN), {
  method: tanMethod,
  variation: {
    relationship: "exact tan values from the special triangles",
    unknowns: ["value", "angle"],
    surface: ["30° or 60°", "a product", "swapped sides"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Opposite over adjacent",
        ["**Know** $\\tan 30° = \\frac{\\sqrt3}{3}$, $\\tan 45° = 1$, $\\tan 60° = \\sqrt3$."],
        TANS,
        "tan 90° has no value: the adjacent is 0.",
      ),
      reworded(TR, TAN, "$\\tan 45° =$", { tag: "The rule" }),

      ...owned(TR, TAN, "Warm-up", "Check you remember"),

      methodCard("The method", tanMethod, TANS),
      workedOn(TAN, tri({ deg: 45, opp: "3 m", adj: "3 m" })),
      calc(
        "Your turn",
        "Find x exactly.",
        t(60, { adj: "3 cm", opp: "x" }),
        [["$x = 3 \\tan 60° =$", "3", "tan 60° = √3.", { after: "$\\sqrt3$ cm" }]],
        "$x = 3\\sqrt3$ cm.",
      ),

      calc(
        "Practise",
        "Find x exactly.",
        t(30, { adj: "6 cm", opp: "x" }),
        [
          [
            "$x = 6 \\times \\frac{\\sqrt3}{3} =$",
            "2",
            "tan 30° = √3/3.",
            { after: "$\\sqrt3$ cm" },
          ],
        ],
        "$x = 2\\sqrt3$ cm.",
      ),
      ...owned(TR, TAN, "Together", "Practise"),
      ...owned(TR, TAN, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Exact values. Watch what changes.",
        [
          pick("$\\tan 0°$", "0", ["1", "$\\sqrt3$"], "No opposite side.", { asks: "value" }),
          pick("$\\tan 45°$", "1", ["0", "$\\frac{\\sqrt2}{2}$"], "O = A.", {
            asks: "value",
            changed: "45°.",
          }),
          pick("$\\tan 30°$", "$\\frac{\\sqrt3}{3}$", ["$\\sqrt3$", "$\\frac12$"], "1 over √3.", {
            asks: "value",
            changed: "30°.",
          }),
          pick("$\\tan 30° \\times \\tan 60°$", "1", ["$\\sqrt3$", "3"], "√3/3 × √3.", {
            asks: "value",
            changed: "A product.",
          }),
        ],
        "tan 45° = 1: the sides are equal.",
      ),

      questionSet(
        "Variation",
        "Find θ. Watch what changes.",
        [
          which(tri({ deg: 45, opp: "4 cm", adj: "4 cm" }), "45°", {
            expect: [
              "Opposite $\\sqrt3$, adjacent 1. Mia writes $\\tan 60° = \\frac{1}{\\sqrt3}$. Right?",
              "No",
              "O over A: $\\frac{\\sqrt3}{1} = \\sqrt3$.",
              [["Yes", "Which side goes on top in tan?"]],
            ],
          }),
          which(tri({ deg: 60, opp: "4√3 cm", adj: "4 cm" }), "60°", {
            changed: "The opposite × √3.",
          }),
          which(tri({ deg: 30, opp: "4 cm", adj: "4√3 cm" }), "30°", { changed: "Swapped." }),
          which(tri({ deg: 60, opp: "6 cm", adj: "2√3 cm" }), "60°", { changed: "New numbers." }),
        ],
        "tan θ = O ÷ A; match it to 1, √3 or √3/3.",
      ),
      own(TR, TAN, "Spot the mistake"),

      own(TR, TAN, "Exit check"),

      reworded(
        TR,
        TAN,
        "“Write down the exact value of $\\tan 60°$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Know** $\\tan 30° = \\frac{\\sqrt3}{3}$, $\\tan 45° = 1$, $\\tan 60° = \\sqrt3$."],
        TANS,
        [
          "**Know** $\\tan 30° = \\frac{\\sqrt3}{3}$, $\\tan 45° = 1$, $\\tan 60° = \\sqrt3$.",
          "tan is O over A.",
          "tan 90° has no value.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfTrigonometryStepped: [string, UnitLesson[]][] = [
  [PYTH, [pythagoras]],
  [LENGTH, [lengthLesson]],
  [ANGLE, [angleLesson]],
  [EXACT, [exactSinCos]],
  [TAN, [exactTan]],
];
