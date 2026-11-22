// Year 7, "Place value and ordering", on the stepped template (docs/proposals/lesson-stepped.md):
// what a digit is worth, negative numbers, ordering decimals, and the signs that compare. Each
// works on a place value chart or a number line, and the number line is the rule for ordering.
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
import type { Picture, PlaceValuePic, Screen, UnitLesson } from "./types.ts";
import { y7PlaceValue } from "./y7-place-value.ts";

const NUMBER = "A number check: there is nothing to draw.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });

const chart = (number: string, from: number, to: number, highlight?: number): PlaceValuePic => ({
  kind: "place-value",
  number,
  from,
  to,
  ...(highlight === undefined ? {} : { highlight }),
});

/** Cards to tap in order, smallest first unless `first` and `last` say otherwise. */
const order = (
  tag: string,
  title: string,
  items: string[],
  hint: string,
  done: string,
  e: { text?: string; picture?: Picture; first?: string; last?: string } = {},
): Screen => ({
  kind: "order",
  tag,
  title,
  ...(e.text ? { text: e.text } : {}),
  ...(e.picture ? { picture: e.picture } : {}),
  items,
  first: e.first ?? "smallest",
  last: e.last ?? "largest",
  hint,
  done,
});

// ---------------------------------------------------------------------------------------------
// What a digit is worth.

const VALUE = "y7-place-value/value";
const valueMethod = [
  "Find the digit's column.",
  "Read what the column is worth.",
  "The digit times the column is its value.",
];

const value = stepped(find(y7PlaceValue, VALUE), {
  method: valueMethod,
  variation: {
    relationship: "a digit, its column, and what it is worth",
    unknowns: ["value", "times", "divide"],
    surface: ["big numbers", "decimals", "zeros", "times by 10", "units"],
  },
  screens: [
    explain(
      "The rule",
      "What's it worth?",
      ["**A digit's value depends on its column.**"],
      chart("3045.27", 3, -2),
      "Each column is worth 10 times the one to its right.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: 0,
          max: 10,
          step: 0.05,
          start: 3.45,
          tick: 0.5,
          every: 2,
          dp: 2,
          readouts: [
            { label: "Times 10", times: 10 },
            { label: "Times 100", times: 100 },
            { label: "Divide by 10", times: 0.1 },
          ],
        },
        [
          "What did you notice?",
          "The digits stay the same; they move columns",
          "Times 10 moves each digit one column left: 3.45 becomes 34.5.",
          [
            ["Times 10 adds a 0 on the end", "3.45 times 10 is 34.5, not 3.450."],
            ["The digits change", "Look again: 3, 4 and 5 every time."],
          ],
        ],
        "Times or divide by 10, and the digits move a column.",
        { text: "Slide the number. Watch the digits in each answer." },
      ),
    ),

    typed(
      "Check you remember",
      "What is the 3 worth in 345?",
      "300",
      "It's in the hundreds.",
      "300.",
      {
        picture: chart("345", 2, 0, 2),
      },
    ),
    words(
      typed("Check you remember", "Work out $45 \\times 10$.", "450", "10 lots of 45.", "450."),
      NUMBER,
    ),
    typed(
      "Check you remember",
      "Write 7 hundredths as a decimal.",
      "0.07",
      "Tenths first, then hundredths.",
      "0.07.",
      { picture: chart("0.07", 0, -2, -2) },
    ),

    methodCard("The method", valueMethod, chart("52.68", 1, -2, -1)),
    worked(
      "Watch the method",
      "What is the 6 worth in 52.68?",
      [
        { line: "The 6 is in the tenths column.", note: "The first column after the point." },
        { line: "$6 \\times 0.1 = 0.6$" },
      ],
      "The 6 is worth 0.6.",
      chart("52.68", 1, -2, -1),
    ),
    calc(
      "Your turn",
      "What is the 6 worth in 2 064 300?",
      chart("2064300", 6, 0, 4),
      [
        ["The 6 is in the column worth", "10000", "Ones, tens, hundreds… count to the 6."],
        ["$6 \\times 10\\,000 =$", "60000", "6 ten thousands."],
      ],
      "60 000: 6 ten thousands.",
    ),

    calc(
      "Practise",
      "Work out $3.45 \\times 10$.",
      chart("3.45", 1, -2),
      [
        ["The 3 moves to the column worth", "10", "Times 10: one column left."],
        ["$3.45 \\times 10 =$", "34.5", "The digits move; the point stays."],
      ],
      "34.5.",
    ),
    questionSet(
      "Practise",
      "What is each worth? Watch what changes.",
      [
        ask("What is the 4 worth in 3045.27?", "40", "It's in the tens.", "40.", {
          asks: "value",
          picture: chart("3045.27", 3, -2, 1),
        }),
        ask("What is the 7 worth in 3045.27?", "0.07", "It's in the hundredths.", "0.07.", {
          asks: "value",
          changed: "Now a digit after the point.",
          picture: chart("3045.27", 3, -2, -2),
        }),
        ask("Work out $620 \\div 100$.", "6.2", "Two columns right.", "6.2.", {
          asks: "divide",
          changed: "Now divide by 100.",
          picture: chart("620", 2, -1),
        }),
        ask("Work out $0.47 \\times 100$.", "47", "Two columns left.", "47.", {
          asks: "times",
          changed: "Now times by 100.",
          picture: chart("0.47", 1, -2),
        }),
      ],
      "Find the column. Times or divide moves the digits.",
    ),

    questionSet(
      "Variation",
      "Find each one. Watch what changes.",
      [
        ask("What is the 5 worth in 503?", "500", "It's in the hundreds.", "500.", {
          asks: "value",
          picture: chart("503", 2, 0),
        }),
        ask("What is the 5 worth in 5.03?", "5", "It's in the ones.", "5.", {
          asks: "value",
          changed: "The same digits, with a point.",
          picture: chart("5.03", 0, -2),
        }),
        ask("What is the 3 worth in 5.03?", "0.03", "It's in the hundredths.", "0.03.", {
          asks: "value",
          changed: "The 0 holds the tenths column.",
          picture: chart("5.03", 0, -2),
        }),
        ask("Work out $3.4 \\times 10$.", "34", "One column left.", "34.", {
          asks: "times",
          changed: "Times 10, with a decimal.",
          expect: [
            "Jay says times 10 adds a 0. $3.4 \\times 10$ is…",
            "34",
            "The digits move one column left; the point doesn't move.",
            [["3.40", "3.40 is the same as 3.4. Move the digits."]],
          ],
        }),
        ask("How many grams in 2.5 kg?", "2500", "1000 g in 1 kg.", "2500 g.", {
          unit: "g",
          asks: "times",
          changed: "In a context: 1000 g in 1 kg.",
        }),
      ],
      "The column gives the value. Times 10 moves every digit one column.",
    ),
    own(y7PlaceValue, VALUE, "Spot the mistake"),

    quiz([
      [
        [
          "What is the 5 worth in 4 523 000?",
          "500 000",
          ["5000", "50 000"],
          "It's in the hundred thousands.",
          undefined,
          "value",
        ],
        [
          "What is the 2 worth in 3 250 000?",
          "200 000",
          ["2000", "20 000"],
          "It's in the hundred thousands.",
          undefined,
          "value",
        ],
      ],
      [
        [
          "Work out $0.47 \\times 100$.",
          "47",
          ["4.7", "0.4700"],
          "Two columns left.",
          undefined,
          "times",
        ],
        [
          "Work out $0.36 \\times 10$.",
          "3.6",
          ["36", "0.360"],
          "One column left.",
          undefined,
          "times",
        ],
      ],
      [
        [
          "Work out $56 \\div 100$.",
          "0.56",
          ["5.6", "5600"],
          "Two columns right.",
          undefined,
          "divide",
        ],
        ["Work out $8 \\div 10$.", "0.8", ["80", "0.08"], "One column right.", undefined, "divide"],
      ],
    ]),

    reworded(y7PlaceValue, VALUE, "A house price", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**A digit's value depends on its column.**"],
      chart("52.68", 1, -2),
      [
        "**A digit's value depends on its column.**",
        "Each column is worth 10 times the one to its right.",
        "Times 10: every digit moves one column left.",
        "In 52.68, the 6 is worth 0.6.",
        "$3.45 \\times 10 = 34.5$",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Negative numbers.

const NEGATIVES = "y7-place-value/negatives";
const negativesMethod = [
  "Picture the number line.",
  "Further left is smaller.",
  "Negatives first: the furthest from 0 is smallest.",
  "Then 0, then the positives.",
];

const line = (from: number, to: number, marked: number[], every = 1) =>
  numberLine(
    from,
    to,
    1,
    marked.map((m) => [m, String(m).replace("-", "−")] as [number, string]),
    {
      every,
    },
  );

const negatives = stepped(find(y7PlaceValue, NEGATIVES), {
  method: negativesMethod,
  variation: {
    relationship: "where numbers sit on a number line, and which is bigger",
    unknowns: ["smaller", "bigger", "smallest", "largest"],
    surface: ["temperature", "sea level", "decimals", "how many numbers", "all negative"],
  },
  screens: [
    explain(
      "The rule",
      "Below zero",
      ["**On a number line, numbers get bigger to the right.**"],
      line(-8, 4, [-5, -2]),
      "So −5 is smaller than −2.",
    ),
    reworded(y7PlaceValue, NEGATIVES, "Below zero", { tag: "The rule" }, "Discover"),

    reworded(y7PlaceValue, NEGATIVES, "Which is bigger: 12 or 21?", { tag: "Check you remember" }),
    typed(
      "Check you remember",
      "It's 2 °C. It drops 5 degrees. What is it now?",
      ["-3", "−3"],
      "Count 5 steps left from 2.",
      "−3 °C.",
      { unit: "°C", picture: line(-5, 5, [2]) },
    ),
    choose(
      "Check you remember",
      "Which is further from 0: 3 or 8?",
      "8",
      "8 is 8 steps from 0; 3 is only 3.",
      [["3", "Count the steps from 0."]],
      { picture: line(0, 10, [3, 8]) },
    ),

    methodCard("The method", negativesMethod, line(-8, 5, [-7, -3, 0, 1, 4])),
    worked(
      "Watch the method",
      "Put −3, 4, −7, 0 and 1 in order, smallest first.",
      [
        { line: "−7 is furthest left.", note: "Further below zero is smaller." },
        { line: "Then −3, then 0." },
        { line: "Then the positives: 1, 4." },
        { line: "−7, −3, 0, 1, 4" },
      ],
      "−7, −3, 0, 1, 4.",
      line(-8, 5, [-7, -3, 0, 1, 4]),
    ),
    calc(
      "Your turn",
      "Find the smallest and the largest: −6, −10, −2.",
      line(-11, 0, [-10, -6, -2]),
      [
        ["Smallest:", "-10", "Furthest left on the line."],
        ["Largest:", "-2", "Furthest right on the line."],
      ],
      "−10 is smallest; −2 is largest.",
    ),

    calc(
      "Practise",
      "Order −1, −8 and 2, smallest first.",
      line(-9, 3, [-8, -1, 2]),
      [
        ["First:", "-8", "Furthest left."],
        ["Then:", "-1", "Next along to the right."],
        ["Last:", "2", "The only positive."],
      ],
      "−8, −1, 2.",
    ),
    questionSet(
      "Practise",
      "Which one? Watch what changes.",
      [
        ask("Which is smaller: −5 or −2?", "−5", "Further left is smaller.", "−5.", {
          asks: "smaller",
          others: ["−2"],
          picture: line(-6, 0, [-5, -2]),
        }),
        ask("Which is bigger: −5 or −2?", "−2", "Further right is bigger.", "−2.", {
          asks: "bigger",
          changed: "Now the bigger one.",
          others: ["−5"],
          picture: line(-6, 0, [-5, -2]),
        }),
        ask(
          "Which is the smallest: 2, −3, −11, 0?",
          "−11",
          "Furthest from 0, below zero.",
          "−11.",
          {
            asks: "smallest",
            changed: "Four numbers now.",
            others: ["−3", "0", "2"],
            picture: line(-12, 3, [-11, -3, 0, 2]),
          },
        ),
        ask("Which is the largest: −7, −1, −4?", "−1", "Nearest 0 is largest here.", "−1.", {
          asks: "largest",
          changed: "All negative: which is largest?",
          others: ["−7", "−4"],
          picture: line(-8, 0, [-7, -4, -1]),
        }),
      ],
      "Picture the line: further left is smaller.",
    ),
    order(
      "Practise",
      "Tap from smallest to largest.",
      ["−9", "−4", "0", "3", "6"],
      "Negatives first: furthest from 0 is smallest.",
      "−9, −4, 0, 3, 6.",
      { picture: line(-10, 7, [], 5) },
    ),

    questionSet(
      "Variation",
      "Which one? Watch what changes.",
      [
        ask(
          "Which is warmer: −4 °C or −2 °C?",
          "−2 °C",
          "Warmer is higher: further right.",
          "−2 °C.",
          {
            asks: "bigger",
            others: ["−4 °C"],
            picture: line(-5, 0, [-4, -2]),
          },
        ),
        ask("Which is bigger: −8 or −3?", "−3", "−3 is nearer 0.", "−3.", {
          asks: "bigger",
          changed: "8 is bigger than 3. Watch out.",
          others: ["−8"],
          expect: [
            "8 is bigger than 3. So −8 is…",
            "smaller than −3",
            "−8 is further below zero, so it's smaller.",
            [["bigger than −3", "Below zero, the bigger digit is further left."]],
          ],
        }),
        ask("Which is smaller: −0.5 or −1.5?", "−1.5", "−1.5 is further left.", "−1.5.", {
          asks: "smaller",
          changed: "Decimals below zero.",
          others: ["−0.5"],
          picture: numberLine(-2, 0, 0.5, [
            [-1.5, "−1.5"],
            [-0.5, "−0.5"],
          ]),
        }),
        ask(
          "3 m or 5 m below sea level: which is deeper?",
          "5 m below",
          "Deeper is lower: −5.",
          "5 m below: −5 m.",
          {
            asks: "smaller",
            changed: "Below sea level, not cold.",
            others: ["3 m below"],
          },
        ),
      ],
      "Cold, deep or a decimal: further left on the line is smaller.",
    ),
    own(y7PlaceValue, NEGATIVES, "Spot the mistake"),

    own(y7PlaceValue, NEGATIVES, "Exit check"),

    reworded(
      y7PlaceValue,
      NEGATIVES,
      "Coldest to warmest",
      { tag: "Real life" },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**On a number line, numbers get bigger to the right.**"],
      line(-8, 5, [-7, -3, 0, 1, 4]),
      [
        "**On a number line, numbers get bigger to the right.**",
        "Negatives first: the furthest from 0 is smallest.",
        "Then 0, then the positives.",
        "$-5 < -2$, even though $5 > 2$.",
        "−7, −3, 0, 1, 4",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Ordering decimals.

const DECIMALS = "y7-place-value/decimals";
const decimalsMethod = [
  "Line up the decimal points.",
  "Fill the gaps with zeros.",
  "Compare from the left: ones, tenths, hundredths.",
];

const table = (rows: string[][]): Picture => ({
  kind: "table",
  head: ["O", ".", "t", "h"],
  rows,
});

const decimals = stepped(find(y7PlaceValue, DECIMALS), {
  method: decimalsMethod,
  variation: {
    relationship: "decimals compared column by column",
    unknowns: ["bigger", "smaller", "smallest"],
    surface: ["more digits", "zeros", "fractions", "negatives", "lengths"],
  },
  screens: [
    explain(
      "The rule",
      "Ordering decimals",
      ["**Compare decimals column by column, from the left.**"],
      table([
        ["0", ".", "4", "0"],
        ["0", ".", "3", "5"],
      ]),
      "Fill gaps with zeros: 0.4 is 0.40, which beats 0.35.",
    ),
    reworded(y7PlaceValue, DECIMALS, "Between 0 and 1", { tag: "The rule" }),

    reworded(y7PlaceValue, DECIMALS, "What is the 4 worth in 0.45?", {
      tag: "Check you remember",
      picture: chart("0.45", 0, -2, -1),
    }),
    reworded(y7PlaceValue, DECIMALS, "Write $\\frac{1}{2}$ as a decimal", {
      tag: "Check you remember",
    }),
    choose(
      "Check you remember",
      "Which is bigger: 40 hundredths or 35 hundredths?",
      "40 hundredths",
      "40 is more than 35.",
      [["35 hundredths", "Compare 40 and 35."]],
    ),

    methodCard(
      "The method",
      decimalsMethod,
      table([
        ["0", ".", "6", "0"],
        ["0", ".", "0", "6"],
        ["0", ".", "6", "5"],
      ]),
    ),
    worked(
      "Watch the method",
      "Put 0.6, 0.06 and 0.65 in order, smallest first.",
      [
        { line: "Fill with zeros: 0.60, 0.06, 0.65", note: "Now each has two decimal places." },
        { line: "Tenths: 0.06 has 0, so it's smallest." },
        { line: "Hundredths: 0.60 is less than 0.65." },
        { line: "0.06, 0.6, 0.65" },
      ],
      "0.06, 0.6, 0.65.",
      table([
        ["0", ".", "6", "0"],
        ["0", ".", "0", "6"],
        ["0", ".", "6", "5"],
      ]),
    ),
    calc(
      "Your turn",
      "Which is bigger: 4.5 or 4.45?",
      table([
        ["4", ".", "5", "?"],
        ["4", ".", "4", "5"],
      ]),
      [
        ["Fill with zeros: 4.5 is", "4.50", "Put a 0 in the hundredths."],
        ["The bigger one is", "4.5", "Tenths: 5 beats 4."],
      ],
      "4.5 is bigger: compare the tenths.",
    ),

    calc(
      "Practise",
      "Order 0.8, 0.15 and 0.3, smallest first.",
      table([
        ["0", ".", "8", "0"],
        ["0", ".", "1", "5"],
        ["0", ".", "3", "0"],
      ]),
      [
        ["Smallest:", "0.15", "The fewest tenths."],
        ["Then:", "0.3", "3 tenths."],
        ["Largest:", "0.8", "8 tenths: the most."],
      ],
      "0.15, 0.3, 0.8.",
    ),
    questionSet(
      "Practise",
      "Which one? Watch what changes.",
      [
        ask("Which is bigger: 0.4 or 0.35?", "0.4", "0.40 beats 0.35.", "0.4.", {
          asks: "bigger",
          others: ["0.35"],
          picture: table([
            ["0", ".", "4", "0"],
            ["0", ".", "3", "5"],
          ]),
        }),
        ask("Which is smaller: 0.4 or 0.35?", "0.35", "3 tenths is less than 4.", "0.35.", {
          asks: "smaller",
          changed: "Now the smaller one.",
          others: ["0.4"],
          picture: table([
            ["0", ".", "4", "0"],
            ["0", ".", "3", "5"],
          ]),
        }),
        ask("Which is smallest: 0.07, 0.7 or 0.17?", "0.07", "0 tenths is fewest.", "0.07.", {
          asks: "smallest",
          changed: "Three numbers now.",
          others: ["0.7", "0.17"],
          picture: table([
            ["0", ".", "0", "7"],
            ["0", ".", "7", "0"],
            ["0", ".", "1", "7"],
          ]),
        }),
      ],
      "Fill with zeros, then compare from the left.",
    ),
    reworded(y7PlaceValue, DECIMALS, "Smallest to largest", { tag: "Practise" }),

    questionSet(
      "Variation",
      "Which is bigger? Watch what changes.",
      [
        ask("Which is bigger: 0.6 or 0.56?", "0.6", "0.60 beats 0.56.", "0.6.", {
          asks: "bigger",
          others: ["0.56"],
        }),
        ask("Which is bigger: 4.5 or 4.45?", "4.5", "Tenths: 5 beats 4.", "4.5.", {
          asks: "bigger",
          changed: "Ben says 45 beats 5. Watch out.",
          others: ["4.45"],
          expect: [
            "45 is bigger than 5. So 4.45 is…",
            "smaller than 4.5",
            "Compare tenths: 4 tenths is less than 5 tenths.",
            [["bigger than 4.5", "More digits doesn't mean bigger. Compare columns."]],
          ],
        }),
        ask("Which is bigger: $\\frac14$ or 0.3?", "0.3", "$\\frac14 = 0.25$.", "0.3.", {
          asks: "bigger",
          changed: "A fraction: make it a decimal first.",
          others: ["$\\frac14$"],
        }),
        ask("Which is bigger: −0.5 or −1.5?", "−0.5", "Further right is bigger.", "−0.5.", {
          asks: "bigger",
          changed: "Now below zero.",
          others: ["−1.5"],
          picture: numberLine(-2, 0, 0.5, [
            [-1.5, "−1.5"],
            [-0.5, "−0.5"],
          ]),
        }),
      ],
      "Columns from the left. Fractions become decimals. Below zero, further left is smaller.",
    ),
    own(y7PlaceValue, DECIMALS, "Spot the mistake"),

    own(y7PlaceValue, DECIMALS, "Exit check"),

    reworded(
      y7PlaceValue,
      DECIMALS,
      "Who jumped furthest?",
      { tag: "Real life" },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Compare decimals column by column, from the left.**"],
      table([
        ["0", ".", "4", "0"],
        ["0", ".", "3", "5"],
      ]),
      [
        "**Compare decimals column by column, from the left.**",
        "Line up the points. Fill gaps with zeros.",
        "0.4 = 0.40, so 0.4 > 0.35.",
        "0.06 < 0.6 < 0.65",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// The signs.

const SIGNS = "y7-place-value/signs";
const signsMethod = [
  "Find the bigger number.",
  "The open end of the sign faces it.",
  "'At least' is $\\ge$. 'At most' is $\\le$.",
];

const signs = stepped(find(y7PlaceValue, SIGNS), {
  method: signsMethod,
  variation: {
    relationship: "a sign between two numbers, or a rule in words",
    unknowns: ["<", ">", "≤ or ≥"],
    surface: ["negatives", "decimals", "fractions", "words", "rides and prices"],
  },
  screens: [
    explain(
      "The rule",
      "The signs",
      ["**The open end faces the bigger number.**"],
      maths("3 < 8 \\qquad 8 > 3"),
      "$<$ means 'is less than'. $>$ means 'is greater than'.",
    ),
    reworded(y7PlaceValue, SIGNS, "Or equal to", {
      tag: "The rule",
      text: ["$\\le$ is 'less than **or equal to**'. $\\ge$ is 'greater than or equal to'."],
      bubble: "'At least 120' means 120 or more: $\\ge 120$.",
    }),

    reworded(y7PlaceValue, SIGNS, "Which is bigger: 7 or 4?", { tag: "Check you remember" }),
    reworded(y7PlaceValue, SIGNS, "Is $3 + 4$ equal to 7?", { tag: "Check you remember" }),
    choose(
      "Check you remember",
      "Which is bigger: −3 or −7?",
      "−3",
      "−3 is further right.",
      [["−7", "Further left is smaller."]],
      { picture: line(-8, 0, [-7, -3]) },
    ),

    methodCard("The method", signsMethod, maths("-3 > -7")),
    worked(
      "Watch the method",
      "Put the right sign between $-3$ and $-7$.",
      [
        { line: "−3 is to the right of −7.", note: "Further right is bigger." },
        { line: "So −3 is bigger: $-3 > -7$", note: "The open end faces −3." },
      ],
      "$-3 > -7$.",
      line(-8, 0, [-7, -3]),
    ),
    calc(
      "Your turn",
      "Compare 0.5 and 0.45.",
      table([
        ["0", ".", "5", "0"],
        ["0", ".", "4", "5"],
      ]),
      [
        ["Fill with zeros: 0.5 is", "0.50", "Put a 0 in the hundredths."],
        ["The bigger number is", "0.5", "50 hundredths beats 45."],
      ],
      "$0.5 > 0.45$.",
    ),
    reworded(y7PlaceValue, SIGNS, "Choose the sign", { tag: "Your turn" }, "Together"),

    calc(
      "Practise",
      "Compare −2 and −6.",
      line(-7, 0, [-6, -2]),
      [["The bigger number is", "-2", "Further right is bigger."]],
      "$-2 > -6$.",
    ),
    reworded(y7PlaceValue, SIGNS, "Choose the sign", { tag: "Practise" }, "Your turn"),
    questionSet(
      "Practise",
      "Which is true? Watch what changes.",
      [
        ask("5 and 2: which is true?", "$5 > 2$", "The open end faces 5.", "$5 > 2$.", {
          asks: ">",
          others: ["$5 < 2$"],
        }),
        ask("2 and 5: which is true?", "$2 < 5$", "The open end faces 5.", "$2 < 5$.", {
          asks: "<",
          changed: "The numbers swap places.",
          others: ["$2 > 5$"],
        }),
        ask("−1 and −4: which is true?", "$-1 > -4$", "−1 is further right.", "$-1 > -4$.", {
          asks: ">",
          changed: "Now negatives.",
          others: ["$-1 < -4$"],
          picture: line(-5, 0, [-4, -1]),
        }),
        ask("0.7 and 0.65: which is true?", "$0.7 > 0.65$", "0.70 beats 0.65.", "$0.7 > 0.65$.", {
          asks: ">",
          changed: "Now decimals.",
          others: ["$0.7 < 0.65$", "$0.7 = 0.65$"],
        }),
      ],
      "Find the bigger number, and face the open end towards it.",
    ),

    questionSet(
      "Variation",
      "Write each rule. Watch what changes.",
      [
        ask("'At least 18' is", "$\\ge 18$", "18 counts, and more.", "$\\ge 18$.", {
          asks: "≤ or ≥",
          others: ["$\\le 18$", "$> 18$"],
        }),
        ask("'At most 5' is", "$\\le 5$", "5 counts, and fewer.", "$\\le 5$.", {
          asks: "≤ or ≥",
          changed: "At most, not at least.",
          others: ["$\\ge 5$", "$< 5$"],
        }),
        ask("'Under 5' is", "$< 5$", "Under 5 doesn't include 5.", "$< 5$.", {
          asks: "<",
          changed: "Under: 5 itself isn't in.",
          expect: [
            "Is 5 itself 'under 5'?",
            "No",
            "Under 5 means less than 5, so 5 isn't in: $< 5$.",
            [["Yes", "5 isn't under 5. So it's $<$, not $\\le$."]],
          ],
          others: ["$\\le 5$", "$> 5$"],
        }),
        ask("'Over 120 cm' is", "$> 120$", "Over 120 doesn't include 120.", "$> 120$.", {
          asks: ">",
          changed: "Over, not at least.",
          others: ["$\\ge 120$", "$< 120$"],
        }),
      ],
      "'At least' and 'at most' include the number. 'Under' and 'over' don't.",
    ),
    {
      ...own(y7PlaceValue, SIGNS, "Spot the mistake"),
      text: "Under 5s go free. Max writes the rule for age a.",
    } as Screen,

    own(y7PlaceValue, SIGNS, "Exit check"),

    reworded(y7PlaceValue, SIGNS, "Tall enough?", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**The open end faces the bigger number.**"],
      maths("3 < 8 \\qquad 8 > 3"),
      [
        "**The open end faces the bigger number.**",
        "$\\le$: less than or equal to. $\\ge$: greater than or equal to.",
        "'At least 18' is $\\ge 18$. 'Under 5' is $< 5$.",
        "$-3 > -7$",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

export const y7PlaceValueStepped: [string, UnitLesson[]][] = [
  [VALUE, [value]],
  [NEGATIVES, [negatives]],
  [DECIMALS, [decimals]],
  [SIGNS, [signs]],
];
