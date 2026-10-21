/**
 * @statement Y7-ALG-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-ALG-04: Simplify and manipulate algebraic expressions by collecting like terms and multiplying a
// single term over a bracket
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  /** p·a + q·b + r·a − s·b. */
  p: number;
  q: number;
  r: number;
  s: number;
  /** k(x + m). */
  k: number;
  m: number;
  claimTrue: boolean;
}

/** A linear term: 1a → a, 0 → nothing. */
const term = (n: number, v: string) =>
  n === 0 ? "" : n === 1 ? v : n === -1 ? `-${v}` : `${n}${v}`;
const join = (...ts: string[]) => ts.filter(Boolean).join(" + ").replace(/\+ -/g, "- ") || "0";

export default defineGenerator<Params>({
  id: "Y7-ALG-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LIKE-TERMS.UNLIKE", "ALG.EXPAND.FIRST-ONLY"],

  params(rng, numbers) {
    const [p, q, r, s] = [
      rng.int(2, 9),
      rng.int(2, 9),
      rng.int(1, 9),
      rng.int(1, numbers === "friendly" ? 1 : 9),
    ];
    if (q - s === 0 || p + r === q - s) reject("non-zero, different coefficients");
    return {
      p,
      q,
      r,
      s,
      k: rng.int(2, 9),
      m: rng.int(1, 12) * (numbers === "stretch" && rng.bool() ? -1 : 1),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const latex = `${p.p}a + ${p.q}b + ${term(p.r, "a")} - ${term(p.s, "b")}`;
        const answer = join(term(p.p + p.r, "a"), term(p.q - p.s, "b"));
        const unlike = `${p.p + p.q + p.r - p.s}ab`;
        return A.standard({
          question: ["Simplify ", A.math(latex), "."],
          answer: A.exact(answer),
          wrong: [
            {
              code: "ALG.LIKE-TERMS.UNLIKE",
              value: A.exact(unlike),
              feedback:
                "Only like terms can be collected: the a terms together and the b terms together.",
            },
          ],
          solution: [
            {
              say: `a terms: ${p.p} + ${p.r} = ${p.p + p.r}. b terms: ${p.q} − ${p.s} = ${p.q - p.s}.`,
              math: `${latex} = ${answer}`,
            },
          ],
        });
      }
      case 2: {
        const inside = `x ${p.m < 0 ? "-" : "+"} ${Math.abs(p.m)}`;
        const answer = `${p.k}x ${p.m < 0 ? "-" : "+"} ${Math.abs(p.k * p.m)}`;
        const slip = `${p.k}x ${p.m < 0 ? "-" : "+"} ${Math.abs(p.m)}`;
        return A.standard({
          question: ["Expand ", A.math(`${p.k}(${inside})`), "."],
          answer: A.exact(answer, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.FIRST-ONLY",
              value: A.exact(slip),
              feedback: `Multiply every term in the bracket by ${p.k}: ${p.k} × ${Math.abs(p.m)} = ${Math.abs(p.k * p.m)}.`,
            },
          ],
          solution: [
            {
              say: `${p.k} × x = ${p.k}x and ${p.k} × ${p.m} = ${p.k * p.m}.`,
              math: `${p.k}(${inside}) = ${answer}`,
            },
          ],
        });
      }
      default: {
        const right = `${p.p}a + ${p.q}b`;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ravi says ",
            A.math(p.claimTrue ? `${p.p}a + ${p.r}a = ${p.p + p.r}a` : `${right} = ${p.p + p.q}ab`),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. ${p.p} a's and ${p.r} more a's make ${p.p + p.r} a's.`,
                  correct: true,
                },
                { text: `False. It should be ${p.p + p.r}a².` },
                { text: "False. You cannot add terms with letters." },
              ]
            : [
                {
                  text: `False. a and b are different, so ${p.p}a and ${p.q}b are unlike terms and cannot be collected. ${right} is already simplified.`,
                  correct: true,
                },
                {
                  text: "True. Add the numbers and write the letters together.",
                  code: "ALG.LIKE-TERMS.UNLIKE",
                },
                { text: `True. ${p.p} + ${p.q} = ${p.p + p.q}.`, code: "ALG.LIKE-TERMS.UNLIKE" },
              ],
          solution: [
            { say: "Like terms have exactly the same letters; only like terms can be added." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type !== "exact") return question.archetype === "true-or-false-why";
    return question.key.depth === 1
      ? a.value === join(term(p.p + p.r, "a"), term(p.q - p.s, "b"))
      : a.value === `${p.k}x ${p.m < 0 ? "-" : "+"} ${Math.abs(p.k * p.m)}`;
  },
});
