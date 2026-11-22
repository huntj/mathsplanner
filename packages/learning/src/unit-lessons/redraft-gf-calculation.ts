// GCSE Foundation, "Calculation", on the stepped template (docs/proposals/lesson-stepped.md):
// ordering, inequality symbols, negatives, decimals, fractions, very big and small numbers,
// inverse operations and the order of operations. Number work: the numbers are the picture.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { gfCalculation } from "./gf-calculation.ts";

const GC = gfCalculation;
const NUMBER = "Number work: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const neg = (n: string) => [n, n.replace("-", "−")];

// ---------------------------------------------------------------------------------------------
// Putting numbers in order.

const ORDER = "gf-calculation/order";
const orderMethod = [
  "Write every fraction as a decimal: top ÷ bottom.",
  "Give them all the same number of decimal places.",
  "Compare place by place. Below zero, further down is smaller.",
];
const LINED_UP = maths("0.600 < 0.625 < 0.650 < 0.667");

const order = stepped(find(GC, ORDER), {
  method: orderMethod,
  variation: {
    relationship: "fractions and decimals in order of size",
    unknowns: ["largest", "smallest"],
    surface: ["three decimal places", "a zero first", "negatives"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Putting numbers in order",
        ["**Write each as a decimal, line up the places, then compare.**"],
        LINED_UP,
        "0.6, $\\frac58$, 0.65, $\\frac23$ as decimals.",
      ),
      reworded(GC, ORDER, "Write $\\frac23$ as a decimal", { tag: "The rule" }),

      ...owned(GC, ORDER, "Warm-up", "Check you remember"),

      methodCard("The method", orderMethod, LINED_UP),
      workedFrom(GC, ORDER),
      calc(
        "Your turn",
        "Order $\\frac14$, 0.3 and $\\frac15$, smallest first.",
        undefined,
        [
          ["$\\frac14 =$", "0.25", "1 ÷ 4."],
          ["$\\frac15 =$", "0.2", "1 ÷ 5."],
          ["The smallest:", "0.2", "Compare place by place."],
        ],
        "$\\frac15$, $\\frac14$, 0.3.",
      ),

      calc(
        "Practise",
        "Which is bigger: $\\frac38$ or 0.4?",
        undefined,
        [
          ["$\\frac38 =$", "0.375", "3 ÷ 8."],
          ["The bigger:", "0.4", "0.400 beats 0.375."],
        ],
        "0.4.",
      ),
      ...owned(GC, ORDER, "Together", "Practise"),
      ...owned(GC, ORDER, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("Largest: 0.7, $\\frac34$, 0.72?", "$\\frac34$", "0.75.", "$\\frac34$.", {
            asks: "largest",
            others: ["0.7", "0.72"],
          }),
          ask("Smallest: 0.7, $\\frac34$, 0.72?", "0.7", "0.70.", "0.7.", {
            asks: "smallest",
            changed: "Now the smallest.",
            others: ["$\\frac34$", "0.72"],
          }),
          ask("Smallest: −2.5, −2, −3?", "−3", "Furthest below zero.", "−3.", {
            asks: "smallest",
            changed: "Negatives.",
            others: ["−2", "−2.5"],
          }),
          ask(
            "Largest: $\\frac23$, 0.6, $\\frac{7}{10}$?",
            "$\\frac{7}{10}$",
            "0.667 and 0.7.",
            "$\\frac{7}{10}$.",
            {
              asks: "largest",
              changed: "Thirds and tenths.",
              others: ["$\\frac23$", "0.6"],
            },
          ),
        ],
        "Decimals, lined up.",
      ),

      questionSet(
        "Variation",
        "Which is bigger? Watch what changes.",
        [
          ask("0.4 or 0.35?", "0.4", "0.40 against 0.35.", "0.4.", {
            asks: "largest",
            others: ["0.35"],
            expect: [
              "Ben says 0.35, as 35 is more than 4. Right?",
              "No",
              "0.4 = 0.40: 40 hundredths beats 35.",
              [["Yes", "Line up the places."]],
            ],
          }),
          ask("0.4 or 0.345?", "0.4", "0.400 against 0.345.", "0.4.", {
            asks: "largest",
            changed: "Three places.",
            others: ["0.345"],
          }),
          ask("0.04 or 0.35?", "0.35", "0.04 is 4 hundredths.", "0.35.", {
            asks: "largest",
            changed: "A zero first.",
            others: ["0.04"],
          }),
          ask("−0.4 or −0.35?", "−0.35", "Closer to zero.", "−0.35.", {
            asks: "largest",
            changed: "Negatives.",
            others: ["−0.4"],
          }),
        ],
        "Line the places up; never compare digit counts.",
      ),
      own(GC, ORDER, "Spot the mistake"),

      own(GC, ORDER, "Exit check"),

      reworded(
        GC,
        ORDER,
        "“Write 0.6, $\\frac23$, 0.65, $\\frac58$ in order, smallest first.”",
        { tag: "Real life", title: "Order 0.6, $\\frac23$, 0.65, $\\frac58$." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Write each as a decimal, line up the places, then compare.**"],
        LINED_UP,
        [
          "**Write each as a decimal, line up the places, then compare.**",
          "0.4 = 0.40, so it beats 0.35.",
          "−4 is bigger than −9.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Inequality symbols.

const SYMBOLS = "gf-calculation/symbols";
const symbolsMethod = [
  "Read the words: more, less, at least, at most.",
  "At least: ≥. At most: ≤. More than: >. Less than: <.",
  "Check the end value: in or out?",
];
const SIX = maths("= \\quad \\ne \\quad < \\quad > \\quad \\le \\quad \\ge");

const symbols = stepped(find(GC, SYMBOLS), {
  method: symbolsMethod,
  variation: {
    relationship: "an inequality and the numbers that fit it",
    unknowns: ["symbol", "integers"],
    surface: ["< and ≤ at each end", "at least and at most", "negatives"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Inequality symbols",
        ["**< and > leave the end out; ≤ and ≥ let it in.**"],
        SIX,
        "The extra line under < or > means 'or equal to'.",
      ),
      reworded(GC, SYMBOLS, "Six symbols", { tag: "The rule" }),
      reworded(GC, SYMBOLS, "“At most 8” means the number can be", { tag: "The rule" }),

      ...owned(GC, SYMBOLS, "Warm-up", "Check you remember"),

      methodCard("The method", symbolsMethod, SIX),
      workedFrom(GC, SYMBOLS),
      calc(
        "Your turn",
        "The integers with $2 < n \\le 5$.",
        undefined,
        [
          ["The smallest:", "3", "2 is left out."],
          ["The biggest:", "5", "5 is let in."],
        ],
        "3, 4, 5.",
      ),

      calc(
        "Practise",
        "The integers with $-3 \\le n < 1$.",
        undefined,
        [
          ["The smallest:", "-3", "−3 is let in."],
          ["The biggest:", "0", "1 is left out."],
          ["How many:", "4", "−3, −2, −1, 0."],
        ],
        "−3, −2, −1, 0.",
      ),
      ...owned(GC, SYMBOLS, "Together", "Practise"),
      ...owned(GC, SYMBOLS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Pupils, p. Watch what changes.",
        [
          ask("“Fewer than 30”", "$p < 30$", "30 is left out.", "$p < 30$.", {
            asks: "symbol",
            others: ["$p \\le 30$", "$p > 30$"],
          }),
          ask("“At least 30”", "$p \\ge 30$", "30 or more.", "$p \\ge 30$.", {
            asks: "symbol",
            changed: "At least.",
            others: ["$p > 30$", "$p \\le 30$"],
          }),
          ask("“No more than 30”", "$p \\le 30$", "30 or fewer.", "$p \\le 30$.", {
            asks: "symbol",
            changed: "No more than.",
            others: ["$p < 30$", "$p \\ge 30$"],
          }),
          ask("How many integers with $0 < n < 5$?", "4", "1, 2, 3, 4.", "4.", {
            asks: "integers",
            changed: "Count them.",
          }),
        ],
        "Read the words, then choose.",
      ),

      questionSet(
        "Variation",
        "Which integers fit? Watch the ends.",
        [
          ask("$3 \\le n < 6$", "3, 4, 5", "6 is left out.", "3, 4, 5.", {
            asks: "integers",
            others: ["3, 4, 5, 6", "4, 5"],
            expect: [
              "For $3 \\le n < 6$, Zoe lists 3, 4, 5, 6. Right?",
              "No",
              "< 6 leaves 6 out: 3, 4, 5.",
              [["Yes", "Does < let the end in?"]],
            ],
          }),
          ask("$3 < n < 6$", "4, 5", "Both ends out.", "4, 5.", {
            asks: "integers",
            changed: "Both ends out.",
            others: ["3, 4, 5", "4, 5, 6"],
          }),
          ask("$3 \\le n \\le 6$", "3, 4, 5, 6", "Both ends in.", "3, 4, 5, 6.", {
            asks: "integers",
            changed: "Both ends in.",
            others: ["4, 5", "3, 4, 5"],
          }),
          ask("$3 < n \\le 6$", "4, 5, 6", "3 out, 6 in.", "4, 5, 6.", {
            asks: "integers",
            changed: "Swapped ends.",
            others: ["3, 4, 5", "3, 4, 5, 6"],
          }),
        ],
        "≤ lets the end in; < leaves it out.",
      ),
      own(GC, SYMBOLS, "Spot the mistake"),

      own(GC, SYMBOLS, "Exit check"),

      reworded(
        GC,
        SYMBOLS,
        "“The lift carries at most 8 people. Write an inequality for the number of people, $p$.”",
        { tag: "Real life", title: "At most 8 people, p. The inequality?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**< and > leave the end out; ≤ and ≥ let it in.**"],
        SIX,
        [
          "**< and > leave the end out; ≤ and ≥ let it in.**",
          "At least 18: $a \\ge 18$. At most 8: $p \\le 8$.",
          "$3 \\le n < 6$: 3, 4, 5.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Negative numbers.

const NEGATIVES = "gf-calculation/negatives";
const negMethod = [
  "Adding and taking away: think of a number line.",
  "Taking away a negative: add.",
  "× and ÷: same signs positive, different signs negative.",
];
const SIGNS = maths("-6 \\times -2 = 12 \\qquad 5 - (-3) = 8");

const negatives = stepped(find(GC, NEGATIVES), {
  method: negMethod,
  variation: {
    relationship: "the four operations with negative numbers",
    unknowns: ["answer"],
    surface: ["two negatives", "three negatives", "powers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Negative numbers",
        ["**Same signs give positive; different signs give negative.**"],
        SIGNS,
        "Taking away a negative is the same as adding.",
      ),
      reworded(GC, NEGATIVES, "Work out $-6 \\times -2$", { tag: "The rule" }),

      ...owned(GC, NEGATIVES, "Warm-up", "Check you remember"),

      methodCard("The method", negMethod, SIGNS),
      workedFrom(GC, NEGATIVES),
      calc(
        "Your turn",
        "Work out $-12 \\div -4 - (-5)$.",
        undefined,
        [
          ["$-12 \\div -4 =$", "3", "Same signs."],
          ["$3 - (-5) =$", "8", "Take away a negative: add."],
        ],
        "8.",
      ),

      calc(
        "Practise",
        "Work out $(-2)^3$.",
        undefined,
        [
          ["$-2 \\times -2 =$", "4", "Same signs."],
          ["$4 \\times -2 =$", "-8", "Different signs."],
        ],
        "−8.",
      ),
      ...owned(GC, NEGATIVES, "Together", "Practise"),
      ...owned(GC, NEGATIVES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "−6 and 3. Watch the operation change.",
        [
          ask("$-6 + 3$", neg("-3"), "Up 3 from −6.", "−3.", { asks: "answer" }),
          ask("$-6 - 3$", neg("-9"), "Down 3 from −6.", "−9.", {
            asks: "answer",
            changed: "Take away.",
          }),
          ask("$-6 \\times 3$", neg("-18"), "Different signs.", "−18.", {
            asks: "answer",
            changed: "Multiply.",
          }),
          ask("$-6 \\div -3$", "2", "Same signs.", "2.", {
            asks: "answer",
            changed: "Divide by a negative.",
          }),
        ],
        "Read the operation, then the signs.",
      ),

      questionSet(
        "Variation",
        "Count the negatives. Watch what changes.",
        [
          ask("$-2 \\times -3 \\times -1$", neg("-6"), "Three negatives.", "−6.", {
            asks: "answer",
            expect: [
              "Leo gets 6 for $-2 \\times -3 \\times -1$. Right?",
              "No",
              "Three negatives make a negative: −6.",
              [["Yes", "Count the negatives."]],
            ],
          }),
          ask("$-2 \\times -3 \\times 1$", "6", "Two negatives.", "6.", {
            asks: "answer",
            changed: "Two negatives.",
          }),
          ask("$-2 \\times -3 \\times -1 \\times -1$", "6", "Four negatives.", "6.", {
            asks: "answer",
            changed: "Four negatives.",
          }),
          ask("$(-1)^5$", neg("-1"), "Five negatives.", "−1.", {
            asks: "answer",
            changed: "A power.",
          }),
        ],
        "An even number of negatives: positive. Odd: negative.",
      ),
      own(GC, NEGATIVES, "Spot the mistake"),

      own(GC, NEGATIVES, "Exit check"),

      reworded(
        GC,
        NEGATIVES,
        "“A diver at −12 m rises 5 m, then dives to 3 times that depth. Work out her final depth.”",
        { tag: "Real life", title: "A diver at −12 m rises 5 m, then goes 3 times as deep." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Same signs give positive; different signs give negative.**"],
        SIGNS,
        [
          "**Same signs give positive; different signs give negative.**",
          "$5 - (-3) = 8$.",
          "$-4 - 3 = -7$, not −1.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Calculating with decimals.

const DECIMALS = "gf-calculation/decimals";
const decMethod = [
  "×: multiply as whole numbers.",
  "Count the decimal places in the question: the answer has that many.",
  "÷: times both by 10 or 100 so you divide by a whole number.",
];
const PLACES = maths("2.4 \\times 0.3: \\; 24 \\times 3 = 72 \\Rightarrow 0.72");

const decimals = stepped(find(GC, DECIMALS), {
  method: decMethod,
  variation: {
    relationship: "decimals multiplied and divided without a calculator",
    unknowns: ["product", "quotient"],
    surface: ["more decimal places", "dividing by a decimal", "a whole-number divisor"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Calculating with decimals",
        ["**Multiply as whole numbers, then put back the decimal places.**"],
        PLACES,
        "To divide, make the number you divide by whole first.",
      ),
      reworded(GC, DECIMALS, "Multiply as whole numbers, then place the point", {
        tag: "The rule",
      }),

      ...owned(GC, DECIMALS, "Warm-up", "Check you remember"),

      methodCard("The method", decMethod, PLACES),
      workedFrom(GC, DECIMALS),
      calc(
        "Your turn",
        "Work out $0.6 \\times 0.04$.",
        undefined,
        [
          ["$6 \\times 4 =$", "24", "As whole numbers."],
          ["3 decimal places:", "0.024", "One in 0.6, two in 0.04."],
        ],
        "0.024.",
      ),

      calc(
        "Practise",
        "Work out $5.6 \\div 0.08$.",
        undefined,
        [
          ["× both by 100: $560 \\div$", "8", "Now a whole number."],
          ["$=$", "70", "560 ÷ 8."],
        ],
        "70.",
      ),
      ...owned(GC, DECIMALS, "Together", "Practise"),
      ...owned(GC, DECIMALS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "From $3 \\times 2 = 6$. Watch what changes.",
        [
          ask("$0.3 \\times 2$", "0.6", "1 decimal place.", "0.6.", { asks: "product" }),
          ask("$0.3 \\times 0.2$", "0.06", "2 decimal places.", "0.06.", {
            asks: "product",
            changed: "Two decimals.",
          }),
          ask("$0.03 \\times 0.2$", "0.006", "3 decimal places.", "0.006.", {
            asks: "product",
            changed: "Three places.",
          }),
          ask("$0.6 \\div 0.2$", "3", "$6 \\div 2$.", "3.", {
            asks: "quotient",
            changed: "Dividing.",
          }),
        ],
        "Count the places.",
      ),

      questionSet(
        "Variation",
        "Divide. Watch what changes.",
        [
          ask("$8.4 \\div 0.2$", "42", "$84 \\div 2$.", "42.", {
            asks: "quotient",
            expect: [
              "Ava works out $8.4 \\div 0.2$ as $8.4 \\div 2$. Right?",
              "No",
              "Times both by 10: $84 \\div 2 = 42$.",
              [["Yes", "Dividing by 0.2 makes it bigger."]],
            ],
          }),
          ask("$8.4 \\div 0.02$", "420", "$840 \\div 2$.", "420.", {
            asks: "quotient",
            changed: "A smaller divisor.",
          }),
          ask("$8.4 \\div 2$", "4.2", "A whole number already.", "4.2.", {
            asks: "quotient",
            changed: "A whole number.",
          }),
          ask("$0.84 \\div 0.2$", "4.2", "$8.4 \\div 2$.", "4.2.", {
            asks: "quotient",
            changed: "A smaller start.",
          }),
        ],
        "The smaller the divisor, the bigger the answer.",
      ),
      own(GC, DECIMALS, "Spot the mistake"),

      own(GC, DECIMALS, "Exit check"),

      reworded(
        GC,
        DECIMALS,
        "“A 7.2 m rope is cut into 0.06 m pieces. How many pieces? You must show your working.”",
        { tag: "Real life", title: "How many 0.06 m pieces from a 7.2 m rope?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply as whole numbers, then put back the decimal places.**"],
        PLACES,
        [
          "**Multiply as whole numbers, then put back the decimal places.**",
          "$0.3 \\times 0.2 = 0.06$, not 0.6.",
          "$7.2 \\div 0.06 = 720 \\div 6$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Calculating with fractions.

const FRACTIONS = "gf-calculation/fractions";
const fracMethod = [
  "Turn mixed numbers into improper fractions.",
  "+ and −: common denominator. ×: across. ÷: flip the second, then ×.",
  "Simplify, and turn back into a mixed number.",
];
const FLIP = maths("\\frac23 \\div \\frac34 = \\frac23 \\times \\frac43 = \\frac89");

const fractions = stepped(find(GC, FRACTIONS), {
  method: fracMethod,
  variation: {
    relationship: "the four operations with fractions",
    unknowns: ["sum", "difference", "product", "quotient"],
    surface: ["mixed numbers", "each operation", "whole-number answers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Calculating with fractions",
        ["**Add with a common denominator; multiply across; to divide, flip the second.**"],
        FLIP,
        "Mixed numbers become improper fractions first.",
      ),
      reworded(GC, FRACTIONS, "Why does dividing by $\\frac18$ give a bigger answer?", {
        tag: "The rule",
      }),

      ...owned(GC, FRACTIONS, "Warm-up", "Check you remember"),

      methodCard("The method", fracMethod, FLIP),
      workedFrom(GC, FRACTIONS),
      calc(
        "Your turn",
        "Work out $\\frac25 + \\frac13$.",
        undefined,
        [
          ["Common denominator:", "15", "5 × 3."],
          ["$\\frac{6}{15} + \\frac{5}{15} = \\frac{n}{15}$, $n =$", "11", "Add the tops."],
        ],
        "$\\frac{11}{15}$.",
      ),

      calc(
        "Practise",
        "Work out $\\frac34 \\div \\frac38$.",
        undefined,
        [["$\\frac34 \\times \\frac83 = \\frac{24}{12} =$", "2", "Flip the second, multiply."]],
        "2.",
      ),
      ...owned(GC, FRACTIONS, "Together", "Practise"),
      ...owned(GC, FRACTIONS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "$\\frac12$ and $\\frac13$. Watch the operation change.",
        [
          ask("$\\frac12 + \\frac13$", "$\\frac56$", "Sixths.", "$\\frac56$.", {
            asks: "sum",
            others: ["$\\frac25$", "$\\frac16$"],
          }),
          ask("$\\frac12 - \\frac13$", "$\\frac16$", "Sixths.", "$\\frac16$.", {
            asks: "difference",
            changed: "Take away.",
            others: ["$\\frac11$", "$\\frac56$"],
          }),
          ask("$\\frac12 \\times \\frac13$", "$\\frac16$", "Across.", "$\\frac16$.", {
            asks: "product",
            changed: "Multiply.",
            others: ["$\\frac25$", "$\\frac56$"],
          }),
          ask(
            "$\\frac12 \\div \\frac13$",
            "$1\\frac12$",
            "Flip: $\\frac12 \\times 3$.",
            "$1\\frac12$.",
            {
              asks: "quotient",
              changed: "Divide.",
              others: ["$\\frac16$", "$\\frac23$"],
            },
          ),
        ],
        "Each operation has its own rule.",
      ),

      questionSet(
        "Variation",
        "$2\\frac12$ and $1\\frac12$. Watch the operation change.",
        [
          ask(
            "$2\\frac12 \\times 1\\frac12$",
            "$3\\frac34$",
            "$\\frac52 \\times \\frac32$.",
            "$3\\frac34$.",
            {
              asks: "product",
              others: ["$2\\frac14$", "$3\\frac14$"],
              expect: [
                "Mia multiplies wholes and fractions apart: $2\\frac14$. Right?",
                "No",
                "Improper first: $\\frac52 \\times \\frac32 = \\frac{15}{4}$.",
                [["Yes", "Try it as improper fractions."]],
              ],
            },
          ),
          ask("$2\\frac12 + 1\\frac12$", "4", "Wholes and halves.", "4.", {
            asks: "sum",
            changed: "Adding.",
            others: ["$3\\frac14$", "$3\\frac12$"],
          }),
          ask(
            "$2\\frac12 \\div 1\\frac12$",
            "$1\\frac23$",
            "$\\frac52 \\times \\frac23$.",
            "$1\\frac23$.",
            {
              asks: "quotient",
              changed: "Dividing.",
              others: ["$2\\frac13$", "$\\frac35$"],
            },
          ),
          ask("$2\\frac12 - 1\\frac12$", "1", "Wholes and halves.", "1.", {
            asks: "difference",
            changed: "Taking away.",
            others: ["$1\\frac12$", "0"],
          }),
        ],
        "× and ÷: improper fractions first, always.",
      ),
      own(GC, FRACTIONS, "Spot the mistake"),

      own(GC, FRACTIONS, "Exit check"),

      reworded(
        GC,
        FRACTIONS,
        "“A $5\\frac14$ m plank is cut into $\\frac34$ m shelves. How many shelves? Show your working.”",
        { tag: "Real life", title: "How many $\\frac34$ m shelves from $5\\frac14$ m?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Add with a common denominator; multiply across; to divide, flip the second.**"],
        FLIP,
        [
          "**Add with a common denominator; multiply across; to divide, flip the second.**",
          "Mixed numbers: improper fractions first.",
          "$\\frac25 + \\frac13 = \\frac{11}{15}$, not $\\frac38$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Very big, very small.

const BIG = "gf-calculation/big-and-small";
const bigMethod = [
  "A million: 6 zeros. A billion: 9 zeros.",
  "Times by 1 000 000 or 1 000 000 000.",
  "Small numbers: name the column of the last digit.",
];
const ZEROS = maths("10^6 = 1\\,000\\,000 \\qquad 10^9 = 1\\,000\\,000\\,000");

const bigAndSmall = stepped(find(GC, BIG), {
  method: bigMethod,
  variation: {
    relationship: "a number's words, its figures and its place values",
    unknowns: ["figures", "value"],
    surface: ["millions and billions", "fractions of a million", "small decimals"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Very big, very small",
        ["**A million has 6 zeros; a billion has 9.**"],
        ZEROS,
        "67.4 million = 67 400 000.",
      ),
      reworded(GC, BIG, "Millions and billions", { tag: "The rule" }),
      reworded(GC, BIG, "Thousandths and millionths", { tag: "The rule" }),

      ...owned(GC, BIG, "Warm-up", "Check you remember"),

      methodCard("The method", bigMethod, ZEROS),
      workedFrom(GC, BIG),
      calc(
        "Your turn",
        "Write 0.007 as a fraction.",
        undefined,
        [["The 7 is in the thousandths: $\\frac{7}{n}$, $n =$", "1000", "Its column."]],
        "$\\frac{7}{1000}$.",
      ),

      calc(
        "Practise",
        "Write 3.2 billion in millions.",
        undefined,
        [
          ["1 billion = how many million?", "1000", "A thousand million."],
          ["3.2 billion = how many million?", "3200", "3.2 × 1000."],
        ],
        "3200 million.",
      ),
      ...owned(GC, BIG, "Together", "Practise"),
      ...owned(GC, BIG, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Write each in figures. Watch what changes.",
        [
          ask("2.5 million", ["2500000", "2 500 000"], "× 1 000 000.", "2 500 000.", {
            asks: "figures",
          }),
          ask(
            "2.5 billion",
            ["2500000000", "2 500 000 000"],
            "× 1 000 000 000.",
            "2 500 000 000.",
            {
              asks: "figures",
              changed: "Billion.",
            },
          ),
          ask("0.25 million", ["250000", "250 000"], "A quarter of a million.", "250 000.", {
            asks: "figures",
            changed: "Less than one million.",
          }),
          ask("The value of the 4 in 0.0045?", "4 thousandths", "Its column.", "4 thousandths.", {
            asks: "value",
            changed: "A small number.",
            others: ["4 hundredths", "4 ten-thousandths"],
          }),
        ],
        "Count the zeros; name the columns.",
      ),

      questionSet(
        "Variation",
        "Write each as a fraction. Watch the places.",
        [
          ask(
            "0.035",
            "$\\frac{35}{1000}$",
            "The 5 is in the thousandths.",
            "$\\frac{35}{1000}$.",
            {
              asks: "value",
              others: ["$\\frac{35}{100}$", "$\\frac{3}{100}$"],
              expect: [
                "Dan writes 0.035 as $\\frac{35}{100}$. Right?",
                "No",
                "The last digit is in the thousandths: $\\frac{35}{1000}$.",
                [["Yes", "Look at the last digit's column."]],
              ],
            },
          ),
          ask("0.35", "$\\frac{35}{100}$", "Hundredths.", "$\\frac{35}{100}$.", {
            asks: "value",
            changed: "One fewer place.",
            others: ["$\\frac{35}{1000}$", "$\\frac{35}{10}$"],
          }),
          ask("0.0035", "$\\frac{35}{10000}$", "Ten-thousandths.", "$\\frac{35}{10000}$.", {
            asks: "value",
            changed: "One more place.",
            others: ["$\\frac{35}{1000}$", "$\\frac{35}{100}$"],
          }),
          ask("3.5", "$\\frac{35}{10}$", "Tenths.", "$\\frac{35}{10}$.", {
            asks: "value",
            changed: "Bigger than 1.",
            others: ["$\\frac{35}{100}$", "$\\frac{3}{5}$"],
          }),
        ],
        "The last digit's column is the denominator.",
      ),
      own(GC, BIG, "Spot the mistake"),

      own(GC, BIG, "Exit check"),

      reworded(
        GC,
        BIG,
        "“Write 67.4 million in figures.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A million has 6 zeros; a billion has 9.**"],
        ZEROS,
        [
          "**A million has 6 zeros; a billion has 9.**",
          "2.5 million = 2 500 000.",
          "0.035 = $\\frac{35}{1000}$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Inverse operations.

const INVERSE = "gf-calculation/inverse";
const invMethod = [
  "List the steps in order.",
  "Undo the last step first, with its inverse.",
  "Check: put your answer back through the steps.",
];
const UNDO = maths("\\times 3,\\; -5 \\quad\\to\\quad +5,\\; \\div 3");

const inverse = stepped(find(GC, INVERSE), {
  method: invMethod,
  variation: {
    relationship: "steps and their inverses, undone in reverse",
    unknowns: ["number", "check"],
    surface: ["the order swapped", "squares", "divides"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Inverse operations",
        ["**Undo each step with its inverse, in reverse order.**"],
        UNDO,
        "Like taking off shoes before socks.",
      ),
      reworded(GC, INVERSE, "The inverse of “square it” is", { tag: "The rule" }),

      ...owned(GC, INVERSE, "Warm-up", "Check you remember"),

      methodCard("The method", invMethod, UNDO),
      workedFrom(GC, INVERSE),
      calc(
        "Your turn",
        "×4, then +3, gives 31. The number?",
        undefined,
        [
          ["Undo +3: $31 - 3 =$", "28", "The last step first."],
          ["Undo ×4: $28 \\div 4 =$", "7", "Then the first."],
        ],
        "7. Check: 7 × 4 + 3 = 31.",
      ),

      calc(
        "Practise",
        "Square, then −6, gives 43. The positive number?",
        undefined,
        [
          ["Undo −6:", "49", "43 + 6."],
          ["Undo the square:", "7", "$\\sqrt{49}$."],
        ],
        "7.",
      ),
      ...owned(GC, INVERSE, "Together", "Practise"),
      ...owned(GC, INVERSE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find the number. Watch what changes.",
        [
          ask("×5, then −2, gives 23.", "5", "25 ÷ 5.", "5.", { asks: "number" }),
          ask("−2, then ×5, gives 23.", "6.6", "23 ÷ 5 + 2.", "6.6.", {
            asks: "number",
            changed: "The order swapped.",
          }),
          ask("÷4, then +1, gives 6.", "20", "5 × 4.", "20.", {
            asks: "number",
            changed: "A divide.",
          }),
          ask(
            "Which checks $56 \\div 8 = 7$?",
            "$7 \\times 8 = 56$",
            "Undo ÷ with ×.",
            "$7 \\times 8 = 56$.",
            {
              asks: "check",
              changed: "A check.",
              others: ["$56 - 8 = 48$", "$7 + 8 = 15$"],
            },
          ),
        ],
        "Reverse order, inverse steps.",
      ),

      questionSet(
        "Variation",
        "The answer is 30. Find the number.",
        [
          ask("×4, then +2.", "7", "28 ÷ 4.", "7.", {
            asks: "number",
            expect: [
              "For ×4 then +2, Jo works out $30 \\div 4 - 2$. Right?",
              "No",
              "Undo in reverse: take 2 first, then ÷ 4.",
              [["Yes", "Undo the last step first."]],
            ],
          }),
          ask("+2, then ×4.", "5.5", "7.5 − 2.", "5.5.", {
            asks: "number",
            changed: "The order swapped.",
          }),
          ask("×4, then −2.", "8", "32 ÷ 4.", "8.", {
            asks: "number",
            changed: "Minus, not plus.",
          }),
          ask("÷4, then +2.", "112", "28 × 4.", "112.", {
            asks: "number",
            changed: "Divide, not times.",
          }),
        ],
        "The last thing done is the first undone.",
      ),
      own(GC, INVERSE, "Spot the mistake"),

      own(GC, INVERSE, "Exit check"),

      reworded(
        GC,
        INVERSE,
        "“×3 then −5 gives 16. Find the number. Show how you check your answer.”",
        { tag: "Real life", title: "×3 then −5 gives 16. Find the number." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Undo each step with its inverse, in reverse order.**"],
        UNDO,
        [
          "**Undo each step with its inverse, in reverse order.**",
          "+ and −, × and ÷, square and square root.",
          "Check by doing the steps forwards.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Order of operations.

const PRIORITY = "gf-calculation/priority";
const prioMethod = [
  "Brackets first (and anything under a root or a fraction line).",
  "Then powers and roots.",
  "Then × and ÷, then + and −, left to right.",
];
const BIDMAS = maths("3 + 4 \\times 2^2 = 3 + 16 = 19");

const priority = stepped(find(GC, PRIORITY), {
  method: prioMethod,
  variation: {
    relationship: "the order the operations are done in",
    unknowns: ["answer", "reciprocal"],
    surface: ["brackets", "powers", "× before +"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Order of operations",
        ["**Brackets, then powers, then × and ÷, then + and −.**"],
        BIDMAS,
        "$2^2$ first, then $4 \\times 4$, then add 3.",
      ),
      reworded(GC, PRIORITY, "Reciprocals", { tag: "The rule" }),

      ...owned(GC, PRIORITY, "Warm-up", "Check you remember"),

      methodCard("The method", prioMethod, BIDMAS),
      workedFrom(GC, PRIORITY),
      calc(
        "Your turn",
        "Work out $2 + 3 \\times 4^2$.",
        undefined,
        [
          ["$4^2 =$", "16", "Powers first."],
          ["$3 \\times 16 =$", "48", "Then ×."],
          ["$2 + 48 =$", "50", "Then +."],
        ],
        "50.",
      ),

      calc(
        "Practise",
        "Work out $(8 - 2)^2 \\div 4$.",
        undefined,
        [
          ["Brackets:", "6", "8 − 2."],
          ["$6^2 =$", "36", "The power."],
          ["$36 \\div 4 =$", "9", "Then ÷."],
        ],
        "9.",
      ),
      ...owned(GC, PRIORITY, "Together", "Practise"),
      ...owned(GC, PRIORITY, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "2, 3 and 4. Watch what changes.",
        [
          ask("$2 + 3 \\times 4$", "14", "× first.", "14.", { asks: "answer" }),
          ask("$(2 + 3) \\times 4$", "20", "Brackets first.", "20.", {
            asks: "answer",
            changed: "Brackets.",
          }),
          ask("$2 + 3^2 \\times 4$", "38", "Power, then ×, then +.", "38.", {
            asks: "answer",
            changed: "A power.",
          }),
          ask("The reciprocal of 4?", "$\\frac14$", "1 ÷ 4.", "$\\frac14$.", {
            asks: "reciprocal",
            changed: "A reciprocal.",
            others: ["−4", "0.4"],
          }),
        ],
        "The same numbers, different orders, different answers.",
      ),

      questionSet(
        "Variation",
        "2 and 3. Watch what changes.",
        [
          ask("$2 \\times 3^2$", "18", "Power first.", "18.", {
            asks: "answer",
            expect: [
              "Tom does $2 \\times 3 = 6$, then $6^2$. Right?",
              "No",
              "Powers first: $3^2 = 9$, then × 2.",
              [["Yes", "Powers come before ×."]],
            ],
          }),
          ask("$(2 \\times 3)^2$", "36", "Brackets first.", "36.", {
            asks: "answer",
            changed: "Brackets.",
          }),
          ask("$2^2 \\times 3$", "12", "The power is on the 2.", "12.", {
            asks: "answer",
            changed: "Power on the 2.",
          }),
          ask("$2 + 3^2$", "11", "Power, then +.", "11.", {
            asks: "answer",
            changed: "Adding.",
          }),
        ],
        "A power belongs only to the number it sits on.",
      ),
      own(GC, PRIORITY, "Spot the mistake"),

      own(GC, PRIORITY, "Exit check"),

      reworded(
        GC,
        PRIORITY,
        "“Work out $3 + 4 \\times 2^2$.” Which pupil is right?",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Brackets, then powers, then × and ÷, then + and −.**"],
        BIDMAS,
        [
          "**Brackets, then powers, then × and ÷, then + and −.**",
          "A fraction line groups what's above it.",
          "Reciprocal of 4: $\\frac14$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

export const gfCalculationStepped: [string, UnitLesson[]][] = [
  [ORDER, [order]],
  [SYMBOLS, [symbols]],
  [NEGATIVES, [negatives]],
  [DECIMALS, [decimals]],
  [FRACTIONS, [fractions]],
  [BIG, [bigAndSmall]],
  [INVERSE, [inverse]],
  [PRIORITY, [priority]],
];
