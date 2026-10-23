/**
 * @statement N-MEA-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the early years sub-statements
 */
// N-MEA-01.c: Compare containers by capacity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { ScaleSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";

const PAIRS: [string, string][] = [
  ["a bath", "a cup"],
  ["a bucket", "an egg cup"],
  ["a watering can", "a spoon"],
  ["a paddling pool", "a mug"],
];

const jug = (level: number): ScaleSpec => ({
  type: "measure",
  instrument: "jug",
  max: 10,
  step: 10,
  reading: level,
  unit: "\\text{cups}",
  description: "A jug with some water in it.",
});

interface Params {
  pair: number;
  empty: boolean;
}

export default defineGenerator<Params>({
  id: "N-MEA-01.c",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["MEA.COMPARE.LOOKS"],

  params(rng) {
    return { pair: rng.int(0, PAIRS.length - 1), empty: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [big, small] = PAIRS[p.pair] ?? PAIRS[0] ?? ["", ""];
        return A.choice({
          rng,
          question: [`Which holds more water: ${small} or ${big}?`],
          correct: big,
          distractors: [
            {
              content: small,
              code: "MEA.COMPARE.LOOKS",
              feedback: `Think about filling them. ${big[0]?.toUpperCase()}${big.slice(1)} would need much more water.`,
            },
            {
              content: "They hold the same",
              feedback: "One is much bigger inside than the other.",
            },
          ],
          solution: [{ say: `${big[0]?.toUpperCase()}${big.slice(1)} holds more.` }],
        });
      }
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which jug is nearly ${p.empty ? "empty" : "full"}?`],
          correct: jug(p.empty ? 1 : 9),
          distractors: [
            {
              figure: jug(p.empty ? 9 : 1),
              code: "MEA.COMPARE.LOOKS",
              feedback: `${p.empty ? "Empty means hardly any water." : "Full means the water is near the top."}`,
            },
            { figure: jug(5), feedback: "That jug is about half full." },
          ],
          solution: [
            {
              say: `Nearly ${p.empty ? "empty: the water is near the bottom." : "full: the water is near the top."}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Two cups are the same size. Ali's cup is full and Bea's cup is half full. Bea says her cup has more drink in it.",
          truth: false,
          reasons: [
            {
              text: "False. The cups are the same size, and Ali's is filled higher, so Ali's has more.",
              correct: true,
            },
            { text: "True. Half full means more.", code: "MEA.COMPARE.LOOKS" },
            { text: "True. They both have the same amount.", code: "MEA.COMPARE.LOOKS" },
          ],
          solution: [{ say: "In the same-sized cup, the higher the drink, the more there is." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === PAIRS[p.pair]?.[0];
    if (question.key.depth === 3)
      return (chosenFigure(question) as ScaleSpec | undefined)?.reading === (p.empty ? 1 : 9);
    return true;
  },
});
