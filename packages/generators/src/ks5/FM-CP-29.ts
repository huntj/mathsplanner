/**
 * @statement FM-CP-29
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-29: Solve second-order homogeneous and non-homogeneous differential equations with constant
// coefficients
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

export interface Params {
  m1: number;
  m2: number;
  p: number;
  q: number;
}

const ode = (b: number, c: number) =>
  `${linear([
    [1, "\\frac{d^2y}{dx^2}"],
    [b, "\\frac{dy}{dx}"],
    [c, "y"],
  ])} = 0`;
const ex = (m: number) => (m === 0 ? "" : `e^{${m === 1 ? "" : m === -1 ? "-" : m}x}`);
const trig = (q: number) => (q === 1 ? "x" : `${q}x`);

export default defineGenerator<Params>({
  id: "FM-CP-29",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.AUXILIARY"],

  params(rng) {
    const p = { m1: rng.int(-5, 5), m2: rng.int(-5, 5), p: rng.int(-3, 3), q: rng.int(1, 4) };
    if (
      p.m1 >= p.m2 ||
      p.m1 === 0 ||
      p.m2 === 0 ||
      p.m1 === -p.m2 ||
      p.p === 0 ||
      p.p === p.q ||
      p.p === -p.q
    )
      reject("distinct non-zero roots");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = `y = A${ex(p.m1)} + B${ex(p.m2)}`;
        return A.choice({
          rng,
          question: [
            "Find the general solution of ",
            A.math(ode(-(p.m1 + p.m2), p.m1 * p.m2)),
            ".",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`y = A${ex(-p.m1)} + B${ex(-p.m2)}`),
              code: "CALC.AUXILIARY",
              feedback: `The auxiliary equation m² ${p.m1 + p.m2 < 0 ? "+" : "−"} ${Math.abs(p.m1 + p.m2)}m ${p.m1 * p.m2 < 0 ? "−" : "+"} ${Math.abs(p.m1 * p.m2)} = 0 has roots ${p.m1} and ${p.m2}: check the signs.`,
            },
            {
              content: A.math(`y = (A + Bx)${ex(p.m1)}`),
              code: "CALC.AUXILIARY",
              feedback: "The roots are different, so each gives its own exponential.",
            },
          ],
          solution: [
            {
              say: `The auxiliary equation factorises as (m − ${p.m1})(m − ${p.m2}) = 0.`.replace(
                /− -/g,
                "+ ",
              ),
              math: right,
            },
          ],
        });
      }
      case 2: {
        const right = `y = ${ex(p.p)}\\left(A\\cos ${trig(p.q)} + B\\sin ${trig(p.q)}\\right)`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Find the general solution of ",
            A.math(ode(-2 * p.p, p.p * p.p + p.q * p.q)),
            ".",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(
                `y = ${ex(p.q)}\\left(A\\cos ${trig(Math.abs(p.p))} + B\\sin ${trig(Math.abs(p.p))}\\right)`,
              ),
              code: "CALC.AUXILIARY",
              feedback: `The roots are ${p.p} ± ${p.q}i: the real part goes in the exponential, the imaginary part in the trig functions.`,
            },
            {
              content: A.math(`y = A${ex(p.p)} + B${ex(p.q)}`),
              code: "CALC.AUXILIARY",
              feedback: "Complex roots a ± bi give e^(ax)(A cos bx + B sin bx).",
            },
          ],
          solution: [
            {
              say: `The auxiliary equation has roots ${p.p} ± ${p.q === 1 ? "" : p.q}i, so `,
              math: right,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Vic says the general solution of ",
            A.math(ode(-2 * p.m2, p.m2 * p.m2)),
            " is ",
            A.math(`y = A${ex(p.m2)} + B${ex(p.m2)}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The repeated root ${p.m2} gives y = (A + Bx)e^(${p.m2}x). Ae^(${p.m2}x) + Be^(${p.m2}x) has only one arbitrary constant, A + B.`,
              correct: true,
            },
            {
              text: "True. Each root of the auxiliary equation gives one exponential.",
              code: "CALC.AUXILIARY",
            },
            {
              text: "True. A second-order equation needs two constants, and this has A and B.",
              code: "CALC.AUXILIARY",
            },
          ],
          solution: [{ say: "For a repeated root m, the second solution is xe^(mx)." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `y = A${ex(p.m1)} + B${ex(p.m2)}`;
    if (question.key.depth === 2)
      return chosenText(question).startsWith(`y = ${ex(p.p)}\\left(A\\cos ${trig(p.q)}`);
    return true;
  },
});
