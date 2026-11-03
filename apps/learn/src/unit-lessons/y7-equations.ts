// Year 7, "Sequences and equations": growing patterns and their term-to-term rules, a machine
// that turns a position into a term, and equations solved on a balance by doing the same to both
// sides.
import type { UnitLesson } from "./types.ts";

export const y7Equations: UnitLesson = {
  unit: "y7-equations",
  title: "Patterns and puzzles",
  summary: "Continue patterns, find their rules, then balance equations.",
  screens: [
    {
      kind: "choice",
      title: "How many squares in term 5?",
      picture: { kind: "stacks", counts: [3, 5, 7, 9] },
      options: [
        {
          text: "11",
          correct: true,
          feedback: "Each term adds 2 squares: $9 + 2 = 11$. 'Add 2' is the **term-to-term rule**.",
        },
        { text: "10", feedback: "Look at how many each term adds on." },
        { text: "13", feedback: "That is two terms on. Term 5 comes straight after 9." },
      ],
    },
    {
      kind: "fill",
      title: "Keep it going",
      template: "5, 8, 11, [], [] ... the rule is: add []",
      bank: ["$13$", "$14$", "$16$", "$17$", "$3$", "$4$"],
      answers: ["$14$", "$17$", "$3$"],
      hint: "How much does each term go up by?",
      done: "5, 8, 11, 14, 17: add 3 each time.",
    },
    {
      kind: "answer",
      title: "Doubling",
      text: "A sequence starts at 3. Its term-to-term rule is × 2. What is the 5th term?",
      answers: ["48"],
      wrong: [
        { answer: "11", feedback: "That adds 2. The rule is times 2." },
        { answer: "24", feedback: "24 is the 4th term: 3, 6, 12, 24…" },
        { answer: "96", feedback: "That is the 6th term. Count: 3 is the 1st." },
      ],
      hint: "Write them out: 3, 6, …",
      done: "3, 6, 12, 24, 48.",
    },
    {
      kind: "machine",
      title: "A machine for any term",
      rule: { m: 4, c: -1 },
      inputs: [1, 2, 3, 4, 5],
      shown: 2,
      decoys: { 3: [12, 9], 4: [16, 13], 5: [20, 23] },
      ports: ["n", "term"],
      done: "The rule is $4n - 1$: multiply the position by 4, take 1. That is a **position-to-term rule**, or nth term.",
    },
    {
      kind: "answer",
      title: "Jump straight to the 10th term",
      text: "The nth term of a sequence is $3n + 2$.",
      answers: ["32"],
      wrong: [{ answer: "15", feedback: "$3n$ means $3 \\times n$: $3 \\times 10$." }],
      hint: "Put $n = 10$ into $3n + 2$.",
      done: "$3 \\times 10 + 2 = 32$, with no need to list the first nine.",
    },
    {
      kind: "choice",
      title: "Is 50 in the sequence $4n - 1$?",
      options: [
        {
          text: "No",
          correct: true,
          feedback:
            "The terms are 3, 7, 11, …, always one less than a multiple of 4. 50 is not: 51 is not a multiple of 4.",
        },
        {
          text: "Yes, it is the 12th term",
          feedback: "The 12th term is $4 \\times 12 - 1 = 47$, and the 13th is 51.",
        },
        { text: "Yes, it is the 13th term", feedback: "The 13th term is $4 \\times 13 - 1 = 51$." },
      ],
    },
    {
      kind: "explain",
      title: "An equation is a balance",
      text: [
        "An equation says two sides weigh the same. To find the letter, do the same to both sides, so the scale stays level.",
        "Each bag holds an unknown number of cubes, x.",
      ],
    },
    {
      kind: "balance",
      title: "Solve $x + 4 = 9$",
      a: 1,
      b: 4,
      c: 9,
      letter: "x",
      done: "$x = 5$. Check: $5 + 4 = 9$ ✓",
    },
    {
      kind: "balance",
      title: "Solve $3x = 12$",
      text: "Three bags weigh the same as 12 cubes.",
      a: 3,
      b: 0,
      c: 12,
      letter: "x",
      done: "$x = 4$: one bag balances 4 cubes. Check: $3 \\times 4 = 12$ ✓",
    },
    {
      kind: "balance",
      title: "Solve $2x + 5 = 17$",
      text: "Two steps now.",
      a: 2,
      b: 5,
      c: 17,
      letter: "x",
      done: "$x = 6$. Check: $2 \\times 6 + 5 = 17$ ✓. Undo the + first, then the ×.",
    },
    {
      kind: "balance",
      title: "Solve $4x + 3 = 23$",
      a: 4,
      b: 3,
      c: 23,
      letter: "x",
      done: "$x = 5$. Check: $4 \\times 5 + 3 = 23$ ✓",
    },
    {
      kind: "answer",
      title: "Solve $\\frac{x}{3} = 7$",
      answers: ["21"],
      wrong: [{ answer: "2.33", feedback: "Undo ÷ 3 by multiplying both sides by 3." }],
      hint: "x divided by 3 is 7. What do you do to undo dividing?",
      done: "$x = 7 \\times 3 = 21$.",
    },
    {
      kind: "answer",
      title: "Solve $5x - 4 = 26$",
      answers: ["6"],
      wrong: [{ answer: "4.4", feedback: "Undo − 4 by adding 4 to both sides: $5x = 30$." }],
      hint: "Undo the − 4 first, then the × 5.",
      done: "$5x = 30$, so $x = 6$. Check: $5 \\times 6 - 4 = 26$ ✓",
    },
    {
      kind: "explain",
      title: "Patterns and puzzles",
      text: [
        "A term-to-term rule gets the next term; a position-to-term rule, like $4n - 1$, gets any term.",
        "Solve an equation by doing the same to both sides: undo the + or − first, then the × or ÷.",
      ],
      picture: { kind: "maths", tex: "2x + 5 = 17 \\Rightarrow 2x = 12 \\Rightarrow x = 6" },
    },
  ],
};
