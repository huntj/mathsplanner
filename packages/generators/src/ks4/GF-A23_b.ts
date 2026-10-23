/**
 * @statement GF-A23.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A23.b: Generate a sequence from a position-to-term rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  n: number;
  k: number;
  truth: boolean;
}

export default defineGenerator<Params>({
  id: "GF-A23.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.POSITION-RULE"],

  params(rng) {
    const p = {
      a: rng.int(2, 9),
      b: rng.int(-9, 9),
      n: rng.int(10, 60),
      k: rng.int(8, 40),
      truth: rng.bool(),
    };
    if (p.b === 0) reject("a constant term");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const rule = linear([
      [p.a, "n"],
      [p.b, ""],
    ]);
    switch (depth) {
      case 1: {
        const v = p.a * p.n + p.b;
        return A.standard({
          question: ["The nth term of a sequence is ", A.math(rule), "."],
          ask: `Find the ${p.n}th term.`,
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(p.a * p.n),
              feedback: `Substitute n = ${p.n} into the whole rule, including the ${p.b}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.a} \\times ${p.n} ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const t = p.a * p.k + p.b;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The nth term of a sequence is ", A.math(rule), "."],
              ask: `Which term is equal to ${t}?`,
            },
          ],
          answer: A.number(p.k),
          wrong: wrongs(p.k, [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(Math.round((t / p.a) * 100) / 100),
              feedback: `Solve ${rule} = ${t}: undo the ${p.b} before dividing by ${p.a}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${rule} = ${t} \\Rightarrow ${p.a}n = ${t - p.b} \\Rightarrow n = ${p.k}`,
            },
          ],
        });
      }
      default: {
        const t = p.a * p.k + p.b + (p.truth ? 0 : 1);
        return A.trueOrFalseWhy({
          rng,
          statement: [`Sam says ${t} is a term of the sequence with nth term `, A.math(rule), "."],
          truth: p.truth,
          reasons: p.truth
            ? [
                { text: `True. ${rule} = ${t} gives n = ${p.k}, a whole number.`, correct: true },
                {
                  text: `False. ${t} is not a multiple of ${p.a}.`,
                  code: "ALG.SEQUENCE.POSITION-RULE",
                },
                { text: "False. Big numbers cannot be in the sequence." },
              ]
            : [
                {
                  text: `False. ${rule} = ${t} gives n = ${(t - p.b) / p.a}, not a whole number.`,
                  correct: true,
                },
                {
                  text: `True. Every number above ${p.a + p.b} is in the sequence.`,
                  code: "ALG.SEQUENCE.POSITION-RULE",
                },
                { text: "True. The sequence goes up steadily, so it reaches every number." },
              ],
          solution: [
            { say: "Solve the nth term equal to the number: a term needs a whole-number n." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a * p.n + p.b;
    if (question.key.depth === 2) return numberAnswer(question) === p.k;
    return true;
  },
});
