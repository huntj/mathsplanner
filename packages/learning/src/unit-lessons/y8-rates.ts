// Year 8, "Rates", as three short lessons, one just before each skill: speed, unit prices for
// finding the best buy, and density, each a "per": one quantity divided by another. Each starts
// from something quick, builds the idea a step at a time, names the common mistakes, and ends on
// an exit check.
import type { UnitLesson } from "./types.ts";

const SPEED = "Y8-RAT-05.a";
const PRICE = "Y8-RAT-05.b";
const DENSITY = "Y8-RAT-05.c";

export const y8Rates: UnitLesson[] = [
  {
    unit: "y8-rates",
    id: "y8-rates/speed",
    before: SPEED,
    title: "Speed",
    summary: "Speed is distance per unit of time: distance ÷ time.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Train or car?",
        text: [
          "A train goes 240 km in 3 hours. A car goes 30 km in 20 minutes. Which is faster?",
          "Different distances and different times. By the end of this lesson, you can compare them fairly.",
        ],
        picture: {
          kind: "table",
          head: ["", "Distance", "Time"],
          rows: [
            ["Train", "240 km", "3 hours"],
            ["Car", "30 km", "20 minutes"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $240 \\div 3$",
        answers: ["80"],
        hint: "$24 \\div 3 = 8$.",
        done: "80.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many minutes are in half an hour?",
        answers: ["30"],
        hint: "An hour is 60 minutes.",
        done: "30 minutes.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A rate is a 'per'",
        text: [
          "Speed is how far you go **per** hour (or per second): distance divided by time.",
          "80 km/h means 80 km in each hour. Now any two journeys compare fairly.",
        ],
        picture: { kind: "maths", tex: "\\text{speed} = \\frac{\\text{distance}}{\\text{time}}" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "You travel at 50 km/h for 2 hours. How far?",
        options: [
          {
            text: "100 km",
            correct: true,
            feedback: "50 km each hour, for 2 hours: distance = speed × time.",
          },
          { text: "25 km", feedback: "That divides. Each hour adds 50 km." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "The train",
        problem: "A train travels 240 km in 3 hours. What is its average speed?",
        steps: [
          { line: "speed = distance ÷ time", why: "A per: km per hour." },
          { line: "$240 \\div 3 = 80$", why: "" },
          { line: "80 km/h", why: "Units: km per hour." },
        ],
        done: "Distance ÷ time, with the units.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Minutes to hours",
        start: "A car travels 30 km in 20 minutes. What is its speed in km/h?",
        stages: [
          {
            prompt: "20 minutes is what fraction of an hour?",
            options: [
              { text: "a third", correct: true, feedback: "" },
              { text: "0.2", feedback: "20 out of 60 minutes: $\\frac13$." },
            ],
            then: "$\\frac13$ of an hour",
          },
          {
            prompt: "So in a whole hour, it goes",
            options: [
              { text: "90 km", correct: true, feedback: "" },
              { text: "10 km", feedback: "A whole hour is 3 lots of 20 minutes." },
            ],
            then: "90 km/h",
          },
        ],
        done: "Minutes aren't decimals of an hour: change them carefully.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "How long?",
        start: "At 60 km/h, how long does it take to go 150 km?",
        stages: [
          {
            prompt: "time = ",
            options: [
              { text: "distance ÷ speed", correct: true, feedback: "" },
              { text: "distance × speed", feedback: "How many lots of 60 km make 150 km?" },
            ],
            then: "$150 \\div 60$",
          },
          {
            prompt: "$150 \\div 60 = 2.5$ hours, which is",
            options: [
              { text: "2 hours 30 minutes", correct: true, feedback: "" },
              { text: "2 hours 50 minutes", feedback: "0.5 of an hour is 30 minutes." },
            ],
            then: "2 h 30 min",
          },
        ],
        done: "Turn decimal hours into minutes: × 60.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A cyclist rides 45 km in 3 hours",
        text: "What is her average speed?",
        answers: ["15"],
        unit: "km/h",
        wrong: [{ answer: "135", feedback: "That multiplies. Speed is distance ÷ time." }],
        hint: "$45 \\div 3$.",
        done: "15 km/h.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A runner goes 4 km in 15 minutes",
        text: "What is the speed in km/h?",
        answers: ["16"],
        unit: "km/h",
        wrong: [
          { answer: "0.27", feedback: "That's km per minute. An hour is 4 lots of 15 minutes." },
        ],
        hint: "15 minutes is a quarter of an hour.",
        done: "$4 \\times 4 = 16$ km/h.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "A trip takes 1 hour 30 minutes. Ken divides by 1.3. What's wrong?",
        options: [
          {
            text: "30 minutes is 0.5 hours: use 1.5",
            correct: true,
            feedback: "Minutes go up to 60, not 100. 1 h 30 min = 1.5 h.",
          },
          { text: "Nothing", feedback: "1.3 hours is 1 hour 18 minutes." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Lily finds the speed for 120 km in 2 hours.",
        lines: ["speed = time ÷ distance", "$2 \\div 120 = 0.017$", "0.017 km/h"],
        wrong: 0,
        why: "Speed is distance ÷ time: $120 \\div 2 = 60$ km/h. km/h says km on top.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Train: 240 km in 3 h. Car: 30 km in 20 min.",
        text: "Which is faster?",
        options: [
          {
            text: "The car: 90 km/h beats 80 km/h",
            correct: true,
            feedback: "Speeds in the same units compare fairly.",
          },
          {
            text: "The train: it goes further",
            feedback: "It takes much longer too. Compare per hour.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "200 km in 4 hours. Speed?",
            options: ["50 km/h", "800 km/h", "20 km/h"],
            answers: ["50 km/h"],
            why: "$200 \\div 4$.",
            retry: {
              prompt: "180 km in 3 hours. Speed?",
              options: ["60 km/h", "540 km/h", "30 km/h"],
              answers: ["60 km/h"],
              why: "$180 \\div 3$.",
            },
          },
          {
            prompt: "At 40 km/h for 3 hours, how far?",
            options: ["120 km", "13.3 km", "43 km"],
            answers: ["120 km"],
            why: "Speed × time.",
            retry: {
              prompt: "At 70 km/h for 2 hours, how far?",
              options: ["140 km", "35 km", "72 km"],
              answers: ["140 km"],
              why: "Speed × time.",
            },
          },
          {
            prompt: "10 km in 30 minutes. Speed in km/h?",
            options: ["20 km/h", "0.3 km/h", "300 km/h"],
            answers: ["20 km/h"],
            why: "30 minutes is half an hour.",
            retry: {
              prompt: "5 km in 20 minutes. Speed in km/h?",
              options: ["15 km/h", "0.25 km/h", "100 km/h"],
              answers: ["15 km/h"],
              why: "20 minutes is a third of an hour.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-rates",
    id: "y8-rates/best-buy",
    before: PRICE,
    title: "Best buy",
    summary: "Compare the price of one gram, or one item: the unit price.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Cereal boxes",
        text: [
          "A 500 g box of cereal costs £2.40. A 750 g box costs £3.45. The small box is cheaper, but is it better value?",
          "By the end of this lesson, you can find the best buy every time.",
        ],
        picture: {
          kind: "table",
          head: ["Box", "Mass", "Price"],
          rows: [
            ["Small", "500 g", "£2.40"],
            ["Large", "750 g", "£3.45"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many pence is £2.40?",
        answers: ["240"],
        unit: "p",
        hint: "100p in a pound.",
        done: "240p.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "6 rolls cost 180p. How much is one roll?",
        answers: ["30"],
        unit: "p",
        hint: "$180 \\div 6$.",
        done: "30p a roll.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Unit price",
        text: [
          "The **unit price** is the cost of one unit: one item, one gram, one litre. It's cost ÷ amount.",
          "The lower the unit price, the better the value.",
        ],
        picture: {
          kind: "maths",
          tex: "\\text{unit price} = \\frac{\\text{cost}}{\\text{amount}}",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Pens: 4 for £2, or 10 for £4. Which is cheaper per pen?",
        options: [
          { text: "10 for £4: 40p each", correct: true, feedback: "4 for £2 is 50p each." },
          {
            text: "4 for £2: it costs less",
            feedback: "Less money, but fewer pens. Compare per pen.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Juice",
        problem: "1 litre of juice for £1.20, or 1.5 litres for £1.65. Which is better value?",
        steps: [
          { line: "1 litre: 120p per litre", why: "Already one litre." },
          { line: "1.5 litres: $165 \\div 1.5 = 110$p per litre", why: "Cost ÷ amount." },
          { line: "1.5 litres is better value", why: "110p < 120p." },
        ],
        done: "Same units, then compare.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Which is the better buy?",
        start: "500 g for £2.40, or 750 g for £3.45?",
        stages: [
          {
            prompt: "The price per gram of the 500 g pack is",
            options: [
              { text: "0.48p", correct: true, feedback: "" },
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
        kind: "steps",
        tag: "Together",
        title: "Another way: grams per penny",
        start: "Or compare how much you get for your money.",
        stages: [
          {
            prompt: "Scale both to the same mass. 1500 g is 3 small boxes, costing",
            options: [
              { text: "£7.20", correct: true, feedback: "" },
              { text: "£6.90", feedback: "3 × £2.40." },
            ],
            then: "Small: £7.20 for 1500 g",
          },
          {
            prompt: "1500 g is 2 large boxes, costing",
            options: [
              { text: "£6.90", correct: true, feedback: "" },
              { text: "£7.20", feedback: "2 × £3.45." },
            ],
            then: "Large: £6.90 for 1500 g",
          },
        ],
        done: "Same mass, cheaper price: the large box wins either way.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "8 batteries cost £3.60. Cost of one, in pence?",
        answers: ["45"],
        unit: "p",
        hint: "$360 \\div 8$.",
        done: "45p each.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Rice: 2 kg for £3, or 5 kg for £7. Better value?",
        options: [
          { text: "5 kg for £7", correct: true, feedback: "£1.40 a kg beats £1.50 a kg." },
          { text: "2 kg for £3", feedback: "£1.50 a kg vs £1.40." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Nia picks the 500 g box because £2.40 is less than £3.45. What has she missed?",
        options: [
          {
            text: "The big box has more cereal: compare per gram",
            correct: true,
            feedback: "The cheapest price isn't always the best value.",
          },
          { text: "Nothing", feedback: "It has less cereal in it, too." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Tom compares 3 for £1.50 and 5 for £2.40.",
        lines: ["3 for £1.50: 50p each", "5 for £2.40: 48p each", "So 3 for £1.50 is better"],
        wrong: 2,
        why: "48p each is cheaper: 5 for £2.40 is the better buy.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "500 g for £2.40, or 750 g for £3.45?",
        options: [
          {
            text: "750 g: 0.46p a gram",
            correct: true,
            feedback: "The small box is 0.48p a gram.",
          },
          { text: "500 g: it's cheaper", feedback: "Compare per gram." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Better value: 6 for £3 or 10 for £4.50?",
            options: ["10 for £4.50", "6 for £3", "the same"],
            answers: ["10 for £4.50"],
            why: "45p beats 50p each.",
            retry: {
              prompt: "Better value: 4 for £1 or 9 for £2.43?",
              options: ["4 for £1", "9 for £2.43", "the same"],
              answers: ["4 for £1"],
              why: "25p beats 27p each.",
            },
          },
          {
            prompt: "Unit price is",
            options: ["cost ÷ amount", "amount ÷ cost", "cost × amount"],
            answers: ["cost ÷ amount"],
            why: "The cost of one.",
            retry: {
              prompt: "A lower unit price means",
              options: ["better value", "worse value", "a smaller pack"],
              answers: ["better value"],
              why: "Each unit costs less.",
            },
          },
          {
            prompt: "5 litres of paint cost £20. Price per litre?",
            options: ["£4", "£0.25", "£100"],
            answers: ["£4"],
            why: "$20 \\div 5$.",
            retry: {
              prompt: "2.5 litres of paint cost £15. Price per litre?",
              options: ["£6", "£0.17", "£37.50"],
              answers: ["£6"],
              why: "$15 \\div 2.5$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-rates",
    id: "y8-rates/density",
    before: DENSITY,
    title: "Density",
    summary: "Density is mass per unit of volume: mass ÷ volume.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Real gold?",
        text: [
          "A ring is sold as solid gold. It has a mass of 38 g and a volume of 2 cm³. Gold's density is about 19 g/cm³.",
          "Is it real? By the end of this lesson, you can test it.",
        ],
        picture: {
          kind: "table",
          head: ["", "Mass", "Volume"],
          rows: [["Ring", "38 g", "2 cm³"]],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $600 \\div 75$",
        answers: ["8"],
        hint: "How many 75s in 600? Four 75s make 300.",
        done: "8.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Volume of a 5 cm by 2 cm by 2 cm cuboid?",
        picture: { kind: "cuboid", w: 5, d: 2, h: 2, cubes: true },
        answers: ["20"],
        unit: "cm³",
        hint: "Length × width × height.",
        done: "20 cm³.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Heavy for its size",
        text: [
          "**Density** is mass per unit of volume: how many grams in each cm³. Water is 1 g/cm³; gold is about 19 g/cm³.",
          "So a gold cube is 19 times as heavy as the same cube of water. Density = mass ÷ volume.",
        ],
        picture: { kind: "maths", tex: "\\text{density} = \\frac{\\text{mass}}{\\text{volume}}" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Wood floats on water. Its density is",
        options: [
          {
            text: "less than 1 g/cm³",
            correct: true,
            feedback: "Less dense than water, so it floats.",
          },
          { text: "more than 1 g/cm³", feedback: "Denser things sink." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Find the density",
        problem: "A block has a mass of 600 g and a volume of 75 cm³. Find its density.",
        steps: [
          { line: "density = mass ÷ volume", why: "g per cm³." },
          { line: "$600 \\div 75 = 8$", why: "" },
          { line: "8 g/cm³", why: "Each cm³ weighs 8 g." },
        ],
        done: "Mass ÷ volume, with the units.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Find the mass",
        start: "Aluminium has a density of 2.7 g/cm³. Find the mass of 20 cm³.",
        stages: [
          {
            prompt: "Each cm³ has mass 2.7 g, so",
            options: [
              { text: "mass = density × volume", correct: true, feedback: "" },
              { text: "mass = density ÷ volume", feedback: "20 cubes, each 2.7 g: multiply." },
            ],
            then: "$2.7 \\times 20$",
          },
          {
            prompt: "The mass is",
            options: [
              { text: "54 g", correct: true, feedback: "" },
              { text: "7.4 g", feedback: "That divides." },
            ],
            then: "54 g",
          },
        ],
        done: "Mass = density × volume.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Find the volume",
        start: "Copper: 9 g/cm³. A piece has mass 45 g. Its volume?",
        stages: [
          {
            prompt: "How many lots of 9 g make 45 g?",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "405", feedback: "That multiplies." },
            ],
            then: "5 cm³",
          },
        ],
        done: "Volume = mass ÷ density.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Mass 120 g, volume 40 cm³. Density?",
        answers: ["3"],
        unit: "g/cm³",
        wrong: [{ answer: "4800", feedback: "Divide mass by volume." }],
        hint: "$120 \\div 40$.",
        done: "3 g/cm³.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Density 0.8 g/cm³, volume 50 cm³. Mass?",
        answers: ["40"],
        unit: "g",
        wrong: [{ answer: "62.5", feedback: "Mass = density × volume." }],
        hint: "$0.8 \\times 50$.",
        done: "40 g.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Density 8 g/cm³ and volume 10 cm³. Ava divides: 0.8 g. What's wrong?",
        options: [
          {
            text: "Mass = density × volume: 80 g",
            correct: true,
            feedback:
              "Each of the 10 cm³ weighs 8 g. Think about the units: g per cm³ times cm³ gives g.",
          },
          { text: "Nothing", feedback: "10 cubes of 8 g can't weigh less than one." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Sid finds the density of a 300 g stone with volume 100 cm³.",
        lines: ["density = volume ÷ mass", "$100 \\div 300 = 0.33$", "0.33 g/cm³"],
        wrong: 0,
        why: "g/cm³ means g ÷ cm³: mass ÷ volume = 3 g/cm³.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The ring: 38 g, 2 cm³",
        text: "Gold is about 19 g/cm³. Is it real?",
        options: [
          { text: "Yes: 38 ÷ 2 = 19 g/cm³", correct: true, feedback: "It matches gold's density." },
          { text: "No: 38 isn't 19", feedback: "Divide mass by volume first." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Mass 50 g, volume 10 cm³. Density?",
            options: ["5 g/cm³", "500 g/cm³", "0.2 g/cm³"],
            answers: ["5 g/cm³"],
            why: "$50 \\div 10$.",
            retry: {
              prompt: "Mass 72 g, volume 8 cm³. Density?",
              options: ["9 g/cm³", "576 g/cm³", "0.11 g/cm³"],
              answers: ["9 g/cm³"],
              why: "$72 \\div 8$.",
            },
          },
          {
            prompt: "Density 3 g/cm³, volume 12 cm³. Mass?",
            options: ["36 g", "4 g", "15 g"],
            answers: ["36 g"],
            why: "$3 \\times 12$.",
            retry: {
              prompt: "Density 7 g/cm³, volume 5 cm³. Mass?",
              options: ["35 g", "1.4 g", "12 g"],
              answers: ["35 g"],
              why: "$7 \\times 5$.",
            },
          },
          {
            prompt: "Density 4 g/cm³, mass 20 g. Volume?",
            options: ["5 cm³", "80 cm³", "0.2 cm³"],
            answers: ["5 cm³"],
            why: "$20 \\div 4$.",
            retry: {
              prompt: "Density 6 g/cm³, mass 42 g. Volume?",
              options: ["7 cm³", "252 cm³", "0.14 cm³"],
              answers: ["7 cm³"],
              why: "$42 \\div 6$.",
            },
          },
        ],
      },
    ],
  },
];
