/**
 * @statement GF-A9.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A9.c: Find the equation of a line through one point with a given gradient
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { coord } from "../shared/pos.ts";

interface Params {
  m: number;
  x: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "GF-A9.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C"],

  params(rng) {
    const p = { m: rng.int(2, 6) * rng.pick([1, -1]), x: rng.int(-5, 6), c: rng.int(-10, 10) };
    if (p.x === 0 || p.c === 0 || p.m * p.x === 0) reject("a point off the y-axis");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const y = p.m * p.x + p.c;
    const pt = coord([p.x, y]);
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "A line has gradient ",
            A.math(String(p.m)),
            " and passes through ",
            A.math(pt),
            ".",
          ],
          ask: "Find its equation, in the form y = mx + c.",
          answer: A.exact(lineLatex(p.m, p.c)),
          wrong: [
            {
              code: "ALG.LINE.M-C",
              value: A.exact(lineLatex(p.m, y)),
              feedback: `${y} is the y-coordinate of the point, not the intercept. Substitute to find c.`,
            },
          ],
          solution: [{ say: "", math: `${y} = ${p.m}(${p.x}) + c \\Rightarrow c = ${p.c}` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The line ",
                A.math(`y = ${p.m}x + c`),
                " passes through ",
                A.math(pt),
                ".",
              ],
              ask: "Find c.",
            },
          ],
          answer: A.number(p.c),
          wrong: signedWrongs(p.c, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(y + p.m * p.x),
              feedback: `c = ${y} − (${p.m * p.x}).`,
            },
          ]),
          solution: [{ say: "", math: `c = ${y} - ${p.m} \\times ${p.x} = ${p.c}` }],
        });
      default:
        return A.spotTheMistake({
          question: [
            "Lee finds the line with gradient ",
            A.math(String(p.m)),
            " through ",
            A.math(pt),
            ".",
          ],
          lines: [
            [A.math(`${y} = ${p.m} \\times ${p.x} + c`)],
            [A.math(`c = ${y} + ${p.m * p.x}`)],
            [A.math(lineLatex(p.m, y + p.m * p.x))],
          ],
          mistake: 1,
          code: "ALG.LINE.M-C",
          feedback: `Subtract ${p.m * p.x} from ${y}: c = ${p.c}, so the line is ${lineLatex(p.m, p.c)}.`,
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === p.c;
    return true;
  },
});
