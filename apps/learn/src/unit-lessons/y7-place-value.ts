// Year 7, "Place value and ordering": a digit's worth comes from its column; on a number line,
// further left is smaller, below zero too; decimals compare column by column; and the signs
// =, ≠, <, >, ≤ and ≥ say how two numbers compare.
import type { UnitLesson } from "./types.ts";

export const y7PlaceValue: UnitLesson = {
  unit: "y7-place-value",
  title: "Where does it live?",
  summary: "Find each digit's home, then line numbers up, even below zero.",
  screens: [
    {
      kind: "explain",
      title: "Every digit has a home",
      text: [
        "The same digit is worth a different amount in a different column.",
        "In 3045.27, the 2 lives in the tenths column, so it is worth 2 tenths, or 0.2.",
      ],
      picture: { kind: "place-value", number: "3045.27", from: 3, to: -2, highlight: -1 },
    },
    {
      kind: "choice",
      title: "What is the 4 worth in 3045.27?",
      picture: { kind: "place-value", number: "3045.27", from: 3, to: -2, highlight: 1 },
      options: [
        {
          text: "4 tens, which is 40",
          correct: true,
          feedback: "The 4 is in the tens column, so it is worth 40.",
        },
        { text: "4", feedback: "Look at its column heading: T is for tens." },
        { text: "4 hundreds, which is 400", feedback: "The hundreds digit is the 0." },
      ],
    },
    {
      kind: "steps",
      title: "Times by 10: watch the digits move",
      start: "$3.47 \\times 10$",
      stages: [
        {
          prompt: "When you multiply by 10, what happens?",
          options: [
            {
              text: "Every digit moves one column to the left",
              correct: true,
              feedback: "",
            },
            {
              text: "You put a 0 on the end",
              feedback: "That works for whole numbers, but 3.470 is still 3.47. The digits move.",
            },
            {
              text: "The digits stay where they are",
              feedback: "Then the number would not change.",
            },
          ],
          then: "$3.47 \\times 10 = 34.7$",
        },
        {
          prompt: "So what is $3.47 \\div 100$?",
          options: [
            { text: "$0.0347$", correct: true, feedback: "" },
            { text: "$347$", feedback: "That is 3.47 × 100. Dividing moves the digits right." },
            { text: "$0.347$", feedback: "That moves them one place. ÷ 100 moves them two." },
          ],
          then: "$3.47 \\div 100 = 0.0347$",
        },
      ],
      done: "× 10 moves every digit one column left, and ÷ 100 moves them two columns right.",
    },
    {
      kind: "answer",
      title: "How many grams in 2.5 kg?",
      text: "There are 1000 grams in a kilogram.",
      answers: ["2500"],
      unit: "g",
      wrong: [
        {
          answer: "250",
          feedback: "That is × 100. There are 1000 g in a kilogram: move the digits three places.",
        },
        { answer: "25000", feedback: "That is × 10 000. Multiply by 1000." },
      ],
      hint: "Multiply by 1000: each digit moves three columns left.",
      done: "2.5 × 1000 = 2500 g. Measures use place value too.",
    },
    {
      kind: "place",
      title: "Below zero",
      text: "Numbers below zero go to the left of 0.",
      line: { kind: "number-line", min: -6, max: 6, step: 1 },
      targets: [
        { value: -3, label: "$-3$" },
        { value: 2, label: "$2$" },
        { value: -5, label: "$-5$" },
      ],
      hint: "Negative numbers are left of 0. Count back from 0.",
      done: "The further left, the smaller: −5 is less than −3, even though 5 is more than 3.",
    },
    {
      kind: "order",
      title: "Smallest to largest",
      items: ["$-7$", "$-2$", "$0$", "$3$", "$5$"],
      first: "smallest",
      last: "largest",
      hint: "The smallest is furthest left on a number line: the most negative.",
      done: "$-7 < -2 < 0 < 3 < 5$",
    },
    {
      kind: "choice",
      title: "Which is colder?",
      text: "One morning it is −8 °C in Oslo and −3 °C in London.",
      picture: {
        kind: "number-line",
        min: -10,
        max: 2,
        step: 1,
        every: 2,
        marks: [
          { at: -8, label: "Oslo" },
          { at: -3, label: "London" },
        ],
      },
      options: [
        {
          text: "Oslo, at −8 °C",
          correct: true,
          feedback: "−8 is further below zero, further left on the line: −8 < −3.",
        },
        {
          text: "London, at −3 °C",
          feedback: "8 is bigger than 3, but −8 is further below zero, so it is colder.",
        },
      ],
    },
    {
      kind: "place",
      title: "Between 0 and 1",
      text: "Each small step on this line is 0.05.",
      line: { kind: "number-line", min: 0, max: 1, step: 0.05, every: 2 },
      targets: [
        { value: 0.3, label: "$0.3$" },
        { value: 0.75, label: "$0.75$" },
        { value: 0.05, label: "$0.05$" },
      ],
      hint: "The labels go up in tenths. Each small tick between them is 0.05.",
      done: "0.05 < 0.3 < 0.75. More digits does not mean bigger.",
    },
    {
      kind: "choice",
      title: "Which is bigger: 0.4 or 0.35?",
      picture: {
        kind: "table",
        head: ["", "Ones", "Tenths", "Hundredths"],
        rows: [
          ["$0.4$", "0", "4", ""],
          ["$0.35$", "0", "3", "5"],
        ],
      },
      revealPicture: {
        kind: "number-line",
        min: 0.3,
        max: 0.45,
        step: 0.01,
        every: 5,
        marks: [
          { at: 0.35, label: "0.35" },
          { at: 0.4, label: "0.4" },
        ],
      },
      options: [
        {
          text: "$0.4$",
          correct: true,
          feedback:
            "Compare the tenths first: 4 tenths beats 3 tenths. 0.4 is 0.40, 40 hundredths.",
        },
        {
          text: "$0.35$",
          feedback: "35 looks bigger than 4, but compare columns: 0.4 has 4 tenths, 0.35 only 3.",
        },
        { text: "They are equal", feedback: "Write 0.4 as 0.40 and compare with 0.35." },
      ],
    },
    {
      kind: "place",
      title: "Fractions and negatives",
      text: "This line goes up in quarters.",
      line: { kind: "number-line", min: -1, max: 1, step: 0.25, denominator: 4 },
      targets: [
        { value: 0.75, label: "$\\frac{3}{4}$" },
        { value: -0.5, label: "$-\\frac{1}{2}$" },
        { value: -0.25, label: "$-\\frac{1}{4}$" },
      ],
      hint: "Negative fractions are left of 0, just like negative whole numbers. $\\frac12$ is two quarters.",
      done: "$-\\frac12 < -\\frac14 < \\frac34$: fractions sit on the line with every other number.",
    },
    {
      kind: "order",
      title: "Mixed up: fractions, decimals and negatives",
      text: "Think of each one as a point on the number line.",
      items: ["$-0.5$", "$-\\frac{1}{4}$", "$0.2$", "$\\frac{1}{2}$", "$0.65$"],
      first: "smallest",
      last: "largest",
      hint: "Write each as a decimal: $-\\frac14 = -0.25$ and $\\frac12 = 0.5$.",
      done: "$-0.5 < -0.25 < 0.2 < 0.5 < 0.65$",
    },
    {
      kind: "fill",
      title: "Choose the sign",
      text: "$<$ means less than, $>$ greater than, $=$ equal.",
      template: "$0.5$ [] $\\frac{1}{2}$, $-3$ [] $-7$, $0.09$ [] $0.1$",
      bank: ["$<$", "$>$", "$=$"],
      answers: ["$=$", "$>$", "$<$"],
      hint: "The sign's open end faces the bigger number. −3 is to the right of −7.",
      done: "The open mouth of $<$ and $>$ always faces the bigger number.",
    },
    {
      kind: "choice",
      title: "What does $x \\le 4$ mean?",
      picture: {
        kind: "number-line",
        min: 0,
        max: 8,
        step: 1,
        marks: [{ at: 4, label: "4" }],
      },
      options: [
        {
          text: "x is 4 or less",
          correct: true,
          feedback:
            "The line under $\\le$ means 'or equal to'. And $\\ne$ means 'not equal to': $0.3 \\ne 0.03$.",
        },
        {
          text: "x is less than 4, but not 4",
          feedback: "That is $x < 4$. The line under $\\le$ means 'or equal to'.",
        },
        { text: "x is 4 or more", feedback: "That is $x \\ge 4$. The open end faces the x." },
      ],
    },
    {
      kind: "explain",
      title: "You found where numbers live",
      text: [
        "A digit's column gives its value: × 10 and ÷ 10 move digits between columns.",
        "On a number line, further left is smaller, below zero too.",
        "Compare decimals column by column, starting with the biggest.",
      ],
      picture: {
        kind: "number-line",
        min: -1,
        max: 1,
        step: 0.25,
        denominator: 4,
        marks: [
          { at: -0.5, label: "−0.5" },
          { at: 0.25, label: "0.25" },
          { at: 0.75, label: "0.75" },
        ],
      },
    },
  ],
};
