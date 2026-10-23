/**
 * @statement AL-P2.3.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P2.3.b: Complete the square
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, poly, signed } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** x² + 2hx + c = (x + h)² + (c − h²). */
  h: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "AL-P2.3.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.COMPLETE-SQUARE.HALF", "ALG.QUADRATIC.TURNING"],

  params(rng, numbers) {
    const h = rng.int(-6, 6);
    const c = rng.int(-12, 15);
    if (h === 0 || c === h * h || (numbers === "friendly" && h < 0)) reject("a square to complete");
    return { h, c };
  },

  build(p, depth, rng): QuestionDraft {
    const q = poly([1, 2 * p.h, p.c]);
    const k = p.c - p.h * p.h;
    const form = (h: number, kk: number) => `${bracket(h)}^2 ${signed(kk)}`;
    const right = form(p.h, k);
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Write ", A.math(q), " in the form ", A.math("(x + p)^2 + q"), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(form(2 * p.h, p.c - 4 * p.h * p.h)),
              code: "ALG.COMPLETE-SQUARE.HALF",
              feedback: `Halve the coefficient of x: ${2 * p.h} ÷ 2 = ${p.h}.`,
            },
            {
              content: A.math(form(p.h, p.c)),
              code: "ALG.COMPLETE-SQUARE.HALF",
              feedback: `${bracket(p.h)}² gives an extra ${p.h * p.h}, so take it away: ${p.c} − ${p.h * p.h} = ${k}.`,
            },
            {
              content: A.math(form(p.h, p.c + p.h * p.h)),
              code: "ALG.COMPLETE-SQUARE.HALF",
              feedback: `Subtract the ${p.h * p.h}, do not add it.`,
            },
          ],
          solution: [
            { say: "", math: `${q} = ${bracket(p.h)}^2 - ${p.h * p.h} ${signed(p.c)} = ${right}` },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The curve ",
            A.math(`y = ${q}`),
            " can be written as ",
            A.math(`y = ${right}`),
            ".",
          ],
          ask: "What are the coordinates of its turning point?",
          correct: `(${-p.h}, ${k})`,
          distractors: [
            {
              content: `(${p.h}, ${k})`,
              code: "ALG.QUADRATIC.TURNING",
              feedback: `The square is zero when x = ${-p.h}, not ${p.h}.`,
            },
            {
              content: `(${-p.h}, ${p.c})`,
              code: "ALG.QUADRATIC.TURNING",
              feedback: `${p.c} is the y-intercept. The minimum value is ${k}.`,
            },
          ],
          solution: [
            {
              say: `${bracket(p.h)}² is smallest, 0, when x = ${-p.h}, so the minimum point is (${-p.h}, ${k}).`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Mo says ", A.math(`${q} = ${form(2 * p.h, p.c)}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. Halve the x coefficient and subtract its square: ${right}.`,
              correct: true,
            },
            {
              text: "True. The number in the bracket is the coefficient of x.",
              code: "ALG.COMPLETE-SQUARE.HALF",
            },
            {
              text: "True. The constant term never changes when you complete the square.",
              code: "ALG.COMPLETE-SQUARE.HALF",
            },
          ],
          solution: [
            {
              say: "",
              math: `${bracket(2 * p.h)}^2 = ${poly([1, 4 * p.h, 4 * p.h * p.h])} \\neq ${poly([1, 2 * p.h, p.h * p.h])}`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return chosenText(question) === `(${-p.h}, ${p.c - p.h * p.h})`;
    return true;
  },
});
