/**
 * @statement GF-N3.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N3.a: Use inverse operations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  k: number;
  s: number;
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GF-N3.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.INVERSE.WRONG-PAIR"],

  params(rng) {
    return {
      n: rng.int(2, 15),
      k: rng.int(2, 9),
      s: rng.int(1, 20),
      a: rng.int(3, 15),
      b: rng.int(2, 9),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const t = p.n * p.k - p.s;
        const order = t / p.k + p.s;
        return A.standard({
          question: [
            `I think of a number, multiply it by ${p.k}, then subtract ${p.s}. The answer is ${t}.`,
          ],
          ask: "What was my number?",
          answer: A.number(p.n),
          wrong: signedWrongs(p.n, [
            Number.isInteger(order)
              ? {
                  code: "NPV.INVERSE.WRONG-PAIR",
                  value: A.number(order),
                  feedback: `Undo the steps in reverse order: add ${p.s} first, then divide by ${p.k}.`,
                }
              : undefined,
            {
              code: "NPV.INVERSE.WRONG-PAIR",
              value: A.number(t * p.k + p.s),
              feedback: `The inverse of “multiply by ${p.k}” is “divide by ${p.k}”.`,
            },
          ]),
          solution: [{ say: "", math: `(${t} + ${p.s}) \\div ${p.k} = ${p.n}` }],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Find the missing number: ",
                A.math(`${p.a * p.b} \\div \\square = ${p.b}`),
              ],
            },
          ],
          answer: A.number(p.a),
          wrong: wrongs(p.a, [
            {
              code: "NPV.INVERSE.WRONG-PAIR",
              value: A.number(p.a * p.b * p.b),
              feedback: `From ${p.a * p.b} ÷ □ = ${p.b}, it follows that ${p.a * p.b} ÷ ${p.b} = □.`,
            },
          ]),
          solution: [{ say: "", math: `${p.a * p.b} \\div ${p.b} = ${p.a}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ivy says that because ",
            A.math(`${p.a * p.b} \\div ${p.a} = ${p.b}`),
            ", it follows that ",
            A.math(`${p.a * p.b} \\times ${p.b} = ${p.a}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. Dividing by ${p.a} is undone by multiplying by ${p.a}: ${p.b} × ${p.a} = ${p.a * p.b}.`,
              correct: true,
            },
            {
              text: "True. Multiplying is the inverse of dividing.",
              code: "NPV.INVERSE.WRONG-PAIR",
            },
            { text: "True. The three numbers make a fact family.", code: "NPV.INVERSE.WRONG-PAIR" },
          ],
          solution: [
            { say: "Check by working it out: the product is far bigger than " + p.a + "." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n;
    if (question.key.depth === 2) return numberAnswer(question) === p.a;
    return true;
  },
});
