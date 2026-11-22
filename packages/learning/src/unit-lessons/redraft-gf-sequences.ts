// GCSE Foundation, "Sequences", on the stepped template (docs/proposals/lesson-stepped.md):
// term-to-term and position-to-term rules, special numbers, arithmetic and geometric, Fibonacci
// type, quadratic sequences and the nth term. Growing patterns are drawn as stacks and dots;
// tables of terms are tables.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfSequences } from "./gf-sequences.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const SQ = gfSequences;
const NUMBER = "A number pattern: the terms are the picture.";
const stacks = (...counts: number[]): Picture => ({ kind: "stacks", counts });
const table = (head: string[], rows: string[][]): Picture => ({ kind: "table", head, rows });
const neg = (n: number): string[] => [`${n}`, `−${-n}`];
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Term-to-term rules.

const TERM = "gf-sequences/term-to-term";
const termMethod = [
  "Find what turns each term into the next.",
  "Check it works all the way along.",
  "Use it from the first term to go on.",
];
const PLUS3 = stacks(2, 5, 8, 11);

const termToTerm = stepped(find(SQ, TERM), {
  method: termMethod,
  variation: {
    relationship: "a term-to-term rule and the terms it makes",
    unknowns: ["next"],
    surface: ["adding", "multiplying", "below zero"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "From one term to the next",
        ["**A term-to-term rule gets each term from the one before.**"],
        PLUS3,
        "+3 each time, from a first term of 2.",
      ),
      reworded(SQ, TERM, "The rule for 40, 34, 28, 22, …", { tag: "The rule" }),

      ...owned(SQ, TERM, "Warm-up", "Check you remember"),

      methodCard("The method", termMethod, PLUS3),
      workedFrom(SQ, TERM),
      calc(
        "Your turn",
        "First term 3; rule: × 2, then − 1.",
        undefined,
        [
          ["2nd term:", "5", "3 × 2 − 1."],
          ["3rd term:", "9", "5 × 2 − 1."],
          ["4th term:", "17", "9 × 2 − 1."],
        ],
        "3, 5, 9, 17.",
      ),

      calc(
        "Practise",
        "Continue 1.2, 1.9, 2.6, 3.3, …",
        undefined,
        [
          ["Rule: add", "0.7", "1.9 − 1.2."],
          ["Next term:", "4", "3.3 + 0.7."],
        ],
        "4.0.",
      ),
      ...owned(SQ, TERM, "Together", "Practise"),
      ...owned(SQ, TERM, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The next term? Watch what changes.",
        [
          ask("4, 9, 14, 19, …", "24", "Add 5.", "24.", { asks: "next" }),
          ask("4, 8, 16, 32, …", "64", "Double.", "64.", { asks: "next", changed: "Multiply." }),
          ask("40, 33, 26, 19, …", "12", "Take 7.", "12.", {
            asks: "next",
            changed: "Going down.",
          }),
          ask("2, 5, 11, 23, …", "47", "Double, add 1.", "47.", {
            asks: "next",
            changed: "Two steps.",
          }),
        ],
        "Find the rule from the first two, check it, then use it.",
      ),

      questionSet(
        "Variation",
        "Subtract each time. Watch what changes.",
        [
          ask("15, 10, 5, …", "0", "Take 5.", "0.", {
            asks: "next",
            expect: [
              "Kim goes on 15, 10, 5, 0, 5. Right?",
              "No",
              "Keep subtracting 5: 0, then −5.",
              [["Yes", "What is 0 − 5?"]],
            ],
          }),
          ask("15, 10, 5, 0, …", neg(-5), "Take 5.", "−5.", {
            asks: "next",
            changed: "Below zero.",
          }),
          ask("3, 1, −1, …", neg(-3), "Take 2.", "−3.", { asks: "next", changed: "Take 2." }),
          ask("−8, −4, 0, …", "4", "Add 4.", "4.", { asks: "next", changed: "Going up." }),
        ],
        "A rule keeps going past zero.",
      ),
      own(SQ, TERM, "Spot the mistake"),

      own(SQ, TERM, "Exit check"),

      reworded(
        SQ,
        TERM,
        "“Mia has £5 and adds £3 a week. How much after 6 weeks?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A term-to-term rule gets each term from the one before.**"],
        PLUS3,
        [
          "**A term-to-term rule gets each term from the one before.**",
          "2, 4, 8, 16 is × 2, not + 2.",
          "You need the first term too.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Position-to-term rules.

const POSITION = "gf-sequences/position-to-term";
const posMethod = [
  "Put the position in for n.",
  "Work it out: × before + and −.",
  "Is it a term? Solve for n: it must be whole.",
];
const NTH = table(["n", "1", "2", "3", "4"], [["$2n + 3$", "5", "7", "9", "11"]]);

const positionToTerm = stepped(find(SQ, POSITION), {
  method: posMethod,
  variation: {
    relationship: "the nth term and any term from its position",
    unknowns: ["term"],
    surface: ["far terms", "minus signs", "squares"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Substitute the position",
        ["**The nth term gives any term from its position, n.**"],
        NTH,
        "Put n in: the 10th term is 23.",
      ),
      reworded(SQ, POSITION, "The 5th term of $3n + 2$", { tag: "The rule" }),

      ...owned(SQ, POSITION, "Warm-up", "Check you remember"),

      methodCard("The method", posMethod, NTH),
      workedFrom(SQ, POSITION),
      calc(
        "Your turn",
        "nth term $6n - 4$.",
        undefined,
        [
          ["1st term:", "2", "6 × 1 − 4."],
          ["10th term:", "56", "6 × 10 − 4."],
        ],
        "2 and 56.",
      ),

      calc(
        "Practise",
        "Is 77 a term of $5n + 2$?",
        undefined,
        [
          ["$5n =$", "75", "Take 2."],
          ["$n =$", "15", "A whole number."],
        ],
        "Yes: the 15th term.",
      ),
      ...owned(SQ, POSITION, "Together", "Practise"),
      ...owned(SQ, POSITION, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find the term. Watch what changes.",
        [
          ask("$3n + 1$: the 5th term", "16", "3 × 5 + 1.", "16.", { asks: "term" }),
          ask("$3n + 1$: the 50th term", "151", "3 × 50 + 1.", "151.", {
            asks: "term",
            changed: "Further on.",
          }),
          ask("$3n - 1$: the 5th term", "14", "3 × 5 − 1.", "14.", {
            asks: "term",
            changed: "Minus 1.",
          }),
          ask("$20 - 3n$: the 5th term", "5", "20 − 15.", "5.", {
            asks: "term",
            changed: "Going down.",
          }),
        ],
        "Put n in, then × before − or +.",
      ),

      questionSet(
        "Variation",
        "The 10th term. Watch what changes.",
        [
          ask("$2n^2$", "200", "2 × 100.", "200.", {
            asks: "term",
            expect: [
              "For $2n^2$, Mo works out $(2 \\times 10)^2 = 400$. Right?",
              "No",
              "Square first: $2 \\times 10^2 = 200$.",
              [["Yes", "What does the square apply to?"]],
            ],
          }),
          ask("$(2n)^2$", "400", "20 squared.", "400.", { asks: "term", changed: "Brackets." }),
          ask("$n^2 + 2$", "102", "100 + 2.", "102.", { asks: "term", changed: "Plus 2." }),
          ask("$2n^2 - 1$", "199", "200 − 1.", "199.", { asks: "term", changed: "Minus 1." }),
        ],
        "Powers before multiplying.",
      ),
      own(SQ, POSITION, "Spot the mistake"),

      own(SQ, POSITION, "Exit check"),

      reworded(
        SQ,
        POSITION,
        "“nth term $4n - 1$. Work out the 100th term.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The nth term gives any term from its position, n.**"],
        NTH,
        [
          "**The nth term gives any term from its position, n.**",
          "$3n + 4$ at $n = 2$ is 10, not 34.",
          "A whole n means it's a term.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Square, cube and triangular numbers.

const SPECIAL = "gf-sequences/special-numbers";
const specialMethod = ["Square: n × n.", "Cube: n × n × n.", "Triangular: add 1, then 2, then 3…"];
const TRIANGLES: Picture = { kind: "dots", shape: "triangle", terms: 4 };

const special = stepped(find(SQ, SPECIAL), {
  method: specialMethod,
  variation: {
    relationship: "square, cube and triangular numbers",
    unknowns: ["type", "cube"],
    surface: ["squares", "cubes", "triangles", "both"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three families",
        ["**Squares are n², cubes are n³, triangular numbers go 1, 3, 6, 10…**"],
        TRIANGLES,
        "Each triangle adds one more row.",
      ),
      reworded(SQ, SPECIAL, "The 6th triangular number", { tag: "The rule" }),

      ...owned(SQ, SPECIAL, "Warm-up", "Check you remember"),

      methodCard("The method", specialMethod, TRIANGLES),
      workedFrom(SQ, SPECIAL),
      calc(
        "Your turn",
        "The square numbers.",
        { kind: "dots", shape: "square", terms: 4 },
        [
          ["5th:", "25", "5 × 5."],
          ["10th:", "100", "10 × 10."],
        ],
        "25 and 100.",
      ),

      calc(
        "Practise",
        "The triangular numbers.",
        { kind: "dots", shape: "triangle", terms: 5 },
        [
          ["9th:", "45", "36 + 9."],
          ["10th:", "55", "45 + 10."],
        ],
        "45 and 55.",
      ),
      ...owned(SQ, SPECIAL, "Together", "Practise"),
      ...owned(SQ, SPECIAL, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "What kind? Watch what changes.",
        [
          pick("49 is", "square", ["cube", "triangular"], "7 × 7.", { asks: "type" }),
          pick("27 is", "cube", ["square", "triangular"], "3 × 3 × 3.", {
            asks: "type",
            changed: "Odd.",
          }),
          pick("21 is", "triangular", ["square", "cube"], "1 + 2 + … + 6.", {
            asks: "type",
            changed: "Neither power.",
          }),
          pick("64 is", "square and cube", ["square only", "cube only"], "8² and 4³.", {
            asks: "type",
            changed: "Both.",
          }),
        ],
        "Test each family.",
      ),

      questionSet(
        "Variation",
        "Cube numbers. Watch what changes.",
        [
          ask("$2^3$", "8", "2 × 2 × 2.", "8.", {
            asks: "cube",
            expect: [
              "Ida says $2^3 = 6$. Right?",
              "No",
              "$2 \\times 2 \\times 2 = 8$.",
              [["Yes", "Is cubing the same as × 3?"]],
            ],
          }),
          ask("$3^3$", "27", "3 × 3 × 3.", "27.", { asks: "cube", changed: "3." }),
          ask("$4^3$", "64", "4 × 4 × 4.", "64.", { asks: "cube", changed: "4." }),
          ask("$10^3$", "1000", "10 × 10 × 10.", "1000.", { asks: "cube", changed: "10." }),
        ],
        "Cubing multiplies three times.",
      ),
      own(SQ, SPECIAL, "Spot the mistake"),

      own(SQ, SPECIAL, "Exit check"),

      reworded(
        SQ,
        SPECIAL,
        "“Write down a number that is both square and triangular.”",
        { tag: "Real life", title: "A number that's both square and triangular?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Squares are n², cubes are n³, triangular numbers go 1, 3, 6, 10…**"],
        TRIANGLES,
        [
          "**Squares are n², cubes are n³, triangular numbers go 1, 3, 6, 10…**",
          "$2^3 = 8$, not 6.",
          "36 is square and triangular.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Arithmetic and geometric sequences.

const AG = "gf-sequences/arithmetic-geometric";
const agMethod = [
  "Take each term from the next: the same gap? Arithmetic.",
  "Divide each by the one before: the same ratio? Geometric.",
  "Use the gap or ratio to go on.",
];
const DOUBLING = stacks(1, 2, 4, 8);

const arithGeom = stepped(find(SQ, AG), {
  method: agMethod,
  variation: {
    relationship: "a common difference or a common ratio",
    unknowns: ["type", "next"],
    surface: ["growing gaps", "negative ratios", "decimal ratios"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Add or multiply",
        ["**Arithmetic adds the same amount; geometric multiplies by the same amount.**"],
        DOUBLING,
        "Each column doubles: geometric, ratio 2.",
      ),
      reworded(SQ, AG, "2, 10, 50, 250 is", { tag: "The rule" }),

      ...owned(SQ, AG, "Warm-up", "Check you remember"),

      methodCard("The method", agMethod, DOUBLING),
      workedFrom(SQ, AG),
      calc(
        "Your turn",
        "Continue 5, 15, 45, …",
        undefined,
        [
          ["Ratio:", "3", "15 ÷ 5."],
          ["Next:", "135", "45 × 3."],
        ],
        "Geometric: 135.",
      ),

      calc(
        "Practise",
        "Continue 64, 32, 16, …",
        undefined,
        [
          ["Ratio:", "0.5", "32 ÷ 64."],
          ["Next:", "8", "16 × 0.5."],
        ],
        "Geometric: 8.",
      ),
      ...owned(SQ, AG, "Together", "Practise"),
      ...owned(SQ, AG, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "What type? Watch what changes.",
        [
          pick("4, 8, 12, 16", "arithmetic", ["geometric", "neither"], "+4 each time.", {
            asks: "type",
          }),
          pick("4, 8, 16, 32", "geometric", ["arithmetic", "neither"], "× 2 each time.", {
            asks: "type",
            changed: "Doubling.",
          }),
          pick("4, 8, 14, 22", "neither", ["arithmetic", "geometric"], "Gaps 4, 6, 8.", {
            asks: "type",
            changed: "Growing gaps.",
          }),
          pick("32, 16, 8, 4", "geometric", ["arithmetic", "neither"], "× ½.", {
            asks: "type",
            changed: "Halving.",
          }),
        ],
        "Check the gaps, then the ratios.",
      ),

      questionSet(
        "Variation",
        "The next term? Watch what changes.",
        [
          ask("2, 8, 32, …", "128", "× 4.", "128.", {
            asks: "next",
            expect: [
              "For 2, 8, 32, Mo says +6, so 38. Right?",
              "No",
              "8 − 2 = 6, but 32 − 8 = 24: it's × 4.",
              [["Yes", "Check the next gap."]],
            ],
          }),
          ask("2, 8, 14, …", "20", "+6.", "20.", { asks: "next", changed: "Same gaps." }),
          ask("2, −4, 8, …", neg(-16), "× −2.", "−16.", {
            asks: "next",
            changed: "A negative ratio.",
          }),
          ask("2, 3, 4.5, …", "6.75", "× 1.5.", "6.75.", { asks: "next", changed: "Ratio 1.5." }),
        ],
        "Check the rule works for every pair.",
      ),
      own(SQ, AG, "Spot the mistake"),

      own(SQ, AG, "Exit check"),

      reworded(
        SQ,
        AG,
        "“Bea's savings: 100, 110, 121, 133.1. What type of sequence? Give the next term.”",
        { tag: "Real life", title: "100, 110, 121, 133.1: what type? The next term?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Arithmetic adds the same amount; geometric multiplies by the same amount.**"],
        DOUBLING,
        [
          "**Arithmetic adds the same amount; geometric multiplies by the same amount.**",
          "1, 4, 9, 16 is neither: it's square numbers.",
          "Ratio: divide a term by the one before.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Fibonacci-type sequences.

const FIB = "gf-sequences/fibonacci";
const fibMethod = ["Take the last two terms.", "Add them.", "With letters: collect like terms."];
const FIBS = stacks(1, 1, 2, 3, 5);

const fibonacci = stepped(find(SQ, FIB), {
  method: fibMethod,
  variation: {
    relationship: "each term is the sum of the two before",
    unknowns: ["term"],
    surface: ["further terms", "different starts", "zero"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Add the last two",
        ["**Each term is the sum of the two before it.**"],
        FIBS,
        "3 + 5 = 8 comes next.",
      ),
      reworded(SQ, FIB, "Next: 2, 5, 7, 12, 19, …", { tag: "The rule" }),

      ...owned(SQ, FIB, "Warm-up", "Check you remember"),

      methodCard("The method", fibMethod, FIBS),
      workedFrom(SQ, FIB),
      calc(
        "Your turn",
        "Continue 3, 4, 7, 11, …",
        undefined,
        [
          ["Next:", "18", "7 + 11."],
          ["Then:", "29", "11 + 18."],
        ],
        "18, 29.",
      ),

      calc(
        "Practise",
        "Terms $a$, $3a$, … The 3rd and 4th?",
        undefined,
        [
          ["3rd: $?a$, ? =", "4", "a + 3a."],
          ["4th: $?a$, ? =", "7", "3a + 4a."],
        ],
        "$4a$ and $7a$.",
      ),
      ...owned(SQ, FIB, "Together", "Practise"),
      ...owned(SQ, FIB, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The next term? Watch what changes.",
        [
          ask("1, 1, 2, 3, 5, …", "8", "3 + 5.", "8.", { asks: "term" }),
          ask("2, 2, 4, 6, 10, …", "16", "6 + 10.", "16.", { asks: "term", changed: "Doubled." }),
          ask("1, 3, 4, 7, …", "11", "4 + 7.", "11.", {
            asks: "term",
            changed: "A different start.",
          }),
          ask("5, 1, 6, 7, …", "13", "6 + 7.", "13.", { asks: "term", changed: "Bigger first." }),
        ],
        "Add the last two, every time.",
      ),

      questionSet(
        "Variation",
        "Find the 5th term. Watch what changes.",
        [
          ask("2, 3, 5, 8, …", "13", "5 + 8.", "13.", {
            asks: "term",
            expect: [
              "For 2, 3, 5, 8, Ed adds 8 + 3. Right?",
              "No",
              "Add the two just before: 5 + 8 = 13.",
              [["Yes", "Which two come just before?"]],
            ],
          }),
          ask("2, 3, 5, 8, 13, … (the 6th)", "21", "8 + 13.", "21.", {
            asks: "term",
            changed: "One more.",
          }),
          ask("1, 4, 5, 9, …", "14", "5 + 9.", "14.", {
            asks: "term",
            changed: "A different start.",
          }),
          ask("0, 2, 2, 4, …", "6", "2 + 4.", "6.", { asks: "term", changed: "Starting at 0." }),
        ],
        "The two just before, not any two.",
      ),
      own(SQ, FIB, "Spot the mistake"),

      own(SQ, FIB, "Exit check"),

      reworded(
        SQ,
        FIB,
        "“First two terms $a$ and $b$. Find the 4th term.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Each term is the sum of the two before it.**"],
        FIBS,
        [
          "**Each term is the sum of the two before it.**",
          "$a$, $b$, $a + b$, $a + 2b$…",
          "2, 3, 5, 8: not + 2 each time.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Quadratic sequences.

const QUADRATIC = "gf-sequences/quadratic-sequences";
const quadMethod = [
  "Find the first differences.",
  "Equal? Linear. If not, find the second differences.",
  "Constant second differences: quadratic. Extend the differences.",
];
const DIFFS = table(
  ["Term", "2", "6", "12", "20"],
  [
    ["1st difference", "", "4", "6", "8"],
    ["2nd difference", "", "", "2", "2"],
  ],
);

const quadratic = stepped(find(SQ, QUADRATIC), {
  method: quadMethod,
  variation: {
    relationship: "constant second differences make a quadratic sequence",
    unknowns: ["type", "next"],
    surface: ["linear", "geometric", "going down"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Differences of differences",
        ["**Constant second differences: a quadratic sequence.**"],
        DIFFS,
        "The next difference is 10, so the next term is 30.",
      ),
      reworded(SQ, QUADRATIC, "4, 9, 16, 25: second differences", { tag: "The rule" }),

      ...owned(SQ, QUADRATIC, "Warm-up", "Check you remember"),

      methodCard("The method", quadMethod, DIFFS),
      workedFrom(SQ, QUADRATIC),
      calc(
        "Your turn",
        "The next term of 3, 6, 11, 18, …",
        undefined,
        [
          ["Next difference:", "9", "3, 5, 7, then 9."],
          ["Next term:", "27", "18 + 9."],
        ],
        "27.",
      ),

      calc(
        "Practise",
        "Second differences of 1, 5, 11, 19, …",
        undefined,
        [
          ["First differences: 4, 6,", "8", "19 − 11."],
          ["Second difference:", "2", "6 − 4, 8 − 6."],
        ],
        "Constant 2: quadratic.",
      ),
      ...owned(SQ, QUADRATIC, "Together", "Practise"),
      ...owned(SQ, QUADRATIC, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "What type? Watch what changes.",
        [
          pick("5, 8, 11, 14", "linear", ["quadratic", "geometric"], "Equal gaps.", {
            asks: "type",
          }),
          pick("5, 8, 13, 20", "quadratic", ["linear", "geometric"], "Gaps 3, 5, 7.", {
            asks: "type",
            changed: "Growing gaps.",
          }),
          pick("5, 10, 20, 40", "geometric", ["linear", "quadratic"], "× 2.", {
            asks: "type",
            changed: "Doubling.",
          }),
          pick("1, 4, 9, 16", "quadratic", ["linear", "geometric"], "Square numbers.", {
            asks: "type",
            changed: "Squares.",
          }),
        ],
        "Gaps equal: linear. Gaps of gaps equal: quadratic.",
      ),

      questionSet(
        "Variation",
        "The next term? Watch what changes.",
        [
          ask("6, 9, 14, 21, …", "30", "Next difference 9.", "30.", {
            asks: "next",
            expect: [
              "For 6, 9, 14, 21, Kai adds 7 again: 28. Right?",
              "No",
              "The differences grow by 2: next is 9, so 30.",
              [["Yes", "What do the differences do?"]],
            ],
          }),
          ask("6, 9, 14, 21, 30, …", "41", "Next difference 11.", "41.", {
            asks: "next",
            changed: "One more.",
          }),
          ask("6, 8, 12, 18, …", "26", "Next difference 8.", "26.", {
            asks: "next",
            changed: "Smaller differences.",
          }),
          ask("30, 21, 14, 9, …", "6", "Differences −9, −7, −5, then −3.", "6.", {
            asks: "next",
            changed: "Going down.",
          }),
        ],
        "Extend the differences, then the terms.",
      ),
      own(SQ, QUADRATIC, "Spot the mistake"),

      own(SQ, QUADRATIC, "Exit check"),

      reworded(
        SQ,
        QUADRATIC,
        "“Tiles: 4, 9, 16, 25. Linear or quadratic? Explain.”",
        { tag: "Real life", title: "Tiles: 4, 9, 16, 25. Linear or quadratic? Why?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Constant second differences: a quadratic sequence.**"],
        DIFFS,
        [
          "**Constant second differences: a quadratic sequence.**",
          "1, 2, 4, 8 is geometric, not quadratic.",
          "Extend the differences to go on.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// The nth term of a linear sequence.

const NTH_TERM = "gf-sequences/nth-term";
const nthMethod = [
  "Find the difference: that times n.",
  "Compare with that times table.",
  "Add or subtract to fit.",
];
const COMPARE = table(
  ["n", "1", "2", "3", "4"],
  [
    ["$4n$", "4", "8", "12", "16"],
    ["Term", "7", "11", "15", "19"],
  ],
);

const nthTerm = stepped(find(SQ, NTH_TERM), {
  method: nthMethod,
  variation: {
    relationship: "a linear sequence and its nth term",
    unknowns: ["nth"],
    surface: ["bigger differences", "below the times table", "going down"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Compare with the times table",
        ["**The difference goes in front of n; then adjust to fit.**"],
        COMPARE,
        "3 more than 4n: $4n + 3$.",
      ),
      reworded(SQ, NTH_TERM, "Find the rule", { tag: "The rule" }, "Discover"),

      ...owned(SQ, NTH_TERM, "Warm-up", "Check you remember"),

      methodCard("The method", nthMethod, COMPARE),
      workedFrom(SQ, NTH_TERM),
      calc(
        "Your turn",
        "The nth term of 9, 13, 17, 21.",
        undefined,
        [
          ["Difference:", "4", "13 − 9."],
          ["$4n + ?$, ? =", "5", "9 − 4."],
        ],
        "$4n + 5$.",
      ),

      calc(
        "Practise",
        "The nth term of 25, 22, 19, 16.",
        undefined,
        [
          ["Difference:", "-3", "Going down 3."],
          ["$-3n + ?$, ? =", "28", "25 + 3."],
        ],
        "$28 - 3n$.",
      ),
      ...owned(SQ, NTH_TERM, "Together", "Practise"),
      ...owned(SQ, NTH_TERM, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The nth term? Watch what changes.",
        [
          pick("2, 5, 8, 11", "$3n - 1$", ["$n + 3$", "$3n + 2$"], "1 less than 3n.", {
            asks: "nth",
          }),
          pick("6, 9, 12, 15", "$3n + 3$", ["$n + 3$", "$3n + 6$"], "3 more than 3n.", {
            asks: "nth",
            changed: "Starts higher.",
          }),
          pick("2, 7, 12, 17", "$5n - 3$", ["$5n + 2$", "$n + 5$"], "3 less than 5n.", {
            asks: "nth",
            changed: "A bigger difference.",
          }),
          pick("20, 15, 10, 5", "$25 - 5n$", ["$5n + 15$", "$20 - 5n$"], "Down 5.", {
            asks: "nth",
            changed: "Going down.",
          }),
        ],
        "The difference times n, then adjust.",
      ),

      questionSet(
        "Variation",
        "The nth term? Watch what changes.",
        [
          pick("6, 8, 10, 12", "$2n + 4$", ["$4n + 2$", "$n + 2$"], "Difference 2.", {
            asks: "nth",
            expect: [
              "Lou writes $4n + 2$ for 6, 8, 10, 12. Right?",
              "No",
              "The difference, 2, goes in front: $2n + 4$.",
              [["Yes", "Which number goes in front of n?"]],
            ],
          }),
          pick("7, 10, 13, 16", "$3n + 4$", ["$4n + 3$", "$n + 3$"], "Difference 3.", {
            asks: "nth",
            changed: "Difference 3.",
          }),
          pick("1, 3, 5, 7", "$2n - 1$", ["$2n + 1$", "$n + 2$"], "1 less than 2n.", {
            asks: "nth",
            changed: "Below 2n.",
          }),
          pick("12, 10, 8, 6", "$14 - 2n$", ["$12 - 2n$", "$2n + 10$"], "Down 2.", {
            asks: "nth",
            changed: "Going down.",
          }),
        ],
        "The gap goes in front of n.",
      ),
      own(SQ, NTH_TERM, "Spot the mistake"),

      own(SQ, NTH_TERM, "Exit check"),

      reworded(
        SQ,
        NTH_TERM,
        "“5, 8, 11, 14. Find an expression for the nth term.”",
        { tag: "Real life", title: "5, 8, 11, 14. The nth term?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The difference goes in front of n; then adjust to fit.**"],
        COMPARE,
        [
          "**The difference goes in front of n; then adjust to fit.**",
          "Up 4 each time: $4n$, not $n + 4$.",
          "Check with the first term.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfSequencesStepped: [string, UnitLesson[]][] = [
  [TERM, [termToTerm]],
  [POSITION, [positionToTerm]],
  [SPECIAL, [special]],
  [AG, [arithGeom]],
  [FIB, [fibonacci]],
  [QUADRATIC, [quadratic]],
  [NTH_TERM, [nthTerm]],
];
