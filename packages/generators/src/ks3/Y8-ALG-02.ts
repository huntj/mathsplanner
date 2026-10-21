/**
 * @statement Y8-ALG-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-ALG-02: Understand and use standard mathematical formulae; rearrange formulae to change the
// subject
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { signed } from "../shared/alg.ts";

interface Params {
  /** y = a·x + b. */
  a: number;
  b: number;
  /** v = u + at with these values; find t. */
  u: number;
  acc: number;
  t: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y8-ALG-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.WRONG-INVERSE"],

  params(rng, numbers) {
    const a = rng.int(2, 9);
    const b = rng.int(1, 12) * (numbers === "friendly" ? 1 : rng.pick([1, -1]));
    if (a === Math.abs(b)) reject("different numbers");
    return {
      a,
      b,
      u: rng.int(0, 20),
      acc: rng.int(2, 10),
      t: rng.int(2, 12),
      claimTrue: rng.bool(),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const formula = `y = ${p.a}x ${signed(p.b)}`;
    const answer = `\\frac{y ${signed(-p.b)}}{${p.a}}`;
    const slip = `\\frac{y ${signed(p.b)}}{${p.a}}`;
    const how = `${p.b < 0 ? "Add" : "Subtract"} ${Math.abs(p.b)} on both sides: y ${signed(-p.b)} = ${p.a}x. Divide both sides by ${p.a}: x = (y ${signed(-p.b)}) ÷ ${p.a}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Make x the subject of ", A.math(formula), "."],
          ask: ["Write an expression for x."],
          answer: A.exact(answer),
          wrong: [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.exact(slip),
              feedback: `Undo ${signed(p.b)} with the inverse: ${p.b < 0 ? "add" : "subtract"} ${Math.abs(p.b)}.`,
            },
          ],
          solution: [{ say: how, math: `x = ${answer}` }],
        });
      case 2: {
        const v = p.u + p.acc * p.t;
        return A.standard({
          question: ["The formula ", A.math("v = u + at"), " links speed, time and acceleration."],
          ask: [
            "Find t when ",
            A.math(`v = ${v}`),
            ", ",
            A.math(`u = ${p.u}`),
            " and ",
            A.math(`a = ${p.acc}`),
            ".",
          ],
          answer: A.number(p.t),
          wrong: wrongs(p.t, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(Number(((v + p.u) / p.acc).toFixed(4))),
              feedback: "Rearrange: t = (v − u) ÷ a.",
            },
          ]),
          solution: [{ say: `t = (v − u) ÷ a = (${v} − ${p.u}) ÷ ${p.acc} = ${p.t}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben rearranges ",
            A.math(formula),
            " to get ",
            A.math(`x = ${p.claimTrue ? answer : `\\frac{y}{${p.a}} ${signed(-p.b)}`}`),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                { text: `True. ${how}`, correct: true },
                {
                  text: `False. Divide y by ${p.a} first, then deal with the ${Math.abs(p.b)}.`,
                  code: "ALG.SOLVE.WRONG-INVERSE",
                },
                { text: "False. You cannot rearrange a formula with two letters." },
              ]
            : [
                {
                  text: `False. Only y is divided by ${p.a} there, not the ${Math.abs(p.b)}. ${how}`,
                  correct: true,
                },
                {
                  text: `True. Divide by ${p.a}, then undo the ${signed(p.b)}.`,
                  code: "ALG.SOLVE.WRONG-INVERSE",
                },
                { text: "True. The order of steps does not matter." },
              ],
          solution: [{ say: how }],
        });
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type === "exact") return a.value === `\\frac{y ${signed(-p.b)}}{${p.a}}`;
    if (question.archetype === "standard") return numberAnswer(question) === p.t;
    return true;
  },
});
