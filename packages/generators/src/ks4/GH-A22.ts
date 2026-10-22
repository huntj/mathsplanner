/**
 * @statement GH-A22
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A22: Solve linear inequalities in two variables and quadratic inequalities; use set notation
// and graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** Depth 1: (x − p)(x − q) < 0 with p < q. */
  p: number;
  q: number;
  /** Depth 2 and 4: x² > k². */
  k: number;
}

export default defineGenerator<Params>({
  id: "GH-A22",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "ALG.INEQUALITY.QUADRATIC-REGION",
    "ALG.QUADRATIC.ROOT-SIGN",
    "ALG.QUADRATIC.ONE-ROOT",
  ],

  params(rng) {
    const p = rng.int(-6, 5);
    const q = rng.int(p + 1, 7);
    if (p === 0 || q === 0 || p === -q) reject("two non-zero roots that are not opposites");
    return { p, q, k: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Solve ", A.math(`${bracket(-p.p)}${bracket(-p.q)} < 0`), "."],
          correct: A.math(`${p.p} < x < ${p.q}`),
          distractors: [
            {
              content: A.math(`x < ${p.p} \\text{ or } x > ${p.q}`),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: "Sketch the U-shaped curve: it is below the x-axis between its roots.",
            },
            {
              content: A.math(`${-p.q} < x < ${-p.p}`),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: `The roots of ${bracket(-p.p)}${bracket(-p.q)} = 0 are ${p.p} and ${p.q}.`,
            },
            {
              content: A.math(`x < ${p.q}`),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: "Both roots matter: the curve is negative only between them.",
            },
          ],
          solution: [
            {
              say: `The curve crosses the x-axis at ${p.p} and ${p.q}; it is negative between them.`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which set describes the solution of ", A.math(`x^2 > ${p.k * p.k}`), "?"],
          correct: A.math(`\\{x : x < -${p.k}\\} \\cup \\{x : x > ${p.k}\\}`),
          distractors: [
            {
              content: A.math(`\\{x : x > ${p.k}\\}`),
              code: "ALG.QUADRATIC.ONE-ROOT",
              feedback: `x² > ${p.k * p.k} also when x is less than −${p.k}, e.g. x = −${p.k + 1}.`,
            },
            {
              content: A.math(`\\{x : -${p.k} < x < ${p.k}\\}`),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: `Between −${p.k} and ${p.k}, x² is less than ${p.k * p.k}.`,
            },
            {
              content: A.math(`\\{x : x > ${p.k * p.k}\\}`),
              feedback: `Take the square root of ${p.k * p.k}.`,
            },
          ],
          solution: [
            {
              say: `x² = ${p.k * p.k} when x = ±${p.k}; the U-shaped curve y = x² − ${p.k * p.k} is above the axis outside these values.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben says the solution of ",
            A.math(`x^2 \\le ${p.k * p.k}`),
            " is ",
            A.math(`x \\le ${p.k}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. x must also be at least −${p.k}: the solution is −${p.k} ≤ x ≤ ${p.k}. For example, x = −${p.k + 3} gives ${(p.k + 3) ** 2}, which is too big.`,
              correct: true,
            },
            { text: "True. Square root both sides.", code: "ALG.QUADRATIC.ONE-ROOT" },
            { text: `False. It is x ≥ ${p.k}.`, code: "ALG.INEQUALITY.QUADRATIC-REGION" },
          ],
          solution: [{ say: "Find both roots and sketch the graph before choosing the region." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).includes(`${p.p} < x < ${p.q}`);
    return true;
  },
});
