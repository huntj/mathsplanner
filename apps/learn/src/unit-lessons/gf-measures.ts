// GCSE Foundation, "Measures and units", as three short lessons, one just before each skill:
// standard metric units and time, compound measures, and converting area and volume units. Each
// recaps the Key Stage 3 idea quickly, builds it to GCSE level, names the common mistakes and
// ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-measures";

export const gfMeasures: UnitLesson[] = [
  lesson(U, "units", "GF-N13.a", "Standard units", "Convert metric units, money and time.", [
    problem("The road trip", [
      "A journey is 3.6 km, then 850 m, then 1.2 km. It takes 1 hour 45 minutes. “Find the total distance in metres, and the time in hours as a decimal.”",
      "By the end of this lesson, you can convert any standard unit.",
    ]),
    typed("Warm-up", "3.6 km in metres", "3600", "× 1000.", "3600 m."),
    typed(
      "Warm-up",
      "45 minutes as a fraction of an hour, as a decimal",
      "0.75",
      "$\\frac{45}{60}$.",
      "0.75.",
    ),
    explain(
      "Discover",
      "The conversions",
      [
        "Length: 10 mm = 1 cm, 100 cm = 1 m, 1000 m = 1 km. Mass: 1000 g = 1 kg, 1000 kg = 1 tonne. Capacity: 1000 ml = 1 litre.",
        "Time isn't decimal: 60 minutes = 1 hour, so 1 h 45 min = 1.75 h, not 1.45 h.",
      ],
      {
        kind: "table",
        head: ["Big unit", "Small units"],
        rows: [
          ["1 km", "1000 m"],
          ["1 m", "100 cm"],
          ["1 kg", "1000 g"],
          ["1 litre", "1000 ml"],
        ],
      },
    ),
    choose("Discover", "Big unit to small unit:", "multiply", "More small units fit in.", [
      ["divide", "Small to big: divide."],
    ]),
    worked(
      "The trip",
      "Total distance in metres and time in hours.",
      [
        ["$3600 + 850 + 1200 = 5650$ m", "All in metres."],
        ["1 h 45 min = $1 + \\frac{45}{60} = 1.75$ h", "Minutes ÷ 60."],
      ],
      "Same units before adding.",
    ),
    steps(
      "Together",
      "2.4 hours in hours and minutes",
      "Time.",
      [
        ["0.4 of an hour is", "24 minutes", ["40 minutes", "$0.4 \\times 60$."], "24 min"],
        ["So", "2 h 24 min", ["2 h 40 min", "Decimal hours aren't minutes."], "2 h 24 min"],
      ],
      "Multiply the decimal part by 60.",
    ),
    choose("Together", "Which is greater: 0.35 kg or 400 g?", "400 g", "0.35 kg = 350 g.", [
      ["0.35 kg", "Convert: 350 g."],
    ]),
    typed("Your turn", "4 500 ml in litres", "4.5", "÷ 1000.", "4.5 litres.", {
      wrong: [["45", "÷ 1000, not 100."]],
    }),
    typed(
      "Your turn",
      "3 h 15 min as a decimal of hours",
      "3.25",
      "$\\frac{15}{60} = 0.25$.",
      "3.25 h.",
      { wrong: [["3.15", "15 minutes is a quarter of an hour."]] },
    ),
    choose(
      "Watch out",
      "Jo writes 2 h 30 min as 2.3 hours. What's wrong?",
      "30 minutes is half an hour: 2.5 h",
      "Minutes go up to 60.",
      [["Nothing", "2.3 h is 2 h 18 min."]],
    ),
    mistake(
      "Ali adds 1.5 m and 40 cm.",
      ["Both in cm: 150 + 40", "= 190 cm", "= 19 m"],
      2,
      "190 cm = 1.9 m (÷ 100).",
    ),
    choose(
      "Back to the problem",
      "“3.6 km, 850 m and 1.2 km. Total distance in metres?”",
      "5650 m",
      "3600 + 850 + 1200.",
      [
        ["855.8 m", "Convert km to m first."],
        ["4650 m", "1.2 km = 1200 m."],
      ],
    ),
    quiz([
      [
        ["2.7 kg in grams", "2700", ["270", "27"], "× 1000."],
        ["0.6 litres in ml", "600", ["60", "6000"], "× 1000."],
      ],
      [
        ["450 cm in metres", "4.5", ["45", "0.45"], "÷ 100."],
        ["8 500 m in km", "8.5", ["85", "0.85"], "÷ 1000."],
      ],
      [
        ["1.2 hours in minutes", "72", ["120", "80"], "× 60."],
        ["0.25 hours in minutes", "15", ["25", "40"], "× 60."],
      ],
    ]),
  ]),

  lesson(
    U,
    "compound",
    "GF-N13.b",
    "Compound measures",
    "Speed, density and rates combine two units.",
    [
      problem("Which is faster?", [
        "A cyclist goes 12 km in 40 minutes; a runner 100 m in 12.5 s. “Who is faster? Show your working.” Different units for each.",
        "By the end of this lesson, you can use compound measures and compare them.",
      ]),
      typed(
        "Warm-up",
        "40 minutes as a fraction of an hour",
        "2/3",
        "$\\frac{40}{60}$.",
        "$\\frac23$.",
      ),
      typed("Warm-up", "$12 \\div \\frac23$", "18", "$12 \\times \\frac32$.", "18."),
      explain(
        "Discover",
        "Two units in one",
        [
          "A **compound measure** combines two units: speed (km/h, m/s), density (g/cm³), rate of flow (litres per minute).",
          "Speed = distance ÷ time. To compare, put them in the **same units**.",
        ],
        { kind: "maths", tex: "\\text{speed} = \\frac{\\text{distance}}{\\text{time}}" },
      ),
      choose("Discover", "Which unit is a speed?", "m/s", "Metres per second.", [
        ["g/cm³", "That's density."],
        ["m²", "That's area."],
      ]),
      worked(
        "The cyclist",
        "12 km in 40 minutes. Speed in km/h?",
        [
          ["40 min = $\\frac23$ h", "Convert time."],
          ["$12 \\div \\frac23 = 18$ km/h", "Distance ÷ time."],
        ],
        "18 km/h.",
      ),
      steps(
        "Together",
        "The runner: 100 m in 12.5 s",
        "Compare with 18 km/h.",
        [
          ["Speed in m/s:", "8 m/s", ["1250 m/s", "$100 \\div 12.5$."], "8 m/s"],
          [
            "In km/h: $8 \\times 3600 \\div 1000 =$",
            "28.8 km/h",
            ["8 km/h", "Seconds to hours."],
            "Runner is faster",
          ],
        ],
        "Same units to compare.",
      ),
      choose("Together", "Convert 18 km/h to m/s", "5 m/s", "$18\\,000 \\div 3600$.", [
        ["18 m/s", "Change units."],
        ["64.8 m/s", "Divide by 3.6."],
      ]),
      typed(
        "Your turn",
        "A tap fills 60 litres in 4 minutes. Rate in litres per minute?",
        "15",
        "$60 \\div 4$.",
        "15 litres/min.",
      ),
      typed(
        "Your turn",
        "Speed 50 km/h for 2.5 hours. Distance?",
        "125",
        "Speed × time.",
        "125 km.",
        { unit: "km", wrong: [["20", "Multiply, don't divide."]] },
      ),
      choose(
        "Watch out",
        "Ed divides 12 km by 40 minutes and gets 0.3 km/h. What's wrong?",
        "That's km per minute: × 60 for km/h = 18",
        "Match the units to the answer.",
        [["Nothing", "Units matter: km/min isn't km/h."]],
      ),
      mistake(
        "Mia finds the time to drive 90 km at 60 km/h.",
        ["time = distance ÷ speed", "$90 \\div 60 = 1.5$", "1.5 hours = 1 h 50 min"],
        2,
        "0.5 h is 30 minutes: 1 h 30 min.",
      ),
      choose(
        "Back to the problem",
        "“Cyclist: 12 km in 40 min. Runner: 100 m in 12.5 s. Who is faster?”",
        "The runner: 28.8 km/h beats 18 km/h",
        "Same units.",
        [
          ["The cyclist: 12 km is further", "Compare speeds."],
          ["Same speed", "Convert both to km/h."],
        ],
      ),
      quiz([
        [
          ["150 km in 2 h", "75 km/h", ["300 km/h", "152 km/h"], "÷ 2."],
          ["60 m in 8 s", "7.5 m/s", ["480 m/s", "52 m/s"], "÷ 8."],
        ],
        [
          ["36 km/h in m/s", "10 m/s", ["36 m/s", "129.6 m/s"], "÷ 3.6."],
          ["20 m/s in km/h", "72 km/h", ["20 km/h", "5.6 km/h"], "× 3.6."],
        ],
        [
          ["Time for 45 km at 30 km/h", "1.5 h", ["0.67 h", "1350 h"], "÷ 30."],
          ["Distance: 12 m/s for 5 s", "60 m", ["2.4 m", "17 m"], "× 5."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "area-volume-units",
    "GF-G14",
    "Area and volume units",
    "Square the scale for area units, cube it for volume.",
    [
      problem(
        "Carpet and water",
        [
          "A room is 4 m by 3 m, so its floor is 12 m². The exam asks: “Write 12 m² in cm².” And “How many litres does a 1 m³ tank hold?”",
          "By the end of this lesson, you'll never be caught out by area and volume units.",
        ],
        { kind: "grid", cols: 10, rows: 10, shaded: 100 },
      ),
      typed("Warm-up", "1 m in cm", "100", "× 100.", "100 cm."),
      typed("Warm-up", "Work out $100 \\times 100$", "10000", "Four zeros.", "10 000."),
      explain(
        "Discover",
        "A square metre of little squares",
        [
          "1 m² is a square 100 cm by 100 cm: it holds $100 \\times 100 = 10\\,000$ cm². So 1 m² = 10 000 cm², not 100.",
          "1 m³ is $100 \\times 100 \\times 100 = 1\\,000\\,000$ cm³. And 1000 cm³ = 1 litre, so 1 m³ = 1000 litres.",
        ],
        {
          kind: "table",
          head: ["Length", "Area", "Volume"],
          rows: [
            ["1 m = 100 cm", "1 m² = 10 000 cm²", "1 m³ = 1 000 000 cm³"],
            ["1 cm = 10 mm", "1 cm² = 100 mm²", "1 cm³ = 1000 mm³"],
          ],
        },
      ),
      choose("Discover", "1 cm² in mm²", "100 mm²", "$10 \\times 10$.", [
        ["10 mm²", "Area: square the 10."],
        ["1000 mm²", "That's volume."],
      ]),
      worked(
        "The room",
        "Write 12 m² in cm².",
        [
          ["1 m² = 10 000 cm²", "$100^2$."],
          ["$12 \\times 10\\,000 = 120\\,000$ cm²", "Multiply."],
        ],
        "Or: 400 cm × 300 cm = 120 000 cm².",
      ),
      steps(
        "Together",
        "A tank holds 2.5 m³",
        "How many litres?",
        [
          ["1 m³ =", "1000 litres", ["100 litres", "1 000 000 cm³ ÷ 1000."], "× 1000"],
          ["So", "2500 litres", ["250 litres", "$2.5 \\times 1000$."], "2500 litres"],
        ],
        "1 litre = 1000 cm³.",
      ),
      choose("Together", "50 000 cm² in m²", "5 m²", "÷ 10 000.", [
        ["500 m²", "Divide by 10 000, not 100."],
        ["0.5 m²", "Check: 5 × 10 000 = 50 000."],
      ]),
      typed("Your turn", "3 m² in cm²", "30000", "× 10 000.", "30 000 cm².", {
        wrong: [["300", "Area: × 10 000."]],
      }),
      typed("Your turn", "4 000 cm³ in litres", "4", "÷ 1000.", "4 litres.", {
        wrong: [["40", "1 litre = 1000 cm³."]],
      }),
      choose(
        "Watch out",
        "Raj converts 5 m² to cm² by multiplying by 100. What's wrong?",
        "Area needs × 100², so × 10 000: 50 000 cm²",
        "Square the length factor.",
        [["Nothing", "1 m² is 100 cm by 100 cm."]],
      ),
      mistake(
        "Leah converts 2 m³ to cm³.",
        ["1 m = 100 cm", "1 m³ = $100^2$ = 10 000 cm³", "2 m³ = 20 000 cm³"],
        1,
        "Volume cubes it: $100^3 = 1\\,000\\,000$. So 2 000 000 cm³.",
      ),
      choose("Back to the problem", "“Write 12 m² in cm².”", "120 000 cm²", "× 10 000.", [
        ["1200 cm²", "That's × 100."],
        ["12 000 000 cm²", "That's × 1 000 000 (volume)."],
      ]),
      quiz([
        [
          ["1 m² in cm²", "10 000", ["100", "1000"], "$100^2$."],
          ["1 cm² in mm²", "100", ["10", "1000"], "$10^2$."],
        ],
        [
          ["1 m³ in cm³", "1 000 000", ["1000", "10 000"], "$100^3$."],
          ["1 cm³ in mm³", "1000", ["100", "10"], "$10^3$."],
        ],
        [
          ["6 litres in cm³", "6000", ["600", "60"], "× 1000."],
          ["0.5 m³ in litres", "500", ["50", "5000"], "× 1000."],
        ],
      ]),
    ],
  ),
];
