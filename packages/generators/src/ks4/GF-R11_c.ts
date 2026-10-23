/**
 * @statement GF-R11.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R11.c: Use density
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  rho: number;
  vol: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "GF-R11.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND-UNIT.ARRANGEMENT"],

  params(rng) {
    return { rho: rng.pick([0.5, 0.8, 1.5, 2.5, 2.7, 7.8, 8.9, 11.3]), vol: rng.int(2, 40) * 5 };
  },

  build(p, depth, rng): QuestionDraft {
    const mass = r(p.rho * p.vol);
    switch (depth) {
      case 1:
        return A.standard({
          question: [`A block has mass ${mass} g and volume ${p.vol} cm³.`],
          ask: "Find its density in g/cm³.",
          answer: A.number(p.rho, { units: "g/cm³" }),
          wrong: wrongs(p.rho, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(r(mass * p.vol), { units: "g/cm³" }),
              feedback: "Density is grams per cm³: mass ÷ volume.",
            },
          ]),
          solution: [{ say: "", math: `${mass} \\div ${p.vol} = ${p.rho} \\text{ g/cm}^3` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A metal has density ${p.rho} g/cm³. A piece of it has mass ${mass} g.`],
              ask: "Find its volume in cm³.",
            },
            {
              question: [`A liquid has density ${p.rho} g/cm³. A jug holds ${mass} g of it.`],
              ask: "What volume of liquid, in cm³, is in the jug?",
            },
          ],
          answer: A.number(p.vol, { units: "cm³" }),
          wrong: wrongs(p.vol, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(r(mass * p.rho), { units: "cm³" }),
              feedback: "Volume = mass ÷ density.",
            },
          ]),
          solution: [{ say: "", math: `${mass} \\div ${p.rho} = ${p.vol} \\text{ cm}^3` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Zed says a ${2 * p.vol} cm³ piece of a metal has a bigger density than a ${p.vol} cm³ piece of the same metal.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. Doubling the volume doubles the mass too, so mass ÷ volume stays the same.",
              correct: true,
            },
            {
              text: "True. It is heavier, so it is denser.",
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
            },
            { text: "True. Density goes up with volume.", code: "RAT.COMPOUND-UNIT.ARRANGEMENT" },
          ],
          solution: [{ say: "Density belongs to the material, not the size of the piece." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.rho;
    if (question.key.depth === 2) return numberAnswer(question) === p.vol;
    return true;
  },
});
