// Year 9, "Graphs and sequences", as four short lessons, one just before each skill: reading
// estimates from a straight-line graph, solving quadratic equations where a curve meets a line,
// geometric sequences (multiply by the same each time), and the famous ones: square, triangular
// and Fibonacci. Each starts from something quick, builds the method a step at a time, names the
// common mistakes, and ends on an exit check.
import type { Curve, Range, UnitLesson } from "./types.ts";

const LINEAR = "Y9-ALG-07.a";
const QUADRATIC = "Y9-ALG-07.b";
const GEOMETRIC = "Y9-ALG-08.a";
const SPECIAL = "Y9-ALG-08.b";

const miles: Range = { xMin: 0, xMax: 5, yMin: 0, yMax: 8 };
const toKm = { m: 1.6, c: 0 };
const taxi: Range = { xMin: 0, xMax: 5, yMin: 0, yMax: 13 };
const candle: Range = { xMin: 0, xMax: 7, yMin: 0, yMax: 12 };
const parabola: Curve = { kind: "quadratic", a: 1, b: -2, c: -3 };
const quadRange: Range = { xMin: -3, xMax: 5, yMin: -5, yMax: 6 };
const ball: Curve = { kind: "quadratic", a: -1, b: 4, c: 0 };
const ballRange: Range = { xMin: -1, xMax: 5, yMin: -1, yMax: 5 };

export const y9Graphs: UnitLesson[] = [
  {
    unit: "y9-graphs",
    id: "y9-graphs/reading",
    before: LINEAR,
    title: "Reading a graph",
    summary: "Go from one axis to the line, then to the other axis, to estimate a value.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How far in miles?",
        text: [
          "A sign says the beach is 8 km away. Your bike shows distance in miles.",
          "How many miles is that? The graph changes miles (along) into kilometres (up). By the end of this lesson, you can read it.",
        ],
        picture: { kind: "graph", range: miles, lines: [toKm] },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "$y = 2x$. Find y when $x = 3$.",
        answers: ["6"],
        hint: "$2 \\times 3$.",
        done: "6.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "What are the coordinates of the point?",
        picture: {
          kind: "graph",
          range: { xMin: 0, xMax: 5, yMin: 0, yMax: 5 },
          points: [{ x: 2, y: 4 }],
        },
        options: [
          { text: "(2, 4)", correct: true, feedback: "2 along, 4 up: along first." },
          { text: "(4, 2)", feedback: "Along the corridor, then up the stairs: x first." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "About how many kilometres is 3 miles?",
        text: "Go up from 3 miles to the line, then across to the kilometres.",
        picture: { kind: "graph", range: miles, lines: [toKm], points: [{ x: 3, y: 4.8 }] },
        options: [
          {
            text: "About 4.8 km",
            correct: true,
            feedback: "Up from 3 to the line, then across: just under 5 km.",
          },
          {
            text: "About 3 km",
            feedback: "Kilometres are shorter than miles, so there are more of them.",
          },
          { text: "About 8 km", feedback: "8 km is 5 miles. Read up from 3." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "There and back",
        text: [
          "To read a graph: start on the axis you **know**, go to the line, then turn and go to the other axis.",
          "Miles to km: up, then across. Km to miles: across, then down.",
        ],
        picture: { kind: "graph", range: miles, lines: [toKm], points: [{ x: 2.5, y: 4 }] },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "About how many miles is 4 km?",
        text: "Start on the km axis this time: across to the line, then down.",
        picture: { kind: "graph", range: miles, lines: [toKm], points: [{ x: 2.5, y: 4 }] },
        options: [
          {
            text: "About 2.5 miles",
            correct: true,
            feedback: "Across from 4 to the line, down: 2.5 miles.",
          },
          {
            text: "About 6.4 miles",
            feedback: "That reads up from 4 miles. Start on the km axis.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "2 miles in kilometres",
        picture: { kind: "graph", range: miles, lines: [toKm], points: [{ x: 2, y: 3.2 }] },
        problem: "Use the graph to estimate 2 miles in kilometres.",
        steps: [
          { line: "Start at 2 on the miles axis", why: "That's the value we know." },
          { line: "Go up to the line", why: "The line turns miles into km." },
          { line: "Go across: about 3.2 km", why: "Read the other axis." },
        ],
        done: "About 3.2 km. It's an estimate: reading a graph is only as exact as your eye.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "How far for £9?",
        text: "The graph shows a taxi fare, in pounds (up), for each km (along).",
        picture: { kind: "graph", range: taxi, lines: [{ m: 2, c: 3 }], points: [{ x: 3, y: 9 }] },
        start: "You have £9. How far can you go?",
        stages: [
          {
            prompt: "Start on",
            options: [
              { text: "the £ axis, at 9", correct: true, feedback: "" },
              { text: "the km axis, at 9", feedback: "We know the money, so start at £9." },
            ],
            then: "Start at £9",
          },
          {
            prompt: "Across to the line, then down:",
            options: [
              { text: "3 km", correct: true, feedback: "" },
              { text: "9 km", feedback: "Go across to the line and down to read the km." },
            ],
            then: "3 km",
          },
        ],
        done: "£9 takes you 3 km.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "When is the candle 5 cm tall?",
        text: "The graph shows a candle's height in cm (up) after each hour (along).",
        picture: {
          kind: "graph",
          range: candle,
          lines: [{ m: -2, c: 12 }],
          points: [{ x: 3.5, y: 5 }],
        },
        start: "Read when it's 5 cm tall.",
        stages: [
          {
            prompt: "Start at",
            options: [
              { text: "5 on the height axis", correct: true, feedback: "" },
              { text: "5 on the hours axis", feedback: "We know the height: start there." },
            ],
            then: "Start at 5 cm",
          },
          {
            prompt: "Across to the line, then down:",
            options: [
              { text: "about 3.5 hours", correct: true, feedback: "" },
              { text: "about 2 hours", feedback: "At 2 hours it's 8 cm tall. Go further." },
            ],
            then: "About 3.5 hours",
          },
        ],
        done: "Start from what you know.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "The taxi fare for 4.5 km",
        picture: { kind: "graph", range: taxi, lines: [{ m: 2, c: 3 }] },
        options: [
          { text: "About £12", correct: true, feedback: "Up from 4.5 to the line, across: £12." },
          { text: "About £9", feedback: "That's for 3 km. Go up from 4.5." },
          { text: "About £4.50", feedback: "Go up to the line and read across." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "How many kilometres is 5 miles?",
        picture: { kind: "graph", range: miles, lines: [toKm] },
        answers: ["8"],
        unit: "km",
        wrong: [{ answer: "3", feedback: "Up from 5 miles to the line, then across." }],
        hint: "Up from 5 on the miles axis.",
        done: "8 km: the line reaches the top corner.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Ben wants 3 km in miles. He goes up from 3 on the miles axis and gets 4.8. What's wrong?",
        options: [
          {
            text: "He started on the wrong axis: across from 3 km, then down, is about 1.9 miles",
            correct: true,
            feedback:
              "Starting on the wrong axis is the most common slip. Always start with the value you know.",
          },
          { text: "Nothing", feedback: "4.8 km is 3 miles. He wanted 3 km." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Kim reads the candle's height after 2 hours.",
        picture: { kind: "graph", range: candle, lines: [{ m: -2, c: 12 }] },
        lines: ["Find 2 on the hours axis", "Go up to the line", "The height is 2 cm"],
        wrong: 2,
        why: "From the line, read across to the height axis: 8 cm. 2 was where she started.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "How far in miles?",
        text: "The beach is 8 km away.",
        picture: { kind: "graph", range: miles, lines: [toKm], points: [{ x: 5, y: 8 }] },
        options: [
          {
            text: "About 5 miles",
            correct: true,
            feedback: "Across from 8 km to the line, then down: 5 miles.",
          },
          {
            text: "About 12.8 miles",
            feedback: "That turns 8 miles into km. Start on the km axis.",
          },
          { text: "About 8 miles", feedback: "A mile is longer than a km, so it's fewer miles." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Using 1 mile ≈ 1.6 km, about how many km is 4 miles?",
            picture: { kind: "graph", range: miles, lines: [toKm] },
            options: ["6.4", "2.5", "4"],
            answers: ["6.4"],
            why: "Up from 4 miles: 6.4 km.",
            retry: {
              prompt: "Using the same graph, about how many miles is 6.4 km?",
              picture: { kind: "graph", range: miles, lines: [toKm] },
              options: ["4", "10", "6.4"],
              answers: ["4"],
              why: "Across from 6.4 km, down: 4 miles.",
            },
          },
          {
            prompt: "The taxi graph: what does 2 km cost, in pounds?",
            picture: { kind: "graph", range: taxi, lines: [{ m: 2, c: 3 }] },
            answers: ["7"],
            why: "Up from 2: £7.",
            retry: {
              prompt: "The taxi graph: how many km does £11 pay for?",
              picture: { kind: "graph", range: taxi, lines: [{ m: 2, c: 3 }] },
              answers: ["4"],
              why: "Across from £11, down: 4 km.",
            },
          },
          {
            prompt: "To read a graph, you start on",
            options: ["the axis of the value you know", "the x-axis, always", "the line"],
            answers: ["the axis of the value you know"],
            why: "Then go to the line, then to the other axis.",
            retry: {
              prompt: "Reading km to miles, after reaching the line you go",
              options: ["down to the miles axis", "up to the top", "back to the km axis"],
              answers: ["down to the miles axis"],
              why: "Across to the line, then down to read the miles.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-graphs",
    id: "y9-graphs/quadratic",
    before: QUADRATIC,
    title: "Where curves cross",
    summary: "Solve a quadratic equation from its graph: where the curve meets a line.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A thrown ball",
        text: [
          "A ball is thrown up. Its height, in metres, after x seconds is $h = 4x - x^2$.",
          "When is it 3 m high? There are two answers. By the end of this lesson, you can find both.",
        ],
        picture: { kind: "graph", range: ballRange, curves: [ball] },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "$y = x^2 - 3$. Find y when $x = 2$.",
        answers: ["1"],
        hint: "$2^2 - 3 = 4 - 3$.",
        done: "1.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "$y = x^2$. Find y when $x = -3$.",
        answers: ["9"],
        wrong: [
          {
            answer: "-9",
            feedback: "$(-3)^2 = -3 \\times -3$: a negative times a negative is positive.",
          },
        ],
        hint: "$(-3) \\times (-3)$.",
        done: "9: squaring a negative gives a positive.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A quadratic graph",
        text: [
          "The graph of $y = x^2 - 2x - 3$ is a U-shaped curve, a **parabola**.",
          "Every point on it fits the equation: at x = 1, $y = 1 - 2 - 3 = -4$, the bottom of the U.",
        ],
        picture: { kind: "graph", range: quadRange, curves: [parabola], points: [{ x: 1, y: -4 }] },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Solving $x^2 - 2x - 3 = 0$ means finding where y is 0. Where is that on the graph?",
        picture: { kind: "graph", range: quadRange, curves: [parabola] },
        options: [
          {
            text: "Where the curve crosses the x-axis",
            correct: true,
            feedback: "On the x-axis, y = 0.",
          },
          { text: "Where it crosses the y-axis", feedback: "On the y-axis, x is 0, not y." },
          { text: "At the bottom of the U", feedback: "There, y is −4." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Equal to something else",
        text: [
          "To solve $x^2 - 2x - 3 = 5$, find where the curve is at height 5: where it meets the line $y = 5$.",
          "A U-shape usually meets a level line twice, so there are usually **two** answers.",
        ],
        picture: { kind: "graph", range: quadRange, curves: [parabola], lines: [{ m: 0, c: 5 }] },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Solve $x^2 - 4 = 0$",
        picture: {
          kind: "graph",
          range: { xMin: -4, xMax: 4, yMin: -5, yMax: 6 },
          curves: [{ kind: "quadratic", a: 1, b: 0, c: -4 }],
          points: [
            { x: -2, y: 0 },
            { x: 2, y: 0 },
          ],
        },
        problem: "Use the graph of $y = x^2 - 4$ to solve $x^2 - 4 = 0$.",
        steps: [
          { line: "= 0 means where the curve crosses the x-axis", why: "There, y is 0." },
          { line: "It crosses at $x = -2$ and $x = 2$", why: "Read both crossings." },
        ],
        done: "Check: $(-2)^2 - 4 = 0$ ✓ and $2^2 - 4 = 0$ ✓",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Solve $x^2 - 2x - 3 = 0$",
        text: "Tap where the curve crosses the x-axis.",
        scene: { range: quadRange, curves: [parabola] },
        targets: [
          { x: -1, y: 0 },
          { x: 3, y: 0 },
        ],
        hint: "Find where the curve meets the x-axis, where y = 0.",
        done: "$x = -1$ and $x = 3$. Check: $3^2 - 2 \\times 3 - 3 = 0$ ✓",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Solve $x^2 - 2x - 3 = 5$",
        text: "Now the curve must reach 5. Tap where it meets the line $y = 5$.",
        scene: { range: quadRange, curves: [parabola], lines: [{ m: 0, c: 5 }] },
        targets: [
          { x: -2, y: 5 },
          { x: 4, y: 5 },
        ],
        hint: "Look along the line y = 5 for where the curve crosses it.",
        done: "$x = -2$ and $x = 4$. Check: $16 - 8 - 3 = 5$ ✓",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Not a whole number",
        text: "Estimate the positive solution of $x^2 - 3 = 0$ from the graph of $y = x^2 - 3$.",
        picture: {
          kind: "graph",
          range: { xMin: -3, xMax: 3, yMin: -4, yMax: 6 },
          curves: [{ kind: "quadratic", a: 1, b: 0, c: -3 }],
        },
        options: [
          {
            text: "About 1.7",
            correct: true,
            feedback:
              "It crosses between 1 and 2, a bit closer to 2. Exactly, it's $\\sqrt3 = 1.73\\ldots$",
          },
          {
            text: "About 3",
            feedback: "$3^2 - 3 = 6$, not 0. Look where the curve crosses the axis.",
          },
          { text: "About 1.2", feedback: "Look again: it crosses closer to 2 than to 1." },
        ],
      },
      {
        kind: "plot",
        tag: "Your turn",
        title: "Solve $x^2 - 4 = 5$",
        text: "Tap where the curve meets the line $y = 5$.",
        scene: {
          range: { xMin: -4, xMax: 4, yMin: -5, yMax: 6 },
          curves: [{ kind: "quadratic", a: 1, b: 0, c: -4 }],
          lines: [{ m: 0, c: 5 }],
        },
        targets: [
          { x: -3, y: 5 },
          { x: 3, y: 5 },
        ],
        hint: "Two places: one each side.",
        done: "$x = -3$ and $x = 3$: $9 - 4 = 5$ ✓",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Mia solves $x^2 = 9$ and says $x = 3$. Is she finished?",
        options: [
          {
            text: "No: $x = -3$ works too",
            correct: true,
            feedback:
              "$(-3)^2 = 9$. The curve meets $y = 9$ twice. Forgetting the negative answer is the common slip.",
          },
          { text: "Yes", feedback: "Try $(-3)^2$: it's 9 as well." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Tom solves $x^2 - 2x - 3 = 0$ from the graph.",
        picture: { kind: "graph", range: quadRange, curves: [parabola] },
        lines: ["Look where the curve crosses the y-axis", "It crosses at −3", "So $x = -3$"],
        wrong: 0,
        why: "= 0 means y is 0: that's the **x**-axis. The curve crosses it at $x = -1$ and $x = 3$.",
      },
      {
        kind: "plot",
        tag: "Back to the problem",
        title: "A thrown ball",
        text: "$h = 4x - x^2$. Tap where the ball is 3 m high: where the curve meets $h = 3$.",
        scene: { range: ballRange, curves: [ball], lines: [{ m: 0, c: 3 }] },
        targets: [
          { x: 1, y: 3 },
          { x: 3, y: 3 },
        ],
        hint: "Along the line at height 3: once going up, once coming down.",
        done: "After 1 second going up, and after 3 seconds coming down. Check: $4 - 1 = 3$ ✓ and $12 - 9 = 3$ ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The solutions of $x^2 - 2x - 3 = 0$ are where the curve",
            options: ["crosses the x-axis", "crosses the y-axis", "is lowest"],
            answers: ["crosses the x-axis"],
            why: "There, y = 0.",
            retry: {
              prompt: "The solutions of $x^2 - 2x - 3 = 5$ are where the curve",
              options: ["meets the line y = 5", "crosses the x-axis", "crosses x = 5"],
              answers: ["meets the line y = 5"],
              why: "There, y = 5.",
            },
          },
          {
            prompt: "Solve $x^2 = 16$.",
            options: ["$x = 4$ or $x = -4$", "$x = 4$", "$x = 8$"],
            answers: ["$x = 4$ or $x = -4$"],
            why: "Both square to 16.",
            retry: {
              prompt: "Solve $x^2 = 25$.",
              options: ["$x = 5$ or $x = -5$", "$x = 5$", "$x = 12.5$"],
              answers: ["$x = 5$ or $x = -5$"],
              why: "Both square to 25.",
            },
          },
          {
            prompt: "Solve $x^2 - 9 = 0$. Give the positive answer.",
            answers: ["3"],
            why: "$x^2 = 9$, so $x = 3$ (or −3).",
            retry: {
              prompt: "Solve $x^2 - 1 = 3$. Give the positive answer.",
              answers: ["2"],
              why: "$x^2 = 4$, so $x = 2$ (or −2).",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-graphs",
    id: "y9-graphs/geometric",
    before: GEOMETRIC,
    title: "Multiply each time",
    summary: "Geometric sequences: each term is the one before times the same number.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Growing bacteria",
        text: [
          "A dish starts with 3 bacteria, and the number doubles every hour.",
          "How many are there after 5 hours? By the end of this lesson, you can find out without drawing them all.",
        ],
        picture: { kind: "stacks", counts: [3, 6, 12, 24], labels: ["Start", "1 h", "2 h", "3 h"] },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "4, 7, 10, 13, … what comes next?",
        answers: ["16"],
        hint: "Add 3 each time.",
        done: "16: add 3 each time. That's an **arithmetic** sequence.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3 \\times 2 \\times 2 \\times 2$?",
        answers: ["24"],
        hint: "6, then 12, then…",
        done: "24.",
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "3, 6, 12, 24, … what comes next?",
        answers: ["48"],
        wrong: [
          {
            answer: "36",
            feedback:
              "It isn't adding 12 each time: 3 to 6 adds 3, 6 to 12 adds 6. Each term doubles.",
          },
        ],
        hint: "How do you get from 3 to 6, and from 6 to 12?",
        done: "48: each term is doubled.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Geometric sequences",
        text: [
          "In a **geometric** sequence, each term is multiplied by the same number: the **common ratio**.",
          "3, 6, 12, 24, … has a common ratio of 2. Find it by dividing a term by the one before: $6 \\div 3 = 2$.",
        ],
        picture: { kind: "stacks", counts: [3, 6, 12, 24] },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Arithmetic sequences add the same each time. Geometric ones",
        options: [
          {
            text: "multiply by the same each time",
            correct: true,
            feedback: "So they grow (or shrink) faster and faster.",
          },
          {
            text: "add a bigger amount each time, chosen at random",
            feedback: "The amount added grows, but because it multiplies by the same number.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "5, 15, 45, …",
        problem: "Find the common ratio and the next term of 5, 15, 45, …",
        steps: [
          { line: "Common ratio: $15 \\div 5 = 3$", why: "Divide a term by the one before." },
          { line: "Check: $45 \\div 15 = 3$ ✓", why: "It must be the same all the way along." },
          { line: "Next term: $45 \\times 3 = 135$", why: "Multiply the last term by the ratio." },
        ],
        done: "135.",
      },
      {
        kind: "fill",
        tag: "Together",
        title: "Continue it",
        template: "2, 6, 18, [], [] … multiplying by []",
        bank: ["$36$", "$54$", "$108$", "$162$", "$3$", "$4$"],
        answers: ["$54$", "$162$", "$3$"],
        hint: "How do you get from 2 to 6, and from 6 to 18?",
        done: "× 3 each time: 2, 6, 18, 54, 162.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Getting smaller: 80, 40, 20, …",
        start: "80, 40, 20, …",
        stages: [
          {
            prompt: "The common ratio, $40 \\div 80$:",
            options: [
              { text: "$\\frac12$", correct: true, feedback: "" },
              {
                text: "2",
                feedback: "It's getting smaller, so the ratio is less than 1: $40 \\div 80$.",
              },
              {
                text: "−40",
                feedback: "That's a difference. In a geometric sequence you multiply.",
              },
            ],
            then: "× ½",
          },
          {
            prompt: "The next two terms:",
            options: [
              { text: "10, 5", correct: true, feedback: "" },
              { text: "0, −20", feedback: "That takes 20 away. Halve instead." },
            ],
            then: "80, 40, 20, 10, 5",
          },
        ],
        done: "A ratio less than 1 makes the terms shrink.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "64, 16, 4, … what comes next?",
        answers: ["1"],
        wrong: [
          {
            answer: "-8",
            feedback: "It isn't taking 12 away. $16 \\div 64 = \\frac14$: divide by 4.",
          },
        ],
        hint: "What do you multiply 64 by to get 16?",
        done: "× ¼ each time: $4 \\div 4 = 1$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "1, 10, 100, 1000, … what is the 6th term?",
        answers: ["100000", "100,000"],
        hint: "× 10 each time: the 5th is 10 000.",
        done: "100 000.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "2, 4, 8, 16, … Kai says the next term is 18. Is he right?",
        options: [
          {
            text: "No: it doubles each time, so 32",
            correct: true,
            feedback:
              "Spotting only the first jump (+2) is the trap. Check every step: × 2 each time.",
          },
          { text: "Yes: add 2", feedback: "4 to 8 adds 4, and 8 to 16 adds 8. It's × 2." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Amy continues 3, 12, 48, …",
        lines: ["$12 - 3 = 9$", "So the common ratio is 9", "Next: $48 + 9 = 57$"],
        wrong: 0,
        why: "A common ratio is found by dividing, not subtracting: $12 \\div 3 = 4$. The next term is $48 \\times 4 = 192$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Growing bacteria",
        text: "3 bacteria, doubling every hour. How many after 5 hours?",
        picture: { kind: "stacks", counts: [3, 6, 12, 24], labels: ["Start", "1 h", "2 h", "3 h"] },
        answers: ["96"],
        wrong: [
          {
            answer: "30",
            feedback: "That's $3 \\times 2 \\times 5$. Double five times: $3 \\times 2^5$.",
          },
        ],
        hint: "Keep doubling: 24 after 3 hours, then 48, then…",
        done: "3, 6, 12, 24, 48, 96: that's $3 \\times 2^5 = 96$.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "4, 12, 36, … what is the common ratio?",
            answers: ["3"],
            why: "$12 \\div 4 = 3$.",
            retry: {
              prompt: "5, 10, 20, … what is the common ratio?",
              answers: ["2"],
              why: "$10 \\div 5 = 2$.",
            },
          },
          {
            prompt: "2, 10, 50, … what comes next?",
            answers: ["250"],
            why: "× 5 each time.",
            retry: {
              prompt: "3, 9, 27, … what comes next?",
              answers: ["81"],
              why: "× 3 each time.",
            },
          },
          {
            prompt: "Which is geometric?",
            options: ["1, 3, 9, 27", "1, 3, 5, 7", "1, 3, 4, 7"],
            answers: ["1, 3, 9, 27"],
            why: "× 3 each time.",
            retry: {
              prompt: "Which of these is geometric?",
              options: ["100, 50, 25", "100, 90, 80", "100, 99, 97"],
              answers: ["100, 50, 25"],
              why: "× ½ each time.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-graphs",
    id: "y9-graphs/special",
    before: SPECIAL,
    title: "Famous sequences",
    summary: "Square, triangular and Fibonacci numbers: where they come from and how they grow.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Fibonacci's rabbits",
        text: [
          "In 1202, Fibonacci imagined rabbits breeding: 1 pair, then 1, 2, 3, 5, 8 pairs, month by month.",
          "How many pairs are there in month 10? By the end of this lesson, you can find out.",
        ],
        picture: { kind: "maths", tex: "1, \\; 1, \\; 2, \\; 3, \\; 5, \\; 8, \\; \\ldots" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $4^2$?",
        answers: ["16"],
        wrong: [{ answer: "8", feedback: "That's $4 \\times 2$. $4^2 = 4 \\times 4$." }],
        hint: "$4 \\times 4$.",
        done: "16.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $1 + 2 + 3 + 4$?",
        answers: ["10"],
        hint: "Add them one at a time.",
        done: "10.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Triangles and squares",
        text: [
          "**Triangular numbers** make triangles of dots: 1, 3, 6, 10, … each adds one more row, one longer.",
          "**Square numbers** make squares: 1, 4, 9, 16, … that's $1^2, 2^2, 3^2, 4^2$.",
        ],
        picture: { kind: "dots", shape: "triangle", terms: 4 },
      },
      {
        kind: "fill",
        tag: "Discover",
        title: "The next ones",
        picture: { kind: "dots", shape: "square", terms: 4 },
        template: "Triangular: 1, 3, 6, 10, []. Square: 1, 4, 9, 16, []",
        bank: ["$13$", "$14$", "$15$", "$20$", "$25$"],
        answers: ["$15$", "$25$"],
        hint: "The next triangle adds a row of 5. The next square is 5 by 5.",
        done: "$10 + 5 = 15$ and $5^2 = 25$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "1, 1, 2, 3, 5, 8, … what comes next?",
        options: [
          {
            text: "13",
            correct: true,
            feedback:
              "Each term is the two before added together: $5 + 8 = 13$. This is the **Fibonacci** sequence.",
          },
          { text: "11", feedback: "Look at how each term is made from the two before it." },
          { text: "16", feedback: "It doesn't double: add the two terms before." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "The 6th triangular number",
        picture: { kind: "dots", shape: "triangle", terms: 5 },
        problem: "Find the 6th triangular number.",
        steps: [
          { line: "1, 3, 6, 10, 15", why: "Each adds one more than last time: +2, +3, +4, +5." },
          { line: "$15 + 6 = 21$", why: "The 6th adds a row of 6." },
        ],
        done: "21. It's also $1 + 2 + 3 + 4 + 5 + 6$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A special number: 36",
        start: "Is 36 square, triangular, or both?",
        stages: [
          {
            prompt: "Is 36 a square number?",
            options: [
              { text: "Yes: $6 \\times 6$", correct: true, feedback: "" },
              { text: "No", feedback: "$6^2 = 36$." },
            ],
            then: "$36 = 6^2$",
          },
          {
            prompt: "The triangular numbers go 21, 28, then",
            options: [
              { text: "36: so it's triangular too", correct: true, feedback: "" },
              { text: "35", feedback: "$28 + 8 = 36$." },
            ],
            then: "$36 = 1 + 2 + \\ldots + 8$",
          },
        ],
        done: "36 is both: square and triangular.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A Fibonacci-type sequence",
        start: "2, 5, 7, 12, …",
        stages: [
          {
            prompt: "How is 12 made?",
            options: [
              { text: "$5 + 7$: the two before", correct: true, feedback: "" },
              {
                text: "$7 + 5$ more each time",
                feedback: "The jumps aren't the same: 3, 2, 5. Each term adds the two before.",
              },
            ],
            then: "Add the two before.",
          },
          {
            prompt: "The next two terms:",
            options: [
              { text: "19, 31", correct: true, feedback: "" },
              { text: "17, 22", feedback: "$7 + 12 = 19$." },
            ],
            then: "2, 5, 7, 12, 19, 31",
          },
        ],
        done: "Any start works: add the two before.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "The 8th square number",
        answers: ["64"],
        wrong: [
          { answer: "16", feedback: "That's $8 \\times 2$. The 8th square is $8 \\times 8$." },
        ],
        hint: "$8^2$.",
        done: "$8^2 = 64$.",
      },
      {
        kind: "sort",
        tag: "Your turn",
        title: "Which sequence?",
        groups: ["Square", "Triangular", "Fibonacci"],
        items: [
          { text: "1, 4, 9, 16", group: 0, why: "$1^2, 2^2, 3^2, 4^2$." },
          { text: "25, 36, 49", group: 0, why: "$5^2, 6^2, 7^2$." },
          { text: "1, 3, 6, 10", group: 1, why: "Add 2, then 3, then 4." },
          { text: "15, 21, 28", group: 1, why: "Add 6, then 7." },
          { text: "1, 1, 2, 3, 5", group: 2, why: "Add the two before." },
          { text: "8, 13, 21", group: 2, why: "$8 + 13 = 21$." },
        ],
        done: "Squares: $n^2$. Triangles: add one more each time. Fibonacci: add the two before.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Leo says the 5th square number is 10, because $5 \\times 2 = 10$. Is he right?",
        options: [
          {
            text: "No: it's $5^2 = 5 \\times 5 = 25$",
            correct: true,
            feedback: "Squaring means times by itself, not times 2. A very common slip.",
          },
          { text: "Yes", feedback: "A 5 by 5 square of dots has 25 dots." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ana continues the Fibonacci sequence.",
        lines: ["1, 1, 2, 3, 5, 8", "Each term doubles the one before", "So the next is 16"],
        wrong: 1,
        why: "Each term **adds the two before**: $5 + 8 = 13$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Fibonacci's rabbits",
        text: "1, 1, 2, 3, 5, 8, … pairs. How many pairs in month 10?",
        answers: ["55"],
        wrong: [{ answer: "34", feedback: "That's month 9. One more." }],
        hint: "Keep going: 13, 21, 34, …",
        done: "1, 1, 2, 3, 5, 8, 13, 21, 34, 55: 55 pairs.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What is the 5th triangular number?",
            answers: ["15"],
            why: "1, 3, 6, 10, 15.",
            retry: {
              prompt: "What is the 7th triangular number?",
              answers: ["28"],
              why: "1, 3, 6, 10, 15, 21, 28.",
            },
          },
          {
            prompt: "What is the 9th square number?",
            answers: ["81"],
            why: "$9^2 = 81$.",
            retry: {
              prompt: "What is the 6th square number?",
              answers: ["36"],
              why: "$6^2 = 36$.",
            },
          },
          {
            prompt: "3, 4, 7, 11, … (Fibonacci-type). What comes next?",
            answers: ["18"],
            why: "$7 + 11 = 18$.",
            retry: {
              prompt: "2, 3, 5, 8, … (Fibonacci-type). What comes next?",
              answers: ["13"],
              why: "$5 + 8 = 13$.",
            },
          },
        ],
      },
    ],
  },
];
