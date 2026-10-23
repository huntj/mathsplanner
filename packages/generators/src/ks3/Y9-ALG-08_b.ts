/**
 * @statement Y9-ALG-08.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-08.b: Recognise Fibonacci, square and triangular numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

const tri = (n: number) => (n * (n + 1)) / 2;

interface Params {
  n: number;
  a: number;
  b: number;
  s: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-08.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.TYPE"],

  params(rng) {
    const p = { n: rng.int(5, 12), a: rng.int(1, 6), b: rng.int(1, 6), s: rng.int(3, 6) };
    if (Number.isInteger(Math.sqrt(tri(p.s + 3)))) reject("a triangular number that is not square");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = tri(p.n + 1);
        return A.standard({
          question: [
            `The triangular numbers start 1, 3, 6, 10, … The ${p.n}th triangular number is ${tri(p.n)}.`,
          ],
          ask: `What is the ${p.n + 1}th triangular number?`,
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SEQUENCE.TYPE",
              value: A.number(tri(p.n) + p.n),
              feedback: `Each triangular number adds the next counting number: + ${p.n + 1}.`,
            },
          ]),
          solution: [{ say: "", math: `${tri(p.n)} + ${p.n + 1} = ${v}` }],
        });
      }
      case 2: {
        const seq = [p.a, p.b];
        while (seq.length < 6) seq.push((seq.at(-1) ?? 0) + (seq.at(-2) ?? 0));
        const v = seq[5] ?? 0;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A Fibonacci-type sequence starts ${p.a}, ${p.b}, … Each term is the sum of the two before it.`,
              ],
              ask: "Find the 6th term.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SEQUENCE.TYPE",
              value: A.number(p.a + 5 * (p.b - p.a)),
              feedback: "Add the two previous terms each time; the gaps are not constant.",
            },
          ]),
          solution: [{ say: "", math: seq.join(", ") }],
        });
      }
      default: {
        const odd = tri(p.s + 3);
        return A.oddOneOut({
          rng,
          question: "Which number is the odd one out?",
          items: [
            { content: A.math(String(p.s * p.s)) },
            { content: A.math(String((p.s + 1) ** 2)) },
            { content: A.math(String((p.s + 2) ** 2)) },
            { content: A.math(String(odd)), odd: true },
          ],
          reasons: [
            {
              text: `It is the only one that is not a square number (${odd} is a triangular number).`,
              correct: true,
            },
            { text: "It is the only even number.", code: "ALG.SEQUENCE.TYPE" },
            { text: "It is the only number bigger than 20.", code: "ALG.SEQUENCE.TYPE" },
          ],
          solution: [
            {
              say: `${p.s * p.s}, ${(p.s + 1) ** 2} and ${(p.s + 2) ** 2} are ${p.s}², ${p.s + 1}² and ${p.s + 2}².`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === tri(p.n + 1);
    if (question.key.depth === 2) {
      const seq = [p.a, p.b];
      while (seq.length < 6) seq.push((seq.at(-1) ?? 0) + (seq.at(-2) ?? 0));
      return numberAnswer(question) === seq[5];
    }
    return true;
  },
});
