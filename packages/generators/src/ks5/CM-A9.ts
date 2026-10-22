/**
 * @statement CM-A9
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-A9: Calculate and interpret a least squares regression line
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  xbar: number;
  ybar: number;
  b: number;
}

const intercept = (p: Params) => round(p.ybar - p.b * p.xbar, 2);

export default defineGenerator<Params>({
  id: "CM-A9",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C", "STA.REGRESSION.VARIABLES"],

  params(rng) {
    return {
      xbar: round(rng.int(20, 120) / 10, 1),
      ybar: rng.int(30, 80),
      b: round(rng.int(12, 60) / 10, 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = intercept(p);
        return A.standard({
          question: [
            `For data on hours of revision (x) and test score (y), x̄ = ${p.xbar}, ȳ = ${p.ybar}, and the regression line y = a + bx has b = ${p.b}.`,
          ],
          ask: "Find a, to 2 decimal places.",
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: signedWrongs(v, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(round(p.ybar + p.b * p.xbar, 2), { accuracy: { dp: 2 } }),
              feedback: "The line passes through (x̄, ȳ): a = ȳ − bx̄.",
            },
          ]),
          solution: [{ say: "", math: `a = ${p.ybar} - ${p.b} \\times ${p.xbar} = ${v}` }],
        });
      }
      case 2: {
        const right = `Each extra hour of revision is linked to about ${p.b} more marks.`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The regression line of test score y on hours of revision x is ",
            A.math(`y = ${intercept(p)} + ${p.b}x`),
            ".",
          ],
          ask: `What does the ${p.b} mean in context?`,
          correct: right,
          distractors: [
            {
              content: `A student who does no revision scores ${p.b}.`,
              code: "ALG.LINE.M-C",
              feedback: "That describes the intercept a, not the gradient.",
            },
            {
              content: `Revising for ${p.b} hours guarantees a pass.`,
              code: "STA.REGRESSION.VARIABLES",
              feedback: "The gradient is the rate of change of y per unit of x.",
            },
          ],
          solution: [{ say: "The gradient b is the change in y for each increase of 1 in x." }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Lou says the regression line of test score on revision time can be rearranged to predict how long a student revised from their score.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The line of y on x minimises errors in y. To predict x from y, use the regression line of x on y, which is usually different.",
              correct: true,
            },
            {
              text: "True. A line can be rearranged either way.",
              code: "STA.REGRESSION.VARIABLES",
            },
            { text: "True. Both variables play the same part.", code: "STA.REGRESSION.VARIABLES" },
          ],
          solution: [
            { say: "The two regression lines only coincide when the correlation is perfect." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === intercept(p);
    if (question.key.depth === 2) return chosenText(question).startsWith("Each extra hour");
    return true;
  },
});
