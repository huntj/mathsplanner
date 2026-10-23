/**
 * @statement R-PAT-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the early years sub-statements
 */
// R-PAT-01.b: Explore double facts to 10
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer, objects } from "../shared/counting.ts";

interface Params {
  n: number;
  m: number;
}

export default defineGenerator<Params>({
  id: "R-PAT-01.b",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["PAT.DOUBLE.ADD"],

  params(rng) {
    const p = { n: rng.int(2, 5), m: rng.int(2, 5) };
    if (p.n === p.m) reject("two different doubles");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = 2 * p.n;
        return A.standard({
          question: [`What is double ${p.n}?`, A.figure(objects(p.n, { arrangement: "dice" }))],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PAT.DOUBLE.ADD",
              value: A.number(p.n + 1),
              feedback: `Double means two lots: ${p.n} and ${p.n} more.`,
            },
          ]),
          solution: [{ say: "", math: `${p.n} + ${p.n} = ${v}` }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which picture shows double ${p.m}?`],
          correct: objects(2 * p.m, { second: p.m }),
          distractors: [
            {
              figure: objects(p.m + 2, { second: 2 }),
              code: "PAT.DOUBLE.ADD",
              feedback: `Double ${p.m} is two equal groups of ${p.m}.`,
            },
          ],
          solution: [{ say: "", math: `${p.m} + ${p.m} = ${2 * p.m}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Max says double ${p.n} is ${p.n + 1}.`,
          truth: false,
          reasons: [
            {
              text: `False. Double ${p.n} is ${p.n} and ${p.n} more, which is ${2 * p.n}.`,
              correct: true,
            },
            { text: "True. Double means one more.", code: "PAT.DOUBLE.ADD" },
            { text: "True. You add 1 to double a number.", code: "PAT.DOUBLE.ADD" },
          ],
          solution: [{ say: "", math: `${p.n} + ${p.n} = ${2 * p.n}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 2 * p.n;
    if (question.key.depth === 3) {
      const counts = (chosenFigure(question) as CountersSpec & { counts?: number[] })?.counts ?? [];
      return counts.length === 2 && counts[0] === p.m && counts[1] === p.m;
    }
    return true;
  },
});
