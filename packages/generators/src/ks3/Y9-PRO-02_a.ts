/**
 * @statement Y9-PRO-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-PRO-02.a: Find theoretical probabilities for single events
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  a: number;
  b: number;
  p1: number;
  p2: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "Y9-PRO-02.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.COMPLEMENT", "AS.MULTISTEP.ONE-STEP"],

  params(rng) {
    const p = { a: rng.int(1, 8), b: rng.int(1, 9), p1: rng.int(1, 4) * 5, p2: rng.int(1, 5) * 5 };
    if (p.b === 0 || 10 - p.b === p.b || p.p1 + p.p2 >= 90)
      reject("a complement that tests the idea");
    if (Number(`0.${10 - p.a}${10 - p.b}`) === r(1 - Number(`0.${p.a}${p.b}`)))
      reject("a digit slip that differs");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const prob = Number(`0.${p.a}${p.b}`);
        const v = r(1 - prob);
        return A.standard({
          question: [`The probability that a train is late is ${prob}.`],
          ask: "What is the probability that it is not late?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.COMPLEMENT",
              value: A.number(Number(`0.${10 - p.a}${10 - p.b}`)),
              feedback: `Subtract from 1 carefully: 1.00 − ${prob} = ${v}. Check: ${prob} + ${v} = 1.`,
            },
          ]),
          solution: [{ say: "", math: `1 - ${prob} = ${v}` }],
        });
      }
      case 2: {
        const q1 = p.p1 / 100;
        const q2 = p.p2 / 100;
        const v = r(1 - q1 - q2);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A spinner can land on red, blue or green.",
                A.math(
                  tableLatex(["Colour", "red", "blue", "green"], [["Probability", q1, q2, "?"]]),
                ),
              ],
              ask: "Find the probability that it lands on green.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(r(q1 + q2)),
              feedback:
                "That is P(red or blue). The probabilities add up to 1, so subtract it from 1.",
            },
          ]),
          solution: [{ say: "", math: `1 - ${q1} - ${q2} = ${v}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [A.math("P(A) + P(\\text{not } A) = 1")],
          truth: "always",
          reasons: [
            {
              text: "Always. Either A happens or it does not, and one of those is certain.",
              correct: true,
            },
            { text: "Sometimes. Only when P(A) = 0.5.", code: "PRO.COMPLEMENT" },
            { text: "Never. They add up to 100.", code: "PRO.COMPLEMENT" },
          ],
          solution: [{ say: "P(not A) = 1 − P(A)." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r(1 - Number(`0.${p.a}${p.b}`));
    if (question.key.depth === 2) return numberAnswer(question) === r(1 - p.p1 / 100 - p.p2 / 100);
    return true;
  },
});
