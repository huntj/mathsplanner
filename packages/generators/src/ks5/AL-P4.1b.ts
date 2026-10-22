/**
 * @statement AL-P4.1b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P4.1b: Expand (a + bx)ⁿ for any rational n, knowing it is valid for |bx/a| < 1
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  frac,
  toLatex,
  type QuestionDraft,
  type Rational,
} from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** n as numerator/denominator. */
  nn: number;
  nd: number;
  b: number;
  claimFinite: boolean;
}

const N = [
  [-1, 1],
  [-2, 1],
  [1, 2],
  [-1, 2],
  [1, 3],
] as const;

/** 1 + c1·x + c2·x², written with signs joined. */
function series(c1: Rational, c2: Rational): string {
  const term = (c: Rational, power: string) => {
    if (c.isZero()) return "";
    const size = c.abs();
    const body = size.eq(1) ? power : `${toLatex(size)}${power}`;
    return ` ${c.sign() < 0 ? "-" : "+"} ${body}`;
  };
  return `1${term(c1, "x")}${term(c2, "x^2")}`;
}

export default defineGenerator<Params>({
  id: "AL-P4.1b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.BINOMIAL.POWER", "ALG.BINOMIAL.VALIDITY"],

  params(rng) {
    const [nn, nd] = rng.pick(N);
    return { nn, nd, b: rng.pick([-4, -3, -2, 2, 3, 4]), claimFinite: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const n = frac(p.nn, p.nd);
    const nLatex = toLatex(n);
    const bracket = `(1 ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}x)^{${nLatex}}`;
    switch (depth) {
      case 1: {
        const c1 = n.mul(p.b);
        const c2 = n
          .mul(n.sub(1))
          .div(2)
          .mul(p.b * p.b);
        const slip = n.mul(n.sub(1)).div(2).mul(p.b);
        return A.standard({
          question: [
            "Find the first three terms, in ascending powers of x, of the binomial expansion of ",
            A.math(bracket),
            ".",
          ],
          answer: A.exact(series(c1, c2)),
          wrong: [
            {
              code: "ALG.BINOMIAL.POWER",
              value: A.exact(series(c1, slip)),
              feedback: `The x² term is n(n − 1)/2 × (${p.b}x)²: square the ${p.b}.`,
            },
          ].filter(() => !slip.eq(c2)),
          solution: [
            {
              say: "",
              math: `1 + (${nLatex})(${p.b}x) + \\frac{(${nLatex})(${toLatex(n.sub(1))})}{2}(${p.b}x)^2 = ${series(c1, c2)}`,
            },
          ],
        });
      }
      case 2: {
        const k = Math.abs(p.b);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "For which values of x is the binomial expansion of ",
            A.math(bracket),
            " valid?",
          ],
          correct: A.math(`|x| < \\frac{1}{${k}}`),
          distractors: [
            {
              content: A.math(`|x| < ${k}`),
              code: "ALG.BINOMIAL.VALIDITY",
              feedback: `Valid when |${p.b}x| < 1, so |x| < 1/${k}.`,
            },
            {
              content: A.math("|x| < 1"),
              code: "ALG.BINOMIAL.VALIDITY",
              feedback: `It is the whole term ${p.b}x that must be less than 1 in size.`,
            },
            {
              content: A.math("\\text{all values of } x"),
              code: "ALG.BINOMIAL.VALIDITY",
              feedback:
                "For a negative or fractional power the series is infinite and only converges for small x.",
            },
          ],
          solution: [
            {
              say: `The expansion of (1 + y)ⁿ is valid for |y| < 1; here y = ${p.b}x, so |x| < 1/${k}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimFinite
            ? [
                "Lena says the binomial expansion of ",
                A.math(bracket),
                " has a finite number of terms.",
              ]
            : [
                "Lena says the binomial expansion of ",
                A.math(`(1 + x)^{5}`),
                " is valid for every value of x.",
              ],
          truth: !p.claimFinite,
          reasons: p.claimFinite
            ? [
                {
                  text: "False. For a negative or fractional power the coefficients never reach zero, so the series goes on for ever.",
                  correct: true,
                },
                {
                  text: "True. Every binomial expansion stops after n + 1 terms.",
                  code: "ALG.BINOMIAL.VALIDITY",
                },
                { text: "True. It stops after three terms." },
              ]
            : [
                {
                  text: "True. A positive whole-number power gives a finite expansion, which equals the bracket for every x.",
                  correct: true,
                },
                { text: "False. It is only valid for |x| < 1.", code: "ALG.BINOMIAL.VALIDITY" },
                { text: "False. It is only valid for positive x." },
              ],
          solution: [
            {
              say: "Only positive whole-number powers give finite expansions; the others need |bx| < 1.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2)
      return chosenText(question).includes(`\\frac{1}{${Math.abs(p.b)}}`);
    return true;
  },
});
