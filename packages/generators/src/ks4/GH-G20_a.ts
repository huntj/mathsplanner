/**
 * @statement GH-G20.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-G20.a: Use Pythagoras in 3D
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { cuboid } from "../shared/mea.ts";

interface Params {
  l: number;
  w: number;
  h: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GH-G20.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.3D.WRONG-TRIANGLE", "GEO.PYTHAG.NO-SQUARE"],

  params(rng) {
    const p = { l: rng.int(5, 12), w: rng.int(3, 8), h: rng.int(3, 8) };
    if (p.l === p.w || p.w === p.h || p.l === p.h) reject("three different edges");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(Math.sqrt(p.l ** 2 + p.w ** 2 + p.h ** 2));
        return A.standard({
          question: ["The diagram shows a cuboid.", A.figure(cuboid(p.l, p.w, p.h))],
          ask: "Find the length of a diagonal from one corner to the opposite corner, through the inside of the cuboid, in cm to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.3D.WRONG-TRIANGLE",
              value: A.number(r1(Math.hypot(p.l, p.w)), { accuracy: { dp: 1 } }),
              feedback:
                "That is the diagonal of the base. Use it with the height in a second right-angled triangle.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\sqrt{${p.l}^2 + ${p.w}^2 + ${p.h}^2} = \\sqrt{${p.l ** 2 + p.w ** 2 + p.h ** 2}} = ${v} \\text{ cm}`,
            },
          ],
        });
      }
      case 2: {
        const v = r1(Math.hypot(p.l, p.w));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A box has a base ${p.l} cm by ${p.w} cm and is ${p.h} cm tall.`],
              ask: "Find the length of the diagonal across its base, in cm, to 1 decimal place.",
            },
            {
              question: [`A rectangular floor is ${p.l} m by ${p.w} m.`],
              ask: "How far is it from one corner to the opposite corner, in m, to 1 decimal place?",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.PYTHAG.NO-SQUARE",
              value: A.number(p.l + p.w, { accuracy: { dp: 1 } }),
              feedback: "Square both sides, add, then square root.",
            },
          ]),
          solution: [{ say: "", math: `\\sqrt{${p.l}^2 + ${p.w}^2} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Jay says the longest straight rod that fits inside a ${p.l} cm by ${p.w} cm by ${p.h} cm box is ${p.l} cm long.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. It fits along the space diagonal, √(${p.l}² + ${p.w}² + ${p.h}²) ≈ ${r1(Math.sqrt(p.l ** 2 + p.w ** 2 + p.h ** 2))} cm.`,
              correct: true,
            },
            {
              text: "True. The longest edge is the longest length.",
              code: "GEO.3D.WRONG-TRIANGLE",
            },
            {
              text: `True. It fits across the base diagonal, ${p.l} cm.`,
              code: "GEO.3D.WRONG-TRIANGLE",
            },
          ],
          solution: [
            { say: "Corner to opposite corner through the inside is the longest distance." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r1(Math.sqrt(p.l ** 2 + p.w ** 2 + p.h ** 2));
    if (question.key.depth === 2) return numberAnswer(question) === r1(Math.hypot(p.l, p.w));
    return true;
  },
});
