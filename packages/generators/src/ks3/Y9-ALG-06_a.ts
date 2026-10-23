/**
 * @statement Y9-ALG-06.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-ALG-06.a: Solve simultaneous linear equations by elimination
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b1: number;
  b2: number;
  adult: number;
  child: number;
}

export default defineGenerator<Params>({
  id: "Y9-ALG-06.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SIMULTANEOUS.SIGN", "ALG.SIMULTANEOUS.PAIR"],

  params(rng) {
    const p = {
      a: rng.int(1, 3),
      b1: rng.int(2, 5),
      b2: rng.int(1, 4),
      adult: rng.int(6, 15),
      child: rng.int(2, 8),
    };
    if (p.b1 <= p.b2 || p.adult <= p.child) reject("different ticket mixes and prices");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const t1 = p.a * p.adult + p.b1 * p.child;
    const t2 = p.a * p.adult + p.b2 * p.child;
    const stem = `${p.a} adult and ${p.b1} child tickets cost £${t1}. ${p.a} adult and ${p.b2} child tickets cost £${t2}.`;
    switch (depth) {
      case 1: {
        const slip = (t1 + t2) / (p.b1 + p.b2);
        return A.standard({
          question: [stem],
          ask: "How much is one child ticket, in pounds?",
          answer: A.number(p.child),
          wrong: wrongs(p.child, [
            Number.isInteger(slip)
              ? {
                  code: "ALG.SIMULTANEOUS.SIGN",
                  value: A.number(slip),
                  feedback:
                    "The adult parts are the same, so subtract the two equations to eliminate them.",
                }
              : undefined,
          ]),
          solution: [
            { say: "Subtract: ", math: `${p.b1 - p.b2}c = ${t1 - t2} \\Rightarrow c = ${p.child}` },
          ],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [{ question: [stem], ask: "How much is one adult ticket, in pounds?" }],
          answer: A.number(p.adult),
          wrong: wrongs(p.adult, [
            {
              code: "ALG.SIMULTANEOUS.PAIR",
              value: A.number(p.child),
              feedback: "That is the child price. Substitute it back to find the adult price.",
            },
          ]),
          solution: [
            {
              say: `c = ${p.child}, so `,
              math: `${p.a}a = ${t1} - ${p.b1 * p.child} \\Rightarrow a = ${p.adult}`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "To eliminate y from ",
            A.math(`3x + ${p.b1}y = ${3 * p.adult + p.b1 * p.child}`),
            " and ",
            A.math(`x - ${p.b1}y = ${p.adult - p.b1 * p.child}`),
            ", Mo says you should subtract the equations.",
          ],
          truth: false,
          reasons: [
            {
              text: `False. The y terms are +${p.b1}y and −${p.b1}y, so adding them cancels y.`,
              correct: true,
            },
            { text: "True. You always subtract to eliminate.", code: "ALG.SIMULTANEOUS.SIGN" },
            { text: "True. The y numbers are the same.", code: "ALG.SIMULTANEOUS.SIGN" },
          ],
          solution: [{ say: "Same signs: subtract. Different signs: add." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.child;
    if (question.key.depth === 2) return numberAnswer(question) === p.adult;
    return true;
  },
});
