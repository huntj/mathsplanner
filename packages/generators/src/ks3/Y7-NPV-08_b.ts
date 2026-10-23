/**
 * @statement Y7-NPV-08.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-08.b: Round to a given number of significant figures
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tex } from "../shared/npv.ts";

interface Params {
  n: number;
  a: number;
  b: number;
}

const sf1 = (n: number) => {
  const p = 10 ** Math.floor(Math.log10(n));
  return Math.round(n / p) * p;
};

export default defineGenerator<Params>({
  id: "Y7-NPV-08.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.PLACE.ZERO-PLACEHOLDER", "NPV.ROUND.DP-SF"],

  params(rng) {
    const p = { n: rng.int(1100, 9400), a: rng.int(1, 8), b: rng.int(1, 9) };
    if (sf1(p.n) === 10000 || sf1(p.n) / 1000 === sf1(p.n) || p.n % 1000 === 0)
      reject("a clear 1 s.f. answer");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = sf1(p.n);
        return A.standard({
          question: ["Round ", A.math(tex(p.n)), " to 1 significant figure."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.PLACE.ZERO-PLACEHOLDER",
              value: A.number(v / 1000),
              feedback: "Keep the number about the same size: fill the other places with zeros.",
            },
          ]),
          solution: [{ say: "", math: `${tex(p.n)} \\approx ${tex(v)}` }],
        });
      }
      case 2: {
        const x = `0.00${p.a}${p.b}`;
        const v = Number(`0.00${p.a + (p.b >= 5 ? 1 : 0)}`);
        return A.variedForm({
          rng,
          forms: [{ question: ["Round ", A.math(x), " to 1 significant figure."] }],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.ROUND.DP-SF",
              value: A.number(Number(Number(x).toFixed(1)) || 0.01),
              feedback:
                "That is decimal places. The first significant figure is the first non-zero digit.",
            },
          ]),
          solution: [{ say: `The first significant figure is ${p.a}: `, math: String(v) }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["A number rounded to 1 significant figure has exactly one non-zero digit."],
          truth: "always",
          reasons: [
            {
              text: `Always. Every other place becomes 0, e.g. ${tex(p.n).replace(/\{,\}/g, ",")} → ${tex(sf1(p.n)).replace(/\{,\}/g, ",")}; even 96 → 100 has one non-zero digit.`,
              correct: true,
            },
            { text: "Sometimes. Zeros at the front count as figures.", code: "NPV.ROUND.DP-SF" },
            { text: "Never. Rounding keeps all the digits." },
          ],
          solution: [{ say: "Significant figures count from the first non-zero digit." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === sf1(p.n);
    if (question.key.depth === 2)
      return numberAnswer(question) === Number(`0.00${p.a + (p.b >= 5 ? 1 : 0)}`);
    return true;
  },
});
