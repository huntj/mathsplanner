// GCSE Foundation, "Probability 2", on the stepped template (docs/proposals/lesson-stepped.md):
// Venn diagrams and set notation, probability trees, sample spaces, independent events and
// dependent events. Venn diagrams, trees and grids carry the numbers; the words say what to find.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import {
  busTree,
  coinTree,
  gfProbability2,
  probabilityTree,
  spinnerDice,
  sports,
  sweetTree,
} from "./gf-probability-2.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const PR = gfProbability2;
const NUMBER = "A probability fact: the numbers are the picture.";
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Venn diagrams and set notation.

const VENN = "gf-probability-2/venn";
const vennMethod = [
  "∩: the overlap. ∪: anywhere in either circle.",
  "A′: everything outside A.",
  "Probability: count ÷ the total of every region.",
];
const PETS: Picture = {
  kind: "venn",
  a: "Cat",
  b: "Dog",
  onlyA: ["6"],
  both: ["4"],
  onlyB: ["7"],
  neither: ["3"],
};
const region = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Which regions does it cover?", {
    asks: "count",
    picture: PETS,
    ...extra,
  });
const chance = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Count ÷ 20, the whole total.", {
    asks: "probability",
    picture: PETS,
    ...extra,
  });

const venn = stepped(find(PR, VENN), {
  method: vennMethod,
  variation: {
    relationship: "regions of a Venn diagram",
    unknowns: ["count", "probability"],
    surface: ["or, not and", "not in A", "one circle only"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The symbols",
        ["**A ∩ B: in both. A ∪ B: in either, or both. A′: not in A.**"],
        sports,
        "A circle's total includes its share of the overlap.",
      ),
      reworded(PR, VENN, "Football ∪ Tennis contains", { tag: "The rule" }),

      ...owned(PR, VENN, "Warm-up", "Check you remember"),

      methodCard("The method", vennMethod, sports),
      workedFrom(PR, VENN),
      calc(
        "Your turn",
        "Pets owned by a class.",
        PETS,
        [
          ["Total in the class:", "20", "Add every region."],
          ["n(Cat):", "10", "The whole cat circle."],
        ],
        "P(cat) = $\\frac{10}{20} = \\frac12$.",
      ),

      calc(
        "Practise",
        "Pets owned by a class.",
        PETS,
        [
          ["n(Cat ∪ Dog):", "17", "Everything in a circle."],
          ["n((Cat ∪ Dog)′):", "3", "Outside both."],
        ],
        "17 own a pet; 3 don't.",
      ),
      ...owned(PR, VENN, "Together", "Practise"),
      ...owned(PR, VENN, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "How many? Watch what changes.",
        [
          region("n(Cat ∩ Dog)", "4", ["10", "17"]),
          region("n(Cat ∪ Dog)", "17", ["4", "21"], { changed: "Or, not and." }),
          region("n(Dog)", "11", ["7", "17"], { changed: "One whole circle." }),
          region("n(Dog′)", "9", ["13", "3"], { changed: "Not dog." }),
        ],
        "A circle includes the overlap.",
      ),

      questionSet(
        "Variation",
        "Find the probability. Watch what changes.",
        [
          chance("P(Cat ∪ Dog)", "$\\frac{17}{20}$", ["$\\frac{21}{20}$", "$\\frac{4}{20}$"], {
            expect: [
              "Ben adds n(Football) + n(Tennis) = 17 + 13 for Football ∪ Tennis. Right?",
              "No",
              "The overlap is counted twice: $12 + 5 + 8 = 25$.",
              [["Yes", "Did he count the overlap once or twice?"]],
            ],
          }),
          chance("P(Cat ∩ Dog)", "$\\frac{4}{20}$", ["$\\frac{17}{20}$", "$\\frac{4}{17}$"], {
            changed: "And, not or.",
          }),
          chance("P(Cat′)", "$\\frac{10}{20}$", ["$\\frac{3}{20}$", "$\\frac{7}{20}$"], {
            changed: "Not cat.",
          }),
          chance("P(Dog ∩ Cat′)", "$\\frac{7}{20}$", ["$\\frac{11}{20}$", "$\\frac{4}{20}$"], {
            changed: "Dog only.",
          }),
        ],
        "Count the regions, then ÷ the total.",
      ),
      own(PR, VENN, "Spot the mistake"),

      own(PR, VENN, "Exit check"),

      reworded(
        PR,
        VENN,
        "“Find P(Football ∩ Tennis).” Simplified.",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A ∩ B: in both. A ∪ B: in either, or both. A′: not in A.**"],
        sports,
        [
          "**A ∩ B: in both. A ∪ B: in either, or both. A′: not in A.**",
          "Count the overlap once.",
          "Probability: count ÷ the whole total.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Probability trees.

const TREES = "gf-probability-2/trees";
const treeMethod = [
  "Branches from one point add to 1.",
  "Multiply along a path.",
  "Add the paths you want.",
];
const RAIN = probabilityTree(
  [
    ["0.2", "Rain"],
    ["0.8", "Dry"],
  ],
  [
    ["0.2", "Rain"],
    ["0.8", "Dry"],
    ["0.2", "Rain"],
    ["0.8", "Dry"],
  ],
);
const path = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Multiply along; add between paths.", {
    asks: "path",
    picture: RAIN,
    ...extra,
  });

const trees = stepped(find(PR, TREES), {
  method: treeMethod,
  variation: {
    relationship: "paths along a tree",
    unknowns: ["path", "late"],
    surface: ["two paths", "at least one", "the other order"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Along, then add",
        ["**Multiply along the branches. Add the paths you want.**"],
        coinTree,
        "Branches from one point always add to 1.",
      ),
      reworded(PR, TREES, "Two coins: P(H then H)", { tag: "The rule" }),

      ...owned(PR, TREES, "Warm-up", "Check you remember"),

      methodCard("The method", treeMethod, coinTree),
      workedFrom(PR, TREES),
      calc(
        "Your turn",
        "Two days. Use the tree.",
        RAIN,
        [
          ["P(rain, rain):", "0.04", "Multiply along."],
          ["P(dry, dry):", "0.64", "Multiply along."],
        ],
        "0.04 and 0.64.",
      ),

      calc(
        "Practise",
        "Two days. Use the tree.",
        RAIN,
        [
          ["P(rain, dry):", "0.16", "Multiply along."],
          ["P(exactly one rainy day):", "0.32", "Two paths: add."],
        ],
        "0.32.",
      ),
      ...owned(PR, TREES, "Together", "Practise"),
      ...owned(PR, TREES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Use the tree. Watch what changes.",
        [
          path("P(rain, rain)", "0.04", ["0.4", "0.2"]),
          path("P(rain, dry)", "0.16", ["1", "0.32"], { changed: "One of each." }),
          path("P(exactly one rainy day)", "0.32", ["0.16", "1"], { changed: "Two paths." }),
          path("P(at least one rainy day)", "0.36", ["0.32", "0.4"], {
            changed: "At least one.",
          }),
        ],
        "At least one: 1 − P(none).",
      ),

      questionSet(
        "Variation",
        "Use the bus tree. Watch what changes.",
        [
          pick("P(late, then on time)", "0.21", ["1", "0.42"], "Multiply along.", {
            asks: "late",
            picture: busTree,
            expect: [
              "Kim stops at one path for P(late on exactly one day). Right?",
              "No",
              "Two paths give exactly one late day: add them.",
              [["Yes", "Could the late day be the second?"]],
            ],
          }),
          pick("P(on time, then late)", "0.21", ["0.49", "0.09"], "Multiply along.", {
            asks: "late",
            picture: busTree,
            changed: "The other order.",
          }),
          pick("P(late on exactly one day)", "0.42", ["0.21", "1"], "Add the two paths.", {
            asks: "late",
            picture: busTree,
            changed: "Both orders.",
          }),
          pick("P(late on at least one day)", "0.51", ["0.42", "0.6"], "1 − P(never late).", {
            asks: "late",
            picture: busTree,
            changed: "At least one.",
          }),
        ],
        "Find every path that fits, then add.",
      ),
      own(PR, TREES, "Spot the mistake"),

      own(PR, TREES, "Exit check"),

      reworded(
        PR,
        TREES,
        "“Find the probability it is late on exactly one day.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply along the branches. Add the paths you want.**"],
        coinTree,
        [
          "**Multiply along the branches. Add the paths you want.**",
          "Branches from a point add to 1.",
          "At least one: 1 − P(none).",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Sample spaces.

const SPACE = "gf-probability-2/sample-spaces";
const spaceMethod = [
  "Draw a grid: one event across, one down.",
  "Count every outcome.",
  "P = outcomes you want ÷ all outcomes.",
];
const COINS: Picture = {
  kind: "grid",
  cols: 6,
  rows: 2,
  shaded: 0,
  colLabels: ["1", "2", "3", "4", "5", "6"],
  rowLabels: ["H", "T"],
  values: ["H1", "H2", "H3", "H4", "H5", "H6", "T1", "T2", "T3", "T4", "T5", "T6"],
};
const outcome = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Count the cells, out of 12.", {
    asks: "probability",
    picture: COINS,
    ...extra,
  });

const sampleSpaces = stepped(find(PR, SPACE), {
  method: spaceMethod,
  variation: {
    relationship: "equally likely outcomes in a grid",
    unknowns: ["count", "probability"],
    surface: ["more sides", "one row only", "or, not and"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "All the outcomes",
        ["**List every equally likely outcome, then count the ones you want.**"],
        spinnerDice,
        "3 letters × 6 numbers = 18 outcomes.",
      ),
      reworded(PR, SPACE, "How many outcomes for two coins?", { tag: "The rule" }),

      ...owned(PR, SPACE, "Warm-up", "Check you remember"),

      methodCard("The method", spaceMethod, spinnerDice),
      workedFrom(PR, SPACE),
      calc(
        "Your turn",
        "A coin and a dice.",
        COINS,
        [
          ["Outcomes:", "12", "2 × 6."],
          ["Heads and odd:", "3", "H1, H3, H5."],
        ],
        "P = $\\frac{3}{12} = \\frac14$.",
      ),

      calc(
        "Practise",
        "Use the spinner and dice grid.",
        spinnerDice,
        [
          ["C and a number over 4:", "2", "C5, C6."],
          ["Out of:", "18", "Every cell."],
        ],
        "P = $\\frac{2}{18} = \\frac19$.",
      ),
      ...owned(PR, SPACE, "Together", "Practise"),
      ...owned(PR, SPACE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "How many outcomes? Watch what changes.",
        [
          pick("A coin and a dice", "12", ["8", "6"], "2 × 6.", { asks: "count" }),
          pick("A coin and a spinner with 4 sides", "8", ["6", "4"], "2 × 4.", {
            asks: "count",
            changed: "Fewer sides.",
          }),
          pick("Two dice", "36", ["12", "11"], "6 × 6.", { asks: "count", changed: "Two dice." }),
          pick("Three coins", "8", ["6", "3"], "2 × 2 × 2.", {
            asks: "count",
            changed: "Three things.",
          }),
        ],
        "Multiply the outcomes of each.",
      ),

      questionSet(
        "Variation",
        "Coin and dice. Watch what changes.",
        [
          outcome("P(H and 6)", "$\\frac{1}{12}$", ["$\\frac{1}{8}$", "$\\frac{1}{6}$"], {
            expect: [
              "A coin and a spinner (1, 2, 3). Zoe lists 5 outcomes. Right?",
              "No",
              "Each side of the coin goes with every number: 2 × 3 = 6.",
              [["Yes", "Did she pair T with 3?"]],
            ],
          }),
          outcome("P(H and even)", "$\\frac{3}{12}$", ["$\\frac{1}{12}$", "$\\frac{3}{6}$"], {
            changed: "Any even number.",
          }),
          outcome("P(tails)", "$\\frac{6}{12}$", ["$\\frac{1}{12}$", "$\\frac{2}{12}$"], {
            changed: "A whole row.",
          }),
          outcome("P(H or a 6)", "$\\frac{7}{12}$", ["$\\frac{8}{12}$", "$\\frac{6}{12}$"], {
            changed: "Or, not and.",
          }),
        ],
        "Count each cell once.",
      ),
      own(PR, SPACE, "Spot the mistake"),

      own(PR, SPACE, "Exit check"),

      reworded(
        PR,
        SPACE,
        "“Find the probability of getting B and an even number.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**List every equally likely outcome, then count the ones you want.**"],
        spinnerDice,
        [
          "**List every equally likely outcome, then count the ones you want.**",
          "Outcomes multiply: 2 × 6 = 12.",
          "Totals of two dice aren't equally likely.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Independent events.

const IND = "gf-probability-2/independent";
const indMethod = [
  "Check one doesn't affect the other.",
  "P(A and B) = P(A) × P(B).",
  "At least one: 1 − P(none).",
];
const SHOTS = probabilityTree(
  [
    ["0.8", "Score"],
    ["0.2", "Miss"],
  ],
  [
    ["0.8", "Score"],
    ["0.2", "Miss"],
    ["0.8", "Score"],
    ["0.2", "Miss"],
  ],
);
const both = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Multiply the probabilities.", { asks: "and", ...extra });

const independent = stepped(find(PR, IND), {
  method: indMethod,
  variation: {
    relationship: "independent probabilities multiplied",
    unknowns: ["and", "least"],
    surface: ["three times", "a miss", "at least one"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Not affecting each other",
        ["**For independent events, P(A and B) = P(A) × P(B).**"],
        SHOTS,
        "One shot doesn't change the next.",
      ),
      reworded(PR, IND, "Which are independent?", { tag: "The rule" }),

      ...owned(PR, IND, "Warm-up", "Check you remember"),

      methodCard("The method", indMethod, SHOTS),
      workedFrom(PR, IND),
      calc(
        "Your turn",
        "P(red light) = 0.3. Two lights, independent.",
        undefined,
        [
          ["P(both red):", "0.09", "0.3 × 0.3."],
          ["P(neither red):", "0.49", "0.7 × 0.7."],
        ],
        "0.09 and 0.49.",
      ),

      calc(
        "Practise",
        "P(red light) = 0.3. Two lights.",
        undefined,
        [["P(at least one red):", "0.51", "1 − 0.49."]],
        "0.51.",
      ),
      ...owned(PR, IND, "Together", "Practise"),
      ...owned(PR, IND, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "P(score) = 0.8. Watch what changes.",
        [
          both("P(score twice)", "0.64", ["1.6", "0.8"]),
          both("P(score three times)", "0.512", ["2.4", "0.64"], { changed: "Three shots." }),
          both("P(miss twice)", "0.04", ["0.4", "0.64"], { changed: "Misses." }),
          both("P(score, then miss)", "0.16", ["1", "0.32"], { changed: "One of each." }),
        ],
        "Multiply, never add, for “and”.",
      ),

      questionSet(
        "Variation",
        "At least one. Watch what changes.",
        [
          pick("P(score) = 0.8, two shots", "0.96", ["1.6", "0.64"], "1 − 0.2 × 0.2.", {
            asks: "least",
            expect: [
              "Kim works out P(score both) as $0.8 + 0.8 = 1.6$. Right?",
              "No",
              "Multiply for “and”: $0.8 \\times 0.8 = 0.64$.",
              [["Yes", "Can a probability be more than 1?"]],
            ],
          }),
          pick("P(score) = 0.8, three shots", "0.992", ["0.96", "2.4"], "1 − 0.2³.", {
            asks: "least",
            changed: "Three shots.",
          }),
          pick("P(score) = 0.5, two shots", "0.75", ["1", "0.25"], "1 − 0.5 × 0.5.", {
            asks: "least",
            changed: "A weaker player.",
          }),
          pick("P(score) = 0.5, three shots", "0.875", ["1.5", "0.125"], "1 − 0.5³.", {
            asks: "least",
            changed: "Three shots.",
          }),
        ],
        "At least one: 1 − P(miss every time).",
      ),
      own(PR, IND, "Spot the mistake"),

      own(PR, IND, "Exit check"),

      reworded(
        PR,
        IND,
        "“Find the probability she scores all three.”",
        { tag: "Real life", title: "Ana scores 80% of penalties. P(she scores all three)?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**For independent events, P(A and B) = P(A) × P(B).**"],
        SHOTS,
        [
          "**For independent events, P(A and B) = P(A) × P(B).**",
          "At least one: 1 − P(none).",
          "Coins have no memory.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Dependent events.

const DEP = "gf-probability-2/dependent";
const depMethod = [
  "First pick: count ÷ total.",
  "Second pick: one fewer in total, and of that colour.",
  "Multiply along; add the paths you want.",
];
const take = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "One fewer after each pick.", { asks: "both", ...extra });

const dependent = stepped(find(PR, DEP), {
  method: depMethod,
  variation: {
    relationship: "probabilities that change after a pick",
    unknowns: ["second", "both"],
    surface: ["a different first colour", "both green", "one of each"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "One fewer each time",
        ["**Without replacement, the second pick has one fewer in the bag.**"],
        sweetTree,
        "The second branches depend on the first pick.",
      ),
      reworded(PR, DEP, "After a red is eaten, P(red next)", { tag: "The rule" }),

      ...owned(PR, DEP, "Warm-up", "Check you remember"),

      methodCard("The method", depMethod, sweetTree),
      workedFrom(PR, DEP),
      calc(
        "Your turn",
        "4 red, 6 blue. Take two, no replacing.",
        undefined,
        [
          ["Reds left for the second pick:", "3", "One red is gone."],
          ["Sweets left:", "9", "One fewer in the bag."],
        ],
        "P(red, red) $= \\frac{4}{10} \\times \\frac39 = \\frac{2}{15}$.",
      ),

      calc(
        "Practise",
        "4 red, 6 blue. Take two, no replacing.",
        undefined,
        [
          ["Blues left after a blue:", "5", "One blue is gone."],
          ["P(blue, blue), as a fraction of 90:", "30", "6 × 5 out of 10 × 9."],
        ],
        "$\\frac{30}{90} = \\frac13$.",
      ),
      ...owned(PR, DEP, "Together", "Practise"),
      reworded(PR, DEP, "4 blue, 1 yellow, no replacement. P(blue, blue), simplified", {
        tag: "Practise",
      }),
      reworded(PR, DEP, "A card is taken from a pack and not replaced. The second draw is", {
        tag: "Practise",
        title: "A card is taken and not replaced. The second draw is",
      }),
      questionSet(
        "Practise",
        "3 red, 2 green. Second pick? Watch what changes.",
        [
          pick("After a red: P(red)", "$\\frac24$", ["$\\frac35$", "$\\frac34$"], "2 red of 4.", {
            asks: "second",
          }),
          pick(
            "After a red: P(green)",
            "$\\frac24$",
            ["$\\frac25$", "$\\frac14$"],
            "2 green of 4.",
            {
              asks: "second",
              changed: "Green next.",
            },
          ),
          pick("After a green: P(red)", "$\\frac34$", ["$\\frac35$", "$\\frac24$"], "3 red of 4.", {
            asks: "second",
            changed: "Green first.",
          }),
          pick(
            "After a green: P(green)",
            "$\\frac14$",
            ["$\\frac25$", "$\\frac24$"],
            "1 green of 4.",
            {
              asks: "second",
              changed: "Green again.",
            },
          ),
        ],
        "The colour taken loses one; so does the total.",
      ),

      questionSet(
        "Variation",
        "3 red, 2 green, no replacing. Watch what changes.",
        [
          take("P(red, red)", "$\\frac{6}{20}$", ["$\\frac{9}{25}$", "$\\frac{6}{25}$"], {
            expect: [
              "For two reds, Ivy uses $\\frac35 \\times \\frac35$. Right?",
              "No",
              "After one red, it's 2 out of 4: $\\frac35 \\times \\frac24$.",
              [["Yes", "Is the first sweet put back?"]],
            ],
          }),
          take("P(green, green)", "$\\frac{2}{20}$", ["$\\frac{4}{25}$", "$\\frac{4}{20}$"], {
            changed: "Both green.",
          }),
          take("P(red, green)", "$\\frac{6}{20}$", ["$\\frac{6}{25}$", "$\\frac{5}{20}$"], {
            changed: "One of each.",
          }),
          take(
            "P(one of each colour)",
            "$\\frac{12}{20}$",
            ["$\\frac{6}{20}$", "$\\frac{12}{25}$"],
            {
              changed: "Either order.",
            },
          ),
        ],
        "One fewer on the second pick.",
      ),
      own(PR, DEP, "Spot the mistake"),

      own(PR, DEP, "Exit check"),

      reworded(
        PR,
        DEP,
        "“Find the probability both are red.” Simplified.",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Without replacement, the second pick has one fewer in the bag.**"],
        sweetTree,
        [
          "**Without replacement, the second pick has one fewer in the bag.**",
          "$\\frac35 \\times \\frac24$, not $\\frac35 \\times \\frac35$.",
          "Add both orders for “one of each”.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfProbability2Stepped: [string, UnitLesson[]][] = [
  [VENN, [venn]],
  [TREES, [trees]],
  [SPACE, [sampleSpaces]],
  [IND, [independent]],
  [DEP, [dependent]],
];
