// Year 7, "Powers and roots", as four short lessons, one just before each skill: squares and
// square roots, cubes and cube roots, powers of 2, 3, 4 and 5 and higher roots, and exact roots
// against decimal estimates. Each starts from something quick, builds the idea a step at a time,
// names the common mistakes, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const SQUARES = "Y7-NPV-07.a";
const CUBES = "Y7-NPV-07.b";
const POWERS = "Y7-NPV-07.c";
const EXACT = "Y7-NPV-07.d";

export const y7Powers: UnitLesson[] = [
  {
    unit: "y7-powers",
    id: "y7-powers/squares",
    before: SQUARES,
    title: "Squares and square roots",
    summary: "A square number makes a square; its square root is the length of the side.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A square lawn",
        text: [
          "A square lawn needs 49 m² of turf. Ali needs to know how long each side is, to buy the edging.",
          "How long is a side? By the end of this lesson, you can work it out.",
        ],
        picture: { kind: "grid", cols: 7, rows: 7, shaded: 49 },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $6 \\times 6$?",
        answers: ["36"],
        hint: "Six sixes.",
        done: "36.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What times itself makes 25?",
        answers: ["5"],
        hint: "Try 4, 5, 6.",
        done: "5.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Square numbers",
        text: [
          "$4 \\times 4 = 16$: 16 squares make a 4 by 4 square. So 16 is a **square number**, written $4^2$.",
          "Squares: 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, …",
        ],
        picture: { kind: "dots", shape: "square", terms: 4 },
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Square roots go back",
        text: [
          "The **square root**, $\\sqrt{\\;}$, undoes squaring: it finds the side from the area. $\\sqrt{16} = 4$, since $4^2 = 16$.",
          "Every positive number has a negative square root too: $(-4)^2 = 16$ as well.",
        ],
        picture: {
          kind: "maths",
          tex: "4 \\xrightarrow{\\text{square}} 16 \\xrightarrow{\\sqrt{\\;}} 4",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Squares and roots",
        problem: "Work out $9^2$ and $\\sqrt{81}$.",
        steps: [
          { line: "$9^2 = 9 \\times 9 = 81$", why: "Square: times by itself." },
          { line: "$\\sqrt{81} = 9$", why: "What times itself is 81? 9." },
        ],
        done: "Square and square root undo each other.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$\\sqrt{64} + 3^2$",
        start: "$\\sqrt{64} + 3^2$",
        stages: [
          {
            prompt: "$\\sqrt{64} =$",
            options: [
              { text: "8", correct: true, feedback: "" },
              { text: "32", feedback: "That halves. $8 \\times 8 = 64$." },
            ],
            then: "$8 + 3^2$",
          },
          {
            prompt: "$3^2 =$",
            options: [
              { text: "9", correct: true, feedback: "" },
              { text: "6", feedback: "$3 \\times 3$." },
            ],
            then: "$8 + 9 = 17$",
          },
        ],
        done: "17.",
      },
      {
        kind: "fill",
        tag: "Together",
        title: "Fill the gaps",
        template: "$11^2 =$ [] and $\\sqrt{144} =$ []",
        bank: ["$121$", "$22$", "$12$", "$72$"],
        answers: ["$121$", "$12$"],
        hint: "$11 \\times 11$; and what times itself is 144?",
        done: "121 and 12.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is $\\sqrt{100}$?",
        answers: ["10"],
        wrong: [{ answer: "50", feedback: "Square root isn't halving: $10 \\times 10 = 100$." }],
        hint: "What times itself is 100?",
        done: "10.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is $15^2$?",
        answers: ["225"],
        wrong: [{ answer: "30", feedback: "That's $15 \\times 2$." }],
        hint: "$15 \\times 15 = 150 + 75$.",
        done: "225.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Ben says $\\sqrt{36} = 18$. Is he right?",
        options: [
          {
            text: "No: $\\sqrt{36} = 6$, because $6 \\times 6 = 36$",
            correct: true,
            feedback:
              "Halving instead of rooting is the most common slip. And $7^2$ isn't 14 either!",
          },
          { text: "Yes", feedback: "$18 \\times 18 = 324$." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Isla lists square numbers.",
        lines: ["$1^2 = 1$, $2^2 = 4$, $3^2 = 9$", "$4^2 = 8$", "$5^2 = 25$"],
        wrong: 1,
        why: "$4^2 = 4 \\times 4 = 16$, not $4 \\times 2$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "A square lawn",
        text: "The lawn is 49 m². How long is a side, in metres?",
        picture: { kind: "grid", cols: 7, rows: 7, shaded: 49 },
        answers: ["7"],
        wrong: [{ answer: "24.5", feedback: "That halves 49. Find the square root." }],
        hint: "$\\sqrt{49}$.",
        done: "7 m: $7 \\times 7 = 49$.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What is $8^2$?",
            answers: ["64"],
            why: "$8 \\times 8$.",
            retry: { prompt: "What is $12^2$?", answers: ["144"], why: "$12 \\times 12$." },
          },
          {
            prompt: "What is $\\sqrt{49}$?",
            answers: ["7"],
            why: "$7 \\times 7 = 49$.",
            retry: {
              prompt: "What is $\\sqrt{121}$?",
              answers: ["11"],
              why: "$11 \\times 11 = 121$.",
            },
          },
          {
            prompt: "Which is a square number?",
            options: ["81", "50", "18"],
            answers: ["81"],
            why: "$9^2$.",
            retry: {
              prompt: "Which of these is a square number?",
              options: ["64", "40", "32"],
              answers: ["64"],
              why: "$8^2$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-powers",
    id: "y7-powers/cubes",
    before: CUBES,
    title: "Cubes and cube roots",
    summary: "A cube number makes a cube; its cube root is the length of an edge.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A cube of sugar",
        text: [
          "A box is a cube made of 64 sugar cubes.",
          "How many sugar cubes long is each edge? By the end of this lesson, you can work it out.",
        ],
        picture: { kind: "cuboid", w: 4, d: 4, h: 4, cubes: true },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $4 \\times 4$?",
        answers: ["16"],
        hint: "Four fours.",
        done: "16.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $16 \\times 4$?",
        answers: ["64"],
        hint: "$16 \\times 2 \\times 2$.",
        done: "64.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Cube numbers",
        text: [
          "A 2 by 2 by 2 cube is made of $2 \\times 2 \\times 2 = 8$ small cubes. So 8 is a **cube number**, $2^3$.",
          "Cubes: 1, 8, 27, 64, 125, …",
        ],
        picture: { kind: "cuboid", w: 2, d: 2, h: 2, cubes: true },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "$3^3 =$",
        picture: { kind: "cuboid", w: 3, d: 3, h: 3, cubes: true },
        options: [
          {
            text: "27",
            correct: true,
            feedback: "$3 \\times 3 \\times 3$: 9 in each layer, 3 layers.",
          },
          { text: "9", feedback: "That's one layer. There are 3 layers." },
          { text: "6", feedback: "That's $3 \\times 2$." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Cube roots",
        text: [
          "The **cube root**, $\\sqrt[3]{\\;}$, undoes cubing: $\\sqrt[3]{27} = 3$, because $3^3 = 27$.",
          "Unlike square roots, a negative number has a cube root: $\\sqrt[3]{-8} = -2$.",
        ],
        picture: {
          kind: "maths",
          tex: "3 \\xrightarrow{\\text{cube}} 27 \\xrightarrow{\\sqrt[3]{\\;}} 3",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "$5^3$ and $\\sqrt[3]{1000}$",
        problem: "Work out $5^3$ and $\\sqrt[3]{1000}$.",
        steps: [
          { line: "$5^3 = 5 \\times 5 \\times 5 = 125$", why: "25, then 125." },
          { line: "$\\sqrt[3]{1000} = 10$", why: "$10 \\times 10 \\times 10 = 1000$." },
        ],
        done: "Cube and cube root undo each other.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$4^3$",
        start: "$4^3 = 4 \\times 4 \\times 4$",
        stages: [
          {
            prompt: "$4 \\times 4 =$",
            options: [
              { text: "16", correct: true, feedback: "" },
              { text: "8", feedback: "Multiply." },
            ],
            then: "$16 \\times 4$",
          },
          {
            prompt: "$16 \\times 4 =$",
            options: [
              { text: "64", correct: true, feedback: "" },
              { text: "12", feedback: "That's $4 \\times 3$." },
            ],
            then: "64",
          },
        ],
        done: "$4^3 = 64$.",
      },
      {
        kind: "fill",
        tag: "Together",
        title: "Fill the gaps",
        template: "$\\sqrt[3]{8} =$ [] and $\\sqrt[3]{125} =$ []",
        bank: ["$2$", "$4$", "$5$", "$25$"],
        answers: ["$2$", "$5$"],
        hint: "What cubed is 8? What cubed is 125?",
        done: "2 and 5.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is $10^3$?",
        answers: ["1000"],
        wrong: [{ answer: "30", feedback: "That's $10 \\times 3$." }],
        hint: "$10 \\times 10 \\times 10$.",
        done: "1000.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is $\\sqrt[3]{-27}$?",
        answers: ["-3", "−3"],
        hint: "$(-3) \\times (-3) \\times (-3)$.",
        done: "−3: $9 \\times -3 = -27$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Sam says $2^3 = 6$. Is he right?",
        options: [
          {
            text: "No: $2^3 = 2 \\times 2 \\times 2 = 8$",
            correct: true,
            feedback: "The power counts how many times to multiply, not what to multiply by.",
          },
          { text: "Yes", feedback: "$2 \\times 3 = 6$, but $2^3$ is three 2s multiplied." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Raj finds $\\sqrt[3]{64}$.",
        lines: ["The cube root undoes cubing", "$64 \\div 3 = 21.3$", "So $\\sqrt[3]{64} = 21.3$"],
        wrong: 1,
        why: "The cube root isn't dividing by 3. What cubed is 64? $4 \\times 4 \\times 4 = 64$, so it's 4.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "A cube of sugar",
        text: "64 sugar cubes make a cube. How many long is each edge?",
        picture: { kind: "cuboid", w: 4, d: 4, h: 4, cubes: true },
        answers: ["4"],
        hint: "$\\sqrt[3]{64}$.",
        done: "4: $4 \\times 4 \\times 4 = 64$.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What is $3^3$?",
            answers: ["27"],
            why: "$3 \\times 3 \\times 3$.",
            retry: { prompt: "What is $5^3$?", answers: ["125"], why: "$5 \\times 5 \\times 5$." },
          },
          {
            prompt: "What is $\\sqrt[3]{8}$?",
            answers: ["2"],
            why: "$2^3 = 8$.",
            retry: { prompt: "What is $\\sqrt[3]{1000}$?", answers: ["10"], why: "$10^3 = 1000$." },
          },
          {
            prompt: "Which is a cube number?",
            options: ["125", "100", "36"],
            answers: ["125"],
            why: "$5^3$.",
            retry: {
              prompt: "Which of these is a cube number?",
              options: ["27", "9", "16"],
              answers: ["27"],
              why: "$3^3$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-powers",
    id: "y7-powers/higher-powers",
    before: POWERS,
    title: "Higher powers",
    summary: "Powers of 2, 3, 4 and 5, and the roots that undo them.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Folding paper",
        text: [
          "Fold a sheet of paper in half, and it's 2 layers thick. Fold again: 4. Again: 8.",
          "How many layers after 6 folds? By the end of this lesson, you can work it out quickly.",
        ],
        picture: { kind: "stacks", counts: [2, 4, 8, 16], labels: ["1 fold", "2", "3", "4"] },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $2^3$?",
        answers: ["8"],
        hint: "$2 \\times 2 \\times 2$.",
        done: "8.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $8 \\times 2$?",
        answers: ["16"],
        hint: "Double 8.",
        done: "16.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Powers of 2",
        text: [
          "Each fold doubles: $2^1 = 2$, $2^2 = 4$, $2^3 = 8$, $2^4 = 16$, $2^5 = 32$, …",
          "The power says how many 2s are multiplied. Each step up multiplies by 2 again.",
        ],
        picture: {
          kind: "stacks",
          counts: [2, 4, 8, 16, 32],
          labels: ["2¹", "2²", "2³", "2⁴", "2⁵"],
        },
      },
      {
        kind: "fill",
        tag: "Discover",
        title: "Powers of 3",
        template: "$3^1 = 3$, $3^2 = 9$, $3^3 =$ [], $3^4 =$ []",
        bank: ["$27$", "$81$", "$12$", "$18$", "$64$"],
        answers: ["$27$", "$81$"],
        hint: "Each step × 3.",
        done: "27 and 81: × 3 each time.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "$2^6$ and a 4th root",
        problem: "Work out $2^6$ and $\\sqrt[4]{16}$.",
        steps: [
          {
            line: "$2^6 = 2^5 \\times 2 = 32 \\times 2 = 64$",
            why: "One more doubling than $2^5$.",
          },
          { line: "$\\sqrt[4]{16} = 2$", why: "What to the power 4 is 16? $2^4 = 16$." },
        ],
        done: "Roots undo powers: the little number on the root matches the power.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$5^4$",
        start: "$5^4 = 5 \\times 5 \\times 5 \\times 5$",
        stages: [
          {
            prompt: "$5^3 = 125$, so $5^4 =$",
            options: [
              { text: "625", correct: true, feedback: "" },
              { text: "130", feedback: "Multiply by 5 again, don't add." },
            ],
            then: "625",
          },
        ],
        done: "Build from the power before.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$\\sqrt[5]{32}$",
        start: "What to the power 5 is 32?",
        stages: [
          {
            prompt: "Try 2: $2^5 =$",
            options: [
              { text: "32", correct: true, feedback: "" },
              { text: "10", feedback: "$2 \\times 2 \\times 2 \\times 2 \\times 2$." },
            ],
            then: "$2^5 = 32$",
          },
          {
            prompt: "So $\\sqrt[5]{32} =$",
            options: [
              { text: "2", correct: true, feedback: "" },
              { text: "6.4", feedback: "That divides by 5." },
            ],
            then: "2",
          },
        ],
        done: "Know the powers, and the roots come free.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is $4^3$?",
        answers: ["64"],
        wrong: [{ answer: "12", feedback: "That's $4 \\times 3$." }],
        hint: "$4 \\times 4 \\times 4$.",
        done: "64.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is $\\sqrt[4]{81}$?",
        answers: ["3"],
        hint: "$3^4 = 81$.",
        done: "3.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Mo says $2^5 = 10$. Is he right?",
        options: [
          {
            text: "No: $2^5 = 32$",
            correct: true,
            feedback: "Five 2s multiplied, not 2 times 5. Powers grow fast!",
          },
          {
            text: "Yes",
            feedback: "$2 \\times 5 = 10$, but $2^5 = 2 \\times 2 \\times 2 \\times 2 \\times 2$.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Eve lists powers of 3.",
        lines: ["$3^1 = 3$, $3^2 = 9$", "$3^3 = 12$", "$3^4 = 36$"],
        wrong: 1,
        why: "Each step multiplies by 3, not adds 3: $3^3 = 27$, $3^4 = 81$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Folding paper",
        text: "After 6 folds, how many layers?",
        answers: ["64"],
        wrong: [{ answer: "12", feedback: "Each fold doubles: it's $2^6$, not $2 \\times 6$." }],
        hint: "$2^6$.",
        done: "$2^6 = 64$ layers. After 10 folds it would be 1024!",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What is $2^4$?",
            answers: ["16"],
            why: "Four 2s.",
            retry: { prompt: "What is $2^7$?", answers: ["128"], why: "Seven 2s." },
          },
          {
            prompt: "What is $10^4$?",
            answers: ["10000", "10,000"],
            why: "Four 10s.",
            retry: { prompt: "What is $3^4$?", answers: ["81"], why: "Four 3s." },
          },
          {
            prompt: "What is $\\sqrt[4]{625}$?",
            answers: ["5"],
            why: "$5^4 = 625$.",
            retry: { prompt: "What is $\\sqrt[5]{243}$?", answers: ["3"], why: "$3^5 = 243$." },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-powers",
    id: "y7-powers/exact",
    before: EXACT,
    title: "Exact or estimated?",
    summary: "Some roots are whole numbers; others are long decimals you can estimate.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A square table",
        text: [
          "A square table top has an area of 2 m². A calculator says its side is 1.414213562… m.",
          "Is that exact? Could you estimate it without a calculator? By the end of this lesson, you can.",
        ],
        picture: { kind: "maths", tex: "\\sqrt{2} = 1.414213562\\ldots" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $\\sqrt{25}$?",
        answers: ["5"],
        hint: "$5 \\times 5$.",
        done: "5.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $\\sqrt{36}$?",
        answers: ["6"],
        hint: "$6 \\times 6$.",
        done: "6.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Between two squares",
        text: [
          "30 isn't a square number. It's between 25 and 36, so $\\sqrt{30}$ is between 5 and 6.",
          "30 is a bit nearer 25, so $\\sqrt{30}$ is about 5.5: actually 5.477…",
        ],
        picture: {
          kind: "number-line",
          min: 4,
          max: 7,
          step: 0.5,
          marks: [
            { at: 5, label: "√25" },
            { at: 6, label: "√36" },
            { at: 5.5, label: "√30?" },
          ],
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "$\\sqrt{50}$ is between",
        options: [
          { text: "7 and 8", correct: true, feedback: "$7^2 = 49$, $8^2 = 64$." },
          { text: "25 and 26", feedback: "That's halving. Find the squares either side of 50." },
          { text: "6 and 7", feedback: "$7^2 = 49$, so it's just over 7." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Exact and not",
        text: [
          "$\\sqrt{49} = 7$ exactly: 49 is a square number. $\\sqrt{50}$ is a decimal that never ends or repeats: 7.0710678…",
          "Leaving it as $\\sqrt{50}$ is exact. Any decimal you write is an **approximation**.",
        ],
        picture: { kind: "maths", tex: "\\sqrt{49} = 7 \\qquad \\sqrt{50} \\approx 7.07" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Estimate $\\sqrt{90}$",
        problem: "Estimate $\\sqrt{90}$.",
        steps: [
          { line: "$9^2 = 81$, $10^2 = 100$", why: "Squares either side of 90." },
          { line: "So $\\sqrt{90}$ is between 9 and 10", why: "90 sits between them." },
          { line: "90 is about halfway: roughly 9.5", why: "Actual: 9.486…" },
        ],
        done: "About 9.5.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Estimate $\\sqrt{20}$",
        start: "$\\sqrt{20}$",
        stages: [
          {
            prompt: "The squares either side of 20:",
            options: [
              { text: "16 and 25", correct: true, feedback: "" },
              { text: "10 and 30", feedback: "Square numbers: 16 = 4², 25 = 5²." },
            ],
            then: "Between 4 and 5",
          },
          {
            prompt: "20 is nearer 16, so $\\sqrt{20} \\approx$",
            options: [
              { text: "4.5", correct: true, feedback: "" },
              { text: "10", feedback: "That halves 20. It's between 4 and 5." },
            ],
            then: "About 4.5 (actually 4.47…)",
          },
        ],
        done: "Squares either side, then judge.",
      },
      {
        kind: "sort",
        tag: "Together",
        title: "Exact whole number, or not?",
        groups: ["A whole number", "A never-ending decimal"],
        items: [
          { text: "$\\sqrt{64}$", group: 0, why: "$8^2 = 64$." },
          { text: "$\\sqrt{1}$", group: 0, why: "$1^2 = 1$." },
          { text: "$\\sqrt[3]{27}$", group: 0, why: "$3^3 = 27$." },
          { text: "$\\sqrt{10}$", group: 1, why: "10 isn't a square." },
          { text: "$\\sqrt{2}$", group: 1, why: "2 isn't a square." },
          { text: "$\\sqrt{40}$", group: 1, why: "40 isn't a square." },
        ],
        done: "Only square numbers have whole-number square roots.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "$\\sqrt{75}$ is between",
        options: [
          { text: "8 and 9", correct: true, feedback: "64 and 81." },
          { text: "37 and 38", feedback: "That halves 75." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Estimate $\\sqrt{99}$ to the nearest whole number",
        answers: ["10"],
        hint: "$10^2 = 100$.",
        done: "10: 99 is just under 100.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Tia says $\\sqrt{40} = 20$. Is she right?",
        options: [
          {
            text: "No: $20^2 = 400$. $\\sqrt{40}$ is about 6.3",
            correct: true,
            feedback:
              "Halving isn't rooting. 40 is between 36 and 49, so its root is between 6 and 7.",
          },
          { text: "Yes", feedback: "$20 \\times 20 = 400$." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ben estimates $\\sqrt{60}$.",
        lines: [
          "$7^2 = 49$ and $8^2 = 64$",
          "So $\\sqrt{60}$ is between 7 and 8",
          "60 is nearer 49, so about 7.2",
        ],
        wrong: 2,
        why: "60 is nearer **64** (4 away) than 49 (11 away). So about 7.7: it's 7.746…",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "A square table",
        text: "The side is $\\sqrt{2}$ m. Is 1.414213562 exact?",
        options: [
          {
            text: "No: it's an approximation; $\\sqrt{2}$ never ends",
            correct: true,
            feedback: "$\\sqrt{2}$ is between 1 and 2 (squares 1 and 4), closer to 1: about 1.4.",
          },
          {
            text: "Yes, it's exact",
            feedback: "$1.414213562^2$ is a tiny bit off 2. The decimal goes on forever.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$\\sqrt{30}$ is between",
            options: ["5 and 6", "15 and 16", "4 and 5"],
            answers: ["5 and 6"],
            why: "25 and 36.",
            retry: {
              prompt: "$\\sqrt{55}$ is between",
              options: ["7 and 8", "27 and 28", "6 and 7"],
              answers: ["7 and 8"],
              why: "49 and 64.",
            },
          },
          {
            prompt: "Which is a whole number?",
            options: ["$\\sqrt{81}$", "$\\sqrt{80}$", "$\\sqrt{8}$"],
            answers: ["$\\sqrt{81}$"],
            why: "$9^2 = 81$.",
            retry: {
              prompt: "Which of these is a whole number?",
              options: ["$\\sqrt{144}$", "$\\sqrt{140}$", "$\\sqrt{14}$"],
              answers: ["$\\sqrt{144}$"],
              why: "$12^2 = 144$.",
            },
          },
          {
            prompt: "Estimate $\\sqrt{17}$ to the nearest whole number.",
            answers: ["4"],
            why: "Just over $\\sqrt{16}$.",
            retry: {
              prompt: "Estimate $\\sqrt{35}$ to the nearest whole number.",
              answers: ["6"],
              why: "Just under $\\sqrt{36}$.",
            },
          },
        ],
      },
    ],
  },
];
