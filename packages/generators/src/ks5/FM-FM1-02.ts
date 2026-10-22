/**
 * @statement FM-FM1-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FM1-02: Use work, kinetic and potential energy, and power
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

interface Params {
  P: number;
  v: number;
  h: number;
}

const bottom = (h: number) => round(Math.sqrt(2 * 9.8 * h), 2);

export default defineGenerator<Params>({
  id: "FM-FM1-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.ENERGY", "MECH.UNITS"],

  params(rng) {
    return { P: 5 * rng.int(2, 20), v: rng.pick([10, 20, 25, 40, 50]), h: rng.int(2, 20) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const F = (1000 * p.P) / p.v;
        return A.standard({
          question: [`A car's engine works at ${p.P} kW while the car moves at ${p.v} m/s.`],
          ask: "Find the driving force, in newtons.",
          answer: A.number(F, { units: "N" }),
          wrong: wrongs(F, [
            {
              code: "MECH.UNITS",
              value: A.number(p.P / p.v, { units: "N" }),
              feedback: `Convert to watts first: ${p.P} kW = ${1000 * p.P} W.`,
            },
            {
              code: "MECH.ENERGY",
              value: A.number(1000 * p.P * p.v, { units: "N" }),
              feedback: "P = Fv, so F = P/v.",
            },
          ]),
          solution: [{ say: "", math: `F = \\frac{P}{v} = \\frac{${1000 * p.P}}{${p.v}} = ${F}` }],
        });
      }
      case 2: {
        const v = bottom(p.h);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A particle slides from rest down a smooth slope, dropping a vertical height of ${p.h} m. Take g = 9.8 m/s².`,
              ],
              ask: "Find its speed at the bottom, to 2 decimal places.",
            },
          ],
          answer: A.number(v, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "MECH.ENERGY",
              value: A.number(round(Math.sqrt(9.8 * p.h), 2), {
                units: "m/s",
                accuracy: { dp: 2 },
              }),
              feedback: "Kinetic energy is ½mv²: mgh = ½mv² gives v = √(2gh).",
            },
          ]),
          solution: [
            {
              say: "",
              math: `mgh = \\tfrac{1}{2}mv^2 \\Rightarrow v = \\sqrt{2 \\times 9.8 \\times ${p.h}} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Cal says the normal reaction on a box sliding ${p.h} m across a floor does work equal to the reaction times ${p.h}.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. Work = force × distance moved in the direction of the force. The reaction is perpendicular to the motion, so it does no work.",
              correct: true,
            },
            { text: "True. Every force does work F × d.", code: "MECH.ENERGY" },
            { text: "True. The box moves, so all the forces on it do work.", code: "MECH.ENERGY" },
          ],
          solution: [{ say: "Work done = Fd cos θ, and cos 90° = 0." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (1000 * p.P) / p.v;
    if (question.key.depth === 2) return numberAnswer(question) === bottom(p.h);
    return true;
  },
});
