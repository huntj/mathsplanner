/**
 * @statement GF-A23.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A23.a: Generate a sequence from a term-to-term rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  start: number;
  m: number;
  c: number;
}

const term = (p: Params, n: number) => {
  let t = p.start;
  for (let i = 1; i < n; i++) t = p.m * t + p.c;
  return t;
};
const rule = (p: Params) =>
  `multiply by ${p.m}, then ${p.c < 0 ? "subtract" : "add"} ${Math.abs(p.c)}`;

export default defineGenerator<Params>({
  id: "GF-A23.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.POSITION-RULE"],

  params(rng) {
    return { start: rng.int(1, 6), m: rng.int(2, 3), c: rng.int(1, 5) * rng.pick([1, -1]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = term(p, 4);
        return A.standard({
          question: [
            `A sequence starts with ${p.start}. The rule to get the next term is: ${rule(p)}.`,
          ],
          ask: "Find the 4th term.",
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(term(p, 3)),
              feedback: `${p.start} is the 1st term, so apply the rule three times to reach the 4th.`,
            },
          ]),
          solution: [{ say: `${[1, 2, 3, 4].map((n) => term(p, n)).join(", ")}.` }],
        });
      }
      case 2: {
        const third = term(p, 3);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`The rule for a sequence is: ${rule(p)}. The 3rd term is ${third}.`],
              ask: "Find the 1st term.",
            },
          ],
          answer: A.number(p.start),
          wrong: signedWrongs(p.start, [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(term(p, 2)),
              feedback:
                "Work backwards two steps: undo the rule from the 3rd term to the 2nd, then to the 1st.",
            },
          ]),
          solution: [
            {
              say: `Work backwards: subtract ${p.c} then divide by ${p.m}, twice: ${third} → ${term(p, 2)} → ${p.start}.`.replace(
                "subtract -",
                "add ",
              ),
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            `A sequence uses the rule "add ${p.m}". Ola says every term is a multiple of ${p.m}.`,
          ],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. It depends on the first term: starting at ${p.m} gives ${p.m}, ${2 * p.m}, ${3 * p.m}, … but starting at 1 gives 1, ${1 + p.m}, …`,
              correct: true,
            },
            {
              text: `Always. Adding ${p.m} always gives multiples of ${p.m}.`,
              code: "ALG.SEQUENCE.POSITION-RULE",
            },
            { text: "Never. Term-to-term rules never give multiples." },
          ],
          solution: [{ say: "A term-to-term rule needs a first term as well." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === term(p, 4);
    if (question.key.depth === 2) return numberAnswer(question) === p.start;
    return true;
  },
});
