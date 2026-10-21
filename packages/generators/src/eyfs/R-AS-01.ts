/**
 * @statement R-AS-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-AS-01: Automatically recall number bonds for 0 to 5 and some to 10 (ELG: bonds to 5 including
// subtraction facts; some bonds to 10 including doubles)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer, partWhole, tenFrames } from "../shared/counting.ts";

interface Params {
  whole: number;
  part: number;
  /** Depth 2: whether the fact is a subtraction. */
  subtract: boolean;
  /** Depth 3: three different bonds to 10. */
  set: number[];
}

export default defineGenerator<Params>({
  id: "R-AS-01",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["NPV.COMPOSITION.ADD-NOT-PART"],

  params(rng, numbers) {
    const whole = numbers === "friendly" ? 5 : numbers === "standard" ? rng.pick([5, 10]) : 10;
    const part = rng.int(numbers === "friendly" ? 1 : 0, whole - (numbers === "friendly" ? 1 : 0));
    const set = rng.shuffle([1, 2, 3, 4, 6, 7, 8, 9]).slice(0, 3);
    if (whole - part === 0 && numbers !== "stretch") reject("zero bonds only for stretch");
    // 3 and 7 would both match 3 + 7 = 10 and 7 + 3 = 10.
    if (set.some((k) => set.includes(10 - k))) reject("no complementary pairs to match");
    return { whole, part, subtract: rng.bool(), set };
  },

  build(p, depth, rng): QuestionDraft {
    const other = p.whole - p.part;
    const wrong = wrongs(other, [
      {
        code: "NPV.COMPOSITION.ADD-NOT-PART",
        value: A.number(p.whole + p.part),
        feedback: `The whole is ${p.whole}, so the missing part is smaller than ${p.whole}.`,
      },
    ]);
    switch (depth) {
      case 1:
        return A.standard({
          question:
            p.whole === 10 && p.part > 0
              ? [`There are ${p.part} counters in the ten frame.`, A.figure(tenFrames(p.part))]
              : [
                  `${p.part} and something make ${p.whole}.`,
                  A.figure(partWhole(String(p.whole), [String(p.part), "?"])),
                ],
          ask:
            p.whole === 10 && p.part > 0
              ? "How many more counters make 10?"
              : "What is the missing part?",
          answer: A.number(other),
          wrong,
          solution: [
            {
              say: `${p.part} and ${other} make ${p.whole}.${p.part === other ? " That is a double." : ""}`,
            },
          ],
        });
      case 2:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: p.subtract
            ? [p.whole, "-", p.part, "=", other]
            : [p.part, "+", other, "=", p.whole],
          hide: p.subtract ? 4 : 2,
          wrong,
          solution: [
            {
              say: p.subtract
                ? `${p.part} and ${other} make ${p.whole}, so ${p.whole} take away ${p.part} leaves ${other}.`
                : `${p.part} and ${other} make ${p.whole}.`,
            },
          ],
        });
      default:
        return A.matchRepresentations({
          rng,
          question: "Match each ten frame to its number bond.",
          pairs: p.set.map(
            (k) =>
              [A.figure(tenFrames(k)), A.math(`${k} + ${10 - k} = 10`)] as [
                A.RichInput,
                A.RichInput,
              ],
          ),
          solution: [{ say: "Count the counters. The empty spaces are the other part of 10." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "match-representations") return p.set.every((k) => k > 0 && k < 10);
    return numberAnswer(question) + p.part === p.whole;
  },
});
