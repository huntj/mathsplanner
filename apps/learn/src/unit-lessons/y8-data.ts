// Year 8, "Data and probability": bar charts from frequency tables, pie charts in degrees,
// pictograms, vertical line charts, plotting a scatter graph and reading its correlation, and
// missing probabilities that make the total 1.
import type { UnitLesson } from "./types.ts";

export const y8Data: UnitLesson = {
  unit: "y8-data",
  title: "Show the data",
  summary: "Read and draw charts, plot a scatter graph, and find a missing probability.",
  screens: [
    {
      kind: "explain",
      title: "Counts as bars",
      text: [
        "A **frequency table** counts how many of each. A **bar chart** draws each count as a bar.",
        "22 pupils chose their favourite fruit.",
      ],
      picture: {
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
      },
    },
    {
      kind: "answer",
      title: "How many more chose apple than grape?",
      picture: {
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
      },
      answers: ["5"],
      wrong: [{ answer: "8", feedback: "8 chose apple. Take away the 3 who chose grape." }],
      hint: "Read both bars, then take one from the other.",
      done: "$8 - 3 = 5$ more.",
    },
    {
      kind: "explain",
      title: "A pie chart shares out 360°",
      text: [
        "In a pie chart, the whole circle, 360°, is everybody. 24 pupils said how they get to school.",
        "So each pupil gets $360 \\div 24 = 15°$ of the circle.",
      ],
      picture: {
        kind: "spinner",
        pie: true,
        sectors: [
          { label: "Walk", size: 12 },
          { label: "Bus", size: 6 },
          { label: "Car", size: 4 },
          { label: "Bike", size: 2 },
        ],
      },
    },
    {
      kind: "answer",
      title: "The bus slice",
      text: "6 of the 24 pupils come by bus. How many degrees is their slice?",
      answers: ["90"],
      unit: "°",
      wrong: [{ answer: "6", feedback: "Each pupil is 15° of the circle." }],
      hint: "15° for each pupil.",
      done: "$6 \\times 15 = 90°$: a quarter of the circle, as 6 is a quarter of 24.",
    },
    {
      kind: "fill",
      title: "The other slices",
      template: "Walk: $12 \\times 15° =$ [] and car: $4 \\times 15° =$ []",
      bank: ["$180°$", "$120°$", "$60°$", "$40°$"],
      answers: ["$180°$", "$60°$"],
      hint: "Multiply each count by 15°.",
      done: "The slices, 180° + 90° + 60° + 30°, add to 360°.",
    },
    {
      kind: "choice",
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
      kind: "explain",
      title: "A vertical line chart",
      text: [
        "For counts that can only be whole numbers, like goals in a match, a vertical line chart uses thin lines instead of bars.",
      ],
      picture: {
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
      },
    },
    {
      kind: "answer",
      title: "Two goals or more",
      text: "In how many matches were 2 or more goals scored?",
      picture: {
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
      },
      answers: ["6"],
      wrong: [{ answer: "4", feedback: "Count the matches with 3 goals too." }],
      hint: "Add the lines for 2 goals and for 3 goals.",
      done: "$4 + 2 = 6$ matches.",
    },
    {
      kind: "plot",
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
      done: "The points go up together: more revision, higher scores. That is **positive correlation**.",
    },
    {
      kind: "choice",
      title: "Describe the relationship",
      text: "The age of a car (across) and its value (up).",
      picture: {
        kind: "graph",
        range: { xMin: 0, xMax: 8, yMin: 0, yMax: 10 },
        points: [
          { x: 1, y: 9 },
          { x: 2, y: 8 },
          { x: 3, y: 8 },
          { x: 4, y: 6 },
          { x: 5, y: 5 },
          { x: 6, y: 4 },
          { x: 7, y: 2 },
        ],
      },
      options: [
        {
          text: "Negative correlation",
          correct: true,
          feedback: "As one goes up, the other goes down: older cars are worth less.",
        },
        {
          text: "Positive correlation",
          feedback: "Positive means both go up together. Here one goes down.",
        },
        { text: "No correlation", feedback: "The points follow a clear downward trend." },
      ],
    },
    {
      kind: "choice",
      title: "Does one cause the other?",
      text: "Ice cream sales and sunglasses sales both rise in summer: they are positively correlated.",
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
      kind: "answer",
      title: "A missing probability",
      text: "A spinner lands on red, blue, green or yellow. Green is x and yellow is twice as likely as green. Find x.",
      picture: {
        kind: "table",
        head: ["Colour", "Red", "Blue", "Green", "Yellow"],
        rows: [["Probability", "0.1", "0.3", "$x$", "$2x$"]],
      },
      answers: ["0.2"],
      wrong: [{ answer: "0.6", feedback: "0.6 is $x + 2x$, which is $3x$. Share it by 3." }],
      hint: "All four add up to 1: $0.1 + 0.3 + x + 2x = 1$.",
      done: "$3x = 0.6$, so $x = 0.2$, and yellow is 0.4.",
    },
    {
      kind: "explain",
      title: "Show the data",
      text: [
        "Bar charts and line charts show counts; a pie chart shares 360° between them.",
        "A scatter graph shows whether two things are correlated, but not whether one causes the other.",
        "Probabilities of all the outcomes add to 1.",
      ],
      picture: {
        kind: "spinner",
        pie: true,
        sectors: [
          { label: "Walk", size: 12 },
          { label: "Bus", size: 6 },
          { label: "Car", size: 4 },
          { label: "Bike", size: 2 },
        ],
      },
    },
  ],
};
