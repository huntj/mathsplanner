/**
 * @statement Y7-ALG-05.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-ALG-05.b: Generate terms from a position-to-term rule
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  n: number;
  t: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-05.b",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.POSITION-RULE", "ALG.SOLVE.WRONG-INVERSE"],

  params(rng) {
    return { a: rng.int(2, 9), b: rng.int(-6, 9), n: rng.int(8, 30), t: rng.int(5, 25) };
  },

  build(p, depth, rng): QuestionDraft {
    const rule = linear([
      [p.a, "n"],
      [p.b, ""],
    ]);
    switch (depth) {
      case 1: {
        const v = p.a * p.n + p.b;
        return A.standard({
          question: ["The nth term of a sequence is ", A.math(rule), "."],
          ask: `Find the ${p.n}th term.`,
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.number(p.a + p.b + p.n * p.a),
              feedback: `Substitute n = ${p.n} straight into the rule; do not count on from the first term.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.a} \\times ${p.n} ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const value = p.a * p.t + p.b;
        const slip = value / p.a;
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["The nth term of a sequence is ", A.math(rule), "."],
              ask: `Which term has the value ${value}?`,
            },
          ],
          answer: A.number(p.t),
          wrong: wrongs(p.t, [
            Number.isInteger(slip)
              ? {
                  code: "ALG.SOLVE.WRONG-INVERSE",
                  value: A.number(slip),
                  feedback: `Solve ${rule} = ${value}: undo the ${p.b < 0 ? "subtraction" : "addition"} first, then divide by ${p.a}.`,
                }
              : undefined,
          ]),
          solution: [{ say: "", math: `${rule} = ${value} \\Rightarrow n = ${p.t}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Eva says the sequence with nth term ",
                A.math(rule),
                ` goes up in ${Math.abs(p.b) || 1}s.`,
              ],
              truth: p.a === (Math.abs(p.b) || 1),
              reasons:
                p.a === (Math.abs(p.b) || 1)
                  ? [
                      {
                        text: `True, but only because the number with n is ${p.a}. The terms go up by the number in front of n.`,
                        correct: true,
                      },
                      {
                        text: "False. The constant term never matters.",
                        code: "ALG.SEQUENCE.POSITION-RULE",
                      },
                      {
                        text: "False. It goes up in 1s, like n does.",
                        code: "ALG.SEQUENCE.POSITION-RULE",
                      },
                    ]
                  : [
                      {
                        text: `False. Each time n goes up by 1, ${p.a}n goes up by ${p.a}, so the terms go up in ${p.a}s.`,
                        correct: true,
                      },
                      {
                        text: "True. The number on its own is the difference.",
                        code: "ALG.SEQUENCE.POSITION-RULE",
                      },
                      {
                        text: "True. It goes up by the first term each time.",
                        code: "ALG.SEQUENCE.POSITION-RULE",
                      },
                    ],
              solution: [{ say: "", math: [1, 2, 3, 4].map((n) => p.a * n + p.b).join(", ") }],
            }),
          [
            {
              statement: `Mo says the 10th term of the sequence with nth term $${rule}$ is ${10 * p.a + p.b}.`,
              truth: true,
              right: `True. Put n = 10 into the rule: ${p.a} × 10 ${p.b < 0 ? "−" : "+"} ${Math.abs(p.b)} = ${10 * p.a + p.b}.`,
              wrong: [
                [
                  "False. Use the rule 10 times over, from the first term.",
                  "ALG.SEQUENCE.POSITION-RULE",
                ],
                [`False. It is ${p.a + p.b + 10}.`],
              ],
            },
            {
              claim:
                "Each term of the sequence with nth term $3n + 1$ is one more than a multiple of 3.",
              truth: "always",
              right: "Always. 3n is a multiple of 3, and each term adds 1 to it.",
              wrong: [
                ["Sometimes. Only the first few terms.", "ALG.SEQUENCE.POSITION-RULE"],
                ["Never. The terms are multiples of 3.", "ALG.SEQUENCE.POSITION-RULE"],
              ],
            },
            {
              statement: `Ana says ${2 * p.n + 1} is a term of the sequence with nth term $2n$.`,
              truth: false,
              right: `False. Every term of 2n is even, and ${2 * p.n + 1} is odd.`,
              wrong: [
                ["True. Any number can be a term of a sequence.", "ALG.SEQUENCE.POSITION-RULE"],
                [`True. It is the ${2 * p.n + 1}th term.`, "ALG.SEQUENCE.POSITION-RULE"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a * p.n + p.b;
    if (question.key.depth === 2) return numberAnswer(question) === p.t;
    return true;
  },
});
