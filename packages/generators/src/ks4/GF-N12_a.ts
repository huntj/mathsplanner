/**
 * @statement GF-N12.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N12.a: Use fractions as operators
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  n: number;
  d: number;
  k: number;
  extra: number;
}

export default defineGenerator<Params>({
  id: "GF-N12.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: [
    "FR.OF-AMOUNT.UNIT-ONLY",
    "FR.OF-AMOUNT.DIVIDES-BY-NUMERATOR",
    "FR.OF-AMOUNT.REVERSE",
  ],

  params(rng) {
    const d = rng.int(3, 9);
    const p = { n: rng.int(2, d - 1), d, k: rng.int(2, 15), extra: rng.int(1, 3) };
    if (gcdOf(p.n, d) > 1) reject("a fraction in its simplest form");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const amount = p.d * p.k;
    switch (depth) {
      case 1: {
        const v = p.n * p.k;
        return A.standard({
          question: ["Work out ", A.math(`\\frac{${p.n}}{${p.d}}`), ` of ${amount}.`],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "FR.OF-AMOUNT.UNIT-ONLY",
              value: A.number(p.k),
              feedback: `${amount} ÷ ${p.d} = ${p.k} is one part; multiply by ${p.n}.`,
            },
            Number.isInteger(amount / p.n)
              ? {
                  code: "FR.OF-AMOUNT.DIVIDES-BY-NUMERATOR",
                  value: A.number(amount / p.n),
                  feedback: `Divide by the denominator, ${p.d}, then multiply by the numerator.`,
                }
              : undefined,
          ]),
          solution: [{ say: "", math: `${amount} \\div ${p.d} \\times ${p.n} = ${v}` }],
        });
      }
      case 2: {
        const part = p.n * p.k;
        const again = (part * p.n) / p.d;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [A.math(`\\frac{${p.n}}{${p.d}}`), ` of a number is ${part}.`],
              ask: "What is the number?",
            },
            {
              question: [
                `Mia has spent `,
                A.math(`\\frac{${p.n}}{${p.d}}`),
                ` of her savings, which is £${part}.`,
              ],
              ask: "How much were her savings, in pounds?",
            },
          ],
          answer: A.number(amount),
          wrong: wrongs(amount, [
            Number.isInteger(again)
              ? {
                  code: "FR.OF-AMOUNT.REVERSE",
                  value: A.number(again),
                  feedback: `${part} is the part; undo the fraction: ${part} ÷ ${p.n} × ${p.d}.`,
                }
              : undefined,
          ]),
          solution: [
            {
              say: "",
              math: `${part} \\div ${p.n} = ${p.k}, \\; ${p.k} \\times ${p.d} = ${amount}`,
            },
          ],
        });
      }
      default: {
        const top = p.d + p.extra;
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Eli says ",
                A.math(`\\frac{${top}}{${p.d}}`),
                ` of ${amount} must be less than ${amount}, because you are taking a fraction of it.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. ${top}/${p.d} is more than 1, so it gives ${top * p.k}, which is more than ${amount}.`,
                  correct: true,
                },
                {
                  text: "True. A fraction of an amount is always a part of it.",
                  code: "FR.OF-AMOUNT.UNIT-ONLY",
                },
                {
                  text: `True. You divide by ${p.d}, which makes it smaller.`,
                  code: "FR.OF-AMOUNT.UNIT-ONLY",
                },
              ],
              solution: [{ say: "", math: `${amount} \\div ${p.d} \\times ${top} = ${top * p.k}` }],
            }),
          [
            {
              statement: "Kai says $\\frac{3}{5}$ of 40 is 24.",
              truth: true,
              right: "True. 1/5 of 40 is 8, so 3/5 is 24.",
              wrong: [
                ["False. It is 8.", "FR.OF-AMOUNT.UNIT-ONLY"],
                ["False. It is 13.3.", "FR.OF-AMOUNT.DIVIDES-BY-NUMERATOR"],
              ],
            },
            {
              statement: "$\\frac{2}{3}$ of a number is 18. Pia says the number is 12.",
              truth: false,
              right: "False. 1/3 of the number is 9, so the number is 27.",
              wrong: [
                ["True. 2/3 of 18 is 12.", "FR.OF-AMOUNT.REVERSE"],
                ["True. Take 2/3 again.", "FR.OF-AMOUNT.REVERSE"],
              ],
            },
            {
              claim: "A fraction of an amount is smaller than the amount.",
              truth: "sometimes",
              right: "Sometimes. A proper fraction gives less, but 3/2 of an amount is more.",
              wrong: [
                ["Always. A fraction is a part.", "FR.OF-AMOUNT.UNIT-ONLY"],
                ["Never. It is bigger."],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n * p.k;
    if (question.key.depth === 2) return numberAnswer(question) === p.d * p.k;
    return true;
  },
});
