/**
 * @statement Y7-RAT-05
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-RAT-05: Define percentage as 'number of parts per hundred'; interpret percentages and percentage
// changes as a fraction or a decimal
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  pc: number;
  up: boolean;
}

const PERCENTS = [3, 5, 8, 12, 15, 20, 25, 35, 40, 60, 75];

export default defineGenerator<Params>({
  id: "Y7-RAT-05",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.PERCENT.MULTIPLIER", "RAT.COMPOUND.SIMPLE"],

  params(rng, numbers) {
    return { pc: rng.pick(numbers === "friendly" ? [10, 20, 25, 50] : PERCENTS), up: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const m = Number(((100 + (p.up ? p.pc : -p.pc)) / 100).toFixed(2));
    const change = p.up ? "an increase" : "a decrease";
    const how = `${p.up ? "Increasing" : "Decreasing"} by ${p.pc}% leaves 100% ${p.up ? "+" : "−"} ${p.pc}% = ${100 + (p.up ? p.pc : -p.pc)}% of the original, which is × ${m}.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "What single number do you multiply by for ",
            change,
            " of ",
            A.math(`${p.pc}\\%`),
            "?",
          ],
          answer: A.number(m),
          wrong: wrongs(m, [
            {
              code: "RAT.PERCENT.MULTIPLIER",
              value: A.number(p.pc / 100),
              feedback: `× ${p.pc / 100} finds ${p.pc}% of the amount, not the amount after the change.`,
            },
          ]),
          solution: [{ say: how }],
        });
      case 2: {
        const other = 100 - p.pc;
        return A.choice({
          rng,
          archetype: "reverse",
          question: ["A price is multiplied by ", A.math(String(m)), "."],
          ask: "What percentage change is this?",
          correct: `${change} of ${p.pc}%`,
          distractors: [
            {
              content: `${p.up ? "a decrease" : "an increase"} of ${p.pc}%`,
              feedback: `${m} is ${p.up ? "more" : "less"} than 1, so the price ${p.up ? "goes up" : "goes down"}.`,
            },
            ...(p.up || other === p.pc
              ? []
              : [
                  {
                    content: `a decrease of ${other}%`,
                    code: "RAT.PERCENT.MULTIPLIER",
                    feedback: `× ${m} keeps ${other}% of the price, so ${p.pc}% is taken off.`,
                  },
                ]),
            ...(p.up
              ? [
                  {
                    content: `an increase of ${100 + p.pc}%`,
                    code: "RAT.PERCENT.MULTIPLIER",
                    feedback: `× ${m} makes the price ${100 + p.pc}% of what it was: ${p.pc}% more.`,
                  },
                ]
              : []),
          ],
          solution: [{ say: how }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: `A price goes up by ${p.pc}% and then down by ${p.pc}%. Noor says it is back to where it started.`,
          truth: false,
          reasons: [
            {
              text: `False. The decrease is ${p.pc}% of the bigger price, so more comes off than went on: × ${(100 + p.pc) / 100} × ${(100 - p.pc) / 100} = × ${Number((((100 + p.pc) * (100 - p.pc)) / 10000).toFixed(4))}.`,
              correct: true,
            },
            { text: `True. +${p.pc}% and −${p.pc}% cancel out.`, code: "RAT.COMPOUND.SIMPLE" },
            { text: "True. Percentages always cancel when you do the opposite." },
          ],
          solution: [
            {
              say: `For £100: up ${p.pc}% gives £${100 + p.pc}, then down ${p.pc}% gives £${Number((((100 + p.pc) * (100 - p.pc)) / 100).toFixed(2))}.`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.archetype === "standard")
      return Math.abs(numberAnswer(question) - (100 + (p.up ? p.pc : -p.pc)) / 100) < 1e-9;
    if (question.archetype === "reverse")
      return chosenText(question) === `${p.up ? "an increase" : "a decrease"} of ${p.pc}%`;
    return true;
  },
});
