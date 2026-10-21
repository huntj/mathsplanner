/**
 * @statement GF-G18
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-G18: Calculate arc lengths, angles and areas of sectors of circles
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { sector } from "../shared/mea.ts";

interface Params {
  r: number;
  theta: number;
  claim: number;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const dp1 = { accuracy: { dp: 1 } } as const;

export default defineGenerator<Params>({
  id: "GF-G18",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.SECTOR.FRACTION", "MEA.CIRCLE.FORMULA"],

  params(rng) {
    return {
      r: rng.int(3, 12),
      theta: rng.pick([40, 50, 60, 72, 80, 100, 120, 135, 150]),
      claim: rng.int(0, 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const frac = p.theta / 360;
    switch (depth) {
      case 1: {
        const arc = r1(frac * 2 * Math.PI * p.r);
        return A.standard({
          question: [A.figure(sector(p.r, p.theta))],
          ask: "Work out the length of the arc, to 1 decimal place.",
          answer: A.number(arc, { units: "cm", ...dp1 }),
          wrong: wrongs(arc, [
            {
              code: "GEO.SECTOR.FRACTION",
              value: A.number(r1((p.theta / 180) * 2 * Math.PI * p.r), dp1),
              feedback: "A full turn is 360°, so the sector is θ/360 of the circle.",
            },
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1(frac * Math.PI * p.r * p.r), dp1),
              feedback: "Arc length is a fraction of the circumference, 2πr, not the area.",
            },
          ]),
          solution: [{ say: `${p.theta}/360 × 2 × π × ${p.r} = ${arc} cm.` }],
        });
      }
      case 2: {
        const area = r1(frac * Math.PI * p.r * p.r);
        return A.standard({
          question: [A.figure(sector(p.r, p.theta))],
          ask: "Work out the area of the sector, to 1 decimal place.",
          answer: A.number(area, { units: "cm²", ...dp1 }),
          wrong: wrongs(area, [
            {
              code: "GEO.SECTOR.FRACTION",
              value: A.number(r1((p.theta / 100) * Math.PI * p.r * p.r), dp1),
              feedback: "Use θ/360 of the whole circle's area.",
            },
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.number(r1(frac * 2 * Math.PI * p.r), dp1),
              feedback: "That is the arc length. Area uses πr².",
            },
          ]),
          solution: [{ say: `${p.theta}/360 × π × ${p.r}² = ${area} cm².` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            p.claim === 0
              ? `Rae says a sector with an angle of 90° has a quarter of the area of the whole circle.`
              : `Rae says a sector with an angle of ${p.theta}° has ${p.theta}/180 of the circle's area.`,
          truth: p.claim === 0,
          reasons: [
            {
              text:
                p.claim === 0
                  ? "True. 90/360 = 1/4, so the sector is a quarter of the circle."
                  : `False. A full circle is 360°, so it is ${p.theta}/360 of the area.`,
              correct: true,
            },
            {
              text: `${p.claim === 0 ? "False" : "True"}. A sector's fraction is its angle over 180°.`,
              code: "GEO.SECTOR.FRACTION",
            },
            {
              text: `${p.claim === 0 ? "False" : "True"}. A sector's fraction is its angle over 100.`,
              code: "GEO.SECTOR.FRACTION",
            },
          ],
          solution: [{ say: "Sector fraction = θ/360." }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    const n = numberAnswer(question);
    const f = p.theta / 360;
    return question.key.depth === 1
      ? Math.abs(n - f * 2 * Math.PI * p.r) < 0.06
      : Math.abs(n - f * Math.PI * p.r * p.r) < 0.06;
  },
});
