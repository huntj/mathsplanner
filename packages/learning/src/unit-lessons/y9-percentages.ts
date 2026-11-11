// Year 9, "Compound change and inverse proportion", as three short lessons, one just before each
// skill: compound interest (interest on the interest, one multiplier raised to a power),
// depreciation (the same, going down), and inverse proportion (double one, halve the other). Each
// starts from something quick, builds the method a step at a time, names the common mistakes, and
// ends on an exit check.
import type { UnitLesson } from "./types.ts";

const INTEREST = "Y9-RAT-03.a";
const DEPRECIATION = "Y9-RAT-03.b";
const INVERSE = "Y9-RAT-01";

const growth = {
  kind: "bar-chart" as const,
  bars: [
    { label: "Start", value: 1000 },
    { label: "Year 1", value: 1100 },
    { label: "Year 2", value: 1210 },
    { label: "Year 3", value: 1331 },
  ],
  max: 1500,
  step: 500,
  axis: "£",
};

export const y9Percentages: UnitLesson[] = [
  {
    unit: "y9-percentages",
    id: "y9-percentages/compound-interest",
    before: INTEREST,
    title: "Interest on the interest",
    summary: "Compound interest: multiply by the same multiplier, once for each year.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Gran's savings",
        text: [
          "Gran puts £1000 in a savings account paying 10% compound interest a year. She says that after 3 years she'll have £1300.",
          "Is she right? By the end of this lesson, you can check.",
        ],
        picture: {
          kind: "maths",
          tex: "£1000 \\xrightarrow{\\;10\\% \\text{ a year, 3 years}\\;} \\; ?",
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is 10% of £200?",
        answers: ["20"],
        hint: "Divide by 10.",
        done: "£20.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Increase £200 by 10%",
        answers: ["220"],
        wrong: [{ answer: "20", feedback: "That's just the increase. Add it on." }],
        hint: "Add 10% on: $200 + 20$.",
        done: "£220.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "To increase by 10% in one step, multiply by",
        options: [
          {
            text: "$1.1$",
            correct: true,
            feedback: "100% + 10% = 110% = 1.1. $200 \\times 1.1 = 220$ ✓",
          },
          { text: "$0.1$", feedback: "× 0.1 finds only the 10%. Keep the 100% too: 110%." },
          { text: "$10$", feedback: "That makes it 10 times as big!" },
        ],
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "Year two",
        text: "£1000 at 10% compound interest is £1100 after 1 year. Year two earns 10% of £1100. How much is there after 2 years, in pounds?",
        answers: ["1210"],
        wrong: [
          { answer: "1200", feedback: "Year two's interest is 10% of £1100, not of £1000: £110." },
        ],
        hint: "$1100 \\times 1.1$.",
        done: "£1210: the interest earned interest too. That's **compound** interest.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "The same multiplier, again and again",
        text: [
          "Each year is × 1.1: £1000, £1100, £1210, £1331. The extra each year grows.",
          "After n years: the start × multiplier$^n$. Here, $1000 \\times 1.1^3$.",
        ],
        picture: growth,
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "£500 at 3% for 2 years",
        problem: "£500 is saved at 3% compound interest. How much is there after 2 years?",
        steps: [
          { line: "Multiplier: $100\\% + 3\\% = 103\\% = 1.03$", why: "Keep the money, plus 3%." },
          { line: "$500 \\times 1.03^2$", why: "Once for each year." },
          { line: "$500 \\times 1.0609 = £530.45$", why: "A calculator does the power." },
        ],
        done: "£530.45. Simple interest would give £530: compound is a little more.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "£1000 at 10% for 3 years",
        start: "£1000 at 10% compound interest",
        stages: [
          {
            prompt: "Each year, multiply by",
            options: [
              { text: "$1.1$", correct: true, feedback: "" },
              {
                text: "$0.1$",
                feedback: "× 0.1 finds just the interest. Keep the money too: 110%.",
              },
              { text: "$1.3$", feedback: "That's 30%, three years of simple interest at once." },
            ],
            then: "× 1.1 each year",
          },
          {
            prompt: "After 3 years:",
            options: [
              { text: "$1000 \\times 1.1^3 = £1331$", correct: true, feedback: "" },
              {
                text: "$1000 \\times 1.3 = £1300$",
                feedback: "That's simple interest: it misses the interest on the interest.",
              },
              {
                text: "$1000 \\times 3.3 = £3300$",
                feedback: "Multiply by 1.1 three times: $1.1^3$.",
              },
            ],
            then: "$1000 \\times 1.1^3 = £1331$",
          },
        ],
        done: "Start × multiplier$^{\\text{years}}$.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "£800 at 5% for 2 years",
        start: "£800 at 5% compound interest",
        stages: [
          {
            prompt: "The multiplier:",
            options: [
              { text: "$1.05$", correct: true, feedback: "" },
              { text: "$1.5$", feedback: "That's 50%. 5% is 0.05, so 1.05." },
            ],
            then: "× 1.05",
          },
          {
            prompt: "After 2 years:",
            options: [
              { text: "$800 \\times 1.05^2 = £882$", correct: true, feedback: "" },
              {
                text: "$800 \\times 1.1 = £880$",
                feedback: "That's simple interest, 10% at once.",
              },
            ],
            then: "£882",
          },
        ],
        done: "Multiplier, power, multiply.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "£2500 at 4% for 2 years",
        text: "How much is there after 2 years, in pounds?",
        answers: ["2704"],
        wrong: [
          { answer: "2700", feedback: "That's simple interest. Compound: $2500 \\times 1.04^2$." },
        ],
        hint: "$2500 \\times 1.04 \\times 1.04$.",
        done: "$2500 \\times 1.04^2 = £2704$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "£400 at 2% for 3 years",
        text: "How much is there after 3 years, in pounds, to the nearest penny?",
        answers: ["424.48"],
        wrong: [{ answer: "424", feedback: "That's simple interest: 6% at once. Use $1.02^3$." }],
        hint: "$400 \\times 1.02^3$.",
        done: "$400 \\times 1.061208 = £424.48$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "For 4% interest, Ali multiplies by 1.4. Is he right?",
        options: [
          {
            text: "No: 4% is 0.04, so the multiplier is 1.04",
            correct: true,
            feedback:
              "× 1.4 is a 40% increase. Getting the multiplier wrong is the most common slip.",
          },
          { text: "Yes", feedback: "1.4 is 140%: a 40% increase." },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Zara works out £600 at 5% compound interest for 3 years.",
        lines: ["5% of £600 is £30", "3 years: $3 \\times £30 = £90$", "So £690"],
        wrong: 1,
        why: "That's simple interest. Each year earns 5% of a bigger amount: $600 \\times 1.05^3 = £694.58$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Gran's savings",
        picture: growth,
        start: "£1000 at 10% compound interest, for 3 years.",
        stages: [
          {
            prompt: "After 3 years she has",
            options: [
              { text: "$1000 \\times 1.1^3 = £1331$", correct: true, feedback: "" },
              { text: "$1000 \\times 1.3 = £1300$", feedback: "That's simple interest." },
            ],
            then: "£1331",
          },
          {
            prompt: "So Gran",
            options: [
              { text: "has £31 more than she thought", correct: true, feedback: "" },
              {
                text: "is right",
                feedback: "£1300 would be simple interest. Compound gives more.",
              },
            ],
            then: "£31 more.",
          },
        ],
        done: "The extra £31 is interest earned on interest.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The multiplier for a 6% increase is",
            options: ["1.06", "1.6", "0.06"],
            answers: ["1.06"],
            why: "106% = 1.06.",
            retry: {
              prompt: "The multiplier for a 3% increase is",
              options: ["1.03", "1.3", "0.03"],
              answers: ["1.03"],
              why: "103% = 1.03.",
            },
          },
          {
            prompt: "£1000 at 10% compound interest for 2 years. How much is there, in pounds?",
            answers: ["1210"],
            why: "$1000 \\times 1.1^2 = 1210$.",
            retry: {
              prompt: "£2000 at 10% compound interest for 2 years. How much is there, in pounds?",
              answers: ["2420"],
              why: "$2000 \\times 1.1^2 = 2420$.",
            },
          },
          {
            prompt: "£500 at 2% compound interest for 2 years. How much is there, in pounds?",
            answers: ["520.2", "520.20"],
            why: "$500 \\times 1.02^2 = 520.20$.",
            retry: {
              prompt: "£300 at 5% compound interest for 2 years. How much is there, in pounds?",
              answers: ["330.75"],
              why: "$300 \\times 1.05^2 = 330.75$.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-percentages",
    id: "y9-percentages/depreciation",
    before: DEPRECIATION,
    title: "Losing value",
    summary: "Depreciation: multiply by what's left, once for each year.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "A car's value",
        text: [
          "A new car costs £12 000 and loses 15% of its value every year. Dad says that after 2 years it's worth £8400.",
          "Is he right? By the end of this lesson, you can check.",
        ],
        picture: {
          kind: "maths",
          tex: "£12\\,000 \\xrightarrow{\\;-15\\% \\text{ a year, 2 years}\\;} \\; ?",
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is 15% of £100?",
        answers: ["15"],
        hint: "Per cent means out of 100.",
        done: "£15.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "Decrease £200 by 10%",
        answers: ["180"],
        wrong: [{ answer: "20", feedback: "That's how much it goes down by. Take it off." }],
        hint: "$200 - 20$.",
        done: "£180.",
      },
      {
        kind: "choice",
        tag: "Discover",
        title: "Losing 15% leaves",
        options: [
          { text: "85%: multiply by 0.85", correct: true, feedback: "$100\\% - 15\\% = 85\\%$." },
          { text: "15%: multiply by 0.15", feedback: "15% is what's lost. What's left is 85%." },
          { text: "115%: multiply by 1.15", feedback: "That's an increase." },
        ],
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "Two years of losses",
        text: "A £1000 phone loses 20% a year. After 1 year it's worth £800. What is it worth after 2 years, in pounds?",
        answers: ["640"],
        wrong: [{ answer: "600", feedback: "Year two loses 20% of £800, not of £1000: £160." }],
        hint: "$800 \\times 0.8$.",
        done: "£640. Each year loses less, because it's 20% of a smaller value.",
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Depreciation",
        text: [
          "Things that lose value **depreciate**. Losing 15% a year keeps 85% each year: × 0.85, again and again.",
          "After n years, the value is the start × $0.85^n$.",
        ],
        picture: { kind: "maths", tex: "V = S \\times 0.85^{n}" },
      },
      {
        kind: "worked",
        tag: "Worked example",
        title: "£20 000, losing 10% a year",
        problem: "A £20 000 van loses 10% of its value a year. What is it worth after 3 years?",
        steps: [
          { line: "Multiplier: $100\\% - 10\\% = 90\\% = 0.9$", why: "What's left each year." },
          { line: "$20\\,000 \\times 0.9^3$", why: "Once for each year." },
          { line: "$20\\,000 \\times 0.729 = £14\\,580$", why: "A calculator does the power." },
        ],
        done: "£14 580. Taking 30% off at once would wrongly give £14 000.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "£8000, losing 25% a year",
        start: "What is it worth after 2 years?",
        stages: [
          {
            prompt: "The multiplier:",
            options: [
              { text: "$0.75$", correct: true, feedback: "" },
              { text: "$0.25$", feedback: "That's what's lost. 75% is left." },
            ],
            then: "× 0.75",
          },
          {
            prompt: "After 2 years:",
            options: [
              { text: "$8000 \\times 0.75^2 = £4500$", correct: true, feedback: "" },
              {
                text: "$8000 \\times 0.5 = £4000$",
                feedback: "That takes 50% at once. Each year's 25% is of a smaller value.",
              },
            ],
            then: "£4500",
          },
        ],
        done: "What's left, to the power of the years.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Below half",
        text: "A £10 000 car loses 20% of its value each year. After how many years is it first worth less than £5000?",
        start: "× 0.8 each year.",
        stages: [
          {
            prompt: "After 1 year: £8000. After 2 years:",
            options: [
              { text: "£6400", correct: true, feedback: "" },
              { text: "£6000", feedback: "20% of £8000 is £1600." },
            ],
            then: "£6400",
          },
          {
            prompt: "After 3 years:",
            options: [
              { text: "£5120: still just over half", correct: true, feedback: "" },
              { text: "£4000", feedback: "$6400 \\times 0.8 = 5120$." },
            ],
            then: "£5120",
          },
          {
            prompt: "After 4 years:",
            options: [
              { text: "£4096: below half", correct: true, feedback: "" },
              { text: "£4120", feedback: "$5120 \\times 0.8 = 4096$." },
            ],
            then: "£4096: 4 years",
          },
        ],
        done: "Not 2.5 years: each year takes 20% of a smaller value, so it slows down.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "£5000, losing 10% a year",
        text: "What is it worth after 2 years, in pounds?",
        answers: ["4050"],
        wrong: [{ answer: "4000", feedback: "That takes 20% at once. Use $0.9^2$." }],
        hint: "$5000 \\times 0.9^2$.",
        done: "$5000 \\times 0.81 = £4050$.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "A £1500 laptop, losing 30% a year",
        text: "What is it worth after 3 years, in pounds?",
        answers: ["514.5", "514.50"],
        wrong: [{ answer: "150", feedback: "That takes 90% at once. Use $0.7^3$." }],
        hint: "$1500 \\times 0.7^3$.",
        done: "$1500 \\times 0.343 = £514.50$.",
      },
      {
        kind: "choice",
        tag: "Watch out",
        title: "For 15% depreciation, Jo multiplies by 0.15. Is she right?",
        options: [
          {
            text: "No: 0.15 finds what's lost; what's left is × 0.85",
            correct: true,
            feedback: "Multiply by what's left. Confusing the two is the common slip.",
          },
          {
            text: "Yes",
            feedback: "$12\\,000 \\times 0.15 = 1800$: that's the amount lost, not the value left.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "Raj works out a £20 000 car's value after it loses 10% a year for 2 years.",
        lines: ["Two years of 10%: 20% off", "80% of £20 000 is £16 000", "So it's worth £16 000"],
        wrong: 0,
        why: "The second year takes 10% of a smaller value. $20\\,000 \\times 0.9^2 = £16\\,200$.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "A car's value",
        start: "£12 000, losing 15% a year, for 2 years.",
        stages: [
          {
            prompt: "Its value after 2 years:",
            options: [
              { text: "$12\\,000 \\times 0.85^2 = £8670$", correct: true, feedback: "" },
              { text: "$12\\,000 \\times 0.7 = £8400$", feedback: "That takes 30% off at once." },
            ],
            then: "£8670",
          },
          {
            prompt: "So Dad",
            options: [
              { text: "is £270 too low", correct: true, feedback: "" },
              { text: "is right", feedback: "He took 30% off at once." },
            ],
            then: "£270 too low",
          },
        ],
        done: "Each year's loss is a percentage of what's left.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "The multiplier for a 20% decrease is",
            options: ["0.8", "0.2", "1.2"],
            answers: ["0.8"],
            why: "80% is left.",
            retry: {
              prompt: "The multiplier for a 5% decrease is",
              options: ["0.95", "0.05", "1.05"],
              answers: ["0.95"],
              why: "95% is left.",
            },
          },
          {
            prompt: "£1000 loses 10% a year. What is it worth after 2 years, in pounds?",
            answers: ["810"],
            why: "$1000 \\times 0.9^2 = 810$.",
            retry: {
              prompt: "£2000 loses 20% a year. What is it worth after 2 years, in pounds?",
              answers: ["1280"],
              why: "$2000 \\times 0.8^2 = 1280$.",
            },
          },
          {
            prompt:
              "£400 loses half its value each year. What is it worth after 3 years, in pounds?",
            answers: ["50"],
            why: "200, 100, 50.",
            retry: {
              prompt:
                "£800 loses half its value each year. What is it worth after 2 years, in pounds?",
              answers: ["200"],
              why: "400, 200.",
            },
          },
        ],
      },
    ],
  },
  {
    unit: "y9-percentages",
    id: "y9-percentages/inverse-proportion",
    before: INVERSE,
    title: "More hands, less time",
    summary:
      "Inverse proportion: double one and the other halves, so their product stays the same.",
    screens: [
      {
        kind: "explain",
        tag: "The problem",
        title: "Beat the deadline",
        text: [
          "5 painters take 12 days to paint a school. It needs to be done in 10 days.",
          "How many painters are needed? By the end of this lesson, you can work it out.",
        ],
        picture: {
          kind: "maths",
          tex: "\\begin{aligned} 5 \\text{ painters} &\\to 12 \\text{ days} \\\\ ? \\text{ painters} &\\to 10 \\text{ days} \\end{aligned}",
        },
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "What is $4 \\times 6$?",
        answers: ["24"],
        hint: "Four sixes.",
        done: "24.",
      },
      {
        kind: "answer",
        tag: "Warm-up",
        title: "3 pens cost £6. How much do 6 pens cost, in pounds?",
        answers: ["12"],
        hint: "Twice the pens, twice the cost.",
        done: "£12. That's **direct** proportion: both double together.",
      },
      {
        kind: "answer",
        tag: "Discover",
        title: "Twice the people",
        text: "2 people take 12 days to paint a house. How long would 4 people take?",
        answers: ["6"],
        unit: "days",
        wrong: [{ answer: "24", feedback: "More people finish sooner, not later." }],
        hint: "Twice as many people share the work.",
        done: "6 days: double the people, half the time.",
      },
      {
        kind: "choice",
        tag: "Discover",
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
          { text: "5", feedback: "It isn't one less each time: workers × hours stays at 24." },
        ],
      },
      {
        kind: "explain",
        tag: "Discover",
        title: "Inverse proportion",
        text: [
          "When one doubles and the other halves, they're in **inverse proportion**. Their product stays the same: here, 24 worker-hours.",
          "Its graph is a curve, $y = \\frac{k}{x}$, never a straight line.",
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
        kind: "worked",
        tag: "Worked example",
        title: "Find the total first",
        problem: "4 workers take 9 hours to build a wall. How long would 6 workers take?",
        steps: [
          {
            line: "$4 \\times 9 = 36$ worker-hours",
            why: "The size of the job: it doesn't change.",
          },
          { line: "$36 \\div 6 = 6$ hours", why: "Share the job between 6 workers." },
        ],
        done: "6 hours. More workers, less time ✓",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "Filling a pool",
        start: "3 taps fill a pool in 20 minutes. How long would 5 taps take?",
        stages: [
          {
            prompt: "The size of the job:",
            options: [
              { text: "$3 \\times 20 = 60$ tap-minutes", correct: true, feedback: "" },
              { text: "$20 \\div 3$", feedback: "Multiply: 3 taps for 20 minutes each." },
            ],
            then: "60 tap-minutes",
          },
          {
            prompt: "With 5 taps:",
            options: [
              { text: "$60 \\div 5 = 12$ minutes", correct: true, feedback: "" },
              {
                text: "$20 \\times \\frac53 = 33$ minutes",
                feedback: "More taps fill it faster, not slower.",
              },
            ],
            then: "12 minutes",
          },
        ],
        done: "Total, then share.",
      },
      {
        kind: "steps",
        tag: "Together",
        title: "A slower journey",
        start: "At 60 km/h, a journey takes 2 hours. How long does it take at 40 km/h?",
        stages: [
          {
            prompt: "The distance:",
            options: [
              { text: "$60 \\times 2 = 120$ km", correct: true, feedback: "" },
              { text: "$60 \\div 2 = 30$ km", feedback: "Speed × time gives the distance." },
            ],
            then: "120 km",
          },
          {
            prompt: "At 40 km/h:",
            options: [
              { text: "$120 \\div 40 = 3$ hours", correct: true, feedback: "" },
              {
                text: "$\\frac{40}{60} \\times 2 = 1.3$ hours",
                feedback: "Slower takes longer, not less time.",
              },
            ],
            then: "3 hours",
          },
        ],
        done: "Speed and time are in inverse proportion: slower, longer.",
      },
      {
        kind: "answer",
        tag: "Your turn",
        title: "Painters",
        text: "5 painters take 12 days to paint a building. How many days would 4 painters take?",
        answers: ["15"],
        unit: "days",
        wrong: [
          { answer: "9.6", feedback: "Fewer painters take longer, not less time." },
          {
            answer: "13",
            feedback:
              "It isn't one more day for one fewer painter. $5 \\times 12 = 60$ painter-days.",
          },
        ],
        hint: "The job is $5 \\times 12 = 60$ painter-days.",
        done: "$60 \\div 4 = 15$ days.",
      },
      {
        kind: "sort",
        tag: "Your turn",
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
        kind: "choice",
        tag: "Watch out",
        title:
          "6 people take 4 hours to pick some apples. Sam says 12 people would take 8 hours. Is he right?",
        options: [
          {
            text: "No: twice the people take half the time, 2 hours",
            correct: true,
            feedback: "Doubling both is direct proportion. More people means **less** time.",
          },
          {
            text: "Yes: double the people, double the time",
            feedback: "More people share the work, so it takes less time.",
          },
        ],
      },
      {
        kind: "mistake",
        tag: "Spot the mistake",
        title: "Where did it go wrong?",
        text: "8 workers take 6 days to build a shed. Ivo works out how long 4 workers take.",
        lines: ["4 workers is half as many", "So they take half the time", "3 days"],
        wrong: 1,
        why: "Half the workers take **twice** as long: $8 \\times 6 = 48$ worker-days, and $48 \\div 4 = 12$ days.",
      },
      {
        kind: "steps",
        tag: "Back to the problem",
        title: "Beat the deadline",
        start: "5 painters take 12 days. It must take 10 days.",
        stages: [
          {
            prompt: "The size of the job:",
            options: [
              { text: "$5 \\times 12 = 60$ painter-days", correct: true, feedback: "" },
              { text: "$12 \\div 5 = 2.4$", feedback: "Multiply: 5 painters for 12 days each." },
            ],
            then: "60 painter-days",
          },
          {
            prompt: "To finish in 10 days:",
            options: [
              { text: "$60 \\div 10 = 6$ painters", correct: true, feedback: "" },
              {
                text: "$5 \\times \\frac{10}{12} = 4.2$ painters",
                feedback: "Less time needs more painters, not fewer.",
              },
            ],
            then: "6 painters",
          },
        ],
        done: "One more painter, and the job is done 2 days sooner.",
      },
      {
        kind: "quiz",
        tag: "Exit check",
        title: "Check you've got it",
        questions: [
          {
            prompt: "4 people take 6 hours. How many hours would 8 people take?",
            answers: ["3"],
            why: "24 person-hours ÷ 8.",
            retry: {
              prompt: "3 people take 10 hours. How many hours would 6 people take?",
              answers: ["5"],
              why: "30 person-hours ÷ 6.",
            },
          },
          {
            prompt: "6 machines take 8 hours. How many hours would 4 machines take?",
            answers: ["12"],
            why: "48 machine-hours ÷ 4.",
            retry: {
              prompt: "2 pumps empty a tank in 15 minutes. How many minutes would 3 pumps take?",
              answers: ["10"],
              why: "30 pump-minutes ÷ 3.",
            },
          },
          {
            prompt: "Which is inverse proportion?",
            options: [
              "Speed and journey time",
              "Distance and petrol used",
              "Tickets and their cost",
            ],
            answers: ["Speed and journey time"],
            why: "Faster means less time.",
            retry: {
              prompt: "Which of these is inverse proportion?",
              options: [
                "Workers and time to finish",
                "Hours worked and pay",
                "Apples and their weight",
              ],
              answers: ["Workers and time to finish"],
              why: "More workers means less time.",
            },
          },
        ],
      },
    ],
  },
];
