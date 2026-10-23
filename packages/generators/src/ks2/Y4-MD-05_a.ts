/**
 * @statement Y4-MD-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y4-MD-05.a: Use the distributive law to multiply
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** n = 10t + u, multiplied by k. */
  t: number;
  u: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y4-MD-05.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.PARTITION.MISSES-PARTS"],

  params(rng, numbers) {
    const p = {
      t: rng.int(1, numbers === "friendly" ? 3 : numbers === "standard" ? 6 : 9),
      u: rng.int(2, 9),
      k: rng.int(3, numbers === "friendly" ? 5 : 9),
    };
    if (p.u === p.k) reject("different numbers");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const n = 10 * p.t + p.u;
    const tens = 10 * p.t * p.k;
    const ones = p.u * p.k;
    const answer = n * p.k;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Use ",
            A.math(`${n} \\times ${p.k} = ${10 * p.t} \\times ${p.k} + ${p.u} \\times ${p.k}`),
            ".",
          ],
          ask: ["Work out ", A.math(`${n} \\times ${p.k}`), "."],
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "MD.PARTITION.MISSES-PARTS",
              value: A.number(tens + p.u),
              feedback: `Multiply both parts by ${p.k}: the ${p.u} as well as the ${10 * p.t}.`,
            },
          ]),
          solution: [{ say: "", math: `${tens} + ${ones} = ${answer}` }],
        });
      case 2:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: [
            `${p.k} \\times ${n}`,
            "=",
            `${p.k} \\times ${10 * p.t} +`,
            `${p.k} \\times`,
            p.u,
          ],
          hide: 4,
          wrong: wrongs(p.u, [
            {
              code: "MD.PARTITION.MISSES-PARTS",
              value: A.number(ones),
              feedback: `Split ${n} into ${10 * p.t} and ${p.u}. The missing number is the part, not its product.`,
            },
          ]),
          solution: [
            {
              say: `${n} = ${10 * p.t} + ${p.u}, so ${p.k} × ${n} = ${p.k} × ${10 * p.t} + ${p.k} × ${p.u}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Nadia works out ",
            A.math(`${n} \\times ${p.k}`),
            " as ",
            A.math(`${10 * p.t} \\times ${p.k} + ${p.u} = ${tens + p.u}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Both parts must be multiplied: ${tens} + ${ones} = ${answer}.`,
              correct: true,
            },
            { text: "True. You only multiply the tens.", code: "MD.PARTITION.MISSES-PARTS" },
            {
              text: `True. Adding ${p.u} at the end is the same as multiplying it.`,
              code: "MD.PARTITION.MISSES-PARTS",
            },
          ],
          solution: [{ say: "", math: `${n} \\times ${p.k} = ${tens} + ${ones} = ${answer}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (10 * p.t + p.u) * p.k;
    if (question.key.depth === 2) return numberAnswer(question) === p.u;
    return true;
  },
});
