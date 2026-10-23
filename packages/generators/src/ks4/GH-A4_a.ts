/**
 * @statement GH-A4.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A4.a: Expand the product of three binomials
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
}

const cubic = (a: number, b: number, c: number) => [1, a + b + c, a * b + b * c + c * a, a * b * c];

export default defineGenerator<Params>({
  id: "GH-A4.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.BINOMIAL-TWO-TERMS", "ALG.EXPAND.NEGATIVE"],

  params(rng, numbers) {
    const sign = () => (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    const p = { a: rng.int(1, 5) * sign(), b: rng.int(1, 5) * sign(), c: rng.int(1, 5) * sign() };
    const [, s, q] = cubic(p.a, p.b, p.c);
    if (s === 0 || q === 0) reject("every power of x present");
    const abs = cubic(Math.abs(p.a), Math.abs(p.b), Math.abs(p.c))[2];
    if (numbers !== "friendly" && abs === q) reject("a sign slip that changes the x coefficient");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const product = `${bracket(p.a)}${bracket(p.b)}${bracket(p.c)}`;
    const [, s = 0, q = 0, r = 0] = cubic(p.a, p.b, p.c);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Expand and simplify ", A.math(product), "."],
          answer: A.exact(poly(cubic(p.a, p.b, p.c)), "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.exact(poly([1, s, 0, r])),
              feedback:
                "Expand two brackets fully first, then multiply every term by the third bracket.",
            },
          ],
          solution: [
            {
              say: "",
              math: `${bracket(p.a)}${bracket(p.b)} = ${poly([1, p.a + p.b, p.a * p.b])}`,
            },
            {
              say: `Multiply by ${bracket(p.c)} and collect like terms: `,
              math: poly(cubic(p.a, p.b, p.c)),
            },
          ],
        });
      case 2: {
        const slip = cubic(Math.abs(p.a), Math.abs(p.b), Math.abs(p.c))[2] ?? 0;
        return A.variedForm({
          rng,
          forms: [
            { question: ["When ", A.math(product), " is expanded, what is the coefficient of x?"] },
          ],
          answer: A.number(q),
          wrong: signedWrongs(q, [
            {
              code: "ALG.EXPAND.NEGATIVE",
              value: A.number(slip),
              feedback: "Keep the signs of the numbers in the brackets when multiplying them.",
            },
          ]),
          solution: [
            {
              say: "The x terms come from multiplying two of the numbers each time: ",
              math: `${p.a} \\times ${p.b} + ${p.b} \\times ${p.c} + ${p.c} \\times ${p.a} = ${q}`.replace(
                /\+ -/g,
                "- ",
              ),
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Isla says ",
            A.math(`(x + ${Math.abs(p.a)})^3 = x^3 + ${Math.abs(p.a) ** 3}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. (x + ${Math.abs(p.a)})³ = (x + ${Math.abs(p.a)})(x + ${Math.abs(p.a)})(x + ${Math.abs(p.a)}) = ${poly(cubic(Math.abs(p.a), Math.abs(p.a), Math.abs(p.a)))}.`,
              correct: true,
            },
            { text: "True. Cube each term in the bracket.", code: "ALG.EXPAND.BINOMIAL-TWO-TERMS" },
            {
              text: "True. Powers can be shared out over addition.",
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
            },
          ],
          solution: [{ say: "Try x = 1 to check: the two sides differ." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === cubic(p.a, p.b, p.c)[2];
    return true;
  },
});
