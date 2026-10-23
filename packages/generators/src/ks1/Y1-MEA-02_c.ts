/**
 * @statement Y1-MEA-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-02.c: Measure capacity
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { ScaleSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";

interface Params {
  reading: number;
  more: number;
  other: number;
}

// A jug marked in cups: numbered every 2 with a mark for each cup.
const jug = (reading: number): ScaleSpec => ({
  type: "measure",
  instrument: "jug",
  max: 10,
  step: 2,
  divisions: 2,
  reading,
  unit: "\\text{cups}",
});

export default defineGenerator<Params>({
  id: "Y1-MEA-02.c",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["MEA.SCALE.INTERVAL", "AS.PROBLEM.KEYWORD"],

  params(rng) {
    const p = { reading: rng.int(1, 7), more: rng.int(1, 3), other: rng.int(1, 9) };
    if (p.reading % 2 === 0 || p.other === p.reading + p.more)
      reject("an unnumbered reading, different jugs");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Water is poured into a jug.", A.figure(jug(p.reading))],
          ask: "How many cups of water are in the jug?",
          answer: A.number(p.reading, { units: "cups" }),
          wrong: wrongs(p.reading, [
            {
              code: "MEA.SCALE.INTERVAL",
              value: A.number(p.reading + 1, { units: "cups" }),
              feedback:
                "The numbers go up in 2s, so the mark between two numbers is the cup in between.",
            },
          ]),
          solution: [
            {
              say: `The water is at the mark between ${p.reading - 1} and ${p.reading + 1}: ${p.reading} cups.`,
            },
          ],
        });
      case 2: {
        const now = p.reading + p.more;
        return A.standard({
          question: [
            "Look at the jug.",
            A.figure(jug(p.reading)),
            `Tia pours in ${p.more} more cup${p.more > 1 ? "s" : ""} of water.`,
          ],
          ask: "How many cups of water are in the jug now?",
          answer: A.number(now, { units: "cups" }),
          wrong: wrongs(now, [
            {
              code: "AS.PROBLEM.KEYWORD",
              value: A.number(p.reading - p.more, { units: "cups" }),
              feedback: "Pouring in adds water.",
            },
          ]),
          solution: [{ say: `${p.reading} + ${p.more} = ${now} cups.` }],
        });
      }
      default:
        return A.chooseTheDiagram({
          rng,
          question: [`Which jug has ${p.reading + p.more} cups of water?`],
          correct: jug(p.reading + p.more),
          distractors: [
            { figure: jug(p.other), feedback: `Read the scale: that jug has ${p.other} cups.` },
            ...(p.reading + p.more + 1 !== p.other && p.reading + p.more + 1 <= 10
              ? [
                  {
                    figure: jug(p.reading + p.more + 1),
                    code: "MEA.SCALE.INTERVAL",
                    feedback: "Count each mark as one cup, starting from 0.",
                  },
                ]
              : []),
          ],
          solution: [{ say: `Find ${p.reading + p.more} on the scale: each mark is 1 cup.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.reading;
    if (question.key.depth === 2) return numberAnswer(question) === p.reading + p.more;
    return (chosenFigure(question) as ScaleSpec | undefined)?.reading === p.reading + p.more;
  },
});
