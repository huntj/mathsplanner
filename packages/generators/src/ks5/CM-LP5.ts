/**
 * @statement CM-LP5
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-LP5: Solve linear simultaneous equations algebraically and graphically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  d: number;
  x: number;
  y: number;
  adult: number;
  child: number;
}

export default defineGenerator<Params>({
  id: "CM-LP5",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SIMULTANEOUS.SIGN", "ALG.SIMULTANEOUS.PAIR"],

  params(rng) {
    const p = {
      a: rng.int(1, 5),
      b: rng.int(-4, 5),
      c: rng.int(1, 5),
      d: rng.int(-4, 5),
      x: rng.int(-5, 8),
      y: rng.int(-5, 8),
      adult: rng.int(8, 20),
      child: rng.int(3, 10),
    };
    if (
      p.a * p.d - p.b * p.c === 0 ||
      p.b === 0 ||
      p.d === 0 ||
      p.x === 0 ||
      p.y === 0 ||
      p.x === p.y ||
      p.x === -p.y
    )
      reject("a unique solution with x ≠ ±y");
    if (p.adult === p.child) reject("different prices");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const e1 = p.a * p.x + p.b * p.y;
        const e2 = p.c * p.x + p.d * p.y;
        return A.standard({
          question: [
            "Solve the simultaneous equations ",
            A.math(
              `${linear([
                [p.a, "x"],
                [p.b, "y"],
              ])} = ${e1}`,
            ),
            " and ",
            A.math(
              `${linear([
                [p.c, "x"],
                [p.d, "y"],
              ])} = ${e2}`,
            ),
            ".",
          ],
          ask: "Find the value of x.",
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            {
              code: "ALG.SIMULTANEOUS.PAIR",
              value: A.number(p.y),
              feedback: "That is the value of y.",
            },
            {
              code: "ALG.SIMULTANEOUS.SIGN",
              value: A.number(-p.x),
              feedback: "Check the signs when you add or subtract the equations.",
            },
          ]),
          solution: [{ say: `Eliminate y, then substitute back: x = ${p.x}, y = ${p.y}.` }],
        });
      }
      case 2: {
        const t1 = 3 * p.adult + 2 * p.child;
        const t2 = p.adult + 4 * p.child;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `3 adult tickets and 2 child tickets cost £${t1}. 1 adult ticket and 4 child tickets cost £${t2}.`,
              ],
              ask: "Find the price of an adult ticket.",
            },
          ],
          answer: A.number(p.adult, { units: "£" }),
          wrong: wrongs(p.adult, [
            {
              code: "ALG.SIMULTANEOUS.PAIR",
              value: A.number(p.child, { units: "£" }),
              feedback: "That is the child price.",
            },
          ]),
          solution: [
            {
              say: "",
              math: `3a + 2c = ${t1}, \\; a + 4c = ${t2} \\Rightarrow a = ${p.adult}, \\; c = ${p.child}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Xia says the simultaneous equations ",
            A.math(`y = ${p.a}x + ${Math.abs(p.b)}`),
            " and ",
            A.math(`y = ${p.a}x + ${Math.abs(p.b) + 3}`),
            " have exactly one solution.",
          ],
          truth: false,
          reasons: [
            {
              text:
                "False. Both lines have gradient " +
                p.a +
                " and different intercepts, so they are parallel and never meet: there is no solution.",
              correct: true,
            },
            {
              text: "True. Two linear equations always have one solution.",
              code: "ALG.SIMULTANEOUS.SIGN",
            },
            { text: "True. Subtracting them gives the answer.", code: "ALG.SIMULTANEOUS.SIGN" },
          ],
          solution: [{ say: "Graphically, the solution is where the lines cross." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.x;
    if (question.key.depth === 2) return numberAnswer(question) === p.adult;
    return true;
  },
});
