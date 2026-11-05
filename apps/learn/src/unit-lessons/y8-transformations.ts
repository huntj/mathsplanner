// Year 8, "Transformations", as three short lessons, one just before each skill: translating by
// a vector, rotating about a centre and reflecting in a mirror line, each done by tapping where a
// shape's corners go, then described. Each starts from something quick, builds the idea a step at
// a time, names the common mistakes, and ends on an exit check.
import type { Picture, Point, Range, Scene, UnitLesson } from "./types.ts";

const TRANSLATE = "Y8-POS-01.a";
const ROTATE = "Y8-POS-01.b";
const REFLECT = "Y8-POS-01.c";

const range: Range = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
const T: Point[] = [
  { x: 1, y: 1 },
  { x: 3, y: 1 },
  { x: 1, y: 2 },
];
const move = (f: (p: Point) => Point, from: Point[] = T) => from.map(f);
const scene = (extra: Partial<Scene> = {}): Scene => ({
  range,
  shapes: [{ points: T, label: "A" }],
  ...extra,
});
const pic = (extra: Partial<Scene> = {}): Picture => ({ kind: "graph", ...scene(extra) });
/** A and its image B, after the move f. */
const pair = (f: (p: Point) => Point, extra: Partial<Scene> = {}): Picture =>
  pic({
    shapes: [
      { points: T, label: "A" },
      { points: move(f), tone: "image", label: "B" },
    ],
    ...extra,
  });
const vec = (x: number, y: number) => `$\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$`;

export const y8Transformations: UnitLesson[] = [
  {
    unit: "y8-transformations",
    id: "y8-transformations/translate",
    before: TRANSLATE,
    title: "Slide",
    summary: "A translation slides a shape: describe it with a vector.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Moving a game piece",
        text: [
          "In a computer game, a piece slides from A to B. The program needs to be told exactly how it moved, in numbers.",
          "By the end of this lesson, you can write any slide as a pair of numbers: a vector.",
        ],
        picture: pair((p) => ({ x: p.x + 3, y: p.y + 2 })),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "From (1, 1), go 3 right and 2 up. Where are you?",
        options: [
          { text: "(4, 3)", correct: true, feedback: "x + 3, y + 2." },
          { text: "(3, 2)", feedback: "Start from (1, 1): add the moves." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "From (2, 3), go 4 left. Where are you?",
        options: [
          { text: "(−2, 3)", correct: true, feedback: "$2 - 4 = -2$; y stays." },
          { text: "(2, −1)", feedback: "Left changes x, not y." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A translation slides",
        text: [
          "A **translation** slides a shape without turning or flipping it. Every corner moves exactly the same way: here, 3 right and 2 up.",
          `Write it as a **vector**: ${vec(3, 2)}, across on top, up underneath. Left and down are negative.`,
        ],
        picture: pair((p) => ({ x: p.x + 3, y: p.y + 2 })),
      },
      {
        kind: "plot",
        tag: "Discover",
        title: `Translate A by ${vec(2, 0)}`,
        text: "Tap where each corner goes.",
        scene: scene(),
        targets: move((p) => ({ x: p.x + 2, y: p.y })),
        join: true,
        hint: "Each corner moves 2 right, and not up or down.",
        done: "A 0 on the bottom means no up or down.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Describe the translation",
        problem: "Describe the translation from A to B.",
        picture: pair((p) => ({ x: p.x - 4, y: p.y - 3 })),
        steps: [
          { line: "Pick one corner: (1, 1) goes to (−3, −2)", why: "Follow one corner." },
          { line: "Across: 4 left, so −4", why: "Left is negative." },
          { line: `Down 3, so −3: ${vec(-4, -3)}`, why: "Down is negative." },
        ],
        done: "Follow one corner; across on top, up underneath.",
      },
      {
        kind: "plot",
        tag: "Together",
        title: `Translate A by ${vec(-4, 1)}`,
        text: "Tap where each corner goes.",
        scene: scene(),
        targets: move((p) => ({ x: p.x - 4, y: p.y + 1 })),
        join: true,
        hint: "Each corner moves 4 left and 1 up.",
        done: "Every corner moved the same: 4 left, 1 up.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Describe the translation from A to B",
        picture: pair((p) => ({ x: p.x + 2, y: p.y - 3 })),
        options: [
          { text: vec(2, -3), correct: true, feedback: "2 right and 3 down. Down is negative." },
          { text: vec(-3, 2), feedback: "The top number is across; the bottom is up or down." },
          { text: vec(2, 3), feedback: "It moves down, so the bottom number is negative." },
        ],
      },
      {
        kind: "plot",
        tag: "Your turn",
        title: `Translate A by ${vec(-3, -4)}`,
        text: "Tap where each corner goes.",
        scene: scene(),
        targets: move((p) => ({ x: p.x - 3, y: p.y - 4 })),
        join: true,
        hint: "Each corner moves 3 left and 4 down.",
        done: "Two negatives: left and down.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Describe the translation from A to B",
        picture: pair((p) => ({ x: p.x - 5, y: p.y + 3 })),
        options: [
          { text: vec(-5, 3), correct: true, feedback: "5 left, 3 up." },
          { text: vec(5, 3), feedback: "It moves left: negative." },
          { text: vec(3, -5), feedback: "Across goes on top." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Does a translation change a shape's size or turn it?",
        options: [
          {
            text: "No: it only slides. The image is congruent",
            correct: true,
            feedback: "Same size, same shape, same way up.",
          },
          { text: "It can turn it", feedback: "Turning is a rotation." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ian describes a slide of 2 left and 5 up.",
        lines: ["Across: 2 left, so −2", "Up: 5", `The vector is ${vec(5, -2)}`],
        wrong: 2,
        why: `Across goes on top: ${vec(-2, 5)}.`,
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The game piece, A to B",
        picture: pair((p) => ({ x: p.x + 3, y: p.y + 2 })),
        options: [
          { text: vec(3, 2), correct: true, feedback: "3 right, 2 up. The program can use that." },
          { text: vec(2, 3), feedback: "Across on top: 3." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Describe the translation from A to B.",
            picture: pair((p) => ({ x: p.x + 1, y: p.y + 3 })),
            options: [vec(1, 3), vec(3, 1), vec(-1, 3)],
            answers: [vec(1, 3)],
            why: "1 right, 3 up.",
            retry: {
              prompt: "Write the vector that takes A to B.",
              picture: pair((p) => ({ x: p.x - 2, y: p.y + 1 })),
              options: [vec(-2, 1), vec(1, -2), vec(2, 1)],
              answers: [vec(-2, 1)],
              why: "2 left, 1 up.",
            },
          },
          {
            prompt: `(3, 4) is translated by ${vec(-1, 2)}. Where does it go?`,
            options: ["(2, 6)", "(4, 2)", "(1, 6)"],
            answers: ["(2, 6)"],
            why: "$3 - 1$, $4 + 2$.",
            retry: {
              prompt: `(0, 5) is translated by ${vec(3, -4)}. Where does it go?`,
              options: ["(3, 1)", "(−4, 8)", "(3, 9)"],
              answers: ["(3, 1)"],
              why: "$0 + 3$, $5 - 4$.",
            },
          },
          {
            prompt: `In the vector ${vec(-2, 5)}, the −2 means`,
            options: ["2 left", "2 down", "2 right"],
            answers: ["2 left"],
            why: "Top: across; negative is left.",
            retry: {
              prompt: `In the vector ${vec(4, -1)}, the −1 means`,
              options: ["1 down", "1 left", "1 up"],
              answers: ["1 down"],
              why: "Bottom: up or down; negative is down.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-transformations",
    id: "y8-transformations/rotate",
    before: ROTATE,
    title: "Turn",
    summary: "A rotation turns a shape: give the angle, the direction and the centre.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A turning sign",
        text: [
          "A shop sign is fixed at one point and turns from position A to B. How do you tell someone exactly how it turned?",
          "By the end of this lesson, you can describe any turn, and draw one.",
        ],
        picture: pair((p) => ({ x: -p.y, y: p.x }), { points: [{ x: 0, y: 0 }] }),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "A quarter turn is",
        options: [
          { text: "90°", correct: true, feedback: "A full turn is 360°; a quarter is 90°." },
          { text: "45°", feedback: "360° ÷ 4 = 90°." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Clockwise means turning",
        options: [
          { text: "the way a clock's hands go", correct: true, feedback: "From 12 towards 3." },
          { text: "the opposite way to a clock", feedback: "That's anticlockwise." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A rotation turns",
        text: [
          "A **rotation** turns a shape about a fixed point, the **centre**. Describe it with three things: the **angle**, the **direction** and the **centre**.",
          "This is 90° clockwise about (0, 0).",
        ],
        picture: pair((p) => ({ x: p.y, y: -p.x }), { points: [{ x: 0, y: 0 }] }),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Which is the same as 90° clockwise?",
        options: [
          {
            text: "270° anticlockwise",
            correct: true,
            feedback: "Three quarter turns the other way end in the same place.",
          },
          { text: "90° anticlockwise", feedback: "That turns the other way." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Describe the rotation",
        problem: "Describe the rotation from A to B.",
        picture: pair((p) => ({ x: -p.x, y: -p.y }), { points: [{ x: 0, y: 0 }] }),
        steps: [
          { line: "B is upside down, on the opposite side of (0, 0)", why: "A half turn." },
          { line: "Angle: 180°", why: "Direction doesn't matter for a half turn." },
          { line: "Rotation 180° about (0, 0)", why: "Angle and centre." },
        ],
        done: "Every (x, y) became (−x, −y).",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Rotate A 180° about (0, 0)",
        text: "Tap where each corner goes.",
        scene: scene({ points: [{ x: 0, y: 0 }] }),
        targets: move((p) => ({ x: -p.x, y: -p.y })),
        join: true,
        hint: "A half turn about (0, 0) sends (x, y) to (−x, −y).",
        done: "Half a turn: every (x, y) became (−x, −y).",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Rotate A 90° clockwise about (0, 0)",
        text: "Tap where each corner goes. Imagine tracing it and turning the paper a quarter.",
        scene: scene({ points: [{ x: 0, y: 0 }] }),
        targets: move((p) => ({ x: p.y, y: -p.x })),
        join: true,
        hint: "A quarter turn clockwise sends (1, 1) to (1, −1) and (3, 1) to (1, −3).",
        done: "90° clockwise about (0, 0): (x, y) became (y, −x).",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Describe the rotation from A to B",
        picture: pair((p) => ({ x: -p.y, y: p.x }), { points: [{ x: 0, y: 0 }] }),
        options: [
          {
            text: "90° anticlockwise about (0, 0)",
            correct: true,
            feedback: "A quarter turn the other way to a clock.",
          },
          {
            text: "90° clockwise about (0, 0)",
            feedback: "Clockwise would turn it down below the x-axis.",
          },
          { text: "Reflection in the y-axis", feedback: "B has turned, not flipped." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "A rotation is described as “90° about (0, 0)”. What's missing?",
        options: [
          { text: "The direction", correct: true, feedback: "Clockwise or anticlockwise?" },
          { text: "Nothing", feedback: "90° which way?" },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "B is A turned 90°, but about a different point. Can you just say “90° clockwise”?",
        options: [
          {
            text: "No: the centre changes where the image lands",
            correct: true,
            feedback:
              "Always give the centre: the same turn about a different point lands somewhere else.",
          },
          { text: "Yes", feedback: "The centre matters." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Jen rotates (2, 1) by 180° about (0, 0).",
        lines: [
          "A half turn about the origin",
          "(x, y) goes to (−x, −y)",
          "So (2, 1) goes to (−2, 1)",
        ],
        wrong: 2,
        why: "Both signs change: (−2, −1).",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The sign, A to B",
        picture: pair((p) => ({ x: -p.y, y: p.x }), { points: [{ x: 0, y: 0 }] }),
        options: [
          {
            text: "Rotation 90° anticlockwise about (0, 0)",
            correct: true,
            feedback: "Angle, direction, centre.",
          },
          { text: "It turned", feedback: "Say exactly how: angle, direction, centre." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Describe the rotation from A to B.",
            picture: pair((p) => ({ x: p.y, y: -p.x }), { points: [{ x: 0, y: 0 }] }),
            options: [
              "90° clockwise about (0, 0)",
              "90° anticlockwise about (0, 0)",
              "180° about (0, 0)",
            ],
            answers: ["90° clockwise about (0, 0)"],
            why: "A quarter turn, the way a clock goes.",
            retry: {
              prompt: "How does A turn to B here?",
              picture: pair((p) => ({ x: -p.x, y: -p.y }), { points: [{ x: 0, y: 0 }] }),
              options: ["180° about (0, 0)", "90° clockwise about (0, 0)", "a reflection"],
              answers: ["180° about (0, 0)"],
              why: "A half turn.",
            },
          },
          {
            prompt: "(3, 2) rotated 180° about (0, 0) goes to",
            options: ["(−3, −2)", "(−3, 2)", "(2, 3)"],
            answers: ["(−3, −2)"],
            why: "(x, y) → (−x, −y).",
            retry: {
              prompt: "(−1, 4) rotated 180° about (0, 0) goes to",
              options: ["(1, −4)", "(1, 4)", "(4, −1)"],
              answers: ["(1, −4)"],
              why: "(x, y) → (−x, −y).",
            },
          },
          {
            prompt: "To describe a rotation, give",
            options: ["angle, direction and centre", "a vector", "a mirror line"],
            answers: ["angle, direction and centre"],
            why: "All three.",
            retry: {
              prompt: "90° clockwise is the same as",
              options: ["270° anticlockwise", "90° anticlockwise", "180°"],
              answers: ["270° anticlockwise"],
              why: "Three quarters the other way.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-transformations",
    id: "y8-transformations/reflect",
    before: REFLECT,
    title: "Flip",
    summary: "A reflection flips a shape: give the mirror line.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A symmetric logo",
        text: [
          "A designer draws half a logo, A, and needs the other half, B, as its mirror image. How is B made from A?",
          "By the end of this lesson, you can draw reflections and name the mirror line.",
        ],
        picture: pair((p) => ({ x: 1 - (p.x + 1), y: p.y }), {
          shapes: [
            { points: move((p) => ({ x: p.x + 1, y: p.y })), label: "A" },
            { points: move((p) => ({ x: 1 - p.x, y: p.y })), tone: "image", label: "B" },
          ],
        }),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "In a mirror, your reflection is",
        options: [
          {
            text: "the same distance behind the mirror as you are in front",
            correct: true,
            feedback: "That's the rule for every point.",
          },
          { text: "twice as far away", feedback: "The same distance on the other side." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "The line $x = 2$ is",
        options: [
          {
            text: "upright, through 2 on the x-axis",
            correct: true,
            feedback: "Every point on it has x = 2.",
          },
          { text: "flat, through 2 on the y-axis", feedback: "That's $y = 2$." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A reflection flips",
        text: [
          "A **reflection** flips a shape over a **mirror line**. Each corner ends up the same distance away on the other side, straight across.",
          "Here the mirror line is the y-axis.",
        ],
        picture: pair((p) => ({ x: -p.x, y: p.y }), { verticals: [0] }),
      },
      {
        kind: "plot",
        tag: "Discover",
        title: "Reflect A in the x-axis",
        text: "Tap where each corner goes.",
        scene: scene({ lines: [{ m: 0, c: 0 }] }),
        targets: move((p) => ({ x: p.x, y: -p.y })),
        join: true,
        hint: "Each corner goes the same distance below the x-axis as it is above.",
        done: "(x, y) went to (x, −y): the same distance on the other side.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Describe the reflection",
        problem: "Describe the reflection from A to B.",
        picture: {
          kind: "graph",
          range,
          verticals: [1],
          shapes: [
            { points: move((p) => ({ x: p.x + 1, y: p.y })), label: "A" },
            { points: move((p) => ({ x: 1 - p.x, y: p.y })), tone: "image", label: "B" },
          ],
        },
        steps: [
          { line: "(2, 1) goes to (0, 1)", why: "Follow one corner." },
          { line: "Halfway between them: x = 1", why: "The mirror is in the middle." },
          { line: "Reflection in the line $x = 1$", why: "Name the mirror line." },
        ],
        done: "The mirror line is halfway between each corner and its image.",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Reflect A in the line $x = -1$",
        text: "Tap where each corner goes.",
        scene: scene({ verticals: [-1] }),
        targets: move((p) => ({ x: -2 - p.x, y: p.y })),
        join: true,
        hint: "(1, 1) is 2 right of the line, so its image is 2 left of it: (−3, 1).",
        done: "Measure across to the mirror, then the same again.",
      },
      {
        kind: "plot",
        tag: "Together",
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
        tag: "Your turn",
        title: "Describe the reflection from A to B",
        picture: pair((p) => ({ x: p.x, y: -p.y })),
        options: [
          {
            text: "Reflection in the x-axis",
            correct: true,
            feedback: "Flipped over the horizontal axis.",
          },
          {
            text: "Reflection in the y-axis",
            feedback: "It flipped up and down, over the x-axis.",
          },
          {
            text: "Rotation 180°",
            feedback: "It's flipped, not turned: it stays on the same side, left to right.",
          },
        ],
      },
      {
        kind: "plot",
        tag: "Your turn",
        title: "Reflect A in the line $y = -1$",
        text: "Tap where each corner goes.",
        scene: scene({ lines: [{ m: 0, c: -1 }] }),
        targets: move((p) => ({ x: p.x, y: -2 - p.y })),
        join: true,
        hint: "(1, 1) is 2 above the line, so its image is 2 below: (1, −3).",
        done: "Straight across the mirror, the same distance.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Reflecting in the y-axis: Kit moves each corner 3 squares left. What's wrong?",
        options: [
          {
            text: "Each corner moves to the same distance on the other side, not a fixed amount",
            correct: true,
            feedback:
              "A corner 1 from the mirror lands 1 the other side; one 3 away lands 3 away. That's a flip, not a slide.",
          },
          { text: "Nothing", feedback: "Moving every corner the same way is a translation." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Max names the mirror line for (3, 2) → (3, −2).",
        lines: [
          "x stays the same; y changes sign",
          "It flipped up and down",
          "The mirror line is the y-axis",
        ],
        wrong: 2,
        why: "Flipping up and down is over the **x-axis** (y = 0).",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The logo, A to B",
        picture: {
          kind: "graph",
          range,
          verticals: [1],
          shapes: [
            { points: move((p) => ({ x: p.x + 1, y: p.y })), label: "A" },
            { points: move((p) => ({ x: 1 - p.x, y: p.y })), tone: "image", label: "B" },
          ],
        },
        options: [
          {
            text: "Reflection in the line $x = 1$",
            correct: true,
            feedback: "Each corner and its image are the same distance from $x = 1$.",
          },
          {
            text: "Reflection in the y-axis",
            feedback:
              "(2, 1) goes to (0, 1): they're 1 from x = 1, not equal distances from the y-axis.",
          },
          { text: "A translation", feedback: "B is flipped over. A translation never flips." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "(4, 3) reflected in the x-axis goes to",
            options: ["(4, −3)", "(−4, 3)", "(3, 4)"],
            answers: ["(4, −3)"],
            why: "y changes sign.",
            retry: {
              prompt: "(4, 3) reflected in the y-axis goes to",
              options: ["(−4, 3)", "(4, −3)", "(3, 4)"],
              answers: ["(−4, 3)"],
              why: "x changes sign.",
            },
          },
          {
            prompt: "(2, 5) reflected in $y = x$ goes to",
            options: ["(5, 2)", "(−2, 5)", "(2, −5)"],
            answers: ["(5, 2)"],
            why: "Swap the coordinates.",
            retry: {
              prompt: "(−1, 3) reflected in $y = x$ goes to",
              options: ["(3, −1)", "(1, 3)", "(−1, −3)"],
              answers: ["(3, −1)"],
              why: "Swap the coordinates.",
            },
          },
          {
            prompt: "To describe a reflection, give",
            options: ["the mirror line", "a vector", "an angle and centre"],
            answers: ["the mirror line"],
            why: "Just the mirror line.",
            retry: {
              prompt: "Which transformation flips a shape over?",
              options: ["reflection", "translation", "rotation"],
              answers: ["reflection"],
              why: "Flip: reflection.",
            },
          },
        ],
      },
    ],
  },
];
