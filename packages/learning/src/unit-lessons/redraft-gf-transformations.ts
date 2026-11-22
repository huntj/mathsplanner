// GCSE Foundation, "Coordinates and transformations", on the stepped template
// (docs/proposals/lesson-stepped.md): coordinates in four quadrants, midpoints and lengths, and
// rotating, reflecting, translating and enlarging. A shape and its image are drawn on the grid for
// every "describe it" question; single points are coordinates.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfTransformations } from "./gf-transformations.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, Range, UnitLesson } from "./types.ts";

const TR = gfTransformations;
const POINT = "A single point: its coordinates are the picture.";
const range: Range = { xMin: -6, xMax: 6, yMin: -6, yMax: 6 };
const p = (x: number, y: number): Point => ({ x, y });
const T: Point[] = [p(1, 1), p(3, 1), p(1, 2)];
/** A and its image B after the move f, with any mirror lines drawn. */
const pair = (f: (q: Point) => Point, extra: { verticals?: number[] } = {}): Picture => ({
  kind: "graph",
  range,
  shapes: [
    { points: T, label: "A" },
    { points: T.map(f), tone: "image", label: "B" },
  ],
  ...extra,
});
const dots = (points: Point[], r: Range = range): Picture => ({ kind: "graph", range: r, points });
const vec = (x: number, y: number) => `$\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$`;
const by = (dx: number, dy: number) => (q: Point) => ({ x: q.x + dx, y: q.y + dy });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });

// ---------------------------------------------------------------------------------------------
// Coordinates in four quadrants.

const COORDS = "gf-transformations/coordinates";
const coordMethod = ["Start at (0, 0).", "Go across: right +, left −.", "Then up +, or down −."];
const FOUR = dots([p(2, 3), p(-4, 1), p(-2, -3), p(3, -2)]);
const where = (x: number, y: number, others: string[], extra: Record<string, unknown>) =>
  pick(
    "Write its coordinates.",
    `(${fmt(x)}, ${fmt(y)})`,
    others,
    "Across first, then up or down.",
    {
      asks: "coordinates",
      picture: dots([p(x, y)]),
      ...extra,
    },
  );
const fmt = (n: number) => (n < 0 ? `−${-n}` : `${n}`);

const coordinates = stepped(find(TR, COORDS), {
  method: coordMethod,
  variation: {
    relationship: "a point and its coordinates",
    unknowns: ["quadrant", "coordinates"],
    surface: ["negative x", "negative y", "on an axis"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Four quadrants",
        ["**Across first, then up or down: (x, y). Left and down are negative.**"],
        FOUR,
        "The axes make four quadrants.",
      ),
      reworded(TR, COORDS, "Plot $(-4, -1)$", { tag: "The rule" }),

      ...owned(TR, COORDS, "Warm-up", "Check you remember"),

      methodCard("The method", coordMethod, FOUR),
      workedFrom(TR, COORDS),
      calc(
        "Your turn",
        "Write the coordinates.",
        dots([p(-5, 2)]),
        [
          ["$x =$", "-5", "Left is negative."],
          ["$y =$", "2", "Up is positive."],
        ],
        "(−5, 2).",
      ),

      calc(
        "Practise",
        "Write the coordinates.",
        dots([p(2, -5)]),
        [
          ["$x =$", "2", "Right is positive."],
          ["$y =$", "-5", "Down is negative."],
        ],
        "(2, −5).",
      ),
      ...owned(TR, COORDS, "Together", "Practise"),
      ...owned(TR, COORDS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which quadrant? Watch what changes.",
        [
          pick("$(3, 4)$", "Top right", ["Top left", "Bottom right"], "Right and up.", {
            asks: "quadrant",
          }),
          pick("$(-3, 4)$", "Top left", ["Top right", "Bottom left"], "Left and up.", {
            asks: "quadrant",
            changed: "x negative.",
          }),
          pick("$(-3, -4)$", "Bottom left", ["Top left", "Bottom right"], "Left and down.", {
            asks: "quadrant",
            changed: "Both negative.",
          }),
          pick("$(0, -4)$", "On the y-axis", ["Bottom left", "Bottom right"], "x is 0.", {
            asks: "quadrant",
            changed: "x is 0.",
          }),
        ],
        "The signs tell you the quadrant.",
      ),

      questionSet(
        "Variation",
        "Watch what changes.",
        [
          where(-4, 3, ["(3, −4)", "(4, 3)"], {
            expect: [
              "Eli writes (3, −4) for this point. Right?",
              "No",
              "Across first: 4 left is −4. Then 3 up: (−4, 3).",
              [["Yes", "Which comes first?"]],
            ],
          }),
          where(-4, -3, ["(−3, −4)", "(−4, 3)"], { changed: "Down, not up." }),
          where(4, -3, ["(−3, 4)", "(−4, −3)"], { changed: "Right, not left." }),
          where(0, -3, ["(−3, 0)", "(3, 0)"], { changed: "On the y-axis." }),
        ],
        "Across, then up or down, signs and all.",
      ),
      own(TR, COORDS, "Spot the mistake"),

      own(TR, COORDS, "Exit check"),

      reworded(
        TR,
        COORDS,
        "“Mark checkpoint $(4, -5)$ on the map.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Across first, then up or down: (x, y). Left and down are negative.**"],
        FOUR,
        [
          "**Across first, then up or down: (x, y). Left and down are negative.**",
          "(2, −3): 2 right, then 3 down.",
          "On the y-axis, x is 0.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    POINT,
  ),
});

// ---------------------------------------------------------------------------------------------
// Problems on coordinate axes.

const PROBLEMS = "gf-transformations/problems";
const probMethod = [
  "Midpoint: add the xs and halve; add the ys and halve.",
  "Flat or upright length: take the coordinates away.",
  "Missing corner: copy the move along the opposite side.",
];
const MIDPOINT: Picture = {
  kind: "maths",
  tex: "\\left(\\frac{x_1 + x_2}{2},\\ \\frac{y_1 + y_2}{2}\\right)",
};

const problems = stepped(find(TR, PROBLEMS), {
  method: probMethod,
  variation: {
    relationship: "two points, their midpoint and the distance between them",
    unknowns: ["midpoint", "end"],
    surface: ["odd totals", "negatives", "straight up"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Midpoints and lengths",
        ["**Midpoint: average the xs, average the ys. Length: take them away.**"],
        MIDPOINT,
        "A flat line's length is the change in x.",
      ),
      reworded(TR, PROBLEMS, "Midpoint of $(2, 3)$ and $(6, 9)$", { tag: "The rule" }),

      ...owned(TR, PROBLEMS, "Warm-up", "Check you remember"),

      methodCard("The method", probMethod, MIDPOINT),
      workedFrom(TR, PROBLEMS),
      calc(
        "Your turn",
        "The midpoint of $(2, 7)$ and $(8, 1)$.",
        undefined,
        [
          ["$x$:", "5", "(2 + 8) ÷ 2."],
          ["$y$:", "4", "(7 + 1) ÷ 2."],
        ],
        "(5, 4).",
      ),

      calc(
        "Practise",
        "The length from $(-3, 2)$ to $(6, 2)$.",
        undefined,
        [["$6 - (-3) =$", "9", "Take the xs away."]],
        "9 units.",
      ),
      ...owned(TR, PROBLEMS, "Together", "Practise"),
      ...owned(TR, PROBLEMS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find the midpoint. Watch what changes.",
        [
          pick("$(2, 4)$ and $(6, 8)$", "(4, 6)", ["(8, 12)", "(2, 2)"], "Add and halve.", {
            asks: "midpoint",
          }),
          pick("$(2, 4)$ and $(6, 9)$", "(4, 6.5)", ["(4, 6)", "(8, 13)"], "13 ÷ 2.", {
            asks: "midpoint",
            changed: "An odd total.",
          }),
          pick("$(-2, 4)$ and $(6, 8)$", "(2, 6)", ["(4, 6)", "(−4, 6)"], "−2 + 6 = 4.", {
            asks: "midpoint",
            changed: "A negative.",
          }),
          pick("$(-2, -4)$ and $(6, 8)$", "(2, 2)", ["(2, 6)", "(4, 6)"], "−4 + 8 = 4.", {
            asks: "midpoint",
            changed: "Two negatives.",
          }),
        ],
        "Add, then halve: never take away.",
      ),

      questionSet(
        "Variation",
        "M is the midpoint of A and B. Find B.",
        [
          pick("A(1, 2), M(3, 5)", "(5, 8)", ["(3, 5)", "(2, 3.5)"], "Go A to M, then again.", {
            asks: "end",
            expect: [
              "A(1, 2), M(3, 5): Fin says B is (3, 5). Right?",
              "No",
              "That's M. Go 2 right, 3 up again: (5, 8).",
              [["Yes", "M is halfway, not the end."]],
            ],
          }),
          pick("A(1, 2), M(4, 5)", "(7, 8)", ["(4, 5)", "(5, 7)"], "3 right, 3 up, again.", {
            asks: "end",
            changed: "M further right.",
          }),
          pick("A(−1, 2), M(2, 5)", "(5, 8)", ["(1, 7)", "(2, 5)"], "3 right, 3 up, again.", {
            asks: "end",
            changed: "A negative x.",
          }),
          pick("A(1, 2), M(1, 6)", "(1, 10)", ["(1, 8)", "(2, 8)"], "4 up, again.", {
            asks: "end",
            changed: "Straight up.",
          }),
        ],
        "From A to M is half the journey.",
      ),
      reworded(TR, PROBLEMS, "Where did it go wrong?", {
        text: "A is (2, 1); midpoint M is (5, 4). Kim finds B.",
      }),

      own(TR, PROBLEMS, "Exit check"),

      reworded(
        TR,
        PROBLEMS,
        "“A(1, 1), B(5, 1), C(5, 4). Find D and the midpoint of AC.”",
        {
          tag: "Real life",
          title: "Rectangle ABCD: find D, and the midpoint of AC.",
          text: "A(1, 1), B(5, 1), C(5, 4).",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Midpoint: average the xs, average the ys. Length: take them away.**"],
        MIDPOINT,
        [
          "**Midpoint: average the xs, average the ys. Length: take them away.**",
          "(2, 8) and (6, 4): midpoint (4, 6).",
          "From A to M, then the same again, reaches B.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    POINT,
  ),
});

// ---------------------------------------------------------------------------------------------
// Rotations.

const ROTATE = "gf-transformations/rotate";
const rotateMethod = [
  "Find the centre: the point that doesn't move.",
  "Find the angle: a quarter turn is 90°, a half turn 180°.",
  "Say the direction: clockwise or anticlockwise.",
];
const cw = (q: Point) => ({ x: q.y, y: -q.x });
const acw = (q: Point) => ({ x: -q.y, y: q.x });
const half = (q: Point) => ({ x: -q.x, y: -q.y });
const TURNED = pair(half);
const TURNS = ["90° clockwise about (0, 0)", "90° anticlockwise about (0, 0)", "180° about (0, 0)"];
const turn = (f: (q: Point) => Point, right: string, extra: Record<string, unknown>) =>
  pick(
    "Describe the rotation from A to B.",
    right,
    TURNS.filter((t) => t !== right),
    "Angle, direction and centre.",
    {
      asks: "description",
      picture: pair(f),
      ...extra,
    },
  );

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
        ["**A rotation needs three facts: angle, direction and centre.**"],
        TURNED,
        "This is 180° about (0, 0). Tracing paper helps.",
      ),

      ...owned(TR, ROTATE, "Warm-up", "Check you remember"),

      methodCard("The method", rotateMethod, TURNED),
      workedFrom(TR, ROTATE),
      calc(
        "Your turn",
        "Rotate (2, 5) by 180° about (0, 0).",
        undefined,
        [
          ["$x$ becomes", "-2", "A half turn changes its sign."],
          ["$y$ becomes", "-5", "And this one too."],
        ],
        "(2, 5) goes to (−2, −5).",
      ),

      calc(
        "Practise",
        "Rotate (5, 1) by 180° about (2, 0).",
        undefined,
        [
          ["$x$ becomes", "-1", "3 right of the centre: go 3 left."],
          ["$y$ becomes", "-1", "1 up from the centre: go 1 down."],
        ],
        "(5, 1) goes to (−1, −1).",
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
          pick(
            "(−3, 2) rotated 180° about (0, 0)?",
            "(3, −2)",
            ["(3, 2)", "(−3, −2)"],
            "Both signs change.",
            {
              asks: "image",
              changed: "A point.",
            },
          ),
        ],
        "Angle, direction, centre: all three.",
      ),

      questionSet(
        "Variation",
        "A half turn about (0, 0). Watch what changes.",
        [
          pick("Where does (4, 3) go?", "(−4, −3)", ["(−4, 3)", "(4, −3)"], "Both signs change.", {
            asks: "image",
            expect: [
              "Ali turns (4, 3) and gets (−4, 3). Right?",
              "No",
              "A half turn changes both signs: (−4, −3).",
              [["Yes", "Both signs change."]],
            ],
          }),
          pick("Where does (4, −3) go?", "(−4, 3)", ["(−4, −3)", "(4, 3)"], "Both signs change.", {
            asks: "image",
            changed: "A negative y.",
          }),
          pick("Where does (0, 3) go?", "(0, −3)", ["(0, 3)", "(−3, 0)"], "0 stays 0.", {
            asks: "image",
            changed: "On the y-axis.",
          }),
          pick("Where does (−4, −3) go?", "(4, 3)", ["(−4, 3)", "(4, −3)"], "Both signs change.", {
            asks: "image",
            changed: "Both negative.",
          }),
        ],
        "A half turn about (0, 0) changes both signs.",
      ),
      own(TR, ROTATE, "Spot the mistake"),

      own(TR, ROTATE, "Exit check"),

      reworded(
        TR,
        ROTATE,
        "“Describe fully the single transformation that maps A onto B.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A rotation needs three facts: angle, direction and centre.**"],
        TURNED,
        [
          "**A rotation needs three facts: angle, direction and centre.**",
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
// Reflections.

const REFLECT = "gf-transformations/reflect";
const reflectMethod = [
  "Find the mirror line: halfway between A and B.",
  "Each corner goes straight across, the same distance past it.",
  "Name it by its equation: $x = a$, $y = b$ or $y = x$.",
];
const flipY = (q: Point) => ({ x: -q.x, y: q.y });
const flipX = (q: Point) => ({ x: q.x, y: -q.y });
const FLIPPED = pair(flipX);
const LINES = ["The x-axis", "The y-axis", "$y = x$", "$x = 1$", "$x = 2$"];
const mirror = (
  f: (q: Point) => Point,
  right: string,
  extra: Record<string, unknown>,
  verticals?: number[],
) =>
  pick(
    "Name the mirror line.",
    right,
    LINES.filter((l) => l !== right).slice(0, 2),
    "Halfway between A and B.",
    {
      asks: "mirror line",
      picture: pair(f, verticals ? { verticals } : {}),
      ...extra,
    },
  );

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
        "Here the mirror line is the x-axis, $y = 0$.",
      ),

      ...owned(TR, REFLECT, "Warm-up", "Check you remember"),

      methodCard("The method", reflectMethod, FLIPPED),
      workedFrom(TR, REFLECT),
      calc(
        "Your turn",
        "Reflect (2, 5) in the x-axis.",
        undefined,
        [
          ["$x$ stays", "2", "It doesn't move across."],
          ["$y$ becomes", "-5", "Straight over the x-axis."],
        ],
        "(2, 5) goes to (2, −5).",
      ),

      calc(
        "Practise",
        "Reflect (5, 2) in the line $x = 3$.",
        undefined,
        [
          ["Distance from the mirror:", "2", "From 3 to 5."],
          ["New x: $3 - 2 =$", "1", "The same distance past it."],
        ],
        "(5, 2) goes to (1, 2).",
      ),
      ...owned(TR, REFLECT, "Together", "Practise"),
      ...owned(TR, REFLECT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          mirror(flipY, "The y-axis", {}),
          mirror(flipX, "The x-axis", { changed: "Up and down." }),
          mirror(
            (q) => ({ x: 4 - q.x, y: q.y }),
            "$x = 2$",
            { changed: "A line off the axis." },
            [2],
          ),
          pick(
            "(1, 6) reflected in the x-axis?",
            "(1, −6)",
            ["(−1, 6)", "(−1, −6)"],
            "y changes sign.",
            {
              asks: "image",
              changed: "A point.",
            },
          ),
        ],
        "Halfway between A and B is the mirror.",
      ),

      questionSet(
        "Variation",
        "Name the mirror line. Watch what changes.",
        [
          pick(
            "(5, 1) goes to (5, −1).",
            "The x-axis",
            ["The y-axis", "$y = x$"],
            "y changed sign.",
            {
              asks: "mirror line",
              expect: [
                "For (5, 1) to (5, −1), Ivy says the y-axis. Right?",
                "No",
                "y changed sign: it flipped over the x-axis.",
                [["Yes", "Which way did it flip?"]],
              ],
            },
          ),
          pick(
            "(5, 1) goes to (−5, 1).",
            "The y-axis",
            ["The x-axis", "$y = x$"],
            "x changed sign.",
            {
              asks: "mirror line",
              changed: "x changes sign.",
            },
          ),
          pick("(5, 1) goes to (1, 5).", "$y = x$", ["The x-axis", "The y-axis"], "They swap.", {
            asks: "mirror line",
            changed: "They swap.",
          }),
          pick(
            "(5, 1) goes to (−1, 1).",
            "$x = 2$",
            ["The y-axis", "$x = 3$"],
            "Halfway between 5 and −1.",
            {
              asks: "mirror line",
              changed: "Halfway is 2.",
            },
          ),
        ],
        "See which coordinate changes, then find halfway.",
      ),
      own(TR, REFLECT, "Spot the mistake"),

      own(TR, REFLECT, "Exit check"),

      reworded(
        TR,
        REFLECT,
        "“Describe fully the transformation from A to B.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A reflection flips each corner the same distance to the other side.**"],
        FLIPPED,
        [
          "**A reflection flips each corner the same distance to the other side.**",
          "Up and down: the x-axis. Left and right: the y-axis.",
          "In $y = x$, the coordinates swap.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    POINT,
  ),
});

// ---------------------------------------------------------------------------------------------
// Translations.

const TRANSLATE = "gf-transformations/translate";
const translateMethod = [
  "Pick one corner of A and its match on B.",
  "Count across: right is +, left is −.",
  "Count up (+) or down (−). Across on top.",
];
const SLID = pair(by(-3, -2));
const describe = (
  dx: number,
  dy: number,
  others: [number, number][],
  extra: Record<string, unknown>,
) =>
  pick(
    "Describe the translation from A to B.",
    vec(dx, dy),
    others.map(([x, y]) => vec(x, y)),
    "Across on top, then up or down.",
    { asks: "vector", picture: pair(by(dx, dy)), ...extra },
  );

const translate = stepped(find(TR, TRANSLATE), {
  method: translateMethod,
  variation: {
    relationship: "a slide and its vector",
    unknowns: ["vector", "image"],
    surface: ["left", "down", "only across", "only up"],
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
      reworded(TR, TRANSLATE, `Translate A by ${vec(-4, 1)}`, { tag: "The rule" }),

      ...owned(TR, TRANSLATE, "Warm-up", "Check you remember"),

      methodCard("The method", translateMethod, SLID),
      workedFrom(TR, TRANSLATE),
      calc(
        "Your turn",
        "Describe the translation from A to B.",
        pair(by(4, -2)),
        [
          ["Across:", "4", "4 right."],
          ["Up or down:", "-2", "2 down."],
        ],
        `The vector is ${vec(4, -2)}.`,
      ),

      calc(
        "Practise",
        `Translate (−2, 3) by ${vec(5, -4)}.`,
        undefined,
        [
          ["$x$: $-2 + 5 =$", "3", "Add the across."],
          ["$y$: $3 - 4 =$", "-1", "Add the up."],
        ],
        "It goes to (3, −1).",
      ),
      ...owned(TR, TRANSLATE, "Together", "Practise"),
      ...owned(TR, TRANSLATE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          describe(
            2,
            3,
            [
              [3, 2],
              [-2, -3],
            ],
            {},
          ),
          describe(
            -2,
            3,
            [
              [2, 3],
              [3, -2],
            ],
            { changed: "Now left." },
          ),
          describe(
            -2,
            -3,
            [
              [-2, 3],
              [-3, -2],
            ],
            { changed: "Now down too." },
          ),
          pick(
            `(1, −2) moves by ${vec(-3, 4)}. Where to?`,
            "(−2, 2)",
            ["(4, −6)", "(−2, −6)"],
            "Add each part.",
            {
              asks: "image",
              changed: "Use the vector.",
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
            -3,
            4,
            [
              [4, -3],
              [3, 4],
            ],
            {
              expect: [
                `For 3 left, 4 up, Ian writes ${vec(4, -3)}. Right?`,
                "No",
                `Across on top: −3. Up underneath: 4. ${vec(-3, 4)}.`,
                [["Yes", "Across goes on top."]],
              ],
            },
          ),
          describe(
            -3,
            -4,
            [
              [-3, 4],
              [-4, -3],
            ],
            { changed: "Down, not up." },
          ),
          describe(
            -4,
            0,
            [
              [0, -4],
              [4, 0],
            ],
            { changed: "Only across." },
          ),
          describe(
            0,
            3,
            [
              [3, 0],
              [0, -3],
            ],
            { changed: "Only up." },
          ),
        ],
        "Across first, then up or down, signs and all.",
      ),
      own(TR, TRANSLATE, "Spot the mistake"),

      own(TR, TRANSLATE, "Exit check"),

      reworded(
        TR,
        TRANSLATE,
        "“Describe fully the transformation from A to B.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A translation slides every corner the same way: write it as a vector.**"],
        SLID,
        [
          "**A translation slides every corner the same way: write it as a vector.**",
          `2 left, 5 up: ${vec(-2, 5)}.`,
          "Write “translation by” and the vector.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    POINT,
  ),
});

// ---------------------------------------------------------------------------------------------
// Enlargements.

const ENLARGE = "gf-transformations/enlarge";
const enlargeMethod = [
  "Find each corner's distance from the centre.",
  "Multiply it by the scale factor.",
  "Plot the new corners from the centre.",
];
const corner: Range = { xMin: 0, xMax: 7, yMin: 0, yMax: 7 };
const GROWN: Picture = {
  kind: "graph",
  range: corner,
  points: [p(0, 0)],
  shapes: [
    { points: T, label: "A" },
    { points: T.map((q) => ({ x: 2 * q.x, y: 2 * q.y })), tone: "image", label: "B" },
  ],
};

const enlarge = stepped(find(TR, ENLARGE), {
  method: enlargeMethod,
  variation: {
    relationship: "an enlargement multiplies every length by the scale factor",
    unknowns: ["length", "scale factor"],
    surface: ["whole numbers", "fractions", "smaller images"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Enlarge",
        ["**Multiply every distance from the centre by the scale factor.**"],
        GROWN,
        "Scale factor 2 from (0, 0). Below 1, it shrinks.",
      ),
      reworded(TR, ENLARGE, "Scale factor 3: a side of 2 cm becomes", { tag: "The rule" }),

      ...owned(TR, ENLARGE, "Warm-up", "Check you remember"),

      methodCard("The method", enlargeMethod, GROWN),
      workedFrom(TR, ENLARGE),
      calc(
        "Your turn",
        "Scale factor 3, centre (0, 0). Where does (2, 1) go?",
        undefined,
        [
          ["$x$:", "6", "2 × 3."],
          ["$y$:", "3", "1 × 3."],
        ],
        "(2, 1) goes to (6, 3).",
      ),

      calc(
        "Practise",
        "Scale factor ½, centre (0, 0). Where does (8, 4) go?",
        undefined,
        [
          ["$x$:", "4", "Half of 8."],
          ["$y$:", "2", "Half of 4."],
        ],
        "(8, 4) goes to (4, 2).",
      ),
      ...owned(TR, ENLARGE, "Together", "Practise"),
      reworded(
        TR,
        ENLARGE,
        "A square of side 9 cm is enlarged by scale factor $\\frac13$. New side?",
        {
          tag: "Practise",
          title: "A 9 cm square, scale factor $\\frac13$. New side?",
        },
      ),
      reworded(TR, ENLARGE, "A has sides 4 and 6. B has sides 10 and 15. Scale factor A to B?", {
        tag: "Practise",
        title: "A: sides 4 and 6. B: sides 10 and 15. Scale factor?",
      }),
      questionSet(
        "Practise",
        "A 6 cm side is enlarged. Watch what changes.",
        [
          ask("Scale factor 2", "12", "6 × 2.", "12 cm.", { asks: "length", unit: "cm" }),
          ask("Scale factor 3", "18", "6 × 3.", "18 cm.", {
            asks: "length",
            unit: "cm",
            changed: "Bigger factor.",
          }),
          ask("Scale factor ½", "3", "6 × ½.", "3 cm.", {
            asks: "length",
            unit: "cm",
            changed: "A fraction.",
          }),
          ask("Scale factor ⅓", "2", "6 × ⅓.", "2 cm.", {
            asks: "length",
            unit: "cm",
            changed: "A smaller fraction.",
          }),
        ],
        "Multiply by the scale factor, even a fraction.",
      ),

      questionSet(
        "Variation",
        "Find the scale factor. Watch what changes.",
        [
          ask("4 cm becomes 12 cm", "3", "12 ÷ 4.", "3.", {
            asks: "scale factor",
            expect: [
              "4 cm to 12 cm: Ola says scale factor 8. Right?",
              "No",
              "Lengths multiply: $12 \\div 4 = 3$.",
              [["Yes", "Enlarging multiplies; it doesn't add."]],
            ],
          }),
          ask("4 cm becomes 10 cm", "2.5", "10 ÷ 4.", "2.5.", {
            asks: "scale factor",
            changed: "Not a whole number.",
          }),
          ask("4 cm becomes 2 cm", ["0.5", "1/2", "½"], "2 ÷ 4.", "½.", {
            asks: "scale factor",
            changed: "Smaller.",
          }),
          ask("4 cm becomes 4 cm", "1", "4 ÷ 4.", "1.", {
            asks: "scale factor",
            changed: "The same.",
          }),
        ],
        "Scale factor = new length ÷ old length.",
      ),
      reworded(TR, ENLARGE, "Where did it go wrong?", {
        text: "Ola enlarges a 5 cm by 3 cm rectangle, scale factor 2.",
      }),

      own(TR, ENLARGE, "Exit check"),

      reworded(
        TR,
        ENLARGE,
        "“Enlarge A by scale factor $\\frac12$, centre $(0, 0)$.” Where does $(6, 2)$ go?",
        {
          tag: "Real life",
          title: "Scale factor $\\frac12$, centre $(0, 0)$. Where does $(6, 2)$ go?",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply every distance from the centre by the scale factor.**"],
        GROWN,
        [
          "**Multiply every distance from the centre by the scale factor.**",
          "Lengths multiply; angles stay the same.",
          "A scale factor below 1 makes it smaller.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    POINT,
  ),
});

export const gfTransformationsStepped: [string, UnitLesson[]][] = [
  [COORDS, [coordinates]],
  [PROBLEMS, [problems]],
  [ROTATE, [rotate]],
  [REFLECT, [reflect]],
  [TRANSLATE, [translate]],
  [ENLARGE, [enlarge]],
];
