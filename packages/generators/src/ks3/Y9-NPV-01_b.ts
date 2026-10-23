/**
 * @statement Y9-NPV-01.b
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y9-NPV-01.b: Add and subtract numbers in standard form
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";

interface Params {
  a: number;
  b: number;
  p: number;
  c: number;
  d: number;
}

const sf = (x: number | string, p: number) => `${x} \\times 10^{${p}}`;
const r = (v: number) => Number(v.toFixed(6));

export default defineGenerator<Params>({
  id: "Y9-NPV-01.b",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.STANDARD-FORM.COMPARE-FIRST", "NPV.STANDARD-FORM.INDEX-LAWS"],

  params(rng) {
    const q = {
      a: rng.int(2, 8),
      b: rng.int(1, 9),
      p: rng.int(4, 8),
      c: rng.int(3, 9),
      d: rng.int(1, 9),
    };
    if (q.a + q.b / 10 >= 10 || q.c - q.d / 10 < 1)
      reject("answers in standard form without carrying");
    return q;
  },

  build(p, depth, rng): QuestionDraft {
    switch (depth) {
      case 1: {
        const right = sf(r(p.a + p.b / 10), p.p);
        return A.standard({
          question: [
            "Work out ",
            A.math(`(${sf(p.a, p.p)}) + (${sf(p.b, p.p - 1)})`),
            ". Give your answer in standard form.",
          ],
          answer: A.exact(right, "standard-form"),
          wrong: [
            {
              code: "NPV.STANDARD-FORM.COMPARE-FIRST",
              value: A.exact(sf(p.a + p.b, p.p)),
              feedback: `The powers are different: ${p.b} × 10^${p.p - 1} is ${p.b / 10} × 10^${p.p}.`,
            },
          ],
          solution: [
            {
              say: "Make the powers the same, then add: ",
              math: `${p.a} \\times 10^{${p.p}} + ${p.b / 10} \\times 10^{${p.p}} = ${right}`,
            },
          ],
        });
      }
      case 2: {
        const right = sf(r(p.c - p.d / 10), p.p);
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Work out ",
                A.math(`(${sf(p.c, p.p)}) - (${sf(p.d, p.p - 1)})`),
                ". Give your answer in standard form.",
              ],
            },
          ],
          answer: A.exact(right, "standard-form"),
          wrong: [
            {
              code: "NPV.STANDARD-FORM.INDEX-LAWS",
              value: A.exact(sf(p.c - p.d, 1)),
              feedback:
                "Subtracting numbers does not subtract the powers. Write both with the same power of 10 first.",
            },
          ],
          solution: [
            {
              say: "",
              math: `${p.c} \\times 10^{${p.p}} - ${p.d / 10} \\times 10^{${p.p}} = ${right}`,
            },
          ],
        });
      }
      default:
        return A.alwaysSometimesNever({
          rng,
          claim: [A.math("(a \\times 10^n) + (b \\times 10^n) = (a + b) \\times 10^n")],
          truth: "always",
          reasons: [
            {
              text: `Always, by collecting like terms: ${p.a} lots of 10^${p.p} plus ${p.b} lots is ${p.a + p.b} lots. The answer may need adjusting to be in standard form.`,
              correct: true,
            },
            { text: "Never. You must add the powers too.", code: "NPV.STANDARD-FORM.INDEX-LAWS" },
            {
              text: "Sometimes. Only when a + b is less than 10.",
              code: "NPV.STANDARD-FORM.COMPARE-FIRST",
            },
          ],
          solution: [{ say: "Add the numbers when the powers match." }],
        });
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return exactAnswer(question) === sf(r(p.a + p.b / 10), p.p);
    if (question.key.depth === 2) return exactAnswer(question) === sf(r(p.c - p.d / 10), p.p);
    return true;
  },
});
