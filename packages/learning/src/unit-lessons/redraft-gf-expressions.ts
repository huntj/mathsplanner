// GCSE Foundation, "Expressions 1", on the stepped template (docs/proposals/lesson-stepped.md):
// notation, vocabulary, like terms, expanding a bracket and factorising. Algebra is its own
// picture.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { gfExpressions1 } from "./gf-expressions-1.ts";

const E1 = gfExpressions1;
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
// Algebra's shorthand.

const NOTATION = "gf-expressions-1/notation";
const notationMethod = [
  "Write each step in order.",
  "Numbers first; the × and ÷ signs drop out.",
  "Bracket a whole expression that is multiplied or squared.",
];
const SHORTHAND = maths(
  "ab = a \\times b \\quad a^2 = a \\times a \\quad \\frac{a}{b} = a \\div b",
);

const notation = stepped(find(E1, NOTATION), {
  method: notationMethod,
  variation: {
    relationship: "words and the algebra that says them",
    unknowns: ["expression", "meaning"],
    surface: ["the order of steps", "what a square covers", "fractions"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Algebra's shorthand",
        ["**ab is a × b, a² is a × a, and numbers go first.**"],
        SHORTHAND,
        "$2(a + 3)$ means 2 lots of $a + 3$.",
      ),
      reworded(E1, NOTATION, "What's the difference between $2a$ and $a^2$?", { tag: "The rule" }),

      ...owned(E1, NOTATION, "Warm-up", "Check you remember"),

      methodCard("The method", notationMethod, SHORTHAND),
      workedFrom(E1, NOTATION),
      calc(
        "Your turn",
        "$a = 3$ and $b = 4$.",
        undefined,
        [
          ["$ab =$", "12", "a × b."],
          ["$a^2 =$", "9", "a × a."],
          ["$\\frac{b}{2} =$", "2", "b ÷ 2."],
        ],
        "12, 9 and 2.",
      ),

      calc(
        "Practise",
        "$n = 5$.",
        undefined,
        [
          ["$2n^2 =$", "50", "Square n, then double."],
          ["$(2n)^2 =$", "100", "Double, then square."],
        ],
        "The bracket changes the answer.",
      ),
      ...owned(E1, NOTATION, "Together", "Practise"),
      ...owned(E1, NOTATION, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Write it in algebra. Watch what changes.",
        [
          pick(
            "“Multiply x by 3, then add 1”",
            "$3x + 1$",
            ["$3(x + 1)$", "$x + 3 + 1$"],
            "× first, then +.",
            {
              asks: "expression",
            },
          ),
          pick(
            "“Add 1 to x, then multiply by 3”",
            "$3(x + 1)$",
            ["$3x + 1$", "$x + 4$"],
            "The 3 times all of it.",
            {
              asks: "expression",
              changed: "Order swapped.",
            },
          ),
          pick(
            "“Add 1 to x, then divide by 3”",
            "$\\frac{x + 1}{3}$",
            ["$x + \\frac13$", "$3(x + 1)$"],
            "All of it over 3.",
            {
              asks: "expression",
              changed: "Divide instead.",
            },
          ),
          pick(
            "$5ab$ means",
            "$5 \\times a \\times b$",
            ["$5 + a + b$", "$5a + b$"],
            "Side by side means ×.",
            {
              asks: "meaning",
              changed: "Read it.",
            },
          ),
        ],
        "The order of the steps decides the brackets.",
      ),

      questionSet(
        "Variation",
        "Write it in algebra. Watch the order.",
        [
          pick(
            "“Double x, add 5, then square”",
            "$(2x + 5)^2$",
            ["$2x + 5^2$", "$2x^2 + 5$"],
            "Square all of it.",
            {
              asks: "expression",
              expect: [
                "Kim writes $2x + 5^2$. Right?",
                "No",
                "The square covers all of $2x + 5$: $(2x + 5)^2$.",
                [["Yes", "What does the square cover?"]],
              ],
            },
          ),
          pick(
            "“Square x, double, then add 5”",
            "$2x^2 + 5$",
            ["$(2x + 5)^2$", "$2x + 25$"],
            "Square only x.",
            {
              asks: "expression",
              changed: "Square first.",
            },
          ),
          pick(
            "“Double x, square, then add 5”",
            "$(2x)^2 + 5$",
            ["$2x^2 + 5$", "$(2x + 5)^2$"],
            "Square the 2x.",
            {
              asks: "expression",
              changed: "Square the double.",
            },
          ),
          pick(
            "“Square x, add 5, then double”",
            "$2(x^2 + 5)$",
            ["$2x^2 + 5$", "$(2x + 5)^2$"],
            "Double all of it.",
            {
              asks: "expression",
              changed: "Double last.",
            },
          ),
        ],
        "Brackets show what each step acts on.",
      ),
      own(E1, NOTATION, "Spot the mistake"),

      own(E1, NOTATION, "Exit check"),

      reworded(
        E1,
        NOTATION,
        "“Write an expression for the cost in pounds of $m$ months at £12, plus 5p for each of $t$ texts.”",
        { tag: "Real life", title: "m months at £12, plus 5p a text. Cost in £?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**ab is a × b, a² is a × a, and numbers go first.**"],
        SHORTHAND,
        [
          "**ab is a × b, a² is a × a, and numbers go first.**",
          "$2a$ is $a + a$; $a^2$ is $a \\times a$.",
          "Square all of it: $(2x + 5)^2$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// The words of algebra.

const VOCAB = "gf-expressions-1/vocabulary";
const vocabMethod = [
  "No equals sign: an expression.",
  "True for some values: an equation. Links quantities: a formula.",
  "True for every value, with ≡: an identity.",
];
const WORDS: Picture = {
  kind: "table",
  head: ["Word", "Example"],
  rows: [
    ["Expression", "$3x + 2$"],
    ["Equation", "$3x + 2 = 11$"],
    ["Formula", "$A = lw$"],
    ["Identity", "$2(x + 1) \\equiv 2x + 2$"],
  ],
};

const vocabulary = stepped(find(E1, VOCAB), {
  method: vocabMethod,
  variation: {
    relationship: "the four kinds of algebra statement, and terms",
    unknowns: ["type", "terms"],
    surface: ["each kind", "multiplied parts", "brackets"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "The words of algebra",
        [
          "**Expression: no =. Equation: some values. Formula: links quantities. Identity: every value.**",
        ],
        WORDS,
        "≡ means 'is identical to': true whatever x is.",
      ),
      reworded(E1, VOCAB, "Terms and factors", { tag: "The rule" }),

      ...owned(E1, VOCAB, "Warm-up", "Check you remember"),

      methodCard("The method", vocabMethod, WORDS),
      workedFrom(E1, VOCAB),
      calc(
        "Your turn",
        "Count the terms.",
        undefined,
        [
          ["Terms in $3x^2 - 2x + 7 - y$:", "4", "Parts added or taken away."],
          ["Terms in $4ab - 3$:", "2", "$4ab$ is one term."],
        ],
        "4 and 2.",
      ),

      calc(
        "Practise",
        "Is $3(x + 1) = 3x + 3$ true when $x = 5$?",
        undefined,
        [
          ["Left: $3 \\times 6 =$", "18", "Work out the bracket."],
          ["Right: $15 + 3 =$", "18", "The same."],
        ],
        "True for every x: an identity.",
      ),
      ...owned(E1, VOCAB, "Together", "Practise"),
      ...owned(E1, VOCAB, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Which kind is it? Watch what changes.",
        [
          pick("$5x - 1$", "Expression", ["Equation", "Identity"], "No equals sign.", {
            asks: "type",
          }),
          pick("$5x - 1 = 9$", "Equation", ["Expression", "Identity"], "True for one x.", {
            asks: "type",
            changed: "An equals sign.",
          }),
          pick("$P = 2l + 2w$", "Formula", ["Equation", "Expression"], "It links quantities.", {
            asks: "type",
            changed: "Quantities.",
          }),
          pick("$x + x \\equiv 2x$", "Identity", ["Equation", "Formula"], "True for every x.", {
            asks: "type",
            changed: "Always true.",
          }),
        ],
        "Look for =, ≡, and what it links.",
      ),

      questionSet(
        "Variation",
        "How many terms? Watch what changes.",
        [
          ask("$5a^2 - 2ab + 3$", "3", "Added or taken away.", "3.", {
            asks: "terms",
            expect: [
              "Leah counts $2ab$ as two terms. Right?",
              "No",
              "$2ab$ is one term: its parts are multiplied.",
              [["Yes", "Terms are added or taken away."]],
            ],
          }),
          ask("$5a^2 \\times 2ab$", "1", "All multiplied.", "1.", {
            asks: "terms",
            changed: "Multiplied.",
          }),
          ask("$5a^2 - 2ab + 3 - b$", "4", "One more.", "4.", {
            asks: "terms",
            changed: "One more part.",
          }),
          ask("$5(a + 2)$", "1", "One bracket, times 5.", "1.", {
            asks: "terms",
            changed: "A bracket.",
          }),
        ],
        "Terms are split by + and −, not by ×.",
      ),
      own(E1, VOCAB, "Spot the mistake"),

      own(E1, VOCAB, "Exit check"),

      reworded(
        E1,
        VOCAB,
        "“$3x + 2$, $3x + 2 = 11$, $A = lw$, $2(x+1) \\equiv 2x + 2$.”",
        { tag: "Real life", title: "Label each: E, Q, F or I." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        [
          "**Expression: no =. Equation: some values. Formula: links quantities. Identity: every value.**",
        ],
        WORDS,
        [
          "**Expression: no =. Equation: some values. Formula: links quantities. Identity: every value.**",
          "Terms are split by + and −.",
          "≡ means true for every value.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Collecting like terms.

const LIKE = "gf-expressions-1/like-terms";
const likeMethod = [
  "Find the like terms, each with its sign.",
  "Add or take away their numbers.",
  "Write them out, highest power first.",
];
const TIDY = maths("4x^2 + 3x - x^2 - 7x = 3x^2 - 4x");

const likeTerms = stepped(find(E1, LIKE), {
  method: likeMethod,
  variation: {
    relationship: "like terms collected; unlike terms left apart",
    unknowns: ["simplified"],
    surface: ["unlike letters", "different powers", "minus signs"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Collecting like terms",
        ["**Only like terms collect: the same letters and the same powers.**"],
        TIDY,
        "$x$ and $x^2$ are not like terms.",
      ),
      reworded(E1, LIKE, "Like terms", { tag: "The rule" }),
      reworded(E1, LIKE, "Which are like terms?", { tag: "The rule" }),

      ...owned(E1, LIKE, "Warm-up", "Check you remember"),

      methodCard("The method", likeMethod, TIDY),
      workedFrom(E1, LIKE),
      calc(
        "Your turn",
        "Simplify $5x + 2y - 3x + 4y$.",
        undefined,
        [
          ["x terms: $5x - 3x =$", "2x", "Like terms."],
          ["y terms: $2y + 4y =$", "6y", "Like terms."],
        ],
        "$2x + 6y$.",
      ),

      calc(
        "Practise",
        "Simplify $3a^2 + 2a - a^2 + 5a$.",
        undefined,
        [
          ["$a^2$ terms:", "2a^2", "$3a^2 - a^2$."],
          ["a terms:", "7a", "$2a + 5a$."],
        ],
        "$2a^2 + 7a$.",
      ),
      ...owned(E1, LIKE, "Together", "Practise"),
      ...owned(E1, LIKE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Simplify. Watch what changes.",
        [
          pick("$4p + 3p$", "$7p$", ["$7p^2$", "$12p$"], "Like terms.", { asks: "simplified" }),
          pick("$4p - 3p$", "$p$", ["1", "$7p$"], "4 − 3 is 1.", {
            asks: "simplified",
            changed: "Take away.",
          }),
          pick("$4p + 3q$", "$4p + 3q$", ["$7pq$", "$7p$"], "Unlike terms stay.", {
            asks: "simplified",
            changed: "Different letters.",
          }),
          pick("$4p^2 + 3p$", "$4p^2 + 3p$", ["$7p^3$", "$7p^2$"], "Different powers stay.", {
            asks: "simplified",
            changed: "Different powers.",
          }),
        ],
        "Same letters and powers, or they stay apart.",
      ),

      questionSet(
        "Variation",
        "Simplify. Watch the signs.",
        [
          pick("$5p - 3q - 2p + q$", "$3p - 2q$", ["$3p - 4q$", "$3p + 2q$"], "$-3q + q$.", {
            asks: "simplified",
            expect: [
              "Raj gets $3p - 4q$. Right?",
              "No",
              "$-3q + q = -2q$.",
              [["Yes", "−3 + 1 is −2."]],
            ],
          }),
          pick("$5p - 3q + 2p + q$", "$7p - 2q$", ["$3p - 2q$", "$7p - 4q$"], "$5p + 2p$.", {
            asks: "simplified",
            changed: "Add 2p.",
          }),
          pick("$5p + 3q - 2p - q$", "$3p + 2q$", ["$3p - 2q$", "$3p + 4q$"], "$3q - q$.", {
            asks: "simplified",
            changed: "Plus 3q.",
          }),
          pick("$5p - 3q - 2p - q$", "$3p - 4q$", ["$3p - 2q$", "$7p - 4q$"], "$-3q - q$.", {
            asks: "simplified",
            changed: "Minus q.",
          }),
        ],
        "Each term keeps the sign in front of it.",
      ),
      own(E1, LIKE, "Spot the mistake"),

      own(E1, LIKE, "Exit check"),

      reworded(
        E1,
        LIKE,
        "“The sides are $2x + 3$, $x - 1$, $2x + 3$ and $x - 1$ m. Write the perimeter in its simplest form.”",
        { tag: "Real life", title: "Sides $2x + 3$, $x - 1$, $2x + 3$, $x - 1$. Perimeter?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Only like terms collect: the same letters and the same powers.**"],
        TIDY,
        [
          "**Only like terms collect: the same letters and the same powers.**",
          "$3x + 2$ stays $3x + 2$.",
          "Each term keeps its sign.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Expanding a bracket.

const EXPAND = "gf-expressions-1/expand";
const expandMethod = [
  "Multiply the outside term by each term inside.",
  "Keep each sign with its term.",
  "Collect like terms if there's more than one bracket.",
];
const SIX: Picture = { kind: "table", head: ["×", "x", "3"], rows: [["5", "5x", "15"]] };

const expand = stepped(find(E1, EXPAND), {
  method: expandMethod,
  variation: {
    relationship: "a bracket and its expansion",
    unknowns: ["expanded"],
    surface: ["negatives outside", "negatives inside", "a letter outside"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Expanding a bracket",
        ["**Multiply every term inside by the term outside.**"],
        SIX,
        "$5(x + 3) = 5x + 15$.",
      ),
      reworded(E1, EXPAND, "Everything inside", { tag: "The rule" }),
      reworded(E1, EXPAND, "Expand $a(a + 3)$", { tag: "The rule" }),

      ...owned(E1, EXPAND, "Warm-up", "Check you remember"),

      methodCard("The method", expandMethod, SIX),
      workedFrom(E1, EXPAND),
      calc(
        "Your turn",
        "Expand $4(2x - 5)$.",
        undefined,
        [
          ["$4 \\times 2x =$", "8x", "The first term."],
          ["$4 \\times -5 =$", "-20", "The second, with its sign."],
        ],
        "$8x - 20$.",
      ),

      calc(
        "Practise",
        "Expand and simplify $2(x + 4) - 3(x - 1)$.",
        undefined,
        [
          ["$2x + 8 - 3x +$", "3", "$-3 \\times -1$."],
          ["Simplified: $-x +$", "11", "8 + 3."],
        ],
        "$11 - x$.",
      ),
      ...owned(E1, EXPAND, "Together", "Practise"),
      ...owned(E1, EXPAND, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Expand. Watch what changes.",
        [
          pick("$3(x + 4)$", "$3x + 12$", ["$3x + 4$", "$3x + 7$"], "3 × each term.", {
            asks: "expanded",
          }),
          pick("$-3(x + 4)$", "$-3x - 12$", ["$-3x + 12$", "$3x - 12$"], "−3 × each term.", {
            asks: "expanded",
            changed: "A negative outside.",
          }),
          pick("$-3(x - 4)$", "$-3x + 12$", ["$-3x - 12$", "$3x + 12$"], "−3 × −4 = +12.", {
            asks: "expanded",
            changed: "Negatives both.",
          }),
          pick("$x(x - 4)$", "$x^2 - 4x$", ["$2x - 4$", "$x^2 - 4$"], "x × each term.", {
            asks: "expanded",
            changed: "A letter outside.",
          }),
        ],
        "Every term, with its sign.",
      ),

      questionSet(
        "Variation",
        "Expand and simplify. Watch the signs.",
        [
          pick("$10 - 2(x - 3)$", "$16 - 2x$", ["$4 - 2x$", "$7 - 2x$"], "−2 × −3 = +6.", {
            asks: "expanded",
            expect: [
              "Tom gets $4 - 2x$. Right?",
              "No",
              "$-2 \\times -3 = +6$: $10 + 6 - 2x$.",
              [["Yes", "Negative times negative."]],
            ],
          }),
          pick("$10 + 2(x - 3)$", "$2x + 4$", ["$2x + 16$", "$2x + 7$"], "$10 + 2x - 6$.", {
            asks: "expanded",
            changed: "Plus, not minus.",
          }),
          pick("$10 - 2(x + 3)$", "$4 - 2x$", ["$16 - 2x$", "$7 - 2x$"], "$10 - 2x - 6$.", {
            asks: "expanded",
            changed: "Plus inside.",
          }),
          pick("$10 - (x - 3)$", "$13 - x$", ["$7 - x$", "$13 + x$"], "$10 - x + 3$.", {
            asks: "expanded",
            changed: "Just a minus.",
          }),
        ],
        "A minus outside changes every sign inside.",
      ),
      own(E1, EXPAND, "Spot the mistake"),

      own(E1, EXPAND, "Exit check"),

      reworded(
        E1,
        EXPAND,
        "“Write an expression, without brackets, for the cost of 6 tickets at £$(x + 4)$.”",
        { tag: "Real life", title: "6 tickets at £$(x + 4)$, without brackets." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Multiply every term inside by the term outside.**"],
        SIX,
        [
          "**Multiply every term inside by the term outside.**",
          "$3(x + 4) = 3x + 12$, not $3x + 4$.",
          "$-2(a - 5) = -2a + 10$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Factorising.

const FACTORISE = "gf-expressions-1/factorise";
const factMethod = [
  "Find the HCF of the numbers and of the letters.",
  "Write it outside the bracket.",
  "Inside: each term divided by it. Expand to check.",
];
const BACK = maths("18x + 24 = 6(3x + 4)");

const factorise = stepped(find(E1, FACTORISE), {
  method: factMethod,
  variation: {
    relationship: "an expression and its highest common factor taken out",
    unknowns: ["HCF", "factorised"],
    surface: ["letters in the HCF", "minus signs", "a 1 left inside"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Factorising",
        ["**Take out the highest common factor; check by expanding.**"],
        BACK,
        "Factorising is expanding backwards.",
      ),
      reworded(E1, FACTORISE, "Expand backwards", { tag: "The rule" }),
      reworded(E1, FACTORISE, "The HCF of $6a$ and $9a^2$ is", { tag: "The rule" }),

      ...owned(E1, FACTORISE, "Warm-up", "Check you remember"),

      methodCard("The method", factMethod, BACK),
      workedFrom(E1, FACTORISE),
      calc(
        "Your turn",
        "Factorise fully $15x + 10$.",
        undefined,
        [
          ["HCF:", "5", "Of 15 and 10."],
          ["Inside: $3x +$", "2", "10 ÷ 5."],
        ],
        "$5(3x + 2)$.",
      ),

      calc(
        "Practise",
        "Factorise fully $8y^2 - 12y$.",
        undefined,
        [
          ["HCF:", "4y", "4 and y."],
          ["Inside: $2y -$", "3", "12y ÷ 4y."],
        ],
        "$4y(2y - 3)$.",
      ),
      ...owned(E1, FACTORISE, "Together", "Practise"),
      ...owned(E1, FACTORISE, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Factorise fully. Watch what changes.",
        [
          ask("The HCF of $12x$ and 18?", "6", "The biggest number into both.", "6.", {
            asks: "HCF",
          }),
          pick("$12x + 18$", "$6(2x + 3)$", ["$2(6x + 9)$", "$3(4x + 6)$"], "Take out 6.", {
            asks: "factorised",
            changed: "Now factorise.",
          }),
          pick(
            "$12x^2 + 18x$",
            "$6x(2x + 3)$",
            ["$6(2x^2 + 3x)$", "$x(12x + 18)$"],
            "Take out 6x.",
            {
              asks: "factorised",
              changed: "x in both.",
            },
          ),
          pick("$12x - 18$", "$6(2x - 3)$", ["$6(2x + 3)$", "$2(6x - 9)$"], "Keep the minus.", {
            asks: "factorised",
            changed: "A minus.",
          }),
        ],
        "The biggest factor, numbers and letters.",
      ),

      questionSet(
        "Variation",
        "Factorise fully. Watch what changes.",
        [
          pick("$5a + 5$", "$5(a + 1)$", ["$5(a + 0)$", "$5a(1 + 1)$"], "5 ÷ 5 = 1.", {
            asks: "factorised",
            expect: [
              "Kai factorises $5a + 5$ as $5(a + 0)$. Right?",
              "No",
              "$5 \\div 5 = 1$: $5(a + 1)$.",
              [["Yes", "Expand to check."]],
            ],
          }),
          pick("$5a + 10$", "$5(a + 2)$", ["$5(a + 10)$", "$a(5 + 10)$"], "10 ÷ 5 = 2.", {
            asks: "factorised",
            changed: "10, not 5.",
          }),
          pick("$5a^2 + 10a$", "$5a(a + 2)$", ["$5(a^2 + 2a)$", "$a(5a + 10)$"], "Take out 5a.", {
            asks: "factorised",
            changed: "Letters too.",
          }),
          pick("$5a^2 + a$", "$a(5a + 1)$", ["$5a(a + 1)$", "$a(5a)$"], "Take out a.", {
            asks: "factorised",
            changed: "Only a in common.",
          }),
        ],
        "Expand your answer to check it.",
      ),
      own(E1, FACTORISE, "Spot the mistake"),

      own(E1, FACTORISE, "Exit check"),

      reworded(
        E1,
        FACTORISE,
        "“Factorise fully $12x + 20$.”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Take out the highest common factor; check by expanding.**"],
        BACK,
        [
          "**Take out the highest common factor; check by expanding.**",
          "Fully: $6(2x + 3)$, not $2(6x + 9)$.",
          "$5a + 5 = 5(a + 1)$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

export const gfExpressionsStepped: [string, UnitLesson[]][] = [
  [NOTATION, [notation]],
  [VOCAB, [vocabulary]],
  [LIKE, [likeTerms]],
  [EXPAND, [expand]],
  [FACTORISE, [factorise]],
];
