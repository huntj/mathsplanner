// GCSE Foundation, "Factors, multiples and primes", on the stepped template
// (docs/proposals/lesson-stepped.md): factors and primes as rectangles of squares, products of
// prime factors, the HCF and LCM in a Venn diagram, and listing systematically on a grid.
import { ask, calc, explain, methodCard, questionSet, summary } from "./build.ts";
import { gfFactors } from "./gf-factors.ts";
import { find, own, owned, reworded, stepped, worded, workedFrom } from "./stepped.ts";
import type { Picture, UnitLesson } from "./types.ts";

const FA = gfFactors;
const NUMBER = "A number fact: the numbers are the picture.";
const maths = (tex: string): Picture => ({ kind: "maths", tex });
const rect = (cols: number, rows: number): Picture => ({
  kind: "grid",
  cols,
  rows,
  shaded: cols * rows,
});
const venn = (a: string, b: string, onlyA: string[], both: string[], onlyB: string[]): Picture => ({
  kind: "venn",
  a,
  b,
  onlyA,
  both,
  onlyB,
});
const pick = (
  prompt: string,
  right: string,
  others: string[],
  hint: string,
  extra: Record<string, unknown>,
) => ask(prompt, right, hint, `${right}.`, { others, ...extra });

// ---------------------------------------------------------------------------------------------
// Primes, factors and multiples.

const PRIMES = "gf-factors/primes";
const primesMethod = [
  "Factors: find the pairs that multiply to it.",
  "Multiples: go up its times table.",
  "Prime: exactly two factors, 1 and itself.",
];
const TWELVE = rect(4, 3);
const PRIME_OR_NOT = ["Prime", "Not prime"];

const primes = stepped(find(FA, PRIMES), {
  method: primesMethod,
  variation: {
    relationship: "a number and the pairs that multiply to it",
    unknowns: ["prime", "factors"],
    surface: ["odd numbers", "squares", "primes", "1 and 2"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Three words",
        [
          "**Factors divide it. Multiples are in its times table. Primes have exactly two factors.**",
        ],
        TWELVE,
        "12 makes three rectangles; a prime makes only one.",
      ),
      reworded(FA, PRIMES, "Is 21 prime?", { tag: "The rule" }),

      ...owned(FA, PRIMES, "Warm-up", "Check you remember"),

      methodCard("The method", primesMethod, TWELVE),
      workedFrom(FA, PRIMES),
      calc(
        "Your turn",
        "The factors of 18, in pairs.",
        rect(6, 3),
        [
          ["$1 \\times$", "18", "Always start with 1."],
          ["$2 \\times$", "9", "18 ÷ 2."],
          ["$3 \\times$", "6", "18 ÷ 3."],
        ],
        "1, 2, 3, 6, 9 and 18.",
      ),

      calc(
        "Practise",
        "The factors of 28, in pairs.",
        rect(7, 4),
        [
          ["$1 \\times$", "28", "Always start with 1."],
          ["$2 \\times$", "14", "28 ÷ 2."],
          ["$4 \\times$", "7", "3 doesn't go; try 4."],
        ],
        "1, 2, 4, 7, 14 and 28.",
      ),
      ...owned(FA, PRIMES, "Together", "Practise"),
      ...owned(FA, PRIMES, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Prime or not? Watch what changes.",
        [
          pick("Is 13 prime?", "Prime", PRIME_OR_NOT.slice(1), "Only one rectangle.", {
            asks: "prime",
            picture: rect(13, 1),
          }),
          pick("Is 15 prime?", "Not prime", PRIME_OR_NOT.slice(0, 1), "3 × 5.", {
            asks: "prime",
            changed: "Odd, but not prime.",
            picture: rect(5, 3),
          }),
          pick("Is 2 prime?", "Prime", PRIME_OR_NOT.slice(1), "Factors 1 and 2.", {
            asks: "prime",
            changed: "Even.",
            picture: rect(2, 1),
          }),
          pick("Is 1 prime?", "Not prime", PRIME_OR_NOT.slice(0, 1), "Only one factor.", {
            asks: "prime",
            changed: "Just 1.",
            picture: rect(1, 1),
          }),
        ],
        "Exactly two factors: no more, no fewer.",
      ),

      questionSet(
        "Variation",
        "List the factors. Watch what changes.",
        [
          pick(
            "Factors of 20",
            "1, 2, 4, 5, 10, 20",
            ["2, 4, 5, 10", "1, 2, 4, 5, 10"],
            "Start with 1 × 20.",
            {
              asks: "factors",
              expect: [
                "Max lists 2, 4, 5, 10 for 20. Right?",
                "No",
                "1 and 20 are factors too.",
                [["Yes", "Does 1 divide 20?"]],
              ],
            },
          ),
          pick("Factors of 21", "1, 3, 7, 21", ["3, 7", "1, 21"], "3 × 7.", {
            asks: "factors",
            changed: "Odd.",
          }),
          pick("Factors of 23", "1, 23", ["1, 3, 23", "23"], "Nothing else divides it.", {
            asks: "factors",
            changed: "A prime.",
          }),
          pick("Factors of 25", "1, 5, 25", ["1, 5, 5, 25", "5"], "5 × 5: write 5 once.", {
            asks: "factors",
            changed: "A square.",
          }),
        ],
        "1 and the number itself are always factors.",
      ),
      own(FA, PRIMES, "Spot the mistake"),

      own(FA, PRIMES, "Exit check"),

      reworded(
        FA,
        PRIMES,
        "“From 9, 12, 17, 21, 24, 29, write down the prime numbers.”",
        { tag: "Real life", title: "Which are prime: 9, 12, 17, 21, 24, 29?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        [
          "**Factors divide it. Multiples are in its times table. Primes have exactly two factors.**",
        ],
        TWELVE,
        [
          "**Factors divide it. Multiples are in its times table. Primes have exactly two factors.**",
          "1 is not prime; 2 is the only even prime.",
          "List factors in pairs, starting 1 × the number.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Products of prime factors.

const PRODUCT = "gf-factors/prime-factors";
const productMethod = [
  "Split into any two factors.",
  "Keep splitting until every branch is prime.",
  "Multiply the primes, smallest first, with powers.",
];
const FIFTY = maths("50 = 2 \\times 5 \\times 5 = 2 \\times 5^2");

const primeFactors = stepped(find(FA, PRODUCT), {
  method: productMethod,
  variation: {
    relationship: "a number and its prime factors",
    unknowns: ["product"],
    surface: ["doubling", "odd numbers", "squares"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "A factor tree",
        ["**Split until every branch is prime; write repeats as powers.**"],
        FIFTY,
        "Every number splits into primes in only one way.",
      ),
      reworded(FA, PRODUCT, "Grow the tree for 60", { tag: "The rule" }),

      ...owned(FA, PRODUCT, "Warm-up", "Check you remember"),

      methodCard("The method", productMethod, FIFTY),
      workedFrom(FA, PRODUCT),
      calc(
        "Your turn",
        "Write 40 as a product of primes.",
        undefined,
        [
          ["$40 = 2 \\times 2 \\times 2 \\times$", "5", "40 ÷ 8."],
          ["$2 \\times 2 \\times 2 = 2^n$, so $n =$", "3", "Three 2s."],
        ],
        "$40 = 2^3 \\times 5$.",
      ),

      calc(
        "Practise",
        "Work out $2^3 \\times 3 \\times 5$.",
        undefined,
        [
          ["$2^3 =$", "8", "2 × 2 × 2."],
          ["$8 \\times 3 \\times 5 =$", "120", "8 × 15."],
        ],
        "$2^3 \\times 3 \\times 5 = 120$.",
      ),
      ...owned(FA, PRODUCT, "Together", "Practise"),
      ...owned(FA, PRODUCT, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "As a product of primes. Watch what changes.",
        [
          pick(
            "$12 =$",
            "$2^2 \\times 3$",
            ["$2 \\times 6$", "$3 \\times 4$"],
            "6 and 4 aren't prime.",
            {
              asks: "product",
            },
          ),
          pick("$24 =$", "$2^3 \\times 3$", ["$2^2 \\times 6$", "$3 \\times 8$"], "One more 2.", {
            asks: "product",
            changed: "Doubled.",
          }),
          pick("$48 =$", "$2^4 \\times 3$", ["$2^3 \\times 6$", "$3 \\times 16$"], "One more 2.", {
            asks: "product",
            changed: "Doubled again.",
          }),
          pick("$45 =$", "$3^2 \\times 5$", ["$9 \\times 5$", "$3 \\times 15$"], "9 = 3 × 3.", {
            asks: "product",
            changed: "Odd.",
          }),
        ],
        "Doubling adds one more 2.",
      ),

      questionSet(
        "Variation",
        "As a product of primes. Watch what changes.",
        [
          pick(
            "$90 =$",
            "$2 \\times 3^2 \\times 5$",
            ["$3^2 \\times 10$", "$2 \\times 3^2 \\times 5 \\times 10$"],
            "Split the 10 too.",
            {
              asks: "product",
              expect: [
                "Ola writes $90 = 3^2 \\times 2 \\times 5 \\times 10$. Right?",
                "No",
                "The 10 is already split into $2 \\times 5$.",
                [["Yes", "Multiply it out: is it 90?"]],
              ],
            },
          ),
          pick(
            "$180 =$",
            "$2^2 \\times 3^2 \\times 5$",
            ["$2 \\times 3^2 \\times 10$", "$2 \\times 3^2 \\times 5$"],
            "One more 2.",
            {
              asks: "product",
              changed: "Doubled.",
            },
          ),
          pick(
            "$900 =$",
            "$2^2 \\times 3^2 \\times 5^2$",
            ["$2 \\times 3^2 \\times 5 \\times 10$", "$9 \\times 100$"],
            "10 is 2 × 5.",
            { asks: "product", changed: "× 10." },
          ),
          pick("$9 =$", "$3^2$", ["$3 \\times 3 \\times 1$", "$9$"], "1 isn't prime.", {
            asks: "product",
            changed: "Just the nine.",
          }),
        ],
        "Only primes, with every one counted once.",
      ),
      own(FA, PRODUCT, "Spot the mistake"),

      own(FA, PRODUCT, "Exit check"),

      reworded(
        FA,
        PRODUCT,
        "“Write 360 as a product of its prime factors in index form.”",
        { tag: "Real life", title: "Write 360 as a product of primes, in index form." },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**Split until every branch is prime; write repeats as powers.**"],
        FIFTY,
        [
          "**Split until every branch is prime; write repeats as powers.**",
          "$72 = 2^3 \\times 3^2$, not $8 \\times 9$.",
          "Multiply back to check.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// HCF and LCM.

const HCF_LCM = "gf-factors/hcf-lcm";
const hcfMethod = [
  "Write each number as primes.",
  "Shared primes go in the middle of a Venn.",
  "HCF: multiply the middle. LCM: multiply everything.",
];
const SHARED = venn("20", "30", ["2 "], ["2", "5"], ["3"]);

const hcfLcm = stepped(find(FA, HCF_LCM), {
  method: hcfMethod,
  variation: {
    relationship: "two numbers, their highest common factor and lowest common multiple",
    unknowns: ["HCF", "LCM"],
    surface: ["shared factors", "no shared factors", "one dividing the other"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Prime factors in a Venn",
        ["**HCF: multiply the shared primes. LCM: multiply all of them.**"],
        SHARED,
        "Here the HCF is 2 × 5 = 10.",
      ),

      ...owned(FA, HCF_LCM, "Warm-up", "Check you remember"),

      methodCard("The method", hcfMethod, SHARED),
      workedFrom(FA, HCF_LCM),
      calc(
        "Your turn",
        "Use the Venn diagram.",
        SHARED,
        [
          ["HCF =", "10", "The middle: 2 × 5."],
          ["LCM =", "60", "Everything: 2 × 2 × 5 × 3."],
        ],
        "HCF 10, LCM 60.",
      ),

      calc(
        "Practise",
        "Find the HCF and LCM.",
        venn("28", "42", ["2 "], ["2", "7"], ["3"]),
        [
          ["HCF =", "14", "The middle: 2 × 7."],
          ["LCM =", "84", "Everything: 2 × 2 × 7 × 3."],
        ],
        "HCF 14, LCM 84.",
      ),
      ...owned(FA, HCF_LCM, "Together", "Practise"),
      ...owned(FA, HCF_LCM, "Your turn", "Practise"),
      questionSet(
        "Practise",
        "Find each one. Watch what changes.",
        [
          ask("HCF of 12 and 16?", "4", "The biggest number into both.", "4.", { asks: "HCF" }),
          ask("LCM of 12 and 16?", "48", "The first in both tables.", "48.", {
            asks: "LCM",
            changed: "LCM now.",
          }),
          ask("HCF of 12 and 24?", "12", "12 goes into 24.", "12.", {
            asks: "HCF",
            changed: "One divides the other.",
          }),
          ask("LCM of 7 and 9?", "63", "No shared factors: multiply.", "63.", {
            asks: "LCM",
            changed: "No shared factors.",
          }),
        ],
        "HCF divides both; LCM is in both tables.",
      ),

      questionSet(
        "Variation",
        "Find the LCM. Watch what changes.",
        [
          ask("LCM of 6 and 8?", "24", "Go up the 8 times table.", "24.", {
            asks: "LCM",
            expect: [
              "Ben says the LCM of 6 and 8 is 48. Right?",
              "No",
              "24 is in both tables, and smaller.",
              [["Yes", "Is there a smaller one?"]],
            ],
          }),
          ask("LCM of 6 and 10?", "30", "Go up the 10 times table.", "30.", {
            asks: "LCM",
            changed: "10, not 8.",
          }),
          ask("LCM of 6 and 7?", "42", "No shared factors: multiply.", "42.", {
            asks: "LCM",
            changed: "No shared factor.",
          }),
          ask("LCM of 6 and 12?", "12", "12 is in the 6 times table.", "12.", {
            asks: "LCM",
            changed: "One is a multiple.",
          }),
        ],
        "Multiplying gives a common multiple, not always the lowest.",
      ),
      own(FA, HCF_LCM, "Spot the mistake"),

      own(FA, HCF_LCM, "Exit check"),

      reworded(
        FA,
        HCF_LCM,
        "“Buses leave every 12 and 18 minutes from 9 am. When do they next leave together?”",
        { tag: "Real life", title: "Buses every 12 and 18 minutes from 9 am. Next together?" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**HCF: multiply the shared primes. LCM: multiply all of them.**"],
        SHARED,
        [
          "**HCF: multiply the shared primes. LCM: multiply all of them.**",
          "LCM of 6 and 8 is 24, not 48.",
          "Equal groups: HCF. Together again: LCM.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

// ---------------------------------------------------------------------------------------------
// Listing systematically.

const LISTING = "gf-factors/listing";
const listMethod = [
  "Fix the first choice.",
  "Run through every second choice.",
  "Move the first on. Check: multiply the counts.",
];
const PAIRS: Picture = {
  kind: "grid",
  cols: 3,
  rows: 2,
  shaded: 6,
  colLabels: ["Crisps", "Apple", "Cake"],
  rowLabels: ["Tea", "Juice"],
};

const listing = stepped(find(FA, LISTING), {
  method: listMethod,
  variation: {
    relationship: "choices multiply: a ways and b ways give a × b",
    unknowns: ["count"],
    surface: ["more choices", "repeats allowed", "no repeats"],
  },
  screens: worded(
    [
      explain(
        "The rule",
        "Fix one, change the other",
        ["**List in order: fix one, change the other. Or multiply the choices.**"],
        PAIRS,
        "2 drinks × 3 snacks = 6 pairs.",
      ),

      ...owned(FA, LISTING, "Warm-up", "Check you remember"),

      methodCard("The method", listMethod, PAIRS),
      workedFrom(FA, LISTING),
      calc(
        "Your turn",
        "4 hats and 3 scarves.",
        undefined,
        [
          ["Outfits:", "12", "4 × 3."],
          ["Add 2 pairs of gloves:", "24", "12 × 2."],
        ],
        "12 outfits, then 24.",
      ),

      calc(
        "Practise",
        "Arrange 5 different books on a shelf.",
        undefined,
        [["$5 \\times 4 \\times 3 \\times 2 \\times 1 =$", "120", "One fewer choice each time."]],
        "120 ways.",
      ),
      ...owned(FA, LISTING, "Together", "Practise"),
      reworded(FA, LISTING, "5 shirts and 3 pairs of trousers: outfits?", { tag: "Practise" }),
      reworded(FA, LISTING, "Arrange the letters A, B, C, D in a row: how many ways?", {
        tag: "Practise",
        title: "A, B, C, D in a row: how many orders?",
      }),
      questionSet(
        "Practise",
        "How many? Watch what changes.",
        [
          ask("3 drinks, 5 snacks: pairs?", "15", "3 × 5.", "15.", { asks: "count" }),
          ask("3 drinks, 5 snacks, 2 desserts: meals?", "30", "3 × 5 × 2.", "30.", {
            asks: "count",
            changed: "A third choice.",
          }),
          ask("2-digit codes, 0–9, repeats allowed?", "100", "10 × 10.", "100.", {
            asks: "count",
            changed: "Digits.",
          }),
          ask("2-digit codes, 0–9, no repeats?", "90", "10 × 9.", "90.", {
            asks: "count",
            changed: "No repeats.",
          }),
        ],
        "Multiply the choices at each step.",
      ),

      questionSet(
        "Variation",
        "Digits 1, 2, 3 and 4. Watch what changes.",
        [
          ask("2-digit numbers, repeats allowed?", "16", "4 × 4.", "16.", {
            asks: "count",
            expect: [
              "Repeats allowed: Zak says 4 × 3 = 12. Right?",
              "No",
              "With repeats, 4 choices each time: 4 × 4 = 16.",
              [["Yes", "Can a digit be used twice?"]],
            ],
          }),
          ask("2-digit numbers, no repeats?", "12", "4 × 3.", "12.", {
            asks: "count",
            changed: "No repeats.",
          }),
          ask("3-digit numbers, no repeats?", "24", "4 × 3 × 2.", "24.", {
            asks: "count",
            changed: "Three digits.",
          }),
          ask("3-digit numbers, repeats allowed?", "64", "4 × 4 × 4.", "64.", {
            asks: "count",
            changed: "Repeats again.",
          }),
        ],
        "No repeats: one fewer choice each time.",
      ),
      own(FA, LISTING, "Spot the mistake"),

      own(FA, LISTING, "Exit check"),

      reworded(
        FA,
        LISTING,
        "“3 starters, 4 mains. How many different two-course meals?”",
        { tag: "Real life" },
        "Back to the problem",
      ),

      summary(
        "What to remember",
        ["**List in order: fix one, change the other. Or multiply the choices.**"],
        PAIRS,
        [
          "**List in order: fix one, change the other. Or multiply the choices.**",
          "a ways and b ways: a × b ways.",
          "No repeats: one fewer choice each time.",
        ],
        "Copy this into your book to revise from.",
      ),
    ],
    NUMBER,
  ),
});

export const gfFactorsStepped: [string, UnitLesson[]][] = [
  [PRIMES, [primes]],
  [PRODUCT, [primeFactors]],
  [HCF_LCM, [hcfLcm]],
  [LISTING, [listing]],
];
