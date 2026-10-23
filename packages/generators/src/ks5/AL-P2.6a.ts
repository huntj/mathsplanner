/**
 * @statement AL-P2.6a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.6a: Manipulate polynomials: expand, factorise, divide by a linear expression; use the factor
// theorem
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly } from "../shared/alg.ts";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  r1: number;
  r2: number;
  r3: number;
}

/** (x − r1)(x − r2)(x − r3) = x³ + bx² + cx + d. */
const coeffs = (p: Params) => {
  const { r1, r2, r3 } = p;
  return [1, -(r1 + r2 + r3), r1 * r2 + r2 * r3 + r3 * r1, -r1 * r2 * r3] as const;
};

export default defineGenerator<Params>({
  id: "AL-P2.6a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.ROOT-SIGN", "ALG.FACTORISE.SIGNS"],

  params(rng) {
    const p = { r1: rng.int(-4, 4), r2: rng.int(-4, 4), r3: rng.int(-5, 5) };
    const [, b, c, d] = coeffs(p);
    if (
      new Set([p.r1, p.r2, p.r3]).size < 3 ||
      [p.r1, p.r2, p.r3].includes(0) ||
      b === 0 ||
      c === 0 ||
      d === 0
    )
      reject("three different non-zero roots and four terms");
    if (p.r1 === -p.r2 || p.r1 === -p.r3 || p.r2 === -p.r3) reject("no pair of opposite roots");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const [, b, c, d] = coeffs(p);
    switch (depth) {
      case 1: {
        const slip = -((-p.r1) ** 3) - b * p.r1 * p.r1 - c * -p.r1;
        return A.standard({
          question: [
            "The polynomial ",
            A.math(`f(x) = ${poly([1, b, c, 0])} + k`),
            " has a factor ",
            A.math(bracket(-p.r1)),
            ".",
          ],
          ask: "Find the value of k.",
          answer: A.number(d),
          wrong: signedWrongs(d, [
            {
              code: "ALG.QUADRATIC.ROOT-SIGN",
              value: A.number(slip),
              feedback: `(x ${p.r1 < 0 ? "+" : "−"} ${Math.abs(p.r1)}) is a factor when f(${p.r1}) = 0.`,
            },
          ]),
          solution: [
            {
              say: `Factor theorem: f(${p.r1}) = 0.`,
              math: `${p.r1 ** 3} ${b * p.r1 * p.r1 < 0 ? "-" : "+"} ${Math.abs(b * p.r1 * p.r1)} ${c * p.r1 < 0 ? "-" : "+"} ${Math.abs(c * p.r1)} + k = 0 \\Rightarrow k = ${d}`,
            },
          ],
        });
      }
      case 2: {
        const cubic = poly([1, b, c, d]);
        const right = `${bracket(-p.r1)}${bracket(-p.r2)}${bracket(-p.r3)}`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                A.math(bracket(-p.r1)),
                " is a factor of ",
                A.math(`f(x) = ${cubic}`),
                ".",
              ],
              ask: "Factorise f(x) completely.",
            },
            {
              question: [
                "Given that ",
                A.math(`f(${p.r1}) = 0`),
                ", factorise ",
                A.math(`f(x) = ${cubic}`),
                " fully.",
              ],
            },
          ],
          answer: A.exact(right, "factorised"),
          wrong: [
            {
              code: "ALG.FACTORISE.SIGNS",
              value: A.exact(`${bracket(p.r1)}${bracket(p.r2)}${bracket(p.r3)}`),
              feedback: "Expand your answer to check the signs.",
            },
          ],
          solution: [
            {
              say: `Divide by ${bracket(-p.r1)}: `,
              math: `${cubic} = ${bracket(-p.r1)}(${poly([1, -(p.r2 + p.r3), p.r2 * p.r3])})`,
            },
            { say: "Factorise the quadratic: ", math: right },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "For ",
            A.math(`f(x) = ${poly([1, b, c, d])}`),
            ", Leo finds that ",
            A.math(`f(${p.r1}) = 0`),
            ". He says ",
            A.math(bracket(p.r1)),
            " is a factor.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. f(${p.r1}) = 0 means (x − (${p.r1})) = ${bracket(-p.r1)} is a factor.`,
              correct: true,
            },
            {
              text: "True. The number in the bracket matches the value that gives zero.",
              code: "ALG.QUADRATIC.ROOT-SIGN",
            },
            { text: "False. f(a) = 0 tells you nothing about factors." },
          ],
          solution: [{ say: "Factor theorem: f(a) = 0 ⇔ (x − a) is a factor." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === coeffs(p)[3];
    return true;
  },
});
