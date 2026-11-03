/**
 * @statement Y9-GEO-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-GEO-02.b: Calculate the volume of cylinders
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { cylinder } from "../shared/solids.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  r: number;
  h: number;
  r2: number;
  h2: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "Y9-GEO-02.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.CIRCLE.FORMULA", "MD.SQUARE.DOUBLES"],

  params(rng) {
    const p = { r: rng.int(2, 9), h: rng.int(4, 20), r2: rng.int(2, 6), h2: rng.int(3, 12) };
    if (p.h > 4 * p.r || p.r > 3 * p.h || p.r2 === 2)
      reject("a sensible cylinder, and a radius where squaring and doubling differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = r1(Math.PI * p.r * p.r * p.h);
        return A.standard({
          question: [`The cylinder has radius ${p.r} cm.`, A.figure(cylinder(p.r, p.h))],
          ask: "Find its volume, in cm³, to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1(2 * Math.PI * p.r * p.h), { accuracy: { dp: 1 } }),
              feedback: "Volume = area of the circular end × height, and the area is πr².",
            },
          ]),
          solution: [
            { say: "", math: `\\pi \\times ${p.r}^2 \\times ${p.h} = ${v} \\text{ cm}^3` },
          ],
        });
      }
      case 2: {
        const k = p.r2 * p.r2 * p.h2;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A cylinder has volume ",
                A.math(`${k}\\pi`),
                ` cm³ and radius ${p.r2} cm.`,
              ],
              ask: "Find its height, in cm.",
            },
            {
              question: [
                `A cylindrical tin of radius ${p.r2} cm holds `,
                A.math(`${k}\\pi`),
                " cm³.",
              ],
              ask: "How tall is the tin, in cm?",
            },
          ],
          answer: A.number(p.h2),
          wrong: wrongs(p.h2, [
            Number.isInteger(k / (2 * p.r2))
              ? {
                  code: "MD.SQUARE.DOUBLES",
                  value: A.number(k / (2 * p.r2)),
                  feedback: `r² = ${p.r2} × ${p.r2} = ${p.r2 * p.r2}, not ${p.r2} × 2.`,
                }
              : {
                  code: "MEA.CIRCLE.FORMULA",
                  value: A.number(k / p.r2),
                  feedback: `Divide by r², which is ${p.r2 * p.r2}.`,
                },
          ]),
          solution: [
            {
              say: "",
              math: `\\pi \\times ${p.r2}^2 \\times h = ${k}\\pi \\Rightarrow h = ${k} \\div ${p.r2 * p.r2} = ${p.h2}`,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                `Mo says doubling the height of a cylinder of radius ${p.r} cm doubles its volume.`,
              ],
              truth: true,
              reasons: [
                {
                  text: "True. Volume = πr²h, and the height is not squared, so doubling h doubles the volume.",
                  correct: true,
                },
                { text: "False. It multiplies the volume by 4.", code: "MD.SQUARE.DOUBLES" },
                {
                  text: "False. The volume does not depend on the height.",
                  code: "MEA.CIRCLE.FORMULA",
                },
              ],
              solution: [{ say: "Doubling the radius would multiply it by 4." }],
            }),
          [
            {
              statement:
                "A cylinder has radius 3 cm and height 5 cm. Raj says its volume is $45\\pi$ cm³.",
              truth: true,
              right: "True. V = πr²h = π × 9 × 5 = 45π cm³.",
              wrong: [
                ["False. It is 30π cm³, as 3² = 6.", "MD.SQUARE.DOUBLES"],
                ["False. It is 2π × 3 × 5 = 30π cm³.", "MEA.CIRCLE.FORMULA"],
              ],
            },
            {
              statement: "Eve says doubling the radius of a cylinder doubles its volume.",
              truth: false,
              right: "False. V = πr²h, so doubling r multiplies the volume by 4.",
              wrong: [
                ["True. The volume goes up as the radius does.", "MD.SQUARE.DOUBLES"],
                ["True. Doubling any length doubles the volume."],
              ],
            },
            {
              claim: "A cylinder's volume is its cross-section area times its height.",
              truth: "always",
              right: "Always. A cylinder is a prism with a circle for its cross-section.",
              wrong: [
                ["Never. Cylinders need a different formula.", "MEA.CIRCLE.FORMULA"],
                ["Sometimes. Only when the height is bigger than the radius."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(Math.PI * p.r * p.r * p.h);
    if (question.key.depth === 2) return numberAnswer(question) === p.h2;
    return true;
  },
});
