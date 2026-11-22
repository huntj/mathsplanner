// GCSE Foundation, "Probability 1", on the stepped template (docs/proposals/lesson-stepped.md):
// frequency trees and two-way tables, expected outcomes, relative frequency, probabilities that
// add to 1, bigger samples and sample-space grids. Trees, tables, spinners and grids are drawn for
// the questions that read them; the rest is number work.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { dice, frequencyTree, gfProbability1 } from "./gf-probability-1.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const PR = gfProbability1;
const NUMBER = "Counting outcomes: the numbers are the picture.";
const table = (head: string[], rows: string[][]): Picture => ({ kind: "table", head, rows });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });

// ---------------------------------------------------------------------------------------------
// Tables and frequency trees.

const TREES = "gf-probability-1/frequency-trees";
const treeMethod = [
  "Start with the total.",
  "Split it: the parts add up to the total.",
  "Split again. Find a missing part by subtracting.",
];
const DRINKS = frequencyTree(
  "80",
  ["50 adults", "30 children"],
  ["20 tea", "30 coffee", "10 tea", "20 juice"],
);

const frequencyTrees = stepped(find(PR, TREES), {
  method: treeMethod,
  variation: {
    relationship: "each split of a frequency tree adds up to the number before it",
    unknowns: ["missing"],
    surface: ["first splits", "second splits", "the total"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Each split adds up",
        ["**Each split adds up to the number before it.**"],
        DRINKS,
        "A two-way table holds the same numbers in rows and columns.",
      ),

      ...owned(PR, TREES, "Warm-up", "Check you remember"),

      methodCard("The method", treeMethod, DRINKS),
      workedFrom(PR, TREES),
      calc(
        "Your turn",
        "Find a and b.",
        frequencyTree("120", ["70 boys", "50 girls"], ["40 walk", "a", "b", "15 bus"]),
        [
          ["a =", "30", "The boys' split adds up."],
          ["b =", "35", "The girls' split adds up."],
        ],
        "a = 30, b = 35.",
      ),

      calc(
        "Practise",
        "Complete the table.",
        table(
          ["", "Pet", "No pet", "Total"],
          [
            ["Boys", "8", "?", "20"],
            ["Girls", "12", "?", "?"],
            ["Total", "20", "?", "45"],
          ],
        ),
        [
          ["Boys, no pet:", "12", "Along the boys' row."],
          ["Girls' total:", "25", "Down the total column."],
          ["Girls, no pet:", "13", "Along the girls' row."],
        ],
        "12, 25 and 13.",
      ),
      ...owned(PR, TREES, "Together", "Practise"),
      reworded(
        PR,
        TREES,
        "200 cars: 120 are electric. 90 electric cars are white. How many electric cars aren't white?",
        { tag: "Practise", title: "120 electric cars; 90 are white. How many aren't?" },
      ),
      reworded(PR, TREES, "In the table, how many boys chose the museum?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Find x. Watch what changes.",
        [
          ask("Find x.", "25", "The first split adds up.", "25.", {
            asks: "missing",
            picture: frequencyTree("60", ["35", "x"], ["20", "15", "10", "15"]),
          }),
          ask("Find x now.", "20", "The second split adds up.", "20.", {
            asks: "missing",
            changed: "A second split.",
            picture: frequencyTree("60", ["35", "25"], ["x", "15", "10", "15"]),
          }),
          ask("And now?", "60", "Add the first split.", "60.", {
            asks: "missing",
            changed: "The total.",
            picture: frequencyTree("x", ["35", "25"], ["20", "15", "10", "15"]),
          }),
          ask("And this one?", "10", "The other branch adds up.", "10.", {
            asks: "missing",
            changed: "The other branch.",
            picture: frequencyTree("60", ["35", "25"], ["20", "15", "x", "15"]),
          }),
        ],
        "Every split adds back to the number before it.",
      ),

      questionSet(
        "Variation",
        "Find x. Watch what changes.",
        [
          ask("Find x.", "25", "Take the zoo from the girls.", "25.", {
            asks: "missing",
            picture: frequencyTree(
              "100",
              ["60 boys", "40 girls"],
              ["35 zoo", "25 museum", "15 zoo", "x"],
            ),
            expect: [
              "Leo adds the girls' total and their zoo branch. Right?",
              "No",
              "The branches add up to the girls' total: subtract.",
              [["Yes", "Should the branches be bigger than the total?"]],
            ],
          }),
          ask("Find x now.", "10", "Take the zoo from the girls.", "10.", {
            asks: "missing",
            changed: "More chose the zoo.",
            picture: frequencyTree(
              "100",
              ["60 boys", "40 girls"],
              ["35 zoo", "25 museum", "30 zoo", "x"],
            ),
          }),
          ask("And now?", "35", "Take the zoo from the girls.", "35.", {
            asks: "missing",
            changed: "More girls.",
            picture: frequencyTree(
              "110",
              ["60 boys", "50 girls"],
              ["35 zoo", "25 museum", "15 zoo", "x"],
            ),
          }),
          ask("And this one?", "25", "Take the zoo from the boys.", "25.", {
            asks: "missing",
            changed: "The boys.",
            picture: frequencyTree(
              "100",
              ["60 boys", "40 girls"],
              ["35 zoo", "x", "15 zoo", "25 museum"],
            ),
          }),
        ],
        "Subtract from the branch's own total.",
      ),
      own(PR, TREES, "Spot the mistake"),

      own(PR, TREES, "Exit check"),

      reworded(
        PR,
        TREES,
        "“How many girls chose the museum?”",
        {
          tag: "Real life",
          picture: frequencyTree(
            "100",
            ["60 boys", "40 girls"],
            ["35 zoo", "25 museum", "25 zoo", "?"],
          ),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Each split adds up to the number before it.**"],
        DRINKS,
        [
          "**Each split adds up to the number before it.**",
          "A missing branch: subtract, don't add.",
          "Two-way tables: rows and columns add to the totals.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Fair games and expected outcomes.

const EXPECTED = "gf-probability-1/expected";
const expMethod = [
  "Find the probability of one outcome.",
  "Multiply by the number of trials.",
  "It's an average, not a promise.",
];
const FOUR: Picture = {
  kind: "spinner",
  sectors: [
    { label: "Red", size: 1 },
    { label: "Blue", size: 1 },
    { label: "Green", size: 2 },
  ],
};

const expected = stepped(find(PR, EXPECTED), {
  method: expMethod,
  variation: {
    relationship: "expected number = probability × trials",
    unknowns: ["expected"],
    surface: ["more trials", "fewer trials", "bigger chances"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Fair and expected",
        ["**Expected number = probability × number of trials.**"],
        FOUR,
        "P(red) is ¼: in 80 spins, expect about 20 reds.",
      ),
      reworded(PR, EXPECTED, "Win on 1 or 2; lose on 3–6. Is it fair?", { tag: "The rule" }),

      ...owned(PR, EXPECTED, "Warm-up", "Check you remember"),

      methodCard("The method", expMethod, FOUR),
      workedFrom(PR, EXPECTED),
      calc(
        "Your turn",
        "Spun 100 times. Expected greens?",
        FOUR,
        [
          ["P(green):", "0.5", "Half the spinner."],
          ["Expected greens:", "50", "0.5 × 100."],
        ],
        "About 50 greens.",
      ),

      calc(
        "Practise",
        "P(win) = 0.35. Played 200 times.",
        undefined,
        [["Expected wins: $0.35 \\times 200 =$", "70", "35% of 200."]],
        "About 70 wins.",
      ),
      ...owned(PR, EXPECTED, "Together", "Practise"),
      ...owned(PR, EXPECTED, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "A fair dice, 600 rolls. Watch what changes.",
        [
          ask("Expected sixes?", "100", "⅙ × 600.", "100.", { asks: "expected" }),
          ask("Expected even numbers?", "300", "3 of 6 faces.", "300.", {
            asks: "expected",
            changed: "Three outcomes.",
          }),
          ask("Expected numbers above 4?", "200", "5 or 6: 2 of 6.", "200.", {
            asks: "expected",
            changed: "Two outcomes.",
          }),
          ask("Expected sevens?", "0", "There's no 7.", "0.", {
            asks: "expected",
            changed: "Impossible.",
          }),
        ],
        "Probability × trials.",
      ),

      questionSet(
        "Variation",
        "P(red) = 0.15. Expected reds? Watch what changes.",
        [
          ask("200 spins", "30", "0.15 × 200.", "30.", {
            asks: "expected",
            expect: [
              "For 200 spins, Max gets 3. Right?",
              "No",
              "$0.15 \\times 200 = 30$: 15% of 200.",
              [["Yes", "Is 3 sensible from 200 spins?"]],
            ],
          }),
          ask("400 spins", "60", "0.15 × 400.", "60.", {
            asks: "expected",
            changed: "Twice as many.",
          }),
          ask("20 spins", "3", "0.15 × 20.", "3.", { asks: "expected", changed: "Fewer spins." }),
          ask("P(red) = 0.3, 200 spins", "60", "0.3 × 200.", "60.", {
            asks: "expected",
            changed: "Double the chance.",
          }),
        ],
        "Twice the trials or twice the chance: twice as many.",
      ),
      own(PR, EXPECTED, "Spot the mistake"),

      own(PR, EXPECTED, "Exit check"),

      reworded(
        PR,
        EXPECTED,
        "“A fair dice is rolled 300 times. How many sixes would you expect?”",
        { tag: "Real life", title: "A fair dice, 300 rolls. How many sixes to expect?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Expected number = probability × number of trials.**"],
        FOUR,
        [
          "**Expected number = probability × number of trials.**",
          "Fair: every outcome equally likely.",
          "Expected is an average: results vary.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Relative frequency.

const RELATIVE = "gf-probability-1/relative-frequency";
const relMethod = [
  "Count the times it happened.",
  "Divide by the total number of trials.",
  "Expected: relative frequency × new trials.",
];
const PIN = table(
  ["Lands", "Frequency"],
  [
    ["Up", "42"],
    ["Down", "58"],
    ["Total", "100"],
  ],
);

const relative = stepped(find(PR, RELATIVE), {
  method: relMethod,
  variation: {
    relationship: "relative frequency = times it happened ÷ trials",
    unknowns: ["relative frequency"],
    surface: ["more trials", "swapped results", "equal results"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "From an experiment",
        ["**Relative frequency = times it happened ÷ trials.**"],
        PIN,
        "It estimates the probability: here 0.42 for up.",
      ),

      ...owned(PR, RELATIVE, "Warm-up", "Check you remember"),

      methodCard("The method", relMethod, PIN),
      workedFrom(PR, RELATIVE),
      calc(
        "Your turn",
        "Estimate P(blue).",
        table(
          ["Colour", "Frequency"],
          [
            ["Red", "15"],
            ["Blue", "35"],
            ["Green", "50"],
          ],
        ),
        [
          ["Total trials:", "100", "Add them up."],
          ["P(blue) ≈", "0.35", "Blue ÷ total."],
        ],
        "About 0.35.",
      ),

      calc(
        "Practise",
        "Relative frequency 0.35. Expected in 600 trials?",
        undefined,
        [["$0.35 \\times 600 =$", "210", "Relative frequency × trials."]],
        "About 210.",
      ),
      ...owned(PR, RELATIVE, "Together", "Practise"),
      ...owned(PR, RELATIVE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Relative frequency? Watch what changes.",
        [
          ask("18 heads in 40 flips", "0.45", "18 ÷ 40.", "0.45.", { asks: "relative frequency" }),
          ask("9 in 30 trials", "0.3", "9 ÷ 30.", "0.3.", {
            asks: "relative frequency",
            changed: "Fewer trials.",
          }),
          ask("60 in 75 trials", "0.8", "60 ÷ 75.", "0.8.", {
            asks: "relative frequency",
            changed: "Most of them.",
          }),
          ask("0 in 20 trials", "0", "0 ÷ 20.", "0.", {
            asks: "relative frequency",
            changed: "Never.",
          }),
        ],
        "Times it happened ÷ trials.",
      ),

      questionSet(
        "Variation",
        "Estimate P(heads). Watch what changes.",
        [
          ask("12 heads, 28 tails", "0.3", "12 ÷ 40.", "0.3.", {
            asks: "relative frequency",
            expect: [
              "12 heads, 28 tails: Ana says $\\frac{12}{28}$. Right?",
              "No",
              "Trials = 12 + 28 = 40, so $\\frac{12}{40} = 0.3$.",
              [["Yes", "How many flips in all?"]],
            ],
          }),
          ask("28 heads, 12 tails", "0.7", "28 ÷ 40.", "0.7.", {
            asks: "relative frequency",
            changed: "Swapped.",
          }),
          ask("12 heads, 48 tails", "0.2", "12 ÷ 60.", "0.2.", {
            asks: "relative frequency",
            changed: "More tails.",
          }),
          ask("12 heads, 12 tails", "0.5", "12 ÷ 24.", "0.5.", {
            asks: "relative frequency",
            changed: "Equal.",
          }),
        ],
        "Divide by all the trials, not the other result.",
      ),
      own(PR, RELATIVE, "Spot the mistake"),

      own(PR, RELATIVE, "Exit check"),

      reworded(
        PR,
        RELATIVE,
        "“Estimate the probability the pin lands point up.”",
        { tag: "Real life", title: "130 point up in 200 drops. Estimate P(point up)." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Relative frequency = times it happened ÷ trials.**"],
        PIN,
        [
          "**Relative frequency = times it happened ÷ trials.**",
          "18 heads, 22 tails: $\\frac{18}{40}$.",
          "It's an estimate, best from many trials.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Probabilities add to 1.

const SUM = "gf-probability-1/sum-to-one";
const sumMethod = [
  "Add the probabilities you know.",
  "Take them from 1.",
  "Share what's left between equal outcomes.",
];
const LEFT = table(["Colour", "Red", "Blue", "Green"], [["P", "0.5", "0.3", "?"]]);

const sumToOne = stepped(find(PR, SUM), {
  method: sumMethod,
  variation: {
    relationship: "all the outcomes' probabilities add to 1",
    unknowns: ["x"],
    surface: ["one missing", "equal outcomes", "doubles"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Something must happen",
        ["**Probabilities of all the outcomes add to 1.**"],
        LEFT,
        "So P(green) = 1 − 0.8 = 0.2.",
      ),
      reworded(PR, SUM, "P(rain) = 0.7. P(no rain) =", { tag: "The rule" }),

      ...owned(PR, SUM, "Warm-up", "Check you remember"),

      methodCard("The method", sumMethod, LEFT),
      workedFrom(PR, SUM),
      calc(
        "Your turn",
        "Find P(lose).",
        table(["Result", "Win", "Draw", "Lose"], [["P", "0.5", "0.25", "?"]]),
        [
          ["Known total:", "0.75", "Add them."],
          ["P(lose) =", "0.25", "Take from 1."],
        ],
        "P(lose) = 0.25.",
      ),

      calc(
        "Practise",
        "Green and yellow are equally likely. Find x.",
        table(["Colour", "Red", "Blue", "Green", "Yellow"], [["P", "0.4", "0.2", "x", "x"]]),
        [
          ["$2x =$", "0.4", "1 − what you know."],
          ["$x =$", "0.2", "Halve it."],
        ],
        "$x = 0.2$.",
      ),
      ...owned(PR, SUM, "Together", "Practise"),
      ...owned(PR, SUM, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find x. Watch what changes.",
        [
          ask("0.3, 0.5, $x$", "0.2", "1 − 0.8.", "0.2.", { asks: "x" }),
          ask("0.3, 0.5, $x$, $x$", "0.1", "0.2 ÷ 2.", "0.1.", {
            asks: "x",
            changed: "Two equal.",
          }),
          ask("0.3, $x$, $x$", "0.35", "0.7 ÷ 2.", "0.35.", { asks: "x", changed: "One known." }),
          ask("0.4, $x$, $2x$", "0.2", "3x = 0.6.", "0.2.", {
            asks: "x",
            changed: "One is double.",
          }),
        ],
        "What's left, shared fairly.",
      ),

      questionSet(
        "Variation",
        "Find x. Watch what changes.",
        [
          ask("Red 0.3, blue $x$, green $x$", "0.35", "2x = 0.7.", "0.35.", {
            asks: "x",
            expect: [
              "From $2x = 0.7$, Ben says $x = 1.4$. Right?",
              "No",
              "Divide by 2: $x = 0.35$. No probability is over 1.",
              [["Yes", "Can a probability be 1.4?"]],
            ],
          }),
          ask("Red 0.1, blue $x$, green $2x$", "0.3", "3x = 0.9.", "0.3.", {
            asks: "x",
            changed: "One is double.",
          }),
          ask("Red 0.1, blue, green, yellow all $x$", "0.3", "3x = 0.9.", "0.3.", {
            asks: "x",
            changed: "Three equal.",
          }),
          ask("Four colours, all $x$", "0.25", "4x = 1.", "0.25.", {
            asks: "x",
            changed: "All equal.",
          }),
        ],
        "Divide to share; a probability is never over 1.",
      ),
      own(PR, SUM, "Spot the mistake"),

      own(PR, SUM, "Exit check"),

      reworded(
        PR,
        SUM,
        "“Work out P(green).”",
        { tag: "Real life", title: "Red 0.2, blue 0.35; green and yellow equal. P(green)?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Probabilities of all the outcomes add to 1.**"],
        LEFT,
        [
          "**Probabilities of all the outcomes add to 1.**",
          "P(not A) = 1 − P(A).",
          "$2x = 0.7$ gives $x = 0.35$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Bigger samples.

const LARGE = "gf-probability-1/large-samples";
const largeMethod = [
  "Few trials: results vary by chance.",
  "Many trials: the estimate settles down.",
  "Judge bias only from a large sample.",
];
const SETTLE = table(
  ["Flips", "Heads", "Rel. freq."],
  [
    ["10", "7", "0.7"],
    ["100", "56", "0.56"],
    ["1000", "509", "0.509"],
  ],
);

const large = stepped(find(PR, LARGE), {
  method: largeMethod,
  variation: {
    relationship: "more trials give a better estimate",
    unknowns: ["reliable", "judgement"],
    surface: ["few trials", "many trials", "the next flip"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The law of large numbers",
        ["**More trials: the relative frequency gets closer to the true probability.**"],
        SETTLE,
        "It settles towards 0.5.",
      ),
      reworded(PR, LARGE, "Spin it lots", { tag: "The rule" }),

      ...owned(PR, LARGE, "Warm-up", "Check you remember"),

      methodCard("The method", largeMethod, SETTLE),
      workedFrom(PR, LARGE),
      calc(
        "Your turn",
        "A dice: 205 sixes in 1200 rolls.",
        undefined,
        [
          ["Relative frequency, 2 d.p.:", "0.17", "205 ÷ 1200."],
          ["$\\frac16$ to 2 d.p.:", "0.17", "1 ÷ 6."],
        ],
        "Close to ⅙ after many rolls: it looks fair.",
      ),

      calc(
        "Practise",
        "380 reds in 1000 spins; red is 1 of 4 parts.",
        undefined,
        [
          ["Relative frequency:", "0.38", "380 ÷ 1000."],
          ["Fair P(red):", "0.25", "1 of 4 parts."],
        ],
        "Far from 0.25 after 1000 spins: likely biased.",
      ),
      ...owned(PR, LARGE, "Together", "Practise"),
      ...owned(PR, LARGE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which is more reliable? Watch what changes.",
        [
          pick(
            "10 flips or 1000 flips?",
            "1000 flips",
            ["10 flips", "Both the same"],
            "More trials.",
            {
              asks: "reliable",
            },
          ),
          pick(
            "50 rolls or 500 rolls?",
            "500 rolls",
            ["50 rolls", "Both the same"],
            "More trials.",
            {
              asks: "reliable",
              changed: "Rolls.",
            },
          ),
          pick(
            "200 spins or 20 spins?",
            "200 spins",
            ["20 spins", "Both the same"],
            "More trials.",
            {
              asks: "reliable",
              changed: "Order swapped.",
            },
          ),
          pick(
            "Six 6s in 10 rolls. Biased?",
            "Can't tell: too few",
            ["Yes", "No"],
            "Only 10 rolls.",
            {
              asks: "judgement",
              changed: "A judgement.",
            },
          ),
        ],
        "The bigger the sample, the better the estimate.",
      ),

      questionSet(
        "Variation",
        "Biased? Watch what changes.",
        [
          pick(
            "5 heads in 6 flips",
            "Can't tell: too few",
            ["Biased", "Looks fair"],
            "Only 6 flips.",
            {
              asks: "judgement",
              expect: [
                "After 5 heads in 6 flips, Kit says biased. Right?",
                "No",
                "6 flips is too few to tell.",
                [["Yes", "Could a fair coin do this?"]],
              ],
            },
          ),
          pick(
            "500 heads in 600 flips",
            "Biased",
            ["Can't tell: too few", "Looks fair"],
            "Far from half.",
            {
              asks: "judgement",
              changed: "Many more flips.",
            },
          ),
          pick(
            "305 heads in 600 flips",
            "Looks fair",
            ["Biased", "Can't tell: too few"],
            "Close to half.",
            {
              asks: "judgement",
              changed: "Close to half.",
            },
          ),
          pick(
            "After 5 heads, is tails more likely?",
            "No: still 0.5",
            ["Yes: it's due"],
            "Each flip is independent.",
            {
              asks: "judgement",
              changed: "The next flip.",
            },
          ),
        ],
        "Judge from many trials, not a few.",
      ),
      own(PR, LARGE, "Spot the mistake"),

      own(PR, LARGE, "Exit check"),

      reworded(
        PR,
        LARGE,
        "“Amir: three 6s in 12 rolls. Bea: 104 in 600. Whose estimate is more reliable? Give a reason.”",
        { tag: "Real life", title: "Amir: 3 sixes in 12. Bea: 104 in 600. More reliable?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**More trials: the relative frequency gets closer to the true probability.**"],
        SETTLE,
        [
          "**More trials: the relative frequency gets closer to the true probability.**",
          "A few trials can mislead.",
          "Tails is never “due”.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Sample space grids.

const SPACE = "gf-probability-1/sample-space";
const spaceMethod = [
  "One event across, one down.",
  "Fill every square.",
  "Count the squares you want, over the total.",
];
const die = ["1", "2", "3", "4", "5", "6"];
const COIN_DIE: Picture = {
  kind: "grid",
  cols: 6,
  rows: 2,
  shaded: 0,
  colLabels: die,
  rowLabels: ["H", "T"],
  values: [...die.map((d) => `${d}H`), ...die.map((d) => `${d}T`)],
};

const sampleSpace = stepped(find(PR, SPACE), {
  method: spaceMethod,
  variation: {
    relationship: "probability = squares you want ÷ all squares",
    unknowns: ["probability"],
    surface: ["bigger totals", "small totals", "other events"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A sample space grid",
        ["**List every outcome in a grid. P = squares you want ÷ all squares.**"],
        dice,
        "All 36 squares are equally likely.",
      ),

      ...owned(PR, SPACE, "Warm-up", "Check you remember"),

      methodCard("The method", spaceMethod, dice),
      workedFrom(PR, SPACE),
      calc(
        "Your turn",
        "Two dice. P(total of 9)?",
        dice,
        [
          ["Squares with 9:", "4", "3+6, 4+5, 5+4, 6+3."],
          ["Out of:", "36", "Every square."],
        ],
        "$\\frac{4}{36} = \\frac19$.",
      ),

      calc(
        "Practise",
        "A coin and a dice. P(head and even)?",
        COIN_DIE,
        [
          ["Squares:", "3", "2H, 4H, 6H."],
          ["Out of:", "12", "Every square."],
        ],
        "$\\frac{3}{12} = \\frac14$.",
      ),
      ...owned(PR, SPACE, "Together", "Practise"),
      ...owned(PR, SPACE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Two dice. Watch what changes.",
        [
          pick(
            "P(total of 10)?",
            "$\\frac{3}{36}$",
            ["$\\frac{1}{11}$", "$\\frac{10}{36}$"],
            "Count the 10s.",
            {
              asks: "probability",
              picture: dice,
            },
          ),
          pick(
            "P(total of 11)?",
            "$\\frac{2}{36}$",
            ["$\\frac{1}{11}$", "$\\frac{11}{36}$"],
            "Count the 11s.",
            {
              asks: "probability",
              changed: "One more.",
              picture: dice,
            },
          ),
          pick(
            "P(total of 12)?",
            "$\\frac{1}{36}$",
            ["$\\frac{2}{36}$", "$\\frac{12}{36}$"],
            "Only 6 + 6.",
            {
              asks: "probability",
              changed: "The top total.",
              picture: dice,
            },
          ),
          pick("P(total of 13)?", "0", ["$\\frac{1}{36}$", "$\\frac{13}{36}$"], "There are none.", {
            asks: "probability",
            changed: "Impossible.",
            picture: dice,
          }),
        ],
        "Count squares; don't count totals.",
      ),

      questionSet(
        "Variation",
        "Two dice. Watch what changes.",
        [
          pick(
            "P(total of 5)?",
            "$\\frac{4}{36}$",
            ["$\\frac{2}{36}$", "$\\frac{1}{11}$"],
            "1+4, 2+3, 3+2, 4+1.",
            {
              asks: "probability",
              picture: dice,
              expect: [
                "Total 5: Raj counts 1+4 and 2+3 only. Right?",
                "No",
                "4+1 and 3+2 count too: 4 squares.",
                [["Yes", "Is 4+1 a different square from 1+4?"]],
              ],
            },
          ),
          pick(
            "P(total of 3)?",
            "$\\frac{2}{36}$",
            ["$\\frac{1}{36}$", "$\\frac{3}{36}$"],
            "1+2, 2+1.",
            {
              asks: "probability",
              changed: "A smaller total.",
              picture: dice,
            },
          ),
          pick(
            "P(total under 4)?",
            "$\\frac{3}{36}$",
            ["$\\frac{2}{36}$", "$\\frac{4}{36}$"],
            "Totals 2 and 3.",
            {
              asks: "probability",
              changed: "Under.",
              picture: dice,
            },
          ),
          pick(
            "P(both even)?",
            "$\\frac{9}{36}$",
            ["$\\frac{6}{36}$", "$\\frac{18}{36}$"],
            "3 × 3 squares.",
            {
              asks: "probability",
              changed: "A different event.",
              picture: dice,
            },
          ),
        ],
        "Each order is its own square.",
      ),
      own(PR, SPACE, "Spot the mistake"),

      own(PR, SPACE, "Exit check"),

      reworded(
        PR,
        SPACE,
        "“Two fair dice are rolled. Work out the probability of a total of 8.”",
        { tag: "Real life", title: "Two fair dice. Probability of a total of 8?", picture: dice },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**List every outcome in a grid. P = squares you want ÷ all squares.**"],
        dice,
        [
          "**List every outcome in a grid. P = squares you want ÷ all squares.**",
          "Totals aren't equally likely: count squares.",
          "1+3 and 3+1 are different squares.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

export const gfProbability1Stepped: [string, UnitLesson[]][] = [
  [TREES, [frequencyTrees]],
  [EXPECTED, [expected]],
  [RELATIVE, [relative]],
  [SUM, [sumToOne]],
  [LARGE, [large]],
  [SPACE, [sampleSpace]],
];
