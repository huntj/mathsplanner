/**
 * @statement Y6-FR-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-05: Divide proper fractions by whole numbers, e.g. ⅓ ÷ 2 = ⅙
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { fracTex, gcdOf, slash } from "../shared/fr.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y6-FR-05",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.DIVIDE.MULTIPLIES"],

  params(rng, numbers) {
    const b = rng.int(2, numbers === "friendly" ? 5 : 9);
    const a = numbers === "friendly" ? 1 : rng.int(1, b - 1);
    const k = rng.int(2, numbers === "stretch" ? 6 : 4);
    if (gcdOf(a, b) !== 1) reject("simplest form");
    return { a, b, k };
  },

  build(p, depth, rng): QuestionDraft {
    const v = frac(p.a, p.b * p.k);
    const slip = fracTex(p.a * p.k, p.b);
    const how = `Dividing by ${p.k} splits each ${slash(1, p.b)} into ${p.k}, making parts of ${slash(1, p.b * p.k)}: ${slash(p.a, p.b)} ÷ ${p.k} = ${v.toString()}.`;
    const wrong = [
      {
        code: "FR.DIVIDE.MULTIPLIES",
        value: A.exact(slip),
        feedback: `That is ${slash(p.a, p.b)} × ${p.k}. Dividing makes the answer smaller: multiply the denominator by ${p.k}.`,
      },
    ];
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.math(`${fracTex(p.a, p.b)} \\div ${p.k}`)],
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
                "There is ",
                A.math(fracTex(p.a, p.b)),
                ` of a pizza left. ${p.k} friends share it equally.`,
              ],
              ask: "What fraction of the whole pizza does each friend get?",
            },
            {
              question: [
                "A ribbon ",
                A.math(fracTex(p.a, p.b)),
                ` m long is cut into ${p.k} equal pieces.`,
              ],
              ask: "How long is each piece, in metres?",
            },
          ],
          answer: A.exact(v, "simplest"),
          wrong,
          solution: [{ say: how }],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: ["Finn says ", A.math(`${fracTex(p.a, p.b)} \\div ${p.k} = ${slip}`), "."],
              truth: false,
              reasons: [
                {
                  text: `False. Sharing ${slash(p.a, p.b)} into ${p.k} equal parts gives less than ${slash(p.a, p.b)}. ${how}`,
                  correct: true,
                },
                {
                  text: `True. Divide by ${p.k} by multiplying the numerator by ${p.k}.`,
                  code: "FR.DIVIDE.MULTIPLIES",
                },
                { text: "True. You cannot divide a fraction, so you multiply it." },
              ],
              solution: [{ say: how }],
            }),
          [
            {
              statement: "Gil says $\\frac{1}{3} \\div 2 = \\frac{1}{6}$.",
              truth: true,
              right: "True. Halving a third gives a sixth.",
              wrong: [
                ["False. It is 2/3.", "FR.DIVIDE.MULTIPLIES"],
                ["False. It is 1/5, as 3 + 2 = 5."],
              ],
            },
            {
              statement: "Sol says $\\frac{4}{5} \\div 2 = \\frac{8}{5}$.",
              truth: false,
              right: "False. Dividing by 2 halves it: 4/5 ÷ 2 = 2/5.",
              wrong: [
                ["True. Multiply the top by 2.", "FR.DIVIDE.MULTIPLIES"],
                ["True. Dividing makes fractions bigger."],
              ],
            },
            {
              claim: "Dividing a fraction by a whole number bigger than 1 makes it smaller.",
              truth: "always",
              right: "Always. You share it into more parts, so each part is smaller.",
              wrong: [
                ["Never. It gets bigger.", "FR.DIVIDE.MULTIPLIES"],
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
    return String(a.value) === toLatex(frac(p.a, p.b * p.k));
  },
});
