/**
 * @statement GF-S4.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-S4.b: Estimate the mean and find the modal class from grouped data
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { groupedTable } from "../shared/sta.ts";

const LOWS = [0, 10, 20, 30];

interface Params {
  f: number[];
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const n = (f: number[]) => f.reduce((s, x) => s + x, 0);
const sumAt = (f: number[], offset: number) =>
  f.reduce((s, x, i) => s + x * ((LOWS[i] ?? 0) + offset), 0);

export default defineGenerator<Params>({
  id: "GF-S4.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.GROUPED.MIDPOINT"],

  params(rng) {
    return { f: LOWS.map(() => rng.int(2, 15)) };
  },

  build(p, depth, rng): QuestionDraft {
    const table = A.math(groupedTable("t", "\\text{time } t \\text{ (minutes)}", LOWS, 10, p.f));
    switch (depth) {
      case 1: {
        const v = r1(sumAt(p.f, 5) / n(p.f));
        return A.standard({
          question: ["The table shows how long some people spent at a museum shop.", table],
          ask: "Work out an estimate for the mean time, to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "STA.GROUPED.MIDPOINT",
              value: A.number(r1(sumAt(p.f, 10) / n(p.f)), { accuracy: { dp: 1 } }),
              feedback: "Use the midpoint of each class (5, 15, 25, 35), not the top of it.",
            },
          ]),
          solution: [{ say: "", math: `\\frac{${sumAt(p.f, 5)}}{${n(p.f)}} = ${v}` }],
        });
      }
      case 2: {
        const v = sumAt(p.f, 5);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The table shows how long some people spent at a museum shop.", table],
              ask: "Estimate the total time, in minutes, that all these people spent.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.GROUPED.MIDPOINT",
              value: A.number(sumAt(p.f, 0)),
              feedback: "Multiply each frequency by its class midpoint, not its lower end.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.f.map((x, i) => `${x} \\times ${(LOWS[i] ?? 0) + 5}`).join(" + ")} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ken says the mean worked out from a grouped frequency table is exact."],
          truth: false,
          reasons: [
            {
              text: "False. It is an estimate: each value is assumed to be at the midpoint of its class, which is not exactly true.",
              correct: true,
            },
            { text: "True. Every frequency is used.", code: "STA.GROUPED.MIDPOINT" },
            { text: "True. The midpoints are the real values.", code: "STA.GROUPED.MIDPOINT" },
          ],
          solution: [{ say: "Grouping loses the exact values." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(sumAt(p.f, 5) / n(p.f));
    if (question.key.depth === 2) return numberAnswer(question) === sumAt(p.f, 5);
    return true;
  },
});
