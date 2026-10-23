/**
 * @statement Y2-NPV-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y2-NPV-04.b: Order numbers from 0 up to 100
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import parent from "./Y2-NPV-04.ts";

const def = parent.definition;

interface Params {
  /** Four numbers with different tens digits; ordering by ones digits gives another order. */
  list: number[];
  most: boolean;
}

const byValue = (list: number[]) => [...list].sort((x, y) => x - y);
const byOnes = (list: number[]) => [...list].sort((x, y) => (x % 10) - (y % 10));

export default defineGenerator<Params>({
  id: "Y2-NPV-04.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.COMPARE.ONES-FIRST"],

  params(rng, numbers) {
    return { list: def.params(rng, numbers).list, most: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const sorted = byValue(p.list);
    const ones = byOnes(p.list);
    const shown = A.math(p.list.join(",\\ "));
    switch (depth) {
      case 1: {
        const word = p.most ? "largest" : "smallest";
        const right = (p.most ? sorted.at(-1) : sorted[0]) ?? 0;
        const trap = (p.most ? ones.at(-1) : ones[0]) ?? 0;
        return A.choice({
          rng,
          question: ["Here are four numbers: ", shown, "."],
          ask: `Which is the ${word}?`,
          correct: String(right),
          distractors: p.list
            .filter((n) => n !== right)
            .map((n) => ({
              content: String(n),
              ...(n === trap
                ? {
                    code: "NPV.COMPARE.ONES-FIRST",
                    feedback: `${n} has the ${p.most ? "biggest" : "smallest"} ones digit, but compare the tens first.`,
                  }
                : {
                    feedback: `Compare the tens digits: ${right} has ${Math.floor(right / 10)} tens.`,
                  }),
            })),
          solution: [{ say: `Compare the tens digits first. The ${word} is ${right}.` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Here are four numbers: ", shown, "."],
          ask: "Which list puts them in order, largest first?",
          correct: [...sorted].reverse().join(", "),
          distractors: [
            {
              content: [...ones].reverse().join(", "),
              code: "NPV.COMPARE.ONES-FIRST",
              feedback: "That orders the ones digits. Compare the tens digits first.",
            },
            { content: sorted.join(", "), feedback: "That is smallest first." },
          ],
          solution: [
            { say: `Look at the tens digits first: ${[...sorted].reverse().join(", ")}.` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Tom puts ", shown, ` in order, smallest first: ${ones.join(", ")}.`],
          truth: false,
          reasons: [
            {
              text: `False. He ordered the ones digits. Comparing the tens first gives ${sorted.join(", ")}.`,
              correct: true,
            },
            { text: "True. The ones digits go up each time.", code: "NPV.COMPARE.ONES-FIRST" },
            { text: "True. Any order is fine if the numbers are all different." },
          ],
          solution: [{ say: `Smallest first: ${sorted.join(", ")}.` }],
        });
    }
  },

  verify(p, question) {
    const sorted = byValue(p.list);
    if (question.key.depth === 1)
      return chosenText(question) === String(p.most ? sorted.at(-1) : sorted[0]);
    if (question.key.depth === 2) return chosenText(question) === [...sorted].reverse().join(", ");
    return byOnes(p.list).join() !== sorted.join();
  },
});
