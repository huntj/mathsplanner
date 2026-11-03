/**
 * @statement Y5-FR-03.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-03.c: Write sums greater than 1 as a mixed number
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";
import { fracTex, gcdOf } from "../shared/fr.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "Y5-FR-03.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.ADD.TOPS-AND-BOTTOMS", "FR.MIXED.CONVERT"],

  params(rng, numbers) {
    const d = rng.pick(numbers === "friendly" ? [3, 4, 5] : [5, 6, 7, 8, 9]);
    const p = { a: rng.int(1, d - 1), b: rng.int(1, d - 1), d };
    const r = p.a + p.b - d;
    // A sum over 1 whose remainder is a fraction in its simplest form.
    if (r <= 0 || gcdOf(r, d) !== 1) reject("a sum over 1 in simplest form");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const r = p.a + p.b - p.d;
    const mixed = `1${fracTex(r, p.d)}`;
    const sum = A.math(`${fracTex(p.a, p.d)} + ${fracTex(p.b, p.d)}`);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Work out ", sum, ". Write the answer as a mixed number."],
          correct: A.math(mixed),
          distractors: [
            {
              content: A.math(fracTex(p.a + p.b, 2 * p.d)),
              code: "FR.ADD.TOPS-AND-BOTTOMS",
              feedback: "Add the numerators only. The size of the parts stays the same.",
            },
            {
              content: A.math(r === 1 ? `2${fracTex(1, p.d)}` : `${r}${fracTex(1, p.d)}`),
              code: "FR.MIXED.CONVERT",
              feedback: `${p.a + p.b}/${p.d} is 1 whole (${p.d}/${p.d}) and ${r}/${p.d} more.`,
            },
          ],
          solution: [{ say: "", math: `${fracTex(p.a + p.b, p.d)} = ${mixed}` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `Ali drinks ${p.a}/${p.d} of a litre of water in the morning and ${p.b}/${p.d} of a litre in the afternoon.`,
          ],
          ask: "How much does he drink altogether, in litres?",
          correct: A.math(mixed),
          distractors: [
            {
              content: A.math(fracTex(p.a + p.b, 2 * p.d)),
              code: "FR.ADD.TOPS-AND-BOTTOMS",
              feedback: "Add the numerators; the denominator stays the same.",
            },
            {
              content: A.math(fracTex(r, p.d)),
              feedback: `That leaves out the whole litre: ${p.a + p.b}/${p.d} is more than 1.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `${fracTex(p.a, p.d)} + ${fracTex(p.b, p.d)} = ${fracTex(p.a + p.b, p.d)} = ${mixed}`,
            },
          ],
        });
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Eve says ",
                A.math(
                  `${fracTex(p.a, p.d)} + ${fracTex(p.b, p.d)} = ${fracTex(p.a + p.b, 2 * p.d)}`,
                ),
                ", which is less than 1.",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Add only the numerators: ${p.a + p.b}/${p.d}, which is 1 and ${r}/${p.d}.`,
                  correct: true,
                },
                {
                  text: "True. You add the tops and add the bottoms.",
                  code: "FR.ADD.TOPS-AND-BOTTOMS",
                },
                { text: "True. Two fractions less than 1 always add up to less than 1." },
              ],
              solution: [{ say: "", math: `${fracTex(p.a + p.b, p.d)} = ${mixed}` }],
            }),
          [
            {
              statement: "Bea says $\\frac{3}{5} + \\frac{4}{5} = 1\\frac{2}{5}$.",
              truth: true,
              right: "True. 3/5 + 4/5 = 7/5, which is 1 whole and 2/5.",
              wrong: [
                ["False. It is 7/10.", "FR.ADD.TOPS-AND-BOTTOMS"],
                ["False. It is 1 7/5.", "FR.MIXED.CONVERT"],
              ],
            },
            {
              claim: "Adding two fractions that are each more than a half gives more than 1.",
              truth: "always",
              right: "Always. Each is more than 1/2, so together they are more than 1/2 + 1/2 = 1.",
              wrong: [
                ["Never. Fractions add up to less than 1.", "FR.ADD.TOPS-AND-BOTTOMS"],
                ["Sometimes. Only for quarters."],
              ],
            },
            {
              statement: "Zac says $\\frac{5}{6} + \\frac{5}{6} = \\frac{10}{12}$.",
              truth: false,
              right: "False. Add the tops and keep the bottom: 10/6, which is 1 4/6 or 1 2/3.",
              wrong: [
                ["True. Add the tops and the bottoms.", "FR.ADD.TOPS-AND-BOTTOMS"],
                ["True. 5 + 5 = 10 and 6 + 6 = 12."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 4) return true;
    return chosenText(question).includes(`1${fracTex(p.a + p.b - p.d, p.d)}`);
  },
});
