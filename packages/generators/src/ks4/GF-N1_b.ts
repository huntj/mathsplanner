/**
 * @statement GF-N1.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N1.b: Use =, ≠, <, >, ≤ and ≥
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  x: number;
  y: number;
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GF-N1.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COMPARE.SIGN-DIRECTION", "NPV.BOUNDS.ENDS"],

  params(rng) {
    const p = { x: rng.int(1, 12), y: rng.int(1, 12), a: rng.int(1, 6), b: rng.int(1, 8) };
    if (p.x === p.y) reject("two different numbers");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = p.x > p.y ? "<" : ">";
        const other = p.x > p.y ? ">" : "<";
        return A.choice({
          rng,
          question: ["Which symbol makes ", A.math(`-${p.x} \\; \\square \\; -${p.y}`), " true?"],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(other),
              code: "NPV.COMPARE.SIGN-DIRECTION",
              feedback:
                "The wide end of the sign faces the bigger number. Which is further below zero?",
            },
            { content: A.math("="), feedback: "The numbers are different, so they are not equal." },
          ],
          solution: [{ say: "", math: `-${p.x} ${right} -${p.y}` }],
        });
      }
      case 2: {
        const v = p.a + p.b;
        return A.standard({
          question: [
            "How many integers ",
            A.math("n"),
            " satisfy ",
            A.math(`-${p.a} < n \\le ${p.b}`),
            "?",
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.BOUNDS.ENDS",
              value: A.number(v + 1),
              feedback: `−${p.a} is not included (<), but ${p.b} is (≤).`,
            },
            {
              code: "NPV.BOUNDS.ENDS",
              value: A.number(v - 1),
              feedback: `${p.b} is included, because the sign is ≤.`,
            },
          ]),
          solution: [{ say: `The integers from ${1 - p.a} to ${p.b}: there are ${v}.` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Lou says ", A.math(`x \\ge ${p.b}`), ` means x is bigger than ${p.b}.`],
              truth: false,
              reasons: [
                {
                  text: `False. ≥ means greater than or equal to, so x can be ${p.b} itself.`,
                  correct: true,
                },
                { text: "True. ≥ and > mean the same thing.", code: "NPV.BOUNDS.ENDS" },
                {
                  text: `True. x could be anything less than ${p.b}.`,
                  code: "NPV.COMPARE.SIGN-DIRECTION",
                },
              ],
              solution: [{ say: "The line under the sign means “or equal to”." }],
            }),
          [
            {
              statement: "Max says $x < 5$ includes $x = 4.9$.",
              truth: true,
              right: "True. 4.9 is less than 5.",
              wrong: [
                ["False. x must be a whole number.", "NPV.BOUNDS.ENDS"],
                ["False. < means more than.", "NPV.COMPARE.SIGN-DIRECTION"],
              ],
            },
            {
              claim: "If $a < b$, then $b > a$.",
              truth: "always",
              right: "Always. They say the same thing from the other side.",
              wrong: [
                ["Never. The signs point different ways.", "NPV.COMPARE.SIGN-DIRECTION"],
                ["Sometimes. Only for positive numbers."],
              ],
            },
            {
              statement: "Ella says $-2 \\le x < 3$ includes $x = 3$.",
              truth: false,
              right: "False. x < 3 means 3 itself is not included.",
              wrong: [
                ["True. Both ends are included.", "NPV.BOUNDS.ENDS"],
                ["True. < includes the end number.", "NPV.BOUNDS.ENDS"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === (p.x > p.y ? "<" : ">");
    if (question.key.depth === 2) return numberAnswer(question) === p.a + p.b;
    return true;
  },
});
