/**
 * @statement GH-A15.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A15.c: Interpret gradients and areas in context, e.g. velocity-time graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { vt } from "../shared/motion.ts";

interface Params {
  v: number;
  t1: number;
  t2: number;
  t3: number;
}

const ANSWER = "The distance travelled";

export default defineGenerator<Params>({
  id: "GH-A15.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.AREA-GRADIENT"],

  params(rng) {
    const p = {
      v: 2 * rng.int(2, 6),
      t1: 2 * rng.int(1, 4),
      t2: 2 * rng.int(1, 5),
      t3: 2 * rng.int(1, 4),
    };
    if (p.t1 + p.t2 + p.t3 > 22 || (p.v / p.t1) % 0.5 !== 0)
      reject("a graph that fits, with a simple acceleration");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const fig = A.figure(vt(p));
    switch (depth) {
      case 1: {
        const a = p.v / p.t1;
        return A.standard({
          question: ["The graph shows the velocity of a car.", fig],
          ask: `Find its acceleration in the first ${p.t1} seconds, in m/s².`,
          answer: A.number(a, { units: "m/s²" }),
          wrong: wrongs(a, [
            {
              code: "ALG.GRAPH.AREA-GRADIENT",
              value: A.number((p.v * p.t1) / 2, { units: "m/s²" }),
              feedback: "Acceleration is the gradient (rise ÷ run), not the area.",
            },
          ]),
          solution: [{ say: "", math: `\\frac{${p.v}}{${p.t1}} = ${a}` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["The graph shows the velocity of a car.", fig],
          ask: "What does the area under the graph represent?",
          correct: ANSWER,
          distractors: [
            {
              content: "The acceleration",
              code: "ALG.GRAPH.AREA-GRADIENT",
              feedback: "Acceleration is the gradient.",
            },
            {
              content: "The top speed",
              code: "ALG.GRAPH.AREA-GRADIENT",
              feedback: "The top speed is read from the vertical axis.",
            },
          ],
          solution: [{ say: "Velocity × time = distance, so the area is the distance travelled." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The graph shows the velocity of a car.",
            fig,
            ` Ben says the car is going backwards in the last ${p.t3} seconds, because the line slopes down.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. The velocity is still positive, so the car moves forwards; the downward slope means it is slowing down (decelerating).",
              correct: true,
            },
            {
              text: "True. A negative gradient means moving backwards.",
              code: "ALG.GRAPH.AREA-GRADIENT",
            },
            {
              text: "True. The graph is going down towards zero distance.",
              code: "ALG.GRAPH.AREA-GRADIENT",
            },
          ],
          solution: [
            {
              say: "On a velocity–time graph the gradient is the acceleration; a negative gradient is deceleration.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.v / p.t1;
    if (question.key.depth === 2) return chosenText(question) === ANSWER;
    return true;
  },
});
