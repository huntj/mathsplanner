// GCSE Foundation, "Data", on the stepped template (docs/proposals/lesson-stepped.md): charts for
// categories, line charts for discrete data, time series, grouped tables, frequency polygons,
// histograms and sampling. Charts and tables are drawn for every question that reads them.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfData, heights, histogram, joined, sales } from "./gf-data.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const DA = gfData;
const NUMBER = "A data fact: the numbers are the picture.";
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
// Charts for categories.

const CATEGORICAL = "gf-data/categorical";
const catMethod = [
  "Angle per item: 360° ÷ the total.",
  "Each angle: its count × that.",
  "Reading back: angle ÷ angle per item.",
];
const PIE: Picture = {
  kind: "spinner",
  pie: true,
  sectors: [
    { label: "Bus", size: 3 },
    { label: "Walk", size: 2 },
    { label: "Car", size: 1 },
  ],
};

const categorical = stepped(find(DA, CATEGORICAL), {
  method: catMethod,
  variation: {
    relationship: "counts and pie chart angles",
    unknowns: ["angle", "count"],
    surface: ["more people", "bigger counts", "reading back"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Categories, not numbers",
        ["**In a pie chart, 360° stands for everyone.**"],
        PIE,
        "Bar charts and pictograms show the same counts.",
      ),
      reworded(DA, CATEGORICAL, "With 60 pupils, each pupil's angle in the pie chart is", {
        tag: "The rule",
      }),

      ...owned(DA, CATEGORICAL, "Warm-up", "Check you remember"),

      methodCard("The method", catMethod, PIE),
      workedFrom(DA, CATEGORICAL),
      calc(
        "Your turn",
        "45 people; 15 chose tea.",
        undefined,
        [
          ["Angle per person:", "8", "360 ÷ 45.", { after: "°" }],
          ["Tea:", "120", "15 × 8.", { after: "°" }],
        ],
        "Tea is 120°.",
      ),

      calc(
        "Practise",
        "72 people; juice is 60° of the pie.",
        undefined,
        [
          ["Angle per person:", "5", "360 ÷ 72.", { after: "°" }],
          ["Juice:", "12", "60 ÷ 5.", { after: "people" }],
        ],
        "12 people chose juice.",
      ),
      ...owned(DA, CATEGORICAL, "Together", "Practise"),
      ...owned(DA, CATEGORICAL, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "90 pupils. Find the angle. Watch what changes.",
        [
          ask("45 chose A", "180", "4° each.", "180°.", { asks: "angle", unit: "°" }),
          ask("30 chose B", "120", "4° each.", "120°.", {
            asks: "angle",
            unit: "°",
            changed: "Fewer.",
          }),
          ask("9 chose C", "36", "4° each.", "36°.", {
            asks: "angle",
            unit: "°",
            changed: "Fewer still.",
          }),
          ask("1 chose D", "4", "360 ÷ 90.", "4°.", {
            asks: "angle",
            unit: "°",
            changed: "One person.",
          }),
        ],
        "Angle per pupil × the count.",
      ),

      questionSet(
        "Variation",
        "Watch what changes.",
        [
          ask("30 people; 5 chose red. Red's angle?", "60", "12° each.", "60°.", {
            asks: "angle",
            unit: "°",
            expect: [
              "30 people, 5 chose red: Ben draws red as 5°. Right?",
              "No",
              "Each person is 12°: 5 × 12 = 60°.",
              [["Yes", "Is one person one degree?"]],
            ],
          }),
          ask("30 people; 10 chose red. Red's angle?", "120", "12° each.", "120°.", {
            asks: "angle",
            unit: "°",
            changed: "More chose red.",
          }),
          ask("60 people; 10 chose red. Red's angle?", "60", "6° each.", "60°.", {
            asks: "angle",
            unit: "°",
            changed: "More people.",
          }),
          ask("30 people; red is 120°. How many?", "10", "120 ÷ 12.", "10.", {
            asks: "count",
            changed: "Backwards.",
          }),
        ],
        "Work out the angle for one first.",
      ),
      own(DA, CATEGORICAL, "Spot the mistake"),

      own(DA, CATEGORICAL, "Exit check"),

      reworded(
        DA,
        CATEGORICAL,
        "“Football 24, netball 15, swimming 12, tennis 9 (60 pupils). Find the angle for football.”",
        { tag: "Real life", title: "60 pupils; 24 chose football. Football's angle?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**In a pie chart, 360° stands for everyone.**"],
        PIE,
        [
          "**In a pie chart, 360° stands for everyone.**",
          "Angle per person: 360° ÷ the total.",
          "25% of two pies needn't be the same number.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Charts for discrete data.

const DISCRETE = "gf-data/discrete";
const discMethod = [
  "Read each frequency.",
  "Multiply each value by its frequency.",
  "Add them up for the total.",
];
const goals = (freqs: number[]): Picture => ({
  kind: "bar-chart",
  lines: true,
  bars: freqs.map((value, i) => ({ label: String(i), value })),
  max: Math.max(...freqs),
  step: 1,
  axis: "Matches",
});
const LINES = goals([3, 6, 4, 2, 1]);

const discrete = stepped(find(DA, DISCRETE), {
  method: discMethod,
  variation: {
    relationship: "values, frequencies and totals",
    unknowns: ["type", "read"],
    surface: ["totals", "the mode", "parts of the data"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Counts on a line chart",
        ["**Discrete data counts; each line's height is the frequency.**"],
        LINES,
        "Total = each value × its frequency, added up.",
      ),
      reworded(DA, DISCRETE, "Which data is discrete?", { tag: "The rule" }),

      ...owned(DA, DISCRETE, "Warm-up", "Check you remember"),

      methodCard("The method", discMethod, LINES),
      workedFrom(DA, DISCRETE),
      calc(
        "Your turn",
        "Find the total goals.",
        LINES,
        [
          ["$0 \\times 3 + 1 \\times 6 =$", "6", "Value × frequency."],
          ["$2 \\times 4 + 3 \\times 2 =$", "14", "Value × frequency."],
          ["Total, with $4 \\times 1$:", "24", "6 + 14 + 4."],
        ],
        "24 goals.",
      ),

      calc(
        "Practise",
        "Pets: 0 (×6), 1 (×9), 2 (×3), 3 (×2).",
        undefined,
        [["Total pets:", "21", "0 + 9 + 6 + 6."]],
        "21 pets.",
      ),
      ...owned(DA, DISCRETE, "Together", "Practise"),
      ...owned(DA, DISCRETE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Discrete or continuous? Watch what changes.",
        [
          pick("Number of siblings", "discrete", ["continuous"], "You count them.", {
            asks: "type",
          }),
          pick("Height", "continuous", ["discrete"], "Any value.", {
            asks: "type",
            changed: "Measured.",
          }),
          pick("Shoe size", "discrete", ["continuous"], "Set sizes only.", {
            asks: "type",
            changed: "Halves allowed.",
          }),
          pick("Time to run 100 m", "continuous", ["discrete"], "Any value.", {
            asks: "type",
            changed: "Time.",
          }),
        ],
        "Counted: discrete. Measured: continuous.",
      ),

      questionSet(
        "Variation",
        "Read the chart. Watch what changes.",
        [
          ask("Total goals?", "24", "Value × frequency.", "24.", {
            asks: "read",
            picture: LINES,
            expect: [
              "Cal adds the heights of the lines for the goals. Right?",
              "No",
              "That's the number of matches. Goals: value × frequency.",
              [["Yes", "Is each match one goal?"]],
            ],
          }),
          ask("How many matches?", "16", "Add the heights.", "16.", {
            asks: "read",
            changed: "Matches, not goals.",
            picture: LINES,
          }),
          ask("The mode, in goals?", "1", "The tallest line.", "1.", {
            asks: "read",
            changed: "Most common.",
            picture: LINES,
          }),
          ask("Matches with 3 or more goals?", "3", "Add those heights.", "3.", {
            asks: "read",
            changed: "Some of them.",
            picture: LINES,
          }),
        ],
        "Heights count matches; values count goals.",
      ),
      own(DA, DISCRETE, "Spot the mistake"),

      own(DA, DISCRETE, "Exit check"),

      reworded(
        DA,
        DISCRETE,
        "“How many goals did the team score in total?”",
        { tag: "Real life", title: "How many goals in total?", picture: goals([4, 7, 5, 3, 1]) },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Discrete data counts; each line's height is the frequency.**"],
        LINES,
        [
          "**Discrete data counts; each line's height is the frequency.**",
          "The mode is the value, not its frequency.",
          "Total: value × frequency, added up.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Time series.

const TIME = "gf-data/time-series";
const timeMethod = [
  "Read the values across time.",
  "Trend: the general direction over the years.",
  "Season: compare the same quarter each year.",
];
const QUARTERS = ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3", "Q4"];
const RAIN = joined(QUARTERS, [60, 40, 30, 55, 65, 45, 35, 60], 70, "Rain (mm)");

const timeSeries = stepped(find(DA, TIME), {
  method: timeMethod,
  variation: {
    relationship: "a trend and a seasonal pattern over time",
    unknowns: ["describe", "trend"],
    surface: ["rising", "falling", "level"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Time across, values up",
        ["**Plot over time, join the points, then describe the trend.**"],
        RAIN,
        "Wettest in Q1 each year, and rising a little.",
      ),

      ...owned(DA, TIME, "Warm-up", "Check you remember"),

      methodCard("The method", timeMethod, RAIN),
      workedFrom(DA, TIME),
      calc(
        "Your turn",
        "Sales: Q1 20, Q2 35, Q3 45, Q4 25.",
        undefined,
        [
          ["Rise from Q1 to Q3:", "25", "45 − 20."],
          ["Fall from Q3 to Q4:", "20", "45 − 25."],
        ],
        "Up to Q3, then down.",
      ),

      calc(
        "Practise",
        "Q2 sales: 35 in year 1, 40 in year 2.",
        undefined,
        [["Change:", "5", "40 − 35."]],
        "Up 5: a rising trend.",
      ),
      ...owned(DA, TIME, "Together", "Practise"),
      ...owned(DA, TIME, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Read the rainfall. Watch what changes.",
        [
          pick("When is it wettest each year?", "Q1", ["Q3", "Q2"], "The highest points.", {
            asks: "describe",
            picture: RAIN,
          }),
          pick("When is it driest?", "Q3", ["Q1", "Q4"], "The lowest points.", {
            asks: "describe",
            changed: "Driest.",
            picture: RAIN,
          }),
          pick("The trend?", "Rising slightly", ["Falling", "No trend"], "Year 2 against year 1.", {
            asks: "trend",
            changed: "Over the years.",
            picture: RAIN,
          }),
          pick(
            "The last quarter of each year?",
            "Year 2 is wetter",
            ["Year 1 is wetter", "The same"],
            "Compare the two Q4s.",
            {
              asks: "describe",
              changed: "The same quarter.",
              picture: RAIN,
            },
          ),
        ],
        "Season within a year; trend across years.",
      ),

      questionSet(
        "Variation",
        "The trend? Watch what changes.",
        [
          pick(
            "The trend in sales?",
            "Rising",
            ["No trend", "Falling"],
            "Each quarter is higher in year 2.",
            {
              asks: "trend",
              picture: sales,
              expect: [
                "Leah looks at one year of sales and says no trend. Right?",
                "No",
                "Compare years: each quarter is higher in year 2.",
                [["Yes", "Compare the same quarter each year."]],
              ],
            },
          ),
          pick(
            "The trend now?",
            "Falling",
            ["Rising", "No trend"],
            "Each quarter is lower in year 2.",
            {
              asks: "trend",
              changed: "Going down.",
              picture: joined(QUARTERS, [50, 40, 45, 35, 40, 30, 35, 25], 50, "Sales"),
            },
          ),
          pick("And now?", "No trend", ["Rising", "Falling"], "The years match.", {
            asks: "trend",
            changed: "Level.",
            picture: joined(QUARTERS, [30, 40, 30, 40, 30, 40, 30, 40], 50, "Sales"),
          }),
          pick(
            "And the rain?",
            "Rising slightly",
            ["Falling", "No trend"],
            "Each quarter is a bit higher.",
            {
              asks: "trend",
              changed: "Rainfall.",
              picture: RAIN,
            },
          ),
        ],
        "Ups and downs within a year aren't the trend.",
      ),
      own(DA, TIME, "Spot the mistake"),

      own(DA, TIME, "Exit check"),

      reworded(
        DA,
        TIME,
        "“Describe the trend and the pattern in ice cream sales.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Plot over time, join the points, then describe the trend.**"],
        RAIN,
        [
          "**Plot over time, join the points, then describe the trend.**",
          "Compare the same quarter in different years.",
          "A fall from Q3 to Q4 may just be the season.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Grouped frequency tables.

const GROUPED = "gf-data/grouped";
const groupMethod = [
  "Each value goes in exactly one class.",
  "≤ at the start, < at the end.",
  "Add the frequencies of the classes you need.",
];
const TIMES: Picture = {
  kind: "table",
  head: ["Time $t$ (s)", "Frequency"],
  rows: [
    ["$10 \\le t < 20$", "3"],
    ["$20 \\le t < 30$", "8"],
    ["$30 \\le t < 40$", "6"],
  ],
};
const CLASSES = ["$10 \\le t < 20$", "$20 \\le t < 30$", "$30 \\le t < 40$"];
const inClass = (value: string, right: number, extra: Record<string, unknown>) =>
  pick(
    `Which class holds ${value} s?`,
    CLASSES[right] ?? "",
    CLASSES.filter((_, i) => i !== right),
    "≤ at the start, < at the end.",
    {
      asks: "class",
      ...extra,
    },
  );

const grouped = stepped(find(DA, GROUPED), {
  method: groupMethod,
  variation: {
    relationship: "continuous data in classes",
    unknowns: ["class", "read"],
    surface: ["edges of classes", "the modal class", "totals"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Classes",
        ["**Group continuous data into classes, with no gaps or overlaps.**"],
        TIMES,
        "A time of exactly 20 s goes in the second class.",
      ),
      reworded(DA, GROUPED, "Which class holds 159.9 cm?", { tag: "The rule" }),

      ...owned(DA, GROUPED, "Warm-up", "Check you remember"),

      methodCard("The method", groupMethod, TIMES),
      workedFrom(DA, GROUPED),
      calc(
        "Your turn",
        "Read the table.",
        TIMES,
        [
          ["Total runners:", "17", "Add the frequencies."],
          ["Under 30 s:", "11", "The first two classes."],
        ],
        "17 runners; 11 under 30 s.",
      ),

      calc(
        "Practise",
        "Read the table.",
        TIMES,
        [
          ["The modal class starts at", "20", "The biggest frequency.", { after: "s" }],
          ["20 s or more:", "14", "The last two classes."],
        ],
        "Modal class $20 \\le t < 30$.",
      ),
      ...owned(DA, GROUPED, "Together", "Practise"),
      ...owned(DA, GROUPED, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Times in seconds. Watch what changes.",
        [
          inClass("19.9", 0, {}),
          inClass("20", 1, { changed: "Exactly on the edge." }),
          inClass("29.99", 1, { changed: "Just under 30." }),
          inClass("30", 2, { changed: "The next edge." }),
        ],
        "An edge value goes in the class it starts.",
      ),

      questionSet(
        "Variation",
        "Read the heights. Watch what changes.",
        [
          pick(
            "The modal class?",
            "$160 \\le h < 170$",
            ["12", "$170 \\le h < 180$"],
            "The biggest frequency's class.",
            {
              asks: "read",
              picture: heights,
              expect: [
                "Ash says the modal class is 12. Right?",
                "No",
                "12 is the frequency. The class is $160 \\le h < 170$.",
                [["Yes", "Is 12 a height?"]],
              ],
            },
          ),
          pick("Pupils under 150 cm?", "4", ["9", "13"], "The first class.", {
            asks: "read",
            changed: "Under.",
            picture: heights,
          }),
          pick("Pupils 160 cm or more?", "17", ["12", "5"], "The last two classes.", {
            asks: "read",
            changed: "At least.",
            picture: heights,
          }),
          pick("Pupils in all?", "30", ["4", "180"], "Add them all.", {
            asks: "read",
            changed: "All of them.",
            picture: heights,
          }),
        ],
        "A class is a range; a frequency is a count.",
      ),
      own(DA, GROUPED, "Spot the mistake"),

      own(DA, GROUPED, "Exit check"),

      reworded(
        DA,
        GROUPED,
        "“How many pupils are at least 150 cm but less than 170 cm?”",
        { tag: "Real life", title: "From 150 cm up to 170 cm: how many pupils?", picture: heights },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Group continuous data into classes, with no gaps or overlaps.**"],
        TIMES,
        [
          "**Group continuous data into classes, with no gaps or overlaps.**",
          "The modal class is a class, not a frequency.",
          "$150 \\le h < 160$ holds 159.9 but not 160.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Frequency polygons.

const POLYGONS = "gf-data/frequency-polygons";
const polyMethod = [
  "Find each class midpoint.",
  "Plot (midpoint, frequency).",
  "Join with straight lines; don't close it.",
];
const POLY = joined(["15", "25", "35"], [3, 8, 6], 8, "Frequency");

const polygons = stepped(find(DA, POLYGONS), {
  method: polyMethod,
  variation: {
    relationship: "a class, its midpoint and its frequency",
    unknowns: ["midpoint", "point"],
    surface: ["wider classes", "small values", "big values"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Midpoints",
        ["**Plot each frequency above its class midpoint; join with straight lines.**"],
        POLY,
        "$20 \\le t < 30$ plots at 25.",
      ),
      reworded(DA, POLYGONS, "The point for $160 \\le h < 170$ (frequency 12) goes at", {
        tag: "The rule",
      }),

      ...owned(DA, POLYGONS, "Warm-up", "Check you remember"),

      methodCard("The method", polyMethod, POLY),
      workedFrom(DA, POLYGONS),
      calc(
        "Your turn",
        "Class $40 \\le m < 60$, frequency 9.",
        undefined,
        [
          ["Midpoint:", "50", "Halfway between 40 and 60."],
          ["Point: (50, ?), ? =", "9", "Its frequency."],
        ],
        "(50, 9).",
      ),

      calc(
        "Practise",
        "Class $0 \\le t < 5$, frequency 2.",
        undefined,
        [["Midpoint:", "2.5", "Halfway between 0 and 5."]],
        "(2.5, 2).",
      ),
      ...owned(DA, POLYGONS, "Together", "Practise"),
      ...owned(DA, POLYGONS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The midpoint? Watch what changes.",
        [
          ask("$10 \\le x < 20$", "15", "Halfway.", "15.", { asks: "midpoint" }),
          ask("$10 \\le x < 30$", "20", "Halfway.", "20.", { asks: "midpoint", changed: "Wider." }),
          ask("$0 \\le x < 5$", "2.5", "Halfway.", "2.5.", { asks: "midpoint", changed: "Small." }),
          ask("$100 \\le x < 150$", "125", "Halfway.", "125.", {
            asks: "midpoint",
            changed: "Big.",
          }),
        ],
        "Add the ends and halve.",
      ),

      questionSet(
        "Variation",
        "Where does the point go? Watch what changes.",
        [
          pick(
            "$20 \\le t < 30$, frequency 7",
            "(25, 7)",
            ["(20, 7)", "(7, 25)"],
            "The midpoint.",
            {
              asks: "point",
              expect: [
                "For $20 \\le t < 30$, Jo plots at (20, 7). Right?",
                "No",
                "Use the midpoint: (25, 7).",
                [["Yes", "Where is the middle of the class?"]],
              ],
            },
          ),
          pick(
            "$30 \\le t < 40$, frequency 7",
            "(35, 7)",
            ["(30, 7)", "(7, 35)"],
            "The midpoint.",
            {
              asks: "point",
              changed: "The next class.",
            },
          ),
          pick(
            "$30 \\le t < 40$, frequency 2",
            "(35, 2)",
            ["(30, 2)", "(2, 35)"],
            "The midpoint.",
            {
              asks: "point",
              changed: "Lower.",
            },
          ),
          pick(
            "$30 \\le t < 50$, frequency 2",
            "(40, 2)",
            ["(35, 2)", "(30, 2)"],
            "The midpoint.",
            {
              asks: "point",
              changed: "Wider.",
            },
          ),
        ],
        "Midpoint across, frequency up.",
      ),
      own(DA, POLYGONS, "Spot the mistake"),

      own(DA, POLYGONS, "Exit check"),

      reworded(
        DA,
        POLYGONS,
        "“Compare the two classes' frequency polygons.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Plot each frequency above its class midpoint; join with straight lines.**"],
        POLY,
        [
          "**Plot each frequency above its class midpoint; join with straight lines.**",
          "Don't close it into a shape.",
          "Compare peaks and spread.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Histograms with equal classes.

const HISTOGRAMS = "gf-data/histograms";
const histMethod = [
  "Continuous classes along the bottom.",
  "Frequency up the side.",
  "Bars touch: no gaps.",
];
const RUNS: Picture = {
  kind: "bar-chart",
  bars: [
    { label: "10–20", value: 3 },
    { label: "20–30", value: 8 },
    { label: "30–40", value: 6 },
  ],
  max: 8,
  step: 2,
  axis: "Frequency",
};

const histograms = stepped(find(DA, HISTOGRAMS), {
  method: histMethod,
  variation: {
    relationship: "a histogram's bars and the frequencies",
    unknowns: ["chart", "read"],
    surface: ["one bar", "two bars", "the rest"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "No gaps",
        ["**Equal classes: the bars touch, and each height is the frequency.**"],
        RUNS,
        "Times in seconds: continuous, so no gaps.",
      ),
      reworded(DA, HISTOGRAMS, "Why do a histogram's bars touch?", { tag: "The rule" }),

      ...owned(DA, HISTOGRAMS, "Warm-up", "Check you remember"),

      methodCard("The method", histMethod, RUNS),
      workedFrom(DA, HISTOGRAMS),
      calc(
        "Your turn",
        "Read the histogram.",
        histogram,
        [["Pupils 150–170 cm:", "21", "Two bars."]],
        "21 pupils.",
      ),

      calc(
        "Practise",
        "Read the histogram.",
        RUNS,
        [
          ["Total runners:", "17", "Add the bars."],
          ["20 s or more:", "14", "The last two bars."],
        ],
        "17 runners; 14 took 20 s or more.",
      ),
      ...owned(DA, HISTOGRAMS, "Together", "Practise"),
      ...owned(DA, HISTOGRAMS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Histogram or bar chart? Watch what changes.",
        [
          pick("Best chart for shoe sizes?", "Bar chart", ["Histogram"], "Discrete.", {
            asks: "chart",
          }),
          pick("Best chart for heights?", "Histogram", ["Bar chart"], "Continuous.", {
            asks: "chart",
            changed: "Measured.",
          }),
          pick("Best chart for favourite colours?", "Bar chart", ["Histogram"], "Categories.", {
            asks: "chart",
            changed: "Categories.",
          }),
          pick("Best chart for race times?", "Histogram", ["Bar chart"], "Continuous.", {
            asks: "chart",
            changed: "Times.",
          }),
        ],
        "Continuous data: a histogram.",
      ),

      questionSet(
        "Variation",
        "Read the histogram. Watch what changes.",
        [
          ask("Pupils 160–170 cm?", "12", "The bar's height.", "12.", {
            asks: "read",
            picture: histogram,
            expect: [
              "Rob reads the label: 160 pupils. Right?",
              "No",
              "The bar's height is the frequency: 12.",
              [["Yes", "Read up the side, not along the bottom."]],
            ],
          }),
          ask("Pupils 140–150 cm?", "4", "The bar's height.", "4.", {
            asks: "read",
            changed: "Another bar.",
            picture: histogram,
          }),
          ask("Pupils under 160 cm?", "13", "Two bars.", "13.", {
            asks: "read",
            changed: "Two bars.",
            picture: histogram,
          }),
          ask("Pupils 150 cm or more?", "26", "Three bars.", "26.", {
            asks: "read",
            changed: "Three bars.",
            picture: histogram,
          }),
        ],
        "Height is the frequency; the label is the class.",
      ),
      own(DA, HISTOGRAMS, "Spot the mistake"),

      own(DA, HISTOGRAMS, "Exit check"),

      reworded(
        DA,
        HISTOGRAMS,
        "“Draw a histogram for the heights.” What must it have?",
        { tag: "Real life", title: "A histogram of the heights must have…" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Equal classes: the bars touch, and each height is the frequency.**"],
        RUNS,
        [
          "**Equal classes: the bars touch, and each height is the frequency.**",
          "Histograms are for continuous data.",
          "Read up the side for the frequency.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Sampling.

const SAMPLING = "gf-data/sampling";
const sampleMethod = [
  "Is it random and big enough?",
  "Find the fraction in the sample.",
  "Multiply by the population.",
];
const SCALE = maths("\\frac{9}{30} \\times 600 = 180");

const sampling = stepped(find(DA, SAMPLING), {
  method: sampleMethod,
  variation: {
    relationship: "a fair sample scaled up to the population",
    unknowns: ["fair", "estimate"],
    surface: ["bigger populations", "more in the sample", "smaller samples"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Population and sample",
        ["**A sample should be random and big enough; then scale up.**"],
        SCALE,
        "Random: everyone has an equal chance.",
      ),

      ...owned(DA, SAMPLING, "Warm-up", "Check you remember"),

      methodCard("The method", sampleMethod, SCALE),
      workedFrom(DA, SAMPLING),
      calc(
        "Your turn",
        "A sample of 60: 24 cycle. 1500 pupils in all.",
        undefined,
        [
          ["$\\frac{24}{60}$ as a decimal:", "0.4", "24 ÷ 60."],
          ["Estimate:", "600", "0.4 × 1500."],
        ],
        "About 600 cycle.",
      ),

      calc(
        "Practise",
        "A sample of 80: 20 vote yes. 2000 voters.",
        undefined,
        [
          ["Fraction as a decimal:", "0.25", "20 ÷ 80."],
          ["Estimate:", "500", "0.25 × 2000."],
        ],
        "About 500 yes votes.",
      ),
      reworded(DA, SAMPLING, "A fish survey", {
        tag: "Practise",
        start: "40 of 200 fish caught are trout. About 5000 fish in all.",
      }),
      reworded(DA, SAMPLING, "Which is the best sample?", { tag: "Practise" }),
      ...owned(DA, SAMPLING, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "A fair sample? Watch what changes.",
        [
          pick(
            "200 names drawn at random",
            "Fair",
            ["Biased", "Too small"],
            "Everyone has a chance.",
            {
              asks: "fair",
            },
          ),
          pick(
            "Asking about exercise at a gym",
            "Biased",
            ["Fair", "Too small"],
            "Gym-goers exercise more.",
            {
              asks: "fair",
              changed: "Where you ask.",
            },
          ),
          pick("10 picked at random from 2000", "Too small", ["Fair", "Biased"], "Only 10.", {
            asks: "fair",
            changed: "Size.",
          }),
          pick(
            "Every 10th name on the register",
            "Fair",
            ["Biased", "Too small"],
            "No group left out.",
            {
              asks: "fair",
              changed: "A system.",
            },
          ),
        ],
        "Random and big enough.",
      ),

      questionSet(
        "Variation",
        "Estimate for the population. Watch what changes.",
        [
          ask("15 of 60 own a dog; 900 pupils", "225", "¼ of 900.", "225.", {
            asks: "estimate",
            expect: [
              "15 of 60 own a dog: Dev works out ¼ of 60. Right?",
              "No",
              "Scale up to the population: ¼ of 900 = 225.",
              [["Yes", "Which group is the estimate for?"]],
            ],
          }),
          ask("15 of 60 own a dog; 1200 pupils", "300", "¼ of 1200.", "300.", {
            asks: "estimate",
            changed: "More pupils.",
          }),
          ask("30 of 60 own a dog; 900 pupils", "450", "½ of 900.", "450.", {
            asks: "estimate",
            changed: "More dogs.",
          }),
          ask("15 of 50 own a dog; 900 pupils", "270", "0.3 × 900.", "270.", {
            asks: "estimate",
            changed: "A smaller sample.",
          }),
        ],
        "The sample's fraction × the population.",
      ),
      reworded(DA, SAMPLING, "Where did it go wrong?", {
        text: "15 of 60 sampled own a dog; 900 pupils. Kim estimates.",
      }),

      own(DA, SAMPLING, "Exit check"),

      reworded(
        DA,
        SAMPLING,
        "“The head asks 20 pupils in the dinner queue. Why may this sample be biased?”",
        { tag: "Real life", title: "The head asks 20 in the dinner queue. Why biased?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A sample should be random and big enough; then scale up.**"],
        SCALE,
        [
          "**A sample should be random and big enough; then scale up.**",
          "A big sample can still be biased.",
          "Estimate: the sample's fraction × the population.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfDataStepped: [string, UnitLesson[]][] = [
  [CATEGORICAL, [categorical]],
  [DISCRETE, [discrete]],
  [TIME, [timeSeries]],
  [GROUPED, [grouped]],
  [POLYGONS, [polygons]],
  [HISTOGRAMS, [histograms]],
  [SAMPLING, [sampling]],
];
