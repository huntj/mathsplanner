/**
 * @statement FM-CP-16
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-16: Find Maclaurin series of functions, including general terms, and use standard series
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

export interface Params {
  a: number;
}

const frac = (num: number, den: number) => {
  const g = gcdOf(Math.abs(num), Math.abs(den));
  const [n, d] = [num / g, den / g];
  return d === 1 ? String(n) : `${n < 0 ? "-" : ""}\\frac{${Math.abs(n)}}{${d}}`;
};

/** A term c·xᵏ with c = num/den, written with a sign for joining. */
const term = (num: number, den: number, k: number) => {
  const g = gcdOf(Math.abs(num), Math.abs(den));
  const [n, d] = [Math.abs(num) / g, den / g];
  const coef = d === 1 ? (n === 1 ? "" : String(n)) : `\\frac{${n}}{${d}}`;
  return `${num < 0 ? "-" : "+"} ${coef}x^{${k}}`;
};

export default defineGenerator<Params>({
  id: "FM-CP-16",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.MACLAURIN"],

  params(rng) {
    return { a: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    const a = p.a;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Find the coefficient of ",
            A.math("x^3"),
            " in the Maclaurin series of ",
            A.math(`e^{${a}x}`),
            ".",
          ],
          answer: A.exact(frac(a ** 3, 6)),
          wrong: [
            {
              code: "CALC.MACLAURIN",
              value: A.exact(frac(a ** 3, 3)),
              feedback: "The x³ term is (ax)³/3!: divide by 3! = 6.",
            },
          ],
          solution: [{ say: "", math: `\\frac{(${a}x)^3}{3!} = ${frac(a ** 3, 6)}x^3` }],
        });
      case 2: {
        const right = `1 ${term(-(a ** 2), 2, 2)} ${term(a ** 4, 24, 4)}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which is the Maclaurin series of ",
            A.math(`\\cos(${a}x)`),
            " up to the term in ",
            A.math("x^4"),
            "?",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`1 ${term(-a, 2, 2)} ${term(a, 24, 4)}`),
              code: "CALC.MACLAURIN",
              feedback: `Replace x by ${a}x everywhere: (${a}x)² = ${a ** 2}x².`,
            },
            {
              content: A.math(`1 ${term(a ** 2, 2, 2)} ${term(a ** 4, 24, 4)}`),
              code: "CALC.MACLAURIN",
              feedback: "The signs in the cosine series alternate.",
            },
          ],
          solution: [{ say: `Substitute ${a}x into cos x = 1 − x²/2! + x⁴/4! − …: `, math: right }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Hal says ", A.math("\\ln x"), " has a Maclaurin series."],
          truth: false,
          reasons: [
            {
              text: "False. A Maclaurin series needs the function and its derivatives at x = 0, but ln x is not defined there. Use ln(1 + x) instead.",
              correct: true,
            },
            { text: "True. Every function has a Maclaurin series.", code: "CALC.MACLAURIN" },
            { text: "True. Its series is x − x²/2 + x³/3 − …", code: "CALC.MACLAURIN" },
          ],
          solution: [{ say: "ln(1 + x) = x − x²/2 + x³/3 − … for −1 < x ≤ 1." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === frac(p.a ** 3, 6);
    return true;
  },
});
