/**
 * @statement GH-R13
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-R13: Construct equations for direct and inverse proportion, including with powers and roots
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: y = kx², known at x = a, wanted at x = b. */
  k: number;
  a: number;
  b: number;
  /** Depth 2: y = m/x², known at x = c, wanted at x = d. */
  m: number;
  c: number;
  d: number;
  /** Depth 5: y = j√x, known at x = s², wanted where y = Y. */
  j: number;
  s: number;
  t: number;
}

const lcm = (x: number, y: number): number => {
  const g = (u: number, v: number): number => (v === 0 ? u : g(v, u % v));
  return (x * y) / g(x, y);
};

export default defineGenerator<Params>({
  id: "GH-R13",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["RAT.PROPORTION.POWER", "RAT.INVERSE.AS-DIRECT"],

  params(rng) {
    const a = rng.int(2, 5);
    const b = rng.int(2, 8);
    const c = rng.int(1, 4);
    const d = rng.int(2, 6);
    const s = rng.int(2, 5);
    const t = rng.int(2, 6);
    if (a === b || c === d || s === t) reject("two different values of x");
    return {
      k: rng.int(2, 5),
      a,
      b,
      m: rng.int(1, 3) * lcm(c, d) ** 2,
      c,
      d,
      j: rng.int(2, 6),
      s,
      t,
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const ya = p.k * p.a * p.a;
        const yb = p.k * p.b * p.b;
        return A.standard({
          question: `y is directly proportional to x². When x = ${p.a}, y = ${ya}.`,
          ask: `Find y when x = ${p.b}.`,
          answer: A.number(yb),
          wrong: [
            {
              code: "RAT.PROPORTION.POWER",
              value: A.number(p.k * p.a * p.b),
              feedback: "y is proportional to x², not x: square the values of x.",
            },
          ],
          solution: [
            { say: `y = kx², so ${ya} = k × ${p.a * p.a} and k = ${p.k}.` },
            { say: `y = ${p.k} × ${p.b}² = ${yb}.` },
          ],
        });
      }
      case 2: {
        const yc = frac(p.m, p.c * p.c);
        const yd = frac(p.m, p.d * p.d);
        return A.variedForm({
          rng,
          forms: [
            {
              question: `y is inversely proportional to x². When x = ${p.c}, y = ${yc.toString()}.`,
              ask: `Find y when x = ${p.d}.`,
            },
            {
              question: `y is inversely proportional to the square of x, and y = ${yc.toString()} when x = ${p.c}.`,
              ask: `Work out the value of y when x = ${p.d}.`,
            },
          ],
          answer: A.exact(yd),
          wrong: [
            {
              code: "RAT.INVERSE.AS-DIRECT",
              value: A.exact(yc.mul(frac(p.d * p.d, p.c * p.c))),
              feedback: "Inverse proportion: as x gets bigger, y gets smaller. Use y = k/x².",
            },
          ],
          solution: [
            { say: `y = k/x², so k = ${yc.toString()} × ${p.c * p.c} = ${p.m}.` },
            { say: `y = ${p.m} ÷ ${p.d * p.d} = `, math: toLatex(yd) },
          ],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement: `The area of a square tile is proportional to the square of its side length. Zak says that if the side length is doubled, the area is doubled.`,
          truth: false,
          reasons: [
            { text: "False. A ∝ s², so doubling s multiplies the area by 2² = 4.", correct: true },
            {
              text: "True. Proportional means it changes by the same factor.",
              code: "RAT.PROPORTION.POWER",
            },
            { text: "False. The area is halved.", code: "RAT.INVERSE.AS-DIRECT" },
          ],
          solution: [{ say: "If y ∝ x², multiplying x by n multiplies y by n²." }],
        });
      default: {
        const y1 = p.j * p.s;
        const target = p.j * p.t;
        return A.multiStepContext({
          context: `y is directly proportional to the square root of x. When x = ${p.s * p.s}, y = ${y1}.`,
          parts: [
            {
              ask: "Find a formula for y in terms of x. Give the value of the constant k in y = k√x.",
              answer: A.exact(p.j),
              wrong: [
                {
                  code: "RAT.PROPORTION.POWER",
                  value: A.exact(frac(y1, p.s * p.s)),
                  feedback: `Divide by √${p.s * p.s} = ${p.s}, not by ${p.s * p.s}.`,
                },
              ],
            },
            {
              ask: `Find x when y = ${target}.`,
              answer: A.number(p.t * p.t),
              wrong: [
                {
                  code: "RAT.PROPORTION.POWER",
                  value: A.number(p.t),
                  feedback: `√x = ${p.t}, so x = ${p.t}² = ${p.t * p.t}.`,
                },
              ],
            },
          ],
          solution: [
            { say: `${y1} = k√${p.s * p.s} = ${p.s}k, so k = ${p.j}.` },
            { say: `${target} = ${p.j}√x, so √x = ${p.t} and x = ${p.t * p.t}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k * p.b * p.b;
    if (question.key.depth === 5) {
      const a = question.parts[0]?.answer;
      return a?.type === "exact" && a.value === String(p.j);
    }
    return true;
  },
});
