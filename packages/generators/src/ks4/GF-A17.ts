/**
 * @statement GF-A17
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A17: Solve linear equations in one unknown algebraically, including those with the unknown on
// both sides of the equation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  c: number;
  x: number;
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GF-A17",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.WRONG-INVERSE", "ALG.EXPAND.FIRST-ONLY"],

  params(rng, numbers) {
    const a = rng.int(3, 9);
    const c = rng.int(1, a - 1);
    const x = rng.int(numbers === "friendly" ? 1 : -6, 9);
    const b = rng.int(-12, 12);
    if (x === 0 || b === 0) reject("non-zero numbers");
    return { a, c, x, b, k: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    // ax + b = cx + d
    const d = (p.a - p.c) * p.x + p.b;
    switch (depth) {
      case 1: {
        const slip = (d + p.b) / (p.a - p.c);
        return A.standard({
          question: ["Solve ", A.math(`${poly([p.a, p.b])} = ${poly([p.c, d])}`), "."],
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(Math.round(slip * 100) / 100),
              feedback: `Subtract ${p.b} from both sides; do not add it.`,
            },
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(Math.round(((d - p.b) / (p.a + p.c)) * 100) / 100),
              feedback: `Subtract ${p.c}x from both sides to collect the x terms.`,
            },
          ]),
          solution: [{ say: "", math: `${p.a - p.c}x = ${d - p.b} \\Rightarrow x = ${p.x}` }],
        });
      }
      case 2: {
        // k(x + b) = rhs
        const rhs = p.k * (p.x + p.b);
        return A.standard({
          question: [
            "Solve ",
            A.math(`${p.k}(x ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}) = ${rhs}`),
            ".",
          ],
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            {
              code: "ALG.EXPAND.FIRST-ONLY",
              value: A.number(Math.round(((rhs - p.b) / p.k) * 100) / 100),
              feedback: `Multiply both terms by ${p.k}, or divide both sides by ${p.k} first.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `x ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)} = ${rhs / p.k} \\Rightarrow x = ${p.x}`,
            },
          ],
        });
      }
      default: {
        const shown = p.x + 1;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Zoe says ",
            A.math(`x = ${shown}`),
            " is the solution of ",
            A.math(`${poly([p.a, p.b])} = ${poly([p.c, d])}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Substituting x = ${shown}: left side ${p.a * shown + p.b}, right side ${p.c * shown + d}. They are not equal. The solution is x = ${p.x}.`,
              correct: true,
            },
            { text: "True. Any value close to the answer works.", code: "ALG.SOLVE.WRONG-INVERSE" },
            { text: "True. You cannot check a solution." },
          ],
          solution: [{ say: "Check a solution by substituting it into both sides." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.x;
    return true;
  },
});
