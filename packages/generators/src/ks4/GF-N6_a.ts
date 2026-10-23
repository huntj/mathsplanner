/**
 * @statement GF-N6.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N6.a: Use positive integer powers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  n: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GF-N6.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.POWER.TIMES-INDEX", "ALG.SUBSTITUTE.NEGATIVE-SQUARE"],

  params(rng) {
    const a = rng.int(2, 6);
    return { a, n: rng.int(3, a > 4 ? 3 : 5), b: rng.int(2, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.a ** p.n;
        return A.standard({
          question: ["Work out ", A.math(`${p.a}^${p.n}`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.POWER.TIMES-INDEX",
              value: A.number(p.a * p.n),
              feedback: `${p.a}^${p.n} means ${Array(p.n).fill(p.a).join(" × ")}.`,
            },
          ]),
          solution: [{ say: "", math: `${Array(p.n).fill(p.a).join(" \\times ")} = ${v}` }],
        });
      }
      case 2: {
        const v = p.a * p.a + p.b ** 3;
        return A.variedForm({
          rng,
          forms: [{ question: ["Work out ", A.math(`(-${p.a})^2 + ${p.b}^3`), "."] }],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
              value: A.number(-p.a * p.a + p.b ** 3),
              feedback: `(−${p.a})² = (−${p.a}) × (−${p.a}) = ${p.a * p.a}, which is positive.`,
            },
            {
              code: "NPV.POWER.TIMES-INDEX",
              value: A.number(p.a * p.a + 3 * p.b),
              feedback: `${p.b}³ = ${p.b} × ${p.b} × ${p.b}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.a * p.a} + ${p.b ** 3} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Kai says ", A.math(`${p.a}^${p.n} = ${p.a * p.n}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. ${p.a}^${p.n} is ${p.a} multiplied by itself ${p.n} times, which is ${p.a ** p.n}.`,
              correct: true,
            },
            {
              text: `True. The power tells you to multiply by ${p.n}.`,
              code: "NPV.POWER.TIMES-INDEX",
            },
            { text: `False. It is ${p.a + p.n}.`, code: "NPV.POWER.TIMES-INDEX" },
          ],
          solution: [{ say: "The index counts how many times the base is used as a factor." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a ** p.n;
    if (question.key.depth === 2) return numberAnswer(question) === p.a * p.a + p.b ** 3;
    return true;
  },
});
