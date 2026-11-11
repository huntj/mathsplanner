// GCSE Foundation, "Place value and calculation", as eight short lessons, one just before each
// skill: ordering, inequality symbols, negatives, decimals, fractions, very large and small
// numbers, inverse operations and the order of operations. Each recaps the Key Stage 3 idea
// quickly, builds it to GCSE level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-calculation";

export const gfCalculation: UnitLesson[] = [
  lesson(
    U,
    "order",
    "GF-N1.a",
    "Putting numbers in order",
    "Write fractions as decimals to compare them.",
    [
      problem("The exam question", [
        "“Write these numbers in order of size, smallest first: 0.6, $\\frac23$, 0.65, $\\frac58$.”",
        "Fractions and decimals mixed together are hard to compare by eye. By the end of this lesson, you can order any list.",
      ]),
      choose(
        "Warm-up",
        "Which is bigger?",
        "−3",
        "−3 is nearer zero, so it is higher up the number line.",
        [["−7", "−7 is further below zero, so it is smaller."]],
      ),
      choose("Warm-up", "Which is bigger?", "0.4", "0.40 has 4 tenths; 0.35 has only 3.", [
        ["0.35", "Compare tenths first: 4 tenths beats 3 tenths."],
      ]),
      explain(
        "Discover",
        "Make them all decimals",
        [
          "To compare fractions and decimals, write every fraction as a decimal: divide the top by the bottom.",
          "Then give them all the same number of decimal places, and compare place by place.",
        ],
        { kind: "maths", tex: "\\frac58 = 5 \\div 8 = 0.625" },
      ),
      choose(
        "Discover",
        "Write $\\frac23$ as a decimal",
        "0.666…",
        "$2 \\div 3 = 0.6666…$, a recurring decimal.",
        [
          ["0.23", "That just copies the digits. Divide 2 by 3."],
          ["1.5", "That is $3 \\div 2$. Divide the top by the bottom."],
        ],
      ),
      worked(
        "Order them",
        "Order 0.6, $\\frac23$, 0.65, $\\frac58$, smallest first.",
        [
          ["$\\frac23 = 0.667$, $\\frac58 = 0.625$", "Fractions to decimals."],
          ["0.600, 0.667, 0.650, 0.625", "Three decimal places each."],
          ["0.6, $\\frac58$, 0.65, $\\frac23$", "Compare, then write the originals."],
        ],
        "Always write the numbers as they were given.",
      ),
      {
        kind: "order",
        tag: "Together",
        title: "Smallest to largest",
        items: ["−2.5", "−2", "−0.5", "0.3", "$\\frac12$"],
        first: "smallest",
        last: "largest",
        hint: "Negatives first: the further from zero, the smaller. $\\frac12 = 0.5$.",
        done: "−2.5, −2, −0.5, 0.3, 0.5.",
      },
      steps(
        "Together",
        "Which is larger: $\\frac34$ or $\\frac{7}{10}$?",
        "Compare $\\frac34$ and $\\frac{7}{10}$.",
        [
          ["$\\frac34$ as a decimal is", "0.75", ["0.34", "Divide: $3 \\div 4$."], "0.75"],
          [
            "$\\frac{7}{10}$ is 0.7, so the larger is",
            "$\\frac34$",
            ["$\\frac{7}{10}$", "0.75 is more than 0.70."],
            "$\\frac34$",
          ],
        ],
        "Same number of decimal places makes it easy: 0.75 against 0.70.",
      ),
      choose("Your turn", "Which is the largest?", "$\\frac45$", "$\\frac45 = 0.8$, the biggest.", [
        ["0.78", "0.78 is less than 0.80."],
        ["$\\frac34$", "$\\frac34 = 0.75$."],
      ]),
      choose("Your turn", "Which is the smallest?", "−1.5", "Furthest below zero.", [
        ["−1", "−1.5 is further below zero."],
        ["−0.5", "−0.5 is nearer zero than −1.5."],
      ]),
      choose(
        "Watch out",
        "Ben says 0.35 is bigger than 0.4 because 35 is bigger than 4. Is he right?",
        "No: 0.4 = 0.40, and 40 hundredths beats 35",
        "Line up the decimal places before comparing.",
        [["Yes", "Write 0.4 as 0.40 and compare again."]],
      ),
      mistake(
        "Ali orders −4, −9 and 2, smallest first.",
        ["The negatives come first", "4 is less than 9, so −4 comes before −9", "−4, −9, 2"],
        1,
        "−9 is further below zero, so it is smaller: −9, −4, 2.",
      ),
      choose(
        "Back to the problem",
        "“Write 0.6, $\\frac23$, 0.65, $\\frac58$ in order, smallest first.”",
        "0.6, $\\frac58$, 0.65, $\\frac23$",
        "0.600, 0.625, 0.650, 0.667.",
        [
          ["$\\frac58$, 0.6, $\\frac23$, 0.65", "$\\frac58 = 0.625$, which is more than 0.6."],
          ["0.6, 0.65, $\\frac58$, $\\frac23$", "$\\frac58 = 0.625$ comes before 0.65."],
        ],
      ),
      quiz([
        [
          ["Which is largest?", "$\\frac35$", ["0.55", "$\\frac12$"], "$\\frac35 = 0.6$."],
          [
            "Which of these is largest?",
            "0.71",
            ["$\\frac{7}{10}$", "$\\frac23$"],
            "0.71 beats 0.70 and 0.67.",
          ],
        ],
        [
          ["Which is smallest?", "−6.2", ["−6", "−0.62"], "Furthest below zero."],
          ["Which of these is smallest?", "−3.5", ["−3", "−0.35"], "Furthest below zero."],
        ],
        [
          ["$\\frac38$ as a decimal is", "0.375", ["0.38", "2.67"], "$3 \\div 8$."],
          ["$\\frac{9}{20}$ as a decimal is", "0.45", ["0.92", "2.2"], "$9 \\div 20$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "symbols",
    "GF-N1.b",
    "Inequality symbols",
    "Use =, ≠, <, >, ≤ and ≥ to compare and to set limits.",
    [
      problem("The lift sign", [
        "A lift says “Maximum 8 people”. A ride says “You must be at least 1.2 m tall”.",
        "Maths writes rules like these with symbols. By the end of this lesson, you can write and read them.",
      ]),
      choose(
        "Warm-up",
        "Is $5 > 3$ true?",
        "Yes",
        "5 is greater than 3. The wide end faces the bigger number.",
        [["No", "The symbol opens towards the bigger number, 5."]],
      ),
      choose("Warm-up", "Which symbol goes between 7 and 9? 7 ? 9", "<", "7 is less than 9.", [
        [">", "That says 7 is bigger."],
        ["=", "They are not equal."],
      ]),
      explain(
        "Discover",
        "Six symbols",
        [
          "$=$ equal, $\\ne$ not equal, $<$ less than, $>$ greater than.",
          "$\\le$ means **less than or equal to**, $\\ge$ **greater than or equal to**: the extra line means the end value is allowed.",
        ],
        { kind: "maths", tex: "n \\le 8 \\qquad h \\ge 1.2" },
      ),
      choose(
        "Discover",
        "“At most 8” means the number can be",
        "8 or less: $n \\le 8$",
        "8 is allowed, so use ≤.",
        [["less than 8: $n < 8$", "“At most 8” allows exactly 8."]],
      ),
      worked(
        "Write the rule",
        "Write “you must be at least 18” as an inequality for age $a$.",
        [
          ["At least 18: 18 or more", "18 itself is allowed."],
          ["$a \\ge 18$", "Greater than or equal to."],
        ],
        "“At least” is ≥; “at most” is ≤.",
      ),
      steps(
        "Together",
        "Is it true?",
        "Check each statement.",
        [
          [
            "$0.5 \\ne \\frac12$ is",
            "false",
            ["true", "$\\frac12 = 0.5$, so they are equal."],
            "They are equal",
          ],
          ["$-4 \\le -4$ is", "true", ["false", "≤ allows equal: −4 equals −4."], "True"],
        ],
        "≠ means not equal; ≤ includes the end.",
      ),
      choose(
        "Together",
        "Which integers satisfy $-2 < n \\le 1$?",
        "−1, 0, 1",
        "−2 is not allowed (<); 1 is allowed (≤).",
        [
          ["−2, −1, 0, 1", "< means −2 itself is not included."],
          ["−1, 0", "≤ means 1 is included."],
        ],
      ),
      choose(
        "Your turn",
        "A bag can hold up to 23 kg. Mass $m$:",
        "$m \\le 23$",
        "Up to and including 23.",
        [
          ["$m < 23$", "Exactly 23 kg is allowed."],
          ["$m \\ge 23$", "That means 23 or more."],
        ],
      ),
      choose("Your turn", "Which is true?", "$-3 > -5$", "−3 is nearer zero.", [
        ["$-3 < -5$", "−5 is further below zero."],
        ["$0.3 > 0.32$", "0.30 is less than 0.32."],
      ]),
      choose(
        "Watch out",
        "Is 5 one of the numbers with $n < 5$?",
        "No: < does not include 5",
        "Only ≤ includes the end value.",
        [["Yes", "$5 < 5$ is false."]],
      ),
      mistake(
        "Zoe lists the whole numbers with $3 \\le n < 6$.",
        ["$n$ is at least 3", "$n$ is less than 6", "So $n$ = 3, 4, 5, 6"],
        2,
        "6 is not less than 6: $n$ = 3, 4, 5.",
      ),
      choose(
        "Back to the problem",
        "“The lift carries at most 8 people. Write an inequality for the number of people, $p$.”",
        "$p \\le 8$",
        "At most 8: up to and including 8.",
        [
          ["$p < 8$", "8 people is allowed."],
          ["$p \\ge 8$", "That's 8 or more."],
        ],
      ),
      quiz([
        [
          ["“More than 4” is", "$n > 4$", ["$n \\ge 4$", "$n < 4$"], "4 itself is not included."],
          [
            "“Fewer than 30” is",
            "$n < 30$",
            ["$n \\le 30$", "$n > 30$"],
            "30 itself is not included.",
          ],
        ],
        [
          [
            "Integers with $-1 \\le n < 2$:",
            "−1, 0, 1",
            ["0, 1", "−1, 0, 1, 2"],
            "Include −1, not 2.",
          ],
          ["Integers with $0 < n \\le 3$:", "1, 2, 3", ["0, 1, 2, 3", "1, 2"], "Not 0; include 3."],
        ],
        [
          [
            "Which is true?",
            "$\\frac14 = 0.25$",
            ["$\\frac14 > 0.25$", "$\\frac14 \\ne 0.25$"],
            "They're equal.",
          ],
          [
            "Which of these is true?",
            "$0.7 \\ne \\frac17$",
            ["$0.7 = \\frac17$", "$0.7 < \\frac17$"],
            "$\\frac17 \\approx 0.14$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "negatives",
    "GF-N2.a",
    "Negative numbers",
    "Add, subtract, multiply and divide with negatives.",
    [
      problem("Freezer to fridge", [
        "A freezer is at −18°C and a fridge at 4°C. A diver at −12 m rises 5 m, then dives 3 times as deep.",
        "By the end of this lesson, you can calculate with negatives in any of the four operations.",
      ]),
      typed("Warm-up", "Work out $-3 + 5$", "2", "Start at −3 and go up 5.", "2."),
      typed("Warm-up", "Work out $2 - 6$", "-4", "Start at 2 and go down 6.", "−4."),
      explain(
        "Discover",
        "Signs",
        [
          "Subtracting a negative is the same as adding: $5 - (-3) = 5 + 3 = 8$.",
          "Multiplying or dividing: **same signs give positive, different signs give negative**.",
        ],
        { kind: "maths", tex: "-3 \\times -4 = 12 \\qquad -12 \\div 3 = -4" },
      ),
      choose("Discover", "Work out $-6 \\times -2$", "12", "Same signs: positive.", [
        ["−12", "Two negatives multiply to a positive."],
        ["−8", "That adds. Multiply."],
      ]),
      worked(
        "The temperature difference",
        "Find the difference between 4°C and −18°C.",
        [
          ["$4 - (-18)$", "Difference: larger take smaller."],
          ["$= 4 + 18 = 22$", "Subtracting a negative adds."],
        ],
        "22 degrees.",
      ),
      steps(
        "Together",
        "Work out $\\frac{-24}{-3} + (-2)$",
        "$\\frac{-24}{-3} + (-2)$",
        [
          ["$-24 \\div -3 =$", "8", ["−8", "Same signs give a positive."], "$8 + (-2)$"],
          ["$8 + (-2) =$", "6", ["10", "Adding −2 is taking 2."], "6"],
        ],
        "Divide first, then add.",
      ),
      steps(
        "Together",
        "Work out $(-3)^2$ and $-3^2$",
        "Brackets matter.",
        [
          [
            "$(-3)^2 = -3 \\times -3 =$",
            "9",
            ["−9", "Two negatives make a positive."],
            "$(-3)^2 = 9$",
          ],
          [
            "$-3^2$ squares only the 3, so it's",
            "−9",
            ["9", "Square 3 first, then make it negative."],
            "$-3^2 = -9$",
          ],
        ],
        "On a calculator, use brackets for $(-3)^2$.",
      ),
      typed(
        "Your turn",
        "Work out $-7 - (-10)$",
        "3",
        "Subtracting −10 adds 10.",
        "$-7 + 10 = 3$.",
        { wrong: [["-17", "Subtracting a negative adds."]] },
      ),
      typed(
        "Your turn",
        "Work out $-5 \\times 4 \\div -2$",
        "10",
        "$-20 \\div -2$.",
        "$-20 \\div -2 = 10$.",
        { wrong: [["-10", "Two negatives (−20 and −2): positive."]] },
      ),
      choose(
        "Watch out",
        "Kim says $-4 - 3 = -1$. What's wrong?",
        "Going down 3 from −4 gives −7",
        "Taking away moves further below zero.",
        [["Nothing", "Start at −4 and go down 3."]],
      ),
      mistake(
        "Leo works out $-2 \\times -3 \\times -1$.",
        ["$-2 \\times -3 = 6$", "$6 \\times -1 = 6$", "Answer: 6"],
        1,
        "Different signs give a negative: $6 \\times -1 = -6$.",
      ),
      typed(
        "Back to the problem",
        "“A diver at −12 m rises 5 m, then dives to 3 times that depth. Work out her final depth.”",
        "-21",
        "Rise 5 first: −7. Then times 3.",
        "$-12 + 5 = -7$, and $3 \\times -7 = -21$ m.",
        { unit: "m", wrong: [["-51", "Rise 5 first, then multiply."]] },
      ),
      quiz([
        [
          ["$-8 + 3$", "−5", ["−11", "5"], "Up 3 from −8."],
          ["$-9 + 4$", "−5", ["−13", "5"], "Up 4 from −9."],
        ],
        [
          ["$-6 \\times -5$", "30", ["−30", "−11"], "Same signs."],
          ["$-7 \\times -3$", "21", ["−21", "−10"], "Same signs."],
        ],
        [
          ["$15 \\div -3$", "−5", ["5", "−45"], "Different signs."],
          ["$-18 \\div 6$", "−3", ["3", "−12"], "Different signs."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "decimals",
    "GF-N2.b",
    "Calculating with decimals",
    "Multiply and divide decimals without a calculator.",
    [
      problem("At the deli", [
        "Ham costs £4.80 a kilogram. You buy 0.35 kg. And a 7.2 m rope is cut into 0.06 m pieces.",
        "No calculator allowed. By the end of this lesson, you can work out both.",
      ]),
      typed("Warm-up", "Work out $24 \\times 3$", "72", "$20 \\times 3 + 4 \\times 3$.", "72."),
      typed("Warm-up", "Work out $0.6 \\times 10$", "6", "Times 10 moves digits one place.", "6."),
      explain(
        "Discover",
        "Multiply as whole numbers, then place the point",
        [
          "For $2.4 \\times 0.3$: work out $24 \\times 3 = 72$. There are **2 decimal places** in the question (one in 2.4, one in 0.3).",
          "So the answer has 2 decimal places: $0.72$.",
        ],
        { kind: "maths", tex: "2.4 \\times 0.3 = 0.72" },
      ),
      explain(
        "Discover",
        "Divide by making the divisor whole",
        [
          "For $7.2 \\div 0.06$, multiply both numbers by 100 so you divide by a whole number: $720 \\div 6 = 120$.",
          "Doing the same to both keeps the answer the same.",
        ],
        { kind: "maths", tex: "7.2 \\div 0.06 = 720 \\div 6 = 120" },
      ),
      worked(
        "The ham",
        "Work out $4.80 \\times 0.35$.",
        [
          ["$48 \\times 35 = 1680$", "Ignore the points (4.8 has 1 d.p.)."],
          ["3 decimal places in total", "One in 4.8, two in 0.35."],
          ["$1.680$, so £1.68", "Place the point."],
        ],
        "Estimate to check: about £5 × a third ≈ £1.70 ✓",
      ),
      steps(
        "Together",
        "Work out $0.8 \\times 0.07$",
        "$0.8 \\times 0.07$",
        [
          ["$8 \\times 7 =$", "56", ["15", "Multiply, don't add."], "56"],
          [
            "3 decimal places in total, so",
            "0.056",
            ["0.56", "Count: one in 0.8, two in 0.07."],
            "0.056",
          ],
        ],
        "Small times small makes smaller.",
      ),
      steps(
        "Together",
        "Work out $3.6 \\div 0.4$",
        "$3.6 \\div 0.4$",
        [
          [
            "Multiply both by 10:",
            "$36 \\div 4$",
            ["$3.6 \\div 4$", "Both numbers, so the answer is unchanged."],
            "$36 \\div 4$",
          ],
          ["So", "9", ["0.9", "$36 \\div 4 = 9$."], "9"],
        ],
        "Dividing by a number less than 1 makes it bigger.",
      ),
      typed(
        "Your turn",
        "Work out $1.2 \\times 0.6$",
        "0.72",
        "$12 \\times 6 = 72$, then 2 d.p.",
        "0.72.",
        { wrong: [["7.2", "Count both decimal places."]] },
      ),
      typed(
        "Your turn",
        "Work out $4.5 \\div 0.09$",
        "50",
        "Times both by 100: $450 \\div 9$.",
        "50.",
        { wrong: [["0.5", "Dividing by a small number makes it bigger."]] },
      ),
      choose(
        "Watch out",
        "Sam says $0.3 \\times 0.2 = 0.6$. Is he right?",
        "No: 2 decimal places, so 0.06",
        "Count the decimal places in the question.",
        [["Yes", "$0.3 \\times 0.2$ is less than both: 0.06."]],
      ),
      mistake(
        "Ava works out $8.4 \\div 0.2$.",
        ["$8.4 \\div 0.2$", "$= 8.4 \\div 2$", "$= 4.2$"],
        1,
        "Multiply both by 10: $84 \\div 2 = 42$.",
      ),
      typed(
        "Back to the problem",
        "“A 7.2 m rope is cut into 0.06 m pieces. How many pieces? You must show your working.”",
        "120",
        "$720 \\div 6$.",
        "$7.2 \\div 0.06 = 720 \\div 6 = 120$ pieces.",
        { wrong: [["12", "Multiply both by 100, not 10."]] },
      ),
      quiz([
        [
          ["$0.4 \\times 0.3$", "0.12", ["1.2", "0.012"], "$4 \\times 3 = 12$, 2 d.p."],
          ["$0.5 \\times 0.7$", "0.35", ["3.5", "0.035"], "$5 \\times 7 = 35$, 2 d.p."],
        ],
        [
          ["$6 \\div 0.3$", "20", ["2", "0.2"], "$60 \\div 3$."],
          ["$8 \\div 0.4$", "20", ["2", "3.2"], "$80 \\div 4$."],
        ],
        [
          ["$2.5 \\times 1.2$", "3", ["30", "0.3"], "$25 \\times 12 = 300$, 2 d.p."],
          ["$1.5 \\times 2.4$", "3.6", ["36", "0.36"], "$15 \\times 24 = 360$, 2 d.p."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "fractions",
    "GF-N2.c",
    "Calculating with fractions",
    "Add, subtract, multiply and divide fractions and mixed numbers.",
    [
      problem("Shelves", [
        "A plank is $5\\frac14$ m long. Shelves are each $\\frac34$ m. How many shelves can you cut? And what's $2\\frac13 + 1\\frac34$?",
        "By the end of this lesson, you can do all four operations with fractions and mixed numbers.",
      ]),
      choose("Warm-up", "$\\frac12 + \\frac14 =$", "$\\frac34$", "$\\frac24 + \\frac14$.", [
        ["$\\frac26$", "Don't add the bottoms. Use a common denominator."],
      ]),
      choose(
        "Warm-up",
        "$2\\frac13$ as an improper fraction is",
        "$\\frac73$",
        "$2 \\times 3 + 1 = 7$ thirds.",
        [["$\\frac23$", "Two wholes are six thirds, plus one."]],
      ),
      explain(
        "Discover",
        "The four rules",
        [
          "**Add or subtract**: use a common denominator. **Multiply**: tops times tops, bottoms times bottoms.",
          "**Divide**: keep the first, flip the second, multiply. Turn mixed numbers into improper fractions first.",
        ],
        { kind: "maths", tex: "\\frac34 \\div \\frac18 = \\frac34 \\times \\frac81 = 6" },
      ),
      choose(
        "Discover",
        "Why does dividing by $\\frac18$ give a bigger answer?",
        "It asks how many eighths fit in",
        "There are 6 eighths in $\\frac34$.",
        [["It doesn't", "$\\frac34 \\div \\frac18 = 6$, bigger than $\\frac34$."]],
      ),
      worked(
        "Add mixed numbers",
        "Work out $2\\frac13 + 1\\frac34$.",
        [
          ["$\\frac73 + \\frac74$", "Improper fractions."],
          ["$\\frac{28}{12} + \\frac{21}{12} = \\frac{49}{12}$", "Common denominator 12."],
          ["$= 4\\frac{1}{12}$", "Back to a mixed number."],
        ],
        "Or add the wholes and the fractions separately.",
      ),
      steps(
        "Together",
        "Work out $\\frac23 \\times \\frac{9}{10}$",
        "$\\frac23 \\times \\frac{9}{10}$",
        [
          [
            "Tops times tops, bottoms times bottoms:",
            "$\\frac{18}{30}$",
            ["$\\frac{11}{13}$", "Multiply, don't add."],
            "$\\frac{18}{30}$",
          ],
          [
            "Simplify:",
            "$\\frac35$",
            ["$\\frac{9}{15}$", "Divide top and bottom by 6."],
            "$\\frac35$",
          ],
        ],
        "You can cancel first: $\\frac{2}{3} \\times \\frac{9}{10} = \\frac{1}{1} \\times \\frac{3}{5}$.",
      ),
      steps(
        "Together",
        "Work out $1\\frac12 \\div \\frac34$",
        "$1\\frac12 \\div \\frac34$",
        [
          [
            "As an improper fraction, $1\\frac12$ is",
            "$\\frac32$",
            ["$\\frac12$", "One whole is two halves, plus one."],
            "$\\frac32 \\div \\frac34$",
          ],
          [
            "Flip and multiply:",
            "$\\frac32 \\times \\frac43 = 2$",
            ["$\\frac23 \\times \\frac34$", "Keep the first; flip the second."],
            "2",
          ],
        ],
        "Two lots of $\\frac34$ make $1\\frac12$ ✓",
      ),
      choose(
        "Your turn",
        "$3\\frac12 - 1\\frac23 =$",
        "$1\\frac56$",
        "$\\frac{21}{6} - \\frac{10}{6} = \\frac{11}{6}$.",
        [
          ["$2\\frac16$", "Borrow: $\\frac12$ is less than $\\frac23$."],
          ["$1\\frac16$", "Use improper fractions: $\\frac{21}{6} - \\frac{10}{6}$."],
        ],
      ),
      choose("Your turn", "$\\frac45 \\div 2 =$", "$\\frac25$", "Half of $\\frac45$.", [
        ["$\\frac85$", "That multiplies by 2."],
        ["$\\frac{4}{10}$", "That's equal to $\\frac25$: simplify it."],
      ]),
      choose(
        "Watch out",
        "Raj works out $\\frac25 + \\frac13 = \\frac38$. What's wrong?",
        "He added the denominators; use 15ths: $\\frac{11}{15}$",
        "Only the tops add once the bottoms match.",
        [["Nothing", "$\\frac38$ is less than $\\frac25$ alone."]],
      ),
      mistake(
        "Mia works out $2\\frac12 \\times 1\\frac12$.",
        [
          "Wholes: $2 \\times 1 = 2$",
          "Fractions: $\\frac12 \\times \\frac12 = \\frac14$",
          "Answer: $2\\frac14$",
        ],
        0,
        "You can't multiply the parts separately. $\\frac52 \\times \\frac32 = \\frac{15}{4} = 3\\frac34$.",
      ),
      choose(
        "Back to the problem",
        "“A $5\\frac14$ m plank is cut into $\\frac34$ m shelves. How many shelves? Show your working.”",
        "7",
        "$\\frac{21}{4} \\div \\frac34 = \\frac{21}{4} \\times \\frac43 = 7$.",
        [
          ["4", "Divide, don't multiply."],
          ["3.9", "$\\frac{21}{4} \\times \\frac43$."],
        ],
      ),
      quiz([
        [
          [
            "$\\frac35 + \\frac14$",
            "$\\frac{17}{20}$",
            ["$\\frac49$", "$\\frac{3}{20}$"],
            "$\\frac{12}{20} + \\frac{5}{20}$.",
          ],
          [
            "$\\frac23 + \\frac15$",
            "$\\frac{13}{15}$",
            ["$\\frac38$", "$\\frac{2}{15}$"],
            "$\\frac{10}{15} + \\frac{3}{15}$.",
          ],
        ],
        [
          [
            "$\\frac34 \\times \\frac25$",
            "$\\frac{3}{10}$",
            ["$\\frac59$", "$\\frac{15}{8}$"],
            "$\\frac{6}{20}$.",
          ],
          [
            "$\\frac56 \\times \\frac35$",
            "$\\frac12$",
            ["$\\frac{8}{11}$", "$\\frac{25}{18}$"],
            "$\\frac{15}{30}$.",
          ],
        ],
        [
          [
            "$\\frac23 \\div \\frac16$",
            "4",
            ["$\\frac19$", "$\\frac{2}{18}$"],
            "$\\frac23 \\times 6$.",
          ],
          [
            "$\\frac35 \\div \\frac{1}{10}$",
            "6",
            ["$\\frac{3}{50}$", "$\\frac{1}{6}$"],
            "$\\frac35 \\times 10$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "big-and-small",
    "GF-N2.d",
    "Very big, very small",
    "Read and write millions, billions, thousandths and millionths.",
    [
      problem("Headlines", [
        "“UK population: 67.4 million.” “A virus is 0.00012 mm across.” “Budget: £1.2 billion.”",
        "How many zeros is that? By the end of this lesson, you can write and compare them.",
      ]),
      typed(
        "Warm-up",
        "How many zeros in one million?",
        "6",
        "1 000 000.",
        "Six zeros: 1 000 000.",
      ),
      typed(
        "Warm-up",
        "Work out $0.7 \\div 10$",
        "0.07",
        "Each digit moves one place right.",
        "0.07.",
      ),
      explain(
        "Discover",
        "Millions and billions",
        [
          "A million is 1 000 000 ($10^6$). A billion is 1 000 000 000 ($10^9$), a thousand million.",
          "67.4 million $= 67.4 \\times 1\\,000\\,000 = 67\\,400\\,000$.",
        ],
        { kind: "place-value", number: "67400000", from: 7, to: 0, highlight: 6 },
      ),
      explain(
        "Discover",
        "Thousandths and millionths",
        [
          "Small numbers go right of the point: tenths, hundredths, thousandths…",
          "In 0.00012, the 1 is in the ten-thousandths column: 1 ten-thousandth and 2 hundred-thousandths.",
        ],
        { kind: "place-value", number: "0.00012", from: 0, to: -5, highlight: -4 },
      ),
      worked(
        "Write in full",
        "Write £1.2 billion in figures.",
        [
          ["1 billion = 1 000 000 000", "Nine zeros."],
          ["$1.2 \\times 1\\,000\\,000\\,000 = 1\\,200\\,000\\,000$", "Move the digits 9 places."],
        ],
        "£1 200 000 000.",
      ),
      steps(
        "Together",
        "Write 3.05 million in figures",
        "3.05 million",
        [
          ["1 million has how many zeros?", "6", ["3", "1 000 000: six."], "× 1 000 000"],
          [
            "So 3.05 million is",
            "3 050 000",
            ["3 500 000", "0.05 million is 50 000."],
            "3 050 000",
          ],
        ],
        "Mind the zero in 3.05.",
      ),
      choose("Together", "Which is smaller: 0.0045 or 0.004?", "0.004", "0.0040 against 0.0045.", [
        ["0.0045", "Line up: 0.0040 < 0.0045."],
      ]),
      typed(
        "Your turn",
        "Write 0.4 million in figures",
        "400000",
        "$0.4 \\times 1\\,000\\,000$.",
        "400 000.",
        { wrong: [["4000000", "That's 4 million."]] },
      ),
      choose(
        "Your turn",
        "Which is the value of the 3 in 0.0372?",
        "3 hundredths",
        "Tenths, hundredths: the 3 is the second place.",
        [
          ["3 tenths", "0 is in the tenths place."],
          ["3 thousandths", "Count: 0 tenths, 3 hundredths."],
        ],
      ),
      choose(
        "Watch out",
        "Ella writes 2.5 million as 2 500 000 000. What's wrong?",
        "That's 2.5 billion: a million has 6 zeros",
        "2.5 million = 2 500 000.",
        [["Nothing", "Count the zeros in a million."]],
      ),
      mistake(
        "Dan writes 0.035 as a fraction.",
        [
          "The 3 is in the hundredths column",
          "The 5 is in the thousandths",
          "So $0.035 = \\frac{35}{100}$",
        ],
        2,
        "The last digit is thousandths: $\\frac{35}{1000}$.",
      ),
      choose(
        "Back to the problem",
        "“Write 67.4 million in figures.”",
        "67 400 000",
        "$67.4 \\times 1\\,000\\,000$.",
        [
          ["674 000 000", "That's 674 million."],
          ["6 740 000", "That's 6.74 million."],
        ],
      ),
      quiz([
        [
          ["5.2 million in figures", "5 200 000", ["52 000 000", "520 000"], "× 1 000 000."],
          ["1.8 million in figures", "1 800 000", ["18 000 000", "180 000"], "× 1 000 000."],
        ],
        [
          ["Which is largest?", "0.05", ["0.0099", "0.049"], "0.050 is biggest."],
          ["Which of these is largest?", "0.3", ["0.299", "0.03"], "0.300 is biggest."],
        ],
        [
          [
            "One billion is",
            "1 000 000 000",
            ["1 000 000", "1 000 000 000 000"],
            "A thousand million.",
          ],
          ["A thousand million is", "one billion", ["one trillion", "ten million"], "$10^9$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "inverse",
    "GF-N3.a",
    "Inverse operations",
    "Undo operations to solve puzzles and check answers.",
    [
      problem("Think of a number", [
        "“I think of a number. I multiply it by 3, then subtract 5. The answer is 16.” What was the number?",
        "And how can you check $23.4 \\div 6 = 3.9$ without dividing again? By the end of this lesson, you'll undo maths.",
      ]),
      typed("Warm-up", "Work out $16 + 5$", "21", "Add.", "21."),
      typed("Warm-up", "Work out $21 \\div 3$", "7", "Divide.", "7."),
      explain(
        "Discover",
        "Undo in reverse",
        [
          "Each operation has an **inverse** that undoes it: + and −, × and ÷, squaring and square-rooting.",
          "To work backwards, undo the steps **in reverse order**, like taking off socks and shoes.",
        ],
        {
          kind: "maths",
          tex: "n \\xrightarrow{\\times 3} \\xrightarrow{-5} 16 \\qquad 16 \\xrightarrow{+5} \\xrightarrow{\\div 3} n",
        },
      ),
      choose(
        "Discover",
        "The inverse of “square it” is",
        "square root",
        "$\\sqrt{9} = 3$ undoes $3^2 = 9$.",
        [
          ["halve it", "Squaring isn't doubling."],
          ["cube it", "Square root undoes squaring."],
        ],
      ),
      worked(
        "Think of a number",
        "×3, then −5, gives 16. Find the number.",
        [
          ["Undo −5: $16 + 5 = 21$", "Last step first."],
          ["Undo ×3: $21 \\div 3 = 7$", "Then the first step."],
        ],
        "Check: $7 \\times 3 - 5 = 16$ ✓",
      ),
      steps(
        "Together",
        "Check $23.4 \\div 6 = 3.9$",
        "Use the inverse.",
        [
          [
            "The inverse of ÷ 6 is",
            "× 6",
            ["− 6", "Multiplying undoes dividing."],
            "$3.9 \\times 6$",
          ],
          ["$3.9 \\times 6 =$", "23.4 ✓", ["22.4", "$3.9 \\times 6 = 23.4$."], "Correct"],
        ],
        "Checks catch slips in the exam.",
      ),
      steps(
        "Together",
        "A number is squared, then 10 added: 59",
        "Find the positive number.",
        [
          ["Undo +10:", "49", ["69", "Take 10 away."], "49"],
          ["Undo squaring:", "7", ["24.5", "Square root, not halve."], "7"],
        ],
        "Check: $7^2 + 10 = 59$ ✓",
      ),
      typed(
        "Your turn",
        "Halve a number then add 8: 20. The number?",
        "24",
        "Undo +8, then undo halving.",
        "$20 - 8 = 12$, $12 \\times 2 = 24$.",
        { wrong: [["6", "Undo halving by doubling."]] },
      ),
      choose(
        "Your turn",
        "Which checks $45 \\times 12 = 540$?",
        "$540 \\div 12 = 45$",
        "Divide undoes multiply.",
        [
          ["$540 - 12 = 528$", "Use the inverse of ×: ÷."],
          ["$45 + 12 = 57$", "That's a different calculation."],
        ],
      ),
      choose(
        "Watch out",
        "×4 then +2 gives 30. Jo does $30 \\div 4 - 2$. What's wrong?",
        "Undo in reverse: subtract 2 first, then ÷ 4 = 7",
        "The last step done is the first to undo.",
        [["Nothing", "$30 \\div 4 - 2 = 5.5$; check: $5.5 \\times 4 + 2 = 24$."]],
      ),
      mistake(
        "“Subtract 3, then multiply by 5, gives 35.” Kai works back.",
        ["Undo × 5: $35 \\div 5 = 7$", "Undo − 3: $7 - 3 = 4$", "The number is 4"],
        1,
        "Undo − 3 by adding 3: $7 + 3 = 10$.",
      ),
      typed(
        "Back to the problem",
        "“×3 then −5 gives 16. Find the number. Show how you check your answer.”",
        "7",
        "Add 5, then divide by 3.",
        "7. Check: $7 \\times 3 - 5 = 16$ ✓",
      ),
      quiz([
        [
          ["×2 then +6 gives 20. Number?", "7", ["13", "16"], "$(20 - 6) \\div 2$."],
          ["×5 then +3 gives 28. Number?", "5", ["6.2", "25"], "$(28 - 3) \\div 5$."],
        ],
        [
          ["Inverse of × 7", "÷ 7", ["− 7", "+ 7"], "Divide."],
          ["Inverse of + 12", "− 12", ["÷ 12", "× 12"], "Subtract."],
        ],
        [
          ["Square, then − 1, gives 80. Positive number?", "9", ["40.5", "81"], "$\\sqrt{81}$."],
          ["Square, then + 4, gives 40. Positive number?", "6", ["18", "36"], "$\\sqrt{36}$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "priority",
    "GF-N3.b",
    "Order of operations",
    "Brackets, powers and roots, then × and ÷, then + and −.",
    [
      problem("Two calculators", [
        "Two pupils type $3 + 4 \\times 2^2$. One gets 28, the other 19. And what's the reciprocal of 0.25?",
        "By the end of this lesson, you'll know which is right, and why.",
      ]),
      typed("Warm-up", "Work out $2^2$", "4", "$2 \\times 2$.", "4."),
      typed(
        "Warm-up",
        "Work out $3 + 4 \\times 2$",
        "11",
        "Multiply before adding.",
        "$3 + 8 = 11$.",
        { wrong: [["14", "× comes before +."]] },
      ),
      explain(
        "Discover",
        "The order",
        [
          "**B**rackets, then **I**ndices (powers and roots), then **D**ivision and **M**ultiplication (left to right), then **A**ddition and **S**ubtraction (left to right).",
          "A long fraction line or a root sign acts like brackets: work out what's under or over it first.",
        ],
        { kind: "maths", tex: "3 + 4 \\times 2^2 = 3 + 4 \\times 4 = 19" },
      ),
      explain(
        "Discover",
        "Reciprocals",
        [
          "The **reciprocal** of a number is 1 divided by it. Multiplying a number by its reciprocal gives 1.",
          "The reciprocal of 4 is $\\frac14$; of $\\frac23$ is $\\frac32$; of 0.25 is $1 \\div 0.25 = 4$.",
        ],
        { kind: "maths", tex: "\\frac23 \\times \\frac32 = 1" },
      ),
      worked(
        "Roots and fractions",
        "Work out $\\dfrac{\\sqrt{16 + 9}}{2 + 3}$.",
        [
          ["$\\sqrt{25} = 5$", "Under the root first."],
          ["$2 + 3 = 5$", "The bottom, as if in brackets."],
          ["$5 \\div 5 = 1$", "Then divide."],
        ],
        "On a calculator, use brackets round the top and the bottom.",
      ),
      steps(
        "Together",
        "Work out $20 - 2 \\times (1 + 3)^2$",
        "$20 - 2 \\times (1 + 3)^2$",
        [
          [
            "Brackets, then the power:",
            "$4^2 = 16$",
            ["$1 + 9 = 10$", "Brackets first: $1 + 3 = 4$."],
            "$20 - 2 \\times 16$",
          ],
          ["Then", "$20 - 32 = -12$", ["$18 \\times 16$", "× before −."], "−12"],
        ],
        "−12.",
      ),
      choose(
        "Together",
        "The reciprocal of $\\frac38$ is",
        "$\\frac83$",
        "Flip it: $\\frac38 \\times \\frac83 = 1$.",
        [
          ["$-\\frac38$", "That's the negative."],
          ["$0.375$", "That's the same number as a decimal."],
        ],
      ),
      typed(
        "Your turn",
        "Work out $10 - 6 \\div 2 + 1$",
        "8",
        "÷ first, then left to right.",
        "$10 - 3 + 1 = 8$.",
        {
          wrong: [
            ["3", "Divide first: $6 \\div 2$."],
            ["6", "Work left to right: $10 - 3 + 1$."],
          ],
        },
      ),
      typed(
        "Your turn",
        "Work out $5 \\times 3^2 - \\sqrt{49}$",
        "38",
        "Powers and roots first.",
        "$45 - 7 = 38$.",
        { wrong: [["218", "Square 3 only, then times 5."]] },
      ),
      choose(
        "Watch out",
        "Ivy types $\\dfrac{12 + 8}{4}$ as 12 + 8 ÷ 4 and gets 14. What's wrong?",
        "The fraction line groups the top: type (12 + 8) ÷ 4 = 5",
        "Use brackets for a whole top or bottom.",
        [["Nothing", "Without brackets, only 8 is divided."]],
      ),
      mistake(
        "Tom works out $2 \\times 3^2$.",
        ["$2 \\times 3 = 6$", "$6^2 = 36$", "Answer: 36"],
        0,
        "Powers first: $3^2 = 9$, then $2 \\times 9 = 18$.",
      ),
      choose(
        "Back to the problem",
        "“Work out $3 + 4 \\times 2^2$.” Which pupil is right?",
        "19",
        "Power, then multiply, then add: $3 + 16$.",
        [
          ["28", "That adds first: $7 \\times 4$."],
          ["67", "Only the 2 is squared."],
        ],
      ),
      quiz([
        [
          ["$6 + 4 \\times 3$", "18", ["30", "13"], "× first."],
          ["$9 - 2 \\times 4$", "1", ["28", "−1"], "× first."],
        ],
        [
          ["$(5 - 2)^2 + 1$", "10", ["8", "26"], "Brackets, power, add."],
          ["$(1 + 2)^3 - 7$", "20", ["2", "−6"], "Brackets, power, subtract."],
        ],
        [
          ["Reciprocal of 5", "$\\frac15$", ["−5", "0.5"], "$1 \\div 5$."],
          ["Reciprocal of $\\frac{1}{10}$", "10", ["0.1", "$-\\frac{1}{10}$"], "Flip it."],
        ],
      ]),
    ],
  ),
];
