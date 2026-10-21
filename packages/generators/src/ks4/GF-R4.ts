/**
 * @statement GF-R4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R4: Use ratio notation, including reduction to simplest form
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  cm: number;
  m: number;
  claimTrue: boolean;
}

const g = (x: number, y: number): number => (y === 0 ? x : g(y, x % y));

export default defineGenerator<Params>({
  id: "GF-R4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.SIMPLIFY.SUBTRACT", "RAT.FRACTION.UNITS", "RAT.ORDER"],

  params(rng) {
    const a = rng.int(1, 9);
    const b = rng.int(2, 9);
    const k = rng.int(2, 12);
    const cm = rng.int(1, 9) * 10;
    const m = rng.int(1, 4);
    if (a === b || g(a, b) !== 1 || (cm * 1) % 100 === 0)
      reject("a simplest-form ratio and a cm length under a metre");
    return { a, b, k, cm, m, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = p.a * p.k;
        const y = p.b * p.k;
        const sub = Math.min(x, y) - 1;
        // Dividing by only part of the common factor.
        const part = [2, 3, 5, 7].find((q) => p.k % q === 0 && q < p.k);
        const right = `${p.a} : ${p.b}`;
        return A.choice({
          rng,
          question: ["Write ", A.math(`${x} : ${y}`), " in its simplest form."],
          correct: right,
          distractors: [
            {
              content: `${x - sub} : ${y - sub}`,
              code: "RAT.SIMPLIFY.SUBTRACT",
              feedback: "Divide both parts by the same number; do not subtract.",
            },
            {
              content: `${p.b} : ${p.a}`,
              code: "RAT.ORDER",
              feedback: "Keep the parts in the same order.",
            },
            ...(part
              ? [
                  {
                    content: `${x / part} : ${y / part}`,
                    feedback: "Keep dividing until the parts have no common factor.",
                  },
                ]
              : []),
          ].filter(
            (d, i, all) =>
              d.content !== right && all.findIndex((e) => e.content === d.content) === i,
          ),
          solution: [{ say: `Divide both parts by ${p.k}: ${right}.` }],
        });
      }
      case 2: {
        const cm2 = p.m * 100;
        const h = g(p.cm, cm2);
        const right = `${p.cm / h} : ${cm2 / h}`;
        const wrongH = g(p.cm, p.m);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Write the ratio ${p.cm} cm : ${p.m} m in its simplest form.`,
          correct: right,
          distractors: [
            {
              content: `${p.cm / wrongH} : ${p.m / wrongH}`,
              code: "RAT.FRACTION.UNITS",
              feedback: `Change both to the same units first: ${p.m} m = ${cm2} cm.`,
            },
            {
              content: `${cm2 / h} : ${p.cm / h}`,
              code: "RAT.ORDER",
              feedback: "Keep the order: cm first.",
            },
          ].filter(
            (d, i, all) =>
              d.content !== right && all.findIndex((e) => e.content === d.content) === i,
          ),
          solution: [{ say: `${p.m} m = ${cm2} cm, so ${p.cm} : ${cm2} = ${right}.` }],
        });
      }
      default: {
        const shown = p.claimTrue ? `${p.a} : ${p.b}` : `${p.b} : ${p.a}`;
        return A.trueOrFalseWhy({
          rng,
          statement: `There are ${p.a * p.k} boys and ${p.b * p.k} girls in a club. Sam says the ratio of boys to girls is ${shown}.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. ${p.a * p.k} : ${p.b * p.k}, dividing both by ${p.k}, is ${p.a} : ${p.b}, boys first.`,
                  correct: true,
                },
                {
                  text: `False. The order does not matter, but it should be ${p.b} : ${p.a}.`,
                  code: "RAT.ORDER",
                },
                { text: "False. Ratios must be written as fractions." },
              ]
            : [
                {
                  text: `False. That is girls to boys. Boys to girls is ${p.a} : ${p.b}.`,
                  correct: true,
                },
                { text: "True. The order of a ratio does not matter.", code: "RAT.ORDER" },
                { text: "True. The bigger number always comes first.", code: "RAT.ORDER" },
              ],
          solution: [{ say: `Boys : girls = ${p.a * p.k} : ${p.b * p.k} = ${p.a} : ${p.b}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === `${p.a} : ${p.b}`;
    if (question.archetype === "varied-form") {
      const h = g(p.cm, p.m * 100);
      return chosenText(question) === `${p.cm / h} : ${(p.m * 100) / h}`;
    }
    return true;
  },
});
