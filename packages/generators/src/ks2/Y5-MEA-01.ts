/**
 * @statement Y5-MEA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MEA-01: Convert between different units of metric measure (for example, kilometre and metre;
// centimetre and metre; centimetre and millimetre; gram and kilogram; litre and millilitre)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

export interface Params {
  pair: number;
  /** The amount in the big unit, in tenths or hundredths. */
  n: number;
  /** Depth 2: a near value in the small unit for comparing. */
  near: number;
  pairs: number[];
  claimTrue: boolean;
}

const PAIRS: [string, string, number][] = [
  ["km", "m", 1000],
  ["m", "cm", 100],
  ["cm", "mm", 10],
  ["kg", "g", 1000],
  ["l", "ml", 1000],
];
const r = (x: number) => Math.round(x * 1000) / 1000;

export default defineGenerator<Params>({
  id: "Y5-MEA-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.CONVERT.FACTOR"],

  params(rng, numbers) {
    const pair = rng.int(0, PAIRS.length - 1);
    const factor = ((PAIRS[pair] ?? PAIRS[0]) as (typeof PAIRS)[number])[2];
    const dp = numbers === "friendly" || factor === 10 ? 1 : 2;
    const n = r(rng.int(11, 99) / 10 ** dp + (dp === 2 ? rng.int(0, 4) : 0));
    if (Number.isInteger(n)) reject("a decimal amount");
    const near = r(n * factor + rng.pick([-1, 1]) * rng.int(1, 9) * (factor / 100 || 1));
    if (near <= 0 || near === n * factor) reject("a different value to compare");
    return {
      pair,
      n,
      near,
      pairs: rng.shuffle([0, 1, 2, 3, 4]).slice(0, 3),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const [big, small, factor] = (PAIRS[p.pair] ?? PAIRS[0]) as (typeof PAIRS)[number];
    const value = r(p.n * factor);
    const slip = factor === 10 ? 100 : factor === 100 ? 10 : 100;
    switch (depth) {
      case 1:
        return A.standard({
          question: `Convert ${p.n} ${big} into ${small}.`,
          answer: A.number(value, { units: small }),
          wrong: wrongs(value, [
            {
              code: "MEA.CONVERT.FACTOR",
              value: A.number(r(p.n * slip), { units: small }),
              feedback: `1 ${big} = ${factor} ${small}, so multiply by ${factor}.`,
            },
          ]),
          solution: [{ say: `${p.n} × ${factor} = ${value} ${small}.` }],
        });
      case 2: {
        const bigger = value > p.near ? `${p.n} ${big}` : `${p.near} ${small}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Which is more: ${p.n} ${big} or ${p.near} ${small}?`,
          correct: bigger,
          distractors: [
            {
              content: value > p.near ? `${p.near} ${small}` : `${p.n} ${big}`,
              code: "MEA.CONVERT.FACTOR",
              feedback: `Change to the same unit: ${p.n} ${big} = ${value} ${small}.`,
            },
          ],
          solution: [
            {
              say: `${p.n} ${big} = ${value} ${small}, so compare ${value} ${small} with ${p.near} ${small}.`,
            },
          ],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match the measurements that are equal.",
          pairs: p.pairs.map((i) => {
            const [b, s, f] = (PAIRS[i] ?? PAIRS[0]) as (typeof PAIRS)[number];
            const amount = f === 10 ? 4.5 : 2.5;
            return [`${amount} ${b}`, `${r(amount * f)} ${s}`] as [A.RichInput, A.RichInput];
          }),
          solution: [
            { say: "1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1000 g, 1 l = 1000 ml." },
          ],
        });
      default: {
        const said = p.claimTrue ? value : r(p.n * slip);
        return A.trueOrFalseWhy({
          rng,
          statement: `Ruby says ${p.n} ${big} = ${said} ${small}.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. 1 ${big} = ${factor} ${small}, and ${p.n} × ${factor} = ${value}.`,
                  correct: true,
                },
                { text: `False. 1 ${big} = ${slip} ${small}.`, code: "MEA.CONVERT.FACTOR" },
                {
                  text: `False. Divide by ${factor} to change ${big} into ${small}.`,
                  code: "MEA.CONVERT.FACTOR",
                },
              ]
            : [
                {
                  text: `False. 1 ${big} = ${factor} ${small}, so ${p.n} ${big} = ${value} ${small}.`,
                  correct: true,
                },
                { text: `True. 1 ${big} = ${slip} ${small}.`, code: "MEA.CONVERT.FACTOR" },
                {
                  text: "True. Moving the point two places always converts.",
                  code: "MEA.CONVERT.FACTOR",
                },
              ],
          solution: [{ say: `${p.n} × ${factor} = ${value}.` }],
        });
      }
    }
  },

  verify(p, question) {
    const [big, small, factor] = (PAIRS[p.pair] ?? PAIRS[0]) as (typeof PAIRS)[number];
    const value = r(p.n * factor);
    if (question.archetype === "standard") return numberAnswer(question) === value;
    if (question.archetype === "varied-form")
      return chosenText(question) === (value > p.near ? `${p.n} ${big}` : `${p.near} ${small}`);
    return true;
  },
});
