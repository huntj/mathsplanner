/**
 * @statement GF-A14.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A14.a: Plot and interpret distance-time graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  t1: number;
  stop: number;
  t3: number;
  d: number;
}

function journey(p: Params): CartesianSpec {
  const pts: Coord[] = [
    [0, 0],
    [p.t1, p.d],
    [p.t1 + p.stop, p.d],
    [p.t1 + p.stop + p.t3, 0],
  ];
  return {
    type: "cartesian",
    x: { min: 0, max: p.t1 + p.stop + p.t3 + 10, step: 10, label: "\\text{time (minutes)}" },
    y: { min: 0, max: p.d + 1, step: 1, label: "\\text{distance from home (km)}" },
    grid: true,
    segments: pts.slice(1).map((to, i) => ({ from: pts[i] as Coord, to })),
    description: "A distance–time graph of a journey from home and back.",
  };
}

export default defineGenerator<Params>({
  id: "GF-A14.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.DISTANCE-TIME"],

  params(rng) {
    const p = {
      t1: rng.pick([20, 30, 60]),
      stop: 10 * rng.int(1, 4),
      t3: rng.pick([20, 30, 40, 60]),
      d: rng.int(2, 8),
    };
    if (((p.d * 60) / p.t1) % 1 !== 0 || ((p.d * 60) / p.t3) % 1 !== 0)
      reject("whole-number speeds");
    if (p.t1 === p.t3) reject("different speeds out and back");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const intro = ["The graph shows Kim's journey from home and back.", A.figure(journey(p))];
    switch (depth) {
      case 1: {
        const v = (p.d * 60) / p.t1;
        return A.standard({
          question: intro,
          ask: "Find Kim's speed on the way out, in km/h.",
          answer: A.number(v, { units: "km/h" }),
          wrong: wrongs(v, [
            {
              code: "ALG.GRAPH.DISTANCE-TIME",
              value: A.number(Math.round((p.d / p.t1) * 100) / 100, { units: "km/h" }),
              feedback: `Convert the time to hours: ${p.t1} minutes = ${p.t1 / 60} hours.`,
            },
          ]),
          solution: [{ say: `${p.d} km in ${p.t1} minutes: ${p.d} ÷ ${p.t1 / 60} = ${v} km/h.` }],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [{ question: intro, ask: "For how many minutes did Kim stop?" }],
          answer: A.number(p.stop, { units: "minutes" }),
          wrong: wrongs(p.stop, [
            {
              code: "ALG.GRAPH.DISTANCE-TIME",
              value: A.number(p.t1 + p.stop, { units: "minutes" }),
              feedback:
                "The stop is the length of the flat part: subtract its start time from its end time.",
            },
          ]),
          solution: [
            {
              say: `The flat part runs from ${p.t1} to ${p.t1 + p.stop} minutes: ${p.stop} minutes.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            ...intro,
            ` Kim says she walked faster on the way ${p.t1 < p.t3 ? "back" : "out"}, because that part of the graph is longer.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Speed is shown by steepness. The way ${p.t1 < p.t3 ? "out" : "back"} is steeper (the same distance in less time), so it was faster.`,
              correct: true,
            },
            { text: "True. A longer line means a faster speed.", code: "ALG.GRAPH.DISTANCE-TIME" },
            { text: "True. A less steep line means faster.", code: "ALG.GRAPH.DISTANCE-TIME" },
          ],
          solution: [{ say: `Out: ${(p.d * 60) / p.t1} km/h. Back: ${(p.d * 60) / p.t3} km/h.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.d * 60) / p.t1;
    if (question.key.depth === 2) return numberAnswer(question) === p.stop;
    return true;
  },
});
