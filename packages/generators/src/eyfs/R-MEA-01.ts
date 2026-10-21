/**
 * @statement R-MEA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-MEA-01: Compare length, weight and capacity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { ScaleSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { ribbons } from "../shared/mea.ts";

interface Params {
  lengths: number[];
  longest: boolean;
  balance: number;
  /** Water in three jugs, out of 10. */
  jugs: [number, number, number];
  most: boolean;
  big: number;
}

const NAMES = ["A", "B", "C", "D"];
// [heavier, lighter] pairs for a balance.
const BALANCE: [string, string][] = [
  ["a book", "a pencil"],
  ["an apple", "a feather"],
  ["a brick", "a sock"],
  ["a bag of shopping", "a leaf"],
];
// [big but light, small but heavy]
const BIG_LIGHT: [string, string][] = [
  ["a big balloon", "a small stone"],
  ["a big pillow", "a small tin of beans"],
  ["a big box of tissues", "a small bag of sugar"],
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

export default defineGenerator<Params>({
  id: "R-MEA-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.COMPARE.LOOKS"],

  params(rng, numbers) {
    const n = numbers === "friendly" ? 3 : 4;
    const lengths = rng.shuffle([3, 5, 7, 9].slice(0, n));
    const levels = rng.shuffle([2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3) as [number, number, number];
    return {
      lengths,
      longest: rng.bool(),
      balance: rng.int(0, BALANCE.length - 1),
      jugs: levels,
      most: rng.bool(),
      big: rng.int(0, BIG_LIGHT.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const target = p.longest ? Math.max(...p.lengths) : Math.min(...p.lengths);
        const i = p.lengths.indexOf(target);
        const names = NAMES.slice(0, p.lengths.length);
        const word = p.longest ? "longest" : "shortest";
        return A.choice({
          rng,
          question: ["Look at the ribbons.", A.figure(ribbons(p.lengths, names))],
          ask: `Which ribbon is the ${word}?`,
          correct: names[i] ?? "",
          distractors: names
            .filter((_, k) => k !== i)
            .map((n) => ({
              content: n,
              feedback: `Compare where the ribbons end. The ${word} one ${p.longest ? "goes furthest" : "stops soonest"}.`,
            })),
          solution: [
            {
              say: `All the ribbons start at the same place, so ${names[i] ?? ""} is the ${word}.`,
            },
          ],
        });
      }
      case 2: {
        const [heavy, light] = (BALANCE[p.balance] ?? BALANCE[0]) as (typeof BALANCE)[number];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A balance has ${heavy} on one side and ${light} on the other. The side with ${heavy.replace(/^an? /, "the ")} goes down.`,
          ask: "Which is heavier?",
          correct: heavy,
          distractors: [
            {
              content: light,
              code: "MEA.COMPARE.LOOKS",
              feedback: "The heavier side goes down. The lighter side goes up.",
            },
            {
              content: "They weigh the same",
              feedback: "If they weighed the same, the balance would be level.",
            },
          ],
          solution: [{ say: `The heavier thing pulls its side down, so ${heavy} is heavier.` }],
        });
      }
      case 3: {
        const target = p.most ? Math.max(...p.jugs) : Math.min(...p.jugs);
        return A.chooseTheDiagram({
          rng,
          question: [
            `The jugs are all the same size. Which jug has the ${p.most ? "most" : "least"} water?`,
          ],
          correct: jug(target),
          distractors: p.jugs
            .filter((j) => j !== target)
            .map((j) => ({
              figure: jug(j),
              feedback: `Look at how high the water comes. The ${p.most ? "fullest" : "emptiest"} jug has the ${p.most ? "most" : "least"}.`,
            })),
          solution: [{ say: `The water level is ${p.most ? "highest" : "lowest"} in that jug.` }],
        });
      }
      default: {
        const [big, small] = (BIG_LIGHT[p.big] ?? BIG_LIGHT[0]) as (typeof BIG_LIGHT)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Mo says ${big.replace(/^a /, "the ")} must be heavier than ${small.replace(/^a /, "the ")} because it is bigger.`,
          truth: false,
          reasons: [
            {
              text: `False. Bigger things are not always heavier. On a balance, ${small.replace(/^a /, "the ")} would go down.`,
              correct: true,
            },
            { text: "True. The biggest thing is always the heaviest.", code: "MEA.COMPARE.LOOKS" },
            {
              text: "True. You can tell how heavy something is by looking at it.",
              code: "MEA.COMPARE.LOOKS",
            },
          ],
          solution: [{ say: "Use a balance to compare weights. Size can trick you." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const target = p.longest ? Math.max(...p.lengths) : Math.min(...p.lengths);
      return chosenText(question) === NAMES[p.lengths.indexOf(target)];
    }
    if (question.archetype === "varied-form")
      return (
        chosenText(question) === ((BALANCE[p.balance] ?? BALANCE[0]) as (typeof BALANCE)[number])[0]
      );
    if (question.archetype === "choose-the-diagram") {
      const target = p.most ? Math.max(...p.jugs) : Math.min(...p.jugs);
      return (chosenFigure(question) as ScaleSpec | undefined)?.reading === target;
    }
    return true;
  },
});
