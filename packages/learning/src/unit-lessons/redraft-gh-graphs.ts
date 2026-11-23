// GCSE Higher, "Graphs", on the stepped template (docs/proposals/lesson-stepped.md): exponential
// graphs, trigonometric graphs, transforming graphs, exponential models, gradients of curves,
// areas under graphs and velocity–time graphs. The drawn axes carry their own numbers, so
// questions asked on them keep numbers out of the words.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import {
  cosine,
  curves,
  curveTangent,
  expAxes,
  exponential,
  ghGraphs,
  r,
  shifted,
  sine,
  tangent,
  trigAxes,
  twoExps,
  velocity,
} from "./gh-graphs.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Screen, UnitLesson } from "./types.ts";

const GR = ghGraphs;
const ALGEBRA = "Algebra: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";
/** A screen with one piece of its wording changed. */
const retext = (screen: Screen, from: string, to: string): Screen =>
  JSON.parse(JSON.stringify(screen).replace(from, to)) as Screen;
const which = (
  picture: Picture,
  right: string,
  others: string[],
  asks: string,
  extra: object = {},
) =>
  pick("Which equation is this?", right, others, "Where does it cross, and which way does it go?", {
    asks,
    picture,
    ...extra,
  });

// ---------------------------------------------------------------------------------------------
// Exponential graphs.

const EXP = "gh-graphs/exponential";
const expMethod = [
  "Make a table: $k^x$ for each $x$.",
  "It passes through (0, 1).",
  "Join with a smooth curve that never touches the $x$-axis.",
];

const exponentialLesson = stepped(find(GR, EXP), {
  method: expMethod,
  variation: {
    relationship: "repeated multiplying as a curve",
    unknowns: ["value", "graph"],
    surface: ["a fraction", "a steeper curve", "not exponential"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Doubling",
        ["**y = kˣ passes through (0, 1), grows ever faster, and never touches the x-axis.**"],
        exponential,
        "$2^x$ doubles with each step right.",
      ),
      reworded(GR, EXP, "$y = 3^x$ crosses the $y$-axis at", { tag: "The rule" }),

      ...owned(GR, EXP, "Warm-up", "Check you remember"),

      methodCard("The method", expMethod, exponential),
      workedFrom(GR, EXP),
      calc(
        "Your turn",
        "Complete the table for $y = 3^x$.",
        undefined,
        [
          ["$x = 0$: $y =$", "1", "Any number to the power 0."],
          ["$x = 2$: $y =$", "9", "3 × 3."],
          ["$x = 3$: $y =$", "27", "3 × 3 × 3."],
        ],
        "1, 9, 27: growing faster each step.",
      ),

      calc(
        "Practise",
        "Complete the table for $y = (\\frac12)^x$.",
        undefined,
        [
          ["$x = -2$: $y =$", "4", "$2^2$."],
          ["$x = 3$: $y =$", "0.125", "$\\frac18$."],
        ],
        "Falling: halving each step right.",
      ),
      reworded(GR, EXP, "Compare $y = (\\frac12)^x$", {
        tag: "Practise",
        title: "Compare the halving graph",
      }),
      reworded(GR, EXP, "Which graph is $y = (\\frac12)^x$ (lighter)?", {
        tag: "Practise",
        title: "Which graph halves each step: the lighter one?",
      }),
      ...owned(GR, EXP, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Work it out. Watch what changes.",
        [
          pick("$2^5$", "32", ["10", "25"], "2 × 2 × 2 × 2 × 2.", { asks: "value" }),
          pick("$2^{-1}$", "0.5", ["−2", "−0.5"], "One over 2.", {
            asks: "value",
            changed: "A negative power.",
          }),
          pick("$3^0$", "1", ["0", "3"], "Any number to the power 0.", {
            asks: "value",
            changed: "Power 0.",
          }),
          pick("$0.5^2$", "0.25", ["1", "0.1"], "0.5 × 0.5.", {
            asks: "value",
            changed: "A fraction.",
          }),
        ],
        "A negative power gives a fraction, not a negative.",
      ),

      questionSet(
        "Variation",
        "Match the graph. Watch what changes.",
        [
          which(exponential, "$y = 2^x$", ["$y = x^2$", "$y = (\\frac12)^x$"], "graph", {
            expect: [
              "Ben says $y = 4^x$ passes through (0, 4). Right?",
              "No",
              "$4^0 = 1$: every $y = k^x$ passes through (0, 1).",
              [["Yes", "What is $4^0$?"]],
            ],
          }),
          which(
            curves(expAxes, [{ f: (x) => 0.5 ** x }]),
            "$y = (\\frac12)^x$",
            ["$y = 2^x$", "$y = -2^x$"],
            "graph",
            {
              changed: "Falling.",
            },
          ),
          which(
            curves(expAxes, [{ f: (x) => 3 ** x }]),
            "$y = 3^x$",
            ["$y = 2^x$", "$y = x^3$"],
            "graph",
            {
              changed: "Steeper.",
            },
          ),
          which(
            curves(expAxes, [{ f: (x) => x * x }]),
            "$y = x^2$",
            ["$y = 2^x$", "$y = (\\frac12)^x$"],
            "graph",
            {
              changed: "Not exponential.",
            },
          ),
        ],
        "Exponentials cross at (0, 1) and never reach the $x$-axis.",
      ),
      own(GR, EXP, "Spot the mistake"),

      own(GR, EXP, "Exit check"),

      reworded(
        GR,
        EXP,
        "“Which is decreasing?”",
        { tag: "Real life", picture: twoExps },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**y = kˣ passes through (0, 1), grows ever faster, and never touches the x-axis.**"],
        exponential,
        [
          "**y = kˣ passes through (0, 1), grows ever faster, and never touches the x-axis.**",
          "$k$ between 0 and 1: falling.",
          "$2^{-1} = \\frac12$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Graphs of sin, cos and tan.

const TRIG = "gh-graphs/trig-graphs";
const trigMethod = [
  "Find one answer with the calculator.",
  "Use the graph's symmetry for the other.",
  "Keep both inside 0° to 360°.",
];
const second = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Use the graph's symmetry.", { asks: "second", ...extra });

const trigGraphs = stepped(find(GR, TRIG), {
  method: trigMethod,
  variation: {
    relationship: "repeating waves and their symmetry",
    unknowns: ["graph", "second"],
    surface: ["cos, not sin", "tan", "a flipped wave"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three shapes",
        [
          "**sin and cos are waves between −1 and 1, repeating every 360°. tan repeats every 180°.**",
        ],
        sine,
        "sin x = 0.5 twice: 30° and 150°.",
      ),
      reworded(GR, TRIG, "Which graph is this?", { tag: "The rule" }, "Discover"),

      ...owned(GR, TRIG, "Warm-up", "Check you remember"),

      methodCard("The method", trigMethod, sine),
      workedFrom(GR, TRIG),
      calc(
        "Your turn",
        "Solve $\\sin x = 0.8$, $0° \\le x \\le 360°$, to 1 d.p.",
        undefined,
        [
          ["First answer:", "53.1", "sin⁻¹ 0.8.", { after: "°" }],
          ["Second answer:", "126.9", "180° − 53.1°.", { after: "°" }],
        ],
        "53.1° and 126.9°.",
      ),

      calc(
        "Practise",
        "Solve $\\cos x = 0.5$, $0° \\le x \\le 360°$.",
        undefined,
        [
          ["First answer:", "60", "cos⁻¹ 0.5.", { after: "°" }],
          ["Second answer:", "300", "360° − 60°.", { after: "°" }],
        ],
        "60° and 300°.",
      ),
      reworded(GR, TRIG, "$\\cos x = 0.5$ for $0° \\le x \\le 360°$", {
        tag: "Practise",
        title: "Solve $\\cos x = 0.5$ in one full turn",
      }),
      reworded(GR, TRIG, "Which graph has asymptotes?", { tag: "Practise" }),
      ...owned(GR, TRIG, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which graph? Watch what changes.",
        [
          which(sine, "$y = \\sin x$", ["$y = \\cos x$", "$y = \\tan x$"], "graph"),
          which(cosine, "$y = \\cos x$", ["$y = \\sin x$", "$y = \\tan x$"], "graph", {
            changed: "Starts at the top.",
          }),
          which(tangent, "$y = \\tan x$", ["$y = \\sin x$", "$y = \\cos x$"], "graph", {
            changed: "Asymptotes.",
          }),
          which(
            curves(trigAxes, [{ f: (x) => -Math.sin(r(x)) }]),
            "$y = -\\sin x$",
            ["$y = \\sin x$", "$y = \\cos x$"],
            "graph",
            {
              changed: "Flipped.",
            },
          ),
        ],
        "sin starts at 0; cos at 1; tan has gaps.",
      ),

      questionSet(
        "Variation",
        "The second answer in 0° to 360°. Watch what changes.",
        [
          second("$\\sin x = 0.5$; one answer 30°", "150°", ["330°", "60°"], {
            expect: [
              "For $\\sin x = 0.5$, Leo gives $360° - 30° = 330°$. Right?",
              "No",
              "sin is symmetrical about 90°: $180° - 30° = 150°$.",
              [["Yes", "Is sin 330° positive?"]],
            ],
          }),
          second("$\\sin x = 0.8$; one answer 53.1°", "126.9°", ["306.9°", "233.1°"], {
            changed: "A new value.",
          }),
          second("$\\cos x = 0.5$; one answer 60°", "300°", ["120°", "240°"], { changed: "cos." }),
          second("$\\tan x = 1$; one answer 45°", "225°", ["135°", "315°"], { changed: "tan." }),
        ],
        "sin: 180° − x. cos: 360° − x. tan: x + 180°.",
      ),
      own(GR, TRIG, "Spot the mistake"),

      own(GR, TRIG, "Exit check"),

      reworded(
        GR,
        TRIG,
        "“Find another angle with $\\sin x = 0.5$.”",
        { tag: "Real life", title: "$\\sin 30° = 0.5$. Another angle with the same sine?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        [
          "**sin and cos are waves between −1 and 1, repeating every 360°. tan repeats every 180°.**",
        ],
        sine,
        [
          "**sin and cos are waves between −1 and 1, repeating every 360°. tan repeats every 180°.**",
          "sin: second answer 180° − x.",
          "cos: second answer 360° − x.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Translating and reflecting graphs.

const TRANS = "gh-graphs/transformations";
const transMethod = [
  "Outside the bracket: up or down, as it says.",
  "Inside the bracket: left or right, the opposite way.",
  "A minus: outside flips in the $x$-axis; inside in the $y$-axis.",
];
const move = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Inside or outside the bracket?", { asks: "describe", ...extra });
const point = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Move the point as the graph moves.", { asks: "point", ...extra });

const transformations = stepped(find(GR, TRANS), {
  method: transMethod,
  variation: {
    relationship: "inside and outside the bracket",
    unknowns: ["describe", "point"],
    surface: ["inside", "a minus outside", "a minus inside"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Outside and inside",
        [
          "**Outside the bracket moves up or down as it says; inside moves sideways, the opposite way.**",
        ],
        shifted,
        "$(x - 2)^2$ is $x^2$ moved right 2.",
      ),
      reworded(GR, TRANS, "$y = f(x) - 3$ is", { tag: "The rule" }),

      ...owned(GR, TRANS, "Warm-up", "Check you remember"),

      methodCard("The method", transMethod, shifted),
      workedFrom(GR, TRANS),
      calc(
        "Your turn",
        "(2, 5) is on $y = f(x)$. Where is it on $y = f(x) - 4$?",
        undefined,
        [
          ["New $x$:", "2", "Outside: no sideways move."],
          ["New $y$:", "1", "Down 4."],
        ],
        "(2, 1).",
      ),

      calc(
        "Practise",
        "(2, 5) is on $y = f(x)$. Where is it on $y = f(x - 3)$?",
        undefined,
        [
          ["New $x$:", "5", "Inside: right 3."],
          ["New $y$:", "5", "No up or down move."],
        ],
        "(5, 5).",
      ),
      ...owned(GR, TRANS, "Together", "Practise"),
      ...owned(GR, TRANS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Describe the move. Watch what changes.",
        [
          move("$y = f(x) + 3$", "Up 3", ["Left 3", "Right 3"]),
          move("$y = f(x) - 3$", "Down 3", ["Right 3", "Up 3"], { changed: "Minus." }),
          move("$y = f(x + 3)$", "Left 3", ["Right 3", "Up 3"], { changed: "Inside." }),
          move("$y = f(x - 3)$", "Right 3", ["Left 3", "Down 3"], { changed: "Inside, minus." }),
        ],
        "Inside does the opposite of what it looks like.",
      ),

      questionSet(
        "Variation",
        "(1, 3) is on $y = f(x)$. Watch what changes.",
        [
          point("On $y = f(x) + 2$", "(1, 5)", ["(3, 3)", "(−1, 3)"], {
            expect: [
              "Zoe says $y = x^2 + 5$ is $x^2$ moved 5 right. Right?",
              "No",
              "Outside the bracket: up 5.",
              [["Yes", "Is the 5 inside or outside?"]],
            ],
          }),
          point("On $y = f(x + 2)$", "(−1, 3)", ["(3, 3)", "(1, 5)"], { changed: "Inside." }),
          point("On $y = -f(x)$", "(1, −3)", ["(−1, 3)", "(−1, −3)"], {
            changed: "A minus outside.",
          }),
          point("On $y = f(-x)$", "(−1, 3)", ["(1, −3)", "(−1, −3)"], {
            changed: "A minus inside.",
          }),
        ],
        "Outside changes $y$; inside changes $x$.",
      ),
      own(GR, TRANS, "Spot the mistake"),

      own(GR, TRANS, "Exit check"),

      reworded(
        GR,
        TRANS,
        "“Describe the transformation from $y = x^2$ to $y = (x - 2)^2$.”",
        { tag: "Real life", title: "From $y = x^2$ to $y = (x - 2)^2$: describe the move." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        [
          "**Outside the bracket moves up or down as it says; inside moves sideways, the opposite way.**",
        ],
        shifted,
        [
          "**Outside the bracket moves up or down as it says; inside moves sideways, the opposite way.**",
          "$-f(x)$: reflect in the $x$-axis.",
          "$f(-x)$: reflect in the $y$-axis.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Exponential graphs in context.

const CTX = "gh-graphs/exponential-context";
const ctxMethod = [
  "$a$: the value when $t = 0$.",
  "$b$: the multiplier each step (a ratio).",
  "$P = a \\times b^t$.",
];
const MODEL = maths("P = a \\times b^t");
const model = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Start value × multiplier to the power $t$.", {
    asks: "model",
    ...extra,
  });
const ratio = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Divide the $y$-values; root for more steps.", {
    asks: "ratio",
    ...extra,
  });

const exponentialContext = stepped(find(GR, CTX), {
  method: ctxMethod,
  variation: {
    relationship: "a start value and a multiplier",
    unknowns: ["model", "ratio"],
    surface: ["decay", "two steps", "a percentage"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Start × multiplier^time",
        ["**P = a × bᵗ: a is the start, b the multiplier each step.**"],
        MODEL,
        "$b > 1$: growth. $b < 1$: decay.",
      ),
      reworded(GR, CTX, "Doubling every hour from 500", { tag: "The rule" }),

      ...owned(GR, CTX, "Warm-up", "Check you remember"),

      methodCard("The method", ctxMethod, MODEL),
      workedFrom(GR, CTX),
      calc(
        "Your turn",
        "$P = 300 \\times 1.5^t$.",
        undefined,
        [
          ["$t = 2$:", "675", "300 × 2.25."],
          ["$t = 3$:", "1012.5", "675 × 1.5."],
        ],
        "675, then 1012.5.",
      ),

      calc(
        "Practise",
        "A graph of $V = a \\times b^t$ passes (0, 400) and (1, 300).",
        undefined,
        [
          ["$a =$", "400", "The value at $t = 0$."],
          ["$b =$", "0.75", "300 ÷ 400."],
        ],
        "$V = 400 \\times 0.75^t$.",
      ),
      ...owned(GR, CTX, "Together", "Practise"),
      ...owned(GR, CTX, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Write the model. Watch what changes.",
        [
          model("Doubling from 50", "$P = 50 \\times 2^t$", [
            "$P = 2 \\times 50^t$",
            "$P = 50 + 2t$",
          ]),
          model(
            "Halving from 50",
            "$P = 50 \\times 0.5^t$",
            ["$P = 50 \\times 2^t$", "$P = 50 - 0.5t$"],
            {
              changed: "Decay.",
            },
          ),
          model(
            "Growing 10% from 50",
            "$P = 50 \\times 1.1^t$",
            ["$P = 50 \\times 0.1^t$", "$P = 50 \\times 10^t$"],
            {
              changed: "A percentage.",
            },
          ),
          model(
            "Falling 10% from 50",
            "$P = 50 \\times 0.9^t$",
            ["$P = 50 \\times 0.1^t$", "$P = 50 \\times 1.1^t$"],
            {
              changed: "Falling.",
            },
          ),
        ],
        "The multiplier: 1 ± the rate.",
      ),

      questionSet(
        "Variation",
        "Find $b$. Watch what changes.",
        [
          ratio("(0, 3) and (1, 6)", "2", ["3", "1"], {
            expect: [
              "300 trees fall 20% a year. Ola uses $b = 0.2$. Right?",
              "No",
              "A 20% fall leaves 80%: $b = 0.8$.",
              [["Yes", "What's left after a 20% fall?"]],
            ],
          }),
          ratio("(0, 3) and (2, 12)", "2", ["4", "9"], { changed: "Two steps." }),
          ratio("(0, 3) and (2, 48)", "4", ["16", "15"], { changed: "Bigger." }),
          ratio("(0, 200) and (1, 180)", "0.9", ["−20", "1.1"], { changed: "Decay." }),
        ],
        "A ratio, never a difference.",
      ),
      own(GR, CTX, "Spot the mistake"),

      own(GR, CTX, "Exit check"),

      reworded(
        GR,
        CTX,
        "“When does it first pass 10 000?”",
        {
          tag: "Real life",
          title: "Bacteria: $P = 500 \\times 2^t$. When does it first pass 10 000?",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**P = a × bᵗ: a is the start, b the multiplier each step.**"],
        MODEL,
        [
          "**P = a × bᵗ: a is the start, b the multiplier each step.**",
          "20% decay: $b = 0.8$.",
          "$b$ is a ratio: divide.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Gradients of curves.

const GRAD = "gh-graphs/gradients";
const gradMethod = [
  "Draw a tangent touching the curve at the point.",
  "Pick two points far apart on the tangent.",
  "Gradient = rise ÷ run.",
];
const slope = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Rise ÷ run.", { asks: "gradient", ...extra });

const gradients = stepped(find(GR, GRAD), {
  method: gradMethod,
  variation: {
    relationship: "a tangent's gradient",
    unknowns: ["sign", "gradient"],
    surface: ["steeper", "falling", "shallow"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The tangent",
        ["**The gradient of a curve at a point is the gradient of its tangent there.**"],
        curveTangent,
        "A drawn tangent gives an estimate.",
      ),
      reworded(GR, GRAD, "A tangent to a curve", { tag: "The rule" }),

      ...owned(GR, GRAD, "Warm-up", "Check you remember"),

      methodCard("The method", gradMethod, curveTangent),
      workedFrom(GR, GRAD),
      calc(
        "Your turn",
        "A tangent passes (0, 1) and (2, 7).",
        undefined,
        [
          ["Rise:", "6", "7 − 1."],
          ["Gradient:", "3", "6 ÷ 2."],
        ],
        "Gradient 3.",
      ),

      calc(
        "Practise",
        "A tangent passes (1, 5) and (3, 1).",
        undefined,
        [
          ["Rise:", "-4", "1 − 5."],
          ["Gradient:", "-2", "−4 ÷ 2."],
        ],
        "Gradient −2: falling.",
      ),
      ...owned(GR, GRAD, "Together", "Practise"),
      ...owned(GR, GRAD, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The sign of the gradient. Watch what changes.",
        [
          pick("Tangent rises left to right", "Positive", ["Negative", "Zero"], "Uphill.", {
            asks: "sign",
          }),
          pick("Tangent falls left to right", "Negative", ["Positive", "Zero"], "Downhill.", {
            asks: "sign",
            changed: "Falling.",
          }),
          pick("Tangent is flat", "Zero", ["Positive", "Negative"], "Level.", {
            asks: "sign",
            changed: "Flat.",
          }),
          pick("At a minimum point", "Zero", ["Positive", "Negative"], "The tangent is flat.", {
            asks: "sign",
            changed: "A turning point.",
          }),
        ],
        "Turning points have gradient 0.",
      ),

      questionSet(
        "Variation",
        "Gradient of the tangent. Watch what changes.",
        [
          slope("Through (1, 0) and (4, 6)", "2", ["½", "6"], {
            expect: [
              "Kim works out run ÷ rise for the gradient. Right?",
              "No",
              "Gradient = rise ÷ run: up over across.",
              [["Yes", "Which goes on top?"]],
            ],
          }),
          slope("Through (0, 2) and (2, 10)", "4", ["5", "¼"], { changed: "Steeper." }),
          slope("Through (1, 6) and (3, 2)", "−2", ["2", "−½"], { changed: "Falling." }),
          slope("Through (2, 3) and (6, 5)", "0.5", ["2", "4"], { changed: "Shallow." }),
        ],
        "Rise ÷ run, keeping the sign.",
      ),
      own(GR, GRAD, "Spot the mistake"),

      retext(
        own(GR, GRAD, "Exit check"),
        "The gradient of a curve at a point is the gradient of the",
        "A curve's gradient at a point equals the gradient of the",
      ),

      reworded(
        GR,
        GRAD,
        "“Estimate the gradient at $x = 2$.”",
        { tag: "Real life", title: "Estimate the curve's gradient where the tangent touches." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The gradient of a curve at a point is the gradient of its tangent there.**"],
        curveTangent,
        [
          "**The gradient of a curve at a point is the gradient of its tangent there.**",
          "Rise ÷ run.",
          "A chord gives an average, not the gradient at a point.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Areas under graphs.

const AREA = "gh-graphs/areas";
const areaMethod = [
  "Split into strips of equal width.",
  "Each trapezium: ½ × (left + right) × width.",
  "Add them up.",
];
const TRAP = maths("\\text{strip} = \\tfrac12 (h_1 + h_2) \\times w");
const strips = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Each strip: ½(left + right) × width.", { asks: "total", ...extra });

const areas = stepped(find(GR, AREA), {
  method: areaMethod,
  variation: {
    relationship: "trapezia under a graph",
    unknowns: ["strip", "total"],
    surface: ["wider strips", "flat", "a steeper curve"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Shapes under the line",
        ["**Split the area into trapezia and add them up.**"],
        velocity,
        "More strips: a better estimate.",
      ),
      reworded(GR, AREA, "The area under the car's graph is made of", { tag: "The rule" }),

      ...owned(GR, AREA, "Warm-up", "Check you remember"),

      methodCard("The method", areaMethod, TRAP),
      workedFrom(GR, AREA),
      calc(
        "Your turn",
        "A strip has heights 3 and 5, width 4.",
        undefined,
        [["Area: $\\frac12 \\times 8 \\times 4 =$", "16", "½ × (3 + 5) × 4."]],
        "16.",
      ),

      calc(
        "Practise",
        "Estimate the area under $y = x^2$ from 0 to 2, two strips.",
        undefined,
        [
          ["First strip (heights 0, 1):", "0.5", "½ × 1 × 1."],
          ["Second strip (heights 1, 4):", "2.5", "½ × 5 × 1."],
          ["Total:", "3", "0.5 + 2.5."],
        ],
        "About 3: a little too big, as the curve bends up.",
      ),
      ...owned(GR, AREA, "Together", "Practise"),
      reworded(GR, AREA, "Area of a trapezium strip with heights 4 and 6, width 2", {
        tag: "Practise",
      }),
      reworded(GR, AREA, "Speed rises steadily from 4 to 10 m/s over 6 s. Area under the graph", {
        tag: "Practise",
        title: "Speed: 4 to 10 m/s steadily over 6 s. Area under it?",
      }),
      questionSet(
        "Practise",
        "One strip. Watch what changes.",
        [
          pick("Heights 4 and 6, width 2", "10", ["20", "24"], "½ × 10 × 2.", { asks: "strip" }),
          pick("Heights 4 and 6, width 1", "5", ["10", "24"], "½ × 10 × 1.", {
            asks: "strip",
            changed: "Narrower.",
          }),
          pick("Heights 2 and 8, width 2", "10", ["16", "20"], "½ × 10 × 2.", {
            asks: "strip",
            changed: "Same total height.",
          }),
          pick("Heights 5 and 5, width 3", "15", ["30", "7.5"], "A rectangle.", {
            asks: "strip",
            changed: "Flat.",
          }),
        ],
        "Average the heights, then × width.",
      ),

      questionSet(
        "Variation",
        "Total area. Watch what changes.",
        [
          strips("Width 1, heights 0, 1, 4", "3", ["5", "2.5"], {
            expect: [
              "Ola uses rectangles at each strip's top. As good as trapezia?",
              "No",
              "Trapezia follow the slope; tall rectangles overestimate.",
              [["Yes", "Do the rectangles poke above the line?"]],
            ],
          }),
          strips("Width 2, heights 0, 4, 16", "24", ["12", "20"], { changed: "Wider strips." }),
          strips("Width 1, heights 2, 2, 2", "4", ["6", "2"], { changed: "Flat." }),
          strips("Width 2, heights 1, 3, 7", "14", ["11", "22"], { changed: "A steeper curve." }),
        ],
        "Add each strip's area.",
      ),
      reworded(
        GR,
        AREA,
        "Where did it go wrong?",
        { text: "Zoe estimates an area: strips of width 2, heights 1, 3, 7." },
        "Spot the mistake",
      ),

      own(GR, AREA, "Exit check"),

      reworded(
        GR,
        AREA,
        "“Find the area under the graph.”",
        { tag: "Real life", picture: velocity },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Split the area into trapezia and add them up.**"],
        TRAP,
        [
          "**Split the area into trapezia and add them up.**",
          "Strip: ½(left + right) × width.",
          "A curve bending up: trapezia overestimate.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Velocity–time graphs.

const VT = "gh-graphs/velocity-time";
const vtMethod = [
  "Gradient: change in velocity ÷ time = acceleration.",
  "Area under the graph: distance travelled.",
  "Flat: steady speed. Down: slowing.",
];
const accel = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Change in velocity ÷ time.", { asks: "acceleration", ...extra });
const distance = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "The area under the graph.", { asks: "distance", ...extra });

const velocityTime = stepped(find(GR, VT), {
  method: vtMethod,
  variation: {
    relationship: "gradient and area on one graph",
    unknowns: ["acceleration", "distance"],
    surface: ["slowing", "steady", "the whole journey"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two readings",
        ["**Gradient = acceleration. Area under the graph = distance travelled.**"],
        velocity,
        "A flat line: moving at a steady speed.",
      ),
      reworded(GR, VT, "A flat section on a velocity–time graph means", { tag: "The rule" }),

      ...owned(GR, VT, "Warm-up", "Check you remember"),

      methodCard("The method", vtMethod, velocity),
      workedFrom(GR, VT),
      calc(
        "Your turn",
        "Velocity rises from 5 to 25 m/s in 4 s.",
        undefined,
        [
          ["Acceleration:", "5", "20 ÷ 4.", { after: "m/s²" }],
          ["Distance:", "60", "½ × (5 + 25) × 4.", { after: "m" }],
        ],
        "5 m/s², 60 m.",
      ),

      calc(
        "Practise",
        "A cyclist slows from 12 m/s to 0 in 4 s.",
        undefined,
        [
          ["Acceleration:", "-3", "−12 ÷ 4.", { after: "m/s²" }],
          ["Distance:", "24", "½ × 12 × 4.", { after: "m" }],
        ],
        "−3 m/s², 24 m.",
      ),
      ...owned(GR, VT, "Together", "Practise"),
      ...owned(GR, VT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Acceleration in m/s². Watch what changes.",
        [
          accel("0 to 20 m/s in 10 s", "2", ["200", "0.5"]),
          accel("0 to 20 m/s in 5 s", "4", ["100", "2"], { changed: "Quicker." }),
          accel("Steady at 20 m/s", "0", ["20", "1"], { changed: "Steady." }),
          accel("20 m/s to 0 in 5 s", "−4", ["4", "−100"], { changed: "Slowing." }),
        ],
        "Slowing down: a negative acceleration.",
      ),

      questionSet(
        "Variation",
        "Distance travelled. Watch what changes.",
        [
          distance("Steady 15 m/s for 10 s", "150 m", ["1.5 m", "25 m"], {
            expect: [
              "For the car, Ben works out 20 × 30 = 600 m. Right?",
              "No",
              "The first part is a triangle: 100 + 400 = 500 m.",
              [["Yes", "Is the area under the first part a rectangle?"]],
            ],
          }),
          distance("0 to 20 m/s over 10 s", "100 m", ["200 m", "2 m"], { changed: "Speeding up." }),
          distance("10 to 20 m/s over 10 s", "150 m", ["100 m", "200 m"], {
            changed: "A moving start.",
          }),
          distance("The whole journey", "500 m", ["600 m", "400 m"], {
            changed: "The whole graph.",
            picture: velocity,
          }),
        ],
        "Triangles and trapezia: not just length × height.",
      ),
      own(GR, VT, "Spot the mistake"),

      own(GR, VT, "Exit check"),

      reworded(
        GR,
        VT,
        "“Acceleration in the first 10 s, and total distance?”",
        { tag: "Real life", title: "The car's acceleration at first, and its total distance?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Gradient = acceleration. Area under the graph = distance travelled.**"],
        velocity,
        [
          "**Gradient = acceleration. Area under the graph = distance travelled.**",
          "Flat: steady speed, not stopped.",
          "Slowing: negative acceleration.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

export const ghGraphsStepped: [string, UnitLesson[]][] = [
  [EXP, [exponentialLesson]],
  [TRIG, [trigGraphs]],
  [TRANS, [transformations]],
  [CTX, [exponentialContext]],
  [GRAD, [gradients]],
  [AREA, [areas]],
  [VT, [velocityTime]],
];
