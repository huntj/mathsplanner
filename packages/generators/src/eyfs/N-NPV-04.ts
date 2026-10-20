/**
 * @statement N-NPV-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-NPV-04: Know the last number I say when counting tells me the total (cardinal principle)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenFigure, chosenText, countOf, objects } from "../shared/counting.ts";

interface Params {
  n: number;
}

const upTo = (n: number) => Array.from({ length: n }, (_, i) => i + 1).join(", ");

export default defineGenerator<Params>({
  id: "N-NPV-04",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.COUNT.CARDINAL"],

  params(rng, numbers) {
    return {
      n:
        numbers === "friendly"
          ? rng.int(3, 4)
          : numbers === "standard"
            ? rng.int(3, 5)
            : rng.int(4, 6),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            `Mia counts the counters: "${upTo(p.n)}".`,
            A.figure(objects(p.n, { hidden: true })),
          ],
          ask: "How many counters are there?",
          correct: String(p.n),
          distractors: [
            {
              content: upTo(p.n),
              code: "NPV.COUNT.CARDINAL",
              feedback: `Those are the numbers Mia said. The last one, ${p.n}, tells you how many.`,
            },
            {
              content: "1",
              code: "NPV.COUNT.CARDINAL",
              feedback: `1 was the first number. The last number she said, ${p.n}, is how many.`,
            },
            { content: String(p.n + 1) },
          ],
          solution: [{ say: `The last number Mia said was ${p.n}, so there are ${p.n} counters.` }],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: `Kai counted some counters. The last number he said was ${p.n}.`,
          ask: "Which picture did Kai count?",
          correct: objects(p.n, { arrangement: "row", hidden: true }),
          distractors: [p.n - 1, p.n + 1].map((m) => ({
            figure: objects(m, { arrangement: "row", hidden: true }),
            feedback: `Counting that picture ends at ${m}, not ${p.n}.`,
          })),
          solution: [
            { say: `The last number said is how many there are, so Kai counted ${p.n} counters.` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Mia counts: "${upTo(p.n)}". She says, "There are ${p.n} counters."`,
            A.figure(objects(p.n, { hidden: true })),
          ],
          truth: true,
          reasons: [
            {
              text: "The last number you say when you count tells you how many there are.",
              correct: true,
            },
            {
              text: "She has to count them all again to find how many.",
              code: "NPV.COUNT.CARDINAL",
            },
            { text: "There is 1, because she started at 1.", code: "NPV.COUNT.CARDINAL" },
          ],
          solution: [{ say: `When you count, the last number tells you the total: ${p.n}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === String(countOf(question.diagrams[0]));
    if (question.archetype === "choose-the-diagram") return countOf(chosenFigure(question)) === p.n;
    return countOf(question.diagrams[0]) === p.n;
  },
});
