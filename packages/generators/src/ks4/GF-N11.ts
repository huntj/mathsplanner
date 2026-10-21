/**
 * @statement GF-N11
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N11: Identify and work with fractions in ratio problems
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  k: number;
}

const g = (x: number, y: number): number => (y === 0 ? x : g(y, x % y));

export default defineGenerator<Params>({
  id: "GF-N11",
  version: "1.0.0",
  depths: [1, 2, 5],
  misconceptions: ["RAT.PART-WHOLE", "RAT.SHARE.WRONG-TOTAL"],

  params(rng) {
    const a = rng.int(1, 7);
    const b = rng.int(2, 9);
    if (a === b || g(a, b) !== 1) reject("a ratio in its simplest form");
    return { a, b, k: rng.int(3, 12) };
  },

  build(p, depth, rng): QuestionDraft {
    const total = p.a + p.b;
    switch (depth) {
      case 1:
        return A.standard({
          question: `Red and blue counters are in a bag in the ratio ${p.a} : ${p.b}.`,
          ask: "What fraction of the counters are red?",
          answer: A.exact(frac(p.a, total)),
          wrong: [
            {
              code: "RAT.PART-WHOLE",
              value: A.exact(frac(p.a, p.b)),
              feedback: `For every ${p.a} red there are ${total} counters altogether, so red is ${p.a} out of ${total}.`,
            },
          ],
          solution: [
            {
              say: `There are ${p.a} + ${p.b} = ${total} parts, and ${p.a} are red: `,
              math: toLatex(frac(p.a, total)),
            },
          ],
        });
      case 2:
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "In a class, ",
            A.math(toLatex(frac(p.a, total))),
            " of the pupils walk to school and the rest do not.",
          ],
          ask: "What is the ratio of walkers to non-walkers?",
          correct: `${p.a} : ${p.b}`,
          distractors: [
            {
              content: `${p.a} : ${total}`,
              code: "RAT.PART-WHOLE",
              feedback: `${total} is everyone. The rest are ${total} − ${p.a} = ${p.b} parts.`,
            },
            { content: `${p.b} : ${p.a}`, feedback: "Keep the order: walkers first." },
          ],
          solution: [
            { say: `${p.a} parts walk out of ${total}, so ${p.b} parts do not: ${p.a} : ${p.b}.` },
          ],
        });
      default: {
        const whole = total * p.k;
        const red = p.a * p.k;
        return A.multiStepContext({
          context: `Sweets are shared between Ali and Ben in the ratio ${p.a} : ${p.b}. Ben gets ${p.b * p.k} sweets.`,
          parts: [
            {
              ask: "How many sweets were there altogether?",
              answer: A.number(whole),
              wrong: wrongs(whole, [
                {
                  code: "RAT.SHARE.WRONG-TOTAL",
                  value: A.number(p.b * p.k + p.a),
                  feedback: `One part is ${p.b * p.k} ÷ ${p.b} = ${p.k} sweets; there are ${total} parts.`,
                },
              ]),
            },
            {
              ask: "What fraction of the sweets does Ali get?",
              answer: A.exact(frac(red, whole)),
              wrong: [
                {
                  code: "RAT.PART-WHOLE",
                  value: A.exact(frac(p.a, p.b)),
                  feedback: "Compare Ali's share with all the sweets.",
                },
              ],
            },
          ],
          solution: [
            {
              say: `One part = ${p.b * p.k} ÷ ${p.b} = ${p.k}. Total = ${total} × ${p.k} = ${whole}.`,
            },
            { say: `Ali gets ${red} out of ${whole}, which is `, math: toLatex(frac(p.a, total)) },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "varied-form") return chosenText(question) === `${p.a} : ${p.b}`;
    if (question.archetype === "multi-step-context")
      return numberAnswer(question) === (p.a + p.b) * p.k;
    return true;
  },
});
