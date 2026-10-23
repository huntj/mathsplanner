/**
 * @statement Y9-ALG-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-01.a: Factorise x² + bx + c with positive b and c
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly } from "../shared/alg.ts";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  p: number;
  q: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FACTORISE.SIGNS"],

  params(rng) {
    const pq = { p: rng.int(2, 7), q: rng.int(2, 9) };
    if (pq.p >= pq.q || pq.p * pq.q === pq.p + pq.q + 1) reject("a clear factor pair");
    return pq;
  },

  build(p, depth, rng): QuestionDraft {
    const right = `${bracket(p.p)}${bracket(p.q)}`;
    const quad = poly([1, p.p + p.q, p.p * p.q]);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Factorise ", A.math(quad), "."],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(`${bracket(1)}${bracket(p.p * p.q)}`),
              feedback: `The pair must multiply to ${p.p * p.q} and add to ${p.p + p.q}.`,
            },
          ],
          solution: [
            {
              say: `${p.p} × ${p.q} = ${p.p * p.q} and ${p.p} + ${p.q} = ${p.p + p.q}: `,
              math: right,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A rectangle has area ",
                A.math(quad),
                " cm². Its length and width are both of the form (x + a).",
              ],
              ask: "Write the area as a product of two brackets.",
            },
          ],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(`${bracket(p.p + p.q - 1)}${bracket(1)}`),
              feedback: `Those add to ${p.p + p.q}, but multiply to ${p.p + p.q - 1}, not ${p.p * p.q}.`,
            },
          ],
          solution: [{ say: "", math: `${quad} = ${right}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Lee says ", A.math(`${quad} = (x + ${p.p + p.q})(x + ${p.p * p.q})`), "."],
          truth: false,
          reasons: [
            {
              text: `False. Expanding that gives a much bigger x term. The numbers in the brackets must multiply to ${p.p * p.q} and add to ${p.p + p.q}: ${p.p} and ${p.q}.`,
              correct: true,
            },
            {
              text: "True. Copy the numbers from the expression into the brackets.",
              code: "ALG.FACTORISE.SIGNS",
            },
            {
              text: "True. Any brackets that contain the numbers work.",
              code: "ALG.FACTORISE.SIGNS",
            },
          ],
          solution: [{ say: "Check by expanding your answer." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return exactAnswer(question) === `${bracket(p.p)}${bracket(p.q)}`;
    return true;
  },
});
