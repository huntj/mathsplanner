/**
 * @statement Y5-STA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-STA-02: Complete, read and interpret information in tables, including timetables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

export interface Params {
  /** Departure times from the first stop, in minutes after midnight, and minutes between stops. */
  starts: number[];
  gaps: number[];
  /** Depth 1: which bus; depth 2: arrive-by time at the last stop. */
  bus: number;
  arriveBy: number;
}

const STOPS = ["Park Road", "High Street", "Station", "Hospital"];
const clock = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

function timetable(p: Params) {
  const times = p.starts.map((s) =>
    STOPS.map((_, k) => s + p.gaps.slice(0, k).reduce((a, b) => a + b, 0)),
  );
  // {:} stops KaTeX spacing the colon as a relation.
  const rows = STOPS.map(
    (stop, k) =>
      `\\text{${stop}} & ${times.map((t) => clock(t[k] ?? 0).replace(":", "{:}")).join(" & ")}`,
  );
  const latex = `\\begin{array}{|l|${p.starts.map(() => "c").join("|")}|}\\hline ${rows.join(" \\\\ \\hline ")} \\\\ \\hline\\end{array}`;
  return { times, latex };
}

export default defineGenerator<Params>({
  id: "Y5-STA-02",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["MEA.TIME.DECIMAL"],

  params(rng) {
    const first = rng.int(7 * 12, 9 * 12) * 5;
    const every = rng.pick([20, 25, 30, 35]);
    const starts = [0, 1, 2].map((k) => first + k * every);
    const gaps = [rng.int(2, 5) * 5, rng.int(1, 4) * 5, rng.int(2, 6) * 5];
    const bus = rng.int(0, 2);
    const total = gaps.reduce((a, b) => a + b, 0);
    const arriveBy = (starts[1] ?? 0) + total + rng.int(1, every / 5 - 1) * 5;
    // The journey should cross an hour, where treating times as decimals goes wrong.
    const start = starts[bus] ?? 0;
    if (Math.floor(start / 60) === Math.floor((start + total) / 60))
      reject("a journey across an hour");
    return { starts, gaps, bus, arriveBy };
  },

  build(p, depth, rng): QuestionDraft {
    const { times, latex } = timetable(p);
    const intro = ["Here is part of a bus timetable.", A.displayMath(latex)];
    const t = times[p.bus] ?? [];
    const [from, to] = [t[0] ?? 0, t[3] ?? 0];
    const decimal = (a: number, b: number) =>
      Math.floor(b / 60) * 100 + (b % 60) - (Math.floor(a / 60) * 100 + (a % 60));
    switch (depth) {
      case 1:
        return A.standard({
          question: intro,
          ask: `How long does the ${clock(from)} bus from ${STOPS[0]} take to reach ${STOPS[3]}, in minutes?`,
          answer: A.number(to - from),
          wrong: wrongs(to - from, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number(decimal(from, to)),
              feedback:
                "There are 60 minutes in an hour, not 100. Count on to the next hour, then on to the arrival time.",
            },
          ]),
          solution: [{ say: `From ${clock(from)} to ${clock(to)} is ${to - from} minutes.` }],
        });
      case 2: {
        const ok = times
          .map((r, i) => [i, r[3] ?? 0] as const)
          .filter(([, arr]) => arr <= p.arriveBy);
        const best = ok.at(-1)?.[0] ?? 0;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: intro,
          ask: `Jo must be at ${STOPS[3]} by ${clock(p.arriveBy)}. Which is the latest bus she can catch from ${STOPS[0]}?`,
          correct: `the ${clock(times[best]?.[0] ?? 0)} bus`,
          distractors: times
            .map((r, i) => [i, r] as const)
            .filter(([i]) => i !== best)
            .map(([i, r]) => ({
              content: `the ${clock(r[0] ?? 0)} bus`,
              feedback:
                i > best
                  ? `It reaches ${STOPS[3]} at ${clock(r[3] ?? 0)}, which is too late.`
                  : "That gets there in time, but a later bus does too.",
            })),
          solution: [
            {
              say: `Read along the ${STOPS[3]} row: the latest arrival not after ${clock(p.arriveBy)} is from the ${clock(times[best]?.[0] ?? 0)} bus.`,
            },
          ],
        });
      }
      default: {
        const waitAt = (t[1] ?? 0) - 7;
        const ride = (t[3] ?? 0) - (t[1] ?? 0);
        return A.multiStepContext({
          context: [
            ...intro,
            ` Sam arrives at ${STOPS[1]} at ${clock(waitAt)} and catches the next bus to ${STOPS[3]}.`,
          ],
          parts: [
            { ask: "How long does Sam wait for the bus, in minutes?", answer: A.number(7) },
            {
              ask: `How long is the bus ride from ${STOPS[1]} to ${STOPS[3]}, in minutes?`,
              answer: A.number(ride),
              wrong: wrongs(ride, [
                {
                  code: "MEA.TIME.DECIMAL",
                  value: A.number(decimal(t[1] ?? 0, t[3] ?? 0)),
                  feedback: "Count in minutes: 60 minutes make an hour.",
                },
              ]),
            },
          ],
          solution: [
            { say: `The next bus leaves ${STOPS[1]} at ${clock(t[1] ?? 0)}: a wait of 7 minutes.` },
            { say: `It reaches ${STOPS[3]} at ${clock(t[3] ?? 0)}, ${ride} minutes later.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const { times } = timetable(p);
    const t = times[p.bus] ?? [];
    if (question.archetype === "standard")
      return numberAnswer(question) === (t[3] ?? 0) - (t[0] ?? 0);
    if (question.archetype === "varied-form") {
      const ok = times.filter((r) => (r[3] ?? 0) <= p.arriveBy);
      return chosenText(question) === `the ${clock(ok.at(-1)?.[0] ?? 0)} bus`;
    }
    return numberAnswer(question, 1) === (t[3] ?? 0) - (t[1] ?? 0);
  },
});
