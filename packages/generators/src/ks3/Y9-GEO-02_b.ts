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

interface Params {
  r: number;
  h: number;
  r2: number;
  h2: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "Y9-GEO-02.b",
  version: "1.0.0",
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
        return A.trueOrFalseWhy({
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
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(Math.PI * p.r * p.r * p.h);
    if (question.key.depth === 2) return numberAnswer(question) === p.h2;
    return true;
  },
});
