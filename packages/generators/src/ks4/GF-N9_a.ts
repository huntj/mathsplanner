/**
 * @statement GF-N9.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the GCSE sub-statements
 */
// GF-N9.a: Write numbers in standard form
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { exactAnswer } from "../shared/counting.ts";
import { tex } from "../shared/npv.ts";

interface Params {
  a: number;
  b: number;
  p: number;
  k: number;
}

const sf = (m: string, power: number) => `${m} \\times 10^{${power}}`;

export default defineGenerator<Params>({
  id: "GF-N9.a",
  version: "1.0.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.STANDARD-FORM.POWER"],

  params(rng) {
    return { a: rng.int(1, 9), b: rng.int(1, 9), p: rng.int(4, 8), k: rng.int(2, 6) };
  },

  build(p, depth, rng): QuestionDraft {
    const m = `${p.a}.${p.b}`;
    switch (depth) {
      case 1:
        return A.standard({
          question: [
            "Write ",
            A.math(tex((10 * p.a + p.b) * 10 ** (p.p - 1))),
            " in standard form.",
          ],
          answer: A.exact(sf(m, p.p), "standard-form"),
          wrong: [
            {
              code: "NPV.STANDARD-FORM.POWER",
              value: A.exact(sf(m, p.p + 1)),
              feedback:
                "The power is how many places the digits move, not how many digits there are.",
            },
          ],
          solution: [{ say: `The point moves ${p.p} places: `, math: sf(m, p.p) }],
        });
      case 2:
        return A.variedForm({
          rng,
          forms: [
            {
              question: [
                "Write ",
                A.math(`0.${"0".repeat(p.k - 1)}${p.a}${p.b}`),
                " in standard form.",
              ],
            },
          ],
          answer: A.exact(sf(m, -p.k), "standard-form"),
          wrong: [
            {
              code: "NPV.STANDARD-FORM.POWER",
              value: A.exact(sf(m, 1 - p.k)),
              feedback: `Count the places the point moves to get ${m}: ${p.k}, so the power is −${p.k}.`,
            },
          ],
          solution: [{ say: `The point moves ${p.k} places to the right: `, math: sf(m, -p.k) }],
        });
      default:
        return A.trueOrFalseWhy({
          rng,
          statement: ["Jo says ", A.math(sf(`${p.a}${p.b}`, p.p)), " is written in standard form."],
          truth: false,
          reasons: [
            {
              text: `False. The first number must be at least 1 and less than 10, so it is ${m} × 10^${p.p + 1}.`,
              correct: true,
            },
            { text: "True. It is a number times a power of 10.", code: "NPV.STANDARD-FORM.POWER" },
            { text: `False. It should be ${m} × 10^${p.p - 1}.`, code: "NPV.STANDARD-FORM.POWER" },
          ],
          solution: [
            {
              say: "",
              math: `${p.a}${p.b} \\times 10^{${p.p}} = ${m} \\times 10 \\times 10^{${p.p}} = ${sf(m, p.p + 1)}`,
            },
          ],
        });
    }
  },

  verify(p, question) {
    const m = `${p.a}.${p.b}`;
    if (question.key.depth === 1) return exactAnswer(question) === sf(m, p.p);
    if (question.key.depth === 2) return exactAnswer(question) === sf(m, -p.k);
    return true;
  },
});
