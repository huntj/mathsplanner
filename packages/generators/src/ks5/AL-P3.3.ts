/**
 * @statement AL-P3.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P3.3: Use parametric equations of curves and convert between Cartesian and parametric forms
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, signed, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** x = t + b, y = t² + c. */
  b: number;
  c: number;
  t: number;
  /** Depth 4: x = r cos t, y = r sin t. */
  r: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P3.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.PARAMETRIC.SUBSTITUTE", "ALG.CIRCLE.RADIUS-SQUARED"],

  params(rng) {
    const p = {
      b: rng.int(-5, 5),
      c: rng.int(-6, 6),
      t: rng.int(-4, 4),
      r: rng.int(2, 5),
      claimTrue: rng.bool(),
    };
    if (p.b === 0 || p.c === 0 || p.t === 0 || (p.t + p.b) ** 2 === p.t * p.t)
      reject("a shift that changes the answer");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const curve = [A.math(`x = t ${signed(p.b)}`), ", ", A.math(`y = t^2 ${signed(p.c)}`)];
    switch (depth) {
      case 1: {
        const X = p.t + p.b;
        const y = p.t * p.t + p.c;
        return A.standard({
          question: ["A curve has parametric equations ", ...curve, "."],
          ask: `Find the value of y when x = ${X}.`,
          answer: A.number(y),
          wrong: signedWrongs(y, [
            {
              code: "ALG.PARAMETRIC.SUBSTITUTE",
              value: A.number(X * X + p.c),
              feedback: `First find t: t ${signed(p.b)} = ${X} gives t = ${p.t}. Then substitute t, not x.`,
            },
          ]),
          solution: [
            { say: `t = ${X} ${signed(-p.b)} = ${p.t}, so y = ${p.t}² ${signed(p.c)} = ${y}.` },
          ],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["A curve has parametric equations ", ...curve, "."],
              ask: "Find a Cartesian equation of the curve, giving y in terms of x.",
            },
            { question: ["Eliminate t from ", ...curve, "."], ask: "Write y in terms of x." },
          ],
          answer: A.exact(`y = ${bracket(-p.b)}^2 ${signed(p.c)}`),
          wrong: [
            {
              code: "ALG.PARAMETRIC.SUBSTITUTE",
              value: A.exact(`y = x^2 ${signed(p.c)}`),
              feedback: `Make t the subject first: t = x ${signed(-p.b)}.`,
            },
          ],
          solution: [
            { say: `t = x ${signed(-p.b)}, so `, math: `y = ${bracket(-p.b)}^2 ${signed(p.c)}` },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? [
                "Ollie says the curve ",
                A.math(`x = ${p.r}\\cos t,\\ y = ${p.r}\\sin t`),
                ` is a circle with centre (0, 0) and radius ${p.r}.`,
              ]
            : [
                "Ollie says the curve ",
                A.math(`x = ${p.r}\\cos t,\\ y = ${p.r}\\sin t`),
                ` is a circle with radius ${p.r * p.r}.`,
              ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. x² + y² = ${p.r * p.r}(cos²t + sin²t) = ${p.r * p.r}, a circle of radius ${p.r}.`,
                  correct: true,
                },
                { text: `False. The radius is ${p.r * p.r}.`, code: "ALG.CIRCLE.RADIUS-SQUARED" },
                { text: "False. Parametric curves cannot be circles." },
              ]
            : [
                {
                  text: `False. x² + y² = ${p.r * p.r}, so the radius is √${p.r * p.r} = ${p.r}.`,
                  correct: true,
                },
                {
                  text: `True. x² + y² = ${p.r * p.r}, so the radius is ${p.r * p.r}.`,
                  code: "ALG.CIRCLE.RADIUS-SQUARED",
                },
                {
                  text: "True. Square each coefficient to get the radius.",
                  code: "ALG.CIRCLE.RADIUS-SQUARED",
                },
              ],
          solution: [{ say: "Use cos²t + sin²t = 1 to eliminate t." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.t * p.t + p.c;
    return true;
  },
});
