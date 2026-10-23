/**
 * @statement GF-A10.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A10.b: Identify and interpret intercepts
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
  m: number;
  x: number;
  fee: number;
  rate: number;
}

export default defineGenerator<Params>({
  id: "GF-A10.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C"],

  params(rng) {
    const p = {
      a: rng.int(1, 6),
      b: rng.int(2, 5),
      k: rng.int(-6, 8),
      m: rng.int(2, 6) * rng.pick([1, -1]),
      x: rng.int(-6, 6),
      fee: 5 * rng.int(3, 10),
      rate: rng.int(8, 30),
    };
    if (p.k === 0 || p.x === 0 || p.b * p.k === p.k)
      reject("a non-zero intercept that differs from the slip");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const c = p.b * p.k;
        return A.standard({
          question: [
            "Where does the line ",
            A.math(`${p.a}x + ${p.b}y = ${c}`),
            " cross the y-axis?",
          ],
          ask: "Give the y-coordinate.",
          answer: A.number(p.k),
          wrong: signedWrongs(p.k, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(c),
              feedback: `On the y-axis x = 0, so ${p.b}y = ${c}: divide by ${p.b}.`,
            },
          ]),
          solution: [{ say: "", math: `x = 0: ${p.b}y = ${c} \\Rightarrow y = ${p.k}` }],
        });
      }
      case 2: {
        // y = m x − m·x0 crosses the x-axis at x0
        const c = -p.m * p.x;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Where does the line ",
                A.math(`y = ${p.m}x ${c < 0 ? "-" : "+"} ${Math.abs(c)}`),
                " cross the x-axis?",
              ],
              ask: "Give the x-coordinate.",
            },
          ],
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            {
              code: "ALG.LINE.M-C",
              value: A.number(-p.x),
              feedback: `On the x-axis y = 0: ${p.m}x = ${-c}.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `0 = ${p.m}x ${c < 0 ? "-" : "+"} ${Math.abs(c)} \\Rightarrow x = ${p.x}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "A taxi fare in pounds is ",
            A.math(`F = ${p.fee} + ${(p.rate / 10).toFixed(1)}d`),
            ` for d miles. Kai says the ${p.fee} is the cost of each mile.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${p.fee} is the intercept: the fare when d = 0, a fixed charge. The cost of each mile is the gradient, £${(p.rate / 10).toFixed(2)}.`,
              correct: true,
            },
            {
              text: "True. The first number in a formula is always the rate.",
              code: "ALG.LINE.M-C",
            },
            { text: "True. The bigger number must be the cost per mile.", code: "ALG.LINE.M-C" },
          ],
          solution: [{ say: "The intercept is the value when the variable is 0." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.k;
    if (question.key.depth === 2) return numberAnswer(question) === p.x;
    return true;
  },
});
