/**
 * @statement AL-P2.5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.5: Solve linear and quadratic inequalities; interpret graphically and as regions; use set
// notation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** Depth 1: (x − p)(2x − s) ≤ 0, roots p and s/2. */
  p: number;
  s: number;
  /** Depth 2: (x − u)(x − v) < 0 and x > w, with u < w < v. */
  u: number;
  v: number;
  w: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "AL-P2.5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INEQUALITY.QUADRATIC-REGION", "ALG.INEQUALITY.FLIP"],

  params(rng) {
    const p = rng.int(-4, 4);
    const s = 2 * rng.int(-3, 3) + 1;
    const u = rng.int(-5, 2);
    const v = rng.int(u + 3, 7);
    const w = rng.int(u + 1, v - 1);
    if (p === 0) reject("a non-zero root");
    return { p, s, u, v, w, k: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const lo = Math.min(p.p, p.s / 2);
        const hi = Math.max(p.p, p.s / 2);
        const show = (x: number) => toLatex(frac(Math.round(2 * x), 2));
        return A.choice({
          rng,
          question: ["Solve ", A.math(`${poly([2, -(2 * p.p + p.s), p.p * p.s])} \\le 0`), "."],
          correct: A.math(`${show(lo)} \\le x \\le ${show(hi)}`),
          distractors: [
            {
              content: A.math(`x \\le ${show(lo)} \\text{ or } x \\ge ${show(hi)}`),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: "The U-shaped curve is below the x-axis between its roots.",
            },
            {
              content: A.math(`${show(-hi)} \\le x \\le ${show(-lo)}`),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: `The roots are ${show(lo)} and ${show(hi)}: factorise to (x ${p.p < 0 ? "+" : "-"} ${Math.abs(p.p)})(2x ${p.s < 0 ? "+" : "-"} ${Math.abs(p.s)}).`,
            },
          ],
          solution: [
            {
              say: "Factorise: ",
              math: `(x ${p.p < 0 ? "+" : "-"} ${Math.abs(p.p)})(2x ${p.s < 0 ? "+" : "-"} ${Math.abs(p.s)}) \\le 0`,
            },
            { say: "The curve is on or below the axis between the roots." },
          ],
        });
      }
      case 2: {
        const set = (a: string) => `\\{x : ${a}\\}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Find the set of values of x for which both ",
            A.math(`${poly([1, -(p.u + p.v), p.u * p.v])} < 0`),
            " and ",
            A.math(`x > ${p.w}`),
            ".",
          ],
          correct: A.math(set(`${p.w} < x < ${p.v}`)),
          distractors: [
            {
              content: A.math(set(`${p.u} < x < ${p.v}`)),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: `Both must hold, so x must also be more than ${p.w}.`,
            },
            {
              content: A.math(`${set(`x < ${p.u}`)} \\cup ${set(`x > ${p.v}`)}`),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: "The quadratic is negative between its roots, not outside them.",
            },
            {
              content: A.math(set(`x > ${p.w}`)),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: "Combine both inequalities: the values must satisfy each one.",
            },
          ],
          solution: [
            {
              say: `The quadratic is negative for ${p.u} < x < ${p.v}; with x > ${p.w}, that leaves ${p.w} < x < ${p.v}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Sol says that dividing both sides of ",
            A.math(`-${p.k}x < ${p.k * 3}`),
            " by ",
            A.math(`-${p.k}`),
            " gives ",
            A.math("x < -3"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Dividing an inequality by a negative number reverses it: x > −3.",
              correct: true,
            },
            {
              text: "True. Do the same to both sides and the sign stays the same.",
              code: "ALG.INEQUALITY.FLIP",
            },
            { text: "False. It gives x < 3." },
          ],
          solution: [
            { say: "Check with x = 0: −0 < 9 is true, and 0 > −3 agrees, but 0 < −3 does not." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return chosenText(question).includes(`${p.w} < x < ${p.v}`);
    return true;
  },
});
