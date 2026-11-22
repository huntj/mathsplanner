// GCSE Foundation, "Percentages", on the stepped template (docs/proposals/lesson-stepped.md):
// percentage change, percentages over 100%, reverse percentages and simple interest. Before and
// after are drawn as bars of equal parts; the rest is number work.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfPercentages } from "./gf-percentages.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const PC = gfPercentages;
const NUMBER = "A number check: the numbers are the picture.";
const bars = (rows: [string, number][]): Picture => ({
  kind: "bars",
  rows: rows.map(([label, parts]) => ({ label, parts })),
});
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Percentage change.

const CHANGE = "gf-percentages/change";
const changeMethod = [
  "Find the change: new − original.",
  "Divide by the original.",
  "× 100. Say increase or decrease.",
];
const RISE = bars([
  ["Before", 4],
  ["After", 5],
]);

const change = stepped(find(PC, CHANGE), {
  method: changeMethod,
  variation: {
    relationship: "change over the original, as a percentage",
    unknowns: ["percent"],
    surface: ["increases", "decreases", "doubling"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Compare with the original",
        ["**Percentage change = change ÷ original × 100.**"],
        RISE,
        "£60 to £75: £15 ÷ £60 = 25%.",
      ),
      reworded(PC, CHANGE, "From £40 to £50: percentage increase", { tag: "The rule" }),

      ...owned(PC, CHANGE, "Warm-up", "Check you remember"),

      methodCard("The method", changeMethod, RISE),
      workedFrom(PC, CHANGE),
      calc(
        "Your turn",
        "From £320 to £368.",
        undefined,
        [
          ["Change:", "48", "368 − 320.", { after: "£" }],
          ["$48 \\div 320 \\times 100 =$", "15", "Over the original.", { after: "%" }],
        ],
        "A 15% increase.",
      ),

      calc(
        "Practise",
        "From 75 kg to 63 kg.",
        undefined,
        [
          ["Change:", "12", "75 − 63.", { after: "kg" }],
          ["$12 \\div 75 \\times 100 =$", "16", "Over the original.", { after: "%" }],
        ],
        "A 16% decrease.",
      ),
      ...owned(PC, CHANGE, "Together", "Practise"),
      ...owned(PC, CHANGE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The percentage change? Watch what changes.",
        [
          ask("£40 to £46", "15", "6 ÷ 40.", "15% up.", { asks: "percent", unit: "%" }),
          ask("£40 to £34", "15", "6 ÷ 40.", "15% down.", {
            asks: "percent",
            unit: "%",
            changed: "Down.",
          }),
          ask("£40 to £80", "100", "40 ÷ 40.", "100% up.", {
            asks: "percent",
            unit: "%",
            changed: "Doubled.",
          }),
          ask("£40 to £40.80", "2", "0.8 ÷ 40.", "2% up.", {
            asks: "percent",
            unit: "%",
            changed: "A small change.",
          }),
        ],
        "Always over the original.",
      ),

      questionSet(
        "Variation",
        "The percentage change? Watch what changes.",
        [
          ask("60 down to 45", "25", "15 ÷ 60.", "25% down.", {
            asks: "percent",
            unit: "%",
            expect: [
              "For 60 down to 45, Kat divides 15 by 45. Right?",
              "No",
              "Divide by the original, 60: 25%.",
              [["Yes", "Which came first?"]],
            ],
          }),
          ask("45 up to 60", ["33.3", "33.33"], "15 ÷ 45.", "33.3% up.", {
            asks: "percent",
            unit: "%",
            changed: "Swapped.",
          }),
          ask("60 down to 30", "50", "30 ÷ 60.", "50% down.", {
            asks: "percent",
            unit: "%",
            changed: "Halved.",
          }),
          ask("60 up to 90", "50", "30 ÷ 60.", "50% up.", {
            asks: "percent",
            unit: "%",
            changed: "Up.",
          }),
        ],
        "The same change can be a different percentage.",
      ),
      own(PC, CHANGE, "Spot the mistake"),

      own(PC, CHANGE, "Exit check"),

      reworded(
        PC,
        CHANGE,
        "“£480 rose to £516. Work out the percentage increase.”",
        { tag: "Real life", title: "£480 rose to £516. The percentage increase?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Percentage change = change ÷ original × 100.**"],
        RISE,
        [
          "**Percentage change = change ÷ original × 100.**",
          "20 to 25 is 25%, not 20%.",
          "Say if it's an increase or a decrease.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Percentages over 100%.

const OVER = "gf-percentages/over-100";
const overMethod = [
  "Write the percentage as a multiplier: ÷ 100.",
  "An increase of p%: add it to 100% first.",
  "Multiply.",
];
const MORE = bars([
  ["100%", 4],
  ["150%", 6],
]);

const over100 = stepped(find(PC, OVER), {
  method: overMethod,
  variation: {
    relationship: "percentages of and increases by more than 100%",
    unknowns: ["amount"],
    surface: ["of or increase by", "under 100%", "over 100%"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "More than all of it",
        ["**Over 100% is more than the whole: a multiplier above 1.**"],
        MORE,
        "150% of 40 is 60: × 1.5.",
      ),

      ...owned(PC, OVER, "Warm-up", "Check you remember"),

      methodCard("The method", overMethod, MORE),
      workedFrom(PC, OVER),
      calc(
        "Your turn",
        "Find 240% of 35.",
        undefined,
        [
          ["Multiplier:", "2.4", "240 ÷ 100."],
          ["$35 \\times 2.4 =$", "84", "Multiply."],
        ],
        "84.",
      ),

      calc(
        "Practise",
        "Increase 50 by 130%.",
        undefined,
        [
          ["Multiplier:", "2.3", "100% + 130% = 230%."],
          ["$50 \\times 2.3 =$", "115", "Multiply."],
        ],
        "115.",
      ),
      ...owned(PC, OVER, "Together", "Practise"),
      ...owned(PC, OVER, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Work it out. Watch what changes.",
        [
          ask("120% of 50", "60", "× 1.2.", "60.", { asks: "amount" }),
          ask("220% of 50", "110", "× 2.2.", "110.", { asks: "amount", changed: "More." }),
          ask("Increase 50 by 120%", "110", "× 2.2.", "110.", {
            asks: "amount",
            changed: "An increase.",
          }),
          ask("Increase 50 by 20%", "60", "× 1.2.", "60.", { asks: "amount", changed: "Smaller." }),
        ],
        "“Increase by” adds the 100% on.",
      ),

      questionSet(
        "Variation",
        "Work it out. Watch what changes.",
        [
          ask("Increase 80 by 50%", "120", "80 + 40.", "120.", {
            asks: "amount",
            expect: [
              "To increase 80 by 50%, Ty says 40. Right?",
              "No",
              "An increase adds it on: 80 + 40 = 120.",
              [["Yes", "Does an increase make it smaller?"]],
            ],
          }),
          ask("50% of 80", "40", "Half.", "40.", { asks: "amount", changed: "Of, not increase." }),
          ask("150% of 80", "120", "× 1.5.", "120.", { asks: "amount", changed: "150% of." }),
          ask("Increase 80 by 150%", "200", "× 2.5.", "200.", {
            asks: "amount",
            changed: "A bigger increase.",
          }),
        ],
        "“Of” multiplies; “increase by” adds it on.",
      ),
      reworded(PC, OVER, "Where did it go wrong?", {
        text: "Kai increases 80 by 50%.",
      }),

      own(PC, OVER, "Exit check"),

      reworded(
        PC,
        OVER,
        "“A house bought for £150 000 is worth 160% of that now. Find its value.”",
        { tag: "Real life", title: "A £150 000 house is now worth 160% of that. Value?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Over 100% is more than the whole: a multiplier above 1.**"],
        MORE,
        [
          "**Over 100% is more than the whole: a multiplier above 1.**",
          "A 150% increase gives 250% of the original.",
          "160% of £150 000 is × 1.6.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Reverse percentages.

const REVERSE = "gf-percentages/reverse";
const revMethod = [
  "What percent is the new amount? 100 ± the change.",
  "Write it as a multiplier.",
  "Divide the new amount by it.",
];
const BACK = bars([
  ["Original", 10],
  ["After 20% off", 8],
]);

const reverse = stepped(find(PC, REVERSE), {
  method: revMethod,
  variation: {
    relationship: "a new amount back to the original",
    unknowns: ["original"],
    surface: ["VAT", "discounts", "small rises"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The new amount isn't 100%",
        ["**Find the original: divide by the multiplier.**"],
        BACK,
        "£40 is 80%: £40 ÷ 0.8 = £50.",
      ),

      ...owned(PC, REVERSE, "Warm-up", "Check you remember"),

      methodCard("The method", revMethod, BACK),
      workedFrom(PC, REVERSE),
      calc(
        "Your turn",
        "£68 after 15% off.",
        undefined,
        [
          ["Multiplier:", "0.85", "100% − 15%."],
          ["Original:", "80", "68 ÷ 0.85.", { after: "£" }],
        ],
        "£80.",
      ),

      calc(
        "Practise",
        "£180 including 20% VAT.",
        undefined,
        [
          ["Multiplier:", "1.2", "100% + 20%."],
          ["Before VAT:", "150", "180 ÷ 1.2.", { after: "£" }],
        ],
        "£150.",
      ),
      ...owned(PC, REVERSE, "Together", "Practise"),
      ...owned(PC, REVERSE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The original price? Watch what changes.",
        [
          ask("£90 after 10% off", "100", "90 ÷ 0.9.", "£100.", { asks: "original" }),
          ask("£88 after a 10% rise", "80", "88 ÷ 1.1.", "£80.", {
            asks: "original",
            changed: "A rise.",
          }),
          ask("£35 after 50% off", "70", "35 ÷ 0.5.", "£70.", {
            asks: "original",
            changed: "Half off.",
          }),
          ask("£60 after 25% off", "80", "60 ÷ 0.75.", "£80.", {
            asks: "original",
            changed: "A quarter off.",
          }),
        ],
        "Divide by the multiplier.",
      ),

      questionSet(
        "Variation",
        "Before the change? Watch what changes.",
        [
          ask("£84 including 20% VAT", "70", "84 ÷ 1.2.", "£70.", {
            asks: "original",
            expect: [
              "For £84 with VAT, Rae takes 20% off £84. Right?",
              "No",
              "£84 is 120%: £84 ÷ 1.2 = £70.",
              [["Yes", "20% of which price?"]],
            ],
          }),
          ask("£120 including 20% VAT", "100", "120 ÷ 1.2.", "£100.", {
            asks: "original",
            changed: "A bigger price.",
          }),
          ask("£84 after 20% off", "105", "84 ÷ 0.8.", "£105.", {
            asks: "original",
            changed: "Off, not added.",
          }),
          ask("£84 including 5% VAT", "80", "84 ÷ 1.05.", "£80.", {
            asks: "original",
            changed: "5% VAT.",
          }),
        ],
        "The percent was of the original, so divide.",
      ),
      own(PC, REVERSE, "Spot the mistake"),

      own(PC, REVERSE, "Exit check"),

      reworded(
        PC,
        REVERSE,
        "“A coat costs £42 after a 30% reduction. Work out the original price.”",
        { tag: "Real life", title: "£42 after a 30% reduction. The original price?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Find the original: divide by the multiplier.**"],
        BACK,
        [
          "**Find the original: divide by the multiplier.**",
          "£42 after 30% off: £42 ÷ 0.7 = £60.",
          "Don't add the percentage back on.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Simple interest.

const SIMPLE = "gf-percentages/simple-interest";
const simpleMethod = [
  "One year: the rate % of the original.",
  "Times the number of years.",
  "Total: add it to the original.",
];
const YEARS: Picture = {
  kind: "table",
  head: ["Year", "1", "2", "3"],
  rows: [
    ["Interest", "£30", "£30", "£30"],
    ["Total", "£630", "£660", "£690"],
  ],
};

const simpleInterest = stepped(find(PC, SIMPLE), {
  method: simpleMethod,
  variation: {
    relationship: "simple interest: the same every year",
    unknowns: ["interest"],
    surface: ["more years", "higher rates", "less money"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Same every year",
        ["**Simple interest is the same each year, on the original amount.**"],
        YEARS,
        "£600 at 5%: £30 every year.",
      ),
      reworded(PC, SIMPLE, "£400 at 5% simple interest: interest each year", { tag: "The rule" }),

      ...owned(PC, SIMPLE, "Warm-up", "Check you remember"),

      methodCard("The method", simpleMethod, YEARS),
      workedFrom(PC, SIMPLE),
      calc(
        "Your turn",
        "£1 500 at 4% simple interest for 3 years.",
        undefined,
        [
          ["One year:", "60", "4% of 1500.", { after: "£" }],
          ["Three years:", "180", "60 × 3.", { after: "£" }],
          ["Total:", "1680", "1500 + 180.", { after: "£" }],
        ],
        "£1680.",
      ),

      calc(
        "Practise",
        "£2 000 earned £240 in 4 years.",
        undefined,
        [
          ["One year:", "60", "240 ÷ 4.", { after: "£" }],
          ["Rate:", "3", "60 of 2000.", { after: "%" }],
        ],
        "3% a year.",
      ),
      ...owned(PC, SIMPLE, "Together", "Practise"),
      ...owned(PC, SIMPLE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "£800 invested. Watch what changes.",
        [
          ask("At 5%, interest in 1 year?", "40", "5% of 800.", "£40.", { asks: "interest" }),
          ask("At 5%, interest in 3 years?", "120", "40 × 3.", "£120.", {
            asks: "interest",
            changed: "3 years.",
          }),
          ask("At 2%, interest in 3 years?", "48", "16 × 3.", "£48.", {
            asks: "interest",
            changed: "2%.",
          }),
          ask("At 5%, total after 3 years?", "920", "800 + 120.", "£920.", {
            asks: "interest",
            changed: "The total.",
          }),
        ],
        "One year's interest × the years.",
      ),

      questionSet(
        "Variation",
        "Simple interest. Watch what changes.",
        [
          ask("£900 at 3% for 6 years", "162", "27 × 6.", "£162.", {
            asks: "interest",
            expect: [
              "For £900 at 3%, Zac adds £27 + 6 years. Right?",
              "No",
              "£27 a year for 6 years: 27 × 6 = £162.",
              [["Yes", "Add or multiply the years?"]],
            ],
          }),
          ask("£900 at 3% for 10 years", "270", "27 × 10.", "£270.", {
            asks: "interest",
            changed: "More years.",
          }),
          ask("£900 at 6% for 6 years", "324", "54 × 6.", "£324.", {
            asks: "interest",
            changed: "Double the rate.",
          }),
          ask("£450 at 3% for 6 years", "81", "13.50 × 6.", "£81.", {
            asks: "interest",
            changed: "Half the money.",
          }),
        ],
        "The same interest every year.",
      ),
      own(PC, SIMPLE, "Spot the mistake"),

      own(PC, SIMPLE, "Exit check"),

      reworded(
        PC,
        SIMPLE,
        "“£2 500 at 3% simple interest. How long until it earns £450?”",
        { tag: "Real life", title: "£2 500 at 3% simple interest. Years to earn £450?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Simple interest is the same each year, on the original amount.**"],
        YEARS,
        [
          "**Simple interest is the same each year, on the original amount.**",
          "Total interest = one year's × the years.",
          "It never grows: that's compound interest.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfPercentagesStepped: [string, UnitLesson[]][] = [
  [CHANGE, [change]],
  [OVER, [over100]],
  [REVERSE, [reverse]],
  [SIMPLE, [simpleInterest]],
];
