/**
 * @statement AL-P6.5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P6.5: Use the laws of logarithms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  a: number;
  b: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "AL-P6.5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LOG.LAWS"],

  params(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(2, 9);
    const c = rng.int(2, 6);
    if (a === 2 || (a * b) % c !== 0 || a * b === c || a + b - c <= 1 || (a * b) / c === a + b - c)
      reject("a whole-number result that differs from adding");
    return { a, b, c };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Write ",
            A.math(`\\log ${p.a} + \\log ${p.b} - \\log ${p.c}`),
            " as a single logarithm.",
          ],
          answer: A.exact(`\\log ${(p.a * p.b) / p.c}`),
          wrong: [
            {
              code: "ALG.LOG.LAWS",
              value: A.exact(`\\log ${p.a + p.b - p.c}`),
              feedback: "Adding logs multiplies the numbers; subtracting divides.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\log\\frac{${p.a} \\times ${p.b}}{${p.c}} = \\log ${(p.a * p.b) / p.c}`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Write ",
                A.math(`2\\log ${p.a} + \\log ${p.b}`),
                " as a single logarithm.",
              ],
            },
            {
              question: [
                "Express ",
                A.math(`2\\log ${p.a} + \\log ${p.b}`),
                " in the form ",
                A.math("\\log k"),
                ".",
              ],
            },
          ],
          answer: A.exact(`\\log ${p.a * p.a * p.b}`),
          wrong: [
            {
              code: "ALG.LOG.LAWS",
              value: A.exact(`\\log ${2 * p.a * p.b}`),
              feedback: `2 log ${p.a} = log ${p.a}² = log ${p.a * p.a}, not log ${2 * p.a}.`,
            },
          ],
          solution: [{ say: "", math: `\\log ${p.a}^2 + \\log ${p.b} = \\log ${p.a * p.a * p.b}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Joe says ",
            A.math(`\\log(${p.a} + ${p.b}) = \\log ${p.a} + \\log ${p.b}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. log ${p.a} + log ${p.b} = log ${p.a * p.b}; there is no law for the log of a sum.`,
              correct: true,
            },
            { text: "True. The log of a sum is the sum of the logs.", code: "ALG.LOG.LAWS" },
            { text: `True. Both sides equal log ${p.a + p.b}.`, code: "ALG.LOG.LAWS" },
          ],
          solution: [
            { say: "log a + log b = log(ab), log a − log b = log(a/b), n log a = log aⁿ." },
          ],
        });
    }
  },

  verify() {
    return true;
  },
});
