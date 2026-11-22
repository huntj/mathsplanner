// GCSE Foundation, "Equations", on the stepped template (docs/proposals/lesson-stepped.md):
// solving one-sided equations, unknowns on both sides, brackets, and forming equations. Algebra is
// its own picture; forming equations from shapes is asked on the shape.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfEquations } from "./gf-equations.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { triangle } from "./y7-angles.ts";

const EQ = gfEquations;
const ALGEBRA = "Algebra: the equation is the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const steps = (...lines: string[]): Picture =>
  maths(`\\begin{array}{l} ${lines.join(" \\\\ ")} \\end{array}`);
const neg = (n: number): string[] => [`${n}`, `−${-n}`];
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Solving equations.

const ONE = "gf-equations/one-side";
const oneMethod = [
  "Undo the + or − first, on both sides.",
  "Then undo the × or ÷.",
  "Check: put your answer back in.",
];
const BALANCE = steps("2x + 9 = 21", "2x = 12", "x = 6");

const oneSide = stepped(find(EQ, ONE), {
  method: oneMethod,
  variation: {
    relationship: "an equation and the value that makes it true",
    unknowns: ["x"],
    surface: ["minus signs", "dividing", "x taken away"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Keep it balanced",
        ["**Do the same to both sides; undo in reverse order.**"],
        BALANCE,
        "Undo + 9 first, then × 2.",
      ),
      reworded(EQ, ONE, "Solve $3x + 4 = 19$", { tag: "The rule" }),

      ...owned(EQ, ONE, "Warm-up", "Check you remember"),

      methodCard("The method", oneMethod, BALANCE),
      workedFrom(EQ, ONE),
      calc(
        "Your turn",
        "Solve $6x + 5 = 41$.",
        undefined,
        [
          ["$6x =$", "36", "Take 5 from both sides."],
          ["$x =$", "6", "Divide both sides by 6."],
        ],
        "$x = 6$.",
      ),

      calc(
        "Practise",
        "Solve $\\frac{x}{2} - 7 = 3$.",
        undefined,
        [
          ["$\\frac{x}{2} =$", "10", "Add 7 to both sides."],
          ["$x =$", "20", "Multiply both sides by 2."],
        ],
        "$x = 20$.",
      ),
      ...owned(EQ, ONE, "Together", "Practise"),
      ...owned(EQ, ONE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve. Watch what changes.",
        [
          ask("$3x + 2 = 20$", "6", "Take 2, then ÷ 3.", "6.", { asks: "x" }),
          ask("$3x - 2 = 19$", "7", "Add 2, then ÷ 3.", "7.", { asks: "x", changed: "Minus." }),
          ask("$\\frac{x}{3} + 2 = 20$", "54", "Take 2, then × 3.", "54.", {
            asks: "x",
            changed: "Divide.",
          }),
          ask("$20 - 3x = 2$", "6", "Add 3x, then take 2.", "6.", {
            asks: "x",
            changed: "x taken away.",
          }),
        ],
        "Undo the last thing done to x first.",
      ),

      questionSet(
        "Variation",
        "Solve. Watch the signs.",
        [
          ask("$5x - 3 = 22$", "5", "Add 3, then ÷ 5.", "5.", {
            asks: "x",
            expect: [
              "For $5x - 3 = 22$, Ola writes $5x = 19$. Right?",
              "No",
              "Undo − 3 by adding 3: $5x = 25$.",
              [["Yes", "What undoes − 3?"]],
            ],
          }),
          ask("$5x + 3 = 23$", "4", "Take 3, then ÷ 5.", "4.", { asks: "x", changed: "Plus." }),
          ask("$\\frac{x}{5} - 3 = 2$", "25", "Add 3, then × 5.", "25.", {
            asks: "x",
            changed: "Divide.",
          }),
          ask("$3 - 5x = -22$", "5", "Add 5x, then add 22.", "5.", {
            asks: "x",
            changed: "x taken away.",
          }),
        ],
        "The opposite operation undoes it.",
      ),
      own(EQ, ONE, "Spot the mistake"),

      own(EQ, ONE, "Exit check"),

      reworded(EQ, ONE, "“Solve $5x - 7 = 23$.”", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Do the same to both sides; undo in reverse order.**"],
        BALANCE,
        [
          "**Do the same to both sides; undo in reverse order.**",
          "$3x + 6 = 21$: take 6 first.",
          "Put the answer back in to check.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Unknowns on both sides.

const BOTH = "gf-equations/both-sides";
const bothMethod = [
  "Find the smaller x term.",
  "Take it from both sides.",
  "Solve the one-sided equation.",
];
const GATHER = steps("6x + 1 = 2x + 13", "4x + 1 = 13", "x = 3");

const bothSides = stepped(find(EQ, BOTH), {
  method: bothMethod,
  variation: {
    relationship: "x on both sides: gather, then solve",
    unknowns: ["x"],
    surface: ["negative answers", "sides swapped", "minus x"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Gather the x's",
        ["**Take the smaller x term from both sides, then solve as usual.**"],
        GATHER,
        "Here, take 2x from both sides.",
      ),
      reworded(EQ, BOTH, "Solve $5x + 2 = 3x + 10$", { tag: "The rule" }),

      ...owned(EQ, BOTH, "Warm-up", "Check you remember"),

      methodCard("The method", bothMethod, GATHER),
      workedFrom(EQ, BOTH),
      calc(
        "Your turn",
        "Solve $9x - 4 = 5x + 16$.",
        undefined,
        [
          ["Take $5x$: $4x - 4 =$", "16", "From both sides."],
          ["$x =$", "5", "Add 4, then ÷ 4."],
        ],
        "$x = 5$.",
      ),

      calc(
        "Practise",
        "Solve $2x + 15 = 7x$.",
        undefined,
        [
          ["Take $2x$: $15 = ?x$, ? =", "5", "7x − 2x."],
          ["$x =$", "3", "15 ÷ 5."],
        ],
        "$x = 3$.",
      ),
      ...owned(EQ, BOTH, "Together", "Practise"),
      ...owned(EQ, BOTH, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve. Watch what changes.",
        [
          ask("$4x + 3 = 2x + 13$", "5", "Take 2x: 2x + 3 = 13.", "5.", { asks: "x" }),
          ask("$4x - 3 = 2x + 13$", "8", "Take 2x: 2x − 3 = 13.", "8.", {
            asks: "x",
            changed: "Minus 3.",
          }),
          ask("$2x + 13 = 4x + 3$", "5", "Take 2x: 13 = 2x + 3.", "5.", {
            asks: "x",
            changed: "Sides swapped.",
          }),
          ask("$4x + 3 = 13 - x$", "2", "Add x: 5x + 3 = 13.", "2.", {
            asks: "x",
            changed: "Minus x.",
          }),
        ],
        "Gather the x's on the side with more.",
      ),

      questionSet(
        "Variation",
        "Solve. Watch what changes.",
        [
          ask("$5x + 8 = x + 4$", neg(-1), "4x + 8 = 4.", "−1.", {
            asks: "x",
            expect: [
              "From $4x + 8 = 4$, Ana gets $4x = 12$. Right?",
              "No",
              "Take 8: $4x = -4$, so $x = -1$.",
              [["Yes", "What is 4 − 8?"]],
            ],
          }),
          ask("$5x + 8 = x + 20$", "3", "4x + 8 = 20.", "3.", {
            asks: "x",
            changed: "A bigger right side.",
          }),
          ask("$5x - 8 = x + 4$", "3", "4x − 8 = 4.", "3.", { asks: "x", changed: "Minus 8." }),
          ask("$x + 8 = 5x + 4$", "1", "8 = 4x + 4.", "1.", { asks: "x", changed: "Swapped." }),
        ],
        "Answers can be negative: keep the signs.",
      ),
      own(EQ, BOTH, "Spot the mistake"),

      own(EQ, BOTH, "Exit check"),

      reworded(
        EQ,
        BOTH,
        "“$5 + 2x = 17 + 0.5x$. Solve to find when the plans cost the same.”",
        { tag: "Real life", title: "Plans: $5 + 2x = 17 + 0.5x$. When equal?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Take the smaller x term from both sides, then solve as usual.**"],
        GATHER,
        [
          "**Take the smaller x term from both sides, then solve as usual.**",
          "To remove 5x, subtract it.",
          "$4x + 9 = x + 3$ gives $3x = -6$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Equations with brackets.

const BRACKETS = "gf-equations/brackets";
const bracketMethod = ["Expand every bracket.", "Collect like terms.", "Solve as usual."];
const EXPAND = steps("3(x + 2) = 27", "3x + 6 = 27", "x = 7");

const brackets = stepped(find(EQ, BRACKETS), {
  method: bracketMethod,
  variation: {
    relationship: "expanding brackets, then solving",
    unknowns: ["x"],
    surface: ["minus inside", "negative outside", "x on both sides"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Expand, then solve",
        ["**Expand the brackets, collect like terms, then solve.**"],
        EXPAND,
        "Or divide by 3 first: $x + 2 = 9$.",
      ),
      reworded(EQ, BRACKETS, "First step for $3(x - 2) = 21$, expanding", { tag: "The rule" }),

      ...owned(EQ, BRACKETS, "Warm-up", "Check you remember"),

      methodCard("The method", bracketMethod, EXPAND),
      workedFrom(EQ, BRACKETS),
      calc(
        "Your turn",
        "Solve $5(x - 3) = 35$.",
        undefined,
        [
          ["Expand: $5x - 15 =$", "35", "5 × x and 5 × −3."],
          ["$x =$", "10", "Add 15, then ÷ 5."],
        ],
        "$x = 10$.",
      ),

      calc(
        "Practise",
        "Solve $3(x + 4) = 2(x + 9)$.",
        undefined,
        [
          ["$3x + 12 = 2x +$", "18", "Expand both."],
          ["$x =$", "6", "Take 2x and 12."],
        ],
        "$x = 6$.",
      ),
      ...owned(EQ, BRACKETS, "Together", "Practise"),
      ...owned(EQ, BRACKETS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Solve. Watch what changes.",
        [
          ask("$2(x + 1) = 16$", "7", "2x + 2 = 16.", "7.", { asks: "x" }),
          ask("$2(x - 1) = 16$", "9", "2x − 2 = 16.", "9.", { asks: "x", changed: "Minus." }),
          ask("$2(3x + 1) = 32$", "5", "6x + 2 = 32.", "5.", { asks: "x", changed: "3x inside." }),
          ask("$2(x + 1) = x + 10$", "8", "2x + 2 = x + 10.", "8.", {
            asks: "x",
            changed: "x on both sides.",
          }),
        ],
        "Multiply every term inside.",
      ),

      questionSet(
        "Variation",
        "Solve. Watch what changes.",
        [
          ask("$3(x + 4) = 27$", "5", "3x + 12 = 27.", "5.", {
            asks: "x",
            expect: [
              "Jay expands $3(x + 4)$ to $3x + 4$. Right?",
              "No",
              "Multiply both terms: $3x + 12$.",
              [["Yes", "Does the 3 multiply the 4?"]],
            ],
          }),
          ask("$-3(x - 4) = 3$", "3", "−3x + 12 = 3.", "3.", {
            asks: "x",
            changed: "Negative outside.",
          }),
          ask("$3(x + 4) = x + 20$", "4", "3x + 12 = x + 20.", "4.", {
            asks: "x",
            changed: "x on both sides.",
          }),
          ask("$3(4 - x) = 6$", "2", "12 − 3x = 6.", "2.", { asks: "x", changed: "Minus x." }),
        ],
        "Every term inside, signs and all.",
      ),
      own(EQ, BRACKETS, "Spot the mistake"),

      own(EQ, BRACKETS, "Exit check"),

      reworded(
        EQ,
        BRACKETS,
        "“Solve $4(t + 3) = 68$ to find the ticket price.”",
        { tag: "Real life", title: "$4(t + 3) = 68$. The ticket price?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Expand the brackets, collect like terms, then solve.**"],
        EXPAND,
        [
          "**Expand the brackets, collect like terms, then solve.**",
          "$2(x + 5) = 2x + 10$, not $2x + 5$.",
          "$-2(x - 4) = -2x + 8$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Forming and solving equations.

const FORM = "gf-equations/form";
const formMethod = [
  "Find the fact: a total, a perimeter, equal amounts.",
  "Write it as an equation and solve.",
  "Answer the question that was asked.",
];
const RIGHT = triangle(30, 60, ["x", "2x", "90°"]);

const form = stepped(find(EQ, FORM), {
  method: formMethod,
  variation: {
    relationship: "a fact written as an equation",
    unknowns: ["number", "angle"],
    surface: ["number puzzles", "consecutive numbers", "angles"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Find the fact that gives the equals",
        ["**Find the fact, write the equation, solve, then answer the question.**"],
        RIGHT,
        "$x + 2x + 90 = 180$, so $x = 30$.",
      ),

      ...owned(EQ, FORM, "Warm-up", "Check you remember"),

      methodCard("The method", formMethod, RIGHT),
      workedFrom(EQ, FORM),
      calc(
        "Your turn",
        "Perimeter 50 cm. Find x.",
        {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 7, y: 0 },
            { x: 7, y: 3 },
            { x: 0, y: 3 },
          ],
          sides: ["x + 5", "x", "x + 5", "x"],
          square: [0, 1, 2, 3],
        },
        [
          ["$4x + 10 =$", "50", "Add the four sides."],
          ["$x =$", "10", "Take 10, then ÷ 4."],
        ],
        "$x = 10$: the rectangle is 15 cm by 10 cm.",
      ),

      calc(
        "Practise",
        "Find x.",
        triangle(40, 60, ["x", "x + 20", "80°"]),
        [
          ["$2x + 100 =$", "180", "Angles in a triangle."],
          ["$x =$", "40", "Take 100, then ÷ 2.", { after: "°" }],
        ],
        "$x = 40°$.",
      ),
      ...owned(EQ, FORM, "Together", "Practise"),
      reworded(
        EQ,
        FORM,
        "I think of a number, double it and add 7: the answer is 31. The number?",
        { tag: "Practise", title: "Double a number, add 7: 31. The number?" },
      ),
      reworded(EQ, FORM, "Three consecutive numbers add to 72. The smallest?", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Form and solve. Watch what changes.",
        [
          ask("Treble a number, add 5: 29. The number?", "8", "3n + 5 = 29.", "8.", {
            asks: "number",
          }),
          ask("Treble a number, take 5: 31. The number?", "12", "3n − 5 = 31.", "12.", {
            asks: "number",
            changed: "Take away.",
          }),
          ask("Add 5, then treble: 33. The number?", "6", "3(n + 5) = 33.", "6.", {
            asks: "number",
            changed: "Order swapped.",
          }),
          ask("Two consecutive numbers add to 45. The smaller?", "22", "n + n + 1 = 45.", "22.", {
            asks: "number",
            changed: "Consecutive.",
          }),
        ],
        "Write each step in order, then solve.",
      ),

      questionSet(
        "Variation",
        "Answer the question asked. Watch what changes.",
        [
          ask("Find the largest angle.", "90", "6x = 180.", "90°.", {
            asks: "angle",
            unit: "°",
            picture: triangle(30, 60, ["x", "2x", "3x"]),
            expect: [
              "Jo finds $x = 30$ and writes 30°. Right?",
              "No",
              "The largest angle is $3x = 90°$.",
              [["Yes", "What does the question ask for?"]],
            ],
          }),
          ask("Find the smallest angle.", "30", "6x = 180.", "30°.", {
            asks: "angle",
            unit: "°",
            changed: "The smallest.",
            picture: triangle(30, 60, ["x", "2x", "3x"]),
          }),
          ask("Find the middle angle.", "60", "2x.", "60°.", {
            asks: "angle",
            unit: "°",
            changed: "The middle one.",
            picture: triangle(30, 60, ["x", "2x", "3x"]),
          }),
          ask("Find the largest angle now.", "75", "6x − 30 = 180.", "75°.", {
            asks: "angle",
            unit: "°",
            changed: "Minus 30.",
            picture: triangle(35, 70, ["x", "2x", "3x − 30"]),
          }),
        ],
        "Find x, then finish the question.",
      ),
      reworded(EQ, FORM, "Where did it go wrong?", {
        text: "Pen $p$; pencil 20p less. 2 pens, 3 pencils: 240p.",
      }),

      own(EQ, FORM, "Exit check"),

      reworded(
        EQ,
        FORM,
        "“The angles are $x$, $2x$ and $3x + 30$. Work out the size of the largest angle.”",
        { tag: "Real life", title: "Angles $x$, $2x$ and $3x + 30$. The largest angle?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Find the fact, write the equation, solve, then answer the question.**"],
        RIGHT,
        [
          "**Find the fact, write the equation, solve, then answer the question.**",
          "Angles in a triangle: 180°. Perimeter: add the sides.",
          "x isn't always the answer.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

export const gfEquationsStepped: [string, UnitLesson[]][] = [
  [ONE, [oneSide]],
  [BOTH, [bothSides]],
  [BRACKETS, [brackets]],
  [FORM, [form]],
];
