/**
 * @statement Y8-ALG-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-ALG-02.a: Use standard mathematical formulae
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  t: number;
  r: number;
  m: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "Y8-ALG-02.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SUBSTITUTE.ORDER", "MEA.CIRCLE.FORMULA"],

  params(rng) {
    return { a: rng.int(1, 5) * 2, t: rng.int(2, 8), r: rng.int(2, 12), m: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = (p.a * p.t * p.t) / 2;
        return A.standard({
          question: [
            "An object starts from rest. The distance it travels is ",
            A.math("s = \\frac{1}{2}at^2"),
            ".",
          ],
          ask: `Find s when a = ${p.a} and t = ${p.t}.`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SUBSTITUTE.ORDER",
              value: A.number((p.a * p.t) ** 2 / 2),
              feedback: "Only t is squared: work out t² first, then multiply by a and halve.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `s = \\frac{1}{2} \\times ${p.a} \\times ${p.t}^2 = \\frac{1}{2} \\times ${p.a} \\times ${p.t * p.t} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = r1(Math.PI * p.r * p.r);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The area of a circle is ", A.math("A = \\pi r^2"), "."],
              ask: `Find A when r = ${p.r}, to 1 decimal place.`,
            },
          ],
          answer: A.number(v, { accuracy: { dp: 1 } }),
          wrong: wrongs(v, [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1(Math.PI * 2 * p.r), { accuracy: { dp: 1 } }),
              feedback: "r² means r × r, not 2 × r.",
            },
          ]),
          solution: [{ say: "", math: `\\pi \\times ${p.r}^2 = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Using ",
            A.math("E = mc^2"),
            `, Eva says that if m is multiplied by ${p.m}, E is multiplied by ${p.m} too.`,
          ],
          truth: true,
          reasons: [
            {
              text: `True. c² is fixed, so E is proportional to m: ${p.m}m gives ${p.m}mc².`,
              correct: true,
            },
            {
              text: `False. E is multiplied by ${p.m * p.m}, because of the square.`,
              code: "ALG.SUBSTITUTE.ORDER",
            },
            { text: "False. E stays the same.", code: "ALG.SUBSTITUTE.ORDER" },
          ],
          solution: [{ say: "Only c is squared." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.a * p.t * p.t) / 2;
    if (question.key.depth === 2) return numberAnswer(question) === r1(Math.PI * p.r * p.r);
    return true;
  },
});
