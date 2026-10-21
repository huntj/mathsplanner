/**
 * @statement Y7-RAT-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-RAT-01: Change freely between related standard units (time, length, area, volume/capacity, mass)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  unit: number;
  area: number;
  /** Down (big → small): the start is m × 10^-dp. Up (small → big): the start is m × step. */
  m: number;
  dp: number;
  down: boolean;
  claim: number;
}

const UNITS = [
  { big: "km", small: "m", one: "1 km", factor: 1000, step: 10 },
  { big: "m", small: "cm", one: "1 m", factor: 100, step: 10 },
  { big: "cm", small: "mm", one: "1 cm", factor: 10, step: 1 },
  { big: "kg", small: "g", one: "1 kg", factor: 1000, step: 10 },
  { big: "litres", small: "ml", one: "1 litre", factor: 1000, step: 10 },
  { big: "hours", small: "minutes", one: "1 hour", factor: 60, step: 15 },
];
const AREAS = [
  { big: "\\text{m}^2", small: "\\text{cm}^2", text: ["m²", "cm²"], factor: 10000, linear: 100 },
  { big: "\\text{cm}^2", small: "\\text{mm}^2", text: ["cm²", "mm²"], factor: 100, linear: 10 },
  { big: "\\text{m}^3", small: "\\text{cm}^3", text: ["m³", "cm³"], factor: 1000000, linear: 100 },
  { big: "\\text{cm}^3", small: "\\text{mm}^3", text: ["cm³", "mm³"], factor: 1000, linear: 10 },
];
const exactly = (m: number, e: number) => Number(`${m}e${e}`);
const tidy = (x: number) => Number(x.toPrecision(12));

function conversion(p: Params) {
  const u = UNITS[p.unit] ??
    UNITS[0] ?? { big: "m", small: "cm", one: "1 m", factor: 100, step: 10 };
  const start = p.down ? exactly(p.m, -p.dp) : p.m * u.step;
  const answer = tidy(p.down ? start * u.factor : start / u.factor);
  const slip = tidy(p.down ? start / u.factor : start * u.factor);
  return { u, start, answer, slip };
}

export default defineGenerator<Params>({
  id: "Y7-RAT-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.UNITS.DIRECTION", "RAT.UNITS.AREA-FACTOR"],

  params(rng, numbers) {
    const unit = rng.int(0, UNITS.length - 1);
    const down = rng.bool();
    const dp = numbers === "friendly" || unit === 5 ? 0 : rng.int(0, 2);
    const m = rng.int(2, unit === 5 ? 16 : numbers === "stretch" ? 999 : 99);
    if (m % 10 === 0) reject("no trailing zero");
    return { unit, area: rng.int(0, AREAS.length - 1), m, dp, down, claim: rng.int(0, 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const { u, start, answer, slip } = conversion(p);
        const [from, to] = p.down ? [u.big, u.small] : [u.small, u.big];
        return A.standard({
          question: `Convert ${start} ${from} to ${to}.`,
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "RAT.UNITS.DIRECTION",
              value: A.number(slip),
              feedback: p.down
                ? `${to} are smaller, so there are more of them: multiply by ${u.factor}.`
                : `${to} are bigger, so there are fewer of them: divide by ${u.factor}.`,
            },
          ]),
          solution: [
            {
              say: `${u.one} = ${u.factor} ${u.small}, so ${p.down ? "multiply" : "divide"} by ${u.factor}: ${start} ${from} = ${answer} ${to}.`,
            },
          ],
        });
      }
      case 2: {
        const a = AREAS[p.area] ?? AREAS[0];
        if (!a) return reject("no unit");
        const start = exactly((p.m % 89) + 11, -1);
        const answer = tidy(start * a.factor);
        const [big, small] = a.text;
        return A.standard({
          question: ["Convert ", A.math(`${start}\\ ${a.big}`), " to ", A.math(a.small), "."],
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "RAT.UNITS.AREA-FACTOR",
              value: A.number(tidy(start * a.linear)),
              feedback: `1 ${big} is ${a.linear} by ${a.linear}${a.factor > a.linear * a.linear ? ` by ${a.linear}` : ""} of the smaller unit, so it is ${a.factor.toLocaleString("en-GB")} ${small}.`,
            },
          ]),
          solution: [
            {
              say: `1 ${big} = ${a.factor.toLocaleString("en-GB")} ${small}, so ${start} ${big} = ${answer.toLocaleString("en-GB")} ${small}.`,
            },
          ],
        });
      }
      default:
        return p.claim === 0
          ? A.trueOrFalseWhy({
              rng,
              statement: [
                "Ben says ",
                A.math("1\\text{ m}^2 = 100\\text{ cm}^2"),
                ", because 1 m = 100 cm.",
              ],
              truth: false,
              reasons: [
                {
                  text: "False. A square 1 m by 1 m is 100 cm by 100 cm, so its area is 100 × 100 = 10,000 cm².",
                  correct: true,
                },
                {
                  text: "True. You use the same conversion for area as for length.",
                  code: "RAT.UNITS.AREA-FACTOR",
                },
                { text: "True. Square units are always 100 times bigger." },
              ],
              solution: [{ say: "1 m² = 10,000 cm²." }],
            })
          : A.trueOrFalseWhy({
              rng,
              statement: "Ella says 2.5 hours is 250 minutes.",
              truth: false,
              reasons: [
                {
                  text: "False. An hour is 60 minutes, not 100: 2.5 × 60 = 150 minutes.",
                  correct: true,
                },
                {
                  text: "True. Multiply by 100 to change hours to minutes.",
                  code: "RAT.UNITS.DIRECTION",
                },
                { text: "True. 0.5 hours is 50 minutes." },
              ],
              solution: [{ say: "2.5 hours = 2 hours 30 minutes = 150 minutes." }],
            });
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    if (question.key.depth === 1)
      return Math.abs(numberAnswer(question) - conversion(p).answer) < 1e-9;
    const a = AREAS[p.area];
    return !!a && Math.abs(numberAnswer(question) - exactly((p.m % 89) + 11, -1) * a.factor) < 1e-6;
  },
});
