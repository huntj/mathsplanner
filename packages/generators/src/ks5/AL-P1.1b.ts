/**
 * @statement AL-P1.1b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P1.1b: Prove by contradiction, e.g. irrationality of √2 and infinitude of primes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  /** Depth 1: prove √k is irrational, for a prime k. */
  k: 2 | 3 | 5;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P1.1b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.PROOF.CONTRADICTION", "ALG.PROOF.EXAMPLES"],

  params(rng) {
    return { k: rng.pick([2, 3, 5] as const), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "Lily proves by contradiction that ",
            A.math(`\\sqrt{${p.k}}`),
            " is irrational.",
          ],
          ask: "What should she assume first?",
          correct: A.math(
            `\\sqrt{${p.k}} = \\frac{a}{b}, \\text{ where } a, b \\text{ are integers with no common factor}`,
          ),
          distractors: [
            {
              content: A.math(`\\sqrt{${p.k}} \\text{ is irrational}`),
              code: "ALG.PROOF.CONTRADICTION",
              feedback:
                "Assume the opposite of what you want to prove, then reach a contradiction.",
            },
            {
              content: A.math(`\\sqrt{${p.k}} = ${Math.sqrt(p.k).toFixed(3)}`),
              code: "ALG.PROOF.EXAMPLES",
              feedback: "A rounded decimal does not help: assume it is a fraction in lowest terms.",
            },
          ],
          solution: [
            {
              say: `Assume √${p.k} = a/b in lowest terms. Then a² = ${p.k}b², so ${p.k} divides a, then ${p.k} divides b too: a contradiction.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question:
            "To prove by contradiction that there are infinitely many prime numbers, what is the first assumption?",
          correct: "There are only finitely many primes, p₁, p₂, …, pₙ.",
          distractors: [
            {
              content: "There are infinitely many primes.",
              code: "ALG.PROOF.CONTRADICTION",
              feedback: "That is what you are trying to prove; assume its opposite.",
            },
            {
              content: "2, 3, 5 and 7 are prime.",
              code: "ALG.PROOF.EXAMPLES",
              feedback: "Examples do not start a proof by contradiction.",
            },
          ],
          solution: [
            {
              say: "Assume finitely many primes; then p₁p₂…pₙ + 1 is not divisible by any of them, which contradicts the list being complete.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? 'In the proof that √2 is irrational, Raj writes: "a² = 2b², so a² is even, so a is even." Raj says this step is valid.'
            : 'In the proof that √2 is irrational, Raj writes: "a² = 2b², so a² is even, so a² is a multiple of 4, so b² is even." Raj says the step "a² is even, so a² is a multiple of 4" needs no further reason.',
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. If a were odd, a² would be odd; so a² even means a is even.",
                  correct: true,
                },
                {
                  text: "False. a² even does not tell you anything about a.",
                  code: "ALG.PROOF.CONTRADICTION",
                },
                { text: "False. You must check some examples first.", code: "ALG.PROOF.EXAMPLES" },
              ]
            : [
                {
                  text: "False. It needs a is even first: then a = 2c and a² = 4c², a multiple of 4.",
                  correct: true,
                },
                { text: "True. Every even number is a multiple of 4.", code: "ALG.PROOF.EXAMPLES" },
                { text: "True. It is obvious from the contradiction." },
              ],
          solution: [
            {
              say: "Each step of a proof must follow from the one before; a² even ⇒ a even ⇒ a = 2c ⇒ a² = 4c².",
            },
          ],
        });
    }
  },

  verify() {
    return true;
  },
});
