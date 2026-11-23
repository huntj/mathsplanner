// GCSE Higher, "Statistics", on the stepped template (docs/proposals/lesson-stepped.md):
// histograms with unequal classes, cumulative frequency, quartiles and box plots. Histograms,
// curves and box plots carry their own scales, so questions asked on them keep numbers out of
// the words; the rest is number work.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import {
  boxPlots,
  cfCurve,
  cfQuartiles,
  ghData,
  histo,
  histogram,
  oneClass,
  times,
  twoClasses,
} from "./gh-data.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const DA = ghData;
const NUMBER = "A data fact: the numbers are the picture.";
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
// Histograms with unequal classes.

const HIST = "gh-data/histograms";
const histMethod = [
  "Class width: upper − lower.",
  "Frequency density = frequency ÷ width.",
  "Frequency = area = width × density.",
];
const density = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Frequency ÷ width.", { asks: "density", ...extra });
const area = (
  picture: Picture,
  prompt: string,
  right: string,
  others: string[],
  extra: object = {},
) =>
  pick(prompt, right, others, "Width × height of the bar.", {
    asks: "frequency",
    picture,
    ...extra,
  });

const histograms = stepped(find(DA, HIST), {
  method: histMethod,
  variation: {
    relationship: "area as frequency",
    unknowns: ["density", "frequency"],
    surface: ["a wider class", "a taller bar", "the narrow bar"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Area, not height",
        ["**Frequency density = frequency ÷ class width. The area of a bar is its frequency.**"],
        histo,
        "A tall bar might just be narrow.",
      ),
      reworded(DA, HIST, "Frequency density of 45 in a width of 15", {
        tag: "The rule",
        picture: times,
      }),

      ...owned(DA, HIST, "Warm-up", "Check you remember"),

      methodCard("The method", histMethod, histo),
      workedFrom(DA, HIST),
      calc(
        "Your turn",
        "Find each frequency density.",
        table(
          ["Mass, $m$ (kg)", "Frequency"],
          [
            ["$0 < m \\le 20$", "40"],
            ["$20 < m \\le 25$", "35"],
          ],
        ),
        [
          ["First class:", "2", "40 ÷ 20."],
          ["Second class:", "7", "35 ÷ 5."],
        ],
        "Densities 2 and 7.",
      ),

      calc(
        "Practise",
        "A bar from 10 to 25 has density 4.",
        undefined,
        [
          ["Width:", "15", "25 − 10."],
          ["Frequency:", "60", "15 × 4."],
        ],
        "60.",
      ),
      reworded(DA, HIST, "Estimate how many took more than 20 minutes", {
        tag: "Practise",
        title: "Estimate how many took more than twenty minutes.",
      }),
      reworded(DA, HIST, "On a histogram, the frequency of a class is", { tag: "Practise" }),
      ...owned(DA, HIST, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Frequency density. Watch what changes.",
        [
          density("Frequency 30, width 10", "3", ["300", "0.33"]),
          density("Frequency 30, width 5", "6", ["150", "3"], { changed: "Narrower." }),
          density("Frequency 30, width 20", "1.5", ["600", "3"], { changed: "Wider." }),
          density("Frequency 45, width 15", "3", ["675", "30"], { changed: "New numbers." }),
        ],
        "Narrow classes get taller bars.",
      ),

      questionSet(
        "Variation",
        "Frequency from a bar. Watch what changes.",
        [
          area(histo, "Frequency of the widest bar?", "45", ["3", "15"], {
            expect: [
              "Ben works out density as width ÷ frequency. Right?",
              "No",
              "Density = frequency ÷ width.",
              [["Yes", "Which goes on top?"]],
            ],
          }),
          area(histo, "Frequency of the tallest bar?", "30", ["6", "5"], {
            changed: "The tallest bar.",
          }),
          area(histo, "Frequency of the first bar?", "20", ["2", "10"], {
            changed: "The first bar.",
          }),
          area(
            histogram(
              [
                [0, 10, 3],
                [10, 30, 1],
              ],
              [0, 10, 30],
              [1, 2, 3],
            ),
            "Frequency of the wide bar?",
            "20",
            ["1", "10"],
            { changed: "A new histogram." },
          ),
        ],
        "Frequency is the area, not the height.",
      ),
      own(DA, HIST, "Spot the mistake"),

      own(DA, HIST, "Exit check"),

      reworded(
        DA,
        HIST,
        "“Estimate how many took more than 20 minutes.”",
        { tag: "Real life", title: "Homework times. Estimate how many took over twenty minutes." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Frequency density = frequency ÷ class width. The area of a bar is its frequency.**"],
        histo,
        [
          "**Frequency density = frequency ÷ class width. The area of a bar is its frequency.**",
          "Frequency = width × density.",
          "No gaps between bars.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Cumulative frequency graphs.

const CF = "gh-data/cumulative-frequency";
const cfMethod = [
  "Add up the running totals.",
  "Plot each at the upper end of its class.",
  "Join with a smooth curve; read across and down.",
];
const above = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Below: read it. Above: total − below.", {
    asks: "count",
    ...extra,
  });

const cumulative = stepped(find(DA, CF), {
  method: cfMethod,
  variation: {
    relationship: "a running total read from a curve",
    unknowns: ["total", "count"],
    surface: ["above, not below", "a bigger total", "between two values"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Totals so far",
        ["**Cumulative frequency is a running total, plotted at each class's upper end.**"],
        cfCurve,
        "The curve ends at the total: everyone.",
      ),
      reworded(DA, CF, "Plot the total for $150 < h \\le 160$ at", { tag: "The rule" }),

      ...owned(DA, CF, "Warm-up", "Check you remember"),

      methodCard("The method", cfMethod, cfCurve),
      workedFrom(DA, CF),
      calc(
        "Your turn",
        "Frequencies 6, 14, 20, 10. Find the running totals.",
        undefined,
        [
          ["Second total:", "20", "6 + 14."],
          ["Third total:", "40", "20 + 20."],
          ["Last total:", "50", "40 + 10."],
        ],
        "6, 20, 40, 50.",
      ),

      calc(
        "Practise",
        "Read the heights curve.",
        cfCurve,
        [
          ["At 170 cm or shorter:", "66", "Up from 170, across."],
          ["Taller than 170 cm:", "14", "80 − 66."],
        ],
        "14 pupils are taller.",
      ),
      ...owned(DA, CF, "Together", "Practise"),
      ...owned(DA, CF, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The last running total. Watch what changes.",
        [
          pick("Frequencies 3, 7, 10", "20", ["10", "17"], "Add them all.", { asks: "total" }),
          pick("Frequencies 3, 7, 10, 5", "25", ["5", "20"], "Add them all.", {
            asks: "total",
            changed: "One more class.",
          }),
          pick("Frequencies 30, 70, 100", "200", ["100", "170"], "Add them all.", {
            asks: "total",
            changed: "Ten times as many.",
          }),
          pick("Running totals 4, 11, 19: the second frequency", "7", ["11", "15"], "11 − 4.", {
            asks: "total",
            changed: "Working back.",
          }),
        ],
        "The last total is everyone.",
      ),

      questionSet(
        "Variation",
        "80 pupils in all. Watch what changes.",
        [
          above("48 are 165 cm or shorter. How many are taller?", "32", ["48", "128"], {
            expect: [
              "Leo reads 48 at 165 cm and says 48 are taller. Right?",
              "No",
              "The curve counts those at or below: taller is $80 - 48 = 32$.",
              [["Yes", "Does the curve count above or below?"]],
            ],
          }),
          above("48 are 165 cm or shorter. How many are that or shorter?", "48", ["32", "80"], {
            changed: "Below, not above.",
          }),
          above("30 are 160 cm or shorter. How many are taller?", "50", ["30", "110"], {
            changed: "A lower height.",
          }),
          above("30 at or below 160, 66 at or below 170. Between?", "36", ["66", "96"], {
            changed: "Between two heights.",
          }),
        ],
        "Above: total − below. Between: subtract the readings.",
      ),
      own(DA, CF, "Spot the mistake"),

      own(DA, CF, "Exit check"),

      reworded(
        DA,
        CF,
        "“Estimate how many are taller than 165 cm.”",
        { tag: "Real life", title: "Pupils' heights. Estimate how many are over 165 cm." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Cumulative frequency is a running total, plotted at each class's upper end.**"],
        cfCurve,
        [
          "**Cumulative frequency is a running total, plotted at each class's upper end.**",
          "The curve counts at or below a value.",
          "Above: total − reading.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Quartiles and the interquartile range.

const QUART = "gh-data/quartiles";
const quartMethod = [
  "Q1 at ¼ of the total, median at ½, Q3 at ¾.",
  "Read across to the curve, then down.",
  "IQR = Q3 − Q1.",
];
const at = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "A quarter, a half or three quarters of the total.", {
    asks: "read",
    ...extra,
  });

const quartiles = stepped(find(DA, QUART), {
  method: quartMethod,
  variation: {
    relationship: "quarter points and the spread between",
    unknowns: ["read", "iqr"],
    surface: ["the median", "the upper quartile", "a bigger total"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Quarter points",
        ["**Read the quarter, half and three-quarter points. IQR = Q3 − Q1.**"],
        cfQuartiles,
        "The IQR is the spread of the middle half.",
      ),
      reworded(DA, QUART, "For 80 values, read Q1 at a cumulative frequency of", {
        tag: "The rule",
        title: "On this curve, read Q1 at which cumulative frequency?",
      }),

      ...owned(DA, QUART, "Warm-up", "Check you remember"),

      methodCard("The method", quartMethod, cfQuartiles),
      workedFrom(DA, QUART),
      calc(
        "Your turn",
        "Quartiles of 2, 4, 5, 7, 9, 10, 12.",
        undefined,
        [
          ["Median:", "7", "The 4th value."],
          ["Q1:", "4", "Middle of the lower half."],
          ["Q3:", "10", "Middle of the upper half."],
          ["IQR:", "6", "10 − 4."],
        ],
        "IQR = 6.",
      ),

      calc(
        "Practise",
        "Find the quartiles.",
        { kind: "maths", tex: "1,\\ 3,\\ 4,\\ 6,\\ 8,\\ 9,\\ 11,\\ 13,\\ 14,\\ 16,\\ 20" },
        [
          ["Median:", "9", "The 6th value."],
          ["Q1:", "4", "The 3rd value."],
          ["Q3:", "14", "The 9th value."],
        ],
        "IQR = 14 − 4 = 10.",
      ),
      ...owned(DA, QUART, "Together", "Practise"),
      ...owned(DA, QUART, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Read across at which total? Watch what changes.",
        [
          at("Q1 of 80 values", "20", ["40", "25"]),
          at("Median of 80 values", "40", ["20", "50"], { changed: "The median." }),
          at("Q3 of 80 values", "60", ["40", "75"], { changed: "The upper quartile." }),
          at("Q3 of 200 values", "150", ["60", "100"], { changed: "More values." }),
        ],
        "¼, ½ and ¾ of the total.",
      ),

      questionSet(
        "Variation",
        "The IQR. Watch what changes.",
        [
          pick("Q1 = 155.5 cm, Q3 = 168.3 cm", "12.8 cm", ["40", "323.8 cm"], "Q3 − Q1.", {
            asks: "iqr",
            expect: [
              "Ben reads Q1 at 20 and Q3 at 60, then says the IQR is 40. Right?",
              "No",
              "Subtract the heights, not the totals: about 13 cm.",
              [["Yes", "Is the IQR a height or a count?"]],
            ],
          }),
          pick("Q1 = 24, Q3 = 39", "15", ["63", "39"], "39 − 24.", {
            asks: "iqr",
            changed: "New values.",
          }),
          pick("Q1 = 24, Q3 = 39, max = 80", "15", ["56", "41"], "The max doesn't matter.", {
            asks: "iqr",
            changed: "An outlier.",
          }),
          pick("Q1 = 2.5, Q3 = 4.1", "1.6", ["6.6", "4.1"], "4.1 − 2.5.", {
            asks: "iqr",
            changed: "Decimals.",
          }),
        ],
        "IQR ignores the extremes.",
      ),
      own(DA, QUART, "Spot the mistake"),

      own(DA, QUART, "Exit check"),

      reworded(
        DA,
        QUART,
        "“Estimate the median and the IQR.”",
        { tag: "Real life", title: "Estimate the median height and the IQR." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Read the quarter, half and three-quarter points. IQR = Q3 − Q1.**"],
        cfQuartiles,
        [
          "**Read the quarter, half and three-quarter points. IQR = Q3 − Q1.**",
          "Read the totals across, the values down.",
          "IQR: not affected by extremes.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Box plots.

const BOX = "gh-data/box-plots";
const boxMethod = [
  "Read min, Q1, median, Q3 and max.",
  "Compare medians: which is higher on average?",
  "Compare IQRs: which is more consistent?",
];
const compare = (
  picture: Picture,
  prompt: string,
  right: string,
  others: string[],
  extra: object = {},
) =>
  pick(prompt, right, others, "Median for average; IQR for consistency.", {
    asks: "compare",
    picture,
    ...extra,
  });
const SAME_SPREAD = boxPlots([
  ["B", [15, 25, 35, 40, 55]],
  ["A", [10, 30, 38, 45, 50]],
]);
const WIDE_B = boxPlots([
  ["B", [5, 15, 40, 50, 58]],
  ["A", [20, 32, 36, 40, 45]],
]);

const boxPlotsLesson = stepped(find(DA, BOX), {
  method: boxMethod,
  variation: {
    relationship: "medians and IQRs compared",
    unknowns: ["read", "compare"],
    surface: ["consistency", "a wider box", "the lowest"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Reading a box plot",
        ["**Compare medians for the average and IQRs for consistency, in context.**"],
        twoClasses,
        "The line in the box is the median.",
      ),
      reworded(DA, BOX, "10A's median score", {
        tag: "The rule",
        title: "The top class's median score",
      }),

      ...owned(DA, BOX, "Warm-up", "Check you remember"),

      methodCard("The method", boxMethod, twoClasses),
      workedFrom(DA, BOX),
      calc(
        "Your turn",
        "Read the box plot.",
        oneClass,
        [
          ["Median:", "38", "The line in the box."],
          ["IQR:", "15", "Right of box − left of box."],
          ["Range:", "40", "Max − min."],
        ],
        "Median 38, IQR 15, range 40.",
      ),

      calc(
        "Practise",
        "Min 4, Q1 9, median 12, Q3 16, max 25.",
        undefined,
        [
          ["IQR:", "7", "16 − 9."],
          ["Range:", "21", "25 − 4."],
        ],
        "IQR 7, range 21.",
      ),
      ...owned(DA, BOX, "Together", "Practise"),
      reworded(DA, BOX, "10B's IQR", { tag: "Practise", title: "The lower box plot's IQR" }),
      reworded(DA, BOX, "Which class's lowest score was lower?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Read the box plot. Watch what changes.",
        [
          pick("Its median", "38", ["30", "45"], "The line in the box.", {
            asks: "read",
            picture: oneClass,
          }),
          pick("Its lower quartile", "30", ["10", "38"], "The left of the box.", {
            asks: "read",
            picture: oneClass,
            changed: "Q1.",
          }),
          pick("Its upper quartile", "45", ["50", "38"], "The right of the box.", {
            asks: "read",
            picture: oneClass,
            changed: "Q3.",
          }),
          pick("Its highest value", "50", ["45", "60"], "The end of the right whisker.", {
            asks: "read",
            picture: oneClass,
            changed: "The max.",
          }),
        ],
        "Five marks: min, Q1, median, Q3, max.",
      ),

      questionSet(
        "Variation",
        "Compare A and B. Watch what changes.",
        [
          compare(
            SAME_SPREAD,
            "Higher on average?",
            "A: higher median",
            ["B: higher median", "The same"],
            {
              expect: [
                "Leo says A's box is further right, so A is more consistent. Right?",
                "No",
                "Position shows the average; box width (IQR) shows consistency.",
                [["Yes", "What does the width of the box show?"]],
              ],
            },
          ),
          compare(SAME_SPREAD, "More consistent?", "The same: equal IQRs", ["A", "B"], {
            changed: "Consistency.",
          }),
          compare(WIDE_B, "More consistent?", "A: smaller IQR", ["B: smaller IQR", "The same"], {
            changed: "A wider box.",
          }),
          compare(
            WIDE_B,
            "Higher on average?",
            "B: higher median",
            ["A: higher median", "The same"],
            {
              changed: "New medians.",
            },
          ),
        ],
        "Say which, what it means, and give the values.",
      ),
      own(DA, BOX, "Spot the mistake"),

      own(DA, BOX, "Exit check"),

      reworded(
        DA,
        BOX,
        "“Compare the two distributions.”",
        { tag: "Real life", title: "Two classes' test scores. Compare the two distributions." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Compare medians for the average and IQRs for consistency, in context.**"],
        twoClasses,
        [
          "**Compare medians for the average and IQRs for consistency, in context.**",
          "Box: Q1 to Q3. Line: the median.",
          "Smaller IQR: more consistent.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const ghDataStepped: [string, UnitLesson[]][] = [
  [HIST, [histograms]],
  [CF, [cumulative]],
  [QUART, [quartiles]],
  [BOX, [boxPlotsLesson]],
];
