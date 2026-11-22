// Year 9, "Factorising and proof", on the stepped template (docs/proposals/lesson-stepped.md):
// factorising x² + bx + c with positive and negative numbers, and proving with algebra. Algebra is
// its own picture; the expansion grid shows where b and c come from.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";
import { y9Factorising } from "./y9-factorising.ts";

const F = y9Factorising;
const ALGEBRA = "Algebra: the expression is the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const grid = (side: string[], top: string[], cells: string[][]): Picture => ({
  kind: "table",
  head: ["×", ...top],
  rows: side.map((s, i) => [s, ...(cells[i] ?? [])]),
});
const factorise = (tex: string, right: string, others: string[], extra: Record<string, unknown>) =>
  ask(`Factorise ${tex}.`, right, "Multiply to c, add to b.", `${right}.`, {
    asks: "factorised",
    others,
    ...extra,
  });

// ---------------------------------------------------------------------------------------------
// Positive numbers.

const POS = "y9-factorising/positive";
const posMethod = [
  "List the pairs that multiply to c.",
  "Pick the pair that adds to b.",
  "Write the brackets, and expand to check.",
];
const GRID_POS = grid(
  ["x", "2"],
  ["x", "3"],
  [
    ["x²", "3x"],
    ["2x", "6"],
  ],
);

const positive = stepped(find(F, POS), {
  method: posMethod,
  variation: {
    relationship: "x² + bx + c and the two numbers that multiply to c and add to b",
    unknowns: ["pair", "factorised"],
    surface: ["bigger b", "smaller b", "a perfect square"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Back into brackets",
        ["**Find two numbers that multiply to c and add to b.**"],
        GRID_POS,
        "$x^2 + 5x + 6$: 2 × 3 = 6 and 2 + 3 = 5.",
      ),
      reworded(F, POS, "Look inside the grid", { tag: "The rule" }),

      reworded(F, POS, "Expand $(x + 2)(x + 3)$", { tag: "Check you remember" }),
      reworded(F, POS, "A number puzzle", {
        tag: "Check you remember",
        text: "Multiply to 10, add to 7. The bigger one?",
      }),

      methodCard("The method", posMethod, GRID_POS),
      workedFrom(F, POS),
      calc(
        "Your turn",
        "Factorise $x^2 + 9x + 18$.",
        undefined,
        [
          ["Multiply to 18, add to 9. The smaller:", "3", "Try 1 and 18, 2 and 9, 3 and 6."],
          ["The bigger:", "6", "3 + 6 = 9."],
        ],
        "$(x + 3)(x + 6)$.",
      ),

      calc(
        "Practise",
        "Factorise $x^2 + 8x + 15$.",
        undefined,
        [
          ["The smaller number:", "3", "Multiply to 15, add to 8."],
          ["The bigger:", "5", "3 + 5 = 8."],
        ],
        "$(x + 3)(x + 5)$.",
      ),
      ...owned(F, POS, "Together", "Practise"),
      ...owned(F, POS, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Factorise each one. Watch what changes.",
        [
          factorise(
            "$x^2 + 7x + 6$",
            "$(x + 1)(x + 6)$",
            ["$(x + 2)(x + 3)$", "$(x + 7)(x + 6)$"],
            {},
          ),
          factorise(
            "$x^2 + 5x + 6$",
            "$(x + 2)(x + 3)$",
            ["$(x + 1)(x + 6)$", "$(x + 5)(x + 1)$"],
            {
              changed: "Same c, smaller b.",
            },
          ),
          ask("Multiply to 24, add to 10?", "4 and 6", "Try the pairs for 24.", "4 and 6.", {
            asks: "pair",
            changed: "Just the pair.",
            others: ["3 and 8", "2 and 12"],
          }),
          factorise(
            "$x^2 + 10x + 24$",
            "$(x + 4)(x + 6)$",
            ["$(x + 3)(x + 8)$", "$(x + 2)(x + 12)$"],
            {
              changed: "Use that pair.",
            },
          ),
        ],
        "Multiply to c; add to b.",
      ),

      questionSet(
        "Variation",
        "c is 18. Watch b change.",
        [
          factorise(
            "$x^2 + 11x + 18$",
            "$(x + 2)(x + 9)$",
            ["$(x + 3)(x + 6)$", "$(x + 1)(x + 18)$"],
            {
              expect: [
                "Will $x^2 + 11x + 18$ be $(x + 3)(x + 6)$?",
                "No",
                "3 + 6 = 9, not 11: use 2 and 9.",
                [["Yes", "Check they add to 11."]],
              ],
            },
          ),
          factorise(
            "$x^2 + 19x + 18$",
            "$(x + 1)(x + 18)$",
            ["$(x + 2)(x + 9)$", "$(x + 3)(x + 6)$"],
            {
              changed: "b gets bigger.",
            },
          ),
          factorise(
            "$x^2 + 9x + 18$",
            "$(x + 3)(x + 6)$",
            ["$(x + 2)(x + 9)$", "$(x + 1)(x + 18)$"],
            {
              changed: "b gets smaller.",
            },
          ),
          factorise("$x^2 + 6x + 9$", "$(x + 3)^2$", ["$(x + 9)(x + 1)$", "$(x + 6)(x + 3)$"], {
            changed: "Both numbers the same.",
          }),
        ],
        "The same c can give different b: the pair decides.",
      ),
      own(F, POS, "Spot the mistake"),

      own(F, POS, "Exit check"),

      reworded(F, POS, "The missing sides", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Find two numbers that multiply to c and add to b.**"],
        GRID_POS,
        [
          "**Find two numbers that multiply to c and add to b.**",
          "$x^2 + 7x + 10 = (x + 2)(x + 5)$.",
          "Expand to check.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Negative numbers.

const NEG = "y9-factorising/negatives";
const negMethod = [
  "c positive: same signs, the sign of b. c negative: different signs.",
  "Find the pair that multiplies to c and adds to b.",
  "Write the brackets; expand to check the signs.",
];
const GRID_NEG = grid(
  ["x", "3"],
  ["x", "−4"],
  [
    ["x²", "−4x"],
    ["3x", "−12"],
  ],
);

const negatives = stepped(find(F, NEG), {
  method: negMethod,
  variation: {
    relationship: "the signs of b and c decide the signs in the brackets",
    unknowns: ["pair", "factorised"],
    surface: ["c negative", "b negative", "both positive"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Brackets with negatives",
        ["**c positive: same signs. c negative: different signs.**"],
        GRID_NEG,
        "$x^2 - x - 12 = (x - 4)(x + 3)$: the bigger takes b's sign.",
      ),
      reworded(F, NEG, "Two numbers multiply to −12. So", { tag: "The rule" }),

      ...owned(F, NEG, "Warm-up", "Check you remember"),

      methodCard("The method", negMethod, GRID_NEG),
      workedFrom(F, NEG),
      calc(
        "Your turn",
        "Factorise $x^2 - 9x + 20$.",
        undefined,
        [
          ["Both negative. The first:", "-4", "Multiply to 20, add to −9."],
          ["The second:", "-5", "−4 + −5 = −9."],
        ],
        "$(x - 4)(x - 5)$.",
      ),

      calc(
        "Practise",
        "Factorise $x^2 + 4x - 12$.",
        undefined,
        [
          ["Different signs. The positive one:", "6", "The bigger takes b's sign."],
          ["The negative one:", "-2", "6 + −2 = 4."],
        ],
        "$(x + 6)(x - 2)$.",
      ),
      ...owned(F, NEG, "Together", "Practise"),
      ...owned(F, NEG, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Factorise each one. Watch what changes.",
        [
          factorise(
            "$x^2 - 7x + 12$",
            "$(x - 3)(x - 4)$",
            ["$(x + 3)(x + 4)$", "$(x - 3)(x + 4)$"],
            {},
          ),
          factorise(
            "$x^2 + x - 12$",
            "$(x + 4)(x - 3)$",
            ["$(x - 4)(x + 3)$", "$(x + 4)(x + 3)$"],
            {
              changed: "c is negative.",
            },
          ),
          factorise(
            "$x^2 - 4x - 12$",
            "$(x - 6)(x + 2)$",
            ["$(x + 6)(x - 2)$", "$(x - 6)(x - 2)$"],
            {
              changed: "b is negative too.",
            },
          ),
          ask("Multiply to −20, add to 1?", "5 and −4", "Different signs.", "5 and −4.", {
            asks: "pair",
            changed: "Just the pair.",
            others: ["−5 and 4", "10 and −2"],
          }),
        ],
        "Read the signs first.",
      ),

      questionSet(
        "Variation",
        "Factorise each one. Watch the signs.",
        [
          factorise(
            "$x^2 - 2x - 8$",
            "$(x - 4)(x + 2)$",
            ["$(x + 4)(x - 2)$", "$(x - 4)(x - 2)$"],
            {
              expect: [
                "Lee says $x^2 - 2x - 8$ is $(x + 4)(x - 2)$. Right?",
                "No",
                "That expands to $x^2 + 2x - 8$: the bigger number needs b's sign.",
                [["Yes", "Expand it to check."]],
              ],
            },
          ),
          factorise(
            "$x^2 + 2x - 8$",
            "$(x + 4)(x - 2)$",
            ["$(x - 4)(x + 2)$", "$(x + 4)(x + 2)$"],
            {
              changed: "b is positive.",
            },
          ),
          factorise(
            "$x^2 - 6x + 8$",
            "$(x - 2)(x - 4)$",
            ["$(x + 2)(x + 4)$", "$(x - 2)(x + 4)$"],
            {
              changed: "c is positive.",
            },
          ),
          factorise(
            "$x^2 + 6x + 8$",
            "$(x + 2)(x + 4)$",
            ["$(x - 2)(x - 4)$", "$(x + 2)(x - 4)$"],
            {
              changed: "Both positive.",
            },
          ),
        ],
        "c's sign: same or different. b's sign: which way round.",
      ),
      own(F, NEG, "Spot the mistake"),

      own(F, NEG, "Exit check"),

      reworded(F, NEG, "A cropped photo", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**c positive: same signs. c negative: different signs.**"],
        GRID_NEG,
        [
          "**c positive: same signs. c negative: different signs.**",
          "The bigger number takes the sign of b.",
          "$x^2 - x - 12 = (x - 4)(x + 3)$.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

// ---------------------------------------------------------------------------------------------
// Algebra proves it.

const PROOF = "y9-factorising/proof";
const proofMethod = [
  "Write the numbers in algebra: n, 2n, 2n + 1.",
  "Simplify.",
  "Show the form you need: 3( ), 2( ) or 2( ) + 1.",
];
const PROOF_PIC = maths("n + (n + 1) + (n + 2) = 3(n + 1)");

const proof = stepped(find(F, PROOF), {
  method: proofMethod,
  variation: {
    relationship: "an expression and the form that proves the pattern",
    unknowns: ["expression", "proof"],
    surface: ["odd and even", "multiples of 3", "multiples of 4"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Algebra proves it",
        ["**Call any number n, then simplify to show why it's always true.**"],
        PROOF_PIC,
        "Checking examples is never enough: n covers every number.",
      ),
      reworded(F, PROOF, "Let n be any number", { tag: "The rule" }),
      reworded(F, PROOF, "How can we write any even number?", {
        tag: "The rule",
        title: "Write any even number.",
        text: "2, 4, 6, 8, …",
      }),

      ...owned(F, PROOF, "Warm-up", "Check you remember"),

      methodCard("The method", proofMethod, PROOF_PIC),
      workedFrom(F, PROOF),
      calc(
        "Your turn",
        "Prove five numbers in a row make a multiple of 5.",
        undefined,
        [
          ["$n + (n + 1) + \\ldots + (n + 4) = 5n +$", "10", "Collect the numbers."],
          ["$5n + 10 = 5(n +$", "2", "Take out the 5.", { after: ")" }],
        ],
        "$5(n + 2)$: always a multiple of 5.",
      ),

      calc(
        "Practise",
        "Prove two odd numbers add to an even number.",
        undefined,
        [
          ["$(2a + 1) + (2b + 1) = 2a + 2b +$", "2", "Collect the numbers."],
          ["$= 2(a + b +$", "1", "Take out the 2.", { after: ")" }],
        ],
        "$2(a + b + 1)$: always even.",
      ),
      ...owned(F, PROOF, "Together", "Practise"),
      reworded(F, PROOF, "Even × odd", {
        tag: "Practise",
        text: "$2a(2b + 1)$: even times odd. So it is",
      }),
      reworded(F, PROOF, "Two even numbers, $2a$ and $2b$, added", { tag: "Practise" }),
      questionSet(
        "Practise",
        "Write it in algebra. Watch what changes.",
        [
          ask("Any even number?", "$2n$", "Twice a whole number.", "$2n$.", {
            asks: "expression",
            others: ["$n + 2$", "$n^2$"],
          }),
          ask("Any odd number?", "$2n + 1$", "One more than even.", "$2n + 1$.", {
            asks: "expression",
            changed: "Odd.",
            others: ["$n + 1$", "$2n$"],
          }),
          ask("Any multiple of 5?", "$5n$", "5 times a whole number.", "$5n$.", {
            asks: "expression",
            changed: "Multiples of 5.",
            others: ["$n + 5$", "$n^5$"],
          }),
          ask(
            "Three numbers in a row?",
            "$n$, $n + 1$, $n + 2$",
            "One more each time.",
            "$n$, $n + 1$, $n + 2$.",
            {
              asks: "expression",
              changed: "In a row.",
              others: ["$n$, $2n$, $3n$", "$n$, $n + 2$, $n + 4$"],
            },
          ),
        ],
        "n stands for any whole number.",
      ),

      questionSet(
        "Variation",
        "Why is it always true? Watch what changes.",
        [
          ask(
            "$4n + 8$ is a multiple of 4 because it equals",
            "$4(n + 2)$",
            "Take out the 4.",
            "$4(n + 2)$.",
            {
              asks: "proof",
              others: ["$4n \\times 8$", "$12n$"],
              expect: [
                "Sam checks three cases and they work. Is that a proof?",
                "No",
                "Checking cases isn't a proof: algebra covers them all.",
                [["Yes", "There are endless cases."]],
              ],
            },
          ),
          ask(
            "$6n + 9$ is a multiple of 3 because it equals",
            "$3(2n + 3)$",
            "Take out the 3.",
            "$3(2n + 3)$.",
            {
              asks: "proof",
              changed: "A multiple of 3.",
              others: ["$6(n + 9)$", "$15n$"],
            },
          ),
          ask(
            "$2n + 2$ is always even because it equals",
            "$2(n + 1)$",
            "Take out the 2.",
            "$2(n + 1)$.",
            {
              asks: "proof",
              changed: "Even.",
              others: ["$4n$", "$2n \\times 2$"],
            },
          ),
          ask(
            "$2n + 3$ is always odd because it equals",
            "$2(n + 1) + 1$",
            "Even, plus 1.",
            "$2(n + 1) + 1$.",
            {
              asks: "proof",
              changed: "Odd.",
              others: ["$2(n + 3)$", "$3(n + 1)$"],
            },
          ),
        ],
        "Show the form: a number times a bracket, or that plus 1.",
      ),
      reworded(
        F,
        PROOF,
        "Where did it go wrong?",
        { text: "Mia proves three numbers in a row make a multiple of 3." },
        "Spot the mistake",
      ),

      own(F, PROOF, "Exit check"),

      reworded(F, PROOF, "A mind-reading trick", { tag: "Real life" }, "Back to the problem"),

      summary(
        "What to remember",
        ["**Call any number n, then simplify to show why it's always true.**"],
        PROOF_PIC,
        [
          "**Call any number n, then simplify to show why it's always true.**",
          "Even: $2n$. Odd: $2n + 1$. In a row: $n$, $n + 1$, $n + 2$.",
          "Examples aren't a proof.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    ALGEBRA,
  ),
});

export const y9FactorisingStepped: [string, UnitLesson[]][] = [
  [POS, [positive]],
  [NEG, [negatives]],
  [PROOF, [proof]],
];
