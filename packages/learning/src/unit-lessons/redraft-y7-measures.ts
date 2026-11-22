// Year 7, "Measures", on the stepped template (docs/proposals/lesson-stepped.md): metric units,
// area and volume units, and time. A slider shows a length, or a time, in other units at once.
import {
  ask,
  calc,
  explain,
  explore,
  methodCard,
  questionSet,
  summary,
  typed,
  worked,
} from "./build.ts";
import { find, own, owned, reworded, stepped, tagged } from "./stepped.ts";
import type { Picture, Screen, UnitLesson } from "./types.ts";
import { y7Measures } from "./y7-measures.ts";

const NUMBER = "A conversion: the units are the picture.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });
const units = (rows: [string, string][]): Picture => ({
  kind: "table",
  head: ["One", "is"],
  rows: rows.map(([a, b]) => [a, b]),
});

/** A question with no picture is a conversion: say so. */
const worded = (screens: Screen[]): Screen[] =>
  screens.map((s) =>
    ["answer", "choice", "calc", "set", "steps", "fill", "order"].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture)
      ? { ...s, wordsOnly: NUMBER }
      : s,
  );

const list = y7Measures;

// ---------------------------------------------------------------------------------------------
// Metric units.

const METRIC = "y7-measures/metric";
const metricMethod = [
  "Find how many small units make one big one.",
  "Big to small: multiply by it.",
  "Small to big: divide by it.",
];
const metricTable = units([
  ["1 km", "1000 m"],
  ["1 m", "100 cm"],
  ["1 cm", "10 mm"],
  ["1 kg", "1000 g"],
  ["1 litre", "1000 ml"],
]);

const metric = stepped(find(list, METRIC), {
  method: metricMethod,
  variation: {
    relationship: "an amount in one metric unit and in another",
    unknowns: ["smaller unit", "bigger unit"],
    surface: ["lengths", "masses", "capacities", "the dividing mistake", "a hiker's bag"],
  },
  screens: worded([
    explain(
      "The rule",
      "Metric units",
      ["**To a smaller unit, multiply. To a bigger unit, divide.**"],
      metricTable,
      "Smaller units: you need more of them, so the number grows.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the length",
        {
          kind: "line",
          min: 0,
          max: 5,
          step: 0.1,
          start: 1.5,
          tick: 0.5,
          every: 2,
          dp: 1,
          readouts: [
            { label: "In metres", value: true },
            { label: "In centimetres", times: 100 },
            { label: "In millimetres", times: 1000 },
            { label: "In kilometres", times: 0.001 },
          ],
        },
        [
          "What did you notice?",
          "Smaller units give bigger numbers",
          "A centimetre is small, so a length needs lots of them.",
          [
            ["Every unit gives the same number", "Look: 1.5 m is 150 cm."],
            ["Kilometres give the biggest number", "A kilometre is big, so you need few."],
          ],
        ],
        "The smaller the unit, the bigger the number.",
        { text: "Slide the length, in metres. Watch it in other units." },
      ),
    ),

    ...owned(list, METRIC, "Warm-up", "Check you remember"),
    typed(
      "Check you remember",
      "How many centimetres in 1 metre?",
      "100",
      "Centi means a hundredth.",
      "100 cm.",
      {
        unit: "cm",
      },
    ),

    methodCard("The method", metricMethod, metricTable),
    worked(
      "Watch the method",
      "Convert 3.2 kg to grams.",
      [
        { line: "1 kg = 1000 g", note: "Grams are smaller, so multiply." },
        { line: "$3.2 \\times 1000 = 3200$ g" },
      ],
      "3200 g.",
    ),
    calc(
      "Your turn",
      "Convert 2.5 km to metres.",
      undefined,
      [
        ["1 km =", "1000", "Kilo means 1000.", { after: "m" }],
        ["$2.5 \\times 1000 =$", "2500", "Big to small: multiply.", { after: "m" }],
      ],
      "2500 m.",
    ),

    calc(
      "Practise",
      "Convert 85 mm to centimetres.",
      undefined,
      [
        ["1 cm =", "10", "Count the millimetres in a centimetre.", { after: "mm" }],
        ["$85 \\div 10 =$", "8.5", "Small to big: divide.", { after: "cm" }],
      ],
      "8.5 cm.",
    ),
    ...owned(list, METRIC, "Together", "Practise"),
    questionSet(
      "Practise",
      "Convert each one. Watch what changes.",
      [
        ask("Convert 3 m to centimetres.", "300", "Multiply by 100.", "300 cm.", {
          unit: "cm",
          asks: "smaller unit",
        }),
        ask("Convert 2500 g to kilograms.", "2.5", "Divide by 1000.", "2.5 kg.", {
          unit: "kg",
          asks: "bigger unit",
          changed: "To a bigger unit now.",
        }),
        ask("Convert 0.4 km to metres.", "400", "Multiply by 1000.", "400 m.", {
          unit: "m",
          asks: "smaller unit",
          changed: "A decimal to start.",
        }),
        ask("Convert 750 ml to litres.", "0.75", "Divide by 1000.", "0.75 litres.", {
          unit: "litres",
          asks: "bigger unit",
          changed: "Now capacity.",
        }),
      ],
      "Smaller unit: multiply. Bigger unit: divide.",
    ),

    questionSet(
      "Variation",
      "Convert 6 m. Watch what changes.",
      [
        ask("Convert 6 m to centimetres.", "600", "Multiply by 100.", "600 cm.", {
          unit: "cm",
          asks: "smaller unit",
          expect: [
            "Ella divides and gets 0.06 cm. Is she right?",
            "No: 600 cm",
            "Centimetres are smaller, so there are more of them.",
            [["Yes", "0.06 cm is tiny: far less than 6 m."]],
          ],
        }),
        ask("Convert 6 m to millimetres.", "6000", "Multiply by 1000.", "6000 mm.", {
          unit: "mm",
          asks: "smaller unit",
          changed: "An even smaller unit.",
        }),
        ask("Convert 6 m to kilometres.", "0.006", "Divide by 1000.", "0.006 km.", {
          unit: "km",
          asks: "bigger unit",
          changed: "Now a bigger unit.",
        }),
        ask("Convert 6 cm to metres.", "0.06", "Divide by 100.", "0.06 m.", {
          unit: "m",
          asks: "bigger unit",
          changed: "6 centimetres, not 6 metres.",
        }),
      ],
      "Ask: is the new unit bigger or smaller? That decides × or ÷.",
    ),
    own(list, METRIC, "Spot the mistake"),

    own(list, METRIC, "Exit check"),

    reworded(list, METRIC, "Packing a bag", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**To a smaller unit, multiply. To a bigger unit, divide.**"],
      metricTable,
      [
        "**To a smaller unit, multiply. To a bigger unit, divide.**",
        "1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1000 g",
        "3.2 kg = 3200 g; 85 mm = 8.5 cm",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Area and volume units.

const AREA = "y7-measures/area-volume";
const areaMethod = [
  "Find the length conversion: 1 cm = 10 mm.",
  "Area: square it. Volume: cube it.",
  "Then multiply or divide by that.",
];
const square10: Picture = { kind: "grid", cols: 10, rows: 10, shaded: 100 };

const areaVolume = stepped(find(list, AREA), {
  method: areaMethod,
  variation: {
    relationship: "a length conversion, squared for area and cubed for volume",
    unknowns: ["area", "volume"],
    surface: ["cm and mm", "m and cm", "small to big", "carpets"],
  },
  screens: worded([
    explain(
      "The rule",
      "Area and volume units",
      ["**Area units square the conversion. Volume units cube it.**"],
      square10,
      "1 cm² is 10 mm by 10 mm: 100 mm², not 10.",
    ),
    explain(
      "The rule",
      "Volume units are cubed",
      ["A 1 cm cube is 10 mm each way.", "$10 \\times 10 \\times 10 = 1000$ mm³."],
      { kind: "cuboid", w: 10, d: 10, h: 10, labels: ["10 mm", "10 mm", "10 mm"] },
      "So 1 cm³ = 1000 mm³.",
    ),

    ...owned(list, AREA, "Warm-up", "Check you remember"),
    typed(
      "Check you remember",
      "What is $10 \\times 10 \\times 10$?",
      "1000",
      "10 × 10 is 100.",
      "1000.",
    ),

    methodCard(
      "The method",
      areaMethod,
      maths("1\\text{ m}^2 = 100 \\times 100 = 10\\,000\\text{ cm}^2"),
    ),
    worked(
      "Watch the method",
      "Convert 3 m² to cm².",
      [
        {
          line: "1 m = 100 cm, so 1 m² = $100 \\times 100 = 10\\,000$ cm²",
          note: "Square the conversion.",
        },
        { line: "$3 \\times 10\\,000 = 30\\,000$ cm²" },
      ],
      "30 000 cm².",
    ),
    calc(
      "Your turn",
      "Convert 4 cm² to mm².",
      square10,
      [
        ["1 cm² = $10 \\times 10 =$", "100", "Square the 10.", { after: "mm²" }],
        ["$4 \\times 100 =$", "400", "Big to small: multiply.", { after: "mm²" }],
      ],
      "400 mm².",
    ),

    calc(
      "Practise",
      "Convert 20 000 cm² to m².",
      undefined,
      [
        ["1 m² = $100 \\times 100 =$", "10000", "Square the 100.", { after: "cm²" }],
        ["$20\\,000 \\div 10\\,000 =$", "2", "Small to big: divide.", { after: "m²" }],
      ],
      "2 m².",
    ),
    ...owned(list, AREA, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("How many mm² in 1 cm²?", "100", "10 × 10.", "100.", { asks: "area" }),
        ask("How many mm³ in 1 cm³?", "1000", "10 × 10 × 10.", "1000.", {
          asks: "volume",
          changed: "Now volume.",
        }),
        ask("Convert 6 cm² to mm².", "600", "6 × 100.", "600 mm².", {
          unit: "mm²",
          asks: "area",
          changed: "6 of them.",
        }),
        ask("Convert 2 cm³ to mm³.", "2000", "2 × 1000.", "2000 mm³.", {
          unit: "mm³",
          asks: "volume",
          changed: "Volume again.",
        }),
      ],
      "Square for area, cube for volume.",
    ),

    questionSet(
      "Variation",
      "Find each one. Watch what changes.",
      [
        ask("How many cm² in 1 m²?", ["10000", "10 000", "10,000"], "100 × 100.", "10 000 cm².", {
          unit: "cm²",
          asks: "area",
          expect: [
            "Raj says 1 m² = 100 cm². Is he right?",
            "No",
            "A square metre is 100 cm by 100 cm: 10 000 cm².",
            [["Yes", "That's only one row of the square."]],
          ],
        }),
        ask(
          "How many cm³ in 1 m³?",
          ["1000000", "1 000 000", "1,000,000"],
          "100 × 100 × 100.",
          "1 000 000 cm³.",
          {
            unit: "cm³",
            asks: "volume",
            changed: "Now volume.",
          },
        ),
        ask("Convert 500 mm² to cm².", "5", "500 ÷ 100.", "5 cm².", {
          unit: "cm²",
          asks: "area",
          changed: "Small to big: divide.",
        }),
        ask(
          "How many m² in 1 km²?",
          ["1000000", "1 000 000", "1,000,000"],
          "1000 × 1000.",
          "1 000 000 m².",
          {
            unit: "m²",
            asks: "area",
            changed: "Kilometres: 1000 each way.",
          },
        ),
      ],
      "Square the length conversion for area; cube it for volume.",
    ),
    own(list, AREA, "Spot the mistake"),

    own(list, AREA, "Exit check"),

    reworded(list, AREA, "Carpet tiles", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Area units square the conversion. Volume units cube it.**"],
      square10,
      [
        "**Area units square the conversion. Volume units cube it.**",
        "1 cm² = 100 mm²; 1 m² = 10 000 cm²",
        "1 cm³ = 1000 mm³; 1 m³ = 1 000 000 cm³",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Time.

const TIME = "y7-measures/time";
const timeMethod = [
  "Hours to minutes: times by 60.",
  "Minutes to hours: divide by 60.",
  "Adding times: count on to the next hour.",
];

const time = stepped(find(list, TIME), {
  method: timeMethod,
  variation: {
    relationship: "a time in hours as a decimal, and in hours and minutes",
    unknowns: ["minutes", "hours", "end time"],
    surface: ["halves", "quarters", "tenths", "films", "train times"],
  },
  screens: worded([
    explain(
      "The rule",
      "Time",
      ["**Time doesn't go in tens: 60 minutes make an hour.**"],
      maths("0.5 \\text{ hours} = 30 \\text{ minutes}"),
      "To change hours to minutes, times by 60.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the time",
        {
          kind: "line",
          min: 0,
          max: 3,
          step: 0.25,
          start: 1.25,
          tick: 0.25,
          every: 2,
          dp: 2,
          readouts: [
            { label: "In hours", value: true },
            { label: "In minutes", times: 60 },
          ],
        },
        [
          "What did you notice?",
          "Each quarter of an hour is 15 minutes",
          "0.25 hours is a quarter of 60 minutes: 15.",
          [
            ["0.25 hours is 25 minutes", "Look: it reads 15 minutes."],
            ["Half an hour is 50 minutes", "Slide to 0.5: it's 30 minutes."],
          ],
        ],
        "Hours are in 60s, not 10s.",
        { text: "Slide the time, in hours. Watch the minutes." },
      ),
    ),

    ...owned(list, TIME, "Warm-up", "Check you remember"),
    typed("Check you remember", "What is $0.25 \\times 60$?", "15", "A quarter of 60.", "15."),

    methodCard(
      "The method",
      timeMethod,
      maths("3.4\\text{ h} = 3\\text{ h} + 0.4 \\times 60 = 3\\text{ h } 24\\text{ min}"),
    ),
    worked(
      "Watch the method",
      "Write 3.4 hours in hours and minutes.",
      [
        { line: "3 whole hours" },
        { line: "$0.4 \\times 60 = 24$ minutes", note: "The decimal part, times 60." },
        { line: "3 hours 24 minutes" },
      ],
      "3 hours 24 minutes.",
    ),
    calc(
      "Your turn",
      "How many minutes in 1.75 hours?",
      undefined,
      [
        ["$0.75 \\times 60 =$", "45", "Three quarters of 60."],
        ["$60 + 45 =$", "105", "Add the whole hour."],
      ],
      "105 minutes.",
    ),

    calc(
      "Practise",
      "Write 150 minutes in hours and minutes.",
      undefined,
      [
        ["Whole hours in 150 minutes:", "2", "2 × 60 is 120."],
        ["Minutes left: $150 - 120 =$", "30", "Take away the whole hours."],
      ],
      "2 hours 30 minutes.",
    ),
    ...owned(list, TIME, "Together", "Practise").filter((s) => !s.title.includes("150")),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("How many minutes in 2.5 hours?", "150", "2.5 × 60.", "150 minutes.", {
          unit: "minutes",
          asks: "minutes",
        }),
        ask("0.75 hours is how many minutes?", "45", "0.75 × 60.", "45 minutes.", {
          unit: "minutes",
          asks: "minutes",
          changed: "Less than an hour.",
        }),
        ask(
          "Write 3 hours 15 minutes in hours.",
          "3.25",
          "15 minutes is a quarter.",
          "3.25 hours.",
          {
            unit: "hours",
            asks: "hours",
            changed: "Now the other way.",
          },
        ),
        ask(
          "9:50 am, plus 1 hour 25 minutes. The time?",
          ["11:15", "11:15 am"],
          "10:50, then 25 more.",
          "11:15 am.",
          {
            asks: "end time",
            changed: "Now a time of day.",
          },
        ),
      ],
      "Times and divides by 60; count on through the hour.",
    ),

    questionSet(
      "Variation",
      "Write each in hours. Watch what changes.",
      [
        ask(
          "Write 2 hours 30 minutes in hours.",
          "2.5",
          "30 minutes is half an hour.",
          "2.5 hours.",
          {
            unit: "hours",
            asks: "hours",
            expect: [
              "Bea writes 2.3 hours. Is she right?",
              "No: 2.5",
              "30 minutes is half of 60, so 0.5 of an hour.",
              [["Yes", "2.3 hours is 2 hours 18 minutes."]],
            ],
          },
        ),
        ask(
          "Write 2 hours 15 minutes in hours.",
          "2.25",
          "15 minutes is a quarter.",
          "2.25 hours.",
          {
            unit: "hours",
            asks: "hours",
            changed: "A quarter of an hour.",
          },
        ),
        ask(
          "Write 2 hours 45 minutes in hours.",
          "2.75",
          "45 minutes is three quarters.",
          "2.75 hours.",
          {
            unit: "hours",
            asks: "hours",
            changed: "Three quarters.",
          },
        ),
        ask(
          "Write 2 hours 6 minutes in hours.",
          "2.1",
          "6 minutes is a tenth of 60.",
          "2.1 hours.",
          {
            unit: "hours",
            asks: "hours",
            changed: "6 minutes: a tenth of an hour.",
          },
        ),
      ],
      "Minutes over 60 give the decimal: never just the digits.",
    ),
    own(list, TIME, "Spot the mistake"),

    own(list, TIME, "Exit check"),

    reworded(list, TIME, "Film time", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Time doesn't go in tens: 60 minutes make an hour.**"],
      maths("0.5 \\text{ hours} = 30 \\text{ minutes}"),
      [
        "**Time doesn't go in tens: 60 minutes make an hour.**",
        "Hours to minutes: × 60. Minutes to hours: ÷ 60.",
        "3.4 hours = 3 hours 24 minutes",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7MeasuresStepped: [string, UnitLesson[]][] = [
  [METRIC, [metric]],
  [AREA, [areaVolume]],
  [TIME, [time]],
];
