/**
 * @statement GH-S3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-S3: Construct and interpret histograms with unequal class intervals and cumulative frequency
// graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

/** Classes 10–20, 20–25, 25–30, 30–40, 40–60 minutes: widths 10, 5, 5, 10, 20. */
const EDGES = [10, 20, 25, 30, 40, 60];

interface Params {
  /** Frequency densities, in steps of 0.2, so every frequency is a whole number. */
  fd: number[];
  /** The class asked about. */
  cls: number;
}

const width = (i: number) => (EDGES[i + 1] ?? 0) - (EDGES[i] ?? 0);
const freq = (p: Params, i: number) => Math.round((p.fd[i] ?? 0) * width(i));
const name = (i: number) => `${EDGES[i]} < t ≤ ${EDGES[i + 1]}`;

function histogram(p: Params): CartesianSpec {
  const top = Math.ceil(Math.max(...p.fd) + 0.4);
  return {
    type: "cartesian",
    x: { min: 0, max: 70, step: 10, label: "\\text{time (minutes)}" },
    y: { min: 0, max: top, step: top > 5 ? 1 : 0.5, label: "\\text{frequency density}" },
    grid: true,
    polygons: p.fd.map((d, i) => ({
      vertices: [
        [EDGES[i] ?? 0, 0],
        [EDGES[i + 1] ?? 0, 0],
        [EDGES[i + 1] ?? 0, d],
        [EDGES[i] ?? 0, d],
      ] as [number, number][],
      shaded: true,
    })),
    description:
      "A histogram with unequal class widths between 10 and 60 minutes; the vertical axis is frequency density.",
  };
}

export default defineGenerator<Params>({
  id: "GH-S3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.HISTOGRAM.HEIGHT"],

  params(rng) {
    // Halves on a grid of 0.5 keep the bars readable; widths 5, 10 or 20 make whole frequencies.
    const fd = EDGES.slice(1).map(() => rng.int(1, 9) / 2);
    const freqs = fd.map((d, i) => d * width(i));
    // The tallest bar must not also hold the most people, so the depth 4 claim is clearly false.
    if (
      fd.indexOf(Math.max(...fd)) === freqs.indexOf(Math.max(...freqs)) ||
      fd.filter((d) => d === Math.max(...fd)).length > 1
    ) {
      reject("a tallest bar that is not the biggest class");
    }
    return { fd, cls: rng.pick([0, 3, 4]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const f = freq(p, p.cls);
        const d = f / width(p.cls);
        return A.standard({
          question: `In a survey, ${f} people took between ${EDGES[p.cls]} and ${EDGES[p.cls + 1]} minutes (${name(p.cls)}) to get to work.`,
          ask: "Work out the frequency density for this class, to draw it on a histogram.",
          answer: A.number(d),
          wrong: wrongs(d, [
            {
              code: "STA.HISTOGRAM.HEIGHT",
              value: A.number(f),
              feedback: `Frequency density = frequency ÷ class width = ${f} ÷ ${width(p.cls)}.`,
            },
          ]),
          solution: [{ say: `${f} ÷ ${width(p.cls)} = ${d}.` }],
        });
      }
      case 2: {
        const f = freq(p, p.cls);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The histogram shows how long some people took to get to work.",
                A.figure(histogram(p)),
              ],
              ask: `How many people took ${name(p.cls)} minutes?`,
            },
            {
              question: ["The histogram shows journey times to work.", A.figure(histogram(p))],
              ask: `Work out the frequency of the class ${name(p.cls)}.`,
            },
          ],
          answer: A.number(f),
          wrong: wrongs(f, [
            {
              code: "STA.HISTOGRAM.HEIGHT",
              value: A.number(p.fd[p.cls] ?? 0),
              feedback: `The height is the frequency density. Frequency = density × width = ${p.fd[p.cls]} × ${width(p.cls)}.`,
            },
          ]),
          solution: [{ say: `${p.fd[p.cls]} × ${width(p.cls)} = ${f} people.` }],
        });
      }
      default: {
        const tallest = p.fd.indexOf(Math.max(...p.fd));
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "The histogram shows how long some people took to get to work.",
            A.figure(histogram(p)),
            `Zoe says the class ${name(tallest)} must have the most people because its bar is tallest.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. With unequal widths the area shows the frequency, not the height. A wider, shorter bar can hold more people.",
              correct: true,
            },
            {
              text: "True. The tallest bar always has the highest frequency.",
              code: "STA.HISTOGRAM.HEIGHT",
            },
            {
              text: "True. Read the frequency from the vertical axis.",
              code: "STA.HISTOGRAM.HEIGHT",
            },
          ],
          solution: [
            { say: `Frequencies: ${p.fd.map((_, i) => `${name(i)}: ${freq(p, i)}`).join("; ")}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === freq(p, p.cls);
    return true;
  },
});
