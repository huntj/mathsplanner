// GCSE Higher, "Sequences and growth", as three short lessons, one just before each skill:
// geometric sequences (including surd ratios) and other sequences, the nth term of a quadratic
// sequence, and general iterative processes. Each recaps the Foundation idea quickly, builds it
// to Higher level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, UnitLesson } from "./types.ts";

const U = "gh-sequences";

const differences: Picture = {
  kind: "table",
  head: ["n", "1", "2", "3", "4", "5"],
  rows: [
    ["Term", "4", "11", "22", "37", "56"],
    ["1st difference", "", "7", "11", "15", "19"],
    ["2nd difference", "", "", "4", "4", "4"],
  ],
};
const savings: Picture = {
  kind: "table",
  head: ["Year", "0", "1", "2", "3"],
  rows: [["Balance (£)", "2000", "1960", "1918.80", "?"]],
};

export const ghSequences: UnitLesson[] = [
  lesson(
    U,
    "geometric",
    "GH-A24",
    "Geometric and other sequences",
    "Multiply by the same ratio each time, even when it's a surd.",
    [
      problem("A surd ratio", [
        "“The sequence $\\sqrt2,\\ 2,\\ 2\\sqrt2,\\ 4, \\ldots$ is geometric. Find the next two terms, and the 10th term.”",
        "By the end of this lesson, you can handle any geometric sequence and spot other kinds too.",
      ]),
      typed("Warm-up", "Next term of 3, 6, 12, 24", "48", "× 2.", "48."),
      typed("Warm-up", "$\\sqrt2 \\times \\sqrt2$", "2", "Itself.", "2."),
      explain("Discover", "The common ratio", [
        "A **geometric** sequence multiplies by the same **ratio** $r$ each time. Find $r$ by dividing a term by the one before. The $n$th term is $ar^{n-1}$.",
        "Other kinds: **Fibonacci-type** (add the two before), **triangular** (1, 3, 6, 10…), and **quadratic** sequences, next lesson.",
      ]),
      choose("Discover", "The ratio of $\\sqrt2, 2, 2\\sqrt2$", "$\\sqrt2$", "$2 \\div \\sqrt2$.", [
        ["2", "$\\sqrt2 \\times 2 = 2\\sqrt2$, not 2."],
        ["$\\frac{\\sqrt2}{2}$", "That's the other way."],
      ]),
      worked(
        "Next terms",
        "$\\sqrt2, 2, 2\\sqrt2, 4, \\ldots$",
        [
          ["$4\\sqrt2$, then 8", "× $\\sqrt2$ each time."],
          ["10th term: $\\sqrt2 \\times (\\sqrt2)^9 = (\\sqrt2)^{10} = 32$", "$ar^{n-1}$."],
        ],
        "Even powers of $\\sqrt2$ are whole numbers.",
      ),
      steps(
        "Together",
        "Is 1, 1, 2, 3, 5, 8 geometric?",
        "Check the ratio.",
        [
          [
            "$1 \\div 1$ and $2 \\div 1$:",
            "1 and 2: not the same",
            ["the same", "Different ratios."],
            "Not geometric",
          ],
          [
            "Each term is",
            "the sum of the two before",
            ["double the one before", "$3 + 5 = 8$."],
            "Fibonacci",
          ],
        ],
        "Next: 13.",
      ),
      choose("Together", "Next term of 81, 27, 9, 3", "1", "× ⅓.", [
        ["0", "Divide by 3."],
        ["−6", "It's geometric, not linear."],
      ]),
      typed("Your turn", "Next term of 2, −6, 18, −54", "162", "× −3.", "162."),
      choose("Your turn", "Next term of $3, 3\\sqrt3, 9$", "$9\\sqrt3$", "× $\\sqrt3$.", [
        ["27", "That's two steps."],
        ["$12$", "Multiply, don't add."],
      ]),
      choose(
        "Watch out",
        "Ivy finds the ratio of 2, 6, 18 by subtracting: 4. What's wrong?",
        "Divide to find a ratio: 3",
        "Geometric multiplies.",
        [["Nothing", "Subtracting gives a difference."]],
      ),
      mistake(
        "Ben finds the 5th term of $a = 5$, $r = 2$.",
        ["$ar^{n-1}$", "$5 \\times 2^5$", "$= 160$"],
        1,
        "Power $n - 1 = 4$: $5 \\times 2^4 = 80$.",
      ),
      choose(
        "Back to the problem",
        "“Find the next two terms.”",
        "$4\\sqrt2$ and 8",
        "× $\\sqrt2$.",
        [
          ["$4\\sqrt2$ and $8\\sqrt2$", "$4\\sqrt2 \\times \\sqrt2 = 8$."],
          ["6 and 8", "It's geometric."],
        ],
      ),
      quiz([
        [
          ["Ratio of 5, 15, 45", "3", ["10", "30"], "÷."],
          ["Ratio of 64, 16, 4", "$\\frac14$", ["−48", "4"], "÷."],
        ],
        [
          [
            "$n$th term of a geometric sequence",
            "$ar^{n-1}$",
            ["$a + (n-1)r$", "$ar^n$"],
            "Formula.",
          ],
          ["$a = 3$, $r = 2$: 4th term", "24", ["48", "12"], "$3 \\times 2^3$."],
        ],
        [
          ["Next in 2, 3, 5, 8, 13", "21", ["18", "26"], "8 + 13."],
          ["Next in 1, 3, 6, 10", "15", ["14", "20"], "+5."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "quadratic-nth",
    "GH-A25",
    "The nth term of a quadratic sequence",
    "Halve the second difference for the n², then find the linear part.",
    [
      problem(
        "Find the rule",
        [
          "“Find the $n$th term of 4, 11, 22, 37, 56.” The differences aren't constant, so it isn't linear.",
          "By the end of this lesson, you can find it.",
        ],
        differences,
      ),
      typed("Warm-up", "The $n$th term of 3, 7, 11, 15", "4n-1", "+4 each time.", "$4n - 1$."),
      typed("Warm-up", "$2n^2$ when $n = 3$", "18", "$2 \\times 9$.", "18."),
      explain(
        "Discover",
        "Second differences",
        [
          "If the **second** differences are constant, the sequence is quadratic: $an^2 + bn + c$. The $n^2$ coefficient $a$ is **half the second difference**.",
          "Subtract $an^2$ from each term. What's left is linear: find its $n$th term, $bn + c$.",
        ],
        differences,
      ),
      choose(
        "Discover",
        "Second difference 4, so the $n^2$ term is",
        "$2n^2$",
        "Half of 4.",
        [
          ["$4n^2$", "Halve it."],
          ["$n^2$", "Half of 4 is 2."],
        ],
        { picture: differences },
      ),
      worked(
        "The problem",
        "4, 11, 22, 37, 56",
        [
          ["$2n^2$: 2, 8, 18, 32, 50", "Half the second difference."],
          ["Term − $2n^2$: 2, 3, 4, 5, 6, which is $n + 1$", "Linear left over."],
          ["$n$th term $= 2n^2 + n + 1$", "Combine."],
        ],
        "Check $n = 3$: $18 + 3 + 1 = 22$ ✓",
        differences,
      ),
      steps(
        "Together",
        "Find the $n$th term of 2, 7, 14, 23, 34",
        "Second differences first.",
        [
          ["Second difference:", "2, so $n^2$", ["4", "Differences 5, 7, 9, 11."], "$n^2$"],
          [
            "Term − $n^2$: 1, 3, 5, 7, 9 →",
            "$2n - 1$",
            ["$2n + 1$", "First is 1."],
            "$n^2 + 2n - 1$",
          ],
        ],
        "Check: $n = 2$: $4 + 4 - 1 = 7$ ✓",
      ),
      choose(
        "Together",
        "The sequence 3, 6, 11, 18, 27 has $n$th term",
        "$n^2 + 2$",
        "Second difference 2; left over 2.",
        [
          ["$n^2 + 3$", "Check $n = 1$."],
          ["$2n^2 + 1$", "Halve the second difference."],
        ],
      ),
      typed(
        "Your turn",
        "The $n^2$ coefficient of 5, 12, 23, 38",
        "2",
        "Second difference 4.",
        "2.",
      ),
      choose("Your turn", "So its $n$th term", "$2n^2 + n + 2$", "Left over 3, 4, 5, 6.", [
        ["$2n^2 + 3$", "Left over isn't constant."],
        ["$4n^2 + 1$", "Halve the 4."],
      ]),
      choose(
        "Watch out",
        "Kim uses the whole second difference as the $n^2$ coefficient. What's wrong?",
        "Halve it: $an^2$ has second difference $2a$",
        "Half.",
        [["Nothing", "$n^2$: 1, 4, 9 has second difference 2."]],
      ),
      mistake(
        "Leo finds the $n$th term of 3, 9, 19, 33.",
        ["Second difference 4: $2n^2$", "Term − $2n^2$: 1, 1, 1, 1", "So $2n^2 - 1$"],
        2,
        "The left over is +1: $2n^2 + 1$.",
      ),
      typed(
        "Back to the problem",
        "“Find the $n$th term.” The 6th term?",
        "79",
        "$2(36) + 6 + 1$.",
        "79.",
        { picture: differences },
      ),
      quiz([
        [
          ["Second difference 6: $n^2$ term", "$3n^2$", ["$6n^2$", "$n^2$"], "Half."],
          ["Second difference 2: $n^2$ term", "$n^2$", ["$2n^2$", "$4n^2$"], "Half."],
        ],
        [
          ["$n$th term of 2, 5, 10, 17", "$n^2 + 1$", ["$3n - 1$", "$2n^2$"], "Squares + 1."],
          ["$n$th term of 0, 3, 8, 15", "$n^2 - 1$", ["$3n - 3$", "$n^2$"], "Squares − 1."],
        ],
        [
          [
            "A sequence is quadratic if",
            "second differences are constant",
            ["first differences are constant", "it doubles"],
            "Rule.",
          ],
          [
            "A linear sequence has constant",
            "first differences",
            ["second differences only", "ratios"],
            "Rule.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "iterative-processes",
    "GH-R16",
    "Iterative processes",
    "Apply the same rule to each new value: uₙ₊₁ = 1.03uₙ − 100.",
    [
      problem(
        "Saving and spending",
        [
          "Kai has £2000 in an account paying 3% a year. At the end of each year, after interest, he takes out £100. “Find his balance after 3 years.”",
          "Each year depends on the last. By the end of this lesson, you can follow processes like this.",
        ],
        savings,
      ),
      typed("Warm-up", "3% interest on £2000", "60", "$0.03 \\times 2000$.", "£60."),
      typed("Warm-up", "$2000 \\times 1.03 - 100$", "1960", "$2060 - 100$.", "1960."),
      explain(
        "Discover",
        "A rule for the next one",
        [
          "An **iterative process** applies the same rule to each new value. Here: $u_{n+1} = 1.03u_n - 100$, starting from $u_0 = 2000$.",
          "It isn't just compound interest, so the power formula doesn't work: go a step at a time, keeping full accuracy.",
        ],
        savings,
      ),
      choose(
        "Discover",
        "$u_1 = 1960$. $u_2 =$",
        "$1.03 \\times 1960 - 100$",
        "Use the new value.",
        [
          ["$1.03 \\times 2000 - 200$", "One step at a time."],
          ["$2000 \\times 1.03^2 - 100$", "Take £100 each year."],
        ],
      ),
      worked(
        "Kai's account",
        "$u_{n+1} = 1.03u_n - 100$, $u_0 = 2000$.",
        [
          ["$u_1 = 1960$, $u_2 = 1918.80$", "Repeat."],
          ["$u_3 = 1.03 \\times 1918.80 - 100 = 1876.36$", "Third year."],
        ],
        "His balance falls slowly: the interest is less than £100.",
        savings,
      ),
      steps(
        "Together",
        "A pond has 50 fish. Each year the number grows by 20%, then 8 are removed. After 2 years?",
        "One year at a time.",
        [
          [
            "Year 1:",
            "$50 \\times 1.2 - 8 = 52$",
            ["$50 \\times 1.2 = 60$", "Remove the 8."],
            "52",
          ],
          [
            "Year 2:",
            "$52 \\times 1.2 - 8 = 54.4$, about 54",
            ["$50 \\times 1.44 - 16$", "One step at a time."],
            "54 fish",
          ],
        ],
        "Round only at the end.",
      ),
      choose(
        "Together",
        "With $u_{n+1} = 1.03u_n - 100$, Kai's balance stays level when",
        "$0.03u = 100$, so $u \\approx £3333$",
        "Interest equals withdrawal.",
        [
          ["never", "It can balance."],
          ["at £100", "Interest must match £100."],
        ],
      ),
      typed("Your turn", "$u_{n+1} = 2u_n - 3$, $u_1 = 4$. $u_2$", "5", "$8 - 3$.", "5."),
      typed("Your turn", "And $u_3$", "7", "$10 - 3$.", "7."),
      choose(
        "Watch out",
        "Ola takes £300 off and uses $2000 \\times 1.03^3$. What's wrong?",
        "The £100 taken each year would have earned interest: go step by step",
        "Order matters.",
        [["Nothing", "That's a different answer: £1885.45."]],
      ),
      mistake(
        "Ben works out Kai's second year.",
        ["$u_1 = 1960$", "$u_2 = 1.03 \\times 2000 - 100 = 1960$", "So it stays at 1960"],
        1,
        "Use the new value: $1.03 \\times 1960 - 100 = 1918.80$.",
      ),
      typed(
        "Back to the problem",
        "“Find his balance after 3 years.” To the nearest penny.",
        "1876.36",
        "Three steps.",
        "£1876.36.",
        { unit: "£", picture: savings, wrong: [["1885.45", "Go year by year."]] },
      ),
      quiz([
        [
          ["$u_{n+1} = 3u_n$, $u_1 = 2$. $u_3$", "18", ["6", "12"], "2, 6, 18."],
          ["$u_{n+1} = u_n + 5$, $u_1 = 1$. $u_3$", "11", ["6", "15"], "1, 6, 11."],
        ],
        [
          ["$u_{n+1} = 0.5u_n + 4$, $u_1 = 10$. $u_2$", "9", ["5", "14"], "5 + 4."],
          ["$u_{n+1} = 0.5u_n + 4$, $u_2 = 9$. $u_3$", "8.5", ["4.5", "13"], "4.5 + 4."],
        ],
        [
          [
            "In an iterative process each value comes from",
            "the one before",
            ["the first only", "a formula in $n$"],
            "Step by step.",
          ],
          ["Round", "only at the end", ["every step", "never"], "Accuracy."],
        ],
      ]),
    ],
  ),
];
