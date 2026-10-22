/**
 * @statement FM-CP-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-02: Use the language and arithmetic of complex numbers, including complex conjugates and
// solving quadratics with complex roots
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";
import { cx } from "../shared/cplx.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  d: number;
  /** Depth 2: roots p ± qi. */
  p: number;
  q: number;
}

export default defineGenerator<Params>({
  id: "FM-CP-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CPLX.ARITHMETIC"],

  params(rng) {
    const p = {
      a: rng.int(-5, 6),
      b: rng.int(-5, 6),
      c: rng.int(-5, 6),
      d: rng.int(-5, 6),
      p: rng.int(-4, 4),
      q: rng.int(1, 5),
    };
    if ([p.a, p.b, p.c, p.d].includes(0) || p.b * p.d === 0) reject("all parts non-zero");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const re = p.a * p.c - p.b * p.d;
        const im = p.a * p.d + p.b * p.c;
        return A.standard({
          question: [
            "Given ",
            A.math(`z = ${cx(p.a, p.b)}`),
            " and ",
            A.math(`w = ${cx(p.c, p.d)}`),
            ", find ",
            A.math("zw"),
            " in the form ",
            A.math("x + yi"),
            ".",
          ],
          answer: A.exact(cx(re, im)),
          wrong: [
            {
              code: "CPLX.ARITHMETIC",
              value: A.exact(cx(p.a * p.c + p.b * p.d, im)),
              feedback: `i² = −1, so ${p.b}i × ${p.d}i = ${-p.b * p.d}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `(${cx(p.a, p.b)})(${cx(p.c, p.d)}) = ${p.a * p.c} + ${p.a * p.d}i + ${p.b * p.c}i + ${p.b * p.d}i^2 = ${cx(re, im)}`,
            },
          ],
        });
      }
      case 2: {
        // z² − 2p z + (p² + q²) = 0
        const B = -2 * p.p;
        const C = p.p * p.p + p.q * p.q;
        const roots = (re: number, im: number) =>
          A.math(`z = ${cx(re, im)} \\text{ or } z = ${cx(re, -im)}`);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Solve ", A.math(`${poly([1, B, C], "z")} = 0`), "."],
          correct: roots(p.p, p.q),
          distractors: [
            {
              content: A.math(`z = ${p.p + p.q} \\text{ or } z = ${p.p - p.q}`),
              code: "CPLX.ARITHMETIC",
              feedback:
                "The discriminant is negative, so the roots are complex: the square root of a negative gives i.",
            },
            {
              content: roots(-p.p, p.q),
              code: "CPLX.ARITHMETIC",
              feedback: `The real part is −b/2 = ${p.p}.`,
            },
          ].filter((d) => JSON.stringify(d.content) !== JSON.stringify(roots(p.p, p.q))),
          solution: [
            {
              say: "",
              math: `z = \\frac{${-B} \\pm \\sqrt{${B * B - 4 * C}}}{2} = ${cx(p.p, p.q)} \\text{ or } ${cx(p.p, -p.q)}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Cal says ",
            A.math(`(${cx(p.q, 1)})(${cx(p.q, -1)}) = ${p.q * p.q - 1}`),
            ".",
          ],
          truth: false,
          reasons: [
            { text: `False. (a + i)(a − i) = a² − i² = a² + 1 = ${p.q * p.q + 1}.`, correct: true },
            { text: "True. It is a difference of two squares, a² − 1.", code: "CPLX.ARITHMETIC" },
            { text: "True. i² = 1.", code: "CPLX.ARITHMETIC" },
          ],
          solution: [{ say: "z z̄ = |z|² is always real and non-negative." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return chosenText(question).includes(cx(p.p, p.q));
    return true;
  },
});
