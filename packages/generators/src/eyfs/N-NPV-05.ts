/**
 * @statement N-NPV-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-NPV-05: Show 'finger numbers' up to 5
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, countOf, fingers, numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
}

export default defineGenerator<Params>({
  id: "N-NPV-05",
  version: "1.0.0",
  depths: [1, 3],
  misconceptions: ["NPV.COUNT.SKIP-OR-DOUBLE"],

  params(rng, numbers) {
    return { n: numbers === "friendly" ? rng.int(1, 3) : rng.int(1, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 1) {
      return A.standard({
        question: ["Look at the hand.", A.figure(fingers(p.n, true))],
        ask: "How many fingers are up?",
        answer: A.number(p.n),
        wrong: wrongs(p.n, [
          {
            code: "NPV.COUNT.SKIP-OR-DOUBLE",
            value: A.number(p.n + 1),
            feedback: "Count only the fingers that are standing up, once each.",
          },
        ]),
        solution: [{ say: `${p.n} finger${p.n === 1 ? " is" : "s are"} up.` }],
      });
    }
    const others = [p.n - 1, p.n + 1, p.n + 2]
      .filter((m) => m >= 1 && m <= 5 && m !== p.n)
      .slice(0, 2);
    return A.chooseTheDiagram({
      rng,
      question: `Which hand shows ${p.n}?`,
      ask: "Choose the hand.",
      correct: fingers(p.n, true),
      distractors: others.map((m) => ({
        figure: fingers(m, true),
        feedback: `That hand shows ${m}.`,
      })),
      solution: [{ say: `The hand with ${p.n} finger${p.n === 1 ? "" : "s"} up shows ${p.n}.` }],
    });
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram") return countOf(chosenFigure(question)) === p.n;
    return numberAnswer(question) === countOf(question.diagrams[0]);
  },
});
