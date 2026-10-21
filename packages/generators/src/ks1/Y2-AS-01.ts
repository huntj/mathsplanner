/**
 * @statement Y2-AS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-AS-01: Recall and use addition and subtraction facts to 20 fluently, and derive and use related
// facts up to 100
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: a + b ≤ 10, scaled to tens; or c − b. */
  a: number;
  b: number;
  subtract: boolean;
  /** Depths 2 and 4: x + y crosses 10, added to tens t: (10t + x) + y. */
  x: number;
  y: number;
  t: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y2-AS-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.PLACE.TENS-ONES-MIXUP", "AS.COLUMN.NO-CARRY"],

  params(rng, numbers) {
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    const x = rng.int(2, 9);
    const y = rng.int(2, 9);
    const t = rng.int(1, numbers === "friendly" ? 4 : 8);
    if (a + b > 10 || a === b) reject("a + b to 10, as tens up to 100");
    if (x + y <= 10 || 10 * t + x + y > 100) reject("x + y crosses ten; total to 100");
    return { a, b, subtract: rng.bool(), x, y, t, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const c = p.a + p.b;
        const [fact, derived, answer] = p.subtract
          ? [`${c} - ${p.b} = ${p.a}`, `${10 * c} - ${10 * p.b}`, 10 * p.a]
          : [`${p.a} + ${p.b} = ${c}`, `${10 * p.a} + ${10 * p.b}`, 10 * c];
        return A.standard({
          question: ["You know that ", A.math(fact), "."],
          ask: ["Use it to work out ", A.math(derived), "."],
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "NPV.PLACE.TENS-ONES-MIXUP",
              value: A.number(answer / 10),
              feedback: "These are tens, so the answer is a number of tens too.",
            },
          ]),
          solution: [
            {
              say: `${fact.replace("-", "−")}, so ${p.subtract ? `${c} tens − ${p.b} tens = ${p.a} tens` : `${p.a} tens + ${p.b} tens = ${c} tens`}, which is ${answer}.`,
            },
          ],
        });
      }
      case 2: {
        const start = 10 * p.t + p.x;
        const answer = start + p.y;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["You know that ", A.math(`${p.x} + ${p.y} = ${p.x + p.y}`), "."],
              ask: ["Use it to work out ", A.math(`${start} + ${p.y}`), "."],
            },
            {
              question: `A class has ${start} pencils. ${p.y} more are found.`,
              ask: "How many pencils are there now?",
            },
          ],
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "AS.COLUMN.NO-CARRY",
              value: A.number(answer - 10),
              feedback: `${p.x} + ${p.y} = ${p.x + p.y}, which is more than 10, so the tens digit goes up by 1.`,
            },
          ]),
          solution: [
            {
              say: `${p.x} + ${p.y} = ${p.x + p.y}, so ${start} + ${p.y} = ${answer}: the ones make a new ten.`,
            },
          ],
        });
      }
      default: {
        const start = 10 * p.t + p.x;
        const said = p.claimTrue ? start + p.y : start + p.y - 10;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Raj knows ",
            A.math(`${p.x} + ${p.y} = ${p.x + p.y}`),
            ". He says ",
            A.math(`${start} + ${p.y} = ${said}`),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. The ones make ${p.x + p.y}, which is 1 ten and ${p.x + p.y - 10} ones, so ${p.t} tens become ${p.t + 1} tens.`,
                  correct: true,
                },
                { text: `False. The tens should stay as ${p.t}.`, code: "AS.COLUMN.NO-CARRY" },
                { text: "False. You cannot use a fact to 20 for bigger numbers." },
              ]
            : [
                {
                  text: `False. ${p.x} + ${p.y} = ${p.x + p.y} makes a new ten, so the answer is ${start + p.y}.`,
                  correct: true,
                },
                {
                  text: `True. Only the ones digit changes when you add ${p.y}.`,
                  code: "AS.COLUMN.NO-CARRY",
                },
                { text: "True. You cannot use a fact to 20 for bigger numbers." },
              ],
          solution: [{ say: `${start} + ${p.y} = ${start + p.y}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const c = p.a + p.b;
      return numberAnswer(question) === (p.subtract ? 10 * c - 10 * p.b : 10 * p.a + 10 * p.b);
    }
    if (question.archetype === "varied-form")
      return numberAnswer(question) === 10 * p.t + p.x + p.y;
    return true;
  },
});
