/**
 * @statement AL-P8.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P8.3: Evaluate definite integrals and find the area under a curve
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  p: number;
  q: number;
  lo: number;
  hi: number;
  a: number;
}

export default defineGenerator<Params>({
  id: "AL-P8.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.DEFINITE"],

  params(rng) {
    const lo = rng.int(0, 3);
    const hi = rng.int(lo + 1, 6);
    const p = { p: 2 * rng.int(1, 4), q: rng.int(-5, 9), lo, hi, a: rng.int(2, 6) };
    const F = (x: number) => (p.p / 2) * x * x + p.q * x;
    if (p.q === 0 || F(p.hi) - F(p.lo) === 0) reject("a non-zero integral");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const F = (x: number) => (p.p / 2) * x * x + p.q * x;
    switch (depth) {
      case 1: {
        const v = F(p.hi) - F(p.lo);
        return A.standard({
          question: [
            "Evaluate ",
            A.math(`\\int_{${p.lo}}^{${p.hi}} (${poly([p.p, p.q])})\\,dx`),
            ".",
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "CALC.DEFINITE",
              value: A.number(-v),
              feedback: "Subtract the value at the lower limit from the value at the upper limit.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\left[${poly([p.p / 2, p.q, 0])}\\right]_{${p.lo}}^{${p.hi}} = ${F(p.hi)} - ${F(p.lo) < 0 ? `(${F(p.lo)})` : F(p.lo)} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const area = frac(p.a ** 3, 6);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the area enclosed by the curve ",
                A.math(`y = x(x - ${p.a})`),
                " and the x-axis.",
              ],
            },
            {
              question: [
                "The curve ",
                A.math(`y = x^2 - ${p.a}x`),
                " and the x-axis enclose a region.",
              ],
              ask: "Find its area.",
            },
          ],
          answer: A.exact(area),
          wrong: [
            {
              code: "CALC.DEFINITE",
              value: A.exact(area.neg()),
              feedback:
                "The region is below the x-axis, so the integral is negative; the area is its size.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\int_0^{${p.a}} (x^2 - ${p.a}x)\\,dx = -${toLatex(area)} \\Rightarrow \\text{area} = ${toLatex(area)}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Max finds ",
            A.math("\\int_{-1}^{1} x^3\\,dx = 0"),
            " and says the area between the curve and the x-axis from −1 to 1 is 0.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The part below the axis gives a negative integral that cancels the part above. The area is ¼ + ¼ = ½.",
              correct: true,
            },
            { text: "True. The definite integral is the area.", code: "CALC.DEFINITE" },
            { text: "True. The curve passes through the origin." },
          ],
          solution: [
            {
              say: "Split the integral where the curve crosses the axis and add the sizes of the parts.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const F = (x: number) => (p.p / 2) * x * x + p.q * x;
    if (question.key.depth === 1) return numberAnswer(question) === F(p.hi) - F(p.lo);
    return true;
  },
});
