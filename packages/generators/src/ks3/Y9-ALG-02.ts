/**
 * @statement Y9-ALG-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-ALG-02: Simplify expressions involving sums, products and powers, including the laws of indices
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  m: number;
  n: number;
  /** Coefficients for depth 2. */
  a: number;
  b: number;
  op: "times" | "divide" | "power";
  claimTrue: boolean;
}

const pow = (v: string, k: number) => (k === 1 ? v : `${v}^{${k}}`);

export default defineGenerator<Params>({
  id: "Y9-ALG-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INDICES.MULTIPLY"],

  params(rng, numbers) {
    const m = rng.int(2, 9);
    const n = rng.int(2, numbers === "friendly" ? 5 : 9);
    const op = numbers === "friendly" ? "times" : rng.pick(["times", "divide", "power"] as const);
    if (m * n === m + n || (op === "divide" && m <= n) || m === n)
      reject("results that tell the laws apart");
    return { m, n, a: rng.int(2, 9), b: rng.int(2, 9), op, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const law = {
      times: {
        latex: `x^{${p.m}} \\times x^{${p.n}}`,
        power: p.m + p.n,
        slip: p.m * p.n,
        how: `Multiplying powers of the same base: add the indices, ${p.m} + ${p.n} = ${p.m + p.n}.`,
      },
      divide: {
        latex: `x^{${p.m}} \\div x^{${p.n}}`,
        power: p.m - p.n,
        slip: p.m / p.n,
        how: `Dividing powers of the same base: subtract the indices, ${p.m} − ${p.n} = ${p.m - p.n}.`,
      },
      power: {
        latex: `(x^{${p.m}})^{${p.n}}`,
        power: p.m * p.n,
        slip: p.m + p.n,
        how: `A power of a power: multiply the indices, ${p.m} × ${p.n} = ${p.m * p.n}.`,
      },
    }[p.op];
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Simplify ", A.math(law.latex), "."],
          answer: A.exact(pow("x", law.power)),
          wrong:
            Number.isInteger(law.slip) && law.slip !== law.power
              ? [
                  {
                    code: "ALG.INDICES.MULTIPLY",
                    value: A.exact(pow("x", law.slip)),
                    feedback: law.how,
                  },
                ]
              : [],
          solution: [{ say: law.how, math: `${law.latex} = ${pow("x", law.power)}` }],
        });
      case 2: {
        const answer = `${p.a * p.b}${pow("x", p.m + p.n)}`;
        return A.standard({
          question: ["Simplify ", A.math(`${p.a}x^{${p.m}} \\times ${p.b}x^{${p.n}}`), "."],
          answer: A.exact(answer),
          wrong: [
            {
              code: "ALG.INDICES.MULTIPLY",
              value: A.exact(`${p.a * p.b}${pow("x", p.m * p.n)}`),
              feedback: `Multiply the numbers (${p.a} × ${p.b} = ${p.a * p.b}) and add the indices (${p.m} + ${p.n} = ${p.m + p.n}).`,
            },
          ],
          solution: [
            {
              say: `Numbers: ${p.a} × ${p.b} = ${p.a * p.b}. Powers of x: ${p.m} + ${p.n} = ${p.m + p.n}.`,
              math: `= ${answer}`,
            },
          ],
        });
      }
      default: {
        const shown = p.claimTrue ? p.m + p.n : p.m * p.n;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ken says ", A.math(`x^{${p.m}} \\times x^{${p.n}} = x^{${shown}}`), "."],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. x^${p.m} is ${p.m} x's multiplied and x^${p.n} is ${p.n} more, making ${p.m + p.n} x's.`,
                  correct: true,
                },
                { text: "False. Multiply the indices.", code: "ALG.INDICES.MULTIPLY" },
                { text: "False. You cannot multiply powers." },
              ]
            : [
                {
                  text: `False. x^${p.m} × x^${p.n} is ${p.m} x's times ${p.n} x's: ${p.m + p.n} x's, so x^${p.m + p.n}.`,
                  correct: true,
                },
                {
                  text: "True. When you multiply, multiply the indices too.",
                  code: "ALG.INDICES.MULTIPLY",
                },
                { text: "True. The bigger index wins." },
              ],
          solution: [{ say: `x^a × x^b = x^(a+b): x^${p.m} × x^${p.n} = x^${p.m + p.n}.` }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type !== "exact") return question.archetype === "true-or-false-why";
    if (question.key.depth === 2) return a.value === `${p.a * p.b}${pow("x", p.m + p.n)}`;
    const want = { times: p.m + p.n, divide: p.m - p.n, power: p.m * p.n }[p.op];
    return a.value === pow("x", want);
  },
});
