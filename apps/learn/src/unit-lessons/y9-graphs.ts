// Year 9, "Graphs and sequences": reading estimates from a straight-line graph, solving
// quadratic equations where a curve meets a line, and the special sequences: geometric,
// triangular and square numbers, and Fibonacci.
import type { UnitLesson } from "./types.ts";

const parabola = { kind: "quadratic" as const, a: 1, b: -2, c: -3 };

export const y9Graphs: UnitLesson = {
  unit: "y9-graphs",
  title: "Curves and sequences",
  summary: "Read answers off curves, then meet the most famous sequences.",
  screens: [
    {
      kind: "choice",
      title: "Read the conversion graph",
      text: "This graph changes miles into kilometres. About how many kilometres is 3 miles?",
      picture: {
        kind: "graph",
        range: { xMin: 0, xMax: 5, yMin: 0, yMax: 8 },
        lines: [{ m: 1.6, c: 0 }],
        points: [{ x: 5, y: 8 }],
      },
      options: [
        {
          text: "About 4.8 km",
          correct: true,
          feedback: "Up from 3 miles to the line, then across: just under 5 km. (1 mile ≈ 1.6 km.)",
        },
        {
          text: "About 3 km",
          feedback: "Kilometres are shorter than miles, so there are more of them.",
        },
        { text: "About 8 km", feedback: "8 km is 5 miles. Read up from 3." },
      ],
    },
    {
      kind: "explain",
      title: "A quadratic graph",
      text: [
        "The graph of $y = x^2 - 2x - 3$ is a U-shaped curve, a **parabola**.",
        "Where it crosses the x-axis, $y = 0$: those x values solve $x^2 - 2x - 3 = 0$.",
      ],
      picture: {
        kind: "graph",
        range: { xMin: -3, xMax: 5, yMin: -5, yMax: 6 },
        curves: [parabola],
      },
    },
    {
      kind: "plot",
      title: "Solve $x^2 - 2x - 3 = 0$",
      text: "Tap where the curve crosses the x-axis.",
      scene: { range: { xMin: -3, xMax: 5, yMin: -5, yMax: 6 }, curves: [parabola] },
      targets: [
        { x: -1, y: 0 },
        { x: 3, y: 0 },
      ],
      hint: "Find where the curve meets the x-axis, where y = 0.",
      done: "$x = -1$ and $x = 3$. Check: $3^2 - 2 \\times 3 - 3 = 0$ ✓",
    },
    {
      kind: "plot",
      title: "Solve $x^2 - 2x - 3 = 5$",
      text: "Now the curve must reach 5. Tap where it meets the line $y = 5$.",
      scene: {
        range: { xMin: -3, xMax: 5, yMin: -5, yMax: 6 },
        curves: [parabola],
        lines: [{ m: 0, c: 5 }],
      },
      targets: [
        { x: -2, y: 5 },
        { x: 4, y: 5 },
      ],
      hint: "Look along the line y = 5 for where the curve crosses it.",
      done: "$x = -2$ and $x = 4$. Check: $16 - 8 - 3 = 5$ ✓",
    },
    {
      kind: "choice",
      title: "Not a whole number",
      text: "Estimate the positive solution of $x^2 - 3 = 0$ from the graph of $y = x^2 - 3$.",
      picture: {
        kind: "graph",
        range: { xMin: -3, xMax: 3, yMin: -4, yMax: 6 },
        curves: [{ kind: "quadratic", a: 1, b: 0, c: -3 }],
      },
      options: [
        {
          text: "About 1.7",
          correct: true,
          feedback:
            "It crosses between 1 and 2, a bit closer to 2. Exactly, it is $\\sqrt3 = 1.73\\ldots$",
        },
        {
          text: "About 3",
          feedback: "$3^2 - 3 = 6$, not 0. Look where the curve crosses the axis.",
        },
        { text: "About 1.2", feedback: "Look again: it crosses closer to 2 than to 1." },
      ],
    },
    {
      kind: "explain",
      title: "Geometric sequences",
      text: [
        "In a **geometric** sequence, each term is multiplied by the same number, the **common ratio**.",
        "3, 6, 12, 24, … has a common ratio of 2.",
      ],
      picture: { kind: "stacks", counts: [3, 6, 12, 24] },
    },
    {
      kind: "fill",
      title: "Continue it",
      template: "2, 6, 18, [], [] … multiplying by []",
      bank: ["$36$", "$54$", "$108$", "$162$", "$3$", "$4$"],
      answers: ["$54$", "$162$", "$3$"],
      hint: "How do you get from 2 to 6, and from 6 to 18?",
      done: "× 3 each time: 2, 6, 18, 54, 162.",
    },
    {
      kind: "answer",
      title: "Find the common ratio",
      text: "80, 40, 20, 10, …",
      answers: ["0.5", "1/2"],
      wrong: [
        { answer: "2", feedback: "It is getting smaller: multiply by less than 1." },
        { answer: "-40", feedback: "That is a difference. In a geometric sequence you multiply." },
      ],
      hint: "What do you multiply 80 by to get 40?",
      done: "× ½ each time: each term halves.",
    },
    {
      kind: "explain",
      title: "Triangles and squares",
      text: [
        "**Triangular numbers** make triangles of dots: 1, 3, 6, 10, … each adds one more row.",
        "**Square numbers** make squares: 1, 4, 9, 16, …",
      ],
      picture: { kind: "dots", shape: "triangle", terms: 4 },
    },
    {
      kind: "fill",
      title: "The next ones",
      picture: { kind: "dots", shape: "square", terms: 4 },
      template: "Triangular: 1, 3, 6, 10, []. Square: 1, 4, 9, 16, []",
      bank: ["$13$", "$14$", "$15$", "$20$", "$25$"],
      answers: ["$15$", "$25$"],
      hint: "The next triangle adds a row of 5. The next square is 5 by 5.",
      done: "$10 + 5 = 15$ and $5^2 = 25$.",
    },
    {
      kind: "choice",
      title: "1, 1, 2, 3, 5, 8, … what comes next?",
      options: [
        {
          text: "13",
          correct: true,
          feedback:
            "Each term is the two before added together: $5 + 8 = 13$. This is the **Fibonacci** sequence.",
        },
        { text: "11", feedback: "Look at how each term is made from the two before it." },
        { text: "16", feedback: "It doesn't double: add the two terms before." },
      ],
    },
    {
      kind: "sort",
      title: "What kind of sequence?",
      groups: ["Arithmetic", "Geometric", "Fibonacci-type"],
      items: [
        { text: "4, 7, 10, 13", group: 0, why: "Add 3 each time: arithmetic." },
        { text: "5, 10, 20, 40", group: 1, why: "Double each time: geometric." },
        { text: "2, 2, 4, 6, 10", group: 2, why: "Each term adds the two before." },
        { text: "100, 90, 80, 70", group: 0, why: "Take 10 each time: arithmetic." },
        { text: "81, 27, 9, 3", group: 1, why: "Divide by 3 each time: × ⅓, geometric." },
        { text: "1, 3, 4, 7, 11", group: 2, why: "1 + 3 = 4, 3 + 4 = 7, 4 + 7 = 11." },
      ],
      done: "Add the same, multiply by the same, or add the two before.",
    },
    {
      kind: "explain",
      title: "Curves and sequences",
      text: [
        "Read estimates off a graph; quadratic equations are solved where the curve meets the x-axis, or another line.",
        "Geometric: multiply by the same number. Triangular and square numbers come from dot patterns. Fibonacci: add the two before.",
      ],
      picture: {
        kind: "graph",
        range: { xMin: -3, xMax: 5, yMin: -5, yMax: 6 },
        curves: [parabola],
        points: [
          { x: -1, y: 0 },
          { x: 3, y: 0 },
        ],
      },
    },
  ],
};
