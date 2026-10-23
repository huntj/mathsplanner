/**
 * @statement GH-G22.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-G22.b: Apply the cosine rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  b: number;
  c: number;
  A: number;
  x: number;
  y: number;
  z: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export default defineGenerator<Params>({
  id: "GH-G22.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.COSINE-RULE.ORDER"],

  params(rng) {
    const p = {
      b: rng.int(5, 14),
      c: rng.int(5, 14),
      A: rng.int(30, 120),
      x: rng.int(4, 12),
      y: rng.int(4, 12),
      z: rng.int(4, 12),
    };
    if (p.b === p.c || p.A === 90) reject("a general triangle");
    if (
      p.x + p.y <= p.z + 1 ||
      p.y + p.z <= p.x + 1 ||
      p.x + p.z <= p.y + 1 ||
      p.y === p.z ||
      p.x === p.z
    )
      reject("a clear triangle");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const sq = p.b ** 2 + p.c ** 2 - 2 * p.b * p.c * Math.cos(rad(p.A));
        const v = r1(Math.sqrt(sq));
        return A.standard({
          question: [`In triangle ABC, AB = ${p.c} cm, AC = ${p.b} cm and angle A = ${p.A}°.`],
          ask: "Find BC, in cm, to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.COSINE-RULE.ORDER",
              value: A.number(r1(sq), { accuracy: { dp: 1 } }),
              feedback: `That is BC². Take the square root.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `BC^2 = ${p.b}^2 + ${p.c}^2 - 2 \\times ${p.b} \\times ${p.c} \\cos ${p.A}^\\circ = ${r1(sq)} \\Rightarrow BC = ${v}`,
            },
          ],
        });
      }
      case 2: {
        // Angle opposite side x, between sides y and z.
        const v = r1(deg(Math.acos((p.y ** 2 + p.z ** 2 - p.x ** 2) / (2 * p.y * p.z))));
        const slip = r1(deg(Math.acos((p.x ** 2 + p.y ** 2 - p.z ** 2) / (2 * p.x * p.y))));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A triangle has sides ${p.x} cm, ${p.y} cm and ${p.z} cm.`],
              ask: `Find the angle opposite the ${p.x} cm side, to 1 decimal place.`,
            },
          ],
          answer: A.number(v, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.COSINE-RULE.ORDER",
              value: A.number(slip, { units: "°", accuracy: { dp: 1 } }),
              feedback: `The side being subtracted, a², must be the one opposite the angle: ${p.x} cm.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\cos\\theta = \\frac{${p.y}^2 + ${p.z}^2 - ${p.x}^2}{2 \\times ${p.y} \\times ${p.z}} \\Rightarrow \\theta = ${v}^\\circ`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "When A = 90°, the cosine rule ",
            A.math("a^2 = b^2 + c^2 - 2bc\\cos A"),
            " becomes Pythagoras' theorem.",
          ],
          truth: "always",
          reasons: [
            {
              text: "Always. cos 90° = 0, so the last term vanishes and a² = b² + c².",
              correct: true,
            },
            {
              text: "Never. The cosine rule is only for triangles without a right angle.",
              code: "GEO.COSINE-RULE.ORDER",
            },
            { text: "Sometimes. Only when b = c." },
          ],
          solution: [{ say: "The cosine rule is Pythagoras with a correction term." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return (
        numberAnswer(question) ===
        r1(Math.sqrt(p.b ** 2 + p.c ** 2 - 2 * p.b * p.c * Math.cos(rad(p.A))))
      );
    if (question.key.depth === 2)
      return (
        numberAnswer(question) ===
        r1(deg(Math.acos((p.y ** 2 + p.z ** 2 - p.x ** 2) / (2 * p.y * p.z))))
      );
    return true;
  },
});
