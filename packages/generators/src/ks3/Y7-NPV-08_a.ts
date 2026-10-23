/**
 * @statement Y7-NPV-08.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-08.a: Round to a given number of decimal places
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  i: number;
  d1: number;
  d2: number;
  d3: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-08.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ROUND.ALWAYS-DOWN", "NPV.ROUND.WRONG-PLACE"],

  params(rng) {
    return { i: rng.int(1, 20), d1: rng.int(0, 8), d2: rng.int(5, 9), d3: rng.int(1, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = `${p.i}.${p.d1}${p.d2}`;
        const v = Number(`${p.i}.${p.d1 + 1}`);
        return A.standard({
          question: ["Round ", A.math(x), " to 1 decimal place."],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "NPV.ROUND.ALWAYS-DOWN",
              value: A.number(Number(`${p.i}.${p.d1}`), { accuracy: { dp: 1 } }),
              feedback: `The next digit is ${p.d2}, which is 5 or more, so round up.`,
            },
          ]),
          solution: [{ say: "", math: `${x} \\approx ${v}` }],
        });
      }
      case 2: {
        const x = `${p.i}.${p.d1}${p.d2}${p.d3}`;
        const v = Number((Math.round(Number(x) * 100) / 100).toFixed(2));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A calculator shows £${x} for the cost of one item.`],
              ask: "Round this to the nearest penny, in pounds.",
            },
            { question: ["Round ", A.math(x), " to 2 decimal places."] },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.ROUND.WRONG-PLACE",
              value: A.number(Number((Math.round(Number(x) * 10) / 10).toFixed(1))),
              feedback: "Pennies are hundredths of a pound: keep two decimal places.",
            },
          ]),
          solution: [{ say: "", math: `${x} \\approx ${v.toFixed(2)}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mia says ",
            A.math(`${p.i}.9${p.d2}`),
            ` rounded to 1 decimal place is ${p.i}.10.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. 9 tenths rounds up to 10 tenths, which is 1 whole: the answer is ${p.i + 1}.0.`,
              correct: true,
            },
            { text: "True. The 9 becomes 10.", code: "NPV.ROUND.WRONG-PLACE" },
            {
              text: `False. It is ${p.i}.9, since you always round down.`,
              code: "NPV.ROUND.ALWAYS-DOWN",
            },
          ],
          solution: [{ say: "", math: `${p.i}.9${p.d2} \\approx ${p.i + 1}.0` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === Number(`${p.i}.${p.d1 + 1}`);
    if (question.key.depth === 2)
      return (
        numberAnswer(question) ===
        Number((Math.round(Number(`${p.i}.${p.d1}${p.d2}${p.d3}`) * 100) / 100).toFixed(2))
      );
    return true;
  },
});
