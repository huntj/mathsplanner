// Year 7, "Place value", as four short lessons, one just before each skill: what each digit is
// worth (in big numbers, decimals and measures), ordering whole numbers with negatives, ordering
// decimals and fractions, and the signs =, ≠, <, >, ≤ and ≥. Each starts from something quick,
// builds the idea a step at a time, names the common mistakes, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const VALUE = "Y7-NPV-01";
const INTEGERS = "Y7-NPV-02.a";
const DECIMALS = "Y7-NPV-02.b";
const SIGNS = "Y7-NPV-02.c";

export const y7PlaceValue: UnitLesson[] = [
  {
    unit: "y7-place-value",
    id: "y7-place-value/value",
    before: VALUE,
    title: "What's it worth?",
    summary: "Every digit's value depends on its column, in big numbers and in decimals.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A house price",
        text: [
          "A house sells for £1 250 000. Sam says the 2 is worth £2000.",
          "Is he right? By the end of this lesson, you can read what any digit is worth.",
        ],
        picture: { kind: "place-value", number: "1250000", from: 6, to: 0 },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is the 3 worth in 345?",
        answers: ["300"],
        wrong: [{ answer: "3", feedback: "It's in the hundreds column: 3 hundreds." }],
        hint: "Hundreds, tens, ones.",
        done: "300: three hundreds.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $45 \\times 10$?",
        answers: ["450"],
        hint: "Ten lots of 45.",
        done: "450.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Every digit has a home",
        text: [
          "Each column is worth 10 times the one to its right. So a digit's value depends on **which column** it's in.",
          "To the right of the decimal point, the columns keep going: tenths, then hundredths, each 10 times smaller.",
        ],
        picture: { kind: "place-value", number: "3045.27", from: 3, to: -2 },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "What is the 4 worth in 3045.27?",
        picture: { kind: "place-value", number: "3045.27", from: 3, to: -2, highlight: 1 },
        options: [
          { text: "40", correct: true, feedback: "It's in the tens column: 4 tens." },
          { text: "4", feedback: "It's one column left of the ones: tens." },
          { text: "4000", feedback: "The 3 is in the thousands column. The 4 is in the tens." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "What is the 7 worth in 3045.27?",
        picture: { kind: "place-value", number: "3045.27", from: 3, to: -2, highlight: -2 },
        options: [
          {
            text: "7 hundredths: 0.07",
            correct: true,
            feedback: "Two columns right of the point: hundredths.",
          },
          {
            text: "7 tenths: 0.7",
            feedback: "The first column after the point is tenths; the 7 is in the second.",
          },
          { text: "70", feedback: "It's after the decimal point, so it's less than 1." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Every digit in 52.68",
        picture: { kind: "place-value", number: "52.68", from: 1, to: -2 },
        problem: "What is each digit of 52.68 worth?",
        steps: [
          { line: "5 is in the tens: 50", why: "Two columns left of the point." },
          { line: "2 is in the ones: 2", why: "Just left of the point." },
          { line: "6 is in the tenths: 0.6", why: "Just right of the point." },
          { line: "8 is in the hundredths: 0.08", why: "Two right of the point." },
        ],
        done: "$50 + 2 + 0.6 + 0.08 = 52.68$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Times by 10",
        picture: { kind: "place-value", number: "3.45", from: 1, to: -2 },
        start: "$3.45 \\times 10$",
        stages: [
          {
            prompt: "Multiplying by 10 makes every digit worth 10 times as much. So every digit",
            options: [
              { text: "moves one column left", correct: true, feedback: "" },
              {
                text: "gets a zero on the end",
                feedback: "3.45 with a zero on the end is 3.450: the same number.",
              },
            ],
            then: "Each digit moves one column left.",
          },
          {
            prompt: "So $3.45 \\times 10 =$",
            options: [
              { text: "34.5", correct: true, feedback: "" },
              { text: "3.450", feedback: "That's still 3.45. The digits must move." },
              { text: "30.45", feedback: "Every digit moves, not just the 3." },
            ],
            then: "$34.5$",
          },
        ],
        done: "The digits move; the point stays put.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Divide by 100",
        start: "$620 \\div 100$",
        stages: [
          {
            prompt: "Dividing by 100 moves every digit",
            options: [
              { text: "two columns right", correct: true, feedback: "" },
              { text: "two columns left", feedback: "Dividing makes it smaller: right." },
              { text: "one column right", feedback: "100 is two tens: two columns." },
            ],
            then: "Two columns right.",
          },
          {
            prompt: "So $620 \\div 100 =$",
            options: [
              { text: "6.2", correct: true, feedback: "" },
              { text: "62", feedback: "That's ÷ 10. Go one more column." },
              { text: "0.62", feedback: "That's ÷ 1000." },
            ],
            then: "$6.2$",
          },
        ],
        done: "Check: $6.2 \\times 100 = 620$ ✓",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "What is the 6 worth in 2 064 300?",
        picture: { kind: "place-value", number: "2064300", from: 6, to: 0 },
        answers: ["60000", "60,000"],
        wrong: [{ answer: "6000", feedback: "Count the columns: the 6 is in the ten thousands." }],
        hint: "Ones, tens, hundreds, thousands, ten thousands…",
        done: "60 000: six ten-thousands.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "How many grams in 2.5 kg?",
        text: "There are 1000 g in 1 kg.",
        answers: ["2500"],
        unit: "g",
        wrong: [
          {
            answer: "2.5000",
            feedback: "Multiplying by 1000 moves the digits three columns left: 2500.",
          },
        ],
        hint: "$2.5 \\times 1000$: three columns left.",
        done: "$2.5 \\times 1000 = 2500$ g.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Jay says $3.4 \\times 10 = 3.40$, because times 10 adds a zero. Is he right?",
        options: [
          {
            text: "No: it's 34. The digits move, the point doesn't",
            correct: true,
            feedback: "'Add a zero' only works for whole numbers. 3.40 is the same as 3.4.",
          },
          {
            text: "Yes",
            feedback: "3.40 is just 3.4 written differently. Ten times bigger is 34.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Kai works out $2.5 \\times 100$.",
        lines: ["Times 100 means two columns", "So add two zeros", "$2.5 \\times 100 = 2.500$"],
        wrong: 1,
        why: "The digits move two columns left: 2.5 becomes 250. Adding zeros after a decimal changes nothing.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "A house price",
        text: "In £1 250 000, what is the 2 worth?",
        picture: { kind: "place-value", number: "1250000", from: 6, to: 0, highlight: 5 },
        options: [
          {
            text: "£200 000",
            correct: true,
            feedback: "It's in the hundred-thousands column. Sam was out by 100 times.",
          },
          {
            text: "£2000",
            feedback: "Count the columns from the right: the 2 is the sixth digit.",
          },
          { text: "£20 000", feedback: "One more column: hundred thousands." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "What is the 5 worth in 4 523 000?",
            answers: ["500000", "500,000"],
            why: "Hundred thousands.",
            retry: {
              prompt: "What is the 3 worth in 6 031 000?",
              answers: ["30000", "30,000"],
              why: "Ten thousands.",
            },
          },
          {
            prompt: "Work out $0.47 \\times 100$.",
            answers: ["47"],
            why: "Two columns left.",
            retry: {
              prompt: "Work out $5.6 \\times 10$.",
              answers: ["56"],
              why: "One column left.",
            },
          },
          {
            prompt: "In 8.315, the 1 is worth",
            options: ["0.01", "0.1", "10"],
            answers: ["0.01"],
            why: "Hundredths.",
            retry: {
              prompt: "In 2.794, the 9 is worth",
              options: ["0.09", "0.9", "9"],
              answers: ["0.09"],
              why: "Hundredths.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-place-value",
    id: "y7-place-value/negatives",
    before: INTEGERS,
    title: "Below zero",
    summary: "Order whole numbers, including negatives, using a number line.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The coldest city",
        text: [
          "One winter morning: Moscow −12 °C, London 3 °C, Oslo −5 °C, Paris 0 °C.",
          "Which city was coldest, and can you put them in order? By the end of this lesson, you can.",
        ],
        picture: { kind: "number-line", min: -15, max: 5, step: 1, every: 5 },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which is bigger: 12 or 21?",
        options: [
          { text: "21", correct: true, feedback: "2 tens is more than 1 ten." },
          { text: "12", feedback: "Compare the tens first: 2 tens beats 1 ten." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "It's 2 °C and the temperature drops by 5 degrees. What is it now?",
        answers: ["-3", "−3"],
        unit: "°C",
        hint: "Count down from 2: 1, 0, −1, …",
        done: "−3 °C: below zero.",
      },
      {
        kind: "place",
        tag: "Discover",
        title: "Below zero",
        text: "Numbers below zero are negative. Tap where each one goes.",
        line: { kind: "number-line", min: -6, max: 6, step: 1 },
        targets: [
          { value: -2, label: "$-2$" },
          { value: 4, label: "$4$" },
          { value: -5, label: "$-5$" },
        ],
        hint: "Negative numbers go to the left of 0.",
        done: "Left is smaller, right is bigger, and negatives are left of 0.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Which is smaller: −5 or −2?",
        picture: {
          kind: "number-line",
          min: -6,
          max: 6,
          step: 1,
          marks: [
            { at: -5, label: "−5" },
            { at: -2, label: "−2" },
          ],
        },
        options: [
          { text: "−5", correct: true, feedback: "It's further left: colder, smaller." },
          {
            text: "−2",
            feedback: "−2 is further right, so it's bigger. 5 below zero is colder than 2 below.",
          },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Further left is smaller",
        text: [
          "On a number line, numbers get bigger to the right. So −5 < −2, even though 5 > 2.",
          "The further a negative number is from 0, the **smaller** it is.",
        ],
        picture: {
          kind: "number-line",
          min: -6,
          max: 6,
          step: 1,
          marks: [
            { at: -5, label: "−5" },
            { at: -2, label: "−2" },
          ],
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Order −3, 4, −7, 0, 1",
        picture: {
          kind: "number-line",
          min: -8,
          max: 5,
          step: 1,
          marks: [{ at: -7 }, { at: -3 }, { at: 0 }, { at: 1 }, { at: 4 }],
        },
        problem: "Put −3, 4, −7, 0 and 1 in order, smallest first.",
        steps: [
          {
            line: "Negatives first: −7 is further from 0, so it's smaller than −3",
            why: "Furthest left first.",
          },
          { line: "Then 0, then the positives: 1, 4", why: "Zero sits between." },
          { line: "−7, −3, 0, 1, 4", why: "Read left to right." },
        ],
        done: "Smallest first is left to right on the number line.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Order −1, −8, 2",
        start: "Smallest first.",
        stages: [
          {
            prompt: "The smallest is",
            options: [
              { text: "−8", correct: true, feedback: "" },
              { text: "−1", feedback: "−8 is further below zero: smaller." },
            ],
            then: "−8 first",
          },
          {
            prompt: "Then",
            options: [
              { text: "−1, then 2", correct: true, feedback: "" },
              { text: "2, then −1", feedback: "Any negative is smaller than any positive." },
            ],
            then: "−8, −1, 2",
          },
        ],
        done: "Left to right.",
      },
      {
        kind: "order",
        tag: "Together",
        title: "Smallest to largest",
        items: ["$-9$", "$-4$", "$0$", "$3$", "$7$"],
        first: "smallest",
        last: "largest",
        hint: "The negative furthest from zero is smallest.",
        done: "−9, −4, 0, 3, 7.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Which is the smallest: −6, −10, −2?",
        answers: ["-10", "−10"],
        wrong: [
          { answer: "-2", feedback: "−2 is closest to zero, so it's the biggest of the three." },
        ],
        hint: "Furthest below zero.",
        done: "−10: furthest left.",
      },
      {
        kind: "order",
        tag: "Your turn",
        title: "Coldest to warmest",
        items: ["$-15$", "$-11$", "$-1$", "$6$"],
        first: "coldest",
        last: "warmest",
        hint: "Coldest is furthest below zero.",
        done: "−15, −11, −1, 6.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Ella says −8 is bigger than −3, because 8 is bigger than 3. Is she right?",
        options: [
          {
            text: "No: −8 is further below zero, so it's smaller",
            correct: true,
            feedback:
              "With negatives, the bigger the number after the minus, the smaller it is. 8 degrees below zero is colder.",
          },
          { text: "Yes", feedback: "−8 is to the left of −3 on the number line." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo orders −2, 5, −6, 0, smallest first.",
        lines: ["Negatives come first", "−2, then −6", "Then 0, then 5"],
        wrong: 1,
        why: "−6 is further below zero than −2, so it comes first: −6, −2, 0, 5.",
      },
      {
        kind: "order",
        tag: "Back to the problem",
        title: "Coldest to warmest",
        text: "Moscow −12 °C, London 3 °C, Oslo −5 °C, Paris 0 °C.",
        items: ["Moscow, $-12$", "Oslo, $-5$", "Paris, $0$", "London, $3$"],
        first: "coldest",
        last: "warmest",
        hint: "The coldest is furthest below zero.",
        done: "Moscow was coldest: 12 degrees below zero.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Which is bigger: −4 or −9?",
            options: ["−4", "−9"],
            answers: ["−4"],
            why: "Closer to zero.",
            retry: {
              prompt: "Which is bigger: −7 or −1?",
              options: ["−1", "−7"],
              answers: ["−1"],
              why: "Closer to zero.",
            },
          },
          {
            prompt: "Which is the smallest: 2, −3, −11, 0?",
            answers: ["-11", "−11"],
            why: "Furthest below zero.",
            retry: {
              prompt: "Which is the smallest: −5, 1, −8, −2?",
              answers: ["-8", "−8"],
              why: "Furthest below zero.",
            },
          },
          {
            prompt: "It's −4 °C. Which is warmer?",
            options: ["−2 °C", "−6 °C"],
            answers: ["−2 °C"],
            why: "Closer to zero is warmer.",
            retry: {
              prompt: "It's −3 °C. Which is colder?",
              options: ["−7 °C", "−1 °C"],
              answers: ["−7 °C"],
              why: "Further below zero is colder.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-place-value",
    id: "y7-place-value/decimals",
    before: DECIMALS,
    title: "Ordering decimals",
    summary: "Compare decimals column by column, and fractions by changing them to decimals.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Who jumped furthest?",
        text: [
          "In the long jump, Amy jumped 4.5 m, Ben 4.45 m and Cara 4.06 m. Ben says he won, because 45 is more than 5.",
          "Is he right? By the end of this lesson, you can order them properly.",
        ],
        picture: { kind: "number-line", min: 4, max: 5, step: 0.1 },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "What is the 4 worth in 0.45?",
        options: [
          {
            text: "4 tenths",
            correct: true,
            feedback: "The first column after the point is tenths.",
          },
          { text: "4 hundredths", feedback: "Hundredths is the second column after the point." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Write $\\frac{1}{2}$ as a decimal",
        options: [
          { text: "0.5", correct: true, feedback: "Half of 1 is 5 tenths." },
          { text: "1.2", feedback: "A half is less than 1: 0.5." },
          { text: "0.12", feedback: "$\\frac12$ is 1 ÷ 2 = 0.5." },
        ],
      },
      {
        kind: "place",
        tag: "Discover",
        title: "Between 0 and 1",
        text: "Tap where each decimal goes.",
        line: { kind: "number-line", min: 0, max: 1, step: 0.05, every: 2 },
        targets: [
          { value: 0.4, label: "$0.4$" },
          { value: 0.35, label: "$0.35$" },
          { value: 0.8, label: "$0.8$" },
        ],
        hint: "0.35 is between 0.3 and 0.4.",
        done: "0.35 is less than 0.4, even though it has more digits.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Which is bigger: 0.4 or 0.35?",
        picture: {
          kind: "table",
          head: ["", "Ones", "Tenths", "Hundredths"],
          rows: [
            ["0.4", "0", "4", "0"],
            ["0.35", "0", "3", "5"],
          ],
        },
        options: [
          {
            text: "0.4",
            correct: true,
            feedback: "Compare the tenths first: 4 tenths beats 3 tenths.",
          },
          { text: "0.35", feedback: "More digits doesn't mean bigger. Compare tenths: 4 beats 3." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Column by column",
        text: [
          "To compare decimals, line up the points and compare from the **left**: ones, then tenths, then hundredths.",
          "Filling gaps with zeros helps: 0.4 is 0.40, which beats 0.35.",
        ],
        picture: { kind: "maths", tex: "0.40 > 0.35" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Order 0.6, 0.06, 0.65",
        problem: "Put 0.6, 0.06 and 0.65 in order, smallest first.",
        steps: [
          {
            line: "Fill with zeros: 0.60, 0.06, 0.65",
            why: "Now they all have two decimal places.",
          },
          { line: "Tenths: 0.06 has 0, the others 6", why: "0.06 is smallest." },
          { line: "Hundredths: 0.60 < 0.65", why: "Tenths tie, so compare hundredths." },
        ],
        done: "0.06, 0.6, 0.65.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Fractions and decimals",
        start: "Order $\\frac34$, 0.7 and $\\frac12$, smallest first.",
        stages: [
          {
            prompt: "As decimals, $\\frac34$ and $\\frac12$ are",
            options: [
              { text: "0.75 and 0.5", correct: true, feedback: "" },
              {
                text: "0.34 and 0.12",
                feedback: "A fraction isn't its digits: $\\frac34 = 3 \\div 4 = 0.75$.",
              },
            ],
            then: "0.75, 0.7, 0.5",
          },
          {
            prompt: "So, smallest first:",
            options: [
              { text: "$\\frac12$, 0.7, $\\frac34$", correct: true, feedback: "" },
              { text: "0.7, $\\frac12$, $\\frac34$", feedback: "0.5 is less than 0.7." },
            ],
            then: "$\\frac12$, 0.7, $\\frac34$",
          },
        ],
        done: "Change them all to decimals, then compare.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "With negatives",
        start: "Order −0.5, 0.2, −1.5, smallest first.",
        stages: [
          {
            prompt: "The smallest is",
            options: [
              { text: "−1.5", correct: true, feedback: "" },
              { text: "−0.5", feedback: "−1.5 is further below zero." },
            ],
            then: "−1.5 first",
          },
          {
            prompt: "Then",
            options: [
              { text: "−0.5, 0.2", correct: true, feedback: "" },
              { text: "0.2, −0.5", feedback: "Negatives are smaller than positives." },
            ],
            then: "−1.5, −0.5, 0.2",
          },
        ],
        done: "Negatives the same way as whole numbers: further from 0 is smaller.",
      },
      {
        kind: "order",
        tag: "Your turn",
        title: "Smallest to largest",
        items: ["$0.09$", "$0.2$", "$0.25$", "$0.3$"],
        first: "smallest",
        last: "largest",
        hint: "Fill with zeros: 0.09, 0.20, 0.25, 0.30.",
        done: "0.09, 0.2, 0.25, 0.3.",
      },
      {
        kind: "order",
        tag: "Your turn",
        title: "Fractions, decimals and negatives",
        items: ["$-1$", "$-\\frac14$", "$0.3$", "$\\frac12$"],
        first: "smallest",
        last: "largest",
        hint: "$-\\frac14 = -0.25$ and $\\frac12 = 0.5$.",
        done: "−1, −0.25, 0.3, 0.5.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Ben says 4.45 is bigger than 4.5, because 45 is bigger than 5. Is he right?",
        options: [
          {
            text: "No: compare tenths: 4 tenths is less than 5 tenths",
            correct: true,
            feedback:
              "4.5 is 4.50, which beats 4.45. 'Longer is bigger' is the classic decimal mistake.",
          },
          { text: "Yes", feedback: "Write 4.5 as 4.50: now compare 50 and 45 hundredths." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ivy orders 0.8, 0.15, 0.3, smallest first.",
        lines: [
          "0.8 has one digit after the point",
          "0.15 has two, so it's biggest",
          "So 0.8, 0.3, 0.15",
        ],
        wrong: 1,
        why: "Compare tenths, not how many digits: 0.15 has 1 tenth, 0.3 has 3, 0.8 has 8. So 0.15, 0.3, 0.8.",
      },
      {
        kind: "order",
        tag: "Back to the problem",
        title: "Who jumped furthest?",
        text: "Amy 4.5 m, Ben 4.45 m, Cara 4.06 m.",
        items: ["Cara, 4.06 m", "Ben, 4.45 m", "Amy, 4.5 m"],
        first: "shortest",
        last: "longest",
        hint: "Write them as 4.50, 4.45, 4.06.",
        done: "Amy won with 4.5 m: 4.50 beats 4.45.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Which is bigger: 0.6 or 0.56?",
            options: ["0.6", "0.56"],
            answers: ["0.6"],
            why: "6 tenths beats 5 tenths.",
            retry: {
              prompt: "Which is bigger: 2.3 or 2.29?",
              options: ["2.3", "2.29"],
              answers: ["2.3"],
              why: "3 tenths beats 2 tenths.",
            },
          },
          {
            prompt: "Which is smallest: 0.07, 0.7 or 0.17?",
            options: ["0.07", "0.7", "0.17"],
            answers: ["0.07"],
            why: "0 tenths.",
            retry: {
              prompt: "Which is smallest: 0.04, 0.4 or 0.14?",
              options: ["0.04", "0.4", "0.14"],
              answers: ["0.04"],
              why: "0 tenths.",
            },
          },
          {
            prompt: "Which is bigger: $\\frac14$ or 0.3?",
            options: ["0.3", "$\\frac14$"],
            answers: ["0.3"],
            why: "$\\frac14 = 0.25$.",
            retry: {
              prompt: "Which is bigger: $\\frac35$ or 0.55?",
              options: ["$\\frac35$", "0.55"],
              answers: ["$\\frac35$"],
              why: "$\\frac35 = 0.6$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-place-value",
    id: "y7-place-value/signs",
    before: SIGNS,
    title: "The signs",
    summary: "Use =, ≠, <, >, ≤ and ≥ to compare numbers.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Tall enough?",
        text: [
          "A rollercoaster sign says riders must be at least 120 cm tall. Mia is exactly 120 cm.",
          "Can she ride? How would you write the rule with a sign? By the end of this lesson, you can.",
        ],
        picture: { kind: "number-line", min: 100, max: 140, step: 5, every: 2 },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which is bigger: 7 or 4?",
        options: [
          { text: "7", correct: true, feedback: "7 is further right on a number line." },
          { text: "4", feedback: "4 is smaller." },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Is $3 + 4$ equal to 7?",
        options: [
          { text: "Yes", correct: true, feedback: "$3 + 4 = 7$." },
          { text: "No", feedback: "$3 + 4$ is 7." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The signs",
        text: [
          "$<$ means 'is less than', $>$ means 'is greater than'. The wide, open end faces the **bigger** number: $3 < 8$, $8 > 3$.",
          "$=$ means equal, $\\ne$ means not equal.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{array}{c} 3 < 8 \\qquad 8 > 3 \\\\ 2 + 2 = 4 \\qquad 5 \\ne 6 \\end{array}",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Which is true?",
        options: [
          {
            text: "$5 > 2$",
            correct: true,
            feedback: "5 is greater than 2: the open end faces the 5.",
          },
          { text: "$5 < 2$", feedback: "That says 5 is less than 2." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Or equal to",
        text: [
          "$\\le$ means 'less than **or equal to**', and $\\ge$ means 'greater than or equal to'.",
          "'At least 120' means 120 or more: $\\ge 120$. 'At most 5' means 5 or fewer: $\\le 5$.",
        ],
        picture: { kind: "maths", tex: "h \\ge 120" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Choose the sign",
        problem: "Put the right sign between $-3$ and $-7$.",
        steps: [
          { line: "−3 is to the right of −7", why: "Closer to zero: bigger." },
          { line: "So −3 is greater: $-3 > -7$", why: "The open end faces the bigger number." },
        ],
        done: "$-3 > -7$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Equal, or not?",
        start: "Compare $0.5$ and $\\frac12$.",
        stages: [
          {
            prompt: "$\\frac12$ as a decimal is",
            options: [
              { text: "0.5", correct: true, feedback: "" },
              { text: "1.2", feedback: "$1 \\div 2 = 0.5$." },
            ],
            then: "0.5",
          },
          {
            prompt: "So the sign is",
            options: [
              { text: "$=$", correct: true, feedback: "" },
              { text: "$>$", feedback: "They're the same number." },
            ],
            then: "$0.5 = \\frac12$",
          },
        ],
        done: "Different ways of writing can be equal.",
      },
      {
        kind: "fill",
        tag: "Together",
        title: "Choose the sign",
        template: "$4.2$ [] $4.15$ and $-2$ [] $1$",
        bank: ["$<$", "$>$", "$=$"],
        answers: ["$>$", "$<$"],
        hint: "4.20 vs 4.15; and any negative is less than any positive.",
        done: "$4.2 > 4.15$ and $-2 < 1$.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "'You can take at most 3 bags' means the number of bags b is",
        options: [
          { text: "$b \\le 3$", correct: true, feedback: "3 or fewer." },
          { text: "$b < 3$", feedback: "That would stop you taking 3. 'At most' includes 3." },
          { text: "$b \\ge 3$", feedback: "That's 3 or more." },
        ],
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Choose the sign",
        template: "$\\frac14$ [] $0.3$ and $7 \\times 3$ [] $20$",
        bank: ["$<$", "$>$", "$=$", "$\\ne$"],
        answers: ["$<$", "$>$"],
        hint: "$\\frac14 = 0.25$; $7 \\times 3 = 21$.",
        done: "$\\frac14 < 0.3$ and $21 > 20$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Sam writes $6 < 2$ to say '6 is bigger than 2'. Is that right?",
        options: [
          {
            text: "No: the open end faces the bigger number, $6 > 2$",
            correct: true,
            feedback:
              "$<$ reads 'is less than'. Mixing up the two signs is common: the wide end always faces the bigger number.",
          },
          { text: "Yes", feedback: "$6 < 2$ says 6 is less than 2." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "A sign says children under 5 go free. Max writes the rule for age a.",
        lines: ["'Under 5' means less than 5", "5-year-olds go free too", "So $a \\le 5$"],
        wrong: 1,
        why: "'Under 5' means less than 5, not including 5: $a < 5$. A 5-year-old pays.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Tall enough?",
        text: "Riders must be at least 120 cm. Mia is 120 cm.",
        options: [
          {
            text: "$h \\ge 120$: Mia can ride",
            correct: true,
            feedback: "'At least' includes 120 itself.",
          },
          {
            text: "$h > 120$: Mia can't ride",
            feedback: "'At least 120' means 120 or more, so 120 is fine.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Which is true: $-1 > -4$ or $-1 < -4$?",
            options: ["$-1 > -4$", "$-1 < -4$"],
            answers: ["$-1 > -4$"],
            why: "−1 is closer to zero.",
            retry: {
              prompt: "Which is true: $-6 < -2$ or $-6 > -2$?",
              options: ["$-6 < -2$", "$-6 > -2$"],
              answers: ["$-6 < -2$"],
              why: "−6 is further below zero.",
            },
          },
          {
            prompt: "'At least 18' is",
            options: ["$\\ge 18$", "$> 18$", "$\\le 18$"],
            answers: ["$\\ge 18$"],
            why: "18 or more.",
            retry: {
              prompt: "'No more than 10' is",
              options: ["$\\le 10$", "$< 10$", "$\\ge 10$"],
              answers: ["$\\le 10$"],
              why: "10 or fewer.",
            },
          },
          {
            prompt: "Which is true: $0.7 > 0.65$, $0.7 < 0.65$ or $0.7 = 0.65$?",
            options: ["$0.7 > 0.65$", "$0.7 < 0.65$", "$0.7 = 0.65$"],
            answers: ["$0.7 > 0.65$"],
            why: "0.70 beats 0.65.",
            retry: {
              prompt: "Which is true: $0.3 < 0.31$, $0.3 > 0.31$ or $0.3 = 0.31$?",
              options: ["$0.3 < 0.31$", "$0.3 > 0.31$", "$0.3 = 0.31$"],
              answers: ["$0.3 < 0.31$"],
              why: "0.30 is less than 0.31.",
            },
          },
        ],
      },
    ],
  },
];
