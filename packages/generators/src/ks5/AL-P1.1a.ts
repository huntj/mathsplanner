/**
 * @statement AL-P1.1a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P1.1a: Prove by deduction and exhaustion, and disprove by counter-example
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Claim {
  claim: string;
  f: (n: number) => number;
}

const CLAIMS: Claim[] = [
  { claim: "n^2 + n + 1", f: (n) => n * n + n + 1 },
  { claim: "2^n + 1", f: (n) => 2 ** n + 1 },
  { claim: "n^2 - n + 11", f: (n) => n * n - n + 11 },
  { claim: "6n + 1", f: (n) => 6 * n + 1 },
];

const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let k = 2; k * k <= n; k++) if (n % k === 0) return false;
  return true;
};

interface Params {
  claim: number;
  /** Depth 2: (mk + r)² = m(…) + remainder. */
  m: 3 | 4;
  r: number;
  proofSound: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P1.1a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.PROOF.EXAMPLES"],

  params(rng) {
    const m = rng.pick([3, 4] as const);
    return {
      claim: rng.int(0, CLAIMS.length - 1),
      m,
      r: rng.int(1, m - 1),
      proofSound: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const c = CLAIMS[p.claim] ?? (CLAIMS[0] as Claim);
        const ns = Array.from({ length: 40 }, (_, i) => i + 1);
        const counter = ns.find((n) => !isPrime(c.f(n))) ?? 1;
        const primes = ns.filter((n) => n < counter && isPrime(c.f(n))).slice(0, 2);
        return A.choice({
          rng,
          question: [
            "Ana claims that ",
            A.math(c.claim),
            " is prime for every positive integer n.",
          ],
          ask: "Which value of n is a counter-example?",
          correct: A.math(`n = ${counter}`),
          distractors: primes.map((n) => ({
            content: A.math(`n = ${n}`),
            code: "ALG.PROOF.EXAMPLES",
            feedback: `When n = ${n} the value is ${c.f(n)}, which is prime, so it agrees with the claim.`,
          })),
          solution: [
            {
              say: `When n = ${counter}, the value is ${c.f(counter)}, which is not prime. One counter-example disproves the claim.`,
            },
          ],
        });
      }
      case 2: {
        const rem = (p.r * p.r) % p.m;
        const inner = `${p.m}k^2 + ${2 * p.r}k${Math.floor((p.r * p.r) / p.m) ? ` + ${Math.floor((p.r * p.r) / p.m)}` : ""}`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `To prove a result about square numbers by exhaustion, Ben writes n = ${p.m}k + ${p.r} and expands: `,
                A.math(`(${p.m}k + ${p.r})^2 = ${p.m}(${inner}) + r`),
                ".",
              ],
              ask: "What is the value of r?",
            },
          ],
          answer: A.number(rem),
          wrong: [
            {
              code: "ALG.PROOF.EXAMPLES",
              value: A.number(p.r * p.r),
              feedback: `Take out every multiple of ${p.m}: ${p.r * p.r} = ${p.m} × ${Math.floor((p.r * p.r) / p.m)} + ${rem}.`,
            },
          ].filter(() => p.r * p.r !== rem),
          solution: [
            {
              say: "",
              math: `(${p.m}k + ${p.r})^2 = ${p.m * p.m}k^2 + ${2 * p.m * p.r}k + ${p.r * p.r} = ${p.m}(${inner}) + ${rem}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.proofSound
            ? 'To prove that the product of two consecutive integers is even, Kim writes: "n(n + 1): one of n and n + 1 is even, so the product is even." Kim says this is a valid proof.'
            : 'To prove that the product of two consecutive integers is even, Kim writes: "2 × 3 = 6, 5 × 6 = 30 and 10 × 11 = 110 are all even." Kim says this is a valid proof.',
          truth: p.proofSound,
          reasons: p.proofSound
            ? [
                {
                  text: "True. It covers every integer n: whichever of n and n + 1 is even makes the product even.",
                  correct: true,
                },
                {
                  text: "False. A proof needs several worked examples.",
                  code: "ALG.PROOF.EXAMPLES",
                },
                { text: "False. It only works for positive n." },
              ]
            : [
                {
                  text: "False. Examples only show the result for those cases; a proof must work for every integer.",
                  correct: true,
                },
                { text: "True. Three examples are enough.", code: "ALG.PROOF.EXAMPLES" },
                {
                  text: "True. The examples include odd and even numbers.",
                  code: "ALG.PROOF.EXAMPLES",
                },
              ],
          solution: [
            {
              say: "A proof by deduction uses general algebra; checking examples is not a proof unless every case is checked (exhaustion).",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) {
      const c = CLAIMS[p.claim] ?? (CLAIMS[0] as Claim);
      const n = Number(chosenText(question).replace(/[^0-9]/g, ""));
      return !isPrime(c.f(n));
    }
    if (question.key.depth === 2) return numberAnswer(question) === (p.r * p.r) % p.m;
    return true;
  },
});
