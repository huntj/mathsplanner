/**
 * @statement Y5-FR-10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-FR-10: Solve problems involving numbers up to three decimal places
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Masses in grams, shown in kilograms: a has 3 decimal places, b has 1 or 2. */
  a: number;
  b: number;
  c: number;
}

const kg = (g: number) => String(g / 1000);

export default defineGenerator<Params>({
  id: "Y5-FR-10",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["FR.DECIMAL.PLACE", "AS.MULTISTEP.ONE-STEP"],

  params(rng, numbers) {
    const a = rng.int(1001, numbers === "stretch" ? 9999 : 4999);
    const b = rng.int(1, numbers === "friendly" ? 9 : 49) * (numbers === "friendly" ? 100 : 10);
    const c = rng.int(1001, 2999);
    if (a % 10 === 0 || (b % 100 === 0) === (numbers !== "friendly") || a + b + c >= 10000)
      reject("mixed decimal places; under 10 kg");
    return { a, b, c };
  },

  build(p, depth): QuestionDraft {
    switch (depth) {
      case 1: {
        const total = p.a + p.b;
        // 2.375 + 0.6 worked as 2.375 + 0.006: the digits lined up on the right.
        const right = p.a + p.b / (p.b % 100 === 0 ? 100 : 10);
        return A.standard({
          question: `A parcel weighs ${kg(p.a)} kg. A box weighing ${kg(p.b)} kg is added.`,
          ask: "What is the total mass, in kilograms?",
          answer: A.number(total / 1000),
          wrong: wrongs(total / 1000, [
            {
              code: "FR.DECIMAL.PLACE",
              value: A.number(right / 1000),
              feedback: "Line up the decimal points, not the last digits.",
            },
          ]),
          solution: [
            { say: `Line up the decimal points: ${kg(p.a)} + ${kg(p.b)} = ${kg(total)} kg.` },
          ],
        });
      }
      case 2:
        return A.reverse({
          question: `A bag of flour weighed ${kg(p.a + p.b)} kg. Some flour was used, and now it weighs ${kg(p.a)} kg.`,
          ask: "How much flour was used, in kilograms?",
          answer: A.number(p.b / 1000),
          solution: [{ say: `${kg(p.a + p.b)} − ${kg(p.a)} = ${kg(p.b)} kg.` }],
        });
      default: {
        const total = p.a + p.b + p.c;
        const limit = 10000;
        return A.multiStepContext({
          context: `A suitcase can hold up to 10 kg. Jo packs items weighing ${kg(p.a)} kg, ${kg(p.b)} kg and ${kg(p.c)} kg.`,
          parts: [
            {
              ask: "What is the total mass of the items, in kilograms?",
              answer: A.number(total / 1000),
              wrong: wrongs(total / 1000, [
                {
                  code: "AS.MULTISTEP.ONE-STEP",
                  value: A.number((p.a + p.b) / 1000),
                  feedback: "Add all three items.",
                },
              ]),
            },
            {
              ask: "How much more mass can the suitcase hold, in kilograms?",
              answer: A.number((limit - total) / 1000),
            },
          ],
          solution: [
            { say: `${kg(p.a)} + ${kg(p.b)} + ${kg(p.c)} = ${kg(total)} kg.` },
            { say: `10 − ${kg(total)} = ${kg(limit - total)} kg.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return Math.round(numberAnswer(question) * 1000) === p.a + p.b;
    if (question.archetype === "reverse") return Math.round(numberAnswer(question) * 1000) === p.b;
    return (
      Math.round(numberAnswer(question, 0) * 1000) === p.a + p.b + p.c &&
      Math.round(numberAnswer(question, 1) * 1000) === 10000 - p.a - p.b - p.c
    );
  },
});
