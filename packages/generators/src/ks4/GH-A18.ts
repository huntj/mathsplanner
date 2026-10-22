/**
 * @statement GH-A18
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A18: Solve quadratics needing rearrangement, by completing the square and by the quadratic
// formula
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, Surd, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1 and 5: ax² + bx + c = 0 with a non-square discriminant. */
  a: number;
  b: number;
  c: number;
  /** Depth 2: x² + 2hx + k = 0, solved as −h ± √(h² − k). */
  h: number;
  k: number;
  /** Depth 4: x² = mx. */
  m: number;
}

const r2 = (x: number) => (Math.round(x * 100) / 100).toFixed(2);
const roots = (a: number, b: number, c: number) => {
  const d = Math.sqrt(b * b - 4 * a * c);
  return [(-b - d) / (2 * a), (-b + d) / (2 * a)] as const;
};
const pair = ([x1, x2]: readonly [number, number]) => `x = ${r2(x1)} \\text{ or } x = ${r2(x2)}`;
const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

export default defineGenerator<Params>({
  id: "GH-A18",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: [
    "ALG.QUADRATIC.FORMULA",
    "ALG.QUADRATIC.ROOT-SIGN",
    "ALG.COMPLETE-SQUARE.HALF",
    "ALG.QUADRATIC.ONE-ROOT",
  ],

  params(rng) {
    const a = rng.int(1, 3);
    const b = rng.int(-9, 9);
    const c = rng.int(-9, 9);
    const d = b * b - 4 * a * c;
    if (b === 0 || c === 0 || d <= 0 || isSquare(d)) reject("two irrational roots");
    const h = rng.int(-5, 5);
    const k = rng.int(-9, 9);
    const e = h * h - k;
    if (h === 0 || e <= 1 || isSquare(e) || Surd.term(1, e).terms.has(1n))
      reject("a surd that does not simplify to a whole number");
    return { a, b, c, h, k, m: rng.int(2, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    const eq = `${poly([p.a, p.b, p.c])} = 0`;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Solve ", A.math(eq), ". Give your solutions to 2 decimal places."],
          correct: A.math(pair(roots(p.a, p.b, p.c))),
          distractors: [
            {
              content: A.math(pair(roots(p.a, -p.b, p.c))),
              code: "ALG.QUADRATIC.FORMULA",
              feedback: `The formula starts with −b, and here b = ${p.b}.`,
            },
            {
              content: A.math(
                pair([
                  -p.b - Math.sqrt(p.b * p.b - 4 * p.a * p.c) / (2 * p.a),
                  -p.b + Math.sqrt(p.b * p.b - 4 * p.a * p.c) / (2 * p.a),
                ]),
              ),
              code: "ALG.QUADRATIC.FORMULA",
              feedback: "Divide the whole of −b ± √(b² − 4ac) by 2a, not just the square root.",
            },
          ],
          solution: [
            {
              say: "Use the quadratic formula with ",
              math: `a = ${p.a},\\ b = ${p.b},\\ c = ${p.c}`,
            },
            {
              say: "",
              math: `x = \\frac{${-p.b} \\pm \\sqrt{${p.b * p.b - 4 * p.a * p.c}}}{${2 * p.a}}`,
            },
          ],
        });
      case 2: {
        const e = p.h * p.h - p.k;
        const s = toLatex(Surd.term(1, e));
        const added = p.h * p.h + p.k;
        const sAdd = added > 0 ? toLatex(Surd.term(1, added)) : "";
        const options = (centre: number, root: string) => `x = ${centre} \\pm ${root}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "By completing the square, solve ",
            A.math(`${poly([1, 2 * p.h, p.k])} = 0`),
            ". Give your answers in surd form.",
          ],
          correct: A.math(options(-p.h, s)),
          distractors: [
            {
              content: A.math(options(p.h, s)),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: `(x ${p.h < 0 ? "−" : "+"} ${Math.abs(p.h)})² = ${e} gives x = ${-p.h} ± √${e}.`,
            },
            ...(p.h * p.h + p.k > 0 && p.h * p.h + p.k !== e && !isSquare(p.h * p.h + p.k)
              ? [
                  {
                    content: A.math(options(-p.h, sAdd)),
                    code: "ALG.COMPLETE-SQUARE.HALF",
                    feedback: `(x ${p.h < 0 ? "−" : "+"} ${Math.abs(p.h)})² = ${e}: subtract ${p.h * p.h}, do not add it.`,
                  },
                ]
              : []),
            {
              content: A.math(options(-2 * p.h, s)),
              code: "ALG.COMPLETE-SQUARE.HALF",
              feedback: `Halve the x coefficient: ${2 * p.h} ÷ 2 = ${p.h}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `(x ${p.h < 0 ? "-" : "+"} ${Math.abs(p.h)})^2 ${p.k - p.h * p.h < 0 ? "-" : "+"} ${Math.abs(p.k - p.h * p.h)} = 0`,
            },
            {
              say: "",
              math: `x = ${-p.h} \\pm \\sqrt{${e}}${s === `\\sqrt{${e}}` ? "" : ` = ${-p.h} \\pm ${s}`}`,
            },
          ],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Tom solves ",
            A.math(`x^2 = ${p.m}x`),
            " by dividing both sides by x. He says the only solution is ",
            A.math(`x = ${p.m}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Dividing by x loses the solution x = 0. Rearrange: x² − ${p.m}x = 0, so x(x − ${p.m}) = 0 and x = 0 or x = ${p.m}.`,
              correct: true,
            },
            {
              text: "True. A quadratic only has one solution here.",
              code: "ALG.QUADRATIC.ONE-ROOT",
            },
            { text: "True. You can always divide both sides by x." },
          ],
          solution: [{ say: "Rearrange to = 0 and factorise instead of dividing by x." }],
        });
      default: {
        const q = -p.c;
        const disc = p.b * p.b - 4 * p.a * p.c;
        const big = Number(r2(roots(p.a, p.b, p.c)[1]));
        return A.multiStepContext({
          context: [
            "This question is about the equation ",
            A.math(`${p.a === 1 ? "" : p.a}x^2 ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}x = ${q}`),
            ".",
          ],
          parts: [
            {
              ask: "Rearrange to the form ax² + bx + c = 0 and work out the value of b² − 4ac.",
              answer: A.number(disc),
              wrong: [
                {
                  code: "ALG.QUADRATIC.FORMULA",
                  value: A.number(p.b * p.b + 4 * p.a * p.c),
                  feedback: `With everything on one side, c = ${p.c}, so −4ac = ${-4 * p.a * p.c}.`,
                },
              ],
            },
            {
              ask: "Work out the larger solution, to 2 decimal places.",
              answer: A.number(big, { accuracy: { dp: 2 } }),
              wrong: [
                {
                  code: "ALG.QUADRATIC.FORMULA",
                  value: A.number(Number(r2(roots(p.a, -p.b, p.c)[1])), { accuracy: { dp: 2 } }),
                  feedback: "The formula starts with −b.",
                },
              ],
            },
          ],
          solution: [
            { say: "", math: eq },
            {
              say: "",
              math: `b^2 - 4ac = ${p.b * p.b} - ${4 * p.a * p.c < 0 ? `(${4 * p.a * p.c})` : 4 * p.a * p.c} = ${disc}`,
            },
            {
              say: "",
              math: `x = \\frac{${-p.b} + \\sqrt{${disc}}}{${2 * p.a}} = ${r2(roots(p.a, p.b, p.c)[1])}`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).includes(pair(roots(p.a, p.b, p.c)));
    if (question.key.depth === 5) return numberAnswer(question) === p.b * p.b - 4 * p.a * p.c;
    return true;
  },
});
