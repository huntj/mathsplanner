/**
 * @statement Y3-MEA-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-MEA-05: Estimate and read time with increasing accuracy to the nearest minute; record and
// compare time in terms of seconds, minutes and hours; use vocabulary such as o'clock, am/pm,
// morning, afternoon, noon and midnight
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { ampm, clock, digital, h12 } from "../shared/mea.ts";

export interface Params {
  hour: number;
  minutes: number;
  /** Depth 2: a time just before noon or midnight, and minutes added. */
  start: number;
  add: number;
  claim: number;
}

const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "12 noon is written 12:00 pm.",
    truth: true,
    why: "Noon is the start of the afternoon, so it is 12:00 pm.",
  },
  {
    text: "Midnight is written 12:00 pm.",
    truth: false,
    why: "Midnight starts a new day in the morning, so it is 12:00 am.",
  },
  {
    text: "9:30 am is in the evening.",
    truth: false,
    why: "am times are between midnight and noon: morning.",
  },
  {
    text: "3:15 pm is in the afternoon.",
    truth: true,
    why: "pm times are after noon; 3:15 pm is in the afternoon.",
  },
];

export default defineGenerator<Params>({
  id: "Y3-MEA-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.CLOCK.MINUTE-NUMBER", "MEA.CLOCK.HOUR-AHEAD", "MEA.TIME.24-HOUR"],

  params(rng, numbers) {
    const minutes = rng.int(1, 59);
    if (minutes % 5 === 0 && numbers !== "friendly") reject("a time between the five-minute marks");
    const start = rng.pick([11, 23]) * 60 + rng.int(35, 55);
    return {
      hour: rng.int(1, 12),
      minutes,
      start,
      add: rng.int(10, 40),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = digital(p.hour, p.minutes);
        const ones = p.minutes % 10;
        const misread = Math.floor(p.minutes / 5);
        return A.choice({
          rng,
          question: [
            "What time does the clock show, to the nearest minute?",
            A.figure(clock(p.hour, p.minutes)),
          ],
          correct: right,
          distractors: [
            {
              content: digital(p.hour, misread),
              code: "MEA.CLOCK.MINUTE-NUMBER",
              feedback: `The minute hand is just past ${misread}, which is ${misread * 5} minutes. Count on the small marks from there.`,
            },
            {
              content: digital(p.hour + 1, p.minutes),
              code: "MEA.CLOCK.HOUR-AHEAD",
              feedback: `The hour hand has passed ${h12(p.hour)} but not reached ${h12(p.hour + 1)}.`,
            },
            {
              content: digital(p.hour, (p.minutes - ones + (10 - ones)) % 60),
              feedback: "Count the small minute marks carefully.",
            },
          ].filter(
            (d, i, all) =>
              d.content !== right && all.findIndex((e) => e.content === d.content) === i,
          ),
          solution: [
            {
              say: `The minute hand is ${p.minutes} minutes past the 12 and the hour hand is just past ${h12(p.hour)}: ${right}.`,
            },
          ],
        });
      }
      case 2: {
        const end = p.start + p.add;
        const right = ampm(Math.floor(end / 60), end % 60);
        const sameHalf = right.endsWith("am")
          ? right.replace("am", "pm")
          : right.replace("pm", "am");
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A show starts at ${ampm(Math.floor(p.start / 60), p.start % 60)} and lasts ${p.add} minutes.`,
          ask: "What time does it finish?",
          correct: right,
          distractors: [
            {
              content: sameHalf,
              code: "MEA.TIME.24-HOUR",
              feedback: `Passing ${Math.floor(p.start / 60) === 11 ? "noon" : "midnight"} changes ${Math.floor(p.start / 60) === 11 ? "am to pm" : "pm to am"}.`,
            },
            {
              content: ampm(Math.floor(p.start / 60), (p.start % 60) + p.add - 60),
              feedback: "Passing the hour moves the hour on by one.",
            },
          ].filter((d) => d.content !== right),
          solution: [
            {
              say: `${60 - (p.start % 60)} minutes takes it to ${Math.floor(p.start / 60) === 11 ? "12 noon" : "midnight"}, then ${p.add - 60 + (p.start % 60)} more minutes: ${right}.`,
            },
          ],
        });
      }
      default: {
        const c = (CLAIMS[p.claim] ?? CLAIMS[0]) as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Nia says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. am means afternoon and pm means morning.`,
              code: "MEA.TIME.24-HOUR",
            },
            {
              text: `${c.truth ? "False" : "True"}. Noon and midnight are both 12:00 am.`,
              code: "MEA.TIME.24-HOUR",
            },
          ],
          solution: [{ say: "am runs from midnight to noon; pm runs from noon to midnight." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return chosenText(question) === digital(p.hour, p.minutes);
    if (question.archetype === "varied-form") {
      const end = p.start + p.add;
      return chosenText(question) === ampm(Math.floor(end / 60), end % 60);
    }
    return true;
  },
});
