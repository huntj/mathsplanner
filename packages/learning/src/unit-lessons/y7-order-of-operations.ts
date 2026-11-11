// Year 7, "Order of operations", as four short lessons, one just before each skill: brackets and
// the order of +, −, × and ÷, powers and roots in the order, reciprocals, and using a calculator
// sensibly. Each starts from something quick, builds the idea a step at a time, names the common
// mistakes, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const BRACKETS = "Y7-NPV-05.a";
const POWERS = "Y7-NPV-05.b";
const RECIPROCALS = "Y7-NPV-05.c";
const CALCULATOR = "Y7-NPV-10";

export const y7OrderOfOperations: UnitLesson[] = [
  {
    unit: "y7-order-of-operations",
    id: "y7-order-of-operations/brackets",
    before: BRACKETS,
    title: "Which comes first?",
    summary: "Brackets first, then × and ÷, then + and −.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Two answers?",
        text: [
          "Ali and Ben both work out $2 + 3 \\times 4$. Ali gets 20; Ben gets 14.",
          "They can't both be right. Who is? By the end of this lesson, you'll know why everyone agrees on one answer.",
        ],
        picture: { kind: "maths", tex: "2 + 3 \\times 4 = \\; ?" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3 \\times 4$?",
        answers: ["12"],
        hint: "Three fours.",
        done: "12.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $5 + 12$?",
        answers: ["17"],
        hint: "Count on.",
        done: "17.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Why × comes first",
        text: [
          "$3 \\times 4$ is short for $4 + 4 + 4$. So $2 + 3 \\times 4$ is $2 + 4 + 4 + 4 = 14$.",
          "Multiplying is a bundle of adding, so it's done first. Everyone follows the same order, so everyone gets the same answer.",
        ],
        picture: { kind: "maths", tex: "2 + \\underbrace{3 \\times 4}_{12} = 14" },
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The order",
        text: [
          "**Brackets** first. Then **× and ÷**, left to right. Then **+ and −**, left to right.",
          "Brackets change the order on purpose: $(2 + 3) \\times 4 = 20$.",
        ],
        picture: { kind: "maths", tex: "(2 + 3) \\times 4 = 20" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "$20 - 4 \\times 3 + 2$",
        problem: "Work out $20 - 4 \\times 3 + 2$.",
        steps: [
          { line: "$4 \\times 3 = 12$", why: "Multiply first." },
          { line: "$20 - 12 + 2$", why: "Rewrite with the answer in place." },
          { line: "$= 8 + 2 = 10$", why: "Then + and −, left to right." },
        ],
        done: "10.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$(6 + 4) \\div 2$",
        start: "$(6 + 4) \\div 2$",
        stages: [
          {
            prompt: "First:",
            options: [
              { text: "the bracket: $6 + 4 = 10$", correct: true, feedback: "" },
              { text: "$4 \\div 2 = 2$", feedback: "Brackets come before everything." },
            ],
            then: "$10 \\div 2$",
          },
          {
            prompt: "Then:",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "8", feedback: "That's $6 + 4 \\div 2$, without the bracket." },
            ],
            then: "5",
          },
        ],
        done: "The bracket made the adding happen first.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$12 \\div 4 \\times 3$",
        start: "$12 \\div 4 \\times 3$",
        stages: [
          {
            prompt: "× and ÷ are equal partners, so go",
            options: [
              { text: "left to right: $12 \\div 4 = 3$ first", correct: true, feedback: "" },
              { text: "× first: $4 \\times 3$", feedback: "× doesn't beat ÷: left to right." },
            ],
            then: "$3 \\times 3$",
          },
          {
            prompt: "So",
            options: [
              { text: "9", correct: true, feedback: "" },
              { text: "1", feedback: "That did × first. Left to right gives 9." },
            ],
            then: "9",
          },
        ],
        done: "Same level: left to right.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Work out $5 + 6 \\times 2$",
        answers: ["17"],
        wrong: [{ answer: "22", feedback: "Multiply first: $6 \\times 2$." }],
        hint: "× before +.",
        done: "$5 + 12 = 17$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Work out $3 \\times (8 - 5) + 1$",
        answers: ["10"],
        wrong: [{ answer: "20", feedback: "Bracket first: $8 - 5 = 3$." }],
        hint: "Bracket, then ×, then +.",
        done: "$3 \\times 3 + 1 = 10$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Kim works out $10 - 2 \\times 3$ as $8 \\times 3 = 24$. Is she right?",
        options: [
          {
            text: "No: × first, $10 - 6 = 4$",
            correct: true,
            feedback: "Working left to right regardless is the most common mistake.",
          },
          {
            text: "Yes: left to right",
            feedback: "Left to right is only for operations at the same level.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Sam works out $18 - 6 \\div 2$.",
        lines: ["$18 - 6 = 12$", "$12 \\div 2 = 6$", "So the answer is 6"],
        wrong: 0,
        why: "Divide first: $6 \\div 2 = 3$, then $18 - 3 = 15$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Two answers?",
        text: "$2 + 3 \\times 4$: Ali got 20, Ben got 14.",
        options: [
          {
            text: "Ben: multiply first, $2 + 12 = 14$",
            correct: true,
            feedback: "Ali added first. He'd need a bracket: $(2 + 3) \\times 4 = 20$.",
          },
          { text: "Ali", feedback: "Ali worked left to right. × comes before +." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Work out $4 + 5 \\times 3$.",
            answers: ["19"],
            why: "$4 + 15$.",
            retry: { prompt: "Work out $7 + 2 \\times 6$.", answers: ["19"], why: "$7 + 12$." },
          },
          {
            prompt: "Work out $(9 - 3) \\times 2$.",
            answers: ["12"],
            why: "$6 \\times 2$.",
            retry: {
              prompt: "Work out $(4 + 1) \\times 6$.",
              answers: ["30"],
              why: "$5 \\times 6$.",
            },
          },
          {
            prompt: "Work out $20 - 12 \\div 4$.",
            answers: ["17"],
            why: "$20 - 3$.",
            retry: { prompt: "Work out $15 - 8 \\div 2$.", answers: ["11"], why: "$15 - 4$." },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-order-of-operations",
    id: "y7-order-of-operations/powers",
    before: POWERS,
    title: "Powers and roots in the order",
    summary: "Powers and roots come after brackets, but before × and ÷.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A square patio",
        text: [
          "A patio is a 3 m by 3 m square with a 2 m by 2 m flowerbed cut out. The area left is $3^2 - 2^2$. Ella works it out as $(3 - 2)^2 = 1$.",
          "Is she right? By the end of this lesson, you'll know where powers fit in the order.",
        ],
        picture: { kind: "maths", tex: "3^2 - 2^2" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $5^2$?",
        answers: ["25"],
        wrong: [{ answer: "10", feedback: "$5^2 = 5 \\times 5$." }],
        hint: "$5 \\times 5$.",
        done: "25.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $\\sqrt{49}$?",
        answers: ["7"],
        hint: "What times itself is 49?",
        done: "$7 \\times 7 = 49$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Where powers go",
        text: [
          "A power is a bundle of multiplying: $3^2 = 3 \\times 3$. So it's done **before** × and ÷, after brackets.",
          "Brackets, then powers and roots, then × and ÷, then + and −. Some people remember **BIDMAS**.",
        ],
        picture: { kind: "maths", tex: "\\text{B} \\; \\text{I} \\; \\text{D M} \\; \\text{A S}" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "$2 \\times 3^2 =$",
        options: [
          { text: "18: $2 \\times 9$", correct: true, feedback: "Power first: $3^2 = 9$." },
          { text: "36: $6^2$", feedback: "That squares the 2 as well. Only the 3 is squared." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "$4 + 2 \\times 5^2$",
        problem: "Work out $4 + 2 \\times 5^2$.",
        steps: [
          { line: "$5^2 = 25$", why: "Powers first (no brackets)." },
          { line: "$2 \\times 25 = 50$", why: "Then multiply." },
          { line: "$4 + 50 = 54$", why: "Then add." },
        ],
        done: "54.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$(1 + 2)^2$",
        start: "$(1 + 2)^2$",
        stages: [
          {
            prompt: "Bracket first:",
            options: [
              { text: "$3^2$", correct: true, feedback: "" },
              { text: "$1 + 4$", feedback: "The bracket comes before the power." },
            ],
            then: "$3^2$",
          },
          {
            prompt: "So",
            options: [
              { text: "9", correct: true, feedback: "" },
              { text: "5", feedback: "That's $1 + 2^2$." },
            ],
            then: "9",
          },
        ],
        done: "The bracket goes first, then the power acts on all of it.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$20 - \\sqrt{16} \\times 3$",
        start: "$20 - \\sqrt{16} \\times 3$",
        stages: [
          {
            prompt: "Root first:",
            options: [
              { text: "$\\sqrt{16} = 4$", correct: true, feedback: "" },
              { text: "$20 - 16 = 4$", feedback: "Roots come before − and ×." },
            ],
            then: "$20 - 4 \\times 3$",
          },
          {
            prompt: "Then:",
            options: [
              { text: "$20 - 12 = 8$", correct: true, feedback: "" },
              { text: "$16 \\times 3 = 48$", feedback: "× before −." },
            ],
            then: "8",
          },
        ],
        done: "Roots sit with powers.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Work out $10 - 2^3$",
        answers: ["2"],
        wrong: [{ answer: "512", feedback: "That's $(10 - 2)^3$. Power first." }],
        hint: "$2^3 = 8$.",
        done: "$10 - 8 = 2$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Work out $3 \\times (4 + 1)^2$",
        answers: ["75"],
        wrong: [
          {
            answer: "225",
            feedback: "The power acts on the bracket only, not the 3: $3 \\times 25$.",
          },
        ],
        hint: "Bracket, power, then ×.",
        done: "$3 \\times 25 = 75$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Raj says $-3^2 = 9$. Is he right?",
        options: [
          {
            text: "No: the power goes first, so $-3^2 = -9$",
            correct: true,
            feedback: "Only the 3 is squared. $(-3)^2 = 9$ needs a bracket.",
          },
          { text: "Yes", feedback: "Without brackets, the square acts on the 3 alone." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo works out $5 \\times 2^2$.",
        lines: ["$5 \\times 2 = 10$", "$10^2 = 100$", "So it's 100"],
        wrong: 0,
        why: "Power first: $2^2 = 4$, then $5 \\times 4 = 20$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "A square patio",
        text: "$3^2 - 2^2$: Ella said $(3 - 2)^2 = 1$.",
        options: [
          {
            text: "$9 - 4 = 5$ m²: Ella was wrong",
            correct: true,
            feedback:
              "Powers before taking away. And it makes sense: 9 m² minus a 4 m² bed leaves 5 m².",
          },
          { text: "1 m²: Ella's right", feedback: "Ella took away first. The powers come first." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Work out $3 + 4^2$.",
            answers: ["19"],
            why: "$3 + 16$.",
            retry: { prompt: "Work out $2 + 3^2$.", answers: ["11"], why: "$2 + 9$." },
          },
          {
            prompt: "Work out $2 \\times 5^2$.",
            answers: ["50"],
            why: "$2 \\times 25$.",
            retry: { prompt: "Work out $3 \\times 4^2$.", answers: ["48"], why: "$3 \\times 16$." },
          },
          {
            prompt: "Work out $(6 - 2)^2$.",
            answers: ["16"],
            why: "$4^2$.",
            retry: { prompt: "Work out $(1 + 4)^2$.", answers: ["25"], why: "$5^2$." },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-order-of-operations",
    id: "y7-order-of-operations/reciprocals",
    before: RECIPROCALS,
    title: "Reciprocals",
    summary: "A number's reciprocal is 1 divided by it: the two multiply to 1.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Dividing made easy",
        text: [
          "Dividing by $\\frac25$ looks hard. But there's a number you can multiply by instead, that does exactly the same job.",
          "What is it? By the end of this lesson, you can find it for any number.",
        ],
        picture: { kind: "maths", tex: "6 \\div \\frac25 = 6 \\times \\; ?" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $\\frac12$ of 10?",
        answers: ["5"],
        hint: "Halve it.",
        done: "5.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $10 \\div 2$?",
        answers: ["5"],
        hint: "Halve it.",
        done: "5: the same as $10 \\times \\frac12$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Pairs that make 1",
        text: [
          "$2 \\times \\frac12 = 1$. $4 \\times \\frac14 = 1$. A number's **reciprocal** is what you multiply it by to get 1: 1 divided by the number.",
          "For a fraction, turn it upside down: the reciprocal of $\\frac23$ is $\\frac32$, since $\\frac23 \\times \\frac32 = 1$.",
        ],
        picture: {
          kind: "maths",
          tex: "5 \\times \\frac15 = 1 \\qquad \\frac23 \\times \\frac32 = 1",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "The reciprocal of 8 is",
        options: [
          { text: "$\\frac18$", correct: true, feedback: "$8 \\times \\frac18 = 1$." },
          { text: "−8", feedback: "That's the negative. The reciprocal multiplies to 1." },
          { text: "0.8", feedback: "$8 \\times 0.8 = 6.4$, not 1." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Dividing by multiplying",
        problem: "Work out $6 \\div \\frac13$.",
        steps: [
          {
            line: "How many thirds in 6? Each whole has 3",
            why: "Dividing asks 'how many go in'.",
          },
          { line: "$6 \\times 3 = 18$", why: "3 is the reciprocal of $\\frac13$." },
        ],
        done: "Dividing by a number is the same as multiplying by its reciprocal.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "The reciprocal of $\\frac34$",
        start: "$\\frac34$",
        stages: [
          {
            prompt: "Turn it upside down:",
            options: [
              { text: "$\\frac43$", correct: true, feedback: "" },
              { text: "$\\frac{3}{4}$ again", feedback: "Swap the top and the bottom." },
            ],
            then: "$\\frac43$",
          },
          {
            prompt: "Check: $\\frac34 \\times \\frac43 =$",
            options: [
              { text: "$\\frac{12}{12} = 1$ ✓", correct: true, feedback: "" },
              { text: "$\\frac{7}{7}$", feedback: "Multiply tops and bottoms." },
            ],
            then: "1 ✓",
          },
        ],
        done: "A fraction's reciprocal is the fraction flipped.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "The reciprocal of 0.5",
        start: "0.5",
        stages: [
          {
            prompt: "As a fraction, 0.5 is",
            options: [
              { text: "$\\frac12$", correct: true, feedback: "" },
              { text: "$\\frac15$", feedback: "0.5 is a half." },
            ],
            then: "$\\frac12$",
          },
          {
            prompt: "So its reciprocal is",
            options: [
              { text: "2", correct: true, feedback: "" },
              { text: "0.2", feedback: "Flip $\\frac12$: $\\frac21 = 2$." },
            ],
            then: "2",
          },
        ],
        done: "Change a decimal to a fraction, then flip.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "The reciprocal of 10",
        text: "Give a fraction or a decimal.",
        answers: ["1/10", "0.1"],
        hint: "$10 \\times ? = 1$.",
        done: "$\\frac{1}{10} = 0.1$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Work out $4 \\div \\frac14$",
        answers: ["16"],
        wrong: [
          {
            answer: "1",
            feedback: "That's $4 \\times \\frac14$. Dividing by a quarter: how many quarters in 4?",
          },
        ],
        hint: "Multiply by the reciprocal, 4.",
        done: "$4 \\times 4 = 16$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Jo says the reciprocal of 5 is −5. Is she right?",
        options: [
          {
            text: "No: it's $\\frac15$, because $5 \\times \\frac15 = 1$",
            correct: true,
            feedback:
              "The negative of 5 adds to 0; the reciprocal multiplies to 1. They're easy to mix up.",
          },
          { text: "Yes", feedback: "$5 \\times -5 = -25$, not 1." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ben finds the reciprocal of $\\frac25$.",
        lines: [
          "The reciprocal multiplies to 1",
          "Turn the fraction upside down",
          "So it's $\\frac{5}{2}$, which is $2.2$",
        ],
        wrong: 2,
        why: "$\\frac52 = 5 \\div 2 = 2.5$, not 2.2.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Dividing made easy",
        text: "$6 \\div \\frac25$: multiply by the reciprocal instead.",
        options: [
          {
            text: "$6 \\times \\frac52 = 15$",
            correct: true,
            feedback: "Flip $\\frac25$ to $\\frac52$, then multiply: $\\frac{30}{2} = 15$.",
          },
          {
            text: "$6 \\times \\frac25 = 2.4$",
            feedback: "That multiplies by the fraction itself. Flip it first.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The reciprocal of 4 is",
            options: ["$\\frac14$", "−4", "0.4"],
            answers: ["$\\frac14$"],
            why: "$4 \\times \\frac14 = 1$.",
            retry: {
              prompt: "The reciprocal of 7 is",
              options: ["$\\frac17$", "−7", "0.7"],
              answers: ["$\\frac17$"],
              why: "$7 \\times \\frac17 = 1$.",
            },
          },
          {
            prompt: "The reciprocal of $\\frac35$ is",
            options: ["$\\frac53$", "$\\frac35$", "$-\\frac35$"],
            answers: ["$\\frac53$"],
            why: "Flip it.",
            retry: {
              prompt: "The reciprocal of $\\frac27$ is",
              options: ["$\\frac72$", "$\\frac27$", "$-\\frac27$"],
              answers: ["$\\frac72$"],
              why: "Flip it.",
            },
          },
          {
            prompt: "Work out $3 \\div \\frac12$.",
            answers: ["6"],
            why: "$3 \\times 2$.",
            retry: {
              prompt: "Work out $5 \\div \\frac15$.",
              answers: ["25"],
              why: "$5 \\times 5$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-order-of-operations",
    id: "y7-order-of-operations/calculator",
    before: CALCULATOR,
    title: "Using a calculator well",
    summary: "Estimate first, key in carefully with brackets, and make sense of the display.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Sharing the cost",
        text: [
          "A class trip costs £385 for the coach plus £12.50 a ticket for 28 pupils, shared equally. Mia types $385 + 12.5 \\times 28 \\div 28$ and gets £397.50 each!",
          "What went wrong, and what's the real cost each? By the end of this lesson, you can use a calculator without being fooled.",
        ],
        picture: { kind: "maths", tex: "\\frac{385 + 12.5 \\times 28}{28}" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Round 387 to the nearest hundred",
        answers: ["400"],
        hint: "Is it nearer 300 or 400?",
        done: "400.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $(4 + 6) \\div 2$",
        answers: ["5"],
        hint: "Bracket first.",
        done: "$10 \\div 2 = 5$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Calculators follow the order",
        text: [
          "A calculator does × and ÷ before + and −, just like us. So to divide a whole sum, put it in **brackets**.",
          "$\\frac{20 + 10}{5}$ must be typed $(20 + 10) \\div 5$, not $20 + 10 \\div 5$.",
        ],
        picture: { kind: "maths", tex: "(20 + 10) \\div 5 = 6 \\qquad 20 + 10 \\div 5 = 22" },
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Estimate first",
        text: [
          "Round each number to 1 significant figure and work it out in your head. If the calculator's answer is far off, you mistyped.",
          "$\\frac{48.7 \\times 3.1}{9.8} \\approx \\frac{50 \\times 3}{10} = 15$.",
        ],
        picture: { kind: "maths", tex: "\\frac{48.7 \\times 3.1}{9.8} \\approx 15" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A money answer",
        problem: "Share £50 between 3 people with a calculator.",
        steps: [
          { line: "$50 \\div 3 = 16.666\\ldots$", why: "The display shows lots of digits." },
          { line: "Money has 2 decimal places: £16.67", why: "Round to the nearest penny." },
          {
            line: "But $3 \\times 16.67 = 50.01$",
            why: "So in real life, one person pays £16.66.",
          },
        ],
        done: "Interpret the display for the situation.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$\\frac{18 + 42}{12}$",
        start: "Type it so the calculator gets it right.",
        stages: [
          {
            prompt: "Key in",
            options: [
              { text: "$(18 + 42) \\div 12$", correct: true, feedback: "" },
              { text: "$18 + 42 \\div 12$", feedback: "That divides only the 42." },
            ],
            then: "$(18 + 42) \\div 12$",
          },
          {
            prompt: "The answer:",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "21.5", feedback: "That's what you get without the brackets." },
            ],
            then: "5",
          },
        ],
        done: "The fraction line acts like a bracket.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "How many coaches?",
        start: "130 people go on a trip; each coach holds 48. $130 \\div 48 = 2.708\\ldots$",
        stages: [
          {
            prompt: "How many coaches are needed?",
            options: [
              { text: "3", correct: true, feedback: "" },
              { text: "2.7", feedback: "You can't book 0.7 of a coach." },
              { text: "2", feedback: "2 coaches hold only 96 people." },
            ],
            then: "3 coaches",
          },
        ],
        done: "Round to suit the situation: here, up.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Work out $\\frac{36 + 54}{15}$",
        answers: ["6"],
        wrong: [{ answer: "39.6", feedback: "Divide the whole top: use brackets." }],
        hint: "$(36 + 54) \\div 15$.",
        done: "$90 \\div 15 = 6$.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Estimate $\\frac{61.2 \\times 4.9}{2.1}$",
        options: [
          { text: "About 150", correct: true, feedback: "$\\frac{60 \\times 5}{2} = 150$." },
          { text: "About 15", feedback: "$60 \\times 5 = 300$, then halve." },
          { text: "About 1500", feedback: "$300 \\div 2 = 150$." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Tia types $20 + 30 \\div 2$ to find the mean of 20 and 30, and gets 35. What's wrong?",
        options: [
          {
            text: "No brackets: she needs $(20 + 30) \\div 2 = 25$",
            correct: true,
            feedback:
              "The calculator divided only the 30. And 35 is bigger than both numbers: an estimate would catch it.",
          },
          { text: "Nothing", feedback: "The mean of 20 and 30 can't be 35." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Eggs come in boxes of 6. Ali needs 50 eggs.",
        lines: [
          "$50 \\div 6 = 8.33\\ldots$",
          "Round to the nearest whole number",
          "So he buys 8 boxes",
        ],
        wrong: 1,
        why: "8 boxes is only 48 eggs. He must round **up**: 9 boxes.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Sharing the cost",
        start: "£385 coach + 28 tickets at £12.50, shared by 28 pupils.",
        stages: [
          {
            prompt: "Type it as",
            options: [
              { text: "$(385 + 12.5 \\times 28) \\div 28$", correct: true, feedback: "" },
              {
                text: "$385 + 12.5 \\times 28 \\div 28$",
                feedback: "That's what Mia typed: it only divides the tickets.",
              },
            ],
            then: "$(385 + 350) \\div 28$",
          },
          {
            prompt: "Each pupil pays",
            options: [
              { text: "£26.25", correct: true, feedback: "" },
              { text: "£397.50", feedback: "That's Mia's mistake." },
            ],
            then: "£26.25",
          },
        ],
        done: "Estimate: $\\frac{400 + 300}{30} \\approx 23$. £26.25 is sensible; £397.50 isn't.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Work out $\\frac{25 + 15}{8}$.",
            answers: ["5"],
            why: "$40 \\div 8$.",
            retry: {
              prompt: "Work out $\\frac{17 + 31}{6}$.",
              answers: ["8"],
              why: "$48 \\div 6$.",
            },
          },
          {
            prompt: "100 pupils, minibuses hold 15. How many minibuses?",
            answers: ["7"],
            why: "$100 \\div 15 = 6.67$: round up.",
            retry: {
              prompt: "75 people, cars hold 4. How many cars?",
              answers: ["19"],
              why: "$75 \\div 4 = 18.75$: round up.",
            },
          },
          {
            prompt: "Estimate $\\frac{39.6 \\times 5.2}{1.9}$.",
            options: ["About 100", "About 10", "About 1000"],
            answers: ["About 100"],
            why: "$\\frac{40 \\times 5}{2} = 100$.",
            retry: {
              prompt: "Estimate $\\frac{29.8 \\times 4.1}{6.2}$.",
              options: ["About 20", "About 2", "About 200"],
              answers: ["About 20"],
              why: "$\\frac{30 \\times 4}{6} = 20$.",
            },
          },
        ],
      },
    ],
  },
];
