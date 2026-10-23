/**
 * @statement GF-A6.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A6.c: Use algebra to support an argument
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const KINDS = [
  { what: "always odd", right: "2n + 1", wrong: ["n + 1", "2n"] },
  { what: "always even", right: "2n + 2", wrong: ["n + 2", "2n + 1"] },
  { what: "always a multiple of 3", right: "3n + 6", wrong: ["n + 3", "3n + 1"] },
];

interface Params {
  kind: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GF-A6.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.PROOF.EXAMPLES", "ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng) {
    return { kind: rng.int(0, KINDS.length - 1), k: rng.int(4, 8) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const K = KINDS[p.kind] ?? (KINDS[0] as (typeof KINDS)[number]);
        return A.choice({
          rng,
          question: [`n is a whole number. Which expression is ${K.what}?`],
          correct: A.math(K.right),
          distractors: K.wrong.map((w) => ({
            content: A.math(w),
            code: "ALG.PROOF.EXAMPLES",
            feedback:
              "Try a few values of n, then look at the structure: can it be written as the required multiple for every n?",
          })),
          solution: [{ say: `${K.right} is ${K.what} for every whole number n.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Simplify ",
            A.math("(2n + 1)^2 - (2n - 1)^2"),
            ", to show that it is always a multiple of 8.",
          ],
          correct: A.math("8n"),
          distractors: [
            {
              content: A.math("2"),
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              feedback: "(2n + 1)² = 4n² + 4n + 1: keep the middle terms.",
            },
            {
              content: A.math("4n"),
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              feedback: "Each square has a middle term of ±4n, and they do not cancel.",
            },
          ],
          solution: [{ say: "", math: `(4n^2 + 4n + 1) - (4n^2 - 4n + 1) = 8n` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Nia checks the claim "n² + n is always even" for n = 1 to ${p.k} and says this proves it.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. Examples cannot prove it for every n. An algebraic argument does: n² + n = n(n + 1), a product of consecutive whole numbers, one of which is even.",
              correct: true,
            },
            { text: `True. ${p.k} examples are enough to prove it.`, code: "ALG.PROOF.EXAMPLES" },
            {
              text: "True. If it works for small numbers it works for all.",
              code: "ALG.PROOF.EXAMPLES",
            },
          ],
          solution: [{ say: "The claim is true, but only the algebra proves it." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === KINDS[p.kind]?.right;
    return true;
  },
});
