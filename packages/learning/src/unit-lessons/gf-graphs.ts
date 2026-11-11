// GCSE Foundation, "Graphs of functions", as five short lessons, one just before each skill:
// recognising linear and quadratic graphs, cubic graphs, the reciprocal graph y = 1/x, and
// distance–time and other real-life graphs. Each recaps the Key Stage 3 idea quickly, builds it to
// GCSE level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Picture, Point, UnitLesson } from "./types.ts";

const U = "gf-graphs";
const P = (x: number, y: number): Point => ({ x, y });

/** A curve drawn as short straight pieces over x and y axes, with optional labels. */
function plotted(
  f: (x: number) => number,
  from: number,
  to: number,
  frame: { yMin: number; yMax: number },
): DrawingPic {
  const items: DrawingPic["items"] = [
    { line: [P(from - 0.3, 0), P(to + 0.3, 0)], arrow: 1 },
    { line: [P(0, frame.yMin), P(0, frame.yMax)], arrow: 1 },
    { text: "x", at: P(to + 0.5, 0.3) },
    { text: "y", at: P(0.5, frame.yMax - 0.2) },
  ];
  const n = 24;
  for (let i = 0; i < n; i++) {
    const a = from + ((to - from) * i) / n;
    const b = from + ((to - from) * (i + 1)) / n;
    items.push({ line: [P(a, f(a)), P(b, f(b))], tone: "find" });
  }
  return {
    kind: "drawing",
    frame: { xMin: from - 0.6, xMax: to + 0.8, yMin: frame.yMin, yMax: frame.yMax + 0.3 },
    items,
  };
}
const cubic = plotted((x) => x ** 3 / 2, -2, 2, { yMin: -4.2, yMax: 4.2 });
const negCubic = plotted((x) => -(x ** 3) / 2, -2, 2, { yMin: -4.2, yMax: 4.2 });
const reciprocal: Picture = {
  kind: "graph",
  range: { xMin: -5, xMax: 5, yMin: -5, yMax: 5 },
  curves: [{ kind: "inverse", k: 1 }],
};
/** The four graphs of the opening problem: y = 2x + 1, y = 3, y = x² and y = −x² + 4. */
const fourGraphs: Picture = {
  kind: "graph",
  range: { xMin: -4, xMax: 4, yMin: -2, yMax: 8 },
  lines: [
    { m: 2, c: 1 },
    { m: 0, c: 3 },
  ],
  curves: [
    { kind: "quadratic", a: 1, b: 0, c: 0 },
    { kind: "quadratic", a: -1, b: 0, c: 4 },
  ],
};

/** A distance–time graph: straight pieces through the given (time, distance) points. */
function journey(points: [number, number][], tMax: number, dMax: number): DrawingPic {
  const sx = 6 / tMax;
  const sy = 4 / dMax;
  const items: DrawingPic["items"] = [
    { line: [P(0, 0), P(6.3, 0)] },
    { line: [P(0, 0), P(0, 4.3)] },
    { text: "time (min)", at: P(3, -0.9) },
    { text: "distance (km)", at: P(1.4, 4.8) },
    { text: "0", at: P(-0.35, -0.35) },
    { text: String(tMax), at: P(6, -0.4) },
    { text: String(dMax), at: P(-0.4, 4) },
  ];
  points.forEach(([t, d], i) => {
    const next = points[i + 1];
    if (next)
      items.push({ line: [P(t * sx, d * sy), P(next[0] * sx, next[1] * sy)], tone: "find" });
  });
  return { kind: "drawing", items };
}
const walk = journey(
  [
    [0, 0],
    [20, 2],
    [30, 2],
    [60, 0],
  ],
  60,
  2,
);

export const gfGraphs: UnitLesson[] = [
  lesson(
    U,
    "linear-quadratic",
    "GF-A12.a",
    "Straight lines and parabolas",
    "y = mx + c is a line; y = ax² + bx + c is a U-shaped parabola.",
    [
      problem(
        "Match the graphs",
        [
          "“Match each equation to its graph: $y = 2x + 1$, $y = x^2$, $y = -x^2 + 4$, $y = 3$.”",
          "By the end of this lesson, you can recognise the shapes from the equations alone.",
        ],
        fourGraphs,
      ),
      choose("Warm-up", "$y = 2x + 1$ is", "a straight line", "Highest power of $x$ is 1.", [
        ["a curve", "No $x^2$."],
      ]),
      typed("Warm-up", "$y = x^2$ when $x = -2$", "4", "$(-2)^2$.", "4."),
      explain(
        "Discover",
        "Read the highest power",
        [
          "**Linear** ($x$ to the power 1): a straight line. **Quadratic** ($x^2$): a symmetrical curve called a **parabola**.",
          "A positive $x^2$ term gives a ∪; a negative one gives a ∩. $y = 3$ is a horizontal line.",
        ],
        fourGraphs,
      ),
      choose("Discover", "$y = -x^2 + 4$ is shaped like", "∩", "Negative $x^2$.", [
        ["∪", "Negative $x^2$ turns it over."],
        ["a straight line", "It has $x^2$."],
      ]),
      worked(
        "Match them",
        "Which shape for each?",
        [
          ["$y = 2x + 1$: line, up, crossing at 1", "Linear."],
          ["$y = x^2$: ∪ through (0, 0)", "Quadratic."],
          ["$y = -x^2 + 4$: ∩, top at (0, 4); $y = 3$: horizontal", "Read each."],
        ],
        "Power and sign tell you the shape.",
        fourGraphs,
      ),
      steps(
        "Together",
        "Sketch $y = x^2 - 4$",
        "Key points.",
        [
          ["$y$-intercept:", "(0, −4)", ["(0, 4)", "Put $x = 0$."], "(0, −4)"],
          ["Roots:", "$x = \\pm 2$", ["$x = 4$", "$x^2 = 4$."], "∪ through (−2, 0), (2, 0)"],
        ],
        "A ∪, lowest point (0, −4).",
      ),
      choose("Together", "Which is a quadratic?", "$y = 3x^2 - x$", "Highest power 2.", [
        ["$y = 3x - 1$", "Linear."],
        ["$y = \\frac{3}{x}$", "Reciprocal."],
      ]),
      choose("Your turn", "$y = 5 - 2x$ slopes", "down", "Negative gradient.", [
        ["up", "Gradient −2."],
      ]),
      choose("Your turn", "$y = x^2 + 2$ crosses the $y$-axis at", "(0, 2)", "Put $x = 0$.", [
        ["(0, 0)", "It's shifted up 2."],
        ["(2, 0)", "That's on the $x$-axis."],
      ]),
      choose(
        "Watch out",
        "Ivy plots $y = x^2$ and joins the points with straight lines. What's wrong?",
        "A parabola is a smooth curve",
        "Join with a curve.",
        [["Nothing", "Quadratics curve."]],
      ),
      mistake(
        "Ben fills a table for $y = x^2$.",
        ["$x = 2$: $y = 4$", "$x = -2$: $y = -4$", "$x = 0$: $y = 0$"],
        1,
        "$(-2)^2 = 4$: squares are never negative.",
      ),
      choose(
        "Back to the problem",
        "“Match $y = -x^2 + 4$ to its graph.”",
        "A ∩ with its top at (0, 4)",
        "Negative $x^2$, plus 4.",
        [
          ["A ∪ through (0, 0)", "That's $y = x^2$."],
          ["A horizontal line", "That's $y = 4$ alone."],
        ],
      ),
      quiz([
        [
          ["$y = 7 - x$ is", "a straight line", ["a parabola", "a hyperbola"], "Linear."],
          ["$y = x^2 - 3x$ is", "a parabola", ["a line", "a hyperbola"], "Quadratic."],
        ],
        [
          ["$y = -2x^2$ opens", "downwards", ["upwards", "sideways"], "Negative."],
          ["$y = 4x^2$ opens", "upwards", ["downwards", "sideways"], "Positive."],
        ],
        [
          ["$y = x^2 + 5$: $y$-intercept", "(0, 5)", ["(5, 0)", "(0, 0)"], "$x = 0$."],
          ["$y = x^2 - 9$: roots", "$\\pm 3$", ["$9$", "$-9$"], "$x^2 = 9$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "cubic",
    "GF-A12.b",
    "Cubic graphs",
    "y = x³ climbs, flattens through the origin, and climbs again.",
    [
      problem(
        "Which is cubic?",
        [
          "“Sketch the graph of $y = x^3$.” And “Which graph shows $y = -x^3$?” Cubics have their own S-like shape.",
          "By the end of this lesson, you'll recognise and sketch them.",
        ],
        cubic,
      ),
      typed("Warm-up", "$2^3$", "8", "$2 \\times 2 \\times 2$.", "8."),
      typed("Warm-up", "$(-2)^3$", "-8", "Odd number of negatives.", "−8."),
      explain(
        "Discover",
        "Negatives stay negative",
        [
          "In $y = x^3$, negative $x$ gives negative $y$: the curve comes up from the bottom left, flattens at the origin, and rises to the top right.",
          "$y = -x^3$ is the same shape flipped: from top left down to bottom right.",
        ],
        cubic,
      ),
      choose("Discover", "Where does $y = x^3$ pass through?", "(0, 0)", "$0^3 = 0$.", [
        ["(0, 1)", "$0^3 = 0$."],
        ["(1, 0)", "$1^3 = 1$."],
      ]),
      worked(
        "A table",
        "Plot $y = x^3$ for $x = -2$ to 2.",
        [
          ["$-8, -1, 0, 1, 8$", "Cube each."],
          ["Join with a smooth S-shaped curve", "Through the origin."],
        ],
        "It rises steeply at both ends.",
        cubic,
      ),
      steps(
        "Together",
        "Recognise $y = -x^3$",
        "The sign.",
        [
          ["When $x = 2$, $y =$", "−8", ["8", "$-(2^3)$."], "−8"],
          [
            "So the curve",
            "falls from top left to bottom right",
            ["rises left to right", "That's $y = x^3$."],
            "Flipped",
          ],
        ],
        "Negative cubic: falls.",
        negCubic,
      ),
      choose(
        "Together",
        "Which equation matches the graph?",
        "$y = -x^3$",
        "Falls left to right.",
        [
          ["$y = x^3$", "That rises."],
          ["$y = x^2$", "That's a ∪."],
        ],
        { picture: negCubic },
      ),
      choose("Your turn", "Which is a cubic?", "$y = x^3 + 2$", "Highest power 3.", [
        ["$y = 3x + 2$", "Linear."],
        ["$y = x^2 + 3$", "Quadratic."],
      ]),
      typed("Your turn", "$y = x^3 - 5$ when $x = 2$", "3", "$8 - 5$.", "3."),
      choose(
        "Watch out",
        "Kim sketches $y = x^3$ as a ∪. What's wrong?",
        "Negative $x$ gives negative $y$: it goes down on the left",
        "A ∪ is a quadratic.",
        [["Nothing", "$(-2)^3 = -8$."]],
      ),
      mistake(
        "Leo works out $y = x^3$ at $x = -3$.",
        ["$(-3)^3$", "$= -3 \\times -3 \\times -3$", "$= 27$"],
        2,
        "Three negatives make a negative: −27.",
      ),
      choose(
        "Back to the problem",
        "“Sketch $y = x^3$.” The shape:",
        "Up from bottom left, flat at the origin, up to top right",
        "S-shaped.",
        [
          ["A ∪ through the origin", "That's $x^2$."],
          ["A straight line", "It curves."],
        ],
      ),
      quiz([
        [
          ["$y = x^3$ at $x = 3$", "27", ["9", "−27"], "Cube."],
          ["$y = x^3$ at $x = -1$", "−1", ["1", "−3"], "Odd power."],
        ],
        [
          ["$y = x^3$ goes through", "the origin", ["(0, 1)", "(1, 0)"], "$0^3 = 0$."],
          ["$y = -x^3$ at $x = 2$", "−8", ["8", "−6"], "$-(8)$."],
        ],
        [
          ["Cubic graphs have an S-like shape", "true", ["false", "only for negatives"], "Yes."],
          ["$y = x^3 + 4$ crosses the $y$-axis at", "(0, 4)", ["(4, 0)", "(0, 0)"], "$x = 0$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "reciprocal",
    "GF-A12.c",
    "The reciprocal graph y = 1/x",
    "Two separate curves that approach the axes but never touch.",
    [
      problem(
        "Sharing a prize",
        [
          "£1000 is shared by $x$ people: each gets $y = \\frac{1000}{x}$. More people, smaller shares. The graph of $y = \\frac1x$ has a special shape.",
          "By the end of this lesson, you'll recognise and sketch it.",
        ],
        reciprocal,
      ),
      typed("Warm-up", "$\\frac{1}{0.5}$", "2", "One divided by a half.", "2."),
      typed("Warm-up", "$\\frac{1}{-2}$", "-0.5", "Divide.", "−0.5."),
      explain(
        "Discover",
        "Never touching the axes",
        [
          "$y = \\frac1x$ has two separate branches: in the top right (positive $x$) and bottom left (negative $x$).",
          "As $x$ gets bigger, $y$ gets closer to 0, but never reaches it. You can't divide by 0, so there's no point at $x = 0$. The axes are **asymptotes**.",
        ],
        reciprocal,
      ),
      choose(
        "Discover",
        "Why is there no point at $x = 0$?",
        "You can't divide by 0",
        "$\\frac10$ isn't defined.",
        [["$y$ would be 0", "It would be undefined, not 0."]],
      ),
      worked(
        "A table",
        "Find $y = \\frac1x$ for $x = 0.5, 1, 2, 4$.",
        [
          ["2, 1, 0.5, 0.25", "Reciprocals."],
          ["As $x$ doubles, $y$ halves", "Inverse proportion."],
        ],
        "And for negative $x$, the same but negative.",
        reciprocal,
      ),
      steps(
        "Together",
        "Symmetry of $y = \\frac1x$",
        "Look at the branches.",
        [
          ["$x = -2$ gives $y =$", "−0.5", ["0.5", "Negative over positive."], "(−2, −0.5)"],
          [
            "So the bottom-left branch is",
            "the top-right one rotated 180°",
            ["a ∪", "It mirrors through the origin."],
            "Rotational symmetry",
          ],
        ],
        "Two branches, opposite corners.",
      ),
      choose(
        "Together",
        "Which equation matches the graph?",
        "$y = \\frac1x$",
        "Two branches, never touching the axes.",
        [
          ["$y = x^2$", "That's a ∪."],
          ["$y = x^3$", "That's one continuous S."],
        ],
        { picture: reciprocal },
      ),
      choose(
        "Your turn",
        "Which is a reciprocal graph?",
        "$y = \\frac{5}{x}$",
        "A number over $x$.",
        [
          ["$y = 5x$", "Linear."],
          ["$y = x^5$", "A power."],
        ],
      ),
      typed("Your turn", "$y = \\frac{12}{x}$ when $x = 4$", "3", "$12 \\div 4$.", "3."),
      choose(
        "Watch out",
        "Zoe joins the two branches of $y = \\frac1x$ through the origin. What's wrong?",
        "There's no point at $x = 0$: the branches stay separate",
        "$\\frac10$ is undefined.",
        [["Nothing", "The curve never crosses an axis."]],
      ),
      mistake(
        "Ed describes $y = \\frac1x$.",
        ["As $x$ grows, $y$ shrinks", "It reaches 0 eventually", "So it crosses the $x$-axis"],
        1,
        "It gets closer to 0 but never reaches it: no crossing.",
      ),
      choose(
        "Back to the problem",
        "“Each share is $\\frac{1000}{x}$. What happens as $x$ gets very large?”",
        "Each share gets closer to £0 but never reaches it",
        "Asymptote.",
        [
          ["Shares become negative", "$x$ is positive."],
          ["Shares stay at £1000", "They shrink."],
        ],
      ),
      quiz([
        [
          ["$y = \\frac1x$ at $x = 5$", "0.2", ["5", "−5"], "$1 \\div 5$."],
          ["$y = \\frac1x$ at $x = -0.25$", "−4", ["4", "−0.25"], "$1 \\div -0.25$."],
        ],
        [
          ["$y = \\frac1x$ crosses the axes", "never", ["once", "twice"], "Asymptotes."],
          ["$y = \\frac1x$ has how many branches?", "2", ["1", "4"], "Two."],
        ],
        [
          [
            "Which graph has asymptotes on both axes?",
            "$y = \\frac{1}{x}$",
            ["$y = x^2$", "$y = x^3$"],
            "Reciprocal.",
          ],
          [
            "A reciprocal graph shows",
            "inverse proportion",
            ["direct proportion", "a quadratic"],
            "$y = \\frac{k}{x}$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "distance-time",
    "GF-A14.a",
    "Distance–time graphs",
    "The gradient is the speed; flat means stopped.",
    [
      problem(
        "The walk to the shop",
        [
          "Sam walks 2 km to a shop in 20 minutes, stays 10 minutes, then walks home in 30 minutes. “What was his speed on the way there, in km/h?”",
          "By the end of this lesson, you can read and draw distance–time graphs.",
        ],
        walk,
      ),
      typed(
        "Warm-up",
        "20 minutes as a fraction of an hour",
        "1/3",
        "$\\frac{20}{60}$.",
        "$\\frac13$.",
      ),
      typed("Warm-up", "$2 \\div \\frac13$", "6", "$2 \\times 3$.", "6."),
      explain(
        "Discover",
        "Reading the story",
        [
          "On a **distance–time** graph, the **gradient** is the speed: steeper means faster. A **flat** section means stopped.",
          "A line coming back down means returning towards the start.",
        ],
        walk,
      ),
      choose(
        "Discover",
        "What happened from 20 to 30 minutes?",
        "He stopped at the shop",
        "Flat: no distance.",
        [
          ["He walked faster", "Flat means stopped."],
          ["He went home", "That's the falling part."],
        ],
        { picture: walk },
      ),
      worked(
        "Speed there",
        "2 km in 20 minutes. Speed in km/h?",
        [
          ["20 min = $\\frac13$ h", "Hours."],
          ["$2 \\div \\frac13 = 6$ km/h", "Distance ÷ time."],
        ],
        "6 km/h: a brisk walk.",
      ),
      steps(
        "Together",
        "The walk home",
        "2 km in 30 minutes.",
        [
          ["30 min =", "0.5 h", ["30 h", "÷ 60."], "0.5 h"],
          ["Speed:", "4 km/h", ["1 km/h", "$2 \\div 0.5$."], "4 km/h"],
        ],
        "Slower on the way home: less steep.",
      ),
      choose(
        "Together",
        "Which part of the walk was fastest?",
        "Walking to the shop",
        "Steepest: 6 km/h.",
        [
          ["Walking home", "4 km/h."],
          ["At the shop", "Stopped."],
        ],
        { picture: walk },
      ),
      typed(
        "Your turn",
        "A car travels 30 km in 20 minutes. Speed in km/h?",
        "90",
        "× 3.",
        "90 km/h.",
        { unit: "km/h", wrong: [["1.5", "That's km per minute."]] },
      ),
      choose("Your turn", "A steeper section means", "faster", "More distance per minute.", [
        ["slower", "Steeper: faster."],
      ]),
      choose(
        "Watch out",
        "Ivy says the flat section means Sam walked steadily. What's wrong?",
        "Flat means distance isn't changing: he stopped",
        "No movement.",
        [["Nothing", "Steady walking is a sloping straight line."]],
      ),
      mistake(
        "Ola finds Sam's speed home: 2 km in 30 minutes.",
        ["$2 \\div 30 = 0.067$", "So 0.067 km/h", "Very slow"],
        1,
        "That's km per minute. × 60: 4 km/h.",
      ),
      typed(
        "Back to the problem",
        "“What was his speed on the way to the shop, in km/h?”",
        "6",
        "2 km in ⅓ h.",
        "6 km/h.",
        { unit: "km/h", wrong: [["0.1", "That's per minute."]] },
      ),
      quiz([
        [
          ["Flat section means", "stopped", ["fastest", "returning"], "No change."],
          ["Line sloping down means", "returning", ["stopped", "speeding up"], "Getting closer."],
        ],
        [
          ["6 km in 30 min", "12 km/h", ["0.2 km/h", "3 km/h"], "× 2."],
          ["5 km in 15 min", "20 km/h", ["0.33 km/h", "75 km/h"], "× 4."],
        ],
        [
          ["The gradient of a distance–time graph is", "speed", ["distance", "time"], "Rate."],
          ["Steeper line means", "faster", ["slower", "stopped"], "More per minute."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "real-life",
    "GF-A14.b",
    "Other real-life graphs",
    "Conversion graphs, filling graphs and more: read and interpret.",
    [
      problem("Filling the vase", [
        "Water pours into a vase at a steady rate. The vase is narrow at the bottom and wide at the top. “Sketch the graph of depth against time.”",
        "By the end of this lesson, you can read and sketch graphs of real situations.",
      ]),
      choose(
        "Warm-up",
        "A steady rate makes a straight-line graph",
        "when the container is the same width all the way",
        "Constant rise.",
        [["always", "Shape matters."]],
      ),
      typed("Warm-up", "£1 = €1.2. How many euros for £5?", "6", "× 1.2.", "€6."),
      explain(
        "Discover",
        "Shape tells the story",
        [
          "**Conversion graphs** are straight lines through 0: read across and up. **Filling graphs**: narrow parts fill fast (steep), wide parts fill slowly (shallow).",
          "Always read the axis labels and the scales first.",
        ],
        {
          kind: "graph",
          range: { xMin: 0, xMax: 10, yMin: 0, yMax: 12 },
          lines: [{ m: 1.2, c: 0 }],
        },
      ),
      choose(
        "Discover",
        "Narrow bottom, wide top: depth against time is",
        "steep at first, then less steep",
        "Narrow fills fast.",
        [
          ["less steep, then steep", "That's a wide bottom."],
          ["a straight line", "The width changes."],
        ],
      ),
      worked(
        "A conversion",
        "Use $y = 1.2x$ (£ to €) to convert £7.50.",
        [
          ["Go up from £7.50 to the line", "Read."],
          ["Across: €9", "$7.5 \\times 1.2$."],
        ],
        "Conversion graphs scale both ways.",
      ),
      steps(
        "Together",
        "A phone plan: £10, plus 5p a minute after 100 minutes",
        "Describe the graph.",
        [
          [
            "For 0–100 minutes it's",
            "flat at £10",
            ["rising", "The first 100 are included."],
            "Flat",
          ],
          ["After 100 minutes it", "rises steadily", ["falls", "5p each minute."], "A bend at 100"],
        ],
        "Real graphs can be made of pieces.",
      ),
      choose(
        "Together",
        "A cylinder (same width) fills at a steady rate. The graph",
        "is a straight line",
        "Constant rise.",
        [["curves", "Same width: straight."]],
      ),
      choose(
        "Your turn",
        "A kettle's temperature rises, then levels off at 100°C. The graph",
        "rises then goes flat",
        "Boiling point.",
        [
          ["falls", "It heats up."],
          ["keeps rising", "It stops at 100."],
        ],
      ),
      typed("Your turn", "Using £1 = €1.2, how many pounds for €24?", "20", "÷ 1.2.", "£20."),
      choose(
        "Watch out",
        "Ben reads the conversion graph using the wrong axis. How to avoid it?",
        "Check which axis is which currency first",
        "Read the labels.",
        [["Always read up", "It depends what's on each axis."]],
      ),
      mistake(
        "Kim sketches a vase wide at the bottom and narrow at the top.",
        ["Wide part fills slowly", "So the graph starts shallow", "Then it gets shallower still"],
        2,
        "The narrow top fills fast: the graph gets steeper.",
      ),
      choose(
        "Back to the problem",
        "“Narrow at the bottom, wide at the top. Sketch depth against time.”",
        "Steep at first, getting less steep",
        "Narrow fills fast.",
        [
          ["Shallow, then steep", "That's the other way up."],
          ["A straight line", "The width changes."],
        ],
      ),
      quiz([
        [
          ["£1 = €1.1. Euros for £20", "€22", ["€18.18", "€21.10"], "× 1.1."],
          ["£1 = €1.25. Pounds for €50", "£40", ["£62.50", "£48.75"], "÷ 1.25."],
        ],
        [
          ["Narrow part of a container fills", "fast", ["slowly", "not at all"], "Less space."],
          ["Wide part fills", "slowly", ["fast", "instantly"], "More space."],
        ],
        [
          [
            "A flat section on a real-life graph means",
            "no change",
            ["fastest change", "an error"],
            "Constant.",
          ],
          ["First, read the", "axes and scales", ["title only", "gradient"], "Labels."],
        ],
      ]),
    ],
  ),
];
