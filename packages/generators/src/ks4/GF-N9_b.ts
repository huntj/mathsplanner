/**
 * @statement GF-N9.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N9.b: Calculate with numbers in standard form
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  m: number;
  n: number;
  r: number;
  q: number;
  c: number;
  d: number;
}

const sf = (m: number | string, power: number) => `${m} \\times 10^{${power}}`;

export default defineGenerator<Params>({
  id: "GF-N9.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.STANDARD-FORM.INDEX-LAWS", "NPV.STANDARD-FORM.POWER"],

  params(rng) {
    const a = rng.int(2, 4);
    const p = {
      a,
      b: rng.int(2, Math.floor(9 / a)),
      m: rng.int(2, 8),
      n: rng.int(2, 8),
      r: rng.int(2, 4),
      q: rng.int(2, 4),
      c: rng.int(2, 9),
      d: rng.int(2, 9),
    };
    if (p.m + p.n === p.m * p.n || p.c * p.d < 10 || (p.c * p.d) % 10 === 0)
      reject("powers and products that test the idea");
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
              feedback: "Multiply the numbers, then add the powers of 10.",
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
        const top = p.r * p.q;
        const right = sf(p.r, p.m - p.n);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Work out ",
                A.math(`(${sf(top, p.m)}) \\div (${sf(p.q, p.n)})`),
                ". Give your answer in standard form.",
              ],
            },
          ],
          answer: A.exact(right, "standard-form"),
          wrong: [
            {
              code: "NPV.STANDARD-FORM.INDEX-LAWS",
              value: A.exact(sf(p.r, p.m + p.n)),
              feedback: "When dividing, subtract the powers of 10.",
            },
          ],
          solution: [
            {
              say: "",
              math: `${top} \\div ${p.q} = ${p.r}, \\; 10^{${p.m}} \\div 10^{${p.n}} = 10^{${p.m - p.n}}`,
            },
          ],
        });
      }
      default: {
        const prod = p.c * p.d;
        const lead = Number((prod / 10).toFixed(1));
        return A.spotTheMistake({
          question: [
            "Nat works out ",
            A.math(`(${sf(p.c, p.m)}) \\times (${sf(p.d, p.n)})`),
            " in standard form.",
          ],
          lines: [[A.math(`= ${sf(prod, p.m + p.n)}`)], [A.math(`= ${sf(lead, p.m + p.n - 1)}`)]],
          mistake: 1,
          code: "NPV.STANDARD-FORM.POWER",
          feedback: `${prod} = ${lead} × 10, so the power goes up by 1: ${lead} × 10^${p.m + p.n + 1}.`,
        });
      }
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === sf(p.a * p.b, p.m + p.n);
    if (question.key.depth === 2) return exactAnswer(question) === sf(p.r, p.m - p.n);
    return true;
  },
});
