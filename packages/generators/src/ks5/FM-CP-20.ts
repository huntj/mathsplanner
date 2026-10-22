/**
 * @statement FM-CP-20
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-20: Integrate using partial fractions with quadratic factors in the denominator
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  A: number;
  B: number;
  C: number;
}

/** A(x² + b) + (Bx + C)(x − a) expanded. */
const numerator = (p: Params) => [p.A + p.B, p.C - p.a * p.B, p.A * p.b - p.a * p.C];

export default defineGenerator<Params>({
  id: "FM-CP-20",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.PARTIAL-QUADRATIC"],

  params(rng) {
    const p = {
      a: rng.int(-4, 4),
      b: rng.int(1, 6),
      A: rng.int(1, 5),
      B: rng.int(-3, 3),
      C: rng.int(-4, 4),
    };
    if (p.a === 0 || p.B === 0 || numerator(p)[0] === 0)
      reject("a non-zero root and a quadratic numerator");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const lin = `(x ${p.a < 0 ? "+" : "-"} ${Math.abs(p.a)})`;
    const quad = `(x^2 + ${p.b})`;
    switch (depth) {
      case 1: {
        const f = A.math(`\\frac{${poly(numerator(p), "x")}}{${lin}${quad}}`);
        const right = `\\frac{A}{${lin.slice(1, -1)}} + \\frac{Bx + C}{x^2 + ${p.b}}`;
        return A.choice({
          rng,
          question: ["Which is the correct form for the partial fractions of ", f, "?"],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`\\frac{A}{${lin.slice(1, -1)}} + \\frac{B}{x^2 + ${p.b}}`),
              code: "CALC.PARTIAL-QUADRATIC",
              feedback: "Over an irreducible quadratic factor the numerator is linear, Bx + C.",
            },
            {
              content: A.math(`\\frac{Ax + B}{${lin.slice(1, -1)}} + \\frac{C}{x^2 + ${p.b}}`),
              code: "CALC.PARTIAL-QUADRATIC",
              feedback:
                "The numerator is one degree lower than its denominator: a constant over the linear factor, Bx + C over the quadratic.",
            },
          ],
          solution: [
            {
              say: "A constant over the linear factor and a linear numerator over the quadratic factor: ",
              math: right,
            },
          ],
        });
      }
      case 2: {
        const N = numerator(p);
        const atA = (N[0] ?? 0) * p.a * p.a + (N[1] ?? 0) * p.a + (N[2] ?? 0);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Given that ",
                A.math(
                  `\\frac{${poly(N, "x")}}{${lin}${quad}} \\equiv \\frac{A}{${lin.slice(1, -1)}} + \\frac{Bx + C}{x^2 + ${p.b}}`,
                ),
                ",",
              ],
              ask: "find the value of A.",
            },
          ],
          answer: A.number(p.A),
          wrong: signedWrongs(p.A, [
            {
              code: "CALC.PARTIAL-QUADRATIC",
              value: A.number(atA),
              feedback: `Substituting x = ${p.a} gives ${atA} = A(${p.a * p.a + p.b}): divide by ${p.a * p.a + p.b}.`,
            },
          ]),
          solution: [
            {
              say: `Multiply through and put x = ${p.a}: `,
              math: `${atA} = A(${p.a}^2 + ${p.b}) \\Rightarrow A = ${p.A}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lee says that ",
            A.math(`\\frac{1}{x(x^2 + ${p.b})} \\equiv \\frac{A}{x} + \\frac{B}{x^2 + ${p.b}}`),
            " for some constants A and B.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. With constants only, 1 ≡ A(x² + ${p.b}) + Bx forces A = 0 and B = 0, and then 1 = 0. Over x² + ${p.b} the numerator must be Bx + C.`,
              correct: true,
            },
            {
              text: "True. Every partial fraction has a constant numerator.",
              code: "CALC.PARTIAL-QUADRATIC",
            },
            { text: "True. Two factors give two constants.", code: "CALC.PARTIAL-QUADRATIC" },
          ],
          solution: [{ say: `1/(x(x² + ${p.b})) = (1/${p.b})/x − (x/${p.b})/(x² + ${p.b}).` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).includes("Bx + C");
    if (question.key.depth === 2) return numberAnswer(question) === p.A;
    return true;
  },
});
