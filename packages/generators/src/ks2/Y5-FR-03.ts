/**
 * @statement Y5-FR-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-03: Recognise mixed numbers and improper fractions, convert between them, and write sums
// greater than 1 as a mixed number
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { fracTex, gcdOf, slash } from "../shared/fr.ts";

interface Params {
  w: number;
  n: number;
  d: number;
  claimTrue: boolean;
}

const mixed = { form: "mixed" as const };

export default defineGenerator<Params>({
  id: "Y5-FR-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.MIXED.CONVERT"],

  params(rng, numbers) {
    const d = rng.pick(
      numbers === "friendly"
        ? [2, 3, 4, 5]
        : numbers === "standard"
          ? [3, 4, 5, 6, 8]
          : [5, 6, 7, 8, 9, 12],
    );
    const options = Array.from({ length: d - 1 }, (_, i) => i + 1).filter((k) => gcdOf(k, d) === 1);
    return {
      w: rng.int(2, numbers === "stretch" ? 9 : 5),
      n: rng.pick(options),
      d,
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const top = p.w * p.d + p.n;
    const slip = p.w * p.n + p.d;
    const mixedTex = `${p.w}${fracTex(p.n, p.d)}`;
    const how = `${p.w} wholes are ${p.w} × ${p.d} = ${p.w * p.d} ${p.d === 2 ? "halves" : "parts"}, plus ${p.n} more: ${slash(top, p.d)}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Write ", A.math(mixedTex), " as an improper fraction."],
          answer: A.exact(frac(top, p.d), "improper"),
          wrong:
            slip !== top
              ? [
                  {
                    code: "FR.MIXED.CONVERT",
                    value: A.exact(fracTex(slip, p.d)),
                    feedback: `Multiply the whole number by the denominator, then add the numerator: ${p.w} × ${p.d} + ${p.n} = ${top}.`,
                  },
                ]
              : [],
          solution: [{ say: how }],
        });
      case 2:
        return A.reverse({
          question: ["Write ", A.math(fracTex(top, p.d)), " as a mixed number."],
          answer: A.exact(frac(top, p.d), "mixed-number", mixed),
          solution: [
            {
              say: `${top} ÷ ${p.d} = ${p.w} remainder ${p.n}, so ${slash(top, p.d)} = ${p.w} ${slash(p.n, p.d)}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Mo says ",
            A.math(`${mixedTex} = ${fracTex(p.claimTrue ? top : slip, p.d)}`),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: `True. ${how}`, correct: true },
                {
                  text: "False. Multiply the whole number by the numerator, then add the denominator.",
                  code: "FR.MIXED.CONVERT",
                },
                { text: "False. Mixed numbers cannot be written as fractions." },
              ]
            : [
                { text: `False. ${how}`, correct: true },
                {
                  text: "True. Multiply the whole number by the numerator, then add the denominator.",
                  code: "FR.MIXED.CONVERT",
                },
                { text: "True. The denominator stays the same, so it must be right." },
              ],
          solution: [{ say: how }],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.archetype === "standard")
      return a?.type === "exact" && String(a.value) === toLatex(frac(p.w * p.d + p.n, p.d));
    if (question.archetype === "reverse")
      return a?.type === "exact" && String(a.value) === toLatex(frac(p.w * p.d + p.n, p.d), mixed);
    return p.w * p.n + p.d !== p.w * p.d + p.n;
  },
});
