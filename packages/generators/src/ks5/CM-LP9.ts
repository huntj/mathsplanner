/**
 * @statement CM-LP9
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-LP9: Formulate problems as linear programs with up to three variables
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { chosenText } from "../shared/counting.ts";

interface Params {
  w: number[];
  hours: number;
  profit: number[];
}

const sum = (c: number[]) =>
  c.map((v, i) => `${v === 1 ? "" : v}${["x", "y", "z"][i]}`).join(" + ");

export default defineGenerator<Params>({
  id: "CM-LP9",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.LP"],

  params(rng) {
    const p = {
      w: [rng.int(1, 5), rng.int(1, 5), rng.int(1, 5)],
      hours: 10 * rng.int(6, 20),
      profit: [rng.int(2, 9), rng.int(2, 9), rng.int(2, 9)],
    };
    if (new Set(p.w).size < 3 || new Set(p.profit).size < 3 || p.w.join() === p.profit.join())
      reject("different coefficients");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const intro = `A bakery makes x loaves, y cakes and z pies each day. A loaf takes ${p.w[0]} minutes of oven time, a cake ${p.w[1]} minutes and a pie ${p.w[2]} minutes. There are ${p.hours} minutes of oven time each day. The profits are £${p.profit[0]}, £${p.profit[1]} and £${p.profit[2]} for each loaf, cake and pie.`;
    switch (depth) {
      case 1: {
        const right = `${sum(p.w)} \\le ${p.hours}`;
        return A.choice({
          rng,
          question: [intro],
          ask: "Which constraint models the oven time?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`${sum(p.w)} \\ge ${p.hours}`),
              code: "DEC.LP",
              feedback: "The time used must be no more than the time available: ≤.",
            },
            {
              content: A.math(`${sum(p.profit)} \\le ${p.hours}`),
              code: "DEC.LP",
              feedback: "Use the oven times, not the profits, for the oven constraint.",
            },
          ],
          solution: [{ say: "Total oven time ≤ time available: ", math: right }],
        });
      }
      case 2: {
        const right = `\\text{Maximise } P = ${sum(p.profit)}`;
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [intro],
          ask: "What is the objective?",
          correct: A.math(right),
          distractors: [
            {
              content: A.math(`\\text{Minimise } P = ${sum(p.profit)}`),
              code: "DEC.LP",
              feedback: "The bakery wants as much profit as possible.",
            },
            {
              content: A.math(`\\text{Maximise } P = ${sum(p.w)}`),
              code: "DEC.LP",
              feedback: "The objective uses the profit on each item.",
            },
          ],
          solution: [{ say: "Maximise the total profit: ", math: right }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Bea writes the constraints for the bakery and says there is no need for x ≥ 0, y ≥ 0, z ≥ 0.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Without the non-negativity constraints, the program could suggest making negative numbers of items, which is impossible.",
              correct: true,
            },
            { text: "True. The other constraints already stop negative values.", code: "DEC.LP" },
            { text: "True. Negative production just means buying items in.", code: "DEC.LP" },
          ],
          solution: [
            { say: "Always include x, y, z ≥ 0 in a linear program for real quantities." },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `${sum(p.w)} \\le ${p.hours}`;
    if (question.key.depth === 2)
      return chosenText(question).startsWith("\\text{Maximise } P = " + sum(p.profit));
    return true;
  },
});
