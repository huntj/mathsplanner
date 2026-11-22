// GCSE Foundation, "Simultaneous equations and inequalities", on the stepped template
// (docs/proposals/lesson-stepped.md): elimination, substitution, solving with graphs, and
// inequalities on a number line. Graph solutions are read from the crossing lines; the rest is
// algebra, its own picture.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfSimultaneous } from "./gf-simultaneous.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const SI = gfSimultaneous;
const ALGEBRA = "Algebra: the equations are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const steps = (...lines: string[]): Picture =>
  maths(`\\begin{array}{l} ${lines.join(" \\\\ ")} \\end{array}`);
const graph = (lines: [number, number][]): Picture => ({
  kind: "graph",
  range: { xMin: -1, xMax: 6, yMin: -1, yMax: 9 },
  lines: lines.map(([m, c]) => ({ m, c })),
});
const sol = (x: string, y: string) => `$x = ${x}$, $y = ${y}$`;
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Elimination.

const ELIM = "gf-simultaneous/elimination";
const elimMethod = [
  "Line up the equations.",
  "Same signs: subtract. Opposite signs: add.",
  "Solve, then substitute back for the other letter.",
];
const SUBTRACT = steps("2x + y = 9", "x + y = 6", "\\text{subtract: } x = 3");

const elimination = stepped(find(SI, ELIM), {
  method: elimMethod,
  variation: {
    relationship: "two equations, one letter removed",
    unknowns: ["solution"],
    surface: ["adding", "subtracting", "negative answers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Remove one letter",
        ["**Same coefficient: subtract. Opposite signs: add. One letter vanishes.**"],
        SUBTRACT,
        "Then $3 + y = 6$, so $y = 3$.",
      ),
      reworded(SI, ELIM, "$x + y = 10$ and $x - y = 4$. Add them:", { tag: "The rule" }),

      ...owned(SI, ELIM, "Warm-up", "Check you remember"),

      methodCard("The method", elimMethod, SUBTRACT),
      workedFrom(SI, ELIM),
      calc(
        "Your turn",
        "Solve $3x + y = 17$ and $x + y = 7$.",
        undefined,
        [
          ["Subtract: $2x =$", "10", "The y's vanish."],
          ["$x =$", "5", "÷ 2."],
          ["$y =$", "2", "7 − 5."],
        ],
        sol("5", "2"),
      ),

      calc(
        "Practise",
        "Solve $2x + 3y = 12$ and $4x - 3y = 6$.",
        undefined,
        [
          ["Add: $6x =$", "18", "+3y and −3y cancel."],
          ["$x =$", "3", "÷ 6."],
          ["$y =$", "2", "$6 + 3y = 12$."],
        ],
        sol("3", "2"),
      ),
      ...owned(SI, ELIM, "Together", "Practise"),
      ...owned(SI, ELIM, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve. Watch what changes.",
        [
          pick("$x + y = 9$, $x - y = 1$", sol("5", "4"), [sol("4", "5"), sol("9", "0")], "Add.", {
            asks: "solution",
          }),
          pick(
            "$2x + y = 9$, $x + y = 5$",
            sol("4", "1"),
            [sol("1", "4"), sol("3", "3")],
            "Subtract.",
            {
              asks: "solution",
              changed: "Subtract.",
            },
          ),
          pick(
            "$x + 2y = 9$, $x - 2y = 1$",
            sol("5", "2"),
            [sol("2", "5"), sol("5", "4")],
            "Add.",
            {
              asks: "solution",
              changed: "2y.",
            },
          ),
          pick(
            "$3x + y = 11$, $x + y = 5$",
            sol("3", "2"),
            [sol("2", "3"), sol("4", "1")],
            "Subtract.",
            {
              asks: "solution",
              changed: "3x.",
            },
          ),
        ],
        "Check your answer in both equations.",
      ),

      questionSet(
        "Variation",
        "Solve. Watch what changes.",
        [
          pick(
            "$x + y = 11$, $x - y = 5$",
            sol("8", "3"),
            [sol("8", "19"), sol("3", "8")],
            "Add: 2x = 16.",
            {
              asks: "solution",
              expect: [
                "With $x = 8$, Abi writes $8 + y = 11$, so $y = 19$. Right?",
                "No",
                "Take 8 from 11: $y = 3$.",
                [["Yes", "What is 11 − 8?"]],
              ],
            },
          ),
          pick(
            "$x + y = 11$, $x - y = 1$",
            sol("6", "5"),
            [sol("5", "6"), sol("6", "17")],
            "Add: 2x = 12.",
            {
              asks: "solution",
              changed: "Closer together.",
            },
          ),
          pick(
            "$x + y = 11$, $x - y = -3$",
            sol("4", "7"),
            [sol("7", "4"), sol("4", "15")],
            "Add: 2x = 8.",
            {
              asks: "solution",
              changed: "A negative.",
            },
          ),
          pick(
            "$2x + y = 11$, $2x - y = 5$",
            sol("4", "3"),
            [sol("3", "4"), sol("8", "3")],
            "Add: 4x = 16.",
            {
              asks: "solution",
              changed: "2x.",
            },
          ),
        ],
        "Substitute back with care.",
      ),
      own(SI, ELIM, "Spot the mistake"),

      own(SI, ELIM, "Exit check"),

      reworded(
        SI,
        ELIM,
        "“3 coffees and 2 teas cost £10.50; 3 coffees and 1 tea cost £9. Find each price.”",
        { tag: "Real life", title: "3 coffees, 2 teas: £10.50. 3 coffees, 1 tea: £9. Prices?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Same coefficient: subtract. Opposite signs: add. One letter vanishes.**"],
        SUBTRACT,
        [
          "**Same coefficient: subtract. Opposite signs: add. One letter vanishes.**",
          "$+2y$ and $-2y$: add.",
          "Substitute back and check.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Substitution.

const SUBS = "gf-simultaneous/substitution";
const subsMethod = [
  "Find the letter on its own.",
  "Swap it into the other equation, in brackets.",
  "Solve, then find the other letter.",
];
const SWAP = steps("y = 3x,\\ x + y = 16", "x + 3x = 16", "x = 4,\\ y = 12");

const substitution = stepped(find(SI, SUBS), {
  method: subsMethod,
  variation: {
    relationship: "one equation substituted into the other",
    unknowns: ["solution"],
    surface: ["minus signs", "x on its own", "negative answers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Swap it in",
        ["**If one equation gives a letter on its own, put it into the other.**"],
        SWAP,
        "Use brackets when you substitute.",
      ),
      reworded(SI, SUBS, "$y = 2x$ and $x + y = 12$. Substitute:", { tag: "The rule" }),

      ...owned(SI, SUBS, "Warm-up", "Check you remember"),

      methodCard("The method", subsMethod, SWAP),
      workedFrom(SI, SUBS),
      calc(
        "Your turn",
        "Solve $y = x + 3$ and $2x + y = 18$.",
        undefined,
        [
          ["$2x + x + 3 = 18$, so $x =$", "5", "3x = 15."],
          ["$y =$", "8", "5 + 3."],
        ],
        sol("5", "8"),
      ),

      calc(
        "Practise",
        "Solve $y = 2x - 1$ and $3x - y = 4$.",
        undefined,
        [
          ["$3x - (2x - 1) = 4$, so $x =$", "3", "x + 1 = 4."],
          ["$y =$", "5", "2 × 3 − 1."],
        ],
        sol("3", "5"),
      ),
      ...owned(SI, SUBS, "Together", "Practise"),
      ...owned(SI, SUBS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve. Watch what changes.",
        [
          pick("$y = 3x$, $x + y = 8$", sol("2", "6"), [sol("6", "2"), sol("3", "5")], "4x = 8.", {
            asks: "solution",
          }),
          pick(
            "$y = 3x$, $x + y = 20$",
            sol("5", "15"),
            [sol("15", "5"), sol("4", "16")],
            "4x = 20.",
            {
              asks: "solution",
              changed: "A bigger total.",
            },
          ),
          pick(
            "$y = x - 2$, $x + y = 10$",
            sol("6", "4"),
            [sol("4", "6"), sol("5", "5")],
            "2x − 2 = 10.",
            {
              asks: "solution",
              changed: "Minus 2.",
            },
          ),
          pick(
            "$x = 4y$, $x + y = 15$",
            sol("12", "3"),
            [sol("3", "12"), sol("4", "11")],
            "5y = 15.",
            {
              asks: "solution",
              changed: "x on its own.",
            },
          ),
        ],
        "Substitute, solve, then find the other.",
      ),

      questionSet(
        "Variation",
        "Solve. Watch the signs.",
        [
          pick(
            "$y = 2x - 3$, $5x - y = 12$",
            sol("3", "3"),
            [sol("2", "1"), sol("5", "7")],
            "3x + 3 = 12.",
            {
              asks: "solution",
              expect: [
                "Ben writes $5x - 2x - 3 = 12$. Right?",
                "No",
                "Brackets: $5x - (2x - 3) = 3x + 3$.",
                [["Yes", "What does the minus do to −3?"]],
              ],
            },
          ),
          pick(
            "$y = 2x - 3$, $5x + y = 11$",
            sol("2", "1"),
            [sol("1", "2"), sol("3", "3")],
            "7x − 3 = 11.",
            {
              asks: "solution",
              changed: "Plus y.",
            },
          ),
          pick(
            "$y = 2x + 3$, $5x - y = 6$",
            sol("3", "9"),
            [sol("9", "3"), sol("1", "5")],
            "3x − 3 = 6.",
            {
              asks: "solution",
              changed: "Plus 3.",
            },
          ),
          pick(
            "$y = 3 - 2x$, $5x - y = 18$",
            sol("3", "-3"),
            [sol("3", "3"), sol("-3", "3")],
            "7x − 3 = 18.",
            {
              asks: "solution",
              changed: "Minus 2x.",
            },
          ),
        ],
        "Brackets keep every sign right.",
      ),
      own(SI, SUBS, "Spot the mistake"),

      own(SI, SUBS, "Exit check"),

      reworded(
        SI,
        SUBS,
        "“$a = b + 4$ and $a + b = 30$. How old is each?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**If one equation gives a letter on its own, put it into the other.**"],
        SWAP,
        [
          "**If one equation gives a letter on its own, put it into the other.**",
          "$5x - (2x - 3) = 3x + 3$.",
          "Find both letters.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Solving with graphs.

const GRAPHS = "gf-simultaneous/graphs";
const graphMethod = ["Draw both lines.", "Find where they cross.", "Read x and y; check in both."];
const CROSS = graph([
  [1, 1],
  [2, -1],
]);
const read = (
  lines: [number, number][],
  right: string,
  others: string[],
  extra: Record<string, unknown>,
) =>
  pick("Solve using the graph.", right, others, "Where the lines cross.", {
    asks: "solution",
    picture: graph(lines),
    ...extra,
  });

const graphs = stepped(find(SI, GRAPHS), {
  method: graphMethod,
  variation: {
    relationship: "the crossing point solves both equations",
    unknowns: ["solution"],
    surface: ["different crossings", "flat lines", "parallel lines"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "On both lines",
        ["**Where two lines cross solves both equations.**"],
        CROSS,
        "They cross at (2, 3): $x = 2$, $y = 3$.",
      ),
      reworded(SI, GRAPHS, "Where do $y = x + 1$ and $y = 7 - x$ cross?", { tag: "The rule" }),

      ...owned(SI, GRAPHS, "Warm-up", "Check you remember"),

      methodCard("The method", graphMethod, CROSS),
      workedFrom(SI, GRAPHS),
      calc(
        "Your turn",
        "Solve using the graph.",
        graph([
          [2, -2],
          [1, 1],
        ]),
        [
          ["$x =$", "3", "Across to the crossing."],
          ["$y =$", "4", "Up to the crossing."],
        ],
        sol("3", "4"),
      ),

      calc(
        "Practise",
        "Solve using the graph.",
        graph([
          [-1, 8],
          [1, 2],
        ]),
        [
          ["$x =$", "3", "Across to the crossing."],
          ["$y =$", "5", "Up to the crossing."],
        ],
        sol("3", "5"),
      ),
      ...owned(SI, GRAPHS, "Together", "Practise"),
      ...owned(SI, GRAPHS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Read the crossing. Watch what changes.",
        [
          read(
            [
              [2, 0],
              [-1, 6],
            ],
            sol("2", "4"),
            [sol("4", "2"), sol("0", "6")],
            {},
          ),
          read(
            [
              [2, 0],
              [1, 1],
            ],
            sol("1", "2"),
            [sol("2", "1"), sol("0", "1")],
            { changed: "Another line." },
          ),
          read(
            [
              [1, 3],
              [-1, 7],
            ],
            sol("2", "5"),
            [sol("5", "2"), sol("3", "7")],
            { changed: "Both lines move." },
          ),
          read(
            [
              [0, 3],
              [1, 1],
            ],
            sol("2", "3"),
            [sol("3", "2"), sol("0", "3")],
            { changed: "A flat line." },
          ),
        ],
        "Across first, then up.",
      ),

      questionSet(
        "Variation",
        "Read the crossing. Watch what changes.",
        [
          read(
            [
              [1, 3],
              [2, 0],
            ],
            sol("3", "6"),
            [sol("6", "3"), sol("3", "3")],
            {
              expect: [
                "Ty reads the crossing (3, 6) as $x = 6$, $y = 3$. Right?",
                "No",
                "Across first: $x = 3$, $y = 6$.",
                [["Yes", "Which coordinate comes first?"]],
              ],
            },
          ),
          read(
            [
              [1, 3],
              [3, -1],
            ],
            sol("2", "5"),
            [sol("5", "2"), sol("2", "3")],
            { changed: "Steeper." },
          ),
          read(
            [
              [1, 3],
              [0, 7],
            ],
            sol("4", "7"),
            [sol("7", "4"), sol("0", "7")],
            { changed: "A flat line." },
          ),
          read(
            [
              [2, 1],
              [2, 4],
            ],
            "No solution",
            [sol("0", "1"), sol("1", "4")],
            { changed: "Parallel." },
          ),
        ],
        "Parallel lines never cross: no solution.",
      ),
      own(SI, GRAPHS, "Spot the mistake"),

      own(SI, GRAPHS, "Exit check"),

      reworded(
        SI,
        GRAPHS,
        "“Use the graph to find when the taxis cost the same.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Where two lines cross solves both equations.**"],
        CROSS,
        [
          "**Where two lines cross solves both equations.**",
          "Give both: x and y.",
          "Parallel lines: no solution.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Solving inequalities.

const INEQ = "gf-simultaneous/inequalities";
const ineqMethod = [
  "Do the same to both sides.",
  "× or ÷ by a negative: flip the sign.",
  "Show it: filled circle for ≤ or ≥, open for < or >.",
];
const LINE: Picture = {
  kind: "number-line",
  min: -2,
  max: 6,
  step: 1,
  interval: { from: 2, fromClosed: true },
};

const inequalities = stepped(find(SI, INEQ), {
  method: ineqMethod,
  variation: {
    relationship: "an inequality and the values it allows",
    unknowns: ["solution", "integers"],
    surface: ["≤ or <", "negatives", "double inequalities"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Like an equation, with one twist",
        ["**Solve like an equation; flip the sign if you × or ÷ by a negative.**"],
        LINE,
        "$x \\ge 2$: a filled circle and an arrow right.",
      ),
      reworded(SI, INEQ, "Solve $3x - 1 > 5$", { tag: "The rule" }),

      ...owned(SI, INEQ, "Warm-up", "Check you remember"),

      methodCard("The method", ineqMethod, LINE),
      workedFrom(SI, INEQ),
      calc(
        "Your turn",
        "Solve $4x - 3 < 13$.",
        undefined,
        [
          ["$4x <$", "16", "Add 3."],
          ["$x <$", "4", "÷ 4."],
        ],
        "$x < 4$.",
      ),

      calc(
        "Practise",
        "Solve $-3x \\le 12$.",
        undefined,
        [["÷ −3 and flip: $x \\ge$", "-4", "A negative flips it."]],
        "$x \\ge -4$.",
      ),
      ...owned(SI, INEQ, "Together", "Practise"),
      ...owned(SI, INEQ, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve. Watch what changes.",
        [
          pick("$2x + 1 > 7$", "$x > 3$", ["$x > 4$", "$x < 3$"], "2x > 6.", { asks: "solution" }),
          pick("$2x + 1 \\ge 7$", "$x \\ge 3$", ["$x > 3$", "$x \\le 3$"], "2x ≥ 6.", {
            asks: "solution",
            changed: "Or equal.",
          }),
          pick("$-2x > 6$", "$x < -3$", ["$x > -3$", "$x < 3$"], "÷ −2 flips it.", {
            asks: "solution",
            changed: "A negative.",
          }),
          pick("$7 - x < 4$", "$x > 3$", ["$x < 3$", "$x > -3$"], "−x < −3, so flip.", {
            asks: "solution",
            changed: "Minus x.",
          }),
        ],
        "Flip only when × or ÷ by a negative.",
      ),

      questionSet(
        "Variation",
        "Which integers? Watch what changes.",
        [
          pick("$1 \\le x < 4$", "1, 2, 3", ["1, 2, 3, 4", "2, 3"], "4 isn't less than 4.", {
            asks: "integers",
            expect: [
              "For $1 \\le x < 4$, Kit lists 1, 2, 3, 4. Right?",
              "No",
              "< 4 leaves out 4: 1, 2, 3.",
              [["Yes", "Is 4 less than 4?"]],
            ],
          }),
          pick("$1 < x \\le 4$", "2, 3, 4", ["1, 2, 3, 4", "1, 2, 3"], "1 isn't more than 1.", {
            asks: "integers",
            changed: "Swapped ends.",
          }),
          pick("$-2 \\le x < 1$", "−2, −1, 0", ["−2, −1, 0, 1", "−1, 0"], "Include −2.", {
            asks: "integers",
            changed: "Negatives.",
          }),
          pick("$-2 < x \\le 1$", "−1, 0, 1", ["−2, −1, 0", "−2, −1, 0, 1"], "Leave out −2.", {
            asks: "integers",
            changed: "Swapped again.",
          }),
        ],
        "≤ includes the end; < leaves it out.",
      ),
      own(SI, INEQ, "Spot the mistake"),

      own(SI, INEQ, "Exit check"),

      reworded(
        SI,
        INEQ,
        "“£20, bus £3.50, tickets £4. Solve $4t + 3.5 \\le 20$. How many tickets?”",
        { tag: "Real life", title: "Solve $4t + 3.5 \\le 20$. How many £4 tickets?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Solve like an equation; flip the sign if you × or ÷ by a negative.**"],
        LINE,
        [
          "**Solve like an equation; flip the sign if you × or ÷ by a negative.**",
          "$-3x \\ge 12$ gives $x \\le -4$.",
          "< 4 leaves out 4.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

export const gfSimultaneousStepped: [string, UnitLesson[]][] = [
  [ELIM, [elimination]],
  [SUBS, [substitution]],
  [GRAPHS, [graphs]],
  [INEQ, [inequalities]],
];
