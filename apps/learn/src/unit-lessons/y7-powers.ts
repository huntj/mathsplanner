// Year 7, "Powers and roots": square numbers make squares and cube numbers make cubes; roots
// undo them; powers of 2, 3, 4 and 5 grow fast; and a root that is not whole is between two
// whole numbers, and any decimal for it is only an approximation.
import type { UnitLesson } from "./types.ts";

export const y7Powers: UnitLesson = {
  unit: "y7-powers",
  title: "Squares, cubes and roots",
  summary: "Build squares and cubes, then undo them with roots.",
  screens: [
    {
      kind: "explain",
      title: "Square numbers make squares",
      text: [
        "16 squares fit into a 4 by 4 square, so 16 is a **square number**: $4^2 = 4 \\times 4 = 16$.",
      ],
      picture: { kind: "grid", cols: 4, rows: 4, shaded: 16 },
    },
    {
      kind: "fill",
      title: "Continue the square numbers",
      template: "1, 4, 9, 16, [], [], 49",
      bank: ["$20$", "$25$", "$30$", "$36$", "$42$"],
      answers: ["$25$", "$36$"],
      hint: "$5^2$ and $6^2$. Or look at the gaps: +3, +5, +7…",
      done: "1, 4, 9, 16, 25, 36, 49: the gaps go up by 2 each time, +3, +5, +7, +9, +11, +13.",
    },
    {
      kind: "choice",
      title: "What is $\\sqrt{81}$?",
      options: [
        {
          text: "$9$",
          correct: true,
          feedback: "$9 \\times 9 = 81$. A square root asks: what times itself makes 81?",
        },
        { text: "$40.5$", feedback: "That is half of 81. A square root is not a half." },
        { text: "$27$", feedback: "$27 \\times 3 = 81$, but a root needs a number times itself." },
      ],
    },
    {
      kind: "explain",
      title: "Cube numbers make cubes",
      text: [
        "27 small cubes build a 3 by 3 by 3 cube, so 27 is a **cube number**: $3^3 = 3 \\times 3 \\times 3$.",
      ],
      picture: { kind: "cuboid", w: 3, d: 3, h: 3, cubes: true },
    },
    {
      kind: "answer",
      title: "What is $4^3$?",
      answers: ["64"],
      wrong: [
        { answer: "12", feedback: "That is $4 \\times 3$. $4^3$ means $4 \\times 4 \\times 4$." },
        { answer: "16", feedback: "That is $4^2$. One more 4." },
      ],
      hint: "$4^3 = 4 \\times 4 \\times 4$.",
      done: "$4 \\times 4 \\times 4 = 64$.",
    },
    {
      kind: "answer",
      title: "What is $\\sqrt[3]{125}$?",
      answers: ["5"],
      wrong: [
        {
          answer: "41.67",
          feedback: "A cube root is not a third. What times itself three times makes 125?",
        },
      ],
      hint: "Which number cubed makes 125? Try 4: $4^3 = 64$.",
      done: "$5 \\times 5 \\times 5 = 125$, so $\\sqrt[3]{125} = 5$.",
    },
    {
      kind: "fill",
      title: "Powers of 2",
      template: "$2^1 = 2$, $2^2 = 4$, $2^3 = 8$, $2^4 =$ [], $2^5 =$ []",
      bank: ["$10$", "$16$", "$25$", "$32$", "$64$"],
      answers: ["$16$", "$32$"],
      hint: "Each power of 2 is double the one before.",
      done: "Powers of 2 double each time: 2, 4, 8, 16, 32. Powers of 3 treble: 3, 9, 27, 81.",
    },
    {
      kind: "sort",
      title: "Square, cube or both?",
      groups: ["Square", "Cube", "Both"],
      items: [
        { text: "4", group: 0, why: "$4 = 2^2$, but no whole number cubed makes 4." },
        { text: "8", group: 1, why: "$8 = 2^3$, but it is not a square number." },
        { text: "64", group: 2, why: "$64 = 8^2$ and $64 = 4^3$." },
        { text: "27", group: 1, why: "$27 = 3^3$." },
        { text: "100", group: 0, why: "$100 = 10^2$." },
        { text: "1", group: 2, why: "$1 = 1^2 = 1^3$." },
        { text: "125", group: 1, why: "$125 = 5^3$." },
      ],
      done: "64 is special: a square and a cube. So is 1.",
    },
    {
      kind: "answer",
      title: "A higher root: $\\sqrt[4]{81}$",
      text: "The 4th root asks: what times itself four times makes 81?",
      answers: ["3"],
      wrong: [
        {
          answer: "9",
          feedback: "$9 \\times 9 = 81$: that is the square root. You need four equal factors.",
        },
      ],
      hint: "Try 3: $3 \\times 3 \\times 3 \\times 3$.",
      done: "$3 \\times 3 \\times 3 \\times 3 = 81$, so $\\sqrt[4]{81} = 3$: $3^4 = 81$.",
    },
    {
      kind: "choice",
      title: "Between which whole numbers is $\\sqrt{20}$?",
      picture: {
        kind: "number-line",
        min: 0,
        max: 6,
        step: 1,
        marks: [
          { at: 4, label: "√16" },
          { at: 5, label: "√25" },
        ],
      },
      options: [
        {
          text: "4 and 5",
          correct: true,
          feedback: "16 < 20 < 25, so $\\sqrt{16} < \\sqrt{20} < \\sqrt{25}$: between 4 and 5.",
        },
        { text: "10 and 11", feedback: "That is about half of 20. A root is much smaller." },
        { text: "2 and 3", feedback: "$3^2 = 9$, far less than 20." },
      ],
    },
    {
      kind: "choice",
      title: "Is it exact?",
      text: "A calculator says $\\sqrt{2} = 1.414213562$.",
      options: [
        {
          text: "No: it is rounded",
          correct: true,
          feedback:
            "The digits of $\\sqrt2$ go on for ever. $1.414213562^2$ is not quite 2. Write $\\sqrt2$ when you need it exact.",
        },
        {
          text: "Yes: the calculator shows all of it",
          feedback: "The screen runs out of room. The digits go on for ever.",
        },
      ],
    },
    {
      kind: "sort",
      title: "Exact or approximate?",
      groups: ["Exact", "Approximate"],
      items: [
        { text: "$\\sqrt{49} = 7$", group: 0, why: "$7^2$ is exactly 49." },
        {
          text: "$\\sqrt{10} \\approx 3.16$",
          group: 1,
          why: "$3.16^2 = 9.9856$: close to 10, not exact.",
        },
        {
          text: "$\\sqrt{2}$",
          group: 0,
          why: "$\\sqrt2$ itself is exact; only its decimal is rounded.",
        },
        { text: "$1.41$", group: 1, why: "1.41 is $\\sqrt2$ rounded: $1.41^2 = 1.9881$." },
        { text: "$\\sqrt[3]{64} = 4$", group: 0, why: "$4^3$ is exactly 64." },
        {
          text: "$\\sqrt{7} \\approx 2.65$",
          group: 1,
          why: "The ≈ sign means approximately equal.",
        },
      ],
      done: "≈ means 'approximately equal to'. A root sign keeps a number exact.",
    },
    {
      kind: "explain",
      title: "Squares, cubes and roots",
      text: [
        "$n^2$ is a square of dots, $n^3$ a cube of blocks. Roots undo them.",
        "Higher powers repeat the multiplying: $3^4 = 3 \\times 3 \\times 3 \\times 3$.",
        "A root that is not whole sits between two whole numbers. Its decimal is rounded; the root sign is exact.",
      ],
      picture: { kind: "cuboid", w: 2, d: 2, h: 2, cubes: true },
    },
  ],
};
