/**
 * @statement GF-A14
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A14: Plot and interpret graphs (including reciprocal graphs) and graphs of non-standard
// functions in real contexts, to find approximate solutions to problems such as simple kinematic
// problems involving distance, speed and acceleration
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import type { CartesianSpec, Coord } from "@mathsplanner/diagrams";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Minutes walking out, stopped, and walking back; distance in km. */
  t1: number;
  stop: number;
  t3: number;
  d: number;
  claim: number;
}

/** A journey: out to distance d, a stop, then home. */
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
    y: { min: 0, max: p.d + 1, step: 1, label: "\\text{distance (km)}" },
    grid: true,
    segments: pts.slice(1).map((to, i) => ({ from: pts[i] as Coord, to })),
    description: "A distance–time graph of a journey from home and back.",
  };
}

const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "During the flat part of the graph, Kim was walking at a steady speed.",
    truth: false,
    why: "The distance from home did not change, so Kim was stopped.",
  },
  {
    text: "The steeper a section of the graph, the faster Kim was moving.",
    truth: true,
    why: "A steeper line covers more distance in the same time.",
  },
  {
    text: "When the line goes down, Kim was walking back towards home.",
    truth: true,
    why: "The distance from home is getting smaller.",
  },
];

export default defineGenerator<Params>({
  id: "GF-A14",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRAPH.DISTANCE-TIME", "RAT.COMPOUND-UNIT.ARRANGEMENT"],

  params(rng) {
    const t1 = rng.pick([20, 30, 40, 60]);
    const d = rng.int(2, 6);
    const stop = rng.pick([10, 20, 30]);
    const t3 = rng.pick([20, 30, 40, 60]);
    if ((d * 60) % t1 !== 0) reject("a whole-number speed");
    return { t1, stop, t3, d, claim: rng.int(0, CLAIMS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const fig = journey(p);
    switch (depth) {
      case 1: {
        const speed = (p.d * 60) / p.t1;
        return A.standard({
          question: ["The graph shows Kim's walk from home.", A.figure(fig)],
          ask: "What was Kim's speed for the first part of the walk, in km/h?",
          answer: A.number(speed, { units: "km/h" }),
          wrong: wrongs(speed, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(Math.round((p.d / p.t1) * 1000) / 1000),
              feedback: `That is km per minute. Change ${p.t1} minutes to hours first.`,
            },
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(Math.round((p.t1 / 60 / p.d) * 1000) / 1000),
              feedback: "Speed = distance ÷ time.",
            },
          ]),
          solution: [
            { say: `${p.d} km in ${p.t1} minutes = ${p.d} ÷ ${p.t1 / 60} = ${speed} km/h.` },
          ],
        });
      }
      case 2:
        return A.standard({
          question: ["The graph shows Kim's walk from home.", A.figure(fig)],
          ask: "For how many minutes did Kim stop?",
          answer: A.number(p.stop, { units: "minutes" }),
          wrong: wrongs(p.stop, [
            {
              code: "ALG.GRAPH.DISTANCE-TIME",
              value: A.number(p.t1 + p.stop),
              feedback: "Read the start and end of the flat section and take one from the other.",
            },
          ]),
          solution: [
            {
              say: `The graph is flat from ${p.t1} to ${p.t1 + p.stop} minutes: ${p.stop} minutes.`,
            },
          ],
        });
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: [A.figure(fig), `Leo says: "${c.text}"`],
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. A flat line means moving at a constant speed.`,
              code: "ALG.GRAPH.DISTANCE-TIME",
            },
            {
              text: `${c.truth ? "False" : "True"}. A steeper line means moving more slowly.`,
              code: "ALG.GRAPH.DISTANCE-TIME",
            },
          ],
          solution: [
            { say: "On a distance–time graph the gradient is the speed: flat means stopped." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    const n = numberAnswer(question);
    return question.key.depth === 1 ? n === (p.d * 60) / p.t1 : n === p.stop;
  },
});
