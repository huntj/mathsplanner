/**
 * @statement AL-P5.6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P5.6: Use addition and double angle formulae; write a cos θ + b sin θ as R cos(θ ± α) or
// R sin(θ ± α)
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

/** sin and cos of 15°, 75° and 105° as LaTeX, with the sign-slip value. */
const EXACT = [
  {
    fn: "\\sin",
    angle: 75,
    as: "45^\\circ + 30^\\circ",
    value: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
    slip: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
  },
  {
    fn: "\\cos",
    angle: 75,
    as: "45^\\circ + 30^\\circ",
    value: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
    slip: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
  },
  {
    fn: "\\sin",
    angle: 15,
    as: "45^\\circ - 30^\\circ",
    value: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
    slip: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
  },
  {
    fn: "\\cos",
    angle: 15,
    as: "45^\\circ - 30^\\circ",
    value: "\\frac{\\sqrt{6} + \\sqrt{2}}{4}",
    slip: "\\frac{\\sqrt{6} - \\sqrt{2}}{4}",
  },
] as const;

const TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [6, 8, 10],
] as const;

interface Params {
  e: number;
  t: number;
}

export default defineGenerator<Params>({
  id: "AL-P5.6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.ADDITION.SIGN", "GEO.PYTHAG.NO-SQUARE"],

  params(rng) {
    return { e: rng.int(0, EXACT.length - 1), t: rng.int(0, TRIPLES.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const e = EXACT[p.e] ?? (EXACT[0] as (typeof EXACT)[number]);
        return A.choice({
          rng,
          question: [
            "By writing ",
            A.math(`${e.angle}^\\circ = ${e.as}`),
            ", find the exact value of ",
            A.math(`${e.fn} ${e.angle}^\\circ`),
            ".",
          ],
          correct: A.math(e.value),
          distractors: [
            {
              content: A.math(e.slip),
              code: "GEO.ADDITION.SIGN",
              feedback:
                "Check the sign: sin(A ± B) = sin A cos B ± cos A sin B, but cos(A ± B) = cos A cos B ∓ sin A sin B.",
            },
            {
              content: A.math("\\frac{\\sqrt{2} + 1}{2}"),
              code: "GEO.ADDITION.SIGN",
              feedback: "sin(A + B) is not sin A + sin B: use the addition formula.",
            },
          ],
          solution: [
            {
              say: "Use the addition formula with the exact values of 45° and 30°: ",
              math: e.value,
            },
          ],
        });
      }
      case 2: {
        const [a, b, R] = TRIPLES[p.t] ?? (TRIPLES[0] as (typeof TRIPLES)[number]);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Write ",
                A.math(`${a}\\cos\\theta + ${b}\\sin\\theta`),
                " in the form ",
                A.math("R\\cos(\\theta - \\alpha)"),
                ", where R > 0.",
              ],
              ask: "Find the value of R.",
            },
          ],
          answer: A.number(R),
          wrong: wrongs(R, [
            { code: "GEO.PYTHAG.NO-SQUARE", value: A.number(a + b), feedback: "R = √(a² + b²)." },
          ]),
          solution: [{ say: "", math: `R = \\sqrt{${a}^2 + ${b}^2} = ${R}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ivy says ", A.math("\\sin 2\\theta = 2\\sin\\theta"), " for every θ."],
          truth: false,
          reasons: [
            {
              text: "False. sin 2θ = 2 sin θ cos θ. For example, θ = 90° gives sin 180° = 0, but 2 sin 90° = 2.",
              correct: true,
            },
            { text: "True. Doubling the angle doubles the sine.", code: "GEO.ADDITION.SIGN" },
            {
              text: "True. It works for small angles, so it always works.",
              code: "GEO.ADDITION.SIGN",
            },
          ],
          solution: [{ say: "sin 2θ = sin(θ + θ) = 2 sin θ cos θ." }],
        });
    }
  },

  verify(p, question) {
    const e = EXACT[p.e] ?? (EXACT[0] as (typeof EXACT)[number]);
    if (question.key.depth === 1) return chosenText(question).includes(e.value);
    if (question.key.depth === 2)
      return (
        numberAnswer(question) === (TRIPLES[p.t] ?? (TRIPLES[0] as (typeof TRIPLES)[number]))[2]
      );
    return true;
  },
});
