/**
 * @statement GF-A25
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-A25: Deduce expressions to calculate the nth term of linear sequences
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { poly } from "../shared/alg.ts";

interface Params {
  d: number;
  c: number;
  claimTrue: boolean;
}

export default defineGenerator<Params>({
  id: "GF-A25",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SEQUENCE.POSITION-RULE"],

  params(rng) {
    const d = rng.int(2, 9) * rng.pick([1, 1, -1]);
    const c = rng.int(-9, 15);
    if (c === 0 || c === d || d + c === 0) reject("a sequence whose rule needs both parts");
    return { d, c, claimTrue: rng.bool() };
  },

  build(p, depth, rng): QuestionDraft {
    const t = [1, 2, 3, 4].map((n) => p.d * n + p.c);
    const right = poly([p.d, p.c], "n");
    // Using the first term as the constant: dn + (first term).
    const slip = poly([p.d, t[0] as number], "n");
    const slip2 = poly([1, p.d], "n");
    switch (depth) {
      case 1:
        return A.standard({
          question: `Here are the first four terms of a sequence: ${t.join(", ")}, …`,
          ask: "Find an expression for the nth term.",
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.exact(slip),
              feedback: `The zero term (before the first) is ${p.c}, not ${t[0]}.`,
            },
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.exact(slip2),
              feedback: `n + ${p.d} goes up by 1 each time. The difference ${p.d} goes in front of n.`,
            },
          ],
          solution: [
            {
              say: `Difference ${p.d}, so ${p.d}n; ${p.d} × 1 = ${p.d}, and the first term is ${t[0]}, so add ${p.c}: `,
              math: right,
            },
          ],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            { question: `A sequence goes ${t.join(", ")}, … Write down its nth term.` },
            {
              question: `The term-to-term rule of a sequence is "${p.d > 0 ? "add" : "subtract"} ${Math.abs(p.d)}" and its first term is ${t[0]}. Write down its nth term.`,
            },
          ],
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.SEQUENCE.POSITION-RULE",
              value: A.exact(slip),
              feedback: "Check with n = 1: the rule must give the first term.",
            },
          ],
          solution: [{ say: "", math: right }],
        });
      default: {
        const shown = p.claimTrue ? right : slip;
        return A.trueOrFalseWhy({
          rng,
          statement: [`Ali says the nth term of ${t.join(", ")}, … is `, A.math(shown), "."],
          truth: p.claimTrue,
          reasons: p.claimTrue
            ? [
                {
                  text: `True. n = 1 gives ${t[0]}, n = 2 gives ${t[1]}, and it goes up by ${p.d} each time.`,
                  correct: true,
                },
                {
                  text: `False. The constant is the first term, ${t[0]}.`,
                  code: "ALG.SEQUENCE.POSITION-RULE",
                },
                {
                  text: "False. The nth term is n plus the difference.",
                  code: "ALG.SEQUENCE.POSITION-RULE",
                },
              ]
            : [
                {
                  text: `False. n = 1 gives ${p.d + (t[0] as number)}, not ${t[0]}. The nth term is ${right}.`,
                  correct: true,
                },
                {
                  text: "True. The constant is always the first term.",
                  code: "ALG.SEQUENCE.POSITION-RULE",
                },
                {
                  text: "True. Any rule with the right difference works.",
                  code: "ALG.SEQUENCE.POSITION-RULE",
                },
              ],
          solution: [{ say: "Check an nth term by substituting n = 1 and n = 2." }],
        });
      }
    }
  },

  verify(p, question) {
    const a = question.parts[0]?.answer;
    if (question.key.depth <= 2) return a?.type === "exact" && a.value === poly([p.d, p.c], "n");
    return true;
  },
});
