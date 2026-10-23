/**
 * @statement Y7-ALG-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-ALG-01.b: Use notation for powers, e.g. a² and a²b
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.SQUARE.DOUBLES", "NPV.ORDER.LEFT-TO-RIGHT"],

  params(rng) {
    const p = { a: rng.int(3, 9), b: rng.int(2, 5), k: rng.int(2, 5) };
    if (p.a === 2) reject("a value where squaring and doubling differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.a * p.a * p.b;
        return A.standard({
          question: [
            "If ",
            A.math(`a = ${p.a}`),
            " and ",
            A.math(`b = ${p.b}`),
            ", work out ",
            A.math("a^2b"),
            ".",
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MD.SQUARE.DOUBLES",
              value: A.number(2 * p.a * p.b),
              feedback: `a² means a × a = ${p.a * p.a}, not 2 × a.`,
            },
          ]),
          solution: [
            { say: "", math: `${p.a}^2 \\times ${p.b} = ${p.a * p.a} \\times ${p.b} = ${v}` },
          ],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Write ", A.math("a \\times a \\times a \\times b"), " in its simplest form."],
          correct: A.math("a^3b"),
          distractors: [
            {
              content: A.math("3ab"),
              code: "MD.SQUARE.DOUBLES",
              feedback: "Three a's multiplied together is a³, not 3 × a.",
            },
            {
              content: A.math("a^3b^3"),
              feedback: "Only the a is multiplied three times; there is one b.",
            },
          ],
          solution: [{ say: "", math: "a \\times a \\times a \\times b = a^3b" }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Zoe says ", A.math(`${p.k}a^2`), " means ", A.math(`(${p.k}a)^2`), "."],
          truth: false,
          reasons: [
            {
              text: `False. Only a is squared: ${p.k}a² = ${p.k} × a × a. With a = ${p.a} it is ${p.k * p.a * p.a}, but (${p.k}a)² = ${(p.k * p.a) ** 2}.`,
              correct: true,
            },
            {
              text: "True. The power applies to everything in front of it.",
              code: "NPV.ORDER.LEFT-TO-RIGHT",
            },
            { text: "True. You multiply first, then square.", code: "NPV.ORDER.LEFT-TO-RIGHT" },
          ],
          solution: [{ say: "Powers are worked out before multiplying." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a * p.a * p.b;
    if (question.key.depth === 2) return chosenText(question) === "a^3b";
    return true;
  },
});
