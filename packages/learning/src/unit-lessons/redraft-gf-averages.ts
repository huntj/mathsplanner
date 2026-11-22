// GCSE Foundation, "Averages, spread and correlation", on the stepped template
// (docs/proposals/lesson-stepped.md): mean, median and mode; estimating a grouped mean; range and
// comparing; samples and populations; correlation; and lines of best fit. Lists of numbers are
// their own picture; tables and scatter graphs are drawn wherever a question reads them.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfAverages, grouped, revision, scatter } from "./gf-averages.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, Screen, UnitLesson } from "./types.ts";

const AV = gfAverages;
const NUMBER = "A data fact: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const steps = (...lines: string[]): Picture =>
  maths(`\\begin{array}{l} ${lines.join(" \\\\ ")} \\end{array}`);
const table = (head: string[], rows: string[][]): Picture => ({ kind: "table", head, rows });
const pts = (...ys: number[]): Point[] => ys.map((y, i) => ({ x: i + 1, y }));
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";
/** A lesson's own worked example, with its question or its picture given in full. */
const workedWith = (id: string, changes: { problem?: string; picture?: Picture }): Screen => {
  const w = workedFrom(AV, id);
  return w.kind === "worked" ? { ...w, ...changes } : w;
};

// ---------------------------------------------------------------------------------------------
// Mean, median and mode.

const AVERAGES = "gf-averages/averages";
const avMethod = [
  "Mean: add them all, ÷ how many.",
  "Median: put them in order, take the middle.",
  "Mode: the most common.",
];
const THREE = steps(
  "2,\\ 4,\\ 4,\\ 8,\\ 12",
  "\\text{mean} = 30 \\div 5 = 6",
  "\\text{median} = 4,\\ \\text{mode} = 4",
);

const averages = stepped(find(AV, AVERAGES), {
  method: avMethod,
  variation: {
    relationship: "three averages of one list",
    unknowns: ["median", "mean"],
    surface: ["more values", "an outlier", "a negative"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three averages",
        ["**Mean: total ÷ how many. Median: the middle, in order. Mode: the most common.**"],
        THREE,
        "An outlier pulls the mean, not the median.",
      ),
      reworded(AV, AVERAGES, "Median of 3, 9, 4, 7, 2", { tag: "The rule" }),

      ...owned(AV, AVERAGES, "Warm-up", "Check you remember"),

      methodCard("The method", avMethod, THREE),
      workedWith(AVERAGES, {
        problem: "Pay: £18k, £20k, £21k, £22k, £99k. Mean or median: which is better?",
      }),
      calc(
        "Your turn",
        "Find the averages of 2, 9, 4, 5.",
        undefined,
        [
          ["Total:", "20", "Add them."],
          ["Mean:", "5", "20 ÷ 4."],
          ["Median:", "4.5", "Order: 2, 4, 5, 9. Halfway between 4 and 5."],
        ],
        "Mean 5, median 4.5.",
      ),

      calc(
        "Practise",
        "Four numbers have mean 7. Three are 5, 6 and 10.",
        undefined,
        [
          ["Total of all four:", "28", "7 × 4."],
          ["The fourth number:", "7", "28 − 21."],
        ],
        "The fourth is 7.",
      ),
      ...owned(AV, AVERAGES, "Together", "Practise"),
      ...owned(AV, AVERAGES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find the median. Watch what changes.",
        [
          pick("5, 1, 8", "5", ["1", "8"], "Order: 1, 5, 8.", { asks: "median" }),
          pick("5, 1, 8, 4", "4.5", ["5", "8"], "Order: 1, 4, 5, 8.", {
            asks: "median",
            changed: "Four values.",
          }),
          pick("5, 1, 8, 4, 20", "5", ["7.6", "8"], "Order: 1, 4, 5, 8, 20.", {
            asks: "median",
            changed: "An outlier.",
          }),
          pick("5, 1, 8, 4, 20, 2", "4.5", ["8", "6.67"], "Order: 1, 2, 4, 5, 8, 20.", {
            asks: "median",
            changed: "Six values.",
          }),
        ],
        "Order first. Even count: halfway between the middle two.",
      ),

      questionSet(
        "Variation",
        "Find the mean. Watch what changes.",
        [
          pick("4, 6, 8, 10", "7", ["14", "28"], "28 ÷ 4.", {
            asks: "mean",
            expect: [
              "For the mean of 4, 6, 8, 10, Leo does $28 \\div 2$. Right?",
              "No",
              "Divide by how many there are: $28 \\div 4 = 7$.",
              [["Yes", "How many values are there?"]],
            ],
          }),
          pick("4, 6, 8, 10, 12", "8", ["10", "7"], "40 ÷ 5.", {
            asks: "mean",
            changed: "One more value.",
          }),
          pick("4, 6, 8, 10, 32", "12", ["8", "15"], "60 ÷ 5.", {
            asks: "mean",
            changed: "An outlier.",
          }),
          pick("−4, 6, 8, 10", "5", ["7", "3"], "20 ÷ 4.", {
            asks: "mean",
            changed: "A negative.",
          }),
        ],
        "An outlier drags the mean.",
      ),
      own(AV, AVERAGES, "Spot the mistake"),

      own(AV, AVERAGES, "Exit check"),

      reworded(
        AV,
        AVERAGES,
        "“Pay: £18k, £20k, £21k, £22k, £99k. Is the mean a good average? Give a reason.”",
        { tag: "Real life", title: "Pay: £18k, £20k, £21k, £22k, £99k. Is the mean fair?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Mean: total ÷ how many. Median: the middle, in order. Mode: the most common.**"],
        THREE,
        [
          "**Mean: total ÷ how many. Median: the middle, in order. Mode: the most common.**",
          "Order the values before finding the median.",
          "With an outlier, use the median.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Averages from grouped data.

const GROUPED = "gf-averages/grouped";
const groupMethod = [
  "Find each class's midpoint.",
  "Midpoint × frequency, then add.",
  "÷ the total frequency.",
];
const MIDS = table(
  ["Length (cm)", "Midpoint", "Frequency", "Mid × freq"],
  [
    ["$0 \\le x < 20$", "10", "2", "20"],
    ["$20 \\le x < 40$", "30", "5", "150"],
    ["$40 \\le x < 60$", "50", "3", "150"],
  ],
);
const times = (...f: number[]): Picture =>
  table(
    ["Time (min)", "Frequency"],
    f.map((n, i) => [`$${i * 10} \\le t < ${i * 10 + 10}$`, `${n}`]),
  );
const wide = (...f: number[]): Picture =>
  table(
    ["Time (min)", "Frequency"],
    f.map((n, i) => [`$${i * 20} \\le t < ${i * 20 + 20}$`, `${n}`]),
  );
const estimate = (
  picture: Picture,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => pick("Estimate the mean time.", right, others, hint, { asks: "mean", picture, ...extra });

const groupedLesson = stepped(find(AV, GROUPED), {
  method: groupMethod,
  variation: {
    relationship: "midpoints stand in for each class",
    unknowns: ["midpoint", "mean"],
    surface: ["wider classes", "frequencies swapped", "more in the top class"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Midpoints stand in",
        ["**Estimate the mean: midpoint × frequency, add, then ÷ the total frequency.**"],
        MIDS,
        "Here, $320 \\div 10 = 32$ cm.",
      ),
      reworded(AV, GROUPED, "The modal class", { tag: "The rule", picture: grouped }),

      ...owned(AV, GROUPED, "Warm-up", "Check you remember"),

      methodCard("The method", groupMethod, MIDS),
      workedWith(GROUPED, { picture: grouped }),
      calc(
        "Your turn",
        "Estimate the mean.",
        table(
          ["Mass (kg)", "Frequency"],
          [
            ["$0 \\le m < 10$", "3"],
            ["$10 \\le m < 20$", "5"],
            ["$20 \\le m < 30$", "2"],
          ],
        ),
        [
          ["Total of midpoint × frequency:", "140", "Midpoints 5, 15, 25."],
          ["Total frequency:", "10", "Add the frequencies."],
          ["Estimated mean:", "14", "140 ÷ 10.", { after: "kg" }],
        ],
        "About 14 kg.",
      ),

      calc(
        "Practise",
        "Estimate the mean.",
        table(
          ["Hours", "Frequency"],
          [
            ["$0 \\le h < 4$", "6"],
            ["$4 \\le h < 8$", "2"],
            ["$8 \\le h < 12$", "2"],
          ],
        ),
        [
          ["Total of midpoint × frequency:", "44", "Midpoints 2, 6, 10."],
          ["Estimated mean:", "4.4", "÷ the total frequency.", { after: "hours" }],
        ],
        "About 4.4 hours.",
      ),
      ...owned(AV, GROUPED, "Together", "Practise"),
      reworded(AV, GROUPED, "Midpoints 5, 15 with frequencies 2, 8: estimated mean", {
        tag: "Practise",
      }),
      reworded(AV, GROUPED, "In the homework table, the median class", {
        tag: "Practise",
        title: "The median class",
        picture: grouped,
      }),
      questionSet(
        "Practise",
        "Find the midpoint. Watch what changes.",
        [
          pick("$10 \\le t < 20$", "15", ["10", "20"], "Halfway.", { asks: "midpoint" }),
          pick("$10 \\le t < 30$", "20", ["15", "30"], "Halfway.", {
            asks: "midpoint",
            changed: "Wider.",
          }),
          pick("$0 \\le t < 5$", "2.5", ["5", "2"], "Half of 5.", {
            asks: "midpoint",
            changed: "Narrow.",
          }),
          pick("$100 \\le t < 150$", "125", ["150", "50"], "Halfway.", {
            asks: "midpoint",
            changed: "Bigger numbers.",
          }),
        ],
        "Midpoint: add the ends, ÷ 2.",
      ),

      questionSet(
        "Variation",
        "Estimate the mean. Watch what changes.",
        [
          estimate(times(2, 2), "10", ["20", "15"], "40 ÷ 4.", {
            expect: [
              "Mia divides by 2, the number of classes. Right?",
              "No",
              "Divide by the total frequency.",
              [["Yes", "How many people are in the table?"]],
            ],
          }),
          estimate(times(1, 3), "12.5", ["25", "10"], "50 ÷ 4.", {
            changed: "More in the top class.",
          }),
          estimate(times(3, 1), "7.5", ["15", "12.5"], "30 ÷ 4.", { changed: "Swapped." }),
          estimate(wide(2, 2), "20", ["40", "10"], "80 ÷ 4.", { changed: "Wider classes." }),
        ],
        "÷ the total frequency, not the classes.",
      ),
      own(AV, GROUPED, "Spot the mistake"),

      own(AV, GROUPED, "Exit check"),

      reworded(
        AV,
        GROUPED,
        "“Work out an estimate for the mean homework time.”",
        { tag: "Real life", picture: grouped },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Estimate the mean: midpoint × frequency, add, then ÷ the total frequency.**"],
        MIDS,
        [
          "**Estimate the mean: midpoint × frequency, add, then ÷ the total frequency.**",
          "Divide by the total frequency, not the classes.",
          "It's an estimate: we don't know the exact values.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Range, outliers and comparing.

const RANGE = "gf-averages/range-outliers";
const rangeMethod = [
  "Range: highest − lowest.",
  "Compare an average: who did better?",
  "Compare the range: who was more consistent?",
];
const SHOPS = table(
  ["", "Mean", "Range"],
  [
    ["Shop P", "£40", "£5"],
    ["Shop Q", "£35", "£20"],
  ],
);
const TEAMS = table(
  ["", "Median", "Range"],
  [
    ["Team A", "15", "4"],
    ["Team B", "15", "20"],
  ],
);
const RUNNERS = table(
  ["Runner", "Median (s)", "Range (s)"],
  [
    ["A", "12.1", "0.3"],
    ["B", "12.4", "0.8"],
  ],
);
const SCORES = table(
  ["Team", "Median", "Range"],
  [
    ["A", "15", "4"],
    ["B", "18", "20"],
  ],
);

const range = stepped(find(AV, RANGE), {
  method: rangeMethod,
  variation: {
    relationship: "an average and a spread, compared",
    unknowns: ["range", "compare"],
    surface: ["times, not scores", "spread or average", "an outlier"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Average and spread",
        ["**Compare an average and the range, and say what each shows.**"],
        SHOPS,
        "P takes more on average, and is more consistent.",
      ),
      reworded(AV, RANGE, "Which team is more consistent?", { tag: "The rule", picture: TEAMS }),

      ...owned(AV, RANGE, "Warm-up", "Check you remember"),

      methodCard("The method", rangeMethod, SHOPS),
      workedWith(RANGE, { picture: TEAMS }),
      calc(
        "Your turn",
        "Find each range.",
        table(
          ["", "Scores"],
          [
            ["Amy", "4, 7, 9, 6"],
            ["Ben", "2, 10, 8, 4"],
          ],
        ),
        [
          ["Amy's range:", "5", "Highest − lowest."],
          ["Ben's range:", "8", "Highest − lowest."],
        ],
        "Amy is more consistent.",
      ),

      calc(
        "Practise",
        "Heights: 151, 148, 155, 210, 150 cm.",
        undefined,
        [
          ["The outlier:", "210", "Far from the rest.", { after: "cm" }],
          ["Range without it:", "7", "155 − 148.", { after: "cm" }],
        ],
        "Check an outlier is real before you leave it out.",
      ),
      ...owned(AV, RANGE, "Together", "Practise"),
      reworded(
        AV,
        RANGE,
        "Class X: mean 62, range 10. Class Y: mean 58, range 30. Which is true?",
        {
          tag: "Practise",
          title: "Which is true?",
          picture: table(
            ["", "Mean", "Range"],
            [
              ["Class X", "62", "10"],
              ["Class Y", "58", "30"],
            ],
          ),
        },
      ),
      reworded(AV, RANGE, "What does a larger range show?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Find the range. Watch what changes.",
        [
          pick("4, 9, 2, 7", "7", ["5", "9"], "9 − 2.", { asks: "range" }),
          pick("4, 9, 2, 7, 30", "28", ["7", "26"], "30 − 2.", {
            asks: "range",
            changed: "An outlier.",
          }),
          pick("4, 9, −2, 7", "11", ["7", "9"], "9 − (−2).", {
            asks: "range",
            changed: "A negative.",
          }),
          pick("4, 4, 4, 4", "0", ["4", "16"], "4 − 4.", {
            asks: "range",
            changed: "All the same.",
          }),
        ],
        "Highest − lowest, whatever the order.",
      ),

      questionSet(
        "Variation",
        "Compare. Watch what changes.",
        [
          pick(
            "Who is faster on average?",
            "A: lower median",
            ["B: higher median", "They're the same"],
            "Less time is faster.",
            {
              asks: "compare",
              picture: RUNNERS,
              expect: [
                "Kim says B is faster, as B's median is higher. Right?",
                "No",
                "For times, lower is faster: A is faster.",
                [["Yes", "Is more time faster or slower?"]],
              ],
            },
          ),
          pick(
            "Who is more consistent?",
            "A: smaller range",
            ["B: bigger range", "They're the same"],
            "Smaller range, more consistent.",
            { asks: "compare", picture: RUNNERS, changed: "Spread, not average." },
          ),
          pick(
            "Who scored more on average?",
            "B: higher median",
            ["A: lower median", "They're the same"],
            "For scores, higher is better.",
            { asks: "compare", picture: SCORES, changed: "Scores, not times." },
          ),
          pick(
            "Who is more consistent?",
            "A: smaller range",
            ["B: bigger range", "They're the same"],
            "Smaller range, more consistent.",
            { asks: "compare", picture: SCORES, changed: "Spread again." },
          ),
        ],
        "Say who, and what it means.",
      ),
      own(AV, RANGE, "Spot the mistake"),

      own(AV, RANGE, "Exit check"),

      reworded(
        AV,
        RANGE,
        "“Compare the scores of Team A and Team B.”",
        {
          tag: "Real life",
          picture: table(
            ["Team", "Scores"],
            [
              ["A", "12, 14, 15, 15, 16"],
              ["B", "5, 10, 15, 20, 25"],
            ],
          ),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Compare an average and the range, and say what each shows.**"],
        SHOPS,
        [
          "**Compare an average and the range, and say what each shows.**",
          "Smaller range: more consistent.",
          "For times, a lower average is better.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Statistics about a population.

const POP = "gf-averages/populations";
const popMethod = [
  "Check the sample is random and big enough.",
  "Use its mean as an estimate.",
  "Say “about”, and give the limits.",
];
const BOOKS = steps(
  "\\text{sample mean: } 4 \\text{ books}",
  "300 \\text{ pupils}",
  "\\text{total} \\approx 4 \\times 300 = 1200",
);
const SAMPLE = table(
  ["Sample", "Value"],
  [
    ["Size", "50"],
    ["Mean", "3.2 h"],
    ["Range", "6 h"],
  ],
);

const populations = stepped(find(AV, POP), {
  method: popMethod,
  variation: {
    relationship: "a sample mean scaled up to the population",
    unknowns: ["sample", "total"],
    surface: ["twice the pupils", "a smaller mean", "a mean under 1"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "From sample to population",
        ["**A random sample estimates the whole population. Bigger samples are better.**"],
        BOOKS,
        "Say “about”: it's an estimate.",
      ),
      reworded(AV, POP, "A sensible conclusion", { tag: "The rule", picture: SAMPLE }),

      ...owned(AV, POP, "Warm-up", "Check you remember"),

      methodCard("The method", popMethod, BOOKS),
      workedWith(POP, {
        problem: "Sample mean 3.2 hours a day. 1000 pupils. Estimate the school's total.",
      }),
      calc(
        "Your turn",
        "A sample has a mean of 1.5 pets per home. 800 homes.",
        undefined,
        [["Estimated total pets:", "1200", "1.5 × 800."]],
        "About 1200 pets.",
      ),

      calc(
        "Practise",
        "20 random pupils of 500: 4 walk to school.",
        undefined,
        [
          ["Per cent who walk:", "20", "4 out of 20.", { after: "%" }],
          ["Estimated walkers:", "100", "20% of 500."],
        ],
        "About 100 walk.",
      ),
      ...owned(AV, POP, "Together", "Practise"),
      reworded(AV, POP, "A sample of 10 shows mean height 160 cm. How reliable?", {
        tag: "Practise",
      }),
      reworded(
        AV,
        POP,
        "Sample mean £4 spent a day; 600 pupils. Estimated total a day, in pounds?",
        { tag: "Practise", title: "Sample mean £4 a day; 600 pupils. Total a day, in £?" },
      ),
      questionSet(
        "Practise",
        "Which sample is better? Watch what changes.",
        [
          pick(
            "10 random pupils, or 100 random pupils?",
            "100 random pupils",
            ["10 random pupils", "Both the same"],
            "Bigger is better.",
            { asks: "sample" },
          ),
          pick(
            "100 from one class, or 50 at random?",
            "50 at random",
            ["100 from one class", "Both the same"],
            "One class may not be typical.",
            { asks: "sample", changed: "Random against one group." },
          ),
          pick(
            "Exercise: ask at a gym, or random adults?",
            "Random adults",
            ["At a gym", "Both the same"],
            "Gym-goers exercise more.",
            { asks: "sample", changed: "Where you ask." },
          ),
          pick(
            "Ask at 9 am on Mondays, or at random times?",
            "At random times",
            ["At 9 am on Mondays", "Both the same"],
            "Some people are never there at 9.",
            { asks: "sample", changed: "When you ask." },
          ),
        ],
        "Random and big enough.",
      ),

      questionSet(
        "Variation",
        "Estimate the total. Watch what changes.",
        [
          pick(
            "Mean 3 books each; 200 pupils",
            "About 600",
            ["About 203", "About 67"],
            "3 × 200.",
            {
              asks: "total",
              expect: [
                "Ned says every pupil has exactly 3 books. Right?",
                "No",
                "3 is the mean: a typical value, not everyone's.",
                [["Yes", "Could some pupils have 10 books?"]],
              ],
            },
          ),
          pick(
            "Mean 3 books each; 400 pupils",
            "About 1200",
            ["About 600", "About 403"],
            "3 × 400.",
            { asks: "total", changed: "Twice the pupils." },
          ),
          pick(
            "Mean 1.5 books each; 400 pupils",
            "About 600",
            ["About 1200", "About 401.5"],
            "1.5 × 400.",
            { asks: "total", changed: "Half the mean." },
          ),
          pick(
            "Mean 0.5 books each; 400 pupils",
            "About 200",
            ["About 800", "About 400"],
            "0.5 × 400.",
            { asks: "total", changed: "A mean under 1." },
          ),
        ],
        "Mean × how many, and say “about”.",
      ),
      own(AV, POP, "Spot the mistake"),

      own(AV, POP, "Exit check"),

      reworded(
        AV,
        POP,
        "“Mean 3.2 hours, range 6 hours, random sample of 50. What can you say about the school?”",
        { tag: "Real life", title: "What can you say about the whole school?", picture: SAMPLE },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A random sample estimates the whole population. Bigger samples are better.**"],
        BOOKS,
        [
          "**A random sample estimates the whole population. Bigger samples are better.**",
          "Total ≈ sample mean × population.",
          "A biased sample can't describe everyone.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Correlation.

const CORR = "gf-averages/correlation";
const corrMethod = [
  "Read the points left to right.",
  "Up: positive. Down: negative. No pattern: none.",
  "Describe it in context. Don't claim a cause.",
];
const POS = scatter(pts(1.5, 2.5, 3, 4.5, 5, 6.5, 7, 8.5));
const NEG = scatter(pts(8.5, 7.5, 7, 5.5, 5, 4, 3, 1.5));
const WEAK_NEG = scatter(pts(8, 5, 7, 3, 6, 2, 4, 1));
const NONE = scatter(pts(5, 2, 8, 4, 7, 3, 6, 2));
const CAUSE = ["A cause", "A third factor", "Chance"];
const why = (prompt: string, right: string, hint: string, extra: Record<string, unknown> = {}) =>
  pick(
    prompt,
    right,
    CAUSE.filter((c) => c !== right),
    hint,
    { asks: "cause", ...extra },
  );
const kind = (picture: Picture, right: string, extra: Record<string, unknown> = {}) =>
  pick(
    "Which correlation?",
    right,
    ["Positive", "Negative", "None"].filter((c) => c !== right),
    "Left to right: up, down or no pattern?",
    { asks: "type", picture, ...extra },
  );

const correlation = stepped(find(AV, CORR), {
  method: corrMethod,
  variation: {
    relationship: "the trend of the points",
    unknowns: ["type", "cause"],
    surface: ["rising or falling", "no pattern", "spread out"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three kinds",
        ["**Positive: both go up. Negative: one up, one down. None: no pattern.**"],
        NEG,
        "A link doesn't prove one thing causes the other.",
      ),
      reworded(AV, CORR, "Which correlation?", { tag: "The rule" }),

      ...owned(AV, CORR, "Warm-up", "Check you remember"),

      methodCard("The method", corrMethod, scatter(revision)),
      workedFrom(AV, CORR),
      questionSet(
        "Your turn",
        "Name the correlation.",
        [
          kind(POS, "Positive"),
          kind(NEG, "Negative", { changed: "Falling." }),
          kind(NONE, "None", { changed: "Scattered." }),
        ],
        "Follow the points from left to right.",
      ),
      calc(
        "Your turn",
        "Read the revision graph.",
        scatter(revision),
        [
          ["Revised 2 hours: score", "3", "Up from 2 hours."],
          ["Revised 7 hours: score", "8", "Up from 7 hours."],
        ],
        "More revision, higher scores: positive correlation.",
      ),

      ...owned(AV, CORR, "Together", "Practise"),
      ...owned(AV, CORR, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Cause, third factor or chance? Watch what changes.",
        [
          why("Umbrella sales and car crashes rise together.", "A third factor", "Think: rain."),
          why("Press the brake harder: the car slows more.", "A cause", "One makes the other.", {
            changed: "A real cause.",
          }),
          why("Children's shoe size and reading age rise together.", "A third factor", "Age.", {
            changed: "Children.",
          }),
          why("A town's rainfall and a band's sales rise together.", "Chance", "No reason.", {
            changed: "No reason to link them.",
          }),
        ],
        "Correlation alone never proves a cause.",
      ),

      questionSet(
        "Variation",
        "Name the correlation. Watch what changes.",
        [
          kind(NEG, "Negative", {
            expect: [
              "Points fall from left to right. Jo says no correlation. Right?",
              "No",
              "A falling pattern is negative correlation.",
              [["Yes", "Is there a pattern?"]],
            ],
          }),
          kind(POS, "Positive", { changed: "Rising." }),
          kind(NONE, "None", { changed: "No pattern." }),
          kind(WEAK_NEG, "Negative", { changed: "More spread out." }),
        ],
        "Spread out but falling is still negative: just weaker.",
      ),
      own(AV, CORR, "Spot the mistake"),

      own(AV, CORR, "Exit check"),

      reworded(
        AV,
        CORR,
        "“Describe the correlation. Does revising cause higher scores?”",
        { tag: "Real life", picture: scatter(revision) },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Positive: both go up. Negative: one up, one down. None: no pattern.**"],
        NEG,
        [
          "**Positive: both go up. Negative: one up, one down. None: no pattern.**",
          "Close to a line: strong. Spread out: weak.",
          "Correlation isn't causation.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Lines of best fit.

const FIT = "gf-averages/best-fit";
const fitMethod = [
  "Draw a line through the middle, points either side.",
  "Go from the value to the line, then across.",
  "Inside the data: reliable. Outside: risky.",
];
const UP = scatter(revision, [{ m: 1, c: 0.5 }]);
const DOWN = scatter(pts(8, 7.8, 6.2, 5.8, 4.3, 3.8, 2.2, 1.8), [{ m: -1, c: 9.5 }]);
const inside = (prompt: string, right: string, extra: Record<string, unknown> = {}) =>
  pick(
    prompt,
    right,
    ["Inside: reliable", "Outside: risky"].filter((c) => c !== right),
    "Where does the data start and stop?",
    { asks: "inside", picture: UP, ...extra },
  );

const bestFit = stepped(find(AV, FIT), {
  method: fitMethod,
  variation: {
    relationship: "estimates read from the line",
    unknowns: ["inside", "read"],
    surface: ["further along", "read backwards", "a falling line"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Through the middle",
        ["**Draw a line through the middle of the points, and read estimates from it.**"],
        DOWN,
        "Only trust estimates inside the data.",
      ),
      reworded(AV, FIT, "A good line of best fit", { tag: "The rule", picture: UP }),

      ...owned(AV, FIT, "Warm-up", "Check you remember"),

      methodCard("The method", fitMethod, UP),
      workedFrom(AV, FIT),
      calc(
        "Your turn",
        "Use the line of best fit.",
        DOWN,
        [["At $x = 2$, $y \\approx$", "7.5", "Up to the line, then across."]],
        "About 7.5.",
      ),

      calc(
        "Practise",
        "Use the line of best fit.",
        UP,
        [
          ["At $x = 3$, $y \\approx$", "3.5", "Up to the line, then across."],
          ["For $y = 6$, $x \\approx$", "5.5", "Across to the line, then down."],
        ],
        "Read both ways from the line.",
      ),
      ...owned(AV, FIT, "Together", "Practise"),
      ...owned(AV, FIT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Is the estimate inside the data? Watch what changes.",
        [
          inside("An estimate at $x = 5$", "Inside: reliable"),
          inside("An estimate at $x = 12$", "Outside: risky", { changed: "Past the data." }),
          inside("An estimate at $x = 7.5$", "Inside: reliable", { changed: "Near the end." }),
          inside("An estimate at $x = 0$", "Outside: risky", { changed: "Before the data." }),
        ],
        "Inside the data, the line can be trusted.",
      ),

      questionSet(
        "Variation",
        "Read the line. Watch what changes.",
        [
          pick("At $x = 4.5$, $y$ is about", "5", ["4.5", "4"], "Up to the line, across.", {
            asks: "read",
            picture: UP,
            expect: [
              "Ola uses this line to estimate $y$ at $x = 20$. Reliable?",
              "No",
              "20 is far outside the data: the trend may not continue.",
              [["Yes", "Where does the data stop?"]],
            ],
          }),
          pick("At $x = 6.5$, $y$ is about", "7", ["6.5", "6"], "Up to the line, across.", {
            asks: "read",
            picture: UP,
            changed: "Further along.",
          }),
          pick("At $y = 3$, $x$ is about", "2.5", ["3", "3.5"], "Across to the line, down.", {
            asks: "read",
            picture: UP,
            changed: "Read backwards.",
          }),
          pick("At $x = 4.5$, $y$ is about", "5", ["4.5", "6"], "Up to the line, across.", {
            asks: "read",
            picture: DOWN,
            changed: "A falling line.",
          }),
        ],
        "Up to the line, then across.",
      ),
      own(AV, FIT, "Spot the mistake"),

      own(AV, FIT, "Exit check"),

      reworded(
        AV,
        FIT,
        "“Why is it unwise to estimate the score for 20 hours?”",
        { tag: "Real life", picture: UP },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Draw a line through the middle of the points, and read estimates from it.**"],
        DOWN,
        [
          "**Draw a line through the middle of the points, and read estimates from it.**",
          "It needn't go through (0, 0).",
          "Inside the data: reliable. Outside: risky.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfAveragesStepped: [string, UnitLesson[]][] = [
  [AVERAGES, [averages]],
  [GROUPED, [groupedLesson]],
  [RANGE, [range]],
  [POP, [populations]],
  [CORR, [correlation]],
  [FIT, [bestFit]],
];
