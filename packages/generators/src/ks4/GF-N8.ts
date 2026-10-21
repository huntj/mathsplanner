/**
 * @statement GF-N8
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N8: Calculate exactly with fractions and multiples of π
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";

interface Params {
  r: number;
  a: [number, number];
  b: [number, number];
  op: "+" | "-";
  claim: number;
}

const CLAIMS: { text: string; truth: boolean; why: string }[] = [
  {
    text: "π is exactly equal to 22/7.",
    truth: false,
    why: "22/7 = 3.142857…, but π = 3.141592…. 22/7 is only an approximation.",
  },
  {
    text: "An answer of 25π cm² is exact.",
    truth: true,
    why: "Leaving π as a symbol keeps the exact value; rounding would lose accuracy.",
  },
  {
    text: "π = 3.14 exactly.",
    truth: false,
    why: "π never ends or repeats; 3.14 is rounded to 2 decimal places.",
  },
];

export default defineGenerator<Params>({
  id: "GF-N8",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["MEA.CIRCLE.FORMULA", "FR.ADD.TOPS-AND-BOTTOMS"],

  params(rng) {
    const d1 = rng.pick([3, 4, 5, 6, 8]);
    const d2 = rng.pick([3, 4, 5, 6, 8]);
    const a: [number, number] = [rng.int(1, d1 - 1), d1];
    const b: [number, number] = [rng.int(1, d2 - 1), d2];
    if (d1 === d2 || frac(a[0], d1).le(frac(b[0], d2)))
      reject("different denominators, the first fraction larger");
    return {
      r: rng.int(3, 12),
      a,
      b,
      op: rng.pick(["+", "-"] as const),
      claim: rng.int(0, CLAIMS.length - 1),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const area = `${p.r * p.r}\\pi`;
        return A.standard({
          question: `A circle has a radius of ${p.r} cm.`,
          ask: "Find its area. Give your answer in terms of π.",
          answer: A.exact(area),
          wrong: [
            {
              code: "MEA.CIRCLE.FORMULA",
              value: A.exact(`${2 * p.r}\\pi`),
              feedback: "2πr is the circumference. Area = πr².",
            },
          ],
          solution: [
            { say: "", math: `A = \\pi r^2 = \\pi \\times ${p.r}^2 = ${area}\\text{ cm}^2` },
          ],
        });
      }
      case 2: {
        const x = frac(p.a[0], p.a[1]);
        const y = frac(p.b[0], p.b[1]);
        const right = p.op === "+" ? x.add(y) : x.sub(y);
        const slip = p.op === "+" ? frac(p.a[0] + p.b[0], p.a[1] + p.b[1]) : null;
        return A.standard({
          question: [
            "Work out ",
            A.math(`${toLatex(x)} ${p.op} ${toLatex(y)}`),
            ". Give your answer as a fraction in its simplest form.",
          ],
          answer: A.exact(right, "simplest"),
          wrong:
            slip && !slip.eq(right)
              ? [
                  {
                    code: "FR.ADD.TOPS-AND-BOTTOMS",
                    value: A.exact(slip),
                    feedback: "Write both fractions with a common denominator before adding.",
                  },
                ]
              : [],
          solution: [
            {
              say: "Use a common denominator: ",
              math: `${toLatex(x)} ${p.op} ${toLatex(y)} = ${toLatex(right)}`,
            },
          ],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: `Kim says: "${c.text}"`,
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. Any decimal for π is exact if you use enough places.`,
            },
            { text: `${c.truth ? "False" : "True"}. Answers with π in them are not finished.` },
          ],
          solution: [
            {
              say: "π is irrational: its decimals never end or repeat, so exact answers keep the π.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (a?.type !== "exact") return true;
    if (question.key.depth === 1) return a.value === `${p.r * p.r}\\pi`;
    const x = frac(p.a[0], p.a[1]);
    const y = frac(p.b[0], p.b[1]);
    return a.value === toLatex(p.op === "+" ? x.add(y) : x.sub(y));
  },
});
