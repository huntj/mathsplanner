/**
 * @statement Y7-NPV-03.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-03.d: Calculate with mixed numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  d: number;
  m1: number;
  n1: number;
  m2: number;
  n2: number;
}

const mixed = (m: number, n: number, d: number) => `${m}\\frac{${n}}{${d}}`;

export default defineGenerator<Params>({
  id: "Y7-NPV-03.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.ADD.TOPS-AND-BOTTOMS", "FR.MIXED.CONVERT"],

  params(rng) {
    const d = rng.pick([3, 4, 5, 6, 8]);
    const p = {
      d,
      m1: rng.int(2, 6),
      n1: rng.int(1, d - 1),
      m2: rng.int(1, 4),
      n2: rng.int(1, d - 1),
    };
    if (p.n1 + p.n2 <= d || p.n1 >= p.n2 || p.m1 <= p.m2)
      reject("a carry when adding and a borrow when subtracting");
    if (gcdOf(p.n1, d) > 1 || gcdOf(p.n2, d) > 1) reject("simplified fraction parts");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = frac(p.m1 * p.d + p.n1 + p.m2 * p.d + p.n2, p.d);
        return A.standard({
          question: [
            "Work out ",
            A.math(`${mixed(p.m1, p.n1, p.d)} + ${mixed(p.m2, p.n2, p.d)}`),
            ".",
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.ADD.TOPS-AND-BOTTOMS",
              value: A.exact(frac((p.m1 + p.m2) * 2 * p.d + p.n1 + p.n2, 2 * p.d)),
              feedback: `Add the whole numbers and the fractions separately; the fractions are both in ${p.d}ths, so the denominator stays ${p.d}.`,
            },
          ],
          solution: [
            {
              say: `Wholes: ${p.m1 + p.m2}; fractions: ${p.n1 + p.n2}/${p.d}, which is more than 1: `,
              math: toLatex(v),
            },
          ],
        });
      }
      case 2: {
        const v = frac(p.m1 * p.d + p.n1 - p.m2 * p.d - p.n2, p.d);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Work out ",
                A.math(`${mixed(p.m1, p.n1, p.d)} - ${mixed(p.m2, p.n2, p.d)}`),
                ".",
              ],
            },
            {
              question: [
                `A jug holds `,
                A.math(mixed(p.m1, p.n1, p.d)),
                " litres of water. ",
                A.math(mixed(p.m2, p.n2, p.d)),
                " litres are poured out.",
              ],
              ask: "How many litres are left?",
            },
          ],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.MIXED.CONVERT",
              value: A.exact(frac((p.m1 - p.m2) * p.d + (p.n2 - p.n1), p.d)),
              feedback: `You cannot take ${p.n2}/${p.d} from ${p.n1}/${p.d}; change to improper fractions first, or exchange a whole.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{${p.m1 * p.d + p.n1}}{${p.d}} - \\frac{${p.m2 * p.d + p.n2}}{${p.d}} = ${toLatex(v)}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Tom says ",
            A.math(`${mixed(p.m2, p.n2, p.d)} \\times 2 = ${mixed(2 * p.m2, p.n2, p.d)}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The fraction part must be doubled too: ${2 * p.m2} wholes and ${2 * p.n2}/${p.d}.`,
              correct: true,
            },
            {
              text: "True. Double the whole number and keep the fraction.",
              code: "FR.MIXED.CONVERT",
            },
            { text: "True. Fractions do not change when you multiply.", code: "FR.MIXED.CONVERT" },
          ],
          solution: [
            {
              say: "",
              math: `\\frac{${p.m2 * p.d + p.n2}}{${p.d}} \\times 2 = ${toLatex(frac(2 * (p.m2 * p.d + p.n2), p.d))}`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return exactAnswer(question) === toLatex(frac(p.m1 * p.d + p.n1 + p.m2 * p.d + p.n2, p.d));
    if (question.key.depth === 2)
      return exactAnswer(question) === toLatex(frac(p.m1 * p.d + p.n1 - p.m2 * p.d - p.n2, p.d));
    return true;
  },
});
