// Year 8, "Transformations": translating by a vector, reflecting in a mirror line and rotating
// about a centre, each done by tapping where a shape's corners go, then described.
import type { Point, Range, Scene, UnitLesson } from "./types.ts";

const range: Range = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
const T: Point[] = [
  { x: 1, y: 1 },
  { x: 3, y: 1 },
  { x: 1, y: 2 },
];
const move = (f: (p: Point) => Point) => T.map(f);
const scene = (extra: Partial<Scene> = {}): Scene => ({
  range,
  shapes: [{ points: T, label: "A" }],
  ...extra,
});

export const y8Transformations: UnitLesson = {
  unit: "y8-transformations",
  title: "Slide, flip and turn",
  summary: "Move shapes on a grid, then say exactly how they moved.",
  screens: [
    {
      kind: "explain",
      title: "A translation slides",
      text: [
        "A **translation** slides a shape without turning or flipping it. This one moves every corner 3 right and 2 up.",
        "Write it as a vector: $\\begin{pmatrix} 3 \\\\ 2 \\end{pmatrix}$, across on top, up underneath.",
      ],
      picture: {
        kind: "graph",
        ...scene({
          shapes: [
            { points: T, label: "A" },
            { points: move((p) => ({ x: p.x + 3, y: p.y + 2 })), tone: "image", label: "B" },
          ],
        }),
      },
    },
    {
      kind: "plot",
      title: "Translate A by $\\begin{pmatrix} -4 \\\\ 1 \\end{pmatrix}$",
      text: "Tap where each corner goes.",
      scene: scene(),
      targets: move((p) => ({ x: p.x - 4, y: p.y + 1 })),
      join: true,
      hint: "Each corner moves 4 left and 1 up.",
      done: "Every corner moved the same: 4 left, 1 up.",
    },
    {
      kind: "choice",
      title: "Describe the translation from A to B",
      picture: {
        kind: "graph",
        ...scene({
          shapes: [
            { points: T, label: "A" },
            { points: move((p) => ({ x: p.x + 2, y: p.y - 3 })), tone: "image", label: "B" },
          ],
        }),
      },
      options: [
        {
          text: "$\\begin{pmatrix} 2 \\\\ -3 \\end{pmatrix}$",
          correct: true,
          feedback: "2 right and 3 down. Down is negative.",
        },
        {
          text: "$\\begin{pmatrix} -3 \\\\ 2 \\end{pmatrix}$",
          feedback: "The top number is across; the bottom is up or down.",
        },
        {
          text: "$\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$",
          feedback: "It moves down, so the bottom number is negative.",
        },
      ],
    },
    {
      kind: "explain",
      title: "A reflection flips",
      text: [
        "A **reflection** flips a shape over a mirror line. Each corner ends up the same distance away on the other side.",
        "Here the mirror line is the y-axis.",
      ],
      picture: {
        kind: "graph",
        ...scene({
          verticals: [0],
          shapes: [
            { points: T, label: "A" },
            { points: move((p) => ({ x: -p.x, y: p.y })), tone: "image", label: "B" },
          ],
        }),
      },
    },
    {
      kind: "plot",
      title: "Reflect A in the x-axis",
      text: "Tap where each corner goes.",
      scene: scene({ lines: [{ m: 0, c: 0 }] }),
      targets: move((p) => ({ x: p.x, y: -p.y })),
      join: true,
      hint: "Each corner goes the same distance below the x-axis as it is above.",
      done: "(x, y) went to (x, −y): the same distance on the other side.",
    },
    {
      kind: "plot",
      title: "Reflect in the line $y = x$",
      text: "A diagonal mirror. Tap where each corner goes.",
      scene: {
        range,
        lines: [{ m: 1, c: 0 }],
        shapes: [{ points: move((p) => ({ x: p.x + 2, y: p.y - 1 })), label: "C" }],
      },
      targets: move((p) => ({ x: p.y - 1, y: p.x + 2 })),
      join: true,
      hint: "Reflecting in $y = x$ swaps the coordinates: (3, 0) goes to (0, 3).",
      done: "In the line $y = x$, every (x, y) becomes (y, x).",
    },
    {
      kind: "choice",
      title: "Describe the reflection from A to B",
      picture: {
        kind: "graph",
        ...scene({
          shapes: [
            { points: move((p) => ({ x: p.x + 1, y: p.y })), label: "A" },
            { points: move((p) => ({ x: 1 - p.x, y: p.y })), tone: "image", label: "B" },
          ],
        }),
      },
      revealPicture: {
        kind: "graph",
        ...scene({
          verticals: [1],
          shapes: [
            { points: move((p) => ({ x: p.x + 1, y: p.y })), label: "A" },
            { points: move((p) => ({ x: 1 - p.x, y: p.y })), tone: "image", label: "B" },
          ],
        }),
      },
      options: [
        {
          text: "Reflection in the line $x = 1$",
          correct: true,
          feedback:
            "Each corner and its image are the same distance from the upright line $x = 1$.",
        },
        {
          text: "Reflection in the y-axis",
          feedback:
            "Check: the corner at (2, 1) goes to (0, 1). They are each 1 from $x = 1$, not the same distance from the y-axis.",
        },
        { text: "A translation", feedback: "B is flipped over. A translation never flips." },
      ],
    },
    {
      kind: "explain",
      title: "A rotation turns",
      text: [
        "A **rotation** turns a shape about a centre. Describe it with the angle, the direction and the centre.",
        "This is 90° clockwise about (0, 0).",
      ],
      picture: {
        kind: "graph",
        ...scene({
          points: [{ x: 0, y: 0 }],
          shapes: [
            { points: T, label: "A" },
            { points: move((p) => ({ x: p.y, y: -p.x })), tone: "image", label: "B" },
          ],
        }),
      },
    },
    {
      kind: "plot",
      title: "Rotate A 180° about (0, 0)",
      text: "Tap where each corner goes.",
      scene: scene({ points: [{ x: 0, y: 0 }] }),
      targets: move((p) => ({ x: -p.x, y: -p.y })),
      join: true,
      hint: "A half turn about (0, 0) sends (x, y) to (−x, −y).",
      done: "Half a turn: every (x, y) became (−x, −y).",
    },
    {
      kind: "choice",
      title: "Describe the rotation from A to B",
      picture: {
        kind: "graph",
        ...scene({
          points: [{ x: 0, y: 0 }],
          shapes: [
            { points: T, label: "A" },
            { points: move((p) => ({ x: -p.y, y: p.x })), tone: "image", label: "B" },
          ],
        }),
      },
      options: [
        {
          text: "90° anticlockwise about (0, 0)",
          correct: true,
          feedback: "A quarter turn the other way to a clock, about the origin.",
        },
        {
          text: "90° clockwise about (0, 0)",
          feedback: "Clockwise would turn it down below the x-axis.",
        },
        {
          text: "Reflection in the y-axis",
          feedback: "B has turned, not flipped: trace it and turn the paper.",
        },
      ],
    },
    {
      kind: "sort",
      title: "What do you need to say?",
      groups: ["Translation", "Reflection", "Rotation"],
      items: [
        { text: "A vector", group: 0, why: "A translation is described by a vector." },
        { text: "Slides without turning", group: 0, why: "Translations only slide." },
        { text: "A mirror line", group: 1, why: "A reflection needs its mirror line." },
        { text: "Flips the shape over", group: 1, why: "Reflections flip." },
        {
          text: "An angle, a direction and a centre",
          group: 2,
          why: "A rotation needs all three.",
        },
        { text: "Turns about a point", group: 2, why: "Rotations turn." },
      ],
      done: "Name the transformation, then give every detail it needs.",
    },
    {
      kind: "explain",
      title: "Slide, flip and turn",
      text: [
        "Translation: a vector. Reflection: a mirror line. Rotation: an angle, a direction and a centre.",
        "All three keep the shape the same size and shape: the image is congruent.",
      ],
      picture: {
        kind: "graph",
        ...scene({
          shapes: [
            { points: T, label: "A" },
            { points: move((p) => ({ x: -p.x, y: -p.y })), tone: "image" },
            { points: move((p) => ({ x: -p.x, y: p.y })), tone: "ghost" },
          ],
        }),
      },
    },
  ],
};
