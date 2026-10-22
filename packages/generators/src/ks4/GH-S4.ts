/**
 * @statement GH-S4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-S4: Use box plots, quartiles and interquartile range
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ChartSpec } from "@mathsplanner/diagrams";
import { numberAnswer } from "../shared/counting.ts";

type Five = [number, number, number, number, number];

interface Params {
  /** Eleven sorted values, so the quartiles are the 3rd and 9th. */
  data: number[];
  /** Two classes' five-number summaries, in tens of marks. */
  a: Five;
  b: Five;
}

const five = (d: number[]): Five => [d[0] ?? 0, d[2] ?? 0, d[5] ?? 0, d[8] ?? 0, d[10] ?? 0];

function plots(p: Params): ChartSpec {
  return {
    type: "chart",
    kind: "box",
    plots: [
      { name: "\\text{Class A}", values: p.a },
      { name: "\\text{Class B}", values: p.b },
    ],
    axis: { min: 20, max: 100, step: 10, label: "\\text{test score}" },
    description: "Box plots of test scores for class A and class B on the same scale.",
  };
}

function summary(rng: { int: (a: number, b: number) => number }): Five {
  const lo = 2 * rng.int(11, 20);
  const q1 = lo + 2 * rng.int(2, 6);
  const med = q1 + 2 * rng.int(2, 6);
  const q3 = med + 2 * rng.int(2, 6);
  const hi = Math.min(100, q3 + 2 * rng.int(2, 8));
  return [lo, q1, med, q3, hi];
}

export default defineGenerator<Params>({
  id: "GH-S4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.IQR.RANGE", "STA.RANGE.HIGHER-BETTER"],

  params(rng) {
    const data = Array.from({ length: 11 }, () => rng.int(10, 60)).sort((x, y) => x - y);
    const a = summary(rng);
    const b = summary(rng);
    const iqr = (f: Five) => f[3] - f[1];
    const [q1, q3] = [data[2] ?? 0, data[8] ?? 0];
    if (q3 - q1 === (data[10] ?? 0) - (data[0] ?? 0) || q1 === q3)
      reject("an IQR that differs from the range");
    if (a[2] === b[2] || iqr(a) === iqr(b) || a[4] > 100 || b[4] > 100)
      reject("box plots with clear differences");
    return { data, a, b };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [lo, q1, , q3, hi] = five(p.data);
        return A.standard({
          question: `Here are 11 values in order: ${p.data.join(", ")}.`,
          ask: "Work out the interquartile range.",
          answer: A.number(q3 - q1),
          wrong: [
            {
              code: "STA.IQR.RANGE",
              value: A.number(hi - lo),
              feedback:
                "That is the range. The IQR is the upper quartile minus the lower quartile.",
            },
          ],
          solution: [
            {
              say: `With 11 values the lower quartile is the 3rd (${q1}) and the upper quartile is the 9th (${q3}).`,
            },
            { say: `IQR = ${q3} − ${q1} = ${q3 - q1}.` },
          ],
        });
      }
      case 2: {
        const iqrA = p.a[3] - p.a[1];
        const iqrB = p.b[3] - p.b[1];
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The box plots show test scores for two classes.", A.figure(plots(p))],
              ask: "Work out the interquartile range for class A.",
            },
          ],
          answer: A.number(iqrA),
          wrong: [
            {
              code: "STA.IQR.RANGE",
              value: A.number(p.a[4] - p.a[0]),
              feedback:
                "That is the range, from whisker to whisker. The IQR is the width of the box.",
            },
            ...(iqrB !== iqrA && iqrB !== p.a[4] - p.a[0]
              ? [
                  {
                    code: "STA.IQR.RANGE",
                    value: A.number(iqrB),
                    feedback: "That is class B's box. Read class A's.",
                  },
                ]
              : []),
          ],
          solution: [{ say: `Class A's box runs from ${p.a[1]} to ${p.a[3]}: IQR = ${iqrA}.` }],
        });
      }
      default: {
        const steadier = p.a[3] - p.a[1] < p.b[3] - p.b[1] ? "A" : "B";
        const wider = steadier === "A" ? "B" : "A";
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The box plots show test scores for two classes.",
            A.figure(plots(p)),
            `Sam says class ${wider}'s scores were more consistent, because its box is wider.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. A wider box means a larger interquartile range: the middle half of class ${wider}'s scores is more spread out. Class ${steadier} was more consistent.`,
              correct: true,
            },
            {
              text: "True. A bigger IQR means the scores are more consistent.",
              code: "STA.RANGE.HIGHER-BETTER",
            },
            {
              text: "True. Consistency depends on the median, not the box.",
              code: "STA.IQR.RANGE",
            },
          ],
          solution: [
            {
              say: `IQRs: A ${p.a[3] - p.a[1]}, B ${p.b[3] - p.b[1]}. The smaller IQR shows more consistent scores.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) {
      const f = five(p.data);
      return numberAnswer(question) === f[3] - f[1];
    }
    if (question.key.depth === 2) return numberAnswer(question) === p.a[3] - p.a[1];
    return true;
  },
});
