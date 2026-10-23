/**
 * @statement FM-CP-26
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-26: Define and sketch hyperbolic functions and their inverses, including logarithmic forms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, exactAnswer } from "../shared/counting.ts";

export interface Params {
  k: number;
  m: number;
}

const coshLn = (k: number) => toLatex(frac(k * k + 1, 2 * k));

export default defineGenerator<Params>({
  id: "FM-CP-26",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.HYPERBOLIC"],

  params(rng) {
    return { k: rng.int(2, 7), m: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Find the exact value of ", A.math(`\\cosh(\\ln ${p.k})`), "."],
          answer: A.exact(coshLn(p.k)),
          wrong: [
            {
              code: "ALG.HYPERBOLIC",
              value: A.exact(toLatex(frac(p.k * p.k - 1, 2 * p.k))),
              feedback: "cosh x = (eˣ + e⁻ˣ)/2, with a plus: that value is sinh(ln k).",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\cosh(\\ln ${p.k}) = \\frac{${p.k} + \\frac{1}{${p.k}}}{2} = ${coshLn(p.k)}`,
            },
          ],
        });
      case 2: {
        const right = `\\ln\\left(${p.m} + \\sqrt{${p.m * p.m - 1}}\\right)`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Write ", A.math(`\\operatorname{arcosh} ${p.m}`), " in logarithmic form."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`\\ln\\left(${p.m} + \\sqrt{${p.m * p.m + 1}}\\right)`),
              code: "ALG.HYPERBOLIC",
              feedback: "That is arsinh. For arcosh x the square root is √(x² − 1).",
            },
            {
              content: A.math(`\\ln\\left(${p.m} - \\sqrt{${p.m * p.m - 1}}\\right)`),
              code: "ALG.HYPERBOLIC",
              feedback: "That is negative; arcosh takes the non-negative value.",
            },
          ],
          solution: [{ say: "arcosh x = ln(x + √(x² − 1)) for x ≥ 1: ", math: right }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Sol says the equation ",
            A.math(`\\cosh x = \\frac{1}{${p.k}}`),
            " has two solutions.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. cosh x ≥ 1 for every real x (its minimum is cosh 0 = 1), so it has no solutions.",
              correct: true,
            },
            { text: "True. Like cos x, cosh x takes each value twice.", code: "ALG.HYPERBOLIC" },
            { text: "True. cosh is even, so ±x both work.", code: "ALG.HYPERBOLIC" },
          ],
          solution: [{ say: "(eˣ + e⁻ˣ)/2 ≥ √(eˣ × e⁻ˣ) = 1 by the AM–GM inequality." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === coshLn(p.k);
    if (question.key.depth === 2)
      return chosenText(question).includes(`${p.m} + \\sqrt{${p.m * p.m - 1}}`);
    return true;
  },
});
