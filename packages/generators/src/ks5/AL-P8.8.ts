/**
 * @statement AL-P8.8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P8.8: Integrate using partial fractions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** A/(x − a) + B/(x − b), integrated from lo to hi (both above a and b). */
  A: number;
  B: number;
  a: number;
  b: number;
  lo: number;
}

const r3 = (x: number) => Math.round(x * 1000) / 1000;

export default defineGenerator<Params>({
  id: "AL-P8.8",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.PARTIAL.COVER-UP", "CALC.STANDARD-INTEGRAL"],

  params(rng) {
    const a = rng.int(-3, 1);
    const b = rng.int(-3, 1);
    const p = { A: rng.int(1, 5), B: rng.int(-4, 4), a, b, lo: Math.max(a, b) + rng.int(1, 3) };
    if (p.B === 0 || a === b || p.A === p.B || p.A === -p.B) reject("two different parts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const hi = p.lo + 2;
    const I = (A: number, B: number) =>
      A * Math.log((hi - p.a) / (p.lo - p.a)) + B * Math.log((hi - p.b) / (p.lo - p.b));
    const top = poly([p.A + p.B, -(p.A * p.b + p.B * p.a)]);
    const integrand = `\\frac{${top}}{${bracket(-p.a)}${bracket(-p.b)}}`;
    switch (depth) {
      case 1: {
        const v = r3(I(p.A, p.B));
        return A.standard({
          question: [
            "Given that ",
            A.math(
              `${integrand} \\equiv \\frac{${p.A}}{${bracket(-p.a).replace(/[()]/g, "")}} ${p.B < 0 ? "-" : "+"} \\frac{${Math.abs(p.B)}}{${bracket(-p.b).replace(/[()]/g, "")}}`,
            ),
            ", evaluate ",
            A.math(`\\int_{${p.lo}}^{${hi}} ${integrand}\\,dx`),
            " to 3 decimal places.",
          ],
          answer: A.number(v, { accuracy: { dp: 3 } }),
          wrong: signedWrongs(v, [
            {
              code: "CALC.STANDARD-INTEGRAL",
              value: A.number(
                r3(Math.log((hi - p.a) / (p.lo - p.a)) + Math.log((hi - p.b) / (p.lo - p.b))),
                { accuracy: { dp: 3 } },
              ),
              feedback: "Keep the coefficients: ∫ A/(x − a) dx = A ln|x − a|.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\left[${p.A}\\ln|${bracket(-p.a).replace(/[()]/g, "")}| ${p.B < 0 ? "-" : "+"} ${Math.abs(p.B)}\\ln|${bracket(-p.b).replace(/[()]/g, "")}|\\right]_{${p.lo}}^{${hi}} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = r3(I(p.A, p.B));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Use partial fractions to evaluate ",
                A.math(`\\int_{${p.lo}}^{${hi}} ${integrand}\\,dx`),
                ", giving your answer to 3 decimal places.",
              ],
            },
          ],
          answer: A.number(v, { accuracy: { dp: 3 } }),
          wrong: signedWrongs(v, [
            {
              code: "ALG.PARTIAL.COVER-UP",
              value: A.number(r3(I(p.A, -p.B)), { accuracy: { dp: 3 } }),
              feedback:
                "Check the second coefficient with the cover-up rule, keeping track of signs.",
            },
          ]),
          solution: [
            {
              say: `Partial fractions: ${p.A}/(x − ${p.a}) + ${p.B}/(x − ${p.b}). Integrate to logs and evaluate: ${v}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Abe says ", A.math("\\int \\frac{1}{x + 2}\\,dx = \\ln x + 2 + c"), "."],
          truth: false,
          reasons: [
            {
              text: "False. ∫ 1/(x + 2) dx = ln|x + 2| + c: the whole bracket goes inside the log.",
              correct: true,
            },
            { text: "True. Integrate 1/x and keep the + 2.", code: "CALC.STANDARD-INTEGRAL" },
            { text: "False. It is 1/(x + 2)² + c.", code: "CALC.STANDARD-INTEGRAL" },
          ],
          solution: [{ say: "d/dx ln(x + 2) = 1/(x + 2)." }],
        });
    }
  },

  verify(p, question) {
    const hi = p.lo + 2;
    const v = r3(
      p.A * Math.log((hi - p.a) / (p.lo - p.a)) + p.B * Math.log((hi - p.b) / (p.lo - p.b)),
    );
    if (question.key.depth === 1 || question.key.depth === 2) return numberAnswer(question) === v;
    return true;
  },
});
