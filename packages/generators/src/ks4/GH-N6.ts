/**
 * @statement GH-N6
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-N6: Estimate powers and roots of any positive number
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** Depth 1: a non-square close to k². */
  square: number;
  /** Depth 2: a non-cube between two cubes. */
  cube: number;
  /** Depth 4: a decimal just below a whole number, raised to a power. */
  base: number;
  power: number;
}

export default defineGenerator<Params>({
  id: "GH-N6",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.POWER.ROOT-HALF", "NPV.POWER.TIMES-INDEX"],

  params(rng) {
    const k = rng.int(5, 15);
    const square = k * k + rng.pick([-3, -2, -1, 1, 2, 3]);
    const c = rng.int(2, 6);
    const cube = rng.int(c ** 3 + 2, (c + 1) ** 3 - 2);
    // √ of the square must round clearly to k, and the halving trap must be a different option.
    if (Math.abs(Math.sqrt(square) - k) > 0.3 || Math.round(square / 2) <= k + 1)
      reject("a clear nearest whole number");
    if (Math.abs(Math.floor(cube / 3) - c) <= 2) reject("a third of the cube away from the root");
    return { square, cube, base: rng.int(2, 5) - 0.1, power: rng.int(3, 4) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const k = Math.round(Math.sqrt(p.square));
        const near = Math.sqrt(p.square) > k ? k + 1 : k - 1;
        return A.choice({
          rng,
          question: [
            "Without a calculator, choose the best estimate of ",
            A.math(`\\sqrt{${p.square}}`),
            ".",
          ],
          correct: A.math(String(k)),
          distractors: [
            {
              content: A.math(String(Math.round(p.square / 2))),
              code: "NPV.POWER.ROOT-HALF",
              feedback:
                "A square root is the number that multiplies by itself to give the number, not half of it.",
            },
            {
              content: A.math(String(near)),
              feedback: `${near}² = ${near * near}, which is further from ${p.square} than ${k}² = ${k * k}.`,
            },
            {
              content: A.math(String(p.square * p.square)),
              feedback: "That squares the number instead of taking its square root.",
            },
          ],
          solution: [
            {
              say: `${k}² = ${k * k} is the closest square number to ${p.square}, so √${p.square} ≈ ${k}.`,
            },
          ],
        });
      }
      case 2: {
        const c = Math.floor(Math.cbrt(p.cube) + 1e-9);
        const third = Math.floor(p.cube / 3);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Between which two consecutive whole numbers does ",
            A.math(`\\sqrt[3]{${p.cube}}`),
            " lie?",
          ],
          correct: `${c} and ${c + 1}`,
          distractors: [
            {
              content: `${third} and ${third + 1}`,
              code: "NPV.POWER.ROOT-HALF",
              feedback: "A cube root is not a third of the number: find the cubes either side.",
            },
            {
              content: `${c + 1} and ${c + 2}`,
              feedback: `${c + 1}³ = ${(c + 1) ** 3}, which is already bigger than ${p.cube}.`,
            },
            {
              content: `${c - 1} and ${c}`,
              feedback: `${c}³ = ${c ** 3}, which is less than ${p.cube}, so the root is more than ${c}.`,
            },
          ],
          solution: [
            {
              say: `${c}³ = ${c ** 3} and ${c + 1}³ = ${(c + 1) ** 3}, and ${p.cube} lies between them.`,
            },
          ],
        });
      }
      default: {
        const whole = Math.round(p.base);
        const est = whole ** p.power;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben estimates ",
            A.math(`${p.base}^{${p.power}}`),
            ` by working out ${whole}^${p.power} = ${est}. He says the exact answer is a little more than ${est}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${p.base} is less than ${whole}, so ${p.base} to the power ${p.power} is less than ${est}.`,
              correct: true,
            },
            { text: "True. Rounding always makes an estimate too small." },
            {
              text: `False. ${whole}^${p.power} = ${whole * p.power}, so the estimate is wrong.`,
              code: "NPV.POWER.TIMES-INDEX",
            },
          ],
          solution: [
            { say: `Rounding ${p.base} up to ${whole} makes the estimate an overestimate.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 2)
      return chosenText(question).startsWith(`${Math.floor(Math.cbrt(p.cube) + 1e-9)} and`);
    return true;
  },
});
