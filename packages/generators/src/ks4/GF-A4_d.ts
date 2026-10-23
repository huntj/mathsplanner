/**
 * @statement GF-A4.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GF-A4 sub-statements
 */
// GF-A4.d: Expand the product of two binomials
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket, linear, poly } from "../shared/alg.ts";

interface Params {
  a: number;
  b: number;
  p: number;
  q: number;
  k: number;
}

const product = (a: number, b: number) => poly([1, a + b, a * b]);

export default defineGenerator<Params>({
  id: "GF-A4.d",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["ALG.EXPAND.BINOMIAL-TWO-TERMS", "ALG.EXPAND.NEGATIVE"],

  params(rng, numbers) {
    const sign = () => (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    const p = {
      a: rng.int(1, 9) * sign(),
      b: rng.int(1, 9) * sign(),
      p: rng.int(2, 5),
      q: rng.int(1, 4),
      k: rng.int(2, 9),
    };
    if (p.a + p.b === 0 || p.a === p.b) reject("a middle term");
    if (p.p * p.b + p.q * p.a === 0) reject("a middle term at depth 2");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = product(p.a, p.b);
        return A.standard({
          question: ["Expand and simplify ", A.math(`${bracket(p.a)}${bracket(p.b)}`), "."],
          answer: A.exact(right, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.exact(poly([1, 0, p.a * p.b])),
              feedback:
                "Multiply every term in the first bracket by every term in the second: four products.",
            },
          ],
          solution: [{ say: "Four products, then collect the x terms: ", math: right }],
        });
      }
      case 2: {
        const right = poly([p.p * p.q, p.p * p.b + p.q * p.a, p.a * p.b]);
        const first = `(${linear([
          [p.p, "x"],
          [p.a, ""],
        ])})`;
        const second = `(${linear([
          [p.q, "x"],
          [p.b, ""],
        ])})`;
        return A.variedForm({
          rng,
          forms: [{ question: ["Expand and simplify ", A.math(`${first}${second}`), "."] }],
          answer: A.exact(right, "expanded"),
          wrong: [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.exact(poly([p.p * p.q, 0, p.a * p.b])),
              feedback: "There are four products: the two middle ones make the x term.",
            },
          ],
          solution: [
            {
              say: "",
              math: `${p.p * p.q}x^2 ${p.p * p.b < 0 ? "-" : "+"} ${Math.abs(p.p * p.b)}x ${p.q * p.a < 0 ? "-" : "+"} ${Math.abs(p.q * p.a)}x ${p.a * p.b < 0 ? "-" : "+"} ${Math.abs(p.a * p.b)} = ${right}`,
            },
          ],
        });
      }
      case 3: {
        const right = poly([1, 2 * p.k, p.k * p.k]);
        return A.choice({
          rng,
          question: ["Which is the expansion of ", A.math(`(x + ${p.k})^2`), "?"],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(poly([1, 0, p.k * p.k])),
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              feedback: `(x + ${p.k})² = (x + ${p.k})(x + ${p.k}): there are two middle terms of ${p.k}x.`,
            },
            {
              content: A.math(poly([1, p.k, p.k * p.k])),
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              feedback: `The middle terms are ${p.k}x and ${p.k}x, which make ${2 * p.k}x.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `(x + ${p.k})(x + ${p.k}) = x^2 + ${p.k}x + ${p.k}x + ${p.k * p.k} = ${right}`,
            },
          ],
        });
      }
      default: {
        // (x − a)(x + b) with the last product's sign slipped.
        const a = Math.abs(p.a);
        const b = Math.abs(p.b) === a ? a + 1 : Math.abs(p.b);
        const right = poly([1, b - a, -a * b]);
        const bad = poly([1, b - a, a * b]);
        return A.spotTheMistake({
          question: ["Dan expands ", A.math(`(x - ${a})(x + ${b})`), "."],
          lines: [[A.math(`= x^2 + ${b}x - ${a}x + ${a * b}`)], [A.math(`= ${bad}`)]],
          mistake: 0,
          code: "ALG.EXPAND.NEGATIVE",
          feedback: `−${a} × +${b} = −${a * b}, so the answer is ${right}.`,
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) return a?.type === "exact" && a.value === product(p.a, p.b);
    return true;
  },
});
