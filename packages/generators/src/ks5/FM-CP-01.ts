/**
 * @statement FM-CP-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-CP-01: Prove results by mathematical induction: sums of series, divisibility, matrix powers
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
}

export default defineGenerator<Params>({
  id: "FM-CP-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.INDUCTION"],

  params(rng) {
    return { a: rng.int(3, 9) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "To prove by induction that ",
            A.math(`${p.a}^n - 1`),
            ` is divisible by ${p.a - 1}, Mia writes `,
            A.math(`${p.a}^{k+1} - 1 = ${p.a}(${p.a}^k - 1) + c`),
            ".",
          ],
          ask: "What is the value of c?",
          answer: A.number(p.a - 1),
          wrong: wrongs(p.a - 1, [
            {
              code: "ALG.INDUCTION",
              value: A.number(1),
              feedback: `${p.a}(${p.a}^k − 1) = ${p.a}^(k+1) − ${p.a}, so add ${p.a} − 1 to get ${p.a}^(k+1) − 1.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `${p.a}(${p.a}^k - 1) + ${p.a - 1} = ${p.a}^{k+1} - ${p.a} + ${p.a - 1} = ${p.a}^{k+1} - 1`,
            },
            { say: `Both parts are divisible by ${p.a - 1}, which completes the inductive step.` },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Ali proves by induction that ",
            A.math("\\sum_{r=1}^{n} r = \\tfrac{1}{2}n(n + 1)"),
            " for all positive integers n. He has shown it is true for n = 1.",
          ],
          ask: "What should the next step be?",
          correct: "Assume it is true for n = k, and show it is then true for n = k + 1.",
          distractors: [
            {
              content: "Assume it is true for all n, and show it is true for n = k + 1.",
              code: "ALG.INDUCTION",
              feedback: "Assuming it for all n assumes what you want to prove.",
            },
            {
              content: "Check it is also true for n = 2 and n = 3; then it is proved.",
              code: "ALG.INDUCTION",
              feedback: "Examples alone do not prove it for every n.",
            },
          ],
          solution: [{ say: "Base case, then the inductive step k ⇒ k + 1, then the conclusion." }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben shows that if ",
            A.math(`${p.a}^k + 1`),
            ` is divisible by ${p.a - 1}, then so is `,
            A.math(`${p.a}^{k+1} + 1`),
            ". He says this proves the result for all n.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. There is no true base case: for n = 1, ${p.a} + 1 = ${p.a + 1} is not divisible by ${p.a - 1}. Both the base case and the step are needed.`,
              correct: true,
            },
            { text: "True. The inductive step is enough on its own.", code: "ALG.INDUCTION" },
            { text: "True. If it works for k + 1 it works for everything.", code: "ALG.INDUCTION" },
          ],
          solution: [{ say: "Induction needs a true base case and a valid inductive step." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a - 1;
    return true;
  },
});
