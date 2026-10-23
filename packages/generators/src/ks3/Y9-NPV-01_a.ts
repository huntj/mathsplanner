/**
 * @statement Y9-NPV-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-NPV-01.a: Multiply and divide numbers in standard form
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  m: number;
  n: number;
  c: number;
  d: number;
}

const sf = (x: number | string, p: number) => `${x} \\times 10^{${p}}`;

export default defineGenerator<Params>({
  id: "Y9-NPV-01.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.STANDARD-FORM.INDEX-LAWS", "NPV.STANDARD-FORM.POWER"],

  params(rng) {
    const a = rng.int(2, 4);
    const p = {
      a,
      b: rng.int(2, Math.floor(9 / a)),
      m: rng.int(3, 9),
      n: -rng.int(2, 6),
      c: rng.pick([1, 2, 3, 4]),
      d: rng.pick([2, 4, 5, 8]),
    };
    if (p.m + p.n === p.m * p.n || p.c >= p.d || ((10 * p.c) / p.d) % 0.5 !== 0)
      reject("results that test the idea");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = sf(p.a * p.b, p.m + p.n);
        return A.standard({
          question: [
            "Work out ",
            A.math(`(${sf(p.a, p.m)}) \\times (${sf(p.b, p.n)})`),
            ". Give your answer in standard form.",
          ],
          answer: A.exact(right, "standard-form"),
          wrong: [
            {
              code: "NPV.STANDARD-FORM.INDEX-LAWS",
              value: A.exact(sf(p.a * p.b, p.m * p.n)),
              feedback: `Add the powers when multiplying: ${p.m} + (${p.n}) = ${p.m + p.n}.`,
            },
          ],
          solution: [
            {
              say: "",
              math: `${p.a} \\times ${p.b} = ${p.a * p.b}, \\; 10^{${p.m}} \\times 10^{${p.n}} = 10^{${p.m + p.n}}`,
            },
          ],
        });
      }
      case 2: {
        const lead = (10 * p.c) / p.d;
        const right = sf(lead, p.m - 2 - 1);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Work out ",
                A.math(`(${sf(p.c, p.m)}) \\div (${sf(p.d, 2)})`),
                ". Give your answer in standard form.",
              ],
            },
          ],
          answer: A.exact(right, "standard-form"),
          wrong: [
            {
              code: "NPV.STANDARD-FORM.POWER",
              value: A.exact(sf(lead, p.m - 2)),
              feedback: `${p.c} ÷ ${p.d} = ${p.c / p.d}, which is less than 1: write it as ${lead} × 10^−1 and adjust the power.`,
            },
          ],
          solution: [{ say: "", math: `${p.c / p.d} \\times 10^{${p.m - 2}} = ${right}` }],
        });
      }
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: [
            "Ella says ",
            A.math(`(${sf(p.a, p.m)}) \\times (${sf(p.b, p.m)}) = ${sf(p.a * p.b, p.m)}`),
            ".",
          ],
          truth: false,
          reasons: [
            {
              text: `False. 10^${p.m} × 10^${p.m} = 10^${2 * p.m}, so the answer is ${p.a * p.b} × 10^${2 * p.m}.`,
              correct: true,
            },
            {
              text: "True. The powers are the same, so they stay the same.",
              code: "NPV.STANDARD-FORM.INDEX-LAWS",
            },
            {
              text: `False. It is ${p.a * p.b} × 10^${p.m * p.m}.`,
              code: "NPV.STANDARD-FORM.INDEX-LAWS",
            },
          ],
          solution: [{ say: "Multiply the numbers; add the powers." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === sf(p.a * p.b, p.m + p.n);
    if (question.key.depth === 2) return exactAnswer(question) === sf((10 * p.c) / p.d, p.m - 3);
    return true;
  },
});
