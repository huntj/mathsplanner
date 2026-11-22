// Year 7, "Simplifying expressions", on the stepped template (docs/proposals/lesson-stepped.md):
// collecting like terms, multiplying out a bracket, substituting, and formulae. The bracket is
// shown as an area grid, and a formula's rectangle is drawn.
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
import { y7Simplifying } from "./y7-simplifying.ts";

const ALGEBRA = "Algebra: the expression is the picture.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });

/** A bracket times out as a grid: the term outside down the side, the terms inside along the top. */
const grid = (outside: string, inside: string[], cells: string[]): Picture => ({
  kind: "table",
  head: ["×", ...inside],
  rows: [[outside, ...cells]],
});

const rectangle = (l: string, w: string): ShapePic => ({
  kind: "shape",
  points: [
    { x: 0, y: 0 },
    { x: 6, y: 0 },
    { x: 6, y: 4 },
    { x: 0, y: 4 },
  ],
  sides: [l, w, null, null],
  square: [0, 1, 2, 3],
});

/** A question in a lesson of algebra with no picture is worded: say so once for each. */
const worded = (screens: Screen[]): Screen[] =>
  screens.map((s) =>
    ["answer", "choice", "calc", "set", "steps", "fill"].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture)
      ? { ...s, wordsOnly: ALGEBRA }
      : s,
  );

const list = y7Simplifying;

// ---------------------------------------------------------------------------------------------
// Collecting like terms.

const LIKE = "y7-simplifying/like-terms";
const likeMethod = [
  "Find the like terms: the same letters.",
  "Add or take away their numbers.",
  "Unlike terms stay apart.",
];

const likeTerms = stepped(find(list, LIKE), {
  method: likeMethod,
  variation: {
    relationship: "an expression and its simplest form",
    unknowns: ["sum", "difference", "mixed"],
    surface: ["two letters", "numbers", "powers", "negatives", "ab and ba"],
  },
  screens: worded([
    explain(
      "The rule",
      "Collecting like terms",
      ["**Like terms have the same letters. Add their numbers.**"],
      maths("3a + 4a = 7a \\qquad 3a + 2b"),
      "$3a$ and $2b$ are unlike, so they stay apart.",
    ),

    typed(
      "Check you remember",
      "3 apples and 4 more apples. How many apples?",
      "7",
      "3 + 4.",
      "7 apples.",
    ),
    choose(
      "Check you remember",
      "Are 3 apples and 2 bananas the same as 5 apples?",
      "No",
      "They're 5 pieces of fruit, but not 5 apples.",
      [["Yes", "Bananas aren't apples."]],
    ),
    typed("Check you remember", "What is $5 - 2 + 4$?", "7", "Left to right: 3, then 7.", "7."),

    methodCard("The method", likeMethod, maths("4a + 3b - a + 2b = 3a + 5b")),
    worked(
      "Watch the method",
      "Simplify $4a + 3b - a + 2b$.",
      [
        { line: "The a's: $4a - a = 3a$", note: "$a$ on its own is $1a$." },
        { line: "The b's: $3b + 2b = 5b$" },
        { line: "$3a + 5b$", note: "Unlike terms stay apart." },
      ],
      "$3a + 5b$.",
    ),
    calc(
      "Your turn",
      "Simplify $6y - 2y + 3$.",
      undefined,
      [
        ["The y's: $6y - 2y =$", "4y", "6 take away 2, still y's."],
        ["$6y - 2y + 3 = 4y +$", "3", "The 3 has no letter: it stays."],
      ],
      "$4y + 3$.",
    ),

    calc(
      "Practise",
      "Simplify $2x + 5 + 3x - 1$.",
      undefined,
      [
        ["The x's: $2x + 3x =$", "5x", "2 + 3, still x's."],
        ["The numbers: $5 - 1 =$", "4", "The terms with no letter."],
      ],
      "$5x + 4$.",
    ),
    ...owned(list, LIKE, "Your turn", "Practise"),
    questionSet(
      "Practise",
      "Simplify each one. Watch what changes.",
      [
        ask("Simplify $5x + 2x$.", "7x", "5 + 2, still x's.", "$7x$.", { asks: "sum" }),
        ask("Simplify $5x - 2x$.", "3x", "5 − 2, still x's.", "$3x$.", {
          asks: "difference",
          changed: "Take away now.",
        }),
        ask("Simplify $5x + 2 + x$.", "6x + 2", "The x's: $5x + x$.", "$6x + 2$.", {
          asks: "mixed",
          changed: "A number joins in.",
        }),
        ask("Simplify $3a + 2b + a$.", "4a + 2b", "The a's: $3a + a$.", "$4a + 2b$.", {
          asks: "mixed",
          changed: "Two letters.",
        }),
      ],
      "Collect each kind of term; unlike terms stay apart.",
    ),

    questionSet(
      "Variation",
      "Simplify each one. Watch what changes.",
      [
        ask("Simplify $3a + 4b$.", "$3a + 4b$", "They're unlike terms.", "It stays $3a + 4b$.", {
          asks: "mixed",
          others: ["$7ab$", "$7a$"],
          expect: [
            "Jay writes $3a + 4b = 7ab$. Is he right?",
            "No",
            "$a$ and $b$ are unlike terms: it stays $3a + 4b$.",
            [["Yes", "Apples and bananas don't make 7 apple-bananas."]],
          ],
        }),
        ask(
          "Simplify $3x^2 + 2x$.",
          "$3x^2 + 2x$",
          "$x^2$ and $x$ are unlike.",
          "It stays $3x^2 + 2x$.",
          {
            asks: "mixed",
            changed: "$x^2$ and $x$ look alike, but aren't.",
            others: ["$5x^3$", "$5x^2$"],
          },
        ),
        ask("Simplify $-2q + 4q$.", "2q", "Start at −2, add 4.", "$2q$.", {
          asks: "sum",
          changed: "A negative to start.",
        }),
        ask("Simplify $ab + ba$.", "2ab", "$ba$ is the same as $ab$.", "$2ab$.", {
          asks: "sum",
          changed: "The letters swap places.",
        }),
      ],
      "Like terms need exactly the same letters and powers.",
    ),
    own(list, LIKE, "Spot the mistake"),

    own(list, LIKE, "Exit check"),

    reworded(list, LIKE, "A fruit order", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Like terms have the same letters. Add their numbers.**"],
      maths("4a + 3b - a + 2b = 3a + 5b"),
      [
        "**Like terms have the same letters. Add their numbers.**",
        "Unlike terms stay apart: $3a + 4b$ can't be simpler.",
        "$4a + 3b - a + 2b = 3a + 5b$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Multiplying out a bracket.

const EXPAND = "y7-simplifying/expand";
const expandMethod = [
  "Times the outside by the first term inside.",
  "Times it by the next term, with its sign.",
  "Write the answers together.",
];

const expand = stepped(find(list, EXPAND), {
  method: expandMethod,
  variation: {
    relationship: "a bracket and the expression it multiplies out to",
    unknowns: ["letter term", "number term", "both"],
    surface: ["a minus inside", "a letter outside", "a number in front of the letter"],
  },
  screens: worded([
    explain(
      "The rule",
      "Multiplying out a bracket",
      ["**Multiply everything inside the bracket by the term outside.**"],
      grid("4", ["x", "3"], ["4x", "12"]),
      "$4(x + 3)$ is 4 lots of $x + 3$: $4x + 12$.",
    ),

    typed("Check you remember", "What is $4 \\times 3$?", "12", "4 threes.", "12."),
    typed("Check you remember", "What is $3 \\times (10 + 2)$?", "36", "3 × 10, and 3 × 2.", "36."),
    typed("Check you remember", "What is $3 \\times 2y$?", "6y", "3 × 2, still y.", "$6y$."),

    methodCard("The method", expandMethod, grid("3", ["2y", "−4"], ["6y", "−12"])),
    worked(
      "Watch the method",
      "Expand $3(2y - 4)$.",
      [
        { line: "$3 \\times 2y = 6y$" },
        { line: "$3 \\times -4 = -12$", note: "The sign goes with the term." },
        { line: "$6y - 12$" },
      ],
      "$6y - 12$.",
      grid("3", ["2y", "−4"], ["6y", "−12"]),
    ),
    calc(
      "Your turn",
      "Expand $5(a - 2)$.",
      grid("5", ["a", "−2"], ["?", "?"]),
      [
        ["$5 \\times a =$", "5a", "5 lots of a."],
        ["$5 \\times -2 =$", "-10", "The minus comes too."],
      ],
      "$5a - 10$.",
    ),

    calc(
      "Practise",
      "Expand $4(2x + 3)$.",
      grid("4", ["2x", "3"], ["?", "?"]),
      [
        ["$4 \\times 2x =$", "8x", "4 × 2, still x."],
        ["$4 \\times 3 =$", "12", "Times the 3 as well."],
      ],
      "$8x + 12$.",
    ),
    ...owned(list, EXPAND, "Your turn", "Practise"),
    questionSet(
      "Practise",
      "Find each part. Watch what changes.",
      [
        ask("Expand $2(x + 5)$.", "$2x + 10$", "Times both terms by 2.", "$2x + 10$.", {
          asks: "both",
          others: ["$2x + 5$", "$x + 10$"],
        }),
        ask("In $6(x + 2)$, what is the number term?", "12", "6 × 2.", "12.", {
          asks: "number term",
          changed: "Just the number term.",
        }),
        ask("In $3(4y - 1)$, what is the y term?", "12y", "3 × 4y.", "$12y$.", {
          asks: "letter term",
          changed: "Just the letter term.",
        }),
        ask("Expand $7(m - 3)$.", "$7m - 21$", "Times both by 7, with the minus.", "$7m - 21$.", {
          asks: "both",
          changed: "A minus inside.",
          others: ["$7m - 3$", "$7m + 21$"],
        }),
      ],
      "Every term inside gets multiplied, sign and all.",
    ),

    questionSet(
      "Variation",
      "Expand each one. Watch what changes.",
      [
        ask("Expand $3(x + 4)$.", "$3x + 12$", "The 4 is multiplied too.", "$3x + 12$.", {
          asks: "both",
          others: ["$3x + 4$", "$x + 12$"],
          expect: [
            "Sam writes $3(x + 4) = 3x + 4$. Is he right?",
            "No",
            "The 4 is inside, so it's multiplied too: $3x + 12$.",
            [["Yes", "Everything inside gets multiplied."]],
          ],
        }),
        ask("Expand $3(x - 4)$.", "$3x - 12$", "The minus stays with the 4.", "$3x - 12$.", {
          asks: "both",
          changed: "A minus inside.",
          others: ["$3x + 12$", "$3x - 4$"],
        }),
        ask("Expand $3(2x + 4)$.", "$6x + 12$", "3 × 2x is 6x.", "$6x + 12$.", {
          asks: "both",
          changed: "A number in front of the x.",
          others: ["$32x + 12$", "$6x + 4$"],
        }),
        ask("Expand $x(x + 4)$.", "$x^2 + 4x$", "$x \\times x = x^2$.", "$x^2 + 4x$.", {
          asks: "both",
          changed: "A letter outside.",
          others: ["$2x + 4$", "$x^2 + 4$"],
        }),
      ],
      "Whatever is outside multiplies every term inside.",
    ),
    own(list, EXPAND, "Spot the mistake"),

    own(list, EXPAND, "Exit check"),

    reworded(list, EXPAND, "Party bags", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Multiply everything inside the bracket by the term outside.**"],
      grid("3", ["2y", "−4"], ["6y", "−12"]),
      [
        "**Multiply everything inside the bracket by the term outside.**",
        "Draw a grid: outside down the side, inside along the top.",
        "$3(2y - 4) = 6y - 12$",
        "$x(x + 4) = x^2 + 4x$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Substituting.

const SUBSTITUTE = "y7-simplifying/substitute";
const substituteMethod = [
  "Write it out, with numbers for the letters.",
  "Put a × between a number and a letter.",
  "Work it out in the right order.",
];

const substitute = stepped(find(list, SUBSTITUTE), {
  method: substituteMethod,
  variation: {
    relationship: "an expression and its value when the letters are known",
    unknowns: ["value", "letter"],
    surface: ["negatives", "powers", "two letters", "a fraction", "a phone bill"],
  },
  screens: worded([
    explain(
      "The rule",
      "Substituting",
      ["**Swap each letter for its number, then work it out.**"],
      maths("a = 4: \\quad 3a + 1 = 3 \\times 4 + 1 = 13"),
      "$3a$ means 3 times $a$.",
    ),

    typed("Check you remember", "What is $5 \\times 12$?", "60", "5 tens and 5 twos.", "60."),
    typed("Check you remember", "What is $3 + 4 \\times 2$?", "11", "× before +.", "11."),
    typed(
      "Check you remember",
      "What is $5 \\times (-2)$?",
      "-10",
      "Positive times negative is negative.",
      "−10.",
    ),

    methodCard("The method", substituteMethod, maths("4a + 5b = 4 \\times 3 + 5 \\times (-2)")),
    worked(
      "Watch the method",
      "If $a = 3$ and $b = -2$, work out $4a + 5b$.",
      [
        { line: "$4 \\times 3 + 5 \\times (-2)$", note: "Brackets round a negative." },
        { line: "$12 + (-10)$" },
        { line: "$= 2$" },
      ],
      "2.",
    ),
    calc(
      "Your turn",
      "If $p = 6$, work out $4p - 5$.",
      undefined,
      [
        ["$4 \\times 6 =$", "24", "$4p$ is 4 times 6."],
        ["$24 - 5 =$", "19", "Then take away 5."],
      ],
      "19.",
    ),

    calc(
      "Practise",
      "If $x = 4$, work out $x^2 + 3$.",
      undefined,
      [
        ["$4^2 =$", "16", "4 times 4."],
        ["$16 + 3 =$", "19", "Then add 3."],
      ],
      "19.",
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("If $y = 5$, what is $2y - 3$?", "7", "2 × 5 − 3.", "7.", { asks: "value" }),
        ask("If $m = -3$, what is $2m + 10$?", "4", "2 × (−3) + 10.", "4.", {
          asks: "value",
          changed: "A negative number.",
        }),
        ask("If $2y - 3 = 7$, what is $y$?", "5", "What doubled, take 3, is 7?", "5.", {
          asks: "letter",
          changed: "Now find the letter.",
        }),
        ask(
          "If $a = 7$ and $b = 5$, what is $\\frac{a + b}{2}$?",
          "6",
          "The top first: 12 ÷ 2.",
          "6.",
          {
            asks: "value",
            changed: "Two letters, over 2.",
          },
        ),
      ],
      "Numbers in place of letters, then the usual order.",
    ),

    questionSet(
      "Variation",
      "If $n = 3$, find each one. Watch what changes.",
      [
        ask("What is $5n$?", "15", "5 × 3.", "15.", {
          asks: "value",
          expect: [
            "Ali writes $5n = 53$. Is he right?",
            "No",
            "$5n$ means 5 times n: 15.",
            [["Yes", "$5n$ is 5 × 3, not the digits side by side."]],
          ],
        }),
        ask("What is $n^2$?", "9", "3 × 3.", "9.", { asks: "value", changed: "A power now." }),
        ask("What is $2n^2$?", "18", "Square first: 2 × 9.", "18.", {
          asks: "value",
          changed: "A number in front of the power.",
          expect: [
            "In $2n^2$, what is squared?",
            "just the n",
            "Powers come before ×: 2 × 9 = 18.",
            [["2n", "That would be $(2n)^2$, with brackets."]],
          ],
        }),
        ask("If $n = -3$, what is $n^2$?", "9", "−3 × −3.", "9.", {
          asks: "value",
          changed: "Now n is negative.",
        }),
      ],
      "Swap the letter, then follow the order: powers before ×.",
    ),
    own(list, SUBSTITUTE, "Spot the mistake"),

    own(list, SUBSTITUTE, "Exit check"),

    reworded(list, SUBSTITUTE, "A phone bill", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Swap each letter for its number, then work it out.**"],
      maths("a = 4: \\quad 3a + 1 = 13"),
      [
        "**Swap each letter for its number, then work it out.**",
        "$3a$ means $3 \\times a$. Put brackets round a negative.",
        "$a = 3$, $b = -2$: $4a + 5b = 12 - 10 = 2$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Formulae.

const FORMULAE = "y7-simplifying/formulae";
const formulaeMethod = [
  "Write the formula.",
  "Put in the values you know.",
  "Work it out in the right order, with units.",
];

const formulae = stepped(find(list, FORMULAE), {
  method: formulaeMethod,
  variation: {
    relationship: "a formula and the values in it",
    unknowns: ["result", "missing value"],
    surface: ["science", "money", "shapes", "a half in front", "temperature"],
  },
  screens: worded([
    explain(
      "The rule",
      "Formulae in science and life",
      ["**Put the values you know into the formula, then work it out.**"],
      rectangle("l", "w"),
      "$A = lw$ links a rectangle's area to its length and width.",
    ),

    typed("Check you remember", "What is $45 \\div 3$?", "15", "How many 3s in 45?", "15."),
    typed("Check you remember", "If $a = 4$, what is $2a + 1$?", "9", "2 × 4 + 1.", "9."),
    typed(
      "Check you remember",
      "Find the area of the rectangle.",
      "24",
      "Length times width.",
      "24 cm².",
      {
        unit: "cm²",
        picture: rectangle("6 cm", "4 cm"),
      },
    ),

    methodCard("The method", formulaeMethod, maths("F = ma = 5 \\times 3 = 15")),
    worked(
      "Watch the method",
      "$F = ma$. Find F when $m = 5$ and $a = 3$.",
      [{ line: "$F = 5 \\times 3$", note: "$ma$ means m times a." }, { line: "$F = 15$" }],
      "$F = 15$.",
    ),
    calc(
      "Your turn",
      "$v = u + at$. Find v: $u = 2$, $a = 4$, $t = 3$.",
      undefined,
      [
        ["$at = 4 \\times 3 =$", "12", "a times t."],
        ["$v = 2 + 12 =$", "14", "Then add u."],
      ],
      "$v = 14$.",
    ),

    calc(
      "Practise",
      "$P = 2(l + w)$. Find P: $l = 7$, $w = 3$.",
      rectangle("7 cm", "3 cm"),
      [
        ["$l + w =$", "10", "The bracket first."],
        ["$P = 2 \\times 10 =$", "20", "Then times 2."],
      ],
      "20 cm.",
    ),
    questionSet(
      "Practise",
      "Use each formula. Watch what changes.",
      [
        ask("$C = 10n + 25$. Find C when $n = 3$.", "55", "10 × 3 + 25.", "55.", {
          asks: "result",
        }),
        ask("$d = st$. Find d when $s = 12$ and $t = 5$.", "60", "12 × 5.", "60.", {
          asks: "result",
          changed: "A new formula.",
        }),
        ask("$s = \\frac{d}{t}$. Find s when $d = 60$ and $t = 4$.", "15", "60 ÷ 4.", "15.", {
          asks: "result",
          changed: "A division this time.",
        }),
        ask("$A = lw$. $A = 24$ and $l = 6$. Find w.", "4", "6 times what is 24?", "4.", {
          asks: "missing value",
          changed: "Now find a value inside.",
          picture: rectangle("6 cm", "w"),
        }),
      ],
      "Put in what you know, then work it out.",
    ),

    questionSet(
      "Variation",
      "$A = \\frac12 bh$. Watch what changes.",
      [
        ask("Find A when $b = 6$ and $h = 4$.", "12", "Half of 6 × 4.", "12.", {
          asks: "result",
          expect: [
            "Leo gets 24. Is he right?",
            "No: he forgot the half",
            "$6 \\times 4 = 24$, then half: 12.",
            [["Yes", "The formula halves it: 12."]],
          ],
        }),
        ask("Find A when $b = 6$ and $h = 8$.", "24", "Half of 6 × 8.", "24.", {
          asks: "result",
          changed: "The height doubles.",
          expect: [
            "The height doubles. The area…",
            "doubles too",
            "Double one value you multiply, and the answer doubles.",
            [["stays the same", "Work it out: 12, then 24."]],
          ],
        }),
        ask("Find A when $b = 10$ and $h = 0$.", "0", "Anything times 0 is 0.", "0.", {
          asks: "result",
          changed: "A height of 0.",
        }),
        ask("$A = 20$ and $b = 10$. Find h.", "4", "Half of 10 is 5. 5 times what is 20?", "4.", {
          asks: "missing value",
          changed: "Now find h.",
        }),
      ],
      "Every part of the formula counts, the half too.",
    ),
    own(list, FORMULAE, "Spot the mistake"),

    own(list, FORMULAE, "Exit check"),

    reworded(list, FORMULAE, "How fast?", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Put the values you know into the formula, then work it out.**"],
      rectangle("l", "w"),
      [
        "**Put the values you know into the formula, then work it out.**",
        "$A = lw$, $P = 2(l + w)$, $s = \\frac{d}{t}$",
        "$F = ma$: $m = 5$, $a = 3$, so $F = 15$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7SimplifyingStepped: [string, UnitLesson[]][] = [
  [LIKE, [likeTerms]],
  [EXPAND, [expand]],
  [SUBSTITUTE, [substitute]],
  [FORMULAE, [formulae]],
];
