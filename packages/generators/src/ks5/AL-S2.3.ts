/**
 * @statement AL-S2.3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// AL-S2.3: Interpret measures of central tendency and variation, including variance and standard
// deviation from raw data and summary statistics
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  data: number[];
  shift: number;
  k: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "AL-S2.3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["STA.VARIANCE.FORMULA"],

  params(rng) {
    const data = Array.from({ length: rng.int(6, 9) }, () => rng.int(2, 20));
    if (new Set(data).size < 4) reject("varied data");
    return { data, shift: rng.int(3, 10), k: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.data.length;
    const sx = p.data.reduce((s, x) => s + x, 0);
    const sxx = p.data.reduce((s, x) => s + x * x, 0);
    const variance = sxx / n - (sx / n) ** 2;
    const sd = r2(Math.sqrt(variance));
    switch (depth) {
      case 1:
        return A.standard({
          question: `For ${n} values, Σx = ${sx} and Σx² = ${sxx}.`,
          ask: "Find the standard deviation, to 2 decimal places.",
          answer: A.number(sd, { accuracy: { dp: 2 } }),
          wrong: wrongs(sd, [
            {
              code: "STA.VARIANCE.FORMULA",
              value: A.number(r2(variance), { accuracy: { dp: 2 } }),
              feedback: "That is the variance; take its square root for the standard deviation.",
            },
            {
              code: "STA.VARIANCE.FORMULA",
              value: A.number(r2(Math.sqrt(sxx / n)), { accuracy: { dp: 2 } }),
              feedback: "Subtract the square of the mean: σ² = Σx²/n − x̄².",
            },
          ]),
          solution: [
            {
              say: "",
              math: `\\sigma^2 = \\frac{${sxx}}{${n}} - \\left(\\frac{${sx}}{${n}}\\right)^2 = ${r2(variance)},\\quad \\sigma = ${sd}`,
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `A data set has mean ${r2(sx / n)} and standard deviation ${sd}. Every value is increased by ${p.shift}.`,
          ask: "What are the new mean and standard deviation?",
          correct: `Mean ${r2(sx / n + p.shift)}, standard deviation ${sd}`,
          distractors: [
            {
              content: `Mean ${r2(sx / n + p.shift)}, standard deviation ${r2(sd + p.shift)}`,
              code: "STA.VARIANCE.FORMULA",
              feedback:
                "Adding the same amount to every value moves the data but does not change its spread.",
            },
            {
              content: `Mean ${r2(sx / n)}, standard deviation ${sd}`,
              code: "STA.VARIANCE.FORMULA",
              feedback: `The mean increases by ${p.shift} too.`,
            },
          ],
          solution: [
            {
              say: "Adding a constant shifts the mean by that constant and leaves the standard deviation unchanged.",
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `Every value in a data set is multiplied by ${p.k}. Jo says the standard deviation is multiplied by ${p.k * p.k}.`,
          truth: false,
          reasons: [
            {
              text: `False. The variance is multiplied by ${p.k * p.k}, so the standard deviation (its square root) is multiplied by ${p.k}.`,
              correct: true,
            },
            { text: "True. Standard deviation involves squares.", code: "STA.VARIANCE.FORMULA" },
            { text: "False. It does not change.", code: "STA.VARIANCE.FORMULA" },
          ],
          solution: [
            {
              say: `Distances from the mean are all multiplied by ${p.k}, so the standard deviation is too.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    const n = p.data.length;
    const sx = p.data.reduce((s, x) => s + x, 0);
    const sxx = p.data.reduce((s, x) => s + x * x, 0);
    if (question.key.depth === 1)
      return numberAnswer(question) === r2(Math.sqrt(sxx / n - (sx / n) ** 2));
    if (question.key.depth === 2)
      return chosenText(question).endsWith(
        `standard deviation ${r2(Math.sqrt(sxx / n - (sx / n) ** 2))}`,
      );
    return true;
  },
});
