/**
 * @statement CM-P1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-P1: Show that larger unbiased samples tend towards theoretical probability distributions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  sides: number;
  trials: number[];
  hits: number[];
}

export default defineGenerator<Params>({
  id: "CM-P1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.EXPECTED.DIVIDE", "PRO.SAMPLE.SMALL", "PRO.RELATIVE-FREQUENCY.EXACT"],

  params(rng) {
    const sides = rng.pick([4, 5, 6, 8, 10]);
    const trials = rng.shuffle([10, 50, 1000]);
    return {
      n: sides * rng.int(20, 150),
      sides,
      trials,
      hits: trials.map((t) => Math.round(t / sides) + rng.int(-2, 2)),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.n / p.sides;
        return A.standard({
          question: [`A fair ${p.sides}-sided spinner is spun ${p.n} times.`],
          ask: "How many times would you expect it to land on 1?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.EXPECTED.DIVIDE",
              value: A.number(p.n * p.sides),
              feedback: `Expected frequency = number of trials × probability = ${p.n} × 1/${p.sides}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.n} \\times \\frac{1}{${p.sides}} = ${v}` }],
        });
      }
      case 2: {
        const big = p.trials.indexOf(1000);
        const names = ["Ali", "Bea", "Cal"];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `Three students estimate the probability that a drawing pin lands point up. ${names.map((nm, i) => `${nm} drops it ${p.trials[i]} times and gets ${p.hits[i]} point up`).join("; ")}.`,
          ],
          ask: "Whose estimate is the most reliable?",
          correct: names[big] as string,
          distractors: names
            .filter((_, i) => i !== big)
            .map((nm) => ({
              content: nm,
              code: "PRO.SAMPLE.SMALL",
              feedback:
                "The more trials, the closer the relative frequency tends to be to the true probability.",
            })),
          solution: [{ say: `${names[big]} did the most trials (1000).` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ria flips a fair coin and gets heads 5 times in a row. She says tails is now more likely on the next flip.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The coin has no memory: each flip is independent, so P(tails) is still ½. Over many flips the proportion settles near ½ because later flips swamp early runs, not because they balance them out.",
              correct: true,
            },
            {
              text: "True. Results have to even out, so tails is due.",
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
            },
            {
              text: "True. Five heads in a row is impossible for a fair coin.",
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
            },
          ],
          solution: [{ say: "This mistake is called the gambler's fallacy." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n / p.sides;
    if (question.key.depth === 2)
      return chosenText(question) === ["Ali", "Bea", "Cal"][p.trials.indexOf(1000)];
    return true;
  },
});
