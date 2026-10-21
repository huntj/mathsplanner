/**
 * @statement Y7-PRO-02
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-PRO-02: Understand that the probabilities of all possible outcomes sum to 1
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** Probabilities in hundredths. */
  p: number;
  three: [number, number, number];
  claimTrue: boolean;
}

const dec = (h: number) => String(h / 100);

export default defineGenerator<Params>({
  id: "Y7-PRO-02",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.COMPLEMENT"],

  params(rng, numbers) {
    const p = numbers === "friendly" ? rng.int(1, 9) * 10 : rng.int(5, 95);
    const a = rng.int(1, 6) * 10 - (numbers === "stretch" ? rng.int(0, 9) : 0);
    const b = rng.int(1, 9 - Math.ceil(a / 10)) * 10;
    const c = 100 - a - b;
    if (p % 10 === 0 && numbers !== "friendly") reject("hundredths that need care");
    if (c <= 0 || a === b || b === c) reject("three different positive probabilities");
    return { p, three: [a, b, c], claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const answer = (100 - p.p) / 100;
        // 1 − 0.35 done digit by digit as 0.75.
        const slip =
          p.p % 10 !== 0
            ? Number(`0.${(10 - Math.floor(p.p / 10)) % 10}${(10 - (p.p % 10)) % 10}`)
            : undefined;
        return A.standard({
          question: ["The probability that it rains tomorrow is ", A.math(dec(p.p)), "."],
          ask: "What is the probability that it does not rain tomorrow?",
          answer: A.number(answer),
          wrong: wrongs(answer, [
            slip !== undefined && Math.abs(slip - answer) > 1e-9
              ? {
                  code: "PRO.COMPLEMENT",
                  value: A.number(slip),
                  feedback: `Raining and not raining add up to 1: 1 − ${dec(p.p)} = ${answer}. Check by adding back.`,
                }
              : undefined,
          ]),
          solution: [
            {
              say: `It either rains or it does not, so the probabilities add up to 1: 1 − ${dec(p.p)} = ${answer}.`,
            },
          ],
        });
      }
      case 2: {
        const [a, b, c] = p.three;
        return A.standard({
          question: [
            "A spinner can land on red, blue or green. The probability of red is ",
            A.math(dec(a)),
            " and the probability of blue is ",
            A.math(dec(b)),
            ".",
          ],
          ask: "What is the probability of green?",
          answer: A.number(c / 100),
          wrong: wrongs(c / 100, [
            {
              code: "PRO.COMPLEMENT",
              value: A.number((a + b) / 100),
              feedback: "The three probabilities add up to 1, so take red and blue away from 1.",
            },
          ]),
          solution: [
            { say: `${dec(a)} + ${dec(b)} = ${dec(a + b)}, and 1 − ${dec(a + b)} = ${dec(c)}.` },
          ],
        });
      }
      default: {
        const [a, b, c] = p.three;
        const shown = p.claimTrue ? c : c + 10;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "A spinner lands on red, blue or green. Ali says the probabilities are ",
            A.math(`${dec(a)},\\ ${dec(b)}\\text{ and }${dec(shown)}`),
            ".",
          ],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. They add up to ${dec(a)} + ${dec(b)} + ${dec(shown)} = 1, as the probabilities of all the outcomes must.`,
                  correct: true,
                },
                { text: "False. Probabilities of different colours must be equal." },
                { text: "False. They should add up to 100.", code: "PRO.COMPLEMENT" },
              ]
            : [
                {
                  text: `False. They add up to ${dec(a + b + shown)}, but the probabilities of all the outcomes must add up to 1.`,
                  correct: true,
                },
                {
                  text: "True. Any probabilities between 0 and 1 are possible.",
                  code: "PRO.COMPLEMENT",
                },
                { text: "True. Spinners can have any probabilities." },
              ],
          solution: [
            {
              say: "The outcomes cover everything that can happen, so their probabilities add up to 1.",
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype !== "standard") return true;
    return (
      Math.abs(
        numberAnswer(question) - (question.key.depth === 1 ? (100 - p.p) / 100 : p.three[2] / 100),
      ) < 1e-9
    );
  },
});
