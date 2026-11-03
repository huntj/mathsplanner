// Year 7, "Ratio": bar models for ratios, simplifying them, sharing in a ratio, part to whole as
// a fraction, a division as a ratio, and one amount as a fraction of another, less or more than 1.
import type { UnitLesson } from "./types.ts";

export const y7Ratio: UnitLesson = {
  unit: "y7-ratio",
  title: "Fair shares",
  summary: "Draw ratios as bars, then share anything fairly.",
  screens: [
    {
      kind: "explain",
      title: "A ratio compares parts",
      text: [
        "Paint mixed in the ratio 3 : 2 has 3 parts red to every 2 parts blue.",
        "Draw it as bars of equal parts. The order matters: 3 : 2 is not the same as 2 : 3.",
      ],
      picture: {
        kind: "bars",
        rows: [
          { label: "Red", parts: 3 },
          { label: "Blue", parts: 2 },
        ],
      },
    },
    {
      kind: "answer",
      title: "Simplify 12 : 8",
      text: "Type it like 5:2.",
      answers: ["3:2"],
      wrong: [{ answer: "6:4", feedback: "That is simpler, but both still divide by 2." }],
      hint: "Divide both sides by the same number, as many times as you can.",
      done: "Divide both by 4, their HCF: $12 : 8 = 3 : 2$.",
    },
    {
      kind: "fill",
      title: "Simplest form",
      template: "$15 : 25 = 3 :$ [] and $4 : 10 =$ [] $: 5$",
      bank: ["$2$", "$4$", "$5$", "$10$"],
      answers: ["$5$", "$2$"],
      hint: "15 : 25 divides by 5. 4 : 10 divides by 2.",
      done: "Divide both sides by the same number to simplify.",
    },
    {
      kind: "steps",
      title: "Share £40 in the ratio 3 : 2",
      picture: {
        kind: "bars",
        rows: [
          { label: "Amy", parts: 3 },
          { label: "Ben", parts: 2 },
        ],
        total: "£40",
      },
      start: "Amy : Ben = 3 : 2",
      stages: [
        {
          prompt: "How many parts are there altogether?",
          options: [
            { text: "5", correct: true, feedback: "" },
            { text: "6", feedback: "Count the boxes: 3 + 2." },
            { text: "3", feedback: "Count Ben's parts too." },
          ],
          then: "$3 + 2 = 5$ parts",
        },
        {
          prompt: "So one part is worth",
          options: [
            { text: "£8", correct: true, feedback: "" },
            { text: "£20", feedback: "There are 5 parts, not 2." },
            { text: "£13.33", feedback: "There are 5 parts, not 3." },
          ],
          then: "$£40 \\div 5 = £8$ a part",
        },
        {
          prompt: "Amy gets 3 parts:",
          options: [
            { text: "£24", correct: true, feedback: "" },
            { text: "£8", feedback: "That is one part. Amy has 3." },
            { text: "£16", feedback: "That is Ben's 2 parts." },
          ],
          then: "Amy gets £24 and Ben gets £16",
        },
      ],
      done: "Check: £24 + £16 = £40 ✓. Parts, one part, then each share.",
    },
    {
      kind: "answer",
      title: "Share 56 sweets in the ratio 5 : 3",
      text: "How many sweets in the bigger share?",
      answers: ["35"],
      wrong: [
        { answer: "7", feedback: "7 is one part. The bigger share is 5 parts." },
        { answer: "21", feedback: "That is the smaller share, 3 parts." },
      ],
      hint: "8 parts altogether. What is one part?",
      done: "$56 \\div 8 = 7$ a part, so the bigger share is $5 \\times 7 = 35$.",
    },
    {
      kind: "explain",
      title: "Part to whole",
      text: [
        "Boys : girls = 2 : 3 compares part to part. Altogether there are 5 parts.",
        "So the boys are 2 parts out of 5, $\\frac25$ of the class, and the girls are $\\frac35$.",
      ],
      picture: {
        kind: "bars",
        rows: [
          { label: "Boys", parts: 2 },
          { label: "Girls", parts: 3 },
        ],
        total: "the class",
      },
    },
    {
      kind: "choice",
      title: "Boys : girls = 2 : 3. What fraction are girls?",
      options: [
        {
          text: "$\\frac{3}{5}$",
          correct: true,
          feedback: "3 parts out of the 5 parts in the class.",
        },
        {
          text: "$\\frac{2}{3}$",
          feedback: "That compares boys with girls. Out of the whole class, there are 5 parts.",
        },
        { text: "$\\frac{3}{2}$", feedback: "A fraction of the class must be less than 1." },
      ],
    },
    {
      kind: "answer",
      title: "Red and green beads",
      text: "$\\frac{2}{7}$ of the beads in a bag are red; the rest are green. There are 35 beads. How many are green?",
      answers: ["25"],
      wrong: [
        { answer: "10", feedback: "10 are red, 2 parts out of 7. Green is the other 5 parts." },
      ],
      hint: "One seventh of 35 is 5. How many sevenths are green?",
      done: "$\\frac17$ of 35 is 5; green is $\\frac57$, which is 25. Red : green = 2 : 5.",
    },
    {
      kind: "choice",
      title: "If $a \\div b = 4$, then $a : b$ is",
      options: [
        {
          text: "4 : 1",
          correct: true,
          feedback: "a is 4 times b: for every 1 of b there are 4 of a.",
        },
        { text: "1 : 4", feedback: "That would make a smaller than b." },
        { text: "4 : 4", feedback: "4 : 4 simplifies to 1 : 1, which means a and b are equal." },
      ],
    },
    {
      kind: "answer",
      title: "What fraction of an hour is 45 minutes?",
      text: "Give it in its simplest form.",
      answers: ["3/4"],
      wrong: [
        { answer: "45/60", feedback: "Right; now simplify. Divide both by 15." },
        { answer: "45/100", feedback: "An hour is 60 minutes, not 100." },
      ],
      hint: "45 out of 60, then simplify.",
      done: "$\\frac{45}{60} = \\frac34$.",
    },
    {
      kind: "answer",
      title: "What fraction of 8 is 12?",
      text: "It can be more than 1.",
      answers: ["3/2", "1 1/2", "1.5"],
      wrong: [{ answer: "2/3", feedback: "That is 8 as a fraction of 12. Here 12 goes on top." }],
      hint: "12 out of 8: $\\frac{12}{8}$, then simplify.",
      done: "$\\frac{12}{8} = \\frac32$: 12 is one and a half times 8.",
    },
    {
      kind: "explain",
      title: "Fair shares",
      text: [
        "Simplify a ratio by dividing both sides by the same number.",
        "To share: add the parts, find one part, then each share.",
        "Part : part becomes a fraction of the whole: 2 : 3 means $\\frac25$ and $\\frac35$.",
      ],
      picture: {
        kind: "bars",
        rows: [
          { label: "Amy", parts: 3, each: "£8" },
          { label: "Ben", parts: 2, each: "£8" },
        ],
        total: "£40",
      },
    },
  ],
};
