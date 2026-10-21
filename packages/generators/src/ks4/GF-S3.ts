/**
 * @statement GF-S3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-S3: Construct and interpret diagrams for grouped discrete and continuous data, including
// histograms with equal class intervals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { groupedTable } from "../shared/sta.ts";

interface Params {
  freqs: number[];
  /** Depth 1: count the times above this class boundary. */
  cut: number;
}

/** Classes 10 < t ≤ 20 up to 50 < t ≤ 60; the first starts at 10, clear of the origin label. */
const LOWS = [10, 20, 30, 40, 50];
const WIDTH = 10;
const HEADING = "\\text{time } (t \\text{ minutes})";
const cls = (lo: number) => `${lo} < t ≤ ${lo + WIDTH}`;

function histogram(freqs: number[]): CartesianSpec {
  const top = 2 * Math.ceil(Math.max(...freqs) / 2) + 2;
  return {
    type: "cartesian",
    x: { min: 0, max: 70, step: 10, label: "\\text{time (minutes)}" },
    y: { min: 0, max: top, step: 2, label: "\\text{frequency}" },
    grid: true,
    polygons: LOWS.map((lo, i) => ({
      vertices: [
        [lo, 0],
        [lo + WIDTH, 0],
        [lo + WIDTH, freqs[i] ?? 0],
        [lo, freqs[i] ?? 0],
      ],
      shaded: true,
    })),
    description: "A histogram with equal class widths of 10 minutes, from 10 to 60 minutes.",
  };
}

export default defineGenerator<Params>({
  id: "GF-S3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["AS.MULTISTEP.ONE-STEP", "STA.MODE.FREQUENCY"],

  params(rng) {
    const freqs = LOWS.map(() => rng.int(2, 16));
    const max = Math.max(...freqs);
    if (freqs.filter((f) => f === max).length > 1) reject("a single modal class");
    return { freqs, cut: rng.pick([30, 40]) };
  },

  build(p, depth, rng): QuestionDraft {
    const intro = "The histogram shows how long some people took to finish a puzzle.";
    switch (depth) {
      case 1: {
        const above = LOWS.map((lo, i) => (lo >= p.cut ? (p.freqs[i] ?? 0) : 0)).reduce(
          (a, b) => a + b,
          0,
        );
        const next = p.freqs[LOWS.indexOf(p.cut)] ?? 0;
        return A.standard({
          question: [intro, A.figure(histogram(p.freqs))],
          ask: `How many people took more than ${p.cut} minutes?`,
          answer: A.number(above),
          wrong: [
            {
              code: "AS.MULTISTEP.ONE-STEP",
              value: A.number(next),
              feedback: `Add the frequencies of every bar above ${p.cut} minutes, not just the first.`,
            },
          ],
          solution: [{ say: `Add the bars from ${p.cut} minutes up: ${above} people.` }],
        });
      }
      case 2: {
        const max = Math.max(...p.freqs);
        const modal = LOWS[p.freqs.indexOf(max)] ?? 10;
        const other = LOWS.find((lo) => lo !== modal) ?? 10;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The table shows how long some people took to finish a puzzle.",
            A.displayMath(groupedTable("t", HEADING, LOWS, WIDTH, p.freqs)),
          ],
          ask: "What is the modal class?",
          correct: cls(modal),
          distractors: [
            {
              content: String(max),
              code: "STA.MODE.FREQUENCY",
              feedback:
                "That is the highest frequency. The modal class is the class it belongs to.",
            },
            { content: cls(other), feedback: "The modal class has the highest frequency." },
          ],
          solution: [{ say: `The highest frequency is ${max}, in the class ${cls(modal)}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            intro,
            A.figure(histogram(p.freqs)),
            "Raj says the slowest person took exactly 60 minutes.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The data are grouped: we only know the slowest time was more than 50 and at most 60 minutes.",
              correct: true,
            },
            { text: "True. The last bar ends at 60 minutes." },
            { text: "True. The x-axis goes beyond 60, so 60 must be the largest value." },
          ],
          solution: [
            {
              say: "Grouping loses the exact values; each value is only known to lie in its class.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) {
      return (
        numberAnswer(question) ===
        LOWS.reduce((t, lo, i) => t + (lo >= p.cut ? (p.freqs[i] ?? 0) : 0), 0)
      );
    }
    if (question.key.depth === 2)
      return chosenText(question) === cls(LOWS[p.freqs.indexOf(Math.max(...p.freqs))] ?? 10);
    return true;
  },
});
