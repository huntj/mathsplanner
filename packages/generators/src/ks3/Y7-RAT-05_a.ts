/**
 * @statement Y7-RAT-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-RAT-05.a: Write percentages as fractions and decimals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

interface Params {
  small: number;
  p: number;
}

export default defineGenerator<Params>({
  id: "Y7-RAT-05.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.PERCENT.DIGITS"],

  params(rng) {
    const p = { small: rng.int(1, 9), p: rng.int(2, 19) * 5 };
    if (p.p % 10 === 0 && p.p / 10 === p.small) reject("different percentages");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.small / 100;
        return A.standard({
          question: [`Write ${p.small}% as a decimal.`],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "FR.PERCENT.DIGITS",
              value: A.number(p.small / 10),
              feedback: `${p.small}% means ${p.small} hundredths: 0.0${p.small}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.small} \\div 100 = ${v}` }],
        });
      }
      case 2: {
        const v = frac(p.p, 100);
        return A.variedForm({
          rng,
          forms: [
            { question: [`Write ${p.p}% as a fraction in its simplest form.`] },
            {
              question: [`${p.p}% of a class walk to school.`],
              ask: "What fraction of the class is that, in its simplest form?",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.PERCENT.DIGITS",
              value: A.exact(frac(p.p, 10)),
              feedback: "Per cent means out of 100.",
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.p}}{100} = ${toLatex(v)}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Gil says ",
            A.math("0.5\\%"),
            " is the same as ",
            A.math("\\frac{1}{2}"),
            ".",
          ],
          truth: false,
          reasons: [
            { text: "False. ½ = 50%. 0.5% is half of 1%, which is 1/200 = 0.005.", correct: true },
            { text: "True. 0.5 is a half.", code: "FR.PERCENT.DIGITS" },
            { text: "True. The % sign does not change the value.", code: "FR.PERCENT.DIGITS" },
          ],
          solution: [{ say: "Divide a percentage by 100 to get the decimal." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.small / 100;
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(p.p, 100));
    return true;
  },
});
