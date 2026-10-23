/**
 * @statement GF-N7.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N7.a: Calculate with roots
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  n: number;
  big: number;
  x: number;
  y: number;
}

export default defineGenerator<Params>({
  id: "GF-N7.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.POWER.ROOT-HALF", "NPV.SURD.ADD-INSIDE"],

  params(rng) {
    const p = {
      k: rng.pick([2, 3, 5, 6, 7]),
      n: rng.int(2, 4),
      big: rng.int(10, 99),
      x: rng.int(2, 9),
      y: rng.int(2, 9),
    };
    if (Number.isInteger(Math.sqrt(p.big))) reject("a number that is not square");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const b = p.k * p.n * p.n;
        const v = p.k * p.n;
        const half = (p.k * b) / 2;
        return A.standard({
          question: ["Work out ", A.math(`\\sqrt{${p.k}} \\times \\sqrt{${b}}`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            Number.isInteger(half)
              ? {
                  code: "NPV.POWER.ROOT-HALF",
                  value: A.number(half),
                  feedback: `√${p.k} × √${b} = √${p.k * b}: take the square root of ${p.k * b}, do not halve it.`,
                }
              : undefined,
          ]),
          solution: [
            { say: "", math: `\\sqrt{${p.k}} \\times \\sqrt{${b}} = \\sqrt{${p.k * b}} = ${v}` },
          ],
        });
      }
      case 2: {
        const f = Math.floor(Math.sqrt(p.big));
        const h = Math.floor(p.big / 2);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Between which two whole numbers does ", A.math(`\\sqrt{${p.big}}`), " lie?"],
          correct: `${f} and ${f + 1}`,
          distractors: [
            {
              content: `${h} and ${h + 1}`,
              code: "NPV.POWER.ROOT-HALF",
              feedback: `Halving ${p.big} is not the same as square rooting it.`,
            },
            {
              content: `${f - 1} and ${f}`,
              feedback: `${f}² = ${f * f}, which is less than ${p.big}.`,
            },
          ],
          solution: [
            { say: "", math: `${f}^2 = ${f * f} < ${p.big} < ${(f + 1) ** 2} = ${f + 1}^2` },
          ],
        });
      }
      default: {
        const s = p.x * p.x + p.y * p.y;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Remy says ",
            A.math(`\\sqrt{${p.x * p.x}} + \\sqrt{${p.y * p.y}} = \\sqrt{${s}}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The left side is ${p.x} + ${p.y} = ${p.x + p.y}, but ${p.x + p.y}² = ${(p.x + p.y) ** 2}, not ${s}.`,
              correct: true,
            },
            { text: "True. You can add the numbers under the roots.", code: "NPV.SURD.ADD-INSIDE" },
            { text: "True. Square roots work like ordinary numbers.", code: "NPV.SURD.ADD-INSIDE" },
          ],
          solution: [{ say: "√a × √b = √(ab), but √a + √b is not √(a + b)." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k * p.n;
    if (question.key.depth === 2) {
      const f = Math.floor(Math.sqrt(p.big));
      return chosenText(question) === `${f} and ${f + 1}`;
    }
    return true;
  },
});
