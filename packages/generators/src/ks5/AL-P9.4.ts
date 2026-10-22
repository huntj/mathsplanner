/**
 * @statement AL-P9.4
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P9.4: Use the trapezium rule to estimate areas
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  c: number;
  claimTrue: boolean;
}

const r3 = (x: number) => Math.round(x * 1000) / 1000;

function trap(
  f: (x: number) => number,
  a: number,
  b: number,
  n: number,
  doubled = true,
  halved = true,
) {
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (doubled ? 2 : 1) * f(a + i * h);
  return (halved ? h / 2 : h) * s;
}

export default defineGenerator<Params>({
  id: "AL-P9.4",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.TRAPEZIUM"],

  params(rng) {
    return { n: rng.int(3, 6), c: rng.int(1, 5), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const f = (x: number) => Math.sqrt(x + p.c);
        const v = r3(trap(f, 0, p.n, p.n));
        return A.standard({
          question: [
            "Use the trapezium rule with ",
            A.math(`${p.n}`),
            " strips to estimate ",
            A.math(`\\int_0^{${p.n}} \\sqrt{x + ${p.c}}\\,dx`),
            ".",
          ],
          ask: "Give your answer to 3 decimal places.",
          answer: A.number(v, { accuracy: { dp: 3 } }),
          wrong: wrongs(v, [
            {
              code: "ALG.TRAPEZIUM",
              value: A.number(r3(trap(f, 0, p.n, p.n, false)), { accuracy: { dp: 3 } }),
              feedback: "Double every ordinate except the first and last.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{1}{2} \\times 1 \\times [y_0 + 2(y_1 + \\dots + y_{${p.n - 1}}) + y_{${p.n}}] = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const f = (x: number) => x * x + p.c;
        const v = r3(trap(f, 0, 2, 4));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Use the trapezium rule with 4 strips of width 0.5 to estimate ",
                A.math(`\\int_0^2 (x^2 + ${p.c})\\,dx`),
                ".",
              ],
              ask: "Give your answer to 3 decimal places.",
            },
          ],
          answer: A.number(v, { accuracy: { dp: 3 } }),
          wrong: wrongs(v, [
            {
              code: "ALG.TRAPEZIUM",
              value: A.number(r3(trap(f, 0, 2, 4, true, false)), { accuracy: { dp: 3 } }),
              feedback: "The rule is (h/2)[…]: halve the strip width.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{0.5}{2}[${f(0)} + 2(${f(0.5)} + ${f(1)} + ${f(1.5)}) + ${f(2)}] = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? ["Rob says the trapezium rule overestimates ", A.math("\\int_0^2 x^2\\,dx"), "."]
            : ["Rob says the trapezium rule always underestimates the area under a curve."],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. y = x² is convex (curves upwards), so each straight top lies above the curve.",
                  correct: true,
                },
                { text: "False. The trapezium rule is always exact.", code: "ALG.TRAPEZIUM" },
                { text: "False. It always underestimates.", code: "ALG.TRAPEZIUM" },
              ]
            : [
                {
                  text: "False. For a convex curve (bending upwards) it overestimates; for a concave curve it underestimates.",
                  correct: true,
                },
                {
                  text: "True. The trapeziums always miss part of the area.",
                  code: "ALG.TRAPEZIUM",
                },
                { text: "True. Straight lines are always below curves.", code: "ALG.TRAPEZIUM" },
              ],
          solution: [
            { say: "Compare the straight tops of the trapeziums with the shape of the curve." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r3(trap((x) => Math.sqrt(x + p.c), 0, p.n, p.n));
    return true;
  },
});
