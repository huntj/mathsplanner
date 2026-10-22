/**
 * @statement AL-M7.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M7.2: Use displacement-time and velocity-time graphs, including gradients and areas
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  v: number;
  t1: number;
  t2: number;
  t3: number;
}

function graph(p: Params): CartesianSpec {
  const pts: [number, number][] = [
    [0, 0],
    [p.t1, p.v],
    [p.t2, p.v],
    [p.t3, 0],
  ];
  return {
    type: "cartesian",
    x: { min: 0, max: p.t3 + 5, step: 5, label: "t\\text{ (s)}" },
    y: { min: 0, max: p.v + 4, step: 2, label: "v\\text{ (m s}^{-1}\\text{)}" },
    grid: true,
    segments: pts.slice(1).map((to, i) => ({ from: pts[i] ?? to, to })),
    description:
      "A velocity-time graph: a straight rise, a constant section, and a straight fall to zero.",
  };
}

export default defineGenerator<Params>({
  id: "AL-M7.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.AREA-GRADIENT"],

  params(rng) {
    const t1 = 5 * rng.int(1, 3);
    const t2 = t1 + 5 * rng.int(1, 4);
    return { v: 2 * rng.int(3, 8), t1, t2, t3: t2 + 5 * rng.int(1, 2) };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = [
      "The velocity-time graph shows the motion of a train between two stations.",
      A.figure(graph(p)),
    ];
    switch (depth) {
      case 1: {
        const dec = p.v / (p.t3 - p.t2);
        return A.standard({
          question: intro,
          ask: "Find the magnitude of the deceleration in the final stage.",
          answer: A.number(dec, { units: "m/s²" }),
          wrong: wrongs(dec, [
            {
              code: "ALG.GRAPH.AREA-GRADIENT",
              value: A.number((p.v * (p.t3 - p.t2)) / 2, { units: "m/s²" }),
              feedback: "Acceleration is the gradient; the area is the distance.",
            },
          ]),
          solution: [{ say: `${p.v} ÷ ${p.t3 - p.t2} = ${dec} m s⁻².` }],
        });
      }
      case 2: {
        const d = ((p.t3 + (p.t2 - p.t1)) * p.v) / 2;
        return A.variedForm({
          rng,
          forms: [{ question: intro, ask: "Find the distance between the two stations." }],
          answer: A.number(d, { units: "m" }),
          wrong: wrongs(d, [
            {
              code: "ALG.GRAPH.AREA-GRADIENT",
              value: A.number(p.v * p.t3, { units: "m" }),
              feedback: "The area under the graph is a trapezium, not a rectangle.",
            },
          ]),
          solution: [{ say: `½ × (${p.t3} + ${p.t2 - p.t1}) × ${p.v} = ${d} m.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Ray says the area under a displacement-time graph gives the distance travelled.",
          truth: false,
          reasons: [
            {
              text: "False. On a displacement-time graph the gradient is the velocity; it is the area under a velocity-time graph that gives the displacement.",
              correct: true,
            },
            {
              text: "True. Area under any motion graph is distance.",
              code: "ALG.GRAPH.AREA-GRADIENT",
            },
            {
              text: "True. Displacement and distance are the same.",
              code: "ALG.GRAPH.AREA-GRADIENT",
            },
          ],
          solution: [
            {
              say: "Displacement-time: gradient = velocity. Velocity-time: gradient = acceleration, area = displacement.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.v / (p.t3 - p.t2);
    return true;
  },
});
