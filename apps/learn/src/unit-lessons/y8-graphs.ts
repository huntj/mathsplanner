// Year 8, "Coordinates and straight-line graphs": the pupil feeds a function machine, plots what
// comes out, sees the points line up, spots the step pattern and the starting point, then plays
// with m and c until they can read a line's rule and draw a line from its rule.
import type { UnitLesson } from "./types.ts";

const wide = { xMin: -1, xMax: 6, yMin: -1, yMax: 12 };
const open = { xMin: -4, xMax: 4, yMin: -6, yMax: 8 };
const machinePoints = [
  { x: 0, y: 1 },
  { x: 1, y: 3 },
  { x: 2, y: 5 },
  { x: 3, y: 7 },
  { x: 4, y: 9 },
];
const line = { m: 2, c: 1 };

export const y8Graphs: UnitLesson = {
  unit: "y8-graphs",
  title: "Spot the rule",
  summary: "Find the rule hiding in a straight line, then draw a line from its rule.",
  screens: [
    {
      kind: "explain",
      title: "Every straight line has a rule",
      text: [
        "This line was drawn by a rule that tells every point where to go.",
        "By the end of this lesson you will read the rule from the picture, and draw a line from its rule.",
      ],
      scene: { range: wide, lines: [line] },
    },
    {
      kind: "machine",
      title: "Feed the machine",
      rule: line,
      inputs: [0, 1, 2, 3, 4],
      shown: 2,
      decoys: { 2: [4, 3], 3: [6, 4], 4: [8, 5] },
    },
    {
      kind: "plot",
      title: "Plot what came out",
      text: "Each x and y from the machine makes a point (x, y). Tap the grid to plot all five.",
      scene: { range: wide },
      targets: machinePoints,
      table: true,
      hint: "Go across to x first, then up to y.",
      done: "All five are in.",
    },
    {
      kind: "choice",
      title: "What do you notice about the points?",
      scene: { range: wide, points: machinePoints },
      reveal: { range: wide, points: machinePoints, lines: [line] },
      options: [
        {
          text: "They lie on a straight line",
          correct: true,
          feedback: "Every point that $y = 2x + 1$ makes lies on one straight line.",
        },
        { text: "They make a curve", feedback: "Look again: hold a ruler up to them." },
        {
          text: "They are scattered",
          feedback: "They follow a pattern: each one is the same step up from the last.",
        },
      ],
    },
    {
      kind: "plot",
      title: "Where will x = 5 go?",
      text: "Follow the line. Tap where the point for x = 5 must be.",
      scene: { range: wide, points: machinePoints, lines: [line] },
      targets: [{ x: 5, y: 11 }],
      hint: "Go across to 5, then up until you meet the line.",
      done: "Check: $2 \\times 5 + 1 = 11$, so it is (5, 11). The line knows every answer.",
    },
    {
      kind: "choice",
      title: "Each time x goes 1 across, how far does y go up?",
      text: "Look at the steps between the points.",
      scene: { range: wide, points: machinePoints, lines: [line], steps: true },
      options: [
        { text: "1", feedback: "Count the squares up in one step." },
        {
          text: "2",
          correct: true,
          feedback:
            "2. That is the 2 in $y = 2x + 1$. The number in front of x is the **gradient**: how steep the line is.",
        },
        { text: "3", feedback: "Count the squares up in one step, from one point to the next." },
      ],
    },
    {
      kind: "choice",
      title: "Where does the line cross the y-axis?",
      scene: { range: wide, points: machinePoints, lines: [line] },
      options: [
        {
          text: "(0, 1)",
          correct: true,
          feedback:
            "At (0, 1). That is the + 1 in $y = 2x + 1$: where the line crosses the y-axis, the **intercept**.",
        },
        { text: "(1, 0)", feedback: "The y-axis is the up-and-down one, where x = 0." },
        { text: "(0, 2)", feedback: "2 is the gradient. Look where the line meets the y-axis." },
      ],
    },
    {
      kind: "slider",
      title: "Steeper or flatter?",
      text: "Slide m to change $y = mx + 1$. Make the line go through the star.",
      range: open,
      vary: "m",
      start: { m: 0, c: 1 },
      min: -3,
      max: 3,
      star: { x: 2, y: 7 },
      done: "m = 3. m sets the steepness: a bigger m is steeper, and a negative m slopes down.",
    },
    {
      kind: "slider",
      title: "Up and down",
      text: "Now slide c in $y = 2x + c$. Make the line go through the star.",
      range: open,
      vary: "c",
      start: { m: 2, c: 0 },
      min: -5,
      max: 5,
      star: { x: 3, y: 3 },
      done: "c = −3. c slides the line up and down without turning it: the line crosses the y-axis at c.",
    },
    {
      kind: "explain",
      title: "The rule, decoded",
      text: [
        "Every straight line is $y = mx + c$.",
        "**m**, the gradient: how far up for each 1 across. Negative means down.",
        "**c**, the intercept: where the line crosses the y-axis.",
      ],
      scene: { range: wide, points: machinePoints, lines: [line], steps: true },
    },
    {
      kind: "plot",
      title: "Plot $y = 3x - 2$ without a table",
      text: "Start where it crosses the y-axis. Then go 1 across and 3 up, again and again.",
      scene: { range: { xMin: -1, xMax: 4, yMin: -3, yMax: 10 }, steps: true },
      targets: [
        { x: 0, y: -2 },
        { x: 1, y: 1 },
        { x: 2, y: 4 },
        { x: 3, y: 7 },
      ],
      rule: { m: 3, c: -2 },
      hint: "Start on the y-axis at −2. From each point, go 1 across and 3 up.",
      done: "That is $y = 3x - 2$: start at c, then step with m.",
    },
    {
      kind: "choice",
      title: "Which way will $y = -2x + 4$ slope?",
      text: "Think about the gradient before you look.",
      reveal: {
        range: { xMin: -2, xMax: 4, yMin: -4, yMax: 8 },
        lines: [{ m: -2, c: 4 }],
        steps: true,
      },
      options: [
        {
          text: "Up from left to right",
          feedback: "The gradient is −2: each 1 across goes 2 down.",
        },
        {
          text: "Down from left to right",
          correct: true,
          feedback: "A negative gradient slopes down: 1 across, 2 down.",
        },
        { text: "It is flat", feedback: "Only a gradient of 0 gives a flat line." },
      ],
    },
    {
      kind: "build",
      title: "What is this line’s rule?",
      text: "Find where it crosses the y-axis, then count one step.",
      range: { xMin: -4, xMax: 4, yMin: -4, yMax: 6 },
      rule: { m: -1, c: 3 },
      ms: [-1, 1, 3],
      cs: [-3, 1, 3],
      hint: "It crosses the y-axis at 3, and goes down 1 for each 1 across.",
    },
    {
      kind: "drag-line",
      title: "Draw $y = x - 2$",
      text: "Drag the two dots so the line is $y = x - 2$.",
      range: { xMin: -4, xMax: 4, yMin: -5, yMax: 5 },
      rule: { m: 1, c: -2 },
      from: [
        { x: -3, y: 3 },
        { x: 3, y: 3 },
      ],
      hint: "Put one dot on the y-axis at −2. Put the other 1 across and 1 up from it, or further along.",
    },
    {
      kind: "explain",
      title: "You found the rule",
      text: [
        "Read a line: find c where it crosses the y-axis, and m from one step.",
        "Draw a line: start at c, then step 1 across and m up.",
        "Now try the unit’s skills.",
      ],
      scene: { range: open, lines: [{ m: 1, c: -2 }, line, { m: -1, c: 3 }] },
    },
  ],
};
