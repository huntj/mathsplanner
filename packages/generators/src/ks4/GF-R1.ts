/**
 * @statement GF-R1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R1: Change freely between related standard units (e.g. time, length, area, volume/capacity,
// mass) and compound units (e.g. speed, rates of pay, prices) in numerical and algebraic contexts
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  kmh: number;
  m2: number;
  claim: number;
}

const CLAIMS: { text: string; truth: boolean; why: string; code?: string }[] = [
  {
    text: "1 m³ = 1000 cm³",
    truth: false,
    why: "A 1 m cube is 100 cm × 100 cm × 100 cm = 1 000 000 cm³.",
    code: "RAT.UNITS.AREA-FACTOR",
  },
  {
    text: "1 litre = 1000 cm³",
    truth: true,
    why: "A litre is the volume of a 10 cm cube: 10 × 10 × 10 = 1000 cm³.",
  },
  {
    text: "1 m² = 100 cm²",
    truth: false,
    why: "1 m² is 100 cm × 100 cm = 10 000 cm².",
    code: "RAT.UNITS.AREA-FACTOR",
  },
];

export default defineGenerator<Params>({
  id: "GF-R1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.UNITS.DIRECTION", "RAT.UNITS.AREA-FACTOR"],

  params(rng) {
    return {
      kmh: rng.int(2, 20) * 18,
      m2: rng.int(2, 9) / 2,
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const ms = p.kmh / 3.6;
        return A.standard({
          question: `A car travels at ${p.kmh} km/h.`,
          ask: "What is this speed in metres per second?",
          answer: A.number(ms, { units: "m/s" }),
          wrong: wrongs(ms, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(Math.round(p.kmh * 3.6 * 100) / 100),
              feedback: "1 km/h is 1000 m in 3600 s, so divide by 3.6.",
            },
          ]),
          solution: [{ say: `${p.kmh} km/h = ${p.kmh} × 1000 m ÷ 3600 s = ${ms} m/s.` }],
        });
      }
      case 2: {
        const cm2 = p.m2 * 10000;
        return A.standard({
          question: `A rug has an area of ${p.m2} m².`,
          ask: "What is its area in cm²?",
          answer: A.number(cm2, { units: "cm²" }),
          wrong: wrongs(cm2, [
            {
              code: "RAT.UNITS.AREA-FACTOR",
              value: A.number(p.m2 * 100),
              feedback: "1 m² = 100 cm × 100 cm = 10 000 cm².",
            },
          ]),
          solution: [{ say: `${p.m2} × 10 000 = ${cm2} cm².` }],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Liam says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Area and volume units convert with the same factor as length.`,
              code: "RAT.UNITS.AREA-FACTOR",
            },
            {
              text: `${c.truth ? "False" : "True"}. You divide to change into smaller units.`,
              code: "RAT.UNITS.DIRECTION",
            },
          ],
          solution: [{ say: "Square the length factor for area and cube it for volume." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    const n = numberAnswer(question);
    return n === p.kmh / 3.6 || n === p.m2 * 10000;
  },
});
