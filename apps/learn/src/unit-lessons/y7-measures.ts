// Year 7, "Units and measures": converting length, mass and capacity by powers of ten; why area
// and volume conversions multiply again and again; and time, which does not go in tens.
import type { UnitLesson } from "./types.ts";

export const y7Measures: UnitLesson = {
  unit: "y7-measures",
  title: "Changing units",
  summary: "Convert lengths, areas, volumes and times without getting caught out.",
  screens: [
    {
      kind: "fill",
      title: "How the metric units fit",
      template: "1 km = [] m, 1 m = [] cm, 1 cm = [] mm",
      bank: ["$10$", "$100$", "$1000$"],
      answers: ["$1000$", "$100$", "$10$"],
      hint: "Kilo means thousand, centi means hundredth, milli means thousandth.",
      done: "The same prefixes work for grams and litres: 1 kg = 1000 g, 1 litre = 1000 ml.",
    },
    {
      kind: "order",
      title: "Shortest to longest",
      text: "Change them to the same unit first.",
      items: ["350 mm", "40 cm", "0.5 m", "0.0006 km"],
      first: "shortest",
      last: "longest",
      hint: "Change each to centimetres: 350 mm = 35 cm, 0.5 m = 50 cm, 0.0006 km = 60 cm.",
      done: "35 cm, 40 cm, 50 cm, 60 cm. Compare in one unit.",
    },
    {
      kind: "answer",
      title: "Convert 3.2 kg to grams",
      answers: ["3200"],
      unit: "g",
      wrong: [{ answer: "320", feedback: "1 kg is 1000 g: multiply by 1000, not 100." }],
      hint: "Bigger unit to smaller unit: multiply. 1 kg = 1000 g.",
      done: "$3.2 \\times 1000 = 3200$ g.",
    },
    {
      kind: "answer",
      title: "Convert 450 ml to litres",
      answers: ["0.45"],
      unit: "litres",
      wrong: [{ answer: "4.5", feedback: "There are 1000 ml in a litre: divide by 1000." }],
      hint: "Smaller unit to bigger unit: divide. 1 litre = 1000 ml.",
      done: "$450 \\div 1000 = 0.45$ litres.",
    },
    {
      kind: "explain",
      title: "Area units are squared",
      text: [
        "A square 1 cm by 1 cm is 10 mm by 10 mm, so it holds $10 \\times 10 = 100$ little squares.",
        "So 1 cm² = 100 mm², not 10 mm².",
      ],
      picture: { kind: "grid", cols: 10, rows: 10, shaded: 100 },
    },
    {
      kind: "choice",
      title: "How many cm² in 1 m²?",
      options: [
        {
          text: "10 000",
          correct: true,
          feedback: "1 m² is 100 cm by 100 cm: $100 \\times 100 = 10\\,000$ cm².",
        },
        { text: "100", feedback: "That works for length. Area has two lengths: 100 × 100." },
        { text: "1000", feedback: "Square the 100 for area: 100 × 100." },
      ],
    },
    {
      kind: "explain",
      title: "Volume units are cubed",
      text: [
        "A 1 cm cube is 10 mm by 10 mm by 10 mm: $10 \\times 10 \\times 10 = 1000$ mm³.",
        "For volume, cube the length conversion.",
      ],
      picture: { kind: "cuboid", w: 3, d: 3, h: 3, labels: ["10 mm", "10 mm", "10 mm"] },
    },
    {
      kind: "answer",
      title: "How many cm³ in 1 m³?",
      answers: ["1000000"],
      unit: "cm³",
      wrong: [
        { answer: "100", feedback: "Volume has three lengths: 100 × 100 × 100." },
        { answer: "1000", feedback: "Cube the 100: 100 × 100 × 100." },
        { answer: "10000", feedback: "That is the area conversion. Volume needs one more × 100." },
      ],
      hint: "1 m³ is 100 cm by 100 cm by 100 cm.",
      done: "$100 \\times 100 \\times 100 = 1\\,000\\,000$ cm³: a million!",
    },
    {
      kind: "answer",
      title: "Fill the tank",
      text: "A tank holds 2 m³ of water. 1 m³ is 1000 litres. How many litres does it hold?",
      answers: ["2000"],
      unit: "litres",
      hint: "Multiply by 1000.",
      done: "$2 \\times 1000 = 2000$ litres.",
    },
    {
      kind: "answer",
      title: "How many minutes in 2.5 hours?",
      answers: ["150"],
      unit: "minutes",
      wrong: [
        { answer: "250", feedback: "An hour is 60 minutes, not 100: half an hour is 30 minutes." },
      ],
      hint: "Time does not go in tens: 1 hour = 60 minutes.",
      done: "$2.5 \\times 60 = 150$ minutes.",
    },
    {
      kind: "fill",
      title: "135 minutes in hours and minutes",
      template: "135 minutes = [] hours and [] minutes",
      bank: ["$1$", "$2$", "$13$", "$15$", "$35$"],
      answers: ["$2$", "$15$"],
      hint: "How many whole 60s fit into 135? What is left over?",
      done: "$2 \\times 60 = 120$, and 15 left: 2 hours 15 minutes.",
    },
    {
      kind: "choice",
      title: "Which is 3.75 hours?",
      options: [
        {
          text: "3 hours 45 minutes",
          correct: true,
          feedback: "0.75 of 60 minutes is 45 minutes.",
        },
        {
          text: "3 hours 75 minutes",
          feedback: "0.75 is three quarters of an hour, not 75 minutes.",
        },
        { text: "3 hours 7.5 minutes", feedback: "0.75 of an hour is $0.75 \\times 60$ minutes." },
      ],
    },
    {
      kind: "explain",
      title: "Changing units",
      text: [
        "Bigger unit to smaller: multiply. Smaller to bigger: divide.",
        "Area: square the length conversion. Volume: cube it.",
        "Time goes in 60s, so 0.5 hours is 30 minutes.",
      ],
      picture: {
        kind: "maths",
        tex: "1\\text{ m}^3 = 100^3\\text{ cm}^3 = 1\\,000\\,000\\text{ cm}^3",
      },
    },
  ],
};
