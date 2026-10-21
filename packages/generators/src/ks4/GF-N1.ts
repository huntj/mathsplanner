/**
 * @statement GF-N1
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N1: Order positive and negative integers, decimals and fractions; use the symbols =, ≠, <, >,
// ≤, ≥
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  /** Four values as [numerator, denominator] (denominator 1 for integers; decimals as tenths etc.). */
  values: [number, number, "frac" | "dec" | "int"][];
  /** Depth 2: two negative values to compare. */
  pair: [[number, number], number];
  claim: number;
}

const show = ([n, d, kind]: [number, number, "frac" | "dec" | "int"]) =>
  kind === "frac" ? toLatex(frac(n, d)) : kind === "dec" ? String(n / d) : String(n);
const val = ([n, d]: [number, number, string]) => n / d;
const CLAIMS: { latex: string; truth: boolean; why: string; code?: string }[] = [
  {
    latex: "-0.25 > -0.2",
    truth: false,
    why: "−0.25 is further below zero than −0.2, so it is smaller.",
    code: "NPV.NEGATIVE.ORDER",
  },
  { latex: "\\frac{3}{8} < 0.4", truth: true, why: "3/8 = 0.375, which is less than 0.4." },
  {
    latex: "0.45 > 0.5",
    truth: false,
    why: "0.45 has 4 tenths and 0.5 has 5 tenths, so 0.45 is smaller.",
    code: "NPV.DECIMAL.LONGER-BIGGER",
  },
  { latex: "-\\frac{1}{2} \\le -0.5", truth: true, why: "−1/2 = −0.5, and ≤ includes equal to." },
];

export default defineGenerator<Params>({
  id: "GF-N1",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.NEGATIVE.ORDER", "NPV.DECIMAL.LONGER-BIGGER", "NPV.COMPARE.SIGN-DIRECTION"],

  params(rng) {
    const values: [number, number, "frac" | "dec" | "int"][] = [
      [rng.int(1, 7), 8, "frac"],
      [rng.int(11, 95), 100, "dec"],
      [-rng.int(1, 9), 10, "dec"],
      [-rng.int(1, 3), 1, "int"],
    ];
    if (new Set(values.map(val)).size < 4 || (values[1] && values[1][0] % 10 === 0))
      reject("four different values, the decimal with two places");
    const a = rng.int(1, 3);
    const b = rng.int(1, 9);
    if (a / 4 === b / 10 || a % 4 === 0)
      reject("a quarter-based fraction and a decimal that differ");
    return { values, pair: [[-a, 4], -b / 10], claim: rng.int(0, CLAIMS.length - 1) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const sorted = [...p.values].sort((x, y) => val(x) - val(y));
        const asText = (list: typeof p.values) => list.map(show).join(",\\ ");
        const byMagnitude = [...p.values].sort((x, y) => Math.abs(val(x)) - Math.abs(val(y)));
        const reversed = [...sorted].reverse();
        return A.choice({
          rng,
          question: ["Put these numbers in order, smallest first: ", A.math(asText(p.values))],
          correct: A.math(asText(sorted)),
          distractors: [
            {
              content: A.math(asText(byMagnitude)),
              code: "NPV.NEGATIVE.ORDER",
              feedback:
                "Negative numbers are smaller than positive ones; the further below zero, the smaller.",
            },
            {
              content: A.math(asText(reversed)),
              code: "NPV.COMPARE.SIGN-DIRECTION",
              feedback: "That is largest first.",
            },
          ].filter((d) => JSON.stringify(d.content) !== JSON.stringify(A.math(asText(sorted)))),
          solution: [
            {
              say: "As decimals: ",
              math: sorted.map((v) => String(Math.round(val(v) * 1000) / 1000)).join(" < "),
            },
          ],
        });
      }
      case 2: {
        const [[n, d], b] = p.pair;
        const a = n / d;
        const s = a < b ? "<" : ">";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Which symbol goes in the box?",
            A.displayMath(`${toLatex(frac(n, d))}\\ \\square\\ ${b}`),
          ],
          correct: A.math(s),
          distractors: [
            {
              content: A.math(s === "<" ? ">" : "<"),
              code: "NPV.NEGATIVE.ORDER",
              feedback: `As a decimal, ${toLatex(frac(n, d))} = ${a}. With negatives, the number further from zero is smaller.`,
            },
            { content: A.math("="), feedback: `${a} and ${b} are not equal.` },
          ],
          solution: [{ say: `${toLatex(frac(n, d))} = ${a}, and ${a} ${s} ${b}.` }],
        });
      }
      default: {
        const c = CLAIMS[p.claim] as (typeof CLAIMS)[number];
        return A.trueOrFalseWhy({
          rng,
          statement: ["Is this statement true? ", A.math(c.latex)],
          truth: c.truth,
          reasons: [
            { text: `${c.truth ? "True" : "False"}. ${c.why}`, correct: true },
            {
              text: `${c.truth ? "False" : "True"}. The number with more digits is bigger.`,
              code: "NPV.DECIMAL.LONGER-BIGGER",
            },
            {
              text: `${c.truth ? "False" : "True"}. A bigger digit after the minus sign means a bigger number.`,
              code: "NPV.NEGATIVE.ORDER",
            },
          ],
          solution: [
            { say: "Write both as decimals with the same number of places, then compare." },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const sorted = [...p.values].sort((x, y) => val(x) - val(y));
      return chosenText(question) === sorted.map(show).join(",\\ ");
    }
    return true;
  },
});
