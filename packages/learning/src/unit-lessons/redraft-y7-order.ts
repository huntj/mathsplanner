// Year 7, "The order of operations", on the stepped template (docs/proposals/lesson-stepped.md):
// brackets first, where powers go, reciprocals, and using a calculator well. These are number
// lessons, so most questions are worded; each says so.
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
import { find, own, reworded, stepped, tagged } from "./stepped.ts";
import type { Picture, Screen, UnitLesson } from "./types.ts";
import { y7OrderOfOperations } from "./y7-order-of-operations.ts";

const NUMBER = "A calculation: there is nothing to draw.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });

/** Every screen in a lesson of sums is worded: say so once for each. */
const worded = (screens: Screen[]): Screen[] =>
  screens.map((s) =>
    ["answer", "choice", "calc", "set", "steps"].includes(s.kind) && !s.wordsOnly
      ? { ...s, wordsOnly: NUMBER }
      : s,
  );

const list = y7OrderOfOperations;

// ---------------------------------------------------------------------------------------------
// Brackets first.

const BRACKETS = "y7-order-of-operations/brackets";
const bracketsMethod = [
  "Brackets first.",
  "Then × and ÷, left to right.",
  "Then + and −, left to right.",
];

const brackets = stepped(find(list, BRACKETS), {
  method: bracketsMethod,
  variation: {
    relationship: "a calculation and the order its parts are done in",
    unknowns: ["brackets first", "× first", "left to right"],
    surface: ["where the × is", "brackets", "÷", "left to right mistake", "shopping"],
  },
  screens: worded([
    explain(
      "The rule",
      "Which comes first?",
      ["**Brackets first, then × and ÷, then + and −.**"],
      maths("2 + 3 \\times 4 = 2 + 12 = 14"),
      "Everyone uses the same order, so everyone gets the same answer.",
    ),
    explain(
      "The rule",
      "Why × comes first",
      ["$3 \\times 4$ is $4 + 4 + 4$.", "So $2 + 3 \\times 4 = 2 + 4 + 4 + 4 = 14$."],
      maths("(2 + 3) \\times 4 = 20"),
      "Brackets change the order on purpose.",
    ),

    typed("Check you remember", "What is $3 \\times 4$?", "12", "3 fours.", "12."),
    typed("Check you remember", "What is $5 + 12$?", "17", "Count on from 12.", "17."),
    typed("Check you remember", "What is $12 \\div 4$?", "3", "How many 4s make 12?", "3."),

    methodCard("The method", bracketsMethod, maths("20 - 4 \\times 3 + 2")),
    worked(
      "Watch the method",
      "Work out $20 - 4 \\times 3 + 2$.",
      [
        { line: "$4 \\times 3 = 12$", note: "× before + and −." },
        { line: "$20 - 12 + 2$" },
        { line: "$= 8 + 2 = 10$", note: "Then + and −, left to right." },
      ],
      "10.",
    ),
    calc(
      "Your turn",
      "Work out $5 + 6 \\times 2$.",
      undefined,
      [
        ["$6 \\times 2 =$", "12", "× comes first."],
        ["$5 + 12 =$", "17", "Then add."],
      ],
      "17.",
    ),

    calc(
      "Practise",
      "Work out $3 \\times (8 - 5) + 1$.",
      undefined,
      [
        ["$8 - 5 =$", "3", "Brackets first."],
        ["$3 \\times 3 =$", "9", "Then the ×."],
        ["$9 + 1 =$", "10", "Then the +."],
      ],
      "10.",
    ),
    questionSet(
      "Practise",
      "What comes first? Watch what changes.",
      [
        ask("Work out $(6 + 4) \\div 2$.", "5", "Brackets first: 10 ÷ 2.", "5.", {
          asks: "brackets first",
        }),
        ask("Work out $6 + 4 \\div 2$.", "8", "÷ before +.", "8.", {
          asks: "× first",
          changed: "No brackets now.",
          expect: [
            "Without brackets, which is done first?",
            "the ÷",
            "÷ before +: 4 ÷ 2 = 2, then 6 + 2 = 8.",
            [["the +", "+ waits until × and ÷ are done."]],
          ],
        }),
        ask("Work out $12 \\div 4 \\times 3$.", "9", "Left to right: 12 ÷ 4 first.", "9.", {
          asks: "left to right",
          changed: "Just ÷ and ×: left to right.",
        }),
        ask("Work out $10 - 2 \\times 3$.", "4", "× first: 10 − 6.", "4.", {
          asks: "× first",
          changed: "Kim goes left to right. Watch out.",
        }),
      ],
      "Brackets, then × and ÷, then + and −.",
    ),

    questionSet(
      "Variation",
      "Work out each one. Watch what changes.",
      [
        ask("Work out $2 + 3 \\times 4$.", "14", "× first.", "14.", { asks: "× first" }),
        ask("Work out $(2 + 3) \\times 4$.", "20", "Brackets first: 5 × 4.", "20.", {
          asks: "brackets first",
          changed: "Brackets round the +.",
        }),
        ask("Work out $2 \\times 3 + 4$.", "10", "× first: 6 + 4.", "10.", {
          asks: "× first",
          changed: "The × moves to the front.",
        }),
        ask("Work out $2 \\times (3 + 4)$.", "14", "Brackets first: 2 × 7.", "14.", {
          asks: "brackets first",
          changed: "Brackets again.",
        }),
      ],
      "The same numbers give different answers: the order matters.",
    ),
    own(list, BRACKETS, "Spot the mistake"),

    own(list, BRACKETS, "Exit check"),

    typed(
      "Real life",
      "A ruler is £2. Three pens are £4 each. What's the total?",
      "14",
      "$2 + 3 \\times 4$: the pens first.",
      "£14: $2 + 3 \\times 4 = 2 + 12$.",
      { picture: maths("2 + 3 \\times 4") },
    ),

    summary(
      "What to remember",
      ["**Brackets first, then × and ÷, then + and −.**"],
      maths("2 + 3 \\times 4 = 14"),
      [
        "**Brackets first, then × and ÷, then + and −.**",
        "× and ÷ left to right; + and − left to right.",
        "$2 + 3 \\times 4 = 14$, but $(2 + 3) \\times 4 = 20$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Powers and roots in the order.

const POWERS = "y7-order-of-operations/powers";
const powersMethod = [
  "Brackets first.",
  "Then powers and roots.",
  "Then × and ÷.",
  "Then + and −.",
];

const powers = stepped(find(list, POWERS), {
  method: powersMethod,
  variation: {
    relationship: "a calculation with powers and the order its parts are done in",
    unknowns: ["power first", "brackets first", "root first"],
    surface: ["brackets round the power", "a root", "a minus in front", "areas"],
  },
  screens: worded([
    explain(
      "The rule",
      "Powers and roots in the order",
      ["**Powers and roots come after brackets, before × and ÷.**"],
      maths("2 \\times 3^2 = 2 \\times 9 = 18"),
      "A power is a bundle of multiplying, so it goes first.",
    ),

    typed("Check you remember", "What is $5^2$?", "25", "5 times 5.", "25."),
    typed("Check you remember", "What is $\\sqrt{49}$?", "7", "What times itself is 49?", "7."),
    typed("Check you remember", "Work out $2 + 3 \\times 4$.", "14", "× before +.", "14."),

    methodCard("The method", powersMethod, maths("4 + 2 \\times 5^2")),
    worked(
      "Watch the method",
      "Work out $4 + 2 \\times 5^2$.",
      [
        { line: "$5^2 = 25$", note: "The power first." },
        { line: "$2 \\times 25 = 50$" },
        { line: "$4 + 50 = 54$" },
      ],
      "54.",
    ),
    calc(
      "Your turn",
      "Work out $10 - 2^3$.",
      undefined,
      [
        ["$2^3 =$", "8", "The power first: 2 × 2 × 2."],
        ["$10 - 8 =$", "2", "Then take away."],
      ],
      "2.",
    ),

    calc(
      "Practise",
      "Work out $3 \\times (4 + 1)^2$.",
      undefined,
      [
        ["$4 + 1 =$", "5", "Brackets first."],
        ["$5^2 =$", "25", "Then the power."],
        ["$3 \\times 25 =$", "75", "Then the ×."],
      ],
      "75.",
    ),
    questionSet(
      "Practise",
      "What comes first? Watch what changes.",
      [
        ask("Work out $2 \\times 3^2$.", "18", "The power first: 2 × 9.", "18.", {
          asks: "power first",
        }),
        ask("Work out $(2 \\times 3)^2$.", "36", "Brackets first: $6^2$.", "36.", {
          asks: "brackets first",
          changed: "Brackets round the ×.",
        }),
        ask("Work out $20 - \\sqrt{16} \\times 3$.", "8", "The root first: 20 − 4 × 3.", "8.", {
          asks: "root first",
          changed: "A root this time.",
        }),
        ask("Work out $(1 + 2)^2$.", "9", "Brackets first: $3^2$.", "9.", {
          asks: "brackets first",
          changed: "Brackets round a +.",
        }),
      ],
      "Brackets, then powers and roots, then × and ÷, then + and −.",
    ),

    questionSet(
      "Variation",
      "Work out each one. Watch what changes.",
      [
        ask("Work out $3^2 - 2^2$.", "5", "Powers first: 9 − 4.", "5.", { asks: "power first" }),
        ask("Work out $(3 - 2)^2$.", "1", "Brackets first: $1^2$.", "1.", {
          asks: "brackets first",
          changed: "Brackets round the −.",
          expect: [
            "Is $(3 - 2)^2$ the same as $3^2 - 2^2$?",
            "No",
            "$(3 - 2)^2 = 1$, but $3^2 - 2^2 = 5$.",
            [["Yes", "Work out both: 1 and 5."]],
          ],
        }),
        ask("Work out $4 \\times 3^2$.", "36", "The power first: 4 × 9.", "36.", {
          asks: "power first",
          changed: "A × in front of the power.",
        }),
        ask("Work out $-3^2$.", "-9", "Square 3 first, then the minus.", "−9.", {
          asks: "power first",
          changed: "A minus in front.",
          expect: [
            "The power goes first. So $-3^2$ is…",
            "−9",
            "Square the 3, then the minus: −9.",
            [["9", "That's $(-3)^2$. Without brackets, the power goes first."]],
          ],
        }),
      ],
      "The power is done before anything but brackets.",
    ),
    own(list, POWERS, "Spot the mistake"),

    own(list, POWERS, "Exit check"),

    reworded(list, POWERS, "A square patio", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Powers and roots come after brackets, before × and ÷.**"],
      maths("2 \\times 3^2 = 18"),
      [
        "**Powers and roots come after brackets, before × and ÷.**",
        "Brackets, powers, × and ÷, + and − (BIDMAS).",
        "$4 + 2 \\times 5^2 = 4 + 50 = 54$",
        "$-3^2 = -9$, but $(-3)^2 = 9$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Reciprocals.

const RECIPROCALS = "y7-order-of-operations/reciprocals";
const reciprocalsMethod = [
  "The reciprocal is 1 divided by the number.",
  "For a fraction, turn it upside down.",
  "To divide, times by the reciprocal.",
];

const reciprocals = stepped(find(list, RECIPROCALS), {
  method: reciprocalsMethod,
  variation: {
    relationship: "a number and its reciprocal multiply to 1",
    unknowns: ["reciprocal", "division"],
    surface: ["whole numbers", "fractions", "decimals", "dividing", "ribbon"],
  },
  screens: worded([
    explain(
      "The rule",
      "Reciprocals",
      ["**A number times its reciprocal makes 1.**"],
      maths("4 \\times \\tfrac14 = 1"),
      "For a fraction, turn it upside down: $\\frac23$ becomes $\\frac32$.",
    ),
    tagged(
      "The rule",
      explore(
        "Slide the number",
        {
          kind: "line",
          min: 1,
          max: 10,
          step: 0.5,
          start: 2,
          tick: 1,
          dp: 1,
          readouts: [
            { label: "The number", value: true },
            { label: "Its reciprocal", power: -1, dp: 3 },
          ],
        },
        [
          "What did you notice?",
          "The bigger the number, the smaller its reciprocal",
          "1 shared by a bigger number gives less: 1 ÷ 4 is 0.25.",
          [
            ["The reciprocal is the number with a minus", "The reciprocal of 2 is 0.5, not −2."],
            ["The reciprocal is always 0.5", "Slide to 4: it's 0.25."],
          ],
        ],
        "The reciprocal is 1 divided by the number.",
        { text: "Slide the number. Watch its reciprocal." },
      ),
    ),

    typed("Check you remember", "What is $\\frac12$ of 10?", "5", "Half of 10.", "5."),
    typed("Check you remember", "What is $10 \\div 2$?", "5", "How many 2s in 10?", "5."),
    typed(
      "Check you remember",
      "What is $\\frac23 \\times 3$?",
      "2",
      "3 thirds make 1, so 2 × 1.",
      "2.",
    ),

    methodCard("The method", reciprocalsMethod, maths("6 \\div \\tfrac13 = 6 \\times 3 = 18")),
    worked(
      "Watch the method",
      "Find the reciprocal of $\\frac34$, and check.",
      [
        { line: "Turn it upside down: $\\frac43$" },
        {
          line: "Check: $\\frac34 \\times \\frac43 = \\frac{12}{12} = 1$",
          note: "Times its reciprocal, it makes 1.",
        },
      ],
      "$\\frac43$.",
    ),
    calc(
      "Your turn",
      "Work out $6 \\div \\frac13$.",
      undefined,
      [
        ["The reciprocal of $\\frac13$ is", "3", "Turn it upside down: $\\frac31$ is 3."],
        ["$6 \\times 3 =$", "18", "Times by the reciprocal."],
      ],
      "18: there are 18 thirds in 6.",
    ),

    calc(
      "Practise",
      "Work out $4 \\div \\frac14$.",
      undefined,
      [
        ["The reciprocal of $\\frac14$ is", "4", "Turn it upside down."],
        ["$4 \\times 4 =$", "16", "Times by the reciprocal."],
      ],
      "16: there are 16 quarters in 4.",
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("The reciprocal of 8 is", ["1/8", "0.125"], "1 divided by 8.", "$\\frac18$.", {
          asks: "reciprocal",
        }),
        ask("The reciprocal of 0.5 is", "2", "0.5 × 2 = 1.", "2.", {
          asks: "reciprocal",
          changed: "A decimal.",
        }),
        ask(
          "The reciprocal of $\\frac35$ is",
          ["5/3", "1 2/3"],
          "Turn it upside down.",
          "$\\frac53$.",
          {
            asks: "reciprocal",
            changed: "A fraction: turn it upside down.",
          },
        ),
        ask("Work out $3 \\div \\frac12$.", "6", "Times by 2.", "6.", {
          asks: "division",
          changed: "Now use it to divide.",
        }),
      ],
      "1 divided by the number; for a fraction, upside down.",
    ),

    questionSet(
      "Variation",
      "Find each one. Watch what changes.",
      [
        ask("The reciprocal of 5 is", ["1/5", "0.2"], "1 divided by 5.", "$\\frac15$.", {
          asks: "reciprocal",
          expect: [
            "Jo says the reciprocal of 5 is −5. Is she right?",
            "No",
            "5 × −5 is −25, not 1. It's $\\frac15$.",
            [["Yes", "A reciprocal multiplies to 1, not to a minus."]],
          ],
        }),
        ask("The reciprocal of $\\frac15$ is", "5", "Turn it upside down: $\\frac51$.", "5.", {
          asks: "reciprocal",
          changed: "Now the other way round.",
        }),
        ask("The reciprocal of 1 is", "1", "1 × 1 = 1.", "1.", {
          asks: "reciprocal",
          changed: "The number 1 itself.",
        }),
        ask("Work out $10 \\div \\frac25$.", "25", "$10 \\times \\frac52$.", "25.", {
          asks: "division",
          changed: "Divide by a fraction that isn't 1 over something.",
        }),
      ],
      "A number and its reciprocal always multiply to 1.",
    ),
    own(list, RECIPROCALS, "Spot the mistake"),

    own(list, RECIPROCALS, "Exit check"),

    typed(
      "Real life",
      "A 6 m ribbon is cut into pieces $\\frac25$ m long. How many pieces?",
      "15",
      "$6 \\div \\frac25 = 6 \\times \\frac52$.",
      "15 pieces.",
    ),

    summary(
      "What to remember",
      ["**A number times its reciprocal makes 1.**"],
      maths("4 \\times \\tfrac14 = 1"),
      [
        "**A number times its reciprocal makes 1.**",
        "For a fraction, turn it upside down.",
        "To divide, times by the reciprocal.",
        "$6 \\div \\frac13 = 6 \\times 3 = 18$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Using a calculator well.

const CALCULATOR = "y7-order-of-operations/calculator";
const calculatorMethod = [
  "Estimate first.",
  "Key it in, with brackets round a top or bottom.",
  "Check it against your estimate.",
  "Make sense of it: money, people, boxes.",
];

const calculator = stepped(find(list, CALCULATOR), {
  method: calculatorMethod,
  variation: {
    relationship: "a calculation, how it is keyed in, and what the answer means",
    unknowns: ["value", "estimate", "rounded answer"],
    surface: ["fractions to key in", "money", "rounding up", "means", "trips"],
  },
  screens: worded([
    explain(
      "The rule",
      "Using a calculator well",
      ["**Put brackets round a sum before you divide it.**"],
      maths("\\frac{20 + 10}{5} = (20 + 10) \\div 5"),
      "A calculator does ÷ before +, just like you.",
    ),
    explain(
      "The rule",
      "Estimate first",
      ["Round each number to 1 significant figure first."],
      maths("\\frac{48.7 \\times 3.1}{9.8} \\approx \\frac{50 \\times 3}{10} = 15"),
      "If the calculator is far off, you mistyped.",
    ),

    typed(
      "Check you remember",
      "Round 387 to the nearest hundred.",
      "400",
      "Nearer 300 or 400?",
      "400.",
    ),
    typed(
      "Check you remember",
      "Work out $(4 + 6) \\div 2$.",
      "5",
      "Brackets first: 10 ÷ 2.",
      "5.",
    ),
    typed("Check you remember", "Work out $20 + 10 \\div 5$.", "22", "÷ before +.", "22."),

    methodCard("The method", calculatorMethod, maths("(36 + 54) \\div 15")),
    worked(
      "Watch the method",
      "Share £50 between 3 people.",
      [
        { line: "$50 \\div 3 = 16.666\\ldots$" },
        { line: "Money has 2 decimal places: £16.67", note: "Round to the nearest penny." },
        { line: "Check: $3 \\times 16.67 = 50.01$", note: "One person pays a penny less." },
      ],
      "£16.67 each, near enough.",
    ),
    calc(
      "Your turn",
      "Work out $\\frac{36 + 54}{15}$.",
      undefined,
      [
        ["$36 + 54 =$", "90", "The top first: brackets round it."],
        ["$90 \\div 15 =$", "6", "Then divide."],
      ],
      "6.",
    ),

    calc(
      "Practise",
      "130 people. A coach holds 48. How many coaches?",
      undefined,
      [
        ["$130 \\div 48$ is between 2 and", "3", "2 × 48 is 96; 3 × 48 is 144."],
        ["Coaches needed:", "3", "2 coaches leave people behind: round up."],
      ],
      "3 coaches.",
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("Work out $\\frac{25 + 15}{8}$.", "5", "The top first: 40 ÷ 8.", "5.", {
          asks: "value",
        }),
        ask(
          "Estimate $\\frac{61.2 \\times 4.9}{2.1}$.",
          "150",
          "$\\frac{60 \\times 5}{2}$.",
          "About 150.",
          { asks: "estimate", changed: "Now an estimate.", others: ["15", "1500"] },
        ),
        ask(
          "50 eggs, in boxes of 6. How many boxes?",
          "9",
          "8 boxes hold 48: not enough.",
          "9 boxes.",
          {
            asks: "rounded answer",
            changed: "Now make sense of it.",
          },
        ),
        ask(
          "£20 shared by 3. Each share, to the nearest penny?",
          "6.67",
          "20 ÷ 3 = 6.666…",
          "£6.67.",
          {
            asks: "rounded answer",
            changed: "Money: 2 decimal places.",
          },
        ),
      ],
      "Key it in carefully, then make sense of the answer.",
    ),

    questionSet(
      "Variation",
      "Work out each one. Watch what changes.",
      [
        ask("Work out $\\frac{20 + 30}{2}$.", "25", "The top first: 50 ÷ 2.", "25.", {
          asks: "value",
          expect: [
            "Tia keys in $20 + 30 \\div 2$. She gets…",
            "35, which is wrong",
            "Without brackets, the calculator does 30 ÷ 2 first.",
            [["25, the right answer", "The calculator divides first: 20 + 15 = 35."]],
          ],
        }),
        ask("Work out $20 + \\frac{30}{2}$.", "35", "Only the 30 is divided.", "35.", {
          asks: "value",
          changed: "Only the 30 is divided.",
        }),
        ask(
          "100 pupils. A minibus holds 15. How many minibuses?",
          "7",
          "6 minibuses hold 90.",
          "7.",
          {
            asks: "rounded answer",
            changed: "People: round up.",
          },
        ),
        ask("£10 buys how many £3 tickets?", "3", "4 tickets cost £12.", "3 tickets.", {
          asks: "rounded answer",
          changed: "Now round down: you can't afford part.",
        }),
      ],
      "Brackets for a whole top. Round up for people, down for what you can afford.",
    ),
    own(list, CALCULATOR, "Spot the mistake"),

    own(list, CALCULATOR, "Exit check"),

    reworded(list, CALCULATOR, "Sharing the cost", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**Put brackets round a sum before you divide it.**"],
      maths("\\frac{20 + 10}{5} = (20 + 10) \\div 5"),
      [
        "**Put brackets round a sum before you divide it.**",
        "Estimate first, then check the calculator.",
        "Money: 2 decimal places. People and boxes: round up.",
        "$\\frac{36 + 54}{15} = 90 \\div 15 = 6$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7OrderStepped: [string, UnitLesson[]][] = [
  [BRACKETS, [brackets]],
  [POWERS, [powers]],
  [RECIPROCALS, [reciprocals]],
  [CALCULATOR, [calculator]],
];
