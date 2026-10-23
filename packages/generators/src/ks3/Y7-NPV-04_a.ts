/**
 * @statement Y7-NPV-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-04.a: Use primes, factors and multiples
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const NUMBERS = [12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48];
const factorCount = (n: number) =>
  Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0).length;

interface Params {
  k: number;
  m: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-04.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.FACTOR.MULTIPLE-MIXUP", "NPV.LISTING.INCOMPLETE", "NPV.FACTOR.NOT-PRIME"],

  params(rng) {
    const p = { k: rng.int(6, 15), m: rng.int(3, 9), n: rng.pick(NUMBERS) };
    if ([2, 3, 4, 5].every((d) => p.k % d !== 0)) reject("a number with a small factor");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const factor = [2, 3, 4, 5].find((d) => p.k % d === 0) ?? 2;
        return A.choice({
          rng,
          question: [`Which of these is a multiple of ${p.k}?`],
          correct: A.math(String(p.k * p.m)),
          distractors: [
            {
              content: A.math(String(factor)),
              code: "NPV.FACTOR.MULTIPLE-MIXUP",
              feedback: `${factor} is a factor of ${p.k}. Multiples of ${p.k} are in its times table.`,
            },
            {
              content: A.math(String(p.k * p.m + 1)),
              feedback: `${p.k * p.m + 1} is not in the ${p.k} times table.`,
            },
          ],
          solution: [{ say: "", math: `${p.k} \\times ${p.m} = ${p.k * p.m}` }],
        });
      }
      case 2: {
        const v = factorCount(p.n);
        return A.variedForm({
          rng,
          forms: [
            { question: [`How many factors does ${p.n} have?`] },
            {
              question: [`${p.n} sweets are shared equally into bags, with none left over.`],
              ask: "How many different numbers of bags are possible (including 1 bag and one sweet per bag)?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.LISTING.INCOMPLETE",
              value: A.number(v - 2),
              feedback: `Include 1 and ${p.n} itself. List the factors in pairs so none are missed.`,
            },
          ]),
          solution: [
            {
              say:
                "Factor pairs: " +
                Array.from({ length: p.n }, (_, i) => i + 1)
                  .filter((d) => p.n % d === 0 && d * d <= p.n)
                  .map((d) => `${d} × ${p.n / d}`)
                  .join(", ") +
                `, so ${v} factors.`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["An odd number is prime."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. 7 and 13 are prime, but 9 = 3 × 3 and 15 = 3 × 5 are odd and not prime.",
              correct: true,
            },
            { text: "Always. Only even numbers can be divided.", code: "NPV.FACTOR.NOT-PRIME" },
            { text: "Never. 2 is the only prime." },
          ],
          solution: [{ say: "A prime has exactly two factors: 1 and itself." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === String(p.k * p.m);
    if (question.key.depth === 2) return numberAnswer(question) === factorCount(p.n);
    return true;
  },
});
