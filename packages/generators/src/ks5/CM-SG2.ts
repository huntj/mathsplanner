/**
 * @statement CM-SG2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-SG2: Calculate simple and compound interest and compare them graphically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

export interface Params {
  P: number;
  r: number;
  n: number;
}

const simple = (p: Params) => round(p.P * (1 + (p.r * p.n) / 100), 2);
const compound = (p: Params) => round(p.P * (1 + p.r / 100) ** p.n, 2);

export default defineGenerator<Params>({
  id: "CM-SG2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND.SIMPLE", "ALG.GRAPH.SHAPE"],

  params(rng) {
    return { P: 500 * rng.int(2, 20), r: rng.pick([2, 3, 4, 5, 6]), n: rng.int(3, 10) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = simple(p);
        return A.standard({
          question: [`£${p.P} is invested at ${p.r}% simple interest per year.`],
          ask: `What is it worth after ${p.n} years?`,
          answer: A.number(v, { units: "£", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(round((p.P * p.r * p.n) / 100, 2), {
                units: "£",
                accuracy: { dp: 2 },
              }),
              feedback: "That is the interest only. Add it to the original amount.",
            },
          ]),
          solution: [
            { say: "", math: `${p.P} + ${p.n} \\times \\frac{${p.r}}{100} \\times ${p.P} = ${v}` },
          ],
        });
      }
      case 2: {
        const v = round(compound(p) - simple(p), 2);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`£${p.P} is invested for ${p.n} years at ${p.r}% per year.`],
              ask: "How much more is it worth with compound interest than with simple interest, to the nearest penny?",
            },
          ],
          answer: A.number(v, { units: "£", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(round(compound(p) - p.P, 2), { units: "£", accuracy: { dp: 2 } }),
              feedback: "Subtract the simple interest total, not the original amount.",
            },
          ]),
          solution: [
            { say: `Compound: £${compound(p)}. Simple: £${simple(p)}. Difference: £${v}.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Flo says graphs of the value of a compound interest investment and a simple interest investment against time are both straight lines.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Simple interest adds the same amount each year (a straight line). Compound interest multiplies each year, giving an exponential curve that gets steeper.",
              correct: true,
            },
            { text: "True. Both grow by a fixed percentage.", code: "ALG.GRAPH.SHAPE" },
            { text: "True. All interest grows in a straight line.", code: "ALG.GRAPH.SHAPE" },
          ],
          solution: [
            { say: "V = P(1 + rn/100) is linear in n; V = P(1 + r/100)ⁿ is exponential." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === simple(p);
    if (question.key.depth === 2)
      return numberAnswer(question) === round(compound(p) - simple(p), 2);
    return true;
  },
});
