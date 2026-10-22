/**
 * @statement FM-FS1-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS1-03: Use the geometric and negative binomial distributions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  p: number;
  x: number;
  r: number;
}

const r4 = (v: number) => round(v, 4);

export default defineGenerator<Params>({
  id: "FM-FS1-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.GEOMETRIC"],

  params(rng) {
    return { p: rng.pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.4]), x: rng.int(2, 8), r: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    const q = 1 - p.p;
    switch (depth) {
      case 1: {
        const v = r4(q ** (p.x - 1) * p.p);
        return A.standard({
          question: [
            `A player has probability ${p.p} of hitting a target with each throw, independently. X is the number of throws up to and including the first hit.`,
          ],
          ask: ["Find ", A.math(`P(X = ${p.x})`), ", to 4 decimal places."],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.GEOMETRIC",
              value: A.number(r4(q ** p.x * p.p), { accuracy: { dp: 4 } }),
              feedback: `${p.x - 1} misses then a hit: (1 − p)^${p.x - 1} × p.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${q.toFixed(2).replace(/0$/, "")}^{${p.x - 1}} \\times ${p.p} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = r4(q ** p.x);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["X has a geometric distribution with ", A.math(`p = ${p.p}`), "."],
              ask: ["Find ", A.math(`P(X > ${p.x})`), ", to 4 decimal places."],
            },
          ],
          answer: A.number(v, { accuracy: { dp: 4 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.GEOMETRIC",
              value: A.number(r4(q ** (p.x - 1)), { accuracy: { dp: 4 } }),
              feedback: `That is P(X ≥ ${p.x}). X > ${p.x} means the first ${p.x} trials all fail.`,
            },
          ]),
          solution: [
            { say: `The first ${p.x} trials are all failures: (1 − ${p.p})^${p.x} = ${v}.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Pia says the mean number of trials needed to get ${p.r} successes, with success probability ${p.p} each time, is ${round(p.r * p.p, 2)}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Each success takes 1/p trials on average, so the mean is r/p = ${round(p.r / p.p, 2)}.`,
              correct: true,
            },
            { text: "True. The mean is rp, as for a binomial.", code: "PRO.GEOMETRIC" },
            {
              text: "True. Multiply the number of successes by the probability.",
              code: "PRO.GEOMETRIC",
            },
          ],
          solution: [{ say: "The negative binomial mean is r/p." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r4((1 - p.p) ** (p.x - 1) * p.p);
    if (question.key.depth === 2) return numberAnswer(question) === r4((1 - p.p) ** p.x);
    return true;
  },
});
