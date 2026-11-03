/**
 * @statement Y9-ALG-05.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-05.a: Rearrange a linear equation to y = mx + c
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { lineLatex, linear, signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  b: number;
  m: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-05.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.BOTH-SIDES", "ALG.LINE.M-C"],

  params(rng) {
    const p = { b: rng.int(2, 5), m: rng.int(1, 4) * rng.pick([1, -1]), c: rng.int(-6, 6) };
    if (p.c === 0 || p.m === p.c) reject("a non-zero intercept that differs from m");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    // b·y = b·m·x + b·c, written as  −(b·m)x + b·y = b·c
    const a = -p.b * p.m;
    const eq = `${linear([
      [a, "x"],
      [p.b, "y"],
    ])} = ${p.b * p.c}`;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Find the gradient of the line ", A.math(eq), "."],
          answer: A.number(p.m),
          wrong: signedWrongs(p.m, [
            {
              code: "ALG.SOLVE.BOTH-SIDES",
              value: A.number(-p.m),
              feedback: `Move the x term across and change its sign: ${p.b}y = ${linear([
                [p.b * p.m, "x"],
                [p.b * p.c, ""],
              ])}.`,
            },
          ]),
          solution: [{ say: "", math: `y = ${lineLatex(p.m, p.c).slice(4)}` }],
        });
      case 2: {
        const right = lineLatex(p.m, p.c);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Rearrange ", A.math(eq), " into the form ", A.math("y = mx + c"), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(lineLatex(-p.m, p.c)),
              code: "ALG.SOLVE.BOTH-SIDES",
              feedback: "When a term moves across the equals sign, its sign changes.",
            },
            {
              content: A.math(lineLatex(p.b * p.m, p.c)),
              code: "ALG.LINE.M-C",
              feedback: `Divide every term by ${p.b}, including the x term.`,
            },
          ].filter(distinctFrom(A.math(right))),
          solution: [{ say: "", math: right }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Ola says the line ",
                A.math(
                  `${p.b}y = ${linear([
                    [p.b * p.m, "x"],
                    [p.b * p.c, ""],
                  ])}`,
                ),
                ` has gradient ${p.b * p.m}.`,
              ],
              truth: false,
              reasons: [
                {
                  text: `False. The gradient is the number with x when y is on its own: divide by ${p.b} to get y = ${linear(
                    [
                      [p.m, "x"],
                      [p.c, ""],
                    ],
                  )}, so m = ${p.m}.`,
                  correct: true,
                },
                { text: "True. The gradient is always the number with x.", code: "ALG.LINE.M-C" },
                { text: `False. The gradient is ${p.b * p.c}.`, code: "ALG.LINE.M-C" },
              ],
              solution: [{ say: "Make y the subject first." }],
            }),
          [
            {
              statement: "Zak rearranges $2y = 6x + 4$ to $y = 3x + 2$.",
              truth: true,
              right: "True. Divide every term by 2.",
              wrong: [
                ["False. It is y = 3x + 4; only the x term is halved.", "ALG.SOLVE.BOTH-SIDES"],
                ["False. It is y = 6x + 2."],
              ],
            },
            {
              statement: "Tia says the gradient of $y + 2x = 5$ is 2.",
              truth: false,
              right: "False. Rearranged it is y = −2x + 5, so the gradient is −2.",
              wrong: [
                ["True. The number in front of x is the gradient.", "ALG.LINE.M-C"],
                ["True. Take 2x from one side only.", "ALG.SOLVE.BOTH-SIDES"],
              ],
            },
            {
              claim:
                "Rearranging an equation into the form y = mx + c changes the line it describes.",
              truth: "never",
              right:
                "Never. Doing the same to both sides keeps the same points, so it is the same line.",
              wrong: [
                ["Always. A new equation means a new line."],
                ["Sometimes. When you divide, the line moves.", "ALG.SOLVE.BOTH-SIDES"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.m;
    if (question.key.depth === 2) return chosenText(question) === lineLatex(p.m, p.c);
    return true;
  },
});
