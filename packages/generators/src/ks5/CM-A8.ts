/**
 * @statement CM-A8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-A8: Draw lines of best fit and make predictions; use and interpret the PMCC and its limitations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  m: number;
  c: number;
  x: number;
  r: number;
}

const describe = (r: number) =>
  `${Math.abs(r) >= 0.7 ? "strong" : "weak"} ${r > 0 ? "positive" : "negative"} linear correlation`;

export default defineGenerator<Params>({
  id: "CM-A8",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C", "STA.PMCC.INTERPRET"],

  params(rng) {
    const r = rng.pick([-0.92, -0.85, -0.78, -0.35, -0.2, 0.25, 0.4, 0.81, 0.88, 0.95]);
    return { m: round(rng.int(5, 40) / 10, 1), c: rng.int(5, 40), x: rng.int(3, 20), r };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = round(p.c + p.m * p.x, 1);
        return A.standard({
          question: [
            "A line of best fit for the weight y (grams) of a seedling after x days is ",
            A.math(`y = ${p.m}x + ${p.c}`),
            ".",
          ],
          ask: `Predict the weight after ${p.x} days.`,
          answer: A.number(v, { units: "g", accuracy: { dp: 1 } }),
          wrong: signedWrongs(v, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(round(p.m * p.x, 1), { units: "g", accuracy: { dp: 1 } }),
              feedback: `Add the intercept ${p.c} as well: y = ${p.m} × ${p.x} + ${p.c}.`,
            },
          ]),
          solution: [{ say: "", math: `y = ${p.m} \\times ${p.x} + ${p.c} = ${v}` }],
        });
      }
      case 2: {
        const right = describe(p.r);
        const flipStrength = `${Math.abs(p.r) >= 0.7 ? "weak" : "strong"} ${p.r > 0 ? "positive" : "negative"} linear correlation`;
        const flipSign = `${Math.abs(p.r) >= 0.7 ? "strong" : "weak"} ${p.r > 0 ? "negative" : "positive"} linear correlation`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`The product moment correlation coefficient for some data is ${p.r}.`],
          ask: "What does this show?",
          correct: right,
          distractors: [
            {
              content: flipStrength,
              code: "STA.PMCC.INTERPRET",
              feedback: "Values near ±1 are strong; values near 0 are weak.",
            },
            {
              content: flipSign,
              code: "STA.PMCC.INTERPRET",
              feedback: "The sign of r gives the direction of the correlation.",
            },
          ],
          solution: [{ say: `r = ${p.r}: ${right}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kit says a PMCC of 0.95 means that 95% of the points lie on the line of best fit.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. r measures how close the points are to a straight line overall. It is not a percentage of points; perhaps none lie exactly on the line.",
              correct: true,
            },
            {
              text: "True. r is the proportion of points on the line.",
              code: "STA.PMCC.INTERPRET",
            },
            {
              text: "True. Multiply r by 100 to get the percentage on the line.",
              code: "STA.PMCC.INTERPRET",
            },
          ],
          solution: [{ say: "r = 0.95 shows strong positive linear correlation." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === round(p.c + p.m * p.x, 1);
    if (question.key.depth === 2) return chosenText(question) === describe(p.r);
    return true;
  },
});
