// Year 8, "Angles and shapes": angles where a line crosses parallel lines, naming the parts of a
// triangle, when two triangles must be congruent, the properties of quadrilaterals and circles,
// and the faces, edges and vertices of solids.
import type { DrawingPic, Point, UnitLesson } from "./types.ts";

// Two parallel lines, crossed by a line at 70°.
const slope = Math.tan((70 * Math.PI) / 180);
const lower = { x: 2.4, y: 0 };
const upper = { x: 2.4 + 3 / slope, y: 3 };
const off = (p: Point, deg: number, d = 0.75) => ({
  x: p.x + d * Math.cos((deg * Math.PI) / 180),
  y: p.y + d * Math.sin((deg * Math.PI) / 180),
});
const parallels = (labels: { at: Point; text: string; find?: true }[]): DrawingPic => ({
  kind: "drawing",
  items: [
    {
      line: [
        { x: 0, y: 0 },
        { x: 6, y: 0 },
      ],
      arrow: 1,
    },
    {
      line: [
        { x: 0, y: 3 },
        { x: 6, y: 3 },
      ],
      arrow: 1,
    },
    { line: [off(lower, 250, 1.2), off(upper, 70, 1.2)], tone: "soft" },
    ...labels.map((l) => ({
      text: l.text,
      at: l.at,
      ...(l.find ? { tone: "find" as const } : {}),
    })),
  ],
});

export const y8Shapes: UnitLesson = {
  unit: "y8-shapes",
  title: "Shape detective",
  summary: "Track angles across parallel lines and crack the rules of shapes.",
  screens: [
    {
      kind: "explain",
      title: "A line crosses two parallel lines",
      text: [
        "The arrows show the two lines are parallel. A line crossing them makes the same four angles at each crossing.",
      ],
      picture: parallels([
        { at: off(lower, 35), text: "70°" },
        { at: off(lower, 125), text: "110°" },
        { at: off(upper, 35), text: "70°" },
        { at: off(upper, 125), text: "110°" },
      ]),
    },
    {
      kind: "choice",
      title: "Corresponding angles: find x",
      picture: parallels([
        { at: off(lower, 35), text: "70°" },
        { at: off(upper, 35), text: "x", find: true },
      ]),
      options: [
        {
          text: "70°",
          correct: true,
          feedback:
            "They sit in the same place at each crossing, an F shape: **corresponding** angles are equal.",
        },
        { text: "110°", feedback: "x is in the same position as the 70°, just higher up." },
        { text: "20°", feedback: "Corresponding angles are equal." },
      ],
    },
    {
      kind: "choice",
      title: "Alternate angles: find y",
      picture: parallels([
        { at: off(lower, 35), text: "70°" },
        { at: off(upper, 215), text: "y", find: true },
      ]),
      options: [
        {
          text: "70°",
          correct: true,
          feedback:
            "They are on opposite sides of the crossing line, between the parallels, a Z shape: **alternate** angles are equal.",
        },
        { text: "110°", feedback: "Trace a Z from the 70° to y: alternate angles are equal." },
        { text: "250°", feedback: "y is less than a right angle." },
      ],
    },
    {
      kind: "answer",
      title: "Co-interior angles: find z",
      picture: parallels([
        { at: off(lower, 35), text: "70°" },
        { at: off(upper, 305), text: "z", find: true },
      ]),
      answers: ["110"],
      unit: "°",
      wrong: [
        {
          answer: "70",
          feedback: "These two make a C shape between the lines. They are not equal.",
        },
      ],
      hint: "These angles sit on the same side, between the parallels: a C shape. They add up to 180°.",
      done: "**Co-interior** angles add to 180°: $180 - 70 = 110°$.",
    },
    {
      kind: "explain",
      title: "Naming a triangle",
      text: [
        "Corners get capital letters. The side opposite a corner gets the same letter, small: side a is opposite A.",
        "The angle at B is written $\\angle ABC$, or just $\\angle B$.",
      ],
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 6, y: 0 },
          { x: 2, y: 4 },
        ],
        names: ["A", "B", "C"],
        sides: ["c", "a", "b"],
      },
    },
    {
      kind: "choice",
      title: "Which side is opposite angle Q?",
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 6, y: 0 },
          { x: 3, y: 4 },
        ],
        names: ["P", "Q", "R"],
        angles: [null, "?", null],
      },
      options: [
        {
          text: "PR",
          correct: true,
          feedback: "PR is across the triangle from Q: it doesn't touch Q at all.",
        },
        { text: "PQ", feedback: "PQ touches Q. The opposite side doesn't." },
        { text: "QR", feedback: "QR touches Q. The opposite side doesn't." },
      ],
    },
    {
      kind: "explain",
      title: "Congruent triangles",
      text: [
        "Congruent shapes are exactly the same shape and size: one fits on the other, perhaps turned or flipped.",
        "Two triangles are congruent if they match by **SSS** (three sides), **SAS** (two sides and the angle between), **ASA** (two angles and the side between) or **RHS** (right angle, hypotenuse and a side).",
      ],
    },
    {
      kind: "choice",
      title: "Are they congruent?",
      text: "Two triangles both have sides of 5 cm and 7 cm, with an angle of 40° between them.",
      options: [
        {
          text: "Yes, by SAS",
          correct: true,
          feedback: "Two sides and the angle between them fix the triangle.",
        },
        { text: "Yes, by SSS", feedback: "Only two sides are known, not three." },
        { text: "We can't tell", feedback: "Two sides and the angle between them are enough." },
      ],
    },
    {
      kind: "choice",
      title: "Three matching angles",
      text: "Two triangles have the same three angles. Must they be congruent?",
      options: [
        {
          text: "No",
          correct: true,
          feedback:
            "They are the same shape, but one can be bigger: they are **similar**, not always congruent.",
        },
        { text: "Yes", feedback: "Draw a small triangle and a big one with the same angles." },
      ],
    },
    {
      kind: "sort",
      title: "Which shape has it?",
      groups: ["Parallelogram", "Kite", "Trapezium"],
      items: [
        {
          text: "Two pairs of parallel sides",
          group: 0,
          why: "A parallelogram's opposite sides are parallel.",
        },
        {
          text: "Opposite angles equal",
          group: 0,
          why: "A parallelogram's opposite angles are equal.",
        },
        {
          text: "Diagonals cut each other in half",
          group: 0,
          why: "A parallelogram's diagonals bisect each other.",
        },
        {
          text: "Exactly one pair of parallel sides",
          group: 2,
          why: "That is what makes a trapezium.",
        },
        {
          text: "Two pairs of equal sides next to each other",
          group: 1,
          why: "A kite's equal sides are next to each other, not opposite.",
        },
        {
          text: "One line of symmetry, corner to corner",
          group: 1,
          why: "A kite folds along one diagonal.",
        },
      ],
      done: "Each family of quadrilaterals has its own properties.",
    },
    {
      kind: "choice",
      title: "What is the blue line called?",
      picture: {
        kind: "drawing",
        items: [
          { arc: { x: 0, y: 0 }, r: 3, from: 0, to: 180 },
          { arc: { x: 0, y: 0 }, r: 3, from: 180, to: 360 },
          { dot: { x: 0, y: 0 } },
          {
            line: [
              { x: -2.6, y: 1.5 },
              { x: 2.6, y: 1.5 },
            ],
            tone: "find",
          },
        ],
      },
      options: [
        {
          text: "A chord",
          correct: true,
          feedback:
            "A chord joins two points on the circle. A chord through the centre is a diameter.",
        },
        { text: "A radius", feedback: "A radius goes from the centre to the edge." },
        { text: "A diameter", feedback: "A diameter goes through the centre. This line doesn't." },
      ],
    },
    {
      kind: "answer",
      title: "How many edges does a cuboid have?",
      picture: { kind: "cuboid", w: 4, d: 2, h: 3 },
      answers: ["12"],
      wrong: [
        { answer: "6", feedback: "6 is the number of faces. Edges are where two faces meet." },
        { answer: "8", feedback: "8 is the number of vertices, the corners." },
      ],
      hint: "4 round the top, 4 round the bottom, and 4 going up.",
      done: "12 edges, 6 faces and 8 vertices.",
    },
    {
      kind: "fill",
      title: "A triangular prism",
      picture: {
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
              { x: 1.5, y: 2.4 },
            ],
          },
          {
            line: [
              { x: 1.5, y: 2.4 },
              { x: 0, y: 0 },
            ],
          },
          {
            line: [
              { x: 3, y: 0 },
              { x: 6, y: 1.4 },
            ],
          },
          {
            line: [
              { x: 1.5, y: 2.4 },
              { x: 4.5, y: 3.8 },
            ],
          },
          {
            line: [
              { x: 6, y: 1.4 },
              { x: 4.5, y: 3.8 },
            ],
          },
          {
            line: [
              { x: 0, y: 0 },
              { x: 3, y: 1.4 },
            ],
            dashed: true,
            tone: "soft",
          },
          {
            line: [
              { x: 3, y: 1.4 },
              { x: 6, y: 1.4 },
            ],
            dashed: true,
            tone: "soft",
          },
          {
            line: [
              { x: 3, y: 1.4 },
              { x: 4.5, y: 3.8 },
            ],
            dashed: true,
            tone: "soft",
          },
        ],
      },
      template: "It has [] faces, [] edges and [] vertices.",
      bank: ["$5$", "$6$", "$8$", "$9$", "$12$"],
      answers: ["$5$", "$9$", "$6$"],
      hint: "2 triangles and 3 rectangles make the faces. Count the corners: 3 at each end.",
      done: "5 faces, 9 edges, 6 vertices. (For any solid with flat faces: faces + vertices − edges = 2.)",
    },
    {
      kind: "choice",
      title: "Which solid?",
      text: "It has one flat face, one curved surface and one vertex.",
      options: [
        {
          text: "A cone",
          correct: true,
          feedback: "A flat circle at the bottom, a curved surface, and a point at the top.",
        },
        { text: "A cylinder", feedback: "A cylinder has two flat faces and no vertex." },
        { text: "A sphere", feedback: "A sphere has no flat face and no vertex." },
      ],
    },
    {
      kind: "explain",
      title: "Case closed",
      text: [
        "Across parallel lines: corresponding (F) and alternate (Z) angles are equal; co-interior (C) angles add to 180°.",
        "Triangles are congruent by SSS, SAS, ASA or RHS, but not by three angles alone.",
        "Solids: count faces, edges and vertices.",
      ],
      picture: parallels([
        { at: off(lower, 35), text: "70°" },
        { at: off(upper, 35), text: "70°" },
        { at: off(upper, 215), text: "70°" },
      ]),
    },
  ],
};
