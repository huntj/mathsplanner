/**
 * @statement GF-A17.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A17.b: Solve linear equations with the unknown on both sides
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  c: number;
  x: number;
}

export default defineGenerator<Params>({
  id: "GF-A17.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.SOLVE.BOTH-SIDES"],

  params(rng, numbers) {
    const p = {
      a: rng.int(3, 11),
      b: rng.int(-12, 12),
      c: rng.int(1, 8),
      x: numbers === "friendly" ? rng.int(1, 10) : rng.int(-8, 12),
    };
    if (p.a <= p.c || p.x === 0 || p.b === 0) reject("more x on the left and a non-zero solution");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const d = (p.a - p.c) * p.x + p.b;
    const eq = `${linear([
      [p.a, "x"],
      [p.b, ""],
    ])} = ${linear([
      [p.c, "x"],
      [d, ""],
    ])}`;
    switch (depth) {
      case 1: {
        const slip = (d - p.b) / (p.a + p.c);
        return A.standard({
          question: ["Solve ", A.math(eq), "."],
          answer: A.number(p.x),
          wrong: signedWrongs(
            p.x,
            Number.isInteger(slip)
              ? [
                  {
                    code: "ALG.SOLVE.BOTH-SIDES",
                    value: A.number(slip),
                    feedback: `Subtract ${p.c}x from both sides: that leaves ${p.a - p.c}x.`,
                  },
                ]
              : [],
          ),
          solution: [{ say: "", math: `${p.a - p.c}x = ${d - p.b} \\Rightarrow x = ${p.x}` }],
        });
      }
      case 2: {
        // c − ax = b − ... : unknown with a negative coefficient on the left
        const rhs = p.c * p.x + p.b + p.a * p.x;
        const eq2 = `${rhs} - ${p.a}x = ${linear([
          [p.c, "x"],
          [p.b, ""],
        ])}`;
        return A.variedForm({
          rng,
          forms: [{ question: ["Solve ", A.math(eq2), "."] }],
          answer: A.number(p.x),
          wrong: signedWrongs(p.x, [
            {
              code: "ALG.SOLVE.BOTH-SIDES",
              value: A.number(-p.x),
              feedback: `Add ${p.a}x to both sides so the x terms are positive: ${rhs} = ${p.a + p.c}x + …`,
            },
          ]),
          solution: [{ say: "", math: `${rhs} - ${p.b} = ${p.a + p.c}x \\Rightarrow x = ${p.x}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ben says that to solve ",
            A.math(eq),
            ` he should add ${p.c}x to both sides.`,
          ],
          truth: false,
          reasons: [
            {
              text: `False. Subtract ${p.c}x from both sides to remove it from the right: ${p.a - p.c}x ${p.b < 0 ? "−" : "+"} ${Math.abs(p.b)} = ${d}.`,
              correct: true,
            },
            {
              text: "True. Moving a term to the other side keeps its sign.",
              code: "ALG.SOLVE.BOTH-SIDES",
            },
            { text: "True. Always add to collect like terms.", code: "ALG.SOLVE.BOTH-SIDES" },
          ],
          solution: [{ say: `x = ${p.x}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth !== 4) return numberAnswer(question) === p.x;
    return true;
  },
});
