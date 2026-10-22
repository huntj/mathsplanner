/**
 * @statement AL-P6.8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P6.8: Model exponential growth and decay and consider model limitations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n0: number;
  k: number;
  t: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-P6.8",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND.SIMPLE", "ALG.LOG.INVERSE", "ALG.MODEL.LIMITATION"],

  params(rng) {
    return {
      n0: 100 * rng.int(2, 9),
      k: rng.pick([0.05, 0.1, 0.15, 0.2, 0.25]),
      t: rng.int(3, 10),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const model = A.math(`P = ${p.n0}e^{${p.k}t}`);
    const intro = ["The number of bacteria, P, after t hours is modelled by ", model, "."];
    switch (depth) {
      case 1: {
        const v = Math.round(p.n0 * Math.exp(p.k * p.t));
        return A.standard({
          question: intro,
          ask: `Find the number of bacteria after ${p.t} hours, to the nearest whole number.`,
          answer: A.number(v, { accuracy: { dp: 0 } }),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(Math.round(p.n0 * (1 + p.k * p.t)), { accuracy: { dp: 0 } }),
              feedback: "Substitute into the exponential model; it is not simple growth.",
            },
          ]),
          solution: [{ say: "", math: `${p.n0}e^{${p.k} \\times ${p.t}} = ${v}` }],
        });
      }
      case 2: {
        const t = r2(Math.log(2) / p.k);
        return A.variedForm({
          rng,
          forms: [
            {
              question: intro,
              ask: "Find the time taken for the number of bacteria to double, to 2 decimal places.",
            },
          ],
          answer: A.number(t, { units: "hours", accuracy: { dp: 2 } }),
          wrong: wrongs(t, [
            {
              code: "ALG.LOG.INVERSE",
              value: A.number(r2(2 / p.k), { units: "hours", accuracy: { dp: 2 } }),
              feedback: "Solve e^(kt) = 2 by taking ln: kt = ln 2.",
            },
          ]),
          solution: [
            { say: "", math: `e^{${p.k}t} = 2 \\Rightarrow t = \\frac{\\ln 2}{${p.k}} = ${t}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            ...intro,
            " Fin says the number of bacteria will really keep growing for ever, because the model says so.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The model predicts that, but in reality food and space run out, so growth slows; the model is only valid for a limited time.",
              correct: true,
            },
            { text: "True. Exponential growth never stops.", code: "ALG.MODEL.LIMITATION" },
            {
              text: "True. The model fits the early data, so it fits all data.",
              code: "ALG.MODEL.LIMITATION",
            },
          ],
          solution: [
            {
              say: "Consider the assumptions behind a model before trusting its long-term predictions.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === Math.round(p.n0 * Math.exp(p.k * p.t));
    return true;
  },
});
