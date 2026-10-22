/**
 * @statement CM-LP10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-LP10: Solve two-variable linear programs graphically using ruler and vertex methods
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  x: number;
  y: number;
  vertices: [number, number][];
  cx: number;
  cy: number;
}

const cost = (p: Params, [x, y]: [number, number]) => p.cx * x + p.cy * y;

export default defineGenerator<Params>({
  id: "CM-LP10",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.LP", "ALG.SIMULTANEOUS.SIGN"],

  params(rng) {
    const x = rng.int(2, 9);
    const y = rng.int(2, 9);
    const vertices: [number, number][] = [
      [0, rng.int(12, 20)],
      [rng.int(2, 5), rng.int(5, 9)],
      [rng.int(7, 10), rng.int(1, 3)],
      [rng.int(14, 20), 0],
    ];
    const p = { x, y, vertices, cx: rng.int(2, 9), cy: rng.int(2, 9) };
    const costs = vertices.map((v) => cost(p, v));
    const lo = Math.min(...costs);
    if (
      x === y ||
      costs.filter((c) => c === lo).length > 1 ||
      costs.indexOf(lo) === costs.indexOf(Math.max(...costs))
    )
      reject("a unique minimum");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // Lines x + y = S and 2x + y = T meet at (x, y).
        const S = p.x + p.y;
        const T = 2 * p.x + p.y;
        return A.standard({
          question: [
            "Two constraint boundaries are ",
            A.math(`x + y = ${S}`),
            " and ",
            A.math(`2x + y = ${T}`),
            ".",
          ],
          ask: "Find the x-coordinate of the vertex where they meet.",
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            {
              code: "ALG.SIMULTANEOUS.SIGN",
              value: A.number(-p.x),
              feedback: `Subtract the first equation from the second: x = ${T} − ${S}.`,
            },
          ]),
          solution: [{ say: "", math: `(2x + y) - (x + y) = ${T} - ${S} \\Rightarrow x = ${p.x}` }],
        });
      }
      case 2: {
        const costs = p.vertices.map((v) => cost(p, v));
        const v = Math.min(...costs);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `A farmer must meet some nutritional constraints. The feasible region (which does not include the origin) has vertices ${p.vertices.map(([a, b]) => `(${a}, ${b})`).join(", ")}.`,
              ],
              ask: ["Find the minimum cost ", A.math(`C = ${p.cx}x + ${p.cy}y`), "."],
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "DEC.LP",
              value: A.number(Math.max(...costs)),
              feedback: "This is a minimisation: take the smallest value of C at the vertices.",
            },
          ]),
          solution: [{ say: `C at the vertices: ${costs.join(", ")}. The minimum is ${v}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Cam says the best value of the objective could be at a point inside the feasible region, away from the edges.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. The objective is linear, so moving the objective line ('ruler') in the improving direction always reaches the edge; an optimum is always at a vertex (or along a whole edge).",
              correct: true,
            },
            { text: "True. The best point is usually in the middle.", code: "DEC.LP" },
            { text: "True. Any point in the region could be optimal.", code: "DEC.LP" },
          ],
          solution: [{ say: "That is why the vertex method works: check the corners." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.x;
    if (question.key.depth === 2)
      return numberAnswer(question) === Math.min(...p.vertices.map((v) => cost(p, v)));
    return true;
  },
});
