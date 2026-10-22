/**
 * @statement FM-CP-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-06: Use exponential form re^(iθ) and de Moivre's theorem, including trig identities from it
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { piLatex } from "../shared/trig.ts";

interface Params {
  r: number;
  n: number;
  /** θ in degrees, a multiple of 15. */
  theta: number;
}

export default defineGenerator<Params>({
  id: "FM-CP-06",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CPLX.DE-MOIVRE"],

  params(rng) {
    const n = rng.int(2, 5);
    const theta = 15 * rng.int(1, 6);
    if (n * theta > 180) reject("nθ within (−π, π]");
    return { r: rng.int(2, 4), n, theta };
  },

  build(p, depth, rng): QuestionDraft {
    const z = A.math(
      `z = ${p.r}\\left(\\cos ${piLatex(p.theta)} + i\\sin ${piLatex(p.theta)}\\right)`,
    );
    switch (depth) {
      case 1: {
        const m = p.r ** p.n;
        return A.standard({
          question: ["Given ", z, ", find ", A.math(`|z^${p.n}|`), "."],
          answer: A.number(m),
          wrong: wrongs(m, [
            {
              code: "CPLX.DE-MOIVRE",
              value: A.number(p.r * p.n),
              feedback: `|zⁿ| = |z|ⁿ = ${p.r}^${p.n}.`,
            },
          ]),
          solution: [{ say: `${p.r}^${p.n} = ${m}.` }],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            { question: ["Given ", z, ", find ", A.math(`\\arg(z^${p.n})`), " in terms of π."] },
          ],
          answer: A.exact(piLatex(p.n * p.theta)),
          wrong: [
            {
              code: "CPLX.DE-MOIVRE",
              value: A.exact(piLatex(p.theta)),
              feedback: `De Moivre: raising to the power ${p.n} multiplies the argument by ${p.n}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `\\arg(z^${p.n}) = ${p.n} \\times ${piLatex(p.theta)} = ${piLatex(p.n * p.theta)}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ivy says ",
            A.math(
              `(\\cos\\theta + i\\sin\\theta)^${p.n} = \\cos^${p.n}\\theta + i\\sin^${p.n}\\theta`,
            ),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. De Moivre's theorem gives cos ${p.n}θ + i sin ${p.n}θ: the angle is multiplied, not the functions raised to a power.`,
              correct: true,
            },
            { text: "True. Raise each part to the power.", code: "CPLX.DE-MOIVRE" },
            {
              text: `True. Both sides equal 1 when θ = 0, so they are always equal.`,
              code: "CPLX.DE-MOIVRE",
            },
          ],
          solution: [
            {
              say: `Check with θ = π/4: the left side has modulus 1, but cos^${p.n}(π/4) + i sin^${p.n}(π/4) has modulus less than 1.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.r ** p.n;
    return true;
  },
});
