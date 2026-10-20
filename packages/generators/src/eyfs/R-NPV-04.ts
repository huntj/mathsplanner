/**
 * @statement R-NPV-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-NPV-04: Count beyond ten
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, countOf, numberAnswer, tenFrames } from "../shared/counting.ts";

interface Params {
  /** 11 to 19. */
  n: number;
}

export default defineGenerator<Params>({
  id: "R-NPV-04",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["NPV.TEENS.REVERSAL", "NPV.SEQUENCE.BEFORE-AFTER", "NPV.COUNT.SKIP-OR-DOUBLE"],

  params(rng, numbers) {
    return {
      n:
        numbers === "friendly"
          ? rng.int(11, 14)
          : numbers === "standard"
            ? rng.int(11, 17)
            : rng.int(13, 19),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const ones = p.n - 10;
    const reversed = ones * 10 + 1;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Count the counters in the ten frames.",
            A.figure(tenFrames(p.n, { hidden: true })),
          ],
          ask: "How many counters are there?",
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "NPV.TEENS.REVERSAL",
              value: A.number(reversed),
              feedback: `The full frame is ten and there are ${ones} more: ten and ${ones} is ${p.n}.`,
            },
            {
              code: "NPV.COUNT.SKIP-OR-DOUBLE",
              value: A.number(p.n + 1),
              feedback: "Start from the full frame, 10, and count on one at a time.",
            },
          ]),
          solution: [
            {
              say: `One full ten frame is 10. Count on ${ones} more: ${Array.from({ length: ones }, (_, i) => 11 + i).join(", ")}. There are ${p.n}.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: `Count on from 10: ${Array.from({ length: ones }, (_, i) => 10 + i).join(", ")} …`,
          ask: `What number comes after ${p.n - 1}?`,
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "NPV.SEQUENCE.BEFORE-AFTER",
              value: A.number(p.n - 2),
              feedback: `That comes before ${p.n - 1}. Say the next number.`,
            },
          ]),
          solution: [{ say: `After ${p.n - 1} comes ${p.n}.` }],
        });
      default:
        return A.chooseTheDiagram({
          rng,
          question: `Which picture shows ${p.n}?`,
          ask: "Choose the picture.",
          correct: tenFrames(p.n, { hidden: true }),
          distractors: [
            ...(ones <= 4
              ? [
                  {
                    figure: tenFrames(ones * 10, { hidden: true }),
                    code: "NPV.TEENS.REVERSAL",
                    feedback: `That shows ${ones * 10}. ${p.n} is one ten and ${ones} ones.`,
                  },
                ]
              : []),
            { figure: tenFrames(p.n - 1, { hidden: true }), feedback: `That shows ${p.n - 1}.` },
            { figure: tenFrames(p.n + 1, { hidden: true }), feedback: `That shows ${p.n + 1}.` },
          ],
          solution: [
            { say: `${p.n} is ten and ${ones} more: one full ten frame and ${ones} counters.` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram") return countOf(chosenFigure(question)) === p.n;
    if (question.diagrams.length === 0) return numberAnswer(question) === p.n;
    return numberAnswer(question) === countOf(question.diagrams[0]);
  },
});
