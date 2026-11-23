// GCSE Higher, "Number: counting, roots and surds", on the stepped template
// (docs/proposals/lesson-stepped.md): the product rule for counting, estimating powers and roots,
// fractional indices, simplifying surds, exact calculation with surds, and rationalising. Number
// and algebra are their own picture; working is set out a line at a time.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { ghSurds, lock } from "./gh-surds.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const SU = ghSurds;
const NUMBER = "A number fact: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const steps = (...lines: string[]): Picture =>
  maths(`\\begin{array}{l} ${lines.join(" \\\\ ")} \\end{array}`);
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
// The product rule for counting.

const COUNT = "gh-surds/product-rule";
const countMethod = [
  "List the stages.",
  "Count the choices at each: one fewer if no repeats.",
  "Multiply them.",
];
const NO_REPEATS = table(["Wheel", "1st", "2nd", "3rd", "4th"], [["Choices", "10", "9", "8", "7"]]);
const ways = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Multiply the choices at each stage.", { asks: "ways", ...extra });

const productRule = stepped(find(SU, COUNT), {
  method: countMethod,
  variation: {
    relationship: "choices multiplied stage by stage",
    unknowns: ["ways", "arrange"],
    surface: ["no repeats", "more stages", "fewer choices"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Multiply the choices",
        ["**Multiply the number of choices at each stage.**"],
        NO_REPEATS,
        "No repeats: one fewer choice each time.",
      ),
      reworded(SU, COUNT, "Codes with repeats allowed", { tag: "The rule", picture: lock }),

      ...owned(SU, COUNT, "Warm-up", "Check you remember"),

      methodCard("The method", countMethod, NO_REPEATS),
      workedFrom(SU, COUNT),
      calc(
        "Your turn",
        "Menus: 3 starters, 5 mains, 4 puddings.",
        undefined,
        [
          ["Starter and main:", "15", "3 × 5."],
          ["All three courses:", "60", "15 × 4."],
        ],
        "60 different meals.",
      ),

      calc(
        "Practise",
        "Choose a captain and a vice-captain from 12 players.",
        undefined,
        [
          ["Choices for captain:", "12", "Anyone."],
          ["Pairs in all:", "132", "12 × 11: not the same person."],
        ],
        "132 ways.",
      ),
      ...owned(SU, COUNT, "Together", "Practise"),
      ...owned(SU, COUNT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Codes from 0–9. Watch what changes.",
        [
          ways("2 digits, repeats allowed", "100", ["20", "90"], { asks: "ways" }),
          ways("2 digits, no repeats", "90", ["100", "81"], { changed: "No repeats." }),
          ways("3 digits, no repeats", "720", ["1000", "27"], { changed: "Three digits." }),
          ways("3 digits, repeats allowed", "1000", ["720", "30"], {
            changed: "Repeats again.",
          }),
        ],
        "No repeats: 10 × 9 × 8 …",
      ),

      questionSet(
        "Variation",
        "Arrange the letters. Watch what changes.",
        [
          pick("A, B, C, D: all four", "24", ["16", "256"], "4 × 3 × 2 × 1.", {
            asks: "arrange",
            expect: [
              "For 3-letter codes from A, B, C, D, no repeats, Ben does $4 \\times 4 \\times 4$. Right?",
              "No",
              "One fewer each time: $4 \\times 3 \\times 2 = 24$.",
              [["Yes", "Can a letter be used twice?"]],
            ],
          }),
          pick("A, B, C, D: any three", "24", ["64", "12"], "4 × 3 × 2.", {
            asks: "arrange",
            changed: "Only three places.",
          }),
          pick("A, B, C, D, E: all five", "120", ["25", "24"], "5 × 4 × 3 × 2 × 1.", {
            asks: "arrange",
            changed: "One more letter.",
          }),
          pick("A, B, C, D, E: any two", "20", ["25", "10"], "5 × 4.", {
            asks: "arrange",
            changed: "Only two places.",
          }),
        ],
        "Each place has one fewer choice.",
      ),
      own(SU, COUNT, "Spot the mistake"),

      own(SU, COUNT, "Exit check"),

      reworded(
        SU,
        COUNT,
        "“How many codes if no digit can be repeated?”",
        { tag: "Real life", title: "A 4-wheel lock, digits 0–9, no repeats. How many codes?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply the number of choices at each stage.**"],
        NO_REPEATS,
        [
          "**Multiply the number of choices at each stage.**",
          "No repeats: one fewer each time.",
          "3 shirts and 5 trousers: 15 outfits, not 8.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Estimating powers and roots.

const EST = "gh-surds/estimate";
const estMethod = [
  "Find the square (or cube) numbers either side.",
  "The root lies between their roots.",
  "Judge which it's nearer.",
];
const SQUEEZE = steps("49 < 50 < 64", "7 < \\sqrt{50} < 8", "\\sqrt{50} \\approx 7.1");
const between = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Squares or cubes either side.", { asks: "between", ...extra });

const estimate = stepped(find(SU, EST), {
  method: estMethod,
  variation: {
    relationship: "a root squeezed between whole numbers",
    unknowns: ["between", "estimate"],
    surface: ["nearer the top", "a cube root", "a bigger number"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Squeeze it",
        ["**Find the square numbers either side; the root lies between their roots.**"],
        SQUEEZE,
        "50 is just over 49, so the root is just over 7.",
      ),
      reworded(SU, EST, "$\\sqrt{50}$ is between", { tag: "The rule" }),

      ...owned(SU, EST, "Warm-up", "Check you remember"),

      methodCard("The method", estMethod, SQUEEZE),
      workedFrom(SU, EST),
      calc(
        "Your turn",
        "Estimate $\\sqrt{80}$.",
        undefined,
        [
          ["The square below 80:", "64", "8²."],
          ["The square above 80:", "81", "9²."],
          ["$\\sqrt{80} \\approx$", "8.9", "80 is very close to 81."],
        ],
        "About 8.9.",
      ),

      calc(
        "Practise",
        "Estimate $\\sqrt[3]{120}$.",
        undefined,
        [
          ["The cube below 120:", "64", "4³."],
          ["The cube above 120:", "125", "5³."],
          ["$\\sqrt[3]{120} \\approx$", "4.9", "Close to 125."],
        ],
        "About 4.9.",
      ),
      ...owned(SU, EST, "Together", "Practise"),
      ...owned(SU, EST, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Between which whole numbers? Watch what changes.",
        [
          between("$\\sqrt{20}$", "4 and 5", ["10 and 11", "3 and 4"]),
          between("$\\sqrt{35}$", "5 and 6", ["17 and 18", "6 and 7"], { changed: "Bigger." }),
          between("$\\sqrt[3]{20}$", "2 and 3", ["4 and 5", "6 and 7"], {
            changed: "A cube root.",
          }),
          between("$\\sqrt{150}$", "12 and 13", ["75 and 76", "11 and 12"], {
            changed: "Much bigger.",
          }),
        ],
        "Know your squares to 15² and cubes to 5³.",
      ),

      questionSet(
        "Variation",
        "The best estimate. Watch what changes.",
        [
          pick("$\\sqrt{60}$", "7.7", ["7.2", "30"], "60 is nearer 64.", {
            asks: "estimate",
            expect: [
              "Kim says 60 is nearer 49, so $\\sqrt{60} \\approx 7.2$. Right?",
              "No",
              "60 is 4 from 64 but 11 from 49: about 7.7.",
              [["Yes", "Is 60 nearer 49 or 64?"]],
            ],
          }),
          pick("$\\sqrt{51}$", "7.1", ["7.9", "25.5"], "Just over 49.", {
            asks: "estimate",
            changed: "Near the bottom.",
          }),
          pick("$\\sqrt{63}$", "7.9", ["7.1", "31.5"], "Just under 64.", {
            asks: "estimate",
            changed: "Near the top.",
          }),
          pick("$\\sqrt{99}$", "9.9", ["9.1", "49.5"], "Just under 100.", {
            asks: "estimate",
            changed: "A new pair.",
          }),
        ],
        "Nearer the top square: nearer the top root.",
      ),
      own(SU, EST, "Spot the mistake"),

      own(SU, EST, "Exit check"),

      reworded(
        SU,
        EST,
        "“Estimate $\\sqrt{50}$ to 1 decimal place.”",
        { tag: "Real life", title: "A square rug is 50 m². Estimate its side, to 1 d.p." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Find the square numbers either side; the root lies between their roots.**"],
        SQUEEZE,
        [
          "**Find the square numbers either side; the root lies between their roots.**",
          "Then judge which end it's nearer.",
          "A square root is not a half.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Fractional indices.

const FRAC = "gh-surds/fractional-indices";
const fracMethod = [
  "The bottom of the fraction: the root.",
  "The top: the power.",
  "A minus: one over it, last.",
];
const ROOT = steps("8^{2/3}", "= (\\sqrt[3]{8})^2", "= 2^2 = 4");
const power = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Root first, then power, then the minus.", {
    asks: "value",
    ...extra,
  });

const fractional = stepped(find(SU, FRAC), {
  method: fracMethod,
  variation: {
    relationship: "a root and a power in one index",
    unknowns: ["value"],
    surface: ["a cube root", "a power on top", "a minus"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Root, then power",
        ["**In** $a^{m/n}$, **the bottom is the root and the top is the power.**"],
        ROOT,
        "$a^{1/2}$ is a square root, not a half.",
      ),
      reworded(SU, FRAC, "$25^{1/2}$", { tag: "The rule" }),

      ...owned(SU, FRAC, "Warm-up", "Check you remember"),

      methodCard("The method", fracMethod, ROOT),
      workedFrom(SU, FRAC),
      calc(
        "Your turn",
        "Work out $27^{2/3}$.",
        undefined,
        [
          ["$\\sqrt[3]{27} =$", "3", "3³ = 27."],
          ["Squared:", "9", "3²."],
        ],
        "$27^{2/3} = 9$.",
      ),

      calc(
        "Practise",
        "Work out $16^{-3/4}$.",
        undefined,
        [
          ["$\\sqrt[4]{16} =$", "2", "2⁴ = 16."],
          ["Cubed:", "8", "2³."],
          ["One over it: $\\frac{1}{?}$, ? =", "8", "The minus last."],
        ],
        "$16^{-3/4} = \\frac18$.",
      ),
      ...owned(SU, FRAC, "Together", "Practise"),
      ...owned(SU, FRAC, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Work it out. Watch what changes.",
        [
          power("$64^{1/2}$", "8", ["32", "4"]),
          power("$64^{1/3}$", "4", ["8", "21.3"], { changed: "A cube root." }),
          power("$64^{2/3}$", "16", ["4", "42.7"], { changed: "Squared after." }),
          power("$64^{-1/3}$", "$\\frac14$", ["−4", "4"], { changed: "A minus." }),
        ],
        "Bottom: root. Top: power. Minus: one over.",
      ),

      questionSet(
        "Variation",
        "Work it out. Watch what changes.",
        [
          power("$8^{-1/3}$", "$\\frac12$", ["−2", "2"], {
            expect: [
              "Leo says $64^{-1/3} = -4$. Right?",
              "No",
              "A negative index means one over: $\\frac14$.",
              [["Yes", "Does a negative power make a negative number?"]],
            ],
          }),
          power("$8^{-2/3}$", "$\\frac14$", ["−4", "$\\frac12$"], {
            changed: "Squared too.",
          }),
          power("$8^{2/3}$", "4", ["$\\frac14$", "5.3"], { changed: "No minus." }),
          power("$8^{4/3}$", "16", ["10.7", "4"], { changed: "A bigger power." }),
        ],
        "A negative index never makes a negative number.",
      ),
      own(SU, FRAC, "Spot the mistake"),

      own(SU, FRAC, "Exit check"),

      reworded(SU, FRAC, "“Work out $8^{2/3}$.”", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**In** $a^{m/n}$, **the bottom is the root and the top is the power.**"],
        ROOT,
        [
          "**In** $a^{m/n}$, **the bottom is the root and the top is the power.**",
          "$a^{-n} = \\frac{1}{a^n}$.",
          "$9^{1/2} = 3$, not 4.5.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Simplifying surds.

const SIMPLE = "gh-surds/simplify-surds";
const simpleMethod = [
  "Find the biggest square factor.",
  "Split: $\\sqrt{ab} = \\sqrt a \\times \\sqrt b$.",
  "Take the square root of the square.",
];
const SPLIT = steps(
  "\\sqrt{50} = \\sqrt{25 \\times 2}",
  "= \\sqrt{25} \\times \\sqrt2",
  "= 5\\sqrt2",
);
const surd = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "The biggest square factor.", { asks: "surd", ...extra });

const simplify = stepped(find(SU, SIMPLE), {
  method: simpleMethod,
  variation: {
    relationship: "a square factor taken out of a root",
    unknowns: ["surd", "multiply"],
    surface: ["a bigger square", "not the biggest", "the same root twice"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Split off a square",
        ["**Find the biggest square factor and take its root outside.**"],
        SPLIT,
        "Roots split over ×, never over +.",
      ),
      reworded(SU, SIMPLE, "$\\sqrt{12}$ simplified", { tag: "The rule" }),

      ...owned(SU, SIMPLE, "Warm-up", "Check you remember"),

      methodCard("The method", simpleMethod, SPLIT),
      workedFrom(SU, SIMPLE),
      calc(
        "Your turn",
        "Simplify $\\sqrt{98}$.",
        undefined,
        [
          ["Biggest square factor:", "49", "98 = 49 × 2."],
          ["$\\sqrt{98} = ?\\sqrt2$, ? =", "7", "√49."],
        ],
        "$\\sqrt{98} = 7\\sqrt2$.",
      ),

      calc(
        "Practise",
        "Simplify $\\sqrt{108}$.",
        undefined,
        [
          ["Biggest square factor:", "36", "108 = 36 × 3."],
          ["$\\sqrt{108} = ?\\sqrt3$, ? =", "6", "√36."],
        ],
        "$\\sqrt{108} = 6\\sqrt3$.",
      ),
      ...owned(SU, SIMPLE, "Together", "Practise"),
      ...owned(SU, SIMPLE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Simplify. Watch what changes.",
        [
          surd("$\\sqrt{8}$", "$2\\sqrt2$", ["$4\\sqrt2$", "$2\\sqrt4$"]),
          surd("$\\sqrt{32}$", "$4\\sqrt2$", ["$2\\sqrt8$", "$8\\sqrt2$"], {
            changed: "A bigger square.",
          }),
          surd("$\\sqrt{27}$", "$3\\sqrt3$", ["$9\\sqrt3$", "$3\\sqrt9$"], {
            changed: "A factor of 9.",
          }),
          surd("$\\sqrt{63}$", "$3\\sqrt7$", ["$7\\sqrt3$", "$9\\sqrt7$"], {
            changed: "A new surd.",
          }),
        ],
        "Biggest square factor out front.",
      ),

      questionSet(
        "Variation",
        "Simplify fully. Watch what changes.",
        [
          surd("$\\sqrt{80}$", "$4\\sqrt5$", ["$2\\sqrt{20}$", "$5\\sqrt4$"], {
            expect: [
              "Ben simplifies $\\sqrt{80}$ to $2\\sqrt{20}$. Finished?",
              "No",
              "16 is a bigger square factor: $\\sqrt{80} = 4\\sqrt5$.",
              [["Yes", "Can $\\sqrt{20}$ be simplified?"]],
            ],
          }),
          surd("$\\sqrt{20}$", "$2\\sqrt5$", ["$4\\sqrt5$", "$5\\sqrt2$"], {
            changed: "A smaller number.",
          }),
          surd("$\\sqrt{180}$", "$6\\sqrt5$", ["$3\\sqrt{20}$", "$2\\sqrt{45}$"], {
            changed: "Bigger again.",
          }),
          pick("$\\sqrt5 \\times \\sqrt{20}$", "10", ["$\\sqrt{25}$", "$5\\sqrt2$"], "√100.", {
            asks: "multiply",
            changed: "Multiply first.",
          }),
        ],
        "Check the surd left can't simplify again.",
      ),
      own(SU, SIMPLE, "Spot the mistake"),

      own(SU, SIMPLE, "Exit check"),

      reworded(
        SU,
        SIMPLE,
        "“Find the diagonal as a surd in its simplest form.”",
        { tag: "Real life", title: "A square tile has side 5 cm. Its diagonal, as a surd?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Find the biggest square factor and take its root outside.**"],
        SPLIT,
        [
          "**Find the biggest square factor and take its root outside.**",
          "$\\sqrt{ab} = \\sqrt a \\times \\sqrt b$.",
          "$\\sqrt{9 + 16} \\ne 3 + 4$.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Calculating exactly with surds.

const EXACT = "gh-surds/exact-surds";
const exactMethod = [
  "Simplify each surd.",
  "Collect like surds, like $x$'s.",
  "Expand brackets; $\\sqrt a \\times \\sqrt a = a$.",
];
const LIKE = steps("(3 + \\sqrt2)(3 - \\sqrt2)", "= 9 - 3\\sqrt2 + 3\\sqrt2 - 2", "= 7");
const work = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Treat the surd like a letter.", { asks: "value", ...extra });

const exact = stepped(find(SU, EXACT), {
  method: exactMethod,
  variation: {
    relationship: "surds handled like letters",
    unknowns: ["collect", "value"],
    surface: ["a square", "opposite signs", "a surd outside"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Surds behave like letters",
        [
          "**Collect like surds; expand brackets like algebra.**",
          "$\\sqrt a \\times \\sqrt a = a$.",
        ],
        LIKE,
        "Opposite signs: the surds cancel.",
      ),
      reworded(SU, EXACT, "$\\sqrt{12} + \\sqrt{27}$", { tag: "The rule" }),

      ...owned(SU, EXACT, "Warm-up", "Check you remember"),

      methodCard("The method", exactMethod, LIKE),
      workedFrom(SU, EXACT),
      calc(
        "Your turn",
        "Expand $(5 + \\sqrt3)(5 - \\sqrt3)$.",
        undefined,
        [
          ["$5 \\times 5 =$", "25", "First terms."],
          ["$\\sqrt3 \\times \\sqrt3 =$", "3", "A root squared."],
          ["Answer:", "22", "25 − 3: the surds cancel."],
        ],
        "22.",
      ),

      calc(
        "Practise",
        "Expand $(3 + \\sqrt2)^2$.",
        undefined,
        [
          ["Middle terms: $? \\sqrt2$, ? =", "6", "$3\\sqrt2 + 3\\sqrt2$."],
          ["Whole number part:", "11", "9 + 2."],
        ],
        "$11 + 6\\sqrt2$.",
      ),
      ...owned(SU, EXACT, "Together", "Practise"),
      ...owned(SU, EXACT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Collect. Watch what changes.",
        [
          pick("$2\\sqrt3 + 5\\sqrt3$", "$7\\sqrt3$", ["$7\\sqrt6$", "$10\\sqrt3$"], "2 + 5.", {
            asks: "collect",
          }),
          pick("$5\\sqrt3 - 2\\sqrt3$", "$3\\sqrt3$", ["$3$", "$7\\sqrt3$"], "5 − 2.", {
            asks: "collect",
            changed: "Subtract.",
          }),
          pick(
            "$\\sqrt{12} + \\sqrt3$",
            "$3\\sqrt3$",
            ["$\\sqrt{15}$", "$2\\sqrt3$"],
            "√12 = 2√3.",
            {
              asks: "collect",
              changed: "Simplify first.",
            },
          ),
          pick(
            "$\\sqrt2 + \\sqrt3$",
            "It can't be simplified",
            ["$\\sqrt5$", "$2\\sqrt5$"],
            "Unlike surds.",
            {
              asks: "collect",
              changed: "Unlike surds.",
            },
          ),
        ],
        "Like surds collect; unlike ones don't.",
      ),

      questionSet(
        "Variation",
        "Work it out. Watch what changes.",
        [
          work("$2\\sqrt3 \\times 4\\sqrt3$", "24", ["$8\\sqrt3$", "$6\\sqrt3$"], {
            expect: [
              "Leo says $\\sqrt3 \\times \\sqrt3 = \\sqrt3$. Right?",
              "No",
              "A root times itself is the number: 3. So $8 \\times 3 = 24$.",
              [["Yes", "What is $\\sqrt3$ squared?"]],
            ],
          }),
          work("$(1 + \\sqrt3)^2$", "$4 + 2\\sqrt3$", ["4", "$1 + 3\\sqrt3$"], {
            changed: "A square.",
          }),
          work("$(1 + \\sqrt3)(1 - \\sqrt3)$", "−2", ["4", "$2\\sqrt3$"], {
            changed: "Opposite signs.",
          }),
          work("$\\sqrt3(1 + \\sqrt3)$", "$\\sqrt3 + 3$", ["$2\\sqrt3$", "$1 + 3$"], {
            changed: "A surd outside.",
          }),
        ],
        "$\\sqrt a \\times \\sqrt a = a$.",
      ),
      own(SU, EXACT, "Spot the mistake"),

      own(SU, EXACT, "Exit check"),

      reworded(
        SU,
        EXACT,
        "“Show that the area is a whole number.”",
        { tag: "Real life", title: "A rectangle is $3 + \\sqrt2$ by $3 - \\sqrt2$. Its area?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        [
          "**Collect like surds; expand brackets like algebra.**",
          "$\\sqrt a \\times \\sqrt a = a$.",
        ],
        LIKE,
        [
          "**Collect like surds; expand brackets like algebra.**",
          "$\\sqrt a \\times \\sqrt a = a$.",
          "$(1 + \\sqrt2)^2 = 3 + 2\\sqrt2$.",
          "Opposite signs: the surds cancel.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Rationalising denominators.

const RAT = "gh-surds/rationalise";
const ratMethod = [
  "Bottom $\\sqrt a$: multiply top and bottom by $\\sqrt a$.",
  "Bottom $b + \\sqrt a$: multiply by $b - \\sqrt a$.",
  "Simplify.",
];
const CLEAR = steps(
  "\\frac{6}{\\sqrt3} \\times \\frac{\\sqrt3}{\\sqrt3}",
  "= \\frac{6\\sqrt3}{3} = 2\\sqrt3",
);
const ratio = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Multiply top and bottom by the same thing.", {
    asks: "rationalise",
    ...extra,
  });

const rationalise = stepped(find(SU, RAT), {
  method: ratMethod,
  variation: {
    relationship: "a surd cleared from the denominator",
    unknowns: ["rationalise", "bracket"],
    surface: ["a bigger top", "a new surd", "a bracket below"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Times by a clever 1",
        ["**Multiply top and bottom by the same surd to clear it from the bottom.**"],
        CLEAR,
        "Multiplying by $\\frac{\\sqrt3}{\\sqrt3}$ is multiplying by 1.",
      ),
      reworded(SU, RAT, "To rationalise $\\frac{5}{\\sqrt2}$, multiply top and bottom by", {
        tag: "The rule",
      }),

      ...owned(SU, RAT, "Warm-up", "Check you remember"),

      methodCard("The method", ratMethod, CLEAR),
      workedFrom(SU, RAT),
      calc(
        "Your turn",
        "Rationalise $\\frac{15}{\\sqrt5}$.",
        undefined,
        [
          ["Top: $15\\sqrt5$. Bottom:", "5", "√5 × √5."],
          ["$\\frac{15\\sqrt5}{5} = ?\\sqrt5$, ? =", "3", "15 ÷ 5."],
        ],
        "$3\\sqrt5$.",
      ),

      calc(
        "Practise",
        "Rationalise $\\frac{2}{3 - \\sqrt5}$.",
        undefined,
        [
          ["Multiply by $3 + \\sqrt5$. Bottom:", "4", "9 − 5."],
          ["$\\frac{2(3 + \\sqrt5)}{4} = \\frac{3 + \\sqrt5}{?}$, ? =", "2", "Cancel the 2."],
        ],
        "$\\frac{3 + \\sqrt5}{2}$.",
      ),
      ...owned(SU, RAT, "Together", "Practise"),
      ...owned(SU, RAT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Rationalise. Watch what changes.",
        [
          ratio("$\\frac{1}{\\sqrt3}$", "$\\frac{\\sqrt3}{3}$", [
            "$\\sqrt3$",
            "$\\frac{3}{\\sqrt3}$",
          ]),
          ratio("$\\frac{3}{\\sqrt3}$", "$\\sqrt3$", ["$\\frac{\\sqrt3}{3}$", "3"], {
            changed: "A bigger top.",
          }),
          ratio("$\\frac{6}{\\sqrt3}$", "$2\\sqrt3$", ["$6\\sqrt3$", "$\\frac{\\sqrt3}{2}$"], {
            changed: "Bigger still.",
          }),
          ratio("$\\frac{6}{\\sqrt2}$", "$3\\sqrt2$", ["$6\\sqrt2$", "$2\\sqrt3$"], {
            changed: "A new surd.",
          }),
        ],
        "Then simplify the fraction.",
      ),

      questionSet(
        "Variation",
        "Brackets below. Watch what changes.",
        [
          pick(
            "$\\frac{1}{2 + \\sqrt3}$",
            "$2 - \\sqrt3$",
            ["$\\frac{2 - \\sqrt3}{7}$", "$2 + \\sqrt3$"],
            "Bottom: 4 − 3 = 1.",
            {
              asks: "bracket",
              expect: [
                "Zoe works out $(2 + \\sqrt3)(2 - \\sqrt3)$ as $4 + 3 = 7$. Right?",
                "No",
                "$\\sqrt3 \\times -\\sqrt3 = -3$: the bottom is $4 - 3 = 1$.",
                [["Yes", "What sign does $\\sqrt3 \\times -\\sqrt3$ have?"]],
              ],
            },
          ),
          pick(
            "$\\frac{1}{2 - \\sqrt3}$",
            "$2 + \\sqrt3$",
            ["$2 - \\sqrt3$", "$\\frac{2 + \\sqrt3}{7}$"],
            "Bottom: 4 − 3 = 1.",
            { asks: "bracket", changed: "A minus below." },
          ),
          pick(
            "$\\frac{1}{3 + \\sqrt2}$",
            "$\\frac{3 - \\sqrt2}{7}$",
            ["$\\frac{3 - \\sqrt2}{11}$", "$3 - \\sqrt2$"],
            "Bottom: 9 − 2.",
            { asks: "bracket", changed: "New numbers." },
          ),
          pick(
            "$\\frac{7}{3 + \\sqrt2}$",
            "$3 - \\sqrt2$",
            ["$\\frac{3 - \\sqrt2}{7}$", "$21 - \\sqrt2$"],
            "The 7s cancel.",
            { asks: "bracket", changed: "A 7 on top." },
          ),
        ],
        "Change the sign in the bracket; the surds cancel below.",
      ),
      own(SU, RAT, "Spot the mistake"),

      own(SU, RAT, "Exit check"),

      reworded(
        SU,
        RAT,
        "“Rationalise $\\frac{1}{3 + \\sqrt2}$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply top and bottom by the same surd to clear it from the bottom.**"],
        CLEAR,
        [
          "**Multiply top and bottom by the same surd to clear it from the bottom.**",
          "For $b + \\sqrt a$, use $b - \\sqrt a$.",
          "$(2 + \\sqrt3)(2 - \\sqrt3) = 1$.",
        ],
        DONE,
      ),
    ],
    NUMBER,
  ),
});

export const ghSurdsStepped: [string, UnitLesson[]][] = [
  [COUNT, [productRule]],
  [EST, [estimate]],
  [FRAC, [fractional]],
  [SIMPLE, [simplify]],
  [EXACT, [exact]],
  [RAT, [rationalise]],
];
