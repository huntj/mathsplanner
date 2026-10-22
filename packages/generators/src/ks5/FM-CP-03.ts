/**
 * @statement FM-CP-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-03: Solve cubic and quartic equations with real coefficients using conjugate pairs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { cx } from "../shared/cplx.ts";

interface Params {
  r: number;
  p: number;
  q: number;
}

/** (z − r)(z² − 2pz + p² + q²) expanded. */
const cubic = (p: Params) => {
  const m = p.p * p.p + p.q * p.q;
  return [1, -2 * p.p - p.r, m + 2 * p.p * p.r, -p.r * m];
};

export default defineGenerator<Params>({
  id: "FM-CP-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CPLX.CONJUGATE", "ALG.QUADRATIC.ROOT-SIGN"],

  params(rng) {
    const p = { r: rng.int(-5, 5), p: rng.int(-3, 3), q: rng.int(1, 4) };
    if (p.r === 0 || p.p === 0) reject("a non-zero real root and real part");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const eq = `${poly(cubic(p), "z")} = 0`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "The equation ",
            A.math(eq),
            " has a root ",
            A.math(`z = ${cx(p.p, p.q)}`),
            ".",
          ],
          ask: "Which of these must also be a root?",
          correct: A.math(cx(p.p, -p.q)),
          distractors: [
            {
              content: A.math(cx(-p.p, p.q)),
              code: "CPLX.CONJUGATE",
              feedback: "The conjugate of a + bi is a − bi: only the imaginary part changes sign.",
            },
            {
              content: A.math(cx(-p.p, -p.q)),
              code: "CPLX.CONJUGATE",
              feedback: "The real part stays the same in the conjugate.",
            },
          ],
          solution: [
            {
              say: "A polynomial with real coefficients has its non-real roots in conjugate pairs.",
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Given that ",
                A.math(`${cx(p.p, p.q)}`),
                " is a root of ",
                A.math(eq),
                ",",
              ],
              ask: "find the real root.",
            },
          ],
          answer: A.number(p.r),
          wrong: signedWrongs(p.r, [
            {
              code: "ALG.QUADRATIC.ROOT-SIGN",
              value: A.number(-p.r),
              feedback: `The quadratic factor is ${poly([1, -2 * p.p, p.p * p.p + p.q * p.q], "z")}; divide to find the linear factor (z − r).`,
            },
          ]),
          solution: [
            {
              say: "The conjugate pair gives the quadratic factor ",
              math: `${poly([1, -2 * p.p, p.p * p.p + p.q * p.q], "z")}`,
            },
            {
              say: `Dividing leaves (z ${p.r < 0 ? "+" : "−"} ${Math.abs(p.r)}), so the real root is ${p.r}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Tia says a cubic equation with real coefficients can have exactly two real roots and one non-real root.",
          truth: false,
          reasons: [
            {
              text: "False. Non-real roots come in conjugate pairs, so a real cubic has either three real roots or one real root and a conjugate pair.",
              correct: true,
            },
            { text: "True. Any mixture of roots is possible.", code: "CPLX.CONJUGATE" },
            { text: "True. A cubic has three roots, so any split works.", code: "CPLX.CONJUGATE" },
          ],
          solution: [{ say: "If a + bi is a root, so is a − bi, when the coefficients are real." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === cx(p.p, -p.q);
    if (question.key.depth === 2) return numberAnswer(question) === p.r;
    return true;
  },
});
