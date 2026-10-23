/**
 * @statement Y7-ALG-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-ALG-02.b: Substitute values into formulae, including scientific formulae
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  u: number;
  a: number;
  t: number;
  c: number;
  l: number;
  w: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-02.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SUBSTITUTE.ORDER", "ALG.EXPAND.FIRST-ONLY"],

  params(rng) {
    return {
      u: rng.int(2, 20),
      a: rng.int(2, 9),
      t: rng.int(2, 10),
      c: rng.int(-4, 8) * 5,
      l: rng.int(3, 15),
      w: rng.int(2, 9),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.u + p.a * p.t;
        return A.standard({
          question: ["A formula for speed is ", A.math("v = u + at"), "."],
          ask: [
            "Find v when ",
            A.math(`u = ${p.u}`),
            ", ",
            A.math(`a = ${p.a}`),
            " and ",
            A.math(`t = ${p.t}`),
            ".",
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SUBSTITUTE.ORDER",
              value: A.number((p.u + p.a) * p.t),
              feedback: "at means a × t: multiply before adding u.",
            },
          ]),
          solution: [{ say: "", math: `v = ${p.u} + ${p.a} \\times ${p.t} = ${v}` }],
        });
      }
      case 2: {
        const v = (9 * p.c) / 5 + 32;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Temperatures convert with ", A.math("F = \\frac{9C}{5} + 32"), "."],
              ask: `Find F when C = ${p.c}.`,
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SUBSTITUTE.ORDER",
              value: A.number((9 * (p.c + 32)) / 5),
              feedback: "Work out 9C ÷ 5 first, then add 32.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `F = \\frac{9 \\times ${p.c}}{5} + 32 = ${(9 * p.c) / 5} + 32 = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The perimeter of a rectangle is ",
            A.math("P = 2(l + w)"),
            `. Sam says when l = ${p.l} and w = ${p.w}, P = ${2 * p.l + p.w}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. 2(l + w) doubles the whole bracket: 2 × ${p.l + p.w} = ${2 * (p.l + p.w)}.`,
              correct: true,
            },
            { text: "True. Double the length, then add the width.", code: "ALG.EXPAND.FIRST-ONLY" },
            { text: "True. The 2 only goes with l.", code: "ALG.EXPAND.FIRST-ONLY" },
          ],
          solution: [{ say: "", math: `P = 2(${p.l} + ${p.w}) = ${2 * (p.l + p.w)}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.u + p.a * p.t;
    if (question.key.depth === 2) return numberAnswer(question) === (9 * p.c) / 5 + 32;
    return true;
  },
});
