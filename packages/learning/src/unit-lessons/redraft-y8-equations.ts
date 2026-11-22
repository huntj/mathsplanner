// Year 8, "Equations and formulae", on the stepped template (docs/proposals/lesson-stepped.md):
// using a formula, changing the subject, letters on both sides, brackets, and fractions. Algebra
// is its own picture, so these questions are asked in symbols, with the balance where it helps.
import { ask, calc, explain, methodCard, questionSet, quiz, summary, worked } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { y8Equations } from "./y8-equations.ts";

const ALGEBRA = "Algebra: the equation is the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const EQ = y8Equations;
const minus = (n: string) => [n, n.replace("-", "−")];

// ---------------------------------------------------------------------------------------------
// Using a formula.

const FORMULAE = "y8-equations/formulae";
const formulaeMethod = [
  "Write the formula.",
  "Put each number in place of its letter.",
  "Work it out: powers, then × and ÷, then + and −.",
];

const formulae = stepped(find(EQ, FORMULAE), {
  method: formulaeMethod,
  variation: {
    relationship: "a formula and the value it gives",
    unknowns: ["subject", "another letter"],
    surface: ["zero", "negatives", "temperatures", "speeds"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Using a formula",
        ["**Substitute: put each number in place of its letter.**"],
        maths("v = u + at = 4 + 3 \\times 5 = 19"),
        "Then work it out in the usual order: × before +.",
      ),
      reworded(EQ, FORMULAE, "With $w = 3$, what is $40w + 20$?", { tag: "The rule" }),

      ...owned(EQ, FORMULAE, "Warm-up", "Check you remember"),

      methodCard("The method", formulaeMethod, maths("v = u + at")),
      workedFrom(EQ, FORMULAE),
      calc(
        "Your turn",
        "$v = u + at$. Find $v$ when $u = 2$, $a = 5$, $t = 3$.",
        undefined,
        [
          ["First $5 \\times 3 =$", "15", "× before +."],
          ["$v = 2 + 15 =$", "17", "Then add."],
        ],
        "$v = 17$.",
      ),

      calc(
        "Practise",
        "$y = 3x^2$. Find $y$ when $x = 2$.",
        undefined,
        [
          ["$2^2 =$", "4", "Powers first."],
          ["$y = 3 \\times 4 =$", "12", "Then multiply."],
        ],
        "$y = 12$.",
      ),
      ...owned(EQ, FORMULAE, "Together", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("$F = 1.8C + 32$. Find $F$ when $C = 10$.", "50", "18 + 32.", "50.", {
            asks: "subject",
          }),
          ask("$F = 1.8C + 32$. Find $F$ when $C = 0$.", "32", "0 + 32.", "32.", {
            asks: "subject",
            changed: "C is 0.",
          }),
          ask("$F = 1.8C + 32$. Find $F$ when $C = -10$.", "14", "−18 + 32.", "14.", {
            asks: "subject",
            changed: "Below zero.",
          }),
          ask(
            "$F = 1.8C + 32$. Find $C$ when $F = 50$.",
            "10",
            "$50 = 1.8C + 32$: solve it.",
            "10.",
            {
              asks: "another letter",
              changed: "Now F is given: solve for C.",
            },
          ),
        ],
        "Substitute, then follow the order.",
      ),

      questionSet(
        "Variation",
        "$v = u + at$. Watch what changes.",
        [
          ask("Find $v$: $u = 3$, $a = 2$, $t = 5$.", "13", "$at = 10$ first.", "13.", {
            asks: "subject",
            expect: [
              "Max works out $3 + 2 = 5$, then $5 \\times 5$. Right?",
              "No",
              "Multiply first: $at = 10$, so $v = 13$.",
              [["Yes", "× comes before +."]],
            ],
          }),
          ask("Find $v$: $u = 3$, $a = 2$, $t = 10$.", "23", "$at = 20$.", "23.", {
            asks: "subject",
            changed: "t doubles.",
          }),
          ask("Find $v$: $u = 3$, $a = -2$, $t = 5$.", minus("-7"), "$at = -10$.", "−7.", {
            asks: "subject",
            changed: "A negative.",
          }),
          ask("Find $v$: $u = 0$, $a = 2$, $t = 5$.", "10", "$0 + 10$.", "10.", {
            asks: "subject",
            changed: "u is 0.",
          }),
        ],
        "Multiply before you add, whatever the numbers.",
      ),
      own(EQ, FORMULAE, "Spot the mistake"),

      quiz([
        [
          ["$P = 2l + 2w$. Find P: $l = 7$, $w = 3$.", "20", ["17", "42"], "$14 + 6$."],
          ["$P = 2l + 2w$. Find P: $l = 6$, $w = 4$.", "20", ["16", "48"], "$12 + 8$."],
        ],
        [
          ["$y = 2x^2$. Find y when $x = 3$.", "18", ["36", "12"], "Square first: $2 \\times 9$."],
          ["$y = 5x^2$. Find y when $x = 2$.", "20", ["100", "10"], "Square first: $5 \\times 4$."],
        ],
        [
          ["Taxi: $C = 3 + 2m$. Cost of 6 miles, in £?", "15", ["30", "11"], "$3 + 12$."],
          ["Taxi: $C = 5 + 3m$. Cost of 4 miles, in £?", "17", ["32", "12"], "$5 + 12$."],
        ],
      ]),

      reworded(
        EQ,
        FORMULAE,
        "Dinner at six",
        { tag: "Real life", text: "5 kg turkey, dinner at 6 pm. When does it go in?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Substitute: put each number in place of its letter.**"],
        maths("v = u + at = 4 + 3 \\times 5 = 19"),
        [
          "**Substitute: put each number in place of its letter.**",
          "Powers, then × and ÷, then + and −.",
          "$y = 3x^2$ with $x = 4$: $3 \\times 16 = 48$, not $12^2$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Changing the subject.

const REARRANGE = "y8-equations/rearrange";
const rearrangeMethod = [
  "See what's done to the letter, in order.",
  "Undo each step in reverse, on both sides.",
  "Write the letter on its own: it's the subject.",
];

const rearrange = stepped(find(EQ, REARRANGE), {
  method: rearrangeMethod,
  variation: {
    relationship: "a formula and the same formula with a new subject",
    unknowns: ["new subject"],
    surface: ["adding", "times", "two steps", "brackets", "divides"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Changing the subject",
        ["**Undo the steps in reverse, the same on both sides.**"],
        maths("C = 3 + 2m \\;\\Rightarrow\\; m = \\frac{C - 3}{2}"),
        "m was times 2, then add 3. So take 3, then divide by 2.",
      ),
      reworded(EQ, REARRANGE, "To make m the subject of $C = 3 + 2m$, what do you undo first?", {
        tag: "The rule",
        title: "Make m the subject of $C = 3 + 2m$. Undo what first?",
      }),

      ...owned(EQ, REARRANGE, "Warm-up", "Check you remember"),

      methodCard(
        "The method",
        rearrangeMethod,
        maths("v = u + at \\;\\Rightarrow\\; t = \\frac{v - u}{a}"),
      ),
      workedFrom(EQ, REARRANGE),
      calc(
        "Your turn",
        "Make x the subject of $y = 4x + 1$.",
        undefined,
        [
          ["First, take from both sides:", "1", "Undo the + 1."],
          ["Then divide both sides by:", "4", "Undo the × 4."],
        ],
        "$x = \\frac{y - 1}{4}$.",
      ),

      calc(
        "Practise",
        "Make u the subject of $v = u + at$.",
        undefined,
        [["Take from both sides:", "at", "Undo the + at."]],
        "$u = v - at$.",
      ),
      ...owned(EQ, REARRANGE, "Together", "Practise"),
      questionSet(
        "Practise",
        "Make x the subject. Watch what changes.",
        [
          ask("Make x the subject of $y = x - 6$.", "$x = y + 6$", "Undo − 6.", "$x = y + 6$.", {
            asks: "new subject",
            others: ["$x = y - 6$", "$x = 6 - y$"],
          }),
          ask(
            "Make x the subject of $y = 6x$.",
            "$x = \\frac{y}{6}$",
            "Undo × 6.",
            "$x = \\frac{y}{6}$.",
            {
              asks: "new subject",
              changed: "Times, not take.",
              others: ["$x = 6y$", "$x = y - 6$"],
            },
          ),
          ask(
            "Make x the subject of $y = 6x - 1$.",
            "$x = \\frac{y + 1}{6}$",
            "Undo − 1, then × 6.",
            "$x = \\frac{y + 1}{6}$.",
            {
              asks: "new subject",
              changed: "Two steps.",
              others: ["$x = \\frac{y}{6} + 1$", "$x = \\frac{y - 1}{6}$"],
            },
          ),
          ask("Make x the subject of $y = \\frac{x}{6}$.", "$x = 6y$", "Undo ÷ 6.", "$x = 6y$.", {
            asks: "new subject",
            changed: "A divide.",
            others: ["$x = \\frac{y}{6}$", "$x = y + 6$"],
          }),
        ],
        "Undo in reverse order.",
      ),

      questionSet(
        "Variation",
        "Make x the subject. Watch what changes.",
        [
          ask("Make x the subject of $y = x + 2$.", "$x = y - 2$", "Undo + 2.", "$x = y - 2$.", {
            asks: "new subject",
            others: ["$x = y + 2$", "$x = 2 - y$"],
            expect: [
              "Pat writes $x = y + 2$. Right?",
              "No",
              "Undo + 2 by taking 2: $x = y - 2$.",
              [["Yes", "Check: y = 5 gives x = 3, not 7."]],
            ],
          }),
          ask(
            "Make x the subject of $y = 3x + 2$.",
            "$x = \\frac{y - 2}{3}$",
            "Undo + 2, then × 3.",
            "$x = \\frac{y - 2}{3}$.",
            {
              asks: "new subject",
              changed: "Times by 3 too.",
              others: ["$x = \\frac{y}{3} - 2$", "$x = 3y - 2$"],
            },
          ),
          ask(
            "Make x the subject of $y = 3(x + 2)$.",
            "$x = \\frac{y}{3} - 2$",
            "Undo × 3, then + 2.",
            "$x = \\frac{y}{3} - 2$.",
            {
              asks: "new subject",
              changed: "A bracket: the order flips.",
              others: ["$x = \\frac{y - 2}{3}$", "$x = 3y - 2$"],
            },
          ),
          ask(
            "Make x the subject of $y = \\frac{x + 2}{3}$.",
            "$x = 3y - 2$",
            "Undo ÷ 3, then + 2.",
            "$x = 3y - 2$.",
            {
              asks: "new subject",
              changed: "A divide.",
              others: ["$x = \\frac{y - 2}{3}$", "$x = 3y + 2$"],
            },
          ),
        ],
        "The order of the steps decides the order you undo them.",
      ),
      own(EQ, REARRANGE, "Spot the mistake"),

      own(EQ, REARRANGE, "Exit check"),

      reworded(EQ, REARRANGE, "How far can you go?", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Undo the steps in reverse, the same on both sides.**"],
        maths("C = 3 + 2m \\;\\Rightarrow\\; m = \\frac{C - 3}{2}"),
        [
          "**Undo the steps in reverse, the same on both sides.**",
          "$y = 2x + 5$: take 5, then divide by 2.",
          "$y = x + 5$ gives $x = y - 5$, not $y + 5$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Letters on both sides.

const BOTH = "y8-equations/both-sides";
const bothMethod = [
  "Take the smaller number of x's from both sides.",
  "Undo the + or − on both sides.",
  "Divide to get x on its own.",
];

const bothSides = stepped(find(EQ, BOTH), {
  method: bothMethod,
  variation: {
    relationship: "an equation with x on both sides and its solution",
    unknowns: ["x", "first step"],
    surface: ["more x's on the right", "minus signs", "no number on one side"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Letters on both sides",
        ["**Take the smaller number of x's from both sides first.**"],
        maths("5x + 3 = 2x + 15 \\;\\Rightarrow\\; 3x + 3 = 15"),
        "That leaves x on one side only, and a positive number of them.",
      ),
      reworded(EQ, BOTH, "Solve $5x + 3 = 2x + 15$", { tag: "The rule" }),

      ...owned(EQ, BOTH, "Warm-up", "Check you remember"),

      methodCard("The method", bothMethod, maths("7x - 4 = 3x + 12")),
      workedFrom(EQ, BOTH),
      calc(
        "Your turn",
        "Solve $7x + 1 = 3x + 13$.",
        undefined,
        [
          ["Take $3x$: $4x + 1 =$", "13", "Both sides."],
          ["$4x =$", "12", "Take 1."],
          ["$x =$", "3", "Divide by 4."],
        ],
        "$x = 3$.",
      ),

      calc(
        "Practise",
        "Solve $8x - 2 = 3x + 18$.",
        undefined,
        [
          ["Take $3x$: $5x - 2 =$", "18", "Both sides."],
          ["$5x =$", "20", "Add 2."],
          ["$x =$", "4", "Divide by 5."],
        ],
        "$x = 4$.",
      ),
      ...owned(EQ, BOTH, "Together", "Practise"),
      questionSet(
        "Practise",
        "Solve each one. Watch what changes.",
        [
          ask("Solve $3x + 7 = x + 15$.", "4", "Take x: $2x + 7 = 15$.", "$x = 4$.", { asks: "x" }),
          ask("Solve $3x - 7 = x + 15$.", "11", "Take x: $2x - 7 = 15$.", "$x = 11$.", {
            asks: "x",
            changed: "A minus.",
          }),
          ask("Solve $x + 15 = 3x + 7$.", "4", "Take x: $15 = 2x + 7$.", "$x = 4$.", {
            asks: "x",
            changed: "More x's on the right.",
          }),
          ask(
            "Best first step for $7x + 2 = 4x + 11$?",
            "Take 4x from both sides",
            "The smaller number of x's.",
            "Take 4x: $3x + 2 = 11$.",
            {
              asks: "first step",
              changed: "Just the first step.",
              others: ["Take 7x from both sides", "Take 2 from 4x"],
            },
          ),
        ],
        "Smaller x's away first.",
      ),

      questionSet(
        "Variation",
        "Solve each one. Watch what changes.",
        [
          ask("Solve $4x = x + 9$.", "3", "$3x = 9$.", "$x = 3$.", {
            asks: "x",
            expect: [
              "Gus writes $4x - x = 4$. Right?",
              "No",
              "x is 1x, so $4x - x = 3x$. Then $3x = 9$.",
              [["Yes", "x means 1x."]],
            ],
          }),
          ask("Solve $4x = x + 12$.", "4", "$3x = 12$.", "$x = 4$.", {
            asks: "x",
            changed: "A bigger number.",
          }),
          ask("Solve $4x = 2x + 12$.", "6", "$2x = 12$.", "$x = 6$.", {
            asks: "x",
            changed: "More x's on the right.",
          }),
          ask("Solve $4x + 2 = 2x + 12$.", "5", "$2x + 2 = 12$.", "$x = 5$.", {
            asks: "x",
            changed: "A number on the left too.",
          }),
        ],
        "x is 1x: take it away like any other.",
      ),
      own(EQ, BOTH, "Spot the mistake"),

      own(EQ, BOTH, "Exit check"),

      reworded(EQ, BOTH, "Which gym?", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Take the smaller number of x's from both sides first.**"],
        maths("5x + 3 = 2x + 15 \\;\\Rightarrow\\; 3x + 3 = 15"),
        [
          "**Take the smaller number of x's from both sides first.**",
          "$5x + 3 = 2x + 15$ → $3x = 12$ → $x = 4$.",
          "x is 1x: $4x - x = 3x$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Brackets in equations.

const BRACKETS = "y8-equations/brackets";
const bracketsMethod = [
  "Expand the bracket, or divide both sides by the number outside.",
  "Undo the + or −.",
  "Divide to get x on its own.",
];

const brackets = stepped(find(EQ, BRACKETS), {
  method: bracketsMethod,
  variation: {
    relationship: "an equation with a bracket and its solution",
    unknowns: ["x"],
    surface: ["minus signs", "2x in the bracket", "brackets on both sides", "negative answers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Brackets in equations",
        ["**Expand the bracket, or divide both sides first.**"],
        maths("3(x + 4) = 27 \\;\\Rightarrow\\; x + 4 = 9"),
        "Both ways give the same answer: x = 5.",
      ),
      reworded(EQ, BRACKETS, "Expand $3(x + 4) = 27$", { tag: "The rule" }),

      ...owned(EQ, BRACKETS, "Warm-up", "Check you remember"),

      methodCard("The method", bracketsMethod, maths("4(2x - 3) = 36")),
      workedFrom(EQ, BRACKETS),
      calc(
        "Your turn",
        "Solve $3(x - 2) = 21$.",
        undefined,
        [
          ["Divide by 3: $x - 2 =$", "7", "Undo the × 3."],
          ["$x =$", "9", "Add 2."],
        ],
        "$x = 9$.",
      ),

      calc(
        "Practise",
        "Solve $2(4x + 1) = 26$.",
        undefined,
        [
          ["Expand: $8x + 2 =$", "26", "Both terms times 2."],
          ["$8x =$", "24", "Take 2."],
          ["$x =$", "3", "Divide by 8."],
        ],
        "$x = 3$.",
      ),
      ...owned(EQ, BRACKETS, "Together", "Practise"),
      questionSet(
        "Practise",
        "Solve each one. Watch what changes.",
        [
          ask("Solve $6(x + 1) = 42$.", "6", "$x + 1 = 7$.", "$x = 6$.", { asks: "x" }),
          ask("Solve $6(x - 1) = 42$.", "8", "$x - 1 = 7$.", "$x = 8$.", {
            asks: "x",
            changed: "A minus.",
          }),
          ask("Solve $6(2x - 1) = 42$.", "4", "$2x - 1 = 7$.", "$x = 4$.", {
            asks: "x",
            changed: "2x in the bracket.",
          }),
          ask("Solve $6(x + 1) = 2(x + 9)$.", "3", "$6x + 6 = 2x + 18$.", "$x = 3$.", {
            asks: "x",
            changed: "Brackets on both sides.",
          }),
        ],
        "Expand or divide, then solve.",
      ),

      questionSet(
        "Variation",
        "Solve each one. Watch what changes.",
        [
          ask("Solve $2(x + 5) = 20$.", "5", "$2x + 10 = 20$.", "$x = 5$.", {
            asks: "x",
            expect: [
              "Tom writes $2x + 5 = 20$. Right?",
              "No",
              "Multiply both terms: $2x + 10 = 20$.",
              [["Yes", "The 2 times the 5 too."]],
            ],
          }),
          ask("Solve $2(x + 5) = 30$.", "10", "$x + 5 = 15$.", "$x = 10$.", {
            asks: "x",
            changed: "A different total.",
          }),
          ask("Solve $5(x + 2) = 30$.", "4", "$x + 2 = 6$.", "$x = 4$.", {
            asks: "x",
            changed: "A different number outside.",
          }),
          ask("Solve $2(x + 5) = 7$.", minus("-1.5"), "$2x + 10 = 7$.", "$x = -1.5$.", {
            asks: "x",
            changed: "A negative answer.",
          }),
        ],
        "The number outside multiplies every term inside.",
      ),
      own(EQ, BRACKETS, "Spot the mistake"),

      own(EQ, BRACKETS, "Exit check"),

      reworded(
        EQ,
        BRACKETS,
        "Concert tickets",
        { tag: "Real life", text: "How much is one ticket, in £?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Expand the bracket, or divide both sides first.**"],
        maths("3(x + 4) = 27 \\;\\Rightarrow\\; x + 4 = 9"),
        [
          "**Expand the bracket, or divide both sides first.**",
          "$2(x + 5)$ is $2x + 10$, not $2x + 5$.",
          "Brackets on both sides: expand both.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Fractions in equations.

const FRACTIONS = "y8-equations/fractions";
const fractionsMethod = [
  "Whole side over a number? Times both sides by it.",
  "Something added after the fraction? Undo that first.",
  "Then solve as usual.",
];

const fractions = stepped(find(EQ, FRACTIONS), {
  method: fractionsMethod,
  variation: {
    relationship: "an equation with a fraction and its solution",
    unknowns: ["x"],
    surface: ["inside the fraction", "outside it", "negatives", "decimals"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Fractions in equations",
        ["**Multiply both sides by the bottom number.**"],
        maths("\\frac{x + 5}{3} = 4 \\;\\Rightarrow\\; x + 5 = 12"),
        "A fraction line means divide; multiplying undoes it.",
      ),
      reworded(EQ, FRACTIONS, "Multiply both sides of $\\frac{x + 5}{3} = 4$ by 3", {
        tag: "The rule",
      }),

      ...owned(EQ, FRACTIONS, "Warm-up", "Check you remember"),

      methodCard("The method", fractionsMethod, maths("\\frac{x}{5} - 2 = 3")),
      worked(
        "Watch the method",
        "Solve $\\frac{x}{5} - 2 = 3$.",
        [
          { line: "$\\frac{x}{5} = 5$", note: "Add 2 first: only x is divided by 5." },
          { line: "$x = 25$", note: "Times both sides by 5." },
        ],
        "Undo the − 2, then the ÷ 5.",
      ),
      calc(
        "Your turn",
        "Solve $\\frac{x - 1}{2} = 6$.",
        undefined,
        [
          ["Times by 2: $x - 1 =$", "12", "Undo the ÷ 2."],
          ["$x =$", "13", "Add 1."],
        ],
        "$x = 13$.",
      ),

      calc(
        "Practise",
        "Solve $\\frac{x}{3} + 5 = 9$.",
        undefined,
        [
          ["Take 5: $\\frac{x}{3} =$", "4", "Undo the + 5 first."],
          ["$x =$", "12", "Times by 3."],
        ],
        "$x = 12$.",
      ),
      ...owned(EQ, FRACTIONS, "Together", "Practise"),
      reworded(EQ, FRACTIONS, "Which first?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Solve each one. Watch what changes.",
        [
          ask("Solve $\\frac{x}{5} = 7$.", "35", "Times by 5.", "$x = 35$.", { asks: "x" }),
          ask("Solve $\\frac{x + 2}{5} = 7$.", "33", "$x + 2 = 35$.", "$x = 33$.", {
            asks: "x",
            changed: "Add inside.",
          }),
          ask("Solve $\\frac{x}{5} + 2 = 7$.", "25", "$\\frac{x}{5} = 5$.", "$x = 25$.", {
            asks: "x",
            changed: "Add outside.",
          }),
          ask("Solve $\\frac{3x}{5} = 6$.", "10", "$3x = 30$.", "$x = 10$.", {
            asks: "x",
            changed: "3x on top.",
          }),
        ],
        "Inside: times first. Outside: undo the add first.",
      ),

      questionSet(
        "Variation",
        "Solve each one. Watch what changes.",
        [
          ask("Solve $\\frac{x}{4} = 3$.", "12", "Times by 4.", "$x = 12$.", {
            asks: "x",
            expect: [
              "Kim writes $x = \\frac34$. Right?",
              "No",
              "Undo ÷ 4 by multiplying by 4: $x = 12$.",
              [["Yes", "Check: $\\frac34 \\div 4$ isn't 3."]],
            ],
          }),
          ask("Solve $\\frac{x}{4} = -3$.", minus("-12"), "Times by 4.", "$x = -12$.", {
            asks: "x",
            changed: "Negative.",
          }),
          ask("Solve $\\frac{x}{4} = 0.5$.", "2", "Times by 4.", "$x = 2$.", {
            asks: "x",
            changed: "A decimal.",
          }),
          ask("Solve $\\frac{x}{4} = \\frac32$.", "6", "Times by 4.", "$x = 6$.", {
            asks: "x",
            changed: "A fraction both sides.",
          }),
        ],
        "Whatever is on the right, times it by the bottom number.",
      ),
      own(EQ, FRACTIONS, "Spot the mistake"),

      own(EQ, FRACTIONS, "Exit check"),

      reworded(
        EQ,
        FRACTIONS,
        "Splitting the bill",
        { tag: "Real life", text: "How much was the meal, in £?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply both sides by the bottom number.**"],
        maths("\\frac{x + 5}{3} = 4 \\;\\Rightarrow\\; x + 5 = 12"),
        [
          "**Multiply both sides by the bottom number.**",
          "$\\frac{x}{3} + 4 = 10$: take 4 first, then times by 3.",
          "$\\frac{x}{4} = 3$ gives 12, not $\\frac34$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

export const y8EquationsStepped: [string, UnitLesson[]][] = [
  [FORMULAE, [formulae]],
  [REARRANGE, [rearrange]],
  [BOTH, [bothSides]],
  [BRACKETS, [brackets]],
  [FRACTIONS, [fractions]],
];
