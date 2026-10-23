/**
 * @statement GF-N6.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N6.c: Recognise powers of 2, 3, 4 and 5
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

/** The largest power used for each base, keeping numbers to 1024 or less. */
const TOP: Record<number, number> = { 2: 10, 3: 6, 4: 5, 5: 4 };

interface Params {
  b: number;
  k: number;
}

export default defineGenerator<Params>({
  id: "GF-N6.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.POWER.TIMES-INDEX"],

  params(rng) {
    const b = rng.pick([2, 3, 4, 5]);
    const p = { b, k: rng.int(3, TOP[b] ?? 4) };
    if (p.b * p.k === p.b ** p.k - p.b) reject("different distractors");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const n = p.b ** p.k;
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [`Which of these is a power of ${p.b}?`],
          correct: A.math(String(n)),
          distractors: [
            {
              content: A.math(String(p.b * p.k)),
              code: "NPV.POWER.TIMES-INDEX",
              feedback: `${p.b * p.k} = ${p.b} × ${p.k}, not ${p.b} multiplied by itself.`,
            },
            {
              content: A.math(String(n - p.b)),
              feedback: `Keep multiplying by ${p.b}: ${n - p.b} is not reached.`,
            },
          ],
          solution: [{ say: "", math: `${p.b}^{${p.k}} = ${n}` }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [{ question: [A.math(`${p.b}^x = ${n}`), "."], ask: "Find x." }],
          answer: A.number(p.k),
          wrong: wrongs(p.k, [
            {
              code: "NPV.POWER.TIMES-INDEX",
              value: A.number(n / p.b),
              feedback: `Count how many ${p.b}s multiply to give ${n}.`,
            },
          ]),
          solution: [
            {
              say: `Keep multiplying by ${p.b}: `,
              math: Array.from({ length: p.k }, (_, i) => p.b ** (i + 1)).join(", "),
            },
          ],
        });
      default: {
        const odd = p.b ** 3 + 2;
        return A.oddOneOut({
          rng,
          question: "Which number is the odd one out?",
          items: [
            { content: A.math(String(p.b ** 2)) },
            { content: A.math(String(p.b ** 3)) },
            { content: A.math(String(p.b ** 4)) },
            { content: A.math(String(odd)), odd: true },
          ],
          reasons: [
            { text: `It is the only one that is not a power of ${p.b}.`, correct: true },
            { text: "It is the only even number." },
            {
              text: "It is the only one that is not a square number.",
              code: "NPV.POWER.TIMES-INDEX",
            },
          ],
          solution: [
            { say: `${p.b ** 2}, ${p.b ** 3} and ${p.b ** 4} are ${p.b}², ${p.b}³ and ${p.b}⁴.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === String(p.b ** p.k);
    if (question.key.depth === 2) return numberAnswer(question) === p.k;
    return true;
  },
});
