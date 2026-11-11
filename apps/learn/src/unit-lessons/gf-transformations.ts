// GCSE Foundation, "Coordinates and transformations", as six short lessons, one just before each
// skill: coordinates in four quadrants, problems on coordinate axes, and rotating, reflecting,
// translating and enlarging shapes (fractional scale factors too). Each recaps the Key Stage 3
// idea quickly, builds it to GCSE level, names the common mistakes and ends on an exam-style
// check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, Point, Range, Scene, UnitLesson } from "./types.ts";

const U = "gf-transformations";
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
const pair = (f: (p: Point) => Point, extra: Partial<Scene> = {}): Picture => ({
  kind: "graph",
  ...scene({
    shapes: [
      { points: T, label: "A" },
      { points: move(f), tone: "image", label: "B" },
    ],
    ...extra,
  }),
});
const vec = (x: number, y: number) => `$\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$`;
const pts = (points: Point[], r: Range = range): Picture => ({ kind: "graph", range: r, points });
/** A, moved one to the right, and its reflection in x = 1, with or without the mirror drawn. */
const A1 = move((p) => ({ x: p.x + 1, y: p.y }));
const inX1 = (mirror: boolean): Picture => ({
  kind: "graph",
  range,
  ...(mirror ? { verticals: [1] } : {}),
  shapes: [
    { points: A1, label: "A" },
    { points: A1.map((p) => ({ x: 2 - p.x, y: p.y })), tone: "image", label: "B" },
  ],
});
const big: Point[] = [
  { x: 2, y: 2 },
  { x: 6, y: 2 },
  { x: 2, y: 6 },
];

export const gfTransformations: UnitLesson[] = [
  lesson(
    U,
    "coordinates",
    "GF-A8",
    "Coordinates in four quadrants",
    "Across, then up or down: coordinates below zero too.",
    [
      problem(
        "The orienteering map",
        [
          "An orienteering map puts its axes through the start. Checkpoints are at $(-3, 2)$ and $(4, -5)$.",
          "Where are they? By the end of this lesson, you can find and write any point.",
        ],
        { kind: "graph", range, star: { x: -3, y: 2 } },
      ),
      choose("Warm-up", "In $(5, 2)$, which number is $x$?", "5", "$x$ first: across.", [
        ["2", "$x$ comes first."],
      ]),
      {
        kind: "plot",
        tag: "Warm-up",
        title: "Plot $(3, 4)$",
        scene: { range },
        targets: [{ x: 3, y: 4 }],
        hint: "3 across, 4 up.",
        done: "$(3, 4)$.",
      },
      explain(
        "Discover",
        "Past zero",
        [
          "Negative $x$ goes **left**; negative $y$ goes **down**. The axes make four quadrants.",
          "Always across first, then up or down: $(x, y)$.",
        ],
        pts([
          { x: 3, y: 2 },
          { x: -3, y: 2 },
          { x: -3, y: -2 },
          { x: 3, y: -2 },
        ]),
      ),
      {
        kind: "plot",
        tag: "Discover",
        title: "Plot $(-4, -1)$",
        scene: { range },
        targets: [{ x: -4, y: -1 }],
        hint: "4 left, 1 down.",
        done: "$(-4, -1)$: bottom left.",
      },
      worked(
        "Read a point",
        "Write the coordinates of the point.",
        [
          ["Across: 2 left, so $x = -2$", "Left is negative."],
          ["Down 5, so $y = -5$", "Down is negative."],
          ["$(-2, -5)$", "$x$ first."],
        ],
        "Across, then up or down.",
        pts([{ x: -2, y: -5 }]),
      ),
      {
        kind: "plot",
        tag: "Together",
        title: "Plot these in order",
        text: "$(2, -3)$, then $(-5, 0)$, then $(0, 4)$.",
        scene: { range },
        targets: [
          { x: 2, y: -3 },
          { x: -5, y: 0 },
          { x: 0, y: 4 },
        ],
        hint: "A 0 means stay on that axis.",
        done: "Points on an axis have a 0.",
      },
      choose("Together", "Which quadrant is $(-1, 6)$ in?", "Top left", "Left and up.", [
        ["Top right", "$x$ is negative: left."],
        ["Bottom left", "$y$ is positive: up."],
      ]),
      {
        kind: "plot",
        tag: "Your turn",
        title: "Make a rectangle",
        text: "Plot $(-3, 2)$, $(4, 2)$, $(4, -1)$, $(-3, -1)$ in order.",
        scene: { range },
        targets: [
          { x: -3, y: 2 },
          { x: 4, y: 2 },
          { x: 4, y: -1 },
          { x: -3, y: -1 },
        ],
        join: true,
        hint: "Across first, then up or down.",
        done: "A 7 by 3 rectangle.",
      },
      choose(
        "Your turn",
        "Write the coordinates",
        "$(5, -2)$",
        "5 right, 2 down.",
        [
          ["$(-2, 5)$", "$x$ first."],
          ["$(5, 2)$", "It's below the axis."],
        ],
        { picture: pts([{ x: 5, y: -2 }]) },
      ),
      choose(
        "Watch out",
        "Abi plots $(2, -3)$ by going 3 left and 2 up. What's wrong?",
        "She swapped them: 2 right, then 3 down",
        "The first number is always across.",
        [["Nothing", "$(2, -3)$ and $(-3, 2)$ are different points."]],
      ),
      mistake(
        "Dan reads a point 4 left and 3 up.",
        ["Across: 4 left", "Up: 3", "So it's $(3, -4)$"],
        2,
        "$x$ first, and left is negative: $(-4, 3)$.",
      ),
      {
        kind: "plot",
        tag: "Back to the problem",
        title: "“Mark checkpoint $(4, -5)$ on the map.”",
        scene: { range },
        targets: [{ x: 4, y: -5 }],
        hint: "4 right, 5 down.",
        done: "Right 4, down 5.",
      },
      quiz([
        [
          [
            "Coordinates of the point?",
            "$(-3, 4)$",
            ["$(4, -3)$", "$(3, 4)$"],
            "3 left, 4 up.",
            pts([{ x: -3, y: 4 }]),
          ],
          [
            "Write the coordinates of this point",
            "$(1, -5)$",
            ["$(-5, 1)$", "$(1, 5)$"],
            "1 right, 5 down.",
            pts([{ x: 1, y: -5 }]),
          ],
        ],
        [
          [
            "Which quadrant is $(4, -2)$?",
            "Bottom right",
            ["Top right", "Bottom left"],
            "Right, down.",
          ],
          [
            "Which quadrant is $(-5, -5)$?",
            "Bottom left",
            ["Top left", "Bottom right"],
            "Left, down.",
          ],
        ],
        [
          ["A point on the $y$-axis has", "$x = 0$", ["$y = 0$", "$x = y$"], "Not left or right."],
          ["A point on the $x$-axis has", "$y = 0$", ["$x = 0$", "$x = y$"], "Not up or down."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "problems",
    "GF-G11",
    "Problems on coordinate axes",
    "Midpoints, missing corners and lengths on a grid.",
    [
      problem(
        "The missing corner",
        [
          "“$A(1, 1)$, $B(5, 1)$ and $C(5, 4)$ are three corners of rectangle ABCD. Find D. Then find the midpoint of AC.”",
          "By the end of this lesson, you can solve coordinate puzzles like this.",
        ],
        {
          kind: "graph",
          range: { xMin: -1, xMax: 6, yMin: -1, yMax: 5 },
          shapes: [
            {
              points: [
                { x: 1, y: 1 },
                { x: 5, y: 1 },
                { x: 5, y: 4 },
              ],
              label: "ABC",
            },
          ],
        },
      ),
      typed("Warm-up", "Halfway between 2 and 8?", "5", "Add and halve.", "5."),
      typed("Warm-up", "How far from $x = 1$ to $x = 5$?", "4", "$5 - 1$.", "4 units."),
      explain(
        "Discover",
        "Midpoints and lengths",
        [
          "The **midpoint** of two points: average the $x$s, average the $y$s.",
          "A horizontal line's length is the difference in $x$; a vertical one's, the difference in $y$.",
        ],
        {
          kind: "maths",
          tex: "\\text{midpoint} = \\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)",
        },
      ),
      choose(
        "Discover",
        "Midpoint of $(2, 3)$ and $(6, 9)$",
        "$(4, 6)$",
        "Average each: $\\frac{8}{2}$, $\\frac{12}{2}$.",
        [
          ["$(8, 12)$", "Halve the totals."],
          ["$(4, 3)$", "Average the $y$s too."],
        ],
      ),
      worked(
        "The rectangle",
        "A(1, 1), B(5, 1), C(5, 4). Find D.",
        [
          ["AB goes 4 right; so DC must too", "Opposite sides match."],
          ["D is 4 left of C: $(1, 4)$", "Above A."],
        ],
        "D(1, 4). Sketch it to check.",
      ),
      steps(
        "Together",
        "Midpoint of A(1, 1) and C(5, 4)",
        "Average.",
        [
          ["$x$: $\\frac{1 + 5}{2} =$", "3", ["6", "Halve the total."], "$x = 3$"],
          ["$y$: $\\frac{1 + 4}{2} =$", "2.5", ["5", "Halve 5."], "$(3, 2.5)$"],
        ],
        "Midpoints can be decimals.",
      ),
      choose(
        "Together",
        "Midpoint of $(-4, 2)$ and $(2, -6)$",
        "$(-1, -2)$",
        "$\\frac{-2}{2}$, $\\frac{-4}{2}$.",
        [
          ["$(-3, 4)$", "Add, then halve."],
          ["$(3, -2)$", "$-4 + 2 = -2$."],
        ],
      ),
      choose("Your turn", "Square PQRS: P(0, 0), Q(3, 0), R(3, 3). S is", "$(0, 3)$", "Above P.", [
        ["$(3, 0)$", "That's Q."],
        ["$(0, -3)$", "Above, not below."],
      ]),
      typed(
        "Your turn",
        "Length of the line from $(-2, 3)$ to $(5, 3)$",
        "7",
        "Same $y$: difference in $x$.",
        "$5 - (-2) = 7$ units.",
        { wrong: [["3", "Subtracting −2 adds 2."]] },
      ),
      choose(
        "Watch out",
        "For the midpoint of $(2, 8)$ and $(6, 4)$, Ed subtracts: $(4, 4) \\div 2 = (2, 2)$. What's wrong?",
        "Add, then halve: $(4, 6)$",
        "The midpoint averages the coordinates.",
        [["Nothing", "Halfway between 2 and 6 is 4."]],
      ),
      mistake(
        "M is the midpoint of A(2, 1) and B. M is (5, 4). Kim finds B.",
        ["A to M: 3 right, 3 up", "B is 3 more right and up from M", "B is $(5, 4)$"],
        2,
        "Go on from M: $B = (8, 7)$.",
      ),
      choose(
        "Back to the problem",
        "“A(1, 1), B(5, 1), C(5, 4). Find D and the midpoint of AC.”",
        "D(1, 4), midpoint $(3, 2.5)$",
        "Rectangle, then average.",
        [
          ["D(4, 1), midpoint $(3, 2.5)$", "D is above A."],
          ["D(1, 4), midpoint $(6, 5)$", "Halve the totals."],
        ],
      ),
      quiz([
        [
          ["Midpoint of $(0, 0)$ and $(8, 6)$", "$(4, 3)$", ["$(8, 6)$", "$(4, 6)$"], "Average."],
          ["Midpoint of $(2, 2)$ and $(6, 10)$", "$(4, 6)$", ["$(8, 12)$", "$(2, 4)$"], "Average."],
        ],
        [
          ["Length from $(1, -2)$ to $(1, 5)$", "7", ["3", "6"], "$5 - (-2)$."],
          ["Length from $(-3, 4)$ to $(6, 4)$", "9", ["3", "10"], "$6 - (-3)$."],
        ],
        [
          ["Midpoint of $(-2, 5)$ and $(4, 1)$", "$(1, 3)$", ["$(3, 3)$", "$(2, 6)$"], "Average."],
          [
            "Midpoint of $(-6, -2)$ and $(2, 4)$",
            "$(-2, 1)$",
            ["$(-4, 2)$", "$(4, 1)$"],
            "Average.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "rotate",
    "GF-G7.a",
    "Rotations",
    "Turn a shape: give the angle, direction and centre.",
    [
      problem(
        "The exam question",
        [
          "“Describe fully the single transformation that maps shape A onto shape B.” A turn is worth 3 marks: one each for three facts.",
          "By the end of this lesson, you can rotate a shape and describe a rotation fully.",
        ],
        pair((p) => ({ x: -p.y, y: p.x }), { points: [{ x: 0, y: 0 }] }),
      ),
      choose("Warm-up", "A quarter turn is", "90°", "360 ÷ 4.", [["45°", "A quarter of 360."]]),
      choose("Warm-up", "Clockwise turns", "the way a clock's hands go", "12 towards 3.", [
        ["the other way", "That's anticlockwise."],
      ]),
      explain(
        "Discover",
        "Three facts",
        [
          "A **rotation** needs three facts: the **angle**, the **direction** (clockwise or anticlockwise) and the **centre**.",
          "Tracing paper helps: trace the shape, pin the centre, turn the paper.",
        ],
        pair((p) => ({ x: p.y, y: -p.x }), { points: [{ x: 0, y: 0 }] }),
      ),
      {
        kind: "plot",
        tag: "Discover",
        title: "Rotate A 180° about $(0, 0)$",
        scene: scene({ points: [{ x: 0, y: 0 }] }),
        targets: move((p) => ({ x: -p.x, y: -p.y })),
        join: true,
        hint: "A half turn sends $(x, y)$ to $(-x, -y)$.",
        done: "Every point went to the opposite side of the centre.",
      },
      worked(
        "Describe it fully",
        "Describe the transformation from A to B.",
        [
          ["B has turned a quarter turn", "Angle: 90°."],
          ["The other way to a clock", "Anticlockwise."],
          ["About the origin", "Centre $(0, 0)$."],
        ],
        "Rotation 90° anticlockwise about $(0, 0)$.",
        pair((p) => ({ x: -p.y, y: p.x }), { points: [{ x: 0, y: 0 }] }),
      ),
      {
        kind: "plot",
        tag: "Together",
        title: "Rotate A 90° clockwise about $(0, 0)$",
        scene: scene({ points: [{ x: 0, y: 0 }] }),
        targets: move((p) => ({ x: p.y, y: -p.x })),
        join: true,
        hint: "$(1, 1)$ goes to $(1, -1)$; $(3, 1)$ to $(1, -3)$.",
        done: "90° clockwise about the origin: $(x, y) \\to (y, -x)$.",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Rotate A 180° about $(2, 0)$",
        text: "A different centre: each point goes to the other side of $(2, 0)$, the same distance away.",
        scene: scene({ points: [{ x: 2, y: 0 }] }),
        targets: move((p) => ({ x: 4 - p.x, y: -p.y })),
        join: true,
        hint: "$(1, 1)$ is 1 left and 1 up from $(2, 0)$, so it goes 1 right and 1 down: $(3, -1)$.",
        done: "The centre changes where the image lands.",
      },
      choose(
        "Your turn",
        "Describe the rotation from A to B",
        "180° about $(0, 0)$",
        "A half turn: direction doesn't matter.",
        [
          ["90° clockwise about $(0, 0)$", "It's upside down: a half turn."],
          ["Reflection in the $x$-axis", "It's turned, not flipped."],
        ],
        { picture: pair((p) => ({ x: -p.x, y: -p.y }), { points: [{ x: 0, y: 0 }] }) },
      ),
      choose(
        "Your turn",
        "90° clockwise is the same as",
        "270° anticlockwise",
        "Three quarters the other way.",
        [["90° anticlockwise", "That turns the other way."]],
      ),
      choose(
        "Watch out",
        "Sam writes “rotation 90° clockwise”. How many marks?",
        "2 of 3: the centre is missing",
        "Angle, direction and centre.",
        [["3", "Always give the centre."]],
      ),
      mistake(
        "Jen rotates $(3, 2)$ by 180° about the origin.",
        ["A half turn about $(0, 0)$", "$(x, y)$ goes to $(-x, -y)$", "So $(3, 2) \\to (-3, 2)$"],
        2,
        "Both signs change: $(-3, -2)$.",
      ),
      choose(
        "Back to the problem",
        "“Describe fully the single transformation that maps A onto B.”",
        "Rotation, 90° anticlockwise, centre $(0, 0)$",
        "All three facts.",
        [
          ["Rotation 90°", "Direction and centre are missing."],
          [
            "Rotation 90° clockwise, centre $(0, 0)$",
            "Clockwise would turn it below the $x$-axis.",
          ],
        ],
        { picture: pair((p) => ({ x: -p.y, y: p.x }), { points: [{ x: 0, y: 0 }] }) },
      ),
      quiz([
        [
          [
            "$(4, 1)$ rotated 180° about the origin",
            "$(-4, -1)$",
            ["$(-4, 1)$", "$(1, 4)$"],
            "Both signs change.",
          ],
          [
            "$(-2, 5)$ rotated 180° about the origin",
            "$(2, -5)$",
            ["$(2, 5)$", "$(5, -2)$"],
            "Both signs change.",
          ],
        ],
        [
          [
            "Describe a rotation with",
            "angle, direction, centre",
            ["a vector", "a mirror line"],
            "Three facts.",
          ],
          ["A rotation needs a", "centre", ["mirror line", "vector"], "And angle and direction."],
        ],
        [
          [
            "180° clockwise equals",
            "180° anticlockwise",
            ["90° anticlockwise", "360°"],
            "Half turns match.",
          ],
          [
            "270° clockwise equals",
            "90° anticlockwise",
            ["90° clockwise", "180°"],
            "Three quarters one way.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "reflect",
    "GF-G7.b",
    "Reflections",
    "Flip a shape: give the mirror line as an equation.",
    [
      problem(
        "The exam question",
        [
          "“Reflect shape A in the line $y = x$.” and “Describe fully the transformation from A to B.” Mirror lines are given as equations.",
          "By the end of this lesson, you can reflect in any line and name it.",
        ],
        inX1(false),
      ),
      choose(
        "Warm-up",
        "The line $x = 3$ is",
        "upright, through 3 on the $x$-axis",
        "Every point has $x = 3$.",
        [["flat, through 3 on the $y$-axis", "That's $y = 3$."]],
      ),
      choose("Warm-up", "The line $y = x$ goes through", "$(2, 2)$", "$y$ equals $x$.", [
        ["$(2, 0)$", "$y$ must equal $x$."],
      ]),
      explain(
        "Discover",
        "Same distance, other side",
        [
          "A **reflection** flips a shape over a mirror line. Each point goes straight across, the same distance on the other side.",
          "Describe it with the **mirror line's equation**: $x = 1$, $y = -2$, $y = x$, the $x$-axis ($y = 0$)…",
        ],
        pair((p) => ({ x: -p.x, y: p.y }), { verticals: [0] }),
      ),
      {
        kind: "plot",
        tag: "Discover",
        title: "Reflect A in the $x$-axis",
        scene: scene({ lines: [{ m: 0, c: 0 }] }),
        targets: move((p) => ({ x: p.x, y: -p.y })),
        join: true,
        hint: "Each corner the same distance below the $x$-axis.",
        done: "$(x, y) \\to (x, -y)$.",
      },
      worked(
        "Name the mirror line",
        "Describe the reflection from A to B.",
        [
          ["$(4, 1) \\to (-2, 1)$", "Follow a corner."],
          ["Halfway between $x = 4$ and $x = -2$ is $x = 1$", "The mirror is midway."],
          ["Reflection in the line $x = 1$", "Name it by its equation."],
        ],
        "The mirror line is halfway between a point and its image.",
        inX1(true),
      ),
      {
        kind: "plot",
        tag: "Together",
        title: "Reflect A in the line $y = -1$",
        scene: scene({ lines: [{ m: 0, c: -1 }] }),
        targets: move((p) => ({ x: p.x, y: -2 - p.y })),
        join: true,
        hint: "$(1, 1)$ is 2 above $y = -1$, so its image is 2 below: $(1, -3)$.",
        done: "Straight across the mirror, the same distance.",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Reflect A in the line $y = x$",
        scene: scene({ lines: [{ m: 1, c: 0 }] }),
        targets: move((p) => ({ x: p.y, y: p.x })),
        join: true,
        hint: "Reflecting in $y = x$ swaps the coordinates: $(3, 1) \\to (1, 3)$.",
        done: "In $y = x$, every $(x, y)$ becomes $(y, x)$.",
      },
      choose(
        "Your turn",
        "Describe the reflection from A to B",
        "Reflection in the $y$-axis",
        "Flipped left to right over $x = 0$.",
        [
          ["Reflection in the $x$-axis", "That flips up and down."],
          ["Rotation 180°", "It's flipped, not turned."],
        ],
        { picture: pair((p) => ({ x: -p.x, y: p.y })) },
      ),
      choose("Your turn", "$(2, 5)$ reflected in $y = x$", "$(5, 2)$", "Swap.", [
        ["$(-2, 5)$", "That's the $y$-axis."],
        ["$(2, -5)$", "That's the $x$-axis."],
      ]),
      choose(
        "Watch out",
        "Kit writes “reflection in the $x$-axis” for a shape flipped left to right. What's wrong?",
        "Left to right is over the $y$-axis",
        "The $x$-axis flips up and down.",
        [["Nothing", "The $x$-axis is horizontal: it flips up and down."]],
      ),
      mistake(
        "Max names the mirror for $(3, 2) \\to (3, -2)$.",
        [
          "$x$ stays the same; $y$ changes sign",
          "It flipped up and down",
          "Reflection in the $y$-axis",
        ],
        2,
        "Up and down is over the $x$-axis ($y = 0$).",
      ),
      choose(
        "Back to the problem",
        "“Describe fully the transformation from A to B.”",
        "Reflection in the line $x = 1$",
        "Corners and images are equal distances from $x = 1$.",
        [
          ["Reflection in the $y$-axis", "Check $(4, 1) \\to (-2, 1)$: midway is $x = 1$."],
          ["Translation", "It's flipped."],
        ],
        { picture: inX1(true) },
      ),
      quiz([
        [
          ["$(4, 3)$ in the $x$-axis", "$(4, -3)$", ["$(-4, 3)$", "$(3, 4)$"], "$y$ changes sign."],
          ["$(4, 3)$ in the $y$-axis", "$(-4, 3)$", ["$(4, -3)$", "$(3, 4)$"], "$x$ changes sign."],
        ],
        [
          ["$(1, 6)$ in $y = x$", "$(6, 1)$", ["$(-1, 6)$", "$(1, -6)$"], "Swap."],
          ["$(-3, 2)$ in $y = x$", "$(2, -3)$", ["$(3, 2)$", "$(-3, -2)$"], "Swap."],
        ],
        [
          [
            "$(5, 1)$ in $x = 2$",
            "$(-1, 1)$",
            ["$(1, 1)$", "$(5, -1)$"],
            "3 right of $x = 2$ → 3 left.",
          ],
          ["$(0, 4)$ in $y = 1$", "$(0, -2)$", ["$(0, 2)$", "$(0, -4)$"], "3 above → 3 below."],
        ],
      ]),
    ],
  ),

  lesson(U, "translate", "GF-G7.c", "Translations", "Slide a shape by a column vector.", [
    problem(
      "The game sprite",
      [
        "In a computer game, a sprite slides from A to B. “Describe fully the transformation.” The answer needs a vector.",
        "By the end of this lesson, you can translate shapes and write the vector.",
      ],
      pair((p) => ({ x: p.x + 3, y: p.y + 2 })),
    ),
    choose("Warm-up", "From $(1, 1)$, go 3 right and 2 up", "$(4, 3)$", "Add to each.", [
      ["$(3, 2)$", "Start from $(1, 1)$."],
    ]),
    choose("Warm-up", "From $(2, 3)$, go 4 left", "$(-2, 3)$", "$2 - 4$.", [
      ["$(2, -1)$", "Left changes $x$."],
    ]),
    explain(
      "Discover",
      "Column vectors",
      [
        `A **translation** slides every point the same way. Write it as a **column vector**: ${vec(3, 2)} means 3 right, 2 up.`,
        "Top number across (negative is left); bottom up (negative is down).",
      ],
      pair((p) => ({ x: p.x + 3, y: p.y + 2 })),
    ),
    {
      kind: "plot",
      tag: "Discover",
      title: `Translate A by ${vec(-4, 1)}`,
      scene: scene(),
      targets: move((p) => ({ x: p.x - 4, y: p.y + 1 })),
      join: true,
      hint: "Each corner: 4 left, 1 up.",
      done: "Every corner moved the same.",
    },
    worked(
      "Write the vector",
      "Describe the translation from A to B.",
      [
        ["$(1, 1) \\to (-3, -2)$", "Follow one corner."],
        ["4 left, 3 down", "Count."],
        [`Translation by ${vec(-4, -3)}`, "Negatives for left and down."],
      ],
      "“Describe fully”: say translation, and give the vector.",
      pair((p) => ({ x: p.x - 4, y: p.y - 3 })),
    ),
    {
      kind: "plot",
      tag: "Together",
      title: `Translate A by ${vec(2, -5)}`,
      scene: scene(),
      targets: move((p) => ({ x: p.x + 2, y: p.y - 5 })),
      join: true,
      hint: "2 right, 5 down.",
      done: "Right 2, down 5.",
    },
    choose(
      "Together",
      "Describe the translation from A to B",
      vec(2, -3),
      "2 right, 3 down.",
      [
        [vec(-3, 2), "Across goes on top."],
        [vec(2, 3), "Down is negative."],
      ],
      { picture: pair((p) => ({ x: p.x + 2, y: p.y - 3 })) },
    ),
    choose(
      "Your turn",
      "Describe the translation from A to B",
      vec(-5, 3),
      "5 left, 3 up.",
      [
        [vec(5, 3), "Left is negative."],
        [vec(3, -5), "Across on top."],
      ],
      { picture: pair((p) => ({ x: p.x - 5, y: p.y + 3 })) },
    ),
    choose("Your turn", `$(3, 4)$ translated by ${vec(-1, 2)}`, "$(2, 6)$", "$3 - 1$, $4 + 2$.", [
      ["$(4, 2)$", "Add the vector."],
      ["$(1, 6)$", "$3 - 1 = 2$."],
    ]),
    choose(
      "Watch out",
      "Jo writes the translation as “3 right, 2 up”. Full marks?",
      "Not quite: give it as a column vector",
      "Exams expect the vector.",
      [["Yes", `Write ${vec(3, 2)}.`]],
    ),
    mistake(
      "Ian describes a slide of 2 left and 5 up.",
      ["Across: 2 left, so −2", "Up: 5", `The vector is ${vec(5, -2)}`],
      2,
      `Across goes on top: ${vec(-2, 5)}.`,
    ),
    choose(
      "Back to the problem",
      "“Describe fully the transformation from A to B.”",
      `Translation by ${vec(3, 2)}`,
      "Name it and give the vector.",
      [
        [`${vec(3, 2)}`, "Say “translation” too."],
        [`Translation by ${vec(2, 3)}`, "Across on top: 3."],
      ],
      { picture: pair((p) => ({ x: p.x + 3, y: p.y + 2 })) },
    ),
    quiz([
      [
        ["Vector for 4 right, 1 down", vec(4, -1), [vec(-1, 4), vec(4, 1)], "Across on top."],
        ["Vector for 2 left, 6 up", vec(-2, 6), [vec(6, -2), vec(2, 6)], "Across on top."],
      ],
      [
        [`$(0, 5)$ by ${vec(3, -4)}`, "$(3, 1)$", ["$(-4, 8)$", "$(3, 9)$"], "Add."],
        [`$(-2, 1)$ by ${vec(5, 2)}`, "$(3, 3)$", ["$(7, 3)$", "$(-7, -1)$"], "Add."],
      ],
      [
        ["A translation changes a shape's", "position only", ["size", "orientation"], "It slides."],
        [
          "After a translation, the image is",
          "congruent",
          ["bigger", "turned"],
          "Same size and shape.",
        ],
      ],
    ]),
  ]),

  lesson(
    U,
    "enlarge",
    "GF-G7.d",
    "Enlargements",
    "Scale every distance from a centre, including by fractions.",
    [
      problem(
        "The photo",
        [
          "A photo is enlarged from a corner, then reduced to half size for a badge. “Enlarge triangle A by scale factor $\\frac12$, centre $(0, 0)$.”",
          "A scale factor less than 1 makes it smaller. By the end of this lesson, you can do both.",
        ],
        {
          kind: "graph",
          range: { xMin: -1, xMax: 7, yMin: -1, yMax: 7 },
          points: [{ x: 0, y: 0 }],
          shapes: [{ points: big, label: "A" }],
        },
      ),
      typed("Warm-up", "Work out $6 \\times \\frac12$", "3", "Half of 6.", "3."),
      typed("Warm-up", "Work out $2 \\times 3$", "6", "Times.", "6."),
      explain(
        "Discover",
        "Distances from the centre",
        [
          "An **enlargement** multiplies every **distance from the centre** by the **scale factor**. Lengths are multiplied too; angles stay the same.",
          "A scale factor between 0 and 1 makes the image **smaller**, but it's still called an enlargement.",
        ],
        {
          kind: "graph",
          range: { xMin: -1, xMax: 7, yMin: -1, yMax: 7 },
          points: [{ x: 0, y: 0 }],
          shapes: [
            { points: big, label: "A" },
            { points: big.map((p) => ({ x: p.x / 2, y: p.y / 2 })), tone: "image", label: "B" },
          ],
        },
      ),
      choose("Discover", "Scale factor 3: a side of 2 cm becomes", "6 cm", "Times 3.", [
        ["5 cm", "Multiply, don't add."],
        ["2 cm", "Lengths change; angles don't."],
      ]),
      worked(
        "Scale factor ½",
        "Enlarge A, corners $(2, 2)$, $(6, 2)$, $(2, 6)$, by scale factor $\\frac12$, centre $(0, 0)$.",
        [
          ["From $(0, 0)$, each corner's distance halves", "Centre is the origin."],
          [
            "$(2, 2) \\to (1, 1)$, $(6, 2) \\to (3, 1)$, $(2, 6) \\to (1, 3)$",
            "Halve each coordinate.",
          ],
        ],
        "Half as big, pulled towards the centre.",
      ),
      {
        kind: "plot",
        tag: "Together",
        title: "Enlarge A by scale factor $\\frac12$, centre $(0, 0)$",
        scene: {
          range: { xMin: -1, xMax: 7, yMin: -1, yMax: 7 },
          points: [{ x: 0, y: 0 }],
          shapes: [{ points: big, label: "A" }],
        },
        targets: big.map((p) => ({ x: p.x / 2, y: p.y / 2 })),
        join: true,
        hint: "Halve each coordinate (the centre is the origin).",
        done: "Every side is half as long.",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Enlarge A by scale factor 2, centre $(0, 0)$",
        scene: scene({ points: [{ x: 0, y: 0 }] }),
        targets: move((p) => ({ x: 2 * p.x, y: 2 * p.y })),
        join: true,
        hint: "Double each distance from $(0, 0)$: double the coordinates.",
        done: "Twice as far from the centre, twice as long.",
      },
      choose(
        "Your turn",
        "A square of side 9 cm is enlarged by scale factor $\\frac13$. New side?",
        "3 cm",
        "$9 \\times \\frac13$.",
        [
          ["27 cm", "$\\frac13$ makes it smaller."],
          ["9.33 cm", "Multiply by $\\frac13$."],
        ],
      ),
      choose(
        "Your turn",
        "A has sides 4 and 6. B has sides 10 and 15. Scale factor A to B?",
        "2.5",
        "$10 \\div 4$.",
        [
          ["6", "Divide image by object."],
          ["0.4", "That's B to A."],
        ],
      ),
      choose(
        "Watch out",
        "Ade enlarges by scale factor 2 but forgets the centre, drawing the image anywhere. What's wrong?",
        "Position matters: distances from the centre double",
        "The centre fixes where it goes.",
        [["Nothing", "Same size, wrong place loses marks."]],
      ),
      mistake(
        "Ola enlarges a 5 cm by 3 cm rectangle by scale factor 2.",
        ["Width: $5 \\times 2 = 10$", "Height: $3 + 2 = 5$", "So 10 by 5"],
        1,
        "Multiply every length: $3 \\times 2 = 6$. So 10 by 6.",
      ),
      choose(
        "Back to the problem",
        "“Enlarge A by scale factor $\\frac12$, centre $(0, 0)$.” Where does $(6, 2)$ go?",
        "$(3, 1)$",
        "Halve both.",
        [
          ["$(12, 4)$", "That's scale factor 2."],
          ["$(5.5, 1.5)$", "Multiply, don't subtract."],
        ],
      ),
      quiz([
        [
          ["Scale factor 3 on a 4 cm side", "12 cm", ["7 cm", "1.33 cm"], "× 3."],
          ["Scale factor 5 on a 2 cm side", "10 cm", ["7 cm", "0.4 cm"], "× 5."],
        ],
        [
          [
            "$(4, 8)$, scale factor $\\frac12$, centre origin",
            "$(2, 4)$",
            ["$(8, 16)$", "$(3.5, 7.5)$"],
            "Halve.",
          ],
          [
            "$(9, 3)$, scale factor $\\frac13$, centre origin",
            "$(3, 1)$",
            ["$(27, 9)$", "$(8.7, 2.7)$"],
            "Divide by 3.",
          ],
        ],
        [
          [
            "Scale factor $\\frac14$ makes the image",
            "smaller",
            ["bigger", "the same"],
            "Less than 1.",
          ],
          ["After an enlargement, angles", "stay the same", ["double", "halve"], "Same shape."],
        ],
      ]),
    ],
  ),
];
