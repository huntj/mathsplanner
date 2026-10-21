/**
 * @statement N-MEA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// N-MEA-01: Make comparisons between objects relating to size, length, weight and capacity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ScaleSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { ribbons } from "../shared/mea.ts";

interface Params {
  lengths: [number, number, number];
  longest: boolean;
  /** Water in two jugs, out of 10. */
  jugs: [number, number];
  pair: number;
}

const NAMES = ["A", "B", "C"];
// [tall thin, short wide] pairs where the short wide one holds more.
const PAIRS: [string, string][] = [
  ["a tall thin vase", "a wide bucket"],
  ["a tall thin glass", "a big wide bowl"],
  ["a tall thin bottle", "a wide paddling pool"],
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
  id: "N-MEA-01",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["MEA.COMPARE.LOOKS"],

  params(rng, numbers) {
    const gap = numbers === "friendly" ? 3 : numbers === "standard" ? 2 : 1;
    const lengths = rng.shuffle([3, 3 + gap, 3 + 2 * gap]) as [number, number, number];
    const a = rng.int(2, 8);
    const b = rng.int(2, 8);
    if (Math.abs(a - b) < gap) reject("jugs that differ clearly");
    return { lengths, longest: rng.bool(), jugs: [a, b], pair: rng.int(0, PAIRS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const target = p.longest ? Math.max(...p.lengths) : Math.min(...p.lengths);
        const i = p.lengths.indexOf(target);
        const word = p.longest ? "longest" : "shortest";
        return A.choice({
          rng,
          question: ["Look at the ribbons.", A.figure(ribbons(p.lengths, NAMES))],
          ask: `Which ribbon is the ${word}?`,
          correct: NAMES[i] ?? "",
          distractors: NAMES.filter((_, k) => k !== i).map((n) => ({
            content: n,
            feedback: `Look at where each ribbon ends. The ${word} ribbon reaches ${p.longest ? "furthest" : "the least far"}.`,
          })),
          solution: [
            {
              say: `The ribbons start in the same place, so ribbon ${NAMES[i] ?? ""} is the ${word}.`,
            },
          ],
        });
      }
      case 3: {
        const [a, b] = p.jugs;
        const more = Math.max(a, b);
        return A.chooseTheDiagram({
          rng,
          question: ["The jugs are the same size. Which jug has more water in it?"],
          correct: jug(more),
          distractors: [
            {
              figure: jug(Math.min(a, b)),
              feedback: "Look at how high the water comes. The fuller jug has more.",
            },
          ],
          solution: [{ say: "The water is higher in the jug with more water." }],
        });
      }
      default: {
        const [tall, wide] = (PAIRS[p.pair] ?? PAIRS[0]) as (typeof PAIRS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Sam has ${tall} and ${wide}. Sam says ${tall.replace(/^a /, "the ")} must hold more water because it is taller.`,
          truth: false,
          reasons: [
            {
              text: `False. Being taller does not mean it holds more. ${wide.replace(/^a /, "The ")} is much wider, so it holds more.`,
              correct: true,
            },
            { text: "True. The tallest thing always holds the most.", code: "MEA.COMPARE.LOOKS" },
            { text: "True. Thin things hold more than wide things.", code: "MEA.COMPARE.LOOKS" },
          ],
          solution: [{ say: "To find out, fill one and pour it into the other." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const target = p.longest ? Math.max(...p.lengths) : Math.min(...p.lengths);
      return chosenText(question) === NAMES[p.lengths.indexOf(target)];
    }
    if (question.archetype === "choose-the-diagram")
      return (chosenFigure(question) as ScaleSpec | undefined)?.reading === Math.max(...p.jugs);
    return true;
  },
});
