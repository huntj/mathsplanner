/**
 * @statement GF-A24.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A24.c: Recognise Fibonacci-type sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
}

const seq = (p: Params, n: number) => {
  const out = [p.a, p.b];
  while (out.length < n) out.push((out.at(-1) ?? 0) + (out.at(-2) ?? 0));
  return out;
};

export default defineGenerator<Params>({
  id: "GF-A24.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.TYPE"],

  params(rng) {
    return { a: rng.int(1, 9), b: rng.int(1, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    const s = seq(p, 6);
    switch (depth) {
      case 1: {
        const v = s[5] ?? 0;
        return A.standard({
          question: [
            `Each term of a sequence is the sum of the two terms before it. It begins ${s.slice(0, 5).join(", ")}, …`,
          ],
          ask: "Find the next term.",
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SEQUENCE.TYPE",
              value: A.number((s[4] ?? 0) + ((s[4] ?? 0) - (s[3] ?? 0))),
              feedback: "Add the two terms before: it is not an arithmetic sequence.",
            },
          ]),
          solution: [{ say: `${s[3]} + ${s[4]} = ${v}.` }],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A Fibonacci-type sequence has 3rd term ${s[2]} and 4th term ${s[3]}.`],
              ask: "Find the 1st term.",
            },
          ],
          answer: A.number(p.a),
          wrong: signedWrongs(p.a, [
            {
              code: "ALG.SEQUENCE.TYPE",
              value: A.number(p.b),
              feedback: "Work backwards: term 2 = term 4 − term 3, then term 1 = term 3 − term 2.",
            },
          ]),
          solution: [
            { say: `Term 2 = ${s[3]} − ${s[2]} = ${p.b}; term 1 = ${s[2]} − ${p.b} = ${p.a}.` },
          ],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["In a Fibonacci-type sequence of whole numbers, the terms always increase."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. With positive starting terms they increase, but starting 5, −3 gives 5, −3, 2, −1, 1, … which does not.",
              correct: true,
            },
            {
              text: "Always. Adding always makes the next term bigger.",
              code: "ALG.SEQUENCE.TYPE",
            },
            { text: "Never. Fibonacci sequences repeat." },
          ],
          solution: [{ say: "Adding a negative number makes a term smaller." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === seq(p, 6)[5];
    if (question.key.depth === 2) return numberAnswer(question) === p.a;
    return true;
  },
});
