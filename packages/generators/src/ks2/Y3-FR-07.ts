/**
 * @statement Y3-FR-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y3-FR-07: Solve problems involving all of the above
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { fracTex, ratTex, slash } from "../shared/fr.ts";

interface Params {
  d: number;
  a: number;
  b: number;
  /** Depth 1: a fraction of an amount, k × d. */
  n: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "Y3-FR-07",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: [
    "FR.OF-AMOUNT.UNIT-ONLY",
    "FR.ADD.TOPS-AND-BOTTOMS",
    "FR.UNIT.BIGGER-DENOMINATOR",
  ],

  params(rng, numbers) {
    const d = rng.pick(numbers === "friendly" ? [4, 5, 6] : [6, 8, 10, 12]);
    const a = rng.int(1, d - 2);
    const b = rng.int(1, d - 1 - a);
    if (a === b) reject("different amounts eaten");
    return {
      d,
      a,
      b,
      n: rng.int(2, Math.min(4, d - 1)),
      k: rng.int(2, numbers === "stretch" ? 12 : 6),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const total = p.k * p.d;
        const answer = p.k * p.n;
        return A.standard({
          question: [
            "A box has ",
            String(total),
            " pencils. ",
            A.math(fracTex(p.n, p.d)),
            " of them are blue.",
          ],
          ask: "How many pencils are blue?",
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "FR.OF-AMOUNT.UNIT-ONLY",
              value: A.number(p.k),
              feedback: `${total} ÷ ${p.d} = ${p.k} is one part. Blue is ${p.n} parts.`,
            },
          ]),
          solution: [{ say: `${total} ÷ ${p.d} = ${p.k}, and ${p.k} × ${p.n} = ${answer}.` }],
        });
      }
      case 2: {
        const [x, y] = [p.a + 1, p.a + 3];
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Ali eats ",
            A.math(fracTex(1, x)),
            " of a pizza. Bea eats ",
            A.math(fracTex(1, y)),
            " of the same size pizza.",
          ],
          ask: "Who eats more?",
          correct: "Ali",
          distractors: [
            {
              content: "Bea",
              code: "FR.UNIT.BIGGER-DENOMINATOR",
              feedback: `Cutting into ${y} pieces makes smaller pieces than cutting into ${x}, so ${slash(1, y)} is less.`,
            },
            { content: "They eat the same", feedback: "The pieces are different sizes." },
          ],
          solution: [
            {
              say: `${slash(1, x)} > ${slash(1, y)}: the fewer the equal parts, the bigger each part.`,
            },
          ],
        });
      }
      default: {
        const eaten = frac(p.a + p.b, p.d);
        const left = frac(p.d - p.a - p.b, p.d);
        return A.multiStepContext({
          context: [
            "A cake is cut into ",
            String(p.d),
            " equal slices. Sam eats ",
            A.math(fracTex(p.a, p.d)),
            " of the cake and Tom eats ",
            A.math(fracTex(p.b, p.d)),
            ".",
          ],
          parts: [
            {
              ask: "What fraction of the cake do they eat altogether?",
              answer: A.exact(eaten),
              wrong: [
                {
                  code: "FR.ADD.TOPS-AND-BOTTOMS",
                  value: A.exact(fracTex(p.a + p.b, p.d * 2)),
                  feedback: `The slices are all ${slash(1, p.d)}s, so keep the denominator: ${slash(p.a + p.b, p.d)}.`,
                },
              ],
            },
            { ask: "What fraction of the cake is left?", answer: A.exact(left) },
          ],
          solution: [
            { say: `${p.a} + ${p.b} = ${p.a + p.b} slices, so ${slash(p.a + p.b, p.d)} is eaten.` },
            {
              say: `The whole cake is ${slash(p.d, p.d)}, so ${slash(p.d, p.d)} − ${slash(p.a + p.b, p.d)} = ${slash(p.d - p.a - p.b, p.d)} is left.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.k * p.n;
    if (question.archetype === "varied-form") return chosenText(question) === "Ali";
    const [x, y] = [question.parts[0]?.answer, question.parts[1]?.answer];
    return (
      x?.type === "exact" &&
      y?.type === "exact" &&
      String(x.value) === ratTex(frac(p.a + p.b, p.d)) &&
      String(y.value) === ratTex(frac(p.d - p.a - p.b, p.d))
    );
  },
});
