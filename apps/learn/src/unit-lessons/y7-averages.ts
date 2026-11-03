// Year 7, "Averages and range": the mean as levelling towers out, the median as the middle, the
// mode as the most common, the range as the spread, and choosing which tells the truth.
import type { UnitLesson } from "./types.ts";

export const y7Averages: UnitLesson = {
  unit: "y7-averages",
  title: "What is typical?",
  summary: "Level out towers to find the mean, then pick the fairest average.",
  screens: [
    {
      kind: "choice",
      title: "Level the towers",
      text: "If you share the blocks out so every tower is the same height, how tall is each?",
      picture: { kind: "stacks", counts: [2, 7, 3, 4], labels: ["A", "B", "C", "D"] },
      revealPicture: { kind: "stacks", counts: [4, 4, 4, 4], labels: ["A", "B", "C", "D"] },
      options: [
        {
          text: "4",
          correct: true,
          feedback:
            "16 blocks shared between 4 towers is 4 each. That is the **mean**: total ÷ how many.",
        },
        { text: "7", feedback: "That is the tallest tower. Share the blocks out evenly." },
        { text: "3.5", feedback: "Count the blocks: 2 + 7 + 3 + 4 = 16." },
      ],
    },
    {
      kind: "answer",
      title: "Find the mean of 5, 9, 4, 6 and 11",
      answers: ["7"],
      wrong: [{ answer: "35", feedback: "35 is the total. Share it between the 5 numbers." }],
      hint: "Add them up, then divide by how many there are.",
      done: "$35 \\div 5 = 7$.",
    },
    {
      kind: "order",
      title: "Line them up to find the middle",
      text: "Put 8, 3, 12, 5 and 9 in order.",
      items: ["3", "5", "8", "9", "12"],
      first: "smallest",
      last: "largest",
      hint: "Find the smallest first.",
      done: "The middle one is 8: that is the **median**.",
    },
    {
      kind: "answer",
      title: "The median of 4, 10, 6 and 7",
      text: "There is an even number of values this time.",
      answers: ["6.5"],
      wrong: [
        { answer: "6", feedback: "With two in the middle, take halfway between them." },
        { answer: "7", feedback: "With two in the middle, take halfway between them." },
        { answer: "8", feedback: "Put them in order first: 4, 6, 7, 10." },
      ],
      hint: "In order: 4, 6, 7, 10. The middle is between 6 and 7.",
      done: "Halfway between 6 and 7 is 6.5.",
    },
    {
      kind: "choice",
      title: "Shoe sizes: 4, 5, 5, 6, 7, 5, 4. What is the mode?",
      options: [
        {
          text: "5",
          correct: true,
          feedback: "5 comes up three times, more than any other: the **mode**.",
        },
        { text: "3", feedback: "5 appears 3 times. The mode is the value, 5, not how often." },
        { text: "7", feedback: "7 is the biggest. The mode is the most common." },
      ],
    },
    {
      kind: "answer",
      title: "The range of 12, 3, 18 and 7",
      answers: ["15"],
      wrong: [{ answer: "18", feedback: "That is the biggest. The range is biggest − smallest." }],
      hint: "Biggest take away smallest.",
      done: "$18 - 3 = 15$. The range shows how spread out the data is.",
    },
    {
      kind: "choice",
      title: "Which average is fairest?",
      text: "Five people earn £20k, £22k, £21k, £23k and £250k. Which average best describes a typical pay?",
      options: [
        {
          text: "The median",
          correct: true,
          feedback:
            "The median is £22k. The mean, £67.2k, is dragged up by one huge pay that no one else gets.",
        },
        { text: "The mean", feedback: "The mean is £67.2k: four of the five earn far less." },
        { text: "The range", feedback: "The range shows spread, not what is typical." },
      ],
    },
    {
      kind: "choice",
      title: "Which team is more consistent?",
      picture: {
        kind: "table",
        head: ["", "Mean score", "Range"],
        rows: [
          ["Team A", "15", "4"],
          ["Team B", "15", "20"],
        ],
      },
      options: [
        {
          text: "Team A",
          correct: true,
          feedback: "The same mean, but A's smaller range means its scores stay close together.",
        },
        { text: "Team B", feedback: "A bigger range means the scores are more spread out." },
        { text: "They are the same", feedback: "The means match, but look at the ranges." },
      ],
    },
    {
      kind: "answer",
      title: "The missing number",
      text: "Four numbers have a mean of 6. Three of them are 4, 5 and 8. What is the fourth?",
      answers: ["7"],
      wrong: [{ answer: "6", feedback: "The total of all four must be $4 \\times 6 = 24$." }],
      hint: "A mean of 6 for four numbers means they add up to 24.",
      done: "$24 - 4 - 5 - 8 = 7$.",
    },
    {
      kind: "answer",
      title: "Add a zero",
      text: "The mean of 4, 6 and 8 is 6. A fourth value, 0, is added. What is the new mean?",
      answers: ["4.5"],
      wrong: [{ answer: "6", feedback: "The total is still 18, but now there are 4 values." }],
      hint: "Total ÷ how many: there are now 4 values.",
      done: "$18 \\div 4 = 4.5$. A zero still counts, and pulls the mean down.",
    },
    {
      kind: "explain",
      title: "What is typical?",
      text: [
        "Mean: share the total out evenly. Median: the middle, in order. Mode: the most common.",
        "Range: biggest − smallest, to show the spread.",
        "Compare data sets with an average and the range. One extreme value can mislead the mean.",
      ],
      picture: { kind: "stacks", counts: [4, 4, 4, 4], labels: ["A", "B", "C", "D"] },
    },
  ],
};
