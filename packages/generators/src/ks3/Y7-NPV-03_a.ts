/**
 * @statement Y7-NPV-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-03.a: Calculate with positive and negative integers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-03.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: [
    "NPV.NEGATIVE.SIGN-RULE",
    "NPV.NEGATIVE.SUBTRACT-NEGATIVE",
    "NPV.NEGATIVE.MIRROR",
  ],

  params(rng) {
    const p = { a: rng.int(2, 12), b: rng.int(2, 15) };
    if (p.a === p.b) reject("two different numbers");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = -p.a * p.b;
        return A.standard({
          question: ["Work out ", A.math(`(-${p.a}) \\times ${p.b}`), "."],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "NPV.NEGATIVE.SIGN-RULE",
              value: A.number(p.a * p.b),
              feedback: "A negative times a positive is negative.",
            },
          ]),
          solution: [{ say: "", math: `(-${p.a}) \\times ${p.b} = ${v}` }],
        });
      }
      case 2: {
        const v = p.b - p.a;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Work out ", A.math(`-${p.a} - (-${p.b})`), "."] },
            {
              question: [
                `At midnight the temperature was −${p.a}°C. By noon it had risen by ${p.b} degrees.`,
              ],
              ask: "What was the temperature at noon, in °C?",
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "NPV.NEGATIVE.SUBTRACT-NEGATIVE",
              value: A.number(-p.a - p.b),
              feedback: `Subtracting −${p.b} is the same as adding ${p.b}: count up from −${p.a}.`,
            },
            {
              code: "NPV.NEGATIVE.MIRROR",
              value: A.number(p.a + p.b),
              feedback: `Start below zero, at −${p.a}, and count up ${p.b}.`,
            },
          ]),
          solution: [{ say: "", math: `-${p.a} + ${p.b} = ${v}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Kim says ",
                A.math(`-${p.a} + (-${p.b}) = ${p.a + p.b}`),
                " because two negatives make a positive.",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Adding a negative moves down: −${p.a} − ${p.b} = −${p.a + p.b}. "Two negatives make a positive" is about multiplying and dividing.`,
                  correct: true,
                },
                {
                  text: "True. Two negatives always make a positive.",
                  code: "NPV.NEGATIVE.SIGN-RULE",
                },
                { text: "True. The minus signs cancel out.", code: "NPV.NEGATIVE.SIGN-RULE" },
              ],
              solution: [{ say: "Use a number line for adding and subtracting negatives." }],
            }),
          [
            {
              statement: `Ola says $${p.a} - (-${p.b}) = ${p.a + p.b}$.`,
              truth: true,
              right: `True. Subtracting a negative is the same as adding: ${p.a} + ${p.b} = ${p.a + p.b}.`,
              wrong: [
                [
                  `False. It is ${p.a - p.b}, because you take ${p.b} away.`,
                  "NPV.NEGATIVE.SUBTRACT-NEGATIVE",
                ],
                ["False. Two minus signs make the answer negative.", "NPV.NEGATIVE.SIGN-RULE"],
              ],
            },
            {
              statement: `Ed says $-${p.a} \\times -${p.b} = ${p.a * p.b}$.`,
              truth: true,
              right: "True. A negative times a negative is positive.",
              wrong: [
                [
                  `False. It is −${p.a * p.b}: negative numbers give a negative answer.`,
                  "NPV.NEGATIVE.SIGN-RULE",
                ],
                [`False. Add them: −${p.a + p.b}.`, "NPV.NEGATIVE.SIGN-RULE"],
              ],
            },
            {
              claim: "Adding a negative number to a positive number gives a negative answer.",
              truth: "sometimes",
              right: `Sometimes. ${Math.max(p.a, p.b)} + (−${Math.min(p.a, p.b)}) = ${Math.max(p.a, p.b) - Math.min(p.a, p.b)} is positive, but ${Math.min(p.a, p.b)} + (−${Math.max(p.a, p.b)}) = −${Math.max(p.a, p.b) - Math.min(p.a, p.b)} is negative.`,
              wrong: [
                [
                  "Always. A negative in a sum makes the answer negative.",
                  "NPV.NEGATIVE.SIGN-RULE",
                ],
                ["Never. Adding always makes a number bigger."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === -p.a * p.b;
    if (question.key.depth === 2) return numberAnswer(question) === p.b - p.a;
    return true;
  },
});
