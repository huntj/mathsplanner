// Year 7, "Fractions, decimals and percentages", on the stepped template
// (docs/proposals/lesson-stepped.md): decimals and fractions on a hundred square, and percentage
// changes as one multiplication. (Percentages itself is in the pilot.)
import {
  ask,
  calc,
  explain,
  explore,
  methodCard,
  questionSet,
  summary,
  typed,
  worked,
} from "./build.ts";
import { find, own, owned, relation, reworded, stepped, tagged } from "./stepped.ts";
import type { Screen, UnitLesson } from "./types.ts";
import { hundred, y7Fdp } from "./y7-fdp.ts";

const NUMBER = "A number fact: there is nothing to draw.";

/** A question with no picture is a number fact: say so. */
const worded = (screens: Screen[]): Screen[] =>
  screens.map((s) =>
    ["answer", "choice", "calc", "set", "steps", "fill"].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture)
      ? { ...s, wordsOnly: NUMBER }
      : s,
  );

const list = y7Fdp;

// ---------------------------------------------------------------------------------------------
// Decimals and fractions.

const DF = "y7-fdp/decimals-fractions";
const dfMethod = [
  "Decimal to fraction: write it over 10, 100 or 1000.",
  "Then simplify.",
  "Fraction to decimal: divide the top by the bottom.",
  "Or make the bottom 10, 100 or 1000.",
];

const decimalsFractions = stepped(find(list, DF), {
  method: dfMethod,
  variation: {
    relationship: "a decimal and the fraction it names",
    unknowns: ["fraction", "decimal"],
    surface: ["tenths", "hundredths", "thousandths", "more than 1", "a zero in the tenths"],
  },
  screens: worded([
    explain(
      "The rule",
      "Decimals and fractions",
      ["**A decimal is a fraction out of 10, 100 or 1000.**"],
      hundred(35),
      "0.35 is 35 hundredths: $\\frac{35}{100} = \\frac{7}{20}$.",
    ),
    tagged(
      "The rule",
      explore(
        "Shade the hundred square",
        { kind: "hundred", start: 35 },
        [
          "What did you notice?",
          "The decimal and the fraction name the same shading",
          "35 squares is 0.35 and $\\frac{35}{100}$: two ways to write one amount.",
          [
            ["The fraction is always out of 10", "It's out of 100 before it's simplified."],
            ["The decimal is the number of squares", "35 squares is 0.35, not 35."],
          ],
        ],
        "A decimal and a fraction can name the same amount.",
        { text: "Drag the slider. Watch the fraction and the decimal." },
      ),
    ),
    reworded(list, DF, "Fractions to decimals", { tag: "The rule" }),

    reworded(list, DF, "What is the 7 worth in 0.7?", { tag: "Check you remember" }, "Warm-up"),
    reworded(list, DF, "Simplify $\\frac{25}{100}$", { tag: "Check you remember" }, "Warm-up"),
    typed(
      "Check you remember",
      "What is $\\frac34$ of 100?",
      "75",
      "A quarter of 100 is 25.",
      "75.",
    ),

    methodCard("The method", dfMethod, hundred(45)),
    worked(
      "Watch the method",
      "Write 0.375 as a fraction in its simplest form.",
      [
        { line: "$0.375 = \\frac{375}{1000}$", note: "Three decimal places: thousandths." },
        {
          line: "$= \\frac{75}{200} = \\frac{15}{40} = \\frac38$",
          note: "Divide by 5, three times.",
        },
      ],
      "$\\frac38$.",
    ),
    calc(
      "Your turn",
      "Write 0.45 as a fraction in its simplest form.",
      hundred(45),
      [
        ["Hundredths in 0.45:", "45", "Count the shaded squares."],
        ["$\\frac{45}{100}$ simplified is", "9/20", "Divide the top and bottom by 5."],
      ],
      "$\\frac{9}{20}$.",
    ),

    calc(
      "Practise",
      "Write $\\frac{7}{20}$ as a decimal.",
      hundred(35),
      [
        ["Hundredths in $\\frac{7}{20}$:", "35", "Times the top and bottom by 5."],
        ["As a decimal:", "0.35", "35 hundredths."],
      ],
      "0.35.",
    ),
    ...owned(list, DF, "Your turn", "Practise").filter((s) => !s.title.includes("0.45")),
    questionSet(
      "Practise",
      "Change each one. Watch what changes.",
      [
        ask(
          "Write 0.6 as a fraction.",
          ["3/5", "6/10"],
          "6 tenths.",
          "$\\frac{6}{10} = \\frac35$.",
          {
            asks: "fraction",
          },
        ),
        ask("Write $\\frac34$ as a decimal.", "0.75", "75 hundredths.", "0.75.", {
          asks: "decimal",
          changed: "Now the other way.",
          picture: hundred(75),
        }),
        ask(
          "Write 0.2 as a fraction in its simplest form.",
          "1/5",
          "$\\frac{2}{10}$, simplified.",
          "$\\frac15$.",
          {
            asks: "fraction",
            changed: "Back to a fraction.",
          },
        ),
        ask("Write 1.5 as an improper fraction.", "3/2", "1.5 is 15 tenths.", "$\\frac32$.", {
          asks: "fraction",
          changed: "More than 1.",
        }),
      ],
      "Over 10, 100 or 1000, then simplify; or divide to go back.",
    ),

    questionSet(
      "Variation",
      "Change each one. Watch what changes.",
      [
        ask("Write $\\frac14$ as a decimal.", "0.25", "1 ÷ 4.", "0.25.", {
          asks: "decimal",
          expect: [
            "Sam writes $\\frac14 = 0.14$. Is he right?",
            "No",
            "A fraction is a division: 1 ÷ 4 = 0.25.",
            [["Yes", "0.14 is 14 hundredths, not a quarter."]],
          ],
        }),
        ask(
          "Write 0.08 as a fraction.",
          ["2/25", "8/100"],
          "8 hundredths.",
          "$\\frac{8}{100} = \\frac{2}{25}$.",
          {
            asks: "fraction",
            changed: "A zero in the tenths.",
          },
        ),
        ask("Write $\\frac38$ as a decimal.", "0.375", "3 ÷ 8.", "0.375.", {
          asks: "decimal",
          changed: "Eighths: divide 3 by 8.",
        }),
        ask(
          "Write 2.25 as an improper fraction.",
          ["9/4", "2 1/4"],
          "2 and 25 hundredths.",
          "$\\frac94$.",
          {
            asks: "fraction",
            changed: "Wholes and a part.",
          },
        ),
      ],
      "Count the decimal places for the bottom; divide for the decimal.",
    ),
    own(list, DF, "Spot the mistake"),

    own(list, DF, "Exit check"),

    reworded(list, DF, "Which is more?", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**A decimal is a fraction out of 10, 100 or 1000.**"],
      hundred(35),
      [
        "**A decimal is a fraction out of 10, 100 or 1000.**",
        "$0.35 = \\frac{35}{100} = \\frac{7}{20}$",
        "A fraction is a division: $\\frac38 = 3 \\div 8 = 0.375$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Percentage changes as multipliers.

const CHANGES = "y7-fdp/changes";
const changesMethod = [
  "Find the new percentage: 100% add or take the change.",
  "Write it as a decimal: the multiplier.",
  "Times the old amount by it.",
];

const multiplier = (old: string, m: string, now: string, asks?: number) =>
  relation(
    [
      ["old", old],
      ["multiplier", m],
      ["new", now],
    ],
    ["×", "="],
    asks,
  );

const changes = stepped(find(list, CHANGES), {
  method: changesMethod,
  variation: {
    relationship: "an old amount, a multiplier, and the new amount",
    unknowns: ["multiplier", "new amount"],
    surface: ["up", "down", "small changes", "doubling", "sales"],
  },
  screens: worded([
    explain(
      "The rule",
      "Percentage changes as multipliers",
      ["**Up or down by a percentage is one multiplication.**"],
      multiplier("£80", "0.75", "£60"),
      "25% off leaves 75%, so times by 0.75.",
    ),
    reworded(list, CHANGES, "To increase by 10%, multiply by", { tag: "The rule" }),

    ...owned(list, CHANGES, "Warm-up", "Check you remember"),
    typed("Check you remember", "What is $100\\% + 20\\%$?", "120", "Add them.", "120%.", {
      unit: "%",
    }),

    methodCard("The method", changesMethod, multiplier("£45", "1.2", "£54")),
    worked(
      "Watch the method",
      "A £45 ticket goes up 20%. Find the new price.",
      [
        { line: "$100\\% + 20\\% = 120\\% = 1.2$", note: "Up: add to 100%." },
        { line: "$45 \\times 1.2 = 54$" },
      ],
      "£54.",
      multiplier("£45", "1.2", "?", 2),
    ),
    calc(
      "Your turn",
      "A £50 game is 30% off. Find the new price.",
      multiplier("£50", "?", "…", 1),
      [
        ["$100\\% - 30\\% =$", "70", "Off: take it from 100%.", { after: "%" }],
        ["The multiplier is", "0.7", "70% as a decimal."],
        ["$50 \\times 0.7 =$", "35", "Times the old price."],
      ],
      "£35.",
    ),

    calc(
      "Practise",
      "Increase £30 by 50%.",
      multiplier("£30", "?", "…", 1),
      [
        ["The multiplier is", "1.5", "100% + 50% = 150%."],
        ["$30 \\times 1.5 =$", "45", "Times the old amount."],
      ],
      "£45.",
    ),
    ...owned(list, CHANGES, "Together", "Practise").filter((s) => s.title !== "Down 30%"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("The multiplier for a 15% decrease is", "0.85", "100% − 15% = 85%.", "0.85.", {
          asks: "multiplier",
          others: ["0.15", "1.15"],
        }),
        ask("The multiplier for a 20% increase is", "1.2", "100% + 20% = 120%.", "1.2.", {
          asks: "multiplier",
          changed: "Now an increase.",
          others: ["0.2", "0.8"],
        }),
        ask("Decrease £40 by 25%.", "30", "40 × 0.75.", "£30.", {
          asks: "new amount",
          changed: "Now use it.",
          picture: multiplier("£40", "0.75", "?", 2),
        }),
        ask("Increase £200 by 5%.", "210", "200 × 1.05.", "£210.", {
          asks: "new amount",
          changed: "A small increase.",
          picture: multiplier("£200", "1.05", "?", 2),
        }),
      ],
      "100% add or take the change, as a decimal, then times.",
    ),

    questionSet(
      "Variation",
      "Find each multiplier. Watch what changes.",
      [
        ask("The multiplier for a 5% increase is", "1.05", "100% + 5% = 105%.", "1.05.", {
          asks: "multiplier",
          others: ["1.5", "0.05"],
          expect: [
            "Kai uses 1.5 for a 5% increase. Is he right?",
            "No: it's 1.05",
            "5% is 0.05, so 100% + 5% is 1.05.",
            [["Yes", "1.5 is a 50% increase."]],
          ],
        }),
        ask("The multiplier for a 50% increase is", "1.5", "100% + 50% = 150%.", "1.5.", {
          asks: "multiplier",
          changed: "Ten times the change.",
          others: ["1.05", "0.5"],
        }),
        ask("The multiplier for a 100% increase is", "2", "100% + 100% = 200%.", "2: it doubles.", {
          asks: "multiplier",
          changed: "Up by 100%.",
          others: ["1.1", "100"],
        }),
        ask("Reduce £60 by 20%.", "48", "60 × 0.8.", "£48.", {
          asks: "new amount",
          changed: "Now a decrease, all the way.",
          picture: multiplier("£60", "0.8", "?", 2),
        }),
      ],
      "The multiplier is always 100% with the change added or taken.",
    ),
    own(list, CHANGES, "Spot the mistake"),

    own(list, CHANGES, "Exit check"),

    reworded(list, CHANGES, "In the sale", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Up or down by a percentage is one multiplication.**"],
      multiplier("£80", "0.75", "£60"),
      [
        "**Up or down by a percentage is one multiplication.**",
        "Up 20%: × 1.2. Down 25%: × 0.75.",
        "£45 up 20%: $45 \\times 1.2 = 54$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7FdpStepped: [string, UnitLesson[]][] = [
  [DF, [decimalsFractions]],
  [CHANGES, [changes]],
];
