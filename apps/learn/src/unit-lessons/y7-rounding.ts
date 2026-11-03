// Year 7, "Rounding and estimating": rounding as finding the nearer point on a number line, to
// decimal places and significant figures; estimating by rounding to one significant figure; and
// error intervals, the range a rounded number came from.
import type { UnitLesson } from "./types.ts";

export const y7Rounding: UnitLesson = {
  unit: "y7-rounding",
  title: "Near enough",
  summary: "Round, estimate and work out where a rounded number came from.",
  screens: [
    {
      kind: "place",
      title: "Nearer to 3.4 or 3.5?",
      text: "Rounding finds which end a number is nearer to.",
      line: { kind: "number-line", min: 3.4, max: 3.5, step: 0.01, every: 5 },
      targets: [{ value: 3.47, label: "$3.47$" }],
      hint: "Each small step is 0.01. Count along from 3.4.",
      done: "3.47 is nearer 3.5, so to 1 decimal place 3.47 rounds to 3.5.",
    },
    {
      kind: "choice",
      title: "Round 2.649 to 1 decimal place",
      options: [
        {
          text: "$2.6$",
          correct: true,
          feedback: "Look at the next digit: 4. Less than 5, so round down.",
        },
        { text: "$2.7$", feedback: "Only the digit straight after counts: the 4, not the 9." },
        {
          text: "$2.65$",
          feedback: "That is 2 decimal places. 1 decimal place keeps only the tenths.",
        },
      ],
    },
    {
      kind: "answer",
      title: "Round 7.2851 to 2 decimal places",
      answers: ["7.29"],
      wrong: [{ answer: "7.28", feedback: "The next digit is 5: 5 or more rounds up." }],
      hint: "Keep two digits after the point, and look at the third.",
      done: "The third decimal place is 5, so round up: 7.29.",
    },
    {
      kind: "explain",
      title: "Significant figures",
      text: [
        "Significant figures count from the first digit that is not zero.",
        "In 40 725 the first significant figure is the 4, worth 40 000. In 0.003862 it is the 3, worth 3 thousandths.",
      ],
      picture: { kind: "place-value", number: "40725", from: 4, to: 0, highlight: 4 },
    },
    {
      kind: "answer",
      title: "Round 40 725 to 2 significant figures",
      answers: ["41000"],
      wrong: [{ answer: "41", feedback: "Keep the place value: 40 725 is about 41 000, not 41." }],
      hint: "Keep the first two figures, 4 and 0, look at the next one, then fill with zeros.",
      done: "The third figure is 7, so the 0 rounds up: 41 000.",
    },
    {
      kind: "answer",
      title: "Round 0.003862 to 1 significant figure",
      answers: ["0.004"],
      wrong: [
        {
          answer: "0",
          feedback: "Zeros at the start do not count. The first significant figure is the 3.",
        },
      ],
      hint: "The first significant figure is the 3. Look at the digit after it.",
      done: "The 8 after the 3 rounds it up: 0.004.",
    },
    {
      kind: "steps",
      title: "Estimate",
      start: "$\\frac{48.7 \\times 3.1}{9.8}$",
      stages: [
        {
          prompt: "Round each number to 1 significant figure:",
          options: [
            { text: "$\\frac{50 \\times 3}{10}$", correct: true, feedback: "" },
            {
              text: "$\\frac{49 \\times 3}{10}$",
              feedback: "1 significant figure: 48.7 rounds to 50.",
            },
            { text: "$\\frac{40 \\times 3}{9}$", feedback: "48.7 is nearer 50 than 40." },
          ],
          then: "$\\approx \\frac{50 \\times 3}{10}$",
        },
        {
          prompt: "Work it out:",
          options: [
            { text: "$15$", correct: true, feedback: "" },
            { text: "$150$", feedback: "Divide by the 10 as well." },
            { text: "$1.5$", feedback: "$50 \\times 3 = 150$, and $150 \\div 10 = 15$." },
          ],
          then: "$= 15$",
        },
      ],
      done: "A calculator gives 15.40…: the estimate shows the answer is sensible.",
    },
    {
      kind: "choice",
      title: "The best estimate for $612 \\div 2.9$",
      options: [
        { text: "$200$", correct: true, feedback: "$600 \\div 3 = 200$." },
        { text: "$2000$", feedback: "Check the size: 3 goes into 600 about 200 times." },
        { text: "$20$", feedback: "$20 \\times 3$ is only 60." },
      ],
    },
    {
      kind: "explain",
      title: "Where did it come from?",
      text: [
        "A length is 7 m to the nearest metre. It could be anything that rounds to 7.",
        "That is from 6.5 m up to, but not including, 7.5 m: $6.5 \\le x < 7.5$. This is its **error interval**.",
      ],
      picture: {
        kind: "number-line",
        min: 6,
        max: 8,
        step: 0.5,
        interval: { from: 6.5, to: 7.5, fromClosed: true, toClosed: false },
      },
    },
    {
      kind: "place",
      title: "x rounds to 30, to the nearest 10",
      line: { kind: "number-line", min: 20, max: 40, step: 1, every: 5 },
      targets: [
        { value: 25, label: "the smallest x could be", mark: "lowest" },
        { value: 35, label: "where x must stop below", mark: "highest" },
      ],
      hint: "Halfway between 20 and 30 is where numbers start rounding to 30.",
      done: "From 25, which rounds up to 30, to just below 35: $25 \\le x < 35$.",
    },
    {
      kind: "fill",
      title: "An error interval",
      text: "A mass is 4.6 kg, to 1 decimal place.",
      template: "[] $\\le m <$ []",
      bank: ["$4.5$", "$4.55$", "$4.6$", "$4.65$", "$4.7$"],
      answers: ["$4.55$", "$4.65$"],
      hint: "Go half a step, 0.05, either side of 4.6.",
      done: "$4.55 \\le m < 4.65$.",
    },
    {
      kind: "choice",
      title: "Why $< 35$ and not $\\le 35$?",
      options: [
        {
          text: "35 itself rounds up to 40",
          correct: true,
          feedback: "So 35 cannot be in the interval for 30.",
        },
        { text: "No reason: either is right", feedback: "Round 35 to the nearest 10 and see." },
        {
          text: "Numbers never reach 35",
          feedback: "34.9999 is in it: as close to 35 as you like, but not 35.",
        },
      ],
    },
    {
      kind: "explain",
      title: "Near enough",
      text: [
        "Round by looking at the next digit: 5 or more rounds up.",
        "Significant figures start at the first digit that is not zero; keep the place value with zeros.",
        "Estimate by rounding to 1 significant figure. An error interval goes half a step each way.",
      ],
      picture: {
        kind: "number-line",
        min: 20,
        max: 40,
        step: 5,
        interval: { from: 25, to: 35, fromClosed: true, toClosed: false },
      },
    },
  ],
};
