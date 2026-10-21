/**
 * @statement GF-A21
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A21: Translate simple situations or procedures into algebraic expressions or formulae; derive
// an equation (or two simultaneous equations), solve the equation(s) and interpret the solution
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  k: number;
  m: number;
  x: number;
  extra: number;
  age: number;
  years: number;
}

export default defineGenerator<Params>({
  id: "GF-A21",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["ALG.FORM.WORDS", "ALG.SOLVE.WRONG-INVERSE", "AS.MULTISTEP.ONE-STEP"],

  params(rng) {
    const k = rng.int(2, 6);
    const m = rng.int(2, 9);
    if (k === m) reject("different numbers");
    return {
      k,
      m,
      x: rng.int(3, 15),
      extra: rng.int(2, 8),
      age: rng.int(6, 14),
      years: rng.int(2, 6),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `Sam has n sweets. Tia has ${p.m} fewer than ${p.k} times as many as Sam.`,
          ask: "Which expression gives the number of sweets Tia has?",
          correct: A.math(`${p.k}n - ${p.m}`),
          distractors: [
            {
              content: A.math(`${p.m} - ${p.k}n`),
              code: "ALG.FORM.WORDS",
              feedback: `"${p.m} fewer than" means take ${p.m} away from the amount.`,
            },
            {
              content: A.math(`${p.k}(n - ${p.m})`),
              code: "ALG.FORM.WORDS",
              feedback: `Multiply first, then take away ${p.m}.`,
            },
            {
              content: A.math(`${p.k} + n - ${p.m}`),
              code: "ALG.FORM.WORDS",
              feedback: `"${p.k} times as many" means multiply by ${p.k}.`,
            },
          ],
          solution: [{ say: `${p.k} times Sam's is ${p.k}n; ${p.m} fewer is ${p.k}n − ${p.m}.` }],
        });
      case 2: {
        // Rectangle with width x and length x + extra has perimeter P.
        const P = 2 * (p.x + p.x + p.extra);
        return A.standard({
          question: `A rectangle is x cm wide and (x + ${p.extra}) cm long. Its perimeter is ${P} cm.`,
          ask: "Form and solve an equation to find x.",
          answer: A.number(p.x, { units: "cm" }),
          wrong: wrongs(p.x, [
            {
              code: "ALG.FORM.WORDS",
              value: A.number((P - p.extra) / 2),
              feedback: "The perimeter has two widths and two lengths: 4x + " + 2 * p.extra + ".",
            },
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number((P + 2 * p.extra) / 4),
              feedback: `Subtract ${2 * p.extra} from both sides.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `2x + 2(x + ${p.extra}) = ${P} \\Rightarrow 4x + ${2 * p.extra} = ${P} \\Rightarrow x = ${p.x}`,
            },
          ],
        });
      }
      default: {
        const mum = p.age * p.k;
        const later = (mum + p.years) / (p.age + p.years);
        return A.multiStepContext({
          context: `Mum is ${p.k} times as old as Leo. The sum of their ages is ${mum + p.age}.`,
          parts: [
            {
              ask: "Write an equation using x for Leo's age, and solve it. How old is Leo?",
              answer: A.number(p.age),
              wrong: wrongs(p.age, [
                {
                  code: "ALG.FORM.WORDS",
                  value: A.number((mum + p.age) / p.k),
                  feedback: `Leo's age plus ${p.k} times Leo's age: x + ${p.k}x = ${p.k + 1}x.`,
                },
              ]),
            },
            {
              ask: `How old will Mum be in ${p.years} years?`,
              answer: A.number(mum + p.years),
              wrong: wrongs(mum + p.years, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(mum),
                  feedback: `Add ${p.years} years.`,
                },
              ]),
            },
          ],
          solution: [
            {
              say: "",
              math: `x + ${p.k}x = ${mum + p.age} \\Rightarrow ${p.k + 1}x = ${mum + p.age} \\Rightarrow x = ${p.age}`,
            },
            {
              say: `Mum is ${mum} now and ${mum + p.years} in ${p.years} years.${Number.isInteger(later) ? "" : ""}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "choice")
      return chosenText(question) === `${p.k}n - ${p.m}`;
    if (question.archetype === "standard") return numberAnswer(question) === p.x;
    return numberAnswer(question) === p.age;
  },
});
