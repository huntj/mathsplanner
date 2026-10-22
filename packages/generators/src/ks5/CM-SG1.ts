/**
 * @statement CM-SG1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-SG1: Set up and solve growth and decay problems, including compound interest
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  P: number;
  r: number;
  n: number;
  V: number;
  d: number;
  m: number;
}

const grow = (p: Params) => round(p.P * (1 + p.r / 100) ** p.n, 2);
const decay = (p: Params) => round(p.V * (1 - p.d / 100) ** p.m, 2);

export default defineGenerator<Params>({
  id: "CM-SG1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND.SIMPLE", "RAT.PERCENT.MULTIPLIER", "RAT.PERCENT.CHANGE-BASE"],

  params(rng) {
    return {
      P: 100 * rng.int(5, 80),
      r: rng.pick([1.5, 2, 2.5, 3, 3.5, 4, 5]),
      n: rng.int(3, 10),
      V: 1000 * rng.int(8, 30),
      d: rng.pick([10, 12, 15, 18, 20, 25]),
      m: rng.int(2, 6),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = grow(p);
        return A.standard({
          question: [`£${p.P} is invested at ${p.r}% compound interest per year.`],
          ask: `Find its value after ${p.n} years, to the nearest penny.`,
          answer: A.number(v, { units: "£", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(round(p.P * (1 + (p.r * p.n) / 100), 2), {
                units: "£",
                accuracy: { dp: 2 },
              }),
              feedback:
                "Compound interest is earned on the interest too: multiply by the multiplier each year.",
            },
          ]),
          solution: [
            { say: "", math: `${p.P} \\times ${round(1 + p.r / 100, 4)}^{${p.n}} = ${v}` },
          ],
        });
      }
      case 2: {
        const v = decay(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A van bought for £${p.V} loses ${p.d}% of its value each year.`],
              ask: `Find its value after ${p.m} years, to the nearest penny.`,
            },
          ],
          answer: A.number(v, { units: "£", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(round(p.V * (p.d / 100) ** p.m, 2), {
                units: "£",
                accuracy: { dp: 2 },
              }),
              feedback: `Losing ${p.d}% leaves ${100 - p.d}%: the multiplier is ${round(1 - p.d / 100, 2)}, not ${p.d / 100}.`,
            },
          ]),
          solution: [
            { say: "", math: `${p.V} \\times ${round(1 - p.d / 100, 2)}^{${p.m}} = ${v}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Eli says a price that rises by ${p.d}% and then falls by ${p.d}% returns to where it started.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The fall is ${p.d}% of a bigger amount. Overall the multiplier is ${round(1 + p.d / 100, 2)} × ${round(1 - p.d / 100, 2)} = ${round((1 + p.d / 100) * (1 - p.d / 100), 4)}, which is less than 1.`,
              correct: true,
            },
            { text: "True. The changes cancel out.", code: "RAT.PERCENT.CHANGE-BASE" },
            { text: "True. Equal percentages are equal amounts.", code: "RAT.PERCENT.CHANGE-BASE" },
          ],
          solution: [{ say: "Percentage changes multiply; they do not add." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === grow(p);
    if (question.key.depth === 2) return numberAnswer(question) === decay(p);
    return true;
  },
});
