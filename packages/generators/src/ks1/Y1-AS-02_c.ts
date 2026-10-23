/**
 * @statement Y1-AS-02.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-AS-02.c: Use related subtraction facts within 20
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  whole: number;
  part: number;
  /** Depth 3: three different parts of `whole`. */
  set: number[];
}

export default defineGenerator<Params>({
  id: "Y1-AS-02.c",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["AS.INVERSE.SAME-OPERATION"],

  params(rng, numbers) {
    const whole =
      numbers === "friendly" ? rng.int(6, 10) : rng.int(numbers === "standard" ? 10 : 13, 20);
    const part = rng.int(1, whole - 1);
    const set = rng.shuffle(Array.from({ length: whole - 1 }, (_, i) => i + 1)).slice(0, 3);
    if (set.some((k) => set.includes(whole - k))) reject("no complementary pairs to match");
    if (part * 2 === whole) reject("two different parts");
    return { whole, part, set };
  },

  build(p, depth, rng): QuestionDraft {
    const other = p.whole - p.part;
    const fact = A.math(`${p.part} + ${other} = ${p.whole}`);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["You know that ", fact, "."],
          ask: [A.math(`${p.whole} - ${p.part} = ?`)],
          answer: A.number(other),
          wrong: wrongs(other, [
            {
              code: "AS.INVERSE.SAME-OPERATION",
              value: A.number(p.whole + p.part),
              feedback: `Taking away makes it smaller. ${p.part} and ${other} make ${p.whole}, so ${p.whole} take away ${p.part} leaves ${other}.`,
            },
          ]),
          solution: [
            {
              say: `${p.part} and ${other} make ${p.whole}, so ${p.whole} − ${p.part} = ${other}.`,
            },
          ],
        });
      case 2:
        return A.missingValue({
          intro: ["You know that ", fact, ". Find the missing number."],
          relation: [p.whole, "-", other, "=", p.part],
          hide: 2,
          wrong: wrongs(other, [
            {
              code: "AS.INVERSE.SAME-OPERATION",
              value: A.number(p.whole + p.part),
              feedback: `${p.whole} take away something leaves ${p.part}. The two parts of ${p.whole} are ${p.part} and ${other}.`,
            },
          ]),
          solution: [
            {
              say: `${p.whole} − ${other} = ${p.part}, because ${p.part} + ${other} = ${p.whole}.`,
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
              say: `If two parts make ${p.whole}, taking one part from ${p.whole} leaves the other.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 3) return new Set(p.set).size === 3;
    return numberAnswer(question) === p.whole - p.part;
  },
});
