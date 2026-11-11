// Year 7, "Ratio and proportion", as six short lessons, one just before each skill: writing and
// simplifying ratios, sharing in a part : part ratio, a part : whole ratio, a division written as
// a ratio, and one quantity as a fraction of another, less than and more than 1. Each starts from
// something quick, builds the idea a step at a time with bar models, names the common mistakes,
// and ends on an exit check.
import type { BarsPic, UnitLesson } from "./types.ts";

const NOTATION = "Y7-RAT-02";
const PART_PART = "Y7-RAT-03.a";
const PART_WHOLE = "Y7-RAT-03.b";
const DIVISION = "Y7-RAT-03.c";
const FRACTION = "Y7-RAT-04.a";
const OVER_ONE = "Y7-RAT-04.b";

const bars = (rows: [string, number, string?][], total?: string): BarsPic => ({
  kind: "bars",
  rows: rows.map(([label, parts, each]) => ({ label, parts, ...(each ? { each } : {}) })),
  ...(total ? { total } : {}),
});

export const y7Ratio: UnitLesson[] = [
  {
    unit: "y7-ratio",
    id: "y7-ratio/notation",
    before: NOTATION,
    title: "Writing ratios",
    summary: "A ratio compares parts; simplify it by dividing every part by the same number.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Flapjack",
        text: [
          "A flapjack recipe uses 150 g of oats to 100 g of syrup. Ella wants to make a small batch, keeping the taste the same.",
          "What's the simplest way to describe the mix? By the end of this lesson, you can write it as a ratio.",
        ],
        picture: bars([
          ["Oats", 3],
          ["Syrup", 2],
        ]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is the HCF of 150 and 100?",
        answers: ["50"],
        hint: "The biggest number dividing both.",
        done: "50.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $12 \\div 4$?",
        answers: ["3"],
        hint: "How many 4s in 12?",
        done: "3.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A ratio compares parts",
        text: [
          "Paint mixed in the ratio 3 : 2 has 3 parts red to every 2 parts blue. The order matters: 3 : 2 isn't 2 : 3.",
          "6 : 4 is the same mix, just more of it: divide both by 2 and you're back at 3 : 2.",
        ],
        picture: bars([
          ["Red", 3],
          ["Blue", 2],
        ]),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Which is the same as 6 : 4?",
        options: [
          { text: "3 : 2", correct: true, feedback: "Both divided by 2." },
          { text: "4 : 6", feedback: "That's the other way round: twice as much of the second." },
          { text: "5 : 3", feedback: "That takes 1 away from each. Ratios divide, not subtract." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Simplify 12 : 8",
        problem: "Write 12 : 8 in its simplest form.",
        steps: [
          { line: "The HCF of 12 and 8 is 4", why: "The biggest number that divides both." },
          { line: "$12 \\div 4 = 3$, $8 \\div 4 = 2$", why: "Divide both parts by it." },
          { line: "3 : 2", why: "No number divides both any more." },
        ],
        done: "3 : 2.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Simplify 15 : 25",
        start: "15 : 25",
        stages: [
          {
            prompt: "Divide both by",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "3", feedback: "3 doesn't divide 25." },
            ],
            then: "3 : 5",
          },
          {
            prompt: "Can it be simplified more?",
            options: [
              { text: "No", correct: true, feedback: "" },
              { text: "Yes", feedback: "3 and 5 share no factor but 1." },
            ],
            then: "3 : 5",
          },
        ],
        done: "Simplest form: no common factor left.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Different units",
        start: "Write 50 cm : 2 m in its simplest form.",
        stages: [
          {
            prompt: "Same units first: 2 m =",
            options: [
              { text: "200 cm", correct: true, feedback: "" },
              { text: "20 cm", feedback: "1 m = 100 cm." },
            ],
            then: "50 : 200",
          },
          {
            prompt: "Simplest form:",
            options: [
              { text: "1 : 4", correct: true, feedback: "" },
              { text: "25 : 1", feedback: "Divide both by 50." },
            ],
            then: "1 : 4",
          },
        ],
        done: "Units must match before you simplify.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Simplest form",
        template: "18 : 12 = [] and 20 : 45 = []",
        bank: ["3 : 2", "9 : 6", "4 : 9", "2 : 3"],
        answers: ["3 : 2", "4 : 9"],
        hint: "Divide by 6, then by 5.",
        done: "3 : 2 and 4 : 9.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A class has 12 boys and 16 girls. Write girls : boys in simplest form.",
        text: "Type it like 3:2.",
        answers: ["4:3", "4 : 3"],
        wrong: [{ answer: "3:4", feedback: "Girls first: 16 : 12." }],
        hint: "16 : 12, divided by 4.",
        done: "4 : 3.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Sam simplifies 10 : 15 to 5 : 10 by taking 5 from each. Is he right?",
        options: [
          {
            text: "No: ratios divide, so 10 : 15 = 2 : 3",
            correct: true,
            feedback: "Taking away changes the mix. 5 : 10 is 1 : 2, a different ratio.",
          },
          { text: "Yes", feedback: "5 : 10 is 1 : 2, but 10 : 15 is 2 : 3." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Raj simplifies 24 : 36.",
        lines: [
          "Both divide by 2: 12 : 18",
          "Both divide by 3: 4 : 6",
          "So the simplest form is 4 : 6",
        ],
        wrong: 2,
        why: "4 and 6 still share a factor of 2: 2 : 3. Divide by the HCF, 12, in one step.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Flapjack",
        text: "150 g of oats to 100 g of syrup.",
        options: [
          {
            text: "3 : 2",
            correct: true,
            feedback:
              "Both ÷ 50. So 30 g oats to 20 g syrup makes a small batch with the same taste.",
          },
          { text: "2 : 3", feedback: "Oats first: 150 : 100." },
          { text: "15 : 10", feedback: "Same ratio, but not simplest." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Simplify 8 : 12.",
            options: ["2 : 3", "4 : 6", "3 : 2"],
            answers: ["2 : 3"],
            why: "÷ 4.",
            retry: {
              prompt: "Simplify 14 : 21.",
              options: ["2 : 3", "7 : 14", "3 : 2"],
              answers: ["2 : 3"],
              why: "÷ 7.",
            },
          },
          {
            prompt: "Simplify 30 : 10.",
            options: ["3 : 1", "1 : 3", "15 : 5"],
            answers: ["3 : 1"],
            why: "÷ 10.",
            retry: {
              prompt: "Simplify 40 : 8.",
              options: ["5 : 1", "1 : 5", "10 : 2"],
              answers: ["5 : 1"],
              why: "÷ 8.",
            },
          },
          {
            prompt: "Simplify 1 m : 25 cm.",
            options: ["4 : 1", "1 : 25", "1 : 4"],
            answers: ["4 : 1"],
            why: "100 : 25.",
            retry: {
              prompt: "Simplify 30 cm : 1.5 m.",
              options: ["1 : 5", "30 : 1.5", "5 : 1"],
              answers: ["1 : 5"],
              why: "30 : 150.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-ratio",
    id: "y7-ratio/sharing",
    before: PART_PART,
    title: "Sharing in a ratio",
    summary: "Count the parts, find one part, then each share.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A prize",
        text: [
          "Amy and Ben win £40. Amy paid more for the ticket, so they agree to share it in the ratio 3 : 2.",
          "How much does each get? By the end of this lesson, you can share anything fairly.",
        ],
        picture: bars(
          [
            ["Amy", 3],
            ["Ben", 2],
          ],
          "£40",
        ),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3 + 2$?",
        answers: ["5"],
        hint: "Add them.",
        done: "5.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $40 \\div 5$?",
        answers: ["8"],
        hint: "How many 5s in 40?",
        done: "8.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Equal parts",
        text: [
          "In 3 : 2, Amy gets 3 equal parts and Ben 2. That's 5 parts altogether.",
          "So one part is £40 ÷ 5 = £8. Then Amy gets $3 \\times 8$ and Ben $2 \\times 8$.",
        ],
        picture: bars(
          [
            ["Amy", 3, "£8"],
            ["Ben", 2, "£8"],
          ],
          "£40",
        ),
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Share 56 in the ratio 5 : 3",
        problem: "Share 56 sweets in the ratio 5 : 3.",
        steps: [
          { line: "Parts: $5 + 3 = 8$", why: "Count all the parts." },
          { line: "One part: $56 \\div 8 = 7$", why: "Share the total." },
          { line: "$5 \\times 7 = 35$ and $3 \\times 7 = 21$", why: "Each share." },
        ],
        done: "35 and 21. Check: $35 + 21 = 56$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Share £40 in the ratio 3 : 2",
        picture: bars(
          [
            ["Amy", 3],
            ["Ben", 2],
          ],
          "£40",
        ),
        start: "Amy : Ben = 3 : 2",
        stages: [
          {
            prompt: "How many parts altogether?",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "6", feedback: "Count the boxes: 3 + 2." },
            ],
            then: "5 parts",
          },
          {
            prompt: "One part is",
            options: [
              { text: "£8", correct: true, feedback: "" },
              { text: "£20", feedback: "That's half. Share between 5 parts." },
            ],
            then: "£8",
          },
          {
            prompt: "Amy and Ben get",
            options: [
              { text: "£24 and £16", correct: true, feedback: "" },
              { text: "£3 and £2", feedback: "Those are the parts. Multiply by £8." },
            ],
            then: "£24 and £16",
          },
        ],
        done: "Check: $24 + 16 = 40$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Knowing one share",
        start: "Cats : dogs = 2 : 5. There are 10 cats. How many dogs?",
        stages: [
          {
            prompt: "2 parts are 10 cats, so one part is",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "10", feedback: "10 cats is 2 parts." },
            ],
            then: "1 part = 5",
          },
          {
            prompt: "Dogs are 5 parts:",
            options: [
              { text: "25", correct: true, feedback: "" },
              { text: "13", feedback: "That adds. Multiply: $5 \\times 5$." },
            ],
            then: "25 dogs",
          },
        ],
        done: "Find one part from what you know.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Share £60 in the ratio 1 : 4. What is the bigger share?",
        answers: ["48"],
        wrong: [{ answer: "15", feedback: "That divides by 4. There are 5 parts." }],
        hint: "5 parts; one part is £12.",
        done: "$4 \\times 12 = £48$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Share 72 in the ratio 5 : 4. What is the smaller share?",
        answers: ["32"],
        hint: "9 parts; one part is 8.",
        done: "$4 \\times 8 = 32$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Share £40 in 3 : 2. Kim divides by 3 and by 2: £13.33 and £20. Is that right?",
        options: [
          {
            text: "No: divide by the total parts, 5, then multiply",
            correct: true,
            feedback: "£13.33 + £20 isn't £40. Divide the total by all the parts first.",
          },
          { text: "Yes", feedback: "Add them: £33.33, not £40." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ola shares 30 sweets in the ratio 2 : 3.",
        lines: ["Parts: 2 + 3 = 5", "One part: 30 ÷ 5 = 6", "Shares: 2 and 3"],
        wrong: 2,
        why: "Multiply each by one part: $2 \\times 6 = 12$ and $3 \\times 6 = 18$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "A prize",
        text: "£40 in the ratio 3 : 2. How much does Amy get, in £?",
        answers: ["24"],
        wrong: [{ answer: "16", feedback: "That's Ben's share. Amy has 3 parts." }],
        hint: "5 parts of £8.",
        done: "£24 for Amy, £16 for Ben.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Share 20 in the ratio 3 : 1. What is the bigger share?",
            answers: ["15"],
            why: "4 parts of 5.",
            retry: {
              prompt: "Share 35 in the ratio 4 : 1. What is the bigger share?",
              answers: ["28"],
              why: "5 parts of 7.",
            },
          },
          {
            prompt: "Share 45 in the ratio 2 : 7. What is the smaller share?",
            answers: ["10"],
            why: "9 parts of 5.",
            retry: {
              prompt: "Share 48 in the ratio 5 : 3. What is the smaller share?",
              answers: ["18"],
              why: "8 parts of 6.",
            },
          },
          {
            prompt: "Boys : girls = 3 : 4, with 12 boys. How many girls?",
            answers: ["16"],
            why: "One part is 4.",
            retry: {
              prompt: "Red : blue = 2 : 3, with 8 red. How many blue?",
              answers: ["12"],
              why: "One part is 4.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-ratio",
    id: "y7-ratio/part-whole",
    before: PART_WHOLE,
    title: "Part to whole",
    summary: "A ratio of a part to the whole is a fraction: 2 : 5 means two fifths.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Squash",
        text: [
          "A jug of drink is made so that the ratio of squash to the whole drink is 1 : 5. The jug holds 1500 ml.",
          "How much squash is in it? By the end of this lesson, you can work with parts of a whole.",
        ],
        picture: bars([
          ["Squash", 1],
          ["Whole drink", 5],
        ]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $\\frac15$ of 1500?",
        answers: ["300"],
        hint: "$1500 \\div 5$.",
        done: "300.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Squash : water is 1 : 4. How many parts altogether?",
        answers: ["5"],
        hint: "1 + 4.",
        done: "5.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Part : whole",
        text: [
          "Squash : water = 1 : 4 compares part to part. Altogether that's 5 parts, so squash : whole = 1 : 5.",
          "Part : whole is a fraction: squash is $\\frac15$ of the drink.",
        ],
        picture: bars([
          ["Squash", 1],
          ["Water", 4],
        ]),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Boys : girls = 2 : 3. What fraction are girls?",
        picture: bars([
          ["Boys", 2],
          ["Girls", 3],
        ]),
        options: [
          { text: "$\\frac35$", correct: true, feedback: "3 parts out of 5 altogether." },
          {
            text: "$\\frac32$",
            feedback: "That compares girls to boys. Out of the whole class: 5 parts.",
          },
          { text: "$\\frac23$", feedback: "That's boys compared with girls." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Red beads",
        problem:
          "The ratio of red beads to all the beads is 2 : 7. There are 63 beads. How many are red?",
        steps: [
          { line: "Red is $\\frac27$ of all the beads", why: "Part : whole is a fraction." },
          { line: "$\\frac17$ of 63 is 9", why: "One part." },
          { line: "$2 \\times 9 = 18$ red", why: "Two parts." },
        ],
        done: "18 red beads.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Girls in a class",
        start: "Boys : girls = 2 : 3, and the class has 30 pupils.",
        stages: [
          {
            prompt: "Girls are what fraction of the class?",
            options: [
              { text: "$\\frac35$", correct: true, feedback: "" },
              { text: "$\\frac32$", feedback: "Out of the whole: 5 parts." },
            ],
            then: "$\\frac35$",
          },
          {
            prompt: "So the number of girls:",
            options: [
              { text: "18", correct: true, feedback: "" },
              { text: "45", feedback: "That's $\\frac32$ of 30. Use $\\frac35$." },
            ],
            then: "$\\frac35 \\times 30 = 18$",
          },
        ],
        done: "Part : whole turns into a fraction of the total.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "From part : part to part : whole",
        start: "Sand : cement = 4 : 1.",
        stages: [
          {
            prompt: "Cement : whole mix is",
            options: [
              { text: "1 : 5", correct: true, feedback: "" },
              { text: "1 : 4", feedback: "That's cement : sand. The whole is 4 + 1." },
            ],
            then: "1 : 5",
          },
        ],
        done: "Add the parts to find the whole.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Squash : whole = 1 : 6. A jug holds 1.8 litres. How many litres of squash?",
        answers: ["0.3"],
        hint: "$\\frac16$ of 1.8.",
        done: "0.3 litres.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Red : green beads = 3 : 5. What fraction are green?",
        text: "Type a fraction like 2/3.",
        answers: ["5/8"],
        wrong: [{ answer: "5/3", feedback: "Out of all the beads: 3 + 5 = 8 parts." }],
        hint: "8 parts in all.",
        done: "$\\frac58$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Red : blue = 1 : 3. Leo says a third of the counters are red. Is he right?",
        options: [
          {
            text: "No: red is 1 part of 4, so a quarter",
            correct: true,
            feedback:
              "1 : 3 compares red with blue, not with the whole. Confusing part : part with part : whole is the classic mistake.",
          },
          { text: "Yes", feedback: "There are 4 parts altogether." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Cats : dogs = 2 : 3 in a shelter of 40 animals. Ivy finds the number of cats.",
        lines: [
          "Cats are $\\frac23$ of the animals",
          "$\\frac23$ of 40 is 26.7",
          "So about 27 cats",
        ],
        wrong: 0,
        why: "Cats are 2 parts of 5: $\\frac25$ of 40 = 16 cats.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Squash",
        text: "Squash : whole drink = 1 : 5, in a 1500 ml jug. How many ml of squash?",
        answers: ["300"],
        wrong: [{ answer: "375", feedback: "That's $\\frac14$. Squash is 1 part of the whole 5." }],
        hint: "$\\frac15$ of 1500.",
        done: "300 ml of squash, and 1200 ml of water.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Boys : girls = 1 : 4. What fraction are boys?",
            options: ["$\\frac15$", "$\\frac14$", "$\\frac41$"],
            answers: ["$\\frac15$"],
            why: "1 part of 5.",
            retry: {
              prompt: "Boys : girls = 2 : 1. What fraction are girls?",
              options: ["$\\frac13$", "$\\frac12$", "$\\frac21$"],
              answers: ["$\\frac13$"],
              why: "1 part of 3.",
            },
          },
          {
            prompt: "Red : all = 3 : 10. There are 50 sweets. How many red?",
            answers: ["15"],
            why: "$\\frac{3}{10}$ of 50.",
            retry: {
              prompt: "Blue : all = 2 : 5. There are 35 sweets. How many blue?",
              answers: ["14"],
              why: "$\\frac25$ of 35.",
            },
          },
          {
            prompt: "Juice : water = 1 : 3. What fraction of the drink is juice?",
            options: ["$\\frac14$", "$\\frac13$", "$\\frac34$"],
            answers: ["$\\frac14$"],
            why: "1 part of 4.",
            retry: {
              prompt: "Juice : water = 2 : 3. What fraction of the drink is juice?",
              options: ["$\\frac25$", "$\\frac23$", "$\\frac35$"],
              answers: ["$\\frac25$"],
              why: "2 parts of 5.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-ratio",
    id: "y7-ratio/division",
    before: DIVISION,
    title: "A division as a ratio",
    summary: "If a ÷ b = 4, then a is 4 times b: a : b = 4 : 1.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How many times bigger?",
        text: [
          "A recipe for 4 people uses 600 g of potatoes. A restaurant needs a batch with 2400 g.",
          "How many times bigger is the batch, and how could you write that as a ratio? By the end of this lesson, you can.",
        ],
        picture: bars([
          ["Recipe", 1],
          ["Batch", 4],
        ]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $2400 \\div 600$?",
        answers: ["4"],
        hint: "How many 600s in 2400?",
        done: "4.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Simplify 12 : 3",
        options: [
          { text: "4 : 1", correct: true, feedback: "Both ÷ 3." },
          { text: "1 : 4", feedback: "Keep the order: 12 first." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Division and ratio",
        text: [
          "$12 \\div 3 = 4$ says 12 is 4 times as big as 3. As a ratio, $12 : 3 = 4 : 1$.",
          "In general, if $a \\div b = k$, then $a : b = k : 1$.",
        ],
        picture: { kind: "maths", tex: "a \\div b = 4 \\iff a : b = 4 : 1" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "If $a \\div b = 4$, then $a : b$ is",
        options: [
          { text: "4 : 1", correct: true, feedback: "a is 4 times as big as b." },
          { text: "1 : 4", feedback: "That would make b the bigger one." },
          { text: "a : 4", feedback: "A ratio compares a and b with numbers." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Write it as a ratio",
        problem:
          "A car uses 5 litres of fuel for every 60 km. Write km : litres in the form $k : 1$.",
        steps: [
          { line: "$60 \\div 5 = 12$", why: "How many km for each litre." },
          { line: "60 : 5 = 12 : 1", why: "Divide both by 5." },
        ],
        done: "12 : 1: 12 km for every litre.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "In the form $1 : n$",
        start: "Write 4 : 18 in the form 1 : n.",
        stages: [
          {
            prompt: "Divide both by",
            options: [
              { text: "4", correct: true, feedback: "" },
              { text: "2", feedback: "To make the first part 1, divide by 4." },
            ],
            then: "1 : 4.5",
          },
        ],
        done: "1 : 4.5: n doesn't have to be whole.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A map scale",
        start: "1 cm on a map is 500 m in real life.",
        stages: [
          {
            prompt: "500 m in cm:",
            options: [
              { text: "50 000 cm", correct: true, feedback: "" },
              { text: "5000 cm", feedback: "1 m = 100 cm." },
            ],
            then: "50 000 cm",
          },
          {
            prompt: "As a ratio:",
            options: [
              { text: "1 : 50 000", correct: true, feedback: "" },
              { text: "1 : 500", feedback: "Same units: cm to cm." },
            ],
            then: "1 : 50 000",
          },
        ],
        done: "Real distance is 50 000 times map distance.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "$p \\div q = 6$. Write $p : q$. Type it like 3:1.",
        answers: ["6:1", "6 : 1"],
        hint: "p is 6 times q.",
        done: "6 : 1.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Write 35 : 7 in the form $n : 1$. What is n?",
        answers: ["5"],
        hint: "$35 \\div 7$.",
        done: "5 : 1.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "$a \\div b = 3$. Mo writes $a : b = 1 : 3$. Is he right?",
        options: [
          {
            text: "No: a is 3 times b, so 3 : 1",
            correct: true,
            feedback: "The order of the ratio matches the order of the division.",
          },
          { text: "Yes", feedback: "1 : 3 would make b three times a." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ana writes 20 : 8 in the form $n : 1$.",
        lines: ["Divide both by 8", "$20 \\div 8 = 2$ remainder 4", "So 2 : 1"],
        wrong: 1,
        why: "$20 \\div 8 = 2.5$: decimals are fine. So 2.5 : 1.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "How many times bigger?",
        text: "Batch : recipe = 2400 g : 600 g.",
        options: [
          {
            text: "4 times bigger: 4 : 1",
            correct: true,
            feedback: "$2400 \\div 600 = 4$. So enough for 16 people.",
          },
          { text: "1 : 4", feedback: "Batch first, and it's the bigger one." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$x \\div y = 5$. Then $x : y =$",
            options: ["5 : 1", "1 : 5", "x : 5"],
            answers: ["5 : 1"],
            why: "x is 5 times y.",
            retry: {
              prompt: "$m \\div n = 8$. Then $m : n =$",
              options: ["8 : 1", "1 : 8", "m : 8"],
              answers: ["8 : 1"],
              why: "m is 8 times n.",
            },
          },
          {
            prompt: "Write 18 : 4 in the form $n : 1$. What is n?",
            answers: ["4.5"],
            why: "$18 \\div 4$.",
            retry: {
              prompt: "Write 15 : 6 in the form $n : 1$. What is n?",
              answers: ["2.5"],
              why: "$15 \\div 6$.",
            },
          },
          {
            prompt: "Write 3 : 12 in the form $1 : n$. What is n?",
            answers: ["4"],
            why: "÷ 3.",
            retry: {
              prompt: "Write 5 : 30 in the form $1 : n$. What is n?",
              answers: ["6"],
              why: "÷ 5.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-ratio",
    id: "y7-ratio/fraction-of",
    before: FRACTION,
    title: "One as a fraction of another",
    summary:
      "What fraction is one amount of another? Put the part over the whole, in the same units.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Screen time",
        text: [
          "Maya spent 45 minutes of an hour-long lesson on a laptop.",
          "What fraction of the lesson was that? By the end of this lesson, you can say exactly.",
        ],
        picture: {
          kind: "spinner",
          sectors: [
            { label: "laptop", size: 3 },
            { label: "off", size: 1 },
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many minutes in an hour?",
        answers: ["60"],
        hint: "A clock face.",
        done: "60.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Simplify $\\frac{45}{60}$",
        options: [
          { text: "$\\frac34$", correct: true, feedback: "Both ÷ 15." },
          { text: "$\\frac{9}{10}$", feedback: "Divide both by the same number: 15." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Part over whole",
        text: [
          "'What fraction of 20 is 5?' Put the part on top and the whole underneath: $\\frac{5}{20} = \\frac14$.",
          "Both must be in the **same units**: minutes with minutes, grams with grams.",
        ],
        picture: {
          kind: "maths",
          tex: "\\frac{\\text{part}}{\\text{whole}} = \\frac{5}{20} = \\frac14",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "What fraction of 12 is 3?",
        options: [
          { text: "$\\frac14$", correct: true, feedback: "$\\frac{3}{12} = \\frac14$." },
          { text: "4", feedback: "That's how many 3s are in 12. As a fraction: $\\frac{3}{12}$." },
          { text: "$\\frac{12}{3}$", feedback: "The part goes on top." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Different units",
        problem: "What fraction of 2 kg is 400 g?",
        steps: [
          { line: "2 kg = 2000 g", why: "Same units first." },
          { line: "$\\frac{400}{2000}$", why: "Part over whole." },
          { line: "$= \\frac15$", why: "Simplify: ÷ 400." },
        ],
        done: "$\\frac15$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "What fraction of a day is 8 hours?",
        start: "8 hours out of a day.",
        stages: [
          {
            prompt: "A day is",
            options: [
              { text: "24 hours", correct: true, feedback: "" },
              { text: "12 hours", feedback: "A whole day and night: 24." },
            ],
            then: "$\\frac{8}{24}$",
          },
          {
            prompt: "Simplified:",
            options: [
              { text: "$\\frac13$", correct: true, feedback: "" },
              { text: "$\\frac{1}{4}$", feedback: "$\\frac{8}{24}$, both ÷ 8." },
            ],
            then: "$\\frac13$",
          },
        ],
        done: "A third of the day: often spent asleep!",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "What fraction of £2 is 50p?",
        start: "50p and £2.",
        stages: [
          {
            prompt: "Same units:",
            options: [
              { text: "$\\frac{50}{200}$", correct: true, feedback: "" },
              { text: "$\\frac{50}{2}$", feedback: "£2 is 200p." },
            ],
            then: "$\\frac{50}{200}$",
          },
          {
            prompt: "Simplified:",
            options: [
              { text: "$\\frac14$", correct: true, feedback: "" },
              { text: "25", feedback: "That's the wrong way up and unconverted." },
            ],
            then: "$\\frac14$",
          },
        ],
        done: "$\\frac14$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What fraction of 50 is 20?",
        text: "Simplest form, like 1/2.",
        answers: ["2/5"],
        hint: "$\\frac{20}{50}$.",
        done: "$\\frac25$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What fraction of 1 metre is 30 cm?",
        text: "Simplest form.",
        answers: ["3/10"],
        wrong: [{ answer: "30/1", feedback: "1 m is 100 cm: $\\frac{30}{100}$." }],
        hint: "$\\frac{30}{100}$.",
        done: "$\\frac{3}{10}$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "What fraction of an hour is 15 minutes? Sam writes $\\frac{15}{100}$. Is he right?",
        options: [
          {
            text: "No: an hour is 60 minutes, so $\\frac{15}{60} = \\frac14$",
            correct: true,
            feedback: "Time isn't out of 100. Use the right whole.",
          },
          { text: "Yes", feedback: "There are 60 minutes in an hour." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo finds what fraction of 40 is 10.",
        lines: ["Part over whole", "$\\frac{40}{10}$", "$= 4$"],
        wrong: 1,
        why: "The part, 10, goes on top: $\\frac{10}{40} = \\frac14$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Screen time",
        text: "45 minutes of a 1-hour lesson. What fraction? Simplest form.",
        answers: ["3/4"],
        wrong: [{ answer: "45/100", feedback: "An hour is 60 minutes." }],
        hint: "$\\frac{45}{60}$.",
        done: "$\\frac34$ of the lesson.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What fraction of 24 is 6?",
            answers: ["1/4", "6/24"],
            why: "$\\frac{6}{24}$.",
            retry: {
              prompt: "What fraction of 30 is 10?",
              answers: ["1/3", "10/30"],
              why: "$\\frac{10}{30}$.",
            },
          },
          {
            prompt: "What fraction of an hour is 20 minutes?",
            answers: ["1/3", "20/60"],
            why: "$\\frac{20}{60}$.",
            retry: {
              prompt: "What fraction of an hour is 40 minutes?",
              answers: ["2/3", "40/60"],
              why: "$\\frac{40}{60}$.",
            },
          },
          {
            prompt: "What fraction of 1 kg is 250 g?",
            answers: ["1/4", "250/1000"],
            why: "$\\frac{250}{1000}$.",
            retry: {
              prompt: "What fraction of 1 kg is 600 g?",
              answers: ["3/5", "600/1000"],
              why: "$\\frac{600}{1000}$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-ratio",
    id: "y7-ratio/more-than-one",
    before: OVER_ONE,
    title: "More than the whole",
    summary: "When the part is bigger than the whole, the fraction is more than 1.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A growing plant",
        text: [
          "Last month a sunflower was 80 cm tall. Now it's 120 cm.",
          "As a fraction of its old height, how tall is it now? By the end of this lesson, you can say.",
        ],
        picture: bars([
          ["Then", 2],
          ["Now", 3],
        ]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What fraction of 8 is 4?",
        answers: ["1/2"],
        hint: "$\\frac48$.",
        done: "$\\frac12$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Write $\\frac32$ as a mixed number. Type like 1 1/2.",
        answers: ["1 1/2"],
        hint: "2 halves make 1.",
        done: "$1\\frac12$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Bigger than the whole",
        text: [
          "'What fraction of 8 is 12?' Part over whole still works: $\\frac{12}{8} = \\frac32$.",
          "The answer is more than 1 because 12 is more than 8: one and a half times as big.",
        ],
        picture: bars([
          ["8", 2],
          ["12", 3],
        ]),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "What fraction of 8 is 12?",
        options: [
          { text: "$\\frac32$", correct: true, feedback: "$\\frac{12}{8}$, simplified." },
          { text: "$\\frac23$", feedback: "That's what fraction of 12 is 8." },
          { text: "$\\frac{4}{8}$", feedback: "That's the difference, not the fraction." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "What fraction of 20 is 35?",
        problem: "What fraction of 20 is 35?",
        steps: [
          { line: "$\\frac{35}{20}$", why: "Part over whole." },
          { line: "$= \\frac74 = 1\\frac34$", why: "Simplify: ÷ 5." },
        ],
        done: "35 is $1\\frac34$ times as much as 20.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "What fraction of 6 is 15?",
        start: "$\\frac{15}{6}$",
        stages: [
          {
            prompt: "Simplify:",
            options: [
              { text: "$\\frac52$", correct: true, feedback: "" },
              { text: "$\\frac25$", feedback: "15 stays on top." },
            ],
            then: "$\\frac52$",
          },
          {
            prompt: "As a mixed number:",
            options: [
              { text: "$2\\frac12$", correct: true, feedback: "" },
              { text: "$5\\frac12$", feedback: "How many 2s in 5?" },
            ],
            then: "$2\\frac12$",
          },
        ],
        done: "15 is two and a half times 6.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Money",
        start: "What fraction of £4 is £5?",
        stages: [
          {
            prompt: "Part over whole:",
            options: [
              { text: "$\\frac54$", correct: true, feedback: "" },
              { text: "$\\frac45$", feedback: "£5 is the part; £4 the whole." },
            ],
            then: "$\\frac54 = 1\\frac14$",
          },
        ],
        done: "£5 is $1\\frac14$ of £4.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What fraction of 10 is 25?",
        text: "Simplest form, like 3/2.",
        answers: ["5/2", "2 1/2"],
        wrong: [{ answer: "2/5", feedback: "That's the fraction of 25 that 10 is." }],
        hint: "$\\frac{25}{10}$.",
        done: "$\\frac52$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What fraction of 9 is 12?",
        text: "Simplest form.",
        answers: ["4/3", "1 1/3"],
        hint: "$\\frac{12}{9}$, ÷ 3.",
        done: "$\\frac43$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "What fraction of 4 is 6? Jo says $\\frac46$, because fractions are less than 1. Is she right?",
        options: [
          {
            text: "No: 6 is more than 4, so it's $\\frac64 = \\frac32$",
            correct: true,
            feedback: "Fractions can be more than 1. Always put the part (the 'is' number) on top.",
          },
          { text: "Yes", feedback: "$\\frac46$ is what fraction of 6 is 4." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ben finds what fraction of 15 is 20.",
        lines: [
          "Part over whole: $\\frac{20}{15}$",
          "Simplify: $\\frac43$",
          "So 20 is $\\frac34$ of 15",
        ],
        wrong: 2,
        why: "He flipped it at the end. 20 is $\\frac43$ of 15: more than 1, since 20 > 15.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "A growing plant",
        text: "It grew from 80 cm to 120 cm. What fraction of its old height is it now? Simplest form.",
        answers: ["3/2", "1 1/2"],
        wrong: [{ answer: "2/3", feedback: "The new height, 120, goes on top." }],
        hint: "$\\frac{120}{80}$.",
        done: "$\\frac32$: one and a half times as tall.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What fraction of 6 is 9?",
            answers: ["3/2", "1 1/2"],
            why: "$\\frac96$.",
            retry: {
              prompt: "What fraction of 4 is 10?",
              answers: ["5/2", "2 1/2"],
              why: "$\\frac{10}{4}$.",
            },
          },
          {
            prompt: "What fraction of 3 is 4?",
            answers: ["4/3", "1 1/3"],
            why: "$\\frac43$.",
            retry: {
              prompt: "What fraction of 5 is 7?",
              answers: ["7/5", "1 2/5"],
              why: "$\\frac75$.",
            },
          },
          {
            prompt: "If the part is bigger than the whole, the fraction is",
            options: ["more than 1", "less than 1", "exactly 1"],
            answers: ["more than 1"],
            why: "Top bigger than bottom.",
            retry: {
              prompt: "What fraction of 10 is 10?",
              options: ["1", "$\\frac{1}{10}$", "10"],
              answers: ["1"],
              why: "$\\frac{10}{10}$.",
            },
          },
        ],
      },
    ],
  },
];
