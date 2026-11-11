// Year 7, "Fractions, decimals and percentages", as three short lessons, one just before each
// skill: moving between decimals and fractions, writing percentages as fractions and decimals, and
// seeing a percentage change as a fraction or decimal multiplier. Each starts from something
// quick, builds the idea a step at a time, names the common mistakes, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const DECIMALS = "Y7-FR-01";
const PERCENT = "Y7-RAT-05.a";
const CHANGE = "Y7-RAT-05.b";

const hundred = (shaded: number) => ({ kind: "grid" as const, cols: 10, rows: 10, shaded });

export const y7Fdp: UnitLesson[] = [
  {
    unit: "y7-fdp",
    id: "y7-fdp/decimals-fractions",
    before: DECIMALS,
    title: "Decimals and fractions",
    summary: "Every terminating decimal is a fraction out of 10, 100 or 1000, and back.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Which is more?",
        text: [
          "A recipe needs $\\frac38$ of a kilogram of flour. The scales only show decimals, and read 0.4 kg.",
          "Is that too much or too little? By the end of this lesson, you can switch between fractions and decimals.",
        ],
        picture: {
          kind: "number-line",
          min: 0,
          max: 1,
          step: 0.1,
          marks: [{ at: 0.4, label: "0.4" }],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is the 7 worth in 0.7?",
        text: "Give a fraction, like 1/2.",
        answers: ["7/10"],
        hint: "The first column after the point is tenths.",
        done: "Seven tenths: $\\frac{7}{10}$.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Simplify $\\frac{25}{100}$",
        options: [
          { text: "$\\frac14$", correct: true, feedback: "Divide top and bottom by 25." },
          {
            text: "$\\frac{5}{10}$",
            feedback: "Divide both by 25: $\\frac14$. ($\\frac{5}{10}$ is a half.)",
          },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Decimals are fractions",
        text: [
          "The columns after the point are tenths, hundredths, thousandths. So 0.35 is 35 hundredths: $\\frac{35}{100} = \\frac{7}{20}$.",
          "And 3.5 is $3\\frac{5}{10} = 3\\frac12 = \\frac72$.",
        ],
        picture: hundred(35),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "0.6 as a fraction",
        options: [
          { text: "$\\frac{6}{10} = \\frac35$", correct: true, feedback: "6 tenths, simplified." },
          { text: "$\\frac{1}{6}$", feedback: "0.6 is 6 tenths, not one sixth." },
          { text: "$\\frac{6}{100}$", feedback: "That's 0.06." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Fractions to decimals",
        text: [
          "A fraction is a division: $\\frac38 = 3 \\div 8 = 0.375$.",
          "Or make the bottom 10, 100 or 1000: $\\frac{3}{20} = \\frac{15}{100} = 0.15$.",
        ],
        picture: { kind: "maths", tex: "\\frac38 = 3 \\div 8 = 0.375" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "0.375 as a fraction",
        problem: "Write 0.375 as a fraction in its simplest form.",
        steps: [
          { line: "$0.375 = \\frac{375}{1000}$", why: "Three decimal places: thousandths." },
          {
            line: "$= \\frac{75}{200} = \\frac{15}{40} = \\frac38$",
            why: "Divide by 5 until you can't.",
          },
        ],
        done: "$\\frac38$. Check: $3 \\div 8 = 0.375$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$\\frac{7}{20}$ as a decimal",
        start: "$\\frac{7}{20}$",
        stages: [
          {
            prompt: "Make the bottom 100: multiply by",
            options: [
              { text: "5: $\\frac{35}{100}$", correct: true, feedback: "" },
              { text: "80", feedback: "$20 \\times 5 = 100$." },
            ],
            then: "$\\frac{35}{100}$",
          },
          {
            prompt: "As a decimal:",
            options: [
              { text: "0.35", correct: true, feedback: "" },
              { text: "0.7", feedback: "$\\frac{35}{100}$ is 35 hundredths." },
            ],
            then: "0.35",
          },
        ],
        done: "Same value, two ways of writing it.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "2.25 as a fraction",
        start: "2.25",
        stages: [
          {
            prompt: "The 0.25 part is",
            options: [
              { text: "$\\frac{25}{100} = \\frac14$", correct: true, feedback: "" },
              { text: "$\\frac{1}{25}$", feedback: "25 hundredths." },
            ],
            then: "$2\\frac14$",
          },
          {
            prompt: "As an improper fraction:",
            options: [
              { text: "$\\frac94$", correct: true, feedback: "" },
              { text: "$\\frac{2}{4}$", feedback: "Two wholes are 8 quarters, plus 1." },
            ],
            then: "$\\frac94$",
          },
        ],
        done: "$2.25 = 2\\frac14 = \\frac94$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Write 0.45 as a fraction in its simplest form",
        answers: ["9/20"],
        wrong: [{ answer: "45/100", feedback: "Right value, but simplify: divide by 5." }],
        hint: "$\\frac{45}{100}$, then divide by 5.",
        done: "$\\frac{9}{20}$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Write $\\frac58$ as a decimal",
        answers: ["0.625"],
        wrong: [{ answer: "0.58", feedback: "A fraction isn't its digits: $5 \\div 8$." }],
        hint: "$5 \\div 8$. Half of $\\frac54$ (1.25).",
        done: "$5 \\div 8 = 0.625$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Sam writes $\\frac14 = 0.14$. Is he right?",
        options: [
          {
            text: "No: $\\frac14 = 1 \\div 4 = 0.25$",
            correct: true,
            feedback:
              "Writing the digits after a point is a very common slip. A fraction means divide.",
          },
          { text: "Yes", feedback: "0.14 is 14 hundredths; a quarter is 25 hundredths." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ivy writes 0.08 as a fraction.",
        lines: ["0.08 has 8 in the tenths column", "So it's $\\frac{8}{10}$", "$= \\frac45$"],
        wrong: 0,
        why: "The 8 is in the **hundredths** column: $\\frac{8}{100} = \\frac{2}{25}$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Which is more?",
        text: "The recipe needs $\\frac38$ kg; the scales show 0.4 kg.",
        options: [
          {
            text: "0.4 is a little too much: $\\frac38 = 0.375$",
            correct: true,
            feedback: "Take off 0.025 kg: 25 g.",
          },
          { text: "0.4 is too little", feedback: "$\\frac38 = 0.375$, which is less than 0.4." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Write 0.2 as a fraction in its simplest form.",
            answers: ["1/5"],
            why: "$\\frac{2}{10}$.",
            retry: {
              prompt: "Write 0.8 as a fraction in its simplest form.",
              answers: ["4/5"],
              why: "$\\frac{8}{10}$.",
            },
          },
          {
            prompt: "Write $\\frac{3}{4}$ as a decimal.",
            answers: ["0.75"],
            why: "$3 \\div 4$.",
            retry: {
              prompt: "Write $\\frac{2}{5}$ as a decimal.",
              answers: ["0.4"],
              why: "$2 \\div 5$.",
            },
          },
          {
            prompt: "Write 1.5 as an improper fraction.",
            answers: ["3/2"],
            why: "$1\\frac12$.",
            retry: {
              prompt: "Write 2.5 as an improper fraction.",
              answers: ["5/2"],
              why: "$2\\frac12$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-fdp",
    id: "y7-fdp/percentages",
    before: PERCENT,
    title: "Percentages",
    summary: "Per cent means out of 100: change percentages into fractions and decimals.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Which is the best score?",
        text: [
          "Ali scores 70% in a test. Ben gets $\\frac{18}{25}$, and Cara 0.68.",
          "Who did best? By the end of this lesson, you can compare them.",
        ],
        picture: hundred(70),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "How many squares are in a hundred square?",
        answers: ["100"],
        hint: "10 by 10.",
        done: "100.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Write $\\frac{3}{10}$ as a decimal",
        answers: ["0.3"],
        hint: "3 tenths.",
        done: "0.3.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Per cent: out of 100",
        text: [
          "'Per cent' means 'out of 100'. 70% is 70 out of 100: $\\frac{70}{100} = 0.7$.",
          "So to change a percentage to a decimal, divide by 100.",
        ],
        picture: hundred(70),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "35% as a decimal",
        picture: hundred(35),
        options: [
          { text: "0.35", correct: true, feedback: "35 hundredths." },
          { text: "3.5", feedback: "That's 350%. Divide by 100: 0.35." },
          { text: "0.035", feedback: "That's 3.5%." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "40% three ways",
        problem: "Write 40% as a fraction and as a decimal.",
        steps: [
          { line: "$40\\% = \\frac{40}{100}$", why: "Out of 100." },
          { line: "$= \\frac25$", why: "Simplify: divide by 20." },
          { line: "$= 0.4$", why: "40 hundredths, or $2 \\div 5$." },
        ],
        done: "$40\\% = \\frac25 = 0.4$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "5% as a fraction and a decimal",
        start: "5%",
        stages: [
          {
            prompt: "As a decimal:",
            options: [
              { text: "0.05", correct: true, feedback: "" },
              { text: "0.5", feedback: "That's 50%. 5 hundredths is 0.05." },
            ],
            then: "0.05",
          },
          {
            prompt: "As a fraction:",
            options: [
              { text: "$\\frac{1}{20}$", correct: true, feedback: "" },
              { text: "$\\frac15$", feedback: "$\\frac{5}{100} = \\frac{1}{20}$." },
            ],
            then: "$\\frac{1}{20}$",
          },
        ],
        done: "5% is a small amount: a twentieth.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$\\frac{9}{25}$ as a percentage",
        start: "$\\frac{9}{25}$",
        stages: [
          {
            prompt: "Make it out of 100:",
            options: [
              { text: "$\\frac{36}{100}$", correct: true, feedback: "" },
              { text: "$\\frac{9}{100}$", feedback: "Multiply top and bottom by 4." },
            ],
            then: "$\\frac{36}{100}$",
          },
          {
            prompt: "So",
            options: [
              { text: "36%", correct: true, feedback: "" },
              { text: "9%", feedback: "36 out of 100." },
            ],
            then: "36%",
          },
        ],
        done: "Out of 100 is a percentage.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Write 0.6 as a percentage",
        answers: ["60"],
        unit: "%",
        wrong: [{ answer: "6", feedback: "0.6 is 60 hundredths." }],
        hint: "Multiply by 100.",
        done: "60%.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Write 75% as a fraction in its simplest form",
        answers: ["3/4"],
        hint: "$\\frac{75}{100}$, then divide by 25.",
        done: "$\\frac34$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Jo says 8% is 0.8. Is she right?",
        options: [
          {
            text: "No: 8% is 0.08",
            correct: true,
            feedback:
              "Divide by 100: two places. 0.8 is 80%. Single-digit percentages trip people up.",
          },
          { text: "Yes", feedback: "0.8 is 80 hundredths: 80%." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo writes $\\frac{3}{5}$ as a percentage.",
        lines: ["$\\frac35$ is 3 out of 5", "So it's 3%", "And 0.03 as a decimal"],
        wrong: 1,
        why: "Per cent is out of 100: $\\frac35 = \\frac{60}{100} = 60\\%$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Which is the best score?",
        text: "Ali 70%, Ben $\\frac{18}{25}$, Cara 0.68.",
        options: [
          {
            text: "Ben: $\\frac{18}{25} = 72\\%$",
            correct: true,
            feedback: "Ben 72%, Ali 70%, Cara 68%.",
          },
          { text: "Ali: 70%", feedback: "$\\frac{18}{25} = \\frac{72}{100} = 72\\%$." },
          { text: "Cara: 0.68", feedback: "0.68 is 68%." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Write 45% as a decimal.",
            answers: ["0.45"],
            why: "÷ 100.",
            retry: { prompt: "Write 12% as a decimal.", answers: ["0.12"], why: "÷ 100." },
          },
          {
            prompt: "Write 0.3 as a percentage (just the number).",
            answers: ["30"],
            why: "× 100.",
            retry: {
              prompt: "Write 0.07 as a percentage (just the number).",
              answers: ["7"],
              why: "× 100.",
            },
          },
          {
            prompt: "Write 20% as a fraction in its simplest form.",
            answers: ["1/5"],
            why: "$\\frac{20}{100}$.",
            retry: {
              prompt: "Write 25% as a fraction in its simplest form.",
              answers: ["1/4"],
              why: "$\\frac{25}{100}$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-fdp",
    id: "y7-fdp/changes",
    before: CHANGE,
    title: "Percentage changes as multipliers",
    summary:
      "A rise or fall in per cent is one multiplication: up 20% is × 1.2; down 25% is × 0.75.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "In the sale",
        text: [
          "A coat costing £80 is reduced by 25% in a sale. Then a new coat, £60, goes up in price by 10%.",
          "What do they cost now, in just one calculation each? By the end of this lesson, you can do it.",
        ],
        picture: { kind: "bars", rows: [{ label: "£80", parts: 4, shaded: 3 }] },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is 25% of £80?",
        answers: ["20"],
        hint: "25% is a quarter.",
        done: "£20.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Write 75% as a decimal",
        answers: ["0.75"],
        hint: "÷ 100.",
        done: "0.75.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "What's left",
        text: [
          "Take 25% off and 75% is left. So the new price is 75% of the old: $\\times 0.75$, or $\\times \\frac34$.",
          "$80 \\times 0.75 = 60$: one step instead of two.",
        ],
        picture: {
          kind: "bars",
          rows: [
            { label: "100%", parts: 4, shaded: 4 },
            { label: "75%", parts: 4, shaded: 3 },
          ],
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "To increase by 10%, multiply by",
        options: [
          { text: "1.1: you keep 100% and add 10%", correct: true, feedback: "110% = 1.1." },
          { text: "0.1", feedback: "× 0.1 finds just the 10%." },
          { text: "10", feedback: "That's 1000%!" },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Up 20%",
        problem: "A £45 ticket goes up 20%. Find the new price.",
        steps: [
          { line: "$100\\% + 20\\% = 120\\% = 1.2$", why: "The multiplier." },
          { line: "$45 \\times 1.2 = 54$", why: "One multiplication." },
        ],
        done: "£54. Check: 20% of 45 is 9, and $45 + 9 = 54$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Down 30%",
        start: "A £50 game is 30% off.",
        stages: [
          {
            prompt: "What's left, as a multiplier:",
            options: [
              { text: "0.7", correct: true, feedback: "" },
              { text: "0.3", feedback: "0.3 is the part taken off. 70% is left." },
            ],
            then: "× 0.7",
          },
          {
            prompt: "The new price:",
            options: [
              { text: "£35", correct: true, feedback: "" },
              { text: "£15", feedback: "That's the discount, not the price." },
            ],
            then: "£35",
          },
        ],
        done: "Down 30%: × 0.7.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "As a fraction",
        start: "A price goes down by a quarter.",
        stages: [
          {
            prompt: "The multiplier as a fraction:",
            options: [
              { text: "$\\frac34$", correct: true, feedback: "" },
              { text: "$\\frac14$", feedback: "A quarter is lost; three quarters stay." },
            ],
            then: "$\\times \\frac34$",
          },
          {
            prompt: "As a decimal:",
            options: [
              { text: "0.75", correct: true, feedback: "" },
              { text: "0.34", feedback: "$3 \\div 4 = 0.75$." },
            ],
            then: "× 0.75",
          },
        ],
        done: "Fractions and decimals are both fine multipliers.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "The multiplier for a 15% decrease",
        options: [
          { text: "0.85", correct: true, feedback: "85% left." },
          { text: "0.15", feedback: "That's the part lost." },
          { text: "1.15", feedback: "That's an increase." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Increase £30 by 50%",
        answers: ["45"],
        hint: "× 1.5.",
        done: "$30 \\times 1.5 = 45$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "For a 5% increase, Kai multiplies by 1.5. Is he right?",
        options: [
          {
            text: "No: 5% is 0.05, so × 1.05",
            correct: true,
            feedback: "1.5 is a 50% increase. Getting the decimal right matters.",
          },
          { text: "Yes", feedback: "1.5 is 150%." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ella reduces £60 by 20%.",
        lines: ["20% off leaves 80%", "So multiply by 0.2", "$60 \\times 0.2 = £12$"],
        wrong: 1,
        why: "80% left means × 0.8: $60 \\times 0.8 = £48$. £12 is the discount.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "In the sale",
        start: "£80 down 25%; £60 up 10%.",
        stages: [
          {
            prompt: "The first coat: $80 \\times$",
            options: [
              { text: "$0.75 = £60$", correct: true, feedback: "" },
              { text: "$0.25 = £20$", feedback: "That's the discount." },
            ],
            then: "£60",
          },
          {
            prompt: "The second coat: $60 \\times$",
            options: [
              { text: "$1.1 = £66$", correct: true, feedback: "" },
              { text: "$0.1 = £6$", feedback: "That's just the rise." },
            ],
            then: "£66",
          },
        ],
        done: "One multiplication each.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The multiplier for a 20% increase is",
            options: ["1.2", "0.2", "0.8"],
            answers: ["1.2"],
            why: "120%.",
            retry: {
              prompt: "The multiplier for a 40% increase is",
              options: ["1.4", "0.4", "0.6"],
              answers: ["1.4"],
              why: "140%.",
            },
          },
          {
            prompt: "The multiplier for a 10% decrease is",
            options: ["0.9", "0.1", "1.1"],
            answers: ["0.9"],
            why: "90% left.",
            retry: {
              prompt: "The multiplier for a 35% decrease is",
              options: ["0.65", "0.35", "1.35"],
              answers: ["0.65"],
              why: "65% left.",
            },
          },
          {
            prompt: "Decrease £40 by 25%.",
            answers: ["30"],
            why: "$40 \\times 0.75$.",
            retry: { prompt: "Decrease £120 by 50%.", answers: ["60"], why: "$120 \\times 0.5$." },
          },
        ],
      },
    ],
  },
];
