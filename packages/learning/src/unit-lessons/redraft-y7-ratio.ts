// Year 7, "Ratio and proportion", on the stepped template (docs/proposals/lesson-stepped.md):
// writing and simplifying ratios, sharing, part to whole, a division as a ratio, and one amount as
// a fraction of another. Bar models show every ratio, and sharing has a total to slide.
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
import type { BarsPic, Picture, Screen, UnitLesson } from "./types.ts";
import { y7Ratio } from "./y7-ratio.ts";

const NUMBER = "A number fact: there is nothing to draw.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });

/** A bar model: a row of equal parts for each share, with a total over them if known. */
const bars = (
  rows: [label: string, parts: number, shaded?: number][],
  total?: string,
): BarsPic => ({
  kind: "bars",
  rows: rows.map(([label, parts, shaded]) => ({
    label,
    parts,
    ...(shaded === undefined ? {} : { shaded }),
  })),
  ...(total ? { total } : {}),
});

/** A question with no picture is a number fact: say so. */
const worded = (screens: Screen[]): Screen[] =>
  screens.map((s) =>
    ["answer", "choice", "calc", "set", "steps", "fill"].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture)
      ? { ...s, wordsOnly: NUMBER }
      : s,
  );

/** A screen with its title (and words) shortened. */
const retitled = (s: Screen, title: string, text?: string): Screen =>
  ({ ...s, title, ...(text === undefined ? {} : { text }) }) as Screen;

const list = y7Ratio;

// ---------------------------------------------------------------------------------------------
// Writing ratios.

const NOTATION = "y7-ratio/notation";
const notationMethod = [
  "Write both parts in the same units.",
  "Find the HCF of the parts.",
  "Divide every part by it.",
];

const notation = stepped(find(list, NOTATION), {
  method: notationMethod,
  variation: {
    relationship: "a ratio and its simplest form",
    unknowns: ["simplest form", "missing part"],
    surface: ["the order", "three parts", "different units", "a bigger HCF", "recipes"],
  },
  screens: worded([
    explain(
      "The rule",
      "Writing ratios",
      ["**Simplify a ratio by dividing every part by the same number.**"],
      bars([
        ["red", 6],
        ["blue", 4],
      ]),
      "6 : 4 is the same mix as 3 : 2, just more of it.",
    ),
    reworded(list, NOTATION, "Which is the same as 6 : 4?", { tag: "The rule" }),

    ...owned(list, NOTATION, "Warm-up", "Check you remember"),
    typed(
      "Check you remember",
      "What is the HCF of 12 and 8?",
      "4",
      "The biggest number that divides both.",
      "4.",
    ),

    methodCard("The method", notationMethod, maths("12 : 8 = 3 : 2")),
    worked(
      "Watch the method",
      "Write 12 : 8 in its simplest form.",
      [
        { line: "The HCF of 12 and 8 is 4." },
        { line: "$12 \\div 4 = 3$, $8 \\div 4 = 2$", note: "Divide every part by the HCF." },
        { line: "3 : 2" },
      ],
      "3 : 2.",
      bars([
        ["", 12],
        ["", 8],
      ]),
    ),
    calc(
      "Your turn",
      "Simplify 15 : 25.",
      undefined,
      [
        ["The HCF of 15 and 25 is", "5", "The biggest number that divides both."],
        ["$15 \\div 5 =$", "3", "Divide the first part."],
        ["$25 \\div 5 =$", "5", "Divide the second part."],
      ],
      "3 : 5.",
    ),

    calc(
      "Practise",
      "Write 50 cm : 2 m in its simplest form.",
      undefined,
      [
        ["2 m in centimetres:", "200", "100 cm in 1 m."],
        ["The HCF of 50 and 200 is", "50", "50 divides 200."],
        ["$200 \\div 50 =$", "4", "So 50 : 200 is 1 : …"],
      ],
      "1 : 4.",
    ),
    ...owned(list, NOTATION, "Your turn", "Practise").map((s) =>
      s.kind === "answer"
        ? retitled(s, "12 boys, 16 girls. Write girls : boys simply.", "Type it like 3:2.")
        : s,
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Simplify 8 : 12.", "2 : 3", "Divide both by 4.", "2 : 3.", {
          asks: "simplest form",
          others: ["4 : 6", "3 : 2"],
        }),
        ask("Simplify 30 : 10.", "3 : 1", "Divide both by 10.", "3 : 1.", {
          asks: "simplest form",
          changed: "The first part is bigger.",
          others: ["1 : 3", "30 : 1"],
        }),
        ask("2 : 3 = 10 : ?", "15", "2 times 5 is 10, so 3 times 5.", "15.", {
          asks: "missing part",
          changed: "Now a missing part.",
          picture: bars([
            ["", 2],
            ["", 3],
          ]),
        }),
        ask("Simplify 1 m : 25 cm.", "4 : 1", "100 : 25, then divide by 25.", "4 : 1.", {
          asks: "simplest form",
          changed: "Different units.",
          others: ["1 : 25", "1 : 4"],
        }),
      ],
      "Same units, then divide every part by the HCF.",
    ),

    questionSet(
      "Variation",
      "Simplify each one. Watch what changes.",
      [
        ask("Simplify 10 : 15.", "2 : 3", "Divide both by 5.", "2 : 3.", {
          asks: "simplest form",
          others: ["5 : 10", "1 : 1.5"],
          expect: [
            "Sam takes 5 from each: 5 : 10. Is that right?",
            "No",
            "Ratios divide, not take away: 10 : 15 is 2 : 3.",
            [["Yes", "5 : 10 is 1 : 2, a different mix."]],
          ],
        }),
        ask("Simplify 15 : 10.", "3 : 2", "Divide both by 5.", "3 : 2.", {
          asks: "simplest form",
          changed: "The order swaps.",
          others: ["2 : 3", "1 : 1"],
        }),
        ask("Simplify 6 : 9 : 12.", "2 : 3 : 4", "Divide all three by 3.", "2 : 3 : 4.", {
          asks: "simplest form",
          changed: "Three parts.",
          others: ["2 : 3 : 12", "6 : 3 : 4"],
        }),
        ask("Simplify 18 : 45.", "2 : 5", "The HCF is 9.", "2 : 5.", {
          asks: "simplest form",
          changed: "A bigger HCF.",
          others: ["6 : 15", "9 : 22.5"],
        }),
      ],
      "Divide every part by the same number; keep the order.",
    ),
    own(list, NOTATION, "Spot the mistake"),

    own(list, NOTATION, "Exit check"),

    reworded(list, NOTATION, "Flapjack", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Simplify a ratio by dividing every part by the same number.**"],
      bars([
        ["red", 3],
        ["blue", 2],
      ]),
      [
        "**Simplify a ratio by dividing every part by the same number.**",
        "Same units first; the order matters.",
        "12 : 8 = 3 : 2 (divide by 4)",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Sharing in a ratio.

const SHARING = "y7-ratio/sharing";
const sharingMethod = [
  "Add the ratio's numbers: the parts.",
  "One part: divide by the number of parts.",
  "Times one part by each share's parts.",
];

const sharing = stepped(find(list, SHARING), {
  method: sharingMethod,
  variation: {
    relationship: "a total shared in a ratio: parts, one part and each share",
    unknowns: ["share", "one part", "other share", "total"],
    surface: ["the order", "three people", "the difference", "prizes"],
  },
  screens: worded([
    explain(
      "The rule",
      "Sharing in a ratio",
      ["**Count the parts, find one part, then each share.**"],
      bars(
        [
          ["Amy", 3],
          ["Ben", 2],
        ],
        "£40",
      ),
      "5 parts make £40, so one part is £8.",
    ),
    tagged(
      "The rule",
      explore(
        "Change the total",
        {
          kind: "ratio",
          rows: [
            { label: "Amy", parts: 3 },
            { label: "Ben", parts: 2 },
          ],
          total: { min: 10, max: 100, step: 5, start: 40 },
          unit: "£",
        },
        [
          "What did you notice?",
          "One part is always the total divided by 5",
          "3 + 2 is 5 parts, whatever the total.",
          [
            ["Amy always gets £3 more", "Try £100: Amy gets £60, Ben £40."],
            ["One part is the total divided by 3", "There are 5 parts in all."],
          ],
        ],
        "Count the parts first; one part is the total over the parts.",
        { text: "Drag the slider. Watch one part and each share." },
      ),
    ),

    ...owned(list, SHARING, "Warm-up", "Check you remember"),
    typed("Check you remember", "What is $3 \\times 8$?", "24", "3 eights.", "24."),

    methodCard(
      "The method",
      sharingMethod,
      bars(
        [
          ["", 5],
          ["", 3],
        ],
        "56",
      ),
    ),
    worked(
      "Watch the method",
      "Share 56 sweets in the ratio 5 : 3.",
      [
        { line: "Parts: $5 + 3 = 8$" },
        { line: "One part: $56 \\div 8 = 7$", note: "Divide by all the parts." },
        { line: "$5 \\times 7 = 35$ and $3 \\times 7 = 21$" },
      ],
      "35 and 21. Check: 35 + 21 = 56.",
      bars(
        [
          ["", 5],
          ["", 3],
        ],
        "56",
      ),
    ),
    calc(
      "Your turn",
      "Share £60 in the ratio 1 : 4.",
      bars(
        [
          ["", 1],
          ["", 4],
        ],
        "£60",
      ),
      [
        ["Parts: $1 + 4 =$", "5", "Add the ratio's numbers."],
        ["One part: $60 \\div 5 =$", "12", "Divide by the parts."],
        ["Bigger share: $4 \\times 12 =$", "48", "4 parts."],
      ],
      "£12 and £48.",
    ),

    calc(
      "Practise",
      "Share 72 in the ratio 5 : 4.",
      bars(
        [
          ["", 5],
          ["", 4],
        ],
        "72",
      ),
      [
        ["Parts: $5 + 4 =$", "9", "Add the ratio's numbers."],
        ["One part: $72 \\div 9 =$", "8", "Divide by the parts."],
        ["Smaller share: $4 \\times 8 =$", "32", "4 parts."],
      ],
      "40 and 32.",
    ),
    ...owned(list, SHARING, "Together", "Practise"),
    questionSet(
      "Practise",
      "Amy : Ben = 3 : 2. Watch what changes.",
      [
        ask("They share £40. How much does Amy get?", "24", "One part is £8.", "£24.", {
          asks: "share",
          picture: bars(
            [
              ["Amy", 3],
              ["Ben", 2],
            ],
            "£40",
          ),
        }),
        ask("They share £40. What is one part?", "8", "£40 ÷ 5.", "£8.", {
          asks: "one part",
          changed: "Now just one part.",
          picture: bars(
            [
              ["Amy", 3],
              ["Ben", 2],
            ],
            "£40",
          ),
        }),
        ask("Amy gets £30. How much does Ben get?", "20", "Amy's 3 parts are £30.", "£20.", {
          asks: "other share",
          changed: "Now you know Amy's share, not the total.",
          picture: bars([
            ["Amy", 3],
            ["Ben", 2],
          ]),
        }),
        ask("Ben gets £16. What was the total?", "40", "Ben's 2 parts are £16.", "£40.", {
          asks: "total",
          changed: "Now find the total.",
          picture: bars([
            ["Amy", 3],
            ["Ben", 2],
          ]),
        }),
      ],
      "Find one part from whatever you know, then the rest.",
    ),

    questionSet(
      "Variation",
      "Share 30. Watch what changes.",
      [
        ask("Share 30 in 2 : 3. The larger share?", "18", "One part is 6.", "18.", {
          asks: "share",
          expect: [
            "Kim divides 30 by 2 and by 3. Is that right?",
            "No",
            "Divide by all 5 parts, then times: 12 and 18.",
            [["Yes", "15 and 10 add to 25, not 30."]],
          ],
        }),
        ask("Share 30 in 3 : 2. The larger share?", "18", "One part is 6.", "18.", {
          asks: "share",
          changed: "The ratio swaps order.",
        }),
        ask("Share 30 in 1 : 1 : 1. One share?", "10", "3 parts.", "10.", {
          asks: "share",
          changed: "Three people.",
        }),
        ask("Share 30 in 2 : 3. How much more is the larger?", "6", "18 − 12.", "6: one part.", {
          asks: "one part",
          changed: "The difference between them.",
        }),
      ],
      "The parts decide everything: count them first.",
    ),
    own(list, SHARING, "Spot the mistake"),

    own(list, SHARING, "Exit check"),

    reworded(list, SHARING, "A prize", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Count the parts, find one part, then each share.**"],
      bars(
        [
          ["Amy", 3],
          ["Ben", 2],
        ],
        "£40",
      ),
      [
        "**Count the parts, find one part, then each share.**",
        "£40 in 3 : 2: 5 parts, one part £8.",
        "So £24 and £16. Check they add to £40.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Part to whole.

const PART_WHOLE = "y7-ratio/part-whole";
const partWholeMethod = [
  "Add the parts to get the whole.",
  "Each part is a fraction of the whole.",
  "Find that fraction of the amount.",
];

const partWhole = stepped(find(list, PART_WHOLE), {
  method: partWholeMethod,
  variation: {
    relationship: "a part : part ratio, the whole, and each part as a fraction",
    unknowns: ["fraction", "amount"],
    surface: ["part : whole", "three colours", "drinks", "beads"],
  },
  screens: worded([
    explain(
      "The rule",
      "Part to whole",
      ["**Part : whole is a fraction. 2 : 5 means two fifths.**"],
      bars([["drink", 5, 1]]),
      "Squash : water = 1 : 4 is 5 parts, so squash is $\\frac15$.",
    ),
    reworded(list, PART_WHOLE, "Boys : girls = 2 : 3. What fraction are girls?", {
      tag: "The rule",
    }),

    ...owned(list, PART_WHOLE, "Warm-up", "Check you remember"),
    typed("Check you remember", "What is $\\frac23$ of 30?", "20", "A third of 30 is 10.", "20."),

    methodCard("The method", partWholeMethod, bars([["", 7, 2]], "63")),
    worked(
      "Watch the method",
      "Red beads : all beads = 2 : 7. There are 63 beads. How many are red?",
      [
        { line: "Red is $\\frac27$ of all the beads." },
        { line: "$\\frac17$ of 63 is 9", note: "One part." },
        { line: "$2 \\times 9 = 18$ red" },
      ],
      "18 red beads.",
      bars([["", 7, 2]], "63"),
    ),
    calc(
      "Your turn",
      "Boys : girls = 2 : 3. 30 pupils. How many girls?",
      bars([["class", 5, 3]], "30"),
      [
        ["Parts in all:", "5", "2 + 3."],
        ["One fifth of 30:", "6", "30 ÷ 5."],
        ["Girls: $3 \\times 6 =$", "18", "Girls are 3 parts."],
      ],
      "18 girls.",
    ),

    calc(
      "Practise",
      "Squash : whole = 1 : 6. How much squash in 1.8 litres?",
      bars([["jug", 6, 1]], "1.8 l"),
      [["$1.8 \\div 6 =$", "0.3", "Squash is one sixth."]],
      "0.3 litres.",
    ),
    ...owned(list, PART_WHOLE, "Together", "Practise").filter(
      (s) => s.title !== "Girls in a class",
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask(
          "Red : green = 3 : 5. What fraction are green?",
          "5/8",
          "8 parts in all.",
          "$\\frac58$.",
          {
            asks: "fraction",
            picture: bars([["beads", 8, 5]]),
          },
        ),
        ask(
          "Boys : girls = 1 : 4. What fraction are boys?",
          "1/5",
          "5 parts in all.",
          "$\\frac15$.",
          {
            asks: "fraction",
            changed: "A different ratio.",
          },
        ),
        ask("Red : all = 3 : 10. 50 sweets. How many red?", "15", "$\\frac{3}{10}$ of 50.", "15.", {
          asks: "amount",
          changed: "Part : whole, and an amount.",
        }),
        ask(
          "Juice : water = 1 : 3. What fraction is juice?",
          "1/4",
          "4 parts in all.",
          "$\\frac14$.",
          {
            asks: "fraction",
            changed: "Back to part : part.",
          },
        ),
      ],
      "Part : part means add for the whole. Part : whole is a fraction already.",
    ),

    questionSet(
      "Variation",
      "What fraction is red? Watch what changes.",
      [
        ask("Red : blue = 1 : 3.", "1/4", "4 parts in all.", "$\\frac14$.", {
          asks: "fraction",
          picture: bars([["counters", 4, 1]]),
          expect: [
            "Leo says a third are red. Is he right?",
            "No: a quarter",
            "Red is 1 part out of 1 + 3 = 4.",
            [["Yes", "1 : 3 is part to part. Add them for the whole."]],
          ],
        }),
        ask("Red : all = 1 : 3.", "1/3", "Part : whole already.", "$\\frac13$.", {
          asks: "fraction",
          changed: "Now part : whole.",
          picture: bars([["counters", 3, 1]]),
        }),
        ask("Red : blue = 2 : 3.", "2/5", "5 parts in all.", "$\\frac25$.", {
          asks: "fraction",
          changed: "Two parts red.",
          picture: bars([["counters", 5, 2]]),
        }),
        ask("Red : blue : green = 1 : 2 : 2.", "1/5", "5 parts in all.", "$\\frac15$.", {
          asks: "fraction",
          changed: "Three colours.",
          picture: bars([["counters", 5, 1]]),
        }),
      ],
      "For the whole, add every part.",
    ),
    {
      ...own(list, PART_WHOLE, "Spot the mistake"),
      text: "Cats : dogs = 2 : 3, 40 animals. Ivy finds the cats.",
    } as Screen,

    own(list, PART_WHOLE, "Exit check"),

    reworded(list, PART_WHOLE, "Squash", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Part : whole is a fraction. 2 : 5 means two fifths.**"],
      bars([["drink", 5, 1]]),
      [
        "**Part : whole is a fraction. 2 : 5 means two fifths.**",
        "Part : part? Add the parts for the whole.",
        "Squash : water = 1 : 4, so squash is $\\frac15$.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// A division as a ratio.

const DIVISION = "y7-ratio/division";
const divisionMethod = [
  "For n : 1, divide the first by the second.",
  "For 1 : n, divide the second by the first.",
  "Same units first.",
];

const division = stepped(find(list, DIVISION), {
  method: divisionMethod,
  variation: {
    relationship: "a division and the ratio to 1 it gives",
    unknowns: ["n : 1", "1 : n", "ratio"],
    surface: ["decimals", "maps", "fuel", "the order"],
  },
  screens: worded([
    explain(
      "The rule",
      "A division as a ratio",
      ["**A division gives a ratio to 1.**", "$12 \\div 3 = 4$, so $12 : 3 = 4 : 1$."],
      bars([
        ["a", 4],
        ["b", 1],
      ]),
      "a is 4 times as big as b.",
    ),

    ...owned(list, DIVISION, "Warm-up", "Check you remember"),
    typed("Check you remember", "What is $35 \\div 7$?", "5", "How many 7s in 35?", "5."),

    methodCard("The method", divisionMethod, maths("60 : 5 = 12 : 1")),
    worked(
      "Watch the method",
      "A car goes 60 km on 5 litres. Write km : litres as n : 1.",
      [
        { line: "$60 \\div 5 = 12$", note: "Divide the first by the second." },
        { line: "60 : 5 = 12 : 1" },
      ],
      "12 : 1: 12 km for every litre.",
    ),
    calc(
      "Your turn",
      "Write 18 : 4 in the form n : 1.",
      undefined,
      [["$18 \\div 4 =$", "4.5", "Divide the first by the second."]],
      "4.5 : 1.",
    ),

    calc(
      "Practise",
      "Write 4 : 18 in the form 1 : n.",
      undefined,
      [["$18 \\div 4 =$", "4.5", "Divide the second by the first."]],
      "1 : 4.5.",
    ),
    ...owned(list, DIVISION, "Together", "Practise").filter((s) => !s.title.includes("1 : n")),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("$p \\div q = 6$. Write $p : q$.", "6 : 1", "p is 6 times q.", "6 : 1.", {
          asks: "ratio",
          others: ["1 : 6", "p : 6"],
        }),
        ask("Write 35 : 7 as n : 1. What is n?", "5", "35 ÷ 7.", "5.", {
          asks: "n : 1",
          changed: "Now find n.",
        }),
        ask("Write 3 : 12 as 1 : n. What is n?", "4", "12 ÷ 3.", "4.", {
          asks: "1 : n",
          changed: "Now 1 : n.",
        }),
        ask("$x \\div y = 5$. Write $x : y$.", "5 : 1", "x is 5 times y.", "5 : 1.", {
          asks: "ratio",
          changed: "Different letters.",
          others: ["1 : 5", "x : 5"],
        }),
      ],
      "n : 1 divides the first by the second; 1 : n the other way.",
    ),

    questionSet(
      "Variation",
      "Find each one. Watch what changes.",
      [
        ask("$a \\div b = 3$. Write $a : b$.", "3 : 1", "a is 3 times b.", "3 : 1.", {
          asks: "ratio",
          others: ["1 : 3", "a : 3"],
          expect: [
            "Mo writes $a : b = 1 : 3$. Is he right?",
            "No: 3 : 1",
            "a is 3 times b, so a's part is 3.",
            [["Yes", "That says b is 3 times a."]],
          ],
        }),
        ask("Write 20 : 8 as n : 1. What is n?", "2.5", "20 ÷ 8.", "2.5.", {
          asks: "n : 1",
          changed: "n isn't a whole number.",
        }),
        ask("Write 6 : 6 as n : 1. What is n?", "1", "6 ÷ 6.", "1.", {
          asks: "n : 1",
          changed: "Both the same.",
        }),
        ask("Map: 1 cm to 500 m. Find n in 1 : n.", "50000", "500 m is 50 000 cm.", "1 : 50 000.", {
          asks: "1 : n",
          changed: "Units first: metres to centimetres.",
        }),
      ],
      "Divide to get a ratio to 1, in the same units.",
    ),
    own(list, DIVISION, "Spot the mistake"),

    own(list, DIVISION, "Exit check"),

    reworded(list, DIVISION, "How many times bigger?", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**A division gives a ratio to 1.**"],
      bars([
        ["a", 4],
        ["b", 1],
      ]),
      [
        "**A division gives a ratio to 1.**",
        "$12 \\div 3 = 4$, so $12 : 3 = 4 : 1$.",
        "For 1 : n, divide the second by the first.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// One as a fraction of another.

const FRACTION_OF = "y7-ratio/fraction-of";
const fractionOfMethod = ["Write both in the same units.", "Part over whole.", "Simplify."];

const fractionOf = stepped(find(list, FRACTION_OF), {
  method: fractionOfMethod,
  variation: {
    relationship: "a part, a whole, and the fraction one is of the other",
    unknowns: ["fraction", "whole"],
    surface: ["hours and minutes", "days", "money", "kilograms"],
  },
  screens: worded([
    explain(
      "The rule",
      "One as a fraction of another",
      ["**Put the part over the whole, in the same units.**"],
      bars([["20", 4, 1]]),
      "What fraction of 20 is 5? $\\frac{5}{20} = \\frac14$.",
    ),
    reworded(list, FRACTION_OF, "What fraction of 12 is 3?", { tag: "The rule" }),

    ...owned(list, FRACTION_OF, "Warm-up", "Check you remember"),
    typed("Check you remember", "How many grams in 1 kg?", "1000", "Kilo means 1000.", "1000 g.", {
      unit: "g",
    }),

    methodCard("The method", fractionOfMethod, maths("\\frac{400}{2000} = \\frac15")),
    worked(
      "Watch the method",
      "What fraction of 2 kg is 400 g?",
      [
        { line: "2 kg = 2000 g", note: "The same units first." },
        { line: "$\\frac{400}{2000}$", note: "Part over whole." },
        { line: "$= \\frac15$" },
      ],
      "$\\frac15$.",
    ),
    calc(
      "Your turn",
      "What fraction of 50 is 20?",
      undefined,
      [
        ["The whole is", "50", "'Of 50': the whole goes underneath."],
        ["$\\frac{20}{50}$ simplified is", "2/5", "Divide the top and bottom by 10."],
      ],
      "$\\frac25$.",
    ),

    calc(
      "Practise",
      "What fraction of 1 metre is 30 cm?",
      undefined,
      [
        ["1 metre in centimetres:", "100", "The same units first."],
        ["$\\frac{30}{100}$ simplified is", "3/10", "Divide the top and bottom by 10."],
      ],
      "$\\frac{3}{10}$.",
    ),
    ...owned(list, FRACTION_OF, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("What fraction of 24 is 6?", ["1/4", "6/24"], "$\\frac{6}{24}$.", "$\\frac14$.", {
          asks: "fraction",
        }),
        ask(
          "What fraction of an hour is 20 minutes?",
          ["1/3", "20/60"],
          "$\\frac{20}{60}$.",
          "$\\frac13$.",
          {
            asks: "fraction",
            changed: "Units: an hour is 60 minutes.",
          },
        ),
        ask(
          "What fraction of 1 kg is 250 g?",
          ["1/4", "250/1000"],
          "$\\frac{250}{1000}$.",
          "$\\frac14$.",
          {
            asks: "fraction",
            changed: "Units: 1000 g in a kilogram.",
          },
        ),
        ask("6 is a quarter of what?", "24", "Four quarters make the whole.", "24.", {
          asks: "whole",
          changed: "Now find the whole.",
        }),
      ],
      "Same units, part over whole, simplify.",
    ),

    questionSet(
      "Variation",
      "What fraction? Watch what changes.",
      [
        ask(
          "What fraction of an hour is 15 minutes?",
          ["1/4", "15/60"],
          "$\\frac{15}{60}$.",
          "$\\frac14$.",
          {
            asks: "fraction",
            expect: [
              "Sam writes $\\frac{15}{100}$. Is he right?",
              "No",
              "An hour is 60 minutes, not 100: $\\frac{15}{60} = \\frac14$.",
              [["Yes", "There aren't 100 minutes in an hour."]],
            ],
          },
        ),
        ask(
          "What fraction of a day is 6 hours?",
          ["1/4", "6/24"],
          "A day is 24 hours.",
          "$\\frac14$.",
          {
            asks: "fraction",
            changed: "A day: 24 hours.",
          },
        ),
        ask(
          "What fraction of a year is 3 months?",
          ["1/4", "3/12"],
          "A year is 12 months.",
          "$\\frac14$.",
          {
            asks: "fraction",
            changed: "A year: 12 months.",
          },
        ),
        ask("What fraction of £1 is 25p?", ["1/4", "25/100"], "£1 is 100p.", "$\\frac14$.", {
          asks: "fraction",
          changed: "Money: 100p in £1.",
        }),
      ],
      "Different units, the same quarter: always convert first.",
    ),
    own(list, FRACTION_OF, "Spot the mistake"),

    own(list, FRACTION_OF, "Exit check"),

    reworded(list, FRACTION_OF, "Screen time", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Put the part over the whole, in the same units.**"],
      bars([["20", 4, 1]]),
      [
        "**Put the part over the whole, in the same units.**",
        "What fraction of 20 is 5? $\\frac{5}{20} = \\frac14$",
        "400 g of 2 kg: $\\frac{400}{2000} = \\frac15$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// More than the whole.

const MORE = "y7-ratio/more-than-one";
const moreMethod = [
  "Part over whole, as always.",
  "Simplify.",
  "Over 1? Write it as a mixed number too.",
];

const moreThanOne = stepped(find(list, MORE), {
  method: moreMethod,
  variation: {
    relationship: "a part bigger than the whole, as a fraction over 1",
    unknowns: ["fraction", "mixed number"],
    surface: ["swapped numbers", "the same as the whole", "double", "plants"],
  },
  screens: worded([
    explain(
      "The rule",
      "More than the whole",
      ["**When the part is bigger than the whole, the fraction is over 1.**"],
      bars([
        ["8", 2, 2],
        ["12", 3, 3],
      ]),
      "12 is one and a half times 8: $\\frac{12}{8} = \\frac32$.",
    ),
    reworded(list, MORE, "What fraction of 8 is 12?", { tag: "The rule" }),

    ...owned(list, MORE, "Warm-up", "Check you remember"),
    typed(
      "Check you remember",
      "Simplify $\\frac{15}{6}$.",
      "5/2",
      "Divide the top and bottom by 3.",
      "$\\frac52$.",
    ),

    methodCard("The method", moreMethod, maths("\\frac{35}{20} = \\frac74 = 1\\tfrac34")),
    worked(
      "Watch the method",
      "What fraction of 20 is 35?",
      [
        { line: "$\\frac{35}{20}$", note: "Part over whole, even when it's bigger." },
        { line: "$= \\frac74 = 1\\frac34$" },
      ],
      "$\\frac74$, or $1\\frac34$.",
    ),
    calc(
      "Your turn",
      "What fraction of 6 is 15?",
      undefined,
      [
        ["$\\frac{15}{6}$ simplified is", "5/2", "Divide the top and bottom by 3."],
        ["As a mixed number:", "2 1/2", "5 halves is 2 and a half."],
      ],
      "$\\frac52 = 2\\frac12$.",
    ),

    calc(
      "Practise",
      "What fraction of £4 is £5?",
      undefined,
      [
        ["Part over whole:", "5/4", "£5 over £4."],
        ["As a mixed number:", "1 1/4", "5 quarters is 1 and a quarter."],
      ],
      "$\\frac54 = 1\\frac14$.",
    ),
    ...owned(list, MORE, "Your turn", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("What fraction of 8 is 12?", ["3/2", "1 1/2"], "$\\frac{12}{8}$.", "$\\frac32$.", {
          asks: "fraction",
        }),
        ask("What fraction of 12 is 8?", "2/3", "$\\frac{8}{12}$.", "$\\frac23$.", {
          asks: "fraction",
          changed: "The numbers swap.",
        }),
        ask("What fraction of 4 is 10?", ["5/2", "2 1/2"], "$\\frac{10}{4}$.", "$\\frac52$.", {
          asks: "fraction",
          changed: "Bigger again.",
        }),
        ask("Write $\\frac74$ as a mixed number.", "1 3/4", "How many 4s in 7?", "$1\\frac34$.", {
          asks: "mixed number",
          changed: "As a mixed number.",
        }),
      ],
      "Part over whole, whichever is bigger.",
    ),

    questionSet(
      "Variation",
      "What fraction of 4? Watch what changes.",
      [
        ask("What fraction of 4 is 6?", ["3/2", "1 1/2"], "$\\frac64$.", "$\\frac32$.", {
          asks: "fraction",
          expect: [
            "Jo writes $\\frac46$, as fractions are under 1. Right?",
            "No",
            "6 is more than 4, so it's $\\frac64 = \\frac32$.",
            [["Yes", "Part over whole: 6 goes on top."]],
          ],
        }),
        ask("What fraction of 4 is 4?", "1", "$\\frac44$.", "1: the whole.", {
          asks: "fraction",
          changed: "The same as the whole.",
        }),
        ask("What fraction of 4 is 8?", "2", "$\\frac84$.", "2: double.", {
          asks: "fraction",
          changed: "Double the whole.",
        }),
        ask("What fraction of 4 is 2?", "1/2", "$\\frac24$.", "$\\frac12$.", {
          asks: "fraction",
          changed: "Smaller than the whole again.",
        }),
      ],
      "Bigger than the whole: over 1. The same: 1. Smaller: under 1.",
    ),
    own(list, MORE, "Spot the mistake"),

    own(list, MORE, "Exit check"),

    reworded(list, MORE, "A growing plant", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**When the part is bigger than the whole, the fraction is over 1.**"],
      bars([
        ["8", 2, 2],
        ["12", 3, 3],
      ]),
      [
        "**When the part is bigger than the whole, the fraction is over 1.**",
        "What fraction of 8 is 12? $\\frac{12}{8} = \\frac32 = 1\\frac12$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7RatioStepped: [string, UnitLesson[]][] = [
  [NOTATION, [notation]],
  [SHARING, [sharing]],
  [PART_WHOLE, [partWhole]],
  [DIVISION, [division]],
  [FRACTION_OF, [fractionOf]],
  [MORE, [moreThanOne]],
];
