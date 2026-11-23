// GCSE Higher, "Sequences", on the stepped template (docs/proposals/lesson-stepped.md): geometric
// and other sequences, the nth term of a quadratic sequence, and iterative processes. Difference
// tables and year-by-year tables are the pictures; the rest is number work.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { differences, ghSequences, savings } from "./gh-sequences.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const SQ = ghSequences;
const NUMBER = "A sequence: the terms are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const steps = (...lines: string[]): Picture =>
  maths(`\\begin{array}{l} ${lines.join(" \\\\ ")} \\end{array}`);
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const DONE = "Copy this into your book to revise from.";

// ---------------------------------------------------------------------------------------------
// Geometric and other sequences.

const GEO = "gh-sequences/geometric";
const geoMethod = [
  "Divide a term by the one before: the ratio $r$.",
  "Check it's the same each time.",
  "Multiply on, or use $ar^{n-1}$.",
];
const RATIO = steps(
  "3,\\ 6,\\ 12,\\ 24",
  "r = 6 \\div 3 = 2",
  "n\\text{th term} = 3 \\times 2^{n-1}",
);
const next = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Divide to find the ratio, then multiply.", {
    asks: "next",
    ...extra,
  });

const geometric = stepped(find(SQ, GEO), {
  method: geoMethod,
  variation: {
    relationship: "a common ratio",
    unknowns: ["ratio", "next"],
    surface: ["a negative ratio", "a fraction", "a surd"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The common ratio",
        ["**A geometric sequence multiplies by the same ratio each time.**"],
        RATIO,
        "The $n$th term is $ar^{n-1}$: one fewer multiply than $n$.",
      ),
      reworded(SQ, GEO, "The ratio of $\\sqrt2, 2, 2\\sqrt2$", { tag: "The rule" }),

      ...owned(SQ, GEO, "Warm-up", "Check you remember"),

      methodCard("The method", geoMethod, RATIO),
      workedFrom(SQ, GEO),
      calc(
        "Your turn",
        "5, 15, 45, 135, …",
        undefined,
        [
          ["Ratio $r =$", "3", "15 ÷ 5."],
          ["The 6th term:", "1215", "135 × 3 × 3."],
        ],
        "1215.",
      ),

      calc(
        "Practise",
        "$a = 2$, $r = 3$. Use $ar^{n-1}$.",
        undefined,
        [
          ["The 4th term: $2 \\times 3^?$, ? =", "3", "$n - 1$."],
          ["The 4th term:", "54", "2 × 27."],
        ],
        "54.",
      ),
      ...owned(SQ, GEO, "Together", "Practise"),
      ...owned(SQ, GEO, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The ratio. Watch what changes.",
        [
          pick("4, 12, 36", "3", ["8", "24"], "12 ÷ 4.", { asks: "ratio" }),
          pick("4, −12, 36", "−3", ["3", "−16"], "−12 ÷ 4.", {
            asks: "ratio",
            changed: "Signs alternate.",
          }),
          pick("36, 12, 4", "$\\frac13$", ["3", "−24"], "12 ÷ 36.", {
            asks: "ratio",
            changed: "Getting smaller.",
          }),
          pick("4, $4\\sqrt3$, 12", "$\\sqrt3$", ["3", "$4\\sqrt3 - 4$"], "$4\\sqrt3 \\div 4$.", {
            asks: "ratio",
            changed: "A surd.",
          }),
        ],
        "Divide, never subtract, for a ratio.",
      ),

      questionSet(
        "Variation",
        "The next term. Watch what changes.",
        [
          next("2, 6, 18, …", "54", ["22", "36"], {
            expect: [
              "For 2, 6, 18, Ivy subtracts and gets a ratio of 4. Right?",
              "No",
              "Divide for a ratio: $6 \\div 2 = 3$.",
              [["Yes", "Is the ratio a difference or a division?"]],
            ],
          }),
          next("2, −6, 18, …", "−54", ["54", "30"], { changed: "A negative ratio." }),
          next("18, 6, 2, …", "$\\frac23$", ["−2", "0"], { changed: "Shrinking." }),
          next("2, $2\\sqrt2$, 4, …", "$4\\sqrt2$", ["8", "6"], { changed: "A surd ratio." }),
        ],
        "Find the ratio, then multiply.",
      ),
      own(SQ, GEO, "Spot the mistake"),

      own(SQ, GEO, "Exit check"),

      reworded(
        SQ,
        GEO,
        "“Find the next two terms.”",
        { tag: "Real life", title: "$\\sqrt2, 2, 2\\sqrt2, 4, \\ldots$ Find the next two terms." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**A geometric sequence multiplies by the same ratio each time.**"],
        RATIO,
        [
          "**A geometric sequence multiplies by the same ratio each time.**",
          "Ratio: divide a term by the one before.",
          "$n$th term $ar^{n-1}$.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// The nth term of a quadratic sequence.

const QUAD = "gh-sequences/quadratic-nth";
const quadMethod = [
  "Second difference ÷ 2: the $n^2$ coefficient.",
  "Take away $an^2$ from each term.",
  "Find the linear rule for what's left.",
];
const nth = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Halve the second difference first.", { asks: "nth", ...extra });

const quadratic = stepped(find(SQ, QUAD), {
  method: quadMethod,
  variation: {
    relationship: "second differences and the n² term",
    unknowns: ["a", "nth"],
    surface: ["a bigger second difference", "a constant left", "a linear part"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Second differences",
        ["**Halve the second difference for the n² term; then find the linear part.**"],
        differences,
        "Second difference 4: the $n^2$ term is $2n^2$.",
      ),
      reworded(SQ, QUAD, "Second difference 4, so the $n^2$ term is", { tag: "The rule" }),

      ...owned(SQ, QUAD, "Warm-up", "Check you remember"),

      methodCard("The method", quadMethod, differences),
      workedFrom(SQ, QUAD),
      calc(
        "Your turn",
        "Find the $n$th term of 3, 8, 15, 24, 35.",
        undefined,
        [
          ["Second difference:", "2", "5, 7, 9, 11."],
          ["$n^2$ coefficient:", "1", "Half of 2."],
          ["Term − $n^2$: 2, 4, 6, … so add $?n$, ? =", "2", "Goes up in 2s."],
        ],
        "$n^2 + 2n$.",
      ),

      calc(
        "Practise",
        "Find the $n$th term of 4, 13, 28, 49.",
        undefined,
        [
          ["Second difference:", "6", "9, 15, 21."],
          ["$n^2$ coefficient:", "3", "Half of 6."],
          ["Term − $3n^2$ is always", "1", "4 − 3, 13 − 12, …"],
        ],
        "$3n^2 + 1$.",
      ),
      ...owned(SQ, QUAD, "Together", "Practise"),
      ...owned(SQ, QUAD, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The $n^2$ coefficient. Watch what changes.",
        [
          pick("Second difference 2", "1", ["2", "4"], "Half of it.", { asks: "a" }),
          pick("Second difference 6", "3", ["6", "12"], "Half of it.", {
            asks: "a",
            changed: "Bigger.",
          }),
          pick("Second difference 1", "$\\frac12$", ["1", "2"], "Half of it.", {
            asks: "a",
            changed: "Odd.",
          }),
          pick("Second difference −4", "−2", ["2", "−4"], "Half of it.", {
            asks: "a",
            changed: "Negative.",
          }),
        ],
        "$an^2$ has second difference $2a$.",
      ),

      questionSet(
        "Variation",
        "The $n$th term. Watch what changes.",
        [
          nth("3, 9, 19, 33", "$2n^2 + 1$", ["$2n^2 - 1$", "$4n^2 + 1$"], {
            expect: [
              "For 3, 9, 19, 33 Leo finds term − $2n^2$ is 1 each time, then writes $2n^2 - 1$. Right?",
              "No",
              "What's left is +1: $2n^2 + 1$.",
              [["Yes", "Do you add or take away what's left?"]],
            ],
          }),
          nth("2, 5, 10, 17", "$n^2 + 1$", ["$2n^2 + 1$", "$n^2 + 3$"], {
            changed: "Second difference 2.",
          }),
          nth("3, 6, 11, 18", "$n^2 + 2$", ["$n^2 + 3$", "$2n^2 + 1$"], {
            changed: "Back to $n^2$.",
          }),
          nth("2, 6, 12, 20", "$n^2 + n$", ["$n^2 + 1$", "$2n^2$"], {
            changed: "A linear part.",
          }),
        ],
        "Check your rule on the first term.",
      ),
      own(SQ, QUAD, "Spot the mistake"),

      own(SQ, QUAD, "Exit check"),

      reworded(
        SQ,
        QUAD,
        "“Find the $n$th term.” The 6th term?",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Halve the second difference for the n² term; then find the linear part.**"],
        differences,
        [
          "**Halve the second difference for the n² term; then find the linear part.**",
          "Take $an^2$ off each term.",
          "Check with the first term.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Iterative processes.

const ITER = "gh-sequences/iterative-processes";
const iterMethod = [
  "Start from the first value.",
  "Apply the rule to get the next.",
  "Repeat, always using the newest value.",
];
const value = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "One step at a time.", { asks: "value", ...extra });

const iterative = stepped(find(SQ, ITER), {
  method: iterMethod,
  variation: {
    relationship: "each value from the one before",
    unknowns: ["value", "balance"],
    surface: ["a second step", "a new rule", "a fraction"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A rule for the next one",
        ["**Apply the same rule to each new value, one step at a time.**"],
        savings,
        "$u_{n+1} = 1.03u_n - 100$: grow 3%, then take £100.",
      ),
      reworded(SQ, ITER, "$u_1 = 1960$. $u_2 =$", { tag: "The rule" }),

      ...owned(SQ, ITER, "Warm-up", "Check you remember"),

      methodCard("The method", iterMethod, savings),
      workedFrom(SQ, ITER),
      calc(
        "Your turn",
        "$u_{n+1} = 3u_n - 2$, $u_1 = 2$.",
        undefined,
        [
          ["$u_2 =$", "4", "3 × 2 − 2."],
          ["$u_3 =$", "10", "3 × 4 − 2."],
          ["$u_4 =$", "28", "3 × 10 − 2."],
        ],
        "2, 4, 10, 28.",
      ),

      calc(
        "Practise",
        "£500 earns 2% a year; £20 is taken out each year.",
        undefined,
        [
          ["After 1 year: £", "490", "500 × 1.02 − 20."],
          ["After 2 years: £", "479.80", "490 × 1.02 − 20."],
        ],
        "£479.80.",
      ),
      ...owned(SQ, ITER, "Together", "Practise"),
      ...owned(SQ, ITER, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find $u_2$. Watch what changes.",
        [
          value("$u_{n+1} = 2u_n + 1$, $u_1 = 3$", "7", ["6", "5"], {}),
          value("$u_{n+1} = 2u_n + 1$, $u_1 = 10$", "21", ["20", "13"], {
            changed: "A new start.",
          }),
          value("$u_{n+1} = 2u_n - 1$, $u_1 = 10$", "19", ["21", "9"], { changed: "Minus 1." }),
          value("$u_{n+1} = \\frac{u_n}{2} + 4$, $u_1 = 10$", "9", ["5", "7"], {
            changed: "Halve it.",
          }),
        ],
        "Put the value in, work it out, then repeat.",
      ),

      questionSet(
        "Variation",
        "Kai: $u_{n+1} = 1.03u_n - 100$. Watch what changes.",
        [
          pick("From $u_1 = 1960$, $u_2$", "£1918.80", ["£1960", "£1920"], "1.03 × 1960 − 100.", {
            asks: "balance",
            expect: [
              "For $u_2$, Ben works out $1.03 \\times 2000 - 100$ again. Right?",
              "No",
              "Use the newest value: $1.03 \\times 1960 - 100 = 1918.80$.",
              [["Yes", "Which value does $u_2$ come from?"]],
            ],
          }),
          pick("From $u_0 = 3000$, $u_1$", "£2990", ["£3090", "£2900"], "1.03 × 3000 − 100.", {
            asks: "balance",
            changed: "More to start.",
          }),
          pick("From $u_0 = 4000$, $u_1$", "£4020", ["£3900", "£4120"], "1.03 × 4000 − 100.", {
            asks: "balance",
            changed: "It grows now.",
          }),
          pick("Balance that stays level", "About £3333", ["£100", "£2000"], "0.03u = 100.", {
            asks: "balance",
            changed: "Level.",
          }),
        ],
        "Interest beats withdrawals only above £3333.",
      ),
      own(SQ, ITER, "Spot the mistake"),

      own(SQ, ITER, "Exit check"),

      reworded(
        SQ,
        ITER,
        "“Find his balance after 3 years.” To the nearest penny.",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Apply the same rule to each new value, one step at a time.**"],
        savings,
        [
          "**Apply the same rule to each new value, one step at a time.**",
          "Always use the newest value.",
          "It's not just compound interest: the step changes each time.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const ghSequencesStepped: [string, UnitLesson[]][] = [
  [GEO, [geometric]],
  [QUAD, [quadratic]],
  [ITER, [iterative]],
];
