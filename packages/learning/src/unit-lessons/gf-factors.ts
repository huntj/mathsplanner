// GCSE Foundation, "Factors, primes and listing", as four short lessons, one just before each
// skill: primes, factors and multiples; prime factorisation; HCF and LCM; and listing outcomes
// systematically. Each recaps the Key Stage 3 idea quickly, builds it to GCSE level, names the
// common mistakes and ends on an exam-style check.
import { choose, explain, lesson, mistake, problem, quiz, steps, typed, worked } from "./build.ts";
import type { UnitLesson } from "./types.ts";

const U = "gf-factors";

/** 12 and 18 as primes in a Venn diagram. A prime can sit in two regions here (12 has two 2s), so
 *  the second 2 carries a thin space, keeping every label distinct as the pictures require. */
const PRIME_VENN = {
  kind: "venn" as const,
  a: "12",
  b: "18",
  onlyA: ["2\u2009"],
  both: ["2", "3"],
  onlyB: ["3\u2009"],
};

export const gfFactors: UnitLesson[] = [
  lesson(
    U,
    "primes",
    "GF-N4.a",
    "Primes, factors and multiples",
    "Factors divide a number; multiples are in its times table; primes have exactly two factors.",
    [
      problem("The exam question", [
        "“From the list 9, 12, 17, 21, 24, 29, write down: a multiple of 6; a factor of 36; the prime numbers.”",
        "Three words, easily mixed up. By the end of this lesson, you'll never mix them up again.",
      ]),
      typed("Warm-up", "Work out $6 \\times 4$", "24", "Six fours.", "24."),
      typed("Warm-up", "Work out $36 \\div 12$", "3", "Twelves in 36.", "3."),
      explain(
        "Discover",
        "Three words",
        [
          "A **factor** divides a number exactly: the factors of 12 are 1, 2, 3, 4, 6, 12. A **multiple** is in its times table: 12, 24, 36…",
          "A **prime** has exactly two factors, 1 and itself: 2, 3, 5, 7, 11, 13… 1 is **not** prime (one factor); 2 is the only even prime.",
        ],
        {
          kind: "table",
          head: ["Number", "Factors"],
          rows: [
            ["12", "1, 2, 3, 4, 6, 12"],
            ["17", "1, 17 (prime)"],
            ["1", "1 (not prime)"],
          ],
        },
      ),
      choose("Discover", "Is 21 prime?", "No: 21 = 3 × 7", "It has more than two factors.", [
        ["Yes: it's odd", "Odd isn't the same as prime."],
      ]),
      worked(
        "Find all factors",
        "List the factors of 36.",
        [
          ["Pairs: 1 × 36, 2 × 18, 3 × 12, 4 × 9, 6 × 6", "Work up from 1 until the pairs meet."],
          ["1, 2, 3, 4, 6, 9, 12, 18, 36", "List in order."],
        ],
        "Pairs stop you missing any.",
      ),
      steps(
        "Together",
        "From 9, 12, 17, 21, 24, 29",
        "Pick out each kind.",
        [
          [
            "Multiples of 6:",
            "12 and 24",
            ["9 and 21", "Those are multiples of 3, not 6."],
            "12, 24",
          ],
          [
            "Primes:",
            "17 and 29",
            ["9 and 21", "$9 = 3 \\times 3$; $21 = 3 \\times 7$."],
            "17, 29",
          ],
        ],
        "Factors of 36 in the list: 9 and 12.",
      ),
      choose("Together", "How many factors does a prime have?", "Exactly 2", "1 and itself.", [
        ["1", "That's only the number 1."],
        ["Any odd number", "Primes have exactly two."],
      ]),
      choose("Your turn", "Which is a multiple of 7?", "63", "$7 \\times 9$.", [
        ["17", "17 is prime."],
        ["27", "$27 \\div 7$ isn't whole."],
      ]),
      choose("Your turn", "Which is prime?", "31", "Only 1 and 31 divide it.", [
        ["27", "$27 = 3 \\times 9$."],
        ["51", "$51 = 3 \\times 17$."],
      ]),
      choose(
        "Watch out",
        "Ella says 1 is a prime number. Is she right?",
        "No: a prime has exactly two factors; 1 has one",
        "1 is neither prime nor composite.",
        [["Yes", "Primes need exactly two factors."]],
      ),
      mistake(
        "Jo lists the factors of 20.",
        ["1 × 20, 2 × 10, 4 × 5", "So the factors are 2, 4, 5, 10", "There are 4 factors"],
        1,
        "Include 1 and 20: 1, 2, 4, 5, 10, 20 (6 factors).",
      ),
      choose(
        "Back to the problem",
        "“From 9, 12, 17, 21, 24, 29, write down the prime numbers.”",
        "17 and 29",
        "Each has exactly two factors.",
        [
          ["9, 17, 21, 29", "9 and 21 aren't prime."],
          ["17, 21, 29", "$21 = 3 \\times 7$."],
        ],
      ),
      quiz([
        [
          ["A factor of 45", "15", ["90", "4"], "$45 = 3 \\times 15$."],
          ["A factor of 56", "8", ["112", "6"], "$56 = 7 \\times 8$."],
        ],
        [
          ["A multiple of 9", "54", ["19", "3"], "$9 \\times 6$."],
          ["A multiple of 8", "72", ["18", "4"], "$8 \\times 9$."],
        ],
        [
          ["The only even prime", "2", ["4", "0"], "2 has factors 1 and 2."],
          ["Which is prime?", "23", ["33", "39"], "Only 1 and 23."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "prime-factors",
    "GF-N4.b",
    "Products of prime factors",
    "Split a number into primes with a factor tree; write it with powers.",
    [
      problem("Every number's fingerprint", [
        "“Write 360 as a product of its prime factors. Give your answer in index form.”",
        "Every whole number splits into primes in exactly one way. By the end of this lesson, you can find it.",
      ]),
      typed("Warm-up", "Work out $2 \\times 2 \\times 3$", "12", "Multiply them.", "12."),
      choose("Warm-up", "$2 \\times 2 \\times 2$ in index form", "$2^3$", "Three 2s.", [
        ["$2 \\times 3$", "That's 6."],
        ["$3^2$", "Three 2s, not two 3s."],
      ]),
      explain(
        "Discover",
        "A factor tree",
        [
          "Split the number into any two factors, then keep splitting until every branch ends in a **prime**.",
          "Multiply the primes together, smallest first, using powers for repeats.",
        ],
        {
          kind: "maths",
          tex: "\\begin{aligned} 360 &= 2 \\times 2 \\times 2 \\times 3 \\times 3 \\times 5 \\\\ &= 2^3 \\times 3^2 \\times 5 \\end{aligned}",
        },
      ),
      {
        kind: "tree",
        tag: "Discover",
        title: "Grow the tree for 60",
        root: 60,
        done: "$60 = 2 \\times 2 \\times 3 \\times 5 = 2^2 \\times 3 \\times 5$.",
      },
      worked(
        "360",
        "Write 360 as a product of prime factors.",
        [
          ["$360 = 36 \\times 10$", "Any two factors."],
          ["$36 = 2 \\times 2 \\times 3 \\times 3$; $10 = 2 \\times 5$", "Split until prime."],
          ["$360 = 2^3 \\times 3^2 \\times 5$", "Index form, smallest first."],
        ],
        "Check: $8 \\times 9 \\times 5 = 360$ ✓",
      ),
      steps(
        "Together",
        "Write 84 as a product of primes",
        "Factor tree.",
        [
          [
            "$84 = 4 \\times 21 =$",
            "$2 \\times 2 \\times 3 \\times 7$",
            ["$4 \\times 3 \\times 7$", "4 isn't prime: split it."],
            "$2 \\times 2 \\times 3 \\times 7$",
          ],
          [
            "In index form:",
            "$2^2 \\times 3 \\times 7$",
            ["$2 \\times 2 \\times 21$", "21 isn't prime."],
            "$2^2 \\times 3 \\times 7$",
          ],
        ],
        "Check: $4 \\times 3 \\times 7 = 84$ ✓",
      ),
      {
        kind: "tree",
        tag: "Together",
        title: "Grow the tree for 126",
        root: 126,
        done: "$126 = 2 \\times 3 \\times 3 \\times 7 = 2 \\times 3^2 \\times 7$.",
      },
      choose("Your turn", "100 as a product of primes", "$2^2 \\times 5^2$", "$4 \\times 25$.", [
        ["$10^2$", "10 isn't prime."],
        ["$2 \\times 5 \\times 10$", "Split the 10."],
      ]),
      choose("Your turn", "Which number is $2^3 \\times 3$?", "24", "$8 \\times 3$.", [
        ["18", "$2^3 = 8$, not 6."],
        ["12", "$2^3 = 8$."],
      ]),
      choose(
        "Watch out",
        "Ade writes $72 = 8 \\times 9$. Is that a product of primes?",
        "No: 8 and 9 aren't prime. It's $2^3 \\times 3^2$",
        "Keep splitting.",
        [["Yes", "Every factor must be prime."]],
      ),
      mistake(
        "Ola writes 90 as a product of primes.",
        [
          "$90 = 9 \\times 10$",
          "$9 = 3 \\times 3$, $10 = 2 \\times 5$",
          "$90 = 3^2 \\times 2 \\times 5 \\times 10$",
        ],
        2,
        "Don't include the 10 again: $90 = 2 \\times 3^2 \\times 5$.",
      ),
      choose(
        "Back to the problem",
        "“Write 360 as a product of its prime factors in index form.”",
        "$2^3 \\times 3^2 \\times 5$",
        "$8 \\times 9 \\times 5$.",
        [
          ["$2^2 \\times 3^2 \\times 10$", "10 isn't prime."],
          ["$2^3 \\times 3 \\times 15$", "15 isn't prime."],
        ],
      ),
      quiz([
        [
          ["36 as primes", "$2^2 \\times 3^2$", ["$6^2$", "$4 \\times 9$"], "Primes only."],
          ["48 as primes", "$2^4 \\times 3$", ["$6 \\times 8$", "$2^3 \\times 6$"], "Primes only."],
        ],
        [
          ["$2^2 \\times 3 \\times 5 =$", "60", ["30", "45"], "$4 \\times 15$."],
          ["$2 \\times 3^2 \\times 5 =$", "90", ["60", "45"], "$2 \\times 45$."],
        ],
        [
          [
            "150 as primes",
            "$2 \\times 3 \\times 5^2$",
            ["$2 \\times 75$", "$15 \\times 10$"],
            "$150 = 2 \\times 3 \\times 25$.",
          ],
          [
            "98 as primes",
            "$2 \\times 7^2$",
            ["$2 \\times 49$", "$14 \\times 7$"],
            "$98 = 2 \\times 49$.",
          ],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "hcf-lcm",
    "GF-N4.c",
    "HCF and LCM",
    "Use prime factors to find the highest common factor and lowest common multiple.",
    [
      problem("Buses and burgers", [
        "Bus A leaves every 12 minutes, bus B every 18. Both leave at 9 am. When do they next leave together? And what's the biggest number of identical party bags from 24 sweets and 36 stickers?",
        "By the end of this lesson, you can solve both, even with big numbers.",
      ]),
      typed(
        "Warm-up",
        "Factors of 12 and 18 they share: the biggest?",
        "6",
        "6 divides both.",
        "6.",
      ),
      typed(
        "Warm-up",
        "The first number in both the 4 and 6 times tables?",
        "12",
        "4, 8, 12… 6, 12…",
        "12.",
      ),
      explain(
        "Discover",
        "Prime factors in a Venn",
        [
          "Write both numbers as primes. Shared primes go in the middle. **HCF** = product of the middle. **LCM** = product of everything.",
          "$12 = 2^2 \\times 3$, $18 = 2 \\times 3^2$: shared $2 \\times 3$.",
        ],
        PRIME_VENN,
      ),
      choose(
        "Discover",
        "From the Venn, HCF of 12 and 18 is",
        "6",
        "$2 \\times 3$ in the middle.",
        [
          ["36", "That's the LCM."],
          ["3", "Multiply everything in the middle."],
        ],
      ),
      worked(
        "The buses",
        "Find the LCM of 12 and 18.",
        [
          ["$12 = 2^2 \\times 3$, $18 = 2 \\times 3^2$", "Primes."],
          ["LCM $= 2^2 \\times 3^2 = 36$", "Highest power of each prime."],
          ["They leave together after 36 minutes: 9:36 am", "In context."],
        ],
        "LCM: when things line up again.",
      ),
      steps(
        "Together",
        "HCF of 24 and 36",
        "Party bags.",
        [
          [
            "$24 = 2^3 \\times 3$, $36 = 2^2 \\times 3^2$. Shared:",
            "$2^2 \\times 3$",
            ["$2^3 \\times 3^2$", "Shared means the lower power of each."],
            "$2^2 \\times 3$",
          ],
          ["HCF:", "12", ["72", "That's the LCM."], "12 bags"],
        ],
        "12 bags, each with 2 sweets and 3 stickers.",
      ),
      choose(
        "Together",
        "Which question needs the LCM?",
        "When will two lights flash together again?",
        "Lining up again: a common multiple.",
        [["How many equal groups can I make?", "Splitting into groups: HCF."]],
      ),
      choose(
        "Your turn",
        "HCF of 30 and 45",
        "15",
        "$30 = 2 \\times 3 \\times 5$, $45 = 3^2 \\times 5$.",
        [
          ["90", "That's the LCM."],
          ["5", "3 is shared too."],
        ],
      ),
      choose("Your turn", "LCM of 8 and 12", "24", "$2^3 \\times 3$.", [
        ["96", "That's $8 \\times 12$: too big."],
        ["4", "That's the HCF."],
      ]),
      choose(
        "Watch out",
        "Raj says the LCM of 6 and 8 is 48, because $6 \\times 8 = 48$. Is it?",
        "No: 24 is in both tables",
        "Multiplying gives a common multiple, not always the lowest.",
        [["Yes", "6, 12, 18, 24… and 8, 16, 24."]],
      ),
      mistake(
        "Mo finds the HCF of 40 and 60.",
        [
          "$40 = 2^3 \\times 5$, $60 = 2^2 \\times 3 \\times 5$",
          "Shared: $2^3 \\times 5$",
          "HCF = 40",
        ],
        1,
        "Shared uses the lower power: $2^2 \\times 5 = 20$.",
      ),
      choose(
        "Back to the problem",
        "“Buses leave every 12 and 18 minutes from 9 am. When do they next leave together?”",
        "9:36 am",
        "LCM of 12 and 18 is 36.",
        [
          ["9:06 am", "6 is the HCF."],
          ["12:36 pm", "$12 \\times 18$ isn't the lowest."],
        ],
      ),
      quiz([
        [
          ["HCF of 16 and 24", "8", ["48", "4"], "$2^3$."],
          ["HCF of 18 and 27", "9", ["54", "3"], "$3^2$."],
        ],
        [
          ["LCM of 6 and 9", "18", ["54", "3"], "6, 12, 18."],
          ["LCM of 10 and 15", "30", ["150", "5"], "10, 20, 30."],
        ],
        [
          ["Equal groups from 20 and 30", "HCF", ["LCM", "neither"], "Splitting."],
          ["Two alarms ringing together again", "LCM", ["HCF", "neither"], "Lining up."],
        ],
      ]),
    ],
  ),

  lesson(
    U,
    "listing",
    "GF-N5",
    "Listing systematically",
    "List combinations in an order so none are missed; use the product rule.",
    [
      problem("The menu", [
        "A café has 3 starters and 4 mains. How many different two-course meals? And how many 3-digit codes use the digits 1, 2 and 3 once each?",
        "Listing at random misses some. By the end of this lesson, you can list systematically, and count without listing.",
      ]),
      typed("Warm-up", "Work out $3 \\times 4$", "12", "Times.", "12."),
      typed("Warm-up", "Work out $3 \\times 2 \\times 1$", "6", "Multiply.", "6."),
      explain(
        "Discover",
        "Fix one, change the other",
        [
          "List **systematically**: fix the first choice, run through every second choice, then move the first one on.",
          "**Product rule**: if there are $a$ ways for one thing and $b$ for another, there are $a \\times b$ ways for both.",
        ],
        {
          kind: "table",
          head: ["Starter", "Mains"],
          rows: [
            ["Soup", "A, B, C, D"],
            ["Salad", "A, B, C, D"],
            ["Bread", "A, B, C, D"],
          ],
        },
      ),
      choose("Discover", "3 starters, 4 mains. Number of meals", "12", "$3 \\times 4$.", [
        ["7", "Multiply, don't add."],
        ["4", "Each starter goes with every main."],
      ]),
      worked(
        "Three-digit codes",
        "List the codes using 1, 2, 3 once each.",
        [
          ["Start with 1: 123, 132", "Fix the first digit."],
          ["Start with 2: 213, 231; with 3: 312, 321", "Move it on."],
          ["6 codes: $3 \\times 2 \\times 1$", "Product rule."],
        ],
        "Each choice leaves one fewer.",
      ),
      steps(
        "Together",
        "A PIN uses 4 digits, 0–9, repeats allowed",
        "How many PINs?",
        [
          [
            "Choices for each digit:",
            "10",
            ["9", "0 to 9 is ten digits."],
            "$10 \\times 10 \\times 10 \\times 10$",
          ],
          ["Total:", "10 000", ["40", "Multiply, don't add."], "10 000"],
        ],
        "That's why 4-digit PINs are guessable.",
      ),
      choose(
        "Together",
        "2 coins are flipped. Outcomes listed systematically",
        "HH, HT, TH, TT",
        "Fix the first, vary the second.",
        [["HH, HT, TT", "HT and TH are different."]],
      ),
      typed(
        "Your turn",
        "5 shirts and 3 pairs of trousers: outfits?",
        "15",
        "$5 \\times 3$.",
        "15.",
        { wrong: [["8", "Multiply."]] },
      ),
      typed(
        "Your turn",
        "Arrange the letters A, B, C, D in a row: how many ways?",
        "24",
        "$4 \\times 3 \\times 2 \\times 1$.",
        "24.",
        { wrong: [["16", "Each choice leaves one fewer."]] },
      ),
      choose(
        "Watch out",
        "Ben lists outfits at random and finds 11 of the 15. What's the fix?",
        "List systematically: fix one item, run through the other",
        "Random lists miss some.",
        [["Guess the rest", "Fix one, vary the other."]],
      ),
      mistake(
        "Zak counts 2-digit numbers from 1, 2, 3, repeats allowed.",
        ["First digit: 3 choices", "Second digit: 2 choices", "So 6 numbers"],
        1,
        "Repeats allowed: 3 choices again. $3 \\times 3 = 9$.",
      ),
      choose(
        "Back to the problem",
        "“3 starters, 4 mains. How many different two-course meals?”",
        "12",
        "$3 \\times 4$.",
        [
          ["7", "Each starter with each main: multiply."],
          ["24", "$3 \\times 4 = 12$."],
        ],
      ),
      quiz([
        [
          ["4 bread, 5 fillings: sandwiches", "20", ["9", "45"], "$4 \\times 5$."],
          ["6 colours, 3 sizes: T-shirts", "18", ["9", "63"], "$6 \\times 3$."],
        ],
        [
          ["Arrange 3 different books", "6", ["9", "3"], "$3 \\times 2 \\times 1$."],
          [
            "Arrange 5 runners in order",
            "120",
            ["25", "15"],
            "$5 \\times 4 \\times 3 \\times 2 \\times 1$.",
          ],
        ],
        [
          ["3-digit codes, digits 0–9, repeats allowed", "1000", ["30", "720"], "$10^3$."],
          ["2-letter codes from A–E, repeats allowed", "25", ["10", "20"], "$5 \\times 5$."],
        ],
      ]),
    ],
  ),
];
