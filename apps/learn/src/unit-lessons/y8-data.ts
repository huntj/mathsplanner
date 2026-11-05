// Year 8, "Data and probability", as six short lessons, one just before each skill: frequency
// tables and bar charts, pie charts in degrees and pictograms, vertical line charts, plotting a
// scatter graph, describing its correlation, and missing probabilities that make the total 1.
// Each starts from something quick, builds the idea a step at a time, names the common mistakes,
// and ends on an exit check.
import type { Picture, Point, UnitLesson } from "./types.ts";

const BAR = "Y8-STA-01.a";
const PIE = "Y8-STA-01.b";
const LINE = "Y8-STA-01.c";
const SCATTER = "Y8-STA-02.a";
const CORRELATION = "Y8-STA-02.b";
const MISSING = "Y8-PRO-01";

const fruit: Picture = {
  kind: "bar-chart",
  bars: [
    { label: "Apple", value: 8 },
    { label: "Banana", value: 5 },
    { label: "Grape", value: 3 },
    { label: "Orange", value: 6 },
  ],
  max: 10,
  step: 2,
  axis: "Pupils",
};

const travel: Picture = {
  kind: "spinner",
  pie: true,
  sectors: [
    { label: "Walk", size: 12 },
    { label: "Bus", size: 6 },
    { label: "Car", size: 4 },
    { label: "Bike", size: 2 },
  ],
};

const goals: Picture = {
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

const scatter = (points: Point[]): Picture => ({
  kind: "graph",
  range: { xMin: 0, xMax: 8, yMin: 0, yMax: 10 },
  points,
});
const rising = scatter([
  { x: 1, y: 3 },
  { x: 2, y: 4 },
  { x: 3, y: 4 },
  { x: 4, y: 5 },
  { x: 5, y: 7 },
  { x: 6, y: 7 },
  { x: 7, y: 8 },
]);
const falling = scatter([
  { x: 1, y: 9 },
  { x: 2, y: 8 },
  { x: 3, y: 8 },
  { x: 4, y: 6 },
  { x: 5, y: 5 },
  { x: 6, y: 4 },
  { x: 7, y: 2 },
]);
const none = scatter([
  { x: 1, y: 6 },
  { x: 2, y: 2 },
  { x: 3, y: 8 },
  { x: 4, y: 4 },
  { x: 5, y: 9 },
  { x: 6, y: 3 },
  { x: 7, y: 6 },
]);

export const y8Data: UnitLesson[] = [
  {
    unit: "y8-data",
    id: "y8-data/bar-charts",
    before: BAR,
    title: "Tables and bar charts",
    summary: "Count into a frequency table, then draw each count as a bar.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The canteen survey",
        text: [
          "The canteen asked 22 pupils their favourite fruit, to decide what to stock. A long list of answers is hard to read.",
          "By the end of this lesson, you can count them into a table and a chart that shows the answer at a glance.",
        ],
        picture: {
          kind: "table",
          rows: [
            ["Apple", "Grape", "Apple", "Orange", "Banana", "Apple"],
            ["Orange", "Apple", "Banana", "Grape", "Apple", "…"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A tally has one gate of 5, then 3 more strokes. What is the count?",
        answers: ["8"],
        hint: "A gate of 5, then 3 more.",
        done: "5 + 3 = 8.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $8 + 5 + 3 + 6$",
        answers: ["22"],
        hint: "Add them one at a time.",
        done: "22.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A frequency table",
        text: [
          "A **frequency table** counts how many of each. Tally as you go, then write the totals: the **frequencies**.",
          "The frequencies add up to the number asked: 22.",
        ],
        picture: {
          kind: "table",
          head: ["Fruit", "Frequency"],
          rows: [
            ["Apple", "8"],
            ["Banana", "5"],
            ["Grape", "3"],
            ["Orange", "6"],
          ],
        },
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Counts as bars",
        text: [
          "A **bar chart** draws each frequency as a bar, with gaps between them. Label both axes, and use an even scale.",
        ],
        picture: fruit,
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Read the chart",
        problem: "How many more chose apple than grape?",
        picture: fruit,
        steps: [
          { line: "Apple: 8", why: "Read across from the top of the bar." },
          { line: "Grape: 3", why: "" },
          { line: "$8 - 3 = 5$ more", why: "Compare." },
        ],
        done: "Read each bar against the scale.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Halfway marks",
        picture: fruit,
        start: "The scale goes up in 2s.",
        stages: [
          {
            prompt: "The banana bar is halfway between 4 and 6, so it's",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "4.5", feedback: "Halfway between 4 and 6 is 5." },
            ],
            then: "Banana: 5",
          },
          {
            prompt: "The total number of pupils is",
            options: [
              { text: "22", correct: true, feedback: "" },
              { text: "4", feedback: "That's the number of bars. Add their heights." },
            ],
            then: "8 + 5 + 3 + 6 = 22",
          },
        ],
        done: "The bars add up to everyone asked.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Which fruit was the most popular?",
        picture: fruit,
        options: [
          { text: "Apple", correct: true, feedback: "The tallest bar: the mode." },
          { text: "Grape", feedback: "That's the shortest." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "How many chose orange or banana?",
        picture: fruit,
        answers: ["11"],
        hint: "6 + 5.",
        done: "11 pupils.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "What fraction chose apple?",
        picture: fruit,
        options: [
          {
            text: "$\\frac{8}{22}$",
            correct: true,
            feedback: "8 out of 22, which simplifies to $\\frac{4}{11}$.",
          },
          { text: "$\\frac{8}{10}$", feedback: "10 is the top of the scale, not the total." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "A bar chart's scale goes 0, 2, 4, 8, 10. What's wrong?",
        options: [
          {
            text: "The steps aren't equal: 6 is missing",
            correct: true,
            feedback: "An uneven scale makes the bars mislead. Every step must be the same.",
          },
          { text: "Nothing", feedback: "From 4 to 8 is a bigger jump than the rest." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Raj reads the chart, scale in 2s.",
        picture: fruit,
        lines: ["Apple: 8", "Banana: 4 squares up, so 4", "Grape: 3"],
        wrong: 1,
        why: "Read the scale, not the squares: banana is 5.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "What should the canteen stock most of?",
        picture: fruit,
        options: [
          {
            text: "Apples: 8 of 22 chose them",
            correct: true,
            feedback: "The chart shows it at a glance.",
          },
          { text: "Grapes", feedback: "Grapes were the least popular." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "How many chose apple or grape?",
            picture: fruit,
            options: ["11", "8", "5"],
            answers: ["11"],
            why: "8 + 3.",
            retry: {
              prompt: "How many chose banana or grape?",
              picture: fruit,
              options: ["8", "5", "2"],
              answers: ["8"],
              why: "5 + 3.",
            },
          },
          {
            prompt: "How many more chose orange than grape?",
            picture: fruit,
            options: ["3", "9", "6"],
            answers: ["3"],
            why: "6 − 3.",
            retry: {
              prompt: "How many more chose apple than banana?",
              picture: fruit,
              options: ["3", "13", "8"],
              answers: ["3"],
              why: "8 − 5.",
            },
          },
          {
            prompt: "In a frequency table, the frequencies add up to",
            options: ["the total counted", "100", "the biggest count"],
            answers: ["the total counted"],
            why: "Everyone is counted once.",
            retry: {
              prompt: "The most common item is shown by",
              options: ["the tallest bar", "the first bar", "the widest bar"],
              answers: ["the tallest bar"],
              why: "The biggest frequency.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-data",
    id: "y8-data/pie-charts",
    before: PIE,
    title: "Pie charts and pictograms",
    summary: "A pie chart shares 360° between the groups; a pictogram uses symbols.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Getting to school",
        text: [
          "24 pupils said how they get to school. The head wants a chart showing each way as a share of the whole.",
          "By the end of this lesson, you can draw it as a pie chart, working out every angle.",
        ],
        picture: {
          kind: "table",
          head: ["Walk", "Bus", "Car", "Bike"],
          rows: [["12", "6", "4", "2"]],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many degrees in a full turn?",
        answers: ["360"],
        unit: "°",
        hint: "A full circle.",
        done: "360°.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $360 \\div 24$",
        answers: ["15"],
        hint: "$360 \\div 12 = 30$, then halve.",
        done: "15.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A pie chart shares out 360°",
        text: [
          "In a pie chart, the whole circle, 360°, is everybody. 24 pupils, so each pupil gets $360 \\div 24 = 15°$.",
          "Each slice is its frequency × 15°.",
        ],
        picture: travel,
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "12 of the 24 walk. Their slice is",
        picture: travel,
        options: [
          { text: "half the circle: 180°", correct: true, feedback: "12 is half of 24." },
          { text: "12°", feedback: "Each pupil is 15°: $12 \\times 15$." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "The bus slice",
        problem: "6 of the 24 pupils come by bus. Find the angle of their slice.",
        steps: [
          { line: "Each pupil: $360 \\div 24 = 15°$", why: "Share out the circle." },
          { line: "Bus: $6 \\times 15 = 90°$", why: "Frequency × angle each." },
        ],
        done: "90°: a quarter, as 6 is a quarter of 24.",
      },
      {
        kind: "fill",
        tag: "Together",
        title: "The other slices",
        template: "Walk: $12 \\times 15° =$ [] and car: $4 \\times 15° =$ []",
        bank: ["$180°$", "$120°$", "$60°$", "$40°$"],
        answers: ["$180°$", "$60°$"],
        hint: "Multiply each count by 15°.",
        done: "The slices, 180° + 90° + 60° + 30°, add to 360°.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Read the pictogram",
        text: "In this pictogram, each whole box stands for 4 books. How many books were borrowed on Tuesday?",
        picture: {
          kind: "bars",
          rows: [
            { label: "Monday", parts: 3 },
            { label: "Tuesday", parts: 3, shaded: 2.5 },
          ],
        },
        options: [
          {
            text: "10",
            correct: true,
            feedback: "Two whole boxes are 8 books, and half a box is 2.",
          },
          { text: "3", feedback: "Count what the boxes stand for: each one is 4 books." },
          { text: "12", feedback: "The last box is only half shaded: 2 books." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A pie chart of 36 people",
        text: "How many degrees does each person get?",
        answers: ["10"],
        unit: "°",
        hint: "$360 \\div 36$.",
        done: "10° each.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Reading back",
        text: "In a pie chart of 24 pupils, the bike slice is 30°. How many cycle?",
        picture: travel,
        answers: ["2"],
        wrong: [{ answer: "30", feedback: "30 is the angle. Each pupil is 15°." }],
        hint: "$30 \\div 15$.",
        done: "2 pupils.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Two pie charts: in one, half of 20 pupils walk; in the other, half of 200. Do more walk in the second?",
        options: [
          {
            text: "Yes: 100 vs 10, though the slices look the same",
            correct: true,
            feedback: "A pie chart shows shares, not numbers. Check the total before comparing.",
          },
          { text: "No: the slices are the same size", feedback: "Same share, different totals." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Zoe draws a pie chart for 30 people. 5 chose red.",
        lines: ["$360 \\div 30 = 12°$ each", "Red: $5 \\times 12 = 60°$", "Red's slice is 5°"],
        wrong: 2,
        why: "She worked it out, then drew the count. Red's slice is 60°.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Walk 12, bus 6, car 4, bike 2",
        text: "The slices are",
        picture: travel,
        options: [
          { text: "180°, 90°, 60°, 30°", correct: true, feedback: "Each × 15°; they add to 360°." },
          { text: "12°, 6°, 4°, 2°", feedback: "Each pupil is 15°, not 1°." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Pie chart of 18 people: degrees each?",
            options: ["20°", "18°", "6.5°"],
            answers: ["20°"],
            why: "360 ÷ 18.",
            retry: {
              prompt: "Pie chart of 60 people: degrees each?",
              options: ["6°", "60°", "10°"],
              answers: ["6°"],
              why: "360 ÷ 60.",
            },
          },
          {
            prompt: "Pie chart of 12 people: slice for 3 of them?",
            options: ["90°", "3°", "36°"],
            answers: ["90°"],
            why: "30° each, × 3.",
            retry: {
              prompt: "Pie chart of 40 people: slice for 10 of them?",
              options: ["90°", "10°", "40°"],
              answers: ["90°"],
              why: "9° each, × 10.",
            },
          },
          {
            prompt: "A pictogram box stands for 6 cars. Two and a half boxes is",
            options: ["15 cars", "2.5 cars", "12 cars"],
            answers: ["15 cars"],
            why: "6 + 6 + 3.",
            retry: {
              prompt: "A pictogram box stands for 10 people. Three and a half boxes is",
              options: ["35 people", "3.5 people", "30 people"],
              answers: ["35 people"],
              why: "10 + 10 + 10 + 5.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-data",
    id: "y8-data/line-charts",
    before: LINE,
    title: "Vertical line charts",
    summary: "For whole-number data, thin lines show how often each value came up.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Goals per match",
        text: [
          "A football team's coach recorded the goals scored in 14 matches. How often did they score 2 or more?",
          "By the end of this lesson, you can draw and read the right chart for counts like this.",
        ],
        picture: {
          kind: "table",
          head: ["Goals", "0", "1", "2", "3"],
          rows: [["Matches", "3", "5", "4", "2"]],
        },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Can a team score 1.5 goals in a match?",
        options: [
          {
            text: "No: goals are whole numbers",
            correct: true,
            feedback: "Data you count is **discrete**.",
          },
          { text: "Yes", feedback: "You can't score half a goal." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $3 + 5 + 4 + 2$",
        answers: ["14"],
        hint: "Add them up.",
        done: "14 matches.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A vertical line chart",
        text: [
          "For whole-number values, like goals, a **vertical line chart** draws a thin line at each value. Its height is the frequency.",
          "Thin lines remind you nothing lies between the values.",
        ],
        picture: goals,
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "How many matches had 1 goal?",
        picture: goals,
        options: [
          { text: "5", correct: true, feedback: "The tallest line." },
          { text: "1", feedback: "1 is the goals. Read the height." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Total goals",
        problem: "How many goals were scored altogether?",
        picture: goals,
        steps: [
          { line: "0 × 3 = 0, 1 × 5 = 5", why: "Value × frequency." },
          { line: "2 × 4 = 8, 3 × 2 = 6", why: "" },
          { line: "Total: 0 + 5 + 8 + 6 = 19 goals", why: "Add them." },
        ],
        done: "Each match with 2 goals adds 2, so multiply.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "2 goals or more",
        picture: goals,
        start: "In how many matches were 2 or more goals scored?",
        stages: [
          {
            prompt: "2 or more means",
            options: [
              { text: "2 goals and 3 goals", correct: true, feedback: "" },
              { text: "just 2 goals", feedback: "Or more: 3 counts too." },
            ],
            then: "Lines at 2 and 3",
          },
          {
            prompt: "So the matches are",
            options: [
              { text: "4 + 2 = 6", correct: true, feedback: "" },
              { text: "2 + 3 = 5", feedback: "Add the heights, not the goal values." },
            ],
            then: "6 matches",
          },
        ],
        done: "6 of the 14 matches.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "The mode, the most common number of goals, is",
        picture: goals,
        options: [
          { text: "1 goal", correct: true, feedback: "It happened most: 5 times." },
          { text: "5 goals", feedback: "5 is how often. The value is 1 goal." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "In how many matches did they score fewer than 2?",
        picture: goals,
        answers: ["8"],
        hint: "0 goals and 1 goal.",
        done: "3 + 5 = 8.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which data suits a vertical line chart?",
        options: [
          {
            text: "Number of pets each pupil has",
            correct: true,
            feedback: "Whole-number counts.",
          },
          {
            text: "Pupils' heights",
            feedback: "Heights can be any value: not just whole numbers.",
          },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Sam says the mode is 5, because the tallest line is 5 high. Is he right?",
        picture: goals,
        options: [
          {
            text: "No: the mode is the value, 1 goal",
            correct: true,
            feedback: "The height is the frequency. The mode is the value it belongs to.",
          },
          { text: "Yes", feedback: "5 is how many matches, not how many goals." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ivy finds the total goals.",
        picture: goals,
        lines: ["Add the heights: 3 + 5 + 4 + 2", "That's 14", "So 14 goals"],
        wrong: 2,
        why: "14 is the number of matches. Total goals: 0×3 + 1×5 + 2×4 + 3×2 = 19.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "How often did they score 2 or more?",
        picture: goals,
        answers: ["6"],
        unit: "matches",
        wrong: [{ answer: "4", feedback: "Count the matches with 3 goals too." }],
        hint: "Add the lines for 2 goals and for 3 goals.",
        done: "$4 + 2 = 6$ matches.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "How many matches had no goals?",
            picture: goals,
            options: ["3", "0", "5"],
            answers: ["3"],
            why: "The line at 0.",
            retry: {
              prompt: "How many matches had 3 goals?",
              picture: goals,
              options: ["2", "3", "6"],
              answers: ["2"],
              why: "The line at 3.",
            },
          },
          {
            prompt: "How many matches had 1 or 2 goals?",
            picture: goals,
            options: ["9", "3", "5"],
            answers: ["9"],
            why: "5 + 4.",
            retry: {
              prompt: "How many matches had 0 or 3 goals?",
              picture: goals,
              options: ["5", "3", "2"],
              answers: ["5"],
              why: "3 + 2.",
            },
          },
          {
            prompt: "Vertical line charts suit data that is",
            options: ["whole-number counts", "measured, like heights", "words, like colours"],
            answers: ["whole-number counts"],
            why: "Discrete numbers.",
            retry: {
              prompt: "The height of each line shows",
              options: ["how often", "the value", "the total"],
              answers: ["how often"],
              why: "The frequency.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-data",
    id: "y8-data/scatter",
    before: SCATTER,
    title: "Scatter graphs",
    summary: "Plot pairs of values as points to see if two things are linked.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Does revision help?",
        text: [
          "A teacher recorded how many hours five pupils revised, and their test scores. Does more revision go with higher scores?",
          "A list of numbers won't show it. By the end of this lesson, a graph will.",
        ],
        picture: {
          kind: "table",
          head: ["Hours", "1", "2", "4", "5", "7"],
          rows: [["Score", "3", "4", "5", "7", "8"]],
        },
      },
      {
        kind: "plot",
        tag: "Warm-up",
        title: "Plot (4, 5)",
        scene: { range: { xMin: 0, xMax: 8, yMin: 0, yMax: 10 } },
        targets: [{ x: 4, y: 5 }],
        hint: "Across 4, up 5.",
        done: "(4, 5).",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "In the table, the pupil who revised 5 hours scored",
        options: [
          { text: "7", correct: true, feedback: "Read down the column." },
          { text: "5", feedback: "5 is the hours." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Each pupil is a point",
        text: [
          "A **scatter graph** plots each pair of values as one point: hours across, score up.",
          "Then look at the pattern the points make. Don't join them up.",
        ],
        picture: rising,
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Plot one pupil",
        problem: "A pupil revised 2 hours and scored 4. Plot them.",
        steps: [
          { line: "Hours across: 2", why: "The first variable goes on the x-axis." },
          { line: "Score up: 4", why: "" },
          { line: "A point at (2, 4)", why: "One point per pupil." },
        ],
        done: "Each row of the table is one point.",
      },
      {
        kind: "plot",
        tag: "Together",
        title: "Plot a scatter graph",
        text: "Hours spent revising (across) and test score out of 10 (up), for five pupils.",
        scene: { range: { xMin: 0, xMax: 8, yMin: 0, yMax: 10 } },
        targets: [
          { x: 1, y: 3 },
          { x: 2, y: 4 },
          { x: 4, y: 5 },
          { x: 5, y: 7 },
          { x: 7, y: 8 },
        ],
        table: true,
        hint: "Across to the hours, up to the score.",
        done: "The points go up together.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "What do you notice?",
        picture: rising,
        options: [
          {
            text: "As hours go up, scores tend to go up",
            correct: true,
            feedback: "That's a pattern, or trend.",
          },
          { text: "There's no pattern", feedback: "Look left to right: the points climb." },
        ],
      },
      {
        kind: "plot",
        tag: "Your turn",
        title: "Plot: temperature (across) and hot drinks sold (up)",
        scene: { range: { xMin: 0, xMax: 8, yMin: 0, yMax: 10 } },
        targets: [
          { x: 1, y: 9 },
          { x: 3, y: 7 },
          { x: 4, y: 6 },
          { x: 6, y: 3 },
          { x: 7, y: 2 },
        ],
        table: true,
        hint: "Across to the temperature, up to the drinks.",
        done: "Warmer days, fewer hot drinks: the points go down.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "On a scatter graph, should you join the points?",
        options: [
          {
            text: "No: each is a separate person or thing",
            correct: true,
            feedback: "Look at the overall pattern instead.",
          },
          { text: "Yes, in order", feedback: "Joining them suggests a path from one to the next." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Ali plots (score, hours) instead of (hours, score). Problem?",
        options: [
          {
            text: "Yes: the axes are swapped, so check the labels",
            correct: true,
            feedback:
              "Keep each variable on its own axis, as labelled. (1, 3) and (3, 1) are different points.",
          },
          { text: "No", feedback: "Swapped points land in different places." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Mo plots a pupil who revised 7 hours and scored 8.",
        lines: ["Hours go across", "Score goes up", "The point is (8, 7)"],
        wrong: 2,
        why: "Across first: hours. The point is (7, 8).",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Does more revision go with higher scores?",
        picture: rising,
        options: [
          {
            text: "Yes: the points rise from left to right",
            correct: true,
            feedback: "The scatter graph shows the link.",
          },
          { text: "No", feedback: "The points climb." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A pupil revised 3 hours and scored 6. The point is",
            options: ["(3, 6)", "(6, 3)", "(3, 3)"],
            answers: ["(3, 6)"],
            why: "Hours across, score up.",
            retry: {
              prompt: "A pupil revised 6 hours and scored 9. The point is",
              options: ["(6, 9)", "(9, 6)", "(6, 6)"],
              answers: ["(6, 9)"],
              why: "Hours across, score up.",
            },
          },
          {
            prompt: "Each point on a scatter graph is",
            options: ["one pair of values", "a total", "an average"],
            answers: ["one pair of values"],
            why: "One person or thing.",
            retry: {
              prompt: "A scatter graph shows",
              options: ["whether two things are linked", "a single total", "shares of a whole"],
              answers: ["whether two things are linked"],
              why: "Two variables together.",
            },
          },
          {
            prompt: "On a scatter graph, the points are",
            options: ["not joined", "joined in order", "joined to the origin"],
            answers: ["not joined"],
            why: "Look at the pattern.",
            retry: {
              prompt: "After plotting a scatter graph, you look for",
              options: ["a pattern", "a curve through every point", "the biggest point"],
              answers: ["a pattern"],
              why: "The trend.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-data",
    id: "y8-data/correlation",
    before: CORRELATION,
    title: "Correlation",
    summary: "Positive, negative or none: and correlation isn't cause.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Ice creams and sunglasses",
        text: [
          "A shop finds that on days it sells more ice creams, it also sells more sunglasses. The manager says ice cream makes people buy sunglasses.",
          "Is that right? By the end of this lesson, you can describe the link, and say what it does and doesn't prove.",
        ],
        picture: rising,
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "These points go",
        picture: rising,
        options: [
          { text: "up from left to right", correct: true, feedback: "As x grows, y grows." },
          { text: "down from left to right", feedback: "Look again: they climb." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "These points go",
        picture: falling,
        options: [
          { text: "down from left to right", correct: true, feedback: "As x grows, y shrinks." },
          { text: "up from left to right", feedback: "They fall." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Three kinds",
        text: [
          "**Positive correlation**: both go up together. **Negative correlation**: one goes up as the other goes down.",
          "**No correlation**: no pattern. The closer the points to a straight line, the **stronger** the correlation.",
        ],
        picture: {
          kind: "table",
          head: ["Pattern", "Correlation"],
          rows: [
            ["Up together", "Positive"],
            ["One up, one down", "Negative"],
            ["Scattered", "None"],
          ],
        },
      },
      {
        kind: "sort",
        tag: "Discover",
        title: "Which correlation?",
        groups: ["Positive", "Negative", "None"],
        items: [
          {
            text: "Height and shoe size",
            group: 0,
            why: "Taller people tend to have bigger feet.",
          },
          { text: "Car age and value", group: 1, why: "Older cars are usually worth less." },
          { text: "Shoe size and test score", group: 2, why: "No link." },
          { text: "Temperature and hot drinks sold", group: 1, why: "Warmer: fewer hot drinks." },
        ],
        done: "Think: as one goes up, what does the other do?",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Describe it",
        problem: "Describe the relationship between a car's age (across) and its value (up).",
        picture: falling,
        steps: [
          { line: "The points go down from left to right", why: "Look at the trend." },
          { line: "Negative correlation", why: "One up, the other down." },
          { line: "Older cars tend to be worth less", why: "Say it in context." },
        ],
        done: "Name it, then say what it means.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Describe this correlation",
        picture: none,
        options: [
          {
            text: "No correlation",
            correct: true,
            feedback: "No pattern: the points are scattered.",
          },
          { text: "Positive", feedback: "They don't rise together." },
        ],
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Does one cause the other?",
        text: "Ice cream sales and sunglasses sales both rise in summer.",
        options: [
          {
            text: "No: hot weather makes both go up",
            correct: true,
            feedback:
              "Correlation shows two things change together. It doesn't prove one causes the other.",
          },
          {
            text: "Yes: sunglasses make people buy ice cream",
            feedback: "Something else, the weather, drives both.",
          },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Hours of TV and test scores: as one goes up, the other goes down. That's",
        options: [
          { text: "negative correlation", correct: true, feedback: "One up, one down." },
          { text: "positive correlation", feedback: "Positive is both up." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Describe this correlation",
        picture: rising,
        options: [
          { text: "Positive", correct: true, feedback: "Up together." },
          { text: "Negative", feedback: "The points rise." },
          { text: "None", feedback: "There's a clear upward trend." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Towns with more doctors have more illness. Do doctors cause illness?",
        options: [
          {
            text: "No: bigger towns have more of both",
            correct: true,
            feedback: "Correlation isn't causation. A third thing, population, explains it.",
          },
          { text: "Yes", feedback: "Think about what else is bigger in those towns." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Jo describes the car age and value graph.",
        picture: falling,
        lines: ["The points go down", "So there's no correlation", "Age doesn't matter"],
        wrong: 1,
        why: "Going down is a pattern: **negative** correlation.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Ice creams and sunglasses",
        picture: rising,
        options: [
          {
            text: "Positive correlation, but sunny weather causes both",
            correct: true,
            feedback: "They're linked, but neither causes the other.",
          },
          {
            text: "Ice cream causes sunglasses sales",
            feedback: "Correlation doesn't prove cause.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Describe the correlation.",
            picture: falling,
            options: ["Negative", "Positive", "None"],
            answers: ["Negative"],
            why: "One up, one down.",
            retry: {
              prompt: "What kind of correlation is this?",
              picture: rising,
              options: ["Positive", "Negative", "None"],
              answers: ["Positive"],
              why: "Up together.",
            },
          },
          {
            prompt: "Arm length and height have",
            options: ["positive correlation", "negative correlation", "no correlation"],
            answers: ["positive correlation"],
            why: "Taller, longer arms.",
            retry: {
              prompt: "Speed and journey time (same distance) have",
              options: ["negative correlation", "positive correlation", "no correlation"],
              answers: ["negative correlation"],
              why: "Faster, less time.",
            },
          },
          {
            prompt: "Correlation proves one thing causes another.",
            options: ["False", "True"],
            answers: ["False"],
            why: "They may share a cause.",
            retry: {
              prompt: "Two things are correlated. Does that prove one causes the other?",
              options: ["No", "Yes"],
              answers: ["No"],
              why: "Correlation isn't causation.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-data",
    id: "y8-data/missing-probability",
    before: MISSING,
    title: "The missing probability",
    summary: "All the probabilities add to 1: use that to find the one that's missing.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A biased spinner",
        text: [
          "A spinner lands on red, blue, green or yellow. Red is 0.1, blue is 0.3, and yellow is twice as likely as green.",
          "What's the probability of green? By the end of this lesson, you can find it.",
        ],
        picture: {
          kind: "table",
          head: ["Colour", "Red", "Blue", "Green", "Yellow"],
          rows: [["Probability", "0.1", "0.3", "$x$", "$2x$"]],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $1 - 0.4$",
        answers: ["0.6"],
        hint: "What adds to 0.4 to make 1?",
        done: "0.6.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Solve $3x = 0.6$",
        answers: ["0.2"],
        hint: "Divide by 3.",
        done: "$x = 0.2$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "They add to 1",
        text: [
          "Something must happen, so the probabilities of **all** the outcomes add up to **1**.",
          "If you know all but one, take the others away from 1.",
        ],
        picture: {
          kind: "maths",
          tex: "P(\\text{red}) + P(\\text{blue}) + P(\\text{green}) + P(\\text{yellow}) = 1",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "P(rain) = 0.7. P(not rain) is",
        options: [
          { text: "0.3", correct: true, feedback: "It rains or it doesn't: they add to 1." },
          { text: "0.7", feedback: "$1 - 0.7$." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "One missing",
        problem: "Red 0.2, blue 0.35, green ?. Find P(green).",
        steps: [
          { line: "$0.2 + 0.35 = 0.55$", why: "Add the ones you know." },
          { line: "$1 - 0.55 = 0.45$", why: "Take from 1." },
        ],
        done: "P(green) = 0.45.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "With algebra",
        start: "Red 0.1, blue 0.3, green $x$, yellow $2x$.",
        stages: [
          {
            prompt: "All four add to 1, so",
            options: [
              { text: "$0.4 + 3x = 1$", correct: true, feedback: "" },
              { text: "$0.4 + 2x = 1$", feedback: "$x + 2x = 3x$." },
            ],
            then: "$3x = 0.6$",
          },
          {
            prompt: "So $x$ is",
            options: [
              { text: "0.2", correct: true, feedback: "" },
              { text: "0.6", feedback: "That's $3x$. Divide by 3." },
            ],
            then: "Green 0.2, yellow 0.4",
          },
        ],
        done: "Check: $0.1 + 0.3 + 0.2 + 0.4 = 1$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Equally likely",
        start: "A, B and C are equally likely. P(D) = 0.4.",
        stages: [
          {
            prompt: "A, B and C share",
            options: [
              { text: "0.6", correct: true, feedback: "" },
              { text: "0.4", feedback: "1 − 0.4." },
            ],
            then: "0.6 between three",
          },
          {
            prompt: "So each is",
            options: [
              { text: "0.2", correct: true, feedback: "" },
              { text: "0.6", feedback: "Share it equally by 3." },
            ],
            then: "0.2 each",
          },
        ],
        done: "Equally likely: share equally.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Win 0.45, draw 0.2. P(lose)?",
        answers: ["0.35"],
        hint: "$1 - 0.45 - 0.2$.",
        done: "0.35.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "P(A) = 0.5, P(B) = $x$, P(C) = $x$. Find $x$",
        answers: ["0.25"],
        hint: "$0.5 + 2x = 1$.",
        done: "$2x = 0.5$, so $x = 0.25$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Red 0.5, blue 0.3, green 0.4. What's wrong?",
        options: [
          {
            text: "They add to 1.2: more than 1",
            correct: true,
            feedback: "All the outcomes must add to exactly 1. One of these is wrong.",
          },
          { text: "Nothing", feedback: "Add them up." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Green is $x$, yellow is $2x$, and red and blue add to 0.4.",
        lines: ["$0.4 + x + 2x = 1$", "$3x = 0.6$", "So $x = 0.6$"],
        wrong: 2,
        why: "$3x = 0.6$, so divide by 3: $x = 0.2$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Red 0.1, blue 0.3, green $x$, yellow $2x$",
        text: "What's P(green)?",
        options: [
          { text: "0.2", correct: true, feedback: "$3x = 0.6$, so $x = 0.2$; yellow is 0.4." },
          { text: "0.6", feedback: "0.6 is green and yellow together." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "P(A) = 0.25, P(B) = 0.4. Only A, B or C can happen. P(C)?",
            options: ["0.35", "0.65", "0.15"],
            answers: ["0.35"],
            why: "1 − 0.65.",
            retry: {
              prompt: "P(A) = 0.3, P(B) = 0.15. Only A, B or C can happen. P(C)?",
              options: ["0.55", "0.45", "0.65"],
              answers: ["0.55"],
              why: "1 − 0.45.",
            },
          },
          {
            prompt: "P(A) = 0.4, P(B) = $x$, P(C) = $2x$. Find $x$.",
            options: ["0.2", "0.6", "0.3"],
            answers: ["0.2"],
            why: "$3x = 0.6$.",
            retry: {
              prompt: "P(A) = 0.1, P(B) = $x$, P(C) = $2x$. Find $x$.",
              options: ["0.3", "0.9", "0.45"],
              answers: ["0.3"],
              why: "$3x = 0.9$.",
            },
          },
          {
            prompt: "P(late) = 0.15. P(not late)?",
            options: ["0.85", "0.15", "1.15"],
            answers: ["0.85"],
            why: "1 − 0.15.",
            retry: {
              prompt: "P(snow) = 0.08. P(no snow)?",
              options: ["0.92", "0.08", "0.2"],
              answers: ["0.92"],
              why: "1 − 0.08.",
            },
          },
        ],
      },
    ],
  },
];
