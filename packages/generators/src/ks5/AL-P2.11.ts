/**
 * @statement AL-P2.11
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.11: Use functions in modelling, including consideration of limitations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** h(t) = h0 + ut − 5t². */
  h0: number;
  u: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;
const landing = (p: Params) => (p.u + Math.sqrt(p.u * p.u + 20 * p.h0)) / 10;
const other = (p: Params) => (p.u - Math.sqrt(p.u * p.u + 20 * p.h0)) / 10;

export default defineGenerator<Params>({
  id: "AL-P2.11",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.TURNING", "ALG.MODEL.LIMITATION"],

  params(rng) {
    return { h0: rng.int(1, 30), u: 10 * rng.int(1, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    const model = A.math(`h = ${p.h0} + ${p.u}t - 5t^2`);
    const intro = [
      "A ball is thrown upwards. Its height, h metres, after t seconds is modelled by ",
      model,
      ".",
    ];
    switch (depth) {
      case 1: {
        const top = p.h0 + (p.u * p.u) / 20;
        return A.standard({
          question: intro,
          ask: "Work out the greatest height of the ball.",
          answer: A.number(top, { units: "m" }),
          wrong: [
            {
              code: "ALG.QUADRATIC.TURNING",
              value: A.number(p.u / 10, { units: "m" }),
              feedback: "That is the time of the highest point; substitute it to find the height.",
            },
          ],
          solution: [
            { say: "Complete the square: ", math: `h = ${top} - 5(t - ${p.u / 10})^2` },
            { say: `The greatest height is ${top} m, when t = ${p.u / 10}.` },
          ],
        });
      }
      case 2: {
        const t = r2(landing(p));
        return A.variedForm({
          rng,
          forms: [
            {
              question: intro,
              ask: "Find the time when the ball hits the ground. Give your answer to 2 decimal places.",
            },
            {
              question: intro,
              ask: "When does the model say the ball lands? Give your answer to 2 decimal places.",
            },
          ],
          answer: A.number(t, { units: "s", accuracy: { dp: 2 } }),
          wrong: [
            {
              code: "ALG.MODEL.LIMITATION",
              value: A.number(r2(other(p)), { units: "s", accuracy: { dp: 2 } }),
              feedback: "Time cannot be negative here: take the positive solution.",
            },
          ],
          solution: [
            { say: "Solve ", math: `${p.h0} + ${p.u}t - 5t^2 = 0` },
            {
              say: `t = ${t} or t = ${r2(other(p))}; the negative value is before the throw, so t = ${t} s.`,
            },
          ],
        });
      }
      default: {
        const late = Math.ceil(landing(p)) + 2;
        const h = p.h0 + p.u * late - 5 * late * late;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            ...intro,
            ` Sam uses the model to say the ball's height after ${late} seconds is ${h} m.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The ball lands at about t = ${r2(landing(p))}; after that the model no longer applies, and a negative height makes no sense.`,
              correct: true,
            },
            { text: "True. The model works for any value of t.", code: "ALG.MODEL.LIMITATION" },
            { text: "True. The ball is below its starting point.", code: "ALG.MODEL.LIMITATION" },
          ],
          solution: [
            {
              say: "A model is only valid for the values it describes: here from the throw until the ball lands.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.h0 + (p.u * p.u) / 20;
    return true;
  },
});
