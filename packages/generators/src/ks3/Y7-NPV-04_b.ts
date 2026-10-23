/**
 * @statement Y7-NPV-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-04.b: Write a number as a product of prime factors
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  primes: number[];
}

const product = (xs: number[]) => xs.reduce((a, b) => a * b, 1);
const show = (xs: number[]) => [...xs].sort((a, b) => a - b).join(" \\times ");

export default defineGenerator<Params>({
  id: "Y7-NPV-04.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.FACTOR.NOT-PRIME", "MD.MULTIPLY.ADDS"],

  params(rng) {
    const primes = [2, rng.pick([2, 3]), rng.pick([2, 3, 5]), rng.pick([3, 5, 7])];
    if (product(primes) > 300 || primes.filter((x) => x === 2).length < 2)
      reject("a number up to 300 with 2 × 2 in it");
    return { primes };
  },

  build(p, depth, rng): QuestionDraft {
    const n = product(p.primes);
    const sorted = [...p.primes].sort((a, b) => a - b);
    switch (depth) {
      case 1: {
        const withFour = [4, ...sorted.slice(2)];
        return A.choice({
          rng,
          question: [`Which shows ${n} as a product of prime factors?`],
          correct: A.math(show(sorted)),
          distractors: [
            {
              content: A.math(show(withFour)),
              code: "NPV.FACTOR.NOT-PRIME",
              feedback: "4 is not prime: split it into 2 × 2.",
            },
            {
              content: A.math(`1 \\times ${show(sorted)}`),
              code: "NPV.FACTOR.NOT-PRIME",
              feedback: "1 is not a prime number, so it is not included.",
            },
          ],
          solution: [
            { say: "Divide by primes until you reach 1: ", math: `${n} = ${show(sorted)}` },
          ],
        });
      }
      case 2: {
        const sum = p.primes.reduce((a, b) => a + b, 0);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A number is written as a product of prime factors: ",
                A.math(show(sorted)),
                ".",
              ],
              ask: "What is the number?",
            },
          ],
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "MD.MULTIPLY.ADDS",
              value: A.number(sum),
              feedback: "× means multiply the primes together.",
            },
          ]),
          solution: [{ say: "", math: `${show(sorted)} = ${n}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Ali and Bea both write ${n} as a product of primes, starting with different factor trees. Bea says they must get the same primes.`,
          ],
          truth: true,
          reasons: [
            {
              text: "True. Every whole number greater than 1 has exactly one prime factorisation (apart from the order of the factors).",
              correct: true,
            },
            {
              text: "False. Different factor trees give different primes.",
              code: "NPV.FACTOR.NOT-PRIME",
            },
            { text: "False. One of them may include 1.", code: "NPV.FACTOR.NOT-PRIME" },
          ],
          solution: [{ say: "", math: `${n} = ${show(sorted)}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === show(p.primes);
    if (question.key.depth === 2) return numberAnswer(question) === product(p.primes);
    return true;
  },
});
