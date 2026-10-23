/**
 * @statement GF-A9.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A9.b: Use y = mx + c to identify parallel lines
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  m: number;
  c: number;
  k: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GF-A9.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C"],

  params(rng) {
    const p = {
      m: rng.int(2, 6) * rng.pick([1, -1]),
      c: rng.int(-9, 9),
      k: rng.int(-9, 9),
      b: rng.int(2, 5),
    };
    if (p.c === 0 || p.k === p.c || Math.abs(p.m) === Math.abs(p.c) || p.k === 0)
      reject("distinct lines");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Which line is parallel to ", A.math(lineLatex(p.m, p.c)), "?"],
          correct: A.math(lineLatex(p.m, p.k)),
          distractors: [
            {
              content: A.math(lineLatex(p.k, p.c)),
              code: "ALG.LINE.M-C",
              feedback: "Parallel lines have the same gradient, not the same intercept.",
            },
            {
              content: A.math(lineLatex(-p.m, p.k)),
              code: "ALG.LINE.M-C",
              feedback: `A gradient of ${-p.m} slopes the other way.`,
            },
          ],
          solution: [{ say: `Parallel lines have the same gradient, ${p.m}.` }],
        });
      case 2: {
        const rhs = `${p.b * p.m}x ${p.b * p.c < 0 ? "-" : "+"} ${Math.abs(p.b * p.c)}`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["A line is parallel to ", A.math(`${p.b}y = ${rhs}`), "."],
              ask: "What is its gradient?",
            },
          ],
          answer: A.number(p.m),
          wrong: signedWrongs(p.m, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(p.b * p.m),
              feedback: `Divide by ${p.b} first to get y = mx + c.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `y = ${p.m}x ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)} \\text{, so the gradient is } ${p.m}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "The lines ",
            A.math(lineLatex(p.m, p.c)),
            " and ",
            A.math(lineLatex(p.m, p.k)),
            " meet at exactly one point.",
          ],
          truth: "never",
          reasons: [
            {
              text: `Never. They have the same gradient, ${p.m}, but different intercepts, so they are parallel and never meet.`,
              correct: true,
            },
            { text: "Always. Any two straight lines cross somewhere.", code: "ALG.LINE.M-C" },
            { text: "Sometimes. It depends how far the lines are drawn." },
          ],
          solution: [{ say: "Setting them equal gives an equation with no solution." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === lineLatex(p.m, p.k);
    if (question.key.depth === 2) return numberAnswer(question) === p.m;
    return true;
  },
});
