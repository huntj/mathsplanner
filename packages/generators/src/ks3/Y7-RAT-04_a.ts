/**
 * @statement Y7-RAT-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-RAT-04.a: Express one quantity as a fraction of another, less than 1
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  cm: number;
  min: number;
  p: number;
  pounds: number;
}

export default defineGenerator<Params>({
  id: "Y7-RAT-04.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.FRACTION.UNITS"],

  params(rng) {
    const p = {
      cm: rng.int(1, 19) * 5,
      min: rng.pick([5, 10, 12, 15, 20, 24, 30, 36, 40, 45]),
      p: rng.int(1, 9) * 10,
      pounds: rng.int(2, 5),
    };
    if (p.cm % 100 === 0) reject("less than a metre");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = frac(p.cm, 100);
        return A.standard({
          question: [`What fraction of 1 metre is ${p.cm} cm?`],
          ask: "Give your answer in its simplest form.",
          answer: A.exact(v),
          wrong: [
            {
              code: "RAT.FRACTION.UNITS",
              value: A.exact(String(p.cm)),
              feedback: "Change 1 m to 100 cm first, so both are in the same units.",
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.cm}}{100} = ${toLatex(v)}` }],
        });
      }
      case 2: {
        const v = frac(p.min, 60);
        return A.variedForm({
          rng,
          forms: [
            { question: [`What fraction of an hour is ${p.min} minutes?`] },
            {
              question: [`A lesson lasts one hour. Kim spends ${p.min} minutes of it reading.`],
              ask: "What fraction of the lesson is that, in its simplest form?",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "RAT.FRACTION.UNITS",
              value: A.exact(frac(p.min, 100)),
              feedback: "An hour is 60 minutes, not 100.",
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.min}}{60} = ${toLatex(v)}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Fay says ${p.p}p as a fraction of £${p.pounds} is `,
            A.math(`\\frac{${p.p}}{${p.pounds}}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. £${p.pounds} is ${p.pounds * 100}p, so it is ${p.p}/${p.pounds * 100} = ${toLatex(frac(p.p, p.pounds * 100)).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")}.`,
              correct: true,
            },
            { text: "True. Put the first amount over the second.", code: "RAT.FRACTION.UNITS" },
            {
              text: "True. Pence and pounds can be mixed in a fraction.",
              code: "RAT.FRACTION.UNITS",
            },
          ],
          solution: [{ say: "Use the same units on the top and the bottom." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.cm, 100));
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(p.min, 60));
    return true;
  },
});
