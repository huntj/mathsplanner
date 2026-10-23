/**
 * @statement GH-S3.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-S3.a: Construct and interpret histograms with unequal class intervals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

const EDGES = [0, 10, 15, 20, 30, 50];

export interface Params {
  fd: number[];
  cls: number;
  w: number;
  k: number;
}

const width = (i: number) => (EDGES[i + 1] ?? 0) - (EDGES[i] ?? 0);

function histogram(fd: number[]): CartesianSpec {
  return {
    type: "cartesian",
    x: { min: 0, max: 50, step: 5, label: "\\text{time (minutes)}" },
    y: { min: 0, max: 8, step: 1, label: "\\text{frequency density}" },
    grid: true,
    polygons: fd.map((d, i) => ({
      vertices: [
        [EDGES[i] ?? 0, 0],
        [EDGES[i + 1] ?? 0, 0],
        [EDGES[i + 1] ?? 0, d],
        [EDGES[i] ?? 0, d],
      ] as [number, number][],
      shaded: true,
    })),
    description: "A histogram with unequal class widths; the vertical axis is frequency density.",
  };
}

export default defineGenerator<Params>({
  id: "GH-S3.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.HISTOGRAM.HEIGHT"],

  params(rng) {
    return {
      fd: EDGES.slice(1).map(() => rng.int(1, 7)),
      cls: rng.int(0, EDGES.length - 2),
      w: rng.pick([5, 10, 20, 25]),
      k: rng.int(2, 9),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const f = p.w * p.k;
        return A.standard({
          question: [
            `A class of a grouped frequency table is ${p.w} units wide and has frequency ${f}.`,
          ],
          ask: "Find the height of its bar on a histogram (its frequency density).",
          answer: A.number(p.k),
          wrong: wrongs(p.k, [
            {
              code: "STA.HISTOGRAM.HEIGHT",
              value: A.number(f),
              feedback:
                "With unequal classes the height is frequency density: frequency ÷ class width.",
            },
          ]),
          solution: [{ say: "", math: `${f} \\div ${p.w} = ${p.k}` }],
        });
      }
      case 2: {
        const d = p.fd[p.cls] ?? 1;
        const v = d * width(p.cls);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The histogram shows how long some people waited for a bus.",
                A.figure(histogram(p.fd)),
              ],
              ask: `How many people waited more than ${EDGES[p.cls]} and up to ${EDGES[p.cls + 1]} minutes?`,
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "STA.HISTOGRAM.HEIGHT",
              value: A.number(d),
              feedback: `The height is frequency density. Multiply by the class width, ${width(p.cls)}.`,
            },
          ]),
          solution: [
            {
              say: "Frequency = frequency density × class width: ",
              math: `${d} \\times ${width(p.cls)} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Gil says the tallest bar in a histogram with unequal class widths always has the biggest frequency.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Frequency is the area of the bar. A short, wide bar can hold more than a tall, thin one.",
              correct: true,
            },
            { text: "True. Height shows the frequency.", code: "STA.HISTOGRAM.HEIGHT" },
            { text: "True. Taller bars are always bigger.", code: "STA.HISTOGRAM.HEIGHT" },
          ],
          solution: [{ say: "Compare areas, not heights." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k;
    if (question.key.depth === 2)
      return numberAnswer(question) === (p.fd[p.cls] ?? 1) * width(p.cls);
    return true;
  },
});
