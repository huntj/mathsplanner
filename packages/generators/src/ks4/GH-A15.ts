/**
 * @statement GH-A15
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A15: Estimate gradients of and areas under graphs, including non-linear graphs, and interpret
// them, e.g. distance-time and velocity-time graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Accelerate at `acc` m/s² for t1 s, hold the speed until t2, then stop at t3. */
  acc: number;
  t1: number;
  hold: number;
  stop: number;
  claim: boolean;
}

const speed = (p: Params) => p.acc * p.t1;
const times = (p: Params) => [p.t1, p.t1 + p.hold, p.t1 + p.hold + p.stop] as const;

function graph(p: Params): CartesianSpec {
  const v = speed(p);
  const [t1, t2, t3] = times(p);
  const pts: [number, number][] = [
    [0, 0],
    [t1, v],
    [t2, v],
    [t3, 0],
  ];
  return {
    type: "cartesian",
    x: { min: 0, max: t3 + 2, step: 2, label: "\\text{time (s)}" },
    y: { min: 0, max: v + 4, step: 2, label: "\\text{velocity (m/s)}" },
    grid: true,
    segments: pts.slice(1).map((to, i) => ({ from: pts[i] ?? to, to })),
    description:
      "A velocity-time graph: a straight rise, a flat section, then a straight fall to zero.",
  };
}

export default defineGenerator<Params>({
  id: "GH-A15",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.AREA-GRADIENT"],

  params(rng) {
    const acc = rng.pick([1, 2, 3]);
    const t1 = rng.pick([2, 4, 6]);
    return { acc, t1, hold: rng.pick([4, 6, 8, 10]), stop: rng.pick([2, 4, 6]), claim: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const v = speed(p);
    const [t1, t2, t3] = times(p);
    const intro = ["The velocity-time graph shows a car's journey.", A.figure(graph(p))];
    switch (depth) {
      case 1:
        return A.standard({
          question: intro,
          ask: `Work out the car's acceleration in the first ${t1} seconds.`,
          answer: A.number(p.acc, { units: "m/s²" }),
          wrong: wrongs(p.acc, [
            {
              code: "ALG.GRAPH.AREA-GRADIENT",
              value: A.number((v * t1) / 2, { units: "m/s²" }),
              feedback:
                "Acceleration is the gradient of a velocity-time graph, not the area under it.",
            },
          ]),
          solution: [{ say: `Gradient = ${v} ÷ ${t1} = ${p.acc} m/s².` }],
        });
      case 2: {
        const distance = ((t3 + (t2 - t1)) * v) / 2;
        return A.variedForm({
          rng,
          forms: [
            { question: intro, ask: "Work out the total distance travelled." },
            { question: intro, ask: "How far does the car travel altogether?" },
          ],
          answer: A.number(distance, { units: "m" }),
          wrong: wrongs(distance, [
            {
              code: "ALG.GRAPH.AREA-GRADIENT",
              value: A.number(v * t3, { units: "m" }),
              feedback:
                "The distance is the area under the graph: the sloping parts are triangles, not rectangles.",
            },
          ]),
          solution: [
            { say: `The area is a trapezium: ½ × (${t3} + ${t2 - t1}) × ${v} = ${distance} m.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claim
            ? "Mia says the area under a velocity-time graph gives the distance travelled."
            : "Mia says the area under a velocity-time graph gives the acceleration.",
          truth: p.claim,
          reasons: p.claim
            ? [
                {
                  text: "True. Velocity × time = distance, so the area (velocity times time) is the distance.",
                  correct: true,
                },
                {
                  text: "False. The area gives the acceleration.",
                  code: "ALG.GRAPH.AREA-GRADIENT",
                },
                {
                  text: "False. The gradient gives the distance.",
                  code: "ALG.GRAPH.AREA-GRADIENT",
                },
              ]
            : [
                {
                  text: "False. The gradient gives the acceleration; the area gives the distance.",
                  correct: true,
                },
                {
                  text: "True. Acceleration is velocity times time.",
                  code: "ALG.GRAPH.AREA-GRADIENT",
                },
                { text: "True. Both are found from the area.", code: "ALG.GRAPH.AREA-GRADIENT" },
              ],
          solution: [
            { say: "On a velocity-time graph: gradient = acceleration; area = distance." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.acc;
    if (question.key.depth === 2) {
      const [t1, t2, t3] = times(p);
      return numberAnswer(question) === ((t3 + (t2 - t1)) * speed(p)) / 2;
    }
    return true;
  },
});
