/**
 * @statement Y7-ALG-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-ALG-06: Solve simple linear equations in one unknown algebraically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  x: number;
}

export default defineGenerator<Params>({
  id: "Y7-ALG-06",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.WRONG-INVERSE"],

  params(rng, numbers) {
    const a = rng.int(2, numbers === "friendly" ? 5 : 12);
    const b = rng.int(1, 20) * (numbers === "stretch" && rng.bool() ? -1 : 1);
    const x = rng.int(numbers === "stretch" ? -9 : 1, 15);
    if (x === 0 || a === Math.abs(b)) reject("a non-zero solution");
    return { a, b, x };
  },

  build(p, depth, rng): QuestionDraft {
    const c = p.a * p.x + p.b;
    const sign = p.b < 0 ? "-" : "+";
    const eq = `${p.a}x ${sign} ${Math.abs(p.b)} = ${c}`;
    const slip = (c + p.b) / p.a;
    const how = `${p.b < 0 ? "Add" : "Subtract"} ${Math.abs(p.b)} from both sides: ${p.a}x = ${c - p.b}. Divide both sides by ${p.a}: x = ${p.x}.`;
    const wrong = wrongs(p.x, [
      Number.isInteger(slip) && slip > 0
        ? {
            code: "ALG.SOLVE.WRONG-INVERSE",
            value: A.number(slip),
            feedback: `To undo ${sign} ${Math.abs(p.b)}, ${p.b < 0 ? "add" : "subtract"} ${Math.abs(p.b)}.`,
          }
        : undefined,
    ]);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Solve ", A.math(eq), "."],
          answer: A.number(p.x),
          wrong,
          solution: [{ say: how }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: `I think of a number, multiply it by ${p.a} and ${p.b < 0 ? `subtract ${-p.b}` : `add ${p.b}`}. The answer is ${c}.`,
              ask: "What was my number?",
            },
            { question: ["Find the value of x that makes ", A.math(eq), " true."] },
          ],
          answer: A.number(p.x),
          wrong,
          solution: [{ say: how }],
        });
      default: {
        const bad = c + p.b;
        return A.spotTheMistake({
          question: ["Tom solves ", A.math(eq), "."],
          lines: [
            [A.math(`${p.a}x = ${c} ${p.b < 0 ? "-" : "+"} ${Math.abs(p.b)}`)],
            [A.math(`${p.a}x = ${bad}`)],
            [A.math(`x = ${Number((bad / p.a).toFixed(3))}`)],
          ],
          mistake: 0,
          code: "ALG.SOLVE.WRONG-INVERSE",
          feedback: `Line 1 should ${p.b < 0 ? "add" : "subtract"} ${Math.abs(p.b)}: ${p.a}x = ${c - p.b}, so x = ${p.x}.`,
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "spot-the-mistake") return true;
    return numberAnswer(question) === p.x;
  },
});
