/**
 * @statement N-NPV-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-NPV-06: Link numerals and amounts, e.g. show the right number of objects to match a numeral up
// to 5
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CounterShape } from "@mathsplanner/diagrams";
import { chosenText, countOf, objects, SHAPE_PLURAL, SHAPES } from "../shared/counting.ts";

interface Params {
  n: number;
  shape: CounterShape;
  /** Three different amounts for the matching question. */
  set: number[];
}

export default defineGenerator<Params>({
  id: "N-NPV-06",
  version: "1.0.0",
  depths: [1, 3],
  misconceptions: ["NPV.COUNT.SKIP-OR-DOUBLE"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 4 : 5;
    return {
      n: rng.int(1, top),
      shape: rng.pick(SHAPES),
      set: rng.sample(
        [1, 2, 3, 4, 5].filter((v) => v <= top),
        3,
      ),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const what = SHAPE_PLURAL[p.shape];
    if (depth === 1) {
      const others = [p.n + 1, p.n - 1, p.n + 2].filter((m) => m >= 1 && m !== p.n).slice(0, 2);
      return A.choice({
        rng,
        question: [
          `Count the ${what}.`,
          A.figure(objects(p.n, { shape: p.shape, arrangement: "dice", hidden: true })),
        ],
        ask: "Which number shows how many?",
        correct: A.math(String(p.n)),
        distractors: others.map((m) => ({
          content: A.math(String(m)),
          ...(m === p.n + 1
            ? { code: "NPV.COUNT.SKIP-OR-DOUBLE", feedback: "Count again, touching each one once." }
            : {}),
        })),
        solution: [{ say: `There are ${p.n} ${what}, and the numeral ${p.n} shows that.` }],
      });
    }
    return A.matchRepresentations({
      rng,
      question: "Match each picture to its number.",
      pairs: p.set.map(
        (m) =>
          [
            A.figure(objects(m, { shape: p.shape, arrangement: "dice", hidden: true })),
            A.math(String(m)),
          ] as [A.RichInput, A.RichInput],
      ),
      solution: [{ say: "Count each picture, then find the numeral that says the same number." }],
    });
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return (
        chosenText(question) === String(countOf(question.diagrams[0])) &&
        countOf(question.diagrams[0]) === p.n
      );
    // Matching: one picture per amount, and every picture counts to its own amount.
    return question.diagrams.map(countOf).sort().join() === [...p.set].sort().join();
  },
});
