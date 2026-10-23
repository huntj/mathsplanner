/**
 * @statement GF-A4.f
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GF-A4 sub-statements
 */
// GF-A4.f: Factorise the difference of two squares
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  k: number;
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GF-A4.f",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FACTORISE.SIGNS"],

  params(rng, numbers) {
    const p = {
      k: rng.int(2, numbers === "stretch" ? 15 : 10),
      a: rng.int(2, 6),
      b: rng.int(1, 9),
    };
    if (gcdOf(p.a, p.b) !== 1) reject("a fully factorised answer");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = `(x - ${p.k})(x + ${p.k})`;
        return A.standard({
          question: ["Factorise ", A.math(`x^2 - ${p.k * p.k}`), "."],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(`(x - ${p.k})^2`),
              feedback: `(x − ${p.k})² = x² − ${2 * p.k}x + ${p.k * p.k}. Use brackets whose middle terms cancel.`,
            },
          ],
          solution: [{ say: `x² − ${p.k}² is a difference of two squares: `, math: right }],
        });
      }
      case 2: {
        const ax = `${p.a}x`;
        const right = `(${ax} - ${p.b})(${ax} + ${p.b})`;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Factorise ", A.math(`${p.a * p.a}x^2 - ${p.b * p.b}`), "."] },
            { question: ["Fully factorise ", A.math(`${p.a * p.a}x^2 - ${p.b * p.b}`), "."] },
          ],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(`(${ax} - ${p.b})^2`),
              feedback: `${p.a * p.a}x² = (${ax})² and ${p.b * p.b} = ${p.b}²: one bracket has +, the other −.`,
            },
          ],
          solution: [{ say: `(${ax})² − ${p.b}² = `, math: right }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["For a number x, ", A.math(`x^2 + ${p.k * p.k} = (x + ${p.k})(x - ${p.k})`), "."],
          truth: "never",
          reasons: [
            {
              text: `Never. (x + ${p.k})(x − ${p.k}) = x² − ${p.k * p.k}, which is always ${2 * p.k * p.k} less than x² + ${p.k * p.k}.`,
              correct: true,
            },
            {
              text: "Always. A sum of two squares factorises like a difference.",
              code: "ALG.FACTORISE.SIGNS",
            },
            { text: "Sometimes. It is true when x = 0." },
          ],
          solution: [
            {
              say: "Only a difference of two squares factorises this way; a sum of two squares does not.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return a?.type === "exact" && a.value === `(x - ${p.k})(x + ${p.k})`;
    return true;
  },
});
