/**
 * @statement GF-A4.g
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GF-A4 sub-statements
 */
// GF-A4.g: Use the laws of indices in algebra
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  m: number;
  n: number;
  a: number;
  b: number;
  kind: number;
}

const power = (coef: number, n: number) => `${coef === 1 ? "" : coef}x^{${n}}`;

export default defineGenerator<Params>({
  id: "GF-A4.g",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INDICES.MULTIPLY", "ALG.INDICES.POWER-ADD", "ALG.INDICES.BRACKET-COEFF"],

  params(rng) {
    const p = {
      m: rng.int(2, 9),
      n: rng.int(2, 6),
      a: rng.int(2, 6),
      b: rng.int(2, 6),
      kind: rng.int(0, 2),
    };
    if (p.m === p.n || p.m + p.n === p.m * p.n)
      reject("adding and multiplying indices give different answers");
    if (p.kind === 2 && (p.m <= p.n || p.m / p.n === p.m - p.n))
      reject("a positive power after dividing, unlike the slip");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = power(1, p.m + p.n);
        return A.standard({
          question: ["Simplify ", A.math(`x^{${p.m}} \\times x^{${p.n}}`), "."],
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.INDICES.MULTIPLY",
              value: A.exact(power(1, p.m * p.n)),
              feedback: "Multiplying powers of the same base adds the indices.",
            },
          ],
          solution: [{ say: "", math: `x^{${p.m} + ${p.n}} = ${right}` }],
        });
      }
      case 2: {
        const [question, right, wrong, feedback, code] =
          p.kind === 0
            ? [
                `\\left(x^{${p.m}}\\right)^{${p.n}}`,
                power(1, p.m * p.n),
                power(1, p.m + p.n),
                "A power of a power multiplies the indices.",
                "ALG.INDICES.POWER-ADD",
              ]
            : p.kind === 1
              ? [
                  `${p.a}x^{${p.m}} \\times ${p.b}x^{${p.n}}`,
                  power(p.a * p.b, p.m + p.n),
                  power(p.a * p.b, p.m * p.n),
                  "Multiply the numbers and add the indices.",
                  "ALG.INDICES.MULTIPLY",
                ]
              : [
                  `${p.a * p.b}x^{${p.m}} \\div ${p.b}x^{${p.n}}`,
                  power(p.a, p.m - p.n),
                  power(p.a, p.m / p.n),
                  "Dividing powers of the same base subtracts the indices.",
                  "ALG.INDICES.MULTIPLY",
                ];
        return A.variedForm({
          rng,
          forms: [{ question: ["Simplify ", A.math(question), "."] }],
          answer: A.exact(right),
          wrong:
            Number.isInteger(p.kind === 2 ? p.m / p.n : 1) || p.kind !== 2
              ? [{ code, value: A.exact(wrong), feedback }]
              : [],
          solution: [{ say: `${feedback} `, math: `${question} = ${right}` }],
        });
      }
      default: {
        const right = power(p.a * p.a, 2 * p.m);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eva says ",
            A.math(`\\left(${p.a}x^{${p.m}}\\right)^2 = ${power(p.a, 2 * p.m)}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Square the number as well: ${p.a}² = ${p.a * p.a}, so it is ${p.a * p.a}x^${2 * p.m}.`,
              correct: true,
            },
            { text: "True. Only the power of x is doubled.", code: "ALG.INDICES.BRACKET-COEFF" },
            { text: `False. It is ${p.a}x^${p.m + 2}.`, code: "ALG.INDICES.POWER-ADD" },
          ],
          solution: [
            {
              say: "",
              math: `\\left(${p.a}x^{${p.m}}\\right)^2 = ${p.a}^2 \\times x^{${2 * p.m}} = ${right}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) return a?.type === "exact" && a.value === power(1, p.m + p.n);
    return true;
  },
});
