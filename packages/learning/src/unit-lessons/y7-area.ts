// Year 7, "Perimeter, area and volume", as six short lessons, one just before each skill:
// perimeter as the way round; the area of a triangle (half a rectangle), a parallelogram (slide a
// corner across) and a trapezium (two make a parallelogram); and volume, layer by layer, for
// cuboids and then any prism. Each starts from something quick, builds the formula by moving
// pieces, names the common mistakes, and ends on an exit check.
import type { ShapePic, UnitLesson } from "./types.ts";

const PERIMETER = "Y7-GEO-01.a";
const TRIANGLE = "Y7-GEO-01.b";
const PARALLELOGRAM = "Y7-GEO-01.c";
const TRAPEZIUM = "Y7-GEO-01.d";
const CUBOID = "Y7-GEO-02.a";
const PRISM = "Y7-GEO-02.b";

/** A triangle with base b along the bottom, height h, apex at x = a, and a dashed height. */
function triangle(b: number, h: number, a: number, labels: [string | null]): ShapePic {
  return {
    kind: "shape",
    points: [
      { x: 0, y: 0 },
      { x: b, y: 0 },
      { x: a, y: h },
    ],
    sides: [labels[0], null, null],
    dashed: [
      [
        { x: a, y: h },
        { x: a, y: 0 },
      ],
    ],
  };
}

/** A parallelogram with base b, height h and slant s, and a dashed height. */
const parallelogram = (
  b: number,
  h: number,
  s: number,
  base: string,
  slant: string | null,
  height?: string,
): ShapePic => ({
  kind: "shape",
  points: [
    { x: 0, y: 0 },
    { x: b, y: 0 },
    { x: b + s, y: h },
    { x: s, y: h },
  ],
  sides: [base, slant, null, null],
  ...(height
    ? {
        dashed: [
          [
            { x: s, y: h },
            { x: s, y: 0 },
          ],
        ],
      }
    : {}),
});

/** A trapezium with parallel sides a (top) and b (bottom), height h. */
const trapezium = (a: number, b: number, h: number, labels: [string, string]): ShapePic => {
  const off = (b - a) / 2;
  return {
    kind: "shape",
    points: [
      { x: 0, y: 0 },
      { x: b, y: 0 },
      { x: off + a, y: h },
      { x: off, y: h },
    ],
    sides: [labels[1], null, labels[0], null],
    dashed: [
      [
        { x: off, y: h },
        { x: off, y: 0 },
      ],
    ],
  };
};

export const y7Area: UnitLesson[] = [
  {
    unit: "y7-area",
    id: "y7-area/perimeter",
    before: PERIMETER,
    title: "Perimeter",
    summary: "The perimeter is the distance all the way round: add every side.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Fencing a garden",
        text: [
          "A garden is a trapezium with sides of 10 m, 5 m, 4 m and 5 m. Fencing costs £12 a metre.",
          "How much will it cost to fence all the way round? By the end of this lesson, you can work it out.",
        ],
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 7, y: 4 },
            { x: 3, y: 4 },
          ],
          sides: ["10 m", "5 m", "4 m", "5 m"],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $10 + 5 + 4 + 5$?",
        answers: ["24"],
        hint: "Add them up.",
        done: "24.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $24 \\times 12$?",
        answers: ["288"],
        hint: "$24 \\times 10 + 24 \\times 2$.",
        done: "288.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "All the way round",
        text: [
          "The **perimeter** is the total distance around the edge of a shape. Add up every side.",
          "It's a length, so its units are cm or m, not cm².",
        ],
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 6, y: 0 },
            { x: 2, y: 4 },
          ],
          sides: ["6 cm", "5 cm", "4 cm"],
        },
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "The triangle's perimeter",
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 6, y: 0 },
            { x: 2, y: 4 },
          ],
          sides: ["6 cm", "5 cm", "4 cm"],
        },
        answers: ["15"],
        unit: "cm",
        hint: "$6 + 5 + 4$.",
        done: "15 cm.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A parallelogram",
        picture: parallelogram(8, 4, 2, "8 cm", "5 cm"),
        problem: "Find the perimeter. Opposite sides of a parallelogram are equal.",
        steps: [
          {
            line: "Two sides of 8 cm and two of 5 cm",
            why: "Opposite sides match, though only two are labelled.",
          },
          { line: "$8 + 5 + 8 + 5 = 26$ cm", why: "Add all four." },
        ],
        done: "26 cm. Or $2 \\times (8 + 5)$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "An isosceles triangle",
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 6, y: 0 },
            { x: 3, y: 5 },
          ],
          sides: ["6 cm", "7 cm", null],
        },
        start: "An isosceles triangle: two sides are equal.",
        stages: [
          {
            prompt: "The unlabelled side is",
            options: [
              { text: "7 cm", correct: true, feedback: "" },
              { text: "6 cm", feedback: "The two sloping sides are the equal ones." },
            ],
            then: "7 cm",
          },
          {
            prompt: "Perimeter:",
            options: [
              { text: "20 cm", correct: true, feedback: "" },
              { text: "13 cm", feedback: "Add all three sides." },
            ],
            then: "$6 + 7 + 7 = 20$ cm",
          },
        ],
        done: "Use what you know about the shape to fill missing sides.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A trapezium",
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 9, y: 0 },
            { x: 7, y: 3 },
            { x: 2, y: 3 },
          ],
          sides: ["9 cm", "3.6 cm", "5 cm", "3.6 cm"],
        },
        start: "Add all four sides.",
        stages: [
          {
            prompt: "$9 + 3.6 + 5 + 3.6 =$",
            options: [
              { text: "21.2 cm", correct: true, feedback: "" },
              { text: "17.6 cm", feedback: "Both sloping sides count." },
            ],
            then: "21.2 cm",
          },
        ],
        done: "Every side, once.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A parallelogram with sides 10 cm and 6 cm",
        picture: parallelogram(10, 4, 3, "10 cm", "6 cm"),
        answers: ["32"],
        unit: "cm",
        wrong: [{ answer: "16", feedback: "That's two sides. There are four." }],
        hint: "$2 \\times (10 + 6)$.",
        done: "32 cm.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "An equilateral triangle with sides of 9 cm",
        answers: ["27"],
        unit: "cm",
        hint: "Three equal sides.",
        done: "27 cm.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Raj finds the perimeter of a 5 cm by 3 cm rectangle as 15 cm. Is he right?",
        options: [
          {
            text: "No: 15 is the area (in cm²). The perimeter is 16 cm",
            correct: true,
            feedback: "Perimeter adds the sides; area multiplies. Mixing them up is very common.",
          },
          { text: "Yes", feedback: "$5 + 3 + 5 + 3 = 16$." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ivy finds a parallelogram's perimeter with two sides labelled: 7 cm and 4 cm.",
        lines: [
          "The labelled sides are 7 cm and 4 cm",
          "Add them: $7 + 4 = 11$ cm",
          "So the perimeter is 11 cm",
        ],
        wrong: 1,
        why: "There are four sides: the other two match. $2 \\times 11 = 22$ cm.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Fencing a garden",
        start: "Sides 10 m, 5 m, 4 m, 5 m; £12 a metre.",
        stages: [
          {
            prompt: "Perimeter:",
            options: [
              { text: "24 m", correct: true, feedback: "" },
              { text: "200 m", feedback: "Add the sides, don't multiply." },
            ],
            then: "24 m",
          },
          {
            prompt: "Cost:",
            options: [
              { text: "£288", correct: true, feedback: "" },
              { text: "£36", feedback: "$24 \\times 12$." },
            ],
            then: "£288",
          },
        ],
        done: "£288 of fencing.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A triangle has sides 5 cm, 7 cm and 8 cm. What is its perimeter, in cm?",
            answers: ["20"],
            why: "Add them.",
            retry: {
              prompt: "A triangle has sides 4 cm, 9 cm and 10 cm. What is its perimeter, in cm?",
              answers: ["23"],
              why: "Add them.",
            },
          },
          {
            prompt: "A parallelogram has sides 12 cm and 5 cm. What is its perimeter, in cm?",
            answers: ["34"],
            why: "$2 \\times 17$.",
            retry: {
              prompt: "A parallelogram has sides 9 cm and 4 cm. What is its perimeter, in cm?",
              answers: ["26"],
              why: "$2 \\times 13$.",
            },
          },
          {
            prompt: "Perimeter is measured in",
            options: ["cm", "cm²", "cm³"],
            answers: ["cm"],
            why: "It's a length.",
            retry: {
              prompt: "Area is measured in",
              options: ["cm²", "cm", "cm³"],
              answers: ["cm²"],
              why: "Squares.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-area",
    id: "y7-area/triangle",
    before: TRIANGLE,
    title: "The area of a triangle",
    summary: "A triangle is half a rectangle or parallelogram: half the base times the height.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Painting a gable",
        text: [
          "The triangular end of a roof is 8 m wide at the bottom and 3 m tall. A tin of paint covers 5 m².",
          "How many tins are needed? By the end of this lesson, you can work out its area.",
        ],
        picture: triangle(8, 3, 4, ["8 m"]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "The area of a 6 cm by 4 cm rectangle",
        answers: ["24"],
        unit: "cm²",
        hint: "Length × width.",
        done: "24 cm².",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Half of 24",
        answers: ["12"],
        hint: "÷ 2.",
        done: "12.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Half a rectangle",
        text: [
          "Cut a rectangle corner to corner and you get two equal right-angled triangles.",
          "So a right-angled triangle's area is half the rectangle's: $\\frac12 \\times 6 \\times 4 = 12$.",
        ],
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 6, y: 0 },
            { x: 6, y: 4 },
            { x: 0, y: 4 },
          ],
          dashed: [
            [
              { x: 0, y: 0 },
              { x: 6, y: 4 },
            ],
          ],
          square: [0, 1, 2, 3],
        },
      },
      {
        kind: "morph",
        tag: "Discover",
        title: "Any triangle: two copies",
        text: "Turn a copy of the triangle round, and fit it on.",
        shape: "triangle",
        dims: [6, 4, 2],
        done: "Two triangles make a parallelogram with area $6 \\times 4 = 24$. So one triangle is half: $\\frac12 \\times b \\times h = 12$.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Base 10 cm, height 7 cm",
        picture: triangle(10, 7, 3, ["10 cm"]),
        problem: "Find the area of a triangle with base 10 cm and height 7 cm.",
        steps: [
          { line: "Area $= \\frac12 \\times b \\times h$", why: "Half the base times the height." },
          { line: "$= \\frac12 \\times 10 \\times 7 = 35$ cm²", why: "Half of 70." },
        ],
        done: "35 cm². The height is the perpendicular one, straight up from the base.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Base 8 cm, height 5 cm",
        start: "$A = \\frac12 \\times 8 \\times 5$",
        stages: [
          {
            prompt: "$8 \\times 5 =$",
            options: [
              { text: "40", correct: true, feedback: "" },
              { text: "13", feedback: "Multiply." },
            ],
            then: "40",
          },
          {
            prompt: "Half of it:",
            options: [
              { text: "20 cm²", correct: true, feedback: "" },
              { text: "40 cm²", feedback: "A triangle is half: halve it." },
            ],
            then: "20 cm²",
          },
        ],
        done: "20 cm².",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Which length is the height?",
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 6, y: 0 },
            { x: 2, y: 4 },
          ],
          sides: ["6 cm", "5 cm", "4.5 cm"],
          dashed: [
            [
              { x: 2, y: 4 },
              { x: 2, y: 0 },
            ],
          ],
        },
        start: "The dashed height is 4 cm (not labelled on a side).",
        stages: [
          {
            prompt: "The height to use is",
            options: [
              { text: "4 cm: straight up from the base", correct: true, feedback: "" },
              { text: "5 cm: a sloping side", feedback: "Sloping sides aren't the height." },
            ],
            then: "h = 4",
          },
          {
            prompt: "Area:",
            options: [
              { text: "12 cm²", correct: true, feedback: "" },
              { text: "15 cm²", feedback: "That used the sloping 5 cm." },
            ],
            then: "$\\frac12 \\times 6 \\times 4 = 12$ cm²",
          },
        ],
        done: "Use the perpendicular height.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Base 12 cm, height 5 cm",
        picture: triangle(12, 5, 8, ["12 cm"]),
        answers: ["30"],
        unit: "cm²",
        wrong: [{ answer: "60", feedback: "Halve it: a triangle is half." }],
        hint: "$\\frac12 \\times 12 \\times 5$.",
        done: "30 cm².",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Base 9 cm, height 4 cm",
        answers: ["18"],
        unit: "cm²",
        hint: "$\\frac12 \\times 9 \\times 4$.",
        done: "18 cm².",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Sam finds a triangle's area as base × height, 6 × 4 = 24 cm². What did he forget?",
        options: [
          {
            text: "To halve it: 12 cm²",
            correct: true,
            feedback:
              "Forgetting the half is the most common triangle mistake: the rectangle is twice the triangle.",
          },
          { text: "Nothing", feedback: "Base × height is the rectangle around it." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "A triangle has base 10 cm, sloping sides 7 cm, and height 6 cm. Kai finds its area.",
        lines: ["Area = ½ × base × height", "$= \\frac12 \\times 10 \\times 7$", "$= 35$ cm²"],
        wrong: 1,
        why: "7 cm is a sloping side. Use the height, 6 cm: $\\frac12 \\times 10 \\times 6 = 30$ cm².",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Painting a gable",
        picture: triangle(8, 3, 4, ["8 m"]),
        start: "Base 8 m, height 3 m; a tin covers 5 m².",
        stages: [
          {
            prompt: "Area:",
            options: [
              { text: "12 m²", correct: true, feedback: "" },
              { text: "24 m²", feedback: "Halve it." },
            ],
            then: "12 m²",
          },
          {
            prompt: "Tins needed:",
            options: [
              { text: "3", correct: true, feedback: "" },
              { text: "2.4", feedback: "You can't buy 0.4 of a tin: round up." },
            ],
            then: "3 tins",
          },
        ],
        done: "$12 \\div 5 = 2.4$: buy 3.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Area of a triangle, base 6 cm, height 8 cm, in cm²?",
            answers: ["24"],
            why: "$\\frac12 \\times 48$.",
            retry: {
              prompt: "Area of a triangle, base 10 cm, height 3 cm, in cm²?",
              answers: ["15"],
              why: "$\\frac12 \\times 30$.",
            },
          },
          {
            prompt: "Area of a triangle, base 7 cm, height 4 cm, in cm²?",
            answers: ["14"],
            why: "$\\frac12 \\times 28$.",
            retry: {
              prompt: "Area of a triangle, base 5 cm, height 6 cm, in cm²?",
              answers: ["15"],
              why: "$\\frac12 \\times 30$.",
            },
          },
          {
            prompt: "The area of a triangle is",
            options: ["$\\frac12 \\times b \\times h$", "$b \\times h$", "$b + h$"],
            answers: ["$\\frac12 \\times b \\times h$"],
            why: "Half a parallelogram.",
            retry: {
              prompt: "A triangle's height must be",
              options: ["at right angles to the base", "the longest side", "any side"],
              answers: ["at right angles to the base"],
              why: "Perpendicular.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-area",
    id: "y7-area/parallelogram",
    before: PARALLELOGRAM,
    title: "The area of a parallelogram",
    summary: "Slide a corner across to make a rectangle: base times perpendicular height.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A sloping car park",
        text: [
          "A car park space is a parallelogram: 5 m along the kerb, and 2.4 m straight across. The slanted side is 3 m.",
          "What's its area? By the end of this lesson, you'll know which lengths to use.",
        ],
        picture: parallelogram(5, 2.4, 1.8, "5 m", "3 m", "2.4 m"),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "The area of a 5 m by 2.4 m rectangle",
        answers: ["12"],
        unit: "m²",
        hint: "$5 \\times 2.4$.",
        done: "12 m².",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A triangle: base 6 cm, height 4 cm. Its area?",
        answers: ["12"],
        unit: "cm²",
        hint: "$\\frac12 \\times 6 \\times 4$.",
        done: "12 cm².",
      },
      {
        kind: "morph",
        tag: "Discover",
        title: "Turn a parallelogram into a rectangle",
        text: "Cut the corner off, and slide it to the other end.",
        shape: "parallelogram",
        dims: [6, 4, 2],
        done: "It's now a 6 by 4 rectangle, with the same area: 24. So a parallelogram's area is **base × perpendicular height**.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Why not base × sloping side?",
        options: [
          {
            text: "The slope is longer than the height, so it would give too much",
            correct: true,
            feedback: "The rectangle you make is as tall as the height, not the slope.",
          },
          {
            text: "It would be the same",
            feedback: "The more it leans, the longer the slope, but the area doesn't grow.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Base 9 cm, height 4 cm",
        picture: parallelogram(9, 4, 2, "9 cm", "4.5 cm", "4 cm"),
        problem: "Find the area. The sloping side is 4.5 cm; the height is 4 cm.",
        steps: [
          { line: "Area $= b \\times h$", why: "Base times perpendicular height." },
          { line: "$9 \\times 4 = 36$ cm²", why: "Ignore the slope." },
        ],
        done: "36 cm².",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Base 7 cm, height 3 cm, slope 4 cm",
        picture: parallelogram(7, 3, 2.6, "7 cm", "4 cm", "3 cm"),
        start: "Which lengths?",
        stages: [
          {
            prompt: "Use",
            options: [
              { text: "7 and 3", correct: true, feedback: "" },
              { text: "7 and 4", feedback: "4 is the slope." },
            ],
            then: "$7 \\times 3$",
          },
          {
            prompt: "Area:",
            options: [
              { text: "21 cm²", correct: true, feedback: "" },
              { text: "10.5 cm²", feedback: "No half for a parallelogram." },
            ],
            then: "21 cm²",
          },
        ],
        done: "No half: that's triangles.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Finding a missing base",
        start: "A parallelogram has area 40 cm² and height 5 cm.",
        stages: [
          {
            prompt: "$b \\times 5 = 40$, so",
            options: [
              { text: "$b = 8$ cm", correct: true, feedback: "" },
              { text: "$b = 200$ cm", feedback: "Divide: $40 \\div 5$." },
            ],
            then: "8 cm",
          },
        ],
        done: "Work backwards with the inverse.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Base 12 cm, height 6 cm",
        picture: parallelogram(12, 6, 3, "12 cm", null, "6 cm"),
        answers: ["72"],
        unit: "cm²",
        wrong: [{ answer: "36", feedback: "No half for a parallelogram." }],
        hint: "$12 \\times 6$.",
        done: "72 cm².",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Base 8 m, height 2.5 m",
        answers: ["20"],
        unit: "m²",
        hint: "$8 \\times 2.5$.",
        done: "20 m².",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Base 10 cm, slope 6 cm, height 5 cm. Mia says the area is 60 cm². Is she right?",
        options: [
          {
            text: "No: use the height, so 50 cm²",
            correct: true,
            feedback:
              "The sloping side is the trap. The height is the perpendicular distance between the parallel sides.",
          },
          { text: "Yes", feedback: "60 uses the slope, 6 cm." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ben finds a parallelogram's area: base 6 cm, height 4 cm.",
        lines: [
          "Area = base × height",
          "$= 6 \\times 4 = 24$",
          "Halve it, like a triangle: 12 cm²",
        ],
        wrong: 2,
        why: "No halving: the slid-over rectangle has the whole area. 24 cm².",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "A sloping car park",
        text: "5 m along the kerb, 2.4 m straight across, 3 m slanted. What's the area?",
        picture: parallelogram(5, 2.4, 1.8, "5 m", "3 m", "2.4 m"),
        answers: ["12"],
        unit: "m²",
        wrong: [{ answer: "15", feedback: "That uses the slanted 3 m." }],
        hint: "$5 \\times 2.4$.",
        done: "12 m²: the same as a 5 m by 2.4 m rectangle.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Parallelogram: base 8 cm, height 5 cm. Area in cm²?",
            answers: ["40"],
            why: "$8 \\times 5$.",
            retry: {
              prompt: "Parallelogram: base 11 cm, height 4 cm. Area in cm²?",
              answers: ["44"],
              why: "$11 \\times 4$.",
            },
          },
          {
            prompt: "Parallelogram: base 6 cm, slope 5 cm, height 4 cm. Area in cm²?",
            answers: ["24"],
            why: "$6 \\times 4$.",
            retry: {
              prompt: "Parallelogram: base 9 cm, slope 7 cm, height 6 cm. Area in cm²?",
              answers: ["54"],
              why: "$9 \\times 6$.",
            },
          },
          {
            prompt: "A parallelogram has area 36 cm² and base 9 cm. Its height, in cm?",
            answers: ["4"],
            why: "$36 \\div 9$.",
            retry: {
              prompt: "A parallelogram has area 42 cm² and base 7 cm. Its height, in cm?",
              answers: ["6"],
              why: "$42 \\div 7$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-area",
    id: "y7-area/trapezium",
    before: TRAPEZIUM,
    title: "The area of a trapezium",
    summary:
      "Two trapezia make a parallelogram: half the sum of the parallel sides, times the height.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A garden bed",
        text: [
          "A flower bed is a trapezium: its parallel sides are 3 m and 7 m, 2 m apart. Compost covers 4 m² a bag.",
          "How many bags are needed? By the end of this lesson, you can find its area.",
        ],
        picture: trapezium(3, 7, 2, ["3 m", "7 m"]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3 + 7$?",
        answers: ["10"],
        hint: "Add.",
        done: "10.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A parallelogram: base 10 m, height 2 m. Its area?",
        answers: ["20"],
        unit: "m²",
        hint: "$10 \\times 2$.",
        done: "20 m².",
      },
      {
        kind: "morph",
        tag: "Discover",
        title: "Two trapezia",
        text: "Turn a copy of the trapezium round, and fit it on.",
        shape: "trapezium",
        dims: [3, 7, 4, 1],
        done: "Two trapezia make a parallelogram with base $3 + 7 = 10$ and height 4. One trapezium is half: $\\frac12(a + b)h = \\frac12 \\times 10 \\times 4 = 20$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The formula",
        text: [
          "Area of a trapezium $= \\frac12(a + b)h$: add the two parallel sides, multiply by the height, and halve.",
          "Or: the average of the parallel sides, times the height.",
        ],
        picture: { kind: "maths", tex: "A = \\tfrac12(a + b)h" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Parallel sides 5 and 9, height 4",
        picture: trapezium(5, 9, 4, ["5 cm", "9 cm"]),
        problem: "Find the area.",
        steps: [
          { line: "$a + b = 5 + 9 = 14$", why: "Add the parallel sides." },
          { line: "$14 \\times 4 = 56$", why: "Times the height." },
          { line: "$\\frac12 \\times 56 = 28$ cm²", why: "Halve: one trapezium of the two." },
        ],
        done: "28 cm².",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Parallel sides 4 and 10, height 3",
        start: "$\\frac12(4 + 10) \\times 3$",
        stages: [
          {
            prompt: "Bracket first:",
            options: [
              { text: "14", correct: true, feedback: "" },
              { text: "40", feedback: "Add the sides." },
            ],
            then: "$\\frac12 \\times 14 \\times 3$",
          },
          {
            prompt: "So",
            options: [
              { text: "21 cm²", correct: true, feedback: "" },
              { text: "42 cm²", feedback: "Don't forget the half." },
            ],
            then: "21 cm²",
          },
        ],
        done: "21 cm².",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Which sides?",
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 8, y: 0 },
            { x: 6, y: 3 },
            { x: 2, y: 3 },
          ],
          sides: ["8 cm", "3.6 cm", "4 cm", "3.6 cm"],
          dashed: [
            [
              { x: 2, y: 3 },
              { x: 2, y: 0 },
            ],
          ],
        },
        start: "Height 3 cm (dashed).",
        stages: [
          {
            prompt: "The parallel sides are",
            options: [
              { text: "8 cm and 4 cm", correct: true, feedback: "" },
              { text: "3.6 cm and 3.6 cm", feedback: "Those are the slanted sides." },
            ],
            then: "a = 4, b = 8",
          },
          {
            prompt: "Area:",
            options: [
              { text: "18 cm²", correct: true, feedback: "" },
              { text: "36 cm²", feedback: "Halve it." },
            ],
            then: "$\\frac12 \\times 12 \\times 3 = 18$ cm²",
          },
        ],
        done: "Parallel sides and the perpendicular height.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Parallel sides 6 cm and 10 cm, height 5 cm",
        picture: trapezium(6, 10, 5, ["6 cm", "10 cm"]),
        answers: ["40"],
        unit: "cm²",
        wrong: [{ answer: "80", feedback: "Halve it." }],
        hint: "$\\frac12 \\times 16 \\times 5$.",
        done: "40 cm².",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Parallel sides 2 m and 5 m, height 4 m",
        answers: ["14"],
        unit: "m²",
        hint: "$\\frac12 \\times 7 \\times 4$.",
        done: "14 m².",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Parallel sides 4 and 6, height 5. Zoe works out $\\frac12 \\times 4 + 6 \\times 5 = 32$. What's wrong?",
        options: [
          {
            text: "The sides need adding first, in a bracket: $\\frac12(4 + 6) \\times 5 = 25$",
            correct: true,
            feedback: "The bracket matters: add the parallel sides before multiplying.",
          },
          { text: "Nothing", feedback: "Without a bracket, only the 4 is halved." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "A trapezium has parallel sides 3 cm and 9 cm, slanted sides 5 cm, and height 4 cm.",
        lines: ["$a + b = 3 + 9 = 12$", "$\\frac12 \\times 12 \\times 5$", "$= 30$ cm²"],
        wrong: 1,
        why: "5 cm is the slanted side. Use the height, 4 cm: $\\frac12 \\times 12 \\times 4 = 24$ cm².",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "A garden bed",
        picture: trapezium(3, 7, 2, ["3 m", "7 m"]),
        start: "Parallel sides 3 m and 7 m, 2 m apart; 4 m² a bag.",
        stages: [
          {
            prompt: "Area:",
            options: [
              { text: "10 m²", correct: true, feedback: "" },
              { text: "20 m²", feedback: "Halve it." },
            ],
            then: "$\\frac12 \\times 10 \\times 2 = 10$ m²",
          },
          {
            prompt: "Bags:",
            options: [
              { text: "3", correct: true, feedback: "" },
              { text: "2.5", feedback: "Round up: you can't buy half a bag." },
            ],
            then: "3 bags",
          },
        ],
        done: "$10 \\div 4 = 2.5$: 3 bags.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Trapezium: parallel sides 4 cm and 8 cm, height 5 cm. Area in cm²?",
            answers: ["30"],
            why: "$\\frac12 \\times 12 \\times 5$.",
            retry: {
              prompt: "Trapezium: parallel sides 5 cm and 7 cm, height 4 cm. Area in cm²?",
              answers: ["24"],
              why: "$\\frac12 \\times 12 \\times 4$.",
            },
          },
          {
            prompt: "Trapezium: parallel sides 3 m and 11 m, height 2 m. Area in m²?",
            answers: ["14"],
            why: "$\\frac12 \\times 14 \\times 2$.",
            retry: {
              prompt: "Trapezium: parallel sides 6 m and 10 m, height 3 m. Area in m²?",
              answers: ["24"],
              why: "$\\frac12 \\times 16 \\times 3$.",
            },
          },
          {
            prompt: "The area of a trapezium is",
            options: ["$\\frac12(a + b)h$", "$(a + b)h$", "$abh$"],
            answers: ["$\\frac12(a + b)h$"],
            why: "Half of the two-trapezium parallelogram.",
            retry: {
              prompt: "In the trapezium formula, a and b are",
              options: ["the parallel sides", "the slanted sides", "the height and base"],
              answers: ["the parallel sides"],
              why: "The two parallel sides.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-area",
    id: "y7-area/cuboid",
    before: CUBOID,
    title: "The volume of a cuboid",
    summary: "Count the cubes in a layer, then the layers: length × width × height.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Filling a fish tank",
        text: [
          "A fish tank is 50 cm long, 30 cm wide and 40 cm tall. Each 1000 cm³ holds a litre of water.",
          "How many litres does it hold? By the end of this lesson, you can work it out.",
        ],
        picture: { kind: "cuboid", w: 5, d: 3, h: 4, labels: ["50 cm", "30 cm", "40 cm"] },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $4 \\times 3$?",
        answers: ["12"],
        hint: "Four threes.",
        done: "12.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $12 \\times 5$?",
        answers: ["60"],
        hint: "Twelve fives.",
        done: "60.",
      },
      {
        kind: "morph",
        tag: "Discover",
        title: "Build a cuboid",
        text: "Stack the layers of cubes.",
        shape: "cuboid",
        dims: [4, 3, 5],
        done: "Each layer has $4 \\times 3 = 12$ cubes, and there are 5 layers: 60 cubes. **Volume = length × width × height.**",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Cubic units",
        text: [
          "Volume counts cubes: 1 cm by 1 cm by 1 cm is 1 cm³. So volume is in **cubic** units.",
          "A cube has all edges equal, so its volume is the edge cubed: $s^3$.",
        ],
        picture: { kind: "cuboid", w: 3, d: 3, h: 3, cubes: true },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "6 cm by 2 cm by 3 cm",
        picture: { kind: "cuboid", w: 6, d: 2, h: 3, labels: ["6 cm", "2 cm", "3 cm"] },
        problem: "Find the volume.",
        steps: [
          { line: "One layer: $6 \\times 2 = 12$ cubes", why: "Length × width." },
          { line: "3 layers: $12 \\times 3 = 36$ cm³", why: "× height." },
        ],
        done: "36 cm³.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A cube with edges of 5 cm",
        start: "$5 \\times 5 \\times 5$",
        stages: [
          {
            prompt: "One layer:",
            options: [
              { text: "25", correct: true, feedback: "" },
              { text: "10", feedback: "Multiply: $5 \\times 5$." },
            ],
            then: "25",
          },
          {
            prompt: "Volume:",
            options: [
              { text: "125 cm³", correct: true, feedback: "" },
              { text: "15 cm³", feedback: "Multiply all three." },
            ],
            then: "125 cm³",
          },
        ],
        done: "$5^3 = 125$ cm³.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A missing length",
        start: "A cuboid has volume 60 cm³; its base is 5 cm by 3 cm.",
        stages: [
          {
            prompt: "One layer is",
            options: [
              { text: "15 cubes", correct: true, feedback: "" },
              { text: "8 cubes", feedback: "$5 \\times 3$." },
            ],
            then: "15",
          },
          {
            prompt: "So the height is",
            options: [
              { text: "4 cm", correct: true, feedback: "" },
              { text: "45 cm", feedback: "$60 \\div 15$." },
            ],
            then: "4 cm",
          },
        ],
        done: "Work backwards with ÷.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A 6 cm by 2 cm by 3 cm cuboid",
        picture: { kind: "cuboid", w: 6, d: 2, h: 3, labels: ["6 cm", "2 cm", "3 cm"] },
        answers: ["36"],
        unit: "cm³",
        wrong: [{ answer: "11", feedback: "Multiply, don't add." }],
        hint: "$6 \\times 2 \\times 3$.",
        done: "36 cm³.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A cube with edges of 4 cm",
        answers: ["64"],
        unit: "cm³",
        wrong: [{ answer: "12", feedback: "$4 \\times 4 \\times 4$, not $4 \\times 3$." }],
        hint: "$4^3$.",
        done: "64 cm³.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Tia gives a cuboid's volume as 24 cm². What's wrong?",
        options: [
          {
            text: "Volume is in cubic units: cm³",
            correct: true,
            feedback: "cm² is for area (flat squares); cm³ for volume (cubes).",
          },
          { text: "Nothing", feedback: "Volume counts cubes: cm³." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Jay finds the volume of a 4 cm by 5 cm by 2 cm cuboid.",
        lines: ["Volume = length × width × height", "$= 4 + 5 + 2$", "$= 11$ cm³"],
        wrong: 1,
        why: "Multiply: $4 \\times 5 \\times 2 = 40$ cm³.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Filling a fish tank",
        start: "50 cm by 30 cm by 40 cm; 1000 cm³ is 1 litre.",
        stages: [
          {
            prompt: "Volume:",
            options: [
              { text: "60 000 cm³", correct: true, feedback: "" },
              { text: "120 cm³", feedback: "Multiply all three." },
            ],
            then: "60 000 cm³",
          },
          {
            prompt: "In litres:",
            options: [
              { text: "60 litres", correct: true, feedback: "" },
              { text: "600 litres", feedback: "÷ 1000." },
            ],
            then: "60 litres",
          },
        ],
        done: "60 litres of water.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Volume of a 5 cm by 4 cm by 3 cm cuboid, in cm³?",
            answers: ["60"],
            why: "$5 \\times 4 \\times 3$.",
            retry: {
              prompt: "Volume of a 6 cm by 5 cm by 2 cm cuboid, in cm³?",
              answers: ["60"],
              why: "$6 \\times 5 \\times 2$.",
            },
          },
          {
            prompt: "Volume of a cube with edges of 3 cm, in cm³?",
            answers: ["27"],
            why: "$3^3$.",
            retry: {
              prompt: "Volume of a cube with edges of 10 cm, in cm³?",
              answers: ["1000"],
              why: "$10^3$.",
            },
          },
          {
            prompt: "A cuboid has volume 48 cm³ and base 4 cm by 3 cm. Its height, in cm?",
            answers: ["4"],
            why: "$48 \\div 12$.",
            retry: {
              prompt: "A cuboid has volume 70 cm³ and base 5 cm by 2 cm. Its height, in cm?",
              answers: ["7"],
              why: "$70 \\div 10$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-area",
    id: "y7-area/prism",
    before: PRISM,
    title: "The volume of a prism",
    summary: "A prism is the same shape all the way through: area of the end × length.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A tent",
        text: [
          "A tent is a triangular prism. Its end is a triangle 2 m wide and 1.5 m tall, and the tent is 3 m long.",
          "How much space is inside? By the end of this lesson, you can work it out.",
        ],
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 4, y: 0 },
            { x: 2, y: 3 },
          ],
          sides: ["2 m", null, null],
          dashed: [
            [
              { x: 2, y: 3 },
              { x: 2, y: 0 },
            ],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Area of a triangle, base 2 m, height 1.5 m",
        answers: ["1.5"],
        unit: "m²",
        hint: "$\\frac12 \\times 2 \\times 1.5$.",
        done: "1.5 m².",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Volume of a 4 by 3 by 5 cuboid",
        answers: ["60"],
        hint: "Multiply.",
        done: "60.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Prisms",
        text: [
          "A **prism** has the same shape, its **cross-section**, all the way through, like a stick of rock.",
          "Its volume is the area of the cross-section × its length: the cuboid's layers again.",
        ],
        picture: { kind: "cuboid", w: 6, d: 2, h: 3 },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "A cuboid is a prism. Its cross-section is",
        options: [
          {
            text: "a rectangle",
            correct: true,
            feedback: "Area of the rectangle × length: the formula you already know.",
          },
          { text: "a triangle", feedback: "Slice a cuboid: the face is a rectangle." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A triangular prism",
        problem: "The end is a triangle, base 4 cm, height 3 cm. The prism is 10 cm long.",
        steps: [
          {
            line: "Cross-section: $\\frac12 \\times 4 \\times 3 = 6$ cm²",
            why: "Area of the end.",
          },
          { line: "Volume: $6 \\times 10 = 60$ cm³", why: "× length." },
        ],
        done: "60 cm³.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "An L-shaped prism",
        start: "The cross-section has area 14 cm²; the prism is 5 cm long.",
        stages: [
          {
            prompt: "Volume:",
            options: [
              { text: "70 cm³", correct: true, feedback: "" },
              { text: "19 cm³", feedback: "Multiply, don't add." },
            ],
            then: "70 cm³",
          },
        ],
        done: "Any shape of cross-section: area × length.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A trapezium prism",
        start: "The end is a trapezium: parallel sides 2 and 6 cm, height 3 cm. Length 8 cm.",
        stages: [
          {
            prompt: "Cross-section:",
            options: [
              { text: "12 cm²", correct: true, feedback: "" },
              { text: "24 cm²", feedback: "Halve: $\\frac12 \\times 8 \\times 3$." },
            ],
            then: "12 cm²",
          },
          {
            prompt: "Volume:",
            options: [
              { text: "96 cm³", correct: true, feedback: "" },
              { text: "20 cm³", feedback: "Multiply by 8." },
            ],
            then: "96 cm³",
          },
        ],
        done: "Area of the end, times the length.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Triangle end: base 6 cm, height 4 cm; length 10 cm",
        answers: ["120"],
        unit: "cm³",
        wrong: [{ answer: "240", feedback: "The triangle's area needs halving: 12 cm²." }],
        hint: "End: $\\frac12 \\times 6 \\times 4 = 12$.",
        done: "$12 \\times 10 = 120$ cm³.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Cross-section 9 cm², length 7 cm",
        answers: ["63"],
        unit: "cm³",
        hint: "$9 \\times 7$.",
        done: "63 cm³.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "A triangular prism: base 4, height 3, length 10. Kai multiplies $4 \\times 3 \\times 10 = 120$ cm³. Is he right?",
        options: [
          {
            text: "No: the triangle's area is half, so 60 cm³",
            correct: true,
            feedback: "Find the cross-section's area properly first: for a triangle, halve.",
          },
          { text: "Yes", feedback: "$4 \\times 3$ is the rectangle round the triangle." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ola finds a prism's volume: cross-section 15 cm², length 4 cm.",
        lines: ["Volume = cross-section × length", "$15 \\times 4 = 60$", "So 60 cm²"],
        wrong: 2,
        why: "Volume is in cm³: 60 cm³.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "A tent",
        start: "End: base 2 m, height 1.5 m. Length 3 m.",
        stages: [
          {
            prompt: "Cross-section:",
            options: [
              { text: "1.5 m²", correct: true, feedback: "" },
              { text: "3 m²", feedback: "Halve: it's a triangle." },
            ],
            then: "1.5 m²",
          },
          {
            prompt: "Volume:",
            options: [
              { text: "4.5 m³", correct: true, feedback: "" },
              { text: "6.5 m³", feedback: "Multiply: $1.5 \\times 3$." },
            ],
            then: "4.5 m³",
          },
        ],
        done: "4.5 m³ of space inside.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A prism has cross-section 8 cm² and length 6 cm. Volume in cm³?",
            answers: ["48"],
            why: "$8 \\times 6$.",
            retry: {
              prompt: "A prism has cross-section 12 cm² and length 5 cm. Volume in cm³?",
              answers: ["60"],
              why: "$12 \\times 5$.",
            },
          },
          {
            prompt: "Triangular prism: end base 5 cm, height 4 cm, length 10 cm. Volume in cm³?",
            answers: ["100"],
            why: "$10 \\times 10$.",
            retry: {
              prompt: "Triangular prism: end base 6 cm, height 2 cm, length 5 cm. Volume in cm³?",
              answers: ["30"],
              why: "$6 \\times 5$.",
            },
          },
          {
            prompt: "The volume of a prism is",
            options: ["cross-section area × length", "length × width", "perimeter × length"],
            answers: ["cross-section area × length"],
            why: "Layers of the cross-section.",
            retry: {
              prompt: "A prism's cross-section is",
              options: ["the same all the way through", "a triangle, always", "its biggest face"],
              answers: ["the same all the way through"],
              why: "That's what makes it a prism.",
            },
          },
        ],
      },
    ],
  },
];
