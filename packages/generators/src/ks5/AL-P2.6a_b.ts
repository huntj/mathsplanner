/**
 * @statement AL-P2.6a.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P2.6a.b: Divide a polynomial by a linear expression
import * as A from "@mathsplanner/archetypes";
import {
  defineGenerator,
  reject,
  type GeneratorDefinition,
  type QuestionDraft,
} from "@mathsplanner/core";
import { bracket, poly } from "../shared/alg.ts";
import { chosenText } from "../shared/counting.ts";
import { mixFamilies } from "../shared/npv.ts";
import parent from "./AL-P2.6a.ts";

interface Params {
  /** (x + a)(x² + px + q) + rem. */
  a: number;
  p: number;
  q: number;
  rem: number;
}

const own: GeneratorDefinition<Params> = {
  id: "AL-P2.6a.b",
  version: "1.0.0",
  depths: [1, 4],
  misconceptions: ["ALG.QUADRATIC.ROOT-SIGN"],

  params(rng) {
    const s = { a: rng.int(-5, 5), p: rng.int(-6, 6), q: rng.int(-9, 9), rem: rng.int(1, 9) };
    if (s.a === 0 || s.p === 0 || s.q === 0 || s.p === s.a || s.a === -s.p)
      reject("non-zero terms and distinct options");
    return s;
  },

  build(s, depth, rng): QuestionDraft {
    const top = [1, s.p + s.a, s.q + s.a * s.p, s.a * s.q];
    if (depth === 1) {
      const quotient = poly([1, s.p, s.q]);
      return A.choice({
        rng,
        question: ["Divide ", A.math(poly(top)), " by ", A.math(bracket(s.a)), "."],
        correct: A.math(quotient),
        distractors: [
          {
            content: A.math(poly([1, s.p + 2 * s.a, s.q + s.a * s.p + 2 * s.a * s.a])),
            feedback:
              "Subtract each line of the division, so the x² coefficient becomes the next term.",
          },
          {
            content: A.math(poly([1, -s.p, -s.q])),
            feedback: "Multiply your answer by the divisor to check it gives the cubic.",
          },
        ],
        solution: [{ say: "", math: `${poly(top)} = ${bracket(s.a)}(${quotient})` }],
      });
    }
    const f = [...top.slice(0, 3), (top[3] ?? 0) + s.rem];
    return A.trueOrFalseWhy({
      rng,
      statement: [
        "Nia says the remainder when ",
        A.math(poly(f)),
        " is divided by ",
        A.math(bracket(s.a)),
        ` is f(${s.a}).`,
      ],
      truth: false,
      reasons: [
        {
          text: `False. By the remainder theorem, dividing by x − k leaves f(k). Here k = ${-s.a}, so the remainder is f(${-s.a}) = ${s.rem}.`,
          correct: true,
        },
        { text: "True. Use the number in the bracket.", code: "ALG.QUADRATIC.ROOT-SIGN" },
        { text: "True. The remainder is always f(1)." },
      ],
      solution: [{ say: `f(${-s.a}) = ${s.rem}.` }],
    });
  },

  verify(s, question) {
    return question.key.depth !== 1 || chosenText(question).includes(poly([1, s.p, s.q]));
  },
};

export default defineGenerator(
  mixFamilies("AL-P2.6a.b", { 1: own, 2: { ...parent.definition, id: "AL-P2.6a.b" }, 4: own }),
);
