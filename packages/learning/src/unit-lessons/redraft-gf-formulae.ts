// GCSE Foundation, "Formulae", on the stepped template (docs/proposals/lesson-stepped.md):
// substituting into expressions and formulae, the standard formulae, and changing the subject.
// Algebra is its own picture; areas are asked on their drawings.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { DrawingPic, Picture, Point, UnitLesson } from "./types.ts";
import { gfFormulae } from "./gf-formulae.ts";

const F = gfFormulae;
const ALGEBRA = "Algebra: the formula is the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });
const p = (x: number, y: number): Point => ({ x, y });

/** A trapezium: parallel sides a (top) and b (bottom), and its height dashed and labelled. */
export const trap = (a: string, b: string, h: string): DrawingPic => {
  const mid = p(4, 2);
  return {
    kind: "drawing",
    items: [
      { line: [p(0, 0), p(8, 0)] },
      { line: [p(8, 0), p(6, 4)] },
      { line: [p(6, 4), p(2, 4)] },
      { line: [p(2, 4), p(0, 0)] },
      { line: [p(3, 4), p(3, 0)], dashed: true, tone: "soft" },
      { side: [p(2, 4), p(6, 4)], label: a, inside: mid },
      { side: [p(0, 0), p(8, 0)], label: b, inside: mid },
      { text: h, at: p(3.9, 2) },
    ],
  };
};

/** A triangle with its base and its height dashed and labelled. */
export const tri = (b: string, h: string): DrawingPic => ({
  kind: "drawing",
  items: [
    { line: [p(0, 0), p(8, 0)] },
    { line: [p(8, 0), p(3, 5)] },
    { line: [p(3, 5), p(0, 0)] },
    { line: [p(3, 5), p(3, 0)], dashed: true, tone: "soft" },
    { side: [p(0, 0), p(8, 0)], label: b, inside: p(4, 2) },
    { text: h, at: p(3.9, 2) },
  ],
});

// ---------------------------------------------------------------------------------------------
// Substituting into expressions.

const EXPR = "gf-formulae/expressions";
const exprMethod = [
  "Write each letter's value in brackets.",
  "Powers first, then × and ÷, then + and −.",
  "Watch the signs: taking away a negative adds.",
];
const SWAP = maths("x^2 - 3y \\;\\to\\; (-2)^2 - 3(5)");

const expressions = stepped(find(F, EXPR), {
  method: exprMethod,
  variation: {
    relationship: "an expression and its value for given letters",
    unknowns: ["value"],
    surface: ["negative values", "powers", "taking away"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Substituting",
        ["**Put each value in brackets, then follow the order of operations.**"],
        SWAP,
        "Here $x = -2$ and $y = 5$. Brackets stop sign slips.",
      ),
      reworded(F, EXPR, "If $x = -3$, $x^2 =$", { tag: "The rule" }),

      ...owned(F, EXPR, "Warm-up", "Check you remember"),

      methodCard("The method", exprMethod, SWAP),
      workedFrom(F, EXPR),
      calc(
        "Your turn",
        "$a = 4$ and $b = -3$.",
        undefined,
        [
          ["$2a =$", "8", "2 × 4."],
          ["$5b =$", "-15", "5 × (−3)."],
          ["$2a + 5b =$", "-7", "8 + (−15)."],
        ],
        "−7.",
      ),

      calc(
        "Practise",
        "$x = -3$.",
        undefined,
        [
          ["$x^2 =$", "9", "(−3) × (−3)."],
          ["$2x^2 =$", "18", "Square first, then double."],
          ["$(2x)^2 =$", "36", "Double first, then square."],
        ],
        "The bracket changes the answer.",
      ),
      ...owned(F, EXPR, "Together", "Practise"),
      ...owned(F, EXPR, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "$y = -4$. Work it out. Watch what changes.",
        [
          ask("$y + 10$", "6", "−4 + 10.", "6.", { asks: "value" }),
          ask("$10 - y$", "14", "10 − (−4).", "14.", { asks: "value", changed: "Take y away." }),
          ask("$y^2$", "16", "(−4) × (−4).", "16.", { asks: "value", changed: "Square it." }),
          ask("$3y^2$", "48", "Square, then × 3.", "48.", {
            asks: "value",
            changed: "Times by 3.",
          }),
        ],
        "Brackets keep the signs right.",
      ),

      questionSet(
        "Variation",
        "$p = 5$ and $q = -2$. Watch what changes.",
        [
          ask("$p - q^2$", "1", "Square q first.", "1.", {
            asks: "value",
            expect: [
              "Zac gets 9 for $p - q^2$. Right?",
              "No",
              "$q^2 = 4$, so $5 - 4 = 1$.",
              [["Yes", "Square q before taking away."]],
            ],
          }),
          ask("$p - q$", "7", "5 − (−2).", "7.", { asks: "value", changed: "No square." }),
          ask("$p^2 - q$", "27", "25 − (−2).", "27.", {
            asks: "value",
            changed: "Square p instead.",
          }),
          ask("$pq^2$", "20", "5 × 4.", "20.", { asks: "value", changed: "Times, not minus." }),
        ],
        "Powers first; signs stay with their numbers.",
      ),
      own(F, EXPR, "Spot the mistake"),

      own(F, EXPR, "Exit check"),

      reworded(
        F,
        EXPR,
        "“$a = 3$, $b = -2$. Work out $a^2 - 4b$.”",
        { tag: "Real life", title: "$a = 3$, $b = -2$. Work out $a^2 - 4b$." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Put each value in brackets, then follow the order of operations.**"],
        SWAP,
        [
          "**Put each value in brackets, then follow the order of operations.**",
          "$3x^2$ squares only the x.",
          "Taking away a negative adds.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Using formulae.

const FORM = "gf-formulae/formulae";
const formMethod = [
  "Write the formula.",
  "Swap in the values, in brackets.",
  "Work it out in order. Give the units.",
];
const VUAT = maths("v = u + at");

const formulae = stepped(find(F, FORM), {
  method: formMethod,
  variation: {
    relationship: "a formula and the value of its subject",
    unknowns: ["subject"],
    surface: ["negative inputs", "decimals", "different formulae"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Using formulae",
        ["**Swap in the inputs, follow the order of operations, give units.**"],
        VUAT,
        "The subject, $v$, is what the formula works out.",
      ),
      reworded(F, FORM, "$v = u + at$, $u = 5$, $a = 2$, $t = 3$. $v =$", { tag: "The rule" }),

      ...owned(F, FORM, "Warm-up", "Check you remember"),

      methodCard("The method", formMethod, VUAT),
      workedFrom(F, FORM),
      calc(
        "Your turn",
        "$v = u + at$: $u = 4$, $a = 3$, $t = 5$.",
        undefined,
        [
          ["$at =$", "15", "a × t."],
          ["$v =$", "19", "u + at."],
        ],
        "$v = 19$.",
      ),

      calc(
        "Practise",
        "$s = \\frac12 at^2$: $a = 10$, $t = 4$.",
        undefined,
        [
          ["$t^2 =$", "16", "4 × 4."],
          ["$s =$", "80", "½ × 10 × 16."],
        ],
        "$s = 80$.",
      ),
      ...owned(F, FORM, "Together", "Practise"),
      ...owned(F, FORM, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "$P = 2(l + w)$. Find P. Watch what changes.",
        [
          ask("$l = 6$, $w = 2$", "16", "2 × 8.", "16.", { asks: "subject" }),
          ask("$l = 6$, $w = 2.5$", "17", "2 × 8.5.", "17.", {
            asks: "subject",
            changed: "A decimal.",
          }),
          ask("$l = 6$, $w = 6$", "24", "2 × 12.", "24.", {
            asks: "subject",
            changed: "A square.",
          }),
          ask("$l = 0.5$, $w = 0.5$", "2", "2 × 1.", "2.", {
            asks: "subject",
            changed: "Tiny.",
          }),
        ],
        "Brackets first, then double.",
      ),

      questionSet(
        "Variation",
        "$F = \\frac95 C + 32$. Find F. Watch the signs.",
        [
          ask("$C = -15$", "5", "$\\frac95 \\times -15 = -27$.", "5.", {
            asks: "subject",
            expect: [
              "Zoe gets 59 for $C = -15$. Right?",
              "No",
              "$\\frac95 \\times -15 = -27$, and $-27 + 32 = 5$.",
              [["Yes", "Keep the minus sign."]],
            ],
          }),
          ask("$C = -5$", "23", "$-9 + 32$.", "23.", { asks: "subject", changed: "Warmer." }),
          ask("$C = 0$", "32", "$0 + 32$.", "32.", { asks: "subject", changed: "Freezing." }),
          ask("$C = 100$", "212", "$180 + 32$.", "212.", {
            asks: "subject",
            changed: "Boiling.",
          }),
        ],
        "A negative input keeps its sign all the way.",
      ),
      own(F, FORM, "Spot the mistake"),

      own(F, FORM, "Exit check"),

      reworded(
        F,
        FORM,
        "“Use $s = \\frac12 g t^2$, $g = 9.8$, to find how far the stone falls in 3 seconds.”",
        { tag: "Real life", title: "$s = \\frac12 g t^2$, $g = 9.8$. How far in 3 seconds?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Swap in the inputs, follow the order of operations, give units.**"],
        VUAT,
        [
          "**Swap in the inputs, follow the order of operations, give units.**",
          "The subject is the letter on its own.",
          "$\\frac95 \\times -10 = -18$: keep the sign.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Standard formulae.

const STD = "gf-formulae/standard";
const stdMethod = [
  "Name the shape or quantity.",
  "Write its formula.",
  "Substitute, work it out, add the units.",
];
const KNOW: Picture = {
  kind: "table",
  head: ["Find", "Formula"],
  rows: [
    ["Triangle area", "$\\frac12 bh$"],
    ["Trapezium area", "$\\frac12(a + b)h$"],
    ["Circle area", "$\\pi r^2$"],
    ["Prism volume", "cross-section × length"],
    ["Speed", "distance ÷ time"],
    ["Density", "mass ÷ volume"],
  ],
};

const standard = stepped(find(F, STD), {
  method: stdMethod,
  variation: {
    relationship: "a shape or quantity and the formula that finds it",
    unknowns: ["formula", "value"],
    surface: ["different shapes", "radius or diameter", "area or circumference"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Formulae to know",
        ["**Learn these: the exam doesn't always give them.**"],
        KNOW,
        "Always use the perpendicular height.",
      ),
      reworded(F, STD, "Which formula gives a triangle's area?", { tag: "The rule" }),

      ...owned(F, STD, "Warm-up", "Check you remember"),

      methodCard("The method", stdMethod, KNOW),
      workedFrom(F, STD),
      calc(
        "Your turn",
        "Find the area.",
        trap("4 cm", "8 cm", "5 cm"),
        [
          ["Half of $a + b$:", "6", "Add the parallel sides, halve."],
          ["Area:", "30", "Times by the height.", { after: "cm²" }],
        ],
        "30 cm².",
      ),

      calc(
        "Practise",
        "Find the area.",
        tri("12 cm", "7 cm"),
        [
          ["Half the base:", "6", "Halve it."],
          ["Area:", "42", "Times by the height.", { after: "cm²" }],
        ],
        "42 cm².",
      ),
      ...owned(F, STD, "Together", "Practise"),
      ...owned(F, STD, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which formula? Watch what changes.",
        [
          pick(
            "Area of a triangle",
            "$\\frac12 bh$",
            ["$bh$", "$\\frac12(a + b)h$"],
            "Half a rectangle.",
            {
              asks: "formula",
            },
          ),
          pick(
            "Area of a trapezium",
            "$\\frac12(a + b)h$",
            ["$\\frac12 bh$", "$(a + b)h$"],
            "Average the parallel sides.",
            { asks: "formula", changed: "Two parallel sides." },
          ),
          pick("Area of a circle", "$\\pi r^2$", ["$\\pi d$", "$2\\pi r$"], "Radius squared.", {
            asks: "formula",
            changed: "A circle.",
          }),
          pick("Speed", "distance ÷ time", ["distance × time", "time ÷ distance"], "km per hour.", {
            asks: "formula",
            changed: "Not a shape.",
          }),
        ],
        "Name it, then pick its formula.",
      ),

      questionSet(
        "Variation",
        "Give it to 1 d.p. Watch what changes.",
        [
          ask("Circle, radius 6 cm: area?", "113.1", "$\\pi \\times 6^2$.", "113.1 cm².", {
            asks: "value",
            unit: "cm²",
            expect: [
              "Radius 6: Raj works out $\\pi \\times 12$. Right?",
              "No",
              "$r^2 = 36$, not 12: $\\pi \\times 36$.",
              [["Yes", "Square it; don't double it."]],
            ],
          }),
          ask("Circle, radius 6 cm: circumference?", "37.7", "$2 \\pi r$.", "37.7 cm.", {
            asks: "value",
            unit: "cm",
            changed: "Round the edge.",
          }),
          ask("Circle, diameter 6 cm: area?", "28.3", "Radius 3.", "28.3 cm².", {
            asks: "value",
            unit: "cm²",
            changed: "Diameter, not radius.",
          }),
          ask("Semicircle, radius 6 cm: area?", "56.5", "Half of 113.1.", "56.5 cm².", {
            asks: "value",
            unit: "cm²",
            changed: "Half a circle.",
          }),
        ],
        "Radius or diameter? Area or edge?",
      ),
      own(F, STD, "Spot the mistake"),

      own(F, STD, "Exit check"),

      reworded(
        F,
        STD,
        "“Work out the area of a trapezium with parallel sides 6 cm and 10 cm and height 4 cm.”",
        {
          tag: "Real life",
          title: "Find the area of this trapezium.",
          picture: trap("6 cm", "10 cm", "4 cm"),
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Learn these: the exam doesn't always give them.**"],
        KNOW,
        [
          "**Learn these: the exam doesn't always give them.**",
          "Trapezium: $\\frac12(a + b)h$.",
          "$\\pi r^2$ squares the radius.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Changing the subject.

const REARR = "gf-formulae/rearrange";
const rearrMethod = [
  "List what's been done to the new subject, in order.",
  "Undo the last step first, on both sides.",
  "Keep going until it's on its own.",
];
const UNDO = maths("y = 4x + 1 \\;\\Rightarrow\\; x = \\frac{y - 1}{4}");

const rearrange = stepped(find(F, REARR), {
  method: rearrMethod,
  variation: {
    relationship: "a formula and the same formula with a new subject",
    unknowns: ["rearranged"],
    surface: ["the order of steps", "brackets", "a minus x"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Changing the subject",
        ["**Do the same to both sides; undo the last step first.**"],
        UNDO,
        "It's solving an equation, with letters.",
      ),
      reworded(F, REARR, "Make $x$ the subject of $y = x - 7$", { tag: "The rule" }),

      ...owned(F, REARR, "Warm-up", "Check you remember"),

      methodCard("The method", rearrMethod, UNDO),
      workedFrom(F, REARR),
      calc(
        "Your turn",
        "Make $x$ the subject of $y = 3x - 5$.",
        undefined,
        [
          ["First add:", "5", "Undo − 5 first."],
          ["Then divide by:", "3", "Undo × 3."],
        ],
        "$x = \\frac{y + 5}{3}$.",
      ),

      calc(
        "Practise",
        "Make $u$ the subject of $v = u + at$.",
        undefined,
        [
          ["Take away:", "at", "Undo + at."],
          ["Check: $v = 10$, $a = 2$, $t = 3$. $u =$", "4", "10 − 6."],
        ],
        "$u = v - at$.",
      ),
      ...owned(F, REARR, "Together", "Practise"),
      ...owned(F, REARR, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Make x the subject. Watch what changes.",
        [
          pick("$y = x + 6$", "$x = y - 6$", ["$x = y + 6$", "$x = 6y$"], "Undo + 6.", {
            asks: "rearranged",
          }),
          pick("$y = 6x$", "$x = \\frac{y}{6}$", ["$x = y - 6$", "$x = 6y$"], "Undo × 6.", {
            asks: "rearranged",
            changed: "Times, not add.",
          }),
          pick(
            "$y = 6x + 2$",
            "$x = \\frac{y - 2}{6}$",
            ["$x = \\frac{y}{6} - 2$", "$x = \\frac{y + 2}{6}$"],
            "Undo + 2, then × 6.",
            { asks: "rearranged", changed: "Two steps." },
          ),
          pick(
            "$y = \\frac{x}{6} + 2$",
            "$x = 6(y - 2)$",
            ["$x = 6y - 2$", "$x = \\frac{y - 2}{6}$"],
            "Undo + 2, then ÷ 6.",
            { asks: "rearranged", changed: "Divide, not times." },
          ),
        ],
        "Undo in reverse order.",
      ),

      questionSet(
        "Variation",
        "Make x the subject. Watch the order.",
        [
          pick(
            "$y = 2x - 7$",
            "$x = \\frac{y + 7}{2}$",
            ["$x = \\frac{y}{2} + 7$", "$x = \\frac{y - 7}{2}$"],
            "Undo − 7 first.",
            {
              asks: "rearranged",
              expect: [
                "For $y = 2x - 7$, Sam writes $x = \\frac{y}{2} + 7$. Right?",
                "No",
                "Undo − 7 first: $x = \\frac{y + 7}{2}$.",
                [["Yes", "Which step was done last?"]],
              ],
            },
          ),
          pick(
            "$y = 2(x - 7)$",
            "$x = \\frac{y}{2} + 7$",
            ["$x = \\frac{y + 7}{2}$", "$x = 2y + 7$"],
            "Undo × 2 first.",
            { asks: "rearranged", changed: "A bracket: × 2 is last." },
          ),
          pick(
            "$y = 7 - 2x$",
            "$x = \\frac{7 - y}{2}$",
            ["$x = \\frac{y - 7}{2}$", "$x = \\frac{y + 7}{2}$"],
            "Add 2x to both sides.",
            { asks: "rearranged", changed: "x is taken away." },
          ),
          pick(
            "$y = \\frac{2x - 7}{3}$",
            "$x = \\frac{3y + 7}{2}$",
            ["$x = \\frac{3y - 7}{2}$", "$x = \\frac{y + 7}{6}$"],
            "Undo ÷ 3 first.",
            { asks: "rearranged", changed: "Divided by 3 too." },
          ),
        ],
        "The last step done is the first undone.",
      ),
      own(F, REARR, "Spot the mistake"),

      own(F, REARR, "Exit check"),

      reworded(
        F,
        REARR,
        "“Rearrange $v = u + at$ to make $t$ the subject.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Do the same to both sides; undo the last step first.**"],
        UNDO,
        [
          "**Do the same to both sides; undo the last step first.**",
          "$y = 4x + 1$: take 1, then ÷ 4.",
          "$t = \\frac{v - u}{a}$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

export const gfFormulaeStepped: [string, UnitLesson[]][] = [
  [EXPR, [expressions]],
  [FORM, [formulae]],
  [STD, [standard]],
  [REARR, [rearrange]],
];
