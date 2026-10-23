/**
 * @statement Y5-FR-09.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the primary sub-statements
 */
// Y5-FR-09.a: Read and write numbers with up to three decimal places
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

const PLACE = ["tenths", "hundredths", "thousandths"];

interface Params {
  whole: number;
  digits: [number, number, number];
  /** Depth 1: which decimal place to ask about. */
  place: number;
}

export default defineGenerator<Params>({
  id: "Y5-FR-09.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["FR.DECIMAL.PLACE"],

  params(rng) {
    const digits = [rng.int(1, 9), rng.int(1, 9), rng.int(1, 9)] as [number, number, number];
    if (new Set(digits).size < 3) reject("three different digits");
    return { whole: rng.int(1, 19), digits, place: rng.int(0, 2) };
  },

  build(p, depth, rng): QuestionDraft {
    const [t, h, th] = p.digits;
    const shown = `${p.whole}.${t}${h}${th}`;
    switch (depth) {
      case 1: {
        const d = p.digits[p.place] ?? 1;
        const right = `${d} ${PLACE[p.place]}`;
        return A.choice({
          rng,
          question: ["Look at the number ", A.math(shown), "."],
          ask: `What is the value of the digit ${d}?`,
          correct: right,
          distractors: [0, 1, 2]
            .filter((i) => i !== p.place)
            .map((i) => ({
              content: `${d} ${PLACE[i]}`,
              code: "FR.DECIMAL.PLACE",
              feedback: `After the point come tenths, then hundredths, then thousandths. The ${d} is in place ${p.place + 1}.`,
            })),
          solution: [{ say: `The ${d} is in the ${PLACE[p.place]} place.` }],
        });
      }
      case 2: {
        const value = Number(shown);
        return A.standard({
          question: [
            "Write this as a decimal: ",
            A.math(`${p.whole} + ${t / 10} + ${h / 100} + ${th / 1000}`),
            ".",
          ],
          answer: A.number(value),
          wrong: wrongs(value, [
            {
              code: "FR.DECIMAL.PLACE",
              value: A.number(Number(`${p.whole}.${t}0${h}0${th}`)),
              feedback:
                "Each digit has its own place: tenths, then hundredths, then thousandths, with no gaps.",
            },
          ]),
          solution: [
            {
              say: `${p.whole} ones, ${t} tenths, ${h} hundredths and ${th} thousandths: ${shown}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Nia reads ", A.math(`${p.whole}.0${h}`), ` as "${p.whole} point ${h}".`],
          truth: false,
          reasons: [
            {
              text: `False. The 0 holds the tenths place, so it is ${p.whole} point zero ${h}: ${h} hundredths, not ${h} tenths.`,
              correct: true,
            },
            { text: "True. Zeros after the point do not matter.", code: "FR.DECIMAL.PLACE" },
            {
              text: `True. ${p.whole}.0${h} and ${p.whole}.${h} are the same number.`,
              code: "FR.DECIMAL.PLACE",
            },
          ],
          solution: [
            {
              say: `${p.whole}.0${h} is ${p.whole} and ${h} hundredths; ${p.whole}.${h} is ${p.whole} and ${h} tenths.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question).endsWith(PLACE[p.place] ?? "");
    if (question.key.depth === 2)
      return Math.abs(numberAnswer(question) - Number(`${p.whole}.${p.digits.join("")}`)) < 1e-9;
    return true;
  },
});
