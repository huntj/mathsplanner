/**
 * @statement GF-A24.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A24.a: Recognise triangular, square and cube numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const tri = (n: number) => (n * (n + 1)) / 2;
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));
const isTri = (n: number) => Number.isInteger((Math.sqrt(8 * n + 1) - 1) / 2);

interface Params {
  n: number;
  m: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "GF-A24.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.TYPE"],

  params(rng) {
    const p = { n: rng.int(4, 12), m: rng.int(5, 14), c: rng.int(2, 6) };
    // Depth 1 distractors near the triangular number must not themselves be triangular.
    if (isTri(tri(p.n) + 1) || isTri(tri(p.n) - 1) || isSquare(tri(p.n)))
      reject("distractors that are not triangular");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const t = tri(p.n);
        return A.choice({
          rng,
          question: ["Which of these is a triangular number?"],
          correct: A.math(String(t)),
          distractors: [t + 1, t - 1].map((x) => ({
            content: A.math(String(x)),
            code: "ALG.SEQUENCE.TYPE",
            feedback:
              "Triangular numbers are 1, 3, 6, 10, 15, …: each adds one more than the last.",
          })),
          solution: [{ say: `${t} = 1 + 2 + … + ${p.n}.` }],
        });
      }
      case 2: {
        const sq = p.m * p.m;
        const v = (p.m + 1) ** 2;
        return A.variedForm({
          rng,
          forms: [{ question: [`What is the next square number after ${sq}?`] }],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SEQUENCE.TYPE",
              value: A.number(sq + 2),
              feedback: `${sq} = ${p.m}², so the next square number is ${p.m + 1}².`,
            },
          ]),
          solution: [{ say: "", math: `${p.m + 1}^2 = ${v}` }],
        });
      }
      default: {
        // 1 and 64 are both squares and cubes; pick a cube that is not a square.
        const cube = p.c === 4 ? 27 : p.c ** 3;
        return A.oddOneOut({
          rng,
          question: "Which number is the odd one out?",
          items: [
            { content: A.math(String((p.c + 1) ** 2)) },
            { content: A.math(String((p.c + 2) ** 2)) },
            { content: A.math(String((p.c + 3) ** 2)) },
            { content: A.math(String(cube)), odd: true },
          ].filter(
            (it, i, all) =>
              all.findIndex((x) => JSON.stringify(x.content) === JSON.stringify(it.content)) === i,
          ),
          reasons: [
            {
              text: `It is the only one that is not a square number (${cube} is a cube number).`,
              correct: true,
            },
            { text: "It is the only odd number.", code: "ALG.SEQUENCE.TYPE" },
            { text: "It is the only triangular number.", code: "ALG.SEQUENCE.TYPE" },
          ],
          solution: [
            { say: `${(p.c + 1) ** 2}, ${(p.c + 2) ** 2} and ${(p.c + 3) ** 2} are squares.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return isTri(Number(chosenText(question)));
    if (question.key.depth === 2) return numberAnswer(question) === (p.m + 1) ** 2;
    return true;
  },
});
