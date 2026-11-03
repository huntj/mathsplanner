// Year 7, "Calculating": the number toolkit. Hops on a number line for negatives, a pattern that
// shows why two negatives multiply to a positive, decimal places when multiplying, same-size
// parts for adding fractions, mixed numbers, and undoing a calculation with inverse operations.
import type { UnitLesson } from "./types.ts";

export const y7Calculating: UnitLesson = {
  unit: "y7-calculating",
  title: "The number toolkit",
  summary: "Hop, spot and undo your way through negatives, decimals and fractions.",
  screens: [
    {
      kind: "explain",
      title: "Adding and taking away are hops",
      text: [
        "On a number line, adding hops right and subtracting hops left.",
        "$2 - 5$ starts at 2 and hops 5 to the left, past 0, to land on $-3$.",
      ],
      picture: {
        kind: "number-line",
        min: -6,
        max: 6,
        step: 1,
        jumps: [{ from: 2, to: -3, label: "−5" }],
        marks: [
          { at: 2, label: "start" },
          { at: -3, label: "−3" },
        ],
      },
    },
    {
      kind: "place",
      title: "Where do you land?",
      text: "Start at the first number and hop.",
      line: { kind: "number-line", min: -8, max: 8, step: 1, every: 2 },
      targets: [
        { value: -4, label: "$3 - 7$", mark: "3 − 7" },
        { value: -5, label: "$-2 - 3$", mark: "−2 − 3" },
        { value: 3, label: "$-6 + 9$", mark: "−6 + 9" },
      ],
      hint: "Start at the first number. Subtracting hops left, adding hops right.",
      done: "$3 - 7 = -4$, $-2 - 3 = -5$ and $-6 + 9 = 3$.",
    },
    {
      kind: "choice",
      title: "Spot the pattern: what is $3 \\times -1$?",
      picture: {
        kind: "table",
        rows: [
          ["$3 \\times 2$", "$6$"],
          ["$3 \\times 1$", "$3$"],
          ["$3 \\times 0$", "$0$"],
          ["$3 \\times -1$", "?"],
        ],
      },
      options: [
        {
          text: "$-3$",
          correct: true,
          feedback:
            "Each answer goes down by 3, so after 0 comes −3. Positive × negative is negative.",
        },
        { text: "$3$", feedback: "Look down the answers: 6, 3, 0… they go down by 3 each time." },
        { text: "$-1$", feedback: "The answers go down by 3 each time, not by 1." },
      ],
    },
    {
      kind: "choice",
      title: "Now: what is $-3 \\times -1$?",
      picture: {
        kind: "table",
        rows: [
          ["$-3 \\times 2$", "$-6$"],
          ["$-3 \\times 1$", "$-3$"],
          ["$-3 \\times 0$", "$0$"],
          ["$-3 \\times -1$", "?"],
        ],
      },
      options: [
        {
          text: "$3$",
          correct: true,
          feedback:
            "The answers go up by 3: −6, −3, 0, 3. So two negatives multiply to a positive.",
        },
        { text: "$-3$", feedback: "Look down the answers: −6, −3, 0… they go up by 3 each time." },
        { text: "$-4$", feedback: "The pattern in the answers goes up by 3." },
      ],
    },
    {
      kind: "answer",
      title: "Work out $-4 \\times -5$",
      answers: ["20"],
      wrong: [{ answer: "-20", feedback: "Two negatives multiply to a positive." }],
      hint: "$4 \\times 5 = 20$. Then think about the signs.",
      done: "$-4 \\times -5 = 20$. Same signs give a positive; different signs give a negative.",
    },
    {
      kind: "steps",
      title: "A part of a part",
      start: "$0.3 \\times 0.2$",
      stages: [
        {
          prompt: "First, ignore the points. What is $3 \\times 2$?",
          options: [
            { text: "$6$", correct: true, feedback: "" },
            { text: "$5$", feedback: "That is $3 + 2$." },
            { text: "$32$", feedback: "Multiply: 3 lots of 2." },
          ],
          then: "$3 \\times 2 = 6$",
        },
        {
          prompt:
            "0.3 and 0.2 have one decimal place each, so the answer has two. So $0.3 \\times 0.2 =$",
          options: [
            { text: "$0.06$", correct: true, feedback: "" },
            { text: "$0.6$", feedback: "Count the decimal places: one each, so two in all." },
            {
              text: "$6$",
              feedback: "The answer must be smaller than 0.3: it is a part of a part.",
            },
          ],
          then: "$0.3 \\times 0.2 = 0.06$",
        },
      ],
      done: "0.3 of 0.2 is smaller than both. Multiply as whole numbers, then count the decimal places.",
    },
    {
      kind: "answer",
      title: "Work out $4.7 + 2.85$",
      answers: ["7.55"],
      wrong: [{ answer: "3.32", feedback: "Line up the decimal points, not the last digits." }],
      hint: "Line up the decimal points: write 4.7 as 4.70.",
      done: "$4.70 + 2.85 = 7.55$. Lining up the points lines up the columns.",
    },
    {
      kind: "shade",
      title: "Shade $\\frac{3}{4}$ of the grid",
      cols: 4,
      rows: 3,
      target: 9,
      hint: "Split the 12 squares into 4 equal groups of 3. Shade 3 of the groups.",
      done: "$\\frac14$ of 12 is 3, so $\\frac34$ of 12 is 9.",
    },
    {
      kind: "steps",
      title: "Adding fractions",
      picture: {
        kind: "bars",
        rows: [
          { label: "1/3", parts: 3, shaded: 1 },
          { label: "1/4", parts: 4, shaded: 1 },
        ],
      },
      start: "$\\frac{1}{3} + \\frac{1}{4}$",
      stages: [
        {
          prompt:
            "Thirds and quarters are different sizes. What is the smallest number 3 and 4 both go into?",
          options: [
            { text: "$12$", correct: true, feedback: "" },
            { text: "$7$", feedback: "7 is $3 + 4$. You need a number both divide into exactly." },
            { text: "$24$", feedback: "That works, but there is a smaller one." },
          ],
          then: "$= \\frac{4}{12} + \\frac{3}{12}$",
        },
        {
          prompt: "Now the parts are the same size: twelfths. Add them:",
          options: [
            { text: "$\\frac{7}{12}$", correct: true, feedback: "" },
            {
              text: "$\\frac{7}{24}$",
              feedback: "Only the number of parts adds. They are still twelfths.",
            },
            {
              text: "$\\frac{2}{7}$",
              feedback: "Never add the bottoms: they say what size the parts are.",
            },
          ],
          then: "$= \\frac{7}{12}$",
        },
      ],
      done: "To add fractions, make the parts the same size first, then add how many parts.",
    },
    {
      kind: "choice",
      title: "Work out $\\frac{2}{3} \\times \\frac{3}{5}$",
      options: [
        {
          text: "$\\frac{6}{15} = \\frac{2}{5}$",
          correct: true,
          feedback:
            "To multiply, multiply the tops and the bottoms: $\\frac{6}{15}$, which simplifies to $\\frac25$.",
        },
        { text: "$\\frac{5}{8}$", feedback: "That adds the tops and the bottoms. Multiply them." },
        { text: "$\\frac{10}{9}$", feedback: "That divides: you turned the second fraction over." },
      ],
    },
    {
      kind: "steps",
      title: "Two and a third",
      start: "$2\\frac{1}{3}$",
      stages: [
        {
          prompt: "How many thirds make 2 whole ones?",
          options: [
            { text: "$6$", correct: true, feedback: "" },
            { text: "$3$", feedback: "3 thirds make one whole. How many make two?" },
            { text: "$2$", feedback: "Each whole one is 3 thirds." },
          ],
          then: "$2 = \\frac{6}{3}$",
        },
        {
          prompt: "So $2\\frac13$ as an improper fraction is",
          options: [
            { text: "$\\frac{7}{3}$", correct: true, feedback: "" },
            { text: "$\\frac{6}{3}$", feedback: "Add on the extra third too." },
            { text: "$\\frac{3}{7}$", feedback: "That is upside down: there are 7 thirds." },
          ],
          then: "$2\\frac{1}{3} = \\frac{7}{3}$",
        },
      ],
      done: "A mixed number is whole ones and a fraction. Turn the whole ones into parts to make an improper fraction.",
    },
    {
      kind: "answer",
      title: "Work out $1\\frac{1}{2} + 2\\frac{1}{4}$",
      text: "Type a mixed number like 3 1/2, or a fraction like 7/2.",
      answers: ["3 3/4", "15/4", "3.75"],
      hint: "Add the whole ones (1 + 2), then the fractions: $\\frac12 = \\frac24$.",
      done: "$1 + 2 = 3$ and $\\frac24 + \\frac14 = \\frac34$, so the answer is $3\\frac34$.",
    },
    {
      kind: "answer",
      title: "Run the machine backwards",
      text: "A machine does × 4, then − 3. 25 came out. What went in?",
      answers: ["7"],
      wrong: [
        {
          answer: "97",
          feedback: "That runs the machine forwards. Undo it backwards: + 3, then ÷ 4.",
        },
        { answer: "5.5", feedback: "Undo the last step first: + 3 before ÷ 4." },
      ],
      hint: "Undo each step in reverse order: + undoes −, ÷ undoes ×.",
      done: "$25 + 3 = 28$ and $28 \\div 4 = 7$. Inverse operations undo each other.",
    },
    {
      kind: "fill",
      title: "One fact, more for free",
      template: "$7 \\times 8 = 56$, so $56 \\div 8 =$ [] and $56 \\div$ [] $= 8$",
      bank: ["$7$", "$8$", "$56$", "$64$"],
      answers: ["$7$", "$7$"],
      hint: "Division undoes multiplication: the 56 shares back into 7 eights.",
      done: "One multiplication fact gives two division facts.",
    },
    {
      kind: "explain",
      title: "Your number toolkit",
      text: [
        "Negatives: hop on the number line. Two negatives multiply to a positive.",
        "Decimals: line up the points to add; count decimal places to multiply.",
        "Fractions: same-size parts to add; tops × tops and bottoms × bottoms to multiply.",
        "Undo a calculation by doing the inverse steps in reverse order.",
      ],
    },
  ],
};
