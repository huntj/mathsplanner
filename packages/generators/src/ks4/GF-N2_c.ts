/**
 * @statement GF-N2.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N2.c: Calculate with fractions and mixed numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { gcdOf } from "../shared/fr.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  d: number;
  m: number;
  n: number;
  e: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GF-N2.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.ADD.TOPS-AND-BOTTOMS", "FR.MIXED.CONVERT"],

  params(rng) {
    const b = rng.int(2, 9);
    const d = rng.int(2, 9);
    const e = rng.int(2, 9);
    const p = {
      a: rng.int(1, b - 1),
      b,
      c: rng.int(1, d - 1),
      d,
      m: rng.int(1, 4),
      n: rng.int(1, e - 1),
      e,
      k: rng.int(2, 5),
    };
    if (b === d || gcdOf(p.a, b) > 1 || gcdOf(p.c, d) > 1 || gcdOf(p.n, e) > 1)
      reject("fractions in their simplest form");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const f = (n: number, d: number) => `\\frac{${n}}{${d}}`;
    const mixed = `${p.m}${f(p.n, p.e)}`;
    switch (depth) {
      case 1: {
        const v = frac(p.a * p.d + p.c * p.b, p.b * p.d);
        return A.standard({
          question: ["Work out ", A.math(`${f(p.a, p.b)} + ${f(p.c, p.d)}`), "."],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.ADD.TOPS-AND-BOTTOMS",
              value: A.exact(frac(p.a + p.c, p.b + p.d)),
              feedback:
                "Write both fractions over a common denominator before adding the numerators.",
            },
          ],
          solution: [
            {
              say: "",
              math: `${f(p.a * p.d, p.b * p.d)} + ${f(p.c * p.b, p.b * p.d)} = ${toLatex(v)}`,
            },
          ],
        });
      }
      case 2: {
        const v = frac((p.m * p.e + p.n) * p.k, p.e);
        return A.variedForm({
          rng,
          forms: [{ question: ["Work out ", A.math(`${mixed} \\times ${p.k}`), "."] }],
          answer: A.exact(v),
          wrong: [
            {
              code: "FR.MIXED.CONVERT",
              value: A.exact(frac(p.m * p.k * p.e + p.n, p.e)),
              feedback: `Multiply the fraction part too: change ${p.m} ${p.n}/${p.e} to ${p.m * p.e + p.n}/${p.e} first.`,
            },
          ],
          solution: [
            { say: "", math: `${f(p.m * p.e + p.n, p.e)} \\times ${p.k} = ${toLatex(v)}` },
          ],
        });
      }
      default:
        return A.spotTheMistake({
          question: ["Sam writes ", A.math(mixed), " as an improper fraction."],
          lines: [
            [A.math(`${p.m} \\times ${p.n} = ${p.m * p.n}`)],
            [A.math(`${mixed} = ${f(p.m * p.n, p.e)}`)],
          ],
          mistake: 0,
          code: "FR.MIXED.CONVERT",
          feedback: `Multiply the whole number by the denominator, then add the numerator: ${p.m} × ${p.e} + ${p.n} = ${p.m * p.e + p.n}, so it is ${p.m * p.e + p.n}/${p.e}.`,
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return exactAnswer(question) === toLatex(frac(p.a * p.d + p.c * p.b, p.b * p.d));
    if (question.key.depth === 2)
      return exactAnswer(question) === toLatex(frac((p.m * p.e + p.n) * p.k, p.e));
    return true;
  },
});
