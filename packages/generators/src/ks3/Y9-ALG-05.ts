/**
 * @statement Y9-ALG-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-ALG-05: Reduce a given linear equation in two variables to the standard form y = mx + c; calculate
// and interpret gradients and intercepts graphically and algebraically
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { numberAnswer } from "../shared/counting.ts";
import { poly, signedWrongs } from "../shared/alg.ts";

interface Params {
  /** k·y + a·x = k·c', i.e. y = −(a/k)x + c with integer m. */
  k: number;
  m: number;
  c: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.LINE.M-C", "ALG.SOLVE.WRONG-INVERSE"],

  params(rng, numbers) {
    const k = rng.int(2, numbers === "friendly" ? 3 : 6);
    const m = rng.int(1, 6) * rng.pick([1, -1]);
    const c = rng.int(1, 9) * rng.pick([1, -1]);
    if (Math.abs(m) === Math.abs(c) || Math.abs(m * k) === Math.abs(c * k) || m * k === c)
      reject("numbers that tell the slips apart");
    return { k, m, c, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    // ky − (km)x = kc, written with the x term on the left.
    const eq = `${p.k}y ${p.m > 0 ? "-" : "+"} ${Math.abs(p.k * p.m)}x = ${p.k * p.c}`;
    const how = `Add ${p.k * p.m}x to both sides: ${p.k}y = ${poly([p.k * p.m, p.k * p.c])}. Divide everything by ${p.k}: y = ${poly([p.m, p.c])}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["A line has equation ", A.math(eq), "."],
          ask: "What is its gradient?",
          answer: A.number(p.m),
          wrong: signedWrongs(p.m, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(p.k * p.m),
              feedback: `Divide the x term by ${p.k} too: y = ${poly([p.m, p.c])}.`,
            },
            {
              code: "ALG.LINE.M-C",
              value: A.number(p.c),
              feedback:
                "The gradient is the number in front of x once the equation is in the form y = mx + c.",
            },
          ]),
          solution: [{ say: how }],
        });
      case 2:
        return A.standard({
          question: ["A line has equation ", A.math(eq), "."],
          ask: "Where does it cross the y-axis? Give the y-coordinate.",
          answer: A.number(p.c),
          wrong: signedWrongs(p.c, [
            {
              code: "ALG.SOLVE.WRONG-INVERSE",
              value: A.number(p.k * p.c),
              feedback: `Divide by ${p.k}: the intercept is ${p.k * p.c} ÷ ${p.k}.`,
            },
            {
              code: "ALG.LINE.M-C",
              value: A.number(p.m),
              feedback: "That is the gradient. The intercept is the constant, c.",
            },
          ]),
          solution: [{ say: `${how} It crosses the y-axis at ${p.c}.` }],
        });
      default: {
        const form = `y = ${p.c} ${p.m < 0 ? "-" : "+"} ${Math.abs(p.m)}x`;
        const said = p.claimTrue ? p.m : p.c;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Nia says the gradient of ", A.math(form), ` is ${said}.`],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. The gradient is the coefficient of x, wherever it is written: ${p.m}.`,
                  correct: true,
                },
                { text: `False. The first number, ${p.c}, is the gradient.`, code: "ALG.LINE.M-C" },
                { text: "False. You cannot tell without drawing the line." },
              ]
            : [
                {
                  text: `False. Rearranged, it is y = ${poly([p.m, p.c])}: the gradient is ${p.m} and ${p.c} is the intercept.`,
                  correct: true,
                },
                { text: "True. The first number after = is the gradient.", code: "ALG.LINE.M-C" },
                { text: "True. The gradient is always the biggest number." },
              ],
          solution: [
            { say: `${form} is y = ${poly([p.m, p.c])}: gradient ${p.m}, intercept ${p.c}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    return numberAnswer(question) === (question.key.depth === 1 ? p.m : p.c);
  },
});
