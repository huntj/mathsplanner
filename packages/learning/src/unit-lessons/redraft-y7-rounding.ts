// Year 7, "Rounding and estimating", on the stepped template (docs/proposals/lesson-stepped.md):
// rounding to decimal places, to significant figures, estimating, and error intervals. Each starts
// from the rule on a number line, with a number to slide and watch round.
import {
  ask,
  calc,
  choose,
  explain,
  explore,
  methodCard,
  questionSet,
  quiz,
  summary,
  typed,
  worked,
} from "./build.ts";
import { find, numberLine, own, reworded, stepped, tagged, words } from "./stepped.ts";
import type { Picture, Screen, UnitLesson } from "./types.ts";
import { y7Rounding } from "./y7-rounding.ts";

const NUMBER = "A number check: there is nothing to draw.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });

// ---------------------------------------------------------------------------------------------
// Rounding to decimal places.

const DP = "y7-rounding/decimal-places";
const dpMethod = [
  "Draw a line after the places you need.",
  "Look at the next digit.",
  "5 or more: round up. Less than 5: keep it.",
  "Keep every place, even a 0 at the end.",
];

const decimalPlaces = stepped(find(y7Rounding, DP), {
  method: dpMethod,
  variation: {
    relationship: "a number and the number it rounds to",
    unknowns: ["1 dp", "2 dp", "whole number"],
    surface: ["the next digit", "a 5", "a carry", "small numbers", "money"],
  },
  screens: [
    explain(
      "The rule",
      "Rounding to decimal places",
      ["**Look at the next digit: 5 or more rounds up.**"],
      numberLine(3.4, 3.5, 0.01, [[3.47, "3.47"]], { every: 5 }),
      "3.47 is nearer 3.5 than 3.4.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: 3.4,
          max: 3.5,
          step: 0.01,
          start: 3.42,
          tick: 0.01,
          every: 5,
          dp: 2,
          readouts: [
            { label: "To 1 decimal place", round: 1 },
            { label: "The number", value: true },
          ],
          markFirst: true,
        },
        [
          "What did you notice?",
          "From 3.45 up, it rounds to 3.5",
          "The next digit decides: 5 or more rounds up.",
          [
            ["It always rounds down", "Slide past 3.45 and look again."],
            ["Only 3.49 rounds up", "Try 3.45, 3.46 and 3.47 too."],
          ],
        ],
        "The next digit decides. 5 or more rounds up.",
        { text: "Slide the number. The ring shows what it rounds to." },
      ),
    ),

    typed(
      "Check you remember",
      "Round 47 to the nearest 10.",
      "50",
      "Is it nearer 40 or 50?",
      "50.",
      {
        picture: numberLine(40, 50, 1, [[47, "47"]], { every: 5 }),
      },
    ),
    typed(
      "Check you remember",
      "Round 3.6 to the nearest whole number.",
      "4",
      "Is it nearer 3 or 4?",
      "4.",
      { picture: numberLine(3, 4, 0.1, [[3.6, "3.6"]], { every: 5 }) },
    ),
    choose(
      "Check you remember",
      "Which digit is in the hundredths column?",
      "7",
      "Tenths, then hundredths: 3.4**7**2.",
      [
        ["4", "4 is in the tenths column."],
        ["2", "2 is in the thousandths column."],
      ],
      { picture: { kind: "place-value", number: "3.472", from: 0, to: -3 } },
    ),

    methodCard("The method", dpMethod, maths("3.4\\,|\\,72 \\approx 3.5")),
    worked(
      "Watch the method",
      "Round 3.4728 to 2 decimal places.",
      [
        { line: "$3.47\\,|\\,28$", note: "Draw a line after two decimal places." },
        { line: "The next digit is 2: less than 5." },
        { line: "$3.4728 \\approx 3.47$", note: "Less than 5, so the 7 stays." },
      ],
      "3.47, to 2 decimal places.",
    ),
    words(
      calc(
        "Your turn",
        "Round 5.247 to 2 decimal places.",
        undefined,
        [
          ["The next digit is", "7", "Draw the line after 5.24. What comes next?"],
          ["$5.247 \\approx$", "5.25", "7 is 5 or more: the 4 goes up."],
        ],
        "5.25, to 2 decimal places.",
      ),
      NUMBER,
    ),

    words(
      calc(
        "Practise",
        "Round 12.951 to 1 decimal place.",
        undefined,
        [
          ["The next digit is", "5", "Draw the line after 12.9. What comes next?"],
          ["$12.951 \\approx$", "13.0", "The 9 goes up: carry, like 129 + 1 = 130."],
        ],
        "13.0: keep the 0, as it shows 1 decimal place.",
      ),
      NUMBER,
    ),
    questionSet(
      "Practise",
      "Round 4.738. Watch what changes.",
      [
        ask("Round 4.738 to 1 decimal place.", "4.7", "4.7|38: the next digit is 3.", "4.7.", {
          asks: "1 dp",
          picture: numberLine(4.7, 4.8, 0.01, [[4.738, "4.738"]], { every: 5 }),
        }),
        ask("Round 4.738 to 2 decimal places.", "4.74", "4.73|8: the next digit is 8.", "4.74.", {
          asks: "2 dp",
          changed: "Now to 2 decimal places.",
          picture: numberLine(4.73, 4.74, 0.001, [[4.738, "4.738"]], { every: 5 }),
        }),
        ask("Round 4.738 to the nearest whole number.", "5", "4|738: the next digit is 7.", "5.", {
          asks: "whole number",
          changed: "Now to the nearest whole number.",
          picture: numberLine(4, 5, 0.1, [[4.738, "4.738"]], { every: 5 }),
        }),
        ask("Round 0.0385 to 2 decimal places.", "0.04", "0.03|85: the next digit is 8.", "0.04.", {
          asks: "2 dp",
          changed: "A small number, with a 0 first.",
          picture: numberLine(0.03, 0.04, 0.001, [[0.0385, "0.0385"]], { every: 5 }),
        }),
      ],
      "Draw the line where you're asked, then look at the next digit.",
    ),

    questionSet(
      "Variation",
      "Round each to 1 decimal place. Watch what changes.",
      [
        ask("Round 2.83 to 1 decimal place.", "2.8", "2.8|3: 3 is less than 5.", "2.8.", {
          asks: "1 dp",
        }),
        ask("Round 2.86 to 1 decimal place.", "2.9", "2.8|6: 6 is 5 or more.", "2.9.", {
          asks: "1 dp",
          changed: "The next digit is now 6.",
        }),
        ask(
          "Round 2.85 to 1 decimal place.",
          "2.9",
          "5 or more rounds up.",
          "2.9: a 5 rounds up.",
          {
            asks: "1 dp",
            changed: "The next digit is exactly 5.",
            expect: [
              "The next digit is exactly 5. It rounds…",
              "up, to 2.9",
              "5 or more rounds up.",
              [["down, to 2.8", "5 counts as rounding up."]],
            ],
          },
        ),
        ask("Round 7.96 to 1 decimal place.", "8.0", "The 9 goes up to 10: carry.", "8.0.", {
          asks: "1 dp",
          changed: "Rounding up makes a carry.",
          expect: [
            "The 9 goes up by 1. 7.96 rounds to…",
            "8.0",
            "9 + 1 is 10: carry into the ones, like 79 + 1 = 80.",
            [["7.10", "That's less than 7.96. Carry the 1."]],
          ],
        }),
        ask(
          "Round 3.149 to 1 decimal place.",
          "3.1",
          "3.1|49: only the next digit counts.",
          "3.1.",
          {
            asks: "1 dp",
            changed: "More digits after: only the next one counts.",
          },
        ),
      ],
      "Only the next digit decides, and a 9 that goes up carries.",
    ),
    own(y7Rounding, DP, "Spot the mistake"),

    quiz([
      [
        [
          "Round 4.73 to 1 decimal place.",
          "4.7",
          ["4.8", "5"],
          "3 rounds down.",
          undefined,
          "1 dp",
        ],
        ["Round 8.46 to 1 decimal place.", "8.5", ["8.4", "8"], "6 rounds up.", undefined, "1 dp"],
      ],
      [
        [
          "Round 2.996 to 2 decimal places.",
          "3.00",
          ["2.10", "2.99"],
          "Round up and carry.",
          undefined,
          "2 dp",
        ],
        [
          "Round 0.395 to 2 decimal places.",
          "0.40",
          ["0.39", "0.310"],
          "Round up and carry.",
          undefined,
          "2 dp",
        ],
      ],
      [
        [
          "Round 15.555 to the nearest whole number.",
          "16",
          ["15", "15.6"],
          "The next digit is 5.",
          undefined,
          "whole number",
        ],
        [
          "Round 6.249 to the nearest whole number.",
          "6",
          ["7", "6.2"],
          "The next digit is 2.",
          undefined,
          "whole number",
        ],
      ],
    ]),

    reworded(
      y7Rounding,
      DP,
      "A long display",
      {
        tag: "Real life",
        text: "£20 is split 3 ways. Round each share to the nearest penny (2 dp).",
        picture: maths("20 \\div 3 = 6.666666667"),
      },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Look at the next digit: 5 or more rounds up.**"],
      numberLine(3.4, 3.5, 0.01, [[3.47, "3.47"]], { every: 5 }),
      [
        "**Look at the next digit: 5 or more rounds up.**",
        "Draw a line after the places you need.",
        "Look at the next digit. 5 or more: round up.",
        "$3.47\\,|\\,28 \\approx 3.47$ (2 dp)",
        "$7.9\\,|\\,6 \\approx 8.0$ (1 dp)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Significant figures.

const SF = "y7-rounding/significant-figures";
const sfMethod = [
  "Find the first digit that isn't 0.",
  "Count the figures you need from there.",
  "Look at the next digit, and round.",
  "Fill with zeros up to the point.",
];

const significantFigures = stepped(find(y7Rounding, SF), {
  method: sfMethod,
  variation: {
    relationship: "a number and the number it rounds to",
    unknowns: ["1 s.f.", "2 s.f.", "3 s.f."],
    surface: ["size", "small numbers", "a zero inside", "a carry", "a crowd"],
  },
  screens: [
    explain(
      "The rule",
      "Significant figures",
      ["**Count from the first digit that isn't 0.**"],
      { kind: "place-value", number: "37482", from: 4, to: 0, highlight: 4 },
      "Then fill with zeros, so the number stays the same size.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: 4000,
          max: 5000,
          step: 10,
          start: 4320,
          tick: 100,
          every: 5,
          dp: 0,
          readouts: [
            { label: "To 1 significant figure", sf: 1 },
            { label: "To 2 significant figures", sf: 2 },
          ],
          markFirst: true,
        },
        [
          "What did you notice?",
          "It rounds to 4000 or 5000: zeros keep its size",
          "1 significant figure keeps only the thousands, and zeros fill the rest.",
          [
            ["It rounds to 4 or 5", "4 is far smaller than 4320. Zeros keep the size."],
            ["It never changes", "Slide past 4500 and look again."],
          ],
        ],
        "Round at the first figure, then fill with zeros.",
        { text: "Slide the number. The ring shows what it rounds to." },
      ),
    ),

    typed(
      "Check you remember",
      "Round 37 482 to the nearest 10 000.",
      ["40000", "40,000", "40 000"],
      "Is it nearer 30 000 or 40 000?",
      "40 000.",
      { picture: numberLine(30000, 40000, 1000, [[37482, "37 482"]], { every: 5 }) },
    ),
    choose(
      "Check you remember",
      "Which is the first digit that isn't 0?",
      "5",
      "0.0**5**26: the zeros come first.",
      [
        ["0", "Look past the zeros."],
        ["2", "The 5 comes before the 2."],
      ],
      { picture: { kind: "place-value", number: "0.0526", from: 0, to: -4 } },
    ),
    typed(
      "Check you remember",
      "Round 0.68 to 1 decimal place.",
      "0.7",
      "0.6|8: the next digit is 8.",
      "0.7.",
      { picture: numberLine(0.6, 0.7, 0.01, [[0.68, "0.68"]], { every: 5 }) },
    ),

    methodCard("The method", sfMethod, maths("0.05\\,|\\,26 \\approx 0.05")),
    worked(
      "Watch the method",
      "Round 0.0526 to 2 significant figures.",
      [
        { line: "The first significant figure is the 5.", note: "Zeros before it don't count." },
        { line: "$0.052\\,|\\,6$", note: "Two figures: the 5 and the 2." },
        { line: "The next digit is 6: round up." },
        { line: "$0.0526 \\approx 0.053$" },
      ],
      "0.053, to 2 significant figures.",
    ),
    words(
      calc(
        "Your turn",
        "Round 8349 to 1 significant figure.",
        undefined,
        [
          ["The first significant figure is", "8", "The first digit that isn't 0."],
          ["The next digit is", "3", "The digit just after the 8."],
          ["$8349 \\approx$", "8000", "3 rounds down. Fill with zeros."],
        ],
        "8000: the zeros keep it the same size.",
      ),
      NUMBER,
    ),

    words(
      calc(
        "Practise",
        "Round 0.0749 to 2 significant figures.",
        undefined,
        [
          ["The two figures are 7 and", "4", "Start at the 7, the first digit that isn't 0."],
          ["The next digit is", "9", "The digit after 0.074."],
          ["$0.0749 \\approx$", "0.075", "9 rounds up: the 4 goes up."],
        ],
        "0.075, to 2 significant figures.",
      ),
      NUMBER,
    ),
    questionSet(
      "Practise",
      "Round 4671. Watch what changes.",
      [
        ask(
          "Round 4671 to 1 significant figure.",
          ["5000", "5,000", "5 000"],
          "4|671: the next digit is 6.",
          "5000.",
          {
            asks: "1 s.f.",
            picture: numberLine(4000, 5000, 100, [[4671, "4671"]], { every: 5 }),
          },
        ),
        ask(
          "Round 4671 to 2 significant figures.",
          ["4700", "4,700", "4 700"],
          "46|71: the next digit is 7.",
          "4700.",
          {
            asks: "2 s.f.",
            changed: "Now 2 significant figures.",
            picture: numberLine(4600, 4700, 10, [[4671, "4671"]], { every: 5 }),
          },
        ),
        ask(
          "Round 4671 to 3 significant figures.",
          ["4670", "4,670", "4 670"],
          "467|1: the next digit is 1.",
          "4670.",
          {
            asks: "3 s.f.",
            changed: "Now 3 significant figures.",
            picture: numberLine(4660, 4680, 1, [[4671, "4671"]], { every: 5 }),
          },
        ),
        ask(
          "Round 0.004671 to 2 significant figures.",
          "0.0047",
          "Start at the 4. 46|71.",
          "0.0047.",
          {
            asks: "2 s.f.",
            changed: "A small number: start at the first digit that isn't 0.",
          },
        ),
      ],
      "Start at the first digit that isn't 0, count, then round.",
    ),

    questionSet(
      "Variation",
      "Round each to 1 significant figure. Watch what changes.",
      [
        ask(
          "Round 6482 to 1 significant figure.",
          ["6000", "6,000", "6 000"],
          "6|482: 4 rounds down.",
          "6000.",
          {
            asks: "1 s.f.",
          },
        ),
        ask("Round 64.82 to 1 significant figure.", "60", "6|4.82: keep it the same size.", "60.", {
          asks: "1 s.f.",
          changed: "The same digits, but 100 times smaller.",
          expect: [
            "64.82 is 100 times smaller than 6482. It rounds to…",
            "60",
            "Rounding keeps the size: 64.82 is about 60.",
            [
              ["6", "6 is ten times too small."],
              ["6000", "That's the size of 6482."],
            ],
          ],
        }),
        ask("Round 0.6482 to 1 significant figure.", "0.6", "0.6|482: 4 rounds down.", "0.6.", {
          asks: "1 s.f.",
          changed: "Now it's less than 1.",
        }),
        ask(
          "Round 0.0307 to 1 significant figure.",
          "0.03",
          "Start at the 3. The next digit is 0.",
          "0.03.",
          {
            asks: "1 s.f.",
            changed: "A zero sits inside it.",
          },
        ),
        ask("Round 96 to 1 significant figure.", "100", "9|6: round up, and carry.", "100.", {
          asks: "1 s.f.",
          changed: "Rounding up makes a carry.",
          expect: [
            "96 rounds up from 90. It becomes…",
            "100",
            "9 tens and 1 more is 10 tens: 100.",
            [["91", "Rounding goes to 90 or 100, not 91."]],
          ],
        }),
      ],
      "Big or small, start at the first figure that isn't 0, and keep the size.",
    ),
    own(y7Rounding, SF, "Spot the mistake"),

    quiz([
      [
        [
          "Round 527 to 1 significant figure.",
          "500",
          ["5", "530"],
          "5|27: 2 rounds down.",
          undefined,
          "1 s.f.",
        ],
        [
          "Round 851 to 1 significant figure.",
          "900",
          ["9", "850"],
          "8|51: 5 rounds up.",
          undefined,
          "1 s.f.",
        ],
      ],
      [
        [
          "Round 0.0381 to 2 significant figures.",
          "0.038",
          ["0.04", "0.03"],
          "38|1: 1 rounds down.",
          undefined,
          "2 s.f.",
        ],
        [
          "Round 0.0256 to 2 significant figures.",
          "0.026",
          ["0.025", "0.03"],
          "25|6: 6 rounds up.",
          undefined,
          "2 s.f.",
        ],
      ],
      [
        [
          "Round 45 260 to 3 significant figures.",
          "45 300",
          ["453", "45 200"],
          "452|60: 6 rounds up.",
          undefined,
          "3 s.f.",
        ],
        [
          "Round 7.214 to 3 significant figures.",
          "7.21",
          ["7.22", "721"],
          "721|4: 4 rounds down.",
          undefined,
          "3 s.f.",
        ],
      ],
    ]),

    reworded(
      y7Rounding,
      SF,
      "A crowd",
      {
        tag: "Real life",
        text: "A crowd is 37 482. A headline rounds it to 1 significant figure.",
      },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Count from the first digit that isn't 0.**"],
      { kind: "place-value", number: "37482", from: 4, to: 0, highlight: 4 },
      [
        "**Count from the first digit that isn't 0.**",
        "Count the figures you need, then round.",
        "Fill with zeros so the size stays the same.",
        "$8349 \\approx 8000$ (1 s.f.)",
        "$0.0526 \\approx 0.053$ (2 s.f.)",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Estimating.

const ESTIMATE = "y7-rounding/estimating";
const estimateMethod = [
  "Round every number to 1 significant figure.",
  "Work it out in your head.",
  "Write $\\approx$, which means 'is about'.",
];

const estimating = stepped(find(y7Rounding, ESTIMATE), {
  method: estimateMethod,
  variation: {
    relationship: "a calculation and its estimate from rounded numbers",
    unknowns: ["estimate", "rounded number"],
    surface: ["times", "divide", "numbers under 1", "size", "checking an answer"],
  },
  screens: [
    explain(
      "The rule",
      "Estimating",
      ["**To estimate, round every number to 1 significant figure.**"],
      maths("29 \\times 6.85 \\approx 30 \\times 7 = 210"),
      "Then the sum is easy to do in your head.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: 20,
          max: 40,
          step: 0.5,
          start: 29,
          tick: 1,
          every: 5,
          dp: 1,
          readouts: [
            { label: "To 1 significant figure", sf: 1 },
            { label: "The number", value: true },
          ],
          markFirst: true,
        },
        [
          "What did you notice?",
          "Every number from 25 to just under 35 rounds to 30",
          "So 30 stands in for any number near it: easy to work with.",
          [
            ["Only 29 rounds to 30", "Try 26 and 34 too."],
            ["It rounds to 20 or 40", "Look at where 29 and 31 go."],
          ],
        ],
        "A rounded number is easy to work with, and close to the real one.",
        { text: "Slide the number. The ring shows what it rounds to." },
      ),
    ),

    words(
      typed(
        "Check you remember",
        "Round 29 to 1 significant figure.",
        "30",
        "2|9: 9 rounds up.",
        "30.",
      ),
      NUMBER,
    ),
    words(
      typed(
        "Check you remember",
        "Round 6.85 to 1 significant figure.",
        "7",
        "6|.85: 8 rounds up.",
        "7.",
      ),
      NUMBER,
    ),
    words(
      typed(
        "Check you remember",
        "Work out $30 \\times 7$.",
        "210",
        "3 times 7, then times 10.",
        "210.",
      ),
      NUMBER,
    ),

    methodCard("The method", estimateMethod, maths("29 \\times 6.85 \\approx 30 \\times 7")),
    worked(
      "Watch the method",
      "Estimate $\\frac{396 \\times 5.1}{19.8}$.",
      [
        {
          line: "$\\approx \\frac{400 \\times 5}{20}$",
          note: "Each number to 1 significant figure.",
        },
        { line: "$= \\frac{2000}{20}$" },
        { line: "$= 100$", note: "2000 ÷ 20 is 200 ÷ 2." },
      ],
      "About 100.",
    ),
    words(
      calc(
        "Your turn",
        "Estimate $7.8 \\times 51$.",
        undefined,
        [
          ["$7.8 \\approx$", "8", "Round to 1 significant figure."],
          ["$51 \\approx$", "50", "Round to 1 significant figure."],
          ["$8 \\times 50 =$", "400", "8 fives are 40, so 8 fifties are 400."],
        ],
        "About 400.",
      ),
      NUMBER,
    ),

    words(
      calc(
        "Practise",
        "Estimate $298 \\div 6.1$.",
        undefined,
        [
          ["$298 \\approx$", "300", "Round to 1 significant figure."],
          ["$6.1 \\approx$", "6", "Round to 1 significant figure."],
          ["$300 \\div 6 =$", "50", "30 ÷ 6 is 5."],
        ],
        "About 50.",
      ),
      NUMBER,
    ),
    words(
      questionSet(
        "Practise",
        "Round, then estimate. Watch what changes.",
        [
          ask("Estimate $19 \\times 31$.", "600", "$20 \\times 30$.", "About 600.", {
            asks: "estimate",
          }),
          ask("To estimate $62 \\times 4.8$, round 62 to…", "60", "1 significant figure.", "60.", {
            asks: "rounded number",
            changed: "Now just the rounding.",
          }),
          ask("To estimate $62 \\times 4.8$, round 4.8 to…", "5", "1 significant figure.", "5.", {
            asks: "rounded number",
            changed: "The other number this time.",
          }),
          ask("Estimate $62 \\times 4.8$.", "300", "$60 \\times 5$.", "About 300.", {
            asks: "estimate",
            changed: "Now the whole estimate.",
          }),
        ],
        "Round each number first, then work it out.",
      ),
      NUMBER,
    ),

    words(
      questionSet(
        "Variation",
        "Estimate each. Watch what changes.",
        [
          ask("Estimate $41 \\times 19$.", "800", "$40 \\times 20$.", "About 800.", {
            asks: "estimate",
          }),
          ask("Estimate $410 \\times 19$.", "8000", "$400 \\times 20$.", "About 8000.", {
            asks: "estimate",
            changed: "The first number is 10 times bigger.",
            expect: [
              "410 is 10 times 41. The estimate is…",
              "10 times bigger: about 8000",
              "10 times one number makes the answer 10 times bigger.",
              [["the same: about 800", "410 is far more than 41."]],
            ],
          }),
          ask("Estimate $0.38 \\times 52$.", "20", "0.38 is about 0.4, not 0.", "About 20.", {
            asks: "estimate",
            changed: "One number is less than 1.",
            expect: [
              "To 1 significant figure, 0.38 is…",
              "0.4",
              "Its first significant figure is the 3, so 0.4.",
              [["0", "Rounding to 0 loses it all: start at the 3."]],
            ],
          }),
          ask(
            "Estimate $\\frac{62 \\times 4.8}{0.49}$.",
            "600",
            "$\\frac{60 \\times 5}{0.5}$.",
            "About 600.",
            {
              asks: "estimate",
              changed: "Now divide by a number less than 1.",
            },
          ),
        ],
        "Round each to 1 significant figure, even the small ones.",
      ),
      NUMBER,
    ),
    own(y7Rounding, ESTIMATE, "Spot the mistake"),

    quiz([
      [
        [
          "Estimate $19 \\times 31$.",
          "600",
          ["60", "6000"],
          "$20 \\times 30$.",
          undefined,
          "estimate",
        ],
        [
          "Estimate $39 \\times 21$.",
          "800",
          ["80", "8000"],
          "$40 \\times 20$.",
          undefined,
          "estimate",
        ],
      ],
      [
        [
          "Estimate $\\frac{603}{2.9}$.",
          "200",
          ["20", "2000"],
          "$600 \\div 3$.",
          undefined,
          "estimate",
        ],
        [
          "Estimate $\\frac{798}{3.9}$.",
          "200",
          ["20", "2000"],
          "$800 \\div 4$.",
          undefined,
          "estimate",
        ],
      ],
      [
        [
          "To estimate, 0.52 rounds to…",
          "0.5",
          ["0", "1"],
          "1 significant figure.",
          undefined,
          "rounded number",
        ],
        [
          "To estimate, 0.079 rounds to…",
          "0.08",
          ["0", "0.1"],
          "1 significant figure.",
          undefined,
          "rounded number",
        ],
      ],
    ]),

    reworded(
      y7Rounding,
      ESTIMATE,
      "Is the bill right?",
      { tag: "Real life" },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**To estimate, round every number to 1 significant figure.**"],
      maths("29 \\times 6.85 \\approx 30 \\times 7 = 210"),
      [
        "**To estimate, round every number to 1 significant figure.**",
        "Work it out in your head. $\\approx$ means 'is about'.",
        "$29 \\times 6.85 \\approx 30 \\times 7 = 210$",
        "$\\frac{396 \\times 5.1}{19.8} \\approx \\frac{400 \\times 5}{20} = 100$",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Error intervals.

const ERROR = "y7-rounding/error-intervals";
const errorMethod = [
  "Find the step it was rounded to.",
  "Halve the step.",
  "Take it off for the lower bound. Add it on for the upper.",
  "Write lower $\\le x <$ upper.",
];

const interval = (from: number, to: number, min: number, max: number, step: number) =>
  numberLine(min, max, step, [], {
    every: 5,
    interval: { from, to, fromClosed: true, toClosed: false },
  });

const errorIntervals = stepped(find(y7Rounding, ERROR), {
  method: errorMethod,
  variation: {
    relationship: "a rounded value and the bounds of what it could have been",
    unknowns: ["lower bound", "upper bound", "rounded value"],
    surface: ["the step", "1 decimal place", "which sign", "units", "a bridge"],
  },
  screens: [
    explain(
      "The rule",
      "Error intervals",
      ["**A rounded number could be up to half a step either side.**"],
      interval(3.5, 4.5, 3, 5, 0.1),
      "3.5 rounds to 4, so it's in. 4.5 rounds to 5, so it's out.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: 3,
          max: 5,
          step: 0.05,
          start: 4.2,
          tick: 0.1,
          every: 5,
          dp: 2,
          readouts: [
            { label: "To the nearest whole number", nearest: 1 },
            { label: "The number", value: true },
          ],
          markFirst: true,
        },
        [
          "What did you notice?",
          "From 3.5 up to just under 4.5, it rounds to 4",
          "Half a step below 4, up to half a step above.",
          [
            ["From 3 to 5, it rounds to 4", "Slide to 3.2 and 4.8 and look again."],
            ["Only 4.0 rounds to 4", "Try 3.6 and 4.4 too."],
          ],
        ],
        "Anything from 3.5 up to just under 4.5 rounds to 4.",
        { text: "Slide the number. The ring shows what it rounds to." },
      ),
    ),

    typed(
      "Check you remember",
      "Round 4.4 to the nearest whole number.",
      "4",
      "Is it nearer 4 or 5?",
      "4.",
      { picture: numberLine(4, 5, 0.1, [[4.4, "4.4"]], { every: 5 }) },
    ),
    typed(
      "Check you remember",
      "Round 3.5 to the nearest whole number.",
      "4",
      "Exactly half way rounds up.",
      "4.",
      { picture: numberLine(3, 4, 0.1, [[3.5, "3.5"]], { every: 5 }) },
    ),
    words(
      typed("Check you remember", "What is half of 0.1?", "0.05", "0.1 is 10 hundredths.", "0.05."),
      NUMBER,
    ),

    methodCard("The method", errorMethod, interval(65, 75, 60, 80, 1)),
    worked(
      "Watch the method",
      "n is 70 to the nearest 10. Write its error interval.",
      [
        { line: "Half the step: $10 \\div 2 = 5$" },
        { line: "$70 - 5 = 65$ and $70 + 5 = 75$" },
        { line: "$65 \\le n < 75$", note: "65 rounds to 70, but 75 rounds to 80." },
      ],
      "$65 \\le n < 75$.",
      interval(65, 75, 60, 80, 1),
    ),
    calc(
      "Your turn",
      "x is 9 to the nearest whole number. Find its bounds.",
      numberLine(8, 10, 0.1, [[9, "9"]], { every: 5 }),
      [
        ["Half the step: $1 \\div 2 =$", "0.5", "The step is 1. Halve it."],
        ["Lower bound: $9 - 0.5 =$", "8.5", "Take off half a step."],
        ["Upper bound: $9 + 0.5 =$", "9.5", "Add on half a step."],
      ],
      "$8.5 \\le x < 9.5$.",
    ),

    calc(
      "Practise",
      "6.3 cm to 1 decimal place. Find the bounds.",
      numberLine(6.2, 6.4, 0.01, [[6.3, "6.3"]], { every: 5 }),
      [
        ["Half the step: $0.1 \\div 2 =$", "0.05", "The step is 0.1. Halve it."],
        ["Lower bound: $6.3 - 0.05 =$", "6.25", "Take off half a step."],
        ["Upper bound: $6.3 + 0.05 =$", "6.35", "Add on half a step."],
      ],
      "$6.25 \\le x < 6.35$.",
    ),
    questionSet(
      "Practise",
      "Find each bound. Watch what changes.",
      [
        ask("m is 50 kg to the nearest 10 kg. Lower bound?", "45", "Half of 10 is 5.", "45 kg.", {
          unit: "kg",
          asks: "lower bound",
          picture: numberLine(40, 60, 1, [[50, "50"]], { every: 5 }),
        }),
        ask(
          "m is 50 kg to the nearest 10 kg. Upper bound?",
          "55",
          "Add on half a step.",
          "55 kg.",
          {
            unit: "kg",
            asks: "upper bound",
            changed: "Now the upper bound.",
            picture: numberLine(40, 60, 1, [[50, "50"]], { every: 5 }),
          },
        ),
        ask(
          "t is 2.7 s to 1 decimal place. Lower bound?",
          "2.65",
          "Half of 0.1 is 0.05.",
          "2.65 s.",
          {
            unit: "s",
            asks: "lower bound",
            changed: "To 1 decimal place: half a step is 0.05.",
            picture: numberLine(2.6, 2.8, 0.01, [[2.7, "2.7"]], { every: 5 }),
          },
        ),
        ask(
          "$35 \\le n < 45$. What was n rounded to?",
          "40",
          "It's the middle.",
          "40, to the nearest 10.",
          {
            asks: "rounded value",
            changed: "Now find the rounded value.",
            picture: interval(35, 45, 30, 50, 1),
          },
        ),
      ],
      "Halve the step, then take it off and add it on.",
    ),

    questionSet(
      "Variation",
      "Which error interval? Watch what changes.",
      [
        ask(
          "x is 8 to the nearest whole number.",
          "$7.5 \\le x < 8.5$",
          "Half of 1 is 0.5.",
          "$7.5 \\le x < 8.5$.",
          {
            asks: "lower bound",
            others: ["$7.5 \\le x \\le 8.5$", "$7 \\le x < 9$"],
          },
        ),
        ask(
          "d is 80 m to the nearest 10 m.",
          "$75 \\le d < 85$",
          "Half of 10 is 5.",
          "$75 \\le d < 85$.",
          {
            asks: "lower bound",
            changed: "The step is 10 now.",
            others: ["$79.5 \\le d < 80.5$", "$70 \\le d < 90$"],
          },
        ),
        ask(
          "d is 800 m to the nearest 100 m.",
          "$750 \\le d < 850$",
          "Half of 100 is 50.",
          "$750 \\le d < 850$.",
          {
            asks: "lower bound",
            changed: "The step is 100.",
            expect: [
              "The step is 10 times bigger. Half a step is…",
              "50",
              "Half of 100 is 50.",
              [["5", "That's half of 10."]],
            ],
            others: ["$795 \\le d < 805$", "$700 \\le d < 900$"],
          },
        ),
        ask(
          "d is 0.8 m to 1 decimal place.",
          "$0.75 \\le d < 0.85$",
          "Half of 0.1 is 0.05.",
          "$0.75 \\le d < 0.85$.",
          {
            asks: "lower bound",
            changed: "The step is 0.1.",
            others: ["$0.7 \\le d < 0.9$", "$0.75 \\le d \\le 0.85$"],
          },
        ),
      ],
      "The step changes; the method stays the same. The upper end is never in.",
    ),
    {
      ...own(y7Rounding, ERROR, "Spot the mistake"),
      text: "300 g to the nearest 100 g. Ivy finds its interval.",
    } as Screen,

    quiz([
      [
        [
          "n is 6 to the nearest whole number.",
          "$5.5 \\le n < 6.5$",
          ["$5 \\le n < 7$", "$5.5 \\le n \\le 6.5$"],
          "Half of 1 is 0.5.",
          undefined,
          "lower bound",
        ],
        [
          "n is 3 to the nearest whole number.",
          "$2.5 \\le n < 3.5$",
          ["$2 \\le n < 4$", "$2.5 \\le n \\le 3.5$"],
          "Half of 1 is 0.5.",
          undefined,
          "lower bound",
        ],
      ],
      [
        [
          "d is 80 m to the nearest 10 m. Upper bound?",
          "85 m",
          ["84 m", "90 m"],
          "Add on 5.",
          undefined,
          "upper bound",
        ],
        [
          "d is 60 m to the nearest 10 m. Upper bound?",
          "65 m",
          ["64 m", "70 m"],
          "Add on 5.",
          undefined,
          "upper bound",
        ],
      ],
      [
        [
          "w is 3.4 kg to 1 decimal place. Lower bound?",
          "3.35 kg",
          ["3.3 kg", "3.39 kg"],
          "Take off 0.05.",
          undefined,
          "lower bound",
        ],
        [
          "w is 2.6 kg to 1 decimal place. Lower bound?",
          "2.55 kg",
          ["2.5 kg", "2.59 kg"],
          "Take off 0.05.",
          undefined,
          "lower bound",
        ],
      ],
    ]),

    reworded(y7Rounding, ERROR, "How tall, really?", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**A rounded number could be up to half a step either side.**"],
      interval(3.5, 4.5, 3, 5, 0.1),
      [
        "**A rounded number could be up to half a step either side.**",
        "Halve the step. Take it off, and add it on.",
        "The lower bound is in; the upper bound is out.",
        "70 to the nearest 10: $65 \\le n < 75$",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

export const y7RoundingStepped: [string, UnitLesson[]][] = [
  [DP, [decimalPlaces]],
  [SF, [significantFigures]],
  [ESTIMATE, [estimating]],
  [ERROR, [errorIntervals]],
];
