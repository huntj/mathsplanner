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
import { orClaims } from "../shared/variety.ts";

interface Params {
  /** A w × h rectangle enlarged by k. */
  w: number;
  h: number;
  k: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y6-RAT-03",
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
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
            }),
          [
            {
              statement:
                "A 2 cm by 5 cm rectangle is enlarged with scale factor 3. Ola says the new rectangle is 6 cm by 15 cm.",
              truth: true,
              right: "True. Both sides are multiplied by 3.",
              wrong: [
                ["False. It is 5 cm by 8 cm, adding 3.", "RAT.ADDITIVE"],
                ["False. Only one side changes."],
              ],
            },
            {
              claim: "Two similar shapes have the same angles.",
              truth: "always",
              right: "Always. Enlarging a shape changes its lengths, not its angles.",
              wrong: [
                ["Sometimes. Only if they are the same size."],
                ["Never. A bigger shape has bigger angles.", "RAT.ADDITIVE"],
              ],
            },
            {
              statement:
                "A triangle with sides 3, 4 and 5 cm is enlarged so the 3 cm side is 6 cm. Dev says the 5 cm side becomes 8 cm.",
              truth: false,
              right: "False. The scale factor is 6 ÷ 3 = 2, so 5 cm becomes 10 cm.",
              wrong: [
                ["True. Add 3, as 3 + 3 = 6.", "RAT.ADDITIVE"],
                ["True. Sides grow by the same amount."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 4) return true;
    return numberAnswer(question) === p.h * p.k;
  },
});
