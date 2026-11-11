// GCSE Higher, "Recurring decimals and bounds", as three short lessons, one just before each skill:
// recurring decimals to fractions, fractions to recurring decimals, and calculating with upper and
// lower bounds. Each recaps the Foundation idea quickly, builds it to Higher level, names the
// common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gh-fdp";

export const ghFdp: UnitLesson[] = [
  lesson(
    U,
    "recurring-to-fraction",
    "GH-N10.a",
    "Recurring decimals to fractions",
    "Multiply by 10, 100 or 1000 so the repeats line up, then subtract.",
    [
      problem("Prove it's a fraction", [
        "“Prove algebraically that $0.\\dot{4}\\dot{5} = \\frac{5}{11}$.” Every recurring decimal is a fraction: this method shows which.",
        "By the end of this lesson, you can convert any recurring decimal.",
      ]),
      choose(
        "Warm-up",
        "$0.\\dot{4}\\dot{5}$ means",
        "0.454545…",
        "Dots over the first and last repeating digits.",
        [
          ["0.45555…", "That's $0.4\\dot5$."],
          ["0.45", "It goes on."],
        ],
      ),
      typed("Warm-up", "$100 \\times 0.4545$", "45.45", "Move 2 places.", "45.45."),
      explain("Discover", "Line up the repeats", [
        "Let $x$ be the decimal. Multiply by 10 if one digit repeats, 100 if two repeat, 1000 if three repeat, so the repeating parts line up.",
        "Subtract to remove the endless tail, then solve for $x$.",
      ]),
      choose("Discover", "For $0.\\dot{1}2\\dot{3}$, multiply by", "1000", "Three digits repeat.", [
        ["100", "That lines up only two."],
        ["10", "One digit."],
      ]),
      worked(
        "The proof",
        "$x = 0.454545\\ldots$",
        [
          ["$100x = 45.4545\\ldots$", "Two digits repeat."],
          ["$100x - x = 45$, so $99x = 45$", "Subtract: the tails cancel."],
          ["$x = \\frac{45}{99} = \\frac{5}{11}$", "Simplify."],
        ],
        "As required.",
      ),
      steps(
        "Together",
        "Convert $0.2\\dot{7}$",
        "Only the 7 repeats.",
        [
          [
            "$x = 0.2777\\ldots$; $10x =$",
            "2.777…",
            ["27.77…", "Move one place."],
            "$10x = 2.777\\ldots$",
          ],
          [
            "$10x - x = 2.5$, so $x =$",
            "$\\frac{2.5}{9} = \\frac{5}{18}$",
            ["$\\frac{27}{99}$", "Only one digit repeats."],
            "$\\frac{5}{18}$",
          ],
        ],
        "$9x = 2.5$, so $x = \\frac{25}{90} = \\frac{5}{18}$.",
      ),
      choose("Together", "$0.\\dot{3}$ as a fraction", "$\\frac13$", "$9x = 3$.", [
        ["$\\frac{3}{10}$", "That's 0.3 exactly."],
        ["$\\frac{3}{100}$", "That's 0.03."],
      ]),
      choose("Your turn", "$0.\\dot{7}$ as a fraction", "$\\frac79$", "$9x = 7$.", [
        ["$\\frac{7}{10}$", "That ends."],
        ["$\\frac{7}{99}$", "One digit repeats."],
      ]),
      choose(
        "Your turn",
        "$0.\\dot{1}\\dot{8}$ as a fraction",
        "$\\frac{2}{11}$",
        "$\\frac{18}{99}$.",
        [
          ["$\\frac{18}{100}$", "It doesn't end."],
          ["$\\frac{1}{8}$", "That's 0.125."],
        ],
      ),
      choose(
        "Watch out",
        "Ivy writes $0.\\dot{6} = \\frac{6}{10}$. What's wrong?",
        "That's 0.6 exactly; $0.\\dot6 = \\frac23$",
        "Recurring needs the 9s.",
        [["Nothing", "$\\frac{6}{10} = 0.6$ stops."]],
      ),
      mistake(
        "Ben converts $0.\\dot{3}\\dot{6}$.",
        ["$x = 0.3636\\ldots$", "$10x = 3.636\\ldots$", "$9x = 3.27$, messy"],
        1,
        "Two digits repeat: use $100x = 36.36\\ldots$, so $99x = 36$ and $x = \\frac{4}{11}$.",
      ),
      choose(
        "Back to the problem",
        "“Prove $0.\\dot{4}\\dot{5} = \\frac{5}{11}$.” The key line:",
        "$99x = 45$",
        "$100x - x$.",
        [
          ["$10x = 4.5$", "Two digits repeat."],
          ["$x = \\frac{45}{100}$", "That's 0.45 exactly."],
        ],
      ),
      quiz([
        [
          ["$0.\\dot{5}$", "$\\frac59$", ["$\\frac{5}{10}$", "$\\frac{5}{99}$"], "$9x = 5$."],
          ["$0.\\dot{2}$", "$\\frac29$", ["$\\frac{2}{10}$", "$\\frac{2}{99}$"], "$9x = 2$."],
        ],
        [
          [
            "$0.\\dot{2}\\dot{7}$",
            "$\\frac{3}{11}$",
            ["$\\frac{27}{100}$", "$\\frac{2}{7}$"],
            "$\\frac{27}{99}$.",
          ],
          [
            "$0.\\dot{0}\\dot{9}$",
            "$\\frac{1}{11}$",
            ["$\\frac{9}{100}$", "$\\frac{1}{9}$"],
            "$\\frac{9}{99}$.",
          ],
        ],
        [
          ["Two repeating digits: multiply by", "100", ["10", "1000"], "Line up."],
          ["Three repeating digits: multiply by", "1000", ["100", "10"], "Line up."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "fraction-to-recurring",
    "GH-N10.b",
    "Fractions to recurring decimals",
    "Divide the top by the bottom until the remainders repeat.",
    [
      problem("Which ones recur?", [
        "“Write $\\frac{3}{11}$ as a recurring decimal.” And “Without dividing, which of $\\frac{7}{20}$ and $\\frac{7}{30}$ is a recurring decimal?”",
        "By the end of this lesson, you can answer both.",
      ]),
      typed("Warm-up", "$1 \\div 4$", "0.25", "Divide.", "0.25."),
      choose("Warm-up", "$1 \\div 3$", "0.333…", "Remainder 1 every time.", [
        ["0.3", "It doesn't stop."],
        ["0.33", "It goes on."],
      ]),
      explain("Discover", "Remainders repeat", [
        "Short division of the top by the bottom: once a remainder comes back, the digits repeat from there.",
        "A fraction in its simplest form **terminates** only if its denominator has no prime factors other than 2 and 5. Any other prime (3, 7, 11…) makes it **recur**.",
      ]),
      choose("Discover", "Which terminates?", "$\\frac{3}{40}$", "$40 = 2^3 \\times 5$.", [
        ["$\\frac{1}{6}$", "6 has a factor of 3."],
        ["$\\frac{2}{7}$", "7 makes it recur."],
      ]),
      worked(
        "Three elevenths",
        "$3 \\div 11$.",
        [
          ["$30 \\div 11 = 2$ r 8; $80 \\div 11 = 7$ r 3", "Short division."],
          ["Remainder 3 again: it repeats", "Back to the start."],
          ["$\\frac{3}{11} = 0.\\dot{2}\\dot{7}$", "Two repeating digits."],
        ],
        "0.272727…",
      ),
      steps(
        "Together",
        "Which recurs: $\\frac{7}{20}$ or $\\frac{7}{30}$?",
        "Look at the denominators.",
        [
          ["$20 =$", "$2^2 \\times 5$", ["$2 \\times 10$", "Primes only."], "Only 2s and 5s"],
          [
            "$30 = 2 \\times 3 \\times 5$, so",
            "$\\frac{7}{30}$ recurs",
            ["$\\frac{7}{20}$ recurs", "20 has only 2 and 5."],
            "The 3 makes it recur",
          ],
        ],
        "$\\frac{7}{20} = 0.35$; $\\frac{7}{30} = 0.2\\dot{3}$.",
      ),
      choose("Together", "$\\frac{5}{6}$ as a decimal", "$0.8\\dot{3}$", "$5 \\div 6$.", [
        ["$0.\\dot{8}\\dot{3}$", "Only the 3 repeats."],
        ["0.56", "That's not $\\frac56$."],
      ]),
      choose("Your turn", "$\\frac{2}{9}$ as a decimal", "$0.\\dot{2}$", "Remainder 2 each time.", [
        ["0.29", "Divide properly."],
        ["$0.\\dot{2}\\dot{9}$", "Only the 2."],
      ]),
      choose(
        "Your turn",
        "Does $\\frac{9}{75}$ terminate?",
        "Yes: it's $\\frac{3}{25}$",
        "Simplify first.",
        [["No: 75 has a factor of 3", "Simplify first: $\\frac{3}{25}$."]],
      ),
      choose(
        "Watch out",
        "Kim says $\\frac{3}{12}$ recurs because 12 has a factor of 3. What's wrong?",
        "Simplify first: $\\frac14 = 0.25$",
        "Simplest form.",
        [["Nothing", "$\\frac{3}{12} = \\frac14$."]],
      ),
      mistake(
        "Leo writes $\\frac{1}{7}$ as a decimal.",
        ["$1 \\div 7 = 0.142857\\ldots$", "The digits look random", "So it never repeats"],
        2,
        "The remainder 1 comes back after six steps, so it recurs: $0.\\dot{1}4285\\dot{7}$.",
      ),
      choose(
        "Back to the problem",
        "“Write $\\frac{3}{11}$ as a recurring decimal.”",
        "$0.\\dot{2}\\dot{7}$",
        "0.2727…",
        [
          ["$0.\\dot{3}$", "That's $\\frac13$."],
          ["0.27", "It doesn't stop."],
        ],
      ),
      quiz([
        [
          ["$\\frac{4}{11}$", "$0.\\dot{3}\\dot{6}$", ["0.36", "$0.\\dot{4}$"], "Divide."],
          ["$\\frac{5}{11}$", "$0.\\dot{4}\\dot{5}$", ["0.45", "$0.\\dot{5}$"], "Divide."],
        ],
        [
          [
            "Which of these terminates?",
            "$\\frac{7}{8}$",
            ["$\\frac{7}{12}$", "$\\frac{7}{9}$"],
            "8 = $2^3$.",
          ],
          [
            "Which terminates?",
            "$\\frac{3}{50}$",
            ["$\\frac{3}{70}$", "$\\frac{1}{3}$"],
            "50 = $2 \\times 5^2$.",
          ],
        ],
        [
          ["$\\frac{1}{6}$", "$0.1\\dot{6}$", ["$0.\\dot{1}\\dot{6}$", "0.16"], "Only 6 repeats."],
          [
            "$\\frac{1}{12}$",
            "$0.08\\dot{3}$",
            ["$0.\\dot{0}\\dot{8}$", "0.083"],
            "Only 3 repeats.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "bounds",
    "GH-N16",
    "Calculating with bounds",
    "Pick the bound of each value that pushes the answer furthest.",
    [
      problem("The fastest possible", [
        "A runner covers 100 m, to the nearest metre, in 12.3 s, to 1 decimal place. “Find the upper bound of her average speed. Give your answer to 3 significant figures.”",
        "By the end of this lesson, you can choose the right bounds for any calculation.",
      ]),
      typed(
        "Warm-up",
        "Upper bound of 100 m, to the nearest metre",
        "100.5",
        "Half a metre up.",
        "100.5 m.",
      ),
      typed(
        "Warm-up",
        "Lower bound of 12.3 s, to 1 d.p.",
        "12.25",
        "Half of 0.1 down.",
        "12.25 s.",
      ),
      explain("Discover", "Biggest over smallest", [
        "To make a **sum** or **product** as big as possible, use the upper bounds of both.",
        "To make a **difference** or **quotient** as big as possible, use the upper bound of the first and the **lower** bound of the second: dividing by a smaller number gives more.",
      ]),
      choose(
        "Discover",
        "Upper bound of speed = distance ÷ time uses",
        "upper distance ÷ lower time",
        "Big over small.",
        [
          ["upper distance ÷ upper time", "A bigger time makes it slower."],
          ["lower ÷ lower", "That's not the biggest."],
        ],
      ),
      worked(
        "The runner",
        "Upper bound of speed.",
        [
          ["$\\frac{100.5}{12.25}$", "Upper ÷ lower."],
          ["$= 8.204\\ldots$", "Calculator."],
          ["$8.20$ m/s (3 s.f.)", "Round."],
        ],
        "Lower bound: $\\frac{99.5}{12.35} = 8.06$ m/s.",
      ),
      steps(
        "Together",
        "A rectangle is 6 cm by 4 cm, both to the nearest cm. Lower bound of the area?",
        "Smallest × smallest.",
        [
          ["Lower bounds:", "5.5 and 3.5", ["5 and 3", "Half a centimetre down."], "5.5, 3.5"],
          ["Area:", "19.25 cm²", ["24 cm²", "Use the bounds."], "19.25 cm²"],
        ],
        "Upper: 6.5 × 4.5 = 29.25 cm².",
      ),
      choose(
        "Together",
        "$a = 20$ and $b = 8$, both to the nearest whole number. Upper bound of $a - b$",
        "20.5 − 7.5 = 13",
        "Big minus small.",
        [
          ["20.5 − 8.5 = 12", "Subtract the smallest $b$."],
          ["20 − 8 = 12", "Use the bounds."],
        ],
      ),
      typed(
        "Your turn",
        "Upper bound of 3.4 + 2.7, each to 1 d.p.",
        "6.2",
        "3.45 + 2.75.",
        "6.2.",
        { wrong: [["6.1", "Use the bounds."]] },
      ),
      typed(
        "Your turn",
        "Lower bound of $\\frac{40}{5}$, each to the nearest whole number. Give it to 3 s.f.",
        "7.18",
        "$\\frac{39.5}{5.5}$.",
        "7.18.",
        { wrong: [["8", "Lower ÷ upper."]] },
      ),
      choose(
        "Watch out",
        "Ola finds the upper bound of a speed using the upper bound of time. What's wrong?",
        "More time means slower: use the lower bound of time",
        "Divide by the smallest.",
        [["Nothing", "That gives a lower speed."]],
      ),
      mistake(
        "Zoe finds the lower bound of $x - y$, with $x = 9.2$ and $y = 3.6$, both to 1 d.p.",
        ["Lower bound $x$: 9.15", "Lower bound $y$: 3.55", "$9.15 - 3.55 = 5.6$"],
        1,
        "Subtract the biggest $y$ (3.65): $9.15 - 3.65 = 5.5$.",
      ),
      typed(
        "Back to the problem",
        "“Find the upper bound of her speed, to 3 s.f.”",
        "8.20",
        "$100.5 \\div 12.25$.",
        "8.20 m/s.",
        {
          unit: "m/s",
          wrong: [
            ["8.13", "That's 100 ÷ 12.3: use the bounds."],
            ["8.14", "Divide by the lower time."],
          ],
        },
      ),
      quiz([
        [
          ["Upper bound of 5 × 3 (nearest whole)", "19.25", ["15", "12.25"], "5.5 × 3.5."],
          ["Upper bound of 4 × 2 (nearest whole)", "11.25", ["8", "5.25"], "4.5 × 2.5."],
        ],
        [
          [
            "Upper bound of $a \\div b$ uses",
            "upper $a$, lower $b$",
            ["upper $a$, upper $b$", "lower $a$, upper $b$"],
            "Big over small.",
          ],
          [
            "Lower bound of $a - b$ uses",
            "lower $a$, upper $b$",
            ["lower $a$, lower $b$", "upper $a$, upper $b$"],
            "Small minus big.",
          ],
        ],
        [
          ["Upper bound of 8.5, to 1 d.p.", "8.55", ["8.6", "8.45"], "+0.05."],
          ["Lower bound of 300, to the nearest 10", "295", ["299.5", "290"], "−5."],
        ],
      ]),
    ],
  ),
];
