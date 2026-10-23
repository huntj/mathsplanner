/**
 * @statement GH-A18.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A18.a: Solve quadratics by completing the square
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  p: number;
  q: number;
}

const squareFree = (n: number) => {
  for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) return false;
  return true;
};

export default defineGenerator<Params>({
  id: "GH-A18.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.COMPLETE-SQUARE.HALF"],

  params(rng) {
    const p = { p: rng.int(1, 6) * rng.pick([1, -1]), q: rng.int(-9, 9) };
    const d = p.p * p.p - p.q;
    if (p.q === 0 || d <= 1 || !squareFree(d) || p.q === p.p * p.p)
      reject("a surd answer in its simplest form");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const b = 2 * p.p;
    const sq = `(x ${p.p < 0 ? "-" : "+"} ${Math.abs(p.p)})^2`;
    const r = p.q - p.p * p.p;
    const form = `${sq} ${r < 0 ? "-" : "+"} ${Math.abs(r)}`;
    const d = p.p * p.p - p.q;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Write ",
            A.math(poly([1, b, p.q])),
            " in the form ",
            A.math("(x + a)^2 + b"),
            ".",
          ],
          answer: A.exact(form),
          wrong: [
            {
              code: "ALG.COMPLETE-SQUARE.HALF",
              value: A.exact(`${sq} ${p.q < 0 ? "-" : "+"} ${Math.abs(p.q)}`),
              feedback: `(x ${p.p < 0 ? "−" : "+"} ${Math.abs(p.p)})² gives an extra ${p.p * p.p}: subtract it.`,
            },
          ],
          solution: [{ say: "Halve the x coefficient, then subtract its square: ", math: form }],
        });
      case 2: {
        const right = `${-p.p} + \\sqrt{${d}}`;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Solve ",
                A.math(`${poly([1, b, p.q])} = 0`),
                " by completing the square.",
              ],
              ask: "Give the larger solution in surd form.",
            },
          ],
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.COMPLETE-SQUARE.HALF",
              value: A.exact(`${p.p} + \\sqrt{${d}}`),
              feedback: `From ${sq} = ${d}, x = ${-p.p} ± √${d}: the number in the bracket changes sign.`,
            },
          ],
          solution: [{ say: "", math: `${sq} = ${d} \\Rightarrow x = ${-p.p} \\pm \\sqrt{${d}}` }],
        });
      }
      default:
        return A.spotTheMistake({
          question: ["Ivo completes the square for ", A.math(poly([1, b, p.q])), "."],
          lines: [
            [
              A.math(
                `= (x ${p.p < 0 ? "-" : "+"} ${Math.abs(b)})^2 - ${b * b} ${p.q < 0 ? "-" : "+"} ${Math.abs(p.q)}`,
              ),
            ],
            [
              A.math(
                `= (x ${p.p < 0 ? "-" : "+"} ${Math.abs(b)})^2 ${p.q - b * b < 0 ? "-" : "+"} ${Math.abs(p.q - b * b)}`,
              ),
            ],
          ],
          mistake: 0,
          code: "ALG.COMPLETE-SQUARE.HALF",
          feedback: `Halve the x coefficient: ${b} ÷ 2 = ${p.p}, so it is ${form}.`,
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 2)
      return exactAnswer(question) === `${-p.p} + \\sqrt{${p.p * p.p - p.q}}`;
    return true;
  },
});
