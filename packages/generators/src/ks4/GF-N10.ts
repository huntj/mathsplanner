/**
 * @statement GF-N10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N10: Work interchangeably with terminating decimals and their corresponding fractions
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n: number;
  d: number;
  claim: number;
}

const DENS = [8, 16, 20, 25, 40];
const CLAIMS: { text: string; truth: boolean; why: string; code?: string }[] = [
  {
    text: "1/3 = 0.3",
    truth: false,
    why: "1/3 = 0.333…; the 3s go on for ever. 0.3 is 3/10.",
    code: "FR.RECURRING.TRUNCATE",
  },
  { text: "3/8 = 0.375", truth: true, why: "3 ÷ 8 = 0.375, which stops after three places." },
  {
    text: "Every fraction can be written as a decimal that stops.",
    truth: false,
    why: "Only fractions whose simplest denominator has no prime factors other than 2 and 5 terminate; 1/3 and 1/7 recur.",
    code: "FR.RECURRING.TRUNCATE",
  },
  { text: "0.15 = 3/20", truth: true, why: "0.15 = 15/100, which simplifies to 3/20." },
];

export default defineGenerator<Params>({
  id: "GF-N10",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.DECIMAL.DIGITS", "FR.DECIMAL.PLACE", "FR.RECURRING.TRUNCATE"],

  params(rng) {
    const d = rng.pick(DENS);
    let n = rng.int(1, d - 1);
    while (Number(frac(n, d).d) < 8) n = rng.int(1, d - 1);
    return { n, d, claim: rng.int(0, CLAIMS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    const f = frac(p.n, p.d);
    const dec = Number(f.n) / Number(f.d);
    const places = String(dec).split(".")[1]?.length ?? 1;
    const digits = Math.round(dec * 10 ** places);
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Write ", A.math(String(dec)), " as a fraction in its simplest form."],
          answer: A.exact(f, "simplest"),
          wrong: [
            {
              code: "FR.DECIMAL.PLACE",
              value: A.exact(frac(digits, 10 ** (places - 1))),
              feedback: `The last digit is in the ${places === 2 ? "hundredths" : "thousandths"} column, so start from a denominator of ${10 ** places}.`,
            },
          ],
          solution: [
            { say: "", math: `${dec} = \\frac{${digits}}{${10 ** places}} = ${toLatex(f)}` },
          ],
        });
      case 2:
        return A.reverse({
          question: ["Write ", A.math(toLatex(f)), " as a decimal."],
          answer: A.number(dec),
          wrong: wrongs(dec, [
            {
              code: "FR.DECIMAL.DIGITS",
              value: A.number(Number(`${f.n}.${f.d}`)),
              feedback: `Divide the numerator by the denominator: ${f.n} ÷ ${f.d}.`,
            },
          ]),
          solution: [{ say: `${f.n} ÷ ${f.d} = ${dec}.` }],
        });
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: /^[\d/ =.]+$/.test(c.text)
            ? ["Is this true? ", A.math(c.text.replace(/(\d+)\/(\d+)/g, "\\frac{$1}{$2}"))]
            : `Ali says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Write the numerator after the decimal point.`,
              code: "FR.DECIMAL.DIGITS",
            },
            {
              text: `${c.truth ? "False" : "True"}. Every decimal stops after a few places.`,
              code: "FR.RECURRING.TRUNCATE",
            },
          ],
          solution: [
            {
              say: "Divide the numerator by the denominator to find the decimal; read the decimal's place value to find the fraction.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "reverse")
      return Math.abs(numberAnswer(question) - p.n / p.d) < 1e-12;
    return true;
  },
});
