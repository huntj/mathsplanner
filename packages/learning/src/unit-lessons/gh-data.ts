// GCSE Higher, "Histograms and box plots", as four short lessons, one just before each skill:
// histograms with unequal class widths, cumulative frequency graphs, quartiles and the
// interquartile range, and box plots. Each recaps the Foundation idea quickly, builds it to
// Higher level, names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Picture, Point, UnitLesson } from "./types.ts";

const U = "gh-data";
const P = (x: number, y: number): Point => ({ x, y });

const times: Picture = {
  kind: "table",
  head: ["Time, t (min)", "Frequency", "Width", "Frequency density"],
  rows: [
    ["0 < t ≤ 10", "20", "10", "2"],
    ["10 < t ≤ 15", "30", "5", "6"],
    ["15 < t ≤ 30", "45", "15", "?"],
  ],
};

/** A histogram: bars from x0 to x1 with the given frequency densities, scaled to fit. */
function histogram(
  bars: [x0: number, x1: number, fd: number][],
  xTicks: number[],
  fdTicks: number[],
): DrawingPic {
  const sx = 6 / Math.max(...bars.map((b) => b[1]));
  const sy = 4 / Math.max(...fdTicks);
  const items: DrawingPic["items"] = [
    { line: [P(0, 0), P(6.3, 0)] },
    { line: [P(0, 0), P(0, 4.3)] },
    { text: "time (min)", at: P(3, -0.9) },
    { text: "frequency density", at: P(1.9, 4.8) },
  ];
  for (const t of xTicks) items.push({ text: String(t), at: P(t * sx, -0.4) });
  for (const f of fdTicks) items.push({ text: String(f), at: P(-0.4, f * sy) });
  for (const [x0, x1, fd] of bars) {
    const a = P(x0 * sx, 0);
    const b = P(x0 * sx, fd * sy);
    const c = P(x1 * sx, fd * sy);
    const d = P(x1 * sx, 0);
    items.push(
      { line: [a, b], tone: "find" },
      { line: [b, c], tone: "find" },
      { line: [c, d], tone: "find" },
    );
  }
  return { kind: "drawing", items };
}
const histo = histogram(
  [
    [0, 10, 2],
    [10, 15, 6],
    [15, 30, 3],
  ],
  [0, 10, 15, 30],
  [2, 4, 6],
);

/** A cumulative frequency curve for 80 heights from 140 to 180 cm, with optional quartile lines. */
function cumulative(quartiles: boolean): DrawingPic {
  const points: [number, number][] = [
    [140, 0],
    [150, 8],
    [160, 30],
    [170, 66],
    [180, 80],
  ];
  const sx = (h: number) => ((h - 140) / 40) * 6;
  const sy = (c: number) => (c / 80) * 4;
  const items: DrawingPic["items"] = [
    { line: [P(0, 0), P(6.3, 0)] },
    { line: [P(0, 0), P(0, 4.3)] },
    { text: "height (cm)", at: P(3, -0.9) },
    { text: "cumulative frequency", at: P(2.1, 4.8) },
  ];
  for (const h of [140, 150, 160, 170, 180]) items.push({ text: String(h), at: P(sx(h), -0.4) });
  for (const c of [20, 40, 60, 80]) items.push({ text: String(c), at: P(-0.45, sy(c)) });
  points.forEach(([h, c], i) => {
    const next = points[i + 1];
    items.push({ dot: P(sx(h), sy(c)) });
    if (next) items.push({ line: [P(sx(h), sy(c)), P(sx(next[0]), sy(next[1]))], tone: "find" });
  });
  if (quartiles) {
    // Median at 40 → about 163 cm; quartiles at 20 → 155.5 cm and 60 → 168.3 cm.
    for (const [c, h] of [
      [20, 155.5],
      [40, 162.8],
      [60, 168.3],
    ] as const) {
      items.push(
        { line: [P(0, sy(c)), P(sx(h), sy(c))], dashed: true, tone: "soft" },
        { line: [P(sx(h), sy(c)), P(sx(h), 0)], dashed: true, tone: "soft" },
      );
    }
  }
  return { kind: "drawing", items };
}
const cfCurve = cumulative(false);
const cfQuartiles = cumulative(true);

/** Box plots on one scale from 0 to 60, each [min, Q1, median, Q3, max], labelled. */
function boxPlots(
  plots: [label: string, five: [number, number, number, number, number]][],
): DrawingPic {
  const sx = (v: number) => v / 10;
  const items: DrawingPic["items"] = [{ line: [P(0, 0), P(6.2, 0)] }];
  for (const t of [0, 10, 20, 30, 40, 50, 60])
    items.push({ line: [P(sx(t), 0), P(sx(t), -0.12)] }, { text: String(t), at: P(sx(t), -0.45) });
  plots.forEach(([label, [lo, q1, med, q3, hi]], i) => {
    const y = 1 + i * 1.6;
    const top = y + 0.45;
    const bottom = y - 0.45;
    items.push(
      { text: label, at: P(-0.6, y) },
      { line: [P(sx(lo), y), P(sx(q1), y)], tone: "find" },
      { line: [P(sx(q3), y), P(sx(hi), y)], tone: "find" },
      { line: [P(sx(q1), bottom), P(sx(q3), bottom)], tone: "find" },
      { line: [P(sx(q1), top), P(sx(q3), top)], tone: "find" },
      { line: [P(sx(q1), bottom), P(sx(q1), top)], tone: "find" },
      { line: [P(sx(q3), bottom), P(sx(q3), top)], tone: "find" },
      { line: [P(sx(med), bottom), P(sx(med), top)], tone: "find" },
      { line: [P(sx(lo), y - 0.2), P(sx(lo), y + 0.2)], tone: "find" },
      { line: [P(sx(hi), y - 0.2), P(sx(hi), y + 0.2)], tone: "find" },
    );
  });
  return {
    kind: "drawing",
    frame: { xMin: -1.2, xMax: 6.5, yMin: -0.8, yMax: 1 + plots.length * 1.6 },
    items,
  };
}
const twoClasses = boxPlots([
  ["10B", [15, 25, 35, 40, 55]],
  ["10A", [10, 30, 38, 45, 50]],
]);
const oneClass = boxPlots([["10A", [10, 30, 38, 45, 50]]]);

export const ghData: UnitLesson[] = [
  lesson(
    U,
    "histograms",
    "GH-S3.a",
    "Histograms with unequal classes",
    "Frequency density = frequency ÷ class width; the area of a bar is its frequency.",
    [
      problem(
        "Journey times",
        [
          "The table shows the journey times of 95 pupils, in classes of different widths. “Complete the table and draw the histogram.” And “Estimate how many took more than 20 minutes.”",
          "By the end of this lesson, you can do both.",
        ],
        times,
      ),
      typed("Warm-up", "$45 \\div 15$", "3", "Divide.", "3."),
      typed("Warm-up", "Width of the class $10 < t \\le 15$", "5", "15 − 10.", "5."),
      explain(
        "Discover",
        "Area, not height",
        [
          "When classes have different widths, a tall bar could just be a wide one. So the height is **frequency density = frequency ÷ class width**.",
          "Then the **area** of each bar (width × frequency density) is its frequency.",
        ],
        histo,
      ),
      choose(
        "Discover",
        "Frequency density of 45 in a width of 15",
        "3",
        "45 ÷ 15.",
        [
          ["45", "Divide by the width."],
          ["675", "Divide, don't multiply."],
        ],
        { picture: times },
      ),
      worked(
        "The histogram",
        "Bars: 0–10, 10–15, 15–30.",
        [
          ["Frequency densities: 2, 6, 3", "Frequency ÷ width."],
          ["Draw bars with those heights and no gaps", "Widths as classes."],
        ],
        "The 10–15 bar is tallest, though 15–30 has more pupils.",
        histo,
      ),
      steps(
        "Together",
        "Estimate how many took more than 20 minutes",
        "Use area.",
        [
          ["Part of the 15–30 bar from 20 to 30:", "width 10", ["width 15", "From 20 only."], "10"],
          ["Area: $10 \\times 3 =$", "30 pupils", ["45", "Only part of the class."], "About 30"],
        ],
        "An estimate: it assumes times spread evenly in the class.",
        histo,
      ),
      choose(
        "Together",
        "On a histogram, the frequency of a class is",
        "the area of its bar",
        "Width × height.",
        [
          ["the height of its bar", "Height is density."],
          ["the width", "Width × height."],
        ],
      ),
      typed(
        "Your turn",
        "A class $20 < h \\le 40$ has frequency 50. Frequency density",
        "2.5",
        "$50 \\div 20$.",
        "2.5.",
      ),
      typed("Your turn", "A bar 5 wide with density 4. Frequency", "20", "5 × 4.", "20."),
      choose(
        "Watch out",
        "Ola draws the bars' heights as the frequencies. What's wrong?",
        "With unequal widths, use frequency density",
        "Area is frequency.",
        [["Nothing", "Wide classes would look too big."]],
      ),
      mistake(
        "Ben finds the frequency density of $0 < t \\le 10$, frequency 20.",
        ["Width: 10", "Density: $10 \\div 20$", "0.5"],
        1,
        "Frequency ÷ width: $20 \\div 10 = 2$.",
      ),
      typed(
        "Back to the problem",
        "“Estimate how many took more than 20 minutes.”",
        "30",
        "$10 \\times 3$.",
        "About 30.",
        { picture: histo, wrong: [["45", "Only 20–30 of that class."]] },
      ),
      quiz([
        [
          ["Frequency 12, width 4: density", "3", ["48", "16"], "÷."],
          ["Frequency 30, width 10: density", "3", ["300", "40"], "÷."],
        ],
        [
          ["Density 2, width 15: frequency", "30", ["7.5", "17"], "×."],
          ["Density 0.5, width 20: frequency", "10", ["40", "20.5"], "×."],
        ],
        [
          ["On a histogram, frequency is shown by", "area", ["height", "width"], "Area."],
          [
            "The vertical axis of a histogram is",
            "frequency density",
            ["frequency", "cumulative frequency"],
            "Density.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "cumulative-frequency",
    "GH-S3.b",
    "Cumulative frequency graphs",
    "Running totals, plotted at the upper end of each class.",
    [
      problem(
        "Heights of 80 pupils",
        [
          "The heights of 80 pupils are grouped. “Draw a cumulative frequency graph.” And “Estimate how many are taller than 165 cm.”",
          "By the end of this lesson, you can draw and read cumulative frequency graphs.",
        ],
        cfCurve,
      ),
      typed("Warm-up", "Running total of 8, 22, 36", "66", "8 + 22 + 36.", "66."),
      typed("Warm-up", "$80 - 48$", "32", "Subtract.", "32."),
      explain(
        "Discover",
        "Totals so far",
        [
          "**Cumulative frequency** is a running total: how many are at or below each value. Plot each total at the **upper end** of its class, and join with a smooth curve or straight lines.",
          "The graph always goes up (or stays flat) and ends at the total.",
        ],
        cfCurve,
      ),
      choose("Discover", "Plot the total for $150 < h \\le 160$ at", "160", "Upper end.", [
        ["150", "Upper end."],
        ["155", "Not the midpoint."],
      ]),
      worked(
        "Taller than 165",
        "Read up from 165.",
        [
          ["At 165 cm, cumulative frequency ≈ 48", "Read across."],
          ["Taller: 80 − 48 = 32", "Subtract from the total."],
        ],
        "About 32 pupils.",
        cfCurve,
      ),
      steps(
        "Together",
        "How many are 155 cm or shorter?",
        "Read it.",
        [
          [
            "Up from 155 to the curve, then across:",
            "about 19",
            ["about 61", "That's the number taller."],
            "≈ 19",
          ],
          ["So taller than 155 cm:", "about 61", ["19", "80 − 19."], "≈ 61"],
        ],
        "Always check: below or above?",
        cfCurve,
      ),
      choose(
        "Together",
        "The last point of a cumulative frequency graph is at",
        "the total, 80",
        "Everyone.",
        [
          ["0", "That's the start."],
          ["the largest class frequency", "It's the running total."],
        ],
        { picture: cfCurve },
      ),
      typed(
        "Your turn",
        "Frequencies 5, 12, 18, 5. Cumulative frequencies end at",
        "40",
        "Total.",
        "40.",
      ),
      typed("Your turn", "And the third cumulative frequency", "35", "5 + 12 + 18.", "35."),
      choose(
        "Watch out",
        "Kim plots each total at the class midpoint. What's wrong?",
        "Totals are plotted at the upper class bound",
        "All up to there.",
        [["Nothing", "Midpoints are for frequency polygons."]],
      ),
      mistake(
        "Leo estimates pupils taller than 165 cm.",
        ["Read up from 165", "Cumulative frequency 48", "So 48 are taller"],
        2,
        "48 are at or below 165: taller is 80 − 48 = 32.",
      ),
      typed(
        "Back to the problem",
        "“Estimate how many are taller than 165 cm.”",
        "32",
        "80 − 48.",
        "About 32.",
        { picture: cfCurve, wrong: [["48", "That's how many are shorter."]] },
      ),
      quiz([
        [
          [
            "Cumulative frequency is",
            "a running total",
            ["the class frequency", "the mean"],
            "Totals.",
          ],
          ["Plot at", "the upper class bound", ["the midpoint", "the lower bound"], "Up to there."],
        ],
        [
          ["Total 60, 45 below a value: above it", "15", ["45", "105"], "60 − 45."],
          ["Total 120, 30 below a value: above it", "90", ["30", "150"], "120 − 30."],
        ],
        [
          ["The graph is always", "rising or flat", ["falling", "a straight line"], "Totals grow."],
          ["It ends at", "the total frequency", ["zero", "the median"], "Everyone."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "quartiles",
    "GH-S4.a",
    "Quartiles and the interquartile range",
    "Read the ¼, ½ and ¾ points; IQR = Q3 − Q1.",
    [
      problem(
        "Spread of the middle half",
        [
          "Using the cumulative frequency graph of 80 heights: “Estimate the median and the interquartile range.”",
          "By the end of this lesson, you can find both, and say why the IQR is useful.",
        ],
        cfQuartiles,
      ),
      typed("Warm-up", "A quarter of 80", "20", "÷ 4.", "20."),
      typed("Warm-up", "Three quarters of 80", "60", "× ¾.", "60."),
      explain(
        "Discover",
        "Quarter points",
        [
          "The **median** is halfway through the data; the **lower quartile** Q1 a quarter of the way; the **upper quartile** Q3 three quarters.",
          "The **interquartile range**, Q3 − Q1, is the spread of the middle half. Unlike the range, it ignores extreme values.",
        ],
        cfQuartiles,
      ),
      choose(
        "Discover",
        "For 80 values, read Q1 at a cumulative frequency of",
        "20",
        "A quarter.",
        [
          ["40", "That's the median."],
          ["25", "¼ of 80."],
        ],
        { picture: cfQuartiles },
      ),
      worked(
        "The heights",
        "Read across at 20, 40 and 60.",
        [
          ["Q1 ≈ 155.5 cm, median ≈ 163 cm, Q3 ≈ 168.3 cm", "Read down."],
          ["IQR ≈ 168.3 − 155.5 ≈ 13 cm", "Subtract."],
        ],
        "The middle half of pupils are within about 13 cm of each other.",
        cfQuartiles,
      ),
      steps(
        "Together",
        "Find the quartiles of 3, 5, 6, 8, 9, 11, 12",
        "Seven values, in order.",
        [
          ["Median:", "8", ["6", "The 4th value."], "8"],
          ["Q1 and Q3:", "5 and 11", ["3 and 12", "Middles of each half."], "IQR = 6"],
        ],
        "Lower half 3, 5, 6; upper half 9, 11, 12.",
      ),
      choose(
        "Together",
        "Why use the IQR instead of the range?",
        "It isn't affected by extreme values",
        "Middle half.",
        [
          ["It's always bigger", "It's smaller."],
          ["It uses every value", "It ignores the extremes."],
        ],
      ),
      typed("Your turn", "Q1 = 24, Q3 = 39. IQR", "15", "39 − 24.", "15."),
      typed(
        "Your turn",
        "For 120 values, Q3 is read at cumulative frequency",
        "90",
        "¾ of 120.",
        "90.",
      ),
      choose(
        "Watch out",
        "Zoe gives the IQR as the range of the data. What's wrong?",
        "IQR = Q3 − Q1, not highest − lowest",
        "Middle half.",
        [["Nothing", "Range uses the extremes."]],
      ),
      mistake(
        "Ben finds the IQR from the graph.",
        ["Q1 at 20: 155.5 cm", "Q3 at 60: 168.3 cm", "IQR = 60 − 20 = 40"],
        2,
        "Subtract the heights, not the frequencies: 13 cm.",
      ),
      choose(
        "Back to the problem",
        "“Estimate the median and the IQR.”",
        "≈ 163 cm and ≈ 13 cm",
        "Read at 40; 168.3 − 155.5.",
        [
          ["≈ 160 cm and 40", "Read across from 40; subtract heights."],
          ["≈ 163 cm and 40 cm", "40 is from the frequency scale."],
        ],
        { picture: cfQuartiles },
      ),
      quiz([
        [
          ["Q1 = 12, Q3 = 20: IQR", "8", ["32", "16"], "Subtract."],
          ["Q1 = 3.5, Q3 = 9: IQR", "5.5", ["12.5", "6"], "Subtract."],
        ],
        [
          ["For 200 values, median read at", "100", ["50", "150"], "Half."],
          ["For 200 values, Q1 read at", "50", ["100", "25"], "Quarter."],
        ],
        [
          [
            "IQR measures",
            "the spread of the middle half",
            ["the average", "the total"],
            "Spread.",
          ],
          [
            "The IQR is not affected by",
            "extreme values",
            ["the median", "the quartiles"],
            "Middle half.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "box-plots",
    "GH-S4.b",
    "Box plots",
    "Five numbers in one picture: compare medians and IQRs.",
    [
      problem(
        "Two classes' test scores",
        [
          "The box plots show test scores for 10A and 10B. “Compare the two distributions.”",
          "A good comparison has two parts: an average and a spread, each in context. By the end of this lesson, you can write one.",
        ],
        twoClasses,
      ),
      typed("Warm-up", "Q3 − Q1 for Q1 = 30, Q3 = 45", "15", "Subtract.", "15."),
      choose("Warm-up", "Which shows typical value?", "the median", "Average.", [
        ["the IQR", "That's spread."],
        ["the range", "That's spread."],
      ]),
      explain(
        "Discover",
        "Reading a box plot",
        [
          "A **box plot** marks five values: lowest, Q1, median, Q3 and highest. The box runs from Q1 to Q3 with a line at the median; the whiskers reach the extremes.",
          "To compare: say which has the **higher median** (on average higher) and which has the **smaller IQR** (more consistent). Use the context.",
        ],
        oneClass,
      ),
      choose(
        "Discover",
        "10A's median score",
        "38",
        "Line in the box.",
        [
          ["30", "That's Q1."],
          ["45", "That's Q3."],
        ],
        { picture: oneClass },
      ),
      worked(
        "Compare",
        "10A: median 38, IQR 15. 10B: median 35, IQR 15.",
        [
          ["10A's median is higher: on average 10A scored higher", "Average."],
          ["The IQRs are equal (15): similar consistency in the middle half", "Spread."],
        ],
        "Both ranges are 40, so the range can't separate them: the IQR is the better measure of spread.",
        twoClasses,
      ),
      steps(
        "Together",
        "Draw a box plot: min 4, Q1 9, median 12, Q3 16, max 25",
        "Five marks.",
        [
          ["The box runs from", "9 to 16", ["4 to 25", "That's the whiskers."], "Q1 to Q3"],
          ["The line inside is at", "12", ["16", "The median."], "12"],
        ],
        "Whiskers out to 4 and 25.",
      ),
      choose("Together", "A smaller IQR means", "more consistent results", "Less spread.", [
        ["higher results", "That's the median."],
        ["more results", "It's spread."],
      ]),
      typed("Your turn", "10B's IQR", "15", "40 − 25.", "15.", { picture: twoClasses }),
      choose(
        "Your turn",
        "Which class's lowest score was lower?",
        "10A (10)",
        "Left whisker.",
        [["10B (15)", "10A's whisker starts at 10."]],
        { picture: twoClasses },
      ),
      choose(
        "Watch out",
        "Kim writes “10A is higher”. What's missing?",
        "Say what is higher (the median) and what it means in context",
        "A full comparison.",
        [["Nothing", "And compare the spread too."]],
      ),
      mistake(
        "Leo compares 10A and 10B.",
        ["10A's median is higher", "10A's box is further right, so 10A is more consistent", "Done"],
        1,
        "Consistency is the IQR (box width), not its position. Both IQRs are 15.",
      ),
      choose(
        "Back to the problem",
        "“Compare the two distributions.”",
        "10A had a higher median (38 v 35); both had IQR 15, so similar consistency",
        "Average and spread, in context.",
        [
          ["10A's box is longer", "Both boxes are 15 wide."],
          ["10B is better because it has a higher maximum", "Compare medians and IQRs."],
        ],
        { picture: twoClasses },
      ),
      quiz([
        [
          ["The line inside a box plot's box", "the median", ["the mean", "Q1"], "Middle."],
          ["The ends of the box", "Q1 and Q3", ["min and max", "the median"], "Quartiles."],
        ],
        [
          ["To compare averages, use", "medians", ["ranges", "IQRs"], "Average."],
          ["To compare spreads, use", "IQRs", ["medians", "maximums"], "Spread."],
        ],
        [
          ["Box from 20 to 34: IQR", "14", ["54", "27"], "Subtract."],
          ["Box from 12 to 30: IQR", "18", ["42", "21"], "Subtract."],
        ],
      ]),
    ],
  ),
];
