// Year 9, "Standard form and indices": the laws of indices spotted by writing powers out in full
// (add to multiply, take away to divide, multiply for a power of a power, and why a power of 0
// is 1), then calculating with standard form.
import type { UnitLesson } from "./types.ts";

export const y9Indices: UnitLesson = {
  unit: "y9-indices",
  title: "Power laws",
  summary: "Write powers out in full to discover the laws, then use them on huge numbers.",
  screens: [
    {
      kind: "explain",
      title: "Write it out",
      text: [
        "$2^3 \\times 2^4$ is $(2 \\times 2 \\times 2) \\times (2 \\times 2 \\times 2 \\times 2)$: seven 2s multiplied together.",
        "So $2^3 \\times 2^4 = 2^7$.",
      ],
      picture: { kind: "maths", tex: "2^3 \\times 2^4 = 2^{3 + 4} = 2^7" },
    },
    {
      kind: "choice",
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
        { text: "$7^9$", correct: true, feedback: "Same base: add the powers. $3 + 6 = 9$." },
        {
          text: "$7^{18}$",
          feedback: "That multiplies the powers. Count the 7s: three, then six more.",
        },
        { text: "$49^9$", feedback: "The base stays 7: they are all 7s multiplied together." },
      ],
    },
    {
      kind: "steps",
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
      done: "To divide, take the powers away: $2^6 \\div 2^2 = 2^{6 - 2} = 2^4$.",
    },
    {
      kind: "fill",
      title: "Use the laws",
      template: "$a^5 \\times a^3 =$ [] and $a^9 \\div a^4 =$ []",
      bank: ["$a^8$", "$a^{15}$", "$a^5$", "$a^{13}$", "$a^2$"],
      answers: ["$a^8$", "$a^5$"],
      hint: "Multiplying: add the powers. Dividing: take them away.",
      done: "$a^{5 + 3} = a^8$ and $a^{9 - 4} = a^5$.",
    },
    {
      kind: "choice",
      title: "A power of a power: $(x^3)^4$",
      options: [
        {
          text: "$x^{12}$",
          correct: true,
          feedback:
            "It is four lots of $x^3$ multiplied: $x^{3 + 3 + 3 + 3} = x^{12}$. Multiply the powers.",
        },
        { text: "$x^7$", feedback: "That adds them. The bracket means $x^3$ four times over." },
        {
          text: "$x^{81}$",
          feedback: "That is $3^4$. Write out $x^3 \\times x^3 \\times x^3 \\times x^3$.",
        },
      ],
    },
    {
      kind: "choice",
      title: "What is $5^0$?",
      text: "Follow the pattern down.",
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
            "Each step down divides by 5, and $5 \\div 5 = 1$. Any number (except 0) to the power 0 is 1.",
        },
        { text: "$0$", feedback: "Each step down divides by 5. What is $5 \\div 5$?" },
        { text: "$5$", feedback: "$5^1$ is 5. One step further divides by 5 again." },
      ],
    },
    {
      kind: "fill",
      title: "Simplify",
      template: "$\\frac{x^7 \\times x^2}{x^4} =$ []",
      bank: ["$x^5$", "$x^{10}$", "$x^{14}$", "$x^3$"],
      answers: ["$x^5$"],
      hint: "Top first: $x^7 \\times x^2 = x^9$. Then divide by $x^4$.",
      done: "$x^{7 + 2 - 4} = x^5$.",
    },
    {
      kind: "steps",
      title: "Numbers and letters",
      start: "$\\frac{6a^5 \\times 2a^3}{4a^2}$",
      stages: [
        {
          prompt: "Numbers first: $\\frac{6 \\times 2}{4} =$",
          options: [
            { text: "$3$", correct: true, feedback: "" },
            { text: "$8$", feedback: "$6 \\times 2 = 12$, and $12 \\div 4 = 3$." },
            { text: "$4$", feedback: "$6 \\times 2 = 12$, then divide by 4." },
          ],
          then: "$= 3 \\times \\frac{a^5 \\times a^3}{a^2}$",
        },
        {
          prompt: "Now the powers of a:",
          options: [
            { text: "$a^6$", correct: true, feedback: "" },
            {
              text: "$a^{10}$",
              feedback: "Add for the top, then take away for the bottom: $5 + 3 - 2$.",
            },
            { text: "$a^{13}$", feedback: "Take away the power on the bottom." },
          ],
          then: "$= 3a^6$",
        },
      ],
      done: "Numbers with numbers, powers with powers: $3a^6$.",
    },
    {
      kind: "explain",
      title: "Standard form uses the same laws",
      text: [
        "To multiply numbers in standard form, multiply the numbers and add the powers of 10.",
        "$(3 \\times 10^4) \\times (2 \\times 10^5) = 6 \\times 10^9$.",
      ],
      picture: { kind: "maths", tex: "10^4 \\times 10^5 = 10^9" },
    },
    {
      kind: "steps",
      title: "Multiply in standard form",
      start: "$(4 \\times 10^3) \\times (5 \\times 10^6)$",
      stages: [
        {
          prompt: "Multiply the numbers, and add the powers:",
          options: [
            { text: "$20 \\times 10^9$", correct: true, feedback: "" },
            { text: "$20 \\times 10^{18}$", feedback: "Add the powers: $3 + 6$." },
            { text: "$9 \\times 10^9$", feedback: "Multiply the numbers: $4 \\times 5$." },
          ],
          then: "$= 20 \\times 10^9$",
        },
        {
          prompt: "20 is not between 1 and 10. In standard form, that is",
          options: [
            { text: "$2 \\times 10^{10}$", correct: true, feedback: "" },
            {
              text: "$2 \\times 10^9$",
              feedback: "$20 = 2 \\times 10$, so the power goes up by one.",
            },
            { text: "$20 \\times 10^9$", feedback: "The first number must be from 1 up to 10." },
          ],
          then: "$= 2 \\times 10^{10}$",
        },
      ],
      done: "Multiply, add the powers, then tidy into standard form.",
    },
    {
      kind: "choice",
      title: "Divide: $(9 \\times 10^8) \\div (3 \\times 10^2)$",
      options: [
        {
          text: "$3 \\times 10^6$",
          correct: true,
          feedback: "$9 \\div 3 = 3$, and $10^{8 - 2} = 10^6$.",
        },
        { text: "$3 \\times 10^4$", feedback: "That divides the powers. Take them away: $8 - 2$." },
        { text: "$6 \\times 10^6$", feedback: "Divide the numbers: $9 \\div 3$." },
      ],
    },
    {
      kind: "steps",
      title: "Adding is different",
      start: "$(3 \\times 10^4) + (5 \\times 10^3)$",
      stages: [
        {
          prompt:
            "The powers are different, so you can't just add 3 and 5. Write them as ordinary numbers:",
          options: [
            { text: "$30\\,000 + 5000$", correct: true, feedback: "" },
            {
              text: "$8 \\times 10^7$",
              feedback: "Adding never adds the powers. Line up the place values.",
            },
            {
              text: "$8 \\times 10^4$",
              feedback: "The 5 is in the thousands, not the ten-thousands.",
            },
          ],
          then: "$= 35\\,000$",
        },
        {
          prompt: "In standard form:",
          options: [
            { text: "$3.5 \\times 10^4$", correct: true, feedback: "" },
            { text: "$35 \\times 10^3$", feedback: "35 is more than 10." },
          ],
          then: "$= 3.5 \\times 10^4$",
        },
      ],
      done: "To add or subtract, line up the place values first.",
    },
    {
      kind: "explain",
      title: "Power laws",
      text: [
        "Multiply: add the powers. Divide: take them away. A power of a power: multiply them. Anything to the power 0 is 1.",
        "Standard form: multiply or divide the numbers and use the laws on the powers; to add, line up the place values.",
      ],
      picture: { kind: "maths", tex: "a^m \\times a^n = a^{m+n} \\quad (a^m)^n = a^{mn}" },
    },
  ],
};
