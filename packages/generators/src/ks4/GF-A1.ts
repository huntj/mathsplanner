/**
 * @statement GF-A1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A1: Use and interpret algebraic notation
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  k: number;
  m: number;
  phrase: number;
  claim: number;
}

const PHRASES: [string, (k: number, m: number) => string, (k: number, m: number) => string[]][] = [
  [
    "{m} more than {k} times n",
    (k, m) => `${k}n + ${m}`,
    (k, m) => [`${k}(n + ${m})`, `${m}n + ${k}`],
  ],
  [
    "{k} times the sum of n and {m}",
    (k, m) => `${k}(n + ${m})`,
    (k, m) => [`${k}n + ${m}`, `n + ${k * m}`],
  ],
  ["n squared, then multiplied by {k}", (k) => `${k}n^2`, (k) => [`(${k}n)^2`, `${2 * k}n`]],
  [
    "{m} less than n, all divided by {k}",
    (k, m) => `\\frac{n - ${m}}{${k}}`,
    (k, m) => [`n - \\frac{${m}}{${k}}`, `\\frac{${m} - n}{${k}}`],
  ],
];
const CLAIMS: { latex: string; truth: boolean; why: string; code?: string }[] = [
  {
    latex: "a \\times a \\times b = 2ab",
    truth: false,
    why: "a × a is a², so a × a × b = a²b.",
    code: "ALG.NOTATION.JUXTAPOSE",
  },
  {
    latex: "3y \\text{ means } 3 \\times y",
    truth: true,
    why: "A number written next to a letter is multiplied by it.",
  },
  {
    latex: "\\frac{x}{4} \\text{ means } x \\div 4",
    truth: true,
    why: "A fraction line means divide.",
  },
  {
    latex: "y^2 \\text{ means } 2y",
    truth: false,
    why: "y² means y × y; 2y means y + y.",
    code: "ALG.NOTATION.JUXTAPOSE",
  },
];

export default defineGenerator<Params>({
  id: "GF-A1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.NOTATION.JUXTAPOSE", "ALG.FORM.WORDS"],

  params(rng) {
    const k = rng.int(2, 9);
    const m = rng.int(2, 9);
    if (k === m) reject("different numbers in the phrase");
    return { k, m, phrase: rng.int(0, PHRASES.length - 1), claim: rng.int(0, CLAIMS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = `${p.k}a^2b`;
        return A.choice({
          rng,
          question: ["Simplify ", A.math(`${p.k} \\times a \\times b \\times a`), "."],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`${2 * p.k}ab`),
              code: "ALG.NOTATION.JUXTAPOSE",
              feedback: "a × a is a squared, not 2a.",
            },
            { content: A.math(`${p.k}aab`), feedback: "Write a × a using a power." },
            {
              content: A.math(`${p.k}ab^2`),
              feedback: "Check which letter appears twice: it is a, not b.",
            },
          ],
          solution: [
            { say: "Multiply the numbers and write repeated letters as powers: ", math: right },
          ],
        });
      }
      case 2: {
        const [words, right, wrong] = PHRASES[p.phrase] as (typeof PHRASES)[number];
        const text = words.replace("{k}", String(p.k)).replace("{m}", String(p.m));
        return A.choice({
          rng,
          archetype: "varied-form",
          question: `Write an expression for: ${text}.`,
          correct: A.math(right(p.k, p.m)),
          distractors: wrong(p.k, p.m).map((w) => ({
            content: A.math(w),
            code: "ALG.FORM.WORDS",
            feedback: "Follow the words in order: what happens to n first?",
          })),
          solution: [{ say: "", math: right(p.k, p.m) }],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: ["Is this true? ", A.math(c.latex)],
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Letters next to each other are added.`,
              code: "ALG.NOTATION.JUXTAPOSE",
            },
            {
              text: `${c.truth ? "False" : "True"}. A power means multiply by the power.`,
              code: "ALG.NOTATION.JUXTAPOSE",
            },
          ],
          solution: [{ say: "3y = 3 × y; y² = y × y; x/4 = x ÷ 4." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return chosenText(question) === `${p.k}a^2b`;
    return true;
  },
});
