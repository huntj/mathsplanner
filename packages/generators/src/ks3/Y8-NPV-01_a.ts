/**
 * @statement Y8-NPV-01.a
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y8-NPV-01.a: Write numbers in standard form
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { tex } from "../shared/npv.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  p: number;
  k: number;
}

const sf = (m: string, power: number) => `${m} \\times 10^{${power}}`;

export default defineGenerator<Params>({
  id: "Y8-NPV-01.a",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.STANDARD-FORM.POWER", "NPV.INDEX.NEGATIVE"],

  params(rng) {
    return { a: rng.int(1, 9), b: rng.int(1, 9), p: rng.int(3, 7), k: rng.int(2, 5) };
  },

  build(p, depth, rng): QuestionDraft {
    const m = `${p.a}.${p.b}`;
    switch (depth) {
      case 1: {
        const v = (10 * p.a + p.b) * 10 ** (p.p - 1);
        return A.standard({
          question: ["Write ", A.math(sf(m, p.p)), " as an ordinary number."],
          answer: A.number(v),
          wrong: wrongs(v, [
            {
              code: "NPV.STANDARD-FORM.POWER",
              value: A.number(v * 10),
              feedback: `Multiplying by 10^${p.p} moves the digits ${p.p} places; it is not "add ${p.p} zeros" after ${p.a}${p.b}.`,
            },
          ]),
          solution: [{ say: "", math: `${m} \\times ${tex(10 ** p.p)} = ${tex(v)}` }],
        });
      }
      case 2: {
        const right = sf(m, -p.k);
        return A.choice({
          rng,
          archetype: "varied-form",
          question: [
            "Write ",
            A.math(`0.${"0".repeat(p.k - 1)}${p.a}${p.b}`),
            " in standard form.",
          ],
          correct: A.math(right),
          distractors: [
            {
              content: A.math(sf(m, p.k)),
              code: "NPV.STANDARD-FORM.POWER",
              feedback: "The number is less than 1, so the power of 10 is negative.",
            },
            {
              content: A.math(sf(m, 1 - p.k)),
              code: "NPV.STANDARD-FORM.POWER",
              feedback: `Count how many places the digits move to give ${m}: ${p.k}.`,
            },
          ],
          solution: [{ say: "", math: right }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: [
                "Ivy says ",
                A.math(`${p.a} \\times 10^{-${p.k}}`),
                " is a negative number.",
              ],
              truth: false,
              reasons: [
                {
                  text: `False. A negative power of 10 makes a small positive number: ${p.a} × 10^−${p.k} = ${(p.a / 10 ** p.k).toFixed(p.k)}.`,
                  correct: true,
                },
                { text: "True. The minus sign makes it negative.", code: "NPV.INDEX.NEGATIVE" },
                { text: `True. It means ${p.a} × (−10)^${p.k}.`, code: "NPV.INDEX.NEGATIVE" },
              ],
              solution: [{ say: "10^−k = 1 ÷ 10^k." }],
            }),
          [
            {
              statement: "Sam says $45 \\times 10^{3}$ is written in standard form.",
              truth: false,
              right:
                "False. The first number must be at least 1 and less than 10, so it is 4.5 × 10⁴.",
              wrong: [
                ["True. It is a number times a power of 10.", "NPV.STANDARD-FORM.POWER"],
                ["True. Any number times 10³ is in standard form."],
              ],
            },
            {
              statement: "Ana writes 0.007 as $7 \\times 10^{-3}$.",
              truth: true,
              right: "True. 7 × 10^−3 = 7 ÷ 1000 = 0.007.",
              wrong: [
                ["False. It is 7 × 10³, because there are three zeros.", "NPV.INDEX.NEGATIVE"],
                [
                  "False. It is 7 × 10^−2, counting the zeros after the point.",
                  "NPV.STANDARD-FORM.POWER",
                ],
              ],
            },
            {
              claim:
                "A positive number in standard form with a negative power of 10 is less than 1.",
              truth: "always",
              right:
                "Always. The first number is less than 10 and a negative power of 10 is at most 0.1, so the number is less than 1.",
              wrong: [
                ["Never. A negative power makes a negative number.", "NPV.INDEX.NEGATIVE"],
                ["Sometimes. Only when the first number is small.", "NPV.STANDARD-FORM.POWER"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1)
      return numberAnswer(question) === (10 * p.a + p.b) * 10 ** (p.p - 1);
    if (question.key.depth === 2) return chosenText(question) === sf(`${p.a}.${p.b}`, -p.k);
    return true;
  },
});
