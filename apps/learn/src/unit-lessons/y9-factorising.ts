// Year 9, "Factorising and proof": factorising x² + bx + c as expanding backwards, a pair of
// numbers that multiply to c and add to b, with positives and then negatives; and algebra used
// to prove a pattern is always true.
import type { UnitLesson } from "./types.ts";

export const y9Factorising: UnitLesson = {
  unit: "y9-factorising",
  title: "Back into brackets",
  summary: "Find the hidden pair of numbers, then prove patterns with algebra.",
  screens: [
    {
      kind: "explain",
      title: "Expanding, backwards",
      text: [
        "$(x + 2)(x + 3) = x^2 + 5x + 6$. Factorising goes the other way.",
        "To factorise $x^2 + 5x + 6$, find two numbers that **multiply to 6** and **add to 5**: 2 and 3.",
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
      title: "Factorise $x^2 + 7x + 12$",
      text: "Two numbers that multiply to 12 and add to 7.",
      template: "$x^2 + 7x + 12 = (x +$ [] $)(x +$ [] $)$",
      bank: ["$1$", "$2$", "$3$", "$4$", "$6$", "$12$"],
      answers: ["$3$", "$4$"],
      anyOrder: true,
      hint: "Pairs that multiply to 12: 1 and 12, 2 and 6, 3 and 4. Which adds to 7?",
      done: "$(x + 3)(x + 4)$. Check: $3 \\times 4 = 12$ and $3 + 4 = 7$ ✓",
    },
    {
      kind: "steps",
      title: "With negatives: $x^2 - x - 12$",
      start: "$x^2 - x - 12$",
      stages: [
        {
          prompt: "Two numbers that multiply to −12 and add to −1:",
          options: [
            { text: "$-4$ and $3$", correct: true, feedback: "" },
            { text: "$4$ and $-3$", feedback: "They multiply to −12, but add to +1." },
            { text: "$-6$ and $2$", feedback: "They multiply to −12, but add to −4." },
          ],
          then: "$-4 \\times 3 = -12$ and $-4 + 3 = -1$",
        },
        {
          prompt: "So",
          options: [
            { text: "$(x - 4)(x + 3)$", correct: true, feedback: "" },
            { text: "$(x + 4)(x - 3)$", feedback: "Keep the signs with the numbers: −4 and +3." },
            { text: "$(x - 4)(x - 3)$", feedback: "That would give +12 at the end." },
          ],
          then: "$= (x - 4)(x + 3)$",
        },
      ],
      done: "Check by expanding: $x^2 + 3x - 4x - 12 = x^2 - x - 12$ ✓",
    },
    {
      kind: "fill",
      title: "Factorise $x^2 - 8x + 15$",
      template: "$x^2 - 8x + 15 = (x$ [] $)(x$ [] $)$",
      bank: ["$-3$", "$-5$", "$+3$", "$+5$", "$-15$"],
      answers: ["$-3$", "$-5$"],
      anyOrder: true,
      hint: "They multiply to +15 but add to −8: both must be negative.",
      done: "$(x - 3)(x - 5)$: two negatives multiply to +15 and add to −8.",
    },
    {
      kind: "choice",
      title: "Which factorises $x^2 + 2x - 15$?",
      options: [
        {
          text: "$(x + 5)(x - 3)$",
          correct: true,
          feedback: "$5 \\times -3 = -15$ and $5 + -3 = 2$ ✓",
        },
        { text: "$(x - 5)(x + 3)$", feedback: "Those add to −2, not +2." },
        { text: "$(x + 15)(x - 1)$", feedback: "Those multiply to −15 but add to 14." },
      ],
    },
    {
      kind: "explain",
      title: "Algebra proves things",
      text: [
        "Trying examples shows a pattern works for those numbers. Algebra shows it works for **every** number: that is a proof.",
      ],
      picture: { kind: "maths", tex: "1 + 2 + 3 = 6, \\quad 7 + 8 + 9 = 24, \\quad \\ldots" },
    },
    {
      kind: "steps",
      title: "Prove it",
      text: "The sum of three whole numbers in a row is always a multiple of 3.",
      start: "Call the first number $n$.",
      stages: [
        {
          prompt: "The next two numbers are",
          options: [
            { text: "$n + 1$ and $n + 2$", correct: true, feedback: "" },
            {
              text: "$2n$ and $3n$",
              feedback: "Those are multiples of n. The next numbers are one more each time.",
            },
            {
              text: "$n$ and $n$",
              feedback: "They are different numbers: one more, then two more.",
            },
          ],
          then: "$n + (n + 1) + (n + 2)$",
        },
        {
          prompt: "Simplify:",
          options: [
            { text: "$3n + 3$", correct: true, feedback: "" },
            { text: "$3n + 2$", feedback: "$1 + 2 = 3$." },
            { text: "$n^3 + 3$", feedback: "$n + n + n$ is $3n$, not $n^3$." },
          ],
          then: "$= 3n + 3$",
        },
        {
          prompt: "Why is that always a multiple of 3?",
          options: [
            { text: "It equals $3(n + 1)$", correct: true, feedback: "" },
            { text: "Because 3 is odd", feedback: "Factorise $3n + 3$: what is 3 times?" },
            { text: "It isn't always", feedback: "Factorise it: it is 3 times a whole number." },
          ],
          then: "$= 3(n + 1)$: 3 times a whole number ✓",
        },
      ],
      done: "Factorising showed the 3 hiding inside. That works for every n.",
    },
    {
      kind: "choice",
      title: "Why is $(n + 1)^2 - n^2$ always odd?",
      options: [
        {
          text: "It simplifies to $2n + 1$",
          correct: true,
          feedback: "$n^2 + 2n + 1 - n^2 = 2n + 1$: one more than an even number, so always odd.",
        },
        { text: "Because square numbers are odd", feedback: "4 and 16 are even squares." },
        { text: "It equals 1", feedback: "Try n = 3: $16 - 9 = 7$." },
      ],
    },
    {
      kind: "choice",
      title: "Even × odd",
      text: "An even number can be written $2a$ and an odd one $2b + 1$. Their product is $2a(2b + 1)$.",
      options: [
        {
          text: "It is even: it is $2 \\times a(2b + 1)$",
          correct: true,
          feedback: "It has a factor of 2, so it is always even.",
        },
        { text: "It is odd", feedback: "Try 2 × 3 = 6. Look for a factor of 2." },
        { text: "It could be either", feedback: "$2a(2b + 1)$ always has a factor of 2." },
      ],
    },
    {
      kind: "explain",
      title: "Back into brackets",
      text: [
        "Factorise $x^2 + bx + c$: find two numbers that multiply to c and add to b, signs and all.",
        "To prove a pattern, write it in algebra and simplify until the reason shows.",
      ],
      picture: { kind: "maths", tex: "x^2 - x - 12 = (x - 4)(x + 3)" },
    },
  ],
};
