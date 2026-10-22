/**
 * @statement FM-FS2-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS2-03: Use continuous random variables with pdfs and cdfs, including the continuous uniform
// distribution
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "FM-FS2-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.PDF"],

  params(rng) {
    const p = { a: rng.int(2, 8), b: rng.int(1, 7) };
    // At b = 2 the density slip 2b/a² equals b²/a².
    if (p.b >= p.a || p.b === 2) reject("b inside the range where the slip differs");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const pdf = A.math(
      `f(x) = \\begin{cases} kx & 0 \\le x \\le ${p.a} \\\\ 0 & \\text{otherwise} \\end{cases}`,
    );
    switch (depth) {
      case 1: {
        const k = toLatex(frac(2, p.a * p.a));
        return A.standard({
          question: ["A continuous random variable X has probability density function ", pdf],
          ask: "Find the exact value of k.",
          answer: A.exact(k),
          wrong: [
            {
              code: "PRO.PDF",
              value: A.exact(toLatex(frac(1, p.a * p.a))),
              feedback: `The total area is ∫₀^${p.a} kx dx = k × ${p.a * p.a}/2, and it must equal 1.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\int_0^{${p.a}} kx\\,dx = \\frac{${p.a * p.a}k}{2} = 1 \\Rightarrow k = ${k}`,
            },
          ],
        });
      }
      case 2: {
        const v = toLatex(frac(p.b * p.b, p.a * p.a));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A continuous random variable X has probability density function ",
                A.math(`f(x) = \\frac{2x}{${p.a * p.a}}`),
                " for ",
                A.math(`0 \\le x \\le ${p.a}`),
                ", and 0 otherwise.",
              ],
              ask: ["Find the exact value of ", A.math(`P(X < ${p.b})`), "."],
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "PRO.PDF",
              value: A.exact(toLatex(frac(2 * p.b, p.a * p.a))),
              feedback: `f(${p.b}) is a density, not a probability. Integrate from 0 to ${p.b}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\int_0^{${p.b}} \\frac{2x}{${p.a * p.a}}\\,dx = \\frac{${p.b * p.b}}{${p.a * p.a}} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Xia says a probability density function can never take a value greater than 1.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Only the area under f must be 1. For example, the uniform distribution on [0, 1/${p.a}] has f(x) = ${p.a}.`,
              correct: true,
            },
            {
              text: "True. f(x) is a probability, and probabilities are at most 1.",
              code: "PRO.PDF",
            },
            {
              text: "True. Otherwise the total probability would be more than 1.",
              code: "PRO.PDF",
            },
          ],
          solution: [{ say: "Probabilities are areas under f, not values of f." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === toLatex(frac(2, p.a * p.a));
    if (question.key.depth === 2)
      return exactAnswer(question) === toLatex(frac(p.b * p.b, p.a * p.a));
    return true;
  },
});
