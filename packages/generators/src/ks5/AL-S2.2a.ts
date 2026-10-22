/**
 * @statement AL-S2.2a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S2.2a: Interpret scatter diagrams and regression lines; explanatory and response variables;
// correlation versus causation; interpolation and extrapolation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const CONTEXTS = [
  { x: "hours of revision", y: "test score", xs: "hours", lo: 2, hi: 12 },
  { x: "daily temperature (°C)", y: "number of ice creams sold", xs: "°C", lo: 12, hi: 28 },
  { x: "amount of fertiliser (g)", y: "plant height (cm)", xs: "g", lo: 5, hi: 40 },
] as const;

interface Params {
  c: number;
  a: number;
  b: number;
  x: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "AL-S2.2a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.REGRESSION.VARIABLES", "STA.EXTRAPOLATE"],

  params(rng) {
    const c = rng.int(0, CONTEXTS.length - 1);
    const ctx = CONTEXTS[c] ?? (CONTEXTS[0] as (typeof CONTEXTS)[number]);
    return {
      c,
      a: rng.int(5, 30),
      b: rng.pick([1.5, 2.5, 3.2, 4.1]),
      x: rng.int(ctx.lo + 1, ctx.hi - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const ctx = CONTEXTS[p.c] ?? (CONTEXTS[0] as (typeof CONTEXTS)[number]);
    const line = A.math(`y = ${p.a} + ${p.b}x`);
    const intro = [
      `Data were collected on x, the ${ctx.x}, and y, the ${ctx.y}, for x from ${ctx.lo} to ${ctx.hi}. The regression line of y on x is `,
      line,
      ".",
    ];
    switch (depth) {
      case 1: {
        const y = r1(p.a + p.b * p.x);
        return A.standard({
          question: intro,
          ask: `Estimate y when x = ${p.x}.`,
          answer: A.number(y, { accuracy: { dp: 1 } }),
          wrong: wrongs(y, [
            {
              code: "STA.REGRESSION.VARIABLES",
              value: A.number(r1(p.b + p.a * p.x), { accuracy: { dp: 1 } }),
              feedback: `In y = a + bx, the gradient b = ${p.b} multiplies x.`,
            },
          ]),
          solution: [{ say: `${p.a} + ${p.b} × ${p.x} = ${y}.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: intro,
          ask: "Which is the explanatory variable?",
          correct: `The ${ctx.x}`,
          distractors: [
            {
              content: `The ${ctx.y}`,
              code: "STA.REGRESSION.VARIABLES",
              feedback: `The ${ctx.y} responds to the ${ctx.x}, not the other way round.`,
            },
            {
              content: "Neither: both are response variables.",
              code: "STA.REGRESSION.VARIABLES",
              feedback:
                "The explanatory variable is the one that is set or changed independently, plotted on the x-axis.",
            },
          ],
          solution: [
            {
              say: `The ${ctx.x} explains changes in the ${ctx.y}, so it is the explanatory variable.`,
            },
          ],
        });
      default: {
        const far = ctx.hi * 3;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            ...intro,
            ` Dee uses the line to predict y when x = ${far}, and says the prediction is reliable.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. x = ${far} is far outside the data (${ctx.lo} to ${ctx.hi}); extrapolation assumes the pattern continues, which may not be true.`,
              correct: true,
            },
            { text: "True. The regression line works for any x.", code: "STA.EXTRAPOLATE" },
            {
              text: "True. The line has a positive gradient, so larger x always gives larger y.",
              code: "STA.EXTRAPOLATE",
            },
          ],
          solution: [
            { say: "Interpolation (inside the data range) is more reliable than extrapolation." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === r1(p.a + p.b * p.x);
    if (question.key.depth === 2)
      return (
        chosenText(question).startsWith("The ") &&
        !chosenText(question).includes((CONTEXTS[p.c] ?? CONTEXTS[0]).y)
      );
    return true;
  },
});
