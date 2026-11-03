// Year 7, "Simplifying and substituting": like terms gather together, a number outside a bracket
// multiplies everything inside it, and letters can be swapped for numbers, in expressions and in
// real formulae.
import type { UnitLesson } from "./types.ts";

export const y7Simplifying: UnitLesson = {
  unit: "y7-simplifying",
  title: "Tidy it up",
  summary: "Gather like terms, open brackets and swap letters for numbers.",
  screens: [
    {
      kind: "explain",
      title: "Like terms",
      text: [
        "Terms with exactly the same letters are **like terms**, and can be added together.",
        "$3x + 2x = 5x$, just as 3 lots of a number and 2 more lots make 5 lots.",
      ],
      picture: { kind: "maths", tex: "3x + 2x = 5x" },
    },
    {
      kind: "sort",
      title: "Gather the like terms",
      groups: ["Like $4x$", "Like $3y$", "Like $x^2$"],
      items: [
        { text: "$x$", group: 0, why: "$x$ is $1x$, a like term with $4x$." },
        { text: "$-2x$", group: 0, why: "$-2x$ has the letter part x, like $4x$." },
        { text: "$7y$", group: 1, why: "$7y$ has the letter part y." },
        { text: "$y$", group: 1, why: "$y$ is $1y$." },
        {
          text: "$5x^2$",
          group: 2,
          why: "$x^2$ is $x \\times x$, a different kind of term from $x$.",
        },
        { text: "$x^2$", group: 2, why: "$x^2$ is not like x: it is x times itself." },
      ],
      done: "Like terms have the same letters and the same powers. Only the numbers in front differ.",
    },
    {
      kind: "steps",
      title: "Collect like terms",
      start: "$5a + 3b - 2a + b$",
      stages: [
        {
          prompt: "Collect the a terms: $5a - 2a =$",
          options: [
            { text: "$3a$", correct: true, feedback: "" },
            { text: "$7a$", feedback: "The sign in front of $2a$ is minus: take it away." },
            { text: "$3a^2$", feedback: "Adding like terms never changes the power." },
          ],
          then: "$= 3a + 3b + b$",
        },
        {
          prompt: "Now the b terms: $3b + b =$",
          options: [
            { text: "$4b$", correct: true, feedback: "" },
            { text: "$3b$", feedback: "b on its own means 1b." },
            { text: "$3b^2$", feedback: "$3b + b$ is 4 lots of b, not b squared." },
          ],
          then: "$= 3a + 4b$",
        },
      ],
      done: "$3a + 4b$ is as simple as it gets: a and b are not like terms. Each sign belongs to the term after it.",
    },
    {
      kind: "answer",
      title: "Simplify $4x + 7 - x + 2$",
      answers: ["3x+9", "9+3x"],
      wrong: [
        { answer: "4x+9", feedback: "x on its own is $1x$: $4x - x = 3x$." },
        { answer: "12x", feedback: "7 and 2 are numbers, not x terms: keep them apart." },
      ],
      hint: "Collect the x terms, then the numbers.",
      done: "$4x - x = 3x$ and $7 + 2 = 9$: $3x + 9$.",
    },
    {
      kind: "explain",
      title: "Opening brackets",
      text: [
        "$3(x + 4)$ means 3 lots of $x + 4$. The 3 multiplies **everything** in the bracket.",
        "A grid shows it: $3 \\times x = 3x$ and $3 \\times 4 = 12$, so $3(x + 4) = 3x + 12$.",
      ],
      picture: {
        kind: "table",
        head: ["×", "$x$", "$+4$"],
        rows: [["$3$", "$3x$", "$+12$"]],
      },
    },
    {
      kind: "fill",
      title: "Expand $5(2y - 3)$",
      picture: {
        kind: "table",
        head: ["×", "$2y$", "$-3$"],
        rows: [["$5$", "?", "?"]],
      },
      template: "$5(2y - 3) =$ [] $-$ []",
      bank: ["$10y$", "$7y$", "$2y$", "$15$", "$3$", "$8$"],
      answers: ["$10y$", "$15$"],
      hint: "Multiply both terms inside by 5: $5 \\times 2y$ and $5 \\times 3$.",
      done: "$5(2y - 3) = 10y - 15$.",
    },
    {
      kind: "choice",
      title: "Which is $2(x + 6)$?",
      options: [
        { text: "$2x + 12$", correct: true, feedback: "The 2 multiplies both the x and the 6." },
        { text: "$2x + 6$", feedback: "The 2 multiplies everything inside, the 6 as well." },
        { text: "$14x$", feedback: "$2x$ and 12 are not like terms, so they cannot be added." },
      ],
    },
    {
      kind: "answer",
      title: "Expand and simplify $3(a + 2) + 4a$",
      answers: ["7a+6", "6+7a"],
      wrong: [
        { answer: "7a+2", feedback: "Multiply the 2 by 3 as well: $3(a + 2) = 3a + 6$." },
        { answer: "13a", feedback: "$7a$ and 6 are not like terms." },
      ],
      hint: "Open the bracket first, then collect the a terms.",
      done: "$3a + 6 + 4a = 7a + 6$.",
    },
    {
      kind: "steps",
      title: "Swap the letters for numbers",
      text: "$a = 5$ and $b = -2$.",
      start: "$a^2 - 3b$",
      stages: [
        {
          prompt: "Put the numbers in:",
          options: [
            { text: "$5^2 - 3 \\times (-2)$", correct: true, feedback: "" },
            {
              text: "$5^2 - 3 - 2$",
              feedback: "$3b$ means $3 \\times b$: keep the × and put −2 in a bracket.",
            },
            {
              text: "$5 \\times 2 - 3 \\times (-2)$",
              feedback: "$a^2$ means $5 \\times 5$, not $5 \\times 2$.",
            },
          ],
          then: "$= 5^2 - 3 \\times (-2)$",
        },
        {
          prompt: "Work out the power and the multiplying:",
          options: [
            { text: "$25 - (-6)$", correct: true, feedback: "" },
            { text: "$10 - (-6)$", feedback: "$5^2$ is $5 \\times 5$." },
            { text: "$25 - 6$", feedback: "$3 \\times -2$ is −6, and you are subtracting it." },
          ],
          then: "$= 25 - (-6)$",
        },
        {
          prompt: "Taking away a negative is the same as adding:",
          options: [
            { text: "$31$", correct: true, feedback: "" },
            { text: "$19$", feedback: "Taking away −6 is the same as adding 6." },
          ],
          then: "$= 31$",
        },
      ],
      done: "Brackets round negative numbers keep the signs straight.",
    },
    {
      kind: "answer",
      title: "If $x = 3$, what is $2x^2$?",
      answers: ["18"],
      wrong: [
        {
          answer: "36",
          feedback: "That is $(2x)^2$. The power is on the x only: $2 \\times 3^2$.",
        },
      ],
      hint: "Square x first, then multiply by 2.",
      done: "$2 \\times 3^2 = 2 \\times 9 = 18$.",
    },
    {
      kind: "answer",
      title: "A formula from physics",
      text: "$v = u + at$ gives a speed. Find $v$ when $u = 4$, $a = 10$ and $t = 3$.",
      answers: ["34"],
      wrong: [
        {
          answer: "42",
          feedback: "That adds u and a first. Multiply a and t first: $10 \\times 3$.",
        },
      ],
      hint: "$at$ means $a \\times t$, which comes before adding.",
      done: "$v = 4 + 10 \\times 3 = 34$: start at 4 m/s, speed up 10 m/s each second for 3 seconds.",
    },
    {
      kind: "answer",
      title: "The area of a triangle",
      text: "$A = \\frac{bh}{2}$. Find $A$ when $b = 8$ cm and $h = 5$ cm.",
      answers: ["20"],
      unit: "cm²",
      wrong: [{ answer: "40", feedback: "$bh = 40$; now divide by 2." }],
      hint: "Multiply b by h, then halve.",
      done: "$A = \\frac{8 \\times 5}{2} = \\frac{40}{2} = 20$ cm².",
    },
    {
      kind: "explain",
      title: "All tidied up",
      text: [
        "Collect like terms: same letters, same powers. Each sign goes with the term after it.",
        "A number outside a bracket multiplies everything inside.",
        "Substitute with brackets round negatives, then follow the order of operations.",
      ],
      picture: { kind: "maths", tex: "3(a + 2) + 4a = 7a + 6" },
    },
  ],
};
