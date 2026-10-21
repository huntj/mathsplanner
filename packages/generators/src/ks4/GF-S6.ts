/**
 * @statement GF-S6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-S6: Use scatter graphs: correlation (not causation), lines of best fit, interpolation and
// extrapolation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Context {
  x: string;
  y: string;
  intro: string;
  /** Plain-English meaning of the trend, and of the opposite trend. */
  meaning: string;
  opposite: string;
  /** Questions that read y from x, and x from y. */
  askY: (x: number) => string;
  askX: (y: number) => string;
  /** A prediction far outside the data, for the extrapolation claim. */
  far: string;
}

const CONTEXTS: Record<"positive" | "negative", Context> = {
  positive: {
    x: "hours of sunshine",
    y: "ice creams sold",
    intro:
      "The scatter graph shows the hours of sunshine and the number of ice creams a kiosk sold on some days.",
    meaning: "the more sunshine, the more ice creams are sold",
    opposite: "the more sunshine, the fewer ice creams are sold",
    askY: (x) => `Estimate how many ice creams are sold on a day with ${x} hours of sunshine.`,
    askX: (y) => `Estimate the hours of sunshine on a day when ${y} ice creams are sold.`,
    far: "the ice creams sold on a day with 20 hours of sunshine",
  },
  negative: {
    x: "age of car (years)",
    y: "value (£1000s)",
    intro: "The scatter graph shows the age and value of some used cars.",
    meaning: "the older the car, the lower its value",
    opposite: "the older the car, the higher its value",
    askY: (x) => `Estimate the value, in thousands of pounds, of a car that is ${x} years old.`,
    askX: (y) => `Estimate the age of a car worth £${y} 000.`,
    far: "the value of a car that is 25 years old",
  },
};

interface Params {
  trend: "positive" | "negative";
  /** Line of best fit y = m x + c. */
  c: number;
  jitter: number[];
  /** Interpolation: the x to read, and the x whose y is given. */
  x: number;
  back: number;
}

const XS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const slope = (t: Params["trend"]) => (t === "positive" ? 3 : -3);
const line = (p: Params, x: number) => slope(p.trend) * x + p.c;

function scatter(p: Params, withLine: boolean): CartesianSpec {
  const ctx = CONTEXTS[p.trend];
  return {
    type: "cartesian",
    x: { min: 0, max: 10, step: 1, label: `\\text{${ctx.x}}` },
    y: { min: 0, max: 40, step: 4, label: `\\text{${ctx.y}}` },
    grid: true,
    points: XS.map((x, i) => ({ at: [x, line(p, x) + (p.jitter[i] ?? 0)] as [number, number] })),
    ...(withLine
      ? {
          curves: [
            {
              y: `${slope(p.trend)}*x + ${p.c}`,
              domain: [0, 10] as [number, number],
              dashed: true,
            },
          ],
        }
      : {}),
    description: withLine
      ? "A scatter graph of nine points with a dashed line of best fit."
      : "A scatter graph of nine points.",
  };
}

export default defineGenerator<Params>({
  id: "GF-S6",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["STA.CORRELATION.TYPE", "STA.SCATTER.CAUSATION", "STA.EXTRAPOLATE"],

  params(rng) {
    const trend = rng.pick(["positive", "negative"] as const);
    return {
      trend,
      c: trend === "positive" ? rng.pick([2, 4, 6]) : rng.pick([32, 34, 36]),
      jitter: XS.map(() => rng.int(-3, 3)),
      x: rng.int(2, 8),
      back: rng.int(2, 8),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const ctx = CONTEXTS[p.trend];
    const other = p.trend === "positive" ? "negative" : "positive";
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [ctx.intro, A.figure(scatter(p, false))],
          ask: "Which statement describes the graph?",
          correct: `${p.trend[0]?.toUpperCase()}${p.trend.slice(1)} correlation: ${ctx.meaning}.`,
          distractors: [
            {
              content: `${other[0]?.toUpperCase()}${other.slice(1)} correlation: ${ctx.opposite}.`,
              code: "STA.CORRELATION.TYPE",
              feedback:
                p.trend === "positive"
                  ? "Both go up together: that is positive correlation."
                  : "As one goes up the other goes down: that is negative correlation.",
            },
            {
              content: "No correlation, because the points are not on a straight line.",
              code: "STA.CORRELATION.TYPE",
              feedback: "The points need not lie on a line; look at the overall trend.",
            },
            {
              content: `Positive correlation, so one causes the other.`,
              code: "STA.SCATTER.CAUSATION",
              feedback: "Correlation does not show that one causes the other.",
            },
          ].filter((d) => !(p.trend === "positive" && d.code === "STA.SCATTER.CAUSATION")),
          solution: [
            {
              say: `The points slope ${p.trend === "positive" ? "upwards" : "downwards"} from left to right.`,
            },
          ],
        });
      case 2: {
        const y = line(p, p.back);
        return A.reverse({
          question: [ctx.intro, " A line of best fit has been drawn.", A.figure(scatter(p, true))],
          ask: `Use the line of best fit. ${ctx.askX(y)}`,
          answer: A.number(p.back, { accuracy: { tolerance: 0.5 } }),
          solution: [{ say: `Go across from ${y} to the line, then down: about ${p.back}.` }],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            ctx.intro,
            " A line of best fit has been drawn.",
            A.figure(scatter(p, true)),
            `Sam extends the line to predict ${ctx.far}, and says the prediction will be reliable.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. That is far outside the data, so the trend may not continue: this is extrapolation.`,
              correct: true,
            },
            {
              text: "True. A line of best fit can be extended as far as you like.",
              code: "STA.EXTRAPOLATE",
            },
            {
              text: "True. The correlation is strong, so any prediction is reliable.",
              code: "STA.EXTRAPOLATE",
            },
          ],
          solution: [
            {
              say: "Predictions inside the range of the data (interpolation) are more reliable than outside it.",
            },
          ],
        });
      default: {
        const y = line(p, p.x);
        const yb = line(p, p.back);
        return A.multiStepContext({
          context: [ctx.intro, " A line of best fit has been drawn.", A.figure(scatter(p, true))],
          parts: [
            { ask: ctx.askY(p.x), answer: A.number(y, { accuracy: { tolerance: 2 } }) },
            { ask: ctx.askX(yb), answer: A.number(p.back, { accuracy: { tolerance: 0.5 } }) },
          ],
          solution: [
            { say: `Up from ${p.x} to the line, then across: about ${y}.` },
            { say: `Across from ${yb} to the line, then down: about ${p.back}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).toLowerCase().startsWith(p.trend);
    if (question.key.depth === 2) return numberAnswer(question) === p.back;
    if (question.key.depth === 5) return numberAnswer(question) === line(p, p.x);
    return true;
  },
});
