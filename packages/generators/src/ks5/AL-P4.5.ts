/**
 * @statement AL-P4.5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P4.5: Work with geometric sequences and series, including sum to infinity when |r| < 1
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  a: number;
  r: number;
  n: number;
  /** Depth 2: a ratio p/q with |p/q| < 1. */
  rp: number;
  rq: number;
  big: number;
}

export default defineGenerator<Params>({
  id: "AL-P4.5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SERIES.FORMULA", "ALG.SERIES.CONVERGE"],

  params(rng) {
    const [rp, rq] = rng.pick([
      [1, 2],
      [1, 3],
      [2, 3],
      [-1, 2],
      [3, 4],
      [-1, 3],
    ] as const);
    return {
      a: rng.int(2, 9),
      r: rng.pick([2, 3, -2]),
      n: rng.int(5, 8),
      rp,
      rq,
      big: rng.pick([2, 3]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const s = (p.a * (p.r ** p.n - 1)) / (p.r - 1);
        return A.standard({
          question: `A geometric series has first term ${p.a} and common ratio ${p.r}.`,
          ask: `Find the sum of the first ${p.n} terms.`,
          answer: A.number(s),
          wrong: signedWrongs(s, [
            {
              code: "ALG.SERIES.FORMULA",
              value: A.number(p.a * p.r ** (p.n - 1)),
              feedback: `That is the ${p.n}th term. The sum is a(rⁿ − 1)/(r − 1).`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `S_{${p.n}} = \\frac{${p.a}((${p.r})^{${p.n}} - 1)}{${p.r} - 1} = ${s}`,
            },
          ],
        });
      }
      case 2: {
        const r = frac(p.rp, p.rq);
        const value = frac(p.a).div(frac(1).sub(r));
        const slip = frac(p.a).div(frac(1).add(r));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A geometric series has first term ",
                A.math(String(p.a)),
                " and common ratio ",
                A.math(toLatex(r)),
                ".",
              ],
              ask: "Find its sum to infinity.",
            },
            {
              question: [
                "Find the sum to infinity of the geometric series with ",
                A.math(`a = ${p.a}`),
                " and ",
                A.math(`r = ${toLatex(r)}`),
                ".",
              ],
            },
          ],
          answer: A.exact(value),
          wrong: [
            { code: "ALG.SERIES.CONVERGE", value: A.exact(slip), feedback: "S∞ = a/(1 − r)." },
          ],
          solution: [
            {
              say: "",
              math: `S_\\infty = \\frac{${p.a}}{1 - ${p.rp < 0 ? `(${toLatex(r)})` : toLatex(r)}} = ${toLatex(value)}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Rhys says the geometric series ",
            A.math(`1 + ${p.big} + ${p.big ** 2} + ${p.big ** 3} + \\dots`),
            " has sum to infinity ",
            A.math(`\\frac{1}{1 - ${p.big}} = ${toLatex(frac(1, 1 - p.big))}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The ratio is ${p.big}, so |r| ≥ 1: the terms grow and the series has no sum to infinity.`,
              correct: true,
            },
            { text: "True. Use a/(1 − r) for any geometric series.", code: "ALG.SERIES.CONVERGE" },
            {
              text: "True. The formula gives a value, so the series converges.",
              code: "ALG.SERIES.CONVERGE",
            },
          ],
          solution: [
            {
              say: "A sum to infinity exists only when |r| < 1; adding positive numbers can never give a negative total.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === (p.a * (p.r ** p.n - 1)) / (p.r - 1);
    return true;
  },
});
