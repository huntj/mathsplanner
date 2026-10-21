/**
 * @statement Y1-MEA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-MEA-02: Measure and begin to record lengths, heights, mass, capacity and time
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { RulerSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { chosenFigure, numberAnswer } from "../shared/counting.ts";
import { ruler } from "../shared/mea.ts";

interface Params {
  start: number;
  length: number;
}

const L = 12;

export default defineGenerator<Params>({
  id: "Y1-MEA-02",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.RULER.END"],

  params(rng, numbers) {
    const length = rng.int(2, numbers === "friendly" ? 6 : 10);
    const start = rng.int(1, numbers === "friendly" ? 2 : 4);
    if (start + length >= L) reject("an object that fits on the ruler");
    return { start, length };
  },

  build(p, depth, rng): QuestionDraft {
    const end = p.start + p.length;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["A crayon lies along a ruler.", A.figure(ruler(L, 0, p.length, false))],
          ask: "How long is the crayon?",
          answer: A.number(p.length, { units: "cm" }),
          solution: [
            {
              say: `The crayon starts at 0 and ends at ${p.length}, so it is ${p.length} cm long.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: [
            "A crayon lies along a ruler. It does not start at 0.",
            A.figure(ruler(L, p.start, end, false)),
          ],
          ask: "How long is the crayon?",
          answer: A.number(p.length, { units: "cm" }),
          wrong: wrongs(p.length, [
            {
              code: "MEA.RULER.END",
              value: A.number(end, { units: "cm" }),
              feedback: `The crayon starts at ${p.start}, not 0. Count the centimetres from ${p.start} to ${end}.`,
            },
          ]),
          solution: [
            { say: `It goes from ${p.start} to ${end}: ${end} − ${p.start} = ${p.length} cm.` },
          ],
        });
      case 3:
        return A.chooseTheDiagram({
          rng,
          question: [`Which picture shows a crayon that is ${p.length} cm long?`],
          correct: ruler(L, p.start, end, false),
          distractors: [
            {
              figure: ruler(L, p.start, p.length, false),
              code: "MEA.RULER.END",
              feedback: `That crayon ends at ${p.length} but starts at ${p.start}, so it is only ${p.length - p.start} cm long.`,
            },
            {
              figure: ruler(L, p.start, end + 1, false),
              feedback: `Count the centimetres: that crayon is ${p.length + 1} cm long.`,
            },
          ].filter((d) => (d.figure.object?.to ?? 0) > (d.figure.object?.from ?? 0)),
          solution: [{ say: `The crayon from ${p.start} to ${end} is ${p.length} cm long.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "A crayon lies along a ruler.",
            A.figure(ruler(L, p.start, end, false)),
            `Tom says the crayon is ${end} cm long.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The crayon starts at ${p.start}, so it is ${end} − ${p.start} = ${p.length} cm long.`,
              correct: true,
            },
            { text: `True. The crayon ends at ${end}.`, code: "MEA.RULER.END" },
            {
              text: "True. You always read the number at the end of the crayon.",
              code: "MEA.RULER.END",
            },
          ],
          solution: [{ say: "Measure from one end of the crayon to the other, not from 0." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.length;
    if (question.archetype === "choose-the-diagram") {
      const o = (chosenFigure(question) as RulerSpec | undefined)?.object;
      return o !== undefined && o.to - o.from === p.length;
    }
    return true;
  },
});
