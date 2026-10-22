/**
 * @statement AL-P5.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P5.3: Know the graphs of sin, cos and tan, their symmetries and periodicity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  fn: "sin" | "cos";
  alpha: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P5.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.TRANSFORM.DIRECTION", "ALG.TRIG.SYMMETRY"],

  params(rng) {
    return {
      k: rng.pick([2, 3, 4, 5, 6]),
      fn: rng.pick(["sin", "cos"] as const),
      alpha: rng.int(10, 80),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const period = 360 / p.k;
        return A.standard({
          question: ["What is the period of ", A.math(`y = \\${p.fn}(${p.k}x)`), ", in degrees?"],
          answer: A.number(period, { units: "°" }),
          wrong: wrongs(period, [
            {
              code: "ALG.TRANSFORM.DIRECTION",
              value: A.number(360 * p.k, { units: "°" }),
              feedback: `${p.k}x reaches 360° when x = 360° ÷ ${p.k}: the graph is squashed horizontally.`,
            },
          ]),
          solution: [{ say: `360° ÷ ${p.k} = ${period}°.` }],
        });
      }
      case 2: {
        const other = 180 + p.alpha;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "One solution of ",
                A.math(`\\tan x = \\tan ${p.alpha}^\\circ`),
                ` with 0° ≤ x < 360° is ${p.alpha}°.`,
              ],
              ask: "Find the other solution.",
            },
          ],
          answer: A.number(other, { units: "°" }),
          wrong: wrongs(other, [
            {
              code: "ALG.TRIG.SYMMETRY",
              value: A.number(180 - p.alpha, { units: "°" }),
              feedback: "The tangent graph repeats every 180°: add 180°.",
            },
          ]),
          solution: [{ say: `tan has period 180°, so x = ${p.alpha}° + 180° = ${other}°.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? "Sara says cos(−x) = cos x for every x."
            : "Sara says sin(−x) = sin x for every x.",
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: "True. The cosine graph is symmetrical about the y-axis.", correct: true },
                { text: "False. cos(−x) = −cos x.", code: "ALG.TRIG.SYMMETRY" },
                { text: "False. Negative angles do not exist." },
              ]
            : [
                {
                  text: "False. The sine graph has rotational symmetry about the origin: sin(−x) = −sin x.",
                  correct: true,
                },
                { text: "True. Sine is symmetrical about the y-axis.", code: "ALG.TRIG.SYMMETRY" },
                { text: "True. The angle's size is all that matters." },
              ],
          solution: [
            {
              say: "cos is an even function (mirror in the y-axis); sin and tan are odd functions.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 360 / p.k;
    return true;
  },
});
