/**
 * @statement GH-N7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-N7: Calculate with fractional indices
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  /** The root k, the root index n (base = kⁿ) and the power m. */
  k: number;
  n: number;
  m: number;
  negative: boolean;
  /** Depth 3: 64 or 729, which are both squares, cubes and sixth powers. */
  big: 64 | 729;
}

const pow = (n: number, d: number) => `^{\\frac{${n}}{${d}}}`;

export default defineGenerator<Params>({
  id: "GH-N7",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["NPV.INDEX.FRACTIONAL", "NPV.INDEX.NEGATIVE"],

  params(rng) {
    const n = rng.int(2, 3);
    const k = n === 2 ? rng.int(3, 12) : rng.int(2, 5);
    const m = rng.int(2, 3);
    if (k ** m > 1000 || m === n) reject("a classroom-sized power that is not just the base");
    return { k, n, m, negative: rng.bool(), big: rng.pick([64, 729] as const) };
  },

  build(p, depth, rng): QuestionDraft {
    const base = p.k ** p.n;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Work out ", A.math(`${base}${pow(1, p.n)}`), "."],
          answer: A.exact(p.k),
          wrong: [
            {
              code: "NPV.INDEX.FRACTIONAL",
              value: A.exact(frac(base, p.n)),
              feedback: `A power of 1/${p.n} means the ${p.n === 2 ? "square" : "cube"} root, not dividing by ${p.n}.`,
            },
          ],
          solution: [
            {
              say: `${p.n === 2 ? "√" : "∛"}${base} = ${p.k}, because ${p.k}${p.n === 2 ? "²" : "³"} = ${base}.`,
            },
          ],
        });
      case 2: {
        const value = p.negative ? frac(1, p.k ** p.m) : frac(p.k ** p.m);
        const index = p.negative ? `^{-\\frac{${p.m}}{${p.n}}}` : pow(p.m, p.n);
        return A.variedForm({
          rng,
          forms: [
            { question: ["Work out ", A.math(`${base}${index}`), "."] },
            { question: ["Find the exact value of ", A.math(`${base}${index}`), "."] },
          ],
          answer: A.exact(value),
          wrong: [
            p.negative
              ? {
                  code: "NPV.INDEX.NEGATIVE",
                  value: A.exact(frac(-(p.k ** p.m))),
                  feedback: "A negative index means the reciprocal, not a negative number.",
                }
              : {
                  code: "NPV.INDEX.FRACTIONAL",
                  value: A.exact(frac(base * p.m, p.n)),
                  feedback: `Take the ${p.n === 2 ? "square" : "cube"} root first, then raise it to the power ${p.m}.`,
                },
          ],
          solution: [
            {
              say: `The root first: ${p.n === 2 ? "√" : "∛"}${base} = ${p.k}. Then ${p.k}^${p.m} = ${p.k ** p.m}.`,
            },
            ...(p.negative
              ? [{ say: "The negative index gives the reciprocal: ", math: toLatex(value) }]
              : []),
          ],
        });
      }
      case 3: {
        const r = p.big === 64 ? [8, 4, 2] : [27, 9, 3];
        const pairs: [string, string][] = [
          [`${p.big}${pow(1, 2)}`, String(r[0])],
          [`${p.big}${pow(1, 3)}`, String(r[1])],
          [`${p.big}${pow(1, 6)}`, String(r[2])],
          [`${p.big}^{-\\frac{1}{2}}`, `\\frac{1}{${r[0]}}`],
        ];
        return A.matchRepresentations({
          rng,
          question: "Match each power to its value.",
          pairs: pairs.map(([a, b]) => [A.math(a), A.math(b)] as [A.RichInput, A.RichInput]),
          solution: [
            { say: `A power of 1/n is the nth root; a negative index gives the reciprocal.` },
          ],
        });
      }
      default: {
        // At least 4, so halving the square never happens to give the root.
        const s = p.k + 2;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Zoe says ", A.math(`${s * s}${pow(1, 2)} = ${(s * s) / 2}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. A power of a half means the square root, so it is ${s}.`,
              correct: true,
            },
            {
              text: "True. A power of a half means halve the number.",
              code: "NPV.INDEX.FRACTIONAL",
            },
            {
              text: `False. It is ${s * s * 2}, because you multiply by 2.`,
              code: "NPV.INDEX.FRACTIONAL",
            },
          ],
          solution: [{ say: `${s} × ${s} = ${s * s}, so the square root is ${s}.` }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) return a?.type === "exact" && a.value === String(p.k);
    if (question.key.depth === 2) {
      const value = p.negative ? frac(1, p.k ** p.m) : frac(p.k ** p.m);
      return a?.type === "exact" && a.value === toLatex(value);
    }
    return true;
  },
});
