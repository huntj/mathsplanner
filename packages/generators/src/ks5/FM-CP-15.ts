/**
 * @statement FM-CP-15
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-15: Sum series using the method of differences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  n: number;
}

const frac = (num: number, den: number) => {
  const g = gcdOf(Math.abs(num), Math.abs(den));
  return `\\frac{${num / g}}{${den / g}}`;
};

export default defineGenerator<Params>({
  id: "FM-CP-15",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SERIES.DIFFERENCES"],

  params(rng) {
    return { n: rng.int(5, 40) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.n;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Use ",
            A.math("\\frac{1}{r(r+1)} = \\frac{1}{r} - \\frac{1}{r+1}"),
            " to find ",
            A.math(`\\sum_{r=1}^{${n}} \\frac{1}{r(r+1)}`),
            " as a fraction.",
          ],
          answer: A.exact(frac(n, n + 1)),
          wrong: [
            {
              code: "ALG.SERIES.DIFFERENCES",
              value: A.exact(frac(n - 1, n)),
              feedback: `Everything cancels except the first term 1 and the last term −1/${n + 1}.`,
            },
          ],
          solution: [{ say: "", math: `1 - \\frac{1}{${n + 1}} = ${frac(n, n + 1)}` }],
        });
      case 2: {
        // ½(1 + ½ − 1/(n+1) − 1/(n+2)) = ½ × (3(n+1)(n+2) − 2(n+2) − 2(n+1)) / (2(n+1)(n+2))
        const inner = 3 * (n + 1) * (n + 2) - 2 * (n + 2) - 2 * (n + 1);
        const den = 2 * (n + 1) * (n + 2);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Use ",
                A.math(
                  "\\frac{1}{r(r+2)} = \\frac{1}{2}\\left(\\frac{1}{r} - \\frac{1}{r+2}\\right)",
                ),
                " to find ",
                A.math(`\\sum_{r=1}^{${n}} \\frac{1}{r(r+2)}`),
                " as a fraction.",
              ],
            },
          ],
          answer: A.exact(frac(inner, 2 * den)),
          wrong: [
            {
              code: "ALG.SERIES.DIFFERENCES",
              value: A.exact(frac(inner, den)),
              feedback: "Keep the factor ½ from the partial fractions.",
            },
          ],
          solution: [
            { say: `The terms left after cancelling are 1, ½, −1/${n + 1} and −1/${n + 2}.` },
            {
              say: "",
              math: `\\frac{1}{2}\\left(\\frac{3}{2} - \\frac{1}{${n + 1}} - \\frac{1}{${n + 2}}\\right) = ${frac(inner, 2 * den)}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Gus says ",
            A.math("\\sum_{r=1}^{n} \\big(f(r+1) - f(r)\\big) = f(n) - f(1)"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Writing out the terms, f(2) − f(1) + f(3) − f(2) + … + f(n + 1) − f(n) leaves f(n + 1) − f(1).",
              correct: true,
            },
            {
              text: "True. The sum runs from 1 to n, so the ends are f(1) and f(n).",
              code: "ALG.SERIES.DIFFERENCES",
            },
            { text: "False. Nothing cancels in a sum like this.", code: "ALG.SERIES.DIFFERENCES" },
          ],
          solution: [{ say: "Write out the first and last few terms to see what survives." }],
        });
    }
  },

  verify(p, question) {
    // Add the terms directly as a check on the telescoped total.
    let s = 0;
    for (let r = 1; r <= p.n; r++)
      s += question.key.depth === 2 ? 1 / (r * (r + 2)) : 1 / (r * (r + 1));
    const [num, den] = exactAnswer(question).match(/\d+/g)?.map(Number) ?? [0, 1];
    if (question.key.depth === 1 || question.key.depth === 2)
      return Math.abs(s - (num ?? 0) / (den ?? 1)) < 1e-9;
    return true;
  },
});
