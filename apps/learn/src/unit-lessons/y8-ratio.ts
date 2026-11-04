// Year 8, "Ratio and proportion": ratios as fractions and as straight-line graphs through the
// origin, direct proportion by finding one first, and its graph and equation y = kx.
import type { UnitLesson } from "./types.ts";

export const y8Ratio: UnitLesson = {
  unit: "y8-ratio",
  title: "In proportion",
  summary: "See ratios as fractions and as lines through zero.",
  screens: [
    {
      kind: "explain",
      title: "Ratios are fractions in disguise",
      text: [
        "In the ratio 2 : 3, there are 5 parts. A is $\\frac25$ of the whole and B is $\\frac35$.",
        "And A is $\\frac23$ of B: comparing part with part.",
      ],
      picture: {
        kind: "bars",
        rows: [
          { label: "A", parts: 2 },
          { label: "B", parts: 3 },
        ],
      },
    },
    {
      kind: "choice",
      title: "Squash and water",
      text: "Squash is mixed with water in the ratio 1 : 4. What fraction of the drink is squash?",
      options: [
        {
          text: "$\\frac15$",
          correct: true,
          feedback: "1 part squash out of 1 + 4 = 5 parts in all.",
        },
        {
          text: "$\\frac14$",
          feedback: "That compares squash with water. Out of the whole drink, there are 5 parts.",
        },
        { text: "$\\frac45$", feedback: "That is the water." },
      ],
    },
    {
      kind: "explain",
      title: "A ratio as a graph",
      text: [
        "Paint mixed red : white = 1 : 3 needs 3 times as much white as red: white = 3 × red.",
        "Plot it, and you get a straight line through (0, 0).",
      ],
      picture: {
        kind: "graph",
        range: { xMin: 0, xMax: 5, yMin: 0, yMax: 15 },
        lines: [{ m: 3, c: 0 }],
        points: [
          { x: 1, y: 3 },
          { x: 2, y: 6 },
          { x: 4, y: 12 },
        ],
      },
    },
    {
      kind: "answer",
      title: "Scale a recipe",
      text: "A recipe for 4 people uses 300 g of flour. How much flour for 6 people?",
      answers: ["450"],
      unit: "g",
      wrong: [
        { answer: "302", feedback: "Scale it, don't add: 1 person needs $300 \\div 4 = 75$ g." },
      ],
      hint: "Find how much for 1 person first.",
      done: "$300 \\div 4 = 75$ g each, and $75 \\times 6 = 450$ g.",
    },
    {
      kind: "steps",
      title: "Find one first",
      start: "5 pens cost £3.40. How much do 8 cost?",
      stages: [
        {
          prompt: "Find the cost of 1 pen:",
          options: [
            { text: "£0.68", correct: true, feedback: "" },
            { text: "£1.47", feedback: "Divide £3.40 by 5." },
            { text: "£17", feedback: "That multiplies. One pen costs less than five." },
          ],
          then: "1 pen: $£3.40 \\div 5 = £0.68$",
        },
        {
          prompt: "So 8 pens cost",
          options: [
            { text: "£5.44", correct: true, feedback: "" },
            { text: "£6.40", feedback: "$8 \\times £0.68$." },
            { text: "£4.08", feedback: "That is 6 pens. Count 8." },
          ],
          then: "8 pens: $8 \\times £0.68 = £5.44$",
        },
      ],
      done: "Find one, then scale up: the **unitary method**.",
    },
    {
      kind: "plot",
      title: "Plot the cost of apples",
      text: "Apples cost £2 a kilogram. Plot the cost for 0 to 4 kg.",
      scene: { range: { xMin: 0, xMax: 5, yMin: 0, yMax: 10 } },
      targets: [
        { x: 0, y: 0 },
        { x: 1, y: 2 },
        { x: 2, y: 4 },
        { x: 3, y: 6 },
        { x: 4, y: 8 },
      ],
      table: true,
      rule: { m: 2, c: 0 },
      hint: "Across to the kilograms, up to the cost.",
      done: "A straight line through (0, 0): that is direct proportion. Cost = 2 × kg.",
    },
    {
      kind: "choice",
      title: "Which shows direct proportion?",
      options: [
        {
          text: "$y = 5x$",
          correct: true,
          feedback: "A straight line through the origin: double x, and y doubles.",
        },
        {
          text: "$y = 2x + 3$",
          feedback: "When x = 0, y = 3, not 0. Doubling x doesn't double y.",
        },
        { text: "$y = x^2$", feedback: "That curves: doubling x makes y four times as big." },
      ],
    },
    {
      kind: "answer",
      title: "y = kx",
      text: "y is directly proportional to x. When x = 4, y = 10. What is y when x = 7?",
      answers: ["17.5"],
      wrong: [
        { answer: "13", feedback: "That adds 3 to both. Proportion multiplies: find k in y = kx." },
      ],
      hint: "$10 = k \\times 4$, so k = 2.5.",
      done: "$y = 2.5x$, so when x = 7, $y = 17.5$.",
    },
    {
      kind: "choice",
      title: "Is it direct proportion?",
      text: "The more people who paint a fence, the less time it takes.",
      options: [
        {
          text: "No: one goes up as the other goes down",
          correct: true,
          feedback: "That is **inverse** proportion. In direct proportion, both go up together.",
        },
        { text: "Yes", feedback: "Double the painters and the time halves, not doubles." },
      ],
    },
    {
      kind: "explain",
      title: "In proportion",
      text: [
        "A ratio's parts are fractions of the whole: 1 : 4 means $\\frac15$ and $\\frac45$.",
        "Direct proportion: find one, then scale. Its graph is a straight line through (0, 0), $y = kx$.",
      ],
      picture: {
        kind: "graph",
        range: { xMin: 0, xMax: 5, yMin: 0, yMax: 10 },
        lines: [{ m: 2, c: 0 }],
      },
    },
  ],
};
