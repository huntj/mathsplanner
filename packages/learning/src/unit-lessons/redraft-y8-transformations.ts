// Year 8, "Transformations", on the stepped template (docs/proposals/lesson-stepped.md):
// translating by a vector, rotating about a centre and reflecting in a mirror line. A shape and its
// image are drawn on the grid for every "describe it" question; single points are coordinates.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, Range, UnitLesson } from "./types.ts";
import { y8Transformations } from "./y8-transformations.ts";

const TR = y8Transformations;
const POINT = "A single point: its coordinates are the picture.";
const range: Range = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
const T: Point[] = [
  { x: 1, y: 1 },
  { x: 3, y: 1 },
  { x: 1, y: 2 },
];
/** A and its image B after the move f, with any mirror lines drawn. */
const pair = (f: (p: Point) => Point, extra: { verticals?: number[] } = {}): Picture => ({
  kind: "graph",
  range,
  shapes: [
    { points: T, label: "A" },
    { points: T.map(f), tone: "image", label: "B" },
  ],
  ...extra,
});
const vec = (x: number, y: number) => `$\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$`;
const by = (dx: number, dy: number) => (p: Point) => ({ x: p.x + dx, y: p.y + dy });

// ---------------------------------------------------------------------------------------------
// Translation.

const TRANSLATE = "y8-transformations/translate";
const translateMethod = [
  "Pick one corner of A and its match on B.",
  "Count across: right is +, left is −.",
  "Count up (+) or down (−). Across on top.",
];
const SLID = pair(by(3, 2));
const describe = (
  dx: number,
  dy: number,
  others: [number, number][],
  extra: Record<string, unknown>,
) =>
  ask(
    "Describe the translation from A to B.",
    vec(dx, dy),
    "Across on top, then up or down.",
    `${vec(dx, dy)}.`,
    {
      asks: "vector",
      others: others.map(([x, y]) => vec(x, y)),
      picture: pair(by(dx, dy)),
      ...extra,
    },
  );

const translate = stepped(find(TR, TRANSLATE), {
  method: translateMethod,
  variation: {
    relationship: "a slide and its vector",
    unknowns: ["vector", "image"],
    surface: ["left", "down", "only across", "only down"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Slide",
        ["**A translation slides every corner the same way: write it as a vector.**"],
        SLID,
        "Across on top, up underneath: left and down are negative.",
      ),
      reworded(TR, TRANSLATE, "Translate A by $\\begin{pmatrix} 2 \\\\ 0 \\end{pmatrix}$", {
        tag: "The rule",
      }),

      ...owned(TR, TRANSLATE, "Warm-up", "Check you remember"),

      methodCard("The method", translateMethod, SLID),
      workedFrom(TR, TRANSLATE),
      calc(
        "Your turn",
        "Describe the translation from A to B.",
        pair(by(-2, 4)),
        [
          ["Across:", "-2", "2 left."],
          ["Up or down:", "4", "4 up."],
        ],
        `The vector is ${vec(-2, 4)}.`,
      ),

      calc(
        "Practise",
        `Translate (2, −1) by ${vec(3, 4)}.`,
        undefined,
        [
          ["$x$: $2 + 3 =$", "5", "Add the across."],
          ["$y$: $-1 + 4 =$", "3", "Add the up."],
        ],
        "It goes to (5, 3).",
      ),
      ...owned(TR, TRANSLATE, "Together", "Practise"),
      ...owned(TR, TRANSLATE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          describe(
            3,
            1,
            [
              [1, 3],
              [-3, -1],
            ],
            {},
          ),
          describe(
            -4,
            1,
            [
              [4, 1],
              [1, -4],
            ],
            { changed: "Now left." },
          ),
          describe(
            -4,
            -1,
            [
              [-4, 1],
              [-1, -4],
            ],
            { changed: "Now down too." },
          ),
          ask(
            `(1, 2) moves by ${vec(-4, -1)}. Where to?`,
            "(−3, 1)",
            "Add each part.",
            "(−3, 1).",
            {
              asks: "image",
              changed: "Use the vector.",
              others: ["(5, 3)", "(−3, 3)"],
            },
          ),
        ],
        "One vector moves every corner.",
      ),

      questionSet(
        "Variation",
        "Describe each slide. Watch what changes.",
        [
          describe(
            -2,
            4,
            [
              [4, -2],
              [2, 4],
            ],
            {
              expect: [
                `Ian writes 2 left, 4 up as ${vec(4, -2)}. Right?`,
                "No",
                `Across on top: −2. Up underneath: 4. ${vec(-2, 4)}.`,
                [["Yes", "Across goes on top."]],
              ],
            },
          ),
          describe(
            -2,
            -4,
            [
              [-2, 4],
              [-4, -2],
            ],
            { changed: "Down, not up." },
          ),
          describe(
            2,
            0,
            [
              [0, 2],
              [2, 2],
            ],
            { changed: "Only across." },
          ),
          describe(
            0,
            -5,
            [
              [-5, 0],
              [0, 5],
            ],
            { changed: "Only down." },
          ),
        ],
        "Across first, then up or down, signs and all.",
      ),
      own(TR, TRANSLATE, "Spot the mistake"),

      own(TR, TRANSLATE, "Exit check"),

      reworded(
        TR,
        TRANSLATE,
        "The game piece, A to B",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A translation slides every corner the same way: write it as a vector.**"],
        SLID,
        [
          "**A translation slides every corner the same way: write it as a vector.**",
          `3 right, 2 up: ${vec(3, 2)}.`,
          "Left and down are negative.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    POINT,
  ),
});

// ---------------------------------------------------------------------------------------------
// Rotation.

const ROTATE = "y8-transformations/rotate";
const rotateMethod = [
  "Find the centre: the point that doesn't move.",
  "Find the angle: a quarter turn is 90°, a half turn 180°.",
  "Say the direction: clockwise or anticlockwise.",
];
const cw = (p: Point) => ({ x: p.y, y: -p.x });
const acw = (p: Point) => ({ x: -p.y, y: p.x });
const half = (p: Point) => ({ x: -p.x, y: -p.y });
const TURNED = pair(cw);
const TURNS = ["90° clockwise about (0, 0)", "90° anticlockwise about (0, 0)", "180° about (0, 0)"];
const turn = (f: (p: Point) => Point, right: string, extra: Record<string, unknown>) =>
  ask("Describe the rotation from A to B.", right, "Angle, direction and centre.", `${right}.`, {
    asks: "description",
    others: TURNS.filter((t) => t !== right),
    picture: pair(f),
    ...extra,
  });

const rotate = stepped(find(TR, ROTATE), {
  method: rotateMethod,
  variation: {
    relationship: "a turn and its angle, direction and centre",
    unknowns: ["description", "image"],
    surface: ["the other way", "half turns", "points on an axis"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Turn",
        ["**Give a rotation's angle, direction and centre.**"],
        TURNED,
        "This is 90° clockwise about (0, 0).",
      ),
      reworded(TR, ROTATE, "A rotation turns", { tag: "The rule" }),
      reworded(TR, ROTATE, "Which is the same as 90° clockwise?", { tag: "The rule" }),

      ...owned(TR, ROTATE, "Warm-up", "Check you remember"),

      methodCard("The method", rotateMethod, TURNED),
      workedFrom(TR, ROTATE),
      calc(
        "Your turn",
        "Rotate (3, 1) by 180° about (0, 0).",
        undefined,
        [
          ["$x$ becomes", "-3", "A half turn changes its sign."],
          ["$y$ becomes", "-1", "And this one too."],
        ],
        "(3, 1) goes to (−3, −1).",
      ),

      calc(
        "Practise",
        "Rotate (−4, 2) by 180° about (0, 0).",
        undefined,
        [
          ["$x$ becomes", "4", "Change its sign."],
          ["$y$ becomes", "-2", "Change its sign."],
        ],
        "(−4, 2) goes to (4, −2).",
      ),
      ...owned(TR, ROTATE, "Together", "Practise"),
      ...owned(TR, ROTATE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          turn(cw, "90° clockwise about (0, 0)", {}),
          turn(acw, "90° anticlockwise about (0, 0)", { changed: "The other way." }),
          turn(half, "180° about (0, 0)", { changed: "A half turn." }),
          ask("(4, 1) rotated 180° about (0, 0)?", "(−4, −1)", "Both signs change.", "(−4, −1).", {
            asks: "image",
            changed: "A point.",
            others: ["(−4, 1)", "(4, −1)"],
          }),
        ],
        "Angle, direction, centre: all three.",
      ),

      questionSet(
        "Variation",
        "A half turn about (0, 0). Watch what changes.",
        [
          ask("Where does (2, 1) go?", "(−2, −1)", "Both signs change.", "(−2, −1).", {
            asks: "image",
            others: ["(−2, 1)", "(2, −1)"],
            expect: [
              "Jen turns (2, 1) half way round and gets (−2, 1). Right?",
              "No",
              "A half turn changes both signs: (−2, −1).",
              [["Yes", "Both signs change."]],
            ],
          }),
          ask("Where does (−2, 1) go?", "(2, −1)", "Both signs change.", "(2, −1).", {
            asks: "image",
            changed: "A negative x.",
            others: ["(−2, −1)", "(2, 1)"],
          }),
          ask("Where does (2, 0) go?", "(−2, 0)", "0 stays 0.", "(−2, 0).", {
            asks: "image",
            changed: "On the x-axis.",
            others: ["(2, 0)", "(0, −2)"],
          }),
          ask("Where does (0, 0) go?", "(0, 0)", "The centre doesn't move.", "(0, 0).", {
            asks: "image",
            changed: "The centre itself.",
            others: ["(1, 1)", "(−1, −1)"],
          }),
        ],
        "A half turn about (0, 0) changes both signs.",
      ),
      own(TR, ROTATE, "Spot the mistake"),

      own(TR, ROTATE, "Exit check"),

      reworded(TR, ROTATE, "The sign, A to B", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Give a rotation's angle, direction and centre.**"],
        TURNED,
        [
          "**Give a rotation's angle, direction and centre.**",
          "90° clockwise is the same as 270° anticlockwise.",
          "180° about (0, 0): (x, y) goes to (−x, −y).",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    POINT,
  ),
});

// ---------------------------------------------------------------------------------------------
// Reflection.

const REFLECT = "y8-transformations/reflect";
const reflectMethod = [
  "Find the mirror line: halfway between A and B.",
  "Each corner goes straight across, the same distance past it.",
  "Name it: $x = a$, $y = b$, or $y = x$.",
];
const flipY = (p: Point) => ({ x: -p.x, y: p.y });
const flipX = (p: Point) => ({ x: p.x, y: -p.y });
const FLIPPED = pair(flipY);
const LINES = ["The x-axis", "The y-axis", "$y = x$", "$x = 1$", "$x = 2$"];
const mirror = (
  f: (p: Point) => Point,
  right: string,
  extra: Record<string, unknown>,
  verticals?: number[],
) =>
  ask("Name the mirror line.", right, "Halfway between A and B.", `${right}.`, {
    asks: "mirror line",
    others: LINES.filter((l) => l !== right).slice(0, 2),
    picture: pair(f, verticals ? { verticals } : {}),
    ...extra,
  });

const reflect = stepped(find(TR, REFLECT), {
  method: reflectMethod,
  variation: {
    relationship: "a flip and its mirror line",
    unknowns: ["mirror line", "image"],
    surface: ["up and down", "left and right", "lines off the axes", "y = x"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Flip",
        ["**A reflection flips each corner the same distance to the other side.**"],
        FLIPPED,
        "Here the mirror line is the y-axis.",
      ),
      reworded(TR, REFLECT, "A reflection flips", { tag: "The rule" }),
      reworded(TR, REFLECT, "Reflect A in the x-axis", { tag: "The rule" }),

      ...owned(TR, REFLECT, "Warm-up", "Check you remember"),

      methodCard("The method", reflectMethod, FLIPPED),
      workedFrom(TR, REFLECT),
      calc(
        "Your turn",
        "Reflect (5, 2) in the y-axis.",
        undefined,
        [
          ["$x$ becomes", "-5", "Straight across the y-axis."],
          ["$y$ stays", "2", "It doesn't move up or down."],
        ],
        "(5, 2) goes to (−5, 2).",
      ),

      calc(
        "Practise",
        "Reflect (3, 2) in the line $x = 1$.",
        undefined,
        [
          ["Distance from the mirror:", "2", "From 1 to 3."],
          ["New x: $1 - 2 =$", "-1", "The same distance past it."],
        ],
        "(3, 2) goes to (−1, 2).",
      ),
      ...owned(TR, REFLECT, "Together", "Practise"),
      ...owned(TR, REFLECT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          mirror(flipX, "The x-axis", {}),
          mirror(flipY, "The y-axis", { changed: "Left to right." }),
          mirror(
            (p) => ({ x: 2 - p.x, y: p.y }),
            "$x = 1$",
            { changed: "A line off the axis." },
            [1],
          ),
          ask("(4, 1) reflected in the y-axis?", "(−4, 1)", "x changes sign.", "(−4, 1).", {
            asks: "image",
            changed: "A point.",
            others: ["(4, −1)", "(−4, −1)"],
          }),
        ],
        "Halfway between A and B is the mirror.",
      ),

      questionSet(
        "Variation",
        "Name the mirror line. Watch what changes.",
        [
          ask("(3, 2) goes to (3, −2).", "The x-axis", "y changed sign.", "The x-axis.", {
            asks: "mirror line",
            others: ["The y-axis", "$y = x$"],
            expect: [
              "For (3, 2) to (3, −2), Max says the y-axis. Right?",
              "No",
              "y changed sign: it flipped up and down, over the x-axis.",
              [["Yes", "Which coordinate changed?"]],
            ],
          }),
          ask("(3, 2) goes to (−3, 2).", "The y-axis", "x changed sign.", "The y-axis.", {
            asks: "mirror line",
            changed: "x changes sign.",
            others: ["The x-axis", "$y = x$"],
          }),
          ask("(3, 2) goes to (2, 3).", "$y = x$", "They swap.", "$y = x$.", {
            asks: "mirror line",
            changed: "They swap.",
            others: ["The x-axis", "The y-axis"],
          }),
          ask("(3, 2) goes to (−1, 2).", "$x = 1$", "Halfway between 3 and −1.", "$x = 1$.", {
            asks: "mirror line",
            changed: "Halfway is 1.",
            others: ["The y-axis", "$x = 2$"],
          }),
        ],
        "See which coordinate changes, then find halfway.",
      ),
      own(TR, REFLECT, "Spot the mistake"),

      own(TR, REFLECT, "Exit check"),

      reworded(TR, REFLECT, "The logo, A to B", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**A reflection flips each corner the same distance to the other side.**"],
        FLIPPED,
        [
          "**A reflection flips each corner the same distance to the other side.**",
          "In the x-axis, y changes sign; in the y-axis, x does.",
          "Name the mirror line to describe it.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    POINT,
  ),
});

export const y8TransformationsStepped: [string, UnitLesson[]][] = [
  [TRANSLATE, [translate]],
  [ROTATE, [rotate]],
  [REFLECT, [reflect]],
];
