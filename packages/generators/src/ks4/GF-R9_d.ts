/**
 * @statement GF-R9.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R9.d: Calculate simple interest
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  principal: number;
  rate: number;
  years: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "GF-R9.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.INTEREST.ONE-YEAR"],

  params(rng) {
    return { principal: rng.int(4, 60) * 50, rate: rng.int(2, 8), years: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    const yearly = r2((p.principal * p.rate) / 100);
    const interest = r2(yearly * p.years);
    switch (depth) {
      case 1:
        return A.standard({
          question: [`£${p.principal} is invested at ${p.rate}% simple interest per year.`],
          ask: `How much interest is earned in ${p.years} years?`,
          answer: A.number(interest, { units: "£" }),
          wrong: wrongs(interest, [
            {
              code: "RAT.INTEREST.ONE-YEAR",
              value: A.number(yearly, { units: "£" }),
              feedback: `That is one year's interest. Multiply by ${p.years} years.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.principal} \\times ${p.rate / 100} \\times ${p.years} = ${interest}`,
            },
          ],
        });
      case 2: {
        const total = r2(p.principal + interest);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                `Ravi puts £${p.principal} in an account paying ${p.rate}% simple interest per year.`,
              ],
              ask: `How much is in the account after ${p.years} years?`,
            },
            {
              question: [`A loan of £${p.principal} charges ${p.rate}% simple interest per year.`],
              ask: `How much is owed in total after ${p.years} years?`,
            },
          ],
          answer: A.number(total, { units: "£" }),
          wrong: wrongs(total, [
            {
              code: "RAT.INTEREST.ONE-YEAR",
              value: A.number(r2(p.principal + yearly), { units: "£" }),
              feedback: `Interest is added every year: ${p.years} × £${yearly}.`,
            },
          ]),
          solution: [{ say: "", math: `${p.principal} + ${p.years} \\times ${yearly} = ${total}` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["With simple interest, the same amount of interest is added every year."],
          truth: "always",
          reasons: [
            {
              text: `Always. Simple interest is always worked out on the original £${p.principal}, so it is £${yearly} each year.`,
              correct: true,
            },
            { text: "Sometimes. The interest grows as the money grows." },
            {
              text: "Never. Interest is only paid in the first year.",
              code: "RAT.INTEREST.ONE-YEAR",
            },
          ],
          solution: [{ say: "Compound interest is the kind that grows each year." }],
        });
    }
  },

  verify(p, question) {
    const interest = r2(r2((p.principal * p.rate) / 100) * p.years);
    if (question.key.depth === 1) return numberAnswer(question) === interest;
    if (question.key.depth === 2) return numberAnswer(question) === r2(p.principal + interest);
    return true;
  },
});
