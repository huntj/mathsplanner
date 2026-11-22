// GCSE Foundation, "Graphs", on the stepped template (docs/proposals/lesson-stepped.md): lines
// and parabolas, cubics, the reciprocal graph, distance–time graphs and other real-life graphs.
// Graph questions are asked on the graph; distance–time drawings carry their own scales, so the
// words say only what to find.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { cubic, fourGraphs, gfGraphs, negCubic, plotted, reciprocal, walk } from "./gf-graphs.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { DrawingPic, Picture, Point, Range, Screen, UnitLesson } from "./types.ts";

const GR = gfGraphs;
const ALGEBRA = "Algebra: the equation is the picture.";
const P = (x: number, y: number): Point => ({ x, y });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";
/** A lesson's own worked example, drawn. */
const workedOn = (id: string, picture: Picture): Screen => {
  const w = workedFrom(GR, id);
  return w.kind === "worked" ? { ...w, picture } : w;
};
const graph = (
  range: Range,
  lines: [number, number][] = [],
  curves: (
    { kind: "quadratic"; a: number; b: number; c: number } | { kind: "inverse"; k: number }
  )[] = [],
): Picture => ({
  kind: "graph",
  range,
  ...(lines.length ? { lines: lines.map(([m, c]) => ({ m, c })) } : {}),
  ...(curves.length ? { curves } : {}),
});
const quad = (a: number, c: number) => ({ kind: "quadratic" as const, a, b: 0, c });
const SQUARE: Range = { xMin: -4, xMax: 4, yMin: -4, yMax: 5 };

/**
 * A distance–time graph through (time, distance) points, with the times and distances that
 * matter marked on the axes.
 */
function story(points: [number, number][], times: number[], distances: number[]): DrawingPic {
  const tMax = Math.max(...times, ...points.map(([t]) => t));
  const dMax = Math.max(...distances, ...points.map(([, d]) => d));
  const sx = 6 / tMax;
  const sy = 4 / dMax;
  const items: DrawingPic["items"] = [
    { line: [P(0, 0), P(6.3, 0)] },
    { line: [P(0, 0), P(0, 4.3)] },
    { text: "time (min)", at: P(3, -1) },
    { text: "distance (km)", at: P(1.4, 4.8) },
  ];
  for (const t of times) {
    items.push({ line: [P(t * sx, 0), P(t * sx, -0.15)] });
    items.push({ text: String(t), at: P(t * sx, -0.45) });
  }
  for (const d of distances) {
    items.push({ line: [P(0, d * sy), P(-0.15, d * sy)] });
    items.push({ text: String(d), at: P(-0.5, d * sy) });
  }
  points.forEach(([t, d], i) => {
    const next = points[i + 1];
    if (next)
      items.push({ line: [P(t * sx, d * sy), P(next[0] * sx, next[1] * sy)], tone: "find" });
  });
  return { kind: "drawing", items };
}

// ---------------------------------------------------------------------------------------------
// Straight lines and parabolas.

const SHAPES = "gf-graphs/linear-quadratic";
const shapesMethod = [
  "Find the highest power of $x$.",
  "Power 1: a line. Power 2: a parabola.",
  "Sign of $x^2$: + gives ∪, − gives ∩.",
];
const shape = (prompt: string, right: string, extra: object = {}) =>
  pick(
    prompt,
    right,
    ["A straight line", "A ∪ parabola", "A ∩ parabola"].filter((s) => s !== right),
    "The highest power, and its sign.",
    { asks: "shape", ...extra },
  );
const match = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick(
    "Which equation is this?",
    right,
    others,
    "Line or curve? Which way up? Where does it cross?",
    {
      asks: "equation",
      picture,
      ...extra,
    },
  );

const shapes = stepped(find(GR, SHAPES), {
  method: shapesMethod,
  variation: {
    relationship: "the highest power gives the shape",
    unknowns: ["shape", "equation"],
    surface: ["moved up", "upside down", "a line"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Read the highest power",
        ["**Highest power 1: a straight line. Highest power 2: a parabola.**"],
        fourGraphs,
        "A negative $x^2$ term turns it upside down: ∩.",
      ),
      reworded(GR, SHAPES, "$y = -x^2 + 4$ is shaped like", { tag: "The rule" }),

      ...owned(GR, SHAPES, "Warm-up", "Check you remember"),

      methodCard("The method", shapesMethod, fourGraphs),
      workedFrom(GR, SHAPES),
      calc(
        "Your turn",
        "Complete the table for $y = x^2 - 3$.",
        graph({ xMin: -4, xMax: 4, yMin: -4, yMax: 5 }, [], [quad(1, -3)]),
        [
          ["$x = -2$: $y =$", "1", "$(-2)^2 = 4$, then − 3."],
          ["$x = 0$: $y =$", "-3", "0 − 3."],
          ["$x = 2$: $y =$", "1", "The same as at −2."],
        ],
        "A ∪, symmetrical about the $y$-axis.",
      ),

      calc(
        "Practise",
        "Complete the table for $y = 3 - 2x$.",
        graph(SQUARE, [[-2, 3]]),
        [
          ["$x = 0$: $y =$", "3", "3 − 0."],
          ["$x = 2$: $y =$", "-1", "3 − 4."],
        ],
        "A straight line, sloping down.",
      ),
      ...owned(GR, SHAPES, "Together", "Practise"),
      ...owned(GR, SHAPES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which shape? Watch what changes.",
        [
          shape("$y = 3x + 1$", "A straight line"),
          shape("$y = 3x^2 + 1$", "A ∪ parabola", { changed: "Squared." }),
          shape("$y = -3x^2 + 1$", "A ∩ parabola", { changed: "A negative $x^2$." }),
          shape("$y = 1 - 3x$", "A straight line", { changed: "Back to power 1." }),
        ],
        "The highest power sets the shape.",
      ),

      questionSet(
        "Variation",
        "Match the graph. Watch what changes.",
        [
          match(graph(SQUARE, [], [quad(1, 0)]), "$y = x^2$", ["$y = -x^2$", "$y = 2x$"], {
            expect: [
              "Ben says $x = -2$ in $y = x^2$ gives $y = -4$. Right?",
              "No",
              "$(-2)^2 = 4$: a negative squared is positive.",
              [["Yes", "What is $-2 \\times -2$?"]],
            ],
          }),
          match(graph(SQUARE, [], [quad(1, 2)]), "$y = x^2 + 2$", ["$y = x^2$", "$y = x^2 - 2$"], {
            changed: "Moved up.",
          }),
          match(
            graph(SQUARE, [], [quad(-1, 2)]),
            "$y = -x^2 + 2$",
            ["$y = x^2 + 2$", "$y = -x^2$"],
            { changed: "Upside down." },
          ),
          match(graph(SQUARE, [[-1, 2]]), "$y = 2 - x$", ["$y = x - 2$", "$y = -x^2 + 2$"], {
            changed: "A line.",
          }),
        ],
        "Shape first, then where it crosses the $y$-axis.",
      ),
      own(GR, SHAPES, "Spot the mistake"),

      own(GR, SHAPES, "Exit check"),

      reworded(
        GR,
        SHAPES,
        "“Match $y = -x^2 + 4$ to its graph.”",
        { tag: "Real life", picture: fourGraphs },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Highest power 1: a straight line. Highest power 2: a parabola.**"],
        fourGraphs,
        [
          "**Highest power 1: a straight line. Highest power 2: a parabola.**",
          "+$x^2$: ∪. −$x^2$: ∩.",
          "A negative squared is positive.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Cubic graphs.

const CUBIC = "gf-graphs/cubic";
const cubicMethod = [
  "Cube each $x$, keeping its sign.",
  "Plot the points.",
  "Join with a smooth S-shaped curve.",
];
const SQUARED = plotted((x) => x ** 2, -2, 2, { yMin: -1, yMax: 4.2 });
const cubes = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Which equation is this?", right, others, "S-shape, ∪, or two branches?", {
    asks: "graph",
    picture,
    ...extra,
  });

const cubicLesson = stepped(find(GR, CUBIC), {
  method: cubicMethod,
  variation: {
    relationship: "the shape of a cubic",
    unknowns: ["value", "graph"],
    surface: ["negative x", "flipped", "squared, not cubed"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Negatives stay negative",
        ["**A cubic is an S-shape: negative x gives negative y.**"],
        cubic,
        "$y = -x^3$ is the same shape, flipped.",
      ),
      reworded(GR, CUBIC, "Where does $y = x^3$ pass through?", { tag: "The rule" }),

      ...owned(GR, CUBIC, "Warm-up", "Check you remember"),

      methodCard("The method", cubicMethod, cubic),
      workedFrom(GR, CUBIC),
      calc(
        "Your turn",
        "Complete the table for $y = x^3 + 1$.",
        undefined,
        [
          ["$x = -2$: $y =$", "-7", "−8 + 1."],
          ["$x = 0$: $y =$", "1", "0 + 1."],
          ["$x = 2$: $y =$", "9", "8 + 1."],
        ],
        "Plot them and join with an S-shape.",
      ),

      calc(
        "Practise",
        "Find $y$ for $y = 2x^3$.",
        undefined,
        [
          ["$x = -1$: $y =$", "-2", "2 × (−1)."],
          ["$x = 3$: $y =$", "54", "2 × 27."],
        ],
        "Cube first, then × 2.",
      ),
      ...owned(GR, CUBIC, "Together", "Practise"),
      ...owned(GR, CUBIC, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Cube it. Watch what changes.",
        [
          pick("$2^3$", "8", ["6", "9"], "2 × 2 × 2.", { asks: "value" }),
          pick("$(-2)^3$", "−8", ["8", "−6"], "Three negatives.", {
            asks: "value",
            changed: "Negative.",
          }),
          pick("$(-1)^3$", "−1", ["1", "−3"], "−1 × −1 × −1.", {
            asks: "value",
            changed: "Minus one.",
          }),
          pick("$0.5^3$", "0.125", ["1.5", "0.25"], "0.5 × 0.5 × 0.5.", {
            asks: "value",
            changed: "A half.",
          }),
        ],
        "A negative cubed stays negative.",
      ),

      questionSet(
        "Variation",
        "Match the graph. Watch what changes.",
        [
          cubes(cubic, "$y = x^3$", ["$y = -x^3$", "$y = x^2$"], {
            expect: [
              "Leo works out $(-3)^3 = 27$. Right?",
              "No",
              "Three negatives multiply to a negative: −27.",
              [["Yes", "Is $-3 \\times -3 \\times -3$ positive?"]],
            ],
          }),
          cubes(negCubic, "$y = -x^3$", ["$y = x^3$", "$y = -x^2$"], { changed: "Flipped." }),
          cubes(SQUARED, "$y = x^2$", ["$y = x^3$", "$y = \\frac1x$"], {
            changed: "Squared, not cubed.",
          }),
          cubes(reciprocal, "$y = \\frac1x$", ["$y = x^3$", "$y = -x^3$"], {
            changed: "Two branches.",
          }),
        ],
        "Cubic: S-shape. Quadratic: ∪. Reciprocal: two branches.",
      ),
      own(GR, CUBIC, "Spot the mistake"),

      own(GR, CUBIC, "Exit check"),

      reworded(
        GR,
        CUBIC,
        "“Sketch $y = x^3$.” The shape:",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A cubic is an S-shape: negative x gives negative y.**"],
        cubic,
        [
          "**A cubic is an S-shape: negative x gives negative y.**",
          "$y = x^3$ goes through the origin.",
          "$(-3)^3 = -27$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// The reciprocal graph.

const RECIP = "gf-graphs/reciprocal";
const recipMethod = [
  "Work out $y = \\frac{k}{x}$ for each $x$.",
  "Positive $x$: top right. Negative $x$: bottom left.",
  "The curves never touch the axes.",
];
const WIDE: Range = { xMin: -7, xMax: 7, yMin: -7, yMax: 7 };
const branches = (picture: Picture, right: string, others: string[], extra: object = {}) =>
  pick("Which equation is this?", right, others, "Two branches, one curve, or an S?", {
    asks: "graph",
    picture,
    ...extra,
  });

const reciprocalLesson = stepped(find(GR, RECIP), {
  method: recipMethod,
  variation: {
    relationship: "y = k ÷ x and its two branches",
    unknowns: ["value", "graph"],
    surface: ["double x", "negative x", "flipped"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Never touching the axes",
        ["**Two separate curves that get close to the axes but never touch them.**"],
        reciprocal,
        "There's no point at $x = 0$: you can't divide by 0.",
      ),
      reworded(GR, RECIP, "Why is there no point at $x = 0$?", { tag: "The rule" }),

      ...owned(GR, RECIP, "Warm-up", "Check you remember"),

      methodCard("The method", recipMethod, reciprocal),
      workedFrom(GR, RECIP),
      calc(
        "Your turn",
        "Find $y$ for $y = \\frac{6}{x}$.",
        graph(WIDE, [], [{ kind: "inverse", k: 6 }]),
        [
          ["$x = 2$: $y =$", "3", "6 ÷ 2."],
          ["$x = -3$: $y =$", "-2", "6 ÷ (−3)."],
          ["$x = 12$: $y =$", "0.5", "6 ÷ 12."],
        ],
        "Bigger $x$, smaller $y$.",
      ),

      calc(
        "Practise",
        "Find $y$ for $y = \\frac{10}{x}$.",
        undefined,
        [
          ["$x = 4$: $y =$", "2.5", "10 ÷ 4."],
          ["$x = -5$: $y =$", "-2", "10 ÷ (−5)."],
        ],
        "Negative $x$: negative $y$.",
      ),
      ...owned(GR, RECIP, "Together", "Practise"),
      ...owned(GR, RECIP, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find $y$ for $y = \\frac{12}{x}$. Watch what changes.",
        [
          pick("$x = 3$", "4", ["36", "9"], "12 ÷ 3.", { asks: "value" }),
          pick("$x = 6$", "2", ["72", "6"], "12 ÷ 6.", { asks: "value", changed: "Double $x$." }),
          pick("$x = -4$", "−3", ["3", "−48"], "12 ÷ (−4).", {
            asks: "value",
            changed: "Negative.",
          }),
          pick("$x = 24$", "0.5", ["2", "−0.5"], "12 ÷ 24.", {
            asks: "value",
            changed: "A large $x$.",
          }),
        ],
        "Double $x$, halve $y$.",
      ),

      questionSet(
        "Variation",
        "Match the graph. Watch what changes.",
        [
          branches(reciprocal, "$y = \\frac1x$", ["$y = x^2$", "$y = -\\frac1x$"], {
            expect: [
              "Ed says $y = \\frac1x$ reaches 0 when $x$ is big enough. Right?",
              "No",
              "$y$ gets closer to 0, but never reaches it.",
              [["Yes", "Is $\\frac{1}{1000}$ equal to 0?"]],
            ],
          }),
          branches(
            graph({ xMin: -5, xMax: 5, yMin: -5, yMax: 5 }, [], [{ kind: "inverse", k: -1 }]),
            "$y = -\\frac1x$",
            ["$y = \\frac1x$", "$y = -x^3$"],
            { changed: "Flipped." },
          ),
          branches(SQUARED, "$y = x^2$", ["$y = \\frac1x$", "$y = x^3$"], {
            changed: "One curve.",
          }),
          branches(cubic, "$y = x^3$", ["$y = \\frac1x$", "$y = x^2$"], { changed: "An S-shape." }),
        ],
        "Reciprocal: two branches that never touch the axes.",
      ),
      own(GR, RECIP, "Spot the mistake"),

      own(GR, RECIP, "Exit check"),

      reworded(
        GR,
        RECIP,
        "“Each share is $\\frac{1000}{x}$. What happens as $x$ gets very large?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Two separate curves that get close to the axes but never touch them.**"],
        reciprocal,
        [
          "**Two separate curves that get close to the axes but never touch them.**",
          "$y = \\frac{k}{x}$: no point at $x = 0$.",
          "Double $x$, halve $y$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Distance–time graphs.

const DT = "gf-graphs/distance-time";
const dtMethod = [
  "Read the distance and time for one part.",
  "Minutes to hours.",
  "Speed = distance ÷ time.",
];
const BIKE = story(
  [
    [0, 0],
    [30, 6],
    [45, 6],
    [60, 12],
  ],
  [30, 45, 60],
  [6, 12],
);
const RUN = story(
  [
    [0, 0],
    [20, 4],
    [30, 4],
    [40, 8],
  ],
  [20, 30, 40],
  [4, 8],
);
const happening = (picture: Picture, right: string, extra: object = {}) =>
  pick(
    "What is happening?",
    right,
    ["Moving away", "Stopped", "Coming back"].filter((s) => s !== right),
    "Up: away. Flat: stopped. Down: back.",
    { asks: "story", picture, ...extra },
  );
const one = (points: [number, number][]) => story(points, [], []);

const distanceTime = stepped(find(GR, DT), {
  method: dtMethod,
  variation: {
    relationship: "the gradient as the speed",
    unknowns: ["story", "speed"],
    surface: ["flat", "coming back", "quicker"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Reading the story",
        ["**On a distance–time graph, the gradient is the speed. Flat means stopped.**"],
        walk,
        "Steeper: faster. Coming down: going back.",
      ),
      reworded(GR, DT, "What happened from 20 to 30 minutes?", {
        tag: "The rule",
        title: "What happened in the flat part?",
      }),

      ...owned(GR, DT, "Warm-up", "Check you remember"),

      methodCard("The method", dtMethod, walk),
      workedFrom(GR, DT),
      calc(
        "Your turn",
        "A bike ride. Use the first part.",
        BIKE,
        [
          ["Distance:", "6", "Up to the first corner.", { after: "km" }],
          ["Time:", "30", "Across to the first corner.", { after: "min" }],
          ["Speed:", "12", "6 km in half an hour.", { after: "km/h" }],
        ],
        "12 km/h.",
      ),

      calc(
        "Practise",
        "A run. Use the last part.",
        RUN,
        [
          ["Distance:", "4", "From 4 km up to 8 km.", { after: "km" }],
          ["Time:", "10", "From 30 min to 40 min.", { after: "min" }],
          ["Speed:", "24", "4 km in a sixth of an hour.", { after: "km/h" }],
        ],
        "24 km/h: the steepest part.",
      ),
      ...owned(GR, DT, "Together", "Practise"),
      ...owned(GR, DT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Read the graph. Watch what changes.",
        [
          happening(
            one([
              [0, 0],
              [60, 3],
            ]),
            "Moving away",
          ),
          happening(
            one([
              [0, 2],
              [60, 2],
            ]),
            "Stopped",
            { changed: "Flat." },
          ),
          happening(
            one([
              [0, 3],
              [60, 0],
            ]),
            "Coming back",
            { changed: "Going down." },
          ),
          happening(
            one([
              [0, 0],
              [20, 3],
            ]),
            "Moving away",
            { changed: "Steeper: faster." },
          ),
        ],
        "Up: away. Flat: stopped. Down: back.",
      ),

      questionSet(
        "Variation",
        "Find the speed. Watch what changes.",
        [
          pick("2 km in 30 min", "4 km/h", ["0.067 km/h", "60 km/h"], "30 min is 0.5 h.", {
            asks: "speed",
            expect: [
              "For 2 km in 30 minutes, Ola does $2 \\div 30$. Right?",
              "No",
              "Change to hours first: $2 \\div 0.5 = 4$ km/h.",
              [["Yes", "Is 30 minutes 30 hours?"]],
            ],
          }),
          pick("3 km in 30 min", "6 km/h", ["0.1 km/h", "90 km/h"], "3 ÷ 0.5.", {
            asks: "speed",
            changed: "Further.",
          }),
          pick("3 km in 15 min", "12 km/h", ["0.2 km/h", "45 km/h"], "3 ÷ 0.25.", {
            asks: "speed",
            changed: "Quicker.",
          }),
          pick("3 km in 45 min", "4 km/h", ["0.067 km/h", "15 km/h"], "3 ÷ 0.75.", {
            asks: "speed",
            changed: "Slower.",
          }),
        ],
        "Minutes to hours, then distance ÷ time.",
      ),
      own(GR, DT, "Spot the mistake"),

      own(GR, DT, "Exit check"),

      reworded(
        GR,
        DT,
        "“What was his speed on the way to the shop, in km/h?”",
        { tag: "Real life", picture: walk },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**On a distance–time graph, the gradient is the speed. Flat means stopped.**"],
        walk,
        [
          "**On a distance–time graph, the gradient is the speed. Flat means stopped.**",
          "Minutes to hours before km/h.",
          "Steeper is faster.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Other real-life graphs.

const REAL = "gf-graphs/real-life";
const realMethod = [
  "Read the axis labels.",
  "Conversion: up to the line, then across.",
  "Shape: steep is a fast change; flat is none.",
];
const EUROS = graph({ xMin: 0, xMax: 10, yMin: 0, yMax: 12 }, [[1.2, 0]]);
const TAXI = graph({ xMin: 0, xMax: 10, yMin: 0, yMax: 18 }, [[1.5, 3]]);
const [LINE, STEEP, SHALLOW, FLAT] = [
  "A straight line",
  "Steep, then shallow",
  "Shallow, then steep",
  "Rises, then flat",
] as const;
const filling = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Narrow fills fast; wide fills slowly.", { asks: "shape", ...extra });
const convert = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "£ to €: × 1.2. € to £: ÷ 1.2.", { asks: "convert", ...extra });

const realLife = stepped(find(GR, REAL), {
  method: realMethod,
  variation: {
    relationship: "a graph's shape and what it means",
    unknowns: ["shape", "convert"],
    surface: ["narrow first", "wide first", "the other way"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Shape tells the story",
        ["**Read the axes, then the shape: steep is a fast change, flat is none.**"],
        EUROS,
        "Narrow containers fill fast; wide ones fill slowly.",
      ),
      reworded(GR, REAL, "Narrow bottom, wide top: depth against time is", { tag: "The rule" }),

      ...owned(GR, REAL, "Warm-up", "Check you remember"),

      methodCard("The method", realMethod, EUROS),
      workedOn(REAL, EUROS),
      calc(
        "Your turn",
        "Pounds to euros: £1 = €1.20.",
        EUROS,
        [
          ["£5 in euros: €", "6", "Up from 5, then across."],
          ["€18 in pounds: £", "15", "18 ÷ 1.2."],
        ],
        "€6 and £15.",
      ),

      calc(
        "Practise",
        "A taxi costs £3, then £1.50 a mile.",
        TAXI,
        [
          ["4 miles cost: £", "9", "3 + 4 × 1.50."],
          ["£15 buys miles:", "8", "(15 − 3) ÷ 1.50."],
        ],
        "£9; 8 miles.",
      ),
      ...owned(GR, REAL, "Together", "Practise"),
      ...owned(GR, REAL, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which graph shape? Watch what changes.",
        [
          filling("A cylinder fills steadily", LINE, [STEEP, SHALLOW]),
          filling("Narrow at the bottom, wide at the top", STEEP, [LINE, SHALLOW], {
            changed: "Narrow first.",
          }),
          filling("Wide at the bottom, narrow at the top", SHALLOW, [STEEP, LINE], {
            changed: "Wide first.",
          }),
          filling("A kettle boils, then stays at 100°C", FLAT, [LINE, STEEP], {
            changed: "It levels off.",
          }),
        ],
        "The shape tells you how fast it changes.",
      ),

      questionSet(
        "Variation",
        "Convert: £1 = €1.20. Watch what changes.",
        [
          convert("£10 in euros", "€12", ["€8.33", "€11.20"], {
            expect: [
              "A vase is wide at the bottom, narrow at the top. Kim draws it getting shallower. Right?",
              "No",
              "Wide fills slowly, narrow fast: shallow, then steeper.",
              [["Yes", "Does the narrow part fill faster or slower?"]],
            ],
          }),
          convert("£25 in euros", "€30", ["€20.83", "€26.20"], { changed: "More pounds." }),
          convert("€12 in pounds", "£10", ["£14.40", "£10.80"], { changed: "The other way." }),
          convert("€30 in pounds", "£25", ["£36", "£28.80"], { changed: "More euros." }),
        ],
        "Check which axis is which before you read.",
      ),
      reworded(
        GR,
        REAL,
        "Where did it go wrong?",
        { text: "Kim sketches a vase: wide at the bottom, narrow at the top." },
        "Spot the mistake",
      ),

      own(GR, REAL, "Exit check"),

      reworded(
        GR,
        REAL,
        "“Narrow at the bottom, wide at the top. Sketch depth against time.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Read the axes, then the shape: steep is a fast change, flat is none.**"],
        EUROS,
        [
          "**Read the axes, then the shape: steep is a fast change, flat is none.**",
          "Narrow fills fast; wide fills slowly.",
          "Conversion graphs go through 0.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

export const gfGraphsStepped: [string, UnitLesson[]][] = [
  [SHAPES, [shapes]],
  [CUBIC, [cubicLesson]],
  [RECIP, [reciprocalLesson]],
  [DT, [distanceTime]],
  [REAL, [realLife]],
];
