// GCSE Foundation, "Powers and roots", on the stepped template (docs/proposals/lesson-stepped.md):
// powers, roots, powers to know, roots in calculations, zero and negative indices, and exact
// answers with fractions and π. Squares and cubes are drawn as squares and cubes; the rest is
// number work.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfPowers } from "./gf-powers.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const PW = gfPowers;
const NUMBER = "A number check: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const square = (n: number): Picture => ({ kind: "grid", cols: n, rows: n, shaded: n * n });
const cube = (n: number): Picture => ({ kind: "cuboid", w: n, d: n, h: n, cubes: true });
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
// Positive powers.

const POWERS = "gf-powers/powers";
const powersMethod = [
  "Read the base and the index.",
  "Write the base that many times, with × signs.",
  "Multiply. A negative base: watch the sign.",
];
const CUBE3 = cube(3);

const powers = stepped(find(PW, POWERS), {
  method: powersMethod,
  variation: {
    relationship: "a power: the base multiplied by itself",
    unknowns: ["value", "bigger"],
    surface: ["swapped base and index", "negative bases", "big indices"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Base and index",
        ["**A power says how many times the base is multiplied by itself.**"],
        CUBE3,
        "$3^3 = 3 \\times 3 \\times 3 = 27$ cubes.",
      ),
      reworded(PW, POWERS, "$2^4$ is", { tag: "The rule" }),

      ...owned(PW, POWERS, "Warm-up", "Check you remember"),

      methodCard("The method", powersMethod, CUBE3),
      workedFrom(PW, POWERS),
      calc(
        "Your turn",
        "Work out $6^3$.",
        undefined,
        [
          ["$6^2 =$", "36", "6 × 6."],
          ["$6^3 = 36 \\times 6 =$", "216", "One more 6."],
        ],
        "$6^3 = 216$.",
      ),

      calc(
        "Practise",
        "Work out $4^2 + 2^4$.",
        undefined,
        [
          ["$4^2 =$", "16", "4 × 4."],
          ["$2^4 =$", "16", "2 × 2 × 2 × 2."],
          ["Total:", "32", "Add them."],
        ],
        "32.",
      ),
      ...owned(PW, POWERS, "Together", "Practise"),
      ...owned(PW, POWERS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Work it out. Watch what changes.",
        [
          ask("$2^3$", "8", "2 × 2 × 2.", "8.", { asks: "value" }),
          ask("$3^2$", "9", "3 × 3.", "9.", { asks: "value", changed: "Swapped." }),
          ask("$(-2)^3$", neg(-8), "Three negatives.", "−8.", {
            asks: "value",
            changed: "A negative base.",
          }),
          ask("$(-2)^2$", "4", "Two negatives.", "4.", {
            asks: "value",
            changed: "An even power.",
          }),
        ],
        "Count the multiplications; watch the signs.",
      ),

      questionSet(
        "Variation",
        "Which is bigger? Watch what changes.",
        [
          pick("$2^6$ or $6^2$?", "$2^6$", ["$6^2$", "They're equal"], "64 and 36.", {
            asks: "bigger",
            expect: [
              "Ben says $6^2 = 12$. Right?",
              "No",
              "$6^2 = 6 \\times 6 = 36$.",
              [["Yes", "Is a power the same as times?"]],
            ],
          }),
          pick("$2^4$ or $4^2$?", "They're equal", ["$2^4$", "$4^2$"], "Both 16.", {
            asks: "bigger",
            changed: "Both 16.",
          }),
          pick("$2^3$ or $3^2$?", "$3^2$", ["$2^3$", "They're equal"], "8 and 9.", {
            asks: "bigger",
            changed: "Smaller numbers.",
          }),
          pick("$10^2$ or $2^{10}$?", "$2^{10}$", ["$10^2$", "They're equal"], "100 and 1024.", {
            asks: "bigger",
            changed: "A bigger index.",
          }),
        ],
        "Work both out: don't guess from the digits.",
      ),
      own(PW, POWERS, "Spot the mistake"),

      own(PW, POWERS, "Exit check"),

      reworded(PW, POWERS, "“Work out $3^5$.”", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**A power says how many times the base is multiplied by itself.**"],
        CUBE3,
        [
          "**A power says how many times the base is multiplied by itself.**",
          "$6^2 = 36$, not 12.",
          "$(-2)^3 = -8$; $(-3)^2 = 9$.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Square and cube roots.

const ROOTS = "gf-powers/roots";
const rootsMethod = [
  "Square root: what squares to it?",
  "Cube root: what cubes to it?",
  "Estimate: find the squares either side.",
];
const SEVENS = square(7);

const roots = stepped(find(PW, ROOTS), {
  method: rootsMethod,
  variation: {
    relationship: "a root undoes a power",
    unknowns: ["root", "estimate"],
    surface: ["square roots", "cube roots", "between two squares"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Undo the power",
        ["**A root undoes a power: √49 = 7, because 7² = 49.**"],
        SEVENS,
        "Square roots come in pairs: 7 and −7.",
      ),
      reworded(PW, ROOTS, "The square roots of 36 are", { tag: "The rule" }),

      ...owned(PW, ROOTS, "Warm-up", "Check you remember"),

      methodCard("The method", rootsMethod, SEVENS),
      workedFrom(PW, ROOTS),
      calc(
        "Your turn",
        "This square has 121 small squares.",
        square(11),
        [["Its side:", "11", "11 × 11 = 121."]],
        "$\\sqrt{121} = 11$.",
      ),

      calc(
        "Practise",
        "This cube is made of 64 small cubes.",
        cube(4),
        [["Its side:", "4", "4 × 4 × 4 = 64."]],
        "$\\sqrt[3]{64} = 4$.",
      ),
      ...owned(PW, ROOTS, "Together", "Practise"),
      ...owned(PW, ROOTS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Work it out. Watch what changes.",
        [
          ask("$\\sqrt{100}$", "10", "10 × 10.", "10.", { asks: "root" }),
          ask("$\\sqrt{10000}$", "100", "100 × 100.", "100.", {
            asks: "root",
            changed: "Two more zeros.",
          }),
          ask("$\\sqrt[3]{27}$", "3", "3 × 3 × 3.", "3.", {
            asks: "root",
            changed: "A cube root.",
          }),
          ask("$\\sqrt[3]{-1}$", neg(-1), "−1 × −1 × −1.", "−1.", {
            asks: "root",
            changed: "Negative.",
          }),
        ],
        "Undo the square or the cube.",
      ),

      questionSet(
        "Variation",
        "Between which two whole numbers? Watch what changes.",
        [
          pick("$\\sqrt{70}$", "8 and 9", ["35 and 36", "7 and 8"], "64 and 81.", {
            asks: "estimate",
            expect: [
              "Raj says $\\sqrt{70}$ is about 35. Right?",
              "No",
              "Not half: $8^2 = 64$ and $9^2 = 81$, so 8 and 9.",
              [["Yes", "Is a root the same as halving?"]],
            ],
          }),
          pick("$\\sqrt{20}$", "4 and 5", ["10 and 11", "3 and 4"], "16 and 25.", {
            asks: "estimate",
            changed: "Smaller.",
          }),
          pick("$\\sqrt{110}$", "10 and 11", ["55 and 56", "9 and 10"], "100 and 121.", {
            asks: "estimate",
            changed: "Bigger.",
          }),
          pick("$\\sqrt[3]{20}$", "2 and 3", ["4 and 5", "6 and 7"], "8 and 27.", {
            asks: "estimate",
            changed: "A cube root.",
          }),
        ],
        "Find the squares or cubes either side.",
      ),
      own(PW, ROOTS, "Spot the mistake"),

      own(PW, ROOTS, "Exit check"),

      reworded(
        PW,
        ROOTS,
        "“A square garden has area 196 m². Work out its side length.”",
        { tag: "Real life", title: "A square garden: 196 m². Its side length?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A root undoes a power: √49 = 7, because 7² = 49.**"],
        SEVENS,
        [
          "**A root undoes a power: √49 = 7, because 7² = 49.**",
          "√64 is 8, not 32: a root isn't halving.",
          "√90 is between 9 and 10.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Powers to know.

const KNOW = "gf-powers/recognise";
const knowMethod = [
  "Go up the powers of the base.",
  "Count the steps to reach the number.",
  "That count is the index.",
];
const TABLES: Picture = {
  kind: "table",
  head: ["Base", "Powers"],
  rows: [
    ["2", "2, 4, 8, 16, 32, 64"],
    ["3", "3, 9, 27, 81, 243"],
    ["4", "4, 16, 64, 256"],
    ["5", "5, 25, 125, 625"],
  ],
};

const recognise = stepped(find(PW, KNOW), {
  method: knowMethod,
  variation: {
    relationship: "a number and the power it is",
    unknowns: ["index"],
    surface: ["different bases", "bigger numbers", "smaller numbers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The tables of powers",
        ["**Know the powers of 2, 3, 4 and 5 by heart.**"],
        TABLES,
        "$64 = 2^6 = 4^3 = 8^2$.",
      ),
      reworded(PW, KNOW, "Which is a power of 5?", { tag: "The rule" }),

      ...owned(PW, KNOW, "Warm-up", "Check you remember"),

      methodCard("The method", knowMethod, TABLES),
      workedFrom(PW, KNOW),
      calc(
        "Your turn",
        "Solve $2^n = 256$.",
        undefined,
        [
          ["$2^4 =$", "16", "2, 4, 8, 16."],
          ["$n =$", "8", "Keep doubling to 256."],
        ],
        "$n = 8$.",
      ),

      calc(
        "Practise",
        "Solve $4^n = 1024$.",
        undefined,
        [
          ["$4^4 =$", "256", "4, 16, 64, 256."],
          ["$n =$", "5", "256 × 4 = 1024."],
        ],
        "$n = 5$.",
      ),
      ...owned(PW, KNOW, "Together", "Practise"),
      ...owned(PW, KNOW, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve. Watch what changes.",
        [
          ask("$2^n = 8$", "3", "2, 4, 8.", "3.", { asks: "index" }),
          ask("$2^n = 64$", "6", "Keep doubling.", "6.", { asks: "index", changed: "Bigger." }),
          ask("$4^n = 16$", "2", "4, 16.", "2.", { asks: "index", changed: "Base 4." }),
          ask("$8^n = 64$", "2", "8, 64.", "2.", { asks: "index", changed: "Base 8." }),
        ],
        "Count up the powers.",
      ),

      questionSet(
        "Variation",
        "Find n. Watch what changes.",
        [
          ask("$81 = 3^n$", "4", "3, 9, 27, 81.", "4.", {
            asks: "index",
            expect: [
              "Ivy says $81 = 3^3$, since $9 \\times 9 = 81$. Right?",
              "No",
              "$9 \\times 9 = 3 \\times 3 \\times 3 \\times 3$: four 3s.",
              [["Yes", "Count the 3s."]],
            ],
          }),
          ask("$81 = 9^n$", "2", "9, 81.", "2.", { asks: "index", changed: "Base 9." }),
          ask("$27 = 3^n$", "3", "3, 9, 27.", "3.", { asks: "index", changed: "Smaller." }),
          ask("$243 = 3^n$", "5", "81 × 3.", "5.", { asks: "index", changed: "Bigger." }),
        ],
        "Count the factors of the base.",
      ),
      own(PW, KNOW, "Spot the mistake"),

      own(PW, KNOW, "Exit check"),

      reworded(
        PW,
        KNOW,
        "“Write 81 as a power of 3.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Know the powers of 2, 3, 4 and 5 by heart.**"],
        TABLES,
        [
          "**Know the powers of 2, 3, 4 and 5 by heart.**",
          "$2^4 = 16$, not $2^8$.",
          "$81 = 3^4$: count the 3s.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Calculating with roots.

const WITH = "gf-powers/with-roots";
const withMethod = [
  "Under the root: work it all out first.",
  "Then take the root.",
  "Then the rest in order: powers, × and ÷, + and −.",
];
const UNDER = maths("\\sqrt{100 - 64} = \\sqrt{36} = 6");

const withRoots = stepped(find(PW, WITH), {
  method: withMethod,
  variation: {
    relationship: "roots in calculations, in order",
    unknowns: ["value"],
    surface: ["one root or two", "times and divide", "powers too"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The root sign is a bracket",
        ["**Work out everything under the root sign first.**"],
        UNDER,
        "$\\sqrt{a + b}$ is not $\\sqrt a + \\sqrt b$.",
      ),
      reworded(PW, WITH, "$\\sqrt{36} \\times \\sqrt{4}$", { tag: "The rule" }),

      ...owned(PW, WITH, "Warm-up", "Check you remember"),

      methodCard("The method", withMethod, UNDER),
      workedFrom(PW, WITH),
      calc(
        "Your turn",
        "Work out $\\sqrt{8^2 + 15^2}$.",
        undefined,
        [
          ["$64 + 225 =$", "289", "Under the root first."],
          ["$\\sqrt{289} =$", "17", "17 × 17 = 289."],
        ],
        "17.",
      ),

      calc(
        "Practise",
        "Work out $\\dfrac{\\sqrt{144}}{4} + 3^2$.",
        undefined,
        [
          ["$\\sqrt{144} \\div 4 =$", "3", "12 ÷ 4."],
          ["$3 + 3^2 =$", "12", "3 + 9."],
        ],
        "12.",
      ),
      ...owned(PW, WITH, "Together", "Practise"),
      ...owned(PW, WITH, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Work it out. Watch what changes.",
        [
          ask("$\\sqrt{16} + \\sqrt{9}$", "7", "4 + 3.", "7.", { asks: "value" }),
          ask("$\\sqrt{16 + 9}$", "5", "√25.", "5.", { asks: "value", changed: "One root." }),
          ask("$\\sqrt{16} \\times \\sqrt{9}$", "12", "4 × 3.", "12.", {
            asks: "value",
            changed: "Times.",
          }),
          ask("$\\sqrt{16 \\times 9}$", "12", "√144.", "12.", {
            asks: "value",
            changed: "Under one root.",
          }),
        ],
        "Roots split over ×, but never over +.",
      ),

      questionSet(
        "Variation",
        "Work it out. Watch what changes.",
        [
          ask("$\\sqrt{49} + \\sqrt{1}$", "8", "7 + 1.", "8.", {
            asks: "value",
            expect: [
              "Ali writes $\\sqrt{49} + \\sqrt{1} = 7 + 1 = \\sqrt{50}$. Right?",
              "No",
              "$7 + 1 = 8$. Don't put it back under a root.",
              [["Yes", "Is 7 + 1 the same as √50?"]],
            ],
          }),
          ask("$\\sqrt{49 + 51}$", "10", "√100.", "10.", { asks: "value", changed: "One root." }),
          ask("$\\sqrt{49} - \\sqrt{9}$", "4", "7 − 3.", "4.", {
            asks: "value",
            changed: "Minus.",
          }),
          ask("$\\sqrt{49} \\times 2^2$", "28", "7 × 4.", "28.", {
            asks: "value",
            changed: "A power too.",
          }),
        ],
        "Each root is a number: then carry on as usual.",
      ),
      own(PW, WITH, "Spot the mistake"),

      own(PW, WITH, "Exit check"),

      reworded(
        PW,
        WITH,
        "“Work out $\\sqrt{3^2 + 4^2}$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Work out everything under the root sign first.**"],
        UNDER,
        [
          "**Work out everything under the root sign first.**",
          "$\\sqrt{16 + 9} = 5$, not 7.",
          "$\\sqrt{64} + \\sqrt{36} = 14$.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Zero and negative indices.

const INDICES = "gf-powers/indices";
const indMethod = [
  "Index 0: the answer is 1.",
  "Negative index: one over the positive power.",
  "The index laws still work.",
];
const DOWN: Picture = {
  kind: "table",
  head: ["Power", "$3^2$", "$3^1$", "$3^0$", "$3^{-1}$"],
  rows: [["Value", "9", "3", "1", "$\\frac13$"]],
};

const indices = stepped(find(PW, INDICES), {
  method: indMethod,
  variation: {
    relationship: "zero and negative indices",
    unknowns: ["value"],
    surface: ["index 0", "negative indices", "index laws"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Follow the pattern",
        ["**Any number to the power 0 is 1. A negative index means one over.**"],
        DOWN,
        "Each step down divides by 3.",
      ),
      reworded(PW, INDICES, "$5^0 =$", { tag: "The rule" }),

      ...owned(PW, INDICES, "Warm-up", "Check you remember"),

      methodCard("The method", indMethod, DOWN),
      workedFrom(PW, INDICES),
      calc(
        "Your turn",
        "Write $4^{-2}$ as a fraction.",
        undefined,
        [
          ["$4^2 =$", "16", "Make the index positive."],
          ["$4^{-2}$ as a decimal:", "0.0625", "1 ÷ 16."],
        ],
        "$4^{-2} = \\frac{1}{16}$.",
      ),

      calc(
        "Practise",
        "Simplify $2^5 \\times 2^{-7}$.",
        undefined,
        [
          ["Index: $5 + (-7) =$", "-2", "Add the powers."],
          ["As a decimal: $\\frac{1}{2^2} =$", "0.25", "One over 4."],
        ],
        "$2^{-2} = \\frac14$.",
      ),
      ...owned(PW, INDICES, "Together", "Practise"),
      ...owned(PW, INDICES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Work it out. Watch what changes.",
        [
          pick("$7^0$", "1", ["0", "7"], "Power 0.", { asks: "value" }),
          pick("$7^{-1}$", "$\\frac17$", ["−7", "0.7"], "One over 7.", {
            asks: "value",
            changed: "Negative.",
          }),
          pick("$7^{-2}$", "$\\frac{1}{49}$", ["−49", "$\\frac{1}{14}$"], "One over 49.", {
            asks: "value",
            changed: "Index −2.",
          }),
          pick("$10^{-2}$", "0.01", ["−100", "0.2"], "One over 100.", {
            asks: "value",
            changed: "Base 10.",
          }),
        ],
        "Negative means one over, never negative.",
      ),

      questionSet(
        "Variation",
        "Work it out. Watch what changes.",
        [
          pick("$6^0 \\times 6^2$", "36", ["0", "6"], "$6^0 = 1$.", {
            asks: "value",
            expect: [
              "Sid says $6^0 = 0$. Right?",
              "No",
              "$6^0 = 1$, so $6^0 \\times 6^2 = 36$.",
              [["Yes", "Follow the pattern down."]],
            ],
          }),
          pick("$6^0 + 6^2$", "37", ["36", "0"], "1 + 36.", { asks: "value", changed: "Add." }),
          pick("$6^{-1} \\times 6^2$", "6", ["$\\frac16$", "−36"], "Add the powers: $6^1$.", {
            asks: "value",
            changed: "A negative index.",
          }),
          pick("$6^{-2} \\times 6^2$", "1", ["0", "36"], "Add the powers: $6^0$.", {
            asks: "value",
            changed: "They cancel.",
          }),
        ],
        "$a^0 = 1$, and the laws still hold.",
      ),
      own(PW, INDICES, "Spot the mistake"),

      own(PW, INDICES, "Exit check"),

      reworded(
        PW,
        INDICES,
        "“Write the value of $2^0$ and $2^{-1}$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Any number to the power 0 is 1. A negative index means one over.**"],
        DOWN,
        [
          "**Any number to the power 0 is 1. A negative index means one over.**",
          "$4^{-1} = \\frac14$, not −4.",
          "$6^0 = 1$, not 0.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Exact answers with fractions.

const FRACTIONS = "gf-powers/exact-fractions";
const fracMethod = [
  "Add or subtract: use a common denominator.",
  "Multiply: tops together, bottoms together.",
  "Simplify. Don't change it to a decimal.",
];
const RECUR = maths("\\tfrac23 = 0.666\\ldots \\ne 0.67");

const exactFractions = stepped(find(PW, FRACTIONS), {
  method: fracMethod,
  variation: {
    relationship: "an exact fraction and a rounded decimal",
    unknowns: ["exact"],
    surface: ["adding", "subtracting", "multiplying", "dividing"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Exact means no rounding",
        ["**Exact means no rounding: keep the fraction.**"],
        RECUR,
        "Simplify fully.",
      ),
      reworded(PW, FRACTIONS, "Which answer is exact?", { tag: "The rule" }),

      ...owned(PW, FRACTIONS, "Warm-up", "Check you remember"),

      methodCard("The method", fracMethod, RECUR),
      workedFrom(PW, FRACTIONS),
      calc(
        "Your turn",
        "Work out $\\frac14 + \\frac25$ exactly.",
        undefined,
        [
          ["$\\frac25 = \\frac{?}{20}$:", "8", "× 4."],
          ["$\\frac{5}{20} + \\frac{8}{20} = \\frac{?}{20}$:", "13", "Add the tops."],
        ],
        "$\\frac{13}{20}$.",
      ),

      calc(
        "Practise",
        "Work out $\\frac56 \\times \\frac{9}{10}$ exactly.",
        undefined,
        [
          ["Tops: $5 \\times 9 =$", "45", "Multiply."],
          ["Bottoms: $6 \\times 10 =$", "60", "Multiply."],
          ["$\\frac{45}{60} = \\frac{3}{?}$:", "4", "Divide both by 15."],
        ],
        "$\\frac34$.",
      ),
      ...owned(PW, FRACTIONS, "Together", "Practise"),
      ...owned(PW, FRACTIONS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Work it out exactly. Watch what changes.",
        [
          pick("$\\frac13 + \\frac13$", "$\\frac23$", ["0.67", "$\\frac26$"], "Two thirds.", {
            asks: "exact",
          }),
          pick(
            "$\\frac13 + \\frac16$",
            "$\\frac12$",
            ["$\\frac29$", "$\\frac{2}{18}$"],
            "Sixths.",
            {
              asks: "exact",
              changed: "Sixths.",
            },
          ),
          pick(
            "$\\frac13 \\times \\frac16$",
            "$\\frac{1}{18}$",
            ["$\\frac29$", "0.06"],
            "Tops and bottoms.",
            {
              asks: "exact",
              changed: "Times.",
            },
          ),
          pick(
            "$\\frac13 \\div \\frac16$",
            "2",
            ["$\\frac{1}{18}$", "$\\frac12$"],
            "How many sixths in a third?",
            {
              asks: "exact",
              changed: "Divide.",
            },
          ),
        ],
        "Keep fractions; simplify.",
      ),

      questionSet(
        "Variation",
        "Work it out exactly. Watch what changes.",
        [
          pick("$\\frac12 + \\frac17$", "$\\frac{9}{14}$", ["0.64", "$\\frac29$"], "Fourteenths.", {
            asks: "exact",
            expect: [
              "Asked for exact, Fay writes 0.64. Right?",
              "No",
              "0.64 is rounded. Exact: $\\frac{9}{14}$.",
              [["Yes", "Is 0.64 equal to $\\frac{9}{14}$?"]],
            ],
          }),
          pick("$\\frac12 - \\frac17$", "$\\frac{5}{14}$", ["0.36", "$\\frac15$"], "Fourteenths.", {
            asks: "exact",
            changed: "Minus.",
          }),
          pick(
            "$\\frac12 \\times \\frac17$",
            "$\\frac{1}{14}$",
            ["0.07", "$\\frac29$"],
            "Tops and bottoms.",
            {
              asks: "exact",
              changed: "Times.",
            },
          ),
          pick(
            "$\\frac12 \\div \\frac17$",
            "$\\frac72$",
            ["$\\frac{1}{14}$", "0.29"],
            "Flip and multiply.",
            {
              asks: "exact",
              changed: "Divide.",
            },
          ),
        ],
        "Rounded isn't exact.",
      ),
      own(PW, FRACTIONS, "Spot the mistake"),

      own(PW, FRACTIONS, "Exit check"),

      reworded(
        PW,
        FRACTIONS,
        "“Work out $\\frac23 + \\frac15$. Give your answer as a fraction in its simplest form.”",
        { tag: "Real life", title: "$\\frac23 + \\frac15$, as a fraction in its simplest form?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Exact means no rounding: keep the fraction.**"],
        RECUR,
        [
          "**Exact means no rounding: keep the fraction.**",
          "$\\frac23$, not 0.67.",
          "Simplify fully.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Exact answers with π.

const PI = "gf-powers/exact-pi";
const piMethod = [
  "Write the formula.",
  "Put the numbers in, keeping π.",
  "Multiply the numbers; write π after them.",
];
const KEEP = maths("A = \\pi r^2 = \\pi \\times 6^2 = 36\\pi");

const exactPi = stepped(find(PW, PI), {
  method: piMethod,
  variation: {
    relationship: "areas and circumferences in terms of π",
    unknowns: ["exact"],
    surface: ["radius or diameter", "area or circumference", "collecting π terms"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "π is a number you keep",
        ["**In terms of π: keep π like a letter.**"],
        KEEP,
        "36π is exact; 113.1 is rounded.",
      ),
      reworded(PW, PI, "Circumference of a circle with diameter 8, in terms of π", {
        tag: "The rule",
      }),

      ...owned(PW, PI, "Warm-up", "Check you remember"),

      methodCard("The method", piMethod, KEEP),
      workedFrom(PW, PI),
      calc(
        "Your turn",
        "Radius 8 cm. The area, in terms of π.",
        undefined,
        [["$r^2 =$", "64", "8 × 8."]],
        "$64\\pi$ cm².",
      ),

      calc(
        "Practise",
        "Diameter 9 cm. The circumference, in terms of π.",
        undefined,
        [["$\\pi d$: the number in front of π is", "9", "C = πd."]],
        "$9\\pi$ cm.",
      ),
      ...owned(PW, PI, "Together", "Practise"),
      ...owned(PW, PI, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "In terms of π. Watch what changes.",
        [
          pick("Area, radius 10", "$100\\pi$", ["$20\\pi$", "314.2"], "$\\pi r^2$.", {
            asks: "exact",
          }),
          pick("Circumference, radius 10", "$20\\pi$", ["$100\\pi$", "$10\\pi$"], "$2\\pi r$.", {
            asks: "exact",
            changed: "Round the edge.",
          }),
          pick("Area, diameter 10", "$25\\pi$", ["$100\\pi$", "$10\\pi$"], "Radius 5.", {
            asks: "exact",
            changed: "Diameter.",
          }),
          pick(
            "Semicircle area, radius 10",
            "$50\\pi$",
            ["$100\\pi$", "$25\\pi$"],
            "Half of $100\\pi$.",
            {
              asks: "exact",
              changed: "Half.",
            },
          ),
        ],
        "Radius or diameter? Area or edge?",
      ),

      questionSet(
        "Variation",
        "In terms of π. Watch what changes.",
        [
          pick("Area, diameter 6", "$9\\pi$", ["$36\\pi$", "$6\\pi$"], "Radius 3.", {
            asks: "exact",
            expect: [
              "Diameter 6: Max uses $r = 6$. Right?",
              "No",
              "The radius is half of 6: 3. Area $9\\pi$.",
              [["Yes", "Radius or diameter?"]],
            ],
          }),
          pick("Area, diameter 14", "$49\\pi$", ["$196\\pi$", "$14\\pi$"], "Radius 7.", {
            asks: "exact",
            changed: "Bigger.",
          }),
          pick("Circumference, diameter 14", "$14\\pi$", ["$49\\pi$", "$28\\pi$"], "$\\pi d$.", {
            asks: "exact",
            changed: "Round the edge.",
          }),
          pick("$5\\pi + 3\\pi - 2\\pi$", "$6\\pi$", ["$6\\pi^3$", "$10\\pi$"], "Like terms.", {
            asks: "exact",
            changed: "Collect.",
          }),
        ],
        "Halve the diameter for the radius.",
      ),
      reworded(PW, PI, "Where did it go wrong?", {
        text: "Diameter 10: Leo finds the area in terms of π.",
      }),

      own(PW, PI, "Exit check"),

      reworded(
        PW,
        PI,
        "“Radius 5 cm. Find the area, in terms of π.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**In terms of π: keep π like a letter.**"],
        KEEP,
        [
          "**In terms of π: keep π like a letter.**",
          "Diameter 10: radius 5, area $25\\pi$.",
          "$3\\pi + 5\\pi = 8\\pi$.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfPowersStepped: [string, UnitLesson[]][] = [
  [POWERS, [powers]],
  [ROOTS, [roots]],
  [KNOW, [recognise]],
  [WITH, [withRoots]],
  [INDICES, [indices]],
  [FRACTIONS, [exactFractions]],
  [PI, [exactPi]],
];
