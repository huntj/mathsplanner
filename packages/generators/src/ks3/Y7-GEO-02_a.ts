/**
 * @statement Y7-GEO-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-02.a: Find the volume of cuboids and cubes
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  e: number;
  l: number;
  w: number;
  h: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-02.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.SQUARE.DOUBLES", "MEA.VOLUME.ADDS", "MEA.SURFACE.VOLUME"],

  params(rng) {
    const p = { e: rng.int(3, 10), l: rng.int(4, 12), w: rng.int(2, 8), h: rng.int(2, 9) };
    if (p.l === p.w || p.w === p.h || p.l === p.h) reject("three different edges");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.e ** 3;
        return A.standard({
          question: [`A cube has edges ${p.e} cm long.`],
          ask: "Find its volume, in cm³.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MD.SQUARE.DOUBLES",
              value: A.number(3 * p.e),
              feedback: `${p.e}³ means ${p.e} × ${p.e} × ${p.e}.`,
            },
            {
              code: "MEA.SURFACE.VOLUME",
              value: A.number(6 * p.e * p.e),
              feedback: "That is the surface area. Volume is length × width × height.",
            },
          ]),
          solution: [
            { say: "", math: `${p.e} \\times ${p.e} \\times ${p.e} = ${v} \\text{ cm}^3` },
          ],
        });
      }
      case 2: {
        const vol = p.l * p.w * p.h;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A cuboid has volume ${vol} cm³. It is ${p.l} cm long and ${p.w} cm wide.`,
              ],
              ask: "How high is it, in cm?",
            },
            {
              question: [
                `A fish tank holds ${vol} cm³ of water when full. Its base is ${p.l} cm by ${p.w} cm.`,
              ],
              ask: "How deep is the water, in cm?",
            },
          ],
          answer: A.number(p.h),
          wrong: wrongs(p.h, [
            {
              code: "MEA.VOLUME.ADDS",
              value: A.number(vol - p.l - p.w),
              feedback: `Volume = l × w × h, so divide by ${p.l} × ${p.w} = ${p.l * p.w}.`,
            },
          ]),
          solution: [{ say: "", math: `${vol} \\div (${p.l} \\times ${p.w}) = ${p.h}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `A ${p.l} by ${p.w} by ${p.h} cm cuboid and a ${p.l * p.w} by ${p.h} by 1 cm cuboid have the same volume. Ana says they must have the same surface area.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Same volume does not mean same surface area: ${2 * (p.l * p.w + p.l * p.h + p.w * p.h)} cm² and ${2 * (p.l * p.w * p.h + p.l * p.w + p.h)} cm².`,
              correct: true,
            },
            {
              text: "True. They are made of the same number of cubes.",
              code: "MEA.SURFACE.VOLUME",
            },
            {
              text: "True. Volume and surface area always go together.",
              code: "MEA.SURFACE.VOLUME",
            },
          ],
          solution: [
            { say: "Volume counts the cubes inside; surface area counts the squares outside." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.e ** 3;
    if (question.key.depth === 2) return numberAnswer(question) === p.h;
    return true;
  },
});
