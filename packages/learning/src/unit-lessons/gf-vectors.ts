// GCSE Foundation, "Vectors", as four short lessons, one just before each skill: translations as
// column vectors, adding and subtracting vectors, multiplying by a number, and vectors in
// diagrams. Each recaps the Key Stage 3 idea quickly, builds it to GCSE level, names the common
// mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Point, UnitLesson } from "./types.ts";

const U = "gf-vectors";
const P = (x: number, y: number): Point => ({ x, y });
const vec = (x: number | string, y: number | string) =>
  `$\\begin{pmatrix} ${x} \\\\ ${y} \\end{pmatrix}$`;

interface Arrow {
  from: [number, number];
  by: [number, number];
  label?: string;
  tone?: "main" | "find";
}

/** Arrows on squared paper, `w` by `h` squares, each labelled beside its middle. */
function paper(w: number, h: number, arrows: Arrow[]): DrawingPic {
  const items: DrawingPic["items"] = [];
  for (let x = 0; x <= w; x++) items.push({ line: [P(x, 0), P(x, h)], tone: "soft" });
  for (let y = 0; y <= h; y++) items.push({ line: [P(0, y), P(w, y)], tone: "soft" });
  for (const a of arrows) {
    const [x, y] = a.from;
    const [dx, dy] = a.by;
    items.push({ line: [P(x, y), P(x + dx, y + dy)], arrow: 1, tone: a.tone ?? "find" });
    if (a.label) {
      // Beside the middle, to the left of the direction of travel.
      const len = Math.hypot(dx, dy) || 1;
      items.push({
        text: a.label,
        at: P(x + dx / 2 - (dy / len) * 0.5, y + dy / 2 + (dx / len) * 0.5),
      });
    }
  }
  return { kind: "drawing", items };
}

const shift = paper(7, 5, [{ from: [1, 1], by: [4, 3], label: "a" }]);
const triangle = paper(8, 5, [
  { from: [1, 1], by: [3, 3], label: "a" },
  { from: [4, 4], by: [3, -3], label: "b" },
  { from: [1, 1], by: [6, 0], label: "a + b", tone: "main" },
]);
const scaled = paper(8, 5, [
  { from: [1, 3], by: [2, 1], label: "a" },
  { from: [1, 0], by: [6, 3], label: "3a" },
]);
const parallelogram: DrawingPic = {
  kind: "drawing",
  items: [
    { line: [P(0, 0), P(4, 0)], arrow: 1, tone: "find" },
    { line: [P(0, 0), P(1.5, 2.5)], arrow: 1, tone: "find" },
    { line: [P(1.5, 2.5), P(5.5, 2.5)] },
    { line: [P(4, 0), P(5.5, 2.5)] },
    { text: "O", at: P(-0.3, -0.3) },
    { text: "A", at: P(4.3, -0.3) },
    { text: "C", at: P(1.2, 2.8) },
    { text: "B", at: P(5.8, 2.8) },
    { text: "a", at: P(2, -0.4), tone: "find" },
    { text: "c", at: P(0.4, 1.5), tone: "find" },
  ],
};

export const gfVectors: UnitLesson[] = [
  lesson(
    U,
    "column-vectors",
    "GF-G24",
    "Translations as vectors",
    "A column vector says how far across, then how far up.",
    [
      problem(
        "Moving the shape",
        [
          `“Translate the triangle by the vector ${vec(4, 3)}.” And “Write the vector that takes P back to where it started.”`,
          "By the end of this lesson, you can read, write and use column vectors.",
        ],
        shift,
      ),
      typed(
        "Warm-up",
        `In ${vec(4, 3)}, how many squares right?`,
        "4",
        "The top number.",
        "4 right.",
      ),
      typed("Warm-up", `In ${vec(4, 3)}, how many squares up?`, "3", "The bottom number.", "3 up."),
      explain(
        "Discover",
        "Top across, bottom up",
        [
          `A **vector** has a size and a direction. The column vector ${vec(4, 3)} means 4 right and 3 up.`,
          "Negative top: left. Negative bottom: down. A vector can be named with a bold letter **a**, or with an arrow over two letters, like $\\overrightarrow{AB}$.",
        ],
        shift,
      ),
      choose("Discover", `${vec(-2, 5)} means`, "2 left, 5 up", "Negative top: left.", [
        ["2 right, 5 up", "−2 is left."],
        ["5 right, 2 down", "Top first, then bottom."],
      ]),
      worked(
        "Going back",
        `Undo the translation ${vec(4, 3)}.`,
        [
          ["Go 4 left and 3 down", "Reverse both."],
          [`So ${vec(-4, -3)}`, "Change both signs."],
        ],
        "The reverse vector is $-\\mathbf{a}$.",
        shift,
      ),
      steps(
        "Together",
        "From (1, 2) to (6, −1)",
        "Write the vector.",
        [
          ["Across:", "6 − 1 = 5", ["1 − 6 = −5", "End minus start."], "5"],
          ["Up:", "−1 − 2 = −3", ["3", "It goes down."], "−3"],
        ],
        `So ${vec(5, -3)}.`,
      ),
      choose("Together", "Which vector is 3 left and 1 down?", vec(-3, -1), "Both negative.", [
        [vec(3, 1), "That's right and up."],
        [vec(-1, -3), "Top is across."],
      ]),
      typed(
        "Your turn",
        `(2, 5) is translated by ${vec(3, -4)}. New $x$-coordinate?`,
        "5",
        "2 + 3.",
        "5.",
        { unit: "x =" },
      ),
      typed("Your turn", "And the new $y$-coordinate?", "1", "5 − 4.", "1.", { unit: "y =" }),
      choose(
        "Watch out",
        `Ivy translates by ${vec(2, 5)} by going 5 right, 2 up. What's wrong?`,
        "The top number is across",
        "Across first.",
        [["Nothing", "Like coordinates: $x$ then $y$."]],
      ),
      mistake(
        "Ben writes the vector from A(4, 1) to B(1, 3).",
        ["Across: 4 − 1 = 3", "Up: 3 − 1 = 2", `${vec(3, 2)}`],
        0,
        "End minus start: 1 − 4 = −3. So it's −3 across.",
      ),
      choose(
        "Back to the problem",
        `“Write the vector that takes P back after ${vec(4, 3)}.”`,
        vec(-4, -3),
        "Reverse both.",
        [
          [vec(4, -3), "Both parts reverse."],
          [vec(3, 4), "Not swapped: negated."],
        ],
      ),
      quiz([
        [
          [`${vec(0, -2)} means`, "2 down", ["2 left", "2 up"], "Bottom negative."],
          [`${vec(-5, 0)} means`, "5 left", ["5 down", "5 right"], "Top negative."],
        ],
        [
          ["From (0, 0) to (3, 4)", vec(3, 4), [vec(4, 3), vec(-3, -4)], "End − start."],
          ["From (2, 2) to (0, 5)", vec(-2, 3), [vec(2, 3), vec(3, -2)], "End − start."],
        ],
        [
          [`Reverse of ${vec(1, -6)}`, vec(-1, 6), [vec(1, 6), vec(-6, 1)], "Negate."],
          [`Reverse of ${vec(-2, 7)}`, vec(2, -7), [vec(-2, -7), vec(7, -2)], "Negate."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "add-subtract",
    "GF-G25.a",
    "Adding and subtracting vectors",
    "Add the tops, add the bottoms; nose to tail on a diagram.",
    [
      problem(
        "Two journeys in one",
        [
          `A drone flies ${vec(3, 3)} then ${vec(3, -3)}. “Write the single vector for the whole journey.”`,
          "By the end of this lesson, you can add and subtract vectors, on paper and on a grid.",
        ],
        triangle,
      ),
      typed("Warm-up", "$3 + 3$", "6", "Add.", "6."),
      typed("Warm-up", "$3 + (-3)$", "0", "Add a negative.", "0."),
      explain(
        "Discover",
        "Nose to tail",
        [
          "To add vectors, follow one then the other: place them **nose to tail**. The result goes straight from the start to the end.",
          `In columns: add the tops, add the bottoms. ${vec(3, 3)} + ${vec(3, -3)} = ${vec(6, 0)}.`,
        ],
        triangle,
      ),
      choose("Discover", `${vec(2, 1)} + ${vec(1, 4)}`, vec(3, 5), "Tops and bottoms.", [
        [vec(2, 4), "Add, don't multiply."],
        [vec(3, 4), "1 + 4 = 5."],
      ]),
      worked(
        "Subtracting",
        `Find **a** − **b**, with **a** = ${vec(5, 2)}, **b** = ${vec(1, -3)}.`,
        [
          [`${vec("5 - 1", "2 - (-3)")}`, "Top minus top, bottom minus bottom."],
          [`$=$ ${vec(4, 5)}`, "Minus a negative is plus."],
        ],
        "**a** − **b** is **a** + (−**b**).",
      ),
      steps(
        "Together",
        `**p** = ${vec(-2, 4)}, **q** = ${vec(3, 1)}. Find **p** + **q**.`,
        "Column by column.",
        [
          ["Top:", "1", ["5", "−2 + 3."], "1"],
          ["Bottom:", "5", ["3", "4 + 1."], "5"],
        ],
        `So ${vec(1, 5)}.`,
      ),
      choose(
        "Together",
        "On the grid, **a** + **b** goes from",
        "the start of **a** to the end of **b**",
        "Nose to tail.",
        [["the end of **a** to the start of **b**", "That's a point, not the sum."]],
        { picture: triangle },
      ),
      typed("Your turn", `Top number of ${vec(6, 2)} − ${vec(2, 5)}`, "4", "6 − 2.", "4."),
      typed("Your turn", "And the bottom number", "-3", "2 − 5.", "−3."),
      choose(
        "Watch out",
        "Kim puts two vectors tail to tail to add them. What's wrong?",
        "Add nose to tail: the second starts where the first ends",
        "Follow one, then the other.",
        [["Nothing", "Tail to tail doesn't show the journey."]],
      ),
      mistake(
        "Leo finds **a** − **b** with **a** = (4, 1) and **b** = (2, −2), as columns.",
        ["Top: 4 − 2 = 2", "Bottom: 1 − 2 = −1", "Answer (2, −1)"],
        1,
        "Bottom: 1 − (−2) = 3.",
      ),
      choose(
        "Back to the problem",
        "“Write the single vector for the whole journey.”",
        vec(6, 0),
        "Add the columns.",
        [
          [vec(0, 6), "Top is across."],
          [vec(6, -6), "3 + (−3) = 0."],
        ],
      ),
      quiz([
        [
          [`${vec(1, 2)} + ${vec(3, 4)}`, vec(4, 6), [vec(3, 8), vec(4, 5)], "Add."],
          [`${vec(2, 5)} + ${vec(1, 1)}`, vec(3, 6), [vec(2, 5), vec(3, 5)], "Add."],
        ],
        [
          [`${vec(5, 3)} − ${vec(2, 1)}`, vec(3, 2), [vec(7, 4), vec(3, 4)], "Subtract."],
          [`${vec(4, 6)} − ${vec(1, 2)}`, vec(3, 4), [vec(5, 8), vec(3, 8)], "Subtract."],
        ],
        [
          [
            `${vec(2, -1)} − ${vec(-3, 2)}`,
            vec(5, -3),
            [vec(-1, 1), vec(5, 1)],
            "Minus a negative.",
          ],
          [
            `${vec(-1, 4)} − ${vec(2, -2)}`,
            vec(-3, 6),
            [vec(1, 2), vec(-3, 2)],
            "Minus a negative.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "scalar",
    "GF-G25.b",
    "Multiplying a vector by a number",
    "3a is three times as long, same direction; −a points the other way.",
    [
      problem(
        "Three times as far",
        [
          `**a** = ${vec(2, 1)}. “Write 3**a** − 2**b** as a column vector, where **b** = ${vec(1, -2)}.”`,
          "By the end of this lesson, you can scale vectors and combine them.",
        ],
        scaled,
      ),
      typed("Warm-up", "$3 \\times 2$", "6", "Multiply.", "6."),
      typed("Warm-up", "$-2 \\times -2$", "4", "Two negatives.", "4."),
      explain(
        "Discover",
        "Scaling",
        [
          `Multiply each number in the vector: 3**a** = 3 × ${vec(2, 1)} = ${vec(6, 3)}. It's parallel to **a** and three times as long.`,
          "A negative number reverses the direction: −**a** points the opposite way.",
        ],
        scaled,
      ),
      choose("Discover", `2 × ${vec(-1, 3)}`, vec(-2, 6), "Multiply both.", [
        [vec(1, 5), "Multiply, don't add 2."],
        [vec(-2, 3), "Both numbers."],
      ]),
      worked(
        "The question",
        `3**a** − 2**b**, **a** = ${vec(2, 1)}, **b** = ${vec(1, -2)}.`,
        [
          [`3**a** = ${vec(6, 3)}, 2**b** = ${vec(2, -4)}`, "Scale first."],
          [`${vec(6, 3)} − ${vec(2, -4)} = ${vec(4, 7)}`, "Then subtract."],
        ],
        "Scale, then add or subtract.",
      ),
      steps(
        "Together",
        `Find −2**c**, **c** = ${vec(3, -1)}`,
        "Multiply by −2.",
        [
          ["Top:", "−6", ["6", "$-2 \\times 3$."], "−6"],
          ["Bottom:", "2", ["−2", "$-2 \\times -1$."], "2"],
        ],
        `So ${vec(-6, 2)}: twice as long, opposite way.`,
      ),
      choose("Together", `Which is parallel to ${vec(2, 1)}?`, vec(8, 4), "4 times it.", [
        [vec(4, 8), "Swapped."],
        [vec(3, 2), "Not a multiple."],
      ]),
      typed("Your turn", `Top number of 4 × ${vec(3, -2)}`, "12", "4 × 3.", "12."),
      typed("Your turn", "And the bottom number", "-8", "4 × −2.", "−8."),
      choose(
        "Watch out",
        `Raj writes 3 × ${vec(2, 1)} = ${vec(6, 1)}. What's wrong?`,
        "Multiply the bottom too",
        "Both numbers.",
        [["Nothing", "3 × 1 = 3."]],
      ),
      mistake(
        "Zoe works out 2**a** + **b**, with **a** = (1, 3) and **b** = (4, −1), as columns.",
        ["2**a** = (2, 3)", "2**a** + **b** = (6, 2)", "Answer (6, 2)"],
        0,
        "Double both numbers: 2**a** = (2, 6), so 2**a** + **b** = (6, 5).",
      ),
      typed(
        "Back to the problem",
        "“Write 3**a** − 2**b** as a column vector.” Top number?",
        "4",
        "6 − 2.",
        "4.",
      ),
      quiz([
        [
          [`2 × ${vec(3, 4)}`, vec(6, 8), [vec(5, 6), vec(6, 4)], "Both."],
          [`3 × ${vec(1, -2)}`, vec(3, -6), [vec(4, 1), vec(3, -2)], "Both."],
        ],
        [
          [
            "−**a** is",
            "the same length, opposite direction",
            ["shorter", "at right angles"],
            "Reversed.",
          ],
          [
            "5**a** is",
            "parallel to **a**",
            ["at right angles to **a**", "opposite to **a**"],
            "Same direction.",
          ],
        ],
        [
          [`2 × ${vec(1, 1)} + ${vec(0, 3)}`, vec(2, 5), [vec(1, 4), vec(2, 3)], "Scale first."],
          [`3 × ${vec(2, 0)} − ${vec(1, 1)}`, vec(5, -1), [vec(5, 1), vec(6, -1)], "Scale first."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "diagrams",
    "GF-G25.c",
    "Vectors in diagrams",
    "Write a route as a sum of known vectors.",
    [
      problem(
        "The parallelogram",
        [
          "OABC is a parallelogram. $\\overrightarrow{OA}$ = **a** and $\\overrightarrow{OC}$ = **c**. “Write $\\overrightarrow{OB}$ and $\\overrightarrow{AC}$ in terms of **a** and **c**.”",
          "By the end of this lesson, you can find any route in a diagram like this.",
        ],
        parallelogram,
      ),
      choose(
        "Warm-up",
        "In a parallelogram, opposite sides are",
        "equal and parallel",
        "Same vector.",
        [
          ["at right angles", "Not always."],
          ["different lengths", "They're equal."],
        ],
      ),
      choose("Warm-up", "Going the opposite way along **a** is", "−**a**", "Reverse.", [
        ["**a**", "Direction changes."],
        ["2**a**", "Same length."],
      ]),
      explain(
        "Discover",
        "Follow a route",
        [
          "To find a vector between two points, follow a route along known vectors. Going along an arrow: add it. Going against: subtract it.",
          "In OABC, $\\overrightarrow{CB}$ = **a** and $\\overrightarrow{AB}$ = **c**: opposite sides of a parallelogram are the same vector.",
        ],
        parallelogram,
      ),
      choose(
        "Discover",
        "$\\overrightarrow{CB}$ is",
        "**a**",
        "Parallel and equal to OA.",
        [
          ["**c**", "That's OC."],
          ["−**a**", "Same direction as OA."],
        ],
        { picture: parallelogram },
      ),
      worked(
        "Two routes",
        "Find $\\overrightarrow{OB}$ and $\\overrightarrow{AC}$.",
        [
          ["$\\overrightarrow{OB}$: O to A to B = **a** + **c**", "Along both."],
          ["$\\overrightarrow{AC}$: A to O to C = −**a** + **c**", "Against **a**, along **c**."],
          ["So $\\overrightarrow{AC}$ = **c** − **a**", "Tidy."],
        ],
        "Any route gives the same answer.",
        parallelogram,
      ),
      steps(
        "Together",
        "M is the midpoint of AB. Find $\\overrightarrow{OM}$.",
        "Route O → A → M.",
        [
          ["$\\overrightarrow{AM}$ =", "½**c**", ["**c**", "Halfway along AB."], "½**c**"],
          [
            "$\\overrightarrow{OM}$ =",
            "**a** + ½**c**",
            ["½**a** + ½**c**", "All of OA."],
            "**a** + ½**c**",
          ],
        ],
        "Halfway: half the vector.",
        parallelogram,
      ),
      choose(
        "Together",
        "$\\overrightarrow{BO}$ is",
        "−**a** − **c**",
        "Reverse of OB.",
        [
          ["**a** + **c**", "That's OB."],
          ["**a** − **c**", "Both reverse."],
        ],
        { picture: parallelogram },
      ),
      choose(
        "Your turn",
        "$\\overrightarrow{CA}$ is",
        "**a** − **c**",
        "C to O to A.",
        [
          ["**c** − **a**", "That's AC."],
          ["**a** + **c**", "That's OB."],
        ],
        { picture: parallelogram },
      ),
      choose(
        "Your turn",
        "$\\overrightarrow{BC}$ is",
        "−**a**",
        "Against CB.",
        [
          ["**a**", "Wrong way."],
          ["−**c**", "That's BA."],
        ],
        { picture: parallelogram },
      ),
      choose(
        "Watch out",
        "Ben writes $\\overrightarrow{AC}$ = **a** + **c**. What's wrong?",
        "From A to O goes against **a**: −**a** + **c**",
        "Check each direction.",
        [["Nothing", "That's OB."]],
      ),
      mistake(
        "Kim finds $\\overrightarrow{OM}$, M the midpoint of CB.",
        ["O to C: **c**", "C to M: **a**", "**c** + **a**"],
        1,
        "M is halfway along CB: ½**a**. So **c** + ½**a**.",
      ),
      choose(
        "Back to the problem",
        "“Write $\\overrightarrow{AC}$ in terms of **a** and **c**.”",
        "**c** − **a**",
        "A → O → C.",
        [
          ["**a** + **c**", "That's OB."],
          ["**a** − **c**", "That's CA."],
        ],
        { picture: parallelogram },
      ),
      quiz([
        [
          [
            "$\\overrightarrow{OB}$",
            "**a** + **c**",
            ["**a** − **c**", "**c** − **a**"],
            "Along both.",
          ],
          [
            "$\\overrightarrow{BO}$",
            "−**a** − **c**",
            ["**a** + **c**", "**a** − **c**"],
            "Reversed.",
          ],
        ],
        [
          ["$\\overrightarrow{AB}$", "**c**", ["**a**", "−**c**"], "Parallel to OC."],
          ["$\\overrightarrow{BA}$", "−**c**", ["**c**", "−**a**"], "Reversed."],
        ],
        [
          ["Halfway along **a** is", "½**a**", ["2**a**", "**a** − ½"], "Half."],
          ["Going against an arrow, you", "subtract it", ["add it", "double it"], "Reverse."],
        ],
      ]),
    ],
  ),
];
