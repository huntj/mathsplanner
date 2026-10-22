/**
 * @statement FM-CP-25
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-25: Find areas enclosed by polar curves
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  k: number;
}

/** (n/d)·π^power as LaTeX. */
function piTimes(n: number, d: number, power = 1): string {
  const r = frac(n, d);
  const pi = power === 1 ? "\\pi" : `\\pi^${power}`;
  const top = r.n === 1n ? pi : `${r.n}${pi}`;
  return r.d === 1n ? top : `\\frac{${top}}{${r.d}}`;
}

export default defineGenerator<Params>({
  id: "FM-CP-25",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.POLAR.AREA"],

  params(rng) {
    return { a: rng.int(1, 6), k: rng.int(1, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = piTimes(3 * p.a * p.a, 2);
        return A.standard({
          question: [
            "Find the exact area enclosed by the cardioid ",
            A.math(`r = ${p.a === 1 ? "" : p.a}(1 + \\cos\\theta)`),
            ".",
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "GEO.POLAR.AREA",
              value: A.exact(piTimes(3 * p.a * p.a, 1)),
              feedback: "Area = ½∫r² dθ: keep the ½.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{1}{2}\\int_0^{2\\pi} ${p.a * p.a === 1 ? "" : p.a * p.a}(1 + \\cos\\theta)^2\\,d\\theta`,
            },
            { say: "Using cos²θ = ½(1 + cos 2θ), the integrand averages to 3/2, giving ", math: v },
          ],
        });
      }
      case 2: {
        // ½∫₀^(π/2) k²θ² dθ = k²π³/48
        const v = piTimes(p.k * p.k, 48, 3);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the exact area of the region bounded by the spiral ",
                A.math(`r = ${p.k === 1 ? "" : p.k}\\theta`),
                " for ",
                A.math("0 \\le \\theta \\le \\frac{\\pi}{2}"),
                " and the half-line ",
                A.math("\\theta = \\frac{\\pi}{2}"),
                ".",
              ],
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "GEO.POLAR.AREA",
              value: A.exact(piTimes(p.k * p.k, 24, 3)),
              feedback: "Area = ½∫r² dθ: keep the ½.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{1}{2}\\int_0^{\\pi/2} ${p.k * p.k === 1 ? "" : p.k * p.k}\\theta^2\\,d\\theta = \\frac{${p.k * p.k === 1 ? "" : p.k * p.k}}{6}\\left(\\frac{\\pi}{2}\\right)^3 = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Rae says the area inside the circle ",
            A.math(`r = ${2 * p.a}\\sin\\theta`),
            " is ",
            A.math(`\\frac{1}{2}\\int_0^{2\\pi} ${4 * p.a * p.a}\\sin^2\\theta\\,d\\theta`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The circle is traced once as θ goes from 0 to π (r is negative for π < θ < 2π and retraces it), so 0 to 2π counts the area twice.`,
              correct: true,
            },
            { text: "True. A full turn is always 0 to 2π.", code: "GEO.POLAR.AREA" },
            { text: "False. The ½ should not be there.", code: "GEO.POLAR.AREA" },
          ],
          solution: [
            {
              say: `Integrating from 0 to π gives ${p.a === 1 ? "" : p.a * p.a}π, the area of a circle of radius ${p.a}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === piTimes(3 * p.a * p.a, 2);
    if (question.key.depth === 2) return exactAnswer(question) === piTimes(p.k * p.k, 48, 3);
    return true;
  },
});
