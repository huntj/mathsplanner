/**
 * @statement AL-P3.2
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P3.2: Use the circle equation (x − a)² + (y − b)² = r², completing the square and circle
// properties
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { bracket } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";

/** Offsets (u, v) from the centre with u² + v² = r², for a whole-number point on the circle. */
const OFFSETS: [number, number, number][] = [
  [3, 4, 5],
  [4, 3, 5],
  [-3, 4, 5],
  [3, -4, 5],
  [5, 12, 13],
  [-12, 5, 13],
  [6, 8, 10],
  [-8, 6, 10],
];

interface Params {
  a: number;
  b: number;
  r: number;
  off: number;
  claimTrue: boolean;
}

const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y));

export default defineGenerator<Params>({
  id: "AL-P3.2",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: [
    "ALG.QUADRATIC.ROOT-SIGN",
    "ALG.CIRCLE.RADIUS-SQUARED",
    "ALG.COMPLETE-SQUARE.HALF",
    "ALG.PERPENDICULAR.GRADIENT",
  ],

  params(rng) {
    const a = rng.int(-6, 6);
    const b = rng.int(-6, 6);
    const r = rng.int(2, 9);
    if (a === 0 || b === 0 || a === b || a === -b || Math.abs(a) === r || Math.abs(b) === r)
      reject("a centre off the axes, different from the radius");
    return { a, b, r, off: rng.int(0, OFFSETS.length - 1), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const term = (c: number, v: string) =>
          c === 0 ? "" : ` ${c < 0 ? "-" : "+"} ${Math.abs(c) === 1 && v ? "" : Math.abs(c)}${v}`;
        const eq = `x^2 + y^2${term(-2 * p.a, "x")}${term(-2 * p.b, "y")}${term(p.a * p.a + p.b * p.b - p.r * p.r, "")} = 0`;
        const opt = (x: number, y: number, r: number) => [
          A.math(`\\text{centre } (${x}, ${y}),\\ \\text{radius } ${r}`),
        ];
        return A.choice({
          rng,
          question: ["A circle has equation ", A.math(eq), "."],
          ask: "What are its centre and radius?",
          correct: opt(p.a, p.b, p.r),
          distractors: [
            {
              content: opt(-p.a, -p.b, p.r),
              code: "ALG.QUADRATIC.ROOT-SIGN",
              feedback: `Completing the square gives ${bracket(-p.a)}² + ${bracket(-p.b, "y")}², so the centre is (${p.a}, ${p.b}).`,
            },
            {
              content: opt(p.a, p.b, p.r * p.r),
              code: "ALG.CIRCLE.RADIUS-SQUARED",
              feedback: `The right-hand side is r², so r = √${p.r * p.r} = ${p.r}.`,
            },
            {
              content: opt(-2 * p.a, -2 * p.b, p.r),
              code: "ALG.COMPLETE-SQUARE.HALF",
              feedback: "Halve the coefficients of x and y to find the centre.",
            },
          ],
          solution: [
            {
              say: "Complete the square in x and in y: ",
              math: `${bracket(-p.a)}^2 + ${bracket(-p.b, "y")}^2 = ${p.r * p.r}`,
            },
          ],
        });
      }
      case 2: {
        const [u, v, R] = OFFSETS[p.off] ?? (OFFSETS[0] as [number, number, number]);
        const [x0, y0] = [p.a + u, p.b + v];
        // Tangent: u(x − x0) + v(y − y0) = 0, scaled to no common factor.
        const norm = (P: number, Q: number, C: number) => {
          const g = gcd(gcd(P, Q), C) || 1;
          const s = P < 0 ? -1 : 1;
          const [pp, qq, cc] = [(s * P) / g, (s * Q) / g, (s * C) / g];
          return `${pp === 1 ? "" : pp}x ${qq < 0 ? "-" : "+"} ${Math.abs(qq) === 1 ? "" : Math.abs(qq)}y ${cc < 0 ? "-" : "+"} ${Math.abs(cc)} = 0`;
        };
        const right = norm(u, v, -(u * x0 + v * y0));
        const slip = norm(v, -u, -(v * x0 - u * y0));
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "The point ",
                A.math(`P(${x0}, ${y0})`),
                " lies on the circle ",
                A.math(`${bracket(-p.a)}^2 + ${bracket(-p.b, "y")}^2 = ${R * R}`),
                ".",
              ],
              ask: "Find the equation of the tangent at P, in the form ax + by + c = 0 with integers a, b and c with no common factor.",
            },
          ],
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.PERPENDICULAR.GRADIENT",
              value: A.exact(slip),
              feedback:
                "That is the line along the radius. The tangent is perpendicular to the radius.",
            },
          ].filter(() => slip !== right),
          solution: [
            {
              say: `The radius to P has gradient ${v}/${u}, so the tangent has gradient ${-u}/${v}.`,
              math: right,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: p.claimTrue
            ? [
                "Ruby says the circle ",
                A.math(`${bracket(-p.a)}^2 + ${bracket(-p.b, "y")}^2 = ${p.r * p.r}`),
                ` has centre (${p.a}, ${p.b}) and radius ${p.r}.`,
              ]
            : [
                "Ruby says the circle ",
                A.math(`${bracket(-p.a)}^2 + ${bracket(-p.b, "y")}^2 = ${p.r * p.r}`),
                ` has centre (${-p.a}, ${-p.b}).`,
              ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: "True. (x − a)² + (y − b)² = r² has centre (a, b) and radius r.",
                  correct: true,
                },
                {
                  text: `False. The centre is (${-p.a}, ${-p.b}).`,
                  code: "ALG.QUADRATIC.ROOT-SIGN",
                },
                { text: `False. The radius is ${p.r * p.r}.`, code: "ALG.CIRCLE.RADIUS-SQUARED" },
              ]
            : [
                {
                  text: `False. (x − a)² + (y − b)² = r² has centre (a, b), so here (${p.a}, ${p.b}).`,
                  correct: true,
                },
                {
                  text: "True. Read the numbers in the brackets.",
                  code: "ALG.QUADRATIC.ROOT-SIGN",
                },
                { text: "True. The centre is always where x and y are zero." },
              ],
          solution: [
            { say: `The brackets are zero at x = ${p.a} and y = ${p.b}: that is the centre.` },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question).includes(`(${p.a}, ${p.b}),\\ \\text{radius } ${p.r}`);
    return true;
  },
});
