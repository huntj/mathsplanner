/**
 * @statement Y1-AS-02.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-AS-02.a: Know number bonds within 10
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer, tenFrames } from "../shared/counting.ts";

interface Params {
  whole: number;
  part: number;
}

export default defineGenerator<Params>({
  id: "Y1-AS-02.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COMPOSITION.ADD-NOT-PART"],

  params(rng, numbers) {
    const whole = numbers === "friendly" ? 10 : rng.int(numbers === "standard" ? 6 : 4, 10);
    return { whole, part: rng.int(1, whole - 2) };
  },

  build(p, depth, rng): QuestionDraft {
    const other = p.whole - p.part;
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
          intro: "Find the missing number.",
          relation: [p.part, "+", other, "=", p.whole],
          hide: 2,
          wrong: wrongs(other, [
            {
              code: "NPV.COMPOSITION.ADD-NOT-PART",
              value: A.number(p.whole + p.part),
              feedback: `The two parts make ${p.whole}. What goes with ${p.part} to make ${p.whole}?`,
            },
          ]),
          solution: [{ say: `${p.part} and ${other} make ${p.whole}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ivy knows ",
            A.math(`${p.part} + ${other} = ${p.whole}`),
            ". She says that means ",
            A.math(`${p.part + 1} + ${other + 1} = ${p.whole}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. If one part gets 1 bigger, the other part must get 1 smaller to keep the whole at ${p.whole}: ${p.part + 1} + ${other - 1} = ${p.whole}.`,
              correct: true,
            },
            {
              text: "True. Both parts went up by 1, so the whole stays the same.",
              code: "NPV.COMPOSITION.ADD-NOT-PART",
            },
            { text: `True. Any two numbers that are close together make ${p.whole}.` },
          ],
          solution: [{ say: "", math: `${p.part + 1} + ${other + 1} = ${p.whole + 2}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 4) return true;
    return numberAnswer(question) === p.whole - p.part;
  },
});
