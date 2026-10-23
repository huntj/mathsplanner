/**
 * @statement GH-G22.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-G22.a: Apply the sine rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { triangle } from "../shared/geo.ts";

interface Params {
  A: number;
  B: number;
  side: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export default defineGenerator<Params>({
  id: "GH-G22.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SINE-RULE.PAIR"],

  params(rng) {
    const p = { A: rng.int(35, 80), B: rng.int(35, 80), side: rng.int(6, 15) };
    if (Math.abs(p.A - p.B) < 8 || p.A + p.B > 140) reject("a clear triangle");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    // a = BC is opposite A; b = CA is opposite B.
    const b = p.side;
    const a = (b * Math.sin(rad(p.A))) / Math.sin(rad(p.B));
    const ab = (b * Math.sin(rad(180 - p.A - p.B))) / Math.sin(rad(p.B));
    switch (depth) {
      case 1: {
        const v = r1(a);
        return A.standard({
          question: [
            A.figure(
              triangle(
                p.A,
                ab,
                p.B,
                { ca: `${b}\\text{ cm}`, bc: "x" },
                { A: `${p.A}^\\circ`, B: `${p.B}^\\circ` },
              ),
            ),
          ],
          ask: "Find the length x, in cm, to 1 decimal place.",
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "GEO.SINE-RULE.PAIR",
              value: A.number(r1((b * Math.sin(rad(p.B))) / Math.sin(rad(p.A))), {
                accuracy: { dp: 1 },
              }),
              feedback: `Pair each side with the angle opposite it: x is opposite ${p.A}°, and the ${b} cm side is opposite ${p.B}°.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{x}{\\sin ${p.A}^\\circ} = \\frac{${b}}{\\sin ${p.B}^\\circ} \\Rightarrow x = ${v} \\text{ cm}`,
            },
          ],
        });
      }
      case 2: {
        const known = r1(a);
        const v = r1(deg(Math.asin((b * Math.sin(rad(p.A))) / known)));
        // Pairing the sides the wrong way round, when that still gives a sine of at most 1.
        const swapped = (known * Math.sin(rad(p.A))) / b;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.figure(
                  triangle(
                    p.A,
                    ab,
                    p.B,
                    { ca: `${b}\\text{ cm}`, bc: `${known}\\text{ cm}` },
                    { A: `${p.A}^\\circ`, B: "\\theta" },
                  ),
                ),
              ],
              ask: "Find the acute angle θ, to 1 decimal place.",
            },
          ],
          answer: A.number(v, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            swapped < 1
              ? {
                  code: "GEO.SINE-RULE.PAIR",
                  value: A.number(r1(deg(Math.asin(swapped))), { units: "°", accuracy: { dp: 1 } }),
                  feedback: `θ is opposite the ${b} cm side, and ${p.A}° is opposite the ${known} cm side.`,
                }
              : undefined,
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{\\sin\\theta}{${b}} = \\frac{\\sin ${p.A}^\\circ}{${known}} \\Rightarrow \\theta = ${v}^\\circ`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Dan says that in the sine rule, ",
            A.math("\\frac{a}{\\sin A} = \\frac{b}{\\sin B}"),
            ", side a can be any side next to angle A.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Side a must be opposite angle A, and side b opposite angle B.",
              correct: true,
            },
            { text: "True. Any side touching the angle works.", code: "GEO.SINE-RULE.PAIR" },
            {
              text: "True. The sine rule works for any side and angle.",
              code: "GEO.SINE-RULE.PAIR",
            },
          ],
          solution: [
            { say: "Lower-case letters name the sides opposite the capital-letter angles." },
          ],
        });
    }
  },

  verify(p, question) {
    const a = (p.side * Math.sin(rad(p.A))) / Math.sin(rad(p.B));
    if (question.key.depth === 1) return numberAnswer(question) === r1(a);
    if (question.key.depth === 2)
      return numberAnswer(question) === r1(deg(Math.asin((p.side * Math.sin(rad(p.A))) / r1(a))));
    return true;
  },
});
