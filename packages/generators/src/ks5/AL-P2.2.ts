/**
 * @statement AL-P2.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.2: Use and manipulate surds, including rationalising the denominator
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, Surd, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  /** Depth 1: k/√b. */
  k: number;
  b: 2 | 3 | 5 | 6 | 7;
  /** Depth 2: (p + √b)/(q − √b). */
  p: number;
  q: number;
  /** Depth 4: (√s + √t)². */
  s: number;
  t: number;
}

const root = (n: number) => `\\sqrt{${n}}`;

export default defineGenerator<Params>({
  id: "AL-P2.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.SURD.RATIONALISE", "ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng) {
    const b = rng.pick([2, 3, 5, 6, 7] as const);
    const q = rng.int(2, 5);
    const s = rng.pick([2, 3, 5]);
    const t = rng.pick([3, 5, 7]);
    if (q * q === b || s === t) reject("a denominator that is not zero and two different surds");
    return { k: rng.int(2, 12), b, p: rng.int(1, 5), q, s, t };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const value = Surd.from(p.k).div(Surd.term(1, p.b));
        return A.standard({
          question: [
            "Rationalise the denominator of ",
            A.math(`\\frac{${p.k}}{${root(p.b)}}`),
            ", simplifying fully.",
          ],
          answer: A.exact(value),
          wrong: [
            {
              code: "NPV.SURD.RATIONALISE",
              value: A.exact(Surd.term(p.k, p.b)),
              feedback: `Multiply the top and the bottom by √${p.b}; the denominator becomes ${p.b}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{${p.k}}{${root(p.b)}} \\times \\frac{${root(p.b)}}{${root(p.b)}} = \\frac{${p.k}${root(p.b)}}{${p.b}} = ${toLatex(value)}`,
            },
          ],
        });
      }
      case 2: {
        const top = Surd.from(p.p).add(Surd.term(1, p.b));
        const bottom = Surd.from(p.q).sub(Surd.term(1, p.b));
        const value = top.div(bottom);
        const slip = top.mul(bottom).div(Surd.from(p.q * p.q - p.b));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Write ",
                A.math(`\\frac{${p.p} + ${root(p.b)}}{${p.q} - ${root(p.b)}}`),
                " in the form ",
                A.math("a + b\\sqrt{c}"),
                ", where a and b are rational.",
              ],
            },
            {
              question: [
                "Rationalise the denominator of ",
                A.math(`\\frac{${p.p} + ${root(p.b)}}{${p.q} - ${root(p.b)}}`),
                ".",
              ],
            },
          ],
          answer: A.exact(value),
          wrong: [
            {
              code: "NPV.SURD.RATIONALISE",
              value: A.exact(slip),
              feedback: `Multiply top and bottom by the conjugate ${p.q} + √${p.b}, not by the denominator itself.`,
            },
          ].filter(() => !slip.eq(value)),
          solution: [
            {
              say: `Multiply top and bottom by ${p.q} + √${p.b}; the denominator becomes ${p.q * p.q} − ${p.b} = ${p.q * p.q - p.b}.`,
              math: toLatex(value),
            },
          ],
        });
      }
      default: {
        const right = Surd.term(1, p.s).add(Surd.term(1, p.t)).pow(2);
        return A.trueOrFalseWhy({
          rng,
          statement: ["Mia says ", A.math(`(${root(p.s)} + ${root(p.t)})^2 = ${p.s + p.t}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. (√${p.s} + √${p.t})² = ${p.s} + 2√${p.s * p.t} + ${p.t}: there is a middle term.`,
              correct: true,
            },
            { text: "True. Square each surd separately.", code: "ALG.EXPAND.BINOMIAL-TWO-TERMS" },
            { text: `False. It is ${p.s * p.t}.` },
          ],
          solution: [{ say: "Expand the bracket twice: ", math: toLatex(right) }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return a?.type === "exact" && a.value === toLatex(Surd.from(p.k).div(Surd.term(1, p.b)));
    return true;
  },
});
