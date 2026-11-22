// Year 7, "Probability", on the stepped template (docs/proposals/lesson-stepped.md): the
// probability scale, experiments and relative frequency, and probabilities that add up to 1. The
// scale is a number line from 0 to 1; outcomes are set out in a table.
import { ask, calc, explain, methodCard, questionSet, summary, typed, worked } from "./build.ts";
import { find, numberLine, own, owned, reworded, stepped, words } from "./stepped.ts";
import type { Picture, Screen, UnitLesson } from "./types.ts";
import { y7Probability } from "./y7-probability.ts";

const WORDS = "A probability in words: the number is the picture.";
const list = y7Probability;

const maths = (tex: string): Picture => ({ kind: "maths", tex });
const scale = (marks: [number, string][] = []) => numberLine(0, 1, 0.1, marks, { every: 5 });
const outcomes = (head: string[], row: string[]): Picture => ({ kind: "table", head, rows: [row] });

/** A question with no picture is a probability in words: say so. */
const worded = (screens: Screen[]): Screen[] =>
  screens.map((s) =>
    [
      "answer",
      "choice",
      "calc",
      "set",
      "steps",
      "fill",
      "sort",
      "mistake",
      "quiz",
      "place",
    ].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture) &&
    s.kind !== "place"
      ? { ...s, wordsOnly: WORDS }
      : s,
  );

// ---------------------------------------------------------------------------------------------
// The probability scale.

const SCALE = "y7-probability/scale";
const scaleMethod = [
  "0 is impossible; 1 is certain.",
  "0.5 is an even chance.",
  "Nearer 1 is likely; nearer 0 is unlikely.",
];

const probabilityScale = stepped(find(list, SCALE), {
  method: scaleMethod,
  variation: {
    relationship: "a probability's number and its word on the scale",
    unknowns: ["word", "number"],
    surface: ["coins", "dice", "percentages", "numbers off the scale", "weather"],
  },
  screens: worded([
    explain(
      "The rule",
      "How likely?",
      ["**Probability goes from 0, impossible, to 1, certain.**"],
      scale([
        [0, "impossible"],
        [0.5, "even"],
        [1, "certain"],
      ]),
      "An even chance, like heads on a coin, is 0.5.",
    ),
    reworded(list, SCALE, "Place them on the scale", { tag: "The rule" }),

    ...owned(list, SCALE, "Warm-up", "Check you remember"),
    words(
      typed(
        "Check you remember",
        "Which is bigger: 0.8 or 0.3?",
        "0.8",
        "8 tenths beats 3.",
        "0.8.",
      ),
      WORDS,
    ),

    methodCard(
      "The method",
      scaleMethod,
      scale([
        [0, "0"],
        [0.5, "0.5"],
        [1, "1"],
      ]),
    ),
    worked(
      "Watch the method",
      "Describe a probability of 0.8, and one of 0.1.",
      [
        { line: "0.8 is close to 1: likely", note: "Nearer certain." },
        { line: "0.1 is close to 0: unlikely", note: "Nearer impossible." },
      ],
      "Likely, and unlikely.",
      scale([
        [0.1, "0.1"],
        [0.8, "0.8"],
      ]),
    ),
    calc(
      "Your turn",
      "Describe each probability in a word.",
      scale([
        [0.2, "0.2"],
        [0.9, "0.9"],
      ]),
      [
        ["0.9 is", "likely", "Close to 1."],
        ["0.2 is", "unlikely", "Close to 0."],
      ],
      "Likely and unlikely.",
    ),

    calc(
      "Practise",
      "Roll an ordinary dice, 1 to 6.",
      undefined,
      [
        ["P(rolling a 7) =", "0", "There's no 7: impossible."],
        ["P(rolling less than 7) =", "1", "Every number is: certain."],
      ],
      "0 and 1.",
    ),
    ...owned(list, SCALE, "Together", "Practise").filter((s) => s.kind === "sort"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Describe a probability of 0.2.", "unlikely", "Nearer 0.", "Unlikely.", {
          asks: "word",
          others: ["likely", "certain"],
        }),
        ask("Describe a probability of 0.5.", "an even chance", "Halfway.", "An even chance.", {
          asks: "word",
          changed: "Halfway along.",
          others: ["likely", "impossible"],
        }),
        ask("Which number means certain?", "1", "The top of the scale.", "1.", {
          asks: "number",
          changed: "Now the number.",
          others: ["0", "0.5"],
        }),
        ask("A fair coin lands heads. Its probability?", "0.5", "An even chance.", "0.5.", {
          asks: "number",
          changed: "A coin.",
          others: ["1", "0"],
        }),
      ],
      "Words and numbers: two ways to say how likely.",
    ),

    questionSet(
      "Variation",
      "Can it be a probability? Watch what changes.",
      [
        ask("Can 80 be a probability?", "No", "Probabilities go from 0 to 1.", "No: write 0.8.", {
          asks: "number",
          others: ["Yes"],
          expect: [
            "Raj writes the chance of rain as 80. What's wrong?",
            "It's off the scale",
            "Probabilities go from 0 to 1: write 0.8, or 80%.",
            [["Nothing", "80 is far past 1, certain."]],
          ],
        }),
        ask("Can 1.3 be a probability?", "No", "It's more than 1.", "No.", {
          asks: "number",
          changed: "Just past 1.",
          others: ["Yes"],
        }),
        ask("Can −0.2 be a probability?", "No", "It's less than 0.", "No.", {
          asks: "number",
          changed: "Below 0.",
          others: ["Yes"],
        }),
        ask("Can 80% be a probability?", "Yes", "80% is 0.8.", "Yes: 80% is 0.8.", {
          asks: "number",
          changed: "As a percentage.",
          others: ["No"],
        }),
      ],
      "Anything from 0 to 1, as a fraction, decimal or percentage.",
    ),
    own(list, SCALE, "Spot the mistake"),

    own(list, SCALE, "Exit check"),

    reworded(list, SCALE, "The weather forecast", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Probability goes from 0, impossible, to 1, certain.**"],
      scale([
        [0, "impossible"],
        [0.5, "even"],
        [1, "certain"],
      ]),
      [
        "**Probability goes from 0, impossible, to 1, certain.**",
        "0.5 is an even chance. Nearer 1: likely. Nearer 0: unlikely.",
        "Never more than 1 or less than 0.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Experiments.

const EXPERIMENTS = "y7-probability/experiments";
const experimentsMethod = [
  "Count the times it happened.",
  "Divide by the number of trials.",
  "To predict: probability × trials.",
];
const pins = outcomes(["Trials", "Point up"], ["50", "30"]);

const experiments = stepped(find(list, EXPERIMENTS), {
  method: experimentsMethod,
  variation: {
    relationship: "trials, results, relative frequency and expected numbers",
    unknowns: ["relative frequency", "expected"],
    surface: ["few trials", "many trials", "spinners", "dice", "drawing pins"],
  },
  screens: worded([
    explain(
      "The rule",
      "Experiments",
      ["**Relative frequency = times it happened ÷ trials.**"],
      pins,
      "More trials give a better estimate of the probability.",
    ),
    reworded(list, EXPERIMENTS, "Spin it lots", { tag: "The rule" }),

    ...owned(list, EXPERIMENTS, "Warm-up", "Check you remember"),
    words(
      typed(
        "Check you remember",
        "What is $\\frac{10}{40}$ as a decimal?",
        "0.25",
        "A quarter.",
        "0.25.",
      ),
      WORDS,
    ),

    methodCard("The method", experimentsMethod, maths("\\frac{30}{50} = 0.6")),
    worked(
      "Watch the method",
      "Estimate P(point up).",
      [{ line: "$\\frac{30}{50}$", note: "Times it happened over trials." }, { line: "$= 0.6$" }],
      "About 0.6.",
      pins,
    ),
    calc(
      "Your turn",
      "Estimate P(heads) for this coin.",
      outcomes(["Flips", "Heads"], ["200", "130"]),
      [["$130 \\div 200 =$", "0.65", "Heads over flips."]],
      "About 0.65: the coin may be biased.",
    ),

    calc(
      "Practise",
      "P(point up) is about 0.6. Drop it 500 times.",
      undefined,
      [["Expected: $0.6 \\times 500 =$", "300", "Probability times trials."]],
      "About 300 times.",
    ),
    ...owned(list, EXPERIMENTS, "Your turn", "Practise").filter((s) => s.kind === "choice"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Estimate P(success).", "0.25", "5 ÷ 20.", "0.25.", {
          asks: "relative frequency",
          picture: outcomes(["Trials", "Successes"], ["20", "5"]),
        }),
        ask("Estimate P(red).", "0.25", "10 ÷ 40.", "0.25.", {
          asks: "relative frequency",
          changed: "A spinner.",
          picture: outcomes(["Spins", "Red"], ["40", "10"]),
        }),
        ask("P(win) ≈ 0.3. About how many wins in 100 games?", "30", "0.3 × 100.", "About 30.", {
          asks: "expected",
          changed: "Now predict.",
        }),
        ask("P(win) ≈ 0.25. About how many wins in 200 games?", "50", "0.25 × 200.", "About 50.", {
          asks: "expected",
          changed: "More games.",
        }),
      ],
      "Divide to estimate; multiply to predict.",
    ),

    questionSet(
      "Variation",
      "Estimate P(heads). Watch what changes.",
      [
        ask("Estimate P(heads).", "0.75", "3 ÷ 4.", "0.75, but it's not reliable.", {
          asks: "relative frequency",
          picture: outcomes(["Flips", "Heads"], ["4", "3"]),
          expect: [
            "Ali flips 4 times. Is 0.75 reliable?",
            "No: too few trials",
            "4 flips is far too few to trust.",
            [["Yes", "Flip it 100 times and see."]],
          ],
        }),
        ask("Estimate P(heads).", "0.52", "52 ÷ 100.", "0.52.", {
          asks: "relative frequency",
          changed: "100 flips.",
          picture: outcomes(["Flips", "Heads"], ["100", "52"]),
        }),
        ask("Estimate P(heads).", "0.497", "497 ÷ 1000.", "0.497.", {
          asks: "relative frequency",
          changed: "1000 flips: closer to 0.5.",
          picture: outcomes(["Flips", "Heads"], ["1000", "497"]),
        }),
        ask("Estimate P(six).", "0.2", "10 ÷ 50.", "0.2.", {
          asks: "relative frequency",
          changed: "A dice.",
          picture: outcomes(["Rolls", "Sixes"], ["50", "10"]),
        }),
      ],
      "The more trials, the closer the estimate gets.",
    ),
    {
      ...own(list, EXPERIMENTS, "Spot the mistake"),
      text: "Ella estimates P(6).",
      picture: outcomes(["Rolls", "Sixes"], ["60", "12"]),
    } as Screen,

    own(list, EXPERIMENTS, "Exit check"),

    reworded(list, EXPERIMENTS, "A drawing pin", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Relative frequency = times it happened ÷ trials.**"],
      pins,
      [
        "**Relative frequency = times it happened ÷ trials.**",
        "More trials: a more reliable estimate.",
        "Expected = probability × trials: 0.6 × 500 = 300.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// It all adds to 1.

const SUM = "y7-probability/sum-to-one";
const sumMethod = [
  "Add the probabilities you know.",
  "Take the total from 1.",
  "Check: they all add to 1.",
];
const match = outcomes(["Win", "Draw", "Lose"], ["0.5", "0.2", "?"]);

const sumToOne = stepped(find(list, SUM), {
  method: sumMethod,
  variation: {
    relationship: "the probabilities of all the outcomes add up to 1",
    unknowns: ["not", "missing outcome"],
    surface: ["two outcomes", "three outcomes", "fractions", "impossible sets", "football"],
  },
  screens: worded([
    explain(
      "The rule",
      "It all adds to 1",
      ["**The probabilities of all the outcomes add up to 1.**"],
      match,
      "Something must happen, and certain is 1.",
    ),
    reworded(list, SUM, "It happens or it doesn't", { tag: "The rule" }),

    ...owned(list, SUM, "Warm-up", "Check you remember"),
    words(
      typed(
        "Check you remember",
        "What is $1 - \\frac16$?",
        "5/6",
        "1 is six sixths.",
        "$\\frac56$.",
      ),
      WORDS,
    ),

    methodCard("The method", sumMethod, match),
    worked(
      "Watch the method",
      "Find P(green).",
      [
        { line: "$0.4 + 0.35 = 0.75$", note: "Add the ones you know." },
        { line: "$1 - 0.75 = 0.25$" },
      ],
      "P(green) = 0.25.",
      outcomes(["Red", "Blue", "Green"], ["0.4", "0.35", "?"]),
    ),
    calc(
      "Your turn",
      "Find P(not late).",
      outcomes(["Late", "Not late"], ["0.15", "?"]),
      [
        ["$1 - 0.15 =$", "0.85", "Take it from 1."],
        ["Check: $0.15 + 0.85 =$", "1", "They should add to 1."],
      ],
      "0.85.",
    ),

    calc(
      "Practise",
      "Find P(C).",
      outcomes(["A", "B", "C"], ["0.1", "0.6", "?"]),
      [
        ["$0.1 + 0.6 =$", "0.7", "Add the ones you know."],
        ["$1 - 0.7 =$", "0.3", "Take the total from 1."],
      ],
      "0.3.",
    ),
    ...owned(list, SUM, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find P(tails).", "0.5", "1 − 0.5.", "0.5.", {
          asks: "not",
          picture: outcomes(["Heads", "Tails"], ["0.5", "?"]),
        }),
        ask("Find P(green).", "0.45", "1 − 0.55.", "0.45.", {
          asks: "missing outcome",
          changed: "Three outcomes.",
          picture: outcomes(["Red", "Blue", "Green"], ["0.3", "0.25", "?"]),
        }),
        ask("Find P(not win).", "5/8", "1 − 3/8.", "$\\frac58$.", {
          asks: "not",
          changed: "Fractions.",
          picture: outcomes(["Win", "Not win"], ["3/8", "?"]),
        }),
        ask("Find P(lose).", "0.3", "1 − 0.7.", "0.3.", {
          asks: "missing outcome",
          changed: "A football match.",
          picture: match,
        }),
      ],
      "All of them add to 1: take the rest from 1.",
    ),

    questionSet(
      "Variation",
      "Find each one. Watch what changes.",
      [
        ask("Can these probabilities be right?", "No", "They add to 1.3.", "No: they add to 1.3.", {
          asks: "missing outcome",
          others: ["Yes"],
          picture: outcomes(["Win", "Draw", "Lose"], ["0.6", "0.3", "0.4"]),
          expect: [
            "Add them. The total is…",
            "more than 1",
            "0.6 + 0.3 + 0.4 = 1.3: too much.",
            [["exactly 1", "Add them carefully: 1.3."]],
          ],
        }),
        ask("Find P(not 6) on a fair dice.", "5/6", "1 − 1/6.", "$\\frac56$.", {
          asks: "not",
          changed: "A dice, in fractions.",
          picture: outcomes(["6", "Not 6"], ["1/6", "?"]),
        }),
        ask("Find P(rain).", "0.65", "1 − 0.35.", "0.65.", {
          asks: "not",
          changed: "The 'not' is given.",
          picture: outcomes(["Rain", "No rain"], ["?", "0.35"]),
        }),
        ask("Find P(D).", "0.7", "1 − 0.3.", "0.7.", {
          asks: "missing outcome",
          changed: "Four outcomes.",
          picture: outcomes(["A", "B", "C", "D"], ["0.1", "0.1", "0.1", "?"]),
        }),
      ],
      "However many outcomes, they add up to exactly 1.",
    ),
    own(list, SUM, "Spot the mistake"),

    own(list, SUM, "Exit check"),

    reworded(
      list,
      SUM,
      "The missing chance",
      { tag: "Real life", picture: match },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**The probabilities of all the outcomes add up to 1.**"],
      match,
      [
        "**The probabilities of all the outcomes add up to 1.**",
        "P(not A) = 1 − P(A).",
        "Win 0.5, draw 0.2, so lose 1 − 0.7 = 0.3.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7ProbabilityStepped: [string, UnitLesson[]][] = [
  [SCALE, [probabilityScale]],
  [EXPERIMENTS, [experiments]],
  [SUM, [sumToOne]],
];
