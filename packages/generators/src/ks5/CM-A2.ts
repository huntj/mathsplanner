/**
 * @statement CM-A2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-A2: Interpret and construct time series tables and line graphs; calculate and use moving averages
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";
import { tableLatex } from "../shared/sta.ts";

export interface Params {
  sales: number[];
}

const QUARTERS = ["2024 Q1", "Q2", "Q3", "Q4", "2025 Q1"];
const avg = (xs: number[]) => round(xs.reduce((s, x) => s + x, 0) / xs.length, 2);

export default defineGenerator<Params>({
  id: "CM-A2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.MOVING-AVERAGE"],

  params(rng) {
    // Seasonal pattern: low, high, highest, low, with a gentle trend.
    const base = rng.int(20, 60);
    const season = [0, rng.int(8, 15), rng.int(16, 25), rng.int(2, 6)];
    return { sales: [0, 1, 2, 3, 4].map((i) => base + (season[i % 4] ?? 0) + i * rng.int(0, 2)) };
  },

  build(p, depth, rng): QuestionDraft {
    const table = A.math(tableLatex(["Quarter", ...QUARTERS], [["Sales (£1000s)", ...p.sales]]));
    switch (depth) {
      case 1: {
        const v = avg(p.sales.slice(0, 4));
        return A.standard({
          question: ["The table shows a shop's sales each quarter.", table],
          ask: "Calculate the first 4-point moving average.",
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "STA.MOVING-AVERAGE",
              value: A.number(avg(p.sales.slice(0, 3)), { accuracy: { dp: 2 } }),
              feedback:
                "A 4-point moving average uses four consecutive values: one full year of quarters.",
            },
          ]),
          solution: [{ say: "", math: `\\frac{${p.sales.slice(0, 4).join(" + ")}}{4} = ${v}` }],
        });
      }
      case 2: {
        const v = avg(p.sales.slice(1, 5));
        const first = avg(p.sales.slice(0, 4));
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The table shows a shop's sales each quarter.", table],
              ask: "Calculate the second 4-point moving average.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "STA.MOVING-AVERAGE",
              value: A.number(round((first + (p.sales[4] ?? 0)) / 2, 2), { accuracy: { dp: 2 } }),
              feedback: "Move the window along one place: average Q2, Q3, Q4 and the next Q1.",
            },
          ]),
          solution: [{ say: "", math: `\\frac{${p.sales.slice(1, 5).join(" + ")}}{4} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eva says she will plot the 4-point moving averages because they show the seasonal pattern in the sales more clearly.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Each 4-point average covers a whole year, so the seasonal ups and downs cancel out. Moving averages show the underlying trend.",
              correct: true,
            },
            {
              text: "True. Averages exaggerate the differences between seasons.",
              code: "STA.MOVING-AVERAGE",
            },
            {
              text: "True. Moving averages repeat the original values.",
              code: "STA.MOVING-AVERAGE",
            },
          ],
          solution: [
            {
              say: "Use the original values to see the seasons, and the moving averages to see the trend.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === avg(p.sales.slice(0, 4));
    if (question.key.depth === 2) return numberAnswer(question) === avg(p.sales.slice(1, 5));
    return true;
  },
});
