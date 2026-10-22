/**
 * @statement CM-LP6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-LP6: Solve linear inequalities in one variable, using a number line and set notation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  lo: number;
  hi: number;
}

/** Integers n with lo < 2n + 1 ≤ hi. */
const count = (lo: number, hi: number, strictTop = false) => {
  let c = 0;
  for (let n = -50; n <= 50; n++)
    if (lo < 2 * n + 1 && (strictTop ? 2 * n + 1 < hi : 2 * n + 1 <= hi)) c++;
  return c;
};

export default defineGenerator<Params>({
  id: "CM-LP6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INEQUALITY.FLIP"],

  params(rng) {
    const p = {
      a: rng.int(2, 6),
      b: rng.int(-9, 9),
      k: rng.int(-5, 6),
      lo: rng.int(-9, 3),
      hi: rng.int(5, 15),
    };
    if (p.hi % 2 === 0 || p.k === 0)
      reject("an odd upper bound, so the ≤ matters, and a non-zero boundary");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // b − ax < b − ak  ⇔  x > k
        const rhs = p.b - p.a * p.k;
        const right = `\\{x : x > ${p.k}\\}`;
        return A.choice({
          rng,
          question: [
            "Solve ",
            A.math(`${p.b} - ${p.a}x < ${rhs}`),
            ", giving your answer in set notation.",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`\\{x : x < ${p.k}\\}`),
              code: "ALG.INEQUALITY.FLIP",
              feedback: `Dividing by −${p.a} reverses the inequality sign.`,
            },
            {
              content: A.math(`\\{x : x > ${-p.k}\\}`),
              code: "ALG.INEQUALITY.FLIP",
              feedback: "Check the sign of the number as well as the direction of the inequality.",
            },
          ],
          solution: [{ say: "", math: `-${p.a}x < ${rhs - p.b} \\Rightarrow x > ${p.k}` }],
        });
      }
      case 2: {
        const v = count(p.lo, p.hi);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "How many integers n satisfy ",
                A.math(`${p.lo} < 2n + 1 \\le ${p.hi}`),
                "?",
              ],
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.INEQUALITY.FLIP",
              value: A.number(count(p.lo, p.hi, true)),
              feedback: `≤ includes the end value: 2n + 1 = ${p.hi} is allowed.`,
            },
          ]),
          solution: [
            { say: `${(p.lo - 1) / 2} < n ≤ ${(p.hi - 1) / 2}, which gives ${v} integers.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Yas says that multiplying both sides of an inequality by −2 keeps the inequality sign the same.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Multiplying or dividing by a negative number reverses the order: 3 < 5, but −6 > −10.",
              correct: true,
            },
            {
              text: "True. Inequalities work exactly like equations.",
              code: "ALG.INEQUALITY.FLIP",
            },
            { text: "True. Only adding a negative changes the sign.", code: "ALG.INEQUALITY.FLIP" },
          ],
          solution: [
            { say: "Reverse the sign whenever you multiply or divide both sides by a negative." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `\\{x : x > ${p.k}\\}`;
    if (question.key.depth === 2) return numberAnswer(question) === count(p.lo, p.hi);
    return true;
  },
});
