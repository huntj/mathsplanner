/**
 * @statement Y1-NPV-04.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-04.a: Represent numbers using objects and pictures
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CountersSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer, tenFrames } from "../shared/counting.ts";

interface Params {
  n: number;
  m: number;
}

const total = (spec: unknown) =>
  ((spec as CountersSpec & { frames?: number[] })?.frames ?? []).reduce((s, x) => s + x, 0);

export default defineGenerator<Params>({
  id: "Y1-NPV-04.a",
  version: "1.0.0",
  depths: [1, 3, 4],
  misconceptions: ["NPV.TEENS.REVERSAL", "NPV.COUNT.SKIP-OR-DOUBLE"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 15 : numbers === "standard" ? 19 : 30;
    const p = { n: rng.int(12, top), m: rng.int(12, 19) };
    if (p.n % 10 === 0 || p.n % 11 === 0 || p.m === 20)
      reject("numbers whose digits can be swapped");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const tens = Math.floor(p.n / 10);
    const ones = p.n % 10;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Look at the ten frames.", A.figure(tenFrames(p.n, { hidden: true }))],
          ask: "How many counters are there?",
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "NPV.TEENS.REVERSAL",
              value: A.number(ones * 10 + tens),
              feedback: `There ${tens === 1 ? "is 1 full ten frame" : `are ${tens} full ten frames`} and ${ones} more: ${tens} ten${tens > 1 ? "s" : ""} and ${ones} ones is ${p.n}.`,
            },
            {
              code: "NPV.COUNT.SKIP-OR-DOUBLE",
              value: A.number(p.n + 1),
              feedback:
                "A full ten frame is 10. Count on the counters in the last frame once each.",
            },
          ]),
          solution: [{ say: `${tens * 10} in the full frames and ${ones} more make ${p.n}.` }],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which picture shows ${p.m}?`],
          correct: tenFrames(p.m),
          distractors: [
            {
              figure: tenFrames(p.m + 1),
              code: "NPV.COUNT.SKIP-OR-DOUBLE",
              feedback: `Count again: that picture shows ${p.m + 1}.`,
            },
            ...(p.m % 10 > 1
              ? [
                  {
                    figure: tenFrames(10 + Math.floor(p.m / 10)),
                    code: "NPV.TEENS.REVERSAL",
                    feedback: `That shows ${10 + Math.floor(p.m / 10)}. ${p.m} is 1 ten and ${p.m % 10} ones.`,
                  },
                ]
              : [
                  {
                    figure: tenFrames(p.m - 1),
                    feedback: `Count again: that picture shows ${p.m - 1}.`,
                  },
                ]),
          ],
          solution: [{ say: `${p.m} is one full ten frame and ${p.m - 10} more.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Mo shows ${p.n} with ${ones} full ten frame${ones > 1 ? "s" : ""} and ${tens} more counter${tens > 1 ? "s" : ""}.`,
          truth: false,
          reasons: [
            {
              text: `False. That shows ${ones * 10 + tens}. ${p.n} needs ${tens} full ten frame${tens > 1 ? "s" : ""} and ${ones} more counters.`,
              correct: true,
            },
            {
              text: `True. The digits of ${p.n} are ${tens} and ${ones}.`,
              code: "NPV.TEENS.REVERSAL",
            },
            {
              text: "True. It does not matter which digit tells you the full frames.",
              code: "NPV.TEENS.REVERSAL",
            },
          ],
          solution: [
            {
              say: `The tens digit tells you the full ten frames: ${tens}. The ones digit tells you the extra counters: ${ones}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n;
    if (question.key.depth === 3) return total(chosenFigure(question)) === p.m;
    return true;
  },
});
