/**
 * @statement CM-LP11
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-LP11: Solve problems where solutions must be integers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c1: number;
  d: number;
  e: number;
  c2: number;
  px: number;
  py: number;
}

const feasible = (p: Params, x: number, y: number) =>
  x >= 0 && y >= 0 && p.a * x + p.b * y <= p.c1 && p.d * x + p.e * y <= p.c2;
const value = (p: Params, x: number, y: number) => p.px * x + p.py * y;

function bestInteger(p: Params): { x: number; y: number; v: number } {
  let best = { x: 0, y: 0, v: 0 };
  for (let x = 0; x <= 40; x++)
    for (let y = 0; y <= 40; y++)
      if (feasible(p, x, y) && value(p, x, y) > best.v) best = { x, y, v: value(p, x, y) };
  return best;
}

/** The vertex where the two constraint lines meet. */
function vertex(p: Params): [number, number] {
  const det = p.a * p.e - p.b * p.d;
  return [(p.c1 * p.e - p.b * p.c2) / det, (p.a * p.c2 - p.c1 * p.d) / det];
}

export default defineGenerator<Params>({
  id: "CM-LP11",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.INTEGER"],

  params(rng) {
    const p = {
      a: rng.int(2, 5),
      b: rng.int(3, 7),
      c1: rng.int(30, 60),
      d: rng.int(4, 8),
      e: rng.int(1, 3),
      c2: rng.int(30, 60),
      px: rng.int(3, 8),
      py: rng.int(3, 8),
    };
    const [vx, vy] = vertex(p);
    if (!(vx > 1 && vy > 1) || Number.isInteger(vx) || Number.isInteger(vy))
      reject("a non-integer vertex inside the quadrant");
    const rx = Math.round(vx);
    const ry = Math.round(vy);
    if (feasible(p, rx, ry)) reject("a rounded vertex that is not feasible");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const cons = [
      A.math(`${p.a}x + ${p.b}y \\le ${p.c1}`),
      ", ",
      A.math(`${p.d}x + ${p.e === 1 ? "" : p.e}y \\le ${p.c2}`),
      ", ",
      A.math("x, y \\ge 0"),
    ];
    const [vx, vy] = vertex(p);
    switch (depth) {
      case 1: {
        const v = bestInteger(p).v;
        const rounded = value(p, Math.round(vx), Math.round(vy));
        return A.standard({
          question: [
            "A firm makes x chairs and y tables, subject to ",
            ...cons,
            ". x and y must be whole numbers.",
          ],
          ask: ["Find the maximum profit ", A.math(`P = ${p.px}x + ${p.py}y`), "."],
          answer: A.number(v, { units: "£" }),
          wrong: wrongs(v, [
            {
              code: "DEC.INTEGER",
              value: A.number(rounded, { units: "£" }),
              feedback: `Rounding the vertex (${Math.round(vx * 100) / 100}, ${Math.round(vy * 100) / 100}) gives (${Math.round(vx)}, ${Math.round(vy)}), which breaks a constraint. Check integer points near the vertex.`,
            },
          ]),
          solution: [
            {
              say: `The LP vertex is at about (${Math.round(vx * 100) / 100}, ${Math.round(vy * 100) / 100}). Testing nearby feasible integer points, the best is (${bestInteger(p).x}, ${bestInteger(p).y}), giving £${v}.`,
            },
          ],
        });
      }
      case 2: {
        const best = bestInteger(p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A firm makes x chairs and y tables, subject to ",
                ...cons,
                ". x and y must be whole numbers, and the profit is ",
                A.math(`P = ${p.px}x + ${p.py}y`),
                ".",
              ],
              ask: "How many tables should it make for maximum profit?",
            },
          ],
          answer: A.number(best.y),
          wrong: wrongs(best.y, [
            {
              code: "DEC.INTEGER",
              value: A.number(Math.round(vy)),
              feedback:
                "Rounding the vertex can leave the feasible region. Test the integer points near it.",
            },
          ]),
          solution: [{ say: `The best feasible integer point is (${best.x}, ${best.y}).` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Dee says that if the LP optimum is at (${Math.round(vx * 100) / 100}, ${Math.round(vy * 100) / 100}), the best whole-number answer is (${Math.round(vx)}, ${Math.round(vy)}).`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. (${Math.round(vx)}, ${Math.round(vy)}) breaks a constraint here. Test feasible integer points near the vertex and compare their values.`,
              correct: true,
            },
            {
              text: "True. Rounding the optimum always gives the best integer point.",
              code: "DEC.INTEGER",
            },
            { text: "True. Rounded points are always inside the region.", code: "DEC.INTEGER" },
          ],
          solution: [
            {
              say: `Check: ${p.a}(${Math.round(vx)}) + ${p.b}(${Math.round(vy)}) = ${p.a * Math.round(vx) + p.b * Math.round(vy)} against ${p.c1}, and ${p.d}(${Math.round(vx)}) + ${p.e}(${Math.round(vy)}) = ${p.d * Math.round(vx) + p.e * Math.round(vy)} against ${p.c2}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === bestInteger(p).v;
    if (question.key.depth === 2) return numberAnswer(question) === bestInteger(p).y;
    return true;
  },
});
