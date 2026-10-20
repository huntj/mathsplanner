/**
 * @statement R-NPV-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-NPV-07: Explore the composition of numbers to 10
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer, partWhole, tenFrames } from "../shared/counting.ts";

interface Params {
  whole: number;
  part: number;
  /** Three different splits for matching, as [whole, part]. */
  set: [number, number][];
}

export default defineGenerator<Params>({
  id: "R-NPV-07",
  version: "1.0.0",
  depths: [1, 2, 3],
  misconceptions: ["NPV.COMPOSITION.ADD-NOT-PART"],

  params(rng, numbers) {
    const top = numbers === "friendly" ? 6 : 10;
    const whole = rng.int(numbers === "stretch" ? 6 : 3, top);
    const part = rng.int(1, whole - 1);
    const set: [number, number][] = [];
    while (set.length < 3) {
      const w = rng.int(3, top);
      const k = rng.int(1, w - 1);
      if (!set.some(([a, b]) => a === w && b === k)) set.push([w, k]);
    }
    if (new Set(set.map(([w, k]) => `${w}/${w - k}`)).size < 3) reject("repeated pictures");
    return { whole, part, set };
  },

  build(p, depth, rng): QuestionDraft {
    const missing = p.whole - p.part;
    const wrong = wrongs(missing, [
      {
        code: "NPV.COMPOSITION.ADD-NOT-PART",
        value: A.number(p.whole + p.part),
        feedback: `The whole is ${p.whole}. The two parts together make ${p.whole}, so the missing part is smaller than ${p.whole}.`,
      },
    ]);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            `${p.whole} is made of ${p.part} and another part.`,
            A.figure(partWhole(String(p.whole), [String(p.part), "?"])),
          ],
          ask: "What is the missing part?",
          answer: A.number(missing),
          wrong,
          solution: [{ say: `${p.part} and ${missing} make ${p.whole}.` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `There are ${p.whole} counters. ${p.part} are filled in.`,
                A.figure(tenFrames(p.whole, { second: missing })),
              ],
              ask: "How many are not filled in?",
            },
            {
              question: `You have ${p.whole} sweets in two hands. One hand has ${p.part}.`,
              ask: "How many are in the other hand?",
            },
          ],
          answer: A.number(missing),
          wrong,
          solution: [{ say: `${p.whole} is ${p.part} and ${missing}.` }],
        });
      default:
        return A.matchRepresentations({
          rng,
          question: "Match each ten frame to its part-whole model.",
          pairs: p.set.map(
            ([w, k]) =>
              [
                A.figure(tenFrames(w, { second: w - k })),
                A.figure(partWhole(String(w), [String(k), String(w - k)])),
              ] as [A.RichInput, A.RichInput],
          ),
          solution: [
            {
              say: "Count the filled counters and the empty ones: they are the two parts, and all of them together is the whole.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "match-representations")
      return p.set.every(([w, k]) => k > 0 && k < w);
    return numberAnswer(question) + p.part === p.whole;
  },
});
