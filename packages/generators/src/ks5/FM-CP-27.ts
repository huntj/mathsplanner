/**
 * @statement FM-CP-27
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-27: Prove and use hyperbolic identities; differentiate and integrate hyperbolic functions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, exactAnswer } from "../shared/counting.ts";

/** Triples (a, b, c) with b² − a² square-free-ish and a² + b² = c². */
const TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
] as const;

export interface Params {
  t: number;
  k: number;
}

const triple = (t: number) => TRIPLES[t] ?? TRIPLES[0];

export default defineGenerator<Params>({
  id: "FM-CP-27",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.HYPERBOLIC", "CALC.CHAIN"],

  params(rng) {
    return { t: rng.int(0, TRIPLES.length - 1), k: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    const [a, b, c] = triple(p.t);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Given that ",
            A.math(`\\sinh x = \\frac{${a}}{${b}}`),
            ", find the exact value of ",
            A.math("\\cosh x"),
            ".",
          ],
          answer: A.exact(`\\frac{${c}}{${b}}`),
          wrong: [
            {
              code: "CALC.HYPERBOLIC",
              value: A.exact(`\\frac{\\sqrt{${b * b - a * a}}}{${b}}`),
              feedback: "The identity is cosh²x − sinh²x = 1, with a minus: cosh²x = 1 + sinh²x.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\cosh^2 x = 1 + \\frac{${a * a}}{${b * b}} = \\frac{${c * c}}{${b * b}}, \\text{ and } \\cosh x > 0, \\text{ so } \\cosh x = \\frac{${c}}{${b}}`,
            },
          ],
        });
      case 2: {
        const right = `${p.k}\\sinh(${p.k}x)`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Differentiate ", A.math(`y = \\cosh(${p.k}x)`), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`-${p.k}\\sinh(${p.k}x)`),
              code: "CALC.HYPERBOLIC",
              feedback: "Unlike cos, d/dx cosh x = +sinh x.",
            },
            {
              content: A.math(`\\sinh(${p.k}x)`),
              code: "CALC.CHAIN",
              feedback: `Use the chain rule: multiply by ${p.k}.`,
            },
          ],
          solution: [{ say: "", math: `\\frac{d}{dx}\\cosh(${p.k}x) = ${right}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Tom says ",
            A.math("\\cosh 2x = 1 - 2\\sinh^2 x"),
            ", just as ",
            A.math("\\cos 2x = 1 - 2\\sin^2 x"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. cosh 2x = 1 + 2sinh²x. By Osborn's rule, a product of two sines changes sign in the hyperbolic version.",
              correct: true,
            },
            {
              text: "True. Hyperbolic identities are the same as trig identities.",
              code: "CALC.HYPERBOLIC",
            },
            { text: "True. Both come from the double angle formula.", code: "CALC.HYPERBOLIC" },
          ],
          solution: [
            {
              say: "Check at x = 1 with the exponential definitions, or use cosh 2x = cosh²x + sinh²x.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return exactAnswer(question) === `\\frac{${triple(p.t)[2]}}{${triple(p.t)[1]}}`;
    if (question.key.depth === 2) return chosenText(question) === `${p.k}\\sinh(${p.k}x)`;
    return true;
  },
});
