/**
 * @statement R-NPV-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// R-NPV-08: Have a deep understanding of number to 10, including the composition of each number (ELG)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { fingers, numberAnswer } from "../shared/counting.ts";

interface Params {
  whole: number;
  part: number;
  claim: number;
}

export default defineGenerator<Params>({
  id: "R-NPV-08",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COMPOSITION.ADD-NOT-PART"],

  params(rng, numbers) {
    const whole =
      numbers === "friendly" ? 10 : numbers === "standard" ? rng.pick([5, 8, 10]) : rng.int(6, 10);
    const part = rng.int(1, whole - 1);
    if (numbers === "friendly" && part === 5) reject("too easy");
    return { whole, part, claim: rng.int(0, 2) };
  },

  build(p, depth, rng): QuestionDraft {
    const missing = p.whole - p.part;
    const wrong = wrongs(missing, [
      {
        code: "NPV.COMPOSITION.ADD-NOT-PART",
        value: A.number(p.whole + p.part),
        feedback: `The total is ${p.whole}, so the missing number is less than ${p.whole}.`,
      },
    ]);
    switch (depth) {
      case 1:
        return A.missingValue({
          intro: "Fill in the missing number.",
          relation: [p.part, "+", missing, "=", p.whole],
          hide: 2,
          wrong,
          solution: [{ say: `${p.part} and ${missing} make ${p.whole}.` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Show ${p.whole} fingers. ${p.part} of them are up.`,
                A.figure(fingers(p.part)),
              ],
              ask: `How many more fingers do you need to put up to make ${p.whole}?`,
            },
            {
              question: `There are ${p.whole} children. ${p.part} are wearing hats.`,
              ask: "How many are not wearing hats?",
            },
          ],
          answer: A.number(missing),
          wrong,
          solution: [{ say: `${p.part} and ${missing} make ${p.whole}.` }],
        });
      default: {
        const claims = [
          {
            claim: "When you split 10 into two parts, one part is bigger than the other.",
            truth: "sometimes" as const,
            reasons: [
              { text: "Usually, but 5 and 5 are the same size.", correct: true },
              { text: "Always: two parts can never be the same." },
              { text: "Never: the parts of 10 are always equal." },
            ],
          },
          {
            claim: "If you know 6 and 4 make 10, you also know 4 and 6 make 10.",
            truth: "always" as const,
            reasons: [
              {
                text: "The same two parts make the same whole, whichever comes first.",
                correct: true,
              },
              { text: "Only if you count the 4 first." },
              { text: "Never: 4 and 6 make 64.", code: "NPV.COMPOSITION.ADD-NOT-PART" },
            ],
          },
          {
            claim: "A part is bigger than the whole.",
            truth: "never" as const,
            reasons: [
              {
                text: "The whole is made of the parts, so each part is smaller (or zero).",
                correct: true,
              },
              { text: "Sometimes, when you add the parts.", code: "NPV.COMPOSITION.ADD-NOT-PART" },
              { text: "Always, because parts are what you add." },
            ],
          },
        ];
        const c = claims[p.claim];
        if (!c) return reject("no claim");
        return A.alwaysSometimesNever({
          rng,
          claim: c.claim,
          truth: c.truth,
          reasons: c.reasons,
          solution: [{ say: c.reasons[0]?.text ?? "" }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "always-sometimes-never") return true;
    return numberAnswer(question) + p.part === p.whole;
  },
});
