/**
 * @statement Y7-NPV-07.c
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-07.c: Recognise powers of 2, 3, 4 and 5 and higher roots
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const PAIRS: [number, number][] = [
  [2, 5],
  [3, 4],
  [2, 6],
  [3, 5],
  [2, 7],
  [4, 5],
];
const ROOTS: [number, number][] = [
  [4, 2],
  [4, 3],
  [5, 2],
  [4, 5],
  [5, 3],
  [6, 2],
];

interface Params {
  pair: number;
  root: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-07.c",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.POWER.ROOT-HALF", "NPV.POWER.TIMES-INDEX"],

  params(rng) {
    return { pair: rng.int(0, PAIRS.length - 1), root: rng.int(0, ROOTS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const [k, b] = ROOTS[p.root] ?? [4, 2];
        const n = b ** k;
        return A.standard({
          question: ["Work out ", A.math(`\\sqrt[${k}]{${n}}`), "."],
          answer: A.number(b),
          wrong: wrongs(b, [
            Number.isInteger(n / k)
              ? {
                  code: "NPV.POWER.ROOT-HALF",
                  value: A.number(n / k),
                  feedback: `Find the number that multiplies by itself ${k} times to give ${n}.`,
                }
              : undefined,
          ]),
          solution: [{ say: "", math: `${Array(k).fill(b).join(" \\times ")} = ${n}` }],
        });
      }
      case 2: {
        const [a, b] = PAIRS[p.pair] ?? [2, 5];
        const right = a ** b > b ** a ? `${a}^${b}` : `${b}^${a}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Which is larger, ", A.math(`${a}^${b}`), " or ", A.math(`${b}^${a}`), "?"],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(right === `${a}^${b}` ? `${b}^${a}` : `${a}^${b}`),
              feedback: `${a}^${b} = ${a ** b} and ${b}^${a} = ${b ** a}.`,
            },
            {
              content: "They are equal",
              code: "NPV.POWER.TIMES-INDEX",
              feedback: `${a} × ${b} = ${b} × ${a}, but powers are repeated multiplication: ${a ** b} and ${b ** a}.`,
            },
          ],
          solution: [{ say: "", math: `${a}^${b} = ${a ** b}, \\; ${b}^${a} = ${b ** a}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Eli says ",
            A.math("\\sqrt[5]{32} = 2"),
            " because ",
            A.math("2^5 = 32"),
            ".",
          ],
          truth: true,
          reasons: [
            {
              text: "True. A fifth root undoes a fifth power: 2 × 2 × 2 × 2 × 2 = 32.",
              correct: true,
            },
            { text: "False. 32 ÷ 5 = 6.4.", code: "NPV.POWER.ROOT-HALF" },
            { text: "False. 2 × 5 = 10, not 32.", code: "NPV.POWER.TIMES-INDEX" },
          ],
          solution: [{ say: "Roots and powers are inverses." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (ROOTS[p.root]?.[1] ?? 2);
    if (question.key.depth === 2) {
      const [a, b] = PAIRS[p.pair] ?? [2, 5];
      return chosenText(question) === (a ** b > b ** a ? `${a}^${b}` : `${b}^${a}`);
    }
    return true;
  },
});
