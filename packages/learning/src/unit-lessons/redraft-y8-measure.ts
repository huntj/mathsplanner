// Year 8, "Circles and area" (the circumference and shapes in pieces) and "Percentages" on the
// stepped template (docs/proposals/lesson-stepped.md). Every circle and composite-shape question
// is asked on its drawing; the percentages are number work, with bar models where they help.
import {
  ask,
  calc,
  explain,
  explore,
  methodCard,
  questionSet,
  quiz,
  summary,
  typed,
  worked,
} from "./build.ts";
import {
  find,
  own,
  owned,
  reworded,
  stepped,
  tagged,
  words,
  worded,
  workedFrom,
} from "./stepped.ts";
import type { DrawingPic, Picture, Point, ShapePic, UnitLesson } from "./types.ts";
import { measured, y8Area } from "./y8-area.ts";
import { y8Percentages } from "./y8-percentages.ts";

type DrawItem = DrawingPic["items"][number];
const NUMBER = "A number check: the sum the method needs.";
const PERCENT = "Percentages of amounts: the numbers are the picture.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });
const ring = (c: Point, r: number): DrawItem[] => [
  { arc: c, r, from: 0, to: 180 },
  { arc: c, r, from: 180, to: 360 },
];

/** A circle with its circumference written below, and its diameter or radius marked to find. */
const withC = (c: string, across: "d" | "r", label = "?"): Picture => {
  const pic = measured(across, label);
  return pic.kind === "drawing"
    ? { ...pic, items: [...pic.items, { text: `C = ${c}`, at: { x: 0, y: -1.3 } }] }
    : pic;
};

/** Half a circle, its diameter along the bottom, labelled. */
const half = (label: string): DrawingPic => ({
  kind: "drawing",
  items: [
    { arc: { x: 0, y: 0 }, r: 3, from: 0, to: 180 },
    {
      line: [
        { x: -3, y: 0 },
        { x: 3, y: 0 },
      ],
      tone: "find",
    },
    { text: label, at: { x: 0, y: -0.6 }, tone: "find" },
  ],
});

/** A shape from its corners, sides labelled in order from the first corner. */
const poly = (
  points: [number, number][],
  sides: (string | null)[],
  dashed?: [[number, number], [number, number]][],
): ShapePic => ({
  kind: "shape",
  points: points.map(([x, y]) => ({ x, y })),
  sides,
  ...(dashed
    ? {
        dashed: dashed.map(([[a, b], [c, d]]): [Point, Point] => [
          { x: a, y: b },
          { x: c, y: d },
        ]),
      }
    : {}),
});

/** A w by h rectangle with a semicircle on its right-hand end. */
const roundEnd = (w: number, h: number, across: string, up: string): DrawingPic => ({
  kind: "drawing",
  items: [
    {
      line: [
        { x: 0, y: 0 },
        { x: w, y: 0 },
      ],
    },
    {
      line: [
        { x: 0, y: h },
        { x: w, y: h },
      ],
    },
    {
      line: [
        { x: 0, y: 0 },
        { x: 0, y: h },
      ],
    },
    {
      line: [
        { x: w, y: 0 },
        { x: w, y: h },
      ],
      dashed: true,
      tone: "soft",
    },
    { arc: { x: w, y: h / 2 }, r: h / 2, from: -90, to: 90 },
    { text: across, at: { x: w / 2, y: -0.7 } },
    { text: up, at: { x: -1, y: h / 2 } },
  ],
});

/** A w by h rectangle with a round hole of radius r in the middle, the radius labelled. */
const withHole = (
  w: number,
  h: number,
  r: number,
  labels: [string, string, string],
): DrawingPic => {
  const [a, b, c, d] = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
    { x: 0, y: h },
  ];
  const mid = { x: w / 2, y: h / 2 };
  return {
    kind: "drawing",
    items: [
      { line: [a, b] },
      { line: [b, c] },
      { line: [c, d] },
      { line: [d, a] },
      { side: [a, b], label: labels[0], inside: mid },
      { side: [b, c], label: labels[1], inside: mid },
      ...ring(mid, r),
      { line: [mid, { x: mid.x + r, y: mid.y }] },
      { dot: mid },
      { text: labels[2], at: { x: mid.x + r / 2, y: mid.y + 0.45 } },
    ],
  };
};

// ---------------------------------------------------------------------------------------------
// The circumference.

const AREA = y8Area;
const CIRC = "y8-area/circumference";
const circMethod = [
  "Find the diameter. Given the radius? Double it.",
  "Times by π.",
  "Round as asked, and give the units.",
];

const circumference = stepped(find(AREA, CIRC), {
  method: circMethod,
  variation: {
    relationship: "circumference = π × diameter",
    unknowns: ["circumference", "diameter", "radius"],
    surface: ["diameter given", "radius given", "half a circle", "wheels"],
  },
  screens: [
    explain(
      "The rule",
      "Round the outside",
      ["**The circumference is π times the diameter: C = πd.**"],
      measured("d", "d"),
      "The diameter is twice the radius, so C = 2πr too.",
    ),
    tagged(
      "The rule",
      explore(
        "Grow the circle",
        {
          kind: "geometry",
          circleThrough: "R",
          points: [{ name: "R", from: "O", deg: 0, dist: 2, drag: [1, 4] }],
          lines: ["OR"],
          readouts: [
            { label: "Radius", length: "OR" },
            { label: "Circumference", circumference: "OR" },
          ],
        },
        [
          "Drag the radius from 2 cm to 4 cm. What happens to the circumference?",
          "It doubles",
          "Double the radius and the circumference doubles: it's always π times the diameter.",
          [
            ["It goes up 4 times", "Look again: 12.6 cm becomes 25.1 cm."],
            ["It goes up by 2 cm", "Look again: it grows by much more than 2 cm."],
          ],
        ],
        "The circumference grows in step with the diameter.",
        { text: "Drag R to grow and shrink the circle. Watch the circumference." },
      ),
    ),
    reworded(AREA, CIRC, "Spot the pattern", {
      tag: "The rule",
      text: "What is C ÷ d for the wheel?",
    }),

    typed("Check you remember", "Find the diameter.", "8", "Twice the radius.", "8 cm.", {
      unit: "cm",
      picture: measured("r", "4 cm"),
    }),
    words(
      typed(
        "Check you remember",
        "Round 31.416 to 1 decimal place.",
        "31.4",
        "Look at the second decimal place.",
        "31.4.",
      ),
      NUMBER,
    ),

    methodCard("The method", circMethod, measured("d", "10 cm")),
    worked(
      "Watch the method",
      "Find the circumference, to 1 decimal place.",
      [
        { line: "$C = \\pi \\times 10$", note: "C = πd, and the diameter is 10 cm." },
        { line: "$C = 31.4$ cm", note: "Round to 1 decimal place." },
      ],
      "Diameter times π.",
      measured("d", "10 cm"),
    ),
    calc(
      "Your turn",
      "Find the circumference, to 1 decimal place.",
      measured("d", "12 cm"),
      [["$\\pi \\times 12 =$", "37.7", "Times the diameter by π.", { after: "cm" }]],
      "The circumference is 37.7 cm.",
    ),

    calc(
      "Practise",
      "Find the circumference, to 1 decimal place.",
      measured("r", "4 cm"),
      [
        ["d = $2 \\times 4 =$", "8", "Double the radius.", { after: "cm" }],
        ["$\\pi \\times 8 =$", "25.1", "Times by π, then round.", { after: "cm" }],
      ],
      "The circumference is 25.1 cm.",
    ),
    reworded(AREA, CIRC, "Half a circle's curve", {
      tag: "Practise",
      start: "How long is the curved edge?",
      picture: half("6 cm"),
    }),
    questionSet(
      "Practise",
      "Which part is missing?",
      [
        ask("Find the circumference, to 1 d.p.", "25.1", "π × the diameter.", "25.1 cm.", {
          unit: "cm",
          asks: "circumference",
          picture: measured("d", "8 cm"),
        }),
        ask("Find the circumference, to 1 d.p.", "18.8", "Double the radius first.", "18.8 cm.", {
          unit: "cm",
          asks: "circumference",
          changed: "Now the radius is given.",
          picture: measured("r", "3 cm"),
        }),
        ask("Find the diameter.", "10", "Divide the circumference by π.", "10 cm.", {
          unit: "cm",
          asks: "diameter",
          changed: "Now work backwards: divide by π.",
          picture: withC("31.4 cm", "d"),
        }),
        ask(
          "Find the radius, to the nearest cm.",
          "4",
          "Divide by π, then halve.",
          "4 cm: $25.1 \\div \\pi = 8$, then halve.",
          {
            unit: "cm",
            asks: "radius",
            changed: "Now the radius.",
            picture: withC("25.1 cm", "r"),
          },
        ),
      ],
      "π times the diameter, or divide by π to go back.",
    ),

    questionSet(
      "Variation",
      "Find each one. Watch what changes.",
      [
        ask("Find the circumference, to 1 d.p.", "31.4", "Double the radius first.", "31.4 cm.", {
          unit: "cm",
          asks: "circumference",
          picture: measured("r", "5 cm"),
          expect: [
            "Tom works out $\\pi \\times 5 = 15.7$ cm. Right?",
            "No",
            "C = πd: double the radius first. $\\pi \\times 10 = 31.4$ cm.",
            [["Yes", "5 cm is the radius, not the diameter."]],
          ],
        }),
        ask("Find the curved edge, to 1 d.p.", "15.7", "Half of π × 10.", "15.7 cm.", {
          unit: "cm",
          asks: "circumference",
          changed: "Half a circle.",
          picture: half("10 cm"),
        }),
        ask(
          "Find the whole perimeter, to 1 d.p.",
          "25.7",
          "Curve plus the straight edge.",
          "25.7 cm.",
          {
            unit: "cm",
            asks: "circumference",
            changed: "Add the straight edge.",
            picture: half("10 cm"),
          },
        ),
        ask(
          "Distance in one turn, to the nearest cm?",
          "157",
          "One turn is one circumference.",
          "157 cm.",
          {
            unit: "cm",
            asks: "circumference",
            changed: "A wheel.",
            picture: measured("d", "50 cm"),
          },
        ),
      ],
      "Diameter first, then π. Half a circle: half the curve.",
    ),
    reworded(
      AREA,
      CIRC,
      "Where did it go wrong?",
      { text: "Isla finds the circumference.", picture: measured("d", "8 cm") },
      "Spot the mistake",
    ),

    quiz([
      [
        [
          "Find the circumference, to 1 d.p.",
          "15.7 cm",
          ["7.9 cm", "19.6 cm"],
          "$\\pi \\times 5$.",
          measured("d", "5 cm"),
        ],
        [
          "Find the circumference, to 1 d.p.",
          "9.4 cm",
          ["4.7 cm", "7.1 cm"],
          "$\\pi \\times 3$.",
          measured("d", "3 cm"),
        ],
      ],
      [
        [
          "Find the circumference, to 1 d.p.",
          "62.8 cm",
          ["31.4 cm", "314.2 cm"],
          "Diameter 20: $\\pi \\times 20$.",
          measured("r", "10 cm"),
        ],
        [
          "Find the circumference, to 1 d.p.",
          "12.6 cm",
          ["6.3 cm", "4.0 cm"],
          "Diameter 4: $\\pi \\times 4$.",
          measured("r", "2 cm"),
        ],
      ],
      [
        [
          "For every circle, C ÷ d is",
          "π, about 3.14",
          ["2", "It depends on the size"],
          "The same for every circle.",
          measured("d", "d"),
        ],
        [
          "For a huge circle, C ÷ d is",
          "π, about 3.14",
          ["More than π", "Less than π"],
          "The same for every circle.",
          measured("d", "d"),
        ],
      ],
    ]),

    reworded(
      AREA,
      CIRC,
      "The bike wheel, 60 cm across",
      {
        tag: "Real life",
        title: "The bike wheel",
        text: "How far in one turn? To the nearest cm.",
        picture: measured("d", "60 cm"),
      },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**The circumference is π times the diameter: C = πd.**"],
      measured("d", "d"),
      [
        "**The circumference is π times the diameter: C = πd.**",
        "Given the radius? Double it first: C = 2πr.",
        "Half a circle: half the curve, plus the straight edge.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Shapes in pieces.

const COMPOSITE = "y8-area/composite";
const compositeMethod = [
  "Split the shape into rectangles, triangles or circles.",
  "Find any missing sides.",
  "Find each area, then add. Or take the hole away.",
];
const L_SPLIT = poly(
  [
    [0, 0],
    [8, 0],
    [8, 3],
    [3, 3],
    [3, 7],
    [0, 7],
  ],
  ["8 cm", "3 cm", null, null, "3 cm", "7 cm"],
  [
    [
      [0, 3],
      [3, 3],
    ],
  ],
);
const L7: [number, number][] = [
  [0, 0],
  [7, 0],
  [7, 3],
  [3, 3],
  [3, 6],
  [0, 6],
];
const L9: [number, number][] = [
  [0, 0],
  [9, 0],
  [9, 3],
  [4, 3],
  [4, 6],
  [0, 6],
];

const composite = stepped(find(AREA, COMPOSITE), {
  method: compositeMethod,
  variation: {
    relationship: "a shape's area is the sum of its pieces",
    unknowns: ["area", "missing side", "missing piece", "perimeter"],
    surface: ["L-shapes", "holes", "curved ends", "triangles on top"],
  },
  screens: [
    explain(
      "The rule",
      "Shapes in pieces",
      ["**Split it into shapes you know, then add. Or take a piece away.**"],
      L_SPLIT,
      "The dashed line splits the L into two rectangles.",
    ),
    reworded(AREA, COMPOSITE, "Missing sides", {
      tag: "The rule",
      text: "How long is the short top edge on the right?",
    }),

    typed("Check you remember", "Find the area.", "24", "Length times width.", "24 cm².", {
      unit: "cm²",
      picture: poly(
        [
          [0, 0],
          [8, 0],
          [8, 3],
          [0, 3],
        ],
        ["8 cm", "3 cm", null, null],
      ),
    }),
    words(
      typed(
        "Check you remember",
        "Work out $\\pi \\times 2^2$, to 1 d.p.",
        "12.6",
        "Square 2, then times by π.",
        "12.6.",
      ),
      NUMBER,
    ),

    methodCard("The method", compositeMethod, L_SPLIT),
    workedFrom(AREA, COMPOSITE),
    calc(
      "Your turn",
      "Find the area.",
      poly(
        [
          [0, 0],
          [6, 0],
          [6, 2],
          [2, 2],
          [2, 5],
          [0, 5],
        ],
        ["6 cm", "2 cm", null, "3 cm", "2 cm", null],
        [
          [
            [0, 2],
            [2, 2],
          ],
        ],
      ),
      [
        ["Bottom: $6 \\times 2 =$", "12", "The wide rectangle."],
        ["Top: $2 \\times 3 =$", "6", "The tall piece."],
        ["Total:", "18", "Add the pieces.", { after: "cm²" }],
      ],
      "The area is 18 cm².",
    ),

    calc(
      "Practise",
      "Find the area.",
      poly(
        [
          [0, 0],
          [8, 0],
          [8, 2],
          [4, 2],
          [4, 5],
          [0, 5],
        ],
        ["8 cm", null, "4 cm", "3 cm", null, "5 cm"],
        [
          [
            [4, 5],
            [8, 5],
          ],
          [
            [8, 5],
            [8, 2],
          ],
        ],
      ),
      [
        ["The whole box: $8 \\times 5 =$", "40", "Fill in the missing corner."],
        ["The corner: $4 \\times 3 =$", "12", "The piece that isn't there."],
        ["Take it away:", "28", "$40 - 12$.", { after: "cm²" }],
      ],
      "The area is 28 cm².",
    ),
    reworded(AREA, COMPOSITE, "The L-shape's perimeter", { tag: "Practise" }),
    questionSet(
      "Practise",
      "Which part is missing?",
      [
        ask("Find the area.", "30", "Split it into two rectangles.", "30 cm²: 21 + 9.", {
          unit: "cm²",
          asks: "area",
          picture: poly(L7, ["7 cm", "3 cm", "4 cm", "3 cm", "3 cm", "6 cm"]),
        }),
        ask("Find the missing side.", "4", "7 across the bottom, 3 at the top.", "4 cm.", {
          unit: "cm",
          asks: "missing side",
          changed: "Now a side.",
          picture: poly(L7, ["7 cm", "3 cm", "?", "3 cm", "3 cm", "6 cm"]),
        }),
        ask("Find the perimeter.", "26", "Add all six sides.", "26 cm.", {
          unit: "cm",
          asks: "perimeter",
          changed: "Now the perimeter.",
          picture: poly(L7, ["7 cm", "3 cm", "4 cm", "3 cm", "3 cm", "6 cm"]),
        }),
        ask(
          "Find the area left, to 1 d.p.",
          "44.9",
          "The rectangle take away the circle.",
          "44.9 cm²: 48 − 3.1.",
          {
            unit: "cm²",
            asks: "area",
            changed: "A hole.",
            picture: withHole(8, 6, 1, ["8 cm", "6 cm", "1 cm"]),
          },
        ),
      ],
      "Split, or box it and take away.",
    ),

    questionSet(
      "Variation",
      "Find each one. Watch what changes.",
      [
        ask("Find the area.", "39", "Split it, or take the corner away.", "39 cm²: 27 + 12.", {
          unit: "cm²",
          asks: "area",
          picture: poly(L9, ["9 cm", "3 cm", null, "3 cm", "4 cm", "6 cm"]),
          expect: [
            "Finn works out $9 \\times 6 = 54$ cm². Right?",
            "No",
            "That counts the empty corner too: 54 − 15 = 39 cm².",
            [["Yes", "Look at the top right: it's empty."]],
          ],
        }),
        ask("Find the empty corner's area.", "15", "5 across, 3 up.", "15 cm².", {
          unit: "cm²",
          asks: "missing piece",
          changed: "Now just the missing piece.",
          picture: poly(
            L9,
            ["9 cm", "3 cm", null, "3 cm", "4 cm", "6 cm"],
            [
              [
                [4, 6],
                [9, 6],
              ],
              [
                [9, 6],
                [9, 3],
              ],
            ],
          ),
        }),
        ask(
          "Find the area, to 1 d.p.",
          "30.3",
          "Rectangle plus half a circle.",
          "30.3 cm²: 24 + 6.3.",
          {
            unit: "cm²",
            asks: "area",
            changed: "A curved end.",
            picture: roundEnd(6, 4, "6 cm", "4 cm"),
          },
        ),
        ask("Find the area.", "33", "Rectangle plus triangle.", "33 cm²: 24 + 9.", {
          unit: "cm²",
          asks: "area",
          changed: "A triangle on top.",
          picture: poly(
            [
              [0, 0],
              [6, 0],
              [6, 4],
              [3, 7],
              [0, 4],
            ],
            ["6 cm", "4 cm", null, null, null],
            [
              [
                [0, 4],
                [6, 4],
              ],
              [
                [3, 7],
                [3, 4],
              ],
            ],
          ),
        }),
      ],
      "Split it or box it: never count an empty corner.",
    ),
    reworded(
      AREA,
      COMPOSITE,
      "Where did it go wrong?",
      { text: "Gus finds the perimeter.", picture: roundEnd(10, 4, "10 m", "4 m") },
      "Spot the mistake",
    ),

    quiz([
      [
        [
          "Find the total area.",
          "28 cm²",
          ["24 cm²", "32 cm²"],
          "$24 + 4$.",
          poly(
            [
              [0, 0],
              [6, 0],
              [6, 4],
              [4, 4],
              [4, 6],
              [2, 6],
              [2, 4],
              [0, 4],
            ],
            ["6 cm", "4 cm", null, "2 cm", "2 cm", null, null, null],
          ),
        ],
        [
          "Find the total area.",
          "24 cm²",
          ["20 cm²", "28 cm²"],
          "$20 + 4$.",
          poly(
            [
              [0, 0],
              [5, 0],
              [5, 4],
              [4, 4],
              [4, 6],
              [2, 6],
              [2, 4],
              [0, 4],
            ],
            ["5 cm", "4 cm", null, "2 cm", "2 cm", null, null, null],
          ),
        ],
      ],
      [
        [
          "Find the area left.",
          "91 cm²",
          ["100 cm²", "94 cm²"],
          "$100 - 9$.",
          poly(
            [
              [0, 0],
              [10, 0],
              [10, 7],
              [7, 7],
              [7, 10],
              [0, 10],
            ],
            ["10 cm", null, "3 cm", "3 cm", null, "10 cm"],
          ),
        ],
        [
          "Find the area left.",
          "60 cm²",
          ["64 cm²", "62 cm²"],
          "$64 - 4$.",
          poly(
            [
              [0, 0],
              [8, 0],
              [8, 6],
              [6, 6],
              [6, 8],
              [0, 8],
            ],
            ["8 cm", null, "2 cm", "2 cm", null, "8 cm"],
          ),
        ],
      ],
      [
        [
          "Find the area.",
          "46 cm²",
          ["54 cm²", "38 cm²"],
          "$54 - 8$.",
          poly(
            [
              [0, 0],
              [9, 0],
              [9, 4],
              [5, 4],
              [5, 6],
              [0, 6],
            ],
            ["9 cm", "4 cm", "4 cm", "2 cm", "5 cm", "6 cm"],
          ),
        ],
        [
          "Find the area.",
          "29 cm²",
          ["35 cm²", "23 cm²"],
          "$35 - 6$.",
          poly(
            [
              [0, 0],
              [7, 0],
              [7, 3],
              [4, 3],
              [4, 5],
              [0, 5],
            ],
            ["7 cm", "3 cm", "3 cm", "2 cm", "4 cm", "5 cm"],
          ),
        ],
      ],
    ]),

    reworded(
      AREA,
      COMPOSITE,
      "The lawn",
      { tag: "Real life", text: "Find its area, to 1 decimal place." },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Split it into shapes you know, then add. Or take a piece away.**"],
      L_SPLIT,
      [
        "**Split it into shapes you know, then add. Or take a piece away.**",
        "Find missing sides first: 8 − 3 = 5.",
        "A semicircle is half a circle: half its area.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// One amount as a percentage of another.

const PC = y8Percentages;
const OF = "y8-percentages/of-another";
const ofMethod = [
  "Write it as a fraction: the part over the whole.",
  "Divide to get a decimal.",
  "Times by 100 for the percentage.",
];

const ofAnother = stepped(find(PC, OF), {
  method: ofMethod,
  variation: {
    relationship: "a part as a percentage of a whole",
    unknowns: ["percentage", "which is better"],
    surface: ["scores", "money", "mixed units", "more than the whole"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Out of a hundred",
        ["**Divide the part by the whole, then times by 100.**"],
        { kind: "bars", rows: [{ label: "Score", parts: 4, shaded: 3, each: "6" }], total: "24" },
        "18 out of 24 is 0.75: that's 75%.",
      ),
      reworded(PC, OF, "9 out of 10 or 17 out of 20?", { tag: "The rule" }),

      ...owned(PC, OF, "Warm-up", "Check you remember"),

      methodCard("The method", ofMethod, maths("\\frac{18}{24} = 0.75 = 75\\%")),
      workedFrom(PC, OF),
      calc(
        "Your turn",
        "What percentage is 36 out of 48?",
        undefined,
        [
          ["$36 \\div 48 =$", "0.75", "Part over whole."],
          ["$0.75 \\times 100 =$", "75", "Times by 100.", { after: "%" }],
        ],
        "75%.",
      ),

      calc(
        "Practise",
        "What percentage of 2 kg is 400 g?",
        undefined,
        [
          ["2 kg in grams:", "2000", "Same units first."],
          ["$400 \\div 2000 =$", "0.2", "Part over whole."],
          ["As a percentage:", "20", "Times by 100.", { after: "%" }],
        ],
        "20%.",
      ),
      ...owned(PC, OF, "Together", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("What percentage is 14 out of 20?", "70", "14 ÷ 20.", "70%.", {
            unit: "%",
            asks: "percentage",
          }),
          ask("What percentage of £40 is £6?", "15", "6 ÷ 40.", "15%.", {
            unit: "%",
            asks: "percentage",
            changed: "Money.",
          }),
          ask("What percentage of 1 m is 35 cm?", "35", "1 m is 100 cm.", "35%.", {
            unit: "%",
            asks: "percentage",
            changed: "Mixed units.",
          }),
          ask(
            "Which score is better?",
            "33 out of 40",
            "82.5% beats 80%.",
            "33 out of 40: 82.5%.",
            {
              asks: "which is better",
              changed: "Compare two.",
              others: ["24 out of 30"],
            },
          ),
        ],
        "Part over whole, times 100.",
      ),

      questionSet(
        "Variation",
        "Find each one. Watch what changes.",
        [
          ask("What percentage is 9 out of 12?", "75", "9 ÷ 12.", "75%.", {
            unit: "%",
            asks: "percentage",
            expect: [
              "Ben says 9 out of 12 is 9%. Right?",
              "No",
              "9% means 9 out of 100. $9 \\div 12 = 0.75$: 75%.",
              [["Yes", "Divide by 12, not 100."]],
            ],
          }),
          ask("What percentage is 9 out of 36?", "25", "9 ÷ 36.", "25%.", {
            unit: "%",
            asks: "percentage",
            changed: "A bigger whole.",
          }),
          ask("What percentage is 18 out of 12?", "150", "18 ÷ 12.", "150%.", {
            unit: "%",
            asks: "percentage",
            changed: "The part is bigger than the whole.",
          }),
          ask("What percentage is 9 out of 9?", "100", "The whole thing.", "100%.", {
            unit: "%",
            asks: "percentage",
            changed: "All of it.",
          }),
        ],
        "Always divide by the whole, whatever it is.",
      ),
      own(PC, OF, "Spot the mistake"),

      own(PC, OF, "Exit check"),

      reworded(
        PC,
        OF,
        "Maths 42 out of 60; science 36 out of 45",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Divide the part by the whole, then times by 100.**"],
        maths("\\frac{18}{24} = 0.75 = 75\\%"),
        [
          "**Divide the part by the whole, then times by 100.**",
          "Same units first: 50 cm of 2 m is 50 out of 200.",
          "42 out of 60 is 70%, not 42%.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    PERCENT,
  ),
});

// ---------------------------------------------------------------------------------------------
// Percentage change.

const CHANGE = "y8-percentages/change";
const changeMethod = [
  "Up: 100% plus the change. Down: 100% minus it.",
  "Write it as a decimal: the multiplier.",
  "Times the amount by the multiplier.",
];

const change = stepped(find(PC, CHANGE), {
  method: changeMethod,
  variation: {
    relationship: "new amount = original × multiplier",
    unknowns: ["multiplier", "new amount", "percentage change"],
    surface: ["rises", "falls", "small changes", "doubling"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "One multiplier",
        ["**Up or down by a percentage: times by one multiplier.**"],
        {
          kind: "bars",
          rows: [
            { label: "Price", parts: 20, each: "" },
            { label: "Sale", parts: 17, each: "" },
          ],
        },
        "15% off leaves 85%: times by 0.85.",
      ),
      reworded(PC, CHANGE, "Multipliers", { tag: "The rule" }),

      ...owned(PC, CHANGE, "Warm-up", "Check you remember"),

      methodCard("The method", changeMethod, maths("£250 \\times 1.12 = £280")),
      workedFrom(PC, CHANGE),
      calc(
        "Your turn",
        "Decrease £60 by 15%.",
        undefined,
        [
          ["$100\\% - 15\\% =$", "85", "What's left.", { after: "%" }],
          ["The multiplier:", "0.85", "85% as a decimal."],
          ["$60 \\times 0.85 =$", "51", "Times the amount.", { after: "pounds" }],
        ],
        "£51.",
      ),

      calc(
        "Practise",
        "Increase £45 by 20%.",
        undefined,
        [
          ["The multiplier:", "1.2", "120% as a decimal."],
          ["$45 \\times 1.2 =$", "54", "Times the amount.", { after: "pounds" }],
        ],
        "£54.",
      ),
      ...owned(PC, CHANGE, "Together", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("The multiplier for a 7% increase?", "1.07", "107%.", "1.07.", {
            asks: "multiplier",
          }),
          ask("The multiplier for a 7% decrease?", "0.93", "93%.", "0.93.", {
            asks: "multiplier",
            changed: "Now down.",
          }),
          ask("Increase £200 by 7%.", "214", "200 × 1.07.", "£214.", {
            unit: "£",
            asks: "new amount",
            changed: "Now use it.",
          }),
          ask("£200 rises to £214. Percentage increase?", "7", "14 ÷ 200.", "7%.", {
            unit: "%",
            asks: "percentage change",
            changed: "Now find the percentage.",
          }),
        ],
        "One multiplier for each change.",
      ),

      questionSet(
        "Variation",
        "Find each multiplier. Watch what changes.",
        [
          ask("The multiplier for a 4% rise?", "1.04", "104%.", "1.04.", {
            asks: "multiplier",
            expect: [
              "Jo multiplies by 1.4 for a 4% rise. Right?",
              "No",
              "1.4 is 140%: a 40% rise. 4% is 1.04.",
              [["Yes", "1.4 means 140%."]],
            ],
          }),
          ask("The multiplier for a 40% rise?", "1.4", "140%.", "1.4.", {
            asks: "multiplier",
            changed: "Ten times the change.",
          }),
          ask("The multiplier for a 40% fall?", "0.6", "60%.", "0.6.", {
            asks: "multiplier",
            changed: "A fall.",
          }),
          ask("The multiplier for a 100% rise?", "2", "200%.", "2: it doubles.", {
            asks: "multiplier",
            changed: "Doubling.",
          }),
        ],
        "Write the new percentage, then as a decimal.",
      ),
      own(PC, CHANGE, "Spot the mistake"),

      own(PC, CHANGE, "Exit check"),

      reworded(
        PC,
        CHANGE,
        "The bus fare: £2.50, up 12%",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Up or down by a percentage: times by one multiplier.**"],
        maths("£250 \\times 1.12 = £280"),
        [
          "**Up or down by a percentage: times by one multiplier.**",
          "12% up: × 1.12. 15% off: × 0.85.",
          "Percentage change = change ÷ original × 100.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    PERCENT,
  ),
});

// ---------------------------------------------------------------------------------------------
// Back to the original.

const ORIGINAL = "y8-percentages/original";
const originalMethod = [
  "What percentage is the new amount? 120%, or 75%?",
  "Write it as a multiplier.",
  "Divide the new amount by it.",
];
const BEFORE_AFTER: Picture = {
  kind: "bars",
  rows: [
    { label: "Original", parts: 5, each: "20%" },
    { label: "After", parts: 6, each: "£10" },
  ],
};

const original = stepped(find(PC, ORIGINAL), {
  method: originalMethod,
  variation: {
    relationship: "new amount = original × multiplier, worked backwards",
    unknowns: ["original", "new amount", "percentage"],
    surface: ["sales", "rises", "VAT"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Back to the start",
        ["**To go back, divide by the multiplier.**"],
        BEFORE_AFTER,
        "£60 after a 20% rise is 120%: each 20% is £10.",
      ),
      reworded(PC, ORIGINAL, "Why not take 20% of £60 away?", { tag: "The rule" }),

      ...owned(PC, ORIGINAL, "Warm-up", "Check you remember"),

      methodCard("The method", originalMethod, maths("£60 \\div 1.2 = £50")),
      workedFrom(PC, ORIGINAL),
      calc(
        "Your turn",
        "After a 25% rise, a price is £75. The original?",
        undefined,
        [
          ["The new price is", "125", "100% + 25%.", { after: "%" }],
          ["The multiplier:", "1.25", "125% as a decimal."],
          ["$75 \\div 1.25 =$", "60", "Divide to go back.", { after: "pounds" }],
        ],
        "£60.",
      ),

      calc(
        "Practise",
        "After 10% off, a bike is £180. The original?",
        undefined,
        [
          ["The multiplier:", "0.9", "90% is left."],
          ["$180 \\div 0.9 =$", "200", "Divide to go back.", { after: "pounds" }],
        ],
        "£200.",
      ),
      reworded(PC, ORIGINAL, "With 1%", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("After a 30% rise, a price is £65. The original?", "50", "65 ÷ 1.3.", "£50.", {
            unit: "£",
            asks: "original",
          }),
          ask("After 30% off, a price is £35. The original?", "50", "35 ÷ 0.7.", "£50.", {
            unit: "£",
            asks: "original",
            changed: "A fall.",
          }),
          ask("£50 rises by 30%. The new price?", "65", "50 × 1.3.", "£65.", {
            unit: "£",
            asks: "new amount",
            changed: "Now forwards.",
          }),
          ask("£50 rises to £65. The percentage rise?", "30", "15 ÷ 50.", "30%.", {
            unit: "%",
            asks: "percentage",
            changed: "Now the percentage.",
          }),
        ],
        "Forwards: times. Backwards: divide.",
      ),

      questionSet(
        "Variation",
        "Find the price before. Watch what changes.",
        [
          ask("After 20% off, a top is £40. Before?", "50", "40 ÷ 0.8.", "£50.", {
            unit: "£",
            asks: "original",
            expect: [
              "Mo adds 20% back on: £48. Right?",
              "No",
              "20% of £40 is less than 20% of the original. $40 \\div 0.8 = £50$.",
              [["Yes", "Check: 20% off £48 is £38.40."]],
            ],
          }),
          ask("After 20% off, a top is £48. Before?", "60", "48 ÷ 0.8.", "£60.", {
            unit: "£",
            asks: "original",
            changed: "A different sale price.",
          }),
          ask("After a 20% rise, a top is £48. Before?", "40", "48 ÷ 1.2.", "£40.", {
            unit: "£",
            asks: "original",
            changed: "A rise, not a fall.",
          }),
          ask("With 20% VAT, a top is £48. Before VAT?", "40", "VAT is a 20% rise.", "£40.", {
            unit: "£",
            asks: "original",
            changed: "VAT.",
          }),
        ],
        "Divide by the multiplier: never add the percentage back.",
      ),
      reworded(
        PC,
        ORIGINAL,
        "Where did it go wrong?",
        { text: "Phone with 20% VAT: £240. Ivy finds the price before VAT." },
        "Spot the mistake",
      ),

      own(PC, ORIGINAL, "Exit check"),

      reworded(
        PC,
        ORIGINAL,
        "The game: £36 after 25% off",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**To go back, divide by the multiplier.**"],
        BEFORE_AFTER,
        [
          "**To go back, divide by the multiplier.**",
          "£60 after a 20% rise: $60 \\div 1.2 = £50$.",
          "Never add the percentage back on.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    PERCENT,
  ),
});

// ---------------------------------------------------------------------------------------------
// Simple interest.

const INTEREST = "y8-percentages/interest";
const interestMethod = [
  "Find one year's interest: the percentage of what was put in.",
  "Times by the number of years.",
  "Add it on for the total.",
];
const GROWS: Picture = {
  kind: "table",
  head: ["Year", "1", "2", "3"],
  rows: [
    ["Interest", "£10", "£10", "£10"],
    ["Total", "£210", "£220", "£230"],
  ],
};

const interest = stepped(find(PC, INTEREST), {
  method: interestMethod,
  variation: {
    relationship: "interest = rate × amount × years",
    unknowns: ["interest", "total", "years", "rate"],
    surface: ["longer", "a higher rate", "more money"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Simple interest",
        ["**Simple interest is the same every year.**"],
        GROWS,
        "£200 at 5%: £10 every year.",
      ),
      reworded(PC, INTEREST, "£200 at 5% simple interest. After 10 years, the interest is", {
        tag: "The rule",
      }),

      ...owned(PC, INTEREST, "Warm-up", "Check you remember"),

      methodCard("The method", interestMethod, GROWS),
      workedFrom(PC, INTEREST),
      calc(
        "Your turn",
        "£600 at 3% simple interest for 4 years. The interest?",
        undefined,
        [
          ["One year: 3% of £600 =", "18", "1% is £6."],
          ["Four years:", "72", "$4 \\times 18$.", { after: "pounds" }],
        ],
        "£72.",
      ),

      calc(
        "Practise",
        "£2000 at 1.5% simple interest for 2 years. The total?",
        undefined,
        [
          ["One year:", "30", "1.5% of £2000."],
          ["Two years:", "60", "$2 \\times 30$."],
          ["Total:", "2060", "Add it on.", { after: "pounds" }],
        ],
        "£2060.",
      ),
      ...owned(PC, INTEREST, "Together", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("£500 at 4% for 3 years: the interest?", "60", "£20 a year.", "£60.", {
            unit: "£",
            asks: "interest",
          }),
          ask("£500 at 4% for 3 years: the total?", "560", "Add the interest on.", "£560.", {
            unit: "£",
            asks: "total",
            changed: "Now the total.",
          }),
          ask("£500 at 4% earns £100. How many years?", "5", "£20 a year.", "5 years.", {
            asks: "years",
            changed: "Now the years.",
          }),
          ask("£500 earns £60 in 3 years. The rate?", "4", "£20 a year.", "4%.", {
            unit: "%",
            asks: "rate",
            changed: "Now the rate.",
          }),
        ],
        "One year first, then the rest.",
      ),

      questionSet(
        "Variation",
        "Find the interest. Watch what changes.",
        [
          ask("£600 at 2% for 5 years: the interest?", "60", "£12 a year.", "£60.", {
            unit: "£",
            asks: "interest",
            expect: [
              "Lia finds 2% of £600 = £12. Is that it?",
              "No",
              "£12 is one year. Five years: £60.",
              [["Yes", "Five years, not one."]],
            ],
          }),
          ask("£600 at 2% for 10 years: the interest?", "120", "Twice as long.", "£120.", {
            unit: "£",
            asks: "interest",
            changed: "Twice as long.",
          }),
          ask("£600 at 4% for 5 years: the interest?", "120", "Twice the rate.", "£120.", {
            unit: "£",
            asks: "interest",
            changed: "Twice the rate.",
          }),
          ask("£1200 at 2% for 5 years: the interest?", "120", "Twice the money.", "£120.", {
            unit: "£",
            asks: "interest",
            changed: "Twice the money.",
          }),
        ],
        "Double any one of them, and the interest doubles.",
      ),
      own(PC, INTEREST, "Spot the mistake"),

      own(PC, INTEREST, "Exit check"),

      reworded(
        PC,
        INTEREST,
        "Gran's savings: £500 at 3% for 4 years",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Simple interest is the same every year.**"],
        GROWS,
        [
          "**Simple interest is the same every year.**",
          "One year's interest × the number of years.",
          "Add it on for the total in the account.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    PERCENT,
  ),
});

export const y8MeasureStepped: [string, UnitLesson[]][] = [
  [CIRC, [circumference]],
  [COMPOSITE, [composite]],
  [OF, [ofAnother]],
  [CHANGE, [change]],
  [ORIGINAL, [original]],
  [INTEREST, [interest]],
];
