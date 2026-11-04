// Year 9, "Probability": counting outcomes in a sample space grid, sorting into a Venn diagram,
// single events from counts, and combined events from listing every outcome.
import type { UnitLesson } from "./types.ts";

const die = ["1", "2", "3", "4", "5", "6"];
const totals = Array.from({ length: 36 }, (_, i) => String(Math.floor(i / 6) + (i % 6) + 2));
const sevens = [5, 10, 15, 20, 25, 30];

export const y9Probability: UnitLesson = {
  unit: "y9-probability",
  title: "Count every outcome",
  summary: "List every outcome in grids and Venn diagrams, then count your chances.",
  screens: [
    {
      kind: "explain",
      title: "A sample space",
      text: [
        "Roll two dice and add them. Every first dice with every second dice gives $6 \\times 6 = 36$ equally likely outcomes.",
        "This grid is the **sample space**: each square is one outcome, showing its total.",
      ],
      picture: {
        kind: "grid",
        cols: 6,
        rows: 6,
        shaded: 0,
        colLabels: die,
        rowLabels: die,
        values: totals,
      },
    },
    {
      kind: "shade",
      title: "Shade every way to score 7",
      cols: 6,
      rows: 6,
      target: 6,
      cells: sevens,
      colLabels: die,
      rowLabels: die,
      values: totals,
      hint: "Find every square showing 7. They run in a diagonal line.",
      done: "6 ways out of 36: $P(7) = \\frac{6}{36} = \\frac16$. No total is more likely.",
    },
    {
      kind: "answer",
      title: "P(a total of 10)",
      text: "Give it as a fraction.",
      picture: {
        kind: "grid",
        cols: 6,
        rows: 6,
        shaded: 0,
        colLabels: die,
        rowLabels: die,
        values: totals,
      },
      answers: ["3/36", "1/12"],
      wrong: [
        { answer: "1/11", feedback: "There are 36 outcomes, not 11: count the 10s in the grid." },
      ],
      hint: "Count the squares showing 10: (4, 6), (5, 5) and (6, 4).",
      done: "3 out of 36: $\\frac{3}{36} = \\frac{1}{12}$.",
    },
    {
      kind: "answer",
      title: "Counters in a bag",
      text: "A bag has 3 red, 5 blue and 2 green counters. One is picked at random. What is P(blue)?",
      answers: ["1/2", "5/10", "0.5"],
      wrong: [
        {
          answer: "1/3",
          feedback: "There are 3 colours, but not equally many of each. 5 of the 10 are blue.",
        },
      ],
      hint: "Blue counters ÷ all the counters.",
      done: "$\\frac{5}{10} = \\frac12$.",
    },
    {
      kind: "explain",
      title: "A Venn diagram",
      text: [
        "Numbers 1 to 10. Circle A holds the multiples of 2; circle B the multiples of 3.",
        "6 is in both, so it goes in the overlap. Numbers in neither go outside.",
      ],
      picture: {
        kind: "venn",
        a: "×2",
        b: "×3",
        onlyA: ["2", "4", "8", "10"],
        both: ["6"],
        onlyB: ["3", "9"],
        neither: ["1", "5", "7"],
      },
    },
    {
      kind: "sort",
      title: "Even and square",
      text: "Sort the numbers into the Venn diagram's regions.",
      groups: ["Even only", "Both", "Square only", "Neither"],
      items: [
        { text: "2", group: 0, why: "2 is even, but not a square number." },
        { text: "4", group: 1, why: "4 is even, and $4 = 2^2$." },
        { text: "9", group: 2, why: "$9 = 3^2$, but 9 is odd." },
        { text: "6", group: 0, why: "6 is even, but not square." },
        { text: "1", group: 2, why: "$1 = 1^2$, and 1 is odd." },
        { text: "5", group: 3, why: "5 is odd and not square." },
        { text: "8", group: 0, why: "8 is even, but not square." },
        { text: "7", group: 3, why: "7 is odd and not square." },
      ],
      done: "Only 4 is in the overlap: even and square.",
    },
    {
      kind: "answer",
      title: "From the Venn diagram",
      text: "A number from 1 to 10 is picked at random. What is the probability it is even and square?",
      picture: {
        kind: "venn",
        a: "Even",
        b: "Square",
        onlyA: ["2", "6", "8", "10"],
        both: ["4"],
        onlyB: ["1", "9"],
        neither: ["3", "5", "7"],
      },
      answers: ["1/10", "0.1"],
      wrong: [
        { answer: "7/10", feedback: "That is even or square. 'And' means the overlap only." },
      ],
      hint: "'And' means both: the overlap.",
      done: "Only 4: $\\frac{1}{10}$.",
    },
    {
      kind: "choice",
      title: "Two coins",
      text: "Two coins are flipped. What is the probability of one head and one tail?",
      picture: {
        kind: "table",
        head: ["", "Head", "Tail"],
        rows: [
          ["Head", "HH", "HT"],
          ["Tail", "TH", "TT"],
        ],
      },
      options: [
        {
          text: "$\\frac{2}{4} = \\frac12$",
          correct: true,
          feedback: "HT and TH: 2 of the 4 equally likely outcomes.",
        },
        {
          text: "$\\frac13$",
          feedback: "There are 4 outcomes, not 3: HT and TH are different ways.",
        },
        { text: "$\\frac14$", feedback: "There are two ways: head then tail, or tail then head." },
      ],
    },
    {
      kind: "explain",
      title: "Count every outcome",
      text: [
        "List every equally likely outcome in a grid, a table or a Venn diagram, then count.",
        "Probability = ways it can happen ÷ all the outcomes. In a Venn diagram, 'and' is the overlap.",
      ],
      picture: {
        kind: "grid",
        cols: 6,
        rows: 6,
        shaded: 6,
        cells: sevens,
        colLabels: die,
        rowLabels: die,
        values: totals,
      },
    },
  ],
};
