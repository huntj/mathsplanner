/**
 * @statement AL-P5.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P5.2: Use small angle approximations of sin, cos and tan
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  k: number;
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "AL-P5.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SMALL-ANGLE"],

  params(rng) {
    const a = rng.int(2, 7);
    const b = rng.int(2, 7);
    if (a === b) reject("a ratio that is not 1");
    return { k: rng.int(2, 5), a, b };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const c = frac(p.k * p.k, 2);
        return A.standard({
          question: [
            "Given that θ is small, find an approximation for ",
            A.math(`\\cos ${p.k}\\theta`),
            " in terms of θ.",
          ],
          answer: A.exact(`1 - ${toLatex(c)}\\theta^2`),
          wrong: [
            {
              code: "GEO.SMALL-ANGLE",
              value: A.exact(`1 - ${p.k * p.k}\\theta^2`),
              feedback: "cos x ≈ 1 − x²/2: remember to halve.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\cos ${p.k}\\theta \\approx 1 - \\frac{(${p.k}\\theta)^2}{2} = 1 - ${toLatex(c)}\\theta^2`,
            },
          ],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "For small θ, find an approximate value of ",
                A.math(`\\frac{\\sin ${p.a}\\theta}{\\tan ${p.b}\\theta}`),
                ".",
              ],
            },
          ],
          answer: A.exact(frac(p.a, p.b)),
          wrong: [
            {
              code: "GEO.SMALL-ANGLE",
              value: A.exact(frac(p.b, p.a)),
              feedback: `sin ${p.a}θ ≈ ${p.a}θ goes on top and tan ${p.b}θ ≈ ${p.b}θ on the bottom.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{\\sin ${p.a}\\theta}{\\tan ${p.b}\\theta} \\approx \\frac{${p.a}\\theta}{${p.b}\\theta} = ${toLatex(frac(p.a, p.b))}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Cal says sin 2° ≈ 2, using the small angle approximation sin θ ≈ θ.`,
          truth: false,
          reasons: [
            {
              text: "False. The approximation needs θ in radians: 2° = π/90 ≈ 0.0349, so sin 2° ≈ 0.0349.",
              correct: true,
            },
            { text: "True. sin θ ≈ θ for any small angle.", code: "GEO.SMALL-ANGLE" },
            { text: "False. sin 2° ≈ 1 − 2²/2.", code: "GEO.SMALL-ANGLE" },
          ],
          solution: [
            {
              say: "Small angle approximations come from the radian graphs; convert degrees first.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 2) return a?.type === "exact" && a.value === toLatex(frac(p.a, p.b));
    return true;
  },
});
