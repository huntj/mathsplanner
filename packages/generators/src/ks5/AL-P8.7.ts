/**
 * @statement AL-P8.7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P8.7: Integrate by substitution and by parts
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  k: number;
  a: number;
  n: number;
}

export default defineGenerator<Params>({
  id: "AL-P8.7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.PARTS", "CALC.SUBSTITUTION"],

  params(rng) {
    return { k: rng.int(2, 5), a: rng.int(1, 9), n: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Use integration by parts to find ", A.math(`\\int xe^{${p.k}x}\\,dx`), "."],
          answer: A.exact(`\\frac{x}{${p.k}}e^{${p.k}x} - \\frac{1}{${p.k * p.k}}e^{${p.k}x} + c`),
          wrong: [
            {
              code: "CALC.PARTS",
              value: A.exact(`\\frac{x}{${p.k}}e^{${p.k}x} + c`),
              feedback: "∫ u dv = uv − ∫ v du: you still need to subtract ∫ (1/k)e^(kx) dx.",
            },
          ],
          solution: [
            {
              say: `u = x, dv/dx = e^(${p.k}x): `,
              math: `\\frac{x}{${p.k}}e^{${p.k}x} - \\int \\frac{1}{${p.k}}e^{${p.k}x}\\,dx = \\frac{x}{${p.k}}e^{${p.k}x} - \\frac{1}{${p.k * p.k}}e^{${p.k}x} + c`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Use the substitution ",
                A.math(`u = x^2 + ${p.a}`),
                " to find ",
                A.math(`\\int 2x(x^2 + ${p.a})^${p.n}\\,dx`),
                ".",
              ],
            },
          ],
          answer: A.exact(`\\frac{(x^2 + ${p.a})^{${p.n + 1}}}{${p.n + 1}} + c`),
          wrong: [
            {
              code: "CALC.SUBSTITUTION",
              value: A.exact(`\\frac{x^2(x^2 + ${p.a})^{${p.n + 1}}}{${p.n + 1}} + c`),
              feedback: "du = 2x dx replaces the 2x dx entirely: integrate uⁿ du.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\int u^{${p.n}}\\,du = \\frac{u^{${p.n + 1}}}{${p.n + 1}} + c = \\frac{(x^2 + ${p.a})^{${p.n + 1}}}{${p.n + 1}} + c`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "To find ",
            A.math("\\int x\\ln x\\,dx"),
            " by parts, Kim chooses ",
            A.math("u = x"),
            " and ",
            A.math("\\frac{dv}{dx} = \\ln x"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. ln x is hard to integrate but easy to differentiate, so choose u = ln x and dv/dx = x.",
              correct: true,
            },
            { text: "True. Always choose u = x.", code: "CALC.PARTS" },
            { text: "True. Either choice works equally well.", code: "CALC.PARTS" },
          ],
          solution: [
            { say: "Pick u so that du/dx is simpler and dv/dx so that v is easy to find." },
          ],
        });
    }
  },

  verify() {
    return true;
  },
});
