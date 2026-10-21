/**
 * @statement GF-G14
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G14: Use standard units of measure and related concepts (length, area, volume/capacity, mass,
// time, money, etc.)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  litres: number;
  cm3: number;
  claim: number;
}

const CLAIMS: { text: string; truth: boolean; why: string; code?: string }[] = [
  {
    text: "1 km² = 1000 m²",
    truth: false,
    why: "1 km² is 1000 m × 1000 m = 1 000 000 m².",
    code: "RAT.UNITS.AREA-FACTOR",
  },
  { text: "1 ml = 1 cm³", truth: true, why: "A litre is 1000 cm³ and 1000 ml." },
  { text: "1 tonne = 1000 kg", truth: true, why: "The metric tonne is 1000 kilograms." },
];

export default defineGenerator<Params>({
  id: "GF-G14",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.UNITS.DIRECTION", "RAT.UNITS.AREA-FACTOR"],

  params(rng) {
    return {
      litres: rng.int(3, 49) / 2,
      cm3: rng.int(2, 9) * 250000,
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.litres * 1000;
        return A.standard({
          question: `A tank holds ${p.litres} litres.`,
          ask: "What is its capacity in cm³?",
          answer: A.number(v, { units: "cm³" }),
          wrong: wrongs(v, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(p.litres * 100),
              feedback: "1 litre = 1000 cm³.",
            },
          ]),
          solution: [{ say: `${p.litres} × 1000 = ${v} cm³.` }],
        });
      }
      case 2: {
        const m3 = p.cm3 / 1e6;
        return A.reverse({
          question: `A box has a volume of ${p.cm3.toLocaleString("en-GB")} cm³.`,
          ask: "What is its volume in m³?",
          answer: A.number(m3, { units: "m³" }),
          wrong: wrongs(m3, [
            {
              code: "RAT.UNITS.AREA-FACTOR",
              value: A.number(p.cm3 / 100),
              feedback: "1 m³ = 100 × 100 × 100 = 1 000 000 cm³.",
            },
          ]),
          solution: [{ say: `${p.cm3.toLocaleString("en-GB")} ÷ 1 000 000 = ${m3} m³.` }],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Sana says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Area units convert with the length factor.`,
              code: "RAT.UNITS.AREA-FACTOR",
            },
            {
              text: `${c.truth ? "False" : "True"}. Every metric conversion uses 100.`,
              code: "RAT.UNITS.DIRECTION",
            },
          ],
          solution: [{ say: "Learn the length facts, then square for area and cube for volume." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.litres * 1000;
    if (question.archetype === "reverse") return numberAnswer(question) === p.cm3 / 1e6;
    return true;
  },
});
