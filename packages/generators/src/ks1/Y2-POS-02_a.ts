/**
 * @statement Y2-POS-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-POS-02.a: Describe straight-line movement
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  start: number;
  move: number;
  right: boolean;
  /** Depth 2: forward then back. */
  forward: number;
  back: number;
}

export default defineGenerator<Params>({
  id: "Y2-POS-02.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["POS.TRANSLATE.DIRECTION"],

  params(rng, numbers) {
    const p = {
      start: rng.int(4, 12),
      move: rng.int(2, numbers === "friendly" ? 3 : 6),
      right: rng.bool(),
      forward: rng.int(4, 9),
      back: rng.int(1, 3),
    };
    if (p.start - p.move < 1 || p.start + p.move > 20) reject("stay on the track");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const end = p.right ? p.start + p.move : p.start - p.move;
        const side = p.right ? "right" : "left";
        return A.standard({
          question: `A track has squares numbered 1 to 20 from left to right. A counter is on square ${p.start}. It moves ${p.move} squares to the ${side}.`,
          ask: "Which square is it on now?",
          answer: A.number(end),
          wrong: wrongs(end, [
            {
              code: "POS.TRANSLATE.DIRECTION",
              value: A.number(p.right ? p.start - p.move : p.start + p.move),
              feedback: `The numbers go up to the right. Moving ${side} makes the number ${p.right ? "bigger" : "smaller"}.`,
            },
          ]),
          solution: [{ say: `${p.start} ${p.right ? "+" : "−"} ${p.move} = ${end}.` }],
        });
      }
      case 2: {
        const end = p.forward - p.back;
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A robot moves ${p.forward} steps forward in a straight line, then ${p.back} steps back.`,
              ask: "How many steps is it from where it started?",
            },
            {
              question: `A toy car rolls ${p.forward} metres forward, then ${p.back} metres back along the same line.`,
              ask: "How many metres is it from where it started?",
            },
          ],
          answer: A.number(end),
          wrong: wrongs(end, [
            {
              code: "POS.TRANSLATE.DIRECTION",
              value: A.number(p.forward + p.back),
              feedback: "Moving back goes the opposite way, so it takes away from the distance.",
            },
          ]),
          solution: [{ say: `${p.forward} − ${p.back} = ${end}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Lily moves a counter ${p.move} squares left, then ${p.move} squares right. She says it is back where it started.`,
          truth: true,
          reasons: [
            {
              text: "True. Left and right are opposite directions, so the two moves cancel out.",
              correct: true,
            },
            {
              text: `False. It has moved ${2 * p.move} squares from the start.`,
              code: "POS.TRANSLATE.DIRECTION",
            },
            { text: "False. It depends which square it started on." },
          ],
          solution: [{ say: `${p.move} left then ${p.move} right ends on the starting square.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === (p.right ? p.start + p.move : p.start - p.move);
    if (question.key.depth === 2) return numberAnswer(question) === p.forward - p.back;
    return true;
  },
});
