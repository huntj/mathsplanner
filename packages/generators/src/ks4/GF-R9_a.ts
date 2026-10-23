/**
 * @statement GF-R9.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-R9.a: Calculate percentage change
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

const PCTS = [5, 10, 15, 20, 25, 30, 40, 60];

interface Params {
  old: number;
  pct: number;
  down: number;
}

const r1 = (v: number) => Math.round(v * 10) / 10;

export default defineGenerator<Params>({
  id: "GF-R9.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["RAT.PERCENT.CHANGE-BASE"],

  params(rng) {
    return { old: rng.int(4, 40) * 5, pct: rng.pick(PCTS), down: rng.pick([10, 20, 25, 40, 50]) };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const now = (p.old * (100 + p.pct)) / 100;
        const change = now - p.old;
        return A.standard({
          question: [`A price rises from £${p.old} to £${now}.`],
          ask: "Find the percentage increase.",
          answer: A.number(p.pct, { units: "%" }),
          wrong: wrongs(p.pct, [
            {
              code: "RAT.PERCENT.CHANGE-BASE",
              value: A.number(r1((change / now) * 100), { units: "%" }),
              feedback: `Divide the increase by the original price, £${p.old}.`,
            },
          ]),
          solution: [{ say: "", math: `\\frac{${change}}{${p.old}} \\times 100 = ${p.pct}\\%` }],
        });
      }
      case 2: {
        const now = (p.old * (100 - p.down)) / 100;
        const change = p.old - now;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [`A town's population falls from ${p.old * 100} to ${now * 100}.`],
              ask: "Find the percentage decrease.",
            },
            {
              question: [`A coat is reduced from £${p.old} to £${now}.`],
              ask: "Find the percentage reduction.",
            },
          ],
          answer: A.number(p.down, { units: "%" }),
          wrong: wrongs(p.down, [
            {
              code: "RAT.PERCENT.CHANGE-BASE",
              value: A.number(r1((change / now) * 100), { units: "%" }),
              feedback: "Divide the decrease by the original value, before the change.",
            },
          ]),
          solution: [{ say: "Decrease ÷ original × 100: ", math: `${p.down}\\%` }],
        });
      }
      default: {
        const now = (p.old * (100 + p.pct)) / 100;
        const back = r1(((now - p.old) / now) * 100);
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `A price goes up from £${p.old} to £${now}, then back down to £${p.old}. Tom says the rise and the fall are both ${p.pct}%.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. The fall is £${now - p.old} out of £${now}, which is about ${back}%: a smaller percentage of a bigger amount.`,
              correct: true,
            },
            {
              text: "True. The amount of money is the same both ways.",
              code: "RAT.PERCENT.CHANGE-BASE",
            },
            { text: "True. Going back undoes the percentage.", code: "RAT.PERCENT.CHANGE-BASE" },
          ],
          solution: [{ say: "A percentage change always uses the value before that change." }],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.pct;
    if (question.key.depth === 2) return numberAnswer(question) === p.down;
    return true;
  },
});
