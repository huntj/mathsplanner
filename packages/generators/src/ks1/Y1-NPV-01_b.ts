/**
 * @statement Y1-NPV-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-NPV-01.b: Count backwards from any number up to 100
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** The tens number counted back past: …, t + 1, t, t − 1, … */
  t: number;
  start: number;
}

export default defineGenerator<Params>({
  id: "Y1-NPV-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.SEQUENCE.DECADE", "NPV.SEQUENCE.BEFORE-AFTER"],

  params(rng, numbers) {
    const tens =
      numbers === "friendly" ? rng.int(2, 5) : numbers === "standard" ? rng.int(3, 9) : 10;
    return { t: tens * 10, start: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: `Count back: ${p.t + 2}, ${p.t + 1}, ${p.t}, …`,
          ask: "What number comes next?",
          answer: A.number(p.t - 1),
          wrong: wrongs(p.t - 1, [
            {
              code: "NPV.SEQUENCE.DECADE",
              value: A.number(p.t + 9),
              feedback: `Going back from ${p.t}, the ones go to 9 and the tens go down by one: ${p.t - 1}.`,
            },
            {
              code: "NPV.SEQUENCE.BEFORE-AFTER",
              value: A.number(p.t + 1),
              feedback: "Counting back, each number is one less than the one before.",
            },
          ]),
          solution: [{ say: `One less than ${p.t} is ${p.t - 1}.` }],
        });
      case 2: {
        const s = p.t + p.start;
        return A.missingValue({
          intro: `Count back in ones from ${s}. What number is missing?`,
          relation: [s, ",", s - 1, ",", s - 2, ",", s - 3],
          hide: 4,
          wrong: [
            {
              code: "NPV.SEQUENCE.BEFORE-AFTER",
              value: A.number(s),
              feedback: `Counting back, the number after ${s - 1} is one less: ${s - 2}.`,
            },
          ],
          solution: [{ say: `${s}, ${s - 1}, ${s - 2}, ${s - 3}: one less each time.` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "When you count back one from a number that ends in 0, you land on a number that ends in 9.",
          ],
          truth: "always",
          reasons: [
            {
              text: `Always. For example ${p.t} then ${p.t - 1}: the ones go to 9 and the tens go down by one.`,
              correct: true,
            },
            { text: `Never. After ${p.t} you land on ${p.t - 10}.`, code: "NPV.SEQUENCE.DECADE" },
            { text: "Sometimes. Only for numbers below 20." },
          ],
          solution: [{ say: `Counting back: ${p.t + 1}, ${p.t}, ${p.t - 1}, ${p.t - 2}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.t - 1;
    if (question.key.depth === 2) return numberAnswer(question) === p.t + p.start - 2;
    return true;
  },
});
