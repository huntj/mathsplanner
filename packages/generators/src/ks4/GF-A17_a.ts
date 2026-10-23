/**
 * @statement GF-A17.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A17.a: Solve linear equations with the unknown on one side
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  x: number;
}

export default defineGenerator<Params>({
  id: "GF-A17.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.WRONG-INVERSE"],

  params(rng, numbers) {
    const p = {
      a: rng.int(2, 9),
      b: rng.int(1, 15),
      x: numbers === "friendly" ? rng.int(1, 12) : rng.int(-9, 15),
    };
    if (p.x === 0) reject("a non-zero solution");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const c = p.a * p.x + p.b;
        const slip = (c + p.b) / p.a;
        return A.standard({
          question: ["Solve ", A.math(`${p.a}x + ${p.b} = ${c}`), "."],
          answer: A.number(p.x),
          wrong: signedWrongs(
            p.x,
            Number.isInteger(slip)
              ? [
                  {
                    code: "ALG.SOLVE.WRONG-INVERSE",
                    value: A.number(slip),
                    feedback: `Subtract ${p.b} from both sides, then divide by ${p.a}.`,
                  },
                ]
              : [],
          ),
          solution: [{ say: "", math: `${p.a}x = ${c - p.b} \\Rightarrow x = ${p.x}` }],
        });
      }
      case 2: {
        const c = p.x + p.b;
        return A.variedForm({
          rng,
          forms: [{ question: ["Solve ", A.math(`\\frac{x}{${p.a}} + ${p.b} = ${c}`), "."] }],
          answer: A.number(p.a * (c - p.b)),
          wrong: signedWrongs(p.a * (c - p.b), [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(p.a * c - p.b),
              feedback: `Subtract ${p.b} first, then multiply by ${p.a}.`,
            },
          ]),
          solution: [
            { say: "", math: `\\frac{x}{${p.a}} = ${c - p.b} \\Rightarrow x = ${p.a * (c - p.b)}` },
          ],
        });
      }
      default: {
        const c = p.a * p.x + p.b;
        return A.spotTheMistake({
          question: ["Ana solves ", A.math(`${p.a}x + ${p.b} = ${c}`), "."],
          lines: [
            [A.math(`${p.a}x = ${c + p.b}`)],
            [A.math(`x = ${Number(((c + p.b) / p.a).toFixed(3))}`)],
          ],
          mistake: 0,
          code: "ALG.SOLVE.WRONG-INVERSE",
          feedback: `To undo + ${p.b}, subtract ${p.b} from both sides: ${p.a}x = ${c - p.b}, so x = ${p.x}.`,
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.x;
    return true;
  },
});
