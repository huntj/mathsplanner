/**
 * @statement AL-P3.1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-P3.1: Use straight-line equations in all forms; gradient conditions for parallel and
// perpendicular lines; straight-line models
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex, poly } from "../shared/alg.ts";

interface Params {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Depth 2: the line ka·x + k·y + c = 0 has gradient −a; a point on the parallel line. */
  a: number;
  k: number;
  c: number;
  x0: number;
  y0: number;
}

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** px + qy + r = 0 with no common factor and p > 0 (or q > 0 when p = 0). */
function general(p: number, q: number, r: number): string {
  const g = gcd(gcd(p, q), r) || 1;
  const s = p < 0 || (p === 0 && q < 0) ? -1 : 1;
  const [P, Q, R] = [(s * p) / g, (s * q) / g, (s * r) / g];
  const xy = poly([P, 0], "x");
  const yTerm = Q === 0 ? "" : `${Q < 0 ? " - " : " + "}${Math.abs(Q) === 1 ? "" : Math.abs(Q)}y`;
  const cTerm = R === 0 ? "" : ` ${R < 0 ? "-" : "+"} ${Math.abs(R)}`;
  return `${xy}${yTerm}${cTerm} = 0`;
}

export default defineGenerator<Params>({
  id: "AL-P3.1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.GRADIENT.RUN-RISE", "ALG.LINE.M-C"],

  params(rng) {
    const p = {
      x1: rng.int(-5, 5),
      y1: rng.int(-5, 5),
      x2: rng.int(-5, 5),
      y2: rng.int(-5, 5),
      a: rng.int(-4, 4),
      k: rng.int(2, 3),
      c: rng.int(-9, 9),
      x0: rng.int(-4, 4),
      y0: rng.int(-6, 6),
    };
    const dx = p.x2 - p.x1;
    const dy = p.y2 - p.y1;
    if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy) || p.a === 0)
      reject("a sloping line whose gradient is not ±1");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const dx = p.x2 - p.x1;
    const dy = p.y2 - p.y1;
    switch (depth) {
      case 1: {
        const right = general(dy, -dx, dx * p.y1 - dy * p.x1);
        const slip = general(dx, -dy, dy * p.y1 - dx * p.x1);
        return A.standard({
          question: [
            "Find the equation of the line through ",
            A.math(`(${p.x1}, ${p.y1})`),
            " and ",
            A.math(`(${p.x2}, ${p.y2})`),
            ".",
          ],
          ask: "Give it in the form ax + by + c = 0, where a, b and c are integers with no common factor.",
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.GRADIENT.RUN-RISE",
              value: A.exact(slip),
              feedback: "Gradient = change in y ÷ change in x.",
            },
          ].filter(() => slip !== right),
          solution: [
            {
              say: "Gradient: ",
              math: `\\frac{${p.y2} - ${p.y1 < 0 ? `(${p.y1})` : p.y1}}{${p.x2} - ${p.x1 < 0 ? `(${p.x1})` : p.x1}} = ${toLatex(frac(dy, dx))}`,
            },
            { say: "Then y − y₁ = m(x − x₁), rearranged: ", math: right },
          ],
        });
      }
      case 2: {
        const m = -p.a;
        const given = `${p.k * p.a === 1 ? "" : p.k * p.a === -1 ? "-" : p.k * p.a}x + ${p.k}y ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)} = 0`;
        const c = p.y0 - m * p.x0;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the equation of the line parallel to ",
                A.math(given),
                " through ",
                A.math(`(${p.x0}, ${p.y0})`),
                ".",
              ],
              ask: "Give it in the form y = mx + c.",
            },
            {
              question: [
                "Line L is parallel to ",
                A.math(given),
                " and passes through ",
                A.math(`(${p.x0}, ${p.y0})`),
                ".",
              ],
              ask: "Find the equation of L in the form y = mx + c.",
            },
          ],
          answer: A.exact(lineLatex(m, c)),
          wrong: [
            {
              code: "ALG.GRADIENT.RUN-RISE",
              value: A.exact(lineLatex(-m, p.y0 + m * p.x0)),
              feedback: `Rearrange to y = …: y = ${-p.a}x + …, so the gradient is ${m}.`,
            },
          ],
          solution: [
            {
              say: `Rearranging, the gradient is ${m}. Then c = ${p.y0} − (${m}) × ${p.x0} = ${c}.`,
              math: lineLatex(m, c),
            },
          ],
        });
      }
      default: {
        const b = p.k + 1;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kyle says the line ",
            A.math(`${p.k}x + ${b}y = 12`),
            ` has gradient ${p.k}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Rearranging gives y = −${p.k}/${b} x + 12/${b}, so the gradient is −${p.k}/${b}.`,
              correct: true,
            },
            { text: "True. The gradient is the number in front of x.", code: "ALG.LINE.M-C" },
            { text: `False. The gradient is ${b}.`, code: "ALG.LINE.M-C" },
          ],
          solution: [
            { say: "Make y the subject first; then the coefficient of x is the gradient." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 2)
      return a?.type === "exact" && a.value === lineLatex(-p.a, p.y0 + p.a * p.x0);
    return true;
  },
});
