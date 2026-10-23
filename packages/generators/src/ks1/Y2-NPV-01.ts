/**
 * @statement Y2-NPV-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-NPV-01: Count in steps of 2, 3 and 5 from 0, and in tens from any number, forwards and backwards
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";

export interface Params {
  step: 2 | 3 | 5;
  k: number;
  /** Counting back in tens from this number. */
  start: number;
  claim: number;
}

const jumps = (step: number): NumberLineSpec => ({
  type: "number-line",
  min: 0,
  max: 15,
  step: 1,
  labels: "ends",
  jumps: Array.from({ length: Math.floor(15 / step) }, (_, i) => ({
    from: i * step,
    to: (i + 1) * step,
  })),
  description: "A number line from 0 to 15 with equal jumps from 0.",
});

export default defineGenerator<Params>({
  id: "Y2-NPV-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["NPV.SEQUENCE.STEP-ONE", "NPV.PLACE.TENS-ONES-MIXUP"],

  params(rng, numbers) {
    return {
      step: numbers === "friendly" ? rng.pick([2, 5] as const) : rng.pick([2, 3, 5] as const),
      k: rng.int(3, numbers === "stretch" ? 10 : 6),
      start: rng.int(numbers === "friendly" ? 41 : 52, 99),
      claim: rng.int(0, 2),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const seq = Array.from({ length: p.k }, (_, i) => i * p.step);
        const next = p.k * p.step;
        return A.standard({
          question: `Count in ${p.step}s from 0: ${seq.join(", ")}, …`,
          ask: "What number comes next?",
          answer: A.number(next),
          wrong: wrongs(next, [
            {
              code: "NPV.SEQUENCE.STEP-ONE",
              value: A.number(next - p.step + 1),
              feedback: `Each number is ${p.step} more than the one before.`,
            },
          ]),
          solution: [{ say: `${seq.at(-1)} + ${p.step} = ${next}.` }],
        });
      }
      case 2: {
        const a = p.start;
        return A.missingValue({
          intro: "Count back in tens. What number is missing?",
          relation: [a, ",", a - 10, ",", a - 20, ",", a - 30],
          hide: 4,
          wrong: [
            {
              code: "NPV.SEQUENCE.STEP-ONE",
              value: A.number(a - 11),
              feedback: "Counting back in tens takes away 10 each time, not 1.",
            },
            {
              code: "NPV.PLACE.TENS-ONES-MIXUP",
              value: A.number(a - 10 - 1),
              feedback: "Only the tens digit changes when you count in tens.",
            },
          ].filter((w, i, all) => all.findIndex((x) => x.value.value === w.value.value) === i),
          solution: [
            {
              say: `Take away 10 each time: ${a}, ${a - 10}, ${a - 20}, ${a - 30}. Only the tens digit changes.`,
            },
          ],
        });
      }
      case 3: {
        const others = ([2, 3, 5] as const).filter((s) => s !== p.step);
        return A.chooseTheDiagram({
          rng,
          question: `Which number line shows counting in ${p.step}s from 0?`,
          ask: "Choose the number line.",
          correct: jumps(p.step),
          distractors: others.map((s) => ({
            figure: jumps(s),
            feedback: `Those jumps are ${s}s.`,
          })),
          solution: [{ say: `Jumps of ${p.step}: 0, ${p.step}, ${2 * p.step}, ${3 * p.step}, …` }],
        });
      }
      default: {
        const claims = [
          {
            statement: "If you count in 5s from 0, you will say 32.",
            truth: false,
            reasons: [
              { text: "Counting in 5s from 0 only says numbers ending in 0 or 5.", correct: true },
              {
                text: "Every number is said eventually if you keep counting.",
                code: "NPV.SEQUENCE.STEP-ONE",
              },
              { text: "Only if you count past 30." },
            ],
          },
          {
            statement: "If you count in 2s from 0, every number you say is even.",
            truth: true,
            reasons: [
              {
                text: "Starting at 0 and adding 2 each time always gives even numbers.",
                correct: true,
              },
              {
                text: "Counting in 2s says every number, odd and even.",
                code: "NPV.SEQUENCE.STEP-ONE",
              },
              { text: "Only the first few are even." },
            ],
          },
          {
            statement: `Counting back in tens from ${p.start}, the ones digit stays ${p.start % 10}.`,
            truth: true,
            reasons: [
              { text: "Taking away 10 changes only the tens digit.", correct: true },
              {
                text: "The ones digit goes down by one each time.",
                code: "NPV.PLACE.TENS-ONES-MIXUP",
              },
              { text: "Both digits change each time." },
            ],
          },
        ];
        const c = claims[p.claim] ?? claims[0];
        return A.trueOrFalseWhy({
          rng,
          statement: c?.statement ?? "",
          truth: c?.truth ?? true,
          reasons: c?.reasons ?? [],
          solution: [{ say: c?.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.k * p.step;
    if (question.archetype === "missing-value") return numberAnswer(question) === p.start - 20;
    if (question.archetype === "choose-the-diagram")
      return ((chosenFigure(question) as NumberLineSpec | undefined)?.jumps ?? []).every(
        (j) => j.to - j.from === p.step,
      );
    return true;
  },
});
