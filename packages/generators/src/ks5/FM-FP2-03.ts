/**
 * @statement FM-FP2-03
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-FP2-03: Work with further complex loci and transformations of the complex plane
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText, exactAnswer } from "../shared/counting.ts";
import { cx } from "../shared/cplx.ts";

interface Params {
  a: number;
  b: number;
  r: number;
}

export default defineGenerator<Params>({
  id: "FM-FP2-03",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CPLX.ARITHMETIC", "CPLX.TRANSFORM"],

  params(rng) {
    const p = { a: rng.int(-5, 5), b: rng.int(-5, 5), r: rng.int(2, 9) };
    if (p.a === 0 || p.b === 0 || Math.abs(p.a) === Math.abs(p.b))
      reject("a point off the axes and diagonals");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const w = cx(p.a * p.a - p.b * p.b, 2 * p.a * p.b);
        return A.standard({
          question: [
            "Under the transformation ",
            A.math("w = z^2"),
            ", find the image of ",
            A.math(`z = ${cx(p.a, p.b)}`),
            " in the form ",
            A.math("u + iv"),
            ".",
          ],
          answer: A.exact(w),
          wrong: [
            {
              code: "CPLX.ARITHMETIC",
              value: A.exact(cx(p.a * p.a + p.b * p.b, 2 * p.a * p.b)),
              feedback: "(a + bi)² = a² + 2abi + b²i², and i² = −1.",
            },
          ],
          solution: [
            {
              say: "",
              math: `(${cx(p.a, p.b)})^2 = ${p.a * p.a} ${2 * p.a * p.b < 0 ? "-" : "+"} ${Math.abs(2 * p.a * p.b)}i - ${p.b * p.b} = ${w}`,
            },
          ],
        });
      }
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "The circle ",
            A.math(`|z| = ${p.r}`),
            " is mapped by ",
            A.math("w = \\frac{1}{z}"),
            ".",
          ],
          ask: "What is its image?",
          correct: A.math(`|w| = \\frac{1}{${p.r}}`),
          distractors: [
            {
              content: A.math(`|w| = ${p.r}`),
              code: "CPLX.TRANSFORM",
              feedback: "|w| = 1/|z|, so the radius is inverted.",
            },
            {
              content: A.math(`\\operatorname{Re}(w) = \\frac{1}{${p.r}}`),
              code: "CPLX.TRANSFORM",
              feedback:
                "A circle centred on the origin maps to another circle centred on the origin.",
            },
          ],
          solution: [{ say: "", math: `|w| = \\frac{1}{|z|} = \\frac{1}{${p.r}}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Jas says that under ",
            A.math("w = \\frac{1}{z}"),
            " the line ",
            A.math(`\\operatorname{Re}(z) = ${p.r}`),
            " maps to a straight line.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. A line not through the origin maps to a circle through the origin: here |w − 1/${2 * p.r}| = 1/${2 * p.r}.`,
              correct: true,
            },
            {
              text: "True. This transformation always maps lines to lines.",
              code: "CPLX.TRANSFORM",
            },
            { text: `True. It maps to Re(w) = 1/${p.r}.`, code: "CPLX.TRANSFORM" },
          ],
          solution: [
            { say: `Write z = 1/w, so Re(1/w) = ${p.r}: u/(u² + v²) = ${p.r}, a circle.` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return exactAnswer(question) === cx(p.a * p.a - p.b * p.b, 2 * p.a * p.b);
    if (question.key.depth === 2) return chosenText(question) === `|w| = \\frac{1}{${p.r}}`;
    return true;
  },
});
