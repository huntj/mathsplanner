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
import { orClaims } from "../shared/variety.ts";

interface Params {
  n: number;
  h: number;
  d: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-PRO-01.b",
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
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
            }),
          [
            {
              statement: `A coin is flipped ${p.n} times and lands on heads ${p.h} times. Xia says the relative frequency of heads is $\\frac{${p.h}}{${p.n}}$.`,
              truth: true,
              right: "True. Relative frequency = the number of heads ÷ the number of flips.",
              wrong: [
                ["False. It must be ½ for a fair coin.", "PRO.RELATIVE-FREQUENCY.EXACT"],
                [`False. It is ${p.h}/${p.n - p.h}, heads to tails.`, "PRO.ODDS"],
              ],
            },
            {
              claim: "In an experiment, the relative frequency equals the probability.",
              truth: "sometimes",
              right:
                "Sometimes. 10 sixes in 60 rolls matches the probability ⅙ exactly, but 8 sixes is just as possible.",
              wrong: [
                [
                  "Always. Experiments give exactly the probability.",
                  "PRO.RELATIVE-FREQUENCY.EXACT",
                ],
                ["Never. Experiments never match probabilities."],
              ],
            },
            {
              statement: "Zac rolls a fair dice 30 times. He says he expects to get about 5 sixes.",
              truth: true,
              right:
                "True. The expected number is 30 × ⅙ = 5, though the actual number may be a little more or less.",
              wrong: [
                [
                  "False. He expects 6 sixes, one for each number on the dice.",
                  "PRO.EXPECTED.DIVIDE",
                ],
                ["False. You cannot expect anything when rolling a dice."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.h, p.n));
    if (question.key.depth === 2) return numberAnswer(question) === p.k * 10;
    return true;
  },
});
