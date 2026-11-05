// Year 9, "Straight-line graphs", as five short lessons, one just before each skill: the gradient
// (up ÷ across between any two points), the intercept (where x is 0), parallel lines (the same
// gradient), rearranging into y = mx + c, and what the gradient and intercept mean in a real
// situation. Each starts from something quick, builds the method a step at a time, names the
// common mistakes, and ends on an exit check.
import type { Range, UnitLesson } from "./types.ts";

const GRADIENT = "Y9-ALG-04.a";
const INTERCEPT = "Y9-ALG-04.b";
const PARALLEL = "Y9-ALG-04.c";
const REARRANGE = "Y9-ALG-05.a";
const MEANING = "Y9-ALG-05.b";

const wide: Range = { xMin: -4, xMax: 4, yMin: -6, yMax: 6 };
const taxi: Range = { xMin: 0, xMax: 5, yMin: 0, yMax: 13 };
const candle: Range = { xMin: 0, xMax: 7, yMin: 0, yMax: 12 };

export const y9StraightLine: UnitLesson[] = [
  {
    unit: "y9-straight-line",
    id: "y9-straight-line/gradient",
    before: GRADIENT,
    title: "How steep?",
    summary: "The gradient: how far up for each 1 across, between any two points.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Is the ramp too steep?",
        text: [
          "A wheelchair ramp can rise no more than 1 m for every 12 m along: a steepness of $1 \\div 12 = 0.083$.",
          "A ramp rises 0.5 m over 5 m along the ground. Is it allowed? By the end of this lesson, you can measure it.",
        ],
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 5, y: 0 },
            { x: 5, y: 0.5 },
          ],
          sides: ["5 m", "0.5 m", null],
          square: [1],
        },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which line is steeper?",
        picture: {
          kind: "graph",
          range: { xMin: -1, xMax: 4, yMin: -1, yMax: 9 },
          lines: [
            { m: 1, c: 0 },
            { m: 3, c: 0 },
          ],
        },
        options: [
          { text: "$y = 3x$", correct: true, feedback: "For each 1 across it goes 3 up, not 1." },
          { text: "$y = x$", feedback: "$y = x$ goes up 1 for each 1 across; $y = 3x$ goes up 3." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How far is it from 2 to 6?",
        answers: ["4"],
        hint: "$6 - 2$.",
        done: "$6 - 2 = 4$: take the start from the end.",
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "Up for each 1 across",
        text: "On $y = 2x$, for each 1 across, how far up does the line go?",
        picture: {
          kind: "graph",
          range: { xMin: -1, xMax: 4, yMin: -1, yMax: 8 },
          lines: [{ m: 2, c: 0 }],
          steps: true,
        },
        answers: ["2"],
        hint: "Follow the little steps: 1 across, then up.",
        done: "2 up for each 1 across: the **gradient** is 2.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Gradient from any two points",
        text: [
          "You don't need to go 1 across. Between any two points: gradient = change in y ÷ change in x, or **up ÷ across**.",
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
        kind: "choice",
        tag: "Discover",
        title: "Which way does a negative gradient go?",
        picture: { kind: "graph", range: wide, lines: [{ m: -2, c: 1 }] },
        options: [
          {
            text: "Down, from left to right",
            correct: true,
            feedback: "y goes down as x goes up: the change in y is negative.",
          },
          { text: "Up, from left to right", feedback: "Uphill lines have positive gradients." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Through (2, 1) and (6, 9)",
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
        problem: "Find the gradient of the line through (2, 1) and (6, 9).",
        steps: [
          { line: "Up: $9 - 1 = 8$", why: "Change in y: the second y take away the first." },
          { line: "Across: $6 - 2 = 4$", why: "Change in x, in the same order." },
          { line: "Gradient $= 8 \\div 4 = 2$", why: "Up ÷ across." },
        ],
        done: "2. It slopes up, so it's positive ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Through (1, 1) and (3, 7)",
        start: "Find the gradient.",
        stages: [
          {
            prompt: "Up, from y = 1 to y = 7:",
            options: [
              { text: "6", correct: true, feedback: "" },
              { text: "8", feedback: "Take away: $7 - 1$." },
            ],
            then: "Up 6",
          },
          {
            prompt: "Across, from x = 1 to x = 3:",
            options: [
              { text: "2", correct: true, feedback: "" },
              { text: "4", feedback: "Take away: $3 - 1$." },
            ],
            then: "Across 2",
          },
          {
            prompt: "Gradient:",
            options: [
              { text: "$6 \\div 2 = 3$", correct: true, feedback: "" },
              {
                text: "$2 \\div 6 = \\frac13$",
                feedback: "That's across ÷ up. Gradient is up ÷ across.",
              },
            ],
            then: "Gradient 3",
          },
        ],
        done: "Up, across, divide.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Through (0, 5) and (4, −3)",
        picture: {
          kind: "graph",
          range: { xMin: -1, xMax: 5, yMin: -4, yMax: 6 },
          lines: [{ m: -2, c: 5 }],
          points: [
            { x: 0, y: 5 },
            { x: 4, y: -3 },
          ],
        },
        start: "Find the gradient.",
        stages: [
          {
            prompt: "Change in y, from 5 to −3:",
            options: [
              { text: "$-3 - 5 = -8$", correct: true, feedback: "" },
              { text: "$8$", feedback: "It goes down, so the change is negative." },
            ],
            then: "Change in y: −8",
          },
          {
            prompt: "Change in x is 4. Gradient:",
            options: [
              { text: "$-8 \\div 4 = -2$", correct: true, feedback: "" },
              { text: "$8 \\div 4 = 2$", feedback: "Keep the minus: the line slopes down." },
            ],
            then: "Gradient −2",
          },
        ],
        done: "Downhill: negative.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Through (1, 2) and (5, 4)",
        text: "Find the gradient.",
        answers: ["0.5", "1/2"],
        wrong: [{ answer: "2", feedback: "That's across ÷ up. Up is 2, across is 4." }],
        hint: "Up $4 - 2$, across $5 - 1$.",
        done: "$2 \\div 4 = 0.5$: a gentle slope.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Through (−1, 6) and (2, −3)",
        text: "Find the gradient.",
        answers: ["-3", "−3"],
        wrong: [{ answer: "3", feedback: "y goes down from 6 to −3: the change is −9." }],
        hint: "Change in y: $-3 - 6 = -9$. Change in x: $2 - (-1) = 3$.",
        done: "$-9 \\div 3 = -3$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Jo says the gradient from (2, 1) to (6, 9) is $4 \\div 8 = 0.5$. Is she right?",
        options: [
          {
            text: "No: it's up ÷ across, $8 \\div 4 = 2$",
            correct: true,
            feedback: "Dividing the wrong way round is the most common slip. Up goes on top.",
          },
          { text: "Yes", feedback: "4 is across and 8 is up. Gradient is up ÷ across." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo finds the gradient from (0, 5) to (4, −3).",
        lines: [
          "Change in y: 5 to −3 is 8",
          "Change in x: 0 to 4 is 4",
          "Gradient $= 8 \\div 4 = 2$",
        ],
        wrong: 0,
        why: "y goes **down** from 5 to −3: the change is $-3 - 5 = -8$. The gradient is −2: the line slopes down.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Is the ramp too steep?",
        start: "The ramp rises 0.5 m over 5 m. The most allowed is 0.083.",
        stages: [
          {
            prompt: "Its gradient:",
            options: [
              { text: "$0.5 \\div 5 = 0.1$", correct: true, feedback: "" },
              { text: "$5 \\div 0.5 = 10$", feedback: "Up ÷ across: $0.5 \\div 5$." },
            ],
            then: "Gradient 0.1",
          },
          {
            prompt: "So the ramp is",
            options: [
              { text: "too steep: 0.1 is more than 0.083", correct: true, feedback: "" },
              {
                text: "fine: 0.1 is less than 0.083",
                feedback: "0.1 is 0.100, which is more than 0.083.",
              },
            ],
            then: "Too steep.",
          },
        ],
        done: "To be allowed, a 0.5 m rise needs at least $0.5 \\times 12 = 6$ m along.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Find the gradient of the line through (1, 2) and (3, 8).",
            answers: ["3"],
            why: "Up 6, across 2: $6 \\div 2 = 3$.",
            retry: {
              prompt: "Find the gradient of the line through (2, 1) and (4, 9).",
              answers: ["4"],
              why: "Up 8, across 2: $8 \\div 2 = 4$.",
            },
          },
          {
            prompt: "Find the gradient of the line through (0, 6) and (3, 0).",
            answers: ["-2", "−2"],
            why: "Change in y −6, across 3: $-6 \\div 3 = -2$.",
            retry: {
              prompt: "Find the gradient of the line through (1, 5) and (3, −1).",
              answers: ["-3", "−3"],
              why: "Change in y −6, across 2: $-6 \\div 2 = -3$.",
            },
          },
          {
            prompt: "A line slopes down from left to right. Its gradient is",
            options: ["negative", "positive", "zero"],
            answers: ["negative"],
            why: "Downhill: y falls as x rises.",
            retry: {
              prompt: "A flat, level line has a gradient of",
              options: ["0", "1", "−1"],
              answers: ["0"],
              why: "No change in y at all.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-straight-line",
    id: "y9-straight-line/intercept",
    before: INTERCEPT,
    title: "Where it starts",
    summary: "The intercept: where the line crosses the y-axis, at x = 0.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A taxi fare",
        text: [
          "The graph shows a taxi's fare, in pounds, for each kilometre driven. Even before it moves, the meter isn't at zero.",
          "How much do you pay just to get in? And what is the line's equation? By the end of this lesson, you can read both.",
        ],
        picture: { kind: "graph", range: taxi, lines: [{ m: 2, c: 3 }] },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Where on a graph is x = 0?",
        options: [
          {
            text: "On the y-axis",
            correct: true,
            feedback: "The y-axis is the upright line where x is 0.",
          },
          { text: "On the x-axis", feedback: "On the x-axis, y is 0." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "$y = 2x + 3$. Find y when $x = 0$.",
        answers: ["3"],
        hint: "$2 \\times 0 + 3$.",
        done: "$0 + 3 = 3$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Where does $y = 2x + 3$ cross the y-axis?",
        picture: {
          kind: "graph",
          range: { xMin: -3, xMax: 3, yMin: -3, yMax: 9 },
          lines: [{ m: 2, c: 3 }],
        },
        options: [
          { text: "(0, 3)", correct: true, feedback: "At x = 0, y = 3. The +3 in the equation." },
          { text: "(0, 2)", feedback: "2 is the gradient: how steep it is." },
          { text: "(3, 0)", feedback: "That's on the x-axis. On the y-axis, x is 0." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The intercept",
        text: [
          "In $y = mx + c$, m is the gradient and c is the **intercept**: where the line crosses the y-axis.",
          "That's because at x = 0, $mx$ is 0 and y is just c.",
        ],
        picture: { kind: "maths", tex: "y = mx + c \\quad \\xrightarrow{x = 0} \\quad y = c" },
      },
      {
        kind: "slider",
        tag: "Discover",
        title: "Move the intercept",
        text: "Slide c in $y = 3x + c$ until the line goes through the star at (1, 5).",
        range: { xMin: -3, xMax: 3, yMin: -6, yMax: 10 },
        vary: "c",
        start: { m: 3, c: 0 },
        min: -5,
        max: 5,
        star: { x: 1, y: 5 },
        done: "c = 2: $y = 3x + 2$. Changing c slides the line up or down.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "From a point",
        problem: "A line has gradient 3 and goes through (2, 7). Find its intercept.",
        steps: [
          { line: "$y = 3x + c$", why: "We know m is 3." },
          {
            line: "$7 = 3 \\times 2 + c$",
            why: "The point (2, 7) is on the line: put x = 2 and y = 7 in.",
          },
          { line: "$7 = 6 + c$, so $c = 1$", why: "Solve for c." },
        ],
        done: "$y = 3x + 1$. Check: $3 \\times 2 + 1 = 7$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Gradient 2, through (3, 10)",
        start: "$y = 2x + c$",
        stages: [
          {
            prompt: "Put in the point (3, 10):",
            options: [
              { text: "$10 = 2 \\times 3 + c$", correct: true, feedback: "" },
              { text: "$3 = 2 \\times 10 + c$", feedback: "x is 3 and y is 10." },
            ],
            then: "$10 = 6 + c$",
          },
          {
            prompt: "So c is",
            options: [
              { text: "4", correct: true, feedback: "" },
              { text: "16", feedback: "Take 6 away from both sides." },
            ],
            then: "$c = 4$: $y = 2x + 4$",
          },
        ],
        done: "Put the point in, then solve for c.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Gradient −1, through (2, 5)",
        start: "$y = -x + c$",
        stages: [
          {
            prompt: "Put in the point (2, 5):",
            options: [
              { text: "$5 = -2 + c$", correct: true, feedback: "" },
              { text: "$5 = 2 + c$", feedback: "$-1 \\times 2 = -2$." },
            ],
            then: "$5 = -2 + c$",
          },
          {
            prompt: "So c is",
            options: [
              { text: "7", correct: true, feedback: "" },
              { text: "3", feedback: "Add 2 to both sides: $5 + 2$." },
            ],
            then: "$c = 7$: $y = -x + 7$",
          },
        ],
        done: "Watch the signs when the gradient is negative.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Where does $y = 5x - 2$ cross the y-axis?",
        options: [
          { text: "(0, −2)", correct: true, feedback: "c is −2." },
          { text: "(0, 5)", feedback: "5 is the gradient." },
          { text: "(0, 2)", feedback: "Keep the sign: −2." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Gradient 4, through (1, 3)",
        text: "Find c.",
        answers: ["-1", "−1"],
        wrong: [{ answer: "7", feedback: "$3 = 4 + c$: take 4 away, don't add it." }],
        hint: "$3 = 4 \\times 1 + c$.",
        done: "$3 = 4 + c$, so $c = -1$: $y = 4x - 1$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Where does $y = 3x - 4$ cross the y-axis?",
        options: [
          { text: "(0, −4)", correct: true, feedback: "On the y-axis x is 0, so y is −4." },
          { text: "(0, 3)", feedback: "3 is the gradient. Mixing up m and c is the common slip." },
          { text: "(−4, 0)", feedback: "That's on the x-axis. On the y-axis, x is 0." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ana finds the line with gradient 2 through (3, 11).",
        lines: ["$y = 2x + c$", "$11 = 2 \\times 3 + c$", "$c = 11 + 6 = 17$"],
        wrong: 2,
        why: "To get c alone, take 6 from both sides: $c = 11 - 6 = 5$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "A taxi fare",
        picture: {
          kind: "graph",
          range: taxi,
          lines: [{ m: 2, c: 3 }],
          points: [
            { x: 0, y: 3 },
            { x: 1, y: 5 },
          ],
        },
        start: "Read the graph.",
        stages: [
          {
            prompt: "Where does the line cross the fare axis?",
            options: [
              { text: "At £3: that's the cost to get in", correct: true, feedback: "" },
              { text: "At £0", feedback: "Look where the line meets the upright axis." },
            ],
            then: "Intercept 3",
          },
          {
            prompt: "Each km adds £2. The equation is",
            options: [
              { text: "$y = 2x + 3$", correct: true, feedback: "" },
              {
                text: "$y = 3x + 2$",
                feedback: "The gradient, 2, goes with x; the intercept, 3, is on its own.",
              },
            ],
            then: "$y = 2x + 3$",
          },
        ],
        done: "£3 to get in, then £2 a kilometre.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What is the intercept of $y = 4x + 7$?",
            options: ["7", "4", "−7"],
            answers: ["7"],
            why: "c, the number on its own.",
            retry: {
              prompt: "What is the intercept of $y = -2x + 5$?",
              options: ["5", "−2", "2"],
              answers: ["5"],
              why: "c, the number on its own.",
            },
          },
          {
            prompt: "A line with gradient 3 goes through (2, 8). Find c.",
            answers: ["2"],
            why: "$8 = 6 + c$, so $c = 2$.",
            retry: {
              prompt: "A line with gradient 2 goes through (4, 5). Find c.",
              answers: ["-3", "−3"],
              why: "$5 = 8 + c$, so $c = -3$.",
            },
          },
          {
            prompt: "Where does $y = 6 - x$ cross the y-axis?",
            options: ["(0, 6)", "(0, −1)", "(6, 0)"],
            answers: ["(0, 6)"],
            why: "At x = 0, y = 6.",
            retry: {
              prompt: "Where does $y = 9 - 3x$ cross the y-axis?",
              options: ["(0, 9)", "(0, −3)", "(3, 0)"],
              answers: ["(0, 9)"],
              why: "At x = 0, y = 9.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-straight-line",
    id: "y9-straight-line/parallel",
    before: PARALLEL,
    title: "Parallel lines",
    summary: "Parallel lines have the same gradient and never meet.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Railway tracks",
        text: [
          "On a map, one rail of a railway runs along $y = 2x + 1$. The other rail runs alongside it, never getting closer, and crosses the y-axis at 4.",
          "What is its equation? By the end of this lesson, you can write it.",
        ],
        picture: {
          kind: "graph",
          range: { xMin: -3, xMax: 3, yMin: -5, yMax: 10 },
          lines: [{ m: 2, c: 1 }],
          points: [{ x: 0, y: 4 }],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "The gradient of $y = 3x + 1$",
        answers: ["3"],
        hint: "The number with x.",
        done: "m = 3.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "The intercept of $y = 3x + 1$",
        answers: ["1"],
        hint: "The number on its own.",
        done: "c = 1.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Which two lines are parallel?",
        picture: {
          kind: "graph",
          range: wide,
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
            feedback: "The same gradient, 2: equally steep, so they never meet.",
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
        kind: "explain",
        tag: "Discover",
        title: "Same gradient, different intercept",
        text: [
          "**Parallel** lines are equally steep: they have the same gradient, m.",
          "Only c, where they cross the y-axis, is different.",
        ],
        picture: {
          kind: "graph",
          range: wide,
          lines: [
            { m: 2, c: 1 },
            { m: 2, c: -3 },
          ],
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Parallel, through (0, 6)",
        problem: "Find the line parallel to $y = 4x - 1$ that crosses the y-axis at 6.",
        steps: [
          { line: "$m = 4$", why: "Parallel: the same gradient." },
          { line: "$c = 6$", why: "It crosses the y-axis at 6." },
          { line: "$y = 4x + 6$", why: "Put them together." },
        ],
        done: "$y = 4x + 6$: as steep as $y = 4x - 1$, but 7 higher up.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Parallel to $y = 3x + 2$, through (0, −5)",
        start: "Find the equation.",
        stages: [
          {
            prompt: "The gradient is",
            options: [
              { text: "3, the same", correct: true, feedback: "" },
              { text: "2", feedback: "2 is the intercept. The gradient is the number with x." },
              { text: "−3", feedback: "Parallel lines have the same gradient, not the opposite." },
            ],
            then: "$m = 3$",
          },
          {
            prompt: "So the line is",
            options: [
              { text: "$y = 3x - 5$", correct: true, feedback: "" },
              { text: "$y = -5x + 3$", feedback: "3 is the gradient; −5 is where it crosses." },
            ],
            then: "$y = 3x - 5$",
          },
        ],
        done: "Keep m, change c.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Parallel to $y = 2x + 1$, through (3, 10)",
        start: "This time the point isn't on the y-axis.",
        stages: [
          {
            prompt: "The gradient is 2. Put in the point (3, 10):",
            options: [
              { text: "$10 = 2 \\times 3 + c$", correct: true, feedback: "" },
              { text: "$10 = 2 \\times 10 + c$", feedback: "x is 3." },
            ],
            then: "$10 = 6 + c$",
          },
          {
            prompt: "So the line is",
            options: [
              { text: "$y = 2x + 4$", correct: true, feedback: "" },
              { text: "$y = 2x + 16$", feedback: "$c = 10 - 6$." },
            ],
            then: "$y = 2x + 4$",
          },
        ],
        done: "Same gradient; find c from the point.",
      },
      {
        kind: "slider",
        tag: "Your turn",
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
        kind: "sort",
        tag: "Your turn",
        title: "Parallel to $y = 2x + 5$?",
        groups: ["Parallel", "Not parallel"],
        items: [
          { text: "$y = 2x - 1$", group: 0, why: "Gradient 2." },
          { text: "$y = 2x$", group: 0, why: "Gradient 2, through (0, 0)." },
          {
            text: "$y = 5 + 2x$",
            group: 0,
            why: "The same as $y = 2x + 5$ written the other way round: gradient 2.",
          },
          { text: "$y = 5x + 2$", group: 1, why: "Gradient 5." },
          { text: "$y = -2x + 5$", group: 1, why: "Gradient −2: it slopes down." },
          { text: "$y = x + 5$", group: 1, why: "Gradient 1." },
        ],
        done: "Look only at the number with x.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Are $y = 3x + 1$ and $y = 3 + x$ parallel?",
        options: [
          {
            text: "No: their gradients are 3 and 1",
            correct: true,
            feedback: "The 3 in $3 + x$ is the intercept. Find the number **with x**.",
          },
          {
            text: "Yes: both have a 3",
            feedback: "In $y = 3 + x$, the 3 is on its own: the gradient is 1.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ben finds the line parallel to $y = 5x + 2$ through (1, 9).",
        lines: [
          "Parallel, so the gradient is 5",
          "$9 = 5 \\times 1 + c$, so $c = 4$",
          "The line is $y = 4x + 5$",
        ],
        wrong: 2,
        why: "He swapped them: m is 5 and c is 4, so $y = 5x + 4$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Railway tracks",
        start: "The first rail is $y = 2x + 1$; the second crosses the y-axis at 4.",
        stages: [
          {
            prompt: "Never getting closer means the second rail has gradient",
            options: [
              { text: "2", correct: true, feedback: "" },
              { text: "4", feedback: "4 is where it crosses the y-axis." },
            ],
            then: "$m = 2$",
          },
          {
            prompt: "So its equation is",
            options: [
              { text: "$y = 2x + 4$", correct: true, feedback: "" },
              { text: "$y = 4x + 1$", feedback: "That's steeper, so the rails would cross." },
            ],
            then: "$y = 2x + 4$",
          },
        ],
        done: "Same gradient, so the rails stay the same distance apart forever.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Which line is parallel to $y = 4x - 3$?",
            options: ["$y = 4x + 7$", "$y = 3x - 4$", "$y = -4x - 3$"],
            answers: ["$y = 4x + 7$"],
            why: "Gradient 4.",
            retry: {
              prompt: "Which line is parallel to $y = -2x + 1$?",
              options: ["$y = -2x - 5$", "$y = 2x + 1$", "$y = x - 2$"],
              answers: ["$y = -2x - 5$"],
              why: "Gradient −2.",
            },
          },
          {
            prompt: "The line parallel to $y = 3x + 1$ through (0, 5) is",
            options: ["$y = 3x + 5$", "$y = 5x + 1$", "$y = 3x + 6$"],
            answers: ["$y = 3x + 5$"],
            why: "Gradient 3, intercept 5.",
            retry: {
              prompt: "The line parallel to $y = x - 2$ through (0, 7) is",
              options: ["$y = x + 7$", "$y = 7x - 2$", "$y = x + 5$"],
              answers: ["$y = x + 7$"],
              why: "Gradient 1, intercept 7.",
            },
          },
          {
            prompt: "A line parallel to $y = 2x$ goes through (2, 9). What is its intercept, c?",
            answers: ["5"],
            why: "$9 = 4 + c$, so $c = 5$.",
            retry: {
              prompt: "A line parallel to $y = 3x$ goes through (1, 4). What is its intercept, c?",
              answers: ["1"],
              why: "$4 = 3 + c$, so $c = 1$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-straight-line",
    id: "y9-straight-line/rearrange",
    before: REARRANGE,
    title: "Into y = mx + c",
    summary: "Rearrange any line's equation to get y on its own, then read m and c.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Will the roads meet?",
        text: [
          "On a plan, one road follows $y = -2x + 8$ and another follows $2y + 4x = 6$.",
          "Will they ever cross? You can't tell yet. By the end of this lesson, you can.",
        ],
        picture: { kind: "maths", tex: "y = -2x + 8 \\qquad 2y + 4x = 6" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Solve $2y = 10$",
        answers: ["5"],
        hint: "Divide both sides by 2.",
        done: "$y = 5$.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Take $3x$ from both sides of $y + 3x = 7$",
        options: [
          {
            text: "$y = 7 - 3x$",
            correct: true,
            feedback: "The $+3x$ goes, and $-3x$ appears on the other side.",
          },
          { text: "$y = 7 + 3x$", feedback: "Taking 3x away makes it $-3x$." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "$y = 7 - 3x$ is the same line as",
        options: [
          {
            text: "$y = -3x + 7$: gradient −3, intercept 7",
            correct: true,
            feedback: "The order doesn't matter, but the minus stays with the 3x.",
          },
          { text: "$y = 3x - 7$: gradient 3", feedback: "The minus belongs to the 3x, not the 7." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Get y on its own",
        text: [
          "You can only read m and c when the equation is $y = mx + c$, with **y on its own**.",
          "So rearrange: move the x term across, then divide **every** term by the number in front of y.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{aligned} 2y + 4x &= 6 \\\\ 2y &= -4x + 6 \\\\ y &= -2x + 3 \\end{aligned}",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Rearrange $2y + 4x = 6$",
        problem: "Find the gradient and intercept of $2y + 4x = 6$.",
        steps: [
          { line: "$2y = 6 - 4x$", why: "Take 4x from both sides." },
          { line: "$y = 3 - 2x$", why: "Divide every term by 2." },
          { line: "$y = -2x + 3$", why: "Write it as $y = mx + c$." },
        ],
        done: "Gradient −2, intercept 3.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Rearrange $y - 2x = 5$",
        start: "$y - 2x = 5$",
        stages: [
          {
            prompt: "Add 2x to both sides:",
            options: [
              { text: "$y = 2x + 5$", correct: true, feedback: "" },
              { text: "$y = 5 - 2x$", feedback: "Undo $-2x$ by adding: it becomes $+2x$." },
            ],
            then: "$y = 2x + 5$",
          },
          {
            prompt: "The gradient is",
            options: [
              { text: "2", correct: true, feedback: "" },
              { text: "−2", feedback: "After rearranging it's $+2x$." },
            ],
            then: "Gradient 2, intercept 5",
          },
        ],
        done: "y on its own first; then read m and c.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Rearrange $3y - 6x = 12$",
        start: "$3y - 6x = 12$",
        stages: [
          {
            prompt: "Add 6x to both sides:",
            options: [
              { text: "$3y = 6x + 12$", correct: true, feedback: "" },
              { text: "$3y = 12 - 6x$", feedback: "Undo $-6x$ by adding 6x." },
            ],
            then: "$3y = 6x + 12$",
          },
          {
            prompt: "Divide every term by 3:",
            options: [
              { text: "$y = 2x + 4$", correct: true, feedback: "" },
              { text: "$y = 2x + 12$", feedback: "Divide the 12 by 3 as well." },
              { text: "$y = 6x + 4$", feedback: "Divide the 6x by 3 as well." },
            ],
            then: "$y = 2x + 4$",
          },
        ],
        done: "Gradient 2, intercept 4.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Rearrange $x + y = 4$",
        options: [
          { text: "$y = -x + 4$: gradient −1", correct: true, feedback: "Take x from both sides." },
          { text: "$y = x + 4$: gradient 1", feedback: "Taking x away makes it $-x$." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Rearrange $4y = 8x - 12$",
        options: [
          { text: "$y = 2x - 3$", correct: true, feedback: "Divide every term by 4." },
          { text: "$y = 2x - 12$", feedback: "Divide the −12 by 4 too." },
          { text: "$y = 8x - 12$", feedback: "y isn't on its own yet: divide by 4." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "The gradient of $5y + 10x = 20$",
        answers: ["-2", "−2"],
        wrong: [
          { answer: "10", feedback: "Rearrange first: get y on its own." },
          { answer: "2", feedback: "Taking 10x away makes it negative." },
        ],
        hint: "$5y = -10x + 20$, then divide by 5.",
        done: "$y = -2x + 4$: gradient −2.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "What is the gradient of $2y = 6x + 4$?",
        options: [
          {
            text: "3: divide by 2 first, $y = 3x + 2$",
            correct: true,
            feedback: "Reading m before y is on its own is the common slip.",
          },
          { text: "6", feedback: "That's the number with x, but y isn't on its own yet: $2y$." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Isla rearranges $2y + 6x = 8$.",
        lines: ["$2y = 8 - 6x$", "$y = 4 - 6x$", "So the gradient is −6"],
        wrong: 1,
        why: "Divide **every** term by 2: $y = 4 - 3x$, so the gradient is −3.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Will the roads meet?",
        start: "One road is $y = -2x + 8$. Rearrange the other, $2y + 4x = 6$.",
        stages: [
          {
            prompt: "$2y + 4x = 6$ becomes",
            options: [
              { text: "$y = -2x + 3$", correct: true, feedback: "" },
              { text: "$y = -4x + 6$", feedback: "Divide every term by 2." },
            ],
            then: "$y = -2x + 3$",
          },
          {
            prompt: "Both roads have gradient −2. So they",
            options: [
              { text: "are parallel, and never meet", correct: true, feedback: "" },
              {
                text: "cross at the y-axis",
                feedback: "They cross the y-axis at 8 and at 3: different places.",
              },
            ],
            then: "Parallel.",
          },
        ],
        done: "Rearranging showed what the equation was hiding.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Rearrange $y - 3x = 2$.",
            options: ["$y = 3x + 2$", "$y = -3x + 2$", "$y = 2x + 3$"],
            answers: ["$y = 3x + 2$"],
            why: "Add 3x to both sides.",
            retry: {
              prompt: "Rearrange $y + 5x = 1$.",
              options: ["$y = -5x + 1$", "$y = 5x + 1$", "$y = x - 5$"],
              answers: ["$y = -5x + 1$"],
              why: "Take 5x from both sides.",
            },
          },
          {
            prompt: "Rearrange $2y = 8x + 6$.",
            options: ["$y = 4x + 3$", "$y = 4x + 6$", "$y = 8x + 3$"],
            answers: ["$y = 4x + 3$"],
            why: "Divide every term by 2.",
            retry: {
              prompt: "Rearrange $3y = 9x - 6$.",
              options: ["$y = 3x - 2$", "$y = 3x - 6$", "$y = 9x - 2$"],
              answers: ["$y = 3x - 2$"],
              why: "Divide every term by 3.",
            },
          },
          {
            prompt: "What is the gradient of $2y + 6x = 10$?",
            answers: ["-3", "−3"],
            why: "$y = -3x + 5$.",
            retry: {
              prompt: "What is the gradient of $4y - 8x = 12$?",
              answers: ["2"],
              why: "$y = 2x + 3$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-straight-line",
    id: "y9-straight-line/meaning",
    before: MEANING,
    title: "What the line means",
    summary: "In real life, the gradient is a rate and the intercept is where it starts.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A burning candle",
        text: [
          "A candle's height, in cm, after t hours is $h = 12 - 2t$.",
          "How tall was it to start, how fast does it burn, and when will it burn out? By the end of this lesson, the equation tells you.",
        ],
        picture: { kind: "graph", range: candle, lines: [{ m: -2, c: 12 }] },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "In $y = 3x + 2$",
        options: [
          {
            text: "the gradient is 3 and the intercept is 2",
            correct: true,
            feedback: "m goes with x; c is on its own.",
          },
          {
            text: "the gradient is 2 and the intercept is 3",
            feedback: "The gradient is the number with x.",
          },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "$y = 3x + 2$. Find y when $x = 4$.",
        answers: ["14"],
        hint: "$3 \\times 4 + 2$.",
        done: "$12 + 2 = 14$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "A taxi costs $C = 2d + 3$ pounds for d km. What does the 3 mean?",
        picture: { kind: "graph", range: taxi, lines: [{ m: 2, c: 3 }] },
        options: [
          {
            text: "£3 just to get in, before you go anywhere",
            correct: true,
            feedback: "When d = 0, C = 3: the intercept is the starting value.",
          },
          { text: "£3 for each km", feedback: "Each km adds the number with d: £2." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "And what does the 2 mean?",
        options: [
          {
            text: "Each extra km costs £2",
            correct: true,
            feedback: "The gradient is a **rate**: how much C goes up for each 1 of d.",
          },
          { text: "The ride takes 2 km", feedback: "It's how much the cost rises per km." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Rate and start",
        text: [
          "In a real situation, the **gradient** is a rate: the change for each one unit. The **intercept** is the starting value, when the other quantity is 0.",
          "A negative gradient means it's going down: like a candle burning, or a tank emptying.",
        ],
        picture: {
          kind: "maths",
          tex: "C = \\underbrace{2}_{\\text{per km}} d + \\underbrace{3}_{\\text{at the start}}",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A phone plan",
        problem:
          "A phone plan costs $C = 5n + 10$ pounds a month, where n is the GB of data used. What do the 5 and the 10 mean?",
        steps: [
          {
            line: "10 is the intercept: £10 a month even with no data",
            why: "When n = 0, C = 10.",
          },
          { line: "5 is the gradient: £5 for each GB", why: "Each 1 GB more adds £5." },
          { line: "3 GB costs $5 \\times 3 + 10 = £25$", why: "Use it to predict." },
        ],
        done: "The equation is a story: a fixed charge plus a rate.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "An emptying tank",
        text: "A tank holds $V = 200 - 15t$ litres after t minutes.",
        start: "$V = 200 - 15t$",
        stages: [
          {
            prompt: "The 200 means",
            options: [
              { text: "it starts with 200 litres", correct: true, feedback: "" },
              {
                text: "it empties in 200 minutes",
                feedback: "At t = 0, V = 200: that's how much it starts with.",
              },
            ],
            then: "Starts with 200 litres",
          },
          {
            prompt: "The −15 means",
            options: [
              { text: "it loses 15 litres a minute", correct: true, feedback: "" },
              { text: "it gains 15 litres a minute", feedback: "Negative: going down." },
            ],
            then: "Drains 15 litres a minute",
          },
        ],
        done: "Start at 200, down 15 each minute.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A growing plant",
        picture: {
          kind: "graph",
          range: { xMin: 0, xMax: 5, yMin: 0, yMax: 12 },
          lines: [{ m: 2, c: 2 }],
          points: [
            { x: 0, y: 2 },
            { x: 4, y: 10 },
          ],
        },
        start: "The graph shows a plant's height, in cm, after w weeks.",
        stages: [
          {
            prompt: "Its height when planted is",
            options: [
              { text: "2 cm: the intercept", correct: true, feedback: "" },
              { text: "0 cm", feedback: "Read where the line meets the height axis, at w = 0." },
            ],
            then: "Starts at 2 cm",
          },
          {
            prompt: "From (0, 2) to (4, 10), it grows",
            options: [
              { text: "$8 \\div 4 = 2$ cm a week", correct: true, feedback: "" },
              {
                text: "10 cm a week",
                feedback: "That's its height after 4 weeks. The rate is up ÷ across.",
              },
            ],
            then: "2 cm a week: $h = 2w + 2$",
          },
        ],
        done: "Read the start from the intercept and the rate from the gradient.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "A battery's charge is $B = 100 - 4h$ % after h hours. The −4 means",
        options: [
          {
            text: "it loses 4% an hour",
            correct: true,
            feedback: "The gradient: a rate, going down.",
          },
          { text: "it lasts 4 hours", feedback: "It lasts until $100 - 4h = 0$: 25 hours." },
          { text: "it starts at 4%", feedback: "It starts at 100%: the intercept." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A plumber charges $C = 30h + 45$ pounds for h hours. What's the call-out fee?",
        answers: ["45"],
        wrong: [
          { answer: "30", feedback: "£30 is each hour. The call-out is what you pay at h = 0." },
        ],
        hint: "What does it cost when h = 0?",
        done: "£45 just to come out, then £30 an hour.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "For $C = 30h + 45$, Sam says the call-out fee is £30. Is he right?",
        options: [
          {
            text: "No: the call-out is the intercept, £45",
            correct: true,
            feedback:
              "£30 is the rate per hour. Mixing up the rate and the start is the common slip.",
          },
          { text: "Yes", feedback: "At h = 0, C = 45." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Kofi reads the candle's equation, $h = 12 - 2t$.",
        lines: [
          "At the start, t = 0, so it's 12 cm tall",
          "It burns 2 cm per hour",
          "So it burns out after 2 hours",
        ],
        wrong: 2,
        why: "It burns out when $12 - 2t = 0$: $t = 6$ hours. The 2 is how fast, not how long.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "A burning candle",
        picture: { kind: "graph", range: candle, lines: [{ m: -2, c: 12 }] },
        start: "$h = 12 - 2t$",
        stages: [
          {
            prompt: "Its height at the start:",
            options: [
              { text: "12 cm", correct: true, feedback: "" },
              { text: "2 cm", feedback: "At t = 0, h = 12." },
            ],
            then: "12 cm",
          },
          {
            prompt: "How fast it burns:",
            options: [
              { text: "2 cm an hour", correct: true, feedback: "" },
              {
                text: "12 cm an hour",
                feedback: "12 is the start; the rate is the number with t.",
              },
            ],
            then: "2 cm an hour",
          },
          {
            prompt: "It burns out after",
            options: [
              { text: "6 hours", correct: true, feedback: "" },
              { text: "2 hours", feedback: "$12 - 2t = 0$ when $t = 6$." },
            ],
            then: "6 hours: where the line meets the time axis",
          },
        ],
        done: "One equation told the whole story.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A party costs $C = 20g + 50$ pounds for g guests. The 50 is",
            options: ["a fixed charge", "the cost per guest", "the number of guests"],
            answers: ["a fixed charge"],
            why: "At g = 0, C = 50.",
            retry: {
              prompt: "A plant's height is $h = 3w + 5$ cm after w weeks. The 3 is",
              options: ["the growth each week", "its height at the start", "the number of weeks"],
              answers: ["the growth each week"],
              why: "The gradient is the rate.",
            },
          },
          {
            prompt: "A taxi costs $C = 2d + 4$ pounds for d km. What does a 0 km ride cost?",
            answers: ["4"],
            why: "The intercept: £4.",
            retry: {
              prompt: "A taxi costs $C = 3d + 2$ pounds for d km. What does 5 km cost?",
              answers: ["17"],
              why: "$15 + 2 = 17$.",
            },
          },
          {
            prompt:
              "A tank holds $V = 120 - 8t$ litres after t minutes. After how many minutes is it empty?",
            answers: ["15"],
            why: "$120 \\div 8 = 15$.",
            retry: {
              prompt:
                "A tank holds $V = 100 - 5t$ litres after t minutes. After how many minutes is it empty?",
              answers: ["20"],
              why: "$100 \\div 5 = 20$.",
            },
          },
        ],
      },
    ],
  },
];
