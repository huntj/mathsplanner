/**
 * @statement GF-G16.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-G16.b: Find the volume of prisms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { cuboid } from "../shared/mea.ts";

interface Params {
  l: number;
  w: number;
  h: number;
  a: number;
  b: number;
  len: number;
}

export default defineGenerator<Params>({
  id: "GF-G16.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.VOLUME.ADDS", "MEA.AREA.TRIANGLE-HALF"],

  params(rng) {
    const p = {
      l: rng.int(3, 12),
      w: rng.int(2, 8),
      h: rng.int(2, 8),
      a: rng.int(3, 12),
      b: rng.int(3, 12),
      len: rng.int(5, 20),
    };
    if (p.l === p.w || p.w === p.h || p.l === p.h) reject("three different edges");
    if ((p.a * p.b) % 2 !== 0) reject("a whole-number cross-section");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.l * p.w * p.h;
        return A.standard({
          question: [A.figure(cuboid(p.l, p.w, p.h))],
          ask: "Find the volume of the cuboid, in cm³.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.VOLUME.ADDS",
              value: A.number(p.l + p.w + p.h),
              feedback: "Volume is length × width × height.",
            },
          ]),
          solution: [
            { say: "", math: `${p.l} \\times ${p.w} \\times ${p.h} = ${v} \\text{ cm}^3` },
          ],
        });
      }
      case 2: {
        const v = ((p.a * p.b) / 2) * p.len;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A prism is ${p.len} cm long. Its cross-section is a right-angled triangle with shorter sides ${p.a} cm and ${p.b} cm.`,
              ],
              ask: "Find its volume, in cm³.",
            },
            {
              question: [
                `A wedge-shaped door stop is a prism ${p.len} cm long. Its end is a right-angled triangle, ${p.a} cm by ${p.b} cm along the right angle.`,
              ],
              ask: "Find the volume of the door stop, in cm³.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.AREA.TRIANGLE-HALF",
              value: A.number(p.a * p.b * p.len),
              feedback: "The cross-section is a triangle: its area is ½ × base × height.",
            },
          ]),
          solution: [
            {
              say: "Area of cross-section × length: ",
              math: `\\frac{1}{2} \\times ${p.a} \\times ${p.b} \\times ${p.len} = ${v} \\text{ cm}^3`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["Doubling the length of a prism doubles its volume."],
          truth: "always",
          reasons: [
            {
              text: "Always. Volume = area of cross-section × length, and the cross-section does not change.",
              correct: true,
            },
            { text: "Sometimes. Only for cuboids." },
            { text: "Never. It makes the volume 8 times bigger.", code: "MEA.VOLUME.ADDS" },
          ],
          solution: [{ say: "Only one of the three dimensions doubles." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.l * p.w * p.h;
    if (question.key.depth === 2) return numberAnswer(question) === ((p.a * p.b) / 2) * p.len;
    return true;
  },
});
