/**
 * @statement AL-P6.6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P6.6: Solve aˣ = b using logarithms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-P6.6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LOG.INVERSE", "ALG.LOG.LAWS"],

  params(rng) {
    const a = rng.pick([2, 3, 5, 7]);
    const b = rng.int(10, 90);
    const c = rng.pick([3, 5, 7]);
    if (Number.isInteger(Math.log(b) / Math.log(a)) || a === c)
      reject("a non-whole power and two different bases");
    return { a, b, c };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = r2(Math.log(p.b) / Math.log(p.a));
        return A.standard({
          question: [
            "Solve ",
            A.math(`${p.a}^x = ${p.b}`),
            ", giving your answer to 2 decimal places.",
          ],
          answer: A.number(x, { accuracy: { dp: 2 } }),
          wrong: signedWrongs(x, [
            {
              code: "ALG.LOG.INVERSE",
              value: A.number(r2(p.b / p.a), { accuracy: { dp: 2 } }),
              feedback: "Take logs of both sides: x log a = log b.",
            },
          ]),
          solution: [{ say: "", math: `x = \\frac{\\ln ${p.b}}{\\ln ${p.a}} = ${x}` }],
        });
      }
      case 2: {
        const x = r2(Math.log(p.a) / (Math.log(p.c) - Math.log(p.a)));
        const slip = r2(Math.log(p.a) / (Math.log(p.c) + Math.log(p.a)));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Solve ",
                A.math(`${p.a}^{x+1} = ${p.c}^x`),
                ", giving your answer to 2 decimal places.",
              ],
            },
          ],
          answer: A.number(x, { accuracy: { dp: 2 } }),
          wrong: signedWrongs(x, [
            {
              code: "ALG.LOG.LAWS",
              value: A.number(slip, { accuracy: { dp: 2 } }),
              feedback: `(x + 1) ln ${p.a} = x ln ${p.c}, so x(ln ${p.c} − ln ${p.a}) = ln ${p.a}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `(x + 1)\\ln ${p.a} = x \\ln ${p.c} \\Rightarrow x = \\frac{\\ln ${p.a}}{\\ln ${p.c} - \\ln ${p.a}} = ${x}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Rae says ", A.math(`${p.a}^x = -${p.a ** 3}`), " has the solution x = −3."],
          truth: false,
          reasons: [
            {
              text: `False. ${p.a}^x is positive for every x, so it can never equal −${p.a ** 3}: there is no solution. (${p.a}^(−3) = 1/${p.a ** 3}.)`,
              correct: true,
            },
            { text: "True. A negative answer needs a negative power.", code: "ALG.LOG.INVERSE" },
            { text: `False. x = ${-(p.a ** 3)} ÷ ${p.a}.`, code: "ALG.LOG.INVERSE" },
          ],
          solution: [{ say: "Exponential functions only take positive values." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r2(Math.log(p.b) / Math.log(p.a));
    return true;
  },
});
