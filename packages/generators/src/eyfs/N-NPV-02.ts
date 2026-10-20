/**
 * @statement N-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-NPV-02: Recite numbers past 5
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** The number before the one asked for. */
  n: number;
  /** Depth 4: whether Sam's count is right, and which number he misses if not. */
  right: boolean;
}

export default defineGenerator<Params>({
  id: "N-NPV-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.SEQUENCE.BEFORE-AFTER", "NPV.COUNT.SKIP-OR-DOUBLE"],

  params(rng, numbers) {
    return {
      n:
        numbers === "friendly"
          ? rng.int(4, 6)
          : numbers === "standard"
            ? rng.int(5, 8)
            : rng.int(6, 9),
      right: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: `Count with me: ${Array.from({ length: p.n }, (_, i) => i + 1).join(", ")} …`,
          ask: `What number comes after ${p.n}?`,
          answer: A.number(p.n + 1),
          wrong: wrongs(p.n + 1, [
            {
              code: "NPV.SEQUENCE.BEFORE-AFTER",
              value: A.number(p.n - 1),
              feedback: `${p.n - 1} comes before ${p.n}. Say the next number: ${p.n}, …`,
            },
          ]),
          solution: [{ say: `After ${p.n} comes ${p.n + 1}.` }],
        });
      case 2: {
        const start = p.n - 2;
        return A.missingValue({
          intro: "Count on. What number is missing?",
          relation: [start, ",", start + 1, ",", start + 2, ",", start + 3],
          hide: 4,
          wrong: [
            {
              code: "NPV.SEQUENCE.BEFORE-AFTER",
              value: A.number(start + 1),
              feedback: `That number is already there. What comes after ${start + 1}?`,
            },
          ],
          solution: [
            { say: `Count on from ${start}: ${start}, ${start + 1}, ${start + 2}, ${start + 3}.` },
          ],
        });
      }
      default: {
        const all = [p.n - 2, p.n - 1, p.n, p.n + 1];
        const said = p.right ? all : all.filter((v) => v !== p.n);
        return A.trueOrFalseWhy({
          rng,
          statement: `Sam counts: ${said.join(", ")}. Sam says he counted correctly.`,
          truth: p.right,
          reasons: p.right
            ? [
                {
                  text: `Each number is one more than the one before: ${said.join(", ")}.`,
                  correct: true,
                },
                { text: "He should have started at 1, so it is wrong." },
                {
                  text: `He has missed a number between ${p.n - 1} and ${p.n + 1}.`,
                  code: "NPV.COUNT.SKIP-OR-DOUBLE",
                },
              ]
            : [
                { text: `He missed out ${p.n}: after ${p.n - 1} comes ${p.n}.`, correct: true },
                {
                  text: "The numbers go up, so they must be right.",
                  code: "NPV.COUNT.SKIP-OR-DOUBLE",
                },
                { text: "Numbers can be said in any order." },
              ],
          solution: [{ say: `Counting goes ${all.join(", ")}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.n + 1;
    if (question.archetype === "missing-value") return numberAnswer(question) === p.n;
    return true;
  },
});
