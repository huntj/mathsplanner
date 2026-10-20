/**
 * @statement Y7-NPV-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-NPV-04: Use the concepts and vocabulary of prime numbers, factors, multiples, common factors,
// common multiples, HCF, LCM and prime factorisation, including product notation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, gcd, lcm, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  kind: "HCF" | "LCM";
  /** Exponents of 2, 3, 5 and 7 in the number to factorise. */
  exps: [number, number, number, number];
  claim: number;
}

const PRIMES = [2, 3, 5, 7];
const product = (exps: readonly number[]) => exps.reduce((n, e, i) => n * (PRIMES[i] ?? 1) ** e, 1);
const indexForm = (exps: readonly number[]) =>
  exps
    .map((e, i) => (e === 0 ? "" : e === 1 ? String(PRIMES[i]) : `${PRIMES[i]}^{${e}}`))
    .filter(Boolean)
    .join(" \\times ");

export default defineGenerator<Params>({
  id: "Y7-NPV-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.FACTOR.LCM-PRODUCT", "NPV.FACTOR.HCF-LCM", "NPV.FACTOR.NOT-PRIME"],

  params(rng, numbers) {
    const g = rng.int(2, numbers === "friendly" ? 4 : 9);
    const x = rng.int(2, numbers === "stretch" ? 11 : 7);
    const y = rng.int(2, numbers === "stretch" ? 11 : 7);
    if (x === y || Number(gcd(BigInt(x), BigInt(y))) !== 1)
      reject("x and y must be coprime and different");
    const exps: [number, number, number, number] = [
      rng.int(2, 4),
      rng.int(0, 2),
      rng.int(0, 1),
      numbers === "friendly" ? 0 : rng.int(0, 1),
    ];
    if (exps.filter((e) => e > 0).length < 2 || product(exps) > 2000)
      reject("need at least two primes, not too big");
    return {
      a: g * x,
      b: g * y,
      kind: rng.pick(["HCF", "LCM"] as const),
      exps,
      claim: rng.int(0, 2),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const h = Number(gcd(BigInt(p.a), BigInt(p.b)));
    const l = Number(lcm(BigInt(p.a), BigInt(p.b)));
    switch (depth) {
      case 1: {
        const answer = p.kind === "HCF" ? h : l;
        return A.standard({
          question: ["Two numbers are ", A.math(`${p.a}`), " and ", A.math(`${p.b}`), "."],
          ask:
            p.kind === "HCF"
              ? "Find their highest common factor (HCF)."
              : "Find their lowest common multiple (LCM).",
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "NPV.FACTOR.HCF-LCM",
              value: A.number(p.kind === "HCF" ? l : h),
              feedback:
                p.kind === "HCF"
                  ? "That is the lowest common multiple. The HCF is the biggest number that divides both."
                  : "That is the highest common factor. The LCM is the smallest number both divide into.",
            },
            ...(p.kind === "LCM"
              ? [
                  {
                    code: "NPV.FACTOR.LCM-PRODUCT",
                    value: A.number(p.a * p.b),
                    feedback: `${p.a} × ${p.b} is a common multiple, but they share the factor ${h}, so there is a smaller one.`,
                  },
                ]
              : []),
          ]),
          solution:
            p.kind === "HCF"
              ? [
                  {
                    say: `The factors that ${p.a} and ${p.b} share include ${h}, and none is bigger. HCF = ${h}.`,
                  },
                ]
              : [
                  {
                    say: `Multiples of ${p.a}: ${[1, 2, 3, 4].map((k) => k * p.a).join(", ")}, … The first that is also a multiple of ${p.b} is ${l}.`,
                  },
                ],
        });
      }
      case 2: {
        const n = product(p.exps);
        const right = indexForm(p.exps);
        // 2 × 2 written as 4: the same value, but 4 is not prime.
        const notPrime = ["4", indexForm([p.exps[0] - 2, p.exps[1], p.exps[2], p.exps[3]])]
          .filter(Boolean)
          .join(" \\times ");
        const withOne = `1 \\times ${right}`;
        const bumped = indexForm([p.exps[0], p.exps[1] + 1, p.exps[2], p.exps[3]]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Write ",
            A.math(String(n)),
            " as a product of its prime factors, in index form.",
          ],
          ask: "Which is correct?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(notPrime),
              code: "NPV.FACTOR.NOT-PRIME",
              feedback: "4 is not prime: split it into 2 × 2.",
            },
            {
              content: A.math(withOne),
              code: "NPV.FACTOR.NOT-PRIME",
              feedback: "1 is not a prime number, so it does not belong in a prime factorisation.",
            },
            {
              content: A.math(bumped),
              feedback: `Multiply it out: that makes ${product([p.exps[0], p.exps[1] + 1, p.exps[2], p.exps[3]])}, not ${n}.`,
            },
          ],
          solution: [
            {
              say: `Keep dividing by primes: ${n} = ${right.replace(/\\times/g, "×").replace(/\^\{(\d+)\}/g, "^$1")}.`,
            },
          ],
        });
      }
      default: {
        const claims = [
          {
            claim: "The lowest common multiple of two numbers is their product.",
            truth: "sometimes" as const,
            reasons: [
              {
                text: `Only when they share no factor but 1. ${p.a} and ${p.b} share ${h}, so their LCM is ${l}, not ${p.a * p.b}.`,
                correct: true,
              },
              { text: "Always: multiply them to find the LCM.", code: "NPV.FACTOR.LCM-PRODUCT" },
              {
                text: "Never: the LCM is always smaller than both numbers.",
                code: "NPV.FACTOR.HCF-LCM",
              },
            ],
          },
          {
            claim: "A prime number is odd.",
            truth: "sometimes" as const,
            reasons: [
              { text: "2 is prime and even; every other prime is odd.", correct: true },
              { text: "Always: even numbers can be divided by 2." },
              { text: "Never: 9 is odd but not prime." },
            ],
          },
          {
            claim: "The HCF of two numbers is bigger than their LCM.",
            truth: "never" as const,
            reasons: [
              {
                text: "The HCF divides both numbers and the LCM is a multiple of both, so the HCF is never bigger.",
                correct: true,
              },
              { text: "Sometimes: it depends on the numbers.", code: "NPV.FACTOR.HCF-LCM" },
              { text: "Always: 'highest' beats 'lowest'.", code: "NPV.FACTOR.HCF-LCM" },
            ],
          },
        ];
        const c = claims[p.claim] ?? claims[0];
        if (!c) return reject("no claim");
        return A.alwaysSometimesNever({
          rng,
          claim: c.claim,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const [a, b] = [BigInt(p.a), BigInt(p.b)];
      return numberAnswer(question) === Number(p.kind === "HCF" ? gcd(a, b) : lcm(a, b));
    }
    if (question.archetype === "varied-form") {
      // The chosen factorisation multiplies back to the number and uses only primes.
      const factors = chosenText(question)
        .split("\\times")
        .map((t) => t.trim());
      const value = factors.reduce((v, t) => {
        const [base = "1", exp = "1"] = t.replace(/[{}]/g, "").split("^");
        return v * Number(base) ** Number(exp);
      }, 1);
      return (
        value === product(p.exps) && factors.every((t) => PRIMES.includes(Number(t.split("^")[0])))
      );
    }
    return true;
  },
});
