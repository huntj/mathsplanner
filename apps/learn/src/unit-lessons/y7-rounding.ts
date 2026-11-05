// Year 7, "Rounding and estimating", as four short lessons, one just before each skill: rounding
// to decimal places, to significant figures, estimating by rounding, and error intervals. Each
// starts from something quick, builds the idea a step at a time on a number line, names the
// common mistakes, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const DP = "Y7-NPV-08.a";
const SF = "Y7-NPV-08.b";
const ESTIMATE = "Y7-NPV-09.a";
const ERROR = "Y7-NPV-09.b";

export const y7Rounding: UnitLesson[] = [
  {
    unit: "y7-rounding",
    id: "y7-rounding/decimal-places",
    before: DP,
    title: "Rounding to decimal places",
    summary: "Look at the next digit: 5 or more rounds up.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A long display",
        text: [
          "Splitting a £20 bill three ways, a calculator shows 6.666666667. You can't pay that.",
          "What should each person pay, to the nearest penny? By the end of this lesson, you can round it.",
        ],
        picture: { kind: "maths", tex: "20 \\div 3 = 6.666666667" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Round 47 to the nearest 10",
        answers: ["50"],
        hint: "Is it nearer 40 or 50?",
        done: "50.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Round 3.6 to the nearest whole number",
        answers: ["4"],
        hint: "Nearer 3 or 4?",
        done: "4.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Which is nearer?",
        text: [
          "Rounding 3.47 to 1 decimal place: it's between 3.4 and 3.5. Which is nearer?",
          "Look at the **next digit**, the 7: 5 or more means round up. So 3.5.",
        ],
        picture: {
          kind: "number-line",
          min: 3.4,
          max: 3.5,
          step: 0.01,
          every: 5,
          marks: [{ at: 3.47, label: "3.47" }],
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Round 2.83 to 1 decimal place",
        options: [
          {
            text: "2.8",
            correct: true,
            feedback: "The next digit is 3: less than 5, so round down.",
          },
          { text: "2.9", feedback: "3 is less than 5: stay at 2.8." },
          { text: "3", feedback: "1 decimal place keeps one digit after the point." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "6.666… to 2 decimal places",
        problem: "Round 6.666666667 to 2 decimal places.",
        steps: [
          { line: "Keep two digits after the point: 6.66|6…", why: "Mark where to cut." },
          { line: "The next digit is 6: 5 or more", why: "Round up." },
          { line: "6.67", why: "The last kept digit goes up by 1." },
        ],
        done: "£6.67.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Round 4.385 to 2 dp",
        start: "4.38|5",
        stages: [
          {
            prompt: "The next digit is 5, so",
            options: [
              { text: "round up: 4.39", correct: true, feedback: "" },
              { text: "round down: 4.38", feedback: "5 rounds up." },
            ],
            then: "4.39",
          },
        ],
        done: "5 or more: up.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Round 7.96 to 1 dp",
        start: "7.9|6",
        stages: [
          {
            prompt: "The 9 goes up by 1, so",
            options: [
              { text: "8.0", correct: true, feedback: "" },
              { text: "7.10", feedback: "9 + 1 = 10: carry into the ones, like 79 + 1 = 80." },
            ],
            then: "8.0",
          },
          {
            prompt: "Write it as",
            options: [
              { text: "8.0, keeping the 0", correct: true, feedback: "" },
              { text: "8", feedback: "1 dp shows one decimal place, even if it's 0." },
            ],
            then: "8.0",
          },
        ],
        done: "The 0 shows it's accurate to 1 dp.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Round 5.247 to 2 dp",
        answers: ["5.25"],
        wrong: [{ answer: "5.24", feedback: "The next digit, 7, rounds up." }],
        hint: "5.24|7.",
        done: "5.25.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Round 12.951 to 1 dp",
        answers: ["13.0"],
        wrong: [{ answer: "12.10", feedback: "9 + 1 carries: 13.0." }],
        hint: "12.9|51: the 9 rounds up.",
        done: "13.0.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Raj rounds 3.149 to 1 dp by rounding the 9 up first: 3.15, then 3.2. Is that right?",
        options: [
          {
            text: "No: only look at the next digit. 3.1|49 rounds to 3.1",
            correct: true,
            feedback: "Rounding in stages pushes numbers up wrongly. One look, one decision.",
          },
          { text: "Yes", feedback: "3.149 is nearer 3.1 than 3.2." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Mia rounds 0.0472 to 2 dp.",
        lines: [
          "Two digits after the point: 0.04|72",
          "The next digit is 7: round up",
          "So 0.04 becomes 0.5",
        ],
        wrong: 2,
        why: "The 4 hundredths go up to 5 hundredths: 0.05.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "A long display",
        text: "Round 6.666666667 to the nearest penny (2 dp).",
        answers: ["6.67"],
        wrong: [{ answer: "6.66", feedback: "The next digit is 6: round up." }],
        hint: "6.66|6.",
        done: "£6.67 each. (Three people at £6.67 is £20.01: one pays a penny less.)",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Round 4.73 to 1 dp.",
            answers: ["4.7"],
            why: "3 rounds down.",
            retry: { prompt: "Round 8.46 to 1 dp.", answers: ["8.5"], why: "6 rounds up." },
          },
          {
            prompt: "Round 2.996 to 2 dp.",
            answers: ["3.00"],
            why: "Round up and carry.",
            retry: {
              prompt: "Round 0.395 to 2 dp.",
              answers: ["0.40"],
              why: "Round up and carry.",
            },
          },
          {
            prompt: "Round 15.555 to 1 dp.",
            answers: ["15.6"],
            why: "The next digit is 5.",
            retry: {
              prompt: "Round 6.249 to 1 dp.",
              answers: ["6.2"],
              why: "The next digit is 4.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-rounding",
    id: "y7-rounding/significant-figures",
    before: SF,
    title: "Significant figures",
    summary: "Count from the first non-zero digit, and keep the number the right size.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A crowd",
        text: [
          "A newspaper reports a match crowd of 37 482 people. A headline wants a rounder number: '1 significant figure'.",
          "What should it say? By the end of this lesson, you can round any number to significant figures.",
        ],
        picture: { kind: "place-value", number: "37482", from: 4, to: 0, highlight: 4 },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Round 37 482 to the nearest 10 000",
        answers: ["40000", "40,000"],
        hint: "Nearer 30 000 or 40 000?",
        done: "40 000.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Round 0.68 to 1 dp",
        answers: ["0.7"],
        hint: "The 8 rounds up.",
        done: "0.7.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Significant figures",
        text: [
          "The first **significant figure** is the first digit that isn't 0. In 37 482 it's the 3 (ten thousands); in 0.0526 it's the 5 (hundredths).",
          "Round there, then **fill with zeros** so the number stays the right size.",
        ],
        picture: { kind: "maths", tex: "37\\,482 \\approx 40\\,000 \\quad (1 \\text{ s.f.})" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Round 4 671 to 1 significant figure",
        options: [
          {
            text: "5000",
            correct: true,
            feedback: "The first digit is the 4 thousands; the next digit, 6, rounds up.",
          },
          { text: "5", feedback: "Keep it the right size: fill with zeros." },
          { text: "4000", feedback: "The 6 rounds up." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "0.0526 to 2 s.f.",
        problem: "Round 0.0526 to 2 significant figures.",
        steps: [
          { line: "The first significant figure is the 5", why: "Zeros at the front don't count." },
          { line: "Two s.f.: 0.052|6", why: "The 5 and the 2." },
          {
            line: "The next digit is 6: round up to 0.053",
            why: "No zeros to fill after a decimal.",
          },
        ],
        done: "0.053.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Round 37 482 to 2 s.f.",
        start: "37|482",
        stages: [
          {
            prompt: "The next digit is 4, so",
            options: [
              { text: "round down: 37", correct: true, feedback: "" },
              { text: "round up: 38", feedback: "4 is less than 5." },
            ],
            then: "37…",
          },
          {
            prompt: "Fill with zeros:",
            options: [
              { text: "37 000", correct: true, feedback: "" },
              { text: "37", feedback: "It must stay about 37 thousand." },
            ],
            then: "37 000",
          },
        ],
        done: "37 000.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Round 0.00319 to 1 s.f.",
        start: "0.00319",
        stages: [
          {
            prompt: "The first significant figure is",
            options: [
              { text: "the 3", correct: true, feedback: "" },
              { text: "the first 0", feedback: "Zeros at the front just hold places." },
            ],
            then: "0.003|19",
          },
          {
            prompt: "Rounded:",
            options: [
              { text: "0.003", correct: true, feedback: "" },
              { text: "0.0032", feedback: "That's 2 s.f." },
            ],
            then: "0.003",
          },
        ],
        done: "0.003.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Round 8 349 to 1 s.f.",
        answers: ["8000", "8,000"],
        wrong: [{ answer: "8", feedback: "Fill with zeros: 8000." }],
        hint: "8|349.",
        done: "8000.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Round 0.0749 to 2 s.f.",
        answers: ["0.075"],
        hint: "0.074|9: the 9 rounds up.",
        done: "0.075.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Bea rounds 6 482 to 1 s.f. and writes 6. Is she right?",
        options: [
          {
            text: "No: 6000. The number must stay the same size",
            correct: true,
            feedback:
              "Forgetting the place-holding zeros is the commonest s.f. mistake: 6 isn't close to 6482!",
          },
          { text: "Yes", feedback: "6 is nowhere near 6482." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ben rounds 0.0408 to 1 s.f.",
        lines: [
          "The first digit is 0",
          "So the first significant figure is 0",
          "0.0408 rounds to 0",
        ],
        wrong: 1,
        why: "Leading zeros aren't significant. The first is the 4: 0.04.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "A crowd",
        text: "37 482 to 1 significant figure.",
        options: [
          { text: "40 000", correct: true, feedback: "'40 000 watch the match.'" },
          { text: "4", feedback: "Keep it the right size." },
          { text: "30 000", feedback: "The 7 rounds up." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Round 527 to 1 s.f.",
            answers: ["500"],
            why: "5|27.",
            retry: { prompt: "Round 862 to 1 s.f.", answers: ["900"], why: "8|62." },
          },
          {
            prompt: "Round 0.0381 to 1 s.f.",
            answers: ["0.04"],
            why: "The 8 rounds up.",
            retry: {
              prompt: "Round 0.0612 to 1 s.f.",
              answers: ["0.06"],
              why: "The 1 rounds down.",
            },
          },
          {
            prompt: "Round 45 260 to 2 s.f.",
            answers: ["45000", "45,000"],
            why: "45|260.",
            retry: {
              prompt: "Round 12 870 to 2 s.f.",
              answers: ["13000", "13,000"],
              why: "12|870.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-rounding",
    id: "y7-rounding/estimating",
    before: ESTIMATE,
    title: "Estimating",
    summary: "Round every number to 1 s.f. to get a quick check on any answer.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Is the bill right?",
        text: [
          "A school orders 29 calculators at £6.85 each. The invoice says £1986.50.",
          "Does that look right? By the end of this lesson, you can check it in your head.",
        ],
        picture: { kind: "maths", tex: "29 \\times 6.85 = 1986.50 \\; ?" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Round 29 to 1 s.f.",
        answers: ["30"],
        hint: "Nearer 20 or 30?",
        done: "30.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Round 6.85 to 1 s.f.",
        answers: ["7"],
        hint: "Nearer 6 or 7?",
        done: "7.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Round, then work it out",
        text: [
          "To **estimate**, round every number to 1 significant figure, then calculate in your head.",
          "$29 \\times 6.85 \\approx 30 \\times 7 = 210$. The symbol $\\approx$ means 'is about'.",
        ],
        picture: { kind: "maths", tex: "29 \\times 6.85 \\approx 30 \\times 7 = 210" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Estimate $41 \\times 19$",
        options: [
          { text: "About 800", correct: true, feedback: "$40 \\times 20$." },
          { text: "About 80", feedback: "$40 \\times 20 = 800$." },
          { text: "About 60", feedback: "That adds. Multiply." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A division",
        problem: "Estimate $\\frac{396 \\times 5.1}{19.8}$.",
        steps: [
          { line: "Round: $\\frac{400 \\times 5}{20}$", why: "Each to 1 s.f." },
          { line: "$= \\frac{2000}{20} = 100$", why: "Work it out." },
        ],
        done: "About 100. (Exactly: 102.)",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Estimate $\\frac{62 \\times 4.8}{0.49}$",
        start: "Round each to 1 s.f.",
        stages: [
          {
            prompt: "Rounded:",
            options: [
              { text: "$\\frac{60 \\times 5}{0.5}$", correct: true, feedback: "" },
              { text: "$\\frac{60 \\times 5}{0}$", feedback: "0.49 to 1 s.f. is 0.5, not 0." },
            ],
            then: "$\\frac{300}{0.5}$",
          },
          {
            prompt: "Dividing by 0.5 is",
            options: [
              { text: "doubling: 600", correct: true, feedback: "" },
              { text: "halving: 150", feedback: "How many halves in 300? 600." },
            ],
            then: "600",
          },
        ],
        done: "About 600.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Spotting a wrong answer",
        start: "Someone says $3.9 \\times 21 = 819$.",
        stages: [
          {
            prompt: "Estimate:",
            options: [
              { text: "$4 \\times 20 = 80$", correct: true, feedback: "" },
              { text: "$4 \\times 21 = 84$", feedback: "Round both: 20." },
            ],
            then: "About 80",
          },
          {
            prompt: "So 819 is",
            options: [
              { text: "wrong: 10 times too big", correct: true, feedback: "" },
              { text: "about right", feedback: "819 is ten times 80." },
            ],
            then: "It's 81.9",
          },
        ],
        done: "Estimates catch slips with the decimal point.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Estimate $7.8 \\times 51$",
        options: [
          { text: "About 400", correct: true, feedback: "$8 \\times 50$." },
          { text: "About 4000", feedback: "$8 \\times 50 = 400$." },
          { text: "About 60", feedback: "Multiply, not add." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Estimate $\\frac{298}{6.1}$",
        answers: ["50"],
        hint: "$\\frac{300}{6}$.",
        done: "About 50.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "To estimate $0.38 \\times 52$, Tom rounds 0.38 to 0. Is that sensible?",
        options: [
          {
            text: "No: to 1 s.f., 0.38 is 0.4, so about 20",
            correct: true,
            feedback:
              "Rounding small numbers to 0 throws everything away. Use significant figures, not whole numbers.",
          },
          { text: "Yes", feedback: "Then the estimate would be 0, which tells you nothing." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ava estimates $\\frac{81 \\times 3.2}{1.9}$.",
        lines: ["Round: $\\frac{80 \\times 3}{2}$", "$80 \\times 3 = 240$", "$240 \\div 2 = 480$"],
        wrong: 2,
        why: "$240 \\div 2 = 120$, not 480: she multiplied.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Is the bill right?",
        start: "29 calculators at £6.85; the invoice says £1986.50.",
        stages: [
          {
            prompt: "Estimate:",
            options: [
              { text: "$30 \\times 7 = £210$", correct: true, feedback: "" },
              { text: "$30 \\times 70 = £2100$", feedback: "£6.85 rounds to £7, not £70." },
            ],
            then: "About £210",
          },
          {
            prompt: "So the invoice is",
            options: [
              { text: "wrong: about 10 times too big", correct: true, feedback: "" },
              { text: "right", feedback: "£1986.50 is nearly 10 × £210." },
            ],
            then: "It should be £198.65",
          },
        ],
        done: "A 10-second estimate saved £1787.85!",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Estimate $19 \\times 31$.",
            options: ["600", "60", "6000"],
            answers: ["600"],
            why: "$20 \\times 30$.",
            retry: {
              prompt: "Estimate $49 \\times 21$.",
              options: ["1000", "100", "10 000"],
              answers: ["1000"],
              why: "$50 \\times 20$.",
            },
          },
          {
            prompt: "Estimate $\\frac{603}{2.9}$.",
            answers: ["200"],
            why: "$\\frac{600}{3}$.",
            retry: {
              prompt: "Estimate $\\frac{798}{4.1}$.",
              answers: ["200"],
              why: "$\\frac{800}{4}$.",
            },
          },
          {
            prompt: "Estimate $0.52 \\times 39$.",
            answers: ["20"],
            why: "$0.5 \\times 40$.",
            retry: {
              prompt: "Estimate $0.31 \\times 61$.",
              answers: ["18"],
              why: "$0.3 \\times 60$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-rounding",
    id: "y7-rounding/error-intervals",
    before: ERROR,
    title: "Error intervals",
    summary: "A rounded number could have been anything within half a step either side.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How tall, really?",
        text: [
          "A sign on a bridge says the clearance is 4 m, to the nearest metre. A lorry is 4.4 m tall.",
          "Is it safe? What could the clearance really be? By the end of this lesson, you can say.",
        ],
        picture: {
          kind: "number-line",
          min: 3,
          max: 5,
          step: 0.1,
          every: 5,
          interval: { from: 3.5, to: 4.5, fromClosed: true, toClosed: false },
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Round 4.4 to the nearest whole number",
        answers: ["4"],
        hint: "Nearer 4 or 5?",
        done: "4.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Round 3.5 to the nearest whole number",
        answers: ["4"],
        hint: "5 rounds up.",
        done: "4.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "What rounds to 4?",
        text: [
          "Every number from 3.5 up to (but not including) 4.5 rounds to 4. That's half a step either side.",
          "We write it as an **error interval**: $3.5 \\le x < 4.5$. 3.5 is in (≤); 4.5 isn't (<), as it rounds to 5.",
        ],
        picture: {
          kind: "number-line",
          min: 3,
          max: 5,
          step: 0.1,
          every: 5,
          interval: { from: 3.5, to: 4.5, fromClosed: true, toClosed: false },
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Which of these rounds to 4 (nearest whole number)?",
        options: [
          { text: "4.49", correct: true, feedback: "Just under 4.5." },
          { text: "4.5", feedback: "4.5 rounds up to 5." },
          { text: "3.49", feedback: "3.49 rounds to 3." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "To the nearest 10",
        problem: "A crowd is 70 to the nearest 10. Write the error interval for the number n.",
        steps: [
          { line: "Half a step: half of 10 is 5", why: "The rounding step is 10." },
          { line: "From $70 - 5 = 65$ up to $70 + 5 = 75$", why: "Either side." },
          { line: "$65 \\le n < 75$", why: "65 rounds to 70; 75 rounds to 80." },
        ],
        done: "$65 \\le n < 75$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "6.3 to 1 dp",
        start: "A length is 6.3 cm to 1 decimal place.",
        stages: [
          {
            prompt: "Half a step: the step is 0.1, so",
            options: [
              { text: "0.05", correct: true, feedback: "" },
              { text: "0.5", feedback: "Half of 0.1." },
            ],
            then: "± 0.05",
          },
          {
            prompt: "The error interval:",
            options: [
              { text: "$6.25 \\le l < 6.35$", correct: true, feedback: "" },
              { text: "$5.8 \\le l < 6.8$", feedback: "That's half a whole, not half of 0.1." },
            ],
            then: "$6.25 \\le l < 6.35$",
          },
        ],
        done: "Smaller steps, tighter intervals.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Which sign where?",
        start: "x is 9 to the nearest whole number: 8.5 and 9.5 are the ends.",
        stages: [
          {
            prompt: "8.5 rounds to 9, so it's",
            options: [
              { text: "included: $8.5 \\le x$", correct: true, feedback: "" },
              { text: "excluded: $8.5 < x$", feedback: "8.5 rounds up, to 9." },
            ],
            then: "$8.5 \\le x$",
          },
          {
            prompt: "9.5 rounds to 10, so it's",
            options: [
              { text: "excluded: $x < 9.5$", correct: true, feedback: "" },
              { text: "included", feedback: "9.5 rounds up to 10." },
            ],
            then: "$8.5 \\le x < 9.5$",
          },
        ],
        done: "≤ at the bottom, < at the top.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "m is 50 kg to the nearest 10 kg. The error interval is",
        options: [
          { text: "$45 \\le m < 55$", correct: true, feedback: "Half of 10 either side." },
          { text: "$40 \\le m < 60$", feedback: "That's a whole 10 either side. Use half: 5." },
          { text: "$49.5 \\le m < 50.5$", feedback: "That's for the nearest whole number." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "t is 2.7 s to 1 dp. What's the lower bound?",
        answers: ["2.65"],
        hint: "Take half of 0.1.",
        done: "2.65: $2.65 \\le t < 2.75$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "x = 8 to the nearest whole number. Kai writes $7.5 \\le x \\le 8.5$. What's wrong?",
        options: [
          {
            text: "8.5 rounds to 9, so it should be $< 8.5$",
            correct: true,
            feedback: "The top end is never included: it rounds up into the next value.",
          },
          { text: "Nothing", feedback: "Would 8.5 round to 8?" },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "A mass is 300 g to the nearest 100 g. Ivy writes its error interval.",
        lines: ["The step is 100 g", "Half a step is 50 g", "So $299.5 \\le m < 300.5$"],
        wrong: 2,
        why: "Go 50 g either side: $250 \\le m < 350$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "How tall, really?",
        start: "Clearance 4 m to the nearest metre. The lorry is 4.4 m.",
        stages: [
          {
            prompt: "Error interval for the clearance c:",
            options: [
              { text: "$3.5 \\le c < 4.5$", correct: true, feedback: "" },
              { text: "$4 \\le c < 5$", feedback: "Half a metre either side of 4." },
            ],
            then: "$3.5 \\le c < 4.5$",
          },
          {
            prompt: "Is a 4.4 m lorry safe?",
            options: [
              {
                text: "Not necessarily: the bridge could be as low as 3.5 m",
                correct: true,
                feedback: "",
              },
              {
                text: "Yes, 4.4 is less than 4.5",
                feedback: "The clearance could be anything down to 3.5 m.",
              },
            ],
            then: "Not safe to assume",
          },
        ],
        done: "That's why real signs round down and show exact heights.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "n = 6 to the nearest whole number. The error interval is",
            options: ["$5.5 \\le n < 6.5$", "$5 \\le n < 7$", "$5.5 \\le n \\le 6.5$"],
            answers: ["$5.5 \\le n < 6.5$"],
            why: "Half either side; top excluded.",
            retry: {
              prompt: "n = 12 to the nearest whole number. The error interval is",
              options: ["$11.5 \\le n < 12.5$", "$11 \\le n < 13$", "$11.5 \\le n \\le 12.5$"],
              answers: ["$11.5 \\le n < 12.5$"],
              why: "Half either side; top excluded.",
            },
          },
          {
            prompt: "d = 80 m to the nearest 10 m. What is the lower bound?",
            answers: ["75"],
            why: "80 − 5.",
            retry: {
              prompt: "d = 40 m to the nearest 10 m. What is the upper bound?",
              answers: ["45"],
              why: "40 + 5.",
            },
          },
          {
            prompt: "w = 3.4 kg to 1 dp. What is the lower bound?",
            answers: ["3.35"],
            why: "3.4 − 0.05.",
            retry: {
              prompt: "w = 5.8 kg to 1 dp. What is the upper bound?",
              answers: ["5.85"],
              why: "5.8 + 0.05.",
            },
          },
        ],
      },
    ],
  },
];
