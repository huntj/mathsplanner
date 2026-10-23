/**
 * @statement AL-P7.3.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P7.3.c: Find where functions are increasing or decreasing
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

interface Params {
  r: number;
  s: number;
}

const set = (a: string) => `\\{x : ${a}\\}`;

export default defineGenerator<Params>({
  id: "AL-P7.3.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.STATIONARY", "ALG.INEQUALITY.QUADRATIC-REGION"],

  params(rng) {
    const p = { r: rng.int(-5, 3), s: rng.int(-3, 6) };
    if (p.s - p.r < 2 || (p.r + p.s) % 2 !== 0)
      reject("two stationary points with whole coefficients");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    // f'(x) = 3(x − r)(x − s), so f(x) = x³ − (3/2)(r + s)x² + 3rs x.
    const f = `f(x) = ${poly([1, (-3 * (p.r + p.s)) / 2, 3 * p.r * p.s, 0])}`;
    const between = set(`${p.r} < x < ${p.s}`);
    const outside = `${set(`x < ${p.r}`)} \\cup ${set(`x > ${p.s}`)}`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["For ", A.math(f), ", for which values of x is f decreasing?"],
          correct: A.math(between),
          distractors: [
            {
              content: A.math(outside),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: `f'(x) = 3(x − ${p.r})(x − ${p.s}) is negative between its roots.`,
            },
            {
              content: A.math(set(`x < ${p.r}`)),
              code: "CALC.STATIONARY",
              feedback: "Decreasing means f'(x) < 0; find where the quadratic f'(x) is negative.",
            },
          ],
          solution: [
            {
              say: "",
              math: `f'(x) = 3(x ${p.r < 0 ? "+" : "-"} ${Math.abs(p.r)})(x ${p.s < 0 ? "+" : "-"} ${Math.abs(p.s)}) < 0 \\iff ${p.r} < x < ${p.s}`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["For ", A.math(f), ", for which values of x is f increasing?"],
          correct: A.math(outside),
          distractors: [
            {
              content: A.math(between),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback:
                "f'(x) is positive outside its roots, since the x² coefficient is positive.",
            },
            {
              content: A.math(set(`x > ${p.s}`)),
              code: "CALC.STATIONARY",
              feedback: `f'(x) is also positive for x < ${p.r}.`,
            },
          ],
          solution: [{ say: `f is increasing where f'(x) > 0: x < ${p.r} or x > ${p.s}.` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Zak says ",
            A.math(f),
            ` is increasing for x > 0, because f(x) gets bigger as x gets bigger.`,
          ],
          truth: p.s <= 0,
          reasons:
            p.s > 0
              ? [
                  {
                    text: `False. f'(x) < 0 for ${p.r} < x < ${p.s}, so f decreases there.`,
                    correct: true,
                  },
                  { text: "True. Cubics always increase for positive x.", code: "CALC.STATIONARY" },
                  { text: "True. Increasing means the values are positive." },
                ]
              : [
                  {
                    text: `True. Both stationary points are at x ≤ 0, so f'(x) > 0 for every x > 0.`,
                    correct: true,
                  },
                  {
                    text: "False. Cubics always decrease somewhere for x > 0.",
                    code: "CALC.STATIONARY",
                  },
                  { text: "False. Increasing means the values are positive." },
                ],
          solution: [{ say: "f is increasing where f'(x) > 0 and decreasing where f'(x) < 0." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `\\{x : ${p.r} < x < ${p.s}\\}`;
    if (question.key.depth === 2) return chosenText(question).includes(`x < ${p.r}\\} \\cup`);
    return true;
  },
});
