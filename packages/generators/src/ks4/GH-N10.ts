/**
 * @statement GH-N10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GH-N10: Change recurring decimals into fractions and vice versa
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  /** Depth 1: 0.(xy) recurring. */
  block: number;
  /** Depth 2: 0.a(b), with only b recurring. */
  a: number;
  b: number;
  claim: number;
}

const dots = (digits: string) =>
  digits
    .split("")
    .map((d) => `\\dot{${d}}`)
    .join("");

const CLAIMS = [
  {
    math: `0.${dots("9")} = 1`,
    truth: true,
    why: "Let x = 0.999…; then 10x = 9.999…, so 9x = 9 and x = 1.",
    code: undefined,
  },
  {
    math: "\\frac{1}{3} = 0.3",
    truth: false,
    why: "1 ÷ 3 = 0.333… recurring; 0.3 is only 3/10.",
    code: "FR.RECURRING.TRUNCATE",
  },
  {
    math: `0.${dots("12")} = \\frac{12}{100}`,
    truth: false,
    why: "12/100 = 0.12 exactly. The recurring decimal is 12/99 = 4/33.",
    code: "FR.RECURRING.TRUNCATE",
  },
] as const;

export default defineGenerator<Params>({
  id: "GH-N10",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.RECURRING.TRUNCATE"],

  params(rng) {
    const block = rng.int(10, 98);
    const a = rng.int(1, 9);
    const b = rng.int(1, 9);
    if (block % 11 === 0 || a === b) reject("a two-digit block that is not one digit repeated");
    return { block, a, b, claim: rng.int(0, CLAIMS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const value = frac(p.block, 99);
        return A.standard({
          question: [
            "Write ",
            A.math(`0.${dots(String(p.block))}`),
            " as a fraction in its simplest form.",
          ],
          answer: A.exact(value, "simplest"),
          wrong: [
            {
              code: "FR.RECURRING.TRUNCATE",
              value: A.exact(frac(p.block, 100)),
              feedback: `${p.block}/100 = 0.${p.block} exactly; the digits keep repeating, so use 100x − x.`,
            },
          ],
          solution: [
            {
              say: `Let x = 0.${p.block}${p.block}…; then 100x = ${p.block}.${p.block}${p.block}…`,
            },
            { say: `Subtract: 99x = ${p.block}, so x = `, math: toLatex(value) },
          ],
        });
      }
      case 2: {
        const top = 9 * p.a + p.b;
        const value = frac(top, 90);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Write ",
                A.math(`0.${p.a}${dots(String(p.b))}`),
                " as a fraction in its simplest form.",
              ],
            },
            {
              question: [
                "Show that ",
                A.math(`0.${p.a}${dots(String(p.b))}`),
                " can be written as a fraction, giving it in its simplest form.",
              ],
            },
          ],
          answer: A.exact(value, "simplest"),
          wrong: [
            {
              code: "FR.RECURRING.TRUNCATE",
              value: A.exact(frac(10 * p.a + p.b, 100)),
              feedback: `That is 0.${p.a}${p.b} exactly; the ${p.b} keeps recurring.`,
            },
          ],
          solution: [
            {
              say: `Let x = 0.${p.a}${p.b}${p.b}…; then 10x = ${p.a}.${p.b}${p.b}… and 100x = ${p.a}${p.b}.${p.b}${p.b}…`,
            },
            {
              say: `100x − 10x = ${10 * p.a + p.b} − ${p.a}, so 90x = ${top} and x = `,
              math: toLatex(value),
            },
          ],
        });
      }
      default: {
        const c = CLAIMS[p.claim] ?? (CLAIMS[0] as (typeof CLAIMS)[number]);
        return A.trueOrFalseWhy({
          rng,
          statement: ["Ravi says ", A.math(c.math), "."],
          truth: c.truth,
          reasons: c.truth
            ? [
                { text: `True. ${c.why}`, correct: true },
                {
                  text: "False. 0.999… is always just less than 1.",
                  code: "FR.RECURRING.TRUNCATE",
                },
                { text: "False. A recurring decimal cannot equal a whole number." },
              ]
            : [
                { text: `False. ${c.why}`, correct: true },
                {
                  text: "True. You can write a recurring decimal by its first digits.",
                  ...(c.code ? { code: c.code } : {}),
                },
                {
                  text: "True. Every fraction gives a terminating decimal.",
                  code: "FR.RECURRING.TRUNCATE",
                },
              ],
          solution: [{ say: c.why }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth === 1)
      return a?.type === "exact" && a.value === toLatex(frac(p.block, 99));
    if (question.key.depth === 2)
      return a?.type === "exact" && a.value === toLatex(frac(9 * p.a + p.b, 90));
    return true;
  },
});
