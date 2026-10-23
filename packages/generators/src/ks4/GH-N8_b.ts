/**
 * @statement GH-N8.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-N8.b: Calculate exactly with surds
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, Surd, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  c: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GH-N8.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.SURD.ADD-INSIDE", "ALG.EXPAND.NEGATIVE", "ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng) {
    const p = {
      a: rng.int(1, 4),
      c: rng.int(2, 5),
      b: rng.pick([2, 3, 5, 6, 7]),
      k: rng.int(2, 9),
    };
    if (p.a === p.c) reject("two different surds");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const x = p.a * p.a * p.b;
    const y = p.c * p.c * p.b;
    switch (depth) {
      case 1: {
        const sum = Surd.term(p.a + p.c, p.b);
        return A.standard({
          question: ["Simplify ", A.math(`\\sqrt{${x}} + \\sqrt{${y}}`), "."],
          answer: A.exact(sum, "surd"),
          wrong: [
            {
              code: "NPV.SURD.ADD-INSIDE",
              value: A.exact(Surd.term(1, x + y)),
              feedback: "Simplify each surd first, then add the multiples of the same root.",
            },
          ],
          solution: [
            {
              say: "",
              math: `${toLatex(Surd.term(p.a, p.b))} + ${toLatex(Surd.term(p.c, p.b))} = ${toLatex(sum)}`,
            },
          ],
        });
      }
      case 2: {
        const v = p.k * p.k - p.b;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Expand and simplify ",
                A.math(`(${p.k} + \\sqrt{${p.b}})(${p.k} - \\sqrt{${p.b}})`),
                ".",
              ],
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.EXPAND.NEGATIVE",
              value: A.number(p.k * p.k + p.b),
              feedback: `√${p.b} × (−√${p.b}) = −${p.b}.`,
            },
          ]),
          solution: [
            {
              say: "The middle terms cancel: ",
              math: `${p.k}^2 - (\\sqrt{${p.b}})^2 = ${p.k * p.k} - ${p.b} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.spotTheMistake({
          question: ["Pat expands ", A.math(`(${p.k} + \\sqrt{${p.b}})^2`), "."],
          lines: [[A.math(`= ${p.k}^2 + (\\sqrt{${p.b}})^2`)], [A.math(`= ${p.k * p.k + p.b}`)]],
          mistake: 0,
          code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
          feedback: `Square the bracket by multiplying it by itself: ${p.k}² + 2 × ${p.k}√${p.b} + ${p.b} = ${p.k * p.k + p.b} + ${2 * p.k}√${p.b}.`,
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return exactAnswer(question) === toLatex(Surd.term(p.a + p.c, p.b));
    if (question.key.depth === 2) return numberAnswer(question) === p.k * p.k - p.b;
    return true;
  },
});
