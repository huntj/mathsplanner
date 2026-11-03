/**
 * @statement Y8-RAT-03.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-RAT-03.d: Calculate simple interest
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  principal: number;
  rate: number;
  years: number;
}

export default defineGenerator<Params>({
  id: "Y8-RAT-03.d",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.INTEREST.ONE-YEAR", "RAT.PERCENT.DIVIDE-BY-PERCENT"],

  params(rng) {
    return { principal: rng.int(2, 40) * 100, rate: rng.int(2, 9), years: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    const yearly = (p.principal * p.rate) / 100;
    switch (depth) {
      case 1:
        return A.standard({
          question: [`£${p.principal} is saved at ${p.rate}% simple interest per year.`],
          ask: "How much interest is earned each year, in pounds?",
          answer: A.number(yearly, { units: "£" }),
          wrong: wrongs(yearly, [
            {
              code: "RAT.PERCENT.DIVIDE-BY-PERCENT",
              value: A.number(Math.round((p.principal / p.rate) * 100) / 100, { units: "£" }),
              feedback: `${p.rate}% means ${p.rate} hundredths: × ${p.rate / 100}, not ÷ ${p.rate}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.principal} \\times ${p.rate / 100} = ${yearly}` }],
        });
      case 2: {
        const interest = yearly * p.years;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `£${p.principal} earns £${interest} of simple interest in ${p.years} years.`,
              ],
              ask: "What is the yearly interest rate, as a percentage?",
            },
          ],
          answer: A.number(p.rate, { units: "%" }),
          wrong: wrongs(p.rate, [
            {
              code: "RAT.INTEREST.ONE-YEAR",
              value: A.number(p.rate * p.years, { units: "%" }),
              feedback: `£${interest} is for ${p.years} years: divide by ${p.years} to find one year's interest first.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${interest} \\div ${p.years} = ${yearly}, \\; \\frac{${yearly}}{${p.principal}} \\times 100 = ${p.rate}\\%`,
            },
          ],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Ana says money invested at 10% simple interest per year doubles in 10 years.",
              ],
              truth: true,
              reasons: [
                {
                  text: "True. Each year adds 10% of the original amount, so after 10 years the interest is 100% of it.",
                  correct: true,
                },
                { text: "False. It doubles in 2 years.", code: "RAT.INTEREST.ONE-YEAR" },
                {
                  text: "False. Simple interest never doubles your money.",
                  code: "RAT.INTEREST.ONE-YEAR",
                },
              ],
              solution: [{ say: "10 years × 10% = 100%." }],
            }),
          [
            {
              statement:
                "£500 is invested at 4% simple interest per year. Ola says the interest after 3 years is £20.",
              truth: false,
              right: "False. £20 is one year's interest. After 3 years it is 3 × £20 = £60.",
              wrong: [
                ["True. 4% of £500 is £20.", "RAT.INTEREST.ONE-YEAR"],
                ["True. The interest is the same however long the money is left."],
              ],
            },
            {
              statement: "Sid says £200 at 5% simple interest per year earns £50 in 5 years.",
              truth: true,
              right: "True. 5% of £200 is £10 a year, and 5 × £10 = £50.",
              wrong: [
                [
                  "False. £200 ÷ 5 = £40 a year, so it earns £200.",
                  "RAT.PERCENT.DIVIDE-BY-PERCENT",
                ],
                ["False. It earns £10 in all.", "RAT.INTEREST.ONE-YEAR"],
              ],
            },
            {
              claim: "With simple interest, the interest earned each year is the same.",
              truth: "always",
              right:
                "Always. Simple interest is worked out on the amount first invested every year.",
              wrong: [
                ["Sometimes. It goes up as the total grows."],
                ["Never. Each year adds interest on the interest."],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.principal * p.rate) / 100;
    if (question.key.depth === 2) return numberAnswer(question) === p.rate;
    return true;
  },
});
