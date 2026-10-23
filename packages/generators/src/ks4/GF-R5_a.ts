/**
 * @statement GF-R5.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R5.a: Divide a quantity in a part:part ratio
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "GF-R5.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.SHARE.WRONG-TOTAL", "RAT.SIMPLIFY.SUBTRACT"],

  params(rng) {
    const p = { a: rng.int(1, 6), b: rng.int(2, 9), k: rng.int(3, 25), c: rng.int(1, 4) };
    if (p.a >= p.b) reject("a smaller first part");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const total = (p.a + p.b) * p.k;
    switch (depth) {
      case 1: {
        const v = p.b * p.k;
        return A.standard({
          question: [`Ali and Ben share £${total} in the ratio ${p.a} : ${p.b}.`],
          ask: "How much does Ben get?",
          answer: A.number(v, { units: "£" }),
          wrong: wrongs(v, [
            Number.isInteger(total / 2)
              ? {
                  code: "RAT.SHARE.WRONG-TOTAL",
                  value: A.number(total / 2, { units: "£" }),
                  feedback: `There are ${p.a} + ${p.b} = ${p.a + p.b} parts, not 2.`,
                }
              : undefined,
            Number.isInteger(total / p.b)
              ? {
                  code: "RAT.SHARE.WRONG-TOTAL",
                  value: A.number(total / p.b, { units: "£" }),
                  feedback: `Divide by the total number of parts, ${p.a + p.b}, to find one part.`,
                }
              : undefined,
          ]),
          solution: [
            {
              say: "",
              math: `${total} \\div ${p.a + p.b} = ${p.k}, \\; ${p.b} \\times ${p.k} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const diff = (p.b - p.a) * p.k;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Cat and Dev share some money in the ratio ${p.a} : ${p.b}. Dev gets £${diff} more than Cat.`,
              ],
              ask: "How much money did they share altogether?",
            },
            {
              question: [
                `Red and blue beads are in the ratio ${p.a} : ${p.b}. There are ${diff} more blue beads than red.`,
              ],
              ask: "How many beads are there altogether?",
            },
          ],
          answer: A.number(total),
          wrong: wrongs(total, [
            {
              code: "RAT.SHARE.WRONG-TOTAL",
              value: A.number(diff * (p.a + p.b)),
              feedback: `The difference, ${diff}, is ${p.b - p.a} parts, so one part is ${p.k}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.b - p.a} \\text{ parts} = ${diff}, \\; 1 \\text{ part} = ${p.k}, \\; ${p.a + p.b} \\text{ parts} = ${total}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ivy says ",
            A.math(`${p.a} : ${p.b}`),
            " is the same ratio as ",
            A.math(`${p.a + p.c} : ${p.b + p.c}`),
            ` because you add ${p.c} to both parts.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Equal ratios multiply both parts by the same number. ${p.a} : ${p.b} = ${p.a * 2} : ${p.b * 2}, for example.`,
              correct: true,
            },
            {
              text: "True. Doing the same to both parts keeps the ratio.",
              code: "RAT.SIMPLIFY.SUBTRACT",
            },
            {
              text: "True. The difference between the parts stays the same.",
              code: "RAT.SIMPLIFY.SUBTRACT",
            },
          ],
          solution: [{ say: `${p.a}/${p.b} is not equal to ${p.a + p.c}/${p.b + p.c}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.b * p.k;
    if (question.key.depth === 2) return numberAnswer(question) === (p.a + p.b) * p.k;
    return true;
  },
});
