/**
 * @statement N-NPV-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-NPV-03: Say one number for each item as I count, in order 1, 2, 3, 4, 5
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CounterShape } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { countOf, numberAnswer, objects, SHAPE_PLURAL, SHAPES } from "../shared/counting.ts";

interface Params {
  n: number;
  shape: CounterShape;
  seed: number;
}

const upTo = (n: number) => Array.from({ length: n }, (_, i) => i + 1).join(", ");

export default defineGenerator<Params>({
  id: "N-NPV-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COUNT.SKIP-OR-DOUBLE"],

  params(rng, numbers) {
    return {
      n:
        numbers === "friendly"
          ? rng.int(2, 4)
          : numbers === "standard"
            ? rng.int(3, 5)
            : rng.int(4, 5),
      shape: rng.pick(SHAPES),
      seed: rng.int(0, 999),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const what = SHAPE_PLURAL[p.shape];
    const wrong = wrongs(p.n, [
      {
        code: "NPV.COUNT.SKIP-OR-DOUBLE",
        value: A.number(p.n + 1),
        feedback: "Touch each one as you say a number, and say only one number for each.",
      },
    ]);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `Count the ${what}. Touch each one as you count.`,
            A.figure(objects(p.n, { shape: p.shape, hidden: true })),
          ],
          ask: `How many ${what} are there?`,
          answer: A.number(p.n),
          wrong,
          solution: [{ say: `Say one number for each: ${upTo(p.n)}. There are ${p.n}.` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `These ${what} are all mixed up. Count them carefully.`,
                A.figure(
                  objects(p.n, {
                    shape: p.shape,
                    arrangement: "scatter",
                    seed: p.seed,
                    hidden: true,
                  }),
                ),
              ],
              ask: `How many ${what}?`,
            },
            {
              question: [
                `The ${what} are in a line.`,
                A.figure(objects(p.n, { shape: p.shape, arrangement: "row", hidden: true })),
              ],
              ask: "Count them. How many?",
            },
          ],
          answer: A.number(p.n),
          wrong,
          solution: [{ say: `One number for each: ${upTo(p.n)}. There are ${p.n}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Ali counts these ${what}: "${upTo(p.n + 1)}". He says there are ${p.n + 1}.`,
            A.figure(
              objects(p.n, { shape: p.shape, arrangement: "scatter", seed: p.seed, hidden: true }),
            ),
          ],
          truth: false,
          reasons: [
            { text: `There are ${p.n}. Ali said a number twice for one of them.`, correct: true },
            {
              text: "Every number Ali said was in the right order, so he is right.",
              code: "NPV.COUNT.SKIP-OR-DOUBLE",
            },
            { text: "You cannot count things that are mixed up." },
          ],
          solution: [{ say: `Touch each one once: ${upTo(p.n)}. There are ${p.n}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "true-or-false-why") return countOf(question.diagrams[0]) === p.n;
    return numberAnswer(question) === countOf(question.diagrams[0]);
  },
});
