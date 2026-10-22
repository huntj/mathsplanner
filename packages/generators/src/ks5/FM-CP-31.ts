/**
 * @statement FM-CP-31
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-31: Solve coupled first-order simultaneous differential equations in context
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  d: number;
  x0: number;
  y0: number;
}

const second = (tr: number, det: number) =>
  `${linear([
    [1, "\\ddot{x}"],
    [-tr, "\\dot{x}"],
    [det, "x"],
  ])} = 0`;

export default defineGenerator<Params>({
  id: "FM-CP-31",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["CALC.COUPLED"],

  params(rng) {
    const p = {
      a: rng.int(-3, 4),
      b: rng.pick([-3, -2, 2, 3]),
      c: rng.int(-3, 4),
      d: rng.int(-3, 4),
      x0: rng.int(1, 9),
      y0: rng.int(-5, 9),
    };
    if (p.a + p.d === 0 || p.c === 0 || p.a * p.d - p.b * p.c === 0 || p.b * p.c === 0)
      reject("a full system");
    if (p.y0 === 0) reject("a non-zero starting y");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const sys = [
      A.math(
        `\\dot{x} = ${linear([
          [p.a, "x"],
          [p.b, "y"],
        ])}`,
      ),
      " and ",
      A.math(
        `\\dot{y} = ${linear([
          [p.c, "x"],
          [p.d, "y"],
        ])}`,
      ),
    ];
    switch (depth) {
      case 1: {
        const tr = p.a + p.d;
        const det = p.a * p.d - p.b * p.c;
        return A.choice({
          rng,
          question: ["Two quantities x and y satisfy ", ...sys, "."],
          ask: "Which second-order equation does x satisfy?",
          correct: A.math(second(tr, det)),
          distractors: [
            {
              content: A.math(second(tr, p.a * p.d + p.b * p.c)),
              code: "CALC.COUPLED",
              feedback: `Substituting y = (ẋ − ${p.a}x)/${p.b} gives the constant term ad − bc = ${det}.`,
            },
            {
              content: A.math(second(-tr, det)),
              code: "CALC.COUPLED",
              feedback: `Differentiate ẋ and substitute: the ẋ term is −(a + d)ẋ = ${-tr}ẋ.`,
            },
          ],
          solution: [
            {
              say: `Differentiate the first equation: ẍ = ${p.a}ẋ + ${p.b}ẏ. Substitute ẏ, then y = (ẋ − ${p.a}x)/${p.b}.`.replace(
                /\+ -/g,
                "− ",
              ),
            },
            { say: "", math: second(tr, det) },
          ],
        });
      }
      case 2: {
        const v0 = p.a * p.x0 + p.b * p.y0;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Two quantities x and y satisfy ",
                ...sys,
                ". When t = 0, ",
                A.math(`x = ${p.x0}`),
                " and ",
                A.math(`\\dot{x} = ${v0}`),
                ".",
              ],
              ask: "Find the value of y when t = 0.",
            },
          ],
          answer: A.number(p.y0),
          wrong: signedWrongs(p.y0, [
            {
              code: "CALC.COUPLED",
              value: A.number(v0 - p.a * p.x0),
              feedback: `From the first equation, y = (ẋ − ${p.a}x)/${p.b}: divide by ${p.b}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `y = \\frac{\\dot{x} - (${p.a})x}{${p.b}} = \\frac{${v0} - (${p.a * p.x0})}{${p.b}} = ${p.y0}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Foxes (x) and rabbits (y) are modelled by ",
            A.math(
              `\\dot{x} = ${linear([
                [-1, "x"],
                [1, "y"],
              ])}`,
            ),
            ". Xen says that the number of foxes always falls, because of the −x term.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. ẋ = y − x is positive whenever y > x, so the foxes increase while there are more rabbits than foxes.",
              correct: true,
            },
            {
              text: "True. A negative coefficient of x means x always decreases.",
              code: "CALC.COUPLED",
            },
            { text: "True. Foxes eat rabbits, so both always fall.", code: "CALC.COUPLED" },
          ],
          solution: [{ say: "The sign of ẋ depends on both x and y." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return chosenText(question) === second(p.a + p.d, p.a * p.d - p.b * p.c);
    if (question.key.depth === 2) return numberAnswer(question) === p.y0;
    return true;
  },
});
