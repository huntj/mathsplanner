/**
 * @statement Y2-MEA-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y2-MEA-05: Compare and sequence intervals of time
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { duration } from "../shared/mea.ts";

interface Params {
  /** Three durations in minutes, one of them written in hours. */
  times: [number, number, number];
  half: number;
}

const write = (m: number) => (m % 60 === 0 ? duration(m) : `${m} minutes`);

export default defineGenerator<Params>({
  id: "Y2-MEA-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.UNITS.MIXED", "MEA.TIME.FACTS"],

  params(rng, numbers) {
    const hours = rng.int(1, numbers === "friendly" ? 1 : 2) * 60;
    const a = rng.int(3, 11) * 5;
    const b = rng.int(hours / 5 + 1, hours / 5 + 8) * 5;
    if (a === b) reject("different times");
    return {
      times: rng.shuffle([hours, a, b]) as [number, number, number],
      half: rng.int(7, 11) * 5,
    };
  },

  build(p, depth, rng): QuestionDraft {
    const longest = Math.max(...p.times);
    const hours = p.times.find((t) => t % 60 === 0) ?? 60;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: `Three films last ${p.times.map(write).join(", ")}.`,
          ask: "Which film is the longest?",
          correct: write(longest),
          distractors: p.times
            .filter((t) => t !== longest)
            .map((t) => ({
              content: write(t),
              ...(t === hours ? {} : { code: "MEA.UNITS.MIXED" }),
              feedback: `${write(hours)} is ${hours} minutes. Compare them all in minutes.`,
            })),
          solution: [
            { say: `${write(hours)} = ${hours} minutes, so the longest is ${write(longest)}.` },
          ],
        });
      case 2: {
        const order = [...p.times].sort((x, y) => x - y);
        const right = order.map(write).join(", ");
        const byNumber = [...p.times]
          .sort((x, y) => (x % 60 === 0 ? x / 60 : x) - (y % 60 === 0 ? y / 60 : y))
          .map(write)
          .join(", ");
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Put these times in order, shortest first: ${p.times.map(write).join(", ")}.`,
          correct: right,
          distractors: [
            {
              content: byNumber,
              code: "MEA.UNITS.MIXED",
              feedback: `${write(hours)} is ${hours} minutes, not ${hours / 60}.`,
            },
            {
              content: [...order].reverse().map(write).join(", "),
              feedback: "That is longest first.",
            },
          ].filter((d) => d.content !== right),
          solution: [{ say: `In minutes: ${order.join(", ")}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Leo says half an hour is longer than ${p.half} minutes.`,
          truth: p.half < 30,
          reasons: [
            {
              text: `False. Half an hour is 30 minutes, which is less than ${p.half} minutes.`,
              correct: true,
            },
            { text: "True. Half an hour is 50 minutes.", code: "MEA.TIME.FACTS" },
            {
              text: "True. An hour is longer than any number of minutes.",
              code: "MEA.UNITS.MIXED",
            },
          ],
          solution: [{ say: "An hour is 60 minutes, so half an hour is 30 minutes." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === write(Math.max(...p.times));
    if (question.archetype === "varied-form")
      return (
        chosenText(question) ===
        [...p.times]
          .sort((x, y) => x - y)
          .map(write)
          .join(", ")
      );
    return p.half > 30;
  },
});
