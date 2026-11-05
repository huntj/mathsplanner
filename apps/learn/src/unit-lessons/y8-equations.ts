// Year 8, "Formulae and equations", as five short lessons, one just before each skill: using a
// formula, changing its subject, the letter on both sides, brackets, and fractions. Each opens on
// a real problem, warms up what it builds on, finds the idea, works an example, does one together,
// gives some to try, spots a common mistake, solves the opening problem, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const FORMULAE = "Y8-ALG-02.a";
const REARRANGE = "Y8-ALG-02.b";
const BOTH_SIDES = "Y8-ALG-04.a";
const BRACKETS = "Y8-ALG-04.b";
const FRACTIONS = "Y8-ALG-04.c";

export const y8Equations: UnitLesson[] = [
  {
    unit: "y8-equations",
    id: "y8-equations/formulae",
    before: FORMULAE,
    title: "Using a formula",
    summary: "Put numbers in place of letters, then follow the order of operations.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Dinner at six",
        text: [
          "A cookbook says a turkey needs $T = 40w + 20$ minutes in the oven, where $w$ is its weight in kg.",
          "Dinner is at 6 pm, and the turkey weighs 5 kg. When must it go in? By the end of this lesson, you can work it out.",
        ],
        picture: { kind: "maths", tex: "T = 40w + 20" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $3 \\times 4 + 5$",
        answers: ["17"],
        wrong: [{ answer: "27", feedback: "Multiply before you add: $3 \\times 4$ first." }],
        hint: "Multiply first, then add.",
        done: "$12 + 5 = 17$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "If $a = 6$, what is $2a - 5$?",
        answers: ["7"],
        wrong: [{ answer: "21", feedback: "$2a$ means $2 \\times a$, not 26." }],
        hint: "$2a$ means $2 \\times 6$.",
        done: "$2 \\times 6 - 5 = 12 - 5 = 7$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "What a formula is",
        text: [
          "A **formula** is a rule linking quantities, with a letter for each one.",
          "To use it, **substitute**: put each number in place of its letter. Then work it out in the usual order: powers, then multiplying and dividing, then adding and taking away.",
        ],
        picture: {
          kind: "maths",
          tex: "T = 40w + 20 \\;\\xrightarrow{w = 3}\\; T = 40 \\times 3 + 20",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "With $w = 3$, what is $40w + 20$?",
        options: [
          {
            text: "$40 \\times 3 + 20 = 140$",
            correct: true,
            feedback: "$40w$ means $40 \\times w$, and multiplying comes first.",
          },
          {
            text: "$403 + 20 = 423$",
            feedback: "$40w$ means $40 \\times w$, not 40 written next to 3.",
          },
          {
            text: "$40 \\times 23 = 920$",
            feedback: "Multiply before you add: $40 \\times 3$ first, then add 20.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Speed after a while",
        problem:
          "The formula $v = u + at$ gives a speed. Find $v$ when $u = 4$, $a = 3$ and $t = 5$.",
        steps: [
          {
            line: "$v = 4 + 3 \\times 5$",
            why: "Substitute: put each number in place of its letter.",
          },
          { line: "$v = 4 + 15$", why: "Multiply before you add: $at$ is $3 \\times 5$." },
          { line: "$v = 19$", why: "Then add." },
        ],
        done: "$v = 19$. Adding first would give $7 \\times 5 = 35$: the order matters.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "The perimeter of a rectangle",
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 8, y: 0 },
            { x: 8, y: 5 },
            { x: 0, y: 5 },
          ],
          sides: ["8 cm", "5 cm", null, null],
          square: [0, 1, 2, 3],
        },
        start: "$P = 2l + 2w$. Find P when $l = 8$ and $w = 5$.",
        stages: [
          {
            prompt: "Substitute:",
            options: [
              { text: "$P = 2 \\times 8 + 2 \\times 5$", correct: true, feedback: "" },
              {
                text: "$P = 2 \\times 8 + 5$",
                feedback: "Both lengths are doubled: $2w$ is $2 \\times 5$.",
              },
              { text: "$P = 28 + 25$", feedback: "$2l$ means $2 \\times l$, not 28." },
            ],
            then: "$P = 16 + 10$",
          },
          {
            prompt: "So P is",
            options: [
              { text: "26 cm", correct: true, feedback: "" },
              { text: "13 cm", feedback: "That is only half way round. Add $16 + 10$." },
              { text: "40 cm", feedback: "That's the area, $8 \\times 5$. Add $16 + 10$." },
            ],
            then: "$P = 26$ cm",
          },
        ],
        done: "Substitute, then work it out in order.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "The area of a trapezium",
        text: "One more together, step by step.",
        picture: { kind: "maths", tex: "A = \\frac{(a + b)h}{2}" },
        start: "Find A when $a = 5$, $b = 9$ and $h = 4$.",
        stages: [
          {
            prompt: "Substitute:",
            options: [
              { text: "$A = \\frac{(5 + 9) \\times 4}{2}$", correct: true, feedback: "" },
              {
                text: "$A = \\frac{5 + 9 \\times 4}{2}$",
                feedback: "Keep the bracket: add a and b before multiplying.",
              },
              { text: "$A = \\frac{(5 + 9) + 4}{2}$", feedback: "$(a + b)h$ means multiply by h." },
            ],
            then: "$A = \\frac{14 \\times 4}{2}$",
          },
          {
            prompt: "So A is",
            options: [
              { text: "28", correct: true, feedback: "" },
              { text: "56", feedback: "Don't forget to divide by 2." },
              { text: "20.5", feedback: "Brackets first: $5 + 9 = 14$." },
            ],
            then: "$A = \\frac{56}{2} = 28$",
          },
        ],
        done: "Substitute, then brackets first. Now try some on your own.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Celsius to Fahrenheit",
        text: "$F = 1.8C + 32$ turns degrees Celsius into Fahrenheit. What is 25 °C in Fahrenheit?",
        answers: ["77"],
        unit: "°F",
        wrong: [{ answer: "102.6", feedback: "Multiply 25 by 1.8 first, then add 32." }],
        hint: "Put 25 in place of C: $1.8 \\times 25 + 32$.",
        done: "$1.8 \\times 25 + 32 = 45 + 32 = 77$ °F.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Average speed",
        text: "$s = \\frac{d}{t}$ gives an average speed. A train goes $d = 150$ km in $t = 3$ hours. Find s.",
        answers: ["50"],
        unit: "km/h",
        wrong: [{ answer: "450", feedback: "$\\frac{d}{t}$ means divide d by t." }],
        hint: "$150 \\div 3$.",
        done: "$s = 150 \\div 3 = 50$ km/h.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "$v = u + at$ with $u = 3$, $a = 2$, $t = 5$. Max works out $3 + 2 = 5$, then $5 \\times 5 = 25$. Is he right?",
        options: [
          {
            text: "No: multiply first. $at = 10$, so $v = 13$",
            correct: true,
            feedback: "Order of operations still applies in a formula: times before plus.",
          },
          { text: "Yes", feedback: "$at$ means $a \\times t$, done before adding u." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ben uses $y = 3x^2$ to find y when $x = 4$.",
        lines: ["$y = 3 \\times 4^2$", "$y = 12^2$", "$y = 144$"],
        wrong: 1,
        why: "Powers come before multiplying, so only the 4 is squared: $4^2 = 16$, then $y = 3 \\times 16 = 48$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Dinner at six",
        text: "The 5 kg turkey needs $T = 40w + 20$ minutes. When must it go in for dinner at 6 pm?",
        picture: { kind: "maths", tex: "T = 40w + 20" },
        options: [
          {
            text: "2:20 pm",
            correct: true,
            feedback:
              "$T = 40 \\times 5 + 20 = 220$ minutes, which is 3 hours 40 minutes. 3 hours 40 minutes before 6 pm is 2:20 pm.",
          },
          {
            text: "3:40 pm",
            feedback: "3 hours 40 minutes is how long it cooks. Count back that long from 6 pm.",
          },
          {
            text: "2:00 pm",
            feedback:
              "That gives it 4 hours. $40 \\times 5 + 20 = 220$ minutes is 3 hours 40 minutes.",
          },
          {
            text: "2:40 pm",
            feedback: "That gives it 3 hours 20 minutes. 220 minutes is 3 hours 40 minutes.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$P = 2l + 2w$. Find P when $l = 7$ and $w = 3$.",
            answers: ["20"],
            why: "$2 \\times 7 + 2 \\times 3 = 14 + 6 = 20$.",
            retry: {
              prompt: "$P = 2l + 2w$. Find P when $l = 9$ and $w = 4$.",
              answers: ["26"],
              why: "$2 \\times 9 + 2 \\times 4 = 18 + 8 = 26$.",
            },
          },
          {
            prompt: "$y = 2x^2$. Find y when $x = 3$.",
            answers: ["18"],
            why: "Square first: $3^2 = 9$, then $2 \\times 9 = 18$.",
            retry: {
              prompt: "$y = 5x^2$. Find y when $x = 2$.",
              answers: ["20"],
              why: "Square first: $2^2 = 4$, then $5 \\times 4 = 20$.",
            },
          },
          {
            prompt: "A taxi costs $C = 3 + 2m$ pounds for m miles. What does 6 miles cost, in £?",
            answers: ["15"],
            why: "$3 + 2 \\times 6 = 3 + 12 = 15$.",
            retry: {
              prompt: "A taxi costs $C = 3 + 2m$ pounds for m miles. What do 9 miles cost, in £?",
              answers: ["21"],
              why: "$3 + 2 \\times 9 = 3 + 18 = 21$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-equations",
    id: "y8-equations/rearrange",
    before: REARRANGE,
    title: "Changing the subject",
    summary: "Rearrange a formula to get a different letter on its own.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How far can you go?",
        text: [
          "A taxi costs £3, plus £2 a mile: $C = 3 + 2m$.",
          "You have £19. How many miles can you go? And can you make a formula that answers it for any amount? By the end of this lesson, you can.",
        ],
        picture: { kind: "maths", tex: "C = 3 + 2m" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Solve $3x + 4 = 25$",
        answers: ["7"],
        wrong: [{ answer: "9.67", feedback: "Take 4 away first, then divide by 3." }],
        hint: "Take 4 from both sides, then divide by 3.",
        done: "$3x = 21$, so $x = 7$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Use the formula",
        text: "$C = 3 + 2m$. Find C when $m = 5$.",
        answers: ["13"],
        wrong: [{ answer: "25", feedback: "Multiply before you add: $2 \\times 5$ first." }],
        hint: "$3 + 2 \\times 5$.",
        done: "$3 + 10 = 13$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Undo it, in reverse",
        text: [
          "In $C = 3 + 2m$, m is multiplied by 2, then 3 is added.",
          "To get m on its own, undo those steps in reverse order, doing the same to both sides: take 3, then divide by 2. Then m is the **subject**.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{aligned} m &\\xrightarrow{\\times 2} 2m \\xrightarrow{+ 3} C \\\\ \\frac{C - 3}{2} &\\xleftarrow{\\div 2} C - 3 \\xleftarrow{- 3} C \\end{aligned}",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "To make m the subject of $C = 3 + 2m$, what do you undo first?",
        options: [
          {
            text: "The + 3: take 3 from both sides",
            correct: true,
            feedback: "The + 3 was done last, so it's undone first: $C - 3 = 2m$.",
          },
          {
            text: "The × 2: divide just the $2m$ by 2",
            feedback: "Whatever you do, do it to the whole of both sides. Undo the + 3 first.",
          },
          {
            text: "The C: take C from both sides",
            feedback: "C is what we have. Undo what's done to m: first the + 3.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Make t the subject",
        problem: "Make t the subject of $v = u + at$.",
        steps: [
          { line: "$v - u = at$", why: "Take u from both sides, to undo + u." },
          { line: "$\\frac{v - u}{a} = t$", why: "Divide both sides by a, to undo × a." },
          {
            line: "$t = \\frac{v - u}{a}$",
            why: "Write it the usual way round, with t on the left.",
          },
        ],
        done: "The same steps as solving an equation, with letters instead of numbers.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Make x the subject of $y = 3x - 7$",
        start: "$y = 3x - 7$",
        stages: [
          {
            prompt: "Undo the − 7:",
            options: [
              { text: "$y + 7 = 3x$", correct: true, feedback: "" },
              { text: "$y - 7 = 3x$", feedback: "Undo − 7 by adding 7." },
              { text: "$\\frac{y}{3} = x - 7$", feedback: "Undo the − 7 first: it was done last." },
            ],
            then: "$y + 7 = 3x$",
          },
          {
            prompt: "Undo the × 3:",
            options: [
              { text: "$x = \\frac{y + 7}{3}$", correct: true, feedback: "" },
              { text: "$x = \\frac{y}{3} + 7$", feedback: "Divide all of $y + 7$ by 3." },
              { text: "$x = 3(y + 7)$", feedback: "Undo × 3 by dividing, not multiplying." },
            ],
            then: "$x = \\frac{y + 7}{3}$",
          },
        ],
        done: "Check with numbers: $x = 4$ gives $y = 5$, and $\\frac{5 + 7}{3} = 4$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Make $a$ the subject of $P = 2a + 2b$",
        text: "One more together, step by step.",
        start: "$P = 2a + 2b$",
        stages: [
          {
            prompt: "Undo the + 2b:",
            options: [
              { text: "$P - 2b = 2a$", correct: true, feedback: "" },
              { text: "$P + 2b = 2a$", feedback: "Undo + 2b by taking 2b away." },
              {
                text: "$\\frac{P}{2} = a + 2b$",
                feedback: "Undo the + 2b first: it was done last.",
              },
            ],
            then: "$P - 2b = 2a$",
          },
          {
            prompt: "Undo the × 2:",
            options: [
              { text: "$a = \\frac{P - 2b}{2}$", correct: true, feedback: "" },
              { text: "$a = \\frac{P}{2} - 2b$", feedback: "Divide all of $P - 2b$ by 2." },
              { text: "$a = 2(P - 2b)$", feedback: "Undo × 2 by dividing." },
            ],
            then: "$a = \\frac{P - 2b}{2}$",
          },
        ],
        done: "Check: $a = 3$, $b = 1$ gives $P = 8$, and $\\frac{8 - 2}{2} = 3$ ✓. Now try some on your own.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Make $r$ the subject of $C = 2\\pi r$",
        template: "$r =$ []",
        bank: ["$\\frac{C}{2\\pi}$", "$C - 2\\pi$", "$2\\pi C$", "$\\frac{2\\pi}{C}$"],
        answers: ["$\\frac{C}{2\\pi}$"],
        hint: "r is multiplied by $2\\pi$. Undo it.",
        done: "$r = \\frac{C}{2\\pi}$: divide both sides by $2\\pi$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Make $h$ the subject of $A = \\frac{bh}{2}$",
        template: "$h =$ []",
        bank: ["$\\frac{2A}{b}$", "$\\frac{A}{2b}$", "$2Ab$", "$\\frac{Ab}{2}$"],
        answers: ["$\\frac{2A}{b}$"],
        hint: "Undo the ÷ 2 first, by multiplying both sides by 2. Then undo × b.",
        done: "$2A = bh$, so $h = \\frac{2A}{b}$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "To make x the subject of $y = x + 5$, Pat writes $x = y + 5$. Is that right?",
        options: [
          {
            text: "No: undo + 5 by taking 5: $x = y - 5$",
            correct: true,
            feedback: "Moving a term to the other side uses the inverse operation.",
          },
          { text: "Yes", feedback: "Check with x = 1: y = 6, but $6 + 5 = 11$, not 1." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Amy makes x the subject of $y = 5x + 2$.",
        lines: ["$y = 5x + 2$", "$\\frac{y}{5} = x + 2$", "$x = \\frac{y}{5} - 2$"],
        wrong: 1,
        why: "Dividing both sides by 5 divides the 2 as well. Undo the + 2 first: $y - 2 = 5x$, so $x = \\frac{y - 2}{5}$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "How far can you go?",
        picture: { kind: "maths", tex: "C = 3 + 2m" },
        start: "Make a formula for the miles, m, from the cost, C.",
        stages: [
          {
            prompt: "Make m the subject:",
            options: [
              { text: "$m = \\frac{C - 3}{2}$", correct: true, feedback: "" },
              {
                text: "$m = \\frac{C}{2} - 3$",
                feedback: "Undo the + 3 first, then divide all of $C - 3$ by 2.",
              },
              { text: "$m = 2(C - 3)$", feedback: "Undo × 2 by dividing, not multiplying." },
            ],
            then: "$m = \\frac{C - 3}{2}$",
          },
          {
            prompt: "With £19, how far can you go?",
            options: [
              { text: "8 miles", correct: true, feedback: "" },
              {
                text: "6.5 miles",
                feedback: "That's $\\frac{19}{2} - 3$. Take the 3 off first: $\\frac{19 - 3}{2}$.",
              },
              {
                text: "32 miles",
                feedback: "That's $2 \\times 16$. Divide by 2: $\\frac{19 - 3}{2}$.",
              },
            ],
            then: "$m = \\frac{19 - 3}{2} = 8$ miles",
          },
        ],
        done: "8 miles. And with £35? $\\frac{35 - 3}{2} = 16$ miles: one formula answers every budget.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Make x the subject of $y = x + 9$.",
            options: ["$x = y - 9$", "$x = y + 9$", "$x = 9 - y$"],
            answers: ["$x = y - 9$"],
            why: "Take 9 from both sides.",
            retry: {
              prompt: "Make x the subject of $y = x - 4$.",
              options: ["$x = y + 4$", "$x = y - 4$", "$x = 4 - y$"],
              answers: ["$x = y + 4$"],
              why: "Add 4 to both sides.",
            },
          },
          {
            prompt: "Make x the subject of $y = 4x$.",
            options: ["$x = \\frac{y}{4}$", "$x = 4y$", "$x = y - 4$"],
            answers: ["$x = \\frac{y}{4}$"],
            why: "Divide both sides by 4.",
            retry: {
              prompt: "Make x the subject of $y = 6x$.",
              options: ["$x = \\frac{y}{6}$", "$x = 6y$", "$x = y - 6$"],
              answers: ["$x = \\frac{y}{6}$"],
              why: "Divide both sides by 6.",
            },
          },
          {
            prompt: "Make x the subject of $y = 2x + 5$.",
            options: ["$x = \\frac{y - 5}{2}$", "$x = \\frac{y}{2} - 5$", "$x = 2y - 5$"],
            answers: ["$x = \\frac{y - 5}{2}$"],
            why: "Take 5 from both sides, then divide all of $y - 5$ by 2.",
            retry: {
              prompt: "Make x the subject of $y = 3x - 1$.",
              options: ["$x = \\frac{y + 1}{3}$", "$x = \\frac{y}{3} + 1$", "$x = 3y + 1$"],
              answers: ["$x = \\frac{y + 1}{3}$"],
              why: "Add 1 to both sides, then divide all of $y + 1$ by 3.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-equations",
    id: "y8-equations/both-sides",
    before: BOTH_SIDES,
    title: "Letters on both sides",
    summary: "Get the letters on one side first, then solve as usual.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Which gym?",
        text: [
          "Gym A costs £30 to join, then £5 a visit. Gym B has no joining fee, but costs £8 a visit.",
          "After how many visits do they cost the same? By the end of this lesson, you can work it out.",
        ],
        picture: {
          kind: "table",
          head: ["Visits", "Gym A", "Gym B"],
          rows: [
            ["1", "£35", "£8"],
            ["2", "£40", "£16"],
            ["3", "£45", "£24"],
            ["…", "?", "?"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Solve $3x + 5 = 20$",
        answers: ["5"],
        wrong: [{ answer: "8.33", feedback: "Take 5 away first, then divide by 3." }],
        hint: "Take 5 from both sides, then divide by 3.",
        done: "$3x = 15$, so $x = 5$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Simplify $7x - 4x$",
        answers: ["3x"],
        wrong: [{ answer: "3", feedback: "It's 3 lots of x: $3x$." }],
        hint: "7 lots of x, take away 4 lots of x.",
        done: "$7x - 4x = 3x$.",
      },
      {
        kind: "balance",
        tag: "Discover",
        title: "Solve $5x + 3 = 2x + 15$",
        text: "Now there are bags on both sides. Get them all on one side first.",
        a: 5,
        b: 3,
        c: 15,
        d: 2,
        letter: "x",
        done: "$x = 4$. Check: $5 \\times 4 + 3 = 23$ and $2 \\times 4 + 15 = 23$ ✓",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "In $5x + 3 = 2x + 15$, why take $2x$ from both sides?",
        options: [
          {
            text: "It leaves x on one side only, and a positive number of them",
            correct: true,
            feedback: "$3x + 3 = 15$. Take the **smaller** number of x's from both sides.",
          },
          {
            text: "You always take away the first number of x's",
            feedback: "Taking $5x$ leaves $3 = -3x + 15$: negative x's. Take the smaller number.",
          },
          {
            text: "To make the 15 smaller",
            feedback: "It's the x's we want on one side. The 15 stays.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "The smaller number of x's",
        problem: "Solve $7x - 4 = 3x + 12$.",
        steps: [
          { line: "$4x - 4 = 12$", why: "Take 3x from both sides: the smaller number of x's." },
          { line: "$4x = 16$", why: "Add 4 to both sides." },
          { line: "$x = 4$", why: "Divide both sides by 4." },
        ],
        done: "Check: $7 \\times 4 - 4 = 24$ and $3 \\times 4 + 12 = 24$ ✓",
      },
      {
        kind: "balance",
        tag: "Together",
        title: "Solve $4x + 1 = x + 13$",
        a: 4,
        b: 1,
        c: 13,
        d: 1,
        letter: "x",
        done: "$x = 4$. Check: $4 \\times 4 + 1 = 17$ and $4 + 13 = 17$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Solve $9x - 4 = 5x + 8$",
        text: "One more together, step by step.",
        start: "$9x - 4 = 5x + 8$",
        stages: [
          {
            prompt: "Take the smaller number of x's from both sides:",
            options: [
              { text: "$4x - 4 = 8$", correct: true, feedback: "" },
              { text: "$14x - 4 = 8$", feedback: "Take 5x away, don't add it." },
            ],
            then: "$4x - 4 = 8$",
          },
          {
            prompt: "Add 4 to both sides:",
            options: [
              { text: "$4x = 12$", correct: true, feedback: "" },
              { text: "$4x = 4$", feedback: "Undo − 4 by adding 4." },
            ],
            then: "$4x = 12$",
          },
          {
            prompt: "So x is",
            options: [
              { text: "$x = 3$", correct: true, feedback: "" },
              { text: "$x = 48$", feedback: "Divide by 4, don't multiply." },
            ],
            then: "$x = 3$",
          },
        ],
        done: "Check: $9 \\times 3 - 4 = 23$ and $5 \\times 3 + 8 = 23$ ✓. Now try some on your own.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Solve $6x + 2 = 4x + 10$",
        answers: ["4"],
        wrong: [
          { answer: "0.8", feedback: "Take 4x from both sides, don't add it: $2x + 2 = 10$." },
        ],
        hint: "Take 4x from both sides first.",
        done: "$2x + 2 = 10$, so $2x = 8$ and $x = 4$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Solve $5x - 3 = 2x + 12$",
        answers: ["5"],
        wrong: [{ answer: "3", feedback: "Add 3 to both sides, don't take it away: $3x = 15$." }],
        hint: "Take 2x from both sides, then add 3.",
        done: "$3x - 3 = 12$, so $3x = 15$ and $x = 5$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Gus solves $4x = x + 9$ and writes $4x - x = 4$. What's wrong?",
        options: [
          {
            text: "$x$ is $1x$, so $4x - x = 3x$",
            correct: true,
            feedback: "Take x from both sides: $3x = 9$, so $x = 3$.",
          },
          { text: "Nothing", feedback: "4 lots of x take away 1 lot of x leaves 3 lots." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Dev solves $8x + 3 = 5x + 18$.",
        lines: ["$8x + 3 = 5x + 18$", "$13x + 3 = 18$", "$13x = 15$", "$x = \\frac{15}{13}$"],
        wrong: 1,
        why: "To move the 5x, take it from both sides: $3x + 3 = 18$. Then $3x = 15$ and $x = 5$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Which gym?",
        text: "Gym A: £30, then £5 a visit. Gym B: £8 a visit.",
        start: "Let v be the number of visits.",
        stages: [
          {
            prompt: "The two cost the same when",
            options: [
              { text: "$30 + 5v = 8v$", correct: true, feedback: "" },
              {
                text: "$30v + 5 = 8v$",
                feedback: "The £30 is paid once. It's the £5 that's paid each visit.",
              },
              { text: "$35v = 8v$", feedback: "The £30 is paid once, not every visit." },
            ],
            then: "$30 + 5v = 8v$",
          },
          {
            prompt: "Take 5v from both sides:",
            options: [
              { text: "$30 = 3v$", correct: true, feedback: "" },
              { text: "$30 = 13v$", feedback: "Take 5v away, don't add it." },
            ],
            then: "$30 = 3v$",
          },
          {
            prompt: "So v is",
            options: [
              { text: "10", correct: true, feedback: "" },
              { text: "90", feedback: "Undo × 3 by dividing: $30 \\div 3$." },
            ],
            then: "$v = 10$",
          },
        ],
        done: "After 10 visits, both cost £80. Go more often than that, and Gym A is cheaper.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Solve $5x + 1 = 3x + 9$.",
            answers: ["4"],
            why: "$2x + 1 = 9$, so $2x = 8$ and $x = 4$.",
            retry: {
              prompt: "Solve $6x + 5 = 2x + 25$.",
              answers: ["5"],
              why: "$4x + 5 = 25$, so $4x = 20$ and $x = 5$.",
            },
          },
          {
            prompt: "Solve $9x - 5 = 4x + 15$.",
            answers: ["4"],
            why: "$5x - 5 = 15$, so $5x = 20$ and $x = 4$.",
            retry: {
              prompt: "Solve $8x - 7 = 5x + 11$.",
              answers: ["6"],
              why: "$3x - 7 = 11$, so $3x = 18$ and $x = 6$.",
            },
          },
          {
            prompt: "What is the best first step for $6x + 4 = 2x + 20$?",
            options: ["Take 2x from both sides", "Take 6x from both sides", "Add 2x to both sides"],
            answers: ["Take 2x from both sides"],
            why: "Take the smaller number of x's: $4x + 4 = 20$.",
            retry: {
              prompt: "What is the best first step for $3x + 10 = 7x + 2$?",
              options: [
                "Take 3x from both sides",
                "Take 7x from both sides",
                "Add 3x to both sides",
              ],
              answers: ["Take 3x from both sides"],
              why: "Take the smaller number of x's: $10 = 4x + 2$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-equations",
    id: "y8-equations/brackets",
    before: BRACKETS,
    title: "Brackets in equations",
    summary: "Expand the bracket, or divide it out, then solve.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Concert tickets",
        text: [
          "Three friends each buy a concert ticket and a £4 programme. Altogether they pay £45.",
          "How much is one ticket? By the end of this lesson, you can work it out.",
        ],
        picture: { kind: "maths", tex: "3(t + 4) = 45" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Expand $3(x + 4)$",
        answers: ["3x+12", "12+3x"],
        wrong: [{ answer: "3x+4", feedback: "The 3 multiplies the 4 as well." }],
        hint: "Multiply each term inside by 3.",
        done: "$3 \\times x + 3 \\times 4 = 3x + 12$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Solve $2x - 6 = 14$",
        answers: ["10"],
        wrong: [{ answer: "4", feedback: "Add 6 to both sides, don't take it away: $2x = 20$." }],
        hint: "Add 6 to both sides, then divide by 2.",
        done: "$2x = 20$, so $x = 10$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Two ways in",
        text: [
          "In $3(x + 4) = 27$, all of $x + 4$ is multiplied by 3.",
          "Either **expand** the bracket first, multiplying each term inside, or **divide** both sides by 3 to undo the × 3. Both give the same answer.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{aligned} 3x + 12 &= 27 & x + 4 &= 9 \\\\ 3x &= 15 & x &= 5 \\\\ x &= 5 \\end{aligned}",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Expand $3(x + 4) = 27$",
        options: [
          {
            text: "$3x + 12 = 27$",
            correct: true,
            feedback: "Every term inside is multiplied by 3.",
          },
          { text: "$3x + 4 = 27$", feedback: "The 3 multiplies the 4 as well." },
          { text: "$x + 12 = 27$", feedback: "The 3 multiplies the x as well." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Expand, then solve",
        problem: "Solve $4(2x - 3) = 36$.",
        steps: [
          { line: "$8x - 12 = 36$", why: "Expand: $4 \\times 2x = 8x$ and $4 \\times -3 = -12$." },
          { line: "$8x = 48$", why: "Add 12 to both sides." },
          { line: "$x = 6$", why: "Divide both sides by 8." },
        ],
        done: "Check: $4(2 \\times 6 - 3) = 4 \\times 9 = 36$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Solve $3(x + 4) = 27$",
        start: "$3(x + 4) = 27$",
        stages: [
          {
            prompt: "Expand the bracket:",
            options: [
              { text: "$3x + 12 = 27$", correct: true, feedback: "" },
              { text: "$3x + 4 = 27$", feedback: "The 3 multiplies the 4 as well." },
              { text: "$x + 12 = 27$", feedback: "The 3 multiplies the x as well." },
            ],
            then: "$3x + 12 = 27$",
          },
          {
            prompt: "Take 12 from both sides:",
            options: [
              { text: "$3x = 15$", correct: true, feedback: "" },
              { text: "$3x = 39$", feedback: "Take 12 away, don't add it." },
            ],
            then: "$3x = 15$",
          },
          {
            prompt: "Divide both sides by 3:",
            options: [
              { text: "$x = 5$", correct: true, feedback: "" },
              { text: "$x = 45$", feedback: "Divide by 3, don't multiply." },
            ],
            then: "$x = 5$",
          },
        ],
        done: "Check: $3(5 + 4) = 27$ ✓. Dividing by 3 first is quicker here: $x + 4 = 9$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Solve $5(x - 2) = 35$",
        text: "One more together, step by step.",
        start: "$5(x - 2) = 35$",
        stages: [
          {
            prompt: "This time, divide both sides by 5 first:",
            options: [
              { text: "$x - 2 = 7$", correct: true, feedback: "" },
              { text: "$x - 2 = 30$", feedback: "Divide by 5; don't take 5 away." },
              {
                text: "$5x - 2 = 7$",
                feedback: "All of $5(x - 2)$ is divided by 5, leaving $x - 2$.",
              },
            ],
            then: "$x - 2 = 7$",
          },
          {
            prompt: "Add 2 to both sides:",
            options: [
              { text: "$x = 9$", correct: true, feedback: "" },
              { text: "$x = 5$", feedback: "Undo − 2 by adding 2." },
            ],
            then: "$x = 9$",
          },
        ],
        done: "Check: $5(9 - 2) = 35$ ✓. Expanding first works too: $5x - 10 = 35$. Now try some on your own.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Solve $2(x - 3) = 14$",
        answers: ["10"],
        wrong: [
          { answer: "8.5", feedback: "Multiply the 3 by 2 too: $2x - 6 = 14$." },
          { answer: "4", feedback: "Undo the − 3 by adding 3: $x - 3 = 7$." },
        ],
        hint: "Divide both sides by 2, or expand the bracket first.",
        done: "$x - 3 = 7$, so $x = 10$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Solve $5(x + 1) = 3(x + 5)$",
        text: "Brackets on both sides: expand both, then get the x's on one side.",
        answers: ["5"],
        wrong: [{ answer: "2", feedback: "Expand both brackets fully: $5x + 5 = 3x + 15$." }],
        hint: "$5x + 5 = 3x + 15$. Now take 3x from both sides.",
        done: "$5x + 5 = 3x + 15$, so $2x = 10$ and $x = 5$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "To solve $4(x + 1) = 20$, Ria divides both sides by 4 first: $x + 1 = 5$. Is that allowed?",
        options: [
          {
            text: "Yes: it's the same on both sides, and gives $x = 4$",
            correct: true,
            feedback: "Expanding first works too: $4x + 4 = 20$. Either way, $x = 4$.",
          },
          {
            text: "No: you must expand first",
            feedback: "Dividing both sides by the same number keeps them balanced.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Tom solves $2(x + 5) = 18$.",
        lines: ["$2(x + 5) = 18$", "$2x + 5 = 18$", "$2x = 13$", "$x = 6.5$"],
        wrong: 1,
        why: "The 2 multiplies everything inside the bracket: $2x + 10 = 18$. Then $2x = 8$ and $x = 4$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Concert tickets",
        text: "Three friends each buy a ticket, t, and a £4 programme, paying £45: $3(t + 4) = 45$. How much is one ticket, in £?",
        picture: { kind: "maths", tex: "3(t + 4) = 45" },
        answers: ["11"],
        wrong: [
          { answer: "15", feedback: "£15 is a ticket and a programme. Take off the programme." },
          { answer: "13.67", feedback: "The 3 multiplies the 4 too: $3t + 12 = 45$." },
        ],
        hint: "Divide both sides by 3 first: $t + 4 = 15$.",
        done: "$t + 4 = 15$, so a ticket is £11. Check: $3 \\times (11 + 4) = 45$ ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Solve $4(x + 2) = 28$.",
            answers: ["5"],
            why: "$x + 2 = 7$, so $x = 5$.",
            retry: {
              prompt: "Solve $3(x + 5) = 24$.",
              answers: ["3"],
              why: "$x + 5 = 8$, so $x = 3$.",
            },
          },
          {
            prompt: "Solve $2(3x - 1) = 22$.",
            answers: ["4"],
            why: "$6x - 2 = 22$, so $6x = 24$ and $x = 4$.",
            retry: {
              prompt: "Solve $5(2x - 1) = 45$.",
              answers: ["5"],
              why: "$2x - 1 = 9$, so $2x = 10$ and $x = 5$.",
            },
          },
          {
            prompt: "Expand $5(x - 2)$.",
            options: ["$5x - 10$", "$5x - 2$", "$x - 10$"],
            answers: ["$5x - 10$"],
            why: "Both terms are multiplied by 5.",
            retry: {
              prompt: "Expand $4(2x + 3)$.",
              options: ["$8x + 12$", "$8x + 3$", "$6x + 7$"],
              answers: ["$8x + 12$"],
              why: "Both terms are multiplied by 4.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-equations",
    id: "y8-equations/fractions",
    before: FRACTIONS,
    title: "Fractions in equations",
    summary: "Clear a fraction by multiplying both sides, then solve.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Splitting the bill",
        text: [
          "Four friends share a meal bill, plus a £6 tip, equally. Each pays £14.",
          "How much was the meal? By the end of this lesson, you can work it out.",
        ],
        picture: { kind: "maths", tex: "\\frac{m + 6}{4} = 14" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What number divided by 3 gives 7?",
        answers: ["21"],
        wrong: [
          {
            answer: "2.33",
            feedback: "That divides 7 by 3. Undo ÷ 3 by multiplying: $7 \\times 3$.",
          },
        ],
        hint: "Undo ÷ 3 by multiplying by 3.",
        done: "$21 \\div 3 = 7$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Solve $2(x + 1) = 16$",
        answers: ["7"],
        wrong: [{ answer: "7.5", feedback: "The 2 multiplies the 1 too: $2x + 2 = 16$." }],
        hint: "Divide both sides by 2 first.",
        done: "$x + 1 = 8$, so $x = 7$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Undo a divide",
        text: [
          "A fraction line means divide. Multiplying undoes it.",
          "So multiply **both sides** by the bottom number, and the fraction is gone.",
        ],
        picture: { kind: "maths", tex: "\\frac{x}{4} = 3 \\;\\xrightarrow{\\times 4}\\; x = 12" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Multiply both sides of $\\frac{x + 5}{3} = 4$ by 3",
        options: [
          {
            text: "$x + 5 = 12$",
            correct: true,
            feedback: "All of $x + 5$ was divided by 3, so all of it comes back.",
          },
          {
            text: "$x + 5 = \\frac{4}{3}$",
            feedback: "That divides. Multiplying by 3 undoes ÷ 3.",
          },
          {
            text: "$3x + 5 = 12$",
            feedback: "All of $x + 5$ was divided by 3, so all of it comes back: $x + 5$.",
          },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Undo the − 2 first",
        problem: "Solve $\\frac{x}{5} - 2 = 3$.",
        steps: [
          {
            line: "$\\frac{x}{5} = 5$",
            why: "Add 2 to both sides. Only x is divided by 5, so undo the − 2 first.",
          },
          { line: "$x = 25$", why: "Multiply both sides by 5." },
        ],
        done: "Check: $\\frac{25}{5} - 2 = 5 - 2 = 3$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Solve $\\frac{x + 5}{3} = 4$",
        start: "$\\frac{x + 5}{3} = 4$",
        stages: [
          {
            prompt: "All of $x + 5$ is divided by 3. Multiply both sides by 3:",
            options: [
              { text: "$x + 5 = 12$", correct: true, feedback: "" },
              {
                text: "$x + 5 = \\frac{4}{3}$",
                feedback: "That divides. Multiplying by 3 undoes ÷ 3.",
              },
              {
                text: "$3x + 5 = 12$",
                feedback: "All of $x + 5$ was divided by 3, so all of it comes back.",
              },
            ],
            then: "$x + 5 = 12$",
          },
          {
            prompt: "Take 5 from both sides:",
            options: [
              { text: "$x = 7$", correct: true, feedback: "" },
              { text: "$x = 17$", feedback: "Take 5 away, don't add it." },
            ],
            then: "$x = 7$",
          },
        ],
        done: "Check: $\\frac{7 + 5}{3} = \\frac{12}{3} = 4$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Solve $\\frac{x - 3}{4} = 5$",
        text: "One more together, step by step.",
        start: "$\\frac{x - 3}{4} = 5$",
        stages: [
          {
            prompt: "All of $x - 3$ is divided by 4. Multiply both sides by 4:",
            options: [
              { text: "$x - 3 = 20$", correct: true, feedback: "" },
              {
                text: "$x - 3 = \\frac{5}{4}$",
                feedback: "That divides. Multiplying by 4 undoes ÷ 4.",
              },
              { text: "$4x - 3 = 20$", feedback: "All of $x - 3$ comes back." },
            ],
            then: "$x - 3 = 20$",
          },
          {
            prompt: "Add 3 to both sides:",
            options: [
              { text: "$x = 23$", correct: true, feedback: "" },
              { text: "$x = 17$", feedback: "Undo − 3 by adding 3." },
            ],
            then: "$x = 23$",
          },
        ],
        done: "Check: $\\frac{23 - 3}{4} = 5$ ✓. Now try some on your own.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Solve $\\frac{x}{4} + 2 = 5$",
        answers: ["12"],
        wrong: [{ answer: "28", feedback: "Undo the + 2 first: $\\frac{x}{4} = 3$." }],
        hint: "Only x is divided by 4, so undo the + 2 first, then the ÷ 4.",
        done: "$\\frac{x}{4} = 3$, so $x = 12$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Solve $\\frac{2x + 1}{3} = 5$",
        answers: ["7"],
        wrong: [{ answer: "2", feedback: "Multiply both sides by 3 first: $2x + 1 = 15$." }],
        hint: "All of $2x + 1$ is divided by 3. Multiply both sides by 3 first.",
        done: "$2x + 1 = 15$, so $2x = 14$ and $x = 7$.",
      },
      {
        kind: "sort",
        tag: "Your turn",
        title: "Which first?",
        text: "Sort the equations by the best first step.",
        groups: ["Multiply both sides first", "Undo the + or − first"],
        items: [
          { text: "$\\frac{x + 2}{5} = 3$", group: 0, why: "All of $x + 2$ is divided by 5." },
          { text: "$\\frac{x - 1}{4} = 2$", group: 0, why: "All of $x - 1$ is divided by 4." },
          {
            text: "$\\frac{x}{5} + 2 = 3$",
            group: 1,
            why: "Only x is divided by 5; the + 2 was done last.",
          },
          {
            text: "$\\frac{x}{4} - 1 = 2$",
            group: 1,
            why: "Only x is divided by 4; the − 1 was done last.",
          },
        ],
        done: "Look at what's on top of the fraction: undo the last thing that was done first.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "To solve $\\frac{x}{4} = 3$, Kim writes $x = \\frac34$. Is she right?",
        options: [
          {
            text: "No: undo ÷ 4 by multiplying by 4: $x = 12$",
            correct: true,
            feedback: "Check: $12 \\div 4 = 3$ ✓. $\\frac34 \\div 4$ is far less than 3.",
          },
          { text: "Yes", feedback: "Dividing again makes it smaller still. Undo the division." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Lily solves $\\frac{x}{3} + 4 = 10$.",
        lines: ["$\\frac{x}{3} + 4 = 10$", "$x + 4 = 30$", "$x = 26$"],
        wrong: 1,
        why: "Multiplying both sides by 3 multiplies the 4 too: $x + 12 = 30$, so $x = 18$. Simpler: take the 4 first, $\\frac{x}{3} = 6$, so $x = 18$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "Splitting the bill",
        text: "The meal, m, plus a £6 tip, shared by four, is £14 each: $\\frac{m + 6}{4} = 14$. How much was the meal, in £?",
        picture: { kind: "maths", tex: "\\frac{m + 6}{4} = 14" },
        answers: ["50"],
        wrong: [
          { answer: "56", feedback: "£56 is the whole bill, tip included. Take off the tip." },
          { answer: "2", feedback: "Multiply both sides by 4 first: $m + 6 = 56$." },
        ],
        hint: "Multiply both sides by 4 first.",
        done: "$m + 6 = 56$, so the meal was £50. Check: $\\frac{50 + 6}{4} = 14$ ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Solve $\\frac{x}{6} = 4$.",
            answers: ["24"],
            why: "Multiply both sides by 6.",
            retry: {
              prompt: "Solve $\\frac{x}{7} = 3$.",
              answers: ["21"],
              why: "Multiply both sides by 7.",
            },
          },
          {
            prompt: "Solve $\\frac{x + 3}{2} = 8$.",
            answers: ["13"],
            why: "$x + 3 = 16$, so $x = 13$.",
            retry: {
              prompt: "Solve $\\frac{x - 4}{5} = 3$.",
              answers: ["19"],
              why: "$x - 4 = 15$, so $x = 19$.",
            },
          },
          {
            prompt: "Solve $\\frac{x}{3} - 1 = 4$.",
            answers: ["15"],
            why: "$\\frac{x}{3} = 5$, so $x = 15$.",
            retry: {
              prompt: "Solve $\\frac{x}{2} + 5 = 9$.",
              answers: ["8"],
              why: "$\\frac{x}{2} = 4$, so $x = 8$.",
            },
          },
        ],
      },
    ],
  },
];
