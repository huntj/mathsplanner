// Year 7, "Perimeter, area and volume": perimeter as the way round; then each area formula
// discovered by moving pieces, a parallelogram's corner slid across into a rectangle, a turned
// copy of a triangle or trapezium making a parallelogram; and volume built layer by layer.
import type { UnitLesson } from "./types.ts";

export const y7Area: UnitLesson = {
  unit: "y7-area",
  title: "Why the formulas work",
  summary: "Slide, turn and stack shapes to discover their area and volume.",
  screens: [
    {
      kind: "answer",
      title: "The way round",
      text: "The **perimeter** is the distance all the way round. Find this trapezium's perimeter.",
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 7, y: 4 },
          { x: 3, y: 4 },
        ],
        sides: ["10 cm", "5 cm", "4 cm", "5 cm"],
      },
      answers: ["24"],
      unit: "cm",
      hint: "Add up all four sides.",
      done: "$10 + 5 + 4 + 5 = 24$ cm.",
    },
    {
      kind: "answer",
      title: "A parallelogram's perimeter",
      text: "Opposite sides of a parallelogram are equal.",
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 8, y: 0 },
          { x: 10, y: 4 },
          { x: 2, y: 4 },
        ],
        sides: ["8 cm", "5 cm", null, null],
      },
      answers: ["26"],
      unit: "cm",
      wrong: [
        {
          answer: "13",
          feedback: "That is two sides. There are four: two of 8 cm and two of 5 cm.",
        },
      ],
      hint: "Two sides of 8 cm and two sides of 5 cm.",
      done: "$8 + 5 + 8 + 5 = 26$ cm.",
    },
    {
      kind: "morph",
      title: "Turn a parallelogram into a rectangle",
      text: "Cut the corner off, and slide it to the other end.",
      shape: "parallelogram",
      dims: [6, 4, 2],
      done: "It is now a 6 by 4 rectangle, with the same area: 24. So a parallelogram's area is **base × perpendicular height**.",
    },
    {
      kind: "answer",
      title: "A parallelogram's area",
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 9, y: 0 },
          { x: 12, y: 5 },
          { x: 3, y: 5 },
        ],
        sides: ["9 cm", "6 cm", null, null],
        dashed: [
          [
            { x: 3, y: 5 },
            { x: 3, y: 0 },
          ],
        ],
        square: [],
      },
      text: "The dashed height is 5 cm.",
      answers: ["45"],
      unit: "cm²",
      wrong: [
        {
          answer: "54",
          feedback:
            "6 cm is the sloping side. Use the height, which meets the base at a right angle: 5 cm.",
        },
      ],
      hint: "Base × perpendicular height: the height meets the base at a right angle.",
      done: "$9 \\times 5 = 45$ cm².",
    },
    {
      kind: "morph",
      title: "Two triangles",
      text: "Turn a copy of the triangle round, and fit it on.",
      shape: "triangle",
      dims: [6, 4, 2],
      done: "Two triangles make a parallelogram with area $6 \\times 4 = 24$. So one triangle is half: $\\frac12 \\times b \\times h = 12$.",
    },
    {
      kind: "answer",
      title: "A triangle's area",
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 4, y: 7 },
        ],
        sides: ["10 cm", null, null],
        dashed: [
          [
            { x: 4, y: 7 },
            { x: 4, y: 0 },
          ],
        ],
      },
      text: "Its height is 7 cm.",
      answers: ["35"],
      unit: "cm²",
      wrong: [
        { answer: "70", feedback: "That is the whole parallelogram. A triangle is half of it." },
      ],
      hint: "Half of base × height.",
      done: "$\\frac12 \\times 10 \\times 7 = 35$ cm².",
    },
    {
      kind: "morph",
      title: "Two trapezia",
      text: "Turn a copy of the trapezium round, and fit it on.",
      shape: "trapezium",
      dims: [3, 7, 4, 1],
      done: "Two trapezia make a parallelogram with base $3 + 7 = 10$ and height 4. One trapezium is half: $\\frac12(a + b)h = \\frac12 \\times 10 \\times 4 = 20$.",
    },
    {
      kind: "answer",
      title: "A trapezium's area",
      text: "The parallel sides are 5 cm and 9 cm, and the height is 6 cm.",
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 9, y: 0 },
          { x: 7, y: 6 },
          { x: 2, y: 6 },
        ],
        sides: ["9 cm", null, "5 cm", null],
        dashed: [
          [
            { x: 2, y: 6 },
            { x: 2, y: 0 },
          ],
        ],
      },
      answers: ["42"],
      unit: "cm²",
      wrong: [{ answer: "84", feedback: "That is the parallelogram of two trapezia. Halve it." }],
      hint: "Add the parallel sides, multiply by the height, then halve.",
      done: "$\\frac12 \\times (5 + 9) \\times 6 = 42$ cm².",
    },
    {
      kind: "morph",
      title: "Build a cuboid",
      text: "Stack the layers of cubes.",
      shape: "cuboid",
      dims: [4, 3, 5],
      done: "Each layer has $4 \\times 3 = 12$ cubes, and there are 5 layers: 60 cubes. Volume = length × width × height.",
    },
    {
      kind: "answer",
      title: "A cuboid's volume",
      picture: { kind: "cuboid", w: 6, d: 2, h: 3, labels: ["6 cm", "2 cm", "3 cm"] },
      answers: ["36"],
      unit: "cm³",
      wrong: [{ answer: "11", feedback: "That adds the lengths. Multiply them." }],
      hint: "Length × width × height.",
      done: "$6 \\times 2 \\times 3 = 36$ cm³.",
    },
    {
      kind: "explain",
      title: "Prisms",
      text: [
        "A **prism** has the same cross-section all the way through, like a stick of rock.",
        "Its volume is the area of the cross-section × its length: the same idea as the cuboid's layers.",
      ],
      picture: {
        kind: "shape",
        points: [
          { x: 0, y: 0 },
          { x: 4, y: 0 },
          { x: 2, y: 3 },
        ],
        sides: ["cross-section", null, null],
      },
    },
    {
      kind: "answer",
      title: "A triangular prism",
      text: "Its triangular cross-section has an area of 12 cm², and it is 10 cm long. What is its volume?",
      answers: ["120"],
      unit: "cm³",
      wrong: [{ answer: "22", feedback: "Multiply the cross-section by the length." }],
      hint: "Cross-section area × length.",
      done: "$12 \\times 10 = 120$ cm³.",
    },
    {
      kind: "explain",
      title: "Why the formulas work",
      text: [
        "Perimeter: add the sides. Parallelogram: base × height, from sliding it into a rectangle.",
        "Triangle and trapezium: half of the parallelogram two copies make.",
        "Volume of a prism: cross-section × length.",
      ],
      picture: { kind: "maths", tex: "A_{\\text{trapezium}} = \\tfrac12(a + b)h" },
    },
  ],
};
