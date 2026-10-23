/**
 * @statement GH-A4.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GH-A4.d: Simplify expressions involving surds
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { signedWrongs } from "../shared/alg.ts";
import { numberAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
}

const squareFree = (n: number) => {
  for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) return false;
  return true;
};

export default defineGenerator<Params>({
  id: "GH-A4.d",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["ALG.EXPAND.NEGATIVE", "ALG.EXPAND.BINOMIAL-TWO-TERMS", "NPV.SURD.ADD-INSIDE"],

  params(rng) {
    const p = { a: rng.int(2, 9), b: rng.pick([2, 3, 5, 6, 7, 10, 11, 13]) };
    if (!squareFree(p.b) || p.a * p.a === p.b) reject("a surd in its simplest form");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const v = p.a * p.a - p.b;
        return A.standard({
          question: [
            "Expand and simplify ",
            A.math(`(${p.a} + \\sqrt{${p.b}})(${p.a} - \\sqrt{${p.b}})`),
            ".",
          ],
          answer: A.number(v),
          wrong: signedWrongs(v, [
            {
              code: "ALG.EXPAND.NEGATIVE",
              value: A.number(p.a * p.a + p.b),
              feedback: `√${p.b} × −√${p.b} = −${p.b}.`,
            },
          ]),
          solution: [
            {
              say: "The middle terms cancel: ",
              math: `${p.a}^2 - (\\sqrt{${p.b}})^2 = ${p.a * p.a} - ${p.b} = ${v}`,
            },
          ],
        });
      }
      case 2: {
        const right = `${p.a * p.a + p.b} + ${2 * p.a}\\sqrt{${p.b}}`;
        return A.variedForm({
          rng,
          forms: [
            { question: ["Expand and simplify ", A.math(`(${p.a} + \\sqrt{${p.b}})^2`), "."] },
          ],
          answer: A.exact(right),
          wrong: [
            {
              code: "ALG.EXPAND.BINOMIAL-TWO-TERMS",
              value: A.exact(String(p.a * p.a + p.b)),
              feedback: `(${p.a} + √${p.b})² = (${p.a} + √${p.b})(${p.a} + √${p.b}): there are two middle terms of ${p.a}√${p.b}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `${p.a * p.a} + ${p.a}\\sqrt{${p.b}} + ${p.a}\\sqrt{${p.b}} + ${p.b} = ${right}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [
            "For numbers a ≥ 0 and b ≥ 0, ",
            A.math("\\sqrt{a} + \\sqrt{b} = \\sqrt{a + b}"),
            ".",
          ],
          truth: "sometimes",
          reasons: [
            {
              text: `Sometimes. It holds when a or b is 0, but not otherwise: √${p.a * p.a} + √${p.b} is not √${p.a * p.a + p.b}.`,
              correct: true,
            },
            { text: "Always. Square roots can be added like this.", code: "NPV.SURD.ADD-INSIDE" },
            { text: "Never. It is not even true for a = 0." },
          ],
          solution: [{ say: "√9 + √16 = 7, but √25 = 5." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return numberAnswer(question) === p.a * p.a - p.b;
    return true;
  },
});
