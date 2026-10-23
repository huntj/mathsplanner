/**
 * @statement Y7-GEO-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-05.a: Use angles at a point
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { anglesAtPoint } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  m: [number, number, number];
}

export default defineGenerator<Params>({
  id: "Y7-GEO-05.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.ANGLES.POINT-180"],

  params(rng) {
    const p = {
      a: rng.int(6, 16) * 10,
      b: rng.int(6, 13) * 10,
      m: [1, rng.int(2, 3), rng.int(3, 5)] as [number, number, number],
    };
    const x = 360 - p.a - p.b;
    if (x < 50 || x > 200 || 360 % (p.m[0] + p.m[1] + p.m[2]) !== 0)
      reject("a clear third angle and whole-number multiples");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = 360 - p.a - p.b;
        return A.standard({
          question: [
            A.figure(
              anglesAtPoint([
                { value: p.a, label: `${p.a}^\\circ` },
                { value: p.b, label: `${p.b}^\\circ` },
                { value: x, label: "x" },
              ]),
            ),
          ],
          ask: "Find the angle x.",
          answer: A.degrees(x),
          wrong: wrongs(x, [
            {
              code: "GEO.ANGLES.POINT-180",
              value: A.degrees(Math.abs(180 - p.a - p.b)),
              feedback: "Angles around a point add up to 360°.",
            },
          ]),
          solution: [
            { say: "", math: `x = 360^\\circ - ${p.a}^\\circ - ${p.b}^\\circ = ${x}^\\circ` },
          ],
        });
      }
      case 2: {
        const total = p.m[0] + p.m[1] + p.m[2];
        const x = 360 / total;
        const label = (k: number) => (k === 1 ? "x" : `${k}x`);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.figure(anglesAtPoint(p.m.map((k) => ({ value: k * x, label: label(k) })))),
              ],
              ask: "Find the value of x.",
            },
          ],
          answer: A.number(x),
          wrong: wrongs(x, [
            {
              code: "GEO.ANGLES.POINT-180",
              value: A.number(Math.round((180 / total) * 100) / 100),
              feedback: `The angles make a full turn: ${total}x = 360°.`,
            },
          ]),
          solution: [{ say: "", math: `${total}x = 360 \\Rightarrow x = ${x}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["Angles around a point add up to 180°."],
          truth: "never",
          reasons: [
            {
              text: "Never. Angles around a point make a full turn, 360°. It is angles on a straight line that make 180°.",
              correct: true,
            },
            { text: "Always. All angle facts total 180°.", code: "GEO.ANGLES.POINT-180" },
            {
              text: "Sometimes. It depends how many angles there are.",
              code: "GEO.ANGLES.POINT-180",
            },
          ],
          solution: [{ say: "Full turn: 360°. Half turn: 180°." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 360 - p.a - p.b;
    if (question.key.depth === 2)
      return numberAnswer(question) === 360 / (p.m[0] + p.m[1] + p.m[2]);
    return true;
  },
});
