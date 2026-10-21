/**
 * @statement Y1-AS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-AS-01: Read, write and interpret statements with +, − and =
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer, objects } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  /** Depth 4: the extra number in a + b = c + d. */
  d: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y1-AS-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.EQUALS.ANSWER-NEXT", "AS.SUBTRACT.ORDER"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 10 : 20;
    const a = rng.int(2, numbers === "friendly" ? 6 : 12);
    const b = rng.int(1, numbers === "friendly" ? 4 : 8);
    if (a === b || a + b > top) reject("different numbers within the range");
    return { a, b, d: rng.int(1, 4), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const c = p.a + p.b;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`${p.a} counters and ${p.b} more.`, A.figure(objects(c, { second: p.b }))],
          ask: "Which number sentence matches the picture?",
          correct: A.math(`${p.a} + ${p.b} = ${c}`),
          distractors: [
            {
              content: A.math(`${p.a} - ${p.b} = ${c}`),
              feedback: "The picture puts the counters together, so it is an addition.",
            },
            {
              content: A.math(`${c} + ${p.b} = ${p.a}`),
              code: "AS.EQUALS.ANSWER-NEXT",
              feedback: `${c} + ${p.b} is more than ${p.a}, so the two sides are not the same.`,
            },
            {
              content: A.math(`${p.b} - ${c} = ${p.a}`),
              code: "AS.SUBTRACT.ORDER",
              feedback: `You cannot take ${c} away from ${p.b}: it is too big.`,
            },
          ],
          solution: [{ say: `${p.a} and ${p.b} more makes ${c}, so ${p.a} + ${p.b} = ${c}.` }],
        });
      case 2:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: [c, "=", p.a, "+", p.b],
          hide: 4,
          wrong: wrongs(p.b, [
            {
              code: "AS.EQUALS.ANSWER-NEXT",
              value: A.number(c + p.a),
              feedback: `= means "is the same as". ${c} is the same as ${p.a} + something, so the missing number is ${c} − ${p.a}.`,
            },
          ]),
          solution: [{ say: `${p.a} + ${p.b} = ${c}, so ${c} = ${p.a} + ${p.b}.` }],
        });
      default: {
        const statement = p.claimTrue
          ? `${c} = ${p.a} + ${p.b}`
          : `${p.a} + ${p.b} = ${c} + ${p.d}`;
        return A.trueOrFalseWhy({
          rng,
          statement: ["This number sentence is correct: ", A.math(statement), "."],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. = means "is the same as". ${p.a} + ${p.b} is ${c}, so both sides are the same.`,
                  correct: true,
                },
                {
                  text: "False. The answer must come after the = sign.",
                  code: "AS.EQUALS.ANSWER-NEXT",
                },
                { text: "False. A number sentence cannot start with a number on its own." },
              ]
            : [
                {
                  text: `False. ${p.a} + ${p.b} is ${c}, but ${c} + ${p.d} is ${c + p.d}. The two sides are not the same.`,
                  correct: true,
                },
                {
                  text: `True. ${p.a} + ${p.b} = ${c}, and then you add ${p.d}.`,
                  code: "AS.EQUALS.ANSWER-NEXT",
                },
                { text: "True. Any number sentence with + and = is correct." },
              ],
          solution: [
            { say: `= means both sides have the same value. Work out each side and compare.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === `${p.a} + ${p.b} = ${p.a + p.b}`;
    if (question.archetype === "missing-value") return numberAnswer(question) === p.b;
    return p.d > 0;
  },
});
