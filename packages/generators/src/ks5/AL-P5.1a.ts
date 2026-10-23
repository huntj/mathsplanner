/**
 * @statement AL-P5.1a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P5.1a: Use sine, cosine and tangent for all arguments, the sine and cosine rules and area
// ½ab sin C
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { deg, r1, rad } from "../shared/trig.ts";

export interface Params {
  /** Three sides of a triangle; angle A is opposite a. */
  a: number;
  b: number;
  c: number;
  /** Ambiguous case: angle A (acute), side a opposite, side b with b > a, and B obtuse. */
  angA: number;
  sa: number;
  sb: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P5.1a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.COSINE-RULE.ORDER", "GEO.SINE-RULE.AMBIGUOUS"],

  params(rng) {
    const a = rng.int(5, 15);
    const b = rng.int(5, 15);
    const c = rng.int(5, 15);
    const angA = rng.int(25, 50);
    const sa = rng.int(6, 12);
    const sb = sa + rng.int(2, 5);
    if (a >= b + c || b >= a + c || c >= a + b || new Set([a, b, c]).size < 3)
      reject("a real scalene triangle");
    const s = (sb * Math.sin(rad(angA))) / sa;
    if (s >= 0.97) reject("an ambiguous case with two clear triangles");
    return { a, b, c, angA, sa, sb, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const A_ = r1(deg(Math.acos((p.b * p.b + p.c * p.c - p.a * p.a) / (2 * p.b * p.c))));
        const C_ = r1(deg(Math.acos((p.a * p.a + p.b * p.b - p.c * p.c) / (2 * p.a * p.b))));
        return A.standard({
          question: `Triangle ABC has BC = ${p.a} cm, CA = ${p.b} cm and AB = ${p.c} cm.`,
          ask: "Work out angle BAC, to 1 decimal place.",
          answer: A.number(A_, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(A_, [
            {
              code: "GEO.COSINE-RULE.ORDER",
              value: A.number(C_, { units: "°", accuracy: { dp: 1 } }),
              feedback: "Angle A is opposite side BC = a: cos A = (b² + c² − a²)/(2bc).",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\cos A = \\frac{${p.b}^2 + ${p.c}^2 - ${p.a}^2}{2 \\times ${p.b} \\times ${p.c}} \\Rightarrow A = ${A_}^\\circ`,
            },
          ],
        });
      }
      case 2: {
        const s = (p.sb * Math.sin(rad(p.angA))) / p.sa;
        const acute = r1(deg(Math.asin(s)));
        const obtuse = r1(180 - deg(Math.asin(s)));
        return A.variedForm({
          rng,
          forms: [
            {
              question: `In triangle ABC, angle A = ${p.angA}°, BC = ${p.sa} cm and AC = ${p.sb} cm. Angle ABC is obtuse.`,
              ask: "Find angle ABC, to 1 decimal place.",
            },
          ],
          answer: A.number(obtuse, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(obtuse, [
            {
              code: "GEO.SINE-RULE.AMBIGUOUS",
              value: A.number(acute, { units: "°", accuracy: { dp: 1 } }),
              feedback: `sin⁻¹ gives the acute angle ${acute}°. The obtuse angle with the same sine is 180° − ${acute}°.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\sin B = \\frac{${p.sb} \\sin ${p.angA}^\\circ}{${p.sa}} = ${s.toFixed(4)}`,
            },
            { say: `sin⁻¹ gives ${acute}°; B is obtuse, so B = 180° − ${acute}° = ${obtuse}°.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue ? "Ben says sin 150° = sin 30°." : "Ben says cos 150° = cos 30°.",
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. sin(180° − θ) = sin θ: the sine graph is symmetrical about 90°.",
                  correct: true,
                },
                {
                  text: "False. Sine is negative for obtuse angles.",
                  code: "GEO.SINE-RULE.AMBIGUOUS",
                },
                { text: "False. sin 150° = 5 × sin 30°." },
              ]
            : [
                { text: "False. cos(180° − θ) = −cos θ, so cos 150° = −cos 30°.", correct: true },
                { text: "True. Cosine is symmetrical about 90°.", code: "GEO.SINE-RULE.AMBIGUOUS" },
                { text: "True. Both angles have the same reference angle." },
              ],
          solution: [
            { say: "For obtuse angles: sin stays positive, cos and tan become negative." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return (
        numberAnswer(question) ===
        r1(deg(Math.acos((p.b * p.b + p.c * p.c - p.a * p.a) / (2 * p.b * p.c))))
      );
    return true;
  },
});
