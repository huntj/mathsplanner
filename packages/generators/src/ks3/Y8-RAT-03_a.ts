/**
 * @statement Y8-RAT-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-RAT-03.a: Express one quantity as a percentage of another
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  total: number;
  part: number;
  pence: number;
  pounds: number;
  score: number;
  pc: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "Y8-RAT-03.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ORDER", "RAT.FRACTION.UNITS"],

  params(rng) {
    const total = rng.pick([20, 25, 40, 50, 80]);
    const p = {
      total,
      part: rng.int(3, total - 2),
      pence: rng.int(1, 19) * 5,
      pounds: rng.int(2, 5),
      score: rng.int(12, 19),
      pc: rng.int(60, 95),
    };
    if (((100 * p.part) / total) % 1 !== 0 || p.score * 5 === p.pc)
      reject("whole-number percentages that differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = (100 * p.part) / p.total;
        return A.standard({
          question: [`${p.part} out of ${p.total} pupils in a club are left-handed.`],
          ask: "What percentage is that?",
          answer: A.number(v, { units: "%" }),
          wrong: wrongs(v, [
            {
              code: "RAT.ORDER",
              value: A.number(r((100 * p.total) / p.part), { units: "%" }),
              feedback: `Divide the part by the whole: ${p.part} ÷ ${p.total}, then × 100.`,
            },
          ]),
          solution: [{ say: "", math: `\\frac{${p.part}}{${p.total}} \\times 100 = ${v}\\%` }],
        });
      }
      case 2: {
        const v = r(p.pence / p.pounds);
        return A.variedForm({
          rng,
          forms: [{ question: [`Write ${p.pence}p as a percentage of £${p.pounds}.`] }],
          answer: A.number(v, { units: "%" }),
          wrong: wrongs(v, [
            {
              code: "RAT.FRACTION.UNITS",
              value: A.number(r((p.pence / p.pounds) * 100), { units: "%" }),
              feedback: `Change £${p.pounds} to ${p.pounds * 100}p first, so both amounts are in pence.`,
            },
          ]),
          solution: [
            { say: "", math: `\\frac{${p.pence}}{${p.pounds * 100}} \\times 100 = ${v}\\%` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Kim scored ${p.score} out of 20 in one test and ${p.pc}% in another. She says ${p.score * 5 > p.pc ? `her ${p.score} out of 20 was the better score` : `her ${p.pc}% was the better score`}.`,
          ],
          truth: true,
          reasons: [
            {
              text: `True. ${p.score} out of 20 is ${p.score * 5}%, so it can be compared with ${p.pc}%.`,
              correct: true,
            },
            {
              text: "False. You cannot compare marks out of different totals.",
              code: "RAT.FRACTION.UNITS",
            },
            {
              text: `False. ${p.score} is smaller than ${p.pc}, so it is worse.`,
              code: "RAT.FRACTION.UNITS",
            },
          ],
          solution: [{ say: "Percentages put scores out of different totals on the same scale." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (100 * p.part) / p.total;
    if (question.key.depth === 2) return numberAnswer(question) === r(p.pence / p.pounds);
    return true;
  },
});
