// Year 7, "Simplifying and substituting", as four short lessons, one just before each skill:
// collecting like terms, multiplying a term over a bracket, substituting into an expression, and
// substituting into formulae. Each starts from something quick, builds the idea a step at a
// time, names the common mistakes, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const COLLECT = "Y7-ALG-04.a";
const EXPAND = "Y7-ALG-04.b";
const SUBSTITUTE = "Y7-ALG-02.a";
const FORMULAE = "Y7-ALG-02.b";

export const y7Simplifying: UnitLesson[] = [
  {
    unit: "y7-simplifying",
    id: "y7-simplifying/like-terms",
    before: COLLECT,
    title: "Collecting like terms",
    summary: "Add and take away terms with the same letters, like counting apples and bananas.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A fruit order",
        text: [
          "A shop orders 3 boxes of apples (a) and 2 of bananas (b) on Monday, then 4 more of apples and 1 of bananas on Tuesday.",
          "How can we write the total as simply as possible? By the end of this lesson, you can.",
        ],
        picture: { kind: "maths", tex: "3a + 2b + 4a + b" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "3 apples and 4 more apples is how many apples?",
        answers: ["7"],
        hint: "$3 + 4$.",
        done: "7 apples.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "3 apples and 2 bananas: can you write that as 5 of something?",
        options: [
          {
            text: "Only as 5 pieces of fruit, not 5 apples",
            correct: true,
            feedback: "They're different things, so they stay separate: 3 apples and 2 bananas.",
          },
          { text: "Yes, 5 apples", feedback: "You only have 3 apples." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Like terms",
        text: [
          "**Like terms** have exactly the same letters: $3a$ and $4a$ are like terms; $3a$ and $2b$ are not.",
          "Collect like terms by adding their numbers: $3a + 4a = 7a$. Unlike terms stay apart.",
        ],
        picture: { kind: "maths", tex: "3a + 4a = 7a \\qquad 3a + 2b \\text{ stays}" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Simplify $5x + 2x$",
        options: [
          { text: "$7x$", correct: true, feedback: "5 x's and 2 more." },
          { text: "$7x^2$", feedback: "Adding x's doesn't square them: 7 lots of x." },
          { text: "$10x$", feedback: "Add the numbers: $5 + 2$." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Simplify $4a + 3b - a + 2b$",
        problem: "Simplify $4a + 3b - a + 2b$.",
        steps: [
          { line: "a's: $4a - a = 3a$", why: "$-a$ means take away one a." },
          { line: "b's: $3b + 2b = 5b$", why: "Collect the b's." },
          { line: "$3a + 5b$", why: "a's and b's stay apart." },
        ],
        done: "$3a + 5b$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Simplify $6y - 2y + 3$",
        start: "$6y - 2y + 3$",
        stages: [
          {
            prompt: "The y's:",
            options: [
              { text: "$4y$", correct: true, feedback: "" },
              { text: "$8y$", feedback: "It's $-2y$: take away." },
            ],
            then: "$4y + 3$",
          },
          {
            prompt: "Can $4y + 3$ be simplified further?",
            options: [
              { text: "No: 3 isn't a y term", correct: true, feedback: "" },
              { text: "Yes, to $7y$", feedback: "3 is a number, not 3 y's." },
            ],
            then: "$4y + 3$",
          },
        ],
        done: "Numbers and letter terms stay apart.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Simplify $2x + 5 + 3x - 1$",
        start: "$2x + 5 + 3x - 1$",
        stages: [
          {
            prompt: "x's:",
            options: [
              { text: "$5x$", correct: true, feedback: "" },
              { text: "$6x$", feedback: "$2 + 3 = 5$." },
            ],
            then: "$5x$",
          },
          {
            prompt: "Numbers:",
            options: [
              { text: "$+4$", correct: true, feedback: "" },
              { text: "$+6$", feedback: "It's $-1$: $5 - 1$." },
            ],
            then: "$5x + 4$",
          },
        ],
        done: "Take each term with the sign in front of it.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Simplify",
        template: "$7m + 2n - 3m =$ []",
        bank: ["$4m + 2n$", "$6mn$", "$10m + 2n$", "$4m - 2n$"],
        answers: ["$4m + 2n$"],
        hint: "$7m - 3m$; the n stays.",
        done: "$4m + 2n$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Simplify",
        template: "$x^2 + 3x + 2x^2 - x =$ []",
        bank: ["$3x^2 + 2x$", "$5x^3$", "$3x^2 + 3x$", "$5x^2$"],
        answers: ["$3x^2 + 2x$"],
        hint: "$x^2$ and $x$ aren't like terms.",
        done: "$3x^2 + 2x$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Jay simplifies $3a + 4b$ to $7ab$. Is he right?",
        options: [
          {
            text: "No: they're unlike terms, so it stays $3a + 4b$",
            correct: true,
            feedback:
              "3 apples and 4 bananas aren't 7 apple-bananas! Joining unlike terms is the most common slip.",
          },
          { text: "Yes", feedback: "a and b are different, so they can't be collected." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ivy simplifies $5p - 2q - 3p + 4q$.",
        lines: ["p's: $5p - 3p = 2p$", "q's: $-2q + 4q = -6q$", "So $2p - 6q$"],
        wrong: 1,
        why: "$-2q + 4q = 2q$ (start at −2, go up 4). So $2p + 2q$.",
      },
      {
        kind: "fill",
        tag: "Back to the problem",
        title: "A fruit order",
        template: "$3a + 2b + 4a + b =$ []",
        bank: ["$7a + 3b$", "$10ab$", "$7a + 2b$", "$12ab$"],
        answers: ["$7a + 3b$"],
        hint: "a's together, b's together. b is 1b.",
        done: "7 boxes of apples and 3 of bananas: $7a + 3b$.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Simplify $4x + 6x$.",
            options: ["$10x$", "$10x^2$", "$24x$"],
            answers: ["$10x$"],
            why: "4 x's and 6 more.",
            retry: {
              prompt: "Simplify $9y - 3y$.",
              options: ["$6y$", "$6y^2$", "$12y$"],
              answers: ["$6y$"],
              why: "9 y's take away 3.",
            },
          },
          {
            prompt: "Simplify $3a + 2b + a$.",
            options: ["$4a + 2b$", "$6ab$", "$3a + 3b$"],
            answers: ["$4a + 2b$"],
            why: "$3a + a = 4a$.",
            retry: {
              prompt: "Simplify $5c + d - 2c$.",
              options: ["$3c + d$", "$4cd$", "$7c + d$"],
              answers: ["$3c + d$"],
              why: "$5c - 2c = 3c$.",
            },
          },
          {
            prompt: "Simplify $2x + 7 - x + 1$.",
            options: ["$x + 8$", "$9x$", "$3x + 8$"],
            answers: ["$x + 8$"],
            why: "$2x - x = x$, $7 + 1 = 8$.",
            retry: {
              prompt: "Simplify $4y + 3 - 2y - 5$.",
              options: ["$2y - 2$", "$2y + 8$", "$6y - 2$"],
              answers: ["$2y - 2$"],
              why: "$4y - 2y = 2y$, $3 - 5 = -2$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-simplifying",
    id: "y7-simplifying/expand",
    before: EXPAND,
    title: "Multiplying out a bracket",
    summary: "Multiply everything inside the bracket by the term outside.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Party bags",
        text: [
          "Each party bag has x sweets and 3 stickers. There are 4 bags. That's $4(x + 3)$ things altogether.",
          "Can we write it without the bracket? By the end of this lesson, you can.",
        ],
        picture: { kind: "maths", tex: "4(x + 3)" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $4 \\times 3$?",
        answers: ["12"],
        hint: "Four threes.",
        done: "12.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3 \\times (10 + 2)$?",
        answers: ["36"],
        hint: "$3 \\times 12$, or $30 + 6$.",
        done: "36: and $3 \\times 10 + 3 \\times 2 = 30 + 6$ too.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Everything inside gets multiplied",
        text: [
          "$4(x + 3)$ means 4 lots of $x + 3$: $(x + 3) + (x + 3) + (x + 3) + (x + 3) = 4x + 12$.",
          "So multiply **each** term inside by 4. That's **expanding** the bracket.",
        ],
        picture: { kind: "table", head: ["×", "$x$", "$+3$"], rows: [["$4$", "$4x$", "$+12$"]] },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Expand $2(x + 5)$",
        options: [
          { text: "$2x + 10$", correct: true, feedback: "Both terms × 2." },
          { text: "$2x + 5$", feedback: "The 5 is multiplied too." },
          { text: "$x + 10$", feedback: "The x is multiplied too." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Expand $3(2y - 4)$",
        problem: "Expand $3(2y - 4)$.",
        steps: [
          { line: "$3 \\times 2y = 6y$", why: "First term." },
          { line: "$3 \\times -4 = -12$", why: "The minus goes with the 4." },
          { line: "$6y - 12$", why: "Put them together." },
        ],
        done: "$6y - 12$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Expand $5(a - 2)$",
        start: "$5(a - 2)$",
        stages: [
          {
            prompt: "$5 \\times a =$",
            options: [
              { text: "$5a$", correct: true, feedback: "" },
              { text: "$5 + a$", feedback: "Multiply." },
            ],
            then: "$5a$",
          },
          {
            prompt: "$5 \\times -2 =$",
            options: [
              { text: "$-10$", correct: true, feedback: "" },
              { text: "$-2$", feedback: "Multiply it by 5 too." },
            ],
            then: "$5a - 10$",
          },
        ],
        done: "$5a - 10$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Expand $x(x + 4)$",
        start: "A letter outside: $x(x + 4)$",
        stages: [
          {
            prompt: "$x \\times x =$",
            options: [
              { text: "$x^2$", correct: true, feedback: "" },
              { text: "$2x$", feedback: "$x \\times x$ is x squared." },
            ],
            then: "$x^2$",
          },
          {
            prompt: "$x \\times 4 =$",
            options: [
              { text: "$4x$", correct: true, feedback: "" },
              { text: "$x4$", feedback: "Number first: $4x$." },
            ],
            then: "$x^2 + 4x$",
          },
        ],
        done: "$x^2 + 4x$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Expand",
        template: "$6(x + 2) =$ []",
        bank: ["$6x + 12$", "$6x + 2$", "$x + 12$", "$6x + 8$"],
        answers: ["$6x + 12$"],
        hint: "Both terms × 6.",
        done: "$6x + 12$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Expand",
        template: "$4(3y - 1) =$ []",
        bank: ["$12y - 4$", "$12y - 1$", "$7y - 4$", "$12y + 4$"],
        answers: ["$12y - 4$"],
        hint: "$4 \\times 3y$ and $4 \\times -1$.",
        done: "$12y - 4$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Sam expands $3(x + 4)$ as $3x + 4$. Is he right?",
        options: [
          {
            text: "No: the 4 is multiplied too: $3x + 12$",
            correct: true,
            feedback: "Only multiplying the first term is the most common bracket mistake.",
          },
          { text: "Yes", feedback: "Try $x = 1$: $3 \\times 5 = 15$, but $3 + 4 = 7$." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ella expands $2(5 - 3x)$.",
        lines: ["$2 \\times 5 = 10$", "$2 \\times 3x = 6x$", "So $10 + 6x$"],
        wrong: 2,
        why: "The minus belongs to the $3x$: $2 \\times -3x = -6x$. So $10 - 6x$.",
      },
      {
        kind: "fill",
        tag: "Back to the problem",
        title: "Party bags",
        template: "$4(x + 3) =$ []",
        bank: ["$4x + 12$", "$4x + 3$", "$x + 12$", "$7x$"],
        answers: ["$4x + 12$"],
        hint: "4 lots of x, and 4 lots of 3 stickers.",
        done: "$4x$ sweets and 12 stickers: $4x + 12$.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Expand $5(x + 3)$.",
            options: ["$5x + 15$", "$5x + 3$", "$x + 15$"],
            answers: ["$5x + 15$"],
            why: "Both × 5.",
            retry: {
              prompt: "Expand $2(y + 7)$.",
              options: ["$2y + 14$", "$2y + 7$", "$y + 14$"],
              answers: ["$2y + 14$"],
              why: "Both × 2.",
            },
          },
          {
            prompt: "Expand $3(2a - 5)$.",
            options: ["$6a - 15$", "$6a - 5$", "$5a - 15$"],
            answers: ["$6a - 15$"],
            why: "$3 \\times 2a$ and $3 \\times -5$.",
            retry: {
              prompt: "Expand $4(b - 3)$.",
              options: ["$4b - 12$", "$4b - 3$", "$b - 12$"],
              answers: ["$4b - 12$"],
              why: "$4 \\times b$ and $4 \\times -3$.",
            },
          },
          {
            prompt: "Expand $x(x + 2)$.",
            options: ["$x^2 + 2x$", "$2x + 2$", "$x^2 + 2$"],
            answers: ["$x^2 + 2x$"],
            why: "$x \\times x$ and $x \\times 2$.",
            retry: {
              prompt: "Expand $y(y - 5)$.",
              options: ["$y^2 - 5y$", "$2y - 5$", "$y^2 - 5$"],
              answers: ["$y^2 - 5y$"],
              why: "$y \\times y$ and $y \\times -5$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-simplifying",
    id: "y7-simplifying/substitute",
    before: SUBSTITUTE,
    title: "Substituting",
    summary: "Swap each letter for its number, then work it out in the right order.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A phone bill",
        text: [
          "A phone costs $5m + 2t$ pence, where m is minutes of calls and t is texts. Last week Mo made 12 minutes of calls and sent 30 texts.",
          "What was his bill? By the end of this lesson, you can work it out.",
        ],
        picture: { kind: "maths", tex: "5m + 2t" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $5 \\times 12$?",
        answers: ["60"],
        hint: "Five twelves.",
        done: "60.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3 + 4 \\times 2$?",
        answers: ["11"],
        wrong: [{ answer: "14", feedback: "Multiply first." }],
        hint: "× before +.",
        done: "$3 + 8 = 11$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Swap the letters",
        text: [
          "To **substitute**, put each number in place of its letter, then work it out in the usual order.",
          "If $a = 4$: $3a + 1 = 3 \\times 4 + 1 = 13$. Remember $3a$ means $3 \\times a$.",
        ],
        picture: { kind: "maths", tex: "3a + 1 \\xrightarrow{a = 4} 3 \\times 4 + 1 = 13" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "If $y = 5$, what is $2y - 3$?",
        options: [
          { text: "7", correct: true, feedback: "$2 \\times 5 - 3 = 10 - 3$." },
          { text: "22", feedback: "$2y$ is $2 \\times 5$, not 25." },
          { text: "4", feedback: "Multiply first, then take away." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Two letters",
        problem: "If $a = 3$ and $b = -2$, work out $4a + 5b$.",
        steps: [
          {
            line: "$4 \\times 3 + 5 \\times (-2)$",
            why: "Substitute; brackets round the negative.",
          },
          { line: "$12 + (-10)$", why: "Multiply first." },
          { line: "$= 2$", why: "Adding −10 is taking away 10." },
        ],
        done: "2.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$x^2 + 3$ when $x = 4$",
        start: "$x^2 + 3$",
        stages: [
          {
            prompt: "$x^2 =$",
            options: [
              { text: "16", correct: true, feedback: "" },
              { text: "8", feedback: "$4 \\times 4$." },
            ],
            then: "$16 + 3$",
          },
          {
            prompt: "So",
            options: [
              { text: "19", correct: true, feedback: "" },
              { text: "49", feedback: "That's $(4 + 3)^2$." },
            ],
            then: "19",
          },
        ],
        done: "Power first.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$\\frac{a + b}{2}$ when $a = 7$, $b = 5$",
        start: "$\\frac{a + b}{2}$",
        stages: [
          {
            prompt: "The top:",
            options: [
              { text: "$7 + 5 = 12$", correct: true, feedback: "" },
              { text: "75", feedback: "Add them." },
            ],
            then: "$\\frac{12}{2}$",
          },
          {
            prompt: "So",
            options: [
              { text: "6", correct: true, feedback: "" },
              { text: "9.5", feedback: "That's $7 + 5 \\div 2$. The whole top is divided." },
            ],
            then: "6",
          },
        ],
        done: "The fraction line groups the top.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "If $p = 6$, what is $4p - 5$?",
        answers: ["19"],
        wrong: [{ answer: "59", feedback: "$4p$ is $4 \\times 6$." }],
        hint: "$4 \\times 6 - 5$.",
        done: "$24 - 5 = 19$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "If $m = -3$, what is $2m + 10$?",
        answers: ["4"],
        wrong: [{ answer: "16", feedback: "$2 \\times -3 = -6$, then $-6 + 10$." }],
        hint: "$2 \\times (-3) + 10$.",
        done: "$-6 + 10 = 4$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "If $n = 3$, Ali says $5n = 53$. Is he right?",
        options: [
          {
            text: "No: $5n = 5 \\times 3 = 15$",
            correct: true,
            feedback: "Writing the digits side by side is the most common substitution slip.",
          },
          { text: "Yes", feedback: "$5n$ means 5 times n." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Mia works out $3x^2$ when $x = 2$.",
        lines: ["$3x^2 = (3 \\times 2)^2$", "$= 6^2$", "$= 36$"],
        wrong: 0,
        why: "Only the x is squared: $3 \\times 2^2 = 3 \\times 4 = 12$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "A phone bill",
        text: "$5m + 2t$ pence, with $m = 12$ and $t = 30$. What's the bill, in pence?",
        answers: ["120"],
        wrong: [{ answer: "534", feedback: "$5m$ is $5 \\times 12$, and $2t$ is $2 \\times 30$." }],
        hint: "$5 \\times 12 + 2 \\times 30$.",
        done: "$60 + 60 = 120$p, or £1.20.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "If $a = 5$, what is $3a + 2$?",
            answers: ["17"],
            why: "$15 + 2$.",
            retry: { prompt: "If $a = 4$, what is $5a - 3$?", answers: ["17"], why: "$20 - 3$." },
          },
          {
            prompt: "If $x = 3$ and $y = 2$, what is $xy + y$?",
            answers: ["8"],
            why: "$6 + 2$.",
            retry: {
              prompt: "If $x = 5$ and $y = 2$, what is $xy - x$?",
              answers: ["5"],
              why: "$10 - 5$.",
            },
          },
          {
            prompt: "If $n = -2$, what is $n^2$?",
            answers: ["4"],
            why: "$-2 \\times -2$.",
            retry: {
              prompt: "If $n = -3$, what is $2n$?",
              answers: ["-6", "−6"],
              why: "$2 \\times -3$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-simplifying",
    id: "y7-simplifying/formulae",
    before: FORMULAE,
    title: "Formulae in science and life",
    summary: "A formula links quantities: put in what you know to find what you don't.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How fast?",
        text: [
          "A cyclist rides 45 km in 3 hours. Speed is found with the formula $s = \\frac{d}{t}$.",
          "How fast did she go? By the end of this lesson, you can use formulae from science and everyday life.",
        ],
        picture: { kind: "maths", tex: "s = \\frac{d}{t}" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $45 \\div 3$?",
        answers: ["15"],
        hint: "How many 3s in 45?",
        done: "15.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "If $a = 4$, what is $2a + 1$?",
        answers: ["9"],
        hint: "$2 \\times 4 + 1$.",
        done: "9.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "What a formula is",
        text: [
          "A **formula** is a rule that links quantities, with a letter for each: $A = lw$ links a rectangle's area to its length and width.",
          "Put in the values you know, and work out the one on its own.",
        ],
        picture: { kind: "maths", tex: "A = l w \\qquad P = 2l + 2w" },
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "$A = lw$, with $l = 6$ and $w = 4$",
        text: "Find the area A.",
        answers: ["24"],
        hint: "$6 \\times 4$.",
        done: "$A = 24$.",
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A science formula",
        problem: "Force: $F = ma$. Find F when $m = 5$ and $a = 3$.",
        steps: [
          { line: "$F = 5 \\times 3$", why: "Substitute; $ma$ means $m \\times a$." },
          { line: "$F = 15$", why: "Work it out." },
        ],
        done: "15 newtons. Formulae work the same way whatever the subject.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$v = u + at$",
        start: "Find v when $u = 2$, $a = 4$, $t = 3$.",
        stages: [
          {
            prompt: "Substitute:",
            options: [
              { text: "$v = 2 + 4 \\times 3$", correct: true, feedback: "" },
              { text: "$v = 2 + 43$", feedback: "$at$ is $a \\times t$." },
            ],
            then: "$v = 2 + 4 \\times 3$",
          },
          {
            prompt: "So",
            options: [
              { text: "$v = 14$", correct: true, feedback: "" },
              { text: "$v = 18$", feedback: "Multiply first." },
            ],
            then: "$v = 14$",
          },
        ],
        done: "Substitute, then the usual order.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$P = 2(l + w)$",
        start: "Find the perimeter when $l = 7$, $w = 3$.",
        stages: [
          {
            prompt: "Bracket first:",
            options: [
              { text: "$7 + 3 = 10$", correct: true, feedback: "" },
              { text: "$2 \\times 7 = 14$", feedback: "Brackets before multiplying." },
            ],
            then: "$P = 2 \\times 10$",
          },
          {
            prompt: "So",
            options: [
              { text: "$P = 20$", correct: true, feedback: "" },
              { text: "$P = 17$", feedback: "$2 \\times 10$." },
            ],
            then: "$P = 20$",
          },
        ],
        done: "$P = 20$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "$C = 10n + 25$",
        text: "A plumber charges C pounds for n hours. Find C when $n = 3$.",
        answers: ["55"],
        wrong: [{ answer: "105", feedback: "$10n$ is $10 \\times 3$." }],
        hint: "$10 \\times 3 + 25$.",
        done: "£55.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "$d = st$",
        text: "Find the distance d when the speed $s = 12$ m/s and the time $t = 5$ s.",
        answers: ["60"],
        unit: "m",
        hint: "$12 \\times 5$.",
        done: "60 m.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "With $A = \\frac12 bh$, $b = 6$ and $h = 4$, Leo gets 24. Is he right?",
        options: [
          {
            text: "No: he forgot the half. $A = 12$",
            correct: true,
            feedback:
              "Every part of the formula counts. Dropping a number like the ½ is a common slip.",
          },
          { text: "Yes", feedback: "$6 \\times 4 = 24$, then half of it." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Zara finds speed with $s = \\frac{d}{t}$, where $d = 100$ and $t = 20$.",
        lines: ["$s = \\frac{100}{20}$", "Divide the time by the distance", "$s = 0.2$"],
        wrong: 1,
        why: "d is on top: divide the distance by the time. $100 \\div 20 = 5$.",
      },
      {
        kind: "answer",
        tag: "Back to the problem",
        title: "How fast?",
        text: "$s = \\frac{d}{t}$, with $d = 45$ km and $t = 3$ hours.",
        answers: ["15"],
        unit: "km/h",
        wrong: [{ answer: "135", feedback: "Divide, don't multiply: d over t." }],
        hint: "$45 \\div 3$.",
        done: "15 km/h.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$A = lw$. Find A when $l = 9$, $w = 3$.",
            answers: ["27"],
            why: "$9 \\times 3$.",
            retry: {
              prompt: "$A = lw$. Find A when $l = 8$, $w = 5$.",
              answers: ["40"],
              why: "$8 \\times 5$.",
            },
          },
          {
            prompt: "$v = u + at$. Find v when $u = 5$, $a = 2$, $t = 4$.",
            answers: ["13"],
            why: "$5 + 8$.",
            retry: {
              prompt: "$v = u + at$. Find v when $u = 1$, $a = 3$, $t = 5$.",
              answers: ["16"],
              why: "$1 + 15$.",
            },
          },
          {
            prompt: "$s = \\frac{d}{t}$. Find s when $d = 60$, $t = 4$.",
            answers: ["15"],
            why: "$60 \\div 4$.",
            retry: {
              prompt: "$s = \\frac{d}{t}$. Find s when $d = 90$, $t = 6$.",
              answers: ["15"],
              why: "$90 \\div 6$.",
            },
          },
        ],
      },
    ],
  },
];
