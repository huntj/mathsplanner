/**
 * @statement GF-N1.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N1.a: Order positive and negative integers, decimals and fractions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  x: number;
  y: number;
  z: number;
  p: number;
  k: number;
  j: number;
}

export default defineGenerator<Params>({
  id: "GF-N1.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.NEGATIVE.ORDER", "NPV.DECIMAL.LONGER-BIGGER"],

  params(rng) {
    const x = rng.int(4, 12);
    return {
      x,
      y: rng.int(1, x - 1),
      z: rng.int(1, 9),
      p: rng.int(3, 8),
      k: rng.int(1, 9),
      j: rng.int(1, 9),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: ["Which number is the smallest?"],
          correct: A.math(`-${p.x}`),
          distractors: [
            {
              content: A.math(`-${p.y}`),
              code: "NPV.NEGATIVE.ORDER",
              feedback: `−${p.x} is further below zero than −${p.y}, so it is smaller.`,
            },
            {
              content: A.math(String(p.z)),
              feedback: "Every positive number is bigger than every negative number.",
            },
          ],
          solution: [{ say: "", math: `-${p.x} < -${p.y} < ${p.z}` }],
        });
      case 2: {
        const big = `0.${p.p}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which number is the largest?"],
          correct: A.math(big),
          distractors: [`0.${p.p - 1}${p.k}${p.j}`, `0.${p.p - 1}${p.k}`].map((d) => ({
            content: A.math(d),
            code: "NPV.DECIMAL.LONGER-BIGGER",
            feedback: `Compare the tenths first: ${p.p} tenths is more than ${p.p - 1} tenths, whatever comes after.`,
          })),
          solution: [
            { say: `Write them with the same number of places: ${big}00 is the largest.` },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ana says ",
            A.math(`-${p.x} > -${p.y}`),
            ` because ${p.x} is bigger than ${p.y}.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. −${p.x} is further left on the number line, so −${p.x} < −${p.y}.`,
              correct: true,
            },
            {
              text: "True. The number with the bigger digit is bigger.",
              code: "NPV.NEGATIVE.ORDER",
            },
            {
              text: "True. Negative numbers are ordered the same way as positive ones.",
              code: "NPV.NEGATIVE.ORDER",
            },
          ],
          solution: [
            { say: "For negative numbers, the further from zero, the smaller the number." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `-${p.x}`;
    if (question.key.depth === 2) return chosenText(question) === `0.${p.p}`;
    return true;
  },
});
