/**
 * @statement GF-R11.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R11.b: Use rates of pay and unit pricing
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  rate: number;
  hours: number;
  a: number;
  pa: number;
  b: number;
  pb: number;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export default defineGenerator<Params>({
  id: "GF-R11.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.COMPOUND-UNIT.ARRANGEMENT"],

  params(rng) {
    const p = {
      rate: rng.int(22, 60) / 2,
      hours: rng.int(4, 40),
      a: rng.pick([200, 250, 400, 500]),
      pa: rng.int(80, 300),
      b: rng.pick([600, 750, 1000, 1200]),
      pb: rng.int(200, 700),
    };
    const ua = p.pa / p.a;
    const ub = p.pb / p.b;
    if (Math.abs(ua - ub) < 0.02 * ua || p.pb <= p.pa)
      reject("a clear best buy, with the bigger pack dearer");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const pay = r2(p.rate * p.hours);
        return A.standard({
          question: [`Sol earns £${pay.toFixed(2)} for ${p.hours} hours of work.`],
          ask: "What is his hourly rate of pay, in pounds?",
          answer: A.number(p.rate, { units: "£" }),
          wrong: wrongs(p.rate, [
            {
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              value: A.number(r2(pay * p.hours), { units: "£" }),
              feedback: "Pounds per hour: divide the pay by the hours.",
            },
          ]),
          solution: [
            { say: "", math: `${pay.toFixed(2)} \\div ${p.hours} = ${p.rate.toFixed(2)}` },
          ],
        });
      }
      case 2: {
        const better = p.pa / p.a < p.pb / p.b ? "small" : "large";
        const words = { small: `The ${p.a} g pack`, large: `The ${p.b} g pack` };
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `Rice comes in a ${p.a} g pack for £${(p.pa / 100).toFixed(2)} and a ${p.b} g pack for £${(p.pb / 100).toFixed(2)}.`,
          ],
          ask: "Which is the better value?",
          correct: words[better],
          distractors: [
            {
              content: words[better === "small" ? "large" : "small"],
              code: "RAT.COMPOUND-UNIT.ARRANGEMENT",
              feedback:
                "Compare the price per gram (or grams per penny), not the prices or the sizes alone.",
            },
            {
              content: "They are the same value",
              feedback: "Work out the price of 100 g for each pack.",
            },
          ],
          solution: [
            { say: `Per 100 g: ${r2((p.pa / p.a) * 100)}p and ${r2((p.pb / p.b) * 100)}p.` },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: ["The bigger pack of something is better value."],
          truth: "sometimes",
          reasons: [
            {
              text: "Sometimes. It is often cheaper per gram, but not always: you have to compare the unit prices.",
              correct: true,
            },
            { text: "Always. You get more for your money.", code: "RAT.COMPOUND-UNIT.ARRANGEMENT" },
            { text: "Never. Bigger packs cost more." },
          ],
          solution: [{ say: "Divide price by quantity for each pack, then compare." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.rate;
    if (question.key.depth === 2)
      return (
        chosenText(question) ===
        (p.pa / p.a < p.pb / p.b ? `The ${p.a} g pack` : `The ${p.b} g pack`)
      );
    return true;
  },
});
