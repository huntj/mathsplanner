/**
 * @statement GF-A2.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A2.b: Substitute values into formulae, including scientific formulae
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  u: number;
  a: number;
  t: number;
  m: number;
  v: number;
}

const s = (p: Params) => p.u * p.t + (p.a * p.t * p.t) / 2;

export default defineGenerator<Params>({
  id: "GF-A2.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.NOTATION.JUXTAPOSE", "ALG.SUBSTITUTE.ORDER"],

  params(rng) {
    const p = {
      u: rng.int(0, 20),
      a: rng.int(2, 10),
      t: rng.int(2, 9),
      m: 2 * rng.int(1, 10),
      v: rng.int(2, 9),
    };
    if ((p.a * p.t * p.t) % 2 !== 0) reject("a whole-number distance");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.u + p.a * p.t;
        return A.standard({
          question: [
            "Use ",
            A.math("v = u + at"),
            " to find v when ",
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
              code: "ALG.NOTATION.JUXTAPOSE",
              value: A.number(p.u + p.a + p.t),
              feedback: "at means a × t.",
            },
          ]),
          solution: [{ say: "", math: `v = ${p.u} + ${p.a} \\times ${p.t} = ${v}` }],
        });
      }
      case 2: {
        const v = s(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The distance travelled is ", A.math("s = ut + \\frac{1}{2}at^2"), "."],
              ask: [
                "Find s when ",
                A.math(`u = ${p.u}`),
                ", ",
                A.math(`a = ${p.a}`),
                " and ",
                A.math(`t = ${p.t}`),
                ".",
              ],
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SUBSTITUTE.ORDER",
              value: A.number(p.u * p.t + (p.a * p.t) ** 2 / 4),
              feedback: `Only t is squared: ½ × ${p.a} × ${p.t}² = ½ × ${p.a} × ${p.t * p.t}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `s = ${p.u} \\times ${p.t} + \\frac{1}{2} \\times ${p.a} \\times ${p.t}^2 = ${p.u * p.t} + ${(p.a * p.t * p.t) / 2} = ${v}`,
            },
          ],
        });
      }
      default: {
        const right = (p.m * p.v * p.v) / 2;
        const bad = ((p.m * p.v) / 2) ** 2;
        return A.spotTheMistake({
          question: [
            "Lily uses ",
            A.math("E = \\frac{1}{2}mv^2"),
            " with ",
            A.math(`m = ${p.m}`),
            " and ",
            A.math(`v = ${p.v}`),
            ".",
          ],
          lines: [
            [A.math(`E = \\frac{1}{2} \\times ${p.m} \\times ${p.v}^2`)],
            [A.math(`= \\left(\\frac{1}{2} \\times ${p.m} \\times ${p.v}\\right)^2`)],
            [A.math(`= ${bad}`)],
          ],
          mistake: 1,
          code: "ALG.SUBSTITUTE.ORDER",
          feedback: `Only v is squared: ½ × ${p.m} × ${p.v * p.v} = ${right}.`,
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.u + p.a * p.t;
    if (question.key.depth === 2) return numberAnswer(question) === s(p);
    return true;
  },
});
