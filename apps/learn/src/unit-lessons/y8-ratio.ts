// Year 8, "Ratio and proportion", as three short lessons, one just before each skill: ratios as
// fractions of the whole and as straight lines through the origin; direct proportion by finding
// one first; and its graph and equation, y = kx. Each starts from something quick, builds the
// idea a step at a time, names the common mistakes, and ends on an exit check.
import type { Picture, UnitLesson } from "./types.ts";

const FRACTIONS = "Y8-RAT-02";
const UNITARY = "Y8-RAT-04.a";
const GRAPH = "Y8-RAT-04.b";

const paint: Picture = {
  kind: "graph",
  range: { xMin: 0, xMax: 5, yMin: 0, yMax: 15 },
  lines: [{ m: 3, c: 0 }],
  points: [
    { x: 1, y: 3 },
    { x: 2, y: 6 },
    { x: 4, y: 12 },
  ],
};

export const y8Ratio: UnitLesson[] = [
  {
    unit: "y8-ratio",
    id: "y8-ratio/fractions",
    before: FRACTIONS,
    title: "Ratios and fractions",
    summary: "A ratio's parts are fractions of the whole, and make a line through zero.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Squash",
        text: [
          "A bottle says: mix squash with water in the ratio 1 : 4. Ella says that means a quarter of the drink is squash.",
          "Is she right? And how does the amount of water grow with the squash? By the end of this lesson, you'll know.",
        ],
        picture: {
          kind: "bars",
          rows: [
            { label: "Squash", parts: 1 },
            { label: "Water", parts: 4 },
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "In the ratio 2 : 3, how many parts are there in all?",
        answers: ["5"],
        hint: "Add the parts.",
        done: "$2 + 3 = 5$ parts.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Simplify $\\frac{2}{10}$",
        options: [
          { text: "$\\frac15$", correct: true, feedback: "Divide top and bottom by 2." },
          { text: "$\\frac12$", feedback: "2 out of 10 is much less than a half." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Ratios are fractions in disguise",
        text: [
          "In the ratio 2 : 3, there are 5 parts. A is $\\frac25$ of the **whole** and B is $\\frac35$.",
          "Comparing part with part instead: A is $\\frac23$ of B.",
        ],
        picture: {
          kind: "bars",
          rows: [
            { label: "A", parts: 2 },
            { label: "B", parts: 3 },
          ],
        },
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "A ratio as a graph",
        text: [
          "Paint mixed red : white = 1 : 3 needs 3 times as much white as red: white = 3 × red.",
          "Plot it, and you get a straight line through (0, 0). Every point on it is the same mix.",
        ],
        picture: paint,
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Boys and girls",
        problem: "Boys : girls = 3 : 5 in a club. What fraction are girls? How many girls per boy?",
        steps: [
          { line: "Parts: $3 + 5 = 8$", why: "The whole." },
          { line: "Girls: $\\frac58$ of the club", why: "Part over whole." },
          { line: "Girls per boy: $\\frac53$", why: "Part over part: girls = $\\frac53$ × boys." },
        ],
        done: "Fraction of the whole: over the total. Compared with the other: over that part.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Sand : cement = 4 : 1",
        start: "Concrete mix: sand : cement = 4 : 1",
        stages: [
          {
            prompt: "What fraction is cement?",
            options: [
              { text: "$\\frac15$", correct: true, feedback: "" },
              { text: "$\\frac14$", feedback: "There are 5 parts in all." },
            ],
            then: "Cement: $\\frac15$",
          },
          {
            prompt: "Sand = ? × cement",
            options: [
              { text: "4", correct: true, feedback: "" },
              { text: "$\\frac45$", feedback: "That's sand as a fraction of the whole." },
            ],
            then: "sand = 4 × cement",
          },
        ],
        done: "Its graph would be the line $y = 4x$.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Which point fits red : white = 1 : 3?",
        picture: paint,
        options: [
          { text: "(3, 9)", correct: true, feedback: "9 is 3 times 3: on the line." },
          { text: "(3, 6)", feedback: "6 is only twice 3: not the same mix." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Cats : dogs = 2 : 7. What fraction are dogs?",
        options: [
          { text: "$\\frac79$", correct: true, feedback: "7 parts out of 9." },
          { text: "$\\frac72$", feedback: "That compares dogs with cats." },
          { text: "$\\frac27$", feedback: "That's cats compared with dogs." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Blue : yellow = 1 : 2. Which equation links them?",
        options: [
          { text: "yellow = 2 × blue", correct: true, feedback: "Twice as much yellow." },
          { text: "blue = 2 × yellow", feedback: "Blue is the smaller part." },
          { text: "yellow = blue + 2", feedback: "Ratios multiply, not add." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "In 1 : 4, Ella says squash is $\\frac14$ of the drink. What's wrong?",
        options: [
          {
            text: "There are 5 parts: squash is $\\frac15$",
            correct: true,
            feedback:
              "$\\frac14$ compares squash with water. Of the whole drink, it's 1 part in 5.",
          },
          { text: "Nothing", feedback: "Count all the parts: 1 + 4." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Red : white = 1 : 3. Ola doubles the red from 2 litres to 4.",
        lines: [
          "2 litres red needs 6 litres white",
          "Add 2 litres red: 4 litres",
          "Add 2 litres white: 8 litres",
        ],
        wrong: 2,
        why: "The mix multiplies: 4 litres red needs $3 \\times 4 = 12$ litres white.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Squash and water, 1 : 4",
        text: "What fraction of the drink is squash?",
        options: [
          {
            text: "$\\frac15$",
            correct: true,
            feedback: "1 part squash out of 5 parts. Ella was comparing with the water.",
          },
          { text: "$\\frac14$", feedback: "There are 5 parts in all." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "A : B = 3 : 2. What fraction is A?",
            options: ["$\\frac35$", "$\\frac32$", "$\\frac23$"],
            answers: ["$\\frac35$"],
            why: "3 parts out of 5.",
            retry: {
              prompt: "A : B = 1 : 5. What fraction is B?",
              options: ["$\\frac56$", "$\\frac51$", "$\\frac15$"],
              answers: ["$\\frac56$"],
              why: "5 parts out of 6.",
            },
          },
          {
            prompt: "Flour : sugar = 2 : 1. Flour = ? × sugar",
            options: ["2", "$\\frac23$", "3"],
            answers: ["2"],
            why: "Twice as much flour.",
            retry: {
              prompt: "Water : juice = 5 : 1. Water = ? × juice",
              options: ["5", "$\\frac56$", "6"],
              answers: ["5"],
              why: "Five times as much water.",
            },
          },
          {
            prompt: "The graph of a ratio like y = 3x goes through",
            options: ["(0, 0)", "(0, 3)", "(3, 0)"],
            answers: ["(0, 0)"],
            why: "None of one means none of the other.",
            retry: {
              prompt: "A mix in a fixed ratio makes a graph that is",
              options: ["a straight line through (0, 0)", "a curve", "flat"],
              answers: ["a straight line through (0, 0)"],
              why: "y = kx.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-ratio",
    id: "y8-ratio/find-one",
    before: UNITARY,
    title: "Find one first",
    summary: "In direct proportion, find the value for one, then scale up.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Pancakes for 6",
        text: [
          "A recipe for 4 people uses 300 g of flour. You're cooking for 6.",
          "Adding 2 more people doesn't mean adding 2 g. By the end of this lesson, you can scale any recipe.",
        ],
        picture: {
          kind: "table",
          head: ["People", "4", "1", "6"],
          rows: [["Flour (g)", "300", "?", "?"]],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $300 \\div 4$",
        answers: ["75"],
        hint: "Halve, then halve again.",
        done: "75.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "3 pens cost 90p. How much for 6 pens, in pence?",
        answers: ["180"],
        hint: "Twice as many pens.",
        done: "Double the pens, double the cost: 180p.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Direct proportion",
        text: [
          "Two amounts are in **direct proportion** if doubling one doubles the other, tripling triples it, halving halves it.",
          "The ratio between them never changes. So find the amount for **one**, then multiply.",
        ],
        picture: {
          kind: "table",
          head: ["Pens", "1", "3", "6"],
          rows: [["Cost", "30p", "90p", "180p"]],
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Pancakes for 6",
        problem: "300 g of flour feeds 4. How much for 6?",
        steps: [
          { line: "1 person: $300 \\div 4 = 75$ g", why: "Find one first." },
          { line: "6 people: $75 \\times 6 = 450$ g", why: "Then scale up." },
        ],
        done: "The **unitary method**: one, then many.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Find one first",
        start: "5 pens cost £3.40. How much do 8 cost?",
        stages: [
          {
            prompt: "Find the cost of 1 pen:",
            options: [
              { text: "£0.68", correct: true, feedback: "" },
              { text: "£17", feedback: "That multiplies. One pen costs less than five." },
            ],
            then: "1 pen: $£3.40 \\div 5 = £0.68$",
          },
          {
            prompt: "So 8 pens cost",
            options: [
              { text: "£5.44", correct: true, feedback: "" },
              { text: "£6.40", feedback: "$8 \\times £0.68$." },
            ],
            then: "8 pens: $8 \\times £0.68 = £5.44$",
          },
        ],
        done: "Find one, then scale up.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Best buy",
        start: "6 eggs for £1.50, or 10 eggs for £2.30. Which is better value?",
        stages: [
          {
            prompt: "Cost of 1 egg in the box of 6:",
            options: [
              { text: "25p", correct: true, feedback: "" },
              { text: "£9", feedback: "Divide: £1.50 ÷ 6." },
            ],
            then: "6 box: 25p each",
          },
          {
            prompt: "In the box of 10, one egg is 23p. Better value is",
            options: [
              { text: "the box of 10", correct: true, feedback: "" },
              { text: "the box of 6", feedback: "23p is cheaper than 25p per egg." },
            ],
            then: "Box of 10",
          },
        ],
        done: "Compare the price of one.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "4 tickets cost £26. How much for 7, in pounds?",
        answers: ["45.50"],
        wrong: [{ answer: "29", feedback: "Don't add 3: 1 ticket is $£26 \\div 4$." }],
        hint: "1 ticket: £6.50.",
        done: "$6.50 \\times 7 = £45.50$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A car uses 18 litres for 240 km. How many litres for 400 km?",
        answers: ["30"],
        unit: "litres",
        hint: "Litres for 1 km: $18 \\div 240$. Or for 80 km: 6.",
        done: "6 litres per 80 km, and 400 km is 5 lots: 30 litres.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "300 g for 4 people. Max says 6 people need 302 g. Why is that wrong?",
        options: [
          {
            text: "Proportion multiplies; it doesn't add",
            correct: true,
            feedback: "2 more people need 2 more shares of 75 g: 450 g.",
          },
          { text: "It isn't", feedback: "Each person needs 75 g, not 1 g." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "3 kg of apples cost £4.20. Pia finds the cost of 5 kg.",
        lines: ["1 kg: $3 \\div 4.20 = 0.71$", "5 kg: $5 \\times 0.71 = 3.57$", "So £3.57"],
        wrong: 0,
        why: "Divide the cost by the kilograms: £4.20 ÷ 3 = £1.40. So 5 kg is £7.00.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Pancakes for 6",
        text: "300 g of flour feeds 4. How much flour for 6 people?",
        answers: ["450"],
        unit: "g",
        wrong: [{ answer: "302", feedback: "Find 1 person first: 75 g." }],
        hint: "$300 \\div 4 \\times 6$.",
        done: "450 g.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "5 books cost £30. How much for 8?",
            options: ["£48", "£33", "£40"],
            answers: ["£48"],
            why: "£6 each.",
            retry: {
              prompt: "4 books cost £22. How much for 6?",
              options: ["£33", "£24", "£30"],
              answers: ["£33"],
              why: "£5.50 each.",
            },
          },
          {
            prompt: "200 g of oats for 5 bowls. Oats for 8 bowls?",
            options: ["320 g", "203 g", "250 g"],
            answers: ["320 g"],
            why: "40 g a bowl.",
            retry: {
              prompt: "150 g of rice for 3 people. Rice for 7?",
              options: ["350 g", "154 g", "300 g"],
              answers: ["350 g"],
              why: "50 g each.",
            },
          },
          {
            prompt: "Better value: 4 for £2.40 or 6 for £3.30?",
            options: ["6 for £3.30", "4 for £2.40", "the same"],
            answers: ["6 for £3.30"],
            why: "55p each beats 60p.",
            retry: {
              prompt: "Better value: 3 for £1.80 or 5 for £3.25?",
              options: ["3 for £1.80", "5 for £3.25", "the same"],
              answers: ["3 for £1.80"],
              why: "60p each beats 65p.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-ratio",
    id: "y8-ratio/graph",
    before: GRAPH,
    title: "Proportion graphs",
    summary: "Direct proportion is a straight line through (0, 0): y = kx.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Two phone plans",
        text: [
          "Plan A: 5p a minute. Plan B: £1 a month plus 3p a minute. Is the cost in direct proportion to the minutes?",
          "Only one of them is. By the end of this lesson, you can tell from the graph and from the equation.",
        ],
        picture: {
          kind: "table",
          head: ["Minutes", "0", "10", "20"],
          rows: [
            ["Plan A", "0p", "50p", "100p"],
            ["Plan B", "100p", "130p", "160p"],
          ],
        },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Apples are £2 a kg. 3 kg cost",
        options: [
          { text: "£6", correct: true, feedback: "$3 \\times 2$." },
          { text: "£5", feedback: "Multiply: $3 \\times 2$." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Where does $y = 2x$ cross the y-axis?",
        options: [
          { text: "(0, 0)", correct: true, feedback: "c = 0." },
          { text: "(0, 2)", feedback: "2 is the gradient; c is 0." },
        ],
      },
      {
        kind: "plot",
        tag: "Discover",
        title: "Plot the cost of apples",
        text: "Apples cost £2 a kilogram. Plot the cost for 0 to 4 kg.",
        scene: { range: { xMin: 0, xMax: 5, yMin: 0, yMax: 10 } },
        targets: [
          { x: 0, y: 0 },
          { x: 1, y: 2 },
          { x: 2, y: 4 },
          { x: 3, y: 6 },
          { x: 4, y: 8 },
        ],
        table: true,
        rule: { m: 2, c: 0 },
        hint: "Across to the kilograms, up to the cost.",
        done: "A straight line through (0, 0): that is direct proportion. Cost = 2 × kg.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "y = kx",
        text: [
          "Direct proportion is always $y = kx$: a straight line **through the origin**. k is the cost of one, the rate.",
          "If the line doesn't go through (0, 0), or isn't straight, it's not direct proportion.",
        ],
        picture: {
          kind: "graph",
          range: { xMin: 0, xMax: 5, yMin: 0, yMax: 10 },
          lines: [{ m: 2, c: 0 }],
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Find k",
        problem: "y is directly proportional to x. When x = 4, y = 10. Find y when x = 7.",
        steps: [
          { line: "$y = kx$", why: "Direct proportion." },
          { line: "$10 = k \\times 4$, so $k = 2.5$", why: "Use the pair you know." },
          { line: "$y = 2.5 \\times 7 = 17.5$", why: "Now use the equation." },
        ],
        done: "Find k, then use $y = kx$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Petrol",
        start: "Petrol cost is proportional to litres. 20 litres cost £30.",
        stages: [
          {
            prompt: "k, the cost of 1 litre, is",
            options: [
              { text: "£1.50", correct: true, feedback: "" },
              { text: "£0.67", feedback: "Cost ÷ litres: $30 \\div 20$." },
            ],
            then: "$C = 1.5L$",
          },
          {
            prompt: "So 35 litres cost",
            options: [
              { text: "£52.50", correct: true, feedback: "" },
              { text: "£45", feedback: "$1.5 \\times 35$." },
            ],
            then: "£52.50",
          },
        ],
        done: "$C = 1.5L$: a line through (0, 0) with gradient 1.5.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Which shows direct proportion?",
        options: [
          {
            text: "$y = 5x$",
            correct: true,
            feedback: "A straight line through the origin: double x, and y doubles.",
          },
          {
            text: "$y = 2x + 3$",
            feedback: "When x = 0, y = 3, not 0. Doubling x doesn't double y.",
          },
          { text: "$y = x^2$", feedback: "That curves: doubling x makes y four times as big." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "y = kx",
        text: "y is directly proportional to x. When x = 5, y = 15. What is y when x = 8?",
        answers: ["24"],
        wrong: [{ answer: "18", feedback: "That adds 3. Proportion multiplies: find k." }],
        hint: "$15 = k \\times 5$.",
        done: "$k = 3$, so $y = 24$.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Is it direct proportion?",
        text: "The more people who paint a fence, the less time it takes.",
        options: [
          {
            text: "No: one goes up as the other goes down",
            correct: true,
            feedback: "That is **inverse** proportion. In direct proportion, both go up together.",
          },
          { text: "Yes", feedback: "Double the painters and the time halves, not doubles." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "A taxi costs £3 plus £2 a mile. Is the fare directly proportional to the miles?",
        options: [
          {
            text: "No: at 0 miles it still costs £3",
            correct: true,
            feedback:
              "Straight, but not through (0, 0). 2 miles cost £7, but 4 miles cost £11, not £14.",
          },
          {
            text: "Yes: it's a straight line",
            feedback: "Straight isn't enough; it must go through (0, 0).",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "y is proportional to x, and y = 12 when x = 3. Rio finds y when x = 5.",
        lines: ["x went up by 2", "So y goes up by 2", "y = 14"],
        wrong: 1,
        why: "Proportion multiplies: k = 4, so y = 4 × 5 = 20.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Plan A: 5p a minute. Plan B: £1 plus 3p a minute",
        text: "Which plan's cost is directly proportional to the minutes?",
        options: [
          {
            text: "Plan A: $C = 5m$, through (0, 0)",
            correct: true,
            feedback: "Plan B starts at £1 (100p): $C = 3m + 100$ doesn't go through the origin.",
          },
          { text: "Plan B", feedback: "B costs £1 even for 0 minutes." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "y ∝ x, and y = 12 when x = 4. Find y when x = 10.",
            options: ["30", "18", "40"],
            answers: ["30"],
            why: "k = 3.",
            retry: {
              prompt: "y ∝ x, and y = 14 when x = 2. Find y when x = 5.",
              options: ["35", "17", "70"],
              answers: ["35"],
              why: "k = 7.",
            },
          },
          {
            prompt: "Which is direct proportion?",
            options: ["$y = 7x$", "$y = 7x + 1$", "$y = 7 - x$"],
            answers: ["$y = 7x$"],
            why: "y = kx, through (0, 0).",
            retry: {
              prompt: "Which of these is direct proportion?",
              options: ["$y = 0.5x$", "$y = x + 0.5$", "$y = x^2$"],
              answers: ["$y = 0.5x$"],
              why: "y = kx.",
            },
          },
          {
            prompt: "A direct proportion graph must",
            options: ["be straight and go through (0, 0)", "be straight", "go up"],
            answers: ["be straight and go through (0, 0)"],
            why: "Both are needed.",
            retry: {
              prompt: "Why is $y = 2x + 3$ not direct proportion?",
              options: ["It doesn't go through (0, 0)", "It isn't straight", "It goes up"],
              answers: ["It doesn't go through (0, 0)"],
              why: "c is 3, not 0.",
            },
          },
        ],
      },
    ],
  },
];
