/**
 * @statement GF-N2.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N2.d: Use place value with very large and very small numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { tex } from "../shared/npv.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  d: number;
  e: number;
  f: number;
  big: number;
  small: number;
  q: number;
  w: number;
}

const tiny = (zeros: number, digits: string) => `0.${"0".repeat(zeros)}${digits}`;

export default defineGenerator<Params>({
  id: "GF-N2.d",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.PLACE.COLUMN-SHIFT"],

  params(rng) {
    const p = {
      d: rng.int(1, 9),
      e: rng.int(1, 9),
      f: rng.int(1, 9),
      big: rng.int(6, 9),
      small: rng.int(3, 6),
      q: rng.int(1, 9),
      w: rng.int(1, 9),
    };
    if (p.e === p.d || p.f === p.d) reject("a digit that appears once");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const n = p.d * 10 ** p.big + p.e * 10 ** (p.big - 2);
        const v = p.d * 10 ** p.big;
        return A.standard({
          question: [`What is the value of the digit ${p.d} in `, A.math(tex(n)), "?"],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.PLACE.COLUMN-SHIFT",
              value: A.number(v / 10),
              feedback: "Count the places from the ones column carefully.",
            },
            {
              code: "NPV.PLACE.COLUMN-SHIFT",
              value: A.number(v * 10),
              feedback: "Count the places from the ones column carefully.",
            },
          ]),
          solution: [
            {
              say: `The ${p.d} is in the ${tex(10 ** p.big).replace(/\{,\}/g, ",")}s column: it is worth `,
              math: tex(v),
            },
          ],
        });
      }
      case 2: {
        const v = Number(tiny(p.small - 1, String(p.d)));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `What is the value of the digit ${p.d} in `,
                A.math(tiny(p.small - 1, `${p.d}${p.e}${p.f}`)),
                "?",
              ],
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.PLACE.COLUMN-SHIFT",
              value: A.number(Number(tiny(p.small - 2, String(p.d)))),
              feedback:
                "The first place after the decimal point is tenths, then hundredths, then thousandths.",
            },
          ]),
          solution: [
            {
              say: `The ${p.d} is ${p.small} places after the point: it is worth `,
              math: String(v),
            },
          ],
        });
      }
      default: {
        const right = (10 * p.q + p.w) * 10 ** 5;
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Zara says ",
                A.math(`${p.q}.${p.w} \\text{ million} = ${tex(right / 10)}`),
                ".",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. A million is 1 000 000, so ${p.q}.${p.w} million = ${tex(right).replace(/\{,\}/g, " ")}.`,
                  correct: true,
                },
                {
                  text: "True. A million has six zeros, so write six digits after the first.",
                  code: "NPV.PLACE.COLUMN-SHIFT",
                },
                {
                  text: "True. The decimal point moves six places.",
                  code: "NPV.PLACE.COLUMN-SHIFT",
                },
              ],
              solution: [{ say: "", math: `${p.q}.${p.w} \\times 1{,}000{,}000 = ${tex(right)}` }],
            }),
          [
            {
              statement: "Raj says 0.6 million is 600,000.",
              truth: true,
              right: "True. One million is 1,000,000, and 0.6 of it is 600,000.",
              wrong: [
                ["False. It is 6,000,000.", "NPV.PLACE.COLUMN-SHIFT"],
                ["False. It is 60,000.", "NPV.PLACE.COLUMN-SHIFT"],
              ],
            },
            {
              claim: "A billion is a thousand millions.",
              truth: "always",
              right:
                "Always, in the usual (short-scale) meaning used in the UK today: 1,000,000,000.",
              wrong: [
                ["Never. A billion is a million millions.", "NPV.PLACE.COLUMN-SHIFT"],
                ["Sometimes. Only for money."],
              ],
            },
            {
              statement: "Mia writes 45 thousand as 45,000,000.",
              truth: false,
              right: "False. 45 thousand is 45,000.",
              wrong: [
                ["True. Thousand means six zeros.", "NPV.PLACE.COLUMN-SHIFT"],
                ["True. Add three zeros twice."],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.d * 10 ** p.big;
    if (question.key.depth === 2)
      return numberAnswer(question) === Number(tiny(p.small - 1, String(p.d)));
    return true;
  },
});
