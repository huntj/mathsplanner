/**
 * @statement FM-FP1-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP1-03: Solve inequalities involving rational functions and modulus
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

interface Params {
  p: number;
  q: number;
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "FM-FP1-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INEQUALITY.MULTIPLY", "ALG.INEQUALITY.FLIP"],

  params(rng) {
    const p = { p: rng.int(-6, 6), q: rng.int(-6, 6), a: rng.int(-6, 8), b: rng.int(-6, 8) };
    if (p.p === 0 || -p.p >= p.q || p.q === 0) reject("−p < q, both non-zero");
    if (p.a === p.b || (p.a + p.b) % 2 !== 0) reject("a whole-number midpoint");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = `${-p.p} < x < ${p.q}`;
        return A.choice({
          rng,
          question: [
            "Solve ",
            A.math(
              `\\frac{${bracket(p.p).replace(/^\(|\)$/g, "")}}{${bracket(-p.q).replace(/^\(|\)$/g, "")}} < 0`,
            ),
            ".",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`x < ${-p.p}`),
              code: "ALG.INEQUALITY.MULTIPLY",
              feedback: `Multiplying by x ${p.q < 0 ? "+" : "−"} ${Math.abs(p.q)} assumes it is positive. Look at the signs of the top and bottom instead.`,
            },
            {
              content: A.math(`x < ${-p.p} \\text{ or } x > ${p.q}`),
              code: "ALG.INEQUALITY.FLIP",
              feedback:
                "The fraction is negative when the top and bottom have opposite signs: between the critical values.",
            },
          ],
          solution: [
            {
              say: `The critical values are ${-p.p} and ${p.q}. The fraction is negative between them: `,
              math: right,
            },
          ],
        });
      }
      case 2: {
        const m = (p.a + p.b) / 2;
        const right = p.b > p.a ? `x > ${m}` : `x < ${m}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Solve ",
            A.math(
              `|${bracket(-p.a).replace(/^\(|\)$/g, "")}| > |${bracket(-p.b).replace(/^\(|\)$/g, "")}|`,
            ),
            ".",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(p.b > p.a ? `x < ${m}` : `x > ${m}`),
              code: "ALG.INEQUALITY.FLIP",
              feedback: `x must be further from ${p.a} than from ${p.b}, so on ${p.b}'s side of the midpoint ${m}.`,
            },
            {
              content: A.math(`x > ${Math.max(p.a, p.b)}`),
              code: "ALG.INEQUALITY.MULTIPLY",
              feedback: `Square both sides (both are non-negative): the boundary is the midpoint, ${m}.`,
            },
          ],
          solution: [
            {
              say: `Squaring both sides: ${2 * (p.b - p.a)}x > ${p.b * p.b - p.a * p.a}, so `,
              math: right,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Cy solves ",
            A.math(`\\frac{3}{x - 1} > 2`),
            " by multiplying both sides by ",
            A.math("x - 1"),
            " to get ",
            A.math("3 > 2x - 2"),
            ", so ",
            A.math("x < 2.5"),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: "False. x − 1 is negative when x < 1, which would flip the inequality. Multiplying by (x − 1)² instead gives 1 < x < 2.5.",
              correct: true,
            },
            {
              text: "True. You can multiply both sides of an inequality by anything.",
              code: "ALG.INEQUALITY.MULTIPLY",
            },
            { text: "True. x = 0 gives 3/(−1) = −3 > 2.", code: "ALG.INEQUALITY.MULTIPLY" },
          ],
          solution: [
            {
              say: "Check x = 0: 3/(0 − 1) = −3, which is not greater than 2, so x < 2.5 is wrong.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `${-p.p} < x < ${p.q}`;
    if (question.key.depth === 2)
      return (
        chosenText(question) === (p.b > p.a ? `x > ${(p.a + p.b) / 2}` : `x < ${(p.a + p.b) / 2}`)
      );
    return true;
  },
});
