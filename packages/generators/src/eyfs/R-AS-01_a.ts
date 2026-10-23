/**
 * @statement R-AS-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the early years sub-statements
 */
// R-AS-01.a: Recall number bonds to 5, including subtraction facts
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer, objects } from "../shared/counting.ts";

interface Params {
  a: number;
}

export default defineGenerator<Params>({
  id: "R-AS-01.a",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.COMPOSITION.ADD-NOT-PART"],

  params(rng) {
    return { a: rng.int(1, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    const b = 5 - p.a;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `There are 5 counters. ${p.a} are filled in.`,
            A.figure(objects(5, { second: b })),
          ],
          ask: "How many are not filled in?",
          answer: A.number(b),
          wrong: wrongs(b, [
            {
              code: "NPV.COMPOSITION.ADD-NOT-PART",
              value: A.number(5 + p.a),
              feedback: `There are only 5 altogether. ${p.a} and how many more make 5?`,
            },
          ]),
          solution: [{ say: "", math: `${p.a} + ${b} = 5` }],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which picture shows 5 split into ${p.a} and ${b}?`],
          correct: objects(5, { second: b }),
          distractors: [
            {
              figure: objects(5 + (p.a === 4 ? -1 : 1), { second: b }),
              feedback: "Count all the counters: there should be 5 altogether.",
            },
          ],
          solution: [{ say: "", math: `${p.a} + ${b} = 5` }],
        });
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [`If ${p.a} + ${b} = 5, then 5 − ${b} = ${p.a}.`],
          truth: "always",
          reasons: [
            {
              text: `Always. 5 is made of ${p.a} and ${b}, so taking ${b} away leaves ${p.a}.`,
              correct: true,
            },
            {
              text: "Never. Taking away is not the same as adding.",
              code: "NPV.COMPOSITION.ADD-NOT-PART",
            },
            { text: "Sometimes. Only with small numbers." },
          ],
          solution: [{ say: "Number bonds work both ways: adding and taking away." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 5 - p.a;
    if (question.key.depth === 3) {
      const counts = (chosenFigure(question) as CountersSpec & { counts?: number[] })?.counts ?? [];
      return counts.reduce((s, x) => s + x, 0) === 5;
    }
    return true;
  },
});
