/**
 * @statement AL-P4.4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P4.4: Work with arithmetic sequences and series, including the sum of the first n natural
// numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  d: number;
  n: number;
  big: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P4.4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SERIES.FORMULA"],

  params(rng) {
    return {
      a: rng.int(-10, 20),
      d: rng.pick([-4, -3, -2, 2, 3, 4, 5, 6]),
      n: rng.int(15, 40),
      big: rng.pick([100, 200, 50]),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const seq = [0, 1, 2].map((i) => p.a + i * p.d).join(", ");
    switch (depth) {
      case 1: {
        const t = p.a + (p.n - 1) * p.d;
        return A.standard({
          question: `An arithmetic sequence begins ${seq}, …`,
          ask: `Find the ${p.n}th term.`,
          answer: A.number(t),
          wrong: signedWrongs(t, [
            {
              code: "ALG.SERIES.FORMULA",
              value: A.number(p.a + p.n * p.d),
              feedback: "The nth term is a + (n − 1)d: the first term has no differences added.",
            },
          ]),
          solution: [{ say: `${p.a} + (${p.n} − 1) × ${p.d} = ${t}.` }],
        });
      }
      case 2: {
        const s = (p.n * (2 * p.a + (p.n - 1) * p.d)) / 2;
        return A.variedForm({
          rng,
          forms: [
            {
              question: `An arithmetic series begins ${seq.split(", ").join(" + ")} + …`,
              ask: `Find the sum of the first ${p.n} terms.`,
            },
            {
              question: `The first three terms of an arithmetic series are ${seq}.`,
              ask: `Work out the sum of the first ${p.n} terms.`,
            },
          ],
          answer: A.number(s),
          wrong: signedWrongs(s, [
            {
              code: "ALG.SERIES.FORMULA",
              value: A.number((p.n * (2 * p.a + p.n * p.d)) / 2),
              feedback: "Sₙ = n/2 (2a + (n − 1)d).",
            },
          ]),
          solution: [
            {
              say: "",
              math: `S_{${p.n}} = \\frac{${p.n}}{2}(2 \\times ${p.a} + ${p.n - 1} \\times ${p.d}) = ${s}`,
            },
          ],
        });
      }
      default: {
        const right = (p.big * (p.big + 1)) / 2;
        const claimed = p.claimTrue ? right : p.big * (p.big + 1);
        return A.trueOrFalseWhy({
          rng,
          statement: `Theo says 1 + 2 + 3 + … + ${p.big} = ${claimed}.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. The sum of the first n natural numbers is n(n + 1)/2 = ${p.big} × ${p.big + 1} ÷ 2 = ${right}.`,
                  correct: true,
                },
                {
                  text: `False. It is ${p.big} × ${p.big + 1} = ${p.big * (p.big + 1)}.`,
                  code: "ALG.SERIES.FORMULA",
                },
                { text: `False. It is ${p.big * p.big}.` },
              ]
            : [
                {
                  text: `False. Pairing the terms gives ${p.big / 2} pairs of ${p.big + 1}: n(n + 1)/2 = ${right}.`,
                  correct: true,
                },
                { text: "True. The formula is n(n + 1).", code: "ALG.SERIES.FORMULA" },
                {
                  text: `True. ${p.big} numbers averaging ${p.big + 1}.`,
                  code: "ALG.SERIES.FORMULA",
                },
              ],
          solution: [
            {
              say: "Write the sum forwards and backwards: each pair adds to n + 1, and there are n terms, so 2S = n(n + 1).",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a + (p.n - 1) * p.d;
    if (question.key.depth === 2)
      return numberAnswer(question) === (p.n * (2 * p.a + (p.n - 1) * p.d)) / 2;
    return true;
  },
});
