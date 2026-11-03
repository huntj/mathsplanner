/**
 * @statement GF-R10.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R10.c: Represent proportion graphically and algebraically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  k: number;
  x: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "GF-R10.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.ADDITIVE", "RAT.PROPORTION.LINEAR-INTERCEPT", "RAT.INVERSE.AS-DIRECT"],

  params(rng) {
    const p = { k: rng.int(2, 12), x: rng.int(2, 9), c: rng.int(1, 9) };
    if (p.k * p.x - p.x === p.k) reject("a misconception that differs from the answer");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            A.math("y"),
            " is directly proportional to ",
            A.math("x"),
            ". When ",
            A.math(`x = ${p.x}`),
            ", ",
            A.math(`y = ${p.k * p.x}`),
            ".",
          ],
          ask: ["Find ", A.math("k"), " in the formula ", A.math("y = kx"), "."],
          answer: A.number(p.k),
          wrong: wrongs(p.k, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(p.k * p.x - p.x),
              feedback: `y = kx, so k = y ÷ x = ${p.k * p.x} ÷ ${p.x}.`,
            },
          ]),
          solution: [{ say: "", math: `k = ${p.k * p.x} \\div ${p.x} = ${p.k}` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which equation shows that ",
            A.math("y"),
            " is directly proportional to ",
            A.math("x"),
            "?",
          ],
          correct: A.math(`y = ${p.k}x`),
          distractors: [
            {
              content: A.math(`y = ${p.k}x + ${p.c}`),
              code: "RAT.PROPORTION.LINEAR-INTERCEPT",
              feedback: `When x = 0, y = ${p.c}, not 0: the line misses the origin.`,
            },
            {
              content: A.math(`y = \\frac{${p.k}}{x}`),
              code: "RAT.INVERSE.AS-DIRECT",
              feedback: "That is inverse proportion: as x gets bigger, y gets smaller.",
            },
          ],
          solution: [{ say: "Direct proportion has the form y = kx." }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Sam says the graph of ",
                A.math(`y = \\frac{${p.k}}{x}`),
                " is a straight line, because y is proportional to x.",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. y is inversely proportional to x, so the graph is a curve: as x doubles, y halves.`,
                  correct: true,
                },
                {
                  text: "True. Every proportion graph is a straight line.",
                  code: "RAT.INVERSE.AS-DIRECT",
                },
                {
                  text: "True. It goes through the origin.",
                  code: "RAT.PROPORTION.LINEAR-INTERCEPT",
                },
              ],
              solution: [
                { say: "Only direct proportion gives a straight line through the origin." },
              ],
            }),
          [
            {
              statement: "Ana says the graph of $y = 3x$ shows direct proportion.",
              truth: true,
              right: "True. It is a straight line through the origin.",
              wrong: [
                ["False. It shows inverse proportion.", "RAT.INVERSE.AS-DIRECT"],
                ["False. It needs a + c.", "RAT.PROPORTION.LINEAR-INTERCEPT"],
              ],
            },
            {
              claim: "The graph of an inverse proportion $y = \\frac{k}{x}$ is a curve.",
              truth: "always",
              right: "Always, for k not 0. As x grows, y shrinks towards 0 without reaching it.",
              wrong: [
                ["Never. It is a straight line.", "RAT.INVERSE.AS-DIRECT"],
                ["Sometimes. Only for big k."],
              ],
            },
            {
              statement:
                "Dev says $y = x + 5$ shows direct proportion, because it is a straight line.",
              truth: false,
              right: "False. It does not pass through the origin.",
              wrong: [
                ["True. Straight lines show proportion.", "RAT.PROPORTION.LINEAR-INTERCEPT"],
                ["True. y goes up by the same amount.", "RAT.ADDITIVE"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k;
    if (question.key.depth === 2) return chosenText(question) === `y = ${p.k}x`;
    return true;
  },
});
