// Year 9, "Compound change and inverse proportion": interest on the interest, as one multiplier
// raised to a power; depreciation the same way down; and inverse proportion, where the product
// stays fixed.
import type { UnitLesson } from "./types.ts";

export const y9Percentages: UnitLesson = {
  unit: "y9-percentages",
  title: "Growing and shrinking",
  summary: "Watch money grow on its own interest, and spot when doubling one thing halves another.",
  screens: [
    {
      kind: "explain",
      title: "Interest on the interest",
      text: [
        "£1000 at 10% **compound** interest: each year's interest is added on, and next year earns interest too.",
        "£1000, then £1100, then £1210, then £1331. Each year is × 1.1.",
      ],
      picture: {
        kind: "bar-chart",
        bars: [
          { label: "Start", value: 1000 },
          { label: "Year 1", value: 1100 },
          { label: "Year 2", value: 1210 },
          { label: "Year 3", value: 1331 },
        ],
        max: 1500,
        step: 500,
        axis: "£",
      },
    },
    {
      kind: "steps",
      title: "£1000 at 10% for 3 years",
      start: "£1000 at 10% compound interest",
      stages: [
        {
          prompt: "Each year, multiply by",
          options: [
            { text: "$1.1$", correct: true, feedback: "" },
            { text: "$0.1$", feedback: "× 0.1 finds just the interest. Keep the money too: 110%." },
            { text: "$1.3$", feedback: "That is 30%, three years of simple interest at once." },
          ],
          then: "× 1.1 each year",
        },
        {
          prompt: "After 3 years:",
          options: [
            { text: "$1000 \\times 1.1^3 = £1331$", correct: true, feedback: "" },
            {
              text: "$1000 \\times 1.3 = £1300$",
              feedback: "That is simple interest: it misses the interest on the interest.",
            },
            {
              text: "$1000 \\times 3.3 = £3300$",
              feedback: "Multiply by 1.1 three times: $1.1^3$.",
            },
          ],
          then: "$1000 \\times 1.1^3 = £1331$",
        },
      ],
      done: "Compound growth: the starting amount × multiplier$^{\\text{years}}$.",
    },
    {
      kind: "answer",
      title: "Compound interest",
      text: "£2500 is saved at 4% compound interest. How much is there after 2 years, in pounds?",
      answers: ["2704"],
      wrong: [
        { answer: "2700", feedback: "That is simple interest. Compound: $2500 \\times 1.04^2$." },
      ],
      hint: "$2500 \\times 1.04 \\times 1.04$.",
      done: "$2500 \\times 1.04^2 = £2704$.",
    },
    {
      kind: "explain",
      title: "Depreciation",
      text: [
        "Cars lose value: they **depreciate**. A car that loses 15% a year keeps 85% each year: × 0.85, again and again.",
        "After n years, its value V is its starting value S × $0.85^n$.",
      ],
      picture: { kind: "maths", tex: "V = S \\times 0.85^{n}" },
    },
    {
      kind: "answer",
      title: "A car's value",
      text: "A £12 000 car depreciates by 15% a year. What is it worth after 2 years, in pounds?",
      answers: ["8670"],
      wrong: [
        {
          answer: "8400",
          feedback:
            "That takes 30% off at once. Each year takes 15% of a smaller value: × 0.85 twice.",
        },
      ],
      hint: "$12\\,000 \\times 0.85^2$.",
      done: "$12\\,000 \\times 0.7225 = £8670$.",
    },
    {
      kind: "choice",
      title: "Less than half",
      text: "A £10 000 car loses 20% of its value each year. After how many years is it first worth less than half?",
      options: [
        {
          text: "4 years",
          correct: true,
          feedback: "£8000, £6400, £5120, then £4096: below £5000 after 4 years.",
        },
        {
          text: "2.5 years",
          feedback: "20% of a smaller value each year: it takes longer than 2.5 years.",
        },
        { text: "3 years", feedback: "After 3 years it is £5120, still just over half." },
      ],
    },
    {
      kind: "explain",
      title: "Inverse proportion",
      text: [
        "2 people take 12 days to paint a house. 4 people take 6 days, and 8 take 3: double one, halve the other.",
        "People × days stays at 24. Its graph is a curve: $y = \\frac{k}{x}$.",
      ],
      picture: {
        kind: "graph",
        range: { xMin: 0, xMax: 12, yMin: 0, yMax: 12 },
        curves: [{ kind: "inverse", k: 24 }],
        points: [
          { x: 2, y: 12 },
          { x: 4, y: 6 },
          { x: 8, y: 3 },
        ],
      },
    },
    {
      kind: "choice",
      title: "Spot the pattern",
      picture: {
        kind: "table",
        head: ["Workers", "Hours"],
        rows: [
          ["3", "8"],
          ["4", "6"],
          ["6", "?"],
        ],
      },
      options: [
        { text: "4", correct: true, feedback: "Workers × hours is always 24: $24 \\div 6 = 4$." },
        { text: "16", feedback: "More workers finish sooner, not later." },
        { text: "5", feedback: "It is not one less each time: workers × hours stays at 24." },
      ],
    },
    {
      kind: "answer",
      title: "Painters",
      text: "5 painters take 12 days to paint a building. How many days would 4 painters take?",
      answers: ["15"],
      unit: "days",
      wrong: [
        { answer: "9.6", feedback: "Fewer painters take longer, not less time." },
        {
          answer: "13",
          feedback: "It is not one more day for one fewer painter. 5 × 12 = 60 painter-days.",
        },
      ],
      hint: "The job is $5 \\times 12 = 60$ painter-days.",
      done: "$60 \\div 4 = 15$ days.",
    },
    {
      kind: "sort",
      title: "Direct or inverse?",
      groups: ["Direct proportion", "Inverse proportion"],
      items: [
        {
          text: "Tickets bought and their cost",
          group: 0,
          why: "Twice the tickets, twice the cost.",
        },
        { text: "Speed and time for a journey", group: 1, why: "Twice as fast, half the time." },
        {
          text: "Distance driven and petrol used",
          group: 0,
          why: "Twice as far, twice the petrol.",
        },
        {
          text: "Workers and time to build a wall",
          group: 1,
          why: "Twice the workers, half the time.",
        },
        {
          text: "People sharing a pizza and slices each",
          group: 1,
          why: "Twice the people, half the slices each.",
        },
        {
          text: "Pens bought and their total weight",
          group: 0,
          why: "Twice the pens, twice the weight.",
        },
      ],
      done: "Direct: both double together. Inverse: one doubles as the other halves.",
    },
    {
      kind: "explain",
      title: "Growing and shrinking",
      text: [
        "Compound change: start × multiplier$^n$. Up 10% is × 1.1; down 15% is × 0.85.",
        "Inverse proportion: the product stays the same, and the graph is a curve.",
      ],
      picture: {
        kind: "bar-chart",
        bars: [
          { label: "Start", value: 1000 },
          { label: "Year 1", value: 1100 },
          { label: "Year 2", value: 1210 },
          { label: "Year 3", value: 1331 },
        ],
        max: 1500,
        step: 500,
        axis: "£",
      },
    },
  ],
};
