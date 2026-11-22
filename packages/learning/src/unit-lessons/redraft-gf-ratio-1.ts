// GCSE Foundation, "Ratio 1", on the stepped template (docs/proposals/lesson-stepped.md): ratios
// and fractions, one quantity as a fraction of another, ratio notation, and part : whole. Ratios
// are drawn as bars of equal parts. (Sharing in a ratio is in the pilot, redraft-pilot.ts.)
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfRatio1 } from "./gf-ratio-1.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const R1 = gfRatio1;
const NUMBER = "A ratio fact: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const bars = (rows: [string, number][], total?: string): Picture => ({
  kind: "bars",
  rows: rows.map(([label, parts]) => ({ label, parts })),
  ...(total ? { total } : {}),
});
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Fractions and ratio.

const FRACTIONS = "gf-ratio-1/fractions-in-ratio";
const fracMethod = [
  "Add the parts: that's the whole.",
  "Each part over the whole is its fraction.",
  "Back again: a fraction and the rest make the ratio.",
];
const SEVEN = bars([
  ["Red", 2],
  ["Blue", 5],
]);

const fractionsInRatio = stepped(find(R1, FRACTIONS), {
  method: fracMethod,
  variation: {
    relationship: "a ratio and the fractions of the whole",
    unknowns: ["fraction", "ratio"],
    surface: ["the other part", "three parts", "simplifying"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Parts and the whole",
        ["**Add the parts to get the whole; each part is a fraction of it.**"],
        SEVEN,
        "7 parts: red is $\\frac27$, blue is $\\frac57$.",
      ),

      ...owned(R1, FRACTIONS, "Warm-up", "Check you remember"),

      methodCard("The method", fracMethod, SEVEN),
      workedFrom(R1, FRACTIONS),
      calc(
        "Your turn",
        "Tea : coffee = 4 : 5.",
        bars([
          ["Tea", 4],
          ["Coffee", 5],
        ]),
        [
          ["Parts in all:", "9", "4 + 5."],
          ["Coffee: $\\frac{?}{9}$, ? =", "5", "Its parts over the whole."],
        ],
        "Coffee is $\\frac59$.",
      ),

      calc(
        "Practise",
        "$\\frac37$ are adults; the rest are children.",
        undefined,
        [
          ["Children: $\\frac{?}{7}$, ? =", "4", "7 − 3."],
          ["Adults : children = 3 :", "4", "Compare the parts."],
        ],
        "3 : 4.",
      ),
      ...owned(R1, FRACTIONS, "Together", "Practise"),
      ...owned(R1, FRACTIONS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Fraction of the whole? Watch what changes.",
        [
          pick(
            "A : B = 1 : 3. Fraction that is A?",
            "$\\frac14$",
            ["$\\frac13$", "$\\frac34$"],
            "4 parts.",
            {
              asks: "fraction",
            },
          ),
          pick(
            "A : B = 1 : 3. Fraction that is B?",
            "$\\frac34$",
            ["$\\frac31$", "$\\frac14$"],
            "4 parts.",
            {
              asks: "fraction",
              changed: "The other part.",
            },
          ),
          pick(
            "A : B = 2 : 3. Fraction that is A?",
            "$\\frac25$",
            ["$\\frac23$", "$\\frac35$"],
            "5 parts.",
            {
              asks: "fraction",
              changed: "2 parts.",
            },
          ),
          pick(
            "A : B : C = 1 : 2 : 3. Fraction that is C?",
            "$\\frac12$",
            ["$\\frac13$", "$\\frac32$"],
            "6 parts.",
            {
              asks: "fraction",
              changed: "Three parts.",
            },
          ),
        ],
        "Over the whole, not over the other part.",
      ),

      questionSet(
        "Variation",
        "Grass : paving? Watch what changes.",
        [
          pick(
            "$\\frac38$ grass, the rest paving",
            "3 : 5",
            ["3 : 8", "5 : 3"],
            "Paving is $\\frac58$.",
            {
              asks: "ratio",
              expect: [
                "For $\\frac38$ grass, Ade writes grass : paving = 3 : 8. Right?",
                "No",
                "3 : 8 is grass : whole. Paving is $\\frac58$: 3 : 5.",
                [["Yes", "Is 8 the paving or the whole?"]],
              ],
            },
          ),
          pick(
            "$\\frac58$ grass, the rest paving",
            "5 : 3",
            ["5 : 8", "3 : 5"],
            "Paving is $\\frac38$.",
            {
              asks: "ratio",
              changed: "Swapped.",
            },
          ),
          pick(
            "$\\frac14$ grass, the rest paving",
            "1 : 3",
            ["1 : 4", "3 : 1"],
            "Paving is $\\frac34$.",
            {
              asks: "ratio",
              changed: "Quarters.",
            },
          ),
          pick(
            "$\\frac{2}{10}$ grass, the rest paving",
            "1 : 4",
            ["2 : 10", "1 : 5"],
            "2 : 8, simplified.",
            {
              asks: "ratio",
              changed: "Simplify.",
            },
          ),
        ],
        "Compare the part with the rest, not the whole.",
      ),
      reworded(R1, FRACTIONS, "Where did it go wrong?", {
        text: "$\\frac38$ grass, the rest paving. Mia writes grass : paving.",
      }),

      own(R1, FRACTIONS, "Exit check"),

      reworded(
        R1,
        FRACTIONS,
        "“Boys : girls = 3 : 5. What fraction of the class are girls?”",
        { tag: "Real life", title: "Boys : girls = 3 : 5. What fraction are girls?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Add the parts to get the whole; each part is a fraction of it.**"],
        SEVEN,
        [
          "**Add the parts to get the whole; each part is a fraction of it.**",
          "2 : 3 means $\\frac25$ and $\\frac35$, not $\\frac23$.",
          "$\\frac38$ grass: grass : paving = 3 : 5.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// One quantity as a fraction of another.

const OF_ANOTHER = "gf-ratio-1/fraction-of-another";
const ofMethod = ["Make the units the same.", "Write part over whole.", "Simplify."];
const SAME = maths("\\frac{25\\text{ cm}}{100\\text{ cm}} = \\frac14");

const fractionOfAnother = stepped(find(R1, OF_ANOTHER), {
  method: ofMethod,
  variation: {
    relationship: "a part over its whole, in the same units",
    unknowns: ["fraction"],
    surface: ["money", "time", "mass", "bigger wholes"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Same units first",
        ["**Part over whole, in the same units, then simplify.**"],
        SAME,
        "25 cm of 1 m: 1 m is 100 cm.",
      ),
      reworded(R1, OF_ANOTHER, "50p as a fraction of £2", { tag: "The rule" }),

      ...owned(R1, OF_ANOTHER, "Warm-up", "Check you remember"),

      methodCard("The method", ofMethod, SAME),
      workedFrom(R1, OF_ANOTHER),
      calc(
        "Your turn",
        "36 minutes as a fraction of 2 hours.",
        undefined,
        [
          ["2 hours in minutes:", "120", "2 × 60."],
          ["$\\frac{36}{120} = \\frac{3}{?}$, ? =", "10", "Divide both by 12."],
        ],
        "$\\frac{3}{10}$.",
      ),

      calc(
        "Practise",
        "400 m as a fraction of 5 km.",
        undefined,
        [
          ["5 km in metres:", "5000", "5 × 1000."],
          ["$\\frac{400}{5000} = \\frac{2}{?}$, ? =", "25", "Divide both by 200."],
        ],
        "$\\frac{2}{25}$.",
      ),
      ...owned(R1, OF_ANOTHER, "Together", "Practise"),
      ...owned(R1, OF_ANOTHER, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "As a fraction. Watch what changes.",
        [
          pick("30p of £1", "$\\frac{3}{10}$", ["$\\frac{30}{1}$", "$\\frac13$"], "£1 = 100p.", {
            asks: "fraction",
          }),
          pick(
            "30p of £2",
            "$\\frac{3}{20}$",
            ["$\\frac{30}{2}$", "$\\frac{3}{10}$"],
            "£2 = 200p.",
            {
              asks: "fraction",
              changed: "£2.",
            },
          ),
          pick(
            "30 seconds of 2 minutes",
            "$\\frac14$",
            ["$\\frac{30}{2}$", "$\\frac{1}{15}$"],
            "120 seconds.",
            {
              asks: "fraction",
              changed: "Time.",
            },
          ),
          pick(
            "30 g of 1.5 kg",
            "$\\frac{1}{50}$",
            ["$\\frac{30}{1.5}$", "$\\frac15$"],
            "1500 g.",
            {
              asks: "fraction",
              changed: "Grams.",
            },
          ),
        ],
        "Same units, then simplify.",
      ),

      questionSet(
        "Variation",
        "As a fraction. Watch what changes.",
        [
          pick("20 s of 2 minutes", "$\\frac16$", ["6", "$\\frac{20}{2}$"], "20 of 120 seconds.", {
            asks: "fraction",
            expect: [
              "For 20 s of 2 minutes, Bo writes $\\frac{120}{20} = 6$. Right?",
              "No",
              "Part over whole: $\\frac{20}{120} = \\frac16$.",
              [["Yes", "Can a part be 6 times the whole?"]],
            ],
          }),
          pick("40 s of 2 minutes", "$\\frac13$", ["3", "$\\frac{40}{2}$"], "40 of 120 seconds.", {
            asks: "fraction",
            changed: "Twice as long.",
          }),
          pick(
            "20 s of 4 minutes",
            "$\\frac{1}{12}$",
            ["12", "$\\frac{20}{4}$"],
            "20 of 240 seconds.",
            {
              asks: "fraction",
              changed: "A bigger whole.",
            },
          ),
          pick(
            "20 minutes of 2 hours",
            "$\\frac16$",
            ["6", "$\\frac{20}{2}$"],
            "20 of 120 minutes.",
            {
              asks: "fraction",
              changed: "Minutes and hours.",
            },
          ),
        ],
        "The part goes on top.",
      ),
      own(R1, OF_ANOTHER, "Spot the mistake"),

      own(R1, OF_ANOTHER, "Exit check"),

      reworded(
        R1,
        OF_ANOTHER,
        "“40 minutes of a 2-hour evening. What fraction, in simplest form?”",
        { tag: "Real life", title: "40 minutes of a 2-hour evening. What fraction?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Part over whole, in the same units, then simplify.**"],
        SAME,
        [
          "**Part over whole, in the same units, then simplify.**",
          "20 cm of 1 m is $\\frac{20}{100} = \\frac15$.",
          "The part goes on top.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Ratio notation.

const NOTATION = "gf-ratio-1/notation";
const notationMethod = [
  "Make the units the same.",
  "Clear any decimals: multiply every part.",
  "Divide by the HCF until nothing divides them all.",
];
const SIMPLEST = maths("18 : 24 = 3 : 4");

const notation = stepped(find(R1, NOTATION), {
  method: notationMethod,
  variation: {
    relationship: "a ratio and its simplest form",
    unknowns: ["simplest"],
    surface: ["decimals", "different units", "three parts"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Simplify like a fraction",
        ["**Same units, then divide every part by the same number.**"],
        SIMPLEST,
        "Divide both by the HCF, 6.",
      ),
      reworded(R1, NOTATION, "Simplify 12 : 18", { tag: "The rule" }),

      ...owned(R1, NOTATION, "Warm-up", "Check you remember"),

      methodCard("The method", notationMethod, SIMPLEST),
      workedFrom(R1, NOTATION),
      calc(
        "Your turn",
        "Simplify 600 g : 2 kg.",
        undefined,
        [
          ["In grams: 600 :", "2000", "2 kg = 2000 g."],
          ["Simplest: 3 :", "10", "Divide both by 200."],
        ],
        "3 : 10.",
      ),

      calc(
        "Practise",
        "Simplify 0.6 : 1.5.",
        undefined,
        [
          ["× 10: 6 :", "15", "Clear the decimals."],
          ["Simplest: 2 :", "5", "Divide both by 3."],
        ],
        "2 : 5.",
      ),
      ...owned(R1, NOTATION, "Together", "Practise"),
      ...owned(R1, NOTATION, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Simplify. Watch what changes.",
        [
          pick("16 : 24", "2 : 3", ["4 : 6", "8 : 12"], "Divide by 8.", { asks: "simplest" }),
          pick("16 : 40", "2 : 5", ["4 : 10", "8 : 20"], "Divide by 8.", {
            asks: "simplest",
            changed: "40, not 24.",
          }),
          pick("1.6 : 2.4", "2 : 3", ["16 : 24", "1 : 1.5"], "× 10, then ÷ 8.", {
            asks: "simplest",
            changed: "Decimals.",
          }),
          pick("16 cm : 2.4 m", "1 : 15", ["16 : 2.4", "2 : 3"], "16 : 240.", {
            asks: "simplest",
            changed: "Units.",
          }),
        ],
        "Same units, whole numbers, then divide.",
      ),

      questionSet(
        "Variation",
        "Simplify. Watch what changes.",
        [
          pick("30 : 45", "2 : 3", ["6 : 9", "10 : 15"], "Divide by 15.", {
            asks: "simplest",
            expect: [
              "Pat simplifies 30 : 45 to 6 : 9 and stops. Right?",
              "No",
              "3 still divides both: 2 : 3.",
              [["Yes", "Does anything else divide both?"]],
            ],
          }),
          pick("30 : 75", "2 : 5", ["6 : 15", "10 : 25"], "Divide by 15.", {
            asks: "simplest",
            changed: "75, not 45.",
          }),
          pick("30 : 45 : 60", "2 : 3 : 4", ["6 : 9 : 12", "10 : 15 : 20"], "Divide by 15.", {
            asks: "simplest",
            changed: "Three parts.",
          }),
          pick("£3 : 45p", "20 : 3", ["3 : 45", "1 : 15"], "300 : 45.", {
            asks: "simplest",
            changed: "Units.",
          }),
        ],
        "Keep going until nothing divides them all.",
      ),
      own(R1, NOTATION, "Spot the mistake"),

      own(R1, NOTATION, "Exit check"),

      reworded(
        R1,
        NOTATION,
        "“400 g flour : 1.5 kg potatoes, in simplest form.”",
        { tag: "Real life", title: "400 g flour : 1.5 kg potatoes, simplest form?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Same units, then divide every part by the same number.**"],
        SIMPLEST,
        [
          "**Same units, then divide every part by the same number.**",
          "20 cm : 1 m = 20 : 100 = 1 : 5.",
          "24 : 36 = 2 : 3, not 6 : 9.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Part and whole.

const PART_WHOLE = "gf-ratio-1/part-whole";
const pwMethod = [
  "Part : part? Add them for the whole.",
  "Part : whole? Take it away for the other part.",
  "Fraction of the whole: part over total.",
];
const DRINK = bars([
  ["Squash", 1],
  ["Water", 3],
]);

const partWhole = stepped(find(R1, PART_WHOLE), {
  method: pwMethod,
  variation: {
    relationship: "part : part and part : whole",
    unknowns: ["relation", "amount"],
    surface: ["part : part", "part : whole", "more water"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Part : whole",
        ["**Part : whole compares with the total; part : part doesn't.**"],
        DRINK,
        "Squash : water is 1 : 3, so squash is $\\frac14$.",
      ),

      ...owned(R1, PART_WHOLE, "Warm-up", "Check you remember"),

      methodCard("The method", pwMethod, DRINK),
      workedFrom(R1, PART_WHOLE),
      calc(
        "Your turn",
        "Cement, sand, gravel 1 : 3 : 4. 40 kg of concrete.",
        bars([
          ["Cement", 1],
          ["Sand", 3],
          ["Gravel", 4],
        ]),
        [
          ["Parts in all:", "8", "1 + 3 + 4."],
          ["Cement:", "5", "40 ÷ 8.", { after: "kg" }],
        ],
        "5 kg of cement.",
      ),

      calc(
        "Practise",
        "Girls are $\\frac35$ of a class of 30.",
        undefined,
        [
          ["Girls:", "18", "$\\frac35$ of 30."],
          ["Boys:", "12", "30 − 18."],
          ["Girls : boys = 3 :", "2", "18 : 12."],
        ],
        "3 : 2.",
      ),
      ...owned(R1, PART_WHOLE, "Together", "Practise"),
      ...owned(R1, PART_WHOLE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Watch what changes.",
        [
          pick(
            "Squash : water = 1 : 4. Fraction squash?",
            "$\\frac15$",
            ["$\\frac14$", "$\\frac45$"],
            "5 parts.",
            {
              asks: "relation",
            },
          ),
          pick(
            "Squash : drink = 1 : 4. Fraction squash?",
            "$\\frac14$",
            ["$\\frac15$", "$\\frac34$"],
            "4 is the whole.",
            {
              asks: "relation",
              changed: "Part : whole.",
            },
          ),
          pick(
            "Squash : drink = 1 : 4. Squash : water?",
            "1 : 3",
            ["1 : 4", "1 : 5"],
            "Water is 3 parts.",
            {
              asks: "relation",
              changed: "The other part.",
            },
          ),
          pick(
            "Squash : water = 1 : 4. Squash : drink?",
            "1 : 5",
            ["1 : 4", "1 : 3"],
            "The drink is 5 parts.",
            {
              asks: "relation",
              changed: "The whole.",
            },
          ),
        ],
        "Is the second number a part or the whole?",
      ),

      questionSet(
        "Variation",
        "Squash : water. How much squash?",
        [
          pick(
            "1 : 3, 2 litres of drink",
            "0.5 litres",
            ["0.67 litres", "0.4 litres"],
            "4 parts.",
            {
              asks: "amount",
              expect: [
                "For 1 : 3, Sam says squash is $\\frac13$ of the drink. Right?",
                "No",
                "1 + 3 = 4 parts: squash is $\\frac14$.",
                [["Yes", "How many parts in all?"]],
              ],
            },
          ),
          pick("1 : 3, 4 litres of drink", "1 litre", ["1.33 litres", "0.75 litres"], "4 parts.", {
            asks: "amount",
            changed: "More drink.",
          }),
          pick(
            "1 : 4, 2 litres of drink",
            "0.4 litres",
            ["0.5 litres", "0.25 litres"],
            "5 parts.",
            {
              asks: "amount",
              changed: "More water.",
            },
          ),
          pick(
            "Squash : drink 1 : 4, 2 litres",
            "0.5 litres",
            ["0.4 litres", "0.67 litres"],
            "4 is the whole.",
            {
              asks: "amount",
              changed: "Part : whole.",
            },
          ),
        ],
        "Count every part to find the whole.",
      ),
      reworded(R1, PART_WHOLE, "Where did it go wrong?", {
        text: "Squash : water = 1 : 3, in 2 litres. Ola finds the squash.",
      }),

      own(R1, PART_WHOLE, "Exit check"),

      reworded(
        R1,
        PART_WHOLE,
        "“Squash is $\\frac15$ of 1.5 litres of drink. Write water : squash.”",
        { tag: "Real life", title: "Squash is $\\frac15$ of the drink. Water : squash?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Part : whole compares with the total; part : part doesn't.**"],
        DRINK,
        [
          "**Part : whole compares with the total; part : part doesn't.**",
          "Squash : water 1 : 4 means squash is $\\frac15$.",
          "Add the parts for the whole.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const gfRatio1Stepped: [string, UnitLesson[]][] = [
  [FRACTIONS, [fractionsInRatio]],
  [OF_ANOTHER, [fractionOfAnother]],
  [NOTATION, [notation]],
  [PART_WHOLE, [partWhole]],
];
