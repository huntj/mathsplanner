/**
 * @statement Y6-MEA-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-MEA-02: Use, read, write and convert between standard units, converting measurements of length,
// mass, volume and time from a smaller unit of measure to a larger unit, and vice versa
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  kind: number;
  n: number;
  pairs: number[];
  order: [number, number, number];
}

// [small, big, factor, amount in small units, wrong factor]
const KINDS: [string, string, number, number[], number][] = [
  ["ml", "l", 1000, [4500, 750, 2250, 1250], 100],
  ["g", "kg", 1000, [3200, 450, 1750, 2050], 100],
  ["cm", "m", 100, [350, 45, 1250, 205], 10],
  ["mm", "cm", 10, [45, 125, 8, 302], 100],
  ["minutes", "hours", 60, [150, 90, 210, 270], 100],
  ["hours", "days", 24, [72, 36, 60, 108], 12],
];
const r = (x: number) => Math.round(x * 1000) / 1000;

export default defineGenerator<Params>({
  id: "Y6-MEA-02",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.CONVERT.FACTOR", "MEA.TIME.DECIMAL", "NPV.DECIMAL.LONGER-BIGGER"],

  params(rng) {
    return {
      kind: rng.int(0, KINDS.length - 1),
      n: rng.int(0, 3),
      pairs: rng.shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3),
      order: rng.shuffle([0.25, 0.3, 1.1].map((x) => x * 1000)) as [number, number, number],
    };
  },

  build(p, depth, rng): QuestionDraft {
    const [small, big, factor, amounts, slip] = (KINDS[p.kind] ??
      KINDS[0]) as (typeof KINDS)[number];
    const amount = amounts[p.n] ?? amounts[0] ?? 0;
    const value = r(amount / factor);
    const code = small === "minutes" ? "MEA.TIME.DECIMAL" : "MEA.CONVERT.FACTOR";
    switch (depth) {
      case 1:
        return A.standard({
          question: `Convert ${amount} ${small} into ${big}.`,
          answer: A.number(value, { units: big }),
          wrong: wrongs(value, [
            {
              code,
              value: A.number(r(amount / slip), { units: big }),
              feedback: `There are ${factor} ${small} in 1 ${big.replace(/s$/, "")}, so divide by ${factor}.`,
            },
          ]),
          solution: [{ say: `${amount} ÷ ${factor} = ${value} ${big}.` }],
        });
      case 2:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: [`${value}\\text{ ${big}}`, "=", amount, `\\text{ ${small}}`],
          hide: 2,
          units: small,
          wrong: wrongs(amount, [
            {
              code,
              value: A.number(r(value * slip)),
              feedback: `1 ${big.replace(/s$/, "")} = ${factor} ${small}, so multiply by ${factor}.`,
            },
          ]),
          solution: [{ say: `${value} × ${factor} = ${amount} ${small}.` }],
        });
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match the measurements that are equal.",
          pairs: p.pairs.map((i) => {
            const [s, b, f, list] = (KINDS[i] ?? KINDS[0]) as (typeof KINDS)[number];
            const a = list[0] ?? 0;
            return [`${a} ${s}`, `${r(a / f)} ${b}`] as [A.RichInput, A.RichInput];
          }),
          solution: [
            {
              say: "1 l = 1000 ml, 1 kg = 1000 g, 1 m = 100 cm, 1 cm = 10 mm, 1 hour = 60 minutes, 1 day = 24 hours.",
            },
          ],
        });
      default: {
        // 0.25 l, 300 ml and 1.1 l in a mix of units.
        const shown = p.order.map((ml) => (ml === 300 ? "300 ml" : `${ml / 1000} l`));
        const sorted = [...p.order].sort((x, y) => x - y);
        const truth = p.order.every((x, i) => x === sorted[i]);
        return A.trueOrFalseWhy({
          rng,
          statement: `Leah says these are in order, smallest first: ${shown.join(", ")}.`,
          truth,
          reasons: [
            {
              text: `${truth ? "True" : "False"}. In millilitres they are ${p.order.join(" ml, ")} ml.`,
              correct: true,
            },
            {
              text: `${truth ? "False" : "True"}. Compare the numbers as they are: ${shown.map((x) => parseFloat(x)).join(", ")}.`,
              code: "MEA.CONVERT.FACTOR",
            },
            {
              text: `${truth ? "False" : "True"}. Numbers with more decimal places are bigger.`,
              code: "NPV.DECIMAL.LONGER-BIGGER",
            },
          ],
          solution: [{ say: `Change all to ml: ${sorted.join(" ml < ")} ml.` }],
        });
      }
    }
  },

  verify(p, question) {
    const [, , factor, amounts] = (KINDS[p.kind] ?? KINDS[0]) as (typeof KINDS)[number];
    const amount = amounts[p.n] ?? 0;
    if (question.archetype === "standard")
      return Math.abs(numberAnswer(question) - amount / factor) < 1e-9;
    if (question.archetype === "missing-value") return numberAnswer(question) === amount;
    return true;
  },
});
