// Year 9, "Simultaneous equations and inequalities" and "Growth, decay and proportion", on the
// stepped template (docs/proposals/lesson-stepped.md): elimination, substitution, inequalities,
// compound interest, depreciation and inverse proportion. These are algebra and number work.
import { ask, calc, explain, methodCard, questionSet, quiz, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { y9Percentages } from "./y9-percentages.ts";
import { y9Simultaneous } from "./y9-simultaneous.ts";

const SIM = y9Simultaneous;
const PC = y9Percentages;
const ALGEBRA = "Algebra: the equations are the picture.";
const NUMBER = "A calculation: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });

// ---------------------------------------------------------------------------------------------
// Elimination.

const ELIM = "y9-simultaneous/elimination";
const elimMethod = [
  "Make one letter's numbers match.",
  "Same signs: take away. Different signs: add.",
  "Solve, then put it back to find the other.",
];
const ELIMINATE = maths("\\begin{array}{l} (3x + y) - (x + y) = 11 - 5 \\\\ 2x = 6 \\end{array}");

const elimination = stepped(find(SIM, ELIM), {
  method: elimMethod,
  variation: {
    relationship: "two equations, one letter got rid of",
    unknowns: ["x", "y"],
    surface: ["adding", "taking away", "a half"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two clues",
        ["**Add or take away the equations to get rid of one letter.**"],
        ELIMINATE,
        "Same signs: take away. Different signs: add.",
      ),
      reworded(SIM, ELIM, "Coffee and cake", {
        tag: "The rule",
        text: "How much is a coffee, in £?",
      }),

      ...owned(SIM, ELIM, "Warm-up", "Check you remember"),

      methodCard("The method", elimMethod, ELIMINATE),
      workedFrom(SIM, ELIM),
      calc(
        "Your turn",
        "Solve $5x + y = 17$ and $2x + y = 8$.",
        undefined,
        [
          ["Take away: $3x =$", "9", "The y's cancel."],
          ["$x =$", "3", "Divide by 3."],
          ["$y = 8 - 6 =$", "2", "Put x back."],
        ],
        "$x = 3$, $y = 2$.",
      ),

      calc(
        "Practise",
        "Solve $3x + 2y = 12$ and $x - 2y = 4$.",
        undefined,
        [
          ["Add: $4x =$", "16", "+2y and −2y cancel."],
          ["$x =$", "4", "Divide by 4."],
          ["$y =$", "0", "$12 + 2y = 12$."],
        ],
        "$x = 4$, $y = 0$.",
      ),
      ...owned(SIM, ELIM, "Together", "Practise"),
      ...owned(SIM, ELIM, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve each pair. Watch what changes.",
        [
          ask("$x + y = 12$, $x - y = 2$. Find x.", "7", "Add: $2x = 14$.", "7.", { asks: "x" }),
          ask("$x + y = 12$, $x - y = 2$. Find y.", "5", "12 − 7.", "5.", {
            asks: "y",
            changed: "Now y.",
          }),
          ask("$3x + y = 13$, $x + y = 7$. Find x.", "3", "Take away: $2x = 6$.", "3.", {
            asks: "x",
            changed: "Take away.",
          }),
          ask("$3x + y = 13$, $x - y = 3$. Find x.", "4", "Add: $4x = 16$.", "4.", {
            asks: "x",
            changed: "Add instead.",
          }),
        ],
        "Same signs: take away. Different: add.",
      ),

      questionSet(
        "Variation",
        "$3x + 2y = 16$, and… Watch what changes.",
        [
          ask("$x + 2y = 8$. Find y.", "2", "$2x = 8$, so $x = 4$.", "2.", {
            asks: "y",
            expect: [
              "With $x = 4$, Cal gets y = 6 from $4 + 2y = 8$. Right?",
              "No",
              "$2y = 4$, so $y = 2$.",
              [["Yes", "Check: 4 + 12 isn't 8."]],
            ],
          }),
          ask("$x + 2y = 6$. Find y.", "0.5", "$2x = 10$, $x = 5$.", "0.5.", {
            asks: "y",
            changed: "A different second equation.",
          }),
          ask("$x - 2y = 0$. Find x.", "4", "Add: $4x = 16$.", "4.", {
            asks: "x",
            changed: "Add this time.",
          }),
          ask("$3x - 2y = 8$. Find y.", "2", "Add: $6x = 24$, $x = 4$.", "2.", {
            asks: "y",
            changed: "Same x numbers.",
          }),
        ],
        "Look at the signs before you choose.",
      ),
      own(SIM, ELIM, "Spot the mistake"),

      own(SIM, ELIM, "Exit check"),

      reworded(SIM, ELIM, "Cinema tickets", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Add or take away the equations to get rid of one letter.**"],
        ELIMINATE,
        [
          "**Add or take away the equations to get rid of one letter.**",
          "Same signs: take away. Different signs: add.",
          "Put the first answer back to find the second.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Substitution.

const SUB = "y9-simultaneous/substitution";
const subMethod = [
  "Find the equation that says y = (or x =).",
  "Swap it into the other, in a bracket.",
  "Solve, then put x back to find y.",
];
const SWAP = maths("y = 2x + 1: \\; 3x + (2x + 1) = 16");

const substitution = stepped(find(SIM, SUB), {
  method: subMethod,
  variation: {
    relationship: "one equation swapped into the other",
    unknowns: ["x", "y"],
    surface: ["a minus before the bracket", "x = …", "y given"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Swap it in",
        ["**If y = …, swap it into the other equation, in a bracket.**"],
        SWAP,
        "Then there's only x left to solve.",
      ),
      reworded(SIM, SUB, "Substitution", { tag: "The rule" }),

      ...owned(SIM, SUB, "Warm-up", "Check you remember"),

      methodCard("The method", subMethod, SWAP),
      workedFrom(SIM, SUB),
      calc(
        "Your turn",
        "Solve $y = x + 3$ and $3x + y = 19$.",
        undefined,
        [
          ["$3x + (x + 3) = 19$, so $4x =$", "16", "Take 3."],
          ["$x =$", "4", "Divide by 4."],
          ["$y =$", "7", "4 + 3."],
        ],
        "$x = 4$, $y = 7$.",
      ),

      calc(
        "Practise",
        "Solve $y = 2x - 1$ and $x + y = 11$.",
        undefined,
        [
          ["$x + (2x - 1) = 11$, so $3x =$", "12", "Add 1."],
          ["$x =$", "4", "Divide by 3."],
          ["$y =$", "7", "8 − 1."],
        ],
        "$x = 4$, $y = 7$.",
      ),
      ...owned(SIM, SUB, "Together", "Practise"),
      ...owned(SIM, SUB, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve each pair. Watch what changes.",
        [
          ask("$y = 4x$, $x + y = 15$. Find x.", "3", "$5x = 15$.", "3.", { asks: "x" }),
          ask("$y = 4x$, $x + y = 15$. Find y.", "12", "4 × 3.", "12.", {
            asks: "y",
            changed: "Now y.",
          }),
          ask("$x = 3y$, $x + y = 16$. Find y.", "4", "$4y = 16$.", "4.", {
            asks: "y",
            changed: "x = … this time.",
          }),
          ask("$y = x - 2$, $x + y = 10$. Find x.", "6", "$2x - 2 = 10$.", "6.", {
            asks: "x",
            changed: "A minus.",
          }),
        ],
        "Swap in, in a bracket.",
      ),

      questionSet(
        "Variation",
        "$y = 2x + 1$, and… Find x.",
        [
          ask("$4x - y = 7$", "4", "$4x - (2x + 1) = 7$.", "4.", {
            asks: "x",
            expect: [
              "Sam writes $4x - 2x + 1 = 7$. Right?",
              "No",
              "The minus takes all of y: $4x - 2x - 1 = 7$.",
              [["Yes", "Use a bracket."]],
            ],
          }),
          ask("$4x + y = 13$", "2", "$6x + 1 = 13$.", "2.", {
            asks: "x",
            changed: "Plus, not minus.",
          }),
          ask("$x + y = 10$", "3", "$3x + 1 = 10$.", "3.", {
            asks: "x",
            changed: "Just x.",
          }),
          ask("$y = 9$", "4", "$2x + 1 = 9$.", "4.", {
            asks: "x",
            changed: "y given.",
          }),
        ],
        "A bracket keeps every sign right.",
      ),
      own(SIM, SUB, "Spot the mistake"),

      own(SIM, SUB, "Exit check"),

      reworded(SIM, SUB, "A phone and its case", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**If y = …, swap it into the other equation, in a bracket.**"],
        SWAP,
        [
          "**If y = …, swap it into the other equation, in a bracket.**",
          "$4x - (2x + 1)$ is $4x - 2x - 1$.",
          "On a graph, the answer is where the lines cross.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Inequalities.

const INEQ = "y9-simultaneous/inequalities";
const ineqMethod = [
  "Solve it like an equation.",
  "Keep the inequality sign the same way.",
  "Draw it: open circle for < and >, filled for ≤ and ≥.",
];
const SOLVE = maths("3x - 2 < 10 \\;\\Rightarrow\\; x < 4");

const inequalities = stepped(find(SIM, INEQ), {
  method: ineqMethod,
  variation: {
    relationship: "an inequality, its solution and its number line",
    unknowns: ["solution", "whole number"],
    surface: ["< and ≤", "> and ≥", "biggest and smallest whole numbers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Inequalities",
        ["**Solve an inequality like an equation, keeping the sign.**"],
        SOLVE,
        "Open circle: not included. Filled circle: included.",
      ),
      reworded(SIM, INEQ, "On a number line", { tag: "The rule" }),
      reworded(SIM, INEQ, "What does this show?", { tag: "The rule" }),

      ...owned(SIM, INEQ, "Warm-up", "Check you remember"),

      methodCard("The method", ineqMethod, SOLVE),
      workedFrom(SIM, INEQ),
      calc(
        "Your turn",
        "Solve $2x + 7 > 15$.",
        undefined,
        [
          ["$2x >$", "8", "Take 7."],
          ["$x >$", "4", "Divide by 2."],
        ],
        "$x > 4$.",
      ),

      calc(
        "Practise",
        "Solve $5x - 4 \\le 21$.",
        undefined,
        [
          ["$5x \\le$", "25", "Add 4."],
          ["$x \\le$", "5", "Divide by 5."],
        ],
        "$x \\le 5$.",
      ),
      ...owned(SIM, INEQ, "Together", "Practise"),
      ...owned(SIM, INEQ, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve each one. Watch what changes.",
        [
          ask("Solve $x + 6 > 10$.", "$x > 4$", "Take 6.", "$x > 4$.", {
            asks: "solution",
            others: ["$x < 4$", "$x > 16$"],
          }),
          ask("Solve $3x \\le 18$.", "$x \\le 6$", "Divide by 3.", "$x \\le 6$.", {
            asks: "solution",
            changed: "Times, not plus.",
            others: ["$x < 6$", "$x \\ge 6$"],
          }),
          ask("The biggest whole number with $3x < 18$?", "5", "$x < 6$.", "5.", {
            asks: "whole number",
            changed: "A whole number.",
          }),
          ask("The smallest whole number with $3x \\ge 18$?", "6", "$x \\ge 6$.", "6.", {
            asks: "whole number",
            changed: "≥ this time.",
          }),
        ],
        "Solve, then read the sign.",
      ),

      questionSet(
        "Variation",
        "Solve, then draw it. Watch the sign.",
        [
          ask("$2x + 3 \\le 9$. The circle at 3 is", "filled", "≤ includes 3.", "Filled.", {
            asks: "solution",
            others: ["open"],
            expect: [
              "For $x \\le 3$, Eve draws an open circle. Right?",
              "No",
              "≤ includes 3: a filled circle.",
              [["Yes", "Does ≤ include 3?"]],
            ],
          }),
          ask("$2x + 3 < 9$. The circle at 3 is", "open", "< leaves 3 out.", "Open.", {
            asks: "solution",
            changed: "< instead.",
            others: ["filled"],
          }),
          ask("$2x + 3 \\ge 9$. The arrow points", "right", "Bigger numbers.", "Right.", {
            asks: "solution",
            changed: "≥: bigger numbers.",
            others: ["left"],
          }),
          ask("$2x + 3 > 9$. Is 3 a solution?", "No", "> leaves 3 out.", "No.", {
            asks: "solution",
            changed: "> again.",
            others: ["Yes"],
          }),
        ],
        "≤ and ≥ include the number; < and > don't.",
      ),
      own(SIM, INEQ, "Spot the mistake"),

      own(SIM, INEQ, "Exit check"),

      reworded(SIM, INEQ, "How many boxes?", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Solve an inequality like an equation, keeping the sign.**"],
        SOLVE,
        [
          "**Solve an inequality like an equation, keeping the sign.**",
          "< and >: open circle. ≤ and ≥: filled.",
          "$x < 4$: 4 itself is left out.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Compound interest.

const COMPOUND = "y9-percentages/compound-interest";
const compoundMethod = [
  "Find the multiplier: 100% + the rate, as a decimal.",
  "Raise it to the number of years.",
  "Multiply the start by it.",
];
const GROWS = maths("1000 \\times 1.1^3 = 1331");

const compound = stepped(find(PC, COMPOUND), {
  method: compoundMethod,
  variation: {
    relationship: "amount = start × multiplier^years",
    unknowns: ["multiplier", "amount"],
    surface: ["more years", "a higher rate", "more money"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Interest on the interest",
        ["**Compound interest: multiply by the same multiplier each year.**"],
        GROWS,
        "£1000, £1100, £1210, £1331: the interest earns interest.",
      ),
      reworded(PC, COMPOUND, "To increase by 10% in one step, multiply by", { tag: "The rule" }),
      reworded(PC, COMPOUND, "The same multiplier, again and again", { tag: "The rule" }),

      ...owned(PC, COMPOUND, "Warm-up", "Check you remember"),

      methodCard("The method", compoundMethod, GROWS),
      workedFrom(PC, COMPOUND),
      calc(
        "Your turn",
        "£2000 at 5% compound interest for 2 years.",
        undefined,
        [
          ["Multiplier:", "1.05", "105%."],
          ["$1.05^2 =$", "1.1025", "Two years."],
          ["$2000 \\times 1.1025 =$", "2205", "The amount.", { after: "pounds" }],
        ],
        "£2205.",
      ),

      calc(
        "Practise",
        "£800 at 10% compound interest for 3 years.",
        undefined,
        [
          ["$1.1^3 =$", "1.331", "Three years."],
          ["$800 \\times 1.331 =$", "1064.8", "The amount.", { after: "pounds" }],
        ],
        "£1064.80.",
      ),
      ...owned(PC, COMPOUND, "Together", "Practise"),
      reworded(PC, COMPOUND, "£2500 at 4% for 2 years", {
        tag: "Practise",
        text: "How much, in £?",
      }),
      reworded(PC, COMPOUND, "£400 at 2% for 3 years", {
        tag: "Practise",
        text: "How much, to the nearest penny?",
      }),
      questionSet(
        "Practise",
        "£1000 at 3% compound interest. Watch what changes.",
        [
          ask("The multiplier?", "1.03", "103%.", "1.03.", { asks: "multiplier" }),
          ask("After 1 year, in £?", "1030", "1000 × 1.03.", "£1030.", {
            asks: "amount",
            changed: "One year.",
          }),
          ask(
            "After 2 years, in £?",
            ["1060.9", "1060.90"],
            "$1000 \\times 1.03^2$.",
            "£1060.90.",
            {
              asks: "amount",
              changed: "Two years.",
            },
          ),
          ask("The multiplier for 2 years?", "$1.03^2$", "Once for each year.", "$1.03^2$.", {
            asks: "multiplier",
            changed: "As a power.",
            others: ["$1.06$", "$2 \\times 1.03$"],
          }),
        ],
        "Once for each year.",
      ),

      questionSet(
        "Variation",
        "Compound interest. Find the amount, in £.",
        [
          ask("£600 at 5% for 3 years?", ["694.58"], "$600 \\times 1.05^3$.", "£694.58.", {
            asks: "amount",
            expect: [
              "Zara adds £30 three times: £690. Right?",
              "No",
              "Each year earns on the new total: $600 \\times 1.05^3 = £694.58$.",
              [["Yes", "Year 2 earns 5% of £630."]],
            ],
          }),
          ask("£600 at 5% for 1 year?", "630", "600 × 1.05.", "£630.", {
            asks: "amount",
            changed: "One year.",
          }),
          ask("£600 at 10% for 3 years?", ["798.6", "798.60"], "$600 \\times 1.1^3$.", "£798.60.", {
            asks: "amount",
            changed: "Twice the rate.",
          }),
          ask("£1200 at 5% for 3 years?", ["1389.15"], "$1200 \\times 1.05^3$.", "£1389.15.", {
            asks: "amount",
            changed: "Twice the money.",
          }),
        ],
        "Twice the money doubles it; twice the rate does more.",
      ),
      own(PC, COMPOUND, "Spot the mistake"),

      quiz([
        [
          ["The multiplier for a 6% increase?", "1.06", ["1.6", "0.06"], "106%."],
          ["The multiplier for a 2% increase?", "1.02", ["1.2", "0.02"], "102%."],
        ],
        [
          ["£1000 at 10% for 2 years, in £?", "1210", ["1200", "1100"], "$1000 \\times 1.1^2$."],
          ["£2000 at 10% for 2 years, in £?", "2420", ["2400", "2200"], "$2000 \\times 1.1^2$."],
        ],
        [
          ["£500 at 2% for 2 years, in £?", "520.20", ["520", "510"], "$500 \\times 1.02^2$."],
          ["£400 at 5% for 2 years, in £?", "441", ["440", "420"], "$400 \\times 1.05^2$."],
        ],
      ]),

      reworded(PC, COMPOUND, "Gran's savings", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Compound interest: multiply by the same multiplier each year.**"],
        GROWS,
        [
          "**Compound interest: multiply by the same multiplier each year.**",
          "After n years: start × multiplier$^n$.",
          "4% is × 1.04, not × 1.4.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Depreciation.

const DEPRECIATION = "y9-percentages/depreciation";
const depMethod = [
  "Find what's left: 100% − the rate.",
  "Raise it to the number of years.",
  "Multiply the start by it.",
];
const LOSES = maths("12\\,000 \\times 0.85^2 = 8670");

const depreciation = stepped(find(PC, DEPRECIATION), {
  method: depMethod,
  variation: {
    relationship: "value = start × (what's left)^years",
    unknowns: ["multiplier", "value"],
    surface: ["a higher rate", "more years", "halving"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Losing value",
        ["**Depreciation: multiply by what's left, once each year.**"],
        LOSES,
        "Losing 15% keeps 85%: × 0.85 each year.",
      ),
      reworded(PC, DEPRECIATION, "Losing 15% leaves", { tag: "The rule" }),
      reworded(PC, DEPRECIATION, "Depreciation", { tag: "The rule" }),

      ...owned(PC, DEPRECIATION, "Warm-up", "Check you remember"),

      methodCard("The method", depMethod, LOSES),
      workedFrom(PC, DEPRECIATION),
      calc(
        "Your turn",
        "A £6000 car loses 20% a year. After 2 years?",
        undefined,
        [
          ["Multiplier:", "0.8", "80% is left."],
          ["$0.8^2 =$", "0.64", "Two years."],
          ["$6000 \\times 0.64 =$", "3840", "The value.", { after: "pounds" }],
        ],
        "£3840.",
      ),

      calc(
        "Practise",
        "A £900 phone loses 10% a year. After 3 years?",
        undefined,
        [
          ["$0.9^3 =$", "0.729", "Three years."],
          ["$900 \\times 0.729 =$", "656.1", "The value.", { after: "pounds" }],
        ],
        "£656.10.",
      ),
      ...owned(PC, DEPRECIATION, "Together", "Practise"),
      reworded(PC, DEPRECIATION, "£5000, losing 10% a year", {
        tag: "Practise",
        text: "Its value after 2 years, in £?",
      }),
      reworded(PC, DEPRECIATION, "A £1500 laptop, losing 30% a year", {
        tag: "Practise",
        text: "After 3 years, in £?",
      }),
      questionSet(
        "Practise",
        "A £2000 bike loses 10% a year.",
        [
          ask("The multiplier?", "0.9", "90% is left.", "0.9.", { asks: "multiplier" }),
          ask("Its value after 1 year, in £?", "1800", "2000 × 0.9.", "£1800.", {
            asks: "value",
            changed: "One year.",
          }),
          ask("After 2 years, in £?", "1620", "1800 × 0.9.", "£1620.", {
            asks: "value",
            changed: "Two years.",
          }),
          ask("After 3 years, in £?", "1458", "1620 × 0.9.", "£1458.", {
            asks: "value",
            changed: "Three years.",
          }),
        ],
        "× 0.9 each year.",
      ),

      questionSet(
        "Variation",
        "A £20 000 car. Find its value, in £.",
        [
          ask(
            "Losing 10% a year, after 2 years?",
            ["16200", "16 200"],
            "$20\\,000 \\times 0.9^2$.",
            "£16 200.",
            {
              asks: "value",
              expect: [
                "Raj takes 20% off once: £16 000. Right?",
                "No",
                "Year 2 loses 10% of £18 000: £16 200.",
                [["Yes", "Each year loses 10% of the new value."]],
              ],
            },
          ),
          ask(
            "Losing 20% a year, after 2 years?",
            ["12800", "12 800"],
            "$20\\,000 \\times 0.8^2$.",
            "£12 800.",
            {
              asks: "value",
              changed: "Twice the rate.",
            },
          ),
          ask(
            "Losing 10% a year, after 4 years?",
            ["13122", "13 122"],
            "$20\\,000 \\times 0.9^4$.",
            "£13 122.",
            {
              asks: "value",
              changed: "Four years.",
            },
          ),
          ask(
            "Losing 50% a year, after 2 years?",
            ["5000", "5 000"],
            "Half, then half again.",
            "£5000.",
            {
              asks: "value",
              changed: "Half each year.",
            },
          ),
        ],
        "Each year loses a share of what's left.",
      ),
      reworded(
        PC,
        DEPRECIATION,
        "Where did it go wrong?",
        { text: "Raj finds a £20 000 car's value after 2 years at 10%." },
        "Spot the mistake",
      ),

      quiz([
        [
          ["The multiplier for a 20% decrease?", "0.8", ["0.2", "1.2"], "80% is left."],
          ["The multiplier for a 30% decrease?", "0.7", ["0.3", "1.3"], "70% is left."],
        ],
        [
          [
            "£1000 loses 10% a year. After 2 years, in £?",
            "810",
            ["800", "900"],
            "$1000 \\times 0.9^2$.",
          ],
          [
            "£500 loses 20% a year. After 2 years, in £?",
            "320",
            ["300", "400"],
            "$500 \\times 0.8^2$.",
          ],
        ],
        [
          [
            "£400 halves in value each year. After 3 years?",
            "£50",
            ["£100", "£0"],
            "400, 200, 100, 50.",
          ],
          [
            "£800 halves in value each year. After 3 years?",
            "£100",
            ["£200", "£0"],
            "800, 400, 200, 100.",
          ],
        ],
      ]),

      reworded(PC, DEPRECIATION, "A car's value", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Depreciation: multiply by what's left, once each year.**"],
        LOSES,
        [
          "**Depreciation: multiply by what's left, once each year.**",
          "Losing 15%: × 0.85, not × 0.15.",
          "Two years of 10% isn't 20% off.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Inverse proportion.

const INVERSE = "y9-percentages/inverse-proportion";
const inverseMethod = [
  "Multiply to find the total: workers × time.",
  "Divide by the new number.",
  "Check: more workers, less time.",
];
const PRODUCT = maths("4 \\times 9 = 6 \\times 6 = 36");

const inverse = stepped(find(PC, INVERSE), {
  method: inverseMethod,
  variation: {
    relationship: "inverse proportion: the product stays the same",
    unknowns: ["total", "answer"],
    surface: ["fewer workers", "not a double", "backwards"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "More hands, less time",
        ["**Inverse proportion: double one, the other halves.**"],
        PRODUCT,
        "The product stays the same: find the total first.",
      ),
      reworded(PC, INVERSE, "Spot the pattern", { tag: "The rule" }),
      reworded(PC, INVERSE, "Inverse proportion", { tag: "The rule" }),

      ...owned(PC, INVERSE, "Warm-up", "Check you remember"),

      methodCard("The method", inverseMethod, PRODUCT),
      workedFrom(PC, INVERSE),
      calc(
        "Your turn",
        "3 builders take 8 days. How long for 4?",
        undefined,
        [
          ["Total: $3 \\times 8 =$", "24", "Builder-days."],
          ["$24 \\div 4 =$", "6", "Share between 4.", { after: "days" }],
        ],
        "6 days.",
      ),

      calc(
        "Practise",
        "At 50 km/h a trip takes 3 hours. At 75 km/h?",
        undefined,
        [
          ["Distance: $50 \\times 3 =$", "150", "Speed × time.", { after: "km" }],
          ["$150 \\div 75 =$", "2", "The new time.", { after: "hours" }],
        ],
        "2 hours.",
      ),
      reworded(PC, INVERSE, "Filling a pool", {
        tag: "Practise",
        start: "3 taps take 20 minutes. How long for 5?",
      }),
      reworded(PC, INVERSE, "A slower journey", {
        tag: "Practise",
        start: "60 km/h takes 2 hours. How long at 40 km/h?",
      }),
      reworded(PC, INVERSE, "Painters", {
        tag: "Practise",
        text: "5 painters: 12 days. How many days for 4?",
      }),
      reworded(PC, INVERSE, "Direct or inverse?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "6 workers take 10 days. Watch what changes.",
        [
          ask("The total, in worker-days?", "60", "6 × 10.", "60.", { asks: "total" }),
          ask("How long for 12 workers?", "5", "60 ÷ 12.", "5 days.", {
            asks: "answer",
            changed: "More workers.",
          }),
          ask("How long for 3 workers?", "20", "60 ÷ 3.", "20 days.", {
            asks: "answer",
            changed: "Fewer workers.",
          }),
          ask("How many workers for 4 days?", "15", "60 ÷ 4.", "15 workers.", {
            asks: "answer",
            changed: "Backwards.",
          }),
        ],
        "Total first, then share.",
      ),

      questionSet(
        "Variation",
        "6 people take 4 hours to pick apples.",
        [
          ask("How long for 12 people?", "2", "24 ÷ 12.", "2 hours.", {
            asks: "answer",
            expect: [
              "Sam says 12 people take 8 hours. Right?",
              "No",
              "Twice the people, half the time: 2 hours.",
              [["Yes", "More people work faster."]],
            ],
          }),
          ask("How long for 3 people?", "8", "24 ÷ 3.", "8 hours.", {
            asks: "answer",
            changed: "Half the people.",
          }),
          ask("How long for 8 people?", "3", "24 ÷ 8.", "3 hours.", {
            asks: "answer",
            changed: "Not a double.",
          }),
          ask("How long for 1 person?", "24", "The total.", "24 hours.", {
            asks: "total",
            changed: "Just one.",
          }),
        ],
        "More people, less time: the product stays 24.",
      ),
      reworded(
        PC,
        INVERSE,
        "Where did it go wrong?",
        { text: "8 workers take 6 days. Ivo finds the time for 4." },
        "Spot the mistake",
      ),

      quiz([
        [
          ["4 people take 6 hours. How long for 8?", "3 hours", ["12 hours", "6 hours"], "24 ÷ 8."],
          [
            "5 people take 6 hours. How long for 10?",
            "3 hours",
            ["12 hours", "11 hours"],
            "30 ÷ 10.",
          ],
        ],
        [
          [
            "6 machines take 8 hours. How long for 4?",
            "12 hours",
            ["6 hours", "5.3 hours"],
            "48 ÷ 4.",
          ],
          [
            "2 pumps take 15 minutes. How long for 3?",
            "10 minutes",
            ["22.5 minutes", "15 minutes"],
            "30 ÷ 3.",
          ],
        ],
        [
          [
            "Which is inverse proportion?",
            "Speed and journey time",
            ["Pens and their cost", "Hours and pay"],
            "Faster means less time.",
          ],
          [
            "Which pair is inverse proportion?",
            "Workers and time to finish",
            ["Distance and fuel", "Tickets and their cost"],
            "More workers, less time.",
          ],
        ],
      ]),

      reworded(PC, INVERSE, "Beat the deadline", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Inverse proportion: double one, the other halves.**"],
        PRODUCT,
        [
          "**Inverse proportion: double one, the other halves.**",
          "Find the total first: workers × time.",
          "Half the workers take twice as long.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

export const y9EquationsStepped: [string, UnitLesson[]][] = [
  [ELIM, [elimination]],
  [SUB, [substitution]],
  [INEQ, [inequalities]],
  [COMPOUND, [compound]],
  [DEPRECIATION, [depreciation]],
  [INVERSE, [inverse]],
];
