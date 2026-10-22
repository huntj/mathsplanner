/**
 * @statement AL-P2.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.3: Work with quadratic functions and graphs: discriminant, completing the square, solving
// quadratics including in a function of the unknown
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  /** Depth 2: x² + kx + m² = 0. */
  m: number;
  /** Depth 4: x⁴ − (p² + q²)x² + p²q² = 0. */
  p: number;
  q: number;
}

export default defineGenerator<Params>({
  id: "AL-P2.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "ALG.QUADRATIC.FORMULA",
    "ALG.INEQUALITY.QUADRATIC-REGION",
    "ALG.QUADRATIC.ONE-ROOT",
  ],

  params(rng) {
    const a = rng.int(1, 4);
    const b = rng.int(-9, 9);
    const c = rng.int(-9, 9);
    const p = rng.int(1, 4);
    const q = rng.int(2, 5);
    if (b === 0 || c === 0 || p === q) reject("non-zero terms and different roots");
    return { a, b, c, m: rng.int(2, 6), p, q };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const d = p.b * p.b - 4 * p.a * p.c;
        return A.standard({
          question: ["For the quadratic ", A.math(`${poly([p.a, p.b, p.c])} = 0`), ":"],
          ask: "Work out the value of the discriminant.",
          answer: A.number(d),
          wrong: [
            {
              code: "ALG.QUADRATIC.FORMULA",
              value: A.number(p.b * p.b + 4 * p.a * p.c),
              feedback: `The discriminant is b² − 4ac, and c = ${p.c}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `b^2 - 4ac = ${p.b}^2 - 4 \\times ${p.a} \\times ${p.c < 0 ? `(${p.c})` : p.c} = ${d}`,
            },
            {
              say:
                d > 0
                  ? "It is positive, so there are two distinct real roots."
                  : d === 0
                    ? "It is zero, so there is one repeated root."
                    : "It is negative, so there are no real roots.",
            },
          ],
        });
      }
      case 2: {
        const t = 2 * p.m;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The equation ",
            A.math(`x^2 + kx + ${p.m * p.m} = 0`),
            " has two distinct real roots.",
          ],
          ask: "Find the possible values of k.",
          correct: A.math(`k < -${t} \\text{ or } k > ${t}`),
          distractors: [
            {
              content: A.math(`-${t} < k < ${t}`),
              code: "ALG.INEQUALITY.QUADRATIC-REGION",
              feedback: `k² − ${t * t} > 0 holds outside the roots ±${t}.`,
            },
            {
              content: A.math(`k > ${t}`),
              code: "ALG.QUADRATIC.ONE-ROOT",
              feedback: `k² > ${t * t} also when k < −${t}.`,
            },
            {
              content: A.math(`k > ${t * t}`),
              code: "ALG.QUADRATIC.FORMULA",
              feedback: `Two distinct roots need b² − 4ac > 0: k² − ${t * t} > 0.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `k^2 - 4 \\times ${p.m * p.m} > 0 \\Rightarrow k^2 > ${t * t} \\Rightarrow k < -${t} \\text{ or } k > ${t}`,
            },
          ],
        });
      }
      default: {
        const [P, Q] = [p.p * p.p, p.q * p.q];
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Zara solves ",
            A.math(`x^4 - ${P + Q}x^2 + ${P * Q} = 0`),
            " by writing it as a quadratic in ",
            A.math("x^2"),
            `. She says the only solutions are x = ${p.p} and x = ${p.q}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. x² = ${P} or x² = ${Q}, so x = ±${p.p} or x = ±${p.q}: four solutions.`,
              correct: true,
            },
            { text: "True. Square roots are always positive.", code: "ALG.QUADRATIC.ONE-ROOT" },
            { text: `False. The solutions are x = ${P} and x = ${Q}.` },
          ],
          solution: [
            {
              say: "",
              math: `(x^2 - ${P})(x^2 - ${Q}) = 0 \\Rightarrow x = \\pm ${p.p},\\ \\pm ${p.q}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.b * p.b - 4 * p.a * p.c;
    if (question.key.depth === 2) return chosenText(question).includes(`k < -${2 * p.m}`);
    return true;
  },
});
