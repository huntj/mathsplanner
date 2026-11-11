// GCSE Foundation, "Growth and decay", as three short lessons, one just before each skill: repeated
// percentage growth, repeated percentage decay and compound interest. Each recaps the Key Stage 3
// multiplier quickly, builds it to GCSE level, names the common mistakes and ends on an
// exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { Picture, UnitLesson } from "./types.ts";

const U = "gf-growth-decay";

const rabbits: Picture = {
  kind: "table",
  head: ["Year", "0", "1", "2", "3"],
  rows: [["Rabbits", "200", "240", "288", "345.6"]],
};
const car: Picture = {
  kind: "table",
  head: ["Year", "0", "1", "2"],
  rows: [["Value (£)", "12 000", "10 200", "8670"]],
};

export const gfGrowthDecay: UnitLesson[] = [
  lesson(
    U,
    "growth",
    "GF-R16.a",
    "Repeated percentage growth",
    "Multiply by the same multiplier once for each year: × 1.2ⁿ.",
    [
      problem("The rabbit warren", [
        "A warren has 200 rabbits. The number grows by 20% each year. “How many rabbits after 3 years? Give your answer to the nearest whole number.”",
        "By the end of this lesson, you can answer this in one calculation.",
      ]),
      typed("Warm-up", "The multiplier for a 20% increase", "1.2", "100% + 20%.", "1.2."),
      typed("Warm-up", "$200 \\times 1.2$", "240", "Multiply.", "240."),
      explain(
        "Discover",
        "Grow, then grow again",
        [
          "Each year the number is multiplied by 1.2, including the new rabbits. So after 3 years: $200 \\times 1.2 \\times 1.2 \\times 1.2 = 200 \\times 1.2^3$.",
          "In general: **amount = start × multiplierⁿ**, where n is the number of years.",
        ],
        rabbits,
      ),
      choose("Discover", "After 2 years, the rabbits are", "$200 \\times 1.2^2$", "Twice.", [
        ["$200 \\times 1.4$", "Growth compounds: not 20% + 20%."],
        ["$200 \\times 2.4$", "That's 1.2 × 2."],
      ]),
      worked(
        "The warren",
        "200 rabbits, 20% growth, 3 years.",
        [
          ["Multiplier: 1.2", "100% + 20%."],
          ["$200 \\times 1.2^3 = 345.6$", "Calculator."],
          ["About 346 rabbits", "Nearest whole number."],
        ],
        "Use the power key, not three separate steps.",
        rabbits,
      ),
      steps(
        "Together",
        "A town of 5000 grows by 4% a year for 5 years",
        "Use the formula.",
        [
          ["Multiplier:", "1.04", ["1.4", "4% is 0.04."], "1.04"],
          [
            "Population:",
            "$5000 \\times 1.04^5 = 6083$",
            ["$5000 \\times 1.2 = 6000$", "Not 5 × 4%."],
            "About 6083",
          ],
        ],
        "Compounding gives a little more than simple growth.",
      ),
      choose("Together", "Which is the multiplier for 3% growth?", "1.03", "100% + 3%.", [
        ["1.3", "That's 30%."],
        ["0.03", "That's just the 3%."],
      ]),
      typed(
        "Your turn",
        "£500 grows by 10% a year for 2 years. Final amount in £?",
        "605",
        "$500 \\times 1.1^2$.",
        "£605.",
        { unit: "£", wrong: [["600", "That's simple growth: compound it."]] },
      ),
      choose(
        "Your turn",
        "$800 \\times 1.05^{6}$ means",
        "800 growing by 5% for 6 years",
        "Multiplier and power.",
        [
          ["800 growing by 6% for 5 years", "Swapped."],
          ["800 growing by 105%", "That's once, more than doubling."],
        ],
      ),
      choose(
        "Watch out",
        "Raj finds 20% growth for 3 years as 60% growth. What's wrong?",
        "Each year's 20% is of a bigger amount: use $1.2^3$",
        "Compounding.",
        [["Nothing", "$1.2^3 = 1.728$, not 1.6."]],
      ),
      mistake(
        "Ola finds 500 growing by 10% a year for 3 years.",
        ["Multiplier 1.1", "$500 \\times 1.1 \\times 3$", "= 1650"],
        1,
        "It's $500 \\times 1.1^3 = 665.5$: a power, not times 3.",
      ),
      typed(
        "Back to the problem",
        "“How many rabbits after 3 years? Give your answer to the nearest whole number.”",
        "346",
        "$200 \\times 1.2^3 = 345.6$.",
        "346 rabbits.",
        { wrong: [["320", "That's 60% simple growth."]] },
      ),
      quiz([
        [
          ["Multiplier for 15% growth", "1.15", ["0.15", "1.5"], "100% + 15%."],
          ["Multiplier for 8% growth", "1.08", ["1.8", "0.08"], "100% + 8%."],
        ],
        [
          ["£1000 grows 10% a year. After 2 years", "£1210", ["£1200", "£1100"], "$1.1^2 = 1.21$."],
          ["£2000 grows 10% a year. After 2 years", "£2420", ["£2400", "£2200"], "× 1.21."],
        ],
        [
          ["$N \\times 1.3^4$: growth per year", "30%", ["4%", "130%"], "Multiplier 1.3."],
          ["$N \\times 1.07^{10}$: years", "10", ["7", "1.07"], "Power."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "decay",
    "GF-R16.b",
    "Repeated percentage decay",
    "A decrease uses a multiplier less than 1: × 0.85ⁿ.",
    [
      problem("Depreciation", [
        "A car costs £12 000. Its value falls by 15% each year. “Work out its value after 4 years. Show your working.”",
        "By the end of this lesson, you can find the value in one step.",
      ]),
      typed("Warm-up", "The multiplier for a 15% decrease", "0.85", "100% − 15%.", "0.85."),
      typed("Warm-up", "$12\\,000 \\times 0.85$", "10200", "Multiply.", "£10 200."),
      explain(
        "Discover",
        "Shrinking each time",
        [
          "A fall of 15% leaves 85%, so multiply by 0.85 each year: **value = start × 0.85ⁿ**.",
          "It never reaches zero: each year it loses 15% of what's left.",
        ],
        car,
      ),
      choose("Discover", "The multiplier for a 30% decrease is", "0.7", "100% − 30%.", [
        ["0.3", "That's the part lost."],
        ["1.3", "That's an increase."],
      ]),
      worked(
        "The car",
        "£12 000, 15% decrease, 4 years.",
        [
          ["Multiplier: 0.85", "100% − 15%."],
          ["$12\\,000 \\times 0.85^4$", "Four years."],
          ["$= £6264.08$", "To the nearest penny."],
        ],
        "Show the multiplier and power in an exam.",
        car,
      ),
      steps(
        "Together",
        "A medicine: 200 mg, 25% leaves the body each hour",
        "After 3 hours.",
        [
          ["Multiplier:", "0.75", ["0.25", "That's what leaves."], "0.75"],
          [
            "Amount:",
            "$200 \\times 0.75^3 = 84.375$ mg",
            ["$200 \\times 0.25 = 50$", "Not one step of the part lost."],
            "About 84.4 mg",
          ],
        ],
        "Decay: multiplier below 1.",
      ),
      choose(
        "Together",
        "Which shows a 2% decrease for 6 years?",
        "$P \\times 0.98^6$",
        "100% − 2%.",
        [
          ["$P \\times 0.02^6$", "That's what's lost."],
          ["$P \\times 0.88$", "Not 12% once."],
        ],
      ),
      typed(
        "Your turn",
        "A £400 phone loses 20% a year. Value after 2 years in £?",
        "256",
        "$400 \\times 0.8^2$.",
        "£256.",
        { unit: "£", wrong: [["240", "That's 40% off once."]] },
      ),
      choose(
        "Your turn",
        "Will the car's value ever reach £0?",
        "No: it only ever loses 15% of what's left",
        "Decay never hits zero.",
        [["Yes, after about 7 years", "15% × 7 isn't how it works."]],
      ),
      choose(
        "Watch out",
        "Kim uses 0.15 as the multiplier for a 15% decrease. What's wrong?",
        "0.15 keeps only 15%; the multiplier is 0.85",
        "Keep 85%.",
        [["Nothing", "That would drop 85%."]],
      ),
      mistake(
        "Leo finds £12 000 falling 15% a year for 4 years.",
        ["15% × 4 = 60%", "60% of £12 000 = £7200", "Value £4800"],
        0,
        "Decay compounds: $12\\,000 \\times 0.85^4 = £6264.08$.",
      ),
      typed(
        "Back to the problem",
        "“Work out its value after 4 years. Give your answer to the nearest pound.”",
        "6264",
        "$12\\,000 \\times 0.85^4$.",
        "£6264.",
        { unit: "£", wrong: [["4800", "That's 60% off once."]] },
      ),
      quiz([
        [
          ["Multiplier for 10% decrease", "0.9", ["0.1", "1.1"], "Keep 90%."],
          ["Multiplier for 35% decrease", "0.65", ["0.35", "1.35"], "Keep 65%."],
        ],
        [
          ["£1000 loses 10% a year. After 2 years", "£810", ["£800", "£900"], "$0.9^2 = 0.81$."],
          ["£500 loses 50% a year. After 3 years", "£62.50", ["£0", "£250"], "$0.5^3 = 0.125$."],
        ],
        [
          [
            "$V \\times 0.96^5$ means a yearly",
            "4% decrease",
            ["96% decrease", "5% decrease"],
            "Keep 96%.",
          ],
          [
            "$V \\times 0.8^3$ means a yearly",
            "20% decrease",
            ["80% decrease", "3% decrease"],
            "Keep 80%.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "compound-interest",
    "GF-R16.c",
    "Compound interest",
    "Interest is paid on the interest too; compare it with simple interest.",
    [
      problem("Two savings accounts", [
        "Account A: 3% simple interest. Account B: 2.8% compound interest. You invest £2000 for 5 years. “Which account pays more? Show your working.”",
        "By the end of this lesson, you can compare accounts like these.",
      ]),
      typed("Warm-up", "3% of £2000 in £", "60", "$0.03 \\times 2000$.", "£60."),
      typed("Warm-up", "The multiplier for 2.8% growth", "1.028", "100% + 2.8%.", "1.028."),
      explain("Discover", "Simple vs compound", [
        "**Simple interest**: the same amount each year, worked out on the original sum. **Compound interest**: each year's interest is added on, so the next year's is bigger.",
        "Compound: **amount = P × (1 + r/100)ⁿ**. The interest earned is the amount minus the original.",
      ]),
      choose(
        "Discover",
        "£1000 at 5% simple interest for 3 years earns",
        "£150",
        "£50 each year.",
        [
          ["£157.63", "That's compound."],
          ["£50", "That's one year."],
        ],
      ),
      worked(
        "Account B",
        "£2000 at 2.8% compound for 5 years.",
        [
          ["$2000 \\times 1.028^5$", "Multiplier and power."],
          ["$= £2296.13$", "Nearest penny."],
        ],
        "Interest: £296.13.",
      ),
      steps(
        "Together",
        "Account A: 3% simple for 5 years",
        "Compare.",
        [
          ["Interest each year:", "£60", ["£300", "That's 5 years."], "£60"],
          ["Total after 5 years:", "£2300", ["£2060", "Five lots of £60."], "£2300"],
        ],
        "A: £2300. B: £2296.13. So A pays more, just.",
      ),
      choose(
        "Together",
        "Over 30 years, which would pay more?",
        "B, compound",
        "Compounding grows faster in the long run.",
        [["A, simple", "Simple only adds £60 a year."]],
      ),
      typed(
        "Your turn",
        "£5000 at 2% compound for 3 years. Total to the nearest penny?",
        "5306.04",
        "$5000 \\times 1.02^3$.",
        "£5306.04.",
        { unit: "£", wrong: [["5300", "That's simple interest."]] },
      ),
      typed(
        "Your turn",
        "How much interest is that, to the nearest penny?",
        "306.04",
        "Total − £5000.",
        "£306.04.",
        { unit: "£" },
      ),
      choose(
        "Watch out",
        "Zoe gives the compound total when asked for the interest. What's wrong?",
        "Interest is total − original",
        "Read the question.",
        [["Nothing", "The total includes the original sum."]],
      ),
      mistake(
        "Ben works out £2000 at 4% compound for 2 years.",
        ["Interest each year: £80", "Two years: £160", "Total £2160"],
        1,
        "Year 2's interest is on £2080: £83.20. Total £2163.20.",
      ),
      choose(
        "Back to the problem",
        "“Which account pays more over 5 years?”",
        "A: £2300 vs £2296.13",
        "Just.",
        [
          ["B: compound is always better", "Not with a lower rate over 5 years."],
          ["They're the same", "£3.87 apart."],
        ],
      ),
      quiz([
        [
          ["£1000 at 10% compound, 2 years: total", "£1210", ["£1200", "£1100"], "$1.1^2$."],
          ["£1000 at 10% simple, 2 years: total", "£1200", ["£1210", "£1100"], "£100 a year."],
        ],
        [
          [
            "£400 at 5% compound, 2 years: interest",
            "£41",
            ["£40", "£441"],
            "$400 \\times 1.05^2 - 400$.",
          ],
          [
            "£800 at 5% compound, 2 years: interest",
            "£82",
            ["£80", "£882"],
            "$800 \\times 1.1025 - 800$.",
          ],
        ],
        [
          [
            "Compound interest is paid on",
            "the original and earlier interest",
            ["the original only", "the interest only"],
            "Grows on itself.",
          ],
          [
            "Simple interest is paid on",
            "the original only",
            ["earlier interest too", "nothing"],
            "Same each year.",
          ],
        ],
      ]),
    ],
  ),
];
