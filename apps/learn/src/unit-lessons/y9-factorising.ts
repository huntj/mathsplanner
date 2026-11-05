// Year 9, "Factorising and proof", as three short lessons, one just before each skill:
// factorising x² + bx + c with positive numbers (a number puzzle: multiply to c, add to b), then
// with negatives (where the signs go), and algebra used to prove a pattern is always true. Each
// starts from something quick, builds the method a step at a time, names the common mistakes, and
// ends on an exit check.
import type { DrawingPic, UnitLesson } from "./types.ts";

const POSITIVE = "Y9-ALG-01.a";
const NEGATIVE = "Y9-ALG-01.b";
const PROVE = "Y9-ALG-03";

/** A rectangle with its area written in, and its sides to find. */
const plot = (area: string): DrawingPic => {
  const c = { x: 4, y: 2.5 };
  const p = [
    { x: 0, y: 0 },
    { x: 8, y: 0 },
    { x: 8, y: 5 },
    { x: 0, y: 5 },
  ];
  return {
    kind: "drawing",
    items: [
      ...p.map((a, k): DrawingPic["items"][number] => ({ line: [a, p[(k + 1) % 4] ?? a] })),
      {
        side: [
          { x: 0, y: 0 },
          { x: 8, y: 0 },
        ],
        label: "x + ?",
        inside: c,
        tone: "find",
      },
      {
        side: [
          { x: 8, y: 0 },
          { x: 8, y: 5 },
        ],
        label: "x + ?",
        inside: c,
        tone: "find",
      },
      { text: area, at: c },
    ],
  };
};

/** The grid that expands (x + a)(x + b). */
const grid = (a: number, b: number) => ({
  kind: "table" as const,
  head: ["×", "$x$", `$+${b}$`],
  rows: [
    ["$x$", "$x^2$", `$${b}x$`],
    [`$+${a}$`, `$${a}x$`, `$${a * b}$`],
  ],
});

export const y9Factorising: UnitLesson[] = [
  {
    unit: "y9-factorising",
    id: "y9-factorising/positive",
    before: POSITIVE,
    title: "Back into brackets",
    summary: "Factorise x² + bx + c: find two numbers that multiply to c and add to b.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "The missing sides",
        text: [
          "A rectangular garden has an area of $x^2 + 9x + 20$ square metres. Each side is x plus a whole number of metres.",
          "How long are the sides? By the end of this lesson, you can find them.",
        ],
        picture: plot("x² + 9x + 20"),
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Expand $(x + 2)(x + 3)$",
        options: [
          { text: "$x^2 + 5x + 6$", correct: true, feedback: "$x^2 + 3x + 2x + 6$." },
          {
            text: "$x^2 + 6$",
            feedback: "Multiply every part by every part: the $3x$ and $2x$ are missing.",
          },
          { text: "$x^2 + 5x + 5$", feedback: "The last term is $2 \\times 3$, not $2 + 3$." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A number puzzle",
        text: "Two numbers multiply to 10 and add to 7. What is the bigger one?",
        answers: ["5"],
        hint: "Pairs that multiply to 10: 1 and 10, 2 and 5. Which adds to 7?",
        done: "2 and 5: $2 \\times 5 = 10$ and $2 + 5 = 7$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Look inside the grid",
        text: [
          "Expanding $(x + 2)(x + 3)$ in a grid gives $x^2 + 3x + 2x + 6 = x^2 + 5x + 6$.",
          "The 6 is $2 \\times 3$. The 5 is $2 + 3$.",
        ],
        picture: grid(2, 3),
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "$(x + 4)(x + 5) = x^2 + 9x + 20$. Where do the 9 and 20 come from?",
        options: [
          {
            text: "$9 = 4 + 5$ and $20 = 4 \\times 5$",
            correct: true,
            feedback: "Always: the numbers add to make the x term and multiply to make the number.",
          },
          { text: "$9 = 4 \\times 5 - 11$", feedback: "Look for something simpler with 4 and 5." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "So, backwards",
        text: [
          "**Factorising** puts it back into brackets. For $x^2 + bx + c$, find two numbers that **multiply to c** and **add to b**.",
          "List the pairs that multiply to c, then pick the one that adds to b.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{aligned} x^2 + bx + c &= (x + p)(x + q) \\\\ \\text{where } pq &= c \\text{ and } p + q = b \\end{aligned}",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Factorise $x^2 + 7x + 10$",
        problem: "Factorise $x^2 + 7x + 10$.",
        steps: [
          { line: "Pairs that multiply to 10: 1 and 10, 2 and 5", why: "List them all." },
          { line: "$1 + 10 = 11$, $2 + 5 = 7$ ✓", why: "Which pair adds to 7?" },
          { line: "$(x + 2)(x + 5)$", why: "Those are the numbers in the brackets." },
        ],
        done: "Check: $(x + 2)(x + 5) = x^2 + 5x + 2x + 10 = x^2 + 7x + 10$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Factorise $x^2 + 6x + 8$",
        start: "$x^2 + 6x + 8$",
        stages: [
          {
            prompt: "Two numbers that multiply to 8 and add to 6:",
            options: [
              { text: "2 and 4", correct: true, feedback: "" },
              { text: "1 and 8", feedback: "They multiply to 8, but add to 9." },
              { text: "3 and 3", feedback: "They add to 6, but multiply to 9." },
            ],
            then: "$2 \\times 4 = 8$, $2 + 4 = 6$",
          },
          {
            prompt: "So",
            options: [
              { text: "$(x + 2)(x + 4)$", correct: true, feedback: "" },
              {
                text: "$(x + 2)(x + 6)$",
                feedback: "The 6 is the sum. The brackets hold the pair, 2 and 4.",
              },
            ],
            then: "$(x + 2)(x + 4)$",
          },
        ],
        done: "Multiply to the number, add to the x's.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Factorise $x^2 + 8x + 12$",
        start: "$x^2 + 8x + 12$",
        stages: [
          {
            prompt: "Pairs that multiply to 12 are 1 and 12, 2 and 6, 3 and 4. Which adds to 8?",
            options: [
              { text: "2 and 6", correct: true, feedback: "" },
              { text: "3 and 4", feedback: "They add to 7." },
              { text: "1 and 12", feedback: "They add to 13." },
            ],
            then: "2 and 6",
          },
          {
            prompt: "So",
            options: [
              { text: "$(x + 2)(x + 6)$", correct: true, feedback: "" },
              { text: "$(x + 3)(x + 4)$", feedback: "That's $x^2 + 7x + 12$." },
            ],
            then: "$(x + 2)(x + 6)$",
          },
        ],
        done: "Listing every pair means you won't miss the right one.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Factorise $x^2 + 7x + 12$",
        template: "$x^2 + 7x + 12 = (x +$ [] $)(x +$ [] $)$",
        bank: ["$1$", "$2$", "$3$", "$4$", "$6$", "$12$"],
        answers: ["$3$", "$4$"],
        anyOrder: true,
        hint: "Pairs that multiply to 12: 1 and 12, 2 and 6, 3 and 4. Which adds to 7?",
        done: "$(x + 3)(x + 4)$. Check: $3 \\times 4 = 12$ and $3 + 4 = 7$ ✓",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Factorise $x^2 + 10x + 21$",
        template: "$x^2 + 10x + 21 = (x +$ [] $)(x +$ [] $)$",
        bank: ["$1$", "$3$", "$7$", "$10$", "$21$"],
        answers: ["$3$", "$7$"],
        anyOrder: true,
        hint: "Pairs that multiply to 21: 1 and 21, 3 and 7.",
        done: "$(x + 3)(x + 7)$: $3 \\times 7 = 21$, $3 + 7 = 10$ ✓",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Is $x^2 + 5x + 6 = (x + 1)(x + 6)$?",
        options: [
          {
            text: "No: 1 and 6 add to 7, not 5",
            correct: true,
            feedback:
              "They multiply to 6, but they must **add to 5** too: $(x + 2)(x + 3)$. Checking only the multiplying is the common slip.",
          },
          {
            text: "Yes: $1 \\times 6 = 6$",
            feedback: "Expand it: $x^2 + 7x + 6$. The pair must add to 5 as well.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Noah factorises $x^2 + 9x + 14$.",
        lines: [
          "Pairs that multiply to 14: 1 and 14, 2 and 7",
          "$2 + 7 = 9$ ✓",
          "So it's $(x + 2)(x + 9)$",
        ],
        wrong: 2,
        why: "The pair is 2 and 7: the 9 is their sum, not a number in the bracket. $(x + 2)(x + 7)$.",
      },
      {
        kind: "fill",
        tag: "Back to the problem",
        title: "The missing sides",
        text: "The garden's area is $x^2 + 9x + 20$.",
        template: "$x^2 + 9x + 20 = (x +$ [] $)(x +$ [] $)$",
        bank: ["$1$", "$2$", "$4$", "$5$", "$9$", "$10$", "$20$"],
        answers: ["$4$", "$5$"],
        anyOrder: true,
        hint: "Two numbers that multiply to 20 and add to 9.",
        done: "The sides are $x + 4$ and $x + 5$ metres. If x is 6, that's a 10 m by 11 m garden: 110 m², and $36 + 54 + 20 = 110$ ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Factorise $x^2 + 5x + 4$.",
            options: ["$(x + 1)(x + 4)$", "$(x + 2)(x + 2)$", "$(x + 1)(x + 5)$"],
            answers: ["$(x + 1)(x + 4)$"],
            why: "1 and 4 multiply to 4 and add to 5.",
            retry: {
              prompt: "Factorise $x^2 + 6x + 5$.",
              options: ["$(x + 1)(x + 5)$", "$(x + 2)(x + 3)$", "$(x + 1)(x + 6)$"],
              answers: ["$(x + 1)(x + 5)$"],
              why: "1 and 5 multiply to 5 and add to 6.",
            },
          },
          {
            prompt: "Factorise $x^2 + 11x + 30$.",
            options: ["$(x + 5)(x + 6)$", "$(x + 3)(x + 10)$", "$(x + 2)(x + 15)$"],
            answers: ["$(x + 5)(x + 6)$"],
            why: "5 and 6 multiply to 30 and add to 11.",
            retry: {
              prompt: "Factorise $x^2 + 9x + 14$.",
              options: ["$(x + 2)(x + 7)$", "$(x + 1)(x + 14)$", "$(x + 2)(x + 9)$"],
              answers: ["$(x + 2)(x + 7)$"],
              why: "2 and 7 multiply to 14 and add to 9.",
            },
          },
          {
            prompt: "Factorise $x^2 + 13x + 12$.",
            options: ["$(x + 1)(x + 12)$", "$(x + 3)(x + 4)$", "$(x + 2)(x + 6)$"],
            answers: ["$(x + 1)(x + 12)$"],
            why: "1 and 12 multiply to 12 and add to 13.",
            retry: {
              prompt: "Factorise $x^2 + 8x + 15$.",
              options: ["$(x + 3)(x + 5)$", "$(x + 1)(x + 15)$", "$(x + 3)(x + 8)$"],
              answers: ["$(x + 3)(x + 5)$"],
              why: "3 and 5 multiply to 15 and add to 8.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-factorising",
    id: "y9-factorising/negatives",
    before: NEGATIVE,
    title: "Brackets with negatives",
    summary: "Factorise when b or c is negative: the signs tell you which way round.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A cropped photo",
        text: [
          "A photo's area is $x^2 - 2x - 15$ cm². One side is a few centimetres more than x, and the other a few less.",
          "What are the sides? By the end of this lesson, you can find them.",
        ],
        picture: { kind: "maths", tex: "x^2 - 2x - 15 = (x \\;?\\;)(x \\;?\\;)" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $-4 \\times 3$?",
        answers: ["-12", "−12"],
        wrong: [{ answer: "12", feedback: "A negative times a positive is negative." }],
        hint: "Negative × positive = negative.",
        done: "$-4 \\times 3 = -12$.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $-4 + 3$?",
        answers: ["-1", "−1"],
        wrong: [{ answer: "-7", feedback: "Start at −4 and go 3 up." }],
        hint: "Start at −4 and count up 3.",
        done: "$-4 + 3 = -1$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Two numbers multiply to −12. So",
        options: [
          {
            text: "one is positive and one is negative",
            correct: true,
            feedback: "Only different signs multiply to a negative.",
          },
          {
            text: "both are negative",
            feedback: "Two negatives multiply to a positive: $-3 \\times -4 = 12$.",
          },
          { text: "both are positive", feedback: "Two positives multiply to a positive." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Two numbers multiply to +15 and add to −8. So",
        options: [
          {
            text: "both are negative: −3 and −5",
            correct: true,
            feedback: "Same signs to multiply to +15; both negative to add to −8.",
          },
          { text: "both are positive: 3 and 5", feedback: "They'd add to +8, not −8." },
          { text: "one of each: 3 and −5", feedback: "They'd multiply to −15." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Where the signs go",
        text: [
          "If the number at the end is **positive**, the two numbers have the same sign: the sign of the x term.",
          "If it's **negative**, they have different signs, and the bigger one takes the sign of the x term.",
        ],
        picture: {
          kind: "table",
          head: ["", "Signs", "Example"],
          rows: [
            ["$+ \\,c$", "same", "$x^2 - 8x + 15 = (x - 3)(x - 5)$"],
            ["$- \\,c$", "different", "$x^2 - x - 12 = (x - 4)(x + 3)$"],
          ],
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Factorise $x^2 - x - 12$",
        problem: "Factorise $x^2 - x - 12$.",
        steps: [
          { line: "Multiply to −12 and add to −1", why: "c is −12 and b is −1." },
          {
            line: "Different signs; pairs: 1 and 12, 2 and 6, 3 and 4",
            why: "c is negative, so one of each sign.",
          },
          { line: "$-4 + 3 = -1$ ✓, so −4 and 3", why: "The bigger one gets b's sign, minus." },
          { line: "$(x - 4)(x + 3)$", why: "Keep each sign with its number." },
        ],
        done: "Check: $x^2 + 3x - 4x - 12 = x^2 - x - 12$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Factorise $x^2 - 8x + 15$",
        start: "$x^2 - 8x + 15$",
        stages: [
          {
            prompt: "Multiply to +15, add to −8. The signs are",
            options: [
              { text: "both negative", correct: true, feedback: "" },
              { text: "both positive", feedback: "Then they'd add to +8." },
              { text: "different", feedback: "Then they'd multiply to −15." },
            ],
            then: "Both negative.",
          },
          {
            prompt: "So",
            options: [
              { text: "$(x - 3)(x - 5)$", correct: true, feedback: "" },
              { text: "$(x + 3)(x + 5)$", feedback: "That's $x^2 + 8x + 15$." },
              { text: "$(x - 3)(x + 5)$", feedback: "That gives −15 at the end." },
            ],
            then: "$(x - 3)(x - 5)$",
          },
        ],
        done: "$-3 \\times -5 = 15$ and $-3 + -5 = -8$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Factorise $x^2 + 2x - 15$",
        start: "$x^2 + 2x - 15$",
        stages: [
          {
            prompt: "Multiply to −15, add to +2:",
            options: [
              { text: "5 and −3", correct: true, feedback: "" },
              { text: "−5 and 3", feedback: "They add to −2. The bigger one takes the + sign." },
              { text: "15 and −1", feedback: "They add to 14." },
            ],
            then: "$5 \\times -3 = -15$, $5 + -3 = 2$",
          },
          {
            prompt: "So",
            options: [
              { text: "$(x + 5)(x - 3)$", correct: true, feedback: "" },
              {
                text: "$(x - 5)(x + 3)$",
                feedback: "The signs are swapped: that's $x^2 - 2x - 15$.",
              },
            ],
            then: "$(x + 5)(x - 3)$",
          },
        ],
        done: "Different signs, and the bigger one goes with the sign of b.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Factorise $x^2 - 7x + 10$",
        template: "$x^2 - 7x + 10 = (x$ [] $)(x$ [] $)$",
        bank: ["$-2$", "$-5$", "$+2$", "$+5$", "$-10$"],
        answers: ["$-2$", "$-5$"],
        anyOrder: true,
        hint: "They multiply to +10 but add to −7: both negative.",
        done: "$(x - 2)(x - 5)$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Factorise $x^2 + 3x - 10$",
        template: "$x^2 + 3x - 10 = (x$ [] $)(x$ [] $)$",
        bank: ["$+5$", "$-2$", "$-5$", "$+2$", "$+10$"],
        answers: ["$+5$", "$-2$"],
        anyOrder: true,
        hint: "Different signs; the bigger one is positive.",
        done: "$(x + 5)(x - 2)$: $5 \\times -2 = -10$, $5 - 2 = 3$ ✓",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which factorises $x^2 - 4x - 21$?",
        options: [
          {
            text: "$(x - 7)(x + 3)$",
            correct: true,
            feedback: "$-7 \\times 3 = -21$, $-7 + 3 = -4$ ✓",
          },
          { text: "$(x + 7)(x - 3)$", feedback: "That gives $+4x$." },
          { text: "$(x - 7)(x - 3)$", feedback: "That gives $+21$." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Lee factorises $x^2 - 2x - 8$ as $(x + 4)(x - 2)$. Expand it to check.",
        options: [
          {
            text: "Wrong: it expands to $x^2 + 2x - 8$",
            correct: true,
            feedback:
              "The signs are swapped. It's $(x - 4)(x + 2)$. Expanding to check catches sign slips every time.",
          },
          { text: "Right", feedback: "$(x + 4)(x - 2) = x^2 - 2x + 4x - 8 = x^2 + 2x - 8$." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ivy factorises $x^2 - 6x + 8$.",
        lines: ["Multiply to +8, add to −6", "So the numbers are 2 and 4", "$(x + 2)(x + 4)$"],
        wrong: 1,
        why: "Adding to −6 means both are negative: −2 and −4. So $(x - 2)(x - 4)$.",
      },
      {
        kind: "fill",
        tag: "Back to the problem",
        title: "A cropped photo",
        text: "The area is $x^2 - 2x - 15$.",
        template: "$x^2 - 2x - 15 = (x$ [] $)(x$ [] $)$",
        bank: ["$+3$", "$-5$", "$-3$", "$+5$", "$-15$"],
        answers: ["$+3$", "$-5$"],
        anyOrder: true,
        hint: "Multiply to −15 and add to −2: different signs, the bigger one negative.",
        done: "The sides are $x + 3$ and $x - 5$ cm.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Factorise $x^2 - 5x + 6$.",
            options: ["$(x - 2)(x - 3)$", "$(x + 2)(x + 3)$", "$(x - 2)(x + 3)$"],
            answers: ["$(x - 2)(x - 3)$"],
            why: "−2 and −3 multiply to 6 and add to −5.",
            retry: {
              prompt: "Factorise $x^2 - 9x + 20$.",
              options: ["$(x - 4)(x - 5)$", "$(x + 4)(x + 5)$", "$(x - 4)(x + 5)$"],
              answers: ["$(x - 4)(x - 5)$"],
              why: "−4 and −5 multiply to 20 and add to −9.",
            },
          },
          {
            prompt: "Factorise $x^2 + x - 6$.",
            options: ["$(x + 3)(x - 2)$", "$(x - 3)(x + 2)$", "$(x + 6)(x - 1)$"],
            answers: ["$(x + 3)(x - 2)$"],
            why: "3 and −2 multiply to −6 and add to 1.",
            retry: {
              prompt: "Factorise $x^2 + 4x - 12$.",
              options: ["$(x + 6)(x - 2)$", "$(x - 6)(x + 2)$", "$(x + 4)(x - 3)$"],
              answers: ["$(x + 6)(x - 2)$"],
              why: "6 and −2 multiply to −12 and add to 4.",
            },
          },
          {
            prompt: "Factorise $x^2 - 3x - 10$.",
            options: ["$(x - 5)(x + 2)$", "$(x + 5)(x - 2)$", "$(x - 5)(x - 2)$"],
            answers: ["$(x - 5)(x + 2)$"],
            why: "−5 and 2 multiply to −10 and add to −3.",
            retry: {
              prompt: "Factorise $x^2 - 2x - 24$.",
              options: ["$(x - 6)(x + 4)$", "$(x + 6)(x - 4)$", "$(x - 8)(x + 3)$"],
              answers: ["$(x - 6)(x + 4)$"],
              why: "−6 and 4 multiply to −24 and add to −2.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-factorising",
    id: "y9-factorising/proof",
    before: PROVE,
    title: "Algebra proves it",
    summary: "Write a pattern in algebra and simplify until you can see why it's always true.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A mind-reading trick",
        text: [
          "Think of a number. Add 3. Double it. Take away 6. Halve it. You're back at your number!",
          "Does it work for every number? You can't try them all. By the end of this lesson, you can prove it does.",
        ],
        picture: { kind: "maths", tex: "n \\to n + 3 \\to \\; ? \\to \\; ? \\to \\; ?" },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Simplify $n + n + n$",
        options: [
          { text: "$3n$", correct: true, feedback: "Three lots of n." },
          {
            text: "$n^3$",
            feedback: "That's $n \\times n \\times n$. Adding three n's makes $3n$.",
          },
        ],
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Expand $2(n + 3)$",
        options: [
          { text: "$2n + 6$", correct: true, feedback: "Both terms are doubled." },
          { text: "$2n + 3$", feedback: "The 2 multiplies the 3 as well." },
        ],
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "Try the trick with 5",
        text: "Add 3, double it, take away 6, halve it.",
        answers: ["5"],
        hint: "$5 + 3 = 8$, then $16$, then $10$, then half of that.",
        done: "Back to 5. Try 7: 10, 20, 14, 7. It works again. But examples, however many, don't show it works for **every** number.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Let n be any number",
        text: [
          "Algebra lets us work with every number at once: call it n. If the steps simplify back to n, it works for all of them.",
          "That's a **proof**.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{aligned} 1 + 2 + 3 &= 6 \\\\ 7 + 8 + 9 &= 24 \\\\ n + (n + 1) + (n + 2) &= \\, ? \\end{aligned}",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "How can we write any even number?",
        text: "Even numbers are 2, 4, 6, 8, …",
        options: [
          { text: "$2n$", correct: true, feedback: "2 times any whole number is even." },
          { text: "$n + 2$", feedback: "If n is 3, that's 5: odd." },
          { text: "$n^2$", feedback: "$3^2 = 9$ is odd." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Three numbers in a row",
        problem: "Prove the sum of three whole numbers in a row is always a multiple of 3.",
        steps: [
          { line: "Call them $n$, $n + 1$ and $n + 2$", why: "Any three in a row, whatever n is." },
          { line: "$n + (n + 1) + (n + 2) = 3n + 3$", why: "Collect the n's and the numbers." },
          { line: "$3n + 3 = 3(n + 1)$", why: "Factorise: 3 is a factor." },
        ],
        done: "3 times a whole number is a multiple of 3, whatever n is ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Two numbers in a row",
        text: "Prove that the sum of two whole numbers in a row is always odd.",
        start: "Call them n and $n + 1$.",
        stages: [
          {
            prompt: "Their sum:",
            options: [
              { text: "$2n + 1$", correct: true, feedback: "" },
              { text: "$n^2 + 1$", feedback: "Adding: $n + n = 2n$." },
              { text: "$2n$", feedback: "Don't forget the + 1." },
            ],
            then: "$n + (n + 1) = 2n + 1$",
          },
          {
            prompt: "Why is $2n + 1$ always odd?",
            options: [
              { text: "It's one more than an even number", correct: true, feedback: "" },
              {
                text: "Because n is odd",
                feedback: "n could be anything. $2n$ is even whatever n is.",
              },
            ],
            then: "$2n$ is even, so $2n + 1$ is odd ✓",
          },
        ],
        done: "Write it in algebra, simplify, then explain what you see.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "The difference of two squares in a row",
        text: "Prove that $(n + 1)^2 - n^2$ is always odd.",
        start: "$(n + 1)^2 - n^2$",
        stages: [
          {
            prompt: "Expand $(n + 1)^2$:",
            options: [
              { text: "$n^2 + 2n + 1$", correct: true, feedback: "" },
              {
                text: "$n^2 + 1$",
                feedback: "$(n + 1)^2 = (n + 1)(n + 1)$: there are two n's in the middle.",
              },
            ],
            then: "$n^2 + 2n + 1 - n^2$",
          },
          {
            prompt: "Simplify:",
            options: [
              { text: "$2n + 1$: odd", correct: true, feedback: "" },
              { text: "$1$", feedback: "The $n^2$'s cancel, but the $2n$ stays." },
            ],
            then: "$= 2n + 1$ ✓",
          },
        ],
        done: "Try n = 3: $16 - 9 = 7$, and $2 \\times 3 + 1 = 7$ ✓",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Even × odd",
        text: "An even number is $2a$ and an odd one is $2b + 1$. Their product is $2a(2b + 1)$. So it is",
        options: [
          {
            text: "always even: it's $2 \\times a(2b + 1)$",
            correct: true,
            feedback: "It has a factor of 2.",
          },
          { text: "always odd", feedback: "Try $2 \\times 3 = 6$. Look for a factor of 2." },
          { text: "either", feedback: "$2a(2b + 1)$ always has a factor of 2." },
        ],
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Two even numbers, $2a$ and $2b$, added",
        options: [
          {
            text: "$2a + 2b = 2(a + b)$: always even",
            correct: true,
            feedback: "2 is a factor, so it's even.",
          },
          {
            text: "$2a + 2b = 4ab$: a multiple of 4",
            feedback: "Adding doesn't multiply: $2a + 2b = 2(a + b)$.",
          },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Sam checks $1 + 2 + 3$, $4 + 5 + 6$ and $10 + 11 + 12$: all multiples of 3. Has he proved it?",
        options: [
          {
            text: "No: he's checked three cases, not all of them",
            correct: true,
            feedback:
              "Examples show it works for those numbers. Only algebra, with n standing for any number, proves it for all.",
          },
          {
            text: "Yes: three examples is enough",
            feedback: "There are infinitely many cases. Examples can't cover them all.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Mia tries to prove that three numbers in a row add to a multiple of 3.",
        lines: [
          "Call the first number n",
          "The next two are $2n$ and $3n$",
          "$n + 2n + 3n = 6n$, a multiple of 3",
        ],
        wrong: 1,
        why: "The next numbers in a row are one more each time: $n + 1$ and $n + 2$. $2n$ and $3n$ are multiples of n, not the next numbers.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "A mind-reading trick",
        start: "Think of a number: n.",
        stages: [
          {
            prompt: "Add 3, then double it:",
            options: [
              { text: "$2(n + 3) = 2n + 6$", correct: true, feedback: "" },
              { text: "$2n + 3$", feedback: "Double all of $n + 3$." },
            ],
            then: "$2n + 6$",
          },
          {
            prompt: "Take away 6:",
            options: [
              { text: "$2n$", correct: true, feedback: "" },
              { text: "$2n - 6$", feedback: "$2n + 6 - 6 = 2n$." },
            ],
            then: "$2n$",
          },
          {
            prompt: "Halve it:",
            options: [
              { text: "$n$: the number you started with", correct: true, feedback: "" },
              { text: "$2n \\div 2 = 1$", feedback: "$2n \\div 2 = n$." },
            ],
            then: "$n$ ✓",
          },
        ],
        done: "Whatever number you start with, you get it back: proved, for every number at once.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Which is any odd number?",
            options: ["$2n + 1$", "$n + 1$", "$2n$"],
            answers: ["$2n + 1$"],
            why: "One more than an even number.",
            retry: {
              prompt: "Which is any even number?",
              options: ["$2n$", "$n + 2$", "$n^2$"],
              answers: ["$2n$"],
              why: "2 times any whole number.",
            },
          },
          {
            prompt: "$n + (n + 1) + (n + 2)$ simplifies to",
            options: ["$3n + 3$", "$n^3 + 3$", "$3n + 2$"],
            answers: ["$3n + 3$"],
            why: "Three n's, and $1 + 2 = 3$.",
            retry: {
              prompt: "$(n + 1) + (n + 2)$ simplifies to",
              options: ["$2n + 3$", "$n^2 + 3$", "$2n + 2$"],
              answers: ["$2n + 3$"],
              why: "Two n's, and $1 + 2 = 3$.",
            },
          },
          {
            prompt: "$3n + 6$ is always a multiple of 3 because it equals",
            options: ["$3(n + 2)$", "$3n \\times 6$", "$9n$"],
            answers: ["$3(n + 2)$"],
            why: "Factorise: 3 is a factor.",
            retry: {
              prompt: "$4n + 8$ is always a multiple of 4 because it equals",
              options: ["$4(n + 2)$", "$4n \\times 8$", "$12n$"],
              answers: ["$4(n + 2)$"],
              why: "Factorise: 4 is a factor.",
            },
          },
        ],
      },
    ],
  },
];
