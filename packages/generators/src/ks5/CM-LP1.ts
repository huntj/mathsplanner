/**
 * @statement CM-LP1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-LP1: Translate situations into expressions or equations, solve and interpret
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  fixed: number;
  rate: number;
  miles: number;
  k: number;
  gap: number;
  total: number;
}

export default defineGenerator<Params>({
  id: "CM-LP1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FORM.WORDS", "ALG.MODEL.LIMITATION"],

  params(rng) {
    const k = rng.int(2, 4);
    const gap = rng.int(2, 10);
    const age = rng.int(8, 15);
    return {
      fixed: rng.int(2, 6),
      rate: rng.pick([1.5, 2, 2.5, 3]),
      miles: rng.int(4, 20),
      k,
      gap,
      total: age + gap + k * age + gap,
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const cost = p.fixed + p.rate * p.miles;
        return A.standard({
          question: [
            `A taxi charges £${p.fixed} plus £${p.rate.toFixed(2)} per mile. A journey costs £${cost.toFixed(2)}.`,
          ],
          ask: "How many miles long was the journey?",
          answer: A.number(p.miles, { units: "miles" }),
          wrong: wrongs(p.miles, [
            {
              code: "ALG.FORM.WORDS",
              value: A.number(Math.round((cost / p.rate) * 100) / 100, { units: "miles" }),
              feedback: `Write ${p.fixed} + ${p.rate}m = ${cost}: subtract the fixed charge before dividing.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.fixed} + ${p.rate}m = ${cost} \\Rightarrow m = \\frac{${cost} - ${p.fixed}}{${p.rate}} = ${p.miles}`,
            },
          ],
        });
      }
      case 2: {
        const right = `(x + ${p.gap}) + (${p.k}x + ${p.gap}) = ${p.total}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `Sam is x years old. His aunt is ${p.k} times as old as him. In ${p.gap} years' time, their ages will add up to ${p.total}.`,
          ],
          ask: "Which equation models this?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`x + ${p.k}x + ${p.gap} = ${p.total}`),
              code: "ALG.FORM.WORDS",
              feedback: `Both of them get ${p.gap} years older.`,
            },
            {
              content: A.math(`(x + ${p.gap}) + ${p.k}(x + ${p.gap}) = ${p.total}`),
              code: "ALG.FORM.WORDS",
              feedback: `The aunt is ${p.k} times as old now, not in ${p.gap} years.`,
            },
          ],
          solution: [
            { say: `Now: x and ${p.k}x. In ${p.gap} years: x + ${p.gap} and ${p.k}x + ${p.gap}.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Tia solves an equation for the number of concert tickets sold and gets t = −${p.gap}. She says ${p.gap} tickets were returned.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. A number of tickets sold cannot be negative, so the model or the working is wrong. Check the equation and the algebra.",
              correct: true,
            },
            {
              text: "True. A negative answer always means something was given back.",
              code: "ALG.MODEL.LIMITATION",
            },
            {
              text: "True. Any solution of the equation is a valid answer.",
              code: "ALG.MODEL.LIMITATION",
            },
          ],
          solution: [{ say: "Always interpret a solution in the context before accepting it." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.miles;
    if (question.key.depth === 2)
      return chosenText(question) === `(x + ${p.gap}) + (${p.k}x + ${p.gap}) = ${p.total}`;
    return true;
  },
});
