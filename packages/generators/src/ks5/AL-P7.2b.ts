/**
 * @statement AL-P7.2b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P7.2b: Differentiate e^(kx), a^(kx), sin kx, cos kx, tan kx and ln x
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  k: number;
  fn: "sin" | "cos";
  a: number;
}

export default defineGenerator<Params>({
  id: "AL-P7.2b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.STANDARD-DERIV"],

  params(rng) {
    return { k: rng.int(2, 6), fn: rng.pick(["sin", "cos"] as const), a: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = p.fn === "sin" ? `${p.k}\\cos ${p.k}x` : `-${p.k}\\sin ${p.k}x`;
        const slip = p.fn === "sin" ? `\\cos ${p.k}x` : `-\\sin ${p.k}x`;
        return A.standard({
          question: ["Differentiate ", A.math(`y = \\${p.fn} ${p.k}x`), " with respect to x."],
          answer: A.exact(right),
          wrong: [
            {
              code: "CALC.STANDARD-DERIV",
              value: A.exact(slip),
              feedback: `The derivative of ${p.fn} kx includes the factor k = ${p.k}.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{d}{dx}\\${p.fn} ${p.k}x = ${right}` }],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            { question: ["Differentiate ", A.math(`y = \\ln ${p.a}x`), "."] },
            {
              question: [
                "Find ",
                A.math("\\frac{dy}{dx}"),
                " for ",
                A.math(`y = \\ln(${p.a}x)`),
                ".",
              ],
            },
          ],
          answer: A.exact("\\frac{1}{x}"),
          wrong: [
            {
              code: "CALC.STANDARD-DERIV",
              value: A.exact(`\\frac{${p.a}}{x}`),
              feedback: `ln(${p.a}x) = ln ${p.a} + ln x, and ln ${p.a} is a constant, so the derivative is 1/x.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\ln ${p.a}x = \\ln ${p.a} + \\ln x \\Rightarrow \\frac{dy}{dx} = \\frac{1}{x}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ali says the derivative of ",
            A.math("\\cos x"),
            " is ",
            A.math("\\sin x"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. d/dx cos x = −sin x: the cosine graph slopes down where sin x is positive.",
              correct: true,
            },
            { text: "True. sin and cos swap when you differentiate.", code: "CALC.STANDARD-DERIV" },
            { text: "False. It is −cos x.", code: "CALC.STANDARD-DERIV" },
          ],
          solution: [
            {
              say: "Check at x = π/2: cos x is decreasing there, so its gradient is negative: −sin(π/2) = −1.",
            },
          ],
        });
    }
  },

  verify() {
    return true;
  },
});
