// Year 9, "Standard form and indices", as five short lessons, one just before each skill:
// multiplying and dividing in standard form (from counting zeros), adding and subtracting in
// standard form, multiplying and dividing powers, a power of a power, and putting the laws
// together. Each starts from something quick the pupil can already do, builds the method a step
// at a time, names the common mistakes, and ends on an exit check.
import type { UnitLesson } from "./types.ts";

const SF_TIMES = "Y9-NPV-01.a";
const SF_PLUS = "Y9-NPV-01.b";
const LAWS = "Y9-ALG-02.a";
const POWER = "Y9-ALG-02.b";
const SIMPLIFY = "Y9-ALG-02.c";

export const y9Indices: UnitLesson[] = [
  {
    unit: "y9-indices",
    id: "y9-indices/multiply-standard-form",
    before: SF_TIMES,
    title: "Multiplying huge numbers",
    summary: "Multiply and divide numbers in standard form without writing out the zeros.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How far does light go in a year?",
        text: [
          "Light travels $3 \\times 10^8$ metres every second, and there are about $3.2 \\times 10^7$ seconds in a year.",
          "Written out, that's a lot of zeros to get wrong. By the end of this lesson, you can multiply them in your head.",
        ],
        picture: { kind: "maths", tex: "(3 \\times 10^8) \\times (3.2 \\times 10^7)" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $10 \\times 1000$?",
        answers: ["10000", "10,000"],
        wrong: [
          {
            answer: "1010",
            feedback: "That adds them. Multiplying by 10 puts one more zero on 1000.",
          },
        ],
        hint: "Multiplying by 10 adds one zero.",
        done: "$10 \\times 1000 = 10\\,000$: one zero and three zeros make four.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Which is 4000 in standard form?",
        options: [
          {
            text: "$4 \\times 10^3$",
            correct: true,
            feedback: "$4 \\times 1000 = 4000$. One digit before the point, times a power of 10.",
          },
          {
            text: "$4 \\times 10^4$",
            feedback: "$10^4 = 10\\,000$, so that's 40 000. 4000 has three zeros.",
          },
          {
            text: "$40 \\times 10^2$",
            feedback: "It's 4000, but standard form has just one digit, 1 to 9, before the point.",
          },
        ],
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "$10^2 \\times 10^3$",
        text: "That's $100 \\times 1000$. How many zeros does the answer have?",
        answers: ["5"],
        wrong: [{ answer: "6", feedback: "Count them: $100 \\times 1000 = 100\\,000$." }],
        hint: "Work out $100 \\times 1000$, then count the zeros.",
        done: "$100\\,000$: two zeros and three zeros make five. So $10^2 \\times 10^3 = 10^5$.",
      },
      {
        kind: "fill",
        tag: "Discover",
        title: "Spot the rule",
        picture: {
          kind: "table",
          rows: [
            ["$10^2 \\times 10^3$", "$10^5$"],
            ["$10^4 \\times 10^2$", "$10^6$"],
            ["$10^1 \\times 10^7$", "$10^8$"],
          ],
        },
        template: "$10^6 \\times 10^5 =$ []",
        bank: ["$10^{11}$", "$10^{30}$", "$100^{11}$", "$10^{1}$"],
        answers: ["$10^{11}$"],
        hint: "Count the zeros: six, then five more.",
        done: "Multiplying powers of 10: **add** the powers. $6 + 5 = 11$.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Numbers and powers apart",
        text: [
          "When you multiply, the order doesn't matter. So multiply the numbers, and multiply the powers of 10 by adding.",
          "$(3 \\times 10^4) \\times (2 \\times 10^5) = (3 \\times 2) \\times (10^4 \\times 10^5) = 6 \\times 10^9$.",
        ],
        picture: {
          kind: "maths",
          tex: "(3 \\times 2) \\times (10^{4} \\times 10^{5}) = 6 \\times 10^{9}",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "When the number gets too big",
        problem: "Work out $(4 \\times 10^3) \\times (5 \\times 10^6)$.",
        steps: [
          { line: "$4 \\times 5 = 20$", why: "Multiply the numbers." },
          { line: "$10^3 \\times 10^6 = 10^9$", why: "Add the powers: $3 + 6 = 9$." },
          { line: "$20 \\times 10^9$", why: "Put them together. But 20 isn't between 1 and 10." },
          {
            line: "$= 2 \\times 10^{10}$",
            why: "$20 = 2 \\times 10$, so one more 10: the power goes up by one.",
          },
        ],
        done: "$2 \\times 10^{10}$. Multiply, add the powers, then tidy up.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$(2 \\times 10^5) \\times (4 \\times 10^3)$",
        start: "$(2 \\times 10^5) \\times (4 \\times 10^3)$",
        stages: [
          {
            prompt: "Multiply the numbers:",
            options: [
              { text: "$2 \\times 4 = 8$", correct: true, feedback: "" },
              { text: "$2 + 4 = 6$", feedback: "Multiply the numbers, don't add them." },
            ],
            then: "$8$",
          },
          {
            prompt: "Now the powers of 10:",
            options: [
              { text: "$10^8$", correct: true, feedback: "" },
              { text: "$10^{15}$", feedback: "Add the powers, don't multiply them: $5 + 3$." },
              { text: "$10^2$", feedback: "Taking away is for dividing. Here, add: $5 + 3$." },
            ],
            then: "$8 \\times 10^8$",
          },
        ],
        done: "8 is between 1 and 10, so $8 \\times 10^8$ is already in standard form.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Dividing: $(9 \\times 10^8) \\div (3 \\times 10^2)$",
        text: "Dividing works the same way, backwards.",
        start: "$(9 \\times 10^8) \\div (3 \\times 10^2)$",
        stages: [
          {
            prompt: "Divide the numbers:",
            options: [
              { text: "$9 \\div 3 = 3$", correct: true, feedback: "" },
              { text: "$9 - 3 = 6$", feedback: "Divide the numbers: $9 \\div 3$." },
            ],
            then: "$3$",
          },
          {
            prompt: "Now the powers of 10:",
            options: [
              { text: "$10^6$", correct: true, feedback: "" },
              { text: "$10^4$", feedback: "That divides the powers. Take them away: $8 - 2$." },
              { text: "$10^{10}$", feedback: "Adding is for multiplying. Dividing takes away." },
            ],
            then: "$3 \\times 10^6$",
          },
        ],
        done: "Divide the numbers; take away the powers.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "$(3 \\times 10^4) \\times (3 \\times 10^5)$",
        template: "$(3 \\times 10^4) \\times (3 \\times 10^5) =$ []",
        bank: ["$9 \\times 10^9$", "$9 \\times 10^{20}$", "$6 \\times 10^9$", "$9 \\times 10^1$"],
        answers: ["$9 \\times 10^9$"],
        hint: "$3 \\times 3$, and add the powers: $4 + 5$.",
        done: "$9 \\times 10^9$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "$(6 \\times 10^5) \\times (5 \\times 10^4)$",
        template: "$(6 \\times 10^5) \\times (5 \\times 10^4) =$ []",
        bank: [
          "$3 \\times 10^{10}$",
          "$3 \\times 10^9$",
          "$11 \\times 10^9$",
          "$3 \\times 10^{20}$",
        ],
        answers: ["$3 \\times 10^{10}$"],
        hint: "$6 \\times 5 = 30$ and $10^9$. Then write 30 as $3 \\times 10$.",
        done: "$30 \\times 10^9 = 3 \\times 10^{10}$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "$(8 \\times 10^9) \\div (2 \\times 10^3)$",
        template: "$(8 \\times 10^9) \\div (2 \\times 10^3) =$ []",
        bank: ["$4 \\times 10^6$", "$4 \\times 10^3$", "$6 \\times 10^6$", "$4 \\times 10^{12}$"],
        answers: ["$4 \\times 10^6$"],
        hint: "$8 \\div 2$, and take away the powers: $9 - 3$.",
        done: "$4 \\times 10^6$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title:
          "Mo says $(2 \\times 10^3) \\times (3 \\times 10^4) = 6 \\times 10^{12}$. Is Mo right?",
        options: [
          {
            text: "No: it's $6 \\times 10^7$",
            correct: true,
            feedback:
              "$10^3 \\times 10^4$ is three 10s, then four more: seven. **Multiplying the powers** is the most common slip.",
          },
          {
            text: "Yes: multiply everything",
            feedback:
              "The numbers multiply, but powers of 10 **add**: $1000 \\times 10\\,000 = 10^7$.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Ana works out $(5 \\times 10^4) \\times (6 \\times 10^2)$.",
        lines: [
          "$5 \\times 6 = 30$",
          "$10^4 \\times 10^2 = 10^6$",
          "So it's $30 \\times 10^6$",
          "In standard form: $3 \\times 10^5$",
        ],
        wrong: 3,
        why: "$30 = 3 \\times 10$, so there's one **more** 10: $3 \\times 10^7$. Making the number smaller means making the power bigger.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "How far does light go in a year?",
        text: "$(3 \\times 10^8) \\times (3.2 \\times 10^7)$ metres.",
        options: [
          {
            text: "$9.6 \\times 10^{15}$ m",
            correct: true,
            feedback:
              "$3 \\times 3.2 = 9.6$ and $10^{8 + 7} = 10^{15}$. Nearly ten thousand million million metres: a light year.",
          },
          {
            text: "$9.6 \\times 10^{56}$ m",
            feedback: "That multiplies the powers. Add them: $8 + 7$.",
          },
          { text: "$6.2 \\times 10^{15}$ m", feedback: "That adds 3 and 3.2. Multiply them." },
          {
            text: "$9.6 \\times 10^{1}$ m",
            feedback: "That takes the powers away. Multiplying adds them.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$(3 \\times 10^5) \\times (2 \\times 10^4) =$",
            options: ["$6 \\times 10^9$", "$6 \\times 10^{20}$", "$5 \\times 10^9$"],
            answers: ["$6 \\times 10^9$"],
            why: "$3 \\times 2 = 6$ and $5 + 4 = 9$.",
            retry: {
              prompt: "$(4 \\times 10^2) \\times (2 \\times 10^6) =$",
              options: ["$8 \\times 10^8$", "$8 \\times 10^{12}$", "$6 \\times 10^8$"],
              answers: ["$8 \\times 10^8$"],
              why: "$4 \\times 2 = 8$ and $2 + 6 = 8$.",
            },
          },
          {
            prompt: "$(5 \\times 10^3) \\times (4 \\times 10^5) =$",
            options: ["$2 \\times 10^9$", "$2 \\times 10^8$", "$20 \\times 10^{15}$"],
            answers: ["$2 \\times 10^9$"],
            why: "$20 \\times 10^8 = 2 \\times 10^9$.",
            retry: {
              prompt: "$(6 \\times 10^4) \\times (5 \\times 10^2) =$",
              options: ["$3 \\times 10^7$", "$3 \\times 10^6$", "$30 \\times 10^8$"],
              answers: ["$3 \\times 10^7$"],
              why: "$30 \\times 10^6 = 3 \\times 10^7$.",
            },
          },
          {
            prompt: "$(8 \\times 10^7) \\div (4 \\times 10^2) =$",
            options: ["$2 \\times 10^5$", "$2 \\times 10^9$", "$4 \\times 10^5$"],
            answers: ["$2 \\times 10^5$"],
            why: "$8 \\div 4 = 2$ and $7 - 2 = 5$.",
            retry: {
              prompt: "$(6 \\times 10^9) \\div (2 \\times 10^4) =$",
              options: ["$3 \\times 10^5$", "$3 \\times 10^{13}$", "$4 \\times 10^5$"],
              answers: ["$3 \\times 10^5$"],
              why: "$6 \\div 2 = 3$ and $9 - 4 = 5$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-indices",
    id: "y9-indices/add-standard-form",
    before: SF_PLUS,
    title: "Adding huge numbers",
    summary: "Add and subtract in standard form by matching the powers first.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A growing world",
        text: [
          "About $8.1 \\times 10^9$ people live on Earth. Over a year, about $7 \\times 10^7$ more are added.",
          "What will the population be? By the end of this lesson, you can add numbers like these.",
        ],
        picture: { kind: "maths", tex: "(8.1 \\times 10^9) + (7 \\times 10^7)" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Write $3.5 \\times 10^4$ as an ordinary number",
        answers: ["35000", "35,000"],
        wrong: [
          {
            answer: "350000",
            feedback: "$10^4 = 10\\,000$, and $3.5 \\times 10\\,000 = 35\\,000$.",
          },
        ],
        hint: "$10^4 = 10\\,000$. Multiply 3.5 by that.",
        done: "$3.5 \\times 10\\,000 = 35\\,000$.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "$(2 \\times 10^3) \\times (4 \\times 10^5) =$",
        options: [
          {
            text: "$8 \\times 10^8$",
            correct: true,
            feedback: "Multiply the numbers, add the powers.",
          },
          { text: "$8 \\times 10^{15}$", feedback: "Add the powers when multiplying: $3 + 5$." },
          { text: "$6 \\times 10^8$", feedback: "Multiply the numbers: $2 \\times 4$." },
        ],
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "What is $3000 + 400$?",
        answers: ["3400", "3,400"],
        wrong: [{ answer: "7000", feedback: "400 is four hundreds, not four thousands." }],
        hint: "3 thousands and 4 hundreds.",
        done: "$3400$, which is $3.4 \\times 10^3$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "So what is $(3 \\times 10^3) + (4 \\times 10^2)$?",
        text: "That's the same sum: $3000 + 400$.",
        options: [
          {
            text: "$3.4 \\times 10^3$",
            correct: true,
            feedback: "$3000 + 400 = 3400 = 3.4 \\times 10^3$.",
          },
          { text: "$7 \\times 10^5$", feedback: "That's 700 000! Adding never adds the powers." },
          { text: "$7 \\times 10^3$", feedback: "That's 7000, but $4 \\times 10^2$ is only 400." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Match the powers first",
        text: [
          "You can only add the front numbers when the powers match, like adding apples to apples.",
          "So rewrite the smaller one: $4 \\times 10^2 = 0.4 \\times 10^3$. Then $3 + 0.4 = 3.4$, giving $3.4 \\times 10^3$.",
        ],
        picture: { kind: "maths", tex: "3 \\times 10^3 + 0.4 \\times 10^3 = 3.4 \\times 10^3" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Adding with different powers",
        problem: "Work out $(6.2 \\times 10^5) + (3 \\times 10^4)$.",
        steps: [
          {
            line: "$3 \\times 10^4 = 0.3 \\times 10^5$",
            why: "Match the powers: give the smaller one the bigger power. One more 10 means the number is 10 times smaller.",
          },
          { line: "$6.2 + 0.3 = 6.5$", why: "Now add the front numbers." },
          {
            line: "$6.5 \\times 10^5$",
            why: "The power stays the same: we added, not multiplied.",
          },
        ],
        done: "Check: $620\\,000 + 30\\,000 = 650\\,000 = 6.5 \\times 10^5$ ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$(5 \\times 10^4) + (2 \\times 10^4)$",
        text: "The powers already match.",
        start: "$(5 \\times 10^4) + (2 \\times 10^4)$",
        stages: [
          {
            prompt: "Add the front numbers. The power",
            options: [
              { text: "stays the same: $7 \\times 10^4$", correct: true, feedback: "" },
              {
                text: "doubles: $7 \\times 10^8$",
                feedback: "5 lots of $10^4$ and 2 more lots make 7 lots of $10^4$.",
              },
            ],
            then: "$7 \\times 10^4$",
          },
        ],
        done: "50 000 + 20 000 = 70 000 ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$(4.5 \\times 10^6) - (2 \\times 10^5)$",
        start: "$(4.5 \\times 10^6) - (2 \\times 10^5)$",
        stages: [
          {
            prompt: "Match the powers: $2 \\times 10^5 =$",
            options: [
              { text: "$0.2 \\times 10^6$", correct: true, feedback: "" },
              {
                text: "$20 \\times 10^6$",
                feedback: "A bigger power means a smaller front number: divide by 10.",
              },
              { text: "$2 \\times 10^6$", feedback: "That's ten times too big." },
            ],
            then: "$4.5 \\times 10^6 - 0.2 \\times 10^6$",
          },
          {
            prompt: "Take away the front numbers:",
            options: [
              { text: "$4.3 \\times 10^6$", correct: true, feedback: "" },
              { text: "$2.5 \\times 10^6$", feedback: "That takes away 2, not 0.2." },
              { text: "$4.3 \\times 10^{1}$", feedback: "The power stays at 6." },
            ],
            then: "$4.3 \\times 10^6$",
          },
        ],
        done: "Match the powers, then add or take away the front numbers.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "$(7 \\times 10^5) - (3 \\times 10^5)$",
        template: "$(7 \\times 10^5) - (3 \\times 10^5) =$ []",
        bank: ["$4 \\times 10^5$", "$4 \\times 10^0$", "$4 \\times 10^{10}$", "$10 \\times 10^5$"],
        answers: ["$4 \\times 10^5$"],
        hint: "The powers match: take away the front numbers.",
        done: "$4 \\times 10^5$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "$(2.4 \\times 10^4) + (6 \\times 10^3)$",
        template: "$(2.4 \\times 10^4) + (6 \\times 10^3) =$ []",
        bank: ["$3 \\times 10^4$", "$8.4 \\times 10^4$", "$8.4 \\times 10^7$", "$3 \\times 10^3$"],
        answers: ["$3 \\times 10^4$"],
        hint: "$6 \\times 10^3 = 0.6 \\times 10^4$.",
        done: "$2.4 + 0.6 = 3$, so $3 \\times 10^4$. Check: $24\\,000 + 6000 = 30\\,000$ ✓",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Jay says $(4 \\times 10^5) + (3 \\times 10^2) = 7 \\times 10^7$. Is Jay right?",
        options: [
          {
            text: "No: it's $4.003 \\times 10^5$",
            correct: true,
            feedback:
              "$400\\,000 + 300 = 400\\,300$. **Adding the powers** only works when you multiply.",
          },
          {
            text: "Yes: add the numbers, add the powers",
            feedback: "$7 \\times 10^7$ is 70 million. $400\\,000 + 300$ is nowhere near.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Raj works out $(8 \\times 10^6) - (5 \\times 10^5)$.",
        lines: [
          "Match the powers: $5 \\times 10^5 = 0.5 \\times 10^6$",
          "$8 - 5 = 3$",
          "So it's $3 \\times 10^6$",
        ],
        wrong: 1,
        why: "After matching, take away the matched number: $8 - 0.5 = 7.5$, so $7.5 \\times 10^6$.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "A growing world",
        text: "$(8.1 \\times 10^9) + (7 \\times 10^7)$ people.",
        options: [
          {
            text: "$8.17 \\times 10^9$",
            correct: true,
            feedback: "$7 \\times 10^7 = 0.07 \\times 10^9$, and $8.1 + 0.07 = 8.17$.",
          },
          { text: "$15.1 \\times 10^{16}$", feedback: "Adding never adds the powers." },
          {
            text: "$8.8 \\times 10^9$",
            feedback:
              "$7 \\times 10^7$ is $0.07 \\times 10^9$: two powers apart, so divide by 100.",
          },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$(3 \\times 10^4) + (5 \\times 10^4) =$",
            options: ["$8 \\times 10^4$", "$8 \\times 10^8$", "$15 \\times 10^4$"],
            answers: ["$8 \\times 10^4$"],
            why: "The powers match: $3 + 5 = 8$.",
            retry: {
              prompt: "$(6 \\times 10^7) - (2 \\times 10^7) =$",
              options: ["$4 \\times 10^7$", "$4 \\times 10^0$", "$4 \\times 10^{14}$"],
              answers: ["$4 \\times 10^7$"],
              why: "The powers match: $6 - 2 = 4$.",
            },
          },
          {
            prompt: "$(5 \\times 10^5) + (3 \\times 10^4) =$",
            options: ["$5.3 \\times 10^5$", "$8 \\times 10^9$", "$8 \\times 10^5$"],
            answers: ["$5.3 \\times 10^5$"],
            why: "$3 \\times 10^4 = 0.3 \\times 10^5$, and $5 + 0.3 = 5.3$.",
            retry: {
              prompt: "$(2 \\times 10^6) + (4 \\times 10^5) =$",
              options: ["$2.4 \\times 10^6$", "$6 \\times 10^{11}$", "$6 \\times 10^6$"],
              answers: ["$2.4 \\times 10^6$"],
              why: "$4 \\times 10^5 = 0.4 \\times 10^6$, and $2 + 0.4 = 2.4$.",
            },
          },
          {
            prompt: "$(9 \\times 10^3) - (4 \\times 10^2) =$",
            options: ["$8.6 \\times 10^3$", "$5 \\times 10^1$", "$5 \\times 10^3$"],
            answers: ["$8.6 \\times 10^3$"],
            why: "$9000 - 400 = 8600$.",
            retry: {
              prompt: "$(7 \\times 10^5) - (5 \\times 10^4) =$",
              options: ["$6.5 \\times 10^5$", "$2 \\times 10^1$", "$2 \\times 10^5$"],
              answers: ["$6.5 \\times 10^5$"],
              why: "$700\\,000 - 50\\,000 = 650\\,000$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-indices",
    id: "y9-indices/multiply-powers",
    before: LAWS,
    title: "Multiplying and dividing powers",
    summary: "Write powers out in full to find the laws: add to multiply, take away to divide.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "How big is a megabyte?",
        text: [
          "Computer memory counts in powers of 2. A kilobyte is $2^{10}$ bytes, and a megabyte is $2^{10}$ kilobytes.",
          "How many bytes are in a megabyte, as a power of 2? By the end of this lesson, it's one quick step.",
        ],
        picture: { kind: "maths", tex: "2^{10} \\times 2^{10} = 2^{?}" },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $2^3$?",
        answers: ["8"],
        wrong: [
          { answer: "6", feedback: "That's $2 \\times 3$. $2^3$ means $2 \\times 2 \\times 2$." },
        ],
        hint: "$2^3 = 2 \\times 2 \\times 2$.",
        done: "$2 \\times 2 \\times 2 = 8$. The power counts how many 2s are multiplied.",
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "Write $5 \\times 5 \\times 5 \\times 5$ as a power",
        options: [
          { text: "$5^4$", correct: true, feedback: "Four 5s multiplied: $5^4$." },
          {
            text: "$4^5$",
            feedback: "The base is the number being multiplied, 5; the power counts them, 4.",
          },
          {
            text: "$5 \\times 4$",
            feedback: "That's 20. $5^4$ is $5 \\times 5 \\times 5 \\times 5 = 625$.",
          },
        ],
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "$2^3 \\times 2^2$",
        text: "Write it out: $(2 \\times 2 \\times 2) \\times (2 \\times 2)$. How many 2s are multiplied?",
        answers: ["5"],
        wrong: [{ answer: "6", feedback: "Count them: three 2s, then two more." }],
        hint: "Three 2s, then two more.",
        done: "Five 2s: $2^3 \\times 2^2 = 2^5$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Spot the law",
        picture: {
          kind: "table",
          rows: [
            ["$3^2 \\times 3^3$", "$3^5$"],
            ["$5^4 \\times 5^2$", "$5^6$"],
            ["$7^3 \\times 7^6$", "?"],
          ],
        },
        options: [
          { text: "$7^9$", correct: true, feedback: "Same base: **add the powers**. $3 + 6 = 9$." },
          {
            text: "$7^{18}$",
            feedback: "That multiplies the powers. Count the 7s: three, then six more.",
          },
          { text: "$49^9$", feedback: "The base stays 7: they are all 7s multiplied together." },
        ],
      },
      {
        kind: "steps",
        tag: "Discover",
        title: "Dividing powers",
        start:
          "$\\frac{2^6}{2^2} = \\frac{2 \\times 2 \\times 2 \\times 2 \\times 2 \\times 2}{2 \\times 2}$",
        stages: [
          {
            prompt: "Cancel the 2s on the bottom with 2s on the top. How many 2s are left?",
            options: [
              { text: "4", correct: true, feedback: "" },
              { text: "3", feedback: "6 on top, 2 on the bottom: cancel two of them." },
              { text: "8", feedback: "Dividing cancels: there are fewer, not more." },
            ],
            then: "$= 2^4$",
          },
        ],
        done: "To divide, **take the powers away**: $2^6 \\div 2^2 = 2^{6 - 2} = 2^4$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "What is $5^0$?",
        text: "Each step down divides by 5. Follow the pattern.",
        picture: {
          kind: "table",
          rows: [
            ["$5^3$", "$125$"],
            ["$5^2$", "$25$"],
            ["$5^1$", "$5$"],
            ["$5^0$", "?"],
          ],
        },
        options: [
          {
            text: "$1$",
            correct: true,
            feedback:
              "$5 \\div 5 = 1$. Anything (but 0) to the power 0 is 1, as in $5^3 \\div 5^3 = 5^0 = 1$.",
          },
          { text: "$0$", feedback: "Each step down divides by 5. What is $5 \\div 5$?" },
          { text: "$5$", feedback: "$5^1$ is 5. One step further divides by 5 again." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The two laws",
        text: [
          "With the **same base**: to multiply, add the powers; to divide, take them away.",
          "They only work for the same base: $2^3 \\times 5^2$ can't be made into one power.",
        ],
        picture: {
          kind: "maths",
          tex: "a^m \\times a^n = a^{m + n} \\qquad a^m \\div a^n = a^{m - n}",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Both laws at once",
        problem: "Simplify $\\frac{x^5 \\times x^4}{x^3}$.",
        steps: [
          { line: "$x^5 \\times x^4 = x^9$", why: "The top first: same base, so add the powers." },
          { line: "$\\frac{x^9}{x^3} = x^6$", why: "Then divide: take away the powers, $9 - 3$." },
        ],
        done: "$x^6$. Check by counting: nine x's on top, three cancel, six left ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$3^4 \\times 3^5$",
        start: "$3^4 \\times 3^5$",
        stages: [
          {
            prompt: "Is it the same base?",
            options: [
              { text: "Yes: both are powers of 3", correct: true, feedback: "" },
              { text: "No", feedback: "Both are 3 to a power: the same base." },
            ],
            then: "Same base: add the powers.",
          },
          {
            prompt: "So $3^4 \\times 3^5 =$",
            options: [
              { text: "$3^9$", correct: true, feedback: "" },
              { text: "$3^{20}$", feedback: "That multiplies the powers. Add them: $4 + 5$." },
              { text: "$9^9$", feedback: "The base stays 3." },
            ],
            then: "$3^9$",
          },
        ],
        done: "Same base, multiplying: add the powers.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$\\frac{y^8}{y^3}$",
        start: "$\\frac{y^8}{y^3}$",
        stages: [
          {
            prompt: "Dividing, with the same base. So",
            options: [
              { text: "take away the powers: $y^5$", correct: true, feedback: "" },
              {
                text: "add the powers: $y^{11}$",
                feedback: "Adding is for multiplying. Dividing cancels, so take away.",
              },
              {
                text: "divide the powers: $y^{2.67}$",
                feedback: "Three y's on the bottom cancel three on top: $8 - 3$.",
              },
            ],
            then: "$y^5$",
          },
        ],
        done: "Eight y's on top, three cancel: five left.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Use the laws",
        template: "$a^5 \\times a^3 =$ [] and $a^9 \\div a^4 =$ []",
        bank: ["$a^8$", "$a^{15}$", "$a^5$", "$a^{13}$", "$a^2$"],
        answers: ["$a^8$", "$a^5$"],
        hint: "Multiplying: add the powers. Dividing: take them away.",
        done: "$a^{5 + 3} = a^8$ and $a^{9 - 4} = a^5$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Simplify",
        template: "$\\frac{x^7 \\times x^2}{x^4} =$ []",
        bank: ["$x^5$", "$x^{10}$", "$x^{14}$", "$x^3$"],
        answers: ["$x^5$"],
        hint: "Top first: $x^7 \\times x^2 = x^9$. Then divide by $x^4$.",
        done: "$x^{7 + 2 - 4} = x^5$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Which can be written as a single power?",
        options: [
          { text: "$5^2 \\times 5^6$", correct: true, feedback: "Same base, multiplying: $5^8$." },
          {
            text: "$5^2 \\times 3^6$",
            feedback: "Different bases: the laws only work when the base is the same.",
          },
          {
            text: "$5^2 + 5^6$",
            feedback:
              "That's adding, not multiplying: $25 + 15\\,625$ isn't a power of 5. The laws are for multiplying and dividing.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Kim simplifies $3^5 \\times 3^2$.",
        lines: [
          "Same base, so add the powers: $5 + 2 = 7$",
          "Multiply the bases: $3 \\times 3 = 9$",
          "So $3^5 \\times 3^2 = 9^7$",
        ],
        wrong: 1,
        why: "The base stays the same: $3^7$. The powers count the 3s; the 3s don't join up into 9s.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "How big is a megabyte?",
        start: "A megabyte is $2^{10}$ kilobytes, each of $2^{10}$ bytes.",
        stages: [
          {
            prompt: "Bytes in a megabyte: $2^{10} \\times 2^{10} =$",
            options: [
              { text: "$2^{20}$", correct: true, feedback: "" },
              { text: "$2^{100}$", feedback: "Add the powers: $10 + 10$." },
              { text: "$4^{20}$", feedback: "The base stays 2." },
            ],
            then: "$2^{20} = 1\\,048\\,576$ bytes",
          },
          {
            prompt:
              "A gigabyte is $2^{30}$ bytes. How many megabytes is that? $2^{30} \\div 2^{20} =$",
            options: [
              { text: "$2^{10}$", correct: true, feedback: "" },
              { text: "$2^{50}$", feedback: "Dividing takes the powers away." },
              { text: "$2^{1.5}$", feedback: "Take the powers away; don't divide them." },
            ],
            then: "$2^{10} = 1024$ megabytes",
          },
        ],
        done: "$2^{20}$ bytes in a megabyte, and 1024 megabytes in a gigabyte.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$7^4 \\times 7^5 =$",
            options: ["$7^9$", "$7^{20}$", "$49^9$"],
            answers: ["$7^9$"],
            why: "Same base: add the powers.",
            retry: {
              prompt: "$4^6 \\times 4^3 =$",
              options: ["$4^9$", "$4^{18}$", "$16^9$"],
              answers: ["$4^9$"],
              why: "Same base: add the powers.",
            },
          },
          {
            prompt: "$\\frac{x^{10}}{x^4} =$",
            options: ["$x^6$", "$x^{14}$", "$x^{2.5}$"],
            answers: ["$x^6$"],
            why: "Take away the powers: $10 - 4$.",
            retry: {
              prompt: "$\\frac{y^9}{y^2} =$",
              options: ["$y^7$", "$y^{11}$", "$y^{4.5}$"],
              answers: ["$y^7$"],
              why: "Take away the powers: $9 - 2$.",
            },
          },
          {
            prompt: "$\\frac{a^3 \\times a^6}{a^5} =$",
            options: ["$a^4$", "$a^{14}$", "$a^{3.6}$"],
            answers: ["$a^4$"],
            why: "$a^{3 + 6 - 5} = a^4$.",
            retry: {
              prompt: "$\\frac{b^7 \\times b}{b^2} =$",
              options: ["$b^6$", "$b^5$", "$b^{3.5}$"],
              answers: ["$b^6$"],
              why: "$b$ is $b^1$: $b^{7 + 1 - 2} = b^6$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-indices",
    id: "y9-indices/power-of-a-power",
    before: POWER,
    title: "A power of a power",
    summary: "A bracket raised to a power: multiply the powers, and power the number too.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Pixels in a photo",
        text: [
          "A square photo is $2^5$ pixels wide and $2^5$ pixels tall. Its number of pixels is $(2^5)^2$.",
          "How many pixels is that, as a power of 2? By the end of this lesson, you can do it at a glance.",
        ],
        picture: { kind: "maths", tex: "(2^5)^2" },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "$2^4 \\times 2^3 =$",
        options: [
          { text: "$2^7$", correct: true, feedback: "Same base, multiplying: add the powers." },
          { text: "$2^{12}$", feedback: "Add the powers: $4 + 3$." },
          { text: "$4^7$", feedback: "The base stays 2." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "A square has sides of 6 cm. What is its area?",
        answers: ["36"],
        unit: "cm²",
        wrong: [{ answer: "12", feedback: "That's $6 \\times 2$. The area is $6 \\times 6$." }],
        hint: "$6^2 = 6 \\times 6$.",
        done: "$6^2 = 36$ cm². Squaring means multiplying a thing by itself.",
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "$(x^3)^2$",
        text: "That's $x^3 \\times x^3$, or $(x \\times x \\times x) \\times (x \\times x \\times x)$. How many x's are multiplied?",
        answers: ["6"],
        wrong: [{ answer: "5", feedback: "Count them: three x's, twice over." }],
        hint: "Three x's, twice over.",
        done: "Six: $(x^3)^2 = x^6$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Now $(x^3)^4$",
        options: [
          {
            text: "$x^{12}$",
            correct: true,
            feedback: "Four lots of $x^3$: $x^{3 + 3 + 3 + 3} = x^{12}$. **Multiply the powers.**",
          },
          { text: "$x^7$", feedback: "That adds them. The bracket means $x^3$ four times over." },
          {
            text: "$x^{81}$",
            feedback: "That is $3^4$. Write out $x^3 \\times x^3 \\times x^3 \\times x^3$.",
          },
        ],
      },
      {
        kind: "fill",
        tag: "Discover",
        title: "Spot the rule",
        picture: {
          kind: "table",
          rows: [
            ["$(2^3)^2$", "$2^6$"],
            ["$(5^2)^4$", "$5^8$"],
            ["$(x^3)^4$", "$x^{12}$"],
          ],
        },
        template: "$(a^4)^5 =$ []",
        bank: ["$a^{20}$", "$a^9$", "$a^{1024}$", "$a^{45}$"],
        answers: ["$a^{20}$"],
        hint: "Five lots of $a^4$.",
        done: "$4 \\times 5 = 20$: a power of a power **multiplies** the powers.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Two laws that look alike",
        text: [
          "$a^m \\times a^n$ is two powers multiplied: **add**. $(a^m)^n$ is a power of a power: **multiply**.",
          "A number in the bracket gets the power too: $(2x^3)^2 = 2x^3 \\times 2x^3 = 4x^6$.",
        ],
        picture: { kind: "maths", tex: "(a^m)^n = a^{mn}" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "A number in the bracket",
        problem: "Simplify $(3y^4)^2$.",
        steps: [
          { line: "$(3y^4)^2 = 3y^4 \\times 3y^4$", why: "Squaring means two of them multiplied." },
          { line: "$3 \\times 3 = 9$", why: "Numbers with numbers." },
          {
            line: "$y^4 \\times y^4 = y^8$",
            why: "Powers with powers: or multiply, $4 \\times 2$.",
          },
        ],
        done: "$9y^8$. Everything in the bracket gets the power, the number too.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$(m^5)^3$",
        start: "$(m^5)^3$",
        stages: [
          {
            prompt: "A power of a power, so",
            options: [
              { text: "multiply the powers: $m^{15}$", correct: true, feedback: "" },
              {
                text: "add the powers: $m^8$",
                feedback: "Adding is for $m^5 \\times m^3$. This is three lots of $m^5$.",
              },
              { text: "$m^{125}$", feedback: "That's $5^3$. Three lots of $m^5$: $5 + 5 + 5$." },
            ],
            then: "$m^{15}$",
          },
        ],
        done: "Three lots of $m^5$: $m^{15}$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$(2x^3)^2$",
        start: "$(2x^3)^2$",
        stages: [
          {
            prompt: "The number first: the 2 is squared too.",
            options: [
              { text: "$2^2 = 4$", correct: true, feedback: "" },
              {
                text: "It stays 2",
                feedback: "Everything in the bracket is squared: $2x^3 \\times 2x^3$.",
              },
              {
                text: "$2 \\times 2 \\times 2 = 8$",
                feedback: "Squared, so two 2s: $2 \\times 2$.",
              },
            ],
            then: "$4$",
          },
          {
            prompt: "Now the x:",
            options: [
              { text: "$x^6$", correct: true, feedback: "" },
              { text: "$x^5$", feedback: "Two lots of $x^3$: multiply, $3 \\times 2$." },
            ],
            then: "$4x^6$",
          },
        ],
        done: "$(2x^3)^2 = 4x^6$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "$(a^6)^2$",
        template: "$(a^6)^2 =$ []",
        bank: ["$a^{12}$", "$a^8$", "$a^{36}$", "$2a^6$"],
        answers: ["$a^{12}$"],
        hint: "Multiply the powers.",
        done: "$a^{12}$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "$(5x^2)^3$",
        template: "$(5x^2)^3 =$ []",
        bank: ["$125x^6$", "$5x^6$", "$15x^6$", "$125x^5$"],
        answers: ["$125x^6$"],
        hint: "$5^3 = 125$, and $x^{2 \\times 3}$.",
        done: "$5^3 = 125$ and $(x^2)^3 = x^6$: $125x^6$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Which is the same as $(x^2)^3$?",
        options: [
          {
            text: "$x^2 \\times x^2 \\times x^2 = x^6$",
            correct: true,
            feedback: "Three lots of $x^2$.",
          },
          {
            text: "$x^2 \\times x^3 = x^5$",
            feedback:
              "That's a different thing: two powers multiplied. Mixing up the laws is the common slip.",
          },
          {
            text: "$x^8$",
            feedback: "$2^3 = 8$, but the power isn't raised: it's three lots of $x^2$.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Leo simplifies $(4y^3)^2$.",
        lines: ["$(4y^3)^2 = 4y^3 \\times 4y^3$", "$= 4 \\times y^3 \\times y^3$", "$= 4y^6$"],
        wrong: 1,
        why: "Both 4s are multiplied: $4 \\times 4 = 16$, so $(4y^3)^2 = 16y^6$. The number in the bracket gets the power too.",
      },
      {
        kind: "choice",
        tag: "Back to the problem",
        title: "Pixels in a photo",
        text: "The photo has $(2^5)^2$ pixels.",
        options: [
          {
            text: "$2^{10}$",
            correct: true,
            feedback: "$(2^5)^2 = 2^{5 \\times 2} = 2^{10} = 1024$ pixels.",
          },
          { text: "$2^7$", feedback: "That adds. A power of a power multiplies." },
          { text: "$4^{10}$", feedback: "The base stays 2." },
          { text: "$2^{25}$", feedback: "That's $5^2$. Multiply the powers: $5 \\times 2$." },
        ],
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$(x^4)^3 =$",
            options: ["$x^{12}$", "$x^7$", "$x^{64}$"],
            answers: ["$x^{12}$"],
            why: "Multiply the powers: $4 \\times 3$.",
            retry: {
              prompt: "$(y^2)^5 =$",
              options: ["$y^{10}$", "$y^7$", "$y^{32}$"],
              answers: ["$y^{10}$"],
              why: "Multiply the powers: $2 \\times 5$.",
            },
          },
          {
            prompt: "$(3a^2)^2 =$",
            options: ["$9a^4$", "$3a^4$", "$6a^4$"],
            answers: ["$9a^4$"],
            why: "$3^2 = 9$ and $a^{2 \\times 2} = a^4$.",
            retry: {
              prompt: "$(2b^5)^3 =$",
              options: ["$8b^{15}$", "$2b^{15}$", "$6b^{15}$"],
              answers: ["$8b^{15}$"],
              why: "$2^3 = 8$ and $b^{5 \\times 3} = b^{15}$.",
            },
          },
          {
            prompt: "$(2^3)^2 = 2^n$. What is n?",
            answers: ["6"],
            why: "Multiply the powers: $3 \\times 2 = 6$.",
            retry: {
              prompt: "$(5^4)^2 = 5^n$. What is n?",
              answers: ["8"],
              why: "Multiply the powers: $4 \\times 2 = 8$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-indices",
    id: "y9-indices/simplify",
    before: SIMPLIFY,
    title: "Putting the laws together",
    summary: "Simplify products and quotients: numbers with numbers, each letter by its law.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Rectangles with letters",
        text: [
          "A rectangle is $3x^2$ cm by $4x^5$ cm. Another has an area of $12x^7$ cm² and a width of $2x^3$ cm.",
          "What is the first one's area, and how long is the second? By the end of this lesson, you can find both.",
        ],
        picture: {
          kind: "shape",
          points: [
            { x: 0, y: 0 },
            { x: 8, y: 0 },
            { x: 8, y: 4 },
            { x: 0, y: 4 },
          ],
          sides: ["4x⁵ cm", "3x² cm", null, null],
          square: [0, 1, 2, 3],
        },
      },
      {
        kind: "choice",
        tag: "Warm-up",
        title: "$a^3 \\times a^4 =$",
        options: [
          { text: "$a^7$", correct: true, feedback: "Add the powers." },
          { text: "$a^{12}$", feedback: "Multiplying powers: add them." },
        ],
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $6 \\times 4 \\div 3$?",
        answers: ["8"],
        hint: "$6 \\times 4 = 24$, then divide by 3.",
        done: "$24 \\div 3 = 8$.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "$2a \\times 3a =$",
        text: "Start small. Remember $a$ is $a^1$.",
        options: [
          { text: "$6a^2$", correct: true, feedback: "$2 \\times 3 = 6$ and $a \\times a = a^2$." },
          { text: "$5a^2$", feedback: "Multiply the numbers: $2 \\times 3$." },
          { text: "$6a$", feedback: "$a \\times a$ is $a^2$, not $a$." },
        ],
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "$3x^2 \\times 4x^5 =$",
        options: [
          {
            text: "$12x^7$",
            correct: true,
            feedback: "Numbers: $3 \\times 4 = 12$. Letters: add the powers, $x^7$.",
          },
          { text: "$7x^7$", feedback: "Multiply the numbers: $3 \\times 4$." },
          { text: "$12x^{10}$", feedback: "Add the powers of x: $2 + 5$." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Sort it out",
        text: [
          "Deal with the numbers and each letter separately. Numbers: multiply or divide as normal. Letters: use the laws.",
          "Dividing: divide the numbers, but **take away** the powers.",
        ],
        picture: {
          kind: "maths",
          tex: "\\frac{12x^7}{2x^3} = \\frac{12}{2} \\times x^{7 - 3} = 6x^4",
        },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "Numbers and letters",
        problem: "Simplify $\\frac{6a^5 \\times 2a^3}{4a^2}$.",
        steps: [
          {
            line: "Numbers: $\\frac{6 \\times 2}{4} = 3$",
            why: "Work out the numbers as a normal sum.",
          },
          {
            line: "Letters: $a^{5 + 3 - 2} = a^6$",
            why: "Add the powers on top, take away the one below.",
          },
        ],
        done: "$3a^6$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$5x^3 \\times 2x^4$",
        start: "$5x^3 \\times 2x^4$",
        stages: [
          {
            prompt: "Numbers:",
            options: [
              { text: "$5 \\times 2 = 10$", correct: true, feedback: "" },
              { text: "$5 + 2 = 7$", feedback: "Multiply the numbers." },
            ],
            then: "$10$",
          },
          {
            prompt: "Letters:",
            options: [
              { text: "$x^7$", correct: true, feedback: "" },
              { text: "$x^{12}$", feedback: "Multiplying: add the powers." },
            ],
            then: "$10x^7$",
          },
        ],
        done: "$5x^3 \\times 2x^4 = 10x^7$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "$12y^8 \\div 4y^3$",
        start: "$\\frac{12y^8}{4y^3}$",
        stages: [
          {
            prompt: "Numbers:",
            options: [
              { text: "$12 \\div 4 = 3$", correct: true, feedback: "" },
              { text: "$12 - 4 = 8$", feedback: "Divide the numbers as normal." },
            ],
            then: "$3$",
          },
          {
            prompt: "Letters:",
            options: [
              { text: "$y^5$", correct: true, feedback: "" },
              { text: "$y^{2.67}$", feedback: "Take the powers away: $8 - 3$." },
              { text: "$y^{11}$", feedback: "Dividing: take the powers away." },
            ],
            then: "$3y^5$",
          },
        ],
        done: "Divide the numbers; take away the powers.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "$2p^3 \\times 7p^2$",
        template: "$2p^3 \\times 7p^2 =$ []",
        bank: ["$14p^5$", "$9p^5$", "$14p^6$", "$9p^6$"],
        answers: ["$14p^5$"],
        hint: "$2 \\times 7$, and add the powers.",
        done: "$14p^5$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "Two letters",
        template: "$3a^2b \\times 5ab^3 =$ []",
        bank: ["$15a^3b^4$", "$15a^2b^3$", "$8a^3b^4$", "$15a^3b^3$"],
        answers: ["$15a^3b^4$"],
        hint: "Each letter on its own: $a^2 \\times a$, then $b \\times b^3$.",
        done: "$15$, $a^{2 + 1} = a^3$, $b^{1 + 3} = b^4$.",
      },
      {
        kind: "fill",
        tag: "Your turn",
        title: "All together",
        template: "$\\frac{20x^6 \\times 3x}{10x^2} =$ []",
        bank: ["$6x^5$", "$6x^4$", "$13x^5$", "$6x^{3}$"],
        answers: ["$6x^5$"],
        hint: "Numbers: $\\frac{20 \\times 3}{10}$. Powers: $6 + 1 - 2$.",
        done: "$\\frac{60}{10} = 6$ and $x^{6 + 1 - 2} = x^5$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "Is $\\frac{8x^6}{2x^2} = 4x^3$?",
        options: [
          {
            text: "No: it's $4x^4$",
            correct: true,
            feedback:
              "Divide the numbers, $8 \\div 2 = 4$, but **take away** the powers: $6 - 2 = 4$.",
          },
          {
            text: "Yes: divide everything",
            feedback: "Dividing the powers is the slip. Six x's on top, two cancel: four left.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Zoe simplifies $4x^3 \\times 3x^2$.",
        lines: [
          "Numbers: $4 \\times 3 = 12$",
          "Letters: $x^3 \\times x^2 = x^6$",
          "So it's $12x^6$",
        ],
        wrong: 1,
        why: "Multiplying powers: add them, $x^{3 + 2} = x^5$. So $12x^5$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Rectangles with letters",
        start: "Area = length × width.",
        stages: [
          {
            prompt: "The first rectangle is $3x^2$ by $4x^5$. Its area is",
            options: [
              { text: "$12x^7$ cm²", correct: true, feedback: "" },
              { text: "$7x^7$ cm²", feedback: "Multiply the numbers: $3 \\times 4$." },
              { text: "$12x^{10}$ cm²", feedback: "Add the powers: $2 + 5$." },
            ],
            then: "$12x^7$ cm²",
          },
          {
            prompt: "The second has area $12x^7$ and width $2x^3$. Its length is",
            options: [
              { text: "$6x^4$ cm", correct: true, feedback: "" },
              { text: "$6x^{10}$ cm", feedback: "Dividing: take the powers away." },
              { text: "$10x^4$ cm", feedback: "Divide the numbers: $12 \\div 2$." },
            ],
            then: "$12x^7 \\div 2x^3 = 6x^4$ cm",
          },
        ],
        done: "Check: $2x^3 \\times 6x^4 = 12x^7$ ✓",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "$4a^3 \\times 5a^2 =$",
            options: ["$20a^5$", "$9a^5$", "$20a^6$"],
            answers: ["$20a^5$"],
            why: "$4 \\times 5 = 20$, $a^{3 + 2} = a^5$.",
            retry: {
              prompt: "$3m^4 \\times 6m =$",
              options: ["$18m^5$", "$9m^5$", "$18m^4$"],
              answers: ["$18m^5$"],
              why: "$3 \\times 6 = 18$, $m^{4 + 1} = m^5$.",
            },
          },
          {
            prompt: "$\\frac{15x^9}{5x^3} =$",
            options: ["$3x^6$", "$3x^3$", "$10x^6$"],
            answers: ["$3x^6$"],
            why: "$15 \\div 5 = 3$, $x^{9 - 3} = x^6$.",
            retry: {
              prompt: "$\\frac{18y^7}{6y^2} =$",
              options: ["$3y^5$", "$3y^{3.5}$", "$12y^5$"],
              answers: ["$3y^5$"],
              why: "$18 \\div 6 = 3$, $y^{7 - 2} = y^5$.",
            },
          },
          {
            prompt: "$(2x^3)^2 \\times x =$",
            options: ["$4x^7$", "$2x^7$", "$4x^6$"],
            answers: ["$4x^7$"],
            why: "$(2x^3)^2 = 4x^6$, then $\\times x$ gives $4x^7$.",
            retry: {
              prompt: "$(3a)^2 \\times a^4 =$",
              options: ["$9a^6$", "$3a^6$", "$9a^8$"],
              answers: ["$9a^6$"],
              why: "$(3a)^2 = 9a^2$, then $\\times a^4$ gives $9a^6$.",
            },
          },
        ],
      },
    ],
  },
];
