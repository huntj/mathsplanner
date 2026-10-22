/**
 * @statement AL-P6.4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P6.4: Know ln x as the inverse of eˣ
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  k: number;
  c: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P6.4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LOG.INVERSE"],

  params(rng) {
    return { k: rng.int(2, 20), c: rng.int(2, 5), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Solve ", A.math(`e^x = ${p.k}`), ", giving the exact answer."],
          answer: A.exact(`\\ln ${p.k}`),
          wrong: [
            {
              code: "ALG.LOG.INVERSE",
              value: A.exact(`e^{${p.k}}`),
              feedback: "Take ln of both sides: ln(eˣ) = x.",
            },
          ],
          solution: [{ say: "", math: `x = \\ln ${p.k}` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            { question: ["Solve ", A.math(`\\ln(${p.c}x) = 2`), ", giving the exact answer."] },
            {
              question: ["Find the exact value of x for which ", A.math(`\\ln(${p.c}x) = 2`), "."],
            },
          ],
          answer: A.exact(`\\frac{e^2}{${p.c}}`),
          wrong: [
            {
              code: "ALG.LOG.INVERSE",
              value: A.exact(`\\frac{\\ln 2}{${p.c}}`),
              feedback: "Undo ln with e: if ln y = 2 then y = e².",
            },
          ],
          solution: [{ say: "", math: `${p.c}x = e^2 \\Rightarrow x = \\frac{e^2}{${p.c}}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? ["Uma says ", A.math(`\\ln(e^{${p.c}}) = ${p.c}`), "."]
            : ["Uma says ", A.math("\\ln 0 = 1"), " because e⁰ = 1."],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. ln and eˣ are inverse functions, so they undo each other.",
                  correct: true,
                },
                { text: `False. It is e^${p.c}.`, code: "ALG.LOG.INVERSE" },
                { text: `False. It is ${p.c}e.`, code: "ALG.LOG.INVERSE" },
              ]
            : [
                {
                  text: "False. e⁰ = 1 means ln 1 = 0. eˣ is never 0, so ln 0 is undefined.",
                  correct: true,
                },
                { text: "True. ln and e swap the 0 and the 1.", code: "ALG.LOG.INVERSE" },
                { text: "True. ln of anything small is 1." },
              ],
          solution: [{ say: "y = eˣ ⇔ x = ln y, for y > 0." }],
        });
    }
  },

  verify() {
    return true;
  },
});
