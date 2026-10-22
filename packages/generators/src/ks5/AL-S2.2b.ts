/**
 * @statement AL-S2.2b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S2.2b: Interpret a given product moment correlation coefficient; use logarithmic changes of
// variable for non-linear models
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  r: number;
  c: number;
  n: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-S2.2b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.PMCC.INTERPRET", "STA.SCATTER.CAUSATION", "ALG.LOG.GRAPH"],

  params(rng) {
    return {
      r: rng.pick([0.92, 0.87, -0.91, -0.85, 0.95]),
      c: rng.pick([0.3, 0.48, 0.6, 0.7]),
      n: rng.pick([1.5, 2, 2.5, 3]),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const kind = p.r > 0 ? "positive" : "negative";
        return A.choice({
          rng,
          question: `For data on hours of sunshine and ice cream sales, the product moment correlation coefficient is ${p.r}.`,
          ask: "Which is the best interpretation?",
          correct: `There is strong ${kind} linear correlation between the variables.`,
          distractors: [
            {
              content: `The gradient of the regression line is ${p.r}.`,
              code: "STA.PMCC.INTERPRET",
              feedback:
                "The PMCC measures how close the points are to a straight line, not the gradient.",
            },
            {
              content: "More sunshine causes more ice cream sales.",
              code: "STA.SCATTER.CAUSATION",
              feedback: "Correlation alone cannot show cause.",
            },
            {
              content: `There is weak ${kind} correlation.`,
              code: "STA.PMCC.INTERPRET",
              feedback: "Values close to ±1 show strong correlation.",
            },
          ],
          solution: [
            { say: `|r| is close to 1, and r is ${kind}: strong ${kind} linear correlation.` },
          ],
        });
      }
      case 2: {
        const a = r2(10 ** p.c);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The model ",
                A.math("y = ax^n"),
                " is fitted by finding the regression line of ",
                A.math("\\log y"),
                " on ",
                A.math("\\log x"),
                ": ",
                A.math(`\\log y = ${p.c} + ${p.n}\\log x`),
                ".",
              ],
              ask: "Find a, to 2 decimal places.",
            },
          ],
          answer: A.number(a, { accuracy: { dp: 2 } }),
          wrong: wrongs(a, [
            {
              code: "ALG.LOG.GRAPH",
              value: A.number(p.c, { accuracy: { dp: 2 } }),
              feedback: `The intercept is log a, so a = 10^${p.c}.`,
            },
          ]),
          solution: [{ say: "", math: `\\log a = ${p.c} \\Rightarrow a = 10^{${p.c}} = ${a}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Sam finds that the product moment correlation coefficient for some data is 0. He says this means there is no relationship at all between the variables.",
          truth: false,
          reasons: [
            {
              text: "False. r = 0 means no linear correlation; the variables could still be related in a non-linear way, e.g. a U-shape.",
              correct: true,
            },
            { text: "True. r measures every kind of relationship.", code: "STA.PMCC.INTERPRET" },
            { text: "True. If they were related, r would be 1.", code: "STA.PMCC.INTERPRET" },
          ],
          solution: [
            {
              say: "Always look at the scatter diagram: the PMCC only measures linear correlation.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === r2(10 ** p.c);
    return true;
  },
});
