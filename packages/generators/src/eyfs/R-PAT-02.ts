/**
 * @statement R-PAT-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-PAT-02: Continue, copy and create repeating patterns
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import {
  itemName,
  nextGuesses,
  pickUnit,
  repeat,
  row,
  type Item,
  type Kind,
} from "../shared/pat.ts";

interface Params {
  kind: Kind;
  unit: Item[];
  shown: number;
  ask: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "R-PAT-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PAT.REPEAT.UNIT"],

  params(rng, numbers) {
    const kind = numbers === "friendly" ? "AB" : rng.pick(["ABB", "AAB", "ABC"] as const);
    const unit = pickUnit(rng, kind);
    return {
      kind,
      unit,
      shown: unit.length * 2 + rng.int(0, unit.length - 1),
      ask: rng.int(8, 10),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const items = repeat(p.unit, p.shown);
    switch (depth) {
      case 1: {
        const right = p.unit[p.shown % p.unit.length] as Item;
        return A.choice({
          rng,
          question: [
            "Look at the pattern.",
            A.figure(row([...items, null], "A repeating pattern of shapes with a gap at the end.")),
          ],
          ask: "What comes next?",
          correct: itemName(right),
          distractors: nextGuesses(p.unit, p.shown).map((g) => ({
            content: itemName(g),
            code: "PAT.REPEAT.UNIT",
            feedback: `Find the part that repeats: ${p.unit.map(itemName).join(", ")}.`,
          })),
          solution: [
            {
              say: `The pattern repeats ${p.unit.map(itemName).join(", ")}, so next is a ${itemName(right)}.`,
            },
          ],
        });
      }
      case 2:
        return A.standard({
          question: [
            "Look at the pattern.",
            A.figure(row(items, "A repeating pattern of shapes.")),
          ],
          ask: "How many shapes are in the part that repeats?",
          answer: A.number(p.unit.length),
          wrong: wrongs(p.unit.length, [
            {
              code: "PAT.REPEAT.UNIT",
              value: A.number(new Set(p.unit.map(itemName)).size),
              feedback: "Count every shape in the repeating part, even ones that come twice.",
            },
            {
              code: "PAT.REPEAT.UNIT",
              value: A.number(p.unit.length * 2),
              feedback: "That is the part twice. Find the smallest part that repeats.",
            },
          ]),
          solution: [
            { say: `${p.unit.map(itemName).join(", ")} repeats: ${p.unit.length} shapes.` },
          ],
        });
      default: {
        const truthItem = p.unit[(p.ask - 1) % p.unit.length] as Item;
        const said = p.claimTrue
          ? truthItem
          : (p.unit.find((u) => itemName(u) !== itemName(truthItem)) as Item);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Bea keeps this pattern going.",
            A.figure(row(items, "A repeating pattern of shapes.")),
            `She says the ${p.ask}th shape will be a ${itemName(said)}.`,
          ],
          truth: p.claimTrue,
          reasons: [
            {
              text: `${p.claimTrue ? "True" : "False"}. Carry on the pattern and count: the ${p.ask}th shape is a ${itemName(truthItem)}.`,
              correct: true,
            },
            {
              text: `${p.claimTrue ? "False" : "True"}. It is the same as the last shape you can see.`,
              code: "PAT.REPEAT.UNIT",
            },
            {
              text: `${p.claimTrue ? "False" : "True"}. You cannot tell what comes later in a pattern.`,
            },
          ],
          solution: [{ say: `${repeat(p.unit, p.ask).map(itemName).join(", ")}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === p.unit.length;
    if (question.archetype === "standard")
      return chosenText(question) === itemName(p.unit[p.shown % p.unit.length] as Item);
    return true;
  },
});
