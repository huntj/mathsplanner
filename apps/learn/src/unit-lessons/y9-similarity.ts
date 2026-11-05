// Year 9, "Shapes, similarity and enlargement", as five short lessons, one just before each skill:
// the surface area of prisms (from counting faces), the volume of a cylinder (a stack of circles),
// similar shapes (multiply, never add), enlargement from a centre (by whole numbers, fractions and
// negatives), and proof with angle facts. Each starts from something quick, builds the method a
// step at a time, names the common mistakes, and ends on an exit check.
import type { DrawingPic, Point, Range, UnitLesson } from "./types.ts";

const SURFACE = "Y9-GEO-02.a";
const CYLINDER = "Y9-GEO-02.b";
const SIMILAR = "Y9-RAT-02";
const ENLARGE = "Y9-POS-01";
const PROOF = "Y9-GEO-03";

type Item = DrawingPic["items"][number];

const at = (ps: Point[], i: number): Point =>
  ps[((i % ps.length) + ps.length) % ps.length] ?? { x: 0, y: 0 };
const middle = (ps: Point[]): Point => ({
  x: ps.reduce((a, p) => a + p.x, 0) / ps.length,
  y: ps.reduce((a, p) => a + p.y, 0) / ps.length,
});

/** A polygon, its sides labelled just outside: side i runs from corner i to corner i + 1. */
function outline(ps: Point[], labels: (string | null)[] = [], find?: string): Item[] {
  const inside = middle(ps);
  return [
    ...ps.map((p, i): Item => ({ line: [p, at(ps, i + 1)] })),
    ...labels.flatMap((label, i): Item[] =>
      label
        ? [
            {
              side: [ps[i] ?? inside, at(ps, i + 1)],
              label,
              inside,
              ...(label === find ? { tone: "find" as const } : {}),
            },
          ]
        : [],
    ),
  ];
}

const rect = (x0: number, y0: number, x1: number, y1: number): Point[] => [
  { x: x0, y: y0 },
  { x: x1, y: y0 },
  { x: x1, y: y1 },
  { x: x0, y: y1 },
];

/** A triangular prism: a right-angled triangle at the front, stretched back. */
function prism(base: string, up: string, slope: string, length: string): DrawingPic {
  const front = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 0, y: 3 },
  ];
  const back = (p: Point) => ({ x: p.x + 5, y: p.y + 2 });
  return {
    kind: "drawing",
    items: [
      ...outline(front, [base, slope, up]),
      { line: [at(front, 1), back(at(front, 1))] },
      { line: [at(front, 2), back(at(front, 2))] },
      { line: [back(at(front, 1)), back(at(front, 2))] },
      { line: [at(front, 0), back(at(front, 0))], dashed: true, tone: "soft" },
      { line: [back(at(front, 0)), back(at(front, 1))], dashed: true, tone: "soft" },
      { line: [back(at(front, 0)), back(at(front, 2))], dashed: true, tone: "soft" },
      { side: [at(front, 1), back(at(front, 1))], label: length, inside: { x: 4, y: 2.5 } },
    ],
  };
}

/** A cuboid's net, each face showing its area. */
const net: DrawingPic = {
  kind: "drawing",
  items: [
    ...outline(rect(0, 0, 2, 3)),
    ...outline(rect(2, 0, 7, 3)),
    ...outline(rect(7, 0, 9, 3)),
    ...outline(rect(9, 0, 14, 3)),
    ...outline(rect(2, 3, 7, 5)),
    ...outline(rect(2, -2, 7, 0)),
    { text: "6", at: { x: 1, y: 1.5 } },
    { text: "15", at: { x: 4.5, y: 1.5 } },
    { text: "6", at: { x: 8, y: 1.5 } },
    { text: "15", at: { x: 11.5, y: 1.5 } },
    { text: "10", at: { x: 4.5, y: 4 } },
    { text: "10", at: { x: 4.5, y: -1 } },
  ],
};

/** A cylinder, with its radius (or diameter, across the top) and height labelled. */
function cylinder(across: string, height: string, diameter = false): DrawingPic {
  return {
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
          { x: diameter ? -2 : 0, y: 4 },
          { x: 2, y: 4 },
        ],
        tone: "find",
      },
      {
        side: [
          { x: diameter ? -2 : 0, y: 4 },
          { x: 2, y: 4 },
        ],
        label: across,
        inside: { x: 0.5, y: 3 },
      },
      {
        side: [
          { x: 2, y: 0 },
          { x: 2, y: 4 },
        ],
        label: height,
        inside: { x: 0, y: 2 },
      },
    ],
  };
}

/** Two similar triangles side by side, the big one k times the small. */
function similar(
  k: number,
  small: [string | null, string | null],
  big: [string | null, string | null],
  find = "x",
  h = 3,
): DrawingPic {
  const a = [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 0, y: h },
  ];
  const b = a.map((p) => ({ x: 6 + p.x * k, y: p.y * k }));
  return {
    kind: "drawing",
    items: [
      ...outline(a, [small[0], null, small[1]], find),
      ...outline(b, [big[0], null, big[1]], find),
    ],
  };
}

/** A post and a tree with their shadows: similar triangles. */
const shadows: DrawingPic = {
  kind: "drawing",
  items: [
    {
      line: [
        { x: -1, y: 0 },
        { x: 22, y: 0 },
      ],
      tone: "soft",
    },
    {
      line: [
        { x: 0, y: 0 },
        { x: 0, y: 2 },
      ],
    },
    {
      line: [
        { x: 0, y: 2 },
        { x: 3, y: 0 },
      ],
      dashed: true,
      tone: "soft",
    },
    {
      side: [
        { x: 0, y: 0 },
        { x: 0, y: 2 },
      ],
      label: "2 m",
      inside: { x: 1, y: 0.5 },
    },
    {
      side: [
        { x: 0, y: 0 },
        { x: 3, y: 0 },
      ],
      label: "3 m",
      inside: { x: 1, y: 0.5 },
    },
    {
      line: [
        { x: 6, y: 0 },
        { x: 6, y: 10 },
      ],
      tone: "find",
    },
    {
      line: [
        { x: 6, y: 10 },
        { x: 21, y: 0 },
      ],
      dashed: true,
      tone: "soft",
    },
    {
      side: [
        { x: 6, y: 0 },
        { x: 6, y: 10 },
      ],
      label: "?",
      inside: { x: 10, y: 3 },
      tone: "find",
    },
    {
      side: [
        { x: 6, y: 0 },
        { x: 21, y: 0 },
      ],
      label: "15 m",
      inside: { x: 10, y: 3 },
    },
  ],
};

const range: Range = { xMin: -1, xMax: 7, yMin: -1, yMax: 7 };
const small: Point[] = [
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 1, y: 3 },
];
const slide: Point[] = [
  { x: 1, y: 1 },
  { x: 2, y: 1 },
  { x: 2, y: 2 },
];
const scale = (ps: Point[], k: number) => ps.map((p) => ({ x: p.x * k, y: p.y * k }));

/**
 * Two parallel lines crossed by a third at t°, with angles marked where it crosses: "low" on the
 * bottom line, "high" on the top one; each angle runs from one direction to the next.
 */
function parallels(
  t: number,
  marks: { on: "low" | "high"; from: number; to: number; label: string }[],
): DrawingPic {
  const rad = (d: number) => (d * Math.PI) / 180;
  const low = { x: 3, y: 0 };
  const high = { x: Math.round((3 + 3 / Math.tan(rad(t))) * 100) / 100, y: 3 };
  const go = (p: Point, d: number) => ({
    x: Math.round((p.x + d * Math.cos(rad(t))) * 100) / 100,
    y: Math.round((p.y + d * Math.sin(rad(t))) * 100) / 100,
  });
  return {
    kind: "drawing",
    items: [
      {
        line: [
          { x: -1, y: 0 },
          { x: 9, y: 0 },
        ],
        arrow: 1,
      },
      {
        line: [
          { x: -1, y: 3 },
          { x: 9, y: 3 },
        ],
        arrow: 1,
      },
      { line: [go(low, -1.6), go(high, 1.6)] },
      ...marks.map((m): Item => ({
        angle: m.on === "low" ? low : high,
        from: m.from,
        to: m.to,
        label: m.label,
      })),
    ],
  };
}
// The four angles at a crossing, for a line at t°.
const rightAbove = (t: number) => ({ from: 0, to: t });
const leftAbove = (t: number) => ({ from: t, to: 180 });
const leftBelow = (t: number) => ({ from: 180, to: 180 + t });
const rightBelow = (t: number) => ({ from: 180 + t, to: 360 });

// A triangle, with a line through its top corner parallel to the base, for the proof.
const A = { x: 0, y: 0 };
const B = { x: 6, y: 0 };
const C = { x: 2, y: 3.5 };
const proof = (extra: Item[]): DrawingPic => ({
  kind: "drawing",
  frame: { xMin: -2, xMax: 8, yMin: -0.5, yMax: 4.2 },
  items: [
    ...outline([A, B, C]),
    { angle: A, from: 0, to: 60.26, label: "a" },
    { angle: B, from: 138.81, to: 180, label: "b" },
    { angle: C, from: 240.26, to: 318.81, label: "c" },
    ...extra,
  ],
});
const through: Item = {
  line: [
    { x: -2, y: 3.5 },
    { x: 8, y: 3.5 },
  ],
  tone: "find",
  arrow: 1,
};

export const y9Similarity: UnitLesson[] = [
  {
    unit: "y9-similarity",
    id: "y9-similarity/surface-area",
    before: SURFACE,
    title: "Wrapping a prism",
    summary: "Add up the area of every face: the surface area.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How much card?",
        text: [
          "A chocolate box is a triangular prism. Its ends are triangles with sides 3, 4 and 5 cm, and it's 10 cm long.",
          "How much card does it take to make? By the end of this lesson, you can work it out.",
        ],
        picture: prism("4 cm", "3 cm", "5 cm", "10 cm"),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "The area of a 5 cm by 3 cm rectangle",
        answers: ["15"],
        unit: "cm²",
        wrong: [{ answer: "16", feedback: "That's the perimeter. Area is length × width." }],
        hint: "$5 \\times 3$.",
        done: "$5 \\times 3 = 15$ cm².",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "The area of a triangle, base 4 cm, height 3 cm",
        answers: ["6"],
        unit: "cm²",
        wrong: [{ answer: "12", feedback: "Half of base × height: halve 12." }],
        hint: "$\\frac12 \\times 4 \\times 3$.",
        done: "$\\frac12 \\times 4 \\times 3 = 6$ cm².",
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "How many faces does a cuboid have?",
        picture: { kind: "cuboid", w: 5, d: 2, h: 3, labels: ["5 cm", "2 cm", "3 cm"] },
        answers: ["6"],
        wrong: [
          {
            answer: "3",
            feedback:
              "You can see three. There are three more hidden at the back, bottom and other side.",
          },
        ],
        hint: "Front and back, top and bottom, two sides.",
        done: "Six faces, in three matching pairs.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Unfold it",
        text: [
          "Unfold a cuboid and you get its **net**: six rectangles. The total area of the net is the **surface area**.",
          "Here: two of 15, two of 10 and two of 6. $30 + 20 + 12 = 62$ cm².",
        ],
        picture: net,
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A cuboid, a pair at a time",
        picture: { kind: "cuboid", w: 5, d: 2, h: 3, labels: ["5 cm", "2 cm", "3 cm"] },
        problem: "Find the surface area of a 5 cm by 2 cm by 3 cm cuboid.",
        steps: [
          { line: "Front and back: $2 \\times (5 \\times 3) = 30$", why: "Two matching faces." },
          { line: "Top and bottom: $2 \\times (5 \\times 2) = 20$", why: "Two more." },
          { line: "Sides: $2 \\times (2 \\times 3) = 12$", why: "And the last pair." },
          { line: "$30 + 20 + 12 = 62$ cm²", why: "Add them all." },
        ],
        done: "62 cm². Area is in square units: cm².",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A 4 cm by 3 cm by 2 cm cuboid",
        picture: { kind: "cuboid", w: 4, d: 3, h: 2, labels: ["4 cm", "3 cm", "2 cm"] },
        start: "Find the surface area.",
        stages: [
          {
            prompt: "Front and back, 4 by 2:",
            options: [
              { text: "$2 \\times 8 = 16$", correct: true, feedback: "" },
              { text: "$8$", feedback: "There are two of them, front and back." },
            ],
            then: "Front and back: 16",
          },
          {
            prompt: "Top and bottom, 4 by 3:",
            options: [
              { text: "$2 \\times 12 = 24$", correct: true, feedback: "" },
              { text: "$12$", feedback: "There are two, top and bottom." },
            ],
            then: "Top and bottom: 24",
          },
          {
            prompt: "Sides, 3 by 2, then the total:",
            options: [
              { text: "$12$, so $16 + 24 + 12 = 52$ cm²", correct: true, feedback: "" },
              {
                text: "$4 \\times 3 \\times 2 = 24$ cm²",
                feedback: "That's the volume, in cm³. Surface area adds the faces.",
              },
            ],
            then: "$52$ cm²",
          },
        ],
        done: "Three pairs of faces, added.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A triangular prism",
        picture: prism("8 cm", "6 cm", "10 cm", "5 cm"),
        start: "The ends are right-angled triangles, 6, 8 and 10 cm. It is 5 cm long.",
        stages: [
          {
            prompt: "The two triangle ends:",
            options: [
              {
                text: "$2 \\times \\frac12 \\times 8 \\times 6 = 48$",
                correct: true,
                feedback: "",
              },
              { text: "$\\frac12 \\times 8 \\times 6 = 24$", feedback: "There are two ends." },
            ],
            then: "Ends: 48",
          },
          {
            prompt: "The rectangles: one for each side of the triangle.",
            options: [
              {
                text: "$8 \\times 5 + 6 \\times 5 + 10 \\times 5 = 120$",
                correct: true,
                feedback: "",
              },
              {
                text: "$8 \\times 5 + 6 \\times 5 = 70$",
                feedback: "There are three rectangles: the sloping side has one too.",
              },
            ],
            then: "Rectangles: 120",
          },
          {
            prompt: "Surface area:",
            options: [
              { text: "$168$ cm²", correct: true, feedback: "" },
              { text: "$120$ cm²", feedback: "Add the two ends too." },
            ],
            then: "$48 + 120 = 168$ cm²",
          },
        ],
        done: "Two ends, plus a rectangle for every side of the end.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A cube with sides of 4 cm",
        picture: { kind: "cuboid", w: 4, d: 4, h: 4, labels: ["4 cm", "4 cm", "4 cm"] },
        answers: ["96"],
        unit: "cm²",
        wrong: [
          { answer: "64", feedback: "64 cm³ is the volume. Add up the six faces." },
          { answer: "16", feedback: "That's one face. A cube has six." },
        ],
        hint: "Six faces, each $4 \\times 4$.",
        done: "$6 \\times 16 = 96$ cm².",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A 6 cm by 5 cm by 2 cm cuboid",
        picture: { kind: "cuboid", w: 6, d: 5, h: 2, labels: ["6 cm", "5 cm", "2 cm"] },
        answers: ["104"],
        unit: "cm²",
        wrong: [
          { answer: "52", feedback: "That's one of each face. There are two of each." },
          { answer: "60", feedback: "60 cm³ is the volume." },
        ],
        hint: "$6 \\times 5$, $6 \\times 2$ and $5 \\times 2$, each twice.",
        done: "$2(30 + 12 + 10) = 104$ cm².",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Ben says the 5 by 2 by 3 cuboid has a surface area of 30 cm². Is he right?",
        options: [
          {
            text: "No: 30 is its volume, in cm³",
            correct: true,
            feedback:
              "$5 \\times 2 \\times 3$ is the space inside. The surface area adds the faces: 62 cm². Mixing them up is common.",
          },
          {
            text: "Yes",
            feedback: "$5 \\times 2 \\times 3 = 30$ is the volume. The faces add to 62 cm².",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Tia finds the surface area of a prism whose ends are triangles with sides 5, 12 and 13 cm, and 4 cm long.",
        lines: [
          "Two ends: $2 \\times \\frac12 \\times 5 \\times 12 = 60$",
          "Rectangles: $5 \\times 4 + 12 \\times 4 = 68$",
          "Total: $60 + 68 = 128$ cm²",
        ],
        wrong: 1,
        why: "There are three rectangles, one for each side: add $13 \\times 4 = 52$ too. The total is $60 + 120 = 180$ cm².",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "How much card?",
        text: "The ends are 3, 4, 5 cm triangles; the box is 10 cm long.",
        picture: prism("4 cm", "3 cm", "5 cm", "10 cm"),
        answers: ["132"],
        unit: "cm²",
        wrong: [
          { answer: "126", feedback: "Two triangle ends: $2 \\times 6 = 12$." },
          { answer: "82", feedback: "Three rectangles: the 5 cm side has one too." },
        ],
        hint: "Two triangles of 6 cm², and rectangles of 3 by 10, 4 by 10 and 5 by 10.",
        done: "$12 + 30 + 40 + 50 = 132$ cm² of card.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Find the surface area of a cube with sides of 3 cm.",
            answers: ["54"],
            unit: "cm²",
            why: "$6 \\times 9 = 54$.",
            retry: {
              prompt: "Find the surface area of a cube with sides of 5 cm.",
              answers: ["150"],
              unit: "cm²",
              why: "$6 \\times 25 = 150$.",
            },
          },
          {
            prompt: "Find the surface area of a 4 cm by 2 cm by 1 cm cuboid.",
            answers: ["28"],
            unit: "cm²",
            why: "$2(8 + 4 + 2) = 28$.",
            retry: {
              prompt: "Find the surface area of a 5 cm by 3 cm by 1 cm cuboid.",
              answers: ["46"],
              unit: "cm²",
              why: "$2(15 + 5 + 3) = 46$.",
            },
          },
          {
            prompt: "How many rectangular faces does a triangular prism have?",
            options: ["3", "2", "5"],
            answers: ["3"],
            why: "One for each side of the triangle.",
            retry: {
              prompt: "How many faces does a triangular prism have altogether?",
              options: ["5", "6", "3"],
              answers: ["5"],
              why: "Two triangles and three rectangles.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-similarity",
    id: "y9-similarity/cylinder",
    before: CYLINDER,
    title: "Filling a cylinder",
    summary: "A cylinder is a stack of circles: area of the circle × height.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Will it fit?",
        text: [
          "A tin is a cylinder with a radius of 3.7 cm and a height of 11 cm.",
          "Will 400 cm³ of soup fit inside? By the end of this lesson, you can check.",
        ],
        picture: cylinder("3.7 cm", "11 cm"),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "The area of a circle with radius 3 cm",
        options: [
          {
            text: "$9\\pi$ cm²",
            correct: true,
            feedback: "$\\pi r^2 = \\pi \\times 3^2 = 9\\pi$.",
          },
          {
            text: "$6\\pi$ cm²",
            feedback: "That's $2\\pi r$, the circumference. Area is $\\pi r^2$.",
          },
          { text: "$3\\pi$ cm²", feedback: "Square the radius: $3^2 = 9$." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A prism's volume",
        text: "A prism's cross-section has an area of 12 cm², and it is 5 cm long. What is its volume?",
        answers: ["60"],
        unit: "cm³",
        hint: "Volume of a prism = area of cross-section × length.",
        done: "$12 \\times 5 = 60$ cm³.",
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "A stack of coins",
        text: "Each layer of a cylinder is a circle. Say each layer has an area of 30 cm² and is 1 cm thick. What is the volume of 8 layers?",
        answers: ["240"],
        unit: "cm³",
        hint: "Each layer is 30 cm³.",
        done: "$30 \\times 8 = 240$ cm³: the circle's area × the height.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A cylinder is a prism",
        text: [
          "It has the same circle all the way through, so like any prism, its volume is the cross-section × the height.",
          "The cross-section is a circle, area $\\pi r^2$, so the volume is $\\pi r^2 h$.",
        ],
        picture: cylinder("r", "h"),
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Radius 3 cm, height 10 cm",
        picture: cylinder("3 cm", "10 cm"),
        problem: "Find the volume, to 1 decimal place.",
        steps: [
          {
            line: "Area of the circle: $\\pi \\times 3^2 = 28.27$ cm²",
            why: "Square the radius first, then times π.",
          },
          { line: "Volume: $28.27 \\times 10 = 282.7$ cm³", why: "Times the height." },
        ],
        done: "282.7 cm³. Volume is in cubic units: cm³.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Radius 4 cm, height 5 cm",
        picture: cylinder("4 cm", "5 cm"),
        start: "Find the volume, to 1 decimal place.",
        stages: [
          {
            prompt: "The area of the circle:",
            options: [
              { text: "$\\pi \\times 4^2 = 50.27$ cm²", correct: true, feedback: "" },
              { text: "$\\pi \\times 4 = 12.57$ cm²", feedback: "Square the radius: $4^2 = 16$." },
              {
                text: "$\\pi \\times 8 = 25.13$ cm²",
                feedback: "That doubles the radius. Square it: $4 \\times 4$.",
              },
            ],
            then: "$50.27$ cm²",
          },
          {
            prompt: "The volume:",
            options: [
              { text: "$50.27 \\times 5 = 251.3$ cm³", correct: true, feedback: "" },
              {
                text: "$50.27 + 5 = 55.3$ cm³",
                feedback: "Multiply by the height: it's a stack of 5 layers.",
              },
            ],
            then: "$251.3$ cm³",
          },
        ],
        done: "Area of the circle, times the height.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Diameter 10 cm, height 6 cm",
        picture: cylinder("10 cm", "6 cm", true),
        start: "Find the volume, to 1 decimal place.",
        stages: [
          {
            prompt: "The radius is",
            options: [
              { text: "5 cm", correct: true, feedback: "" },
              {
                text: "10 cm",
                feedback: "10 cm goes right across: that's the diameter. Halve it.",
              },
            ],
            then: "$r = 5$",
          },
          {
            prompt: "The area of the circle:",
            options: [
              { text: "$\\pi \\times 5^2 = 78.54$ cm²", correct: true, feedback: "" },
              {
                text: "$\\pi \\times 10^2 = 314.16$ cm²",
                feedback: "Use the radius, 5, not the diameter.",
              },
            ],
            then: "$78.54$ cm²",
          },
          {
            prompt: "The volume:",
            options: [
              { text: "$78.54 \\times 6 = 471.2$ cm³", correct: true, feedback: "" },
              { text: "$78.54 \\times 3 = 235.6$ cm³", feedback: "Use the whole height, 6." },
            ],
            then: "$471.2$ cm³",
          },
        ],
        done: "Check whether you've been given the radius or the diameter.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Radius 5 cm, height 8 cm",
        text: "Find the volume, to 1 decimal place.",
        picture: cylinder("5 cm", "8 cm"),
        answers: ["628.3"],
        unit: "cm³",
        wrong: [
          {
            answer: "125.7",
            feedback: "That's $\\pi \\times 5 \\times 8$. Square the radius first.",
          },
        ],
        hint: "$\\pi \\times 5^2 \\times 8$.",
        done: "$\\pi \\times 25 \\times 8 = 628.3$ cm³.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Diameter 8 cm, height 12 cm",
        text: "Find the volume, to 1 decimal place.",
        picture: cylinder("8 cm", "12 cm", true),
        answers: ["603.2"],
        unit: "cm³",
        wrong: [{ answer: "2412.7", feedback: "8 cm is the diameter. The radius is 4." }],
        hint: "The radius is 4 cm: $\\pi \\times 4^2 \\times 12$.",
        done: "$\\pi \\times 16 \\times 12 = 603.2$ cm³.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Max finds the volume with $r = 3$ and $h = 10$ as $\\pi \\times 6 \\times 10 = 188.5$. What went wrong?",
        options: [
          {
            text: "He doubled the radius instead of squaring it",
            correct: true,
            feedback:
              "$r^2$ is $3 \\times 3 = 9$, not $3 \\times 2$. The volume is $\\pi \\times 9 \\times 10 = 282.7$ cm³.",
          },
          { text: "Nothing: it's right", feedback: "$3^2$ means $3 \\times 3 = 9$, not 6." },
          {
            text: "He should have added the height",
            feedback: "Multiplying by the height is right. Look at $r^2$.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ella finds the volume of a cylinder 10 cm across and 4 cm tall.",
        picture: cylinder("10 cm", "4 cm", true),
        lines: ["$V = \\pi r^2 h$", "$V = \\pi \\times 10^2 \\times 4$", "$V = 1256.6$ cm³"],
        wrong: 1,
        why: "10 cm is the diameter. The radius is 5: $\\pi \\times 25 \\times 4 = 314.2$ cm³.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Will it fit?",
        text: "Radius 3.7 cm, height 11 cm. Find the volume of the tin, to 1 decimal place.",
        picture: cylinder("3.7 cm", "11 cm"),
        answers: ["473.1", "473"],
        unit: "cm³",
        wrong: [{ answer: "127.9", feedback: "Square the radius: $3.7^2 = 13.69$." }],
        hint: "$\\pi \\times 3.7^2 \\times 11$.",
        done: "$\\pi \\times 13.69 \\times 11 = 473.1$ cm³: plenty of room for 400 cm³.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt:
              "A cylinder has radius 2 cm and height 10 cm. Find its volume, to 1 decimal place.",
            answers: ["125.7"],
            unit: "cm³",
            why: "$\\pi \\times 4 \\times 10 = 125.7$.",
            retry: {
              prompt:
                "A cylinder has radius 3 cm and height 5 cm. Find its volume, to 1 decimal place.",
              answers: ["141.4"],
              unit: "cm³",
              why: "$\\pi \\times 9 \\times 5 = 141.4$.",
            },
          },
          {
            prompt: "A cylinder is 4 cm across and 7 cm tall. Find its volume, to 1 decimal place.",
            answers: ["88.0", "88"],
            unit: "cm³",
            why: "The radius is 2: $\\pi \\times 4 \\times 7 = 88.0$.",
            retry: {
              prompt:
                "A cylinder is 10 cm across and 3 cm tall. Find its volume, to 1 decimal place.",
              answers: ["235.6"],
              unit: "cm³",
              why: "The radius is 5: $\\pi \\times 25 \\times 3 = 235.6$.",
            },
          },
          {
            prompt: "Which is the volume of a cylinder?",
            options: ["$\\pi r^2 h$", "$2\\pi r h$", "$\\pi d^2 h$"],
            answers: ["$\\pi r^2 h$"],
            why: "Area of the circle, $\\pi r^2$, times the height.",
            retry: {
              prompt: "A cylinder's radius doubles, and its height stays the same. Its volume",
              options: ["is 4 times as big", "doubles", "stays the same"],
              answers: ["is 4 times as big"],
              why: "The radius is squared: $2^2 = 4$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-similarity",
    id: "y9-similarity/similar-shapes",
    before: SIMILAR,
    title: "Similar shapes",
    summary: "Same shape, different size: every length times the same scale factor.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How tall is the tree?",
        text: [
          "A 2 m post casts a 3 m shadow. At the same moment, a tree casts a 15 m shadow.",
          "How tall is the tree? By the end of this lesson, you can find it without climbing.",
        ],
        picture: shadows,
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What do you multiply 4 by to get 12?",
        answers: ["3"],
        wrong: [{ answer: "8", feedback: "That's what you add. What do you multiply by?" }],
        hint: "$12 \\div 4$.",
        done: "$4 \\times 3 = 12$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What do you multiply 4 by to get 10?",
        answers: ["2.5"],
        hint: "$10 \\div 4$.",
        done: "$10 \\div 4 = 2.5$, and $4 \\times 2.5 = 10$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Same shape, different size",
        text: [
          "Shapes are **similar** when one is an enlargement of the other: every length is multiplied by the same **scale factor**, and the angles stay the same.",
          "Here every side is doubled: the scale factor is 2.",
        ],
        picture: similar(2, ["4 cm", "3 cm"], ["8 cm", "6 cm"], ""),
      },
      {
        kind: "sort",
        tag: "Discover",
        title: "Similar to a 2 cm by 3 cm rectangle?",
        groups: ["Similar", "Not similar"],
        items: [
          { text: "4 cm by 6 cm", group: 0, why: "Both sides × 2." },
          { text: "6 cm by 9 cm", group: 0, why: "Both sides × 3." },
          { text: "1 cm by 1.5 cm", group: 0, why: "Both sides × ½." },
          {
            text: "3 cm by 4 cm",
            group: 1,
            why: "That adds 1 to each side. 2 × 1.5 = 3 but 3 × 1.5 = 4.5, not 4.",
          },
          { text: "4 cm by 5 cm", group: 1, why: "That adds 2. Similar shapes multiply." },
          { text: "2 cm by 6 cm", group: 1, why: "Only one side changed." },
        ],
        done: "Similar shapes multiply every side by the same number. Adding the same amount doesn't keep the shape.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Find the missing side",
        picture: similar(2.5, ["4 cm", "6 cm"], ["10 cm", "x"], "x", 6),
        problem: "The triangles are similar. The 4 cm side matches the 10 cm side. Find x.",
        steps: [
          {
            line: "Scale factor $= 10 \\div 4 = 2.5$",
            why: "New ÷ old, for a pair of matching sides.",
          },
          {
            line: "$x = 6 \\times 2.5 = 15$ cm",
            why: "Every side is multiplied by the same scale factor.",
          },
        ],
        done: "15 cm. Check: the big triangle is bigger, and 15 > 6 ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Similar rectangles",
        start: "A 3 cm by 5 cm rectangle is similar to a 6 cm by $x$ cm one.",
        stages: [
          {
            prompt: "The scale factor, from the 3 and the 6:",
            options: [
              { text: "$6 \\div 3 = 2$", correct: true, feedback: "" },
              {
                text: "$6 - 3 = 3$",
                feedback: "Similar shapes multiply: how many times bigger, not how much bigger.",
              },
            ],
            then: "Scale factor 2",
          },
          {
            prompt: "So x is",
            options: [
              { text: "$5 \\times 2 = 10$ cm", correct: true, feedback: "" },
              { text: "$5 + 3 = 8$ cm", feedback: "Multiply by the scale factor; don't add." },
            ],
            then: "$x = 10$ cm",
          },
        ],
        done: "Scale factor, then multiply.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Going smaller",
        picture: similar(2 / 3, ["12 cm", "9 cm"], ["8 cm", "x"]),
        start: "The triangles are similar: 12 cm matches 8 cm. Find x.",
        stages: [
          {
            prompt: "The scale factor, from big to small:",
            options: [
              { text: "$8 \\div 12 = \\frac23$", correct: true, feedback: "" },
              {
                text: "$12 \\div 8 = 1.5$",
                feedback: "That goes from small to big. We want new ÷ old: $8 \\div 12$.",
              },
              {
                text: "$12 - 8 = 4$",
                feedback: "Similar shapes multiply. Divide to find the scale factor.",
              },
            ],
            then: "Scale factor $\\frac23$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "$9 \\times \\frac23 = 6$ cm", correct: true, feedback: "" },
              {
                text: "$9 \\times 1.5 = 13.5$ cm",
                feedback: "The new shape is smaller, so x is less than 9.",
              },
            ],
            then: "$x = 6$ cm",
          },
        ],
        done: "A scale factor less than 1 makes it smaller.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find x",
        text: "Similar triangles: the 5 cm side matches 15 cm. The 4 cm side matches x.",
        picture: similar(3, ["5 cm", "4 cm"], ["15 cm", "x"], "x", 3.2),
        answers: ["12"],
        unit: "cm",
        wrong: [
          { answer: "14", feedback: "That adds 10. Multiply by the scale factor, $15 \\div 5$." },
        ],
        hint: "Scale factor $15 \\div 5 = 3$.",
        done: "$4 \\times 3 = 12$ cm.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find x",
        text: "Similar shapes: 6 cm matches 9 cm, and 10 cm matches x.",
        answers: ["15"],
        unit: "cm",
        wrong: [
          { answer: "13", feedback: "That adds 3. Multiply by the scale factor, $9 \\div 6$." },
        ],
        hint: "Scale factor $9 \\div 6 = 1.5$.",
        done: "$10 \\times 1.5 = 15$ cm.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Rectangles of 2 cm by 5 cm and 6 cm by ? are similar. Ali adds 4 to get 9 cm. Is he right?",
        options: [
          {
            text: "No: 2 was multiplied by 3, so $5 \\times 3 = 15$ cm",
            correct: true,
            feedback: "Adding the same amount is the classic slip. Similar shapes multiply.",
          },
          {
            text: "Yes: add the same to each side",
            feedback: "A 6 by 9 rectangle is a different shape. Multiply: $5 \\times 3$.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Similar triangles: the small one has sides 4 cm and 10 cm; on the big one, 6 cm matches the 4 cm. Sam finds x, matching 10 cm.",
        lines: [
          "The 4 cm side matches the 6 cm side",
          "Scale factor: $4 \\div 6 = 0.67$",
          "$x = 10 \\times 0.67 = 6.7$ cm",
        ],
        wrong: 1,
        why: "New ÷ old: $6 \\div 4 = 1.5$. The big triangle's side must be longer: $x = 10 \\times 1.5 = 15$ cm.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "How tall is the tree?",
        picture: shadows,
        start:
          "The post and its shadow make a triangle; so do the tree and its shadow. The sun's rays meet both at the same angle, so they are similar.",
        stages: [
          {
            prompt: "The scale factor, from the shadows:",
            options: [
              { text: "$15 \\div 3 = 5$", correct: true, feedback: "" },
              { text: "$15 - 3 = 12$", feedback: "Multiply, not add: $15 \\div 3$." },
            ],
            then: "Scale factor 5",
          },
          {
            prompt: "So the tree is",
            options: [
              { text: "$2 \\times 5 = 10$ m tall", correct: true, feedback: "" },
              { text: "$2 + 12 = 14$ m tall", feedback: "Multiply by the scale factor." },
            ],
            then: "10 m",
          },
        ],
        done: "The tree is 10 m tall, worked out from its shadow.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Similar shapes: 3 cm matches 9 cm, and 5 cm matches x. Find x.",
            answers: ["15"],
            unit: "cm",
            why: "Scale factor 3: $5 \\times 3 = 15$.",
            retry: {
              prompt: "Similar shapes: 2 cm matches 8 cm, and 7 cm matches x. Find x.",
              answers: ["28"],
              unit: "cm",
              why: "Scale factor 4: $7 \\times 4 = 28$.",
            },
          },
          {
            prompt: "Similar shapes: 10 cm matches 4 cm, and 15 cm matches x. Find x.",
            answers: ["6"],
            unit: "cm",
            why: "Scale factor $4 \\div 10 = 0.4$: $15 \\times 0.4 = 6$.",
            retry: {
              prompt: "Similar shapes: 12 cm matches 3 cm, and 20 cm matches x. Find x.",
              answers: ["5"],
              unit: "cm",
              why: "Scale factor $3 \\div 12 = 0.25$: $20 \\times 0.25 = 5$.",
            },
          },
          {
            prompt: "Which rectangle is similar to one 4 cm by 6 cm?",
            options: ["6 cm by 9 cm", "6 cm by 8 cm", "5 cm by 7 cm"],
            answers: ["6 cm by 9 cm"],
            why: "Both sides × 1.5.",
            retry: {
              prompt: "Which rectangle is similar to one 2 cm by 5 cm?",
              options: ["4 cm by 10 cm", "3 cm by 6 cm", "4 cm by 7 cm"],
              answers: ["4 cm by 10 cm"],
              why: "Both sides × 2.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-similarity",
    id: "y9-similarity/enlargement",
    before: ENLARGE,
    title: "Enlargement",
    summary: "Enlarge from a centre: by whole numbers, by fractions, and through the centre.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The projector",
        text: [
          "A projector's lamp is at (0, 0). It throws an image of a slide onto the wall, three times as big, every corner three times as far from the lamp.",
          "Where does each corner land? By the end of this lesson, you can plot it.",
        ],
        picture: {
          kind: "graph",
          range,
          points: [{ x: 0, y: 0 }],
          shapes: [{ points: slide, label: "slide" }],
        },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Double both numbers in (2, 3)",
        options: [
          { text: "(4, 6)", correct: true, feedback: "$2 \\times 2 = 4$ and $3 \\times 2 = 6$." },
          { text: "(4, 3)", feedback: "Double both numbers." },
          { text: "(4, 5)", feedback: "Double, don't add 2: $3 \\times 2 = 6$." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title:
          "A triangle's sides are 2, 3 and 4 cm. Every side doubles. How long is the longest side now?",
        answers: ["8"],
        unit: "cm",
        hint: "$4 \\times 2$.",
        done: "$4 \\times 2 = 8$ cm.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Enlargement from a centre",
        text: [
          "An **enlargement** with scale factor 2 about (0, 0) sends every corner twice as far from (0, 0), in the same direction.",
          "Every length doubles; every angle stays the same. From (0, 0), that just doubles the coordinates.",
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
        tag: "Discover",
        title: "Enlarge by scale factor 2, about (0, 0)",
        text: "Tap where each corner goes.",
        scene: { range, points: [{ x: 0, y: 0 }], shapes: [{ points: slide, label: "A" }] },
        targets: scale(slide, 2),
        join: true,
        hint: "Twice as far from (0, 0): (1, 1) goes to (2, 2).",
        done: "Every coordinate doubled.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Scale factor 3",
        problem:
          "Enlarge the triangle with corners (1, 1), (2, 1) and (1, 3) by scale factor 3, about (0, 0).",
        steps: [
          {
            line: "(1, 1) → (3, 3)",
            why: "3 times as far from (0, 0): times each coordinate by 3.",
          },
          { line: "(2, 1) → (6, 3)", why: "The same for each corner." },
          { line: "(1, 3) → (3, 9)", why: "And the last." },
        ],
        done: "Every side is now 3 times as long; the angles haven't changed.",
      },
      {
        kind: "plot",
        tag: "Together",
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
        tag: "Together",
        title: "Enlarge by scale factor $\\frac12$, about (0, 0)",
        text: "A scale factor less than 1 makes it smaller. Tap where each corner goes.",
        scene: {
          range,
          points: [{ x: 0, y: 0 }],
          shapes: [{ points: scale(small, 2), label: "C" }],
        },
        targets: small,
        join: true,
        hint: "Each corner goes half as far from (0, 0): (2, 2) goes to (1, 1).",
        done: "Half as far from the centre, half the size: still called an enlargement.",
      },
      {
        kind: "choice",
        tag: "Discover",
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
            feedback: "Then B would sit just below A. It has gone through the centre.",
          },
          {
            text: "A translation",
            feedback: "B is upside down: a translation never turns a shape.",
          },
        ],
      },
      {
        kind: "plot",
        tag: "Your turn",
        title: "Enlarge by scale factor −1, about (0, 0)",
        text: "Through the centre and out the same distance on the other side.",
        scene: {
          range: { xMin: -4, xMax: 4, yMin: -4, yMax: 4 },
          points: [{ x: 0, y: 0 }],
          shapes: [{ points: slide, label: "A" }],
        },
        targets: scale(slide, -1),
        join: true,
        hint: "Both coordinates change sign: (2, 1) goes to (−2, −1).",
        done: "Every coordinate changed sign: upside down, through the centre.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "What scale factor takes B to A?",
        picture: {
          kind: "graph",
          range,
          points: [{ x: 0, y: 0 }],
          shapes: [
            { points: scale(small, 2), label: "B" },
            { points: small, tone: "image", label: "A" },
          ],
        },
        options: [
          {
            text: "$\\frac12$",
            correct: true,
            feedback: "A is half the size, half as far from (0, 0).",
          },
          { text: "2", feedback: "That takes A to B. From B to A it gets smaller." },
          { text: "−2", feedback: "A negative would send it through (0, 0)." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "An enlargement with scale factor $\\frac12$ makes a shape",
        options: [
          {
            text: "smaller: half the size",
            correct: true,
            feedback:
              "It's still called an enlargement, even though it shrinks. That surprises a lot of people.",
          },
          { text: "bigger", feedback: "Times by a half: every length halves." },
          {
            text: "the same size",
            feedback: "Scale factor 1 keeps it the same. $\\frac12$ halves it.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Kai enlarges the corner (3, 1) by scale factor 2, about (0, 0).",
        lines: [
          "(3, 1) is 3 right and 1 up from (0, 0)",
          "Scale factor 2: add 2 to each",
          "So (3, 1) goes to (5, 3)",
        ],
        wrong: 1,
        why: "A scale factor multiplies the distances: 6 right and 2 up, so (6, 2).",
      },
      {
        kind: "plot",
        tag: "Back to the problem",
        title: "The projector",
        text: "The lamp is at (0, 0) and the scale factor is 3. Tap where each corner of the slide lands.",
        scene: {
          range: { xMin: -1, xMax: 7, yMin: -1, yMax: 7 },
          points: [{ x: 0, y: 0 }],
          shapes: [{ points: slide, label: "slide" }],
        },
        targets: scale(slide, 3),
        join: true,
        hint: "Three times as far from the lamp: (1, 1) goes to (3, 3).",
        done: "The image is 3 times as wide and 3 times as tall.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "(2, 5) is enlarged by scale factor 3 about (0, 0). Where does it go?",
            options: ["(6, 15)", "(5, 8)", "(6, 5)"],
            answers: ["(6, 15)"],
            why: "Times both by 3.",
            retry: {
              prompt: "(4, 1) is enlarged by scale factor 2 about (0, 0). Where does it go?",
              options: ["(8, 2)", "(6, 3)", "(8, 1)"],
              answers: ["(8, 2)"],
              why: "Times both by 2.",
            },
          },
          {
            prompt: "(6, 4) is enlarged by scale factor $\\frac12$ about (0, 0). Where does it go?",
            options: ["(3, 2)", "(12, 8)", "(5.5, 3.5)"],
            answers: ["(3, 2)"],
            why: "Halve both.",
            retry: {
              prompt:
                "(8, 2) is enlarged by scale factor $\\frac12$ about (0, 0). Where does it go?",
              options: ["(4, 1)", "(16, 4)", "(7.5, 1.5)"],
              answers: ["(4, 1)"],
              why: "Halve both.",
            },
          },
          {
            prompt: "(3, 2) is enlarged by scale factor −1 about (0, 0). Where does it go?",
            options: ["(−3, −2)", "(3, −2)", "(−3, 2)"],
            answers: ["(−3, −2)"],
            why: "Both change sign: through the centre.",
            retry: {
              prompt: "(1, 4) is enlarged by scale factor −2 about (0, 0). Where does it go?",
              options: ["(−2, −8)", "(−1, −4)", "(2, 8)"],
              answers: ["(−2, −8)"],
              why: "Times both by −2.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-similarity",
    id: "y9-similarity/proof",
    before: PROOF,
    title: "Proving it",
    summary: "Use angle facts, with a reason for every step, to prove things for every case.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Always 180°?",
        text: [
          "Measure the angles of any triangle and they make 180°. But you can't measure every triangle there is.",
          "How can we be sure it's always true? By the end of this lesson, you can prove it.",
        ],
        picture: proof([]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Angles on a straight line",
        picture: {
          kind: "angles",
          rays: [0, 65, 180],
          arcs: [
            { from: 0, to: 1, label: "65°" },
            { from: 1, to: 2, label: "x", find: true },
          ],
        },
        answers: ["115"],
        unit: "°",
        hint: "Angles on a straight line add up to 180°.",
        done: "$180 - 65 = 115°$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Vertically opposite angles",
        picture: {
          kind: "angles",
          rays: [35, 145, 215, 325],
          arcs: [
            { from: 0, to: 1, label: "110°" },
            { from: 2, to: 3, label: "x", find: true },
          ],
        },
        answers: ["110"],
        unit: "°",
        hint: "Vertically opposite angles are equal.",
        done: "110°: vertically opposite.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Angles and parallel lines",
        text: [
          "A line crossing two parallel lines makes the same angles at each crossing.",
          "**Corresponding** angles (an F shape) are equal. **Alternate** angles (a Z shape) are equal. **Co-interior** angles (a C shape) add to 180°.",
        ],
        picture: parallels(70, [
          { on: "low", ...rightAbove(70), label: "70°" },
          { on: "high", ...rightAbove(70), label: "a" },
          { on: "high", ...leftBelow(70), label: "b" },
        ]),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Corresponding angles",
        text: "a sits in the same position at the top crossing as the 70° at the bottom one. What is a?",
        picture: parallels(70, [
          { on: "low", ...rightAbove(70), label: "70°" },
          { on: "high", ...rightAbove(70), label: "a" },
        ]),
        options: [
          {
            text: "70°: corresponding angles are equal",
            correct: true,
            feedback: "Slide the bottom crossing up the line: it lands exactly on the top one.",
          },
          {
            text: "110°: they add to 180°",
            feedback: "That's co-interior angles. These are in the same position: equal.",
          },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Co-interior angles",
        text: "b is between the lines, on the same side as the 70°. What is b?",
        picture: parallels(70, [
          { on: "low", ...rightAbove(70), label: "70°" },
          { on: "high", ...rightBelow(70), label: "b" },
        ]),
        options: [
          {
            text: "110°: co-interior angles add to 180°",
            correct: true,
            feedback: "$180 - 70 = 110$. A C shape.",
          },
          {
            text: "70°: they're equal",
            feedback: "Co-interior angles aren't equal: they add to 180°.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A reason for every step",
        picture: parallels(65, [
          { on: "low", ...rightAbove(65), label: "65°" },
          { on: "high", ...leftBelow(65), label: "x" },
          { on: "high", ...leftAbove(65), label: "y" },
        ]),
        problem: "Find x and y, giving a reason for each.",
        steps: [
          {
            line: "$x = 65°$ (alternate angles)",
            why: "x and the 65° make a Z between the parallel lines.",
          },
          {
            line: "$y = 180° - 65° = 115°$ (angles on a straight line)",
            why: "y and x sit side by side on the crossing line: a straight line.",
          },
        ],
        done: "Each answer comes with the fact that makes it true.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Find a and b",
        picture: parallels(55, [
          { on: "low", ...leftAbove(55), label: "125°" },
          { on: "high", ...leftAbove(55), label: "a" },
          { on: "high", ...rightAbove(55), label: "b" },
        ]),
        start: "Two parallel lines are crossed by a third.",
        stages: [
          {
            prompt: "a is in the same position as the 125°. So",
            options: [
              { text: "$a = 125°$ (corresponding angles)", correct: true, feedback: "" },
              {
                text: "$a = 55°$ (co-interior angles)",
                feedback: "Same position at each crossing: corresponding, equal.",
              },
            ],
            then: "$a = 125°$ (corresponding angles)",
          },
          {
            prompt: "b is next to a on the top line. So",
            options: [
              { text: "$b = 55°$ (angles on a straight line)", correct: true, feedback: "" },
              {
                text: "$b = 125°$ (vertically opposite)",
                feedback: "b is next to a, not opposite it.",
              },
            ],
            then: "$b = 180 - 125 = 55°$ (angles on a straight line)",
          },
        ],
        done: "One fact at a time, each with its reason.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "An isosceles triangle",
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 6, y: 0 },
            { x: 3, y: 8.24 },
          ],
          angles: ["x", "x", "40°"],
        },
        start: "The triangle is isosceles, with 40° at the top. Find x.",
        stages: [
          {
            prompt: "The two base angles are",
            options: [
              { text: "equal, as the triangle is isosceles", correct: true, feedback: "" },
              {
                text: "each 40°",
                feedback: "The equal angles are at the base, under the equal sides.",
              },
            ],
            then: "Both base angles are x (isosceles triangle).",
          },
          {
            prompt: "So",
            options: [
              { text: "$2x = 180 - 40 = 140$, so $x = 70°$", correct: true, feedback: "" },
              { text: "$x = 180 - 40 = 140°$", feedback: "There are two x's sharing the 140°." },
            ],
            then: "$x = 70°$ (angles in a triangle add to 180°)",
          },
        ],
        done: "Every step has a reason you could point to.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find c",
        picture: parallels(70, [
          { on: "low", ...rightAbove(70), label: "70°" },
          { on: "high", ...rightBelow(70), label: "c" },
        ]),
        answers: ["110"],
        unit: "°",
        wrong: [
          {
            answer: "70",
            feedback: "Same side, between the lines: co-interior. They add to 180°.",
          },
        ],
        hint: "c and the 70° are co-interior.",
        done: "$c = 180 - 70 = 110°$ (co-interior angles).",
      },
      {
        kind: "sort",
        tag: "Your turn",
        title: "Equal, or add to 180°?",
        groups: ["Equal", "Add to 180°"],
        items: [
          { text: "Alternate angles (Z)", group: 0, why: "Alternate angles are equal." },
          { text: "Corresponding angles (F)", group: 0, why: "Corresponding angles are equal." },
          {
            text: "Vertically opposite angles",
            group: 0,
            why: "Vertically opposite angles are equal.",
          },
          { text: "Co-interior angles (C)", group: 1, why: "Co-interior angles add to 180°." },
          { text: "Angles on a straight line", group: 1, why: "They make a half turn." },
        ],
        done: "Know which facts make angles equal and which add to 180°.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Ava measured three triangles; each made 180°. She says that proves it. Does it?",
        options: [
          {
            text: "No: it only checks those three",
            correct: true,
            feedback:
              "Examples can't cover every triangle. A **proof** uses facts that are always true, so it works for every case at once.",
          },
          {
            text: "Yes: three examples is enough",
            feedback: "However many you measure, there are always more. That's why we prove.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "A line crosses two parallel lines; one angle is 70°. Jo finds three more angles between the lines.",
        lines: [
          "$p = 70°$ (alternate angles)",
          "$q = 110°$ (angles on a straight line)",
          "$r = 70°$ (co-interior angles)",
        ],
        wrong: 2,
        why: "Co-interior angles aren't equal: they add to 180°. So $r = 110°$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
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
                  "They're on opposite sides of a line crossing two parallel lines: a Z shape.",
              },
              { text: "corresponding angles", feedback: "Trace the Z between the parallel lines." },
            ],
            then: "The angle next to c is a (alternate angles).",
            picture: proof([through, { angle: C, from: 180, to: 240.26, label: "a" }]),
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
            then: "$a + b + c = 180°$ (angles on a straight line)",
            picture: proof([
              through,
              { angle: C, from: 180, to: 240.26, label: "a" },
              { angle: C, from: 318.81, to: 360, label: "b" },
            ]),
          },
        ],
        done: "That's a proof: every step uses a fact we already know, so it works for every triangle.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Alternate angles are",
            options: ["equal", "add to 180°", "add to 90°"],
            answers: ["equal"],
            why: "A Z shape: equal.",
            retry: {
              prompt: "Corresponding angles are",
              options: ["equal", "add to 180°", "add to 360°"],
              answers: ["equal"],
              why: "An F shape: equal.",
            },
          },
          {
            prompt: "Co-interior angles: one is 75°. The other is",
            options: ["105°", "75°", "285°"],
            answers: ["105°"],
            why: "They add to 180°.",
            retry: {
              prompt: "Co-interior angles: one is 120°. The other is",
              options: ["60°", "120°", "240°"],
              answers: ["60°"],
              why: "They add to 180°.",
            },
          },
          {
            prompt: "Which is a proof?",
            options: [
              "A chain of steps, each using a known fact, that works for every case",
              "Checking lots of examples",
              "Measuring very carefully",
            ],
            answers: ["A chain of steps, each using a known fact, that works for every case"],
            why: "Examples, however many, only check those cases.",
            retry: {
              prompt: "Why isn't measuring 10 triangles a proof?",
              options: [
                "It only checks those 10 triangles",
                "Protractors aren't accurate",
                "10 is too few; 100 would do",
              ],
              answers: ["It only checks those 10 triangles"],
              why: "No number of examples covers every triangle.",
            },
          },
        ],
      },
    ],
  },
];
