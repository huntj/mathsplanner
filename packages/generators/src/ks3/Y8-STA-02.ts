/**
 * @statement Y8-STA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-STA-02: Describe simple mathematical relationships between two variables (bivariate data) in
// observational and experimental contexts and illustrate using scatter graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { chosenText, numberAnswer } from "../shared/counting.ts";

type Trend = "positive" | "negative" | "none";

interface Params {
  trend: Trend;
  /** Jitter for each of ten points. */
  jitter: number[];
  /** Line of best fit y = m x + c for the estimate. */
  x: number;
}

const XS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const SLOPE: Record<Trend, number> = { positive: 1.6, negative: -1.6, none: 0 };

function scatter(p: Params, withLine: boolean): CartesianSpec {
  const m = SLOPE[p.trend];
  const c = m < 0 ? 18 : 2;
  const pts = XS.map(
    (x, i) =>
      [
        x,
        Math.round(
          m * x + c + (p.trend === "none" ? (p.jitter[i] ?? 0) * 3 + 6 : (p.jitter[i] ?? 0)),
        ),
      ] as [number, number],
  );
  return {
    type: "cartesian",
    x: { min: 0, max: 11, step: 1, label: "\\text{hours revised}" },
    y: { min: 0, max: 20, step: 2, label: "\\text{score}" },
    grid: true,
    points: pts.map((at) => ({ at })),
    ...(withLine
      ? { curves: [{ y: `${m}*x + ${c}`, domain: [0, 11] as [number, number], dashed: true }] }
      : {}),
    description: withLine
      ? "A scatter graph with a dashed line of best fit."
      : "A scatter graph of ten points.",
  };
}

export default defineGenerator<Params>({
  id: "Y8-STA-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SCATTER.CAUSATION"],

  params(rng) {
    return {
      trend: rng.pick(["positive", "negative", "none"] as const),
      jitter: XS.map(() => rng.int(-2, 2)),
      x: rng.int(2, 9),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = "The scatter graph shows how long some pupils revised and their test scores.";
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [intro, A.figure(scatter(p, false))],
          ask: "What type of correlation does it show?",
          correct: p.trend === "none" ? "no correlation" : `${p.trend} correlation`,
          distractors: (["positive", "negative", "none"] as const)
            .filter((t) => t !== p.trend)
            .map((t) => ({
              content: t === "none" ? "no correlation" : `${t} correlation`,
              feedback:
                "Look at the overall pattern: do the points go up, go down, or show no pattern from left to right?",
            })),
          solution: [
            {
              say:
                p.trend === "positive"
                  ? "As one goes up, so does the other: positive correlation."
                  : p.trend === "negative"
                    ? "As one goes up, the other goes down: negative correlation."
                    : "The points show no clear pattern: no correlation.",
            },
          ],
        });
      case 2: {
        const trend: Trend = p.trend === "none" ? "positive" : p.trend;
        const q = { ...p, trend };
        const m = SLOPE[trend];
        const c = m < 0 ? 18 : 2;
        const est = Number((m * p.x + c).toFixed(1));
        return A.standard({
          question: [intro, " A line of best fit has been drawn.", A.figure(scatter(q, true))],
          ask: `Use the line of best fit to estimate the score of a pupil who revised for ${p.x} hours.`,
          answer: A.number(est, { accuracy: { tolerance: 1 } }),
          solution: [{ say: `Go up from ${p.x} hours to the line, then across: about ${est}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "A survey finds positive correlation between ice-cream sales and sunburn cases. Lily says eating ice cream causes sunburn.",
          truth: false,
          reasons: [
            {
              text: "False. Correlation does not show cause. Both go up in hot, sunny weather.",
              correct: true,
            },
            {
              text: "True. Positive correlation means one causes the other.",
              code: "STA.SCATTER.CAUSATION",
            },
            { text: "True. The more ice cream, the more sunburn, so it must be the cause." },
          ],
          solution: [{ say: "A third factor, sunny weather, explains both." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "choice")
      return chosenText(question).startsWith(p.trend === "none" ? "no" : p.trend);
    if (question.archetype === "standard") {
      const trend: Trend = p.trend === "none" ? "positive" : p.trend;
      const m = SLOPE[trend];
      return Math.abs(numberAnswer(question) - (m * p.x + (m < 0 ? 18 : 2))) < 0.051;
    }
    return true;
  },
});
