/**
 * @statement CM-LP8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-LP8: Use algebra to support and construct arguments
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const CLAIMS = [
  {
    claim: "the sum of three consecutive whole numbers is always a multiple of 3",
    proof: "n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1)",
    example: "1 + 2 + 3 = 6 and 4 + 5 + 6 = 15, which are multiples of 3",
    slip: "n + n + n = 3n, which is a multiple of 3",
  },
  {
    claim: "the difference between the squares of two consecutive whole numbers is always odd",
    proof: "(n + 1)² − n² = 2n + 1, which is odd",
    example: "4² − 3² = 7 and 6² − 5² = 11, which are odd",
    slip: "(n + 1)² − n² = 1, which is odd",
  },
  {
    claim: "the sum of two odd numbers is always even",
    proof: "(2m + 1) + (2n + 1) = 2(m + n + 1)",
    example: "3 + 5 = 8 and 7 + 9 = 16, which are even",
    slip: "(2n + 1) + (2n + 1) = 4n + 2 = 2(2n + 1)",
  },
];

interface Params {
  c: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "CM-LP8",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.PROOF.EXAMPLES", "ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng) {
    return { c: rng.int(0, CLAIMS.length - 1), n: rng.int(4, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    const C = CLAIMS[p.c] ?? (CLAIMS[0] as (typeof CLAIMS)[number]);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`Which of these proves that ${C.claim}?`],
          correct: C.proof,
          distractors: [
            {
              content: C.example,
              code: "ALG.PROOF.EXAMPLES",
              feedback: "Examples can support a claim, but they cannot prove it for every number.",
            },
            {
              content: C.slip,
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              feedback: "Check the algebra: the general numbers must be written correctly.",
            },
          ],
          solution: [{ say: `Using algebra covers every case: ${C.proof}.` }],
        });
      case 2: {
        const right = "4n + 4";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Simplify ",
            A.math("(n + 2)^2 - n^2"),
            ", as part of showing it is always a multiple of 4.",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math("4"),
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              feedback: "(n + 2)² = n² + 4n + 4, not n² + 4.",
            },
            {
              content: A.math("2n + 4"),
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              feedback: "The middle term of (n + 2)² is 2 × 2 × n = 4n.",
            },
          ],
          solution: [{ say: "", math: `n^2 + 4n + 4 - n^2 = 4n + 4 = 4(n + 1)` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [`Abe checks ${p.n} examples and says this proves that ${C.claim}.`],
          truth: false,
          reasons: [
            {
              text: "False. However many examples work, there could be one that does not. An algebraic argument covers every case at once.",
              correct: true,
            },
            { text: "True. Enough examples count as a proof.", code: "ALG.PROOF.EXAMPLES" },
            { text: `True. ${p.n} examples is plenty.`, code: "ALG.PROOF.EXAMPLES" },
          ],
          solution: [{ say: `A proof: ${C.proof}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === CLAIMS[p.c]?.proof;
    if (question.key.depth === 2) return chosenText(question) === "4n + 4";
    return true;
  },
});
