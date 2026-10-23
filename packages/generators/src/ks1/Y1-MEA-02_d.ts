/**
 * @statement Y1-MEA-02.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y1-MEA-02.d: Measure time
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

// Activities with the unit you would time them in.
const ACTIVITIES: [string, "seconds" | "minutes" | "hours"][] = [
  ["clap your hands 5 times", "seconds"],
  ["blink", "seconds"],
  ["brush your teeth", "minutes"],
  ["eat a sandwich", "minutes"],
  ["sleep at night", "hours"],
  ["spend a day at the seaside", "hours"],
];

interface Params {
  start: number;
  hours: number;
  activity: number;
}

export default defineGenerator<Params>({
  id: "Y1-MEA-02.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.COUNT-ON.INCLUDES-START", "MEA.TIME.FACTS"],

  params(rng, numbers) {
    return {
      start: rng.int(1, 6),
      hours: rng.int(2, numbers === "friendly" ? 3 : 5),
      activity: rng.int(0, ACTIVITIES.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const end = p.start + p.hours;
        return A.standard({
          question: `A school trip leaves at ${p.start} o'clock and gets back at ${end} o'clock.`,
          ask: "How many hours is the trip?",
          answer: A.number(p.hours, { units: "hours" }),
          wrong: wrongs(p.hours, [
            {
              code: "AS.COUNT-ON.INCLUDES-START",
              value: A.number(p.hours + 1, { units: "hours" }),
              feedback: `Count the hours from ${p.start} o'clock, not the numbers: ${Array.from({ length: p.hours }, (_, i) => p.start + i + 1).join(", ")}.`,
            },
          ]),
          solution: [{ say: `From ${p.start} o'clock to ${end} o'clock is ${p.hours} hours.` }],
        });
      }
      case 2: {
        const [what, unit] = ACTIVITIES[p.activity] ?? ACTIVITIES[0] ?? ["", "seconds"];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `You time how long it takes to ${what}.`,
          ask: "Which unit would you use?",
          correct: unit,
          distractors: (["seconds", "minutes", "hours", "days"] as const)
            .filter((u) => u !== unit)
            .map((u) => ({
              content: u,
              code: "MEA.TIME.FACTS",
              feedback: `Think how long it takes to ${what}: a few ${unit}.`,
            })),
          solution: [{ say: `It takes a few ${unit} to ${what}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: "Finn says a minute is longer than an hour.",
          truth: false,
          reasons: [
            {
              text: "False. There are 60 minutes in 1 hour, so an hour is much longer.",
              correct: true,
            },
            { text: "True. Minutes are longer than hours.", code: "MEA.TIME.FACTS" },
            { text: "True. A minute has more seconds in it.", code: "MEA.TIME.FACTS" },
          ],
          solution: [{ say: "1 hour is 60 minutes, and 1 minute is 60 seconds." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.hours;
    if (question.key.depth === 2) return chosenText(question) === ACTIVITIES[p.activity]?.[1];
    return true;
  },
});
