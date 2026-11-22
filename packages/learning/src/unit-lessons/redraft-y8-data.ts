// Year 8, "Statistics and probability", on the stepped template (docs/proposals/lesson-stepped.md):
// bar charts, pie charts, vertical line charts, scatter graphs, correlation and the missing
// probability. Questions about a chart are asked on the chart; working out an angle or a
// probability is number work.
import { ask, calc, explain, methodCard, questionSet, quiz, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, UnitLesson } from "./types.ts";
import { y8Data } from "./y8-data.ts";

const D = y8Data;
const NUMBER = "A calculation with the data: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });

const chart = (bars: [string, number][], max: number, step: number, lines = false): Picture => ({
  kind: "bar-chart",
  bars: bars.map(([label, value]) => ({ label, value })),
  max,
  step,
  ...(lines ? { lines: true } : {}),
  axis: lines ? "Pupils" : "Pupils",
});
const FRUIT = chart(
  [
    ["Apple", 8],
    ["Banana", 5],
    ["Grape", 3],
    ["Orange", 6],
  ],
  10,
  2,
);
const PETS = chart(
  [
    ["Cat", 7],
    ["Dog", 9],
    ["Fish", 4],
    ["Rabbit", 2],
  ],
  10,
  2,
);

// ---------------------------------------------------------------------------------------------
// Bar charts.

const BAR = "y8-data/bar-charts";
const barMethod = [
  "Check the scale: what is each square worth?",
  "Read each bar across to the scale.",
  "Add or take away to answer.",
];

const barCharts = stepped(find(D, BAR), {
  method: barMethod,
  variation: {
    relationship: "a bar's height and the frequency it shows",
    unknowns: ["frequency", "total", "difference", "fraction"],
    surface: ["steps of 2", "steps of 5", "halfway between marks"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Tables and bar charts",
        ["**Each bar's height is a frequency: read it across to the scale.**"],
        FRUIT,
        "Equal steps on the scale, gaps between the bars.",
      ),
      reworded(D, BAR, "A frequency table", { tag: "The rule" }),
      reworded(D, BAR, "Counts as bars", { tag: "The rule" }),

      reworded(D, BAR, "A tally has one gate of 5, then 3 more strokes. What is the count?", {
        tag: "Check you remember",
        title: "A gate of 5, then 3 more strokes. The count?",
      }),
      reworded(D, BAR, "Work out $8 + 5 + 3 + 6$", { tag: "Check you remember" }),

      methodCard("The method", barMethod, FRUIT),
      workedFrom(D, BAR),
      calc(
        "Your turn",
        "How many more chose dog than fish?",
        PETS,
        [
          ["Dog:", "9", "Halfway between 8 and 10."],
          ["Fish:", "4", "Read across."],
          ["Difference:", "5", "$9 - 4$."],
        ],
        "5 more chose dog.",
      ),

      calc(
        "Practise",
        "How many pupils were asked?",
        PETS,
        [["$7 + 9 + 4 + 2 =$", "22", "Add every bar."]],
        "22 pupils.",
      ),
      ...owned(D, BAR, "Together", "Practise"),
      ...owned(D, BAR, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Read the chart. Watch what changes.",
        [
          ask("How many chose cat?", "7", "Halfway between 6 and 8.", "7.", {
            asks: "frequency",
            picture: PETS,
          }),
          ask("How many chose cat or dog?", "16", "7 + 9.", "16.", {
            asks: "total",
            changed: "Two bars.",
            picture: PETS,
          }),
          ask("How many more chose cat than rabbit?", "5", "7 − 2.", "5.", {
            asks: "difference",
            changed: "A difference.",
            picture: PETS,
          }),
          ask(
            "What fraction chose fish?",
            "$\\frac{4}{22}$",
            "Out of everyone.",
            "$\\frac{4}{22}$.",
            {
              asks: "fraction",
              changed: "Out of everyone.",
              others: ["$\\frac{4}{10}$", "$\\frac{4}{18}$"],
              picture: PETS,
            },
          ),
        ],
        "Read the scale, then work it out.",
      ),

      questionSet(
        "Variation",
        "How many chose rabbit? Watch the scale.",
        [
          ask("How many chose rabbit?", "6", "Each square is 2.", "6.", {
            asks: "frequency",
            picture: chart(
              [
                ["Rabbit", 6],
                ["Fish", 4],
              ],
              10,
              2,
            ),
            expect: [
              "The scale goes up in 2s. Raj reads 3 squares as 3. Right?",
              "No",
              "Each square is 2: 3 squares is 6.",
              [["Yes", "Check what each square is worth."]],
            ],
          }),
          ask("How many chose rabbit?", "15", "Each step is 5.", "15.", {
            asks: "frequency",
            changed: "Steps of 5.",
            picture: chart(
              [
                ["Rabbit", 15],
                ["Fish", 10],
              ],
              20,
              5,
            ),
          }),
          ask("How many chose rabbit?", "6", "Each step is 1.", "6.", {
            asks: "frequency",
            changed: "Steps of 1.",
            picture: chart(
              [
                ["Rabbit", 6],
                ["Fish", 4],
              ],
              8,
              1,
            ),
          }),
          ask("How many chose rabbit?", "7", "Halfway between 6 and 8.", "7.", {
            asks: "frequency",
            changed: "Halfway between marks.",
            picture: chart(
              [
                ["Rabbit", 7],
                ["Fish", 4],
              ],
              10,
              2,
            ),
          }),
        ],
        "The scale decides what each square is worth.",
      ),
      own(D, BAR, "Spot the mistake"),

      own(D, BAR, "Exit check"),

      reworded(
        D,
        BAR,
        "What should the canteen stock most of?",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Each bar's height is a frequency: read it across to the scale.**"],
        FRUIT,
        [
          "**Each bar's height is a frequency: read it across to the scale.**",
          "Check what each square is worth first.",
          "The frequencies add up to the total asked.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Pie charts.

const PIE = "y8-data/pie-charts";
const pieMethod = [
  "Find the degrees for one: 360 ÷ the total.",
  "Times each frequency by it.",
  "Check: the angles add up to 360°.",
];
const TRAVEL: Picture = {
  kind: "spinner",
  pie: true,
  sectors: [
    { label: "Walk", size: 12 },
    { label: "Bus", size: 6 },
    { label: "Car", size: 4 },
    { label: "Bike", size: 2 },
  ],
};

const pieCharts = stepped(find(D, PIE), {
  method: pieMethod,
  variation: {
    relationship: "a pie chart's angles share 360° between the frequencies",
    unknowns: ["degrees each", "angle", "frequency"],
    surface: ["more people", "half of them", "360 people"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Pie charts",
        ["**A pie chart shares 360° between everyone.**"],
        TRAVEL,
        "24 pupils: $360 \\div 24 = 15°$ each.",
      ),
      reworded(D, PIE, "A pie chart shares out 360°", { tag: "The rule" }),
      reworded(D, PIE, "12 of the 24 walk. Their slice is", { tag: "The rule" }),

      ...owned(D, PIE, "Warm-up", "Check you remember"),

      methodCard("The method", pieMethod, TRAVEL),
      workedFrom(D, PIE),
      calc(
        "Your turn",
        "30 people chose a colour; 8 chose blue.",
        undefined,
        [
          ["Each person: $360 \\div 30 =$", "12", "Degrees for one.", { after: "°" }],
          ["Blue: $8 \\times 12 =$", "96", "Times the frequency.", { after: "°" }],
        ],
        "Blue's slice is 96°.",
      ),

      calc(
        "Practise",
        "40 people. The tea slice is 90°.",
        undefined,
        [
          ["Each person: $360 \\div 40 =$", "9", "Degrees for one.", { after: "°" }],
          ["Tea: $90 \\div 9 =$", "10", "Backwards: divide.", { after: "people" }],
        ],
        "10 people chose tea.",
      ),
      reworded(D, PIE, "The other slices", { tag: "Practise" }),
      reworded(D, PIE, "Read the pictogram", {
        tag: "Practise",
        text: "Each box is 4 books. How many on Tuesday?",
      }),
      reworded(D, PIE, "A pie chart of 36 people", {
        tag: "Practise",
        text: "Degrees for each person?",
      }),
      reworded(D, PIE, "Reading back", {
        tag: "Practise",
        text: "24 pupils; the bike slice is 30°. How many?",
      }),
      questionSet(
        "Practise",
        "A pie chart of 60 people. Watch what changes.",
        [
          ask("Degrees for each person?", "6", "360 ÷ 60.", "6°.", {
            unit: "°",
            asks: "degrees each",
          }),
          ask("15 chose rugby. Its angle?", "90", "15 × 6.", "90°.", {
            unit: "°",
            asks: "angle",
            changed: "Now a slice.",
          }),
          ask("The football slice is 120°. How many?", "20", "120 ÷ 6.", "20.", {
            asks: "frequency",
            changed: "Backwards.",
          }),
          ask("30 chose tennis. Its angle?", "180", "Half of them.", "180°.", {
            unit: "°",
            asks: "angle",
            changed: "Half of them.",
          }),
        ],
        "Degrees for one first.",
      ),

      questionSet(
        "Variation",
        "5 chose red. Find the angle. Watch what changes.",
        [
          ask("Out of 30 people?", "60", "12° each.", "60°.", {
            unit: "°",
            asks: "angle",
            expect: [
              "Zoe gives red 5°, one for each person. Right?",
              "No",
              "Each person is 12°: $5 \\times 12 = 60°$.",
              [["Yes", "Times by the degrees for one."]],
            ],
          }),
          ask("Out of 60 people?", "30", "6° each.", "30°.", {
            unit: "°",
            asks: "angle",
            changed: "Twice as many people.",
          }),
          ask("Out of 10 people?", "180", "36° each.", "180°.", {
            unit: "°",
            asks: "angle",
            changed: "Half of them.",
          }),
          ask("Out of 360 people?", "5", "1° each.", "5°.", {
            unit: "°",
            asks: "angle",
            changed: "360 people.",
          }),
        ],
        "The same 5 people get a smaller slice of a bigger crowd.",
      ),
      own(D, PIE, "Spot the mistake"),

      quiz([
        [
          ["Pie chart of 18 people: degrees each?", "20°", ["18°", "30°"], "360 ÷ 18."],
          ["Pie chart of 45 people: degrees each?", "8°", ["45°", "9°"], "360 ÷ 45."],
        ],
        [
          ["Pie chart of 12 people: the angle for 3?", "90°", ["3°", "36°"], "30° each."],
          ["Pie chart of 20 people: the angle for 5?", "90°", ["5°", "20°"], "18° each."],
        ],
        [
          [
            "A box is 6 cars. Two and a half boxes?",
            "15 cars",
            ["2.5 cars", "12 cars"],
            "6 + 6 + 3.",
          ],
          [
            "A box is 4 cars. Three and a half boxes?",
            "14 cars",
            ["3.5 cars", "12 cars"],
            "4 + 4 + 4 + 2.",
          ],
        ],
      ]),

      reworded(
        D,
        PIE,
        "Walk 12, bus 6, car 4, bike 2",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A pie chart shares 360° between everyone.**"],
        TRAVEL,
        [
          "**A pie chart shares 360° between everyone.**",
          "Degrees for one: 360 ÷ the total.",
          "Angle = frequency × degrees for one.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Vertical line charts.

const LINE = "y8-data/line-charts";
const lineMethod = [
  "Read each line's height: its frequency.",
  "How many? Add the heights.",
  "A total of values? Times each value by its height.",
];
const counts = (f: [number, number, number, number]): Picture => ({
  kind: "bar-chart",
  lines: true,
  bars: f.map((value, i) => ({ label: String(i), value })),
  max: 7,
  step: 1,
  axis: "Pupils",
});
const GOALS: Picture = {
  kind: "bar-chart",
  lines: true,
  bars: [
    { label: "0", value: 3 },
    { label: "1", value: 5 },
    { label: "2", value: 4 },
    { label: "3", value: 2 },
  ],
  max: 6,
  step: 1,
  axis: "Matches",
};
const PETS_EACH = counts([2, 6, 5, 3]);
const goalsChart = (f: [number, number, number, number]): Picture => ({
  ...GOALS,
  bars: f.map((value, i) => ({ label: String(i), value })),
});

const lineCharts = stepped(find(D, LINE), {
  method: lineMethod,
  variation: {
    relationship: "a line's height and how often its value came up",
    unknowns: ["frequency", "total", "mode"],
    surface: ["fewer than", "two modes", "the mode at zero"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Vertical line charts",
        ["**A thin line at each value, as tall as its frequency.**"],
        GOALS,
        "Goals are whole numbers: nothing lies between them.",
      ),
      reworded(D, LINE, "A vertical line chart", { tag: "The rule" }),
      reworded(D, LINE, "How many matches had 1 goal?", { tag: "The rule" }),

      ...owned(D, LINE, "Warm-up", "Check you remember"),

      methodCard("The method", lineMethod, GOALS),
      workedFrom(D, LINE),
      calc(
        "Your turn",
        "Pets per pupil. How many pets in all?",
        PETS_EACH,
        [
          ["$1 \\times 6 + 2 \\times 5 + 3 \\times 3 =$", "25", "Each value times its height."],
          ["Pupils asked: $2 + 6 + 5 + 3 =$", "16", "Add the heights."],
        ],
        "25 pets between 16 pupils.",
      ),

      calc(
        "Practise",
        "How many pupils have 2 or more pets?",
        PETS_EACH,
        [["$5 + 3 =$", "8", "The lines at 2 and 3."]],
        "8 pupils.",
      ),
      ...owned(D, LINE, "Together", "Practise"),
      ...owned(D, LINE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Pets per pupil. Watch what changes.",
        [
          ask("How many have 1 pet?", "6", "The line at 1.", "6.", {
            asks: "frequency",
            picture: PETS_EACH,
          }),
          ask("How many have fewer than 2?", "8", "The lines at 0 and 1.", "8.", {
            asks: "frequency",
            changed: "Fewer than.",
            picture: PETS_EACH,
          }),
          ask("What is the mode?", "1", "The value with the tallest line.", "1 pet.", {
            asks: "mode",
            changed: "The mode.",
            picture: PETS_EACH,
          }),
          ask("How many pets do the 3-pet pupils have?", "9", "3 × 3.", "9.", {
            asks: "total",
            changed: "A total of pets.",
            picture: PETS_EACH,
          }),
        ],
        "Heights are frequencies; values sit underneath.",
      ),

      questionSet(
        "Variation",
        "Goals per match. Find the mode.",
        [
          ask("The mode?", "1 goal", "The tallest line.", "1 goal.", {
            asks: "mode",
            others: ["5 goals", "3 goals"],
            picture: GOALS,
            expect: [
              "Sam says the mode is 5, the tallest height. Right?",
              "No",
              "The mode is the value with the tallest line: 1 goal.",
              [["Yes", "Read the value under the line."]],
            ],
          }),
          ask("The mode?", "2 goals", "The tallest line.", "2 goals.", {
            asks: "mode",
            changed: "A new tallest line.",
            others: ["6 goals", "0 goals"],
            picture: goalsChart([3, 2, 6, 2]),
          }),
          ask("The mode?", "0 goals", "The tallest line.", "0 goals.", {
            asks: "mode",
            changed: "At zero.",
            others: ["6 goals", "1 goal"],
            picture: goalsChart([6, 2, 2, 1]),
          }),
          ask("The mode?", "0 and 1 goals", "Two tallest lines.", "0 and 1 goals.", {
            asks: "mode",
            changed: "Two tallest.",
            others: ["4 goals", "0 goals"],
            picture: goalsChart([4, 4, 1, 1]),
          }),
        ],
        "The mode is a value, never a height.",
      ),
      own(D, LINE, "Spot the mistake"),

      own(D, LINE, "Exit check"),

      reworded(
        D,
        LINE,
        "How often did they score 2 or more?",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A thin line at each value, as tall as its frequency.**"],
        GOALS,
        [
          "**A thin line at each value, as tall as its frequency.**",
          "The mode is the value with the tallest line.",
          "Total of values: each value × its height.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Scatter graphs.

const SCATTER = "y8-data/scatter";
const scatterMethod = [
  "Choose which value goes across and which goes up.",
  "Plot each pair as one point.",
  "Don't join them: look for a pattern.",
];
const scatter = (points: Point[]): Picture => ({
  kind: "graph",
  range: { xMin: 0, xMax: 8, yMin: 0, yMax: 10 },
  points,
});
const RISING = scatter([
  { x: 1, y: 3 },
  { x: 2, y: 4 },
  { x: 3, y: 4 },
  { x: 4, y: 6 },
  { x: 5, y: 7 },
  { x: 6, y: 8 },
]);
const FALLING = scatter([
  { x: 1, y: 9 },
  { x: 2, y: 8 },
  { x: 3, y: 6 },
  { x: 4, y: 6 },
  { x: 5, y: 4 },
  { x: 6, y: 2 },
]);
const NONE = scatter([
  { x: 1, y: 5 },
  { x: 2, y: 2 },
  { x: 3, y: 8 },
  { x: 4, y: 3 },
  { x: 5, y: 7 },
  { x: 6, y: 4 },
]);

const scatterGraphs = stepped(find(D, SCATTER), {
  method: scatterMethod,
  variation: {
    relationship: "a pair of values and its point",
    unknowns: ["point", "pattern"],
    surface: ["said the other way round", "swapped axes", "on an axis"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Scatter graphs",
        ["**Plot each pair as one point. Don't join them.**"],
        RISING,
        "Hours across, score up: then look at the pattern.",
      ),
      reworded(D, SCATTER, "Each pupil is a point", { tag: "The rule" }),

      ...owned(D, SCATTER, "Warm-up", "Check you remember"),

      methodCard("The method", scatterMethod, RISING),
      workedFrom(D, SCATTER),
      calc(
        "Your turn",
        "A pupil revised 6 hours and scored 9.",
        undefined,
        [
          ["Across (hours):", "6", "Hours go across."],
          ["Up (score):", "9", "Score goes up."],
        ],
        "The point is (6, 9).",
      ),

      calc(
        "Practise",
        "Read this pupil's point.",
        scatter([{ x: 3, y: 5 }]),
        [
          ["Hours:", "3", "Across."],
          ["Score:", "5", "Up."],
        ],
        "3 hours, score 5.",
      ),
      ...owned(D, SCATTER, "Together", "Practise"),
      ...owned(D, SCATTER, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Hours across, score up. Watch what changes.",
        [
          ask("This pupil revised how many hours?", "2", "Read across.", "2 hours.", {
            asks: "point",
            picture: scatter([{ x: 2, y: 3 }]),
          }),
          ask("What did this pupil score?", "3", "Read up.", "3.", {
            asks: "point",
            changed: "Now up.",
            picture: scatter([{ x: 2, y: 3 }]),
          }),
          ask("5 hours, score 8. The point?", "(5, 8)", "Hours first.", "(5, 8).", {
            asks: "point",
            changed: "Write the point.",
            others: ["(8, 5)", "(5, 5)"],
          }),
          ask("Is there a pattern?", "Yes: they rise", "Left to right.", "Yes: they rise.", {
            asks: "pattern",
            changed: "The pattern.",
            others: ["No"],
            picture: RISING,
          }),
        ],
        "One pair, one point.",
      ),

      questionSet(
        "Variation",
        "Hours across, score up. Find the point.",
        [
          ask("7 hours, scored 8.", "(7, 8)", "Hours across.", "(7, 8).", {
            asks: "point",
            others: ["(8, 7)", "(7, 7)"],
            expect: [
              "Mo plots 7 hours, score 8 as (8, 7). Right?",
              "No",
              "Hours go across: (7, 8).",
              [["Yes", "Which value goes across?"]],
            ],
          }),
          ask("Scored 8, after 7 hours.", "(7, 8)", "Still hours across.", "(7, 8).", {
            asks: "point",
            changed: "Said the other way round.",
            others: ["(8, 7)", "(8, 8)"],
          }),
          ask(
            "Score across, hours up: 7 hours, scored 8.",
            "(8, 7)",
            "Score first now.",
            "(8, 7).",
            {
              asks: "point",
              changed: "Swapped axes.",
              others: ["(7, 8)", "(7, 7)"],
            },
          ),
          ask("0 hours, scored 2.", "(0, 2)", "Hours across: 0.", "(0, 2).", {
            asks: "point",
            changed: "On an axis.",
            others: ["(2, 0)", "(2, 2)"],
          }),
        ],
        "Check which value goes across, every time.",
      ),
      own(D, SCATTER, "Spot the mistake"),

      own(D, SCATTER, "Exit check"),

      reworded(
        D,
        SCATTER,
        "Does more revision go with higher scores?",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Plot each pair as one point. Don't join them.**"],
        RISING,
        [
          "**Plot each pair as one point. Don't join them.**",
          "Check which value goes across.",
          "Then look for a pattern.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Correlation.

const CORR = "y8-data/correlation";
const corrMethod = [
  "Look from left to right.",
  "Rising: positive. Falling: negative. No pattern: none.",
  "Ask: could something else cause both?",
];
const TYPES = ["Positive", "Negative", "None"];
const kind = (pic: Picture, right: string, extra: Record<string, unknown>) =>
  ask("Describe the correlation.", right, "Look from left to right.", `${right}.`, {
    asks: "type",
    others: TYPES.filter((t) => t !== right),
    picture: pic,
    ...extra,
  });

const correlation = stepped(find(D, CORR), {
  method: corrMethod,
  variation: {
    relationship: "the pattern in a scatter graph, and what it does and doesn't prove",
    unknowns: ["type", "cause"],
    surface: ["falling", "no pattern", "hidden causes"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Correlation",
        ["**Positive: both rise. Negative: one falls as the other rises.**"],
        RISING,
        "No pattern: no correlation. And correlation never proves cause.",
      ),
      reworded(D, CORR, "Three kinds", { tag: "The rule" }),
      reworded(D, CORR, "Which correlation?", { tag: "The rule" }),

      ...owned(D, CORR, "Warm-up", "Check you remember"),

      methodCard("The method", corrMethod, FALLING),
      workedFrom(D, CORR),
      calc(
        "Your turn",
        "Describe the correlation.",
        FALLING,
        [
          ["At $x = 1$, $y =$", "9", "The first point."],
          ["At $x = 6$, $y =$", "2", "The last point."],
        ],
        "y falls as x rises: negative correlation.",
      ),

      reworded(D, CORR, "Describe this correlation", { tag: "Practise" }, "Together"),
      reworded(D, CORR, "Does one cause the other?", {
        tag: "Practise",
        title: "Cause?",
        text: "Ice cream and sunglasses sales both rise in summer.",
      }),
      reworded(
        D,
        CORR,
        "Hours of TV and test scores: as one goes up, the other goes down. That's",
        { tag: "Practise", title: "More TV, lower test scores. That's" },
      ),
      reworded(D, CORR, "Describe this correlation", { tag: "Practise" }, "Your turn"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          kind(RISING, "Positive", {}),
          kind(FALLING, "Negative", { changed: "Falling." }),
          kind(NONE, "None", { changed: "No pattern." }),
          ask(
            "Height and shoe size?",
            "Positive",
            "Taller people tend to have bigger feet.",
            "Positive.",
            {
              asks: "type",
              changed: "Real data.",
              others: ["Negative", "None"],
            },
          ),
        ],
        "Left to right: up, down or neither.",
      ),

      questionSet(
        "Variation",
        "Does one cause the other? Watch what changes.",
        [
          ask(
            "More doctors, more illness. Do doctors cause illness?",
            "No",
            "Think bigger towns.",
            "No.",
            {
              asks: "cause",
              others: ["Yes"],
              expect: [
                "Does a correlation prove one thing causes another?",
                "No",
                "Something else can cause both: bigger towns have more of each.",
                [["Yes", "Look for a hidden cause."]],
              ],
            },
          ),
          ask(
            "Ice creams and sunburn rise together. Why?",
            "Sunny weather",
            "What causes both?",
            "Sunny weather.",
            {
              asks: "cause",
              changed: "Summer.",
              others: ["Ice cream burns", "Sunburn makes you hungry"],
            },
          ),
          ask(
            "Revision and scores rise together. Proof?",
            "No, but a link is likely",
            "Correlation alone isn't proof.",
            "Likely, but not proved.",
            {
              asks: "cause",
              changed: "A likely link.",
              others: ["Yes, it proves it"],
            },
          ),
          ask(
            "Shoe size and spelling rise in a school. Why?",
            "Older pupils have both",
            "A hidden cause.",
            "Age.",
            {
              asks: "cause",
              changed: "A hidden cause.",
              others: ["Big feet help spelling", "No reason"],
            },
          ),
        ],
        "Correlation shows a link, never the cause.",
      ),
      own(D, CORR, "Spot the mistake"),

      own(D, CORR, "Exit check"),

      reworded(D, CORR, "Ice creams and sunglasses", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Positive: both rise. Negative: one falls as the other rises.**"],
        RISING,
        [
          "**Positive: both rise. Negative: one falls as the other rises.**",
          "No pattern: no correlation.",
          "Correlation never proves cause.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// The missing probability.

const MISSING = "y8-data/missing-probability";
const missingMethod = [
  "Add the probabilities you know.",
  "Take the total from 1.",
  "With algebra: add them all, make it equal 1, solve.",
];
const ADD_TO_ONE: Picture = {
  kind: "table",
  head: ["Red", "Blue", "Green"],
  rows: [["0.2", "0.35", "?"]],
};

const missing = stepped(find(D, MISSING), {
  method: missingMethod,
  variation: {
    relationship: "all the probabilities add up to 1",
    unknowns: ["missing", "x"],
    surface: ["nothing left", "small probabilities", "four outcomes"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The missing probability",
        ["**All the probabilities add up to 1.**"],
        ADD_TO_ONE,
        "So the missing one is 1 take away the rest: 0.45.",
      ),
      reworded(D, MISSING, "They add to 1", { tag: "The rule" }),
      reworded(D, MISSING, "P(rain) = 0.7. P(not rain) is", { tag: "The rule" }),

      ...owned(D, MISSING, "Warm-up", "Check you remember"),

      methodCard("The method", missingMethod, maths("0.2 + 0.35 + p = 1")),
      workedFrom(D, MISSING),
      calc(
        "Your turn",
        "Red 0.3, blue 0.45, green ?",
        undefined,
        [
          ["$0.3 + 0.45 =$", "0.75", "Add the ones you know."],
          ["$1 - 0.75 =$", "0.25", "Take from 1."],
        ],
        "P(green) = 0.25.",
      ),

      calc(
        "Practise",
        "P(A) = 0.4, P(B) = $x$, P(C) = $3x$.",
        undefined,
        [
          ["$4x = 1 - 0.4 =$", "0.6", "x and 3x make 4x."],
          ["$x =$", "0.15", "Divide by 4."],
        ],
        "$x = 0.15$.",
      ),
      ...owned(D, MISSING, "Together", "Practise"),
      ...owned(D, MISSING, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("Win 0.6, draw 0.1. P(lose)?", "0.3", "1 − 0.7.", "0.3.", { asks: "missing" }),
          ask("Win 0.6. P(not win)?", "0.4", "1 − 0.6.", "0.4.", {
            asks: "missing",
            changed: "Not happening.",
          }),
          ask("P(A) = 0.6, P(B) = $x$, P(C) = $x$. Find $x$.", "0.2", "$2x = 0.4$.", "0.2.", {
            asks: "x",
            changed: "Two equal.",
          }),
          ask("P(A) = 0.6, P(B) = $x$, P(C) = $3x$. Find $x$.", "0.1", "$4x = 0.4$.", "0.1.", {
            asks: "x",
            changed: "One three times the other.",
          }),
        ],
        "They always add to 1.",
      ),

      questionSet(
        "Variation",
        "Red, blue, green. Find P(green).",
        [
          ask("Red 0.5, blue 0.3.", "0.2", "1 − 0.8.", "0.2.", {
            asks: "missing",
            expect: [
              "Pip says green is 0.4 here. Possible?",
              "No",
              "0.5 + 0.3 + 0.4 = 1.2: more than 1.",
              [["Yes", "They must add to exactly 1."]],
            ],
          }),
          ask("Red 0.5, blue 0.5.", "0", "Nothing left.", "0: green can't happen.", {
            asks: "missing",
            changed: "Nothing left.",
          }),
          ask("Red 0.05, blue 0.3.", "0.65", "1 − 0.35.", "0.65.", {
            asks: "missing",
            changed: "A small one.",
          }),
          ask("Red 0.25, blue 0.25, yellow 0.25.", "0.25", "1 − 0.75.", "0.25.", {
            asks: "missing",
            changed: "Four colours.",
          }),
        ],
        "Whatever is left from 1 is the missing one.",
      ),
      reworded(
        D,
        MISSING,
        "Where did it go wrong?",
        { text: "Green $x$, yellow $2x$, red and blue 0.4 in all." },
        "Spot the mistake",
      ),

      quiz([
        [
          ["Only A, B or C. P(A) = 0.25, P(B) = 0.4. P(C)?", "0.35", ["0.65", "0.15"], "1 − 0.65."],
          ["Only A, B or C. P(A) = 0.3, P(B) = 0.5. P(C)?", "0.2", ["0.8", "0.3"], "1 − 0.8."],
        ],
        [
          ["P(A) = 0.4, P(B) = $x$, P(C) = $2x$. Find $x$.", "0.2", ["0.6", "0.3"], "$3x = 0.6$."],
          ["P(A) = 0.1, P(B) = $x$, P(C) = $2x$. Find $x$.", "0.3", ["0.9", "0.45"], "$3x = 0.9$."],
        ],
        [
          ["P(late) = 0.15. P(not late)?", "0.85", ["0.15", "0.95"], "1 − 0.15."],
          ["P(rain) = 0.35. P(no rain)?", "0.65", ["0.35", "0.75"], "1 − 0.35."],
        ],
      ]),

      reworded(
        D,
        MISSING,
        "Red 0.1, blue 0.3, green $x$, yellow $2x$",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**All the probabilities add up to 1.**"],
        ADD_TO_ONE,
        [
          "**All the probabilities add up to 1.**",
          "Missing one: 1 take away the rest.",
          "P(not A) = 1 − P(A).",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

export const y8DataStepped: [string, UnitLesson[]][] = [
  [BAR, [barCharts]],
  [PIE, [pieCharts]],
  [LINE, [lineCharts]],
  [SCATTER, [scatterGraphs]],
  [CORR, [correlation]],
  [MISSING, [missing]],
];
