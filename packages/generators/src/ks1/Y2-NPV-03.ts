/**
 * @statement Y2-NPV-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-NPV-03: Identify, represent and estimate numbers using different representations, including the
// number line
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { NumberLineSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
}

const line = (value: number, ticks: boolean, max = 100): NumberLineSpec => ({
  type: "number-line",
  min: 0,
  max,
  step: ticks ? 10 : max,
  ...(ticks ? { minor: 2 } : {}),
  points: [{ value, style: "arrow" }],
  description: ticks
    ? "A number line from 0 to 100, marked in tens, with an arrow at a number."
    : "A number line from 0 to 100 with no marks between the ends, and an arrow at a number.",
});

const pointOf = (spec: unknown) => (spec as NumberLineSpec | undefined)?.points?.[0]?.value;

export default defineGenerator<Params>({
  id: "Y2-NPV-03",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["NPV.NUMBERLINE.COUNT-TICKS"],

  params(rng, numbers) {
    const n = numbers === "friendly" ? rng.int(1, 9) * 10 : rng.int(1, 49) * 2;
    if (n % 10 === 0 && numbers !== "friendly") reject("labelled tens are too easy");
    return { n };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Look at the number line. Each small mark is 2.", A.figure(line(p.n, true))],
          ask: "What number is the arrow pointing to?",
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "NPV.NUMBERLINE.COUNT-TICKS",
              value: A.number(Math.floor(p.n / 10) * 10 + (p.n % 10) / 2),
              feedback: "Each small mark is worth 2, not 1. Count on in 2s from the last ten.",
            },
          ]),
          solution: [
            {
              say: `Start at ${Math.floor(p.n / 10) * 10} and count on in 2s: the arrow points to ${p.n}.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: ["This number line goes from 0 to 100.", A.figure(line(p.n, false))],
          ask: "Estimate the number the arrow is pointing to.",
          answer: A.number(p.n, { accuracy: { tolerance: 6 } }),
          solution: [
            {
              say: `Halfway is 50; use that and the ends to judge. The arrow is at ${p.n}; any answer close to it is a good estimate.`,
            },
          ],
        });
      default: {
        const others = [p.n + 10, p.n - 10, 100 - p.n]
          .filter((m) => m > 0 && m < 100 && m !== p.n)
          .slice(0, 2);
        return A.chooseTheDiagram({
          rng,
          question: ["Which number line shows ", A.math(String(p.n)), "?"],
          ask: "Choose the number line.",
          correct: line(p.n, true),
          distractors: others.map((m) => ({
            figure: line(m, true),
            feedback: `That arrow points to ${m}.`,
          })),
          solution: [
            {
              say: `${p.n} is ${Math.floor(p.n / 10)} tens and ${p.n % 10} more: find the ${Math.floor(p.n / 10) * 10} mark and count on.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "choose-the-diagram") return pointOf(chosenFigure(question)) === p.n;
    return numberAnswer(question) === pointOf(question.diagrams[0]);
  },
});
