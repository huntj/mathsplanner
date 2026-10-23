/**
 * @statement R-MEA-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the early years sub-statements
 */
// R-MEA-01.a: Compare lengths
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { BarModelSpec } from "@mathsplanner/diagrams";
import { chosenFigure, chosenText } from "../shared/counting.ts";
import { ribbons } from "../shared/mea.ts";

const NAMES = ["A", "B", "C"];

interface Params {
  lengths: [number, number, number];
  ask: number;
}

export default defineGenerator<Params>({
  id: "R-MEA-01.a",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["MEA.COMPARE.LOOKS"],

  params(rng) {
    const lengths = rng.shuffle([2, 4, 6].map((x) => x + rng.int(0, 1))) as [
      number,
      number,
      number,
    ];
    if (new Set(lengths).size < 3) reject("three different lengths");
    return { lengths, ask: rng.int(0, 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const sorted = [...p.lengths].sort((a, b) => a - b);
    switch (depth) {
      case 1: {
        // Shorter than the middle one.
        const mid = sorted[1] ?? 4;
        const target = p.ask === 0 ? (sorted[0] ?? 2) : (sorted[2] ?? 6);
        const word = p.ask === 0 ? "shorter" : "longer";
        const name = NAMES[p.lengths.indexOf(mid)] ?? "B";
        const right = NAMES[p.lengths.indexOf(target)] ?? "A";
        return A.choice({
          rng,
          question: ["Look at the snakes.", A.figure(ribbons(p.lengths, NAMES))],
          ask: `Which snake is ${word} than snake ${name}?`,
          correct: right,
          distractors: NAMES.filter((n) => n !== right && n !== name).map((n) => ({
            content: n,
            code: "MEA.COMPARE.LOOKS",
            feedback: `Compare each snake with snake ${name}: which one ends ${p.ask === 0 ? "sooner" : "further"}?`,
          })),
          solution: [{ say: `Snake ${right} is ${word} than snake ${name}.` }],
        });
      }
      case 3: {
        const asc = sorted;
        return A.chooseTheDiagram({
          rng,
          question: ["Which picture shows the snakes in order from shortest to longest?"],
          correct: ribbons(asc, NAMES),
          distractors: [
            {
              figure: ribbons([asc[1] ?? 4, asc[0] ?? 2, asc[2] ?? 6], NAMES),
              code: "MEA.COMPARE.LOOKS",
              feedback: "Each snake should be longer than the one above it.",
            },
          ],
          solution: [{ say: "Shortest at the top, longest at the bottom." }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "A wiggly snake and a straight snake end at the same place. Sid says the wiggly snake is the same length as the straight one.",
          truth: false,
          reasons: [
            {
              text: "False. If the wiggly snake were straightened out, it would be longer.",
              correct: true,
            },
            { text: "True. They end at the same place.", code: "MEA.COMPARE.LOOKS" },
            { text: "True. Snakes are all the same length.", code: "MEA.COMPARE.LOOKS" },
          ],
          solution: [{ say: "Straighten things out to compare their lengths." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) {
      const sorted = [...p.lengths].sort((a, b) => a - b);
      const target = p.ask === 0 ? sorted[0] : sorted[2];
      return chosenText(question) === NAMES[p.lengths.indexOf(target ?? 0)];
    }
    if (question.key.depth === 3) {
      const sizes = ((chosenFigure(question) as BarModelSpec | undefined)?.bars ?? []).map(
        (b) => b.parts[0]?.size ?? 0,
      );
      return sizes.every((s, i) => i === 0 || s > (sizes[i - 1] ?? 0));
    }
    return true;
  },
});
