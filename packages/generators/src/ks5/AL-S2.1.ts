/**
 * @statement AL-S2.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S2.1: Interpret histograms, frequency polygons, box plots and cumulative frequency diagrams
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  freqs: number[];
}

const BOUNDS = [0, 10, 20, 30, 40, 50];

/** Cumulative totals at each upper bound, starting from 0 at the lowest bound. */
const cum = (freqs: number[]) =>
  freqs.reduce<number[]>((acc, f) => [...acc, (acc[acc.length - 1] ?? 0) + f], [0]);

/** The x where the cumulative frequency polygon reaches height h. */
function readAt(freqs: number[], h: number): number {
  const c = cum(freqs);
  for (let i = 1; i < c.length; i++) {
    const lo = c[i - 1] ?? 0;
    const hi = c[i] ?? 0;
    if (h <= hi) return (BOUNDS[i - 1] ?? 0) + ((h - lo) / (hi - lo)) * 10;
  }
  return 50;
}

function graph(freqs: number[]): CartesianSpec {
  const c = cum(freqs);
  const n = c[c.length - 1] ?? 0;
  const top = 10 * Math.ceil(n / 10);
  const pts = BOUNDS.map((x, i) => [x, c[i] ?? 0] as [number, number]);
  return {
    type: "cartesian",
    x: { min: 0, max: 50, step: 10, label: "\\text{time (minutes)}" },
    y: { min: 0, max: top, step: top > 50 ? 10 : 5, label: "\\text{cumulative frequency}" },
    grid: true,
    segments: pts.slice(1).map((to, i) => ({ from: pts[i] ?? to, to })),
    points: pts.slice(1).map((at) => ({ at })),
    description: "A cumulative frequency polygon for times from 0 to 50 minutes.",
  };
}

export default defineGenerator<Params>({
  id: "AL-S2.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.CUMFREQ.READ"],

  params(rng) {
    const freqs = [rng.int(2, 8), rng.int(6, 16), rng.int(10, 22), rng.int(6, 16), rng.int(2, 8)];
    const n = freqs.reduce((s, f) => s + f, 0);
    if (n % 4 !== 0) reject("a total divisible by 4");
    if (Math.abs(readAt(freqs, n / 2) - n / 2) < 3 || Math.abs(readAt(freqs, n / 4) - n / 4) < 3)
      reject("a reading that differs from the height");
    const iqr = Math.round(readAt(freqs, (3 * n) / 4)) - Math.round(readAt(freqs, n / 4));
    if (Math.abs(iqr - n / 2) < 5) reject("an IQR that differs from half the total");
    return { freqs };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.freqs.reduce((s, f) => s + f, 0);
    const intro = [
      "The cumulative frequency diagram shows how long some people took to finish a task.",
      A.figure(graph(p.freqs)),
    ];
    switch (depth) {
      case 1: {
        const med = Math.round(readAt(p.freqs, n / 2));
        return A.standard({
          question: intro,
          ask: "Estimate the median time.",
          answer: A.number(med, { units: "minutes", accuracy: { tolerance: 1 } }),
          wrong: wrongs(med, [
            {
              code: "STA.CUMFREQ.READ",
              value: A.number(n / 2, { units: "minutes", accuracy: { tolerance: 1 } }),
              feedback: `Read across at a cumulative frequency of ${n / 2}, then down to the time axis.`,
            },
          ]),
          solution: [
            { say: `There are ${n} people, so read across at ${n / 2}: about ${med} minutes.` },
          ],
        });
      }
      case 2: {
        const lq = Math.round(readAt(p.freqs, n / 4));
        const uq = Math.round(readAt(p.freqs, (3 * n) / 4));
        return A.variedForm({
          rng,
          forms: [{ question: intro, ask: "Estimate the interquartile range." }],
          answer: A.number(uq - lq, { units: "minutes", accuracy: { tolerance: 2 } }),
          wrong: wrongs(uq - lq, [
            {
              code: "STA.CUMFREQ.READ",
              value: A.number(n / 2, { units: "minutes", accuracy: { tolerance: 2 } }),
              feedback: `Read the times at cumulative frequencies ${n / 4} and ${(3 * n) / 4}, then subtract.`,
            },
          ]),
          solution: [
            { say: `Lower quartile ≈ ${lq}, upper quartile ≈ ${uq}: IQR ≈ ${uq - lq} minutes.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            ...intro,
            ` Pam says the median is ${n / 2} minutes, because there are ${n} people.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${n / 2} is the cumulative frequency to read across at; the median is the time where the graph reaches that height.`,
              correct: true,
            },
            { text: "True. The median is half the total.", code: "STA.CUMFREQ.READ" },
            { text: "True. Read the vertical axis.", code: "STA.CUMFREQ.READ" },
          ],
          solution: [
            {
              say: "Go across from n/2 on the vertical axis to the curve, then down to the horizontal axis.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const n = p.freqs.reduce((s, f) => s + f, 0);
    if (question.key.depth === 1)
      return numberAnswer(question) === Math.round(readAt(p.freqs, n / 2));
    return true;
  },
});
