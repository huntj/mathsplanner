/**
 * @statement Y7-ALG-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-ALG-02.a: Substitute values into expressions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  x: number;
  y: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-02.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.NOTATION.JUXTAPOSE", "ALG.SUBSTITUTE.NEGATIVE-SQUARE"],

  params(rng) {
    return {
      a: rng.int(2, 6),
      b: rng.int(2, 6),
      x: rng.int(2, 9),
      y: rng.int(2, 9),
      k: rng.int(1, 20),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.a * p.x + p.b * p.y;
        return A.standard({
          question: [
            "Work out ",
            A.math(`${p.a}x + ${p.b}y`),
            " when ",
            A.math(`x = ${p.x}`),
            " and ",
            A.math(`y = ${p.y}`),
            ".",
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.NOTATION.JUXTAPOSE",
              value: A.number(p.a + p.x + p.b + p.y),
              feedback: `${p.a}x means ${p.a} × x.`,
            },
          ]),
          solution: [{ say: "", math: `${p.a} \\times ${p.x} + ${p.b} \\times ${p.y} = ${v}` }],
        });
      }
      case 2: {
        const v = p.x * p.x + p.k;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Work out ", A.math(`x^2 + ${p.k}`), " when ", A.math(`x = -${p.x}`), "."],
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
              value: A.number(-p.x * p.x + p.k),
              feedback: `(−${p.x})² = (−${p.x}) × (−${p.x}) = ${p.x * p.x}, which is positive.`,
            },
          ]),
          solution: [{ say: "", math: `(-${p.x})^2 + ${p.k} = ${p.x * p.x} + ${p.k} = ${v}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: [A.math("x^2"), " is bigger than ", A.math("x"), "."],
              truth: "sometimes",
              reasons: [
                {
                  text: `Sometimes. For x = ${p.x}, x² = ${p.x * p.x} is bigger; but for x = 1 they are equal, and for x = 0.5, x² = 0.25 is smaller.`,
                  correct: true,
                },
                {
                  text: "Always. Squaring makes numbers bigger.",
                  code: "ALG.SUBSTITUTE.NEGATIVE-SQUARE",
                },
                { text: "Never. x² is x × 2.", code: "ALG.NOTATION.JUXTAPOSE" },
              ],
              solution: [{ say: "Try values between 0 and 1." }],
            }),
          [
            {
              statement: `When $x = ${p.x}$, Ali says $3x = 3${p.x}$.`,
              truth: false,
              right: `False. 3x means 3 × x = 3 × ${p.x} = ${3 * p.x}.`,
              wrong: [
                ["True. Put the number in place of the x.", "ALG.NOTATION.JUXTAPOSE"],
                ["True. 3x is 3 written next to x.", "ALG.NOTATION.JUXTAPOSE"],
              ],
            },
            {
              statement: `When $x = -${p.a}$, Bo says $x^2 = ${p.a * p.a}$.`,
              truth: true,
              right: `True. (−${p.a}) × (−${p.a}) = ${p.a * p.a}: a negative times a negative is positive.`,
              wrong: [
                [`False. It is −${p.a * p.a}.`, "ALG.SUBSTITUTE.NEGATIVE-SQUARE"],
                ["False. Squaring a negative number gives a negative answer."],
              ],
            },
            {
              claim: `$x + ${p.b}$ is bigger than $x$.`,
              truth: "always",
              right: `Always. Adding ${p.b} to any number, even a negative one, makes it ${p.b} bigger.`,
              wrong: [
                ["Sometimes. Not when x is negative."],
                ["Never. A letter is bigger than a number."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a * p.x + p.b * p.y;
    if (question.key.depth === 2) return numberAnswer(question) === p.x * p.x + p.k;
    return true;
  },
});
