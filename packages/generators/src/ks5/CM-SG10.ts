/**
 * @statement CM-SG10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-SG10: Use geometric series, including sum to n terms and sum to infinity when |r| < 1
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

/** Ratios as [numerator, denominator]. */
const RATIOS = [
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 3],
  [-1, 2],
  [3, 4],
] as const;

interface Params {
  a: number;
  ri: number;
  b: number;
  q: number;
  n: number;
}

const ratio = (i: number) => RATIOS[i] ?? RATIOS[0];
const infinite = (p: Params) => {
  const [rn, rd] = ratio(p.ri);
  return toLatex(frac(p.a * rd, rd - rn));
};
const finite = (p: Params) => (p.b * (p.q ** p.n - 1)) / (p.q - 1);

export default defineGenerator<Params>({
  id: "CM-SG10",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SERIES.FORMULA", "ALG.SERIES.CONVERGE"],

  params(rng) {
    return {
      a: rng.int(2, 30),
      ri: rng.int(0, RATIOS.length - 1),
      b: rng.int(1, 9),
      q: rng.int(2, 3),
      n: rng.int(4, 8),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const [rn, rd] = ratio(p.ri);
    const rTex = `${rn < 0 ? "-" : ""}\\frac{${Math.abs(rn)}}{${rd}}`;
    switch (depth) {
      case 1: {
        const v = infinite(p);
        return A.standard({
          question: [
            "A geometric series has first term ",
            A.math(String(p.a)),
            " and common ratio ",
            A.math(rTex),
            ".",
          ],
          ask: "Find its sum to infinity.",
          answer: A.exact(v),
          wrong: [
            {
              code: "ALG.SERIES.FORMULA",
              value: A.exact(toLatex(frac(p.a * rd, rd + rn))),
              feedback: "S∞ = a/(1 − r): subtract r from 1.",
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.a}}{1 - \\left(${rTex}\\right)} = ${v}` }],
        });
      }
      case 2: {
        const v = finite(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the sum of the first ",
                A.math(String(p.n)),
                " terms of the geometric series ",
                A.math(`${p.b} + ${p.b * p.q} + ${p.b * p.q * p.q} + \\cdots`),
                ".",
              ],
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SERIES.FORMULA",
              value: A.number(p.b * p.q ** (p.n - 1)),
              feedback: `That is the ${p.n}th term. The sum is a(rⁿ − 1)/(r − 1).`,
            },
          ]),
          solution: [{ say: "", math: `\\frac{${p.b}(${p.q}^{${p.n}} - 1)}{${p.q} - 1} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ned says the series ",
            A.math(`${p.b} + ${p.b * 2} + ${p.b * 4} + \\cdots`),
            " has sum to infinity ",
            A.math(`\\frac{${p.b}}{1 - 2} = -${p.b}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The formula a/(1 − r) only works when |r| < 1. Here r = 2, so the terms grow and the sum has no limit.",
              correct: true,
            },
            { text: "True. The formula works for any ratio.", code: "ALG.SERIES.CONVERGE" },
            {
              text: "True. Adding positive numbers can give a negative total.",
              code: "ALG.SERIES.CONVERGE",
            },
          ],
          solution: [{ say: "A geometric series converges only when −1 < r < 1." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === infinite(p);
    if (question.key.depth === 2) return numberAnswer(question) === finite(p);
    return true;
  },
});
