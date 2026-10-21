/**
 * @statement Y6-FR-07
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y6-FR-07: Identify the value of each digit in numbers given to three decimal places and multiply and
// divide by 10, 100 and 1000 giving answers up to three decimal places
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  /** A number with three decimal places, as thousandths. */
  m: number;
  /** Which decimal place to ask about: 1 tenths, 2 hundredths, 3 thousandths. */
  place: number;
  /** Depth 1: a number with up to 2 places divided or multiplied by 10^k. */
  x: number;
  dp: number;
  k: number;
  times: boolean;
}

const NAMES = ["", "tenths", "hundredths", "thousandths"];
const exactly = (m: number, e: number) => Number(`${m}e${e}`);

export default defineGenerator<Params>({
  id: "Y6-FR-07",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.POWERS10.WRONG-WAY", "FR.DECIMAL.PLACE", "NPV.POWERS10.APPEND-ZEROS"],

  params(rng, numbers) {
    const m = rng.int(1001, numbers === "stretch" ? 99999 : 9999);
    const place = rng.int(1, 3);
    const digits = String(m).slice(-3);
    if (new Set(digits).size < 3 || digits.includes("0"))
      reject("three different non-zero decimal digits");
    const dp = rng.int(0, 2);
    const k = rng.int(1, 3);
    const times = rng.bool();
    const x = rng.int(11, 999);
    if (x % 10 === 0 || (!times && dp + k > 3)) reject("answers up to three decimal places");
    return { m, place, x, dp, k, times };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const start = exactly(p.x, -p.dp);
        const answer = exactly(p.x, p.times ? p.k - p.dp : -p.k - p.dp);
        const power = 10 ** p.k;
        return A.standard({
          question: [A.math(`${start} ${p.times ? "\\times" : "\\div"} ${power}`)],
          ask: "Work it out.",
          answer: A.number(answer),
          wrong: wrongs(answer, [
            {
              code: "NPV.POWERS10.WRONG-WAY",
              value: A.number(exactly(p.x, p.times ? -p.k - p.dp : p.k - p.dp)),
              feedback: p.times
                ? "Multiplying by 10, 100 or 1000 makes the number bigger."
                : "Dividing by 10, 100 or 1000 makes the number smaller.",
            },
          ]),
          solution: [
            {
              say: `${p.times ? "×" : "÷"} ${power} moves every digit ${p.k} place${p.k === 1 ? "" : "s"} to the ${p.times ? "left" : "right"}: ${answer}.`,
            },
          ],
        });
      }
      case 2: {
        const x = (p.m / 1000).toFixed(3);
        const digit = x.split(".")[1]?.[p.place - 1] ?? "1";
        const correct = `${digit} ${NAMES[p.place]}`;
        const others = [1, 2, 3].filter((k) => k !== p.place).map((k) => `${digit} ${NAMES[k]}`);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: ["Look at the number ", A.math(x), "."],
          ask: `What is the value of the digit ${digit}?`,
          correct,
          distractors: [
            ...others.map((content) => ({
              content,
              code: "FR.DECIMAL.PLACE",
              feedback: `Count the places after the point: tenths, hundredths, thousandths. The ${digit} is in the ${NAMES[p.place]}.`,
            })),
            { content: `${digit} ones`, feedback: "The digit is after the decimal point." },
          ],
          solution: [
            {
              say: `In ${x}, the digits after the point are tenths, hundredths and thousandths, so the ${digit} is worth ${correct}.`,
            },
          ],
        });
      }
      default: {
        const x = (p.m / 1000).toFixed(3);
        const power = 10 ** p.k;
        const appended = `${x}${"0".repeat(p.k)}`;
        return A.trueOrFalseWhy({
          rng,
          statement: ["Zara says ", A.math(`${x} \\times ${power} = ${appended}`), "."],
          truth: false,
          reasons: [
            {
              text: `False. ${appended} is the same as ${x}. Multiplying by ${power} moves the digits ${p.k} place${p.k === 1 ? "" : "s"} left: ${exactly(p.m, p.k - 3)}.`,
              correct: true,
            },
            {
              text: `True. Multiplying by ${power} puts ${p.k === 1 ? "a zero" : `${p.k} zeros`} on the end.`,
              code: "NPV.POWERS10.APPEND-ZEROS",
            },
            { text: "True. The answer has more digits, so it is bigger." },
          ],
          solution: [{ say: `${x} × ${power} = ${exactly(p.m, p.k - 3)}.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") {
      const start = p.x / 10 ** p.dp;
      return (
        Math.abs(numberAnswer(question) - (p.times ? start * 10 ** p.k : start / 10 ** p.k)) < 1e-9
      );
    }
    if (question.archetype === "varied-form")
      return chosenText(question).endsWith(NAMES[p.place] ?? "");
    return true;
  },
});
