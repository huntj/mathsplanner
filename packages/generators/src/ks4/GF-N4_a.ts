/**
 * @statement GF-N4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N4.a: Use primes, factors and multiples
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

const PRIMES = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const ODD_COMPOSITES = [21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93];
const NUMBERS = [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 60];

const smallest = (n: number) => {
  for (let k = 2; k < n; k++) if (n % k === 0) return k;
  return n;
};

interface Params {
  prime: number;
  c1: number;
  c2: number;
  n: number;
  f: number;
  g: number;
}

export default defineGenerator<Params>({
  id: "GF-N4.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.FACTOR.NOT-PRIME", "NPV.FACTOR.MULTIPLE-MIXUP"],

  params(rng) {
    const n = rng.pick(NUMBERS);
    const factors = [];
    for (let k = 2; k < n; k++) if (n % k === 0) factors.push(k);
    const p = {
      prime: rng.pick(PRIMES),
      c1: rng.pick(ODD_COMPOSITES),
      c2: rng.pick(ODD_COMPOSITES),
      n,
      f: rng.pick(factors),
      g: rng.int(n + 1, 2 * n - 1),
    };
    if (p.c1 === p.c2) reject("two different composites");
    if (n % p.g === 0 || p.g % n === 0) reject("a number that is neither a factor nor a multiple");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Which of these is a prime number?"],
          correct: A.math(String(p.prime)),
          distractors: [p.c1, p.c2].map((c) => ({
            content: A.math(String(c)),
            code: "NPV.FACTOR.NOT-PRIME",
            feedback: `${c} = ${smallest(c)} × ${c / smallest(c)}, so it is not prime.`,
          })),
          solution: [{ say: `${p.prime} has exactly two factors, 1 and ${p.prime}.` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`Which of these is a factor of ${p.n}?`],
          correct: A.math(String(p.f)),
          distractors: [
            {
              content: A.math(String(2 * p.n)),
              code: "NPV.FACTOR.MULTIPLE-MIXUP",
              feedback: `${2 * p.n} is a multiple of ${p.n}. A factor divides into ${p.n} exactly.`,
            },
            { content: A.math(String(p.g)), feedback: `${p.n} ÷ ${p.g} is not a whole number.` },
          ],
          solution: [{ say: `${p.n} ÷ ${p.f} = ${p.n / p.f}, a whole number.` }],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The sum of two prime numbers is even."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. Two odd primes add to an even number, like 3 + 5 = 8, but 2 is prime and 2 + 3 = 5 is odd.",
              correct: true,
            },
            { text: "Always. All prime numbers are odd.", code: "NPV.FACTOR.NOT-PRIME" },
            { text: "Never. Primes cannot add to an even number." },
          ],
          solution: [{ say: "2 is the only even prime." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === String(p.prime);
    if (question.key.depth === 2) return p.n % Number(chosenText(question)) === 0;
    return true;
  },
});
