/**
 * @statement CM-SG7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-SG7: Use sequences given by nth-term formulae and by xₙ₊₁ = f(xₙ), including Fibonacci and the golden
// ratio
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  k: number;
  c: number;
  x1: number;
  a: number;
  b: number;
}

const iterate = (p: Params, n: number) => {
  let x = p.x1;
  for (let i = 1; i < n; i++) x = p.k * x + p.c;
  return x;
};
const fib = (p: Params, n: number) => {
  let [u, v] = [p.a, p.b];
  for (let i = 2; i < n; i++) [u, v] = [v, u + v];
  return n === 1 ? p.a : v;
};

export default defineGenerator<Params>({
  id: "CM-SG7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.POSITION-RULE"],

  params(rng) {
    return {
      k: rng.pick([2, 3, -2]),
      c: rng.int(-5, 5) || 1,
      x1: rng.int(1, 6),
      a: rng.int(1, 9),
      b: rng.int(1, 9),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = iterate(p, 4);
        return A.standard({
          question: [
            "A sequence has ",
            A.math(`x_1 = ${p.x1}`),
            " and ",
            A.math(
              `x_{n+1} = ${linear([
                [p.k, "x_n"],
                [p.c, ""],
              ])}`,
            ),
            ".",
          ],
          ask: ["Find ", A.math("x_4"), "."],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(iterate(p, 3)),
              feedback: "That is x₃. From x₁, apply the rule three times to reach x₄.",
            },
          ]),
          solution: [{ say: `x₂ = ${iterate(p, 2)}, x₃ = ${iterate(p, 3)}, x₄ = ${v}.` }],
        });
      }
      case 2: {
        const v = fib(p, 6);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A Fibonacci-type sequence starts ${p.a}, ${p.b}, and each term after that is the sum of the two before it.`,
              ],
              ask: "Find the 6th term.",
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(fib(p, 5)),
              feedback: "That is the 5th term. Count the two starting terms as the 1st and 2nd.",
            },
          ]),
          solution: [{ say: `${[1, 2, 3, 4, 5, 6].map((n) => fib(p, n)).join(", ")}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kai says the ratio of consecutive Fibonacci numbers (1, 1, 2, 3, 5, 8, …) gets closer and closer to 2.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The ratios 2, 1.5, 1.67, 1.6, 1.625, … approach the golden ratio (1 + √5)/2 ≈ 1.618.",
              correct: true,
            },
            {
              text: "True. Each term is about double the one before.",
              code: "ALG.SEQUENCE.POSITION-RULE",
            },
            {
              text: "True. The first ratio is 2, so they all are.",
              code: "ALG.SEQUENCE.POSITION-RULE",
            },
          ],
          solution: [{ say: "Work out a few ratios: 13/8 = 1.625, 21/13 ≈ 1.615, 34/21 ≈ 1.619." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === iterate(p, 4);
    if (question.key.depth === 2) return numberAnswer(question) === fib(p, 6);
    return true;
  },
});
