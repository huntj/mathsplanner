/**
 * @statement Y1-MEA-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y1-MEA-04: Sequence events in chronological order using language (for example, before and after,
// next, first, today, yesterday, tomorrow, morning, afternoon and evening)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  part: number;
  event: number;
  claim: [number, number];
}

// A school day in order, with the part of the day each happens in.
const DAY: [string, string][] = [
  ["wake up", "morning"],
  ["eat breakfast", "morning"],
  ["go to school", "morning"],
  ["eat lunch", "afternoon"],
  ["go home from school", "afternoon"],
  ["eat dinner", "evening"],
  ["go to bed", "evening"],
];
const PARTS = ["morning", "afternoon", "evening"];

export default defineGenerator<Params>({
  id: "Y1-MEA-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.SEQUENCE.ORDER"],

  params(rng) {
    const claim = rng.shuffle([0, 1, 2, 3, 4, 5, 6]).slice(0, 2) as [number, number];
    return { part: rng.int(0, 2), event: rng.int(1, DAY.length - 2), claim };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const part = PARTS[p.part] ?? "morning";
        const options = PARTS.map((q) => DAY.filter((d) => d[1] === q)[0]?.[0] ?? "");
        const correct = options[p.part] ?? "";
        return A.choice({
          rng,
          question: "Think about a school day.",
          ask: `Which of these do you usually do in the ${part}?`,
          correct,
          distractors: options
            .filter((_, i) => i !== p.part)
            .map((o, i) => ({
              content: o,
              code: "MEA.SEQUENCE.ORDER",
              feedback: `You usually ${o} in the ${DAY.find((d) => d[0] === o)?.[1] ?? PARTS[i]}.`,
            })),
          solution: [{ say: `In the ${part} you usually ${correct}.` }],
        });
      }
      case 2: {
        const now = DAY[p.event]?.[0] ?? "";
        const before = DAY[p.event - 1]?.[0] ?? "";
        const after = DAY[p.event + 1]?.[0] ?? "";
        const ask = rng.bool();
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `On a school day, you ${DAY.map((d) => d[0]).join(", then ")}.`,
          ask: `What do you do just ${ask ? "before" : "after"} you ${now}?`,
          correct: ask ? before : after,
          distractors: [
            {
              content: ask ? after : before,
              code: "MEA.SEQUENCE.ORDER",
              feedback: `That comes ${ask ? "after" : "before"}. "${ask ? "Before" : "After"}" means ${ask ? "earlier" : "later"}.`,
            },
            { content: now, feedback: "That is the thing itself." },
          ],
          solution: [{ say: `The order is: … ${before}, ${now}, ${after} …` }],
        });
      }
      default: {
        const [i, j] = p.claim;
        const a = DAY[i]?.[0] ?? "";
        const b = DAY[j]?.[0] ?? "";
        const truth = i < j;
        return A.trueOrFalseWhy({
          rng,
          statement: `Jo says: "On a school day, I ${a} before I ${b}."`,
          truth,
          reasons: truth
            ? [
                { text: `True. You ${a} earlier in the day than you ${b}.`, correct: true },
                { text: "False. Before means later.", code: "MEA.SEQUENCE.ORDER" },
                { text: "False. You can do them at the same time." },
              ]
            : [
                { text: `False. You ${b} first, then later you ${a}.`, correct: true },
                { text: "True. Before means later.", code: "MEA.SEQUENCE.ORDER" },
                { text: "True. The order of the day does not matter.", code: "MEA.SEQUENCE.ORDER" },
              ],
          solution: [{ say: `In order: ${DAY.map((d) => d[0]).join(", ")}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return DAY.find((d) => d[0] === chosenText(question))?.[1] === PARTS[p.part];
    return true;
  },
});
