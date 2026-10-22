/**
 * @statement FM-FS1-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FS1-01: Find expectation and variance of discrete random variables, including functions of them
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";
import { tableLatex } from "../shared/sta.ts";

interface Params {
  a: number;
  b: number;
  v: number;
  probs: number[];
}

/** Var(X) for X taking 1, 2, 3, 4 with probabilities probs/10. */
function variance(probs: number[]): number {
  const p = probs.map((x) => x / 10);
  const e = p.reduce((s, x, i) => s + x * (i + 1), 0);
  const e2 = p.reduce((s, x, i) => s + x * (i + 1) ** 2, 0);
  return round(e2 - e * e, 2);
}
const ex2 = (probs: number[]) =>
  round(
    probs.reduce((s, x, i) => s + (x / 10) * (i + 1) ** 2, 0),
    2,
  );

export default defineGenerator<Params>({
  id: "FM-FS1-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.EXPECTATION"],

  params(rng) {
    const probs = [rng.int(1, 4), rng.int(1, 4), rng.int(1, 4)];
    const last = 10 - probs.reduce((s, x) => s + x, 0);
    if (last < 1) reject("probabilities summing to 1");
    const p = {
      a: rng.pick([-3, -2, 2, 3, 4, 5]),
      b: rng.int(-9, 9),
      v: rng.int(2, 9),
      probs: [...probs, last],
    };
    if (p.b === 0) reject("a non-zero shift");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.a * p.a * p.v;
        return A.standard({
          question: ["A random variable X has ", A.math(`\\operatorname{Var}(X) = ${p.v}`), "."],
          ask: [
            "Find ",
            A.math(`\\operatorname{Var}(${p.a}X ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)})`),
            ".",
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "PRO.EXPECTATION",
              value: A.number(Math.abs(p.a) * p.v),
              feedback: `Var(aX + b) = a²Var(X): square the ${p.a}.`,
            },
            {
              code: "PRO.EXPECTATION",
              value: A.number(v + p.b),
              feedback: "Adding a constant shifts the values but does not change their spread.",
            },
          ]),
          solution: [{ say: "", math: `(${p.a})^2 \\times ${p.v} = ${v}` }],
        });
      }
      case 2: {
        const v = variance(p.probs);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The random variable X has this probability distribution.",
                A.math(
                  tableLatex(
                    ["x", "1", "2", "3", "4"],
                    [["P(X = x)", ...p.probs.map((x) => x / 10)]],
                  ),
                ),
              ],
              ask: ["Find ", A.math("\\operatorname{Var}(X)"), "."],
            },
          ],
          answer: A.number(v, { accuracy: { dp: 2 } }),
          wrong: wrongs(v, [
            {
              code: "PRO.EXPECTATION",
              value: A.number(ex2(p.probs), { accuracy: { dp: 2 } }),
              feedback: "That is E(X²). Var(X) = E(X²) − [E(X)]².",
            },
          ]),
          solution: [{ say: `E(X²) = ${ex2(p.probs)}, and Var(X) = E(X²) − [E(X)]² = ${v}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Nat says that for independent X and Y, ",
            A.math("\\operatorname{Var}(X - Y) = \\operatorname{Var}(X) - \\operatorname{Var}(Y)"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Var(X − Y) = Var(X) + (−1)²Var(Y) = Var(X) + Var(Y): subtracting adds variability too.",
              correct: true,
            },
            { text: "True. Variances behave like means.", code: "PRO.EXPECTATION" },
            { text: "True. Taking away Y removes its spread.", code: "PRO.EXPECTATION" },
          ],
          solution: [
            {
              say: `If Var(X) = ${p.v} and Var(Y) = ${p.v + 1}, the suggestion would give a negative variance.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a * p.a * p.v;
    if (question.key.depth === 2) return numberAnswer(question) === variance(p.probs);
    return true;
  },
});
