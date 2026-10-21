/**
 * @statement Y7-RAT-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-RAT-04: Express one quantity as a fraction of another, where the fraction is less than 1 or
// greater than 1
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { fracTex, slash } from "../shared/fr.ts";

interface Params {
  unit: number;
  /** x in the small unit; y in the big unit. */
  x: number;
  y: number;
  claimTrue: boolean;
}

const UNITS = [
  { small: "cm", big: "m", factor: 100 },
  { small: "g", big: "kg", factor: 1000 },
  { small: "minutes", big: "hours", factor: 60 },
  { small: "ml", big: "litres", factor: 1000 },
];

export default defineGenerator<Params>({
  id: "Y7-RAT-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.FRACTION.UNITS"],

  params(rng, numbers) {
    const unit = rng.int(0, UNITS.length - 1);
    const u = UNITS[unit];
    const y = rng.int(1, numbers === "friendly" ? 2 : 5);
    const x = rng.int(2, (u?.factor ?? 100) * y - 1);
    if (!u || frac(x, u.factor * y).d > 100n || x === y || x % 5 !== 0)
      reject("a tidy fraction, in multiples of 5");
    return { unit, x, y, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const u = UNITS[p.unit] ?? UNITS[0];
    if (!u) return reject("no unit");
    const whole = u.factor * p.y;
    const less = frac(p.x, whole);
    const more = frac(whole, p.x);
    const big = `${p.y} ${p.y === 1 ? u.big.replace(/s$/, "") : u.big}`;
    switch (depth) {
      case 1:
        return A.standard({
          question: `Write ${p.x} ${u.small} as a fraction of ${big}.`,
          ask: "Give your answer in its simplest form.",
          answer: A.exact(less, "simplest"),
          wrong: frac(p.x, p.y).eq(less)
            ? []
            : [
                {
                  code: "RAT.FRACTION.UNITS",
                  value: A.exact(fracTex(p.x, p.y)),
                  feedback: `Change ${big} to ${u.small} first: ${whole} ${u.small}.`,
                },
              ],
          solution: [
            {
              say: `${big} = ${whole} ${u.small}, so the fraction is ${slash(p.x, whole)} = ${less.toString()}.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: `Write ${big} as a fraction of ${p.x} ${u.small}.`,
          ask: "Give your answer in its simplest form.",
          answer: A.exact(more, "simplest"),
          wrong: frac(p.y, p.x).eq(more)
            ? []
            : [
                {
                  code: "RAT.FRACTION.UNITS",
                  value: A.exact(fracTex(p.y, p.x)),
                  feedback: `Use the same units: ${big} = ${whole} ${u.small}.`,
                },
              ],
          solution: [
            {
              say: `${big} = ${whole} ${u.small}, so the fraction is ${slash(whole, p.x)} = ${more.toString()}. It is more than 1, because ${big} is more than ${p.x} ${u.small}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kai says ",
            `${p.x} ${u.small} as a fraction of ${big} is `,
            A.math(p.claimTrue ? toLatex(less) : fracTex(p.x, p.y)),
            ".",
          ],
          truth: p.claimTrue || frac(p.x, p.y).eq(less),
          reasons: [
            p.claimTrue
              ? {
                  text: `True. ${big} = ${whole} ${u.small}, and ${slash(p.x, whole)} = ${less.toString()}.`,
                  correct: true,
                }
              : {
                  text: `False. The units must match: ${big} = ${whole} ${u.small}, so it is ${slash(p.x, whole)} = ${less.toString()}.`,
                  correct: true,
                },
            p.claimTrue
              ? {
                  text: `False. It is ${slash(p.x, p.y)}: put one number over the other.`,
                  code: "RAT.FRACTION.UNITS",
                }
              : { text: "True. Put one number over the other.", code: "RAT.FRACTION.UNITS" },
            {
              text: p.claimTrue
                ? "False. You cannot compare different units."
                : "True. Fractions do not have units.",
            },
          ],
          solution: [{ say: `${big} = ${whole} ${u.small}.` }],
        });
    }
  },

  verify(p, question) {
    const u = UNITS[p.unit];
    const a = question.parts[0]?.answer;
    if (!u || a?.type !== "exact") return question.archetype === "true-or-false-why";
    const want = question.key.depth === 1 ? frac(p.x, u.factor * p.y) : frac(u.factor * p.y, p.x);
    return String(a.value) === toLatex(want);
  },
});
