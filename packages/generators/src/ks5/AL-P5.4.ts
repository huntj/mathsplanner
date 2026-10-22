/**
 * @statement AL-P5.4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P5.4: Use sec, cosec, cot, arcsin, arccos and arctan, with graphs, domains and ranges
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";

/** sec, cosec and cot at 30°, 45° and 60°, with the value a sec↔cosec swap would give. */
const CASES = [
  { fn: "sec", angle: 60, value: "2", swap: "\\frac{2\\sqrt{3}}{3}" },
  { fn: "sec", angle: 30, value: "\\frac{2\\sqrt{3}}{3}", swap: "2" },
  { fn: "sec", angle: 45, value: "\\sqrt{2}", swap: "\\frac{\\sqrt{2}}{2}" },
  { fn: "cosec", angle: 30, value: "2", swap: "\\frac{2\\sqrt{3}}{3}" },
  { fn: "cosec", angle: 60, value: "\\frac{2\\sqrt{3}}{3}", swap: "2" },
  { fn: "cot", angle: 60, value: "\\frac{\\sqrt{3}}{3}", swap: "\\sqrt{3}" },
  { fn: "cot", angle: 30, value: "\\sqrt{3}", swap: "\\frac{\\sqrt{3}}{3}" },
] as const;

interface Params {
  c: number;
  inverse: "arcsin" | "arccos";
}

export default defineGenerator<Params>({
  id: "AL-P5.4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.RECIPROCAL-TRIG", "ALG.FUNCTION.DOMAIN-RANGE"],

  params(rng) {
    return { c: rng.int(0, CASES.length - 1), inverse: rng.pick(["arcsin", "arccos"] as const) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const c = CASES[p.c] ?? (CASES[0] as (typeof CASES)[number]);
        const what = c.fn === "sec" ? "1/cos" : c.fn === "cosec" ? "1/sin" : "1/tan";
        return A.standard({
          question: [
            "Find the exact value of ",
            A.math(
              `\\${c.fn === "cosec" ? "csc" : c.fn} ${c.angle}^\\circ`.replace(
                "\\csc",
                "\\operatorname{cosec}",
              ),
            ),
            ".",
          ],
          answer: A.exact(c.value),
          wrong: [
            {
              code: "GEO.RECIPROCAL-TRIG",
              value: A.exact(c.swap),
              feedback: `${c.fn} x = ${what} x.`,
            },
          ],
          solution: [{ say: `${c.fn} ${c.angle}° = ${what} ${c.angle}°: `, math: c.value }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["What is the range of ", A.math(`y = \\${p.inverse} x`), "?"],
          correct: A.math(
            p.inverse === "arcsin"
              ? "-\\frac{\\pi}{2} \\le y \\le \\frac{\\pi}{2}"
              : "0 \\le y \\le \\pi",
          ),
          distractors: [
            {
              content: A.math("-1 \\le y \\le 1"),
              code: "ALG.FUNCTION.DOMAIN-RANGE",
              feedback: `That is the domain of ${p.inverse}; its outputs are angles.`,
            },
            {
              content: A.math(
                p.inverse === "arcsin"
                  ? "0 \\le y \\le \\pi"
                  : "-\\frac{\\pi}{2} \\le y \\le \\frac{\\pi}{2}",
              ),
              code: "ALG.FUNCTION.DOMAIN-RANGE",
              feedback:
                p.inverse === "arcsin"
                  ? "arcsin uses the part of sin from −π/2 to π/2."
                  : "arccos uses the part of cos from 0 to π.",
            },
          ],
          solution: [
            {
              say:
                p.inverse === "arcsin"
                  ? "sin is one-to-one on −π/2 ≤ x ≤ π/2, so arcsin gives angles in that range."
                  : "cos is one-to-one on 0 ≤ x ≤ π, so arccos gives angles in that range.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ash says ",
            A.math("\\operatorname{cosec} x"),
            " and ",
            A.math("\\sin^{-1} x"),
            " mean the same thing.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. cosec x = 1/sin x is a reciprocal; sin⁻¹ x = arcsin x is the inverse function, which gives an angle.",
              correct: true,
            },
            { text: "True. Both are written with a −1.", code: "GEO.RECIPROCAL-TRIG" },
            { text: "True. Both undo sin.", code: "GEO.RECIPROCAL-TRIG" },
          ],
          solution: [{ say: "Check with x = 0.5: cosec 0.5 ≈ 2.09, but sin⁻¹ 0.5 = π/6 ≈ 0.52." }],
        });
    }
  },

  verify() {
    return true;
  },
});
