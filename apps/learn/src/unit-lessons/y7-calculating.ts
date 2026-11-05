// Year 7, "Calculating", as five short lessons, one just before each skill: negative numbers
// (hops on a number line, and a pattern for multiplying), decimals (line up the point; count the
// decimal places), fractions (same-size parts to add; tops and bottoms to multiply), mixed
// numbers, and inverse operations (undo it backwards). Each starts from something quick, builds
// the idea a step at a time, names the common mistakes, and ends on an exit check.
import type { BarsPic, NumberLinePic, UnitLesson } from "./types.ts";

const NEGATIVES = "Y7-NPV-03.a";
const DECIMALS = "Y7-NPV-03.b";
const FRACTIONS = "Y7-NPV-03.c";
const MIXED = "Y7-NPV-03.d";
const INVERSE = "Y7-NPV-06";

/** A number line from −10 to 10 with hops on it. */
const hops = (
  jumps: { from: number; to: number; label: string }[],
  marks: number[] = [],
): NumberLinePic => ({
  kind: "number-line",
  min: -10,
  max: 10,
  step: 1,
  every: 2,
  jumps,
  marks: marks.map((at) => ({ at })),
});

/** A bar cut into equal parts, some shaded, for each fraction. */
const bars = (rows: [string, number, number][]): BarsPic => ({
  kind: "bars",
  rows: rows.map(([label, parts, shaded]) => ({ label, parts, shaded })),
});

export const y7Calculating: UnitLesson[] = [
  {
    unit: "y7-calculating",
    id: "y7-calculating/negatives",
    before: NEGATIVES,
    title: "Negative numbers",
    summary:
      "Add and take away with negatives by hopping on a number line; multiply by spotting the pattern.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The diver",
        text: [
          "A diver is 4 m below the surface: at −4 m. She dives down another 8 m, then rises 5 m.",
          "Where is she now? By the end of this lesson, you can calculate with numbers below zero.",
        ],
        picture: hops([], [-4]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $7 - 3$?",
        answers: ["4"],
        hint: "Count back 3 from 7.",
        done: "4.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3 - 7$?",
        text: "Count back past zero.",
        answers: ["-4", "−4"],
        wrong: [{ answer: "4", feedback: "Count back 7 from 3: you pass 0 and keep going." }],
        hint: "3, 2, 1, 0, −1, …",
        done: "−4: 4 below zero.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Hops on a number line",
        text: [
          "On a number line, **adding** hops right and **taking away** hops left.",
          "$2 - 5$ starts at 2 and hops 5 to the left, past 0, landing on $-3$.",
        ],
        picture: hops([{ from: 2, to: -3, label: "−5" }], [2, -3]),
      },
      {
        kind: "place",
        tag: "Discover",
        title: "Where do you land?",
        text: "Start at the first number and hop.",
        line: { kind: "number-line", min: -8, max: 8, step: 1, every: 2 },
        targets: [
          { value: -4, label: "$3 - 7$", mark: "3 − 7" },
          { value: -5, label: "$-2 - 3$", mark: "−2 − 3" },
          { value: 3, label: "$-6 + 9$", mark: "−6 + 9" },
        ],
        hint: "Start at the first number. Taking away hops left, adding hops right.",
        done: "$3 - 7 = -4$, $-2 - 3 = -5$ and $-6 + 9 = 3$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Spot the pattern: what is $3 \\times -1$?",
        picture: {
          kind: "table",
          rows: [
            ["$3 \\times 2$", "$6$"],
            ["$3 \\times 1$", "$3$"],
            ["$3 \\times 0$", "$0$"],
            ["$3 \\times -1$", "?"],
          ],
        },
        options: [
          {
            text: "$-3$",
            correct: true,
            feedback:
              "Each answer goes down by 3, so after 0 comes −3. Positive × negative is negative.",
          },
          { text: "$3$", feedback: "Follow the pattern: 6, 3, 0, … it keeps going down by 3." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Now: what is $-3 \\times -1$?",
        picture: {
          kind: "table",
          rows: [
            ["$-3 \\times 2$", "$-6$"],
            ["$-3 \\times 1$", "$-3$"],
            ["$-3 \\times 0$", "$0$"],
            ["$-3 \\times -1$", "?"],
          ],
        },
        options: [
          {
            text: "$3$",
            correct: true,
            feedback: "The answers go up by 3: −6, −3, 0, 3. **Negative × negative is positive.**",
          },
          { text: "$-3$", feedback: "Follow the pattern: −6, −3, 0, … it goes up by 3." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Taking away a negative",
        problem: "Work out $5 - (-3)$ and $-4 \\times 5$.",
        steps: [
          {
            line: "$5 - (-3) = 5 + 3 = 8$",
            why: "Taking away a debt of 3 leaves you 3 better off: subtracting a negative adds.",
          },
          { line: "$-4 \\times 5 = -20$", why: "4 × 5 = 20; one negative sign, so negative." },
        ],
        done: "Signs: same signs multiply to positive; different signs to negative.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$-6 + 2$",
        start: "$-6 + 2$",
        stages: [
          {
            prompt: "Start at −6. Adding 2 hops",
            options: [
              { text: "2 to the right", correct: true, feedback: "" },
              { text: "2 to the left", feedback: "Adding hops right." },
            ],
            then: "From −6, two right",
          },
          {
            prompt: "You land on",
            options: [
              { text: "−4", correct: true, feedback: "" },
              { text: "−8", feedback: "That hops left. Right from −6 is −5, −4." },
              { text: "8", feedback: "Start at −6, not 6." },
            ],
            then: "$-6 + 2 = -4$",
          },
        ],
        done: "Hop and count.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$-4 \\times -5$",
        start: "$-4 \\times -5$",
        stages: [
          {
            prompt: "Ignore the signs: $4 \\times 5 =$",
            options: [
              { text: "20", correct: true, feedback: "" },
              { text: "9", feedback: "Multiply, don't add." },
            ],
            then: "20",
          },
          {
            prompt: "Two negatives, so the answer is",
            options: [
              { text: "$20$", correct: true, feedback: "" },
              { text: "$-20$", feedback: "Negative × negative is positive." },
            ],
            then: "$-4 \\times -5 = 20$",
          },
        ],
        done: "Work out the number, then the sign.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is $-3 - 5$?",
        answers: ["-8", "−8"],
        wrong: [
          { answer: "-2", feedback: "Start at −3 and hop 5 more to the left." },
          { answer: "2", feedback: "Taking away hops left from −3." },
        ],
        hint: "Start at −3; hop 5 left.",
        done: "−8.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is $-6 \\times 3$?",
        answers: ["-18", "−18"],
        wrong: [{ answer: "18", feedback: "Different signs: negative." }],
        hint: "$6 \\times 3 = 18$; one negative.",
        done: "−18.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Tom says $-2 - 3 = 1$, because two negatives make a positive. Is he right?",
        options: [
          {
            text: "No: that rule is for multiplying. $-2 - 3 = -5$",
            correct: true,
            feedback:
              "Start at −2 and hop 3 left: −5. 'Two negatives make a positive' only works for × and ÷.",
          },
          { text: "Yes", feedback: "Hop it on the number line: from −2, three to the left." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ana works out $-7 + 10$.",
        lines: ["Start at −7", "Adding hops left", "So she lands on −17"],
        wrong: 1,
        why: "Adding hops **right**: from −7, ten to the right is 3.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The diver",
        text: "She starts at −4 m, dives down 8 m, then rises 5 m. Where is she?",
        picture: hops([{ from: -4, to: -12, label: "−8" }]),
        answers: ["-7", "−7"],
        unit: "m",
        wrong: [{ answer: "-17", feedback: "Rising 5 m goes up: add 5." }],
        hint: "$-4 - 8 + 5$.",
        done: "$-4 - 8 = -12$, then $-12 + 5 = -7$ m: 7 m below the surface.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What is $-5 + 8$?",
            answers: ["3"],
            why: "From −5, eight right.",
            retry: {
              prompt: "What is $-9 + 4$?",
              answers: ["-5", "−5"],
              why: "From −9, four right.",
            },
          },
          {
            prompt: "What is $2 - 9$?",
            answers: ["-7", "−7"],
            why: "From 2, nine left.",
            retry: {
              prompt: "What is $-1 - 6$?",
              answers: ["-7", "−7"],
              why: "From −1, six left.",
            },
          },
          {
            prompt: "What is $-7 \\times -3$?",
            answers: ["21"],
            why: "Two negatives: positive.",
            retry: {
              prompt: "What is $-8 \\times 2$?",
              answers: ["-16", "−16"],
              why: "Different signs: negative.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-calculating",
    id: "y7-calculating/decimals",
    before: DECIMALS,
    title: "Calculating with decimals",
    summary: "Line up the points to add; count the decimal places to multiply.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "At the shop",
        text: [
          "You buy a sandwich for £3.45, a drink for £1.20 and fruit at £0.65 a piece, two pieces.",
          "How much change do you get from £10? By the end of this lesson, you can work it out without a calculator.",
        ],
        picture: {
          kind: "table",
          rows: [
            ["Sandwich", "£3.45"],
            ["Drink", "£1.20"],
            ["Fruit × 2", "£0.65 each"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $345 + 120$?",
        answers: ["465"],
        hint: "Hundreds, tens, ones.",
        done: "465.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $13 \\times 2$?",
        answers: ["26"],
        hint: "Double 13.",
        done: "26.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Line up the points",
        text: [
          "To add or take away decimals, line up the decimal points, so tenths sit under tenths and hundredths under hundredths.",
          "Fill gaps with zeros: $4.7 + 2.85$ becomes $4.70 + 2.85$.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{array}{r} 4.70 \\\\ +\\; 2.85 \\\\ \\hline 7.55 \\end{array}",
        },
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "Work out $4.7 + 2.85$",
        answers: ["7.55"],
        wrong: [
          { answer: "3.32", feedback: "Line up the points: 4.70 + 2.85." },
          { answer: "6.92", feedback: "The 7 is tenths, so it goes under the 8: 4.70 + 2.85." },
        ],
        hint: "Write 4.7 as 4.70.",
        done: "$4.70 + 2.85 = 7.55$.",
      },
      {
        kind: "steps",
        tag: "Discover",
        title: "Multiplying: a part of a part",
        start: "$0.3 \\times 0.2$",
        stages: [
          {
            prompt: "First, ignore the points. What is $3 \\times 2$?",
            options: [
              { text: "$6$", correct: true, feedback: "" },
              { text: "$5$", feedback: "That's $3 + 2$." },
            ],
            then: "$3 \\times 2 = 6$",
          },
          {
            prompt:
              "0.3 and 0.2 have one decimal place each, so the answer has two. So $0.3 \\times 0.2 =$",
            options: [
              { text: "$0.06$", correct: true, feedback: "" },
              { text: "$0.6$", feedback: "Count the decimal places: one each, so two in all." },
            ],
            then: "$0.3 \\times 0.2 = 0.06$",
          },
        ],
        done: "0.3 of 0.2 is smaller than both. Multiply as whole numbers, then count the decimal places.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "$1.45 \\times 3$",
        problem: "Work out $1.45 \\times 3$.",
        steps: [
          { line: "$145 \\times 3 = 435$", why: "Ignore the point and multiply." },
          { line: "1.45 has 2 decimal places", why: "Count them in the question." },
          { line: "$1.45 \\times 3 = 4.35$", why: "Put 2 decimal places back." },
        ],
        done: "Estimate to check: about $1.5 \\times 3 = 4.5$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$10 - 3.65$",
        start: "$10 - 3.65$",
        stages: [
          {
            prompt: "Line up the points: write 10 as",
            options: [
              { text: "10.00", correct: true, feedback: "" },
              { text: "0.10", feedback: "10 is ten whole ones: 10.00." },
            ],
            then: "$10.00 - 3.65$",
          },
          {
            prompt: "So the answer is",
            options: [
              { text: "6.35", correct: true, feedback: "" },
              { text: "7.45", feedback: "Count up from 3.65: 0.35 to 4, then 6 more to 10." },
            ],
            then: "$6.35$",
          },
        ],
        done: "Check: $6.35 + 3.65 = 10$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$0.4 \\times 0.7$",
        start: "$0.4 \\times 0.7$",
        stages: [
          {
            prompt: "$4 \\times 7 =$",
            options: [
              { text: "28", correct: true, feedback: "" },
              { text: "11", feedback: "Multiply." },
            ],
            then: "28",
          },
          {
            prompt: "Two decimal places in all:",
            options: [
              { text: "0.28", correct: true, feedback: "" },
              { text: "2.8", feedback: "One place each, so two in the answer." },
            ],
            then: "$0.4 \\times 0.7 = 0.28$",
          },
        ],
        done: "Multiplying by a number less than 1 makes it smaller.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Work out $6.3 - 2.48$",
        answers: ["3.82"],
        wrong: [{ answer: "4.25", feedback: "Line up the points: 6.30 − 2.48." }],
        hint: "Write 6.3 as 6.30.",
        done: "$6.30 - 2.48 = 3.82$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Work out $0.6 \\times 0.5$",
        answers: ["0.3", "0.30"],
        wrong: [
          { answer: "3", feedback: "Two decimal places: 0.30." },
          { answer: "0.03", feedback: "$6 \\times 5 = 30$, so 0.30." },
        ],
        hint: "$6 \\times 5 = 30$, then two decimal places.",
        done: "$0.30 = 0.3$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Raj says $0.2 \\times 0.3 = 0.6$. Is he right?",
        options: [
          {
            text: "No: it's 0.06, with two decimal places",
            correct: true,
            feedback:
              "A part of a part is smaller than both. Forgetting to count all the decimal places is the common slip.",
          },
          {
            text: "Yes",
            feedback:
              "0.6 is bigger than both 0.2 and 0.3. Multiplying by less than 1 makes it smaller.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo works out $5.2 + 3.47$.",
        lines: ["Write them one above the other", "5.2 + 3.47, with the 2 above the 7", "= 3.99"],
        wrong: 1,
        why: "Line up the **points**, not the right-hand digits: 5.20 + 3.47 = 8.67.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "At the shop",
        start: "£3.45 + £1.20 + 2 × £0.65, then change from £10.",
        stages: [
          {
            prompt: "Two pieces of fruit: $2 \\times 0.65 =$",
            options: [
              { text: "£1.30", correct: true, feedback: "" },
              { text: "£0.130", feedback: "$65 \\times 2 = 130$, and two decimal places: 1.30." },
            ],
            then: "£1.30",
          },
          {
            prompt: "The total: $3.45 + 1.20 + 1.30 =$",
            options: [
              { text: "£5.95", correct: true, feedback: "" },
              { text: "£4.95", feedback: "Line up the points and add again." },
            ],
            then: "£5.95",
          },
          {
            prompt: "Change from £10:",
            options: [
              { text: "£4.05", correct: true, feedback: "" },
              { text: "£5.05", feedback: "$10.00 - 5.95$: count up 0.05 to 6, then 4 more." },
            ],
            then: "£4.05",
          },
        ],
        done: "£4.05 change.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Work out $3.6 + 1.75$.",
            answers: ["5.35"],
            why: "3.60 + 1.75.",
            retry: { prompt: "Work out $2.4 + 4.85$.", answers: ["7.25"], why: "2.40 + 4.85." },
          },
          {
            prompt: "Work out $0.3 \\times 0.3$.",
            answers: ["0.09"],
            why: "$3 \\times 3 = 9$, two places.",
            retry: {
              prompt: "Work out $0.2 \\times 0.4$.",
              answers: ["0.08"],
              why: "$2 \\times 4 = 8$, two places.",
            },
          },
          {
            prompt: "Work out $2.35 \\times 4$.",
            answers: ["9.4", "9.40"],
            why: "$235 \\times 4 = 940$, two places.",
            retry: {
              prompt: "Work out $1.25 \\times 3$.",
              answers: ["3.75"],
              why: "$125 \\times 3 = 375$, two places.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-calculating",
    id: "y7-calculating/fractions",
    before: FRACTIONS,
    title: "Calculating with fractions",
    summary: "Add with same-size parts; multiply tops and bottoms.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Pancake batter",
        text: [
          "A recipe needs $\\frac23$ of a cup of milk and $\\frac14$ of a cup of water. Your jug only holds 1 cup.",
          "Will it all fit? By the end of this lesson, you can add fractions to find out.",
        ],
        picture: bars([
          ["Milk", 3, 2],
          ["Water", 4, 1],
        ]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $\\frac14 + \\frac24$?",
        text: "Give your answer as a fraction, like 1/2.",
        answers: ["3/4"],
        wrong: [
          {
            answer: "3/8",
            feedback: "Quarters plus quarters are still quarters: add the tops only.",
          },
        ],
        hint: "One quarter and two quarters.",
        done: "$\\frac34$: the parts are the same size, so just count them.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which is equal to $\\frac12$?",
        options: [
          { text: "$\\frac36$", correct: true, feedback: "3 out of 6 is half." },
          { text: "$\\frac23$", feedback: "That's more than half." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Same-size parts",
        text: [
          "You can only add fractions when the parts are the same size. Thirds and quarters aren't.",
          "So cut both into twelfths: $\\frac23 = \\frac{8}{12}$ and $\\frac14 = \\frac{3}{12}$. Now add: $\\frac{11}{12}$.",
        ],
        picture: bars([
          ["2/3", 12, 8],
          ["1/4", 12, 3],
        ]),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "$\\frac12 + \\frac13$: cut both into",
        options: [
          {
            text: "sixths: $\\frac36 + \\frac26 = \\frac56$",
            correct: true,
            feedback: "6 is a multiple of 2 and of 3.",
          },
          {
            text: "fifths: $\\frac25$",
            feedback:
              "Adding the tops and bottoms gives $\\frac25$, smaller than $\\frac12$! The parts must match first.",
          },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Multiplying is easier",
        text: [
          "$\\frac12$ of $\\frac13$ is a sixth. To multiply fractions, multiply the tops and multiply the bottoms.",
          "$\\frac23 \\times \\frac35 = \\frac{6}{15} = \\frac25$.",
        ],
        picture: { kind: "maths", tex: "\\frac{a}{b} \\times \\frac{c}{d} = \\frac{ac}{bd}" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "$\\frac34 - \\frac16$",
        problem: "Work out $\\frac34 - \\frac16$.",
        steps: [
          {
            line: "Twelfths: $\\frac34 = \\frac{9}{12}$, $\\frac16 = \\frac{2}{12}$",
            why: "12 is a multiple of 4 and 6.",
          },
          {
            line: "$\\frac{9}{12} - \\frac{2}{12} = \\frac{7}{12}$",
            why: "Same-size parts: take away the tops.",
          },
        ],
        done: "$\\frac{7}{12}$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$\\frac25 + \\frac13$",
        start: "$\\frac25 + \\frac13$",
        stages: [
          {
            prompt: "Same-size parts: fifteenths. $\\frac25 =$",
            options: [
              { text: "$\\frac{6}{15}$", correct: true, feedback: "" },
              {
                text: "$\\frac{2}{15}$",
                feedback: "Multiply the top by 3 too: $\\frac{2 \\times 3}{5 \\times 3}$.",
              },
            ],
            then: "$\\frac{6}{15} + \\frac{5}{15}$",
          },
          {
            prompt: "So",
            options: [
              { text: "$\\frac{11}{15}$", correct: true, feedback: "" },
              {
                text: "$\\frac{11}{30}$",
                feedback: "Add the tops only: the parts stay fifteenths.",
              },
            ],
            then: "$\\frac{11}{15}$",
          },
        ],
        done: "Match the parts, then add the tops.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$\\frac34 \\times \\frac25$",
        start: "$\\frac34 \\times \\frac25$",
        stages: [
          {
            prompt: "Multiply the tops and the bottoms:",
            options: [
              { text: "$\\frac{6}{20}$", correct: true, feedback: "" },
              { text: "$\\frac{5}{9}$", feedback: "That adds them. Multiply." },
            ],
            then: "$\\frac{6}{20}$",
          },
          {
            prompt: "Simplify:",
            options: [
              { text: "$\\frac{3}{10}$", correct: true, feedback: "" },
              { text: "$\\frac{2}{10}$", feedback: "Divide top and bottom by the same number: 2." },
            ],
            then: "$\\frac{3}{10}$",
          },
        ],
        done: "No matching needed to multiply.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Work out $\\frac13 + \\frac14$",
        text: "Give a fraction, like 5/6.",
        answers: ["7/12"],
        wrong: [{ answer: "2/7", feedback: "Don't add the bottoms: cut both into twelfths." }],
        hint: "$\\frac{4}{12} + \\frac{3}{12}$.",
        done: "$\\frac{7}{12}$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Work out $\\frac23 \\times \\frac14$",
        text: "Give a fraction in its simplest form.",
        answers: ["1/6", "2/12"],
        hint: "$\\frac{2 \\times 1}{3 \\times 4}$.",
        done: "$\\frac{2}{12} = \\frac16$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Jo says $\\frac12 + \\frac14 = \\frac26$. Is she right?",
        options: [
          {
            text: "No: $\\frac24 + \\frac14 = \\frac34$",
            correct: true,
            feedback:
              "Adding the bottoms is the classic mistake: $\\frac26$ is smaller than $\\frac12$ on its own!",
          },
          {
            text: "Yes",
            feedback: "$\\frac26 = \\frac13$, less than the $\\frac12$ you started with.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Max works out $\\frac35 - \\frac{1}{10}$.",
        lines: [
          "Tenths: $\\frac35 = \\frac{6}{10}$",
          "$\\frac{6}{10} - \\frac{1}{10} = \\frac{5}{0}$",
          "So the answer is 0",
        ],
        wrong: 1,
        why: "Take away the tops only; the parts stay tenths: $\\frac{5}{10} = \\frac12$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Pancake batter",
        start: "$\\frac23$ of a cup of milk and $\\frac14$ of a cup of water.",
        stages: [
          {
            prompt: "In twelfths:",
            options: [
              {
                text: "$\\frac{8}{12} + \\frac{3}{12} = \\frac{11}{12}$",
                correct: true,
                feedback: "",
              },
              { text: "$\\frac{3}{7}$", feedback: "Match the parts first." },
            ],
            then: "$\\frac{11}{12}$ of a cup",
          },
          {
            prompt: "Does it fit in a 1-cup jug?",
            options: [
              { text: "Yes, with $\\frac{1}{12}$ to spare", correct: true, feedback: "" },
              { text: "No", feedback: "$\\frac{11}{12}$ is less than $\\frac{12}{12} = 1$." },
            ],
            then: "It fits.",
          },
        ],
        done: "Just: $\\frac{1}{12}$ of a cup to spare.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Work out $\\frac15 + \\frac12$.",
            answers: ["7/10"],
            why: "$\\frac{2}{10} + \\frac{5}{10}$.",
            retry: {
              prompt: "Work out $\\frac13 + \\frac16$.",
              answers: ["3/6", "1/2"],
              why: "$\\frac26 + \\frac16 = \\frac36$.",
            },
          },
          {
            prompt: "Work out $\\frac56 - \\frac13$.",
            answers: ["3/6", "1/2"],
            why: "$\\frac56 - \\frac26$.",
            retry: {
              prompt: "Work out $\\frac34 - \\frac12$.",
              answers: ["1/4"],
              why: "$\\frac34 - \\frac24$.",
            },
          },
          {
            prompt: "Work out $\\frac12 \\times \\frac35$.",
            answers: ["3/10"],
            why: "Tops and bottoms.",
            retry: {
              prompt: "Work out $\\frac23 \\times \\frac25$.",
              answers: ["4/15"],
              why: "Tops and bottoms.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-calculating",
    id: "y7-calculating/mixed-numbers",
    before: MIXED,
    title: "Mixed numbers",
    summary: "Whole ones and a fraction: add them, or turn them into improper fractions.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Cutting a plank",
        text: [
          "A plank is $3\\frac12$ m long. You cut off $1\\frac34$ m for a shelf.",
          "How much is left? By the end of this lesson, you can work with whole ones and fractions together.",
        ],
        picture: bars([
          ["Plank", 14, 14],
          ["Cut off", 14, 7],
        ]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many quarters make 1 whole?",
        answers: ["4"],
        hint: "$\\frac44 = 1$.",
        done: "4.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $\\frac12 + \\frac14$?",
        answers: ["3/4"],
        hint: "$\\frac24 + \\frac14$.",
        done: "$\\frac34$.",
      },
      {
        kind: "steps",
        tag: "Discover",
        title: "Two and a third",
        start: "$2\\frac13$ is 2 wholes and a third.",
        stages: [
          {
            prompt: "How many thirds make 2 whole ones?",
            options: [
              { text: "$6$", correct: true, feedback: "" },
              { text: "$3$", feedback: "3 thirds make one whole. How many make two?" },
            ],
            then: "$2 = \\frac63$",
          },
          {
            prompt: "So $2\\frac13$ as an improper fraction is",
            options: [
              { text: "$\\frac73$", correct: true, feedback: "" },
              { text: "$\\frac63$", feedback: "Add on the extra third too." },
            ],
            then: "$2\\frac13 = \\frac73$",
          },
        ],
        done: "A **mixed number** is whole ones and a fraction. An **improper fraction** has a bigger top than bottom.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "And back: $\\frac{11}{4}$ as a mixed number",
        options: [
          {
            text: "$2\\frac34$",
            correct: true,
            feedback: "11 quarters: 8 make 2 wholes, and 3 are left.",
          },
          { text: "$1\\frac{1}{4}$", feedback: "4 quarters make 1; 8 make 2; 3 are left over." },
          { text: "$11\\frac14$", feedback: "That's much bigger. How many whole 4s in 11?" },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Two ways to add",
        text: [
          "Add the whole ones, then the fractions: $1\\frac12 + 2\\frac14 = 3 + \\frac34 = 3\\frac34$.",
          "When taking away needs to borrow, turn both into improper fractions first.",
        ],
        picture: { kind: "maths", tex: "1\\tfrac12 + 2\\tfrac14 = 3\\tfrac34" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "$2\\frac23 + 1\\frac12$",
        problem: "Work out $2\\frac23 + 1\\frac12$.",
        steps: [
          { line: "Whole ones: $2 + 1 = 3$", why: "Add them first." },
          {
            line: "Fractions: $\\frac46 + \\frac36 = \\frac76 = 1\\frac16$",
            why: "Match the parts; it's more than 1.",
          },
          { line: "$3 + 1\\frac16 = 4\\frac16$", why: "Add the extra whole on." },
        ],
        done: "$4\\frac16$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$1\\frac14 + 2\\frac14$",
        start: "$1\\frac14 + 2\\frac14$",
        stages: [
          {
            prompt: "Whole ones, then fractions:",
            options: [
              { text: "$3$ and $\\frac24$", correct: true, feedback: "" },
              { text: "$3$ and $\\frac28$", feedback: "Quarters stay quarters." },
            ],
            then: "$3\\frac24$",
          },
          {
            prompt: "Simplified:",
            options: [
              { text: "$3\\frac12$", correct: true, feedback: "" },
              { text: "$3\\frac14$", feedback: "$\\frac24 = \\frac12$." },
            ],
            then: "$3\\frac12$",
          },
        ],
        done: "Whole ones, then fractions.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$2\\frac14 - 1\\frac12$",
        start: "$2\\frac14 - 1\\frac12$: a quarter take away a half needs borrowing.",
        stages: [
          {
            prompt: "As improper fractions in quarters:",
            options: [
              { text: "$\\frac94 - \\frac64$", correct: true, feedback: "" },
              {
                text: "$\\frac{9}{4} - \\frac{3}{2}$ can't be done",
                feedback: "It can: $\\frac32 = \\frac64$.",
              },
            ],
            then: "$\\frac94 - \\frac64$",
          },
          {
            prompt: "So",
            options: [
              { text: "$\\frac34$", correct: true, feedback: "" },
              { text: "$1\\frac34$", feedback: "$\\frac94 - \\frac64 = \\frac34$: less than 1." },
            ],
            then: "$\\frac34$",
          },
        ],
        done: "Improper fractions make borrowing easy.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Work out $1\\frac12 + 2\\frac14$",
        text: "Type a mixed number like 3 1/2, or a fraction like 7/2.",
        answers: ["3 3/4", "15/4", "3.75"],
        hint: "Whole ones: 1 + 2. Fractions: $\\frac24 + \\frac14$.",
        done: "$3\\frac34$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Write $\\frac{17}{5}$ as a mixed number",
        text: "Type it like 2 1/3.",
        answers: ["3 2/5"],
        hint: "How many 5s in 17, and what's left?",
        done: "$3\\frac25$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Sam writes $2\\frac13$ as $\\frac{6}{3}$. Is he right?",
        options: [
          {
            text: "No: $\\frac63$ is just the 2. Add the third: $\\frac73$",
            correct: true,
            feedback: "Forgetting the fraction part when converting is common.",
          },
          { text: "Yes", feedback: "$\\frac63 = 2$. What about the extra third?" },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Eve works out $3\\frac25 - 1\\frac35$.",
        lines: [
          "Whole ones: $3 - 1 = 2$",
          "Fractions: $\\frac35 - \\frac25 = \\frac15$",
          "So $2\\frac15$",
        ],
        wrong: 1,
        why: "It's $\\frac25 - \\frac35$, which needs borrowing. Use improper fractions: $\\frac{17}{5} - \\frac85 = \\frac95 = 1\\frac45$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Cutting a plank",
        text: "$3\\frac12 - 1\\frac34$ m. Type a mixed number like 1 1/2.",
        answers: ["1 3/4", "7/4", "1.75"],
        wrong: [
          {
            answer: "2 1/4",
            feedback:
              "$\\frac12 - \\frac34$ needs borrowing. Use quarters: $\\frac{14}{4} - \\frac74$.",
          },
        ],
        hint: "In quarters: $\\frac{14}{4} - \\frac74$.",
        done: "$\\frac74 = 1\\frac34$ m left.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Write $2\\frac34$ as an improper fraction.",
            answers: ["11/4"],
            why: "8 quarters and 3 more.",
            retry: {
              prompt: "Write $1\\frac25$ as an improper fraction.",
              answers: ["7/5"],
              why: "5 fifths and 2 more.",
            },
          },
          {
            prompt: "Work out $2\\frac13 + 1\\frac13$. Type like 3 1/2.",
            answers: ["3 2/3", "11/3"],
            why: "3 and $\\frac23$.",
            retry: {
              prompt: "Work out $1\\frac15 + 3\\frac25$. Type like 3 1/2.",
              answers: ["4 3/5", "23/5"],
              why: "4 and $\\frac35$.",
            },
          },
          {
            prompt: "Work out $2\\frac12 - 1\\frac34$.",
            answers: ["3/4"],
            why: "$\\frac{10}{4} - \\frac74$.",
            retry: {
              prompt: "Work out $3\\frac14 - 1\\frac12$. Type like 1 1/2.",
              answers: ["1 3/4", "7/4"],
              why: "$\\frac{13}{4} - \\frac64$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-calculating",
    id: "y7-calculating/inverse",
    before: INVERSE,
    title: "Undo it",
    summary: "Inverse operations undo each other: use them to work backwards and to check.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Mind reading",
        text: [
          "Ali thinks of a number. He multiplies it by 4, then adds 3, and gets 31.",
          "What was his number? By the end of this lesson, you can work backwards to find it.",
        ],
        picture: { kind: "maths", tex: "? \\xrightarrow{\\times 4} \\; \\xrightarrow{+ 3} 31" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $28 \\div 4$?",
        answers: ["7"],
        hint: "How many 4s in 28?",
        done: "7.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $31 - 3$?",
        answers: ["28"],
        hint: "Count back 3.",
        done: "28.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Pairs that undo",
        text: [
          "Adding and taking away undo each other. Multiplying and dividing undo each other. They're **inverse operations**.",
          "$5 + 3 = 8$, so $8 - 3 = 5$. $6 \\times 4 = 24$, so $24 \\div 4 = 6$.",
        ],
        picture: { kind: "maths", tex: "5 \\xrightarrow{+3} 8 \\xrightarrow{-3} 5" },
      },
      {
        kind: "fill",
        tag: "Discover",
        title: "One fact, more for free",
        template: "$7 \\times 8 = 56$, so $56 \\div 8 =$ [] and $56 \\div$ [] $= 8$",
        bank: ["$7$", "$8$", "$56$", "$64$"],
        answers: ["$7$", "$7$"],
        hint: "Division undoes multiplication.",
        done: "One multiplication fact gives two division facts.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Run a machine backwards",
        problem: "A machine does × 3, then + 5. 20 came out. What went in?",
        steps: [
          { line: "Undo the last step first: $20 - 5 = 15$", why: "The + 5 happened last." },
          { line: "Then undo × 3: $15 \\div 3 = 5$", why: "Inverse of × is ÷." },
        ],
        done: "5. Check forwards: $5 \\times 3 + 5 = 20$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "× 2, then − 4, gives 10",
        start: "What went in?",
        stages: [
          {
            prompt: "Undo − 4 first:",
            options: [
              { text: "$10 + 4 = 14$", correct: true, feedback: "" },
              { text: "$10 - 4 = 6$", feedback: "Undo taking away by adding." },
            ],
            then: "14",
          },
          {
            prompt: "Undo × 2:",
            options: [
              { text: "$14 \\div 2 = 7$", correct: true, feedback: "" },
              { text: "$14 \\times 2 = 28$", feedback: "Undo × by dividing." },
            ],
            then: "7",
          },
        ],
        done: "Check: $7 \\times 2 - 4 = 10$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Check with an inverse",
        start: "Is $372 - 148 = 224$ right?",
        stages: [
          {
            prompt: "Check by",
            options: [
              { text: "adding: $224 + 148$", correct: true, feedback: "" },
              { text: "taking away again", feedback: "Use the inverse: adding." },
            ],
            then: "$224 + 148 = 372$",
          },
          {
            prompt: "So the answer is",
            options: [
              { text: "right", correct: true, feedback: "" },
              { text: "wrong", feedback: "Adding back gives 372, what we started with." },
            ],
            then: "✓",
          },
        ],
        done: "Inverses are a quick check.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "× 5, then + 2, gives 37. What went in?",
        answers: ["7"],
        wrong: [{ answer: "187", feedback: "That runs it forwards. Undo: − 2, then ÷ 5." }],
        hint: "$37 - 2$, then $\\div 5$.",
        done: "$35 \\div 5 = 7$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "÷ 2, then − 1, gives 8. What went in?",
        answers: ["18"],
        hint: "Undo − 1: + 1. Undo ÷ 2: × 2.",
        done: "$8 + 1 = 9$, $9 \\times 2 = 18$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "× 4, then − 3, gives 25. Kim undoes it: $25 \\div 4$, then + 3. Is that right?",
        options: [
          {
            text: "No: undo the last step first: + 3, then ÷ 4",
            correct: true,
            feedback:
              "Undo in reverse order, like taking off socks and shoes: shoes first. $28 \\div 4 = 7$.",
          },
          { text: "Yes", feedback: "She undid them in the wrong order: the − 3 happened last." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "A machine does + 6, then × 2, giving 30. Ben works backwards.",
        lines: ["Undo × 2: $30 \\div 2 = 15$", "Undo + 6: $15 + 6 = 21$", "So 21 went in"],
        wrong: 1,
        why: "Undo + 6 by taking away: $15 - 6 = 9$. Check: $(9 + 6) \\times 2 = 30$ ✓",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Mind reading",
        text: "× 4, then + 3, gives 31. What was Ali's number?",
        answers: ["7"],
        wrong: [{ answer: "8.5", feedback: "Undo the + 3 first: 28, then ÷ 4." }],
        hint: "$31 - 3$, then $\\div 4$.",
        done: "$28 \\div 4 = 7$. Check: $7 \\times 4 + 3 = 31$ ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "× 3, then + 4, gives 19. What went in?",
            answers: ["5"],
            why: "$19 - 4 = 15$, $15 \\div 3 = 5$.",
            retry: {
              prompt: "× 2, then + 7, gives 21. What went in?",
              answers: ["7"],
              why: "$21 - 7 = 14$, $14 \\div 2 = 7$.",
            },
          },
          {
            prompt: "$9 \\times 6 = 54$. So $54 \\div 6 =$",
            answers: ["9"],
            why: "Division undoes multiplication.",
            retry: {
              prompt: "$8 \\times 7 = 56$. So $56 \\div 7 =$",
              answers: ["8"],
              why: "Division undoes multiplication.",
            },
          },
          {
            prompt: "The inverse of × 5 is",
            options: ["÷ 5", "− 5", "× 5"],
            answers: ["÷ 5"],
            why: "Dividing undoes multiplying.",
            retry: {
              prompt: "The inverse of − 8 is",
              options: ["+ 8", "÷ 8", "− 8"],
              answers: ["+ 8"],
              why: "Adding undoes taking away.",
            },
          },
        ],
      },
    ],
  },
];
