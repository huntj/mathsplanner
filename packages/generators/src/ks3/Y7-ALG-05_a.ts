/**
 * @statement Y7-ALG-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-ALG-05.a: Generate terms from a term-to-term rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  d: number;
  s: number;
  m: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-05.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.POSITION-RULE", "ALG.FUNCTION.ORDER"],

  params(rng) {
    const p = {
      a: rng.int(-5, 12),
      d: rng.int(2, 9) * rng.pick([1, -1]),
      s: rng.int(1, 6),
      m: rng.int(2, 3),
      k: rng.int(1, 4),
    };
    if (p.a === 0) reject("a non-zero first term");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.a + 4 * p.d;
        return A.standard({
          question: [
            `A sequence starts at ${p.a}. The rule is "${p.d > 0 ? "add" : "subtract"} ${Math.abs(p.d)}".`,
          ],
          ask: "Find the 5th term.",
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(p.a + 5 * p.d),
              feedback:
                "The first term is already the start: there are 4 steps from the 1st term to the 5th.",
            },
          ]),
          solution: [{ say: "", math: [0, 1, 2, 3, 4].map((i) => p.a + i * p.d).join(", ") }],
        });
      }
      case 2: {
        const terms = [p.s];
        for (let i = 0; i < 3; i++) terms.push((terms.at(-1) ?? 0) * p.m - p.k);
        const v = terms[3] ?? 0;
        const swapped = [p.s];
        for (let i = 0; i < 3; i++) swapped.push(((swapped.at(-1) ?? 0) - p.k) * p.m);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A sequence starts at ${p.s}. The rule is "multiply by ${p.m}, then subtract ${p.k}".`,
              ],
              ask: "Find the 4th term.",
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.FUNCTION.ORDER",
              value: A.number(swapped[3] ?? 0),
              feedback: `Multiply by ${p.m} first, then subtract ${p.k}.`,
            },
          ]),
          solution: [{ say: "", math: terms.join(", ") }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ['A sequence with the rule "add 3" contains only multiples of 3.'],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. Starting at 3 gives 3, 6, 9, …, but starting at 1 gives 1, 4, 7, …, which are not multiples of 3.",
              correct: true,
            },
            { text: "Always. Adding 3 makes multiples of 3.", code: "ALG.SEQUENCE.POSITION-RULE" },
            { text: "Never. Sequences never contain multiples." },
          ],
          solution: [{ say: "The first term matters as well as the rule." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a + 4 * p.d;
    if (question.key.depth === 2) {
      let t = p.s;
      for (let i = 0; i < 3; i++) t = t * p.m - p.k;
      return numberAnswer(question) === t;
    }
    return true;
  },
});
