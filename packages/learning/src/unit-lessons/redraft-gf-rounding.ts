// GCSE Foundation, "Rounding, bounds and standard form", on the stepped template
// (docs/proposals/lesson-stepped.md): estimating, decimal places, significant figures, error
// intervals for rounding and truncation, limits of accuracy, and standard form. Error intervals
// are drawn on number lines; the rest is number work.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfRounding } from "./gf-rounding.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const RD = gfRounding;
const NUMBER = "A number check: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Estimating.

const ESTIMATE = "gf-rounding/estimate";
const estMethod = [
  "Round each number to 1 s.f.",
  "Work out the easy calculation.",
  "Write ≈, not =.",
];
const ROUGH = maths("\\frac{38.6 \\times 4.9}{0.21} \\approx \\frac{40 \\times 5}{0.2} = 1000");

const estimate = stepped(find(RD, ESTIMATE), {
  method: estMethod,
  variation: {
    relationship: "a calculation and its estimate from 1 s.f.",
    unknowns: ["rounded", "estimate"],
    surface: ["small numbers", "the order of operations", "times or add"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "One significant figure",
        ["**Round every number to 1 significant figure, then work it out.**"],
        ROUGH,
        "Use ≈ for “approximately equal”.",
      ),
      reworded(RD, ESTIMATE, "0.52 to 1 significant figure", { tag: "The rule" }),

      ...owned(RD, ESTIMATE, "Warm-up", "Check you remember"),

      methodCard("The method", estMethod, ROUGH),
      workedFrom(RD, ESTIMATE),
      calc(
        "Your turn",
        "Estimate $\\dfrac{61.3 \\times 2.9}{0.48}$.",
        undefined,
        [
          ["Top: $60 \\times 3 =$", "180", "Each to 1 s.f."],
          ["$180 \\div 0.5 =$", "360", "0.48 is about 0.5."],
        ],
        "About 360.",
      ),

      calc(
        "Practise",
        "Estimate $\\sqrt{98} \\times 3.1$.",
        undefined,
        [
          ["$\\sqrt{100} =$", "10", "98 is about 100."],
          ["$10 \\times 3 =$", "30", "3.1 is about 3."],
        ],
        "About 30.",
      ),
      ...owned(RD, ESTIMATE, "Together", "Practise"),
      ...owned(RD, ESTIMATE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Round to 1 s.f. Watch what changes.",
        [
          ask("47.3", "50", "The 4 is first.", "50.", { asks: "rounded" }),
          ask("4.73", "5", "The 4 is first.", "5.", {
            asks: "rounded",
            changed: "Ten times smaller.",
          }),
          ask("0.473", "0.5", "The 4 is first.", "0.5.", { asks: "rounded", changed: "Below 1." }),
          ask("0.0473", "0.05", "Skip the zeros.", "0.05.", {
            asks: "rounded",
            changed: "Smaller still.",
          }),
        ],
        "The first non-zero digit is the first significant figure.",
      ),

      questionSet(
        "Variation",
        "Estimate. Watch what changes.",
        [
          ask("$\\dfrac{19.6 + 10.2}{5.1}$", "6", "(20 + 10) ÷ 5.", "6.", {
            asks: "estimate",
            expect: [
              "Bea works out $20 + 10 \\div 5 = 22$. Right?",
              "No",
              "The fraction bar is a bracket: $(20 + 10) \\div 5 = 6$.",
              [["Yes", "Is the whole top divided?"]],
            ],
          }),
          ask("$\\dfrac{19.6 \\times 10.2}{5.1}$", "40", "20 × 10 ÷ 5.", "40.", {
            asks: "estimate",
            changed: "Times.",
          }),
          ask("$19.6 + \\dfrac{10.2}{5.1}$", "22", "20 + 2.", "22.", {
            asks: "estimate",
            changed: "Only 10.2 is divided.",
          }),
          ask("$\\dfrac{19.6 - 10.2}{5.1}$", "2", "(20 − 10) ÷ 5.", "2.", {
            asks: "estimate",
            changed: "Minus.",
          }),
        ],
        "Round first, then follow the order of operations.",
      ),
      own(RD, ESTIMATE, "Spot the mistake"),

      own(RD, ESTIMATE, "Exit check"),

      reworded(
        RD,
        ESTIMATE,
        "“Estimate $\\dfrac{48.7 \\times 3.1}{0.52}$ by rounding to 1 s.f.”",
        {
          tag: "Real life",
          title: "Estimate $\\dfrac{48.7 \\times 3.1}{0.52}$, rounding to 1 s.f.",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Round every number to 1 significant figure, then work it out.**"],
        ROUGH,
        [
          "**Round every number to 1 significant figure, then work it out.**",
          "0.38 is 0.4 to 1 s.f., not 0.",
          "The fraction bar is a bracket.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Rounding to decimal places.

const DP = "gf-rounding/decimal-places";
const dpMethod = [
  "Find the last digit you keep.",
  "Look at the next digit.",
  "5 or more: round up. Keep the zeros you need.",
];
const NEARER: Picture = {
  kind: "number-line",
  min: 3.14,
  max: 3.15,
  step: 0.001,
  every: 0,
  marks: [{ at: 3.146, label: "3.146", tone: "given" }],
};

const decimalPlaces = stepped(find(RD, DP), {
  method: dpMethod,
  variation: {
    relationship: "a number rounded to a number of decimal places",
    unknowns: ["rounded"],
    surface: ["more places", "rounding up past 9", "needed zeros"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The deciding digit",
        ["**Look at the next digit: 5 or more rounds up.**"],
        NEARER,
        "3.146 is nearer 3.15 than 3.14.",
      ),
      reworded(RD, DP, "3.14159 to 2 d.p.", { tag: "The rule" }),

      ...owned(RD, DP, "Warm-up", "Check you remember"),

      methodCard("The method", dpMethod, NEARER),
      workedFrom(RD, DP),
      calc(
        "Your turn",
        "Round 8.4652 to 2 d.p.",
        undefined,
        [
          ["Deciding digit:", "5", "The third decimal place."],
          ["Rounded:", "8.47", "5 rounds up."],
        ],
        "8.47.",
      ),

      calc(
        "Practise",
        "Round 0.3971 to 2 d.p.",
        undefined,
        [
          ["Deciding digit:", "7", "The third decimal place."],
          ["Rounded:", "0.40", "Keep the zero: 2 d.p."],
        ],
        "0.40.",
      ),
      ...owned(RD, DP, "Together", "Practise"),
      ...owned(RD, DP, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Round 5.6278. Watch what changes.",
        [
          ask("To 1 d.p.", "5.6", "Look at the 2.", "5.6.", { asks: "rounded" }),
          ask("To 2 d.p.", "5.63", "Look at the 7.", "5.63.", {
            asks: "rounded",
            changed: "2 d.p.",
          }),
          ask("To 3 d.p.", "5.628", "Look at the 8.", "5.628.", {
            asks: "rounded",
            changed: "3 d.p.",
          }),
          ask("To the nearest whole", "6", "Look at the 6.", "6.", {
            asks: "rounded",
            changed: "A whole number.",
          }),
        ],
        "The next digit decides.",
      ),

      questionSet(
        "Variation",
        "Round it. Watch what changes.",
        [
          pick("6.098 to 2 d.p.", "6.10", ["6.1", "6.09"], "Keep two places.", {
            asks: "rounded",
            expect: [
              "Fin writes 6.098 to 2 d.p. as 6.1. Right?",
              "No",
              "2 d.p. needs two decimal places: 6.10.",
              [["Yes", "How many decimal places?"]],
            ],
          }),
          pick("6.098 to 1 d.p.", "6.1", ["6.0", "6.10"], "Look at the 9.", {
            asks: "rounded",
            changed: "1 d.p.",
          }),
          pick("6.995 to 2 d.p.", "7.00", ["7", "6.10"], "It rounds right up.", {
            asks: "rounded",
            changed: "Rounds up a lot.",
          }),
          pick("6.0049 to 2 d.p.", "6.00", ["6", "6.01"], "Look at the 4.", {
            asks: "rounded",
            changed: "Rounds down.",
          }),
        ],
        "Write every decimal place asked for.",
      ),
      own(RD, DP, "Spot the mistake"),

      own(RD, DP, "Exit check"),

      reworded(
        RD,
        DP,
        "“£47 is split between 3. Give each share to 2 d.p.”",
        { tag: "Real life", title: "£47 split between 3. Each share to 2 d.p.?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Look at the next digit: 5 or more rounds up.**"],
        NEARER,
        [
          "**Look at the next digit: 5 or more rounds up.**",
          "2.399 to 2 d.p. is 2.40, not 2.4.",
          "Round once, from the original number.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Significant figures.

const SF = "gf-rounding/significant-figures";
const sfMethod = [
  "Find the first non-zero digit.",
  "Count the figures you keep; look at the next.",
  "Fill with zeros to keep the place value.",
];
const FIGURES = maths("38\\,261 \\to 38\\,000 \\qquad 0.00573 \\to 0.0057");

const significant = stepped(find(RD, SF), {
  method: sfMethod,
  variation: {
    relationship: "a number rounded to significant figures",
    unknowns: ["rounded"],
    surface: ["big numbers", "decimals", "below 1"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Count from the first non-zero digit",
        ["**Count from the first non-zero digit; fill with zeros to keep place value.**"],
        FIGURES,
        "Zeros at the start don't count.",
      ),
      reworded(RD, SF, "3.0571 to 3 s.f.", { tag: "The rule" }),

      ...owned(RD, SF, "Warm-up", "Check you remember"),

      methodCard("The method", sfMethod, FIGURES),
      workedFrom(RD, SF),
      calc(
        "Your turn",
        "Round 67 482 to 2 s.f.",
        undefined,
        [["Rounded:", "67000", "Keep 6, 7; the 4 rounds down."]],
        "67 000.",
      ),

      calc(
        "Practise",
        "Round 0.008 361 to 2 s.f.",
        undefined,
        [["Rounded:", "0.0084", "Keep 8, 3; the 6 rounds up."]],
        "0.0084.",
      ),
      ...owned(RD, SF, "Together", "Practise"),
      ...owned(RD, SF, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Round. Watch what changes.",
        [
          ask("4 739 to 1 s.f.", "5000", "Look at the 7.", "5 000.", { asks: "rounded" }),
          ask("4 739 to 2 s.f.", "4700", "Look at the 3.", "4 700.", {
            asks: "rounded",
            changed: "2 s.f.",
          }),
          ask("0.04739 to 1 s.f.", "0.05", "Look at the 7.", "0.05.", {
            asks: "rounded",
            changed: "A decimal.",
          }),
          ask("0.04739 to 2 s.f.", "0.047", "Look at the 3.", "0.047.", {
            asks: "rounded",
            changed: "2 s.f. again.",
          }),
        ],
        "Zeros keep the size right.",
      ),

      questionSet(
        "Variation",
        "Round to 2 s.f. Watch what changes.",
        [
          pick("8 352", "8 400", ["84", "8 300"], "Keep the place value.", {
            asks: "rounded",
            expect: [
              "Abi writes 8 352 to 2 s.f. as 84. Right?",
              "No",
              "Keep the place value: 8 400.",
              [["Yes", "Is 84 close to 8 352?"]],
            ],
          }),
          pick("835.2", "840", ["84", "835"], "Look at the 5.", {
            asks: "rounded",
            changed: "Ten times smaller.",
          }),
          pick("8.352", "8.4", ["8.3", "84"], "Look at the 5.", {
            asks: "rounded",
            changed: "Smaller still.",
          }),
          pick("0.08352", "0.084", ["0.08", "84"], "Skip the zeros.", {
            asks: "rounded",
            changed: "Below 1.",
          }),
        ],
        "The answer stays about the same size.",
      ),
      own(RD, SF, "Spot the mistake"),

      own(RD, SF, "Exit check"),

      reworded(
        RD,
        SF,
        "“Write 54 837 and 0.000674 to 2 s.f.”",
        { tag: "Real life", title: "54 837 and 0.000674, each to 2 s.f.?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Count from the first non-zero digit; fill with zeros to keep place value.**"],
        FIGURES,
        [
          "**Count from the first non-zero digit; fill with zeros to keep place value.**",
          "6 284 to 2 s.f. is 6 300, not 63.",
          "Zeros between digits count: 0.0306 to 2 s.f. is 0.031.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Error intervals for rounding.

const INTERVALS = "gf-rounding/error-intervals";
const intMethod = [
  "Find the unit it was rounded to.",
  "Halve it.",
  "Lower = value − half; upper = value + half. Use ≤ then <.",
];
const SIX: Picture = {
  kind: "number-line",
  min: 5,
  max: 7,
  step: 0.5,
  marks: [{ at: 6, label: "6", tone: "given" }],
  interval: { from: 5.5, to: 6.5, fromClosed: true, toClosed: false },
};

const errorIntervals = stepped(find(RD, INTERVALS), {
  method: intMethod,
  variation: {
    relationship: "a rounded value and the numbers that round to it",
    unknowns: ["interval"],
    surface: ["different units", "decimal places", "big numbers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Half a unit each way",
        ["**Half a unit either side: lower ≤ x < upper.**"],
        SIX,
        "6 to the nearest whole: 6.5 rounds up, so it's left out.",
      ),
      reworded(RD, INTERVALS, "A mass is 60 kg to the nearest 10 kg. The lower bound", {
        tag: "The rule",
        title: "60 kg, to the nearest 10 kg. The lower bound?",
      }),

      ...owned(RD, INTERVALS, "Warm-up", "Check you remember"),

      methodCard("The method", intMethod, SIX),
      workedFrom(RD, INTERVALS),
      calc(
        "Your turn",
        "8.3 to 1 d.p.",
        undefined,
        [
          ["Lower bound:", "8.25", "Half of 0.1 below."],
          ["Upper bound:", "8.35", "Half of 0.1 above."],
        ],
        "$8.25 \\le x < 8.35$.",
      ),

      calc(
        "Practise",
        "4 200 to the nearest 100.",
        undefined,
        [
          ["Lower bound:", "4150", "50 below."],
          ["Upper bound:", "4250", "50 above."],
        ],
        "$4150 \\le x < 4250$.",
      ),
      ...owned(RD, INTERVALS, "Together", "Practise"),
      ...owned(RD, INTERVALS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The error interval? Watch what changes.",
        [
          pick(
            "9, to the nearest whole",
            "$8.5 \\le x < 9.5$",
            ["$8 \\le x < 10$", "$8.5 < x \\le 9.5$"],
            "Half of 1.",
            {
              asks: "interval",
            },
          ),
          pick(
            "9.0, to 1 d.p.",
            "$8.95 \\le x < 9.05$",
            ["$8.5 \\le x < 9.5$", "$8.9 \\le x < 9.1$"],
            "Half of 0.1.",
            {
              asks: "interval",
              changed: "1 d.p.",
            },
          ),
          pick(
            "90, to the nearest 10",
            "$85 \\le x < 95$",
            ["$80 \\le x < 100$", "$89.5 \\le x < 90.5$"],
            "Half of 10.",
            {
              asks: "interval",
              changed: "Nearest 10.",
            },
          ),
          pick(
            "900, to the nearest 100",
            "$850 \\le x < 950$",
            ["$800 \\le x < 1000$", "$895 \\le x < 905$"],
            "Half of 100.",
            {
              asks: "interval",
              changed: "Nearest 100.",
            },
          ),
        ],
        "Half the unit, each way.",
      ),

      questionSet(
        "Variation",
        "80, rounded. Watch what changes.",
        [
          pick(
            "To the nearest 10",
            "$75 \\le x < 85$",
            ["$75 \\le x < 80$", "$70 \\le x < 90$"],
            "5 each way.",
            {
              asks: "interval",
              expect: [
                "For 80 to the nearest 10, Ty writes $75 \\le x < 80$. Right?",
                "No",
                "Half a unit each side: $75 \\le x < 85$.",
                [["Yes", "Could 82 round to 80?"]],
              ],
            },
          ),
          pick(
            "To the nearest 5",
            "$77.5 \\le x < 82.5$",
            ["$75 \\le x < 85$", "$79.5 \\le x < 80.5$"],
            "2.5 each way.",
            {
              asks: "interval",
              changed: "Nearest 5.",
            },
          ),
          pick(
            "To the nearest 20",
            "$70 \\le x < 90$",
            ["$75 \\le x < 85$", "$60 \\le x < 100$"],
            "10 each way.",
            {
              asks: "interval",
              changed: "Nearest 20.",
            },
          ),
          pick(
            "80.0 to 1 d.p.",
            "$79.95 \\le x < 80.05$",
            ["$79.5 \\le x < 80.5$", "$75 \\le x < 85$"],
            "0.05 each way.",
            {
              asks: "interval",
              changed: "1 d.p.",
            },
          ),
        ],
        "The bigger the unit, the wider the interval.",
      ),
      own(RD, INTERVALS, "Spot the mistake"),

      own(RD, INTERVALS, "Exit check"),

      reworded(
        RD,
        INTERVALS,
        "“$l$ = 2.4 m to 1 d.p. Write the error interval for $l$.”",
        { tag: "Real life", title: "$l$ = 2.4 m to 1 d.p. Its error interval?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Half a unit either side: lower ≤ x < upper.**"],
        SIX,
        [
          "**Half a unit either side: lower ≤ x < upper.**",
          "2.4 to 1 d.p.: $2.35 \\le l < 2.45$.",
          "The upper bound isn't included.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Error intervals for truncation.

const TRUNCATION = "gf-rounding/truncation";
const truncMethod = [
  "Cut off digits: no rounding.",
  "Lower bound: the value shown.",
  "Upper bound: one unit more, not included.",
];
const CUT: Picture = {
  kind: "number-line",
  min: 5.5,
  max: 5.8,
  step: 0.1,
  interval: { from: 5.6, to: 5.7, fromClosed: true, toClosed: false },
};

const truncation = stepped(find(RD, TRUNCATION), {
  method: truncMethod,
  variation: {
    relationship: "truncation and rounding intervals",
    unknowns: ["value", "interval"],
    surface: ["truncated or rounded", "decimal places", "whole numbers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Truncating",
        ["**Truncating cuts digits off: the interval goes up one whole unit.**"],
        CUT,
        "5.6 truncated covers 5.6 up to, not including, 5.7.",
      ),
      reworded(RD, TRUNCATION, "Truncated to 1 d.p., which shows 4.2?", { tag: "The rule" }),

      ...owned(RD, TRUNCATION, "Warm-up", "Check you remember"),

      methodCard("The method", truncMethod, CUT),
      workedFrom(RD, TRUNCATION),
      calc(
        "Your turn",
        "8.4 is truncated to 1 d.p.",
        undefined,
        [
          ["Lower bound:", "8.4", "The value shown."],
          ["Upper bound:", "8.5", "One unit more."],
        ],
        "$8.4 \\le x < 8.5$.",
      ),

      calc(
        "Practise",
        "A number truncated to a whole is 31.",
        undefined,
        [
          ["Lower bound:", "31", "The value shown."],
          ["Upper bound:", "32", "One unit more."],
        ],
        "$31 \\le x < 32$.",
      ),
      ...owned(RD, TRUNCATION, "Together", "Practise"),
      ...owned(RD, TRUNCATION, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Watch what changes.",
        [
          pick("Truncate 4.97 to 1 d.p.", "4.9", ["5.0", "4.10"], "Cut off the 7.", {
            asks: "value",
          }),
          pick("Round 4.97 to 1 d.p.", "5.0", ["4.9", "4.10"], "The 7 rounds up.", {
            asks: "value",
            changed: "Round, not cut.",
          }),
          pick("Truncate 4.97 to a whole", "4", ["5", "4.9"], "Cut off .97.", {
            asks: "value",
            changed: "A whole.",
          }),
          pick("Truncate 0.468 to 2 d.p.", "0.46", ["0.47", "0.4"], "Cut off the 8.", {
            asks: "value",
            changed: "2 d.p.",
          }),
        ],
        "Truncating never rounds up.",
      ),

      questionSet(
        "Variation",
        "The error interval? Watch what changes.",
        [
          pick(
            "25, truncated to a whole",
            "$25 \\le x < 26$",
            ["$25 \\le x < 25.5$", "$24.5 \\le x < 25.5$"],
            "Up a whole unit.",
            {
              asks: "interval",
              expect: [
                "For 25 truncated, Gus writes $25 \\le x < 25.5$. Right?",
                "No",
                "Truncation covers the whole unit: up to 26.",
                [["Yes", "Does 25.8 truncate to 25?"]],
              ],
            },
          ),
          pick(
            "25, rounded to a whole",
            "$24.5 \\le x < 25.5$",
            ["$25 \\le x < 26$", "$24 \\le x < 26$"],
            "Half each way.",
            {
              asks: "interval",
              changed: "Rounded.",
            },
          ),
          pick(
            "2.5, truncated to 1 d.p.",
            "$2.5 \\le x < 2.6$",
            ["$2.45 \\le x < 2.55$", "$2.5 \\le x < 3.5$"],
            "Up 0.1.",
            {
              asks: "interval",
              changed: "1 d.p.",
            },
          ),
          pick(
            "2.5, rounded to 1 d.p.",
            "$2.45 \\le x < 2.55$",
            ["$2.5 \\le x < 2.6$", "$2 \\le x < 3$"],
            "0.05 each way.",
            {
              asks: "interval",
              changed: "Rounded.",
            },
          ),
        ],
        "Truncated: up one unit. Rounded: half each way.",
      ),
      own(RD, TRUNCATION, "Spot the mistake"),

      own(RD, TRUNCATION, "Exit check"),

      reworded(
        RD,
        TRUNCATION,
        "“The display shows 3.8, truncated to 1 d.p. Write the error interval.”",
        { tag: "Real life", title: "It shows 3.8, truncated to 1 d.p. Error interval?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Truncating cuts digits off: the interval goes up one whole unit.**"],
        CUT,
        [
          "**Truncating cuts digits off: the interval goes up one whole unit.**",
          "3.8 truncated: $3.8 \\le x < 3.9$.",
          "3.8 rounded: $3.75 \\le x < 3.85$.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Limits of accuracy.

const LIMITS = "gf-rounding/limits";
const limMethod = [
  "Find each bound: half a unit each way.",
  "Greatest: use upper bounds. Least: use lower bounds.",
  "Then do the calculation.",
];
const BOUNDS: Picture = {
  kind: "table",
  head: ["2.4 kg, to 1 d.p.", "Lower", "Upper"],
  rows: [["Each", "2.35", "2.45"]],
};

const limits = stepped(find(RD, LIMITS), {
  method: limMethod,
  variation: {
    relationship: "bounds give the greatest and least results",
    unknowns: ["bound"],
    surface: ["greatest or least", "areas", "perimeters"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Bounds in calculations",
        ["**Greatest total: use upper bounds. Least: use lower bounds.**"],
        BOUNDS,
        "6 of them weigh from 14.1 kg up to 14.7 kg.",
      ),

      ...owned(RD, LIMITS, "Warm-up", "Check you remember"),

      methodCard("The method", limMethod, BOUNDS),
      workedFrom(RD, LIMITS),
      calc(
        "Your turn",
        "8 boxes, each 3.6 kg to 1 d.p.",
        undefined,
        [
          ["Upper bound each:", "3.65", "Add 0.05."],
          ["Greatest total:", "29.2", "8 × 3.65.", { after: "kg" }],
        ],
        "29.2 kg.",
      ),

      calc(
        "Practise",
        "A rectangle 7 cm by 5 cm, to the nearest cm.",
        undefined,
        [
          ["Lower bounds: 6.5 and", "4.5", "Take 0.5 off each."],
          ["Least area:", "29.25", "6.5 × 4.5.", { after: "cm²" }],
        ],
        "29.25 cm².",
      ),
      reworded(RD, LIMITS, "A rectangle 6 cm by 4 cm, each to the nearest cm", { tag: "Practise" }),
      reworded(
        RD,
        LIMITS,
        "A 50 kg lift limit; people weigh 70 kg to the nearest 10 kg. Safest bound to use per person?",
        { tag: "Practise", title: "People weigh 70 kg, to the nearest 10 kg. Safest bound?" },
      ),
      ...owned(RD, LIMITS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Watch what changes.",
        [
          ask("4 panels, 2.5 m each to 1 d.p. Greatest total?", "10.2", "4 × 2.55.", "10.2 m.", {
            asks: "bound",
            unit: "m",
          }),
          ask("4 panels, 2.5 m each to 1 d.p. Least total?", "9.8", "4 × 2.45.", "9.8 m.", {
            asks: "bound",
            unit: "m",
            changed: "Least.",
          }),
          ask("4 panels, 3 m each to the nearest m. Greatest?", "14", "4 × 3.5.", "14 m.", {
            asks: "bound",
            unit: "m",
            changed: "Nearest metre.",
          }),
          ask("4 panels, 3 m each to the nearest m. Least?", "10", "4 × 2.5.", "10 m.", {
            asks: "bound",
            unit: "m",
            changed: "Least again.",
          }),
        ],
        "Upper bounds for the greatest; lower for the least.",
      ),

      questionSet(
        "Variation",
        "A rug, 4 m by 3 m to the nearest m.",
        [
          ask("Greatest area?", "15.75", "4.5 × 3.5.", "15.75 m².", {
            asks: "bound",
            unit: "m²",
            expect: [
              "Sid says the greatest area is 4 × 3 = 12 m². Right?",
              "No",
              "Use upper bounds: 4.5 × 3.5 = 15.75 m².",
              [["Yes", "Could the rug be 4.4 m long?"]],
            ],
          }),
          ask("Least area?", "8.75", "3.5 × 2.5.", "8.75 m².", {
            asks: "bound",
            unit: "m²",
            changed: "Least.",
          }),
          ask("Greatest perimeter?", "16", "2 × (4.5 + 3.5).", "16 m.", {
            asks: "bound",
            unit: "m",
            changed: "Perimeter.",
          }),
          ask("Least perimeter?", "12", "2 × (3.5 + 2.5).", "12 m.", {
            asks: "bound",
            unit: "m",
            changed: "Least perimeter.",
          }),
        ],
        "The rounded values give neither the greatest nor the least.",
      ),
      reworded(RD, LIMITS, "Where did it go wrong?", {
        text: "Rug 3 m by 2 m, nearest m. Raj finds the areas.",
      }),

      own(RD, LIMITS, "Exit check"),

      reworded(
        RD,
        LIMITS,
        "“10 panels, each 1.8 m to 1 d.p. What is the greatest possible total length?”",
        { tag: "Real life", title: "10 panels, each 1.8 m to 1 d.p. Greatest total?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Greatest total: use upper bounds. Least: use lower bounds.**"],
        BOUNDS,
        [
          "**Greatest total: use upper bounds. Least: use lower bounds.**",
          "1.8 m to 1 d.p.: from 1.75 m up to 1.85 m.",
          "Use 1.85, not 1.84.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Writing standard form.

const STANDARD = "gf-rounding/standard-form";
const sfMethod2 = [
  "Put the point after the first non-zero digit.",
  "Count the places it moved.",
  "Bigger than 1: + power. Smaller than 1: − power.",
];
const FORM = maths(
  "\\begin{array}{l} 62\\,000 = 6.2 \\times 10^4 \\\\ 0.0031 = 3.1 \\times 10^{-3} \\end{array}",
);

const standardForm = stepped(find(RD, STANDARD), {
  method: sfMethod2,
  variation: {
    relationship: "a number and its standard form",
    unknowns: ["standard"],
    surface: ["big numbers", "small numbers", "near 1"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "One digit before the point",
        ["**Standard form is A × 10ⁿ, with 1 ≤ A < 10.**"],
        FORM,
        "Big numbers: positive powers. Small: negative.",
      ),
      reworded(RD, STANDARD, "Which is standard form?", { tag: "The rule" }),

      ...owned(RD, STANDARD, "Warm-up", "Check you remember"),

      methodCard("The method", sfMethod2, FORM),
      workedFrom(RD, STANDARD),
      calc(
        "Your turn",
        "Write 3 800 000 in standard form.",
        undefined,
        [
          ["A =", "3.8", "One digit before the point."],
          ["Power:", "6", "It moved 6 places."],
        ],
        "$3.8 \\times 10^6$.",
      ),

      calc(
        "Practise",
        "Write 0.000 47 in standard form.",
        undefined,
        [
          ["A =", "4.7", "One digit before the point."],
          ["Power:", "-4", "Small: negative."],
        ],
        "$4.7 \\times 10^{-4}$.",
      ),
      ...owned(RD, STANDARD, "Together", "Practise"),
      ...owned(RD, STANDARD, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Watch what changes.",
        [
          pick(
            "5 300 in standard form",
            "$5.3 \\times 10^3$",
            ["$53 \\times 10^2$", "$5.3 \\times 10^{-3}$"],
            "3 places.",
            {
              asks: "standard",
            },
          ),
          pick(
            "53 000 in standard form",
            "$5.3 \\times 10^4$",
            ["$53 \\times 10^3$", "$5.3 \\times 10^3$"],
            "4 places.",
            {
              asks: "standard",
              changed: "Ten times bigger.",
            },
          ),
          pick(
            "0.053 in standard form",
            "$5.3 \\times 10^{-2}$",
            ["$5.3 \\times 10^2$", "$53 \\times 10^{-3}$"],
            "Small: negative.",
            {
              asks: "standard",
              changed: "Small.",
            },
          ),
          pick(
            "$5.3 \\times 10^{-4}$ as a number",
            "0.00053",
            ["53 000", "0.0053"],
            "4 places left.",
            {
              asks: "standard",
              changed: "Backwards.",
            },
          ),
        ],
        "Count the places the point moves.",
      ),

      questionSet(
        "Variation",
        "In standard form. Watch what changes.",
        [
          pick(
            "0.0076",
            "$7.6 \\times 10^{-3}$",
            ["$7.6 \\times 10^3$", "$76 \\times 10^{-4}$"],
            "Small: negative.",
            {
              asks: "standard",
              expect: [
                "For 0.0076, Nia writes $7.6 \\times 10^3$. Right?",
                "No",
                "It's small, so the power is negative: $10^{-3}$.",
                [["Yes", "Is 0.0076 big or small?"]],
              ],
            },
          ),
          pick(
            "7 600",
            "$7.6 \\times 10^3$",
            ["$7.6 \\times 10^{-3}$", "$76 \\times 10^2$"],
            "Big: positive.",
            {
              asks: "standard",
              changed: "Big.",
            },
          ),
          pick(
            "0.76",
            "$7.6 \\times 10^{-1}$",
            ["$7.6 \\times 10^1$", "$76 \\times 10^{-2}$"],
            "Just below 1.",
            {
              asks: "standard",
              changed: "Just below 1.",
            },
          ),
          pick(
            "76",
            "$7.6 \\times 10^1$",
            ["$76 \\times 10^0$", "$7.6 \\times 10^{-1}$"],
            "Just above 10.",
            {
              asks: "standard",
              changed: "Just above 10.",
            },
          ),
        ],
        "Below 1: a negative power.",
      ),
      own(RD, STANDARD, "Spot the mistake"),

      own(RD, STANDARD, "Exit check"),

      reworded(
        RD,
        STANDARD,
        "“Write 150 000 000 in standard form.”",
        { tag: "Real life", title: "150 000 000 in standard form?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Standard form is A × 10ⁿ, with 1 ≤ A < 10.**"],
        FORM,
        [
          "**Standard form is A × 10ⁿ, with 1 ≤ A < 10.**",
          "45 000 is $4.5 \\times 10^4$, not $45 \\times 10^3$.",
          "0.0076 is $7.6 \\times 10^{-3}$.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Calculating in standard form.

const CALCULATE = "gf-rounding/calculate";
const calcMethod = [
  "×: multiply the numbers, add the powers.",
  "÷: divide the numbers, subtract the powers.",
  "Tidy up so the number is from 1 to 10.",
];
const TIDY = maths(
  "\\begin{array}{l} (2 \\times 10^3)(6 \\times 10^4) \\\\ = 12 \\times 10^7 = 1.2 \\times 10^8 \\end{array}",
);

const calculate = stepped(find(RD, CALCULATE), {
  method: calcMethod,
  variation: {
    relationship: "the index laws in standard form",
    unknowns: ["result"],
    surface: ["multiplying", "dividing", "adding", "tidying"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Numbers, then powers",
        ["**Multiply the numbers, add the powers, then tidy up.**"],
        TIDY,
        "Dividing: divide the numbers, subtract the powers.",
      ),
      reworded(RD, CALCULATE, "Tidy $0.6 \\times 10^5$ into standard form", { tag: "The rule" }),

      ...owned(RD, CALCULATE, "Warm-up", "Check you remember"),

      methodCard("The method", calcMethod, TIDY),
      workedFrom(RD, CALCULATE),
      calc(
        "Your turn",
        "Work out $(4 \\times 10^5) \\times (3 \\times 10^2)$.",
        undefined,
        [
          ["$4 \\times 3 =$", "12", "Multiply the numbers."],
          ["Power: $5 + 2 =$", "7", "Add the powers."],
          ["Tidy: $1.2 \\times 10^?$, ? =", "8", "12 is 1.2 × 10."],
        ],
        "$1.2 \\times 10^8$.",
      ),

      calc(
        "Practise",
        "Work out $(6 \\times 10^8) \\div (3 \\times 10^5)$.",
        undefined,
        [
          ["$6 \\div 3 =$", "2", "Divide the numbers."],
          ["Power: $8 - 5 =$", "3", "Subtract the powers."],
        ],
        "$2 \\times 10^3$.",
      ),
      ...owned(RD, CALCULATE, "Together", "Practise"),
      ...owned(RD, CALCULATE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Work it out. Watch what changes.",
        [
          pick(
            "$(2 \\times 10^3)(3 \\times 10^4)$",
            "$6 \\times 10^7$",
            ["$6 \\times 10^{12}$", "$5 \\times 10^7$"],
            "Add the powers.",
            {
              asks: "result",
            },
          ),
          pick(
            "$(5 \\times 10^3)(3 \\times 10^4)$",
            "$1.5 \\times 10^8$",
            ["$15 \\times 10^7$", "$1.5 \\times 10^7$"],
            "15 needs tidying.",
            {
              asks: "result",
              changed: "Tidy up.",
            },
          ),
          pick(
            "$(6 \\times 10^7) \\div (3 \\times 10^4)$",
            "$2 \\times 10^3$",
            ["$2 \\times 10^{11}$", "$3 \\times 10^3$"],
            "Subtract the powers.",
            {
              asks: "result",
              changed: "Divide.",
            },
          ),
          pick(
            "$(3 \\times 10^4) \\div (6 \\times 10^2)$",
            "$5 \\times 10^1$",
            ["$0.5 \\times 10^2$", "$2 \\times 10^2$"],
            "0.5 needs tidying.",
            {
              asks: "result",
              changed: "Tidy down.",
            },
          ),
        ],
        "Numbers, powers, then tidy.",
      ),

      questionSet(
        "Variation",
        "Work it out. Watch what changes.",
        [
          pick(
            "$(8 \\times 10^9) \\div (2 \\times 10^3)$",
            "$4 \\times 10^6$",
            ["$4 \\times 10^3$", "$4 \\times 10^{12}$"],
            "9 − 3.",
            {
              asks: "result",
              expect: [
                "Jen divides the powers: $10^9 \\div 10^3 = 10^3$. Right?",
                "No",
                "Subtract the powers: $10^6$.",
                [["Yes", "Is $10^9 \\div 10^3$ the same as 9 ÷ 3?"]],
              ],
            },
          ),
          pick(
            "$(8 \\times 10^9) \\times (2 \\times 10^3)$",
            "$1.6 \\times 10^{13}$",
            ["$16 \\times 10^{12}$", "$1.6 \\times 10^{27}$"],
            "Add the powers, then tidy.",
            {
              asks: "result",
              changed: "Times.",
            },
          ),
          pick(
            "$(8 \\times 10^9) + (2 \\times 10^9)$",
            "$1 \\times 10^{10}$",
            ["$10 \\times 10^{18}$", "$1 \\times 10^{18}$"],
            "10 lots of $10^9$.",
            {
              asks: "result",
              changed: "Add, same power.",
            },
          ),
          pick(
            "$(2 \\times 10^3) \\div (8 \\times 10^9)$",
            "$2.5 \\times 10^{-7}$",
            ["$0.25 \\times 10^{-6}$", "$4 \\times 10^6$"],
            "0.25, tidied.",
            {
              asks: "result",
              changed: "Swapped.",
            },
          ),
        ],
        "× adds powers; ÷ subtracts; + needs the same power.",
      ),
      own(RD, CALCULATE, "Spot the mistake"),

      own(RD, CALCULATE, "Exit check"),

      reworded(
        RD,
        CALCULATE,
        "“Work out $(3 \\times 10^4) \\times (5 \\times 10^6)$ in standard form.”",
        {
          tag: "Real life",
          title: "$(3 \\times 10^4) \\times (5 \\times 10^6)$ in standard form?",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply the numbers, add the powers, then tidy up.**"],
        TIDY,
        [
          "**Multiply the numbers, add the powers, then tidy up.**",
          "$15 \\times 10^{10} = 1.5 \\times 10^{11}$.",
          "Adding: the powers don't add.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfRoundingStepped: [string, UnitLesson[]][] = [
  [ESTIMATE, [estimate]],
  [DP, [decimalPlaces]],
  [SF, [significant]],
  [INTERVALS, [errorIntervals]],
  [TRUNCATION, [truncation]],
  [LIMITS, [limits]],
  [STANDARD, [standardForm]],
  [CALCULATE, [calculate]],
];
