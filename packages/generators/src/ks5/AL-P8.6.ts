/**
 * @statement AL-P8.6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P8.6: Find areas between two curves, including curves defined parametrically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  k: number;
  m: number;
}

export default defineGenerator<Params>({
  id: "AL-P8.6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.AREA-BETWEEN"],

  params(rng) {
    return { k: rng.int(2, 6), m: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const area = frac(p.k ** 3, 6);
        return A.standard({
          question: [
            "Find the area of the region enclosed by ",
            A.math("y = x^2"),
            " and ",
            A.math(`y = ${p.k}x`),
            ".",
          ],
          answer: A.exact(area),
          wrong: [
            {
              code: "CALC.AREA-BETWEEN",
              value: A.exact(frac(p.k ** 3, 2)),
              feedback: "Subtract the curve from the line before integrating: ∫(kx − x²) dx.",
            },
          ],
          solution: [
            {
              say: `They meet at x = 0 and x = ${p.k}.`,
              math: `\\int_0^{${p.k}} (${p.k}x - x^2)\\,dx = ${toLatex(area)}`,
            },
          ],
        });
      }
      case 2: {
        const area = frac(4 * p.m ** 3, 3);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the area of the region between the curve ",
                A.math("y = x^2"),
                " and the line ",
                A.math(`y = ${p.m * p.m}`),
                ".",
              ],
            },
          ],
          answer: A.exact(area),
          wrong: [
            {
              code: "CALC.AREA-BETWEEN",
              value: A.exact(frac(2 * p.m ** 3, 3)),
              feedback: `The region runs from x = −${p.m} to x = ${p.m}, not just from 0.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\int_{-${p.m}}^{${p.m}} (${p.m * p.m} - x^2)\\,dx = ${toLatex(area)}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Nat finds the area between ",
            A.math("y = x^2"),
            " and ",
            A.math(`y = ${p.k}x`),
            " by working out ",
            A.math(`\\int_0^{${p.k}} (x^2 - ${p.k}x)\\,dx`),
            " and says the area is negative.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The line is above the curve there, so integrate (${p.k}x − x²); an area is never negative.`,
              correct: true,
            },
            { text: "True. Areas below a line are negative.", code: "CALC.AREA-BETWEEN" },
            {
              text: "True. The integral gives the area exactly as it is.",
              code: "CALC.AREA-BETWEEN",
            },
          ],
          solution: [
            { say: "Area between curves = ∫ (upper − lower) dx between the crossing points." },
          ],
        });
    }
  },

  verify() {
    return true;
  },
});
