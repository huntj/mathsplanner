/**
 * @statement Y7-ALG-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-ALG-02: Substitute numerical values into formulae and expressions, including scientific formulae
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  x: number;
  y: number;
  k: number;
  /** v = u + at. */
  u: number;
  a: number;
  t: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SUBSTITUTE.NEGATIVE-SQUARE", "NPV.ORDER.LEFT-TO-RIGHT"],

  params(rng, numbers) {
    const x = -rng.int(2, numbers === "stretch" ? 12 : 6);
    const y = rng.int(2, 9);
    const k = rng.int(2, 6);
    if (x * x === -2 * x) reject("the slips must differ");
    return {
      x,
      y,
      k,
      u: rng.int(0, 20),
      a: rng.int(2, 10),
      t: rng.int(2, 12),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const value = p.x * p.x + p.k * p.y;
        return A.standard({
          question: [
            "Work out ",
            A.math(`x^2 + ${p.k}y`),
            " when ",
            A.math(`x = ${p.x}`),
            " and ",
            A.math(`y = ${p.y}`),
            ".",
          ],
          answer: A.number(value),
          wrong: wrongs(value, [
            {
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
              value: A.number(-(p.x * p.x) + p.k * p.y),
              feedback: `(${p.x})² = ${p.x} × ${p.x}, and a negative times a negative is positive: ${p.x * p.x}.`,
            },
          ]),
          solution: [
            {
              say: `x² = (${p.x})² = ${p.x * p.x}, and ${p.k}y = ${p.k * p.y}, so the total is ${value}.`,
            },
          ],
        });
      }
      case 2: {
        const v = p.u + p.a * p.t;
        return A.standard({
          question: [
            "The formula ",
            A.math("v = u + at"),
            " gives the speed v of an object, in m/s, after t seconds.",
          ],
          ask: [
            "Find v when ",
            A.math(`u = ${p.u}`),
            ", ",
            A.math(`a = ${p.a}`),
            " and ",
            A.math(`t = ${p.t}`),
            ".",
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number((p.u + p.a) * p.t),
              feedback: "at means a × t, which comes before adding u.",
            },
          ]),
          solution: [{ say: `v = ${p.u} + ${p.a} × ${p.t} = ${p.u} + ${p.a * p.t} = ${v}.` }],
        });
      }
      default: {
        const right = p.k * p.x * p.x;
        const wrong = (p.k * p.x) ** 2;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "When ",
            A.math(`x = ${p.x}`),
            ", Jade says ",
            A.math(`${p.k}x^2 = ${p.claimTrue ? right : wrong}`),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. Square x first: (${p.x})² = ${p.x * p.x}, then × ${p.k} = ${right}.`,
                  correct: true,
                },
                {
                  text: `False. Multiply ${p.k} × ${p.x} first, then square.`,
                  code: "NPV.ORDER.LEFT-TO-RIGHT",
                },
                {
                  text: `False. The answer is negative because x is negative.`,
                  code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
                },
              ]
            : [
                {
                  text: `False. Only x is squared: ${p.k} × (${p.x})² = ${p.k} × ${p.x * p.x} = ${right}.`,
                  correct: true,
                },
                {
                  text: `True. ${p.k}x is ${p.k * p.x}, and that is squared.`,
                  code: "NPV.ORDER.LEFT-TO-RIGHT",
                },
                { text: "True. Squaring always makes numbers much bigger." },
              ],
          solution: [{ say: `${p.k}x² = ${p.k} × x² = ${right}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    return question.key.depth === 1
      ? numberAnswer(question) === p.x * p.x + p.k * p.y
      : numberAnswer(question) === p.u + p.a * p.t;
  },
});
