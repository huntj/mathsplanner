/**
 * @statement FM-FP2-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP2-06: Derive and use reduction formulae; find arc lengths and surface areas of revolution
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { linear } from "../shared/alg.ts";
import { exactAnswer } from "../shared/counting.ts";

export interface Params {
  n: number;
  m: number;
}

/** Iₙ = ∫₀¹ xⁿeˣ dx = e − nIₙ₋₁ as a + be, from I₀ = e − 1. With `slip`, Iₙ = e + nIₙ₋₁. */
function reduce(n: number, slip = false): string {
  let [a, b] = [-1, 1];
  for (let k = 1; k <= n; k++) [a, b] = slip ? [k * a, 1 + k * b] : [-k * a, 1 - k * b];
  return linear([
    [b, "e"],
    [a, ""],
  ]);
}

export default defineGenerator<Params>({
  id: "FM-FP2-06",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.REDUCTION", "CALC.ARC-LENGTH"],

  params(rng) {
    return { n: rng.int(2, 4), m: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Let ",
            A.math("I_n = \\int_0^1 x^n e^x\\,dx"),
            ". Integration by parts gives ",
            A.math("I_n = e - nI_{n-1}"),
            ", and ",
            A.math("I_0 = e - 1"),
            ".",
          ],
          ask: ["Find ", A.math(`I_${p.n}`), " in terms of e."],
          answer: A.exact(reduce(p.n)),
          wrong: [
            {
              code: "CALC.REDUCTION",
              value: A.exact(reduce(p.n, true)),
              feedback: "Iₙ = e − nIₙ₋₁: subtract, then expand the brackets carefully.",
            },
          ],
          solution: Array.from({ length: p.n }, (_, i) => ({
            say: "",
            math: `I_${i + 1} = e - ${i + 1}(${reduce(i)}) = ${reduce(i + 1)}`,
          })),
        });
      case 2: {
        // y = (2/3)x^(3/2) from 0 to b = m² − 1: ∫√(1 + x) dx = (2/3)(m³ − 1)
        const b = p.m * p.m - 1;
        const v = toLatex(frac(2 * (p.m ** 3 - 1), 3));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the exact length of the curve ",
                A.math("y = \\frac{2}{3}x^{\\frac{3}{2}}"),
                " from ",
                A.math("x = 0"),
                " to ",
                A.math(`x = ${b}`),
                ".",
              ],
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "CALC.ARC-LENGTH",
              value: A.exact(toLatex(frac(2 * b + b * b, 2))),
              feedback: "The arc length is ∫√(1 + (dy/dx)²) dx: keep the square root.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{dy}{dx} = \\sqrt{x}, \\quad \\int_0^{${b}} \\sqrt{1 + x}\\,dx = \\frac{2}{3}\\left[(1 + x)^{\\frac{3}{2}}\\right]_0^{${b}} = \\frac{2}{3}(${p.m ** 3} - 1) = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mia says the length of a curve from x = a to x = b is ",
            A.math("\\int_a^b \\sqrt{1 + y^2}\\,dx"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A small piece has length √(δx² + δy²) = √(1 + (dy/dx)²) δx, so the integrand uses the gradient dy/dx, not y.",
              correct: true,
            },
            { text: "True. Arc length uses the height of the curve.", code: "CALC.ARC-LENGTH" },
            { text: "False. It is ∫(1 + y²) dx, with no square root.", code: "CALC.ARC-LENGTH" },
          ],
          solution: [{ say: "s = ∫√(1 + (dy/dx)²) dx." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === reduce(p.n);
    if (question.key.depth === 2)
      return exactAnswer(question) === toLatex(frac(2 * (p.m ** 3 - 1), 3));
    return true;
  },
});
