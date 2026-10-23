/**
 * @statement R-PAT-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the early years sub-statements
 */
// R-PAT-01.c: Share amounts up to 10 equally
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer, objects } from "../shared/counting.ts";

interface Params {
  k: number;
  j: number;
}

export default defineGenerator<Params>({
  id: "R-PAT-01.c",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["MD.SHARE.GROUPS", "PAT.EVEN-ODD"],

  params(rng) {
    return { k: rng.int(1, 5), j: rng.int(2, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = 2 * p.k;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `${n} sweets are shared equally between 2 children.`,
            A.figure(objects(n, { arrangement: "dice" })),
          ],
          ask: "How many sweets does each child get?",
          answer: A.number(p.k),
          wrong: wrongs(p.k, [
            {
              code: "MD.SHARE.GROUPS",
              value: A.number(2),
              feedback: `2 is the number of children. Give one sweet to each child in turn until all ${n} are gone.`,
            },
          ]),
          solution: [{ say: `${n} shared between 2 gives ${p.k} each.` }],
        });
      case 3: {
        const m = 2 * p.j;
        return A.chooseTheDiagram({
          rng,
          question: [`Which picture shows ${m} counters shared equally into 2 groups?`],
          correct: objects(m, { second: p.j }),
          distractors: [
            {
              figure: objects(m, { second: p.j - 1 }),
              code: "MD.SHARE.GROUPS",
              feedback: "Equal groups have the same number in each. Count both colours.",
            },
          ],
          solution: [{ say: `${p.j} and ${p.j}: equal groups.` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["7 sweets can be shared equally between 2 children."],
          truth: "never",
          reasons: [
            {
              text: "Never. Each child gets 3 and there is 1 left over, because 7 is odd.",
              correct: true,
            },
            { text: "Always. Any number can be shared.", code: "PAT.EVEN-ODD" },
            { text: "Sometimes. If one child gets more.", code: "MD.SHARE.GROUPS" },
          ],
          solution: [{ say: "Only even numbers share equally between 2." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k;
    if (question.key.depth === 3) {
      const counts = (chosenFigure(question) as CountersSpec & { counts?: number[] })?.counts ?? [];
      return counts.length === 2 && counts[0] === counts[1];
    }
    return true;
  },
});
