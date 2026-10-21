/**
 * @statement Y2-MD-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-MD-03: Show that multiplication can be done in any order and division cannot
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  t: number;
  claim: number;
}

export default defineGenerator<Params>({
  id: "Y2-MD-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MD.DIVIDE.ORDER", "MD.MULTIPLY.ADDS", "AS.EQUALS.ANSWER-NEXT"],

  params(rng, numbers) {
    const t = rng.pick(numbers === "friendly" ? [2, 10] : [2, 5, 10]);
    const a = rng.int(3, numbers === "stretch" ? 12 : 9);
    if (a === t) reject("different numbers");
    return { a, t, claim: rng.int(0, 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.a * p.t;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Which has the same answer as ", A.math(`${p.a} \\times ${p.t}`), "?"],
          correct: A.math(`${p.t} \\times ${p.a}`),
          distractors: [
            {
              content: A.math(`${p.a} + ${p.t}`),
              code: "MD.MULTIPLY.ADDS",
              feedback: "Adding gives a different answer from multiplying.",
            },
            {
              content: A.math(`${p.t} \\div ${p.a}`),
              code: "MD.DIVIDE.ORDER",
              feedback: "That is a division, and it does not give the same answer.",
            },
          ],
          solution: [
            {
              say: `Multiplication can be done in any order: ${p.a} × ${p.t} = ${p.t} × ${p.a} = ${n}.`,
            },
          ],
        });
      case 2:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: [p.a, "\\times", p.t, "=", p.t, "\\times", p.a],
          hide: 6,
          wrong: wrongs(p.a, [
            {
              code: "AS.EQUALS.ANSWER-NEXT",
              value: A.number(n),
              feedback: `Both sides must be the same. ${p.t} × ? must equal ${p.a} × ${p.t}, so the missing number is ${p.a}.`,
            },
          ]),
          solution: [
            {
              say: `Multiplication can be done in any order, so ${p.a} × ${p.t} = ${p.t} × ${p.a}.`,
            },
          ],
        });
      default:
        return p.claim === 0
          ? A.alwaysSometimesNever({
              rng,
              claim: "If you swap the two numbers in a multiplication, the answer stays the same.",
              truth: "always",
              reasons: [
                {
                  text: `Always. ${p.a} rows of ${p.t} and ${p.t} rows of ${p.a} are the same array turned round.`,
                  correct: true,
                },
                { text: "Sometimes. Only for the 2 times table." },
                { text: "Never. The bigger number has to go first.", code: "MD.DIVIDE.ORDER" },
              ],
              solution: [{ say: `${p.a} × ${p.t} = ${n} and ${p.t} × ${p.a} = ${n}.` }],
            })
          : A.trueOrFalseWhy({
              rng,
              statement: [
                "Ella knows ",
                A.math(`${n} \\div ${p.t} = ${p.a}`),
                ". She says ",
                A.math(`${p.t} \\div ${n}`),
                ` is also ${p.a}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Sharing ${p.t} between ${n} gives each less than 1. Division cannot be done in any order.`,
                  correct: true,
                },
                {
                  text: "True. You can swap the numbers, like in multiplication.",
                  code: "MD.DIVIDE.ORDER",
                },
                { text: "True. Both use the same two numbers." },
              ],
              solution: [{ say: "Multiplication can be done in any order, but division cannot." }],
            });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === `${p.t} \\times ${p.a}`;
    if (question.archetype === "missing-value") return numberAnswer(question) === p.a;
    return true;
  },
});
