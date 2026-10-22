/**
 * @statement AL-P10.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P10.2: Calculate magnitude and direction of a vector; convert between component and
// magnitude-direction form
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { ijk } from "../shared/vec.ts";

const PAIRS = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 6, 10],
  [7, 24, 25],
  [12, 5, 13],
  [9, 12, 15],
] as const;

interface Params {
  t: number;
  speed: number;
  angle: number;
}

const r1 = (x: number) => Math.round(x * 10) / 10;
const r2 = (x: number) => Math.round(x * 100) / 100;
const rad = (d: number) => (d * Math.PI) / 180;

export default defineGenerator<Params>({
  id: "AL-P10.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.VECTOR.MAGNITUDE", "GEO.TRIG.RATIO"],

  params(rng) {
    return { t: rng.int(0, PAIRS.length - 1), speed: rng.int(5, 30), angle: rng.int(15, 75) };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y, m] = PAIRS[p.t] ?? (PAIRS[0] as (typeof PAIRS)[number]);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Find the magnitude of ", A.math(ijk([x, y])), "."],
          answer: A.number(m),
          wrong: wrongs(m, [
            {
              code: "GEO.VECTOR.MAGNITUDE",
              value: A.number(x + y),
              feedback: "Use Pythagoras: √(x² + y²).",
            },
          ]),
          solution: [{ say: "", math: `\\sqrt{${x}^2 + ${y}^2} = ${m}` }],
        });
      case 2: {
        const vx = r2(p.speed * Math.cos(rad(p.angle)));
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A velocity has magnitude ${p.speed} m/s and acts at ${p.angle}° above the direction of i.`,
              ask: "Find its i component, to 2 decimal places.",
            },
          ],
          answer: A.number(vx, { units: "m/s", accuracy: { dp: 2 } }),
          wrong: wrongs(vx, [
            {
              code: "GEO.TRIG.RATIO",
              value: A.number(r2(p.speed * Math.sin(rad(p.angle))), {
                units: "m/s",
                accuracy: { dp: 2 },
              }),
              feedback: "The i component is adjacent to the angle: use cos.",
            },
          ]),
          solution: [{ say: `${p.speed} cos ${p.angle}° = ${vx} m/s.` }],
        });
      }
      default: {
        const angle = r1((Math.atan2(y, x) * 180) / Math.PI);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kit says the vector ",
            A.math(ijk([x, y])),
            ` makes an angle of tan⁻¹(${x}/${y}) with i.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The angle with i has opposite ${y} and adjacent ${x}: tan⁻¹(${y}/${x}) ≈ ${angle}°.`,
              correct: true,
            },
            {
              text: "True. Divide the first component by the second.",
              code: "GEO.VECTOR.MAGNITUDE",
            },
            { text: "True. Either way round gives the same angle.", code: "GEO.TRIG.RATIO" },
          ],
          solution: [
            { say: "Sketch the vector: the i component runs along the axis next to the angle." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (PAIRS[p.t] ?? PAIRS[0])[2];
    return true;
  },
});
