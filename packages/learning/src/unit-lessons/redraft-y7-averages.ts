// Year 7, "Averages and spread", on the stepped template (docs/proposals/lesson-stepped.md): the
// mean, the median and mode, the range, and comparing two sets of data. Data is shown as a bar
// chart or a table where that helps; a short list in the question says so.
import { ask, calc, explain, methodCard, questionSet, summary, typed, worked } from "./build.ts";
import { find, numberLine, own, owned, reworded, stepped, words } from "./stepped.ts";
import type { Picture, Screen, UnitLesson } from "./types.ts";
import { y7Averages } from "./y7-averages.ts";

const LIST = "The data is a short list of numbers: it's the picture.";
const list = y7Averages;

const maths = (tex: string): Picture => ({ kind: "maths", tex });
const chart = (values: [string, number][], max: number, step: number): Picture => ({
  kind: "bar-chart",
  bars: values.map(([label, value]) => ({ label, value })),
  max,
  step,
});
const table = (head: string[], rows: string[][]): Picture => ({ kind: "table", head, rows });

/** A question with no picture shows its data as a list: say so. */
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
      "order",
    ].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture)
      ? { ...s, wordsOnly: LIST }
      : s,
  );

// ---------------------------------------------------------------------------------------------
// The mean.

const MEAN = "y7-averages/mean";
const meanMethod = [
  "Add them all up: the total.",
  "Count how many there are.",
  "Mean = total ÷ how many.",
];
const pocket = chart(
  [
    ["Ali", 4],
    ["Ben", 7],
    ["Cal", 5],
    ["Dee", 8],
  ],
  10,
  2,
);

const mean = stepped(find(list, MEAN), {
  method: meanMethod,
  variation: {
    relationship: "a set of values, their total, and their mean",
    unknowns: ["mean", "total", "missing value"],
    surface: ["zeros", "adding to each", "doubling each", "pocket money"],
  },
  screens: worded([
    explain(
      "The rule",
      "The mean",
      ["**Mean = the total ÷ how many there are.**"],
      pocket,
      "Share it all out equally, and each gets the mean.",
    ),

    ...owned(list, MEAN, "Warm-up", "Check you remember"),
    words(
      typed("Check you remember", "What is $60 \\div 5$?", "12", "How many 5s in 60?", "12."),
      LIST,
    ),

    methodCard("The method", meanMethod, pocket),
    worked(
      "Watch the method",
      "Find the mean of 12, 15, 9, 14 and 10.",
      [
        { line: "Total: $12 + 15 + 9 + 14 + 10 = 60$" },
        { line: "How many: 5" },
        { line: "Mean: $60 \\div 5 = 12$", note: "Share the total equally." },
      ],
      "12.",
    ),
    calc(
      "Your turn",
      "Find the mean of 10, 20, 30 and 40.",
      undefined,
      [
        ["Total:", "100", "Add them all."],
        ["How many:", "4", "Count them."],
        ["Mean: $100 \\div 4 =$", "25", "Share the total."],
      ],
      "25.",
    ),

    calc(
      "Practise",
      "Find the mean of 5, 1, 6, 2 and 1.",
      undefined,
      [
        ["Total:", "15", "Add them all, both 1s too."],
        ["How many:", "5", "Count them."],
        ["Mean: $15 \\div 5 =$", "3", "Share the total."],
      ],
      "3.",
    ),
    ...owned(list, MEAN, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Find the mean of 4, 6 and 8.", "6", "18 ÷ 3.", "6.", { asks: "mean" }),
        ask("3 numbers have a mean of 6. What's their total?", "18", "Mean × how many.", "18.", {
          asks: "total",
          changed: "Now the total.",
        }),
        ask("Find the mean of 2, 3, 5 and 6.", "4", "16 ÷ 4.", "4.", {
          asks: "mean",
          changed: "Four numbers.",
        }),
        ask("4, 6 and ? have a mean of 6. Find ?.", "8", "The total must be 18.", "8.", {
          asks: "missing value",
          changed: "Now a missing value.",
        }),
      ],
      "Total ÷ how many; or mean × how many for the total.",
    ),

    questionSet(
      "Variation",
      "Find the mean. Watch what changes.",
      [
        ask("Find the mean of 2, 4 and 9.", "5", "15 ÷ 3.", "5.", {
          asks: "mean",
          expect: [
            "Jo divides the total by 2. Is she right?",
            "No: by 3",
            "There are 3 numbers, so 15 ÷ 3 = 5.",
            [["Yes", "Count the numbers: there are 3."]],
          ],
        }),
        ask("Find the mean of 2, 4, 9 and 0.", "3.75", "15 ÷ 4.", "3.75.", {
          asks: "mean",
          changed: "A 0 joins: it still counts.",
        }),
        ask("Find the mean of 12, 14 and 19.", "15", "45 ÷ 3.", "15.", {
          asks: "mean",
          changed: "10 added to each.",
          expect: [
            "10 is added to each number. The mean…",
            "goes up by 10",
            "Each value is 10 more, so their mean is 10 more: 15.",
            [["stays the same", "The total grows by 30, shared by 3."]],
          ],
        }),
        ask("Find the mean of 4, 8 and 18.", "10", "30 ÷ 3.", "10.", {
          asks: "mean",
          changed: "Each one doubled.",
        }),
      ],
      "Every value counts, zeros too; change every value and the mean changes the same way.",
    ),
    own(list, MEAN, "Spot the mistake"),

    own(list, MEAN, "Exit check"),

    reworded(
      list,
      MEAN,
      "Pocket money",
      { tag: "Real life", picture: pocket },
      "Back to the problem",
    ),

    summary(
      "What to remember",
      ["**Mean = the total ÷ how many there are.**"],
      pocket,
      [
        "**Mean = the total ÷ how many there are.**",
        "Zeros count as values.",
        "Mean of 12, 15, 9, 14, 10 is 60 ÷ 5 = 12.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Median and mode.

const MEDIAN = "y7-averages/median-mode";
const medianMethod = [
  "Put them in order.",
  "Median: the middle one, or halfway between two.",
  "Mode: the one that appears most.",
];

const median = stepped(find(list, MEDIAN), {
  method: medianMethod,
  variation: {
    relationship: "a set of values, its median and its mode",
    unknowns: ["median", "mode"],
    surface: ["odd and even counts", "a big value", "two modes", "salaries"],
  },
  screens: worded([
    explain(
      "The rule",
      "Median and mode",
      ["**The median is the middle, in order. The mode is the most common.**"],
      maths("2,\\; 4,\\; \\mathbf{5},\\; 7,\\; 9"),
      "With an even number of values, the median is halfway between the middle two.",
    ),

    ...owned(list, MEDIAN, "Warm-up", "Check you remember").map((sc) =>
      sc.title.startsWith("Put 7, 2, 9, 4, 5")
        ? ({ ...sc, title: "Order 7, 2, 9, 4, 5. Which is in the middle?" } as Screen)
        : sc,
    ),
    words(
      typed(
        "Check you remember",
        "What is halfway between 5 and 7?",
        "6",
        "Add, then halve.",
        "6.",
      ),
      LIST,
    ),

    methodCard("The method", medianMethod, maths("2,\\; 4,\\; 5,\\; 7,\\; 9,\\; 10")),
    worked(
      "Watch the method",
      "Find the median of 9, 4, 7, 2, 10 and 5.",
      [
        { line: "In order: 2, 4, 5, 7, 9, 10", note: "Always order first." },
        { line: "The middle two: 5 and 7" },
        { line: "Halfway: 6" },
      ],
      "6.",
    ),
    calc(
      "Your turn",
      "Find the median of 12, 4, 9, 15 and 7.",
      undefined,
      [
        ["The smallest is", "4", "Order them first."],
        ["The middle one is", "9", "4, 7, 9, 12, 15."],
      ],
      "9.",
    ),

    calc(
      "Practise",
      "Find the median of 3, 10, 6 and 8.",
      undefined,
      [
        ["The middle two are 6 and", "8", "3, 6, 8, 10."],
        ["Halfway between them:", "7", "Add, then halve."],
      ],
      "7.",
    ),
    ...owned(list, MEDIAN, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("The median of 6, 2, 9, 4, 7?", "6", "2, 4, 6, 7, 9.", "6.", { asks: "median" }),
        ask("The mode of 5, 3, 5, 2, 8, 5?", "5", "5 appears 3 times.", "5.", {
          asks: "mode",
          changed: "Now the mode.",
        }),
        ask("The median of 2, 4, 6, 12?", "5", "Halfway between 4 and 6.", "5.", {
          asks: "median",
          changed: "An even number of values.",
        }),
        ask(
          "The modes of 1, 2, 2, 4, 4, 7?",
          ["2 and 4", "2, 4", "2,4"],
          "Two values appear twice.",
          "2 and 4.",
          {
            asks: "mode",
            changed: "Two values tie.",
          },
        ),
      ],
      "Order for the median; count for the mode.",
    ),

    questionSet(
      "Variation",
      "Find the median. Watch what changes.",
      [
        ask("The median of 7, 2, 9?", "7", "2, 7, 9.", "7.", {
          asks: "median",
          expect: [
            "Ali says 2: the middle one written. Right?",
            "No: order first",
            "In order: 2, 7, 9. The median is 7.",
            [["Yes", "The middle one only counts once they're in order."]],
          ],
        }),
        ask("The median of 7, 2, 9, 100?", "8", "Halfway between 7 and 9.", "8.", {
          asks: "median",
          changed: "A huge value joins.",
        }),
        ask("The mode of 4, 9, 9, 2, 9, 4?", "9", "9 appears 3 times.", "9.", {
          asks: "mode",
          changed: "Now the mode.",
        }),
        ask("The median of 20, 22, 22, 25, 161?", "22", "The middle of five.", "22.", {
          asks: "median",
          changed: "Pay, with one big salary.",
        }),
      ],
      "A huge value barely moves the median: that's why it's fair.",
    ),
    own(list, MEDIAN, "Spot the mistake"),

    own(list, MEDIAN, "Exit check"),

    reworded(list, MEDIAN, "A fair salary?", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**The median is the middle, in order. The mode is the most common.**"],
      maths("2,\\; 4,\\; \\mathbf{5},\\; 7,\\; 9"),
      [
        "**The median is the middle, in order. The mode is the most common.**",
        "Even count: halfway between the middle two.",
        "2, 4, 5, 7, 9, 10: median 6.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// The range.

const RANGE = "y7-averages/range";
const rangeMethod = [
  "Find the biggest.",
  "Find the smallest.",
  "Range = biggest − smallest: one number.",
];

const range = stepped(find(list, RANGE), {
  method: rangeMethod,
  variation: {
    relationship: "a set of values and how spread out they are",
    unknowns: ["range", "biggest", "smallest"],
    surface: ["negatives", "adding to each", "an outlier", "archers"],
  },
  screens: worded([
    explain(
      "The rule",
      "The range",
      ["**Range = the biggest take away the smallest.**"],
      numberLine(0, 14, 1, [4, 7, 9, 12], { every: 2 }),
      "A small range means the values are close: consistent.",
    ),

    ...owned(list, RANGE, "Warm-up", "Check you remember"),
    words(
      typed(
        "Check you remember",
        "What is $7 - (-3)$?",
        "10",
        "Taking away a negative adds.",
        "10.",
      ),
      LIST,
    ),

    methodCard("The method", rangeMethod, numberLine(0, 14, 1, [4, 7, 9, 12], { every: 2 })),
    worked(
      "Watch the method",
      "Find the range of −3, 5, 2, −1 and 7 °C.",
      [
        { line: "Biggest: 7" },
        { line: "Smallest: −3", note: "Below zero is smallest." },
        { line: "$7 - (-3) = 10$ °C" },
      ],
      "10 °C.",
      numberLine(-4, 8, 1, [-3, -1, 2, 5, 7], { every: 2 }),
    ),
    calc(
      "Your turn",
      "Find the range of 6, 14, 9, 3 and 11.",
      undefined,
      [
        ["Biggest:", "14", "Look for the largest."],
        ["Smallest:", "3", "Look for the smallest."],
        ["Range: $14 - 3 =$", "11", "Take the smallest away."],
      ],
      "11.",
    ),

    calc(
      "Practise",
      "Find the range of −4, 2, −8 and 5.",
      undefined,
      [
        ["Biggest:", "5", "Look for the largest."],
        ["Smallest:", "-8", "Furthest below zero."],
        ["Range: $5 - (-8) =$", "13", "Taking away a negative adds."],
      ],
      "13.",
    ),
    ...owned(list, RANGE, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("The range of 4, 9, 2, 8?", "7", "9 − 2.", "7.", { asks: "range" }),
        ask("The range is 10. The smallest is 3. The biggest?", "13", "3 + 10.", "13.", {
          asks: "biggest",
          changed: "Now the biggest is missing.",
        }),
        ask("The range is 6. The biggest is 15. The smallest?", "9", "15 − 6.", "9.", {
          asks: "smallest",
          changed: "Now the smallest.",
        }),
        ask("The range of −2, 4, 1?", "6", "4 − (−2).", "6.", {
          asks: "range",
          changed: "A negative value.",
        }),
      ],
      "Biggest − smallest; work back for a missing end.",
    ),

    questionSet(
      "Variation",
      "Find the range. Watch what changes.",
      [
        ask("The range of 7, 3, 9, 4?", "6", "9 − 3.", "6.", {
          asks: "range",
          expect: [
            "Sam takes the last from the first: 3. Right?",
            "No: 6",
            "Biggest − smallest: 9 − 3 = 6.",
            [["Yes", "The order written doesn't matter."]],
          ],
        }),
        ask("The range of 107, 103, 109, 104?", "6", "109 − 103.", "6.", {
          asks: "range",
          changed: "100 added to each.",
        }),
        ask("The range of 2, 3, 3, 4, 50?", "48", "50 − 2.", "48.", {
          asks: "range",
          changed: "One very big value.",
        }),
        ask("The range of 8, 9, 8, 9, 8?", "1", "9 − 8.", "1: very consistent.", {
          asks: "range",
          changed: "Values all close together.",
        }),
      ],
      "One extreme value changes the range a lot; adding to each changes nothing.",
    ),
    own(list, RANGE, "Spot the mistake"),

    own(list, RANGE, "Exit check"),

    reworded(list, RANGE, "Two archers", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Range = the biggest take away the smallest.**"],
      numberLine(0, 14, 1, [4, 7, 9, 12], { every: 2 }),
      [
        "**Range = the biggest take away the smallest.**",
        "It's one number. Small range: consistent.",
        "−3, 5, 2, −1, 7: range 7 − (−3) = 10.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Comparing data.

const COMPARE = "y7-averages/compare";
const compareMethod = [
  "Compare the averages: which is bigger?",
  "Compare the ranges: smaller is more consistent.",
  "Say what each means, in context.",
];
const teams = table(
  ["Team", "Mean", "Range"],
  [
    ["Reds", "14", "4"],
    ["Blues", "14", "18"],
  ],
);

const compare = stepped(find(list, COMPARE), {
  method: compareMethod,
  variation: {
    relationship: "two sets of data compared by an average and a range",
    unknowns: ["average", "consistency", "which average"],
    surface: ["times, where smaller is better", "equal means", "big values", "teams"],
  },
  screens: worded([
    explain(
      "The rule",
      "Comparing data",
      ["**Compare an average, then the range. Say what each means.**"],
      teams,
      "A smaller range means more consistent.",
    ),

    ...owned(list, COMPARE, "Warm-up", "Check you remember"),
    words(
      typed(
        "Check you remember",
        "Which is bigger: 62 or 68?",
        "68",
        "Compare the tens, then the ones.",
        "68.",
      ),
      LIST,
    ),

    methodCard("The method", compareMethod, teams),
    worked(
      "Watch the method",
      "Compare the two shops' daily sales.",
      [
        { line: "Average: X sells more (£200 > £180)", note: "The bigger mean." },
        { line: "Range: X is more consistent (£50 < £120)", note: "The smaller range." },
      ],
      "X sells more, and more steadily.",
      table(
        ["Shop", "Mean", "Range"],
        [
          ["X", "£200", "£50"],
          ["Y", "£180", "£120"],
        ],
      ),
    ),
    calc(
      "Your turn",
      "Compare the two runners.",
      table(
        ["Runner", "Mean time", "Range"],
        [
          ["P", "12.1 s", "0.4 s"],
          ["Q", "11.8 s", "1.5 s"],
        ],
      ),
      [
        ["Faster on average:", "Q", "A smaller time is faster."],
        ["More consistent:", "P", "The smaller range."],
      ],
      "Q is faster on average; P is more consistent.",
    ),

    calc(
      "Practise",
      "Compare the two plants' heights.",
      table(
        ["Plant", "Median", "Range"],
        [
          ["A", "20 cm", "4 cm"],
          ["B", "24 cm", "12 cm"],
        ],
      ),
      [
        ["Taller on average:", "B", "The bigger median."],
        ["More consistent:", "A", "The smaller range."],
      ],
      "B is taller on average; A is more consistent.",
    ),
    ...owned(list, COMPARE, "Together", "Practise").filter((s) => s.title !== "Two plants"),
    questionSet(
      "Practise",
      "Which one? Watch what changes.",
      [
        ask("Which class did better on average?", "B", "The bigger mean.", "Class B.", {
          asks: "average",
          others: ["A"],
          picture: table(
            ["Class", "Mean", "Range"],
            [
              ["A", "62", "30"],
              ["B", "68", "10"],
            ],
          ),
        }),
        ask("Which class is more consistent?", "B", "The smaller range.", "Class B.", {
          asks: "consistency",
          changed: "Now consistency.",
          others: ["A"],
          picture: table(
            ["Class", "Mean", "Range"],
            [
              ["A", "62", "30"],
              ["B", "68", "10"],
            ],
          ),
        }),
        ask(
          "One value is huge. The fairest average is…",
          "the median",
          "The median ignores the extremes.",
          "The median.",
          {
            asks: "which average",
            changed: "Which average to use.",
            others: ["the mean", "the range"],
          },
        ),
      ],
      "Average for 'better'; range for 'consistent'.",
    ),

    questionSet(
      "Variation",
      "Which one? Watch what changes.",
      [
        ask("Which team is more consistent?", "X", "The smaller range.", "Team X.", {
          asks: "consistency",
          others: ["Y"],
          picture: table(
            ["Team", "Mean", "Range"],
            [
              ["X", "50", "5"],
              ["Y", "50", "20"],
            ],
          ),
          expect: [
            "Mia says Y is better: its range is bigger. Right?",
            "No",
            "A bigger range just means less consistent.",
            [["Yes", "Bigger range means more spread, not better."]],
          ],
        }),
        ask(
          "Which team scores more on average?",
          "neither",
          "The means are equal.",
          "Neither: both mean 50.",
          {
            asks: "average",
            changed: "The same means.",
            others: ["X", "Y"],
            picture: table(
              ["Team", "Mean", "Range"],
              [
                ["X", "50", "5"],
                ["Y", "50", "20"],
              ],
            ),
          },
        ),
        ask("Which swimmer is faster on average?", "Q", "A smaller time is faster.", "Q.", {
          asks: "average",
          changed: "Times: smaller is better.",
          others: ["P"],
          picture: table(
            ["Swimmer", "Mean time", "Range"],
            [
              ["P", "35 s", "2 s"],
              ["Q", "33 s", "6 s"],
            ],
          ),
        }),
      ],
      "Read what's better in context: more points, or less time.",
    ),
    {
      ...own(list, COMPARE, "Spot the mistake"),
      text: "Kim compares classes A and B.",
      picture: table(
        ["Class", "Mean", "Range"],
        [
          ["A", "70", "15"],
          ["B", "65", "25"],
        ],
      ),
    } as Screen,

    own(list, COMPARE, "Exit check"),

    reworded(list, COMPARE, "Which team?", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Compare an average, then the range. Say what each means.**"],
      teams,
      [
        "**Compare an average, then the range. Say what each means.**",
        "Bigger average: more on the whole. Smaller range: more consistent.",
        "Use the median when one value is huge.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7AveragesStepped: [string, UnitLesson[]][] = [
  [MEAN, [mean]],
  [MEDIAN, [median]],
  [RANGE, [range]],
  [COMPARE, [compare]],
];
