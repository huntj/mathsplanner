/**
 * @statement CM-SG9
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-SG9: Use arithmetic series, including the general term and sum to n terms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  d: number;
  n: number;
  N: number;
}

const sum = (p: Params) => (p.n * (2 * p.a + (p.n - 1) * p.d)) / 2;

export default defineGenerator<Params>({
  id: "CM-SG9",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SERIES.FORMULA", "ALG.SEQUENCE.POSITION-RULE"],

  params(rng) {
    const p = {
      a: 50 * rng.int(2, 20),
      d: 10 * rng.int(1, 10),
      n: rng.int(10, 30),
      N: rng.int(10, 40),
    };
    if (p.a === p.d) reject("a different first term and difference");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = sum(p);
        return A.standard({
          question: [
            `A worker saves £${p.a} in the first month, and £${p.d} more each month than the month before.`,
          ],
          ask: `How much has the worker saved in total after ${p.n} months?`,
          answer: A.number(v, { units: "£" }),
          wrong: wrongs(v, [
            {
              code: "ALG.SERIES.FORMULA",
              value: A.number((p.n * (2 * p.a + p.n * p.d)) / 2, { units: "£" }),
              feedback: "Sₙ = n/2 (2a + (n − 1)d): the last term is a + (n − 1)d.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `S_{${p.n}} = \\frac{${p.n}}{2}\\left(2 \\times ${p.a} + ${p.n - 1} \\times ${p.d}\\right) = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const term = p.a + (p.N - 1) * p.d;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `An arithmetic sequence has first term ${p.a} and common difference ${p.d}.`,
              ],
              ask: `Which term is equal to ${term}?`,
            },
          ],
          answer: A.number(p.N),
          wrong: signedWrongs(p.N, [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(p.N - 1),
              feedback: `Solve ${p.a} + (n − 1) × ${p.d} = ${term}: remember the n − 1.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.a} + (n - 1) \\times ${p.d} = ${term} \\Rightarrow n - 1 = ${p.N - 1} \\Rightarrow n = ${p.N}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mo says 1 + 2 + 3 + … + 100 = 100 × 101 = 10 100, pairing the first and last terms.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Pairing 1 + 100, 2 + 99, … gives 50 pairs of 101, so the sum is 50 × 101 = 5050. Sₙ = n(a + l)/2.",
              correct: true,
            },
            { text: "True. There are 100 pairs, each adding to 101.", code: "ALG.SERIES.FORMULA" },
            {
              text: "True. Multiply the number of terms by one more than the last term.",
              code: "ALG.SERIES.FORMULA",
            },
          ],
          solution: [{ say: "Writing the sum forwards and backwards gives 2S = 100 × 101." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === sum(p);
    if (question.key.depth === 2) return numberAnswer(question) === p.N;
    return true;
  },
});
