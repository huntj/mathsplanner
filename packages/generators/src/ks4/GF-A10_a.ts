/**
 * @statement GF-A10.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A10.a: Identify and interpret gradients
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const CONTEXTS = [
  {
    what: "the cost in pounds, C, of hiring a plumber for h hours",
    eq: (a: number, b: number) => `C = ${a} + ${b}h`,
    right: (b: number) => `It costs £${b} for each hour`,
    fixed: (a: number) => `The call-out charge is £${a}`,
  },
  {
    what: "the height in cm, H, of a candle after t hours",
    eq: (a: number, b: number) => `H = ${a} - ${b}t`,
    right: (b: number) => `The candle gets ${b} cm shorter each hour`,
    fixed: (a: number) => `The candle starts ${a} cm tall`,
  },
  {
    what: "the water in litres, W, in a tank after m minutes",
    eq: (a: number, b: number) => `W = ${a} + ${b}m`,
    right: (b: number) => `${b} litres flow in each minute`,
    fixed: (a: number) => `The tank starts with ${a} litres`,
  },
];

interface Params {
  m: number;
  c: number;
  ctx: number;
  a: number;
  b: number;
  steep: number;
}

export default defineGenerator<Params>({
  id: "GF-A10.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C", "ALG.GRADIENT.STEEPNESS"],

  params(rng) {
    const p = {
      m: rng.int(2, 9) * rng.pick([1, -1]),
      c: rng.int(2, 20),
      ctx: rng.int(0, CONTEXTS.length - 1),
      a: 5 * rng.int(4, 12),
      b: rng.int(2, 9),
      steep: rng.int(2, 6),
    };
    if (Math.abs(p.m) === p.c || p.a === p.b) reject("different gradient and intercept");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "What is the gradient of the line ",
            A.math(`y = ${p.c} ${p.m < 0 ? "-" : "+"} ${Math.abs(p.m)}x`),
            "?",
          ],
          answer: A.number(p.m),
          wrong: signedWrongs(p.m, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(p.c),
              feedback: "The gradient is the coefficient of x, wherever it is written.",
            },
          ]),
          solution: [{ say: `The coefficient of x is ${p.m}.` }],
        });
      case 2: {
        const C = CONTEXTS[p.ctx] ?? (CONTEXTS[0] as (typeof CONTEXTS)[number]);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [`The formula `, A.math(C.eq(p.a, p.b)), ` gives ${C.what}.`],
          ask: `What does the ${p.b} tell you?`,
          correct: C.right(p.b),
          distractors: [
            {
              content: C.fixed(p.b),
              code: "ALG.LINE.M-C",
              feedback: `${p.b} multiplies the variable: it is the rate of change (the gradient), not the starting value.`,
            },
            {
              content: `The total after ${p.b} units`,
              code: "ALG.LINE.M-C",
              feedback: "The gradient is the change for each 1 unit increase.",
            },
          ],
          solution: [
            {
              say: `The gradient, ${p.b}, is the change for each unit: ${C.right(p.b).toLowerCase()}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Sky says the line ",
            A.math(`y = -${p.steep + 1}x + 1`),
            " is less steep than ",
            A.math(`y = ${p.steep}x + 1`),
            ` because −${p.steep + 1} is smaller than ${p.steep}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Steepness depends on the size of the gradient: ${p.steep + 1} > ${p.steep}, so the first line is steeper. The minus sign only means it slopes downwards.`,
              correct: true,
            },
            {
              text: "True. A negative gradient is always less steep.",
              code: "ALG.GRADIENT.STEEPNESS",
            },
            {
              text: "True. The smaller gradient is always less steep.",
              code: "ALG.GRADIENT.STEEPNESS",
            },
          ],
          solution: [{ say: "Compare |m|: the bigger it is, the steeper the line." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.m;
    if (question.key.depth === 2)
      return chosenText(question) === (CONTEXTS[p.ctx] ?? CONTEXTS[0])?.right(p.b);
    return true;
  },
});
