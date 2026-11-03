/**
 * @statement Y6-FR-08
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-08: Multiply one-digit numbers with up to two decimal places by whole numbers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  /** The decimal is m hundredths (or tenths when dp is 1), with one digit before the point. */
  m: number;
  dp: number;
  k: number;
}

const exactly = (m: number, e: number) => Number(`${m}e${e}`);

export default defineGenerator<Params>({
  id: "Y6-FR-08",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.DECIMAL.POINT-PLACE"],

  params(rng, numbers) {
    const dp = numbers === "friendly" ? 1 : rng.int(1, 2);
    const m = rng.int(10 ** dp + 1, 10 ** (dp + 1) - 1);
    const k = rng.int(2, numbers === "stretch" ? 12 : 9);
    if (m % 10 === 0) reject("every decimal place used");
    return { m, dp, k };
  },

  build(p, depth, rng): QuestionDraft {
    const x = exactly(p.m, -p.dp);
    const product = p.m * p.k;
    const answer = exactly(product, -p.dp);
    const how = `Work out ${p.m} × ${p.k} = ${product}. ${x} has ${p.dp} decimal place${p.dp === 1 ? "" : "s"}, so the answer does too: ${answer}. Check: ${Math.round(x)} × ${p.k} = ${Math.round(x) * p.k}, which is close.`;
    const wrong = wrongs(answer, [
      {
        code: "NPV.DECIMAL.POINT-PLACE",
        value: A.number(exactly(product, -p.dp - 1)),
        feedback: "Estimate first: the answer should be close to " + Math.round(x) * p.k + ".",
      },
      {
        code: "NPV.DECIMAL.POINT-PLACE",
        value: A.number(exactly(product, 1 - p.dp)),
        feedback: `${x} has ${p.dp} decimal place${p.dp === 1 ? "" : "s"}, so the answer has ${p.dp} too.`,
      },
    ]);
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.math(`${x} \\times ${p.k}`)],
          ask: "Work it out.",
          answer: A.number(answer),
          wrong,
          solution: [{ say: how }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: `A ticket costs £${x.toFixed(2)}. Sam buys ${p.k} tickets.`,
              ask: "How much does Sam pay, in pounds?",
            },
            {
              question: `A plank is ${x} m long. ${p.k} planks are laid end to end.`,
              ask: "How long is the row, in metres?",
            },
          ],
          answer: A.number(answer),
          wrong,
          solution: [{ say: how }],
        });
      default: {
        const shown = exactly(product, -p.dp - 1);
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Ivy says ",
                A.math(`${x} \\times ${p.k} = ${shown}`),
                ", because the answer needs one more decimal place.",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. Multiplying by a whole number does not add decimal places. ${how}`,
                  correct: true,
                },
                {
                  text: "True. Multiplying a decimal always adds a decimal place.",
                  code: "NPV.DECIMAL.POINT-PLACE",
                },
                { text: "True. Decimals always get smaller when you multiply them." },
              ],
              solution: [{ say: how }],
            }),
          [
            {
              statement: "Sam says $1.25 \\times 4 = 5$.",
              truth: true,
              right: "True. 125 × 4 = 500, and with two decimal places that is 5.00 = 5.",
              wrong: [
                ["False. It is 0.5.", "NPV.DECIMAL.POINT-PLACE"],
                ["False. It is 4.100, as 1 × 4 = 4 and 25 × 4 = 100."],
              ],
            },
            {
              statement: "Ana works out $0.3 \\times 6 = 0.18$.",
              truth: false,
              right: "False. 3 tenths times 6 is 18 tenths, which is 1.8.",
              wrong: [
                ["True. 3 × 6 = 18, and the answer starts with 0.", "NPV.DECIMAL.POINT-PLACE"],
                ["True. Multiplying a decimal gives a smaller number."],
              ],
            },
            {
              claim: "Multiplying a decimal by a whole number bigger than 1 makes it bigger.",
              truth: "always",
              right: "Always, for a positive decimal. Several lots of it are more than one lot.",
              wrong: [
                ["Never. Decimals get smaller when multiplied.", "NPV.DECIMAL.POINT-PLACE"],
                ["Sometimes. Only if the decimal is more than 1."],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 4) return true;
    return Math.abs(numberAnswer(question) - (p.m * p.k) / 10 ** p.dp) < 1e-9;
  },
});
