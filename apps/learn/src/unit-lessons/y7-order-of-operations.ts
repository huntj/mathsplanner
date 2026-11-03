// Year 7, "Order of operations": why everyone must agree on what to do first, worked through a
// step at a time; brackets, powers and roots; reciprocals; and using a calculator well, which
// means typing the brackets and making sense of what it shows.
import type { UnitLesson } from "./types.ts";

export const y7OrderOfOperations: UnitLesson = {
  unit: "y7-order-of-operations",
  title: "Who goes first?",
  summary: "Settle the argument about what to work out first.",
  screens: [
    {
      kind: "choice",
      title: "Two answers to one sum. Who is right?",
      text: "Sam and Alex both worked out the same thing.",
      picture: { kind: "maths", tex: "3 + 4 \\times 2" },
      options: [
        {
          text: "Sam, who got 11",
          correct: true,
          feedback: "Multiplying comes before adding: $4 \\times 2 = 8$, then $3 + 8 = 11$.",
        },
        {
          text: "Alex, who got 14",
          feedback: "Alex went left to right: $3 + 4 = 7$, then $\\times 2$. But × comes before +.",
        },
        {
          text: "Both of them",
          feedback: "A calculation can only have one answer, so there must be a rule.",
        },
      ],
    },
    {
      kind: "explain",
      title: "The agreed order",
      text: [
        "**B**rackets first, then **I**ndices (powers and roots), then **D**ivision and **M**ultiplication, then **A**ddition and **S**ubtraction: BIDMAS.",
        "× and ÷ are equal partners, done left to right. So are + and −.",
      ],
      picture: { kind: "maths", tex: "( \\; ) \\to x^2 \\to \\times \\div \\to + -" },
    },
    {
      kind: "steps",
      title: "One step at a time",
      start: "$(5 + 3)^2 - 4 \\times 6$",
      stages: [
        {
          prompt: "What do you work out first?",
          options: [
            { text: "$5 + 3$, in the bracket", correct: true, feedback: "" },
            { text: "$4 \\times 6$", feedback: "Brackets come before multiplying." },
            {
              text: "$3^2$",
              feedback: "The square belongs to the whole bracket. Work out the bracket first.",
            },
          ],
          then: "$= 8^2 - 4 \\times 6$",
        },
        {
          prompt: "What next?",
          options: [
            { text: "$8^2$", correct: true, feedback: "" },
            { text: "$4 \\times 6$", feedback: "Powers come before multiplying." },
            { text: "$8^2 - 4$", feedback: "Subtracting comes last." },
          ],
          then: "$= 64 - 4 \\times 6$",
        },
        {
          prompt: "And next?",
          options: [
            { text: "$4 \\times 6$", correct: true, feedback: "" },
            { text: "$64 - 4$", feedback: "Multiply before you subtract." },
          ],
          then: "$= 64 - 24$",
        },
        {
          prompt: "Finally:",
          options: [
            { text: "$40$", correct: true, feedback: "" },
            { text: "$88$", feedback: "It is $64 - 24$, not $64 + 24$." },
            { text: "$30$", feedback: "Check the subtraction: $64 - 24$." },
          ],
          then: "$= 40$",
        },
      ],
      done: "Brackets, then the power, then ×, then −: 40.",
    },
    {
      kind: "answer",
      title: "Work out $20 - 12 \\div 4$",
      answers: ["17"],
      wrong: [
        {
          answer: "2",
          feedback: "That works out $20 - 12$ first. Dividing comes before subtracting.",
        },
      ],
      hint: "Divide before you subtract.",
      done: "$12 \\div 4 = 3$, then $20 - 3 = 17$.",
    },
    {
      kind: "answer",
      title: "Work out $2 \\times 3^2$",
      answers: ["18"],
      wrong: [{ answer: "36", feedback: "That squares 6. The power belongs to the 3 only." }],
      hint: "Powers come before multiplying: work out $3^2$ first.",
      done: "$3^2 = 9$, then $2 \\times 9 = 18$.",
    },
    {
      kind: "fill",
      title: "Put brackets in to make it true",
      template: "$2 \\times$ [] $3 + 4$ [] $= 14$",
      bank: ["(", ")", "×", "+"],
      answers: ["(", ")"],
      hint: "Which two numbers must be added before multiplying by 2 to make 14?",
      done: "$2 \\times (3 + 4) = 2 \\times 7 = 14$. Brackets change the order.",
    },
    {
      kind: "answer",
      title: "Work out $\\sqrt{16 + 9}$",
      answers: ["5"],
      wrong: [
        {
          answer: "7",
          feedback:
            "That is $\\sqrt{16} + \\sqrt{9}$. The root sign covers all of $16 + 9$, like a bracket.",
        },
      ],
      hint: "The root sign works like a bracket: add first.",
      done: "$16 + 9 = 25$, and $\\sqrt{25} = 5$.",
    },
    {
      kind: "explain",
      title: "Reciprocals",
      text: [
        "The **reciprocal** of a number is what you multiply it by to get 1.",
        "The reciprocal of 4 is $\\frac14$, and the reciprocal of $\\frac23$ is $\\frac32$: turn the fraction upside down.",
      ],
      picture: { kind: "maths", tex: "\\frac{2}{3} \\times \\frac{3}{2} = 1" },
    },
    {
      kind: "choice",
      title: "What is the reciprocal of $\\frac{5}{8}$?",
      options: [
        {
          text: "$\\frac{8}{5}$",
          correct: true,
          feedback: "$\\frac58 \\times \\frac85 = \\frac{40}{40} = 1$.",
        },
        {
          text: "$-\\frac{5}{8}$",
          feedback: "That adds to $\\frac58$ to make 0. A reciprocal multiplies to make 1.",
        },
        { text: "$\\frac{1}{8}$", feedback: "Turn the whole fraction upside down." },
      ],
    },
    {
      kind: "answer",
      title: "What is the reciprocal of 0.5?",
      answers: ["2"],
      wrong: [{ answer: "5", feedback: "0.5 is $\\frac12$. Turn $\\frac12$ upside down." }],
      hint: "Write 0.5 as a fraction first.",
      done: "$0.5 = \\frac12$, so its reciprocal is $\\frac21 = 2$. Check: $0.5 \\times 2 = 1$.",
    },
    {
      kind: "choice",
      title: "Which keys do you press?",
      text: "To work out $\\frac{12 + 8}{4}$ on a calculator:",
      options: [
        {
          text: "( 12 + 8 ) ÷ 4",
          correct: true,
          feedback: "The fraction bar groups the top, so a calculator needs brackets round it: 5.",
        },
        {
          text: "12 + 8 ÷ 4",
          feedback: "The calculator does $8 \\div 4$ first and gives 14. It follows BIDMAS too.",
        },
        { text: "12 + ( 8 ÷ 4 )", feedback: "That still divides only the 8." },
      ],
    },
    {
      kind: "choice",
      title: "Making sense of the screen",
      text: "Mia shares £7 between 3 friends. The calculator shows 2.333333333.",
      options: [
        {
          text: "They get £2.33 each",
          correct: true,
          feedback: "Money has two decimal places: £2.33 each, with 1p left over.",
        },
        {
          text: "They get £2.333333333 each",
          feedback: "There is no such coin: round to the nearest penny.",
        },
        { text: "They get £2.30 each", feedback: "0.333… of a pound is 33p, not 30p." },
      ],
    },
    {
      kind: "answer",
      title: "How many minibuses?",
      text: "A minibus holds 16 pupils. 70 pupils go on a trip. The calculator says $70 \\div 16 = 4.375$.",
      answers: ["5"],
      wrong: [
        {
          answer: "4",
          feedback: "4 minibuses carry only 64 pupils. The other 6 need a bus too: round up.",
        },
        { answer: "4.375", feedback: "You cannot book part of a minibus." },
      ],
      hint: "Can you leave anyone behind?",
      done: "5 minibuses. Think about what the answer means before you round.",
    },
    {
      kind: "explain",
      title: "Now everyone agrees",
      text: [
        "Brackets, then powers and roots, then × and ÷, then + and −.",
        "A reciprocal turns a fraction upside down: the two multiply to 1.",
        "Type brackets on a calculator, and make sense of its answer before you round.",
      ],
      picture: { kind: "maths", tex: "(5 + 3)^2 - 4 \\times 6 = 40" },
    },
  ],
};
