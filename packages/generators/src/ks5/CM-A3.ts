/**
 * @statement CM-A3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-A3: Construct and interpret histograms with equal and unequal class intervals and cumulative
// frequency graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  f: number;
  w: number;
  lo: number;
  fd: number;
  w2: number;
}

export default defineGenerator<Params>({
  id: "CM-A3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.HISTOGRAM.HEIGHT"],

  params(rng) {
    const p = {
      f: rng.int(6, 60),
      w: rng.pick([5, 10, 20, 25, 40]),
      lo: 5 * rng.int(2, 20),
      fd: round(rng.int(4, 40) / 10, 1),
      w2: rng.pick([5, 10, 15, 20, 30]),
    };
    if (p.w === 1 || !Number.isInteger(p.fd * p.w2 * 10) || p.fd * p.w2 !== Math.round(p.fd * p.w2))
      reject("whole-number frequencies");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = round(p.f / p.w, 2);
        return A.standard({
          question: [
            `In a survey of commuting times, ${p.f} people took between ${p.lo} and ${p.lo + p.w} minutes.`,
          ],
          ask: "Find the frequency density for this class, to 2 decimal places.",
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "STA.HISTOGRAM.HEIGHT",
              value: A.number(p.f, { accuracy: { dp: 2 } }),
              feedback: `Frequency density = frequency ÷ class width = ${p.f} ÷ ${p.w}.`,
            },
          ]),
          solution: [{ say: "", math: `\\frac{${p.f}}{${p.w}} = ${v}` }],
        });
      }
      case 2: {
        const v = round(p.fd * p.w2, 0);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `On a histogram of commuting times, the bar for ${p.lo} to ${p.lo + p.w2} minutes has a frequency density of ${p.fd}.`,
              ],
              ask: "How many people are in this class?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.HISTOGRAM.HEIGHT",
              value: A.number(p.fd),
              feedback: `The area of the bar is the frequency: ${p.fd} × ${p.w2}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.fd} \\times ${p.w2} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Fred says the tallest bar on a histogram with unequal class widths always shows the class with the most people.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The height is frequency density; the area shows the frequency. A short, wide bar can hold more people than a tall, narrow one.",
              correct: true,
            },
            {
              text: "True. Taller bars always mean higher frequencies.",
              code: "STA.HISTOGRAM.HEIGHT",
            },
            { text: "True. The vertical axis shows frequency.", code: "STA.HISTOGRAM.HEIGHT" },
          ],
          solution: [{ say: "Frequency = frequency density × class width." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === round(p.f / p.w, 2);
    if (question.key.depth === 2) return numberAnswer(question) === Math.round(p.fd * p.w2);
    return true;
  },
});
