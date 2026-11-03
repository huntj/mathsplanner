/**
 * @statement Y8-ALG-04.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-ALG-04.b: Solve linear equations with brackets
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  x: number;
  c: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-04.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.FIRST-ONLY", "ALG.EXPAND.NEGATIVE"],

  params(rng) {
    const p = {
      a: rng.int(2, 6),
      b: rng.int(1, 9),
      x: rng.int(-3, 10),
      c: rng.int(1, 5),
      d: rng.int(1, 6),
    };
    if (p.a <= p.c) reject("a bigger left coefficient");
    if ((p.a * p.b + p.c * p.d) % (p.a - p.c) !== 0) reject("a whole-number solution at depth 2");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const rhs = p.a * (p.x + p.b);
        const slip = (rhs - p.b) / p.a;
        return A.standard({
          question: ["Solve ", A.math(`${p.a}(x + ${p.b}) = ${rhs}`), "."],
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            Number.isInteger(slip)
              ? {
                  code: "ALG.EXPAND.FIRST-ONLY",
                  value: A.number(slip),
                  feedback: `${p.a}(x + ${p.b}) = ${p.a}x + ${p.a * p.b}: multiply both terms.`,
                }
              : undefined,
          ]),
          solution: [{ say: "", math: `x + ${p.b} = ${rhs / p.a} \\Rightarrow x = ${p.x}` }],
        });
      }
      case 2: {
        // a(x − b) = c(x + d)  →  x = (ab + cd)/(a − c); choose values that give a whole x.
        const top = p.a * p.b + p.c * p.d;
        const x = top / (p.a - p.c);
        const slip = (p.a * p.b - p.c * p.d) / (p.a - p.c);
        return A.variedForm({
          rng,
          forms: [{ question: ["Solve ", A.math(`${p.a}(x - ${p.b}) = ${p.c}(x + ${p.d})`), "."] }],
          answer: A.number(x),
          wrong: signedWrongs(x, [
            {
              code: "ALG.EXPAND.NEGATIVE",
              value: A.number(Math.round(slip * 100) / 100),
              feedback: `${p.a}(x − ${p.b}) = ${p.a}x − ${p.a * p.b}; then move the numbers carefully.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.a}x - ${p.a * p.b} = ${p.c}x + ${p.c * p.d} \\Rightarrow ${p.a - p.c}x = ${top} \\Rightarrow x = ${x}`,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Kit solves ",
                A.math(`${p.a}(x + ${p.b}) = ${p.a * (p.x + p.b)}`),
                ` by dividing both sides by ${p.a} first.`,
              ],
              truth: true,
              reasons: [
                {
                  text: `True. That is a valid first step: x + ${p.b} = ${p.x + p.b}, so x = ${p.x}. Expanding first also works.`,
                  correct: true,
                },
                {
                  text: "False. You must always expand the bracket first.",
                  code: "ALG.EXPAND.FIRST-ONLY",
                },
                {
                  text: `False. Dividing by ${p.a} only affects x.`,
                  code: "ALG.EXPAND.FIRST-ONLY",
                },
              ],
              solution: [
                { say: "Dividing both whole sides by the same number keeps an equation balanced." },
              ],
            }),
          [
            {
              statement:
                "Ola solves $3(x + 4) = 21$ by writing $3x + 4 = 21$, so $x = \\frac{17}{3}$.",
              truth: false,
              right: "False. The 3 multiplies both terms in the bracket: 3x + 12 = 21, so x = 3.",
              wrong: [
                ["True. Expand the bracket, then solve.", "ALG.EXPAND.FIRST-ONLY"],
                ["True. Answers can be fractions."],
              ],
            },
            {
              statement: "Tom says $x = 5$ solves $2(x - 3) = 4$.",
              truth: true,
              right: "True. 2(5 − 3) = 2 × 2 = 4.",
              wrong: [
                ["False. 2x − 3 = 4 gives x = 3.5.", "ALG.EXPAND.FIRST-ONLY"],
                ["False. 2x + 6 = 4 gives x = −1.", "ALG.EXPAND.NEGATIVE"],
              ],
            },
            {
              claim:
                "An equation like $a(x + b) = c$ can be solved by dividing both sides by a first.",
              truth: "always",
              right: "Always. Dividing by a gives x + b = c ÷ a. Expanding first works too.",
              wrong: [
                ["Never. You must expand the bracket first.", "ALG.EXPAND.FIRST-ONLY"],
                ["Sometimes. Only when c is a multiple of a."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.x;
    if (question.key.depth === 2)
      return numberAnswer(question) === (p.a * p.b + p.c * p.d) / (p.a - p.c);
    return true;
  },
});
