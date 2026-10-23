/**
 * @statement AL-S2.1.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-S2.1.a: Interpret histograms and frequency polygons
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  /** Frequency densities for classes of width 10, 20 and 5; the last bar is the tallest. */
  fd: [number, number, number];
}

const CLASSES: [string, number][] = [
  ["0 to under 10", 10],
  ["10 to under 30", 20],
  ["30 to under 35", 5],
];

export default defineGenerator<Params>({
  id: "AL-S2.1.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.HISTOGRAM.HEIGHT"],

  params(rng) {
    return {
      fd: [rng.int(2, 9) / 2, rng.int(2, 8) / 2, rng.int(5, 9)] as [number, number, number],
    };
  },

  build(p, depth, rng): QuestionDraft {
    const freqs = CLASSES.map(([, w], i) => w * (p.fd[i] ?? 0));
    const table = A.displayMath(
      tableLatex(
        ["Time, t (min)", "Frequency density"],
        CLASSES.map(([c], i) => [c, p.fd[i] ?? 0]),
      ),
    );
    switch (depth) {
      case 1: {
        const f = freqs[1] ?? 0;
        return A.standard({
          question: ["A histogram of journey times has these bars.", table],
          ask: "How many journeys took from 10 to 30 minutes?",
          answer: A.number(f),
          wrong: wrongs(f, [
            {
              code: "STA.HISTOGRAM.HEIGHT",
              value: A.number(p.fd[1] ?? 0),
              feedback:
                "In a histogram the area is the frequency: frequency = class width × frequency density.",
            },
          ]),
          solution: [{ say: "", math: `20 \\times ${p.fd[1]} = ${f}` }],
        });
      }
      case 2: {
        const total = freqs.reduce((s, x) => s + x, 0);
        return A.standard({
          question: ["A histogram of journey times has these bars.", table],
          ask: "How many journeys are shown altogether?",
          answer: A.number(total),
          wrong: wrongs(total, [
            {
              code: "STA.HISTOGRAM.HEIGHT",
              value: A.number(p.fd.reduce((s, x) => s + x, 0)),
              feedback: "Add the areas of the bars, not their heights.",
            },
          ]),
          solution: [{ say: `${freqs.join(" + ")} = ${total}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "A histogram of journey times has these bars.",
            table,
            " Ben says the 30 to 35 minute class has the most journeys, because its bar is the tallest.",
          ],
          truth: (freqs[2] ?? 0) > Math.max(freqs[0] ?? 0, freqs[1] ?? 0),
          reasons:
            (freqs[2] ?? 0) > Math.max(freqs[0] ?? 0, freqs[1] ?? 0)
              ? [
                  {
                    text: `True, but not because of the height: its area, 5 × ${p.fd[2]} = ${freqs[2]}, is the biggest.`,
                    correct: true,
                  },
                  {
                    text: "False. Narrow classes never have the most values.",
                    code: "STA.HISTOGRAM.HEIGHT",
                  },
                  { text: "False. You cannot read frequencies from a histogram." },
                ]
              : [
                  {
                    text: `False. Frequency is the area: the classes have ${freqs.join(", ")} journeys, so the tallest bar is not the biggest class.`,
                    correct: true,
                  },
                  {
                    text: "True. The tallest bar always has the highest frequency.",
                    code: "STA.HISTOGRAM.HEIGHT",
                  },
                  {
                    text: "True. The height of a bar is its frequency.",
                    code: "STA.HISTOGRAM.HEIGHT",
                  },
                ],
          solution: [
            {
              say: "In a histogram, frequency = class width × frequency density, the area of the bar.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const freqs = CLASSES.map(([, w], i) => w * (p.fd[i] ?? 0));
    if (question.key.depth === 1) return numberAnswer(question) === freqs[1];
    if (question.key.depth === 2)
      return numberAnswer(question) === freqs.reduce((s, x) => s + x, 0);
    return true;
  },
});
