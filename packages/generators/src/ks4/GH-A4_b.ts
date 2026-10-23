/**
 * @statement GH-A4.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A4.b: Factorise ax² + bx + c
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, poly } from "../shared/alg.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  p: number;
  q: number;
  r: number;
  s: number;
}

/** (p x + q)(x + r) */
const pair = (p: number, q: number, r: number) =>
  `(${linear([
    [p, "x"],
    [q, ""],
  ])})(${linear([
    [1, "x"],
    [r, ""],
  ])})`;
const expand = (p: number, q: number, r: number) => [p, p * r + q, q * r];

export default defineGenerator<Params>({
  id: "GH-A4.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FACTORISE.SIGNS"],

  params(rng) {
    const p = {
      p: rng.pick([2, 3, 5, 7]),
      q: rng.int(1, 9),
      r: rng.int(1, 9),
      s: rng.int(1, 9) * -1,
    };
    if (gcdOf(p.p, p.q) !== 1 || p.q === p.r || p.p * p.r === p.q)
      reject("a bracket in its simplest form and a swap that changes the value");
    if (gcdOf(p.p, Math.abs(p.s)) !== 1 || p.p * p.r + p.s === 0)
      reject("a middle term at depth 2");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = pair(p.p, p.q, p.r);
        return A.standard({
          question: ["Factorise ", A.math(poly(expand(p.p, p.q, p.r))), "."],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(pair(p.p, p.r, p.q)),
              feedback:
                "Expand your brackets to check: the two middle terms must add up to the x coefficient.",
            },
          ],
          solution: [
            {
              say: `Find two numbers that multiply to ${p.p} × ${p.q * p.r} = ${p.p * p.q * p.r} and add to ${p.p * p.r + p.q}, then split the middle term: `,
              math: right,
            },
          ],
        });
      }
      case 2: {
        const right = pair(p.p, p.s, p.r);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Factorise ", A.math(poly(expand(p.p, p.s, p.r))), "."] },
            {
              question: [
                "Write ",
                A.math(poly(expand(p.p, p.s, p.r))),
                " as the product of two brackets.",
              ],
            },
          ],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(pair(p.p, -p.s, -p.r)),
              feedback:
                "The constant term is negative, so the brackets have opposite signs; check which way round by expanding.",
            },
          ],
          solution: [{ say: "", math: `${poly(expand(p.p, p.s, p.r))} = ${right}` }],
        });
      }
      default: {
        const bad = pair(p.p, p.r, p.q);
        return A.spotTheMistake({
          question: ["Ella factorises ", A.math(poly(expand(p.p, p.q, p.r))), "."],
          lines: [[A.math(`= ${bad}`)]].concat([
            [A.math(`\\text{Check: } ${bad} = ${poly(expand(p.p, p.r, p.q))}`)],
          ]),
          mistake: 0,
          code: "ALG.FACTORISE.SIGNS",
          feedback: `Her check shows a different expression. The answer is ${pair(p.p, p.q, p.r)}.`,
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) return a?.type === "exact" && a.value === pair(p.p, p.q, p.r);
    return true;
  },
});
