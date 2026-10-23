/**
 * @statement Y5-MD-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y5-MD-07: Multiply and divide whole numbers and decimals by 10, 100 and 1000
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

export interface Params {
  /** The number is m × 10^-d. */
  m: number;
  d: number;
  /** Multiply or divide by 10^k. */
  k: number;
  times: boolean;
}

/** m × 10^e, exactly, as a number. */
const scaled = (m: number, e: number) => Number(`${m}e${e}`);
const show = (x: number) => (x >= 1e-6 ? String(x) : x.toFixed(10).replace(/0+$/, ""));
/** Thousands commas in the whole-number part only. */
const tex = (x: number) => {
  const [whole = "", frac] = show(x).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+$)/g, "{,}");
  return frac === undefined ? grouped : `${grouped}.${frac}`;
};

export default defineGenerator<Params>({
  id: "Y5-MD-07",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.POWERS10.WRONG-WAY", "NPV.POWERS10.APPEND-ZEROS"],

  params(rng, numbers) {
    const d = numbers === "friendly" ? 0 : rng.int(numbers === "stretch" ? 1 : 0, 2);
    const m = rng.int(numbers === "friendly" ? 2 : 11, numbers === "stretch" ? 9999 : 999);
    const k = rng.int(1, numbers === "friendly" ? 2 : 3);
    const times = rng.bool();
    if (m % 10 === 0) reject("no trailing zero in the digits");
    if (!times && d === 0 && numbers === "friendly" && m < 10 ** k)
      reject("friendly answers are at least 1");
    return { m, d, k, times };
  },

  build(p, depth, rng): QuestionDraft {
    const x = scaled(p.m, -p.d);
    const power = 10 ** p.k;
    const answer = scaled(p.m, p.times ? p.k - p.d : -p.k - p.d);
    const reversed = scaled(p.m, p.times ? -p.k - p.d : p.k - p.d);
    const sign = p.times ? "\\times" : "\\div";
    const word = p.times ? "×" : "÷";
    const moves = `${p.k} place${p.k === 1 ? "" : "s"}`;
    const why = `${word} ${power} moves every digit ${moves} ${p.times ? "to the left" : "to the right"}: ${show(x)} ${word} ${power} = ${show(answer)}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [A.math(`${tex(x)} ${sign} ${power}`)],
          ask: "Work it out.",
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "NPV.POWERS10.WRONG-WAY",
              value: A.number(reversed),
              feedback: p.times
                ? "Multiplying by 10, 100 or 1000 makes the number bigger."
                : "Dividing by 10, 100 or 1000 makes the number smaller.",
            },
            ...(p.times && p.d > 0
              ? [
                  {
                    code: "NPV.POWERS10.APPEND-ZEROS",
                    value: A.number(x),
                    feedback:
                      "Writing zeros after the decimal part does not change the number. Move the digits instead.",
                  },
                ]
              : []),
          ]),
          solution: [{ say: why }],
        });
      case 2:
        return A.missingValue({
          intro: "Find the missing number.",
          relation: [x, sign, power, "=", tex(answer)],
          hide: 0,
          wrong: wrongs(x, [
            {
              code: "NPV.POWERS10.WRONG-WAY",
              value: A.number(scaled(p.m, p.times ? 2 * p.k - p.d : -2 * p.k - p.d)),
              feedback: `Undo ${word} ${power} with the inverse: ${p.times ? "divide" : "multiply"} ${show(answer)} by ${power}.`,
            },
          ]),
          solution: [
            {
              say: `Use the inverse: ${show(answer)} ${p.times ? "÷" : "×"} ${power} = ${show(x)}.`,
            },
          ],
        });
      default: {
        const decimal = scaled(p.m, -Math.max(1, p.d));
        const appended = `${show(decimal)}${"0".repeat(p.k)}`;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "To work out ",
            A.math(`${tex(decimal)} \\times ${power}`),
            `, Leah writes ${p.k === 1 ? "a zero" : `${p.k} zeros`} on the end: `,
            A.math(appended),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. ${appended} is still ${show(decimal)}. Multiplying by ${power} moves the digits ${moves} to the left: ${show(scaled(p.m, p.k - Math.max(1, p.d)))}.`,
              correct: true,
            },
            {
              text: "True. Multiplying by 10 always adds a zero.",
              code: "NPV.POWERS10.APPEND-ZEROS",
            },
            { text: "True. The answer has more digits, so it is bigger." },
          ],
          solution: [
            { say: `${show(decimal)} × ${power} = ${show(scaled(p.m, p.k - Math.max(1, p.d)))}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    const x = scaled(p.m, -p.d);
    const answer = p.times ? x * 10 ** p.k : x / 10 ** p.k;
    const close = (a: number, b: number) => Math.abs(a - b) <= Math.abs(b) * 1e-12;
    if (question.archetype === "standard") return close(numberAnswer(question), answer);
    if (question.archetype === "missing-value") return close(numberAnswer(question), x);
    return true;
  },
});
