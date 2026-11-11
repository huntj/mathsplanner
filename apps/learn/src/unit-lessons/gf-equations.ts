// GCSE Foundation, "Equations", as four short lessons, one just before each skill: solving with
// the unknown on one side, on both sides, with brackets, and forming equations from situations.
// Each recaps the Key Stage 3 idea quickly, builds it to GCSE level, names the common mistakes and
// ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-equations";

export const gfEquations: UnitLesson[] = [
  lesson(
    U,
    "one-side",
    "GF-A17.a",
    "Solving equations",
    "Do the same to both sides, undoing operations in reverse order.",
    [
      problem("The exam question", [
        "“Solve $5x - 7 = 23$.” And “Solve $\\frac{x}{4} + 3 = 10$.” Each is worth 2 marks: one for a correct step, one for the answer.",
        "By the end of this lesson, you'll solve these and show the working that earns the marks.",
      ]),
      typed("Warm-up", "Work out $23 + 7$", "30", "Add.", "30."),
      typed("Warm-up", "Work out $30 \\div 5$", "6", "Divide.", "6."),
      explain(
        "Discover",
        "Keep it balanced",
        [
          "An equation is a balance. Whatever you do to one side, do to the other, and it stays true.",
          "Undo the operations in **reverse** order: first undo the $+$ or $-$, then the $\\times$ or $\\div$.",
        ],
        {
          kind: "maths",
          tex: "\\begin{aligned} 5x - 7 &= 23 \\\\ 5x &= 30 \\\\ x &= 6 \\end{aligned}",
        },
      ),
      {
        kind: "balance",
        tag: "Discover",
        title: "Solve $3x + 4 = 19$",
        a: 3,
        b: 4,
        c: 19,
        letter: "x",
        done: "$x = 5$. Check: $15 + 4 = 19$ ✓",
      },
      worked(
        "Solve $5x - 7 = 23$",
        "Solve $5x - 7 = 23$.",
        [
          ["$5x = 30$", "Add 7 to both sides."],
          ["$x = 6$", "Divide both sides by 5."],
        ],
        "Check: $5 \\times 6 - 7 = 23$ ✓",
      ),
      steps(
        "Together",
        "Solve $\\frac{x}{4} + 3 = 10$",
        "$\\frac{x}{4} + 3 = 10$",
        [
          [
            "Subtract 3:",
            "$\\frac{x}{4} = 7$",
            ["$\\frac{x}{4} = 13$", "Undo + 3 by subtracting."],
            "$\\frac{x}{4} = 7$",
          ],
          [
            "Multiply by 4:",
            "$x = 28$",
            ["$x = \\frac74$", "Undo ÷ 4 by multiplying."],
            "$x = 28$",
          ],
        ],
        "Check: $28 \\div 4 + 3 = 10$ ✓",
      ),
      steps(
        "Together",
        "Solve $7 - 2x = 1$",
        "A negative $x$ term.",
        [
          [
            "Subtract 7:",
            "$-2x = -6$",
            ["$2x = -6$", "Keep the minus with the $2x$."],
            "$-2x = -6$",
          ],
          ["Divide by −2:", "$x = 3$", ["$x = -3$", "Negative ÷ negative is positive."], "$x = 3$"],
        ],
        "Check: $7 - 6 = 1$ ✓",
      ),
      typed("Your turn", "Solve $4x + 9 = 37$", "7", "Subtract 9, divide by 4.", "$x = 7$.", {
        wrong: [["11.5", "Subtract 9 first."]],
      }),
      typed(
        "Your turn",
        "Solve $\\frac{x}{3} - 2 = 5$",
        "21",
        "Add 2, multiply by 3.",
        "$x = 21$.",
        { wrong: [["9", "Add 2 first: $\\frac{x}{3} = 7$."]] },
      ),
      choose(
        "Watch out",
        "For $3x + 6 = 21$, Ella divides by 3 first and writes $x + 6 = 7$. What's wrong?",
        "Dividing by 3 divides the 6 too: undo + 6 first",
        "$3x = 15$, so $x = 5$.",
        [["Nothing", "Check: $x = 1$ gives $3 + 6 = 9$, not 21."]],
      ),
      mistake(
        "Kai solves $6x - 4 = 20$.",
        ["$6x = 16$", "$x = \\frac{16}{6}$", "$x = 2\\frac23$"],
        0,
        "Add 4 to undo − 4: $6x = 24$, so $x = 4$.",
      ),
      typed(
        "Back to the problem",
        "“Solve $5x - 7 = 23$.”",
        "6",
        "Add 7, divide by 5.",
        "$x = 6$.",
        { wrong: [["3.2", "Add 7, don't subtract."]] },
      ),
      quiz([
        [
          ["$2x + 5 = 17$", "6", ["11", "8.5"], "$2x = 12$."],
          ["$3x + 2 = 20$", "6", ["7.3", "18"], "$3x = 18$."],
        ],
        [
          ["$\\frac{x}{5} = 4$", "20", ["0.8", "9"], "Multiply by 5."],
          ["$\\frac{x}{2} + 1 = 6$", "10", ["2.5", "14"], "$\\frac{x}{2} = 5$."],
        ],
        [
          ["$10 - 3x = 4$", "2", ["−2", "4.67"], "$-3x = -6$."],
          ["$12 - 4x = 0$", "3", ["−3", "8"], "$-4x = -12$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "both-sides",
    "GF-A17.b",
    "Unknowns on both sides",
    "Move the smaller x term first, then solve as usual.",
    [
      problem("Two phone plans", [
        "Plan A costs £5 plus £2 a GB; Plan B costs £17 plus £0.50 a GB. For what data do they cost the same? That's $5 + 2x = 17 + 0.5x$.",
        "By the end of this lesson, you can solve equations with $x$ on both sides.",
      ]),
      typed("Warm-up", "Simplify $5x - 2x$", "3x", "Like terms.", "$3x$."),
      typed("Warm-up", "Solve $3x = 12$", "4", "Divide by 3.", "$x = 4$."),
      explain(
        "Discover",
        "Gather the x's",
        [
          "Take the **smaller** $x$ term from both sides, so the $x$'s end up on one side and stay positive.",
          "Then it's a one-sided equation: undo the number, then the multiplier.",
        ],
        {
          kind: "maths",
          tex: "\\begin{aligned} 7x + 3 &= 4x + 15 \\\\ 3x + 3 &= 15 \\end{aligned}",
        },
      ),
      {
        kind: "balance",
        tag: "Discover",
        title: "Solve $5x + 2 = 3x + 10$",
        a: 5,
        b: 2,
        c: 10,
        d: 3,
        letter: "x",
        done: "$x = 4$. Check: $22 = 22$ ✓",
      },
      worked(
        "Solve $7x + 3 = 4x + 15$",
        "Solve $7x + 3 = 4x + 15$.",
        [
          ["$3x + 3 = 15$", "Subtract $4x$ from both sides."],
          ["$3x = 12$", "Subtract 3."],
          ["$x = 4$", "Divide by 3."],
        ],
        "Check: $31 = 31$ ✓",
      ),
      steps(
        "Together",
        "Solve $2x - 5 = 6x + 7$",
        "Smaller $x$ term: $2x$.",
        [
          [
            "Subtract $2x$:",
            "$-5 = 4x + 7$",
            ["$-5 = 8x + 7$", "$6x - 2x = 4x$."],
            "$-5 = 4x + 7$",
          ],
          ["Subtract 7, divide by 4:", "$x = -3$", ["$x = 3$", "$-12 \\div 4 = -3$."], "$x = -3$"],
        ],
        "Check: $-11 = -11$ ✓",
      ),
      steps(
        "Together",
        "The phone plans: $5 + 2x = 17 + 0.5x$",
        "Solve.",
        [
          [
            "Subtract $0.5x$:",
            "$5 + 1.5x = 17$",
            ["$5 + 2.5x = 17$", "$2x - 0.5x = 1.5x$."],
            "$5 + 1.5x = 17$",
          ],
          ["Solve:", "$x = 8$", ["$x = 14.7$", "$1.5x = 12$."], "8 GB"],
        ],
        "At 8 GB both cost £21.",
      ),
      typed("Your turn", "Solve $6x - 1 = 2x + 11$", "3", "Subtract $2x$, add 1.", "$x = 3$.", {
        wrong: [["1.25", "Subtract $2x$, not add."]],
      }),
      typed(
        "Your turn",
        "Solve $3x + 8 = 5x - 2$",
        "5",
        "Subtract $3x$: $8 = 2x - 2$.",
        "$x = 5$.",
      ),
      choose(
        "Watch out",
        "For $8x + 3 = 5x + 18$, Dev adds $5x$ to both sides. What's wrong?",
        "To remove $5x$, subtract it: $3x + 3 = 18$",
        "Adding makes $13x$ and $10x$.",
        [["Nothing", "That keeps $x$ on both sides."]],
      ),
      mistake(
        "Mo solves $4x + 9 = x + 3$.",
        ["$3x + 9 = 3$", "$3x = 12$", "$x = 4$"],
        1,
        "Subtract 9: $3x = -6$, so $x = -2$.",
      ),
      choose(
        "Back to the problem",
        "“$5 + 2x = 17 + 0.5x$. Solve to find when the plans cost the same.”",
        "$x = 8$ GB",
        "$1.5x = 12$.",
        [
          ["$x = 4.8$ GB", "$2x - 0.5x = 1.5x$, not $2.5x$."],
          ["$x = 6$ GB", "$1.5x = 12$."],
        ],
      ),
      quiz([
        [
          ["$5x + 1 = 3x + 9$", "4", ["5", "1.25"], "$2x = 8$."],
          ["$7x - 2 = 4x + 10$", "4", ["8", "2.7"], "$3x = 12$."],
        ],
        [
          ["$x + 12 = 4x$", "4", ["3", "−4"], "$12 = 3x$."],
          ["$2x + 15 = 5x$", "5", ["3", "−5"], "$15 = 3x$."],
        ],
        [
          ["$3x + 10 = 5x + 2$", "4", ["6", "−4"], "$8 = 2x$."],
          ["$9x - 4 = 11x - 10$", "3", ["−3", "7"], "$6 = 2x$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "brackets",
    "GF-A17.c",
    "Equations with brackets",
    "Expand first (or divide first), then solve.",
    [
      problem("Concert tickets", [
        "Four friends each pay for a ticket plus a £3 booking fee. In total they pay £68: $4(t + 3) = 68$. How much is a ticket?",
        "By the end of this lesson, you can solve equations with brackets two ways.",
      ]),
      typed(
        "Warm-up",
        "Expand $4(t + 3)$",
        ["4t+12", "12+4t"],
        "Times both terms by 4.",
        "$4t + 12$.",
      ),
      typed("Warm-up", "Solve $4t = 56$", "14", "Divide by 4.", "$t = 14$."),
      explain(
        "Discover",
        "Expand, then solve",
        [
          "Expand the brackets so there are no brackets left, collect like terms, then solve as usual.",
          "If the number outside divides the other side exactly, you can divide first instead: $4(t + 3) = 68 \\Rightarrow t + 3 = 17$.",
        ],
        { kind: "maths", tex: "\\begin{aligned} 4(t + 3) &= 68 \\\\ 4t + 12 &= 68 \\end{aligned}" },
      ),
      choose(
        "Discover",
        "First step for $3(x - 2) = 21$, expanding",
        "$3x - 6 = 21$",
        "Both terms × 3.",
        [
          ["$3x - 2 = 21$", "Multiply the 2 too."],
          ["$x - 6 = 21$", "Multiply the $x$ too."],
        ],
      ),
      worked(
        "The tickets",
        "Solve $4(t + 3) = 68$.",
        [
          ["$4t + 12 = 68$", "Expand."],
          ["$4t = 56$", "Subtract 12."],
          ["$t = 14$", "Divide by 4."],
        ],
        "A ticket is £14.",
      ),
      steps(
        "Together",
        "Solve $5(2x - 1) = 3(x + 4)$",
        "Brackets on both sides.",
        [
          [
            "Expand both:",
            "$10x - 5 = 3x + 12$",
            ["$10x - 1 = 3x + 4$", "Multiply every term."],
            "$10x - 5 = 3x + 12$",
          ],
          ["Solve:", "$x = \\frac{17}{7}$", ["$x = 1$", "$7x = 17$."], "$x = 2\\frac37$"],
        ],
        "Answers needn't be whole.",
      ),
      steps(
        "Together",
        "Solve $2(x + 5) - 3 = 15$",
        "Expand and collect.",
        [
          [
            "Expand:",
            "$2x + 10 - 3 = 15$",
            ["$2x + 5 - 3 = 15$", "$2 \\times 5 = 10$."],
            "$2x + 7 = 15$",
          ],
          ["Solve:", "$x = 4$", ["$x = 11$", "$2x = 8$."], "$x = 4$"],
        ],
        "Check: $2 \\times 9 - 3 = 15$ ✓",
      ),
      typed("Your turn", "Solve $3(x - 2) = 21$", "9", "$3x - 6 = 21$.", "$x = 9$.", {
        wrong: [["7.67", "Expand: $3x - 6$."]],
      }),
      typed("Your turn", "Solve $4(2x + 1) = 36$", "4", "$8x + 4 = 36$.", "$x = 4$.", {
        wrong: [["4.375", "Multiply the 1 by 4 too."]],
      }),
      choose(
        "Watch out",
        "For $-2(x - 4) = 10$, Ivy expands to $-2x - 8 = 10$. What's wrong?",
        "$-2 \\times -4 = +8$: $-2x + 8 = 10$",
        "Watch the sign.",
        [["Nothing", "Two negatives make a positive."]],
      ),
      mistake(
        "Tom solves $2(x + 5) = 18$.",
        ["$2x + 5 = 18$", "$2x = 13$", "$x = 6.5$"],
        0,
        "Multiply both terms: $2x + 10 = 18$, so $x = 4$.",
      ),
      typed(
        "Back to the problem",
        "“Solve $4(t + 3) = 68$ to find the ticket price.”",
        "14",
        "Expand, or divide by 4 first.",
        "£14.",
        { wrong: [["16.25", "$4 \\times 3 = 12$, not 3."]] },
      ),
      quiz([
        [
          ["$2(x + 3) = 14$", "4", ["5.5", "8"], "$2x + 6 = 14$."],
          ["$5(x - 1) = 20$", "5", ["4.2", "3"], "$5x - 5 = 20$."],
        ],
        [
          ["$3(2x + 1) = 27$", "4", ["4.33", "13"], "$6x + 3 = 27$."],
          ["$4(3x - 2) = 28$", "3", ["2.5", "9"], "$12x - 8 = 28$."],
        ],
        [
          ["$2(x + 4) = x + 11$", "3", ["7", "19"], "$2x + 8 = x + 11$."],
          ["$3(x - 1) = x + 7$", "5", ["3", "4"], "$3x - 3 = x + 7$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "form",
    "GF-A21",
    "Forming and solving equations",
    "Turn words or a diagram into an equation, solve it, and answer the question.",
    [
      problem(
        "The triangle",
        [
          "“The angles of a triangle are $x$, $2x$ and $3x + 30$. Work out the size of the largest angle.”",
          "First write an equation from the facts. By the end of this lesson, you can set it up, solve it and finish the question.",
        ],
        {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 7, y: 0 },
            { x: 2.2, y: 4 },
          ],
          angles: ["x", "2x", "3x + 30"],
        },
      ),
      typed("Warm-up", "Angles in a triangle add to", "180", "A straight line.", "180°.", {
        unit: "°",
      }),
      typed("Warm-up", "Simplify $x + 2x + 3x$", "6x", "Like terms.", "$6x$."),
      explain(
        "Discover",
        "Find the fact that gives the equals",
        [
          "Look for a fact that makes an equation: angles add to 180°, a perimeter is given, two amounts are equal, ages add up…",
          "Solve, then **answer the actual question**: it may ask for an angle or a price, not $x$.",
        ],
        { kind: "maths", tex: "x + 2x + (3x + 30) = 180" },
      ),
      choose(
        "Discover",
        "A rectangle is $x$ by $x + 4$, with perimeter 40. The equation",
        "$4x + 8 = 40$",
        "$x + x + (x + 4) + (x + 4)$.",
        [
          ["$x(x + 4) = 40$", "That's area, not perimeter."],
          ["$2x + 4 = 40$", "Only two sides."],
        ],
      ),
      worked(
        "The triangle",
        "Angles $x$, $2x$, $3x + 30$. Find the largest angle.",
        [
          ["$6x + 30 = 180$", "Angles add to 180°."],
          ["$6x = 150$, so $x = 25$", "Solve."],
          ["Largest: $3(25) + 30 = 105°$", "Answer the question."],
        ],
        "Check: $25 + 50 + 105 = 180$ ✓",
      ),
      steps(
        "Together",
        "Ages: Ben is 3 years older than Amy. Their ages add to 29.",
        "Find Amy's age.",
        [
          [
            "Amy is $a$. The equation:",
            "$a + (a + 3) = 29$",
            ["$a + 3 = 29$", "Add both ages."],
            "$2a + 3 = 29$",
          ],
          ["Solve:", "$a = 13$", ["$a = 16$", "$2a = 26$."], "Amy is 13"],
        ],
        "Ben is 16: check $13 + 16 = 29$ ✓",
      ),
      steps(
        "Together",
        "The rectangle: $x$ by $x + 4$, perimeter 40",
        "Find its area.",
        [
          ["$4x + 8 = 40$, so $x =$", "8", ["10", "$4x = 32$."], "8 by 12"],
          ["Area:", "96", ["40", "$8 \\times 12$."], "96 cm²"],
        ],
        "The question asked for area, not $x$.",
      ),
      typed(
        "Your turn",
        "I think of a number, double it and add 7: the answer is 31. The number?",
        "12",
        "$2n + 7 = 31$.",
        "12.",
        { wrong: [["19", "Subtract 7, then halve."]] },
      ),
      typed(
        "Your turn",
        "Three consecutive numbers add to 72. The smallest?",
        "23",
        "$n + (n + 1) + (n + 2) = 72$.",
        "23.",
        { wrong: [["24", "That's the middle one."]] },
      ),
      choose(
        "Watch out",
        "In the triangle question, Jo finds $x = 25$ and writes “Answer: 25°”. What's wrong?",
        "The question asks for the largest angle: 105°",
        "Read what's asked.",
        [["Nothing", "25° is $x$, the smallest angle."]],
      ),
      mistake(
        "Raj forms an equation: a pen costs $p$, a pencil is 20p cheaper, and 2 pens and 3 pencils cost £2.40 (240p).",
        ["Pencil: $p - 20$", "$2p + 3p - 20 = 240$", "$5p = 260$, $p = 52$"],
        1,
        "Three pencils: $3(p - 20) = 3p - 60$. So $5p - 60 = 240$, $p = 60$p.",
      ),
      choose(
        "Back to the problem",
        "“The angles are $x$, $2x$ and $3x + 30$. Work out the size of the largest angle.”",
        "105°",
        "$x = 25$, then $3x + 30$.",
        [
          ["25°", "That's $x$."],
          ["150°", "That's $6x$."],
        ],
      ),
      quiz([
        [
          ["Angles $x$, $x$, $2x$ in a triangle. $x$?", "45°", ["60°", "90°"], "$4x = 180$."],
          ["Angles $x$, $3x$, $5x$ in a triangle. $x$?", "20°", ["36°", "100°"], "$9x = 180$."],
        ],
        [
          ["A square's perimeter is $4(x + 2) = 36$. $x$?", "7", ["9", "8.5"], "$x + 2 = 9$."],
          ["A rectangle $x$ by 5 has perimeter 26. $x$?", "8", ["21", "13"], "$2x + 10 = 26$."],
        ],
        [
          ["Number × 3, − 4, = 26. Number?", "10", ["7.3", "74"], "$3n - 4 = 26$."],
          ["Number × 5, + 2, = 47. Number?", "9", ["9.8", "223"], "$5n + 2 = 47$."],
        ],
      ]),
    ],
  ),
];
