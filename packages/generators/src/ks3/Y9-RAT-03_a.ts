/**
 * @statement Y9-RAT-03.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-RAT-03.a: Calculate compound interest
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  principal: number;
  rate: number;
  years: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "Y9-RAT-03.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND.SIMPLE"],

  params(rng) {
    return {
      principal: rng.int(2, 50) * 100,
      rate: rng.pick([2, 3, 4, 5, 6, 8]),
      years: rng.int(2, 4),
    };
  },

  build(p, depth, rng): QuestionDraft {
    const m = 1 + p.rate / 100;
    switch (depth) {
      case 1: {
        const v = r2(p.principal * m ** p.years);
        return A.standard({
          question: [`£${p.principal} is saved at ${p.rate}% compound interest per year.`],
          ask: `How much is in the account after ${p.years} years, to the nearest penny?`,
          answer: A.number(v, { units: "£" }),
          wrong: wrongs(v, [
            {
              code: "RAT.COMPOUND.SIMPLE",
              value: A.number(r2(p.principal * (1 + (p.rate * p.years) / 100)), { units: "£" }),
              feedback:
                "Compound interest is paid on the interest too: multiply by the multiplier once for each year.",
            },
          ]),
          solution: [
            { say: "", math: `${p.principal} \\times ${m}^{${p.years}} = ${v.toFixed(2)}` },
          ],
        });
      }
      case 2: {
        const compound = r2(p.principal * m ** p.years);
        const simple = r2(p.principal * (1 + ((p.rate + 0.5) * p.years) / 100));
        const right =
          compound > simple ? `${p.rate}% compound interest` : `${p.rate + 0.5}% simple interest`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `Kit has £${p.principal} to save for ${p.years} years. Bank A offers ${p.rate}% compound interest. Bank B offers ${p.rate + 0.5}% simple interest.`,
          ],
          ask: "Which gives more money at the end?",
          correct: right,
          distractors: [
            {
              content: right.includes("compound")
                ? `${p.rate + 0.5}% simple interest`
                : `${p.rate}% compound interest`,
              code: "RAT.COMPOUND.SIMPLE",
              feedback: `Work both out: £${compound.toFixed(2)} and £${simple.toFixed(2)}.`,
            },
            { content: "They give the same", feedback: "Work out the final amount for each bank." },
          ],
          solution: [{ say: `A: £${compound.toFixed(2)}; B: £${simple.toFixed(2)}.` }],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "Over two or more years, compound interest earns more than simple interest at the same rate.",
          ],
          truth: "always",
          reasons: [
            {
              text: "Always (for a positive rate). From the second year, compound interest is also paid on the earlier interest.",
              correct: true,
            },
            { text: "Never. They are the same thing.", code: "RAT.COMPOUND.SIMPLE" },
            { text: "Sometimes. Only for large amounts.", code: "RAT.COMPOUND.SIMPLE" },
          ],
          solution: [{ say: "In year 1 they are equal; after that compound pulls ahead." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === r2(p.principal * (1 + p.rate / 100) ** p.years);
    if (question.key.depth === 2) {
      const compound = r2(p.principal * (1 + p.rate / 100) ** p.years);
      const simple = r2(p.principal * (1 + ((p.rate + 0.5) * p.years) / 100));
      return (
        chosenText(question) ===
        (compound > simple ? `${p.rate}% compound interest` : `${p.rate + 0.5}% simple interest`)
      );
    }
    return true;
  },
});
