/**
 * @statement AL-P5.1b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P5.1b: Use radians, including arc length and sector area
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { piLatex } from "../shared/trig.ts";

interface Params {
  degrees: number;
  r: number;
  /** Depth 2: a sector angle as a multiple of π. */
  theta: number;
}

const ANGLES = [30, 45, 60, 120, 135, 150, 210, 225, 240, 270, 300, 315] as const;

export default defineGenerator<Params>({
  id: "AL-P5.1b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.RADIAN.CONVERT", "MEA.CIRCLE.FORMULA"],

  params(rng) {
    return {
      degrees: rng.pick(ANGLES),
      r: rng.int(3, 12),
      theta: rng.pick([30, 45, 60, 120, 135, 150]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: `Write ${p.degrees}° in radians, as a multiple of π.`,
          answer: A.exact(piLatex(p.degrees)),
          wrong: [
            {
              code: "GEO.RADIAN.CONVERT",
              value: A.exact(`\\frac{${p.degrees * 180}}{\\pi}`),
              feedback: "Multiply by π/180 to go from degrees to radians.",
            },
          ],
          solution: [
            { say: "", math: `${p.degrees} \\times \\frac{\\pi}{180} = ${piLatex(p.degrees)}` },
          ],
        });
      case 2: {
        const arc = piLatex(p.theta * p.r);
        const area = `\\frac{${p.r * p.r}}{2} \\times ${piLatex(p.theta)}`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A sector has radius ",
                A.math(`${p.r}\\text{ cm}`),
                " and angle ",
                A.math(piLatex(p.theta)),
                " radians.",
              ],
              ask: "Find the arc length, leaving your answer in terms of π.",
            },
            {
              question: [
                "An arc of a circle of radius ",
                A.math(`${p.r}\\text{ cm}`),
                " subtends an angle of ",
                A.math(piLatex(p.theta)),
                " at the centre.",
              ],
              ask: "Find its length in terms of π.",
            },
          ],
          answer: A.exact(arc),
          wrong: [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.exact(area),
              feedback: "Arc length is rθ; ½r²θ is the sector area.",
            },
          ],
          solution: [
            { say: "", math: `s = r\\theta = ${p.r} \\times ${piLatex(p.theta)} = ${arc}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Nia finds the arc length of a sector with radius ${p.r} cm and angle 60° as ${p.r} × 60 = ${p.r * 60} cm.`,
          truth: false,
          reasons: [
            {
              text: `False. s = rθ needs θ in radians: 60° = π/3, so s = ${p.r}π/3 cm.`,
              correct: true,
            },
            { text: "True. Arc length is radius times angle.", code: "GEO.RADIAN.CONVERT" },
            { text: `False. It is ½ × ${p.r}² × 60.`, code: "MEA.CIRCLE.FORMULA" },
          ],
          solution: [{ say: "The formulas s = rθ and A = ½r²θ only work with θ in radians." }],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) return a?.type === "exact" && a.value === piLatex(p.degrees);
    return true;
  },
});
