/**
 * @statement Y8-RAT-05.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-RAT-05.c: Solve problems with density
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  rho: number;
  vol: number;
  m1: number;
  v1: number;
  m2: number;
  v2: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "Y8-RAT-05.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND-UNIT.ARRANGEMENT"],

  params(rng) {
    const p = {
      rho: rng.int(2, 12),
      vol: rng.int(5, 40),
      m1: rng.int(30, 90),
      v1: rng.int(40, 120),
      m2: rng.int(150, 400),
      v2: rng.int(50, 120),
    };
    if (p.m1 >= p.v1 || p.m2 <= p.v2) reject("one object that floats and one that sinks");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const mass = p.rho * p.vol;
        return A.standard({
          question: [`A stone has a mass of ${mass} g and a volume of ${p.vol} cm³.`],
          ask: "Find its density in g/cm³.",
          answer: A.number(p.rho),
          wrong: wrongs(p.rho, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(mass * p.vol),
              feedback: "Density = mass ÷ volume (grams per cm³).",
            },
          ]),
          solution: [{ say: "", math: `${mass} \\div ${p.vol} = ${p.rho} \\text{ g/cm}^3` }],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `Water has density 1 g/cm³. Object A has mass ${p.m1} g and volume ${p.v1} cm³. Object B has mass ${p.m2} g and volume ${p.v2} cm³.`,
          ],
          ask: "Which object floats in water?",
          correct: "Object A",
          distractors: [
            {
              content: "Object B",
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              feedback: `B's density is ${p.m2} ÷ ${p.v2} ≈ ${r2(p.m2 / p.v2)} g/cm³, more than water, so it sinks.`,
            },
            {
              content: "Both of them",
              feedback: "Work out each density and compare with 1 g/cm³.",
            },
          ],
          solution: [
            {
              say: `A: ${r2(p.m1 / p.v1)} g/cm³ < 1, floats; B: ${r2(p.m2 / p.v2)} g/cm³ > 1, sinks.`,
            },
          ],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Dan says a large, heavy log must sink in water because it is so heavy."],
              truth: false,
              reasons: [
                {
                  text: "False. Floating depends on density, mass per unit of volume. Wood is less dense than water, so even a heavy log floats.",
                  correct: true,
                },
                { text: "True. Heavy things sink.", code: "RAT.COMPOUND-UNIT.ARRANGEMENT" },
                { text: "True. Its density is its mass.", code: "RAT.COMPOUND-UNIT.ARRANGEMENT" },
              ],
              solution: [{ say: "Compare densities, not masses." }],
            }),
          [
            {
              statement:
                "A block has a mass of 200 g and a volume of 50 cm³. Ola says its density is 4 g/cm³.",
              truth: true,
              right: "True. Density = mass ÷ volume = 200 ÷ 50 = 4 g/cm³.",
              wrong: [
                ["False. It is 50 ÷ 200 = 0.25 g/cm³.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["False. It is 200 × 50 = 10 000 g/cm³."],
              ],
            },
            {
              statement:
                "Gold has a density of 19.3 g/cm³. Ray says 10 cm³ of gold has a mass of 1.93 g.",
              truth: false,
              right: "False. Mass = density × volume = 19.3 × 10 = 193 g.",
              wrong: [
                ["True. Mass = density ÷ volume.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["True. Gold is light for its size."],
              ],
            },
            {
              claim: "Cutting a block of wood in half halves its density.",
              truth: "never",
              right: "Never. The mass and the volume both halve, so mass ÷ volume stays the same.",
              wrong: [
                ["Always. Half the wood has half the mass.", "RAT.COMPOUND-UNIT.ARRANGEMENT"],
                ["Sometimes. Only when it is cut along the grain."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.rho;
    if (question.key.depth === 2) return chosenText(question) === "Object A";
    return true;
  },
});
