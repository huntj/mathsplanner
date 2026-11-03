/**
 * @statement Y7-RAT-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-RAT-04.b: Express one quantity as a fraction of another, greater than 1
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  min: number;
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-RAT-04.b",
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
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
            }),
          [
            {
              statement: `Lou says ${p.a} as a fraction of ${p.b} is $\\frac{${p.a}}{${p.b}}$, which is more than 1.`,
              truth: true,
              right: `True. ${p.a} is bigger than ${p.b}, so it is more than one whole lot of ${p.b}.`,
              wrong: [
                [`False. It is ${p.b}/${p.a}: the smaller number goes on top.`, "RAT.ORDER"],
                ["False. A fraction of something is always less than 1."],
              ],
            },
            {
              statement: `Mo says ${p.min} minutes as a fraction of an hour is $\\frac{60}{${p.min}}$.`,
              truth: false,
              right: `False. The first quantity goes on top: ${p.min}/60, which is more than 1.`,
              wrong: [
                ["True. The bigger number goes on the bottom.", "RAT.ORDER"],
                ["True. Hours always go on top."],
              ],
            },
            {
              claim: "A quantity written as a fraction of a smaller quantity is less than 1.",
              truth: "never",
              right:
                "Never. The first quantity is more than one whole lot of the second, so the fraction is more than 1.",
              wrong: [
                ["Always. Fractions are less than 1."],
                ["Sometimes. It depends on the units.", "RAT.FRACTION.UNITS"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.min, 60));
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(p.a, p.b));
    return true;
  },
});
