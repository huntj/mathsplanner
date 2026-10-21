/**
 * @statement N-PAT-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-PAT-03: Notice and correct an error in a repeating pattern
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { itemName, pickUnit, repeat, row, type Item } from "../shared/pat.ts";

interface Params {
  kind: "AB" | "ABB" | "ABC";
  wrong: number;
  unit: Item[];
}

const ORDINAL = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];

export default defineGenerator<Params>({
  id: "N-PAT-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PAT.REPEAT.UNIT"],

  params(rng, numbers) {
    const kind = numbers === "friendly" ? "AB" : rng.pick(["AB", "ABB", "ABC"] as const);
    return { kind, wrong: rng.int(3, 7), unit: pickUnit(rng, kind) };
  },

  build(p, depth, rng): QuestionDraft {
    const unit = p.unit;
    const items = repeat(unit, 8);
    const right = items[p.wrong] as Item;
    const swapIn = unit.find((u) => u.shape !== right.shape || u.filled !== right.filled) as Item;
    const shown = items.map((it, i) => (i === p.wrong ? swapIn : it));
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "One shape in this pattern is wrong.",
            A.figure(row(shown, "A repeating pattern of shapes with one mistake.")),
          ],
          ask: "Which shape is wrong?",
          correct: `the ${ORDINAL[p.wrong] ?? ""} shape`,
          distractors: [p.wrong - 1, p.wrong + 1, 0]
            .filter((i) => i >= 0 && i < 8 && i !== p.wrong)
            .map((i) => ({
              content: `the ${ORDINAL[i] ?? ""} shape`,
              code: "PAT.REPEAT.UNIT",
              feedback: "Say the pattern aloud from the start and listen for where it goes wrong.",
            })),
          solution: [
            {
              say: `The pattern is ${unit.map(itemName).join(", ")}, again and again, so the ${ORDINAL[p.wrong] ?? ""} shape should be a ${itemName(right)}.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `One shape in this pattern is wrong: the ${ORDINAL[p.wrong] ?? ""} one.`,
            A.figure(row(shown, "A repeating pattern of shapes with one mistake.")),
          ],
          ask: "What should it be?",
          correct: itemName(right),
          distractors: [
            {
              content: itemName(swapIn),
              code: "PAT.REPEAT.UNIT",
              feedback: "That is the shape that is there now, which is the mistake.",
            },
            ...unit
              .filter((u) => itemName(u) !== itemName(right) && itemName(u) !== itemName(swapIn))
              .map((u) => ({
                content: itemName(u),
                feedback: "Count along the pattern to that place.",
              })),
          ],
          solution: [{ say: `It should be a ${itemName(right)}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Rafi made this pattern and says it has no mistakes.",
            A.figure(row(shown, "A row of shapes.")),
          ],
          truth: false,
          reasons: [
            {
              text: `False. The ${ORDINAL[p.wrong] ?? ""} shape should be a ${itemName(right)}.`,
              correct: true,
            },
            {
              text: "True. All the shapes are ones that are in the pattern.",
              code: "PAT.REPEAT.UNIT",
            },
            { text: "True. Any order is a pattern.", code: "PAT.REPEAT.UNIT" },
          ],
          solution: [{ say: `The pattern repeats ${unit.map(itemName).join(", ")}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === `the ${ORDINAL[p.wrong] ?? ""} shape`;
    if (question.archetype === "varied-form")
      return chosenText(question) === itemName(repeat(p.unit, 8)[p.wrong] as Item);
    return true;
  },
});
