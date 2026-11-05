// Year 8, "Percentages", as four short lessons, one just before each skill: one amount as a
// percentage of another, percentage change as a single multiplier, working back to the original
// with a bar model, and simple interest. Each starts from something quick, builds the idea a step
// at a time, names the common mistakes, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const OF_ANOTHER = "Y8-RAT-03.a";
const CHANGE = "Y8-RAT-03.b";
const ORIGINAL = "Y8-RAT-03.c";
const INTEREST = "Y8-RAT-03.d";

export const y8Percentages: UnitLesson[] = [
  {
    unit: "y8-percentages",
    id: "y8-percentages/of-another",
    before: OF_ANOTHER,
    title: "Out of a hundred",
    summary: "Write one amount as a fraction of another, then as a percentage.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Two tests",
        text: [
          "Ali scored 42 out of 60 in maths and 36 out of 45 in science. Which test went better?",
          "The tests have different totals, so you can't just compare 42 and 36. By the end of this lesson, you can compare them fairly.",
        ],
        picture: {
          kind: "table",
          head: ["Test", "Score", "Out of"],
          rows: [
            ["Maths", "42", "60"],
            ["Science", "36", "45"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Write $\\frac{3}{4}$ as a percentage",
        answers: ["75"],
        unit: "%",
        hint: "A quarter is 25%.",
        done: "$\\frac34 = 75\\%$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Write 0.4 as a percentage",
        answers: ["40"],
        unit: "%",
        wrong: [{ answer: "4", feedback: "Multiply by 100: 0.4 × 100 = 40." }],
        hint: "Times 100.",
        done: "$0.4 = 40\\%$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Fraction, decimal, percentage",
        text: [
          "18 out of 24 is the fraction $\\frac{18}{24}$. Divide to get a decimal: $18 \\div 24 = 0.75$.",
          "Times 100 for a percentage: **75%**. Now it's out of 100, so it compares fairly with anything else.",
        ],
        picture: {
          kind: "bars",
          rows: [{ label: "Score", parts: 4, shaded: 3, each: "6" }],
          total: "24",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "9 out of 10 or 17 out of 20?",
        options: [
          { text: "9 out of 10: that's 90%", correct: true, feedback: "17 out of 20 is 85%." },
          {
            text: "17 out of 20: 17 is bigger",
            feedback: "Out of 20, not 10: $17 \\div 20 = 85\\%$.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "42 out of 60",
        problem: "Write 42 out of 60 as a percentage.",
        steps: [
          { line: "$\\frac{42}{60}$", why: "The part over the whole." },
          { line: "$42 \\div 60 = 0.7$", why: "Divide to get a decimal." },
          { line: "$0.7 \\times 100 = 70\\%$", why: "Times 100." },
        ],
        done: "Part ÷ whole × 100.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "What percentage of £80 is £12?",
        start: "£12 out of £80",
        stages: [
          {
            prompt: "As a fraction:",
            options: [
              { text: "$\\frac{12}{80}$", correct: true, feedback: "" },
              { text: "$\\frac{80}{12}$", feedback: "The part goes on top: £12 out of £80." },
            ],
            then: "$\\frac{12}{80}$",
          },
          {
            prompt: "$12 \\div 80 = 0.15$. As a percentage:",
            options: [
              { text: "15%", correct: true, feedback: "" },
              { text: "0.15%", feedback: "Times 100 to make a percentage." },
            ],
            then: "15%",
          },
        ],
        done: "£12 is 15% of £80.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Different units",
        start: "What percentage of 2 m is 50 cm?",
        stages: [
          {
            prompt: "First, make the units the same:",
            options: [
              { text: "50 cm out of 200 cm", correct: true, feedback: "" },
              { text: "50 out of 2", feedback: "Mixed units: 2 m is 200 cm." },
            ],
            then: "$\\frac{50}{200}$",
          },
          {
            prompt: "So the percentage is",
            options: [
              { text: "25%", correct: true, feedback: "" },
              { text: "2500%", feedback: "Use 200 cm, not 2." },
            ],
            then: "25%",
          },
        ],
        done: "Same units first, then part ÷ whole × 100.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A survey",
        text: "18 out of 30 pupils walk to school. What percentage is that?",
        answers: ["60"],
        unit: "%",
        wrong: [{ answer: "18", feedback: "18 out of 30, not out of 100." }],
        hint: "$18 \\div 30$, then × 100.",
        done: "$18 \\div 30 = 0.6 = 60\\%$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What percentage of 250 is 35?",
        answers: ["14"],
        unit: "%",
        hint: "$35 \\div 250$, then × 100.",
        done: "$35 \\div 250 = 0.14 = 14\\%$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Ben scored 42 out of 60. He says that's 42%. Is he right?",
        options: [
          {
            text: "No: 42% means 42 out of 100. Divide by 60",
            correct: true,
            feedback: "Only a score out of 100 is already a percentage. $42 \\div 60 = 70\\%$.",
          },
          { text: "Yes", feedback: "42 out of 60 is more than half, but 42% is less than half." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Cara finds what percentage of 40 is 10.",
        lines: ["$40 \\div 10 = 4$", "$4 \\times 100 = 400$", "So it's 400%"],
        wrong: 0,
        why: "The part goes first: $10 \\div 40 = 0.25 = 25\\%$. 10 is less than 40, so it must be under 100%.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Maths 42 out of 60; science 36 out of 45",
        text: "Which went better?",
        options: [
          {
            text: "Science: 80% beats 70%",
            correct: true,
            feedback: "$42 \\div 60 = 70\\%$ and $36 \\div 45 = 80\\%$.",
          },
          { text: "Maths: 42 beats 36", feedback: "The totals differ. Compare percentages." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Write 12 out of 20 as a percentage.",
            options: ["60%", "12%", "40%"],
            answers: ["60%"],
            why: "$12 \\div 20 = 0.6$.",
            retry: {
              prompt: "Write 7 out of 25 as a percentage.",
              options: ["28%", "7%", "18%"],
              answers: ["28%"],
              why: "$7 \\div 25 = 0.28$.",
            },
          },
          {
            prompt: "What percentage of £50 is £4?",
            options: ["8%", "4%", "12.5%"],
            answers: ["8%"],
            why: "$4 \\div 50 = 0.08$.",
            retry: {
              prompt: "What percentage of £40 is £6?",
              options: ["15%", "6%", "24%"],
              answers: ["15%"],
              why: "$6 \\div 40 = 0.15$.",
            },
          },
          {
            prompt: "What percentage of 1 kg is 300 g?",
            options: ["30%", "300%", "3%"],
            answers: ["30%"],
            why: "300 out of 1000 g.",
            retry: {
              prompt: "What percentage of 1 m is 45 cm?",
              options: ["45%", "4.5%", "450%"],
              answers: ["45%"],
              why: "45 out of 100 cm.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-percentages",
    id: "y8-percentages/change",
    before: CHANGE,
    title: "Up and down by a percentage",
    summary: "One multiplier does the whole change.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The sale",
        text: [
          "A coat costs £68. It's 15% off in the sale. And your bus fare of £2.50 is going up 12%.",
          "What are the new prices? By the end of this lesson, you can find each with one multiplication, and find a percentage change too.",
        ],
        picture: {
          kind: "table",
          head: ["", "Was", "Change"],
          rows: [
            ["Coat", "£68", "15% off"],
            ["Bus fare", "£2.50", "up 12%"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Find 10% of £250",
        answers: ["25"],
        hint: "Divide by 10.",
        done: "£25.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Write 85% as a decimal",
        answers: ["0.85"],
        wrong: [{ answer: "85", feedback: "Divide by 100." }],
        hint: "Divide by 100.",
        done: "$85\\% = 0.85$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "What's left?",
        text: [
          "15% off leaves you paying **85%** of the price. So multiply by 0.85.",
          "Up 12% makes it **112%** of the price. So multiply by 1.12. This number is the **multiplier**.",
        ],
        picture: {
          kind: "bars",
          rows: [
            { label: "Price", parts: 20, each: "" },
            { label: "Sale", parts: 17, each: "" },
          ],
        },
      },
      {
        kind: "fill",
        tag: "Discover",
        title: "Multipliers",
        template: "Up 35%: $\\times$ [] and down 4%: $\\times$ []",
        bank: ["$1.35$", "$0.35$", "$0.96$", "$0.04$", "$1.04$"],
        answers: ["$1.35$", "$0.96$"],
        hint: "Up 35% leaves 135%. Down 4% leaves 96%.",
        done: "One multiplication does the whole change.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Increase £250 by 12%",
        problem: "Increase £250 by 12%.",
        steps: [
          { line: "$100\\% + 12\\% = 112\\%$", why: "The new amount is 112% of the old." },
          { line: "Multiplier: 1.12", why: "112% as a decimal." },
          { line: "$250 \\times 1.12 = £280$", why: "One multiplication." },
        ],
        done: "Check: 12% of 250 is 30, and $250 + 30 = 280$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "The coat: £68, 15% off",
        start: "£68, 15% off",
        stages: [
          {
            prompt: "You pay what percentage?",
            options: [
              { text: "85%", correct: true, feedback: "" },
              { text: "15%", feedback: "15% is taken off. You pay the rest." },
            ],
            then: "Multiplier: 0.85",
          },
          {
            prompt: "$68 \\times 0.85 =$",
            options: [
              { text: "£57.80", correct: true, feedback: "" },
              { text: "£10.20", feedback: "That's the discount: $68 \\times 0.15$." },
            ],
            then: "£57.80",
          },
        ],
        done: "The sale price is £57.80.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Percentage change",
        start: "A price goes from £40 to £46. What's the percentage increase?",
        stages: [
          {
            prompt: "The change is",
            options: [
              { text: "£6", correct: true, feedback: "" },
              { text: "£46", feedback: "That's the new price. How much did it go up?" },
            ],
            then: "Change = £6",
          },
          {
            prompt: "As a percentage of the original £40:",
            options: [
              { text: "$6 \\div 40 = 15\\%$", correct: true, feedback: "" },
              { text: "$6 \\div 46 = 13\\%$", feedback: "Divide by the original, £40." },
            ],
            then: "15% increase",
          },
        ],
        done: "Percentage change = change ÷ original × 100.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Increase £80 by 5%",
        text: "Give the new amount in pounds.",
        answers: ["84"],
        wrong: [{ answer: "4", feedback: "£4 is the increase. Multiply by 1.05." }],
        hint: "Multiply by 1.05.",
        done: "$80 \\times 1.05 = £84$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A drop",
        text: "A car's value falls from £5000 to £4000. What's the percentage decrease?",
        answers: ["20"],
        unit: "%",
        wrong: [{ answer: "25", feedback: "Divide by the original, £5000, not the new value." }],
        hint: "$1000 \\div 5000$, then × 100.",
        done: "$1000 \\div 5000 = 20\\%$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "For a 4% rise, Jo multiplies by 1.4. What's wrong?",
        options: [
          {
            text: "1.4 is a 40% rise. 4% is 1.04",
            correct: true,
            feedback: "104% = 1.04. Check the decimal: 4% is 0.04.",
          },
          { text: "Nothing", feedback: "1.4 means 140%." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ed finds the percentage change from 20 to 25.",
        lines: ["Change: $25 - 20 = 5$", "$5 \\div 25 = 0.2$", "A 20% increase"],
        wrong: 1,
        why: "Divide by the **original**, 20: $5 \\div 20 = 25\\%$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The bus fare: £2.50, up 12%",
        text: "What is the new fare, in pounds?",
        answers: ["2.80"],
        wrong: [{ answer: "0.30", feedback: "That's the increase. Multiply by 1.12." }],
        hint: "$2.50 \\times 1.12$.",
        done: "£2.80. And the coat is £57.80.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The multiplier for a 30% decrease is",
            options: ["0.7", "0.3", "1.3"],
            answers: ["0.7"],
            why: "70% is left.",
            retry: {
              prompt: "The multiplier for a 6% increase is",
              options: ["1.06", "1.6", "0.06"],
              answers: ["1.06"],
              why: "106%.",
            },
          },
          {
            prompt: "Decrease £120 by 25%.",
            options: ["£90", "£30", "£95"],
            answers: ["£90"],
            why: "$120 \\times 0.75$.",
            retry: {
              prompt: "Increase £60 by 15%.",
              options: ["£69", "£9", "£75"],
              answers: ["£69"],
              why: "$60 \\times 1.15$.",
            },
          },
          {
            prompt: "A price rises from £50 to £60. Percentage increase?",
            options: ["20%", "10%", "16.7%"],
            answers: ["20%"],
            why: "$10 \\div 50$.",
            retry: {
              prompt: "A price falls from £80 to £60. Percentage decrease?",
              options: ["25%", "20%", "33.3%"],
              answers: ["25%"],
              why: "$20 \\div 80$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-percentages",
    id: "y8-percentages/original",
    before: ORIGINAL,
    title: "Back to the start",
    summary: "The new amount is a percentage of the original: divide by the multiplier.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "What did it cost before?",
        text: [
          "After 25% off, a game costs £36. What was the price before the sale?",
          "Most people add 25% back on, and get it wrong. By the end of this lesson, you'll see why, and get it right.",
        ],
        picture: {
          kind: "bars",
          rows: [
            { label: "Before", parts: 4, each: "?" },
            { label: "Sale", parts: 3, each: "?" },
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $50 \\times 1.2$",
        answers: ["60"],
        hint: "50 plus a fifth of 50.",
        done: "60.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "$x \\times 1.2 = 60$. What is $x$?",
        answers: ["50"],
        hint: "Undo times with divide: $60 \\div 1.2$.",
        done: "$60 \\div 1.2 = 50$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The new amount isn't 100%",
        text: [
          "After a 20% rise, a price is £60. The £60 is **120%** of the original, not 100%.",
          "In the bar model, 6 boxes of 20% make £60, so each box is £10, and the original 5 boxes were £50.",
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
        kind: "choice",
        tag: "Discover",
        title: "Why not take 20% of £60 away?",
        options: [
          {
            text: "The 20% was of the original, not of £60",
            correct: true,
            feedback: "20% of £60 is £12, but 20% of £50 is £10. Different wholes.",
          },
          { text: "You can: £60 − £12 = £48", feedback: "Check: £48 + 20% = £57.60, not £60." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Up 20% to £60",
        problem: "After a 20% rise, a price is £60. What was it before?",
        steps: [
          { line: "£60 is 120%", why: "100% plus the 20% rise." },
          { line: "Multiplier: 1.2", why: "Original × 1.2 = £60." },
          { line: "$60 \\div 1.2 = £50$", why: "Undo the multiplication." },
        ],
        done: "Check: $50 \\times 1.2 = 60$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "The game: £36 after 25% off",
        start: "£36 after 25% off",
        stages: [
          {
            prompt: "£36 is what percentage of the original?",
            options: [
              { text: "75%", correct: true, feedback: "" },
              { text: "125%", feedback: "It went down: 100% − 25%." },
            ],
            then: "£36 = 75%",
          },
          {
            prompt: "So the original is",
            options: [
              { text: "$36 \\div 0.75 = £48$", correct: true, feedback: "" },
              {
                text: "$36 \\times 1.25 = £45$",
                feedback: "Adding 25% of £36 uses the wrong whole.",
              },
            ],
            then: "£48",
          },
        ],
        done: "Check: 25% of £48 is £12, and $48 - 12 = 36$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "With 1%",
        start: "After a 10% rise, a bill is £22. Find the original.",
        stages: [
          {
            prompt: "£22 is 110%. So 1% is",
            options: [
              { text: "£0.20", correct: true, feedback: "" },
              { text: "£0.22", feedback: "£22 is 110%, not 100%: divide by 110." },
            ],
            then: "1% = £0.20",
          },
          {
            prompt: "So 100% is",
            options: [
              { text: "£20", correct: true, feedback: "" },
              { text: "£19.80", feedback: "That takes 10% of £22 off." },
            ],
            then: "£20",
          },
        ],
        done: "Find 1%, then 100%. Or divide by 1.1 in one go.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "After a 50% rise, a ticket costs £30. What was it before, in pounds?",
        answers: ["20"],
        wrong: [
          { answer: "15", feedback: "That takes half of £30 off. £30 is 150%: $30 \\div 1.5$." },
        ],
        hint: "£30 is 150%.",
        done: "$30 \\div 1.5 = £20$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "After 20% off, a jacket costs £64. What was it before, in pounds?",
        answers: ["80"],
        wrong: [{ answer: "76.8", feedback: "That adds 20% of £64. £64 is 80%: $64 \\div 0.8$." }],
        hint: "£64 is 80%.",
        done: "$64 \\div 0.8 = £80$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "After 25% off, a game is £36. Mo adds 25% back: £45. Is that right?",
        options: [
          {
            text: "No: 25% of £36 is less than 25% of the original",
            correct: true,
            feedback: "The 25% was of the original. £36 is 75%, so $36 \\div 0.75 = £48$.",
          },
          { text: "Yes", feedback: "Check: 25% off £45 is £33.75, not £36." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "With VAT of 20%, a phone costs £240. Ivy finds the price before VAT.",
        lines: ["£240 is 120%", "20% of £240 is £48", "$240 - 48 = £192$"],
        wrong: 1,
        why: "The 20% is of the price before VAT, not £240. $240 \\div 1.2 = £200$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The game: £36 after 25% off",
        text: "What was the price before the sale, in pounds?",
        answers: ["48"],
        wrong: [{ answer: "45", feedback: "£36 is 75% of the original: $36 \\div 0.75$." }],
        hint: "Divide by 0.75.",
        done: "£48. Check: $48 \\times 0.75 = 36$ ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "After a 10% rise, a price is £44. The original was",
            options: ["£40", "£39.60", "£48.40"],
            answers: ["£40"],
            why: "$44 \\div 1.1$.",
            retry: {
              prompt: "After a 25% rise, a price is £50. The original was",
              options: ["£40", "£37.50", "£62.50"],
              answers: ["£40"],
              why: "$50 \\div 1.25$.",
            },
          },
          {
            prompt: "After 40% off, a coat costs £30. The original was",
            options: ["£50", "£42", "£75"],
            answers: ["£50"],
            why: "£30 is 60%: $30 \\div 0.6$.",
            retry: {
              prompt: "After 10% off, a bag costs £27. The original was",
              options: ["£30", "£29.70", "£24.30"],
              answers: ["£30"],
              why: "£27 is 90%: $27 \\div 0.9$.",
            },
          },
          {
            prompt: "Price with 20% VAT is £60. Price before VAT?",
            options: ["£50", "£48", "£72"],
            answers: ["£50"],
            why: "$60 \\div 1.2$.",
            retry: {
              prompt: "Price with 20% VAT is £96. Price before VAT?",
              options: ["£80", "£76.80", "£115.20"],
              answers: ["£80"],
              why: "$96 \\div 1.2$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-percentages",
    id: "y8-percentages/interest",
    before: INTEREST,
    title: "Simple interest",
    summary: "The same interest every year: a percentage of what you first put in.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Saving up",
        text: [
          "Gran puts £500 in a savings account paying 3% simple interest a year. How much will there be after 4 years?",
          "By the end of this lesson, you can work it out, and see how it grows.",
        ],
        picture: {
          kind: "table",
          head: ["Year", "0", "1", "2", "3", "4"],
          rows: [["Total", "£500", "?", "?", "?", "?"]],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Find 1% of £500",
        answers: ["5"],
        hint: "Divide by 100.",
        done: "£5.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Find 3% of £500",
        answers: ["15"],
        hint: "Three lots of 1%.",
        done: "£15.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The same every year",
        text: [
          "A bank pays **interest** for keeping your money. **Simple interest** is the same amount every year: a percentage of the money first put in.",
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
        kind: "choice",
        tag: "Discover",
        title: "£200 at 5% simple interest. After 10 years, the interest is",
        options: [
          { text: "£100", correct: true, feedback: "£10 a year, for 10 years." },
          { text: "£10", feedback: "That's one year's interest." },
          { text: "£300", feedback: "That's the total in the account." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "£400 at 2% for 3 years",
        problem: "Find the simple interest on £400 at 2% a year for 3 years.",
        steps: [
          { line: "One year: 2% of £400 = £8", why: "Find one year's interest." },
          { line: "Three years: $3 \\times 8 = £24$", why: "It's the same every year." },
          { line: "Total: $400 + 24 = £424$", why: "If you want the total, add it on." },
        ],
        done: "One year, times the years.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "£1200 at 4% for 5 years",
        start: "£1200 at 4% simple interest, 5 years",
        stages: [
          {
            prompt: "One year's interest is",
            options: [
              { text: "£48", correct: true, feedback: "" },
              { text: "£4", feedback: "4% of £1200: $1200 \\times 0.04$." },
            ],
            then: "£48 a year",
          },
          {
            prompt: "Over 5 years, the interest is",
            options: [
              { text: "£240", correct: true, feedback: "" },
              { text: "£48", feedback: "That's one year. Times by 5." },
            ],
            then: "£240",
          },
        ],
        done: "Total: £1200 + £240 = £1440.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "How long?",
        start: "£300 at 5% simple interest earns £60. How many years?",
        stages: [
          {
            prompt: "One year's interest is",
            options: [
              { text: "£15", correct: true, feedback: "" },
              { text: "£5", feedback: "5% of £300, not 5% of £100." },
            ],
            then: "£15 a year",
          },
          {
            prompt: "£60 is how many years of £15?",
            options: [
              { text: "4", correct: true, feedback: "" },
              { text: "45", feedback: "Divide: $60 \\div 15$." },
            ],
            then: "4 years",
          },
        ],
        done: "Work backwards: total interest ÷ one year's interest.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "£800 at 5% simple interest for 3 years",
        text: "How much interest is earned, in pounds?",
        answers: ["120"],
        wrong: [{ answer: "40", feedback: "That's one year. There are 3." }],
        hint: "5% of £800, times 3.",
        done: "$40 \\times 3 = £120$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "£250 at 2% simple interest for 6 years",
        text: "How much is in the account at the end, in pounds?",
        answers: ["280"],
        wrong: [{ answer: "30", feedback: "That's the interest. Add it to the £250." }],
        hint: "2% of £250 is £5 a year.",
        done: "$250 + 6 \\times 5 = £280$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "£500 at 3% for 4 years. Lia says the interest is 3% of £500 = £15. What's missing?",
        options: [
          {
            text: "£15 is one year. Over 4 years it's £60",
            correct: true,
            feedback: "Simple interest is paid every year: times by the number of years.",
          },
          { text: "Nothing", feedback: "It's 3% a year, for 4 years." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ray finds the simple interest on £600 at 2% for 5 years.",
        lines: [
          "One year: 2% of £600 = £12",
          "Year 2: 2% of £612 = £12.24",
          "Keep going and add them",
        ],
        wrong: 1,
        why: "Simple interest is always on the first amount: £12 every year, so £60.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Gran's savings: £500 at 3% for 4 years",
        text: "How much is in the account after 4 years, in pounds?",
        answers: ["560"],
        wrong: [{ answer: "60", feedback: "That's the interest. Add it to the £500." }],
        hint: "£15 a year for 4 years, plus the £500.",
        done: "$500 + 4 \\times 15 = £560$.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "£300 at 4% simple interest for 2 years: interest?",
            options: ["£24", "£12", "£324"],
            answers: ["£24"],
            why: "£12 a year, for 2 years.",
            retry: {
              prompt: "£700 at 3% simple interest for 2 years: interest?",
              options: ["£42", "£21", "£742"],
              answers: ["£42"],
              why: "£21 a year, for 2 years.",
            },
          },
          {
            prompt: "£1000 at 5% simple interest for 3 years: total in the account?",
            options: ["£1150", "£150", "£1050"],
            answers: ["£1150"],
            why: "£50 a year, 3 years: £150 interest.",
            retry: {
              prompt: "£2000 at 1% simple interest for 4 years: total in the account?",
              options: ["£2080", "£80", "£2020"],
              answers: ["£2080"],
              why: "£20 a year, 4 years: £80 interest.",
            },
          },
          {
            prompt: "£400 at 5% simple interest earns £100. How many years?",
            options: ["5", "4", "20"],
            answers: ["5"],
            why: "£20 a year: $100 \\div 20$.",
            retry: {
              prompt: "£200 at 3% simple interest earns £30. How many years?",
              options: ["5", "6", "10"],
              answers: ["5"],
              why: "£6 a year: $30 \\div 6$.",
            },
          },
        ],
      },
    ],
  },
];
