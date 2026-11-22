// Year 7, "Factors, multiples and primes", on the stepped template
// (docs/proposals/lesson-stepped.md): factors and primes as rectangles of squares, factor trees,
// the HCF in a Venn diagram, and the LCM where two times tables meet.
import {
  ask,
  calc,
  choose,
  explain,
  methodCard,
  questionSet,
  quiz,
  summary,
  typed,
  worked,
} from "./build.ts";
import { find, own, owned, reworded, stepped } from "./stepped.ts";
import type { Picture, Screen, UnitLesson } from "./types.ts";
import { y7Factors } from "./y7-factors.ts";

const NUMBER = "A number fact: there is nothing to draw.";

const maths = (tex: string): Picture => ({ kind: "maths", tex });
const rect = (cols: number, rows: number): Picture => ({
  kind: "grid",
  cols,
  rows,
  shaded: cols * rows,
});
const factors = (rows: [string, string][]): Picture => ({
  kind: "table",
  head: ["Number", "Factors"],
  rows: rows.map(([n, f]) => [n, f]),
});
const multiples = (rows: [string, string][]): Picture => ({
  kind: "table",
  head: ["Times table", "Multiples"],
  rows: rows.map(([n, f]) => [n, f]),
});

/** A question with no picture is a number fact: say so. */
const worded = (screens: Screen[]): Screen[] =>
  screens.map((s) =>
    ["answer", "choice", "calc", "set", "steps", "fill", "sort"].includes(s.kind) &&
    !s.wordsOnly &&
    !("picture" in s && s.picture)
      ? { ...s, wordsOnly: NUMBER }
      : s,
  );

const list = y7Factors;

// ---------------------------------------------------------------------------------------------
// Factors, multiples and primes.

const PRIMES = "y7-factors/primes";
const primesMethod = [
  "Start with 1 times the number.",
  "Try 2, 3, 4… in turn, and write each pair.",
  "Stop when the pairs meet.",
];

const primes = stepped(find(list, PRIMES), {
  method: primesMethod,
  variation: {
    relationship: "a number, its factors and its multiples",
    unknowns: ["factor", "multiple", "prime"],
    surface: ["1", "2", "odd numbers", "chairs in rows"],
  },
  screens: worded([
    explain(
      "The rule",
      "Factors, multiples and primes",
      ["**A factor divides a number exactly. A prime has just two factors.**"],
      rect(4, 3),
      "12 makes a 3 by 4 rectangle, so 3 and 4 are factors of 12.",
    ),
    reworded(list, PRIMES, "7 squares: which rectangles can you make?", { tag: "The rule" }),

    typed("Check you remember", "What is $4 \\times 6$?", "24", "4 sixes.", "24."),
    typed("Check you remember", "What is $24 \\div 3$?", "8", "How many 3s in 24?", "8."),
    choose("Check you remember", "Is 15 in the 5 times table?", "Yes", "5 × 3 = 15.", [
      ["No", "Count in 5s: 5, 10, 15."],
    ]),

    methodCard("The method", primesMethod, rect(6, 3)),
    worked(
      "Watch the method",
      "Find all the factors of 18.",
      [
        { line: "$1 \\times 18$" },
        { line: "$2 \\times 9$ and $3 \\times 6$" },
        { line: "4 and 5 don't divide 18. 6 is found: stop.", note: "The pairs have met." },
        { line: "1, 2, 3, 6, 9, 18" },
      ],
      "18 has 6 factors.",
      rect(6, 3),
    ),
    calc(
      "Your turn",
      "Find the factor pairs of 20.",
      rect(5, 4),
      [
        ["$1 \\times$", "20", "1 times what is 20?"],
        ["$2 \\times$", "10", "Half of 20."],
        ["$4 \\times$", "5", "3 doesn't divide 20. Try 4."],
      ],
      "1, 2, 4, 5, 10, 20: 6 factors.",
    ),

    calc(
      "Practise",
      "How many factors does 12 have?",
      rect(4, 3),
      [
        ["Pairs: 1 × 12, 2 × 6, 3 ×", "4", "3 times what is 12?"],
        ["Factors:", "6", "1, 2, 3, 4, 6, 12."],
      ],
      "12 has 6 factors.",
    ),
    ...owned(list, PRIMES, "Together", "Practise"),
    questionSet(
      "Practise",
      "Which one? Watch what changes.",
      [
        ask("Which is a factor of 30?", "6", "6 × 5 = 30.", "6.", {
          asks: "factor",
          others: ["4", "8"],
        }),
        ask("Which is a multiple of 6?", "42", "6 × 7 = 42.", "42.", {
          asks: "multiple",
          changed: "Now a multiple.",
          others: ["3", "16"],
        }),
        ask("Which is prime?", "17", "Only 1 and 17 divide it.", "17.", {
          asks: "prime",
          changed: "Now a prime.",
          others: ["15", "21"],
        }),
        ask("How many factors does 7 have?", "2", "Only 1 and 7.", "2: 7 is prime.", {
          asks: "prime",
          changed: "Count the factors of a prime.",
        }),
      ],
      "Factors divide it; multiples are in its times table; primes have two factors.",
    ),

    questionSet(
      "Variation",
      "Prime or not? Watch what changes.",
      [
        ask(
          "Is 1 a prime number?",
          "No",
          "A prime has exactly two factors.",
          "No: 1 has one factor.",
          {
            asks: "prime",
            others: ["Yes"],
            expect: [
              "Max says 1 is prime. Is he right?",
              "No",
              "1 has only one factor. A prime has exactly two.",
              [["Yes", "Count its factors: just 1."]],
            ],
          },
        ),
        ask(
          "Is 2 a prime number?",
          "Yes",
          "Its factors are 1 and 2.",
          "Yes: the only even prime.",
          {
            asks: "prime",
            changed: "An even number.",
            others: ["No"],
          },
        ),
        ask("Is 9 a prime number?", "No", "3 × 3 = 9.", "No: 3 is a factor.", {
          asks: "prime",
          changed: "Odd, but is it prime?",
          others: ["Yes"],
        }),
        ask("Is 51 a prime number?", "No", "Try 3: 3 × 17.", "No: 51 = 3 × 17.", {
          asks: "prime",
          changed: "A bigger odd number.",
          others: ["Yes"],
        }),
      ],
      "Count the factors: exactly two means prime.",
    ),
    own(list, PRIMES, "Spot the mistake"),

    own(list, PRIMES, "Exit check"),

    reworded(list, PRIMES, "Arranging chairs", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**A factor divides a number exactly. A prime has just two factors.**"],
      rect(4, 3),
      [
        "**A factor divides a number exactly. A prime has just two factors.**",
        "Multiples are in the times table: 3, 6, 9, 12…",
        "Find factors in pairs, and stop when they meet.",
        "Factors of 18: 1, 2, 3, 6, 9, 18. 1 is not prime.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Built from primes.

const PRIME_FACTORS = "y7-factors/prime-factors";
const primeFactorsMethod = [
  "Split the number into any two factors.",
  "Keep splitting until every branch is prime.",
  "Multiply the primes, with powers for repeats.",
];

const primeFactors = stepped(find(list, PRIME_FACTORS), {
  method: primeFactorsMethod,
  variation: {
    relationship: "a number and the primes that multiply to make it",
    unknowns: ["primes", "number", "power"],
    surface: ["even numbers", "odd numbers", "a prime", "stopping too soon"],
  },
  screens: worded([
    explain(
      "The rule",
      "Built from primes",
      ["**Split it with a factor tree until every branch is prime.**"],
      maths("60 = 2 \\times 2 \\times 3 \\times 5 = 2^2 \\times 3 \\times 5"),
      "The primes at the ends multiply back to the number.",
    ),
    reworded(list, PRIME_FACTORS, "Grow a factor tree for 60", { tag: "The rule" }),

    reworded(list, PRIME_FACTORS, "Which is prime?", { tag: "Check you remember" }, "Warm-up"),
    typed("Check you remember", "What is $2 \\times 2 \\times 3$?", "12", "4 × 3.", "12."),
    choose(
      "Check you remember",
      "Which is $2 \\times 2 \\times 2$?",
      "$2^3$",
      "Three 2s multiplied.",
      [
        ["$3^2$", "That's 3 × 3."],
        ["$2 \\times 3$", "That's 6."],
      ],
    ),

    methodCard("The method", primeFactorsMethod, maths("36 = 2^2 \\times 3^2")),
    worked(
      "Watch the method",
      "Write 36 as a product of primes.",
      [
        { line: "$36 = 4 \\times 9$" },
        { line: "$4 = 2 \\times 2$ and $9 = 3 \\times 3$", note: "Keep splitting to primes." },
        { line: "$36 = 2^2 \\times 3^2$", note: "Powers for the repeats." },
      ],
      "$36 = 2^2 \\times 3^2$.",
    ),
    calc(
      "Your turn",
      "Write 48 as a product of primes.",
      undefined,
      [
        ["$48 = 6 \\times$", "8", "6 times what is 48?"],
        ["$6 = 2 \\times$", "3", "Split 6 into primes."],
        ["$8 = 2 \\times 2 \\times$", "2", "Split 8 into primes."],
        ["How many 2s in all?", "4", "One from the 6, three from the 8."],
      ],
      "$48 = 2^4 \\times 3$.",
    ),

    ...owned(list, PRIME_FACTORS, "Your turn", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("What number is $2^3 \\times 5$?", "40", "8 × 5.", "40.", { asks: "number" }),
        ask("What number is $2^2 \\times 3 \\times 7$?", "84", "4 × 3 × 7.", "84.", {
          asks: "number",
          changed: "Three primes now.",
        }),
        ask(
          "Write 12 as a product of primes.",
          "$2^2 \\times 3$",
          "12 = 4 × 3 = 2 × 2 × 3.",
          "$2^2 \\times 3$.",
          {
            asks: "primes",
            changed: "Now the other way: find the primes.",
            others: ["$2 \\times 6$", "$4 \\times 3$"],
          },
        ),
        ask(
          "In $2^3 \\times 5$, how many 2s are multiplied?",
          "3",
          "The power counts them.",
          "3.",
          {
            asks: "power",
            changed: "Now read the power.",
          },
        ),
      ],
      "Primes multiply back to the number; the power counts the repeats.",
    ),

    questionSet(
      "Variation",
      "Product of primes? Watch what changes.",
      [
        ask(
          "Kai writes $60 = 2 \\times 30$. Is he done?",
          "No",
          "30 isn't prime.",
          "No: $60 = 2^2 \\times 3 \\times 5$.",
          {
            asks: "primes",
            others: ["Yes"],
            expect: [
              "Is 30 prime?",
              "No",
              "30 = 2 × 3 × 5, so keep splitting.",
              [["Yes", "30 divides by 2, 3 and 5."]],
            ],
          },
        ),
        ask(
          "Write 18 as a product of primes.",
          "$2 \\times 3^2$",
          "18 = 2 × 9 = 2 × 3 × 3.",
          "$2 \\times 3^2$.",
          {
            asks: "primes",
            changed: "Count the 3s carefully.",
            others: ["$2 \\times 3^3$", "$2 \\times 9$"],
          },
        ),
        ask(
          "Write 45 as a product of primes.",
          "$3^2 \\times 5$",
          "45 = 5 × 9.",
          "$3^2 \\times 5$.",
          {
            asks: "primes",
            changed: "An odd number: start with 3 or 5.",
            others: ["$3 \\times 15$", "$5 \\times 9$"],
          },
        ),
        ask("Write 17 as a product of primes.", "17", "17 is prime already.", "17: it's prime.", {
          asks: "primes",
          changed: "A prime number.",
          others: ["$1 \\times 17$", "$2 \\times 8.5$"],
        }),
      ],
      "Keep splitting until every factor is prime, then count the repeats.",
    ),
    own(list, PRIME_FACTORS, "Spot the mistake"),

    own(list, PRIME_FACTORS, "Exit check"),

    summary(
      "What to remember",
      ["**Split it with a factor tree until every branch is prime.**"],
      maths("60 = 2^2 \\times 3 \\times 5"),
      [
        "**Split it with a factor tree until every branch is prime.**",
        "Multiply the primes back; use powers for repeats.",
        "$36 = 4 \\times 9 = 2 \\times 2 \\times 3 \\times 3 = 2^2 \\times 3^2$",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Highest common factor.

const HCF = "y7-factors/hcf";
const hcfMethod = [
  "List the factors of each number.",
  "Ring the factors in both lists.",
  "The biggest is the HCF.",
];

const venn = (a: string, b: string, onlyA: string[], both: string[], onlyB: string[]): Picture => ({
  kind: "venn",
  a: `Factors of ${a}`,
  b: `Factors of ${b}`,
  onlyA,
  both,
  onlyB,
});

const hcf = stepped(find(list, HCF), {
  method: hcfMethod,
  variation: {
    relationship: "two numbers and the factors they share",
    unknowns: ["HCF", "common factors"],
    surface: ["one divides the other", "two primes", "ten times bigger", "party bags"],
  },
  screens: worded([
    explain(
      "The rule",
      "Highest common factor",
      ["**The HCF is the biggest factor two numbers share.**"],
      venn("18", "30", ["9", "18"], ["1", "2", "3", "6"], ["5", "10", "15", "30"]),
      "It's the most equal groups you can share both into.",
    ),

    typed("Check you remember", "How many factors does 18 have?", "6", "1, 2, 3, 6, 9, 18.", "6."),
    typed("Check you remember", "What is $30 \\div 6$?", "5", "How many 6s in 30?", "5."),
    choose("Check you remember", "Is 4 a factor of 18?", "No", "18 ÷ 4 = 4.5: not exact.", [
      ["Yes", "4 × 4 = 16 and 4 × 5 = 20: no 18."],
    ]),

    methodCard(
      "The method",
      hcfMethod,
      venn("18", "30", ["9", "18"], ["1", "2", "3", "6"], ["5", "10", "15", "30"]),
    ),
    worked(
      "Watch the method",
      "Find the HCF of 24 and 36.",
      [
        { line: "Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24" },
        { line: "Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36" },
        { line: "In both: 1, 2, 3, 4, 6, 12", note: "Ring the ones in both lists." },
        { line: "The biggest is 12." },
      ],
      "The HCF is 12.",
    ),
    calc(
      "Your turn",
      "Find the HCF of 18 and 27.",
      factors([
        ["18", "1, 2, 3, 6, 9, 18"],
        ["27", "1, 3, 9, 27"],
      ]),
      [
        ["In both: 1, 3 and", "9", "Find the numbers in both lists."],
        ["The HCF is", "9", "The biggest in both."],
      ],
      "9.",
    ),

    calc(
      "Practise",
      "Find the HCF of 16 and 40.",
      factors([
        ["16", "1, 2, 4, 8, 16"],
        ["40", "1, 2, 4, 5, 8, 10, 20, 40"],
      ]),
      [
        ["In both: 1, 2, 4 and", "8", "Find the numbers in both lists."],
        ["The HCF is", "8", "The biggest in both."],
      ],
      "8.",
    ),
    ...owned(list, HCF, "Together", "Practise").map((sc) =>
      sc.title === "HCF of 20 and 21"
        ? ({
            ...sc,
            start: "Use the two lists of factors.",
            picture: factors([
              ["20", "1, 2, 4, 5, 10, 20"],
              ["21", "1, 3, 7, 21"],
            ]),
          } as Screen)
        : sc,
    ),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("What is the HCF of 12 and 16?", "4", "Both divide by 4.", "4.", { asks: "HCF" }),
        ask("What is the HCF of 14 and 35?", "7", "14 = 2 × 7, 35 = 5 × 7.", "7.", {
          asks: "HCF",
          changed: "Different numbers.",
        }),
        ask("How many common factors do 12 and 18 have?", "4", "1, 2, 3 and 6.", "4.", {
          asks: "common factors",
          changed: "Now count the common factors.",
        }),
        ask("What is the HCF of 20 and 21?", "1", "Only 1 divides both.", "1.", {
          asks: "HCF",
          changed: "Next-door numbers.",
        }),
      ],
      "List, ring the common ones, take the biggest.",
    ),

    questionSet(
      "Variation",
      "Find each HCF. Watch what changes.",
      [
        ask("What is the HCF of 8 and 12?", "4", "4 divides both.", "4.", {
          asks: "HCF",
          expect: [
            "Lee says the HCF of 8 and 12 is 24. Is he right?",
            "No",
            "24 is a common multiple. The HCF is 4.",
            [["Yes", "A factor can't be bigger than the number."]],
          ],
        }),
        ask("What is the HCF of 8 and 16?", "8", "8 divides 16.", "8.", {
          asks: "HCF",
          changed: "One divides the other.",
        }),
        ask("What is the HCF of 7 and 13?", "1", "Both are prime.", "1.", {
          asks: "HCF",
          changed: "Two primes.",
        }),
        ask("What is the HCF of 80 and 120?", "40", "HCF of 8 and 12 is 4.", "40.", {
          asks: "HCF",
          changed: "Ten times 8 and 12.",
          expect: [
            "The HCF of 8 and 12 is 4. For 80 and 120 it's…",
            "40",
            "Both are ten times bigger, so the HCF is too.",
            [["4", "10 divides both 80 and 120 as well."]],
          ],
        }),
      ],
      "The HCF is never bigger than either number.",
    ),
    own(list, HCF, "Spot the mistake"),

    own(list, HCF, "Exit check"),

    reworded(list, HCF, "Party bags", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**The HCF is the biggest factor two numbers share.**"],
      venn("18", "30", ["9", "18"], ["1", "2", "3", "6"], ["5", "10", "15", "30"]),
      [
        "**The HCF is the biggest factor two numbers share.**",
        "List the factors, ring those in both, take the biggest.",
        "HCF of 18 and 30 is 6.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

// ---------------------------------------------------------------------------------------------
// Lowest common multiple.

const LCM = "y7-factors/lcm";
const lcmMethod = [
  "List the multiples of the bigger number.",
  "Find the first one the other number divides.",
  "That's the LCM.",
];

const lcm = stepped(find(list, LCM), {
  method: lcmMethod,
  variation: {
    relationship: "two numbers and the multiples they share",
    unknowns: ["LCM", "common multiple"],
    surface: ["one divides the other", "two primes", "multiplying mistake", "buses"],
  },
  screens: worded([
    explain(
      "The rule",
      "Lowest common multiple",
      ["**The LCM is the first number in both times tables.**"],
      multiples([
        ["6", "6, 12, 18, **24**, 30"],
        ["8", "8, 16, **24**, 32"],
      ]),
      "Things that repeat line up again at the LCM.",
    ),

    typed("Check you remember", "What is the 4th multiple of 6?", "24", "6, 12, 18, …", "24."),
    typed("Check you remember", "What is the 3rd multiple of 8?", "24", "8, 16, …", "24."),
    choose("Check you remember", "Is 36 a multiple of 9?", "Yes", "9 × 4 = 36.", [
      ["No", "Count in 9s: 9, 18, 27, 36."],
    ]),

    methodCard(
      "The method",
      lcmMethod,
      multiples([
        ["12", "12, 24, **36**"],
        ["9", "9, 18, 27, **36**"],
      ]),
    ),
    worked(
      "Watch the method",
      "Find the LCM of 9 and 12.",
      [
        { line: "Multiples of 12: 12, 24, 36, 48, …", note: "Start with the bigger number." },
        { line: "12? 24? Not multiples of 9. 36 is." },
        { line: "The LCM is 36." },
      ],
      "36.",
    ),
    calc(
      "Your turn",
      "Find the LCM of 4 and 6.",
      undefined,
      [
        ["Multiples of 6: 6,", "12", "Add 6 again."],
        ["The LCM of 4 and 6 is", "12", "4 doesn't divide 6, but does divide 12."],
      ],
      "12.",
    ),

    calc(
      "Practise",
      "Find the LCM of 3 and 10.",
      undefined,
      [
        ["Multiples of 10: 10, 20,", "30", "Add 10 again."],
        ["The LCM is", "30", "3 divides 30, but not 10 or 20."],
      ],
      "30.",
    ),
    ...owned(list, LCM, "Together", "Practise"),
    questionSet(
      "Practise",
      "Find each one. Watch what changes.",
      [
        ask("What is the LCM of 4 and 10?", "20", "Multiples of 10: 10, 20.", "20.", {
          asks: "LCM",
        }),
        ask("What is the LCM of 3 and 8?", "24", "Multiples of 8: 8, 16, 24.", "24.", {
          asks: "LCM",
          changed: "No common factor this time.",
        }),
        ask("After 12, the next common multiple of 4 and 6?", "24", "Add the LCM again.", "24.", {
          asks: "common multiple",
          changed: "Now the next one.",
        }),
        ask("What is the LCM of 10 and 15?", "30", "Multiples of 15: 15, 30.", "30.", {
          asks: "LCM",
          changed: "Bigger numbers.",
        }),
      ],
      "Count up in the bigger number until the smaller divides it.",
    ),

    questionSet(
      "Variation",
      "Find each LCM. Watch what changes.",
      [
        ask("What is the LCM of 4 and 6?", "12", "Multiples of 6: 6, 12.", "12.", {
          asks: "LCM",
          expect: [
            "Bea says the LCM of 4 and 6 is 2. Is she right?",
            "No",
            "2 is the HCF. A multiple is at least the number.",
            [["Yes", "2 isn't in the 4 or the 6 times table."]],
          ],
        }),
        ask("What is the LCM of 6 and 10?", "30", "Multiples of 10: 10, 20, 30.", "30.", {
          asks: "LCM",
          changed: "Multiplying gives 60. Is that lowest?",
          expect: [
            "6 × 10 is 60. Is 60 the LCM?",
            "No: it's 30",
            "30 is in both tables, and comes first.",
            [["Yes", "Check 30: 6 × 5 and 10 × 3."]],
          ],
        }),
        ask("What is the LCM of 5 and 7?", "35", "Two primes: 5 × 7.", "35.", {
          asks: "LCM",
          changed: "Two primes.",
        }),
        ask("What is the LCM of 4 and 12?", "12", "4 divides 12.", "12.", {
          asks: "LCM",
          changed: "One is a multiple of the other.",
        }),
      ],
      "The LCM is at least the bigger number, and at most the two multiplied.",
    ),
    own(list, LCM, "Spot the mistake"),

    quiz([
      [
        [
          "What is the LCM of 4 and 10?",
          "20",
          ["40", "2"],
          "Multiples of 10: 10, 20.",
          undefined,
          "LCM",
        ],
        [
          "What is the LCM of 6 and 8?",
          "24",
          ["48", "2"],
          "Multiples of 8: 8, 16, 24.",
          undefined,
          "LCM",
        ],
      ],
      [
        [
          "What is the LCM of 3 and 8?",
          "24",
          ["11", "12"],
          "Multiples of 8: 8, 16, 24.",
          undefined,
          "LCM",
        ],
        ["What is the LCM of 3 and 5?", "15", ["8", "30"], "Two primes: 3 × 5.", undefined, "LCM"],
      ],
      [
        [
          "Lights flash every 4 s and 6 s. Together again after?",
          "12 s",
          ["24 s", "10 s"],
          "The LCM of 4 and 6.",
          undefined,
          "common multiple",
        ],
        [
          "Bells ring every 3 min and 4 min. Together again after?",
          "12 min",
          ["7 min", "24 min"],
          "The LCM of 3 and 4.",
          undefined,
          "common multiple",
        ],
      ],
    ]),

    reworded(list, LCM, "Buses and trams", { tag: "Real life" }, "Back to the problem"),

    summary(
      "What to remember",
      ["**The LCM is the first number in both times tables.**"],
      multiples([
        ["6", "6, 12, 18, **24**, 30"],
        ["8", "8, 16, **24**, 32"],
      ]),
      [
        "**The LCM is the first number in both times tables.**",
        "Count up in the bigger number until the other divides it.",
        "LCM of 6 and 8 is 24. HCF is the factor; LCM is the multiple.",
      ],
      "Copy this into your book to revise from.",
    ),
  ]),
});

export const y7FactorsStepped: [string, UnitLesson[]][] = [
  [PRIMES, [primes]],
  [PRIME_FACTORS, [primeFactors]],
  [HCF, [hcf]],
  [LCM, [lcm]],
];
