/**
 * @statement GF-A7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A7: Where appropriate, interpret simple expressions as functions with inputs and outputs
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  input: number;
  out: number;
}

export default defineGenerator<Params>({
  id: "GF-A7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FUNCTION.ORDER"],

  params(rng) {
    const a = rng.int(2, 9);
    const b = rng.int(1, 15);
    return { a, b, input: rng.int(-6, 12), out: a * rng.int(1, 12) - b };
  },

  build(p, depth, rng): QuestionDraft {
    const machine = `\\text{input} \\rightarrow \\boxed{\\times ${p.a}} \\rightarrow \\boxed{- ${p.b}} \\rightarrow \\text{output}`;
    switch (depth) {
      case 1: {
        const y = p.a * p.input - p.b;
        return A.standard({
          question: ["Here is a function machine.", A.displayMath(machine)],
          ask: `What is the output when the input is ${p.input}?`,
          answer: A.number(y),
          wrong: signedWrongs(y, [
            {
              code: "ALG.FUNCTION.ORDER",
              value: A.number(p.a * (p.input - p.b)),
              feedback: `Do the steps in order: × ${p.a} first, then − ${p.b}.`,
            },
          ]),
          solution: [{ say: `${p.input} × ${p.a} = ${p.a * p.input}, − ${p.b} = ${y}.` }],
        });
      }
      case 2: {
        const x = (p.out + p.b) / p.a;
        return A.reverse({
          question: ["Here is a function machine.", A.displayMath(machine)],
          ask: `The output is ${p.out}. What was the input?`,
          answer: A.number(x),
          wrong: signedWrongs(x, [
            {
              code: "ALG.FUNCTION.ORDER",
              value: A.number(Math.round((p.out / p.a + p.b) * 100) / 100),
              feedback:
                "Work backwards: undo the last step first (+ " + p.b + "), then ÷ " + p.a + ".",
            },
          ]),
          solution: [{ say: `Backwards: ${p.out} + ${p.b} = ${p.out + p.b}, ÷ ${p.a} = ${x}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Tom says the function machine ",
            A.math(machine),
            " gives the same output as ",
            A.math(`y = ${p.a}(x - ${p.b})`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The machine multiplies first, so it is y = ${p.a}x − ${p.b}. ${p.a}(x − ${p.b}) subtracts first, giving ${p.a}x − ${p.a * p.b}.`,
              correct: true,
            },
            {
              text: "True. The same two operations give the same result in any order.",
              code: "ALG.FUNCTION.ORDER",
            },
            { text: "True. Brackets do not change the answer.", code: "ALG.FUNCTION.ORDER" },
          ],
          solution: [
            {
              say: `Try x = 10: the machine gives ${10 * p.a - p.b}; ${p.a}(10 − ${p.b}) = ${p.a * (10 - p.b)}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) === p.a * p.input - p.b;
    if (question.archetype === "reverse") return numberAnswer(question) * p.a - p.b === p.out;
    return true;
  },
});
