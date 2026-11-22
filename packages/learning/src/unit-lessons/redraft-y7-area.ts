// Year 7, "Perimeter, area and volume", on the stepped template (docs/proposals/lesson-stepped.md):
// perimeter, the areas of a triangle, a parallelogram and a trapezium, and the volumes of a cuboid
// and a prism. Every question is asked on its shape, with its lengths (and its dashed height) on
// the drawing and only what to find in words.
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
import { find, own, owned, reworded, stepped, words } from "./stepped.ts";
import type { CuboidPic, DrawingPic, Point, Screen, UnitLesson } from "./types.ts";
import { y7Area } from "./y7-area.ts";

const NUMBER = "A number check: the sum the method needs.";
const list = y7Area;

const mid = (ps: Point[]): Point => ({
  x: ps.reduce((s, p) => s + p.x, 0) / ps.length,
  y: ps.reduce((s, p) => s + p.y, 0) / ps.length,
});

/**
 * A shape drawn with its sides, a label on each side given one, and a dashed height (from the top
 * down to the base line) with its own label.
 */
function figure(
  points: Point[],
  labels: (string | null)[],
  height?: { from: Point; to: Point; label: string },
): DrawingPic {
  const inside = mid(points);
  const items: DrawingPic["items"] = [];
  points.forEach((p, i) => {
    const q = points[(i + 1) % points.length] ?? p;
    items.push({ line: [p, q] });
    const label = labels[i];
    if (label) items.push({ side: [p, q], label, inside });
  });
  if (height) {
    items.push({ line: [height.from, height.to], dashed: true });
    const away = { x: height.from.x - 1, y: (height.from.y + height.to.y) / 2 };
    items.push({ side: [height.from, height.to], label: height.label, inside: away });
  }
  return { kind: "drawing", items };
}

/** A triangle with base b, apex over x = a at height h; the height dashed when labelled. */
const tri = (b: number, h: number, a: number, base: string, height?: string, slope?: string) =>
  figure(
    [
      { x: 0, y: 0 },
      { x: b, y: 0 },
      { x: a, y: h },
    ],
    [base, slope ?? null, null],
    height ? { from: { x: a, y: h }, to: { x: a, y: 0 }, label: height } : undefined,
  );

/** A parallelogram with base b, height h and a slant offset s. */
const para = (
  b: number,
  h: number,
  s: number,
  base: string,
  height?: string | null,
  slant?: string | null,
) =>
  figure(
    [
      { x: 0, y: 0 },
      { x: b, y: 0 },
      { x: b + s, y: h },
      { x: s, y: h },
    ],
    [base, slant ?? null, null, null],
    height ? { from: { x: s, y: h }, to: { x: s, y: 0 }, label: height } : undefined,
  );

/** A trapezium with parallel sides a (top) and b (bottom), height h. */
const trap = (
  a: number,
  b: number,
  h: number,
  top: string,
  bottom: string,
  height?: string,
  slant?: string,
) => {
  const off = (b - a) / 2;
  return figure(
    [
      { x: 0, y: 0 },
      { x: b, y: 0 },
      { x: off + a, y: h },
      { x: off, y: h },
    ],
    [bottom, slant ?? null, top, slant ?? null],
    height ? { from: { x: off, y: h }, to: { x: off, y: 0 }, label: height } : undefined,
  );
};

/** A rectangle w by h, two sides labelled. */
const rect = (w: number, h: number, across: string, up: string) =>
  figure(
    [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: h },
      { x: 0, y: h },
    ],
    [across, up, null, null],
  );

const box = (
  w: number,
  d: number,
  h: number,
  labels?: [string, string, string],
  cubes = false,
): CuboidPic => ({
  kind: "cuboid",
  w,
  d,
  h,
  ...(cubes ? { cubes: true } : {}),
  ...(labels ? { labels } : {}),
});

/** A triangular prism: its triangle end, labelled, and its length along the side. */
const prism = (base: string, height: string, length: string): DrawingPic => ({
  kind: "drawing",
  items: [
    {
      line: [
        { x: 0, y: 0 },
        { x: 3, y: 0 },
      ],
    },
    {
      line: [
        { x: 3, y: 0 },
        { x: 1.5, y: 2 },
      ],
    },
    {
      line: [
        { x: 1.5, y: 2 },
        { x: 0, y: 0 },
      ],
    },
    {
      line: [
        { x: 1.5, y: 2 },
        { x: 1.5, y: 0 },
      ],
      dashed: true,
    },
    {
      line: [
        { x: 3, y: 0 },
        { x: 7, y: 1.5 },
      ],
    },
    {
      line: [
        { x: 1.5, y: 2 },
        { x: 5.5, y: 3.5 },
      ],
    },
    {
      line: [
        { x: 5.5, y: 3.5 },
        { x: 7, y: 1.5 },
      ],
    },
    {
      side: [
        { x: 0, y: 0 },
        { x: 3, y: 0 },
      ],
      label: base,
      inside: { x: 1.5, y: 1 },
    },
    {
      side: [
        { x: 1.5, y: 2 },
        { x: 1.5, y: 0 },
      ],
      label: height,
      inside: { x: 3, y: 1 },
    },
    {
      side: [
        { x: 3, y: 0 },
        { x: 7, y: 1.5 },
      ],
      label: length,
      inside: { x: 4, y: 2 },
    },
  ],
});

/** Every number check with no picture says so. */
const worded = (screens: Screen[]): Screen[] =>
  screens.map((s) =>
    ["answer", "choice", "calc", "steps"].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture)
      ? { ...s, wordsOnly: NUMBER }
      : s,
  );

// ---------------------------------------------------------------------------------------------
// Perimeter.

const PERIMETER = "y7-area/perimeter";
const perimeterMethod = [
  "Find every side, using equal sides where marked.",
  "Add them all up.",
  "Give a length unit: cm or m, not cm².",
];

const perimeter = stepped(find(list, PERIMETER), {
  method: perimeterMethod,
  variation: {
    relationship: "a shape's sides and its perimeter",
    unknowns: ["perimeter", "missing side"],
    surface: ["equal sides", "parallelograms", "triangles", "area mix-ups", "fencing"],
  },
  screens: worded([
    explain(
      "The rule",
      "Perimeter",
      ["**The perimeter is the distance all the way round.**"],
      figure(
        [
          { x: 0, y: 0 },
          { x: 6, y: 0 },
          { x: 4, y: 4 },
        ],
        ["6 cm", "4.5 cm", "4.5 cm"],
      ),
      "Add every side: 6 + 4.5 + 4.5 = 15 cm.",
    ),

    words(
      typed("Check you remember", "What is $10 + 5 + 4 + 5$?", "24", "Add in any order.", "24."),
      NUMBER,
    ),
    words(typed("Check you remember", "What is $8 \\times 2$?", "16", "Double 8.", "16."), NUMBER),
    typed("Check you remember", "How many sides does this shape have?", "4", "Count them.", "4.", {
      picture: para(6, 3, 1.5, "8 cm", null),
    }),

    methodCard("The method", perimeterMethod, para(6, 3, 1.5, "8 cm", null, "5 cm")),
    worked(
      "Watch the method",
      "Find the perimeter of the parallelogram.",
      [
        { line: "Two sides of 8 cm, two of 5 cm", note: "Opposite sides are equal." },
        { line: "$8 + 5 + 8 + 5 = 26$ cm" },
      ],
      "26 cm.",
      para(6, 3, 1.5, "8 cm", null, "5 cm"),
    ),
    calc(
      "Your turn",
      "Find the perimeter of the parallelogram.",
      para(6, 3, 1.5, "10 cm", null, "6 cm"),
      [
        [
          "The two unlabelled sides:",
          "16",
          "They match the opposite sides: 10 and 6.",
          { after: "cm" },
        ],
        ["Perimeter: $16 + 16 =$", "32", "Add all four.", { after: "cm" }],
      ],
      "32 cm.",
    ),

    calc(
      "Practise",
      "Find the perimeter of the triangle.",
      figure(
        [
          { x: 0, y: 0 },
          { x: 6, y: 0 },
          { x: 3, y: 4 },
        ],
        ["9 cm", "9 cm", "9 cm"],
      ),
      [["$9 + 9 + 9 =$", "27", "Add every side.", { after: "cm" }]],
      "27 cm.",
    ),
    ...owned(list, PERIMETER, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find the perimeter.", "20", "Add the three sides.", "20 cm.", {
          unit: "cm",
          asks: "perimeter",
          picture: figure(
            [
              { x: 0, y: 0 },
              { x: 6, y: 0 },
              { x: 2, y: 4 },
            ],
            ["8 cm", "7 cm", "5 cm"],
          ),
        }),
        ask("Find the perimeter.", "34", "Opposite sides are equal.", "34 cm.", {
          unit: "cm",
          asks: "perimeter",
          changed: "A parallelogram.",
          picture: para(6, 3, 1.5, "12 cm", null, "5 cm"),
        }),
        ask("The perimeter is 20 cm. Find the missing side.", "7", "20 − 8 − 5.", "7 cm.", {
          unit: "cm",
          asks: "missing side",
          changed: "Now a missing side.",
          picture: figure(
            [
              { x: 0, y: 0 },
              { x: 6, y: 0 },
              { x: 2, y: 4 },
            ],
            ["8 cm", "?", "5 cm"],
          ),
        }),
      ],
      "Add every side; work back for a missing one.",
    ),

    questionSet(
      "Variation",
      "Find the perimeter. Watch what changes.",
      [
        ask("Find the perimeter.", "16", "5 + 3 + 5 + 3.", "16 cm.", {
          unit: "cm",
          asks: "perimeter",
          picture: rect(5, 3, "5 cm", "3 cm"),
          expect: [
            "Raj gets 15 cm. What did he find?",
            "the area",
            "5 × 3 = 15 is the area, in cm². The perimeter adds the sides.",
            [["the perimeter", "Add all four sides: 16 cm."]],
          ],
        }),
        ask("Find the perimeter.", "20", "6 + 4 + 6 + 4.", "20 cm.", {
          unit: "cm",
          asks: "perimeter",
          changed: "A bigger rectangle.",
          picture: rect(6, 4, "6 cm", "4 cm"),
        }),
        ask("Find the perimeter.", "24", "4 sides of 6.", "24 cm.", {
          unit: "cm",
          asks: "perimeter",
          changed: "A square.",
          picture: rect(4, 4, "6 cm", "6 cm"),
        }),
        ask("Find the perimeter.", "22", "Opposite sides: 7 and 4.", "22 cm.", {
          unit: "cm",
          asks: "perimeter",
          changed: "Two sides labelled; add all four.",
          picture: para(6, 3, 1.5, "7 cm", null, "4 cm"),
        }),
      ],
      "Every side counts, labelled or not.",
    ),
    {
      ...own(list, PERIMETER, "Spot the mistake"),
      text: "Ivy finds the perimeter.",
      picture: para(6, 3, 1.5, "7 cm", null, "4 cm"),
    } as Screen,

    quiz([
      [
        [
          "Find the perimeter.",
          "20 cm",
          ["13 cm", "280 cm"],
          "Add the three sides.",
          figure(
            [
              { x: 0, y: 0 },
              { x: 6, y: 0 },
              { x: 2, y: 4 },
            ],
            ["8 cm", "7 cm", "5 cm"],
          ),
          "perimeter",
        ],
        [
          "Find the perimeter.",
          "18 cm",
          ["11 cm", "210 cm"],
          "Add the three sides.",
          figure(
            [
              { x: 0, y: 0 },
              { x: 6, y: 0 },
              { x: 2, y: 4 },
            ],
            ["7 cm", "6 cm", "5 cm"],
          ),
          "perimeter",
        ],
      ],
      [
        [
          "Find the perimeter.",
          "34 cm",
          ["17 cm", "60 cm"],
          "12 + 5 + 12 + 5.",
          para(6, 3, 1.5, "12 cm", null, "5 cm"),
          "perimeter",
        ],
        [
          "Find the perimeter.",
          "28 cm",
          ["14 cm", "45 cm"],
          "9 + 5 + 9 + 5.",
          para(6, 3, 1.5, "9 cm", null, "5 cm"),
          "perimeter",
        ],
      ],
      [
        [
          "Find the perimeter.",
          "14 cm",
          ["12 cm", "10 cm"],
          "4 + 3 + 4 + 3.",
          rect(4, 3, "4 cm", "3 cm"),
          "perimeter",
        ],
        [
          "Find the perimeter.",
          "18 cm",
          ["20 cm", "14 cm"],
          "5 + 4 + 5 + 4.",
          rect(5, 4, "5 cm", "4 cm"),
          "perimeter",
        ],
      ],
    ]),

    reworded(list, PERIMETER, "Fencing a garden", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**The perimeter is the distance all the way round.**"],
      para(6, 3, 1.5, "8 cm", null, "5 cm"),
      [
        "**The perimeter is the distance all the way round.**",
        "Add every side, using equal sides.",
        "It's a length: cm, not cm².",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// The area of a triangle.

const TRIANGLE = "y7-area/triangle";
const triangleMethod = [
  "Find the base and the height at right angles to it.",
  "Times them.",
  "Halve it. Give the units squared.",
];

const triangleArea = stepped(find(list, TRIANGLE), {
  method: triangleMethod,
  variation: {
    relationship: "a triangle's base, height and area",
    unknowns: ["area", "base", "height"],
    surface: ["right-angled", "sloping sides", "tall and thin", "roofs"],
  },
  screens: worded([
    explain(
      "The rule",
      "The area of a triangle",
      ["**A triangle's area is half the base times the height.**"],
      tri(6, 4, 2, "6 cm", "4 cm"),
      "It's half of a rectangle 6 cm by 4 cm.",
    ),
    reworded(list, TRIANGLE, "Any triangle: two copies", { tag: "The rule" }),

    typed(
      "Check you remember",
      "Find the area of the rectangle.",
      "24",
      "Length times width.",
      "24 cm².",
      {
        unit: "cm²",
        picture: rect(6, 4, "6 cm", "4 cm"),
      },
    ),
    words(typed("Check you remember", "What is half of 24?", "12", "24 ÷ 2.", "12."), NUMBER),
    words(
      typed(
        "Check you remember",
        "What is $\\frac12 \\times 8 \\times 5$?",
        "20",
        "8 × 5 is 40.",
        "20.",
      ),
      NUMBER,
    ),

    methodCard("The method", triangleMethod, tri(10, 5, 4, "10 cm", "7 cm")),
    worked(
      "Watch the method",
      "Find the area.",
      [
        { line: "Area $= \\frac12 \\times b \\times h$" },
        {
          line: "$= \\frac12 \\times 10 \\times 7 = 35$ cm²",
          note: "Use the dashed height, not a side.",
        },
      ],
      "35 cm².",
      tri(10, 5, 4, "10 cm", "7 cm"),
    ),
    calc(
      "Your turn",
      "Find the area.",
      tri(8, 4, 3, "12 cm", "5 cm"),
      [
        ["$12 \\times 5 =$", "60", "Base times height."],
        ["Half of 60 =", "30", "Halve it.", { after: "cm²" }],
      ],
      "30 cm².",
    ),

    calc(
      "Practise",
      "Find the area.",
      tri(7, 4, 5, "9 cm", "4 cm", "5 cm"),
      [
        ["$9 \\times 4 =$", "36", "Base times the dashed height."],
        ["Half of 36 =", "18", "Halve it.", { after: "cm²" }],
      ],
      "18 cm².",
    ),
    ...owned(list, TRIANGLE, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find the area.", "24", "Half of 6 × 8.", "24 cm².", {
          unit: "cm²",
          asks: "area",
          picture: tri(6, 5, 2, "6 cm", "8 cm"),
        }),
        ask("Find the area.", "14", "Half of 7 × 4.", "14 cm².", {
          unit: "cm²",
          asks: "area",
          changed: "A different triangle.",
          picture: tri(7, 4, 5, "7 cm", "4 cm"),
        }),
        ask("The area is 20 cm². Find the height.", "5", "Half of 8 × h is 20.", "5 cm.", {
          unit: "cm",
          asks: "height",
          changed: "Now the height is missing.",
          picture: tri(8, 4, 3, "8 cm", "h"),
        }),
        ask("The area is 15 cm². Find the base.", "10", "Half of b × 3 is 15.", "10 cm.", {
          unit: "cm",
          asks: "base",
          changed: "Now the base is missing.",
          picture: tri(8, 3, 3, "b", "3 cm"),
        }),
      ],
      "Area, base or height: half base times height links them.",
    ),

    questionSet(
      "Variation",
      "Find the area. Watch what changes.",
      [
        ask("Find the area.", "12", "Half of 6 × 4.", "12 cm².", {
          unit: "cm²",
          asks: "area",
          picture: tri(6, 4, 6, "6 cm", "4 cm"),
          expect: [
            "Sam gets 24 cm². What did he forget?",
            "to halve it",
            "6 × 4 is the rectangle. The triangle is half: 12 cm².",
            [["nothing", "A triangle is half a rectangle."]],
          ],
        }),
        ask("Find the area.", "12", "Half of 6 × 4.", "12 cm².", {
          unit: "cm²",
          asks: "area",
          changed: "The top slides along.",
          picture: tri(6, 4, 2, "6 cm", "4 cm"),
        }),
        ask("Find the area.", "30", "Half of 10 × 6. Not the slope.", "30 cm².", {
          unit: "cm²",
          asks: "area",
          changed: "A sloping side is labelled too.",
          picture: tri(8, 5, 4, "10 cm", "6 cm", "7 cm"),
        }),
        ask("Find the area.", "24", "Half of 4 × 12.", "24 cm².", {
          unit: "cm²",
          asks: "area",
          changed: "Tall and thin.",
          picture: tri(3, 6, 1.5, "4 cm", "12 cm"),
        }),
      ],
      "Same base and height, same area, however the top slides.",
    ),
    {
      ...own(list, TRIANGLE, "Spot the mistake"),
      text: "Kai finds the area.",
      picture: tri(8, 5, 4, "10 cm", "6 cm", "7 cm"),
    } as Screen,

    quiz([
      [
        [
          "Find the area.",
          "24 cm²",
          ["48 cm²", "14 cm²"],
          "Half of 6 × 8.",
          tri(6, 5, 2, "6 cm", "8 cm"),
          "area",
        ],
        [
          "Find the area.",
          "14 cm²",
          ["28 cm²", "11 cm²"],
          "Half of 7 × 4.",
          tri(7, 4, 5, "7 cm", "4 cm"),
          "area",
        ],
      ],
      [
        [
          "Find the area.",
          "15 cm²",
          ["30 cm²", "8 cm²"],
          "Half of 10 × 3.",
          tri(8, 3, 3, "10 cm", "3 cm"),
          "area",
        ],
        [
          "Find the area.",
          "18 cm²",
          ["36 cm²", "10 cm²"],
          "Half of 9 × 4.",
          tri(7, 4, 5, "9 cm", "4 cm"),
          "area",
        ],
      ],
      [
        [
          "Find the height.",
          "5 cm",
          ["10 cm", "2.5 cm"],
          "Half of 8 × h is 20.",
          tri(8, 4, 3, "8 cm", "h"),
          "height",
        ],
        [
          "Find the height.",
          "4 cm",
          ["8 cm", "2 cm"],
          "Half of 10 × h is 20.",
          tri(8, 4, 3, "10 cm", "h"),
          "height",
        ],
      ],
    ]),

    reworded(
      list,
      TRIANGLE,
      "Painting a gable",
      { tag: "Real life", start: "A tin of paint covers 5 m²." },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**A triangle's area is half the base times the height.**"],
      tri(6, 4, 2, "6 cm", "4 cm"),
      [
        "**A triangle's area is half the base times the height.**",
        "Use the height at right angles to the base, not a slope.",
        "$\\frac12 \\times 10 \\times 7 = 35$ cm²",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// The area of a parallelogram.

const PARA = "y7-area/parallelogram";
const paraMethod = [
  "Find the base and the height at right angles to it.",
  "Times them. Don't use the slope.",
  "Give the units squared.",
];

const paraArea = stepped(find(list, PARA), {
  method: paraMethod,
  variation: {
    relationship: "a parallelogram's base, height and area",
    unknowns: ["area", "base", "height"],
    surface: ["the slope labelled", "decimals", "rectangles", "car parks"],
  },
  screens: worded([
    explain(
      "The rule",
      "The area of a parallelogram",
      ["**A parallelogram's area is the base times the height.**"],
      para(6, 3, 1.5, "9 cm", "4 cm"),
      "Slide a corner across and it's a rectangle.",
    ),
    reworded(list, PARA, "Turn a parallelogram into a rectangle", { tag: "The rule" }),

    typed(
      "Check you remember",
      "Find the area of the rectangle.",
      "12",
      "Length times width.",
      "12 m².",
      {
        unit: "m²",
        picture: rect(5, 2.4, "5 m", "2.4 m"),
      },
    ),
    words(typed("Check you remember", "What is $9 \\times 4$?", "36", "9 fours.", "36."), NUMBER),
    words(
      typed("Check you remember", "What is $8 \\times 2.5$?", "20", "8 × 2 and 8 × 0.5.", "20."),
      NUMBER,
    ),

    methodCard("The method", paraMethod, para(6, 3, 1.5, "9 cm", "4 cm", "4.5 cm")),
    worked(
      "Watch the method",
      "Find the area.",
      [
        { line: "Area $= b \\times h$", note: "The dashed height, not the 4.5 cm slope." },
        { line: "$9 \\times 4 = 36$ cm²" },
      ],
      "36 cm².",
      para(6, 3, 1.5, "9 cm", "4 cm", "4.5 cm"),
    ),
    calc(
      "Your turn",
      "Find the area.",
      para(6, 3, 1.5, "12 cm", "6 cm"),
      [["$12 \\times 6 =$", "72", "Base times height.", { after: "cm²" }]],
      "72 cm².",
    ),

    calc(
      "Practise",
      "Find the area.",
      para(6, 3, 2, "7 cm", "3 cm", "4 cm"),
      [["$7 \\times 3 =$", "21", "Base times the dashed height.", { after: "cm²" }]],
      "21 cm².",
    ),
    ...owned(list, PARA, "Together", "Practise").filter((s) => !s.title.includes("slope")),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find the area.", "40", "8 × 5.", "40 cm².", {
          unit: "cm²",
          asks: "area",
          picture: para(6, 3, 1.5, "8 cm", "5 cm"),
        }),
        ask("Find the area.", "20", "8 × 2.5.", "20 m².", {
          unit: "m²",
          asks: "area",
          changed: "A decimal height.",
          picture: para(6, 3, 1.5, "8 m", "2.5 m"),
        }),
        ask("The area is 36 cm². Find the height.", "4", "9 × h = 36.", "4 cm.", {
          unit: "cm",
          asks: "height",
          changed: "Now the height is missing.",
          picture: para(6, 3, 1.5, "9 cm", "h"),
        }),
        ask("The area is 40 cm². Find the base.", "8", "b × 5 = 40.", "8 cm.", {
          unit: "cm",
          asks: "base",
          changed: "Now the base is missing.",
          picture: para(6, 3, 1.5, "b", "5 cm"),
        }),
      ],
      "Area = base × height: any one from the other two.",
    ),

    questionSet(
      "Variation",
      "Find the area. Watch what changes.",
      [
        ask("Find the area.", "50", "10 × 5.", "50 cm².", {
          unit: "cm²",
          asks: "area",
          picture: para(6, 3, 1.5, "10 cm", "5 cm", "6 cm"),
          expect: [
            "Mia uses the slope: 10 × 6 = 60. Right?",
            "No: 50 cm²",
            "The slope is longer than the height. Use the height.",
            [["Yes", "The slope isn't at right angles to the base."]],
          ],
        }),
        ask("Find the area.", "50", "10 × 5.", "50 cm².", {
          unit: "cm²",
          asks: "area",
          changed: "It leans further.",
          picture: para(6, 3, 3, "10 cm", "5 cm"),
        }),
        ask("Find the area.", "24", "6 × 4.", "24 cm².", {
          unit: "cm²",
          asks: "area",
          changed: "Different numbers.",
          picture: para(6, 3, 1.5, "6 cm", "4 cm", "5 cm"),
        }),
        ask("Find the area.", "50", "10 × 5.", "50 cm².", {
          unit: "cm²",
          asks: "area",
          changed: "It doesn't lean: a rectangle.",
          picture: rect(6, 3, "10 cm", "5 cm"),
        }),
      ],
      "However it leans, the same base and height give the same area.",
    ),
    {
      ...own(list, PARA, "Spot the mistake"),
      text: "Ben finds the area.",
      picture: para(6, 3, 1.5, "6 cm", "4 cm"),
    } as Screen,

    quiz([
      [
        [
          "Find the area.",
          "40 cm²",
          ["20 cm²", "26 cm²"],
          "8 × 5.",
          para(6, 3, 1.5, "8 cm", "5 cm"),
          "area",
        ],
        [
          "Find the area.",
          "42 cm²",
          ["21 cm²", "26 cm²"],
          "7 × 6.",
          para(6, 3, 1.5, "7 cm", "6 cm"),
          "area",
        ],
      ],
      [
        [
          "Find the area.",
          "24 cm²",
          ["30 cm²", "12 cm²"],
          "6 × 4, not the slope.",
          para(6, 3, 1.5, "6 cm", "4 cm", "5 cm"),
          "area",
        ],
        [
          "Find the area.",
          "35 cm²",
          ["42 cm²", "17.5 cm²"],
          "7 × 5, not the slope.",
          para(6, 3, 1.5, "7 cm", "5 cm", "6 cm"),
          "area",
        ],
      ],
      [
        [
          "The area is 36 cm². Find h.",
          "4 cm",
          ["27 cm", "8 cm"],
          "9 × h = 36.",
          para(6, 3, 1.5, "9 cm", "h"),
          "height",
        ],
        [
          "The area is 30 cm². Find h.",
          "5 cm",
          ["24 cm", "10 cm"],
          "6 × h = 30.",
          para(6, 3, 1.5, "6 cm", "h"),
          "height",
        ],
      ],
    ]),

    reworded(
      list,
      PARA,
      "A sloping car park",
      { tag: "Real life", text: "What is the area of the space?" },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**A parallelogram's area is the base times the height.**"],
      para(6, 3, 1.5, "9 cm", "4 cm", "4.5 cm"),
      [
        "**A parallelogram's area is the base times the height.**",
        "Use the height at right angles, not the slope.",
        "$9 \\times 4 = 36$ cm²",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// The area of a trapezium.

const TRAP = "y7-area/trapezium";
const trapMethod = [
  "Add the two parallel sides.",
  "Times by the height.",
  "Halve it. Give the units squared.",
];

const trapArea = stepped(find(list, TRAP), {
  method: trapMethod,
  variation: {
    relationship: "a trapezium's parallel sides, height and area",
    unknowns: ["area", "height"],
    surface: ["slanted sides labelled", "metres", "the bracket mistake", "flower beds"],
  },
  screens: worded([
    explain(
      "The rule",
      "The area of a trapezium",
      ["**Add the parallel sides, times the height, and halve.**"],
      trap(5, 9, 3, "5 cm", "9 cm", "4 cm"),
      "Two copies make a parallelogram: $\\frac12(a + b)h$.",
    ),
    reworded(list, TRAP, "Two trapezia", { tag: "The rule" }),

    words(
      typed("Check you remember", "What is $3 + 7$?", "10", "Count on 7 from 3.", "10."),
      NUMBER,
    ),
    typed(
      "Check you remember",
      "Find the area of the parallelogram.",
      "20",
      "Base times height.",
      "20 m².",
      {
        unit: "m²",
        picture: para(6, 2, 1.5, "10 m", "2 m"),
      },
    ),
    words(typed("Check you remember", "What is half of 56?", "28", "56 ÷ 2.", "28."), NUMBER),

    methodCard("The method", trapMethod, trap(5, 9, 3, "5 cm", "9 cm", "4 cm")),
    worked(
      "Watch the method",
      "Find the area.",
      [
        { line: "$5 + 9 = 14$", note: "Add the parallel sides." },
        { line: "$14 \\times 4 = 56$" },
        { line: "$\\frac12 \\times 56 = 28$ cm²" },
      ],
      "28 cm².",
      trap(5, 9, 3, "5 cm", "9 cm", "4 cm"),
    ),
    calc(
      "Your turn",
      "Find the area.",
      trap(5, 9, 3, "6 cm", "10 cm", "5 cm"),
      [
        ["$6 + 10 =$", "16", "Add the parallel sides."],
        ["$16 \\times 5 =$", "80", "Times by the height."],
        ["Half of 80 =", "40", "Halve it.", { after: "cm²" }],
      ],
      "40 cm².",
    ),

    calc(
      "Practise",
      "Find the area.",
      trap(4, 9, 3, "2 m", "5 m", "4 m"),
      [
        ["$2 + 5 =$", "7", "Add the parallel sides."],
        ["$7 \\times 4 =$", "28", "Times by the height."],
        ["Half of 28 =", "14", "Halve it.", { after: "m²" }],
      ],
      "14 m².",
    ),
    ...owned(list, TRAP, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find the area.", "30", "Half of (4 + 8) × 5.", "30 cm².", {
          unit: "cm²",
          asks: "area",
          picture: trap(4, 8, 3, "4 cm", "8 cm", "5 cm"),
        }),
        ask("Find the area.", "14", "Half of (3 + 11) × 2.", "14 m².", {
          unit: "m²",
          asks: "area",
          changed: "Metres, and a short height.",
          picture: trap(4, 9, 2, "3 m", "11 m", "2 m"),
        }),
        ask("The area is 30 cm². Find the height.", "5", "Half of 12 × h is 30.", "5 cm.", {
          unit: "cm",
          asks: "height",
          changed: "Now the height is missing.",
          picture: trap(4, 8, 3, "4 cm", "8 cm", "h"),
        }),
      ],
      "Add, times, halve; or work it back.",
    ),

    questionSet(
      "Variation",
      "Find the area. Watch what changes.",
      [
        ask("Find the area.", "25", "Half of (4 + 6) × 5.", "25 cm².", {
          unit: "cm²",
          asks: "area",
          picture: trap(4, 7, 3, "4 cm", "6 cm", "5 cm"),
          expect: [
            "Zoe works out ½ × 4 + 6 × 5 = 32. What's wrong?",
            "She needs a bracket",
            "Add the parallel sides first: ½ × (4 + 6) × 5 = 25.",
            [["Nothing", "Without the bracket, only the 4 is halved."]],
          ],
        }),
        ask("Find the area.", "25", "Half of (4 + 6) × 5.", "25 cm².", {
          unit: "cm²",
          asks: "area",
          changed: "Turned upside down.",
          picture: trap(7, 4, 3, "6 cm", "4 cm", "5 cm"),
        }),
        ask("Find the area.", "50", "Base times height: 10 × 5.", "50 cm².", {
          unit: "cm²",
          asks: "area",
          changed: "Both parallel sides equal: a parallelogram.",
          picture: para(6, 3, 1.5, "10 cm", "5 cm"),
        }),
        ask("Find the area.", "24", "Half of (5 + 7) × 4.", "24 cm².", {
          unit: "cm²",
          asks: "area",
          changed: "A different trapezium.",
          picture: trap(5, 7, 3, "5 cm", "7 cm", "4 cm"),
        }),
      ],
      "Only the parallel sides and the height go in the formula.",
    ),
    {
      ...own(list, TRAP, "Spot the mistake"),
      text: "Tom finds the area.",
      picture: trap(3, 9, 3, "3 cm", "9 cm", "4 cm", "5 cm"),
    } as Screen,

    quiz([
      [
        [
          "Find the area.",
          "30 cm²",
          ["60 cm²", "17 cm²"],
          "Half of (4 + 8) × 5.",
          trap(4, 8, 3, "4 cm", "8 cm", "5 cm"),
          "area",
        ],
        [
          "Find the area.",
          "36 cm²",
          ["72 cm²", "18 cm²"],
          "Half of (5 + 7) × 6.",
          trap(5, 7, 3, "5 cm", "7 cm", "6 cm"),
          "area",
        ],
      ],
      [
        [
          "Find the area.",
          "14 m²",
          ["28 m²", "16 m²"],
          "Half of (3 + 11) × 2.",
          trap(4, 9, 2, "3 m", "11 m", "2 m"),
          "area",
        ],
        [
          "Find the area.",
          "20 m²",
          ["40 m²", "14 m²"],
          "Half of (4 + 6) × 4.",
          trap(4, 7, 3, "4 m", "6 m", "4 m"),
          "area",
        ],
      ],
      [
        [
          "Find h.",
          "5 cm",
          ["10 cm", "2.5 cm"],
          "Half of 12 × h is 30.",
          trap(4, 8, 3, "4 cm", "8 cm", "h"),
          "height",
        ],
        [
          "Find h.",
          "4 cm",
          ["8 cm", "2 cm"],
          "Half of 10 × h is 20.",
          trap(4, 7, 3, "4 cm", "6 cm", "h"),
          "height",
        ],
      ],
    ]),

    reworded(
      list,
      TRAP,
      "A garden bed",
      { tag: "Real life", start: "Compost covers 4 m² a bag." },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Add the parallel sides, times the height, and halve.**"],
      trap(5, 9, 3, "5 cm", "9 cm", "4 cm"),
      [
        "**Add the parallel sides, times the height, and halve.**",
        "Area $= \\frac12(a + b)h$",
        "$\\frac12 \\times (5 + 9) \\times 4 = 28$ cm²",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// The volume of a cuboid.

const CUBOID = "y7-area/cuboid";
const cuboidMethod = [
  "Count the cubes in one layer: length × width.",
  "Times by the number of layers: the height.",
  "Give cubic units: cm³.",
];

const cuboid = stepped(find(list, CUBOID), {
  method: cuboidMethod,
  variation: {
    relationship: "a cuboid's length, width, height and volume",
    unknowns: ["volume", "height"],
    surface: ["cubes", "big numbers", "the adding mistake", "fish tanks"],
  },
  screens: worded([
    explain(
      "The rule",
      "The volume of a cuboid",
      ["**Volume is the cubes in a layer, times the layers.**"],
      box(4, 3, 2, undefined, true),
      "Length × width × height. Volume is in cubes: cm³.",
    ),
    reworded(list, CUBOID, "Build a cuboid", { tag: "The rule" }),

    ...owned(list, CUBOID, "Warm-up", "Check you remember").map(
      (s) => ({ ...s, wordsOnly: NUMBER }) as Screen,
    ),
    typed("Check you remember", "How many cubes in one layer?", "12", "4 rows of 3.", "12.", {
      picture: box(4, 3, 1, undefined, true),
    }),

    methodCard("The method", cuboidMethod, box(6, 2, 3, ["6 cm", "2 cm", "3 cm"])),
    worked(
      "Watch the method",
      "Find the volume.",
      [
        { line: "One layer: $6 \\times 2 = 12$ cubes" },
        { line: "3 layers: $12 \\times 3 = 36$ cm³", note: "Cubic units." },
      ],
      "36 cm³.",
      box(6, 2, 3, ["6 cm", "2 cm", "3 cm"]),
    ),
    calc(
      "Your turn",
      "Find the volume.",
      box(5, 4, 3, ["5 cm", "4 cm", "3 cm"]),
      [
        ["One layer: $5 \\times 4 =$", "20", "Length times width."],
        ["$20 \\times 3 =$", "60", "Times the layers.", { after: "cm³" }],
      ],
      "60 cm³.",
    ),

    calc(
      "Practise",
      "Find the volume of the cube.",
      box(4, 4, 4, ["4 cm", "4 cm", "4 cm"]),
      [
        ["One layer: $4 \\times 4 =$", "16", "Length times width."],
        ["$16 \\times 4 =$", "64", "Times the layers.", { after: "cm³" }],
      ],
      "64 cm³.",
    ),
    ...owned(list, CUBOID, "Together", "Practise").map((s) =>
      "picture" in s && s.picture
        ? s
        : ({
            ...s,
            ...(s.title === "A missing length"
              ? { start: "Volume 60 cm³. The base is 5 cm by 3 cm." }
              : {}),
            wordsOnly: "The sizes are given to work from.",
          } as Screen),
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find the volume.", "60", "5 × 4 × 3.", "60 cm³.", {
          unit: "cm³",
          asks: "volume",
          picture: box(5, 4, 3, ["5 cm", "4 cm", "3 cm"]),
        }),
        ask("Find the volume.", "27", "3 × 3 × 3.", "27 cm³.", {
          unit: "cm³",
          asks: "volume",
          changed: "A cube.",
          picture: box(3, 3, 3, ["3 cm", "3 cm", "3 cm"]),
        }),
        ask("The volume is 48 cm³. Find the height.", "4", "One layer is 12.", "4 cm.", {
          unit: "cm",
          asks: "height",
          changed: "Now the height is missing.",
          picture: box(4, 3, 4, ["4 cm", "3 cm", "h"]),
        }),
      ],
      "Layer, then layers; or work back from the volume.",
    ),

    questionSet(
      "Variation",
      "Find the volume. Watch what changes.",
      [
        ask("Find the volume.", "40", "4 × 5 × 2.", "40 cm³.", {
          unit: "cm³",
          asks: "volume",
          picture: box(4, 5, 2, ["4 cm", "5 cm", "2 cm"]),
          expect: [
            "Jay adds: 4 + 5 + 2 = 11. Is that right?",
            "No: multiply",
            "Volume counts cubes: layer × layers, 40 cm³.",
            [["Yes", "Adding gives a length, not a count of cubes."]],
          ],
        }),
        ask("Find the volume.", "80", "4 × 5 × 4.", "80 cm³.", {
          unit: "cm³",
          asks: "volume",
          changed: "Twice as tall.",
          expect: [
            "The height doubles. The volume…",
            "doubles",
            "Twice the layers, twice the cubes.",
            [["stays the same", "There are twice as many layers."]],
          ],
          picture: box(4, 5, 4, ["4 cm", "5 cm", "4 cm"]),
        }),
        ask("Find the volume.", "40", "2 × 5 × 4.", "40 cm³.", {
          unit: "cm³",
          asks: "volume",
          changed: "Turned on its side.",
          picture: box(2, 5, 4, ["2 cm", "5 cm", "4 cm"]),
        }),
        ask("Find the volume.", "60000", "50 × 30 × 40.", "60 000 cm³.", {
          unit: "cm³",
          asks: "volume",
          changed: "Big numbers: a fish tank.",
          picture: box(5, 3, 4, ["50 cm", "30 cm", "40 cm"]),
        }),
      ],
      "Volume multiplies all three; turning it changes nothing.",
    ),
    {
      ...own(list, CUBOID, "Spot the mistake"),
      text: "Jay finds the volume.",
      picture: box(4, 5, 2, ["4 cm", "5 cm", "2 cm"]),
    } as Screen,

    quiz([
      [
        [
          "Find the volume.",
          "60 cm³",
          ["12 cm³", "47 cm³"],
          "5 × 4 × 3.",
          box(5, 4, 3, ["5 cm", "4 cm", "3 cm"]),
          "volume",
        ],
        [
          "Find the volume.",
          "48 cm³",
          ["14 cm³", "52 cm³"],
          "4 × 6 × 2.",
          box(4, 6, 2, ["4 cm", "6 cm", "2 cm"]),
          "volume",
        ],
      ],
      [
        [
          "Find the volume.",
          "27 cm³",
          ["9 cm³", "18 cm³"],
          "3 × 3 × 3.",
          box(3, 3, 3, ["3 cm", "3 cm", "3 cm"]),
          "volume",
        ],
        [
          "Find the volume.",
          "8 cm³",
          ["6 cm³", "4 cm³"],
          "2 × 2 × 2.",
          box(2, 2, 2, ["2 cm", "2 cm", "2 cm"]),
          "volume",
        ],
      ],
      [
        [
          "The volume is 48 cm³. Find h.",
          "4 cm",
          ["12 cm", "41 cm"],
          "One layer is 12.",
          box(4, 3, 4, ["4 cm", "3 cm", "h"]),
          "height",
        ],
        [
          "The volume is 60 cm³. Find h.",
          "3 cm",
          ["20 cm", "51 cm"],
          "One layer is 20.",
          box(5, 4, 3, ["5 cm", "4 cm", "h"]),
          "height",
        ],
      ],
    ]),

    reworded(
      list,
      CUBOID,
      "Filling a fish tank",
      { tag: "Real life", start: "1000 cm³ of water is 1 litre." },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Volume is the cubes in a layer, times the layers.**"],
      box(4, 3, 2, undefined, true),
      [
        "**Volume is the cubes in a layer, times the layers.**",
        "Length × width × height, in cm³.",
        "$6 \\times 2 \\times 3 = 36$ cm³",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// The volume of a prism.

const PRISM = "y7-area/prism";
const prismMethod = [
  "Find the area of the end: the cross-section.",
  "Times by the length.",
  "Give cubic units.",
];

const prismVolume = stepped(find(list, PRISM), {
  method: prismMethod,
  variation: {
    relationship: "a prism's cross-section, length and volume",
    unknowns: ["volume", "cross-section"],
    surface: ["triangles", "the halving mistake", "cuboids", "tents"],
  },
  screens: worded([
    explain(
      "The rule",
      "The volume of a prism",
      ["**A prism's volume is the area of its end times its length.**"],
      prism("4 cm", "3 cm", "10 cm"),
      "The same shape all the way through, like a stick of rock.",
    ),
    reworded(list, PRISM, "A cuboid is a prism. Its cross-section is", {
      tag: "The rule",
      picture: box(4, 3, 2),
    }),

    typed("Check you remember", "Find the area of the triangle.", "6", "Half of 4 × 3.", "6 cm².", {
      unit: "cm²",
      picture: tri(4, 3, 2, "4 cm", "3 cm"),
    }),
    typed("Check you remember", "Find the volume.", "60", "4 × 3 × 5.", "60 cm³.", {
      unit: "cm³",
      picture: box(4, 3, 5, ["4 cm", "3 cm", "5 cm"]),
    }),
    words(typed("Check you remember", "What is $6 \\times 10$?", "60", "6 tens.", "60."), NUMBER),

    methodCard("The method", prismMethod, prism("4 cm", "3 cm", "10 cm")),
    worked(
      "Watch the method",
      "Find the volume of the prism.",
      [
        {
          line: "End: $\\frac12 \\times 4 \\times 3 = 6$ cm²",
          note: "The cross-section is a triangle.",
        },
        { line: "Volume: $6 \\times 10 = 60$ cm³" },
      ],
      "60 cm³.",
      prism("4 cm", "3 cm", "10 cm"),
    ),
    calc(
      "Your turn",
      "Find the volume of the prism.",
      prism("6 cm", "4 cm", "10 cm"),
      [
        ["End: $\\frac12 \\times 6 \\times 4 =$", "12", "The triangle's area.", { after: "cm²" }],
        ["Volume: $12 \\times 10 =$", "120", "Times the length.", { after: "cm³" }],
      ],
      "120 cm³.",
    ),

    calc(
      "Practise",
      "Find the volume of the prism.",
      prism("5 cm", "4 cm", "10 cm"),
      [
        ["End: $\\frac12 \\times 5 \\times 4 =$", "10", "The triangle's area.", { after: "cm²" }],
        ["Volume: $10 \\times 10 =$", "100", "Times the length.", { after: "cm³" }],
      ],
      "100 cm³.",
    ),
    ...owned(list, PRISM, "Together", "Practise").map(
      (s) =>
        ({
          ...s,
          ...(s.title === "A trapezium prism"
            ? { start: "End: trapezium, 2 and 6 cm, height 3. Length 8 cm." }
            : {}),
          wordsOnly: "The end's sizes are given to work from.",
        }) as Screen,
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find the volume.", "120", "End 12 cm², times 10.", "120 cm³.", {
          unit: "cm³",
          asks: "volume",
          picture: prism("6 cm", "4 cm", "10 cm"),
        }),
        ask("Find the area of the end.", "6", "Half of 4 × 3.", "6 cm².", {
          unit: "cm²",
          asks: "cross-section",
          changed: "Just the end.",
          picture: prism("4 cm", "3 cm", "8 cm"),
        }),
        ask("Find the volume.", "48", "End 6 cm², times 8.", "48 cm³.", {
          unit: "cm³",
          asks: "volume",
          changed: "Now the whole prism.",
          picture: prism("4 cm", "3 cm", "8 cm"),
        }),
      ],
      "End first, then times the length.",
    ),

    questionSet(
      "Variation",
      "Find the volume. Watch what changes.",
      [
        ask("Find the volume.", "60", "Half of 4 × 3, times 10.", "60 cm³.", {
          unit: "cm³",
          asks: "volume",
          picture: prism("4 cm", "3 cm", "10 cm"),
          expect: [
            "Kai works out 4 × 3 × 10 = 120. Is he right?",
            "No: 60 cm³",
            "The triangle is half the rectangle: 6 cm², times 10.",
            [["Yes", "He forgot to halve the triangle."]],
          ],
        }),
        ask("Find the volume.", "120", "Twice as long: 6 × 20.", "120 cm³.", {
          unit: "cm³",
          asks: "volume",
          changed: "Twice as long.",
          picture: prism("4 cm", "3 cm", "20 cm"),
        }),
        ask("Find the volume.", "120", "Double base: 12 × 10.", "120 cm³.", {
          unit: "cm³",
          asks: "volume",
          changed: "A wider end.",
          picture: prism("8 cm", "3 cm", "10 cm"),
        }),
        ask("Find the volume.", "60", "A cuboid is a prism: 4 × 3 × 5.", "60 cm³.", {
          unit: "cm³",
          asks: "volume",
          changed: "A rectangle end: a cuboid.",
          picture: box(4, 3, 5, ["4 cm", "3 cm", "5 cm"]),
        }),
      ],
      "Any prism: the end's area times the length.",
    ),
    {
      ...own(list, PRISM, "Spot the mistake"),
      wordsOnly: "The end's area is given to work from.",
    } as Screen,

    quiz([
      [
        [
          "Find the volume.",
          "100 cm³",
          ["200 cm³", "19 cm³"],
          "Half of 5 × 4, times 10.",
          prism("5 cm", "4 cm", "10 cm"),
          "volume",
        ],
        [
          "Find the volume.",
          "60 cm³",
          ["120 cm³", "17 cm³"],
          "Half of 4 × 3, times 10.",
          prism("4 cm", "3 cm", "10 cm"),
          "volume",
        ],
      ],
      [
        [
          "Find the area of the end.",
          "6 cm²",
          ["12 cm²", "7 cm²"],
          "Half of 4 × 3.",
          prism("4 cm", "3 cm", "8 cm"),
          "cross-section",
        ],
        [
          "Find the area of the end.",
          "10 cm²",
          ["20 cm²", "9 cm²"],
          "Half of 5 × 4.",
          prism("5 cm", "4 cm", "6 cm"),
          "cross-section",
        ],
      ],
      [
        [
          "Find the volume.",
          "60 cm³",
          ["12 cm³", "47 cm³"],
          "4 × 3 × 5.",
          box(4, 3, 5, ["4 cm", "3 cm", "5 cm"]),
          "volume",
        ],
        [
          "Find the volume.",
          "48 cm³",
          ["14 cm³", "52 cm³"],
          "4 × 6 × 2.",
          box(4, 6, 2, ["4 cm", "6 cm", "2 cm"]),
          "volume",
        ],
      ],
    ]),

    reworded(
      list,
      PRISM,
      "A tent",
      {
        tag: "Real life",
        start: "The tent is a triangular prism.",
        picture: prism("2 m", "1.5 m", "3 m"),
      },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**A prism's volume is the area of its end times its length.**"],
      prism("4 cm", "3 cm", "10 cm"),
      [
        "**A prism's volume is the area of its end times its length.**",
        "Triangle end: $\\frac12 \\times 4 \\times 3 = 6$ cm²",
        "Volume: $6 \\times 10 = 60$ cm³",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7AreaStepped: [string, UnitLesson[]][] = [
  [PERIMETER, [perimeter]],
  [TRIANGLE, [triangleArea]],
  [PARA, [paraArea]],
  [TRAP, [trapArea]],
  [CUBOID, [cuboid]],
  [PRISM, [prismVolume]],
];
