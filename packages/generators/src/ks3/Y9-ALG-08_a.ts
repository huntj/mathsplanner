/**
 * @statement Y9-ALG-08.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-08.a: Recognise and continue geometric sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  r: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-08.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.GEOMETRIC-ADD"],

  params(rng) {
    return { a: rng.int(1, 5), r: rng.int(2, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    const t = (n: number) => p.a * p.r ** (n - 1);
    switch (depth) {
      case 1: {
        const v = t(5);
        return A.standard({
          question: [`Find the next term in the sequence ${[1, 2, 3, 4].map(t).join(", ")}, …`],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SEQUENCE.GEOMETRIC-ADD",
              value: A.number(t(4) + (t(4) - t(3))),
              feedback: `The terms are multiplied by ${p.r} each time, not increased by the same amount.`,
            },
          ]),
          solution: [{ say: "", math: `${t(4)} \\times ${p.r} = ${v}` }],
        });
      }
      case 2: {
        const v = t(7);
        return A.variedForm({
          rng,
          forms: [
            { question: [`A geometric sequence starts ${t(1)}, ${t(2)}, … Find its 7th term.`] },
            {
              question: [
                `A plant has ${t(1)} leaves. The number of leaves is multiplied by ${p.r} each week.`,
              ],
              ask: "How many leaves are there in week 7, counting the start as week 1?",
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "ALG.SEQUENCE.GEOMETRIC-ADD",
              value: A.number(t(1) + 6 * (t(2) - t(1))),
              feedback: `Multiply by ${p.r} six times: ${t(1)} × ${p.r}^6.`,
            },
          ]),
          solution: [{ say: "", math: `${t(1)} \\times ${p.r}^{6} = ${v}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["The terms of a geometric sequence get bigger."],
              truth: "sometimes",
              reasons: [
                {
                  text: `Sometimes. Multiplying by ${p.r} makes them grow, but multiplying by ½ (e.g. 64, 32, 16, …) makes them shrink.`,
                  correct: true,
                },
                {
                  text: "Always. Multiplying makes numbers bigger.",
                  code: "ALG.SEQUENCE.GEOMETRIC-ADD",
                },
                { text: "Never. Geometric sequences always go down." },
              ],
              solution: [
                { say: "The common ratio decides: bigger than 1 grows; between 0 and 1 shrinks." },
              ],
            }),
          [
            {
              statement: "Ivy says the next term of 3, 6, 12, 24, … is 48.",
              truth: true,
              right: "True. Each term is double the one before, and 24 × 2 = 48.",
              wrong: [
                ["False. It goes up by 3, so 27.", "ALG.SEQUENCE.GEOMETRIC-ADD"],
                ["False. It is 36, adding 12."],
              ],
            },
            {
              statement: "Sam says 2, 4, 6, 8, … is a geometric sequence.",
              truth: false,
              right:
                "False. It adds 2 each time, so it is arithmetic. A geometric sequence multiplies by the same number.",
              wrong: [
                ["True. The terms double: 2 to 4.", "ALG.SEQUENCE.GEOMETRIC-ADD"],
                ["True. Any sequence of even numbers is geometric."],
              ],
            },
            {
              claim:
                "Multiplying each term by $\\frac{1}{2}$ gives a geometric sequence whose terms get smaller.",
              truth: "always",
              right:
                "Always, for positive terms. Halving makes each positive term smaller: 40, 20, 10, 5, …",
              wrong: [
                ["Never. Geometric sequences always grow.", "ALG.SEQUENCE.GEOMETRIC-ADD"],
                ["Sometimes. Only when the first term is even."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a * p.r ** 4;
    if (question.key.depth === 2) return numberAnswer(question) === p.a * p.r ** 6;
    return true;
  },
});
