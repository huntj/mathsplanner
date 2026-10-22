/**
 * @statement CM-SG5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-SG5: Calculate with roots and with integer and fractional indices
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { exactAnswer, numberAnswer } from "../shared/counting.ts";

/** Bases with whole-number roots: [root, power of root that gives base, n]. */
const ROOTS = [
  [2, 3],
  [3, 3],
  [2, 2],
  [5, 2],
  [3, 2],
  [2, 4],
  [10, 3],
  [4, 2],
] as const;

interface Params {
  r: number;
  m: number;
  a: number;
  n: number;
}

const root = (i: number) => ROOTS[i] ?? ROOTS[0];

export default defineGenerator<Params>({
  id: "CM-SG5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.INDEX.FRACTIONAL", "NPV.INDEX.NEGATIVE", "NPV.INDEX.ZERO"],

  params(rng) {
    return {
      r: rng.int(0, ROOTS.length - 1),
      m: rng.int(2, 3),
      a: rng.int(2, 6),
      n: rng.int(2, 3),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const [b, n] = root(p.r);
    const base = b ** n;
    switch (depth) {
      case 1: {
        const v = b ** p.m;
        return A.standard({
          question: ["Work out ", A.math(`${base}^{\\frac{${p.m}}{${n}}}`), "."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.INDEX.FRACTIONAL",
              value: A.number(Math.round(((base * p.m) / n) * 100) / 100),
              feedback: `x^(m/n) means the nth root, raised to the power m: (${n === 2 ? "√" : n === 3 ? "cube root of " : `${n}th root of `}${base})^${p.m}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\left(\\sqrt[${n}]{${base}}\\right)^{${p.m}} = ${b}^{${p.m}} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = toLatex(frac(1, p.a ** p.n));
        return A.variedForm({
          rng,
          forms: [{ question: ["Write ", A.math(`${p.a}^{-${p.n}}`), " as a fraction."] }],
          answer: A.exact(v),
          wrong: [
            {
              code: "NPV.INDEX.NEGATIVE",
              value: A.exact(String(-(p.a ** p.n))),
              feedback: "A negative index means a reciprocal, not a negative number.",
            },
          ],
          solution: [{ say: "", math: `${p.a}^{-${p.n}} = \\frac{1}{${p.a}^{${p.n}}} = ${v}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ike says ",
            A.math(`${p.a}^0 = 0`),
            ", because there are no factors of ",
            A.math(String(p.a)),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Dividing powers: ${p.a}³ ÷ ${p.a}³ = ${p.a}⁰, and anything divided by itself is 1. So ${p.a}⁰ = 1.`,
              correct: true,
            },
            { text: "True. Raising to the power 0 always gives 0.", code: "NPV.INDEX.ZERO" },
            { text: `True. ${p.a} × 0 = 0.`, code: "NPV.INDEX.ZERO" },
          ],
          solution: [{ say: "x⁰ = 1 for every x ≠ 0." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === root(p.r)[0] ** p.m;
    if (question.key.depth === 2) return exactAnswer(question) === toLatex(frac(1, p.a ** p.n));
    return true;
  },
});
