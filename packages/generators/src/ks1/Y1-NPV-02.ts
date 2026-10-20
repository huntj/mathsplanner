/**
 * @statement Y1-NPV-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-NPV-02: Count, read and write numbers to 100 in numerals; count in 2s, 5s and 10s
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";

interface Params {
  step: 2 | 5 | 10;
  /** How many steps have been counted before the gap. */
  k: number;
}

const jumps = (step: number, count: number): NumberLineSpec => ({
  type: "number-line",
  min: 0,
  max: Math.max(step * count, 10),
  step: step === 10 ? 10 : step === 5 ? 5 : 2,
  labels: "all",
  jumps: Array.from({ length: count }, (_, i) => ({ from: i * step, to: (i + 1) * step })),
  description: "A number line with equal jumps from 0.",
});

export default defineGenerator<Params>({
  id: "Y1-NPV-02",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["NPV.SEQUENCE.STEP-ONE"],

  params(rng, numbers) {
    return {
      step: numbers === "friendly" ? rng.pick([2, 10] as const) : rng.pick([2, 5, 10] as const),
      k: rng.int(3, numbers === "stretch" ? 9 : 5),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const seq = Array.from({ length: p.k }, (_, i) => (i + 1) * p.step);
    const next = (p.k + 1) * p.step;
    const wrong = wrongs(next, [
      {
        code: "NPV.SEQUENCE.STEP-ONE",
        value: A.number(next - p.step + 1),
        feedback: `Counting in ${p.step}s, each number is ${p.step} more than the last.`,
      },
    ]);
    switch (depth) {
      case 1:
        return A.standard({
          question: `Count in ${p.step}s: ${seq.join(", ")}, …`,
          ask: "What number comes next?",
          answer: A.number(next),
          wrong,
          solution: [{ say: `Add ${p.step} each time: ${seq.at(-1)} + ${p.step} = ${next}.` }],
        });
      case 2:
        return A.missingValue({
          intro: `Count in ${p.step}s. What number is missing?`,
          relation: [p.step, ",", 2 * p.step, ",", 3 * p.step, ",", 4 * p.step],
          hide: 4,
          wrong: [
            {
              code: "NPV.SEQUENCE.STEP-ONE",
              value: A.number(2 * p.step + 1),
              feedback: `Counting in ${p.step}s adds ${p.step} each time, not 1.`,
            },
          ],
          solution: [
            {
              say: `${p.step}, ${2 * p.step}, ${3 * p.step}, ${4 * p.step}: add ${p.step} each time.`,
            },
          ],
        });
      default: {
        const others = ([2, 5, 10] as const).filter((s) => s !== p.step);
        return A.chooseTheDiagram({
          rng,
          question: `Which number line shows counting in ${p.step}s?`,
          ask: "Choose the number line.",
          correct: jumps(p.step, 4),
          distractors: others.map((s) => ({
            figure: jumps(s, 4),
            feedback: `Those jumps are ${s}s.`,
          })),
          solution: [
            { say: `Each jump is ${p.step}: ${[1, 2, 3, 4].map((i) => i * p.step).join(", ")}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === (p.k + 1) * p.step;
    if (question.archetype === "missing-value") return numberAnswer(question) === 3 * p.step;
    const line = chosenFigure(question) as NumberLineSpec | undefined;
    return (line?.jumps ?? []).every((j) => j.to - j.from === p.step);
  },
});
