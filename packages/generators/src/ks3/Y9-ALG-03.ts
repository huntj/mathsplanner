/**
 * @statement Y9-ALG-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-ALG-03: Use algebra to generalise the structure of arithmetic, including to formulate
// mathematical relationships
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** How many consecutive numbers to add. */
  count: number;
  claim: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LIKE-TERMS.UNLIKE"],

  params(rng, numbers) {
    return { count: rng.int(2, numbers === "friendly" ? 3 : 5), claim: rng.int(0, 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const terms = Array.from({ length: p.count }, (_, k) => (k === 0 ? "n" : `(n + ${k})`));
    const constant = (p.count * (p.count - 1)) / 2;
    const answer = `${p.count}n + ${constant}`;
    switch (depth) {
      case 1:
        return A.standard({
          question: `n is a whole number. Write an expression for the sum of n and the next ${p.count - 1} whole number${p.count === 2 ? "" : "s"} after it.`,
          ask: "Simplify your expression.",
          answer: A.exact(answer),
          wrong: [
            {
              code: "ALG.LIKE-TERMS.UNLIKE",
              value: A.exact(`${p.count + constant}n`),
              feedback: `The numbers 1, 2, … are not n terms: collect the n's (${p.count}n) and the numbers (${constant}) separately.`,
            },
          ],
          solution: [{ say: `${terms.join(" + ")} = ${answer}.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question:
            "Which expression shows that the sum of any three consecutive whole numbers is a multiple of 3?",
          correct: A.math("n + (n + 1) + (n + 2) = 3(n + 1)"),
          distractors: [
            {
              content: A.math("n + n + n = 3n"),
              feedback: "Those are three equal numbers, not consecutive ones.",
            },
            {
              content: A.math("n + (n + 1) + (n + 2) = 3n + 1"),
              code: "ALG.LIKE-TERMS.UNLIKE",
              feedback: "The numbers add up to 1 + 2 = 3, not 1.",
            },
            {
              content: A.math("1 + 2 + 3 = 6"),
              feedback: "One example does not show it is always true.",
            },
          ],
          solution: [
            { say: "n + (n + 1) + (n + 2) = 3n + 3 = 3(n + 1), which is 3 times a whole number." },
          ],
        });
      default:
        return p.claim === 0
          ? A.alwaysSometimesNever({
              rng,
              claim: "The sum of two odd numbers is even.",
              truth: "always",
              reasons: [
                {
                  text: "Always. Write the odd numbers as 2a + 1 and 2b + 1: their sum is 2a + 2b + 2 = 2(a + b + 1), which is even.",
                  correct: true,
                },
                { text: "Sometimes. 3 + 5 = 8 is even, but other pairs may not be." },
                { text: "Never. Odd plus odd stays odd.", code: "ALG.LIKE-TERMS.UNLIKE" },
              ],
              solution: [{ say: "(2a + 1) + (2b + 1) = 2(a + b + 1)." }],
            })
          : A.alwaysSometimesNever({
              rng,
              claim: "The product of two consecutive whole numbers is even.",
              truth: "always",
              reasons: [
                {
                  text: "Always. One of n and n + 1 is even, so n(n + 1) has a factor of 2.",
                  correct: true,
                },
                { text: "Sometimes. It depends whether n is even." },
                { text: "Never. n(n + 1) = n² + 1, which is odd.", code: "ALG.LIKE-TERMS.UNLIKE" },
              ],
              solution: [{ say: "Of any two consecutive whole numbers, one is even." }],
            });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") return a.value === `${p.count}n + ${(p.count * (p.count - 1)) / 2}`;
    if (question.archetype === "varied-form") return chosenText(question).endsWith("3(n + 1)");
    return true;
  },
});
