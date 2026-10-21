/**
 * @statement Y1-AS-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-AS-02: Represent and use number bonds and related subtraction facts within 20
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer, tenFrames } from "../shared/counting.ts";

interface Params {
  whole: number;
  part: number;
  subtract: boolean;
  /** Depth 3: three different parts of `whole`. */
  set: number[];
}

export default defineGenerator<Params>({
  id: "Y1-AS-02",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["NPV.COMPOSITION.ADD-NOT-PART", "AS.INVERSE.SAME-OPERATION"],

  params(rng, numbers) {
    const whole =
      numbers === "friendly" ? 10 : numbers === "standard" ? rng.pick([10, 20]) : rng.int(11, 20);
    const part = rng.int(1, whole - 1);
    const set = rng.shuffle(Array.from({ length: whole - 1 }, (_, i) => i + 1)).slice(0, 3);
    if (part * 2 === whole && numbers === "friendly") reject("doubles come later");
    // k and whole − k would make two addition facts that match the same pair of subtractions.
    if (set.some((k) => set.includes(whole - k))) reject("no complementary pairs to match");
    return { whole, part, subtract: rng.bool(), set };
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
              feedback: `${p.whole} is the whole, so the answer is less than ${p.whole}.`,
            },
          ]),
          solution: [{ say: `${p.part} + ${other} = ${p.whole}.` }],
        });
      case 2:
        return A.missingValue({
          intro: [
            `You know that `,
            A.math(`${p.part} + ${other} = ${p.whole}`),
            ". Find the missing number.",
          ],
          relation: p.subtract
            ? [p.whole, "-", p.part, "=", other]
            : [p.whole, "-", other, "=", p.part],
          hide: 4,
          wrong: wrongs(p.subtract ? other : p.part, [
            {
              code: "AS.INVERSE.SAME-OPERATION",
              value: A.number(p.whole + (p.subtract ? p.part : other)),
              feedback:
                "Taking away gives a smaller number. Use the bond: the two parts make the whole.",
            },
          ]),
          solution: [
            {
              say: `${p.part} and ${other} make ${p.whole}, so taking one part from ${p.whole} leaves the other.`,
            },
          ],
        });
      default:
        return A.matchRepresentations({
          rng,
          question: "Match each addition fact to its subtraction fact.",
          pairs: p.set.map(
            (k) =>
              [
                A.math(`${k} + ${p.whole - k} = ${p.whole}`),
                A.math(`${p.whole} - ${k} = ${p.whole - k}`),
              ] as [A.RichInput, A.RichInput],
          ),
          solution: [
            {
              say: `If two parts make ${p.whole}, taking one part away from ${p.whole} leaves the other.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.whole - p.part;
    if (question.archetype === "missing-value")
      return numberAnswer(question) === (p.subtract ? p.whole - p.part : p.part);
    return new Set(p.set).size === 3;
  },
});
