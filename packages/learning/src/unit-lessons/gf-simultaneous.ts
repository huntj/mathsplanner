// GCSE Foundation, "Simultaneous equations and inequalities", as four short lessons, one just
// before each skill: solving by elimination, by substitution, and with graphs, and solving linear
// inequalities on a number line. Each recaps the Key Stage 3 idea quickly, builds it to GCSE
// level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, Rule, UnitLesson } from "./types.ts";

const U = "gf-simultaneous";
const graph = (lines: Rule[], points: { x: number; y: number }[] = []): Picture => ({
  kind: "graph",
  range: { xMin: -1, xMax: 6, yMin: -1, yMax: 9 },
  lines,
  ...(points.length ? { points } : {}),
});

export const gfSimultaneous: UnitLesson[] = [
  lesson(
    U,
    "elimination",
    "GF-A19.a",
    "Elimination",
    "Add or subtract the equations to remove one letter.",
    [
      problem("Café prices", [
        "3 coffees and 2 teas cost £10.50. 3 coffees and 1 tea cost £9. “Work out the cost of a coffee and of a tea.”",
        "Two unknowns, two facts. By the end of this lesson, you can solve them together.",
      ]),
      typed("Warm-up", "$10.50 - 9$", "1.5", "Subtract.", "1.50."),
      typed("Warm-up", "Solve $3c + 1.5 = 9$", "2.5", "$3c = 7.5$.", "$c = 2.5$."),
      explain(
        "Discover",
        "Remove one letter",
        [
          "**Simultaneous** equations are true at the same time. If one letter has the **same coefficient** in both, subtract the equations and it vanishes.",
          "If the signs are opposite ($+2y$ and $-2y$), **add** instead.",
        ],
        {
          kind: "maths",
          tex: "\\begin{array}{r} 3c + 2t = 10.5 \\\\ 3c + t = 9 \\\\ \\hline t = 1.5 \\end{array}",
        },
      ),
      choose(
        "Discover",
        "$x + y = 10$ and $x - y = 4$. Add them:",
        "$2x = 14$",
        "The $y$s cancel.",
        [
          ["$2y = 6$", "Adding cancels $y$, not $x$."],
          ["$2x = 6$", "$10 + 4 = 14$."],
        ],
      ),
      worked(
        "The café",
        "Solve $3c + 2t = 10.5$, $3c + t = 9$.",
        [
          ["Subtract: $t = 1.5$", "The $3c$ cancels."],
          ["$3c + 1.5 = 9$, so $c = 2.5$", "Substitute back."],
        ],
        "Coffee £2.50, tea £1.50. Check: $7.50 + 3 = 10.50$ ✓",
      ),
      steps(
        "Together",
        "Solve $2x + 3y = 13$ and $4x - 3y = 5$",
        "Opposite signs.",
        [
          [
            "Add them:",
            "$6x = 18$",
            ["$-2x = 8$", "$+3y$ and $-3y$ cancel when added."],
            "$x = 3$",
          ],
          [
            "Substitute $x = 3$: $6 + 3y = 13$, so $y =$",
            "$\\frac73$",
            ["7", "$3y = 7$."],
            "$y = \\frac73$",
          ],
        ],
        "Answers needn't be whole.",
      ),
      steps(
        "Together",
        "Solve $x + 2y = 8$ and $3x + y = 9$",
        "Match a coefficient first.",
        [
          [
            "Multiply the first by 3:",
            "$3x + 6y = 24$",
            ["$3x + 2y = 8$", "Every term × 3."],
            "$3x + 6y = 24$",
          ],
          [
            "Subtract the second: $5y = 15$, so",
            "$y = 3$, $x = 2$",
            ["$y = 5$", "$15 \\div 5 = 3$."],
            "$x = 2$, $y = 3$",
          ],
        ],
        "Check: $2 + 6 = 8$ ✓",
      ),
      choose(
        "Your turn",
        "Solve $a + b = 12$, $a - b = 2$",
        "$a = 7$, $b = 5$",
        "Add: $2a = 14$.",
        [
          ["$a = 5$, $b = 7$", "Check: $5 - 7 \\ne 2$."],
          ["$a = 6$, $b = 6$", "$6 - 6 = 0$."],
        ],
      ),
      choose(
        "Your turn",
        "Solve $2x + y = 11$, $x + y = 7$",
        "$x = 4$, $y = 3$",
        "Subtract: $x = 4$.",
        [
          ["$x = 3$, $y = 4$", "Check: $6 + 4 = 10$."],
          ["$x = 18$, $y = -11$", "Subtract, don't add."],
        ],
      ),
      choose(
        "Watch out",
        "$3x + 2y = 16$ and $3x - 2y = 8$. Ben subtracts and gets $0 = 8$. What's wrong?",
        "$2y - (-2y) = 4y$: subtracting gives $4y = 8$, or add to remove $y$",
        "Mind the signs.",
        [["Nothing", "Subtracting a negative adds."]],
      ),
      mistake(
        "Kim solves $x + y = 9$, $x - y = 3$.",
        ["Add: $2x = 12$, so $x = 6$", "Substitute: $6 + y = 9$", "$y = 15$"],
        2,
        "Subtract 6: $y = 3$.",
      ),
      choose(
        "Back to the problem",
        "“3 coffees and 2 teas cost £10.50; 3 coffees and 1 tea cost £9. Find each price.”",
        "Coffee £2.50, tea £1.50",
        "Subtract to find the tea.",
        [
          ["Coffee £1.50, tea £2.50", "Check: $4.50 + 5 \\ne 10.50$."],
          ["Coffee £3, tea £0.75", "Check the second: $9 + 0.75 \\ne 9$."],
        ],
      ),
      quiz([
        [
          [
            "$x + y = 10$, $x - y = 2$",
            "$x = 6$, $y = 4$",
            ["$x = 4$, $y = 6$", "$x = 5$, $y = 5$"],
            "Add.",
          ],
          [
            "$x + y = 15$, $x - y = 5$",
            "$x = 10$, $y = 5$",
            ["$x = 5$, $y = 10$", "$x = 7$, $y = 8$"],
            "Add.",
          ],
        ],
        [
          [
            "$3a + b = 14$, $a + b = 6$",
            "$a = 4$, $b = 2$",
            ["$a = 2$, $b = 4$", "$a = 5$, $b = 1$"],
            "Subtract.",
          ],
          [
            "$5p + q = 17$, $2p + q = 8$",
            "$p = 3$, $q = 2$",
            ["$p = 2$, $q = 7$", "$p = 1$, $q = 12$"],
            "Subtract.",
          ],
        ],
        [
          ["Same signs, same coefficient:", "subtract", ["add", "multiply"], "Same: subtract."],
          ["Opposite signs:", "add", ["subtract", "divide"], "Opposite: add."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "substitution",
    "GF-A19.b",
    "Substitution",
    "When one equation gives a letter on its own, put it into the other.",
    [
      problem("Ages", [
        "Amy is 4 years older than Ben: $a = b + 4$. Their ages add to 30: $a + b = 30$. “How old is each?”",
        "One equation already says what $a$ is. By the end of this lesson, you can use that directly.",
      ]),
      typed("Warm-up", "Solve $2b + 4 = 30$", "13", "$2b = 26$.", "$b = 13$."),
      typed("Warm-up", "If $b = 13$, $b + 4 =$", "17", "Add.", "17."),
      explain(
        "Discover",
        "Swap it in",
        [
          "If one equation says $a = \\ldots$, **substitute** that expression for $a$ in the other. Now there's one letter.",
          "Solve, then put the answer back to find the other letter.",
        ],
        {
          kind: "maths",
          tex: "\\begin{aligned} a + b &= 30 \\\\ (b + 4) + b &= 30 \\end{aligned}",
        },
      ),
      choose(
        "Discover",
        "$y = 2x$ and $x + y = 12$. Substitute:",
        "$x + 2x = 12$",
        "Replace $y$ with $2x$.",
        [
          ["$2x + y = 12$", "Replace $y$, not $x$."],
          ["$y + 2x = 12$", "Replace the $y$ in the second."],
        ],
      ),
      worked(
        "Ages",
        "$a = b + 4$, $a + b = 30$.",
        [
          ["$(b + 4) + b = 30$", "Substitute."],
          ["$2b + 4 = 30$, so $b = 13$", "Solve."],
          ["$a = 17$", "Back-substitute."],
        ],
        "Ben 13, Amy 17. Check: $13 + 17 = 30$ ✓",
      ),
      steps(
        "Together",
        "Solve $y = 3x - 1$ and $2x + y = 14$",
        "Substitute.",
        [
          [
            "$2x + (3x - 1) = 14$, so",
            "$5x = 15$",
            ["$5x = 13$", "Add 1 to both sides."],
            "$x = 3$",
          ],
          ["$y = 3(3) - 1 =$", "8", ["10", "$9 - 1$."], "$x = 3$, $y = 8$"],
        ],
        "Check: $6 + 8 = 14$ ✓",
      ),
      choose(
        "Together",
        "Which is easier by substitution?",
        "$y = 4x$, $3x + y = 21$",
        "$y$ is already on its own.",
        [["$2x + 3y = 7$, $5x - 3y = 7$", "Elimination suits this."]],
      ),
      choose("Your turn", "$y = x + 2$, $x + y = 10$", "$x = 4$, $y = 6$", "$2x + 2 = 10$.", [
        ["$x = 6$, $y = 4$", "Check: $4 \\ne 6 + 2$."],
        ["$x = 5$, $y = 5$", "$5 \\ne 7$."],
      ]),
      choose("Your turn", "$x = 2y$, $x + 3y = 20$", "$x = 8$, $y = 4$", "$5y = 20$.", [
        ["$x = 4$, $y = 8$", "$x = 2y$: $x$ is bigger."],
        ["$x = 10$, $y = 5$", "$10 + 15 \\ne 20$."],
      ]),
      choose(
        "Watch out",
        "Substituting $y = 2x - 3$ into $5x - y = 9$, Ivy writes $5x - 2x - 3 = 9$. What's wrong?",
        "Use brackets: $5x - (2x - 3) = 5x - 2x + 3$",
        "The minus applies to the whole expression.",
        [["Nothing", "$-(2x - 3) = -2x + 3$."]],
      ),
      mistake(
        "Ali solves $y = x - 1$, $x + y = 9$.",
        ["$x + x - 1 = 9$", "$2x = 8$", "$x = 4$"],
        1,
        "Add 1: $2x = 10$, so $x = 5$, $y = 4$.",
      ),
      choose(
        "Back to the problem",
        "“$a = b + 4$ and $a + b = 30$. How old is each?”",
        "Ben 13, Amy 17",
        "$2b + 4 = 30$.",
        [
          ["Ben 17, Amy 13", "Amy is older."],
          ["Ben 15, Amy 15", "They differ by 4."],
        ],
      ),
      quiz([
        [
          [
            "$y = 2x$, $x + y = 9$",
            "$x = 3$, $y = 6$",
            ["$x = 6$, $y = 3$", "$x = 4.5$, $y = 4.5$"],
            "$3x = 9$.",
          ],
          [
            "$y = 3x$, $x + y = 8$",
            "$x = 2$, $y = 6$",
            ["$x = 6$, $y = 2$", "$x = 4$, $y = 4$"],
            "$4x = 8$.",
          ],
        ],
        [
          [
            "$y = x + 5$, $2x + y = 20$",
            "$x = 5$, $y = 10$",
            ["$x = 10$, $y = 5$", "$x = 7.5$, $y = 12.5$"],
            "$3x + 5 = 20$.",
          ],
          [
            "$y = x - 2$, $x + y = 12$",
            "$x = 7$, $y = 5$",
            ["$x = 5$, $y = 7$", "$x = 6$, $y = 6$"],
            "$2x - 2 = 12$.",
          ],
        ],
        [
          [
            "Substitution suits equations with",
            "a letter on its own",
            ["equal coefficients", "no letters"],
            "$y = \\ldots$",
          ],
          [
            "After finding $x$, find $y$ by",
            "substituting back",
            ["guessing", "adding $x$"],
            "Back-substitute.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "graphs",
    "GF-A19.c",
    "Solving with graphs",
    "Where two lines cross solves both equations.",
    [
      problem(
        "Two taxis",
        [
          "Taxi A: $y = x + 4$. Taxi B: $y = 2x + 1$ ($y$ in £, $x$ in miles). “Use the graph to find when they cost the same.”",
          "By the end of this lesson, you can solve simultaneous equations from a graph.",
        ],
        graph([
          { m: 1, c: 4 },
          { m: 2, c: 1 },
        ]),
      ),
      choose("Warm-up", "Is (3, 7) on $y = x + 4$?", "Yes", "$3 + 4 = 7$.", [
        ["No", "Substitute $x = 3$."],
      ]),
      choose("Warm-up", "Is (3, 7) on $y = 2x + 1$?", "Yes", "$6 + 1 = 7$.", [
        ["No", "Substitute $x = 3$."],
      ]),
      explain(
        "Discover",
        "On both lines",
        [
          "A point on both lines fits both equations. So the **crossing point** is the solution.",
          "Read $x$ and $y$ from the graph, and check in both equations.",
        ],
        graph(
          [
            { m: 1, c: 4 },
            { m: 2, c: 1 },
          ],
          [{ x: 3, y: 7 }],
        ),
      ),
      choose(
        "Discover",
        "Where do $y = x + 1$ and $y = 7 - x$ cross?",
        "(3, 4)",
        "$3 + 1 = 4$ and $7 - 3 = 4$.",
        [
          ["(4, 3)", "$x$ first."],
          ["(1, 7)", "That's on neither."],
        ],
        {
          picture: graph([
            { m: 1, c: 1 },
            { m: -1, c: 7 },
          ]),
        },
      ),
      worked(
        "The taxis",
        "Solve $y = x + 4$ and $y = 2x + 1$ using the graph.",
        [
          ["The lines cross at (3, 7)", "Read it."],
          ["$x = 3$, $y = 7$", "Check: $3 + 4 = 7$, $6 + 1 = 7$ ✓"],
        ],
        "They cost £7 for 3 miles.",
        graph(
          [
            { m: 1, c: 4 },
            { m: 2, c: 1 },
          ],
          [{ x: 3, y: 7 }],
        ),
      ),
      steps(
        "Together",
        "Solve $y = 2x$ and $y = x + 2$",
        "Read the crossing.",
        [
          ["They cross at", "(2, 4)", ["(4, 2)", "$x$ first."], "(2, 4)"],
          [
            "Check in $y = 2x$:",
            "$2 \\times 2 = 4$ ✓",
            ["$2 \\times 4 = 8$", "Put $x = 2$."],
            "$x = 2$, $y = 4$",
          ],
        ],
        "Both equations check.",
        graph([
          { m: 2, c: 0 },
          { m: 1, c: 2 },
        ]),
      ),
      choose(
        "Together",
        "Why might a graph give only an estimate?",
        "The lines may cross between grid lines",
        "Read as accurately as you can.",
        [["Graphs are always exact", "Not between grid lines."]],
      ),
      choose(
        "Your turn",
        "Solve using the graph",
        "$x = 1$, $y = 3$",
        "They cross at (1, 3).",
        [
          ["$x = 3$, $y = 1$", "$x$ first."],
          ["$x = 0$, $y = 2$", "That's where one line crosses the axis."],
        ],
        {
          picture: graph([
            { m: 1, c: 2 },
            { m: -1, c: 4 },
          ]),
        },
      ),
      choose(
        "Your turn",
        "Parallel lines like $y = 2x + 1$ and $y = 2x + 5$ have",
        "no solution",
        "They never cross.",
        [
          ["one solution", "Parallel lines don't meet."],
          ["two solutions", "Straight lines meet at most once."],
        ],
      ),
      choose(
        "Watch out",
        "The lines cross at (4, 6). Ned writes $x = 4$. What's missing?",
        "$y = 6$: give both",
        "The solution is a pair.",
        [["Nothing", "Simultaneous solutions have $x$ and $y$."]],
      ),
      mistake(
        "Ana reads the crossing of $y = x + 3$ and $y = 2x$.",
        ["They cross at (3, 6)", "Check: $3 + 3 = 6$ ✓", "So $x = 6$, $y = 3$"],
        2,
        "The point is (3, 6): $x = 3$, $y = 6$.",
      ),
      choose(
        "Back to the problem",
        "“Use the graph to find when the taxis cost the same.”",
        "At 3 miles, both £7",
        "The crossing (3, 7).",
        [
          ["At 7 miles", "7 is the cost."],
          ["At 4 miles", "Read where the lines cross."],
        ],
        {
          picture: graph([
            { m: 1, c: 4 },
            { m: 2, c: 1 },
          ]),
        },
      ),
      quiz([
        [
          [
            "Solve from the graph",
            "$x = 3$, $y = 3$",
            ["$x = 6$, $y = 0$", "$x = 0$, $y = 6$"],
            "They cross at (3, 3).",
            graph([
              { m: 1, c: 0 },
              { m: -1, c: 6 },
            ]),
          ],
          [
            "Solve these from the graph",
            "$x = 2$, $y = 5$",
            ["$x = 5$, $y = 2$", "$x = 1$, $y = 4$"],
            "They cross at (2, 5).",
            graph([
              { m: 1, c: 3 },
              { m: 2, c: 1 },
            ]),
          ],
        ],
        [
          [
            "The crossing point gives",
            "the solution",
            ["the gradient", "the intercepts"],
            "Both equations.",
          ],
          ["Two parallel lines have", "no solution", ["one", "infinitely many"], "No crossing."],
        ],
        [
          [
            "Lines cross at (−1, 4). Solution",
            "$x = -1$, $y = 4$",
            ["$x = 4$, $y = -1$", "$x = -1$ only"],
            "Both.",
          ],
          [
            "Lines cross at (5, −2). Solution",
            "$x = 5$, $y = -2$",
            ["$x = -2$, $y = 5$", "$y = -2$ only"],
            "Both.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "inequalities",
    "GF-A22",
    "Solving inequalities",
    "Solve like an equation, then show the answer on a number line.",
    [
      problem(
        "The budget",
        [
          "You have £20. Bus fare is £3.50, and cinema tickets are £4 each. “How many tickets, $t$, can you afford? Show it on a number line.” That's $4t + 3.5 \\le 20$.",
          "By the end of this lesson, you can solve inequalities and show the answers.",
        ],
        {
          kind: "number-line",
          min: 0,
          max: 6,
          step: 1,
          every: 1,
        },
      ),
      typed("Warm-up", "Solve $4t + 3.5 = 20$", "4.125", "$4t = 16.5$.", "$t = 4.125$."),
      choose("Warm-up", "$x > 3$: is 3 included?", "No", "Greater than, not equal.", [
        ["Yes", "≥ would include it."],
      ]),
      explain(
        "Discover",
        "Like an equation, with one twist",
        [
          "Solve an inequality like an equation: do the same to both sides. The answer is a **range** of values.",
          "The twist: if you **multiply or divide by a negative**, flip the sign. On a number line: filled circle for ≤ or ≥, open for < or >.",
        ],
        { kind: "number-line", min: -1, max: 6, step: 1, interval: { from: 2, fromClosed: false } },
      ),
      choose("Discover", "Solve $3x - 1 > 5$", "$x > 2$", "$3x > 6$.", [
        ["$x > \\frac43$", "Add 1 first."],
        ["$x < 2$", "No negative: keep the sign."],
      ]),
      worked(
        "The budget",
        "Solve $4t + 3.5 \\le 20$.",
        [
          ["$4t \\le 16.5$", "Subtract 3.5."],
          ["$t \\le 4.125$", "Divide by 4."],
          ["So at most 4 tickets", "Whole tickets only."],
        ],
        "$t$ = 0, 1, 2, 3 or 4.",
      ),
      steps(
        "Together",
        "Solve $-2x < 8$",
        "Divide by a negative.",
        [
          [
            "Divide by −2 and",
            "flip the sign",
            ["keep the sign", "Dividing by a negative reverses it."],
            "$x > -4$",
          ],
          [
            "Check with $x = 0$: $0 < 8$ ✓. So",
            "$x > -4$",
            ["$x < -4$", "$x = -5$ gives $10 < 8$: false."],
            "$x > -4$",
          ],
        ],
        "Test a value to be sure.",
      ),
      steps(
        "Together",
        "Integers with $-3 < 2n + 1 \\le 7$",
        "A double inequality.",
        [
          [
            "Subtract 1, divide by 2:",
            "$-2 < n \\le 3$",
            ["$-1 < n \\le 4$", "Do it to all three parts."],
            "$-2 < n \\le 3$",
          ],
          [
            "Integers:",
            "−1, 0, 1, 2, 3",
            ["−2, −1, 0, 1, 2, 3", "−2 isn't included (<)."],
            "−1, 0, 1, 2, 3",
          ],
        ],
        "Five integers.",
      ),
      choose("Your turn", "Solve $5x + 2 \\ge 17$", "$x \\ge 3$", "$5x \\ge 15$.", [
        ["$x \\ge 3.8$", "Subtract 2 first."],
        ["$x \\le 3$", "No negative: keep ≥."],
      ]),
      choose(
        "Your turn",
        "Which number line shows $x \\le 2$?",
        "Filled circle at 2, arrow left",
        "≤: included, and less.",
        [
          ["Open circle at 2, arrow left", "≤ includes 2: filled."],
          ["Filled circle at 2, arrow right", "Less than: left."],
        ],
      ),
      choose(
        "Watch out",
        "Jo solves $-3x \\ge 12$ as $x \\ge -4$. What's wrong?",
        "Dividing by −3 flips it: $x \\le -4$",
        "Test $x = 0$: $0 \\ge 12$ is false.",
        [["Nothing", "Check with $x = 0$."]],
      ),
      mistake(
        "Ed lists integers with $1 \\le x < 4$.",
        ["$x$ is at least 1", "$x$ is less than 4", "So 1, 2, 3, 4"],
        2,
        "4 isn't less than 4: 1, 2, 3.",
      ),
      choose(
        "Back to the problem",
        "“£20, bus £3.50, tickets £4. Solve $4t + 3.5 \\le 20$. How many tickets?”",
        "At most 4",
        "$t \\le 4.125$.",
        [
          ["At most 5", "$5 \\times 4 + 3.5 = 23.5$."],
          ["Exactly 4.125", "Whole tickets, and a range."],
        ],
      ),
      quiz([
        [
          ["$2x + 1 < 9$", "$x < 4$", ["$x < 5$", "$x > 4$"], "$2x < 8$."],
          ["$3x - 2 \\ge 10$", "$x \\ge 4$", ["$x \\ge \\frac83$", "$x \\le 4$"], "$3x \\ge 12$."],
        ],
        [
          ["$-x > 3$", "$x < -3$", ["$x > -3$", "$x > 3$"], "Flip."],
          ["$-4x \\le 8$", "$x \\ge -2$", ["$x \\le -2$", "$x \\ge 2$"], "Flip."],
        ],
        [
          [
            "Integers: $-2 \\le n < 1$",
            "−2, −1, 0",
            ["−1, 0", "−2, −1, 0, 1"],
            "Include −2, not 1.",
          ],
          ["Integers: $0 < n \\le 3$", "1, 2, 3", ["0, 1, 2, 3", "1, 2"], "Not 0; include 3."],
        ],
      ]),
    ],
  ),
];
