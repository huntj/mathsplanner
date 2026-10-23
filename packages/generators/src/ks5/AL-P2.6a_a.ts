/**
 * @statement AL-P2.6a.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P2.6a.a: Expand and factorise polynomials
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** (x + a)(x + b)(x + c). */
  a: number;
  b: number;
  c: number;
}

/** Coefficients of (x + a)(x + b)(x + c). */
const cubic = (a: number, b: number, c: number) => [1, a + b + c, a * b + b * c + c * a, a * b * c];

export default defineGenerator<Params>({
  id: "AL-P2.6a.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.BINOMIAL-TWO-TERMS", "ALG.FACTORISE.SIGNS"],

  params(rng) {
    const p = { a: rng.int(-5, 5), b: rng.int(-5, 5), c: rng.int(-4, 4) };
    const k = cubic(p.a, p.b, p.c);
    if ([p.a, p.b, p.c].includes(0) || new Set([p.a, p.b, p.c]).size < 3 || k.includes(0))
      reject("four non-zero terms");
    if (Math.abs(k[1] ?? 0) === Math.abs(k[2] ?? 0)) reject("distinct wrong expansions");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const [, s1, s2, s3] = cubic(p.a, p.b, p.c);
    const expanded = poly(cubic(p.a, p.b, p.c));
    const brackets = `${bracket(p.a)}${bracket(p.b)}${bracket(p.c)}`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Expand ", A.math(brackets), "."],
          correct: A.math(expanded),
          distractors: [
            {
              content: A.math(poly([1, 0, 0, s3 ?? 0])),
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              feedback:
                "Multiply every term in each bracket by every term in the others, not just the firsts and lasts.",
            },
            {
              content: A.math(poly([1, s1 ?? 0, -(s2 ?? 0), s3 ?? 0])),
              feedback: "Check the x term: add every product of two of the numbers.",
            },
            {
              content: A.math(poly([1, s2 ?? 0, s1 ?? 0, s3 ?? 0])),
              feedback:
                "The x² coefficient is the sum of the numbers; the x coefficient is the sum of their products in pairs.",
            },
          ],
          solution: [{ say: "", math: `${brackets} = ${expanded}` }],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Given that ",
            A.math(bracket(p.a)),
            " is a factor of ",
            A.math(expanded),
            ", factorise it completely.",
          ],
          correct: A.math(brackets),
          distractors: [
            {
              content: A.math(`${bracket(-p.a)}${bracket(-p.b)}${bracket(-p.c)}`),
              code: "ALG.FACTORISE.SIGNS",
              feedback: "Expand your answer to check the signs.",
            },
            {
              content: A.math(`${bracket(p.a)}${bracket(p.b)}${bracket(-p.c)}`),
              code: "ALG.FACTORISE.SIGNS",
              feedback: "Check the constant term: the three numbers multiply to give it.",
            },
          ],
          solution: [
            {
              say: `Divide by ${bracket(p.a).replace(/[()]/g, "")} to get a quadratic, then factorise it: ${brackets}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Isla says ",
            A.math(`${bracket(p.a)}${bracket(p.b)} = ${poly([1, 0, p.a * p.b])}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The x terms are missing: ${poly([1, p.a + p.b, p.a * p.b])}.`,
              correct: true,
            },
            {
              text: "True. Multiply the firsts and the lasts.",
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
            },
            { text: "True. The middle terms always cancel." },
          ],
          solution: [
            {
              say: "",
              math: `${bracket(p.a)}${bracket(p.b)} = ${poly([1, p.a + p.b, p.a * p.b])}`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).includes(poly(cubic(p.a, p.b, p.c)));
    if (question.key.depth === 2)
      return chosenText(question).includes(`${bracket(p.a)}${bracket(p.b)}${bracket(p.c)}`);
    return true;
  },
});
