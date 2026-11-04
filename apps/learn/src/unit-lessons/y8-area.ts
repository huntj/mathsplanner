// Year 8, "Circles and area": spotting π in a table of circles, the circumference, cutting a
// circle into slices and laying them out to see why its area is πr², and composite shapes.
import type { UnitLesson } from "./types.ts";

const circle = (cx: number, cy: number, r: number) => [
  { arc: { x: cx, y: cy }, r, from: 0, to: 180 },
  { arc: { x: cx, y: cy }, r, from: 180, to: 360 },
];

export const y8Area: UnitLesson = {
  unit: "y8-area",
  title: "Round and round",
  summary: "Find π hiding in every circle, then slice one up to find its area.",
  screens: [
    {
      kind: "explain",
      title: "Round the outside",
      text: [
        "The distance round a circle is its **circumference**, C. The distance across, through the middle, is its **diameter**, d.",
        "The **radius**, r, is half the diameter.",
      ],
      picture: {
        kind: "drawing",
        items: [
          ...circle(0, 0, 3),
          {
            line: [
              { x: -3, y: 0 },
              { x: 3, y: 0 },
            ],
            tone: "find",
          },
          { dot: { x: 0, y: 0 } },
          { text: "d", at: { x: 1.5, y: 0.45 }, tone: "find" },
          { text: "C", at: { x: 2.6, y: 2.4 } },
        ],
      },
    },
    {
      kind: "choice",
      title: "Spot the pattern",
      text: "Some circles were measured. What is C ÷ d for the wheel?",
      picture: {
        kind: "table",
        head: ["", "C", "d", "C ÷ d"],
        rows: [
          ["Coin", "7.5 cm", "2.4 cm", "3.13"],
          ["Plate", "81.7 cm", "26 cm", "3.14"],
          ["Wheel", "188 cm", "60 cm", "?"],
        ],
      },
      options: [
        {
          text: "About 3.1",
          correct: true,
          feedback:
            "$188 \\div 60 = 3.13$. Every circle's circumference is about 3.14 times its diameter. That number is **π** (pi).",
        },
        { text: "About 6", feedback: "Work it out: $188 \\div 60$." },
        { text: "60", feedback: "That is the diameter. Divide the circumference by it." },
      ],
    },
    {
      kind: "answer",
      title: "The circumference",
      text: "A circle has a diameter of 10 cm. Use $C = \\pi d$ to find its circumference, to 1 decimal place.",
      answers: ["31.4"],
      unit: "cm",
      wrong: [
        {
          answer: "62.8",
          feedback: "That uses $2 \\times 10$. $C = \\pi \\times d$, and d is already 10.",
        },
        { answer: "78.5", feedback: "That is the area. The circumference is $\\pi \\times d$." },
      ],
      hint: "$C = \\pi \\times 10$.",
      done: "$\\pi \\times 10 = 31.4$ cm.",
    },
    {
      kind: "answer",
      title: "From the radius",
      text: "A circle has a radius of 4 cm. Find its circumference, to 1 decimal place.",
      answers: ["25.1"],
      unit: "cm",
      wrong: [
        {
          answer: "12.6",
          feedback: "That uses the radius. Double it for the diameter: $C = 2\\pi r$.",
        },
      ],
      hint: "The diameter is twice the radius.",
      done: "$C = \\pi \\times 8 = 25.1$ cm.",
    },
    {
      kind: "morph",
      title: "Slice the circle",
      text: "Cut the circle into slices, and lay them out in a row, pointing up and down in turn.",
      shape: "circle",
      dims: [2, 16],
      done: "The slices make nearly a rectangle: r tall, and half the circumference, $\\pi r$, long. So the area is $\\pi r \\times r = \\pi r^2$.",
    },
    {
      kind: "answer",
      title: "The area of a circle",
      text: "A circle has a radius of 5 cm. Use $A = \\pi r^2$, to 1 decimal place.",
      answers: ["78.5"],
      unit: "cm²",
      wrong: [
        { answer: "31.4", feedback: "That is the circumference. The area is $\\pi r^2$." },
        { answer: "314.2", feedback: "That squares the diameter. Square the radius: $5^2 = 25$." },
      ],
      hint: "$\\pi \\times 5^2 = \\pi \\times 25$.",
      done: "$\\pi \\times 25 = 78.5$ cm².",
    },
    {
      kind: "answer",
      title: "From the diameter",
      text: "A circle has a diameter of 6 cm. Find its area, to 1 decimal place.",
      answers: ["28.3"],
      unit: "cm²",
      wrong: [{ answer: "113.1", feedback: "That squares the diameter. Halve it first: r = 3." }],
      hint: "Find the radius first.",
      done: "r = 3, so $A = \\pi \\times 9 = 28.3$ cm².",
    },
    {
      kind: "answer",
      title: "A semicircle",
      text: "Find the area of a semicircle with radius 4 cm, to 1 decimal place.",
      picture: {
        kind: "drawing",
        items: [
          { arc: { x: 0, y: 0 }, r: 4, from: 0, to: 180 },
          {
            line: [
              { x: -4, y: 0 },
              { x: 4, y: 0 },
            ],
          },
          {
            line: [
              { x: 0, y: 0 },
              { x: 4, y: 0 },
            ],
            tone: "find",
          },
          { text: "4 cm", at: { x: 2, y: -0.6 } },
        ],
      },
      answers: ["25.1"],
      unit: "cm²",
      wrong: [{ answer: "50.3", feedback: "That is the whole circle. A semicircle is half." }],
      hint: "Find the whole circle's area, then halve it.",
      done: "$\\frac12 \\times \\pi \\times 16 = 25.1$ cm².",
    },
    {
      kind: "explain",
      title: "Composite shapes",
      text: [
        "Split a shape into pieces you know. Find each piece's area, then add them, or take one away.",
      ],
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 8, y: 0 },
          { x: 8, y: 3 },
          { x: 3, y: 3 },
          { x: 3, y: 7 },
          { x: 0, y: 7 },
        ],
        dashed: [
          [
            { x: 0, y: 3 },
            { x: 3, y: 3 },
          ],
        ],
      },
    },
    {
      kind: "answer",
      title: "The L-shape's area",
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 8, y: 0 },
          { x: 8, y: 3 },
          { x: 3, y: 3 },
          { x: 3, y: 7 },
          { x: 0, y: 7 },
        ],
        sides: ["8 cm", "3 cm", null, null, "3 cm", "7 cm"],
        dashed: [
          [
            { x: 0, y: 3 },
            { x: 3, y: 3 },
          ],
        ],
      },
      answers: ["36"],
      unit: "cm²",
      wrong: [{ answer: "56", feedback: "$8 \\times 7$ counts the missing corner too." }],
      hint: "The dashed line makes an 8 by 3 rectangle and a 3 by 4 one.",
      done: "$8 \\times 3 + 3 \\times 4 = 24 + 12 = 36$ cm².",
    },
    {
      kind: "answer",
      title: "The L-shape's perimeter",
      text: "Two sides are not labelled. Work them out first.",
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 8, y: 0 },
          { x: 8, y: 3 },
          { x: 3, y: 3 },
          { x: 3, y: 7 },
          { x: 0, y: 7 },
        ],
        sides: ["8 cm", "3 cm", "?", "?", "3 cm", "7 cm"],
      },
      answers: ["30"],
      unit: "cm",
      wrong: [
        { answer: "21", feedback: "Add the two missing sides too: $8 - 3 = 5$ and $7 - 3 = 4$." },
      ],
      hint: "The missing sides are $8 - 3$ and $7 - 3$.",
      done: "$8 + 3 + 5 + 4 + 3 + 7 = 30$ cm.",
    },
    {
      kind: "answer",
      title: "A rectangle with a round end",
      text: "A 10 cm by 4 cm rectangle has a semicircle on one end. Find the total area, to 1 decimal place.",
      picture: {
        kind: "drawing",
        items: [
          {
            line: [
              { x: 0, y: 0 },
              { x: 10, y: 0 },
            ],
          },
          {
            line: [
              { x: 0, y: 4 },
              { x: 10, y: 4 },
            ],
          },
          {
            line: [
              { x: 0, y: 0 },
              { x: 0, y: 4 },
            ],
          },
          {
            line: [
              { x: 10, y: 0 },
              { x: 10, y: 4 },
            ],
            dashed: true,
            tone: "soft",
          },
          { arc: { x: 10, y: 2 }, r: 2, from: -90, to: 90 },
          { text: "10 cm", at: { x: 5, y: -0.7 } },
          { text: "4 cm", at: { x: -1, y: 2 } },
        ],
      },
      answers: ["46.3"],
      unit: "cm²",
      wrong: [{ answer: "52.6", feedback: "That adds a whole circle. The end is a semicircle." }],
      hint: "The rectangle is 40 cm². The semicircle has radius 2.",
      done: "$40 + \\frac12 \\times \\pi \\times 2^2 = 40 + 6.3 = 46.3$ cm².",
    },
    {
      kind: "explain",
      title: "Round and round",
      text: [
        "Circumference: $C = \\pi d = 2\\pi r$. Area: $A = \\pi r^2$, from the slices laid out in a row.",
        "Composite shapes: split them into pieces, then add or take away.",
      ],
      picture: { kind: "maths", tex: "A = \\pi r^2" },
    },
  ],
};
