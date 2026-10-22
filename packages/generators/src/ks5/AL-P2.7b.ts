/**
 * @statement AL-P2.7b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.7b: Sketch and solve with the modulus of linear functions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  /** Depth 2: |2x − c| < d. */
  c: number;
  d: number;
}

const sign = (n: number) => (n < 0 ? `+ ${-n}` : `- ${n}`);
const half = (n: number) => toLatex(frac(n, 2));

export default defineGenerator<Params>({
  id: "AL-P2.7b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "ALG.MODULUS.NEGATIVE",
    "ALG.QUADRATIC.ROOT-SIGN",
    "ALG.INEQUALITY.QUADRATIC-REGION",
  ],

  params(rng) {
    const a = rng.int(-6, 6);
    const b = rng.int(2, 9);
    const c = rng.int(-7, 7);
    const d = rng.int(2, 9);
    if (a === 0 || c === 0 || Math.abs(a) === b)
      reject("a non-zero centre and two different solutions");
    return { a, b, c, d };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const sol = (u: number, v: number) =>
          A.math(`x = ${Math.min(u, v)} \\text{ or } x = ${Math.max(u, v)}`);
        return A.choice({
          rng,
          question: ["Solve ", A.math(`|x ${sign(p.a)}| = ${p.b}`), "."],
          correct: sol(p.a - p.b, p.a + p.b),
          distractors: [
            {
              content: A.math(`x = ${p.a + p.b}`),
              code: "ALG.MODULUS.NEGATIVE",
              feedback: `x ${sign(p.a)} can be ${p.b} or −${p.b}: there are two solutions.`,
            },
            {
              content: sol(-p.a - p.b, -p.a + p.b),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: `|x ${sign(p.a)}| measures the distance from ${p.a}, not ${-p.a}.`,
            },
          ],
          solution: [
            {
              say: `x ${sign(p.a)} = ${p.b} or x ${sign(p.a)} = −${p.b}, so x = ${p.a + p.b} or x = ${p.a - p.b}.`,
            },
          ],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Solve ", A.math(`|2x ${sign(p.c)}| < ${p.d}`), "."],
          correct: A.math(`${half(p.c - p.d)} < x < ${half(p.c + p.d)}`),
          distractors: [
            {
              content: A.math(`x < ${half(p.c - p.d)} \\text{ or } x > ${half(p.c + p.d)}`),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: `|2x ${sign(p.c)}| < ${p.d} means 2x ${sign(p.c)} lies between −${p.d} and ${p.d}.`,
            },
            {
              content: A.math(`${half(-p.c - p.d)} < x < ${half(-p.c + p.d)}`),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: "Check the sign when you rearrange.",
            },
            {
              content: A.math(`x < ${half(p.c + p.d)}`),
              code: "ALG.MODULUS.NEGATIVE",
              feedback: `There is a lower limit too: 2x ${sign(p.c)} > −${p.d}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `-${p.d} < 2x ${sign(p.c)} < ${p.d} \\Rightarrow ${half(p.c - p.d)} < x < ${half(p.c + p.d)}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Abi says ",
            A.math(`x = ${-p.b - Math.abs(p.a)}`),
            " is a solution of ",
            A.math(`|x + ${Math.abs(p.a)}| = -${p.b}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. A modulus is never negative, so |x + ${Math.abs(p.a)}| = −${p.b} has no solutions.`,
              correct: true,
            },
            {
              text: `True. x + ${Math.abs(p.a)} = −${p.b} gives x = ${-p.b - Math.abs(p.a)}.`,
              code: "ALG.MODULUS.NEGATIVE",
            },
            {
              text: `False. The solution is x = ${p.b - Math.abs(p.a)}.`,
              code: "ALG.MODULUS.NEGATIVE",
            },
          ],
          solution: [
            { say: `Check: |${-p.b - Math.abs(p.a)} + ${Math.abs(p.a)}| = ${p.b}, not −${p.b}.` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question).includes(`x = ${Math.min(p.a - p.b, p.a + p.b)} \\text{ or }`);
    return true;
  },
});
