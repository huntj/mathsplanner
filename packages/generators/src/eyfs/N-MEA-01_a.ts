/**
 * @statement N-MEA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the early years sub-statements
 */
// N-MEA-01.a: Compare objects by size and length
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { BarModelSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { ribbons } from "../shared/mea.ts";

interface Params {
  a: number;
  b: number;
  longer: boolean;
}

const sameLength = (spec: unknown) => {
  const bars = (spec as BarModelSpec | undefined)?.bars ?? [];
  return bars.length === 2 && bars[0]?.parts[0]?.size === bars[1]?.parts[0]?.size;
};

export default defineGenerator<Params>({
  id: "N-MEA-01.a",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["MEA.COMPARE.LOOKS"],

  params(rng) {
    const p = { a: rng.int(2, 8), b: rng.int(2, 8), longer: rng.bool() };
    if (Math.abs(p.a - p.b) < 2) reject("ribbons that differ clearly");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const word = p.longer ? "longer" : "shorter";
        const pick = p.longer === p.a > p.b ? "A" : "B";
        return A.choice({
          rng,
          question: ["Look at the two ribbons.", A.figure(ribbons([p.a, p.b], ["A", "B"]))],
          ask: `Which ribbon is ${word}?`,
          correct: pick,
          distractors: [
            {
              content: pick === "A" ? "B" : "A",
              code: "MEA.COMPARE.LOOKS",
              feedback: `Both ribbons start in the same place. Look at which one ends ${p.longer ? "further" : "sooner"}.`,
            },
            { content: "They are the same", feedback: "The ribbons end in different places." },
          ],
          solution: [{ say: `Ribbon ${pick} is ${word}.` }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: ["Which picture shows two ribbons that are the same length?"],
          correct: ribbons([p.a, p.a], ["A", "B"]),
          distractors: [
            {
              figure: ribbons([p.a, p.b], ["A", "B"]),
              code: "MEA.COMPARE.LOOKS",
              feedback: "Check where each ribbon ends. These two end in different places.",
            },
          ],
          solution: [{ say: "Same length: both ribbons start and end in the same places." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Sam lays a pencil across the table and a ruler along it. Sam says the pencil is longer because it is on top.",
          truth: false,
          reasons: [
            {
              text: "False. Where an object is does not make it longer. Line them up side by side, starting at the same place, to compare.",
              correct: true,
            },
            { text: "True. The thing on top is always longer.", code: "MEA.COMPARE.LOOKS" },
            { text: "True. Pencils are longer than rulers.", code: "MEA.COMPARE.LOOKS" },
          ],
          solution: [{ say: "Compare lengths by lining things up at one end." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === (p.longer === p.a > p.b ? "A" : "B");
    if (question.key.depth === 3) return sameLength(chosenFigure(question));
    return true;
  },
});
