/**
 * @statement Y4-MEA-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y4-MEA-01: Convert between different units of measure [for example, kilometre to metre; hour to
// minute]
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  pair: number;
  n: number;
  pairs: number[];
  claimTrue: boolean;
}

// [big unit, small unit, factor, a wrong factor students use]
const PAIRS: [string, string, number, number][] = [
  ["km", "m", 1000, 100],
  ["m", "cm", 100, 10],
  ["cm", "mm", 10, 100],
  ["kg", "g", 1000, 100],
  ["litres", "ml", 1000, 100],
  ["hours", "minutes", 60, 100],
  ["minutes", "seconds", 60, 100],
];

export default defineGenerator<Params>({
  id: "Y4-MEA-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["MEA.CONVERT.FACTOR", "MEA.TIME.FACTS"],

  params(rng, numbers) {
    return {
      pair: rng.int(0, PAIRS.length - 1),
      n: rng.int(2, numbers === "friendly" ? 5 : numbers === "standard" ? 9 : 15),
      pairs: rng.shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const [big, small, factor, slip] = (PAIRS[p.pair] ?? PAIRS[0]) as (typeof PAIRS)[number];
    const code = factor === 60 ? "MEA.TIME.FACTS" : "MEA.CONVERT.FACTOR";
    switch (depth) {
      case 1:
        return A.standard({
          question: `Convert ${p.n} ${big} into ${small}.`,
          answer: A.number(p.n * factor, { units: small }),
          wrong: wrongs(p.n * factor, [
            {
              code,
              value: A.number(p.n * slip, { units: small }),
              feedback: `1 ${big.replace(/s$/, "")} = ${factor} ${small}, so multiply by ${factor}.`,
            },
          ]),
          solution: [
            {
              say: `1 ${big.replace(/s$/, "")} = ${factor} ${small}, so ${p.n} × ${factor} = ${p.n * factor} ${small}.`,
            },
          ],
        });
      case 2:
        return A.standard({
          question: `Convert ${p.n * factor} ${small} into ${big}.`,
          answer: A.number(p.n, { units: big }),
          wrong: wrongs(p.n, [
            {
              code,
              value: A.number((p.n * factor) / slip, { units: big }),
              feedback: `There are ${factor} ${small} in 1 ${big.replace(/s$/, "")}, so divide by ${factor}.`,
            },
          ]),
          solution: [{ say: `${p.n * factor} ÷ ${factor} = ${p.n} ${big}.` }],
        });
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match the measurements that are equal.",
          pairs: p.pairs.map((i) => {
            const [b, s, f] = (PAIRS[i] ?? PAIRS[0]) as (typeof PAIRS)[number];
            return [`${p.n} ${b}`, `${p.n * f} ${s}`] as [A.RichInput, A.RichInput];
          }),
          solution: [
            {
              say: "1 km = 1000 m, 1 m = 100 cm, 1 cm = 10 mm, 1 kg = 1000 g, 1 litre = 1000 ml, 1 hour = 60 minutes.",
            },
          ],
        });
      default: {
        const said = p.claimTrue ? p.n * factor : p.n * slip;
        return A.trueOrFalseWhy({
          rng,
          statement: `Eli says ${p.n} ${big} is the same as ${said} ${small}.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. 1 ${big.replace(/s$/, "")} = ${factor} ${small}, and ${p.n} × ${factor} = ${said}.`,
                  correct: true,
                },
                { text: `False. 1 ${big.replace(/s$/, "")} = ${slip} ${small}.`, code },
                {
                  text: `False. You divide by ${factor} to change ${big} to ${small}.`,
                  code: "MEA.CONVERT.FACTOR",
                },
              ]
            : [
                {
                  text: `False. 1 ${big.replace(/s$/, "")} = ${factor} ${small}, so it is ${p.n * factor} ${small}.`,
                  correct: true,
                },
                { text: `True. 1 ${big.replace(/s$/, "")} = ${slip} ${small}.`, code },
                {
                  text: "True. You always multiply by 100 to convert.",
                  code: "MEA.CONVERT.FACTOR",
                },
              ],
          solution: [{ say: `${p.n} × ${factor} = ${p.n * factor} ${small}.` }],
        });
      }
    }
  },

  verify(p, question) {
    const [, , factor] = (PAIRS[p.pair] ?? PAIRS[0]) as (typeof PAIRS)[number];
    if (question.archetype !== "standard") return true;
    const n = numberAnswer(question);
    return n === p.n * factor || n === p.n;
  },
});
