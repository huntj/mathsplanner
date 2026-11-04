// Year 8, "Expressions and sequences": expanding two brackets as the four pieces of a rectangle,
// then with negatives; writing situations as expressions and formulae; and finding the nth term
// of an arithmetic sequence from its difference.
import type { UnitLesson } from "./types.ts";

export const y8Expressions: UnitLesson = {
  unit: "y8-expressions",
  title: "Brackets and patterns",
  summary: "Multiply brackets as rectangles, then find any term of a sequence.",
  screens: [
    {
      kind: "explain",
      title: "Two brackets make a rectangle",
      text: [
        "$(x + 3)(x + 2)$ is the area of a rectangle $x + 3$ long and $x + 2$ wide.",
        "Split it into four pieces and add them up: $x^2 + 3x + 2x + 6 = x^2 + 5x + 6$.",
      ],
      picture: {
        kind: "table",
        head: ["×", "$x$", "$+3$"],
        rows: [
          ["$x$", "$x^2$", "$3x$"],
          ["$+2$", "$2x$", "$6$"],
        ],
      },
    },
    {
      kind: "fill",
      title: "Expand $(x + 4)(x + 5)$",
      picture: {
        kind: "table",
        head: ["×", "$x$", "$+4$"],
        rows: [
          ["$x$", "$x^2$", "$4x$"],
          ["$+5$", "$5x$", "$20$"],
        ],
      },
      template: "$(x + 4)(x + 5) = x^2 +$ [] $+$ []",
      bank: ["$9x$", "$20x$", "$x$", "$9$", "$20$"],
      answers: ["$9x$", "$20$"],
      hint: "Add the two x pieces, $4x + 5x$. The number piece is $4 \\times 5$.",
      done: "$x^2 + 9x + 20$.",
    },
    {
      kind: "choice",
      title: "Spot the pattern",
      text: "$(x + 3)(x + 2) = x^2 + 5x + 6$ and $(x + 4)(x + 5) = x^2 + 9x + 20$. In $(x + a)(x + b)$, the number in front of $x$ is",
      options: [
        {
          text: "$a + b$",
          correct: true,
          feedback: "3 + 2 = 5 and 4 + 5 = 9. And the number at the end is $a \\times b$.",
        },
        { text: "$a \\times b$", feedback: "That gives the number at the end: 6 and 20." },
        { text: "$a - b$", feedback: "Try it: 3 − 2 = 1, but the x term is 5x." },
      ],
    },
    {
      kind: "steps",
      title: "With a negative",
      picture: {
        kind: "table",
        head: ["×", "$x$", "$-4$"],
        rows: [
          ["$x$", "?", "?"],
          ["$+3$", "?", "?"],
        ],
      },
      start: "$(x - 4)(x + 3)$",
      stages: [
        {
          prompt: "Multiply out the four pieces:",
          options: [
            { text: "$x^2 + 3x - 4x - 12$", correct: true, feedback: "" },
            {
              text: "$x^2 + 3x + 4x + 12$",
              feedback: "Keep the minus with the 4: $-4 \\times x = -4x$ and $-4 \\times 3 = -12$.",
            },
            {
              text: "$x^2 - 12$",
              feedback: "There are four pieces: don't forget the two x pieces.",
            },
          ],
          then: "$= x^2 + 3x - 4x - 12$",
          picture: {
            kind: "table",
            head: ["×", "$x$", "$-4$"],
            rows: [
              ["$x$", "$x^2$", "$-4x$"],
              ["$+3$", "$3x$", "$-12$"],
            ],
          },
        },
        {
          prompt: "Collect the x terms:",
          options: [
            { text: "$x^2 - x - 12$", correct: true, feedback: "" },
            { text: "$x^2 + 7x - 12$", feedback: "$3x - 4x$ is $-x$." },
            { text: "$x^2 - 7x - 12$", feedback: "$3x - 4x$: take 4 from 3." },
          ],
          then: "$= x^2 - x - 12$",
        },
      ],
      done: "The signs go with their numbers: $a + b = -4 + 3 = -1$ and $a \\times b = -4 \\times 3 = -12$.",
    },
    {
      kind: "fill",
      title: "Expand $(x - 5)(x - 2)$",
      template: "$(x - 5)(x - 2) = x^2$ [] $+$ []",
      bank: ["$-7x$", "$+7x$", "$-3x$", "$10$", "$-10$"],
      answers: ["$-7x$", "$10$"],
      hint: "$-5 + -2$ for the x term, and $-5 \\times -2$ for the number.",
      done: "$x^2 - 7x + 10$: two negatives multiply to a positive.",
    },
    {
      kind: "choice",
      title: "Expand $(2x + 1)(x + 3)$",
      options: [
        {
          text: "$2x^2 + 7x + 3$",
          correct: true,
          feedback:
            "$2x \\times x = 2x^2$, $2x \\times 3 = 6x$, $1 \\times x = x$ and $1 \\times 3 = 3$.",
        },
        {
          text: "$2x^2 + 4x + 3$",
          feedback:
            "$2x \\times 3$ is $6x$. The pattern a + b only works when both start with plain x.",
        },
        { text: "$3x^2 + 7x + 3$", feedback: "$2x \\times x = 2x^2$." },
      ],
    },
    {
      kind: "explain",
      title: "Write it in algebra",
      text: [
        "A taxi charges £3, plus £2 a mile. For $m$ miles the cost is $C = 2m + 3$.",
        "Its graph is a straight line: up £2 for every mile, starting at £3.",
      ],
      picture: {
        kind: "graph",
        range: { xMin: 0, xMax: 6, yMin: 0, yMax: 15 },
        lines: [{ m: 2, c: 3 }],
        points: [
          { x: 0, y: 3 },
          { x: 3, y: 9 },
          { x: 6, y: 15 },
        ],
      },
    },
    {
      kind: "choice",
      title: "Tickets and popcorn",
      text: "Cinema tickets cost £8 each, and one popcorn costs £5. Which gives the cost of $n$ tickets and one popcorn?",
      options: [
        {
          text: "$8n + 5$",
          correct: true,
          feedback: "n tickets at £8 is $8n$, plus the popcorn once.",
        },
        {
          text: "$13n$",
          feedback: "That buys a popcorn with every ticket. There is only one popcorn.",
        },
        { text: "$5n + 8$", feedback: "That buys n popcorns and one ticket." },
      ],
    },
    {
      kind: "answer",
      title: "The perimeter",
      text: "A rectangle is $x$ cm wide, and 5 cm longer than it is wide. Write its perimeter, simplified.",
      answers: ["4x+10", "10+4x"],
      wrong: [
        {
          answer: "2x+5",
          feedback: "That is one width and one length. The perimeter goes all the way round.",
        },
        { answer: "x^2+5x", feedback: "That is the area. The perimeter adds the sides." },
      ],
      hint: "The sides are $x$, $x + 5$, $x$ and $x + 5$.",
      done: "$x + (x + 5) + x + (x + 5) = 4x + 10$.",
    },
    {
      kind: "machine",
      title: "Find the rule for any term",
      rule: { m: 3, c: 4 },
      inputs: [1, 2, 3, 4, 5],
      shown: 2,
      decoys: { 3: [14, 12], 4: [17, 12], 5: [20, 15] },
      ports: ["n", "term"],
      done: "Up 3 each time, so it starts with $3n$. $3n$ gives 3, 6, 9…, each 4 less than the terms, so the nth term is $3n + 4$.",
    },
    {
      kind: "steps",
      title: "Find the nth term",
      start: "$5, 9, 13, 17, \\ldots$",
      stages: [
        {
          prompt: "What is the common difference?",
          options: [
            { text: "$4$", correct: true, feedback: "" },
            { text: "$5$", feedback: "5 is the first term. How much does each term go up?" },
            { text: "$9$", feedback: "Take one term from the next: $9 - 5$." },
          ],
          then: "Up 4 each time, so it starts $4n$.",
        },
        {
          prompt: "$4n$ gives 4, 8, 12, 16. How far off are the terms?",
          options: [
            { text: "1 more", correct: true, feedback: "" },
            { text: "1 less", feedback: "5 is 1 more than 4." },
            { text: "4 more", feedback: "Compare 5 with 4, and 9 with 8." },
          ],
          then: "nth term $= 4n + 1$",
        },
      ],
      done: "Check: the 10th term is $4 \\times 10 + 1 = 41$.",
    },
    {
      kind: "answer",
      title: "Going down",
      text: "Find the nth term of 20, 17, 14, 11, …",
      answers: ["23-3n", "-3n+23"],
      wrong: [
        { answer: "3n+17", feedback: "It goes down by 3, so it starts $-3n$." },
        {
          answer: "-3n+20",
          feedback: "$-3n$ gives −3 for the 1st term. What do you add to make 20?",
        },
      ],
      hint: "Down 3 each time: $-3n$ gives −3, −6, −9… How far off are the terms?",
      done: "$-3n$ gives −3, −6, −9; the terms are 23 more: $23 - 3n$.",
    },
    {
      kind: "explain",
      title: "Brackets and patterns",
      text: [
        "Expand two brackets with a grid: four pieces, then collect like terms.",
        "Write a situation in algebra, and it becomes an expression, a formula, or a graph.",
        "The nth term of an arithmetic sequence: the difference times n, adjusted to fit the first term.",
      ],
      picture: { kind: "maths", tex: "(x + a)(x + b) = x^2 + (a + b)x + ab" },
    },
  ],
};
