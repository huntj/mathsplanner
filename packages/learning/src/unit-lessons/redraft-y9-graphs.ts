// Year 9, "Graphs and sequences", on the stepped template (docs/proposals/lesson-stepped.md):
// reading a graph, solving a quadratic from its curve, geometric sequences and famous sequences.
// Readings and solutions from a graph are asked on the graph; sequences are number patterns.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, Range, UnitLesson } from "./types.ts";
import { y9Graphs } from "./y9-graphs.ts";

const G9 = y9Graphs;
const NUMBER = "A number pattern: the terms are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
function picOf(id: string, title: string): Picture {
  const screen = find(G9, id)?.screens.find((s) => s.title === title);
  const pic = screen && "picture" in screen ? screen.picture : undefined;
  if (!pic) throw new Error(`No picture on "${title}" in ${id}`);
  return pic;
}
const line = (m: number, c: number, range: Range): Picture => ({
  kind: "graph",
  range,
  lines: [{ m, c }],
});
/** y = ax² + bx + c, with a level line y = at if given. */
const curve = (a: number, b: number, c: number, range: Range, at?: number): Picture => ({
  kind: "graph",
  range,
  curves: [{ kind: "quadratic", a, b, c }],
  ...(at === undefined ? {} : { lines: [{ m: 0, c: at }] }),
});

// ---------------------------------------------------------------------------------------------
// Reading a graph.

const READING = "y9-graphs/reading";
const readMethod = [
  "Find the value you know on its axis.",
  "Go to the line.",
  "Turn, and read the other axis. Check the scale.",
];
const MILES = line(1.6, 0, { xMin: 0, xMax: 6, yMin: 0, yMax: 10 });
const TREBLE = line(3, 0, { xMin: 0, xMax: 5, yMin: 0, yMax: 15 });

const reading = stepped(find(G9, READING), {
  method: readMethod,
  variation: {
    relationship: "a value on one axis and its partner on the other",
    unknowns: ["y", "x"],
    surface: ["between grid lines", "backwards", "conversions"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Reading a graph",
        ["**Start on the axis you know, go to the line, then to the other axis.**"],
        MILES,
        "Miles to km: up, then across. Km to miles: across, then down.",
      ),
      reworded(G9, READING, "About how many kilometres is 3 miles?", {
        tag: "The rule",
        text: "Up from 3, then across.",
      }),
      reworded(G9, READING, "There and back", { tag: "The rule" }),

      ...owned(G9, READING, "Warm-up", "Check you remember"),

      methodCard("The method", readMethod, MILES),
      workedFrom(G9, READING),
      calc(
        "Your turn",
        "Miles along, km up.",
        MILES,
        [
          ["2.5 miles: up, then across:", "4", "Read the km axis.", { after: "km" }],
          ["6.4 km: across, then down:", "4", "Read the miles axis.", { after: "miles" }],
        ],
        "2.5 miles ≈ 4 km; 6.4 km ≈ 4 miles.",
      ),

      calc(
        "Practise",
        "This is $y = 3x$.",
        TREBLE,
        [
          ["y when $x = 1.5$:", "4.5", "Up, then across."],
          ["x when $y = 9$:", "3", "Across, then down."],
        ],
        "4.5 and 3.",
      ),
      ...owned(G9, READING, "Together", "Practise"),
      ...owned(G9, READING, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "This is $y = 3x$. Watch what changes.",
        [
          ask("Read y when $x = 2$.", "6", "Up, then across.", "6.", {
            asks: "y",
            picture: TREBLE,
          }),
          ask("Read x when $y = 12$.", "4", "Across, then down.", "4.", {
            asks: "x",
            changed: "Backwards.",
            picture: TREBLE,
          }),
          ask("Read y when $x = 2.5$.", "7.5", "Halfway.", "7.5.", {
            asks: "y",
            changed: "Between grid lines.",
            picture: TREBLE,
          }),
          ask("Read x when $y = 4.5$.", "1.5", "Across, then down.", "1.5.", {
            asks: "x",
            changed: "Backwards, between lines.",
            picture: TREBLE,
          }),
        ],
        "Start where you know.",
      ),

      questionSet(
        "Variation",
        "Miles along, km up. Watch what changes.",
        [
          ask("3 km in miles?", "About 1.9", "Across from 3 km, then down.", "About 1.9 miles.", {
            asks: "x",
            others: ["About 4.8", "About 3"],
            picture: MILES,
            expect: [
              "For 3 km, Ben goes up from 3 on the miles axis. Right?",
              "No",
              "3 km is on the km axis: across, then down.",
              [["Yes", "Which axis is km?"]],
            ],
          }),
          ask("3 miles in km?", "About 4.8", "Up from 3 miles.", "About 4.8 km.", {
            asks: "y",
            changed: "Miles this time.",
            others: ["About 1.9", "About 3"],
            picture: MILES,
          }),
          ask("6 km in miles?", "About 3.8", "Across from 6 km.", "About 3.8 miles.", {
            asks: "x",
            changed: "A longer distance.",
            others: ["About 9.6", "About 6"],
            picture: MILES,
          }),
          ask("6 miles in km?", "About 9.6", "Up from 6 miles.", "About 9.6 km.", {
            asks: "y",
            changed: "Miles again.",
            others: ["About 3.8", "About 6"],
            picture: MILES,
          }),
        ],
        "Which unit do you know? Start on its axis.",
      ),
      own(G9, READING, "Spot the mistake"),

      own(G9, READING, "Exit check"),

      reworded(G9, READING, "How far in miles?", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Start on the axis you know, go to the line, then to the other axis.**"],
        MILES,
        [
          "**Start on the axis you know, go to the line, then to the other axis.**",
          "Check what each square is worth.",
          "1 mile ≈ 1.6 km.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Where curves cross.

const QUAD = "y9-graphs/quadratic";
const quadMethod = [
  "Make it 'curve = number'.",
  "Draw the line y = that number.",
  "Read x where they meet: usually two answers.",
];
const U = picOf(QUAD, "A quadratic graph");
const square = (at: number) => curve(1, 0, 0, { xMin: -4, xMax: 4, yMin: -1, yMax: 10 }, at);
const U15: Range = { xMin: -1, xMax: 7, yMin: -5, yMax: 8 };

const quadratic = stepped(find(G9, QUAD), {
  method: quadMethod,
  variation: {
    relationship: "the solutions of a quadratic: where its curve meets a line",
    unknowns: ["solutions", "positive"],
    surface: ["meeting y = 0", "meeting another line", "one answer", "not a whole number"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Where curves cross",
        ["**Solve a quadratic from its graph: where the curve meets the line.**"],
        U,
        "= 0 means where it crosses the x-axis: usually two answers.",
      ),
      reworded(
        G9,
        QUAD,
        "Solving $x^2 - 2x - 3 = 0$ means finding where y is 0. Where is that on the graph?",
        { tag: "The rule", title: "Where is $x^2 - 2x - 3 = 0$ on the graph?" },
      ),
      reworded(G9, QUAD, "Equal to something else", { tag: "The rule" }),

      ...owned(G9, QUAD, "Warm-up", "Check you remember"),

      methodCard("The method", quadMethod, U),
      workedFrom(G9, QUAD),
      calc(
        "Your turn",
        "Solve $x^2 - 1 = 0$ from the graph.",
        curve(1, 0, -1, { xMin: -3, xMax: 3, yMin: -2, yMax: 8 }),
        [
          ["It crosses the x-axis at $x =$", "-1", "The left crossing."],
          ["and at $x =$", "1", "The right crossing."],
        ],
        "$x = -1$ or $x = 1$.",
      ),

      calc(
        "Practise",
        "Solve $x^2 - 2x = 3$ from the graph.",
        curve(1, -2, 0, { xMin: -3, xMax: 5, yMin: -2, yMax: 8 }, 3),
        [
          ["The smaller x:", "-1", "Where the curve meets y = 3."],
          ["The bigger x:", "3", "The other meeting."],
        ],
        "$x = -1$ or $x = 3$.",
      ),
      ...owned(G9, QUAD, "Together", "Practise"),
      reworded(G9, QUAD, "Not a whole number", {
        tag: "Practise",
        text: "Estimate the positive solution of $x^2 - 3 = 0$.",
      }),
      reworded(G9, QUAD, "Solve $x^2 - 4 = 5$", { tag: "Practise" }),
      questionSet(
        "Practise",
        "The curve $y = x^2 - 6x + 5$. Watch what changes.",
        [
          ask("Solve $= 0$. The smaller x?", "1", "The left crossing.", "1.", {
            asks: "solutions",
            picture: curve(1, -6, 5, U15),
          }),
          ask("Solve $= 0$. The bigger x?", "5", "The right crossing.", "5.", {
            asks: "solutions",
            changed: "The other one.",
            picture: curve(1, -6, 5, U15),
          }),
          ask("Solve $= 5$. The bigger x?", "6", "Where it meets y = 5.", "6.", {
            asks: "solutions",
            changed: "Meet y = 5.",
            picture: curve(1, -6, 5, U15, 5),
          }),
          ask("Solve $= -4$. How many answers?", "1", "It just touches.", "1: x = 3.", {
            asks: "solutions",
            changed: "At the bottom.",
            picture: curve(1, -6, 5, U15, -4),
          }),
        ],
        "Read x wherever the curve meets the line.",
      ),

      questionSet(
        "Variation",
        "The curve $y = x^2$. Watch what changes.",
        [
          ask("Solve $x^2 = 9$.", "$x = 3$ or $x = -3$", "Two crossings.", "3 or −3.", {
            asks: "solutions",
            others: ["$x = 3$", "$x = 4.5$"],
            picture: square(9),
            expect: [
              "Mia solves $x^2 = 9$ and stops at $x = 3$. Finished?",
              "No",
              "$(-3)^2 = 9$ too: two answers.",
              [["Yes", "Try −3."]],
            ],
          }),
          ask("Solve $x^2 = 4$.", "$x = 2$ or $x = -2$", "Two crossings.", "2 or −2.", {
            asks: "solutions",
            changed: "A smaller number.",
            others: ["$x = 2$", "$x = 16$"],
            picture: square(4),
          }),
          ask("Solve $x^2 = 0$.", "$x = 0$", "It just touches.", "Only 0.", {
            asks: "solutions",
            changed: "Zero.",
            others: ["$x = 0$ or $x = 1$", "No answer"],
            picture: square(0),
          }),
          ask("Solve $x^2 = 2$. The positive x, to 1 d.p.?", "1.4", "$\\sqrt{2}$.", "1.4.", {
            asks: "positive",
            changed: "Not a square number.",
            picture: square(2),
          }),
        ],
        "A U meets a level line twice, once, or not at all.",
      ),
      own(G9, QUAD, "Spot the mistake"),

      own(G9, QUAD, "Exit check"),

      reworded(G9, QUAD, "A thrown ball", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Solve a quadratic from its graph: where the curve meets the line.**"],
        U,
        [
          "**Solve a quadratic from its graph: where the curve meets the line.**",
          "= 0: where it crosses the x-axis.",
          "$x^2 = 9$: 3 or −3.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Geometric sequences.

const GEOM = "y9-graphs/geometric";
const geomMethod = [
  "Divide a term by the one before: the common ratio.",
  "Check with another pair.",
  "Multiply to continue.",
];
const DOUBLING = maths("3, 6, 12, 24, \\ldots \\quad (\\times 2)");

const geometric = stepped(find(G9, GEOM), {
  method: geomMethod,
  variation: {
    relationship: "a geometric sequence and its common ratio",
    unknowns: ["ratio", "term"],
    surface: ["going down", "negative ratios", "adding instead"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Multiply each time",
        ["**Geometric sequences multiply by the same number each time.**"],
        DOUBLING,
        "The common ratio: a term ÷ the one before.",
      ),
      reworded(G9, GEOM, "Geometric sequences", { tag: "The rule" }),
      reworded(G9, GEOM, "Arithmetic sequences add the same each time. Geometric ones", {
        tag: "The rule",
      }),

      ...owned(G9, GEOM, "Warm-up", "Check you remember"),

      methodCard("The method", geomMethod, DOUBLING),
      workedFrom(G9, GEOM),
      calc(
        "Your turn",
        "Continue 4, 8, 16, …",
        undefined,
        [
          ["Ratio: $8 \\div 4 =$", "2", "Divide."],
          ["Next:", "32", "16 × 2."],
          ["Then:", "64", "32 × 2."],
        ],
        "4, 8, 16, 32, 64.",
      ),

      calc(
        "Practise",
        "Continue 96, 48, 24, …",
        undefined,
        [
          ["Ratio: $48 \\div 96 =$", "0.5", "Getting smaller."],
          ["Next:", "12", "24 × 0.5."],
          ["Then:", "6", "12 × 0.5."],
        ],
        "96, 48, 24, 12, 6.",
      ),
      ...owned(G9, GEOM, "Together", "Practise"),
      ...owned(G9, GEOM, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "5, 10, 20, … Watch what changes.",
        [
          ask("The common ratio?", "2", "10 ÷ 5.", "2.", { asks: "ratio" }),
          ask("The next term?", "40", "20 × 2.", "40.", { asks: "term", changed: "Now a term." }),
          ask("The 6th term?", "160", "40, 80, 160.", "160.", {
            asks: "term",
            changed: "Further on.",
          }),
          ask("5, −10, 20, …: the ratio?", ["-2", "−2"], "−10 ÷ 5.", "−2.", {
            asks: "ratio",
            changed: "A negative ratio.",
          }),
        ],
        "Divide to find the ratio; multiply to go on.",
      ),

      questionSet(
        "Variation",
        "Watch what changes.",
        [
          ask("3, 12, 48, …: the next term?", "192", "× 4.", "192.", {
            asks: "term",
            expect: [
              "For 3, 12, 48, Amy says the ratio is 12 − 3 = 9. Right?",
              "No",
              "Divide: 12 ÷ 3 = 4.",
              [["Yes", "Geometric means multiply."]],
            ],
          }),
          ask("3, 12, 48, …: the ratio?", "4", "12 ÷ 3.", "4.", {
            asks: "ratio",
            changed: "The ratio.",
          }),
          ask("48, 12, 3, …: the next term?", "0.75", "× 0.25.", "0.75.", {
            asks: "term",
            changed: "Going down.",
          }),
          ask("3, 9, 15, …: is it geometric?", "No: it adds 6", "Check the ratios.", "No.", {
            asks: "ratio",
            changed: "Adding instead.",
            others: ["Yes"],
          }),
        ],
        "Geometric: the same ratio every time.",
      ),
      own(G9, GEOM, "Spot the mistake"),

      own(G9, GEOM, "Exit check"),

      reworded(G9, GEOM, "Growing bacteria", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Geometric sequences multiply by the same number each time.**"],
        DOUBLING,
        [
          "**Geometric sequences multiply by the same number each time.**",
          "Common ratio = a term ÷ the one before.",
          "2, 4, 8, 16: next is 32, not 18.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Famous sequences.

const SPECIAL = "y9-graphs/special";
const specialMethod = [
  "Squares: times the number by itself.",
  "Triangular: add 1, 2, 3, 4, … in turn.",
  "Fibonacci: add the two before.",
];
const FAMOUS = maths(
  "\\begin{array}{l} 1, 4, 9, 16 \\ldots \\\\ 1, 3, 6, 10 \\ldots \\\\ 1, 1, 2, 3, 5 \\ldots \\end{array}",
);

const special = stepped(find(G9, SPECIAL), {
  method: specialMethod,
  variation: {
    relationship: "square, triangular and Fibonacci numbers",
    unknowns: ["term", "sequence"],
    surface: ["far along", "the same answer twice", "even numbers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Famous sequences",
        ["**Squares: n². Triangular: add one more each time. Fibonacci: add the last two.**"],
        FAMOUS,
        "Squares, triangular numbers, Fibonacci.",
      ),
      reworded(G9, SPECIAL, "Triangles and squares", { tag: "The rule" }),
      reworded(G9, SPECIAL, "1, 1, 2, 3, 5, 8, … what comes next?", { tag: "The rule" }),

      ...owned(G9, SPECIAL, "Warm-up", "Check you remember"),

      methodCard("The method", specialMethod, FAMOUS),
      workedFrom(G9, SPECIAL),
      calc(
        "Your turn",
        "The 7th triangular and square numbers.",
        undefined,
        [
          ["7th triangular: $21 + 7 =$", "28", "Add 7 to the 6th."],
          ["7th square: $7^2 =$", "49", "7 × 7."],
        ],
        "28 and 49.",
      ),

      calc(
        "Practise",
        "Continue 2, 3, 5, 8, …",
        undefined,
        [
          ["Next: $5 + 8 =$", "13", "Add the two before."],
          ["Then:", "21", "8 + 13."],
        ],
        "2, 3, 5, 8, 13, 21.",
      ),
      ...owned(G9, SPECIAL, "Together", "Practise"),
      ...owned(G9, SPECIAL, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("The 6th square number?", "36", "6 × 6.", "36.", { asks: "term" }),
          ask("The 6th triangular number?", "21", "15 + 6.", "21.", {
            asks: "term",
            changed: "Triangular.",
          }),
          ask("1, 1, 2, 3, 5, 8, 13, … next?", "21", "8 + 13.", "21.", {
            asks: "term",
            changed: "Fibonacci.",
          }),
          ask("Which is 1, 3, 6, 10, …?", "Triangular", "Add 2, 3, 4.", "Triangular.", {
            asks: "sequence",
            changed: "Name it.",
            others: ["Square", "Fibonacci"],
          }),
        ],
        "Know each rule.",
      ),

      questionSet(
        "Variation",
        "The 12th term. Watch the sequence change.",
        [
          ask("The 12th square number?", "144", "12 × 12.", "144.", {
            asks: "term",
            expect: [
              "Leo says the 5th square number is 5 × 2 = 10. Right?",
              "No",
              "$5^2 = 5 \\times 5 = 25$.",
              [["Yes", "Square means times itself."]],
            ],
          }),
          ask("The 12th triangular number?", "78", "1 + 2 + … + 12.", "78.", {
            asks: "term",
            changed: "Triangular.",
          }),
          ask(
            "The 12th Fibonacci number?",
            "144",
            "…, 55, 89, 144.",
            "144: the same as the square!",
            {
              asks: "term",
              changed: "Fibonacci.",
            },
          ),
          ask("The 12th even number?", "24", "2 × 12.", "24.", {
            asks: "term",
            changed: "Even numbers.",
          }),
        ],
        "The rule decides how fast it grows.",
      ),
      own(G9, SPECIAL, "Spot the mistake"),

      own(G9, SPECIAL, "Exit check"),

      reworded(G9, SPECIAL, "Fibonacci's rabbits", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Squares: n². Triangular: add one more each time. Fibonacci: add the last two.**"],
        FAMOUS,
        [
          "**Squares: n². Triangular: add one more each time. Fibonacci: add the last two.**",
          "5th square: 25, not 10.",
          "36 is square and triangular.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

export const y9GraphsStepped: [string, UnitLesson[]][] = [
  [READING, [reading]],
  [QUAD, [quadratic]],
  [GEOM, [geometric]],
  [SPECIAL, [special]],
];
