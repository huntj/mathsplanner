// GCSE Foundation, "Percentages", as four short lessons, one just before each skill: percentage
// change, percentages over 100%, reverse percentages, and simple interest. Each recaps the Key
// Stage 3 idea quickly, builds it to GCSE level, names the common mistakes and ends on an
// exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-percentages";

export const gfPercentages: UnitLesson[] = [
  lesson(U, "change", "GF-R9.a", "Percentage change", "Change ÷ original × 100.", [
    problem("The price rise", [
      "A season ticket rose from £480 to £516. A car's value fell from £12 000 to £9 000. “Work out the percentage change in each.”",
      "By the end of this lesson, you can find any percentage increase or decrease.",
    ]),
    typed("Warm-up", "$516 - 480$", "36", "Subtract.", "36."),
    typed("Warm-up", "$36 \\div 480$ as a decimal", "0.075", "Divide.", "0.075."),
    explain(
      "Discover",
      "Compare with the original",
      [
        "**Percentage change** = $\\frac{\\text{change}}{\\text{original}} \\times 100$. Always divide by the **original** amount, the one before the change.",
        "Say whether it's an increase or a decrease.",
      ],
      { kind: "maths", tex: "\\frac{36}{480} \\times 100 = 7.5\\%" },
    ),
    choose("Discover", "From £40 to £50: percentage increase", "25%", "$\\frac{10}{40}$.", [
      ["20%", "Divide by the original, 40."],
      ["10%", "£10 is the change, not the percentage."],
    ]),
    worked(
      "The ticket",
      "£480 to £516. Percentage change?",
      [
        ["Change: £36", "$516 - 480$."],
        ["$\\frac{36}{480} \\times 100 = 7.5\\%$", "Over the original."],
      ],
      "A 7.5% increase.",
    ),
    steps(
      "Together",
      "The car: £12 000 to £9 000",
      "Percentage change.",
      [
        ["Change:", "£3 000 down", ["£9 000", "That's the new value."], "−3000"],
        [
          "Percentage:",
          "25% decrease",
          ["33.3% decrease", "Divide by the original, 12 000."],
          "25% decrease",
        ],
      ],
      "$\\frac{3000}{12000} = 0.25$.",
    ),
    choose(
      "Together",
      "A shop's profit went from £2 000 to £2 300",
      "15% increase",
      "$\\frac{300}{2000}$.",
      [
        ["13% increase", "Divide by 2000."],
        ["300% increase", "300 is the change in pounds."],
      ],
    ),
    typed(
      "Your turn",
      "From 80 kg to 68 kg: percentage decrease",
      "15",
      "$\\frac{12}{80}$.",
      "15%.",
      { unit: "%", wrong: [["17.6", "Divide by the original, 80."]] },
    ),
    typed("Your turn", "From 250 to 290: percentage increase", "16", "$\\frac{40}{250}$.", "16%.", {
      unit: "%",
      wrong: [["13.8", "Divide by 250."]],
    }),
    choose(
      "Watch out",
      "From 20 to 25, Ed divides 5 by 25 and gets 20%. What's wrong?",
      "Divide by the original, 20: 25%",
      "The original is the starting value.",
      [["Nothing", "25 is the new value."]],
    ),
    mistake(
      "Mia finds the percentage decrease from 60 to 45.",
      ["Change: 15", "$\\frac{15}{45} \\times 100$", "= 33.3%"],
      1,
      "Divide by the original: $\\frac{15}{60} = 25\\%$.",
    ),
    choose(
      "Back to the problem",
      "“£480 rose to £516. Work out the percentage increase.”",
      "7.5%",
      "$\\frac{36}{480} \\times 100$.",
      [
        ["7.0%", "Divide by 480: 0.075."],
        ["36%", "£36 is the change, not the percentage."],
      ],
    ),
    quiz([
      [
        ["From 50 to 60", "20% increase", ["10% increase", "16.7% increase"], "$\\frac{10}{50}$."],
        ["From 200 to 230", "15% increase", ["30% increase", "13% increase"], "$\\frac{30}{200}$."],
      ],
      [
        ["From 80 to 60", "25% decrease", ["20% decrease", "33% decrease"], "$\\frac{20}{80}$."],
        ["From 150 to 120", "20% decrease", ["30% decrease", "25% decrease"], "$\\frac{30}{150}$."],
      ],
      [
        [
          "Percentage change divides by",
          "the original",
          ["the new value", "the change"],
          "Starting value.",
        ],
        ["From 40 to 40", "0%", ["100%", "40%"], "No change."],
      ],
    ]),
  ]),

  lesson(
    U,
    "over-100",
    "GF-R9.b",
    "Percentages over 100%",
    "Over 100% means more than the whole: a multiplier above 1.",
    [
      problem("Bigger than the whole", [
        "A house bought for £150 000 is now worth 160% of that. A plant grew to 250% of its height. “Find the new values.” How can it be more than 100%?",
        "By the end of this lesson, percentages over 100% will make sense, and be easy to use.",
      ]),
      typed("Warm-up", "$150\\,000 \\times 1.6$", "240000", "$150\\,000 + 90\\,000$.", "240 000."),
      typed("Warm-up", "200% as a decimal", "2", "Divide by 100.", "2."),
      explain(
        "Discover",
        "More than all of it",
        [
          "100% is the whole amount. 160% is the whole plus 60% more: a multiplier of **1.6**.",
          "250% is two and a half times as much: × 2.5. A 150% **increase** gives 250% of the original.",
        ],
        {
          kind: "bars",
          rows: [
            { label: "Then", parts: 10 },
            { label: "Now", parts: 16 },
          ],
        },
      ),
      choose("Discover", "160% of £150 000", "£240 000", "× 1.6.", [
        ["£90 000", "That's 60%."],
        ["£150 160", "Multiply by 1.6."],
      ]),
      worked(
        "The house",
        "Worth 160% of £150 000.",
        [
          ["Multiplier 1.6", "160%."],
          ["$150\\,000 \\times 1.6 = £240\\,000$", "Multiply."],
        ],
        "A 60% increase.",
      ),
      steps(
        "Together",
        "The plant: 12 cm grows to 250% of its height",
        "New height.",
        [
          ["Multiplier:", "2.5", ["0.25", "250% = 2.5."], "× 2.5"],
          ["New height:", "30 cm", ["3 cm", "$12 \\times 2.5$."], "30 cm"],
        ],
        "2½ times as tall.",
      ),
      choose("Together", "A 150% increase on £40", "£100", "250% of 40.", [
        ["£60", "That's 150% of 40."],
        ["£190", "Multiply by 2.5."],
      ]),
      typed("Your turn", "Find 300% of 45", "135", "× 3.", "135.", {
        wrong: [["48", "300% is three times."]],
      }),
      typed("Your turn", "Increase 60 by 120%", "132", "× 2.2.", "132.", {
        wrong: [["72", "That's 120% of 60."]],
      }),
      choose(
        "Watch out",
        "Ivy says a 100% increase doubles the amount, and 200% of it doubles it too. Is that right?",
        "Yes: both make it twice as big",
        "100% increase → 200% of the original.",
        [["No: they're different", "Both give twice the original."]],
      ),
      mistake(
        "Kai finds a 50% increase on 80, then calls it 50% of 80.",
        ["50% of 80 is 40", "So the new value is 40", "Done"],
        1,
        "An increase adds it on: $80 + 40 = 120$ (150%).",
      ),
      choose(
        "Back to the problem",
        "“A house bought for £150 000 is worth 160% of that now. Find its value.”",
        "£240 000",
        "× 1.6.",
        [
          ["£90 000", "That's only 60%."],
          ["£96 000", "Multiply by 1.6."],
        ],
      ),
      quiz([
        [
          ["200% of 35", "70", ["37", "17.5"], "× 2."],
          ["150% of 40", "60", ["20", "190"], "× 1.5."],
        ],
        [
          ["Multiplier for 175%", "1.75", ["0.75", "17.5"], "÷ 100."],
          ["Multiplier for a 75% increase", "1.75", ["0.75", "0.25"], "175%."],
        ],
        [
          ["Increase 20 by 200%", "60", ["40", "220"], "× 3."],
          ["Increase 50 by 100%", "100", ["150", "51"], "× 2."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "reverse",
    "GF-R9.c",
    "Reverse percentages",
    "Find the original: divide by the multiplier.",
    [
      problem(
        "Before the sale",
        [
          "A coat costs £42 after 30% off. A phone is £270 including 20% VAT. “Find the original prices.”",
          "Most people add 30% back on, and get it wrong. By the end of this lesson, you'll know why, and get it right.",
        ],
        {
          kind: "bars",
          rows: [
            { label: "Before", parts: 10, each: "?" },
            { label: "Sale", parts: 7, each: "?" },
          ],
        },
      ),
      typed("Warm-up", "$42 \\div 0.7$", "60", "$420 \\div 7$.", "60."),
      typed("Warm-up", "$270 \\div 1.2$", "225", "$2700 \\div 12$.", "225."),
      explain(
        "Discover",
        "The new amount isn't 100%",
        [
          "After 30% off, £42 is **70%** of the original. Divide by the multiplier 0.7 to get back to 100%.",
          "With 20% VAT, £270 is **120%** of the price before VAT: divide by 1.2.",
        ],
        { kind: "maths", tex: "\\text{original} = \\frac{\\text{new}}{\\text{multiplier}}" },
      ),
      choose(
        "Discover",
        "After a 25% rise, a price is £50. It's what percentage of the original?",
        "125%",
        "100% + 25%.",
        [
          ["75%", "It went up."],
          ["100%", "It changed."],
        ],
      ),
      worked(
        "The coat",
        "£42 after 30% off. Original price?",
        [
          ["£42 is 70%", "100% − 30%."],
          ["$42 \\div 0.7 = £60$", "Divide by the multiplier."],
        ],
        "Check: 30% of £60 is £18, and $60 - 18 = 42$ ✓",
      ),
      steps(
        "Together",
        "The phone: £270 including 20% VAT",
        "Price before VAT.",
        [
          ["£270 is", "120%", ["80%", "VAT adds 20%."], "× 1.2 gave 270"],
          [
            "Before VAT:",
            "£225",
            ["£216", "Taking 20% of £270 uses the wrong whole."],
            "$270 \\div 1.2$",
          ],
        ],
        "Check: $225 \\times 1.2 = 270$ ✓",
      ),
      steps(
        "Together",
        "With 1%",
        "A wage rose 4% to £520. Original?",
        [
          ["£520 is 104%, so 1% is", "£5", ["£5.20", "Divide by 104."], "1% = £5"],
          ["100% is", "£500", ["£499.20", "That takes 4% of £520."], "£500"],
        ],
        "Find 1%, then 100%.",
      ),
      typed(
        "Your turn",
        "After 15% off, a TV costs £340. Original?",
        "400",
        "£340 is 85%.",
        "£400.",
        { wrong: [["391", "That adds 15% of 340."]] },
      ),
      typed(
        "Your turn",
        "After a 10% rise, rent is £660. Original?",
        "600",
        "£660 is 110%.",
        "£600.",
        { wrong: [["594", "That takes 10% of 660."]] },
      ),
      choose(
        "Watch out",
        "After 30% off, the coat is £42. Mo adds 30% back: £54.60. Is that right?",
        "No: the 30% was of the original; £42 ÷ 0.7 = £60",
        "30% of £42 is less than 30% of the original.",
        [["Yes", "Check: 30% off £54.60 is £38.22."]],
      ),
      mistake(
        "Ivy finds the price before VAT: £96 with 20% VAT.",
        ["£96 is 120%", "20% of £96 = £19.20", "$96 - 19.20 = £76.80$"],
        1,
        "The 20% is of the price before VAT: $96 \\div 1.2 = £80$.",
      ),
      choose(
        "Back to the problem",
        "“A coat costs £42 after a 30% reduction. Work out the original price.”",
        "£60",
        "$42 \\div 0.7$.",
        [
          ["£54.60", "Adding 30% of 42 uses the wrong whole."],
          ["£29.40", "That's another 30% off."],
        ],
      ),
      quiz([
        [
          ["After 20% off: £48. Original", "£60", ["£57.60", "£38.40"], "÷ 0.8."],
          ["After 40% off: £30. Original", "£50", ["£42", "£75"], "÷ 0.6."],
        ],
        [
          ["After a 25% rise: £75. Original", "£60", ["£56.25", "£93.75"], "÷ 1.25."],
          ["After a 5% rise: £210. Original", "£200", ["£199.50", "£220.50"], "÷ 1.05."],
        ],
        [
          ["£144 including 20% VAT. Before VAT", "£120", ["£115.20", "£172.80"], "÷ 1.2."],
          ["£60 including 20% VAT. Before VAT", "£50", ["£48", "£72"], "÷ 1.2."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "simple-interest",
    "GF-R9.d",
    "Simple interest",
    "The same interest every year, on the amount first invested.",
    [
      problem("Saving up", [
        "£2 500 is invested at 3% simple interest a year. “How much interest after 4 years?” and “How long until it earns £450?”",
        "By the end of this lesson, you can work out simple interest, and work backwards.",
      ]),
      typed("Warm-up", "3% of £2 500", "75", "1% is 25.", "£75."),
      typed("Warm-up", "$75 \\times 4$", "300", "Times.", "300."),
      explain(
        "Discover",
        "Same every year",
        [
          "**Simple interest** is a fixed percentage of the **original** amount, paid each year. It doesn't grow.",
          "Total interest = interest for one year × number of years.",
        ],
        {
          kind: "table",
          head: ["Year", "Interest", "Total"],
          rows: [
            ["1", "£75", "£2575"],
            ["2", "£75", "£2650"],
            ["3", "£75", "£2725"],
          ],
        },
      ),
      choose("Discover", "£400 at 5% simple interest: interest each year", "£20", "5% of 400.", [
        ["£5", "5% of 400, not 5."],
        ["£420", "That's the total after a year."],
      ]),
      worked(
        "4 years",
        "£2 500 at 3% for 4 years. Interest?",
        [
          ["One year: £75", "3% of 2500."],
          ["Four years: $4 \\times 75 = £300$", "Same each year."],
        ],
        "Total in the account: £2 800.",
      ),
      steps(
        "Together",
        "How long to earn £450?",
        "£75 a year.",
        [
          [
            "Years:",
            "$450 \\div 75$",
            ["$450 \\times 75$", "Divide total by one year's interest."],
            "6",
          ],
          ["So", "6 years", ["4 years", "$450 \\div 75 = 6$."], "6 years"],
        ],
        "Work backwards by dividing.",
      ),
      steps(
        "Together",
        "£800 earned £96 in 3 years. Rate?",
        "Find the yearly rate.",
        [
          ["Interest per year:", "£32", ["£288", "$96 \\div 3$."], "£32"],
          ["As a percentage of £800:", "4%", ["32%", "$\\frac{32}{800}$."], "4%"],
        ],
        "Rate = yearly interest ÷ original.",
      ),
      typed(
        "Your turn",
        "£1 200 at 2% simple interest for 5 years: interest?",
        "120",
        "£24 a year.",
        "£120.",
        { wrong: [["24", "That's one year."]] },
      ),
      typed(
        "Your turn",
        "£600 at 4% simple interest: total after 3 years?",
        "672",
        "£24 a year; 3 years: £72.",
        "£672.",
        { wrong: [["72", "Add it to the £600."]] },
      ),
      choose(
        "Watch out",
        "Ben works out year 2's interest on £2 575. Is that simple interest?",
        "No: simple interest is always on the original £2 500",
        "That would be compound interest.",
        [["Yes", "Simple interest doesn't grow."]],
      ),
      mistake(
        "Ola finds the interest on £900 at 3% for 6 years.",
        ["One year: 3% of 900 = £27", "6 years: $27 + 6 = £33$", "Interest: £33"],
        1,
        "Multiply: $27 \\times 6 = £162$.",
      ),
      choose(
        "Back to the problem",
        "“£2 500 at 3% simple interest. How long until it earns £450?”",
        "6 years",
        "$450 \\div 75$.",
        [
          ["4 years", "That earns £300."],
          ["15 years", "£75 a year, not £30."],
        ],
      ),
      quiz([
        [
          ["£500 at 4% for 3 years: interest", "£60", ["£20", "£560"], "£20 a year."],
          ["£300 at 5% for 4 years: interest", "£60", ["£15", "£360"], "£15 a year."],
        ],
        [
          ["£1000 at 2% for 5 years: total", "£1100", ["£100", "£1020"], "£100 interest."],
          ["£2000 at 3% for 2 years: total", "£2120", ["£120", "£2060"], "£120 interest."],
        ],
        [
          ["£400 earns £60 in 5 years. Rate", "3%", ["12%", "15%"], "£12 a year."],
          ["£500 earns £100 in 4 years. Rate", "5%", ["20%", "25%"], "£25 a year."],
        ],
      ]),
    ],
  ),
];
