// GCSE Higher, "Proportion and rates", on the stepped template (docs/proposals/lesson-stepped.md):
// proportion equations, graphs of proportion, changing units in algebra, and rates of change on
// curves. Graphs carry the shapes and gradients; the algebra is its own picture.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { chordTangent, directSquare, ghProportion, inverse, straight } from "./gh-proportion.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const PR = ghProportion;
const ALGEBRA = "Algebra: the equation is the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const steps = (...lines: string[]): Picture =>
  maths(`\\begin{array}{l} ${lines.join(" \\\\ ")} \\end{array}`);
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Proportion equations.

const EQN = "gh-proportion/equations";
const eqnMethod = [
  "Write it with $k$: $y = kx^2$, $y = \\frac{k}{x}$, …",
  "Put in the pair you know to find $k$.",
  "Use the equation for the new value.",
];
const FIND_K = steps("y = kx^2,\\ y = 12 \\text{ when } x = 2", "12 = 4k,\\ k = 3", "y = 3x^2");
const value = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Find $k$ first.", { asks: "value", ...extra });

const equations = stepped(find(PR, EQN), {
  method: eqnMethod,
  variation: {
    relationship: "one pair of values gives k",
    unknowns: ["scale", "value"],
    surface: ["squared", "a cube", "a root"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Write it with k",
        ["**Write the proportion with k, find k from one pair, then use it.**"],
        FIND_K,
        "“Inversely” puts the power on the bottom.",
      ),
      reworded(PR, EQN, "$y$ is inversely proportional to $x^2$", { tag: "The rule" }),

      ...owned(PR, EQN, "Warm-up", "Check you remember"),

      methodCard("The method", eqnMethod, FIND_K),
      workedFrom(PR, EQN),
      calc(
        "Your turn",
        "$y \\propto x^2$; $y = 48$ when $x = 4$. Find $y$ when $x = 5$.",
        undefined,
        [
          ["$48 = 16k$, so $k =$", "3", "48 ÷ 16."],
          ["$y = 3 \\times 25 =$", "75", "$x^2 = 25$."],
        ],
        "$y = 75$.",
      ),

      calc(
        "Practise",
        "$y \\propto \\frac{1}{x^2}$; $y = 5$ when $x = 2$. Find $y$ when $x = 5$.",
        undefined,
        [
          ["$5 = \\frac{k}{4}$, so $k =$", "20", "5 × 4."],
          ["$y = \\frac{20}{25} =$", "0.8", "20 ÷ 25."],
        ],
        "$y = 0.8$.",
      ),
      ...owned(PR, EQN, "Together", "Practise"),
      ...owned(PR, EQN, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "$x$ doubles. What happens to $y$? Watch what changes.",
        [
          pick("$y \\propto x$", "× 2", ["× 4", "÷ 2"], "The same power.", { asks: "scale" }),
          pick("$y \\propto x^2$", "× 4", ["× 2", "× 8"], "2².", {
            asks: "scale",
            changed: "Squared.",
          }),
          pick("$y \\propto x^3$", "× 8", ["× 6", "× 4"], "2³.", {
            asks: "scale",
            changed: "Cubed.",
          }),
          pick("$y \\propto \\frac{1}{x^2}$", "÷ 4", ["× 4", "÷ 2"], "Inverse: divide.", {
            asks: "scale",
            changed: "Inverse.",
          }),
        ],
        "The power on $x$ is the power on the scale factor.",
      ),

      questionSet(
        "Variation",
        "$y = 20$ when $x = 2$. Find $y$ when $x = 6$.",
        [
          value("$y \\propto x^2$", "180", ["360", "60"], {
            expect: [
              "For $y = kx^2$, Ben writes $20 = k \\times 2$. Right?",
              "No",
              "Square $x$ first: $20 = 4k$, so $k = 5$.",
              [["Yes", "What is $x^2$ when $x = 2$?"]],
            ],
          }),
          value("$y \\propto x$", "60", ["180", "24"], { changed: "Not squared." }),
          value("$y \\propto \\frac1x$", "$\\frac{20}{3}$", ["60", "6"], { changed: "Inverse." }),
          value("$y \\propto x^3$", "540", ["180", "60"], { changed: "Cubed." }),
        ],
        "Square, cube or root $x$ before you find $k$.",
      ),
      own(PR, EQN, "Spot the mistake"),

      own(PR, EQN, "Exit check"),

      reworded(
        PR,
        EQN,
        "“Find $d$ at 50 mph.”",
        {
          tag: "Real life",
          title: "Stopping distance $d = kv^2$. $d = 6$ m at 20 mph. $d$ at 50 mph?",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Write the proportion with k, find k from one pair, then use it.**"],
        FIND_K,
        [
          "**Write the proportion with k, find k from one pair, then use it.**",
          "Inversely: $y = \\frac{k}{x^n}$.",
          "Square $x$ before solving for $k$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Graphs of proportion.

const GRAPH = "gh-proportion/graphs";
const graphMethod = [
  "Straight through (0, 0): $y \\propto x$.",
  "A curve through (0, 0), getting steeper: $y \\propto x^2$.",
  "Falling, never touching the axes: $y \\propto \\frac1x$.",
];
const LINE_UP: Picture = {
  kind: "graph",
  range: { xMin: -1, xMax: 5, yMin: -1, yMax: 8 },
  lines: [{ m: 1.5, c: 2 }],
};
const kind = (picture: Picture, right: string, extra: object = {}) =>
  pick(
    "Which does the graph show?",
    right,
    ["$y \\propto x$", "$y \\propto x^2$", "$y \\propto \\frac1x$", "Not proportion"]
      .filter((k) => k !== right)
      .slice(0, 2),
    "Line or curve? Through the origin?",
    { asks: "graph", picture, ...extra },
  );
const table = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Same $y \\div x$, or the same $xy$?", { asks: "table", ...extra });

const graphs = stepped(find(PR, GRAPH), {
  method: graphMethod,
  variation: {
    relationship: "the shape of each proportion",
    unknowns: ["graph", "table"],
    surface: ["a curve", "a falling curve", "not through the origin"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three shapes",
        ["**Direct: through the origin. Inverse: a falling curve that never meets the axes.**"],
        inverse,
        "$y \\propto x^2$ is half a ∪ through the origin.",
      ),
      reworded(PR, GRAPH, "Which graph is this?", { tag: "The rule" }, "Discover"),

      ...owned(PR, GRAPH, "Warm-up", "Check you remember"),

      methodCard("The method", graphMethod, directSquare),
      workedFrom(PR, GRAPH),
      calc(
        "Your turn",
        "$x$: 1, 2, 5. $y$: 4, 8, 20.",
        undefined,
        [["$y \\div x$ each time:", "4", "4 ÷ 1, 8 ÷ 2, 20 ÷ 5."]],
        "$y = 4x$: direct proportion.",
      ),

      calc(
        "Practise",
        "$x$: 1, 3, 6. $y$: 12, 4, 2.",
        undefined,
        [["$xy$ each time:", "12", "1 × 12, 3 × 4, 6 × 2."]],
        "$y = \\frac{12}{x}$: inverse proportion.",
      ),
      ...owned(PR, GRAPH, "Together", "Practise"),
      ...owned(PR, GRAPH, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which relationship? Watch what changes.",
        [
          table("$x$: 1, 2, 3; $y$: 5, 10, 15", "$y \\propto x$", [
            "$y \\propto x^2$",
            "$y \\propto \\frac1x$",
          ]),
          table(
            "$x$: 1, 2, 3; $y$: 5, 20, 45",
            "$y \\propto x^2$",
            ["$y \\propto x$", "$y \\propto \\frac1x$"],
            {
              changed: "Growing faster.",
            },
          ),
          table(
            "$x$: 1, 2, 4; $y$: 20, 10, 5",
            "$y \\propto \\frac1x$",
            ["$y \\propto x$", "$y \\propto x^2$"],
            {
              changed: "Falling.",
            },
          ),
          table(
            "$x$: 1, 2, 3; $y$: 6, 9, 12",
            "Not proportion",
            ["$y \\propto x$", "$y \\propto x^2$"],
            {
              changed: "Not through 0.",
            },
          ),
        ],
        "Direct: $y \\div x$ fixed. Inverse: $xy$ fixed.",
      ),

      questionSet(
        "Variation",
        "Read the graph. Watch what changes.",
        [
          kind(straight, "$y \\propto x$", {
            expect: [
              "Leo says $y = \\frac{6}{x}$ is a straight line sloping down. Right?",
              "No",
              "It's a curve that falls and never meets the axes.",
              [["Yes", "Is $\\frac{6}{x}$ falling by the same amount each step?"]],
            ],
          }),
          kind(directSquare, "$y \\propto x^2$", { changed: "A curve." }),
          kind(inverse, "$y \\propto \\frac1x$", { changed: "A falling curve." }),
          kind(LINE_UP, "Not proportion", { changed: "Not through the origin." }),
        ],
        "Direct proportion always starts at the origin.",
      ),
      own(PR, GRAPH, "Spot the mistake"),

      own(PR, GRAPH, "Exit check"),

      reworded(
        PR,
        GRAPH,
        "“Which relationship does the falling curve show?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Direct: through the origin. Inverse: a falling curve that never meets the axes.**"],
        inverse,
        [
          "**Direct: through the origin. Inverse: a falling curve that never meets the axes.**",
          "A line not through 0 isn't proportion.",
          "Check: $y \\div x$ or $xy$ fixed.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Changing units in algebra.

const UNITS = "gh-proportion/units";
const unitsMethod = [
  "Find the length conversion: 1 m = 100 cm.",
  "Area: square it. Volume: cube it.",
  "Or convert each length first, then multiply.",
];
const SQUARES = steps(
  "1 \\text{ m} = 100 \\text{ cm}",
  "1 \\text{ m}^2 = 100^2 = 10\\,000 \\text{ cm}^2",
  "1 \\text{ m}^3 = 100^3 = 1\\,000\\,000 \\text{ cm}^3",
);
const convert = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Square for area; cube for volume.", { asks: "convert", ...extra });

const units = stepped(find(PR, UNITS), {
  method: unitsMethod,
  variation: {
    relationship: "a length conversion squared or cubed",
    unknowns: ["convert", "algebra"],
    surface: ["area or volume", "mm, not cm", "letters"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Each dimension converts",
        ["**Square the length conversion for area; cube it for volume.**"],
        SQUARES,
        "1 m² is 100 by 100 squares of 1 cm².",
      ),
      reworded(PR, UNITS, "1 cm² in mm²", { tag: "The rule" }),

      ...owned(PR, UNITS, "Warm-up", "Check you remember"),

      methodCard("The method", unitsMethod, SQUARES),
      workedFrom(PR, UNITS),
      calc(
        "Your turn",
        "A square is $a$ m by $a$ m. Its area in cm².",
        undefined,
        [
          ["Side in cm: $?a$, ? =", "100", "1 m = 100 cm."],
          ["Area: $?a^2$ cm², ? =", "10000", "100 × 100."],
        ],
        "$10\\,000a^2$ cm².",
      ),

      calc(
        "Practise",
        "Convert 0.5 m³ to cm³.",
        undefined,
        [["$0.5 \\times 1\\,000\\,000 =$", "500000", "Cube of 100."]],
        "500 000 cm³.",
      ),
      ...owned(PR, UNITS, "Together", "Practise"),
      ...owned(PR, UNITS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Convert. Watch what changes.",
        [
          convert("2 m² in cm²", "20 000", ["200", "2 000 000"]),
          convert("2 m³ in cm³", "2 000 000", ["20 000", "200"], { changed: "Volume." }),
          convert("2 cm² in mm²", "200", ["20", "2000"], { changed: "cm to mm." }),
          convert("2 cm³ in mm³", "2000", ["200", "20"], { changed: "Volume again." }),
        ],
        "m to cm: 100. cm to mm: 10. Then square or cube.",
      ),

      questionSet(
        "Variation",
        "With letters. Watch what changes.",
        [
          pick(
            "A cube of side $a$ cm, in mm³",
            "$1000a^3$ mm³",
            ["$10a^3$ mm³", "$30a$ mm³"],
            "Side $10a$ mm, cubed.",
            {
              asks: "algebra",
              expect: [
                "Ben cubes a side of $10a$ mm and gets $10a^3$. Right?",
                "No",
                "Cube the 10 too: $(10a)^3 = 1000a^3$.",
                [["Yes", "What is $10^3$?"]],
              ],
            },
          ),
          pick(
            "A square of side $a$ cm, in mm²",
            "$100a^2$ mm²",
            ["$10a^2$ mm²", "$1000a^2$ mm²"],
            "Side $10a$ mm, squared.",
            {
              asks: "algebra",
              changed: "Area.",
            },
          ),
          pick(
            "$x$ m by $3x$ m, in cm²",
            "$30\\,000x^2$ cm²",
            ["$300x^2$ cm²", "$3x^2$ cm²"],
            "$100x$ by $300x$.",
            {
              asks: "algebra",
              changed: "A rectangle in metres.",
            },
          ),
          pick(
            "$v$ m/s in km/h",
            "$3.6v$ km/h",
            ["$\\frac{v}{3.6}$ km/h", "$60v$ km/h"],
            "× 3600 ÷ 1000.",
            {
              asks: "algebra",
              changed: "A speed.",
            },
          ),
        ],
        "Convert every length, then multiply.",
      ),
      own(PR, UNITS, "Spot the mistake"),

      own(PR, UNITS, "Exit check"),

      reworded(
        PR,
        UNITS,
        "“Write the area of $x$ m by $2x$ m in cm².”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Square the length conversion for area; cube it for volume.**"],
        SQUARES,
        [
          "**Square the length conversion for area; cube it for volume.**",
          "1 m² = 10 000 cm²; 1 m³ = 1 000 000 cm³.",
          "$(10a)^3 = 1000a^3$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Rates of change on curves.

const RATES = "gh-proportion/rates";
const ratesMethod = [
  "Average rate: a chord between two points.",
  "Rate at an instant: a tangent at that point.",
  "Gradient = rise ÷ run, with units.",
];
const rate = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Rise ÷ run between the two points.", { asks: "average", ...extra });

const rates = stepped(find(PR, RATES), {
  method: ratesMethod,
  variation: {
    relationship: "a chord or a tangent's gradient",
    unknowns: ["which", "average"],
    surface: ["a later interval", "a falling chord", "an instant"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Chord or tangent",
        ["**A chord gives the average rate; a tangent gives the rate at an instant.**"],
        chordTangent,
        "On a distance–time graph, both are speeds.",
      ),
      reworded(PR, RATES, "Average speed over 0–4 s uses", { tag: "The rule" }),

      ...owned(PR, RATES, "Warm-up", "Check you remember"),

      methodCard("The method", ratesMethod, chordTangent),
      workedFrom(PR, RATES),
      calc(
        "Your turn",
        "Average rate from (2, 5) to (6, 17).",
        undefined,
        [
          ["Rise:", "12", "17 − 5."],
          ["Run:", "4", "6 − 2."],
          ["Rate:", "3", "12 ÷ 4."],
        ],
        "3 per unit.",
      ),

      calc(
        "Practise",
        "Distance $d = t^2$ metres. Average speed from $t = 1$ to $t = 4$.",
        undefined,
        [
          ["Distance gone:", "15", "16 − 1.", { after: "m" }],
          ["Average speed:", "5", "15 ÷ 3.", { after: "m/s" }],
        ],
        "5 m/s.",
      ),
      ...owned(PR, RATES, "Together", "Practise"),
      ...owned(PR, RATES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Chord or tangent? Watch what changes.",
        [
          pick(
            "Average speed from 1 s to 5 s",
            "A chord",
            ["A tangent", "The area"],
            "Over a stretch.",
            {
              asks: "which",
            },
          ),
          pick("Speed at exactly 3 s", "A tangent", ["A chord", "The area"], "At one moment.", {
            asks: "which",
            changed: "One instant.",
          }),
          pick(
            "Average growth over a year",
            "A chord",
            ["A tangent", "The area"],
            "Over a stretch.",
            {
              asks: "which",
              changed: "Growth.",
            },
          ),
          pick(
            "How fast it's cooling at noon",
            "A tangent",
            ["A chord", "The area"],
            "At one moment.",
            {
              asks: "which",
              changed: "Cooling.",
            },
          ),
        ],
        "A stretch: chord. A moment: tangent.",
      ),

      questionSet(
        "Variation",
        "Average rate. Watch what changes.",
        [
          rate("From (1, 0.5) to (3, 4.5)", "2", ["1.5", "4"], {
            expect: [
              "Leo divides 4.5 by 3, not by the 2 seconds between. Right?",
              "No",
              "Rise ÷ run: $\\frac{4.5 - 0.5}{3 - 1} = 2$.",
              [["Yes", "How long is it from $t = 1$ to $t = 3$?"]],
            ],
          }),
          rate("From (3, 4.5) to (5, 12.5)", "4", ["2.5", "8"], { changed: "Later on." }),
          rate("From (0, 10) to (5, 0)", "−2", ["2", "−5"], { changed: "Falling." }),
          rate("From (2, 7) to (2.5, 9)", "4", ["2", "0.5"], { changed: "A short stretch." }),
        ],
        "Rise ÷ run, signs and all.",
      ),
      own(PR, RATES, "Spot the mistake"),

      own(PR, RATES, "Exit check"),

      reworded(
        PR,
        RATES,
        "“Average speed over 4 s and speed at $t = 2$?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A chord gives the average rate; a tangent gives the rate at an instant.**"],
        chordTangent,
        [
          "**A chord gives the average rate; a tangent gives the rate at an instant.**",
          "Rise ÷ run, with units.",
          "Distance–time: speed. Speed–time: acceleration.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

export const ghProportionStepped: [string, UnitLesson[]][] = [
  [EQN, [equations]],
  [GRAPH, [graphs]],
  [UNITS, [units]],
  [RATES, [rates]],
];
