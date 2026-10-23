/**
 * @statement GF-N13.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N13.a: Use standard units of measure
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

const UNITS: [string, string, number, number][] = [
  ["km", "m", 1000, 100],
  ["m", "cm", 100, 1000],
  ["kg", "g", 1000, 100],
  ["litres", "ml", 1000, 100],
  ["cm", "mm", 10, 100],
];
const MINUTES = [6, 12, 15, 18, 24, 30, 36, 42, 45, 48, 54];

interface Params {
  u: number;
  v: number;
  h: number;
  m: number;
}

const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "GF-N13.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.CONVERT.FACTOR", "MEA.TIME.DECIMAL"],

  params(rng) {
    return {
      u: rng.int(0, UNITS.length - 1),
      v: rng.int(11, 999) / 100,
      h: rng.int(1, 9),
      m: rng.pick(MINUTES),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [from, to, f, slip] = UNITS[p.u] ?? ["km", "m", 1000, 100];
        const v = r(p.v * f);
        return A.standard({
          question: [`Convert ${p.v} ${from} to ${to}.`],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.CONVERT.FACTOR",
              value: A.number(r(p.v * slip)),
              feedback: `1 ${from} = ${f} ${to}.`,
            },
            {
              code: "MEA.CONVERT.FACTOR",
              value: A.number(r(p.v / f)),
              feedback: `There are more ${to} than ${from}, so multiply by ${f}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.v} \\times ${f} = ${v}` }],
        });
      }
      case 2: {
        const v = r(p.h + p.m / 60);
        return A.variedForm({
          rng,
          forms: [
            { question: [`Write ${p.h} hours ${p.m} minutes in hours, as a decimal.`] },
            {
              question: [`A film lasts ${p.h} hours ${p.m} minutes.`],
              ask: "How long is it in hours, as a decimal?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "MEA.TIME.DECIMAL",
              value: A.number(r(p.h + p.m / 100)),
              feedback: `There are 60 minutes in an hour: ${p.m} minutes = ${p.m}/60 of an hour.`,
            },
          ]),
          solution: [
            { say: "", math: `${p.m} \\div 60 = ${r(p.m / 60)}, \\text{ so } ${v} \\text{ hours}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Abi says ",
            A.math("1 \\text{ m}^2 = 100 \\text{ cm}^2"),
            " because 1 m = 100 cm.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. A 1 m by 1 m square is 100 cm by 100 cm, so 1 m² = 10 000 cm².",
              correct: true,
            },
            {
              text: "True. Area units convert the same way as lengths.",
              code: "MEA.CONVERT.FACTOR",
            },
            { text: "False. 1 m² = 1000 cm².", code: "MEA.CONVERT.FACTOR" },
          ],
          solution: [{ say: "Square the length factor for area: 100² = 10 000." }],
        });
    }
  },

  verify(p, question) {
    const [, , f] = UNITS[p.u] ?? ["km", "m", 1000];
    if (question.key.depth === 1) return numberAnswer(question) === r(p.v * f);
    if (question.key.depth === 2) return numberAnswer(question) === r(p.h + p.m / 60);
    return true;
  },
});
