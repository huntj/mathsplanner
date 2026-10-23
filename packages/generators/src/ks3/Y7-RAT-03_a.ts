/**
 * @statement Y7-RAT-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-RAT-03.a: Divide a quantity in a part:part ratio
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-RAT-03.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.SHARE.WRONG-TOTAL", "RAT.ADDITIVE", "RAT.PART-WHOLE"],

  params(rng) {
    const p = { a: rng.int(1, 5), b: rng.int(2, 7), k: rng.int(2, 12) };
    if (p.a >= p.b) reject("a smaller first part");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const total = (p.a + p.b) * p.k;
    switch (depth) {
      case 1: {
        const v = p.a * p.k;
        return A.standard({
          question: [
            `${total} sweets are shared between Ella and Finn in the ratio ${p.a} : ${p.b}.`,
          ],
          ask: "How many does Ella get?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.SHARE.WRONG-TOTAL",
              value: A.number(Math.round(total / 2)),
              feedback: `The sweets are not shared equally: there are ${p.a + p.b} parts.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${total} \\div ${p.a + p.b} = ${p.k}, \\; ${p.a} \\times ${p.k} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const ella = p.a * p.k;
        const v = p.b * p.k;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Ella and Finn share some money in the ratio ${p.a} : ${p.b}. Ella gets £${ella}.`,
              ],
              ask: "How much does Finn get?",
            },
            {
              question: [
                `Squash and water are mixed in the ratio ${p.a} : ${p.b}. Lucy uses ${ella} ml of squash.`,
              ],
              ask: "How much water does she need, in ml?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(ella + (p.b - p.a)),
              feedback: `${p.a} part${p.a === 1 ? " is" : "s are"} ${ella}, so one part is ${p.k}: multiply, do not add.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `1 \\text{ part} = ${ella} \\div ${p.a} = ${p.k}, \\; ${p.b} \\times ${p.k} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Ella and Finn share money in the ratio 1 : ${p.b}. Ella says she gets `,
            A.math(`\\frac{1}{${p.b}}`),
            " of the money.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. There are 1 + ${p.b} = ${p.b + 1} parts, so she gets 1/${p.b + 1} of the money.`,
              correct: true,
            },
            { text: "True. The ratio 1 : n always means 1/n.", code: "RAT.PART-WHOLE" },
            { text: `True. Finn gets ${p.b} times as much as Ella.`, code: "RAT.PART-WHOLE" },
          ],
          solution: [{ say: "Add the parts of the ratio to find the whole." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a * p.k;
    if (question.key.depth === 2) return numberAnswer(question) === p.b * p.k;
    return true;
  },
});
