// Year 7, "Algebraic notation", on the stepped template (docs/proposals/lesson-stepped.md):
// algebra's shorthand for multiplying, powers of letters, fractions and brackets, and the words of
// algebra. The expression is the picture in each, with a square for a squared letter.
import {
  ask,
  calc,
  choose,
  explain,
  methodCard,
  questionSet,
  summary,
  typed,
  worked,
} from "./build.ts";
import { find, own, owned, reworded, stepped } from "./stepped.ts";
import type { Picture, Screen, ShapePic, UnitLesson } from "./types.ts";
import { y7Notation } from "./y7-notation.ts";

const ALGEBRA = "Algebra: the expression is the picture.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });
const square = (side: string): ShapePic => ({
  kind: "shape",
  points: [
    { x: 0, y: 0 },
    { x: 4, y: 0 },
    { x: 4, y: 4 },
    { x: 0, y: 4 },
  ],
  sides: [side, side, null, null],
  square: [0, 1, 2, 3],
});

/** A question with no picture is algebra in words: say so. */
const worded = (screens: Screen[]): Screen[] =>
  screens.map((s) =>
    ["answer", "choice", "calc", "set", "steps", "fill", "sort"].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture)
      ? { ...s, wordsOnly: ALGEBRA }
      : s,
  );

const list = y7Notation;

// ---------------------------------------------------------------------------------------------
// Algebra's shorthand.

const PRODUCTS = "y7-notation/products";
const productsMethod = [
  "Leave out every × sign.",
  "Times the numbers, and write them first.",
  "Then the letters, in order.",
];

const products = stepped(find(list, PRODUCTS), {
  method: productsMethod,
  variation: {
    relationship: "a product written out and its short form",
    unknowns: ["short form", "value"],
    surface: ["two numbers", "two letters", "zero", "negatives", "shopping"],
  },
  screens: worded([
    explain(
      "The rule",
      "Algebra's shorthand",
      [
        "**Leave out the × sign, and write the number first.**",
        "$4 \\times p = 4p$ and $a \\times b = ab$.",
      ],
      maths("p \\times 4 = 4p"),
      "× looks like the letter x, so we leave it out.",
    ),
    reworded(list, PRODUCTS, "How do we write $y \\times 3$?", { tag: "The rule" }),

    ...owned(list, PRODUCTS, "Warm-up", "Check you remember"),
    typed(
      "Check you remember",
      "What is $2 \\times 3 \\times 4$?",
      "24",
      "2 × 3 is 6, then times 4.",
      "24.",
    ),

    methodCard("The method", productsMethod, maths("5 \\times x \\times 4 = 20x")),
    worked(
      "Watch the method",
      "Write $2 \\times a \\times b$ and $5 \\times x \\times 4$ the short way.",
      [
        { line: "$2 \\times a \\times b = 2ab$", note: "Leave out the × signs." },
        { line: "$5 \\times x \\times 4 = 20x$", note: "Times the numbers: 5 × 4." },
      ],
      "$2ab$ and $20x$.",
    ),
    calc(
      "Your turn",
      "Write $b \\times 6 \\times a$ the short way.",
      undefined,
      [
        ["The number goes first:", "6", "The only number."],
        ["Then the letters, in order:", "ab", "Alphabetical order."],
      ],
      "$6ab$.",
    ),

    calc(
      "Practise",
      "If $n = 5$, what is $3n$?",
      undefined,
      [
        ["$3n = 3 \\times$", "5", "$3n$ means 3 times n."],
        ["$3 \\times 5 =$", "15", "Times them."],
      ],
      "15.",
    ),
    ...owned(list, PRODUCTS, "Your turn", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Write $k \\times 9$ the short way.", "$9k$", "The number first.", "$9k$.", {
          asks: "short form",
          others: ["$k9$", "$9 + k$"],
        }),
        ask(
          "Write $2 \\times p \\times 3 \\times q$ the short way.",
          "$6pq$",
          "2 × 3 is 6.",
          "$6pq$.",
          {
            asks: "short form",
            changed: "Two numbers and two letters.",
            others: ["$23pq$", "$5pq$"],
          },
        ),
        ask("If $n = 6$, what is $5n$?", "30", "5 × 6.", "30.", {
          asks: "value",
          changed: "Now find its value.",
        }),
        ask("If $a = 4$ and $b = 3$, what is $ab$?", "12", "4 × 3.", "12.", {
          asks: "value",
          changed: "Two letters.",
        }),
      ],
      "No × signs, numbers first; a letter next to a number means times.",
    ),

    questionSet(
      "Variation",
      "Find $4x$. Watch what changes.",
      [
        ask("If $x = 2$, what is $4x$?", "8", "4 × 2.", "8.", {
          asks: "value",
          expect: [
            "Kim says $4x = 42$. Is she right?",
            "No: it's 8",
            "$4x$ means 4 × x: 4 × 2 = 8.",
            [["Yes", "The digits aren't put side by side: it's times."]],
          ],
        }),
        ask("If $x = 10$, what is $4x$?", "40", "4 × 10.", "40.", {
          asks: "value",
          changed: "A bigger x.",
        }),
        ask("If $x = 0$, what is $4x$?", "0", "4 × 0.", "0.", {
          asks: "value",
          changed: "x is 0.",
        }),
        ask("If $x = -2$, what is $4x$?", "-8", "4 × −2.", "−8.", {
          asks: "value",
          changed: "x is negative.",
        }),
      ],
      "$4x$ is always 4 times x, whatever x is.",
    ),
    own(list, PRODUCTS, "Spot the mistake"),

    own(list, PRODUCTS, "Exit check"),

    reworded(list, PRODUCTS, "Pens and pencils", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Leave out the × sign, and write the number first.**"],
      maths("p \\times 4 = 4p"),
      [
        "**Leave out the × sign, and write the number first.**",
        "$5 \\times x \\times 4 = 20x$; $b \\times 6 \\times a = 6ab$",
        "$4x$ means 4 times x: if $x = 2$, $4x = 8$.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Powers in algebra.

const POWERS = "y7-notation/powers";
const powersMethod = [
  "Count how many of each letter are multiplied.",
  "Write the count as a power.",
  "A number in front stays in front: $3x^2$.",
];

const powers = stepped(find(list, POWERS), {
  method: powersMethod,
  variation: {
    relationship: "a letter multiplied by itself and its power",
    unknowns: ["power form", "value"],
    surface: ["cubes", "two letters", "a number in front", "brackets", "gardens"],
  },
  screens: worded([
    explain(
      "The rule",
      "Powers in algebra",
      [
        "**The power counts how many of the letter are multiplied.**",
        "$a \\times a = a^2$ and $a \\times a \\times a = a^3$.",
      ],
      square("s"),
      "$a^2$ is 'a squared': a times a, not 2 times a.",
    ),
    reworded(list, POWERS, "$y \\times y \\times y \\times y =$", { tag: "The rule" }),

    ...owned(list, POWERS, "Warm-up", "Check you remember"),
    typed("Check you remember", "What is $3^3$?", "27", "3 × 3 × 3.", "27."),

    methodCard("The method", powersMethod, maths("3 \\times x \\times x = 3x^2")),
    worked(
      "Watch the method",
      "Write $a \\times a \\times b$ and $3 \\times x \\times x$ with powers.",
      [
        { line: "$a \\times a \\times b = a^2b$", note: "Two a's, one b." },
        { line: "$3 \\times x \\times x = 3x^2$", note: "The 3 stays in front." },
      ],
      "$a^2b$ and $3x^2$.",
    ),
    calc(
      "Your turn",
      "If $x = 5$, what is $x^2$?",
      square("5"),
      [
        ["$x^2 = 5 \\times$", "5", "x times x."],
        ["$5 \\times 5 =$", "25", "Times them."],
      ],
      "25.",
    ),

    calc(
      "Practise",
      "If $x = 4$, what is $3x^2$?",
      undefined,
      [
        ["$x^2 =$", "16", "The power first: 4 × 4."],
        ["$3x^2 = 3 \\times 16 =$", "48", "Then times by 3."],
      ],
      "48.",
    ),
    ...owned(list, POWERS, "Your turn", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Write $b \\times b \\times b$ with a power.", "$b^3$", "Three b's.", "$b^3$.", {
          asks: "power form",
          others: ["$3b$", "$b3$"],
        }),
        ask("Write $m \\times m \\times n$ with powers.", "$m^2n$", "Two m's, one n.", "$m^2n$.", {
          asks: "power form",
          changed: "Two letters.",
          others: ["$2mn$", "$m^3n$"],
        }),
        ask("If $y = 5$, what is $y^2$?", "25", "5 × 5.", "25.", {
          asks: "value",
          changed: "Now find its value.",
        }),
        ask("If $x = 2$, what is $5x^2$?", "20", "The power first: 5 × 4.", "20.", {
          asks: "value",
          changed: "A number in front.",
        }),
      ],
      "The power counts the letters; a number in front multiplies after.",
    ),

    questionSet(
      "Variation",
      "$n = 6$. Find each one. Watch what changes.",
      [
        ask("What is $n^2$?", "36", "6 × 6.", "36.", {
          asks: "value",
          expect: [
            "Ben says $n^2 = 12$. Is he right?",
            "No: it's 36",
            "$n^2$ is n times n: 6 × 6 = 36.",
            [["Yes", "12 is 2 × 6. Squaring is 6 × 6."]],
          ],
        }),
        ask("What is $2n$?", "12", "2 × 6.", "12.", {
          asks: "value",
          changed: "Now 2n, not n squared.",
        }),
        ask("What is $n^3$?", "216", "6 × 6 × 6.", "216.", {
          asks: "value",
          changed: "Cubed now.",
        }),
        ask("What is $(2n)^2$?", "144", "Brackets first: 12 × 12.", "144.", {
          asks: "value",
          changed: "Brackets: double first.",
        }),
      ],
      "A power multiplies the letter by itself; 2n just doubles it.",
    ),
    own(list, POWERS, "Spot the mistake"),

    own(list, POWERS, "Exit check"),

    reworded(list, POWERS, "A square garden", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**The power counts how many of the letter are multiplied.**"],
      square("s"),
      [
        "**The power counts how many of the letter are multiplied.**",
        "$a \\times a = a^2$; $3 \\times x \\times x = 3x^2$",
        "If $n = 6$: $n^2 = 36$, but $2n = 12$.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Fractions and brackets.

const FRACTIONS = "y7-notation/fractions-brackets";
const fractionsMethod = [
  "Dividing: write it as a fraction.",
  "Something done first? Put it in brackets.",
  "Leave out the × before a bracket.",
];

const fractionsBrackets = stepped(find(list, FRACTIONS), {
  method: fractionsMethod,
  variation: {
    relationship: "words, the expression they say, and its value",
    unknowns: ["expression", "value"],
    surface: ["the order of the words", "halving", "brackets or not", "bills"],
  },
  screens: worded([
    explain(
      "The rule",
      "Fractions and brackets",
      [
        "**Write dividing as a fraction, and group with brackets.**",
        "$b \\div 4 = \\frac{b}{4}$, and $3(n + 2)$ is 3 lots of $n + 2$.",
      ],
      maths("\\frac{b}{4} \\qquad 3(n + 2)"),
      "Brackets show what is done first.",
    ),
    reworded(list, FRACTIONS, "How do we write $x \\div 5$?", { tag: "The rule" }),

    ...owned(list, FRACTIONS, "Warm-up", "Check you remember"),
    typed("Check you remember", "What is $(6 + 4) \\div 2$?", "5", "Brackets first: 10 ÷ 2.", "5."),

    methodCard("The method", fractionsMethod, maths("2(n + 3) \\qquad \\frac{y}{2}")),
    worked(
      "Watch the method",
      "Write 'add 3 to n, then times by 2', and 'halve y'.",
      [
        { line: "$2(n + 3)$", note: "The adding comes first, so it goes in brackets." },
        { line: "$\\frac{y}{2}$", note: "Halving is dividing by 2." },
      ],
      "$2(n + 3)$ and $\\frac{y}{2}$.",
    ),
    calc(
      "Your turn",
      "If $n = 6$, what is $\\frac{n + 4}{2}$?",
      undefined,
      [
        ["$n + 4 =$", "10", "The top first."],
        ["$10 \\div 2 =$", "5", "Then divide."],
      ],
      "5.",
    ),

    calc(
      "Practise",
      "If $n = 4$, what is $3(n + 2)$?",
      undefined,
      [
        ["$n + 2 =$", "6", "Brackets first."],
        ["$3 \\times 6 =$", "18", "Then times by 3."],
      ],
      "18.",
    ),
    ...owned(list, FRACTIONS, "Your turn", "Practise").filter((s) => s.kind === "fill"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask(
          "Write $m \\div 6$ in algebra.",
          "$\\frac{m}{6}$",
          "Dividing is a fraction.",
          "$\\frac{m}{6}$.",
          {
            asks: "expression",
            others: ["$\\frac{6}{m}$", "$6m$"],
          },
        ),
        ask("Times n by 2, then add 3.", "$2n + 3$", "The times comes first.", "$2n + 3$.", {
          asks: "expression",
          changed: "Two steps in words.",
          others: ["$2(n + 3)$", "$2 + 3n$"],
        }),
        ask(
          "Add 3 to n, then times by 2.",
          "$2(n + 3)$",
          "The adding comes first.",
          "$2(n + 3)$.",
          {
            asks: "expression",
            changed: "The order swaps.",
            others: ["$2n + 3$", "$n + 6$"],
          },
        ),
        ask("If $n = 2$, what is $5(n + 3)$?", "25", "5 × 5.", "25.", {
          asks: "value",
          changed: "Now find a value.",
        }),
      ],
      "The order of the words decides the brackets.",
    ),

    questionSet(
      "Variation",
      "Find each one. Watch what changes.",
      [
        ask("If $x = 1$, what is $2(x + 5)$?", "12", "2 × 6.", "12.", {
          asks: "value",
          expect: [
            "Is $2(x + 5)$ the same as $2x + 5$?",
            "No",
            "$2(x + 5)$ doubles the 5 too.",
            [["Yes", "Try x = 1 in both: 12 and 7."]],
          ],
        }),
        ask("If $x = 1$, what is $2x + 5$?", "7", "2 × 1 + 5.", "7.", {
          asks: "value",
          changed: "No brackets now.",
        }),
        ask("If $x = 8$, what is $\\frac{x + 2}{5}$?", "2", "10 ÷ 5.", "2.", {
          asks: "value",
          changed: "A fraction over a sum.",
        }),
        ask("If $x = 8$, what is $\\frac{x}{2} + 5$?", "9", "Only the x is halved.", "9.", {
          asks: "value",
          changed: "Only the x is divided.",
        }),
      ],
      "Brackets and fraction lines both say: do this part first.",
    ),
    own(list, FRACTIONS, "Spot the mistake"),

    own(list, FRACTIONS, "Exit check"),

    reworded(list, FRACTIONS, "Sharing the bill", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Write dividing as a fraction, and group with brackets.**"],
      maths("\\frac{b}{4} \\qquad 3(n + 2)"),
      [
        "**Write dividing as a fraction, and group with brackets.**",
        "'Add 3 to n, then times by 2': $2(n + 3)$",
        "$2(x + 5)$ is not $2x + 5$: it doubles the 5 too.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// The words of algebra.

const WORDS = "y7-notation/words";
const wordsMethod = [
  "An = sign? It's an equation.",
  "$<$, $>$, $\\le$ or $\\ge$? It's an inequality.",
  "No sign? It's an expression.",
  "Terms are split by + and −.",
];

const words = stepped(find(list, WORDS), {
  method: wordsMethod,
  variation: {
    relationship: "a piece of algebra and its name",
    unknowns: ["name", "terms", "factor"],
    surface: ["signs", "no letters", "a single letter", "factors"],
  },
  screens: worded([
    explain(
      "The rule",
      "The words of algebra",
      ["**An expression has no = sign. An equation has one.**"],
      maths("\\begin{array}{l} 3x + 2 \\\\ 3x + 2 = 11 \\\\ 3x + 2 > 11 \\end{array}"),
      "An inequality uses $<$, $>$, $\\le$ or $\\ge$.",
    ),
    explain(
      "The rule",
      "Terms",
      ["A **term** is a number, a letter, or both multiplied: $3x$, $5$, $ab$."],
      maths("3x + 2"),
      "$3x + 2$ has two terms: $3x$ and $2$.",
    ),

    ...owned(list, WORDS, "Warm-up", "Check you remember"),
    choose("Check you remember", "Is $3 + 4 = 7$ true?", "Yes", "Both sides are 7.", [
      ["No", "Work out 3 + 4."],
    ]),

    methodCard(
      "The method",
      wordsMethod,
      maths("\\begin{array}{l} 4y - 1 \\\\ 4y - 1 = 7 \\\\ 4y - 1 \\le 7 \\end{array}"),
    ),
    worked(
      "Watch the method",
      "Name each one: $4y - 1$, $4y - 1 = 7$, $4y - 1 \\le 7$.",
      [
        { line: "$4y - 1$: an expression", note: "No sign comparing two sides." },
        { line: "$4y - 1 = 7$: an equation", note: "An = sign." },
        { line: "$4y - 1 \\le 7$: an inequality", note: "A $\\le$ sign." },
      ],
      "Expression, equation, inequality.",
    ),
    calc(
      "Your turn",
      "How many terms are in $5a + 3b - 2$?",
      undefined,
      [["Split at each + and −. Terms:", "3", "$5a$, $3b$ and $2$."]],
      "3 terms.",
    ),

    calc(
      "Practise",
      "How many terms are in $x^2 + 4x - 1$?",
      undefined,
      [["Split at each + and −. Terms:", "3", "$x^2$, $4x$ and $1$."]],
      "3 terms.",
    ),
    ...owned(list, WORDS, "Your turn", "Practise"),
    questionSet(
      "Practise",
      "Name each one. Watch what changes.",
      [
        ask("$5y - 3 = 12$ is", "an equation", "It has an = sign.", "An equation.", {
          asks: "name",
          others: ["an expression", "an inequality"],
        }),
        ask("$5y - 3$ is", "an expression", "No sign at all.", "An expression.", {
          asks: "name",
          changed: "The = 12 is gone.",
          others: ["an equation", "an inequality"],
        }),
        ask("$5y - 3 < 12$ is", "an inequality", "It has a < sign.", "An inequality.", {
          asks: "name",
          changed: "Now a < sign.",
          others: ["an equation", "an expression"],
        }),
        ask("How many terms in $4x + 2y - 7$?", "3", "Split at + and −.", "3.", {
          asks: "terms",
          changed: "Now count the terms.",
        }),
      ],
      "The sign names it; + and − split the terms.",
    ),

    questionSet(
      "Variation",
      "Name or find each one. Watch what changes.",
      [
        ask("$4x + 3$ is", "an expression", "There's no = sign.", "An expression.", {
          asks: "name",
          others: ["an equation", "an inequality"],
          expect: [
            "Raj says $4x + 3$ is an equation. Is he right?",
            "No",
            "An equation needs an = sign. This is an expression.",
            [["Yes", "Look for an = sign: there isn't one."]],
          ],
        }),
        ask("Which is a factor of $12x$?", "$4x$", "$4x \\times 3 = 12x$.", "$4x$.", {
          asks: "factor",
          changed: "Now a factor.",
          others: ["$12 + x$", "$5$"],
        }),
        ask("$x = 3$ is", "an equation", "It has an = sign.", "An equation.", {
          asks: "name",
          changed: "Just a letter and a number.",
          others: ["an expression", "an inequality"],
        }),
        ask("$2 + 3 = 5$ is", "an equation", "It has an = sign.", "An equation.", {
          asks: "name",
          changed: "No letters at all.",
          others: ["an expression", "an inequality"],
        }),
      ],
      "Look at the sign: =, an inequality sign, or none.",
    ),
    own(list, WORDS, "Spot the mistake"),

    own(list, WORDS, "Exit check"),

    summary(
      "What to remember",
      ["**An expression has no = sign. An equation has one.**"],
      maths("\\begin{array}{l} 3x + 2 \\\\ 3x + 2 = 11 \\\\ 3x + 2 > 11 \\end{array}"),
      [
        "**An expression has no = sign. An equation has one.**",
        "An inequality uses <, >, ≤ or ≥.",
        "Terms are split by + and −: $5a + 3b - 2$ has 3.",
        "A factor multiplies to make a term: 6 and x in $6x$.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7NotationStepped: [string, UnitLesson[]][] = [
  [PRODUCTS, [products]],
  [POWERS, [powers]],
  [FRACTIONS, [fractionsBrackets]],
  [WORDS, [words]],
];
