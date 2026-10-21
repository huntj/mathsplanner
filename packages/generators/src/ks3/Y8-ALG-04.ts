/**
 * @statement Y8-ALG-04
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-ALG-04: Use algebraic methods to solve linear equations in one variable, including all forms that
// require rearrangement
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { poly, signed } from "../shared/alg.ts";

interface Params {
  /** a(x + b) = cx + d with solution x. */
  a: number;
  b: number;
  c: number;
  x: number;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-04",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.WRONG-INVERSE", "ALG.EXPAND.FIRST-ONLY"],

  params(rng, numbers) {
    const a = rng.int(2, 7);
    const c = rng.int(1, 9);
    const b = rng.int(1, 9) * (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    const x = rng.int(numbers === "stretch" ? -9 : 1, 12);
    if (a === c || x === 0 || a * b === 0) reject("unknowns on both sides");
    return { a, b, c, x };
  },

  build(p, depth, rng): QuestionDraft {
    const d = p.a * (p.x + p.b) - p.c * p.x;
    const left = `${p.a}(x ${signed(p.b)})`;
    const right = `${p.c === 1 ? "" : p.c}x ${signed(d)}`;
    const eq = `${left} = ${right}`;
    const k = p.a - p.c;
    const how = `Expand: ${p.a}x ${signed(p.a * p.b)} = ${right}. Subtract ${p.c}x from both sides: ${poly([k, 0])} ${signed(p.a * p.b)} = ${d}. ${p.a * p.b < 0 ? "Add" : "Subtract"} ${Math.abs(p.a * p.b)}: ${poly([k, 0])} = ${d - p.a * p.b}. Divide by ${k}: x = ${p.x}.`;
    // Expanding only the first term: ax + b = cx + d.
    const firstOnly = (d - p.b) / k;
    const wrong = wrongs(p.x, [
      Number.isInteger(firstOnly)
        ? {
            code: "ALG.EXPAND.FIRST-ONLY",
            value: A.number(firstOnly),
            feedback: `Multiply both terms in the bracket by ${p.a}: ${p.a}x ${signed(p.a * p.b)}.`,
          }
        : undefined,
    ]);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Solve ", A.math(eq), "."],
          answer: A.number(p.x),
          wrong,
          solution: [{ say: how }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            { question: ["Find x if ", A.math(eq), "."] },
            {
              question: [
                `${p.a} lots of a number plus ${p.b < 0 ? `(${p.b})` : p.b} is the same as ${p.c} lots of the number ${d < 0 ? "minus" : "plus"} ${Math.abs(d)}.`,
              ],
              ask: "What is the number?",
            },
          ],
          answer: A.number(p.x),
          wrong,
          solution: [{ say: how }],
        });
      default: {
        // The slip: only the x in the bracket is multiplied by a.
        const slipped = toLatex(frac(d - p.b, k));
        return A.spotTheMistake({
          question: ["Kim solves ", A.math(eq), "."],
          lines: [
            [A.math(`${p.a}x ${signed(p.b)} = ${right}`)],
            [A.math(`${poly([k, 0])} = ${d - p.b}`)],
            [A.math(`x = ${slipped}`)],
          ],
          mistake: 0,
          code: "ALG.EXPAND.FIRST-ONLY",
          feedback: `Line 1 multiplies only the x by ${p.a}. Both terms in the bracket are multiplied: ${p.a}x ${signed(p.a * p.b)}. ${how}`,
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "spot-the-mistake") return true;
    return numberAnswer(question) === p.x;
  },
});
