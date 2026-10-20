/**
 * @statement N-NPV-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-NPV-01: Fast-recognise up to 3 objects without counting (subitise)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CounterArrangement, CounterShape } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import {
  chosenFigure,
  countOf,
  fingers,
  numberAnswer,
  objects,
  SHAPE_PLURAL,
  SHAPES,
} from "../shared/counting.ts";

interface Params {
  n: number;
  shape: CounterShape;
  arrangement: CounterArrangement;
  seed: number;
}

export default defineGenerator<Params>({
  id: "N-NPV-01",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["NPV.COUNT.SKIP-OR-DOUBLE"],

  params(rng, numbers) {
    return {
      n: numbers === "friendly" ? rng.int(1, 2) : rng.int(1, 3),
      shape: numbers === "friendly" ? "circle" : rng.pick(SHAPES),
      arrangement: numbers === "stretch" ? rng.pick(["row", "scatter"] as const) : "dice",
      seed: rng.int(0, 999),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const what = SHAPE_PLURAL[p.shape];
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `Look quickly at the ${what}.`,
            A.figure(
              objects(p.n, {
                shape: p.shape,
                arrangement: p.arrangement,
                seed: p.seed,
                hidden: true,
              }),
            ),
          ],
          ask: `How many ${what} are there? Try to see it without counting.`,
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "NPV.COUNT.SKIP-OR-DOUBLE",
              value: A.number(p.n + 1),
              feedback: "Look again: is there one more than you thought, or did you see one twice?",
            },
          ]),
          solution: [
            {
              say: `There ${p.n === 1 ? "is 1" : `are ${p.n}`}. Small groups like this can be seen all at once, without counting.`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Look at the fingers.", A.figure(fingers(p.n, true))],
              ask: "How many fingers are up?",
            },
            {
              question: [
                `Look at the ${what}.`,
                A.figure(
                  objects(p.n, {
                    shape: p.shape,
                    arrangement: "scatter",
                    seed: p.seed + 1,
                    hidden: true,
                  }),
                ),
              ],
              ask: `How many ${what}?`,
            },
          ],
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "NPV.COUNT.SKIP-OR-DOUBLE",
              value: A.number(p.n + 1),
              feedback: "Look again carefully: there is one fewer than that.",
            },
          ]),
          solution: [
            {
              say: `There are ${p.n}. The same number can look different, but it is still ${p.n}.`,
            },
          ],
        });
      default: {
        const others = [p.n + 1, p.n === 1 ? 3 : p.n - 1].filter(
          (m, i, all) => m >= 1 && m <= 4 && m !== p.n && all.indexOf(m) === i,
        );
        return A.chooseTheDiagram({
          rng,
          question: `Which picture shows ${p.n}?`,
          ask: "Choose the picture.",
          correct: objects(p.n, { shape: p.shape, arrangement: "dice", hidden: true }),
          distractors: others.map((m) => ({
            figure: objects(m, { shape: p.shape, arrangement: "dice", hidden: true }),
            feedback: `That picture shows ${m}.`,
          })),
          solution: [
            {
              say: `The picture with ${p.n} ${p.n === 1 ? what.slice(0, -1) : what} shows ${p.n}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram") return countOf(chosenFigure(question)) === p.n;
    return (
      numberAnswer(question) === countOf(question.diagrams[0]) &&
      countOf(question.diagrams[0]) === p.n
    );
  },
});
