/**
 * @statement GF-R10.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R10.b: Solve inverse proportion problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  w1: number;
  w2: number;
  days: number;
  s1: number;
  s2: number;
  t: number;
}

export default defineGenerator<Params>({
  id: "GF-R10.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.INVERSE.AS-DIRECT"],

  params(rng) {
    const p = {
      w1: rng.int(2, 8),
      w2: rng.int(2, 12),
      days: rng.int(3, 20),
      s1: rng.int(3, 12) * 10,
      s2: rng.int(3, 12) * 10,
      t: rng.int(1, 6),
    };
    if (p.w1 === p.w2 || (p.w1 * p.days) % p.w2 !== 0 || (p.days * p.w2) % p.w1 !== 0)
      reject("whole-number days both ways");
    if (p.s1 === p.s2 || (p.s1 * p.t) % p.s2 !== 0) reject("a whole-number time");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = (p.w1 * p.days) / p.w2;
        return A.standard({
          question: [`${p.w1} builders take ${p.days} days to build a wall.`],
          ask: `How many days would ${p.w2} builders take, working at the same rate?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.INVERSE.AS-DIRECT",
              value: A.number((p.days * p.w2) / p.w1),
              feedback: `${p.w2 > p.w1 ? "More" : "Fewer"} builders take ${p.w2 > p.w1 ? "less" : "more"} time. Work out the total builder-days first: ${p.w1 * p.days}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.w1} \\times ${p.days} = ${p.w1 * p.days}, \\; ${p.w1 * p.days} \\div ${p.w2} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = (p.s1 * p.t) / p.s2;
        const direct = (p.t * p.s2) / p.s1;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`At ${p.s1} km/h a journey takes ${p.t} hours.`],
              ask: `How many hours does it take at ${p.s2} km/h?`,
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.INVERSE.AS-DIRECT",
              value: A.number(Math.round(direct * 100) / 100),
              feedback: "Going faster takes less time: the distance stays the same.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\text{distance} = ${p.s1 * p.t} \\text{ km}, \\; ${p.s1 * p.t} \\div ${p.s2} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["If y is inversely proportional to x, then when x doubles, y halves."],
          truth: "always",
          reasons: [
            {
              text: "Always. xy stays the same, so if x is multiplied by 2, y must be divided by 2.",
              correct: true,
            },
            { text: "Never. When x doubles, y doubles too.", code: "RAT.INVERSE.AS-DIRECT" },
            { text: "Sometimes. It depends on the starting values." },
          ],
          solution: [{ say: "Inverse proportion: y = k/x." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.w1 * p.days) / p.w2;
    if (question.key.depth === 2) return numberAnswer(question) === (p.s1 * p.t) / p.s2;
    return true;
  },
});
