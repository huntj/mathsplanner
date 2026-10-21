/**
 * @statement Y6-RAT-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-RAT-03: Solve problems involving similar shapes where the scale factor is known or can be found
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** A w × h rectangle enlarged by k. */
  w: number;
  h: number;
  k: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y6-RAT-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ADDITIVE"],

  params(rng, numbers) {
    const w = rng.int(2, numbers === "friendly" ? 6 : 12);
    const h = rng.int(2, numbers === "friendly" ? 6 : 12);
    const k = rng.int(2, numbers === "stretch" ? 6 : 4);
    if (w === h) reject("a rectangle that is not a square");
    return { w, h, k, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [W, H] = [p.w * p.k, p.h * p.k];
    const added = p.h + (W - p.w);
    const how = `${W} ÷ ${p.w} = ${p.k}, so the scale factor is ${p.k}. Every length is multiplied by ${p.k}: ${p.h} × ${p.k} = ${H} cm.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: `A rectangle is ${p.w} cm long and ${p.h} cm wide. It is enlarged by a scale factor of ${p.k}.`,
          ask: "How wide is the new rectangle, in centimetres?",
          answer: A.number(H),
          wrong: wrongs(H, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(p.h + p.k),
              feedback: `A scale factor of ${p.k} multiplies every length by ${p.k}.`,
            },
          ]),
          solution: [{ say: `Multiply by the scale factor: ${p.h} × ${p.k} = ${H} cm.` }],
        });
      case 2:
        return A.reverse({
          question: `A rectangle ${p.w} cm long and ${p.h} cm wide is enlarged. The new rectangle is ${W} cm long.`,
          ask: "How wide is the new rectangle, in centimetres?",
          answer: A.number(H),
          wrong: wrongs(H, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(added),
              feedback: `The length went from ${p.w} to ${W}: that is × ${p.k}, not + ${W - p.w}.`,
            },
          ]),
          solution: [{ say: how }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A rectangle ${p.w} cm by ${p.h} cm is enlarged so that its length is ${W} cm. Mia says the new width is ${p.claimTrue ? H : added} cm.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: `True. ${how}`, correct: true },
                {
                  text: `False. The length grew by ${W - p.w} cm, so the width grows by ${W - p.w} cm too.`,
                  code: "RAT.ADDITIVE",
                },
                { text: "False. Only the length changes in an enlargement." },
              ]
            : [
                { text: `False. ${how}`, correct: true },
                {
                  text: `True. The length grew by ${W - p.w} cm, so the width grows by ${W - p.w} cm too.`,
                  code: "RAT.ADDITIVE",
                },
                { text: "True. Both sides get bigger, so it must be right." },
              ],
          solution: [{ say: how }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "true-or-false-why") return true;
    return numberAnswer(question) === p.h * p.k;
  },
});
