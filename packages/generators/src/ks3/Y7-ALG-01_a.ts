/**
 * @statement Y7-ALG-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-ALG-01.a: Use notation for products, e.g. ab and 3y
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  k: number;
  y: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-01.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.NOTATION.JUXTAPOSE"],

  params(rng) {
    return { k: rng.int(2, 9), y: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.k * p.y;
        return A.standard({
          question: [
            "If ",
            A.math(`y = ${p.y}`),
            ", what is the value of ",
            A.math(`${p.k}y`),
            "?",
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.NOTATION.JUXTAPOSE",
              value: A.number(Number(`${p.k}${p.y}`)),
              feedback: `${p.k}y means ${p.k} × y, not the digits ${p.k} and ${p.y} side by side.`,
            },
            {
              code: "ALG.NOTATION.JUXTAPOSE",
              value: A.number(p.k + p.y),
              feedback: `${p.k}y means ${p.k} × y, not ${p.k} + y.`,
            },
          ]),
          solution: [{ say: "", math: `${p.k}y = ${p.k} \\times ${p.y} = ${v}` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which is the usual way to write ", A.math(`a \\times b \\times ${p.k}`), "?"],
          correct: A.math(`${p.k}ab`),
          distractors: [
            {
              content: A.math(`${p.k} + a + b`),
              code: "ALG.NOTATION.JUXTAPOSE",
              feedback: "Letters written next to each other are multiplied, not added.",
            },
            {
              content: A.math(`ab${p.k}`),
              feedback: "The number is written first, then the letters in alphabetical order.",
            },
          ],
          solution: [{ say: "Number first, then letters, with no × signs: ", math: `${p.k}ab` }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Gus says ", A.math("ab"), " means ", A.math("a + b"), "."],
              truth: false,
              reasons: [
                {
                  text: `False. ab means a × b. With a = ${p.k} and b = ${p.y}, ab = ${p.k * p.y}, but a + b = ${p.k + p.y}.`,
                  correct: true,
                },
                {
                  text: "True. Letters next to each other are added.",
                  code: "ALG.NOTATION.JUXTAPOSE",
                },
                {
                  text: "True. It is the same as writing the two numbers together.",
                  code: "ALG.NOTATION.JUXTAPOSE",
                },
              ],
              solution: [{ say: "In algebra the × sign is left out, but the + sign never is." }],
            }),
          [
            {
              statement: `Kim says $${p.k}y$ means $${p.k} \\times y$.`,
              truth: true,
              right: `True. A number next to a letter means multiply: with y = ${p.y}, ${p.k}y = ${p.k * p.y}.`,
              wrong: [
                [`False. It means ${p.k} + y.`, "ALG.NOTATION.JUXTAPOSE"],
                [`False. It means y to the power ${p.k}.`],
              ],
            },
            {
              claim: "$ab$ and $ba$ mean the same.",
              truth: "always",
              right: "Always. Both mean a × b, and you can multiply in either order.",
              wrong: [
                ["Never. The letters are in a different order."],
                ["Sometimes. Only when a and b are equal."],
              ],
            },
            {
              statement: `Ray says $${p.k}a \\times ${p.k}b = ${p.k}ab$.`,
              truth: false,
              right: `False. Multiply the numbers too: ${p.k} × ${p.k} = ${p.k * p.k}, so it is ${p.k * p.k}ab.`,
              wrong: [
                ["True. Write the letters together and keep the number.", "ALG.NOTATION.JUXTAPOSE"],
                [`True. The two ${p.k}s are the same, so you only write one.`],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k * p.y;
    if (question.key.depth === 2) return chosenText(question) === `${p.k}ab`;
    return true;
  },
});
