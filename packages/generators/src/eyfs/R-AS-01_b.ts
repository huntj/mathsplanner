/**
 * @statement R-AS-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the early years sub-statements
 */
// R-AS-01.b: Recall some number bonds to 10, including doubles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer, tenFrames } from "../shared/counting.ts";

interface Params {
  a: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "R-AS-01.b",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.COMPOSITION.ADD-NOT-PART", "PAT.DOUBLE.ADD"],

  params(rng) {
    return { a: rng.int(1, 9), d: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = 10 - p.a;
        return A.standard({
          question: ["Look at the ten frame.", A.figure(tenFrames(p.a))],
          ask: "How many more counters are needed to make 10?",
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.COMPOSITION.ADD-NOT-PART",
              value: A.number(10 + p.a),
              feedback: "Count the empty spaces: that is how many more make 10.",
            },
          ]),
          solution: [{ say: "", math: `${p.a} + ${v} = 10` }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which ten frame shows double ${p.d}?`],
          correct: tenFrames(2 * p.d, { second: p.d }),
          distractors: [
            {
              figure: tenFrames(p.d + 1, { second: 1 }),
              code: "PAT.DOUBLE.ADD",
              feedback: `Double ${p.d} means ${p.d} and ${p.d} again.`,
            },
          ],
          solution: [{ say: "", math: `${p.d} + ${p.d} = ${2 * p.d}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: "Kit says double 5 makes 10.",
          truth: true,
          reasons: [
            { text: "True. 5 and 5 more is 10: two full hands of fingers.", correct: true },
            { text: "False. Double 5 is 6.", code: "PAT.DOUBLE.ADD" },
            { text: "False. Double 5 is 7.", code: "PAT.DOUBLE.ADD" },
          ],
          solution: [{ say: "", math: "5 + 5 = 10" }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 10 - p.a;
    if (question.key.depth === 3)
      return (
        ((chosenFigure(question) as CountersSpec & { frames?: number[] })?.frames ?? []).reduce(
          (s, x) => s + x,
          0,
        ) ===
        2 * p.d
      );
    return true;
  },
});
