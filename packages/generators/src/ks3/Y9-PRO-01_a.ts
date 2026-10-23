/**
 * @statement Y9-PRO-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-PRO-01.a: Enumerate sets using tables and grids
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

interface Params {
  m: number;
  n: number;
  s: number;
}

const ways = (m: number, n: number, s: number) => {
  let c = 0;
  for (let a = 1; a <= m; a++) for (let b = 1; b <= n; b++) if (a + b === s) c++;
  return c;
};
const evens = (m: number, n: number) => {
  let c = 0;
  for (let a = 1; a <= m; a++) for (let b = 1; b <= n; b++) if ((a * b) % 2 === 0) c++;
  return c;
};

export default defineGenerator<Params>({
  id: "Y9-PRO-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.ENUMERATE", "PRO.SAMPLE-SPACE.EQUAL-TOTALS"],

  params(rng) {
    const p = { m: rng.int(3, 6), n: rng.int(3, 6), s: rng.int(4, 9) };
    if (ways(p.m, p.n, p.s) < 2) reject("a total made more than one way");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = ways(p.m, p.n, p.s);
        return A.standard({
          question: [
            `Spinner A is numbered 1 to ${p.m} and spinner B is numbered 1 to ${p.n}. Both are spun and the numbers added.`,
          ],
          ask: `In a sample space grid, how many outcomes give a total of ${p.s}?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.ENUMERATE",
              value: A.number(Math.ceil(v / 2)),
              feedback: `Order matters: A = 2, B = 3 and A = 3, B = 2 are different cells. Count every cell that makes ${p.s}.`,
            },
          ]),
          solution: [{ say: `Listing (A, B) pairs that add to ${p.s} gives ${v} cells.` }],
        });
      }
      case 2: {
        const e = evens(p.m, p.n);
        const v = frac(e, p.m * p.n);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Spinner A is numbered 1 to ${p.m} and spinner B is numbered 1 to ${p.n}. Both are spun and the numbers multiplied.`,
              ],
              ask: "Find the probability that the product is even.",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.SAMPLE-SPACE.EQUAL-TOTALS",
              value: A.exact(frac(1, 2)),
              feedback:
                "Even and odd products are not equally likely: the product is odd only when both numbers are odd. Draw the grid and count.",
            },
          ],
          solution: [{ say: `${e} of the ${p.m * p.n} cells are even: `, math: toLatex(v) }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Kim spins two spinners numbered 1 to ${p.m} and 1 to ${p.n}. She says there are ${p.m + p.n} possible outcomes.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Each of the ${p.m} results on A can go with each of the ${p.n} on B: ${p.m} × ${p.n} = ${p.m * p.n} outcomes.`,
              correct: true,
            },
            { text: "True. Add the numbers of sections.", code: "PRO.ENUMERATE" },
            {
              text: `True. There are ${p.m + p.n} different numbers to land on.`,
              code: "PRO.ENUMERATE",
            },
          ],
          solution: [{ say: "A grid shows every pairing." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === ways(p.m, p.n, p.s);
    if (question.key.depth === 2)
      return exactAnswer(question) === toLatex(frac(evens(p.m, p.n), p.m * p.n));
    return true;
  },
});
