/**
 * @statement Y8-RAT-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-RAT-02: Relate the language of ratios and the associated calculations to the arithmetic of
// fractions and to linear functions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { fracTex, gcdOf, slash } from "../shared/fr.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y8-RAT-02",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.PART-WHOLE", "RAT.ADDITIVE"],

  params(rng, numbers) {
    const a = rng.int(1, numbers === "friendly" ? 4 : 8);
    const b = rng.int(a + 1, numbers === "friendly" ? 6 : 12);
    if (gcdOf(a, b) !== 1) reject("a ratio in lowest terms");
    return { a, b, k: rng.int(2, numbers === "stretch" ? 20 : 9), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["The ratio of apples to pears in a box is ", A.math(`${p.a}:${p.b}`), "."],
          ask: "The number of apples is what fraction of the number of pears?",
          answer: A.exact(frac(p.a, p.b)),
          wrong: [
            {
              code: "RAT.PART-WHOLE",
              value: A.exact(fracTex(p.a, p.a + p.b)),
              feedback: `That is apples as a fraction of all the fruit. Compare apples with pears: ${slash(p.a, p.b)}.`,
            },
          ],
          solution: [
            {
              say: `For every ${p.b} pears there are ${p.a} apples, so apples = ${slash(p.a, p.b)} × pears.`,
            },
          ],
        });
      case 2: {
        const [x, y] = [p.b * p.k, p.a * p.k];
        return A.standard({
          question: ["Two quantities are always in the ratio ", A.math(`y:x = ${p.a}:${p.b}`), "."],
          ask: ["Find ", A.math("y"), " when ", A.math(`x = ${x}`), "."],
          answer: A.number(y),
          wrong: wrongs(y, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(x - (p.b - p.a)),
              feedback: `${x} is ${p.k} × ${p.b}, so y is ${p.k} × ${p.a}. The difference does not stay the same; the ratio does.`,
            },
          ]),
          solution: [{ say: `y = ${slash(p.a, p.b)} × x = ${slash(p.a, p.b)} × ${x} = ${y}.` }],
        });
      }
      default: {
        const shown = p.claimTrue ? fracTex(p.a, p.b) : fracTex(p.a, p.a + p.b);
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "If ",
                A.math(`y:x = ${p.a}:${p.b}`),
                " for every pair of values, then ",
                A.math(`y = ${shown}x`),
                ".",
              ],
              truth: p.claimTrue,
              reasons: p.claimTrue
                ? [
                    {
                      text: `True. y is always ${slash(p.a, p.b)} of x, so the graph of y against x is a straight line through the origin with gradient ${slash(p.a, p.b)}.`,
                      correct: true,
                    },
                    {
                      text: `False. It should be y = ${slash(p.a, p.a + p.b)}x, out of the total.`,
                      code: "RAT.PART-WHOLE",
                    },
                    { text: "False. Ratios cannot be written as equations." },
                  ]
                : [
                    {
                      text: `False. y:x = ${p.a}:${p.b} means y is ${slash(p.a, p.b)} of x, so y = ${slash(p.a, p.b)}x.`,
                      correct: true,
                    },
                    {
                      text: `True. y is ${p.a} parts out of ${p.a + p.b}.`,
                      code: "RAT.PART-WHOLE",
                    },
                    { text: "True. Any fraction with the numbers in it will do." },
                  ],
              solution: [{ say: `y:x = ${p.a}:${p.b} ⇔ y = ${slash(p.a, p.b)}x.` }],
            }),
          [
            {
              statement:
                "Red and blue beads are in the ratio 2 : 3. Ava says $\\frac{2}{3}$ of the beads are red.",
              truth: false,
              right: "False. There are 2 + 3 = 5 parts, so 2/5 of the beads are red.",
              wrong: [
                ["True. The ratio 2 : 3 is the fraction 2/3.", "RAT.PART-WHOLE"],
                ["True. There are 2 red beads for every 3."],
              ],
            },
            {
              statement:
                "Flour and sugar are in the ratio 5 : 2. Leo says there is 2.5 times as much flour as sugar.",
              truth: true,
              right: "True. 5 ÷ 2 = 2.5.",
              wrong: [
                [
                  "False. There is 3 more flour than sugar, not a number of times as much.",
                  "RAT.ADDITIVE",
                ],
                ["False. There is 5/7 as much flour as sugar.", "RAT.PART-WHOLE"],
              ],
            },
            {
              claim: "If x and y are in the ratio 1 : 4, then y = x + 3.",
              truth: "sometimes",
              right: "Sometimes. The ratio means y = 4x, which equals x + 3 only when x = 1.",
              wrong: [
                ["Always. 4 is 3 more than 1.", "RAT.ADDITIVE"],
                ["Never. Ratios do not give equations."],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") return String(a.value) === toLatex(frac(p.a, p.b));
    if (question.archetype === "standard") return numberAnswer(question) * p.b === p.a * p.b * p.k;
    return true;
  },
});
