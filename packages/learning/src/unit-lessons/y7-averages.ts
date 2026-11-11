// Year 7, "Averages and range", as four short lessons, one just before each skill: the mean (share
// it out evenly), the median and mode, the range, and comparing two sets with an average and the
// range. Each starts from something quick, builds the idea a step at a time, names the common
// mistakes, and ends on an exit check.
import type { BarChartPic, UnitLesson } from "./types.ts";

const MEAN = "Y7-STA-01.a";
const MEDIAN = "Y7-STA-01.b";
const RANGE = "Y7-STA-01.c";
const COMPARE = "Y7-STA-01.d";

const chart = (values: number[], max = 10): BarChartPic => ({
  kind: "bar-chart",
  bars: values.map((value, i) => ({ label: String(i + 1), value })),
  max,
  step: 2,
});

export const y7Averages: UnitLesson[] = [
  {
    unit: "y7-averages",
    id: "y7-averages/mean",
    before: MEAN,
    title: "The mean",
    summary: "Add them all up and share equally: the mean.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Pocket money",
        text: [
          "Four friends get £4, £7, £5 and £8 pocket money. They say they get '£6 on average'.",
          "Are they right? By the end of this lesson, you can work out the mean.",
        ],
        picture: chart([4, 7, 5, 8]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $4 + 7 + 5 + 8$?",
        answers: ["24"],
        hint: "Add them up.",
        done: "24.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $24 \\div 4$?",
        answers: ["6"],
        hint: "Share between 4.",
        done: "6.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Levelling out",
        text: [
          "If the friends pooled their money and shared it equally, each would get the **mean**.",
          "Mean = the total ÷ how many there are. Here: $24 \\div 4 = 6$.",
        ],
        picture: chart([6, 6, 6, 6]),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Mean of 2, 5 and 8",
        options: [
          { text: "5", correct: true, feedback: "$15 \\div 3 = 5$." },
          { text: "15", feedback: "That's the total. Share it between 3." },
          { text: "7.5", feedback: "Divide by how many numbers there are: 3." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Test scores",
        problem: "Find the mean of 12, 15, 9, 14 and 10.",
        steps: [
          { line: "Total: $12 + 15 + 9 + 14 + 10 = 60$", why: "Add them all." },
          { line: "How many: 5", why: "Count them." },
          { line: "Mean: $60 \\div 5 = 12$", why: "Share it equally." },
        ],
        done: "12. It's between the smallest and biggest ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Mean of 3, 8, 4, 6, 9",
        start: "3, 8, 4, 6, 9",
        stages: [
          {
            prompt: "The total:",
            options: [
              { text: "30", correct: true, feedback: "" },
              { text: "29", feedback: "Add again: 3 + 8 + 4 + 6 + 9." },
            ],
            then: "30",
          },
          {
            prompt: "The mean:",
            options: [
              { text: "6", correct: true, feedback: "" },
              { text: "7.5", feedback: "There are 5 numbers." },
            ],
            then: "6",
          },
        ],
        done: "Total ÷ how many.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A decimal mean",
        start: "Mean of 4, 7, 7, 8.",
        stages: [
          {
            prompt: "Total:",
            options: [
              { text: "26", correct: true, feedback: "" },
              { text: "19", feedback: "Count the 7 twice." },
            ],
            then: "26",
          },
          {
            prompt: "Mean:",
            options: [
              { text: "6.5", correct: true, feedback: "" },
              { text: "6", feedback: "$26 \\div 4 = 6.5$." },
            ],
            then: "6.5",
          },
        ],
        done: "A mean needn't be one of the numbers, or even whole.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Mean of 10, 20, 30, 40",
        answers: ["25"],
        wrong: [{ answer: "100", feedback: "That's the total. Divide by 4." }],
        hint: "$100 \\div 4$.",
        done: "25.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Mean of 5, 1, 6, 2, 1",
        answers: ["3"],
        hint: "Total 15, five numbers.",
        done: "3.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "The mean of 2, 4 and 9: Jo adds and gets 15, then divides by 2. Is she right?",
        options: [
          {
            text: "No: there are 3 numbers, so $15 \\div 3 = 5$",
            correct: true,
            feedback: "Divide by how many numbers there are, not always 2.",
          },
          { text: "Yes", feedback: "There are three numbers." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Kai finds the mean of 6, 0, 3, 7.",
        lines: [
          "Total: $6 + 0 + 3 + 7 = 16$",
          "0 doesn't count, so 3 numbers",
          "Mean: $16 \\div 3 = 5.3$",
        ],
        wrong: 1,
        why: "0 is a value: there are 4 numbers. $16 \\div 4 = 4$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Pocket money",
        text: "£4, £7, £5 and £8. Is the average £6?",
        options: [
          {
            text: "Yes: the mean is $24 \\div 4 = £6$",
            correct: true,
            feedback: "Pooled and shared, they'd each get £6.",
          },
          { text: "No: it's £24", feedback: "£24 is the total." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Find the mean of 4, 6, 8.",
            answers: ["6"],
            why: "$18 \\div 3$.",
            retry: { prompt: "Find the mean of 3, 7, 11.", answers: ["7"], why: "$21 \\div 3$." },
          },
          {
            prompt: "Find the mean of 2, 3, 5, 6.",
            answers: ["4"],
            why: "$16 \\div 4$.",
            retry: {
              prompt: "Find the mean of 1, 4, 5, 10.",
              answers: ["5"],
              why: "$20 \\div 4$.",
            },
          },
          {
            prompt: "Find the mean of 1, 2, 2, 3.",
            answers: ["2"],
            why: "$8 \\div 4$.",
            retry: { prompt: "Find the mean of 5, 5, 6, 8.", answers: ["6"], why: "$24 \\div 4$." },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-averages",
    id: "y7-averages/median-mode",
    before: MEDIAN,
    title: "Median and mode",
    summary: "The median is the middle value in order; the mode is the most common.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A fair salary?",
        text: [
          "A small company pays its five staff £20k, £22k, £22k, £25k and £161k a year. The boss says the average pay is £50k.",
          "Is that fair? By the end of this lesson, you'll know other averages that tell a truer story.",
        ],
        picture: {
          kind: "bar-chart",
          bars: [
            { label: "A", value: 20 },
            { label: "B", value: 22 },
            { label: "C", value: 22 },
            { label: "D", value: 25 },
            { label: "E", value: 161 },
          ],
          max: 180,
          step: 20,
          axis: "£k",
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Put 7, 2, 9, 4, 5 in order. Which is in the middle?",
        answers: ["5"],
        hint: "2, 4, 5, 7, 9.",
        done: "5.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Which number appears most: 3, 6, 6, 1, 6, 3?",
        answers: ["6"],
        hint: "Count each.",
        done: "6 appears three times.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Median and mode",
        text: [
          "The **median** is the middle value when they're in order. The **mode** is the value that appears most often.",
          "With an even number of values, the median is halfway between the middle two.",
        ],
        picture: { kind: "maths", tex: "2, 4, \\boxed{5}, 7, 9" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "The median of 8, 3, 6",
        options: [
          { text: "6", correct: true, feedback: "In order: 3, 6, 8." },
          { text: "3", feedback: "Put them in order first: 3, 6, 8." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "An even number of values",
        problem: "Find the median of 9, 4, 7, 2, 10, 5.",
        steps: [
          { line: "In order: 2, 4, 5, 7, 9, 10", why: "Always order first." },
          { line: "Middle two: 5 and 7", why: "Six values: the 3rd and 4th." },
          { line: "Halfway: 6", why: "$(5 + 7) \\div 2$." },
        ],
        done: "Median 6. It needn't be one of the values.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "3, 8, 3, 5, 9, 3, 6",
        start: "3, 8, 3, 5, 9, 3, 6",
        stages: [
          {
            prompt: "The mode:",
            options: [
              { text: "3", correct: true, feedback: "" },
              { text: "9", feedback: "The mode is the most common, not the biggest." },
            ],
            then: "Mode 3",
          },
          {
            prompt: "In order: 3, 3, 3, 5, 6, 8, 9. The median:",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "6", feedback: "Seven values: the 4th." },
            ],
            then: "Median 5",
          },
        ],
        done: "Mode: most common. Median: middle in order.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "No single mode",
        start: "1, 2, 2, 4, 4, 7",
        stages: [
          {
            prompt: "Most common:",
            options: [
              { text: "2 and 4: two modes", correct: true, feedback: "" },
              { text: "none", feedback: "2 and 4 both appear twice." },
            ],
            then: "Modes 2 and 4",
          },
        ],
        done: "Sets can have more than one mode, or none.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "The median of 12, 4, 9, 15, 7",
        answers: ["9"],
        wrong: [{ answer: "4", feedback: "Order first: 4, 7, 9, 12, 15." }],
        hint: "Order them.",
        done: "9.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "The median of 3, 10, 6, 8",
        answers: ["7"],
        hint: "In order: 3, 6, 8, 10. Halfway between 6 and 8.",
        done: "7.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "For 7, 2, 9, Ali says the median is 2, the middle one written. Is he right?",
        options: [
          {
            text: "No: order first, 2, 7, 9, so the median is 7",
            correct: true,
            feedback: "Forgetting to order is the most common median mistake.",
          },
          { text: "Yes", feedback: "The median is the middle **in order**." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Eva finds the mode of 4, 9, 9, 2, 9, 4.",
        lines: ["9 appears 3 times", "4 appears 2 times", "So the mode is 3"],
        wrong: 2,
        why: "The mode is the **value**, 9, not how many times it appears.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "A fair salary?",
        start: "£20k, £22k, £22k, £25k, £161k.",
        stages: [
          {
            prompt: "The median:",
            options: [
              { text: "£22k", correct: true, feedback: "" },
              { text: "£25k", feedback: "Five values in order: the 3rd." },
            ],
            then: "£22k",
          },
          {
            prompt: "Which average fits most staff?",
            options: [
              { text: "The median, £22k", correct: true, feedback: "" },
              {
                text: "The mean, £50k",
                feedback:
                  "Only one person earns more than £25k: the mean is pulled up by the boss.",
              },
            ],
            then: "Median £22k",
          },
        ],
        done: "One huge value drags the mean; the median isn't fooled.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The median of 6, 2, 9, 4, 7?",
            answers: ["6"],
            why: "2, 4, 6, 7, 9.",
            retry: {
              prompt: "The median of 11, 3, 8, 5, 1?",
              answers: ["5"],
              why: "1, 3, 5, 8, 11.",
            },
          },
          {
            prompt: "The mode of 5, 3, 5, 2, 8, 5?",
            answers: ["5"],
            why: "Three 5s.",
            retry: { prompt: "The mode of 1, 7, 7, 4, 1, 7?", answers: ["7"], why: "Three 7s." },
          },
          {
            prompt: "The median of 2, 4, 6, 12?",
            answers: ["5"],
            why: "Halfway between 4 and 6.",
            retry: {
              prompt: "The median of 1, 3, 9, 11?",
              answers: ["6"],
              why: "Halfway between 3 and 9.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-averages",
    id: "y7-averages/range",
    before: RANGE,
    title: "The range",
    summary: "The range is the biggest take away the smallest: how spread out the data is.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Two archers",
        text: [
          "Two archers score: Amy 8, 9, 8, 9, 8 and Ben 10, 3, 10, 9, 10.",
          "Who is more consistent? By the end of this lesson, you can measure it.",
        ],
        picture: chart([8, 9, 8, 9, 8]),
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $10 - 3$?",
        answers: ["7"],
        hint: "Count up from 3.",
        done: "7.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "The biggest of 4, 12, 7, 9?",
        answers: ["12"],
        hint: "Look along them.",
        done: "12.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "How spread out?",
        text: [
          "The **range** is the biggest value take away the smallest. It measures how spread out the data is.",
          "A small range means the values are close together: consistent.",
        ],
        picture: {
          kind: "number-line",
          min: 0,
          max: 12,
          step: 1,
          every: 2,
          jumps: [{ from: 3, to: 10, label: "range 7" }],
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "The range of 4, 12, 7, 9",
        options: [
          { text: "8", correct: true, feedback: "$12 - 4$." },
          { text: "12", feedback: "That's the biggest. Take away the smallest." },
          { text: "5", feedback: "That's $12 - 7$. Use the smallest, 4." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Temperatures",
        problem: "Find the range of −3, 5, 2, −1, 7 °C.",
        steps: [
          { line: "Biggest: 7", why: "Highest." },
          { line: "Smallest: −3", why: "Lowest: furthest below zero." },
          { line: "$7 - (-3) = 10$", why: "Taking away a negative adds." },
        ],
        done: "10 degrees.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Range of 15, 22, 18, 30, 25",
        start: "15, 22, 18, 30, 25",
        stages: [
          {
            prompt: "Biggest and smallest:",
            options: [
              { text: "30 and 15", correct: true, feedback: "" },
              { text: "25 and 15", feedback: "30 is in there." },
            ],
            then: "30 − 15",
          },
          {
            prompt: "Range:",
            options: [
              { text: "15", correct: true, feedback: "" },
              { text: "45", feedback: "Take away, don't add." },
            ],
            then: "15",
          },
        ],
        done: "15.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "One outlier",
        start: "2, 3, 3, 4, 50",
        stages: [
          {
            prompt: "Range:",
            options: [
              { text: "48", correct: true, feedback: "" },
              { text: "2", feedback: "Use the biggest, 50." },
            ],
            then: "48",
          },
        ],
        done: "One extreme value makes the range big: the range uses only two values.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Range of 6, 14, 9, 3, 11",
        answers: ["11"],
        hint: "$14 - 3$.",
        done: "11.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Range of −4, 2, −8, 5",
        answers: ["13"],
        wrong: [{ answer: "3", feedback: "$5 - (-8) = 13$." }],
        hint: "$5 - (-8)$.",
        done: "13.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "For 7, 3, 9, 4, Sam says the range is 3, the first minus the last. Is he right?",
        options: [
          {
            text: "No: biggest minus smallest, $9 - 3 = 6$",
            correct: true,
            feedback: "Use the biggest and smallest, wherever they are in the list.",
          },
          { text: "Yes", feedback: "The range uses the extremes." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo finds the range of 12, 5, 9, 20.",
        lines: [
          "Biggest: 20, smallest: 5",
          "Range: the values from 5 to 20",
          "So the range is 5 to 20",
        ],
        wrong: 1,
        why: "The range is one number: the difference, $20 - 5 = 15$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Two archers",
        start: "Amy 8, 9, 8, 9, 8; Ben 10, 3, 10, 9, 10.",
        stages: [
          {
            prompt: "Amy's range:",
            options: [
              { text: "1", correct: true, feedback: "" },
              { text: "9", feedback: "$9 - 8$." },
            ],
            then: "1",
          },
          {
            prompt: "Ben's range:",
            options: [
              { text: "7", correct: true, feedback: "" },
              { text: "10", feedback: "$10 - 3$." },
            ],
            then: "7",
          },
        ],
        done: "Amy is more consistent: a much smaller range.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Range of 4, 9, 2, 8?",
            answers: ["7"],
            why: "$9 - 2$.",
            retry: { prompt: "Range of 13, 6, 10, 21?", answers: ["15"], why: "$21 - 6$." },
          },
          {
            prompt: "Range of −2, 4, 1?",
            answers: ["6"],
            why: "$4 - (-2)$.",
            retry: { prompt: "Range of −5, 0, 3?", answers: ["8"], why: "$3 - (-5)$." },
          },
          {
            prompt: "A small range means the data is",
            options: ["consistent", "large", "spread out"],
            answers: ["consistent"],
            why: "Close together.",
            retry: {
              prompt: "A large range means the data is",
              options: ["spread out", "consistent", "small"],
              answers: ["spread out"],
              why: "Far apart.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-averages",
    id: "y7-averages/compare",
    before: COMPARE,
    title: "Comparing data",
    summary: "Compare an average (which is bigger?) and the range (which is more consistent?).",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Which team?",
        text: [
          "Two teams' points in five matches: Reds 12, 15, 14, 13, 16; Blues 20, 4, 18, 6, 22.",
          "Which team would you pick, and why? By the end of this lesson, you can back it up with maths.",
        ],
        picture: {
          kind: "table",
          head: ["Reds", "Blues"],
          rows: [
            ["12", "20"],
            ["15", "4"],
            ["14", "18"],
            ["13", "6"],
            ["16", "22"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Mean of 12, 15, 14, 13, 16",
        answers: ["14"],
        hint: "Total 70.",
        done: "14.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Range of 12, 15, 14, 13, 16",
        answers: ["4"],
        hint: "$16 - 12$.",
        done: "4.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Two comparisons",
        text: [
          "Compare an **average**: which is bigger on the whole? Then the **range**: which is more consistent?",
          "Always say what it means in context: 'The Reds score more on average and are more consistent.'",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{array}{c} \\text{average: how big} \\\\ \\text{range: how spread} \\end{array}",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Class A: mean 62, range 30. Class B: mean 68, range 10. Which did better overall?",
        options: [
          {
            text: "Class B: higher mean",
            correct: true,
            feedback: "And more consistent: smaller range.",
          },
          {
            text: "Class A: bigger range",
            feedback: "A bigger range means more spread out, not better.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Two shops",
        problem:
          "Shop X's daily sales: mean £200, range £50. Shop Y: mean £180, range £120. Compare them.",
        steps: [
          { line: "Average: X sells more on average (£200 > £180)", why: "Compare the means." },
          { line: "Range: X is more consistent (£50 < £120)", why: "Compare the ranges." },
        ],
        done: "Two comparisons, each in context.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Two plants",
        start: "Heights, cm: Plant A median 20, range 4. Plant B median 24, range 12.",
        stages: [
          {
            prompt: "On average,",
            options: [
              { text: "B is taller", correct: true, feedback: "" },
              { text: "A is taller", feedback: "24 > 20." },
            ],
            then: "B taller",
          },
          {
            prompt: "More consistent:",
            options: [
              { text: "A: smaller range", correct: true, feedback: "" },
              { text: "B: bigger range", feedback: "Bigger range means less consistent." },
            ],
            then: "A more consistent",
          },
        ],
        done: "One wins on average, the other on consistency.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Which average?",
        start: "House prices in a street: £200k, £210k, £215k, £220k, £1.2m.",
        stages: [
          {
            prompt: "The best average to describe a typical house:",
            options: [
              { text: "the median: £215k", correct: true, feedback: "" },
              { text: "the mean", feedback: "The £1.2m mansion drags the mean up." },
            ],
            then: "Median",
          },
        ],
        done: "With an extreme value, the median is fairer.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title:
          "Runner P: mean time 12.1 s, range 0.4 s. Runner Q: mean 11.8 s, range 1.5 s. Who is faster on average?",
        options: [
          {
            text: "Q: a lower mean time",
            correct: true,
            feedback: "In a race, lower times are better.",
          },
          { text: "P: a higher mean", feedback: "Higher times are slower." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "And who is more consistent?",
        options: [
          { text: "P: smaller range", correct: true, feedback: "0.4 s against 1.5 s." },
          { text: "Q", feedback: "Q's range is bigger." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Mia says Team Y is better because its range is bigger. Is she right?",
        options: [
          {
            text: "No: a bigger range just means less consistent",
            correct: true,
            feedback:
              "The range tells you about spread, not about who is better. Use an average for that.",
          },
          { text: "Yes", feedback: "A bigger range means more spread, not higher scores." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Kim compares two classes: A mean 70, range 15; B mean 65, range 25.",
        lines: [
          "A has the higher mean",
          "So A did better on average",
          "B has a bigger range, so B is more consistent",
        ],
        wrong: 2,
        why: "A bigger range means **less** consistent. A is more consistent too.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Which team?",
        start: "Reds: mean 14, range 4. Blues: 20, 4, 18, 6, 22.",
        stages: [
          {
            prompt: "Blues' mean:",
            options: [
              { text: "14", correct: true, feedback: "" },
              { text: "17.5", feedback: "Total 70, five matches." },
            ],
            then: "14: the same as the Reds",
          },
          {
            prompt: "Blues' range:",
            options: [
              { text: "18: much less consistent", correct: true, feedback: "" },
              { text: "4", feedback: "$22 - 4$." },
            ],
            then: "18",
          },
        ],
        done: "Same average, but the Reds are far more consistent: pick the Reds.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Which tells you which set is more consistent?",
            options: ["the range", "the mean", "the mode"],
            answers: ["the range"],
            why: "It measures spread.",
            retry: {
              prompt: "Which tells you which set is bigger on the whole?",
              options: ["an average", "the range", "the biggest value"],
              answers: ["an average"],
              why: "Mean, median or mode.",
            },
          },
          {
            prompt: "Set A range 3, set B range 9. Which is more consistent?",
            options: ["A", "B"],
            answers: ["A"],
            why: "Smaller range.",
            retry: {
              prompt: "Set A range 12, set B range 5. Which is more consistent?",
              options: ["B", "A"],
              answers: ["B"],
              why: "Smaller range.",
            },
          },
          {
            prompt: "With one very large value, the fairest average is usually",
            options: ["the median", "the mean", "the range"],
            answers: ["the median"],
            why: "It isn't dragged by extremes.",
            retry: {
              prompt: "Which average is pulled most by one extreme value?",
              options: ["the mean", "the median", "the mode"],
              answers: ["the mean"],
              why: "Every value adds to the total.",
            },
          },
        ],
      },
    ],
  },
];
