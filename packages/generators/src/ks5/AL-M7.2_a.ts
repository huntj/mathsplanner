/**
 * @statement AL-M7.2.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-M7.2.a: Use displacement-time graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Out d metres in t1 seconds, rests for r seconds, back to the start in t2 seconds. */
  d: number;
  t1: number;
  r: number;
  t2: number;
}

export default defineGenerator<Params>({
  id: "AL-M7.2.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.DISTANCE-DISPLACEMENT", "ALG.GRAPH.DISTANCE-TIME"],

  params(rng) {
    const p = {
      d: rng.int(4, 30) * 10,
      t1: rng.int(2, 10) * 10,
      r: rng.int(1, 6) * 10,
      t2: rng.int(2, 10) * 10,
    };
    if (p.d % p.t1 !== 0 || p.d % p.t2 !== 0 || p.t1 === p.t2)
      reject("whole-number velocities that differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const intro = `A displacement-time graph for a runner is made of straight lines from (0, 0) to (${p.t1}, ${p.d}), then to (${p.t1 + p.r}, ${p.d}), then to (${p.t1 + p.r + p.t2}, 0), with time in seconds and displacement in metres.`;
    switch (depth) {
      case 1: {
        const v = -p.d / p.t2;
        return A.standard({
          question: intro,
          ask: "Find the velocity on the final stage, in m s⁻¹.",
          answer: A.number(v, { units: "m/s" }),
          wrong: signedWrongs(v, [
            {
              code: "MECH.DISTANCE-DISPLACEMENT",
              value: A.number(-v, { units: "m/s" }),
              feedback: "The displacement is decreasing back to 0, so the velocity is negative.",
            },
          ]),
          solution: [{ say: `Gradient = −${p.d} ÷ ${p.t2} = ${v} m s⁻¹.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [intro],
          ask: "What is happening on the horizontal section?",
          correct: "The runner is at rest",
          distractors: [
            {
              content: "The runner is moving at a constant speed",
              code: "ALG.GRAPH.DISTANCE-TIME",
              feedback:
                "A horizontal line means the displacement is not changing, so the velocity is 0.",
            },
            {
              content: "The runner is running back towards the start",
              code: "ALG.GRAPH.DISTANCE-TIME",
              feedback: "Running back would make the displacement decrease.",
            },
          ],
          solution: [
            {
              say: "A horizontal displacement-time graph has gradient 0: the runner is stationary.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `${intro} Max says the runner's final displacement is ${2 * p.d} m.`,
          truth: false,
          reasons: [
            {
              text: `False. The runner ends where they started, so the displacement is 0 m. ${2 * p.d} m is the distance travelled.`,
              correct: true,
            },
            {
              text: "True. Displacement and distance are the same.",
              code: "MECH.DISTANCE-DISPLACEMENT",
            },
            { text: "True. Add the two stages together.", code: "MECH.DISTANCE-DISPLACEMENT" },
          ],
          solution: [
            {
              say: "Displacement is the position relative to the start; distance is the total length travelled.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === -p.d / p.t2;
    if (question.key.depth === 2) return chosenText(question) === "The runner is at rest";
    return true;
  },
});
