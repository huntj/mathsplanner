/**
 * @statement GF-A24.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A24.d: Recognise quadratic sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  a: number;
  b: number;
  c: number;
}

const term = (p: Params, n: number) => p.a * n * n + p.b * n + p.c;

export default defineGenerator<Params>({
  id: "GF-A24.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.TYPE", "ALG.SEQUENCE.QUADRATIC-HALF"],

  params(rng) {
    const p = { a: rng.int(1, 3), b: rng.int(-4, 5), c: rng.int(-5, 6) };
    if (p.a + p.b === 0) reject("a changing first difference");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const t = [1, 2, 3, 4, 5].map((n) => term(p, n));
    switch (depth) {
      case 1:
        return A.standard({
          question: [`Find the second difference of the sequence ${t.join(", ")}, …`],
          answer: A.number(2 * p.a),
          wrong: signedWrongs(2 * p.a, [
            {
              code: "ALG.SEQUENCE.QUADRATIC-HALF",
              value: A.number((t[1] ?? 0) - (t[0] ?? 0)),
              feedback:
                "That is the first difference. Find the differences between the differences.",
            },
          ]),
          solution: [
            {
              say: `First differences: ${t
                .slice(1)
                .map((x, i) => x - (t[i] ?? 0))
                .join(", ")}; second difference: ${2 * p.a}.`,
            },
          ],
        });
      case 2: {
        const v = term(p, 6);
        const firsts = t.slice(1).map((x, i) => x - (t[i] ?? 0));
        return A.variedForm({
          rng,
          forms: [
            { question: [`Find the next term of the quadratic sequence ${t.join(", ")}, …`] },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SEQUENCE.TYPE",
              value: A.number((t[4] ?? 0) + (firsts.at(-1) ?? 0)),
              feedback: `The differences go up by ${2 * p.a} each time, so the next difference is ${(firsts.at(-1) ?? 0) + 2 * p.a}.`,
            },
          ]),
          solution: [
            {
              say: `Next difference ${(firsts.at(-1) ?? 0) + 2 * p.a}: ${t[4]} + ${(firsts.at(-1) ?? 0) + 2 * p.a} = ${v}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Gus says 2, 6, 12, 20, 30, … is an arithmetic sequence."],
          truth: false,
          reasons: [
            {
              text: "False. The differences 4, 6, 8, 10 increase by 2 each time, so it is a quadratic sequence (nth term n² + n).",
              correct: true,
            },
            { text: "True. It goes up each time.", code: "ALG.SEQUENCE.TYPE" },
            { text: "True. The terms are all even.", code: "ALG.SEQUENCE.TYPE" },
          ],
          solution: [{ say: "An arithmetic sequence has a constant first difference." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 2 * p.a;
    if (question.key.depth === 2) return numberAnswer(question) === term(p, 6);
    return true;
  },
});
