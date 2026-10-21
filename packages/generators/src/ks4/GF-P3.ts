/**
 * @statement GF-P3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-P3: Relate relative expected frequencies to theoretical probability, using appropriate language
// and the 0–1 probability scale
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  trials: number;
  heads: number;
  red: number;
  total: number;
}

export default defineGenerator<Params>({
  id: "GF-P3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.ODDS", "PRO.RELATIVE-FREQUENCY.EXACT"],

  params(rng) {
    const trials = rng.pick([20, 40, 50, 80, 100, 200]);
    const heads = Math.round(trials * rng.pick([0.35, 0.45, 0.55, 0.65]));
    const total = rng.pick([10, 20]);
    const red = rng.int(2, total - 2);
    if (heads === trials / 2) reject("an uneven result");
    return { trials, heads, red, total };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: `A coin is flipped ${p.trials} times and lands on heads ${p.heads} times.`,
          ask: "What is the relative frequency of heads?",
          answer: A.exact(frac(p.heads, p.trials)),
          wrong: [
            {
              code: "PRO.ODDS",
              value: A.exact(frac(p.heads, p.trials - p.heads)),
              feedback: "Relative frequency = heads ÷ all flips.",
            },
          ],
          solution: [
            { say: `${p.heads} ÷ ${p.trials} = `, math: toLatex(frac(p.heads, p.trials)) },
          ],
        });
      case 2: {
        const rf = p.heads / p.trials;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A coin lands on heads ${p.heads} times in ${p.trials} flips.`,
          ask: "What does this suggest?",
          correct:
            Math.abs(rf - 0.5) <= 0.1
              ? "The coin could well be fair: the result is close to the expected half."
              : "The coin may be biased, but more flips are needed to be sure.",
          distractors: [
            {
              content: "The coin is certainly biased, because it was not exactly half.",
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
              feedback: "Random results vary; a fair coin rarely gives exactly half.",
            },
            {
              content: `The probability of heads is exactly ${frac(p.heads, p.trials).toString()}.`,
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
              feedback: "Relative frequency only estimates the probability.",
            },
          ],
          solution: [
            {
              say: `Relative frequency ${rf}; the theoretical probability for a fair coin is 0.5.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A bag has ${p.red} red and ${p.total - p.red} blue counters. Kim takes one and puts it back ${p.total * 10} times. She says she expects about ${p.red * 10} reds.`,
          truth: true,
          reasons: [
            {
              text: `True. P(red) = ${p.red}/${p.total}, and ${p.red}/${p.total} × ${p.total * 10} = ${p.red * 10}.`,
              correct: true,
            },
            {
              text: `False. She will get exactly ${p.red * 10}.`,
              code: "PRO.RELATIVE-FREQUENCY.EXACT",
            },
            { text: `False. P(red) = ${p.red}/${p.total - p.red}.`, code: "PRO.ODDS" },
          ],
          solution: [
            {
              say: "Expected frequency = theoretical probability × trials; the actual count will vary around it.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.archetype === "standard")
      return a?.type === "exact" && a.value === toLatex(frac(p.heads, p.trials));
    if (question.archetype === "varied-form") return chosenText(question).length > 0;
    return true;
  },
});
