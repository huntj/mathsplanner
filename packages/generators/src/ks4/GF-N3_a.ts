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
import { orClaims } from "../shared/variety.ts";

interface Params {
  n: number;
  k: number;
  s: number;
  a: number;
  b: number;
}

export default defineGenerator<Params>({
  id: "GF-N3.a",
  version: "1.1.0",
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
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
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
                {
                  text: "True. The three numbers make a fact family.",
                  code: "NPV.INVERSE.WRONG-PAIR",
                },
              ],
              solution: [
                { say: "Check by working it out: the product is far bigger than " + p.a + "." },
              ],
            }),
          [
            {
              statement:
                "Kim says that because $12 \\times 7 = 84$, it follows that $84 \\div 7 = 12$.",
              truth: true,
              right: "True. Division undoes multiplication.",
              wrong: [
                ["False. It gives 84 ÷ 12 = 84.", "NPV.INVERSE.WRONG-PAIR"],
                ["False. You cannot work back."],
              ],
            },
            {
              claim: "$a - b = b - a$ for any two numbers a and b.",
              truth: "sometimes",
              right: "Sometimes. Only when a = b; otherwise the answers have opposite signs.",
              wrong: [
                ["Always. Order does not matter.", "NPV.INVERSE.WRONG-PAIR"],
                ["Never. Even when a = b."],
              ],
            },
            {
              statement: "Sol says that because $56 - 19 = 37$, it follows that $56 + 37 = 19$.",
              truth: false,
              right: "False. The inverse is 37 + 19 = 56.",
              wrong: [
                ["True. Swap the minus for a plus.", "NPV.INVERSE.WRONG-PAIR"],
                ["True. Adding undoes subtracting."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.n;
    if (question.key.depth === 2) return numberAnswer(question) === p.a;
    return true;
  },
});
