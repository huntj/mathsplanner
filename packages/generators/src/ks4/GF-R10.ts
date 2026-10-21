/**
 * @statement GF-R10
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-R10: Solve problems involving direct and inverse proportion, including graphical and algebraic
// representations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  n1: number;
  cost: number;
  n2: number;
  workers: number;
  days: number;
  more: number;
  k: number;
  x1: number;
  x2: number;
}

const r2 = (x: number) => Math.round(x * 100) / 100;

export default defineGenerator<Params>({
  id: "GF-R10",
  version: "1.0.0",
  depths: [1, 2, 4, 5],
  misconceptions: ["RAT.INVERSE.AS-DIRECT", "RAT.ADDITIVE"],

  params(rng) {
    const n1 = rng.int(3, 8);
    const unit = rng.int(25, 150);
    const n2 = rng.int(2, 15);
    const workers = rng.int(2, 6);
    const more = rng.int(2, 8);
    const days = rng.int(3, 12) * more;
    if (n1 === n2 || more === workers || (workers * days) % more !== 0)
      reject("whole-number answers");
    return {
      n1,
      cost: n1 * unit,
      n2,
      workers,
      days,
      more,
      k: rng.int(2, 9),
      x1: rng.int(2, 6),
      x2: rng.int(7, 12),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const each = p.cost / p.n1;
        const total = r2((each * p.n2) / 100);
        return A.standard({
          question: `${p.n1} pens cost £${(p.cost / 100).toFixed(2)}.`,
          ask: `How much do ${p.n2} pens cost?`,
          answer: A.number(total, { units: "£" }),
          wrong: wrongs(total, [
            {
              code: "RAT.ADDITIVE",
              value: A.number(r2((p.cost + (p.n2 - p.n1) * 100) / 100)),
              feedback: "Find the cost of 1 pen first, then multiply.",
            },
          ]),
          solution: [
            {
              say: `1 pen costs ${each}p, so ${p.n2} pens cost ${each * p.n2}p = £${total.toFixed(2)}.`,
            },
          ],
        });
      }
      case 2: {
        const newDays = (p.workers * p.days) / p.more;
        return A.standard({
          question: `${p.workers} builders take ${p.days} days to build a wall. All builders work at the same rate.`,
          ask: `How long would ${p.more} builders take?`,
          answer: A.number(newDays, { units: "days" }),
          wrong: wrongs(newDays, [
            {
              code: "RAT.INVERSE.AS-DIRECT",
              value: A.number(r2((p.days * p.more) / p.workers)),
              feedback: "More builders finish faster: this is inverse proportion.",
            },
          ]),
          solution: [
            {
              say: `Total work = ${p.workers} × ${p.days} = ${p.workers * p.days} builder-days. ${p.workers * p.days} ÷ ${p.more} = ${newDays} days.`,
            },
          ],
        });
      }
      case 4:
        return A.trueOrFalseWhy({
          rng,
          statement:
            "Kit says that if y is inversely proportional to x, then when x doubles, y doubles too.",
          truth: false,
          reasons: [
            {
              text: "False. In inverse proportion xy stays constant, so when x doubles, y halves.",
              correct: true,
            },
            {
              text: "True. Proportional quantities always change in the same way.",
              code: "RAT.INVERSE.AS-DIRECT",
            },
            { text: "True. Both go up together.", code: "RAT.INVERSE.AS-DIRECT" },
          ],
          solution: [
            { say: "Direct: y = kx, doubling x doubles y. Inverse: y = k/x, doubling x halves y." },
          ],
        });
      default: {
        const y1 = p.k * p.x1;
        const y2 = p.k * p.x2;
        return A.multiStepContext({
          context: `y is directly proportional to x. When x = ${p.x1}, y = ${y1}.`,
          parts: [
            {
              ask: "Find the value of k in y = kx.",
              answer: A.number(p.k),
              wrong: wrongs(p.k, [
                { code: "RAT.ADDITIVE", value: A.number(y1 - p.x1), feedback: "k = y ÷ x." },
              ]),
            },
            {
              ask: `Find y when x = ${p.x2}.`,
              answer: A.number(y2),
              wrong: wrongs(y2, [
                {
                  code: "RAT.ADDITIVE",
                  value: A.number(y1 + p.x2 - p.x1),
                  feedback: `Use y = ${p.k}x.`,
                },
              ]),
            },
          ],
          solution: [
            { say: `k = ${y1} ÷ ${p.x1} = ${p.k}.` },
            { say: `y = ${p.k} × ${p.x2} = ${y2}.` },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "multi-step-context") return numberAnswer(question) === p.k;
    if (question.archetype === "standard" && question.key.depth === 2)
      return numberAnswer(question) * p.more === p.workers * p.days;
    if (question.archetype === "standard")
      return Math.abs(numberAnswer(question) * 100 - (p.cost / p.n1) * p.n2) < 1e-6;
    return true;
  },
});
