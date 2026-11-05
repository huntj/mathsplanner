// Year 8, "Circles and area", as three short lessons, one just before each skill: spotting π in a
// table of circles to find the circumference, slicing a circle and laying out the slices to see
// why its area is πr², and splitting composite shapes into pieces. Each starts from something
// quick, builds the idea a step at a time, names the common mistakes, and ends on an exit check.
import type { DrawingPic, Picture, UnitLesson } from "./types.ts";

type DrawItem = DrawingPic["items"][number];

const CIRCUMFERENCE = "Y8-GEO-01.a";
const AREA = "Y8-GEO-01.b";
const COMPOSITE = "Y8-GEO-01.c";

const circle = (cx: number, cy: number, r: number): DrawItem[] => [
  { arc: { x: cx, y: cy }, r, from: 0, to: 180 },
  { arc: { x: cx, y: cy }, r, from: 180, to: 360 },
];

/** A circle with its diameter, or its radius, drawn and labelled. */
function measured(across: "d" | "r", label: string): Picture {
  return {
    kind: "drawing",
    items: [
      ...circle(0, 0, 3),
      {
        line: [
          { x: across === "d" ? -3 : 0, y: 0 },
          { x: 3, y: 0 },
        ],
        tone: "find",
      },
      { dot: { x: 0, y: 0 } },
      { text: label, at: { x: across === "d" ? 0 : 1.5, y: 0.45 }, tone: "find" },
    ],
  };
}

const L_POINTS = [
  { x: 0, y: 0 },
  { x: 8, y: 0 },
  { x: 8, y: 3 },
  { x: 3, y: 3 },
  { x: 3, y: 7 },
  { x: 0, y: 7 },
];

const ROUND_END: Picture = {
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
    { text: "10 m", at: { x: 5, y: -0.7 } },
    { text: "4 m", at: { x: -1, y: 2 } },
  ],
};

export const y8Area: UnitLesson[] = [
  {
    unit: "y8-area",
    id: "y8-area/circumference",
    before: CIRCUMFERENCE,
    title: "Round the outside",
    summary: "Every circle's circumference is π times its diameter.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A bike wheel",
        text: [
          "A bike wheel is 60 cm across. Each time it turns once, how far does the bike move?",
          "That's the distance round the wheel. You can't measure a curve with a ruler, but by the end of this lesson, you can work it out.",
        ],
        picture: measured("d", "60 cm"),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A circle's radius is 4 cm. What is its diameter?",
        answers: ["8"],
        unit: "cm",
        hint: "The diameter goes all the way across: two radii.",
        done: "The diameter is twice the radius: 8 cm.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $3.14 \\times 10$",
        answers: ["31.4"],
        hint: "Times 10 moves the digits one place.",
        done: "31.4.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Round the outside",
        text: [
          "The distance round a circle is its **circumference**, C. The distance across, through the middle, is its **diameter**, d.",
          "The **radius**, r, is half the diameter: from the middle to the edge.",
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
        tag: "Discover",
        title: "Spot the pattern",
        text: "Some circles were measured with string. What is C ÷ d for the wheel?",
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
              "$188 \\div 60 = 3.13$. Every circle's circumference is a bit more than 3 times its diameter: about 3.14. That number is **π** (pi).",
          },
          { text: "About 6", feedback: "Work it out: $188 \\div 60$." },
          { text: "60", feedback: "That is the diameter. Divide the circumference by it." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "π",
        text: [
          "C ÷ d is the same for every circle, big or small: **π = 3.14159…** Its digits never end or repeat.",
          "So $C = \\pi d$. Because $d = 2r$, that's also $C = 2\\pi r$. Use the π button on your calculator.",
        ],
        picture: { kind: "maths", tex: "C = \\pi d = 2\\pi r" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Diameter 10 cm",
        problem: "Find the circumference of a circle with diameter 10 cm, to 1 decimal place.",
        steps: [
          { line: "$C = \\pi d$", why: "We know the diameter." },
          { line: "$C = \\pi \\times 10 = 31.415\\ldots$", why: "Use the π button." },
          { line: "$C = 31.4$ cm", why: "Round to 1 decimal place." },
        ],
        done: "Just over 3 diameters: 31.4 cm.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Radius 4 cm",
        start: "A circle has radius 4 cm.",
        stages: [
          {
            prompt: "First, the diameter is",
            options: [
              { text: "8 cm", correct: true, feedback: "" },
              { text: "2 cm", feedback: "The diameter is twice the radius." },
            ],
            then: "$d = 8$ cm",
          },
          {
            prompt: "So the circumference, to 1 decimal place, is",
            options: [
              { text: "25.1 cm", correct: true, feedback: "" },
              { text: "12.6 cm", feedback: "That's $\\pi \\times 4$: use the diameter, 8." },
            ],
            then: "$C = \\pi \\times 8 = 25.1$ cm",
          },
        ],
        done: "Given the radius, double it, or use $C = 2\\pi r$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Half a circle's curve",
        start: "A semicircle has diameter 6 cm. How long is its curved edge?",
        stages: [
          {
            prompt: "The whole circle's circumference is",
            options: [
              { text: "$\\pi \\times 6 = 18.85$ cm", correct: true, feedback: "" },
              { text: "$\\pi \\times 3 = 9.42$ cm", feedback: "C = πd, and d is 6." },
            ],
            then: "18.85 cm",
          },
          {
            prompt: "The curved edge of a semicircle is",
            options: [
              { text: "half of it: 9.4 cm", correct: true, feedback: "" },
              { text: "all of it: 18.9 cm", feedback: "A semicircle is half a circle." },
            ],
            then: "9.4 cm",
          },
        ],
        done: "Its whole perimeter adds the straight edge too: $9.4 + 6 = 15.4$ cm.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Diameter 20 cm",
        text: "Find the circumference, to 1 decimal place.",
        answers: ["62.8"],
        unit: "cm",
        wrong: [
          { answer: "125.7", feedback: "That doubles it. $C = \\pi d$, and d is already 20." },
        ],
        hint: "$C = \\pi \\times 20$.",
        done: "$\\pi \\times 20 = 62.8$ cm.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Radius 7 cm",
        text: "Find the circumference, to 1 decimal place.",
        answers: ["44"],
        unit: "cm",
        wrong: [{ answer: "22", feedback: "That uses the radius. Double it: d = 14." }],
        hint: "$C = 2 \\times \\pi \\times 7$.",
        done: "$\\pi \\times 14 = 44.0$ cm.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "A circle has radius 5 cm. Tom works out $\\pi \\times 5 = 15.7$ cm. What's wrong?",
        options: [
          {
            text: "C = πd: he needs the diameter, 10 cm",
            correct: true,
            feedback:
              "$\\pi \\times 10 = 31.4$ cm. Always check: is it the radius or the diameter?",
          },
          { text: "Nothing", feedback: "πr is only half the circumference." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Isla finds the circumference of a circle with diameter 8 cm.",
        lines: ["$C = \\pi d$", "$C = \\pi \\times 8^2$", "$C = 201.1$ cm"],
        wrong: 1,
        why: "Circumference doesn't square anything: $C = \\pi \\times 8 = 25.1$ cm.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The bike wheel, 60 cm across",
        text: "How far does the bike move each time the wheel turns once? To the nearest cm.",
        answers: ["188"],
        unit: "cm",
        wrong: [{ answer: "377", feedback: "60 cm is the diameter already." }],
        hint: "$C = \\pi \\times 60$.",
        done: "$\\pi \\times 60 = 188$ cm: nearly 2 m every turn.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Circumference of a circle with diameter 5 cm, to 1 d.p.?",
            options: ["15.7 cm", "31.4 cm", "78.5 cm"],
            answers: ["15.7 cm"],
            why: "$\\pi \\times 5 = 15.7$.",
            retry: {
              prompt: "Circumference of a circle with diameter 3 cm, to 1 d.p.?",
              options: ["9.4 cm", "18.8 cm", "28.3 cm"],
              answers: ["9.4 cm"],
              why: "$\\pi \\times 3 = 9.4$.",
            },
          },
          {
            prompt: "Circumference of a circle with radius 10 cm, to 1 d.p.?",
            options: ["62.8 cm", "31.4 cm", "314.2 cm"],
            answers: ["62.8 cm"],
            why: "d = 20, and $\\pi \\times 20 = 62.8$.",
            retry: {
              prompt: "Circumference of a circle with radius 2 cm, to 1 d.p.?",
              options: ["12.6 cm", "6.3 cm", "12.5 cm"],
              answers: ["12.6 cm"],
              why: "d = 4, and $\\pi \\times 4 = 12.6$.",
            },
          },
          {
            prompt: "For every circle, C ÷ d is",
            options: ["π, about 3.14", "2", "the radius"],
            answers: ["π, about 3.14"],
            why: "That's what π is.",
            retry: {
              prompt: "π is about",
              options: ["3.14", "2.14", "3.41"],
              answers: ["3.14"],
              why: "π = 3.14159…",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-area",
    id: "y8-area/circle-area",
    before: AREA,
    title: "Inside a circle",
    summary: "Slice a circle and lay it out: its area is πr².",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A round rug",
        text: [
          "A round rug has a radius of 1.5 m. How much floor does it cover?",
          "You can't count squares exactly on a curve. By the end of this lesson, you can work it out, and see why the formula works.",
        ],
        picture: measured("r", "1.5 m"),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $5^2$",
        answers: ["25"],
        wrong: [{ answer: "10", feedback: "$5^2$ is $5 \\times 5$, not $5 \\times 2$." }],
        hint: "$5 \\times 5$.",
        done: "$5^2 = 25$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A rectangle is 6 cm by 3 cm. What is its area?",
        answers: ["18"],
        unit: "cm²",
        hint: "Length times width.",
        done: "$6 \\times 3 = 18$ cm².",
      },
      {
        kind: "morph",
        tag: "Discover",
        title: "Slice the circle",
        text: "Cut the circle into slices, and lay them out in a row, pointing up and down in turn.",
        shape: "circle",
        dims: [2, 16],
        done: "The slices make nearly a rectangle.",
      },
      {
        kind: "steps",
        tag: "Discover",
        title: "The rectangle's sides",
        start: "The slices make nearly a rectangle.",
        stages: [
          {
            prompt: "Its height is one slice, from the middle to the edge:",
            options: [
              { text: "the radius, r", correct: true, feedback: "" },
              {
                text: "the diameter, d",
                feedback: "A slice only goes from the middle to the edge.",
              },
            ],
            then: "Height $= r$",
          },
          {
            prompt: "Half the curved edges are on top, half on the bottom. So its length is",
            options: [
              { text: "half the circumference, $\\pi r$", correct: true, feedback: "" },
              {
                text: "the whole circumference, $2\\pi r$",
                feedback: "Only half the curve is along each long side.",
              },
            ],
            then: "Length $= \\pi r$",
          },
        ],
        done: "Area $= \\pi r \\times r = \\pi r^2$.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Radius 5 cm",
        problem: "Find the area of a circle with radius 5 cm, to 1 decimal place.",
        steps: [
          { line: "$A = \\pi r^2$", why: "We know the radius." },
          { line: "$A = \\pi \\times 25$", why: "Square the radius first: $5^2 = 25$." },
          { line: "$A = 78.5$ cm²", why: "Use the π button, then round." },
        ],
        done: "Square first, then times by π.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Diameter 6 cm",
        start: "A circle has diameter 6 cm. Find its area.",
        stages: [
          {
            prompt: "First, the radius is",
            options: [
              { text: "3 cm", correct: true, feedback: "" },
              { text: "12 cm", feedback: "The radius is half the diameter." },
            ],
            then: "$r = 3$",
          },
          {
            prompt: "So the area, to 1 decimal place, is",
            options: [
              { text: "$\\pi \\times 9 = 28.3$ cm²", correct: true, feedback: "" },
              {
                text: "$\\pi \\times 36 = 113.1$ cm²",
                feedback: "That squares the diameter. Use r = 3.",
              },
            ],
            then: "$A = 28.3$ cm²",
          },
        ],
        done: "Area uses the **radius**: halve a diameter first.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A semicircle",
        start: "A semicircle has radius 4 cm.",
        stages: [
          {
            prompt: "The whole circle's area is",
            options: [
              { text: "$\\pi \\times 16 = 50.3$ cm²", correct: true, feedback: "" },
              { text: "$\\pi \\times 8 = 25.1$ cm²", feedback: "$4^2 = 16$, not 8." },
            ],
            then: "50.3 cm²",
          },
          {
            prompt: "So the semicircle is",
            options: [
              { text: "25.1 cm²", correct: true, feedback: "" },
              { text: "100.5 cm²", feedback: "A semicircle is half: divide by 2." },
            ],
            then: "25.1 cm²",
          },
        ],
        done: "Half the circle: $\\frac12 \\pi r^2$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Radius 10 cm",
        text: "Find the area, to 1 decimal place.",
        answers: ["314.2"],
        unit: "cm²",
        wrong: [
          { answer: "62.8", feedback: "That is the circumference. The area is $\\pi r^2$." },
          { answer: "31.4", feedback: "Square the radius: $10^2 = 100$." },
        ],
        hint: "$\\pi \\times 10^2$.",
        done: "$\\pi \\times 100 = 314.2$ cm².",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Diameter 8 cm",
        text: "Find the area, to 1 decimal place.",
        answers: ["50.3"],
        unit: "cm²",
        wrong: [{ answer: "201.1", feedback: "That squares the diameter. Halve it first: r = 4." }],
        hint: "Radius first.",
        done: "$\\pi \\times 16 = 50.3$ cm².",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Radius 3 cm. Nia works out $\\pi \\times 3 \\times 2 = 18.8$ cm². What's wrong?",
        options: [
          {
            text: "$r^2$ means $3 \\times 3$, not $3 \\times 2$",
            correct: true,
            feedback: "$\\pi \\times 9 = 28.3$ cm². And 18.8 is the circumference, in cm, not cm².",
          },
          { text: "Nothing", feedback: "Squaring is times by itself." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Dev finds the area of a circle with radius 6 cm.",
        lines: ["$A = \\pi r^2$", "$\\pi \\times 6 = 18.85$", "$18.85^2 = 355.3$ cm²"],
        wrong: 1,
        why: "Only r is squared. Square 6 first: $\\pi \\times 36 = 113.1$ cm².",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The round rug, radius 1.5 m",
        text: "How much floor does it cover? Give your answer to 1 decimal place.",
        answers: ["7.1"],
        unit: "m²",
        wrong: [{ answer: "9.4", feedback: "That is the circumference. Area is $\\pi r^2$." }],
        hint: "$\\pi \\times 1.5^2 = \\pi \\times 2.25$.",
        done: "$\\pi \\times 2.25 = 7.1$ m².",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Area of a circle with radius 2 cm, to 1 d.p.?",
            options: ["12.6 cm²", "6.3 cm²", "39.5 cm²"],
            answers: ["12.6 cm²"],
            why: "$\\pi \\times 4 = 12.6$.",
            retry: {
              prompt: "Area of a circle with radius 3 cm, to 1 d.p.?",
              options: ["28.3 cm²", "18.8 cm²", "88.8 cm²"],
              answers: ["28.3 cm²"],
              why: "$\\pi \\times 9 = 28.3$.",
            },
          },
          {
            prompt: "Area of a circle with diameter 10 cm, to 1 d.p.?",
            options: ["78.5 cm²", "314.2 cm²", "31.4 cm²"],
            answers: ["78.5 cm²"],
            why: "r = 5, and $\\pi \\times 25 = 78.5$.",
            retry: {
              prompt: "Area of a circle with diameter 4 cm, to 1 d.p.?",
              options: ["12.6 cm²", "50.3 cm²", "12.5 cm²"],
              answers: ["12.6 cm²"],
              why: "r = 2, and $\\pi \\times 4 = 12.6$.",
            },
          },
          {
            prompt: "Area of a semicircle with radius 2 cm, to 1 d.p.?",
            options: ["6.3 cm²", "12.6 cm²", "3.1 cm²"],
            answers: ["6.3 cm²"],
            why: "Half of $\\pi \\times 4$.",
            retry: {
              prompt: "Area of a semicircle with radius 6 cm, to 1 d.p.?",
              options: ["56.5 cm²", "113.1 cm²", "18.8 cm²"],
              answers: ["56.5 cm²"],
              why: "Half of $\\pi \\times 36$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-area",
    id: "y8-area/composite",
    before: COMPOSITE,
    title: "Shapes in pieces",
    summary: "Split a shape into pieces you know, then add or take away.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A garden lawn",
        text: [
          "A lawn is a 10 m by 4 m rectangle with a semicircle on one end. How much grass seed do you need?",
          "It isn't a shape with one formula. By the end of this lesson, you can find its area anyway.",
        ],
        picture: ROUND_END,
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A rectangle is 8 cm by 3 cm. What's its area?",
        answers: ["24"],
        unit: "cm²",
        hint: "Length times width.",
        done: "24 cm².",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $8 - 3$?",
        text: "You'll use this to find a missing side.",
        answers: ["5"],
        hint: "Take 3 from 8.",
        done: "5.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Split it up",
        text: [
          "Split a shape into pieces you know: rectangles, triangles, circles. Find each piece's area, then add them.",
          "Or, find a big shape's area and take away the missing piece.",
        ],
        picture: {
          kind: "shape",
          points: L_POINTS,
          dashed: [
            [
              { x: 0, y: 3 },
              { x: 3, y: 3 },
            ],
          ],
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Missing sides",
        text: "The L-shape is 8 cm wide at the bottom and 3 cm wide at the top. How long is the short top edge on the right?",
        picture: {
          kind: "shape",
          points: L_POINTS,
          sides: ["8 cm", "3 cm", "?", null, "3 cm", "7 cm"],
        },
        options: [
          {
            text: "5 cm",
            correct: true,
            feedback: "The whole width, 8, take away the top part, 3.",
          },
          { text: "8 cm", feedback: "Part of the 8 cm is taken by the top piece." },
          { text: "3 cm", feedback: "That's the top piece. What's left of the 8?" },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "The L-shape's area",
        problem: "Find the area of the L-shape.",
        picture: {
          kind: "shape",
          points: L_POINTS,
          sides: ["8 cm", "3 cm", null, null, "3 cm", "7 cm"],
          dashed: [
            [
              { x: 0, y: 3 },
              { x: 3, y: 3 },
            ],
          ],
        },
        steps: [
          { line: "Bottom: $8 \\times 3 = 24$", why: "The wide rectangle." },
          { line: "Top: $3 \\times 4 = 12$", why: "Its height is $7 - 3 = 4$." },
          { line: "Total: $24 + 12 = 36$ cm²", why: "Add the pieces." },
        ],
        done: "Split, find each piece, add.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "The L-shape's perimeter",
        picture: {
          kind: "shape",
          points: L_POINTS,
          sides: ["8 cm", "3 cm", "?", "?", "3 cm", "7 cm"],
        },
        start: "Two sides are missing.",
        stages: [
          {
            prompt: "The missing sides are",
            options: [
              { text: "5 cm and 4 cm", correct: true, feedback: "" },
              { text: "3 cm and 3 cm", feedback: "$8 - 3 = 5$ across; $7 - 3 = 4$ up." },
            ],
            then: "Sides: 8, 3, 5, 4, 3, 7",
          },
          {
            prompt: "Add all six:",
            options: [
              { text: "30 cm", correct: true, feedback: "" },
              { text: "21 cm", feedback: "Include the two missing sides." },
            ],
            then: "Perimeter = 30 cm",
          },
        ],
        done: "Perimeter goes all the way round: find every side first.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Rectangle and semicircle",
        picture: ROUND_END,
        start: "A 10 m by 4 m rectangle with a semicircle on the end.",
        stages: [
          {
            prompt: "The rectangle is $10 \\times 4 = 40$ m². The semicircle's radius is",
            options: [
              { text: "2 m", correct: true, feedback: "" },
              { text: "4 m", feedback: "4 m is the diameter, across the end." },
            ],
            then: "$r = 2$",
          },
          {
            prompt: "The semicircle's area is",
            options: [
              { text: "$\\frac12 \\pi \\times 4 = 6.3$ m²", correct: true, feedback: "" },
              { text: "$\\pi \\times 4 = 12.6$ m²", feedback: "That's a whole circle. Halve it." },
            ],
            then: "$40 + 6.3 = 46.3$ m²",
          },
        ],
        done: "Add the pieces: 46.3 m².",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Take a piece away",
        text: "A 10 cm by 6 cm rectangle has a 2 cm by 2 cm square cut from one corner. Find the area left.",
        answers: ["56"],
        unit: "cm²",
        wrong: [{ answer: "64", feedback: "Take the square away; don't add it." }],
        hint: "$10 \\times 6$, take away $2 \\times 2$.",
        done: "$60 - 4 = 56$ cm².",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A square with a hole",
        text: "A 10 cm square tile has a circular hole of radius 2 cm. Find the area left, to 1 decimal place.",
        answers: ["87.4"],
        unit: "cm²",
        wrong: [{ answer: "112.6", feedback: "The hole is missing: take it away." }],
        hint: "$100 - \\pi \\times 2^2$.",
        done: "$100 - 12.6 = 87.4$ cm².",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Finn finds the L-shape's area as $8 \\times 7 = 56$ cm². What's wrong?",
        picture: {
          kind: "shape",
          points: L_POINTS,
          sides: ["8 cm", "3 cm", null, null, "3 cm", "7 cm"],
        },
        options: [
          {
            text: "That counts the missing corner too",
            correct: true,
            feedback:
              "$8 \\times 7$ is the box around it. Take away the empty 5 by 4 corner: $56 - 20 = 36$.",
          },
          { text: "Nothing", feedback: "There's an empty corner inside that 8 by 7 box." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Gus finds the perimeter of the rectangle with a semicircle end, 10 m by 4 m.",
        lines: [
          "Straight sides: $10 + 10 + 4 = 24$ m",
          "Curve: $\\pi \\times 4 = 12.6$ m",
          "Perimeter: $24 + 12.6 = 36.6$ m",
        ],
        wrong: 1,
        why: "The end is a semicircle, so only half the circumference: $6.3$ m. Perimeter $= 24 + 6.3 = 30.3$ m.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The lawn",
        text: "A 10 m by 4 m rectangle with a semicircle on one end. Find its area, to 1 decimal place.",
        picture: ROUND_END,
        answers: ["46.3"],
        unit: "m²",
        wrong: [{ answer: "52.6", feedback: "The end is a semicircle, not a whole circle." }],
        hint: "$40 + \\frac12 \\pi \\times 2^2$.",
        done: "$40 + 6.3 = 46.3$ m² of grass seed.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A 6 cm by 4 cm rectangle has a 2 by 2 square on top. Total area?",
            options: ["28 cm²", "24 cm²", "20 cm²"],
            answers: ["28 cm²"],
            why: "$24 + 4 = 28$.",
            retry: {
              prompt: "A 5 cm by 3 cm rectangle has a 3 by 3 square on top. Total area?",
              options: ["24 cm²", "15 cm²", "6 cm²"],
              answers: ["24 cm²"],
              why: "$15 + 9 = 24$.",
            },
          },
          {
            prompt: "A 10 by 10 square with a 3 by 3 square cut out. Area left?",
            options: ["91", "109", "70"],
            answers: ["91"],
            why: "$100 - 9 = 91$.",
            retry: {
              prompt: "An 8 by 5 rectangle with a 2 by 2 square cut out. Area left?",
              options: ["36", "44", "32"],
              answers: ["36"],
              why: "$40 - 4 = 36$.",
            },
          },
          {
            prompt: "An L-shape fits in a 9 by 6 box. Its missing corner is 4 by 2. Area?",
            options: ["46", "54", "62"],
            answers: ["46"],
            why: "$54 - 8 = 46$.",
            retry: {
              prompt: "An L-shape fits in a 7 by 5 box. Its missing corner is 3 by 2. Area?",
              options: ["29", "35", "41"],
              answers: ["29"],
              why: "$35 - 6 = 29$.",
            },
          },
        ],
      },
    ],
  },
];
