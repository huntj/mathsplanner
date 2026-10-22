/**
 * @statement GH-R15
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-R15: Interpret the gradient at a point on a curve as instantaneous rate of change; use chords
// and tangents for average and instantaneous rates
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Distance d = k t² metres. */
  k: number;
  /** Depth 1: average speed from t = a to t = b. Depth 2: tangent at t = a. */
  a: number;
  b: number;
}

function graph(p: Params, tangent: boolean): CartesianSpec {
  const top = Math.ceil((p.k * 36) / 10) * 10;
  const at = (t: number) => p.k * t * t;
  const g = 2 * p.k * p.a;
  const t0 = p.a - 1;
  const t1 = p.a + 1;
  const y = (t: number) => at(p.a) + g * (t - p.a);
  return {
    type: "cartesian",
    x: { min: 0, max: 6, step: 1, label: "\\text{time (s)}" },
    y: { min: 0, max: top, step: top > 40 ? 10 : 5, label: "\\text{distance (m)}" },
    grid: true,
    curves: [{ y: `${p.k}*x^2`, domain: [0, 6] }],
    ...(tangent
      ? {
          segments: [
            {
              from: [t0, y(t0)] as [number, number],
              to: [t1, y(t1)] as [number, number],
              dashed: true,
            },
          ],
          points: [
            { at: [t0, y(t0)] as [number, number], label: `(${t0}, ${y(t0)})` },
            { at: [t1, y(t1)] as [number, number], label: `(${t1}, ${y(t1)})` },
          ],
        }
      : {}),
    description: tangent
      ? "A distance-time curve with a dashed tangent touching it, and two marked points on the tangent."
      : "A distance-time curve getting steeper over time.",
  };
}

export default defineGenerator<Params>({
  id: "GH-R15",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.RATE.AVERAGE-INSTANT"],

  params(rng) {
    const a = rng.int(2, 4);
    const b = rng.int(a + 1, 6);
    const k = rng.int(1, 2);
    // The tangent's lower end must stay above the time axis.
    if (k * a * a - 2 * k * a < 0) reject("a tangent above the axis");
    return { k, a, b };
  },

  build(p, depth, rng): QuestionDraft {
    const d = (t: number) => p.k * t * t;
    switch (depth) {
      case 1: {
        const avg = (d(p.b) - d(p.a)) / (p.b - p.a);
        return A.standard({
          question: [
            "The graph shows the distance travelled by a ball rolling down a slope.",
            A.figure(graph(p, false)),
            `The distance is ${p.k === 1 ? "" : p.k}t² metres after t seconds.`,
          ],
          ask: `Work out the average speed between t = ${p.a} and t = ${p.b}.`,
          answer: A.number(avg, { units: "m/s" }),
          wrong: wrongs(avg, [
            {
              code: "RAT.RATE.AVERAGE-INSTANT",
              value: A.number(2 * p.k * p.b, { units: "m/s" }),
              feedback:
                "Average speed is the gradient of the chord: change in distance ÷ change in time.",
            },
          ]),
          solution: [{ say: `(${d(p.b)} − ${d(p.a)}) ÷ (${p.b} − ${p.a}) = ${avg} m/s.` }],
        });
      }
      case 2: {
        const g = 2 * p.k * p.a;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The graph shows the distance travelled by a ball. A tangent has been drawn at ",
                A.math(`t = ${p.a}`),
                ".",
                A.figure(graph(p, true)),
              ],
              ask: `Use the tangent to find the speed of the ball at t = ${p.a} seconds.`,
            },
          ],
          answer: A.number(g, { units: "m/s" }),
          wrong: wrongs(g, [
            {
              code: "RAT.RATE.AVERAGE-INSTANT",
              value: A.number(d(p.a) / p.a, { units: "m/s" }),
              feedback:
                "That is the average speed from the start. The speed at an instant is the gradient of the tangent.",
            },
          ]),
          solution: [
            {
              say: `Gradient of the tangent = rise ÷ run between the marked points = ${4 * p.k * p.a} ÷ 2 = ${g} m/s.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A distance-time graph is curved. Eli says the gradient of the chord from t = 1 to t = ${p.b} gives the speed at exactly t = ${p.b}.`,
          truth: false,
          reasons: [
            {
              text: `False. The chord gives the average speed over that time. The speed at t = ${p.b} is the gradient of the tangent there.`,
              correct: true,
            },
            {
              text: "True. Any line between two points on the curve gives the speed at the end point.",
              code: "RAT.RATE.AVERAGE-INSTANT",
            },
            {
              text: "True. The chord and the tangent always have the same gradient.",
              code: "RAT.RATE.AVERAGE-INSTANT",
            },
          ],
          solution: [
            { say: "Chord: average rate of change. Tangent: rate of change at an instant." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === (p.k * p.b * p.b - p.k * p.a * p.a) / (p.b - p.a);
    if (question.key.depth === 2) return numberAnswer(question) === 2 * p.k * p.a;
    return true;
  },
});
