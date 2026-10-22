/**
 * @statement CM-P7
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// CM-P7: Interpret risk as probability × cost or benefit and compare risks in finance, insurance and
// trading
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";

interface Params {
  p: number;
  cost: number;
  premA: number;
  excessA: number;
  premB: number;
  excessB: number;
  q: number;
}

const expected = (prem: number, excess: number, q: number) => prem + (q / 100) * excess;

export default defineGenerator<Params>({
  id: "CM-P7",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["PRO.RISK"],

  params(rng) {
    const p = {
      p: rng.pick([1, 2, 4, 5, 10, 20]),
      cost: 100 * rng.int(5, 80),
      premA: 10 * rng.int(15, 40),
      excessA: 50 * rng.int(1, 4),
      premB: 10 * rng.int(15, 40),
      excessB: 50 * rng.int(4, 20),
      q: rng.pick([5, 10, 20, 25, 30]),
    };
    const a = expected(p.premA, p.excessA, p.q);
    const b = expected(p.premB, p.excessB, p.q);
    if (p.premA === p.premB || Math.abs(a - b) < 10 || p.premA < p.premB === a < b)
      reject("a cheaper premium that is not the cheaper option overall");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = (p.p / 100) * p.cost;
        return A.standard({
          question: [
            `A shop estimates a ${p.p}% chance each year that a flood causes £${p.cost} of damage.`,
          ],
          ask: "Find the expected annual cost of flood damage, in pounds.",
          answer: A.number(v, { units: "£" }),
          wrong: wrongs(v, [
            {
              code: "PRO.RISK",
              value: A.number(p.cost, { units: "£" }),
              feedback: "Risk (expected cost) = probability × cost.",
            },
          ]),
          solution: [{ say: "", math: `${p.p / 100} \\times ${p.cost} = ${v}` }],
        });
      }
      case 2: {
        const a = expected(p.premA, p.excessA, p.q);
        const b = expected(p.premB, p.excessB, p.q);
        const right = a < b ? "Policy A" : "Policy B";
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            `Policy A costs £${p.premA} a year with a £${p.excessA} excess. Policy B costs £${p.premB} a year with a £${p.excessB} excess. The chance of making a claim in a year is ${p.q}%.`,
          ],
          ask: "Which policy has the lower expected yearly cost (premium plus expected excess)?",
          correct: right,
          distractors: [
            {
              content: right === "Policy A" ? "Policy B" : "Policy A",
              code: "PRO.RISK",
              feedback: `Include the expected excess: A costs ${a} and B costs ${b} on average.`,
            },
            {
              content: "They cost the same on average",
              code: "PRO.RISK",
              feedback: `Work out premium + ${p.q / 100} × excess for each.`,
            },
          ],
          solution: [
            {
              say: `A: ${p.premA} + ${p.q / 100} × ${p.excessA} = ${a}. B: ${p.premB} + ${p.q / 100} × ${p.excessB} = ${b}.`,
            },
          ],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Xen says a 1% chance of losing £50 000 is a smaller risk than a 10% chance of losing £1000, because 1% is smaller.",
          ],
          truth: false,
          reasons: [
            {
              text: "False. Compare expected losses: 0.01 × £50 000 = £500, but 0.1 × £1000 = £100. The rarer event is the bigger risk here.",
              correct: true,
            },
            { text: "True. A smaller probability always means a smaller risk.", code: "PRO.RISK" },
            { text: "True. Only the size of the loss matters.", code: "PRO.RISK" },
          ],
          solution: [{ say: "Risk combines how likely something is with how much it costs." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === (p.p / 100) * p.cost;
    if (question.key.depth === 2)
      return (
        chosenText(question) ===
        (expected(p.premA, p.excessA, p.q) < expected(p.premB, p.excessB, p.q)
          ? "Policy A"
          : "Policy B")
      );
    return true;
  },
});
