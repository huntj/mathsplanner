/**
 * @statement AL-P5.5a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P5.5a: Use tan θ = sin θ / cos θ and sin²θ + cos²θ = 1
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";

const TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
] as const;

interface Params {
  t: number;
  /** Whether sin is the first or second leg of the triple. */
  swap: boolean;
}

export default defineGenerator<Params>({
  id: "AL-P5.5a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["GEO.TRIG.IDENTITY"],

  params(rng) {
    return { t: rng.int(0, TRIPLES.length - 1), swap: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [x, y, h] = TRIPLES[p.t] ?? (TRIPLES[0] as (typeof TRIPLES)[number]);
    const [s, c] = p.swap ? [y, x] : [x, y];
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Given that ",
            A.math(`\\sin\\theta = ${toLatex(frac(s, h))}`),
            " and θ is acute, find the exact value of ",
            A.math("\\cos\\theta"),
            ".",
          ],
          answer: A.exact(frac(c, h)),
          wrong: [
            {
              code: "GEO.TRIG.IDENTITY",
              value: A.exact(frac(h - s, h)),
              feedback: "Use sin²θ + cos²θ = 1, not sin θ + cos θ = 1.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\cos^2\\theta = 1 - \\left(${toLatex(frac(s, h))}\\right)^2 = ${toLatex(frac(c * c, h * h))} \\Rightarrow \\cos\\theta = ${toLatex(frac(c, h))}`,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Given that ",
                A.math(`\\sin\\theta = ${toLatex(frac(s, h))}`),
                " and θ is obtuse, find the exact value of ",
                A.math("\\tan\\theta"),
                ".",
              ],
            },
          ],
          answer: A.exact(frac(-s, c)),
          wrong: [
            {
              code: "GEO.TRIG.IDENTITY",
              value: A.exact(frac(s, c)),
              feedback: "For an obtuse angle cos θ is negative, so tan θ is negative too.",
            },
          ],
          solution: [
            {
              say: "",
              math: `\\cos\\theta = -${toLatex(frac(c, h))},\\ \\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta} = ${toLatex(frac(-s, c))}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kai says ",
            A.math("\\sin^2\\theta + \\cos^2\\theta = 1"),
            " is only true when θ is acute.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. It holds for every angle: (cos θ, sin θ) is a point on the unit circle, so cos²θ + sin²θ = 1.",
              correct: true,
            },
            {
              text: "True. It comes from a right-angled triangle, so it needs an acute angle.",
              code: "GEO.TRIG.IDENTITY",
            },
            {
              text: "True. For obtuse angles cos θ is negative, so the sum is less than 1.",
              code: "GEO.TRIG.IDENTITY",
            },
          ],
          solution: [
            {
              say: "Squaring removes any negative sign, and the unit circle works for all angles.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    const [x, y, h] = TRIPLES[p.t] ?? (TRIPLES[0] as (typeof TRIPLES)[number]);
    const c = p.swap ? x : y;
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1) return a?.type === "exact" && a.value === toLatex(frac(c, h));
    return true;
  },
});
