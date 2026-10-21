/**
 * @statement Y8-ALG-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-ALG-01: Simplify and manipulate algebraic expressions to maintain equivalence by expanding
// products of two or more binomials
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly } from "../shared/alg.ts";

interface Params {
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng, numbers) {
    const sign = () => (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    const a = rng.int(1, 9) * sign();
    const b = rng.int(1, 9) * sign();
    if (a + b === 0 || a === b) reject("a middle term, and different brackets");
    return { a, b };
  },

  build(p, depth, rng): QuestionDraft {
    const expr = `${bracket(p.a)}${bracket(p.b)}`;
    const answer = poly([1, p.a + p.b, p.a * p.b]);
    const slip = poly([1, 0, p.a * p.b]);
    const wrong = [
      {
        code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
        value: A.exact(slip),
        feedback: `Multiply every term in the first bracket by every term in the second: there are four products, including ${p.a}x and ${p.b}x.`,
      },
    ];
    const how = `x × x = x², x × ${p.b} = ${p.b}x, ${p.a} × x = ${p.a}x and ${p.a} × ${p.b} = ${p.a * p.b}. Collect the x terms: ${p.a + p.b}x.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Expand and simplify ", A.math(expr), "."],
          answer: A.exact(answer, "expanded"),
          wrong,
          solution: [{ say: how, math: `${expr} = ${answer}` }],
        });
      case 2: {
        // Lengths must be positive, so this depth uses x + |a| and x + |b| throughout.
        const [m, n] = [Math.abs(p.a), Math.abs(p.b)];
        const area = poly([1, m + n, m * n]);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A rectangle has length ",
                A.math(bracket(m)),
                " and width ",
                A.math(bracket(n)),
                ".",
              ],
              ask: "Write an expanded expression for its area.",
            },
            { question: ["Write ", A.math(`${bracket(m)}${bracket(n)}`), " without brackets."] },
          ],
          answer: A.exact(area, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.exact(poly([1, 0, m * n])),
              feedback: "There are four products to add: x², two x terms and a number.",
            },
          ],
          solution: [
            {
              say: `x × x = x², x × ${n} = ${n}x, ${m} × x = ${m}x and ${m} × ${n} = ${m * n}, so the area is ${area.replace(/\^2/, "²")}.`,
            },
          ],
        });
      }
      default:
        return A.spotTheMistake({
          question: ["Mia expands ", A.math(expr), "."],
          lines: [
            [
              A.math(
                `= x \\times x + ${p.a < 0 ? `(${p.a})` : p.a} \\times ${p.b < 0 ? `(${p.b})` : p.b}`,
              ),
            ],
            [A.math(`= ${slip}`)],
          ],
          mistake: 0,
          code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
          feedback: `Line 1 multiplies only the first terms and the last terms. ${how} So the answer is ${answer}.`,
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type !== "exact") return question.archetype === "spot-the-mistake";
    const [m, n] =
      question.archetype === "varied-form" ? [Math.abs(p.a), Math.abs(p.b)] : [p.a, p.b];
    return a.value === poly([1, m + n, m * n]);
  },
});
