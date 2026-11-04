// Year 9, "Pythagoras and trigonometry": the squares on a right-angled triangle's sides, then
// spotting that the ratio of two sides stays fixed for an angle, which gives sin, cos and tan,
// for missing sides and, with the inverse, missing angles.
import type { DrawingPic, ShapePic, UnitLesson } from "./types.ts";

const squares: DrawingPic = {
  kind: "drawing",
  items: [
    {
      line: [
        { x: 0, y: 0 },
        { x: 4, y: 0 },
      ],
      tone: "find",
    },
    {
      line: [
        { x: 4, y: 0 },
        { x: 0, y: 3 },
      ],
      tone: "find",
    },
    {
      line: [
        { x: 0, y: 3 },
        { x: 0, y: 0 },
      ],
      tone: "find",
    },
    {
      line: [
        { x: 0, y: 0 },
        { x: 0, y: -4 },
      ],
    },
    {
      line: [
        { x: 0, y: -4 },
        { x: 4, y: -4 },
      ],
    },
    {
      line: [
        { x: 4, y: -4 },
        { x: 4, y: 0 },
      ],
    },
    {
      line: [
        { x: 0, y: 0 },
        { x: -3, y: 0 },
      ],
    },
    {
      line: [
        { x: -3, y: 0 },
        { x: -3, y: 3 },
      ],
    },
    {
      line: [
        { x: -3, y: 3 },
        { x: 0, y: 3 },
      ],
    },
    {
      line: [
        { x: 4, y: 0 },
        { x: 7, y: 4 },
      ],
    },
    {
      line: [
        { x: 7, y: 4 },
        { x: 3, y: 7 },
      ],
    },
    {
      line: [
        { x: 3, y: 7 },
        { x: 0, y: 3 },
      ],
    },
    { text: "16", at: { x: 2, y: -2 } },
    { text: "9", at: { x: -1.5, y: 1.5 } },
    { text: "25", at: { x: 3.5, y: 3.5 } },
  ],
};

/** A right-angled triangle with the angle θ at the left and the right angle at the bottom right. */
const right = (w: number, h: number, sides: (string | null)[], angle: string): ShapePic => ({
  kind: "shape",
  points: [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w, y: h },
  ],
  sides,
  angles: [angle, null, null],
  square: [1],
});

export const y9Trigonometry: UnitLesson = {
  unit: "y9-trigonometry",
  title: "Right-angled triangles",
  summary: "See Pythagoras in the squares, then find sides and angles with sin, cos and tan.",
  screens: [
    {
      kind: "explain",
      title: "Squares on the sides",
      text: [
        "Draw a square on each side of a right-angled triangle. The two small squares together make the big one: $9 + 16 = 25$.",
        "That is **Pythagoras' theorem**: $a^2 + b^2 = c^2$, where c is the longest side, the **hypotenuse**.",
      ],
      picture: squares,
    },
    {
      kind: "choice",
      title: "Spot the missing side",
      text: "Each row is the three sides of a right-angled triangle.",
      picture: {
        kind: "table",
        head: ["a", "b", "c", "$a^2 + b^2 = c^2$"],
        rows: [
          ["3", "4", "5", "$9 + 16 = 25$"],
          ["5", "12", "13", "$25 + 144 = 169$"],
          ["6", "8", "?", "$36 + 64 = ?$"],
        ],
      },
      options: [
        { text: "10", correct: true, feedback: "$36 + 64 = 100$, and $\\sqrt{100} = 10$." },
        { text: "14", feedback: "That adds the sides. Add the squares: $36 + 64$." },
        { text: "100", feedback: "100 is $c^2$. Take the square root." },
      ],
    },
    {
      kind: "answer",
      title: "Find the hypotenuse",
      picture: right(5, 3.75, ["12 cm", "9 cm", "?"], ""),
      text: "The two shorter sides are 9 cm and 12 cm.",
      answers: ["15"],
      unit: "cm",
      wrong: [
        { answer: "225", feedback: "225 is $c^2$. Take the square root." },
        { answer: "21", feedback: "Add the squares, not the sides." },
      ],
      hint: "$9^2 + 12^2 = 81 + 144$.",
      done: "$\\sqrt{225} = 15$ cm.",
    },
    {
      kind: "answer",
      title: "Find a shorter side",
      text: "The hypotenuse is 10 cm and one side is 6 cm.",
      answers: ["8"],
      unit: "cm",
      wrong: [
        { answer: "11.7", feedback: "For a shorter side, subtract the squares: $100 - 36$." },
      ],
      hint: "$10^2 - 6^2 = 100 - 36$.",
      done: "$\\sqrt{64} = 8$ cm.",
    },
    {
      kind: "answer",
      title: "Not a whole number",
      text: "The two shorter sides are 4 cm and 7 cm. Find the hypotenuse, to 1 decimal place.",
      answers: ["8.1"],
      unit: "cm",
      hint: "$4^2 + 7^2 = 65$, then the square root.",
      done: "$\\sqrt{65} = 8.06\\ldots \\approx 8.1$ cm.",
    },
    {
      kind: "explain",
      title: "Naming the sides from an angle",
      text: [
        "From the angle θ: the **opposite** side is across from it, the **adjacent** side is next to it, and the **hypotenuse** is the longest, across from the right angle.",
      ],
      picture: right(6, 4, ["adjacent", "opposite", "hypotenuse"], "θ"),
    },
    {
      kind: "choice",
      title: "Spot the pattern",
      text: "Three right-angled triangles, all with a 30° angle.",
      picture: {
        kind: "table",
        head: ["Hypotenuse", "Opposite", "Opposite ÷ hypotenuse"],
        rows: [
          ["2", "1", "0.5"],
          ["6", "3", "0.5"],
          ["10", "?", "0.5"],
        ],
      },
      options: [
        {
          text: "5",
          correct: true,
          feedback:
            "For a 30° angle, opposite ÷ hypotenuse is always 0.5, however big the triangle: that is $\\sin 30°$.",
        },
        { text: "7", feedback: "The ratio stays 0.5: half of 10." },
        {
          text: "20",
          feedback: "Opposite ÷ hypotenuse is 0.5: the opposite is half the hypotenuse.",
        },
      ],
    },
    {
      kind: "explain",
      title: "Sin, cos and tan",
      text: [
        "Each angle has three fixed ratios. A calculator knows them all.",
        "SOH CAH TOA: **S**in = **O**pposite ÷ **H**ypotenuse, **C**os = **A**djacent ÷ **H**ypotenuse, **T**an = **O**pposite ÷ **A**djacent.",
      ],
      picture: {
        kind: "maths",
        tex: "\\begin{aligned} \\sin\\theta &= \\frac{O}{H} \\\\ \\cos\\theta &= \\frac{A}{H} \\\\ \\tan\\theta &= \\frac{O}{A} \\end{aligned}",
      },
    },
    {
      kind: "steps",
      title: "Find a missing side",
      picture: right(8, 5.6, [null, "x", "10 cm"], "35°"),
      start: "Find x.",
      stages: [
        {
          prompt: "From the 35° angle, x is the opposite and 10 cm is the hypotenuse. Which ratio?",
          options: [
            { text: "Sin: opposite and hypotenuse", correct: true, feedback: "" },
            {
              text: "Cos: adjacent and hypotenuse",
              feedback: "x is across from the angle: the opposite.",
            },
            {
              text: "Tan: opposite and adjacent",
              feedback: "We know the hypotenuse, not the adjacent.",
            },
          ],
          then: "$\\sin 35° = \\frac{x}{10}$",
        },
        {
          prompt: "So",
          options: [
            { text: "$x = 10 \\sin 35° = 5.7$ cm", correct: true, feedback: "" },
            { text: "$x = \\frac{\\sin 35°}{10}$", feedback: "Multiply both sides by 10." },
            { text: "$x = \\frac{10}{\\sin 35°}$", feedback: "x is on top: multiply by 10." },
          ],
          then: "$x = 10 \\times 0.574 = 5.7$ cm",
        },
      ],
      done: "Label the sides, pick the ratio, then rearrange.",
    },
    {
      kind: "answer",
      title: "Use cos",
      text: "The hypotenuse is 8 cm and the angle is 50°. Find the adjacent side x, to 1 decimal place.",
      picture: right(5.1, 6.1, ["x", null, "8 cm"], "50°"),
      answers: ["5.1"],
      unit: "cm",
      wrong: [
        { answer: "6.1", feedback: "That uses sin. x is next to the angle: adjacent, so cos." },
      ],
      hint: "$\\cos 50° = \\frac{x}{8}$, so $x = 8 \\cos 50°$.",
      done: "$8 \\times 0.643 = 5.1$ cm.",
    },
    {
      kind: "answer",
      title: "Use tan",
      text: "The adjacent side is 6 cm and the angle is 40°. Find the opposite side x, to 1 decimal place.",
      picture: right(6, 5, ["6 cm", "x", null], "40°"),
      answers: ["5.0"],
      unit: "cm",
      wrong: [{ answer: "3.9", feedback: "That uses sin. With opposite and adjacent, use tan." }],
      hint: "$\\tan 40° = \\frac{x}{6}$.",
      done: "$x = 6 \\tan 40° = 6 \\times 0.839 = 5.0$ cm.",
    },
    {
      kind: "steps",
      title: "Find a missing angle",
      picture: right(7, 4, ["7 cm", "4 cm", null], "θ"),
      start: "Find θ.",
      stages: [
        {
          prompt: "We know the opposite (4) and the adjacent (7). Which ratio?",
          options: [
            { text: "Tan", correct: true, feedback: "" },
            { text: "Sin", feedback: "Sin needs the hypotenuse." },
            { text: "Cos", feedback: "Cos needs the hypotenuse." },
          ],
          then: "$\\tan\\theta = \\frac{4}{7}$",
        },
        {
          prompt: "To get from a ratio back to an angle, use the inverse:",
          options: [
            {
              text: "$\\theta = \\tan^{-1}\\left(\\frac{4}{7}\\right) = 29.7°$",
              correct: true,
              feedback: "",
            },
            {
              text: "$\\theta = \\tan\\left(\\frac{4}{7}\\right)$",
              feedback: "That gives a ratio, not an angle. Use $\\tan^{-1}$.",
            },
            {
              text: "$\\theta = \\frac{4}{7} \\times 90°$",
              feedback: "Angles and ratios aren't in proportion. Use $\\tan^{-1}$.",
            },
          ],
          then: "$\\theta = 29.7°$",
        },
      ],
      done: "The inverse, $\\tan^{-1}$, turns a ratio back into an angle.",
    },
    {
      kind: "answer",
      title: "Use the inverse of cos",
      text: "The adjacent side is 5 cm and the hypotenuse is 9 cm. Find the angle θ between them, to 1 decimal place.",
      answers: ["56.3"],
      unit: "°",
      wrong: [{ answer: "33.7", feedback: "That uses sin. Adjacent and hypotenuse: cos." }],
      hint: "$\\cos\\theta = \\frac{5}{9}$, so $\\theta = \\cos^{-1}\\left(\\frac59\\right)$.",
      done: "$\\cos^{-1}(0.556) = 56.3°$.",
    },
    {
      kind: "explain",
      title: "Right-angled triangles",
      text: [
        "Pythagoras: $a^2 + b^2 = c^2$, to find a side from the other two.",
        "Trigonometry: label the sides from the angle, choose sin, cos or tan, then rearrange, or use the inverse for an angle.",
      ],
      picture: right(6, 4, ["A", "O", "H"], "θ"),
    },
  ],
};
