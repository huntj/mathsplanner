// GCSE Higher, "Functions, lines and quadratics", as six short lessons, one just before each skill:
// inverse and composite functions, perpendicular lines, solving quadratics by completing the
// square, by the quadratic formula and after rearranging, and turning points from the completed
// square. Each recaps the Foundation idea quickly, builds it to Higher level, names the common
// mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, UnitLesson } from "./types.ts";

const U = "gh-quadratics";

const perpendicular: Picture = {
  kind: "graph",
  range: { xMin: -4, xMax: 4, yMin: -3, yMax: 5 },
  lines: [
    { m: 2, c: 1 },
    { m: -0.5, c: 1 },
  ],
};
const turning: Picture = {
  kind: "graph",
  range: { xMin: -2, xMax: 6, yMin: -4, yMax: 6 },
  curves: [{ kind: "quadratic", a: 1, b: -4, c: 1 }],
  points: [{ x: 2, y: -3 }],
};

export const ghQuadratics: UnitLesson[] = [
  lesson(
    U,
    "functions",
    "GH-A7",
    "Inverse and composite functions",
    "fg(x) means do g first, then f; f⁻¹ undoes f.",
    [
      problem("Two machines", [
        "$f(x) = 2x + 1$ and $g(x) = x^2$. “Find $fg(3)$.” And “Find $f^{-1}(x)$.”",
        "By the end of this lesson, you can combine and reverse functions.",
      ]),
      typed("Warm-up", "$f(x) = 2x + 1$. $f(4)$", "9", "$2 \\times 4 + 1$.", "9."),
      typed("Warm-up", "Solve $2y + 1 = 7$", "3", "Subtract 1, halve.", "$y = 3$.", {
        unit: "y =",
      }),
      explain("Discover", "Inside first", [
        "$fg(x)$ means $f(g(x))$: put $x$ into $g$ first, then put the answer into $f$. The order matters.",
        "The **inverse** $f^{-1}$ undoes $f$. Write $y = f(x)$, rearrange to make $x$ the subject, then swap the letters.",
      ]),
      choose("Discover", "$fg(3)$: first work out", "$g(3) = 9$", "Inside first.", [
        ["$f(3) = 7$", "That's $gf$."],
        ["$3 \\times 3$", "Use the functions."],
      ]),
      worked(
        "Both parts",
        "$f(x) = 2x + 1$, $g(x) = x^2$.",
        [
          ["$fg(3) = f(9) = 19$", "g, then f."],
          ["$y = 2x + 1 \\Rightarrow x = \\frac{y - 1}{2}$", "Rearrange."],
          ["$f^{-1}(x) = \\frac{x - 1}{2}$", "Swap letters."],
        ],
        "Check: $f^{-1}(f(4)) = f^{-1}(9) = 4$.",
      ),
      steps(
        "Together",
        "Find $gf(x)$ as an expression",
        "f first, then g.",
        [
          ["$f(x) =$", "$2x + 1$", ["$x^2$", "That's g."], "$2x + 1$"],
          [
            "$g(2x + 1) =$",
            "$(2x + 1)^2$",
            ["$2x^2 + 1$", "Square the whole input."],
            "$gf(x) = (2x + 1)^2$",
          ],
        ],
        "$fg(x) = 2x^2 + 1$: different.",
      ),
      choose(
        "Together",
        "$h(x) = \\frac{x}{3} - 2$. $h^{-1}(x)$",
        "$3(x + 2)$",
        "Add 2, then × 3.",
        [
          ["$3x - 2$", "Undo in reverse order."],
          ["$\\frac{x + 2}{3}$", "× 3, not ÷ 3."],
        ],
      ),
      typed("Your turn", "$f(x) = 3x - 4$. $f^{-1}(11)$", "5", "Add 4, divide by 3.", "5."),
      typed(
        "Your turn",
        "$f(x) = x + 5$, $g(x) = 2x$. $gf(1)$",
        "12",
        "$f(1) = 6$, $g(6)$.",
        "12.",
        { wrong: [["7", "That's $fg(1)$."]] },
      ),
      choose(
        "Watch out",
        "Ivy says $f^{-1}(x) = \\frac{1}{f(x)}$. What's wrong?",
        "The inverse undoes $f$; it isn't one over $f$",
        "Different idea.",
        [["Nothing", "$f^{-1}$ reverses the steps."]],
      ),
      mistake(
        "Ben finds $fg(2)$ with $f(x) = x + 1$, $g(x) = 3x$.",
        ["$f(2) = 3$", "$g(3) = 9$", "$fg(2) = 9$"],
        0,
        "fg means g first: $g(2) = 6$, $f(6) = 7$.",
      ),
      choose(
        "Back to the problem",
        "“Find $f^{-1}(x)$” for $f(x) = 2x + 1$.",
        "$\\frac{x - 1}{2}$",
        "Subtract 1, halve.",
        [
          ["$\\frac{x + 1}{2}$", "Undo +1 with −1."],
          ["$2x - 1$", "Undo × 2 with ÷ 2."],
        ],
      ),
      quiz([
        [
          ["$f(x) = x - 3$, $g(x) = 4x$. $fg(2)$", "5", ["−4", "8"], "$g(2) = 8$, $f(8)$."],
          ["$f(x) = x + 2$, $g(x) = 5x$. $fg(1)$", "7", ["15", "5"], "$g(1) = 5$, $f(5)$."],
        ],
        [
          [
            "$f(x) = 4x$. $f^{-1}(x)$",
            "$\\frac{x}{4}$",
            ["$4 - x$", "$\\frac{4}{x}$"],
            "Undo × 4.",
          ],
          ["$f(x) = x - 7$. $f^{-1}(x)$", "$x + 7$", ["$7 - x$", "$\\frac{x}{7}$"], "Undo − 7."],
        ],
        [
          ["$fg(x)$ means", "g first, then f", ["f first, then g", "f times g"], "Inside first."],
          ["$f^{-1}(f(x)) =$", "$x$", ["$f(x)$", "1"], "Undone."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "perpendicular",
    "GH-A9",
    "Perpendicular lines",
    "Perpendicular gradients multiply to −1: flip and change the sign.",
    [
      problem(
        "At right angles",
        [
          "“Find the equation of the line through (2, 5) perpendicular to $y = 2x + 1$.”",
          "By the end of this lesson, you can find it.",
        ],
        perpendicular,
      ),
      typed("Warm-up", "Gradient of $y = 2x + 1$", "2", "The number before $x$.", "2."),
      typed("Warm-up", "$2 \\times -\\frac12$", "-1", "Multiply.", "−1."),
      explain(
        "Discover",
        "Negative reciprocal",
        [
          "**Parallel** lines have the same gradient. **Perpendicular** lines have gradients that multiply to −1.",
          "So turn the gradient upside down and change its sign: 2 becomes $-\\frac12$; $-\\frac34$ becomes $\\frac43$.",
        ],
        perpendicular,
      ),
      choose("Discover", "Perpendicular to gradient 3", "$-\\frac13$", "Flip and change sign.", [
        ["−3", "Flip it too."],
        ["$\\frac13$", "Change the sign."],
      ]),
      worked(
        "The line",
        "Through (2, 5), perpendicular to $y = 2x + 1$.",
        [
          ["Gradient: $-\\frac12$", "Negative reciprocal."],
          ["$5 = -\\frac12(2) + c$, so $c = 6$", "Substitute."],
          ["$y = -\\frac12 x + 6$", "Equation."],
        ],
        "Check: $2 \\times -\\frac12 = -1$.",
      ),
      steps(
        "Together",
        "Are $y = 4x - 1$ and $4y + x = 8$ perpendicular?",
        "Find both gradients.",
        [
          [
            "Rearrange the second:",
            "$y = -\\frac14 x + 2$",
            ["$y = -4x + 8$", "Divide everything by 4."],
            "Gradient $-\\frac14$",
          ],
          [
            "$4 \\times -\\frac14 =$",
            "−1: perpendicular",
            ["1: parallel", "Multiply carefully."],
            "Perpendicular",
          ],
        ],
        "Always rearrange to $y = mx + c$ first.",
      ),
      choose(
        "Together",
        "Which is perpendicular to $y = -\\frac23 x + 4$?",
        "$y = \\frac32 x - 1$",
        "Flip and change sign.",
        [
          ["$y = \\frac23 x + 4$", "Flip too."],
          ["$y = -\\frac32 x$", "Change the sign."],
        ],
      ),
      choose("Your turn", "Perpendicular to $y = -5x + 2$, gradient", "$\\frac15$", "Flip, sign.", [
        ["5", "Flip."],
        ["$-\\frac15$", "Change the sign."],
      ]),
      typed(
        "Your turn",
        "The line with gradient $\\frac15$ through (5, 3) crosses the $y$-axis at",
        "2",
        "$3 = 1 + c$.",
        "$c = 2$.",
        { unit: "y =" },
      ),
      choose(
        "Watch out",
        "Kim says the perpendicular to gradient 2 is −2. What's wrong?",
        "Flip it too: $-\\frac12$",
        "$2 \\times -2 = -4$.",
        [["Nothing", "They must multiply to −1."]],
      ),
      mistake(
        "Leo finds a gradient perpendicular to $2y = 6x + 1$.",
        ["Gradient of the line: 6", "Perpendicular: $-\\frac16$", "Done"],
        0,
        "Rearrange: $y = 3x + \\frac12$, so the gradient is 3 and the perpendicular is $-\\frac13$.",
      ),
      choose(
        "Back to the problem",
        "“Find the equation of the line through (2, 5) perpendicular to $y = 2x + 1$.”",
        "$y = -\\frac12 x + 6$",
        "$c = 6$.",
        [
          ["$y = -2x + 9$", "Flip the gradient."],
          ["$y = 2x + 1$", "That's the same line."],
        ],
      ),
      quiz([
        [
          ["Perpendicular to gradient 4", "$-\\frac14$", ["−4", "$\\frac14$"], "Flip, sign."],
          ["Perpendicular to gradient $-\\frac12$", "2", ["−2", "$\\frac12$"], "Flip, sign."],
        ],
        [
          [
            "Parallel to $y = 3x - 2$",
            "$y = 3x + 5$",
            ["$y = -\\frac13 x$", "$y = -3x$"],
            "Same gradient.",
          ],
          [
            "Perpendicular to $y = 3x - 2$",
            "$y = -\\frac13 x + 1$",
            ["$y = 3x + 1$", "$y = -3x$"],
            "Product −1.",
          ],
        ],
        [
          ["Perpendicular gradients multiply to", "−1", ["1", "0"], "Rule."],
          ["Gradient of $3y = 9x + 2$", "3", ["9", "2"], "Divide by 3."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "complete-square-solve",
    "GH-A18.a",
    "Solving by completing the square",
    "Write x² + bx + c as (x + b/2)² − (b/2)² + c, then square root.",
    [
      problem("Exact answers", [
        "“Solve $x^2 + 6x + 4 = 0$, giving your answers in the form $a \\pm \\sqrt b$.” It doesn't factorise.",
        "By the end of this lesson, you can solve it exactly.",
      ]),
      choose("Warm-up", "$(x + 3)^2$", "$x^2 + 6x + 9$", "Expand.", [
        ["$x^2 + 9$", "Middle term."],
        ["$x^2 + 3x + 9$", "Two lots of $3x$."],
      ]),
      typed("Warm-up", "Half of 6, squared", "9", "$3^2$.", "9."),
      explain("Discover", "Make a perfect square", [
        "$x^2 + bx$ is nearly $(x + \\frac b2)^2$: that has an extra $(\\frac b2)^2$, so subtract it. $x^2 + 6x = (x + 3)^2 - 9$.",
        "Then the equation has only one $x$: rearrange and take the square root, remembering $\\pm$.",
      ]),
      choose("Discover", "$x^2 + 10x$ =", "$(x + 5)^2 - 25$", "Half of 10, squared.", [
        ["$(x + 10)^2 - 100$", "Halve the 10."],
        ["$(x + 5)^2 + 25$", "Subtract the extra."],
      ]),
      worked(
        "The problem",
        "Solve $x^2 + 6x + 4 = 0$.",
        [
          ["$(x + 3)^2 - 9 + 4 = 0$, so $(x + 3)^2 = 5$", "Complete the square."],
          ["$x + 3 = \\pm\\sqrt5$", "Square root: ±."],
          ["$x = -3 \\pm \\sqrt5$", "Exact."],
        ],
        "$a = -3$, $b = 5$.",
      ),
      steps(
        "Together",
        "Solve $x^2 - 8x + 13 = 0$",
        "Half of −8 is −4.",
        [
          [
            "Complete the square:",
            "$(x - 4)^2 - 3 = 0$",
            ["$(x - 4)^2 + 29 = 0$", "$-16 + 13 = -3$."],
            "$(x - 4)^2 = 3$",
          ],
          [
            "Solve:",
            "$x = 4 \\pm \\sqrt3$",
            ["$x = -4 \\pm \\sqrt3$", "$x - 4 = \\pm\\sqrt3$."],
            "$4 \\pm \\sqrt3$",
          ],
        ],
        "Two exact answers.",
      ),
      choose("Together", "$x^2 + 2x - 5$ completed", "$(x + 1)^2 - 6$", "$-1 - 5$.", [
        ["$(x + 1)^2 - 5$", "Subtract the 1 too."],
        ["$(x + 2)^2 - 9$", "Halve the 2."],
      ]),
      choose("Your turn", "Solve $(x - 2)^2 = 7$", "$x = 2 \\pm \\sqrt7$", "Root, then add 2.", [
        ["$x = -2 \\pm \\sqrt7$", "Add the 2."],
        ["$x = 2 + \\sqrt7$ only", "± gives two."],
      ]),
      choose("Your turn", "Solve $x^2 + 4x + 1 = 0$", "$x = -2 \\pm \\sqrt3$", "$(x + 2)^2 = 3$.", [
        ["$x = 2 \\pm \\sqrt3$", "$x + 2 = \\pm\\sqrt3$."],
        ["$x = -2 \\pm \\sqrt5$", "$-4 + 1 = -3$."],
      ]),
      choose(
        "Watch out",
        "Zoe takes the square root and writes only $+\\sqrt5$. What's wrong?",
        "Square roots have ±: two answers",
        "$(-\\sqrt5)^2 = 5$ too.",
        [["Nothing", "She's lost a solution."]],
      ),
      mistake(
        "Raj completes the square for $x^2 + 6x + 4$.",
        ["$(x + 6)^2 - 36 + 4$", "$= (x + 6)^2 - 32$", "Then solve"],
        0,
        "Halve the 6: $(x + 3)^2 - 9 + 4 = (x + 3)^2 - 5$.",
      ),
      choose(
        "Back to the problem",
        "“Solve $x^2 + 6x + 4 = 0$ as $a \\pm \\sqrt b$.”",
        "$-3 \\pm \\sqrt5$",
        "$(x + 3)^2 = 5$.",
        [
          ["$3 \\pm \\sqrt5$", "$x + 3 = \\pm\\sqrt5$."],
          ["$-3 \\pm \\sqrt{13}$", "$9 - 4 = 5$."],
        ],
      ),
      quiz([
        [
          [
            "$x^2 + 8x$ =",
            "$(x + 4)^2 - 16$",
            ["$(x + 8)^2 - 64$", "$(x + 4)^2 + 16$"],
            "Halve, square.",
          ],
          [
            "$x^2 - 6x$ =",
            "$(x - 3)^2 - 9$",
            ["$(x - 6)^2 - 36$", "$(x - 3)^2 + 9$"],
            "Halve, square.",
          ],
        ],
        [
          [
            "Solve $(x + 1)^2 = 2$",
            "$-1 \\pm \\sqrt2$",
            ["$1 \\pm \\sqrt2$", "$-1 + \\sqrt2$ only"],
            "±.",
          ],
          [
            "Solve $(x - 5)^2 = 3$",
            "$5 \\pm \\sqrt3$",
            ["$-5 \\pm \\sqrt3$", "$5 + \\sqrt3$ only"],
            "±.",
          ],
        ],
        [
          [
            "$x^2 + 6x + 2$ =",
            "$(x + 3)^2 - 7$",
            ["$(x + 3)^2 - 2$", "$(x + 3)^2 + 11$"],
            "$-9 + 2$.",
          ],
          [
            "$x^2 + 4x + 7$ =",
            "$(x + 2)^2 + 3$",
            ["$(x + 2)^2 - 3$", "$(x + 2)^2 + 7$"],
            "$-4 + 7$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "formula",
    "GH-A18.b",
    "The quadratic formula",
    "x = (−b ± √(b² − 4ac)) ÷ 2a solves any quadratic.",
    [
      problem("Two decimal places", [
        "“Solve $2x^2 - 3x - 4 = 0$. Give your answers to 2 decimal places.” It doesn't factorise, and completing the square with a 2 in front is awkward.",
        "By the end of this lesson, you can solve it with one formula.",
      ]),
      typed("Warm-up", "$(-3)^2$", "9", "Negative squared.", "9."),
      typed("Warm-up", "$4 \\times 2 \\times (-4)$", "-32", "Multiply.", "−32."),
      explain("Discover", "The formula", [
        "For $ax^2 + bx + c = 0$: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$. It's on the formula sheet in some exams but not all: learn it.",
        "Write down $a$, $b$ and $c$ with their signs first. Work out $b^2 - 4ac$ on its own.",
      ]),
      choose("Discover", "In $2x^2 - 3x - 4 = 0$, $c =$", "−4", "Include the sign.", [
        ["4", "Keep the minus."],
        ["−3", "That's $b$."],
      ]),
      worked(
        "The problem",
        "$a = 2$, $b = -3$, $c = -4$.",
        [
          ["$b^2 - 4ac = 9 + 32 = 41$", "Under the root."],
          ["$x = \\frac{3 \\pm \\sqrt{41}}{4}$", "Formula."],
          ["$x = 2.35$ or $x = -0.85$", "2 d.p."],
        ],
        "Check: $2(2.35)^2 - 3(2.35) - 4 \\approx 0$.",
      ),
      steps(
        "Together",
        "Solve $x^2 + 5x + 2 = 0$ to 2 d.p.",
        "$a = 1$, $b = 5$, $c = 2$.",
        [
          ["$b^2 - 4ac =$", "17", ["33", "$25 - 8$."], "17"],
          [
            "$x = \\frac{-5 \\pm \\sqrt{17}}{2}$:",
            "−0.44 or −4.56",
            ["0.44 or 4.56", "Start from $-b = -5$."],
            "−0.44, −4.56",
          ],
        ],
        "Two solutions.",
      ),
      choose(
        "Together",
        "If $b^2 - 4ac < 0$, the equation has",
        "no real solutions",
        "No square root of a negative.",
        [
          ["one solution", "That's when it's 0."],
          ["two solutions", "When it's positive."],
        ],
      ),
      typed("Your turn", "$b^2 - 4ac$ for $3x^2 + 4x - 1 = 0$", "28", "$16 + 12$.", "28.", {
        wrong: [["4", "$-4 \\times 3 \\times -1 = +12$."]],
      }),
      choose("Your turn", "So $x =$", "$\\frac{-4 \\pm \\sqrt{28}}{6}$", "Divide by $2a = 6$.", [
        ["$\\frac{4 \\pm \\sqrt{28}}{6}$", "$-b = -4$."],
        ["$-4 \\pm \\frac{\\sqrt{28}}{6}$", "Divide all of the top."],
      ]),
      choose(
        "Watch out",
        "Ivy works out $-3^2$ on her calculator as −9 for $b^2$. What's wrong?",
        "Square the whole $b$: $(-3)^2 = 9$",
        "Use brackets.",
        [["Nothing", "$b^2$ is never negative."]],
      ),
      mistake(
        "Ola uses the formula on $x^2 - 4x + 1 = 0$.",
        [
          "$a = 1$, $b = -4$, $c = 1$",
          "$x = \\frac{-4 \\pm \\sqrt{12}}{2}$",
          "$x = -0.27$ or $-3.73$",
        ],
        1,
        "$-b = +4$: $x = \\frac{4 \\pm \\sqrt{12}}{2}$, so 3.73 or 0.27.",
      ),
      choose(
        "Back to the problem",
        "“Solve $2x^2 - 3x - 4 = 0$ to 2 d.p.”",
        "2.35 and −0.85",
        "$\\frac{3 \\pm \\sqrt{41}}{4}$.",
        [
          ["−2.35 and 0.85", "$-b = +3$."],
          ["4.70 and −1.70", "Divide by $2a = 4$."],
        ],
      ),
      quiz([
        [
          ["$x^2 + 3x + 1$: $b^2 - 4ac$", "5", ["13", "−5"], "$9 - 4$."],
          ["$x^2 + 4x + 2$: $b^2 - 4ac$", "8", ["24", "−8"], "$16 - 8$."],
        ],
        [
          ["$b^2 - 4ac = 0$ means", "one repeated root", ["no roots", "two roots"], "Touches."],
          ["$b^2 - 4ac > 0$ means", "two roots", ["no roots", "one root"], "Crosses twice."],
        ],
        [
          ["In the formula, the bottom is", "$2a$", ["$a$", "$2b$"], "Under all of it."],
          [
            "$x^2 - 2x - 1 = 0$: roots",
            "$1 \\pm \\sqrt2$",
            ["$-1 \\pm \\sqrt2$", "$2 \\pm \\sqrt2$"],
            "$\\frac{2 \\pm \\sqrt8}{2}$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "rearrange-first",
    "GH-A18.c",
    "Quadratics that need rearranging",
    "Clear fractions and brackets, collect to one side = 0, then solve.",
    [
      problem("Fractions first", [
        "“Solve $\\frac{3}{x} + \\frac{2}{x + 1} = 1$.” It turns into a quadratic once the fractions are cleared.",
        "By the end of this lesson, you can do that and solve it.",
      ]),
      choose("Warm-up", "$x(x + 1)$", "$x^2 + x$", "Expand.", [
        ["$2x + 1$", "Multiply, don't add."],
        ["$x^2 + 1$", "$x \\times 1 = x$."],
      ]),
      choose(
        "Warm-up",
        "Factorise $x^2 - 4x - 3$?",
        "It doesn't factorise: use the formula",
        "No integer pair.",
        [
          ["$(x - 3)(x - 1)$", "That gives $+3$."],
          ["$(x + 1)(x - 3)$", "That gives $-2x$."],
        ],
      ),
      explain("Discover", "Get to = 0", [
        "Multiply every term by the common denominator to clear fractions. Expand any brackets.",
        "Collect everything on one side so it equals 0: $ax^2 + bx + c = 0$. Then factorise, complete the square or use the formula.",
      ]),
      choose(
        "Discover",
        "To clear $\\frac{3}{x} + \\frac{2}{x + 1}$, multiply by",
        "$x(x + 1)$",
        "Both denominators.",
        [
          ["$x$", "Not the second."],
          ["$2x + 1$", "Multiply them."],
        ],
      ),
      worked(
        "The problem",
        "$\\frac{3}{x} + \\frac{2}{x + 1} = 1$",
        [
          ["$3(x + 1) + 2x = x(x + 1)$", "× $x(x + 1)$."],
          ["$5x + 3 = x^2 + x$, so $x^2 - 4x - 3 = 0$", "To one side."],
          ["$x = \\frac{4 \\pm \\sqrt{28}}{2} = 2 \\pm \\sqrt7$", "Formula."],
        ],
        "$x = 4.65$ or $-0.65$ (2 d.p.).",
      ),
      steps(
        "Together",
        "Solve $x(x + 3) = 10$",
        "Expand first.",
        [
          [
            "Expand and rearrange:",
            "$x^2 + 3x - 10 = 0$",
            ["$x^2 + 3x = 0$", "Bring the 10 across."],
            "$x^2 + 3x - 10 = 0$",
          ],
          [
            "Factorise:",
            "$(x + 5)(x - 2) = 0$: $x = -5$ or 2",
            ["$x = 10$ or $x = -3$", "Get = 0 first."],
            "−5, 2",
          ],
        ],
        "Never set each bracket equal to 10.",
      ),
      choose(
        "Together",
        "A rectangle is $x$ by $(x + 4)$ with area 21. The equation",
        "$x^2 + 4x - 21 = 0$",
        "Area = 21.",
        [
          ["$x^2 + 4x = 0$", "Use the area."],
          ["$2x + 4 = 21$", "That's half the perimeter."],
        ],
      ),
      choose(
        "Your turn",
        "Solve $x^2 + 4x - 21 = 0$ for the length $x$",
        "$x = 3$",
        "$(x + 7)(x - 3)$; length can't be −7.",
        [
          ["$x = -7$", "A length is positive."],
          ["$x = 21$", "Factorise."],
        ],
      ),
      choose(
        "Your turn",
        "$\\frac{6}{x} = x - 1$ becomes",
        "$x^2 - x - 6 = 0$",
        "× $x$, rearrange.",
        [
          ["$6 = x - 1$", "Multiply both sides by $x$."],
          ["$x^2 - 6 = 0$", "Expand $x(x - 1)$."],
        ],
      ),
      choose(
        "Watch out",
        "Ben solves $x(x + 3) = 10$ by $x = 10$ or $x + 3 = 10$. What's wrong?",
        "That only works when it equals 0",
        "Zero product rule.",
        [["Nothing", "$10 \\times 13 \\ne 10$."]],
      ),
      mistake(
        "Kim clears $\\frac{4}{x} + 1 = x$.",
        ["× $x$: $4 + 1 = x^2$", "$x^2 = 5$", "$x = \\pm\\sqrt5$"],
        0,
        "Every term × $x$: $4 + x = x^2$, so $x^2 - x - 4 = 0$.",
      ),
      choose(
        "Back to the problem",
        "“Solve $\\frac{3}{x} + \\frac{2}{x + 1} = 1$.” The quadratic is",
        "$x^2 - 4x - 3 = 0$",
        "After clearing.",
        [
          ["$x^2 + x - 5 = 0$", "Expand $3(x + 1)$: $3x + 3$."],
          ["$5x + 3 = 1$", "Multiply the 1 too."],
        ],
      ),
      quiz([
        [
          [
            "$x^2 = 3x + 4$ becomes",
            "$x^2 - 3x - 4 = 0$",
            ["$x^2 + 3x + 4 = 0$", "$x^2 = 7x$"],
            "To one side.",
          ],
          [
            "$x^2 = 5x - 6$ becomes",
            "$x^2 - 5x + 6 = 0$",
            ["$x^2 + 5x - 6 = 0$", "$x^2 = -x$"],
            "To one side.",
          ],
        ],
        [
          ["Solve $x(x - 2) = 8$", "4 or −2", ["8 or 10", "−4 or 2"], "$(x - 4)(x + 2)$."],
          ["Solve $x(x + 1) = 12$", "3 or −4", ["12 or 11", "−3 or 4"], "$(x + 4)(x - 3)$."],
        ],
        [
          ["$\\frac{2}{x} = x + 1$: multiply by", "$x$", ["2", "$x + 1$"], "Clear the fraction."],
          [
            "A length from a quadratic must be",
            "positive",
            ["negative", "a fraction"],
            "Reject negatives.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "turning-points",
    "GH-A11",
    "Turning points from the completed square",
    "y = (x + p)² + q has its turning point at (−p, q).",
    [
      problem(
        "The lowest point",
        [
          "“Write $x^2 - 4x + 1$ in the form $(x + p)^2 + q$. Hence write down the coordinates of the turning point of $y = x^2 - 4x + 1$.”",
          "By the end of this lesson, you can read the turning point straight from the completed square.",
        ],
        turning,
      ),
      choose("Warm-up", "$x^2 - 4x + 1$ completed", "$(x - 2)^2 - 3$", "$-4 + 1$.", [
        ["$(x - 4)^2 - 15$", "Halve the 4."],
        ["$(x - 2)^2 + 5$", "Subtract the 4."],
      ]),
      typed(
        "Warm-up",
        "The smallest value of $(x - 2)^2$",
        "0",
        "A square is never negative.",
        "0, when $x = 2$.",
      ),
      explain(
        "Discover",
        "Smallest when the bracket is 0",
        [
          "$(x - 2)^2$ is never negative, so $(x - 2)^2 - 3$ is smallest when $x = 2$, where it equals −3.",
          "So $y = (x + p)^2 + q$ has its turning point at $(-p, q)$. Watch the sign of $p$.",
        ],
        turning,
      ),
      choose(
        "Discover",
        "Turning point of $y = (x + 3)^2 - 5$",
        "(−3, −5)",
        "Bracket 0 at $x = -3$.",
        [
          ["(3, −5)", "$x + 3 = 0$ at $-3$."],
          ["(−5, 3)", "$x$ first."],
        ],
      ),
      worked(
        "The problem",
        "$y = x^2 - 4x + 1$",
        [
          ["$= (x - 2)^2 - 3$", "Complete the square."],
          ["Turning point (2, −3)", "Bracket 0 at $x = 2$."],
        ],
        "A minimum, since the $x^2$ is positive.",
        turning,
      ),
      steps(
        "Together",
        "Turning point of $y = x^2 + 6x + 11$",
        "Complete the square.",
        [
          ["$y =$", "$(x + 3)^2 + 2$", ["$(x + 3)^2 + 11$", "$-9 + 11 = 2$."], "$(x + 3)^2 + 2$"],
          ["Turning point:", "(−3, 2)", ["(3, 2)", "Bracket 0 at $-3$."], "(−3, 2)"],
        ],
        "The minimum value of $y$ is 2.",
      ),
      choose(
        "Together",
        "The line of symmetry of $y = (x - 5)^2 + 1$",
        "$x = 5$",
        "Through the turning point.",
        [
          ["$x = -5$", "Bracket 0 at 5."],
          ["$y = 1$", "Vertical line."],
        ],
      ),
      choose("Your turn", "Turning point of $y = (x - 1)^2 + 4$", "(1, 4)", "Bracket 0 at 1.", [
        ["(−1, 4)", "Sign."],
        ["(4, 1)", "Order."],
      ]),
      choose("Your turn", "Minimum value of $x^2 + 2x + 6$", "5", "$(x + 1)^2 + 5$.", [
        ["6", "Complete the square."],
        ["−1", "That's the $x$-value."],
      ]),
      choose(
        "Watch out",
        "Zoe reads the turning point of $(x + 4)^2 - 1$ as (4, −1). What's wrong?",
        "The bracket is 0 when $x = -4$",
        "Change the sign.",
        [["Nothing", "$(4 + 4)^2 - 1 = 63$."]],
      ),
      mistake(
        "Leo finds the turning point of $y = x^2 - 10x + 30$.",
        ["$(x - 5)^2 - 25 + 30$", "$= (x - 5)^2 + 5$", "Turning point (−5, 5)"],
        2,
        "Bracket 0 at $x = 5$: (5, 5).",
      ),
      choose(
        "Back to the problem",
        "“Write down the turning point of $y = x^2 - 4x + 1$.”",
        "(2, −3)",
        "$(x - 2)^2 - 3$.",
        [
          ["(−2, −3)", "Sign of $p$."],
          ["(2, 1)", "Use $q$, not $c$."],
        ],
        { picture: turning },
      ),
      quiz([
        [
          ["Turning point of $(x - 3)^2 + 2$", "(3, 2)", ["(−3, 2)", "(2, 3)"], "Bracket 0."],
          ["Turning point of $(x + 2)^2 - 7$", "(−2, −7)", ["(2, −7)", "(−7, −2)"], "Bracket 0."],
        ],
        [
          ["$x^2 - 8x + 20 = (x - 4)^2 + q$. $q$", "4", ["20", "−16"], "$-16 + 20$."],
          ["$x^2 + 2x + 3 = (x + 1)^2 + q$. $q$", "2", ["3", "−1"], "$-1 + 3$."],
        ],
        [
          ["Minimum value of $(x - 6)^2 + 9$", "9", ["6", "0"], "Bracket 0."],
          ["Minimum value of $(x + 1)^2 - 4$", "−4", ["1", "0"], "Bracket 0."],
        ],
      ]),
    ],
  ),
];
