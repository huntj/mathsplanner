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

interface Params {
  b: number;
  m: number;
  c: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-05.a",
  version: "1.0.0",
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
        return A.trueOrFalseWhy({
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
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.m;
    if (question.key.depth === 2) return chosenText(question) === lineLatex(p.m, p.c);
    return true;
  },
});
