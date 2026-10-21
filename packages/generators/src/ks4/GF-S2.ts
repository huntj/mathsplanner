/**
 * @statement GF-S2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-S2: Interpret and construct tables, charts and diagrams for categorical, discrete and time
// series data
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { lineGraph } from "../shared/sta.ts";

interface Params {
  /** Noon temperatures on days 1 to 8, in even degrees. */
  temps: number[];
  /** Depth 1: the day to read. Depth 2: the two days compared. */
  day: number;
  from: number;
  to: number;
}

const DAYS = [1, 2, 3, 4, 5, 6, 7, 8];

const graph = (temps: number[]): CartesianSpec =>
  lineGraph(
    DAYS.map((d, i) => [d, temps[i] ?? 0]),
    { min: 0, max: 9, step: 1, label: "day" },
    { min: 0, max: 24, step: 2, label: "temperature (°C)" },
    "A time series line graph of the noon temperature over eight days.",
  );

export default defineGenerator<Params>({
  id: "GF-S2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.SCALE.READ", "AS.MULTISTEP.ONE-STEP"],

  params(rng) {
    const temps = DAYS.map(() => 2 * rng.int(2, 11));
    const t = (i: number) => temps[i] ?? 0;
    const dips = DAYS.slice(1).filter((_, i) => t(i + 1) < t(i)).length;
    const from = rng.int(0, 6);
    const to = rng.int(from + 1, 7);
    // A warmer last day with at least one dip makes the depth 4 claim tempting but false.
    if (t(7) <= t(0) || dips === 0 || t(to) <= t(from))
      reject("a rise overall with a dip on the way");
    return { temps, day: rng.int(1, 8), from: from + 1, to: to + 1 };
  },

  build(p, depth, rng): QuestionDraft {
    const t = (d: number) => p.temps[d - 1] ?? 0;
    const intro = [
      "The graph shows the temperature at noon over eight days.",
      A.figure(graph(p.temps)),
    ];
    switch (depth) {
      case 1: {
        const v = t(p.day);
        return A.standard({
          question: intro,
          ask: `What was the temperature on day ${p.day}?`,
          answer: A.number(v, { units: "°C" }),
          wrong: wrongs(v, [
            {
              code: "STA.SCALE.READ",
              value: A.number(v / 2, { units: "°C" }),
              feedback: "Each grid line on the temperature axis is worth 2 °C.",
            },
          ]),
          solution: [{ say: `Go up from day ${p.day} to the point, then across: ${v} °C.` }],
        });
      }
      case 2: {
        const rise = t(p.to) - t(p.from);
        return A.variedForm({
          rng,
          forms: [
            {
              question: intro,
              ask: `By how many degrees did the temperature rise from day ${p.from} to day ${p.to}?`,
            },
            {
              question: intro,
              ask: `How much warmer was it on day ${p.to} than on day ${p.from}?`,
            },
          ],
          answer: A.number(rise, { units: "°C" }),
          wrong: wrongs(rise, [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(t(p.to), { units: "°C" }),
              feedback: `That is the temperature on day ${p.to}. Subtract day ${p.from}'s temperature.`,
            },
          ]),
          solution: [{ say: `${t(p.to)} − ${t(p.from)} = ${rise} °C.` }],
        });
      }
      default: {
        const dip = DAYS.slice(1).find((d) => t(d) < t(d - 1)) ?? 2;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            ...intro,
            "Ella says the temperature rose every day, because day 8 was warmer than day 1.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. It fell from day ${dip - 1} to day ${dip}. A rise overall does not mean a rise every day.`,
              correct: true,
            },
            { text: "True. The last point is higher than the first." },
            { text: "True. A line graph always goes up over time." },
          ],
          solution: [
            {
              say: "Check each line segment: a downward segment is a fall from one day to the next.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const t = (d: number) => p.temps[d - 1] ?? 0;
    if (question.key.depth === 1) return numberAnswer(question) === t(p.day);
    if (question.key.depth === 2) return numberAnswer(question) === t(p.to) - t(p.from);
    return true;
  },
});
