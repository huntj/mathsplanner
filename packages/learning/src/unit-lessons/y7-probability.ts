// Year 7, "Probability", as three short lessons, one just before each skill: the words and the 0
// to 1 scale, experiments and relative frequency, and why all the probabilities add to 1. Each
// starts from something quick, builds the idea a step at a time, names the common mistakes, and
// ends on an exit check.
import type { UnitLesson } from "./types.ts";

const SCALE = "Y7-PRO-01.a";
const EXPERIMENT = "Y7-PRO-01.b";
const SUM = "Y7-PRO-02";

export const y7Probability: UnitLesson[] = [
  {
    unit: "y7-probability",
    id: "y7-probability/scale",
    before: SCALE,
    title: "How likely?",
    summary: "Probabilities go from 0, impossible, to 1, certain.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The weather forecast",
        text: [
          "The forecast says there's a 0.8 chance of rain tomorrow, and a 0.1 chance of snow.",
          "What do those numbers mean? Should you take an umbrella? By the end of this lesson, you can read them.",
        ],
        picture: {
          kind: "number-line",
          min: 0,
          max: 1,
          step: 0.1,
          marks: [
            { at: 0.1, label: "snow" },
            { at: 0.8, label: "rain" },
          ],
        },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Is the sun certain to rise tomorrow?",
        options: [
          { text: "Yes: certain", correct: true, feedback: "It always does." },
          { text: "It's a 50:50 chance", feedback: "It has never failed to rise." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "A fair coin lands heads. That's",
        options: [
          { text: "an even chance", correct: true, feedback: "Heads or tails, equally likely." },
          { text: "certain", feedback: "It might land tails." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The probability scale",
        text: [
          "Probability measures how likely something is, from **0** (impossible) to **1** (certain). An even chance is $\\frac12$, or 0.5.",
          "Words help too: impossible, unlikely, even chance, likely, certain.",
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
      {
        kind: "place",
        tag: "Discover",
        title: "Place them on the scale",
        text: "Probabilities go from 0, impossible, to 1, certain.",
        line: { kind: "number-line", min: 0, max: 1, step: 0.25, denominator: 4 },
        targets: [
          { value: 0, label: "rolling a 7 on an ordinary dice", mark: "7" },
          { value: 0.5, label: "a fair coin landing heads", mark: "heads" },
          { value: 1, label: "Monday coming after Sunday", mark: "Monday" },
        ],
        hint: "Impossible is 0, certain is 1, an even chance is $\\frac12$.",
        done: "Every probability is somewhere from 0 to 1.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Describe it",
        problem: "Describe a probability of 0.8, and one of 0.1.",
        steps: [
          { line: "0.8 is close to 1: likely", why: "Near certain." },
          { line: "0.1 is close to 0: unlikely", why: "Near impossible." },
        ],
        done: "Rain is likely; snow is unlikely.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Rolling a dice",
        start: "An ordinary dice, 1 to 6.",
        stages: [
          {
            prompt: "Rolling a number less than 7 is",
            options: [
              { text: "certain: 1", correct: true, feedback: "" },
              { text: "likely", feedback: "Every number on it is less than 7." },
            ],
            then: "Certain",
          },
          {
            prompt: "Rolling a 6 is",
            options: [
              { text: "unlikely: 1 in 6", correct: true, feedback: "" },
              { text: "even chance", feedback: "Only 1 of the 6 faces." },
            ],
            then: "Unlikely",
          },
        ],
        done: "Count the ways to judge the chance.",
      },
      {
        kind: "sort",
        tag: "Together",
        title: "Rolling an ordinary dice",
        groups: ["Impossible", "Unlikely", "Even chance", "Certain"],
        items: [
          { text: "Rolling a 9", group: 0, why: "There's no 9." },
          { text: "Rolling a 6", group: 1, why: "1 way in 6." },
          { text: "Rolling an even number", group: 2, why: "3 ways in 6." },
          { text: "Rolling a whole number", group: 3, why: "Every face is whole." },
        ],
        done: "Count the ways it can happen.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "A probability of 0.5 means",
        options: [
          { text: "an even chance", correct: true, feedback: "Half the time." },
          { text: "certain", feedback: "Certain is 1." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which can't be a probability?",
        options: [
          { text: "1.3", correct: true, feedback: "Probabilities never go above 1." },
          { text: "0.3", feedback: "0.3 is fine: unlikely." },
          { text: "1", feedback: "1 means certain." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Raj says the chance of rain is 80, so it's very likely. What's wrong with writing 80?",
        options: [
          {
            text: "Probabilities go from 0 to 1: write 0.8 (or 80%)",
            correct: true,
            feedback:
              "A probability can be a fraction, decimal or percentage, but never more than 1 (100%).",
          },
          { text: "Nothing", feedback: "80 is far bigger than 1." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ivy describes picking a red sweet from a bag of all-red sweets.",
        lines: ["Every sweet is red", "So it's very likely", "Its probability is 0.9"],
        wrong: 1,
        why: "If every sweet is red, it's **certain**: probability 1.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The weather forecast",
        text: "0.8 chance of rain, 0.1 chance of snow.",
        options: [
          {
            text: "Rain is likely; snow unlikely. Take an umbrella!",
            correct: true,
            feedback: "0.8 is near 1; 0.1 is near 0.",
          },
          { text: "Both are even chances", feedback: "Even is 0.5." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A probability of 0 means",
            options: ["impossible", "certain", "even chance"],
            answers: ["impossible"],
            why: "It can't happen.",
            retry: {
              prompt: "A probability of 1 means",
              options: ["certain", "impossible", "even chance"],
              answers: ["certain"],
              why: "It must happen.",
            },
          },
          {
            prompt: "Describe a probability of 0.2.",
            options: ["unlikely", "likely", "certain"],
            answers: ["unlikely"],
            why: "Close to 0.",
            retry: {
              prompt: "Describe a probability of 0.9.",
              options: ["likely", "unlikely", "impossible"],
              answers: ["likely"],
              why: "Close to 1.",
            },
          },
          {
            prompt: "Which can't be a probability?",
            options: ["−0.2", "0.2", "0"],
            answers: ["−0.2"],
            why: "Never below 0.",
            retry: {
              prompt: "Which of these can't be a probability?",
              options: ["2", "0.5", "1"],
              answers: ["2"],
              why: "Never above 1.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-probability",
    id: "y7-probability/experiments",
    before: EXPERIMENT,
    title: "Experiments",
    summary: "Do it lots of times: the fraction of times it happens estimates the probability.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A drawing pin",
        text: [
          "Drop a drawing pin: it lands point up or point down. There's no way to work out the chance by counting outcomes; they aren't equally likely.",
          "How can we find the probability? By the end of this lesson, you can estimate it.",
        ],
        picture: { kind: "table", head: ["Point up", "Point down"], rows: [["?", "?"]] },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $\\frac{30}{50}$ as a decimal?",
        answers: ["0.6"],
        hint: "$\\frac{60}{100}$.",
        done: "0.6.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $\\frac{1}{4}$ of 100?",
        answers: ["25"],
        hint: "$100 \\div 4$.",
        done: "25.",
      },
      {
        kind: "spin",
        tag: "Discover",
        title: "Spin it lots",
        text: "A is a quarter, B is a quarter, and C is half the spinner. Spin it and watch the fractions.",
        sectors: [
          { label: "A", size: 1 },
          { label: "B", size: 1 },
          { label: "C", size: 2 },
        ],
        spins: 100,
        done: "The more you spin, the closer the fractions get to $\\frac14$, $\\frac14$ and $\\frac12$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Relative frequency",
        text: [
          "The fraction of times something happened is its **relative frequency**: times it happened ÷ number of trials.",
          "It's an estimate of the probability. More trials make it more reliable.",
        ],
        picture: {
          kind: "maths",
          tex: "\\text{relative frequency} = \\frac{\\text{times it happened}}{\\text{trials}}",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Landing point up",
        problem:
          "A drawing pin is dropped 50 times. It lands point up 30 times. Estimate P(point up).",
        steps: [
          { line: "$\\frac{30}{50}$", why: "Times it happened over trials." },
          { line: "$= 0.6$", why: "As a decimal." },
        ],
        done: "About 0.6.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A biased coin",
        start: "A coin is flipped 200 times: 130 heads.",
        stages: [
          {
            prompt: "Relative frequency of heads:",
            options: [
              { text: "$\\frac{130}{200} = 0.65$", correct: true, feedback: "" },
              { text: "$\\frac{130}{70}$", feedback: "Divide by all 200 trials, not the tails." },
            ],
            then: "0.65",
          },
          {
            prompt: "Is the coin fair?",
            options: [
              {
                text: "Probably not: 0.65 is far from 0.5 after 200 flips",
                correct: true,
                feedback: "",
              },
              { text: "Yes, certainly", feedback: "A fair coin would give close to 100 heads." },
            ],
            then: "Probably biased",
          },
        ],
        done: "Lots of trials let you judge fairness.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Predicting",
        start: "P(point up) ≈ 0.6. The pin is dropped 500 times.",
        stages: [
          {
            prompt: "Expect about",
            options: [
              { text: "300 point up", correct: true, feedback: "" },
              { text: "60", feedback: "$0.6 \\times 500$." },
            ],
            then: "300",
          },
        ],
        done: "Expected number = probability × trials.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "40 spins; 'red' came up 10 times. Estimate P(red).",
        text: "Give a decimal.",
        answers: ["0.25", "1/4"],
        hint: "$\\frac{10}{40}$.",
        done: "0.25.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which estimate is more reliable?",
        options: [
          { text: "From 1000 trials", correct: true, feedback: "More trials, more reliable." },
          { text: "From 10 trials", feedback: "With few trials, luck has a big effect." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Ali flips a coin 4 times and gets 3 heads. He says P(heads) is 0.75. Is that reliable?",
        options: [
          {
            text: "No: 4 trials is far too few",
            correct: true,
            feedback:
              "Small experiments are easily swayed by luck. Hundreds of trials give a better estimate.",
          },
          { text: "Yes", feedback: "A fair coin can easily give 3 heads in 4 flips." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "A dice is rolled 60 times; a 6 comes up 12 times. Ella estimates P(6).",
        lines: ["6 came up 12 times", "It didn't come up 48 times", "So P(6) ≈ $\\frac{12}{48}$"],
        wrong: 2,
        why: "Divide by all the trials: $\\frac{12}{60} = 0.2$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "A drawing pin",
        start: "Dropped 100 times: point up 62 times.",
        stages: [
          {
            prompt: "Estimate P(point up):",
            options: [
              { text: "0.62", correct: true, feedback: "" },
              { text: "0.5", feedback: "The outcomes aren't equally likely: use the results." },
            ],
            then: "0.62",
          },
          {
            prompt: "To make it more reliable,",
            options: [
              { text: "drop it more times", correct: true, feedback: "" },
              { text: "drop it fewer times", feedback: "More trials, better estimate." },
            ],
            then: "More trials",
          },
        ],
        done: "When you can't count outcomes, experiment.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "20 trials, 5 successes. Relative frequency as a decimal?",
            answers: ["0.25"],
            why: "$\\frac{5}{20}$.",
            retry: {
              prompt: "50 trials, 20 successes. Relative frequency as a decimal?",
              answers: ["0.4"],
              why: "$\\frac{20}{50}$.",
            },
          },
          {
            prompt: "P(win) ≈ 0.3. In 100 games, about how many wins?",
            answers: ["30"],
            why: "$0.3 \\times 100$.",
            retry: {
              prompt: "P(win) ≈ 0.2. In 50 games, about how many wins?",
              answers: ["10"],
              why: "$0.2 \\times 50$.",
            },
          },
          {
            prompt: "More trials make an estimate",
            options: ["more reliable", "less reliable", "exactly right"],
            answers: ["more reliable"],
            why: "Luck evens out.",
            retry: {
              prompt: "An estimate from 5 trials is",
              options: ["not very reliable", "certain", "very reliable"],
              answers: ["not very reliable"],
              why: "Too few to trust.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-probability",
    id: "y7-probability/sum-to-one",
    before: SUM,
    title: "It all adds to 1",
    summary: "Something must happen: the probabilities of all the outcomes add to 1.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The missing chance",
        text: [
          "A football team's chances: win 0.5, draw 0.2. The coach wants to know the chance of losing.",
          "No one has told her. Can she work it out? By the end of this lesson, she can.",
        ],
        picture: { kind: "table", head: ["Win", "Draw", "Lose"], rows: [["0.5", "0.2", "?"]] },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $1 - 0.7$?",
        answers: ["0.3"],
        hint: "What adds to 0.7 to make 1?",
        done: "0.3.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $0.5 + 0.2$?",
        answers: ["0.7"],
        hint: "Add the tenths.",
        done: "0.7.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Something must happen",
        text: [
          "When a dice is rolled, it must land on 1, 2, 3, 4, 5 or 6: certain. So the six probabilities add to 1.",
          "The probabilities of **all** the possible outcomes always add to 1.",
        ],
        picture: {
          kind: "maths",
          tex: "\\tfrac16 + \\tfrac16 + \\tfrac16 + \\tfrac16 + \\tfrac16 + \\tfrac16 = 1",
        },
      },
      {
        kind: "fill",
        tag: "Discover",
        title: "It happens or it doesn't",
        template: "P(rain) = 0.3, so P(no rain) = []",
        bank: ["$0.7$", "$0.3$", "$1.3$", "$0.03$"],
        answers: ["$0.7$"],
        hint: "It either rains or it doesn't: they add to 1.",
        done: "$1 - 0.3 = 0.7$.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Three outcomes",
        problem: "A spinner lands red, blue or green. P(red) = 0.4, P(blue) = 0.35. Find P(green).",
        steps: [
          { line: "$0.4 + 0.35 = 0.75$", why: "Add what you know." },
          { line: "$1 - 0.75 = 0.25$", why: "Everything adds to 1." },
        ],
        done: "P(green) = 0.25.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A bag of sweets",
        start: "P(lemon) = 0.2, P(lime) = 0.45, and the rest are strawberry.",
        stages: [
          {
            prompt: "Add the known ones:",
            options: [
              { text: "0.65", correct: true, feedback: "" },
              { text: "0.47", feedback: "$0.20 + 0.45$." },
            ],
            then: "0.65",
          },
          {
            prompt: "P(strawberry):",
            options: [
              { text: "0.35", correct: true, feedback: "" },
              { text: "0.65", feedback: "Take it from 1." },
            ],
            then: "0.35",
          },
        ],
        done: "Check: $0.2 + 0.45 + 0.35 = 1$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "With fractions",
        start: "P(win) = $\\frac{3}{8}$.",
        stages: [
          {
            prompt: "P(not win):",
            options: [
              { text: "$\\frac58$", correct: true, feedback: "" },
              { text: "$\\frac38$", feedback: "$1 - \\frac38 = \\frac88 - \\frac38$." },
            ],
            then: "$\\frac58$",
          },
        ],
        done: "1 is $\\frac88$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "P(late) = 0.15. What is P(not late)?",
        answers: ["0.85"],
        wrong: [{ answer: "0.95", feedback: "$1 - 0.15$: line up the decimals." }],
        hint: "$1 - 0.15$.",
        done: "0.85.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "P(A) = 0.1, P(B) = 0.6; A, B and C are the only outcomes. What is P(C)?",
        answers: ["0.3"],
        hint: "$1 - 0.7$.",
        done: "0.3.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Win 0.6, draw 0.3, lose 0.4. Can these be right?",
        options: [
          {
            text: "No: they add to 1.3, more than 1",
            correct: true,
            feedback: "All the outcomes must add to exactly 1. Checking catches mistakes.",
          },
          { text: "Yes", feedback: "$0.6 + 0.3 + 0.4 = 1.3$." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo finds P(not 6) on a fair dice.",
        lines: ["P(6) = $\\frac16$", "P(not 6) = $1 - \\frac16$", "$= \\frac{0}{6}$"],
        wrong: 2,
        why: "$1 = \\frac66$, so $\\frac66 - \\frac16 = \\frac56$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The missing chance",
        text: "Win 0.5, draw 0.2. What's P(lose)?",
        answers: ["0.3"],
        wrong: [{ answer: "0.7", feedback: "0.7 is win or draw. Take it from 1." }],
        hint: "$1 - 0.5 - 0.2$.",
        done: "0.3.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "P(heads) = 0.5 for a fair coin. What is P(tails)?",
            answers: ["0.5"],
            why: "$1 - 0.5$.",
            retry: {
              prompt: "P(snow) = 0.08. What is P(no snow)?",
              answers: ["0.92"],
              why: "$1 - 0.08$.",
            },
          },
          {
            prompt: "P(red) = 0.3, P(blue) = 0.25, the rest green. What is P(green)?",
            answers: ["0.45"],
            why: "$1 - 0.55$.",
            retry: {
              prompt: "P(red) = 0.15, P(blue) = 0.6, the rest green. What is P(green)?",
              answers: ["0.25"],
              why: "$1 - 0.75$.",
            },
          },
          {
            prompt: "The probabilities of all the outcomes add to",
            options: ["1", "0", "100"],
            answers: ["1"],
            why: "Something must happen.",
            retry: {
              prompt: "P(A) = $\\frac25$. What is P(not A)?",
              options: ["$\\frac35$", "$\\frac25$", "$\\frac15$"],
              answers: ["$\\frac35$"],
              why: "$1 - \\frac25$.",
            },
          },
        ],
      },
    ],
  },
];
