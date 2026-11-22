// GCSE Foundation, "Algebraic proof", on the stepped template (docs/proposals/lesson-stepped.md):
// equations and identities, showing two expressions are equal, and algebra in an argument. The
// algebra is the picture: each step of working is written out in full.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfProof } from "./gf-proof.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const PF = gfProof;
const ALGEBRA = "Algebra: the expressions are the picture.";
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
// Equations and identities.

const IDENT = "gf-proof/equation-identity";
const identMethod = [
  "Expand and simplify both sides.",
  "The same? An identity: write ≡.",
  "Different? An equation: true for some values only.",
];
const SOMETIMES = steps(
  "3x + 2 = 11: \\text{ only when } x = 3",
  "2(x + 5) \\equiv 2x + 10: \\text{ every } x",
);
const kind = (prompt: string, right: string, extra: object = {}) =>
  pick(
    prompt,
    right,
    ["Identity", "Equation", "Formula"].filter((k) => k !== right),
    "True for every value, some values, or linking quantities?",
    { asks: "type", ...extra },
  );
const check = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Expand the brackets fully.", { asks: "check", ...extra });

const identity = stepped(find(PF, IDENT), {
  method: identMethod,
  variation: {
    relationship: "true for some values, or for all",
    unknowns: ["type", "check"],
    surface: ["a number on one side", "the middle term", "a minus"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Sometimes or always",
        ["**An equation is true for some values. An identity (≡) is true for all.**"],
        SOMETIMES,
        "A formula links quantities, like $v = u + at$.",
      ),
      reworded(PF, IDENT, "$2(x + 5) \\equiv 2x + 10$ is", { tag: "The rule" }),

      ...owned(PF, IDENT, "Warm-up", "Check you remember"),

      methodCard("The method", identMethod, SOMETIMES),
      workedFrom(PF, IDENT),
      calc(
        "Your turn",
        "Test $4x - 1 = 2x + 7$.",
        undefined,
        [["Solve it: $x =$", "4", "$2x = 8$."]],
        "True only when $x = 4$: an equation.",
      ),

      calc(
        "Practise",
        "Simplify $3(x - 2) + 6$.",
        undefined,
        [["$3x - 6 + 6 =$", "3x", "−6 + 6 = 0."]],
        "$3(x - 2) + 6 \\equiv 3x$: an identity.",
      ),
      ...owned(PF, IDENT, "Together", "Practise"),
      ...owned(PF, IDENT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which is it? Watch what changes.",
        [
          kind("$2(x + 3) = 2x + 6$", "Identity"),
          kind("$2(x + 3) = 10$", "Equation", { changed: "A number on the right." }),
          kind("$x + x = 2x$", "Identity", { changed: "Collect terms." }),
          kind("$A = l \\times w$", "Formula", { changed: "Letters for quantities." }),
        ],
        "Identities are true for every value.",
      ),

      questionSet(
        "Variation",
        "Is it an identity? Watch what changes.",
        [
          check(
            "$(x + 1)^2 \\equiv x^2 + 1$?",
            "No: it's $x^2 + 2x + 1$",
            ["Yes", "Only for $x = 1$"],
            {
              expect: [
                "Ben tries $x = 0$ in $(x + 1)^2 \\equiv x^2 + 1$: 1 = 1. Identity?",
                "No",
                "Try $x = 1$: $4 \\ne 2$. Expanding gives $x^2 + 2x + 1$.",
                [["Yes", "Does one value prove it for all?"]],
              ],
            },
          ),
          check("$(x + 1)^2 \\equiv x^2 + 2x + 1$?", "Yes", ["No", "Only for $x = 0$"], {
            changed: "The middle term.",
          }),
          check(
            "$(x - 1)^2 \\equiv x^2 - 2x + 1$?",
            "Yes",
            ["No: it's $x^2 - 1$", "Only for $x = 1$"],
            {
              changed: "A minus.",
            },
          ),
          check(
            "$(x - 1)^2 \\equiv x^2 - 1$?",
            "No: it's $x^2 - 2x + 1$",
            ["Yes", "Only for $x = 0$"],
            {
              changed: "A term missing.",
            },
          ),
        ],
        "Expand: don't test one value.",
      ),
      own(PF, IDENT, "Spot the mistake"),

      own(PF, IDENT, "Exit check"),

      reworded(
        PF,
        IDENT,
        "“Which is an identity? Give a reason.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**An equation is true for some values. An identity (≡) is true for all.**"],
        SOMETIMES,
        [
          "**An equation is true for some values. An identity (≡) is true for all.**",
          "Test an identity by expanding, not by one value.",
          "$(x + 1)^2 = x^2 + 2x + 1$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Show that two expressions are equal.

const SHOW = "gf-proof/show-equivalent";
const showMethod = [
  "Start with the messier side.",
  "Expand and simplify, one step a line.",
  "Stop when it matches the other side.",
];
const LHS = steps(
  "\\text{LHS} = 3(x + 2) - x",
  "= 3x + 6 - x",
  "= 2x + 6 = 2(x + 3) = \\text{RHS}",
);
const simplify = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Expand, then collect.", { asks: "simplify", ...extra });
const expand = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Write the bracket twice and expand.", { asks: "expand", ...extra });

const showThat = stepped(find(PF, SHOW), {
  method: showMethod,
  variation: {
    relationship: "one side simplified to the other",
    unknowns: ["simplify", "expand"],
    surface: ["a minus inside", "plus or minus", "a number taken off"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "One side at a time",
        ["**Start with one side. Simplify, a line at a time, until it matches the other.**"],
        LHS,
        "Never move terms across the ≡ sign.",
      ),
      reworded(PF, SHOW, "In a ‘show that’, you should", { tag: "The rule" }),

      ...owned(PF, SHOW, "Warm-up", "Check you remember"),

      methodCard("The method", showMethod, LHS),
      workedFrom(PF, SHOW),
      calc(
        "Your turn",
        "Show that $5(x + 1) - 2x \\equiv 3x + 5$.",
        undefined,
        [["$5x + 5 - 2x =$", "3x+5", "Collect the $x$ terms."]],
        "It matches the right-hand side.",
      ),

      calc(
        "Practise",
        "Show that $(x + 2)^2 - 4 \\equiv x(x + 4)$.",
        undefined,
        [
          ["$x^2 + 4x + 4 - 4 = x^2 +$", "4x", "+4 − 4 = 0."],
          ["$x^2 + 4x = x(x +$", "4", "Take out $x$.", { after: "$)$" }],
        ],
        "It matches the right-hand side.",
      ),
      ...owned(PF, SHOW, "Together", "Practise"),
      ...owned(PF, SHOW, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Simplify. Watch what changes.",
        [
          simplify("$2(x + 3) + 4$", "$2x + 10$", ["$2x + 7$", "$2x + 34$"]),
          simplify("$2(x + 3) - 4$", "$2x + 2$", ["$2x - 1$", "$2x + 10$"], {
            changed: "Minus 4.",
          }),
          simplify("$2(x - 3) + 4$", "$2x - 2$", ["$2x + 1$", "$2x - 10$"], {
            changed: "A minus inside.",
          }),
          simplify("$2(x + 3) - 2x$", "$6$", ["$4x + 6$", "$2x + 6$"], {
            changed: "Minus $2x$.",
          }),
        ],
        "Expand first, then collect like terms.",
      ),

      questionSet(
        "Variation",
        "Expand. Watch what changes.",
        [
          expand("$(x - 2)^2$", "$x^2 - 4x + 4$", ["$x^2 + 4$", "$x^2 - 4$"], {
            expect: [
              "Leo writes $(x - 2)^2 = x^2 + 4$. Right?",
              "No",
              "$(x - 2)(x - 2) = x^2 - 4x + 4$.",
              [["Yes", "Where is the middle term?"]],
            ],
          }),
          expand("$(x + 2)^2$", "$x^2 + 4x + 4$", ["$x^2 + 4$", "$x^2 + 2x + 4$"], {
            changed: "Plus.",
          }),
          expand("$(x + 3)^2$", "$x^2 + 6x + 9$", ["$x^2 + 9$", "$x^2 + 3x + 9$"], {
            changed: "Plus 3.",
          }),
          expand("$(x + 3)^2 - 9$", "$x^2 + 6x$", ["$x^2$", "$x^2 + 6x + 18$"], {
            changed: "Minus 9.",
          }),
        ],
        "A square of a bracket has a middle term.",
      ),
      own(PF, SHOW, "Spot the mistake"),

      own(PF, SHOW, "Exit check"),

      reworded(
        PF,
        SHOW,
        "After expanding, $(x + 3)^2 - 9$ becomes",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Start with one side. Simplify, a line at a time, until it matches the other.**"],
        LHS,
        [
          "**Start with one side. Simplify, a line at a time, until it matches the other.**",
          "$(x - 2)^2 = x^2 - 4x + 4$.",
          "Testing one value isn't a proof.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Algebra in an argument.

const ARG = "gf-proof/argument";
const argMethod = [
  "Write the numbers with $n$.",
  "Simplify.",
  "Factorise to show it: $2(\\ldots)$ is even.",
];
const THREE = steps("n + (n + 1) + (n + 2)", "= 3n + 3", "= 3(n + 1)");
const shows = (prompt: string, right: string, extra: object = {}) =>
  pick(
    prompt,
    right,
    ["Always even", "Always odd", "A multiple of 3"].filter((s) => s !== right),
    "Look for a factor outside the bracket.",
    { asks: "shows", ...extra },
  );

const argument = stepped(find(PF, ARG), {
  method: argMethod,
  variation: {
    relationship: "a factor that proves the rule",
    unknowns: ["write", "shows"],
    surface: ["plus 1", "factor 3", "not factorised yet"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Letters for any number",
        ["**Examples suggest a rule; algebra proves it. Even: 2n. Odd: 2n + 1.**"],
        THREE,
        "3 times a whole number is a multiple of 3.",
      ),
      reworded(PF, ARG, "Which always stands for an odd number?", { tag: "The rule" }),

      ...owned(PF, ARG, "Warm-up", "Check you remember"),

      methodCard("The method", argMethod, THREE),
      workedFrom(PF, ARG),
      calc(
        "Your turn",
        "Prove that even + even is even.",
        undefined,
        [["$2n + 2m = 2(n +$", "m", "Take out the 2.", { after: "$)$" }]],
        "2 × a whole number: even.",
      ),

      calc(
        "Practise",
        "Prove two consecutive numbers add to an odd number.",
        undefined,
        [["$n + (n + 1) = 2n +$", "1", "Collect."]],
        "$2n + 1$ is odd.",
      ),
      ...owned(PF, ARG, "Together", "Practise"),
      ...owned(PF, ARG, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Write it with $n$. Watch what changes.",
        [
          pick("Any even number", "$2n$", ["$n + 2$", "$2n + 1$"], "2 × a whole number.", {
            asks: "write",
          }),
          pick("Any odd number", "$2n + 1$", ["$2n$", "$n + 1$"], "One more than even.", {
            asks: "write",
            changed: "Odd.",
          }),
          pick("The even number after $2n$", "$2n + 2$", ["$2n + 1$", "$3n$"], "Add 2.", {
            asks: "write",
            changed: "The next one.",
          }),
          pick(
            "Three consecutive numbers",
            "$n$, $n + 1$, $n + 2$",
            ["$n$, $2n$, $3n$", "$n$, $n + 2$, $n + 4$"],
            "One apart.",
            { asks: "write", changed: "Consecutive." },
          ),
        ],
        "Letters cover every case.",
      ),

      questionSet(
        "Variation",
        "What does it show? Watch what changes.",
        [
          shows("$2(3n + 2)$", "Always even", {
            expect: [
              "Ed writes two odd numbers as $2n + 1$ and $2n + 1$. Right?",
              "No",
              "That's the same number twice. Use $2n + 1$ and $2m + 1$.",
              [["Yes", "Must two odd numbers be equal?"]],
            ],
          }),
          shows("$2(3n + 2) + 1$", "Always odd", { changed: "Plus 1." }),
          shows("$3(n + 1)$", "A multiple of 3", { changed: "A factor of 3." }),
          shows("$6n + 4$", "Always even", { changed: "Not factorised yet." }),
        ],
        "The factor outside the bracket shows the rule.",
      ),
      own(PF, ARG, "Spot the mistake"),

      own(PF, ARG, "Exit check"),

      reworded(
        PF,
        ARG,
        "“Prove the sum of any three consecutive whole numbers is a multiple of 3.” The key line:",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Examples suggest a rule; algebra proves it. Even: 2n. Odd: 2n + 1.**"],
        THREE,
        [
          "**Examples suggest a rule; algebra proves it. Even: 2n. Odd: 2n + 1.**",
          "Consecutive: $n$, $n + 1$, $n + 2$.",
          "$2(\\ldots)$ is even; $3(\\ldots)$ is a multiple of 3.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

export const gfProofStepped: [string, UnitLesson[]][] = [
  [IDENT, [identity]],
  [SHOW, [showThat]],
  [ARG, [argument]],
];
