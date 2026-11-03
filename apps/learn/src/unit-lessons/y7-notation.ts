// Year 7, "Algebra notation": algebra's shorthand. Letters stand for numbers, × signs are left
// out, powers count repeated multiplying, a fraction bar divides and brackets group; and the
// words expression, equation, inequality, term and factor.
import type { UnitLesson } from "./types.ts";

export const y7Notation: UnitLesson = {
  unit: "y7-notation",
  title: "Algebra shorthand",
  summary: "Crack the code mathematicians use to write less.",
  screens: [
    {
      kind: "explain",
      title: "Letters stand for numbers",
      text: [
        "Mathematicians write as little as they can. They leave out the × sign: $3 \\times y$ is written $3y$, and $a \\times b$ is written $ab$.",
        "The number goes first, then the letters, usually in alphabetical order.",
      ],
      picture: { kind: "maths", tex: "3 \\times y = 3y" },
    },
    {
      kind: "fill",
      title: "Write it the short way",
      template: "$4 \\times n =$ [] and $b \\times a \\times 5 =$ []",
      bank: ["$4n$", "$n4$", "$4 + n$", "$5ab$", "$ab5$", "$5 + ab$"],
      answers: ["$4n$", "$5ab$"],
      hint: "Leave out the × signs. Put the number first, then the letters in alphabetical order.",
      done: "$4n$ and $5ab$: no × signs, number first.",
    },
    {
      kind: "choice",
      title: "If $y = 6$, what is $3y$?",
      options: [
        { text: "$18$", correct: true, feedback: "$3y$ means $3 \\times y = 3 \\times 6 = 18$." },
        {
          text: "$36$",
          feedback: "That puts 3 and 6 side by side. $3y$ means 3 × y, three lots of 6.",
        },
        { text: "$9$", feedback: "That is $3 + y$. $3y$ means $3 \\times y$." },
      ],
    },
    {
      kind: "steps",
      title: "A letter times itself",
      start: "$a \\times a$",
      stages: [
        {
          prompt: "How else can you write $a \\times a$?",
          options: [
            { text: "$a^2$", correct: true, feedback: "" },
            {
              text: "$2a$",
              feedback: "$2a$ is $a + a$, two lots of a. $a \\times a$ is a times itself.",
            },
            { text: "$aa2$", feedback: "The little 2 goes up high, as a power: $a^2$." },
          ],
          then: "$a \\times a = a^2$",
        },
        {
          prompt: "And $a \\times a \\times b$?",
          options: [
            { text: "$a^2b$", correct: true, feedback: "" },
            {
              text: "$2ab$",
              feedback: "$2ab$ is $2 \\times a \\times b$. Here a is multiplied by itself.",
            },
            { text: "$a^3b$", feedback: "Count the a's: there are two of them." },
          ],
          then: "$a \\times a \\times b = a^2b$",
        },
      ],
      done: "The small number, the **power**, counts how many times the letter is multiplied by itself.",
    },
    {
      kind: "answer",
      title: "If $a = 3$, what is $a^2$?",
      answers: ["9"],
      wrong: [{ answer: "6", feedback: "6 is $2 \\times 3$. $a^2$ means $3 \\times 3$." }],
      hint: "$a^2$ means $a \\times a$.",
      done: "$a^2 = 3 \\times 3 = 9$, not $2 \\times 3$.",
    },
    {
      kind: "answer",
      title: "If $a = 3$ and $b = 5$, what is $a^2b$?",
      answers: ["45"],
      wrong: [
        {
          answer: "225",
          feedback: "That squares $ab$. Only the a is squared: $3^2 \\times 5$.",
        },
        {
          answer: "30",
          feedback: "That is $2 \\times 3 \\times 5$. The 2 is a power: square the a.",
        },
      ],
      hint: "Square a first, then multiply by b.",
      done: "$a^2b = 3^2 \\times 5 = 9 \\times 5 = 45$.",
    },
    {
      kind: "explain",
      title: "Fractions and brackets",
      text: [
        "A fraction bar means divide: $\\frac{x}{4}$ means $x \\div 4$.",
        "Brackets keep things together: $3(x + 2)$ means 3 lots of the whole of $x + 2$.",
      ],
      picture: { kind: "maths", tex: "\\frac{x}{4} = x \\div 4" },
    },
    {
      kind: "choice",
      title: "Which means 'add 5 to n, then double it'?",
      options: [
        {
          text: "$2(n + 5)$",
          correct: true,
          feedback: "The bracket is worked out first: add 5, then the 2 outside doubles it.",
        },
        { text: "$2n + 5$", feedback: "That doubles n first, then adds 5." },
        { text: "$n + 5 \\times 2$", feedback: "That adds 10 to n: the × comes before the +." },
      ],
    },
    {
      kind: "answer",
      title: "If $n = 3$, what is $2(n + 5)$?",
      answers: ["16"],
      wrong: [{ answer: "11", feedback: "That is $2n + 5$. Do the bracket first: $3 + 5 = 8$." }],
      hint: "Work out the bracket first, then multiply by 2.",
      done: "$2(3 + 5) = 2 \\times 8 = 16$.",
    },
    {
      kind: "answer",
      title: "If $x = 20$, what is $\\frac{x}{4}$?",
      answers: ["5"],
      wrong: [{ answer: "80", feedback: "That is $4x$. A fraction bar means divide." }],
      hint: "$\\frac{x}{4}$ means $x \\div 4$.",
      done: "$\\frac{20}{4} = 20 \\div 4 = 5$.",
    },
    {
      kind: "sort",
      title: "Expression, equation or inequality?",
      groups: ["Expression", "Equation", "Inequality"],
      items: [
        {
          text: "$3x + 2$",
          group: 0,
          why: "There is no sign comparing two sides: it is just terms put together, an expression.",
        },
        {
          text: "$3x + 2 = 11$",
          group: 1,
          why: "It has an = sign, so it is an equation: true for just one value of x.",
        },
        {
          text: "$x + 4 > 9$",
          group: 2,
          why: "The $>$ sign makes it an inequality: true for many values of x.",
        },
        { text: "$5y - y$", group: 0, why: "No =, < or > sign: it is an expression." },
        { text: "$2a = 10$", group: 1, why: "It has an = sign: an equation." },
        { text: "$n \\le 7$", group: 2, why: "$\\le$ compares two sides, so it is an inequality." },
      ],
      done: "An expression has no sign. An equation has =. An inequality has <, >, ≤ or ≥.",
    },
    {
      kind: "choice",
      title: "How many terms in $4x + 3y - 7$?",
      options: [
        {
          text: "3",
          correct: true,
          feedback: "$4x$, $3y$ and $-7$. Terms are the parts joined by + and − signs.",
        },
        { text: "2", feedback: "The number on its own, −7, is a term too." },
        {
          text: "6",
          feedback: "$4x$ counts as one term: the 4 and the x are multiplied together.",
        },
      ],
    },
    {
      kind: "choice",
      title: "Which is a factor of the term $6ab$?",
      options: [
        {
          text: "$3a$",
          correct: true,
          feedback: "$6ab = 3a \\times 2b$, so $3a$ divides $6ab$ exactly: it is a factor.",
        },
        { text: "$6 + a$", feedback: "Factors multiply to make a term. $6 + a$ is a sum." },
        { text: "$c$", feedback: "There is no c in $6ab$." },
      ],
    },
    {
      kind: "explain",
      title: "You cracked the code",
      text: [
        "$3y$ is $3 \\times y$; $a^2$ is $a \\times a$; $\\frac{x}{4}$ is $x \\div 4$; brackets go first.",
        "An expression is terms joined by + and −. Add = and it is an equation; add <, >, ≤ or ≥ and it is an inequality.",
      ],
      picture: { kind: "maths", tex: "3a^2b = 3 \\times a \\times a \\times b" },
    },
  ],
};
