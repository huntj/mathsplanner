/**
 * @statement N-NPV-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-NPV-07: Experiment with my own symbols and marks as well as numerals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenFigure, countOf, objects, tally } from "../shared/counting.ts";

interface Params {
  n: number;
  thing: string;
  /** Depth 4: the marks Kim draws match the cakes, or have one too many. */
  right: boolean;
}

const THINGS = ["apples", "cakes", "balls", "fish", "cars", "teddies"];

export default defineGenerator<Params>({
  id: "N-NPV-07",
  version: "1.0.0",
  depths: [3, 4],
  misconceptions: ["NPV.REPRESENT.NUMERALS-ONLY", "NPV.COUNT.SKIP-OR-DOUBLE"],

  params(rng, numbers) {
    return {
      n: numbers === "friendly" ? rng.int(2, 3) : rng.int(2, 5),
      thing: rng.pick(THINGS),
      right: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    if (depth === 3) {
      return A.chooseTheDiagram({
        rng,
        question: `Sam has ${p.n} ${p.thing}. He made some marks to show how many.`,
        ask: `Which marks show ${p.n}?`,
        correct: tally(p.n, true),
        distractors: [
          {
            figure: tally(p.n + 1, true),
            code: "NPV.COUNT.SKIP-OR-DOUBLE",
            feedback: "Count the marks: there is one too many.",
          },
          {
            figure: objects(p.n - 1, { shape: "star", arrangement: "row", hidden: true }),
            feedback: `Count the stars: there are ${p.n - 1}.`,
          },
        ],
        solution: [{ say: `One mark for each of the ${p.thing}: ${p.n} marks show ${p.n}.` }],
      });
    }
    const drawn = p.right ? p.n : p.n + 1;
    return A.trueOrFalseWhy({
      rng,
      statement: [
        `Kim has ${p.n} ${p.thing}. She draws these stars and says they show how many ${p.thing} she has.`,
        A.figure(objects(drawn, { shape: "star", arrangement: "row", hidden: true })),
      ],
      truth: p.right,
      reasons: p.right
        ? [
            {
              text: `There is one star for each of the ${p.thing}, so the stars show ${p.n}.`,
              correct: true,
            },
            {
              text: `Only the numeral ${p.n} can show how many.`,
              code: "NPV.REPRESENT.NUMERALS-ONLY",
            },
            { text: `She has to draw ${p.thing}, not stars.` },
          ]
        : [
            {
              text: `There are ${drawn} stars but only ${p.n} ${p.thing}: one star too many.`,
              correct: true,
            },
            {
              text: `Stars cannot show a number; she needs to write ${p.n}.`,
              code: "NPV.REPRESENT.NUMERALS-ONLY",
            },
            { text: "Any number of stars is fine, because they are her own marks." },
          ],
      solution: [
        {
          say: `Marks of any kind show a number when there is one mark for each thing. ${p.n} ${p.thing} need ${p.n} marks.`,
        },
      ],
    });
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram") return countOf(chosenFigure(question)) === p.n;
    return countOf(question.diagrams[0]) === (p.right ? p.n : p.n + 1);
  },
});
