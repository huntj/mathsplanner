// Year 8, "Rates": a rate compares two different units. Speed, unit prices for finding the best
// buy, and density, each a "per".
import type { UnitLesson } from "./types.ts";

export const y8Rates: UnitLesson = {
  unit: "y8-rates",
  title: "Per",
  summary: "Speed, best buys and density: three rates, one idea.",
  screens: [
    {
      kind: "explain",
      title: "A rate is a 'per'",
      text: [
        "A rate compares two different units: kilometres **per** hour, pence **per** gram, grams **per** cm³.",
        "Speed is distance per unit of time.",
      ],
      picture: { kind: "maths", tex: "\\text{speed} = \\frac{\\text{distance}}{\\text{time}}" },
    },
    {
      kind: "answer",
      title: "A train journey",
      text: "A train travels 240 km in 3 hours. What is its average speed?",
      answers: ["80"],
      unit: "km/h",
      wrong: [{ answer: "720", feedback: "That multiplies. Speed is distance ÷ time." }],
      hint: "Distance ÷ time.",
      done: "$240 \\div 3 = 80$ km/h.",
    },
    {
      kind: "answer",
      title: "How long?",
      text: "At 60 km/h, how many hours does it take to go 150 km?",
      answers: ["2.5"],
      unit: "hours",
      wrong: [{ answer: "9000", feedback: "That multiplies. Time = distance ÷ speed." }],
      hint: "How many lots of 60 km make 150 km?",
      done: "$150 \\div 60 = 2.5$ hours: 2 hours 30 minutes.",
    },
    {
      kind: "answer",
      title: "Minutes to hours",
      text: "A car travels 30 km in 20 minutes. What is its speed in km/h?",
      answers: ["90"],
      unit: "km/h",
      wrong: [
        { answer: "1.5", feedback: "That is kilometres per minute. An hour is 60 minutes." },
        { answer: "600", feedback: "Divide the distance by the time." },
      ],
      hint: "20 minutes is a third of an hour. How far in a whole hour?",
      done: "30 km in 20 minutes is 90 km in 60 minutes: 90 km/h.",
    },
    {
      kind: "answer",
      title: "One roll",
      text: "6 bread rolls cost £1.80. How much is one roll, in pence?",
      answers: ["30"],
      unit: "p",
      wrong: [{ answer: "1080", feedback: "That multiplies. Divide the price by 6." }],
      hint: "180p ÷ 6.",
      done: "$180 \\div 6 = 30$p a roll.",
    },
    {
      kind: "steps",
      title: "Which is the better buy?",
      start: "500 g for £2.40, or 750 g for £3.45?",
      stages: [
        {
          prompt: "The price per gram of the 500 g pack is",
          options: [
            { text: "0.48p", correct: true, feedback: "" },
            { text: "4.8p", feedback: "240p ÷ 500 is less than 1p." },
            {
              text: "208p",
              feedback: "That divides the grams by the price. Divide the price by the grams.",
            },
          ],
          then: "$240 \\div 500 = 0.48$p a gram",
        },
        {
          prompt: "And of the 750 g pack:",
          options: [
            { text: "0.46p", correct: true, feedback: "" },
            { text: "0.5p", feedback: "345p ÷ 750." },
          ],
          then: "$345 \\div 750 = 0.46$p a gram",
        },
        {
          prompt: "So the better buy is",
          options: [
            { text: "750 g for £3.45", correct: true, feedback: "" },
            { text: "500 g for £2.40", feedback: "It costs less, but more per gram." },
          ],
          then: "The 750 g pack is cheaper per gram.",
        },
      ],
      done: "Compare the price per gram, not the price.",
    },
    {
      kind: "explain",
      title: "Density",
      text: [
        "**Density** is mass per unit of volume. Water is 1 g/cm³; gold is about 19 g/cm³, so a gold cube is 19 times as heavy as the same cube of water.",
      ],
      picture: { kind: "maths", tex: "\\text{density} = \\frac{\\text{mass}}{\\text{volume}}" },
    },
    {
      kind: "answer",
      title: "Find the density",
      text: "A block has a mass of 600 g and a volume of 75 cm³. What is its density?",
      answers: ["8"],
      unit: "g/cm³",
      wrong: [{ answer: "45000", feedback: "That multiplies. Density = mass ÷ volume." }],
      hint: "Mass ÷ volume.",
      done: "$600 \\div 75 = 8$ g/cm³.",
    },
    {
      kind: "answer",
      title: "Find the mass",
      text: "Aluminium has a density of 2.7 g/cm³. What is the mass of 20 cm³ of it?",
      picture: { kind: "cuboid", w: 5, d: 2, h: 2, cubes: true },
      answers: ["54"],
      unit: "g",
      wrong: [{ answer: "7.4", feedback: "Every cm³ has a mass of 2.7 g, so multiply." }],
      hint: "Each of the 20 cubes has a mass of 2.7 g.",
      done: "$2.7 \\times 20 = 54$ g.",
    },
    {
      kind: "sort",
      title: "Which rate?",
      groups: ["Speed", "Density", "Price"],
      items: [
        { text: "km/h", group: 0, why: "Kilometres per hour: distance per time." },
        { text: "m/s", group: 0, why: "Metres per second: distance per time." },
        { text: "g/cm³", group: 1, why: "Grams per cubic centimetre: mass per volume." },
        { text: "kg/m³", group: 1, why: "Kilograms per cubic metre: mass per volume." },
        { text: "p per gram", group: 2, why: "Pence per gram: money per amount." },
        { text: "£ per litre", group: 2, why: "Pounds per litre: money per amount." },
      ],
      done: "The units say what is divided by what.",
    },
    {
      kind: "explain",
      title: "Per",
      text: [
        "Speed = distance ÷ time. Unit price = cost ÷ amount. Density = mass ÷ volume.",
        "Rearrange them like any formula: distance = speed × time, mass = density × volume.",
        "Watch the units: minutes are not decimal hours.",
      ],
      picture: { kind: "maths", tex: "\\text{mass} = \\text{density} \\times \\text{volume}" },
    },
  ],
};
