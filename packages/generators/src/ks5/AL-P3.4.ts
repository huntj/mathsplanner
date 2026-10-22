/**
 * @statement AL-P3.4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P3.4: Use parametric equations in modelling
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** x = ut, y = vt − 5t² metres. */
  u: number;
  v: number;
}

export default defineGenerator<Params>({
  id: "AL-P3.4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.TURNING", "ALG.MODEL.LIMITATION"],

  params(rng) {
    return { u: rng.int(4, 20), v: 5 * rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = [
      "A ball is kicked from the ground. Its position after t seconds is modelled by ",
      A.math(`x = ${p.u}t`),
      ", ",
      A.math(`y = ${p.v}t - 5t^2`),
      ", where x and y are in metres.",
    ];
    const land = p.v / 5;
    switch (depth) {
      case 1:
        return A.standard({
          question: intro,
          ask: "Find the time when the ball lands.",
          answer: A.number(land, { units: "s" }),
          wrong: wrongs(land, [
            {
              code: "ALG.QUADRATIC.TURNING",
              value: A.number(land / 2, { units: "s" }),
              feedback: "That is when the ball is highest. It lands when y = 0 again.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.v}t - 5t^2 = 0 \\Rightarrow t(${p.v} - 5t) = 0 \\Rightarrow t = ${land}`,
            },
          ],
        });
      case 2: {
        const range = p.u * land;
        return A.variedForm({
          rng,
          forms: [
            { question: intro, ask: "How far does the ball travel horizontally before it lands?" },
            {
              question: intro,
              ask: "Find the horizontal distance from the kick to where the ball lands.",
            },
          ],
          answer: A.number(range, { units: "m" }),
          wrong: wrongs(range, [
            {
              code: "ALG.QUADRATIC.TURNING",
              value: A.number(range / 2, { units: "m" }),
              feedback: "Use the landing time, not the time of the highest point.",
            },
          ]),
          solution: [{ say: `It lands at t = ${land}, when x = ${p.u} × ${land} = ${range} m.` }],
        });
      }
      default: {
        const late = land + 2;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            ...intro,
            ` Mo says the model gives the ball's position correctly when t = ${late}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The ball lands at t = ${land}; after that y would be negative, which is underground, so the model no longer applies.`,
              correct: true,
            },
            {
              text: "True. The equations work for every value of t.",
              code: "ALG.MODEL.LIMITATION",
            },
            { text: "True. The ball keeps moving forwards.", code: "ALG.MODEL.LIMITATION" },
          ],
          solution: [{ say: `The model is valid for 0 ≤ t ≤ ${land}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.v / 5;
    return true;
  },
});
