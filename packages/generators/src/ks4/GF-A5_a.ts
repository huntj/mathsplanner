/**
 * @statement GF-A5.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A5.a: Use standard formulae
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  h: number;
  l: number;
  w: number;
  r: number;
}

const trapezium = (p: Params) => ((p.a + p.b) * p.h) / 2;

export default defineGenerator<Params>({
  id: "GF-A5.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SUBSTITUTE.ORDER", "ALG.EXPAND.FIRST-ONLY", "RAT.SCALE.AREA-LINEAR"],

  params(rng) {
    const p = {
      a: rng.int(3, 12),
      b: rng.int(3, 15),
      h: rng.int(2, 10),
      l: rng.int(3, 20),
      w: rng.int(2, 15),
      r: rng.int(2, 9),
    };
    if (((p.a + p.b) * p.h) % 2 !== 0 || p.a === p.b)
      reject("a whole-number area of a real trapezium");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = trapezium(p);
        return A.standard({
          question: ["The area of a trapezium is ", A.math("A = \\frac{1}{2}(a + b)h"), "."],
          ask: [
            "Find A when ",
            A.math(`a = ${p.a}`),
            ", ",
            A.math(`b = ${p.b}`),
            " and ",
            A.math(`h = ${p.h}`),
            ".",
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SUBSTITUTE.ORDER",
              value: A.number(p.a / 2 + p.b * p.h),
              feedback: "Work out the bracket first: add a and b, then multiply by h and halve.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{2}(${p.a} + ${p.b}) \\times ${p.h} = \\frac{1}{2} \\times ${p.a + p.b} \\times ${p.h} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = 2 * (p.l + p.w);
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The perimeter of a rectangle is ", A.math("P = 2(l + w)"), "."],
              ask: ["Find P when ", A.math(`l = ${p.l}`), " and ", A.math(`w = ${p.w}`), "."],
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.EXPAND.FIRST-ONLY",
              value: A.number(2 * p.l + p.w),
              feedback: "The 2 multiplies both l and w.",
            },
          ]),
          solution: [{ say: "", math: `P = 2(${p.l} + ${p.w}) = 2 \\times ${p.l + p.w} = ${v}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Mo says that in ",
                A.math("A = \\pi r^2"),
                `, if the radius doubles from ${p.r} cm to ${2 * p.r} cm, the area doubles too.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. The radius is squared, so the area is multiplied by 2² = 4: from ${p.r * p.r}π to ${4 * p.r * p.r}π cm².`,
                  correct: true,
                },
                {
                  text: "True. Doubling one value in a formula doubles the answer.",
                  code: "RAT.SCALE.AREA-LINEAR",
                },
                {
                  text: "True. π stays the same, so the area changes like r.",
                  code: "RAT.SCALE.AREA-LINEAR",
                },
              ],
              solution: [{ say: "", math: `\\pi (2r)^2 = 4\\pi r^2` }],
            }),
          [
            {
              statement: "Using $v = u + at$ with u = 3, a = 4 and t = 5, Bea gets v = 23.",
              truth: true,
              right: "True. 3 + 4 × 5 = 3 + 20 = 23.",
              wrong: [["False. It is 35.", "ALG.SUBSTITUTE.ORDER"], ["False. It is 12."]],
            },
            {
              claim: "In $P = 2(l + w)$, doubling both l and w doubles P.",
              truth: "always",
              right: "Always. 2(2l + 2w) = 2 × 2(l + w).",
              wrong: [
                ["Never. P is multiplied by 4.", "RAT.SCALE.AREA-LINEAR"],
                ["Sometimes. Only for squares."],
              ],
            },
            {
              statement: "Using $A = \\frac{1}{2}bh$ with b = 6 and h = 4, Dan gets A = 24.",
              truth: false,
              right: "False. ½ × 6 × 4 = 12.",
              wrong: [
                ["True. 6 × 4 = 24.", "ALG.SUBSTITUTE.ORDER"],
                ["True. The half is just a label.", "ALG.EXPAND.FIRST-ONLY"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === trapezium(p);
    if (question.key.depth === 2) return numberAnswer(question) === 2 * (p.l + p.w);
    return true;
  },
});
