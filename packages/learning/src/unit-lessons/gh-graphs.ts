// GCSE Higher, "Graphs of functions", as seven short lessons, one just before each skill:
// exponential graphs, the graphs of sin, cos and tan, translating and reflecting graphs,
// exponential graphs in context, gradients of curves, areas under graphs, and what gradients and
// areas mean on a velocity–time graph. Each recaps the Foundation idea quickly, builds it to
// Higher level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Picture, Point, UnitLesson } from "./types.ts";

const U = "gh-graphs";
const P = (x: number, y: number): Point => ({ x, y });

interface Axes {
  /** The drawing's x range, in drawing units. */
  x: [number, number];
  y: [number, number];
  /** Labels along the x-axis, at drawing positions. */
  xTicks?: [at: number, label: string][];
  yTicks?: [at: number, label: string][];
}

/** Curves (as short straight pieces) on a pair of axes, with optional tick labels and dashes. */
function curves(
  axes: Axes,
  fs: { f: (x: number) => number; from?: number; to?: number; tone?: "find" | "soft" | "main" }[],
  extra: DrawingPic["items"] = [],
): DrawingPic {
  const [x0, x1] = axes.x;
  const [y0, y1] = axes.y;
  const items: DrawingPic["items"] = [
    { line: [P(x0, 0), P(x1, 0)], arrow: 1 },
    { line: [P(0, y0), P(0, y1)], arrow: 1 },
    { text: "x", at: P(x1 + 0.3, 0.3) },
    { text: "y", at: P(0.35, y1 - 0.1) },
  ];
  for (const [at, label] of axes.xTicks ?? []) items.push({ text: label, at: P(at, -0.45) });
  for (const [at, label] of axes.yTicks ?? []) items.push({ text: label, at: P(-0.45, at) });
  for (const { f, from = x0, to = x1, tone = "find" } of fs) {
    const n = 40;
    for (let i = 0; i < n; i++) {
      const a = from + ((to - from) * i) / n;
      const b = from + ((to - from) * (i + 1)) / n;
      const fa = f(a);
      const fb = f(b);
      // Leave out pieces that run off the top or bottom.
      if (Math.max(fa, fb) > y1 + 0.2 || Math.min(fa, fb) < y0 - 0.2) continue;
      items.push({ line: [P(a, fa), P(b, fb)], tone });
    }
  }
  items.push(...extra);
  return {
    kind: "drawing",
    frame: { xMin: x0 - 0.6, xMax: x1 + 0.6, yMin: y0 - 0.6, yMax: y1 + 0.3 },
    items,
  };
}

const expAxes: Axes = {
  x: [-3, 2.5],
  y: [-0.5, 4.8],
  xTicks: [
    [1, "1"],
    [2, "2"],
    [-1, "−1"],
    [-2, "−2"],
  ],
  yTicks: [
    [1, "1"],
    [2, "2"],
    [4, "4"],
  ],
};
const exponential = curves(expAxes, [{ f: (x) => 2 ** x }]);
const twoExps = curves(expAxes, [{ f: (x) => 2 ** x }, { f: (x) => 0.5 ** x, tone: "soft" }]);

// Angles drawn at one unit per 45°, so 360° is 8 units across.
const r = (x: number) => (x * 45 * Math.PI) / 180;
const trigAxes: Axes = {
  x: [0, 8.2],
  y: [-1.6, 1.6],
  xTicks: [
    [2, "90°"],
    [4, "180°"],
    [6, "270°"],
    [8, "360°"],
  ],
  yTicks: [
    [1, "1"],
    [-1, "−1"],
  ],
};
const sine = curves(trigAxes, [{ f: (x) => Math.sin(r(x)) }]);
const cosine = curves(trigAxes, [{ f: (x) => Math.cos(r(x)) }]);
const tangent = curves(
  { ...trigAxes, y: [-2.5, 2.5], yTicks: [] },
  [
    { f: (x) => Math.tan(r(x)), from: 0, to: 1.85 },
    { f: (x) => Math.tan(r(x)), from: 2.15, to: 5.85 },
    { f: (x) => Math.tan(r(x)), from: 6.15, to: 8 },
  ],
  [
    { line: [P(2, -2.5), P(2, 2.5)], dashed: true, tone: "soft" },
    { line: [P(6, -2.5), P(6, 2.5)], dashed: true, tone: "soft" },
  ],
);
const shifted: Picture = {
  kind: "graph",
  range: { xMin: -3, xMax: 5, yMin: -2, yMax: 8 },
  curves: [
    { kind: "quadratic", a: 1, b: 0, c: 0 },
    { kind: "quadratic", a: 1, b: -4, c: 4 },
  ],
};
const curveTangent = curves(
  {
    x: [0, 4.5],
    y: [0, 8],
    xTicks: [
      [1, "1"],
      [2, "2"],
      [3, "3"],
      [4, "4"],
    ],
    yTicks: [
      [4, "4"],
      [8, "8"],
    ],
  },
  [{ f: (x) => (x * x) / 2 }, { f: (x) => 2 * x - 2, from: 1, to: 4, tone: "soft" }],
);
const velocity: DrawingPic = {
  kind: "drawing",
  items: [
    { line: [P(0, 0), P(6.3, 0)] },
    { line: [P(0, 0), P(0, 4.3)] },
    { text: "time (s)", at: P(3, -0.9) },
    { text: "velocity (m/s)", at: P(1.6, 4.8) },
    { text: "0", at: P(-0.35, -0.35) },
    { text: "10", at: P(2, -0.4) },
    { text: "30", at: P(6, -0.4) },
    { text: "20", at: P(-0.45, 4) },
    { line: [P(0, 0), P(2, 4)], tone: "find" },
    { line: [P(2, 4), P(6, 4)], tone: "find" },
    { line: [P(2, 0), P(2, 4)], dashed: true, tone: "soft" },
  ],
};

export const ghGraphs: UnitLesson[] = [
  lesson(
    U,
    "exponential",
    "GH-A12.a",
    "Exponential graphs",
    "y = kˣ passes through (0, 1), grows ever faster and never touches the x-axis.",
    [
      problem(
        "Which graph?",
        [
          "“Sketch $y = 2^x$.” And “Which of $y = 2^x$ and $y = (\\frac12)^x$ is decreasing?”",
          "By the end of this lesson, you can recognise and sketch exponential graphs.",
        ],
        exponential,
      ),
      typed("Warm-up", "$2^0$", "1", "Anything to the power 0.", "1."),
      typed("Warm-up", "$2^{-1}$", "0.5", "Reciprocal.", "0.5."),
      explain(
        "Discover",
        "Doubling",
        [
          "$y = 2^x$: each step of 1 to the right doubles $y$. It goes through **(0, 1)**, since $2^0 = 1$, and climbs ever more steeply.",
          "To the left it halves each time, getting closer to 0 but never reaching it: the $x$-axis is an **asymptote**. $y$ is always positive.",
        ],
        exponential,
      ),
      choose("Discover", "$y = 3^x$ crosses the $y$-axis at", "(0, 1)", "$3^0 = 1$.", [
        ["(0, 3)", "$3^0 = 1$."],
        ["(0, 0)", "It never reaches 0."],
      ]),
      worked(
        "A table",
        "Plot $y = 2^x$ for $x = -2$ to 3.",
        [
          ["0.25, 0.5, 1, 2, 4, 8", "Powers of 2."],
          ["Join with a smooth curve", "Not straight."],
        ],
        "Through (0, 1), always above the axis.",
        exponential,
      ),
      steps(
        "Together",
        "Compare $y = (\\frac12)^x$",
        "Reverse the table.",
        [
          ["At $x = 2$, $y =$", "0.25", ["4", "$(\\frac12)^2$."], "0.25"],
          [
            "So it is",
            "decreasing: the mirror image of $2^x$ in the $y$-axis",
            ["increasing", "It halves each step right."],
            "Decreasing",
          ],
        ],
        "$(\\frac12)^x = 2^{-x}$.",
        twoExps,
      ),
      choose(
        "Together",
        "Which graph is $y = (\\frac12)^x$ (lighter)?",
        "the one falling left to right",
        "Halving.",
        [["the one rising", "That's $2^x$."]],
        { picture: twoExps },
      ),
      choose("Your turn", "Which is an exponential?", "$y = 5^x$", "$x$ in the power.", [
        ["$y = x^5$", "A power of $x$."],
        ["$y = 5x$", "Linear."],
      ]),
      typed("Your turn", "$y = 3^x$ when $x = 3$", "27", "$3^3$.", "27."),
      choose(
        "Watch out",
        "Ivy draws $y = 2^x$ crossing the $x$-axis on the left. What's wrong?",
        "$2^x$ is always positive: it only gets close",
        "Asymptote.",
        [["Nothing", "$2^{-10} = 0.00098$, still positive."]],
      ),
      mistake(
        "Ben describes $y = 4^x$.",
        ["Through (0, 4)", "Increasing", "Never touches the $x$-axis"],
        0,
        "$4^0 = 1$: through (0, 1).",
      ),
      choose(
        "Back to the problem",
        "“Which is decreasing?”",
        "$y = (\\frac12)^x$",
        "Base less than 1.",
        [
          ["$y = 2^x$", "That doubles."],
          ["Both", "One grows."],
        ],
        { picture: twoExps },
      ),
      quiz([
        [
          ["Every $y = k^x$ (k > 0) passes through", "(0, 1)", ["(1, 0)", "(0, k)"], "$k^0$."],
          ["$y = k^x$ with $k > 1$ is", "increasing", ["decreasing", "constant"], "Grows."],
        ],
        [
          ["$y = 0.3^x$ is", "decreasing", ["increasing", "linear"], "Base < 1."],
          ["The asymptote of $y = 2^x$", "the $x$-axis", ["the $y$-axis", "$y = 1$"], "Never 0."],
        ],
        [
          ["$y = 2^x$ at $x = 5$", "32", ["10", "25"], "$2^5$."],
          ["$y = 2^x$ at $x = -2$", "0.25", ["−4", "−0.25"], "$\\frac14$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "trig-graphs",
    "GH-A12.b",
    "Graphs of sin, cos and tan",
    "sin and cos are waves between −1 and 1; tan repeats every 180° with asymptotes.",
    [
      problem(
        "Two solutions",
        [
          "“$\\sin 30° = 0.5$. Use the graph of $y = \\sin x$ to find another angle between 0° and 360° with $\\sin x = 0.5$.”",
          "By the end of this lesson, you can sketch all three graphs and use their symmetry.",
        ],
        sine,
      ),
      typed("Warm-up", "$\\sin 90°$", "1", "Exact value.", "1."),
      typed("Warm-up", "$\\cos 0°$", "1", "Exact value.", "1."),
      explain(
        "Discover",
        "Three shapes",
        [
          "$y = \\sin x$ starts at 0, peaks at 1 at 90°, back to 0 at 180°, down to −1 at 270°, 0 at 360°. It repeats every 360°.",
          "$y = \\cos x$ is the same wave shifted: it starts at 1. $y = \\tan x$ repeats every 180°, with asymptotes at 90° and 270°.",
        ],
        sine,
      ),
      choose(
        "Discover",
        "Which graph is this?",
        "$y = \\cos x$",
        "Starts at 1.",
        [
          ["$y = \\sin x$", "That starts at 0."],
          ["$y = \\tan x$", "That has asymptotes."],
        ],
        { picture: cosine },
      ),
      worked(
        "The problem",
        "$\\sin x = 0.5$, $0° \\le x \\le 360°$.",
        [
          ["One answer: 30°", "Calculator."],
          ["The sine graph is symmetrical about 90°", "Mirror."],
          ["So $180° - 30° = 150°$", "The other."],
        ],
        "Both 30° and 150°.",
        sine,
      ),
      steps(
        "Together",
        "$\\cos x = 0.5$ for $0° \\le x \\le 360°$",
        "Use symmetry.",
        [
          ["Calculator:", "60°", ["30°", "$\\cos^{-1} 0.5$."], "60°"],
          [
            "Cos is symmetrical about 180°, so",
            "300°",
            ["120°", "That's for sine."],
            "60° and 300°",
          ],
        ],
        "Cos: $360° - x$.",
        cosine,
      ),
      choose(
        "Together",
        "Which graph has asymptotes?",
        "$y = \\tan x$",
        "At 90°, 270°.",
        [
          ["$y = \\sin x$", "A smooth wave."],
          ["$y = \\cos x$", "A smooth wave."],
        ],
        { picture: tangent },
      ),
      choose("Your turn", "The largest value of $\\sin x$", "1", "Peak at 90°.", [
        ["90", "That's the angle."],
        ["360", "That's the period."],
      ]),
      choose("Your turn", "$\\tan x = 1$ at 45° and", "225°", "Period 180°.", [
        ["135°", "That's where it's −1."],
        ["315°", "That's −1 too."],
      ]),
      choose(
        "Watch out",
        "Kim gives only one answer to $\\sin x = 0.5$ between 0° and 360°. What's missing?",
        "The graph meets 0.5 twice: 30° and 150°",
        "Two crossings.",
        [["Nothing", "Look at the graph."]],
      ),
      mistake(
        "Leo solves $\\sin x = 0.5$ for $0° \\le x \\le 360°$.",
        ["$x = 30°$", "Other: $360° - 30°$", "$x = 330°$"],
        1,
        "For sine the other is $180° - 30° = 150°$; $\\sin 330° = -0.5$.",
      ),
      choose(
        "Back to the problem",
        "“Find another angle with $\\sin x = 0.5$.”",
        "150°",
        "$180° - 30°$.",
        [
          ["330°", "That's for cos."],
          ["60°", "$\\sin 60° \\ne 0.5$."],
        ],
        { picture: sine },
      ),
      quiz([
        [
          ["$\\sin x$ repeats every", "360°", ["180°", "90°"], "Period."],
          ["$\\tan x$ repeats every", "180°", ["360°", "90°"], "Period."],
        ],
        [
          ["$\\cos 180°$", "−1", ["0", "1"], "Lowest."],
          ["$\\sin 270°$", "−1", ["0", "1"], "Lowest."],
        ],
        [
          [
            "$\\sin x = 0.5$: answers in 0–360°",
            "30°, 150°",
            ["30°, 330°", "30° only"],
            "Symmetry about 90°.",
          ],
          [
            "$\\cos x = 0.5$: answers in 0–360°",
            "60°, 300°",
            ["60°, 120°", "60° only"],
            "Symmetry about 180°.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "transformations",
    "GH-A13",
    "Translating and reflecting graphs",
    "f(x) + a moves up; f(x + a) moves left; −f(x) flips in the x-axis.",
    [
      problem(
        "Describe the move",
        [
          "The graph shows $y = x^2$ and $y = (x - 2)^2$. “Describe the transformation that maps one onto the other.” And “Sketch $y = -f(x)$.”",
          "By the end of this lesson, you can move and flip any graph.",
        ],
        shifted,
      ),
      typed("Warm-up", "$y = x^2$ at $x = 2$", "4", "Square.", "4."),
      typed("Warm-up", "$y = (x - 2)^2$ at $x = 4$", "4", "$2^2$.", "4."),
      explain(
        "Discover",
        "Outside and inside",
        [
          "$y = f(x) + a$ moves the graph **up** by $a$: outside the bracket, it does what it says. $y = f(x + a)$ moves it **left** by $a$: inside, it does the opposite.",
          "$y = -f(x)$ is a **reflection** in the $x$-axis; $y = f(-x)$ is a reflection in the $y$-axis.",
        ],
        shifted,
      ),
      choose("Discover", "$y = f(x) - 3$ is", "a translation down 3", "Outside: as it says.", [
        ["a translation left 3", "That's inside."],
        ["a translation right 3", "That's $f(x - 3)$."],
      ]),
      worked(
        "The problem",
        "$y = x^2 \\to y = (x - 2)^2$",
        [
          ["$f(x - 2)$: inside the bracket", "Opposite."],
          ["Translation by $\\begin{pmatrix} 2 \\\\ 0 \\end{pmatrix}$", "2 right."],
        ],
        "The turning point moves from (0, 0) to (2, 0).",
        shifted,
      ),
      steps(
        "Together",
        "$f(x)$ has a turning point at (1, 3). Find it for each.",
        "Move the point.",
        [
          ["$y = f(x) + 2$:", "(1, 5)", ["(3, 3)", "Outside: up."], "(1, 5)"],
          ["$y = f(x + 4)$:", "(−3, 3)", ["(5, 3)", "Inside: left."], "(−3, 3)"],
        ],
        "Track one point to check.",
      ),
      choose(
        "Together",
        "$(2, 5)$ on $y = f(x)$ goes, on $y = -f(x)$, to",
        "(2, −5)",
        "Flip in the $x$-axis.",
        [
          ["(−2, 5)", "That's $f(-x)$."],
          ["(−2, −5)", "Only $y$ changes."],
        ],
      ),
      choose(
        "Your turn",
        "$y = f(x + 1)$ is a translation by",
        "$\\begin{pmatrix} -1 \\\\ 0 \\end{pmatrix}$",
        "Inside: opposite.",
        [
          ["$\\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}$", "Inside moves the other way."],
          ["$\\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$", "That's $f(x) + 1$."],
        ],
      ),
      choose(
        "Your turn",
        "(3, 4) on $f$ goes, on $y = f(-x)$, to",
        "(−3, 4)",
        "Flip in the $y$-axis.",
        [
          ["(3, −4)", "That's $-f(x)$."],
          ["(−3, −4)", "Only $x$ changes."],
        ],
      ),
      choose(
        "Watch out",
        "Raj says $f(x + 3)$ moves the graph 3 right. What's wrong?",
        "Inside the bracket does the opposite: 3 left",
        "Opposite.",
        [["Nothing", "Check a point: $f(0 + 3)$ needs $x = -3$ to match $f(0)$."]],
      ),
      mistake(
        "Zoe describes $y = x^2 + 5$ from $y = x^2$.",
        [
          "The 5 is added",
          "So the graph moves 5 right",
          "Translation $\\begin{pmatrix} 5 \\\\ 0 \\end{pmatrix}$",
        ],
        1,
        "Added outside: 5 up, $\\begin{pmatrix} 0 \\\\ 5 \\end{pmatrix}$.",
      ),
      choose(
        "Back to the problem",
        "“Describe the transformation from $y = x^2$ to $y = (x - 2)^2$.”",
        "Translation by $\\begin{pmatrix} 2 \\\\ 0 \\end{pmatrix}$",
        "2 right.",
        [
          ["Translation by $\\begin{pmatrix} -2 \\\\ 0 \\end{pmatrix}$", "Inside: opposite."],
          ["Translation by $\\begin{pmatrix} 0 \\\\ -2 \\end{pmatrix}$", "Inside moves sideways."],
        ],
        { picture: shifted },
      ),
      quiz([
        [
          ["$f(x) + 4$", "up 4", ["left 4", "right 4"], "Outside."],
          ["$f(x) - 1$", "down 1", ["right 1", "left 1"], "Outside."],
        ],
        [
          ["$f(x - 5)$", "right 5", ["left 5", "down 5"], "Inside."],
          ["$f(x + 2)$", "left 2", ["right 2", "up 2"], "Inside."],
        ],
        [
          ["$-f(x)$ reflects in", "the $x$-axis", ["the $y$-axis", "$y = x$"], "Flip y."],
          ["$f(-x)$ reflects in", "the $y$-axis", ["the $x$-axis", "$y = x$"], "Flip x."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "exponential-context",
    "GH-A14",
    "Exponential graphs in context",
    "Read the starting value and the multiplier; P = a × bᵗ.",
    [
      problem(
        "Bacteria",
        [
          "A culture has 500 bacteria and doubles every hour. “Write a formula for the number after $t$ hours, and use it to find when it first passes 10 000.”",
          "By the end of this lesson, you can model and read exponential growth.",
        ],
        exponential,
      ),
      typed("Warm-up", "500 doubled 3 times", "4000", "$500 \\times 8$.", "4000."),
      typed("Warm-up", "$2^4$", "16", "Powers of 2.", "16."),
      explain("Discover", "Start × multiplier^time", [
        "Exponential models look like $P = a \\times b^t$. $a$ is the value at $t = 0$ (where the graph crosses the axis); $b$ is the multiplier each unit of time.",
        "$b > 1$ means growth; $0 < b < 1$ means decay. Read $a$ from the graph, then use one more point to find $b$.",
      ]),
      choose(
        "Discover",
        "Doubling every hour from 500",
        "$P = 500 \\times 2^t$",
        "Start 500, × 2.",
        [
          ["$P = 2 \\times 500^t$", "The start goes in front."],
          ["$P = 500 + 2t$", "That's linear."],
        ],
      ),
      worked(
        "The bacteria",
        "$P = 500 \\times 2^t$",
        [
          ["$t = 4$: 8000; $t = 5$: 16 000", "Try values."],
          ["So it first passes 10 000 during the 5th hour", "Between 4 and 5."],
        ],
        "A graph would give about 4.3 hours.",
      ),
      steps(
        "Together",
        "A graph of $V = a \\times b^t$ passes (0, 200) and (1, 180)",
        "Find $a$ and $b$.",
        [
          ["$a =$", "200", ["180", "At $t = 0$."], "200"],
          ["$b =$", "0.9", ["−20", "$180 \\div 200$."], "0.9: a 10% decay"],
        ],
        "$V = 200 \\times 0.9^t$.",
      ),
      choose(
        "Together",
        "$P = 1200 \\times 1.05^t$ describes",
        "5% growth from 1200",
        "Multiplier 1.05.",
        [
          ["5% decay", "$b > 1$."],
          ["growth of 1.05 each year", "It's multiplied."],
        ],
      ),
      typed(
        "Your turn",
        "$V = 200 \\times 0.9^t$ when $t = 2$",
        "162",
        "$200 \\times 0.81$.",
        "162.",
      ),
      choose(
        "Your turn",
        "A graph of $y = ab^t$ passes (0, 3) and (2, 48). $b$",
        "4",
        "$3b^2 = 48$.",
        [
          ["16", "$b^2 = 16$."],
          ["15", "Multiply, not add."],
        ],
      ),
      choose(
        "Watch out",
        "Kim reads $b$ as the change between points: 180 − 200 = −20. What's wrong?",
        "In an exponential, $b$ is a ratio: $180 \\div 200$",
        "Multiplier.",
        [["Nothing", "−20 would be linear."]],
      ),
      mistake(
        "Ola models 300 trees, falling 20% a year.",
        ["$a = 300$", "$b = 0.2$", "$T = 300 \\times 0.2^t$"],
        1,
        "Falling 20% keeps 80%: $b = 0.8$.",
      ),
      choose(
        "Back to the problem",
        "“When does it first pass 10 000?”",
        "during the 5th hour (between 4 and 5 hours)",
        "8000 then 16 000.",
        [
          ["after 20 hours", "It doubles."],
          ["after 4 hours", "8000 < 10 000."],
        ],
      ),
      quiz([
        [
          ["$P = 50 \\times 3^t$: start value", "50", ["3", "150"], "$t = 0$."],
          ["$P = 80 \\times 1.5^t$: start value", "80", ["1.5", "120"], "$t = 0$."],
        ],
        [
          ["$P = 100 \\times 0.7^t$ is", "30% decay", ["70% decay", "30% growth"], "Keep 70%."],
          ["$P = 100 \\times 1.2^t$ is", "20% growth", ["2% growth", "120% growth"], "× 1.2."],
        ],
        [
          ["(0, 5) and (1, 15): $b$", "3", ["10", "15"], "Ratio."],
          ["(0, 8) and (1, 4): $b$", "0.5", ["−4", "2"], "Ratio."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "gradients",
    "GH-A15.a",
    "Gradients of curves",
    "Draw a tangent at the point and find its gradient.",
    [
      problem(
        "How steep, right there?",
        [
          "The graph shows $y = \\frac{x^2}{2}$. “Estimate the gradient of the curve at $x = 2$.”",
          "A curve's steepness changes. By the end of this lesson, you can estimate it at any point.",
        ],
        curveTangent,
      ),
      typed("Warm-up", "Gradient between (1, 0) and (4, 6)", "2", "$\\frac{6}{3}$.", "2."),
      typed("Warm-up", "$\\frac{2^2}{2}$", "2", "$4 \\div 2$.", "2."),
      explain(
        "Discover",
        "The tangent",
        [
          "A **tangent** is a straight line that just touches the curve at one point, matching its direction there. The curve's gradient at that point is the tangent's gradient.",
          "Draw the tangent with a ruler, pick two points far apart on it, and work out rise ÷ run.",
        ],
        curveTangent,
      ),
      choose(
        "Discover",
        "A tangent to a curve",
        "touches it at one point, going the same way",
        "Just touches.",
        [
          ["crosses it twice", "That's a chord."],
          ["is always horizontal", "Only at a turning point."],
        ],
      ),
      worked(
        "At $x = 2$",
        "Tangent through (2, 2).",
        [
          ["Two points on it: (1, 0) and (4, 6)", "Far apart."],
          ["Gradient $= \\frac{6 - 0}{4 - 1} = 2$", "Rise ÷ run."],
        ],
        "The curve is rising 2 for every 1 across at $x = 2$.",
        curveTangent,
      ),
      steps(
        "Together",
        "Where is the gradient 0?",
        "Think about the shape.",
        [
          [
            "At a turning point the tangent is",
            "horizontal",
            ["vertical", "Flat at the bottom."],
            "Horizontal",
          ],
          [
            "So for $y = \\frac{x^2}{2}$, gradient 0 at",
            "$x = 0$",
            ["$x = 2$", "The bottom of the ∪."],
            "$x = 0$",
          ],
        ],
        "Steeper further from the turning point.",
      ),
      choose(
        "Together",
        "A tangent slopes down left to right. The gradient is",
        "negative",
        "Falling.",
        [
          ["positive", "Falling."],
          ["zero", "That's flat."],
        ],
      ),
      choose("Your turn", "A tangent passes (0, 1) and (2, 7). Gradient", "3", "$\\frac{6}{2}$.", [
        ["7", "Rise ÷ run."],
        ["$\\frac13$", "Run ÷ rise."],
      ]),
      choose(
        "Your turn",
        "Why is a gradient from a drawn tangent only an estimate?",
        "The tangent is drawn by eye",
        "Approximate.",
        [
          ["The curve isn't real", "It's a drawing accuracy issue."],
          ["It's always exact", "Hand-drawn."],
        ],
      ),
      choose(
        "Watch out",
        "Ben joins two points on the curve near $x = 2$ and calls it the tangent. What's the issue?",
        "That's a chord: it gives an average, not the gradient at a point",
        "Chord vs tangent.",
        [["Nothing", "Closer points help, but a tangent touches once."]],
      ),
      mistake(
        "Kim finds a tangent's gradient through (1, 0) and (4, 6).",
        ["Rise: 4 − 1 = 3", "Run: 6 − 0 = 6", "Gradient ½"],
        0,
        "Rise is the change in $y$: 6. Run is 3. Gradient 2.",
      ),
      typed(
        "Back to the problem",
        "“Estimate the gradient at $x = 2$.”",
        "2",
        "Tangent through (1, 0) and (4, 6).",
        "About 2.",
        { picture: curveTangent },
      ),
      quiz([
        [
          ["Gradient at a turning point", "0", ["1", "undefined"], "Flat."],
          [
            "A tangent touches the curve at",
            "one point",
            ["two points", "no points"],
            "Just touches.",
          ],
        ],
        [
          ["Tangent through (0, 2) and (3, 8)", "2", ["3", "6"], "$\\frac63$."],
          ["Tangent through (1, 5) and (3, 1)", "−2", ["2", "−4"], "$\\frac{-4}{2}$."],
        ],
        [
          [
            "A line joining two points on a curve is a",
            "chord",
            ["tangent", "normal"],
            "Crosses twice.",
          ],
          [
            "The gradient of a curve at a point is the gradient of the",
            "tangent",
            ["chord", "axis"],
            "Touching line.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "areas",
    "GH-A15.b",
    "Areas under graphs",
    "Split the area into trapezia and add them up.",
    [
      problem(
        "Distance from speed",
        [
          "A car accelerates from 0 to 20 m/s in 10 s, then holds 20 m/s for 20 s. “Find the area under the velocity–time graph.”",
          "By the end of this lesson, you can find areas under straight and curved graphs.",
        ],
        velocity,
      ),
      typed("Warm-up", "Area of a triangle, base 10, height 20", "100", "½ × 10 × 20.", "100."),
      typed(
        "Warm-up",
        "Area of a trapezium with parallel sides 3 and 5, width 2",
        "8",
        "½(3 + 5) × 2.",
        "8.",
      ),
      explain(
        "Discover",
        "Shapes under the line",
        [
          "Under straight-line pieces, split the area into triangles, rectangles and trapezia.",
          "Under a curve, use **strips**: trapezia of equal width. The more strips, the better the estimate. If the curve bends upwards (∪), trapezia overestimate.",
        ],
        velocity,
      ),
      choose(
        "Discover",
        "The area under the car's graph is made of",
        "a triangle and a rectangle",
        "Speed up, then steady.",
        [
          ["two triangles", "The second part is flat."],
          ["a circle", "Straight lines."],
        ],
        { picture: velocity },
      ),
      worked(
        "The car",
        "Area under the graph.",
        [
          ["Triangle: $\\frac12 \\times 10 \\times 20 = 100$", "First 10 s."],
          ["Rectangle: $20 \\times 20 = 400$", "Next 20 s."],
          ["Total: 500", "Add."],
        ],
        "Next lesson: what this area means.",
        velocity,
      ),
      steps(
        "Together",
        "Estimate the area under $y = x^2$ from 0 to 2 with two strips",
        "Width 1 each.",
        [
          ["Heights at 0, 1, 2:", "0, 1, 4", ["0, 2, 4", "Square each."], "0, 1, 4"],
          ["Trapezia:", "$\\frac12(0 + 1) + \\frac12(1 + 4) = 3$", ["5", "Halve each sum."], "3"],
        ],
        "The true area is $2\\frac23$: an overestimate, as the curve bends up.",
      ),
      choose("Together", "More strips make the estimate", "more accurate", "Thinner.", [
        ["less accurate", "Thinner strips fit better."],
        ["no different", "They fit the curve better."],
      ]),
      typed(
        "Your turn",
        "Area of a trapezium strip with heights 4 and 6, width 2",
        "10",
        "½(4 + 6) × 2.",
        "10.",
      ),
      typed(
        "Your turn",
        "Speed rises steadily from 4 to 10 m/s over 6 s. Area under the graph",
        "42",
        "½(4 + 10) × 6.",
        "42.",
      ),
      choose(
        "Watch out",
        "Ola uses rectangles with the top height. What's the problem?",
        "Trapezia fit the slope better",
        "Use both heights.",
        [["Nothing", "Rectangles leave gaps or overlap."]],
      ),
      mistake(
        "Zoe estimates an area with strips of width 2: heights 1, 3, 7.",
        [
          "$\\frac12(1 + 3) \\times 2 = 4$",
          "$\\frac12(3 + 7) \\times 2 = 10$",
          "Total 14, divide by 2 = 7",
        ],
        2,
        "Don't halve again: the total is 14.",
      ),
      typed(
        "Back to the problem",
        "“Find the area under the graph.”",
        "500",
        "100 + 400.",
        "500.",
        { picture: velocity, wrong: [["600", "The first part is a triangle."]] },
      ),
      quiz([
        [
          ["Area under $v = 10$ from 0 to 5", "50", ["15", "10"], "Rectangle."],
          ["Area under $v = 2t$ from 0 to 4", "16", ["8", "32"], "Triangle: ½ × 4 × 8."],
        ],
        [
          ["Trapezium heights 2, 4, width 1", "3", ["6", "8"], "½ × 6."],
          ["Trapezium heights 5, 9, width 2", "14", ["28", "7"], "½ × 14 × 2."],
        ],
        [
          [
            "For a curve bending upwards, trapezia",
            "overestimate",
            ["underestimate", "are exact"],
            "Above the curve.",
          ],
          [
            "To improve an estimate, use",
            "more strips",
            ["fewer strips", "rectangles"],
            "Thinner.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "velocity-time",
    "GH-A15.c",
    "Velocity–time graphs",
    "Gradient = acceleration; area = distance travelled.",
    [
      problem(
        "What the graph tells you",
        [
          "The car's velocity–time graph is shown. “Find its acceleration in the first 10 s.” And “Find the total distance travelled.”",
          "By the end of this lesson, you can read both from the graph.",
        ],
        velocity,
      ),
      typed("Warm-up", "Gradient from (0, 0) to (10, 20)", "2", "$\\frac{20}{10}$.", "2."),
      typed("Warm-up", "Area under the graph (from the last lesson)", "500", "100 + 400.", "500."),
      explain(
        "Discover",
        "Two readings",
        [
          "On a **velocity–time** graph, the **gradient** is the **acceleration** (m/s per second, m/s²). Flat: constant velocity. Downward slope: slowing down.",
          "The **area** under the graph is the **distance** travelled (m/s × s = m).",
        ],
        velocity,
      ),
      choose(
        "Discover",
        "A flat section on a velocity–time graph means",
        "constant velocity",
        "No acceleration.",
        [
          ["stopped", "That's on a distance–time graph."],
          ["slowing down", "That slopes down."],
        ],
      ),
      worked(
        "The car",
        "Acceleration and distance.",
        [
          ["Acceleration: $\\frac{20}{10} = 2$ m/s²", "Gradient."],
          ["Distance: 500 m", "Area."],
        ],
        "Average speed: $500 \\div 30 = 16.7$ m/s.",
        velocity,
      ),
      steps(
        "Together",
        "A cyclist slows from 12 m/s to 0 in 4 s",
        "Read the graph.",
        [
          ["Acceleration:", "−3 m/s²", ["3 m/s²", "Slowing down: negative."], "−3 m/s²"],
          ["Distance while braking:", "24 m", ["48 m", "Triangle: halve."], "24 m"],
        ],
        "A deceleration of 3 m/s².",
      ),
      choose("Together", "Units of the area under a velocity–time graph", "metres", "m/s × s.", [
        ["m/s²", "That's the gradient."],
        ["m/s", "Multiply by seconds."],
      ]),
      typed(
        "Your turn",
        "Velocity rises from 5 to 25 m/s in 4 s. Acceleration",
        "5",
        "$\\frac{20}{4}$.",
        "5 m/s².",
        { unit: "m/s²" },
      ),
      typed("Your turn", "Distance in those 4 s", "60", "½(5 + 25) × 4.", "60 m.", { unit: "m" }),
      choose(
        "Watch out",
        "Kim reads a flat line on a velocity–time graph as stopped. What's wrong?",
        "Flat velocity means moving at a steady speed",
        "Check the axis.",
        [["Nothing", "Stopped would be on the time axis."]],
      ),
      mistake(
        "Ben finds the car's total distance.",
        ["Gradient of the first part: 2", "Then 20 × 30 = 600", "600 m"],
        1,
        "The area isn't one rectangle: the first 10 s is a triangle. 500 m.",
      ),
      choose(
        "Back to the problem",
        "“Acceleration in the first 10 s, and total distance?”",
        "2 m/s² and 500 m",
        "Gradient and area.",
        [
          ["20 m/s² and 600 m", "Divide by 10; triangle first."],
          ["2 m/s² and 30 m", "Area, not time."],
        ],
        { picture: velocity },
      ),
      quiz([
        [
          ["Gradient of a velocity–time graph", "acceleration", ["distance", "speed"], "Rate."],
          ["Area under a velocity–time graph", "distance", ["acceleration", "time"], "m/s × s."],
        ],
        [
          [
            "0 to 30 m/s in 6 s: acceleration",
            "5 m/s²",
            ["180 m/s²", "0.2 m/s²"],
            "$\\frac{30}{6}$.",
          ],
          [
            "20 to 0 m/s in 5 s: acceleration",
            "−4 m/s²",
            ["4 m/s²", "−100 m/s²"],
            "$\\frac{-20}{5}$.",
          ],
        ],
        [
          ["Steady 15 m/s for 10 s: distance", "150 m", ["1.5 m", "25 m"], "Rectangle."],
          ["0 to 10 m/s in 4 s: distance", "20 m", ["40 m", "2.5 m"], "Triangle."],
        ],
      ]),
    ],
  ),
];
