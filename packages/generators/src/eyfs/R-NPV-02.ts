/**
 * @statement R-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-NPV-02: Subitise up to 5 (ELG)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import {
  chosenFigure,
  countOf,
  fingers,
  numberAnswer,
  objects,
  tenFrames,
} from "../shared/counting.ts";

interface Params {
  n: number;
  seed: number;
}

export default defineGenerator<Params>({
  id: "R-NPV-02",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["NPV.COUNT.SKIP-OR-DOUBLE", "NPV.SUBITISE.ARRANGEMENT"],

  params(rng, numbers) {
    return {
      n:
        numbers === "friendly"
          ? rng.int(1, 4)
          : numbers === "standard"
            ? rng.int(2, 5)
            : rng.int(3, 5),
      seed: rng.int(0, 999),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const wrong = wrongs(p.n, [
      {
        code: "NPV.COUNT.SKIP-OR-DOUBLE",
        value: A.number(p.n + 1),
        feedback: "Look at the pattern again: it is one fewer than that.",
      },
    ]);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Look quickly. Do not count!",
            A.figure(objects(p.n, { arrangement: "dice", hidden: true })),
          ],
          ask: "How many dots?",
          answer: A.number(p.n),
          wrong,
          solution: [{ say: `This is the ${p.n} pattern you see on a dice.` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Look quickly at the ten frame.",
                A.figure(tenFrames(p.n, { hidden: true })),
              ],
              ask: "How many counters?",
            },
            {
              question: ["Look quickly at the hand.", A.figure(fingers(p.n, true))],
              ask: "How many fingers are up?",
            },
          ],
          answer: A.number(p.n),
          wrong,
          solution: [{ say: `There are ${p.n}. You can see it without counting one by one.` }],
        });
      case 3: {
        const others = [p.n + 1, p.n - 1, p.n + 2]
          .filter((m) => m >= 1 && m <= 6 && m !== p.n)
          .slice(0, 2);
        return A.chooseTheDiagram({
          rng,
          question: `Which shows ${p.n}?`,
          ask: "Look quickly and choose.",
          correct: objects(p.n, { arrangement: "dice", hidden: true }),
          distractors: others.map((m) => ({
            figure: objects(m, { arrangement: "dice", hidden: true }),
            feedback: `That shows ${m}.`,
          })),
          solution: [{ say: `The ${p.n} dice pattern shows ${p.n}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Leo says these two pictures show different numbers, because the dots are arranged differently.",
            A.figure(objects(p.n, { arrangement: "dice", hidden: true })),
            A.figure(objects(p.n, { arrangement: "scatter", seed: p.seed, hidden: true })),
          ],
          truth: false,
          reasons: [
            {
              text: `Both show ${p.n}. Moving the dots around does not change how many there are.`,
              correct: true,
            },
            {
              text: "A different pattern always means a different number.",
              code: "NPV.SUBITISE.ARRANGEMENT",
            },
            { text: "You cannot tell how many without a dice." },
          ],
          solution: [
            { say: `Count both: each has ${p.n}. The arrangement does not change the number.` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram") return countOf(chosenFigure(question)) === p.n;
    if (question.archetype === "true-or-false-why")
      return question.diagrams.every((d) => countOf(d) === p.n);
    return numberAnswer(question) === countOf(question.diagrams[0]);
  },
});
