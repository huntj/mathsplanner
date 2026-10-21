/**
 * @statement GF-N3
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// GF-N3: Recognise and use relationships between operations, including inverse operations (e.g.
// cancellation to simplify calculations and expressions); use conventional notation for priority
// of operations, including brackets, powers, roots and reciprocals
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, frac, reject, toLatex, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  e: number;
  /** Depth 2: the number whose reciprocal is asked, as n/d. */
  n: number;
  d: number;
  k: number;
  m: number;
}

export default defineGenerator<Params>({
  id: "GF-N3",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ORDER.LEFT-TO-RIGHT", "NPV.RECIPROCAL.NEGATIVE", "NPV.INVERSE.WRONG-PAIR"],

  params(rng, numbers) {
    const n = rng.int(1, 4);
    const d = rng.pick([2, 4, 5, 8]);
    if (n === d || n * 2 === d) reject("a number whose reciprocal is worth asking for");
    return {
      a: rng.int(2, 12),
      b: rng.int(2, 6),
      c: rng.int(2, numbers === "friendly" ? 3 : 5),
      e: rng.int(2, 3),
      n,
      d,
      k: rng.int(2, 9),
      m: rng.int(2, 15),
    };
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        // a + b × c^e − √(b²)… kept to a + b × c^e.
        const right = p.a + p.b * p.c ** p.e;
        const leftToRight = (p.a + p.b) * p.c ** p.e;
        const timesFirst = p.a + (p.b * p.c) ** p.e;
        return A.standard({
          question: ["Work out ", A.math(`${p.a} + ${p.b} \\times ${p.c}^{${p.e}}`), "."],
          answer: A.number(right),
          wrong: wrongs(right, [
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number(leftToRight),
              feedback: "Powers first, then multiplication, then addition.",
            },
            {
              code: "NPV.ORDER.LEFT-TO-RIGHT",
              value: A.number(timesFirst),
              feedback: `The power applies only to ${p.c}, so work out ${p.c}^${p.e} first.`,
            },
          ]),
          solution: [
            {
              say: "Powers, then ×, then +: ",
              math: `${p.c}^{${p.e}} = ${p.c ** p.e},\\ ${p.b} \\times ${p.c ** p.e} = ${p.b * p.c ** p.e},\\ ${p.a} + ${p.b * p.c ** p.e} = ${right}`,
            },
          ],
        });
      }
      case 2: {
        const x = frac(p.n, p.d);
        const shown = x.isInteger() ? toLatex(x) : String(p.n / p.d);
        const recip = x.inv();
        return A.standard({
          question: [
            "What is the reciprocal of ",
            A.math(shown),
            "? Give your answer as a fraction or a whole number.",
          ],
          answer: A.exact(recip),
          wrong: [
            {
              code: "NPV.RECIPROCAL.NEGATIVE",
              value: A.exact(x.neg()),
              feedback: "The reciprocal is 1 divided by the number, so that the two multiply to 1.",
            },
          ],
          solution: [
            { say: "Reciprocal = 1 ÷ number: ", math: `1 \\div ${shown} = ${toLatex(recip)}` },
          ],
        });
      }
      default: {
        const truth = false;
        return A.trueOrFalseWhy({
          rng,
          statement: [
            `A number is multiplied by ${p.k} and then ${p.m} is added. Ravi says that to get back to the number you divide by ${p.k} and then subtract ${p.m}.`,
          ],
          truth,
          reasons: [
            {
              text: `False. Undo the steps in reverse order: subtract ${p.m} first, then divide by ${p.k}.`,
              correct: true,
            },
            {
              text: "True. Use the inverse of each operation in the same order.",
              code: "NPV.INVERSE.WRONG-PAIR",
            },
            {
              text: "True. The order of the inverse operations does not matter.",
              code: "NPV.INVERSE.WRONG-PAIR",
            },
          ],
          solution: [
            {
              say: `For example 5 → ${5 * p.k} → ${5 * p.k + p.m}. Back: ${5 * p.k + p.m} − ${p.m} = ${5 * p.k}, ÷ ${p.k} = 5.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard" && question.parts[0]?.answer.type === "number")
      return numberAnswer(question) === p.a + p.b * p.c ** p.e;
    return true;
  },
});
