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

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-03.a",
  version: "1.0.0",
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
        return A.trueOrFalseWhy({
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
            { text: "True. Two negatives always make a positive.", code: "NPV.NEGATIVE.SIGN-RULE" },
            { text: "True. The minus signs cancel out.", code: "NPV.NEGATIVE.SIGN-RULE" },
          ],
          solution: [{ say: "Use a number line for adding and subtracting negatives." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === -p.a * p.b;
    if (question.key.depth === 2) return numberAnswer(question) === p.b - p.a;
    return true;
  },
});
