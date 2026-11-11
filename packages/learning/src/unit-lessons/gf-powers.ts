// GCSE Foundation, "Powers, roots and surds", as seven short lessons, one just before each skill:
// positive powers, square and cube roots, the powers of 2, 3, 4 and 5, calculating with roots,
// zero and negative indices, and exact answers with fractions and π. Each recaps the Key Stage 3
// idea quickly, builds it to GCSE level, names the common mistakes and ends on an exam-style
// check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-powers";

export const gfPowers: UnitLesson[] = [
  lesson(
    U,
    "powers",
    "GF-N6.a",
    "Positive powers",
    "A power says how many times a number is multiplied by itself.",
    [
      problem("The chain message", [
        "A message is sent to 3 people, who each send it to 3 more, and so on. After 5 rounds, how many people get it in the last round?",
        "That's $3^5$. By the end of this lesson, you can work out and compare powers quickly.",
      ]),
      typed("Warm-up", "Work out $3 \\times 3$", "9", "Times.", "9."),
      typed("Warm-up", "Work out $9 \\times 3$", "27", "Times.", "27."),
      explain(
        "Discover",
        "Base and index",
        [
          "In $3^5$, 3 is the **base** and 5 is the **index** (or power): $3 \\times 3 \\times 3 \\times 3 \\times 3 = 243$.",
          "$a^2$ is “$a$ squared”; $a^3$ is “$a$ cubed”. A power is not a multiplication: $3^5 \\ne 3 \\times 5$.",
        ],
        { kind: "maths", tex: "3^5 = 3 \\times 3 \\times 3 \\times 3 \\times 3 = 243" },
      ),
      choose("Discover", "$2^4$ is", "16", "$2 \\times 2 \\times 2 \\times 2$.", [
        ["8", "That's $2 \\times 4$."],
        ["6", "That's $2 + 4$."],
      ]),
      worked(
        "The message",
        "Work out $3^5$.",
        [
          ["$3^2 = 9$, $3^3 = 27$", "Build up."],
          ["$3^4 = 81$, $3^5 = 243$", "Times 3 each time."],
        ],
        "243 people in round 5.",
      ),
      steps(
        "Together",
        "Which is bigger, $2^5$ or $5^2$?",
        "Work out both.",
        [
          ["$2^5 =$", "32", ["10", "Multiply five 2s."], "32"],
          ["$5^2 = 25$, so the bigger is", "$2^5$", ["$5^2$", "32 > 25."], "$2^5$"],
        ],
        "Swapping base and index changes the value.",
      ),
      choose("Together", "$(-2)^3 =$", "−8", "Three negatives multiply to a negative.", [
        ["8", "An odd number of negatives: negative."],
        ["−6", "Multiply, don't times by 3."],
      ]),
      typed("Your turn", "Work out $4^3$", "64", "$4 \\times 4 \\times 4$.", "64.", {
        wrong: [["12", "That's $4 \\times 3$."]],
      }),
      typed("Your turn", "Work out $10^5$", "100000", "A 1 and five zeros.", "100 000."),
      choose(
        "Watch out",
        "Ben says $6^2 = 12$. What's wrong?",
        "$6^2 = 6 \\times 6 = 36$",
        "Squaring isn't doubling.",
        [["Nothing", "$6 \\times 2 = 12$ is doubling."]],
      ),
      mistake(
        "Ola works out $2^3 + 3^2$.",
        ["$2^3 = 6$", "$3^2 = 9$", "$6 + 9 = 15$"],
        0,
        "$2^3 = 8$, so the answer is 17.",
      ),
      typed("Back to the problem", "“Work out $3^5$.”", "243", "Times 3 five times.", "243.", {
        wrong: [["15", "$3^5$ isn't $3 \\times 5$."]],
      }),
      quiz([
        [
          ["$5^3$", "125", ["15", "25"], "$5 \\times 5 \\times 5$."],
          ["$3^4$", "81", ["12", "27"], "$3 \\times 3 \\times 3 \\times 3$."],
        ],
        [
          ["$(-3)^2$", "9", ["−9", "−6"], "Two negatives."],
          ["$(-1)^5$", "−1", ["1", "−5"], "Odd: negative."],
        ],
        [
          ["Bigger: $3^4$ or $4^3$?", "$3^4$", ["$4^3$", "equal"], "81 > 64."],
          ["Bigger: $2^6$ or $6^2$?", "$2^6$", ["$6^2$", "equal"], "64 > 36."],
        ],
      ]),
    ],
  ),

  lesson(U, "roots", "GF-N6.b", "Square and cube roots", "Roots undo powers: √49 = 7, ∛64 = 4.", [
    problem("The square garden", [
      "A square garden has an area of 196 m². A cube-shaped tank holds 125 m³. How long are their sides?",
      "By the end of this lesson, you can undo squares and cubes.",
    ]),
    typed("Warm-up", "Work out $14^2$", "196", "$14 \\times 14$.", "196."),
    typed("Warm-up", "Work out $5^3$", "125", "$5 \\times 5 \\times 5$.", "125."),
    explain(
      "Discover",
      "Undo the power",
      [
        "The **square root** $\\sqrt{x}$ is the number that squares to $x$: $\\sqrt{196} = 14$. Every positive number has two square roots: $14$ and $-14$.",
        "The **cube root** $\\sqrt[3]{x}$ cubes to $x$: $\\sqrt[3]{125} = 5$, and $\\sqrt[3]{-8} = -2$.",
      ],
      { kind: "maths", tex: "\\sqrt{196} = 14 \\qquad \\sqrt[3]{125} = 5" },
    ),
    choose("Discover", "The square roots of 36 are", "6 and −6", "Both square to 36.", [
      ["6 only", "$(-6)^2 = 36$ too."],
      ["18", "That's half of 36."],
    ]),
    worked(
      "The garden and tank",
      "Find the side lengths.",
      [
        ["Garden: $\\sqrt{196} = 14$ m", "Area = side²."],
        ["Tank: $\\sqrt[3]{125} = 5$ m", "Volume = side³."],
      ],
      "Lengths are positive, so use the positive root.",
    ),
    steps(
      "Together",
      "Estimate $\\sqrt{50}$",
      "Between two squares.",
      [
        [
          "50 is between",
          "49 and 64",
          ["25 and 36", "$7^2 = 49$, $8^2 = 64$."],
          "$7 < \\sqrt{50} < 8$",
        ],
        ["Closer to 7, so about", "7.1", ["7.9", "50 is just above 49."], "≈ 7.1"],
      ],
      "$\\sqrt{50} = 7.07…$",
    ),
    choose("Together", "$\\sqrt[3]{-27}$", "−3", "$(-3)^3 = -27$.", [
      ["3", "$3^3 = +27$."],
      ["no answer", "Cube roots of negatives exist."],
    ]),
    typed("Your turn", "$\\sqrt{144}$", "12", "$12 \\times 12$.", "12."),
    typed("Your turn", "$\\sqrt[3]{1000}$", "10", "$10 \\times 10 \\times 10$.", "10.", {
      wrong: [["100", "$100^3$ is a million."]],
    }),
    choose(
      "Watch out",
      "Kai says $\\sqrt{64} = 32$. What's wrong?",
      "Square root isn't halving: $\\sqrt{64} = 8$",
      "$8 \\times 8 = 64$.",
      [["Nothing", "$32 \\times 32 = 1024$."]],
    ),
    mistake(
      "Mia estimates $\\sqrt{90}$.",
      [
        "$9^2 = 81$ and $10^2 = 100$",
        "So $\\sqrt{90}$ is between 9 and 10",
        "$\\sqrt{90} \\approx 45$",
      ],
      2,
      "It's between 9 and 10: about 9.5.",
    ),
    choose(
      "Back to the problem",
      "“A square garden has area 196 m². Work out its side length.”",
      "14 m",
      "$\\sqrt{196}$.",
      [
        ["98 m", "That halves it."],
        ["49 m", "That's a quarter."],
      ],
    ),
    quiz([
      [
        ["$\\sqrt{81}$", "9", ["40.5", "27"], "$9^2$."],
        ["$\\sqrt{169}$", "13", ["84.5", "17"], "$13^2$."],
      ],
      [
        ["$\\sqrt[3]{8}$", "2", ["4", "2.67"], "$2^3$."],
        ["$\\sqrt[3]{64}$", "4", ["8", "21.3"], "$4^3$."],
      ],
      [
        ["$\\sqrt{30}$ lies between", "5 and 6", ["15 and 16", "4 and 5"], "25 and 36."],
        ["$\\sqrt{70}$ lies between", "8 and 9", ["35 and 36", "7 and 8"], "64 and 81."],
      ],
    ]),
  ]),

  lesson(
    U,
    "recognise",
    "GF-N6.c",
    "Powers to know",
    "Recognise the powers of 2, 3, 4 and 5 on sight.",
    [
      problem("Non-calculator", [
        "“Write 64 as a power of 2. Write 81 as a power of 3.” On the non-calculator paper, knowing these by heart saves time.",
        "By the end of this lesson, you'll recognise them straight away.",
      ]),
      typed("Warm-up", "Work out $2^6$", "64", "Keep doubling: 2, 4, 8, 16, 32, 64.", "64."),
      typed("Warm-up", "Work out $3^4$", "81", "3, 9, 27, 81.", "81."),
      explain(
        "Discover",
        "The tables of powers",
        [
          "**2**: 2, 4, 8, 16, 32, 64, 128, 256. **3**: 3, 9, 27, 81, 243. **4**: 4, 16, 64, 256. **5**: 5, 25, 125, 625.",
          "Some numbers are powers of more than one: $64 = 2^6 = 4^3 = 8^2$.",
        ],
        {
          kind: "table",
          head: ["Power", "1", "2", "3", "4", "5"],
          rows: [
            ["2", "2", "4", "8", "16", "32"],
            ["3", "3", "9", "27", "81", "243"],
            ["5", "5", "25", "125", "625", "3125"],
          ],
        },
      ),
      choose("Discover", "Which is a power of 5?", "125", "$5^3$.", [
        ["100", "$100 = 10^2$."],
        ["150", "Not a power of 5."],
      ]),
      worked(
        "Write as a power",
        "Write 64 as a power of 2, and of 4.",
        [
          ["$2^6 = 64$", "Double six times."],
          ["$4^3 = 64$", "$4 \\times 4 \\times 4$."],
        ],
        "Both are right.",
      ),
      steps(
        "Together",
        "Is 256 a power of 4?",
        "Check.",
        [
          ["$4^3 =$", "64", ["12", "$4 \\times 4 \\times 4$."], "64"],
          ["$4^4 =$", "256, so yes", ["128, so no", "$64 \\times 4 = 256$."], "$256 = 4^4$"],
        ],
        "And $256 = 2^8$.",
      ),
      choose("Together", "Solve $2^n = 32$", "$n = 5$", "2, 4, 8, 16, 32.", [
        ["$n = 16$", "$2 \\times 16 = 32$, but powers multiply 2s."],
        ["$n = 4$", "$2^4 = 16$."],
      ]),
      typed("Your turn", "Solve $3^n = 243$", "5", "3, 9, 27, 81, 243.", "$n = 5$."),
      typed("Your turn", "Solve $5^n = 625$", "4", "5, 25, 125, 625.", "$n = 4$."),
      choose(
        "Watch out",
        "Ed writes $2^n = 16$, so $n = 8$. What's wrong?",
        "$2^8 = 256$; $2^4 = 16$",
        "Count the doublings.",
        [["Nothing", "$16 \\div 2 = 8$ isn't how powers work."]],
      ),
      mistake(
        "Zoe writes 81 as a power of 3.",
        ["$3 \\times 3 = 9$", "$9 \\times 9 = 81$", "So $81 = 3^3$"],
        2,
        "$9 \\times 9 = 3 \\times 3 \\times 3 \\times 3 = 3^4$.",
      ),
      choose(
        "Back to the problem",
        "“Write 81 as a power of 3.”",
        "$3^4$",
        "$3 \\times 3 \\times 3 \\times 3$.",
        [
          ["$3^{27}$", "Count the threes: four."],
          ["$9^3$", "$9^3 = 729$."],
        ],
      ),
      quiz([
        [
          ["$2^n = 128$", "7", ["64", "6"], "2 … 128."],
          ["$2^n = 8$", "3", ["4", "2"], "2, 4, 8."],
        ],
        [
          ["$4^n = 64$", "3", ["16", "4"], "4, 16, 64."],
          ["$5^n = 125$", "3", ["25", "4"], "5, 25, 125."],
        ],
        [
          ["Which is a power of 3?", "27", ["12", "60"], "$3^3$."],
          ["Which is a power of 2?", "32", ["24", "50"], "$2^5$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "with-roots",
    "GF-N7.a",
    "Calculating with roots",
    "Use roots in calculations, with the right order of operations.",
    [
      problem("The exam question", [
        "“Work out $\\sqrt{3^2 + 4^2}$.” And “$\\dfrac{\\sqrt{81}}{3} + 2^3$.” Roots and powers mixed with other operations.",
        "By the end of this lesson, you'll do them in the right order every time.",
      ]),
      typed("Warm-up", "$\\sqrt{25}$", "5", "$5^2$.", "5."),
      typed("Warm-up", "$3^2 + 4^2$", "25", "$9 + 16$.", "25."),
      explain(
        "Discover",
        "The root sign is a bracket",
        [
          "Work out everything **under** the root sign first, then take the root. $\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.",
          "$\\sqrt{a + b}$ is **not** $\\sqrt a + \\sqrt b$: $\\sqrt{9 + 16} = 5$ but $3 + 4 = 7$.",
        ],
        { kind: "maths", tex: "\\sqrt{3^2 + 4^2} = \\sqrt{25} = 5" },
      ),
      choose("Discover", "$\\sqrt{36} \\times \\sqrt{4}$", "12", "$6 \\times 2$.", [
        ["$\\sqrt{40}$", "Multiply the roots: 6 × 2."],
        ["144", "Take the roots first."],
      ]),
      worked(
        "Mixed",
        "Work out $\\dfrac{\\sqrt{81}}{3} + 2^3$.",
        [
          ["$\\sqrt{81} = 9$, $9 \\div 3 = 3$", "The fraction."],
          ["$2^3 = 8$", "The power."],
          ["$3 + 8 = 11$", "Add."],
        ],
        "Roots and powers before × ÷ + −.",
      ),
      steps(
        "Together",
        "Work out $\\sqrt{100 - 36}$",
        "Under the root first.",
        [
          ["$100 - 36 =$", "64", ["10 − 6", "Don't root each part."], "$\\sqrt{64}$"],
          ["$\\sqrt{64} =$", "8", ["32", "$8^2 = 64$."], "8"],
        ],
        "Not $10 - 6 = 4$.",
      ),
      choose("Together", "$2\\sqrt{49}$", "14", "$2 \\times 7$.", [
        ["$\\sqrt{98}$", "$2\\sqrt{49} = 2 \\times \\sqrt{49}$."],
        ["7", "Times by 2."],
      ]),
      typed("Your turn", "$\\sqrt{5^2 + 12^2}$", "13", "$\\sqrt{169}$.", "13.", {
        wrong: [["17", "Add under the root first."]],
      }),
      typed("Your turn", "$3 \\times \\sqrt{16} - 2^2$", "8", "$12 - 4$.", "8."),
      choose(
        "Watch out",
        "Ade works out $\\sqrt{16 + 9}$ as $4 + 3 = 7$. What's wrong?",
        "Add first: $\\sqrt{25} = 5$",
        "The root covers the whole sum.",
        [["Nothing", "$7^2 = 49$, not 25."]],
      ),
      mistake(
        "Jen works out $\\sqrt{64} + \\sqrt{36}$.",
        ["$\\sqrt{64} = 8$", "$\\sqrt{36} = 6$", "$8 + 6 = \\sqrt{100} = 10$"],
        2,
        "Just add: $8 + 6 = 14$.",
      ),
      typed("Back to the problem", "“Work out $\\sqrt{3^2 + 4^2}$.”", "5", "$\\sqrt{25}$.", "5.", {
        wrong: [["7", "Add under the root first."]],
      }),
      quiz([
        [
          ["$\\sqrt{6^2 + 8^2}$", "10", ["14", "100"], "$\\sqrt{100}$."],
          ["$\\sqrt{8^2 + 15^2}$", "17", ["23", "289"], "$\\sqrt{289}$."],
        ],
        [
          ["$\\sqrt{9} \\times \\sqrt{25}$", "15", ["$\\sqrt{34}$", "225"], "$3 \\times 5$."],
          ["$\\sqrt{4} \\times \\sqrt{49}$", "14", ["$\\sqrt{53}$", "196"], "$2 \\times 7$."],
        ],
        [
          ["$\\sqrt{50 - 1}$", "7", ["6", "49"], "$\\sqrt{49}$."],
          ["$\\sqrt{90 + 10}$", "10", ["100", "12.6"], "$\\sqrt{100}$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "indices",
    "GF-N7.b",
    "Zero and negative indices",
    "a⁰ = 1, and a negative index means one over.",
    [
      problem("Halving the bacteria", [
        "A dish has $2^3 = 8$ cells. Going back in time, each hour halves them: $2^2$, $2^1$, $2^0$, $2^{-1}$… What do $2^0$ and $2^{-1}$ mean?",
        "By the end of this lesson, you'll know, and use the index laws with them.",
      ]),
      typed("Warm-up", "Work out $2^3$", "8", "$2 \\times 2 \\times 2$.", "8."),
      typed("Warm-up", "Half of 1", "0.5", "Halve.", "0.5."),
      explain(
        "Discover",
        "Follow the pattern",
        [
          "Each step down in the index halves the value: $2^3 = 8$, $2^2 = 4$, $2^1 = 2$, so $2^0 = 1$, $2^{-1} = \\frac12$, $2^{-2} = \\frac14$.",
          "So $a^0 = 1$ for any $a$ (except 0), and $a^{-n} = \\frac{1}{a^n}$.",
        ],
        {
          kind: "table",
          head: ["$2^3$", "$2^2$", "$2^1$", "$2^0$", "$2^{-1}$", "$2^{-2}$"],
          rows: [["8", "4", "2", "1", "$\\frac12$", "$\\frac14$"]],
        },
      ),
      choose("Discover", "$5^0 =$", "1", "Any number to the power 0 is 1.", [
        ["0", "It's 1, not 0."],
        ["5", "$5^1 = 5$."],
      ]),
      worked(
        "Negative powers",
        "Write $3^{-2}$ as a fraction.",
        [
          ["$3^{-2} = \\frac{1}{3^2}$", "Negative: one over."],
          ["$= \\frac19$", "Square 3."],
        ],
        "A negative index doesn't make the answer negative.",
      ),
      steps(
        "Together",
        "Simplify $5^3 \\times 5^{-5}$",
        "Index laws still work.",
        [
          ["Add the powers:", "$5^{-2}$", ["$5^{8}$", "$3 + (-5) = -2$."], "$5^{-2}$"],
          ["As a fraction:", "$\\frac{1}{25}$", ["−25", "One over $5^2$."], "$\\frac{1}{25}$"],
        ],
        "Add when multiplying, even with negatives.",
      ),
      choose("Together", "$\\dfrac{7^4}{7^4} =$", "$7^0 = 1$", "Anything divided by itself is 1.", [
        ["0", "$7^{4-4} = 7^0 = 1$."],
        ["7", "Subtract: 0."],
      ]),
      choose("Your turn", "$10^{-3}$ is", "0.001", "$\\frac{1}{1000}$.", [
        ["−1000", "Not negative: one over."],
        ["−30", "It's a fraction."],
      ]),
      choose("Your turn", "Simplify $\\dfrac{x^2}{x^6}$", "$x^{-4}$", "$2 - 6$.", [
        ["$x^4$", "$2 - 6 = -4$."],
        ["$x^3$", "Subtract, don't divide."],
      ]),
      choose(
        "Watch out",
        "Raj says $4^{-1} = -4$. What's wrong?",
        "It means one over: $\\frac14$",
        "Negative indices give reciprocals.",
        [["Nothing", "$4^{-1} \\times 4 = 1$, so it's $\\frac14$."]],
      ),
      mistake(
        "Kim simplifies $6^0 \\times 6^2$.",
        ["$6^0 = 0$", "$0 \\times 36 = 0$", "Answer: 0"],
        0,
        "$6^0 = 1$, so the answer is 36.",
      ),
      choose(
        "Back to the problem",
        "“Write the value of $2^0$ and $2^{-1}$.”",
        "1 and $\\frac12$",
        "Halving each step.",
        [
          ["0 and −2", "Follow the halving pattern."],
          ["2 and −1", "Powers, not multiples."],
        ],
      ),
      quiz([
        [
          ["$9^0$", "1", ["0", "9"], "Power 0."],
          ["$100^0$", "1", ["0", "100"], "Power 0."],
        ],
        [
          ["$2^{-3}$", "$\\frac18$", ["−8", "−6"], "One over $2^3$."],
          ["$5^{-1}$", "$\\frac15$", ["−5", "0.5"], "One over 5."],
        ],
        [
          ["$3^2 \\times 3^{-4}$", "$3^{-2}$", ["$3^{6}$", "$3^{-8}$"], "Add."],
          ["$4^{-1} \\times 4^{3}$", "$4^2$", ["$4^{-3}$", "$4^4$"], "Add."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "exact-fractions",
    "GF-N8.a",
    "Exact answers with fractions",
    "Keep answers as fractions when a decimal would recur.",
    [
      problem("Give an exact answer", [
        "“Work out $\\frac23 + \\frac15$. Give your answer as a fraction in its simplest form.” A calculator shows 0.8666666… — not exact.",
        "By the end of this lesson, you'll know when and how to keep answers exact.",
      ]),
      choose("Warm-up", "$\\frac13$ as a decimal", "0.333…", "It recurs for ever.", [
        ["0.3", "That's $\\frac{3}{10}$."],
      ]),
      choose(
        "Warm-up",
        "Common denominator for $\\frac23$ and $\\frac15$",
        "15",
        "LCM of 3 and 5.",
        [["8", "Multiply, don't add."]],
      ),
      explain(
        "Discover",
        "Exact means no rounding",
        [
          "Many fractions are recurring decimals, so rounding loses accuracy. An **exact** answer keeps the fraction.",
          "Simplify fully, and give mixed numbers or improper fractions as asked.",
        ],
        {
          kind: "maths",
          tex: "\\frac23 + \\frac15 = \\frac{10}{15} + \\frac{3}{15} = \\frac{13}{15}",
        },
      ),
      choose("Discover", "Which answer is exact?", "$\\frac{13}{15}$", "The fraction is exact.", [
        ["0.87", "That's rounded."],
        ["0.866", "Still rounded."],
      ]),
      worked(
        "The exam question",
        "Work out $\\frac23 + \\frac15$ exactly.",
        [
          ["$\\frac{10}{15} + \\frac{3}{15}$", "Common denominator."],
          ["$\\frac{13}{15}$", "13 and 15 share no factor."],
        ],
        "Exact, and in simplest form.",
      ),
      steps(
        "Together",
        "Work out $\\frac56 - \\frac14$ exactly",
        "Twelfths.",
        [
          [
            "$\\frac{10}{12} - \\frac{3}{12} =$",
            "$\\frac{7}{12}$",
            ["$\\frac{4}{2}$", "Subtract the tops only."],
            "$\\frac{7}{12}$",
          ],
          ["Simplest form?", "Yes", ["No", "7 and 12 share no factor."], "$\\frac{7}{12}$"],
        ],
        "0.58333… as a decimal: not exact.",
      ),
      choose(
        "Together",
        "Work out $\\frac{2}{3} \\times \\frac{9}{14}$ exactly",
        "$\\frac37$",
        "$\\frac{18}{42} = \\frac37$.",
        [
          ["0.43", "Rounded."],
          ["$\\frac{18}{42}$", "Simplify."],
        ],
      ),
      choose(
        "Your turn",
        "$\\frac17 + \\frac13$ exactly",
        "$\\frac{10}{21}$",
        "$\\frac{3}{21} + \\frac{7}{21}$.",
        [
          ["$\\frac{2}{10}$", "Common denominator 21."],
          ["0.48", "Rounded."],
        ],
      ),
      choose(
        "Your turn",
        "$\\frac49 \\div \\frac23$ exactly",
        "$\\frac23$",
        "$\\frac49 \\times \\frac32 = \\frac{12}{18}$.",
        [
          ["$\\frac{8}{27}$", "That multiplies."],
          ["0.67", "Rounded."],
        ],
      ),
      choose(
        "Watch out",
        "Asked for an exact answer, Ben writes 0.67 for $\\frac23$. Full marks?",
        "No: 0.67 is rounded; write $\\frac23$",
        "Exact means no rounding.",
        [["Yes", "0.6666… doesn't end."]],
      ),
      mistake(
        "Zoe works out $\\frac34 + \\frac16$ exactly.",
        ["$\\frac{9}{12} + \\frac{2}{12}$", "$= \\frac{11}{12}$", "$\\approx 0.92$, so 0.92"],
        2,
        "Stop at $\\frac{11}{12}$: that's exact.",
      ),
      choose(
        "Back to the problem",
        "“Work out $\\frac23 + \\frac15$. Give your answer as a fraction in its simplest form.”",
        "$\\frac{13}{15}$",
        "$\\frac{10}{15} + \\frac{3}{15}$.",
        [
          ["0.87", "Not a fraction."],
          ["$\\frac38$", "Don't add the bottoms."],
        ],
      ),
      quiz([
        [
          ["$\\frac14 + \\frac13$", "$\\frac{7}{12}$", ["$\\frac27$", "0.58"], "Twelfths."],
          ["$\\frac25 + \\frac13$", "$\\frac{11}{15}$", ["$\\frac38$", "0.73"], "Fifteenths."],
        ],
        [
          [
            "$\\frac56 \\times \\frac{3}{10}$",
            "$\\frac14$",
            ["$\\frac{15}{60}$", "0.25…"],
            "Simplify.",
          ],
          [
            "$\\frac38 \\times \\frac{4}{9}$",
            "$\\frac16$",
            ["$\\frac{12}{72}$", "0.17"],
            "Simplify.",
          ],
        ],
        [
          ["An exact answer is", "not rounded", ["to 2 d.p.", "a whole number"], "Exact."],
          ["Which is exact?", "$\\frac29$", ["0.22", "0.222"], "Fraction."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "exact-pi",
    "GF-N8.b",
    "Exact answers with π",
    "Leave π in the answer: 25π is exact, 78.5 is not.",
    [
      problem("Leave it in terms of π", [
        "“A circle has radius 5 cm. Find its area. Give your answer in terms of π.” The answer isn't 78.5.",
        "By the end of this lesson, you can give exact answers with π, and simplify them.",
      ]),
      typed("Warm-up", "Work out $5^2$", "25", "$5 \\times 5$.", "25."),
      typed("Warm-up", "Work out $2 \\times 7$", "14", "Times.", "14."),
      explain(
        "Discover",
        "π is a number you keep",
        [
          "π's decimals never end, so any rounded value loses accuracy. “In terms of π” means keep π as a symbol, like a letter: $25\\pi$.",
          "Collect like terms: $3\\pi + 5\\pi = 8\\pi$, and $\\frac{36\\pi}{4} = 9\\pi$.",
        ],
        { kind: "maths", tex: "A = \\pi r^2 = \\pi \\times 5^2 = 25\\pi" },
      ),
      choose(
        "Discover",
        "Circumference of a circle with diameter 8, in terms of π",
        "$8\\pi$",
        "$C = \\pi d$.",
        [
          ["25.1", "That's rounded."],
          ["$16\\pi$", "That's $2\\pi \\times 8$, the radius rule."],
        ],
      ),
      worked(
        "The circle",
        "Radius 5 cm. Area in terms of π.",
        [
          ["$A = \\pi r^2$", "Formula."],
          ["$= \\pi \\times 25 = 25\\pi$", "Number in front of π."],
        ],
        "$25\\pi$ cm²: exact.",
      ),
      steps(
        "Together",
        "A semicircle of radius 6 cm",
        "Area in terms of π.",
        [
          ["Whole circle:", "$36\\pi$", ["$12\\pi$", "$6^2 = 36$."], "$36\\pi$"],
          [
            "Half:",
            "$18\\pi$",
            ["$36\\pi \\div 2\\pi$", "Halve the number in front."],
            "$18\\pi$ cm²",
          ],
        ],
        "Treat π like a letter.",
      ),
      choose("Together", "Simplify $4\\pi + 9\\pi - \\pi$", "$12\\pi$", "$4 + 9 - 1$.", [
        ["$13\\pi$", "Take off the last $\\pi$."],
        ["$12\\pi^3$", "Adding doesn't multiply."],
      ]),
      choose(
        "Your turn",
        "Area of a circle, radius 3, in terms of π",
        "$9\\pi$",
        "$\\pi \\times 9$.",
        [
          ["$6\\pi$", "That's the circumference."],
          ["28.3", "That's rounded."],
        ],
      ),
      choose("Your turn", "Circumference, radius 7, in terms of π", "$14\\pi$", "$2\\pi r$.", [
        ["$49\\pi$", "That's the area."],
        ["$7\\pi$", "Use the diameter, 14."],
      ]),
      choose(
        "Watch out",
        "Asked for an answer in terms of π, Jo writes 50.27. Full marks?",
        "No: write $16\\pi$",
        "Keep π as a symbol.",
        [["Yes", "In terms of π means π stays."]],
      ),
      mistake(
        "Leo finds the area of a circle with diameter 10, in terms of π.",
        ["$A = \\pi r^2$", "$r = 10$", "$A = 100\\pi$"],
        1,
        "The radius is half the diameter: $r = 5$, so $25\\pi$.",
      ),
      choose(
        "Back to the problem",
        "“Radius 5 cm. Find the area, in terms of π.”",
        "$25\\pi$ cm²",
        "$\\pi \\times 5^2$.",
        [
          ["78.5 cm²", "Not in terms of π."],
          ["$10\\pi$ cm²", "That's the circumference."],
        ],
      ),
      quiz([
        [
          ["Area, radius 4, in terms of π", "$16\\pi$", ["$8\\pi$", "50.3"], "$\\pi \\times 16$."],
          [
            "Area, radius 10, in terms of π",
            "$100\\pi$",
            ["$20\\pi$", "314.2"],
            "$\\pi \\times 100$.",
          ],
        ],
        [
          ["Circumference, diameter 12", "$12\\pi$", ["$36\\pi$", "$24\\pi$"], "$\\pi d$."],
          ["Circumference, radius 9", "$18\\pi$", ["$81\\pi$", "$9\\pi$"], "$2\\pi r$."],
        ],
        [
          ["$7\\pi - 2\\pi$", "$5\\pi$", ["5", "$9\\pi$"], "Like terms."],
          ["$\\frac{20\\pi}{4}$", "$5\\pi$", ["$5$", "$80\\pi$"], "Divide the number."],
        ],
      ]),
    ],
  ),
];
