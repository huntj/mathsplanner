/**
 * @statement FM-CP-28
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-28: Solve first-order linear differential equations using an integrating factor
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  k: number;
  m: number;
  form: number;
}

const xPow = (n: number) => (n === 1 ? "x" : `x^{${n}}`);

export default defineGenerator<Params>({
  id: "FM-CP-28",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.INTEGRATING-FACTOR"],

  params(rng) {
    return { k: rng.int(2, 5), m: rng.int(1, 4), form: rng.int(0, 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const byX = p.form === 0;
        const eq = byX
          ? `\\frac{dy}{dx} + \\frac{${p.k}}{x}y = ${xPow(p.m)}`
          : `\\frac{dy}{dx} + ${p.k}xy = x`;
        const right = byX ? xPow(p.k) : `e^{${p.k % 2 === 0 ? p.k / 2 : `\\frac{${p.k}}{2}`}x^2}`;
        return A.choice({
          rng,
          question: ["Find an integrating factor for ", A.math(eq), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(byX ? `e^{\\frac{${p.k}}{x}}` : `e^{${p.k}x}`),
              code: "CALC.INTEGRATING-FACTOR",
              feedback: "The integrating factor is e^(∫P dx): integrate P first.",
            },
            {
              content: A.math(byX ? `${p.k}\\ln x` : `\\frac{${p.k}}{2}x^2`),
              code: "CALC.INTEGRATING-FACTOR",
              feedback: "That is ∫P dx; the integrating factor is e to that power.",
            },
          ],
          solution: [
            { say: "", math: `e^{\\int ${byX ? `\\frac{${p.k}}{x}` : `${p.k}x`}\\,dx} = ${right}` },
          ],
        });
      }
      case 2: {
        // x dy/dx + ky = x^m → y = x^m/(m + k) + c x^(−k)
        const right = `y = \\frac{${xPow(p.m)}}{${p.m + p.k}} + \\frac{c}{${xPow(p.k)}}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Find the general solution of ",
            A.math(`x\\frac{dy}{dx} + ${p.k}y = ${xPow(p.m)}`),
            ", for x > 0.",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`y = \\frac{${xPow(p.m)}}{${p.m + p.k}} + c`),
              code: "CALC.INTEGRATING-FACTOR",
              feedback: `Divide the constant by the integrating factor x^${p.k} too.`,
            },
            {
              content: A.math(
                `y = \\frac{${xPow(p.m + 1)}}{${p.m + p.k + 1}} + \\frac{c}{${xPow(p.k)}}`,
              ),
              code: "CALC.INTEGRATING-FACTOR",
              feedback: "First divide by x to get dy/dx + Py = Q: then Q is x^(m − 1).",
            },
          ],
          solution: [
            {
              say: `Divide by x: dy/dx + (${p.k}/x)y = ${p.m === 1 ? "1" : `x^${p.m - 1}`}. The integrating factor is x^${p.k}.`,
            },
            {
              say: "",
              math: `\\frac{d}{dx}\\left(x^{${p.k}}y\\right) = ${xPow(p.m + p.k - 1)} \\Rightarrow x^{${p.k}}y = \\frac{${xPow(p.m + p.k)}}{${p.m + p.k}} + c`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Uma says the integrating factor for ",
            A.math(`\\frac{dy}{dx} + \\frac{${p.k}y}{x} = x`),
            " is ",
            A.math(`e^{\\frac{${p.k}}{x}}`),
            ".",
          ],
          truth: false,
          reasons: [
            { text: `False. It is e^(∫${p.k}/x dx) = e^(${p.k} ln x) = x^${p.k}.`, correct: true },
            { text: "True. The integrating factor is e^P.", code: "CALC.INTEGRATING-FACTOR" },
            { text: `False. It is ${p.k} ln x.`, code: "CALC.INTEGRATING-FACTOR" },
          ],
          solution: [{ say: `Check: x^${p.k} × (dy/dx + ${p.k}y/x) = d/dx(x^${p.k} y).` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2)
      return (
        chosenText(question) === `y = \\frac{${xPow(p.m)}}{${p.m + p.k}} + \\frac{c}{${xPow(p.k)}}`
      );
    return true;
  },
});
