/**
 * @statement GF-N8.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N8.a: Calculate exactly with fractions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "GF-N8.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.ADD.TOPS-AND-BOTTOMS", "FR.DIVIDE.NO-FLIP", "FR.MULTIPLY.ALWAYS-BIGGER"],

  params(rng) {
    const b = rng.int(3, 9);
    const d = rng.int(2, 9);
    const p = { a: rng.int(1, b - 1), b, c: rng.int(1, d - 1), d };
    if (b === d || gcdOf(p.a, b) > 1 || gcdOf(p.c, d) > 1) reject("different simplified fractions");
    if (toLatex(frac(p.a * d - p.c * b, b * d)) === toLatex(frac(p.a - p.c, b - d)))
      reject("a misconception that gives a different answer");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const f = (n: number, d: number) => `\\frac{${n}}{${d}}`;
    switch (depth) {
      case 1: {
        const v = frac(p.a * p.d - p.c * p.b, p.b * p.d);
        return A.standard({
          question: [
            "Work out ",
            A.math(`${f(p.a, p.b)} - ${f(p.c, p.d)}`),
            ", giving your answer as a fraction in its simplest form.",
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.ADD.TOPS-AND-BOTTOMS",
              value: A.exact(frac(p.a - p.c, p.b - p.d)),
              feedback: "Use a common denominator, then subtract only the numerators.",
            },
          ],
          solution: [
            {
              say: "",
              math: `${f(p.a * p.d, p.b * p.d)} - ${f(p.c * p.b, p.b * p.d)} = ${toLatex(v)}`,
            },
          ],
        });
      }
      case 2: {
        const v = frac(p.a * p.d, p.b * p.c);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Work out ",
                A.math(`${f(p.a, p.b)} \\div ${f(p.c, p.d)}`),
                ", giving your answer as a fraction in its simplest form.",
              ],
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.DIVIDE.NO-FLIP",
              value: A.exact(frac(p.a * p.c, p.b * p.d)),
              feedback: `Multiply by the reciprocal of the second fraction: × ${p.d}/${p.c}.`,
            },
          ],
          solution: [{ say: "", math: `${f(p.a, p.b)} \\times ${f(p.d, p.c)} = ${toLatex(v)}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["Multiplying a positive number by a fraction makes it smaller."],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. A proper fraction like ${p.a}/${p.b} makes it smaller, but an improper fraction like ${p.b}/${p.a} makes it bigger.`,
              correct: true,
            },
            { text: "Always. A fraction is a part of something." },
            {
              text: "Never. Multiplying always makes numbers bigger.",
              code: "FR.MULTIPLY.ALWAYS-BIGGER",
            },
          ],
          solution: [{ say: "It depends whether the fraction is less than or more than 1." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return exactAnswer(question) === toLatex(frac(p.a * p.d - p.c * p.b, p.b * p.d));
    if (question.key.depth === 2)
      return exactAnswer(question) === toLatex(frac(p.a * p.d, p.b * p.c));
    return true;
  },
});
