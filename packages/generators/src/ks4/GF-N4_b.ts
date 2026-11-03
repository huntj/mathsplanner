/**
 * @statement GF-N4.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N4.b: Write a number as a product of prime factors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

const BASES = [2, 3, 5, 7];

interface Params {
  /** Powers of 2, 3, 5 and 7. */
  e: number[];
}

const value = (e: number[]) => e.reduce((v, k, i) => v * (BASES[i] ?? 1) ** k, 1);
const product = (e: number[]) =>
  e
    .map((k, i) => (k === 0 ? "" : k === 1 ? String(BASES[i]) : `${BASES[i]}^{${k}}`))
    .filter(Boolean)
    .join(" \\times ");

export default defineGenerator<Params>({
  id: "GF-N4.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.FACTOR.NOT-PRIME", "NPV.POWER.TIMES-INDEX"],

  params(rng) {
    const e = [rng.int(2, 4), rng.int(0, 2), rng.int(0, 1), rng.int(0, 1)];
    if (value(e) > 600 || e.filter((k) => k > 0).length < 2)
      reject("a number up to 600 with two or more different primes");
    return { e };
  },

  build(p, depth, rng): QuestionDraft {
    const n = value(p.e);
    const right = product(p.e);
    switch (depth) {
      case 1: {
        const four = [
          p.e[0] === 2 ? "4" : `4 \\times ${p.e[0] === 3 ? "2" : `2^{${(p.e[0] ?? 2) - 2}}`}`,
          product([0, ...p.e.slice(1)]),
        ]
          .filter(Boolean)
          .join(" \\times ");
        return A.choice({
          rng,
          question: [`Which shows ${n} as a product of prime factors?`],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(four),
              code: "NPV.FACTOR.NOT-PRIME",
              feedback: "4 is not prime: split it into 2 × 2.",
            },
            {
              content: A.math(product([(p.e[0] ?? 2) + 1, ...p.e.slice(1)])),
              feedback: `Multiply it out: it gives ${2 * n}, not ${n}.`,
            },
          ],
          solution: [
            {
              say: "Keep dividing by primes until every factor is prime: ",
              math: `${n} = ${right}`,
            },
          ],
        });
      }
      case 2: {
        const times = p.e.reduce(
          (v, k, i) => v * (k === 0 ? 1 : k === 1 ? (BASES[i] ?? 1) : (BASES[i] ?? 1) * k),
          1,
        );
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["A number is written as ", A.math(right), "."],
              ask: "What is the number?",
            },
          ],
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "NPV.POWER.TIMES-INDEX",
              value: A.number(times),
              feedback: `${BASES[0]}^${p.e[0]} means ${BASES[0]} multiplied by itself ${p.e[0]} times.`,
            },
          ]),
          solution: [{ say: "", math: `${right} = ${n}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Max says ",
                A.math(`${right} \\times 1`),
                ` is ${n} written as a product of prime factors.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. 1 is not a prime number, so it is left out: ${n} = ${right.replace(/\^\{(\d)\}/g, "^$1").replace(/\\times/g, "×")}.`,
                  correct: true,
                },
                {
                  text: "True. Multiplying by 1 does not change the value.",
                  code: "NPV.FACTOR.NOT-PRIME",
                },
                { text: "True. 1 is a prime number.", code: "NPV.FACTOR.NOT-PRIME" },
              ],
              solution: [{ say: "A prime has exactly two factors; 1 has only one." }],
            }),
          [
            {
              statement: "Leo says $60 = 2^2 \\times 3 \\times 5$.",
              truth: true,
              right: "True. 4 × 3 × 5 = 60, and 2, 3 and 5 are prime.",
              wrong: [
                ["False. It is 6 × 10.", "NPV.FACTOR.NOT-PRIME"],
                ["False. 2² means 2 × 2 × 2.", "NPV.POWER.TIMES-INDEX"],
              ],
            },
            {
              claim: "A number has exactly one product of prime factors, apart from the order.",
              truth: "always",
              right: "Always. This is the fundamental theorem of arithmetic.",
              wrong: [
                ["Sometimes. 12 = 2 × 6 or 3 × 4.", "NPV.FACTOR.NOT-PRIME"],
                ["Never. There are many ways."],
              ],
            },
            {
              statement: "Mia writes 18 as a product of prime factors as $2 \\times 9$.",
              truth: false,
              right: "False. 9 is not prime: 18 = 2 × 3².",
              wrong: [
                ["True. 2 × 9 = 18.", "NPV.FACTOR.NOT-PRIME"],
                ["True. Any factor pair will do."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === product(p.e);
    if (question.key.depth === 2) return numberAnswer(question) === value(p.e);
    return true;
  },
});
