// GCSE Higher, "Fractions, decimals and bounds", on the stepped template
// (docs/proposals/lesson-stepped.md): recurring decimals to fractions, fractions to recurring
// decimals, and calculating with bounds. Number work is its own picture.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { ghFdp } from "./gh-fdp.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const FD = ghFdp;
const NUMBER = "A number fact: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const steps = (...lines: string[]): Picture =>
  maths(`\\begin{array}{l} ${lines.join(" \\\\ ")} \\end{array}`);
const table = (head: string[], rows: string[][]): Picture => ({ kind: "table", head, rows });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Recurring decimals to fractions.

const TO_FRAC = "gh-fdp/recurring-to-fraction";
const toFracMethod = [
  "Let $x$ be the decimal.",
  "× 10, 100 or 1000: one, two or three repeating digits.",
  "Subtract, solve, simplify.",
];
const LINE_UP = steps(
  "x = 0.\\dot{1}\\dot{8}",
  "100x = 18.\\dot{1}\\dot{8}",
  "99x = 18,\\ x = \\frac{18}{99} = \\frac{2}{11}",
);
const fraction = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Repeating digits over 9s.", { asks: "fraction", ...extra });

const toFraction = stepped(find(FD, TO_FRAC), {
  method: toFracMethod,
  variation: {
    relationship: "repeats lined up and subtracted",
    unknowns: ["multiplier", "fraction"],
    surface: ["two digits repeat", "a digit before the repeat", "three digits"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Line up the repeats",
        ["**Multiply so the repeats line up, then subtract to remove them.**"],
        LINE_UP,
        "Two repeating digits: × 100.",
      ),
      reworded(FD, TO_FRAC, "For $0.\\dot{1}2\\dot{3}$, multiply by", { tag: "The rule" }),

      ...owned(FD, TO_FRAC, "Warm-up", "Check you remember"),

      methodCard("The method", toFracMethod, LINE_UP),
      workedFrom(FD, TO_FRAC),
      calc(
        "Your turn",
        "Write $0.\\dot{3}\\dot{6}$ as a fraction.",
        undefined,
        [
          ["$100x - x = ?x$, ? =", "99", "Two digits repeat."],
          ["$99x =$", "36", "36.36… − 0.36…"],
          ["Simplified: $\\frac{4}{?}$, ? =", "11", "÷ 9."],
        ],
        "$0.\\dot{3}\\dot{6} = \\frac{4}{11}$.",
      ),

      calc(
        "Practise",
        "Write $0.1\\dot{6}$ as a fraction.",
        undefined,
        [
          ["$100x - 10x = ?x$, ? =", "90", "Line up the 6s."],
          ["$90x =$", "15", "16.6… − 1.6…"],
          ["Simplified: $\\frac{1}{?}$, ? =", "6", "÷ 15."],
        ],
        "$0.1\\dot{6} = \\frac16$.",
      ),
      ...owned(FD, TO_FRAC, "Together", "Practise"),
      ...owned(FD, TO_FRAC, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Multiply by? Watch what changes.",
        [
          pick("$0.\\dot{4}$", "10", ["100", "1000"], "One digit repeats.", {
            asks: "multiplier",
          }),
          pick("$0.\\dot{4}\\dot{5}$", "100", ["10", "1000"], "Two digits repeat.", {
            asks: "multiplier",
            changed: "Two digits.",
          }),
          pick("$0.\\dot{4}5\\dot{6}$", "1000", ["100", "10"], "Three digits repeat.", {
            asks: "multiplier",
            changed: "Three digits.",
          }),
          pick("$0.4\\dot{5}$", "10, then 100", ["100", "1000"], "Line up the repeating 5s.", {
            asks: "multiplier",
            changed: "A digit before the repeat.",
          }),
        ],
        "One power of 10 for each repeating digit.",
      ),

      questionSet(
        "Variation",
        "As a fraction. Watch what changes.",
        [
          fraction(
            "$0.\\dot{3}\\dot{6}$",
            "$\\frac{4}{11}$",
            ["$\\frac{9}{25}$", "$\\frac{36}{100}$"],
            {
              expect: [
                "For $0.\\dot{3}\\dot{6}$, Ben multiplies by 10. Will the repeats line up?",
                "No",
                "Two digits repeat: × 100 lines them up.",
                [["Yes", "How many digits repeat?"]],
              ],
            },
          ),
          fraction("$0.\\dot{6}$", "$\\frac23$", ["$\\frac{6}{10}$", "$\\frac{6}{99}$"], {
            changed: "One digit.",
          }),
          fraction("$0.\\dot{0}\\dot{6}$", "$\\frac{2}{33}$", ["$\\frac23$", "$\\frac{6}{100}$"], {
            changed: "A zero first.",
          }),
          fraction(
            "$0.\\dot{1}2\\dot{3}$",
            "$\\frac{41}{333}$",
            ["$\\frac{123}{1000}$", "$\\frac{123}{99}$"],
            {
              changed: "Three digits.",
            },
          ),
        ],
        "The repeating block over that many 9s, then simplify.",
      ),
      own(FD, TO_FRAC, "Spot the mistake"),

      own(FD, TO_FRAC, "Exit check"),

      reworded(
        FD,
        TO_FRAC,
        "“Prove $0.\\dot{4}\\dot{5} = \\frac{5}{11}$.” The key line:",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply so the repeats line up, then subtract to remove them.**"],
        LINE_UP,
        [
          "**Multiply so the repeats line up, then subtract to remove them.**",
          "$0.\\dot{6} = \\frac23$, not $\\frac{6}{10}$.",
          "Two repeating digits: × 100.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Fractions to recurring decimals.

const TO_DEC = "gh-fdp/fraction-to-recurring";
const toDecMethod = [
  "Simplify the fraction.",
  "Bottom only 2s and 5s: it terminates.",
  "Otherwise divide until a remainder repeats.",
];
const PRIMES = table(
  ["Fraction", "Bottom", "Decimal"],
  [
    ["$\\frac38$", "$2^3$", "0.375"],
    ["$\\frac{3}{11}$", "11", "$0.\\dot{2}\\dot{7}$"],
  ],
);
const ends = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Simplify, then look at the bottom's primes.", {
    asks: "terminates",
    ...extra,
  });

const toRecurring = stepped(find(FD, TO_DEC), {
  method: toDecMethod,
  variation: {
    relationship: "the denominator's primes decide",
    unknowns: ["terminates", "decimal"],
    surface: ["a factor of 3", "simplifies first", "sevenths"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Remainders repeat",
        ["**A fraction terminates only if its bottom has no primes but 2 and 5.**"],
        PRIMES,
        "Otherwise the remainders repeat, and so do the digits.",
      ),
      reworded(FD, TO_DEC, "Which terminates?", { tag: "The rule" }),

      ...owned(FD, TO_DEC, "Warm-up", "Check you remember"),

      methodCard("The method", toDecMethod, PRIMES),
      workedFrom(FD, TO_DEC),
      calc(
        "Your turn",
        "Write $\\frac{5}{11}$ as a decimal.",
        undefined,
        [
          ["$50 \\div 11 = 4$ r", "6", "44 from 50."],
          ["$60 \\div 11 = 5$ r", "5", "55 from 60: back to 5."],
        ],
        "$\\frac{5}{11} = 0.\\dot{4}\\dot{5}$.",
      ),

      calc(
        "Practise",
        "Write $\\frac{7}{12}$ as a decimal.",
        undefined,
        [
          ["$70 \\div 12 = 5$ r", "10", "60 from 70."],
          ["$100 \\div 12 = 8$ r", "4", "96 from 100."],
          ["$40 \\div 12 = 3$ r", "4", "Remainder 4 again."],
        ],
        "$\\frac{7}{12} = 0.58\\dot{3}$.",
      ),
      ...owned(FD, TO_DEC, "Together", "Practise"),
      ...owned(FD, TO_DEC, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Terminating or recurring? Watch what changes.",
        [
          ends("$\\frac{3}{20}$", "Terminates", ["Recurs"]),
          ends("$\\frac{3}{30}$", "Terminates: it's $\\frac{1}{10}$", ["Recurs: 30 has a 3"], {
            changed: "Simplifies.",
          }),
          ends("$\\frac{1}{30}$", "Recurs", ["Terminates"], { changed: "A 3 that stays." }),
          ends("$\\frac{7}{14}$", "Terminates: it's $\\frac12$", ["Recurs: 14 has a 7"], {
            changed: "Simplifies again.",
          }),
        ],
        "Simplify before you judge.",
      ),

      questionSet(
        "Variation",
        "As a decimal. Watch what changes.",
        [
          pick(
            "$\\frac17$",
            "$0.\\dot{1}4285\\dot{7}$",
            ["0.142857", "It never repeats"],
            "Only 6 remainders are possible.",
            {
              asks: "decimal",
              expect: [
                "Leo says $\\frac17 = 0.142857\\ldots$ never repeats. Right?",
                "No",
                "Only 6 remainders are possible, so they must repeat.",
                [["Yes", "How many remainders can you get dividing by 7?"]],
              ],
            },
          ),
          pick("$\\frac19$", "$0.\\dot{1}$", ["0.9", "$0.\\dot{0}\\dot{9}$"], "1 ÷ 9.", {
            asks: "decimal",
            changed: "Ninths.",
          }),
          pick("$\\frac{1}{11}$", "$0.\\dot{0}\\dot{9}$", ["$0.\\dot{1}$", "0.11"], "1 ÷ 11.", {
            asks: "decimal",
            changed: "Elevenths.",
          }),
          pick("$\\frac16$", "$0.1\\dot{6}$", ["$0.\\dot{1}\\dot{6}$", "0.6"], "1 ÷ 6.", {
            asks: "decimal",
            changed: "Sixths.",
          }),
        ],
        "Dots go over the first and last repeating digits.",
      ),
      own(FD, TO_DEC, "Spot the mistake"),

      own(FD, TO_DEC, "Exit check"),

      reworded(
        FD,
        TO_DEC,
        "“Write $\\frac{3}{11}$ as a recurring decimal.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A fraction terminates only if its bottom has no primes but 2 and 5.**"],
        PRIMES,
        [
          "**A fraction terminates only if its bottom has no primes but 2 and 5.**",
          "Simplify first.",
          "A repeated remainder means repeating digits.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Calculating with bounds.

const BOUNDS = "gh-fdp/bounds";
const boundsMethod = [
  "Find each value's bounds: half a unit either side.",
  "+ or ×: upper with upper for the biggest.",
  "− or ÷: upper with lower for the biggest.",
];
const PUSH = table(
  ["To get the biggest", "Use"],
  [
    ["$a + b$, $a \\times b$", "upper $a$, upper $b$"],
    ["$a - b$, $a \\div b$", "upper $a$, lower $b$"],
  ],
);
const bound = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Which bound of each pushes it furthest?", {
    asks: "bound",
    ...extra,
  });

const bounds = stepped(find(FD, BOUNDS), {
  method: boundsMethod,
  variation: {
    relationship: "bounds that push an answer furthest",
    unknowns: ["limits", "bound"],
    surface: ["lower, not upper", "a difference", "a quotient"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Biggest over smallest",
        ["**Pick the bound of each value that pushes the answer furthest.**"],
        PUSH,
        "To divide and get the most, divide by the least.",
      ),
      reworded(FD, BOUNDS, "Upper bound of speed = distance ÷ time uses", { tag: "The rule" }),

      ...owned(FD, BOUNDS, "Warm-up", "Check you remember"),

      methodCard("The method", boundsMethod, PUSH),
      workedFrom(FD, BOUNDS),
      calc(
        "Your turn",
        "A field is 40 m by 25 m, to the nearest metre.",
        undefined,
        [
          ["Upper bound of the length:", "40.5", "Half a metre more."],
          ["Upper bound of the area:", "1032.75", "40.5 × 25.5.", { after: "m²" }],
        ],
        "1032.75 m².",
      ),

      calc(
        "Practise",
        "$a = 12$, $b = 4$, each to the nearest whole number.",
        undefined,
        [["Upper bound of $a \\div b$, to 3 s.f.:", "3.57", "12.5 ÷ 3.5."]],
        "3.57.",
      ),
      reworded(
        FD,
        BOUNDS,
        "A rectangle is 6 cm by 4 cm, both to the nearest cm. Lower bound of the area?",
        {
          tag: "Practise",
        },
      ),
      reworded(
        FD,
        BOUNDS,
        "$a = 20$ and $b = 8$, both to the nearest whole number. Upper bound of $a - b$",
        {
          tag: "Practise",
          title: "$a = 20$, $b = 8$, to the nearest whole. Upper bound of $a - b$",
        },
      ),
      reworded(FD, BOUNDS, "Upper bound of 3.4 + 2.7, each to 1 d.p.", { tag: "Practise" }),
      reworded(
        FD,
        BOUNDS,
        "Lower bound of $\\frac{40}{5}$, each to the nearest whole number. Give it to 3 s.f.",
        { tag: "Practise", title: "Lower bound of $\\frac{40}{5}$ (nearest wholes), to 3 s.f." },
      ),
      questionSet(
        "Practise",
        "The bounds. Watch what changes.",
        [
          pick(
            "8, to the nearest whole number",
            "7.5 to 8.5",
            ["7 to 9", "7.9 to 8.1"],
            "Half a unit.",
            {
              asks: "limits",
            },
          ),
          pick("8.4, to 1 d.p.", "8.35 to 8.45", ["8.3 to 8.5", "8.0 to 9.0"], "Half of 0.1.", {
            asks: "limits",
            changed: "To 1 d.p.",
          }),
          pick("80, to the nearest 10", "75 to 85", ["79.5 to 80.5", "70 to 90"], "Half of 10.", {
            asks: "limits",
            changed: "Nearest 10.",
          }),
          pick(
            "8.40, to 2 d.p.",
            "8.395 to 8.405",
            ["8.35 to 8.45", "8.39 to 8.41"],
            "Half of 0.01.",
            {
              asks: "limits",
              changed: "To 2 d.p.",
            },
          ),
        ],
        "Half the unit of rounding either side.",
      ),

      questionSet(
        "Variation",
        "$x = 9.2$, $y = 3.6$, both to 1 d.p. Watch what changes.",
        [
          bound("Lower bound of $x - y$", "5.5", ["5.6", "5.55"], {
            expect: [
              "For the lower bound of $x - y$, Zoe uses the lower bound of $y$. Right?",
              "No",
              "Take away the most: upper $y$. $9.15 - 3.65 = 5.5$.",
              [["Yes", "Does taking away more give less?"]],
            ],
          }),
          bound("Upper bound of $x - y$", "5.7", ["5.6", "5.65"], { changed: "Upper." }),
          bound("Upper bound of $x + y$", "12.9", ["12.8", "12.85"], { changed: "A sum." }),
          bound("Lower bound of $x + y$", "12.7", ["12.8", "12.75"], { changed: "Lower sum." }),
        ],
        "Sums: like with like. Differences: opposite bounds.",
      ),
      reworded(
        FD,
        BOUNDS,
        "Where did it go wrong?",
        { text: "Zoe: lower bound of $x - y$ when $x = 9.2$, $y = 3.6$ (1 d.p.)." },
        "Spot the mistake",
      ),

      own(FD, BOUNDS, "Exit check"),

      reworded(
        FD,
        BOUNDS,
        "“Find the upper bound of her speed, to 3 s.f.”",
        { tag: "Real life", title: "100 m (nearest m) in 12.3 s (1 d.p.). Upper bound of speed?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Pick the bound of each value that pushes the answer furthest.**"],
        PUSH,
        [
          "**Pick the bound of each value that pushes the answer furthest.**",
          "Bounds: half a unit either side.",
          "÷ by the lower bound to get the upper bound.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const ghFdpStepped: [string, UnitLesson[]][] = [
  [TO_FRAC, [toFraction]],
  [TO_DEC, [toRecurring]],
  [BOUNDS, [bounds]],
];
