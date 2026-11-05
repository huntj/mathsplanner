// Year 8, "Coordinates and straight-line graphs", as six short lessons, one just before each
// skill: coordinates in all four quadrants; plotting a line from a table (the pupil feeds a
// function machine, plots what comes out and sees the points line up); reading m and c to sketch
// a line from its equation; what the gradient and intercept mean in a real situation; reading
// values off a line; and solving two equations where their lines cross. Each starts from
// something quick, builds the idea a step at a time, names the common mistakes, and ends on an
// exit check.
import type { Picture, Point, Range, Rule, UnitLesson } from "./types.ts";

const COORDINATES = "Y8-ALG-05";
const TABLE = "Y8-ALG-06.a";
const SKETCH = "Y8-ALG-06.b";
const INTERPRET = "Y8-ALG-07";
const READ = "Y8-ALG-08.a";
const SIMULTANEOUS = "Y8-ALG-08.b";

const four: Range = { xMin: -5, xMax: 5, yMin: -5, yMax: 5 };
const wide: Range = { xMin: -1, xMax: 6, yMin: -1, yMax: 12 };
const open: Range = { xMin: -4, xMax: 4, yMin: -6, yMax: 8 };
const machinePoints = [
  { x: 0, y: 1 },
  { x: 1, y: 3 },
  { x: 2, y: 5 },
  { x: 3, y: 7 },
  { x: 4, y: 9 },
];
const line: Rule = { m: 2, c: 1 };

const graph = (range: Range, lines: Rule[] = [], points: Point[] = []): Picture => ({
  kind: "graph",
  range,
  ...(lines.length ? { lines } : {}),
  ...(points.length ? { points } : {}),
});

const candle: Range = { xMin: 0, xMax: 10, yMin: 0, yMax: 20 };
const miles: Range = { xMin: 0, xMax: 10, yMin: 0, yMax: 16 };
const taxis: Range = { xMin: 0, xMax: 6, yMin: 0, yMax: 12 };
const taxiA: Rule = { m: 1, c: 4 };
const taxiB: Rule = { m: 2, c: 1 };

export const y8Graphs: UnitLesson[] = [
  {
    unit: "y8-graphs",
    id: "y8-graphs/coordinates",
    before: COORDINATES,
    title: "All four quadrants",
    summary: "Across, then up or down: coordinates work below zero too.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The treasure map",
        text: [
          "A treasure map has its axes through the middle of an island. The treasure is at (−3, −2).",
          "Negative coordinates? Where do you dig? By the end of this lesson, you can find any point on the map.",
        ],
        picture: { kind: "graph", range: four, star: { x: -3, y: -2 } },
      },
      {
        kind: "plot",
        tag: "Warm-up",
        title: "Plot (3, 2)",
        text: "Go across first, then up.",
        scene: { range: { xMin: 0, xMax: 5, yMin: 0, yMax: 5 } },
        targets: [{ x: 3, y: 2 }],
        hint: "3 across, 2 up.",
        done: "(3, 2): across 3, up 2.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "In (4, 1), which number is x?",
        options: [
          { text: "4", correct: true, feedback: "x comes first: across." },
          { text: "1", feedback: "x comes first, alphabetically too." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Past zero",
        text: [
          "The axes carry on past zero. Negative x goes **left**; negative y goes **down**.",
          "The axes split the grid into four **quadrants**. Still: across first, then up or down.",
        ],
        picture: graph(
          four,
          [],
          [
            { x: 3, y: 2 },
            { x: -3, y: 2 },
            { x: -3, y: -2 },
            { x: 3, y: -2 },
          ],
        ),
      },
      {
        kind: "plot",
        tag: "Discover",
        title: "Plot (−3, 2)",
        text: "Start at (0, 0). Across 3 to the left, then 2 up.",
        scene: { range: four },
        targets: [{ x: -3, y: 2 }],
        hint: "Negative x: go left.",
        done: "(−3, 2): 3 left, 2 up.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Read the point",
        problem: "Write the coordinates of the point.",
        picture: graph(four, [], [{ x: -2, y: -4 }]),
        steps: [
          { line: "Across: 2 to the left, so $x = -2$", why: "Left is negative." },
          { line: "Down: 4, so $y = -4$", why: "Down is negative." },
          { line: "$(-2, -4)$", why: "x first, then y." },
        ],
        done: "Across, then up or down; signs for left and down.",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Plot these in order",
        text: "(2, −3), then (−4, −1), then (0, 3).",
        scene: { range: four },
        targets: [
          { x: 2, y: -3 },
          { x: -4, y: -1 },
          { x: 0, y: 3 },
        ],
        hint: "x first: left or right. Then y: up or down. 0 means stay on the axis.",
        done: "x = 0 sits on the y-axis.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Which quadrant is (−2, −3) in?",
        picture: graph(four),
        options: [
          {
            text: "Bottom left",
            correct: true,
            feedback: "Left (x negative) and down (y negative).",
          },
          { text: "Top left", feedback: "y = −3 is down." },
          { text: "Bottom right", feedback: "x = −2 is left." },
        ],
      },
      {
        kind: "plot",
        tag: "Your turn",
        title: "Make a square",
        text: "Plot (−2, 1), (1, 1), (1, −2) and (−2, −2), in order.",
        scene: { range: four },
        targets: [
          { x: -2, y: 1 },
          { x: 1, y: 1 },
          { x: 1, y: -2 },
          { x: -2, y: -2 },
        ],
        join: true,
        hint: "Across first, then up or down.",
        done: "A 3 by 3 square across the axes.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "What are the coordinates?",
        picture: graph(four, [], [{ x: 4, y: -1 }]),
        options: [
          { text: "(4, −1)", correct: true, feedback: "4 right, 1 down." },
          { text: "(−1, 4)", feedback: "x first: across is 4." },
          { text: "(4, 1)", feedback: "It's below the x-axis: −1." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Abi plots (2, −3) by going 3 left, then 2 up. What's wrong?",
        options: [
          {
            text: "She swapped them: x = 2 is across (right), y = −3 is down",
            correct: true,
            feedback: "The first number is always across. She plotted (−3, 2), a different point.",
          },
          { text: "Nothing", feedback: "(−3, 2) and (2, −3) are in different quadrants." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Dan reads the point at 3 left and 1 up.",
        picture: graph(four, [], [{ x: -3, y: 1 }]),
        lines: ["Across: 3 left", "Up: 1", "So it's (1, −3)"],
        wrong: 2,
        why: "x comes first, and left is negative: $(-3, 1)$.",
      },
      {
        kind: "plot",
        tag: "Back to the problem",
        title: "Find the treasure: (−3, −2)",
        scene: { range: four },
        targets: [{ x: -3, y: -2 }],
        hint: "3 left, 2 down.",
        done: "Dig here: 3 left and 2 down from the middle.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What are the coordinates of the point?",
            picture: graph(four, [], [{ x: -4, y: 3 }]),
            options: ["(−4, 3)", "(3, −4)", "(4, 3)"],
            answers: ["(−4, 3)"],
            why: "4 left, 3 up.",
            retry: {
              prompt: "Write the coordinates of this point.",
              picture: graph(four, [], [{ x: -1, y: 2 }]),
              options: ["(−1, 2)", "(2, −1)", "(1, 2)"],
              answers: ["(−1, 2)"],
              why: "1 left, 2 up.",
            },
          },
          {
            prompt: "Which quadrant is (3, −4) in?",
            options: ["Bottom right", "Top right", "Bottom left"],
            answers: ["Bottom right"],
            why: "Right and down.",
            retry: {
              prompt: "Which quadrant is (−1, 5) in?",
              options: ["Top left", "Top right", "Bottom left"],
              answers: ["Top left"],
              why: "Left and up.",
            },
          },
          {
            prompt: "A point on the y-axis has x =",
            options: ["0", "1", "any number"],
            answers: ["0"],
            why: "It's not left or right at all.",
            retry: {
              prompt: "A point on the x-axis has y =",
              options: ["0", "1", "any number"],
              answers: ["0"],
              why: "It's not up or down at all.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-graphs",
    id: "y8-graphs/from-a-table",
    before: TABLE,
    title: "Spot the rule",
    summary: "Feed a rule some numbers, plot what comes out, and the points line up.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Every straight line has a rule",
        text: [
          "This line was drawn by a rule, $y = 2x + 1$, that tells every point where to go.",
          "How do you draw a line from its rule? By the end of this lesson, you'll draw one point by point.",
        ],
        scene: { range: wide, lines: [line] },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "$y = 2x + 1$. Find y when $x = 3$",
        answers: ["7"],
        wrong: [{ answer: "6", feedback: "Don't forget the + 1." }],
        hint: "$2 \\times 3 + 1$.",
        done: "$y = 7$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "$y = 2x + 1$. Find y when $x = -1$",
        answers: ["-1"],
        wrong: [{ answer: "3", feedback: "$2 \\times -1 = -2$, then add 1." }],
        hint: "$2 \\times -1 + 1$.",
        done: "$-2 + 1 = -1$.",
      },
      {
        kind: "machine",
        tag: "Discover",
        title: "Feed the machine",
        rule: line,
        inputs: [0, 1, 2, 3, 4],
        shown: 2,
        decoys: { 2: [4, 3], 3: [6, 4], 4: [8, 5] },
      },
      {
        kind: "plot",
        tag: "Discover",
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
        tag: "Discover",
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
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A table for $y = 3x - 2$",
        problem: "Make a table for $y = 3x - 2$, from $x = 0$ to $x = 3$.",
        steps: [
          { line: "$x = 0$: $y = 0 - 2 = -2$", why: "Times 3, then take 2." },
          { line: "$x = 1$: $y = 3 - 2 = 1$", why: "" },
          {
            line: "$x = 2$: $y = 6 - 2 = 4$; $x = 3$: $y = 9 - 2 = 7$",
            why: "Up 3 each time: a good check.",
          },
          { line: "Points: (0, −2), (1, 1), (2, 4), (3, 7)", why: "Ready to plot." },
        ],
        done: "Substitute each x; the y-values should go up evenly.",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Plot $y = 3x - 2$ from its table",
        scene: { range: { xMin: -1, xMax: 4, yMin: -3, yMax: 10 } },
        targets: [
          { x: 0, y: -2 },
          { x: 1, y: 1 },
          { x: 2, y: 4 },
          { x: 3, y: 7 },
        ],
        table: true,
        rule: { m: 3, c: -2 },
        hint: "Across to x, then up (or down) to y.",
        done: "Join them with a ruler: that's $y = 3x - 2$.",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Plot $y = x + 3$ from its table",
        scene: { range: { xMin: -4, xMax: 4, yMin: -2, yMax: 8 } },
        targets: [
          { x: -2, y: 1 },
          { x: 0, y: 3 },
          { x: 2, y: 5 },
        ],
        table: true,
        rule: { m: 1, c: 3 },
        hint: "Negative x: go left first.",
        done: "Three points are enough to draw a line, and check it.",
      },
      {
        kind: "plot",
        tag: "Your turn",
        title: "Plot $y = 4 - x$ from its table",
        scene: { range: { xMin: -2, xMax: 5, yMin: -2, yMax: 7 } },
        targets: [
          { x: -1, y: 5 },
          { x: 1, y: 3 },
          { x: 3, y: 1 },
        ],
        table: true,
        rule: { m: -1, c: 4 },
        hint: "Across to x, then up to y.",
        done: "This line slopes down: as x goes up, y goes down.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which point is on $y = 2x + 1$?",
        options: [
          { text: "(4, 9)", correct: true, feedback: "$2 \\times 4 + 1 = 9$ ✓" },
          { text: "(9, 4)", feedback: "x = 9 gives y = 19. Check x first." },
          { text: "(4, 8)", feedback: "$2 \\times 4 + 1 = 9$, not 8." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Eli plots four points from his table. Three line up, one doesn't. What should he do?",
        options: [
          {
            text: "Check that point's working: it's probably wrong",
            correct: true,
            feedback:
              "A rule y = mx + c always makes a straight line. An odd one out means a slip.",
          },
          {
            text: "Draw a wiggly line through all four",
            feedback: "y = mx + c is always straight.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Fay fills in a table for $y = 2x + 1$.",
        lines: ["$x = 0$: $y = 1$", "$x = 1$: $y = 3$", "$x = -2$: $y = 5$"],
        wrong: 2,
        why: "$2 \\times -2 = -4$, so $y = -4 + 1 = -3$.",
      },
      {
        kind: "plot",
        tag: "Back to the problem",
        title: "Where will x = 5 go?",
        text: "Follow the line $y = 2x + 1$. Tap where the point for x = 5 must be.",
        scene: { range: wide, points: machinePoints, lines: [line] },
        targets: [{ x: 5, y: 11 }],
        hint: "Go across to 5, then up until you meet the line.",
        done: "Check: $2 \\times 5 + 1 = 11$, so it is (5, 11). The line knows every answer.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$y = 3x + 2$. When $x = 2$, y is",
            options: ["8", "7", "11"],
            answers: ["8"],
            why: "$6 + 2$.",
            retry: {
              prompt: "$y = 4x - 1$. When $x = 2$, y is",
              options: ["7", "9", "6"],
              answers: ["7"],
              why: "$8 - 1$.",
            },
          },
          {
            prompt: "$y = 2x - 3$. When $x = -1$, y is",
            options: ["−5", "−1", "5"],
            answers: ["−5"],
            why: "$-2 - 3$.",
            retry: {
              prompt: "$y = 3x + 1$. When $x = -2$, y is",
              options: ["−5", "−7", "7"],
              answers: ["−5"],
              why: "$-6 + 1$.",
            },
          },
          {
            prompt: "Which point is on $y = x + 5$?",
            options: ["(2, 7)", "(7, 2)", "(2, 10)"],
            answers: ["(2, 7)"],
            why: "$2 + 5 = 7$.",
            retry: {
              prompt: "Which point is on $y = 3x$?",
              options: ["(2, 6)", "(6, 2)", "(3, 6)"],
              answers: ["(2, 6)"],
              why: "$3 \\times 2 = 6$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-graphs",
    id: "y8-graphs/sketch",
    before: SKETCH,
    title: "y = mx + c",
    summary: "Read the gradient and the intercept, and sketch a line without a table.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "No time for a table",
        text: [
          "You need to sketch $y = 3x - 2$ and $y = -2x + 4$, fast. Making a table for each takes ages.",
          "The rule itself tells you where the line starts and how steep it is. By the end of this lesson, you can read it.",
        ],
        scene: {
          range: open,
          lines: [
            { m: 3, c: -2 },
            { m: -2, c: 4 },
          ],
        },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "In $y = 2x + 1$, the number multiplying x is",
        options: [
          { text: "2", correct: true, feedback: "2 is in front of x." },
          { text: "1", feedback: "1 is added on its own." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "$y = 2x + 1$. Find y when $x = 0$",
        answers: ["1"],
        hint: "$2 \\times 0 + 1$.",
        done: "When x = 0, y is just the number on the end.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Each time x goes 1 across, how far does y go up?",
        text: "The line is $y = 2x + 1$. Look at the steps between the points.",
        scene: { range: wide, points: machinePoints, lines: [line], steps: true },
        options: [
          {
            text: "2",
            correct: true,
            feedback:
              "That is the 2 in $y = 2x + 1$. The number in front of x is the **gradient**: how steep the line is.",
          },
          { text: "1", feedback: "Count the squares up in one step." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Where does the line cross the y-axis?",
        scene: { range: wide, points: machinePoints, lines: [line] },
        options: [
          {
            text: "(0, 1)",
            correct: true,
            feedback:
              "That is the + 1 in $y = 2x + 1$: where the line crosses the y-axis, the **intercept**.",
          },
          { text: "(1, 0)", feedback: "The y-axis is the up-and-down one, where x = 0." },
          { text: "(0, 2)", feedback: "2 is the gradient. Look where the line meets the y-axis." },
        ],
      },
      {
        kind: "slider",
        tag: "Discover",
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
        tag: "Discover",
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
        kind: "worked",
        tag: "Worked example",
        title: "Sketch $y = 3x - 2$",
        problem: "Sketch $y = 3x - 2$ without a table.",
        steps: [
          { line: "$c = -2$: start at (0, −2)", why: "Where it crosses the y-axis." },
          { line: "$m = 3$: 1 across, 3 up", why: "The gradient." },
          { line: "(1, 1), (2, 4)… join them", why: "Step again and again." },
        ],
        done: "Start at c, step with m.",
      },
      {
        kind: "plot",
        tag: "Together",
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
        tag: "Together",
        title: "Which way will $y = -2x + 4$ slope?",
        text: "Think about the gradient before you look.",
        reveal: {
          range: { xMin: -2, xMax: 4, yMin: -4, yMax: 8 },
          lines: [{ m: -2, c: 4 }],
          steps: true,
        },
        options: [
          {
            text: "Down from left to right",
            correct: true,
            feedback: "A negative gradient slopes down: 1 across, 2 down.",
          },
          {
            text: "Up from left to right",
            feedback: "The gradient is −2: each 1 across goes 2 down.",
          },
          { text: "It is flat", feedback: "Only a gradient of 0 gives a flat line." },
        ],
      },
      {
        kind: "build",
        tag: "Your turn",
        title: "What is this line's rule?",
        text: "Find where it crosses the y-axis, then count one step.",
        range: { xMin: -4, xMax: 4, yMin: -4, yMax: 6 },
        rule: { m: -1, c: 3 },
        ms: [-1, 1, 3],
        cs: [-3, 1, 3],
        hint: "It crosses the y-axis at 3, and goes down 1 for each 1 across.",
      },
      {
        kind: "drag-line",
        tag: "Your turn",
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
        kind: "choice",
        tag: "Watch out",
        title: "What is the gradient of $y = 5 - 2x$?",
        options: [
          {
            text: "−2",
            correct: true,
            feedback:
              "The gradient is the number with x, sign and all: $y = -2x + 5$. The order doesn't matter.",
          },
          { text: "5", feedback: "5 is on its own: that's the intercept." },
          { text: "2", feedback: "Keep the sign: it's −2x." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Gil sketches $y = 4x + 1$.",
        lines: ["Start at (0, 1)", "Gradient 4: go 4 across and 1 up", "Join the points"],
        wrong: 1,
        why: "Gradient 4 means 1 across and **4 up**.",
      },
      {
        kind: "drag-line",
        tag: "Back to the problem",
        title: "Sketch $y = -2x + 4$",
        text: "Drag the two dots so the line is $y = -2x + 4$.",
        range: { xMin: -2, xMax: 4, yMin: -4, yMax: 8 },
        rule: { m: -2, c: 4 },
        from: [
          { x: -1, y: -3 },
          { x: 3, y: -3 },
        ],
        hint: "Start on the y-axis at 4. Then 1 across, 2 down.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The gradient of $y = 4x - 3$ is",
            options: ["4", "−3", "3"],
            answers: ["4"],
            why: "The number with x.",
            retry: {
              prompt: "The gradient of $y = -x + 6$ is",
              options: ["−1", "6", "1"],
              answers: ["−1"],
              why: "−x means −1x.",
            },
          },
          {
            prompt: "$y = 2x + 5$ crosses the y-axis at",
            options: ["(0, 5)", "(5, 0)", "(0, 2)"],
            answers: ["(0, 5)"],
            why: "c = 5.",
            retry: {
              prompt: "$y = 3x - 4$ crosses the y-axis at",
              options: ["(0, −4)", "(−4, 0)", "(0, 3)"],
              answers: ["(0, −4)"],
              why: "c = −4.",
            },
          },
          {
            prompt: "What is the equation of this line?",
            picture: graph(open, [{ m: 2, c: -1 }]),
            options: ["$y = 2x - 1$", "$y = -x + 2$", "$y = x - 1$"],
            answers: ["$y = 2x - 1$"],
            why: "It crosses at −1 and goes up 2 for each 1 across.",
            retry: {
              prompt: "Which equation gives this line?",
              picture: graph(open, [{ m: -1, c: 2 }]),
              options: ["$y = -x + 2$", "$y = 2x - 1$", "$y = x + 2$"],
              answers: ["$y = -x + 2$"],
              why: "It crosses at 2 and goes down 1 for each 1 across.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-graphs",
    id: "y8-graphs/interpret",
    before: INTERPRET,
    title: "What the line means",
    summary: "In a real graph, the gradient is a rate and the intercept is where it starts.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A burning candle",
        text: [
          "A candle's height is $h = 20 - 2t$ cm, after t hours. Here is its graph.",
          "What do the 20 and the −2 mean? When does it burn out? By the end of this lesson, you can read the story in a graph.",
        ],
        picture: graph(candle, [{ m: -2, c: 20 }]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "$h = 20 - 2t$. Find h when $t = 3$",
        answers: ["14"],
        hint: "$20 - 2 \\times 3$.",
        done: "14 cm after 3 hours.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "A graph slopes down from left to right. As x grows, y",
        options: [
          { text: "gets smaller", correct: true, feedback: "Down means decreasing." },
          { text: "gets bigger", feedback: "That's a line sloping up." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "What does the 20 tell you?",
        text: "The line starts at h = 20 when t = 0.",
        picture: graph(candle, [{ m: -2, c: 20 }]),
        options: [
          {
            text: "The candle starts 20 cm tall",
            correct: true,
            feedback: "At t = 0, before it's lit.",
          },
          { text: "It burns for 20 hours", feedback: "20 is a height, on the up axis." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "What does the −2 tell you?",
        options: [
          {
            text: "It gets 2 cm shorter every hour",
            correct: true,
            feedback: "The gradient is a rate: the change in h for each 1 hour.",
          },
          { text: "It's 2 cm wide", feedback: "−2 is how h changes for each hour." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Rate and start",
        text: [
          "In a real graph, the **gradient** is a **rate**: how much y changes for each 1 of x (cm per hour, £ per mile…).",
          "The **intercept** is the **starting value**, when x is 0.",
        ],
        picture: {
          kind: "maths",
          tex: "y = \\underbrace{m}_{\\text{rate}}x + \\underbrace{c}_{\\text{start}}",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A taxi fare",
        problem: "A taxi fare is $C = 2m + 3$ pounds for m miles. What do the 2 and 3 mean?",
        steps: [
          { line: "Gradient 2: £2 for each mile", why: "The rate." },
          { line: "Intercept 3: £3 before you move", why: "The fixed charge, at m = 0." },
        ],
        done: "Units help: £ per mile is a rate.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Filling a tank",
        start: "A tank has 5 litres in it, and fills at 3 litres a minute.",
        stages: [
          {
            prompt: "The intercept, at 0 minutes, is",
            options: [
              { text: "5 litres", correct: true, feedback: "" },
              { text: "3 litres", feedback: "3 is the rate. It starts with 5." },
            ],
            then: "c = 5",
          },
          {
            prompt: "The formula for V litres after t minutes is",
            options: [
              { text: "$V = 3t + 5$", correct: true, feedback: "" },
              { text: "$V = 5t + 3$", feedback: "The rate goes with t." },
            ],
            then: "$V = 3t + 5$",
          },
        ],
        done: "Rate with the variable; start on its own.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Which story fits a horizontal line?",
        picture: graph({ xMin: 0, xMax: 6, yMin: 0, yMax: 8 }, [{ m: 0, c: 5 }]),
        options: [
          {
            text: "Nothing changes: y stays 5",
            correct: true,
            feedback: "Gradient 0: a rate of zero.",
          },
          { text: "It goes up 5 each time", feedback: "Flat means no change." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "A phone plan: $C = 0.1t + 8$ pounds for t texts. What is 0.1?",
        options: [
          { text: "10p for each text", correct: true, feedback: "The rate: £0.10 per text." },
          { text: "The monthly charge", feedback: "The £8 is the fixed charge." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "A car's fuel: $F = 40 - 5h$ litres after h hours. What is 40?",
        options: [
          { text: "The fuel at the start", correct: true, feedback: "At h = 0, F = 40." },
          { text: "The hours it can drive", feedback: "40 is litres, at the start." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "For the candle, $h = 20 - 2t$, Lou says it shrinks 20 cm an hour. Is he right?",
        options: [
          {
            text: "No: 20 is the start; it shrinks 2 cm an hour",
            correct: true,
            feedback: "The rate is the number with t. The number alone is the start.",
          },
          { text: "Yes", feedback: "After 1 hour, h = 18: it shrank 2 cm." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "A plumber charges $C = 30h + 50$ pounds for h hours. Kit explains it.",
        lines: ["£30 for each hour", "£50 for each hour too", "So 2 hours costs £160"],
        wrong: 1,
        why: "The £50 is a one-off call-out charge. 2 hours costs $60 + 50 = £110$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The candle: $h = 20 - 2t$",
        text: "After how many hours does it burn out (h = 0)?",
        picture: graph(candle, [{ m: -2, c: 20 }]),
        answers: ["10"],
        unit: "hours",
        wrong: [{ answer: "20", feedback: "20 cm at 2 cm an hour: $20 \\div 2$." }],
        hint: "Where does the line meet the t-axis?",
        done: "20 cm at 2 cm an hour: 10 hours.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A gym costs $C = 25m + 40$ pounds for m months. The joining fee is",
            options: ["£40", "£25", "£65"],
            answers: ["£40"],
            why: "The number on its own: paid once.",
            retry: {
              prompt: "A gym costs $C = 25m + 40$ pounds for m months. The monthly cost is",
              options: ["£25", "£40", "£65"],
              answers: ["£25"],
              why: "The number with m: the rate.",
            },
          },
          {
            prompt: "Water drains from a bath: $W = 120 - 8t$ litres. Each minute, it",
            options: ["loses 8 litres", "loses 120 litres", "gains 8 litres"],
            answers: ["loses 8 litres"],
            why: "Gradient −8.",
            retry: {
              prompt: "A pool fills: $W = 50 + 20t$ litres. Each minute, it",
              options: ["gains 20 litres", "gains 50 litres", "loses 20 litres"],
              answers: ["gains 20 litres"],
              why: "Gradient +20.",
            },
          },
          {
            prompt: "A line has gradient 0. In a story, that means",
            options: ["nothing changes", "it doubles", "it starts at 0"],
            answers: ["nothing changes"],
            why: "A rate of zero.",
            retry: {
              prompt: "A horizontal line on a graph means y",
              options: ["stays the same", "goes up", "goes down"],
              answers: ["stays the same"],
              why: "Gradient 0.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-graphs",
    id: "y8-graphs/read",
    before: READ,
    title: "Reading a graph",
    summary: "Go up to the line, then across: or the other way round.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Miles and kilometres",
        text: [
          "Road signs in France use kilometres. This graph converts miles to km. How many km is 5 miles? How many miles is 12 km?",
          "By the end of this lesson, you can read both off the graph.",
        ],
        picture: graph(miles, [{ m: 1.6, c: 0 }]),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "What are the coordinates of the point?",
        picture: graph({ xMin: 0, xMax: 6, yMin: 0, yMax: 6 }, [], [{ x: 4, y: 3 }]),
        options: [
          { text: "(4, 3)", correct: true, feedback: "Across 4, up 3." },
          { text: "(3, 4)", feedback: "x first." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is halfway between 6 and 8?",
        answers: ["7"],
        hint: "Add and halve.",
        done: "7. Handy for reading between grid lines.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Up, then across",
        text: [
          "To find y for a given x: go **up** from x to the line, then **across** to the y-axis.",
          "To find x for a given y: go **across** from y to the line, then **down** to the x-axis.",
        ],
        picture: graph(miles, [{ m: 1.6, c: 0 }], [{ x: 5, y: 8 }]),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "5 miles is how many km?",
        text: "Go up from 5 to the line, then across.",
        picture: graph(miles, [{ m: 1.6, c: 0 }], [{ x: 5, y: 8 }]),
        options: [
          { text: "8 km", correct: true, feedback: "Up from 5, across to 8." },
          { text: "3 km", feedback: "km are more than miles here: read the up axis." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Read it backwards",
        problem: "Use the graph of $y = 2x + 1$ to find x when y = 6.",
        picture: graph(
          { xMin: 0, xMax: 5, yMin: 0, yMax: 11 },
          [{ m: 2, c: 1 }],
          [{ x: 2.5, y: 6 }],
        ),
        steps: [
          { line: "Go across from y = 6 to the line", why: "Start on the y-axis." },
          { line: "Then down to the x-axis: halfway between 2 and 3", why: "Between grid lines." },
          { line: "$x = 2.5$", why: "Check: $2 \\times 2.5 + 1 = 6$ ✓" },
        ],
        done: "Across, then down; estimate between grid lines.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "12 km in miles",
        picture: graph(miles, [{ m: 1.6, c: 0 }], [{ x: 7.5, y: 12 }]),
        start: "Find 12 km on the km axis (up).",
        stages: [
          {
            prompt: "Go across to the line, then",
            options: [
              { text: "down to the miles axis", correct: true, feedback: "" },
              { text: "up", feedback: "Go down to the x-axis." },
            ],
            then: "Down to the miles axis",
          },
          {
            prompt: "It lands halfway between 7 and 8, so 12 km is about",
            options: [
              { text: "7.5 miles", correct: true, feedback: "" },
              { text: "19 miles", feedback: "Miles are fewer than km here." },
            ],
            then: "7.5 miles",
          },
        ],
        done: "12 km ≈ 7.5 miles.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Read y when x = 3.5",
        text: "The line is $y = 2x + 1$.",
        picture: graph({ xMin: 0, xMax: 5, yMin: 0, yMax: 11 }, [{ m: 2, c: 1 }]),
        answers: ["8"],
        hint: "Up from 3.5 to the line, then across.",
        done: "y = 8. Check: $2 \\times 3.5 + 1 = 8$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "How many miles is 16 km?",
        picture: graph(miles, [{ m: 1.6, c: 0 }]),
        answers: ["10"],
        unit: "miles",
        wrong: [{ answer: "25.6", feedback: "Go across from 16 on the km axis, then down." }],
        hint: "Across from 16, down to the miles axis.",
        done: "16 km = 10 miles.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "On a graph where each square up is 2, Jess reads 3 squares up as 3. What's wrong?",
        options: [
          {
            text: "Check the scale: 3 squares is 6",
            correct: true,
            feedback: "Always read the numbers on the axis, not the squares.",
          },
          { text: "Nothing", feedback: "Each square is worth 2 here." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Hal uses the conversion graph to change 10 miles to km.",
        lines: ["Find 10 on the km axis", "Across to the line, down", "10 miles is about 6 km"],
        wrong: 0,
        why: "10 miles is on the **miles** axis (across). Go up to the line: 16 km.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "5 miles, and 12 km",
        picture: graph(miles, [{ m: 1.6, c: 0 }]),
        options: [
          {
            text: "5 miles ≈ 8 km; 12 km ≈ 7.5 miles",
            correct: true,
            feedback: "Up then across; across then down.",
          },
          { text: "5 miles ≈ 3 km; 12 km ≈ 19 miles", feedback: "Those mix up the axes." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Use the graph of $y = x + 2$: y when x = 3?",
            picture: graph({ xMin: 0, xMax: 6, yMin: 0, yMax: 8 }, [{ m: 1, c: 2 }]),
            options: ["5", "3", "1"],
            answers: ["5"],
            why: "Up from 3 to the line, across: 5.",
            retry: {
              prompt: "Use the graph of $y = x + 2$: y when x = 1?",
              picture: graph({ xMin: 0, xMax: 6, yMin: 0, yMax: 8 }, [{ m: 1, c: 2 }]),
              options: ["3", "1", "2"],
              answers: ["3"],
              why: "Up from 1, across: 3.",
            },
          },
          {
            prompt: "Use the graph of $y = 2x$: x when y = 7?",
            picture: graph({ xMin: 0, xMax: 6, yMin: 0, yMax: 12 }, [{ m: 2, c: 0 }]),
            options: ["3.5", "14", "7"],
            answers: ["3.5"],
            why: "Across from 7, down: 3.5.",
            retry: {
              prompt: "Use the graph of $y = 2x$: x when y = 9?",
              picture: graph({ xMin: 0, xMax: 6, yMin: 0, yMax: 12 }, [{ m: 2, c: 0 }]),
              options: ["4.5", "18", "9"],
              answers: ["4.5"],
              why: "Across from 9, down: 4.5.",
            },
          },
          {
            prompt: "To find y for a given x, you go",
            options: ["up to the line, then across", "across, then down", "along the x-axis"],
            answers: ["up to the line, then across"],
            why: "Start on the x-axis.",
            retry: {
              prompt: "To find x for a given y, you go",
              options: ["across to the line, then down", "up, then across", "along the y-axis"],
              answers: ["across to the line, then down"],
              why: "Start on the y-axis.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-graphs",
    id: "y8-graphs/simultaneous",
    before: SIMULTANEOUS,
    title: "Where lines cross",
    summary: "The crossing point of two lines solves both equations at once.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Two taxis",
        text: [
          "Taxi A charges £4 plus £1 a mile: $y = x + 4$. Taxi B charges £1 plus £2 a mile: $y = 2x + 1$.",
          "For what distance do they cost the same? By the end of this lesson, the graph will tell you.",
        ],
        picture: graph(taxis, [taxiA, taxiB]),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Is (3, 7) on $y = x + 4$?",
        options: [
          { text: "Yes", correct: true, feedback: "$3 + 4 = 7$ ✓" },
          { text: "No", feedback: "Put x = 3 in: $3 + 4 = 7$." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Is (3, 7) on $y = 2x + 1$?",
        options: [
          { text: "Yes", correct: true, feedback: "$6 + 1 = 7$ ✓" },
          { text: "No", feedback: "Put x = 3 in: $2 \\times 3 + 1 = 7$." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "On both lines",
        text: [
          "(3, 7) fits both equations. On the graph, it's where the two lines **cross**.",
          "The crossing point is the solution of both equations at once: $x = 3$, $y = 7$.",
        ],
        picture: graph(taxis, [taxiA, taxiB], [{ x: 3, y: 7 }]),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Where do these lines cross?",
        text: "$y = x + 1$ and $y = -x + 5$",
        picture: graph({ xMin: -1, xMax: 5, yMin: -1, yMax: 6 }, [
          { m: 1, c: 1 },
          { m: -1, c: 5 },
        ]),
        options: [
          { text: "(2, 3)", correct: true, feedback: "Check: $2 + 1 = 3$ and $-2 + 5 = 3$ ✓" },
          { text: "(3, 2)", feedback: "x first: across 2, up 3." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Solve with a graph",
        problem: "Solve $y = 2x$ and $y = x + 2$ using their graphs.",
        picture: graph({ xMin: -1, xMax: 5, yMin: -1, yMax: 8 }, [
          { m: 2, c: 0 },
          { m: 1, c: 2 },
        ]),
        steps: [
          { line: "Draw both lines", why: "From their m and c." },
          { line: "They cross at (2, 4)", why: "Read the crossing point." },
          { line: "$x = 2$, $y = 4$", why: "Check: $2 \\times 2 = 4$ and $2 + 2 = 4$ ✓" },
        ],
        done: "The solution is a pair: x and y.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Solve $y = 3x - 1$ and $y = x + 3$",
        picture: graph({ xMin: -1, xMax: 5, yMin: -2, yMax: 9 }, [
          { m: 3, c: -1 },
          { m: 1, c: 3 },
        ]),
        start: "Read the crossing.",
        stages: [
          {
            prompt: "The lines cross at",
            options: [
              { text: "(2, 5)", correct: true, feedback: "" },
              { text: "(5, 2)", feedback: "x first." },
            ],
            then: "(2, 5)",
          },
          {
            prompt: "Check in $y = 3x - 1$:",
            options: [
              { text: "$3 \\times 2 - 1 = 5$ ✓", correct: true, feedback: "" },
              { text: "$3 \\times 5 - 1 = 14$", feedback: "Put in x = 2." },
            ],
            then: "$x = 2$, $y = 5$",
          },
        ],
        done: "Always check the pair in both equations.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Read the crossing",
        text: "Where do $y = 2x$ and $y = 3 - x$ cross?",
        picture: graph({ xMin: -1, xMax: 4, yMin: -1, yMax: 5 }, [
          { m: 2, c: 0 },
          { m: -1, c: 3 },
        ]),
        options: [
          { text: "(1, 2)", correct: true, feedback: "A clear crossing on the grid." },
          { text: "(2, 1)", feedback: "x first." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Solve using the graph",
        text: "$y = x + 2$ and $y = 4 - x$",
        picture: graph({ xMin: -1, xMax: 5, yMin: -1, yMax: 6 }, [
          { m: 1, c: 2 },
          { m: -1, c: 4 },
        ]),
        options: [
          { text: "$x = 1$, $y = 3$", correct: true, feedback: "$1 + 2 = 3$ and $4 - 1 = 3$ ✓" },
          { text: "$x = 3$, $y = 1$", feedback: "Read across first: x = 1." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Where do $y = 2x - 2$ and $y = x + 1$ cross? Give x",
        picture: graph({ xMin: -1, xMax: 5, yMin: -3, yMax: 7 }, [
          { m: 2, c: -2 },
          { m: 1, c: 1 },
        ]),
        answers: ["3"],
        hint: "Find the crossing, then read down to the x-axis.",
        done: "x = 3, and y = 4.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Two lines cross at (4, 6). Ned writes the solution as x = 4. What's missing?",
        options: [
          {
            text: "y = 6: the solution is both values",
            correct: true,
            feedback: "Simultaneous equations have a pair of answers: x = 4 and y = 6.",
          },
          { text: "Nothing", feedback: "The crossing gives y too." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ana solves $y = x + 3$ and $y = 2x$ with a graph.",
        lines: ["The lines cross at (3, 6)", "Check: $3 + 3 = 6$ ✓", "Solution: $x = 6$, $y = 3$"],
        wrong: 2,
        why: "The point is (3, 6): $x = 3$, $y = 6$. Keep them in order.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The taxis",
        text: "A: $y = x + 4$. B: $y = 2x + 1$. When do they cost the same?",
        picture: graph(taxis, [taxiA, taxiB], [{ x: 3, y: 7 }]),
        options: [
          {
            text: "At 3 miles: both £7",
            correct: true,
            feedback: "Shorter trips: B is cheaper. Longer: A.",
          },
          { text: "At 7 miles", feedback: "7 is the cost (y). The miles are x." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Solve $y = x$ and $y = 6 - x$ from the graph.",
            picture: graph({ xMin: -1, xMax: 6, yMin: -1, yMax: 7 }, [
              { m: 1, c: 0 },
              { m: -1, c: 6 },
            ]),
            options: ["x = 3, y = 3", "x = 6, y = 0", "x = 0, y = 6"],
            answers: ["x = 3, y = 3"],
            why: "They cross at (3, 3).",
            retry: {
              prompt: "Solve $y = x + 1$ and $y = 5 - x$ from the graph.",
              picture: graph({ xMin: -1, xMax: 6, yMin: -1, yMax: 7 }, [
                { m: 1, c: 1 },
                { m: -1, c: 5 },
              ]),
              options: ["x = 2, y = 3", "x = 3, y = 2", "x = 1, y = 5"],
              answers: ["x = 2, y = 3"],
              why: "They cross at (2, 3).",
            },
          },
          {
            prompt: "Two lines cross at (−1, 4). The solution is",
            options: ["x = −1, y = 4", "x = 4, y = −1", "x = −1 only"],
            answers: ["x = −1, y = 4"],
            why: "x first, and both values.",
            retry: {
              prompt: "Two lines cross at (5, −2). The solution is",
              options: ["x = 5, y = −2", "x = −2, y = 5", "y = −2 only"],
              answers: ["x = 5, y = −2"],
              why: "x first, and both values.",
            },
          },
          {
            prompt: "Does (2, 5) solve $y = 2x + 1$ and $y = x + 3$?",
            options: ["Yes", "No"],
            answers: ["Yes"],
            why: "$4 + 1 = 5$ and $2 + 3 = 5$.",
            retry: {
              prompt: "Does (1, 4) solve $y = 3x + 1$ and $y = x + 2$?",
              options: ["No", "Yes"],
              answers: ["No"],
              why: "$1 + 2 = 3$, not 4.",
            },
          },
        ],
      },
    ],
  },
];
