// GCSE Foundation, "Fractions, decimals and percentages", as three short lessons, one just before
// each skill: terminating decimals and fractions, fractions as operators, and percentages as
// operators and multipliers. Each recaps the Key Stage 3 idea quickly, builds it to GCSE level,
// names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-fdp";

export const gfFdp: UnitLesson[] = [
  lesson(
    U,
    "decimals-fractions",
    "GF-N10",
    "Decimals and fractions",
    "Turn terminating decimals into fractions and back, in simplest form.",
    [
      problem("The exam question", [
        "“Write 0.375 as a fraction in its simplest form.” And “write $\\frac{7}{20}$ as a decimal.”",
        "By the end of this lesson, you can switch either way without a calculator.",
      ]),
      typed("Warm-up", "Write 0.3 as a fraction", "3/10", "Tenths.", "$\\frac{3}{10}$."),
      choose(
        "Warm-up",
        "Simplify $\\frac{25}{100}$",
        "$\\frac14$",
        "Divide top and bottom by 25.",
        [
          ["$\\frac{5}{20}$", "Not simplest: divide by 5 again."],
          ["$\\frac{1}{5}$", "$25 \\times 4 = 100$."],
        ],
      ),
      explain(
        "Discover",
        "Place value does the work",
        [
          "The last decimal place tells you the denominator: 0.375 ends in **thousandths**, so it's $\\frac{375}{1000}$. Then simplify.",
          "Going back, make the denominator 10, 100 or 1000: $\\frac{7}{20} = \\frac{35}{100} = 0.35$. Or divide the top by the bottom.",
        ],
        { kind: "maths", tex: "0.375 = \\frac{375}{1000} = \\frac38" },
      ),
      choose(
        "Discover",
        "0.45 as a fraction before simplifying",
        "$\\frac{45}{100}$",
        "Two decimal places: hundredths.",
        [
          ["$\\frac{45}{10}$", "That's 4.5."],
          ["$\\frac{4}{5}$", "That's 0.8."],
        ],
      ),
      worked(
        "0.375",
        "Write 0.375 as a fraction in its simplest form.",
        [
          ["$\\frac{375}{1000}$", "Thousandths."],
          ["$\\div 5$: $\\frac{75}{200}$; $\\div 25$: $\\frac{3}{8}$", "Simplify fully."],
        ],
        "$\\frac38$. Check: $3 \\div 8 = 0.375$ ✓",
      ),
      steps(
        "Together",
        "Write $\\frac{7}{20}$ as a decimal",
        "Make the denominator 100.",
        [
          [
            "$20 \\times 5 = 100$, so",
            "$\\frac{35}{100}$",
            ["$\\frac{7}{100}$", "Multiply the top by 5 too."],
            "$\\frac{35}{100}$",
          ],
          ["As a decimal:", "0.35", ["3.5", "35 hundredths."], "0.35"],
        ],
        "Or $7 \\div 20 = 0.35$.",
      ),
      choose(
        "Together",
        "Which fraction gives a terminating decimal?",
        "$\\frac{3}{40}$",
        "40 = $2^3 \\times 5$: only 2s and 5s.",
        [
          ["$\\frac{1}{3}$", "0.333… recurs."],
          ["$\\frac{2}{7}$", "Sevenths recur."],
        ],
      ),
      choose(
        "Your turn",
        "0.64 in simplest form",
        "$\\frac{16}{25}$",
        "$\\frac{64}{100}$, divide by 4.",
        [
          ["$\\frac{32}{50}$", "Not simplest."],
          ["$\\frac{64}{10}$", "Hundredths."],
        ],
      ),
      typed("Your turn", "$\\frac{3}{8}$ as a decimal", "0.375", "$3 \\div 8$.", "0.375.", {
        wrong: [["0.38", "Exact: 0.375."]],
      }),
      choose(
        "Watch out",
        "Ben writes 0.07 as $\\frac{7}{10}$. What's wrong?",
        "The 7 is in the hundredths: $\\frac{7}{100}$",
        "Count the decimal places.",
        [["Nothing", "$\\frac{7}{10} = 0.7$."]],
      ),
      mistake(
        "Ella converts 0.125.",
        ["$0.125 = \\frac{125}{100}$", "Divide by 25: $\\frac{5}{4}$", "So $\\frac54$"],
        0,
        "Three decimal places: $\\frac{125}{1000} = \\frac18$.",
      ),
      choose(
        "Back to the problem",
        "“Write 0.375 as a fraction in its simplest form.”",
        "$\\frac38$",
        "$\\frac{375}{1000}$ simplified.",
        [
          ["$\\frac{375}{1000}$", "Simplify fully."],
          ["$\\frac{3}{75}$", "Divide top and bottom by the same number."],
        ],
      ),
      quiz([
        [
          [
            "0.6 as a fraction",
            "$\\frac35$",
            ["$\\frac{6}{100}$", "$\\frac16$"],
            "$\\frac{6}{10}$.",
          ],
          [
            "0.8 as a fraction",
            "$\\frac45$",
            ["$\\frac{8}{100}$", "$\\frac18$"],
            "$\\frac{8}{10}$.",
          ],
        ],
        [
          ["$\\frac{9}{25}$ as a decimal", "0.36", ["0.925", "2.78"], "$\\frac{36}{100}$."],
          ["$\\frac{11}{20}$ as a decimal", "0.55", ["0.1120", "1.82"], "$\\frac{55}{100}$."],
        ],
        [
          [
            "0.025 as a fraction",
            "$\\frac{1}{40}$",
            ["$\\frac{1}{4}$", "$\\frac{25}{100}$"],
            "$\\frac{25}{1000}$.",
          ],
          [
            "0.075 as a fraction",
            "$\\frac{3}{40}$",
            ["$\\frac{3}{4}$", "$\\frac{75}{100}$"],
            "$\\frac{75}{1000}$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "fraction-of",
    "GF-N12.a",
    "Fractions of amounts",
    "Divide by the bottom, multiply by the top; and work backwards.",
    [
      problem(
        "The sale and the savings",
        [
          "A coat is $\\frac25$ off £85. And Sam has spent $\\frac34$ of her savings: £60. How much did she start with?",
          "By the end of this lesson, you can find fractions of amounts, and the whole from a part.",
        ],
        {
          kind: "bars",
          rows: [{ label: "Savings", parts: 4, shaded: 3, each: "£20" }],
          total: "?",
        },
      ),
      typed("Warm-up", "Work out $85 \\div 5$", "17", "Fives in 85.", "17."),
      typed("Warm-up", "Work out $17 \\times 2$", "34", "Double.", "34."),
      explain(
        "Discover",
        "A fraction as an operator",
        [
          "To find $\\frac25$ of an amount: divide by 5 (one fifth), then multiply by 2 (two fifths). It's the same as $\\times \\frac25$.",
          "To go back from a part: if $\\frac34$ is £60, one quarter is £20, so the whole is £80.",
        ],
        { kind: "bars", rows: [{ label: "£85", parts: 5, shaded: 2, each: "£17" }] },
      ),
      choose("Discover", "$\\frac37$ of 56 is", "24", "$56 \\div 7 \\times 3$.", [
        ["8", "That's one seventh."],
        ["130.7", "Divide by 7, times by 3."],
      ]),
      worked(
        "The coat",
        "$\\frac25$ off £85. Find the sale price.",
        [
          ["$\\frac15$ of 85 = 17", "Divide by 5."],
          ["$\\frac25$ = 34", "Times 2: the discount."],
          ["$85 - 34 = £51$", "Or find $\\frac35$ directly."],
        ],
        "The sale price is £51.",
      ),
      steps(
        "Together",
        "$\\frac34$ of the savings is £60",
        "Find the whole.",
        [
          ["One quarter is", "£20", ["£45", "$60 \\div 3$."], "£20"],
          ["The whole (four quarters):", "£80", ["£15", "$20 \\times 4$."], "£80"],
        ],
        "Check: $\\frac34$ of 80 is 60 ✓",
      ),
      choose(
        "Together",
        "$\\frac23$ of a number is 18. The number?",
        "27",
        "$\\frac13$ is 9; times 3.",
        [
          ["12", "That's $\\frac23$ of 18."],
          ["36", "$\\frac13$ is 9, not 12."],
        ],
      ),
      typed("Your turn", "Find $\\frac58$ of 72", "45", "$72 \\div 8 = 9$; $9 \\times 5$.", "45.", {
        wrong: [["9", "That's one eighth."]],
      }),
      typed(
        "Your turn",
        "$\\frac35$ of a number is 42. Find the number",
        "70",
        "$\\frac15$ is 14.",
        "70.",
        { wrong: [["25.2", "That's $\\frac35$ of 42."]] },
      ),
      choose(
        "Watch out",
        "$\\frac23$ of a number is 18. Ana works out $\\frac23$ of 18 = 12. What's wrong?",
        "18 is the part, not the whole: work backwards to 27",
        "Read whether you know the part or the whole.",
        [["Nothing", "Check: $\\frac23$ of 12 is 8, not 18."]],
      ),
      mistake(
        "Kai finds $\\frac34$ of 120.",
        ["$120 \\div 4 = 30$", "$30 \\times 4 = 120$", "So $\\frac34$ of 120 = 120"],
        1,
        "Multiply by the top, 3: $30 \\times 3 = 90$.",
      ),
      choose(
        "Back to the problem",
        "“Sam spent $\\frac34$ of her savings, which was £60. How much were her savings?”",
        "£80",
        "Quarter £20, whole £80.",
        [
          ["£45", "That's $\\frac34$ of 60."],
          ["£240", "$60 \\div 3 \\times 4$."],
        ],
      ),
      quiz([
        [
          ["$\\frac34$ of 48", "36", ["12", "64"], "$12 \\times 3$."],
          ["$\\frac25$ of 65", "26", ["13", "162.5"], "$13 \\times 2$."],
        ],
        [
          ["$\\frac14$ of a number is 9. Number?", "36", ["2.25", "13"], "$9 \\times 4$."],
          ["$\\frac15$ of a number is 7. Number?", "35", ["1.4", "12"], "$7 \\times 5$."],
        ],
        [
          ["$\\frac37$ of a number is 21. Number?", "49", ["9", "63"], "$\\frac17$ is 7."],
          ["$\\frac56$ of a number is 40. Number?", "48", ["33.3", "240"], "$\\frac16$ is 8."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "percent-of",
    "GF-N12.b",
    "Percentages as multipliers",
    "Find a percentage of an amount with one multiplication.",
    [
      problem("Pay rise", [
        "A wage of £420 a week rises by 3%. A £68 jacket is 35% off. The exam says “Show your working.”",
        "By the end of this lesson, you can do both, with and without a calculator.",
      ]),
      typed("Warm-up", "10% of 420", "42", "Divide by 10.", "42."),
      typed("Warm-up", "1% of 420", "4.2", "Divide by 100.", "4.2."),
      explain(
        "Discover",
        "Two ways",
        [
          "**Without a calculator**, build from 10%, 5% and 1%: 35% = 10% + 10% + 10% + 5%.",
          "**With a calculator**, use a multiplier: 35% of $x$ is $0.35x$; after a 35% decrease you have $0.65x$; after a 3% increase, $1.03x$.",
        ],
        {
          kind: "table",
          head: ["Change", "Multiplier"],
          rows: [
            ["35% of", "0.35"],
            ["35% off", "0.65"],
            ["3% up", "1.03"],
          ],
        },
      ),
      choose("Discover", "The multiplier for a 12% increase is", "1.12", "100% + 12% = 112%.", [
        ["0.12", "That's 12% of."],
        ["1.2", "That's a 20% increase."],
      ]),
      worked(
        "The jacket",
        "Find 35% of £68 without a calculator.",
        [
          ["10% = 6.80, so 30% = 20.40", "Three lots."],
          ["5% = 3.40", "Half of 10%."],
          ["35% = 20.40 + 3.40 = £23.80", "Add."],
        ],
        "Sale price: $68 - 23.80 = £44.20$, or $68 \\times 0.65$.",
      ),
      steps(
        "Together",
        "Increase £420 by 3%",
        "Use a multiplier.",
        [
          ["Multiplier:", "1.03", ["0.03", "That's only the rise."], "$420 \\times 1.03$"],
          ["New wage:", "£432.60", ["£12.60", "That's the rise."], "£432.60"],
        ],
        "One multiplication does it.",
      ),
      choose("Together", "Decrease 250 by 16%", "210", "$250 \\times 0.84$.", [
        ["40", "That's the decrease."],
        ["290", "That's an increase."],
      ]),
      typed(
        "Your turn",
        "Find 15% of 260 without a calculator",
        "39",
        "10% + 5%: 26 + 13.",
        "39.",
        { wrong: [["26", "Add 5% too."]] },
      ),
      typed("Your turn", "Increase 80 by 2.5%", "82", "$80 \\times 1.025$.", "82.", {
        wrong: [["2", "That's the increase."]],
      }),
      choose(
        "Watch out",
        "For a 5% increase, Jo multiplies by 1.5. What's wrong?",
        "1.5 is a 50% increase: use 1.05",
        "5% is 0.05.",
        [["Nothing", "1.5 means 150%."]],
      ),
      mistake(
        "Raj finds 45% of 80.",
        ["10% = 8, so 40% = 32", "5% = 4", "45% = 32 − 4 = 28"],
        2,
        "Add the 5%: $32 + 4 = 36$.",
      ),
      choose(
        "Back to the problem",
        "“A wage of £420 a week rises by 3%. Work out the new wage.”",
        "£432.60",
        "$420 \\times 1.03$.",
        [
          ["£423", "3% of 420 is 12.60, not 3."],
          ["£12.60", "Add the rise."],
        ],
      ),
      quiz([
        [
          ["20% of 150", "30", ["7.5", "120"], "$0.2 \\times 150$."],
          ["30% of 90", "27", ["3", "63"], "$0.3 \\times 90$."],
        ],
        [
          ["Multiplier for 8% decrease", "0.92", ["0.08", "1.08"], "92%."],
          ["Multiplier for 40% decrease", "0.6", ["0.4", "1.4"], "60%."],
        ],
        [
          ["Increase 200 by 15%", "230", ["30", "215"], "$200 \\times 1.15$."],
          ["Decrease 300 by 25%", "225", ["75", "275"], "$300 \\times 0.75$."],
        ],
      ]),
    ],
  ),
];
