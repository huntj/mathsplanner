// Year 7, "Calculating", on the stepped template (docs/proposals/lesson-stepped.md): negative
// numbers on a number line, decimals, fractions as same-size parts, mixed numbers, and inverse
// operations. Hops on a line, bar models and slides show each rule before the method.
import {
  ask,
  calc,
  choose,
  explain,
  explore,
  methodCard,
  questionSet,
  summary,
  typed,
  worked,
} from "./build.ts";
import { find, numberLine, own, owned, reworded, stepped, tagged } from "./stepped.ts";
import type { BarsPic, Picture, Screen, UnitLesson } from "./types.ts";
import { y7Calculating } from "./y7-calculating.ts";

const NUMBER = "A calculation: there is nothing to draw.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });
const minus = (n: number) => String(n).replace("-", "−");
const line = (
  from: number,
  to: number,
  marked: number[],
  e: { jumps?: { from: number; to: number; label?: string }[] } = {},
) =>
  numberLine(
    from,
    to,
    1,
    marked.map((m) => [m, minus(m)] as [number, string]),
    { every: 1, ...e },
  );
const bars = (rows: [label: string, parts: number, shaded: number][]): BarsPic => ({
  kind: "bars",
  rows: rows.map(([label, parts, shaded]) => ({ label, parts, shaded })),
});

/** A question with no picture is a calculation: say so. */
const worded = (screens: Screen[]): Screen[] =>
  screens.map((s) =>
    ["answer", "choice", "calc", "set", "steps", "fill", "sort", "place"].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture) &&
    s.kind !== "place"
      ? { ...s, wordsOnly: NUMBER }
      : s,
  );

const list = y7Calculating;

// ---------------------------------------------------------------------------------------------
// Negative numbers.

const NEGATIVES = "y7-calculating/negatives";
const negativesMethod = [
  "Start at the first number.",
  "Adding hops right. Taking away hops left.",
  "Taking away a negative is adding.",
  "Times: same signs positive, different signs negative.",
];

const negatives = stepped(find(list, NEGATIVES), {
  method: negativesMethod,
  variation: {
    relationship: "a calculation with negative numbers and its answer",
    unknowns: ["sum", "difference", "product"],
    surface: ["taking away a negative", "both negative", "times", "divers"],
  },
  screens: worded([
    explain(
      "The rule",
      "Negative numbers",
      ["**Adding hops right. Taking away hops left.**"],
      line(-5, 5, [2, -3], { jumps: [{ from: 2, to: -3, label: "− 5" }] }),
      "$2 - 5$ starts at 2 and hops 5 left, to −3.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: -10,
          max: 10,
          step: 1,
          start: -2,
          tick: 1,
          every: 5,
          dp: 0,
          readouts: [
            { label: "Add 5", plus: 5 },
            { label: "Take away 5", plus: -5 },
          ],
        },
        [
          "What did you notice?",
          "Add 5 is always 5 more, even below zero",
          "Adding hops right, wherever you start.",
          [
            [
              "Below zero, adding makes it smaller",
              "Slide to −8: add 5 gives −3, which is bigger.",
            ],
            ["Taking away 5 is always negative", "Slide to 9: take away 5 is 4."],
          ],
        ],
        "Adding hops right and taking away hops left, below zero too.",
        { text: "Slide the number. Watch it add 5, and take away 5." },
      ),
    ),
    reworded(list, NEGATIVES, "Spot the pattern: what is $3 \\times -1$?", { tag: "The rule" }),
    reworded(list, NEGATIVES, "Now: what is $-3 \\times -1$?", { tag: "The rule" }),

    typed("Check you remember", "What is $7 - 3$?", "4", "Hop 3 back from 7.", "4."),
    typed(
      "Check you remember",
      "What is $3 - 7$?",
      ["-4", "−4"],
      "Hop 7 back from 3, past 0.",
      "−4.",
      {
        picture: line(-5, 4, [3]),
      },
    ),
    choose(
      "Check you remember",
      "Which is bigger: −5 or −2?",
      "−2",
      "−2 is further right.",
      [["−5", "Further left is smaller."]],
      { picture: line(-6, 0, [-5, -2]) },
    ),

    methodCard(
      "The method",
      negativesMethod,
      line(-5, 5, [2, -3], { jumps: [{ from: 2, to: -3, label: "− 5" }] }),
    ),
    worked(
      "Watch the method",
      "Work out $5 - (-3)$ and $-4 \\times 5$.",
      [
        { line: "$5 - (-3) = 5 + 3 = 8$", note: "Taking away a negative is adding." },
        { line: "$-4 \\times 5 = -20$", note: "Different signs: negative." },
      ],
      "8 and −20.",
    ),
    calc(
      "Your turn",
      "Work out $-6 + 2$.",
      line(-7, 1, [-6]),
      [
        ["Start at", "-6", "The first number."],
        ["Hop 2 right:", "-4", "Adding hops right."],
      ],
      "−4.",
    ),

    calc(
      "Practise",
      "Work out $-4 \\times -5$.",
      undefined,
      [
        ["$4 \\times 5 =$", "20", "Leave the signs for now."],
        ["Same signs, so $-4 \\times -5 =$", "20", "Same signs: positive."],
      ],
      "20.",
    ),
    reworded(list, NEGATIVES, "Where do you land?", { tag: "Practise" }),
    questionSet(
      "Practise",
      "Work out each one. Watch what changes.",
      [
        ask("What is $-3 - 5$?", ["-8", "−8"], "Start at −3, hop 5 left.", "−8.", {
          asks: "difference",
          picture: line(-9, 1, [-3]),
        }),
        ask("What is $-3 + 5$?", "2", "Start at −3, hop 5 right.", "2.", {
          asks: "sum",
          changed: "Now add.",
          picture: line(-4, 3, [-3]),
        }),
        ask("What is $-6 \\times 3$?", ["-18", "−18"], "Different signs: negative.", "−18.", {
          asks: "product",
          changed: "Now times.",
        }),
        ask("What is $-7 \\times -3$?", "21", "Same signs: positive.", "21.", {
          asks: "product",
          changed: "Both negative.",
        }),
      ],
      "Hops for adding and taking away; signs for times.",
    ),

    questionSet(
      "Variation",
      "Work out each one. Watch what changes.",
      [
        ask("What is $-2 - 3$?", ["-5", "−5"], "Start at −2, hop 3 left.", "−5.", {
          asks: "difference",
          expect: [
            "Tom says two negatives make a positive, so it's 1. Right?",
            "No",
            "That rule is for times. $-2 - 3$ hops left to −5.",
            [["Yes", "Taking away hops left: −2 − 3 is −5."]],
          ],
        }),
        ask("What is $-2 \\times -3$?", "6", "Same signs: positive.", "6.", {
          asks: "product",
          changed: "Now times: the sign rule applies.",
        }),
        ask("What is $2 - (-3)$?", "5", "Taking away a negative is adding.", "5.", {
          asks: "difference",
          changed: "Take away a negative.",
          expect: [
            "Taking away −3 is the same as…",
            "adding 3",
            "Two minuses side by side make a plus: 2 + 3 = 5.",
            [["taking away 3", "That would give −1. Taking away a negative adds."]],
          ],
        }),
        ask("What is $-2 - (-3)$?", "1", "−2 + 3.", "1.", {
          asks: "difference",
          changed: "Start below zero, take away a negative.",
        }),
      ],
      "The sign rule is for times. Adding and taking away hop along the line.",
    ),
    own(list, NEGATIVES, "Spot the mistake"),

    own(list, NEGATIVES, "Exit check"),

    reworded(list, NEGATIVES, "The diver", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Adding hops right. Taking away hops left.**"],
      line(-5, 5, [2, -3], { jumps: [{ from: 2, to: -3, label: "− 5" }] }),
      [
        "**Adding hops right. Taking away hops left.**",
        "Taking away a negative is adding: $5 - (-3) = 8$",
        "Times: same signs positive, different signs negative.",
        "$-4 \\times 5 = -20$, $-4 \\times -5 = 20$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Calculating with decimals.

const DECIMALS = "y7-calculating/decimals";
const decimalsMethod = [
  "Add or take away: line up the points, with zeros.",
  "Times: work it out without the points.",
  "Count the decimal places, and put them back.",
];

const column = (top: string, bottom: string, sign = "+"): Picture =>
  maths(`\\begin{array}{r} ${top} \\\\ ${sign}\\; ${bottom} \\\\ \\hline \\end{array}`);

const decimals = stepped(find(list, DECIMALS), {
  method: decimalsMethod,
  variation: {
    relationship: "a calculation with decimals and its answer",
    unknowns: ["sum", "difference", "product"],
    surface: ["zeros to fill", "decimal places to count", "a whole number", "shopping"],
  },
  screens: worded([
    explain(
      "The rule",
      "Calculating with decimals",
      ["**Line up the points to add. Count decimal places to times.**"],
      column("4.70", "2.85"),
      "Fill gaps with zeros: 4.7 is 4.70.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: 0,
          max: 2,
          step: 0.1,
          start: 0.3,
          tick: 0.1,
          every: 5,
          dp: 1,
          readouts: [
            { label: "Times 0.2", times: 0.2, dp: 2 },
            { label: "Times 3", times: 3, dp: 1 },
          ],
        },
        [
          "What did you notice?",
          "Times 0.2 makes it smaller; times 3 makes it bigger",
          "Times a number less than 1, and the answer is smaller.",
          [
            ["Times always makes it bigger", "Look at times 0.2: 0.3 becomes 0.06."],
            ["Times 0.2 adds 0.2", "0.3 times 0.2 is 0.06, not 0.5."],
          ],
        ],
        "Times by a decimal less than 1 makes it smaller.",
        { text: "Slide the number. Watch it times 0.2, and times 3." },
      ),
    ),

    typed("Check you remember", "What is $345 + 120$?", "465", "Hundreds, tens, ones.", "465."),
    typed("Check you remember", "What is $13 \\times 2$?", "26", "Double 13.", "26."),
    typed(
      "Check you remember",
      "How many decimal places does 1.45 have?",
      "2",
      "Count the digits after the point.",
      "2.",
      {
        picture: { kind: "place-value", number: "1.45", from: 0, to: -2 },
      },
    ),

    methodCard("The method", decimalsMethod, column("4.70", "2.85")),
    worked(
      "Watch the method",
      "Work out $1.45 \\times 3$.",
      [
        { line: "$145 \\times 3 = 435$", note: "Leave out the point first." },
        { line: "1.45 has 2 decimal places." },
        { line: "$1.45 \\times 3 = 4.35$", note: "Put 2 decimal places back." },
      ],
      "4.35.",
    ),
    calc(
      "Your turn",
      "Work out $6.3 - 2.48$.",
      column("6.30", "2.48", "-"),
      [
        ["Fill with zeros: 6.3 is", "6.30", "Put a 0 in the hundredths."],
        ["$6.30 - 2.48 =$", "3.82", "Take away column by column."],
      ],
      "3.82.",
    ),

    calc(
      "Practise",
      "Work out $0.4 \\times 0.7$.",
      undefined,
      [
        ["$4 \\times 7 =$", "28", "Leave out the points."],
        ["Decimal places in all:", "2", "One in 0.4, one in 0.7."],
        ["$0.4 \\times 0.7 =$", "0.28", "Put 2 places back."],
      ],
      "0.28.",
    ),
    ...owned(list, DECIMALS, "Together", "Practise").filter((s) => s.title !== "$0.4 \\times 0.7$"),
    questionSet(
      "Practise",
      "Work out each one. Watch what changes.",
      [
        ask("Work out $3.6 + 1.75$.", "5.35", "3.60 + 1.75.", "5.35.", {
          asks: "sum",
          picture: column("3.60", "1.75"),
        }),
        ask("Work out $5 - 1.25$.", "3.75", "5.00 − 1.25.", "3.75.", {
          asks: "difference",
          changed: "Take away, from a whole number.",
          picture: column("5.00", "1.25", "-"),
        }),
        ask(
          "Work out $2.35 \\times 4$.",
          ["9.4", "9.40"],
          "235 × 4 = 940, then 2 places.",
          "9.40.",
          {
            asks: "product",
            changed: "Now times.",
          },
        ),
        ask("Work out $0.3 \\times 0.3$.", "0.09", "3 × 3 = 9, then 2 places.", "0.09.", {
          asks: "product",
          changed: "Two decimals.",
        }),
      ],
      "Line up for adding; count places for times.",
    ),

    questionSet(
      "Variation",
      "Work out each one. Watch what changes.",
      [
        ask("Work out $0.2 \\times 0.3$.", "0.06", "2 × 3 = 6, then 2 places.", "0.06.", {
          asks: "product",
          expect: [
            "Raj says $0.2 \\times 0.3 = 0.6$. Is he right?",
            "No: it's 0.06",
            "Two decimal places in all, so 0.06.",
            [["Yes", "Count the places: one and one make two."]],
          ],
        }),
        ask("Work out $0.2 \\times 3$.", "0.6", "2 × 3 = 6, then 1 place.", "0.6.", {
          asks: "product",
          changed: "One decimal, one whole number.",
        }),
        ask("Work out $0.2 \\times 0.03$.", "0.006", "2 × 3 = 6, then 3 places.", "0.006.", {
          asks: "product",
          changed: "Three decimal places in all.",
        }),
        ask("Work out $6.4 + 2.35$.", "8.75", "6.40 + 2.35.", "8.75.", {
          asks: "sum",
          changed: "Adding: line up the points.",
        }),
      ],
      "For times, count every decimal place. For adding, line up the points.",
    ),
    own(list, DECIMALS, "Spot the mistake"),

    own(list, DECIMALS, "Exit check"),

    reworded(list, DECIMALS, "At the shop", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Line up the points to add. Count decimal places to times.**"],
      column("4.70", "2.85"),
      [
        "**Line up the points to add. Count decimal places to times.**",
        "$4.7 + 2.85 = 4.70 + 2.85 = 7.55$",
        "$1.45 \\times 3$: $145 \\times 3 = 435$, so $4.35$",
        "$0.2 \\times 0.3 = 0.06$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Calculating with fractions.

const FRACTIONS = "y7-calculating/fractions";
const fractionsMethod = [
  "To add or take away, make the parts the same size.",
  "Then add or take away the tops.",
  "To times, times the tops and times the bottoms.",
  "Simplify.",
];

const fractions = stepped(find(list, FRACTIONS), {
  method: fractionsMethod,
  variation: {
    relationship: "two fractions and their sum, difference or product",
    unknowns: ["sum", "difference", "product"],
    surface: ["same-size parts", "different parts", "an answer over 1", "recipes"],
  },
  screens: worded([
    explain(
      "The rule",
      "Calculating with fractions",
      ["**To add fractions, the parts must be the same size.**"],
      bars([
        ["2/3", 3, 2],
        ["1/4", 4, 1],
      ]),
      "Cut both into twelfths: $\\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$.",
    ),
    reworded(list, FRACTIONS, "Multiplying is easier", { tag: "The rule" }),

    reworded(
      list,
      FRACTIONS,
      "What is $\\frac14 + \\frac24$?",
      { tag: "Check you remember" },
      "Warm-up",
    ),
    reworded(
      list,
      FRACTIONS,
      "Which is equal to $\\frac12$?",
      { tag: "Check you remember" },
      "Warm-up",
    ),
    typed(
      "Check you remember",
      "What is the LCM of 3 and 4?",
      "12",
      "Multiples of 4: 4, 8, 12.",
      "12.",
    ),

    methodCard(
      "The method",
      fractionsMethod,
      maths("\\tfrac34 - \\tfrac16 = \\tfrac{9}{12} - \\tfrac{2}{12} = \\tfrac{7}{12}"),
    ),
    worked(
      "Watch the method",
      "Work out $\\frac34 - \\frac16$.",
      [
        {
          line: "Twelfths: $\\frac34 = \\frac{9}{12}$, $\\frac16 = \\frac{2}{12}$",
          note: "12 is the LCM of 4 and 6.",
        },
        { line: "$\\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}$" },
      ],
      "$\\frac{7}{12}$.",
    ),
    calc(
      "Your turn",
      "Work out $\\frac13 + \\frac14$.",
      bars([
        ["1/3", 3, 1],
        ["1/4", 4, 1],
      ]),
      [
        ["Twelfths in $\\frac13$:", "4", "Times the top and bottom by 4."],
        ["Twelfths in $\\frac14$:", "3", "Times the top and bottom by 3."],
        ["$\\frac{4}{12} + \\frac{3}{12} =$", "7/12", "Add the tops; the twelfths stay."],
      ],
      "$\\frac{7}{12}$.",
    ),

    calc(
      "Practise",
      "Work out $\\frac23 \\times \\frac14$.",
      undefined,
      [
        ["Tops: $2 \\times 1 =$", "2", "Times the tops."],
        ["Bottoms: $3 \\times 4 =$", "12", "Times the bottoms."],
        ["$\\frac{2}{12}$ simplified is", "1/6", "Divide the top and bottom by 2."],
      ],
      "$\\frac16$.",
    ),
    ...owned(list, FRACTIONS, "Together", "Practise"),
    questionSet(
      "Practise",
      "Work out each one. Watch what changes.",
      [
        ask(
          "Work out $\\frac12 + \\frac13$.",
          "5/6",
          "Sixths: $\\frac36 + \\frac26$.",
          "$\\frac56$.",
          {
            asks: "sum",
          },
        ),
        ask(
          "Work out $\\frac56 - \\frac13$.",
          ["1/2", "3/6"],
          "Sixths: $\\frac56 - \\frac26$.",
          "$\\frac12$.",
          {
            asks: "difference",
            changed: "Take away now.",
          },
        ),
        ask(
          "Work out $\\frac12 \\times \\frac35$.",
          "3/10",
          "Tops 3, bottoms 10.",
          "$\\frac{3}{10}$.",
          {
            asks: "product",
            changed: "Now times.",
          },
        ),
        ask(
          "Work out $\\frac15 + \\frac12$.",
          "7/10",
          "Tenths: $\\frac{2}{10} + \\frac{5}{10}$.",
          "$\\frac{7}{10}$.",
          {
            asks: "sum",
            changed: "Fifths and halves.",
          },
        ),
      ],
      "Same-size parts to add or take away; tops and bottoms to times.",
    ),

    questionSet(
      "Variation",
      "Work out each one. Watch what changes.",
      [
        ask("Work out $\\frac12 + \\frac14$.", "3/4", "$\\frac24 + \\frac14$.", "$\\frac34$.", {
          asks: "sum",
          expect: [
            "Jo says $\\frac12 + \\frac14 = \\frac26$. Is she right?",
            "No: it's $\\frac34$",
            "Halves and quarters aren't the same size: $\\frac24 + \\frac14$.",
            [["Yes", "$\\frac26$ is a third: less than a half alone."]],
          ],
        }),
        ask("Work out $\\frac12 - \\frac14$.", "1/4", "$\\frac24 - \\frac14$.", "$\\frac14$.", {
          asks: "difference",
          changed: "Take away now.",
        }),
        ask("Work out $\\frac12 \\times \\frac14$.", "1/8", "Tops 1, bottoms 8.", "$\\frac18$.", {
          asks: "product",
          changed: "Times: no same-size parts needed.",
          expect: [
            "Do you need same-size parts to times?",
            "No",
            "Times the tops and the bottoms: $\\frac18$.",
            [["Yes", "Only adding and taking away need them."]],
          ],
        }),
        ask(
          "Work out $\\frac23 + \\frac23$.",
          ["4/3", "1 1/3"],
          "Thirds already: add the tops.",
          "$\\frac43 = 1\\frac13$.",
          {
            asks: "sum",
            changed: "The answer is more than 1.",
          },
        ),
      ],
      "Adding needs same-size parts; times doesn't.",
    ),
    own(list, FRACTIONS, "Spot the mistake"),

    own(list, FRACTIONS, "Exit check"),

    reworded(list, FRACTIONS, "Pancake batter", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**To add fractions, the parts must be the same size.**"],
      bars([
        ["2/3", 3, 2],
        ["1/4", 4, 1],
      ]),
      [
        "**To add fractions, the parts must be the same size.**",
        "$\\frac23 + \\frac14 = \\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$",
        "To times, times the tops and the bottoms.",
        "$\\frac23 \\times \\frac35 = \\frac{6}{15} = \\frac25$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Mixed numbers.

const MIXED = "y7-calculating/mixed-numbers";
const mixedMethod = [
  "Add the whole ones.",
  "Add the fractions, with same-size parts.",
  "A fraction over 1? Carry a whole.",
  "To take away and borrow, use improper fractions.",
];

const mixedNumbers = stepped(find(list, MIXED), {
  method: mixedMethod,
  variation: {
    relationship: "a mixed number, its improper fraction, and sums with them",
    unknowns: ["mixed", "improper"],
    surface: ["a carry", "borrowing", "a whole number", "planks"],
  },
  screens: worded([
    explain(
      "The rule",
      "Mixed numbers",
      ["**A mixed number is whole ones and a fraction.**"],
      bars([
        ["1", 3, 3],
        ["1", 3, 3],
        ["1/3", 3, 1],
      ]),
      "$2\\frac13$ is 2 wholes and a third: $\\frac73$.",
    ),
    reworded(list, MIXED, "Two and a third", { tag: "The rule" }),

    typed(
      "Check you remember",
      "How many quarters make 1 whole?",
      "4",
      "Cut a whole into 4.",
      "4.",
    ),
    typed(
      "Check you remember",
      "What is $\\frac12 + \\frac14$?",
      "3/4",
      "$\\frac24 + \\frac14$.",
      "$\\frac34$.",
    ),
    reworded(list, MIXED, "And back: $\\frac{11}{4}$ as a mixed number", {
      tag: "Check you remember",
    }),

    methodCard(
      "The method",
      mixedMethod,
      maths("1\\tfrac12 + 2\\tfrac14 = 3 + \\tfrac34 = 3\\tfrac34"),
    ),
    worked(
      "Watch the method",
      "Work out $2\\frac23 + 1\\frac12$.",
      [
        { line: "Whole ones: $2 + 1 = 3$" },
        {
          line: "Fractions: $\\frac46 + \\frac36 = \\frac76 = 1\\frac16$",
          note: "More than 1: carry a whole.",
        },
        { line: "$3 + 1\\frac16 = 4\\frac16$" },
      ],
      "$4\\frac16$.",
    ),
    calc(
      "Your turn",
      "Work out $1\\frac14 + 2\\frac14$.",
      undefined,
      [
        ["Whole ones: $1 + 2 =$", "3", "Add the whole ones."],
        ["Fractions: $\\frac14 + \\frac14 =$", "1/2", "Two quarters is a half."],
      ],
      "$3\\frac12$.",
    ),

    calc(
      "Practise",
      "Work out $2\\frac14 - 1\\frac12$.",
      undefined,
      [
        ["Quarters in $2\\frac14$:", "9", "2 wholes is 8 quarters, and 1 more."],
        ["Quarters in $1\\frac12$:", "6", "1 whole is 4 quarters, and a half is 2."],
        ["$\\frac94 - \\frac64 =$", "3/4", "Take away the tops."],
      ],
      "$\\frac34$.",
    ),
    ...owned(list, MIXED, "Your turn", "Practise").map((sc) =>
      sc.kind === "answer" && sc.title.includes("+")
        ? ({ ...sc, text: "Type it like 1 1/2." } as Screen)
        : sc,
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask(
          "Write $2\\frac34$ as an improper fraction.",
          "11/4",
          "2 wholes is 8 quarters.",
          "$\\frac{11}{4}$.",
          {
            asks: "improper",
          },
        ),
        ask(
          "Write $\\frac{17}{5}$ as a mixed number.",
          "3 2/5",
          "How many 5s in 17?",
          "$3\\frac25$.",
          {
            asks: "mixed",
            changed: "Now the other way.",
          },
        ),
        ask(
          "Work out $2\\frac13 + 1\\frac13$.",
          ["3 2/3", "11/3"],
          "Wholes, then thirds.",
          "$3\\frac23$.",
          {
            asks: "mixed",
            changed: "Now add two of them.",
          },
        ),
        ask(
          "Write $3\\frac12$ as an improper fraction.",
          "7/2",
          "3 wholes is 6 halves.",
          "$\\frac72$.",
          {
            asks: "improper",
            changed: "Halves this time.",
          },
        ),
      ],
      "Wholes to parts and back; add the wholes, then the parts.",
    ),

    questionSet(
      "Variation",
      "Find each one. Watch what changes.",
      [
        ask(
          "Write $2\\frac13$ as an improper fraction.",
          "7/3",
          "2 wholes is 6 thirds, and 1 more.",
          "$\\frac73$.",
          {
            asks: "improper",
            expect: [
              "Sam writes $2\\frac13 = \\frac63$. Is he right?",
              "No: it's $\\frac73$",
              "$\\frac63$ is just the 2. Add the third: $\\frac73$.",
              [["Yes", "He left out the third."]],
            ],
          },
        ),
        ask(
          "Work out $1\\frac34 + 1\\frac34$.",
          ["3 1/2", "7/2", "3.5"],
          "Wholes 2, quarters 6.",
          "$3\\frac12$.",
          {
            asks: "mixed",
            changed: "The fractions add to more than 1.",
          },
        ),
        ask(
          "Work out $3\\frac15 - 1\\frac25$.",
          ["1 4/5", "9/5"],
          "$\\frac{16}{5} - \\frac75$.",
          "$1\\frac45$.",
          {
            asks: "mixed",
            changed: "Take away, and you must borrow.",
          },
        ),
        ask(
          "Work out $4 - 1\\frac14$.",
          ["2 3/4", "11/4"],
          "$\\frac{16}{4} - \\frac54$.",
          "$2\\frac34$.",
          {
            asks: "mixed",
            changed: "Take from a whole number.",
          },
        ),
      ],
      "Carry when the parts make a whole; borrow when you can't take away.",
    ),
    own(list, MIXED, "Spot the mistake"),

    own(list, MIXED, "Exit check"),

    reworded(list, MIXED, "Cutting a plank", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**A mixed number is whole ones and a fraction.**"],
      bars([
        ["1", 3, 3],
        ["1", 3, 3],
        ["1/3", 3, 1],
      ]),
      [
        "**A mixed number is whole ones and a fraction.**",
        "$2\\frac13 = \\frac73$: 2 wholes is 6 thirds, and 1 more.",
        "Add the wholes, then the fractions; carry if over 1.",
        "$2\\frac23 + 1\\frac12 = 3 + 1\\frac16 = 4\\frac16$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Inverse operations.

const INVERSE = "y7-calculating/inverse";
const inverseMethod = [
  "Write the steps in order.",
  "Undo the last step first.",
  "Use each inverse: + and −, × and ÷.",
];

const inverse = stepped(find(list, INVERSE), {
  method: inverseMethod,
  variation: {
    relationship: "a chain of steps and the inverse chain that undoes it",
    unknowns: ["input", "output", "inverse"],
    surface: ["the order of the steps", "the same step twice", "checking a sum", "taxi fares"],
  },
  screens: worded([
    explain(
      "The rule",
      "Undo it",
      ["**Inverse operations undo each other.**"],
      maths("5 + 3 = 8 \\;\\Rightarrow\\; 8 - 3 = 5"),
      "× and ÷ undo each other too: $6 \\times 4 = 24$, so $24 \\div 4 = 6$.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: 0,
          max: 10,
          step: 1,
          start: 5,
          tick: 1,
          every: 1,
          dp: 0,
          readouts: [
            { label: "Times 4", times: 4 },
            { label: "Times 4, then divide by 4", times: 1 },
          ],
        },
        [
          "What did you notice?",
          "Divide by 4 takes it back to the start",
          "÷ 4 undoes × 4, whatever the number.",
          [
            [
              "It ends up 4 times bigger",
              "Look at the second readout: it's the number you started with.",
            ],
            ["It ends up at 0", "Slide to 7: it comes back to 7."],
          ],
        ],
        "An inverse undoes a step: ÷ 4 undoes × 4.",
        { text: "Slide the number. Times it by 4, then divide by 4." },
      ),
    ),
    reworded(list, INVERSE, "One fact, more for free", { tag: "The rule" }),

    typed("Check you remember", "What is $28 \\div 4$?", "7", "How many 4s in 28?", "7."),
    typed("Check you remember", "What is $31 - 3$?", "28", "Take 3 from 31.", "28."),
    choose("Check you remember", "What undoes + 3?", "− 3", "Take away undoes add.", [
      ["× 3", "Times doesn't undo adding."],
      ["+ 3", "That adds more."],
    ]),

    methodCard("The method", inverseMethod, maths("20 - 5 = 15, \\quad 15 \\div 3 = 5")),
    worked(
      "Watch the method",
      "× 3, then + 5, gives 20. What went in?",
      [
        { line: "Undo + 5: $20 - 5 = 15$", note: "Undo the last step first." },
        { line: "Undo × 3: $15 \\div 3 = 5$" },
        { line: "5 went in." },
      ],
      "5. Check: 5 × 3 + 5 = 20.",
    ),
    calc(
      "Your turn",
      "× 5, then + 2, gives 37. What went in?",
      undefined,
      [
        ["Undo + 2: $37 - 2 =$", "35", "The last step first."],
        ["Undo × 5: $35 \\div 5 =$", "7", "Then the first step."],
      ],
      "7.",
    ),

    calc(
      "Practise",
      "÷ 2, then − 1, gives 8. What went in?",
      undefined,
      [
        ["Undo − 1: $8 + 1 =$", "9", "The last step first."],
        ["Undo ÷ 2: $9 \\times 2 =$", "18", "Times undoes divide."],
      ],
      "18.",
    ),
    ...owned(list, INVERSE, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("× 3, then + 4, gives 19. What went in?", "5", "19 − 4, then ÷ 3.", "5.", {
          asks: "input",
        }),
        ask("5 goes in. × 3, then + 4. What comes out?", "19", "5 × 3 + 4.", "19.", {
          asks: "output",
          changed: "Now forwards.",
        }),
        ask("The inverse of × 5 is", "÷ 5", "Divide undoes times.", "÷ 5.", {
          asks: "inverse",
          changed: "Just the inverse.",
          others: ["− 5", "+ 5"],
        }),
        ask("$9 \\times 6 = 54$. So $54 \\div 6 =$", "9", "Divide undoes times.", "9.", {
          asks: "inverse",
          changed: "A fact for free.",
        }),
      ],
      "Undo the last step first, with its inverse.",
    ),

    questionSet(
      "Variation",
      "What went in? Watch what changes.",
      [
        ask("× 4, then − 3, gives 25. What went in?", "7", "25 + 3, then ÷ 4.", "7.", {
          asks: "input",
          expect: [
            "Kim does ÷ 4 first, then + 3. Is that right?",
            "No: undo the last step first",
            "+ 3 first gives 28, then ÷ 4 gives 7.",
            [["Yes", "She undid them in the wrong order."]],
          ],
        }),
        ask("− 3, then × 4, gives 28. What went in?", "10", "28 ÷ 4, then + 3.", "10.", {
          asks: "input",
          changed: "The steps swap order.",
        }),
        ask("+ 6, then ÷ 2, gives 10. What went in?", "14", "10 × 2, then − 6.", "14.", {
          asks: "input",
          changed: "Add, then divide.",
        }),
        ask("× 2, then × 2 again, gives 36. What went in?", "9", "36 ÷ 2 ÷ 2.", "9.", {
          asks: "input",
          changed: "The same step twice.",
        }),
      ],
      "Last step first, every time, whatever the steps are.",
    ),
    own(list, INVERSE, "Spot the mistake"),

    own(list, INVERSE, "Exit check"),

    typed(
      "Real life",
      "A taxi charges £3, plus £2 a mile. A ride costs £15. How many miles?",
      "6",
      "Undo + 3, then undo × 2.",
      "6 miles: 15 − 3 = 12, then 12 ÷ 2 = 6.",
    ),

    summary(
      "What to remember",
      ["**Inverse operations undo each other.**"],
      maths("5 + 3 = 8 \\;\\Rightarrow\\; 8 - 3 = 5"),
      [
        "**Inverse operations undo each other.**",
        "+ and − undo each other; × and ÷ undo each other.",
        "Work backwards: undo the last step first.",
        "× 3, + 5 gives 20: 20 − 5 = 15, 15 ÷ 3 = 5",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7CalculatingStepped: [string, UnitLesson[]][] = [
  [NEGATIVES, [negatives]],
  [DECIMALS, [decimals]],
  [FRACTIONS, [fractions]],
  [MIXED, [mixedNumbers]],
  [INVERSE, [inverse]],
];
