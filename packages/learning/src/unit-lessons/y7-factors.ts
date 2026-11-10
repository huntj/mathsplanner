// Year 7, "Factors, multiples and primes", as four short lessons, one just before each skill:
// factors, multiples and primes (factors make rectangles), writing a number as a product of primes
// with a factor tree, the highest common factor, and the lowest common multiple. Each starts from
// something quick, builds the idea a step at a time, names the common mistakes, and ends on an
// exit check.
import type { UnitLesson } from "./types.ts";

const PRIMES = "Y7-NPV-04.a";
const PRODUCT = "Y7-NPV-04.b";
const HCF = "Y7-NPV-04.c";
const LCM = "Y7-NPV-04.d";

export const y7Factors: UnitLesson[] = [
  {
    unit: "y7-factors",
    id: "y7-factors/primes",
    before: PRIMES,
    title: "Factors, multiples and primes",
    summary:
      "Factors divide a number exactly; multiples are in its times table; primes have just two factors.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Arranging chairs",
        text: [
          "24 chairs must be set out in equal rows, with none left over.",
          "How many different ways can it be done? By the end of this lesson, you can find them all.",
        ],
        picture: { kind: "grid", cols: 6, rows: 4, shaded: 24 },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $4 \\times 6$?",
        answers: ["24"],
        hint: "Four sixes.",
        done: "24.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $24 \\div 3$?",
        answers: ["8"],
        hint: "How many 3s in 24?",
        done: "8.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Factors make rectangles",
        text: [
          "12 squares can make a 3 by 4 rectangle, so 3 and 4 are **factors** of 12: they divide it exactly.",
          "The **multiples** of 3 are its times table: 3, 6, 9, 12, … So 12 is a multiple of 3.",
        ],
        picture: { kind: "grid", cols: 4, rows: 3, shaded: 12 },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "7 squares: which rectangles can you make?",
        picture: { kind: "grid", cols: 7, rows: 1, shaded: 7 },
        options: [
          {
            text: "Only 1 by 7",
            correct: true,
            feedback: "7 has just two factors, 1 and itself. That makes it **prime**.",
          },
          {
            text: "1 by 7 and 2 by 3.5",
            feedback: "Rows must be whole: 7 only divides by 1 and 7.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "The factors of 18",
        problem: "Find all the factors of 18.",
        steps: [
          { line: "$1 \\times 18$", why: "Start with 1." },
          { line: "$2 \\times 9$, $3 \\times 6$", why: "Try 2, 3, 4, … in turn." },
          {
            line: "4 and 5 don't divide 18; next is 6, already found",
            why: "Stop when the pairs meet.",
          },
          { line: "1, 2, 3, 6, 9, 18", why: "List them in order." },
        ],
        done: "Work in pairs, and you won't miss any.",
      },
      {
        kind: "fill",
        tag: "Together",
        title: "The factor pairs of 24",
        template: "$1 \\times 24$, $2 \\times$ [], $3 \\times$ [], $4 \\times$ []",
        bank: ["$12$", "$8$", "$6$", "$5$", "$7$"],
        answers: ["$12$", "$8$", "$6$"],
        hint: "What times 2 makes 24?",
        done: "Four pairs: 1, 2, 3, 4, 6, 8, 12 and 24.",
      },
      {
        kind: "sort",
        tag: "Together",
        title: "Prime or not?",
        groups: ["Prime", "Not prime"],
        items: [
          { text: "2", group: 0, why: "Only 1 and 2: the only even prime." },
          { text: "13", group: 0, why: "Only 1 and 13." },
          { text: "29", group: 0, why: "Only 1 and 29." },
          { text: "1", group: 1, why: "1 has only one factor. Primes need exactly two." },
          { text: "9", group: 1, why: "$3 \\times 3$." },
          { text: "21", group: 1, why: "$3 \\times 7$." },
        ],
        done: "A prime has exactly two factors: 1 and itself.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which is a multiple of 6?",
        options: [
          { text: "42", correct: true, feedback: "$6 \\times 7 = 42$." },
          { text: "3", feedback: "3 is a factor of 6, not a multiple." },
          { text: "16", feedback: "16 isn't in the 6 times table." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "How many factors does 20 have?",
        answers: ["6"],
        hint: "1 × 20, 2 × 10, 4 × 5.",
        done: "1, 2, 4, 5, 10, 20: six factors.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Max says 1 is a prime number. Is he right?",
        options: [
          {
            text: "No: a prime has exactly two factors, and 1 has only one",
            correct: true,
            feedback: "1 isn't prime. The smallest prime is 2, the only even one.",
          },
          {
            text: "Yes: it only divides by 1 and itself",
            feedback: "1 and itself are the same number here: just one factor.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ivy lists factors and multiples of 8.",
        lines: [
          "The factors of 8 are 1, 2, 4 and 8",
          "The multiples of 8 are 8, 16, 24, …",
          "So 2 is a multiple of 8",
        ],
        wrong: 2,
        why: "2 is a **factor** of 8: it divides into 8. Multiples are 8 or bigger.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Arranging chairs",
        text: "24 chairs in equal rows. How many different rows-by-columns arrangements are there? (Count 4 by 6 and 6 by 4 as different.)",
        answers: ["8"],
        wrong: [
          { answer: "4", feedback: "That counts the pairs. Each pair can go two ways round." },
        ],
        hint: "The factor pairs: 1 × 24, 2 × 12, 3 × 8, 4 × 6, and each turned round.",
        done: "8 ways: one for each factor of 24 as the number of rows.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Which is a factor of 30?",
            options: ["6", "4", "60"],
            answers: ["6"],
            why: "$6 \\times 5 = 30$.",
            retry: {
              prompt: "Which is a factor of 28?",
              options: ["7", "6", "56"],
              answers: ["7"],
              why: "$7 \\times 4 = 28$.",
            },
          },
          {
            prompt: "Which is prime?",
            options: ["17", "15", "1"],
            answers: ["17"],
            why: "Only 1 and 17.",
            retry: {
              prompt: "Which of these is prime?",
              options: ["23", "27", "1"],
              answers: ["23"],
              why: "Only 1 and 23.",
            },
          },
          {
            prompt: "How many factors does 12 have?",
            answers: ["6"],
            why: "1, 2, 3, 4, 6, 12.",
            retry: {
              prompt: "How many factors does 16 have?",
              answers: ["5"],
              why: "1, 2, 4, 8, 16.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-factors",
    id: "y7-factors/prime-factors",
    before: PRODUCT,
    title: "Built from primes",
    summary: "Split a number with a factor tree until every branch is prime.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Number atoms",
        text: [
          "Everything is made of atoms. Whole numbers are made of primes: multiply primes together and you can make any of them.",
          "Which primes make 60? By the end of this lesson, you can break any number down.",
        ],
        picture: { kind: "maths", tex: "60 = \\; ? \\times ? \\times \\ldots" },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which is prime?",
        options: [
          { text: "5", correct: true, feedback: "Only 1 and 5." },
          { text: "6", feedback: "$2 \\times 3$." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $2 \\times 2 \\times 3$?",
        answers: ["12"],
        hint: "$4 \\times 3$.",
        done: "12.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A factor tree",
        text: [
          "Split a number into any two factors. Keep splitting each branch until it ends in a prime.",
          "The primes at the ends multiply back to the number: its **product of prime factors**.",
        ],
        picture: { kind: "maths", tex: "12 = 2 \\times 6 = 2 \\times 2 \\times 3" },
      },
      {
        kind: "tree",
        tag: "Discover",
        title: "Grow a factor tree for 60",
        text: "Split 60 into two factors, then keep splitting until every branch ends in a prime.",
        root: 60,
        done: "$60 = 2 \\times 2 \\times 3 \\times 5$.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "36 in index form",
        problem: "Write 36 as a product of primes, using powers.",
        steps: [
          { line: "$36 = 4 \\times 9$", why: "Any factor pair to start." },
          { line: "$4 = 2 \\times 2$, $9 = 3 \\times 3$", why: "Split until prime." },
          {
            line: "$36 = 2 \\times 2 \\times 3 \\times 3 = 2^2 \\times 3^2$",
            why: "Powers count repeats.",
          },
        ],
        done: "$2^2 \\times 3^2$.",
      },
      {
        kind: "tree",
        tag: "Together",
        title: "Try a different way: 84",
        text: "Start with whichever pair you like. Does it matter?",
        root: 84,
        done: "However you split it, 84 ends up as $2 \\times 2 \\times 3 \\times 7$. Every number has just one set of primes.",
      },
      {
        kind: "fill",
        tag: "Together",
        title: "Write 48 in index form",
        template: "$48 = 2^{\\,\\square} \\times 3$: the power of 2 is []",
        bank: ["$4$", "$3$", "$5$", "$2$"],
        answers: ["$4$"],
        hint: "$48 = 2 \\times 24 = 2 \\times 2 \\times 12 = \\ldots$",
        done: "$48 = 2 \\times 2 \\times 2 \\times 2 \\times 3 = 2^4 \\times 3$.",
      },
      {
        kind: "tree",
        tag: "Your turn",
        title: "A factor tree for 90",
        root: 90,
        done: "$90 = 2 \\times 3 \\times 3 \\times 5 = 2 \\times 3^2 \\times 5$.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "$2^3 \\times 5$ is",
        options: [
          { text: "40", correct: true, feedback: "$8 \\times 5$." },
          { text: "30", feedback: "$2^3 = 8$, not 6." },
          { text: "13", feedback: "Multiply, don't add." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Kai writes $60 = 2 \\times 30$ and stops. Is that its product of prime factors?",
        options: [
          {
            text: "No: 30 isn't prime. Keep going: $2 \\times 2 \\times 3 \\times 5$",
            correct: true,
            feedback:
              "Every number at the end must be prime. Stopping too early is the common slip.",
          },
          { text: "Yes", feedback: "30 splits into $2 \\times 3 \\times 5$." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Raj writes 18 as a product of primes.",
        lines: [
          "$18 = 2 \\times 9$",
          "$9 = 3 \\times 3$",
          "So $18 = 2 \\times 3 \\times 3 = 2 \\times 3^3$",
        ],
        wrong: 2,
        why: "There are two 3s, so it's $3^2$: $18 = 2 \\times 3^2$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Number atoms",
        text: "Which primes make 60?",
        options: [
          {
            text: "$2^2 \\times 3 \\times 5$",
            correct: true,
            feedback: "$4 \\times 3 \\times 5 = 60$ ✓",
          },
          { text: "$2 \\times 3 \\times 10$", feedback: "10 isn't prime: $10 = 2 \\times 5$." },
          { text: "$6 \\times 10$", feedback: "Neither 6 nor 10 is prime." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Write 12 as a product of primes.",
            options: ["$2^2 \\times 3$", "$2 \\times 6$", "$3 \\times 4$"],
            answers: ["$2^2 \\times 3$"],
            why: "$2 \\times 2 \\times 3$.",
            retry: {
              prompt: "Write 20 as a product of primes.",
              options: ["$2^2 \\times 5$", "$4 \\times 5$", "$2 \\times 10$"],
              answers: ["$2^2 \\times 5$"],
              why: "$2 \\times 2 \\times 5$.",
            },
          },
          {
            prompt: "Write 45 as a product of primes.",
            options: ["$3^2 \\times 5$", "$9 \\times 5$", "$3 \\times 15$"],
            answers: ["$3^2 \\times 5$"],
            why: "$3 \\times 3 \\times 5$.",
            retry: {
              prompt: "Write 50 as a product of primes.",
              options: ["$2 \\times 5^2$", "$2 \\times 25$", "$5 \\times 10$"],
              answers: ["$2 \\times 5^2$"],
              why: "$2 \\times 5 \\times 5$.",
            },
          },
          {
            prompt: "What number is $2^2 \\times 3 \\times 7$?",
            answers: ["84"],
            why: "$4 \\times 21$.",
            retry: {
              prompt: "What number is $2 \\times 3^2 \\times 5$?",
              answers: ["90"],
              why: "$2 \\times 45$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-factors",
    id: "y7-factors/hcf",
    before: HCF,
    title: "Highest common factor",
    summary: "The biggest number that divides into both: for sharing equally.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Party bags",
        text: [
          "You have 18 sweets and 30 stickers to share into identical party bags, with nothing left over.",
          "What's the most bags you can make? By the end of this lesson, you can find out.",
        ],
        picture: {
          kind: "table",
          rows: [
            ["Sweets", "18"],
            ["Stickers", "30"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many factors does 18 have?",
        answers: ["6"],
        hint: "1, 2, 3, 6, 9, 18.",
        done: "6.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Does 6 divide exactly into 30?",
        text: "Answer the result of $30 \\div 6$.",
        answers: ["5"],
        hint: "How many 6s in 30?",
        done: "Yes: 5. So 6 is a factor of 30.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Common factors",
        text: [
          "Factors of 18: 1, 2, **3**, **6**, 9, 18. Factors of 30: 1, 2, 3, 5, 6, 10, 15, 30.",
          "The ones in both lists are **common factors**: 1, 2, 3, 6. The biggest, 6, is the **highest common factor** (HCF).",
        ],
        picture: {
          kind: "table",
          head: ["", "Factors"],
          rows: [
            ["18", "1, 2, 3, 6, 9, 18"],
            ["30", "1, 2, 3, 5, 6, 10, 15, 30"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "What is the HCF of 12 and 16?",
        answers: ["4"],
        hint: "Factors of 12: 1, 2, 3, 4, 6, 12. Of 16: 1, 2, 4, 8, 16.",
        done: "4: the biggest factor they share.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "HCF of 24 and 36",
        problem: "Find the HCF of 24 and 36.",
        steps: [
          { line: "Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24", why: "List them in pairs." },
          { line: "Factors of 36: 1, 2, 3, 4, 6, 9, 12, 18, 36", why: "And these." },
          { line: "Biggest in both: 12", why: "The highest common one." },
        ],
        done: "HCF = 12.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "HCF of 18 and 30",
        start: "Factors of 18: 1, 2, 3, 6, 9, 18.",
        stages: [
          {
            prompt: "Which of those also divide 30?",
            options: [
              { text: "1, 2, 3, 6", correct: true, feedback: "" },
              { text: "9 and 18", feedback: "30 ÷ 9 isn't whole." },
            ],
            then: "Common: 1, 2, 3, 6",
          },
          {
            prompt: "The HCF is",
            options: [
              { text: "6", correct: true, feedback: "" },
              { text: "1", feedback: "That's the lowest. We want the highest." },
            ],
            then: "6",
          },
        ],
        done: "List one, check against the other.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "HCF of 20 and 21",
        start: "Factors of 20: 1, 2, 4, 5, 10, 20. Of 21: 1, 3, 7, 21.",
        stages: [
          {
            prompt: "Common factors:",
            options: [
              { text: "only 1", correct: true, feedback: "" },
              { text: "none", feedback: "1 divides every number." },
            ],
            then: "HCF = 1",
          },
        ],
        done: "When the HCF is 1, the numbers share no factor but 1.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is the HCF of 18 and 27?",
        answers: ["9"],
        wrong: [{ answer: "3", feedback: "3 is common, but so is a bigger one: 9." }],
        hint: "9 divides both.",
        done: "9.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is the HCF of 16 and 40?",
        answers: ["8"],
        hint: "Factors of 16: 1, 2, 4, 8, 16.",
        done: "8.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Lee says the HCF of 8 and 12 is 24. Is he right?",
        options: [
          {
            text: "No: 24 is a common multiple. The HCF is 4",
            correct: true,
            feedback:
              "A factor can't be bigger than the numbers. Mixing up HCF and LCM is very common.",
          },
          { text: "Yes", feedback: "24 is bigger than both, so it can't divide into them." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ava finds the HCF of 24 and 32.",
        lines: [
          "Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24",
          "Factors of 32: 1, 2, 4, 8, 16, 32",
          "Common factors: 1, 2, 4, so the HCF is 4",
        ],
        wrong: 2,
        why: "She missed 8: it's in both lists. The HCF is 8.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Party bags",
        start: "18 sweets and 30 stickers, shared into identical bags.",
        stages: [
          {
            prompt: "The number of bags must divide both. The most is",
            options: [
              { text: "6: the HCF", correct: true, feedback: "" },
              { text: "90: the LCM", feedback: "You can't have more bags than sweets." },
            ],
            then: "6 bags",
          },
          {
            prompt: "Each bag holds",
            options: [
              { text: "3 sweets and 5 stickers", correct: true, feedback: "" },
              { text: "6 sweets and 6 stickers", feedback: "$18 \\div 6$ and $30 \\div 6$." },
            ],
            then: "3 sweets, 5 stickers",
          },
        ],
        done: "The HCF answers 'the most equal groups'.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What is the HCF of 12 and 18?",
            answers: ["6"],
            why: "Both divide by 6.",
            retry: {
              prompt: "What is the HCF of 15 and 25?",
              answers: ["5"],
              why: "Both divide by 5.",
            },
          },
          {
            prompt: "What is the HCF of 14 and 35?",
            answers: ["7"],
            why: "Both divide by 7.",
            retry: {
              prompt: "What is the HCF of 20 and 30?",
              answers: ["10"],
              why: "Both divide by 10.",
            },
          },
          {
            prompt: "The HCF of two numbers is",
            options: ["never bigger than either number", "bigger than both numbers", "always 1"],
            answers: ["never bigger than either number"],
            why: "It divides into both.",
            retry: {
              prompt: "Which could be the HCF of 30 and 45?",
              options: ["15", "90", "60"],
              answers: ["15"],
              why: "It divides both.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-factors",
    id: "y7-factors/lcm",
    before: LCM,
    title: "Lowest common multiple",
    summary: "The first number in both times tables: for things that repeat.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Buses and trams",
        text: [
          "A bus leaves every 6 minutes and a tram every 8 minutes. Both leave at 9:00.",
          "When do they next leave together? By the end of this lesson, you can find out.",
        ],
        picture: {
          kind: "number-line",
          min: 0,
          max: 24,
          step: 2,
          every: 1,
          marks: [{ at: 0, label: "9:00" }],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is the 4th multiple of 6?",
        answers: ["24"],
        hint: "6, 12, 18, …",
        done: "24.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is the 3rd multiple of 8?",
        answers: ["24"],
        hint: "8, 16, …",
        done: "24.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Common multiples",
        text: [
          "Multiples of 6: 6, 12, 18, **24**, 30, 36, 42, **48**. Multiples of 8: 8, 16, **24**, 32, 40, **48**.",
          "24 and 48 are in both: **common multiples**. The smallest, 24, is the **lowest common multiple** (LCM).",
        ],
        picture: {
          kind: "number-line",
          min: 0,
          max: 48,
          step: 2,
          every: 4,
          marks: [
            { at: 24, label: "24" },
            { at: 48, label: "48" },
          ],
        },
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "What is the LCM of 4 and 6?",
        answers: ["12"],
        wrong: [{ answer: "24", feedback: "24 is common, but there's a smaller one." }],
        hint: "4, 8, 12, … and 6, 12, …",
        done: "12.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "LCM of 9 and 12",
        problem: "Find the LCM of 9 and 12.",
        steps: [
          {
            line: "Multiples of 12: 12, 24, 36, 48, …",
            why: "List the bigger number's: fewer to write.",
          },
          { line: "Is each a multiple of 9? 12 no, 24 no, 36 yes", why: "Check each in turn." },
        ],
        done: "LCM = 36.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "LCM of 6 and 8",
        start: "Multiples of 8: 8, 16, 24, 32, …",
        stages: [
          {
            prompt: "The first that's also a multiple of 6:",
            options: [
              { text: "24", correct: true, feedback: "" },
              { text: "16", feedback: "16 isn't in the 6 times table." },
              { text: "48", feedback: "48 works, but 24 comes first." },
            ],
            then: "24",
          },
        ],
        done: "LCM = 24.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "LCM of 5 and 7",
        start: "Multiples of 7: 7, 14, 21, 28, 35, …",
        stages: [
          {
            prompt: "The first in the 5 times table:",
            options: [
              { text: "35", correct: true, feedback: "" },
              { text: "12", feedback: "That's 5 + 7. Look for a multiple of both." },
            ],
            then: "35",
          },
        ],
        done: "When two numbers share no factor, the LCM is their product.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is the LCM of 3 and 10?",
        answers: ["30"],
        hint: "10, 20, 30: which is in the 3 times table?",
        done: "30.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is the LCM of 10 and 15?",
        answers: ["30"],
        wrong: [
          { answer: "150", feedback: "That's a common multiple, but 30 comes first." },
          { answer: "5", feedback: "5 is the HCF. The LCM is a multiple." },
        ],
        hint: "15, 30, …",
        done: "30.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Bea says the LCM of 4 and 6 is 2. Is she right?",
        options: [
          {
            text: "No: 2 is the HCF. The LCM is 12",
            correct: true,
            feedback: "The LCM is a multiple, so it's at least as big as both numbers.",
          },
          { text: "Yes", feedback: "2 isn't a multiple of 4 or 6." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Tom finds the LCM of 6 and 9.",
        lines: [
          "Multiply them: $6 \\times 9 = 54$",
          "54 is a multiple of both",
          "So the LCM is 54",
        ],
        wrong: 2,
        why: "54 is a common multiple, but not the lowest: 18 is in both tables.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Buses and trams",
        start: "Bus every 6 minutes, tram every 8, both at 9:00.",
        stages: [
          {
            prompt: "They meet again after the LCM of 6 and 8:",
            options: [
              { text: "24 minutes", correct: true, feedback: "" },
              { text: "48 minutes", feedback: "They also meet then, but sooner first." },
              { text: "2 minutes", feedback: "That's the HCF." },
            ],
            then: "24 minutes",
          },
          {
            prompt: "So they next leave together at",
            options: [
              { text: "9:24", correct: true, feedback: "" },
              { text: "9:14", feedback: "6 + 8 isn't the point: 24 minutes." },
            ],
            then: "9:24",
          },
        ],
        done: "The LCM answers 'when do they happen together again'.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What is the LCM of 4 and 10?",
            answers: ["20"],
            why: "10, 20.",
            retry: { prompt: "What is the LCM of 6 and 10?", answers: ["30"], why: "10, 20, 30." },
          },
          {
            prompt: "What is the LCM of 3 and 8?",
            answers: ["24"],
            why: "8, 16, 24.",
            retry: {
              prompt: "What is the LCM of 4 and 9?",
              answers: ["36"],
              why: "9, 18, 27, 36.",
            },
          },
          {
            prompt:
              "Lights flash every 4 s and every 6 s, together at the start. After how many seconds are they together again?",
            answers: ["12"],
            why: "LCM of 4 and 6.",
            retry: {
              prompt:
                "Bells ring every 5 min and every 3 min, together at the start. After how many minutes are they together again?",
              answers: ["15"],
              why: "LCM of 5 and 3.",
            },
          },
        ],
      },
    ],
  },
];
