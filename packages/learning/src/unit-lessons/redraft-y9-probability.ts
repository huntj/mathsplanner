// Year 9, "Probability", on the stepped template (docs/proposals/lesson-stepped.md): listing
// outcomes, Venn diagrams, single events and two events at once. Sample spaces and Venn diagrams
// are drawn for the questions that read them; working out a probability is number work.
import { ask, calc, explain, methodCard, questionSet, quiz, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { GridPic, Picture, VennPic, UnitLesson } from "./types.ts";
import { y9Probability } from "./y9-probability.ts";

const P9 = y9Probability;
const NUMBER = "Counting outcomes: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const die = ["1", "2", "3", "4", "5", "6"];
/** Two dice: every total in its square. */
const DICE: GridPic = {
  kind: "grid",
  cols: 6,
  rows: 6,
  shaded: 0,
  colLabels: die,
  rowLabels: die,
  values: die.flatMap((r) => die.map((c) => String(Number(r) + Number(c)))),
};
/** A coin with a four-sided spinner. */
const COIN_SPIN: GridPic = {
  kind: "grid",
  cols: 4,
  rows: 2,
  shaded: 0,
  colLabels: ["1", "2", "3", "4"],
  rowLabels: ["H", "T"],
  values: ["1H", "2H", "3H", "4H", "1T", "2T", "3T", "4T"],
};
const frac = (...answers: string[]) => answers;

// ---------------------------------------------------------------------------------------------
// Listing every outcome.

const LIST = "y9-probability/listing";
const listMethod = [
  "Put one choice along the top, the other down the side.",
  "Fill every square: one outcome each.",
  "Count: along × down.",
];

const listing = stepped(find(P9, LIST), {
  method: listMethod,
  variation: {
    relationship: "a sample space: every outcome of two choices",
    unknowns: ["ways", "outcomes"],
    surface: ["more choices", "a third choice", "coins and spinners"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Listing every outcome",
        ["**List every outcome in a grid: along × down.**"],
        DICE,
        "Two dice: 6 × 6 = 36 outcomes, one in each square.",
      ),
      reworded(P9, LIST, "Two coins are flipped. How many outcomes are there?", {
        tag: "The rule",
      }),
      reworded(P9, LIST, "A sample space", { tag: "The rule" }),

      ...owned(P9, LIST, "Warm-up", "Check you remember"),

      methodCard("The method", listMethod, COIN_SPIN),
      workedFrom(P9, LIST),
      calc(
        "Your turn",
        "A coin and a four-sided spinner.",
        COIN_SPIN,
        [
          ["Along the top:", "4", "The spinner."],
          ["Down the side:", "2", "The coin."],
          ["Outcomes:", "8", "4 × 2."],
        ],
        "8 outcomes.",
      ),

      calc(
        "Practise",
        "Two dice. How many ways to total 8?",
        DICE,
        [["Squares showing 8:", "5", "Count them along the diagonal."]],
        "5 ways.",
      ),
      ...owned(P9, LIST, "Together", "Practise"),
      ...owned(P9, LIST, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Two dice. Watch what changes.",
        [
          ask("How many ways to total 7?", "6", "Count the 7s.", "6.", {
            asks: "ways",
            picture: DICE,
          }),
          ask("How many ways to total 12?", "1", "Only 6 and 6.", "1.", {
            asks: "ways",
            changed: "The biggest total.",
            picture: DICE,
          }),
          ask("How many ways to total 9?", "4", "Count the 9s.", "4.", {
            asks: "ways",
            changed: "Another total.",
            picture: DICE,
          }),
          ask("How many outcomes in all?", "36", "6 × 6.", "36.", {
            asks: "outcomes",
            changed: "All of them.",
            picture: DICE,
          }),
        ],
        "Every square is one outcome.",
      ),

      questionSet(
        "Variation",
        "How many different meals?",
        [
          ask("2 starters and 5 mains?", "10", "2 × 5.", "10.", {
            asks: "outcomes",
            expect: [
              "Lily adds 2 starters and 5 mains: 7 meals. Right?",
              "No",
              "Each starter goes with every main: 2 × 5 = 10.",
              [["Yes", "Draw the grid."]],
            ],
          }),
          ask("4 starters and 5 mains?", "20", "4 × 5.", "20.", {
            asks: "outcomes",
            changed: "More starters.",
          }),
          ask("4 starters, 5 mains, 2 desserts?", "40", "4 × 5 × 2.", "40.", {
            asks: "outcomes",
            changed: "A third course.",
          }),
          ask("A coin and a 10-sided spinner?", "20", "2 × 10.", "20.", {
            asks: "outcomes",
            changed: "A coin and a spinner.",
          }),
        ],
        "Multiply the choices; never add them.",
      ),
      own(P9, LIST, "Spot the mistake"),

      quiz([
        [
          ["A coin and a dice: how many outcomes?", "12", ["8", "2"], "2 × 6."],
          ["A coin and a 4-sided spinner: outcomes?", "8", ["6", "4"], "2 × 4."],
        ],
        [
          ["Two dice: how many ways to total 4?", "3", ["4", "1"], "(1, 3), (2, 2), (3, 1)."],
          ["Two dice: how many ways to total 10?", "3", ["4", "2"], "(4, 6), (5, 5), (6, 4)."],
        ],
        [
          ["3 starters and 5 mains: how many meals?", "15", ["8", "53"], "3 × 5."],
          ["4 starters and 3 mains: how many meals?", "12", ["7", "43"], "4 × 3."],
        ],
      ]),

      reworded(P9, LIST, "The meal deal", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**List every outcome in a grid: along × down.**"],
        DICE,
        [
          "**List every outcome in a grid: along × down.**",
          "Two dice: 36 outcomes.",
          "3 mains and 4 drinks: 12 deals, not 7.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Venn diagrams.

const VENN = "y9-probability/venn";
const vennMethod = [
  "Fill the overlap first: those in both.",
  "Take it away for 'A only' and 'B only'.",
  "The rest go outside: neither.",
];
const SORTED: VennPic = {
  kind: "venn",
  a: "Even",
  b: "×3",
  onlyA: ["2", "4", "8", "10"],
  both: ["6", "12"],
  onlyB: ["3", "9"],
  neither: ["1", "5", "7", "11"],
};

const venn = stepped(find(P9, VENN), {
  method: vennMethod,
  variation: {
    relationship: "a Venn diagram's regions: both, only one, neither",
    unknowns: ["region", "probability"],
    surface: ["only one", "either", "neither"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Venn diagrams",
        ["**Fill the overlap first, then each circle, then outside.**"],
        SORTED,
        "'A and B' is the overlap; 'neither' is outside both.",
      ),
      reworded(P9, VENN, "With numbers up to 12, where would 12 go?", { tag: "The rule" }),

      ...owned(P9, VENN, "Warm-up", "Check you remember"),

      methodCard("The method", vennMethod, SORTED),
      workedFrom(P9, VENN),
      calc(
        "Your turn",
        "25 pupils: 14 piano, 9 guitar, 3 both.",
        undefined,
        [
          ["Piano only: $14 - 3 =$", "11", "Take the overlap away."],
          ["Guitar only: $9 - 3 =$", "6", "Take the overlap away."],
          ["Neither: $25 - 11 - 6 - 3 =$", "5", "Whoever's left."],
        ],
        "11, 3, 6 and 5 outside.",
      ),

      calc(
        "Practise",
        "40 pupils: 22 swim, 15 run, 7 both.",
        undefined,
        [
          ["Swim only:", "15", "22 − 7."],
          ["Run only:", "8", "15 − 7."],
          ["Neither:", "10", "40 − 15 − 8 − 7."],
        ],
        "10 do neither.",
      ),
      ...owned(P9, VENN, "Together", "Practise"),
      reworded(P9, VENN, "Even and square", {
        tag: "Practise",
        text: "Picked from 1 to 10: P(even and square)?",
      }),
      reworded(P9, VENN, "Even or square", {
        tag: "Practise",
        text: "From 1 to 10: how many even or square?",
      }),
      questionSet(
        "Practise",
        "Numbers 1 to 12. Watch what changes.",
        [
          ask("How many are even and ×3?", "2", "The overlap.", "2: 6 and 12.", {
            asks: "region",
            picture: SORTED,
          }),
          ask("How many are even only?", "4", "A only.", "4.", {
            asks: "region",
            changed: "Only one circle.",
            picture: SORTED,
          }),
          ask("How many are in neither?", "4", "Outside.", "4.", {
            asks: "region",
            changed: "Outside.",
            picture: SORTED,
          }),
          ask(
            "P(even or ×3)?",
            "$\\frac{8}{12}$",
            "Everything inside a circle.",
            "$\\frac{8}{12}$.",
            {
              asks: "probability",
              changed: "A probability.",
              others: ["$\\frac{10}{12}$", "$\\frac{6}{12}$"],
              picture: SORTED,
            },
          ),
        ],
        "Read the region the question names.",
      ),

      questionSet(
        "Variation",
        "30 pupils: 16 have a cat, 10 a dog, 4 both.",
        [
          ask("How many have a cat only?", "12", "16 − 4.", "12.", {
            asks: "region",
            expect: [
              "Sam writes 16 in 'cat only'. Right?",
              "No",
              "Take the 4 in both: 16 − 4 = 12.",
              [["Yes", "The 4 are already in the overlap."]],
            ],
          }),
          ask("How many have a dog only?", "6", "10 − 4.", "6.", {
            asks: "region",
            changed: "The other circle.",
          }),
          ask("How many have a cat or a dog?", "22", "12 + 4 + 6.", "22.", {
            asks: "region",
            changed: "Either.",
          }),
          ask("How many have neither?", "8", "30 − 22.", "8.", {
            asks: "region",
            changed: "Outside.",
          }),
        ],
        "Overlap first; never count it twice.",
      ),
      own(P9, VENN, "Spot the mistake"),

      quiz([
        [
          [
            "Where does 10 go?",
            "In the overlap",
            ["In ×2 only", "Outside"],
            "Even and a multiple of 5.",
            {
              kind: "venn",
              a: "×2",
              b: "×5",
              onlyA: ["2", "4", "6", "8"],
              both: [],
              onlyB: ["5"],
              neither: ["1", "3", "7", "9"],
            },
          ],
          [
            "Where does 15 go?",
            "In the overlap",
            ["In ×3 only", "Outside"],
            "A multiple of 3 and of 5.",
            {
              kind: "venn",
              a: "×3",
              b: "×5",
              onlyA: ["3", "6", "9", "12"],
              both: [],
              onlyB: ["5", "10"],
              neither: ["1", "2", "4"],
            },
          ],
        ],
        [
          ["15 like apples, 9 pears, 4 both. Apples only?", "11", ["15", "19"], "15 − 4."],
          ["12 like tea, 8 coffee, 3 both. Tea only?", "9", ["12", "15"], "12 − 3."],
        ],
        [
          [
            "In a Venn diagram, 'A and B' means",
            "the overlap",
            ["outside both", "A only"],
            "In both circles.",
          ],
          [
            "'Neither A nor B' means",
            "outside both circles",
            ["the overlap", "B only"],
            "In neither circle.",
          ],
        ],
      ]),

      reworded(P9, VENN, "Sports clubs", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Fill the overlap first, then each circle, then outside.**"],
        SORTED,
        [
          "**Fill the overlap first, then each circle, then outside.**",
          "'A only' = A − both.",
          "'A or B' counts the overlap once.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// A single event.

const SINGLE = "y9-probability/single";
const singleMethod = [
  "Count all the equally likely outcomes.",
  "Count the ways it can happen.",
  "Probability = ways ÷ all.",
];
const RULE = maths("P = \\frac{\\text{ways it can happen}}{\\text{all the outcomes}}");

const single = stepped(find(P9, SINGLE), {
  method: singleMethod,
  variation: {
    relationship: "probability = ways ÷ all the equally likely outcomes",
    unknowns: ["probability"],
    surface: ["not", "certain", "impossible"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "How likely?",
        ["**Probability = ways it can happen ÷ all the outcomes.**"],
        RULE,
        "From 0, impossible, to 1, certain.",
      ),
      reworded(P9, SINGLE, "Probability", { tag: "The rule" }),
      reworded(P9, SINGLE, "Rolling a 7 on an ordinary dice is", { tag: "The rule" }),

      ...owned(P9, SINGLE, "Warm-up", "Check you remember"),

      methodCard("The method", singleMethod, RULE),
      workedFrom(P9, SINGLE),
      calc(
        "Your turn",
        "4 red, 5 blue, 1 green counter. P(blue)?",
        undefined,
        [
          ["All the counters:", "10", "4 + 5 + 1."],
          ["Blue ones:", "5", "The ways."],
        ],
        "P(blue) = $\\frac{5}{10} = \\frac12$.",
      ),

      calc(
        "Practise",
        "A dice. P(more than 4)?",
        undefined,
        [
          ["Ways: 5 or 6:", "2", "More than 4."],
          ["Out of", "6", "All the outcomes."],
        ],
        "$\\frac{2}{6} = \\frac13$.",
      ),
      ...owned(P9, SINGLE, "Together", "Practise"),
      reworded(P9, SINGLE, "P(even) on a dice", { tag: "Practise" }),
      reworded(P9, SINGLE, "A spinner", {
        tag: "Practise",
        text: "3 of 8 equal parts are red. P(not red)?",
      }),
      questionSet(
        "Practise",
        "2 red, 3 blue and 5 green counters.",
        [
          ask("P(red)?", frac("2/10", "1/5", "0.2"), "2 out of 10.", "$\\frac{2}{10}$.", {
            asks: "probability",
          }),
          ask("P(blue)?", frac("3/10", "0.3"), "3 out of 10.", "$\\frac{3}{10}$.", {
            asks: "probability",
            changed: "Blue.",
          }),
          ask("P(not green)?", frac("5/10", "1/2", "0.5"), "Red or blue.", "$\\frac{5}{10}$.", {
            asks: "probability",
            changed: "Not.",
          }),
          ask("P(yellow)?", "0", "None are yellow.", "0: impossible.", {
            asks: "probability",
            changed: "Impossible.",
          }),
        ],
        "Ways over all.",
      ),

      questionSet(
        "Variation",
        "Red, blue and green counters. P(blue)?",
        [
          ask("6 red, 3 blue, 1 green.", frac("3/10", "0.3"), "3 out of 10.", "$\\frac{3}{10}$.", {
            asks: "probability",
            expect: [
              "With 3 colours, is P(blue) always $\\frac13$?",
              "No",
              "Only with equal numbers: count the counters, not the colours.",
              [["Yes", "Count the counters."]],
            ],
          }),
          ask("2 red, 2 blue, 2 green.", frac("2/6", "1/3"), "Equal numbers.", "$\\frac13$.", {
            asks: "probability",
            changed: "Equal numbers.",
          }),
          ask("0 red, 10 blue, 0 green.", "1", "All blue.", "1: certain.", {
            asks: "probability",
            changed: "All blue.",
          }),
          ask("5 red, 0 blue, 5 green.", "0", "No blue.", "0: impossible.", {
            asks: "probability",
            changed: "No blue.",
          }),
        ],
        "Count the counters, not the colours.",
      ),
      own(P9, SINGLE, "Spot the mistake"),

      quiz([
        [
          [
            "4 red and 6 blue. P(red)?",
            "$\\frac{4}{10}$",
            ["$\\frac46$", "$\\frac{6}{10}$"],
            "4 out of 10.",
          ],
          [
            "3 red and 7 blue. P(red)?",
            "$\\frac{3}{10}$",
            ["$\\frac37$", "$\\frac{7}{10}$"],
            "3 out of 10.",
          ],
        ],
        [
          ["A dice: P(less than 3)?", "$\\frac26$", ["$\\frac36$", "$\\frac16$"], "1 or 2."],
          ["A dice: P(more than 2)?", "$\\frac46$", ["$\\frac26$", "$\\frac36$"], "3, 4, 5 or 6."],
        ],
        [
          ["P(rain) = 0.3. P(no rain)?", "0.7", ["0.3", "1.3"], "1 − 0.3."],
          ["P(late) = 0.1. P(not late)?", "0.9", ["0.1", "1.1"], "1 − 0.1."],
        ],
      ]),

      reworded(
        P9,
        SINGLE,
        "A bag of sweets",
        { tag: "Real life", text: "What's P(not lime), as a fraction?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Probability = ways it can happen ÷ all the outcomes.**"],
        RULE,
        [
          "**Probability = ways it can happen ÷ all the outcomes.**",
          "0 is impossible; 1 is certain.",
          "P(not A) = 1 − P(A).",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Two events at once.

const COMBINED = "y9-probability/combined";
const combinedMethod = [
  "Draw the sample space grid.",
  "Count the squares that fit.",
  "Divide by all the squares.",
];

const combined = stepped(find(P9, COMBINED), {
  method: combinedMethod,
  variation: {
    relationship: "two events: squares that fit ÷ all the squares",
    unknowns: ["probability", "ways"],
    surface: ["the biggest total", "at least one", "both odd"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two at once",
        ["**Two events: the squares that fit ÷ all the squares.**"],
        DICE,
        "Each of the 36 squares is equally likely.",
      ),
      reworded(P9, COMBINED, "Count in the sample space", { tag: "The rule" }),
      reworded(P9, COMBINED, "Shade every way to score 7", { tag: "The rule" }),

      ...owned(P9, COMBINED, "Warm-up", "Check you remember"),

      methodCard("The method", combinedMethod, DICE),
      workedFrom(P9, COMBINED),
      calc(
        "Your turn",
        "Two dice. P(a total of 5)?",
        DICE,
        [
          ["Squares showing 5:", "4", "Count them."],
          ["Out of", "36", "All the squares."],
        ],
        "$\\frac{4}{36} = \\frac19$.",
      ),

      calc(
        "Practise",
        "P(a head and an even number)?",
        COIN_SPIN,
        [
          ["Squares that fit:", "2", "2H and 4H."],
          ["Out of", "8", "All the squares."],
        ],
        "$\\frac{2}{8} = \\frac14$.",
      ),
      reworded(P9, COMBINED, "P(a double)", { tag: "Practise" }),
      reworded(P9, COMBINED, "A spinner and a coin", {
        tag: "Practise",
        start: "Spin 1, 2 or 3; flip a coin. P(odd and head)?",
      }),
      ...owned(P9, COMBINED, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Two dice. Watch what changes.",
        [
          ask("P(a total of 6)?", frac("5/36"), "Count the 6s.", "$\\frac{5}{36}$.", {
            asks: "probability",
            picture: DICE,
          }),
          ask("P(a total of 11)?", frac("2/36", "1/18"), "Count the 11s.", "$\\frac{2}{36}$.", {
            asks: "probability",
            changed: "A bigger total.",
            picture: DICE,
          }),
          ask("P(a total of 3)?", frac("2/36", "1/18"), "Count the 3s.", "$\\frac{2}{36}$.", {
            asks: "probability",
            changed: "A small total.",
            picture: DICE,
          }),
          ask("How many squares show 8?", "5", "Count them.", "5.", {
            asks: "ways",
            changed: "Just the ways.",
            picture: DICE,
          }),
        ],
        "Squares that fit, over 36.",
      ),

      questionSet(
        "Variation",
        "Two dice. Watch what changes.",
        [
          ask("P(a total of 7)?", frac("6/36", "1/6"), "Count the 7s.", "$\\frac{6}{36}$.", {
            asks: "probability",
            picture: DICE,
            expect: [
              "There are 11 totals. Is P(7) = $\\frac{1}{11}$?",
              "No",
              "36 equally likely squares; 6 show 7: $\\frac{6}{36}$.",
              [["Yes", "The totals aren't equally likely."]],
            ],
          }),
          ask("P(a total of 12)?", frac("1/36"), "Only 6 and 6.", "$\\frac{1}{36}$.", {
            asks: "probability",
            changed: "The biggest total.",
            picture: DICE,
          }),
          ask(
            "P(at least one 6)?",
            frac("11/36"),
            "Count the 6 row and column once.",
            "$\\frac{11}{36}$.",
            {
              asks: "probability",
              changed: "At least one.",
              picture: DICE,
            },
          ),
          ask("P(both odd)?", frac("9/36", "1/4"), "3 × 3 squares.", "$\\frac{9}{36}$.", {
            asks: "probability",
            changed: "Both odd.",
            picture: DICE,
          }),
        ],
        "Count squares, not totals.",
      ),
      own(P9, COMBINED, "Spot the mistake"),

      own(P9, COMBINED, "Exit check"),

      reworded(P9, COMBINED, "A dice game", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Two events: the squares that fit ÷ all the squares.**"],
        DICE,
        [
          "**Two events: the squares that fit ÷ all the squares.**",
          "Two dice: out of 36.",
          "P(7) is $\\frac{6}{36}$, not $\\frac{1}{11}$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

export const y9ProbabilityStepped: [string, UnitLesson[]][] = [
  [LIST, [listing]],
  [VENN, [venn]],
  [SINGLE, [single]],
  [COMBINED, [combined]],
];
