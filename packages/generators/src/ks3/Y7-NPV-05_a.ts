/**
 * @statement Y7-NPV-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-05.a: Use priority of operations with brackets
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-05.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ORDER.LEFT-TO-RIGHT"],

  params(rng) {
    return { a: rng.int(2, 9), b: rng.int(2, 9), c: rng.int(2, 9), d: rng.int(1, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.a * (p.b + p.c);
        return A.standard({
          question: ["Work out ", A.math(`${p.a} \\times (${p.b} + ${p.c})`), "."],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number(p.a * p.b + p.c),
              feedback: "Work out the bracket first.",
            },
          ]),
          solution: [{ say: "", math: `${p.a} \\times ${p.b + p.c} = ${v}` }],
        });
      }
      case 2: {
        const v = p.d * 10 - p.b * p.c + p.a;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Work out ", A.math(`${p.d * 10} - ${p.b} \\times ${p.c} + ${p.a}`), "."],
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number((p.d * 10 - p.b) * p.c + p.a),
              feedback: "Multiply before adding or subtracting.",
            },
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number(p.d * 10 - (p.b * p.c + p.a)),
              feedback: "After multiplying, add and subtract from left to right.",
            },
          ]),
          solution: [{ say: "", math: `${p.d * 10} - ${p.b * p.c} + ${p.a} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jo says ",
            A.math(`${p.d * 10} - ${p.b} + ${p.c}`),
            " has the same value as ",
            A.math(`${p.d * 10} - (${p.b} + ${p.c})`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Without brackets you subtract ${p.b} then add ${p.c}, giving ${p.d * 10 - p.b + p.c}. With brackets you subtract both, giving ${p.d * 10 - p.b - p.c}.`,
              correct: true,
            },
            {
              text: "True. Brackets do not change additions and subtractions.",
              code: "NPV.ORDER.LEFT-TO-RIGHT",
            },
            { text: "True. You always add before you subtract.", code: "NPV.ORDER.LEFT-TO-RIGHT" },
          ],
          solution: [
            { say: "Adding and subtracting go left to right; brackets change that order." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a * (p.b + p.c);
    if (question.key.depth === 2) return numberAnswer(question) === p.d * 10 - p.b * p.c + p.a;
    return true;
  },
});
