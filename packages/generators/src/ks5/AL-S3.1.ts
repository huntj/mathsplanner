/**
 * @statement AL-S3.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S3.1: Understand and use mutually exclusive and independent events
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
}

const r4 = (x: number) => Math.round(x * 10000) / 10000;

export default defineGenerator<Params>({
  id: "AL-S3.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.INDEPENDENT.EXCLUSIVE", "PRO.TREE.ADD-ALONG"],

  params(rng) {
    const a = rng.int(1, 6) / 10;
    const b = rng.int(1, 6) / 10;
    if (a === b || a + b >= 1) reject("two different probabilities that can be exclusive");
    return { a, b };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const both = r4(p.a * p.b);
        return A.standard({
          question: `Events A and B are independent, with P(A) = ${p.a} and P(B) = ${p.b}.`,
          ask: "Find P(A ∩ B).",
          answer: A.number(both),
          wrong: wrongs(both, [
            {
              code: "PRO.TREE.ADD-ALONG",
              value: A.number(r4(p.a + p.b)),
              feedback: "For independent events, multiply: P(A ∩ B) = P(A) × P(B).",
            },
          ]),
          solution: [{ say: `${p.a} × ${p.b} = ${both}.` }],
        });
      }
      case 2: {
        const either = r4(p.a + p.b);
        return A.variedForm({
          rng,
          forms: [
            {
              question: `Events A and B are mutually exclusive, with P(A) = ${p.a} and P(B) = ${p.b}.`,
              ask: "Find P(A ∪ B).",
            },
          ],
          answer: A.number(either),
          wrong: wrongs(either, [
            {
              code: "PRO.INDEPENDENT.EXCLUSIVE",
              value: A.number(r4(p.a + p.b - p.a * p.b)),
              feedback:
                "Mutually exclusive events cannot both happen, so P(A ∩ B) = 0 and P(A ∪ B) = P(A) + P(B).",
            },
          ]),
          solution: [{ say: `${p.a} + ${p.b} = ${either}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Events A and B are independent, with P(A) = ${p.a} and P(B) = ${p.b}. Liv says they are also mutually exclusive.`,
          truth: false,
          reasons: [
            {
              text: `False. Independent events with non-zero probabilities can happen together: P(A ∩ B) = ${r4(p.a * p.b)}, not 0.`,
              correct: true,
            },
            {
              text: "True. Independent means they never happen at the same time.",
              code: "PRO.INDEPENDENT.EXCLUSIVE",
            },
            {
              text: "True. Independent and mutually exclusive mean the same thing.",
              code: "PRO.INDEPENDENT.EXCLUSIVE",
            },
          ],
          solution: [
            {
              say: "Independent: one does not affect the other. Mutually exclusive: they cannot both happen.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r4(p.a * p.b);
    return true;
  },
});
