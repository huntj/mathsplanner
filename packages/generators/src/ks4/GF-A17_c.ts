/**
 * @statement GF-A17.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A17.c: Solve linear equations with brackets
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  a: number;
  m: number;
  b: number;
  x: number;
}

export default defineGenerator<Params>({
  id: "GF-A17.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.FIRST-ONLY", "ALG.EXPAND.NEGATIVE"],

  params(rng, numbers) {
    const p = {
      k: rng.int(2, 7),
      a: rng.int(1, 9),
      m: rng.int(2, 6),
      b: rng.int(1, 9),
      x: numbers === "friendly" ? rng.int(1, 10) : rng.int(-6, 12),
    };
    if (p.k === p.m || p.x === 0) reject("a unique non-zero solution");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const r = p.k * (p.x + p.a);
        const slip = r - p.a;
        return A.standard({
          question: ["Solve ", A.math(`${p.k}(x + ${p.a}) = ${r}`), "."],
          answer: A.number(p.x),
          wrong: signedWrongs(
            p.x,
            slip % p.k === 0
              ? [
                  {
                    code: "ALG.EXPAND.FIRST-ONLY",
                    value: A.number(slip / p.k),
                    feedback: `${p.k}(x + ${p.a}) = ${p.k}x + ${p.k * p.a}: multiply both terms.`,
                  },
                ]
              : [],
          ),
          solution: [
            {
              say: "",
              math: `${p.k}x + ${p.k * p.a} = ${r} \\Rightarrow ${p.k}x = ${r - p.k * p.a} \\Rightarrow x = ${p.x}`,
            },
          ],
        });
      }
      case 2: {
        // k(x + a) = m(x − b) + c, with c chosen so x works
        const c = p.k * (p.x + p.a) - p.m * (p.x - p.b);
        const sign = c < 0 ? "-" : "+";
        // The slip: m(x − b) expanded as mx + mb.
        const slip = (c + p.m * p.b - p.k * p.a) / (p.k - p.m);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Solve ",
                A.math(`${p.k}(x + ${p.a}) = ${p.m}(x - ${p.b}) ${sign} ${Math.abs(c)}`),
                ".",
              ],
            },
          ],
          answer: A.number(p.x),
          wrong: signedWrongs(
            p.x,
            Number.isInteger(slip)
              ? [
                  {
                    code: "ALG.EXPAND.NEGATIVE",
                    value: A.number(slip),
                    feedback: `${p.m} × −${p.b} = −${p.m * p.b}.`,
                  },
                ]
              : [],
          ),
          solution: [
            {
              say: "",
              math: `${p.k}x + ${p.k * p.a} = ${p.m}x - ${p.m * p.b} ${sign} ${Math.abs(c)} \\Rightarrow x = ${p.x}`,
            },
          ],
        });
      }
      default: {
        const r = p.k * (p.x + p.a);
        return A.spotTheMistake({
          question: ["Zoe solves ", A.math(`${p.k}(x + ${p.a}) = ${r}`), "."],
          lines: [
            [A.math(`${p.k}x + ${p.a} = ${r}`)],
            [A.math(`${p.k}x = ${r - p.a}`)],
            [A.math(`x = ${Number(((r - p.a) / p.k).toFixed(3))}`)],
          ],
          mistake: 0,
          code: "ALG.EXPAND.FIRST-ONLY",
          feedback: `${p.k} multiplies ${p.a} too: ${p.k}x + ${p.k * p.a} = ${r}, so x = ${p.x}.`,
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.x;
    return true;
  },
});
