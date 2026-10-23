/**
 * @statement FM-FM2-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FM2-03: Find centres of mass of solids and frameworks; analyse equilibrium and toppling
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";
import { deg } from "../shared/trig.ts";

export interface Params {
  r: number;
  w: number;
  h: number;
}

const topple = (p: Params) => round(deg(Math.atan(p.w / p.h)), 1);

export default defineGenerator<Params>({
  id: "FM-FM2-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MECH.CENTRE-MASS"],

  params(rng) {
    const p = { r: rng.int(2, 12), w: rng.int(2, 9), h: rng.int(3, 15) };
    if (p.w >= p.h) reject("a block taller than it is wide");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = toLatex(frac(3 * p.r, 8));
        return A.standard({
          question: [`A uniform solid hemisphere has radius ${p.r} cm.`],
          ask: "Find the exact distance of its centre of mass from its flat face, in cm.",
          answer: A.exact(v),
          wrong: [
            {
              code: "MECH.CENTRE-MASS",
              value: A.exact(toLatex(frac(p.r, 2))),
              feedback:
                "r/2 is for a hemispherical shell. For the solid, more mass is near the flat face: 3r/8.",
            },
          ],
          solution: [{ say: "", math: `\\frac{3r}{8} = \\frac{3 \\times ${p.r}}{8} = ${v}` }],
        });
      }
      case 2: {
        const t = topple(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A uniform cuboid with a square base of side ${p.w} cm and height ${p.h} cm stands on a rough plane. The plane is slowly tilted, and the cuboid does not slide.`,
              ],
              ask: "Find the angle of the plane when the cuboid is about to topple, to 1 decimal place.",
            },
          ],
          answer: A.number(t, { units: "°", accuracy: { dp: 1 } }),
          wrong: wrongs(t, [
            {
              code: "MECH.CENTRE-MASS",
              value: A.number(round(deg(Math.atan(p.h / p.w)), 1), {
                units: "°",
                accuracy: { dp: 1 },
              }),
              feedback:
                "It topples when the centre of mass is above the lower edge: tan θ = (half width)/(half height) = w/h.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\tan\\theta = \\frac{${p.w}/2}{${p.h}/2} \\Rightarrow \\theta = ${t}^\\circ`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Ida says the centre of mass of a uniform solid cone of height ${p.h} cm is ${round(p.h / 2, 1)} cm above its base.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Most of the mass is near the base: the centre of mass is h/4 = ${round(p.h / 4, 2)} cm above the base.`,
              correct: true,
            },
            { text: "True. It is halfway up, like a cylinder.", code: "MECH.CENTRE-MASS" },
            {
              text: "True. Every solid of revolution balances at half its height.",
              code: "MECH.CENTRE-MASS",
            },
          ],
          solution: [{ say: "x̄ = ∫πy²x dx / ∫πy² dx gives 3h/4 from the vertex." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(3 * p.r, 8));
    if (question.key.depth === 2) return numberAnswer(question) === topple(p);
    return true;
  },
});
