/**
 * @statement GF-N15
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N15: Round numbers and measures to an appropriate degree of accuracy (e.g. to a specified number
// of decimal places or significant figures); use inequality notation to specify simple error
// intervals due to truncation or rounding
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Depth 1: a small decimal with leading zeros. */
  digits: number;
  zeros: number;
  /** Depths 2–4: a value rounded to 1 decimal place. */
  x: number;
  truncate: boolean;
}

const r = (v: number, dp = 6) => Math.round(v * 10 ** dp) / 10 ** dp;

export default defineGenerator<Params>({
  id: "GF-N15",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["NPV.ROUND.SF-LEADING-ZERO", "NPV.ROUND.DP-SF", "NPV.BOUNDS.ENDS"],

  params(rng) {
    const digits = rng.int(1001, 9999);
    if (digits % 10 === 0 || Math.floor(digits / 10) % 10 === 9)
      reject("a number whose rounding is not a corner case");
    return { digits, zeros: rng.int(1, 2), x: r(rng.int(21, 199) / 10), truncate: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const value = p.digits / 10 ** (p.zeros + 4);
    switch (depth) {
      case 1: {
        const right = Number(value.toPrecision(2));
        const leading = Number(value.toFixed(2));
        return A.standard({
          question: ["Round ", A.math(String(value)), " to 2 significant figures."],
          answer: A.number(right),
          wrong: wrongs(right, [
            {
              code: "NPV.ROUND.SF-LEADING-ZERO",
              value: A.number(Number(value.toFixed(p.zeros + 1))),
              feedback:
                "Zeros before the first non-zero digit are not significant. Start counting at the first non-zero digit.",
            },
            ...(leading > 0
              ? [
                  {
                    code: "NPV.ROUND.DP-SF",
                    value: A.number(leading),
                    feedback: "That is 2 decimal places, not 2 significant figures.",
                  },
                ]
              : []),
          ]),
          solution: [
            {
              say: `The first significant figure is the first non-zero digit: ${value} ≈ ${right}.`,
            },
          ],
        });
      }
      case 2: {
        const low = p.truncate ? p.x : r(p.x - 0.05);
        return A.standard({
          question: p.truncate
            ? `A number y is truncated to 1 decimal place. The result is ${p.x}.`
            : `A number y is rounded to 1 decimal place. The result is ${p.x}.`,
          ask: "What is the smallest possible value of y?",
          answer: A.number(low),
          wrong: wrongs(low, [
            p.truncate
              ? {
                  code: "NPV.BOUNDS.ENDS",
                  value: A.number(r(p.x - 0.05)),
                  feedback:
                    "Truncating chops off the extra digits; it never rounds up, so y is at least " +
                    p.x +
                    ".",
                }
              : {
                  code: "NPV.BOUNDS.ENDS",
                  value: A.number(r(p.x - 0.1)),
                  feedback: "Rounding to 1 d.p. means within half of 0.1 = 0.05 either side.",
                },
          ]),
          solution: [
            {
              say: p.truncate
                ? `Truncation keeps ${p.x} for any y from ${p.x} up to (not including) ${r(p.x + 0.1)}.`
                : `Any y from ${r(p.x - 0.05)} up to (not including) ${r(p.x + 0.05)} rounds to ${p.x}.`,
            },
          ],
        });
      }
      case 3: {
        // The same reading to three different degrees of accuracy.
        const whole = Math.round(p.x);
        const rows: [string, string][] = [
          [`y = ${p.x}\\text{ (1 d.p.)}`, `${r(p.x - 0.05)} \\le y < ${r(p.x + 0.05)}`],
          [
            `y = ${whole}\\text{ (nearest whole number)}`,
            `${r(whole - 0.5)} \\le y < ${r(whole + 0.5)}`,
          ],
          [
            `y = ${whole * 10}\\text{ (nearest 10)}`,
            `${whole * 10 - 5} \\le y < ${whole * 10 + 5}`,
          ],
        ];
        return A.matchRepresentations({
          rng,
          question: "Match each rounded value to its error interval.",
          pairs: rows.map(([a, b]) => [A.math(a), A.math(b)] as [A.RichInput, A.RichInput]),
          solution: [
            {
              say: "Go half a unit either side of the rounded value; include the lower bound but not the upper bound.",
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `A length is ${p.x} cm to 1 decimal place. Ben says the length could be ${r(p.x + 0.05)} cm.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${r(p.x + 0.05)} rounds up to ${r(p.x + 0.1)}, so the length is less than ${r(p.x + 0.05)} cm.`,
              correct: true,
            },
            {
              text: "True. The upper bound is included in the error interval.",
              code: "NPV.BOUNDS.ENDS",
            },
            {
              text: `True. Any length from ${r(p.x - 0.05)} to ${r(p.x + 0.05)} is possible.`,
              code: "NPV.BOUNDS.ENDS",
            },
          ],
          solution: [{ say: `Error interval: ${r(p.x - 0.05)} ≤ length < ${r(p.x + 0.05)}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.key.depth === 2)
      return Math.abs(numberAnswer(question) - (p.truncate ? p.x : p.x - 0.05)) < 1e-9;
    return true;
  },
});
