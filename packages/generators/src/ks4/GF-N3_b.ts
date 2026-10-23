/**
 * @statement GF-N3.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N3.b: Use priority of operations including brackets, powers, roots and reciprocals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  n: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "GF-N3.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ORDER.LEFT-TO-RIGHT", "NPV.RECIPROCAL.NEGATIVE"],

  params(rng) {
    const p = {
      a: rng.int(2, 9),
      b: rng.int(2, 5),
      c: rng.int(2, 4),
      n: rng.int(2, 9),
      d: rng.int(2, 9),
    };
    if (p.n === p.d || gcdOf(p.n, p.d) > 1) reject("a fraction in its simplest form");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.a + p.b * p.c * p.c;
        return A.standard({
          question: ["Work out ", A.math(`${p.a} + ${p.b} \\times ${p.c}^2`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number((p.a + p.b) * p.c * p.c),
              feedback: "Powers first, then multiply, then add.",
            },
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number(p.a + (p.b * p.c) ** 2),
              feedback: `Only the ${p.c} is squared, not ${p.b} × ${p.c}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.a} + ${p.b} \\times ${p.c * p.c} = ${p.a} + ${p.b * p.c * p.c} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = frac(p.d, p.n);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Write down the reciprocal of ", A.math(`\\frac{${p.n}}{${p.d}}`), "."] },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "NPV.RECIPROCAL.NEGATIVE",
              value: A.exact(frac(-p.n, p.d)),
              feedback: "The reciprocal is 1 divided by the number: turn the fraction upside down.",
            },
          ],
          solution: [{ say: "", math: `1 \\div \\frac{${p.n}}{${p.d}} = ${toLatex(v)}` }],
        });
      }
      default:
        return A.spotTheMistake({
          question: ["Theo works out ", A.math(`${p.a} + ${p.b} \\times ${p.c}`), "."],
          lines: [[A.math(`= ${p.a + p.b} \\times ${p.c}`)], [A.math(`= ${(p.a + p.b) * p.c}`)]],
          mistake: 0,
          code: "NPV.ORDER.LEFT-TO-RIGHT",
          feedback: `Multiply before adding: ${p.b} × ${p.c} = ${p.b * p.c}, so the answer is ${p.a + p.b * p.c}.`,
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a + p.b * p.c * p.c;
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(p.d, p.n));
    return true;
  },
});
