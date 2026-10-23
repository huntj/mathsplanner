/**
 * @statement GH-A15.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A15.a: Estimate gradients of non-linear graphs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { clearOfOrigin, grid, poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  /** The curve is y = x² + k, lifted clear of the origin label. */
  k: number;
  p: number;
  q: number;
}

export default defineGenerator<Params>({
  id: "GH-A15.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.RATE.AVERAGE-INSTANT"],

  params(rng) {
    const p = { a: rng.int(1, 2) * rng.pick([1, -1]), k: rng.int(1, 4), p: rng.int(-3, 1), q: 0 };
    if (p.a * p.a + p.k > 6 || !clearOfOrigin(2 * p.a, p.k - p.a * p.a))
      reject("a tangent that fits and keeps clear of the origin");
    p.q = p.p + rng.int(2, 4);
    if (p.p === 0 || p.q === 0 || p.p + p.q === 0) reject("a chord with a non-zero gradient");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const m = 2 * p.a;
        const y = p.a * p.a + p.k;
        return A.standard({
          question: [
            "The graph shows ",
            A.math(`y = ${poly([1, 0, p.k])}`),
            " and the tangent to the curve at ",
            A.math(`(${p.a}, ${y})`),
            ".",
            A.figure(
              grid(
                6,
                [poly([1, 0, p.k]), poly([m, p.k - p.a * p.a])],
                [{ at: [p.a, y] }],
                "A U-shaped curve with a straight line touching it at one point.",
              ),
            ),
          ],
          ask: "Estimate the gradient of the curve at that point.",
          answer: A.number(m, { accuracy: { tolerance: 0.5 } }),
          wrong: signedWrongs(m, [
            {
              code: "RAT.RATE.AVERAGE-INSTANT",
              value: A.number(y, { accuracy: { tolerance: 0.5 } }),
              feedback:
                "The gradient is the tangent's rise over run, not the y-coordinate of the point.",
            },
          ]),
          solution: [
            { say: `The tangent rises ${m} for each 1 across, so the gradient is about ${m}.` },
          ],
        });
      }
      case 2: {
        const v = p.p + p.q;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the average rate of change of ",
                A.math("y = x^2"),
                " between ",
                A.math(`x = ${p.p}`),
                " and ",
                A.math(`x = ${p.q}`),
                ".",
              ],
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "RAT.RATE.AVERAGE-INSTANT",
              value: A.number(p.q * p.q - p.p * p.p),
              feedback: `That is the change in y. Divide by the change in x, ${p.q - p.p}: the gradient of the chord.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\frac{${p.q}^2 - (${p.p})^2}{${p.q} - (${p.p})} = \\frac{${p.q * p.q - p.p * p.p}}{${p.q - p.p}} = ${v}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jas says a curve like ",
            A.math("y = x^2"),
            " has the same gradient everywhere, like a straight line.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The curve gets steeper as x moves away from 0, so the gradient changes from point to point. It is found from a tangent at each point.",
              correct: true,
            },
            { text: "True. Every graph has one gradient.", code: "RAT.RATE.AVERAGE-INSTANT" },
            {
              text: "True. The gradient is the average over the whole curve.",
              code: "RAT.RATE.AVERAGE-INSTANT",
            },
          ],
          solution: [{ say: "Compare tangents at x = 1 (gradient 2) and x = 3 (gradient 6)." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 2 * p.a;
    if (question.key.depth === 2) return numberAnswer(question) === p.p + p.q;
    return true;
  },
});
