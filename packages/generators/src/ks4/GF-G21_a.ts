/**
 * @statement GF-G21.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G21.a: Know exact values of sin and cos
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { EXACT } from "../shared/trig.ts";

const VALUES = ["\\frac{1}{2}", "\\frac{\\sqrt{2}}{2}", "\\frac{\\sqrt{3}}{2}"];

interface Params {
  fn: "sin" | "cos";
  angle: 30 | 45 | 60;
  pair: number;
}

const PAIRS: [string, string, string, string][] = [
  ["\\sin 60^\\circ", "\\cos 30^\\circ", "\\sin 30^\\circ", "\\cos 60^\\circ"],
  ["\\sin 30^\\circ", "\\cos 60^\\circ", "\\sin 60^\\circ", "\\cos 30^\\circ"],
  ["\\sin 45^\\circ", "\\cos 45^\\circ", "\\sin 30^\\circ", "\\cos 30^\\circ"],
];

export default defineGenerator<Params>({
  id: "GF-G21.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIG.EXACT"],

  params(rng) {
    return {
      fn: rng.pick(["sin", "cos"] as const),
      angle: rng.pick([30, 45, 60] as const),
      pair: rng.int(0, PAIRS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = EXACT[p.fn][p.angle][0];
        return A.choice({
          rng,
          question: ["What is the exact value of ", A.math(`\\${p.fn} ${p.angle}^\\circ`), "?"],
          correct: A.math(right),
          distractors: VALUES.filter((v) => v !== right).map((v) => ({
            content: A.math(v),
            code: "GEO.TRIG.EXACT",
            feedback:
              "Picture the triangles: half an equilateral triangle of side 2, and a right isosceles triangle with shorter sides 1.",
          })),
          solution: [{ say: "", math: `\\${p.fn} ${p.angle}^\\circ = ${right}` }],
        });
      }
      case 2: {
        const [ask, right, w1, w2] = PAIRS[p.pair] ?? PAIRS[0] ?? ["", "", "", ""];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which of these is equal to ", A.math(ask), "?"],
          correct: A.math(right),
          distractors: [w1, w2].map((w) => ({
            content: A.math(w),
            code: "GEO.TRIG.EXACT",
            feedback: "Write down the exact value of each one and compare.",
          })),
          solution: [{ say: "sin θ = cos (90° − θ): ", math: `${ask} = ${right}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["For an acute angle x, ", A.math("\\sin x = \\cos x"), "."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. It is true only at 45°, where both are √2/2. At 30°, sin is ½ and cos is √3/2.",
              correct: true,
            },
            { text: "Always. Sine and cosine are the same function.", code: "GEO.TRIG.EXACT" },
            { text: "Never. Sine is always smaller than cosine.", code: "GEO.TRIG.EXACT" },
          ],
          solution: [{ say: "In a right isosceles triangle, opposite = adjacent." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === EXACT[p.fn][p.angle][0];
    if (question.key.depth === 2) return chosenText(question) === PAIRS[p.pair]?.[1];
    return true;
  },
});
