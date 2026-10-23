/**
 * @statement Y7-PRO-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-PRO-01.a: Use the language of probability and the 0 to 1 scale
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, exactAnswer } from "../shared/counting.ts";

const WORDS = ["Impossible", "Unlikely", "Even chance", "Likely", "Certain"];
const word = (p: number) => (p === 0 ? 0 : p < 0.5 ? 1 : p === 0.5 ? 2 : p < 1 ? 3 : 4);

interface Params {
  p: number;
  r: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "Y7-PRO-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.SCALE.WORDS", "PRO.ODDS"],

  params(rng) {
    const p = {
      p: rng.pick([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]),
      r: rng.int(1, 9),
      b: rng.int(1, 9),
    };
    if (p.r === p.b) reject("different counts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = WORDS[word(p.p)] ?? "";
        const near = [word(p.p) - 1, word(p.p) + 1]
          .filter((i) => i >= 0 && i < 5)
          .map((i) => WORDS[i] ?? "");
        return A.choice({
          rng,
          question: [`The probability of an event is ${p.p}. Which word describes it best?`],
          correct: right,
          distractors: near.map((w) => ({
            content: w,
            code: "PRO.SCALE.WORDS",
            feedback:
              "0 is impossible, 0.5 is an even chance and 1 is certain; below 0.5 is unlikely, above is likely.",
          })),
          solution: [{ say: `${p.p} on the 0 to 1 scale is ${right.toLowerCase()}.` }],
        });
      }
      case 2: {
        const v = frac(p.r, p.r + p.b);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A bag has ${p.r} red and ${p.b} blue counters. One is taken at random.`],
              ask: "What is the probability that it is red?",
            },
            {
              question: [
                `A box holds ${p.r} milk chocolates and ${p.b} dark chocolates. Tom picks one without looking.`,
              ],
              ask: "What is the probability that it is milk chocolate?",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.ODDS",
              value: A.exact(frac(p.r, p.b)),
              feedback: `Divide by the total number of counters, ${p.r + p.b}.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{${p.r}}{${p.r} + ${p.b}} = ${toLatex(v)}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["A probability can be greater than 1."],
          truth: "never",
          reasons: [
            {
              text: "Never. A probability of 1 means certain; nothing can be more likely than certain.",
              correct: true,
            },
            { text: "Sometimes. When there are lots of good outcomes.", code: "PRO.ODDS" },
            { text: "Always. Probabilities are any positive number.", code: "PRO.SCALE.WORDS" },
          ],
          solution: [{ say: "Every probability is between 0 and 1." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === WORDS[word(p.p)];
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(p.r, p.r + p.b));
    return true;
  },
});
