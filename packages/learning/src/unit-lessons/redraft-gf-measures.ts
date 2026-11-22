// GCSE Foundation, "Measures", on the stepped template (docs/proposals/lesson-stepped.md):
// standard units, compound measures, and area and volume units. Conversions are a table, a square
// of little squares and a cube of little cubes; the rest is number work.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfMeasures } from "./gf-measures.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const ME = gfMeasures;
const NUMBER = "A measurement fact: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Standard units.

const UNITS = "gf-measures/units";
const unitMethod = [
  "Know the conversion.",
  "Big to small: ×. Small to big: ÷.",
  "Time: divide the minutes by 60.",
];
const CONVERSIONS: Picture = {
  kind: "table",
  head: ["Length", "Mass", "Capacity"],
  rows: [
    ["10 mm = 1 cm", "1000 g = 1 kg", "1000 ml = 1 litre"],
    ["100 cm = 1 m", "1000 kg = 1 tonne", ""],
    ["1000 m = 1 km", "", ""],
  ],
};

const units = stepped(find(ME, UNITS), {
  method: unitMethod,
  variation: {
    relationship: "metric units and time, converted",
    unknowns: ["converted"],
    surface: ["big to small", "small to big", "time"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The conversions",
        ["**Big unit to small: multiply. Small unit to big: divide.**"],
        CONVERSIONS,
        "Time isn't decimal: 60 minutes make an hour.",
      ),
      reworded(ME, UNITS, "Big unit to small unit:", { tag: "The rule" }),

      ...owned(ME, UNITS, "Warm-up", "Check you remember"),

      methodCard("The method", unitMethod, CONVERSIONS),
      workedFrom(ME, UNITS),
      calc(
        "Your turn",
        "Write 2.35 km in metres, then in cm.",
        undefined,
        [
          ["$2.35 \\times 1000 =$", "2350", "km to m.", { after: "m" }],
          ["$2350 \\times 100 =$", "235000", "m to cm.", { after: "cm" }],
        ],
        "2350 m, 235 000 cm.",
      ),

      calc(
        "Practise",
        "Write 2 h 24 min in hours.",
        undefined,
        [
          ["$24 \\div 60 =$", "0.4", "Minutes to hours."],
          ["Total:", "2.4", "2 + 0.4.", { after: "h" }],
        ],
        "2.4 hours.",
      ),
      ...owned(ME, UNITS, "Together", "Practise"),
      ...owned(ME, UNITS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Convert. Watch what changes.",
        [
          ask("3.5 kg in grams", "3500", "× 1000.", "3500 g.", { asks: "converted" }),
          ask("350 g in kg", "0.35", "÷ 1000.", "0.35 kg.", {
            asks: "converted",
            changed: "Small to big.",
          }),
          ask("3.5 litres in ml", "3500", "× 1000.", "3500 ml.", {
            asks: "converted",
            changed: "Capacity.",
          }),
          ask("3 h 30 min in hours", "3.5", "30 ÷ 60.", "3.5 h.", {
            asks: "converted",
            changed: "Time.",
          }),
        ],
        "Times for smaller units, divide for bigger.",
      ),

      questionSet(
        "Variation",
        "Hours and minutes. Watch what changes.",
        [
          ask("1 h 45 min in hours", "1.75", "45 ÷ 60.", "1.75 h.", {
            asks: "converted",
            expect: [
              "Sal writes 1 h 45 min as 1.45 h. Right?",
              "No",
              "45 minutes is $\\frac{45}{60} = 0.75$ h: 1.75 h.",
              [["Yes", "How many minutes in an hour?"]],
            ],
          }),
          ask("1 h 15 min in hours", "1.25", "15 ÷ 60.", "1.25 h.", {
            asks: "converted",
            changed: "15 minutes.",
          }),
          ask("1 h 6 min in hours", "1.1", "6 ÷ 60.", "1.1 h.", {
            asks: "converted",
            changed: "6 minutes.",
          }),
          ask("1.6 h in minutes", "96", "1.6 × 60.", "96 minutes.", {
            asks: "converted",
            changed: "Backwards.",
          }),
        ],
        "Minutes over 60, not over 100.",
      ),
      own(ME, UNITS, "Spot the mistake"),

      own(ME, UNITS, "Exit check"),

      reworded(
        ME,
        UNITS,
        "“3.6 km, 850 m and 1.2 km. Total distance in metres?”",
        { tag: "Real life", title: "3.6 km, 850 m and 1.2 km: total in metres?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Big unit to small: multiply. Small unit to big: divide.**"],
        CONVERSIONS,
        [
          "**Big unit to small: multiply. Small unit to big: divide.**",
          "2 h 30 min is 2.5 h, not 2.3 h.",
          "Same units before adding.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Compound measures.

const COMPOUND = "gf-measures/compound";
const compMethod = [
  "Pick the formula: speed, density or rate.",
  "Put both amounts in matching units.",
  "Divide, or multiply to go back.",
];
const SPEED = maths("\\text{speed} = \\frac{\\text{distance}}{\\text{time}}");

const compound = stepped(find(ME, COMPOUND), {
  method: compMethod,
  variation: {
    relationship: "speed, distance and time",
    unknowns: ["measure"],
    surface: ["speed", "distance", "time", "minutes"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two units in one",
        ["**Speed = distance ÷ time; keep the units together.**"],
        SPEED,
        "Density = mass ÷ volume works the same way.",
      ),
      reworded(ME, COMPOUND, "Which unit is a speed?", { tag: "The rule" }),

      ...owned(ME, COMPOUND, "Warm-up", "Check you remember"),

      methodCard("The method", compMethod, SPEED),
      workedFrom(ME, COMPOUND),
      calc(
        "Your turn",
        "45 km in 30 minutes. Speed in km/h?",
        undefined,
        [
          ["30 minutes in hours:", "0.5", "30 ÷ 60."],
          ["Speed:", "90", "45 ÷ 0.5.", { after: "km/h" }],
        ],
        "90 km/h.",
      ),

      calc(
        "Practise",
        "Density 8 g/cm³, volume 25 cm³. Mass?",
        undefined,
        [["$8 \\times 25 =$", "200", "Mass = density × volume.", { after: "g" }]],
        "200 g.",
      ),
      ...owned(ME, COMPOUND, "Together", "Practise"),
      reworded(ME, COMPOUND, "A tap fills 60 litres in 4 minutes. Rate in litres per minute?", {
        tag: "Practise",
        title: "A tap fills 60 litres in 4 minutes. Litres per minute?",
      }),
      reworded(ME, COMPOUND, "Speed 50 km/h for 2.5 hours. Distance?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Speed, distance, time. Watch what changes.",
        [
          ask("120 km in 2 h. Speed?", "60", "120 ÷ 2.", "60 km/h.", {
            asks: "measure",
            unit: "km/h",
          }),
          ask("120 km in 3 h. Speed?", "40", "120 ÷ 3.", "40 km/h.", {
            asks: "measure",
            unit: "km/h",
            changed: "Longer.",
          }),
          ask("60 km/h for 3 h. Distance?", "180", "60 × 3.", "180 km.", {
            asks: "measure",
            unit: "km",
            changed: "Distance.",
          }),
          ask("180 km at 60 km/h. Time?", "3", "180 ÷ 60.", "3 h.", {
            asks: "measure",
            unit: "h",
            changed: "Time.",
          }),
        ],
        "Speed × time = distance; distance ÷ speed = time.",
      ),

      questionSet(
        "Variation",
        "The time in minutes. Watch what changes.",
        [
          ask("90 km at 60 km/h", "90", "1.5 h.", "90 minutes.", {
            asks: "measure",
            unit: "min",
            expect: [
              "Tia turns 1.5 hours into 1 h 50 min. Right?",
              "No",
              "0.5 h is 30 minutes: 1 h 30 min = 90 minutes.",
              [["Yes", "Half an hour is how many minutes?"]],
            ],
          }),
          ask("90 km at 45 km/h", "120", "2 h.", "120 minutes.", {
            asks: "measure",
            unit: "min",
            changed: "Slower.",
          }),
          ask("90 km at 120 km/h", "45", "0.75 h.", "45 minutes.", {
            asks: "measure",
            unit: "min",
            changed: "Faster.",
          }),
          ask("45 km at 60 km/h", "45", "0.75 h.", "45 minutes.", {
            asks: "measure",
            unit: "min",
            changed: "Shorter.",
          }),
        ],
        "Decimal hours × 60 = minutes.",
      ),
      own(ME, COMPOUND, "Spot the mistake"),

      own(ME, COMPOUND, "Exit check"),

      reworded(
        ME,
        COMPOUND,
        "“Cyclist: 12 km in 40 min. Runner: 100 m in 12.5 s. Who is faster?”",
        { tag: "Real life", title: "Cyclist: 12 km in 40 min. Runner: 100 m in 12.5 s. Faster?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Speed = distance ÷ time; keep the units together.**"],
        SPEED,
        [
          "**Speed = distance ÷ time; keep the units together.**",
          "km ÷ minutes gives km per minute: × 60 for km/h.",
          "1.5 h is 1 h 30 min.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Area and volume units.

const AREA_UNITS = "gf-measures/area-volume-units";
const avMethod = [
  "Find the length conversion, k.",
  "Area: × k². Volume: × k³.",
  "1 litre = 1000 cm³.",
];
const MM: Picture = { kind: "grid", cols: 10, rows: 10, shaded: 100 };

const areaVolumeUnits = stepped(find(ME, AREA_UNITS), {
  method: avMethod,
  variation: {
    relationship: "length, area and volume unit conversions",
    unknowns: ["converted"],
    surface: ["lengths", "areas", "volumes", "litres"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A square of little squares",
        ["**Area units: square the conversion. Volume units: cube it.**"],
        MM,
        "1 cm² is 10 mm by 10 mm: 100 mm².",
      ),
      reworded(ME, AREA_UNITS, "1 cm² in mm²", { tag: "The rule" }, "Discover"),

      ...owned(ME, AREA_UNITS, "Warm-up", "Check you remember"),

      methodCard("The method", avMethod, MM),
      workedFrom(ME, AREA_UNITS),
      calc(
        "Your turn",
        "Write 7 m² in cm².",
        undefined,
        [
          ["1 m² =", "10000", "100 × 100.", { after: "cm²" }],
          ["7 m² =", "70000", "× 7.", { after: "cm²" }],
        ],
        "70 000 cm².",
      ),

      calc(
        "Practise",
        "Write 3 m³ in litres.",
        undefined,
        [
          ["1 m³ =", "1000000", "100 × 100 × 100.", { after: "cm³" }],
          ["3 m³ in litres:", "3000", "3 000 000 ÷ 1000."],
        ],
        "3000 litres.",
      ),
      ...owned(ME, AREA_UNITS, "Together", "Practise"),
      ...owned(ME, AREA_UNITS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Convert. Watch what changes.",
        [
          ask("2 m² in cm²", "20000", "× 10 000.", "20 000 cm².", { asks: "converted" }),
          ask("2 cm² in mm²", "200", "× 100.", "200 mm².", {
            asks: "converted",
            changed: "Smaller units.",
          }),
          ask("2 m³ in cm³", "2000000", "× 1 000 000.", "2 000 000 cm³.", {
            asks: "converted",
            changed: "Volume.",
          }),
          ask("2 litres in cm³", "2000", "× 1000.", "2000 cm³.", {
            asks: "converted",
            changed: "Litres.",
          }),
        ],
        "Square for area, cube for volume.",
      ),

      questionSet(
        "Variation",
        "Convert. Watch what changes.",
        [
          ask("4 m³ in cm³", "4000000", "× 100³.", "4 000 000 cm³.", {
            asks: "converted",
            expect: [
              "Ana uses 1 m³ = 10 000 cm³. Right?",
              "No",
              "Cube it: $100^3 = 1\\,000\\,000$ cm³.",
              [["Yes", "How many lengths make a volume?"]],
            ],
          }),
          ask("4 m² in cm²", "40000", "× 100².", "40 000 cm².", {
            asks: "converted",
            changed: "Area.",
          }),
          ask("4 m in cm", "400", "× 100.", "400 cm.", { asks: "converted", changed: "Length." }),
          ask("4 cm³ in mm³", "4000", "× 10³.", "4000 mm³.", {
            asks: "converted",
            changed: "Smaller units.",
          }),
        ],
        "Count the lengths: one, two or three.",
      ),
      own(ME, AREA_UNITS, "Spot the mistake"),

      own(ME, AREA_UNITS, "Exit check"),

      reworded(
        ME,
        AREA_UNITS,
        "“Write 12 m² in cm².”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Area units: square the conversion. Volume units: cube it.**"],
        MM,
        [
          "**Area units: square the conversion. Volume units: cube it.**",
          "1 m² = 10 000 cm², not 100.",
          "1 m³ = 1 000 000 cm³; 1 litre = 1000 cm³.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfMeasuresStepped: [string, UnitLesson[]][] = [
  [UNITS, [units]],
  [COMPOUND, [compound]],
  [AREA_UNITS, [areaVolumeUnits]],
];
