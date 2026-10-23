/**
 * @statement AL-P2.8.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the KS5 sub-statements
 */
// AL-P2.8.b: Form composite functions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** f(x) = mx + c, g(x) = x² + k. */
  m: number;
  c: number;
  k: number;
  x: number;
}

export default defineGenerator<Params>({
  id: "AL-P2.8.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.FUNCTION.ORDER"],

  params(rng) {
    const p = { m: rng.int(2, 5), c: rng.int(-6, 6), k: rng.int(-5, 5), x: rng.int(-3, 4) };
    const fg = p.m * (p.x * p.x + p.k) + p.c;
    const gf = (p.m * p.x + p.c) ** 2 + p.k;
    if (p.c === 0 || p.k === 0 || fg === gf) reject("fg and gf differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const f = `f(x) = ${p.m}x ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)}`;
    const g = `g(x) = x^2 ${p.k < 0 ? "-" : "+"} ${Math.abs(p.k)}`;
    const fg = p.m * (p.x * p.x + p.k) + p.c;
    const gf = (p.m * p.x + p.c) ** 2 + p.k;
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.math(f), " and ", A.math(g), "."],
          ask: ["Work out ", A.math(`fg(${p.x})`), "."],
          answer: A.number(fg),
          wrong: signedWrongs(fg, [
            {
              code: "ALG.FUNCTION.ORDER",
              value: A.number(gf),
              feedback: `fg(x) means f(g(x)): apply g first, then f.`,
            },
          ]),
          solution: [
            { say: "", math: `g(${p.x}) = ${p.x * p.x + p.k},\\ f(${p.x * p.x + p.k}) = ${fg}` },
          ],
        });
      case 2: {
        const right = `${p.m}x^2 ${p.m * p.k + p.c < 0 ? "-" : "+"} ${Math.abs(p.m * p.k + p.c)}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [A.math(f), " and ", A.math(g), "."],
          ask: ["Find ", A.math("fg(x)"), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(
                `(${p.m}x ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)})^2 ${p.k < 0 ? "-" : "+"} ${Math.abs(p.k)}`,
              ),
              code: "ALG.FUNCTION.ORDER",
              feedback: "That is gf(x). For fg(x), put g(x) into f.",
            },
            {
              content: A.math(`${p.m}x^2 ${p.k + p.c < 0 ? "-" : "+"} ${Math.abs(p.k + p.c)}`),
              feedback: `Multiply all of g(x) by ${p.m}: ${p.m}(x² ${p.k < 0 ? "−" : "+"} ${Math.abs(p.k)}).`,
            },
          ],
          solution: [
            {
              say: "",
              math: `fg(x) = ${p.m}(x^2 ${p.k < 0 ? "-" : "+"} ${Math.abs(p.k)}) ${p.c < 0 ? "-" : "+"} ${Math.abs(p.c)} = ${right}`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "For ",
            A.math(f),
            " and ",
            A.math(g),
            ", Sam says ",
            A.math(`fg(${p.x}) = gf(${p.x})`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. fg(${p.x}) = ${fg} but gf(${p.x}) = ${gf}. The order matters.`,
              correct: true,
            },
            {
              text: "True. Composite functions can be done in either order.",
              code: "ALG.FUNCTION.ORDER",
            },
            { text: "True. Both use the same two functions.", code: "ALG.FUNCTION.ORDER" },
          ],
          solution: [{ say: `fg(${p.x}) = ${fg}, gf(${p.x}) = ${gf}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.m * (p.x * p.x + p.k) + p.c;
    if (question.key.depth === 2)
      return chosenText(question).includes(`${p.m}x^2`) && !chosenText(question).includes("(");
    return true;
  },
});
