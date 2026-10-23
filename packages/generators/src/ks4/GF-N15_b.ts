/**
 * @statement GF-N15.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N15.b: Round to significant figures
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tex } from "../shared/npv.ts";

interface Params {
  z: number;
  a: number;
  b: number;
  c: number;
  n: number;
}

const small = (p: Params) => {
  const q = Math.round((100 * p.a + 10 * p.b + p.c) / 10);
  return Number(`0.${"0".repeat(p.z)}${q}`);
};

export default defineGenerator<Params>({
  id: "GF-N15.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "NPV.ROUND.DP-SF",
    "NPV.ROUND.SF-LEADING-ZERO",
    "NPV.PLACE.ZERO-PLACEHOLDER",
    "NPV.ROUND.WRONG-PLACE",
  ],

  params(rng) {
    const p = {
      z: rng.int(1, 2),
      a: rng.int(1, 9),
      b: rng.int(0, 9),
      c: rng.int(1, 9),
      n: rng.int(10000, 99999),
    };
    if (p.a === 9 && p.b === 9) reject("no carry into a new place");
    if (Math.round(p.n / 1000) % 10 === 0 || Math.round(p.n / 1000) >= 100)
      reject("a 2 s.f. answer with a non-zero second figure");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const x = `0.${"0".repeat(p.z)}${p.a}${p.b}${p.c}`;
        const v = small(p);
        return A.standard({
          question: ["Round ", A.math(x), " to 2 significant figures."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.ROUND.DP-SF",
              value: A.number(Number(Number(x).toFixed(2))),
              feedback:
                "That is 2 decimal places. Significant figures start at the first non-zero digit.",
            },
          ]),
          solution: [{ say: `The first significant figure is ${p.a}: `, math: String(v) }],
        });
      }
      case 2: {
        const v = Math.round(p.n / 1000) * 1000;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Round ", A.math(tex(p.n)), " to 2 significant figures."] },
            {
              question: [`${tex(p.n).replace(/\{,\}/g, ",")} people went to a festival.`],
              ask: "Write this number to 2 significant figures.",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.PLACE.ZERO-PLACEHOLDER",
              value: A.number(v / 1000),
              feedback: "Keep the number the right size: fill the other places with zeros.",
            },
            {
              code: "NPV.ROUND.WRONG-PLACE",
              value: A.number(Math.round(p.n / 10000) * 10000),
              feedback: "That is 1 significant figure.",
            },
          ]),
          solution: [{ say: "", math: `${tex(p.n)} \\approx ${tex(v)}` }],
        });
      }
      default: {
        const x = `0.0${p.a}0${p.c}`;
        const right = Number(`0.0${p.a}${p.c >= 5 ? 1 : 0}`);
        return A.trueOrFalseWhy({
          rng,
          statement: ["Asha says ", A.math(x), ` to 2 significant figures is 0.0${p.a}.`],
          truth: p.c < 5,
          reasons: [
            p.c >= 5
              ? {
                  text: `False. The first significant figure is ${p.a}; the 0 after it is the second, and it rounds up: ${right}.`,
                  correct: true,
                }
              : {
                  text: `True. The first significant figure is ${p.a}; the second is 0 and stays 0, so it is 0.0${p.a}0, written ${right}.`,
                  correct: true,
                },
            {
              text:
                p.c >= 5
                  ? "True. The zeros do not count, so keep two digits after the point."
                  : "False. Zeros never count as significant figures.",
              code: "NPV.ROUND.SF-LEADING-ZERO",
            },
            {
              text:
                p.c >= 5
                  ? "True. 2 significant figures means 2 decimal places."
                  : "False. It should be 0.07 to 2 decimal places.",
              code: "NPV.ROUND.DP-SF",
            },
          ],
          solution: [
            { say: "Leading zeros are not significant, but zeros between other digits are." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === small(p);
    if (question.key.depth === 2) return numberAnswer(question) === Math.round(p.n / 1000) * 1000;
    return true;
  },
});
