// Year 8, "Percentages": one amount as a percentage of another, percentage change as a single
// multiplication, working back to the original with a bar model, and simple interest.
import type { UnitLesson } from "./types.ts";

export const y8Percentages: UnitLesson = {
  unit: "y8-percentages",
  title: "Percentages, there and back",
  summary: "Change amounts by a percentage, then work back to where they started.",
  screens: [
    {
      kind: "explain",
      title: "Out of a hundred",
      text: [
        "To write 18 out of 24 as a percentage, write it as a fraction, then a decimal, then a percentage.",
        "$\\frac{18}{24} = 0.75 = 75\\%$.",
      ],
      picture: {
        kind: "bars",
        rows: [{ label: "Score", parts: 4, shaded: 3, each: "6" }],
        total: "24",
      },
    },
    {
      kind: "answer",
      title: "A test score",
      text: "Ali scored 42 out of 60. What percentage is that?",
      answers: ["70"],
      unit: "%",
      wrong: [{ answer: "42", feedback: "That is out of 60, not 100. Divide 42 by 60." }],
      hint: "$42 \\div 60$, then × 100.",
      done: "$\\frac{42}{60} = 0.7 = 70\\%$.",
    },
    {
      kind: "answer",
      title: "Of £80",
      text: "What percentage of £80 is £12?",
      answers: ["15"],
      unit: "%",
      wrong: [{ answer: "12", feedback: "£12 out of £80, not out of 100." }],
      hint: "$12 \\div 80$, then × 100.",
      done: "$12 \\div 80 = 0.15 = 15\\%$.",
    },
    {
      kind: "fill",
      title: "Multipliers",
      template: "Up 35%: $\\times$ [] and down 4%: $\\times$ []",
      bank: ["$1.35$", "$0.35$", "$0.96$", "$0.04$", "$1.04$"],
      answers: ["$1.35$", "$0.96$"],
      hint: "Up 35% leaves 135%. Down 4% leaves 96%.",
      done: "One multiplication does the whole change.",
    },
    {
      kind: "answer",
      title: "Increase £250 by 12%",
      text: "Give the new amount in pounds.",
      answers: ["280"],
      wrong: [{ answer: "30", feedback: "£30 is the increase. Add it on, or multiply by 1.12." }],
      hint: "Multiply by 1.12.",
      done: "$250 \\times 1.12 = £280$.",
    },
    {
      kind: "answer",
      title: "15% off",
      text: "A £68 coat has 15% off. What is the sale price, in pounds?",
      answers: ["57.80"],
      wrong: [{ answer: "10.2", feedback: "£10.20 is the discount. You pay the other 85%." }],
      hint: "Multiply by 0.85.",
      done: "$68 \\times 0.85 = £57.80$.",
    },
    {
      kind: "answer",
      title: "Percentage change",
      text: "A price goes up from £40 to £46. What is the percentage increase?",
      answers: ["15"],
      unit: "%",
      wrong: [
        {
          answer: "6",
          feedback:
            "£6 is the increase in pounds. As a percentage of the original £40: $6 \\div 40$.",
        },
        { answer: "13", feedback: "Divide by the original price, £40, not the new one." },
      ],
      hint: "The change ÷ the original, × 100.",
      done: "$6 \\div 40 = 0.15$: a 15% increase.",
    },
    {
      kind: "explain",
      title: "Working backwards",
      text: [
        "After a 20% rise, a price is £60. The £60 is 120% of the original, not 100%.",
        "In the bar model, each 20% box is worth $£60 \\div 6 = £10$, so the original 5 boxes were £50.",
      ],
      picture: {
        kind: "bars",
        rows: [
          { label: "Original", parts: 5, each: "20%" },
          { label: "After", parts: 6, each: "£10" },
        ],
      },
    },
    {
      kind: "steps",
      title: "Find the original price",
      text: "After a 20% rise, a price is £60.",
      start: "$120\\% = £60$",
      stages: [
        {
          prompt: "So 1% is",
          options: [
            { text: "£0.50", correct: true, feedback: "" },
            { text: "£0.60", feedback: "£60 is 120%, not 100%: divide by 120." },
            { text: "£0.72", feedback: "Divide £60 by 120." },
          ],
          then: "$1\\% = £60 \\div 120 = £0.50$",
        },
        {
          prompt: "So the original price, 100%, is",
          options: [
            { text: "£50", correct: true, feedback: "" },
            {
              text: "£48",
              feedback:
                "That takes 20% of £60 away. The 20% was of the original price, not of £60.",
            },
            { text: "£72", feedback: "That adds another 20%. Go back down to 100%." },
          ],
          then: "$100\\% = £50$",
        },
      ],
      done: "Or in one step: $£60 \\div 1.2 = £50$. Check: $50 \\times 1.2 = 60$ ✓",
    },
    {
      kind: "answer",
      title: "A sale, backwards",
      text: "After 25% off, a game costs £36. What was the original price, in pounds?",
      answers: ["48"],
      wrong: [
        {
          answer: "45",
          feedback: "That adds 25% of £36. But £36 is 75% of the original: $36 \\div 0.75$.",
        },
        { answer: "27", feedback: "That takes another 25% off. Work back up to 100%." },
      ],
      hint: "£36 is 75% of the original.",
      done: "$36 \\div 0.75 = £48$. Check: 25% of £48 is £12, and $48 - 12 = 36$ ✓",
    },
    {
      kind: "explain",
      title: "Simple interest",
      text: [
        "Simple interest is the same every year: a percentage of the amount first put in.",
        "£200 at 5% a year earns £10 each year.",
      ],
      picture: {
        kind: "table",
        head: ["Year", "Interest", "Total"],
        rows: [
          ["1", "£10", "£210"],
          ["2", "£10", "£220"],
          ["3", "£10", "£230"],
        ],
      },
    },
    {
      kind: "answer",
      title: "Interest for 4 years",
      text: "£500 is saved at 3% simple interest a year for 4 years. How much interest is earned in total, in pounds?",
      answers: ["60"],
      wrong: [
        { answer: "15", feedback: "That is one year's interest. There are 4 years." },
        { answer: "560", feedback: "That is the total saved. The interest is only the extra." },
      ],
      hint: "3% of £500 each year, for 4 years.",
      done: "3% of £500 is £15, and $4 \\times 15 = £60$.",
    },
    {
      kind: "explain",
      title: "There and back",
      text: [
        "A as a percentage of B: $A \\div B \\times 100$.",
        "Change by a percentage with one multiplier; work back by dividing by it.",
        "Simple interest adds the same amount every year.",
      ],
      picture: {
        kind: "maths",
        tex: "£50 \\xrightarrow{\\times 1.2} £60 \\xrightarrow{\\div 1.2} £50",
      },
    },
  ],
};
