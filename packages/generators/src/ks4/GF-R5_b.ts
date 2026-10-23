/**
 * @statement GF-R5.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R5.b: Divide a quantity in a part:whole ratio
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GF-R5.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.PART-WHOLE"],

  params(rng) {
    const p = { a: rng.int(1, 7), b: rng.int(2, 9), k: rng.int(2, 12) };
    if (p.a === p.b || gcdOf(p.a, p.b) > 1) reject("a ratio in its simplest form");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = frac(p.a, p.a + p.b);
        return A.standard({
          question: [`In a class, the ratio of boys to girls is ${p.a} : ${p.b}.`],
          ask: "What fraction of the class are boys?",
          answer: A.exact(v),
          wrong: [
            {
              code: "RAT.PART-WHOLE",
              value: A.exact(frac(p.a, p.b)),
              feedback: `The whole class is ${p.a} + ${p.b} = ${p.a + p.b} parts.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.a}}{${p.a} + ${p.b}} = ${toLatex(v)}` }],
        });
      }
      case 2: {
        const adults = p.a * p.k;
        const v = p.b * p.k;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.math(`\\frac{${p.a}}{${p.a + p.b}}`),
                ` of the people at a show are adults. There are ${adults} adults.`,
              ],
              ask: "How many children are there?",
            },
            {
              question: [
                A.math(`\\frac{${p.a}}{${p.a + p.b}}`),
                ` of the marbles in a bag are red; the rest are green. There are ${adults} red marbles.`,
              ],
              ask: "How many green marbles are there?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.PART-WHOLE",
              value: A.number((p.a + p.b) * p.k),
              feedback: `That is the total. The rest are ${p.b} of the ${p.a + p.b} parts.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.a} \\text{ parts} = ${adults}, \\; 1 \\text{ part} = ${p.k}, \\; ${p.b} \\text{ parts} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `The ratio of cats to dogs at a rescue centre is ${p.a} : ${p.b}. Sid says `,
            A.math(`\\frac{${p.a}}{${p.b}}`),
            " of the animals are cats.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. There are ${p.a + p.b} parts altogether, so ${p.a}/${p.a + p.b} of the animals are cats.`,
              correct: true,
            },
            {
              text: "True. The ratio and the fraction use the same numbers.",
              code: "RAT.PART-WHOLE",
            },
            { text: `True. There are ${p.a} cats for every ${p.b} dogs.`, code: "RAT.PART-WHOLE" },
          ],
          solution: [
            { say: "A part:part ratio compares parts; a fraction compares a part with the whole." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.a, p.a + p.b));
    if (question.key.depth === 2) return numberAnswer(question) === p.b * p.k;
    return true;
  },
});
