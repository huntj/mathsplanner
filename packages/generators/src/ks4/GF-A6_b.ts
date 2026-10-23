/**
 * @statement GF-A6.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-A6.b: Show that two expressions are equivalent
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { linear, signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";
import { distinctFrom } from "../shared/pos.ts";

interface Params {
  k: number;
  a: number;
  m: number;
  b: number;
  c: number;
}

const simplified = (p: Params) =>
  linear([
    [p.k - p.m, "x"],
    [p.k * p.a + p.m * p.b, ""],
  ]);

export default defineGenerator<Params>({
  id: "GF-A6.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.NEGATIVE", "ALG.EXPAND.FIRST-ONLY", "ALG.EXPAND.BINOMIAL-TWO-TERMS"],

  params(rng) {
    const p = {
      k: rng.int(3, 9),
      a: rng.int(1, 9),
      m: rng.int(1, 5),
      b: rng.int(1, 9),
      c: rng.int(2, 9),
    };
    if (p.k === p.m || p.k - p.m === 1) reject("an x coefficient other than 0 and 1");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const expr = `${p.k}(x + ${p.a}) - ${p.m === 1 ? "" : p.m}(x - ${p.b})`;
        return A.choice({
          rng,
          question: ["Which expression is equivalent to ", A.math(expr), "?"],
          correct: A.math(simplified(p)),
          distractors: [
            {
              content: A.math(
                linear([
                  [p.k - p.m, "x"],
                  [p.k * p.a - p.m * p.b, ""],
                ]),
              ),
              code: "ALG.EXPAND.NEGATIVE",
              feedback: `−${p.m} × −${p.b} = +${p.m * p.b}.`,
            },
            {
              content: A.math(
                linear([
                  [p.k - p.m, "x"],
                  [p.a + p.m * p.b, ""],
                ]),
              ),
              code: "ALG.EXPAND.FIRST-ONLY",
              feedback: `${p.k} multiplies both x and ${p.a}.`,
            },
          ].filter(distinctFrom(A.math(simplified(p)))),
          solution: [
            {
              say: "",
              math: `${linear([
                [p.k, "x"],
                [p.k * p.a, ""],
              ])} - ${p.m}x + ${p.m * p.b} = ${simplified(p)}`,
            },
          ],
        });
      }
      case 2: {
        const v = 4 * p.c;
        return A.variedForm({
          rng,
          forms: [
            {
              question: [A.math(`(x + ${p.c})^2 - (x - ${p.c})^2 \\equiv nx`), " for a number n."],
              ask: "Find n.",
            },
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.number(0),
              feedback: `(x + ${p.c})² = x² + ${2 * p.c}x + ${p.c * p.c}: do not forget the middle terms.`,
            },
          ]),
          solution: [
            {
              say: "",
              math: `(x^2 + ${2 * p.c}x + ${p.c * p.c}) - (x^2 - ${2 * p.c}x + ${p.c * p.c}) = ${4 * p.c}x`,
            },
          ],
        });
      }
      default: {
        const target = `${p.k}(x + ${p.a})`;
        return A.oddOneOut({
          rng,
          question: "Which expression is not equivalent to the others?",
          items: [
            { content: A.math(target) },
            {
              content: A.math(
                linear([
                  [p.k, "x"],
                  [p.k * p.a, ""],
                ]),
              ),
            },
            { content: A.math(`${p.k}x + ${p.k}(${p.a})`) },
            {
              content: A.math(
                linear([
                  [p.k, "x"],
                  [p.a, ""],
                ]),
              ),
              odd: true,
            },
          ],
          reasons: [
            {
              text: `It is the only one not equal to ${target}: the ${p.a} has not been multiplied by ${p.k}.`,
              correct: true,
            },
            { text: "It is the only one without brackets." },
            { text: "It is the only expanded one.", code: "ALG.EXPAND.FIRST-ONLY" },
          ],
          solution: [
            {
              say: `${target} = ${linear([
                [p.k, "x"],
                [p.k * p.a, ""],
              ])}.`,
            },
          ],
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 2) return numberAnswer(question) === 4 * p.c;
    return true;
  },
});
