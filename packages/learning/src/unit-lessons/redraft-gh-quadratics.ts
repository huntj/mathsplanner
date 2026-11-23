// GCSE Higher, "Functions, lines and quadratics", on the stepped template
// (docs/proposals/lesson-stepped.md): inverse and composite functions, perpendicular lines,
// completing the square, the quadratic formula, quadratics that need rearranging, and turning
// points from the completed square. The algebra is the picture; graphs where they help.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { ghQuadratics, perpendicular, turning } from "./gh-quadratics.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const QU = ghQuadratics;
const ALGEBRA = "Algebra: the equation is the picture.";
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
// Inverse and composite functions.

const FUNC = "gh-quadratics/functions";
const funcMethod = [
  "$fg(x)$: put $x$ into $g$, then the answer into $f$.",
  "$f^{-1}$: write $y = f(x)$ and make $x$ the subject.",
  "Swap $y$ for $x$ in the answer.",
];
const INSIDE = steps(
  "f(x) = 2x + 1,\\ g(x) = x^2",
  "fg(3) = f(9) = 19",
  "f^{-1}(x) = \\frac{x - 1}{2}",
);
const comp = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "The function nearest $x$ goes first.", {
    asks: "composite",
    ...extra,
  });
const inv = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Undo each step in reverse order.", { asks: "inverse", ...extra });

const functions = stepped(find(QU, FUNC), {
  method: funcMethod,
  variation: {
    relationship: "functions combined or undone",
    unknowns: ["composite", "inverse"],
    surface: ["the other order", "a square", "a fraction"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Inside first",
        ["**fg(x) means g first, then f. The inverse undoes f.**"],
        INSIDE,
        "The order matters: $fg$ and $gf$ usually differ.",
      ),
      reworded(QU, FUNC, "$fg(3)$: first work out", { tag: "The rule" }),

      ...owned(QU, FUNC, "Warm-up", "Check you remember"),

      methodCard("The method", funcMethod, INSIDE),
      workedFrom(QU, FUNC),
      calc(
        "Your turn",
        "$f(x) = x - 2$, $g(x) = 3x$. Find $gf(5)$.",
        undefined,
        [
          ["$f(5) =$", "3", "f first: 5 − 2."],
          ["$g(3) =$", "9", "3 × 3."],
        ],
        "$gf(5) = 9$.",
      ),

      calc(
        "Practise",
        "$f(x) = 4x - 3$. Find $f^{-1}(x)$.",
        undefined,
        [
          ["$y = 4x - 3$, so $y + 3 = ?x$, ? =", "4", "Add 3."],
          ["$f^{-1}(9) =$", "3", "$(9 + 3) \\div 4$."],
        ],
        "$f^{-1}(x) = \\frac{x + 3}{4}$.",
      ),
      ...owned(QU, FUNC, "Together", "Practise"),
      ...owned(QU, FUNC, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "$f(x) = x + 1$, $g(x) = 3x$. Watch what changes.",
        [
          comp("$fg(2)$", "7", ["9", "6"]),
          comp("$gf(2)$", "9", ["7", "6"], { changed: "The other order." }),
          comp("$ff(2)$", "4", ["3", "9"], { changed: "f twice." }),
          comp("$fg(x)$", "$3x + 1$", ["$3x + 3$", "$3x^2$"], { changed: "As an expression." }),
        ],
        "Work from the inside out.",
      ),

      questionSet(
        "Variation",
        "Find $f^{-1}(x)$. Watch what changes.",
        [
          inv("$f(x) = x + 5$", "$x - 5$", ["$\\frac{1}{x + 5}$", "$x + 5$"], {
            expect: [
              "Ivy says $f^{-1}(x) = \\frac{1}{f(x)}$. Right?",
              "No",
              "The inverse undoes $f$: it isn't one over $f$.",
              [["Yes", "Does $\\frac{1}{x + 5}$ undo adding 5?"]],
            ],
          }),
          inv("$f(x) = 2x + 5$", "$\\frac{x - 5}{2}$", ["$\\frac{x}{2} - 5$", "$2x - 5$"], {
            changed: "Times 2 too.",
          }),
          inv("$f(x) = \\frac{x}{2} + 5$", "$2(x - 5)$", ["$2x - 5$", "$\\frac{x - 5}{2}$"], {
            changed: "Halve instead.",
          }),
          inv("$f(x) = \\frac{x + 5}{2}$", "$2x - 5$", ["$2(x - 5)$", "$\\frac{x - 5}{2}$"], {
            changed: "Add first.",
          }),
        ],
        "Undo the last step first.",
      ),
      own(QU, FUNC, "Spot the mistake"),

      own(QU, FUNC, "Exit check"),

      reworded(
        QU,
        FUNC,
        "“Find $f^{-1}(x)$” for $f(x) = 2x + 1$.",
        { tag: "Real life", title: "A taxi costs $f(x) = 2x + 1$ pounds. Find $f^{-1}(x)$." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**fg(x) means g first, then f. The inverse undoes f.**"],
        INSIDE,
        [
          "**fg(x) means g first, then f. The inverse undoes f.**",
          "Inverse: make $x$ the subject.",
          "$f^{-1}(x)$ is not $\\frac{1}{f(x)}$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Perpendicular lines.

const PERP = "gh-quadratics/perpendicular";
const perpMethod = [
  "Rearrange to $y = mx + c$ to read $m$.",
  "Perpendicular: flip $m$ and change its sign.",
  "Put the point in to find $c$.",
];
const flip = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Flip and change the sign.", { asks: "gradient", ...extra });

const perpendicularLesson = stepped(find(QU, PERP), {
  method: perpMethod,
  variation: {
    relationship: "gradients that multiply to −1",
    unknowns: ["gradient", "line"],
    surface: ["a fraction", "rearrange first", "a negative"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Negative reciprocal",
        ["**Perpendicular gradients multiply to −1: flip and change the sign.**"],
        perpendicular,
        "Gradients 2 and $-\\frac12$: $2 \\times -\\frac12 = -1$.",
      ),
      reworded(QU, PERP, "Perpendicular to gradient 3", { tag: "The rule" }),

      ...owned(QU, PERP, "Warm-up", "Check you remember"),

      methodCard("The method", perpMethod, perpendicular),
      workedFrom(QU, PERP),
      calc(
        "Your turn",
        "Through (4, 1), perpendicular to $y = 4x - 3$.",
        undefined,
        [
          ["Gradient, as a decimal:", "-0.25", "Flip 4 and change the sign."],
          ["$1 = -0.25 \\times 4 + c$, so $c =$", "2", "1 + 1."],
        ],
        "$y = -\\frac14 x + 2$.",
      ),

      calc(
        "Practise",
        "Through (3, 7), perpendicular to $y = -\\frac13 x$.",
        undefined,
        [
          ["Gradient:", "3", "Flip $-\\frac13$, change the sign."],
          ["$7 = 3 \\times 3 + c$, so $c =$", "-2", "7 − 9."],
        ],
        "$y = 3x - 2$.",
      ),
      ...owned(QU, PERP, "Together", "Practise"),
      reworded(QU, PERP, "Perpendicular to $y = -5x + 2$, gradient", { tag: "Practise" }),
      reworded(
        QU,
        PERP,
        "The line with gradient $\\frac15$ through (5, 3) crosses the $y$-axis at",
        {
          tag: "Practise",
          title: "Gradient $\\frac15$, through (5, 3). Where does it cross the $y$-axis?",
        },
      ),
      questionSet(
        "Practise",
        "Perpendicular gradient. Watch what changes.",
        [
          flip("Gradient 5", "$-\\frac15$", ["−5", "$\\frac15$"]),
          flip("Gradient $\\frac25$", "$-\\frac52$", ["$-\\frac25$", "$\\frac52$"], {
            changed: "A fraction.",
          }),
          flip("Gradient −4", "$\\frac14$", ["4", "$-\\frac14$"], { changed: "Negative." }),
          flip("Line $2y = 6x + 1$", "$-\\frac13$", ["$-\\frac16$", "−3"], {
            changed: "Rearrange first.",
          }),
        ],
        "Always find $m$ in $y = mx + c$ first.",
      ),

      questionSet(
        "Variation",
        "Perpendicular to $y = 2x + 1$. Watch what changes.",
        [
          pick(
            "Through (2, 5)",
            "$y = -\\frac12 x + 6$",
            ["$y = -2x + 9$", "$y = 2x + 1$"],
            "Gradient $-\\frac12$.",
            {
              asks: "line",
              expect: [
                "For $2y = 6x + 1$, Leo reads the gradient as 6. Right?",
                "No",
                "Divide by 2 first: $y = 3x + \\frac12$, gradient 3.",
                [["Yes", "Is it $y = \\ldots$ yet?"]],
              ],
            },
          ),
          pick(
            "Through (0, 3)",
            "$y = -\\frac12 x + 3$",
            ["$y = 2x + 3$", "$y = -2x + 3$"],
            "$c$ is 3.",
            {
              asks: "line",
              changed: "On the $y$-axis.",
            },
          ),
          pick(
            "Through (4, 0)",
            "$y = -\\frac12 x + 2$",
            ["$y = -\\frac12 x + 4$", "$y = -2x + 8$"],
            "$0 = -2 + c$.",
            {
              asks: "line",
              changed: "On the $x$-axis.",
            },
          ),
          pick(
            "Through (−2, 1)",
            "$y = -\\frac12 x$",
            ["$y = -\\frac12 x + 2$", "$y = 2x + 5$"],
            "$1 = 1 + c$.",
            {
              asks: "line",
              changed: "A negative $x$.",
            },
          ),
        ],
        "Same gradient each time; the point sets $c$.",
      ),
      own(QU, PERP, "Spot the mistake"),

      own(QU, PERP, "Exit check"),

      reworded(
        QU,
        PERP,
        "“Find the equation of the line through (2, 5) perpendicular to $y = 2x + 1$.”",
        {
          tag: "Real life",
          title: "A path meets $y = 2x + 1$ at right angles through (2, 5). Its equation?",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Perpendicular gradients multiply to −1: flip and change the sign.**"],
        perpendicular,
        [
          "**Perpendicular gradients multiply to −1: flip and change the sign.**",
          "Parallel: the same gradient.",
          "Rearrange to $y = mx + c$ first.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Solving by completing the square.

const CSQ = "gh-quadratics/complete-square-solve";
const csqMethod = [
  "Halve $b$: $(x + \\frac b2)^2$.",
  "Subtract $(\\frac b2)^2$, add $c$.",
  "Isolate the bracket; square root with ±.",
];
const PERFECT = steps(
  "x^2 + 6x + 4 = 0",
  "(x + 3)^2 - 9 + 4 = 0",
  "(x + 3)^2 = 5,\\ x = -3 \\pm \\sqrt5",
);
const complete = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Halve $b$; take its square off.", { asks: "complete", ...extra });

const completeSquare = stepped(find(QU, CSQ), {
  method: csqMethod,
  variation: {
    relationship: "a perfect square and what's left",
    unknowns: ["complete", "solve"],
    surface: ["a minus", "a bigger number", "no constant"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Make a perfect square",
        ["**Halve b to make a perfect square, then square root.**"],
        PERFECT,
        "Square roots give two answers: ±.",
      ),
      reworded(QU, CSQ, "$x^2 + 10x$ =", { tag: "The rule" }),

      ...owned(QU, CSQ, "Warm-up", "Check you remember"),

      methodCard("The method", csqMethod, PERFECT),
      workedFrom(QU, CSQ),
      calc(
        "Your turn",
        "Solve $x^2 + 4x - 3 = 0$.",
        undefined,
        [
          ["$(x + 2)^2 = ?$, ? =", "7", "4 + 3."],
          ["$x = -2 \\pm \\sqrt{?}$, ? =", "7", "Square root both sides."],
        ],
        "$x = -2 \\pm \\sqrt7$.",
      ),

      calc(
        "Practise",
        "Solve $x^2 - 10x + 18 = 0$.",
        undefined,
        [
          ["$(x - 5)^2 = ?$, ? =", "7", "25 − 18."],
          ["$x = ? \\pm \\sqrt7$, ? =", "5", "Add 5."],
        ],
        "$x = 5 \\pm \\sqrt7$.",
      ),
      ...owned(QU, CSQ, "Together", "Practise"),
      ...owned(QU, CSQ, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Complete the square. Watch what changes.",
        [
          complete("$x^2 + 6x$", "$(x + 3)^2 - 9$", ["$(x + 6)^2 - 36$", "$(x + 3)^2 + 9$"]),
          complete("$x^2 - 6x$", "$(x - 3)^2 - 9$", ["$(x - 3)^2 + 9$", "$(x + 3)^2 - 9$"], {
            changed: "A minus.",
          }),
          complete("$x^2 + 6x + 10$", "$(x + 3)^2 + 1$", ["$(x + 3)^2 + 19$", "$(x + 3)^2 - 1$"], {
            changed: "A constant.",
          }),
          complete(
            "$x^2 + 12x + 30$",
            "$(x + 6)^2 - 6$",
            ["$(x + 12)^2 - 114$", "$(x + 6)^2 + 6$"],
            {
              changed: "Bigger.",
            },
          ),
        ],
        "Halve $b$; subtract its square.",
      ),

      questionSet(
        "Variation",
        "Solve. Watch what changes.",
        [
          pick(
            "$(x + 3)^2 = 5$",
            "$x = -3 \\pm \\sqrt5$",
            ["$x = -3 + \\sqrt5$ only", "$x = 3 \\pm \\sqrt5$"],
            "Root, then −3.",
            {
              asks: "solve",
              expect: [
                "Raj writes $x^2 + 6x + 4$ as $(x + 6)^2 - 32$. Right?",
                "No",
                "Halve 6: $(x + 3)^2 - 9 + 4 = (x + 3)^2 - 5$.",
                [["Yes", "What is half of 6?"]],
              ],
            },
          ),
          pick(
            "$(x - 3)^2 = 5$",
            "$x = 3 \\pm \\sqrt5$",
            ["$x = -3 \\pm \\sqrt5$", "$x = 8$"],
            "Root, then +3.",
            {
              asks: "solve",
              changed: "A minus.",
            },
          ),
          pick(
            "$(x - 3)^2 = 16$",
            "$x = 7$ or $x = -1$",
            ["$x = 7$ only", "$x = 3 \\pm 16$"],
            "√16 = 4.",
            {
              asks: "solve",
              changed: "A square number.",
            },
          ),
          pick(
            "$(x - 3)^2 = -4$",
            "No solutions",
            ["$x = 1$ or $x = 5$", "$x = 3 \\pm 2$"],
            "A square can't be negative.",
            {
              asks: "solve",
              changed: "Negative.",
            },
          ),
        ],
        "± for both roots; none if negative.",
      ),
      own(QU, CSQ, "Spot the mistake"),

      own(QU, CSQ, "Exit check"),

      reworded(
        QU,
        CSQ,
        "“Solve $x^2 + 6x + 4 = 0$ as $a \\pm \\sqrt b$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Halve b to make a perfect square, then square root.**"],
        PERFECT,
        [
          "**Halve b to make a perfect square, then square root.**",
          "Halve $b$, not double it.",
          "Square roots: ±.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// The quadratic formula.

const FORM = "gh-quadratics/formula";
const formMethod = [
  "Write down $a$, $b$ and $c$, with signs.",
  "Work out $b^2 - 4ac$ first.",
  "$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.",
];
const FORMULA = maths("x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}");
const disc = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "$b^2 - 4ac$, minding signs.", { asks: "discriminant", ...extra });

const formula = stepped(find(QU, FORM), {
  method: formMethod,
  variation: {
    relationship: "the discriminant decides the roots",
    unknowns: ["discriminant", "roots"],
    surface: ["a negative b", "a negative c", "a zero"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The formula",
        ["**Any quadratic = 0 can be solved with the quadratic formula.**"],
        FORMULA,
        "Learn it: not every exam gives it.",
      ),
      reworded(QU, FORM, "In $2x^2 - 3x - 4 = 0$, $c =$", { tag: "The rule" }),

      ...owned(QU, FORM, "Warm-up", "Check you remember"),

      methodCard("The method", formMethod, FORMULA),
      workedFrom(QU, FORM),
      calc(
        "Your turn",
        "Solve $x^2 + 3x - 1 = 0$, to 2 d.p.",
        undefined,
        [
          ["$b^2 - 4ac =$", "13", "9 + 4."],
          ["Larger root:", "0.30", "$(-3 + \\sqrt{13}) \\div 2$."],
          ["Smaller root:", "-3.30", "$(-3 - \\sqrt{13}) \\div 2$."],
        ],
        "$x = 0.30$ or $x = -3.30$.",
      ),

      calc(
        "Practise",
        "Solve $2x^2 - 5x + 1 = 0$, to 2 d.p.",
        undefined,
        [
          ["$b^2 - 4ac =$", "17", "25 − 8."],
          ["Larger root:", "2.28", "$(5 + \\sqrt{17}) \\div 4$."],
          ["Smaller root:", "0.22", "$(5 - \\sqrt{17}) \\div 4$."],
        ],
        "$x = 2.28$ or $x = 0.22$.",
      ),
      ...owned(QU, FORM, "Together", "Practise"),
      ...owned(QU, FORM, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find $b^2 - 4ac$. Watch what changes.",
        [
          disc("$x^2 + 5x + 2$", "17", ["33", "21"]),
          disc("$x^2 - 5x + 2$", "17", ["−33", "33"], { changed: "Minus $5x$." }),
          disc("$x^2 + 5x - 2$", "33", ["17", "21"], { changed: "Minus 2." }),
          disc("$2x^2 + 5x + 2$", "9", ["17", "41"], { changed: "$a = 2$." }),
        ],
        "$(-5)^2$ is +25.",
      ),

      questionSet(
        "Variation",
        "How many roots? Watch what changes.",
        [
          pick("$b^2 - 4ac = 41$", "Two", ["One", "None"], "Positive: two roots.", {
            asks: "roots",
            expect: [
              "For $b = -3$, Ivy gets $b^2 = -9$ on her calculator. Right?",
              "No",
              "Square the whole $b$: $(-3)^2 = 9$.",
              [["Yes", "Did she put brackets round −3?"]],
            ],
          }),
          pick("$b^2 - 4ac = 0$", "One", ["Two", "None"], "Zero: one repeated root.", {
            asks: "roots",
            changed: "Zero.",
          }),
          pick("$b^2 - 4ac = -7$", "None", ["Two", "One"], "Negative: no real roots.", {
            asks: "roots",
            changed: "Negative.",
          }),
          pick("$x^2 + 2x + 5 = 0$", "None", ["Two", "One"], "$4 - 20 = -16$.", {
            asks: "roots",
            changed: "Work it out.",
          }),
        ],
        "Check $b^2 - 4ac$ before the square root.",
      ),
      own(QU, FORM, "Spot the mistake"),

      own(QU, FORM, "Exit check"),

      reworded(
        QU,
        FORM,
        "“Solve $2x^2 - 3x - 4 = 0$ to 2 d.p.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Any quadratic = 0 can be solved with the quadratic formula.**"],
        FORMULA,
        [
          "**Any quadratic = 0 can be solved with the quadratic formula.**",
          "$b^2 - 4ac$: positive two roots, zero one, negative none.",
          "$(-3)^2 = 9$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Quadratics that need rearranging.

const REARR = "gh-quadratics/rearrange-first";
const rearrMethod = [
  "Clear fractions: × the common denominator.",
  "Expand brackets.",
  "Collect to one side = 0, then solve.",
];
const CLEAR = steps("\\frac{6}{x} = x - 1", "6 = x^2 - x", "x^2 - x - 6 = 0");
const form = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Clear, expand, collect to 0.", { asks: "form", ...extra });

const rearrange = stepped(find(QU, REARR), {
  method: rearrMethod,
  variation: {
    relationship: "equations brought to = 0",
    unknowns: ["form", "solve"],
    surface: ["a fraction", "brackets", "two fractions"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Get to = 0",
        ["**Clear fractions and brackets, collect to one side = 0, then solve.**"],
        CLEAR,
        "Multiply every term, not just one.",
      ),
      reworded(QU, REARR, "To clear $\\frac{3}{x} + \\frac{2}{x + 1}$, multiply by", {
        tag: "The rule",
      }),

      ...owned(QU, REARR, "Warm-up", "Check you remember"),

      methodCard("The method", rearrMethod, CLEAR),
      workedFrom(QU, REARR),
      calc(
        "Your turn",
        "Solve $x(x + 2) = 15$.",
        undefined,
        [
          ["$x^2 + 2x - 15 = 0$: $(x + 5)(x - ?)$, ? =", "3", "Multiply to −15, add to 2."],
          ["Positive solution: $x =$", "3", "$x - 3 = 0$."],
        ],
        "$x = 3$ or $x = -5$.",
      ),

      calc(
        "Practise",
        "Solve $\\frac{8}{x} = x + 2$.",
        undefined,
        [
          ["$x^2 + 2x - 8 = 0$: $(x + 4)(x - ?)$, ? =", "2", "Multiply to −8, add to 2."],
          ["Negative solution: $x =$", "-4", "$x + 4 = 0$."],
        ],
        "$x = 2$ or $x = -4$.",
      ),
      ...owned(QU, REARR, "Together", "Practise"),
      ...owned(QU, REARR, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "As $ax^2 + bx + c = 0$. Watch what changes.",
        [
          form("$x^2 = 3x + 4$", "$x^2 - 3x - 4 = 0$", [
            "$x^2 + 3x + 4 = 0$",
            "$x^2 - 3x + 4 = 0$",
          ]),
          form("$x(x - 2) = 8$", "$x^2 - 2x - 8 = 0$", ["$x^2 - 2x = 0$", "$x - 2 = 8$"], {
            changed: "Brackets.",
          }),
          form("$\\frac{4}{x} + 1 = x$", "$x^2 - x - 4 = 0$", ["$x^2 - 5 = 0$", "$4 + 1 = x^2$"], {
            changed: "A fraction.",
          }),
          form(
            "$\\frac{1}{x} + \\frac{1}{x + 1} = 1$",
            "$x^2 - x - 1 = 0$",
            ["$2x + 1 = 1$", "$x^2 + x - 1 = 0$"],
            {
              changed: "Two fractions.",
            },
          ),
        ],
        "Every term gets multiplied.",
      ),

      questionSet(
        "Variation",
        "Solve. Watch what changes.",
        [
          pick(
            "$x(x + 3) = 10$",
            "$x = 2$ or $x = -5$",
            ["$x = 10$ or $x = 7$", "$x = 2$ only"],
            "$x^2 + 3x - 10 = 0$.",
            {
              asks: "solve",
              expect: [
                "Ben solves $x(x + 3) = 10$ with $x = 10$ or $x + 3 = 10$. Right?",
                "No",
                "That only works when it equals 0. Rearrange first.",
                [["Yes", "Does $10 \\times 13 = 10$?"]],
              ],
            },
          ),
          pick(
            "$x(x + 3) = 0$",
            "$x = 0$ or $x = -3$",
            ["$x = -3$ only", "$x = 3$"],
            "Already = 0.",
            {
              asks: "solve",
              changed: "Equals 0.",
            },
          ),
          pick(
            "$x(x + 3) = 4$",
            "$x = 1$ or $x = -4$",
            ["$x = 4$ or $x = 1$", "$x = -1$ or $x = 4$"],
            "$x^2 + 3x - 4 = 0$.",
            {
              asks: "solve",
              changed: "Equals 4.",
            },
          ),
          pick(
            "$x(x + 3) = 18$",
            "$x = 3$ or $x = -6$",
            ["$x = 18$ or $x = 15$", "$x = 6$ or $x = -3$"],
            "$x^2 + 3x - 18 = 0$.",
            {
              asks: "solve",
              changed: "Equals 18.",
            },
          ),
        ],
        "Rearrange to 0 before factorising.",
      ),
      own(QU, REARR, "Spot the mistake"),

      own(QU, REARR, "Exit check"),

      reworded(
        QU,
        REARR,
        "“Solve $\\frac{3}{x} + \\frac{2}{x + 1} = 1$.” The quadratic is",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Clear fractions and brackets, collect to one side = 0, then solve.**"],
        CLEAR,
        [
          "**Clear fractions and brackets, collect to one side = 0, then solve.**",
          "Multiply every term.",
          "A product = 10 tells you nothing: get = 0.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Turning points from the completed square.

const TURN = "gh-quadratics/turning-points";
const turnMethod = [
  "Complete the square: $(x + p)^2 + q$.",
  "The bracket is 0 when $x = -p$.",
  "Turning point $(-p, q)$; minimum value $q$.",
];
const point = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Make the bracket 0.", { asks: "point", ...extra });

const turningPoints = stepped(find(QU, TURN), {
  method: turnMethod,
  variation: {
    relationship: "the turning point from the bracket",
    unknowns: ["point", "minimum"],
    surface: ["a minus", "complete first", "a bigger number"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Smallest when the bracket is 0",
        ["**From (x + p)² + q, the turning point is (−p, q).**"],
        turning,
        "$(x - 2)^2 - 3$ turns at (2, −3).",
      ),
      reworded(QU, TURN, "Turning point of $y = (x + 3)^2 - 5$", { tag: "The rule" }),

      ...owned(QU, TURN, "Warm-up", "Check you remember"),

      methodCard("The method", turnMethod, turning),
      workedFrom(QU, TURN),
      calc(
        "Your turn",
        "Turning point of $y = x^2 + 8x + 20$.",
        undefined,
        [
          ["$(x + 4)^2 + ?$, ? =", "4", "20 − 16."],
          ["Turning point: $(?, 4)$, ? =", "-4", "The bracket is 0."],
        ],
        "(−4, 4).",
      ),

      calc(
        "Practise",
        "Minimum value of $x^2 - 6x + 2$.",
        undefined,
        [
          ["$(x - 3)^2 + ?$, ? =", "-7", "2 − 9."],
          ["Minimum value:", "-7", "When $x = 3$."],
        ],
        "−7, at $x = 3$.",
      ),
      ...owned(QU, TURN, "Together", "Practise"),
      ...owned(QU, TURN, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The turning point. Watch what changes.",
        [
          point("$y = (x - 2)^2 + 5$", "(2, 5)", ["(−2, 5)", "(5, 2)"]),
          point("$y = (x + 2)^2 + 5$", "(−2, 5)", ["(2, 5)", "(5, −2)"], { changed: "A plus." }),
          point("$y = (x + 2)^2 - 5$", "(−2, −5)", ["(2, −5)", "(−2, 5)"], { changed: "Minus 5." }),
          point("$y = x^2 + 4x + 9$", "(−2, 5)", ["(2, 5)", "(−4, 9)"], {
            changed: "Complete first.",
          }),
        ],
        "The sign in the bracket flips.",
      ),

      questionSet(
        "Variation",
        "The minimum value. Watch what changes.",
        [
          pick("$y = x^2 - 10x + 30$", "5", ["30", "−5"], "$(x - 5)^2 + 5$.", {
            asks: "minimum",
            expect: [
              "From $(x - 5)^2 + 5$, Leo gives the turning point (−5, 5). Right?",
              "No",
              "The bracket is 0 when $x = 5$: (5, 5).",
              [["Yes", "What makes $x - 5$ zero?"]],
            ],
          }),
          pick("$y = x^2 - 10x + 20$", "−5", ["20", "5"], "$(x - 5)^2 - 5$.", {
            asks: "minimum",
            changed: "Smaller constant.",
          }),
          pick("$y = x^2 + 2x + 6$", "5", ["6", "−1"], "$(x + 1)^2 + 5$.", {
            asks: "minimum",
            changed: "A plus.",
          }),
          pick("$y = (x - 6)^2 + 9$", "9", ["6", "−6"], "Already completed.", {
            asks: "minimum",
            changed: "Already done.",
          }),
        ],
        "The minimum is the number after the bracket.",
      ),
      own(QU, TURN, "Spot the mistake"),

      own(QU, TURN, "Exit check"),

      reworded(
        QU,
        TURN,
        "“Write down the turning point of $y = x^2 - 4x + 1$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**From (x + p)² + q, the turning point is (−p, q).**"],
        turning,
        [
          "**From (x + p)² + q, the turning point is (−p, q).**",
          "The sign in the bracket flips.",
          "Minimum value: $q$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

export const ghQuadraticsStepped: [string, UnitLesson[]][] = [
  [FUNC, [functions]],
  [PERP, [perpendicularLesson]],
  [CSQ, [completeSquare]],
  [FORM, [formula]],
  [REARR, [rearrange]],
  [TURN, [turningPoints]],
];
