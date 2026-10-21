/**
 * @statement GF-P2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-P2: Apply ideas of randomness, fairness and equally likely events to calculate expected outcomes
// of multiple future experiments
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  p: number;
  n: number;
  sections: number;
  spins: number;
  rolls: number;
}

export default defineGenerator<Params>({
  id: "GF-P2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.EXPECTED.DIVIDE", "PRO.RELATIVE-FREQUENCY.EXACT"],

  params(rng) {
    return {
      p: rng.pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4]),
      n: rng.pick([40, 60, 80, 120, 200, 300]),
      sections: rng.pick([4, 5, 8]),
      spins: rng.int(3, 15) * 8 * 5,
      rolls: rng.pick([6, 12, 18]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const e = Math.round(p.p * p.n * 100) / 100;
        return A.standard({
          question: `The probability that a seed grows is ${p.p}. Ali plants ${p.n} seeds.`,
          ask: "How many would you expect to grow?",
          answer: A.number(e),
          wrong: wrongs(e, [
            {
              code: "PRO.EXPECTED.DIVIDE",
              value: A.number(Math.round((p.n / p.p) * 100) / 100),
              feedback: "Expected number = probability × number of trials.",
            },
          ]),
          solution: [{ say: `${p.p} × ${p.n} = ${e}.` }],
        });
      }
      case 2: {
        const e = p.spins / p.sections;
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A fair spinner has ${p.sections} equal sections, one of them blue. It is spun ${p.spins} times.`,
              ask: "How many times would you expect it to land on blue?",
            },
          ],
          answer: A.number(e),
          wrong: wrongs(e, [
            {
              code: "PRO.EXPECTED.DIVIDE",
              value: A.number(p.spins * p.sections),
              feedback: `P(blue) = 1/${p.sections}; multiply by the ${p.spins} spins.`,
            },
          ]),
          solution: [{ say: `1/${p.sections} × ${p.spins} = ${e}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A fair dice is rolled ${p.rolls} times. Mia says it must land on six exactly ${p.rolls / 6} times.`,
          truth: false,
          reasons: [
            {
              text: `False. ${p.rolls / 6} is the expected number, but outcomes are random, so the actual number of sixes can be more or fewer.`,
              correct: true,
            },
            {
              text: "True. A fair dice always gives each number equally often.",
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
            },
            {
              text: `True. ${p.rolls} ÷ 6 = ${p.rolls / 6}, so that is what happens.`,
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
            },
          ],
          solution: [
            { say: "Expected frequency is an average over many repeats, not a guarantee." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 4) return true;
    const n = numberAnswer(question);
    return question.key.depth === 1 ? Math.abs(n - p.p * p.n) < 1e-9 : n === p.spins / p.sections;
  },
});
