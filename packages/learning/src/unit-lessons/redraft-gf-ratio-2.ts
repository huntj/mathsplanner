// GCSE Foundation, "Ratio 2", on the stepped template (docs/proposals/lesson-stepped.md): using
// ratio (currencies, recipes and mixing), ratio as a multiplier, proportion as equal ratios, and
// a fixed ratio as a straight line through the origin, drawn on a graph.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfRatio2 } from "./gf-ratio-2.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, Range, UnitLesson } from "./types.ts";

const R2 = gfRatio2;
const NUMBER = "A ratio fact: the numbers are the picture.";
const p = (x: number, y: number): Point => ({ x, y });
const bars = (rows: [string, number][]): Picture => ({
  kind: "bars",
  rows: rows.map(([label, parts]) => ({ label, parts })),
});
const line = (m: number, c: number, range: Range, points: Point[] = []): Picture => ({
  kind: "graph",
  range,
  lines: [{ m, c }],
  ...(points.length ? { points } : {}),
});
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Using ratio.

const APPLYING = "gf-ratio-2/applying";
const applyMethod = [
  "Write the rate: £1 = how many?",
  "Multiply to go one way; divide to go back.",
  "Mixing: total ÷ parts, then × each part.",
];
const RATE: Picture = {
  kind: "table",
  head: ["£", "€"],
  rows: [
    ["1", "1.15"],
    ["10", "11.50"],
    ["100", "115"],
  ],
};

const applying = stepped(find(R2, APPLYING), {
  method: applyMethod,
  variation: {
    relationship: "an exchange rate used both ways",
    unknowns: ["amount"],
    surface: ["pounds to euros", "euros to pounds", "smaller amounts"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Scale, then convert",
        ["**Pounds to euros: multiply by the rate. Euros to pounds: divide.**"],
        RATE,
        "Mixing: find one part, then each amount.",
      ),
      reworded(R2, APPLYING, "€92 into pounds, at £1 = €1.15", { tag: "The rule" }),

      ...owned(R2, APPLYING, "Warm-up", "Check you remember"),

      methodCard("The method", applyMethod, RATE),
      workedFrom(R2, APPLYING),
      calc(
        "Your turn",
        "£1 = €1.20. Change £85 to euros.",
        undefined,
        [["$85 \\times 1.2 =$", "102", "Pounds to euros: multiply."]],
        "€102.",
      ),

      calc(
        "Practise",
        "£1 = €1.20. Change €150 to pounds.",
        undefined,
        [["$150 \\div 1.2 =$", "125", "Euros to pounds: divide."]],
        "£125.",
      ),
      reworded(R2, APPLYING, "Which is better value?", {
        tag: "Practise",
        start: "A: €1.15 per £1. B: €1.20 per £1, with a £3 fee.",
      }),
      reworded(R2, APPLYING, "A recipe for 4 uses 200 g flour. For 10 people?", {
        tag: "Practise",
      }),
      ...owned(R2, APPLYING, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "£1 = 1.30 dollars. Watch what changes.",
        [
          ask("Dollars for £100?", "130", "100 × 1.3.", "130 dollars.", { asks: "amount" }),
          ask("Dollars for £50?", "65", "50 × 1.3.", "65 dollars.", {
            asks: "amount",
            changed: "Half as much.",
          }),
          ask("Pounds for 260 dollars?", "200", "260 ÷ 1.3.", "£200.", {
            asks: "amount",
            changed: "Backwards.",
          }),
          ask("Pounds for 65 dollars?", "50", "65 ÷ 1.3.", "£50.", {
            asks: "amount",
            changed: "Smaller.",
          }),
        ],
        "Multiply one way, divide back.",
      ),

      questionSet(
        "Variation",
        "£1 = €1.15. Watch what changes.",
        [
          ask("€230 in pounds?", "200", "230 ÷ 1.15.", "£200.", {
            asks: "amount",
            expect: [
              "To change €230 to pounds, Lou multiplies by 1.15. Right?",
              "No",
              "Euros to pounds: divide. £200.",
              [["Yes", "Should the pounds be fewer than the euros?"]],
            ],
          }),
          ask("£230 in euros?", ["264.5", "264.50"], "230 × 1.15.", "€264.50.", {
            asks: "amount",
            changed: "Pounds to euros.",
          }),
          ask("€115 in pounds?", "100", "115 ÷ 1.15.", "£100.", {
            asks: "amount",
            changed: "Smaller.",
          }),
          ask("€11.50 in pounds?", "10", "11.50 ÷ 1.15.", "£10.", {
            asks: "amount",
            changed: "Smaller again.",
          }),
        ],
        "Euros outnumber pounds, so euros to pounds divides.",
      ),
      reworded(R2, APPLYING, "Where did it go wrong?", {
        text: "3 eggs for 12 cakes. Mia finds the eggs for 20 cakes.",
      }),

      own(R2, APPLYING, "Exit check"),

      reworded(
        R2,
        APPLYING,
        "“£1 = €1.15. How many euros for £240?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Pounds to euros: multiply by the rate. Euros to pounds: divide.**"],
        RATE,
        [
          "**Pounds to euros: multiply by the rate. Euros to pounds: divide.**",
          "Mixing 1 : 4 in 7.5 litres: one part is 1.5 litres.",
          "Scale recipes by a multiplier.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Ratio as a multiplier.

const MULTIPLIER = "gf-ratio-2/multiplicative";
const multMethod = [
  "A is k times B: A : B = k : 1.",
  "A is $\\frac{a}{b}$ of B: A : B = a : b.",
  "A as a fraction of B: A's part over B's part.",
];
const THREE = bars([
  ["A", 3],
  ["B", 1],
]);

const multiplicative = stepped(find(R2, MULTIPLIER), {
  method: multMethod,
  variation: {
    relationship: "a ratio, a multiplier and a fraction of the other",
    unknowns: ["relation", "fraction"],
    surface: ["swapped", "fractions", "of the total or of the other"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Ratios as multipliers",
        ["**A is 3 times B means A : B = 3 : 1, and B is ⅓ of A.**"],
        THREE,
        "A fraction compares one with the other, not the total.",
      ),
      reworded(R2, MULTIPLIER, "Ali is 3 times as old as his son. Ali : son", { tag: "The rule" }),

      ...owned(R2, MULTIPLIER, "Warm-up", "Check you remember"),

      methodCard("The method", multMethod, THREE),
      workedFrom(R2, MULTIPLIER),
      calc(
        "Your turn",
        "Rope : cable = 2 : 7.",
        bars([
          ["Rope", 2],
          ["Cable", 7],
        ]),
        [
          ["Rope as a fraction of cable: $\\frac{2}{?}$, ? =", "7", "Rope's part over cable's."],
          ["Cable is how many times the rope?", "3.5", "7 ÷ 2."],
        ],
        "$\\frac27$, and 3.5 times.",
      ),

      calc(
        "Practise",
        "$y = 8x$.",
        undefined,
        [
          ["$x : y = 1 :$", "8", "y is 8 times x."],
          ["$x$ as a fraction of $y$: $\\frac{1}{?}$, ? =", "8", "x's part over y's."],
        ],
        "$x : y = 1 : 8$.",
      ),
      ...owned(R2, MULTIPLIER, "Together", "Practise"),
      ...owned(R2, MULTIPLIER, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "A : B? Watch what changes.",
        [
          pick("A is 4 times B.", "4 : 1", ["1 : 4", "4 : 5"], "A = 4B.", { asks: "relation" }),
          pick("B is 4 times A.", "1 : 4", ["4 : 1", "1 : 5"], "B = 4A.", {
            asks: "relation",
            changed: "Swapped.",
          }),
          pick("A is $\\frac34$ of B.", "3 : 4", ["4 : 3", "3 : 7"], "A = ¾ B.", {
            asks: "relation",
            changed: "A fraction.",
          }),
          pick(
            "A : B = 3 : 4. B as a fraction of A?",
            "$\\frac43$",
            ["$\\frac34$", "$\\frac47$"],
            "B's part over A's.",
            {
              asks: "fraction",
              changed: "Backwards.",
            },
          ),
        ],
        "The first number goes with the first thing.",
      ),

      questionSet(
        "Variation",
        "A : B = 2 : 3. Watch what changes.",
        [
          pick(
            "A as a fraction of B?",
            "$\\frac23$",
            ["$\\frac25$", "$\\frac32$"],
            "A's part over B's.",
            {
              asks: "fraction",
              expect: [
                "For A : B = 2 : 3, Jo says A is $\\frac25$ of B. Right?",
                "No",
                "$\\frac25$ is A out of the total. A is $\\frac23$ of B.",
                [["Yes", "Of B, or of the total?"]],
              ],
            },
          ),
          pick(
            "A as a fraction of the total?",
            "$\\frac25$",
            ["$\\frac23$", "$\\frac35$"],
            "5 parts in all.",
            {
              asks: "fraction",
              changed: "Of the total.",
            },
          ),
          pick(
            "B as a fraction of A?",
            "$\\frac32$",
            ["$\\frac23$", "$\\frac35$"],
            "B's part over A's.",
            {
              asks: "fraction",
              changed: "B of A.",
            },
          ),
          pick(
            "B as a fraction of the total?",
            "$\\frac35$",
            ["$\\frac32$", "$\\frac25$"],
            "5 parts in all.",
            {
              asks: "fraction",
              changed: "B of the total.",
            },
          ),
        ],
        "Of the other, or of the total? Read carefully.",
      ),
      own(R2, MULTIPLIER, "Spot the mistake"),

      own(R2, MULTIPLIER, "Exit check"),

      reworded(
        R2,
        MULTIPLIER,
        "“A rope is $\\frac25$ the length of a cable. Write the ratio rope : cable.”",
        { tag: "Real life", title: "A rope is $\\frac25$ of a cable's length. Rope : cable?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A is 3 times B means A : B = 3 : 1, and B is ⅓ of A.**"],
        THREE,
        [
          "**A is 3 times B means A : B = 3 : 1, and B is ⅓ of A.**",
          "A : B = 2 : 3: A is $\\frac23$ of B, $\\frac25$ of the total.",
          "$y = 6x$: $x : y = 1 : 6$.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Proportion as equal ratios.

const EQUAL = "gf-ratio-2/equal-ratios";
const equalMethod = [
  "Find the multiplier from one pair.",
  "Check it works for the other pair.",
  "Or simplify both and compare.",
];
const SCALED: Picture = {
  kind: "table",
  head: ["Oats", "Milk"],
  rows: [
    ["2", "3"],
    ["4", "6"],
    ["6", "9"],
  ],
};

const equalRatios = stepped(find(R2, EQUAL), {
  method: equalMethod,
  variation: {
    relationship: "equal ratios share one multiplier",
    unknowns: ["equal", "missing"],
    surface: ["decimals", "three parts", "smaller ratios"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Equal ratios",
        ["**Equal ratios: both parts multiplied by the same number.**"],
        SCALED,
        "× 2, × 3: still 2 : 3.",
      ),
      reworded(R2, EQUAL, "Is 4 : 6 = 10 : 15?", { tag: "The rule" }),

      ...owned(R2, EQUAL, "Warm-up", "Check you remember"),

      methodCard("The method", equalMethod, SCALED),
      workedFrom(R2, EQUAL),
      calc(
        "Your turn",
        "4 : 7 = 20 : $x$.",
        undefined,
        [
          ["Multiplier:", "5", "20 ÷ 4."],
          ["$x =$", "35", "7 × 5."],
        ],
        "$x = 35$.",
      ),

      calc(
        "Practise",
        "$x$ : 18 = 5 : 6.",
        undefined,
        [
          ["Multiplier:", "3", "18 ÷ 6."],
          ["$x =$", "15", "5 × 3."],
        ],
        "$x = 15$.",
      ),
      ...owned(R2, EQUAL, "Together", "Practise"),
      ...owned(R2, EQUAL, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Equal to 3 : 4? Watch what changes.",
        [
          pick("Which equals 3 : 4?", "9 : 12", ["5 : 6", "4 : 3"], "× 3.", { asks: "equal" }),
          pick("Which equals 3 : 4 now?", "1.5 : 2", ["2.5 : 3.5", "3.5 : 4.5"], "× ½.", {
            asks: "equal",
            changed: "Halved.",
          }),
          pick("Which equals 3 : 4 : 5?", "6 : 8 : 10", ["5 : 6 : 7", "6 : 8 : 5"], "× 2.", {
            asks: "equal",
            changed: "Three parts.",
          }),
          pick("And which equals 3 : 4?", "30 : 40", ["13 : 14", "34 : 43"], "× 10.", {
            asks: "equal",
            changed: "× 10.",
          }),
        ],
        "Multiply every part by the same number.",
      ),

      questionSet(
        "Variation",
        "Find $x$. Watch what changes.",
        [
          ask("6 : 9 = $x$ : 15", "10", "6 : 9 = 2 : 3.", "10.", {
            asks: "missing",
            expect: [
              "For 6 : 9 = $x$ : 15, Ivo adds and gets 7. Right?",
              "No",
              "6 : 9 = 2 : 3, and 15 = 3 × 5, so $x = 2 \\times 5 = 10$.",
              [["Yes", "Do ratios add or multiply?"]],
            ],
          }),
          ask("6 : 9 = $x$ : 18", "12", "× 2.", "12.", { asks: "missing", changed: "Double." }),
          ask("6 : 9 = 10 : $x$", "15", "2 : 3 = 10 : 15.", "15.", {
            asks: "missing",
            changed: "The other part.",
          }),
          ask("6 : 9 = $x$ : 4.5", "3", "× ½.", "3.", { asks: "missing", changed: "Smaller." }),
        ],
        "Proportion multiplies; it never adds.",
      ),
      own(R2, EQUAL, "Spot the mistake"),

      own(R2, EQUAL, "Exit check"),

      reworded(
        R2,
        EQUAL,
        "“Are 3 : 2 and 7.5 : 5 in the same proportion? Show how you know.”",
        { tag: "Real life", title: "Are 3 : 2 and 7.5 : 5 in proportion?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Equal ratios: both parts multiplied by the same number.**"],
        SCALED,
        [
          "**Equal ratios: both parts multiplied by the same number.**",
          "2 : 3 = 4 : 6, not 4 : 5.",
          "Find the multiplier from one pair.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Ratios, fractions and straight lines.

const LINES = "gf-ratio-2/linear-functions";
const lineMethod = [
  "Write the ratio as 1 : k.",
  "The equation is y = kx.",
  "Its graph is a straight line through (0, 0).",
];
const box: Range = { xMin: 0, xMax: 5, yMin: 0, yMax: 10 };
const DOUBLE = line(2, 0, box, [p(1, 2), p(2, 4), p(3, 6)]);

const linearFunctions = stepped(find(R2, LINES), {
  method: lineMethod,
  variation: {
    relationship: "a fixed ratio: y = kx, a line through (0, 0)",
    unknowns: ["fixed", "equation"],
    surface: ["steeper or flatter", "a start value", "curves"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A straight line through zero",
        ["**A fixed ratio is a straight line through (0, 0): y = kx.**"],
        DOUBLE,
        "Here y : x = 2 : 1, so y = 2x.",
      ),

      ...owned(R2, LINES, "Warm-up", "Check you remember"),

      methodCard("The method", lineMethod, DOUBLE),
      workedFrom(R2, LINES),
      calc(
        "Your turn",
        "Flour : sugar = 2 : 5.",
        line(2.5, 0, { xMin: 0, xMax: 5, yMin: 0, yMax: 12 }, [p(2, 5), p(4, 10)]),
        [
          ["Sugar = ? × flour, ? =", "2.5", "5 ÷ 2."],
          ["Sugar for 6 kg flour:", "15", "6 × 2.5.", { after: "kg" }],
        ],
        "$s = 2.5f$.",
      ),

      calc(
        "Practise",
        "Juice : water = 1 : 6.",
        undefined,
        [
          ["$w = ?j$, ? =", "6", "6 times as much water."],
          ["Water for 1.5 litres of juice:", "9", "1.5 × 6.", { after: "litres" }],
        ],
        "$w = 6j$.",
      ),
      ...owned(R2, LINES, "Together", "Practise"),
      ...owned(R2, LINES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "A fixed ratio? Watch what changes.",
        [
          pick("Does this show a fixed ratio?", "Yes", ["No"], "Straight, through (0, 0).", {
            asks: "fixed",
            picture: line(2, 0, box),
          }),
          pick("Does this one?", "No", ["Yes"], "It misses (0, 0).", {
            asks: "fixed",
            changed: "It starts higher.",
            picture: line(2, 3, box),
          }),
          pick("And this one?", "Yes", ["No"], "Straight, through (0, 0).", {
            asks: "fixed",
            changed: "Flatter.",
            picture: line(0.5, 0, box),
          }),
          pick("And this?", "No", ["Yes"], "It curves.", {
            asks: "fixed",
            changed: "A curve.",
            picture: {
              kind: "graph",
              range: box,
              curves: [{ kind: "quadratic", a: 0.5, b: 0, c: 0 }],
            },
          }),
        ],
        "Straight and through (0, 0): a fixed ratio.",
      ),

      questionSet(
        "Variation",
        "Juice : water. Watch what changes.",
        [
          pick(
            "1 : 4. The equation?",
            "$w = 4j$",
            ["$w = j + 4$", "$j = 4w$"],
            "Times, not plus.",
            {
              asks: "equation",
              expect: [
                "For 1 : 4, Kim writes $w = j + 4$. Right?",
                "No",
                "4 times as much water: $w = 4j$.",
                [["Yes", "Times or plus?"]],
              ],
            },
          ),
          pick(
            "4 : 1. The equation?",
            "$j = 4w$",
            ["$w = 4j$", "$j = w + 4$"],
            "Now juice is 4 times.",
            {
              asks: "equation",
              changed: "Swapped.",
            },
          ),
          pick("2 : 5. The equation?", "$w = 2.5j$", ["$w = 5j$", "$w = j + 3$"], "5 ÷ 2.", {
            asks: "equation",
            changed: "Not 1 : something.",
          }),
          pick("1 : 4. Is (5, 20) on its line?", "Yes", ["No"], "20 = 4 × 5.", {
            asks: "fixed",
            changed: "A point.",
          }),
        ],
        "A ratio gives y = kx, never y = x + k.",
      ),
      own(R2, LINES, "Spot the mistake"),

      own(R2, LINES, "Exit check"),

      reworded(
        R2,
        LINES,
        "“Red : white = 1 : 3. What do you notice about the graph, and what's its equation?”",
        { tag: "Real life", title: "Red : white = 1 : 3. Describe the graph and its equation." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A fixed ratio is a straight line through (0, 0): y = kx.**"],
        DOUBLE,
        [
          "**A fixed ratio is a straight line through (0, 0): y = kx.**",
          "1 : 4 gives $w = 4j$, not $w = j + 4$.",
          "£3 plus £2 a mile isn't a fixed ratio.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfRatio2Stepped: [string, UnitLesson[]][] = [
  [APPLYING, [applying]],
  [MULTIPLIER, [multiplicative]],
  [EQUAL, [equalRatios]],
  [LINES, [linearFunctions]],
];
