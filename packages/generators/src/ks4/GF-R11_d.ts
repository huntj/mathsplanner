/**
 * @statement GF-R11.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R11.d: Use pressure
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  p: number;
  area: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "GF-R11.d",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND-UNIT.ARRANGEMENT"],

  params(rng) {
    return { p: rng.int(2, 40) * 5, area: rng.pick([0.5, 1.5, 2, 2.5, 4, 5, 8]) };
  },

  build(p, depth, rng): QuestionDraft {
    const force = r(p.p * p.area);
    switch (depth) {
      case 1:
        return A.standard({
          question: [`A force of ${force} N acts on an area of ${p.area} m².`],
          ask: "Find the pressure in N/m².",
          answer: A.number(p.p, { units: "N/m²" }),
          wrong: wrongs(p.p, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(r(force * p.area), { units: "N/m²" }),
              feedback: "Pressure is newtons per m²: force ÷ area.",
            },
          ]),
          solution: [{ say: "", math: `${force} \\div ${p.area} = ${p.p} \\text{ N/m}^2` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A box rests on an area of ${p.area} m² and exerts a pressure of ${p.p} N/m².`,
              ],
              ask: "Find the force it exerts, in newtons.",
            },
            {
              question: [
                `A crate standing on ${p.area} m² of floor exerts a pressure of ${p.p} N/m².`,
              ],
              ask: "What is its weight, in newtons?",
            },
          ],
          answer: A.number(force, { units: "N" }),
          wrong: wrongs(force, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(r(p.p / p.area), { units: "N" }),
              feedback: "Force = pressure × area.",
            },
          ]),
          solution: [{ say: "", math: `${p.p} \\times ${p.area} = ${force} \\text{ N}` }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["If the same force acts on a smaller area, the pressure is bigger."],
              truth: "always",
              reasons: [
                {
                  text: "Always. Pressure = force ÷ area, and dividing by a smaller number gives a bigger answer. That is why a knife's thin edge cuts.",
                  correct: true,
                },
                {
                  text: "Never. A smaller area means less pressure.",
                  code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
                },
                { text: "Sometimes. It depends on the force." },
              ],
              solution: [{ say: "Area is on the bottom of the division." }],
            }),
          [
            {
              statement:
                "A force of 60 N acts on an area of 3 m². Leo says the pressure is 20 N/m².",
              truth: true,
              right: "True. pressure = force ÷ area = 60 ÷ 3.",
              wrong: [
                ["False. It is 180 N/m².", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["False. It is 0.05 N/m².", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
              ],
            },
            {
              statement: "A pressure of 50 N/m² acts on 4 m². Pia says the force is 12.5 N.",
              truth: false,
              right: "False. force = pressure × area = 50 × 4 = 200 N.",
              wrong: [
                ["True. 50 ÷ 4 = 12.5.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["True. Divide to find force.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
              ],
            },
            {
              claim: "Doubling the area that a fixed force acts on doubles the pressure.",
              truth: "never",
              right: "Never. Pressure = force ÷ area, so doubling the area halves the pressure.",
              wrong: [
                ["Always. Bigger area, bigger pressure.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["Sometimes. Only for small forces."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.p;
    if (question.key.depth === 2) return numberAnswer(question) === r(p.p * p.area);
    return true;
  },
});
