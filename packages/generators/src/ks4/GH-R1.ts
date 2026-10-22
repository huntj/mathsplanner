/**
 * @statement GH-R1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-R1: Change between units in algebraic contexts
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** A speed in m/s, a multiple of 5. */
  speed: number;
  /** Depth 2: area (×100), volume (×1000) or length (×10) from cm to mm. */
  kind: "area" | "volume";
  letter: "x" | "y" | "A" | "V";
  claim: number;
}

const CLAIMS = [
  { text: "1 m² = 100 cm²", truth: false, why: "1 m² is 100 cm by 100 cm, which is 10 000 cm²." },
  {
    text: "1 m³ = 1 000 000 cm³",
    truth: true,
    why: "1 m³ is 100 cm × 100 cm × 100 cm = 1 000 000 cm³.",
  },
  { text: "1 cm³ = 10 mm³", truth: false, why: "1 cm³ is 10 mm × 10 mm × 10 mm = 1000 mm³." },
] as const;

export default defineGenerator<Params>({
  id: "GH-R1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.UNITS.DIRECTION", "RAT.UNITS.AREA-FACTOR"],

  params(rng) {
    const kind = rng.pick(["area", "volume"] as const);
    return {
      speed: 5 * rng.int(2, 9),
      kind,
      letter: kind === "area" ? rng.pick(["x", "A"] as const) : rng.pick(["y", "V"] as const),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const kmh = Math.round(p.speed * 3.6 * 10) / 10;
        return A.standard({
          question: `A train travels at ${p.speed} m/s.`,
          ask: "Write this speed in km/h.",
          answer: A.number(kmh, { units: "km/h" }),
          wrong: wrongs(kmh, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(Math.round(((p.speed * 60) / 1000) * 100) / 100, { units: "km/h" }),
              feedback:
                "In one hour there are 3600 seconds: multiply by 3600, then divide by 1000.",
            },
          ]),
          solution: [
            {
              say: `${p.speed} m/s = ${p.speed} × 3600 m per hour = ${p.speed * 3600} m/h = ${kmh} km/h.`,
            },
          ],
        });
      }
      case 2: {
        const [factor, sup] = p.kind === "area" ? [100, "²"] : [1000, "³"];
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`The ${p.kind} of a shape is `, A.math(p.letter), ` cm${sup}.`],
              ask: `Write an expression for its ${p.kind} in mm${sup}.`,
            },
            {
              question: [`A shape has ${p.kind} `, A.math(p.letter), ` cm${sup}.`],
              ask: ["Write its ", p.kind, ` in mm${sup}, in terms of `, A.math(p.letter), "."],
            },
          ],
          answer: A.exact(`${factor}${p.letter}`),
          wrong: [
            {
              code: "RAT.UNITS.AREA-FACTOR",
              value: A.exact(`10${p.letter}`),
              feedback: `1 cm = 10 mm, so 1 cm${sup} = ${factor} mm${sup}.`,
            },
          ],
          solution: [
            {
              say: `1 cm${sup} = ${p.kind === "area" ? "10 × 10" : "10 × 10 × 10"} mm${sup} = ${factor} mm${sup}, so the ${p.kind} is ${factor}${p.letter} mm${sup}.`,
            },
          ],
        });
      }
      default: {
        const c = CLAIMS[p.claim] ?? (CLAIMS[0] as (typeof CLAIMS)[number]);
        return A.trueOrFalseWhy({
          rng,
          statement: `Priya says ${c.text}.`,
          truth: c.truth,
          reasons: c.truth
            ? [
                { text: `True. ${c.why}`, correct: true },
                {
                  text: "False. 1 m³ = 100 cm³, because 1 m = 100 cm.",
                  code: "RAT.UNITS.AREA-FACTOR",
                },
                { text: "False. 1 m³ = 1000 cm³.", code: "RAT.UNITS.AREA-FACTOR" },
              ]
            : [
                { text: `False. ${c.why}`, correct: true },
                {
                  text: "True. Use the same factor as for lengths.",
                  code: "RAT.UNITS.AREA-FACTOR",
                },
                {
                  text: "True. Multiply by 10 for every change of unit.",
                  code: "RAT.UNITS.DIRECTION",
                },
              ],
          solution: [{ say: "Square the length factor for areas and cube it for volumes." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === Math.round(p.speed * 36) / 10;
    return true;
  },
});
