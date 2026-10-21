/**
 * @statement Y9-RAT-01
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y9-RAT-01: Solve problems involving inverse proportion
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  /** w1 workers take d1 days; w2 workers take d2 days; w1 × d1 = w2 × d2. */
  w1: number;
  w2: number;
  total: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "Y9-RAT-01",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.INVERSE.AS-DIRECT"],

  params(rng, numbers) {
    const w1 = rng.int(2, 8);
    const w2 = rng.int(2, numbers === "stretch" ? 15 : 10);
    const total = w1 * w2 * rng.int(1, numbers === "friendly" ? 3 : 6);
    if (w1 === w2) reject("a different number of workers");
    return { w1, w2, total, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const [d1, d2] = [p.total / p.w1, p.total / p.w2];
    const how = `The total work is ${p.w1} × ${d1} = ${p.total} worker-days. With ${p.w2} workers: ${p.total} ÷ ${p.w2} = ${d2} days.`;
    switch (depth) {
      case 1:
        return A.standard({
          question: `${p.w1} builders take ${d1} days to build a wall. Every builder works at the same rate.`,
          ask: `How many days would ${p.w2} builders take?`,
          answer: A.number(d2),
          wrong: wrongs(d2, [
            {
              code: "RAT.INVERSE.AS-DIRECT",
              value: A.number(Number(((d1 * p.w2) / p.w1).toFixed(4))),
              feedback: `${p.w2 > p.w1 ? "More builders finish sooner" : "Fewer builders take longer"}: when the number of builders goes up, the number of days goes down.`,
            },
          ]),
          solution: [{ say: how }],
        });
      case 2: {
        const [x1, y1, x2] = [p.w1, d1, p.w2];
        return A.standard({
          question: [
            "y is inversely proportional to x. When ",
            A.math(`x = ${x1}`),
            ", ",
            A.math(`y = ${y1}`),
            ".",
          ],
          ask: ["Find y when ", A.math(`x = ${x2}`), "."],
          answer: A.number(d2),
          wrong: wrongs(d2, [
            {
              code: "RAT.INVERSE.AS-DIRECT",
              value: A.number(Number(((y1 * x2) / x1).toFixed(4))),
              feedback:
                "In inverse proportion, xy stays the same: when x is multiplied, y is divided.",
            },
          ]),
          solution: [
            {
              say: `y = k ÷ x with k = ${x1} × ${y1} = ${p.total}. So y = ${p.total} ÷ ${x2} = ${d2}.`,
            },
          ],
        });
      }
      default: {
        const more = Math.max(p.w1, p.w2);
        const less = Math.min(p.w1, p.w2);
        const days = p.total / less;
        const shown = p.claimTrue ? p.total / more : (days * more) / less;
        return A.trueOrFalseWhy({
          rng,
          statement: `${less} builders take ${days} days to build a wall. Lou says ${more} builders would take ${Number(shown.toFixed(2))} days.`,
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. More builders take less time: ${less} × ${days} = ${p.total} worker-days, and ${p.total} ÷ ${more} = ${p.total / more}.`,
                  correct: true,
                },
                { text: "False. More builders means more days.", code: "RAT.INVERSE.AS-DIRECT" },
                { text: "False. The number of builders does not change the time." },
              ]
            : [
                {
                  text: `False. More builders take less time: ${p.total} worker-days ÷ ${more} = ${p.total / more} days.`,
                  correct: true,
                },
                {
                  text: `True. There are ${more / less === Math.round(more / less) ? `${more / less} times` : "more"} builders, so it takes more days.`,
                  code: "RAT.INVERSE.AS-DIRECT",
                },
                { text: "True. Bigger jobs always take longer." },
              ],
          solution: [{ say: `${less} × ${days} = ${p.total} worker-days.` }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "true-or-false-why") return true;
    return numberAnswer(question) * p.w2 === p.total;
  },
});
