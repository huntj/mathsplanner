/**
 * @statement Y2-AS-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-AS-03: Show that addition can be done in any order (commutative) and subtraction cannot
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  /** Depth 4: a claim about addition (always) or about swapping a subtraction (false). */
  claim: number;
}

export default defineGenerator<Params>({
  id: "Y2-AS-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.SUBTRACT.ORDER", "AS.EQUALS.ANSWER-NEXT"],

  params(rng, numbers) {
    const a = rng.int(numbers === "friendly" ? 6 : 11, numbers === "stretch" ? 60 : 20);
    const b = rng.int(2, numbers === "friendly" ? 5 : 9);
    if (b >= a) reject("a bigger than b");
    return { a, b, claim: rng.int(0, 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Which has the same answer as ", A.math(`${p.a} + ${p.b}`), "?"],
          correct: A.math(`${p.b} + ${p.a}`),
          distractors: [
            {
              content: A.math(`${p.a} - ${p.b}`),
              feedback: "Taking away gives a different answer from adding.",
            },
            {
              content: A.math(`${p.b} - ${p.a}`),
              code: "AS.SUBTRACT.ORDER",
              feedback: `Swapping the numbers works for adding, not for taking away, and ${p.b} − ${p.a} cannot be done here.`,
            },
          ],
          solution: [
            {
              say: `Addition can be done in any order: ${p.a} + ${p.b} = ${p.b} + ${p.a} = ${p.a + p.b}.`,
            },
          ],
        });
      case 2:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: [p.a, "+", p.b, "=", p.b, "+", p.a],
          hide: 6,
          wrong: wrongs(p.a, [
            {
              code: "AS.EQUALS.ANSWER-NEXT",
              value: A.number(p.a + p.b),
              feedback: `Both sides must be the same. ${p.b} + ? must equal ${p.a} + ${p.b}, so the missing number is ${p.a}.`,
            },
          ]),
          solution: [
            { say: `Addition can be done in any order, so ${p.a} + ${p.b} = ${p.b} + ${p.a}.` },
          ],
        });
      default:
        return p.claim === 0
          ? A.alwaysSometimesNever({
              rng,
              claim: "If you swap the two numbers in an addition, the answer stays the same.",
              truth: "always",
              reasons: [
                {
                  text: `Always. Adding puts the two parts together, whichever comes first: ${p.a} + ${p.b} = ${p.b} + ${p.a}.`,
                  correct: true,
                },
                { text: "Sometimes. Only when the numbers are small." },
                { text: "Never. The bigger number has to go first.", code: "AS.SUBTRACT.ORDER" },
              ],
              solution: [
                {
                  say: `${p.a} + ${p.b} = ${p.a + p.b} and ${p.b} + ${p.a} = ${p.a + p.b}. Addition can be done in any order.`,
                },
              ],
            })
          : A.trueOrFalseWhy({
              rng,
              statement: [
                "Lily knows ",
                A.math(`${p.a} - ${p.b} = ${p.a - p.b}`),
                ". She says ",
                A.math(`${p.b} - ${p.a}`),
                ` is also ${p.a - p.b}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. ${p.b} − ${p.a} starts with ${p.b} and takes away more than that, so it is not ${p.a - p.b}. Subtraction cannot be done in any order.`,
                  correct: true,
                },
                {
                  text: "True. You can swap the numbers in any calculation.",
                  code: "AS.SUBTRACT.ORDER",
                },
                { text: "True. Both use the same two numbers." },
              ],
              solution: [{ say: "Addition can be done in any order, but subtraction cannot." }],
            });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === `${p.b} + ${p.a}`;
    if (question.archetype === "missing-value") return numberAnswer(question) === p.a;
    return true;
  },
});
