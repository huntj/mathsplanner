// Year 8, "Standard form", as three short lessons, one just before each skill: writing huge and
// tiny numbers as a number from 1 to 10 times a power of ten, comparing them power first, and
// zooming in on a number line to find that numbers go on for ever, outwards and in between. Each
// starts from something quick, builds the idea a step at a time, names the common mistakes, and
// ends on an exit check.
import type { UnitLesson } from "./types.ts";

const WRITE = "Y8-NPV-01.a";
const COMPARE = "Y8-NPV-01.b";
const INFINITE = "Y8-NPV-02";

export const y8StandardForm: UnitLesson[] = [
  {
    unit: "y8-standard-form",
    id: "y8-standard-form/write",
    before: WRITE,
    title: "Too many zeros",
    summary: "Write huge and tiny numbers as a number from 1 to 10 times a power of 10.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The Sun and a bacterium",
        text: [
          "The Sun is about 150 000 000 km away. A bacterium is about 0.000002 m long.",
          "All those zeros are slow to write and easy to miscount. Scientists write them a shorter way. By the end of this lesson, so can you.",
        ],
        picture: {
          kind: "table",
          head: ["", "Size"],
          rows: [
            ["Sun's distance", "150 000 000 km"],
            ["Bacterium", "0.000002 m"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $10^3$",
        answers: ["1000"],
        wrong: [
          { answer: "30", feedback: "$10^3$ is $10 \\times 10 \\times 10$, not $10 \\times 3$." },
        ],
        hint: "Multiply three 10s together.",
        done: "$10^3 = 1000$: a 1 followed by three zeros.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $4.6 \\times 100$",
        answers: ["460"],
        wrong: [{ answer: "4600", feedback: "Times 100 moves the digits 2 places, not 3." }],
        hint: "Times 100 moves each digit 2 places bigger.",
        done: "$4.6 \\times 100 = 460$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Each power of 10 is one place",
        text: [
          "Times 10 moves every digit one place to the left. So $\\times 10^6$ moves the digits **6 places**.",
          "$4.6 \\times 10^6$: move 4.6 six places, filling the gaps with zeros, and you get 4 600 000.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{aligned} 4.6 \\times 10^1 &= 46 \\\\ 4.6 \\times 10^2 &= 460 \\\\ 4.6 \\times 10^6 &= 4\\,600\\,000 \\end{aligned}",
        },
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Standard form",
        text: [
          "**Standard form** writes a number as $A \\times 10^n$, where $A$ is **at least 1 and less than 10**.",
          "So there is exactly one digit before the point in $A$. That's what makes it *standard*: everyone writes it the same way.",
        ],
        picture: { kind: "maths", tex: "4\\,600\\,000 = 4.6 \\times 10^6" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Which could be the $A$ in standard form?",
        options: [
          {
            text: "$7.25$",
            correct: true,
            feedback: "At least 1 and less than 10: one digit before the point.",
          },
          { text: "$72.5$", feedback: "72.5 is more than 10." },
          { text: "$0.725$", feedback: "0.725 is less than 1." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Write 4 600 000 in standard form",
        problem: "Write 4 600 000 in standard form.",
        steps: [
          { line: "$A = 4.6$", why: "Put the point after the first digit, so A is from 1 to 10." },
          { line: "4.6 → 4 600 000 is 6 places", why: "Count how far the digits move." },
          { line: "$4\\,600\\,000 = 4.6 \\times 10^6$", why: "The power counts the places." },
        ],
        done: "Find A first, then count the places.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Write 37 000 in standard form",
        start: "$37\\,000$",
        stages: [
          {
            prompt: "First, find A:",
            options: [
              { text: "$3.7$", correct: true, feedback: "" },
              { text: "$37$", feedback: "A must be less than 10." },
            ],
            then: "$A = 3.7$",
          },
          {
            prompt: "How many places from 3.7 to 37 000?",
            options: [
              { text: "4", correct: true, feedback: "" },
              { text: "3", feedback: "37, 370, 3700, 37 000: that's four moves." },
            ],
            then: "$37\\,000 = 3.7 \\times 10^4$",
          },
        ],
        done: "$37\\,000 = 3.7 \\times 10^4$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Now a tiny one: 0.0052",
        start: "$0.0052$",
        stages: [
          {
            prompt: "Find A:",
            options: [
              { text: "$5.2$", correct: true, feedback: "" },
              { text: "$52$", feedback: "A must be less than 10." },
            ],
            then: "$A = 5.2$",
          },
          {
            prompt: "5.2 must shrink 3 places to make 0.0052. So the power is",
            options: [
              { text: "$-3$", correct: true, feedback: "" },
              {
                text: "$3$",
                feedback: "A positive power makes it bigger: 5200. This number is tiny.",
              },
            ],
            then: "$0.0052 = 5.2 \\times 10^{-3}$",
          },
        ],
        done: "Tiny numbers have **negative** powers: they count places to the right.",
      },
      {
        kind: "answer",
        tag: "Your turn",
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
        kind: "choice",
        tag: "Your turn",
        title: "Which is 0.00041 in standard form?",
        options: [
          {
            text: "$4.1 \\times 10^{-4}$",
            correct: true,
            feedback: "4.1 shrinks 4 places to make 0.00041.",
          },
          {
            text: "$4.1 \\times 10^{4}$",
            feedback: "A positive power makes a big number: 41 000. This number is tiny.",
          },
          { text: "$41 \\times 10^{-5}$", feedback: "It equals 0.00041, but 41 is more than 10." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Sam writes $45\\,000 = 45 \\times 10^3$. Is it in standard form?",
        options: [
          {
            text: "No: A must be less than 10. Write $4.5 \\times 10^4$",
            correct: true,
            feedback:
              "It's the right value, but not standard form. A needs one digit before the point.",
          },
          { text: "Yes: it equals 45 000", feedback: "It equals 45 000, but 45 is more than 10." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leah writes 0.0076 in standard form.",
        lines: ["$A = 7.6$", "The digits move 3 places", "$0.0076 = 7.6 \\times 10^{3}$"],
        wrong: 2,
        why: "$7.6 \\times 10^3$ is 7600. The number is tiny, so the power is negative: $7.6 \\times 10^{-3}$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The Sun is 150 000 000 km away",
        text: "Write it in standard form.",
        options: [
          {
            text: "$1.5 \\times 10^8$ km",
            correct: true,
            feedback: "1.5 moves 8 places to make 150 000 000.",
          },
          { text: "$15 \\times 10^7$ km", feedback: "Right value, but 15 is more than 10." },
          { text: "$1.5 \\times 10^7$ km", feedback: "That's 15 000 000. Count the places again." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Write 6 200 000 in standard form.",
            options: ["$6.2 \\times 10^6$", "$62 \\times 10^5$", "$6.2 \\times 10^5$"],
            answers: ["$6.2 \\times 10^6$"],
            why: "6.2 moves 6 places.",
            retry: {
              prompt: "Write 81 000 in standard form.",
              options: ["$8.1 \\times 10^4$", "$81 \\times 10^3$", "$8.1 \\times 10^3$"],
              answers: ["$8.1 \\times 10^4$"],
              why: "8.1 moves 4 places.",
            },
          },
          {
            prompt: "Write 0.003 in standard form.",
            options: ["$3 \\times 10^{-3}$", "$3 \\times 10^{3}$", "$0.3 \\times 10^{-2}$"],
            answers: ["$3 \\times 10^{-3}$"],
            why: "Tiny, so a negative power: 3 shrinks 3 places.",
            retry: {
              prompt: "Write 0.00027 in standard form.",
              options: ["$2.7 \\times 10^{-4}$", "$2.7 \\times 10^{4}$", "$27 \\times 10^{-5}$"],
              answers: ["$2.7 \\times 10^{-4}$"],
              why: "2.7 shrinks 4 places.",
            },
          },
          {
            prompt: "Which is in standard form?",
            options: ["$9.1 \\times 10^2$", "$91 \\times 10^1$", "$0.91 \\times 10^3$"],
            answers: ["$9.1 \\times 10^2$"],
            why: "Only 9.1 is from 1 to 10.",
            retry: {
              prompt: "Which of these is in standard form?",
              options: [
                "$1.06 \\times 10^{-2}$",
                "$10.6 \\times 10^{-3}$",
                "$0.106 \\times 10^{-1}$",
              ],
              answers: ["$1.06 \\times 10^{-2}$"],
              why: "Only 1.06 is from 1 to 10.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-standard-form",
    id: "y8-standard-form/compare",
    before: COMPARE,
    title: "Which is bigger?",
    summary: "Compare the powers first; only if they match, compare the numbers in front.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Earth and Mars",
        text: [
          "The Earth's mass is about $6.0 \\times 10^{24}$ kg. Mars is about $6.4 \\times 10^{23}$ kg.",
          "6.4 is bigger than 6.0, so is Mars heavier? By the end of this lesson, you can tell at a glance.",
        ],
        picture: {
          kind: "table",
          head: ["Planet", "Mass (kg)"],
          rows: [
            ["Earth", "$6.0 \\times 10^{24}$"],
            ["Mars", "$6.4 \\times 10^{23}$"],
          ],
        },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which is bigger?",
        options: [
          { text: "$10^4$", correct: true, feedback: "10 000 beats 1000." },
          { text: "$10^3$", feedback: "$10^3$ is 1000; $10^4$ is 10 000." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which is bigger?",
        options: [
          { text: "$3.2$", correct: true, feedback: "3.20 beats 3.15." },
          { text: "$3.15$", feedback: "Compare tenths: 2 tenths beats 1 tenth." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Write them out. Which is bigger?",
        text: "$9.9 \\times 10^3$ or $1.1 \\times 10^4$",
        options: [
          {
            text: "$1.1 \\times 10^4$ = 11 000",
            correct: true,
            feedback: "11 000 beats 9900, even though 1.1 is less than 9.9.",
          },
          { text: "$9.9 \\times 10^3$ = 9900", feedback: "9900 is less than 11 000." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The power matters most",
        text: [
          "In standard form A is always from 1 to 10, so it can never make up a whole extra power of 10.",
          "So compare the **powers first**. Only when the powers match, compare the numbers in front.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{aligned} 9.9 \\times 10^3 &= 9\\,900 \\\\ 1.1 \\times 10^4 &= 11\\,000 \\end{aligned}",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Negative powers: which is bigger?",
        text: "$2 \\times 10^{-3}$ or $5 \\times 10^{-4}$",
        options: [
          {
            text: "$2 \\times 10^{-3}$ = 0.002",
            correct: true,
            feedback: "0.002 beats 0.0005. −3 is a bigger power than −4.",
          },
          { text: "$5 \\times 10^{-4}$ = 0.0005", feedback: "0.0005 is smaller than 0.002." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Order them",
        problem:
          "Order $3.4 \\times 10^{5}$, $8 \\times 10^{4}$ and $2.9 \\times 10^{5}$, smallest first.",
        steps: [
          {
            line: "Smallest power: $8 \\times 10^4$",
            why: "Power 4 beats nothing here; it's the smallest.",
          },
          { line: "Two have power 5: compare 3.4 and 2.9", why: "The powers match, so look at A." },
          {
            line: "$8 \\times 10^4,\\ 2.9 \\times 10^5,\\ 3.4 \\times 10^5$",
            why: "2.9 is less than 3.4.",
          },
        ],
        done: "Powers first, then the numbers in front.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Which is bigger: $7 \\times 10^{-2}$ or $3 \\times 10^{-1}$?",
        start: "$7 \\times 10^{-2}$ and $3 \\times 10^{-1}$",
        stages: [
          {
            prompt: "Compare the powers. Which is bigger, −2 or −1?",
            options: [
              { text: "$-1$", correct: true, feedback: "" },
              { text: "$-2$", feedback: "−1 is higher up the number line than −2." },
            ],
            then: "$-1 > -2$",
          },
          {
            prompt: "So the bigger number is",
            options: [
              { text: "$3 \\times 10^{-1}$ = 0.3", correct: true, feedback: "" },
              { text: "$7 \\times 10^{-2}$ = 0.07", feedback: "0.07 is less than 0.3." },
            ],
            then: "$3 \\times 10^{-1}$ is bigger",
          },
        ],
        done: "With negative powers, the one nearer zero is bigger.",
      },
      {
        kind: "order",
        tag: "Together",
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
        tag: "Your turn",
        title: "Which is bigger?",
        options: [
          {
            text: "$4.2 \\times 10^{6}$",
            correct: true,
            feedback: "Same power, and 4.2 beats 3.9.",
          },
          { text: "$3.9 \\times 10^{6}$", feedback: "The powers match, so compare 4.2 and 3.9." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which is smallest?",
        options: [
          {
            text: "$8 \\times 10^{-5}$",
            correct: true,
            feedback: "−5 is the lowest power: 0.00008.",
          },
          { text: "$1 \\times 10^{-4}$", feedback: "That's 0.0001, bigger than 0.00008." },
          { text: "$5 \\times 10^{-3}$", feedback: "That's 0.005, the biggest of the three." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Zak says $8 \\times 10^{2}$ is bigger than $2 \\times 10^{3}$, because 8 is bigger than 2. Is he right?",
        options: [
          {
            text: "No: 800 is less than 2000. Compare powers first",
            correct: true,
            feedback: "The numbers in front only matter when the powers match.",
          },
          { text: "Yes", feedback: "Write them out: 800 and 2000." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ana compares $6 \\times 10^{-4}$ and $6 \\times 10^{-7}$.",
        lines: [
          "The numbers in front match",
          "So compare −4 and −7",
          "−7 is the bigger power, so $6 \\times 10^{-7}$ is bigger",
        ],
        wrong: 2,
        why: "−4 is bigger than −7. $6 \\times 10^{-4}$ = 0.0006 is bigger than 0.0000006.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Earth $6.0 \\times 10^{24}$ kg, Mars $6.4 \\times 10^{23}$ kg",
        text: "Which is heavier?",
        options: [
          {
            text: "Earth: its power is bigger",
            correct: true,
            feedback: "Power 24 beats 23. The Earth is almost 10 times as heavy as Mars.",
          },
          { text: "Mars: 6.4 beats 6.0", feedback: "Compare the powers first: 24 beats 23." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Which is bigger: $5 \\times 10^{3}$ or $2 \\times 10^{4}$?",
            options: ["$2 \\times 10^{4}$", "$5 \\times 10^{3}$"],
            answers: ["$2 \\times 10^{4}$"],
            why: "20 000 beats 5000.",
            retry: {
              prompt: "Which is bigger: $9 \\times 10^{5}$ or $1 \\times 10^{6}$?",
              options: ["$1 \\times 10^{6}$", "$9 \\times 10^{5}$"],
              answers: ["$1 \\times 10^{6}$"],
              why: "1 000 000 beats 900 000.",
            },
          },
          {
            prompt: "Which is bigger: $3 \\times 10^{-2}$ or $3 \\times 10^{-5}$?",
            options: ["$3 \\times 10^{-2}$", "$3 \\times 10^{-5}$"],
            answers: ["$3 \\times 10^{-2}$"],
            why: "−2 is nearer zero than −5: 0.03 beats 0.00003.",
            retry: {
              prompt: "Which is bigger: $4 \\times 10^{-6}$ or $4 \\times 10^{-3}$?",
              options: ["$4 \\times 10^{-3}$", "$4 \\times 10^{-6}$"],
              answers: ["$4 \\times 10^{-3}$"],
              why: "−3 is nearer zero than −6.",
            },
          },
          {
            prompt: "Which is bigger: $2.5 \\times 10^{7}$ or $2.05 \\times 10^{7}$?",
            options: ["$2.5 \\times 10^{7}$", "$2.05 \\times 10^{7}$"],
            answers: ["$2.5 \\times 10^{7}$"],
            why: "Same power; 2.5 beats 2.05.",
            retry: {
              prompt: "Which is bigger: $7.08 \\times 10^{2}$ or $7.8 \\times 10^{2}$?",
              options: ["$7.8 \\times 10^{2}$", "$7.08 \\times 10^{2}$"],
              answers: ["$7.8 \\times 10^{2}$"],
              why: "Same power; 7.8 beats 7.08.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-standard-form",
    id: "y8-standard-form/for-ever",
    before: INFINITE,
    title: "For ever",
    summary: "There's no biggest number, and always another number in between.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The biggest number",
        text: [
          "Mia says the biggest number is a googol, $10^{100}$. Theo says there's no biggest number at all.",
          "And between 0.35 and 0.36, is there anything? By the end of this lesson, you can settle both arguments.",
        ],
        picture: {
          kind: "maths",
          tex: "10^{100} = 1\\underbrace{000\\ldots0}_{100\\text{ zeros}}",
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $999 + 1$",
        answers: ["1000"],
        hint: "One more than 999.",
        done: "Adding 1 always gives a bigger number.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What number is halfway between 3 and 4?",
        answers: ["3.5"],
        hint: "Add them and halve: $(3 + 4) \\div 2$.",
        done: "3.5 is halfway.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "What is the biggest whole number?",
        options: [
          {
            text: "There isn't one",
            correct: true,
            feedback: "Whatever number you name, add 1 and you have a bigger one.",
          },
          { text: "A googol, $10^{100}$", feedback: "$10^{100} + 1$ is bigger still." },
        ],
      },
      {
        kind: "place",
        tag: "Discover",
        title: "Zoom in",
        text: "Is there a number between 0.3 and 0.4? Zoom in on the number line.",
        line: { kind: "number-line", min: 0.3, max: 0.4, step: 0.01, every: 5 },
        targets: [{ value: 0.35, label: "$0.35$" }],
        hint: "Each small step is 0.01. Count along from 0.3.",
        done: "There are lots of numbers between 0.3 and 0.4.",
      },
      {
        kind: "place",
        tag: "Discover",
        title: "Zoom in again",
        text: "Is there a number between 0.35 and 0.36?",
        line: { kind: "number-line", min: 0.35, max: 0.36, step: 0.001, every: 5 },
        targets: [{ value: 0.355, label: "$0.355$" }],
        hint: "Each small step is now 0.001.",
        done: "However close two numbers are, there is always another between them.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Find a number between",
        problem: "Find a number between 2.71 and 2.72.",
        steps: [
          { line: "$2.71 = 2.710$ and $2.72 = 2.720$", why: "Add a zero to make room." },
          { line: "$2.715$ is between them", why: "Halfway: add them and halve." },
        ],
        done: "Add another decimal place, and there's always room in between.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A fraction between $\\frac14$ and $\\frac12$",
        start: "$\\frac14$ and $\\frac12$",
        stages: [
          {
            prompt: "Write both as eighths:",
            options: [
              { text: "$\\frac28$ and $\\frac48$", correct: true, feedback: "" },
              {
                text: "$\\frac18$ and $\\frac28$",
                feedback: "$\\frac14 = \\frac28$ and $\\frac12 = \\frac48$.",
              },
            ],
            then: "$\\frac28$ and $\\frac48$",
          },
          {
            prompt: "So a fraction between them is",
            options: [
              { text: "$\\frac38$", correct: true, feedback: "" },
              { text: "$\\frac13$", feedback: "That works too, but use eighths: $\\frac38$." },
            ],
            then: "$\\frac38$",
          },
        ],
        done: "Smaller pieces always leave room for another fraction in between.",
      },
      {
        kind: "choice",
        tag: "Together",
        title: "Is there a biggest negative whole number?",
        options: [
          {
            text: "Yes: −1",
            correct: true,
            feedback: "−1 is the closest negative whole number to 0.",
          },
          { text: "No", feedback: "−1 is bigger than every other negative whole number." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Is there a smallest negative whole number?",
        options: [
          {
            text: "No: the integers go on for ever both ways",
            correct: true,
            feedback: "Name any one, take 1 away, and you have a smaller one.",
          },
          { text: "Yes: −1 000 000", feedback: "−1 000 001 is smaller still." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which number is between 0.7 and 0.71?",
        options: [
          { text: "$0.705$", correct: true, feedback: "0.700 < 0.705 < 0.710." },
          { text: "$0.75$", feedback: "0.75 is bigger than 0.71." },
          { text: "$0.07$", feedback: "0.07 is much smaller than 0.7." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Jo says 0.35 and 0.36 are next to each other, so nothing fits between. Is she right?",
        options: [
          {
            text: "No: 0.355, 0.351, 0.3599… fit between",
            correct: true,
            feedback:
              "Decimals and fractions never sit next to each other. There's always another between.",
          },
          { text: "Yes", feedback: "Zoom in: 0.355 is between them." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ben thinks about how many fractions lie between 0 and 1.",
        lines: [
          "$\\frac12$ lies between 0 and 1",
          "So does $\\frac14$, and $\\frac18$",
          "Eventually they run out",
        ],
        wrong: 2,
        why: "You can always halve again. There are **infinitely many** fractions between 0 and 1.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Mia and Theo",
        text: "Mia: the biggest number is a googol. Theo: there's no biggest number.",
        options: [
          {
            text: "Theo: a googol + 1 is bigger",
            correct: true,
            feedback:
              "There's no biggest number. And between 0.35 and 0.36 sits 0.355, and many more.",
          },
          { text: "Mia: nothing is bigger than a googol", feedback: "$10^{100} + 1$ is bigger." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "How many whole numbers are there?",
            options: ["Infinitely many", "A googol", "A billion"],
            answers: ["Infinitely many"],
            why: "You can always add 1.",
            retry: {
              prompt: "How many fractions lie between 0 and 1?",
              options: ["Infinitely many", "9", "100"],
              answers: ["Infinitely many"],
              why: "You can always halve again.",
            },
          },
          {
            prompt: "Which number is between 4.8 and 4.9?",
            options: ["4.85", "4.95", "4.08"],
            answers: ["4.85"],
            why: "4.80 < 4.85 < 4.90.",
            retry: {
              prompt: "Which number is between 1.26 and 1.27?",
              options: ["1.265", "1.275", "1.2"],
              answers: ["1.265"],
              why: "1.260 < 1.265 < 1.270.",
            },
          },
          {
            prompt: "Which fraction is between $\\frac13$ and $\\frac23$?",
            options: ["$\\frac12$", "$\\frac14$", "$\\frac34$"],
            answers: ["$\\frac12$"],
            why: "$\\frac26 < \\frac36 < \\frac46$.",
            retry: {
              prompt: "Which fraction is between $\\frac15$ and $\\frac25$?",
              options: ["$\\frac{3}{10}$", "$\\frac{1}{10}$", "$\\frac12$"],
              answers: ["$\\frac{3}{10}$"],
              why: "$\\frac{2}{10} < \\frac{3}{10} < \\frac{4}{10}$.",
            },
          },
        ],
      },
    ],
  },
];
