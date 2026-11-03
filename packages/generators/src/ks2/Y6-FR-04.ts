/**
 * @statement Y6-FR-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-04: Multiply simple pairs of proper fractions, writing the answer in its simplest form, e.g.
// ¼ × ½ = ⅛
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { fracTex, gcdOf, slash } from "../shared/fr.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "Y6-FR-04",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.MULTIPLY.ALWAYS-BIGGER", "FR.ADD.TOPS-AND-BOTTOMS"],

  params(rng, numbers) {
    const [b, d] = [
      rng.int(2, numbers === "friendly" ? 5 : 9),
      rng.int(2, numbers === "friendly" ? 5 : 9),
    ];
    const [a, c] = [
      numbers === "friendly" ? 1 : rng.int(1, b - 1),
      numbers === "friendly" ? 1 : rng.int(1, d - 1),
    ];
    if (gcdOf(a, b) !== 1 || gcdOf(c, d) !== 1) reject("fractions in simplest form");
    return { a, b, c, d };
  },

  build(p, depth, rng): QuestionDraft {
    const v = frac(p.a * p.c, p.b * p.d);
    const expr = `${fracTex(p.a, p.b)} \\times ${fracTex(p.c, p.d)}`;
    const how = `Multiply the numerators and the denominators: ${slash(p.a * p.c, p.b * p.d)}${v.eq(frac(p.a * p.c, p.b * p.d)) && gcdOf(p.a * p.c, p.b * p.d) === 1 ? "" : `, which simplifies to ${v.toString()}`}.`;
    const added = p.a + p.c < p.b + p.d ? fracTex(p.a + p.c, p.b + p.d) : undefined;
    const wrong =
      added && !frac(p.a + p.c, p.b + p.d).eq(v)
        ? [
            {
              code: "FR.ADD.TOPS-AND-BOTTOMS",
              value: A.exact(added),
              feedback:
                "Multiply the numerators together and the denominators together, rather than adding them.",
            },
          ]
        : [];
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.math(expr)],
          ask: "Give your answer in its simplest form.",
          answer: A.exact(v, "simplest"),
          wrong,
          solution: [{ say: how }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find ",
                A.math(fracTex(p.a, p.b)),
                " of ",
                A.math(fracTex(p.c, p.d)),
                ".",
              ],
              ask: "Give your answer in its simplest form.",
            },
            {
              question: [
                "A rectangle is ",
                A.math(fracTex(p.a, p.b)),
                " m long and ",
                A.math(fracTex(p.c, p.d)),
                " m wide.",
              ],
              ask: "What is its area in square metres, in its simplest form?",
            },
          ],
          answer: A.exact(v, "simplest"),
          wrong,
          solution: [{ say: `"Of" means multiply. ${how}` }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Ruby says ",
                A.math(expr),
                " must be bigger than ",
                A.math(fracTex(p.a, p.b)),
                ", because multiplying makes things bigger.",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Multiplying by ${slash(p.c, p.d)}, which is less than 1, takes only part of ${slash(p.a, p.b)}: the answer is ${v.toString()}, which is smaller.`,
                  correct: true,
                },
                {
                  text: "True. Multiplying always gives a bigger answer.",
                  code: "FR.MULTIPLY.ALWAYS-BIGGER",
                },
                { text: "True. The denominator gets bigger, so the fraction gets bigger." },
              ],
              solution: [{ say: how }],
            }),
          [
            {
              statement:
                "Dev says $\\frac{2}{3} \\times \\frac{3}{4} = \\frac{6}{12}$, which is $\\frac{1}{2}$.",
              truth: true,
              right: "True. Multiply the tops and the bottoms: 6/12, which simplifies to 1/2.",
              wrong: [
                ["False. It is 5/7, adding tops and bottoms.", "FR.ADD.TOPS-AND-BOTTOMS"],
                ["False. It is bigger than 3/4.", "FR.MULTIPLY.ALWAYS-BIGGER"],
              ],
            },
            {
              statement: "Amy says $\\frac{1}{2} \\times \\frac{1}{5} = \\frac{2}{7}$.",
              truth: false,
              right: "False. Multiply the tops and the bottoms: 1/10. Half of a fifth is a tenth.",
              wrong: [
                ["True. Add the tops and add the bottoms.", "FR.ADD.TOPS-AND-BOTTOMS"],
                ["True. 1 + 1 = 2 and 2 + 5 = 7."],
              ],
            },
            {
              claim: "Multiplying two proper fractions gives an answer smaller than both of them.",
              truth: "always",
              right: "Always. Taking part of a part gives less than either part.",
              wrong: [
                ["Never. Multiplying makes things bigger.", "FR.MULTIPLY.ALWAYS-BIGGER"],
                ["Sometimes. Only for unit fractions."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type !== "exact") return true;
    return (
      String(a.value) === toLatex(frac(p.a * p.c, p.b * p.d)) &&
      frac(p.a * p.c, p.b * p.d).lt(frac(p.a, p.b))
    );
  },
});
