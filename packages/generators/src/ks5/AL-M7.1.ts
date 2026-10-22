/**
 * @statement AL-M7.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-M7.1: Use the language of kinematics: position, displacement, distance, speed, velocity,
// acceleration
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  east: number;
  west: number;
  d: number;
  t1: number;
  t2: number;
}

export default defineGenerator<Params>({
  id: "AL-M7.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.DISTANCE-DISPLACEMENT"],

  params(rng) {
    const east = rng.int(5, 20);
    const west = rng.int(2, 25);
    if (east === west) reject("a non-zero displacement");
    return { east, west, d: 10 * rng.int(5, 30), t1: rng.int(20, 60), t2: rng.int(20, 60) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const disp = p.east - p.west;
        return A.standard({
          question: `A particle moves ${p.east} m east and then ${p.west} m west. Take east as positive.`,
          ask: "Find its displacement from the start, in metres.",
          answer: A.number(disp, { units: "m" }),
          wrong: signedWrongs(disp, [
            {
              code: "MECH.DISTANCE-DISPLACEMENT",
              value: A.number(p.east + p.west, { units: "m" }),
              feedback:
                "That is the distance travelled. Displacement takes direction into account.",
            },
          ]),
          solution: [{ say: `${p.east} − ${p.west} = ${disp} m.` }],
        });
      }
      case 2: {
        const speed = Math.round(((2 * p.d) / (p.t1 + p.t2)) * 100) / 100;
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A runner goes ${p.d} m along a straight track in ${p.t1} s and then back to the start in ${p.t2} s.`,
              ask: "Find the runner's average speed, to 2 decimal places.",
            },
          ],
          answer: A.number(speed, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: signedWrongs(speed, [
            {
              code: "MECH.DISTANCE-DISPLACEMENT",
              value: A.number(0, { units: "m/s", accuracy: { dp: 2 } }),
              feedback:
                "Average velocity is 0 because the runner returns to the start, but average speed uses the total distance.",
            },
          ]),
          solution: [{ say: `${2 * p.d} m in ${p.t1 + p.t2} s: ${speed} m s⁻¹.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: "Kim says speed can be negative when an object moves backwards.",
          truth: false,
          reasons: [
            {
              text: "False. Speed is the magnitude of velocity, so it is never negative; velocity can be negative.",
              correct: true,
            },
            {
              text: "True. Moving backwards gives a negative speed.",
              code: "MECH.DISTANCE-DISPLACEMENT",
            },
            {
              text: "True. Speed and velocity are the same thing.",
              code: "MECH.DISTANCE-DISPLACEMENT",
            },
          ],
          solution: [{ say: "Velocity has direction; speed does not." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.east - p.west;
    return true;
  },
});
