/**
 * @statement GF-A4.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GF-A4 sub-statements
 */
// GF-A4.c: Factorise by taking out a common factor
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear } from "../shared/alg.ts";
import { gcdOf } from "../shared/fr.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  k: number;
  a: number;
  b: number;
  /** A factor of k shown in the depth 4 claim. */
  f: number;
}

const inner = (a: number, b: number, letter = "x") =>
  linear([
    [a, letter],
    [b, ""],
  ]);

export default defineGenerator<Params>({
  id: "GF-A4.c",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FACTORISE.ONE-TERM"],

  params(rng, numbers) {
    const k = rng.int(2, numbers === "stretch" ? 12 : 8);
    const a = rng.int(2, 7);
    const b = rng.int(1, 9) * (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    if (gcdOf(a, Math.abs(b)) !== 1 || Math.abs(b) === 1)
      reject("a bracket with no common factor left");
    const factors = Array.from({ length: k - 2 }, (_, i) => i + 2).filter((f) => k % f === 0);
    if (factors.length === 0) reject("a composite factor, so a partial factorisation exists");
    return { k, a, b, f: rng.pick(factors) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = `${p.k}(${inner(p.a, p.b)})`;
        return A.standard({
          question: ["Factorise ", A.math(inner(p.k * p.a, p.k * p.b)), " fully."],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.ONE-TERM",
              value: A.exact(`${p.k}(${inner(p.a, p.k * p.b)})`),
              feedback: `Divide both terms by ${p.k}: ${p.k * p.b} ÷ ${p.k} = ${p.b}. Check by expanding.`,
            },
          ],
          solution: [
            {
              say: `The highest common factor of ${p.k * p.a} and ${Math.abs(p.k * p.b)} is ${p.k}: `,
              math: right,
            },
          ],
        });
      }
      case 2: {
        const right = `${p.k}x(${inner(p.a, p.b)})`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Factorise ",
                A.math(
                  linear([
                    [p.k * p.a, "x^2"],
                    [p.k * p.b, "x"],
                  ]),
                ),
                " fully.",
              ],
            },
            {
              question: [
                "Fully factorise ",
                A.math(
                  linear([
                    [p.k * p.a, "x^2"],
                    [p.k * p.b, "x"],
                  ]),
                ),
                ".",
              ],
            },
          ],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.ONE-TERM",
              value: A.exact(`${p.k}x(${inner(p.a, p.k * p.b)})`),
              feedback: `Divide both terms by ${p.k}x. Check by expanding your answer.`,
            },
          ],
          solution: [{ say: `Both terms share ${p.k} and x, so take out ${p.k}x: `, math: right }],
        });
      }
      default: {
        const partial = `${p.f}(${inner((p.k / p.f) * p.a, (p.k / p.f) * p.b)})`;
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Cleo says ",
                A.math(partial),
                " is the full factorisation of ",
                A.math(inner(p.k * p.a, p.k * p.b)),
                ".",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Expanding gives the right expression, but the bracket still has a common factor of ${p.k / p.f}. Fully factorised, it is ${p.k}(${inner(p.a, p.b)}).`,
                  correct: true,
                },
                { text: "True. Any factor taken out of both terms is a full factorisation." },
                {
                  text: "False. You can only take out a factor from the first term.",
                  code: "ALG.FACTORISE.ONE-TERM",
                },
              ],
              solution: [{ say: `Take out the highest common factor, ${p.k}.` }],
            }),
          [
            {
              statement: "Ana fully factorises $12x + 18$ as $6(2x + 3)$.",
              truth: true,
              right: "True. 6 is the HCF of 12 and 18.",
              wrong: [
                ["False. It is 2(6x + 9).", "ALG.FACTORISE.ONE-TERM"],
                ["False. It is 6(2x + 18).", "ALG.FACTORISE.ONE-TERM"],
              ],
            },
            {
              claim: "Expanding a correct factorisation gives back the original expression.",
              truth: "always",
              right: "Always. Factorising and expanding undo each other.",
              wrong: [
                ["Never. They give different expressions.", "ALG.FACTORISE.ONE-TERM"],
                ["Sometimes. Only with numbers."],
              ],
            },
            {
              statement:
                "Leo factorises $5x^2 + 10x$ as $5(x^2 + 2x)$ and says it is fully factorised.",
              truth: false,
              right: "False. x is a common factor too: 5x(x + 2).",
              wrong: [
                ["True. 5 is the common factor.", "ALG.FACTORISE.ONE-TERM"],
                ["True. You only take out numbers."],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return a?.type === "exact" && a.value === `${p.k}(${inner(p.a, p.b)})`;
    return true;
  },
});
