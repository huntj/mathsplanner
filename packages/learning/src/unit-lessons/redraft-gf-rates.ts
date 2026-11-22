// GCSE Foundation, "Compound measures and rates of change", on the stepped template
// (docs/proposals/lesson-stepped.md): converting compound units, speed, pay and unit pricing,
// density, pressure, and the gradient as a rate. Formulae and tables are the pictures; rates of
// change are read from their graphs.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfRates } from "./gf-rates.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Point, Screen, UnitLesson } from "./types.ts";

const RA = gfRates;
const NUMBER = "A rate fact: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const steps = (...lines: string[]): Picture =>
  maths(`\\begin{array}{l} ${lines.join(" \\\\ ")} \\end{array}`);
const table = (head: string[], rows: string[][]): Picture => ({ kind: "table", head, rows });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";
/** A lesson's own worked example, drawn. */
const workedOn = (id: string, picture: Picture): Screen => {
  const w = workedFrom(RA, id);
  return w.kind === "worked" ? { ...w, picture } : w;
};

// ---------------------------------------------------------------------------------------------
// Converting compound units.

const UNITS = "gf-rates/units";
const unitsMethod = [
  "Convert the top part.",
  "Convert the bottom part.",
  "Shortcut: m/s to km/h × 3.6; back ÷ 3.6.",
];
const PER_HOUR = steps("1 \\text{ m/s} = 3600 \\text{ m per hour}", "= 3.6 \\text{ km/h}");
const faster = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Change one to the other's units.", { asks: "compare", ...extra });

const units = stepped(find(RA, UNITS), {
  method: unitsMethod,
  variation: {
    relationship: "the same speed in two units",
    unknowns: ["convert", "compare"],
    surface: ["the other way", "a faster car", "exactly equal"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Convert each part",
        ["**Convert each part. m/s to km/h: × 3.6. km/h to m/s: ÷ 3.6.**"],
        PER_HOUR,
        "3600 seconds in an hour; 1000 m in a km.",
      ),
      reworded(RA, UNITS, "1 m/s in km/h", { tag: "The rule" }),

      ...owned(RA, UNITS, "Warm-up", "Check you remember"),

      methodCard("The method", unitsMethod, PER_HOUR),
      workedFrom(RA, UNITS),
      calc(
        "Your turn",
        "Convert 20 m/s to km/h.",
        undefined,
        [
          ["Metres in an hour:", "72000", "20 × 3600."],
          ["km/h:", "72", "÷ 1000."],
        ],
        "72 km/h.",
      ),

      calc(
        "Practise",
        "Convert 108 km/h to m/s.",
        undefined,
        [
          ["Metres in an hour:", "108000", "108 × 1000."],
          ["m/s:", "30", "÷ 3600."],
        ],
        "30 m/s.",
      ),
      ...owned(RA, UNITS, "Together", "Practise"),
      ...owned(RA, UNITS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Convert. Watch what changes.",
        [
          pick("5 m/s in km/h", "18 km/h", ["300 km/h", "1.4 km/h"], "× 3.6.", { asks: "convert" }),
          pick("25 m/s in km/h", "90 km/h", ["1500 km/h", "6.9 km/h"], "× 3.6.", {
            asks: "convert",
            changed: "Five times faster.",
          }),
          pick("18 km/h in m/s", "5 m/s", ["64.8 m/s", "1080 m/s"], "÷ 3.6.", {
            asks: "convert",
            changed: "The other way.",
          }),
          pick("7.2 km/h in m/s", "2 m/s", ["25.9 m/s", "0.2 m/s"], "÷ 3.6.", {
            asks: "convert",
            changed: "A decimal.",
          }),
        ],
        "To km/h, × 3.6. To m/s, ÷ 3.6.",
      ),

      questionSet(
        "Variation",
        "Which is faster? Watch what changes.",
        [
          faster("20 m/s or 70 km/h?", "20 m/s (72 km/h)", ["70 km/h", "The same"], {
            expect: [
              "Ed converts 54 km/h to m/s, using 1 hour = 60 seconds. Right?",
              "No",
              "1 hour is 3600 seconds: $54\\,000 \\div 3600 = 15$ m/s.",
              [["Yes", "How many seconds are in an hour?"]],
            ],
          }),
          faster("20 m/s or 75 km/h?", "75 km/h", ["20 m/s (72 km/h)", "The same"], {
            changed: "A faster car.",
          }),
          faster("20 m/s or 72 km/h?", "The same", ["20 m/s", "72 km/h"], {
            changed: "Exactly 72.",
          }),
          faster("15 m/s or 50 km/h?", "15 m/s (54 km/h)", ["50 km/h", "The same"], {
            changed: "A slower pair.",
          }),
        ],
        "Compare in the same units.",
      ),
      own(RA, UNITS, "Spot the mistake"),

      own(RA, UNITS, "Exit check"),

      reworded(
        RA,
        UNITS,
        "“Cheetah 30 m/s, car 110 km/h. Which is faster?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Convert each part. m/s to km/h: × 3.6. km/h to m/s: ÷ 3.6.**"],
        PER_HOUR,
        [
          "**Convert each part. m/s to km/h: × 3.6. km/h to m/s: ÷ 3.6.**",
          "An hour is 3600 seconds, not 60.",
          "Compare speeds in the same units.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Speed, distance and time.

const SPEED = "gf-rates/speed";
const speedMethod = [
  "Minutes to hours: ÷ 60.",
  "Pick the version for what you want.",
  "km and hours give km/h.",
];
const SDT = steps(
  "\\text{speed} = \\text{distance} \\div \\text{time}",
  "\\text{distance} = \\text{speed} \\times \\text{time}",
  "\\text{time} = \\text{distance} \\div \\text{speed}",
);

const speed = stepped(find(RA, SPEED), {
  method: speedMethod,
  variation: {
    relationship: "speed, distance and time",
    unknowns: ["hours", "time"],
    surface: ["more minutes", "slower", "half the distance"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three versions",
        ["**Speed = distance ÷ time. Rearrange it for distance or time.**"],
        SDT,
        "Minutes to hours: ÷ 60.",
      ),
      reworded(RA, SPEED, "60 km at 40 km/h takes", { tag: "The rule" }),

      ...owned(RA, SPEED, "Warm-up", "Check you remember"),

      methodCard("The method", speedMethod, SDT),
      workedFrom(RA, SPEED),
      calc(
        "Your turn",
        "A car goes 135 km in 1 h 30 min.",
        undefined,
        [
          ["Time in hours:", "1.5", "30 min is half an hour."],
          ["Speed:", "90", "135 ÷ 1.5.", { after: "km/h" }],
        ],
        "90 km/h.",
      ),

      calc(
        "Practise",
        "A walker goes at 6 km/h for 2 h 15 min.",
        undefined,
        [
          ["Time in hours:", "2.25", "15 min is 0.25 h."],
          ["Distance:", "13.5", "6 × 2.25.", { after: "km" }],
        ],
        "13.5 km.",
      ),
      ...owned(RA, SPEED, "Together", "Practise"),
      ...owned(RA, SPEED, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "In hours. Watch what changes.",
        [
          pick("30 min", "0.5 h", ["0.3 h", "3 h"], "÷ 60.", { asks: "hours" }),
          pick("45 min", "0.75 h", ["0.45 h", "0.4 h"], "÷ 60.", {
            asks: "hours",
            changed: "More minutes.",
          }),
          pick("1 h 15 min", "1.25 h", ["1.15 h", "1.5 h"], "1 + 15 ÷ 60.", {
            asks: "hours",
            changed: "Over an hour.",
          }),
          pick("12 min", "0.2 h", ["0.12 h", "1.2 h"], "÷ 60.", {
            asks: "hours",
            changed: "A small part.",
          }),
        ],
        "Minutes ÷ 60, never a decimal point.",
      ),

      questionSet(
        "Variation",
        "Find the time. Watch what changes.",
        [
          pick("90 km at 60 km/h", "1 h 30 min", ["1 h 50 min", "1 h 5 min"], "90 ÷ 60 = 1.5.", {
            asks: "time",
            expect: [
              "Mia says 1.5 hours is 1 h 50 min. Right?",
              "No",
              "0.5 h is half of 60 min: 1 h 30 min.",
              [["Yes", "What is half an hour in minutes?"]],
            ],
          }),
          pick("90 km at 40 km/h", "2 h 15 min", ["2 h 25 min", "2 h 5 min"], "90 ÷ 40 = 2.25.", {
            asks: "time",
            changed: "Slower.",
          }),
          pick("90 km at 120 km/h", "45 min", ["75 min", "1 h 20 min"], "90 ÷ 120 = 0.75.", {
            asks: "time",
            changed: "Faster.",
          }),
          pick("45 km at 60 km/h", "45 min", ["75 min", "1 h 5 min"], "45 ÷ 60 = 0.75.", {
            asks: "time",
            changed: "Half the distance.",
          }),
        ],
        "Hours as a decimal: × 60 for the minutes.",
      ),
      own(RA, SPEED, "Spot the mistake"),

      own(RA, SPEED, "Exit check"),

      reworded(
        RA,
        SPEED,
        "“210 km from 09:40 to 11:25. Work out the average speed.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Speed = distance ÷ time. Rearrange it for distance or time.**"],
        SDT,
        [
          "**Speed = distance ÷ time. Rearrange it for distance or time.**",
          "Minutes to hours: ÷ 60.",
          "0.5 h is 30 min, not 50.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Pay and unit pricing.

const PAY = "gf-rates/pay-pricing";
const payMethod = [
  "Divide: total ÷ hours, or cost ÷ amount.",
  "Put both in the same units.",
  "Less per unit: better value.",
];
const BOTTLES = table(
  ["Bottle", "Cost", "Litres", "Per litre"],
  [
    ["A", "£1.80", "2", "90p"],
    ["B", "£2.50", "3", "83p"],
  ],
);
const JOBS = table(
  ["Job", "Pay"],
  [
    ["A", "£432 for 36 hours"],
    ["B", "£11.75 an hour"],
  ],
);
const value = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Price of one, in each.", { asks: "value", ...extra });

const pay = stepped(find(RA, PAY), {
  method: payMethod,
  variation: {
    relationship: "a rate for one, compared",
    unknowns: ["rate", "value"],
    surface: ["fewer hours", "overtime", "a dearer pack"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Rates to compare",
        ["**Divide to get a rate: pay per hour, or price per unit. Then compare.**"],
        BOTTLES,
        "B is better value: less per litre.",
      ),
      reworded(RA, PAY, "Which pays more per hour?", { tag: "The rule", picture: JOBS }),

      ...owned(RA, PAY, "Warm-up", "Check you remember"),

      methodCard("The method", payMethod, BOTTLES),
      workedFrom(RA, PAY),
      calc(
        "Your turn",
        "Mo earns £276 for 24 hours.",
        undefined,
        [
          ["Per hour: £", "11.50", "276 ÷ 24."],
          ["For 30 hours: £", "345", "11.50 × 30."],
        ],
        "£345.",
      ),

      calc(
        "Practise",
        "Better value: 400 g for £2.80, or 600 g for £3.90?",
        undefined,
        [
          ["400 g pack, per 100 g:", "70", "£2.80 ÷ 4.", { after: "p" }],
          ["600 g pack, per 100 g:", "65", "£3.90 ÷ 6.", { after: "p" }],
        ],
        "The 600 g pack is better value.",
      ),
      ...owned(RA, PAY, "Together", "Practise"),
      ...owned(RA, PAY, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Pay per hour. Watch what changes.",
        [
          pick("£240 for 20 hours", "£12", ["£4800", "£220"], "240 ÷ 20.", { asks: "rate" }),
          pick("£240 for 16 hours", "£15", ["£3840", "£224"], "240 ÷ 16.", {
            asks: "rate",
            changed: "Fewer hours.",
          }),
          pick("£300 for 24 hours", "£12.50", ["£7200", "£276"], "300 ÷ 24.", {
            asks: "rate",
            changed: "A new total.",
          }),
          pick("£10 an hour, at time-and-a-half", "£15", ["£10.50", "£20"], "1.5 × £10.", {
            asks: "rate",
            changed: "Overtime.",
          }),
        ],
        "Pay ÷ hours.",
      ),

      questionSet(
        "Variation",
        "Better value? Watch what changes.",
        [
          value("4 for £3, or 6 for £4.20?", "6 for £4.20", ["4 for £3", "The same"], {
            expect: [
              "75p each against 70p each. Ola picks the 75p one. Right?",
              "No",
              "Less per item is better: 70p each.",
              [["Yes", "Which costs less for one?"]],
            ],
          }),
          value("4 for £3, or 6 for £4.80?", "4 for £3", ["6 for £4.80", "The same"], {
            changed: "A dearer big pack.",
          }),
          value("4 for £3, or 6 for £4.50?", "The same", ["4 for £3", "6 for £4.50"], {
            changed: "75p each.",
          }),
          value("4 for £3, or 8 for £5.60?", "8 for £5.60", ["4 for £3", "The same"], {
            changed: "Eight in a pack.",
          }),
        ],
        "Compare the price of one.",
      ),
      own(RA, PAY, "Spot the mistake"),

      own(RA, PAY, "Exit check"),

      reworded(
        RA,
        PAY,
        "“Job A pays £432 for 36 hours; Job B £11.75 an hour. Which pays more per hour?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Divide to get a rate: pay per hour, or price per unit. Then compare.**"],
        BOTTLES,
        [
          "**Divide to get a rate: pay per hour, or price per unit. Then compare.**",
          "Less per unit is better value.",
          "Time-and-a-half: × 1.5.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Density.

const DENSITY = "gf-rates/density";
const densityMethod = [
  "Density = mass ÷ volume.",
  "Mass = density × volume.",
  "Volume = mass ÷ density.",
];
const DMV = steps(
  "\\text{density} = \\text{mass} \\div \\text{volume}",
  "150 \\text{ g} \\div 50 \\text{ cm}^3 = 3 \\text{ g/cm}^3",
);

const density = stepped(find(RA, DENSITY), {
  method: densityMethod,
  variation: {
    relationship: "mass, volume and density",
    unknowns: ["density", "mass", "volume"],
    surface: ["twice the volume", "find the volume", "denser"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Mass per volume",
        ["**Density = mass ÷ volume.**"],
        DMV,
        "Rearrange it to find a mass or a volume.",
      ),
      reworded(RA, DENSITY, "Mass 240 g, volume 30 cm³. Density", { tag: "The rule" }),

      ...owned(RA, DENSITY, "Warm-up", "Check you remember"),

      methodCard("The method", densityMethod, DMV),
      workedFrom(RA, DENSITY),
      calc(
        "Your turn",
        "A 4 cm cube has mass 128 g.",
        undefined,
        [
          ["Volume:", "64", "4 × 4 × 4.", { after: "cm³" }],
          ["Density:", "2", "128 ÷ 64.", { after: "g/cm³" }],
        ],
        "2 g/cm³.",
      ),

      calc(
        "Practise",
        "Steel is 7.8 g/cm³. A block is 20 cm³.",
        undefined,
        [
          ["Mass:", "156", "7.8 × 20.", { after: "g" }],
          ["In kg:", "0.156", "÷ 1000.", { after: "kg" }],
        ],
        "156 g, or 0.156 kg.",
      ),
      ...owned(RA, DENSITY, "Together", "Practise"),
      ...owned(RA, DENSITY, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find the density. Watch what changes.",
        [
          pick("80 g, 10 cm³", "8 g/cm³", ["800 g/cm³", "0.125 g/cm³"], "80 ÷ 10.", {
            asks: "density",
          }),
          pick("80 g, 20 cm³", "4 g/cm³", ["1600 g/cm³", "0.25 g/cm³"], "80 ÷ 20.", {
            asks: "density",
            changed: "Twice the volume.",
          }),
          pick("160 g, 20 cm³", "8 g/cm³", ["4 g/cm³", "3200 g/cm³"], "160 ÷ 20.", {
            asks: "density",
            changed: "Twice the mass too.",
          }),
          pick("15 g, 20 cm³", "0.75 g/cm³", ["1.33 g/cm³", "300 g/cm³"], "15 ÷ 20.", {
            asks: "density",
            changed: "Lighter than water.",
          }),
        ],
        "Mass ÷ volume, always that way round.",
      ),

      questionSet(
        "Variation",
        "Mass or volume? Watch what changes.",
        [
          pick("0.7 g/cm³, 40 cm³: mass?", "28 g", ["2.8 g", "57 g"], "0.7 × 40.", {
            asks: "mass",
            expect: [
              "Jo works out $0.7 \\times 40 = 2.8$ g. Right?",
              "No",
              "$0.7 \\times 40 = 28$ g.",
              [["Yes", "What is $7 \\times 4$?"]],
            ],
          }),
          pick("0.7 g/cm³, 80 cm³: mass?", "56 g", ["5.6 g", "114 g"], "0.7 × 80.", {
            asks: "mass",
            changed: "Twice the volume.",
          }),
          pick("0.7 g/cm³, 35 g: volume?", "50 cm³", ["24.5 cm³", "0.02 cm³"], "35 ÷ 0.7.", {
            asks: "volume",
            changed: "Find the volume.",
          }),
          pick("2 g/cm³, 35 g: volume?", "17.5 cm³", ["70 cm³", "37 cm³"], "35 ÷ 2.", {
            asks: "volume",
            changed: "Denser.",
          }),
        ],
        "Mass: multiply. Volume: divide.",
      ),
      own(RA, DENSITY, "Spot the mistake"),

      own(RA, DENSITY, "Exit check"),

      reworded(
        RA,
        DENSITY,
        "“1930 g, 2 cm × 5 cm × 10 cm. Work out the density.”",
        { tag: "Real life", title: "A gold bar: 1930 g, 2 cm × 5 cm × 10 cm. Density?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Density = mass ÷ volume.**"],
        DMV,
        ["**Density = mass ÷ volume.**", "Mass = density × volume.", "Volume = mass ÷ density."],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Pressure.

const PRESSURE = "gf-rates/pressure";
const pressureMethod = [
  "Pressure = force ÷ area.",
  "Force = pressure × area.",
  "Area = force ÷ pressure.",
];
const PFA = steps("P = F \\div A", "F = P \\times A", "A = F \\div P");

const pressure = stepped(find(RA, PRESSURE), {
  method: pressureMethod,
  variation: {
    relationship: "force spread over an area",
    unknowns: ["pressure", "force", "area"],
    surface: ["twice the area", "a small area", "find the force"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Force spread over area",
        ["**Pressure = force ÷ area.**"],
        PFA,
        "Same force, more area: less pressure.",
      ),
      reworded(RA, PRESSURE, "Same force, double the area: pressure", { tag: "The rule" }),

      ...owned(RA, PRESSURE, "Warm-up", "Check you remember"),

      methodCard("The method", pressureMethod, PFA),
      workedFrom(RA, PRESSURE),
      calc(
        "Your turn",
        "A 900 N crate sits on 1.5 m².",
        undefined,
        [["Pressure:", "600", "900 ÷ 1.5.", { after: "N/m²" }]],
        "600 N/m².",
      ),

      calc(
        "Practise",
        "A 50 N box gives a pressure of 200 N/m².",
        undefined,
        [["Area:", "0.25", "50 ÷ 200.", { after: "m²" }]],
        "0.25 m².",
      ),
      ...owned(RA, PRESSURE, "Together", "Practise"),
      ...owned(RA, PRESSURE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find the pressure. Watch what changes.",
        [
          pick("120 N on 2 m²", "60 N/m²", ["240 N/m²", "122 N/m²"], "120 ÷ 2.", {
            asks: "pressure",
          }),
          pick("120 N on 4 m²", "30 N/m²", ["480 N/m²", "60 N/m²"], "120 ÷ 4.", {
            asks: "pressure",
            changed: "Twice the area.",
          }),
          pick("240 N on 4 m²", "60 N/m²", ["30 N/m²", "960 N/m²"], "240 ÷ 4.", {
            asks: "pressure",
            changed: "Twice the force too.",
          }),
          pick("120 N on 0.5 m²", "240 N/m²", ["60 N/m²", "120.5 N/m²"], "120 ÷ 0.5.", {
            asks: "pressure",
            changed: "A small area.",
          }),
        ],
        "More area, less pressure.",
      ),

      questionSet(
        "Variation",
        "Find each one. Watch what changes.",
        [
          pick("300 N on 0.5 m²: pressure?", "600 N/m²", ["150 N/m²", "300.5 N/m²"], "300 ÷ 0.5.", {
            asks: "pressure",
            expect: [
              "Ivy works out $300 \\div 0.5 = 150$. Right?",
              "No",
              "Dividing by a half doubles: 600 N/m².",
              [["Yes", "How many halves are in 300?"]],
            ],
          }),
          pick("600 N/m² on 2 m²: force?", "1200 N", ["300 N", "602 N"], "600 × 2.", {
            asks: "force",
            changed: "Find the force.",
          }),
          pick("600 N/m² from 300 N: area?", "0.5 m²", ["2 m²", "180 000 m²"], "300 ÷ 600.", {
            asks: "area",
            changed: "Find the area.",
          }),
          pick("600 N/m² from 1500 N: area?", "2.5 m²", ["0.4 m²", "900 m²"], "1500 ÷ 600.", {
            asks: "area",
            changed: "More force.",
          }),
        ],
        "Force: multiply. Area: divide.",
      ),
      own(RA, PRESSURE, "Spot the mistake"),

      own(RA, PRESSURE, "Exit check"),

      reworded(
        RA,
        PRESSURE,
        "“600 N on boots (0.03 m²) and snowshoes (0.2 m²). Pressures?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Pressure = force ÷ area.**"],
        PFA,
        [
          "**Pressure = force ÷ area.**",
          "Force = pressure × area.",
          "Bigger area, same force: less pressure.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Gradient as a rate of change.

const RATE = "gf-rates/rate-of-change";
const rateMethod = [
  "Pick two points on the line.",
  "Change in $y$ ÷ change in $x$.",
  "Give the units: $y$-units per $x$-unit.",
];
const line = (m: number, c: number, points: Point[], yMax = 12): Picture => ({
  kind: "graph",
  range: { xMin: 0, xMax: 10, yMin: 0, yMax },
  lines: [{ m, c }],
  points,
});
const RIDE = line(2, 0, [
  { x: 0, y: 0 },
  { x: 5, y: 10 },
]);
const means = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "$y$-units per $x$-unit.", { asks: "meaning", ...extra });

const rateOfChange = stepped(find(RA, RATE), {
  method: rateMethod,
  variation: {
    relationship: "a gradient read as a rate",
    unknowns: ["meaning", "rate"],
    surface: ["a cost graph", "a negative gradient", "flat"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Gradient with units",
        ["**The gradient is a rate: change in y ÷ change in x, with units.**"],
        RIDE,
        "On a distance–time graph, the gradient is the speed.",
      ),
      reworded(RA, RATE, "Distance (km) against time (h), gradient 2. It means", {
        tag: "The rule",
      }),

      ...owned(RA, RATE, "Warm-up", "Check you remember"),

      methodCard("The method", rateMethod, RIDE),
      workedOn(RATE, RIDE),
      calc(
        "Your turn",
        "Cost (£) against mass (kg).",
        line(2.5, 0, [
          { x: 0, y: 0 },
          { x: 4, y: 10 },
        ]),
        [
          ["Change in cost: £", "10", "Up from 0 to 10."],
          ["Gradient:", "2.5", "10 ÷ 4.", { after: "£ per kg" }],
        ],
        "£2.50 per kg.",
      ),

      calc(
        "Practise",
        "Water (litres) against time (minutes).",
        line(
          2,
          1,
          [
            { x: 2, y: 5 },
            { x: 6, y: 13 },
          ],
          14,
        ),
        [
          ["Change in litres:", "8", "13 − 5."],
          ["Change in minutes:", "4", "6 − 2."],
          ["Rate:", "2", "8 ÷ 4.", { after: "litres per minute" }],
        ],
        "2 litres per minute.",
      ),
      ...owned(RA, RATE, "Together", "Practise"),
      ...owned(RA, RATE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "What does the gradient mean? Watch what changes.",
        [
          means("Distance (km) against time (h): gradient 50", "50 km per hour", [
            "50 km",
            "50 hours",
          ]),
          means("Cost (£) against mass (kg): gradient 3", "£3 per kg", ["3 kg", "£3"], {
            changed: "A cost graph.",
          }),
          means(
            "Water (litres) against time (min): gradient −4",
            "Emptying, 4 litres a minute",
            ["Filling, 4 litres a minute", "4 litres"],
            { changed: "A negative gradient." },
          ),
          means("Distance against time: gradient 0", "Not moving", ["Very fast", "Going back"], {
            changed: "Flat.",
          }),
        ],
        "A gradient is always “per” something.",
      ),

      questionSet(
        "Variation",
        "Find the rate. Watch what changes.",
        [
          pick(
            "30 litres in 6 minutes",
            "5 litres/min",
            ["0.2 litres/min", "180 litres/min"],
            "30 ÷ 6.",
            {
              asks: "rate",
              expect: [
                "Water rises 30 litres in 6 minutes. Ed does $6 \\div 30$. Right?",
                "No",
                "Litres ÷ minutes: $30 \\div 6 = 5$ litres per minute.",
                [["Yes", "Which goes on top: litres or minutes?"]],
              ],
            },
          ),
          pick(
            "30 litres in 3 minutes",
            "10 litres/min",
            ["0.1 litres/min", "90 litres/min"],
            "30 ÷ 3.",
            {
              asks: "rate",
              changed: "Faster.",
            },
          ),
          pick("45 km in 3 hours", "15 km/h", ["0.07 km/h", "135 km/h"], "45 ÷ 3.", {
            asks: "rate",
            changed: "A journey.",
          }),
          pick("£12 for 8 kg", "£1.50 per kg", ["£0.67 per kg", "£96 per kg"], "12 ÷ 8.", {
            asks: "rate",
            changed: "A price.",
          }),
        ],
        "The $y$ change ÷ the $x$ change.",
      ),
      reworded(
        RA,
        RATE,
        "Where did it go wrong?",
        { text: "Ed's tank fills from 5 to 35 litres in 6 minutes." },
        "Spot the mistake",
      ),

      own(RA, RATE, "Exit check"),

      reworded(
        RA,
        RATE,
        "“Work out the gradient and say what it represents.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**The gradient is a rate: change in y ÷ change in x, with units.**"],
        RIDE,
        [
          "**The gradient is a rate: change in y ÷ change in x, with units.**",
          "Distance–time: the gradient is the speed.",
          "Flat: not changing. Steeper: faster.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfRatesStepped: [string, UnitLesson[]][] = [
  [UNITS, [units]],
  [SPEED, [speed]],
  [PAY, [pay]],
  [DENSITY, [density]],
  [PRESSURE, [pressure]],
  [RATE, [rateOfChange]],
];
