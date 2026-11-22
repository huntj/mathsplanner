// GCSE Foundation, "Expressions 2", on the stepped template (docs/proposals/lesson-stepped.md):
// expanding two brackets, factorising quadratics, the difference of two squares and indices in
// algebra. Expanding is drawn as a grid of four pieces; the rest is algebra, its own picture.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfExpressions2 } from "./gf-expressions-2.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const E2 = gfExpressions2;
const ALGEBRA = "Algebra: the expression is the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });

// ---------------------------------------------------------------------------------------------
// Expanding two brackets.

const EXPAND = "gf-expressions-2/expand";
const expandMethod = [
  "Draw a 2 by 2 grid.",
  "Multiply each pair, signs and all.",
  "Collect the two x terms.",
];
const GRID: Picture = {
  kind: "table",
  head: ["×", "$x$", "$+6$"],
  rows: [
    ["$x$", "$x^2$", "$6x$"],
    ["$+2$", "$2x$", "$12$"],
  ],
};

const expand = stepped(find(E2, EXPAND), {
  method: expandMethod,
  variation: {
    relationship: "two brackets and their four pieces",
    unknowns: ["expanded"],
    surface: ["minus signs", "squares", "2x"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Four pieces",
        ["**Multiply every term in one bracket by every term in the other.**"],
        GRID,
        "$(x + 6)(x + 2) = x^2 + 8x + 12$.",
      ),
      reworded(E2, EXPAND, "In $(x + a)(x + b)$, the number in front of $x$ is", {
        tag: "The rule",
      }),

      ...owned(E2, EXPAND, "Warm-up", "Check you remember"),

      methodCard("The method", expandMethod, GRID),
      workedFrom(E2, EXPAND),
      calc(
        "Your turn",
        "Expand $(x + 3)(x + 5)$.",
        undefined,
        [
          ["x terms: $5x + 3x =$", "8x", "Collect them."],
          ["Number: $3 \\times 5 =$", "15", "The last piece."],
        ],
        "$x^2 + 8x + 15$.",
      ),

      calc(
        "Practise",
        "Expand $(x - 4)(x + 7)$.",
        undefined,
        [
          ["x terms: $7x - 4x =$", "3x", "Keep the minus."],
          ["Number: $-4 \\times 7 =$", "-28", "Negative times positive."],
        ],
        "$x^2 + 3x - 28$.",
      ),
      ...owned(E2, EXPAND, "Together", "Practise"),
      ...owned(E2, EXPAND, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Expand. Watch what changes.",
        [
          pick(
            "$(x + 2)(x + 5)$",
            "$x^2 + 7x + 10$",
            ["$x^2 + 10x + 7$", "$x^2 + 10$"],
            "Add for x; multiply for the number.",
            {
              asks: "expanded",
            },
          ),
          pick(
            "$(x + 2)(x - 5)$",
            "$x^2 - 3x - 10$",
            ["$x^2 + 3x - 10$", "$x^2 - 3x + 10$"],
            "2 − 5 = −3.",
            {
              asks: "expanded",
              changed: "A minus.",
            },
          ),
          pick(
            "$(x - 2)(x - 5)$",
            "$x^2 - 7x + 10$",
            ["$x^2 - 7x - 10$", "$x^2 + 7x + 10$"],
            "−2 × −5 = +10.",
            {
              asks: "expanded",
              changed: "Two minuses.",
            },
          ),
          pick(
            "$(2x + 1)(x + 5)$",
            "$2x^2 + 11x + 5$",
            ["$2x^2 + 6x + 5$", "$2x^2 + 10x + 5$"],
            "10x + x.",
            {
              asks: "expanded",
              changed: "2x.",
            },
          ),
        ],
        "Four pieces, then collect.",
      ),

      questionSet(
        "Variation",
        "Expand. Watch what changes.",
        [
          pick(
            "$(x + 6)^2$",
            "$x^2 + 12x + 36$",
            ["$x^2 + 36$", "$x^2 + 6x + 36$"],
            "$(x + 6)(x + 6)$.",
            {
              asks: "expanded",
              expect: [
                "Kai says $(x + 6)^2 = x^2 + 36$. Right?",
                "No",
                "$(x + 6)(x + 6)$ has four pieces: $x^2 + 12x + 36$.",
                [["Yes", "Write it as two brackets."]],
              ],
            },
          ),
          pick(
            "$(x - 6)^2$",
            "$x^2 - 12x + 36$",
            ["$x^2 - 36$", "$x^2 - 12x - 36$"],
            "−6 × −6 = +36.",
            {
              asks: "expanded",
              changed: "Minus.",
            },
          ),
          pick(
            "$(x + 6)(x - 6)$",
            "$x^2 - 36$",
            ["$x^2 + 36$", "$x^2 - 12x - 36$"],
            "The x terms cancel.",
            {
              asks: "expanded",
              changed: "One of each.",
            },
          ),
          pick(
            "$(2x + 6)^2$",
            "$4x^2 + 24x + 36$",
            ["$2x^2 + 24x + 36$", "$4x^2 + 36$"],
            "$2x \\times 2x = 4x^2$.",
            {
              asks: "expanded",
              changed: "2x.",
            },
          ),
        ],
        "A square is two brackets: four pieces.",
      ),
      own(E2, EXPAND, "Spot the mistake"),

      own(E2, EXPAND, "Exit check"),

      reworded(
        E2,
        EXPAND,
        "“Expand and simplify $(x + 5)(x - 3)$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply every term in one bracket by every term in the other.**"],
        GRID,
        [
          "**Multiply every term in one bracket by every term in the other.**",
          "$(x + 3)^2 = x^2 + 6x + 9$, not $x^2 + 9$.",
          "$-6 \\times -1 = +6$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Factorising quadratics.

const QUADRATICS = "gf-expressions-2/factorise-quadratics";
const quadMethod = [
  "List pairs that multiply to c.",
  "Pick the pair that adds to b, signs and all.",
  "Write the brackets; expand to check.",
];
const PAIRS: Picture = {
  kind: "table",
  head: ["Pair", "Product", "Sum"],
  rows: [
    ["1, 15", "15", "16"],
    ["3, 5", "15", "8 ✓"],
  ],
};

const factoriseQuadratics = stepped(find(E2, QUADRATICS), {
  method: quadMethod,
  variation: {
    relationship: "a quadratic and the pair that multiplies to c and adds to b",
    unknowns: ["factorised"],
    surface: ["minus b", "minus c", "a bigger gap"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Product and sum",
        ["**Find two numbers that multiply to c and add to b.**"],
        PAIRS,
        "$x^2 + 8x + 15 = (x + 3)(x + 5)$.",
      ),
      reworded(E2, QUADRATICS, "Factorising $x^2 - 5x + 6$: the two numbers are", {
        tag: "The rule",
      }),

      ...owned(E2, QUADRATICS, "Warm-up", "Check you remember"),

      methodCard("The method", quadMethod, PAIRS),
      workedFrom(E2, QUADRATICS),
      calc(
        "Your turn",
        "Factorise $x^2 + 10x + 21$.",
        undefined,
        [
          ["The smaller number:", "3", "Multiply to 21, add to 10."],
          ["The larger number:", "7", "3 × 7 = 21; 3 + 7 = 10."],
        ],
        "$(x + 3)(x + 7)$.",
      ),

      calc(
        "Practise",
        "Factorise $x^2 - 4x - 12$.",
        undefined,
        [
          ["The positive number:", "2", "Multiply to −12, add to −4."],
          ["The negative number:", "-6", "2 × −6 = −12; 2 − 6 = −4."],
        ],
        "$(x + 2)(x - 6)$.",
      ),
      ...owned(E2, QUADRATICS, "Together", "Practise"),
      ...owned(E2, QUADRATICS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Factorise. Watch what changes.",
        [
          pick(
            "$x^2 + 7x + 10$",
            "$(x + 2)(x + 5)$",
            ["$(x + 1)(x + 10)$", "$(x - 2)(x - 5)$"],
            "2 × 5; 2 + 5.",
            {
              asks: "factorised",
            },
          ),
          pick(
            "$x^2 - 7x + 10$",
            "$(x - 2)(x - 5)$",
            ["$(x + 2)(x + 5)$", "$(x - 1)(x - 10)$"],
            "Both negative.",
            {
              asks: "factorised",
              changed: "Minus 7x.",
            },
          ),
          pick(
            "$x^2 + 3x - 10$",
            "$(x + 5)(x - 2)$",
            ["$(x - 5)(x + 2)$", "$(x + 2)(x + 5)$"],
            "5 − 2 = 3.",
            {
              asks: "factorised",
              changed: "Minus 10.",
            },
          ),
          pick(
            "$x^2 - 3x - 10$",
            "$(x - 5)(x + 2)$",
            ["$(x + 5)(x - 2)$", "$(x - 2)(x - 5)$"],
            "−5 + 2 = −3.",
            {
              asks: "factorised",
              changed: "Both minus.",
            },
          ),
        ],
        "The signs of b and c tell you the signs.",
      ),

      questionSet(
        "Variation",
        "Factorise. Watch the signs.",
        [
          pick(
            "$x^2 - 2x - 15$",
            "$(x - 5)(x + 3)$",
            ["$(x + 5)(x - 3)$", "$(x - 5)(x - 3)$"],
            "−5 + 3 = −2.",
            {
              asks: "factorised",
              expect: [
                "For $x^2 - 2x - 15$, Ali writes $(x + 5)(x - 3)$. Right?",
                "No",
                "That adds to +2. You need −2: $(x - 5)(x + 3)$.",
                [["Yes", "Check the sign of the sum."]],
              ],
            },
          ),
          pick(
            "$x^2 + 2x - 15$",
            "$(x + 5)(x - 3)$",
            ["$(x - 5)(x + 3)$", "$(x + 5)(x + 3)$"],
            "5 − 3 = 2.",
            {
              asks: "factorised",
              changed: "Plus 2x.",
            },
          ),
          pick(
            "$x^2 - 16x + 15$",
            "$(x - 1)(x - 15)$",
            ["$(x - 3)(x - 5)$", "$(x + 1)(x + 15)$"],
            "−1 − 15 = −16.",
            {
              asks: "factorised",
              changed: "Plus 15.",
            },
          ),
          pick(
            "$x^2 - 14x - 15$",
            "$(x - 15)(x + 1)$",
            ["$(x + 15)(x - 1)$", "$(x - 5)(x + 3)$"],
            "−15 + 1 = −14.",
            {
              asks: "factorised",
              changed: "A bigger gap.",
            },
          ),
        ],
        "Expand your answer to check the middle term.",
      ),
      own(E2, QUADRATICS, "Spot the mistake"),

      own(E2, QUADRATICS, "Exit check"),

      reworded(
        E2,
        QUADRATICS,
        "“Factorise $x^2 + 7x + 12$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Find two numbers that multiply to c and add to b.**"],
        PAIRS,
        [
          "**Find two numbers that multiply to c and add to b.**",
          "c negative: one number is negative.",
          "Expand to check: $(x + 2)(x + 3) = x^2 + 5x + 6$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// The difference of two squares.

const SQUARES = "gf-expressions-2/difference-of-squares";
const squaresMethod = [
  "Check: two squares, with a minus between.",
  "Square-root each one.",
  "Write (a + b)(a − b).",
];
const CANCEL = maths(
  "\\begin{array}{l} (x + 5)(x - 5) \\\\ = x^2 - 5x + 5x - 25 \\\\ = x^2 - 25 \\end{array}",
);

const squares = stepped(find(E2, SQUARES), {
  method: squaresMethod,
  variation: {
    relationship: "a² − b² and (a + b)(a − b)",
    unknowns: ["factorised"],
    surface: ["number squares", "letter squares", "sums"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The middle terms cancel",
        ["**A difference of two squares: a² − b² = (a + b)(a − b).**"],
        CANCEL,
        "The x terms cancel out.",
      ),
      reworded(E2, SQUARES, "Which is a difference of two squares?", { tag: "The rule" }),

      ...owned(E2, SQUARES, "Warm-up", "Check you remember"),

      methodCard("The method", squaresMethod, CANCEL),
      workedFrom(E2, SQUARES),
      calc(
        "Your turn",
        "Factorise $x^2 - 36$.",
        undefined,
        [
          ["$\\sqrt{36} =$", "6", "36 is 6 squared."],
          ["Check: $6 \\times -6 =$", "-36", "One plus, one minus."],
        ],
        "$(x + 6)(x - 6)$.",
      ),

      calc(
        "Practise",
        "Work out $31^2 - 29^2$.",
        undefined,
        [
          ["$31 + 29 =$", "60", "a + b."],
          ["$31 - 29 =$", "2", "a − b."],
          ["$60 \\times 2 =$", "120", "Multiply them."],
        ],
        "$31^2 - 29^2 = 120$.",
      ),
      ...owned(E2, SQUARES, "Together", "Practise"),
      ...owned(E2, SQUARES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Factorise. Watch what changes.",
        [
          pick(
            "$x^2 - 100$",
            "$(x + 10)(x - 10)$",
            ["$(x - 10)^2$", "$(x + 50)(x - 2)$"],
            "100 is 10 squared.",
            {
              asks: "factorised",
            },
          ),
          pick("$x^2 - 1$", "$(x + 1)(x - 1)$", ["$(x - 1)^2$", "$x(x - 1)$"], "1 is 1 squared.", {
            asks: "factorised",
            changed: "1 is a square.",
          }),
          pick(
            "$9x^2 - 100$",
            "$(3x + 10)(3x - 10)$",
            ["$(9x + 10)(x - 10)$", "$(3x - 10)^2$"],
            "$9x^2$ is $(3x)^2$.",
            {
              asks: "factorised",
              changed: "$9x^2$.",
            },
          ),
          pick(
            "$x^2 + 100$",
            "It doesn't factorise",
            ["$(x + 10)(x - 10)$", "$(x + 10)^2$"],
            "It's a sum.",
            {
              asks: "factorised",
              changed: "A sum.",
            },
          ),
        ],
        "A minus between two squares.",
      ),

      questionSet(
        "Variation",
        "Factorise. Watch what changes.",
        [
          pick(
            "$x^2 - 81$",
            "$(x + 9)(x - 9)$",
            ["$(x - 9)(x - 9)$", "$(x + 9)(x + 9)$"],
            "One plus, one minus.",
            {
              asks: "factorised",
              expect: [
                "For $x^2 - 81$, Mia writes $(x - 9)(x - 9)$. Right?",
                "No",
                "That gives $-18x$. One plus, one minus: $(x + 9)(x - 9)$.",
                [["Yes", "Expand it to check."]],
              ],
            },
          ),
          pick(
            "$4x^2 - 81$",
            "$(2x + 9)(2x - 9)$",
            ["$(4x + 9)(x - 9)$", "$(2x - 9)^2$"],
            "$4x^2$ is $(2x)^2$.",
            {
              asks: "factorised",
              changed: "$4x^2$.",
            },
          ),
          pick(
            "$x^2 - 81y^2$",
            "$(x + 9y)(x - 9y)$",
            ["$(x - 9y)^2$", "$(x + 9)(x - 9y)$"],
            "$81y^2$ is $(9y)^2$.",
            {
              asks: "factorised",
              changed: "Two letters.",
            },
          ),
          pick(
            "$81 - x^2$",
            "$(9 + x)(9 - x)$",
            ["$(x + 9)(x - 9)$", "$(9 - x)^2$"],
            "$81$ comes first.",
            {
              asks: "factorised",
              changed: "Swapped round.",
            },
          ),
        ],
        "Square-root each part; one plus, one minus.",
      ),
      own(E2, SQUARES, "Spot the mistake"),

      own(E2, SQUARES, "Exit check"),

      reworded(E2, SQUARES, "“Factorise $x^2 - 49$.”", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**A difference of two squares: a² − b² = (a + b)(a − b).**"],
        CANCEL,
        [
          "**A difference of two squares: a² − b² = (a + b)(a − b).**",
          "$x^2 + 36$ doesn't factorise this way.",
          "$51^2 - 49^2 = 100 \\times 2$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Indices in algebra.

const INDICES = "gf-expressions-2/indices";
const indicesMethod = [
  "Numbers: multiply or divide as usual.",
  "Same letter: add powers to multiply; subtract to divide.",
  "A power of a power: multiply the powers.",
];
const COUNT = maths("x^2 \\times x^3 = (x \\cdot x)(x \\cdot x \\cdot x) = x^5");

const indices = stepped(find(E2, INDICES), {
  method: indicesMethod,
  variation: {
    relationship: "the index laws",
    unknowns: ["simplified"],
    surface: ["multiplying", "dividing", "brackets", "numbers in front"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three laws",
        ["**Multiply: add the powers. Divide: subtract. Power of a power: multiply.**"],
        COUNT,
        "Numbers in front multiply or divide as usual.",
      ),
      reworded(E2, INDICES, "$x^5 \\times x^3 =$", { tag: "The rule" }),

      ...owned(E2, INDICES, "Warm-up", "Check you remember"),

      methodCard("The method", indicesMethod, COUNT),
      workedFrom(E2, INDICES),
      calc(
        "Your turn",
        "Simplify $4a^3 \\times 6a^5$.",
        undefined,
        [
          ["Numbers: $4 \\times 6 =$", "24", "Multiply."],
          ["Power of a: $3 + 5 =$", "8", "Add."],
        ],
        "$24a^8$.",
      ),

      calc(
        "Practise",
        "Simplify $\\dfrac{18y^9}{3y^4}$.",
        undefined,
        [
          ["Numbers: $18 \\div 3 =$", "6", "Divide."],
          ["Power of y: $9 - 4 =$", "5", "Subtract."],
        ],
        "$6y^5$.",
      ),
      ...owned(E2, INDICES, "Together", "Practise"),
      ...owned(E2, INDICES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Simplify. Watch what changes.",
        [
          pick("$x^6 \\times x^2$", "$x^8$", ["$x^{12}$", "$x^4$"], "Add the powers.", {
            asks: "simplified",
          }),
          pick("$x^6 \\div x^2$", "$x^4$", ["$x^3$", "$x^8$"], "Subtract the powers.", {
            asks: "simplified",
            changed: "Divide.",
          }),
          pick("$(x^6)^2$", "$x^{12}$", ["$x^8$", "$x^{36}$"], "Multiply the powers.", {
            asks: "simplified",
            changed: "A power of a power.",
          }),
          pick("$2x^6 \\times 3x^2$", "$6x^8$", ["$5x^8$", "$6x^{12}$"], "2 × 3; add the powers.", {
            asks: "simplified",
            changed: "Numbers in front.",
          }),
        ],
        "Add, subtract or multiply the powers.",
      ),

      questionSet(
        "Variation",
        "Simplify. Watch the brackets.",
        [
          pick("$(2c^5)^2$", "$4c^{10}$", ["$2c^{10}$", "$4c^7$"], "Square the 2 too.", {
            asks: "simplified",
            expect: [
              "Ella writes $(2c^5)^2 = 2c^{10}$. Right?",
              "No",
              "Square the 2 as well: $4c^{10}$.",
              [["Yes", "What's inside the bracket?"]],
            ],
          }),
          pick("$(2c^5)^3$", "$8c^{15}$", ["$6c^{15}$", "$8c^8$"], "$2^3 = 8$.", {
            asks: "simplified",
            changed: "Cubed.",
          }),
          pick("$2(c^5)^3$", "$2c^{15}$", ["$8c^{15}$", "$6c^{15}$"], "The 2 is outside.", {
            asks: "simplified",
            changed: "2 outside.",
          }),
          pick("$(2c)^5$", "$32c^5$", ["$2c^5$", "$10c^5$"], "$2^5 = 32$.", {
            asks: "simplified",
            changed: "Power outside.",
          }),
        ],
        "A power outside a bracket acts on everything in it.",
      ),
      own(E2, INDICES, "Spot the mistake"),

      own(E2, INDICES, "Exit check"),

      reworded(
        E2,
        INDICES,
        "“Simplify $3x^4 \\times 5x^2$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply: add the powers. Divide: subtract. Power of a power: multiply.**"],
        COUNT,
        [
          "**Multiply: add the powers. Divide: subtract. Power of a power: multiply.**",
          "$x^2 \\times x^3 = x^5$, not $x^6$.",
          "$(3b^4)^2 = 9b^8$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

export const gfExpressions2Stepped: [string, UnitLesson[]][] = [
  [EXPAND, [expand]],
  [QUADRATICS, [factoriseQuadratics]],
  [SQUARES, [squares]],
  [INDICES, [indices]],
];
