// Year 9, "Shapes, similarity and enlargement": enlarging from a centre by tapping where corners
// go, including by a half and by −1; similar shapes and their missing sides; the volume of a
// cylinder and the surface area of prisms; and a first proof, that a triangle's angles make 180°.
import type { DrawingPic, Point, Range, UnitLesson } from "./types.ts";

const range: Range = { xMin: -1, xMax: 7, yMin: -1, yMax: 7 };
const small: Point[] = [
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 1, y: 3 },
];
const scale = (ps: Point[], k: number) => ps.map((p) => ({ x: p.x * k, y: p.y * k }));

type Item = DrawingPic["items"][number];
const tri = (a: Point, b: Point, c: Point): Item[] => [
  { line: [a, b] },
  { line: [b, c] },
  { line: [c, a] },
];

// A cylinder: two ovals and two sides.
const cylinder: DrawingPic = {
  kind: "drawing",
  items: [
    { arc: { x: 0, y: 4 }, r: 2, ry: 0.6, from: 0, to: 180 },
    { arc: { x: 0, y: 4 }, r: 2, ry: 0.6, from: 180, to: 360 },
    { arc: { x: 0, y: 0 }, r: 2, ry: 0.6, from: 180, to: 360 },
    { arc: { x: 0, y: 0 }, r: 2, ry: 0.6, from: 0, to: 180, dashed: true },
    {
      line: [
        { x: -2, y: 0 },
        { x: -2, y: 4 },
      ],
    },
    {
      line: [
        { x: 2, y: 0 },
        { x: 2, y: 4 },
      ],
    },
    {
      line: [
        { x: 0, y: 4 },
        { x: 2, y: 4 },
      ],
      tone: "find",
    },
    { text: "3 cm", at: { x: 1, y: 4.45 } },
    { text: "10 cm", at: { x: 2.9, y: 2 } },
  ],
};

// A triangle, with a line through its top corner parallel to the base.
const A = { x: 0, y: 0 };
const B = { x: 6, y: 0 };
const C = { x: 2, y: 3.5 };
const proof = (extra: Item[]): DrawingPic => ({
  kind: "drawing",
  frame: { xMin: -2, xMax: 8, yMin: -0.5, yMax: 4.2 },
  items: [
    ...tri(A, B, C),
    { text: "a", at: { x: 0.85, y: 0.35 } },
    { text: "b", at: { x: 5.1, y: 0.3 } },
    { text: "c", at: { x: 2.25, y: 2.75 } },
    ...extra,
  ],
});
const parallel: Item[] = [
  {
    line: [
      { x: -2, y: 3.5 },
      { x: 8, y: 3.5 },
    ],
    tone: "find",
    arrow: 1,
  },
];

export const y9Similarity: UnitLesson = {
  unit: "y9-similarity",
  title: "Same shape, new size",
  summary: "Enlarge shapes from a centre, find missing sides, and prove an angle fact.",
  screens: [
    {
      kind: "explain",
      title: "Enlargement from a centre",
      text: [
        "An **enlargement** with scale factor 2 about (0, 0) sends every corner twice as far from (0, 0), in the same direction.",
        "Every length doubles; every angle stays the same.",
      ],
      picture: {
        kind: "graph",
        range,
        points: [{ x: 0, y: 0 }],
        shapes: [
          { points: small, label: "A" },
          { points: scale(small, 2), tone: "image", label: "B" },
        ],
      },
    },
    {
      kind: "plot",
      title: "Enlarge by scale factor 3, about (0, 0)",
      text: "Tap where each corner goes.",
      scene: {
        range: { xMin: -1, xMax: 9, yMin: -1, yMax: 9 },
        points: [{ x: 0, y: 0 }],
        shapes: [{ points: small, label: "A" }],
      },
      targets: scale(small, 3),
      join: true,
      hint: "Each corner goes three times as far from (0, 0): (1, 1) goes to (3, 3).",
      done: "Every coordinate was multiplied by 3, because the centre is (0, 0).",
    },
    {
      kind: "plot",
      title: "Enlarge by scale factor $\\frac12$, about (0, 0)",
      text: "A scale factor less than 1 makes it smaller. Tap where each corner goes.",
      scene: { range, points: [{ x: 0, y: 0 }], shapes: [{ points: scale(small, 2), label: "C" }] },
      targets: small,
      join: true,
      hint: "Each corner goes half as far from (0, 0): (2, 2) goes to (1, 1).",
      done: "Half as far from the centre, half the size: still called an enlargement.",
    },
    {
      kind: "choice",
      title: "Scale factor −1",
      text: "Each corner of A went the same distance to the other side of (0, 0). What is this?",
      picture: {
        kind: "graph",
        range: { xMin: -4, xMax: 4, yMin: -4, yMax: 4 },
        points: [{ x: 0, y: 0 }],
        shapes: [
          { points: small, label: "A" },
          { points: scale(small, -1), tone: "image", label: "B" },
        ],
      },
      options: [
        {
          text: "An enlargement, scale factor −1, about (0, 0)",
          correct: true,
          feedback:
            "A negative scale factor sends corners through the centre to the other side. Scale factor −1 is the same as a half turn.",
        },
        {
          text: "A reflection in the x-axis",
          feedback: "Then B would sit below A. It has gone through the centre.",
        },
        { text: "A translation", feedback: "B is upside down: a translation never turns a shape." },
      ],
    },
    {
      kind: "explain",
      title: "Similar shapes",
      text: [
        "Shapes are **similar** when one is an enlargement of the other: every length is multiplied by the same scale factor, and the angles match.",
      ],
      picture: {
        kind: "drawing",
        items: [
          ...tri({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }),
          ...tri({ x: 6, y: 0 }, { x: 14, y: 0 }, { x: 6, y: 6 }),
          { text: "4", at: { x: 2, y: -0.6 } },
          { text: "3", at: { x: -0.6, y: 1.5 } },
          { text: "8", at: { x: 10, y: -0.6 }, tone: "find" },
          { text: "6", at: { x: 5.4, y: 3 }, tone: "find" },
        ],
      },
    },
    {
      kind: "answer",
      title: "Find the missing side",
      text: "The two triangles are similar. The side of 4 cm matches the side of 10 cm.",
      picture: {
        kind: "drawing",
        items: [
          ...tri({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 6 }),
          ...tri({ x: 6, y: 0 }, { x: 16, y: 0 }, { x: 6, y: 15 }),
          { text: "4 cm", at: { x: 2, y: -0.7 } },
          { text: "6 cm", at: { x: -1.1, y: 3 } },
          { text: "10 cm", at: { x: 11, y: -0.7 } },
          { text: "x", at: { x: 5.3, y: 7.5 }, tone: "find" },
        ],
      },
      answers: ["15"],
      unit: "cm",
      wrong: [
        {
          answer: "12",
          feedback: "That adds 6. Similar shapes multiply: find the scale factor, $10 \\div 4$.",
        },
      ],
      hint: "The scale factor is $10 \\div 4 = 2.5$.",
      done: "$6 \\times 2.5 = 15$ cm.",
    },
    {
      kind: "explain",
      title: "A cylinder is a prism",
      text: [
        "A cylinder has the same circle all the way through, so like any prism its volume is the cross-section × the length.",
        "Volume $= \\pi r^2 h$.",
      ],
      picture: cylinder,
    },
    {
      kind: "answer",
      title: "The volume of a cylinder",
      text: "Radius 3 cm, height 10 cm. Give the volume to 1 decimal place.",
      picture: cylinder,
      answers: ["282.7"],
      unit: "cm³",
      wrong: [
        {
          answer: "94.2",
          feedback: "That is $\\pi \\times 3 \\times 10$. Square the radius first.",
        },
        { answer: "188.5", feedback: "That is the curved surface. The volume is $\\pi r^2 h$." },
      ],
      hint: "$\\pi \\times 3^2 \\times 10$.",
      done: "$\\pi \\times 9 \\times 10 = 282.7$ cm³.",
    },
    {
      kind: "answer",
      title: "Surface area of a cuboid",
      text: "Add the areas of all six faces: there are two of each rectangle.",
      picture: { kind: "cuboid", w: 5, d: 2, h: 3, labels: ["5 cm", "2 cm", "3 cm"] },
      answers: ["62"],
      unit: "cm²",
      wrong: [
        { answer: "30", feedback: "30 cm³ is the volume. The surface area adds the faces." },
        { answer: "31", feedback: "That is one of each face. There are two of each." },
      ],
      hint: "$5 \\times 3$, $5 \\times 2$ and $3 \\times 2$, each twice.",
      done: "$2(15 + 10 + 6) = 62$ cm².",
    },
    {
      kind: "answer",
      title: "Surface area of a triangular prism",
      text: "The ends are right-angled triangles with sides 3, 4 and 5 cm. The prism is 10 cm long.",
      picture: {
        kind: "drawing",
        items: [
          ...tri({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 3 }),
          {
            line: [
              { x: 4, y: 0 },
              { x: 9, y: 2 },
            ],
          },
          {
            line: [
              { x: 0, y: 3 },
              { x: 5, y: 5 },
            ],
          },
          {
            line: [
              { x: 9, y: 2 },
              { x: 5, y: 5 },
            ],
          },
          {
            line: [
              { x: 0, y: 0 },
              { x: 5, y: 2 },
            ],
            dashed: true,
            tone: "soft",
          },
          {
            line: [
              { x: 5, y: 2 },
              { x: 9, y: 2 },
            ],
            dashed: true,
            tone: "soft",
          },
          {
            line: [
              { x: 5, y: 2 },
              { x: 5, y: 5 },
            ],
            dashed: true,
            tone: "soft",
          },
          { text: "4", at: { x: 2, y: -0.6 } },
          { text: "3", at: { x: -0.6, y: 1.5 } },
          { text: "5", at: { x: 2.3, y: 1.9 } },
          { text: "10", at: { x: 7.2, y: 0.7 } },
        ],
      },
      answers: ["132"],
      unit: "cm²",
      wrong: [{ answer: "126", feedback: "Two triangle ends: $2 \\times 6 = 12$, not 6." }],
      hint: "Two triangles of $\\frac12 \\times 3 \\times 4$, and three rectangles: 3 by 10, 4 by 10 and 5 by 10.",
      done: "$12 + 30 + 40 + 50 = 132$ cm².",
    },
    {
      kind: "steps",
      title: "Prove it: a triangle's angles make 180°",
      picture: proof([]),
      start: "Take any triangle, with angles a, b and c.",
      stages: [
        {
          prompt:
            "Draw a line through the top corner, parallel to the base. The angle on it next to c equals a, because they are",
          options: [
            { text: "alternate angles", correct: true, feedback: "" },
            {
              text: "vertically opposite angles",
              feedback:
                "They are on opposite sides of a line crossing two parallel lines: a Z shape.",
            },
            { text: "corresponding angles", feedback: "Trace the Z between the parallel lines." },
          ],
          then: "The angle next to c is a (alternate angles).",
          picture: proof([...parallel, { text: "a", at: { x: 1.2, y: 3.15 }, tone: "find" }]),
        },
        {
          prompt:
            "The same way, the angle on the other side of c is b. Along the straight line, a, c and b",
          options: [
            { text: "add up to 180°", correct: true, feedback: "" },
            {
              text: "add up to 360°",
              feedback: "They sit on a straight line, not all round a point.",
            },
            { text: "are equal", feedback: "They needn't be equal: they fill a straight line." },
          ],
          then: "$a + b + c = 180°$",
          picture: proof([
            ...parallel,
            { text: "a", at: { x: 1.2, y: 3.15 }, tone: "find" },
            { text: "b", at: { x: 3.0, y: 3.15 }, tone: "find" },
          ]),
        },
      ],
      done: "That is a proof: every step uses a fact we already know, so it works for every triangle.",
    },
    {
      kind: "explain",
      title: "Same shape, new size",
      text: [
        "Enlarge from a centre: each corner goes scale factor times as far. A fraction shrinks; a negative goes through the centre.",
        "Similar shapes share a scale factor for every length.",
        "Cylinder volume $= \\pi r^2 h$; a prism's surface area adds all its faces.",
      ],
      picture: {
        kind: "graph",
        range,
        points: [{ x: 0, y: 0 }],
        shapes: [
          { points: small, label: "A" },
          { points: scale(small, 2), tone: "image", label: "B" },
        ],
      },
    },
  ],
};
