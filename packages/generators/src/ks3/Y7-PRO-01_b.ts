/**
 * @statement Y7-PRO-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-PRO-01.b: Record and analyse the outcomes of probability experiments
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  h: number;
  d: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-PRO-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.ODDS", "PRO.EXPECTED.DIVIDE", "PRO.RELATIVE-FREQUENCY.EXACT"],

  params(rng) {
    const n = rng.pick([20, 25, 40, 50, 60, 80, 100]);
    const p = {
      n,
      h: rng.int(Math.round(n * 0.3), Math.round(n * 0.7)),
      d: rng.pick([2, 4, 5, 10]),
      k: rng.int(2, 10),
    };
    if (p.h * 2 === p.n) reject("a result that is not exactly half");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = frac(p.h, p.n);
        return A.standard({
          question: [`Lily flips a coin ${p.n} times. It lands on heads ${p.h} times.`],
          ask: "What is the relative frequency of heads?",
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.ODDS",
              value: A.exact(frac(p.h, p.n - p.h)),
              feedback: `Divide by the total number of flips, ${p.n}.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.h}}{${p.n}} = ${toLatex(v)}` }],
        });
      }
      case 2: {
        const trials = p.d * p.k * 10;
        const v = trials / p.d;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The probability that a spinner lands on red is ",
                A.math(`\\frac{1}{${p.d}}`),
                `. It is spun ${trials} times.`,
              ],
              ask: "How many times would you expect it to land on red?",
            },
            {
              question: [
                "The probability of winning a game is ",
                A.math(`\\frac{1}{${p.d}}`),
                `. Jo plays ${trials} times.`,
              ],
              ask: "How many wins would she expect?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.EXPECTED.DIVIDE",
              value: A.number(trials * p.d),
              feedback: `Expected = probability × number of trials = ${trials} ÷ ${p.d}.`,
            },
          ]),
          solution: [{ say: "", math: `\\frac{1}{${p.d}} \\times ${trials} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Max says that if he rolls a fair dice 60 times, he will get exactly 10 sixes.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. 10 is the expected number, but results vary: he might get 7 or 13. Exactly 10 is not guaranteed.",
              correct: true,
            },
            {
              text: "True. A sixth of 60 is 10, so that is what happens.",
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
            },
            {
              text: "True. A fair dice always gives each number equally often.",
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
            },
          ],
          solution: [
            {
              say: "The more trials, the closer the relative frequency usually gets to the probability.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.h, p.n));
    if (question.key.depth === 2) return numberAnswer(question) === p.k * 10;
    return true;
  },
});
