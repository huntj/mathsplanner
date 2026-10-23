/**
 * @statement FM-D1-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D1-06: Formulate and solve linear programming problems graphically and by the simplex method
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

export interface Params {
  a: number;
  b: number;
  T: number;
  px: number;
  py: number;
  vertices: [number, number][];
}

const value = (p: Params, [x, y]: [number, number]) => p.px * x + p.py * y;
const best = (p: Params) => Math.max(...p.vertices.map((v) => value(p, v)));

export default defineGenerator<Params>({
  id: "FM-D1-06",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.LP"],

  params(rng) {
    const x3 = rng.int(8, 20);
    const y1 = rng.int(8, 20);
    const vertices: [number, number][] = [
      [0, 0],
      [0, y1],
      [rng.int(3, x3 - 2), rng.int(3, y1 - 2)],
      [x3, 0],
    ];
    const p = {
      a: rng.int(2, 6),
      b: rng.int(2, 6),
      T: 10 * rng.int(4, 12),
      px: rng.int(2, 9),
      py: rng.int(2, 9),
      vertices,
    };
    if (p.a === p.b) reject("different coefficients");
    const [x2, y2] = vertices[2] ?? [0, 0];
    if (x2 / x3 + y2 / y1 <= 1.15) reject("a convex feasible region");
    const vals = vertices.map((v) => value(p, v));
    if (vals.filter((v) => v === best(p)).length > 1 || value(p, [x3, 0]) === best(p))
      reject("a unique optimum away from the x-intercept");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = `${p.a}x + ${p.b}y \\le ${p.T}`;
        return A.choice({
          rng,
          question: [
            `A workshop makes x chairs and y tables. A chair needs ${p.a} hours of work and a table needs ${p.b} hours. At most ${p.T} hours are available.`,
          ],
          ask: "Which constraint models this?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`${p.a}x + ${p.b}y \\ge ${p.T}`),
              code: "DEC.LP",
              feedback: `"At most" means the hours used must be no more than ${p.T}: ≤.`,
            },
            {
              content: A.math(`${p.b}x + ${p.a}y \\le ${p.T}`),
              code: "DEC.LP",
              feedback: `Each chair (x) needs ${p.a} hours, so x goes with ${p.a}.`,
            },
          ],
          solution: [{ say: "Hours used ≤ hours available: ", math: right }],
        });
      }
      case 2: {
        const v = best(p);
        const x3 = p.vertices[3] ?? [0, 0];
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `The feasible region of a linear programming problem has vertices ${p.vertices.map(([x, y]) => `(${x}, ${y})`).join(", ")}.`,
              ],
              ask: ["Find the maximum value of ", A.math(`P = ${p.px}x + ${p.py}y`), "."],
            },
          ],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "DEC.LP",
              value: A.number(value(p, x3)),
              feedback: "Evaluate P at every vertex and take the largest.",
            },
          ]),
          solution: [
            {
              say: `P at the vertices: ${p.vertices.map((vx) => value(p, vx)).join(", ")}. The maximum is ${v}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Quinn sets up a simplex tableau with objective row P − 3x − 5y = 0 and says the pivot column is x, because 3 is the first coefficient.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Choose the column with the most negative value in the objective row, here y (−5), because increasing y raises P fastest.",
              correct: true,
            },
            { text: "True. Always pivot on the first variable.", code: "DEC.LP" },
            { text: "True. Choose the column with the smallest coefficient.", code: "DEC.LP" },
          ],
          solution: [
            { say: "Then the pivot row is the one with the smallest non-negative θ ratio." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `${p.a}x + ${p.b}y \\le ${p.T}`;
    if (question.key.depth === 2) return numberAnswer(question) === best(p);
    return true;
  },
});
