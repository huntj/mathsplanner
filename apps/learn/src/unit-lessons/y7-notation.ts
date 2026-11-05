// Year 7, "Algebraic notation", as four short lessons, one just before each skill: writing
// products (3y, ab), powers (a², a²b), fractions and brackets, and the words: expression,
// equation, inequality, term and factor. Each starts from something quick, builds the idea a step
// at a time, names the common mistakes, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const PRODUCTS = "Y7-ALG-01.a";
const POWERS = "Y7-ALG-01.b";
const FRACTIONS = "Y7-ALG-01.c";
const WORDS = "Y7-ALG-03";

export const y7Notation: UnitLesson[] = [
  {
    unit: "y7-notation",
    id: "y7-notation/products",
    before: PRODUCTS,
    title: "Algebra's shorthand",
    summary: "Write multiplying with letters the short way: 3y, ab.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Pens and pencils",
        text: [
          "A pen costs p pence. Ali buys 4 pens. Writing '$4 \\times p$' every time is slow, and × looks like the letter x.",
          "How do mathematicians write it? By the end of this lesson, you can write it the short way.",
        ],
        picture: { kind: "maths", tex: "4 \\times p = \\; ?" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "One pen costs 30p. How much do 4 pens cost, in pence?",
        answers: ["120"],
        hint: "$4 \\times 30$.",
        done: "$4 \\times 30 = 120$p.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3 \\times 5$?",
        answers: ["15"],
        hint: "Three fives.",
        done: "15.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Leave out the ×",
        text: [
          "In algebra we leave out the × sign. $4 \\times p$ is written $4p$, and $a \\times b$ is written $ab$.",
          "The number goes first: $p \\times 4$ is also written $4p$.",
        ],
        picture: { kind: "maths", tex: "4 \\times p = 4p \\qquad a \\times b = ab" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "How do we write $y \\times 3$?",
        options: [
          { text: "$3y$", correct: true, feedback: "Number first, no × sign." },
          { text: "$y3$", feedback: "The number always goes in front." },
          { text: "$y + 3$", feedback: "That's adding. $3y$ means 3 times y." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Write it the short way",
        problem: "Write $2 \\times a \\times b$ and $5 \\times x \\times 4$ in algebra.",
        steps: [
          { line: "$2 \\times a \\times b = 2ab$", why: "Leave out the × signs; number first." },
          {
            line: "$5 \\times x \\times 4 = 20x$",
            why: "Multiply the numbers together first: $5 \\times 4 = 20$.",
          },
        ],
        done: "Numbers multiplied together go in front; letters follow, usually in alphabetical order.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$b \\times 6 \\times a$",
        start: "$b \\times 6 \\times a$",
        stages: [
          {
            prompt: "Put the number first:",
            options: [
              { text: "$6ba$", correct: true, feedback: "" },
              { text: "$b6a$", feedback: "The number goes in front." },
            ],
            then: "$6ba$",
          },
          {
            prompt: "Letters in alphabetical order:",
            options: [
              { text: "$6ab$", correct: true, feedback: "" },
              { text: "$6ba$ is wrong", feedback: "It isn't wrong, but $6ab$ is the usual way." },
            ],
            then: "$6ab$",
          },
        ],
        done: "$6ab$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "What does $3n$ mean when $n = 5$?",
        start: "$3n$ with $n = 5$",
        stages: [
          {
            prompt: "$3n$ means",
            options: [
              { text: "$3 \\times n = 3 \\times 5 = 15$", correct: true, feedback: "" },
              { text: "35", feedback: "$3n$ isn't 3 written next to 5: it's 3 times n." },
            ],
            then: "$15$",
          },
        ],
        done: "The letter stands for a number; the missing sign is ×.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Write it the short way",
        template: "$m \\times 7 =$ [] and $2 \\times c \\times d =$ []",
        bank: ["$7m$", "$m7$", "$2cd$", "$2 + cd$", "$7 + m$"],
        answers: ["$7m$", "$2cd$"],
        hint: "Number first, then the letters.",
        done: "$7m$ and $2cd$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "If $a = 4$ and $b = 3$, what is $2ab$?",
        answers: ["24"],
        wrong: [
          {
            answer: "243",
            feedback: "$2ab$ means $2 \\times a \\times b$, not the digits side by side.",
          },
        ],
        hint: "$2 \\times 4 \\times 3$.",
        done: "$2 \\times 4 \\times 3 = 24$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Kim says that if $x = 2$, then $4x = 42$. Is she right?",
        options: [
          {
            text: "No: $4x = 4 \\times 2 = 8$",
            correct: true,
            feedback:
              "The hidden sign is ×. Putting the digits side by side is the common mistake.",
          },
          { text: "Yes", feedback: "$4x$ means 4 times x." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Sam writes $3 \\times y \\times 5$ the short way.",
        lines: ["Leave out the × signs", "Numbers first", "$35y$"],
        wrong: 2,
        why: "Multiply the numbers: $3 \\times 5 = 15$, so it's $15y$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Pens and pencils",
        text: "4 pens at p pence each. And 3 pencils at q pence each?",
        options: [
          {
            text: "$4p$ and $3q$",
            correct: true,
            feedback: "4 times p and 3 times q, the short way.",
          },
          { text: "$p4$ and $q3$", feedback: "The number goes in front." },
          { text: "$4 + p$ and $3 + q$", feedback: "That's adding. 4 pens cost 4 times p." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Write $k \\times 9$ the short way.",
            options: ["$9k$", "$k9$", "$9 + k$"],
            answers: ["$9k$"],
            why: "Number first.",
            retry: {
              prompt: "Write $t \\times 5$ the short way.",
              options: ["$5t$", "$t5$", "$5 + t$"],
              answers: ["$5t$"],
              why: "Number first.",
            },
          },
          {
            prompt: "If $n = 6$, what is $5n$?",
            answers: ["30"],
            why: "$5 \\times 6$.",
            retry: {
              prompt: "If $n = 7$, what is $3n$?",
              answers: ["21"],
              why: "$3 \\times 7$.",
            },
          },
          {
            prompt: "Write $2 \\times p \\times 3 \\times q$ the short way.",
            options: ["$6pq$", "$23pq$", "$5pq$"],
            answers: ["$6pq$"],
            why: "$2 \\times 3 = 6$.",
            retry: {
              prompt: "Write $4 \\times a \\times 2 \\times b$ the short way.",
              options: ["$8ab$", "$42ab$", "$6ab$"],
              answers: ["$8ab$"],
              why: "$4 \\times 2 = 8$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-notation",
    id: "y7-notation/powers",
    before: POWERS,
    title: "Powers in algebra",
    summary: "a × a is a²: the power counts how many are multiplied.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A square garden",
        text: [
          "A square garden has sides of s metres. Its area is $s \\times s$.",
          "Is that $2s$? How should we write it? By the end of this lesson, you can write it and work it out.",
        ],
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 4, y: 0 },
            { x: 4, y: 4 },
            { x: 0, y: 4 },
          ],
          sides: ["s", "s", null, null],
          square: [0, 1, 2, 3],
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $5 \\times 5$?",
        answers: ["25"],
        hint: "Five fives.",
        done: "25.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $4^2$?",
        answers: ["16"],
        wrong: [{ answer: "8", feedback: "$4^2$ is $4 \\times 4$, not $4 \\times 2$." }],
        hint: "$4 \\times 4$.",
        done: "16.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Powers of letters",
        text: [
          "$a \\times a$ is written $a^2$, 'a squared'. $a \\times a \\times a$ is $a^3$, 'a cubed'.",
          "The little number, the **power**, counts how many a's are multiplied together.",
        ],
        picture: { kind: "maths", tex: "a \\times a = a^2 \\qquad a \\times a \\times a = a^3" },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "$y \\times y \\times y \\times y =$",
        options: [
          { text: "$y^4$", correct: true, feedback: "Four y's multiplied." },
          { text: "$4y$", feedback: "$4y$ is $y + y + y + y$: adding. This is multiplying." },
          { text: "$y4$", feedback: "The 4 goes up small, as a power." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Mixing letters",
        problem: "Write $a \\times a \\times b$ and $3 \\times x \\times x$ in algebra.",
        steps: [
          { line: "$a \\times a \\times b = a^2b$", why: "Two a's make $a^2$; then the b." },
          { line: "$3 \\times x \\times x = 3x^2$", why: "Number first; two x's make $x^2$." },
        ],
        done: "In $3x^2$, only the x is squared, not the 3.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$x^2$ when $x = 5$",
        start: "$x^2$ with $x = 5$",
        stages: [
          {
            prompt: "$x^2$ means",
            options: [
              { text: "$x \\times x = 5 \\times 5 = 25$", correct: true, feedback: "" },
              { text: "$2 \\times x = 10$", feedback: "That's $2x$. Squaring is times by itself." },
            ],
            then: "$25$",
          },
        ],
        done: "$x^2$ and $2x$ are very different.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$3x^2$ when $x = 4$",
        start: "$3x^2$ with $x = 4$",
        stages: [
          {
            prompt: "Square first: $x^2 =$",
            options: [
              { text: "16", correct: true, feedback: "" },
              { text: "8", feedback: "$4^2 = 4 \\times 4$." },
            ],
            then: "$x^2 = 16$",
          },
          {
            prompt: "Then times 3:",
            options: [
              { text: "48", correct: true, feedback: "" },
              { text: "144", feedback: "That's $(3 \\times 4)^2$. Only the x is squared." },
            ],
            then: "$3x^2 = 48$",
          },
        ],
        done: "Power first, then multiply.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Write it with powers",
        template: "$p \\times p \\times p =$ [] and $m \\times m \\times n =$ []",
        bank: ["$p^3$", "$3p$", "$m^2n$", "$2mn$", "$mn^2$"],
        answers: ["$p^3$", "$m^2n$"],
        hint: "Count each letter.",
        done: "$p^3$ and $m^2n$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "If $a = 3$, what is $2a^2$?",
        answers: ["18"],
        wrong: [{ answer: "36", feedback: "Only a is squared: $2 \\times 9$, not $6^2$." }],
        hint: "$a^2 = 9$, then $\\times 2$.",
        done: "$2 \\times 9 = 18$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Ben says that if $n = 6$, then $n^2 = 12$. Is he right?",
        options: [
          {
            text: "No: $n^2 = 6 \\times 6 = 36$",
            correct: true,
            feedback:
              "Doubling instead of squaring is the classic mistake. The 2 counts how many n's multiply.",
          },
          { text: "Yes", feedback: "$n^2$ is $n \\times n$." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Zoe finds $4x^2$ when $x = 3$.",
        lines: ["$4x^2 = 4 \\times x^2$", "$= (4 \\times 3)^2$", "$= 144$"],
        wrong: 1,
        why: "Only the x is squared: $4 \\times 3^2 = 4 \\times 9 = 36$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "A square garden",
        text: "The area is $s \\times s$. How do we write it, and what is it when $s = 7$?",
        options: [
          { text: "$s^2$, which is 49 m²", correct: true, feedback: "$7 \\times 7 = 49$." },
          {
            text: "$2s$, which is 14 m²",
            feedback: "$2s$ is $s + s$: that's two sides, not the area.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Write $b \\times b \\times b$ in algebra.",
            options: ["$b^3$", "$3b$", "$bbb^3$"],
            answers: ["$b^3$"],
            why: "Three b's multiplied.",
            retry: {
              prompt: "Write $k \\times k$ in algebra.",
              options: ["$k^2$", "$2k$", "$kk^2$"],
              answers: ["$k^2$"],
              why: "Two k's multiplied.",
            },
          },
          {
            prompt: "If $y = 5$, what is $y^2$?",
            answers: ["25"],
            why: "$5 \\times 5$.",
            retry: {
              prompt: "If $y = 9$, what is $y^2$?",
              answers: ["81"],
              why: "$9 \\times 9$.",
            },
          },
          {
            prompt: "If $x = 2$, what is $5x^2$?",
            answers: ["20"],
            why: "$5 \\times 4$.",
            retry: {
              prompt: "If $x = 3$, what is $2x^2$?",
              answers: ["18"],
              why: "$2 \\times 9$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-notation",
    id: "y7-notation/fractions-brackets",
    before: FRACTIONS,
    title: "Fractions and brackets",
    summary: "Write dividing as a fraction, and use brackets to group.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Sharing the bill",
        text: [
          "Some friends share a bill of b pounds equally between 4. Each pays $b \\div 4$. And if they add a £2 tip each, then share between 3?",
          "How do we write these in algebra? By the end of this lesson, you can.",
        ],
        picture: { kind: "maths", tex: "b \\div 4 \\qquad 3 \\times (n + 2)" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $20 \\div 4$?",
        answers: ["5"],
        hint: "How many 4s in 20?",
        done: "5.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $3 \\times (2 + 5)$?",
        answers: ["21"],
        wrong: [{ answer: "11", feedback: "Brackets first: $2 + 5 = 7$, then $\\times 3$." }],
        hint: "Brackets first.",
        done: "$3 \\times 7 = 21$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Dividing is a fraction",
        text: [
          "In algebra, $b \\div 4$ is written as a fraction: $\\frac{b}{4}$.",
          "Brackets group things: $3(n + 2)$ means 3 lots of $n + 2$, with the × left out.",
        ],
        picture: {
          kind: "maths",
          tex: "b \\div 4 = \\frac{b}{4} \\qquad 3 \\times (n + 2) = 3(n + 2)",
        },
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "How do we write $x \\div 5$?",
        options: [
          { text: "$\\frac{x}{5}$", correct: true, feedback: "x on top, 5 below." },
          {
            text: "$\\frac{5}{x}$",
            feedback: "That's $5 \\div x$. The thing being divided goes on top.",
          },
          { text: "$5x$", feedback: "$5x$ is $5 \\times x$." },
        ],
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Words into algebra",
        problem: "Write 'add 3 to n, then multiply by 2' and 'halve y' in algebra.",
        steps: [
          { line: "$2(n + 3)$", why: "The adding happens first, so it goes in a bracket." },
          { line: "$\\frac{y}{2}$", why: "Halving is dividing by 2." },
        ],
        done: "Brackets show what's done first.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$2n + 3$ or $2(n + 3)$?",
        start: "'Multiply n by 2, then add 3.'",
        stages: [
          {
            prompt: "What's done first?",
            options: [
              { text: "Multiply by 2", correct: true, feedback: "" },
              { text: "Add 3", feedback: "Read it again: multiply first." },
            ],
            then: "Multiply first.",
          },
          {
            prompt: "So it's",
            options: [
              { text: "$2n + 3$", correct: true, feedback: "" },
              { text: "$2(n + 3)$", feedback: "That adds 3 first." },
            ],
            then: "$2n + 3$",
          },
        ],
        done: "With n = 5: $2n + 3 = 13$, but $2(n + 3) = 16$. The bracket matters.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$\\frac{n + 4}{2}$ when $n = 6$",
        start: "$\\frac{n + 4}{2}$",
        stages: [
          {
            prompt: "The top first: $n + 4 =$",
            options: [
              { text: "10", correct: true, feedback: "" },
              { text: "6", feedback: "$6 + 4$." },
            ],
            then: "$\\frac{10}{2}$",
          },
          {
            prompt: "Then divide:",
            options: [
              { text: "5", correct: true, feedback: "" },
              { text: "8", feedback: "That's $6 + 4 \\div 2$. The whole top is divided." },
            ],
            then: "$5$",
          },
        ],
        done: "The fraction line groups the top, like a bracket.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Write it in algebra",
        template: "'p divided by 3' is [] and '5 times, then add 1' is []",
        bank: ["$\\frac{p}{3}$", "$\\frac{3}{p}$", "$5n + 1$", "$5(n + 1)$"],
        answers: ["$\\frac{p}{3}$", "$5n + 1$"],
        hint: "p on top; multiply first, so no bracket.",
        done: "$\\frac{p}{3}$ and $5n + 1$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "If $n = 4$, what is $3(n + 2)$?",
        answers: ["18"],
        wrong: [{ answer: "14", feedback: "That's $3n + 2$. The bracket first: $4 + 2 = 6$." }],
        hint: "Bracket first.",
        done: "$3 \\times 6 = 18$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Is $2(x + 5)$ the same as $2x + 5$?",
        options: [
          {
            text: "No: $2(x + 5)$ doubles the 5 too",
            correct: true,
            feedback: "$2(x + 5) = 2x + 10$. Forgetting what the bracket does is common.",
          },
          { text: "Yes", feedback: "Try $x = 1$: $2 \\times 6 = 12$, but $2 + 5 = 7$." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Jo writes 'add 4 to x, then divide by 2'.",
        lines: ["Add 4 to x: $x + 4$", "Divide by 2", "$x + \\frac{4}{2}$"],
        wrong: 2,
        why: "All of $x + 4$ is divided: $\\frac{x + 4}{2}$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Sharing the bill",
        text: "A bill of b pounds shared by 4 friends; and n pounds plus a £2 tip, all times 3.",
        options: [
          {
            text: "$\\frac{b}{4}$ and $3(n + 2)$",
            correct: true,
            feedback: "Divide is a fraction; the bracket groups $n + 2$.",
          },
          {
            text: "$\\frac{4}{b}$ and $3n + 2$",
            feedback: "b goes on top; and the tip is inside the bracket.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "Write $m \\div 6$ in algebra.",
            options: ["$\\frac{m}{6}$", "$\\frac{6}{m}$", "$6m$"],
            answers: ["$\\frac{m}{6}$"],
            why: "m on top.",
            retry: {
              prompt: "Write $t \\div 10$ in algebra.",
              options: ["$\\frac{t}{10}$", "$\\frac{10}{t}$", "$10t$"],
              answers: ["$\\frac{t}{10}$"],
              why: "t on top.",
            },
          },
          {
            prompt: "If $n = 2$, what is $5(n + 3)$?",
            answers: ["25"],
            why: "$5 \\times 5$.",
            retry: {
              prompt: "If $n = 1$, what is $4(n + 6)$?",
              answers: ["28"],
              why: "$4 \\times 7$.",
            },
          },
          {
            prompt: "If $x = 8$, what is $\\frac{x + 2}{5}$?",
            answers: ["2"],
            why: "$\\frac{10}{5}$.",
            retry: {
              prompt: "If $x = 9$, what is $\\frac{x + 3}{4}$?",
              answers: ["3"],
              why: "$\\frac{12}{4}$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y7-notation",
    id: "y7-notation/words",
    before: WORDS,
    title: "The words of algebra",
    summary: "Expression, equation, inequality, term and factor: what each one means.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "What's the difference?",
        text: [
          "$3x + 2$, $3x + 2 = 11$ and $3x + 2 > 11$ look alike, but they're different kinds of thing. Only one can be solved to get a single answer.",
          "Which, and what are they called? By the end of this lesson, you can name them all.",
        ],
        picture: { kind: "maths", tex: "3x + 2 \\qquad 3x + 2 = 11 \\qquad 3x + 2 > 11" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "If $x = 3$, what is $3x + 2$?",
        answers: ["11"],
        hint: "$3 \\times 3 + 2$.",
        done: "11.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which sign means 'is greater than'?",
        options: [
          { text: "$>$", correct: true, feedback: "The open end faces the bigger number." },
          { text: "$<$", feedback: "That's 'is less than'." },
          { text: "$=$", feedback: "That's 'equals'." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Terms and expressions",
        text: [
          "A **term** is a number, a letter, or numbers and letters multiplied: $3x$, $5$, $ab$.",
          "An **expression** is terms added or taken away, with no = sign: $3x + 2$ has two terms.",
        ],
        picture: {
          kind: "maths",
          tex: "\\underbrace{3x}_{\\text{term}} + \\underbrace{2}_{\\text{term}}",
        },
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Equations and inequalities",
        text: [
          "An **equation** says two things are equal: $3x + 2 = 11$. It can be solved: here, $x = 3$.",
          "An **inequality** uses $<$, $>$, $\\le$ or $\\ge$: $3x + 2 > 11$. Lots of values work.",
        ],
        picture: { kind: "maths", tex: "3x + 2 = 11 \\Rightarrow x = 3" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Name them",
        problem:
          "Is each an expression, an equation or an inequality? $4y - 1$; $4y - 1 = 7$; $4y - 1 \\le 7$.",
        steps: [
          { line: "$4y - 1$: expression", why: "No sign comparing two sides." },
          { line: "$4y - 1 = 7$: equation", why: "An = sign: two sides equal." },
          { line: "$4y - 1 \\le 7$: inequality", why: "A ≤ sign." },
        ],
        done: "Look for the sign in the middle.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Factors of a term",
        start:
          "A **factor** is something that multiplies to make a term: $6x = 6 \\times x$, so 6 and x are factors of $6x$.",
        stages: [
          {
            prompt: "Which is a factor of $6x$?",
            options: [
              { text: "3", correct: true, feedback: "" },
              { text: "5", feedback: "6 isn't a multiple of 5." },
            ],
            then: "$6x = 3 \\times 2x$",
          },
          {
            prompt: "And which of these?",
            options: [
              { text: "$2x$", correct: true, feedback: "" },
              { text: "$x^2$", feedback: "$6x$ has only one x." },
            ],
            then: "$2x$ is a factor: $6x = 3 \\times 2x$",
          },
        ],
        done: "Factors multiply; terms add.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "How many terms?",
        start: "$5a + 3b - 2$",
        stages: [
          {
            prompt: "How many terms?",
            options: [
              { text: "3: $5a$, $3b$ and $-2$", correct: true, feedback: "" },
              { text: "6", feedback: "$5a$ is one term: the 5 and a are multiplied." },
            ],
            then: "3 terms",
          },
          {
            prompt: "It's",
            options: [
              { text: "an expression", correct: true, feedback: "" },
              { text: "an equation", feedback: "There's no = sign." },
            ],
            then: "An expression",
          },
        ],
        done: "Terms are separated by + and −.",
      },
      {
        kind: "sort",
        tag: "Your turn",
        title: "Sort them",
        groups: ["Expression", "Equation", "Inequality"],
        items: [
          { text: "$2n + 5$", group: 0, why: "No comparing sign." },
          { text: "$a^2 - 3b$", group: 0, why: "No comparing sign." },
          { text: "$2n + 5 = 9$", group: 1, why: "An = sign." },
          { text: "$x - 4 = 10$", group: 1, why: "An = sign." },
          { text: "$2n + 5 < 9$", group: 2, why: "A < sign." },
          { text: "$y \\ge 3$", group: 2, why: "A ≥ sign." },
        ],
        done: "The sign in the middle tells you.",
      },
      {
        kind: "choice",
        tag: "Your turn",
        title: "Which is a factor of $8y$?",
        options: [
          { text: "$4y$", correct: true, feedback: "$8y = 2 \\times 4y$." },
          { text: "$3$", feedback: "8 isn't a multiple of 3." },
          { text: "$8 + y$", feedback: "Factors multiply; they aren't added." },
        ],
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Raj says $4x + 3$ is an equation. Is he right?",
        options: [
          {
            text: "No: there's no = sign, so it's an expression",
            correct: true,
            feedback:
              "You can't solve an expression: it has no value until you know x. Mixing up 'expression' and 'equation' is very common.",
          },
          { text: "Yes", feedback: "An equation needs an = sign with something on each side." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ola describes $7m - 2n + 4$.",
        lines: [
          "It has no = sign, so it's an expression",
          "Its terms are 7, m, 2, n and 4",
          "So it has 5 terms",
        ],
        wrong: 1,
        why: "$7m$ is one term (7 times m), and so is $-2n$. The terms are $7m$, $-2n$ and $4$: 3 terms.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "What's the difference?",
        text: "$3x + 2$, $3x + 2 = 11$, $3x + 2 > 11$. Which can be solved to a single answer?",
        options: [
          {
            text: "The equation, $3x + 2 = 11$: $x = 3$",
            correct: true,
            feedback: "The expression has no answer until you know x; the inequality has lots.",
          },
          {
            text: "The expression, $3x + 2$",
            feedback: "An expression has no = sign, so there's nothing to solve.",
          },
          {
            text: "The inequality, $3x + 2 > 11$",
            feedback: "Any x above 3 works: lots of answers.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$5y - 3 = 12$ is",
            options: ["an equation", "an expression", "an inequality"],
            answers: ["an equation"],
            why: "It has an = sign.",
            retry: {
              prompt: "$2a + 9 = 15$ is",
              options: ["an equation", "an expression", "an inequality"],
              answers: ["an equation"],
              why: "It has an = sign.",
            },
          },
          {
            prompt: "How many terms are in $4x + 2y - 7$?",
            answers: ["3"],
            why: "$4x$, $2y$ and $-7$.",
            retry: {
              prompt: "How many terms are in $a - 3b + c + 1$?",
              answers: ["4"],
              why: "$a$, $-3b$, $c$ and $1$.",
            },
          },
          {
            prompt: "Which is a factor of $12x$?",
            options: ["$4x$", "$5$", "$12 + x$"],
            answers: ["$4x$"],
            why: "$12x = 3 \\times 4x$.",
            retry: {
              prompt: "Which is a factor of $10y$?",
              options: ["$5y$", "$3$", "$10 + y$"],
              answers: ["$5y$"],
              why: "$10y = 2 \\times 5y$.",
            },
          },
        ],
      },
    ],
  },
];
