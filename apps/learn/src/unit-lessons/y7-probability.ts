// Year 7, "Probability": the 0 to 1 scale and its words, probability as a fraction of equally
// likely parts, a spinner spun many times to watch relative frequency settle, and probabilities
// of all the outcomes adding to 1.
import type { UnitLesson } from "./types.ts";

export const y7Probability: UnitLesson = {
  unit: "y7-probability",
  title: "How likely?",
  summary: "Put chance on a scale, then spin to test it.",
  screens: [
    {
      kind: "place",
      title: "The probability scale",
      text: "Probabilities go from 0, impossible, to 1, certain.",
      line: { kind: "number-line", min: 0, max: 1, step: 0.25, denominator: 4 },
      targets: [
        { value: 0, label: "rolling a 7 on an ordinary dice", mark: "7" },
        { value: 0.5, label: "a fair coin landing heads", mark: "heads" },
        { value: 1, label: "Monday coming after Sunday", mark: "Monday" },
        { value: 0.25, label: "picking a heart from a pack of cards", mark: "heart" },
      ],
      hint: "Impossible is 0, certain is 1, an even chance is $\\frac12$. A quarter of the cards are hearts.",
      done: "Every probability is somewhere from 0 to 1.",
    },
    {
      kind: "sort",
      title: "Rolling an ordinary dice",
      groups: ["Impossible", "Unlikely", "Even chance", "Likely", "Certain"],
      items: [
        { text: "Rolling a 0", group: 0, why: "There is no 0 on a dice: impossible." },
        { text: "Rolling a 6", group: 1, why: "Only 1 of the 6 faces: unlikely." },
        {
          text: "Rolling an even number",
          group: 2,
          why: "3 of the 6 faces are even: an even chance.",
        },
        { text: "Not rolling a 6", group: 3, why: "5 of the 6 faces are not 6: likely." },
        { text: "Rolling less than 7", group: 4, why: "Every face is less than 7: certain." },
      ],
      done: "Impossible is 0, an even chance $\\frac12$, certain 1.",
    },
    {
      kind: "explain",
      title: "Probability as a fraction",
      text: [
        "This spinner has 4 equal parts, and 1 is A. So the probability of A is 1 out of 4: $P(A) = \\frac14$.",
        "Probability = number of ways it can happen ÷ number of equally likely outcomes.",
      ],
      picture: {
        kind: "spinner",
        sectors: [
          { label: "A", size: 1 },
          { label: "B", size: 3 },
        ],
      },
    },
    {
      kind: "choice",
      title: "What is P(red)?",
      picture: {
        kind: "spinner",
        sectors: [
          { label: "red", size: 2 },
          { label: "blue", size: 1 },
          { label: "green", size: 1 },
        ],
      },
      options: [
        {
          text: "$\\frac{2}{4} = \\frac{1}{2}$",
          correct: true,
          feedback: "Red covers 2 of the 4 equal parts.",
        },
        {
          text: "$\\frac{1}{3}$",
          feedback: "There are 3 colours, but they are not equally likely: red is twice as big.",
        },
        { text: "$2$", feedback: "A probability is never more than 1." },
      ],
    },
    {
      kind: "spin",
      title: "Spin it lots",
      text: "A is a quarter, B is a quarter, and C is half the spinner. Spin it and watch the fractions.",
      sectors: [
        { label: "A", size: 1 },
        { label: "B", size: 1 },
        { label: "C", size: 2 },
      ],
      spins: 100,
      done: "The more you spin, the closer the fractions get to $\\frac14$, $\\frac14$ and $\\frac12$. The fraction of times something happens is its **relative frequency**.",
    },
    {
      kind: "answer",
      title: "Drop a drawing pin",
      text: "A drawing pin is dropped 50 times, and lands point up 18 times. Estimate the probability it lands point up, as a decimal.",
      answers: ["0.36", "18/50", "9/25"],
      wrong: [
        { answer: "18", feedback: "A probability is a fraction of the drops: 18 out of 50." },
      ],
      hint: "Relative frequency = times it happened ÷ number of tries.",
      done: "$18 \\div 50 = 0.36$. A pin has no equal parts, so an experiment is the way to find out.",
    },
    {
      kind: "choice",
      title: "Which estimate is more reliable?",
      options: [
        {
          text: "One from 500 drops",
          correct: true,
          feedback: "More tries give a more reliable estimate, as the spinner showed.",
        },
        { text: "One from 10 drops", feedback: "With only 10 tries, luck makes a big difference." },
        {
          text: "They are just as good",
          feedback: "Remember how jumpy the spinner's fractions were at first.",
        },
      ],
    },
    {
      kind: "fill",
      title: "It happens or it doesn't",
      template: "$P(\\text{rain}) = 0.3$, so $P(\\text{no rain}) =$ []",
      bank: ["$0.3$", "$0.7$", "$1.3$", "$0.03$"],
      answers: ["$0.7$"],
      hint: "Rain and no rain cover everything, so together they are 1.",
      done: "$1 - 0.3 = 0.7$. The probabilities of all the outcomes add to 1.",
    },
    {
      kind: "answer",
      title: "Find P(green)",
      picture: {
        kind: "table",
        head: ["Colour", "Red", "Blue", "Green"],
        rows: [["Probability", "0.2", "0.45", "?"]],
      },
      answers: ["0.35"],
      wrong: [
        { answer: "0.65", feedback: "Take both red and blue away from 1." },
        { answer: "0.55", feedback: "Take both red and blue away from 1." },
      ],
      hint: "All three add up to 1.",
      done: "$1 - 0.2 - 0.45 = 0.35$.",
    },
    {
      kind: "choice",
      title: "Win, draw or lose",
      text: "A team's chance of winning is 0.4 and of drawing is 0.25. What is the chance they lose?",
      options: [
        { text: "$0.35$", correct: true, feedback: "$1 - 0.4 - 0.25 = 0.35$." },
        { text: "$0.6$", feedback: "That is the chance of not winning. Take away the draw too." },
        { text: "$0.65$", feedback: "That is the chance of winning or drawing." },
      ],
    },
    {
      kind: "explain",
      title: "How likely?",
      text: [
        "Probability goes from 0, impossible, to 1, certain.",
        "With equally likely outcomes: ways it can happen ÷ all the outcomes.",
        "Experiments give relative frequency: more tries, better estimate. All the outcomes add to 1.",
      ],
      picture: {
        kind: "number-line",
        min: 0,
        max: 1,
        step: 0.25,
        denominator: 4,
        marks: [
          { at: 0, label: "impossible" },
          { at: 0.5, label: "even" },
          { at: 1, label: "certain" },
        ],
      },
    },
  ],
};
