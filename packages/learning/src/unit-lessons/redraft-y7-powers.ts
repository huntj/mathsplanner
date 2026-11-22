// Year 7, "Powers and roots", on the stepped template (docs/proposals/lesson-stepped.md): squares,
// cubes, higher powers, and roots that aren't whole numbers. The rule is shown as a square of
// squares or a cube of cubes, and the Explore slides a number to watch it squared or cubed.
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
import { find, numberLine, own, reworded, stepped, tagged, words } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { y7Powers } from "./y7-powers.ts";

const NUMBER = "A number check: there is nothing to draw.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });
const square = (n: number): Picture => ({ kind: "grid", cols: n, rows: n, shaded: n * n });
const cube = (n: number): Picture => ({ kind: "cuboid", w: n, d: n, h: n, cubes: true });

// ---------------------------------------------------------------------------------------------
// Squares and square roots.

const SQUARES = "y7-powers/squares";
const squaresMethod = [
  "Squaring: the number times itself.",
  "Square root: what times itself makes it?",
  "Check: square your answer.",
];

const squares = stepped(find(y7Powers, SQUARES), {
  method: squaresMethod,
  variation: {
    relationship: "a number, its square, and the square root that undoes it",
    unknowns: ["square", "root", "side"],
    surface: ["bigger numbers", "negatives", "decimals", "area", "halving mistake"],
  },
  screens: [
    explain(
      "The rule",
      "Squares and square roots",
      ["**A square number makes a square. Its root is the side.**"],
      square(4),
      "$4^2 = 16$, so $\\sqrt{16} = 4$.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: 0,
          max: 12,
          step: 1,
          start: 4,
          tick: 1,
          every: 2,
          dp: 0,
          readouts: [
            { label: "Squared", power: 2 },
            { label: "Times 2", times: 2 },
          ],
        },
        [
          "What did you notice?",
          "Squared grows faster and faster: 1, 4, 9, 16…",
          "Squaring is the number times itself, so it grows fast.",
          [
            ["Squared is the same as times 2", "Look at 4: squared is 16, times 2 is 8."],
            ["Squared goes up by the same each time", "1, 4, 9, 16: the gaps grow."],
          ],
        ],
        "Squaring is the number times itself, not times 2.",
        { text: "Slide the number. Watch it squared, and times 2." },
      ),
    ),

    words(typed("Check you remember", "What is $6 \\times 6$?", "36", "6 sixes.", "36."), NUMBER),
    words(
      typed("Check you remember", "What times itself makes 25?", "5", "Try 5 × 5.", "5."),
      NUMBER,
    ),
    typed(
      "Check you remember",
      "How many small squares make this square?",
      "9",
      "3 rows of 3.",
      "9.",
      { picture: square(3) },
    ),

    methodCard("The method", squaresMethod, maths("9^2 = 81 \\qquad \\sqrt{81} = 9")),
    worked(
      "Watch the method",
      "Work out $9^2$ and $\\sqrt{81}$.",
      [
        { line: "$9^2 = 9 \\times 9 = 81$", note: "Times itself, not times 2." },
        { line: "$\\sqrt{81} = 9$", note: "Because 9 times 9 is 81." },
      ],
      "81 and 9: squaring and rooting undo each other.",
    ),
    words(
      calc(
        "Your turn",
        "Work out $\\sqrt{64} + 3^2$.",
        undefined,
        [
          ["$\\sqrt{64} =$", "8", "What times itself is 64?"],
          ["$3^2 =$", "9", "3 times 3."],
          ["$8 + 9 =$", "17", "Add them."],
        ],
        "17.",
      ),
      NUMBER,
    ),

    words(
      calc(
        "Practise",
        "Work out $15^2$.",
        undefined,
        [
          ["$15^2 = 15 \\times$", "15", "Squaring is times itself."],
          ["$15 \\times 15 =$", "225", "10 × 15 is 150, and 5 × 15 is 75."],
        ],
        "225.",
      ),
      NUMBER,
    ),
    words(
      questionSet(
        "Practise",
        "Square or root? Watch what changes.",
        [
          ask("What is $7^2$?", "49", "7 times 7.", "49.", { asks: "square" }),
          ask("What is $\\sqrt{49}$?", "7", "What times itself is 49?", "7.", {
            asks: "root",
            changed: "Now the root.",
          }),
          ask(
            "A square's area is 36 cm². How long is a side?",
            "6",
            "What times itself is 36?",
            "6 cm.",
            {
              unit: "cm",
              asks: "side",
              changed: "In a shape: area to side.",
            },
          ),
          ask("What is $(-4)^2$?", "16", "−4 times −4.", "16.", {
            asks: "square",
            changed: "A negative number squared.",
            expect: [
              "A negative times a negative is…",
              "positive",
              "−4 × −4 is 16.",
              [["negative", "Two negatives multiply to a positive."]],
            ],
          }),
        ],
        "Square: times itself. Root: what times itself makes it.",
      ),
      NUMBER,
    ),

    words(
      questionSet(
        "Variation",
        "Find each one. Watch what changes.",
        [
          ask("What is $\\sqrt{36}$?", "6", "What times itself is 36?", "6.", {
            asks: "root",
            expect: [
              "Ben halves 36 to get 18. Is $\\sqrt{36} = 18$?",
              "No: it's 6",
              "6 × 6 is 36. Halving isn't rooting.",
              [["Yes", "18 × 18 is 324, not 36."]],
            ],
          }),
          ask("What is $\\sqrt{3600}$?", "60", "60 × 60 = 3600.", "60.", {
            asks: "root",
            changed: "100 times bigger under the root.",
          }),
          ask("What is $\\sqrt{121}$?", "11", "11 × 11 = 121.", "11.", {
            asks: "root",
            changed: "A square past 100.",
          }),
          ask("What is $0.6^2$?", "0.36", "6 × 6 is 36, with two decimal places.", "0.36.", {
            asks: "square",
            changed: "A decimal squared.",
          }),
        ],
        "Rooting undoes squaring, for big numbers, small ones and decimals.",
      ),
      NUMBER,
    ),
    own(y7Powers, SQUARES, "Spot the mistake"),

    own(y7Powers, SQUARES, "Exit check"),

    reworded(y7Powers, SQUARES, "A square lawn", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**A square number makes a square. Its root is the side.**"],
      square(4),
      [
        "**A square number makes a square. Its root is the side.**",
        "Squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100",
        "$9^2 = 9 \\times 9 = 81$, so $\\sqrt{81} = 9$",
        "Squared is times itself, not times 2.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Cubes and cube roots.

const CUBES = "y7-powers/cubes";
const cubesMethod = [
  "Cubing: three of the number, multiplied.",
  "Cube root: what cubed makes it?",
  "Check: cube your answer.",
];

const cubes = stepped(find(y7Powers, CUBES), {
  method: cubesMethod,
  variation: {
    relationship: "a number, its cube, and the cube root that undoes it",
    unknowns: ["cube", "root", "edge"],
    surface: ["bigger numbers", "negatives", "times 3 mistake", "sugar cubes"],
  },
  screens: [
    explain(
      "The rule",
      "Cubes and cube roots",
      ["**A cube number makes a cube. Its cube root is the edge.**"],
      cube(2),
      "$2^3 = 2 \\times 2 \\times 2 = 8$.",
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
          start: 2,
          tick: 1,
          every: 2,
          dp: 0,
          readouts: [
            { label: "Cubed", power: 3 },
            { label: "Squared", power: 2 },
          ],
        },
        [
          "What did you notice?",
          "Cubed grows even faster than squared",
          "Cubing multiplies by the number once more than squaring.",
          [
            ["Cubed is the number times 3", "Look at 3: cubed is 27, not 9."],
            ["Cubed and squared are the same", "Compare them at 3: 27 and 9."],
          ],
        ],
        "Cubing is three of the number multiplied.",
        { text: "Slide the number. Watch it cubed, and squared." },
      ),
    ),

    words(typed("Check you remember", "What is $4 \\times 4$?", "16", "4 fours.", "16."), NUMBER),
    words(
      typed("Check you remember", "What is $16 \\times 4$?", "64", "10 × 4 and 6 × 4.", "64."),
      NUMBER,
    ),
    words(
      typed(
        "Check you remember",
        "What is $2 \\times 2 \\times 2$?",
        "8",
        "2 × 2 is 4, then times 2.",
        "8.",
      ),
      NUMBER,
    ),

    methodCard("The method", cubesMethod, cube(3)),
    worked(
      "Watch the method",
      "Work out $5^3$ and $\\sqrt[3]{1000}$.",
      [
        { line: "$5^3 = 5 \\times 5 \\times 5$", note: "Three 5s, multiplied." },
        { line: "$= 25 \\times 5 = 125$" },
        { line: "$\\sqrt[3]{1000} = 10$", note: "Because 10 × 10 × 10 is 1000." },
      ],
      "125 and 10.",
    ),
    words(
      calc(
        "Your turn",
        "Work out $4^3$.",
        undefined,
        [
          ["$4 \\times 4 =$", "16", "The first two 4s."],
          ["$16 \\times 4 =$", "64", "Times by the last 4."],
        ],
        "64.",
      ),
      NUMBER,
    ),

    words(
      calc(
        "Practise",
        "Work out $\\sqrt[3]{27} + 2^3$.",
        undefined,
        [
          ["$\\sqrt[3]{27} =$", "3", "What cubed is 27?"],
          ["$2^3 =$", "8", "2 × 2 × 2."],
          ["$3 + 8 =$", "11", "Add them."],
        ],
        "11.",
      ),
      NUMBER,
    ),
    questionSet(
      "Practise",
      "Cube or root? Watch what changes.",
      [
        ask("What is $3^3$?", "27", "3 × 3 × 3.", "27.", { asks: "cube", picture: cube(3) }),
        ask("What is $\\sqrt[3]{8}$?", "2", "What cubed is 8?", "2.", {
          asks: "root",
          changed: "Now the cube root.",
          picture: cube(2),
        }),
        ask(
          "64 small cubes make a cube. How long is an edge?",
          "4",
          "What cubed is 64?",
          "4 cubes long.",
          {
            asks: "edge",
            changed: "In a shape: cubes to edge.",
          },
        ),
        ask("What is $10^3$?", "1000", "10 × 10 × 10.", "1000.", {
          asks: "cube",
          changed: "Ten cubed.",
        }),
      ],
      "Cube: three of the number multiplied. Cube root: what cubed makes it.",
    ),

    words(
      questionSet(
        "Variation",
        "Find each one. Watch what changes.",
        [
          ask("What is $2^3$?", "8", "2 × 2 × 2.", "8.", {
            asks: "cube",
            expect: [
              "Sam says $2^3 = 6$. Is he right?",
              "No: it's 8",
              "$2^3$ is 2 × 2 × 2, not 2 × 3.",
              [["Yes", "That's 2 × 3. Cubing is 2 × 2 × 2."]],
            ],
          }),
          ask("What is $(-2)^3$?", "-8", "−2 × −2 × −2.", "−8.", {
            asks: "cube",
            changed: "A negative number cubed.",
            expect: [
              "Three negatives multiplied make…",
              "a negative",
              "−2 × −2 is 4, then 4 × −2 is −8.",
              [["a positive", "Two negatives make a positive; the third makes it negative again."]],
            ],
          }),
          ask("What is $\\sqrt[3]{-8}$?", "-2", "What cubed is −8?", "−2.", {
            asks: "root",
            changed: "A negative under the cube root.",
          }),
          ask("What is $\\sqrt[3]{125}$?", "5", "What cubed is 125?", "5.", {
            asks: "root",
            changed: "A bigger cube.",
          }),
        ],
        "A cube root undoes cubing, even for negatives.",
      ),
      NUMBER,
    ),
    own(y7Powers, CUBES, "Spot the mistake"),

    own(y7Powers, CUBES, "Exit check"),

    reworded(y7Powers, CUBES, "A cube of sugar", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**A cube number makes a cube. Its cube root is the edge.**"],
      cube(2),
      [
        "**A cube number makes a cube. Its cube root is the edge.**",
        "Cubes: 1, 8, 27, 64, 125, 1000",
        "$5^3 = 5 \\times 5 \\times 5 = 125$, so $\\sqrt[3]{125} = 5$",
        "$\\sqrt[3]{-8} = -2$",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Higher powers.

const HIGHER = "y7-powers/higher-powers";
const higherMethod = [
  "The power says how many of the number.",
  "Multiply them, two at a time.",
  "A root goes back: what to that power makes it?",
];

const higherPowers = stepped(find(y7Powers, HIGHER), {
  method: higherMethod,
  variation: {
    relationship: "a number, a power, and the root that undoes it",
    unknowns: ["power", "root", "exponent"],
    surface: ["powers of 2", "powers of 10", "1 to any power", "doubling", "folding paper"],
  },
  screens: [
    explain(
      "The rule",
      "Higher powers",
      ["**The power says how many of the number to multiply.**"],
      maths("2^5 = 2 \\times 2 \\times 2 \\times 2 \\times 2 = 32"),
      "Each step up the powers multiplies by the number again.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: 1,
          max: 5,
          step: 1,
          start: 2,
          tick: 1,
          dp: 0,
          readouts: [
            { label: "To the power 2", power: 2 },
            { label: "To the power 3", power: 3 },
            { label: "To the power 4", power: 4 },
            { label: "To the power 5", power: 5 },
          ],
        },
        [
          "What did you notice?",
          "Each power is the one before, times the number",
          "2, 4, 8, 16, 32: each is the one before times 2.",
          [
            ["Each power adds the number on", "2, 4, 8, 16: it doubles, not adds 2."],
            ["The powers are all the same", "Look at 2: 4, 8, 16, 32."],
          ],
        ],
        "One more power, one more of the number multiplied.",
        { text: "Slide the number. Watch its powers." },
      ),
    ),

    words(typed("Check you remember", "What is $2^3$?", "8", "2 × 2 × 2.", "8."), NUMBER),
    words(typed("Check you remember", "What is $8 \\times 2$?", "16", "Double 8.", "16."), NUMBER),
    words(
      typed(
        "Check you remember",
        "What is $3 \\times 3 \\times 3 \\times 3$?",
        "81",
        "9 × 9.",
        "81.",
      ),
      NUMBER,
    ),

    methodCard("The method", higherMethod, maths("2^6 = 2^5 \\times 2 = 64")),
    worked(
      "Watch the method",
      "Work out $2^6$ and $\\sqrt[4]{16}$.",
      [
        { line: "$2^6 = 2^5 \\times 2$", note: "One more 2 than $2^5$." },
        { line: "$= 32 \\times 2 = 64$" },
        { line: "$\\sqrt[4]{16} = 2$", note: "Because $2^4 = 16$." },
      ],
      "64 and 2.",
    ),
    words(
      calc(
        "Your turn",
        "Work out $5^4$.",
        undefined,
        [
          ["$5 \\times 5 =$", "25", "The first two 5s."],
          ["$25 \\times 5 =$", "125", "Times the third 5."],
          ["$125 \\times 5 =$", "625", "Times the fourth 5."],
        ],
        "625.",
      ),
      NUMBER,
    ),

    words(
      calc(
        "Practise",
        "Work out $\\sqrt[5]{32}$.",
        undefined,
        [
          ["$2^5 =$", "32", "2, 4, 8, 16, 32."],
          ["So $\\sqrt[5]{32} =$", "2", "The number that makes 32 to the power 5."],
        ],
        "2.",
      ),
      NUMBER,
    ),
    words(
      questionSet(
        "Practise",
        "Power or root? Watch what changes.",
        [
          ask("What is $4^3$?", "64", "4 × 4 × 4.", "64.", { asks: "power" }),
          ask("What is $\\sqrt[4]{81}$?", "3", "What to the power 4 is 81?", "3.", {
            asks: "root",
            changed: "Now a root.",
          }),
          ask("$2^{\\square} = 16$. What is the power?", "4", "2, 4, 8, 16: count the 2s.", "4.", {
            asks: "exponent",
            changed: "Now the power is missing.",
          }),
          ask(
            "What is $10^4$?",
            ["10000", "10,000", "10 000"],
            "Four 10s: count the zeros.",
            "10 000.",
            {
              asks: "power",
              changed: "A power of 10.",
            },
          ),
        ],
        "The power counts the numbers multiplied; the root goes back.",
      ),
      NUMBER,
    ),

    words(
      questionSet(
        "Variation",
        "Find each power. Watch what changes.",
        [
          ask("What is $2^5$?", "32", "2, 4, 8, 16, 32.", "32.", {
            asks: "power",
            expect: [
              "Mo says $2^5 = 10$. Is he right?",
              "No: it's 32",
              "$2^5$ is five 2s multiplied, not 2 × 5.",
              [["Yes", "That's 2 × 5. A power multiplies 2 by itself."]],
            ],
          }),
          ask("What is $2^{10}$?", "1024", "$2^5 \\times 2^5 = 32 \\times 32$.", "1024.", {
            asks: "power",
            changed: "Double the power.",
            expect: [
              "$2^{10}$ is $2^5 \\times 2^5$. Is it double 32?",
              "No: it's 32 × 32",
              "Double the power squares the answer: 32 × 32 = 1024.",
              [["Yes: 64", "That's $2^6$. Ten 2s make 1024."]],
            ],
          }),
          ask("What is $1^{20}$?", "1", "1 times 1 is always 1.", "1.", {
            asks: "power",
            changed: "1 to any power.",
          }),
          ask(
            "What is $10^6$?",
            ["1000000", "1,000,000", "1 000 000"],
            "Six zeros.",
            "1 000 000.",
            {
              asks: "power",
              changed: "Powers of 10: count the zeros.",
            },
          ),
        ],
        "A power multiplies; it never just times by the power.",
      ),
      NUMBER,
    ),
    own(y7Powers, HIGHER, "Spot the mistake"),

    own(y7Powers, HIGHER, "Exit check"),

    reworded(y7Powers, HIGHER, "Folding paper", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**The power says how many of the number to multiply.**"],
      maths("2^5 = 2 \\times 2 \\times 2 \\times 2 \\times 2 = 32"),
      [
        "**The power says how many of the number to multiply.**",
        "Powers of 2: 2, 4, 8, 16, 32, 64",
        "$2^6 = 2^5 \\times 2 = 64$",
        "$\\sqrt[4]{16} = 2$, because $2^4 = 16$",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

// ---------------------------------------------------------------------------------------------
// Exact or estimated?

const EXACT = "y7-powers/exact";
const exactMethod = [
  "Find the square numbers either side.",
  "The root is between their roots.",
  "Nearer which square? Estimate from there.",
];

const between = (low: number, n: number, high: number) =>
  numberLine(low, high, 0.1, [[Math.sqrt(n), `√${n}`]], { every: 5 });

const exact = stepped(find(y7Powers, EXACT), {
  method: exactMethod,
  variation: {
    relationship: "a square root between the roots of the squares either side",
    unknowns: ["lower", "upper", "nearest"],
    surface: ["near the lower square", "near the upper square", "exact or not", "areas"],
  },
  screens: [
    explain(
      "The rule",
      "Exact or estimated?",
      ["**A root between two squares is between their roots.**"],
      maths("25 < 30 < 36, \\text{ so } 5 < \\sqrt{30} < 6"),
      "Only square numbers have whole-number square roots.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: 0,
          max: 100,
          step: 1,
          start: 30,
          tick: 5,
          every: 4,
          dp: 0,
          readouts: [
            { label: "The number", value: true },
            { label: "Square root", power: 0.5, dp: 2 },
          ],
        },
        [
          "What did you notice?",
          "Only square numbers give a whole-number root",
          "25, 36, 49…: their roots are whole. Others fall in between.",
          [
            ["Every root is a whole number", "Try 30: its root is 5.48."],
            ["The root is half the number", "The root of 36 is 6, not 18."],
          ],
        ],
        "Square numbers have whole roots. The rest are in between.",
        { text: "Slide the number. Watch its square root." },
      ),
    ),

    words(typed("Check you remember", "What is $\\sqrt{25}$?", "5", "5 × 5 = 25.", "5."), NUMBER),
    words(typed("Check you remember", "What is $\\sqrt{36}$?", "6", "6 × 6 = 36.", "6."), NUMBER),
    words(
      choose("Check you remember", "Is 30 a square number?", "No", "5 × 5 is 25; 6 × 6 is 36.", [
        ["Yes", "No whole number times itself makes 30."],
      ]),
      NUMBER,
    ),

    methodCard("The method", exactMethod, between(9, 90, 10)),
    worked(
      "Watch the method",
      "Estimate $\\sqrt{90}$.",
      [
        { line: "$9^2 = 81$ and $10^2 = 100$", note: "The squares either side of 90." },
        { line: "So $\\sqrt{90}$ is between 9 and 10." },
        { line: "90 is about halfway: about 9.5." },
      ],
      "About 9.5 (it's 9.49).",
      between(9, 90, 10),
    ),
    calc(
      "Your turn",
      "Estimate $\\sqrt{20}$.",
      between(4, 20, 5),
      [
        ["The square below 20 is", "16", "4 × 4."],
        ["The square above 20 is", "25", "5 × 5."],
        ["So $\\sqrt{20}$ is between 4 and", "5", "The roots of 16 and 25."],
      ],
      "Between 4 and 5: about 4.5.",
    ),

    calc(
      "Practise",
      "Estimate $\\sqrt{99}$ to the nearest whole number.",
      between(9, 99, 10),
      [
        ["The squares either side are 81 and", "100", "9 × 9 and 10 × 10."],
        ["$\\sqrt{99} \\approx$", "10", "99 is much nearer 100."],
      ],
      "About 10.",
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("$\\sqrt{50}$ is between 7 and…", "8", "49 < 50 < 64.", "8.", {
          asks: "upper",
          picture: between(7, 50, 8),
        }),
        ask("$\\sqrt{75}$ is between … and 9", "8", "64 < 75 < 81.", "8.", {
          asks: "lower",
          changed: "Now the lower one.",
          picture: between(8, 75, 9),
        }),
        ask(
          "Estimate $\\sqrt{17}$ to the nearest whole number.",
          "4",
          "17 is just past 16.",
          "4.",
          {
            asks: "nearest",
            changed: "Now the nearest whole number.",
          },
        ),
        ask(
          "Estimate $\\sqrt{60}$ to the nearest whole number.",
          "8",
          "60 is nearer 64 than 49.",
          "8.",
          {
            asks: "nearest",
            changed: "Nearer the square above.",
          },
        ),
      ],
      "Find the squares either side, then see which is nearer.",
    ),
    reworded(y7Powers, EXACT, "Exact whole number, or not?", { tag: "Practise" }),

    words(
      questionSet(
        "Variation",
        "Whole number or not? Watch what changes.",
        [
          ask("Is $\\sqrt{49}$ a whole number?", "Yes: 7", "49 is a square number.", "Yes: 7.", {
            asks: "nearest",
            others: ["No"],
          }),
          ask(
            "Is $\\sqrt{50}$ a whole number?",
            "No",
            "50 isn't a square number.",
            "No: about 7.07.",
            {
              asks: "nearest",
              changed: "One more than 49.",
              others: ["Yes: 7"],
            },
          ),
          ask("$\\sqrt{40}$ is about…", "6.3", "36 < 40 < 49.", "About 6.3.", {
            asks: "nearest",
            changed: "Tia says it's 20. Watch out.",
            others: ["20", "6.9"],
            expect: [
              "Tia halves 40 to get 20. Is that the root?",
              "No: $20^2$ is 400",
              "The root is between 6 and 7, as 40 is between 36 and 49.",
              [["Yes", "20 × 20 is 400, not 40."]],
            ],
          }),
          ask("What is $\\sqrt{400}$?", "20", "20 × 20 = 400.", "20.", {
            asks: "nearest",
            changed: "100 times 4: a square number.",
          }),
        ],
        "A square number has an exact root. Any other root is between two whole numbers.",
      ),
      NUMBER,
    ),
    own(y7Powers, EXACT, "Spot the mistake"),

    own(y7Powers, EXACT, "Exit check"),

    reworded(y7Powers, EXACT, "A square table", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**A root between two squares is between their roots.**"],
      maths("25 < 30 < 36, \\text{ so } 5 < \\sqrt{30} < 6"),
      [
        "**A root between two squares is between their roots.**",
        "Find the squares either side, then the nearer one.",
        "$\\sqrt{90}$: 81 < 90 < 100, so about 9.5",
        "$\\sqrt{49} = 7$ is exact. $\\sqrt{50}$ is not.",
      ],
      "Copy this into your book to revise from.",
    ),
  ],
});

export const y7PowersStepped: [string, UnitLesson[]][] = [
  [SQUARES, [squares]],
  [CUBES, [cubes]],
  [HIGHER, [higherPowers]],
  [EXACT, [exact]],
];
