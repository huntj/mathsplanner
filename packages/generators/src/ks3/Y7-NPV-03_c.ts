/**
 * @statement Y7-NPV-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-03.c: Calculate with proper and improper fractions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  a: number;
  c: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-03.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.ADD.TOPS-AND-BOTTOMS", "FR.DIVIDE.MULTIPLIES", "FR.MULTIPLY.ALWAYS-BIGGER"],

  params(rng) {
    const b = rng.int(3, 9);
    const p = { a: rng.int(1, b - 1), c: rng.int(2, b + 3), b, k: rng.int(2, 5) };
    if (p.a + p.c <= p.b || gcdOf(p.a, b) > 1)
      reject("an improper total and a simplified first fraction");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const f = (n: number, d: number) => `\\frac{${n}}{${d}}`;
    switch (depth) {
      case 1: {
        const v = frac(p.a + p.c, p.b);
        return A.standard({
          question: [
            "Work out ",
            A.math(`${f(p.a, p.b)} + ${f(p.c, p.b)}`),
            ". Give your answer as a fraction.",
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.ADD.TOPS-AND-BOTTOMS",
              value: A.exact(frac(p.a + p.c, 2 * p.b)),
              feedback: `The denominators are the same, so they stay as ${p.b}: add only the numerators.`,
            },
          ],
          solution: [{ say: "", math: `${f(p.a + p.c, p.b)} = ${toLatex(v)}` }],
        });
      }
      case 2: {
        const v = frac(p.a, p.b * p.k);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Work out ", A.math(`${f(p.a, p.b)} \\div ${p.k}`), "."] },
            {
              question: [
                A.math(f(p.a, p.b)),
                ` of a pizza is shared equally between ${p.k} people.`,
              ],
              ask: "What fraction of the whole pizza does each person get?",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.DIVIDE.MULTIPLIES",
              value: A.exact(frac(p.a * p.k, p.b)),
              feedback: `Sharing between ${p.k} makes each part smaller: multiply the denominator by ${p.k}.`,
            },
          ],
          solution: [
            { say: "", math: `${f(p.a, p.b)} \\div ${p.k} = ${f(p.a, p.b * p.k)} = ${toLatex(v)}` },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["Multiplying two proper fractions gives an answer smaller than both of them."],
          truth: "always",
          reasons: [
            {
              text: `Always. Taking a part of a part leaves less than either: ${p.a}/${p.b} × ½ = ${p.a}/${2 * p.b}.`,
              correct: true,
            },
            {
              text: "Never. Multiplying always makes things bigger.",
              code: "FR.MULTIPLY.ALWAYS-BIGGER",
            },
            { text: "Sometimes. Only when the denominators are the same." },
          ],
          solution: [
            { say: "Multiplying by a number less than 1 makes a positive number smaller." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(p.a + p.c, p.b));
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(p.a, p.b * p.k));
    return true;
  },
});
