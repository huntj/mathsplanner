// Year 7, "Lines, angles and shapes", on the stepped template (docs/proposals/lesson-stepped.md):
// the words for lines and angles, symmetry, measuring with a ruler and protractor, and scale
// drawings. Questions are asked on their diagrams; those that are words by nature say why.
import {
  ask,
  calc,
  explain,
  methodCard,
  questionSet,
  quiz,
  summary,
  typed,
  worked,
} from "./build.ts";
import { regular, through } from "./geometry.ts";
import { find, own, owned, reworded, stepped, words } from "./stepped.ts";
import type { Picture, Screen, ShapePic, UnitLesson } from "./types.ts";
import { fan, triangle } from "./y7-angles.ts";
import { y7Lines } from "./y7-lines.ts";

const FACT = "A fact said in words: there is nothing to measure.";
const list = y7Lines;

/** A question with no picture is a fact in words: say so. */
const worded = (screens: Screen[], why = FACT): Screen[] =>
  screens.map((s) =>
    [
      "answer",
      "choice",
      "calc",
      "set",
      "steps",
      "fill",
      "sort",
      "mistake",
      "quiz",
      "order",
    ].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture)
      ? { ...s, wordsOnly: why }
      : s,
  );

/** One angle, of `deg` degrees, from the right, labelled. */
const angle = (deg: number, label = `${deg}°`): Picture => fan([0, deg], [label, null], "?");

const abcd: ShapePic = {
  kind: "shape",
  points: [
    { x: 0, y: 3 },
    { x: 5, y: 3 },
    { x: 5, y: 0 },
    { x: 0, y: 0 },
  ],
  names: ["A", "B", "C", "D"],
  square: [0, 1, 2, 3],
};
const polygon = (n: number, mirrors?: number[]): ShapePic => ({
  kind: "shape",
  points: regular(n, 3, 90),
  ...(mirrors ? { mirrors: mirrors.map((d) => through(d, 3.4)) } : {}),
});
const rectangle = (mirrors = false): ShapePic => ({
  kind: "shape",
  points: [
    { x: -2.5, y: 1.5 },
    { x: 2.5, y: 1.5 },
    { x: 2.5, y: -1.5 },
    { x: -2.5, y: -1.5 },
  ],
  square: [0, 1, 2, 3],
  ...(mirrors ? { mirrors: [through(0, 3.2), through(90, 2.2)] } : {}),
});
const parallelogram: ShapePic = {
  kind: "shape",
  points: [
    { x: -3, y: -1.5 },
    { x: 1.5, y: -1.5 },
    { x: 3, y: 1.5 },
    { x: -1.5, y: 1.5 },
  ],
};
const ruler = (from: number, to: number): Picture => ({ kind: "ruler", from, to });

// ---------------------------------------------------------------------------------------------
// The words for lines and angles.

const WORDS = "y7-lines/words";
const wordsMethod = [
  "Compare with a right angle: smaller is acute.",
  "Bigger, up to a straight line: obtuse.",
  "Past a straight line: reflex.",
  "In ∠ABC, the middle letter is the corner.",
];

const lineWords = stepped(find(list, WORDS), {
  method: wordsMethod,
  variation: {
    relationship: "an angle's size and its name",
    unknowns: ["acute", "obtuse", "reflex"],
    surface: ["near a right angle", "near a straight line", "letters", "plans"],
  },
  screens: worded([
    explain(
      "The rule",
      "Talking about lines and angles",
      ["**Acute is under 90°. Obtuse is up to 180°. Reflex is more.**"],
      angle(130),
      "Compare with a right angle first.",
    ),
    explain(
      "The rule",
      "Names with letters",
      ["∠ABC is the angle at B: the middle letter."],
      abcd,
      "Parallel lines never meet. Perpendicular lines meet at a right angle.",
    ),
    reworded(list, WORDS, "Acute, obtuse or reflex?", { tag: "The rule" }),

    ...owned(list, WORDS, "Warm-up", "Check you remember"),
    words(
      typed(
        "Check you remember",
        "Which is bigger: 100° or 90°?",
        "100",
        "Compare the numbers.",
        "100°.",
        { unit: "°" },
      ),
      FACT,
    ),

    methodCard("The method", wordsMethod, abcd),
    worked(
      "Watch the method",
      "In rectangle ABCD, describe AB and DC, AB and BC, and ∠BCD.",
      [
        { line: "AB and DC are parallel.", note: "Opposite sides of a rectangle never meet." },
        { line: "AB and BC are perpendicular." },
        { line: "∠BCD is the right angle at C.", note: "The middle letter is the corner." },
      ],
      "Parallel, perpendicular, and the right angle at C.",
      abcd,
    ),
    calc(
      "Your turn",
      "Which corner is each angle at?",
      abcd,
      [
        ["∠ABC is at", "B", "The middle letter."],
        ["∠BCD is at", "C", "The middle letter."],
      ],
      "B and C: the middle letter is the corner.",
    ),

    words(
      calc(
        "Practise",
        "Name each angle by its size.",
        undefined,
        [
          ["30° is", "acute", "Less than a right angle."],
          ["100° is", "obtuse", "Between 90° and 180°."],
          ["190° is", "reflex", "More than a straight line."],
        ],
        "Acute, obtuse, reflex.",
      ),
      "The angles are given as numbers to name.",
    ),
    ...owned(list, WORDS, "Together", "Practise"),
    ...owned(list, WORDS, "Your turn", "Practise"),
    questionSet(
      "Practise",
      "What kind of angle is this?",
      [
        ask("What kind of angle is this?", "acute", "Smaller than a right angle.", "Acute.", {
          asks: "acute",
          others: ["obtuse", "reflex"],
          picture: angle(40),
        }),
        ask(
          "What kind of angle is this?",
          "obtuse",
          "Bigger than a right angle, not a straight line.",
          "Obtuse.",
          {
            asks: "obtuse",
            changed: "A wider angle.",
            others: ["acute", "reflex"],
            picture: angle(130),
          },
        ),
        ask("What kind of angle is this?", "reflex", "Past a straight line.", "Reflex.", {
          asks: "reflex",
          changed: "Past a straight line.",
          others: ["obtuse", "acute"],
          picture: angle(250),
        }),
      ],
      "Compare with a right angle and a straight line.",
    ),

    questionSet(
      "Variation",
      "What kind of angle is this? Watch what changes.",
      [
        ask("What kind of angle is this?", "reflex", "Past 180°.", "Reflex.", {
          asks: "reflex",
          others: ["obtuse", "acute"],
          picture: angle(190),
          expect: [
            "Isla calls 190° obtuse. Is she right?",
            "No: reflex",
            "Obtuse stops at 180°. Past a straight line is reflex.",
            [["Yes", "Obtuse is less than 180°."]],
          ],
        }),
        ask("What kind of angle is this?", "acute", "Just under 90°.", "Acute.", {
          asks: "acute",
          changed: "Just under a right angle.",
          others: ["obtuse", "reflex"],
          picture: angle(85),
        }),
        ask("What kind of angle is this?", "obtuse", "Just over 90°.", "Obtuse.", {
          asks: "obtuse",
          changed: "Just over a right angle.",
          others: ["acute", "reflex"],
          picture: angle(95),
        }),
        ask("What kind of angle is this?", "obtuse", "Just under 180°.", "Obtuse.", {
          asks: "obtuse",
          changed: "Nearly a straight line.",
          others: ["reflex", "acute"],
          picture: angle(170),
        }),
      ],
      "90° and 180° are the borders between the names.",
    ),
    own(list, WORDS, "Spot the mistake"),

    own(list, WORDS, "Exit check"),

    reworded(list, WORDS, "Reading a plan", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Acute is under 90°. Obtuse is up to 180°. Reflex is more.**"],
      abcd,
      [
        "**Acute is under 90°. Obtuse is up to 180°. Reflex is more.**",
        "∠ABC is the angle at B: the middle letter.",
        "Parallel: never meet. Perpendicular: meet at 90°.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Symmetry.

const SYMMETRY = "y7-lines/symmetry";
const symmetryMethod = [
  "Lines of symmetry: count the folds where the halves match.",
  "Order of rotational symmetry: count the fits in one turn.",
  "Every shape fits once: the smallest order is 1.",
];

const symmetry = stepped(find(list, SYMMETRY), {
  method: symmetryMethod,
  variation: {
    relationship: "a shape and its lines and order of symmetry",
    unknowns: ["lines", "order"],
    surface: ["regular shapes", "rectangles", "parallelograms", "isosceles triangles", "logos"],
  },
  screens: worded([
    reworded(list, SYMMETRY, "Mirror lines", { tag: "The rule" }),
    reworded(list, SYMMETRY, "Rotational symmetry", {
      tag: "The rule",
      text: "How often does it fit in one turn?",
    }),

    ...owned(list, SYMMETRY, "Warm-up", "Check you remember"),
    typed("Check you remember", "How many sides does this shape have?", "5", "Count them.", "5.", {
      picture: polygon(5),
    }),

    methodCard("The method", symmetryMethod, polygon(4, [0, 90, 45, 135])),
    worked(
      "Watch the method",
      "Find the lines of symmetry and the rotational order of a square.",
      [
        { line: "Lines of symmetry: 4", note: "Two across the middle, two corner to corner." },
        { line: "Order of rotational symmetry: 4", note: "It fits every quarter turn." },
      ],
      "4 and 4.",
      polygon(4, [0, 90, 45, 135]),
    ),
    calc(
      "Your turn",
      "Find both for this regular pentagon.",
      polygon(5),
      [
        ["Lines of symmetry:", "5", "One through each corner."],
        ["Order of rotational symmetry:", "5", "It fits every fifth of a turn."],
      ],
      "5 and 5.",
    ),

    calc(
      "Practise",
      "Find both for this rectangle.",
      rectangle(),
      [
        ["Lines of symmetry:", "2", "Across the middle, both ways. Not the diagonals."],
        ["Order of rotational symmetry:", "2", "It fits every half turn."],
      ],
      "2 and 2.",
    ),
    ...owned(list, SYMMETRY, "Together", "Practise").filter((s) => !s.title.includes("pentagon")),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("How many lines of symmetry?", "3", "One through each corner.", "3.", {
          asks: "lines",
          picture: polygon(3),
        }),
        ask(
          "What is its order of rotational symmetry?",
          "3",
          "It fits every third of a turn.",
          "3.",
          {
            asks: "order",
            changed: "Now the rotational order.",
            picture: polygon(3),
          },
        ),
        ask("How many lines of symmetry?", "1", "Only straight down the middle.", "1.", {
          asks: "lines",
          changed: "An isosceles triangle.",
          picture: triangle(65, 65, [null, null, null]),
        }),
        ask(
          "What is its order of rotational symmetry?",
          "8",
          "It fits every eighth of a turn.",
          "8.",
          {
            asks: "order",
            changed: "Eight sides.",
            picture: polygon(8),
          },
        ),
      ],
      "Count the folds; count the fits in a turn.",
    ),

    questionSet(
      "Variation",
      "How many lines of symmetry? Watch what changes.",
      [
        ask("How many lines of symmetry?", "2", "Across the middle, both ways.", "2.", {
          asks: "lines",
          picture: rectangle(),
          expect: [
            "Ali says a rectangle has 4, like a square. Right?",
            "No: 2",
            "Fold a rectangle on its diagonal: the halves don't match.",
            [["Yes", "Try folding on the diagonal."]],
          ],
        }),
        ask("How many lines of symmetry?", "4", "Across and corner to corner.", "4.", {
          asks: "lines",
          changed: "Now a square.",
          picture: polygon(4),
        }),
        ask("How many lines of symmetry?", "0", "No fold matches.", "0.", {
          asks: "lines",
          changed: "A parallelogram.",
          picture: parallelogram,
        }),
        ask("How many lines of symmetry?", "6", "Through corners and through sides.", "6.", {
          asks: "lines",
          changed: "A regular hexagon.",
          picture: polygon(6),
        }),
      ],
      "A regular shape has as many lines as sides. Others have fewer.",
    ),
    {
      ...own(list, SYMMETRY, "Spot the mistake"),
      text: "Eva describes a shape like the letter F.",
    } as Screen,

    own(list, SYMMETRY, "Exit check"),

    reworded(list, SYMMETRY, "Designing a logo", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**A line of symmetry folds a shape onto itself.**"],
      polygon(4, [0, 90, 45, 135]),
      [
        "**A line of symmetry folds a shape onto itself.**",
        "Rotational order: how many times it fits in one turn.",
        "Square: 4 lines, order 4. Rectangle: 2 lines, order 2.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Measuring.

const MEASURING = "y7-lines/measuring";
const measuringMethod = [
  "Estimate: compare with a right angle, or a length you know.",
  "Line up 0 with the start, or with one arm.",
  "Read the scale that starts at 0. Check your estimate.",
];

const measuring = stepped(find(list, MEASURING), {
  method: measuringMethod,
  variation: {
    relationship: "a line or an angle and its measurement",
    unknowns: ["length", "angle"],
    surface: ["acute", "obtuse", "reflex", "clocks", "rulers not starting at 0"],
  },
  screens: worded([
    explain(
      "The rule",
      "Measuring",
      ["**Estimate first, then measure from 0.**"],
      ruler(1, 7.4),
      "A line that starts at 1 cm: take 1 from where it ends.",
    ),
    explain(
      "The rule",
      "Using a protractor",
      ["Centre on the corner, 0 on one arm.", "Count round from that 0 to the other arm."],
      angle(72),
      "A protractor has two scales: use the one that starts at 0 on your arm.",
    ),
    reworded(list, MEASURING, "Estimate: make about 135°", { tag: "The rule" }),

    ...owned(list, MEASURING, "Warm-up", "Check you remember"),
    words(
      typed(
        "Check you remember",
        "How many degrees in a right angle?",
        "90",
        "A quarter turn.",
        "90°.",
        { unit: "°" },
      ),
      FACT,
    ),

    methodCard("The method", measuringMethod, angle(72)),
    worked(
      "Watch the method",
      "Measure the angle.",
      [
        { line: "Estimate: acute, about 70°", note: "Smaller than a right angle." },
        { line: "Centre on the corner; 0 on the bottom arm." },
        { line: "Read 72° on the scale from that 0." },
      ],
      "72°: close to the estimate.",
      angle(72, "?"),
    ),
    calc(
      "Your turn",
      "How long is the line?",
      ruler(2, 6.5),
      [
        ["It ends at", "6.5", "Read where the line stops.", { after: "cm" }],
        ["It starts at", "2", "Read where the line starts.", { after: "cm" }],
        ["Its length:", "4.5", "End take away start.", { after: "cm" }],
      ],
      "4.5 cm.",
    ),

    calc(
      "Practise",
      "How long is the line?",
      ruler(1, 5.3),
      [
        ["It starts at", "1", "Read where the line starts.", { after: "cm" }],
        ["Its length:", "4.3", "End take away start.", { after: "cm" }],
      ],
      "4.3 cm.",
    ),
    ...owned(list, MEASURING, "Together", "Practise"),
    ...owned(list, MEASURING, "Your turn", "Practise").filter((s) => s.kind === "dial"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("How long is the line?", "3.5", "End take away start.", "3.5 cm.", {
          unit: "cm",
          asks: "length",
          picture: ruler(0, 3.5),
        }),
        ask("How long is the line?", "3.5", "End take away start.", "3.5 cm.", {
          unit: "cm",
          asks: "length",
          changed: "It doesn't start at 0.",
          picture: ruler(2, 5.5),
        }),
        ask("Which reading fits this angle?", "105°", "A bit more than a right angle.", "105°.", {
          asks: "angle",
          changed: "Now an angle.",
          others: ["75°", "15°"],
          picture: angle(105, "?"),
        }),
        ask(
          "Which reading fits this angle?",
          "40°",
          "Less than half a right angle? No: a bit less.",
          "40°.",
          {
            asks: "angle",
            changed: "A narrow angle.",
            others: ["140°", "4°"],
            picture: angle(40, "?"),
          },
        ),
      ],
      "Estimate, then read from 0.",
    ),

    questionSet(
      "Variation",
      "Which reading fits? Watch what changes.",
      [
        ask("Which reading fits this angle?", "40°", "It's acute.", "40°.", {
          asks: "angle",
          others: ["140°", "400°"],
          picture: angle(40, "?"),
          expect: [
            "Zoe reads 140° for an acute angle. What happened?",
            "She read the wrong scale",
            "Acute is under 90°: 140° is on the other scale.",
            [["Nothing", "No acute angle is 140°."]],
          ],
        }),
        ask("Which reading fits this angle?", "140°", "It's obtuse.", "140°.", {
          asks: "angle",
          changed: "Now obtuse.",
          others: ["40°", "220°"],
          picture: angle(140, "?"),
        }),
        ask("Which reading fits this angle?", "220°", "Past a straight line.", "220°.", {
          asks: "angle",
          changed: "Now reflex.",
          others: ["140°", "40°"],
          picture: angle(220, "?"),
        }),
        ask("How long is the line?", "6.8", "End take away start.", "6.8 cm.", {
          unit: "cm",
          asks: "length",
          changed: "A line on a ruler again.",
          picture: ruler(1.5, 8.3),
        }),
      ],
      "An estimate catches the wrong scale.",
    ),
    {
      ...own(list, MEASURING, "Spot the mistake"),
      text: "Kai measures a line from 3 cm to 8.5 cm.",
    } as Screen,

    quiz([
      [
        [
          "How long is the line?",
          "4.3 cm",
          ["5.3 cm", "6.3 cm"],
          "End take away start.",
          ruler(1, 5.3),
          "length",
        ],
        [
          "How long is the line?",
          "3.2 cm",
          ["5.2 cm", "2.2 cm"],
          "End take away start.",
          ruler(2, 5.2),
          "length",
        ],
      ],
      [
        [
          "Which reading fits this angle?",
          "105°",
          ["75°", "15°"],
          "A bit more than a right angle.",
          angle(105, "?"),
          "angle",
        ],
        [
          "Which reading fits this angle?",
          "65°",
          ["115°", "165°"],
          "Less than a right angle.",
          angle(65, "?"),
          "angle",
        ],
      ],
      [
        [
          "Which reading fits this angle?",
          "250°",
          ["110°", "70°"],
          "Past a straight line.",
          angle(250, "?"),
          "angle",
        ],
        [
          "Which reading fits this angle?",
          "200°",
          ["160°", "20°"],
          "Past a straight line.",
          angle(200, "?"),
          "angle",
        ],
      ],
    ]),

    reworded(list, MEASURING, "Clock hands", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Estimate first, then measure from 0.**"],
      angle(72),
      [
        "**Estimate first, then measure from 0.**",
        "Ruler: end take away start.",
        "Protractor: centre on the corner, 0 on one arm, read from that 0.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Scale drawings.

const SCALE = "y7-lines/scale";
const scaleMethod = [
  "Read the scale: what 1 cm stands for.",
  "Map to real: multiply.",
  "Real to map: divide.",
  "Keep the units.",
];
const SCALE_WORDS = "A scale problem: the numbers on the map are the picture.";

const scale = stepped(find(list, SCALE), {
  method: scaleMethod,
  variation: {
    relationship: "a length on a map or plan and the real length",
    unknowns: ["real", "map"],
    surface: ["km", "m", "cm", "a scale as a ratio", "walks"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Scale drawings",
        ["**Map to real: multiply by the scale. Real to map: divide.**"],
        ruler(0, 3),
        "1 cm to 2 km: 3 cm on the map is 6 km.",
      ),

      ...owned(list, SCALE, "Warm-up", "Check you remember"),
      typed(
        "Check you remember",
        "How many cm in 1 m?",
        "100",
        "Centi means a hundredth.",
        "100 cm.",
        { unit: "cm" },
      ),

      methodCard("The method", scaleMethod, ruler(0, 4.5)),
      worked(
        "Watch the method",
        "Scale 1 cm to 4 m. A garden is 18 m long. How long is it drawn?",
        [
          { line: "Real to map: divide.", note: "Every 4 m is 1 cm." },
          { line: "$18 \\div 4 = 4.5$ cm" },
        ],
        "4.5 cm.",
        ruler(0, 4.5),
      ),
      calc(
        "Your turn",
        "Scale 1 cm to 10 km. How far is 6.5 cm?",
        ruler(0, 6.5),
        [["Map to real: $6.5 \\times 10 =$", "65", "Each cm is 10 km.", { after: "km" }]],
        "65 km.",
      ),

      calc(
        "Practise",
        "Scale 1 cm to 2 m. Draw a 15 m fence.",
        undefined,
        [["Real to map: $15 \\div 2 =$", "7.5", "Each 2 m is 1 cm.", { after: "cm" }]],
        "7.5 cm.",
      ),
      ...owned(list, SCALE, "Together", "Practise").map((sc) =>
        sc.title === "A plan of a room"
          ? ({ ...sc, start: "1 cm to 50 cm. It is 8 cm on the plan." } as Screen)
          : sc,
      ),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("1 cm to 3 km. 5 cm on the map is?", "15", "Map to real: multiply.", "15 km.", {
            unit: "km",
            asks: "real",
          }),
          ask("1 cm to 5 m. A 30 m wall is drawn?", "6", "Real to map: divide.", "6 cm.", {
            unit: "cm",
            asks: "map",
            changed: "Now real to map.",
          }),
          ask("1 cm to 50 cm. 8 cm is how many metres?", "4", "8 × 50 = 400 cm.", "4 m.", {
            unit: "m",
            asks: "real",
            changed: "Change the units at the end.",
          }),
          ask("1 cm to 4 m. 18 m is drawn?", "4.5", "Real to map: divide.", "4.5 cm.", {
            unit: "cm",
            asks: "map",
            changed: "An answer with a half.",
          }),
        ],
        "Map to real, multiply; real to map, divide.",
      ),

      questionSet(
        "Variation",
        "Find each one. Watch what changes.",
        [
          ask("1 cm to 5 km. Draw 20 km.", "4", "Real to map: divide.", "4 cm.", {
            unit: "cm",
            asks: "map",
            expect: [
              "Max draws it 100 cm long. What's wrong?",
              "He multiplied",
              "Real to map divides: 20 ÷ 5 = 4 cm.",
              [["Nothing", "100 cm wouldn't fit on a map."]],
            ],
          }),
          ask("1 cm to 5 km. 20 cm on the map is?", "100", "Map to real: multiply.", "100 km.", {
            unit: "km",
            asks: "real",
            changed: "Now map to real.",
          }),
          ask("1 cm to 500 m. 3 cm is how many km?", "1.5", "1500 m.", "1.5 km.", {
            unit: "km",
            asks: "real",
            changed: "Metres, then kilometres.",
          }),
          ask("A plan is 1 : 100. 4 cm is how many metres?", "4", "400 cm.", "4 m.", {
            unit: "m",
            asks: "real",
            changed: "The scale as a ratio.",
          }),
        ],
        "Which way you go decides multiply or divide.",
      ),
      {
        ...own(list, SCALE, "Spot the mistake"),
        text: "1 cm to 25 m. Ana measures 3 cm.",
      } as Screen,

      quiz([
        [
          [
            "1 cm to 3 km. 5 cm is how many km?",
            "15",
            ["8", "1.7"],
            "Map to real: multiply.",
            undefined,
            "real",
          ],
          [
            "1 cm to 4 km. 3 cm is how many km?",
            "12",
            ["7", "0.75"],
            "Map to real: multiply.",
            undefined,
            "real",
          ],
        ],
        [
          [
            "1 cm to 5 m. Draw a 30 m wall: how long?",
            "6 cm",
            ["150 cm", "35 cm"],
            "Real to map: divide.",
            undefined,
            "map",
          ],
          [
            "1 cm to 2 m. Draw a 9 m wall: how long?",
            "4.5 cm",
            ["18 cm", "11 cm"],
            "Real to map: divide.",
            undefined,
            "map",
          ],
        ],
        [
          [
            "Real life to the map: you",
            "divide by the scale",
            ["multiply by the scale", "add the scale"],
            "The map is smaller: divide.",
            undefined,
            "map",
          ],
          [
            "The map to real life: you",
            "multiply by the scale",
            ["divide by the scale", "take away the scale"],
            "Real life is bigger: multiply.",
            undefined,
            "real",
          ],
        ],
      ]),

      reworded(list, SCALE, "How far is the walk?", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Map to real: multiply by the scale. Real to map: divide.**"],
        ruler(0, 3),
        [
          "**Map to real: multiply by the scale. Real to map: divide.**",
          "1 cm to 2 km: 3 cm is 6 km; 10 km is 5 cm.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    SCALE_WORDS,
  ),
});

export const y7LinesStepped: [string, UnitLesson[]][] = [
  [WORDS, [lineWords]],
  [SYMMETRY, [symmetry]],
  [MEASURING, [measuring]],
  [SCALE, [scale]],
];
