/**
 * @statement GF-A19.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A19.b: Solve simultaneous equations by substitution
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  m: number;
  c: number;
  a: number;
  b: number;
  x: number;
}

export default defineGenerator<Params>({
  id: "GF-A19.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.FIRST-ONLY", "ALG.SIMULTANEOUS.PAIR"],

  params(rng) {
    const p = {
      m: rng.int(2, 5) * rng.pick([1, -1]),
      c: rng.int(-6, 6),
      a: rng.int(1, 5),
      b: rng.int(2, 5),
      x: rng.int(-4, 6),
    };
    if (p.c === 0 || p.x === 0 || p.a + p.b * p.m === 0) reject("a unique solution");
    if (p.m * p.x + p.c === p.x) reject("x and y differ");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const y = p.m * p.x + p.c;
    const f = p.a * p.x + p.b * y;
    const lineEq = `y = ${linear([
      [p.m, "x"],
      [p.c, ""],
    ])}`;
    const other = `${linear([
      [p.a, "x"],
      [p.b, "y"],
    ])} = ${f}`;
    switch (depth) {
      case 1: {
        const slip = (f - p.c) / (p.a + p.b * p.m);
        return A.standard({
          question: ["Solve ", A.math(lineEq), " and ", A.math(other), " by substitution."],
          ask: "Find the value of x.",
          answer: A.number(p.x),
          wrong: signedWrongs(
            p.x,
            Number.isInteger(slip)
              ? [
                  {
                    code: "ALG.EXPAND.FIRST-ONLY",
                    value: A.number(slip),
                    feedback: `${p.b}(${linear([
                      [p.m, "x"],
                      [p.c, ""],
                    ])}) multiplies both terms by ${p.b}.`,
                  },
                ]
              : [],
          ),
          solution: [
            {
              say: "",
              math: `${p.a}x + ${p.b}(${linear([
                [p.m, "x"],
                [p.c, ""],
              ])}) = ${f} \\Rightarrow ${p.a + p.b * p.m}x = ${f - p.b * p.c} \\Rightarrow x = ${p.x}`,
            },
          ],
        });
      }
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Solve ", A.math(lineEq), " and ", A.math(other), "."],
              ask: "Find the value of y.",
            },
          ],
          answer: A.number(y),
          wrong: signedWrongs(y, [
            {
              code: "ALG.SIMULTANEOUS.PAIR",
              value: A.number(p.x),
              feedback: `x = ${p.x}; substitute it back to find y.`,
            },
          ]),
          solution: [
            {
              say: `x = ${p.x}, so y = ${p.m} × ${p.x} ${p.c < 0 ? "−" : "+"} ${Math.abs(p.c)} = ${y}.`,
            },
          ],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Kim finds x = ",
            A.math(String(p.x)),
            " and says she has solved ",
            A.math(lineEq),
            " and ",
            A.math(other),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. A solution is a pair of values: she still needs y = ${y}, from substituting x back.`,
              correct: true,
            },
            { text: "True. Finding one letter is enough.", code: "ALG.SIMULTANEOUS.PAIR" },
            { text: "True. y must equal x.", code: "ALG.SIMULTANEOUS.PAIR" },
          ],
          solution: [{ say: `The solution is x = ${p.x}, y = ${y}.` }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.x;
    if (question.key.depth === 2) return numberAnswer(question) === p.m * p.x + p.c;
    return true;
  },
});
