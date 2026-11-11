// GCSE Foundation, "Compound measures and rates", as six short lessons, one just before each
// skill: converting compound units, speed, pay and unit pricing, density, pressure, and the
// gradient as a rate of change. Each recaps the Key Stage 3 idea quickly, builds it to GCSE level,
// names the common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, UnitLesson } from "./types.ts";

const U = "gf-rates";
const triangle = (top: string, left: string, right: string): Picture => ({
  kind: "maths",
  tex: `${top} = ${left} \\times ${right}`,
});
const journey: Picture = {
  kind: "graph",
  range: { xMin: 0, xMax: 6, yMin: 0, yMax: 12 },
  lines: [{ m: 2, c: 0 }],
};

export const gfRates: UnitLesson[] = [
  lesson(
    U,
    "units",
    "GF-R1",
    "Converting compound units",
    "Convert each part: km/h to m/s divides by 3.6.",
    [
      problem("The cheetah", [
        "A cheetah runs at 30 m/s. A car on the motorway goes 110 km/h. “Which is faster? Show your working.”",
        "By the end of this lesson, you can convert compound units both ways.",
      ]),
      typed("Warm-up", "1 hour in seconds", "3600", "$60 \\times 60$.", "3600."),
      typed("Warm-up", "30 m in km", "0.03", "÷ 1000.", "0.03 km."),
      explain(
        "Discover",
        "Convert each part",
        [
          "A compound unit has two parts: m/s is metres **and** seconds. Convert each part separately.",
          "m/s to km/h: × 3600 (per hour), ÷ 1000 (to km): overall **× 3.6**. km/h to m/s: **÷ 3.6**.",
        ],
        {
          kind: "maths",
          tex: "30 \\text{ m/s} = \\frac{30 \\times 3600}{1000} \\text{ km/h} = 108 \\text{ km/h}",
        },
      ),
      choose("Discover", "1 m/s in km/h", "3.6 km/h", "3600 m per hour = 3.6 km.", [
        ["0.36 km/h", "× 3600, ÷ 1000."],
        ["60 km/h", "× 3600 for seconds to hours."],
      ]),
      worked(
        "The cheetah",
        "30 m/s or 110 km/h?",
        [
          ["$30 \\times 3.6 = 108$ km/h", "Convert the cheetah."],
          ["108 < 110: the car is faster", "Compare like with like."],
        ],
        "Only just.",
      ),
      steps(
        "Together",
        "Convert 72 km/h to m/s",
        "Both parts.",
        [
          [
            "72 km per hour is",
            "72 000 m per 3600 s",
            ["72 m per 60 s", "1 km = 1000 m; 1 h = 3600 s."],
            "$72\\,000 \\div 3600$",
          ],
          ["So", "20 m/s", ["259.2 m/s", "Divide: ÷ 3.6."], "20 m/s"],
        ],
        "km/h to m/s: ÷ 3.6.",
      ),
      choose(
        "Together",
        "A density of 2 g/cm³ in kg/m³",
        "2000 kg/m³",
        "× 1 000 000 cm³, ÷ 1000 g.",
        [
          ["0.002 kg/m³", "There are a million cm³ in a m³."],
          ["2 kg/m³", "Convert both parts."],
        ],
      ),
      typed("Your turn", "15 m/s in km/h", "54", "× 3.6.", "54 km/h.", {
        unit: "km/h",
        wrong: [["4.17", "m/s to km/h: × 3.6."]],
      }),
      typed("Your turn", "90 km/h in m/s", "25", "÷ 3.6.", "25 m/s.", { unit: "m/s" }),
      choose(
        "Watch out",
        "Ivy converts 30 m/s to km/h by multiplying by 60. What's wrong?",
        "An hour is 3600 seconds, and m must become km: × 3.6",
        "Both parts.",
        [["Nothing", "× 60 only turns seconds to minutes."]],
      ),
      mistake(
        "Ed converts 54 km/h to m/s.",
        ["54 km = 54 000 m", "1 hour = 60 seconds", "$54\\,000 \\div 60 = 900$ m/s"],
        1,
        "1 hour = 3600 s: $54\\,000 \\div 3600 = 15$ m/s.",
      ),
      choose(
        "Back to the problem",
        "“Cheetah 30 m/s, car 110 km/h. Which is faster?”",
        "The car: the cheetah is 108 km/h",
        "Same units.",
        [
          ["The cheetah", "Convert first: 30 m/s is 108 km/h."],
          ["The same", "108 ≠ 110."],
        ],
      ),
      quiz([
        [
          ["10 m/s in km/h", "36", ["2.78", "600"], "× 3.6."],
          ["25 m/s in km/h", "90", ["6.94", "1500"], "× 3.6."],
        ],
        [
          ["36 km/h in m/s", "10", ["129.6", "0.6"], "÷ 3.6."],
          ["108 km/h in m/s", "30", ["388.8", "1.8"], "÷ 3.6."],
        ],
        [
          ["m/s to km/h:", "× 3.6", ["÷ 3.6", "× 60"], "Faster number."],
          ["km/h to m/s:", "÷ 3.6", ["× 3.6", "÷ 60"], "Smaller number."],
        ],
      ]),
    ],
  ),

  lesson(U, "speed", "GF-R11.a", "Speed, distance and time", "s = d ÷ t, rearranged two ways.", [
    problem("The train timetable", [
      "A train leaves at 09:40 and arrives at 11:25, covering 210 km. “Work out its average speed.”",
      "By the end of this lesson, you can find speed, distance or time from the other two.",
    ]),
    typed("Warm-up", "From 09:40 to 11:25, in minutes", "105", "1 h 45 min.", "105 minutes."),
    typed("Warm-up", "105 minutes in hours", "1.75", "÷ 60.", "1.75 h."),
    explain(
      "Discover",
      "Three versions",
      [
        "**Speed** = distance ÷ time; **distance** = speed × time; **time** = distance ÷ speed.",
        "Keep the units matched: km and hours give km/h. Convert minutes to hours by ÷ 60.",
      ],
      triangle("d", "s", "t"),
    ),
    choose("Discover", "60 km at 40 km/h takes", "1.5 hours", "$60 \\div 40$.", [
      ["2400 hours", "Divide, don't multiply."],
      ["1 h 50 min", "0.5 h is 30 min."],
    ]),
    worked(
      "The train",
      "210 km from 09:40 to 11:25. Average speed?",
      [
        ["Time: 1 h 45 min = 1.75 h", "Decimal hours."],
        ["$210 \\div 1.75 = 120$ km/h", "Distance ÷ time."],
      ],
      "120 km/h.",
    ),
    steps(
      "Together",
      "A cyclist rides at 18 km/h for 2 h 20 min",
      "Distance.",
      [
        [
          "Time in hours:",
          "$2\\frac13$",
          ["2.2", "20 min is a third of an hour."],
          "$2\\frac13$ h",
        ],
        ["Distance:", "42 km", ["39.6 km", "$18 \\times 2\\frac13$."], "42 km"],
      ],
      "Fractions of an hour, not decimals of minutes.",
    ),
    choose(
      "Together",
      "A runner does 5 km in 25 minutes. Speed in km/h",
      "12 km/h",
      "25 min = $\\frac{5}{12}$ h.",
      [
        ["0.2 km/h", "That's km per minute."],
        ["125 km/h", "Divide."],
      ],
    ),
    typed("Your turn", "150 miles in 2.5 hours: speed?", "60", "÷.", "60 mph.", { unit: "mph" }),
    typed(
      "Your turn",
      "At 48 km/h for 45 minutes: distance?",
      "36",
      "$48 \\times 0.75$.",
      "36 km.",
      { unit: "km", wrong: [["2160", "45 minutes is 0.75 h."]] },
    ),
    choose(
      "Watch out",
      "Raj writes 1 h 30 min as 1.3 h. What's the effect?",
      "His answer will be wrong: it's 1.5 h",
      "Minutes are sixtieths.",
      [["None", "1.3 h is 1 h 18 min."]],
    ),
    mistake(
      "Mia finds the time for 90 km at 60 km/h.",
      ["$90 \\div 60 = 1.5$", "1.5 hours", "= 1 h 50 min"],
      2,
      "0.5 h = 30 min: 1 h 30 min.",
    ),
    typed(
      "Back to the problem",
      "“210 km from 09:40 to 11:25. Work out the average speed.”",
      "120",
      "1.75 h.",
      "120 km/h.",
      { unit: "km/h", wrong: [["116.7", "1 h 45 min is 1.75 h, not 1.8."]] },
    ),
    quiz([
      [
        ["100 km in 2 h", "50 km/h", ["200 km/h", "102 km/h"], "÷."],
        ["270 km in 3 h", "90 km/h", ["810 km/h", "273 km/h"], "÷."],
      ],
      [
        ["70 km/h for 30 min", "35 km", ["2100 km", "100 km"], "× 0.5."],
        ["60 km/h for 20 min", "20 km", ["1200 km", "80 km"], "× ⅓."],
      ],
      [
        ["120 km at 80 km/h", "1.5 h", ["9600 h", "40 h"], "÷."],
        ["45 km at 30 km/h", "1.5 h", ["1350 h", "15 h"], "÷."],
      ],
    ]),
  ]),

  lesson(
    U,
    "pay-pricing",
    "GF-R11.b",
    "Pay and unit pricing",
    "Pay per hour, price per unit: divide, compare, multiply.",
    [
      problem("The job offer", [
        "Job A pays £432 for a 36-hour week. Job B pays £11.75 an hour. “Which pays more per hour?” And which pack of cereal is the best buy?",
        "By the end of this lesson, you can compare rates and prices fairly.",
      ]),
      typed("Warm-up", "$432 \\div 36$", "12", "Divide.", "12."),
      typed("Warm-up", "$11.75 \\times 4$", "47", "Times.", "47."),
      explain(
        "Discover",
        "Rates to compare",
        [
          "A **rate of pay** is money per hour: total ÷ hours. A **unit price** is cost per unit: cost ÷ amount.",
          "To compare, put both in the same form: per hour, per 100 g, per litre…",
        ],
        {
          kind: "table",
          head: ["", "Pay", "Hours", "Per hour"],
          rows: [
            ["Job A", "£432", "36", "£12"],
            ["Job B", "—", "—", "£11.75"],
          ],
        },
      ),
      choose("Discover", "Which pays more per hour?", "Job A: £12", "£432 ÷ 36.", [
        ["Job B: £11.75", "£12 beats £11.75."],
      ]),
      worked(
        "Cereal",
        "500 g for £2.40, or 750 g for £3.45?",
        [
          ["$240 \\div 500 = 0.48$p per g", "Small box."],
          ["$345 \\div 750 = 0.46$p per g", "Large box."],
          ["The 750 g box", "Cheaper per gram."],
        ],
        "Compare per gram.",
      ),
      steps(
        "Together",
        "Overtime at time-and-a-half",
        "£12 an hour normally; 5 hours overtime.",
        [
          ["Overtime rate:", "£18", ["£13.50", "$12 \\times 1.5$."], "£18/h"],
          ["Overtime pay:", "£90", ["£60", "$18 \\times 5$."], "£90"],
        ],
        "Time-and-a-half: × 1.5.",
      ),
      choose(
        "Together",
        "Better value: 2 litres for £1.70 or 3 litres for £2.40?",
        "3 litres for £2.40",
        "80p vs 85p per litre.",
        [
          ["2 litres for £1.70", "85p per litre."],
          ["Same", "Divide each."],
        ],
      ),
      typed("Your turn", "£390 for 30 hours: rate per hour?", "13", "÷.", "£13.", {
        wrong: [["11700", "Divide."]],
      }),
      choose(
        "Your turn",
        "Best buy: 6 for £4.20, 10 for £6.50, 15 for £10.05",
        "10 for £6.50",
        "65p vs 70p and 67p.",
        [
          ["6 for £4.20", "70p each."],
          ["15 for £10.05", "67p each."],
        ],
      ),
      choose(
        "Watch out",
        "Sam picks the 500 g box because £2.40 is cheaper than £3.45. What's missing?",
        "Compare per gram: the big box is better value",
        "Cheapest isn't always best value.",
        [["Nothing", "Compare the unit price."]],
      ),
      mistake(
        "Ola compares 4 for £3 and 6 for £4.20.",
        ["£3 ÷ 4 = 75p", "£4.20 ÷ 6 = 70p", "So 4 for £3 is better"],
        2,
        "70p is cheaper each: 6 for £4.20 is better.",
      ),
      choose(
        "Back to the problem",
        "“Job A pays £432 for 36 hours; Job B £11.75 an hour. Which pays more per hour?”",
        "Job A: £12 an hour",
        "£432 ÷ 36.",
        [
          ["Job B", "£11.75 < £12."],
          ["The same", "£12 ≠ £11.75."],
        ],
      ),
      quiz([
        [
          ["£300 for 25 hours: per hour", "£12", ["£7500", "£11"], "÷."],
          ["£255 for 30 hours: per hour", "£8.50", ["£7650", "£9"], "÷."],
        ],
        [
          [
            "Better: 3 for £1.50 or 5 for £2.40?",
            "5 for £2.40",
            ["3 for £1.50", "Same"],
            "48p vs 50p.",
          ],
          [
            "Better: 2 for £3 or 7 for £10.85?",
            "2 for £3",
            ["7 for £10.85", "Same"],
            "£1.50 vs £1.55.",
          ],
        ],
        [
          ["£10/h, double time, 3 hours", "£60", ["£30", "£20"], "£20 × 3."],
          ["£14/h, time-and-a-half, 2 hours", "£42", ["£28", "£21"], "£21 × 2."],
        ],
      ]),
    ],
  ),

  lesson(U, "density", "GF-R11.c", "Density", "Density = mass ÷ volume.", [
    problem(
      "The gold bar",
      [
        "A gold bar is 2 cm by 5 cm by 10 cm and has mass 1930 g. “Work out its density.” Gold is 19.3 g/cm³: is it real?",
        "By the end of this lesson, you can use density to find mass, volume or density.",
      ],
      { kind: "cuboid", w: 10, d: 2, h: 5, labels: ["10 cm", "2 cm", "5 cm"] },
    ),
    typed("Warm-up", "Volume of the bar", "100", "$2 \\times 5 \\times 10$.", "100 cm³.", {
      unit: "cm³",
    }),
    typed("Warm-up", "$1930 \\div 100$", "19.3", "Divide.", "19.3."),
    explain(
      "Discover",
      "Mass per volume",
      [
        "**Density** = mass ÷ volume: grams in each cm³. Rearranged: mass = density × volume; volume = mass ÷ density.",
        "Denser materials are heavier for the same size.",
      ],
      triangle("m", "d", "V"),
    ),
    choose("Discover", "Mass 240 g, volume 30 cm³. Density", "8 g/cm³", "$240 \\div 30$.", [
      ["7200 g/cm³", "Divide."],
      ["0.125 g/cm³", "Mass ÷ volume."],
    ]),
    worked(
      "The gold bar",
      "Mass 1930 g, 2 × 5 × 10 cm. Density?",
      [
        ["Volume: 100 cm³", "Cuboid."],
        ["$1930 \\div 100 = 19.3$ g/cm³", "Mass ÷ volume."],
      ],
      "Matches gold: it's real.",
    ),
    steps(
      "Together",
      "Find a mass",
      "Aluminium 2.7 g/cm³, volume 50 cm³.",
      [
        ["mass =", "density × volume", ["density ÷ volume", "Multiply."], "$2.7 \\times 50$"],
        ["Mass:", "135 g", ["18.5 g", "$2.7 \\times 50$."], "135 g"],
      ],
      "Each cm³ weighs 2.7 g.",
    ),
    choose("Together", "Find a volume: mass 90 g, density 1.5 g/cm³", "60 cm³", "$90 \\div 1.5$.", [
      ["135 cm³", "Divide."],
      ["0.017 cm³", "Mass ÷ density."],
    ]),
    typed("Your turn", "Mass 500 g, volume 250 cm³: density", "2", "÷.", "2 g/cm³.", {
      unit: "g/cm³",
    }),
    typed("Your turn", "Density 8 g/cm³, volume 12 cm³: mass", "96", "×.", "96 g.", { unit: "g" }),
    choose(
      "Watch out",
      "Kai divides volume by mass for density. What's wrong?",
      "Density is mass ÷ volume",
      "g/cm³: grams on top.",
      [["Nothing", "The units tell you: g per cm³."]],
    ),
    mistake(
      "Jo finds the mass of 40 cm³ of oak, density 0.7 g/cm³.",
      ["mass = density × volume", "$0.7 \\times 40$", "= 2.8 g"],
      2,
      "$0.7 \\times 40 = 28$ g.",
    ),
    choose(
      "Back to the problem",
      "“1930 g, 2 cm × 5 cm × 10 cm. Work out the density.”",
      "19.3 g/cm³",
      "$1930 \\div 100$.",
      [
        ["193 g/cm³", "Volume is 100 cm³."],
        ["0.05 g/cm³", "Mass ÷ volume."],
      ],
    ),
    quiz([
      [
        ["Mass 60 g, volume 20 cm³: density", "3 g/cm³", ["1200", "0.33"], "÷."],
        ["Mass 450 g, volume 50 cm³: density", "9 g/cm³", ["22 500", "0.11"], "÷."],
      ],
      [
        ["Density 4, volume 15: mass", "60 g", ["3.75 g", "19 g"], "×."],
        ["Density 0.8, volume 25: mass", "20 g", ["31.25 g", "25.8 g"], "×."],
      ],
      [
        ["Density 5, mass 40: volume", "8 cm³", ["200 cm³", "45 cm³"], "÷."],
        ["Density 2.5, mass 10: volume", "4 cm³", ["25 cm³", "12.5 cm³"], "÷."],
      ],
    ]),
  ]),

  lesson(U, "pressure", "GF-R11.d", "Pressure", "Pressure = force ÷ area.", [
    problem("Snowshoes", [
      "A 600 N walker sinks into snow in boots (area 0.03 m²) but not in snowshoes (0.2 m²). “Work out the pressure in each case.”",
      "By the end of this lesson, you can use pressure, and see why snowshoes work.",
    ]),
    typed("Warm-up", "$600 \\div 0.2$", "3000", "$6000 \\div 2$.", "3000."),
    typed("Warm-up", "$600 \\div 0.03$", "20000", "$60\\,000 \\div 3$.", "20 000."),
    explain(
      "Discover",
      "Force spread over area",
      [
        "**Pressure** = force ÷ area. Force in newtons (N), area in m², pressure in N/m² (or pascals).",
        "The same force on a bigger area gives **less** pressure: that's why snowshoes and wide tyres work.",
      ],
      triangle("F", "P", "A"),
    ),
    choose(
      "Discover",
      "Same force, double the area: pressure",
      "halves",
      "Divide by twice as much.",
      [["doubles", "Bigger area, less pressure."]],
    ),
    worked(
      "Snowshoes",
      "600 N on 0.03 m² and on 0.2 m².",
      [
        ["Boots: $600 \\div 0.03 = 20\\,000$ N/m²", "Small area, big pressure."],
        ["Snowshoes: $600 \\div 0.2 = 3000$ N/m²", "Big area, small pressure."],
      ],
      "Less pressure: the snowshoes don't sink.",
    ),
    steps(
      "Together",
      "Find a force",
      "Pressure 500 N/m², area 4 m².",
      [
        ["force =", "pressure × area", ["pressure ÷ area", "Rearrange."], "$500 \\times 4$"],
        ["Force:", "2000 N", ["125 N", "Multiply."], "2000 N"],
      ],
      "$F = PA$.",
    ),
    choose("Together", "A box exerts 60 N on 0.5 m². Pressure", "120 N/m²", "$60 \\div 0.5$.", [
      ["30 N/m²", "Divide by 0.5: doubles."],
      ["60.5 N/m²", "Divide."],
    ]),
    typed("Your turn", "Force 80 N, area 4 m²: pressure", "20", "÷.", "20 N/m².", { unit: "N/m²" }),
    typed("Your turn", "Pressure 25 N/m², force 100 N: area", "4", "$100 \\div 25$.", "4 m².", {
      unit: "m²",
      wrong: [["2500", "Area = force ÷ pressure."]],
    }),
    choose(
      "Watch out",
      "Ben says a bigger area means more pressure. Is he right?",
      "No: the force spreads out, so pressure falls",
      "Pressure = force ÷ area.",
      [["Yes", "Dividing by more gives less."]],
    ),
    mistake(
      "Ivy finds pressure: 300 N on 0.5 m².",
      ["$P = F \\div A$", "$300 \\div 0.5$", "= 150 N/m²"],
      2,
      "Dividing by 0.5 doubles: 600 N/m².",
    ),
    choose(
      "Back to the problem",
      "“600 N on boots (0.03 m²) and snowshoes (0.2 m²). Pressures?”",
      "20 000 N/m² and 3000 N/m²",
      "Force ÷ area.",
      [
        ["18 N/m² and 120 N/m²", "That multiplies."],
        ["3000 and 20 000", "Boots have the smaller area: bigger pressure."],
      ],
    ),
    quiz([
      [
        ["100 N on 2 m²", "50 N/m²", ["200 N/m²", "98 N/m²"], "÷."],
        ["450 N on 3 m²", "150 N/m²", ["1350 N/m²", "447 N/m²"], "÷."],
      ],
      [
        ["Pressure 40, area 5: force", "200 N", ["8 N", "45 N"], "×."],
        ["Pressure 12, area 0.5: force", "6 N", ["24 N", "12.5 N"], "×."],
      ],
      [
        ["Bigger area, same force: pressure", "smaller", ["bigger", "the same"], "Spread out."],
        ["Units of pressure", "N/m²", ["N × m²", "m²/N"], "Force per area."],
      ],
    ]),
  ]),

  lesson(
    U,
    "rate-of-change",
    "GF-R14",
    "Gradient as a rate of change",
    "On a real graph, the gradient is a rate with units.",
    [
      problem(
        "The distance–time graph",
        [
          "A graph shows a cyclist's distance against time: a straight line through (0, 0) and (5, 10). “Work out the gradient and say what it represents.”",
          "By the end of this lesson, you can read rates of change from graphs.",
        ],
        journey,
      ),
      typed("Warm-up", "$10 \\div 5$", "2", "Divide.", "2."),
      choose("Warm-up", "Speed is", "distance per unit time", "Distance ÷ time.", [
        ["time per unit distance", "Distance on top."],
      ]),
      explain(
        "Discover",
        "Gradient with units",
        [
          "On a real-life graph, the **gradient** = change in $y$ ÷ change in $x$, with **units** of $y$ per unit of $x$.",
          "Distance–time: the gradient is **speed**. Cost–mass: price per kg. Volume–time: rate of flow.",
        ],
        journey,
      ),
      choose(
        "Discover",
        "Distance (km) against time (h), gradient 2. It means",
        "2 km per hour",
        "A speed.",
        [
          ["2 hours", "It's a rate."],
          ["2 km", "Per hour."],
        ],
      ),
      worked(
        "The cyclist",
        "Through (0, 0) and (5, 10): distance in km, time in hours.",
        [
          ["Gradient: $10 \\div 5 = 2$", "Up 10, across 5."],
          ["Represents speed: 2 km/h", "Units of $y$ per $x$."],
        ],
        "A slow cyclist.",
      ),
      steps(
        "Together",
        "A tank empties: 400 litres to 0 in 20 minutes",
        "Rate.",
        [
          ["Gradient:", "−20", ["20", "It's falling."], "−20"],
          [
            "Meaning:",
            "it loses 20 litres per minute",
            ["it lasts 20 minutes", "A rate."],
            "−20 l/min",
          ],
        ],
        "Negative gradient: decreasing.",
      ),
      choose(
        "Together",
        "On a distance–time graph, a horizontal section means",
        "stopped",
        "No distance gained.",
        [["very fast", "Flat: speed 0."]],
      ),
      typed(
        "Your turn",
        "Cost (£) against mass (kg), from (0, 0) to (4, 6). Gradient",
        "1.5",
        "$6 \\div 4$.",
        "1.5: £1.50 per kg.",
      ),
      choose(
        "Your turn",
        "A steeper line on a distance–time graph means",
        "faster",
        "More distance per hour.",
        [["slower", "Steeper: more per unit."]],
      ),
      choose(
        "Watch out",
        "Kim says the gradient 2 on the cyclist's graph means 2 km. What's missing?",
        "It's a rate: 2 km per hour",
        "Give units of $y$ per $x$.",
        [["Nothing", "A gradient compares two quantities."]],
      ),
      mistake(
        "Ed finds a rate: water rises from 5 to 35 litres in 6 minutes.",
        ["Change: 30 litres", "Time: 6 minutes", "Rate: $6 \\div 30 = 0.2$ l/min"],
        2,
        "Rate = 30 ÷ 6 = 5 litres per minute.",
      ),
      choose(
        "Back to the problem",
        "“Work out the gradient and say what it represents.”",
        "2: the cyclist's speed, 2 km per hour",
        "Rate with units.",
        [
          ["2: the distance", "It's a rate."],
          ["0.5: the speed", "Up over across: 10 ÷ 5."],
        ],
        { picture: journey },
      ),
      quiz([
        [
          ["Distance–time gradient is", "speed", ["distance", "time"], "Rate."],
          ["Volume–time gradient is", "rate of flow", ["volume", "time"], "Rate."],
        ],
        [
          ["From (0, 0) to (3, 12), km and h", "4 km/h", ["36 km/h", "0.25 km/h"], "12 ÷ 3."],
          [
            "From (0, 0) to (2, 9), litres and min",
            "4.5 l/min",
            ["18 l/min", "0.22 l/min"],
            "9 ÷ 2.",
          ],
        ],
        [
          ["Flat section on distance–time", "stationary", ["fastest", "returning"], "No change."],
          ["Negative gradient means", "decreasing", ["increasing", "constant"], "Falling."],
        ],
      ]),
    ],
  ),
];
