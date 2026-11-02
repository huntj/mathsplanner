/**
 * @statement Y7-NPV-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-02.c: Use =, ≠, <, >, ≤ and ≥
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  p: number;
  k: number;
  x: number;
  y: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-02.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COMPARE.SIGN-DIRECTION", "NPV.DECIMAL.LONGER-BIGGER", "NPV.NEGATIVE.ORDER"],

  params(rng) {
    const p = { p: rng.int(3, 9), k: rng.int(1, 9), x: rng.int(2, 15), y: rng.int(1, 14) };
    if (p.y >= p.x) reject("x bigger than y");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const a = `0.${p.p}`;
        const b = `0.${p.p - 1}${p.k}`;
        return A.choice({
          rng,
          question: ["Which symbol makes ", A.math(`${a} \\; \\square \\; ${b}`), " true?"],
          correct: A.math(">"),
          distractors: [
            {
              content: A.math("<"),
              code: "NPV.DECIMAL.LONGER-BIGGER",
              feedback: `Compare the tenths first: ${p.p} tenths is more than ${p.p - 1} tenths.`,
            },
            { content: A.math("="), feedback: "The numbers are different." },
          ],
          solution: [{ say: "", math: `${a} > ${b}` }],
        });
      }
      case 2: {
        const right = `-${p.y} > -${p.x}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which of these statements is true?"],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`-${p.x} > -${p.y}`),
              code: "NPV.NEGATIVE.ORDER",
              feedback: `−${p.x} is further below zero, so it is the smaller number.`,
            },
            {
              content: A.math(`-${p.y} < -${p.x}`),
              code: "NPV.COMPARE.SIGN-DIRECTION",
              feedback: "The small, pointed end of the sign points to the smaller number.",
            },
          ],
          solution: [{ say: `−${p.y} is closer to zero than −${p.x}: `, math: right }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["If ", A.math("a < b"), ", then ", A.math("b > a"), "."],
              truth: "always",
              reasons: [
                {
                  text: `Always. Both say the same thing: a is the smaller number. For example ${p.y} < ${p.x} and ${p.x} > ${p.y}.`,
                  correct: true,
                },
                {
                  text: "Never. Swapping the numbers means swapping to the other answer.",
                  code: "NPV.COMPARE.SIGN-DIRECTION",
                },
                {
                  text: "Sometimes. Only when both numbers are positive.",
                  code: "NPV.COMPARE.SIGN-DIRECTION",
                },
              ],
              solution: [{ say: "The sign always opens towards the larger number." }],
            }),
          [
            {
              statement: `Raj says $-${p.x} > -${p.y}$.`,
              truth: false,
              right: `False. −${p.x} is further below zero than −${p.y}, so −${p.x} < −${p.y}.`,
              wrong: [
                [`True. ${p.x} > ${p.y}, so the negatives go the same way.`, "NPV.NEGATIVE.ORDER"],
                [
                  "True. Bigger digits make bigger numbers, whatever the sign.",
                  "NPV.NEGATIVE.ORDER",
                ],
              ],
            },
            {
              statement: `Mo says $${p.y} \\le ${p.y}$ is true.`,
              truth: true,
              right: `True. ≤ means less than or equal to, and ${p.y} is equal to ${p.y}.`,
              wrong: [
                ["False. A number cannot be less than itself.", "NPV.COMPARE.SIGN-DIRECTION"],
                ["False. ≤ only compares two different numbers.", "NPV.COMPARE.SIGN-DIRECTION"],
              ],
            },
            {
              claim: "If $a \\ne b$, then $a > b$.",
              truth: "sometimes",
              right:
                "Sometimes. a ≠ b only says the numbers are different: 5 ≠ 3 with 5 > 3, but 3 ≠ 5 with 3 < 5.",
              wrong: [
                ["Always. ≠ means greater than.", "NPV.COMPARE.SIGN-DIRECTION"],
                ["Never. ≠ means less than.", "NPV.COMPARE.SIGN-DIRECTION"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === ">";
    if (question.key.depth === 2) return chosenText(question) === `-${p.y} > -${p.x}`;
    return true;
  },
});
