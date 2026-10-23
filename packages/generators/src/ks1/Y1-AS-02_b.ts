/**
 * @statement Y1-AS-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-AS-02.b: Know number bonds within 20
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer, tenFrames } from "../shared/counting.ts";

interface Params {
  whole: number;
  part: number;
  /** Depth 2: a bond to 10, made into a bond to 20. */
  a: number;
}

export default defineGenerator<Params>({
  id: "Y1-AS-02.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COMPOSITION.ADD-NOT-PART", "NPV.PLACE.FACE-VALUE"],

  params(rng, numbers) {
    const whole = numbers === "friendly" ? 20 : rng.int(12, 20);
    return { whole, part: rng.int(numbers === "stretch" ? 3 : 11, whole - 1), a: rng.int(1, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    const other = p.whole - p.part;
    const b = 10 - p.a;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `There are ${p.part} counters. How many more make ${p.whole}?`,
            A.figure(tenFrames(p.part)),
          ],
          answer: A.number(other),
          wrong: wrongs(other, [
            {
              code: "NPV.COMPOSITION.ADD-NOT-PART",
              value: A.number(p.whole + p.part),
              feedback: `${p.whole} is the whole, so the missing part is less than ${p.whole}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.part} + ${other} = ${p.whole}` }],
        });
      case 2:
        return A.missingValue({
          intro: ["You know that ", A.math(`${p.a} + ${b} = 10`), ". Find the missing number."],
          relation: [10 + p.a, "+", b, "=", 20],
          hide: 2,
          wrong: wrongs(b, [
            {
              code: "NPV.PLACE.FACE-VALUE",
              value: A.number(10 + b),
              feedback: `${10 + p.a} is 10 more than ${p.a}, and 20 is 10 more than 10. The missing part stays ${b}.`,
            },
          ]),
          solution: [{ say: `${p.a} + ${b} = 10, so ${10 + p.a} + ${b} = 20.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Joe says: ",
            A.math(`${p.a} + ${b} = 10`),
            ", so ",
            A.math(`${p.a} + ${10 + b} = 20`),
            ".",
          ],
          truth: true,
          reasons: [
            {
              text: `True. ${10 + b} is 10 more than ${b}, so the total is 10 more than 10.`,
              correct: true,
            },
            { text: `False. You have to add 10 to both numbers.`, code: "NPV.PLACE.FACE-VALUE" },
            { text: `False. Bonds to 10 do not help with bonds to 20.` },
          ],
          solution: [{ say: "", math: `${p.a} + ${10 + b} = ${p.a} + ${b} + 10 = 20` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.whole - p.part;
    if (question.key.depth === 2) return numberAnswer(question) === 10 - p.a;
    return true;
  },
});
