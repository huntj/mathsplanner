/**
 * @statement GF-P6.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-P6.c: Enumerate using tree diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { nCr } from "../shared/dist.ts";

interface Params {
  n: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GF-P6.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.ENUMERATE", "PRO.SAMPLE-SPACE.EQUAL-TOTALS"],

  params(rng) {
    const n = rng.int(3, 4);
    return { n, k: rng.int(1, n - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = 2 ** p.n;
        return A.standard({
          question: [`A coin is flipped ${p.n} times. A tree diagram shows all the outcomes.`],
          ask: "How many outcomes are at the ends of the branches?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.ENUMERATE",
              value: A.number(2 * p.n),
              feedback: "Each flip doubles the number of branches.",
            },
          ]),
          solution: [{ say: "", math: `${Array(p.n).fill(2).join(" \\times ")} = ${v}` }],
        });
      }
      case 2: {
        const v = nCr(p.n, p.k);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A coin is flipped ${p.n} times.`],
              ask: `How many of the outcomes have exactly ${p.k} head${p.k === 1 ? "" : "s"}?`,
            },
            {
              question: [
                `A family has ${p.n} children; each is equally likely to be a boy or a girl.`,
              ],
              ask: `How many of the possible orders have exactly ${p.k} girl${p.k === 1 ? "" : "s"}?`,
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.ENUMERATE",
              value: A.number(1),
              feedback: "The heads can come in different places in the order: list them all.",
            },
          ]),
          solution: [{ say: `Listing the branches, ${v} have exactly ${p.k}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Tia flips two coins. She says the outcomes two heads, one of each, and two tails are equally likely.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A tree shows HH, HT, TH and TT. 'One of each' happens two ways, so it has probability ½, not ⅓.",
              correct: true,
            },
            {
              text: "True. There are three possible results, so each is ⅓.",
              code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
            },
            { text: "True. Coins are fair.", code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS" },
          ],
          solution: [
            { say: "Count outcomes from a list or tree, where each one is equally likely." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 2 ** p.n;
    if (question.key.depth === 2) return numberAnswer(question) === nCr(p.n, p.k);
    return true;
  },
});
