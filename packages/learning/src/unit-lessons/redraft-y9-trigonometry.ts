// Year 9, "Pythagoras and trigonometry", on the stepped template
// (docs/proposals/lesson-stepped.md): the hypotenuse, a shorter side, cosine, tangent and finding
// an angle. (The sine lesson is in redraft-pilot.ts.) Every triangle question is asked on its
// triangle, with the side or angle to find marked and only what to find in the words.
import { ask, calc, explain, methodCard, questionSet, quiz, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Screen, ShapePic, UnitLesson } from "./types.ts";
import { legs, tri, y9Trigonometry, type Tri } from "./y9-trigonometry.ts";

const T9 = y9Trigonometry;
const NUMBER = "A calculation on the triangle: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
/** A right-angled triangle with θ given as an angle, sides labelled. */
const t = (deg: number, sides: Omit<Tri, "deg">): ShapePic =>
  tri({ deg, angle: `${deg}°`, ...sides });
/** One of a lesson's own screens, retitled so the values stay on its picture. */
const retitled = (id: string, title: string, to: string, tag: string, from?: string): Screen =>
  reworded(T9, id, title, { tag, title: to }, from);

// ---------------------------------------------------------------------------------------------
// The longest side.

const LONG = "y9-trigonometry/longest-side";
const longMethod = [
  "Square the two shorter sides.",
  "Add them: that's c².",
  "Square root to find c.",
];
const PYTH = legs("3 cm", "4 cm", "5 cm");

const longestSide = stepped(find(T9, LONG), {
  method: longMethod,
  variation: {
    relationship: "a² + b² = c² in a right-angled triangle",
    unknowns: ["hypotenuse", "square"],
    surface: ["bigger numbers", "not a whole number", "two equal sides"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The longest side",
        ["**In a right-angled triangle, a² + b² = c², with c the hypotenuse.**"],
        PYTH,
        "The two small squares make the big one: 9 + 16 = 25.",
      ),
      reworded(T9, LONG, "Squares on the sides", { tag: "The rule" }),
      reworded(T9, LONG, "Tap the hypotenuse", { tag: "The rule" }),

      ...owned(T9, LONG, "Warm-up", "Check you remember"),

      methodCard("The method", longMethod, PYTH),
      workedFrom(T9, LONG),
      calc(
        "Your turn",
        "Find the hypotenuse, c.",
        legs("9 cm", "40 cm", "c"),
        [
          ["$9^2 + 40^2 =$", "1681", "81 + 1600."],
          ["$c = \\sqrt{1681} =$", "41", "Square root.", { after: "cm" }],
        ],
        "$c = 41$ cm.",
      ),

      calc(
        "Practise",
        "Find c, to 1 decimal place.",
        legs("3 cm", "5 cm", "c"),
        [
          ["$3^2 + 5^2 =$", "34", "9 + 25."],
          ["$c = \\sqrt{34} =$", "5.8", "Round to 1 d.p.", { after: "cm" }],
        ],
        "$c = 5.8$ cm.",
      ),
      retitled(LONG, "Shorter sides of 8 cm and 15 cm", "Find the hypotenuse", "Practise"),
      retitled(LONG, "Shorter sides of 7 cm and 24 cm", "Once more", "Practise"),
      retitled(LONG, "Shorter sides of 9 cm and 12 cm", "Find the longest side", "Practise"),
      reworded(T9, LONG, "Not a whole number", {
        tag: "Practise",
        title: "To 1 d.p.",
        text: "Sides 4 cm and 7 cm. The hypotenuse?",
      }),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("Find c.", "20", "144 + 256 = 400.", "20 cm.", {
            unit: "cm",
            asks: "hypotenuse",
            picture: legs("12 cm", "16 cm", "c"),
          }),
          ask("Find c².", "400", "144 + 256.", "400.", {
            asks: "square",
            changed: "Just c².",
            picture: legs("12 cm", "16 cm", "c"),
          }),
          ask("Find c, to 1 d.p.", "1.4", "$\\sqrt{2}$.", "1.4 cm.", {
            unit: "cm",
            asks: "hypotenuse",
            changed: "Not a whole number.",
            picture: legs("1 cm", "1 cm", "c"),
          }),
          ask("Find c.", "29", "400 + 441 = 841.", "29 cm.", {
            unit: "cm",
            asks: "hypotenuse",
            changed: "Bigger numbers.",
            picture: legs("20 cm", "21 cm", "c"),
          }),
        ],
        "Square, add, square root.",
      ),

      questionSet(
        "Variation",
        "One side is 6 cm. Find c, to 1 d.p.",
        [
          ask("Find c.", "6.5", "36 + 6.25 = 42.25.", "6.5 cm.", {
            unit: "cm",
            asks: "hypotenuse",
            picture: legs("6 cm", "2.5 cm", "c"),
            expect: [
              "Jo works out $6^2$ as 12. Right?",
              "No",
              "$6^2 = 6 \\times 6 = 36$.",
              [["Yes", "Squaring isn't doubling."]],
            ],
          }),
          ask("Find c.", "7.5", "36 + 20.25 = 56.25.", "7.5 cm.", {
            unit: "cm",
            asks: "hypotenuse",
            changed: "A longer second side.",
            picture: legs("6 cm", "4.5 cm", "c"),
          }),
          ask("Find c.", "8.5", "36 + 36 = 72.", "8.5 cm.", {
            unit: "cm",
            asks: "hypotenuse",
            changed: "Two equal sides.",
            picture: legs("6 cm", "6 cm", "c"),
          }),
          ask("Find c.", "18.5", "36 + 306.25 = 342.25.", "18.5 cm.", {
            unit: "cm",
            asks: "hypotenuse",
            changed: "Much longer.",
            picture: legs("6 cm", "17.5 cm", "c"),
          }),
        ],
        "c is always longer than either shorter side.",
      ),
      reworded(
        T9,
        LONG,
        "Where did it go wrong?",
        { text: "Jo finds the hypotenuse.", picture: legs("6 cm", "8 cm", "c") },
        "Spot the mistake",
      ),

      quiz([
        [
          [
            "Find the hypotenuse.",
            "10 cm",
            ["14 cm", "100 cm"],
            "$\\sqrt{36 + 64}$.",
            legs("6 cm", "8 cm", "c"),
          ],
          [
            "Find the hypotenuse.",
            "25 cm",
            ["35 cm", "625 cm"],
            "$\\sqrt{225 + 400}$.",
            legs("15 cm", "20 cm", "c"),
          ],
        ],
        [
          [
            "Find c, to 1 d.p.",
            "10.3 cm",
            ["14.0 cm", "106.0 cm"],
            "$\\sqrt{25 + 81}$.",
            legs("5 cm", "9 cm", "c"),
          ],
          [
            "Find c, to 1 d.p.",
            "7.2 cm",
            ["10.0 cm", "52.0 cm"],
            "$\\sqrt{16 + 36}$.",
            legs("4 cm", "6 cm", "c"),
          ],
        ],
        [
          [
            "Which side is the hypotenuse?",
            "c",
            ["a", "b"],
            "Across from the right angle.",
            legs("a", "b", "c"),
          ],
          [
            "Which side is the hypotenuse?",
            "r",
            ["p", "q"],
            "Across from the right angle.",
            legs("p", "q", "r"),
          ],
        ],
      ]),

      reworded(
        T9,
        LONG,
        "Cutting the corner",
        { tag: "Real life", text: "How many metres shorter is Ali's walk?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**In a right-angled triangle, a² + b² = c², with c the hypotenuse.**"],
        PYTH,
        [
          "**In a right-angled triangle, a² + b² = c², with c the hypotenuse.**",
          "Square, add, then square root.",
          "$6^2$ is 36, not 12.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// A shorter side.

const SHORT = "y9-trigonometry/shorter-side";
const shortMethod = [
  "Square the hypotenuse and the side you know.",
  "Take them away: that's a².",
  "Square root to find a.",
];
const TURNED = legs("a", "8 cm", "10 cm");

const shorterSide = stepped(find(T9, SHORT), {
  method: shortMethod,
  variation: {
    relationship: "a² = c² − b² for a shorter side",
    unknowns: ["shorter side", "square", "hypotenuse"],
    surface: ["not a whole number", "the other side known", "adding or taking away"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A shorter side",
        ["**For a shorter side, take the squares away: a² = c² − b².**"],
        TURNED,
        "Adding finds the longest side; taking away finds a shorter one.",
      ),
      reworded(T9, SHORT, "Going the other way", {
        tag: "The rule",
        text: "How do you find the missing side?",
      }),
      reworded(T9, SHORT, "Pythagoras, turned round", { tag: "The rule" }),

      reworded(T9, SHORT, "The hypotenuse", {
        tag: "Check you remember",
        text: "Sides 3 cm and 4 cm. The hypotenuse?",
      }),
      reworded(T9, SHORT, "What is $13^2 - 5^2$?", { tag: "Check you remember" }),

      methodCard("The method", shortMethod, TURNED),
      workedFrom(T9, SHORT),
      calc(
        "Your turn",
        "Find a.",
        legs("a", "12 cm", "15 cm"),
        [
          ["$15^2 - 12^2 =$", "81", "225 − 144."],
          ["$a = \\sqrt{81} =$", "9", "Square root.", { after: "cm" }],
        ],
        "$a = 9$ cm.",
      ),

      calc(
        "Practise",
        "Find a, to 1 decimal place.",
        legs("a", "5 cm", "8 cm"),
        [
          ["$8^2 - 5^2 =$", "39", "64 − 25."],
          ["$a = \\sqrt{39} =$", "6.2", "Round to 1 d.p.", { after: "cm" }],
        ],
        "$a = 6.2$ cm.",
      ),
      retitled(SHORT, "Hypotenuse 17 cm, one side 8 cm", "Find a", "Practise"),
      retitled(SHORT, "Hypotenuse 26 cm, one side 10 cm", "Once more", "Practise"),
      reworded(T9, SHORT, "Hypotenuse 10 cm, one side 6 cm", { tag: "Practise" }),
      reworded(T9, SHORT, "Hypotenuse 9 cm, one side 4 cm", {
        tag: "Practise",
        title: "Hypotenuse 9 cm, side 4 cm",
        text: "Other side, to 1 d.p.?",
      }),
      reworded(T9, SHORT, "Add or take away?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("Find a.", "40", "1681 − 81 = 1600.", "40 cm.", {
            unit: "cm",
            asks: "shorter side",
            picture: legs("a", "9 cm", "41 cm"),
          }),
          ask("Find a².", "1600", "1681 − 81.", "1600.", {
            asks: "square",
            changed: "Just a².",
            picture: legs("a", "9 cm", "41 cm"),
          }),
          ask("Find a, to 1 d.p.", "4.5", "36 − 16 = 20.", "4.5 cm.", {
            unit: "cm",
            asks: "shorter side",
            changed: "Not a whole number.",
            picture: legs("a", "4 cm", "6 cm"),
          }),
          ask("Find c.", "10", "36 + 64.", "10 cm.", {
            unit: "cm",
            asks: "hypotenuse",
            changed: "Now the hypotenuse: add.",
            picture: legs("6 cm", "8 cm", "c"),
          }),
        ],
        "Shorter side: take away. Hypotenuse: add.",
      ),

      questionSet(
        "Variation",
        "The hypotenuse is 13 cm. Watch what changes.",
        [
          ask("Find a.", "12", "169 − 25 = 144.", "12 cm.", {
            unit: "cm",
            asks: "shorter side",
            picture: legs("a", "5 cm", "13 cm"),
            expect: [
              "Kim adds the squares: 169 + 25. Right?",
              "No",
              "For a shorter side, take away: 169 − 25.",
              [["Yes", "Adding finds the hypotenuse."]],
            ],
          }),
          ask("Find a.", "5", "169 − 144 = 25.", "5 cm.", {
            unit: "cm",
            asks: "shorter side",
            changed: "The other side known.",
            picture: legs("a", "12 cm", "13 cm"),
          }),
          ask("Find a, to 1 d.p.", "8.3", "169 − 100 = 69.", "8.3 cm.", {
            unit: "cm",
            asks: "shorter side",
            changed: "Not a whole number.",
            picture: legs("a", "10 cm", "13 cm"),
          }),
          ask("Find c.", "13", "25 + 144.", "13 cm.", {
            unit: "cm",
            asks: "hypotenuse",
            changed: "Now the hypotenuse.",
            picture: legs("5 cm", "12 cm", "c"),
          }),
        ],
        "Is the missing side the longest? Add. If not, take away.",
      ),
      reworded(
        T9,
        SHORT,
        "Where did it go wrong?",
        { text: "Kim finds a shorter side.", picture: legs("a", "9 cm", "15 cm") },
        "Spot the mistake",
      ),

      quiz([
        [
          [
            "Find a.",
            "24 cm",
            ["26.0 cm", "18 cm"],
            "$\\sqrt{625 - 49}$.",
            legs("a", "7 cm", "25 cm"),
          ],
          [
            "Find a.",
            "8 cm",
            ["11.7 cm", "4 cm"],
            "$\\sqrt{100 - 36}$.",
            legs("a", "6 cm", "10 cm"),
          ],
        ],
        [
          [
            "Find a, to 1 d.p.",
            "10.9 cm",
            ["13.0 cm", "7 cm"],
            "$\\sqrt{144 - 25}$.",
            legs("a", "5 cm", "12 cm"),
          ],
          [
            "Find a, to 1 d.p.",
            "7.5 cm",
            ["10.3 cm", "4 cm"],
            "$\\sqrt{81 - 25}$.",
            legs("a", "5 cm", "9 cm"),
          ],
        ],
        [
          [
            "The hypotenuse is 10 cm. Which could be another side?",
            "6 cm",
            ["10 cm", "12 cm"],
            "Shorter than the hypotenuse.",
          ],
          [
            "The hypotenuse is 7 cm. Which could be another side?",
            "5 cm",
            ["7 cm", "9 cm"],
            "Shorter than the hypotenuse.",
          ],
        ],
      ]),

      reworded(
        T9,
        SHORT,
        "Will the ladder reach?",
        { tag: "Real life", text: "How high up the wall does it reach?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**For a shorter side, take the squares away: a² = c² − b².**"],
        TURNED,
        [
          "**For a shorter side, take the squares away: a² = c² − b².**",
          "Longest side: add. Shorter side: take away.",
          "A shorter side is always less than the hypotenuse.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Cosine.

const COS = "y9-trigonometry/cosine";
const cosMethod = [
  "Label the sides from θ: H, O and A.",
  "A and H: use cos.",
  "$A = H \\times \\cos\\theta$. Round at the end.",
];
const CAH = tri({ deg: 35, opp: "O", adj: "A", hyp: "H" });

const cosine = stepped(find(T9, COS), {
  method: cosMethod,
  variation: {
    relationship: "$\\cos\\theta = \\frac{A}{H}$",
    unknowns: ["adjacent", "opposite", "ratio"],
    surface: ["a smaller angle", "a longer hypotenuse", "sin or cos"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The cosine ratio",
        ["**Cosine is adjacent ÷ hypotenuse: A = H × cos θ.**"],
        CAH,
        "Use cos when the side touches the angle.",
      ),
      reworded(T9, COS, "Every angle has a cosine", { tag: "The rule" }),
      reworded(T9, COS, "Which side is adjacent?", { tag: "The rule" }),

      reworded(T9, COS, "The side x is next to the angle, and is not the hypotenuse. It is the…", {
        tag: "Check you remember",
        title: "x touches the angle and isn't the hypotenuse. It's the…",
      }),
      reworded(T9, COS, "Work out $8 \\sin 30°$", { tag: "Check you remember" }),

      methodCard("The method", cosMethod, CAH),
      workedFrom(T9, COS),
      calc(
        "Your turn",
        "Find x.",
        t(40, { adj: "x", hyp: "10 cm" }),
        [
          ["$\\cos 40° =$", "0.766", "To 3 decimal places."],
          ["$x = 10 \\times 0.766 =$", "7.7", "Round to 1 d.p.", { after: "cm" }],
        ],
        "$x = 7.7$ cm.",
      ),

      calc(
        "Practise",
        "Find x, to 1 decimal place.",
        t(25, { adj: "x", hyp: "12 cm", turn: 180 }),
        [["$x = 12 \\cos 25° =$", "10.9", "A = H × cos θ.", { after: "cm" }]],
        "$x = 10.9$ cm.",
      ),
      retitled(COS, "Hypotenuse 15 cm, angle 20°", "Find x", "Practise"),
      retitled(COS, "Hypotenuse 11 cm, angle 35°", "Turned round", "Practise"),
      retitled(COS, "Hypotenuse 10 cm, angle 60°", "Next to the angle", "Practise"),
      reworded(T9, COS, "Hypotenuse 9 cm, angle 35°", {
        tag: "Practise",
        title: "To 1 d.p.",
        text: "The side next to the angle?",
      }),
      reworded(T9, COS, "sin or cos?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Find x, to 1 d.p. Watch what changes.",
        [
          ask("Find x.", "7", "$14 \\cos 60°$.", "7 cm.", {
            unit: "cm",
            asks: "adjacent",
            picture: t(60, { adj: "x", hyp: "14 cm" }),
          }),
          ask("Find x.", "12.1", "$14 \\cos 30°$.", "12.1 cm.", {
            unit: "cm",
            asks: "adjacent",
            changed: "A smaller angle.",
            picture: t(30, { adj: "x", hyp: "14 cm" }),
          }),
          ask("Find x.", "24.2", "$28 \\cos 30°$.", "24.2 cm.", {
            unit: "cm",
            asks: "adjacent",
            changed: "Twice the hypotenuse.",
            picture: t(30, { adj: "x", hyp: "28 cm" }),
          }),
          ask("Which ratio finds x?", "sin", "x is across from the angle.", "sin: O and H.", {
            asks: "ratio",
            changed: "x across the angle.",
            others: ["cos", "tan"],
            picture: t(30, { opp: "x", hyp: "14 cm" }),
          }),
        ],
        "Next to the angle: cos.",
      ),

      questionSet(
        "Variation",
        "The hypotenuse is 12 cm. Find x, to 1 d.p.",
        [
          ask("Find x.", "9.2", "$12 \\cos 40°$.", "9.2 cm.", {
            unit: "cm",
            asks: "adjacent",
            picture: t(40, { adj: "x", hyp: "12 cm" }),
            expect: [
              "Mia uses sin for the side next to the 40°. Right?",
              "No",
              "Next to the angle is the adjacent: use cos.",
              [["Yes", "Which side touches θ?"]],
            ],
          }),
          ask("Find x.", "7.7", "$12 \\sin 40°$.", "7.7 cm.", {
            unit: "cm",
            asks: "opposite",
            changed: "Across the angle: sin.",
            picture: t(40, { opp: "x", hyp: "12 cm" }),
          }),
          ask("Find x.", "7.7", "$12 \\cos 50°$.", "7.7 cm.", {
            unit: "cm",
            asks: "adjacent",
            changed: "A bigger angle.",
            picture: t(50, { adj: "x", hyp: "12 cm" }),
          }),
          ask("Find x.", "9.2", "$12 \\sin 50°$.", "9.2 cm.", {
            unit: "cm",
            asks: "opposite",
            changed: "Across it again.",
            picture: t(50, { opp: "x", hyp: "12 cm" }),
          }),
        ],
        "Touching the angle: cos. Across from it: sin.",
      ),
      reworded(
        T9,
        COS,
        "Where did it go wrong?",
        { text: "Mia finds x.", picture: t(40, { adj: "x", hyp: "12 cm" }) },
        "Spot the mistake",
      ),

      quiz([
        [
          [
            "Find x.",
            "10 cm",
            ["17.3 cm", "40 cm"],
            "$20 \\cos 60°$.",
            t(60, { adj: "x", hyp: "20 cm" }),
          ],
          [
            "Find x.",
            "4 cm",
            ["6.9 cm", "16 cm"],
            "$8 \\cos 60°$.",
            t(60, { adj: "x", hyp: "8 cm" }),
          ],
        ],
        [
          [
            "Find x, to 1 d.p.",
            "10.0 cm",
            ["4.6 cm", "12.1 cm"],
            "$11 \\cos 25°$.",
            t(25, { adj: "x", hyp: "11 cm" }),
          ],
          [
            "Find x, to 1 d.p.",
            "8.5 cm",
            ["5.3 cm", "11.3 cm"],
            "$10 \\cos 32°$.",
            t(32, { adj: "x", hyp: "10 cm" }),
          ],
        ],
        [
          ["Which ratio uses A and H?", "cos", ["sin", "tan"], "CAH.", CAH],
          ["Which ratio uses O and H?", "sin", ["cos", "tan"], "SOH.", CAH],
        ],
      ]),

      reworded(
        T9,
        COS,
        "Will the ramp fit?",
        { tag: "Real life", text: "How far along the ground, to 1 d.p.?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Cosine is adjacent ÷ hypotenuse: A = H × cos θ.**"],
        CAH,
        [
          "**Cosine is adjacent ÷ hypotenuse: A = H × cos θ.**",
          "Touching the angle: cos. Across from it: sin.",
          "Label H, O and A first.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Tangent.

const TAN = "y9-trigonometry/tangent";
const tanMethod = [
  "Label the sides from θ.",
  "O and A, no H: use tan.",
  "$O = A \\times \\tan\\theta$. Round at the end.",
];
const TOA = tri({ deg: 35, opp: "O", adj: "A", hyp: "H" });

const tangent = stepped(find(T9, TAN), {
  method: tanMethod,
  variation: {
    relationship: "$\\tan\\theta = \\frac{O}{A}$",
    unknowns: ["opposite", "ratio"],
    surface: ["smaller angles", "45°", "steep angles"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The tangent ratio",
        ["**Tangent is opposite ÷ adjacent: O = A × tan θ.**"],
        TOA,
        "No hypotenuse needed.",
      ),
      reworded(T9, TAN, "No hypotenuse needed", { tag: "The rule" }),

      ...owned(T9, TAN, "Warm-up", "Check you remember"),

      methodCard("The method", tanMethod, TOA),
      workedFrom(T9, TAN),
      calc(
        "Your turn",
        "Find x.",
        t(35, { opp: "x", adj: "10 cm" }),
        [
          ["$\\tan 35° =$", "0.700", "To 3 decimal places."],
          ["$x = 10 \\times 0.700 =$", "7", "O = A × tan θ.", { after: "cm" }],
        ],
        "$x = 7.0$ cm.",
      ),

      calc(
        "Practise",
        "Find x, to 1 decimal place.",
        t(55, { opp: "x", adj: "6 cm", turn: 180 }),
        [["$x = 6 \\tan 55° =$", "8.6", "O = A × tan θ.", { after: "cm" }]],
        "$x = 8.6$ cm.",
      ),
      retitled(TAN, "Adjacent 10 cm, angle 30°", "Find x", "Practise"),
      retitled(TAN, "Adjacent 9 m, angle 52°", "Turned round", "Practise"),
      retitled(TAN, "Adjacent 8 cm, angle 45°", "Find the side opposite", "Practise"),
      retitled(TAN, "Adjacent 4 cm, angle 62°", "Opposite", "Practise"),
      reworded(T9, TAN, "sin, cos or tan?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Find x, to 1 d.p. Watch what changes.",
        [
          ask("Find x.", "9", "$9 \\tan 45°$.", "9 cm.", {
            unit: "cm",
            asks: "opposite",
            picture: t(45, { opp: "x", adj: "9 cm" }),
          }),
          ask("Find x.", "15.6", "$9 \\tan 60°$.", "15.6 cm.", {
            unit: "cm",
            asks: "opposite",
            changed: "A bigger angle.",
            picture: t(60, { opp: "x", adj: "9 cm" }),
          }),
          ask("Find x.", "5.2", "$9 \\tan 30°$.", "5.2 cm.", {
            unit: "cm",
            asks: "opposite",
            changed: "A smaller angle.",
            picture: t(30, { opp: "x", adj: "9 cm" }),
          }),
          ask("Which ratio finds x?", "sin", "O and H.", "sin.", {
            asks: "ratio",
            changed: "The hypotenuse given.",
            others: ["cos", "tan"],
            picture: t(30, { opp: "x", hyp: "9 cm" }),
          }),
        ],
        "O and A: tan.",
      ),

      questionSet(
        "Variation",
        "The adjacent is 5 cm. Find x, to 1 d.p.",
        [
          ask("Find x.", "7.1", "$5 \\tan 55°$.", "7.1 cm.", {
            unit: "cm",
            asks: "opposite",
            picture: t(55, { opp: "x", adj: "5 cm" }),
            expect: [
              "Sam writes $\\tan 55° = \\frac{5}{x}$. Right?",
              "No",
              "tan is opposite ÷ adjacent: $\\frac{x}{5}$.",
              [["Yes", "Opposite goes on top."]],
            ],
          }),
          ask("Find x.", "3.5", "$5 \\tan 35°$.", "3.5 cm.", {
            unit: "cm",
            asks: "opposite",
            changed: "A smaller angle.",
            picture: t(35, { opp: "x", adj: "5 cm" }),
          }),
          ask("Find x.", "5", "$\\tan 45° = 1$.", "5 cm.", {
            unit: "cm",
            asks: "opposite",
            changed: "45°: equal sides.",
            picture: t(45, { opp: "x", adj: "5 cm" }),
          }),
          ask("Find x.", "13.7", "$5 \\tan 70°$.", "13.7 cm.", {
            unit: "cm",
            asks: "opposite",
            changed: "Steep.",
            picture: t(70, { opp: "x", adj: "5 cm" }),
          }),
        ],
        "The bigger the angle, the longer the opposite.",
      ),
      reworded(
        T9,
        TAN,
        "Where did it go wrong?",
        { text: "Sam finds x.", picture: t(55, { opp: "x", adj: "5 cm" }) },
        "Spot the mistake",
      ),

      quiz([
        [
          [
            "Find x.",
            "12 cm",
            ["8.5 cm", "17 cm"],
            "$12 \\tan 45°$.",
            t(45, { opp: "x", adj: "12 cm" }),
          ],
          [
            "Find x.",
            "7 cm",
            ["4.9 cm", "9.9 cm"],
            "$7 \\tan 45°$.",
            t(45, { opp: "x", adj: "7 cm" }),
          ],
        ],
        [
          [
            "Find x, to 1 d.p.",
            "6.0 cm",
            ["4.2 cm", "3.8 cm"],
            "$5 \\tan 50°$.",
            t(50, { opp: "x", adj: "5 cm" }),
          ],
          [
            "Find x, to 1 d.p.",
            "4.6 cm",
            ["3.4 cm", "5.3 cm"],
            "$8 \\tan 30°$.",
            t(30, { opp: "x", adj: "8 cm" }),
          ],
        ],
        [
          ["Know A, want O. Which ratio?", "tan", ["sin", "cos"], "TOA.", TOA],
          ["Know H, want A. Which ratio?", "cos", ["sin", "tan"], "CAH.", TOA],
        ],
      ]),

      reworded(
        T9,
        TAN,
        "How tall is the tree?",
        { tag: "Real life", text: "How tall is it, to 1 d.p.?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Tangent is opposite ÷ adjacent: O = A × tan θ.**"],
        TOA,
        [
          "**Tangent is opposite ÷ adjacent: O = A × tan θ.**",
          "SOH CAH TOA: pick by the two sides involved.",
          "$\\tan 45° = 1$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Working back to an angle.

const ANGLES = "y9-trigonometry/angles";
const anglesMethod = [
  "Label the sides; pick sin, cos or tan.",
  "Write the ratio as a fraction.",
  "Use the inverse: shift, then the button.",
];
const INVERSE = maths("\\theta = \\tan^{-1}\\left(\\frac{O}{A}\\right)");
const sides = (s: Omit<Tri, "deg">, deg: number) => tri({ deg, ...s });

const angles = stepped(find(T9, ANGLES), {
  method: anglesMethod,
  variation: {
    relationship: "the inverse turns a ratio back into an angle",
    unknowns: ["angle", "ratio"],
    surface: ["sin, cos and tan", "swapped sides", "steep angles"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Working back to an angle",
        ["**Know two sides? Use the inverse to find the angle.**"],
        INVERSE,
        "$\\tan 45° = 1$, so $\\tan^{-1}(1) = 45°$.",
      ),
      reworded(T9, ANGLES, "Going backwards", { tag: "The rule" }),
      reworded(T9, ANGLES, "$\\sin 30° = 0.5$. So what is $\\sin^{-1}(0.5)$?", { tag: "The rule" }),

      ...owned(T9, ANGLES, "Warm-up", "Check you remember"),

      methodCard("The method", anglesMethod, INVERSE),
      workedFrom(T9, ANGLES),
      calc(
        "Your turn",
        "Find θ, to 1 decimal place.",
        sides({ opp: "3 cm", adj: "4 cm" }, 37),
        [
          ["$\\tan\\theta = 3 \\div 4 =$", "0.75", "O and A: tan."],
          ["$\\theta = \\tan^{-1}(0.75) =$", "36.9", "The inverse.", { after: "°" }],
        ],
        "$\\theta = 36.9°$.",
      ),

      calc(
        "Practise",
        "Find θ.",
        sides({ opp: "5 cm", hyp: "10 cm" }, 30),
        [
          ["$\\sin\\theta = 5 \\div 10 =$", "0.5", "O and H: sin."],
          ["$\\theta = \\sin^{-1}(0.5) =$", "30", "The inverse.", { after: "°" }],
        ],
        "$\\theta = 30°$.",
      ),
      retitled(ANGLES, "Opposite 5 cm, hypotenuse 9 cm", "Find θ", "Practise"),
      retitled(ANGLES, "Opposite 8 cm, adjacent 5 cm", "Turned round", "Practise"),
      retitled(ANGLES, "Adjacent 5 cm, hypotenuse 9 cm", "Between them", "Practise"),
      retitled(ANGLES, "Opposite 3 cm, adjacent 3 cm", "Find θ again", "Practise"),
      questionSet(
        "Practise",
        "Find θ. Watch what changes.",
        [
          ask("Find θ.", "30", "$\\sin^{-1}(0.5)$.", "30°.", {
            unit: "°",
            asks: "angle",
            picture: sides({ opp: "6 cm", hyp: "12 cm" }, 30),
          }),
          ask("Find θ.", "60", "$\\cos^{-1}(0.5)$.", "60°.", {
            unit: "°",
            asks: "angle",
            changed: "Adjacent, not opposite.",
            picture: sides({ adj: "6 cm", hyp: "12 cm" }, 60),
          }),
          ask("Find θ.", "45", "$\\tan^{-1}(1)$.", "45°.", {
            unit: "°",
            asks: "angle",
            changed: "No hypotenuse.",
            picture: sides({ opp: "6 cm", adj: "6 cm" }, 45),
          }),
          ask("Which ratio?", "tan", "O and A.", "tan.", {
            asks: "ratio",
            changed: "Just the ratio.",
            others: ["sin", "cos"],
            picture: sides({ opp: "6 cm", adj: "12 cm" }, 27),
          }),
        ],
        "Pick the ratio, then the inverse.",
      ),

      questionSet(
        "Variation",
        "The opposite is 5 cm. Find θ, to 1 d.p.",
        [
          ask("Find θ.", "45", "$\\tan^{-1}(1)$.", "45°.", {
            unit: "°",
            asks: "angle",
            picture: sides({ opp: "5 cm", adj: "5 cm" }, 45),
            expect: [
              "Leo works out $\\tan(1)$, not $\\tan^{-1}(1)$. Right?",
              "No",
              "To find an angle, use the inverse.",
              [["Yes", "tan turns an angle into a ratio."]],
            ],
          }),
          ask("Find θ.", "26.6", "$\\tan^{-1}(0.5)$.", "26.6°.", {
            unit: "°",
            asks: "angle",
            changed: "A longer adjacent.",
            picture: sides({ opp: "5 cm", adj: "10 cm" }, 27),
          }),
          ask("Find θ.", "68.2", "$\\tan^{-1}(2.5)$.", "68.2°.", {
            unit: "°",
            asks: "angle",
            changed: "A shorter adjacent.",
            picture: sides({ opp: "5 cm", adj: "2 cm" }, 68),
          }),
          ask("Find θ.", "30", "$\\sin^{-1}(0.5)$.", "30°.", {
            unit: "°",
            asks: "angle",
            changed: "The hypotenuse instead.",
            picture: sides({ opp: "5 cm", hyp: "10 cm" }, 30),
          }),
        ],
        "The longer the opposite compared with the adjacent, the bigger θ.",
      ),
      own(T9, ANGLES, "Spot the mistake"),

      quiz([
        [
          [
            "Find θ.",
            "30°",
            ["60°", "0.5°"],
            "$\\sin^{-1}(0.5)$.",
            sides({ opp: "1 cm", hyp: "2 cm" }, 30),
          ],
          [
            "Find θ.",
            "60°",
            ["30°", "0.5°"],
            "$\\cos^{-1}(0.5)$.",
            sides({ adj: "3 cm", hyp: "6 cm" }, 60),
          ],
        ],
        [
          [
            "Find θ, to 1 d.p.",
            "60.3°",
            ["29.7°", "1.75°"],
            "$\\tan^{-1}(7 \\div 4)$.",
            sides({ opp: "7 cm", adj: "4 cm" }, 60),
          ],
          [
            "Find θ, to 1 d.p.",
            "33.7°",
            ["56.3°", "0.67°"],
            "$\\tan^{-1}(2 \\div 3)$.",
            sides({ opp: "2 cm", adj: "3 cm" }, 34),
          ],
        ],
        [
          [
            "Which turns a ratio back into an angle?",
            "$\\tan^{-1}$",
            ["$\\tan$", "$\\frac{1}{\\tan}$"],
            "The inverse.",
          ],
          [
            "To find an angle from sin, use",
            "$\\sin^{-1}$",
            ["$\\sin$", "$\\sin^2$"],
            "The inverse.",
          ],
        ],
      ]),

      reworded(
        T9,
        ANGLES,
        "Is the ramp allowed?",
        { tag: "Real life", text: "What angle does it make, to 1 d.p.?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Know two sides? Use the inverse to find the angle.**"],
        INVERSE,
        [
          "**Know two sides? Use the inverse to find the angle.**",
          "Pick sin, cos or tan from the two sides.",
          "$\\tan^{-1}$, not $\\tan$: shift, then the button.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

export const y9TrigonometryStepped: [string, UnitLesson[]][] = [
  [LONG, [longestSide]],
  [SHORT, [shorterSide]],
  [COS, [cosine]],
  [TAN, [tangent]],
  [ANGLES, [angles]],
];
