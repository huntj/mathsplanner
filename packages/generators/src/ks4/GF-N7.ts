/**
 * @statement GF-N7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N7: Calculate with roots, and with integer indices
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  base: number;
  m: number;
  n: number;
  k: number;
  claim: number;
}

const CLAIMS: { latex: string; truth: boolean; why: string; code?: string }[] = [
  {
    latex: "7^0 = 0",
    truth: false,
    why: "Any non-zero number to the power 0 is 1: 7³ ÷ 7³ = 7⁰ = 1.",
    code: "NPV.INDEX.ZERO",
  },
  {
    latex: "2^{-3} = -8",
    truth: false,
    why: "A negative index means a reciprocal: 2⁻³ = 1/2³ = 1/8.",
    code: "NPV.INDEX.NEGATIVE",
  },
  { latex: "5^{-1} = \\frac{1}{5}", truth: true, why: "A power of −1 gives the reciprocal." },
  { latex: "10^0 = 1", truth: true, why: "10² ÷ 10² = 10⁰, and anything divided by itself is 1." },
];

export default defineGenerator<Params>({
  id: "GF-N7",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["ALG.INDICES.MULTIPLY", "NPV.INDEX.NEGATIVE", "NPV.INDEX.ZERO"],

  params(rng) {
    const base = rng.pick([2, 3, 5, 10]);
    const m = rng.int(2, 6);
    const n = rng.int(2, 5);
    const k = rng.int(2, base === 2 ? 5 : 3);
    if (m === n) reject("different powers");
    return { base, m, n, k, claim: rng.int(0, CLAIMS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = `${p.base}^{${p.m + p.n}}`;
        return A.standard({
          question: [
            "Write ",
            A.math(`${p.base}^{${p.m}} \\times ${p.base}^{${p.n}}`),
            " as a single power of " + p.base + ".",
          ],
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.INDICES.MULTIPLY",
              value: A.exact(`${p.base}^{${p.m * p.n}}`),
              feedback: "When multiplying powers of the same base, add the indices.",
            },
          ],
          solution: [{ say: "Add the indices: ", math: `${p.base}^{${p.m}+${p.n}} = ${right}` }],
        });
      }
      case 2: {
        const right = frac(1, p.base ** p.k);
        return A.standard({
          question: [
            "Work out ",
            A.math(`${p.base}^{-${p.k}}`),
            ". Give your answer as a fraction.",
          ],
          answer: A.exact(right),
          wrong: [
            {
              code: "NPV.INDEX.NEGATIVE",
              value: A.exact(-(p.base ** p.k)),
              feedback:
                "A negative index does not make the number negative; it means the reciprocal.",
            },
          ],
          solution: [
            {
              say: "",
              math: `${p.base}^{-${p.k}} = \\frac{1}{${p.base}^{${p.k}}} = ${toLatex(right)}`,
            },
          ],
        });
      }
      case 4: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: ["Is this true? ", A.math(c.latex)],
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. A power of 0 always gives 0.`,
              code: "NPV.INDEX.ZERO",
            },
            {
              text: `${c.truth ? "False" : "True"}. A negative index makes the answer negative.`,
              code: "NPV.INDEX.NEGATIVE",
            },
          ],
          solution: [{ say: "a⁰ = 1 and a⁻ⁿ = 1/aⁿ, from the division law for indices." }],
        });
      }
      default: {
        const top = p.m + p.n;
        const e = top - p.k;
        return A.multiStepContext({
          context: [
            "Simplify ",
            A.math(`\\frac{${p.base}^{${p.m}} \\times ${p.base}^{${p.n}}}{${p.base}^{${p.k}}}`),
            ".",
          ],
          parts: [
            {
              ask: ["Write the numerator as a single power of " + p.base + "."],
              answer: A.exact(`${p.base}^{${top}}`),
              wrong: [
                {
                  code: "ALG.INDICES.MULTIPLY",
                  value: A.exact(`${p.base}^{${p.m * p.n}}`),
                  feedback: "Add the indices when multiplying.",
                },
              ],
            },
            {
              ask: ["Write the whole expression as a single power of " + p.base + "."],
              answer: A.exact(`${p.base}^{${e}}`),
            },
          ],
          solution: [
            {
              say: "",
              math: `${p.base}^{${top}} \\div ${p.base}^{${p.k}} = ${p.base}^{${top}-${p.k}} = ${p.base}^{${e}}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return a?.type === "exact" && a.value === `${p.base}^{${p.m + p.n}}`;
    if (question.key.depth === 2)
      return a?.type === "exact" && a.value === toLatex(frac(1, p.base ** p.k));
    return true;
  },
});
