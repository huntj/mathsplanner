/**
 * @statement GH-A7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-A7: Interpret inverse and composite functions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { signedWrongs } from "../shared/alg.ts";

interface Params {
  /** f(x) = ax + b and g(x) = x². */
  a: number;
  b: number;
  x: number;
  /** Depth 4: f(x) = x + s, g(x) = kx. */
  s: number;
  k: number;
}

const f = (p: Params) => poly([p.a, p.b]);

export default defineGenerator<Params>({
  id: "GH-A7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FUNCTION.ORDER", "ALG.INVERSE.RECIPROCAL"],

  params(rng) {
    const a = rng.int(2, 6);
    const b = rng.int(-9, 9);
    const x = rng.int(-4, 5);
    if (b === 0 || x === 0 || a * x * x + b === (a * x + b) ** 2)
      reject("a composite whose order matters");
    return { a, b, x, s: rng.int(2, 9), k: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    const defs = ["Given ", A.math(`f(x) = ${f(p)}`), " and ", A.math("g(x) = x^2"), "."];
    switch (depth) {
      case 1: {
        const fg = p.a * p.x * p.x + p.b;
        const gf = (p.a * p.x + p.b) ** 2;
        return A.standard({
          question: defs,
          ask: ["Work out ", A.math(`fg(${p.x})`), "."],
          answer: A.number(fg),
          wrong: signedWrongs(fg, [
            {
              code: "ALG.FUNCTION.ORDER",
              value: A.number(gf),
              feedback: `fg(x) means f(g(x)): apply g first, so square ${p.x} first.`,
            },
          ]),
          solution: [
            {
              say: `g(${p.x}) = ${p.x * p.x}, then f(${p.x * p.x}) = ${p.a} × ${p.x * p.x} ${p.b < 0 ? "−" : "+"} ${Math.abs(p.b)} = ${fg}.`,
            },
          ],
        });
      }
      case 2: {
        const inverse = `\\frac{${poly([1, -p.b])}}{${p.a}}`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Given ", A.math(`f(x) = ${f(p)}`), "."],
              ask: ["Find ", A.math("f^{-1}(x)"), "."],
            },
            {
              question: ["The function f is given by ", A.math(`f(x) = ${f(p)}`), "."],
              ask: "Find an expression for the inverse function.",
            },
          ],
          answer: A.exact(inverse),
          wrong: [
            {
              code: "ALG.INVERSE.RECIPROCAL",
              value: A.exact(`\\frac{1}{${f(p)}}`),
              feedback: "The inverse undoes the function; it is not 1 over the function.",
            },
            {
              code: "ALG.FUNCTION.ORDER",
              value: A.exact(`\\frac{x}{${p.a}} ${p.b < 0 ? "+" : "-"} ${Math.abs(p.b)}`),
              feedback: `Undo the steps in reverse order: ${p.b < 0 ? "add" : "subtract"} ${Math.abs(p.b)} first, then divide by ${p.a}.`,
            },
          ],
          solution: [
            {
              say: "Let y = f(x) and rearrange for x: ",
              math: `y = ${poly([p.a, p.b])} \\Rightarrow x = \\frac{${poly([1, -p.b], "y")}}{${p.a}}`,
            },
            { say: "So ", math: `f^{-1}(x) = ${inverse}` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Given ",
            A.math(`f(x) = x + ${p.s}`),
            " and ",
            A.math(`g(x) = ${p.k}x`),
            ", Ana says fg(x) and gf(x) are the same function.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. fg(x) = ${p.k}x + ${p.s}, but gf(x) = ${p.k}(x + ${p.s}) = ${p.k}x + ${p.k * p.s}.`,
              correct: true,
            },
            {
              text: "True. The same two functions are used, so the order does not matter.",
              code: "ALG.FUNCTION.ORDER",
            },
            { text: "True. Both are straight lines." },
          ],
          solution: [
            {
              say: "In fg(x), g is applied first; in gf(x), f is applied first. The order usually changes the result.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a * p.x * p.x + p.b;
    return true;
  },
});
