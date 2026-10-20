/**
 * @statement Y8-NPV-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y8-NPV-01: Interpret and compare numbers in standard form A × 10ⁿ, 1 ≤ A < 10, where n is a
// positive or negative integer or zero
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { numberAnswer } from "../shared/counting.ts";
import {
  ordinary,
  ordinaryValue,
  sfDisplay,
  sfLatex,
  standardForm,
} from "../shared/standard-form.ts";

interface Params {
  /** The number is sig × 10^shift; sig has 2 or 3 digits and does not end in 0. */
  sig: number;
  power: number;
  /** Three numbers to match, as [sig, power]. */
  set: [number, number][];
  /** Depth 4: mantissas as tenths (big > small) and powers (low < high). */
  big: number;
  small: number;
  low: number;
  high: number;
  claimTrue: boolean;
}

const shiftOf = (sig: number, power: number) => power - (String(sig).length - 1);
const sup = (n: number) =>
  [...String(n)].map((c) => (c === "-" ? "⁻" : "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(c)])).join("");
const tenths = (t: number) => (t % 10 === 0 ? String(t / 10) : (t / 10).toFixed(1));

function pickSig(rng: { int(a: number, b: number): number }, three: boolean): number {
  const sig = three ? rng.int(101, 999) : rng.int(11, 99);
  return sig % 10 === 0 ? sig + 1 : sig;
}

export default defineGenerator<Params>({
  id: "Y8-NPV-01",
  version: "1.0.0",
  depths: [1, 2, 3, 4],
  misconceptions: ["NPV.STANDARD-FORM.POWER", "NPV.STANDARD-FORM.COMPARE-FIRST"],

  params(rng, numbers) {
    const powers =
      numbers === "friendly"
        ? [3, 4, 5, 6]
        : numbers === "standard"
          ? [-5, -4, -3, -2, 3, 4, 5, 6, 7]
          : [-9, -7, -6, -5, -4, 5, 6, 8, 9, 11];
    const power = rng.pick(powers);
    const sig = pickSig(rng, numbers !== "friendly" && rng.bool());
    const chosen = rng.shuffle(powers).slice(0, 3);
    const set = chosen.map((p) => [pickSig(rng, false), p] as [number, number]);
    const big = rng.int(30, 98);
    const small = rng.int(11, big - 10);
    const low = rng.pick(powers);
    if (big % 10 === 0 || small % 10 === 0) reject("mantissas with one decimal place");
    return { sig, power, set, big, small, low, high: low + rng.int(1, 3), claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const shift = shiftOf(p.sig, p.power);
    const sf = standardForm(p.sig, shift);
    const plain = ordinary(p.sig, shift);
    const moves = `${Math.abs(p.power)} place${Math.abs(p.power) === 1 ? "" : "s"}`;
    const why = `${sf.mantissa} is between 1 and 10. To get from ${sf.mantissa} to ${plain.replace(/\{,\}/g, ",")} the digits move ${moves} ${p.power > 0 ? "left, so the power is" : "right, so the power is"} ${p.power}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["Write ", A.math(plain), " in standard form."],
          answer: A.exact(sf.latex, "standard-form"),
          wrong: [
            {
              code: "NPV.STANDARD-FORM.POWER",
              value: A.exact(sfLatex(sf.mantissa, p.power + 1)),
              feedback:
                p.power > 0
                  ? "The power is how many places the digits move, not how many digits there are before the point."
                  : "The power is how many places the digits move, which is one more than the zeros after the point.",
            },
          ],
          solution: [{ say: why, math: `${plain} = ${sf.display}` }],
        });
      case 2: {
        // Writing the power as that many zeros: 3.45 × 10⁴ as 34 500 000 or 3.45 × 10⁻⁴ as 0.0000345.
        const zeros =
          p.power > 0 ? ordinary(p.sig, p.power) : ordinary(p.sig, p.power - String(p.sig).length);
        return A.reverse({
          question: ["Write ", A.math(sf.display), " as an ordinary number."],
          answer: A.number(ordinaryValue(plain)),
          wrong: [
            {
              code: "NPV.STANDARD-FORM.POWER",
              value: A.number(ordinaryValue(zeros)),
              feedback: `The power tells you how many places to move the digits, not how many zeros to write. Move them ${moves} ${p.power > 0 ? "left" : "right"}.`,
            },
          ],
          solution: [{ say: why, math: `${sf.display} = ${plain}` }],
        });
      }
      case 3:
        return A.matchRepresentations({
          rng,
          question: "Match each number in standard form to its ordinary number.",
          pairs: p.set.map(
            ([s, pw]) =>
              [
                A.math(standardForm(s, shiftOf(s, pw)).display),
                A.math(ordinary(s, shiftOf(s, pw))),
              ] as [A.RichInput, A.RichInput],
          ),
          solution: p.set.map(([s, pw]) => ({
            say: `Move the digits ${Math.abs(pw)} places ${pw > 0 ? "left" : "right"}:`,
            math: `${standardForm(s, shiftOf(s, pw)).display} = ${ordinary(s, shiftOf(s, pw))}`,
          })),
        });
      default: {
        // X has the bigger power but the smaller first number.
        const x = sfDisplay(tenths(p.small), p.high);
        const y = sfDisplay(tenths(p.big), p.low);
        const [first, second] = p.claimTrue ? [x, y] : [y, x];
        return A.trueOrFalseWhy({
          rng,
          statement: [A.math(first), " is bigger than ", A.math(second), "."],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. Compare the powers first: 10${sup(p.high)} is bigger than 10${sup(p.low)}, and the first numbers are both between 1 and 10.`,
                  correct: true,
                },
                {
                  text: `False: ${tenths(p.big)} is bigger than ${tenths(p.small)}.`,
                  code: "NPV.STANDARD-FORM.COMPARE-FIRST",
                },
                { text: "You cannot compare numbers with different powers." },
              ]
            : [
                {
                  text: `False. Compare the powers first: 10${sup(p.low)} is smaller than 10${sup(p.high)}, so ${tenths(p.big)} × 10${sup(p.low)} is the smaller number.`,
                  correct: true,
                },
                {
                  text: `True: ${tenths(p.big)} is bigger than ${tenths(p.small)}.`,
                  code: "NPV.STANDARD-FORM.COMPARE-FIRST",
                },
                { text: "You cannot compare numbers with different powers." },
              ],
          solution: [
            {
              say: "In standard form the power of ten decides the size first. Only when the powers are equal do you compare the first numbers.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const value = p.sig * 10 ** shiftOf(p.sig, p.power);
    const close = (v: number) => Math.abs(v - value) <= Math.abs(value) * 1e-12;
    if (question.archetype === "reverse") return close(numberAnswer(question));
    if (question.archetype === "standard") {
      const a = question.parts[0]?.answer;
      if (a?.type !== "exact") return false;
      const m = /^(\d(?:\.\d+)?)\\times10\^\{(-?\d+)\}$/.exec(a.value);
      return m !== null && close(Number(m[1]) * 10 ** Number(m[2]));
    }
    if (question.archetype === "true-or-false-why") return p.small < p.big && p.low < p.high;
    return true;
  },
});
