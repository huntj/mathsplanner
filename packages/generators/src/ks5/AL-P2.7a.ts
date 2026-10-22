/**
 * @statement AL-P2.7a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P2.7a: Sketch curves including polynomials, y = a/x and y = a/x²; use asymptotes and
// intersection points; represent proportion graphically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  r1: number;
  r2: number;
  r3: number;
  /** Depth 2: y = a/(x − h) + k. */
  a: number;
  h: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "AL-P2.7a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.QUADRATIC.ROOT-SIGN", "ALG.TRANSFORM.DIRECTION", "ALG.GRAPH.SHAPE"],

  params(rng) {
    const p = {
      r1: rng.int(-5, 5),
      r2: rng.int(-5, 5),
      r3: rng.int(-5, 5),
      a: rng.int(1, 6),
      h: rng.int(-5, 5),
      k: rng.int(-5, 5),
    };
    if (new Set([p.r1, p.r2, p.r3]).size < 3 || [p.r1, p.r2, p.r3].includes(0))
      reject("three different non-zero roots");
    if (p.h === 0 || p.k === 0 || p.h === p.k || p.h === -p.k)
      reject("asymptotes away from the axes");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const curve = `y = ${bracket(-p.r1)}${bracket(-p.r2)}${bracket(-p.r3)}`;
    switch (depth) {
      case 1: {
        const y0 = -p.r1 * p.r2 * p.r3;
        return A.standard({
          question: ["The curve ", A.math(curve), " is sketched."],
          ask: "Where does it cross the y-axis? Give the y-coordinate.",
          answer: A.number(y0),
          wrong: signedWrongs(y0, [
            {
              code: "ALG.QUADRATIC.ROOT-SIGN",
              value: A.number(-y0),
              feedback: "Substitute x = 0 into each bracket, keeping its sign.",
            },
          ]),
          solution: [
            {
              say: `x = 0: ${bracket(-p.r1).replace("x", "0")} × ${bracket(-p.r2).replace("x", "0")} × ${bracket(-p.r3).replace("x", "0")} = ${y0}.`,
            },
          ],
        });
      }
      case 2: {
        const eq = `y = \\frac{${p.a}}{${bracket(-p.h).replace(/[()]/g, "")}} ${p.k < 0 ? "-" : "+"} ${Math.abs(p.k)}`;
        const pair = (v: number, h: number) => A.math(`x = ${v},\\ y = ${h}`);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["The curve ", A.math(eq), " has two asymptotes."],
          ask: "What are their equations?",
          correct: pair(p.h, p.k),
          distractors: [
            {
              content: pair(-p.h, p.k),
              code: "ALG.TRANSFORM.DIRECTION",
              feedback: `The curve is undefined when x − ${p.h} = 0, i.e. x = ${p.h}.`,
            },
            {
              content: pair(p.k, p.h),
              code: "ALG.TRANSFORM.DIRECTION",
              feedback:
                "The vertical asymptote comes from the denominator; the horizontal one from the constant added.",
            },
            {
              content: pair(0, 0),
              code: "ALG.GRAPH.SHAPE",
              feedback: `y = ${p.a}/x has asymptotes x = 0 and y = 0, but this curve is translated.`,
            },
          ],
          solution: [
            {
              say: `It is y = ${p.a}/x translated by (${p.h}, ${p.k}), so the asymptotes are x = ${p.h} and y = ${p.k}.`,
            },
          ],
        });
      }
      default: {
        const q = Math.abs(p.r3) === Math.abs(p.r1) ? p.r3 + 1 : p.r3;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Noor says the curve ",
            A.math(`y = ${bracket(-p.r1)}^2${bracket(-q)}`),
            ` crosses the x-axis at x = ${p.r1}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. (x ${p.r1 < 0 ? "+" : "−"} ${Math.abs(p.r1)}) is squared, so the curve touches the x-axis at x = ${p.r1} and turns back without crossing.`,
              correct: true,
            },
            { text: "True. Every root is a crossing point.", code: "ALG.GRAPH.SHAPE" },
            { text: `False. It crosses at x = ${-p.r1}.`, code: "ALG.QUADRATIC.ROOT-SIGN" },
          ],
          solution: [
            {
              say: "A repeated root gives a point where the curve touches the axis; a single root gives a crossing.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === -p.r1 * p.r2 * p.r3;
    if (question.key.depth === 2) return chosenText(question).includes(`x = ${p.h},\\ y = ${p.k}`);
    return true;
  },
});
