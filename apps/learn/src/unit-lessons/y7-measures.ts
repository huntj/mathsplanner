// Year 7, "Units and measures", as three short lessons, one just before each skill: converting
// length, mass and capacity by powers of ten; why area and volume conversions multiply again and
// again; and time, which doesn't go in tens. Each starts from something quick, builds the idea a
// step at a time, names the common mistakes, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const METRIC = "Y7-RAT-01.a";
const AREA = "Y7-RAT-01.b";
const TIME = "Y7-RAT-01.c";

export const y7Measures: UnitLesson[] = [
  {
    unit: "y7-measures",
    id: "y7-measures/metric",
    before: METRIC,
    title: "Metric units",
    summary:
      "Kilo, centi and milli: multiply going to a smaller unit, divide going to a bigger one.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Packing a bag",
        text: [
          "A hiker's bag can hold 5 kg. She packs a 1.8 kg tent, a 750 g sleeping bag, and 2 bottles each holding 1.5 litres of water (1 litre of water weighs 1 kg).",
          "Is she under the limit? By the end of this lesson, you can convert to check.",
        ],
        picture: {
          kind: "table",
          rows: [
            ["Tent", "1.8 kg"],
            ["Sleeping bag", "750 g"],
            ["Water", "2 × 1.5 litres"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3.2 \\times 1000$?",
        answers: ["3200"],
        hint: "Three columns left.",
        done: "3200.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $450 \\div 1000$?",
        answers: ["0.45"],
        hint: "Three columns right.",
        done: "0.45.",
      },
      {
        kind: "fill",
        tag: "Discover",
        title: "How the metric units fit",
        template: "1 km = [] m, 1 m = [] cm, 1 cm = [] mm",
        bank: ["$10$", "$100$", "$1000$"],
        answers: ["$1000$", "$100$", "$10$"],
        hint: "Kilo means thousand, centi means hundredth, milli means thousandth.",
        done: "The same prefixes work for grams and litres: 1 kg = 1000 g, 1 litre = 1000 ml.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Which way?",
        text: [
          "Going to a **smaller** unit, you need **more** of them: multiply. 2 m = 200 cm.",
          "Going to a **bigger** unit, you need fewer: divide. 300 cm = 3 m.",
        ],
        picture: {
          kind: "maths",
          tex: "\\text{km} \\xrightarrow{\\times 1000} \\text{m} \\xrightarrow{\\times 100} \\text{cm} \\xrightarrow{\\times 10} \\text{mm}",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Convert 3.2 kg to grams",
        problem: "Convert 3.2 kg to grams.",
        steps: [
          { line: "kg to g: bigger to smaller, so multiply", why: "More grams than kilograms." },
          { line: "1 kg = 1000 g", why: "Kilo means thousand." },
          { line: "$3.2 \\times 1000 = 3200$ g", why: "Three columns left." },
        ],
        done: "3200 g.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "450 ml to litres",
        start: "450 ml",
        stages: [
          {
            prompt: "ml to litres is",
            options: [
              { text: "smaller to bigger: divide", correct: true, feedback: "" },
              {
                text: "bigger to smaller: multiply",
                feedback: "A litre is bigger than a millilitre.",
              },
            ],
            then: "Divide by 1000",
          },
          {
            prompt: "$450 \\div 1000 =$",
            options: [
              { text: "0.45 litres", correct: true, feedback: "" },
              { text: "4.5 litres", feedback: "That's ÷ 100." },
            ],
            then: "0.45 litres",
          },
        ],
        done: "Check it's sensible: 450 ml is less than half a litre ✓",
      },
      {
        kind: "order",
        tag: "Together",
        title: "Shortest to longest",
        text: "Change them to the same unit first.",
        items: ["350 mm", "40 cm", "0.5 m", "0.0006 km"],
        first: "shortest",
        last: "longest",
        hint: "In cm: 35, 40, 50, 60.",
        done: "35 cm, 40 cm, 50 cm, 60 cm. Compare in one unit.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Convert 2.5 km to metres",
        answers: ["2500"],
        unit: "m",
        wrong: [{ answer: "250", feedback: "1 km = 1000 m." }],
        hint: "× 1000.",
        done: "2500 m.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Convert 85 mm to cm",
        answers: ["8.5"],
        unit: "cm",
        wrong: [{ answer: "850", feedback: "mm to cm: smaller to bigger, divide by 10." }],
        hint: "÷ 10.",
        done: "8.5 cm.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Ella converts 6 m to cm by dividing: 0.06 cm. Is that right?",
        options: [
          {
            text: "No: cm are smaller, so there are more of them: 600 cm",
            correct: true,
            feedback:
              "Ask: should the number get bigger or smaller? 6 m is a long way, not 0.06 cm.",
          },
          { text: "Yes", feedback: "0.06 cm is less than a millimetre!" },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Kai converts 4.2 kg to grams.",
        lines: ["kg to g: multiply", "1 kg = 100 g", "So 420 g"],
        wrong: 1,
        why: "Kilo means thousand: 1 kg = 1000 g. So 4200 g.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Packing a bag",
        start: "Tent 1.8 kg, sleeping bag 750 g, water 2 × 1.5 kg. Limit 5 kg.",
        stages: [
          {
            prompt: "The sleeping bag in kg:",
            options: [
              { text: "0.75 kg", correct: true, feedback: "" },
              { text: "7.5 kg", feedback: "÷ 1000." },
            ],
            then: "0.75 kg",
          },
          {
            prompt: "Total: $1.8 + 0.75 + 3 =$",
            options: [
              { text: "5.55 kg: over the limit", correct: true, feedback: "" },
              { text: "4.55 kg: under", feedback: "Two bottles of 1.5 kg is 3 kg." },
            ],
            then: "5.55 kg",
          },
        ],
        done: "Over by 0.55 kg: leave one bottle half full.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Convert 3 m to cm.",
            answers: ["300"],
            why: "× 100.",
            retry: { prompt: "Convert 7 m to cm.", answers: ["700"], why: "× 100." },
          },
          {
            prompt: "Convert 2500 g to kg.",
            answers: ["2.5"],
            why: "÷ 1000.",
            retry: { prompt: "Convert 1750 ml to litres.", answers: ["1.75"], why: "÷ 1000." },
          },
          {
            prompt: "Convert 0.4 km to m.",
            answers: ["400"],
            why: "× 1000.",
            retry: { prompt: "Convert 65 mm to cm.", answers: ["6.5"], why: "÷ 10." },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-measures",
    id: "y7-measures/area-volume",
    before: AREA,
    title: "Area and volume units",
    summary: "1 cm² is 100 mm², not 10: area units square the conversion, volume units cube it.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Carpet tiles",
        text: [
          "A room is 3 m² in area. Carpet tiles are sold by the square centimetre. Sam says 3 m² = 300 cm².",
          "Is he right? By the end of this lesson, you'll know why not.",
        ],
        picture: { kind: "grid", cols: 10, rows: 10, shaded: 100 },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many cm in 1 m?",
        answers: ["100"],
        hint: "Centi means hundredth.",
        done: "100.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $10 \\times 10$?",
        answers: ["100"],
        hint: "Ten tens.",
        done: "100.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Area units are squared",
        text: [
          "A square 1 cm by 1 cm is 10 mm by 10 mm, so it holds $10 \\times 10 = 100$ little squares.",
          "So 1 cm² = 100 mm², not 10 mm².",
        ],
        picture: { kind: "grid", cols: 10, rows: 10, shaded: 100 },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "How many cm² in 1 m²?",
        options: [
          {
            text: "10 000",
            correct: true,
            feedback: "1 m² is 100 cm by 100 cm: $100 \\times 100$.",
          },
          { text: "100", feedback: "That's for length. A square metre is 100 by 100 squares." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Volume units are cubed",
        text: [
          "A cube 1 cm on each side is 10 mm by 10 mm by 10 mm: $10 \\times 10 \\times 10 = 1000$ mm³.",
          "And 1 m³ = $100 \\times 100 \\times 100 = 1\\,000\\,000$ cm³.",
        ],
        picture: { kind: "cuboid", w: 10, d: 10, h: 10, cubes: true },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "3 m² in cm²",
        problem: "Convert 3 m² to cm².",
        steps: [
          { line: "1 m² = $100 \\times 100 = 10\\,000$ cm²", why: "Square the length conversion." },
          { line: "$3 \\times 10\\,000 = 30\\,000$ cm²", why: "Three of them." },
        ],
        done: "30 000 cm².",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "500 mm² in cm²",
        start: "500 mm²",
        stages: [
          {
            prompt: "1 cm² is",
            options: [
              { text: "100 mm²", correct: true, feedback: "" },
              { text: "10 mm²", feedback: "Square it: $10 \\times 10$." },
            ],
            then: "Divide by 100",
          },
          {
            prompt: "So 500 mm² =",
            options: [
              { text: "5 cm²", correct: true, feedback: "" },
              { text: "50 cm²", feedback: "÷ 100, not 10." },
            ],
            then: "5 cm²",
          },
        ],
        done: "5 cm².",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "2 cm³ in mm³",
        start: "2 cm³",
        stages: [
          {
            prompt: "1 cm³ is",
            options: [
              { text: "1000 mm³", correct: true, feedback: "" },
              { text: "10 mm³", feedback: "Cube it: $10 \\times 10 \\times 10$." },
            ],
            then: "× 1000",
          },
          {
            prompt: "So 2 cm³ =",
            options: [
              { text: "2000 mm³", correct: true, feedback: "" },
              { text: "20 mm³", feedback: "× 1000." },
            ],
            then: "2000 mm³",
          },
        ],
        done: "Cubes multiply three times.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Convert 4 cm² to mm²",
        answers: ["400"],
        unit: "mm²",
        wrong: [{ answer: "40", feedback: "1 cm² = 100 mm²." }],
        hint: "× 100.",
        done: "400 mm².",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Convert 20 000 cm² to m²",
        answers: ["2"],
        unit: "m²",
        hint: "÷ 10 000.",
        done: "2 m².",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Raj says 1 m² = 100 cm², because 1 m = 100 cm. Is he right?",
        options: [
          {
            text: "No: it's 100 by 100, so 10 000 cm²",
            correct: true,
            feedback: "Using the length conversion for area is the classic mistake. Square it!",
          },
          { text: "Yes", feedback: "Picture a 1 m square: 100 rows of 100 little squares." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ivy converts 5 cm³ to mm³.",
        lines: ["1 cm = 10 mm", "So 1 cm³ = $10^2 = 100$ mm³", "5 cm³ = 500 mm³"],
        wrong: 1,
        why: "Volume is cubed: $10^3 = 1000$, so 5 cm³ = 5000 mm³.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Carpet tiles",
        text: "Convert 3 m² to cm².",
        answers: ["30000", "30,000"],
        unit: "cm²",
        wrong: [{ answer: "300", feedback: "That's like Sam: use 100 × 100." }],
        hint: "× 10 000.",
        done: "30 000 cm². Sam was out by 100 times.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "How many mm² in 1 cm²?",
            options: ["100", "10", "1000"],
            answers: ["100"],
            why: "$10 \\times 10$.",
            retry: {
              prompt: "How many cm² in 1 m²?",
              options: ["10 000", "100", "1000"],
              answers: ["10 000"],
              why: "$100 \\times 100$.",
            },
          },
          {
            prompt: "Convert 6 cm² to mm².",
            answers: ["600"],
            why: "× 100.",
            retry: { prompt: "Convert 3 cm² to mm².", answers: ["300"], why: "× 100." },
          },
          {
            prompt: "How many mm³ in 1 cm³?",
            options: ["1000", "100", "10"],
            answers: ["1000"],
            why: "$10 \\times 10 \\times 10$.",
            retry: {
              prompt: "How many cm³ in 1 m³?",
              options: ["1 000 000", "1000", "100"],
              answers: ["1 000 000"],
              why: "$100^3$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-measures",
    id: "y7-measures/time",
    before: TIME,
    title: "Time",
    summary: "Time doesn't go in tens: 60 minutes in an hour, so convert with care.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Film time",
        text: [
          "A film lasts 2.5 hours. It starts at 7:45 pm. Ali says it ends at 10:35 pm, thinking 2.5 hours is 2 hours 50 minutes.",
          "When does it really end? By the end of this lesson, you'll know.",
        ],
        picture: { kind: "maths", tex: "7{:}45 \\text{ pm} + 2.5 \\text{ hours}" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many minutes in an hour?",
        answers: ["60"],
        hint: "A clock face.",
        done: "60.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is half of 60?",
        answers: ["30"],
        hint: "60 ÷ 2.",
        done: "30.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Not in tens",
        text: [
          "1 hour = 60 minutes and 1 minute = 60 seconds. So 0.5 hours is half of 60: **30** minutes, not 50.",
          "To change hours to minutes, multiply by 60.",
        ],
        picture: {
          kind: "spinner",
          sectors: [
            { label: "30 min", size: 1 },
            { label: "30 min", size: 1 },
          ],
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "1.25 hours is",
        options: [
          { text: "1 hour 15 minutes", correct: true, feedback: "0.25 of 60 is 15." },
          { text: "1 hour 25 minutes", feedback: "0.25 hours is a quarter of an hour." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "3.4 hours in minutes",
        problem: "Write 3.4 hours in hours and minutes.",
        steps: [
          { line: "3 whole hours", why: "The part before the point." },
          { line: "$0.4 \\times 60 = 24$ minutes", why: "The decimal part, times 60." },
          { line: "3 hours 24 minutes", why: "Put them together." },
        ],
        done: "Not 3 hours 40 minutes!",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "150 minutes in hours",
        start: "150 minutes",
        stages: [
          {
            prompt: "How many whole hours?",
            options: [
              { text: "2, with 30 minutes left", correct: true, feedback: "" },
              { text: "1.5", feedback: "Divide by 60, not 100." },
            ],
            then: "2 h 30 min",
          },
          {
            prompt: "As a decimal:",
            options: [
              { text: "2.5 hours", correct: true, feedback: "" },
              { text: "2.3 hours", feedback: "30 minutes is half an hour: 0.5." },
            ],
            then: "2.5 hours",
          },
        ],
        done: "150 min = 2 h 30 min = 2.5 h.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Adding times",
        start: "9:50 am plus 1 hour 25 minutes.",
        stages: [
          {
            prompt: "Add the hour:",
            options: [
              { text: "10:50 am", correct: true, feedback: "" },
              { text: "9:51 am", feedback: "An hour, not a minute." },
            ],
            then: "10:50 am",
          },
          {
            prompt: "Add 25 minutes:",
            options: [
              { text: "11:15 am", correct: true, feedback: "" },
              {
                text: "10:75 am",
                feedback: "There's no 75 minutes: 60 minutes make the next hour.",
              },
            ],
            then: "11:15 am",
          },
        ],
        done: "Cross the hour at 60, not 100.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "How many minutes in 1.75 hours?",
        answers: ["105"],
        wrong: [{ answer: "175", feedback: "× 60, not × 100." }],
        hint: "$1.75 \\times 60$.",
        done: "105 minutes.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "How many seconds in 4 minutes?",
        answers: ["240"],
        hint: "$4 \\times 60$.",
        done: "240 seconds.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Bea writes 2 hours 30 minutes as 2.3 hours. Is she right?",
        options: [
          {
            text: "No: 30 minutes is half an hour, so 2.5 hours",
            correct: true,
            feedback: "Minutes aren't decimals of an hour. Divide minutes by 60.",
          },
          { text: "Yes", feedback: "0.3 hours is 18 minutes." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo works out how long from 10:40 to 12:15.",
        lines: [
          "10:40 to 11:40 is 1 hour",
          "11:40 to 12:15: 15 − 40 = −25",
          "So 1 hour − 25 minutes = 35 minutes",
        ],
        wrong: 1,
        why: "Count on: 11:40 to 12:00 is 20 minutes, then 15 more: 35 minutes. So 1 hour 35 minutes.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Film time",
        start: "7:45 pm plus 2.5 hours.",
        stages: [
          {
            prompt: "2.5 hours is",
            options: [
              { text: "2 hours 30 minutes", correct: true, feedback: "" },
              { text: "2 hours 50 minutes", feedback: "0.5 hours is half of 60 minutes." },
            ],
            then: "2 h 30 min",
          },
          {
            prompt: "The film ends at",
            options: [
              { text: "10:15 pm", correct: true, feedback: "" },
              { text: "10:35 pm", feedback: "That's Ali's mistake." },
            ],
            then: "10:15 pm",
          },
        ],
        done: "7:45 + 2 h = 9:45; + 30 min = 10:15 pm.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "How many minutes in 2.5 hours?",
            answers: ["150"],
            why: "$2.5 \\times 60$.",
            retry: {
              prompt: "How many minutes in 1.5 hours?",
              answers: ["90"],
              why: "$1.5 \\times 60$.",
            },
          },
          {
            prompt: "0.75 hours is how many minutes?",
            answers: ["45"],
            why: "$0.75 \\times 60$.",
            retry: {
              prompt: "0.2 hours is how many minutes?",
              answers: ["12"],
              why: "$0.2 \\times 60$.",
            },
          },
          {
            prompt: "3 hours 15 minutes as a decimal of hours:",
            options: ["3.25", "3.15", "3.5"],
            answers: ["3.25"],
            why: "15 minutes is a quarter of an hour.",
            retry: {
              prompt: "1 hour 45 minutes as a decimal of hours:",
              options: ["1.75", "1.45", "1.5"],
              answers: ["1.75"],
              why: "45 minutes is three quarters.",
            },
          },
        ],
      },
    ],
  },
];
