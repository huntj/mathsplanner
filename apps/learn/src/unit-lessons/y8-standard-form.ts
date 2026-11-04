// Year 8, "Standard form": writing huge and tiny numbers as a number from 1 to 10 times a power
// of ten, comparing them power first, and zooming in on a number line to find that numbers go on
// for ever, outwards and in between.
import type { UnitLesson } from "./types.ts";

export const y8StandardForm: UnitLesson = {
  unit: "y8-standard-form",
  title: "Very big, very small",
  summary: "Write huge and tiny numbers neatly, then zoom in for ever.",
  screens: [
    {
      kind: "explain",
      title: "Too many zeros",
      text: [
        "The Sun is about 150 000 000 km away. All those zeros are slow to write and easy to miscount.",
        "**Standard form** writes it as $1.5 \\times 10^8$: a number from 1 up to (but not including) 10, times a power of 10.",
      ],
      picture: { kind: "maths", tex: "150\\,000\\,000 = 1.5 \\times 10^8" },
    },
    {
      kind: "steps",
      title: "Write 4 600 000 in standard form",
      start: "$4\\,600\\,000$",
      stages: [
        {
          prompt: "First, put the point after the first digit:",
          options: [
            { text: "$4.6$", correct: true, feedback: "" },
            { text: "$46$", feedback: "The first number must be at least 1 and less than 10." },
            { text: "$0.46$", feedback: "The first number must be at least 1." },
          ],
          then: "$4.6$",
        },
        {
          prompt: "How many places do the digits move to get from 4.6 back to 4 600 000?",
          options: [
            { text: "6", correct: true, feedback: "" },
            { text: "5", feedback: "Count the jumps: 46, 460, 4600… there are six." },
            { text: "7", feedback: "Count the digits after the 4: there are six places." },
          ],
          then: "$4\\,600\\,000 = 4.6 \\times 10^6$",
        },
      ],
      done: "The power of 10 counts how many places the digits move.",
    },
    {
      kind: "choice",
      title: "Which is 37 000 in standard form?",
      options: [
        {
          text: "$3.7 \\times 10^4$",
          correct: true,
          feedback: "3.7 moves 4 places to make 37 000.",
        },
        {
          text: "$37 \\times 10^3$",
          feedback: "It equals 37 000, but 37 is more than 10: not standard form.",
        },
        { text: "$3.7 \\times 10^3$", feedback: "That is 3700." },
      ],
    },
    {
      kind: "explain",
      title: "Tiny numbers",
      text: [
        "Small numbers use negative powers. In 0.0052, the 5 is in the thousandths column.",
        "Moving the digits 3 places left gives 5.2, so $0.0052 = 5.2 \\times 10^{-3}$.",
      ],
      picture: { kind: "place-value", number: "0.0052", from: 0, to: -4, highlight: -3 },
    },
    {
      kind: "choice",
      title: "Which is 0.00041 in standard form?",
      options: [
        {
          text: "$4.1 \\times 10^{-4}$",
          correct: true,
          feedback: "The digits move 4 places to make 4.1, and it is tiny, so the power is −4.",
        },
        {
          text: "$4.1 \\times 10^{4}$",
          feedback: "A positive power makes a big number: 41 000. This number is tiny.",
        },
        { text: "$41 \\times 10^{-5}$", feedback: "It equals 0.00041, but 41 is more than 10." },
      ],
    },
    {
      kind: "answer",
      title: "Write $2.3 \\times 10^5$ as an ordinary number",
      answers: ["230000"],
      wrong: [
        { answer: "2300000", feedback: "That is $10^6$. Move the digits 5 places." },
        { answer: "23000", feedback: "That is $10^4$. Move the digits 5 places." },
      ],
      hint: "Move the digits 5 places left, filling with zeros.",
      done: "$2.3 \\times 10^5 = 230\\,000$.",
    },
    {
      kind: "order",
      title: "Smallest to largest",
      items: [
        "$9 \\times 10^{-2}$",
        "$3.4 \\times 10^{-1}$",
        "$2.1 \\times 10^{3}$",
        "$7.5 \\times 10^{3}$",
        "$1.2 \\times 10^{4}$",
      ],
      first: "smallest",
      last: "largest",
      hint: "Compare the powers first. Only when the powers match, compare the first numbers.",
      done: "0.09, 0.34, 2100, 7500, 12 000. The power matters most.",
    },
    {
      kind: "choice",
      title: "Which is bigger?",
      options: [
        {
          text: "$1.1 \\times 10^4$",
          correct: true,
          feedback: "That is 11 000, and $9.9 \\times 10^3$ is 9900. The bigger power wins.",
        },
        {
          text: "$9.9 \\times 10^3$",
          feedback: "9.9 beats 1.1, but the powers differ: 9900 against 11 000.",
        },
      ],
    },
    {
      kind: "place",
      title: "Zoom in",
      text: "Is there a number between 0.3 and 0.4? Zoom in on the number line.",
      line: { kind: "number-line", min: 0.3, max: 0.4, step: 0.01, every: 5 },
      targets: [{ value: 0.35, label: "$0.35$" }],
      hint: "Each small step is 0.01. Count along from 0.3.",
      done: "There are lots of numbers between 0.3 and 0.4.",
    },
    {
      kind: "place",
      title: "Zoom in again",
      text: "Is there a number between 0.35 and 0.36?",
      line: { kind: "number-line", min: 0.35, max: 0.36, step: 0.001, every: 5 },
      targets: [{ value: 0.355, label: "$0.355$" }],
      hint: "Each small step is now 0.001.",
      done: "However close two numbers are, there is always another between them. You can zoom in for ever.",
    },
    {
      kind: "choice",
      title: "What is the biggest whole number?",
      options: [
        {
          text: "There isn't one",
          correct: true,
          feedback:
            "Whatever number you name, add 1 and you have a bigger one. The integers go on for ever, both ways.",
        },
        { text: "A googol, $10^{100}$", feedback: "$10^{100} + 1$ is bigger still." },
        { text: "$9.9 \\times 10^{99}$", feedback: "Add 1 to it, and you have a bigger one." },
      ],
    },
    {
      kind: "choice",
      title: "How many fractions lie between 0 and 1?",
      options: [
        {
          text: "Infinitely many",
          correct: true,
          feedback:
            "$\\frac12$, $\\frac14$, $\\frac18$… you can always halve again, and that is only some of them.",
        },
        {
          text: "9",
          feedback: "$\\frac{1}{10}$, $\\frac{1}{100}$, $\\frac{1}{1000}$… they never run out.",
        },
        { text: "100", feedback: "There is always another: halve the smallest one you have." },
      ],
    },
    {
      kind: "explain",
      title: "Very big, very small",
      text: [
        "Standard form is $a \\times 10^n$, with $1 \\le a < 10$. Big numbers have positive powers; tiny ones negative.",
        "Compare the powers first, then the numbers in front.",
        "Numbers go on for ever: there is no biggest, and always another in between.",
      ],
      picture: { kind: "maths", tex: "0.0052 = 5.2 \\times 10^{-3}" },
    },
  ],
};
