/**
 * @statement Y9-PRO-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-PRO-02.b: Find theoretical probabilities for combined events using sample spaces
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

const EVENTS: [string, (d: number) => boolean][] = [
  ["an even number", (d) => d % 2 === 0],
  ["a number greater than 4", (d) => d > 4],
  ["a square number", (d) => d === 1 || d === 4],
  ["a prime number", (d) => d === 2 || d === 3 || d === 5],
];

interface Params {
  e: number;
  heads: boolean;
}

const count = (e: number) =>
  [1, 2, 3, 4, 5, 6].filter((d) => (EVENTS[e]?.[1] ?? (() => false))(d)).length;

export default defineGenerator<Params>({
  id: "Y9-PRO-02.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.TREE.ADD-ALONG", "PRO.ENUMERATE"],

  params(rng) {
    return { e: rng.int(0, EVENTS.length - 1), heads: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [what] = EVENTS[p.e] ?? EVENTS[0] ?? ["", () => false];
    switch (depth) {
      case 1: {
        const v = frac(count(p.e), 12);
        return A.standard({
          question: ["A fair coin is flipped and a fair six-sided dice is rolled."],
          ask: `Find the probability of getting ${p.heads ? "heads" : "tails"} and ${what}.`,
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.TREE.ADD-ALONG",
              value: A.exact(frac(6 + 2 * count(p.e), 12)),
              feedback:
                "List the 12 outcomes and count the ones where both happen; do not add the two probabilities.",
            },
          ],
          solution: [
            {
              say: `There are 2 × 6 = 12 equally likely outcomes; ${count(p.e)} of them work: `,
              math: toLatex(v),
            },
          ],
        });
      }
      case 2: {
        const v = frac(11, 36);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Two fair six-sided dice are rolled."],
              ask: "Find the probability that at least one of them shows a 6.",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.ENUMERATE",
              value: A.exact(frac(12, 36)),
              feedback:
                "The outcome (6, 6) is in both the row and the column of 6s: count it once.",
            },
          ],
          solution: [
            {
              say: "In the 6 by 6 grid, the row and column of 6s share one cell: 6 + 6 − 1 = 11. ",
              math: toLatex(v),
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Two fair dice are rolled. Lou says the probability of two sixes is ",
            A.math("\\frac{2}{6}"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Only 1 of the 36 equally likely outcomes is (6, 6), so the probability is 1/36.",
              correct: true,
            },
            {
              text: "True. Each die gives 1/6, so together they make 2/6.",
              code: "PRO.TREE.ADD-ALONG",
            },
            { text: "True. There are two sixes out of six numbers.", code: "PRO.ENUMERATE" },
          ],
          solution: [{ say: "", math: `\\frac{1}{6} \\times \\frac{1}{6} = \\frac{1}{36}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(count(p.e), 12));
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(11, 36));
    return true;
  },
});
