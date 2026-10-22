/**
 * @statement AL-P4.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P4.2: Work with sequences given by nth term or recurrence; increasing, decreasing and periodic
// sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signed, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** u(n+1) = k·u(n) + c with u1. */
  k: number;
  c: number;
  u1: number;
  /** Periodic: u(n+1) = m / u(n), with u1 = s. */
  m: number;
  s: number;
  n: number;
  inc: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P4.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.ITERATION.SUBSTITUTE", "ALG.SEQUENCE.PERIODIC"],

  params(rng) {
    const s = rng.pick([2, 3, 4, 6]);
    const m = s * rng.pick([5, 7, 9]);
    const p = {
      k: rng.int(2, 4),
      c: rng.int(-5, 5),
      u1: rng.int(1, 5),
      m,
      s,
      n: rng.int(20, 60),
      inc: rng.bool(),
    };
    if (p.c === 0) reject("a constant to add");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const u2 = p.k * p.u1 + p.c;
        const u3 = p.k * u2 + p.c;
        return A.standard({
          question: [
            "A sequence is defined by ",
            A.math(`u_{n+1} = ${p.k}u_n ${signed(p.c)}`),
            " with ",
            A.math(`u_1 = ${p.u1}`),
            ".",
          ],
          ask: ["Find ", A.math("u_3"), "."],
          answer: A.number(u3),
          wrong: signedWrongs(u3, [
            {
              code: "ALG.ITERATION.SUBSTITUTE",
              value: A.number(u2),
              feedback: "That is u₂. Use it to find u₃.",
            },
          ]),
          solution: [
            {
              say: `u₂ = ${p.k} × ${p.u1} ${signed(p.c)} = ${u2}; u₃ = ${p.k} × ${u2} ${signed(p.c)} = ${u3}.`,
            },
          ],
        });
      }
      case 2: {
        const other = p.m / p.s;
        const value = p.n % 2 === 1 ? p.s : other;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A sequence is defined by ",
                A.math(`u_{n+1} = \\frac{${p.m}}{u_n}`),
                " with ",
                A.math(`u_1 = ${p.s}`),
                ".",
              ],
              ask: ["Find ", A.math(`u_{${p.n}}`), "."],
            },
          ],
          answer: A.number(value),
          wrong: [
            {
              code: "ALG.SEQUENCE.PERIODIC",
              value: A.number(value === p.s ? other : p.s),
              feedback: `The sequence goes ${p.s}, ${other}, ${p.s}, ${other}, …: odd terms are ${p.s} and even terms are ${other}.`,
            },
          ],
          solution: [
            {
              say: `u₁ = ${p.s}, u₂ = ${other}, u₃ = ${p.s}: period 2. ${p.n} is ${p.n % 2 === 1 ? "odd" : "even"}, so u_${p.n} = ${value}.`,
            },
          ],
        });
      }
      default: {
        const rule = p.inc ? `u_n = 3n + 2` : `u_n = 20 - 3n`;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ken says the sequence ", A.math(rule), " is increasing."],
          truth: p.inc,
          reasons: p.inc
            ? [
                {
                  text: "True. Each term is 3 more than the one before: u(n+1) − u(n) = 3 > 0.",
                  correct: true,
                },
                { text: "False. It is periodic.", code: "ALG.SEQUENCE.PERIODIC" },
                {
                  text: "False. Its terms are all different, so it neither increases nor decreases.",
                },
              ]
            : [
                {
                  text: "False. Each term is 3 less than the one before: u(n+1) − u(n) = −3 < 0, so it is decreasing.",
                  correct: true,
                },
                {
                  text: "True. n increases, so the terms do too.",
                  code: "ALG.ITERATION.SUBSTITUTE",
                },
                { text: "True. The first term is 17, which is positive." },
              ],
          solution: [
            {
              say: "Compare u(n+1) with u(n): positive differences mean increasing, negative mean decreasing.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k * (p.k * p.u1 + p.c) + p.c;
    return true;
  },
});
