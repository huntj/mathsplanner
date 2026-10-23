/**
 * @statement Y7-RAT-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-RAT-04.b: Express one quantity as a fraction of another, greater than 1
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  min: number;
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-RAT-04.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.FRACTION.UNITS", "RAT.ORDER"],

  params(rng) {
    const p = {
      min: rng.pick([70, 75, 80, 90, 100, 105, 120, 135, 150]),
      a: rng.int(3, 9),
      b: rng.int(2, 8),
      k: rng.int(2, 6),
    };
    if (p.a <= p.b) reject("a bigger first amount");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = frac(p.min, 60);
        return A.standard({
          question: [`Write ${p.min} minutes as a fraction of an hour.`],
          ask: "Give your answer in its simplest form.",
          answer: A.exact(v),
          wrong: [
            {
              code: "RAT.FRACTION.UNITS",
              value: A.exact(frac(p.min, 100)),
              feedback:
                "An hour is 60 minutes. The answer is more than 1 because it is longer than an hour.",
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.min}}{60} = ${toLatex(v)}` }],
        });
      }
      case 2: {
        const v = frac(p.a, p.b);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`Mia has ${p.a * p.k} stickers and Ben has ${p.b * p.k}.`],
              ask: "Write Mia's number as a fraction of Ben's, in its simplest form.",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "RAT.ORDER",
              value: A.exact(frac(p.b, p.a)),
              feedback: "“Mia's as a fraction of Ben's” puts Mia's number on top.",
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.a * p.k}}{${p.b * p.k}} = ${toLatex(v)}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["One quantity written as a fraction of another is less than 1."],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. It is less than 1 when the first quantity is smaller, but ${p.min} minutes is ${toLatex(frac(p.min, 60)).replace(/\\frac\{(\d+)\}\{(\d+)\}/, "$1/$2")} of an hour.`,
              correct: true,
            },
            { text: "Always. A fraction is part of something.", code: "RAT.FRACTION.UNITS" },
            { text: "Never. Fractions of quantities are always improper." },
          ],
          solution: [{ say: "A fraction greater than 1 means the first quantity is bigger." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.min, 60));
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(p.a, p.b));
    return true;
  },
});
