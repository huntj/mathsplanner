/**
 * @statement Y7-GEO-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-GEO-02.b: Find the volume of other prisms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { lShape } from "../shared/mea.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  area: number;
  len: number;
  W: number;
  H: number;
  a: number;
  b: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "Y7-GEO-02.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.VOLUME.ADDS", "AS.MULTISTEP.ONE-STEP", "GEO.SOLIDS.PRISM-PYRAMID"],

  params(rng) {
    const p = {
      area: rng.int(6, 40),
      len: rng.int(3, 15),
      W: rng.int(5, 10),
      H: rng.int(4, 9),
      a: rng.int(2, 4),
      b: rng.int(2, 3),
      d: rng.int(3, 10),
    };
    if (p.a >= p.W - 1 || p.b >= p.H - 1) reject("a clear L-shape");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.area * p.len;
        return A.standard({
          question: [`A prism has a cross-section of area ${p.area} cm² and is ${p.len} cm long.`],
          ask: "Find its volume, in cm³.",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.VOLUME.ADDS",
              value: A.number(p.area + p.len),
              feedback: "Volume = area of cross-section × length.",
            },
          ]),
          solution: [{ say: "", math: `${p.area} \\times ${p.len} = ${v} \\text{ cm}^3` }],
        });
      }
      case 2: {
        const cross = p.W * p.H - p.a * p.b;
        const v = cross * p.d;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The L-shape is the cross-section of a prism ${p.d} cm long.`,
                A.figure(lShape(p.W, p.H, p.a, p.b, [0, 1, 2, 3, 4, 5])),
              ],
              ask: "Find the volume of the prism, in cm³.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(cross),
              feedback: `That is the area of the cross-section. Multiply by the length, ${p.d} cm.`,
            },
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(p.W * p.H * p.d),
              feedback: `Take away the missing ${p.a} by ${p.b} corner from the cross-section first.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `(${p.W} \\times ${p.H} - ${p.a} \\times ${p.b}) \\times ${p.d} = ${cross} \\times ${p.d} = ${v}`,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["A prism has the same cross-section all the way along its length."],
              truth: "always",
              reasons: [
                {
                  text: "Always. That is what makes it a prism, and why volume = cross-section × length works.",
                  correct: true,
                },
                {
                  text: "Sometimes. A pyramid is a prism that gets smaller.",
                  code: "GEO.SOLIDS.PRISM-PYRAMID",
                },
                {
                  text: "Never. The ends of a prism are always a different shape.",
                  code: "GEO.SOLIDS.PRISM-PYRAMID",
                },
              ],
              solution: [
                { say: "Slice a prism anywhere parallel to its end and you get the same shape." },
              ],
            }),
          [
            {
              statement: `Tim says a prism with a cross-section of ${p.area} cm² and a length of ${p.len} cm has a volume of ${p.area * p.len} cm³.`,
              truth: true,
              right: "True. The volume of a prism = the area of its cross-section × its length.",
              wrong: [
                [`False. It is ${p.area} + ${p.len} = ${p.area + p.len} cm³.`, "MEA.VOLUME.ADDS"],
                ["False. You have to divide it by 3 as well.", "GEO.SOLIDS.PRISM-PYRAMID"],
              ],
            },
            {
              statement: "Uma says a square-based pyramid is a prism.",
              truth: false,
              right:
                "False. A pyramid narrows to a point, so its cross-section is not the same all the way along.",
              wrong: [
                ["True. It has a square base, like a cube.", "GEO.SOLIDS.PRISM-PYRAMID"],
                ["True. Any solid with flat faces is a prism.", "GEO.SOLIDS.PRISM-PYRAMID"],
              ],
            },
            {
              claim: "Two prisms with the same volume have the same length.",
              truth: "sometimes",
              right:
                "Sometimes. Prisms with cross-sections of 10 cm² and 12 cm², and lengths of 6 cm and 5 cm, both hold 60 cm³.",
              wrong: [
                ["Always. The same volume means the same shape."],
                ["Never. Two different prisms can never match."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.area * p.len;
    if (question.key.depth === 2) return numberAnswer(question) === (p.W * p.H - p.a * p.b) * p.d;
    return true;
  },
});
