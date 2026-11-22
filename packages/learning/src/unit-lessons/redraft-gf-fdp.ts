// GCSE Foundation, "Fractions, decimals and percentages", on the stepped template
// (docs/proposals/lesson-stepped.md): decimals as fractions on a hundred square, fractions of
// amounts on a bar, and percentages built up or done with a multiplier.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfFdp } from "./gf-fdp.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const FDP = gfFdp;
const NUMBER = "A number check: the numbers are the picture.";
const hundred = (shaded: number): Picture => ({ kind: "grid", cols: 10, rows: 10, shaded });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });

// ---------------------------------------------------------------------------------------------
// Decimals and fractions.

const DECIMALS = "gf-fdp/decimals-fractions";
const decMethod = [
  "Count the decimal places: tenths, hundredths, thousandths.",
  "Write it over 10, 100 or 1000.",
  "Simplify. Going back: make the denominator 100.",
];
const FIFTEEN = hundred(15);

const decimals = stepped(find(FDP, DECIMALS), {
  method: decMethod,
  variation: {
    relationship: "a decimal and its fraction",
    unknowns: ["fraction"],
    surface: ["tenths", "hundredths", "thousandths"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Place value does the work",
        ["**The last decimal place gives the denominator; then simplify.**"],
        FIFTEEN,
        "0.15 is 15 hundredths: $\\frac{15}{100} = \\frac{3}{20}$.",
      ),
      reworded(FDP, DECIMALS, "0.45 as a fraction before simplifying", { tag: "The rule" }),

      ...owned(FDP, DECIMALS, "Warm-up", "Check you remember"),

      methodCard("The method", decMethod, FIFTEEN),
      workedFrom(FDP, DECIMALS),
      calc(
        "Your turn",
        "Write 0.85 as a fraction in its simplest form.",
        undefined,
        [
          ["Hundredths: $\\frac{?}{100}$, top =", "85", "Two decimal places."],
          ["Divide top and bottom by", "5", "85 = 5 × 17; 100 = 5 × 20."],
        ],
        "$\\frac{17}{20}$.",
      ),

      calc(
        "Practise",
        "Write $\\frac{13}{25}$ as a decimal.",
        undefined,
        [
          ["× 4: $\\frac{?}{100}$, top =", "52", "13 × 4."],
          ["As a decimal:", "0.52", "52 hundredths."],
        ],
        "0.52.",
      ),
      ...owned(FDP, DECIMALS, "Together", "Practise"),
      ...owned(FDP, DECIMALS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "As a fraction, in its simplest form. Watch what changes.",
        [
          pick("0.5", "$\\frac12$", ["$\\frac15$", "$\\frac{5}{100}$"], "5 tenths.", {
            asks: "fraction",
            picture: hundred(50),
          }),
          pick("0.05", "$\\frac{1}{20}$", ["$\\frac12$", "$\\frac15$"], "5 hundredths.", {
            asks: "fraction",
            changed: "Hundredths.",
            picture: hundred(5),
          }),
          pick(
            "0.55",
            "$\\frac{11}{20}$",
            ["$\\frac{55}{10}$", "$\\frac{5}{11}$"],
            "55 hundredths.",
            {
              asks: "fraction",
              changed: "Both places.",
              picture: hundred(55),
            },
          ),
          pick(
            "0.505",
            "$\\frac{101}{200}$",
            ["$\\frac{505}{100}$", "$\\frac12$"],
            "505 thousandths.",
            {
              asks: "fraction",
              changed: "Thousandths.",
            },
          ),
        ],
        "The last place names the denominator.",
      ),

      questionSet(
        "Variation",
        "As a fraction, in its simplest form. Watch what changes.",
        [
          pick("0.125", "$\\frac18$", ["$\\frac54$", "$\\frac{1}{125}$"], "125 thousandths.", {
            asks: "fraction",
            expect: [
              "Ivo writes 0.125 as $\\frac{125}{100}$. Right?",
              "No",
              "Three places: thousandths, so $\\frac{125}{1000}$.",
              [["Yes", "Count the decimal places."]],
            ],
          }),
          pick("0.25", "$\\frac14$", ["$\\frac{25}{10}$", "$\\frac{2}{5}$"], "25 hundredths.", {
            asks: "fraction",
            changed: "Two places.",
          }),
          pick(
            "0.625",
            "$\\frac58$",
            ["$\\frac{625}{100}$", "$\\frac{6}{25}$"],
            "625 thousandths.",
            {
              asks: "fraction",
              changed: "Five eighths.",
            },
          ),
          pick("0.2", "$\\frac15$", ["$\\frac12$", "$\\frac{2}{100}$"], "2 tenths.", {
            asks: "fraction",
            changed: "One place.",
          }),
        ],
        "Tenths, hundredths or thousandths: count the places.",
      ),
      own(FDP, DECIMALS, "Spot the mistake"),

      own(FDP, DECIMALS, "Exit check"),

      reworded(
        FDP,
        DECIMALS,
        "“Write 0.375 as a fraction in its simplest form.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The last decimal place gives the denominator; then simplify.**"],
        FIFTEEN,
        [
          "**The last decimal place gives the denominator; then simplify.**",
          "0.07 is $\\frac{7}{100}$, not $\\frac{7}{10}$.",
          "$\\frac{7}{20} = \\frac{35}{100} = 0.35$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Fractions of amounts.

const FRACTION_OF = "gf-fdp/fraction-of";
const fracMethod = [
  "Divide by the bottom: one part.",
  "Multiply by the top: the parts you want.",
  "Backwards: divide by the top, then times by the bottom.",
];
const BAR: Picture = {
  kind: "bars",
  rows: [{ label: "£40", parts: 5, shaded: 2, each: "£8" }],
};

const fractionOf = stepped(find(FDP, FRACTION_OF), {
  method: fracMethod,
  variation: {
    relationship: "a fraction, its amount and the whole",
    unknowns: ["part", "whole"],
    surface: ["more parts", "working backwards", "different amounts"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A fraction of an amount",
        ["**Divide by the bottom, multiply by the top.**"],
        BAR,
        "One fifth of £40 is £8, so two fifths is £16.",
      ),
      reworded(FDP, FRACTION_OF, "$\\frac37$ of 56 is", { tag: "The rule" }),

      ...owned(FDP, FRACTION_OF, "Warm-up", "Check you remember"),

      methodCard("The method", fracMethod, BAR),
      workedFrom(FDP, FRACTION_OF),
      calc(
        "Your turn",
        "Find $\\frac34$ of 36.",
        undefined,
        [
          ["One quarter:", "9", "36 ÷ 4."],
          ["Three quarters:", "27", "9 × 3."],
        ],
        "27.",
      ),

      calc(
        "Practise",
        "$\\frac25$ of a number is 14. Find the number.",
        undefined,
        [
          ["One fifth:", "7", "14 ÷ 2."],
          ["The number:", "35", "7 × 5."],
        ],
        "35.",
      ),
      ...owned(FDP, FRACTION_OF, "Together", "Practise"),
      ...owned(FDP, FRACTION_OF, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("$\\frac14$ of 60", "15", "60 ÷ 4.", "15.", { asks: "part" }),
          ask("$\\frac34$ of 60", "45", "15 × 3.", "45.", {
            asks: "part",
            changed: "Three parts.",
          }),
          ask("$\\frac34$ of a number is 45. The number?", "60", "45 ÷ 3 × 4.", "60.", {
            asks: "whole",
            changed: "Backwards.",
          }),
          ask("$\\frac35$ of 60", "36", "60 ÷ 5 × 3.", "36.", { asks: "part", changed: "Fifths." }),
        ],
        "Divide by the bottom, times by the top.",
      ),

      questionSet(
        "Variation",
        "Part or whole? Watch what changes.",
        [
          ask("$\\frac34$ of 120", "90", "120 ÷ 4 × 3.", "90.", {
            asks: "part",
            expect: [
              "Ned says $\\frac34$ of 120 is 120. Right?",
              "No",
              "÷ 4, then × 3, not × 4: 90.",
              [["Yes", "How many quarters do you want?"]],
            ],
          }),
          ask("$\\frac34$ of a number is 120. The number?", "160", "120 ÷ 3 × 4.", "160.", {
            asks: "whole",
            changed: "Backwards.",
          }),
          ask("$\\frac14$ of a number is 120. The number?", "480", "120 × 4.", "480.", {
            asks: "whole",
            changed: "One quarter.",
          }),
          ask("$\\frac34$ of 12", "9", "12 ÷ 4 × 3.", "9.", {
            asks: "part",
            changed: "A smaller amount.",
          }),
        ],
        "Is the number you know the part or the whole?",
      ),
      own(FDP, FRACTION_OF, "Spot the mistake"),

      own(FDP, FRACTION_OF, "Exit check"),

      reworded(
        FDP,
        FRACTION_OF,
        "“Sam spent $\\frac34$ of her savings, which was £60. How much were her savings?”",
        { tag: "Real life", title: "Sam spent $\\frac34$ of her savings: £60. Her savings?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Divide by the bottom, multiply by the top.**"],
        BAR,
        [
          "**Divide by the bottom, multiply by the top.**",
          "Backwards: $\\frac34$ is £60, so $\\frac14$ is £20 and the whole is £80.",
          "Check which number is the part.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Percentages as multipliers.

const PERCENT = "gf-fdp/percent-of";
const pctMethod = [
  "No calculator: build from 10%, 5% and 1%.",
  "Calculator: write the multiplier.",
  "Increase: 1 + the percent. Decrease: 1 − the percent.",
];
const MULTIPLIERS: Picture = {
  kind: "table",
  head: ["Change", "Multiplier"],
  rows: [
    ["15% of", "0.15"],
    ["15% up", "1.15"],
    ["15% off", "0.85"],
  ],
};

const percentOf = stepped(find(FDP, PERCENT), {
  method: pctMethod,
  variation: {
    relationship: "a percentage change and its multiplier",
    unknowns: ["multiplier", "amount"],
    surface: ["increases", "decreases", "decimal percents"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two ways",
        ["**Build from 10%, 5% and 1%, or use a multiplier.**"],
        MULTIPLIERS,
        "15% up: 100% + 15% = 115%, so × 1.15.",
      ),
      reworded(FDP, PERCENT, "The multiplier for a 12% increase is", { tag: "The rule" }),

      ...owned(FDP, PERCENT, "Warm-up", "Check you remember"),

      methodCard("The method", pctMethod, MULTIPLIERS),
      workedFrom(FDP, PERCENT),
      calc(
        "Your turn",
        "Find 35% of £60 without a calculator.",
        undefined,
        [
          ["30%:", "18", "3 × 10%."],
          ["5%:", "3", "Half of 10%."],
          ["35%:", "21", "Add them."],
        ],
        "£21.",
      ),

      calc(
        "Practise",
        "Decrease £240 by 15% with a multiplier.",
        undefined,
        [
          ["Multiplier:", "0.85", "100% − 15%."],
          ["$240 \\times 0.85 =$", "204", "Use a calculator."],
        ],
        "£204.",
      ),
      ...owned(FDP, PERCENT, "Together", "Practise"),
      ...owned(FDP, PERCENT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The multiplier? Watch what changes.",
        [
          pick("Increase by 20%", "1.2", ["0.2", "0.8"], "120%.", { asks: "multiplier" }),
          pick("Decrease by 20%", "0.8", ["1.2", "0.2"], "80%.", {
            asks: "multiplier",
            changed: "Down.",
          }),
          pick("Increase by 2%", "1.02", ["1.2", "0.02"], "102%.", {
            asks: "multiplier",
            changed: "A smaller percent.",
          }),
          pick("Decrease by 2.5%", "0.975", ["0.75", "1.025"], "97.5%.", {
            asks: "multiplier",
            changed: "A decimal percent.",
          }),
        ],
        "Start from 100%.",
      ),

      questionSet(
        "Variation",
        "Find it. Watch what changes.",
        [
          ask("45% of 80", "36", "40% + 5%.", "36.", {
            asks: "amount",
            expect: [
              "For 45%, Leo works out 40% − 5%. Right?",
              "No",
              "45% = 40% + 5%: 32 + 4 = 36.",
              [["Yes", "Is 45 more or less than 40?"]],
            ],
          }),
          ask("55% of 80", "44", "50% + 5%.", "44.", { asks: "amount", changed: "50% + 5%." }),
          ask("95% of 80", "76", "100% − 5%.", "76.", { asks: "amount", changed: "100% − 5%." }),
          ask("Increase 80 by 45%", "116", "80 + 36.", "116.", {
            asks: "amount",
            changed: "An increase.",
          }),
        ],
        "Build the percent from parts you know.",
      ),
      own(FDP, PERCENT, "Spot the mistake"),

      own(FDP, PERCENT, "Exit check"),

      reworded(
        FDP,
        PERCENT,
        "“A wage of £420 a week rises by 3%. Work out the new wage.”",
        { tag: "Real life", title: "£420 a week rises by 3%. The new wage?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Build from 10%, 5% and 1%, or use a multiplier.**"],
        MULTIPLIERS,
        [
          "**Build from 10%, 5% and 1%, or use a multiplier.**",
          "5% up is × 1.05, not × 1.5.",
          "45% = 40% + 5%.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

export const gfFdpStepped: [string, UnitLesson[]][] = [
  [DECIMALS, [decimals]],
  [FRACTION_OF, [fractionOf]],
  [PERCENT, [percentOf]],
];
