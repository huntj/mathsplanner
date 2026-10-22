/**
 * @statement AL-P7.2a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P7.2a: Differentiate xⁿ for rational n and related sums and multiples
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  a: number;
  n: number;
  b: number;
  c: number;
  /** Depth 2: a√x + d/x. */
  s: number;
  d: number;
}

export default defineGenerator<Params>({
  id: "AL-P7.2a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.POWER-RULE"],

  params(rng) {
    const p = {
      a: rng.int(2, 6),
      n: rng.int(3, 6),
      b: rng.int(-9, 9),
      c: rng.int(-9, 9),
      s: 2 * rng.int(1, 5),
      d: rng.int(2, 9),
    };
    if (p.b === 0 || p.c === 0) reject("all terms present");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const expr = `${p.a}x^${p.n} ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}x ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)}`;
        const right = `${p.a * p.n}x^{${p.n - 1}} ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}`;
        const slip = `${p.a * p.n}x^{${p.n}} ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}x`;
        return A.standard({
          question: ["Find ", A.math("\\frac{dy}{dx}"), " for ", A.math(`y = ${expr}`), "."],
          answer: A.exact(right),
          wrong: [
            {
              code: "CALC.POWER-RULE",
              value: A.exact(slip),
              feedback:
                "Multiply by the power and then reduce the power by 1; constants differentiate to 0.",
            },
          ],
          solution: [{ say: "", math: `\\frac{dy}{dx} = ${right}` }],
        });
      }
      case 2: {
        const h = p.s / 2;
        const right = `\\frac{${h}}{\\sqrt{x}} + \\frac{${p.d}}{x^2}`;
        const slip = `${h}\\sqrt{x} - \\frac{${p.d}}{x}`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Differentiate ", A.math(`y = ${p.s}\\sqrt{x} - \\frac{${p.d}}{x}`), "."],
            },
            {
              question: [
                "Find ",
                A.math("\\frac{dy}{dx}"),
                " when ",
                A.math(`y = ${p.s}x^{\\frac{1}{2}} - ${p.d}x^{-1}`),
                ".",
              ],
            },
          ],
          answer: A.exact(right),
          wrong: [
            {
              code: "CALC.POWER-RULE",
              value: A.exact(slip),
              feedback:
                "Write √x as x^(1/2) and 1/x as x^(−1); multiply by the power and subtract 1 from it.",
            },
          ],
          solution: [
            {
              say: "",
              math: `y = ${p.s}x^{\\frac{1}{2}} - ${p.d}x^{-1} \\Rightarrow \\frac{dy}{dx} = ${h}x^{-\\frac{1}{2}} + ${p.d}x^{-2} = ${right}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben says the derivative of ",
            A.math(`y = ${p.a}x + ${Math.abs(p.c)}`),
            " is ",
            A.math(`${p.a} + ${Math.abs(p.c)}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. A constant has gradient 0, so the derivative is ${p.a}.`,
              correct: true,
            },
            { text: "True. Each term keeps its number.", code: "CALC.POWER-RULE" },
            { text: `False. It is ${p.a}x.`, code: "CALC.POWER-RULE" },
          ],
          solution: [
            { say: `y = ${p.a}x + ${Math.abs(p.c)} is a straight line with gradient ${p.a}.` },
          ],
        });
    }
  },

  verify() {
    return true;
  },
});
