/**
 * @statement GH-A15.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A15.b: Estimate areas under graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { vt } from "../shared/motion.ts";

interface Params {
  v: number;
  t1: number;
  t2: number;
  t3: number;
}

const distance = (p: Params) => (p.v * p.t1) / 2 + p.v * p.t2 + (p.v * p.t3) / 2;

export default defineGenerator<Params>({
  id: "GH-A15.b",
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
    if (p.t1 + p.t2 + p.t3 > 22) reject("a graph that fits");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const fig = A.figure(vt(p));
    switch (depth) {
      case 1: {
        const v = (p.v * p.t1) / 2;
        return A.standard({
          question: ["The graph shows the velocity of a cyclist.", fig],
          ask: `How far does the cyclist travel in the first ${p.t1} seconds?`,
          answer: A.number(v, { units: "m" }),
          wrong: wrongs(v, [
            {
              code: "ALG.GRAPH.AREA-GRADIENT",
              value: A.number(p.v * p.t1, { units: "m" }),
              feedback: "The area under the first part is a triangle: ½ × base × height.",
            },
          ]),
          solution: [{ say: "", math: `\\frac{1}{2} \\times ${p.t1} \\times ${p.v} = ${v}` }],
        });
      }
      case 2: {
        const v = distance(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The graph shows the velocity of a cyclist.", fig],
              ask: "Find the total distance travelled.",
            },
          ],
          answer: A.number(v, { units: "m" }),
          wrong: wrongs(v, [
            {
              code: "ALG.GRAPH.AREA-GRADIENT",
              value: A.number(p.v * (p.t1 + p.t2 + p.t3), { units: "m" }),
              feedback:
                "The sloping parts are triangles, not rectangles: use the area of a trapezium.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{2}(${p.t2} + ${p.t1 + p.t2 + p.t3}) \\times ${p.v} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Lena says the area under a velocity–time graph gives the acceleration."],
          truth: false,
          reasons: [
            {
              text: "False. Area = velocity × time = distance travelled. The acceleration is the gradient.",
              correct: true,
            },
            {
              text: "True. Area measures how fast the speed changes.",
              code: "ALG.GRAPH.AREA-GRADIENT",
            },
            {
              text: "True. Area and gradient give the same thing.",
              code: "ALG.GRAPH.AREA-GRADIENT",
            },
          ],
          solution: [{ say: "Check the units: (m/s) × s = m." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.v * p.t1) / 2;
    if (question.key.depth === 2) return numberAnswer(question) === distance(p);
    return true;
  },
});
