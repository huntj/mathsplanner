// GCSE Foundation, "Pythagoras and trigonometry", as five short lessons, one just before each
// skill: Pythagoras' theorem, finding a length and an angle with SOH CAH TOA, and the exact
// values of sin, cos and tan. Each recaps the Key Stage 3 idea quickly, builds it to GCSE level,
// names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { LabelSides, Point, ShapePic, UnitLesson } from "./types.ts";

const U = "gf-trigonometry";
const P = (x: number, y: number): Point => ({ x, y });

/** A right-angled triangle, right angle at the bottom right, θ at the bottom left. */
const right = (sides: (string | null)[], angle: string | null = null): ShapePic => ({
  kind: "shape",
  points: [P(0, 0), P(4, 0), P(4, 3)],
  sides,
  angles: [angle, null, null],
  square: [1],
});

const HOA = [
  {
    mark: "H",
    name: "hypotenuse",
    why: "The hypotenuse is opposite the right angle: the longest side.",
  },
  { mark: "O", name: "opposite", why: "The opposite side is across from θ: it doesn't touch θ." },
  { mark: "A", name: "adjacent", why: "The adjacent side touches θ, and isn't the hypotenuse." },
];
const labelIt = (title: string): LabelSides & { tag: string } => ({
  kind: "label",
  tag: "Discover",
  title,
  shape: right([null, null, null], "θ"),
  chips: HOA,
  answers: ["A", "O", "H"],
  done: "Hypotenuse first, then opposite θ, then adjacent.",
});

export const gfTrigonometry: UnitLesson[] = [
  lesson(
    U,
    "pythagoras",
    "GF-G20.a",
    "Pythagoras' theorem",
    "a² + b² = c², with c the hypotenuse.",
    [
      problem(
        "The ladder",
        [
          "A 5 m ladder leans against a wall with its foot 1.5 m away. “How high up the wall does it reach? Give your answer to 2 decimal places.”",
          "By the end of this lesson, you can find any side of a right-angled triangle.",
        ],
        right(["1.5 m", "?", "5 m"]),
      ),
      typed("Warm-up", "$3^2 + 4^2$", "25", "$9 + 16$.", "25."),
      typed("Warm-up", "$\\sqrt{25}$", "5", "$5^2 = 25$.", "5."),
      explain(
        "Discover",
        "Squares on the sides",
        [
          "In a right-angled triangle, the square on the **hypotenuse** (the longest side, opposite the right angle) equals the sum of the squares on the other two: $a^2 + b^2 = c^2$.",
          "To find the hypotenuse, **add** the squares. To find a shorter side, **subtract**.",
        ],
        right(["a", "b", "c"]),
      ),
      choose(
        "Discover",
        "Which side is the hypotenuse?",
        "The one opposite the right angle",
        "The longest side.",
        [
          ["The bottom side", "Look for the right angle."],
          ["Any side", "Only the longest."],
        ],
        { picture: right(["4", "3", "?"]) },
      ),
      worked(
        "The hypotenuse",
        "Shorter sides 6 cm and 8 cm. Find the hypotenuse.",
        [
          ["$c^2 = 6^2 + 8^2 = 100$", "Add the squares."],
          ["$c = \\sqrt{100} = 10$ cm", "Square root."],
        ],
        "Check: it's the longest ✓",
      ),
      steps(
        "Together",
        "The ladder: hypotenuse 5, base 1.5",
        "Find the height.",
        [
          [
            "A shorter side, so",
            "subtract: $5^2 - 1.5^2$",
            ["add: $5^2 + 1.5^2$", "Shorter sides subtract."],
            "$25 - 2.25 = 22.75$",
          ],
          ["Height:", "4.77 m", ["5.22 m", "That adds."], "$\\sqrt{22.75}$"],
        ],
        "Shorter than the ladder ✓",
      ),
      choose(
        "Together",
        "Is a triangle with sides 7, 24, 25 right-angled?",
        "Yes: $49 + 576 = 625$",
        "$7^2 + 24^2 = 25^2$.",
        [["No", "Check: $49 + 576 = 625 = 25^2$."]],
      ),
      typed("Your turn", "Shorter sides 5 and 12: hypotenuse", "13", "$25 + 144$.", "13.", {
        wrong: [["17", "Square, add, then root."]],
      }),
      typed("Your turn", "Hypotenuse 10, one side 6: the other side", "8", "$100 - 36$.", "8.", {
        wrong: [["11.66", "Subtract for a shorter side."]],
      }),
      choose(
        "Watch out",
        "Hypotenuse 13 and a side 5. Raj adds: $\\sqrt{169 + 25}$. What's wrong?",
        "For a shorter side, subtract: $\\sqrt{169 - 25} = 12$",
        "The missing side is shorter than 13.",
        [["Nothing", "His answer, 13.9, is longer than the hypotenuse."]],
      ),
      mistake(
        "Mia finds the hypotenuse of a triangle with sides 3 and 4.",
        ["$3^2 + 4^2$", "$= 6 + 8 = 14$", "$\\sqrt{14} = 3.74$"],
        1,
        "$3^2 = 9$, $4^2 = 16$: $\\sqrt{25} = 5$.",
      ),
      typed(
        "Back to the problem",
        "“A 5 m ladder, foot 1.5 m from the wall. How high does it reach, to 2 d.p.?”",
        "4.77",
        "$\\sqrt{25 - 2.25}$.",
        "4.77 m.",
        { unit: "m", wrong: [["5.22", "Subtract."]] },
      ),
      quiz([
        [
          ["Sides 8 and 15: hypotenuse", "17", ["23", "12.7"], "$64 + 225$."],
          ["Sides 9 and 12: hypotenuse", "15", ["21", "7.9"], "$81 + 144$."],
        ],
        [
          ["Hypotenuse 17, side 8: other", "15", ["18.8", "9"], "$289 - 64$."],
          ["Hypotenuse 25, side 7: other", "24", ["25.96", "18"], "$625 - 49$."],
        ],
        [
          [
            "Find the hypotenuse:",
            "add the squares",
            ["subtract the squares", "add the sides"],
            "Add.",
          ],
          [
            "Find a shorter side:",
            "subtract the squares",
            ["add the squares", "halve"],
            "Subtract.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "length",
    "GF-G20.b",
    "Trigonometry for a length",
    "SOH CAH TOA: pick the ratio with the side you know and the side you want.",
    [
      problem(
        "The ramp",
        [
          "A ramp rises at 12° and is 5 m long. “How high does it rise? Give your answer to 3 significant figures.”",
          "Pythagoras needs two sides. With an angle, you need trigonometry. By the end of this lesson, you can do it.",
        ],
        right([null, "h", "5 m"], "12°"),
      ),
      choose("Warm-up", "The hypotenuse is", "opposite the right angle", "Longest side.", [
        ["next to θ", "That's adjacent."],
      ]),
      typed("Warm-up", "$5 \\times 0.208$", "1.04", "Times.", "1.04."),
      labelIt("Label the sides from θ"),
      explain(
        "Discover",
        "SOH CAH TOA",
        [
          "$\\sin\\theta = \\frac{O}{H}$, $\\cos\\theta = \\frac{A}{H}$, $\\tan\\theta = \\frac{O}{A}$. Remember **SOH CAH TOA**.",
          "Label the sides, tick the one you know and the one you want, and pick the ratio that uses both.",
        ],
        {
          kind: "maths",
          tex: "\\sin\\theta = \\tfrac{O}{H} \\quad \\cos\\theta = \\tfrac{A}{H} \\quad \\tan\\theta = \\tfrac{O}{A}",
        },
      ),
      worked(
        "The ramp",
        "Angle 12°, hypotenuse 5 m. Find the height (opposite).",
        [
          ["O and H: $\\sin$", "SOH."],
          ["$\\sin 12° = \\frac{h}{5}$, so $h = 5 \\sin 12°$", "Rearrange."],
          ["$h = 1.04$ m", "3 s.f."],
        ],
        "Check your calculator is in degrees.",
      ),
      steps(
        "Together",
        "Angle 35°, adjacent 8 cm. Find the opposite, $x$.",
        "Pick the ratio.",
        [
          ["O and A, so", "$\\tan$", ["$\\sin$", "Sin needs H."], "$\\tan 35° = \\frac{x}{8}$"],
          ["$x = 8 \\tan 35° =$", "5.60 cm", ["11.4 cm", "That divides."], "5.60 cm"],
        ],
        "Unknown on top: multiply.",
      ),
      steps(
        "Together",
        "Angle 50°, opposite 6 cm. Find the hypotenuse, $h$.",
        "Unknown on the bottom.",
        [
          [
            "O and H, so",
            "$\\sin 50° = \\frac{6}{h}$",
            ["$\\sin 50° = \\frac{h}{6}$", "Opposite over hypotenuse."],
            "$h = \\frac{6}{\\sin 50°}$",
          ],
          ["$h =$", "7.83 cm", ["4.60 cm", "Divide by sin 50°."], "7.83 cm"],
        ],
        "Unknown on the bottom: divide.",
      ),
      typed("Your turn", "Angle 30°, hypotenuse 10: opposite", "5", "$10 \\sin 30°$.", "5.", {
        wrong: [["8.66", "That's cos: adjacent."]],
      }),
      typed(
        "Your turn",
        "Angle 40°, hypotenuse 12: adjacent, to 3 s.f.",
        "9.19",
        "$12 \\cos 40°$.",
        "9.19.",
        { wrong: [["7.71", "Adjacent: cos."]] },
      ),
      choose(
        "Watch out",
        "Ed's calculator gives $\\sin 30° = -0.988$. What's wrong?",
        "It's in radians: switch to degrees",
        "$\\sin 30° = 0.5$ in degrees.",
        [["Nothing", "Sine of 30° is 0.5."]],
      ),
      mistake(
        "Kim finds the opposite: angle 25°, adjacent 10.",
        ["O and A: tan", "$\\tan 25° = \\frac{10}{x}$", "$x = 21.4$"],
        1,
        "Tan is opposite over adjacent: $\\tan 25° = \\frac{x}{10}$, so $x = 4.66$.",
      ),
      typed(
        "Back to the problem",
        "“A 5 m ramp at 12°. How high does it rise, to 3 s.f.?”",
        "1.04",
        "$5 \\sin 12°$.",
        "1.04 m.",
        { unit: "m", wrong: [["4.89", "That's cos: the horizontal."]] },
      ),
      quiz([
        [
          ["Know O and H: use", "sin", ["cos", "tan"], "SOH."],
          ["Know A and H: use", "cos", ["sin", "tan"], "CAH."],
        ],
        [
          ["Angle 60°, hyp 8: adjacent", "4", ["6.93", "13.9"], "$8 \\cos 60°$."],
          ["Angle 45°, adj 7: opposite", "7", ["4.95", "9.9"], "$7 \\tan 45°$."],
        ],
        [
          [
            "Unknown on top of the fraction:",
            "multiply",
            ["divide", "add"],
            "$x = H \\sin\\theta$.",
          ],
          [
            "Unknown on the bottom:",
            "divide",
            ["multiply", "subtract"],
            "$h = O \\div \\sin\\theta$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "angle",
    "GF-G20.c",
    "Trigonometry for an angle",
    "Use the inverse: θ = sin⁻¹(O/H) and so on.",
    [
      problem(
        "The roof pitch",
        [
          "A roof rises 2.4 m over a horizontal 6 m. “Work out the angle of the roof to the horizontal, to 1 decimal place.”",
          "By the end of this lesson, you can find any angle from two sides.",
        ],
        right(["6 m", "2.4 m", null], "θ"),
      ),
      typed("Warm-up", "$2.4 \\div 6$", "0.4", "Divide.", "0.4."),
      choose("Warm-up", "If $\\tan\\theta = 1$, $\\theta =$", "45°", "Opposite equals adjacent.", [
        ["90°", "tan 90° doesn't exist."],
      ]),
      explain(
        "Discover",
        "Inverse trig",
        [
          "To find an **angle**, work out the ratio from the two sides, then use the inverse: $\\sin^{-1}$, $\\cos^{-1}$ or $\\tan^{-1}$ (SHIFT on most calculators).",
          "$\\tan\\theta = \\frac{2.4}{6} = 0.4$, so $\\theta = \\tan^{-1}(0.4)$.",
        ],
        { kind: "maths", tex: "\\theta = \\tan^{-1}\\left(\\frac{O}{A}\\right)" },
      ),
      labelIt("Label the sides from θ"),
      worked(
        "The roof",
        "Opposite 2.4 m, adjacent 6 m. Find θ.",
        [
          ["O and A: tan", "TOA."],
          ["$\\tan\\theta = 0.4$", "Ratio."],
          ["$\\theta = \\tan^{-1}(0.4) = 21.8°$", "Inverse."],
        ],
        "A gentle pitch.",
      ),
      steps(
        "Together",
        "Opposite 5, hypotenuse 9",
        "Find θ.",
        [
          [
            "Use",
            "$\\sin\\theta = \\frac59$",
            ["$\\cos\\theta = \\frac59$", "O and H: sin."],
            "$\\sin\\theta = 0.556$",
          ],
          ["$\\theta =$", "33.7°", ["56.3°", "That's cos⁻¹."], "33.7°"],
        ],
        "Use the exact fraction in the calculator.",
      ),
      choose("Together", "Adjacent 7, hypotenuse 10. θ to 1 d.p.", "45.6°", "$\\cos^{-1}(0.7)$.", [
        ["44.4°", "That's sin⁻¹."],
        ["35.0°", "That's tan⁻¹."],
      ]),
      typed(
        "Your turn",
        "Opposite 3, adjacent 4: θ to 1 d.p.",
        "36.9",
        "$\\tan^{-1}(0.75)$.",
        "36.9°.",
        { unit: "°", wrong: [["53.1", "Opposite over adjacent: 3 ÷ 4."]] },
      ),
      typed("Your turn", "Opposite 6, hypotenuse 12: θ", "30", "$\\sin^{-1}(0.5)$.", "30°.", {
        unit: "°",
      }),
      choose(
        "Watch out",
        "Jo works out $\\tan 0.4$ instead of $\\tan^{-1} 0.4$. What's wrong?",
        "She needs the inverse to get the angle",
        "$\\tan$ takes an angle; $\\tan^{-1}$ gives one.",
        [["Nothing", "$\\tan 0.4$ treats 0.4 as an angle."]],
      ),
      mistake(
        "Leo finds θ: adjacent 8, hypotenuse 10.",
        ["A and H: cos", "$\\cos\\theta = \\frac{10}{8}$", "Error on the calculator"],
        1,
        "Adjacent over hypotenuse: $\\frac{8}{10}$, so $\\theta = 36.9°$.",
      ),
      typed(
        "Back to the problem",
        "“The roof rises 2.4 m over 6 m. Find the angle, to 1 d.p.”",
        "21.8",
        "$\\tan^{-1}(0.4)$.",
        "21.8°.",
        { unit: "°", wrong: [["23.6", "That's sin⁻¹."]] },
      ),
      quiz([
        [
          ["O 4, A 4: θ", "45°", ["90°", "1°"], "$\\tan^{-1}(1)$."],
          ["O 5, H 10: θ", "30°", ["60°", "0.5°"], "$\\sin^{-1}(0.5)$."],
        ],
        [
          ["A 5, H 10: θ", "60°", ["30°", "0.5°"], "$\\cos^{-1}(0.5)$."],
          ["O 1, H 2: θ", "30°", ["60°", "45°"], "$\\sin^{-1}(0.5)$."],
        ],
        [
          [
            "To find an angle use",
            "inverse trig",
            ["Pythagoras", "the angle sum only"],
            "$\\sin^{-1}$ etc.",
          ],
          ["$\\tan^{-1}$ gives", "an angle", ["a side", "a ratio"], "Angle."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "exact-sin-cos",
    "GF-G21.a",
    "Exact sin and cos",
    "Know sin and cos of 0°, 30°, 45°, 60° and 90° without a calculator.",
    [
      problem("No calculator", [
        "On the non-calculator paper: “Write down the exact value of $\\cos 60°$.” And “Find $x$: hypotenuse 10, angle 30°, opposite $x$.”",
        "By the end of this lesson, you'll know the exact values, and where they come from.",
      ]),
      choose("Warm-up", "An equilateral triangle's angles are each", "60°", "180 ÷ 3.", [
        ["90°", "Equal angles: 60°."],
      ]),
      typed("Warm-up", "Half of 2", "1", "Halve.", "1."),
      explain(
        "Discover",
        "From special triangles",
        [
          "Cut an equilateral triangle of side 2 in half: a right triangle with sides 1, $\\sqrt3$, 2 and angles 30°, 60°.",
          "So $\\sin 30° = \\cos 60° = \\frac12$ and $\\sin 60° = \\cos 30° = \\frac{\\sqrt3}{2}$. A right isosceles triangle gives $\\sin 45° = \\cos 45° = \\frac{\\sqrt2}{2}$.",
        ],
        {
          kind: "table",
          head: ["θ", "0°", "30°", "45°", "60°", "90°"],
          rows: [
            ["sin θ", "0", "$\\frac12$", "$\\frac{\\sqrt2}{2}$", "$\\frac{\\sqrt3}{2}$", "1"],
            ["cos θ", "1", "$\\frac{\\sqrt3}{2}$", "$\\frac{\\sqrt2}{2}$", "$\\frac12$", "0"],
          ],
        },
      ),
      choose("Discover", "$\\sin 30° =$", "$\\frac12$", "Opposite 1, hypotenuse 2.", [
        ["$\\frac{\\sqrt3}{2}$", "That's sin 60°."],
        ["1", "That's sin 90°."],
      ]),
      worked(
        "Without a calculator",
        "Hypotenuse 10, angle 30°. Find the opposite, $x$.",
        [
          ["$x = 10 \\sin 30°$", "SOH."],
          ["$= 10 \\times \\frac12 = 5$", "Exact value."],
        ],
        "No calculator needed.",
      ),
      steps(
        "Together",
        "Exact value of $\\cos 45° \\times \\sin 45°$",
        "Use the table.",
        [
          [
            "$\\cos 45° = \\sin 45° =$",
            "$\\frac{\\sqrt2}{2}$",
            ["$\\frac12$", "That's 30° and 60°."],
            "$\\frac{\\sqrt2}{2} \\times \\frac{\\sqrt2}{2}$",
          ],
          [
            "Product:",
            "$\\frac12$",
            ["$\\frac{\\sqrt2}{4}$", "$\\sqrt2 \\times \\sqrt2 = 2$."],
            "$\\frac24 = \\frac12$",
          ],
        ],
        "$\\sqrt2 \\times \\sqrt2 = 2$.",
      ),
      choose("Together", "Which equals $\\cos 30°$?", "$\\sin 60°$", "Both $\\frac{\\sqrt3}{2}$.", [
        ["$\\sin 30°$", "That's $\\frac12$."],
        ["$\\cos 60°$", "That's $\\frac12$."],
      ]),
      choose("Your turn", "$\\cos 0° =$", "1", "Adjacent equals hypotenuse.", [
        ["0", "That's sin 0°."],
        ["$\\frac12$", "That's cos 60°."],
      ]),
      choose(
        "Your turn",
        "Hypotenuse 8, angle 60°: adjacent",
        "4",
        "$8 \\cos 60° = 8 \\times \\frac12$.",
        [
          ["$4\\sqrt3$", "That's the opposite."],
          ["8", "Times by ½."],
        ],
      ),
      choose(
        "Watch out",
        "Ben says $\\sin 60° = \\frac12$. What's wrong?",
        "$\\sin 60° = \\frac{\\sqrt3}{2}$; it's $\\sin 30°$ that's $\\frac12$",
        "Sine grows as the angle grows.",
        [["Nothing", "sin 60° > sin 30°."]],
      ),
      mistake(
        "Ivy finds the exact value of $\\sin 45°$.",
        [
          "Right isosceles triangle, sides 1, 1",
          "Hypotenuse $\\sqrt2$",
          "$\\sin 45° = \\frac{\\sqrt2}{1}$",
        ],
        2,
        "Opposite over hypotenuse: $\\frac{1}{\\sqrt2} = \\frac{\\sqrt2}{2}$.",
      ),
      choose(
        "Back to the problem",
        "“Write down the exact value of $\\cos 60°$.”",
        "$\\frac12$",
        "From the half-equilateral triangle.",
        [
          ["$\\frac{\\sqrt3}{2}$", "That's cos 30°."],
          ["0.5000…", "Exact: $\\frac12$."],
        ],
      ),
      quiz([
        [
          ["$\\sin 90°$", "1", ["0", "$\\frac12$"], "Top of sine."],
          ["$\\cos 90°$", "0", ["1", "$\\frac12$"], "No adjacent."],
        ],
        [
          ["$\\sin 60°$", "$\\frac{\\sqrt3}{2}$", ["$\\frac12$", "$\\frac{\\sqrt2}{2}$"], "Table."],
          ["$\\cos 30°$", "$\\frac{\\sqrt3}{2}$", ["$\\frac12$", "$\\frac{\\sqrt2}{2}$"], "Table."],
        ],
        [
          ["Hyp 6, angle 30°: opposite", "3", ["$3\\sqrt3$", "6"], "6 × ½."],
          ["Hyp 12, angle 60°: adjacent", "6", ["$6\\sqrt3$", "12"], "12 × ½."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "exact-tan",
    "GF-G21.b",
    "Exact tan",
    "tan 0° = 0, tan 30° = √3/3, tan 45° = 1, tan 60° = √3.",
    [
      problem("Exact tangents", [
        "“Write down the exact value of $\\tan 60°$.” And “A ramp rises 3 m over a horizontal 3 m: what's its angle?”",
        "By the end of this lesson, you'll know the exact tan values, and why.",
      ]),
      choose("Warm-up", "$\\tan\\theta = $", "$\\frac{O}{A}$", "TOA.", [
        ["$\\frac{O}{H}$", "That's sin."],
      ]),
      typed("Warm-up", "$\\frac{3}{3}$", "1", "Divide.", "1."),
      explain(
        "Discover",
        "Opposite over adjacent",
        [
          "In the half-equilateral triangle (sides 1, $\\sqrt3$, 2): $\\tan 60° = \\frac{\\sqrt3}{1} = \\sqrt3$ and $\\tan 30° = \\frac{1}{\\sqrt3} = \\frac{\\sqrt3}{3}$.",
          "In a right isosceles triangle the two shorter sides are equal, so $\\tan 45° = 1$. And $\\tan 0° = 0$.",
        ],
        {
          kind: "table",
          head: ["θ", "0°", "30°", "45°", "60°"],
          rows: [["tan θ", "0", "$\\frac{\\sqrt3}{3}$", "1", "$\\sqrt3$"]],
        },
      ),
      choose("Discover", "$\\tan 45° =$", "1", "Opposite equals adjacent.", [
        ["$\\frac{\\sqrt2}{2}$", "That's sin 45°."],
        ["0", "That's tan 0°."],
      ]),
      worked(
        "The ramp",
        "Rises 3 m over a horizontal 3 m. Angle?",
        [
          ["$\\tan\\theta = \\frac33 = 1$", "O over A."],
          ["$\\theta = 45°$", "Exact value."],
        ],
        "Equal rise and run: 45°.",
      ),
      steps(
        "Together",
        "Opposite $x$, adjacent 5, angle 60°",
        "Exact $x$.",
        [
          [
            "$x = 5 \\tan 60° =$",
            "$5\\sqrt3$",
            ["$\\frac{5}{\\sqrt3}$", "Multiply: unknown on top."],
            "$5\\sqrt3$",
          ],
          ["Approximately", "8.66", ["2.89", "$5 \\times 1.732$."], "≈ 8.66"],
        ],
        "Leave $5\\sqrt3$ for an exact answer.",
      ),
      choose("Together", "Which is greatest?", "$\\tan 60°$", "$\\sqrt3 \\approx 1.73$.", [
        ["$\\tan 45°$", "1 < 1.73."],
        ["$\\sin 60°$", "$\\frac{\\sqrt3}{2} < \\sqrt3$."],
      ]),
      choose("Your turn", "$\\tan 30° =$", "$\\frac{\\sqrt3}{3}$", "$\\frac{1}{\\sqrt3}$.", [
        ["$\\sqrt3$", "That's tan 60°."],
        ["$\\frac12$", "That's sin 30°."],
      ]),
      choose("Your turn", "Adjacent 4, angle 45°: opposite", "4", "$4 \\tan 45° = 4$.", [
        ["$4\\sqrt2$", "Tan 45° is 1."],
        ["2", "Times 1."],
      ]),
      choose(
        "Watch out",
        "Raj says $\\tan 90° = 1$. What's wrong?",
        "tan 90° is undefined: the adjacent is 0",
        "You can't divide by 0.",
        [["Nothing", "Opposite over zero doesn't exist."]],
      ),
      mistake(
        "Mia finds the exact value of $\\tan 60°$.",
        [
          "Half-equilateral: opposite $\\sqrt3$, adjacent 1",
          "$\\tan 60° = \\frac{1}{\\sqrt3}$",
          "$= \\frac{\\sqrt3}{3}$",
        ],
        1,
        "Opposite over adjacent: $\\frac{\\sqrt3}{1} = \\sqrt3$.",
      ),
      choose(
        "Back to the problem",
        "“Write down the exact value of $\\tan 60°$.”",
        "$\\sqrt3$",
        "$\\frac{\\sqrt3}{1}$.",
        [
          ["$\\frac{\\sqrt3}{3}$", "That's tan 30°."],
          ["1.732", "Exact: $\\sqrt3$."],
        ],
      ),
      quiz([
        [
          ["$\\tan 0°$", "0", ["1", "undefined"], "No opposite."],
          ["$\\tan 45°$", "1", ["0", "$\\sqrt2$"], "Equal sides."],
        ],
        [
          ["$\\tan 60°$", "$\\sqrt3$", ["$\\frac{\\sqrt3}{3}$", "$\\frac{\\sqrt3}{2}$"], "Table."],
          ["$\\tan 30°$", "$\\frac{\\sqrt3}{3}$", ["$\\sqrt3$", "$\\frac12$"], "Table."],
        ],
        [
          [
            "Adjacent 2, angle 60°: opposite",
            "$2\\sqrt3$",
            ["$\\frac{2}{\\sqrt3}$", "1"],
            "2 × √3.",
          ],
          ["Adjacent 6, angle 30°: opposite", "$2\\sqrt3$", ["$6\\sqrt3$", "3"], "6 × √3/3."],
        ],
      ]),
    ],
  ),
];
