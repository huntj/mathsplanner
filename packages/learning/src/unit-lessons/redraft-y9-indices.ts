// Year 9, "Indices and standard form", on the stepped template (docs/proposals/lesson-stepped.md):
// multiplying, dividing, adding and taking away in standard form, and the laws of indices. These
// are algebra and number work: the expression is the picture.
import { ask, calc, explain, methodCard, questionSet, summary, worked } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { y9Indices } from "./y9-indices.ts";

const IX = y9Indices;
const ALGEBRA = "Powers and standard form: the expression is the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const sf = (a: string, n: number) => `$${a} \\times 10^{${n}}$`;
/** Two numbers in standard form, each in brackets, with the sign between them. */
const op = (a: string, n: number, sign: string, b: string, m: number) =>
  `$(${a} \\times 10^{${n}}) ${sign} (${b} \\times 10^{${m}})$`;

// ---------------------------------------------------------------------------------------------
// Multiplying and dividing in standard form.

const MULT = "y9-indices/multiply-standard-form";
const multMethod = [
  "Multiply (or divide) the numbers.",
  "Add the powers to multiply; take them away to divide.",
  "Is the number from 1 to 10? If not, adjust it.",
];
const MULT_RULE = maths("(3 \\times 10^4)(2 \\times 10^5) = 6 \\times 10^9");

const multiplySF = stepped(find(IX, MULT), {
  method: multMethod,
  variation: {
    relationship: "multiplying numbers in standard form",
    unknowns: ["answer"],
    surface: ["dividing", "numbers over 10", "negative powers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Multiplying huge numbers",
        ["**Multiply the numbers; add the powers of 10.**"],
        MULT_RULE,
        "Then check the number is from 1 to 10.",
      ),
      reworded(IX, MULT, "Spot the rule", { tag: "The rule" }),

      ...owned(IX, MULT, "Warm-up", "Check you remember"),

      methodCard("The method", multMethod, MULT_RULE),
      workedFrom(IX, MULT),
      calc(
        "Your turn",
        `Work out ${op("2", 6, "\\times", "4", 2)}.`,
        undefined,
        [
          ["Numbers: $2 \\times 4 =$", "8", "Multiply."],
          ["Powers: $6 + 2 =$", "8", "Add."],
        ],
        `${sf("8", 8)}.`,
      ),

      calc(
        "Practise",
        `Work out ${op("5", 3, "\\times", "8", 4)}.`,
        undefined,
        [
          ["$5 \\times 8 =$", "40", "Multiply."],
          ["$10^3 \\times 10^4 = 10^n$, $n =$", "7", "Add."],
          ["$40 \\times 10^7 = 4 \\times 10^n$, $n =$", "8", "40 is 4 × 10."],
        ],
        `${sf("4", 8)}.`,
      ),
      ...owned(IX, MULT, "Together", "Practise"),
      questionSet(
        "Practise",
        "Work out each one. Watch what changes.",
        [
          ask(`${op("2", 3, "\\times", "3", 5)}`, sf("6", 8), "Add the powers.", `${sf("6", 8)}.`, {
            asks: "answer",
            others: [sf("6", 15), sf("5", 8)],
          }),
          ask(
            `${op("6", 7, "\\div", "2", 3)}`,
            sf("3", 4),
            "Take the powers away.",
            `${sf("3", 4)}.`,
            {
              asks: "answer",
              changed: "Dividing.",
              others: [sf("3", 10), sf("4", 4)],
            },
          ),
          ask(
            `${op("4", 3, "\\times", "3", 2)}`,
            sf("1.2", 6),
            "12 is 1.2 × 10.",
            `${sf("1.2", 6)}.`,
            {
              asks: "answer",
              changed: "The number goes over 10.",
              others: [sf("12", 5), sf("1.2", 5)],
            },
          ),
          ask(
            `${op("2", 3, "\\div", "4", 5)}`,
            sf("5", -3),
            "0.5 is 5 × 10⁻¹.",
            `${sf("5", -3)}.`,
            {
              asks: "answer",
              changed: "The number goes under 1.",
              others: [sf("0.5", -2), sf("5", -2)],
            },
          ),
        ],
        "Numbers, then powers, then check.",
      ),

      questionSet(
        "Variation",
        "Work out each one. Watch what changes.",
        [
          ask(`${op("2", 3, "\\times", "3", 4)}`, sf("6", 7), "Add the powers.", `${sf("6", 7)}.`, {
            asks: "answer",
            others: [sf("6", 12), sf("5", 7)],
            expect: [
              `Mo says ${sf("6", 12)}. Right?`,
              "No",
              "Add the powers: 3 + 4 = 7.",
              [["Yes", "$10^3 \\times 10^4$ is $10^7$."]],
            ],
          }),
          ask(`${op("2", 3, "\\times", "3", -4)}`, sf("6", -1), "3 + (−4).", `${sf("6", -1)}.`, {
            asks: "answer",
            changed: "A negative power.",
            others: [sf("6", -12), sf("6", 7)],
          }),
          ask(
            `${op("2", 3, "\\times", "6", 4)}`,
            sf("1.2", 8),
            "12 is 1.2 × 10.",
            `${sf("1.2", 8)}.`,
            {
              asks: "answer",
              changed: "The number goes over 10.",
              others: [sf("12", 7), sf("1.2", 7)],
            },
          ),
          ask(
            `${op("6", 7, "\\div", "3", 4)}`,
            sf("2", 3),
            "Take away the powers.",
            `${sf("2", 3)}.`,
            {
              asks: "answer",
              changed: "Dividing.",
              others: [sf("2", 11), sf("3", 3)],
            },
          ),
        ],
        "Multiply: add the powers. Divide: take them away.",
      ),
      own(IX, MULT, "Spot the mistake"),

      own(IX, MULT, "Exit check"),

      reworded(
        IX,
        MULT,
        "How far does light go in a year?",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply the numbers; add the powers of 10.**"],
        MULT_RULE,
        [
          "**Multiply the numbers; add the powers of 10.**",
          "Divide: divide the numbers, take away the powers.",
          `$20 \\times 10^9$ is ${sf("2", 10)}.`,
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Adding and taking away in standard form.

const ADD = "y9-indices/add-standard-form";
const addMethod = [
  "Rewrite the smaller one with the bigger power.",
  "Add or take away the numbers in front.",
  "Check it's in standard form.",
];
const ADD_RULE = maths("3 \\times 10^3 + 4 \\times 10^2 = 3.4 \\times 10^3");

const addSF = stepped(find(IX, ADD), {
  method: addMethod,
  variation: {
    relationship: "adding numbers in standard form",
    unknowns: ["sum", "difference"],
    surface: ["the same power", "far-apart powers", "going over 10"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Adding huge numbers",
        ["**To add or take away, match the powers first.**"],
        ADD_RULE,
        "$4 \\times 10^2 = 0.4 \\times 10^3$: then add 3 + 0.4.",
      ),
      reworded(IX, ADD, "So what is $(3 \\times 10^3) + (4 \\times 10^2)$?", { tag: "The rule" }),

      ...owned(IX, ADD, "Warm-up", "Check you remember"),

      methodCard("The method", addMethod, ADD_RULE),
      worked(
        "Watch the method",
        "Work out $(6.2 \\times 10^5) + (3 \\times 10^4)$.",
        [
          { line: "$3 \\times 10^4 = 0.3 \\times 10^5$", note: "Match the bigger power." },
          { line: "$6.2 + 0.3 = 6.5$", note: "Add the numbers." },
          { line: "$6.5 \\times 10^5$", note: "Already in standard form." },
        ],
        "Match, then add.",
      ),
      calc(
        "Your turn",
        `Work out ${op("5.1", 6, "+", "4", 5)}.`,
        undefined,
        [
          [`${sf("4", 5)} = ? × $10^6$`, "0.4", "Match the bigger power."],
          ["$5.1 + 0.4 =$", "5.5", "Add the numbers."],
        ],
        `${sf("5.5", 6)}.`,
      ),

      calc(
        "Practise",
        `Work out ${op("7", 4, "-", "5", 3)}.`,
        undefined,
        [
          [`${sf("5", 3)} = ? × $10^4$`, "0.5", "Match the bigger power."],
          ["$7 - 0.5 =$", "6.5", "Take away."],
        ],
        `${sf("6.5", 4)}.`,
      ),
      ...owned(IX, ADD, "Together", "Practise"),
      questionSet(
        "Practise",
        "Work out each one. Watch what changes.",
        [
          ask(`${op("2", 5, "+", "3", 5)}`, sf("5", 5), "Same power: add.", `${sf("5", 5)}.`, {
            asks: "sum",
            others: [sf("5", 10), sf("6", 5)],
          }),
          ask(`${op("2", 5, "+", "3", 4)}`, sf("2.3", 5), "0.3 × 10⁵.", `${sf("2.3", 5)}.`, {
            asks: "sum",
            changed: "Different powers.",
            others: [sf("5", 9), sf("5", 5)],
          }),
          ask(`${op("2", 5, "-", "3", 4)}`, sf("1.7", 5), "2 − 0.3.", `${sf("1.7", 5)}.`, {
            asks: "difference",
            changed: "Taking away.",
            others: [sf("1.7", 4), sf("1", 1)],
          }),
          ask(`${op("8", 5, "+", "3", 5)}`, sf("1.1", 6), "11 is 1.1 × 10.", `${sf("1.1", 6)}.`, {
            asks: "sum",
            changed: "Over 10.",
            others: [sf("11", 5), sf("1.1", 5)],
          }),
        ],
        "Match the powers, then add or take away.",
      ),

      questionSet(
        "Variation",
        `Add to ${sf("4", 5)}. Watch what changes.`,
        [
          ask(`${op("4", 5, "+", "3", 2)}`, sf("4.003", 5), "0.003 × 10⁵.", `${sf("4.003", 5)}.`, {
            asks: "sum",
            others: [sf("7", 7), sf("7", 5)],
            expect: [
              `Jay says ${sf("7", 7)}. Right?`,
              "No",
              `Match the powers first: ${sf("4.003", 5)}.`,
              [["Yes", "Adding never adds the powers."]],
            ],
          }),
          ask(`${op("4", 5, "+", "3", 3)}`, sf("4.03", 5), "0.03 × 10⁵.", `${sf("4.03", 5)}.`, {
            asks: "sum",
            changed: "Closer powers.",
            others: [sf("7", 8), sf("4.3", 5)],
          }),
          ask(`${op("4", 5, "+", "3", 4)}`, sf("4.3", 5), "0.3 × 10⁵.", `${sf("4.3", 5)}.`, {
            asks: "sum",
            changed: "Closer still.",
            others: [sf("7", 9), sf("4.03", 5)],
          }),
          ask(`${op("4", 5, "+", "3", 5)}`, sf("7", 5), "Same power.", `${sf("7", 5)}.`, {
            asks: "sum",
            changed: "The same power.",
            others: [sf("7", 10), sf("4.3", 5)],
          }),
        ],
        "The further apart the powers, the smaller the change.",
      ),
      own(IX, ADD, "Spot the mistake"),

      own(IX, ADD, "Exit check"),

      reworded(IX, ADD, "A growing world", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**To add or take away, match the powers first.**"],
        ADD_RULE,
        [
          "**To add or take away, match the powers first.**",
          `${sf("3", 4)} = ${sf("0.3", 5)}.`,
          "Never add the powers when adding.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Multiplying and dividing powers.

const POWERS = "y9-indices/multiply-powers";
const powersMethod = [
  "Check the bases are the same.",
  "Multiplying: add the powers.",
  "Dividing: take them away.",
];
const LAWS = maths("a^m \\times a^n = a^{m+n} \\qquad a^m \\div a^n = a^{m-n}");

const multiplyPowers = stepped(find(IX, POWERS), {
  method: powersMethod,
  variation: {
    relationship: "the laws for multiplying and dividing powers",
    unknowns: ["multiply", "divide", "zero"],
    surface: ["negative powers", "different bases", "power 0"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Multiplying and dividing powers",
        ["**Same base: add the powers to multiply, take away to divide.**"],
        LAWS,
        "$2^3 \\times 2^2$ is five 2s multiplied: $2^5$.",
      ),
      reworded(IX, POWERS, "Spot the law", { tag: "The rule" }),
      reworded(IX, POWERS, "What is $5^0$?", { tag: "The rule" }),

      ...owned(IX, POWERS, "Warm-up", "Check you remember"),

      methodCard("The method", powersMethod, LAWS),
      workedFrom(IX, POWERS),
      calc(
        "Your turn",
        "Simplify $\\frac{2^6 \\times 2^3}{2^4}$.",
        undefined,
        [
          ["Top: $6 + 3 =$", "9", "Multiplying: add."],
          ["Divide: $9 - 4 =$", "5", "Dividing: take away."],
        ],
        "$2^5$.",
      ),

      calc(
        "Practise",
        "Simplify $\\frac{x^7 \\times x^2}{x^5}$.",
        undefined,
        [
          ["Top power:", "9", "7 + 2."],
          ["Then:", "4", "9 − 5."],
        ],
        "$x^4$.",
      ),
      ...owned(IX, POWERS, "Together", "Practise"),
      ...owned(IX, POWERS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find the power. Watch what changes.",
        [
          ask("$4^3 \\times 4^5 = 4^n$. $n =$", "8", "Add.", "8.", { asks: "multiply" }),
          ask("$4^8 \\div 4^5 = 4^n$. $n =$", "3", "Take away.", "3.", {
            asks: "divide",
            changed: "Dividing.",
          }),
          ask("$4^5 \\div 4^5 = 4^n$. $n =$", "0", "5 − 5.", "0.", {
            asks: "zero",
            changed: "The same power.",
          }),
          ask("$4^5 \\div 4^5 =$", "1", "Anything divided by itself.", "1: so $4^0 = 1$.", {
            asks: "zero",
            changed: "As a number.",
          }),
        ],
        "Add to multiply, take away to divide.",
      ),

      questionSet(
        "Variation",
        "Simplify each one. Watch what changes.",
        [
          ask("$3^5 \\times 3^2$", "$3^7$", "Keep the base.", "$3^7$.", {
            asks: "multiply",
            others: ["$9^7$", "$3^{10}$"],
            expect: [
              "Kim says $3^5 \\times 3^2 = 9^7$. Right?",
              "No",
              "Keep the base and add the powers: $3^7$.",
              [["Yes", "Don't multiply the bases."]],
            ],
          }),
          ask("$3^5 \\times 3^{-2}$", "$3^3$", "5 + (−2).", "$3^3$.", {
            asks: "multiply",
            changed: "A negative power.",
            others: ["$3^{-10}$", "$3^7$"],
          }),
          ask("$3^5 \\div 3^2$", "$3^3$", "5 − 2.", "$3^3$.", {
            asks: "divide",
            changed: "Dividing.",
            others: ["$1^3$", "$3^{2.5}$"],
          }),
          ask(
            "$3^5 \\times 2^2$",
            "It can't be one power",
            "Different bases.",
            "No single power.",
            {
              asks: "multiply",
              changed: "Different bases.",
              others: ["$6^7$", "$5^7$"],
            },
          ),
        ],
        "The laws only work with the same base.",
      ),
      own(IX, POWERS, "Spot the mistake"),

      own(IX, POWERS, "Exit check"),

      reworded(IX, POWERS, "How big is a megabyte?", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Same base: add the powers to multiply, take away to divide.**"],
        LAWS,
        [
          "**Same base: add the powers to multiply, take away to divide.**",
          "$a^0 = 1$.",
          "Keep the base: $3^5 \\times 3^2 = 3^7$, not $9^7$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// A power of a power.

const POWER = "y9-indices/power-of-a-power";
const powerMethod = [
  "Multiply the powers of each letter.",
  "Raise the number to the power too.",
  "Don't add: that's for multiplying two powers.",
];
const POW = maths("(a^m)^n = a^{mn} \\qquad (2x^3)^2 = 4x^6");

const powerOfPower = stepped(find(IX, POWER), {
  method: powerMethod,
  variation: {
    relationship: "a power of a power",
    unknowns: ["power", "number"],
    surface: ["swapped powers", "numbers inside", "negative powers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A power of a power",
        ["**A power of a power: multiply the powers.**"],
        POW,
        "A number inside the bracket gets the power too.",
      ),
      reworded(IX, POWER, "Spot the rule", { tag: "The rule" }),

      ...owned(IX, POWER, "Warm-up", "Check you remember"),

      methodCard("The method", powerMethod, POW),
      workedFrom(IX, POWER),
      calc(
        "Your turn",
        "Simplify $(2y^5)^3$.",
        undefined,
        [
          ["$2^3 =$", "8", "The number gets the power."],
          ["Power of y: $5 \\times 3 =$", "15", "Multiply the powers."],
        ],
        "$8y^{15}$.",
      ),

      calc(
        "Practise",
        "Simplify $(x^4)^5$.",
        undefined,
        [["Power: $4 \\times 5 =$", "20", "Multiply."]],
        "$x^{20}$.",
      ),
      ...owned(IX, POWER, "Together", "Practise"),
      ...owned(IX, POWER, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("$(x^3)^5 = x^n$. $n =$", "15", "Multiply.", "15.", { asks: "power" }),
          ask("$(x^5)^3 = x^n$. $n =$", "15", "Multiply.", "15.", {
            asks: "power",
            changed: "Swap the powers.",
          }),
          ask("$(2x^5)^3$: the number in front?", "8", "$2^3$.", "8.", {
            asks: "number",
            changed: "A number inside.",
          }),
          ask("$(x^{-2})^3 = x^n$. $n =$", ["-6", "−6"], "−2 × 3.", "−6.", {
            asks: "power",
            changed: "A negative power.",
          }),
        ],
        "Multiply the powers; power the number.",
      ),

      questionSet(
        "Variation",
        "Simplify each one. Watch what changes.",
        [
          ask("$(4y^3)^2$", "$16y^6$", "Square the 4 too.", "$16y^6$.", {
            asks: "number",
            others: ["$4y^6$", "$8y^6$"],
            expect: [
              "Leo writes $(4y^3)^2 = 4y^6$. Right?",
              "No",
              "The 4 is squared too: $16y^6$.",
              [["Yes", "Square the 4 as well."]],
            ],
          }),
          ask("$(4y^3)^3$", "$64y^9$", "$4^3$ and 3 × 3.", "$64y^9$.", {
            asks: "number",
            changed: "Cubed.",
            others: ["$12y^9$", "$64y^6$"],
          }),
          ask("$(4y)^2$", "$16y^2$", "y is $y^1$.", "$16y^2$.", {
            asks: "number",
            changed: "y on its own.",
            others: ["$4y^2$", "$16y$"],
          }),
          ask("$4(y^3)^2$", "$4y^6$", "The 4 is outside.", "$4y^6$.", {
            asks: "number",
            changed: "The 4 outside the bracket.",
            others: ["$16y^6$", "$4y^5$"],
          }),
        ],
        "Everything inside the bracket gets the power.",
      ),
      own(IX, POWER, "Spot the mistake"),

      own(IX, POWER, "Exit check"),

      reworded(IX, POWER, "Pixels in a photo", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**A power of a power: multiply the powers.**"],
        POW,
        [
          "**A power of a power: multiply the powers.**",
          "$(2x^3)^2 = 4x^6$: the number is squared too.",
          "$(x^2)^3 = x^6$, not $x^5$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Putting the laws together.

const SIMPLIFY = "y9-indices/simplify";
const simplifyMethod = [
  "Multiply or divide the numbers.",
  "Each letter by its law: add to multiply, take away to divide.",
  "Write the number first, then the letters.",
];
const SORT = maths("3x^2 \\times 4x^5 = 12x^7");

const simplify = stepped(find(IX, SIMPLIFY), {
  method: simplifyMethod,
  variation: {
    relationship: "numbers and letters, each simplified by its own rule",
    unknowns: ["number", "power"],
    surface: ["dividing", "two letters", "a power of a power"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Putting the laws together",
        ["**Numbers with numbers; each letter by its law.**"],
        SORT,
        "$3 \\times 4 = 12$, and $x^2 \\times x^5 = x^7$.",
      ),
      reworded(IX, SIMPLIFY, "$3x^2 \\times 4x^5 =$", { tag: "The rule" }),

      ...owned(IX, SIMPLIFY, "Warm-up", "Check you remember"),

      methodCard("The method", simplifyMethod, SORT),
      workedFrom(IX, SIMPLIFY),
      calc(
        "Your turn",
        "Simplify $6x^4 \\times 3x^2$.",
        undefined,
        [
          ["Numbers: $6 \\times 3 =$", "18", "Multiply."],
          ["Power of x: $4 + 2 =$", "6", "Add."],
        ],
        "$18x^6$.",
      ),

      calc(
        "Practise",
        "Simplify $\\frac{20y^9}{4y^3}$.",
        undefined,
        [
          ["Numbers: $20 \\div 4 =$", "5", "Divide."],
          ["Power of y: $9 - 3 =$", "6", "Take away."],
        ],
        "$5y^6$.",
      ),
      ...owned(IX, SIMPLIFY, "Together", "Practise"),
      ...owned(IX, SIMPLIFY, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each part. Watch what changes.",
        [
          ask("$3a^4 \\times 5a^2$: the number?", "15", "3 × 5.", "15.", { asks: "number" }),
          ask("$3a^4 \\times 5a^2$: the power of a?", "6", "4 + 2.", "6.", {
            asks: "power",
            changed: "Now the power.",
          }),
          ask("$\\frac{30a^6}{5a^2}$: the number?", "6", "30 ÷ 5.", "6.", {
            asks: "number",
            changed: "Dividing.",
          }),
          ask("$\\frac{30a^6}{5a^2}$: the power of a?", "4", "6 − 2.", "4.", {
            asks: "power",
            changed: "Take away.",
          }),
        ],
        "Numbers and letters, separately.",
      ),

      questionSet(
        "Variation",
        "Simplify each one. Watch what changes.",
        [
          ask("$4x^3 \\times 3x^2$", "$12x^5$", "Add the powers.", "$12x^5$.", {
            asks: "power",
            others: ["$12x^6$", "$7x^5$"],
            expect: [
              "Zoe writes $4x^3 \\times 3x^2 = 12x^6$. Right?",
              "No",
              "Multiplying: add the powers, 3 + 2 = 5.",
              [["Yes", "Add, don't multiply, the powers."]],
            ],
          }),
          ask("$\\frac{12x^3}{3x^2}$", "$4x$", "Divide, take away.", "$4x$.", {
            asks: "power",
            changed: "Divide instead.",
            others: ["$4x^5$", "$9x$"],
          }),
          ask("$4x^3 \\times 3y^2$", "$12x^3y^2$", "Different letters stay apart.", "$12x^3y^2$.", {
            asks: "power",
            changed: "Two letters.",
            others: ["$12xy^5$", "$12x^5$"],
          }),
          ask("$(4x^3)^2$", "$16x^6$", "Square everything.", "$16x^6$.", {
            asks: "number",
            changed: "A power of a power.",
            others: ["$8x^6$", "$16x^5$"],
          }),
        ],
        "Read the sign: multiply, divide or a power.",
      ),
      own(IX, SIMPLIFY, "Spot the mistake"),

      own(IX, SIMPLIFY, "Exit check"),

      reworded(
        IX,
        SIMPLIFY,
        "Rectangles with letters",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Numbers with numbers; each letter by its law.**"],
        SORT,
        [
          "**Numbers with numbers; each letter by its law.**",
          "$\\frac{8x^6}{2x^2} = 4x^4$.",
          "Different letters stay apart: $12x^3y^2$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

export const y9IndicesStepped: [string, UnitLesson[]][] = [
  [MULT, [multiplySF]],
  [ADD, [addSF]],
  [POWERS, [multiplyPowers]],
  [POWER, [powerOfPower]],
  [SIMPLIFY, [simplify]],
];
