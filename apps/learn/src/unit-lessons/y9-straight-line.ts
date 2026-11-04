// Year 9, "Straight-line graphs": the gradient as up ÷ across between any two points, the
// intercept, parallel lines sharing a gradient, rearranging into y = mx + c, and what gradient
// and intercept mean in a real situation.
import type { UnitLesson } from "./types.ts";

export const y9StraightLine: UnitLesson = {
  unit: "y9-straight-line",
  title: "Steep and shifted",
  summary: "Measure any line's steepness, then read and rearrange its equation.",
  screens: [
    {
      kind: "explain",
      title: "Gradient from any two points",
      text: [
        "The gradient is how far up for each 1 across. Between any two points on a line: gradient = change in y ÷ change in x.",
        "From (1, 2) to (4, 8): up 6, across 3, so the gradient is $6 \\div 3 = 2$.",
      ],
      picture: {
        kind: "graph",
        range: { xMin: -1, xMax: 6, yMin: -1, yMax: 10 },
        lines: [{ m: 2, c: 0 }],
        points: [
          { x: 1, y: 2 },
          { x: 4, y: 8 },
        ],
        steps: true,
      },
    },
    {
      kind: "answer",
      title: "Find the gradient",
      text: "The line goes through (2, 1) and (6, 9).",
      picture: {
        kind: "graph",
        range: { xMin: -1, xMax: 7, yMin: -4, yMax: 10 },
        lines: [{ m: 2, c: -3 }],
        points: [
          { x: 2, y: 1 },
          { x: 6, y: 9 },
        ],
        steps: true,
      },
      answers: ["2"],
      wrong: [
        { answer: "0.5", feedback: "That is across ÷ up. The gradient is up ÷ across." },
        { answer: "8", feedback: "8 is the change in y. Divide it by the change in x." },
      ],
      hint: "Up from 1 to 9 is 8. Across from 2 to 6 is 4.",
      done: "$8 \\div 4 = 2$.",
    },
    {
      kind: "answer",
      title: "Going down",
      text: "The line goes through (0, 5) and (4, −3).",
      picture: {
        kind: "graph",
        range: { xMin: -1, xMax: 5, yMin: -4, yMax: 6 },
        lines: [{ m: -2, c: 5 }],
        points: [
          { x: 0, y: 5 },
          { x: 4, y: -3 },
        ],
        steps: true,
      },
      answers: ["-2"],
      wrong: [
        {
          answer: "2",
          feedback: "The line goes down from left to right, so the gradient is negative.",
        },
      ],
      hint: "y changes by −8 while x changes by 4.",
      done: "$-8 \\div 4 = -2$.",
    },
    {
      kind: "choice",
      title: "Where does $y = 3x - 4$ cross the y-axis?",
      options: [
        {
          text: "(0, −4)",
          correct: true,
          feedback: "On the y-axis x = 0, so $y = -4$: the intercept is c.",
        },
        { text: "(0, 3)", feedback: "3 is the gradient." },
        { text: "(−4, 0)", feedback: "That is on the x-axis. On the y-axis, x = 0." },
      ],
    },
    {
      kind: "choice",
      title: "Which two lines are parallel?",
      picture: {
        kind: "graph",
        range: { xMin: -4, xMax: 4, yMin: -6, yMax: 6 },
        lines: [
          { m: 2, c: 1 },
          { m: 2, c: -3 },
          { m: -1, c: 2 },
        ],
      },
      options: [
        {
          text: "$y = 2x + 1$ and $y = 2x - 3$",
          correct: true,
          feedback:
            "They have the same gradient, 2. Parallel lines have equal gradients, so they never meet.",
        },
        {
          text: "$y = 2x + 1$ and $y = -x + 2$",
          feedback: "Their gradients, 2 and −1, are different: they cross.",
        },
        {
          text: "$y = 2x - 3$ and $y = -x + 2$",
          feedback: "Their gradients differ, so they cross.",
        },
      ],
    },
    {
      kind: "slider",
      title: "A parallel line through a point",
      text: "Slide c in $y = 3x + c$, keeping it parallel to $y = 3x$, until it goes through the star at (1, 5).",
      range: { xMin: -3, xMax: 3, yMin: -6, yMax: 10 },
      vary: "c",
      start: { m: 3, c: 0 },
      min: -5,
      max: 5,
      star: { x: 1, y: 5 },
      done: "c = 2: $y = 3x + 2$. Check: $3 \\times 1 + 2 = 5$ ✓",
    },
    {
      kind: "steps",
      title: "Rearrange $2y + 4x = 6$",
      start: "$2y + 4x = 6$",
      stages: [
        {
          prompt: "Get the y term on its own:",
          options: [
            { text: "$2y = 6 - 4x$", correct: true, feedback: "" },
            { text: "$2y = 6 + 4x$", feedback: "Take 4x from both sides: it becomes −4x." },
            { text: "$y = 6 - 4x$", feedback: "First get $2y$ alone; then divide." },
          ],
          then: "$2y = 6 - 4x$",
        },
        {
          prompt: "Divide everything by 2:",
          options: [
            { text: "$y = -2x + 3$", correct: true, feedback: "" },
            { text: "$y = 3 - 4x$", feedback: "Divide both terms by 2." },
            { text: "$y = -2x + 6$", feedback: "Divide the 6 by 2 as well." },
          ],
          then: "$y = -2x + 3$",
        },
        {
          prompt: "So its gradient and intercept are",
          options: [
            { text: "gradient −2, intercept 3", correct: true, feedback: "" },
            {
              text: "gradient 4, intercept 6",
              feedback: "Rearrange to $y = mx + c$ before reading them.",
            },
            { text: "gradient 2, intercept 3", feedback: "Keep the minus: −2x." },
          ],
          then: "Gradient −2, crossing the y-axis at 3.",
        },
      ],
      done: "Rearrange to $y = mx + c$, then read m and c.",
    },
    {
      kind: "choice",
      title: "What is the gradient of $3y - 6x = 12$?",
      options: [
        { text: "2", correct: true, feedback: "$3y = 6x + 12$, so $y = 2x + 4$." },
        { text: "−6", feedback: "Rearrange first: get y on its own." },
        { text: "3", feedback: "Rearrange to $y = mx + c$: divide by 3." },
      ],
    },
    {
      kind: "choice",
      title: "What does the gradient mean?",
      text: "A candle is 12 cm tall and burns down. Its height after t hours is $h = 12 - 2t$.",
      picture: {
        kind: "graph",
        range: { xMin: 0, xMax: 7, yMin: 0, yMax: 12 },
        lines: [{ m: -2, c: 12 }],
      },
      options: [
        {
          text: "It burns 2 cm every hour",
          correct: true,
          feedback:
            "The gradient is a rate: −2 cm per hour. The intercept, 12, is where it starts.",
        },
        { text: "It is 2 cm tall", feedback: "The intercept, 12, is its height at the start." },
        {
          text: "It burns for 2 hours",
          feedback: "It reaches 0 after 6 hours: where the line meets the axis.",
        },
      ],
    },
    {
      kind: "drag-line",
      title: "Draw $y = -\\frac{1}{2}x + 2$",
      text: "Drag the dots so the line is $y = -\\frac12 x + 2$.",
      range: { xMin: -4, xMax: 4, yMin: -3, yMax: 5 },
      rule: { m: -0.5, c: 2 },
      from: [
        { x: -3, y: -2 },
        { x: 3, y: -2 },
      ],
      hint: "Start at 2 on the y-axis. A gradient of −½ is 2 across, 1 down.",
    },
    {
      kind: "explain",
      title: "Steep and shifted",
      text: [
        "Gradient = change in y ÷ change in x. Negative slopes down.",
        "Parallel lines have the same gradient. Rearrange to $y = mx + c$ to read m and c.",
        "In context, the gradient is a rate and the intercept is the starting value.",
      ],
      picture: {
        kind: "graph",
        range: { xMin: -4, xMax: 4, yMin: -6, yMax: 6 },
        lines: [
          { m: 2, c: 1 },
          { m: 2, c: -3 },
        ],
      },
    },
  ],
};
