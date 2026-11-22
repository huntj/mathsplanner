// GCSE Foundation, "Proportion", on the stepped template (docs/proposals/lesson-stepped.md):
// direct proportion, inverse proportion, proportion graphs and equations, and reading proportion
// statements. Tables of values and the graphs of y = kx and y = k/x are the pictures.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfProportion } from "./gf-proportion.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const PR = gfProportion;
const NUMBER = "A proportion fact: the numbers are the picture.";
const table = (head: string[], rows: string[][]): Picture => ({ kind: "table", head, rows });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Direct proportion.

const DIRECT = "gf-proportion/direct";
const directMethod = [
  "Divide to find the value of one.",
  "Multiply up to the amount you need.",
  "Check: more of one, more of the other.",
];
const BOOKS = table(["Books", "3", "1", "5"], [["Cost", "£12", "£4", "£20"]]);

const direct = stepped(find(PR, DIRECT), {
  method: directMethod,
  variation: {
    relationship: "a rate for one, scaled up",
    unknowns: ["cost", "amount"],
    surface: ["more or fewer", "doubling", "a new rate"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Find one first",
        ["**Direct proportion: find the value of one, then multiply.**"],
        BOOKS,
        "Double one, and the other doubles.",
      ),
      reworded(PR, DIRECT, "3 kg cost £7.50. 1 kg costs", { tag: "The rule" }),

      ...owned(PR, DIRECT, "Warm-up", "Check you remember"),

      methodCard("The method", directMethod, BOOKS),
      workedFrom(PR, DIRECT),
      calc(
        "Your turn",
        "7 pens cost £5.60. Find the cost of 3.",
        undefined,
        [
          ["1 pen: £", "0.80", "5.60 ÷ 7."],
          ["3 pens: £", "2.40", "0.80 × 3."],
        ],
        "3 pens cost £2.40.",
      ),

      calc(
        "Practise",
        "Better value: 4 for £3.20, or 6 for £4.50?",
        undefined,
        [
          ["4 for £3.20: one costs £", "0.80", "3.20 ÷ 4."],
          ["6 for £4.50: one costs £", "0.75", "4.50 ÷ 6."],
        ],
        "6 for £4.50 is better value: each costs less.",
      ),
      ...owned(PR, DIRECT, "Together", "Practise"),
      reworded(PR, DIRECT, "5 tickets cost £42. Cost of 8, in pounds?", { tag: "Practise" }),
      reworded(PR, DIRECT, "A recipe for 4 uses 300 g. For 6 people, in grams?", {
        tag: "Practise",
        title: "A recipe for 4 uses 300 grams. How much for 6 people?",
      }),
      questionSet(
        "Practise",
        "Find the cost. Watch what changes.",
        [
          pick("4 cost £12. Cost of 1?", "£3", ["£48", "£8"], "12 ÷ 4.", { asks: "cost" }),
          pick("4 cost £12. Cost of 5?", "£15", ["£13", "£60"], "£3 × 5.", {
            asks: "cost",
            changed: "More.",
          }),
          pick("4 cost £12. Cost of 2?", "£6", ["£10", "£24"], "Half of 4.", {
            asks: "cost",
            changed: "Fewer.",
          }),
          pick("4 cost £12. Cost of 10?", "£30", ["£18", "£120"], "£3 × 10.", {
            asks: "cost",
            changed: "Ten.",
          }),
        ],
        "One first, then multiply.",
      ),

      questionSet(
        "Variation",
        "Scale it up. Watch what changes.",
        [
          pick("3 workers lay 90 bricks. 5 workers lay?", "150", ["35", "92"], "30 each.", {
            asks: "amount",
            expect: [
              "30 bricks each. For 5 workers, Raj does $30 + 5$. Right?",
              "No",
              "Multiply: $30 \\times 5 = 150$.",
              [["Yes", "Is it 30 each, or 30 plus 5?"]],
            ],
          }),
          pick("3 workers lay 90 bricks. 6 workers lay?", "180", ["93", "36"], "Double.", {
            asks: "amount",
            changed: "Double the workers.",
          }),
          pick("3 workers lay 90 bricks. 1 worker lays?", "30", ["87", "270"], "90 ÷ 3.", {
            asks: "amount",
            changed: "One worker.",
          }),
          pick("3 workers lay 75 bricks. 5 workers lay?", "125", ["77", "375"], "25 each.", {
            asks: "amount",
            changed: "A new rate.",
          }),
        ],
        "Proportion multiplies; it never adds.",
      ),
      own(PR, DIRECT, "Spot the mistake"),

      own(PR, DIRECT, "Exit check"),

      reworded(
        PR,
        DIRECT,
        "“6 pens cost £4.20. Work out the cost of 10 pens.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Direct proportion: find the value of one, then multiply.**"],
        BOOKS,
        [
          "**Direct proportion: find the value of one, then multiply.**",
          "Best value: compare the cost of one.",
          "Multiply, never add.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Inverse proportion.

const INVERSE = "gf-proportion/inverse";
const inverseMethod = [
  "Multiply to find the total work.",
  "Divide by the new amount.",
  "Check: more of one, less of the other.",
];
const WORKERS = table(["Workers", "2", "4", "8"], [["Days", "12", "6", "3"]]);

const inverse = stepped(find(PR, INVERSE), {
  method: inverseMethod,
  variation: {
    relationship: "a product that stays the same",
    unknowns: ["time"],
    surface: ["more or fewer", "one fewer", "a slower rate"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The total stays the same",
        ["**Inverse proportion: the product stays the same. Double one, halve the other.**"],
        WORKERS,
        "Each column multiplies to 24.",
      ),
      reworded(PR, INVERSE, "Which is inverse proportion?", { tag: "The rule" }),

      ...owned(PR, INVERSE, "Warm-up", "Check you remember"),

      methodCard("The method", inverseMethod, WORKERS),
      workedFrom(PR, INVERSE),
      calc(
        "Your turn",
        "6 workers take 4 days. How long for 8 workers?",
        undefined,
        [
          ["Total work:", "24", "6 × 4.", { after: "worker-days" }],
          ["8 workers:", "3", "24 ÷ 8.", { after: "days" }],
        ],
        "3 days.",
      ),

      calc(
        "Practise",
        "At 50 mph a trip takes 3 hours. At 75 mph?",
        undefined,
        [
          ["Distance:", "150", "50 × 3.", { after: "miles" }],
          ["At 75 mph:", "2", "150 ÷ 75.", { after: "hours" }],
        ],
        "2 hours: faster, so less time.",
      ),
      ...owned(PR, INVERSE, "Together", "Practise"),
      ...owned(PR, INVERSE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find the time. Watch what changes.",
        [
          pick(
            "5 painters take 6 hours. 10 painters?",
            "3 hours",
            ["12 hours", "11 hours"],
            "30 ÷ 10.",
            { asks: "time" },
          ),
          pick(
            "5 painters take 6 hours. 3 painters?",
            "10 hours",
            ["3.6 hours", "4 hours"],
            "30 ÷ 3.",
            { asks: "time", changed: "Fewer painters." },
          ),
          pick(
            "5 painters take 6 hours. 2 painters?",
            "15 hours",
            ["2.4 hours", "3 hours"],
            "30 ÷ 2.",
            { asks: "time", changed: "Fewer still." },
          ),
          pick(
            "5 painters take 6 hours. 15 painters?",
            "2 hours",
            ["18 hours", "16 hours"],
            "30 ÷ 15.",
            { asks: "time", changed: "Many more." },
          ),
        ],
        "More painters, less time.",
      ),

      questionSet(
        "Variation",
        "Find the time. Watch what changes.",
        [
          pick(
            "6 taps fill it in 10 minutes. 4 taps?",
            "15 minutes",
            ["6.7 minutes", "8 minutes"],
            "60 ÷ 4.",
            {
              asks: "time",
              expect: [
                "6 taps take 10 minutes. Mia says 4 taps take 6.7 minutes. Right?",
                "No",
                "Fewer taps take longer: $60 \\div 4 = 15$ minutes.",
                [["Yes", "Do fewer taps fill it faster?"]],
              ],
            },
          ),
          pick(
            "6 taps fill it in 10 minutes. 12 taps?",
            "5 minutes",
            ["20 minutes", "16 minutes"],
            "60 ÷ 12.",
            { asks: "time", changed: "More taps." },
          ),
          pick(
            "6 taps fill it in 10 minutes. 5 taps?",
            "12 minutes",
            ["8.3 minutes", "9 minutes"],
            "60 ÷ 5.",
            { asks: "time", changed: "One fewer." },
          ),
          pick(
            "6 taps fill it in 20 minutes. 4 taps?",
            "30 minutes",
            ["13.3 minutes", "18 minutes"],
            "120 ÷ 4.",
            { asks: "time", changed: "Slower taps." },
          ),
        ],
        "Fewer workers, more time.",
      ),
      own(PR, INVERSE, "Spot the mistake"),

      own(PR, INVERSE, "Exit check"),

      reworded(
        PR,
        INVERSE,
        "“4 painters take 6 hours. How long would 3 painters take?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Inverse proportion: the product stays the same. Double one, halve the other.**"],
        WORKERS,
        [
          "**Inverse proportion: the product stays the same. Double one, halve the other.**",
          "Total work = workers × time.",
          "Fewer workers take longer.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Proportion graphs and equations.

const GRAPHS = "gf-proportion/graphs";
const graphMethod = [
  "Write $y = kx$ or $y = \\frac{k}{x}$.",
  "Put in the pair you know to find $k$.",
  "Use the equation for the new value.",
];
const BOTH: Picture = {
  kind: "graph",
  range: { xMin: 0, xMax: 8, yMin: 0, yMax: 8 },
  lines: [{ m: 1, c: 0 }],
  curves: [{ kind: "inverse", k: 8 }],
};

const graphs = stepped(find(PR, GRAPHS), {
  method: graphMethod,
  variation: {
    relationship: "one pair of values gives k",
    unknowns: ["k", "y"],
    surface: ["direct or inverse", "a bigger x", "a decimal k"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A line or a curve",
        [
          "**Direct: a straight line through 0. Inverse: a curve.**",
          "$y = kx$ and $y = \\frac{k}{x}$.",
        ],
        BOTH,
        "Find $k$ from one pair of values.",
      ),
      reworded(PR, GRAPHS, "Which shows direct proportion?", { tag: "The rule" }),

      ...owned(PR, GRAPHS, "Warm-up", "Check you remember"),

      methodCard("The method", graphMethod, BOTH),
      workedFrom(PR, GRAPHS),
      calc(
        "Your turn",
        "$y \\propto x$; $y = 21$ when $x = 3$. Find $y$ when $x = 5$.",
        undefined,
        [
          ["$k =$", "7", "21 ÷ 3."],
          ["$y =$", "35", "7 × 5."],
        ],
        "$y = 35$.",
      ),

      calc(
        "Practise",
        "$y \\propto \\frac1x$; $y = 6$ when $x = 4$. Find $y$ when $x = 8$.",
        undefined,
        [
          ["$k =$", "24", "6 × 4."],
          ["$y =$", "3", "24 ÷ 8."],
        ],
        "$y = 3$.",
      ),
      ...owned(PR, GRAPHS, "Together", "Practise"),
      ...owned(PR, GRAPHS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find $k$. Watch what changes.",
        [
          pick("$y = kx$; $y = 12$ when $x = 3$", "4", ["36", "9"], "12 ÷ 3.", { asks: "k" }),
          pick("$y = \\frac{k}{x}$; $y = 12$ when $x = 3$", "36", ["4", "15"], "12 × 3.", {
            asks: "k",
            changed: "Inverse.",
          }),
          pick("$y = kx$; $y = 6$ when $x = 12$", "0.5", ["2", "72"], "6 ÷ 12.", {
            asks: "k",
            changed: "$y$ smaller than $x$.",
          }),
          pick("$y = \\frac{k}{x}$; $y = 0.5$ when $x = 10$", "5", ["20", "0.05"], "0.5 × 10.", {
            asks: "k",
            changed: "A decimal.",
          }),
        ],
        "Direct: divide. Inverse: multiply.",
      ),

      questionSet(
        "Variation",
        "$y = 8$ when $x = 2$. Watch what changes.",
        [
          pick("$y \\propto x$. Find $y$ when $x = 5$.", "20", ["80", "11"], "$k = 4$.", {
            asks: "y",
            expect: [
              "$y \\propto x$, $y = 8$ when $x = 2$. Ivy says $k = 16$. Right?",
              "No",
              "$8 = 2k$, so $k = 8 \\div 2 = 4$.",
              [["Yes", "What times 2 makes 8?"]],
            ],
          }),
          pick("$y \\propto x$. Find $y$ when $x = 10$.", "40", ["20", "16"], "4 × 10.", {
            asks: "y",
            changed: "Double the $x$.",
          }),
          pick("$y \\propto \\frac1x$. Find $y$ when $x = 4$.", "4", ["16", "32"], "16 ÷ 4.", {
            asks: "y",
            changed: "Inverse.",
          }),
          pick("$y \\propto \\frac1x$. Find $y$ when $x = 8$.", "2", ["32", "64"], "16 ÷ 8.", {
            asks: "y",
            changed: "A bigger $x$.",
          }),
        ],
        "Find $k$ first, every time.",
      ),
      own(PR, GRAPHS, "Spot the mistake"),

      own(PR, GRAPHS, "Exit check"),

      reworded(
        PR,
        GRAPHS,
        "“$y \\propto x$; $y = 15$ when $x = 3$. Find $y$ when $x = 7$.”",
        {
          tag: "Real life",
          title: "A spring's stretch $\\propto$ the mass. 15 cm for 3 kg. Stretch for 7 kg, in cm?",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Direct: a straight line through 0. Inverse: a curve.**"],
        BOTH,
        [
          "**Direct: a straight line through 0. Inverse: a curve.**",
          "Find $k$ from one pair, then use it.",
          "A line not through 0 isn't proportion.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Reading proportion statements.

const READ = "gf-proportion/interpret";
const readMethod = [
  "Find the multiplier on $x$.",
  "Direct: do the same to $y$.",
  "Inverse: do the opposite to $y$.",
];
const CHANGES = table(
  ["$x$", "$y \\propto x$", "$y \\propto \\frac1x$"],
  [
    ["× 2", "× 2", "÷ 2"],
    ["÷ 3", "÷ 3", "× 3"],
  ],
);
const change = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Direct: the same. Inverse: the opposite.", {
    asks: "change",
    ...extra,
  });

const interpret = stepped(find(PR, READ), {
  method: readMethod,
  variation: {
    relationship: "the same multiplier, or its opposite",
    unknowns: ["change"],
    surface: ["direct or inverse", "multiplied or divided", "halved"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The same, or the opposite",
        ["**Direct: y gets the same multiplier. Inverse: the opposite.**"],
        CHANGES,
        "Adding isn't the same as multiplying.",
      ),
      reworded(PR, READ, "$y \\propto x$ and $x$ is halved. $y$", { tag: "The rule" }),

      ...owned(PR, READ, "Warm-up", "Check you remember"),

      methodCard("The method", readMethod, CHANGES),
      workedFrom(PR, READ),
      calc(
        "Your turn",
        "$y \\propto x$. $y = 5$ when $x = 2$. Then $x$ becomes 8.",
        undefined,
        [
          ["$x$ is multiplied by", "4", "8 ÷ 2."],
          ["$y =$", "20", "5 × 4."],
        ],
        "$y = 20$.",
      ),

      calc(
        "Practise",
        "$y \\propto \\frac1x$. $y = 12$ when $x = 2$. Then $x$ becomes 6.",
        undefined,
        [
          ["$x$ is multiplied by", "3", "6 ÷ 2."],
          ["$y =$", "4", "12 ÷ 3."],
        ],
        "$y = 4$.",
      ),
      ...owned(PR, READ, "Together", "Practise"),
      ...owned(PR, READ, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "$y \\propto x$. What happens to $y$?",
        [
          change("$x$ × 2", "× 2", ["÷ 2", "+ 2"]),
          change("$x$ × 5", "× 5", ["÷ 5", "+ 5"], { changed: "A bigger multiplier." }),
          change("$x$ ÷ 3", "÷ 3", ["× 3", "− 3"], { changed: "Divided." }),
          change("$x$ is halved", "÷ 2", ["× 2", "− 2"], { changed: "Halved." }),
        ],
        "Direct: $y$ does the same as $x$.",
      ),

      questionSet(
        "Variation",
        "$y \\propto \\frac1x$. What happens to $y$?",
        [
          change("$x$ × 2", "÷ 2", ["× 2", "− 2"], {
            expect: [
              "For $y \\propto x$, Kai says $x$ × 3 makes $y$ ÷ 3. Right?",
              "No",
              "Direct: the same change. $y$ × 3.",
              [["Yes", "Is $y \\propto x$ direct or inverse?"]],
            ],
          }),
          change("$x$ × 4", "÷ 4", ["× 4", "− 4"], { changed: "A bigger multiplier." }),
          change("$x$ ÷ 3", "× 3", ["÷ 3", "+ 3"], { changed: "Divided." }),
          change("$x$ is halved", "× 2", ["÷ 2", "+ 2"], { changed: "Halved." }),
        ],
        "Inverse: $y$ does the opposite.",
      ),
      own(PR, READ, "Spot the mistake"),

      own(PR, READ, "Exit check"),

      reworded(
        PR,
        READ,
        "“$P$ is inversely proportional to $V$. What happens to $P$ when $V$ is doubled?”",
        {
          tag: "Real life",
          title: "Gas pressure $P \\propto \\frac1V$. The volume $V$ doubles. What happens to $P$?",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Direct: y gets the same multiplier. Inverse: the opposite.**"],
        CHANGES,
        [
          "**Direct: y gets the same multiplier. Inverse: the opposite.**",
          "“Inversely proportional”: $y = \\frac{k}{x}$.",
          "Multiply, never add.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfProportionStepped: [string, UnitLesson[]][] = [
  [DIRECT, [direct]],
  [INVERSE, [inverse]],
  [GRAPHS, [graphs]],
  [READ, [interpret]],
];
