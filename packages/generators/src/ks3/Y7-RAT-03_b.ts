/**
 * @statement Y7-RAT-03.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-RAT-03.b: Divide a quantity in a part:whole ratio
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, exactAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "Y7-RAT-03.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.PART-WHOLE"],

  params(rng) {
    const p = { a: rng.int(1, 7), b: rng.int(2, 9) };
    if (p.a === p.b || gcdOf(p.a, p.b) > 1) reject("a ratio in its simplest form");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = frac(p.b, p.a + p.b);
        return A.standard({
          question: [`The ratio of red to blue counters in a bag is ${p.a} : ${p.b}.`],
          ask: "What fraction of the counters are blue?",
          answer: A.exact(v),
          wrong: [
            {
              code: "RAT.PART-WHOLE",
              value: A.exact(frac(p.b, p.a)),
              feedback: `Blue is ${p.b} parts out of ${p.a + p.b} parts altogether.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.b}}{${p.a} + ${p.b}} = ${toLatex(v)}` }],
        });
      }
      case 2: {
        const right = `${p.a} : ${p.b}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            A.math(`\\frac{${p.a}}{${p.a + p.b}}`),
            " of a class are boys and the rest are girls.",
          ],
          ask: "What is the ratio of boys to girls?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`${p.a} : ${p.a + p.b}`),
              code: "RAT.PART-WHOLE",
              feedback: `${p.a + p.b} is the whole class. Girls are ${p.a + p.b} − ${p.a} = ${p.b} parts.`,
            },
            { content: A.math(`${p.b} : ${p.a}`), feedback: "Boys come first in this ratio." },
          ],
          solution: [{ say: `Boys ${p.a} parts, girls ${p.b} parts: `, math: right }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "If ",
            A.math(`\\frac{1}{${p.b}}`),
            " of the sweets in a bag are red, the ratio of red sweets to other sweets is ",
            A.math(`1 : ${p.b}`),
            ".",
          ],
          truth: "never",
          reasons: [
            {
              text: `Never. 1 part in ${p.b} is red, so ${p.b - 1} parts are other sweets: the ratio is 1 : ${p.b - 1}.`,
              correct: true,
            },
            {
              text: "Always. A fraction and a ratio use the same numbers.",
              code: "RAT.PART-WHOLE",
            },
            { text: "Sometimes. It depends how many sweets there are.", code: "RAT.PART-WHOLE" },
          ],
          solution: [{ say: "A ratio compares parts; a fraction compares a part with the whole." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.b, p.a + p.b));
    if (question.key.depth === 2) return chosenText(question) === `${p.a} : ${p.b}`;
    return true;
  },
});
