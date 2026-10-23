/**
 * @statement Y7-ALG-01.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-ALG-01.c: Use notation for fractions and brackets
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  c: number;
  x: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-01.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FORM.WORDS", "ALG.EXPAND.FIRST-ONLY"],

  params(rng) {
    return { k: rng.int(2, 6), c: rng.int(1, 9), x: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`Which expression means "${p.c} more than x, all divided by ${p.k}"?`],
          correct: A.math(`\\frac{x + ${p.c}}{${p.k}}`),
          distractors: [
            {
              content: A.math(`x + \\frac{${p.c}}{${p.k}}`),
              code: "ALG.FORM.WORDS",
              feedback: `"All divided by" means the whole of x + ${p.c} goes on top.`,
            },
            {
              content: A.math(`\\frac{${p.k}}{x + ${p.c}}`),
              code: "ALG.FORM.WORDS",
              feedback: `Divided by ${p.k} puts ${p.k} on the bottom.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{x + ${p.c}}{${p.k}}` }],
        });
      case 2: {
        const v = p.k * (p.x + p.c);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the value of ",
                A.math(`${p.k}(x + ${p.c})`),
                " when ",
                A.math(`x = ${p.x}`),
                ".",
              ],
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.EXPAND.FIRST-ONLY",
              value: A.number(p.k * p.x + p.c),
              feedback: `${p.k}(x + ${p.c}) means ${p.k} × (x + ${p.c}): work out the bracket first.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.k} \\times (${p.x} + ${p.c}) = ${p.k} \\times ${p.x + p.c} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ana says ",
            A.math(`\\frac{x}{${p.k}}`),
            " and ",
            A.math(`\\frac{1}{${p.k}}x`),
            " mean the same.",
          ],
          truth: true,
          reasons: [
            {
              text: `True. Dividing by ${p.k} is the same as multiplying by 1/${p.k}.`,
              correct: true,
            },
            {
              text: `False. 1/${p.k} of x is smaller than x divided by ${p.k}.`,
              code: "ALG.FORM.WORDS",
            },
            { text: `False. The second one means 1 ÷ ${p.k}x.`, code: "ALG.FORM.WORDS" },
          ],
          solution: [{ say: `Try x = ${p.k * p.x}: both give ${p.x}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `\\frac{x + ${p.c}}{${p.k}}`;
    if (question.key.depth === 2) return numberAnswer(question) === p.k * (p.x + p.c);
    return true;
  },
});
