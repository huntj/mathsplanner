/**
 * @statement GH-A14
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A14: Plot and interpret exponential graphs in context
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: bacteria start at `start` and double each hour for `hours`. */
  start: number;
  hours: number;
  /** Depth 2: a car bought for `price` loses 20% a year. */
  price: number;
  years: number;
  /** Depth 5: P = a × bᵗ through (0, a) and (1, ab). */
  a: number;
  b: 1.5 | 2 | 0.5;
}

function curve(a: number, b: number): CartesianSpec {
  const top = Math.max(a, a * b ** 4);
  const step = top > 1000 ? 400 : top > 500 ? 200 : 100;
  return {
    type: "cartesian",
    x: { min: 0, max: 4, step: 1, label: "\\text{time (hours)}" },
    y: { min: 0, max: Math.ceil(top / step) * step, step, label: "\\text{population}" },
    grid: true,
    curves: [{ y: `${a}*${b}^x`, domain: [0, 4] }],
    points: [
      { at: [0, a], label: `(0, ${a})` },
      { at: [1, a * b], label: `(1, ${a * b})` },
    ],
    description: "An exponential curve with two marked points, at time 0 and time 1.",
  };
}

export default defineGenerator<Params>({
  id: "GH-A14",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["RAT.COMPOUND.SIMPLE", "RAT.PERCENT.MULTIPLIER"],

  params(rng) {
    const b = rng.pick([1.5, 2, 0.5] as const);
    const a = rng.pick([100, 200, 400]);
    if (b === 2 && a === 400) reject("a curve that fits on the grid");
    return {
      start: rng.pick([50, 100, 200, 300]),
      hours: rng.int(3, 6),
      price: rng.pick([8000, 10000, 12000, 15000]),
      years: rng.int(2, 4),
      a,
      b,
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const n = p.start * 2 ** p.hours;
        return A.standard({
          question: `A colony of ${p.start} bacteria doubles in size every hour.`,
          ask: `How many bacteria are there after ${p.hours} hours?`,
          answer: A.number(n),
          wrong: wrongs(n, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(p.start * (1 + p.hours)),
              feedback: `Doubling multiplies by 2 each hour; it does not add ${p.start} each hour.`,
            },
          ]),
          solution: [{ say: `${p.start} × 2^${p.hours} = ${n}.` }],
        });
      }
      case 2: {
        const v = Math.round(p.price * 0.8 ** p.years);
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A car is bought for £${p.price}. Its value falls by 20% each year.`,
              ask: `Work out its value after ${p.years} years. Give your answer to the nearest pound.`,
            },
            {
              question: [
                "The value of a car after t years is ",
                A.math(`V = ${p.price} \\times 0.8^t`),
                " pounds.",
              ],
              ask: `Work out its value after ${p.years} years, to the nearest pound.`,
            },
          ],
          answer: A.number(v, { units: "£", accuracy: { dp: 0 } }),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(Math.round(p.price * (1 - 0.2 * p.years)), {
                units: "£",
                accuracy: { dp: 0 },
              }),
              feedback: "Each year's 20% is of the new, lower value: multiply by 0.8 each year.",
            },
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(Math.round(p.price * 0.2 ** p.years), {
                units: "£",
                accuracy: { dp: 0 },
              }),
              feedback: "Losing 20% leaves 80%, so the multiplier is 0.8, not 0.2.",
            },
          ]),
          solution: [{ say: `${p.price} × 0.8^${p.years} = £${v} to the nearest pound.` }],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The number of rabbits on an island after t years is ",
            A.math("N = 100 \\times 1.5^t"),
            ". Ali says the number goes up by 50 every year.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. It is multiplied by 1.5 each year: 100, 150, 225, … The increase grows each year.",
              correct: true,
            },
            { text: "True. 1.5 means an extra 50 each year.", code: "RAT.COMPOUND.SIMPLE" },
            { text: "True. Exponential graphs are straight lines.", code: "RAT.COMPOUND.SIMPLE" },
          ],
          solution: [
            {
              say: "Exponential growth multiplies by the same factor each year, so the yearly increase keeps getting bigger.",
            },
          ],
        });
      default: {
        const later = p.a * p.b ** 3;
        return A.multiStepContext({
          context: [
            "The graph shows a population P after t hours. Its equation has the form ",
            A.math("P = a \\times b^t"),
            ".",
            A.figure(curve(p.a, p.b)),
          ],
          parts: [
            {
              ask: "Write down the value of a.",
              answer: A.number(p.a),
              wrong: wrongs(p.a, [
                {
                  code: "RAT.COMPOUND.SIMPLE",
                  value: A.number(p.a * p.b),
                  feedback: "a is the value when t = 0, because b⁰ = 1.",
                },
              ]),
            },
            {
              ask: "Work out the value of b.",
              answer: A.number(p.b),
              wrong: wrongs(p.b, [
                {
                  code: "RAT.COMPOUND.SIMPLE",
                  value: A.number(p.a * p.b - p.a),
                  feedback:
                    "b is the multiplier from one hour to the next: divide, do not subtract.",
                },
              ]),
            },
            {
              ask: "Use your equation to work out P when t = 3.",
              answer: A.number(later),
              wrong: wrongs(later, [
                {
                  code: "RAT.COMPOUND.SIMPLE",
                  value: A.number(p.a + 3 * (p.a * p.b - p.a)),
                  feedback: "Multiply by b each hour; do not add the same amount.",
                },
              ]),
            },
          ],
          solution: [
            { say: `When t = 0, P = a = ${p.a}.` },
            { say: `When t = 1, P = ${p.a * p.b}, so b = ${p.a * p.b} ÷ ${p.a} = ${p.b}.` },
            { say: `P = ${p.a} × ${p.b}³ = ${later}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.start * 2 ** p.hours;
    if (question.key.depth === 5) return numberAnswer(question) === p.a;
    return true;
  },
});
