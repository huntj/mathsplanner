// GCSE Foundation, "Representing data and sampling", as seven short lessons, one just before each
// skill: charts for categorical and discrete data, time series, grouped frequency tables,
// frequency polygons, histograms with equal class widths, and sampling. Each recaps the Key Stage
// 3 idea quickly, builds it to GCSE level, names the common mistakes and ends on an exam-style
// check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { DrawingPic, Picture, Point, UnitLesson } from "./types.ts";

const U = "gf-data";
const P = (x: number, y: number): Point => ({ x, y });

/** Points joined by straight lines over labelled axes: a time series or a frequency polygon. */
function joined(labels: string[], values: number[], top: number, axis: string): DrawingPic {
  const h = 5;
  const w = labels.length;
  const y = (v: number) => (v / top) * h;
  const items: DrawingPic["items"] = [
    { line: [P(0, 0), P(w + 0.5, 0)] },
    { line: [P(0, 0), P(0, h + 0.3)] },
    { text: axis, at: P(-0.6, h + 0.7) },
    { text: "0", at: P(-0.4, 0) },
    { text: String(top), at: P(-0.6, h) },
  ];
  values.forEach((v, i) => {
    const pt = P(i + 0.5, y(v));
    items.push({ dot: pt }, { text: labels[i] ?? "", at: P(i + 0.5, -0.5) });
    const next = values[i + 1];
    if (next !== undefined) items.push({ line: [pt, P(i + 1.5, y(next))], tone: "find" });
  });
  return { kind: "drawing", items };
}

const sales = joined(
  ["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3", "Q4"],
  [20, 35, 45, 25, 25, 40, 50, 30],
  50,
  "Ice creams",
);
const heights: Picture = {
  kind: "table",
  head: ["Height $h$ (cm)", "Frequency"],
  rows: [
    ["$140 \\le h < 150$", "4"],
    ["$150 \\le h < 160$", "9"],
    ["$160 \\le h < 170$", "12"],
    ["$170 \\le h < 180$", "5"],
  ],
};
const histogram: Picture = {
  kind: "bar-chart",
  bars: [
    { label: "140–150", value: 4 },
    { label: "150–160", value: 9 },
    { label: "160–170", value: 12 },
    { label: "170–180", value: 5 },
  ],
  max: 12,
  step: 2,
  axis: "Frequency",
};

export const gfData: UnitLesson[] = [
  lesson(
    U,
    "categorical",
    "GF-S2.a",
    "Charts for categories",
    "Bar charts, pie charts and pictograms for categorical data.",
    [
      problem(
        "The survey",
        [
          "60 pupils chose their favourite sport: football 24, netball 15, swimming 12, tennis 9. “Draw a pie chart.” And “What fraction chose swimming?”",
          "By the end of this lesson, you can draw and read charts for categories.",
        ],
        {
          kind: "bar-chart",
          bars: [
            { label: "Football", value: 24 },
            { label: "Netball", value: 15 },
            { label: "Swim", value: 12 },
            { label: "Tennis", value: 9 },
          ],
          max: 24,
          step: 4,
          axis: "Pupils",
        },
      ),
      typed("Warm-up", "Work out $360 \\div 60$", "6", "Sixties in 360.", "6."),
      typed("Warm-up", "Work out $24 \\times 6$", "144", "$20 \\times 6 + 4 \\times 6$.", "144."),
      explain(
        "Discover",
        "Categories, not numbers",
        [
          "**Categorical** data are names or types: sports, colours. Show them with a **bar chart** (gaps between bars), **pictogram** or **pie chart**.",
          "In a pie chart, 360° stands for everyone: each person gets $360 \\div \\text{total}$ degrees.",
        ],
        {
          kind: "spinner",
          pie: true,
          sectors: [
            { label: "Football", size: 24 },
            { label: "Netball", size: 15 },
            { label: "Swim", size: 12 },
            { label: "Tennis", size: 9 },
          ],
        },
      ),
      choose(
        "Discover",
        "With 60 pupils, each pupil's angle in the pie chart is",
        "6°",
        "$360 \\div 60$.",
        [
          ["60°", "Divide 360 by 60."],
          ["1°", "There are fewer than 360 pupils."],
        ],
      ),
      worked(
        "The pie chart",
        "Find each sector's angle.",
        [
          ["6° per pupil", "$360 \\div 60$."],
          ["Football $24 \\times 6 = 144°$, netball 90°", "Frequency × 6."],
          ["Swimming 72°, tennis 54°", "Check: they add to 360° ✓"],
        ],
        "Draw each angle with a protractor.",
      ),
      steps(
        "Together",
        "Reading a pie chart: 120° of 90 people chose bus",
        "How many chose bus?",
        [
          ["Each person is", "4°", ["0.75°", "$360 \\div 90$."], "4° each"],
          ["Bus:", "30 people", ["120 people", "$120 \\div 4$."], "30"],
        ],
        "Or $\\frac{120}{360}$ of 90.",
      ),
      choose(
        "Together",
        "What fraction chose swimming (12 of 60)?",
        "$\\frac15$",
        "$\\frac{12}{60}$.",
        [
          ["$\\frac{12}{100}$", "Out of 60."],
          ["$\\frac{1}{12}$", "Part over whole."],
        ],
      ),
      typed(
        "Your turn",
        "Pie chart of 40 people: angle for 10 of them?",
        "90",
        "9° each.",
        "90°.",
        { unit: "°", wrong: [["10", "Each person is 9°."]] },
      ),
      typed(
        "Your turn",
        "A pictogram's symbol is 4 people. Half a symbol is",
        "2",
        "Half of 4.",
        "2 people.",
      ),
      choose(
        "Watch out",
        "Two pie charts both show 25% walk. Do the same number walk?",
        "Not necessarily: the totals may differ",
        "Pie charts show proportions.",
        [["Yes", "25% of 20 isn't 25% of 200."]],
      ),
      mistake(
        "Ed draws a pie chart for 30 people. 5 chose red.",
        ["Each person: $360 \\div 30 = 12°$", "Red: $5 \\times 12 = 60°$", "He draws red as 5°"],
        2,
        "He worked it out, then drew the count. Red is 60°.",
      ),
      choose(
        "Back to the problem",
        "“Football 24, netball 15, swimming 12, tennis 9 (60 pupils). Find the angle for football.”",
        "144°",
        "$24 \\times 6$.",
        [
          ["24°", "Each pupil is 6°."],
          ["40°", "$24 \\times 6 = 144$."],
        ],
      ),
      quiz([
        [
          ["36 people; angle per person", "10°", ["36°", "6°"], "$360 \\div 36$."],
          ["120 people; angle per person", "3°", ["120°", "12°"], "$360 \\div 120$."],
        ],
        [
          ["Total 20, 5 chose A. Angle?", "90°", ["5°", "25°"], "18° each."],
          ["Total 72, 18 chose B. Angle?", "90°", ["18°", "72°"], "5° each."],
        ],
        [
          ["Categorical data is", "names or types", ["measured", "always numbers"], "Categories."],
          [
            "A bar chart for categories has",
            "gaps between bars",
            ["no gaps", "a line"],
            "Separate categories.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "discrete",
    "GF-S2.b",
    "Charts for discrete data",
    "Vertical line charts and bar charts for counts.",
    [
      problem(
        "Goals per match",
        [
          "A team's goals in 20 matches: 0 goals 4 times, 1 goal 7 times, 2 goals 5 times, 3 goals 3 times, 4 goals once. “Draw a suitable chart. How many goals in total?”",
          "By the end of this lesson, you can show and read discrete data.",
        ],
        {
          kind: "bar-chart",
          lines: true,
          bars: [
            { label: "0", value: 4 },
            { label: "1", value: 7 },
            { label: "2", value: 5 },
            { label: "3", value: 3 },
            { label: "4", value: 1 },
          ],
          max: 8,
          step: 1,
          axis: "Matches",
        },
      ),
      typed("Warm-up", "Work out $4 + 7 + 5 + 3 + 1$", "20", "Add.", "20."),
      typed("Warm-up", "Work out $2 \\times 5$", "10", "Times.", "10."),
      explain(
        "Discover",
        "Counts on a line chart",
        [
          "**Discrete** data can only take certain values, usually whole numbers: goals, pets. A **vertical line chart** draws a thin line at each value.",
          "The height is the **frequency**. Total of the data: multiply each value by its frequency and add.",
        ],
        {
          kind: "bar-chart",
          lines: true,
          bars: [
            { label: "0", value: 4 },
            { label: "1", value: 7 },
            { label: "2", value: 5 },
            { label: "3", value: 3 },
            { label: "4", value: 1 },
          ],
          max: 8,
          step: 1,
          axis: "Matches",
        },
      ),
      choose("Discover", "Which data is discrete?", "Number of siblings", "Whole numbers only.", [
        ["Height", "Height can be any value: continuous."],
        ["Time taken", "Time is continuous."],
      ]),
      worked(
        "Total goals",
        "Find the total number of goals.",
        [
          ["$0 \\times 4 + 1 \\times 7 + 2 \\times 5$", "Value × frequency."],
          ["$+ 3 \\times 3 + 4 \\times 1$", "All of them."],
          ["$0 + 7 + 10 + 9 + 4 = 30$", "Add."],
        ],
        "30 goals in 20 matches.",
      ),
      steps(
        "Together",
        "From the chart: matches with 2 or more goals",
        "Read and add.",
        [
          ["2 or more means", "2, 3 and 4 goals", ["only 2", "Or more."], "5 + 3 + 1"],
          ["So", "9 matches", ["10 matches", "$5 + 3 + 1$."], "9"],
        ],
        "9 of 20 matches.",
      ),
      choose(
        "Together",
        "The mode (most common number of goals)",
        "1 goal",
        "Tallest line: 7 matches.",
        [
          ["7 goals", "7 is how often; the value is 1."],
          ["4 goals", "The highest value isn't the mode."],
        ],
      ),
      typed("Your turn", "Matches with fewer than 2 goals", "11", "0 and 1 goals: 4 + 7.", "11."),
      typed(
        "Your turn",
        "Pets: 0 (×5), 1 (×8), 2 (×4), 3 (×3). Total pets?",
        "25",
        "$0 + 8 + 8 + 9$.",
        "25.",
        { wrong: [["20", "That's the number of people."]] },
      ),
      choose(
        "Watch out",
        "Kim says the mode is 7 because the tallest line is 7 high. Right?",
        "No: the mode is the value, 1 goal",
        "The height is the frequency.",
        [["Yes", "7 is how many matches, not goals."]],
      ),
      mistake(
        "Ali finds the total goals.",
        ["Add the frequencies: 4 + 7 + 5 + 3 + 1", "= 20", "So 20 goals"],
        2,
        "20 is the number of matches. Multiply value × frequency: 30 goals.",
      ),
      typed(
        "Back to the problem",
        "“How many goals did the team score in total?”",
        "30",
        "Value × frequency, added.",
        "30 goals.",
        { wrong: [["20", "That's the matches."]] },
      ),
      quiz([
        [
          ["Values 1, 2, 3 with frequencies 2, 3, 1. Total", "11", ["6", "3"], "$2 + 6 + 3$."],
          ["Values 0, 1, 2 with frequencies 3, 4, 3. Total", "10", ["9", "3"], "$0 + 4 + 6$."],
        ],
        [
          ["Discrete:", "shoe size", ["mass", "length"], "Set values."],
          ["Continuous:", "temperature", ["goals", "people"], "Any value."],
        ],
        [
          ["Height of a line shows", "frequency", ["the value", "the total"], "How often."],
          [
            "Mode on a line chart",
            "the tallest line's value",
            ["the tallest height", "the last value"],
            "Most common.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "time-series",
    "GF-S2.c",
    "Time series",
    "Plot data over time, join the points, and describe the trend.",
    [
      problem(
        "Ice cream sales",
        [
          "A café recorded ice cream sales each quarter for two years. The exam asks: “Describe the trend” and “What do you notice about the pattern?”",
          "By the end of this lesson, you can read a time series graph and describe it.",
        ],
        sales,
      ),
      choose("Warm-up", "Q3 is", "July to September", "Quarters are 3 months.", [
        ["March", "Q3 is the third quarter."],
      ]),
      choose("Warm-up", "Ice cream sales are highest in", "summer", "Hot weather.", [
        ["winter", "Cold weather means fewer ice creams."],
      ]),
      explain(
        "Discover",
        "Time across, values up",
        [
          "A **time series graph** plots values over time, with the points joined by straight lines.",
          "Look for the **trend** (generally rising or falling) and **seasonal** patterns that repeat.",
        ],
        sales,
      ),
      choose(
        "Discover",
        "The overall trend in sales",
        "slightly increasing",
        "Each quarter is up on the same quarter last year.",
        [
          ["decreasing", "Compare year 2 with year 1."],
          ["no pattern", "There's a clear repeat."],
        ],
      ),
      worked(
        "Describe it",
        "Describe the ice cream sales.",
        [
          ["Highest in Q3, lowest in Q1 each year", "The seasonal pattern."],
          ["Year 2 is higher than year 1 each quarter", "The trend: rising."],
        ],
        "Two things: the pattern and the trend.",
      ),
      steps(
        "Together",
        "Read the graph",
        "Year 1 Q3 and year 2 Q3.",
        [
          ["Year 1 Q3 sales:", "45", ["50", "The third point."], "45"],
          ["Year 2 Q3 is 50, so the increase is", "5", ["95", "$50 - 45$."], "5"],
        ],
        "Up 5 on the same quarter.",
      ),
      choose(
        "Together",
        "Why compare Q3 with Q3, not Q3 with Q4?",
        "To remove the seasonal effect",
        "Like with like.",
        [["Q4 is always higher", "It isn't."]],
      ),
      choose(
        "Your turn",
        "Between which quarters did sales fall most in year 1?",
        "Q3 to Q4",
        "45 to 25: down 20.",
        [
          ["Q1 to Q2", "That's a rise."],
          ["Q2 to Q3", "That's a rise."],
        ],
      ),
      choose(
        "Your turn",
        "Is the value between points on a time series meaningful?",
        "Not exactly: only the plotted points are real data",
        "Lines just show the trend.",
        [["Yes: read it exactly", "Points are the data."]],
      ),
      choose(
        "Watch out",
        "Ben says sales are falling because Q4 is lower than Q3. Is he right?",
        "That's the season; the overall trend is rising",
        "Compare the same quarter each year.",
        [["Yes", "Year 2 beats year 1 in every quarter."]],
      ),
      mistake(
        "Leah describes the trend.",
        ["Q1 25, Q2 40, Q3 50, Q4 30 in year 2", "Sales go up then down", "So there's no trend"],
        2,
        "Going up and down is the season. The trend is rising: each quarter beats last year's.",
      ),
      choose(
        "Back to the problem",
        "“Describe the trend and the pattern in ice cream sales.”",
        "Rising trend; highest in Q3 each year",
        "Trend plus season.",
        [
          ["Falling, because Q4 drops", "That's the season."],
          ["No pattern", "There's a repeat each year."],
        ],
        { picture: sales },
      ),
      quiz([
        [
          ["A time series shows data", "over time", ["by category", "as a pie"], "Time across."],
          [
            "Points on a time series are",
            "joined with straight lines",
            ["never joined", "joined with curves"],
            "Lines.",
          ],
        ],
        [
          [
            "A trend is",
            "the general direction",
            ["one high point", "the biggest value"],
            "Overall.",
          ],
          ["A seasonal pattern", "repeats", ["only happens once", "is the trend"], "Every year."],
        ],
        [
          [
            "Compare quarters",
            "same quarter, different years",
            ["neighbouring quarters", "only Q1"],
            "Like with like.",
          ],
          ["Sales Q2 last year 40, this year 46: change", "+6", ["−6", "86"], "$46 - 40$."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "grouped",
    "GF-S3.a",
    "Grouped frequency tables",
    "Group continuous data into classes, with inequalities.",
    [
      problem(
        "Pupil heights",
        [
          "30 pupils' heights are measured to the nearest millimetre. A list of 30 numbers is hard to read. The exam gives a table with classes like $150 \\le h < 160$.",
          "By the end of this lesson, you can fill in and read grouped tables.",
        ],
        heights,
      ),
      choose("Warm-up", "Is 150 in $150 \\le h < 160$?", "Yes", "≤ includes it.", [
        ["No", "≤ means 150 is in."],
      ]),
      choose(
        "Warm-up",
        "Is 160 in $150 \\le h < 160$?",
        "No: it goes in the next class",
        "< means not included.",
        [["Yes", "< excludes 160."]],
      ),
      explain(
        "Discover",
        "Classes",
        [
          "Continuous data, like height, can take any value, so we group it into **classes** with no gaps or overlaps: $150 \\le h < 160$, $160 \\le h < 170$…",
          "Each value goes in exactly one class. The class with the highest frequency is the **modal class**.",
        ],
        heights,
      ),
      choose("Discover", "Which class holds 159.9 cm?", "$150 \\le h < 160$", "Less than 160.", [
        ["$160 \\le h < 170$", "159.9 is under 160."],
      ]),
      worked(
        "Read the table",
        "How many pupils are at least 160 cm tall?",
        [
          ["$160 \\le h < 170$: 12", "These are at least 160."],
          ["$170 \\le h < 180$: 5", "These too."],
          ["$12 + 5 = 17$", "Add."],
        ],
        "17 pupils.",
      ),
      steps(
        "Together",
        "Tally these into the table: 147, 160, 172, 155",
        "Which class?",
        [
          [
            "160 goes in",
            "$160 \\le h < 170$",
            ["$150 \\le h < 160$", "160 isn't less than 160."],
            "160–170",
          ],
          ["147 goes in", "$140 \\le h < 150$", ["$150 \\le h < 160$", "147 < 150."], "140–150"],
        ],
        "Watch the boundaries.",
      ),
      choose("Together", "The modal class", "$160 \\le h < 170$", "Frequency 12.", [
        ["$170 \\le h < 180$", "Frequency 5."],
        ["12", "The class, not the frequency."],
      ]),
      typed("Your turn", "How many pupils are shorter than 160 cm?", "13", "4 + 9.", "13."),
      typed(
        "Your turn",
        "How many pupils were measured in total?",
        "30",
        "Add the frequencies.",
        "30.",
      ),
      choose(
        "Watch out",
        "A table has classes 150–160 and 160–170. Where does 160 go?",
        "It's unclear: inequalities like $150 \\le h < 160$ fix it",
        "Classes mustn't overlap.",
        [["Both", "Each value goes in one class."]],
      ),
      mistake(
        "Sam reads the modal class.",
        ["The biggest frequency is 12", "It's for $160 \\le h < 170$", "So the modal class is 12"],
        2,
        "The modal class is $160 \\le h < 170$; 12 is its frequency.",
      ),
      typed(
        "Back to the problem",
        "“How many pupils are at least 150 cm but less than 170 cm?”",
        "21",
        "9 + 12.",
        "21.",
        { wrong: [["12", "Include the 150–160 class."]] },
      ),
      quiz([
        [
          [
            "Which class holds 169.5?",
            "$160 \\le h < 170$",
            ["$170 \\le h < 180$", "$150 \\le h < 160$"],
            "Less than 170.",
          ],
          [
            "Which class holds 140?",
            "$140 \\le h < 150$",
            ["$130 \\le h < 140$", "neither"],
            "≤ includes 140.",
          ],
        ],
        [
          ["Pupils 170 cm or taller", "5", ["17", "12"], "Last class."],
          ["Pupils under 150 cm", "4", ["13", "9"], "First class."],
        ],
        [
          [
            "Modal class means",
            "the class with highest frequency",
            ["the middle class", "the widest class"],
            "Most common.",
          ],
          [
            "Grouping data loses",
            "the exact values",
            ["the total", "the classes"],
            "Only classes remain.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "frequency-polygons",
    "GF-S3.b",
    "Frequency polygons",
    "Plot frequency at each class midpoint and join with straight lines.",
    [
      problem(
        "Compare two classes",
        [
          "Two classes' test marks are grouped. The exam asks: “Draw frequency polygons for both on the same grid, and compare them.”",
          "By the end of this lesson, you can draw one and use it to compare.",
        ],
        joined(["145", "155", "165", "175"], [4, 9, 12, 5], 12, "Frequency"),
      ),
      typed("Warm-up", "Midpoint of 150 and 160", "155", "Add and halve.", "155."),
      typed("Warm-up", "Midpoint of 0 and 10", "5", "Halfway.", "5."),
      explain(
        "Discover",
        "Midpoints",
        [
          "For each class, plot the frequency above the class **midpoint**. Join the points with straight lines.",
          "Don't join the first and last to the axis unless asked, and don't close it into a shape.",
        ],
        joined(["145", "155", "165", "175"], [4, 9, 12, 5], 12, "Frequency"),
      ),
      choose(
        "Discover",
        "The point for $160 \\le h < 170$ (frequency 12) goes at",
        "(165, 12)",
        "Midpoint, frequency.",
        [
          ["(160, 12)", "Use the midpoint."],
          ["(170, 12)", "Use the midpoint."],
        ],
      ),
      worked(
        "The heights",
        "List the points to plot.",
        [
          ["(145, 4), (155, 9)", "Midpoints and frequencies."],
          ["(165, 12), (175, 5)", "All four."],
          ["Join with straight lines", "In order."],
        ],
        "Each point sits above the middle of its class.",
      ),
      steps(
        "Together",
        "Compare two polygons",
        "Class A peaks at 165; class B at 155.",
        [
          ["Which class tends to be taller?", "A", ["B", "A's peak is further right."], "A"],
          [
            "The modal class for B is",
            "$150 \\le h < 160$",
            ["$160 \\le h < 170$", "B peaks at 155."],
            "150–160",
          ],
        ],
        "Compare where they peak and how spread they are.",
      ),
      choose(
        "Together",
        "What do frequency polygons make easy?",
        "Comparing two sets of data on one grid",
        "Two lines overlap clearly.",
        [["Finding exact values", "Grouped data loses exact values."]],
      ),
      choose("Your turn", "Class $20 \\le t < 30$, frequency 7: point", "(25, 7)", "Midpoint 25.", [
        ["(20, 7)", "Midpoint."],
        ["(7, 25)", "Midpoint across, frequency up."],
      ]),
      choose(
        "Your turn",
        "Two polygons: the wider one shows data that is",
        "more spread out",
        "Range is bigger.",
        [["higher on average", "That's where it peaks."]],
      ),
      choose(
        "Watch out",
        "Jo plots each point at the start of its class. What's wrong?",
        "Use the class midpoint",
        "The polygon would shift left.",
        [["Nothing", "Midpoints represent the class."]],
      ),
      mistake(
        "Ola draws the frequency polygon.",
        [
          "Plot (145, 4), (155, 9), (165, 12), (175, 5)",
          "Join them with straight lines",
          "Join (175, 5) back to (145, 4) to close it",
        ],
        2,
        "Don't close it: a frequency polygon isn't a closed shape.",
      ),
      choose(
        "Back to the problem",
        "“Compare the two classes' frequency polygons.”",
        "Compare peaks (average) and spread",
        "Say which is higher and which is more spread.",
        [
          ["Say which line is longer", "Compare the data, not the line."],
          ["Say which has more points", "Both have one per class."],
        ],
      ),
      quiz([
        [
          ["Midpoint of $30 \\le x < 40$", "35", ["30", "40"], "Halfway."],
          ["Midpoint of $0 \\le x < 20$", "10", ["0", "20"], "Halfway."],
        ],
        [
          ["Points are joined with", "straight lines", ["a curve", "bars"], "Straight."],
          [
            "Plot frequency against",
            "the class midpoint",
            ["the class start", "the class end"],
            "Midpoint.",
          ],
        ],
        [
          [
            "Polygon A peaks further right: A's values are",
            "higher",
            ["lower", "the same"],
            "Right is bigger.",
          ],
          [
            "Polygon A is narrower: A's data is",
            "less spread",
            ["more spread", "higher"],
            "Narrow.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "histograms",
    "GF-S3.c",
    "Histograms with equal classes",
    "Bars with no gaps for grouped continuous data.",
    [
      problem(
        "The heights again",
        [
          "“Draw a histogram for the heights.” With equal class widths, a histogram looks like a bar chart with no gaps.",
          "By the end of this lesson, you can draw one and read it.",
        ],
        histogram,
      ),
      choose(
        "Warm-up",
        "A bar chart for categories has",
        "gaps between bars",
        "Separate categories.",
        [["no gaps", "That's a histogram."]],
      ),
      typed("Warm-up", "Width of the class $150 \\le h < 160$", "10", "$160 - 150$.", "10."),
      explain(
        "Discover",
        "No gaps",
        [
          "A **histogram** shows continuous grouped data. The bars touch, because the classes join with no gaps.",
          "When the classes are equal widths, the height of each bar is its frequency.",
        ],
        histogram,
      ),
      choose(
        "Discover",
        "Why do a histogram's bars touch?",
        "The data is continuous: classes join",
        "No gaps in the scale.",
        [["To save space", "It's because the data is continuous."]],
      ),
      worked(
        "Draw it",
        "Draw a histogram for the heights.",
        [
          ["Horizontal axis: height, 140 to 180", "A continuous scale."],
          ["Bars 10 wide; heights 4, 9, 12, 5", "Frequency up."],
          ["No gaps between bars", "They touch."],
        ],
        "Label both axes.",
      ),
      steps(
        "Together",
        "Read the histogram",
        "How many pupils are 150–170 cm?",
        [
          ["150–160:", "9", ["4", "The second bar."], "9"],
          ["160–170 is 12, so the total is", "21", ["12", "$9 + 12$."], "21"],
        ],
        "Read each bar against the scale.",
      ),
      choose(
        "Together",
        "Which chart suits shoe sizes?",
        "A bar or line chart",
        "Shoe sizes are discrete.",
        [["A histogram", "Histograms are for continuous data."]],
      ),
      typed("Your turn", "From the histogram: pupils under 150 cm", "4", "The first bar.", "4."),
      typed("Your turn", "From the histogram: total pupils", "30", "$4 + 9 + 12 + 5$.", "30."),
      choose(
        "Watch out",
        "Kai draws a histogram with gaps between the bars. What's wrong?",
        "Histogram bars touch: the classes join",
        "Gaps suggest separate categories.",
        [["Nothing", "Continuous data has no gaps."]],
      ),
      mistake(
        "Ivy reads the histogram.",
        ["The tallest bar is 160–170", "Its height is 12", "So 160 pupils are 160–170 cm"],
        2,
        "The height is the frequency: 12 pupils.",
      ),
      choose(
        "Back to the problem",
        "“Draw a histogram for the heights.” What must it have?",
        "Touching bars, height scale across, frequency up",
        "Continuous data.",
        [
          ["Gaps between bars", "That's a bar chart."],
          ["A slice for each class", "That's a pie chart."],
        ],
        { picture: histogram },
      ),
      quiz([
        [
          [
            "Histograms show",
            "continuous grouped data",
            ["categories", "single values"],
            "Continuous.",
          ],
          ["Histogram bars", "touch", ["have gaps", "are lines"], "No gaps."],
        ],
        [
          [
            "Equal classes: bar height shows",
            "frequency",
            ["class width", "the midpoint"],
            "Frequency.",
          ],
          ["The tallest bar shows", "the modal class", ["the median", "the range"], "Most common."],
        ],
        [
          ["From the histogram: pupils 170–180", "5", ["12", "17"], "Last bar."],
          ["From the histogram: pupils 160 or more", "17", ["12", "5"], "12 + 5."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "sampling",
    "GF-S1",
    "Sampling",
    "A fair, big enough sample tells you about the population.",
    [
      problem("The school dinner survey", [
        "A school of 1200 wants to know if pupils like the dinners. The head asks the 20 pupils in the dinner queue. “Give a reason why this sample may be biased.”",
        "By the end of this lesson, you can judge a sample and use one to estimate.",
      ]),
      choose(
        "Warm-up",
        "The population is",
        "everyone you want to know about",
        "All 1200 pupils.",
        [["the people you ask", "That's the sample."]],
      ),
      typed(
        "Warm-up",
        "$\\frac{20}{1200}$ as a fraction in simplest form",
        "1/60",
        "Divide by 20.",
        "$\\frac{1}{60}$.",
      ),
      explain(
        "Discover",
        "Population and sample",
        [
          "The **population** is the whole group. A **sample** is the part you ask. It should be **random** (everyone has an equal chance) and **large enough**.",
          "A sample is **biased** if some people are more likely to be picked: like asking only the dinner queue.",
        ],
        {
          kind: "maths",
          tex: "\\text{estimate} = \\frac{\\text{yes in sample}}{\\text{sample size}} \\times \\text{population}",
        },
      ),
      choose(
        "Discover",
        "Why is the dinner queue biased?",
        "They already chose school dinners",
        "Pupils who dislike them aren't there.",
        [
          ["It's too big", "20 isn't too big."],
          ["It's random", "Not everyone could be picked."],
        ],
      ),
      worked(
        "Estimate from a sample",
        "A random sample of 50 pupils: 30 like the dinners. Estimate for 1200 pupils.",
        [
          ["$\\frac{30}{50} = \\frac35$ like them", "Fraction in the sample."],
          ["$\\frac35 \\times 1200 = 720$", "Scale up."],
        ],
        "About 720 pupils.",
      ),
      steps(
        "Together",
        "A fish survey",
        "40 of 200 fish caught are trout. The lake has about 5000 fish.",
        [
          [
            "Fraction that are trout:",
            "$\\frac15$",
            ["$\\frac{1}{40}$", "$\\frac{40}{200}$."],
            "$\\frac15$",
          ],
          ["Estimated trout:", "1000", ["40", "$\\frac15 \\times 5000$."], "1000"],
        ],
        "Assuming the sample represents the lake.",
      ),
      choose(
        "Together",
        "Which is the best sample?",
        "100 names picked at random from the register",
        "Random and a good size.",
        [
          ["The first 10 to arrive", "Small and not random."],
          ["Your friends", "Biased."],
        ],
      ),
      typed(
        "Your turn",
        "Random sample: 12 of 40 walk to school. Estimate for 800 pupils",
        "240",
        "$\\frac{12}{40} \\times 800$.",
        "240.",
        { wrong: [["12", "Scale up to 800."]] },
      ),
      choose(
        "Your turn",
        "A survey on exercise at a gym is biased because",
        "gym members exercise more than most",
        "Not representative.",
        [["it's indoors", "The people matter."]],
      ),
      choose(
        "Watch out",
        "Mo says a bigger sample is always unbiased. Is he right?",
        "No: a big sample can still be biased if it isn't random",
        "Size helps reliability; randomness removes bias.",
        [["Yes", "1000 people from one club is still biased."]],
      ),
      mistake(
        "Kim estimates: 15 of 60 in a sample own a dog; population 900.",
        ["$\\frac{15}{60} = \\frac14$", "$\\frac14$ of 60", "= 15 dog owners"],
        1,
        "Scale to the population: $\\frac14$ of 900 = 225.",
      ),
      choose(
        "Back to the problem",
        "“The head asks 20 pupils in the dinner queue. Why may this sample be biased?”",
        "They have chosen school dinners, so are more likely to like them",
        "Not everyone had a chance.",
        [
          ["20 is too many", "The problem is who, not how many."],
          ["It isn't biased", "Pupils who avoid dinners can't be picked."],
        ],
      ),
      quiz([
        [
          ["The population is", "the whole group", ["the sample", "the questions"], "Everyone."],
          ["A sample is", "part of the population", ["the whole group", "the answers"], "Part."],
        ],
        [
          [
            "Sample: 8 of 20 say yes; population 500",
            "200",
            ["8", "40"],
            "$\\frac25 \\times 500$.",
          ],
          [
            "Sample: 9 of 30 say yes; population 600",
            "180",
            ["9", "200"],
            "$\\frac{3}{10} \\times 600$.",
          ],
        ],
        [
          [
            "A random sample means",
            "everyone has an equal chance",
            ["only volunteers", "the first people"],
            "Equal chance.",
          ],
          [
            "A bigger random sample is",
            "more reliable",
            ["more biased", "less useful"],
            "Better estimate.",
          ],
        ],
      ]),
    ],
  ),
];
