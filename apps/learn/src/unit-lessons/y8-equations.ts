// Year 8, "Formulae and equations": using formulae, equations with the letter on both sides
// solved on a balance, brackets and fractions in equations, and rearranging a formula to change
// its subject, which is solving an equation with letters.
import type { UnitLesson } from "./types.ts";

export const y8Equations: UnitLesson = {
  unit: "y8-equations",
  title: "Balance and rearrange",
  summary: "Balance equations with letters on both sides, then rearrange formulae.",
  screens: [
    {
      kind: "answer",
      title: "Use a formula",
      text: "$F = 1.8C + 32$ turns degrees Celsius into Fahrenheit. What is 25 °C in Fahrenheit?",
      answers: ["77"],
      unit: "°F",
      wrong: [{ answer: "102.6", feedback: "Multiply 25 by 1.8 first, then add 32." }],
      hint: "Put 25 in place of C: $1.8 \\times 25 + 32$.",
      done: "$1.8 \\times 25 + 32 = 45 + 32 = 77$ °F.",
    },
    {
      kind: "balance",
      title: "Solve $5x + 3 = 2x + 15$",
      text: "Now there are bags on both sides. Get them all on one side first.",
      a: 5,
      b: 3,
      c: 15,
      d: 2,
      letter: "x",
      done: "$x = 4$. Check: $5 \\times 4 + 3 = 23$ and $2 \\times 4 + 15 = 23$ ✓",
    },
    {
      kind: "balance",
      title: "Solve $4x + 1 = x + 13$",
      a: 4,
      b: 1,
      c: 13,
      d: 1,
      letter: "x",
      done: "$x = 4$. Check: $4 \\times 4 + 1 = 17$ and $4 + 13 = 17$ ✓",
    },
    {
      kind: "steps",
      title: "Solve $3(x + 4) = 27$",
      start: "$3(x + 4) = 27$",
      stages: [
        {
          prompt: "Expand the bracket:",
          options: [
            { text: "$3x + 12 = 27$", correct: true, feedback: "" },
            { text: "$3x + 4 = 27$", feedback: "The 3 multiplies the 4 as well." },
            { text: "$x + 12 = 27$", feedback: "The 3 multiplies the x as well." },
          ],
          then: "$3x + 12 = 27$",
        },
        {
          prompt: "Take 12 from both sides:",
          options: [
            { text: "$3x = 15$", correct: true, feedback: "" },
            { text: "$3x = 39$", feedback: "Take 12 away, don't add it." },
          ],
          then: "$3x = 15$",
        },
        {
          prompt: "Divide both sides by 3:",
          options: [
            { text: "$x = 5$", correct: true, feedback: "" },
            { text: "$x = 45$", feedback: "Divide by 3, don't multiply." },
          ],
          then: "$x = 5$",
        },
      ],
      done: "Check: $3(5 + 4) = 27$ ✓. You could also divide by 3 first: $x + 4 = 9$.",
    },
    {
      kind: "answer",
      title: "Solve $2(x - 3) = 14$",
      answers: ["10"],
      wrong: [
        { answer: "8.5", feedback: "Multiply the 3 by 2 too: $2x - 6 = 14$." },
        { answer: "4", feedback: "Undo the − 3 by adding 3: $x - 3 = 7$." },
      ],
      hint: "Divide both sides by 2, or expand the bracket first.",
      done: "$x - 3 = 7$, so $x = 10$.",
    },
    {
      kind: "steps",
      title: "Solve $\\frac{x + 5}{3} = 4$",
      start: "$\\frac{x + 5}{3} = 4$",
      stages: [
        {
          prompt: "Get rid of the fraction: multiply both sides by 3.",
          options: [
            { text: "$x + 5 = 12$", correct: true, feedback: "" },
            {
              text: "$x + 5 = \\frac{4}{3}$",
              feedback: "That divides. Multiplying by 3 undoes ÷ 3.",
            },
            {
              text: "$3x + 5 = 12$",
              feedback: "All of $x + 5$ was divided by 3, so all of it comes back.",
            },
          ],
          then: "$x + 5 = 12$",
        },
        {
          prompt: "Take 5 from both sides:",
          options: [
            { text: "$x = 7$", correct: true, feedback: "" },
            { text: "$x = 17$", feedback: "Take 5 away, don't add it." },
          ],
          then: "$x = 7$",
        },
      ],
      done: "Check: $\\frac{7 + 5}{3} = \\frac{12}{3} = 4$ ✓",
    },
    {
      kind: "answer",
      title: "Solve $\\frac{x}{4} + 2 = 5$",
      answers: ["12"],
      wrong: [{ answer: "28", feedback: "Undo the + 2 first: $\\frac{x}{4} = 3$." }],
      hint: "Undo the + 2 first, then the ÷ 4.",
      done: "$\\frac{x}{4} = 3$, so $x = 12$.",
    },
    {
      kind: "explain",
      title: "Rearranging",
      text: [
        "A formula can be rearranged like an equation: do the same to both sides until the letter you want is on its own.",
        "That letter becomes the **subject**.",
      ],
      picture: { kind: "maths", tex: "v = u + at \\;\\Rightarrow\\; u = v - at" },
    },
    {
      kind: "steps",
      title: "Make $t$ the subject of $v = u + at$",
      start: "$v = u + at$",
      stages: [
        {
          prompt: "Get $at$ on its own:",
          options: [
            { text: "$v - u = at$", correct: true, feedback: "" },
            { text: "$v + u = at$", feedback: "Undo + u by taking u from both sides." },
            { text: "$\\frac{v}{u} = at$", feedback: "u is added, so take it away; don't divide." },
          ],
          then: "$v - u = at$",
        },
        {
          prompt: "Now get $t$ on its own:",
          options: [
            { text: "$t = \\frac{v - u}{a}$", correct: true, feedback: "" },
            { text: "$t = \\frac{v}{a} - u$", feedback: "Divide all of $v - u$ by a." },
            { text: "$t = a(v - u)$", feedback: "Undo × a by dividing by a." },
          ],
          then: "$t = \\frac{v - u}{a}$",
        },
      ],
      done: "The same steps as solving an equation, with letters instead of numbers.",
    },
    {
      kind: "fill",
      title: "Make $r$ the subject of $C = 2\\pi r$",
      template: "$r =$ []",
      bank: ["$\\frac{C}{2\\pi}$", "$C - 2\\pi$", "$2\\pi C$", "$\\frac{2\\pi}{C}$"],
      answers: ["$\\frac{C}{2\\pi}$"],
      hint: "r is multiplied by $2\\pi$. Undo it.",
      done: "$r = \\frac{C}{2\\pi}$: divide both sides by $2\\pi$.",
    },
    {
      kind: "choice",
      title: "Make $x$ the subject of $y = 3x - 7$",
      options: [
        {
          text: "$x = \\frac{y + 7}{3}$",
          correct: true,
          feedback: "Add 7 to both sides, then divide by 3.",
        },
        {
          text: "$x = \\frac{y}{3} + 7$",
          feedback: "Add 7 first, then divide all of $y + 7$ by 3.",
        },
        { text: "$x = 3y + 7$", feedback: "Undo × 3 by dividing, not multiplying." },
      ],
    },
    {
      kind: "explain",
      title: "Balance and rearrange",
      text: [
        "Letters on both sides: take the smaller number of them from both sides first.",
        "Brackets: expand, or divide both sides. Fractions: multiply both sides.",
        "To change the subject, undo what is done to it, in reverse order, on both sides.",
      ],
      picture: { kind: "maths", tex: "5x + 3 = 2x + 15 \\Rightarrow 3x = 12 \\Rightarrow x = 4" },
    },
  ],
};
