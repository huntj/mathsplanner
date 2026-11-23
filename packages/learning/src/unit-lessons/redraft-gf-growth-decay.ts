// GCSE Foundation, "Growth and decay", on the stepped template (docs/proposals/lesson-stepped.md):
// repeated percentage growth, repeated decay, and compound interest against simple interest.
// Year-by-year tables are the pictures; the rest is number work.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { car, gfGrowthDecay, rabbits } from "./gf-growth-decay.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const GD = gfGrowthDecay;
const NUMBER = "A percentage change: the numbers are the picture.";
const table = (head: string[], rows: string[][]): Picture => ({ kind: "table", head, rows });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Repeated percentage growth.

const GROW = "gf-growth-decay/growth";
const growMethod = [
  "Multiplier: 1 + the rate as a decimal.",
  "The power is the number of years.",
  "Start × multiplierⁿ.",
];
const SAVINGS = table(["Year", "0", "1", "2", "3"], [["£", "100", "110", "121", "133.10"]]);

const growth = stepped(find(GD, GROW), {
  method: growMethod,
  variation: {
    relationship: "the same multiplier, once a year",
    unknowns: ["multiplier", "amount"],
    surface: ["more years", "a bigger rate", "a decimal rate"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Grow, then grow again",
        ["**Multiply by the same multiplier once for each year.**"],
        SAVINGS,
        "£100 at 10%: $100 \\times 1.1^3 = 133.10$.",
      ),
      reworded(GD, GROW, "After 2 years, the rabbits are", { tag: "The rule", picture: rabbits }),

      ...owned(GD, GROW, "Warm-up", "Check you remember"),

      methodCard("The method", growMethod, SAVINGS),
      workedFrom(GD, GROW),
      calc(
        "Your turn",
        "£2000 grows by 5% a year for 3 years.",
        undefined,
        [
          ["Multiplier:", "1.05", "1 + 0.05."],
          ["Amount: £", "2315.25", "2000 × 1.05³."],
        ],
        "£2315.25.",
      ),

      calc(
        "Practise",
        "A town of 8000 grows 3% a year for 4 years.",
        undefined,
        [
          ["Multiplier:", "1.03", "1 + 0.03."],
          ["Population:", "9004", "8000 × 1.03⁴, to the nearest whole."],
        ],
        "About 9004 people.",
      ),
      ...owned(GD, GROW, "Together", "Practise"),
      reworded(GD, GROW, "£500 grows by 10% a year for 2 years. Final amount in £?", {
        tag: "Practise",
        title: "£500 grows 10% a year for 2 years. Amount in £?",
      }),
      reworded(GD, GROW, "$800 \\times 1.05^{6}$ means", { tag: "Practise" }),
      questionSet(
        "Practise",
        "The multiplier. Watch what changes.",
        [
          pick("5% growth", "1.05", ["1.5", "0.05"], "1 + 0.05.", { asks: "multiplier" }),
          pick("50% growth", "1.5", ["1.05", "0.5"], "1 + 0.5.", {
            asks: "multiplier",
            changed: "Ten times the rate.",
          }),
          pick("2.5% growth", "1.025", ["1.25", "1.0025"], "1 + 0.025.", {
            asks: "multiplier",
            changed: "A decimal rate.",
          }),
          pick("100% growth", "2", ["1.1", "100"], "1 + 1.", {
            asks: "multiplier",
            changed: "Doubling.",
          }),
        ],
        "Add the rate, as a decimal, to 1.",
      ),

      questionSet(
        "Variation",
        "£500 grows 10% a year. Watch what changes.",
        [
          pick("After 1 year", "£550", ["£510", "£600"], "500 × 1.1.", {
            asks: "amount",
            expect: [
              "For 3 years, Ola works out $500 \\times 1.1 \\times 3$. Right?",
              "No",
              "Multiply by 1.1 three times: $500 \\times 1.1^3 = 665.50$.",
              [["Yes", "Is × 3 the same as × 1.1 three times?"]],
            ],
          }),
          pick("After 2 years", "£605", ["£600", "£1100"], "500 × 1.1².", {
            asks: "amount",
            changed: "Two years.",
          }),
          pick("After 3 years", "£665.50", ["£650", "£1650"], "500 × 1.1³.", {
            asks: "amount",
            changed: "Three years.",
          }),
          pick("At 20%, after 2 years", "£720", ["£700", "£605"], "500 × 1.2².", {
            asks: "amount",
            changed: "Double the rate.",
          }),
        ],
        "Each year grows the new amount.",
      ),
      own(GD, GROW, "Spot the mistake"),

      own(GD, GROW, "Exit check"),

      reworded(
        GD,
        GROW,
        "“How many rabbits after 3 years? Give your answer to the nearest whole number.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply by the same multiplier once for each year.**"],
        SAVINGS,
        [
          "**Multiply by the same multiplier once for each year.**",
          "Amount = start × multiplierⁿ.",
          "20% for 3 years is not 60%.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Repeated percentage decay.

const DECAY = "gf-growth-decay/decay";
const decayMethod = [
  "Multiplier: 1 − the rate as a decimal.",
  "The power is the number of years.",
  "Start × multiplierⁿ.",
];

const decay = stepped(find(GD, DECAY), {
  method: decayMethod,
  variation: {
    relationship: "a multiplier below 1, once a year",
    unknowns: ["multiplier", "value"],
    surface: ["a bigger fall", "more years", "a decimal rate"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Shrinking each time",
        ["**A decrease uses a multiplier below 1: a 15% fall is × 0.85.**"],
        car,
        "It never reaches zero: it loses 15% of what's left.",
      ),
      reworded(GD, DECAY, "The multiplier for a 30% decrease is", { tag: "The rule" }),

      ...owned(GD, DECAY, "Warm-up", "Check you remember"),

      methodCard("The method", decayMethod, car),
      workedFrom(GD, DECAY),
      calc(
        "Your turn",
        "A £15 000 car loses 20% a year for 3 years.",
        undefined,
        [
          ["Multiplier:", "0.8", "1 − 0.2."],
          ["Value: £", "7680", "15 000 × 0.8³."],
        ],
        "£7680.",
      ),

      calc(
        "Practise",
        "60 mg of medicine; 10% leaves each hour.",
        undefined,
        [
          ["Multiplier:", "0.9", "1 − 0.1."],
          ["After 2 hours:", "48.6", "60 × 0.9².", { after: "mg" }],
        ],
        "48.6 mg.",
      ),
      ...owned(GD, DECAY, "Together", "Practise"),
      reworded(GD, DECAY, "A £400 phone loses 20% a year. Value after 2 years in £?", {
        tag: "Practise",
        title: "A £400 phone loses 20% a year. In £, after 2 years?",
      }),
      reworded(GD, DECAY, "Will the car's value ever reach £0?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "The multiplier. Watch what changes.",
        [
          pick("10% decrease", "0.9", ["0.1", "1.1"], "1 − 0.1.", { asks: "multiplier" }),
          pick("25% decrease", "0.75", ["0.25", "1.25"], "1 − 0.25.", {
            asks: "multiplier",
            changed: "A bigger fall.",
          }),
          pick("3% decrease", "0.97", ["0.7", "0.03"], "1 − 0.03.", {
            asks: "multiplier",
            changed: "A small fall.",
          }),
          pick("12.5% decrease", "0.875", ["0.125", "0.75"], "1 − 0.125.", {
            asks: "multiplier",
            changed: "A decimal rate.",
          }),
        ],
        "Take the rate, as a decimal, from 1.",
      ),

      questionSet(
        "Variation",
        "£1000 falls 10% a year. Watch what changes.",
        [
          pick("After 1 year", "£900", ["£990", "£100"], "1000 × 0.9.", {
            asks: "value",
            expect: [
              "A 15% fall each year for 4 years. Leo takes off 60% at once. Right?",
              "No",
              "Each year loses 15% of what's left: × $0.85^4$.",
              [["Yes", "Is the second 15% taken from the same amount?"]],
            ],
          }),
          pick("After 2 years", "£810", ["£800", "£180"], "1000 × 0.9².", {
            asks: "value",
            changed: "Two years.",
          }),
          pick("After 3 years", "£729", ["£700", "£270"], "1000 × 0.9³.", {
            asks: "value",
            changed: "Three years.",
          }),
          pick("At 20%, after 2 years", "£640", ["£600", "£800"], "1000 × 0.8².", {
            asks: "value",
            changed: "Double the rate.",
          }),
        ],
        "Each year loses a share of what's left.",
      ),
      own(GD, DECAY, "Spot the mistake"),

      own(GD, DECAY, "Exit check"),

      reworded(
        GD,
        DECAY,
        "“Work out its value after 4 years. Give your answer to the nearest pound.”",
        { tag: "Real life", title: "A £12 000 car loses 15% a year. Its value after 4 years?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A decrease uses a multiplier below 1: a 15% fall is × 0.85.**"],
        car,
        [
          "**A decrease uses a multiplier below 1: a 15% fall is × 0.85.**",
          "Value = start × multiplierⁿ.",
          "0.15 keeps 15%; 0.85 takes 15% off.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Compound interest.

const COMPOUND = "gf-growth-decay/compound-interest";
const compoundMethod = [
  "Multiplier: 1 + the rate.",
  "Total = start × multiplierⁿ.",
  "Interest = total − start.",
];
const BOTH = table(
  ["Year", "Simple", "Compound"],
  [
    ["1", "£110", "£110"],
    ["2", "£120", "£121"],
    ["3", "£130", "£133.10"],
  ],
);
const total = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Simple: the same each year. Compound: × each year.", {
    asks: "total",
    ...extra,
  });

const compound = stepped(find(GD, COMPOUND), {
  method: compoundMethod,
  variation: {
    relationship: "interest on interest, against simple interest",
    unknowns: ["total", "interest"],
    surface: ["simple or compound", "more years", "double the rate"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Simple against compound",
        ["**Compound interest is paid on the interest too. Simple interest is not.**"],
        BOTH,
        "£100 at 10%: compound pulls ahead each year.",
      ),
      reworded(GD, COMPOUND, "£1000 at 5% simple interest for 3 years earns", {
        tag: "The rule",
      }),

      ...owned(GD, COMPOUND, "Warm-up", "Check you remember"),

      methodCard("The method", compoundMethod, BOTH),
      workedFrom(GD, COMPOUND),
      calc(
        "Your turn",
        "£3000 at 4% compound interest for 2 years.",
        undefined,
        [
          ["Total: £", "3244.80", "3000 × 1.04²."],
          ["Interest: £", "244.80", "Total − 3000."],
        ],
        "£244.80 interest.",
      ),

      calc(
        "Practise",
        "£3000 at 4% simple interest for 2 years.",
        undefined,
        [
          ["Interest each year: £", "120", "4% of 3000."],
          ["Total: £", "3240", "3000 + 2 × 120."],
        ],
        "Compound paid £4.80 more.",
      ),
      ...owned(GD, COMPOUND, "Together", "Practise"),
      ...owned(GD, COMPOUND, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "£1000 at 10%. Watch what changes.",
        [
          total("Simple, 2 years", "£1200", ["£1210", "£1020"]),
          total("Compound, 2 years", "£1210", ["£1200", "£1020"], { changed: "Compound." }),
          total("Compound, 3 years", "£1331", ["£1300", "£1030"], { changed: "Three years." }),
          total("Simple, 3 years", "£1300", ["£1331", "£1030"], { changed: "Simple again." }),
        ],
        "Compound grows faster as the years go on.",
      ),

      questionSet(
        "Variation",
        "Find the interest. Watch what changes.",
        [
          pick(
            "£2000 at 4% compound, 2 years",
            "£163.20",
            ["£160", "£2163.20"],
            "2000 × 1.04² − 2000.",
            {
              asks: "interest",
              expect: [
                "£2000 at 4% compound for 2 years. Ben says £160 interest. Right?",
                "No",
                "Year 2 earns 4% of £2080: the interest is £163.20.",
                [["Yes", "Is year 2's interest on £2000 or £2080?"]],
              ],
            },
          ),
          pick("£2000 at 4% simple, 2 years", "£160", ["£163.20", "£2160"], "2 × £80.", {
            asks: "interest",
            changed: "Simple.",
          }),
          pick(
            "£4000 at 4% compound, 2 years",
            "£326.40",
            ["£320", "£4326.40"],
            "Double the last.",
            {
              asks: "interest",
              changed: "Double the money.",
            },
          ),
          pick(
            "£2000 at 8% compound, 2 years",
            "£332.80",
            ["£320", "£326.40"],
            "2000 × 1.08² − 2000.",
            {
              asks: "interest",
              changed: "Double the rate.",
            },
          ),
        ],
        "Interest = total − what you put in.",
      ),
      own(GD, COMPOUND, "Spot the mistake"),

      own(GD, COMPOUND, "Exit check"),

      reworded(
        GD,
        COMPOUND,
        "“Which account pays more over 5 years?”",
        { tag: "Real life", title: "£2000 for 5 years: 3% simple or 2.8% compound?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Compound interest is paid on the interest too. Simple interest is not.**"],
        BOTH,
        [
          "**Compound interest is paid on the interest too. Simple interest is not.**",
          "Total = start × (1 + rate)ⁿ.",
          "Interest = total − start.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfGrowthDecayStepped: [string, UnitLesson[]][] = [
  [GROW, [growth]],
  [DECAY, [decay]],
  [COMPOUND, [compound]],
];
