/**
 * @statement AL-S4.1.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S4.1.a: Use discrete probability distributions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  /** P(X = x) = kx for x = 1..n, or the table with one gap. */
  n: number;
  probs: number[];
  gap: number;
}

export default defineGenerator<Params>({
  id: "AL-S4.1.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.PDF", "PRO.BINOMIAL.CUMULATIVE"],

  params(rng) {
    const parts = [rng.int(1, 4), rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)];
    const rest = 10 - parts.reduce((s, x) => s + x, 0);
    if (rest < 1) reject("probabilities that sum to 1");
    return { n: rng.int(3, 6), probs: [...parts, rest].map((x) => x / 10), gap: rng.int(0, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const total = (p.n * (p.n + 1)) / 2;
        return A.choice({
          rng,
          question: [`The random variable X has P(X = x) = kx for x = 1, 2, …, ${p.n}.`],
          ask: "Find k.",
          correct: A.math(toLatex(frac(1, total))),
          distractors: [
            {
              content: A.math(toLatex(frac(1, p.n))),
              code: "PRO.PDF",
              feedback: `The probabilities k, 2k, …, ${p.n}k must add up to 1: k(1 + 2 + … + ${p.n}) = 1.`,
            },
            {
              content: A.math(String(total)),
              code: "PRO.PDF",
              feedback: "Probabilities cannot be more than 1.",
            },
          ],
          solution: [
            {
              say: "",
              math: `k(1 + 2 + \\dots + ${p.n}) = ${total}k = 1 \\Rightarrow k = ${toLatex(frac(1, total))}`,
            },
          ],
        });
      }
      case 2: {
        const shown = p.probs.map((x, i) => (i === p.gap ? "?" : x));
        const v = Math.round((p.probs[p.gap] ?? 0) * 10) / 10;
        return A.standard({
          question: [
            "The table shows the probability distribution of X.",
            A.displayMath(
              tableLatex(
                ["x", "P(X = x)"],
                shown.map((x, i) => [i + 1, x]),
              ),
            ),
          ],
          ask: ["Find the missing probability."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.PDF",
              value: A.number(Math.round((1 - v) * 10) / 10),
              feedback: "The probabilities add up to 1, so take the others from 1.",
            },
          ]),
          solution: [{ say: `1 − (sum of the others) = ${v}.` }],
        });
      }
      default: {
        const le2 = Math.round(((p.probs[0] ?? 0) + (p.probs[1] ?? 0)) * 10) / 10;
        const le3 = Math.round((le2 + (p.probs[2] ?? 0)) * 10) / 10;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The table shows the probability distribution of X.",
            A.displayMath(
              tableLatex(
                ["x", "P(X = x)"],
                p.probs.map((x, i) => [i + 1, x]),
              ),
            ),
            ` Ana says P(X < 3) = ${le3}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. X < 3 means X = 1 or 2, so P(X < 3) = ${le2}. She included X = 3.`,
              correct: true,
            },
            { text: "True. X < 3 includes 3.", code: "PRO.BINOMIAL.CUMULATIVE" },
            {
              text: "True. < and ≤ mean the same for whole numbers.",
              code: "PRO.BINOMIAL.CUMULATIVE",
            },
          ],
          solution: [{ say: `P(X < 3) = P(X = 1) + P(X = 2) = ${le2}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === toLatex(frac(1, (p.n * (p.n + 1)) / 2));
    if (question.key.depth === 2)
      return numberAnswer(question) === Math.round((p.probs[p.gap] ?? 0) * 10) / 10;
    return true;
  },
});
