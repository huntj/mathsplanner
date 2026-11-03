// Year 7, "Factors, multiples and primes": factors as the sides of rectangles, primes as numbers
// that only make a line, factor trees that always end in the same primes, and the HCF and LCM
// found from them, or by hopping along a number line.
import type { UnitLesson } from "./types.ts";

export const y7Factors: UnitLesson = {
  unit: "y7-factors",
  title: "Building blocks of numbers",
  summary: "Break numbers into primes, then build them back up.",
  screens: [
    {
      kind: "explain",
      title: "Factors make rectangles",
      text: [
        "12 squares can make a 3 by 4 rectangle, so 3 and 4 are **factors** of 12.",
        "Factors come in pairs that multiply to the number: 1 × 12, 2 × 6 and 3 × 4.",
      ],
      picture: { kind: "grid", cols: 4, rows: 3, shaded: 12 },
    },
    {
      kind: "fill",
      title: "The factor pairs of 24",
      template: "$1 \\times 24$, $2 \\times$ [], $3 \\times$ [], [] $\\times 6$",
      bank: ["$12$", "$8$", "$4$", "$6$", "$10$"],
      answers: ["$12$", "$8$", "$4$"],
      hint: "Which number times 2 makes 24? Times 3? And what times 6?",
      done: "So the factors of 24 are 1, 2, 3, 4, 6, 8, 12 and 24.",
    },
    {
      kind: "sort",
      title: "Prime or not?",
      text: "A prime has exactly two factors: 1 and itself.",
      groups: ["Prime", "Not prime"],
      items: [
        { text: "2", group: 0, why: "2's only factors are 1 and 2: it is the only even prime." },
        { text: "9", group: 1, why: "$9 = 3 \\times 3$, so 3 is a factor too." },
        { text: "13", group: 0, why: "Nothing but 1 and 13 divides 13." },
        { text: "21", group: 1, why: "$21 = 3 \\times 7$." },
        { text: "1", group: 1, why: "1 has only one factor, itself, so it is not prime." },
        { text: "29", group: 0, why: "Nothing but 1 and 29 divides 29." },
        { text: "51", group: 1, why: "$51 = 3 \\times 17$. Sneaky!" },
      ],
      done: "A prime's squares only make a single line, never a rectangle.",
    },
    {
      kind: "choice",
      title: "Which is a multiple of 6?",
      options: [
        {
          text: "$42$",
          correct: true,
          feedback: "$6 \\times 7 = 42$: it is in the 6 times table.",
        },
        {
          text: "$3$",
          feedback: "3 is a factor of 6. Multiples are in the times table: 6, 12, 18…",
        },
        { text: "$16$", feedback: "16 is not in the 6 times table: 12, 18, 24…" },
      ],
    },
    {
      kind: "tree",
      title: "Grow a factor tree for 60",
      text: "Split 60 into two factors, then keep splitting until every branch ends in a prime.",
      root: 60,
      done: "$60 = 2 \\times 2 \\times 3 \\times 5$. That is its **product of prime factors**.",
    },
    {
      kind: "tree",
      title: "Try a different way: 84",
      text: "Start with whichever pair you like. Does it matter?",
      root: 84,
      done: "However you split it, 84 ends up as $2 \\times 2 \\times 3 \\times 7$. Every number has just one set of primes.",
    },
    {
      kind: "fill",
      title: "36 in index form",
      text: "$36 = 2 \\times 2 \\times 3 \\times 3$. Write it with powers.",
      template: "$36 =$ [] $\\times$ []",
      bank: ["$2^2$", "$2^3$", "$3^2$", "$6^2$", "$4 \\times 9$"],
      answers: ["$2^2$", "$3^2$"],
      hint: "Count each prime: two 2s and two 3s.",
      done: "$36 = 2^2 \\times 3^2$. (And $6^2$ is 36 too, but 6 is not prime.)",
    },
    {
      kind: "explain",
      title: "The highest common factor",
      text: [
        "The **HCF** is the biggest number that divides both. Find the primes the two numbers share.",
        "24 and 36 share 2, 2 and 3, so their HCF is $2 \\times 2 \\times 3 = 12$.",
      ],
      picture: {
        kind: "table",
        rows: [
          ["$24$", "$2 \\times 2 \\times 2 \\times 3$"],
          ["$36$", "$2 \\times 2 \\times 3 \\times 3$"],
          ["Shared", "$2 \\times 2 \\times 3 = 12$"],
        ],
      },
    },
    {
      kind: "answer",
      title: "What is the HCF of 18 and 30?",
      text: "$18 = 2 \\times 3 \\times 3$ and $30 = 2 \\times 3 \\times 5$.",
      answers: ["6"],
      wrong: [
        { answer: "90", feedback: "90 is a multiple of both. The HCF divides both." },
        { answer: "3", feedback: "3 divides both, but so does a bigger number." },
        { answer: "2", feedback: "2 divides both, but so does a bigger number." },
      ],
      hint: "Which primes are in both lists?",
      done: "They share 2 and 3: HCF $= 2 \\times 3 = 6$.",
    },
    {
      kind: "explain",
      title: "The lowest common multiple",
      text: [
        "Hop in 4s and in 6s from 0. The first place both land, apart from 0, is 12.",
        "12 is the **lowest common multiple** (LCM) of 4 and 6.",
      ],
      picture: {
        kind: "number-line",
        min: 0,
        max: 24,
        step: 2,
        every: 2,
        jumps: [
          { from: 0, to: 4, label: "+4" },
          { from: 4, to: 8, label: "+4" },
          { from: 8, to: 12, label: "+4" },
          { from: 12, to: 18, label: "+6" },
          { from: 18, to: 24, label: "+6" },
        ],
        marks: [
          { at: 12, label: "both", tone: "hint" },
          { at: 24, label: "both", tone: "hint" },
        ],
      },
    },
    {
      kind: "answer",
      title: "What is the LCM of 6 and 8?",
      answers: ["24"],
      wrong: [
        { answer: "48", feedback: "48 is a common multiple, but there is a lower one." },
        { answer: "2", feedback: "That is the HCF. The LCM is in both times tables." },
        { answer: "14", feedback: "That is $6 + 8$. Look for a number in both times tables." },
      ],
      hint: "List the multiples of 8: 8, 16, 24… which is also in the 6 times table?",
      done: "6, 12, 18, 24 and 8, 16, 24: the LCM is 24.",
    },
    {
      kind: "choice",
      title: "Buses and trams",
      text: "Buses leave every 12 minutes and trams every 18 minutes. Both leave at 9:00. When do they next leave together?",
      options: [
        { text: "9:36", correct: true, feedback: "The LCM of 12 and 18 is 36: 36 minutes later." },
        { text: "9:06", feedback: "6 is the HCF. You need a time in both lists: the LCM." },
        { text: "9:30", feedback: "30 minutes is not a multiple of 12 or of 18." },
      ],
    },
    {
      kind: "explain",
      title: "Building blocks",
      text: [
        "Factors divide a number; multiples are in its times table.",
        "Every number breaks into one set of primes.",
        "HCF: the primes both share. LCM: the first number both times tables reach.",
      ],
      picture: { kind: "maths", tex: "60 = 2^2 \\times 3 \\times 5" },
    },
  ],
};
