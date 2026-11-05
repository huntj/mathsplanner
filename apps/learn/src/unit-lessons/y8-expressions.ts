// Year 8, "Expressions and sequences", as four short lessons, one just before each skill:
// expanding two brackets as the four pieces of a rectangle, then with negatives; writing
// situations as expressions and formulae; and finding the nth term of an arithmetic sequence from
// its difference. Each starts from something quick, builds the idea a step at a time, names the
// common mistakes, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const POSITIVE = "Y8-ALG-01.a";
const NEGATIVE = "Y8-ALG-01.b";
const MODEL = "Y8-ALG-03";
const NTH = "Y8-ALG-09";

export const y8Expressions: UnitLesson[] = [
  {
    unit: "y8-expressions",
    id: "y8-expressions/two-brackets",
    before: POSITIVE,
    title: "Two brackets",
    summary: "Two brackets make a rectangle: find its four pieces and add them.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A growing garden",
        text: [
          "A square garden is $x$ metres each way. The owner makes it 3 m longer and 2 m wider: $(x + 3)$ by $(x + 2)$.",
          "What is its new area, without brackets? By the end of this lesson, you can multiply it out.",
        ],
        picture: {
          kind: "table",
          head: ["×", "$x$", "$+3$"],
          rows: [
            ["$x$", "?", "?"],
            ["$+2$", "?", "?"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Expand $3(x + 2)$",
        answers: ["3x+6"],
        wrong: [{ answer: "3x+2", feedback: "Multiply both terms by 3: $3 \\times 2 = 6$." }],
        hint: "Multiply each term inside by 3.",
        done: "$3(x + 2) = 3x + 6$.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "What is $x \\times x$?",
        options: [
          { text: "$x^2$", correct: true, feedback: "x times itself is x squared." },
          { text: "$2x$", feedback: "$2x$ is $x + x$. Times gives $x^2$." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Two brackets make a rectangle",
        text: [
          "$(x + 3)(x + 2)$ is the area of a rectangle $x + 3$ long and $x + 2$ wide.",
          "Split it into four pieces: multiply each part of one bracket by each part of the other. Then add them up.",
        ],
        picture: {
          kind: "table",
          head: ["×", "$x$", "$+3$"],
          rows: [
            ["$x$", "$x^2$", "$3x$"],
            ["$+2$", "$2x$", "$6$"],
          ],
        },
      },
      {
        kind: "fill",
        tag: "Discover",
        title: "Expand $(x + 4)(x + 5)$",
        picture: {
          kind: "table",
          head: ["×", "$x$", "$+4$"],
          rows: [
            ["$x$", "$x^2$", "$4x$"],
            ["$+5$", "$5x$", "$20$"],
          ],
        },
        template: "$(x + 4)(x + 5) = x^2 +$ [] $+$ []",
        bank: ["$9x$", "$20x$", "$x$", "$9$", "$20$"],
        answers: ["$9x$", "$20$"],
        hint: "Add the two x pieces, $4x + 5x$. The number piece is $4 \\times 5$.",
        done: "$x^2 + 9x + 20$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Spot the pattern",
        text: "$(x + 3)(x + 2) = x^2 + 5x + 6$ and $(x + 4)(x + 5) = x^2 + 9x + 20$. In $(x + a)(x + b)$, the number in front of $x$ is",
        options: [
          {
            text: "$a + b$",
            correct: true,
            feedback: "3 + 2 = 5 and 4 + 5 = 9. And the number at the end is $a \\times b$.",
          },
          { text: "$a \\times b$", feedback: "That gives the number at the end: 6 and 20." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Expand $(x + 6)(x + 1)$",
        problem: "Expand and simplify $(x + 6)(x + 1)$.",
        steps: [
          { line: "$x \\times x = x^2$", why: "Firsts." },
          { line: "$x \\times 1 = x$ and $6 \\times x = 6x$", why: "The two x pieces." },
          { line: "$6 \\times 1 = 6$", why: "The numbers." },
          { line: "$x^2 + 7x + 6$", why: "Collect the x terms: $x + 6x = 7x$." },
        ],
        done: "Four pieces, then collect like terms.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Expand $(x + 2)(x + 7)$",
        start: "$(x + 2)(x + 7)$",
        stages: [
          {
            prompt: "The four pieces are",
            options: [
              { text: "$x^2 + 7x + 2x + 14$", correct: true, feedback: "" },
              {
                text: "$x^2 + 14$",
                feedback: "There are four pieces: don't forget the two x pieces.",
              },
            ],
            then: "$= x^2 + 7x + 2x + 14$",
          },
          {
            prompt: "Collect the x terms:",
            options: [
              { text: "$x^2 + 9x + 14$", correct: true, feedback: "" },
              { text: "$x^2 + 14x + 14$", feedback: "$7x + 2x$ is $9x$: add, don't multiply." },
            ],
            then: "$= x^2 + 9x + 14$",
          },
        ],
        done: "$(x + 2)(x + 7) = x^2 + 9x + 14$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Expand $(2x + 1)(x + 3)$",
        start: "$(2x + 1)(x + 3)$",
        stages: [
          {
            prompt: "$2x \\times x$ is",
            options: [
              { text: "$2x^2$", correct: true, feedback: "" },
              { text: "$3x$", feedback: "Multiply: $2 \\times x \\times x = 2x^2$." },
            ],
            then: "$2x^2$",
          },
          {
            prompt: "The x pieces are $2x \\times 3$ and $1 \\times x$. Together:",
            options: [
              { text: "$7x$", correct: true, feedback: "" },
              { text: "$4x$", feedback: "$2x \\times 3 = 6x$, plus $x$." },
            ],
            then: "$2x^2 + 7x + 3$",
          },
        ],
        done: "With a number in front of x, the a + b shortcut doesn't work. The grid always does.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Expand $(x + 3)(x + 8)$",
        template: "$(x + 3)(x + 8) = x^2 +$ [] $+$ []",
        bank: ["$11x$", "$24x$", "$11$", "$24$"],
        answers: ["$11x$", "$24$"],
        hint: "$3x + 8x$, and $3 \\times 8$.",
        done: "$x^2 + 11x + 24$.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Expand $(x + 5)(x + 5)$",
        options: [
          {
            text: "$x^2 + 10x + 25$",
            correct: true,
            feedback: "$5x + 5x = 10x$ and $5 \\times 5 = 25$.",
          },
          { text: "$x^2 + 25$", feedback: "Don't forget the two $5x$ pieces." },
          { text: "$x^2 + 10x + 10$", feedback: "$5 \\times 5 = 25$." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Kai says $(x + 3)^2 = x^2 + 9$. Is he right?",
        options: [
          {
            text: "No: $(x + 3)(x + 3) = x^2 + 6x + 9$",
            correct: true,
            feedback: "Squaring a bracket means two brackets. There are four pieces, not two.",
          },
          {
            text: "Yes: square each term",
            feedback: "Try x = 1: $(1 + 3)^2 = 16$, but $1 + 9 = 10$.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Eve expands $(x + 4)(x + 3)$.",
        lines: ["$x \\times x = x^2$", "$4 \\times 3 = 12$", "$(x + 4)(x + 3) = x^2 + 12$"],
        wrong: 2,
        why: "She missed two pieces: $3x$ and $4x$. It's $x^2 + 7x + 12$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The garden, $(x + 3)$ by $(x + 2)$",
        text: "What is its area, without brackets?",
        options: [
          {
            text: "$x^2 + 5x + 6$",
            correct: true,
            feedback: "The four pieces: $x^2$, $3x$, $2x$ and $6$.",
          },
          { text: "$x^2 + 6$", feedback: "Two of the pieces are missing." },
          {
            text: "$x^2 + 6x + 5$",
            feedback: "Add 3 and 2 for the x term; multiply them for the number.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Expand $(x + 1)(x + 4)$.",
            options: ["$x^2 + 5x + 4$", "$x^2 + 4x + 5$", "$x^2 + 4$"],
            answers: ["$x^2 + 5x + 4$"],
            why: "$1 + 4 = 5$ and $1 \\times 4 = 4$.",
            retry: {
              prompt: "Expand $(x + 2)(x + 6)$.",
              options: ["$x^2 + 8x + 12$", "$x^2 + 12x + 8$", "$x^2 + 12$"],
              answers: ["$x^2 + 8x + 12$"],
              why: "$2 + 6 = 8$ and $2 \\times 6 = 12$.",
            },
          },
          {
            prompt: "Expand $(x + 4)^2$.",
            options: ["$x^2 + 8x + 16$", "$x^2 + 16$", "$x^2 + 4x + 16$"],
            answers: ["$x^2 + 8x + 16$"],
            why: "$(x + 4)(x + 4)$: $4x + 4x = 8x$.",
            retry: {
              prompt: "Expand $(x + 6)^2$.",
              options: ["$x^2 + 12x + 36$", "$x^2 + 36$", "$x^2 + 6x + 36$"],
              answers: ["$x^2 + 12x + 36$"],
              why: "$(x + 6)(x + 6)$: $6x + 6x = 12x$.",
            },
          },
          {
            prompt: "Expand $(3x + 2)(x + 1)$.",
            options: ["$3x^2 + 5x + 2$", "$3x^2 + 3x + 2$", "$4x^2 + 5x + 2$"],
            answers: ["$3x^2 + 5x + 2$"],
            why: "$3x \\times 1 + 2 \\times x = 5x$.",
            retry: {
              prompt: "Expand $(2x + 3)(x + 2)$.",
              options: ["$2x^2 + 7x + 6$", "$2x^2 + 5x + 6$", "$3x^2 + 7x + 6$"],
              answers: ["$2x^2 + 7x + 6$"],
              why: "$2x \\times 2 + 3 \\times x = 7x$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-expressions",
    id: "y8-expressions/negatives",
    before: NEGATIVE,
    title: "Brackets with negatives",
    summary: "Keep each sign with its number, and the grid does the rest.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A trimmed photo",
        text: [
          "A square photo is $x$ cm each way. It's cropped 4 cm shorter and made 3 cm wider: $(x - 4)$ by $(x + 3)$.",
          "What's its area without brackets? The minus sign makes it trickier. By the end of this lesson, you can handle it.",
        ],
        picture: {
          kind: "table",
          head: ["×", "$x$", "$-4$"],
          rows: [
            ["$x$", "?", "?"],
            ["$+3$", "?", "?"],
          ],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $-4 \\times 3$",
        answers: ["-12"],
        wrong: [{ answer: "12", feedback: "A negative times a positive is negative." }],
        hint: "Different signs give a negative.",
        done: "$-4 \\times 3 = -12$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $-5 \\times -2$",
        answers: ["10"],
        wrong: [{ answer: "-10", feedback: "Two negatives multiply to a positive." }],
        hint: "Same signs give a positive.",
        done: "$-5 \\times -2 = 10$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Keep the sign with its number",
        text: [
          "In $(x - 4)$, think of the pieces as $x$ and $-4$. The minus belongs to the 4.",
          "Put $-4$ in the grid, then multiply as usual, using the sign rules.",
        ],
        picture: {
          kind: "table",
          head: ["×", "$x$", "$-4$"],
          rows: [
            ["$x$", "$x^2$", "$-4x$"],
            ["$+3$", "$3x$", "$-12$"],
          ],
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Collect $3x - 4x$",
        options: [
          { text: "$-x$", correct: true, feedback: "3 take away 4 is −1, so $-1x$, written $-x$." },
          { text: "$7x$", feedback: "It's $3x$ take away $4x$." },
          { text: "$x$", feedback: "3 − 4 is −1, not 1." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Expand $(x - 4)(x + 3)$",
        problem: "Expand and simplify $(x - 4)(x + 3)$.",
        steps: [
          { line: "$x^2$", why: "$x \\times x$." },
          { line: "$+3x$ and $-4x$", why: "$x \\times 3$ and $-4 \\times x$." },
          { line: "$-12$", why: "$-4 \\times 3$." },
          { line: "$x^2 - x - 12$", why: "$3x - 4x = -x$." },
        ],
        done: "Check with the pattern: $-4 + 3 = -1$ and $-4 \\times 3 = -12$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Expand $(x - 5)(x - 2)$",
        start: "$(x - 5)(x - 2)$",
        stages: [
          {
            prompt: "The x pieces are $-5x$ and $-2x$. Together:",
            options: [
              { text: "$-7x$", correct: true, feedback: "" },
              { text: "$-3x$", feedback: "Both are negative: $-5 - 2 = -7$." },
            ],
            then: "$x^2 - 7x \\ldots$",
          },
          {
            prompt: "The number piece is $-5 \\times -2$:",
            options: [
              { text: "$+10$", correct: true, feedback: "" },
              { text: "$-10$", feedback: "Two negatives multiply to a positive." },
            ],
            then: "$x^2 - 7x + 10$",
          },
        ],
        done: "$(x - 5)(x - 2) = x^2 - 7x + 10$.",
      },
      {
        kind: "fill",
        tag: "Together",
        title: "Expand $(x + 6)(x - 2)$",
        template: "$(x + 6)(x - 2) = x^2$ [] []",
        bank: ["$+4x$", "$-4x$", "$+8x$", "$-12$", "$+12$"],
        answers: ["$+4x$", "$-12$"],
        hint: "$6 + -2$ for the x term, and $6 \\times -2$ for the number.",
        done: "$x^2 + 4x - 12$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Expand $(2x - 3)(x + 4)$",
        start: "$(2x - 3)(x + 4)$",
        stages: [
          {
            prompt: "The x pieces are $2x \\times 4$ and $-3 \\times x$. Together:",
            options: [
              { text: "$5x$", correct: true, feedback: "" },
              { text: "$11x$", feedback: "$8x$ and $-3x$: take 3 from 8." },
            ],
            then: "$2x^2 + 5x \\ldots$",
          },
          {
            prompt: "The number piece is $-3 \\times 4$:",
            options: [
              { text: "$-12$", correct: true, feedback: "" },
              { text: "$+12$", feedback: "Different signs give a negative." },
            ],
            then: "$2x^2 + 5x - 12$",
          },
        ],
        done: "The grid works whatever the numbers in front.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Expand $(x - 3)(x - 4)$",
        options: [
          {
            text: "$x^2 - 7x + 12$",
            correct: true,
            feedback: "$-3 - 4 = -7$ and $-3 \\times -4 = 12$.",
          },
          { text: "$x^2 - 7x - 12$", feedback: "$-3 \\times -4$ is positive." },
          { text: "$x^2 + 7x + 12$", feedback: "$-3x - 4x = -7x$." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Expand $(x + 2)(x - 9)$",
        options: [
          {
            text: "$x^2 - 7x - 18$",
            correct: true,
            feedback: "$2 - 9 = -7$ and $2 \\times -9 = -18$.",
          },
          { text: "$x^2 + 7x - 18$", feedback: "$2x - 9x$ is $-7x$." },
          { text: "$x^2 - 7x + 18$", feedback: "$2 \\times -9$ is negative." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Mo says $(x - 3)^2 = x^2 + 9$. What's wrong?",
        options: [
          {
            text: "It's $(x - 3)(x - 3) = x^2 - 6x + 9$",
            correct: true,
            feedback: "Four pieces: $x^2$, $-3x$, $-3x$ and $+9$. Don't drop the middle.",
          },
          {
            text: "It should be $x^2 - 9$",
            feedback: "$-3 \\times -3 = +9$, and the middle $-6x$ is missing.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ola expands $(x - 6)(x - 1)$.",
        lines: ["$x^2 - x - 6x$", "$-6 \\times -1 = -6$", "$x^2 - 7x - 6$"],
        wrong: 1,
        why: "Two negatives multiply to a positive: $-6 \\times -1 = +6$. So $x^2 - 7x + 6$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "The photo, $(x - 4)$ by $(x + 3)$",
        text: "What's its area, without brackets?",
        options: [
          {
            text: "$x^2 - x - 12$",
            correct: true,
            feedback: "$3x - 4x = -x$ and $-4 \\times 3 = -12$.",
          },
          { text: "$x^2 + 7x - 12$", feedback: "Keep the minus with the 4: $-4x + 3x = -x$." },
          { text: "$x^2 - x + 12$", feedback: "$-4 \\times 3$ is negative." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Expand $(x - 2)(x + 5)$.",
            options: ["$x^2 + 3x - 10$", "$x^2 - 3x - 10$", "$x^2 + 3x + 10$"],
            answers: ["$x^2 + 3x - 10$"],
            why: "$-2 + 5 = 3$ and $-2 \\times 5 = -10$.",
            retry: {
              prompt: "Expand $(x - 1)(x + 7)$.",
              options: ["$x^2 + 6x - 7$", "$x^2 - 6x - 7$", "$x^2 + 6x + 7$"],
              answers: ["$x^2 + 6x - 7$"],
              why: "$-1 + 7 = 6$ and $-1 \\times 7 = -7$.",
            },
          },
          {
            prompt: "Expand $(x - 4)(x - 5)$.",
            options: ["$x^2 - 9x + 20$", "$x^2 - 9x - 20$", "$x^2 + 9x + 20$"],
            answers: ["$x^2 - 9x + 20$"],
            why: "Two negatives multiply to $+20$.",
            retry: {
              prompt: "Expand $(x - 2)(x - 8)$.",
              options: ["$x^2 - 10x + 16$", "$x^2 - 10x - 16$", "$x^2 + 10x + 16$"],
              answers: ["$x^2 - 10x + 16$"],
              why: "Two negatives multiply to $+16$.",
            },
          },
          {
            prompt: "Expand $(x - 5)^2$.",
            options: ["$x^2 - 10x + 25$", "$x^2 + 25$", "$x^2 - 25$"],
            answers: ["$x^2 - 10x + 25$"],
            why: "$(x - 5)(x - 5)$: $-5x - 5x = -10x$, and $-5 \\times -5 = 25$.",
            retry: {
              prompt: "Expand $(x - 7)^2$.",
              options: ["$x^2 - 14x + 49$", "$x^2 + 49$", "$x^2 - 49$"],
              answers: ["$x^2 - 14x + 49$"],
              why: "$(x - 7)(x - 7)$: $-7x - 7x = -14x$, and $-7 \\times -7 = 49$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-expressions",
    id: "y8-expressions/model",
    before: MODEL,
    title: "Write it in algebra",
    summary: "Turn a situation into an expression or formula, and see it as a graph.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The taxi fare",
        text: [
          "A taxi charges £3 to start, plus £2 for every mile. How much for 4 miles? For 10? For any number of miles?",
          "A formula answers every one at once. By the end of this lesson, you can write it, and draw it.",
        ],
        picture: {
          kind: "table",
          head: ["Miles", "1", "2", "3"],
          rows: [["Cost (£)", "5", "7", "9"]],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "The taxi: how much, in pounds, for 4 miles?",
        text: "£3, plus £2 a mile.",
        answers: ["11"],
        wrong: [{ answer: "8", feedback: "That's the miles. Add the £3 start charge." }],
        hint: "$3 + 2 \\times 4$.",
        done: "£3 + £8 = £11.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Pens cost 40p each. How much, in pence, for 5 pens?",
        answers: ["200"],
        hint: "$5 \\times 40$.",
        done: "200p, which is £2.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Letters for numbers that change",
        text: [
          "The miles change, so call them $m$. Each mile costs £2: that's $2m$. Then add the £3 once.",
          "The cost is $C = 2m + 3$. That's a **formula**: it links two things that change.",
        ],
        picture: { kind: "maths", tex: "C = 2m + 3" },
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The formula as a graph",
        text: [
          "Plot the cost for each number of miles: the points lie on a straight line.",
          "It starts at £3 (when m = 0) and goes up £2 for every mile.",
        ],
        picture: {
          kind: "graph",
          range: { xMin: 0, xMax: 6, yMin: 0, yMax: 15 },
          lines: [{ m: 2, c: 3 }],
          points: [
            { x: 0, y: 3 },
            { x: 3, y: 9 },
            { x: 6, y: 15 },
          ],
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Tickets and popcorn",
        problem:
          "Tickets cost £8 each, and one popcorn costs £5. Write the cost of $n$ tickets and one popcorn.",
        steps: [
          { line: "$n$ tickets: $8n$", why: "£8 for each one." },
          { line: "One popcorn: $+5$", why: "Bought once, so no $n$." },
          { line: "$C = 8n + 5$", why: "Put them together." },
        ],
        done: "The thing that happens n times gets the n.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "The perimeter",
        start: "A rectangle is $x$ cm wide and 5 cm longer than it is wide.",
        stages: [
          {
            prompt: "Its length is",
            options: [
              { text: "$x + 5$", correct: true, feedback: "" },
              { text: "$5x$", feedback: "5 cm *longer*, so add 5." },
            ],
            then: "Sides: $x$, $x + 5$, $x$, $x + 5$",
          },
          {
            prompt: "Add all four sides:",
            options: [
              { text: "$4x + 10$", correct: true, feedback: "" },
              { text: "$2x + 5$", feedback: "That's only two sides." },
            ],
            then: "$P = 4x + 10$",
          },
        ],
        done: "Draw the shape and label each side first.",
      },
      {
        kind: "choice",
        tag: "Together",
        title:
          "A phone plan costs £10 a month plus 5p a text. Which formula gives the cost in pence for $t$ texts?",
        options: [
          {
            text: "$C = 5t + 1000$",
            correct: true,
            feedback: "5p for each text, plus £10 = 1000p once.",
          },
          { text: "$C = 5t + 10$", feedback: "Use the same units: £10 is 1000p." },
          { text: "$C = 1005t$", feedback: "The £10 is paid once, not per text." },
        ],
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Write it",
        text: "A plumber charges £40 to call out, plus £25 an hour. Write the cost $C$ for $h$ hours.",
        answers: ["C=25h+40", "C=40+25h", "25h+40", "40+25h"],
        wrong: [{ answer: "C=40h+25", feedback: "Which part happens every hour?" }],
        hint: "£25 for each hour, plus £40 once.",
        done: "$C = 25h + 40$.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Sam is $s$ years old. His sister is 3 years younger. Their ages add to",
        options: [
          { text: "$2s - 3$", correct: true, feedback: "$s + (s - 3) = 2s - 3$." },
          { text: "$s - 3$", feedback: "That's only the sister's age." },
          { text: "$3s$", feedback: "Younger means take 3 away, and add the two ages." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Tickets £8 each, one popcorn £5. Ali writes $C = 13n$. What's wrong?",
        options: [
          {
            text: "That buys a popcorn with every ticket",
            correct: true,
            feedback: "Only the part that happens n times gets multiplied by n: $8n + 5$.",
          },
          { text: "Nothing", feedback: "For 2 tickets, $13n$ gives £26, but it's £21." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "A gym charges £20 to join and £15 a month. Jay writes the cost for $m$ months.",
        lines: ["Each month: £15", "Joining: £20, once", "$C = 20m + 15$"],
        wrong: 2,
        why: "The £15 happens every month, so it gets the m: $C = 15m + 20$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The taxi: $C = 2m + 3$",
        text: "Use the formula to find the cost of 10 miles, in pounds.",
        answers: ["23"],
        wrong: [{ answer: "50", feedback: "Work out $2 \\times 10$ first, then add 3." }],
        hint: "$2 \\times 10 + 3$.",
        done: "£23. And the formula works for any number of miles.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt:
              "Apples cost 30p each and a bag costs 10p. The cost in pence of $a$ apples and one bag is",
            options: ["$30a + 10$", "$40a$", "$10a + 30$"],
            answers: ["$30a + 10$"],
            why: "30p for each apple, plus the bag once.",
            retry: {
              prompt:
                "Stickers cost 20p each and an envelope costs 50p. The cost in pence of $s$ stickers and one envelope is",
              options: ["$20s + 50$", "$70s$", "$50s + 20$"],
              answers: ["$20s + 50$"],
              why: "20p for each sticker, plus the envelope once.",
            },
          },
          {
            prompt: "A square has side $x + 2$. Its perimeter is",
            options: ["$4x + 8$", "$4x + 2$", "$x + 8$"],
            answers: ["$4x + 8$"],
            why: "$4(x + 2) = 4x + 8$.",
            retry: {
              prompt: "A square has side $x + 3$. Its perimeter is",
              options: ["$4x + 12$", "$4x + 3$", "$x + 12$"],
              answers: ["$4x + 12$"],
              why: "$4(x + 3) = 4x + 12$.",
            },
          },
          {
            prompt: "$C = 5n + 2$. Find $C$ when $n = 4$.",
            options: ["22", "28", "11"],
            answers: ["22"],
            why: "$5 \\times 4 + 2 = 22$.",
            retry: {
              prompt: "$C = 3n + 7$. Find $C$ when $n = 6$.",
              options: ["25", "60", "16"],
              answers: ["25"],
              why: "$3 \\times 6 + 7 = 25$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y8-expressions",
    id: "y8-expressions/nth-term",
    before: NTH,
    title: "The nth term",
    summary: "The difference tells you the times table; adjust to fit the first term.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Matchstick pentagons",
        text: [
          "A row of pentagons is made from matchsticks, each sharing a side with the next. 1 pentagon needs 5 sticks, 2 need 9, 3 need 13…",
          "How many sticks for 100 pentagons? Counting on would take ages. By the end of this lesson, you can jump straight there.",
        ],
        picture: { kind: "maths", tex: "5,\\ 9,\\ 13,\\ 17,\\ \\ldots" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What comes next? 5, 9, 13, 17, …",
        answers: ["21"],
        hint: "It goes up 4 each time.",
        done: "Up 4: 21.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Work out $4 \\times 10 + 1$",
        answers: ["41"],
        hint: "Times first, then add.",
        done: "$40 + 1 = 41$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Compare with a times table",
        text: [
          "5, 9, 13, 17 goes up 4 each time, just like the 4 times table: 4, 8, 12, 16.",
          "Each term is exactly **1 more** than the 4 times table. So term number $n$ is $4n + 1$.",
        ],
        picture: {
          kind: "table",
          head: ["n", "1", "2", "3", "4"],
          rows: [
            ["4n", "4", "8", "12", "16"],
            ["term", "5", "9", "13", "17"],
          ],
        },
      },
      {
        kind: "machine",
        tag: "Discover",
        title: "Find the rule for any term",
        rule: { m: 3, c: 4 },
        inputs: [1, 2, 3, 4, 5],
        shown: 2,
        decoys: { 3: [14, 12], 4: [17, 12], 5: [20, 15] },
        ports: ["n", "term"],
        done: "Up 3 each time, so it starts with $3n$. $3n$ gives 3, 6, 9…, each 4 less than the terms, so the nth term is $3n + 4$.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Find the nth term of 7, 12, 17, 22, …",
        problem: "Find the nth term of 7, 12, 17, 22, …",
        steps: [
          { line: "Difference: +5", why: "So it's the 5 times table, shifted." },
          { line: "$5n$: 5, 10, 15, 20", why: "Write the times table under it." },
          { line: "Each term is 2 more", why: "7 − 5 = 2." },
          { line: "nth term $= 5n + 2$", why: "Check: $5 \\times 3 + 2 = 17$. ✓" },
        ],
        done: "Difference, times table, adjust, check.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Find the nth term",
        start: "$5, 9, 13, 17, \\ldots$",
        stages: [
          {
            prompt: "What is the common difference?",
            options: [
              { text: "$4$", correct: true, feedback: "" },
              { text: "$5$", feedback: "5 is the first term. How much does each term go up?" },
            ],
            then: "Up 4 each time, so it starts $4n$.",
          },
          {
            prompt: "$4n$ gives 4, 8, 12, 16. How far off are the terms?",
            options: [
              { text: "1 more", correct: true, feedback: "" },
              { text: "1 less", feedback: "5 is 1 more than 4." },
            ],
            then: "nth term $= 4n + 1$",
          },
        ],
        done: "Check: the 10th term is $4 \\times 10 + 1 = 41$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A sequence below its times table",
        start: "$4, 10, 16, 22, \\ldots$",
        stages: [
          {
            prompt: "The difference is 6, so it starts",
            options: [
              { text: "$6n$", correct: true, feedback: "" },
              { text: "$4n$", feedback: "4 is the first term; the difference is 6." },
            ],
            then: "$6n$: 6, 12, 18, 24",
          },
          {
            prompt: "The terms are 2 less than $6n$. So the nth term is",
            options: [
              { text: "$6n - 2$", correct: true, feedback: "" },
              { text: "$6n + 2$", feedback: "4 is 2 *less* than 6." },
            ],
            then: "$6n - 2$",
          },
        ],
        done: "Check: $6 \\times 2 - 2 = 10$. ✓",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Find the nth term of 8, 11, 14, 17, …",
        answers: ["3n+5", "5+3n"],
        wrong: [{ answer: "8n+3", feedback: "The difference goes in front of n: it's 3." }],
        hint: "Up 3 each time. $3n$ gives 3, 6, 9… How far off?",
        done: "$3n + 5$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Going down: 20, 17, 14, 11, …",
        text: "Find the nth term.",
        answers: ["23-3n", "-3n+23"],
        wrong: [
          { answer: "3n+17", feedback: "It goes down by 3, so it starts $-3n$." },
          {
            answer: "-3n+20",
            feedback: "$-3n$ gives −3 for the 1st term. What do you add to make 20?",
          },
        ],
        hint: "Down 3 each time: $-3n$ gives −3, −6, −9… How far off are the terms?",
        done: "$-3n$ gives −3, −6, −9; the terms are 23 more: $23 - 3n$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Lily says the nth term of 5, 9, 13, … is $n + 4$, because it goes up 4. Is she right?",
        options: [
          {
            text: "No: up 4 each time means $4n$, so it's $4n + 1$",
            correct: true,
            feedback: "$n + 4$ gives 5, 6, 7: it only goes up 1. The difference multiplies n.",
          },
          { text: "Yes", feedback: "Try n = 2: $2 + 4 = 6$, but the 2nd term is 9." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Raf finds the nth term of 6, 8, 10, 12, …",
        lines: ["The difference is 2", "$2n$: 2, 4, 6, 8", "Each term is 4 more, so $4n + 2$"],
        wrong: 2,
        why: "The difference goes in front of n: $2n + 4$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "The pentagons: 5, 9, 13, …",
        text: "The nth term is $4n + 1$. How many matchsticks for 100 pentagons?",
        answers: ["401"],
        wrong: [{ answer: "400", feedback: "$4 \\times 100$, then add 1." }],
        hint: "$4 \\times 100 + 1$.",
        done: "401, no counting needed.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The nth term of 3, 5, 7, 9, … is",
            options: ["$2n + 1$", "$3n + 2$", "$n + 2$"],
            answers: ["$2n + 1$"],
            why: "Up 2, so $2n$; then 1 more.",
            retry: {
              prompt: "The nth term of 6, 11, 16, 21, … is",
              options: ["$5n + 1$", "$6n + 5$", "$n + 5$"],
              answers: ["$5n + 1$"],
              why: "Up 5, so $5n$; then 1 more.",
            },
          },
          {
            prompt: "The nth term of 1, 4, 7, 10, … is",
            options: ["$3n - 2$", "$3n + 1$", "$n + 3$"],
            answers: ["$3n - 2$"],
            why: "Up 3, so $3n$: 3, 6, 9; each term is 2 less.",
            retry: {
              prompt: "The nth term of 3, 7, 11, 15, … is",
              options: ["$4n - 1$", "$4n + 3$", "$n + 4$"],
              answers: ["$4n - 1$"],
              why: "Up 4, so $4n$: 4, 8, 12; each term is 1 less.",
            },
          },
          {
            prompt: "The nth term is $2n + 7$. What is the 20th term?",
            options: ["47", "29", "54"],
            answers: ["47"],
            why: "$2 \\times 20 + 7 = 47$.",
            retry: {
              prompt: "The nth term is $5n - 3$. What is the 10th term?",
              options: ["47", "53", "22"],
              answers: ["47"],
              why: "$5 \\times 10 - 3 = 47$.",
            },
          },
        ],
      },
    ],
  },
];
