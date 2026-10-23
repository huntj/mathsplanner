/**
 * @statement FM-FP2-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP2-04: Solve first- and second-order recurrence relations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

export interface Params {
  a: number;
  k: number;
  r1: number;
  r2: number;
}

const pow = (r: number) => (r < 0 ? `(${r})^n` : `${r}^n`);

export default defineGenerator<Params>({
  id: "FM-FP2-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.RECURRENCE"],

  params(rng) {
    const p = {
      a: rng.pick([-3, -2, 2, 3, 4, 5]),
      k: rng.int(-6, 6),
      r1: rng.int(-4, 5),
      r2: rng.int(-4, 5),
    };
    if (p.k === 0) reject("a non-zero particular solution");
    if (p.r1 >= p.r2 || [p.r1, p.r2].some((r) => r === 0 || r === 1 || r === -1) || p.r1 === -p.r2)
      reject("two distinct roots that give a clear general solution");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const b = p.k * (1 - p.a);
        return A.standard({
          question: [
            "The recurrence ",
            A.math(
              `u_{n+1} = ${linear([
                [p.a, "u_n"],
                [b, ""],
              ])}`,
            ),
            " has general solution ",
            A.math(`u_n = A(${p.a})^n + c`),
            " for a constant c.",
          ],
          ask: "Find c.",
          answer: A.number(p.k),
          wrong: signedWrongs(p.k, [
            {
              code: "ALG.RECURRENCE",
              value: A.number(-p.k),
              feedback: `Put u = c in u = ${p.a}u + ${b}: c(1 − ${p.a}) = ${b}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `c = ${p.a}c + ${b} \\Rightarrow c = \\frac{${b}}{1 - (${p.a})} = ${p.k}`,
            },
          ],
        });
      }
      case 2: {
        const right = `u_n = A \\cdot ${pow(p.r1)} + B \\cdot ${pow(p.r2)}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Find the general solution of ",
            A.math(
              `u_{n+2} = ${linear([
                [p.r1 + p.r2, "u_{n+1}"],
                [-p.r1 * p.r2, "u_n"],
              ])}`,
            ),
            ".",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`u_n = A \\cdot ${pow(-p.r1)} + B \\cdot ${pow(-p.r2)}`),
              code: "ALG.RECURRENCE",
              feedback: `The characteristic equation is r² ${p.r1 + p.r2 < 0 ? "+" : "−"} ${Math.abs(p.r1 + p.r2)}r ${p.r1 * p.r2 < 0 ? "−" : "+"} ${Math.abs(p.r1 * p.r2)} = 0: check the signs of its roots.`,
            },
            {
              content: A.math(`u_n = (A + Bn) \\cdot ${pow(p.r2)}`),
              code: "ALG.RECURRENCE",
              feedback: "The roots are different, so each gives its own power.",
            },
          ],
          solution: [
            { say: `The characteristic equation has roots ${p.r1} and ${p.r2}, so `, math: right },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kai says the general solution of ",
            A.math(`u_{n+2} = ${2 * p.a}u_{n+1} - ${p.a * p.a}u_n`),
            " is ",
            A.math(`u_n = A \\cdot ${pow(p.a)} + B \\cdot ${pow(p.a)}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The characteristic equation has a repeated root ${p.a}, so u_n = (A + Bn)(${p.a})ⁿ. The suggested form has really only one constant.`,
              correct: true,
            },
            {
              text: "True. Each root gives a power, and there are two roots.",
              code: "ALG.RECURRENCE",
            },
            {
              text: "True. A second-order recurrence needs constants A and B.",
              code: "ALG.RECURRENCE",
            },
          ],
          solution: [
            { say: `r² − ${2 * p.a}r + ${p.a * p.a} = (r − ${p.a})² = 0.`.replace(/− -/g, "+ ") },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k;
    if (question.key.depth === 2)
      return chosenText(question) === `u_n = A \\cdot ${pow(p.r1)} + B \\cdot ${pow(p.r2)}`;
    return true;
  },
});
