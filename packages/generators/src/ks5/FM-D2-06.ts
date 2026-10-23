/**
 * @statement FM-D2-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// FM-D2-06: Solve recurrence relations and use decision trees for decision analysis
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { round } from "../shared/dist.ts";

export interface Params {
  pay: number[];
  prob: number[];
  a: number;
  b: number;
  u0: number;
}

const emv = (p: Params) =>
  round(
    p.pay.reduce((s, x, i) => s + x * ((p.prob[i] ?? 0) / 10), 0),
    2,
  );
const term = (p: Params, n: number) => {
  let u = p.u0;
  for (let k = 0; k < n; k++) u = p.a * u + p.b;
  return u;
};

export default defineGenerator<Params>({
  id: "FM-D2-06",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["DEC.DECISION-TREE", "ALG.RECURRENCE"],

  params(rng) {
    const p1 = rng.int(1, 6);
    const p2 = rng.int(1, 8 - p1);
    const p = {
      pay: [1000 * rng.int(5, 20), 1000 * rng.int(-5, 4), -1000 * rng.int(1, 9)],
      prob: [p1, p2, 10 - p1 - p2],
      a: rng.pick([2, 3, -2]),
      b: rng.int(-5, 5),
      u0: rng.int(1, 6),
    };
    if ((p.prob[2] ?? 0) < 1) reject("three possible outcomes");
    if (Math.abs(emv(p) - round(p.pay.reduce((s, x) => s + x, 0) / 3, 2)) < 1)
      reject("an EMV that differs from the plain mean");
    if (p.b === 0) reject("a non-zero constant");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = emv(p);
        return A.standard({
          question: [
            `A company can launch a product. The profit is £${p.pay[0]} with probability ${(p.prob[0] ?? 0) / 10}, £${p.pay[1]} with probability ${(p.prob[1] ?? 0) / 10}, and £${p.pay[2]} with probability ${(p.prob[2] ?? 0) / 10}.`.replace(
              /£-/g,
              "−£",
            ),
          ],
          ask: "Find the expected monetary value (EMV) of launching, in pounds.",
          answer: A.number(v, { units: "£" }),
          wrong: signedWrongs(v, [
            {
              code: "DEC.DECISION-TREE",
              value: A.number(round(p.pay.reduce((s, x) => s + x, 0) / 3, 2), { units: "£" }),
              feedback: "Weight each pay-off by its probability: EMV = Σ p × pay-off.",
            },
          ]),
          solution: [
            {
              say: "",
              math:
                p.pay
                  .map((x, i) => `${(p.prob[i] ?? 0) / 10} \\times ${x}`)
                  .join(" + ")
                  .replace(/\+ -/g, "- ") + ` = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const v = term(p, 3);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "A sequence is defined by ",
                A.math(
                  `u_{n+1} = ${linear([
                    [p.a, "u_n"],
                    [p.b, ""],
                  ])}`,
                ),
                ", with ",
                A.math(`u_0 = ${p.u0}`),
                ".",
              ],
              ask: ["Find ", A.math("u_3"), "."],
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.RECURRENCE",
              value: A.number(term(p, 2)),
              feedback:
                "The sequence starts at u₀, so u₃ is the fourth term: apply the rule three times.",
            },
          ]),
          solution: [{ say: `u₁ = ${term(p, 1)}, u₂ = ${term(p, 2)}, u₃ = ${v}.` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `Wil says the company should always choose the option that could make the most money, £${p.pay[0]}.`,
          ],
          truth: false,
          reasons: [
            {
              text: "False. A decision tree compares the expected monetary values, which weight each outcome by its probability. A big possible profit can come with a big risk.",
              correct: true,
            },
            { text: "True. The best possible outcome is what matters.", code: "DEC.DECISION-TREE" },
            { text: "True. Probabilities do not affect the decision.", code: "DEC.DECISION-TREE" },
          ],
          solution: [
            {
              say: "Choose the option with the greatest EMV, unless the decision-maker wants to avoid risk.",
            },
          ],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === emv(p);
    if (question.key.depth === 2) return numberAnswer(question) === term(p, 3);
    return true;
  },
});
