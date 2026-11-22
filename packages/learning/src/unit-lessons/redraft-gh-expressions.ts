// GCSE Higher, "Algebraic expressions", on the stepped template (docs/proposals/lesson-stepped.md):
// identities, algebraic proof, expanding three brackets, factorising ax² + bx + c, algebraic
// fractions and expressions with surds. The algebra is the picture, set out a line at a time.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { ghExpressions } from "./gh-expressions.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const EX = ghExpressions;
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
// Using identities.

const IDENT = "gh-expressions/identities";
const identMethod = [
  "Expand the side with letters.",
  "Line up $x^2$, $x$ and number terms.",
  "Match each coefficient; solve.",
];
const MATCH = steps(
  "(x + a)^2 + b \\equiv x^2 + 6x + 11",
  "x^2 + 2ax + a^2 + b",
  "2a = 6,\\ a = 3;\\ 9 + b = 11,\\ b = 2",
);
const constant = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Expand, then match the terms.", { asks: "constant", ...extra });

const identities = stepped(find(EX, IDENT), {
  method: identMethod,
  variation: {
    relationship: "coefficients matched across ≡",
    unknowns: ["constant"],
    surface: ["a minus", "a number outside", "a squared bracket"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Match the coefficients",
        ["**In an identity, the coefficients of each power of x must match.**"],
        MATCH,
        "Match the $x$ terms first, then the numbers.",
      ),
      reworded(EX, IDENT, "$ax + 5 \\equiv 3x + b$ means", { tag: "The rule" }),

      ...owned(EX, IDENT, "Warm-up", "Check you remember"),

      methodCard("The method", identMethod, MATCH),
      workedFrom(EX, IDENT),
      calc(
        "Your turn",
        "$(x + a)^2 + b \\equiv x^2 + 10x + 30$.",
        undefined,
        [
          ["$2a = 10$, so $a =$", "5", "Match the $x$ terms."],
          ["$25 + b = 30$, so $b =$", "5", "Match the numbers."],
        ],
        "$a = 5$, $b = 5$.",
      ),

      calc(
        "Practise",
        "$(x - a)^2 + b \\equiv x^2 - 8x + 3$.",
        undefined,
        [
          ["$-2a = -8$, so $a =$", "4", "Match the $x$ terms."],
          ["$16 + b = 3$, so $b =$", "-13", "3 − 16."],
        ],
        "$a = 4$, $b = -13$.",
      ),
      ...owned(EX, IDENT, "Together", "Practise"),
      ...owned(EX, IDENT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find $k$. Watch what changes.",
        [
          constant("$4(x + k) \\equiv 4x + 12$", "3", ["12", "8"]),
          constant("$4(x - k) \\equiv 4x - 12$", "3", ["−3", "−12"], { changed: "A minus." }),
          constant("$k(x + 3) \\equiv 5x + 15$", "5", ["3", "15"], {
            changed: "The number outside.",
          }),
          constant("$(x + k)^2 \\equiv x^2 + 14x + 49$", "7", ["14", "49"], {
            changed: "A squared bracket.",
          }),
        ],
        "Expand, then line the terms up.",
      ),

      questionSet(
        "Variation",
        "Find $a$. Watch what changes.",
        [
          constant("$(x + a)^2 \\equiv x^2 + 8x + 16$", "4", ["8", "16"], {
            expect: [
              "Kim expands $(x + a)^2$ as $x^2 + ax + a^2$. Right?",
              "No",
              "Two middle terms: $x^2 + 2ax + a^2$, so $2a = 8$.",
              [["Yes", "What is $ax + ax$?"]],
            ],
          }),
          constant("$(x + a)^2 \\equiv x^2 + 20x + 100$", "10", ["20", "100"], {
            changed: "Bigger.",
          }),
          constant("$(x - a)^2 \\equiv x^2 - 6x + 9$", "3", ["−3", "6"], { changed: "A minus." }),
          constant("$(x + a)^2 + 1 \\equiv x^2 + 6x + 10$", "3", ["6", "9"], {
            changed: "A number added.",
          }),
        ],
        "$(x + a)^2 = x^2 + 2ax + a^2$.",
      ),
      own(EX, IDENT, "Spot the mistake"),

      own(EX, IDENT, "Exit check"),

      reworded(
        EX,
        IDENT,
        "“Find $a$ and $b$.”",
        { tag: "Real life", title: "$(x + a)^2 + b \\equiv x^2 + 6x + 11$. Find $a$ and $b$." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**In an identity, the coefficients of each power of x must match.**"],
        MATCH,
        [
          "**In an identity, the coefficients of each power of x must match.**",
          "$(x + a)^2 = x^2 + 2ax + a^2$.",
          "Match $x$ terms, then numbers.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Algebraic proof.

const PROOF = "gh-expressions/proof";
const proofMethod = [
  "Write the numbers with $n$.",
  "Expand and simplify.",
  "Factorise to show it; finish with a sentence.",
];
const ODDS = steps("(2n + 3)^2 - (2n + 1)^2", "= 8n + 8", "= 8(n + 1): \\text{ a multiple of } 8");
const multiple = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Factorise: the number outside.", { asks: "multiple", ...extra });

const proof = stepped(find(EX, PROOF), {
  method: proofMethod,
  variation: {
    relationship: "a factor that proves the property",
    unknowns: ["write", "multiple"],
    surface: ["a square", "a difference", "odd numbers"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A proof covers every case",
        ["**Use letters for any number, simplify, then factorise to show the property.**"],
        ODDS,
        "Examples can't prove it; algebra can.",
      ),
      reworded(EX, PROOF, "To show something is a multiple of 8, write it as", {
        tag: "The rule",
      }),

      ...owned(EX, PROOF, "Warm-up", "Check you remember"),

      methodCard("The method", proofMethod, ODDS),
      workedFrom(EX, PROOF),
      calc(
        "Your turn",
        "Prove $(n + 3)^2 - (n + 1)^2$ is a multiple of 4.",
        undefined,
        [
          ["Simplified: $4n +$", "8", "$n^2 + 6n + 9 - n^2 - 2n - 1$."],
          ["$= 4(n +$", "2", "Take out 4.", { after: "$)$" }],
        ],
        "4 times a whole number: a multiple of 4.",
      ),

      calc(
        "Practise",
        "Prove the sum of four consecutive numbers is even.",
        undefined,
        [
          ["$n + (n+1) + (n+2) + (n+3) = 4n +$", "6", "1 + 2 + 3."],
          ["$= 2(2n +$", "3", "Take out 2.", { after: "$)$" }],
        ],
        "2 times a whole number: even.",
      ),
      ...owned(EX, PROOF, "Together", "Practise"),
      ...owned(EX, PROOF, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Write it with $n$. Watch what changes.",
        [
          pick("Two consecutive numbers", "$n$, $n + 1$", ["$n$, $m$", "$n$, $2n$"], "One apart.", {
            asks: "write",
          }),
          pick(
            "Two consecutive even numbers",
            "$2n$, $2n + 2$",
            ["$2n$, $2n + 1$", "$2n$, $2m$"],
            "Two apart.",
            { asks: "write", changed: "Even." },
          ),
          pick(
            "Two consecutive odd numbers",
            "$2n + 1$, $2n + 3$",
            ["$2n + 1$, $2m + 1$", "$2n + 1$, $2n + 2$"],
            "Two apart.",
            { asks: "write", changed: "Odd." },
          ),
          pick("Any square number", "$n^2$", ["$2n$", "$n + n$"], "A number times itself.", {
            asks: "write",
            changed: "A square.",
          }),
        ],
        "Consecutive numbers share one letter.",
      ),

      questionSet(
        "Variation",
        "A multiple of what? Watch what changes.",
        [
          multiple("$8n + 8$", "8", ["16", "2 only"], {
            expect: [
              "Leo writes $-(2n + 1)^2 = -4n^2 + 4n + 1$. Right?",
              "No",
              "The minus goes on every term: $-4n^2 - 4n - 1$.",
              [["Yes", "What does the minus do to $4n$?"]],
            ],
          }),
          multiple("$6n + 12$", "6", ["12", "18"], { changed: "New numbers." }),
          multiple("$12n + 8$", "4", ["12", "8"], { changed: "A smaller common factor." }),
          multiple("$9n + 6$", "3", ["9", "6"], { changed: "Odd and even." }),
        ],
        "The highest common factor is what you can prove.",
      ),
      own(EX, PROOF, "Spot the mistake"),

      own(EX, PROOF, "Exit check"),

      reworded(
        EX,
        PROOF,
        "The key line of the proof:",
        {
          tag: "Real life",
          title: "Prove the difference of two consecutive odd squares is a multiple of 8.",
        },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Use letters for any number, simplify, then factorise to show the property.**"],
        ODDS,
        [
          "**Use letters for any number, simplify, then factorise to show the property.**",
          "Consecutive odds: $2n + 1$, $2n + 3$.",
          "A minus outside a bracket changes every sign.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Expanding three brackets.

const THREE = "gh-expressions/three-binomials";
const threeMethod = [
  "Expand two brackets.",
  "Multiply each term by the third bracket.",
  "Collect like terms.",
];
const CUBE = steps(
  "(x + 1)(x + 2) = x^2 + 3x + 2",
  "(x^2 + 3x + 2)(x + 3)",
  "= x^3 + 6x^2 + 11x + 6",
);
const coefficient = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Expand two, then the third.", { asks: "coefficient", ...extra });

const threeBrackets = stepped(find(EX, THREE), {
  method: threeMethod,
  variation: {
    relationship: "three brackets multiplied out",
    unknowns: ["constant", "coefficient"],
    surface: ["a minus", "a repeated bracket", "a bigger number"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Two, then the third",
        ["**Expand two brackets, then multiply every term by the third.**"],
        CUBE,
        "Three brackets give 8 products before collecting.",
      ),
      reworded(EX, THREE, "How many products before collecting in $(a + b)(c + d)(e + f)$?", {
        tag: "The rule",
        title: "Products before collecting in $(a + b)(c + d)(e + f)$?",
      }),

      ...owned(EX, THREE, "Warm-up", "Check you remember"),

      methodCard("The method", threeMethod, CUBE),
      workedFrom(EX, THREE),
      calc(
        "Your turn",
        "Expand $(x + 1)(x + 2)(x + 5)$.",
        undefined,
        [
          ["$(x + 1)(x + 2) = x^2 + 3x +$", "2", "1 × 2."],
          ["$x^2$ coefficient:", "8", "5 + 3."],
          ["$x$ coefficient:", "17", "15 + 2."],
          ["Constant:", "10", "2 × 5."],
        ],
        "$x^3 + 8x^2 + 17x + 10$.",
      ),

      calc(
        "Practise",
        "Expand $(x + 2)^3$.",
        undefined,
        [
          ["$(x + 2)^2 = x^2 + 4x +$", "4", "2 × 2."],
          ["$x^2$ coefficient:", "6", "4 + 2."],
          ["$x$ coefficient:", "12", "8 + 4."],
          ["Constant:", "8", "4 × 2."],
        ],
        "$x^3 + 6x^2 + 12x + 8$.",
      ),
      ...owned(EX, THREE, "Together", "Practise"),
      ...owned(EX, THREE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The constant term. Watch what changes.",
        [
          pick("$(x + 1)(x + 2)(x + 3)$", "6", ["1", "5"], "1 × 2 × 3.", { asks: "constant" }),
          pick("$(x - 1)(x + 2)(x + 3)$", "−6", ["6", "4"], "−1 × 2 × 3.", {
            asks: "constant",
            changed: "A minus.",
          }),
          pick("$(x - 1)(x - 2)(x + 3)$", "6", ["−6", "0"], "Two minuses.", {
            asks: "constant",
            changed: "Two minuses.",
          }),
          pick("$(x + 3)^3$", "27", ["9", "3"], "3 × 3 × 3.", {
            asks: "constant",
            changed: "A cube.",
          }),
        ],
        "The constant: multiply the numbers.",
      ),

      questionSet(
        "Variation",
        "The $x$ coefficient. Watch what changes.",
        [
          coefficient("$(x + 1)(x + 1)(x - 2)$", "−3", ["−4", "1"], {
            expect: [
              "Zoe gets $x^3 - 3x + 2$ for $(x + 1)^2(x - 2)$. Right?",
              "No",
              "$-4x + x = -3x$ is right, but the constant is $1 \\times -2 = -2$.",
              [["Yes", "What is $1 \\times (-2)$?"]],
            ],
          }),
          coefficient("$(x + 1)(x + 1)(x + 2)$", "5", ["3", "4"], { changed: "A plus." }),
          coefficient("$(x + 1)(x + 2)(x + 3)$", "11", ["6", "9"], { changed: "All different." }),
          coefficient("$(x + 1)^3$", "3", ["1", "2"], { changed: "A cube." }),
        ],
        "Collect every $x$ term with care.",
      ),
      own(EX, THREE, "Spot the mistake"),

      own(EX, THREE, "Exit check"),

      reworded(
        EX,
        THREE,
        "“Show the volume is $x^3 + 6x^2 + 11x + 6$.” The $x$ term comes from",
        { tag: "Real life", title: "A cuboid is $x + 1$ by $x + 2$ by $x + 3$. The $x$ term:" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Expand two brackets, then multiply every term by the third.**"],
        CUBE,
        [
          "**Expand two brackets, then multiply every term by the third.**",
          "$(x + 2)^3 = x^3 + 6x^2 + 12x + 8$.",
          "Constant term: multiply the numbers.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Factorising ax² + bx + c.

const FAC = "gh-expressions/factorise-ax2";
const facMethod = [
  "Find two numbers: multiply to $ac$, add to $b$.",
  "Split the middle term with them.",
  "Factorise in pairs.",
];
const SPLIT = steps(
  "2x^2 + 7x + 3:\\ ac = 6",
  "2x^2 + x + 6x + 3",
  "= x(2x + 1) + 3(2x + 1)",
  "= (2x + 1)(x + 3)",
);
const factor = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Expand your answer to check.", { asks: "factor", ...extra });

const factoriseAx2 = stepped(find(EX, FAC), {
  method: facMethod,
  variation: {
    relationship: "a pair multiplying to ac, adding to b",
    unknowns: ["pair", "factor"],
    surface: ["a minus", "a bigger a", "a difference of squares"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Split the middle term",
        ["**Find two numbers that multiply to ac and add to b; split the middle with them.**"],
        SPLIT,
        "Expand your answer to check it.",
      ),
      reworded(EX, FAC, "For $2x^2 + 7x + 3$: multiply to", { tag: "The rule" }),

      ...owned(EX, FAC, "Warm-up", "Check you remember"),

      methodCard("The method", facMethod, SPLIT),
      workedFrom(EX, FAC),
      calc(
        "Your turn",
        "Factorise $3x^2 + 10x + 3$.",
        undefined,
        [
          ["$ac =$", "9", "3 × 3."],
          ["The pair: 1 and", "9", "× 9, + 10."],
          ["$(3x + 1)(x +$", "3", "Factorise in pairs.", { after: "$)$" }],
        ],
        "$(3x + 1)(x + 3)$.",
      ),

      calc(
        "Practise",
        "Factorise $2x^2 - 5x - 3$.",
        undefined,
        [
          ["$ac =$", "-6", "2 × −3."],
          ["The pair: 1 and", "-6", "× −6, + −5."],
          ["$(2x + 1)(x -$", "3", "Factorise in pairs.", { after: "$)$" }],
        ],
        "$(2x + 1)(x - 3)$.",
      ),
      ...owned(EX, FAC, "Together", "Practise"),
      ...owned(EX, FAC, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "The pair for $ac$ and $b$. Watch what changes.",
        [
          pick("$2x^2 + 7x + 6$", "3 and 4", ["2 and 3", "1 and 6"], "× 12, + 7.", {
            asks: "pair",
          }),
          pick("$2x^2 - 7x + 6$", "−3 and −4", ["3 and 4", "−2 and −3"], "× 12, + −7.", {
            asks: "pair",
            changed: "Minus $7x$.",
          }),
          pick("$2x^2 + x - 6$", "4 and −3", ["−4 and 3", "2 and −3"], "× −12, + 1.", {
            asks: "pair",
            changed: "Minus 6.",
          }),
          pick("$3x^2 + 7x + 2$", "1 and 6", ["2 and 3", "1 and 2"], "× 6, + 7.", {
            asks: "pair",
            changed: "A new $a$.",
          }),
        ],
        "Multiply to $ac$, not just $c$.",
      ),

      questionSet(
        "Variation",
        "Factorise. Watch what changes.",
        [
          factor(
            "$3x^2 + 5x + 2$",
            "$(3x + 2)(x + 1)$",
            ["$(3x + 3)(x + 2)$", "$(3x + 1)(x + 2)$"],
            {
              expect: [
                "Kim ends with $(3x + 3)(x + 2)$ for $3x^2 + 5x + 2$. Right?",
                "No",
                "That expands to $3x^2 + 9x + 6$. It's $(3x + 2)(x + 1)$.",
                [["Yes", "Does it expand back?"]],
              ],
            },
          ),
          factor(
            "$3x^2 + 7x + 2$",
            "$(3x + 1)(x + 2)$",
            ["$(3x + 2)(x + 1)$", "$(3x + 7)(x + 2)$"],
            {
              changed: "A bigger middle.",
            },
          ),
          factor(
            "$3x^2 - 7x + 2$",
            "$(3x - 1)(x - 2)$",
            ["$(3x + 1)(x + 2)$", "$(3x - 2)(x - 1)$"],
            {
              changed: "A minus.",
            },
          ),
          factor("$9x^2 - 4$", "$(3x - 2)(3x + 2)$", ["$(9x - 2)(x + 2)$", "$(3x - 4)(3x + 1)$"], {
            changed: "No middle term.",
          }),
        ],
        "Expand the brackets to check.",
      ),
      own(EX, FAC, "Spot the mistake"),

      own(EX, FAC, "Exit check"),

      reworded(
        EX,
        FAC,
        "“Factorise $2x^2 + 7x + 3$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Find two numbers that multiply to ac and add to b; split the middle with them.**"],
        SPLIT,
        [
          "**Find two numbers that multiply to ac and add to b; split the middle with them.**",
          "Factorise in pairs: a common bracket appears.",
          "$9x^2 - 4 = (3x - 2)(3x + 2)$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Simplifying algebraic fractions.

const FRAC = "gh-expressions/algebraic-fractions";
const fracMethod = [
  "Factorise the top and the bottom.",
  "Cancel brackets that appear in both.",
  "Adding: a common denominator first.",
];
const CANCEL = steps(
  "\\frac{x^2 - 9}{x^2 + 5x + 6}",
  "= \\frac{(x - 3)(x + 3)}{(x + 2)(x + 3)}",
  "= \\frac{x - 3}{x + 2}",
);
const simplify = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Factorise first; cancel whole brackets.", {
    asks: "simplify",
    ...extra,
  });

const fractions = stepped(find(EX, FRAC), {
  method: fracMethod,
  variation: {
    relationship: "common factors cancelled",
    unknowns: ["simplify", "combine"],
    surface: ["a common factor", "a difference of squares", "a quadratic below"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Cancel factors, not terms",
        ["**Factorise the top and bottom fully, then cancel brackets that match.**"],
        CANCEL,
        "You can't cancel a term that's only part of the top.",
      ),
      reworded(EX, FRAC, "Can you cancel the $x$ in $\\frac{x + 3}{x}$?", { tag: "The rule" }),

      ...owned(EX, FRAC, "Warm-up", "Check you remember"),

      methodCard("The method", fracMethod, CANCEL),
      workedFrom(EX, FRAC),
      calc(
        "Your turn",
        "Simplify $\\frac{x^2 + 4x}{x^2 - 16}$.",
        undefined,
        [
          [
            "Top: $x(x + 4)$. Bottom: $(x - 4)(x +$",
            "4",
            "Difference of squares.",
            { after: "$)$" },
          ],
          ["Answer: $\\frac{x}{x - ?}$, ? =", "4", "Cancel $(x + 4)$."],
        ],
        "$\\frac{x}{x - 4}$.",
      ),

      calc(
        "Practise",
        "Write $\\frac{3}{x} + \\frac{2}{x + 1}$ as one fraction.",
        undefined,
        [
          ["Top: $3(x + 1) + 2x = ?x + 3$, ? =", "5", "3x + 2x."],
          ["Bottom: $x(x + ?)$, ? =", "1", "Multiply the bottoms."],
        ],
        "$\\frac{5x + 3}{x(x + 1)}$.",
      ),
      ...owned(EX, FRAC, "Together", "Practise"),
      ...owned(EX, FRAC, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Simplify. Watch what changes.",
        [
          simplify("$\\frac{5x + 10}{5}$", "$x + 2$", ["$x + 10$", "$5x + 2$"]),
          simplify("$\\frac{5x + 10}{x + 2}$", "5", ["$5x$", "$x + 5$"], {
            changed: "A bracket below.",
          }),
          simplify("$\\frac{x^2 - 4}{x + 2}$", "$x - 2$", ["$x - 4$", "$x + 2$"], {
            changed: "Squares on top.",
          }),
          simplify("$\\frac{x^2 + 5x + 6}{x + 3}$", "$x + 2$", ["$x + 5$", "$x^2 + 2$"], {
            changed: "A quadratic on top.",
          }),
        ],
        "Factorise, then cancel matching brackets.",
      ),

      questionSet(
        "Variation",
        "Simplify fully. Watch what changes.",
        [
          simplify("$\\frac{x^2 - 4}{x - 2}$", "$x + 2$", ["$\\frac{x - 4}{-2}$", "$x - 2$"], {
            expect: [
              "Leo cancels the $x$ in $\\frac{x^2 - 4}{x - 2}$. Right?",
              "No",
              "Factorise first: $\\frac{(x - 2)(x + 2)}{x - 2} = x + 2$.",
              [["Yes", "Is $x$ a factor of $x - 2$?"]],
            ],
          }),
          simplify(
            "$\\frac{x^2 - 4}{x^2 - 2x}$",
            "$\\frac{x + 2}{x}$",
            ["$\\frac{2}{x}$", "$x + 2$"],
            {
              changed: "$x$ outside below.",
            },
          ),
          simplify(
            "$\\frac{x^2 - 4}{x^2 + 4x + 4}$",
            "$\\frac{x - 2}{x + 2}$",
            ["$\\frac{-1}{x}$", "$\\frac{x + 2}{x - 2}$"],
            { changed: "A square below." },
          ),
          pick(
            "$\\frac{1}{x} + \\frac{1}{3x}$",
            "$\\frac{4}{3x}$",
            ["$\\frac{2}{4x}$", "$\\frac{2}{3x}$"],
            "Make $3x$ the bottom.",
            {
              asks: "combine",
              changed: "Adding.",
            },
          ),
        ],
        "Cancel brackets, never single terms.",
      ),
      own(EX, FRAC, "Spot the mistake"),

      own(EX, FRAC, "Exit check"),

      reworded(
        EX,
        FRAC,
        "“Simplify fully $\\frac{x^2 - 9}{x^2 + 5x + 6}$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Factorise the top and bottom fully, then cancel brackets that match.**"],
        CANCEL,
        [
          "**Factorise the top and bottom fully, then cancel brackets that match.**",
          "Cancel factors, never terms.",
          "Add with a common denominator.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Simplifying expressions with surds.

const SURD = "gh-expressions/surd-expressions";
const surdMethod = [
  "Simplify each surd.",
  "Collect or expand.",
  "Rationalise any surd on the bottom.",
];
const ORDER = steps("(2 + \\sqrt3)^2", "= 4 + 2\\sqrt3 + 2\\sqrt3 + 3", "= 7 + 4\\sqrt3");
const form = (prompt: string, right: string, others: string[], extra: object = {}) =>
  pick(prompt, right, others, "Expand fully; collect the surds and the numbers.", {
    asks: "expand",
    ...extra,
  });

const surdExpressions = stepped(find(EX, SURD), {
  method: surdMethod,
  variation: {
    relationship: "numbers and surds kept apart",
    unknowns: ["collect", "expand"],
    surface: ["a minus", "different surds", "a surd squared"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "One step at a time",
        ["**Simplify each surd, collect or expand, then rationalise the bottom.**"],
        ORDER,
        "Whole numbers and surds stay apart, like $a + b\\sqrt3$.",
      ),
      reworded(EX, SURD, "$\\sqrt{50} + \\sqrt{18}$", { tag: "The rule" }),

      ...owned(EX, SURD, "Warm-up", "Check you remember"),

      methodCard("The method", surdMethod, ORDER),
      workedFrom(EX, SURD),
      calc(
        "Your turn",
        "Expand $(3 + \\sqrt5)^2$ as $a + b\\sqrt5$.",
        undefined,
        [
          ["$a = 9 + 5 =$", "14", "Numbers."],
          ["$b =$", "6", "$3\\sqrt5 + 3\\sqrt5$."],
        ],
        "$14 + 6\\sqrt5$.",
      ),

      calc(
        "Practise",
        "Simplify $\\sqrt{75} - \\sqrt{12}$.",
        undefined,
        [
          ["$\\sqrt{75} = ?\\sqrt3$, ? =", "5", "75 = 25 × 3."],
          ["Answer: $?\\sqrt3$, ? =", "3", "5 − 2."],
        ],
        "$3\\sqrt3$.",
      ),
      ...owned(EX, SURD, "Together", "Practise"),
      ...owned(EX, SURD, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Simplify. Watch what changes.",
        [
          pick(
            "$\\sqrt8 + \\sqrt{18}$",
            "$5\\sqrt2$",
            ["$\\sqrt{26}$", "$6\\sqrt2$"],
            "2√2 + 3√2.",
            {
              asks: "collect",
            },
          ),
          pick(
            "$\\sqrt{18} - \\sqrt8$",
            "$\\sqrt2$",
            ["$\\sqrt{10}$", "$5\\sqrt2$"],
            "3√2 − 2√2.",
            {
              asks: "collect",
              changed: "Subtract.",
            },
          ),
          pick("$\\sqrt{18} \\times \\sqrt8$", "12", ["$\\sqrt{26}$", "$6\\sqrt2$"], "√144.", {
            asks: "collect",
            changed: "Multiply.",
          }),
          pick("$\\frac{\\sqrt{18}}{\\sqrt2}$", "3", ["$\\sqrt{16}$", "9"], "√9.", {
            asks: "collect",
            changed: "Divide.",
          }),
        ],
        "Simplify each surd first.",
      ),

      questionSet(
        "Variation",
        "Expand. Watch what changes.",
        [
          form("$(3 - \\sqrt2)^2$", "$11 - 6\\sqrt2$", ["$5\\sqrt2$", "$7$"], {
            expect: [
              "Zoe gets $11 - 6\\sqrt2$, then writes $5\\sqrt2$. Right?",
              "No",
              "11 and $6\\sqrt2$ aren't like terms: leave $11 - 6\\sqrt2$.",
              [["Yes", "Can a number and a surd be collected?"]],
            ],
          }),
          form("$(3 + \\sqrt2)^2$", "$11 + 6\\sqrt2$", ["$11$", "$9 + 2$"], { changed: "A plus." }),
          form("$(3 + \\sqrt2)(3 - \\sqrt2)$", "7", ["$11$", "$7 - 6\\sqrt2$"], {
            changed: "Opposite signs.",
          }),
          form("$(\\sqrt5 + 1)(\\sqrt5 + 3)$", "$8 + 4\\sqrt5$", ["8", "$5 + 4\\sqrt5$"], {
            changed: "Surds in both.",
          }),
        ],
        "Numbers with numbers; surds with surds.",
      ),
      own(EX, SURD, "Spot the mistake"),

      own(EX, SURD, "Exit check"),

      reworded(
        EX,
        SURD,
        "“Expand $(2 + \\sqrt3)^2$ as $a + b\\sqrt3$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Simplify each surd, collect or expand, then rationalise the bottom.**"],
        ORDER,
        [
          "**Simplify each surd, collect or expand, then rationalise the bottom.**",
          "Answers like $a + b\\sqrt3$: keep them apart.",
          "$\\sqrt{12} + \\sqrt3 = 3\\sqrt3$.",
        ],
        DONE,
      ),
    ],
    ALGEBRA,
  ),
});

export const ghExpressionsStepped: [string, UnitLesson[]][] = [
  [IDENT, [identities]],
  [PROOF, [proof]],
  [THREE, [threeBrackets]],
  [FAC, [factoriseAx2]],
  [FRAC, [fractions]],
  [SURD, [surdExpressions]],
];
