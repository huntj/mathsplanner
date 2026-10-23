/**
 * @statement AL-P7.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P7.3: Find tangents, normals, stationary points, maxima and minima, and increasing and
// decreasing functions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  b: number;
  c: number;
  a: number;
}

const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y));

/** px + qy + r = 0 with no common factor and p > 0. */
function general(p: number, q: number, r: number): string {
  const g = gcd(gcd(p, q), r) || 1;
  const s = p < 0 || (p === 0 && q < 0) ? -1 : 1;
  const [P, Q, R] = [(s * p) / g, (s * q) / g, (s * r) / g];
  const x = P === 0 ? "" : P === 1 ? "x" : `${P}x`;
  const y =
    Q === 0
      ? ""
      : `${x ? (Q < 0 ? " - " : " + ") : Q < 0 ? "-" : ""}${Math.abs(Q) === 1 ? "" : Math.abs(Q)}y`;
  const c = R === 0 ? "" : ` ${R < 0 ? "-" : "+"} ${Math.abs(R)}`;
  return `${x}${y}${c} = 0`;
}

export default defineGenerator<Params>({
  id: "AL-P7.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.POWER-RULE", "ALG.PERPENDICULAR.GRADIENT", "CALC.STATIONARY"],

  params(rng) {
    const p = { b: rng.int(-8, 8), c: rng.int(-9, 9), a: rng.int(-4, 4) };
    const m = 2 * p.a + p.b;
    if (p.b === 0 || m === 0) reject("a sloping tangent");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const f = (x: number) => x * x + p.b * x + p.c;
    const m = 2 * p.a + p.b;
    const curve = `y = ${poly([1, p.b, p.c])}`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Find the gradient of the curve ",
            A.math(curve),
            ` at the point where x = ${p.a}.`,
          ],
          answer: A.number(m),
          wrong: signedWrongs(m, [
            {
              code: "CALC.POWER-RULE",
              value: A.number(f(p.a)),
              feedback: "That is the y-coordinate. Differentiate, then substitute x.",
            },
          ]),
          solution: [
            { say: "", math: `\\frac{dy}{dx} = ${poly([2, p.b])} = ${m} \\text{ at } x = ${p.a}` },
          ],
        });
      case 2: {
        // Normal: gradient −1/m through (a, f(a)): x + m y − (a + m f(a)) = 0.
        const right = general(1, m, -(p.a + m * f(p.a)));
        const tangent = general(m, -1, f(p.a) - m * p.a);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the equation of the normal to ",
                A.math(curve),
                ` at the point where x = ${p.a}.`,
              ],
              ask: "Give it in the form ax + by + c = 0, where a, b and c are integers.",
            },
          ],
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.PERPENDICULAR.GRADIENT",
              value: A.exact(tangent),
              feedback: `That is the tangent. The normal has gradient −1/${m}.`,
            },
          ],
          solution: [
            {
              say: `At x = ${p.a}: y = ${f(p.a)}, gradient ${m}, so the normal's gradient is −1/${m}.`,
              math: right,
            },
          ],
        });
      }
      default: {
        const tp = -p.b / 2;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eva says the stationary points of ",
            A.math(curve),
            " are where the curve crosses the x-axis.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Stationary points are where dy/dx = 0: here 2x ${p.b < 0 ? "−" : "+"} ${Math.abs(p.b)} = 0, so x = ${tp}. The x-axis crossings are where y = 0.`,
              correct: true,
            },
            { text: "True. The curve is flat where it meets the axis.", code: "CALC.STATIONARY" },
            { text: "True. y = 0 and dy/dx = 0 mean the same thing.", code: "CALC.STATIONARY" },
          ],
          solution: [{ say: "Set dy/dx = 0 to find stationary points; set y = 0 to find roots." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 2 * p.a + p.b;
    return true;
  },
});
