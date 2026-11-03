/**
 * @statement Y7-NPV-07.d
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator for the Key Stage 3 sub-statements
 */
// Y7-NPV-07.d: Distinguish exact roots from decimal approximations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { chosenText, numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  k: number;
}

const r3 = (v: number) => Math.round(v * 1000) / 1000;

export default defineGenerator<Params>({
  id: "Y7-NPV-07.d",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.ROOT.EXACT-DECIMAL"],

  params(rng) {
    const p = { k: rng.int(2, 30) };
    if (Number.isInteger(Math.sqrt(p.k))) reject("a number that is not a square");
    if (r3(Math.sqrt(p.k)) ** 2 === p.k) reject("a rounded root that is visibly not exact");
    return p;
  },

  build(p, depth, rng): QuestionDraft {
    const approx = r3(Math.sqrt(p.k));
    switch (depth) {
      case 1:
        return A.choice({
          rng,
          question: [
            "Which of these is exactly equal to the square root of ",
            A.math(String(p.k)),
            "?",
          ],
          correct: A.math(`\\sqrt{${p.k}}`),
          distractors: [
            {
              content: A.math(String(approx)),
              code: "NPV.ROOT.EXACT-DECIMAL",
              feedback: `${approx} is rounded: ${approx}² = ${Number((approx * approx).toFixed(6))}, not ${p.k}.`,
            },
            { content: A.math(String(p.k / 2)), feedback: "Halving is not square rooting." },
          ],
          solution: [
            {
              say: `√${p.k} is not a whole number or a terminating decimal, so the exact value is written `,
              math: `\\sqrt{${p.k}}`,
            },
          ],
        });
      case 2: {
        const sq = Number((approx * approx).toFixed(6));
        return A.variedForm({
          rng,
          forms: [
            {
              question: ["Work out ", A.math(`\\sqrt{${p.k}} \\times \\sqrt{${p.k}}`), " exactly."],
            },
          ],
          answer: A.number(p.k),
          wrong: wrongs(p.k, [
            {
              code: "NPV.ROOT.EXACT-DECIMAL",
              value: A.number(sq),
              feedback: `Using the rounded value ${approx} gives ${sq}, which is close but not exact. A square root times itself is the number.`,
            },
          ]),
          solution: [{ say: "", math: `(\\sqrt{${p.k}})^2 = ${p.k}` }],
        });
      }
      default:
        return orClaims(
          rng,
          () =>
            A.alwaysSometimesNever({
              rng,
              claim: ["The square root of a whole number is a whole number."],
              truth: "sometimes",
              reasons: [
                {
                  text: `Sometimes. √${Math.floor(Math.sqrt(p.k)) ** 2} = ${Math.floor(Math.sqrt(p.k))}, but √${p.k} is about ${approx}, which never ends or repeats.`,
                  correct: true,
                },
                {
                  text: "Always. Calculators show a whole number when you round.",
                  code: "NPV.ROOT.EXACT-DECIMAL",
                },
                { text: "Never. Square roots are always decimals." },
              ],
              solution: [{ say: "Only square numbers have whole-number square roots." }],
            }),
          [
            {
              statement: `Hal says $\\sqrt{${p.k}}$ is exactly ${approx}.`,
              truth: false,
              right: `False. ${approx} is rounded: ${approx} × ${approx} is close to ${p.k} but not exactly ${p.k}. √${p.k} is a decimal that never ends or repeats.`,
              wrong: [
                ["True. The calculator shows it, so it is exact.", "NPV.ROOT.EXACT-DECIMAL"],
                [
                  "True. A square root always stops after three decimal places.",
                  "NPV.ROOT.EXACT-DECIMAL",
                ],
              ],
            },
            {
              statement: `Ivy says $\\sqrt{${p.k}}$ is between ${Math.floor(Math.sqrt(p.k))} and ${Math.floor(Math.sqrt(p.k)) + 1}.`,
              truth: true,
              right: `True. ${Math.floor(Math.sqrt(p.k))}² = ${Math.floor(Math.sqrt(p.k)) ** 2} and ${Math.floor(Math.sqrt(p.k)) + 1}² = ${(Math.floor(Math.sqrt(p.k)) + 1) ** 2}, and ${p.k} is between them.`,
              wrong: [
                [`False. It is ${p.k} ÷ 2.`],
                [
                  "False. The square root of a whole number is always whole.",
                  "NPV.ROOT.EXACT-DECIMAL",
                ],
              ],
            },
            {
              claim: "$\\sqrt{2}$ can be written as a decimal that ends.",
              truth: "never",
              right: "Never. √2 = 1.41421… goes on for ever without repeating.",
              wrong: [
                ["Always. Every number is a decimal that ends.", "NPV.ROOT.EXACT-DECIMAL"],
                ["Sometimes. If the calculator is good enough.", "NPV.ROOT.EXACT-DECIMAL"],
              ],
            },
          ],
        );
    }
  },

  verify(p, question) {
    if (question.key.depth === 1) return chosenText(question) === `\\sqrt{${p.k}}`;
    if (question.key.depth === 2) return numberAnswer(question) === p.k;
    return true;
  },
});
