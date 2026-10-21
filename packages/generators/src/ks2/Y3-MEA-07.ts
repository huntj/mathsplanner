/**
 * @statement Y3-MEA-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-MEA-07: Compare durations of events, for example to calculate the time taken by particular
// events or tasks
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { digital } from "../shared/mea.ts";

interface Params {
  /** Minutes after midnight. */
  start: number;
  length: number;
  other: [number, number];
}

const t = (m: number) => digital(Math.floor(m / 60), m % 60);
/** The gap a student gets treating times as decimals, e.g. 9:50 to 10:05 as 1005 − 950 = 55. */
const decimalGap = (a: number, b: number) => {
  const n = (m: number) => Math.floor(m / 60) * 100 + (m % 60);
  return n(b) - n(a);
};

export default defineGenerator<Params>({
  id: "Y3-MEA-07",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["MEA.TIME.DECIMAL", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const step = numbers === "friendly" ? 5 : 1;
    const start = rng.int(8, 10) * 60 + rng.int(Math.ceil(30 / step), Math.floor(55 / step)) * step;
    const length = rng.int(Math.ceil(15 / step), Math.floor(55 / step)) * step;
    if ((start % 60) + length < 60) reject("an interval that crosses the hour");
    const other = [rng.int(13, 15) * 60 + rng.int(0, 11) * 5, rng.int(20, 70)] as [number, number];
    if (other[1] === length) reject("two different durations");
    return { start, length, other };
  },

  build(p, depth, rng): QuestionDraft {
    const end = p.start + p.length;
    switch (depth) {
      case 1:
        return A.standard({
          question: `A swimming lesson starts at ${t(p.start)} and ends at ${t(end)}.`,
          ask: "How many minutes does it last?",
          answer: A.number(p.length, { units: "minutes" }),
          wrong: wrongs(p.length, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number(decimalGap(p.start, end), { units: "minutes" }),
              feedback:
                "An hour has 60 minutes, not 100. Count on to the next o'clock, then on again.",
            },
          ]),
          solution: [
            {
              say: `${t(p.start)} to ${t(Math.ceil(p.start / 60) * 60)} is ${60 - (p.start % 60)} minutes, then ${end % 60} more: ${p.length} minutes.`,
            },
          ],
        });
      case 2: {
        const right = t(end);
        const asDecimal = `${Math.floor(p.start / 60)}:${(p.start % 60) + p.length}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A film starts at ${t(p.start)} and lasts ${p.length} minutes.`,
          ask: "What time does it end?",
          correct: right,
          distractors: [
            {
              content: asDecimal,
              code: "MEA.TIME.DECIMAL",
              feedback:
                "There are only 60 minutes in an hour, so the time passes the next o'clock.",
            },
            {
              content: t(end + 40),
              code: "MEA.TIME.DECIMAL",
              feedback: "Count on 60 minutes to the hour, not 100.",
            },
            { content: t(end - 60), feedback: "Passing the o'clock moves the hour on." },
          ],
          solution: [
            {
              say: `${60 - (p.start % 60)} minutes takes it to ${t(Math.ceil(p.start / 60) * 60)}, then ${end % 60} more: ${right}.`,
            },
          ],
        });
      }
      case 4: {
        const [s2, l2] = p.other;
        const truth = p.length > l2;
        return A.trueOrFalseWhy({
          rng,
          statement: `Task A takes from ${t(p.start)} to ${t(end)}. Task B takes from ${t(s2)} to ${t(s2 + l2)}. Raj says task A takes longer.`,
          truth,
          reasons: [
            {
              text: `${truth ? "True" : "False"}. Task A takes ${p.length} minutes and task B takes ${l2} minutes.`,
              correct: true,
            },
            { text: `${truth ? "False" : "True"}. The task that ends later takes longer.` },
            {
              text: `${truth ? "False" : "True"}. Take the start from the end like ordinary numbers: ${decimalGap(p.start, end)} and ${decimalGap(s2, s2 + l2)}.`,
              code: "MEA.TIME.DECIMAL",
            },
          ],
          solution: [{ say: `A: ${p.length} minutes. B: ${l2} minutes.` }],
        });
      }
      default: {
        const back = 2 * p.length;
        return A.multiStepContext({
          context: `A bus leaves at ${t(p.start)} and arrives at ${t(end)}. The journey home takes twice as long.`,
          parts: [
            {
              ask: "How many minutes does the journey there take?",
              answer: A.number(p.length, { units: "minutes" }),
              wrong: wrongs(p.length, [
                {
                  code: "MEA.TIME.DECIMAL",
                  value: A.number(decimalGap(p.start, end)),
                  feedback: "60 minutes in an hour, not 100.",
                },
              ]),
            },
            {
              ask: "How many minutes does the journey home take?",
              answer: A.number(back, { units: "minutes" }),
              wrong: wrongs(back, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number(p.length + 2),
                  feedback: "Twice as long means double it.",
                },
              ]),
            },
          ],
          solution: [
            { say: `${t(p.start)} to ${t(end)} is ${p.length} minutes.` },
            { say: `2 × ${p.length} = ${back} minutes.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.length;
    if (question.archetype === "varied-form") return chosenText(question) === t(p.start + p.length);
    if (question.archetype === "multi-step-context")
      return numberAnswer(question, 1) === 2 * p.length;
    return true;
  },
});
