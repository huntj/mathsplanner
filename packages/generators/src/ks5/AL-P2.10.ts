/**
 * @statement AL-P2.10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.10: Decompose rational functions into partial fractions (linear and repeated linear
// denominators)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** A/(x − a) + B/(x − b), combined. */
  A: number;
  B: number;
  a: number;
  b: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P2.10",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.PARTIAL.COVER-UP"],

  params(rng) {
    const p = {
      A: rng.int(-6, 6),
      B: rng.int(-6, 6),
      a: rng.int(-5, 5),
      b: rng.int(-5, 5),
      claimTrue: rng.bool(),
    };
    if (p.A === 0 || p.B === 0 || p.a === p.b || p.A === p.B || p.A === -p.B)
      reject("two different, non-zero parts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    // A(x − b) + B(x − a) over (x − a)(x − b).
    const top = poly([p.A + p.B, -(p.A * p.b + p.B * p.a)]);
    const frac = `\\frac{${top}}{${bracket(-p.a)}${bracket(-p.b)}}`;
    const form = `\\frac{A}{${bracket(-p.a).replace(/[()]/g, "")}} + \\frac{B}{${bracket(-p.b).replace(/[()]/g, "")}}`;
    const topAt = (x: number) => (p.A + p.B) * x - (p.A * p.b + p.B * p.a);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Write ", A.math(frac), " in the form ", A.math(form), "."],
          ask: "Find the value of A.",
          answer: A.number(p.A),
          wrong: signedWrongs(p.A, [
            {
              code: "ALG.PARTIAL.COVER-UP",
              value: A.number(-p.A),
              feedback: `Cover up ${bracket(-p.a)}, substitute x = ${p.a}, and divide by the other bracket's value, ${p.a} − ${p.b < 0 ? `(${p.b})` : p.b} = ${p.a - p.b}.`,
            },
          ]),
          solution: [
            {
              say: `Substitute x = ${p.a}: A = ${topAt(p.a)} ÷ (${p.a} − ${p.b < 0 ? `(${p.b})` : p.b}) = ${p.A}.`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Write ", A.math(frac), " in the form ", A.math(form), "."],
              ask: "Find the value of B.",
            },
            { question: [A.math(`${frac} \\equiv ${form}`), "."], ask: "Work out B." },
          ],
          answer: A.number(p.B),
          wrong: signedWrongs(p.B, [
            {
              code: "ALG.PARTIAL.COVER-UP",
              value: A.number(-p.B),
              feedback: `Substitute x = ${p.b} carefully: the other bracket becomes ${p.b} − ${p.a < 0 ? `(${p.a})` : p.a} = ${p.b - p.a}.`,
            },
          ]),
          solution: [{ say: `Substitute x = ${p.b}: B = ${topAt(p.b)} ÷ ${p.b - p.a} = ${p.B}.` }],
        });
      default: {
        const claimed = p.claimTrue ? p.A : -p.A;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ravi writes ",
            A.math(`${frac} \\equiv ${form}`),
            ` and says A = ${claimed}.`,
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. Cover up ${bracket(-p.a)} and put x = ${p.a}: ${topAt(p.a)} ÷ ${p.a - p.b} = ${p.A}.`,
                  correct: true,
                },
                { text: `False. Put x = ${-p.a} instead.`, code: "ALG.PARTIAL.COVER-UP" },
                { text: `False. A is the coefficient of x on top, ${p.A + p.B}.` },
              ]
            : [
                {
                  text: `False. Putting x = ${p.a} gives ${topAt(p.a)} ÷ ${p.a - p.b} = ${p.A}: the sign is wrong.`,
                  correct: true,
                },
                {
                  text: "True. The cover-up rule always gives this sign.",
                  code: "ALG.PARTIAL.COVER-UP",
                },
                { text: `True. A = ${claimed} makes the tops equal at x = 0.` },
              ],
          solution: [
            { say: `Check: substitute x = ${p.a} into the top divided by the other bracket.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.A;
    if (question.key.depth === 2) return numberAnswer(question) === p.B;
    return true;
  },
});
