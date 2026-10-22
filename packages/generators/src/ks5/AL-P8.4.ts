/**
 * @statement AL-P8.4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P8.4: Integrate xⁿ including 1/x, e^(kx), sin kx, cos kx and related functions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  k: number;
  fn: "sin" | "cos";
}

export default defineGenerator<Params>({
  id: "AL-P8.4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.STANDARD-INTEGRAL"],

  params(rng) {
    return { k: rng.int(2, 6), fn: rng.pick(["sin", "cos"] as const) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Find ", A.math(`\\int e^{${p.k}x}\\,dx`), "."],
          answer: A.exact(`\\frac{1}{${p.k}}e^{${p.k}x} + c`),
          wrong: [
            {
              code: "CALC.STANDARD-INTEGRAL",
              value: A.exact(`${p.k}e^{${p.k}x} + c`),
              feedback: `Differentiating e^(${p.k}x) multiplies by ${p.k}, so integrating divides by ${p.k}.`,
            },
          ],
          solution: [
            { say: "", math: `\\int e^{${p.k}x}\\,dx = \\frac{1}{${p.k}}e^{${p.k}x} + c` },
          ],
        });
      case 2: {
        const right =
          p.fn === "sin"
            ? `-\\frac{1}{${p.k}}\\cos(${p.k}x) + c`
            : `\\frac{1}{${p.k}}\\sin(${p.k}x) + c`;
        const slip =
          p.fn === "sin"
            ? `\\frac{1}{${p.k}}\\cos(${p.k}x) + c`
            : `-\\frac{1}{${p.k}}\\sin(${p.k}x) + c`;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Find ", A.math(`\\int \\${p.fn} ${p.k}x\\,dx`), "."] },
            { question: ["Integrate ", A.math(`\\${p.fn} ${p.k}x`), " with respect to x."] },
          ],
          answer: A.exact(right),
          wrong: [
            {
              code: "CALC.STANDARD-INTEGRAL",
              value: A.exact(slip),
              feedback:
                p.fn === "sin"
                  ? "The derivative of cos is −sin, so ∫ sin kx dx = −(1/k) cos kx."
                  : "The derivative of sin is cos, so ∫ cos kx dx = (1/k) sin kx, with no minus.",
            },
          ],
          solution: [{ say: "", math: right }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Isa says ",
            A.math("\\int \\frac{1}{x}\\,dx = \\frac{x^0}{0} + c"),
            ", using the power rule.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The power rule fails for n = −1 (it divides by 0). Instead ∫ 1/x dx = ln|x| + c.",
              correct: true,
            },
            {
              text: "True. Add one to the power and divide by it, as always.",
              code: "CALC.STANDARD-INTEGRAL",
            },
            { text: "False. It is −1/x² + c.", code: "CALC.STANDARD-INTEGRAL" },
          ],
          solution: [{ say: "d/dx ln x = 1/x, so ∫ 1/x dx = ln|x| + c." }],
        });
    }
  },

  verify() {
    return true;
  },
});
