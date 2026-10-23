/**
 * @statement Y5-FR-02.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-02.b: Find equivalent fractions in tenths and hundredths
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { fracTex } from "../shared/fr.ts";

interface Params {
  n: number;
}

export default defineGenerator<Params>({
  id: "Y5-FR-02.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.EQUIV.ADD-SAME", "FR.DECIMAL.PLACE"],

  params(rng) {
    return { n: rng.int(1, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.math(`${fracTex(p.n, 10)} = \\frac{\\square}{100}`)],
          ask: "What number goes in the box?",
          answer: A.number(10 * p.n),
          wrong: wrongs(10 * p.n, [
            {
              code: "FR.EQUIV.ADD-SAME",
              value: A.number(p.n + 90),
              feedback:
                "Multiply the top and bottom by the same number: 10 × 10 = 100, so multiply the top by 10 too.",
            },
            {
              code: "FR.DECIMAL.PLACE",
              value: A.number(p.n),
              feedback: `${p.n} hundredths is smaller than ${p.n} tenths. Each tenth is 10 hundredths.`,
            },
          ]),
          solution: [{ say: "", math: `${fracTex(p.n, 10)} = ${fracTex(10 * p.n, 100)}` }],
        });
      case 2:
        return A.standard({
          question: [A.math(`${fracTex(10 * p.n, 100)} = \\frac{\\square}{10}`)],
          ask: "What number goes in the box?",
          answer: A.number(p.n),
          wrong: wrongs(p.n, [
            {
              code: "FR.DECIMAL.PLACE",
              value: A.number(10 * p.n),
              feedback:
                "Tenths are bigger than hundredths, so you need fewer of them: divide by 10.",
            },
          ]),
          solution: [{ say: "", math: `${fracTex(10 * p.n, 100)} = ${fracTex(p.n, 10)}` }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ben says ", A.math(`${fracTex(p.n, 10)} = ${fracTex(p.n, 100)}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. One tenth is ten hundredths, so ${p.n} tenths is ${10 * p.n} hundredths.`,
              correct: true,
            },
            { text: "True. The numerators are the same.", code: "FR.DECIMAL.PLACE" },
            { text: "True. Tenths and hundredths are the same size.", code: "FR.DECIMAL.PLACE" },
          ],
          solution: [{ say: "", math: `${fracTex(p.n, 10)} = ${fracTex(10 * p.n, 100)}` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === 10 * p.n;
    if (question.key.depth === 2) return numberAnswer(question) === p.n;
    return true;
  },
});
