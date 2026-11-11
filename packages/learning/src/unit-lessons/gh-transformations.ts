// GCSE Higher, "Transformations and similarity", as three short lessons, one just before each
// skill: enlarging by a negative scale factor, combining transformations and finding what stays
// fixed, and area and volume scale factors in similar shapes. Each recaps the Foundation idea
// quickly, builds it to Higher level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, Point, UnitLesson } from "./types.ts";

const U = "gh-transformations";
const P = (x: number, y: number): Point => ({ x, y });

const tri = [P(1, 1), P(3, 1), P(1, 2)];
const negative: Picture = {
  kind: "graph",
  range: { xMin: -7, xMax: 4, yMin: -5, yMax: 3 },
  shapes: [
    { points: tri, tone: "object", label: "A" },
    { points: tri.map((p) => P(-2 * p.x, -2 * p.y)), tone: "image", label: "B" },
  ],
  points: [P(0, 0)],
};
const flag = [P(1, 1), P(3, 1), P(3, 2)];
const combined: Picture = {
  kind: "graph",
  range: { xMin: -4, xMax: 4, yMin: -4, yMax: 4 },
  shapes: [
    { points: flag, tone: "object", label: "A" },
    { points: flag.map((p) => P(p.x, -p.y)), tone: "ghost" },
    { points: flag.map((p) => P(-p.x, -p.y)), tone: "image", label: "C" },
  ],
};
const jugs: Picture = {
  kind: "table",
  head: ["", "Small", "Large"],
  rows: [
    ["Height", "10 cm", "20 cm"],
    ["Surface area", "150 cm²", "?"],
    ["Volume", "500 cm³", "?"],
  ],
};

export const ghTransformations: UnitLesson[] = [
  lesson(
    U,
    "negative-enlargement",
    "GH-G7",
    "Negative scale factors",
    "A negative scale factor puts the image on the other side of the centre, upside down.",
    [
      problem(
        "Through the centre",
        [
          "“Enlarge triangle A by scale factor −2, centre (0, 0).” And “Describe fully the single transformation that maps B back to A.”",
          "By the end of this lesson, you can do and describe both.",
        ],
        negative,
      ),
      typed(
        "Warm-up",
        "(3, 1) enlarged by scale factor 2, centre (0, 0): new $x$?",
        "6",
        "× 2.",
        "6.",
        { unit: "x =" },
      ),
      typed("Warm-up", "$-2 \\times 3$", "-6", "Negative times positive.", "−6."),
      explain(
        "Discover",
        "Out the other side",
        [
          "With a **negative** scale factor, draw each ray from the point back **through** the centre and out the other side, scaled.",
          "The image is the right size but turned upside down (a 180° turn about the centre, as well as the enlargement).",
        ],
        negative,
      ),
      choose(
        "Discover",
        "Scale factor −2 from (0, 0) sends (1, 2) to",
        "(−2, −4)",
        "Multiply by −2.",
        [
          ["(2, 4)", "That's +2."],
          ["(−1, −2)", "Scale by 2 too."],
        ],
        { picture: negative },
      ),
      worked(
        "Triangle A",
        "A has corners (1, 1), (3, 1), (1, 2). Scale factor −2, centre (0, 0).",
        [
          ["(1, 1) → (−2, −2)", "× −2."],
          ["(3, 1) → (−6, −2), (1, 2) → (−2, −4)", "Each corner."],
        ],
        "B is twice as big and upside down.",
        negative,
      ),
      steps(
        "Together",
        "Map B back to A",
        "Describe fully.",
        [
          ["Scale factor:", "$-\\frac12$", ["−2", "B is bigger: shrink it."], "$-\\frac12$"],
          [
            "Centre:",
            "(0, 0)",
            ["(−2, −2)", "Lines joining matching corners meet at the centre."],
            "(0, 0)",
          ],
        ],
        "Enlargement, scale factor $-\\frac12$, centre (0, 0).",
        negative,
      ),
      choose(
        "Together",
        "Scale factor −1 is the same as",
        "a rotation of 180° about the centre",
        "Same size, turned.",
        [
          ["a reflection", "A reflection flips, not turns."],
          ["no change", "It moves through the centre."],
        ],
      ),
      typed(
        "Your turn",
        "(2, −1) enlarged by scale factor −3, centre (0, 0): new $x$?",
        "-6",
        "$-3 \\times 2$.",
        "−6.",
        { unit: "x =" },
      ),
      typed("Your turn", "And the new $y$?", "3", "$-3 \\times -1$.", "3.", { unit: "y =" }),
      choose(
        "Watch out",
        "Ola draws scale factor −2 on the same side as the object. What's wrong?",
        "Negative means through the centre to the other side",
        "Opposite side.",
        [["Nothing", "That's scale factor +2."]],
      ),
      mistake(
        "Ben describes the map from A to B.",
        ["Enlargement", "Scale factor 2", "Centre (0, 0)"],
        1,
        "B is upside down on the other side: scale factor −2.",
      ),
      choose(
        "Back to the problem",
        "“Describe fully the single transformation that maps B to A.”",
        "Enlargement, scale factor $-\\frac12$, centre (0, 0)",
        "Three facts.",
        [
          ["Enlargement, scale factor −2", "Missing the centre, and B to A shrinks."],
          ["Rotation 180°", "The sizes differ."],
        ],
        { picture: negative },
      ),
      quiz([
        [
          ["SF −2, centre (0, 0): (3, 2) →", "(−6, −4)", ["(6, 4)", "(−3, −2)"], "× −2."],
          ["SF −3, centre (0, 0): (1, 2) →", "(−3, −6)", ["(3, 6)", "(−1, −2)"], "× −3."],
        ],
        [
          [
            "SF −½ makes the image",
            "half size, on the other side",
            ["double, other side", "half size, same side"],
            "Negative fraction.",
          ],
          [
            "SF −1 is the same as",
            "rotation 180°",
            ["reflection in y = x", "no change"],
            "Turned.",
          ],
        ],
        [
          ["Lengths scale by $|−3|$ =", "3", ["−3", "9"], "Size."],
          [
            "An image under SF −2 is",
            "upside down",
            ["the same way up", "reflected left–right only"],
            "Through the centre.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "combined",
    "GH-G8",
    "Combining transformations",
    "Do one, then the next; then find a single transformation and what stays fixed.",
    [
      problem(
        "Two moves, one answer",
        [
          "Flag A is reflected in the $x$-axis, then reflected in the $y$-axis, giving C. “Describe fully the single transformation that maps A to C.” And “Which point is not moved?”",
          "By the end of this lesson, you can combine transformations and spot what is **invariant**.",
        ],
        combined,
      ),
      choose("Warm-up", "(3, 2) reflected in the $x$-axis", "(3, −2)", "$y$ changes sign.", [
        ["(−3, 2)", "That's the $y$-axis."],
        ["(2, 3)", "That's $y = x$."],
      ]),
      choose("Warm-up", "(3, −2) reflected in the $y$-axis", "(−3, −2)", "$x$ changes sign.", [
        ["(3, 2)", "That's the $x$-axis."],
        ["(−2, 3)", "Not swapped."],
      ]),
      explain(
        "Discover",
        "One after the other",
        [
          "Do the first transformation, then apply the second to the image. Then compare the start with the end and describe one transformation that does both.",
          "An **invariant** point doesn't move. For a reflection, every point on the mirror line is invariant; for a rotation, only the centre.",
        ],
        combined,
      ),
      choose(
        "Discover",
        "Reflect in the $x$-axis, then in the $y$-axis. (x, y) becomes",
        "(−x, −y)",
        "Both signs change.",
        [
          ["(y, x)", "That's $y = x$."],
          ["(x, y)", "It moves."],
        ],
      ),
      worked(
        "Flag A to C",
        "Single transformation?",
        [
          ["Every $(x, y) \\to (-x, -y)$", "Both signs change."],
          ["That's a rotation of 180° about (0, 0)", "Half turn."],
        ],
        "Only (0, 0) stays put: it's invariant.",
        combined,
      ),
      steps(
        "Together",
        "Rotate 90° clockwise about (0, 0), then reflect in $y = x$. Where does (2, 1) go?",
        "One at a time.",
        [
          ["Rotate:", "(1, −2)", ["(−1, 2)", "Clockwise: (x, y) → (y, −x)."], "(1, −2)"],
          ["Reflect in $y = x$:", "(−2, 1)", ["(2, −1)", "Swap the coordinates."], "(−2, 1)"],
        ],
        "(2, 1) → (−2, 1): a reflection in the $y$-axis.",
      ),
      choose(
        "Together",
        "Which points are invariant under reflection in $y = x$?",
        "Every point on $y = x$",
        "On the mirror.",
        [
          ["Only (0, 0)", "The whole line stays."],
          ["None", "The mirror line stays fixed."],
        ],
      ),
      choose(
        "Your turn",
        "Translation by $\\begin{pmatrix} 2 \\\\ 0 \\end{pmatrix}$ then by $\\begin{pmatrix} 1 \\\\ 3 \\end{pmatrix}$ is a single translation by",
        "$\\begin{pmatrix} 3 \\\\ 3 \\end{pmatrix}$",
        "Add the vectors.",
        [
          ["$\\begin{pmatrix} 2 \\\\ 3 \\end{pmatrix}$", "Add both parts."],
          ["$\\begin{pmatrix} 1 \\\\ -3 \\end{pmatrix}$", "Add, don't subtract."],
        ],
      ),
      choose(
        "Your turn",
        "How many invariant points does a translation have?",
        "None",
        "Everything moves.",
        [
          ["One", "No centre."],
          ["Infinitely many", "That's a reflection."],
        ],
      ),
      choose(
        "Watch out",
        "Kim does the second transformation to the original shape. What's wrong?",
        "The second acts on the image of the first",
        "One after the other.",
        [["Nothing", "Order matters."]],
      ),
      mistake(
        "Leo combines two reflections, in $x = 1$ then $x = 3$.",
        ["Each flips the shape", "Two flips cancel out", "So no change"],
        1,
        "Two parallel reflections make a translation: 4 to the right.",
      ),
      choose(
        "Back to the problem",
        "“Describe fully the single transformation from A to C.”",
        "Rotation 180° about (0, 0)",
        "Both signs change.",
        [
          ["Reflection in $y = x$", "That swaps coordinates."],
          ["Rotation 90° about (0, 0)", "It's a half turn."],
        ],
        { picture: combined },
      ),
      quiz([
        [
          [
            "Invariant points of a 90° rotation about (1, 1)",
            "only (1, 1)",
            ["none", "the line y = x"],
            "Centre.",
          ],
          [
            "Invariant points of reflection in the $x$-axis",
            "the whole $x$-axis",
            ["only (0, 0)", "none"],
            "Mirror.",
          ],
        ],
        [
          [
            "Reflect in $y$-axis, then $x$-axis: (2, 5) →",
            "(−2, −5)",
            ["(2, 5)", "(5, 2)"],
            "Both signs.",
          ],
          ["Reflect in $x$-axis twice: (2, 5) →", "(2, 5)", ["(2, −5)", "(−2, −5)"], "Back again."],
        ],
        [
          [
            "Two reflections in parallel lines make",
            "a translation",
            ["a rotation", "an enlargement"],
            "Slide.",
          ],
          [
            "Two reflections in crossing lines make",
            "a rotation",
            ["a translation", "an enlargement"],
            "Turn.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "area-volume-sf",
    "GH-G19",
    "Area and volume scale factors",
    "Lengths × k means areas × k² and volumes × k³.",
    [
      problem(
        "Similar jugs",
        [
          "Two jugs are mathematically similar. The small one is 10 cm tall, the large one 20 cm. “The small jug's surface area is 150 cm². Find the large jug's surface area.” And “The small one holds 500 cm³. How much does the large one hold?”",
          "By the end of this lesson, you can do both.",
        ],
        jugs,
      ),
      typed("Warm-up", "Length scale factor from 10 cm to 20 cm", "2", "$20 \\div 10$.", "2."),
      typed("Warm-up", "$2^3$", "8", "Cube.", "8."),
      explain(
        "Discover",
        "Square for area, cube for volume",
        [
          "If lengths are multiplied by $k$, areas are multiplied by $k^2$ (two directions) and volumes by $k^3$ (three directions).",
          "Doubling every length makes a shape 4 times the area and 8 times the volume.",
        ],
        jugs,
      ),
      choose("Discover", "Lengths × 3: area ×", "9", "$3^2$.", [
        ["3", "Area uses two lengths."],
        ["27", "That's volume."],
      ]),
      worked(
        "The jugs",
        "Length scale factor 2.",
        [
          ["Area: $150 \\times 2^2 = 600$ cm²", "× 4."],
          ["Volume: $500 \\times 2^3 = 4000$ cm³", "× 8."],
        ],
        "The large jug holds 4 litres.",
        jugs,
      ),
      steps(
        "Together",
        "Working back",
        "Two similar cones: volumes 54 cm³ and 2 cm³.",
        [
          ["Volume scale factor:", "27", ["52", "Divide."], "27"],
          ["Length scale factor:", "3", ["9", "Cube root of 27."], "3"],
        ],
        "From volume to length: cube root.",
      ),
      choose("Together", "Areas 20 cm² and 180 cm². Length scale factor", "3", "$\\sqrt{9}$.", [
        ["9", "That's the area factor."],
        ["160", "Divide."],
      ]),
      typed(
        "Your turn",
        "Similar boxes, lengths × 4. Small volume 10 cm³. Large volume?",
        "640",
        "$10 \\times 4^3$.",
        "640 cm³.",
        {
          unit: "cm³",
          wrong: [
            ["40", "Cube the scale factor."],
            ["160", "That's $4^2$: use $4^3$."],
          ],
        },
      ),
      typed(
        "Your turn",
        "Similar shapes, areas 5 and 45. Length scale factor?",
        "3",
        "$\\sqrt9$.",
        "3.",
      ),
      choose(
        "Watch out",
        "Raj doubles a jug's height and says it holds twice as much. What's wrong?",
        "Volume scales by $2^3 = 8$",
        "Three directions.",
        [["Nothing", "Width and depth double too."]],
      ),
      mistake(
        "Zoe compares similar tins: volumes 16 cm³ and 128 cm³, height of small 3 cm.",
        ["Volume factor: 8", "Length factor: 8", "Large height 24 cm"],
        1,
        "Length factor is $\\sqrt[3]{8} = 2$: 6 cm.",
      ),
      typed(
        "Back to the problem",
        "“How much does the large jug hold?”",
        "4000",
        "$500 \\times 8$.",
        "4000 cm³.",
        {
          unit: "cm³",
          wrong: [
            ["1000", "Cube 2: × 8."],
            ["2000", "That's × 4: use × 8."],
          ],
        },
      ),
      quiz([
        [
          ["Lengths × 5: area ×", "25", ["5", "125"], "Square."],
          ["Lengths × 5: volume ×", "125", ["25", "15"], "Cube."],
        ],
        [
          ["Area factor 16: length factor", "4", ["16", "8"], "Square root."],
          ["Volume factor 64: length factor", "4", ["8", "64"], "Cube root."],
        ],
        [
          ["Small: 3 cm³. Lengths × 2. Large", "24 cm³", ["6 cm³", "12 cm³"], "× 8."],
          ["Small: 5 cm². Lengths × 3. Large", "45 cm²", ["15 cm²", "135 cm²"], "× 9."],
        ],
      ]),
    ],
  ),
];
