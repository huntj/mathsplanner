// GCSE Foundation, "Sequences", as seven short lessons, one just before each skill: term-to-term
// and position-to-term rules; triangular, square and cube numbers; arithmetic and geometric
// sequences; Fibonacci-type and quadratic sequences; and the nth term of a linear sequence. Each
// recaps the Key Stage 3 idea quickly, builds it to GCSE level, names the common mistakes and
// ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-sequences";

export const gfSequences: UnitLesson[] = [
  lesson(U, "term-to-term", "GF-A23.a", "Term-to-term rules", "Each term from the one before.", [
    problem("The savings jar", [
      "Mia starts with £5 and adds £3 every week: 5, 8, 11, 14… Leo doubles a number and adds 1 each time, starting at 2. What comes next for each?",
      "By the end of this lesson, you can describe and continue sequences from a term-to-term rule.",
    ]),
    typed("Warm-up", "Next: 5, 8, 11, 14, …", "17", "Add 3.", "17."),
    typed("Warm-up", "Double 5, then add 1", "11", "$10 + 1$.", "11."),
    explain(
      "Discover",
      "From one term to the next",
      [
        "A **term-to-term rule** tells you how to get each term from the one before: “add 3”, “double and add 1”.",
        "You need a first term too. The same rule from a different start gives a different sequence.",
      ],
      {
        kind: "maths",
        tex: "2 \\xrightarrow{\\times 2 + 1} 5 \\xrightarrow{\\times 2 + 1} 11 \\xrightarrow{\\times 2 + 1} 23",
      },
    ),
    choose("Discover", "The rule for 40, 34, 28, 22, …", "subtract 6", "Down 6 each time.", [
      ["add 6", "It's going down."],
      ["divide by 6", "The gaps are equal: subtract."],
    ]),
    worked(
      "Leo's sequence",
      "First term 2; rule: double and add 1. Find the first four terms.",
      [
        ["2", "Start."],
        ["$2 \\times 2 + 1 = 5$, then $5 \\times 2 + 1 = 11$", "Apply the rule."],
        ["$11 \\times 2 + 1 = 23$", "Again."],
      ],
      "2, 5, 11, 23.",
    ),
    steps(
      "Together",
      "The term-to-term rule is “subtract 4”; the 3rd term is 10",
      "Find the 1st term.",
      [
        ["The 2nd term:", "14", ["6", "Go backwards: add 4."], "14"],
        ["The 1st term:", "18", ["10", "Add 4 again."], "18"],
      ],
      "18, 14, 10, 6, …",
    ),
    choose("Together", "The rule for 3, 6, 12, 24, …", "multiply by 2", "Each term doubles.", [
      ["add 3", "6 + 3 = 9, not 12."],
      ["add 6", "The gaps grow."],
    ]),
    typed("Your turn", "First term 4, rule “× 3 − 2”. The 3rd term?", "28", "4, 10, 28.", "28.", {
      wrong: [["10", "That's the 2nd term."]],
    }),
    typed("Your turn", "Next: 1.5, 2.25, 3, 3.75, …", "4.5", "Add 0.75.", "4.5."),
    choose(
      "Watch out",
      "Sam says the rule for 2, 4, 8, 16 is “add 2”. What's wrong?",
      "The gaps grow: it's × 2",
      "Check every step, not just the first.",
      [["Nothing", "4 + 2 = 6, not 8."]],
    ),
    mistake(
      "Kim continues 50, 45, 40, 35, …",
      ["The rule is subtract 5", "Next: 30, 25", "Then 20, 15, 10, 5, 0, 5"],
      2,
      "Keep subtracting: 0, then −5.",
    ),
    typed(
      "Back to the problem",
      "“Mia has £5 and adds £3 a week. How much after 6 weeks?”",
      "23",
      "5, 8, 11, 14, 17, 20, 23.",
      "£23.",
      { wrong: [["20", "6 weeks of adding: 6 steps after £5."]] },
    ),
    quiz([
      [
        ["Next: 7, 11, 15, 19", "23", ["22", "27"], "Add 4."],
        ["Next: 30, 24, 18, 12", "6", ["0", "10"], "Subtract 6."],
      ],
      [
        ["Rule for 5, 15, 45, 135", "× 3", ["+ 10", "+ 30"], "Each × 3."],
        ["Rule for 64, 32, 16, 8", "÷ 2", ["− 32", "− 8"], "Halve."],
      ],
      [
        ["First 3, rule × 2 + 1. 3rd term", "15", ["7", "31"], "3, 7, 15."],
        ["First 1, rule × 3 + 1. 3rd term", "13", ["4", "40"], "1, 4, 13."],
      ],
    ]),
  ]),

  lesson(
    U,
    "position-to-term",
    "GF-A23.b",
    "Position-to-term rules",
    "The nth term gives any term from its position.",
    [
      problem("The 100th term", [
        "“The nth term of a sequence is $4n - 1$. Work out the 100th term.” And “Is 50 a term in the sequence?”",
        "Counting on to the 100th term would take ages. By the end of this lesson, you can jump straight there.",
      ]),
      typed("Warm-up", "Work out $4 \\times 100 - 1$", "399", "$400 - 1$.", "399."),
      typed("Warm-up", "Solve $4n - 1 = 51$", "13", "Add 1, divide by 4.", "$n = 13$."),
      explain(
        "Discover",
        "Substitute the position",
        [
          "A **position-to-term** rule, or **nth term**, gives a term from its position $n$: 1st, 2nd, 3rd…",
          "For $4n - 1$: $n = 1$ gives 3, $n = 2$ gives 7, $n = 3$ gives 11.",
        ],
        {
          kind: "table",
          head: ["$n$", "1", "2", "3", "4"],
          rows: [["$4n - 1$", "3", "7", "11", "15"]],
        },
      ),
      choose("Discover", "The 5th term of $3n + 2$", "17", "$3 \\times 5 + 2$.", [
        ["32", "Substitute 5 for $n$: $15 + 2$."],
        ["5", "Work out $3n + 2$."],
      ]),
      worked(
        "The 100th term",
        "nth term $4n - 1$. Find the 100th term.",
        [
          ["$n = 100$", "Position."],
          ["$4 \\times 100 - 1 = 399$", "Substitute."],
        ],
        "No need to list 99 terms.",
      ),
      steps(
        "Together",
        "Is 50 a term of $4n - 1$?",
        "Solve for $n$.",
        [
          ["$4n - 1 = 50$, so $4n =$", "51", ["49", "Add 1."], "$n = 12.75$"],
          [
            "12.75 isn't a whole number, so",
            "50 isn't a term",
            ["it's the 12th term", "Positions are whole numbers."],
            "No",
          ],
        ],
        "The terms are 3, 7, …, 47, 51: 50 is skipped.",
      ),
      choose(
        "Together",
        "First three terms of $10 - 2n$",
        "8, 6, 4",
        "$10 - 2$, $10 - 4$, $10 - 6$.",
        [
          ["10, 8, 6", "$n$ starts at 1."],
          ["−2, −4, −6", "It's $10 - 2n$."],
        ],
      ),
      typed(
        "Your turn",
        "nth term $5n + 3$. The 20th term?",
        "103",
        "$5 \\times 20 + 3$.",
        "103.",
        { wrong: [["523", "$5 \\times 20 = 100$, not 520."]] },
      ),
      choose(
        "Your turn",
        "Is 85 a term of $6n + 1$?",
        "No: $6n = 84$ gives $n = 14$… so yes, it's the 14th",
        "Check: $6 \\times 14 + 1 = 85$.",
        [["No", "$6n = 84$, $n = 14$: it's a term."]],
      ),
      choose(
        "Watch out",
        "For $3n + 4$, Ivy says the 2nd term is 34. What's wrong?",
        "$3n$ means $3 \\times n$: $6 + 4 = 10$",
        "Don't put the digits side by side.",
        [["Nothing", "$3 \\times 2 = 6$."]],
      ),
      mistake(
        "Ali finds the 10th term of $2n^2$.",
        ["$n = 10$", "$2n = 20$", "$20^2 = 400$"],
        1,
        "Only $n$ is squared: $2 \\times 10^2 = 200$.",
      ),
      choose(
        "Back to the problem",
        "“nth term $4n - 1$. Work out the 100th term.”",
        "399",
        "$400 - 1$.",
        [
          ["401", "Subtract 1."],
          ["4099", "$4 \\times 100$, not 4 and 100 side by side."],
        ],
      ),
      quiz([
        [
          ["$2n + 5$: 10th term", "25", ["205", "17"], "$20 + 5$."],
          ["$3n - 1$: 10th term", "29", ["299", "30"], "$30 - 1$."],
        ],
        [
          ["$7n - 2$: first term", "5", ["−2", "7"], "$7 - 2$."],
          ["$4n + 6$: first term", "10", ["6", "4"], "$4 + 6$."],
        ],
        [
          ["Is 40 a term of $3n + 1$?", "Yes, the 13th", ["No", "Yes, the 40th"], "$3n = 39$."],
          [
            "Is 60 a term of $4n + 2$?",
            "No",
            ["Yes, the 15th", "Yes, the 14th"],
            "$4n = 58$, not whole.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "special-numbers",
    "GF-A24.a",
    "Square, cube and triangular numbers",
    "Recognise the special number patterns.",
    [
      problem(
        "Patterns of dots",
        [
          "Dots arranged in triangles: 1, 3, 6, 10… in squares: 1, 4, 9, 16… “Which of 36, 45, 64 are square, triangular or cube numbers?”",
          "By the end of this lesson, you'll recognise them, and some numbers that are two at once.",
        ],
        { kind: "dots", shape: "triangle", terms: 5 },
      ),
      typed("Warm-up", "Work out $6^2$", "36", "$6 \\times 6$.", "36."),
      typed("Warm-up", "Work out $4^3$", "64", "$4 \\times 4 \\times 4$.", "64."),
      explain(
        "Discover",
        "Three families",
        [
          "**Square numbers**: 1, 4, 9, 16, 25, 36… ($n^2$). **Cube numbers**: 1, 8, 27, 64, 125… ($n^3$).",
          "**Triangular numbers**: 1, 3, 6, 10, 15, 21, 28, 36, 45… Each adds one more than the last added: +2, +3, +4…",
        ],
        { kind: "dots", shape: "square", terms: 5 },
      ),
      choose("Discover", "The 6th triangular number", "21", "15 + 6.", [
        ["18", "Add 6 to 15."],
        ["36", "That's the 6th square."],
      ]),
      worked(
        "Sort them",
        "Which of 36, 45, 64 are square, triangular or cube?",
        [
          ["36 = $6^2$ and is triangular (1 + 2 + … + 8)", "Two at once."],
          ["45 = 1 + 2 + … + 9: triangular", "Not square."],
          ["64 = $8^2 = 4^3$: square and cube", "Two at once."],
        ],
        "Some numbers belong to two families.",
      ),
      steps(
        "Together",
        "Continue the triangular numbers from 28",
        "28, …",
        [
          ["The last step added 7, so next add", "8", ["7", "The steps grow by 1."], "36"],
          ["Then", "45", ["44", "Add 9."], "28, 36, 45"],
        ],
        "Triangular numbers grow by 1 more each time.",
      ),
      choose("Together", "Which is a cube number?", "125", "$5^3$.", [
        ["100", "$10^2$: square."],
        ["150", "Not a cube."],
      ]),
      choose("Your turn", "Which is square and cube?", "1", "$1^2 = 1^3 = 1$.", [
        ["16", "16 isn't a cube."],
        ["27", "27 isn't square."],
      ]),
      choose("Your turn", "The 8th square number", "64", "$8^2$.", [
        ["16", "That's $8 \\times 2$."],
        ["36", "That's the 8th triangular."],
      ]),
      choose(
        "Watch out",
        "Raj says 10 is a square number because it's in the 10 times table. Is he right?",
        "No: square numbers are $n \\times n$; 10 isn't",
        "1, 4, 9, 16…",
        [["Yes", "$3^2 = 9$ and $4^2 = 16$: 10 is between."]],
      ),
      mistake(
        "Zoe lists cube numbers.",
        ["$1^3 = 1$", "$2^3 = 6$", "$3^3 = 27$"],
        1,
        "$2^3 = 2 \\times 2 \\times 2 = 8$.",
      ),
      choose(
        "Back to the problem",
        "“Write down a number that is both square and triangular.”",
        "36",
        "$6^2$, and 1 + … + 8.",
        [
          ["45", "45 isn't square."],
          ["64", "64 isn't triangular."],
        ],
      ),
      quiz([
        [
          ["Next triangular after 15", "21", ["20", "16"], "+6."],
          ["Next triangular after 21", "28", ["27", "25"], "+7."],
        ],
        [
          ["Which is square?", "81", ["80", "18"], "$9^2$."],
          ["Which is square?", "144", ["140", "44"], "$12^2$."],
        ],
        [
          ["Which is a cube?", "1000", ["100", "300"], "$10^3$."],
          ["Which is a cube?", "216", ["200", "36"], "$6^3$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "arithmetic-geometric",
    "GF-A24.b",
    "Arithmetic and geometric sequences",
    "Arithmetic adds the same amount; geometric multiplies by the same amount.",
    [
      problem("Two investments", [
        "Ali's savings go 100, 110, 120, 130… Bea's go 100, 110, 121, 133.1… Which kind of sequence is each? Whose grows faster in the long run?",
        "By the end of this lesson, you can tell arithmetic from geometric and continue each.",
      ]),
      typed("Warm-up", "Next: 100, 110, 120, …", "130", "Add 10.", "130."),
      typed("Warm-up", "Work out $121 \\times 1.1$", "133.1", "$121 + 12.1$.", "133.1."),
      explain(
        "Discover",
        "Add or multiply",
        [
          "An **arithmetic** sequence adds the same **common difference**: 4, 7, 10, 13 (+3).",
          "A **geometric** sequence multiplies by the same **common ratio**: 3, 6, 12, 24 (×2). Find it by dividing a term by the one before.",
        ],
        {
          kind: "table",
          head: ["Sequence", "Type", "Rule"],
          rows: [
            ["4, 7, 10, 13", "arithmetic", "+3"],
            ["3, 6, 12, 24", "geometric", "×2"],
          ],
        },
      ),
      choose("Discover", "2, 10, 50, 250 is", "geometric, ratio 5", "$10 \\div 2 = 5$.", [
        ["arithmetic, difference 8", "The gaps grow."],
        ["neither", "Each term × 5."],
      ]),
      worked(
        "The investments",
        "Ali: 100, 110, 120… Bea: 100, 110, 121…",
        [
          ["Ali: +10 each time: arithmetic", "Common difference 10."],
          ["Bea: $110 \\div 100 = 1.1$, $121 \\div 110 = 1.1$: geometric", "Common ratio 1.1."],
        ],
        "Geometric growth overtakes arithmetic in the long run.",
      ),
      steps(
        "Together",
        "Continue the geometric sequence 81, 27, 9, …",
        "Find the ratio.",
        [
          ["$27 \\div 81 =$", "$\\frac13$", ["−54", "Divide, don't subtract."], "× $\\frac13$"],
          ["Next two terms:", "3, 1", ["0, −9", "Multiply by $\\frac13$."], "3, 1"],
        ],
        "Geometric sequences can shrink too.",
      ),
      choose("Together", "Which is arithmetic?", "5, 3, 1, −1", "−2 each time.", [
        ["1, 2, 4, 8", "That's geometric."],
        ["1, 4, 9, 16", "Square numbers."],
      ]),
      typed("Your turn", "Next term: 2, 6, 18, 54, …", "162", "× 3.", "162.", {
        wrong: [["90", "It's × 3, not + 36."]],
      }),
      choose("Your turn", "Common ratio of 5, 10, 20, 40", "2", "$10 \\div 5$.", [
        ["5", "That's the first term."],
        ["+5", "Divide, don't subtract."],
      ]),
      choose(
        "Watch out",
        "Ben says 1, 4, 9, 16 is geometric. Is it?",
        "No: the ratios differ (4, 2.25…): it's square numbers",
        "Geometric needs the same ratio every time.",
        [["Yes", "$4 \\div 1 = 4$ but $9 \\div 4 = 2.25$."]],
      ),
      mistake(
        "Mo continues 3, 12, 48, …",
        ["The rule is +9", "Next: 57", "Then 66"],
        0,
        "$12 - 3 = 9$ but $48 - 12 = 36$. It's × 4: next 192.",
      ),
      choose(
        "Back to the problem",
        "“Bea's savings: 100, 110, 121, 133.1. What type of sequence? Give the next term.”",
        "Geometric; 146.41",
        "× 1.1.",
        [
          ["Arithmetic; 143.1", "The gaps grow."],
          ["Geometric; 144.1", "$133.1 \\times 1.1 = 146.41$."],
        ],
      ),
      quiz([
        [
          ["Type: 7, 12, 17, 22", "arithmetic", ["geometric", "neither"], "+5."],
          ["Type: 4, 12, 36, 108", "geometric", ["arithmetic", "neither"], "×3."],
        ],
        [
          ["Next: 1, 5, 25, …", "125", ["29", "45"], "×5."],
          ["Next: 1000, 100, 10, …", "1", ["−80", "0"], "÷10."],
        ],
        [
          ["Common difference of 20, 17, 14", "−3", ["3", "$\\frac{17}{20}$"], "Down 3."],
          ["Common ratio of 64, 32, 16", "$\\frac12$", ["−32", "2"], "Halve."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "fibonacci",
    "GF-A24.c",
    "Fibonacci-type sequences",
    "Each term is the sum of the two before.",
    [
      problem("Rabbits and petals", [
        "1, 1, 2, 3, 5, 8, 13… appears in petals and pine cones. The exam asks: “The first two terms of a Fibonacci-type sequence are $a$ and $b$. Find the 4th term.”",
        "By the end of this lesson, you can continue them, and work with letters.",
      ]),
      typed("Warm-up", "Next: 1, 1, 2, 3, 5, 8, …", "13", "Add the two before.", "13."),
      typed("Warm-up", "Work out $8 + 13$", "21", "Add.", "21."),
      explain(
        "Discover",
        "Add the last two",
        [
          "In a **Fibonacci-type** sequence, each term is the **sum of the two terms before it**. You need two starting terms.",
          "Starting 3, 4: 3, 4, 7, 11, 18, 29…",
        ],
        { kind: "maths", tex: "3,\\ 4,\\ 7,\\ 11,\\ 18,\\ 29" },
      ),
      choose("Discover", "Next: 2, 5, 7, 12, 19, …", "31", "12 + 19.", [
        ["26", "Add the last two."],
        ["24", "12 + 19 = 31."],
      ]),
      worked(
        "With letters",
        "Terms $a$, $b$, … Find the 3rd and 4th terms.",
        [
          ["3rd: $a + b$", "Add the first two."],
          ["4th: $b + (a + b) = a + 2b$", "Add the 2nd and 3rd."],
        ],
        "5th: $(a + b) + (a + 2b) = 2a + 3b$.",
      ),
      steps(
        "Together",
        "A Fibonacci-type sequence: 4, ?, ?, 16",
        "Find the 2nd term $x$.",
        [
          ["3rd term:", "$4 + x$", ["$2x$", "Add the two before."], "4, $x$, $4 + x$"],
          [
            "4th: $x + (4 + x) = 16$, so",
            "$x = 6$",
            ["$x = 12$", "$2x + 4 = 16$."],
            "4, 6, 10, 16",
          ],
        ],
        "Check: 6 + 10 = 16 ✓",
      ),
      choose(
        "Together",
        "Is 1, 3, 4, 7, 11 Fibonacci-type?",
        "Yes: each is the sum of the two before",
        "1 + 3 = 4, 3 + 4 = 7, 4 + 7 = 11.",
        [["No", "Check each sum."]],
      ),
      typed("Your turn", "Next: 10, 10, 20, 30, 50, …", "80", "30 + 50.", "80."),
      choose("Your turn", "Terms: $x$, $2x$, … The 4th term", "$5x$", "$x, 2x, 3x, 5x$.", [
        ["$4x$", "Add the 2nd and 3rd: $2x + 3x$."],
        ["$6x$", "$2x + 3x = 5x$."],
      ]),
      choose(
        "Watch out",
        "Jo continues 2, 3, 5, … by adding 2 each time. What's wrong?",
        "Add the two before: 2, 3, 5, 8, 13",
        "It's Fibonacci-type, not arithmetic.",
        [["Nothing", "3 + 5 = 8, not 7."]],
      ),
      mistake(
        "Ed finds the 5th term of 1, 4, 5, 9, …",
        ["4th term is 9", "5th term: 9 + 4", "= 13"],
        1,
        "Add the two before: $5 + 9 = 14$.",
      ),
      choose(
        "Back to the problem",
        "“First two terms $a$ and $b$. Find the 4th term.”",
        "$a + 2b$",
        "$b + (a + b)$.",
        [
          ["$2a + b$", "Check: the 4th is 2nd + 3rd."],
          ["$a + b$", "That's the 3rd."],
        ],
      ),
      quiz([
        [
          ["Next: 3, 3, 6, 9, 15, …", "24", ["21", "18"], "9 + 15."],
          ["Next: 2, 4, 6, 10, 16, …", "26", ["22", "32"], "10 + 16."],
        ],
        [
          ["Terms $a$, $b$. The 3rd", "$a + b$", ["$2b$", "$ab$"], "Add."],
          ["Terms $p$, $q$. The 4th", "$p + 2q$", ["$2p + q$", "$p + q$"], "2nd + 3rd."],
        ],
        [
          ["5, $x$, ?, 21. $x$?", "8", ["16", "11"], "$5 + 2x = 21$."],
          ["2, $x$, ?, 14. $x$?", "6", ["12", "8"], "$2 + 2x = 14$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "quadratic-sequences",
    "GF-A24.d",
    "Quadratic sequences",
    "The differences change, but the second differences are constant.",
    [
      problem("Growing squares", [
        "Square patios use tiles: 4, 9, 16, 25… “Is this sequence linear or quadratic? Explain how you know.”",
        "By the end of this lesson, you can spot a quadratic sequence and continue it.",
      ]),
      typed("Warm-up", "$9 - 4$", "5", "Subtract.", "5."),
      typed("Warm-up", "$16 - 9$", "7", "Subtract.", "7."),
      explain(
        "Discover",
        "Differences of differences",
        [
          "Find the **first differences** between terms. If they're equal, it's linear. If not, find the differences of those: the **second differences**.",
          "If the second differences are constant, the sequence is **quadratic**: its nth term has $n^2$ in it.",
        ],
        {
          kind: "table",
          head: ["Term", "4", "9", "16", "25"],
          rows: [
            ["1st diff", "", "5", "7", "9"],
            ["2nd diff", "", "", "2", "2"],
          ],
        },
      ),
      choose(
        "Discover",
        "4, 9, 16, 25: second differences",
        "2, 2: constant",
        "Differences 5, 7, 9.",
        [
          ["5, 7, 9", "Those are the first differences."],
          ["not constant", "7 − 5 = 9 − 7 = 2."],
        ],
      ),
      worked(
        "Continue it",
        "Find the next term of 4, 9, 16, 25.",
        [
          ["First differences: 5, 7, 9; next 11", "They grow by 2."],
          ["Next term: 25 + 11 = 36", "Add the next difference."],
        ],
        "They're $(n + 1)^2$.",
      ),
      steps(
        "Together",
        "2, 5, 10, 17, …",
        "Next term.",
        [
          [
            "First differences:",
            "3, 5, 7",
            ["3, 3, 3", "Subtract each pair."],
            "Next difference 9",
          ],
          ["Next term:", "26", ["24", "17 + 9."], "26"],
        ],
        "It's $n^2 + 1$.",
      ),
      choose(
        "Together",
        "Linear or quadratic: 3, 7, 11, 15",
        "linear",
        "First differences all 4.",
        [["quadratic", "Equal first differences: linear."]],
      ),
      typed(
        "Your turn",
        "Next: 1, 3, 7, 13, 21, …",
        "31",
        "Differences 2, 4, 6, 8; next 10.",
        "31.",
        { wrong: [["29", "Next difference is 10."]] },
      ),
      choose(
        "Your turn",
        "Which is quadratic?",
        "0, 3, 8, 15",
        "Differences 3, 5, 7; second 2, 2.",
        [
          ["2, 6, 18, 54", "That's geometric."],
          ["5, 9, 13, 17", "That's linear."],
        ],
      ),
      choose(
        "Watch out",
        "Mia says 1, 2, 4, 8 is quadratic because the differences change. Is she right?",
        "No: differences 1, 2, 4 aren't constant at the second step either; it's geometric",
        "Quadratic needs constant second differences.",
        [["Yes", "Check the second differences: 1, 2."]],
      ),
      mistake(
        "Kai continues 6, 9, 14, 21, …",
        ["Differences 3, 5, 7", "Next difference 7", "Next term 28"],
        1,
        "Differences grow by 2: next is 9, so 30.",
      ),
      choose(
        "Back to the problem",
        "“Tiles: 4, 9, 16, 25. Linear or quadratic? Explain.”",
        "Quadratic: the second differences are constant (2)",
        "First differences 5, 7, 9.",
        [
          ["Linear: it goes up each time", "Linear needs equal first differences."],
          ["Geometric: it multiplies", "The ratios aren't equal."],
        ],
      ),
      quiz([
        [
          ["Next: 1, 4, 9, 16, …", "25", ["23", "20"], "+9."],
          ["Next: 3, 6, 11, 18, …", "27", ["25", "24"], "+9."],
        ],
        [
          ["Second differences of 2, 8, 18, 32", "6", ["4", "10"], "6, 10, 14: then 4…"],
          ["Second differences of 1, 6, 15, 28", "4", ["5", "9"], "5, 9, 13."],
        ],
        [
          ["Linear or quadratic: 10, 20, 30", "linear", ["quadratic", "neither"], "Equal steps."],
          ["Linear or quadratic: 2, 9, 20, 35", "quadratic", ["linear", "geometric"], "7, 11, 15."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "nth-term",
    "GF-A25",
    "The nth term of a linear sequence",
    "The difference times n, adjusted to fit the first term.",
    [
      problem("Find the rule", [
        "“Here are the first terms of a sequence: 5, 8, 11, 14. Find an expression for the nth term.” Then: “Is 100 in the sequence?”",
        "By the end of this lesson, you can find any linear nth term and use it.",
      ]),
      typed("Warm-up", "Difference in 5, 8, 11, 14", "3", "Up 3.", "3."),
      typed("Warm-up", "$3 \\times 1$, then what do you add to get 5?", "2", "$5 - 3$.", "2."),
      explain(
        "Discover",
        "Compare with the times table",
        [
          "Going up 3 each time is like the 3 times table: 3, 6, 9, 12. The sequence is 2 more: so the nth term is $3n + 2$.",
          "The **difference** is the number in front of $n$; then adjust with a number to match.",
        ],
        {
          kind: "table",
          head: ["$n$", "1", "2", "3", "4"],
          rows: [
            ["$3n$", "3", "6", "9", "12"],
            ["term", "5", "8", "11", "14"],
          ],
        },
      ),
      {
        kind: "machine",
        tag: "Discover",
        title: "Find the rule",
        rule: { m: 4, c: -1 },
        inputs: [1, 2, 3, 4, 5],
        shown: 2,
        decoys: { 3: [12, 10], 4: [16, 13], 5: [20, 16] },
        ports: ["n", "term"],
        done: "Up 4 each time, so $4n$; one less: $4n - 1$.",
      },
      worked(
        "Find the rule",
        "Find the nth term of 5, 8, 11, 14.",
        [
          ["Difference 3: $3n$", "The times table."],
          ["$3n$: 3, 6, 9… the terms are 2 more", "Adjust."],
          ["nth term $= 3n + 2$", "Check: $3(4) + 2 = 14$ ✓"],
        ],
        "Difference, times table, adjust, check.",
      ),
      steps(
        "Together",
        "Is 100 in 5, 8, 11, 14, …?",
        "nth term $3n + 2$.",
        [
          ["$3n + 2 = 100$, so $n =$", "32.67", ["32", "$98 \\div 3$."], "Not whole"],
          ["So", "100 isn't a term", ["it's the 32nd", "$n$ must be a whole number."], "No"],
        ],
        "Terms: …, 98, 101.",
      ),
      steps(
        "Together",
        "A decreasing sequence: 20, 17, 14, 11",
        "nth term.",
        [
          ["Difference:", "−3", ["3", "It goes down."], "$-3n$"],
          [
            "$-3n$ gives −3, −6, …; the terms are 23 more, so",
            "$23 - 3n$",
            ["$-3n + 20$", "$-3 + 23 = 20$ ✓."],
            "$23 - 3n$",
          ],
        ],
        "Check: $23 - 12 = 11$ ✓",
      ),
      typed(
        "Your turn",
        "nth term of 7, 12, 17, 22",
        ["5n+2", "2+5n"],
        "Difference 5.",
        "$5n + 2$.",
        { wrong: [["7n+5", "The difference goes in front of $n$."]] },
      ),
      typed(
        "Your turn",
        "nth term of 1, 7, 13, 19",
        ["6n-5", "-5+6n"],
        "Difference 6; $6n$ gives 6.",
        "$6n - 5$.",
        { wrong: [["6n+1", "$6 + 1 = 7$, but the first term is 1."]] },
      ),
      choose(
        "Watch out",
        "Lily says the nth term of 5, 9, 13 is $n + 4$, because it goes up 4. Is she right?",
        "No: up 4 means $4n$, so $4n + 1$",
        "$n + 4$ goes up 1 each time.",
        [["Yes", "Try $n = 2$: $2 + 4 = 6$, not 9."]],
      ),
      mistake(
        "Raf finds the nth term of 6, 8, 10, 12.",
        ["Difference 2", "$2n$: 2, 4, 6, 8", "Each term is 4 more, so $4n + 2$"],
        2,
        "The difference goes with $n$: $2n + 4$.",
      ),
      choose(
        "Back to the problem",
        "“5, 8, 11, 14. Find an expression for the nth term.”",
        "$3n + 2$",
        "Difference 3, adjusted by 2.",
        [
          ["$n + 3$", "Up 3 means $3n$."],
          ["$5n + 3$", "The difference is 3."],
        ],
      ),
      quiz([
        [
          ["nth term: 4, 7, 10, 13", "$3n + 1$", ["$4n + 3$", "$n + 3$"], "Up 3."],
          ["nth term: 9, 13, 17, 21", "$4n + 5$", ["$9n + 4$", "$n + 4$"], "Up 4."],
        ],
        [
          ["nth term: 3, 8, 13, 18", "$5n - 2$", ["$5n + 3$", "$3n + 5$"], "$5n$ gives 5."],
          ["nth term: 1, 3, 5, 7", "$2n - 1$", ["$2n + 1$", "$n + 2$"], "$2n$ gives 2."],
        ],
        [
          ["nth term: 30, 26, 22, 18", "$34 - 4n$", ["$30 - 4n$", "$4n + 26$"], "Down 4."],
          ["nth term: 15, 13, 11, 9", "$17 - 2n$", ["$15 - 2n$", "$2n + 13$"], "Down 2."],
        ],
      ]),
    ],
  ),
];
