/**
 * @statement Y3-MD-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y3-MD-03.a: Solve missing number multiplication and division problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  /** Depth 2: the missing number is the divisor rather than the dividend. */
  divisor: boolean;
}

export default defineGenerator<Params>({
  id: "Y3-MD-03.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.INVERSE.SAME-OPERATION", "MD.DIVIDE.ORDER"],

  params(rng, numbers) {
    const a = rng.pick(numbers === "friendly" ? [2, 5, 10] : [3, 4, 8]);
    const b = rng.int(3, numbers === "stretch" ? 12 : 10);
    if (a === b) reject("two different numbers");
    return { a, b, divisor: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const c = p.a * p.b;
    switch (depth) {
      case 1:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: [p.b, "\\times", p.a, "=", c],
          hide: 0,
          wrong: wrongs(p.b, [
            {
              code: "AS.INVERSE.SAME-OPERATION",
              value: A.number(c * p.a),
              feedback: `Undo the multiplication with a division: ${c} ÷ ${p.a}.`,
            },
          ]),
          solution: [{ say: "", math: `${c} \\div ${p.a} = ${p.b}` }],
        });
      case 2:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: [c, "\\div", p.a, "=", p.b],
          hide: p.divisor ? 2 : 0,
          wrong: p.divisor
            ? wrongs(p.a, [
                {
                  code: "MD.DIVIDE.ORDER",
                  value: A.number(c * p.b),
                  feedback: `${c} shared into how many groups gives ${p.b} in each? Work out ${c} ÷ ${p.b}.`,
                },
              ])
            : wrongs(c, [
                {
                  code: "AS.INVERSE.SAME-OPERATION",
                  value: A.number(p.b),
                  feedback: `The missing number divided by ${p.a} is ${p.b}, so multiply: ${p.b} × ${p.a}.`,
                },
              ]),
          solution: [{ say: "", math: `${c} \\div ${p.a} = ${p.b}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jay solves ",
            A.math(`\\square \\div ${p.a} = ${p.b}`),
            ` and says the missing number is ${p.b}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The missing number is ${p.b} × ${p.a} = ${c}, because ${c} ÷ ${p.a} = ${p.b}.`,
              correct: true,
            },
            {
              text: `True. Dividing by ${p.a} gives ${p.b}, so it starts as ${p.b}.`,
              code: "AS.INVERSE.SAME-OPERATION",
            },
            { text: `True. ${p.b} ÷ ${p.a} = ${p.b}.` },
          ],
          solution: [{ say: "Use the inverse: multiply to undo a division." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.b;
    if (question.key.depth === 2) return numberAnswer(question) === (p.divisor ? p.a : p.a * p.b);
    return true;
  },
});
