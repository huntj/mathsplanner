// Year 7, "Fractions, decimals and percentages": one amount in three outfits. Shade a hundred
// square, match the outfits, turn fractions into decimals by dividing and back by place value,
// and see a percentage change as one multiplication.
import type { UnitLesson } from "./types.ts";

export const y7Fdp: UnitLesson = {
  unit: "y7-fdp",
  title: "One number, three outfits",
  summary: "See the same amount as a fraction, a decimal and a percentage.",
  screens: [
    {
      kind: "shade",
      title: "Shade 0.35 of the hundred square",
      text: "Each small square is one hundredth.",
      cols: 10,
      rows: 10,
      target: 35,
      hint: "0.35 is 35 hundredths: 3 full columns of 10, and 5 more.",
      done: "35 squares out of 100: $0.35 = \\frac{35}{100} = 35\\%$. Three ways to write one amount.",
    },
    {
      kind: "sort",
      title: "Match the outfits",
      groups: ["$= 0.5$", "$= 0.25$", "$= 0.75$"],
      items: [
        { text: "$\\frac{1}{2}$", group: 0, why: "Half of 1 is 0.5." },
        { text: "$50\\%$", group: 0, why: "50% is 50 hundredths, 0.50." },
        { text: "$\\frac{1}{4}$", group: 1, why: "$1 \\div 4 = 0.25$." },
        { text: "$\\frac{3}{12}$", group: 1, why: "$\\frac{3}{12}$ simplifies to $\\frac14$." },
        { text: "$75\\%$", group: 2, why: "75% is 75 hundredths, 0.75." },
        {
          text: "$\\frac{6}{8}$",
          group: 2,
          why: "$\\frac68$ simplifies to $\\frac34$, which is 0.75.",
        },
      ],
      done: "Different outfits, same amount. A fraction can have many outfits of its own, too: $\\frac14 = \\frac{3}{12}$.",
    },
    {
      kind: "steps",
      title: "A fraction is a division",
      start: "$\\frac{3}{8}$ as a decimal",
      stages: [
        {
          prompt: "$\\frac38$ means",
          options: [
            { text: "$3 \\div 8$", correct: true, feedback: "" },
            { text: "$8 \\div 3$", feedback: "The top is divided by the bottom." },
            { text: "$3 \\times 8$", feedback: "A fraction bar means divide." },
          ],
          then: "$\\frac{3}{8} = 3 \\div 8$",
        },
        {
          prompt: "$3 \\div 8 =$",
          options: [
            { text: "$0.375$", correct: true, feedback: "" },
            { text: "$0.38$", feedback: "That is rounded. $3 \\div 8$ comes out exactly." },
            { text: "$2.67$", feedback: "That is $8 \\div 3$." },
          ],
          then: "$= 0.375$",
        },
      ],
      done: "$\\frac38 = 0.375$. Divide the top by the bottom to turn any fraction into a decimal.",
    },
    {
      kind: "steps",
      title: "And back again",
      start: "$3.5$ as a fraction",
      stages: [
        {
          prompt: "3.5 is 35 tenths, so it is",
          options: [
            { text: "$\\frac{35}{10}$", correct: true, feedback: "" },
            {
              text: "$\\frac{3}{5}$",
              feedback: "The digits are not the top and bottom: 3.5 is three and a half.",
            },
            {
              text: "$\\frac{35}{100}$",
              feedback: "That is 0.35. 3.5 has one decimal place: tenths.",
            },
          ],
          then: "$3.5 = \\frac{35}{10}$",
        },
        {
          prompt: "Simplify: divide the top and bottom by 5.",
          options: [
            { text: "$\\frac{7}{2}$", correct: true, feedback: "" },
            { text: "$\\frac{7}{10}$", feedback: "Divide the bottom by 5 as well." },
            { text: "$\\frac{35}{2}$", feedback: "Divide the top by 5 as well." },
          ],
          then: "$= \\frac{7}{2}$",
        },
      ],
      done: "$3.5 = \\frac72$. Place value gives the bottom: tenths, hundredths or thousandths.",
    },
    {
      kind: "answer",
      title: "Write 0.6 as a fraction",
      text: "Give it in its simplest form, like 2/3.",
      answers: ["3/5"],
      wrong: [
        {
          answer: "6/10",
          feedback: "That is the right amount; now simplify it. Divide both by 2.",
        },
        { answer: "1/6", feedback: "0.6 is six tenths, not one sixth." },
      ],
      hint: "0.6 is 6 tenths. Then simplify.",
      done: "$0.6 = \\frac{6}{10} = \\frac35$.",
    },
    {
      kind: "place",
      title: "Three outfits on one line",
      line: { kind: "number-line", min: 0, max: 1, step: 0.05, every: 2 },
      targets: [
        { value: 0.25, label: "$\\frac{1}{4}$" },
        { value: 0.6, label: "$60\\%$", mark: "60%" },
        { value: 0.9, label: "$0.9$" },
      ],
      hint: "Turn each one into a decimal: $\\frac14 = 0.25$ and 60% = 0.6.",
      done: "Fractions, decimals and percentages all live on the same number line.",
    },
    {
      kind: "answer",
      title: "Write 7% as a decimal",
      answers: ["0.07"],
      wrong: [{ answer: "0.7", feedback: "0.7 is 70%. 7% is 7 hundredths." }],
      hint: "Per cent means 'out of 100': divide by 100.",
      done: "$7\\% = \\frac{7}{100} = 0.07$.",
    },
    {
      kind: "answer",
      title: "Write 45% as a fraction",
      text: "Give it in its simplest form.",
      answers: ["9/20"],
      wrong: [{ answer: "45/100", feedback: "Right amount; now simplify. Divide both by 5." }],
      hint: "45% is $\\frac{45}{100}$. Then simplify.",
      done: "$45\\% = \\frac{45}{100} = \\frac{9}{20}$.",
    },
    {
      kind: "explain",
      title: "Percentage change in one step",
      text: [
        "A 20% increase means you end with 100% + 20% = 120% of what you started with.",
        "As a decimal, that is $\\times 1.2$. A 20% decrease leaves 80%: $\\times 0.8$.",
      ],
      picture: {
        kind: "bars",
        rows: [
          { label: "Before", parts: 10, each: "" },
          { label: "After +20%", parts: 12, shaded: 12 },
        ],
      },
    },
    {
      kind: "fill",
      title: "Find the multipliers",
      template: "A 15% increase is $\\times$ [] and a 15% decrease is $\\times$ []",
      bank: ["$1.15$", "$0.85$", "$0.15$", "$1.5$", "$115$"],
      answers: ["$1.15$", "$0.85$"],
      hint: "100% + 15% = 115%, and 100% − 15% = 85%. Now write them as decimals.",
      done: "Up 15%: × 1.15. Down 15%: × 0.85.",
    },
    {
      kind: "answer",
      title: "A sale",
      text: "A £40 jacket is reduced by 25%. What decimal do you multiply £40 by to find the sale price?",
      answers: ["0.75"],
      wrong: [{ answer: "0.25", feedback: "× 0.25 finds the discount. You pay the other 75%." }],
      hint: "You pay 100% − 25% of the price.",
      done: "$40 \\times 0.75 = £30$.",
    },
    {
      kind: "choice",
      title: "Up 10%, then down 10%",
      text: "A price goes up by 10%, then down by 10%. Is it back where it started?",
      options: [
        {
          text: "No, it is a bit lower",
          correct: true,
          feedback:
            "$\\times 1.1$ then $\\times 0.9$ is $\\times 0.99$: 1% lower. The 10% off is 10% of a bigger price.",
        },
        { text: "Yes, exactly", feedback: "Try £100: up 10% is £110, and 10% of £110 is £11." },
        { text: "No, it is a bit higher", feedback: "Try £100: up to £110, then down £11." },
      ],
    },
    {
      kind: "explain",
      title: "Three outfits",
      text: [
        "Fraction → decimal: divide the top by the bottom. Decimal → fraction: use place value, then simplify.",
        "Per cent means out of 100.",
        "A percentage change is one multiplication: up 20% is × 1.2, down 20% is × 0.8.",
      ],
      picture: { kind: "grid", cols: 10, rows: 10, shaded: 35 },
    },
  ],
};
