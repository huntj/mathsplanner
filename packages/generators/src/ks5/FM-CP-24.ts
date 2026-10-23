/**
 * @statement FM-CP-24
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-24: Use polar coordinates; sketch polar curves; convert between polar and Cartesian forms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { piLatex, rad } from "../shared/trig.ts";

/** Angles whose cosine is ±1/2 or ±1, so x is a whole number. */
const ANGLES = [60, 120, 180, 240, 300];

export interface Params {
  r: number;
  t: number;
  k: number;
}

const xOf = (p: Params) => Math.round(p.r * Math.cos(rad(ANGLES[p.t] ?? 60)));

export default defineGenerator<Params>({
  id: "FM-CP-24",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.POLAR.CONVERT"],

  params(rng) {
    return { r: 2 * rng.int(1, 6), t: rng.int(0, ANGLES.length - 1), k: rng.int(2, 8) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = xOf(p);
        return A.standard({
          question: [
            "A point has polar coordinates ",
            A.math(`\\left(${p.r}, ${piLatex(ANGLES[p.t] ?? 60)}\\right)`),
            ".",
          ],
          ask: "Find its x-coordinate.",
          answer: A.number(x),
          wrong: signedWrongs(x, [
            {
              code: "GEO.POLAR.CONVERT",
              value: A.number(-x),
              feedback: "x = r cos θ: check the sign of cos θ in this quadrant.",
            },
          ]),
          solution: [{ say: "", math: `x = ${p.r}\\cos ${piLatex(ANGLES[p.t] ?? 60)} = ${x}` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Write the curve ", A.math(`x^2 + y^2 = ${p.k}x`), " in polar form."],
          correct: A.math(`r = ${p.k}\\cos\\theta`),
          distractors: [
            {
              content: A.math(`r = ${p.k}\\sin\\theta`),
              code: "GEO.POLAR.CONVERT",
              feedback: "x = r cos θ, so the cosine goes with x.",
            },
            {
              content: A.math(`r^2 = ${p.k}\\cos\\theta`),
              code: "GEO.POLAR.CONVERT",
              feedback: "x² + y² = r² and x = r cos θ; divide both sides by r.",
            },
          ],
          solution: [
            {
              say: "Substitute x² + y² = r² and x = r cos θ: ",
              math: `r^2 = ${p.k}r\\cos\\theta \\Rightarrow r = ${p.k}\\cos\\theta`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Pip says the polar curve ", A.math(`r = ${p.k}`), " is a straight line."],
          truth: false,
          reasons: [
            {
              text: `False. Every point is ${p.k} from the pole, whatever θ is: it is a circle of radius ${p.k} centred on the pole.`,
              correct: true,
            },
            { text: `True. It is like y = ${p.k}, a horizontal line.`, code: "GEO.POLAR.CONVERT" },
            { text: `True. It is like x = ${p.k}, a vertical line.`, code: "GEO.POLAR.CONVERT" },
          ],
          solution: [{ say: `In Cartesian form, x² + y² = ${p.k * p.k}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === xOf(p);
    if (question.key.depth === 2) return chosenText(question) === `r = ${p.k}\\cos\\theta`;
    return true;
  },
});
