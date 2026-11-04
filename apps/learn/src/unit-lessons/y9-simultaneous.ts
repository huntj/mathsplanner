// Year 9, "Simultaneous equations and inequalities": two clues with two unknowns, solved by
// taking one equation from the other, by substitution, and seen as where two lines cross; then
// inequalities solved like equations and drawn on a number line.
import type { UnitLesson } from "./types.ts";

export const y9Simultaneous: UnitLesson = {
  unit: "y9-simultaneous",
  title: "Two clues",
  summary: "Combine two clues to find two unknowns, then solve inequalities.",
  screens: [
    {
      kind: "explain",
      title: "Two unknowns, two clues",
      text: [
        "2 coffees and a cake cost £7. 1 coffee and a cake cost £5.",
        "The only difference is one coffee, and the prices differ by £2. So a coffee is £2, and a cake is £3.",
      ],
      picture: {
        kind: "table",
        rows: [
          ["2 coffees + 1 cake", "£7"],
          ["1 coffee + 1 cake", "£5"],
          ["the difference: 1 coffee", "£2"],
        ],
      },
    },
    {
      kind: "steps",
      title: "Take one from the other",
      start: "$3x + y = 11$ and $x + y = 5$",
      stages: [
        {
          prompt: "Take the second equation from the first:",
          options: [
            { text: "$2x = 6$", correct: true, feedback: "" },
            { text: "$4x + 2y = 16$", feedback: "That adds them. Subtracting gets rid of y." },
            { text: "$2x + 2y = 6$", feedback: "$y - y = 0$: the y's cancel." },
          ],
          then: "$2x = 6$, so $x = 3$",
        },
        {
          prompt: "Put $x = 3$ into $x + y = 5$:",
          options: [
            { text: "$y = 2$", correct: true, feedback: "" },
            { text: "$y = 8$", feedback: "$3 + y = 5$, so take 3 away." },
          ],
          then: "$y = 2$",
        },
      ],
      done: "Check in the first: $3 \\times 3 + 2 = 11$ ✓. This is **elimination**.",
    },
    {
      kind: "choice",
      title: "Seen on a graph",
      text: "Each equation is a line: $y = -3x + 11$ and $y = -x + 5$.",
      picture: {
        kind: "graph",
        range: { xMin: -1, xMax: 6, yMin: -3, yMax: 11 },
        lines: [
          { m: -3, c: 11 },
          { m: -1, c: 5 },
        ],
        star: { x: 3, y: 2 },
      },
      options: [
        {
          text: "Where the lines cross, at (3, 2)",
          correct: true,
          feedback: "That point is on both lines, so it fits both equations at once.",
        },
        {
          text: "Where each line meets the y-axis",
          feedback: "Those points fit only one equation each.",
        },
        { text: "There is no solution", feedback: "The lines cross, so there is one." },
      ],
    },
    {
      kind: "steps",
      title: "Make them match first",
      start: "$2x + 3y = 13$ and $x + y = 5$",
      stages: [
        {
          prompt: "Multiply the second equation by 2, so both have $2x$:",
          options: [
            { text: "$2x + 2y = 10$", correct: true, feedback: "" },
            { text: "$2x + y = 10$", feedback: "Multiply every term by 2." },
            { text: "$2x + 2y = 5$", feedback: "Multiply the 5 by 2 too." },
          ],
          then: "$2x + 2y = 10$",
        },
        {
          prompt: "Take it from the first equation:",
          options: [
            { text: "$y = 3$", correct: true, feedback: "" },
            { text: "$5y = 23$", feedback: "Subtract: $3y - 2y$ and $13 - 10$." },
          ],
          then: "$y = 3$",
        },
        {
          prompt: "So x is",
          options: [
            { text: "$2$", correct: true, feedback: "" },
            { text: "$8$", feedback: "$x + 3 = 5$." },
          ],
          then: "$x = 2$",
        },
      ],
      done: "Check: $2 \\times 2 + 3 \\times 3 = 13$ ✓",
    },
    {
      kind: "steps",
      title: "Substitution",
      start: "$y = 2x + 1$ and $3x + y = 16$",
      stages: [
        {
          prompt: "Swap y in the second equation for $2x + 1$:",
          options: [
            { text: "$3x + 2x + 1 = 16$", correct: true, feedback: "" },
            { text: "$3x + 2x = 16$", feedback: "Bring the + 1 too: y is all of $2x + 1$." },
            { text: "$3(2x + 1) = 16$", feedback: "y is added to 3x, not multiplied." },
          ],
          then: "$5x + 1 = 16$",
        },
        {
          prompt: "Solve:",
          options: [
            { text: "$x = 3$", correct: true, feedback: "" },
            { text: "$x = 3.4$", feedback: "Take 1 from both sides first: $5x = 15$." },
          ],
          then: "$x = 3$",
        },
        {
          prompt: "And $y = 2 \\times 3 + 1 =$",
          options: [
            { text: "$7$", correct: true, feedback: "" },
            { text: "$6$", feedback: "Add the 1." },
          ],
          then: "$y = 7$",
        },
      ],
      done: "Check: $3 \\times 3 + 7 = 16$ ✓. **Substitution** works well when one equation is already 'y ='.",
    },
    {
      kind: "answer",
      title: "Find x",
      text: "$x + y = 10$ and $x - y = 4$.",
      answers: ["7"],
      wrong: [
        { answer: "3", feedback: "That is y. Adding the equations gets rid of y: $2x = 14$." },
      ],
      hint: "Add the two equations: the y's cancel.",
      done: "$2x = 14$, so $x = 7$ and $y = 3$.",
    },
    {
      kind: "explain",
      title: "Inequalities",
      text: [
        "$x > 3$ means every number bigger than 3, but not 3 itself: an open circle at 3, and an arrow on.",
        "$x \\ge 3$ includes 3: a filled circle.",
      ],
      picture: {
        kind: "number-line",
        min: -2,
        max: 8,
        step: 1,
        interval: { from: 3, fromClosed: false },
      },
    },
    {
      kind: "choice",
      title: "What does this show?",
      picture: {
        kind: "number-line",
        min: -5,
        max: 3,
        step: 1,
        interval: { to: -1, toClosed: true },
      },
      options: [
        {
          text: "$x \\le -1$",
          correct: true,
          feedback: "Everything up to −1, and −1 itself: the circle is filled.",
        },
        { text: "$x < -1$", feedback: "The circle is filled, so −1 is included." },
        { text: "$x \\ge -1$", feedback: "The arrow points left, to the smaller numbers." },
      ],
    },
    {
      kind: "steps",
      title: "Solve $3x - 2 < 10$",
      start: "$3x - 2 < 10$",
      stages: [
        {
          prompt: "Add 2 to both sides:",
          options: [
            { text: "$3x < 12$", correct: true, feedback: "" },
            { text: "$3x < 8$", feedback: "Add 2, don't take it away." },
          ],
          then: "$3x < 12$",
        },
        {
          prompt: "Divide both sides by 3:",
          options: [
            { text: "$x < 4$", correct: true, feedback: "" },
            {
              text: "$x > 4$",
              feedback: "Dividing by a positive number keeps the sign the same way round.",
            },
          ],
          then: "$x < 4$",
          picture: {
            kind: "number-line",
            min: -1,
            max: 8,
            step: 1,
            interval: { to: 4, toClosed: false },
          },
        },
      ],
      done: "Solve it like an equation. Any number below 4 works.",
    },
    {
      kind: "place",
      title: "Whole numbers that fit",
      text: "Mark each integer that satisfies $-2 < x \\le 1$.",
      line: { kind: "number-line", min: -4, max: 4, step: 1 },
      targets: [
        { value: -1, label: "$-1$" },
        { value: 0, label: "$0$" },
        { value: 1, label: "$1$" },
      ],
      hint: "−2 is not included (<), but 1 is (≤).",
      done: "−1, 0 and 1. The < leaves −2 out; the ≤ lets 1 in.",
    },
    {
      kind: "explain",
      title: "Two clues",
      text: [
        "Simultaneous equations: add or subtract to remove one letter (after multiplying if needed), or substitute. The answer is where the two lines cross.",
        "Inequalities: solve like an equation. Open circle for < and >, filled for ≤ and ≥.",
      ],
      picture: {
        kind: "graph",
        range: { xMin: -1, xMax: 6, yMin: -3, yMax: 11 },
        lines: [
          { m: -3, c: 11 },
          { m: -1, c: 5 },
        ],
        star: { x: 3, y: 2 },
      },
    },
  ],
};
