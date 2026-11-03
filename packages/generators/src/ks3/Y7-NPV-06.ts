/**
 * @statement Y7-NPV-06
 * @author @huntj
 * @ai-assisted yes: Claude wrote this generator in Phase 7
 */
// Y7-NPV-06: Recognise and use relationships between operations, including inverse operations
import * as A from "@mathsplanner/archetypes";
import { defineGenerator, reject, type QuestionDraft } from "@mathsplanner/core";
import { wrongs } from "../shared/angles.ts";
import { numberAnswer } from "../shared/counting.ts";
import { orClaims } from "../shared/variety.ts";

interface Params {
  a: number;
  b: number;
  claim: number;
}

export default defineGenerator<Params>({
  id: "Y7-NPV-06",
  version: "1.1.0",
  depths: [1, 2, 4],
  misconceptions: ["NPV.INVERSE.WRONG-PAIR"],

  params(rng, numbers) {
    const a = rng.int(numbers === "friendly" ? 11 : 23, numbers === "stretch" ? 99 : 49);
    const b = rng.int(numbers === "friendly" ? 3 : 12, numbers === "stretch" ? 99 : 39);
    if (a === b) reject("different factors");
    return { a, b, claim: rng.int(0, 2) };
  },

  build(p, depth, rng): QuestionDraft {
    const c = p.a * p.b;
    switch (depth) {
      case 1:
        return A.standard({
          question: ["You know that ", A.math(`${p.a} \\times ${p.b} = ${c}`), "."],
          ask: ["Use this to work out ", A.math(`${c} \\div ${p.a}`), "."],
          answer: A.number(p.b),
          wrong: wrongs(p.b, [
            {
              code: "NPV.INVERSE.WRONG-PAIR",
              value: A.number(p.a),
              feedback: `Dividing ${c} by ${p.a} leaves the other factor, ${p.b}.`,
            },
          ]),
          solution: [
            {
              say: `Division undoes multiplication: if ${p.a} × ${p.b} = ${c}, then ${c} ÷ ${p.a} = ${p.b}.`,
            },
          ],
        });
      case 2:
        return A.missingValue({
          intro: "Use the inverse operation to find the missing number.",
          relation: ["\\square", "\\times", p.b, "=", c].map((v) => (v === "\\square" ? p.a : v)),
          hide: 0,
          wrong: [
            {
              code: "NPV.INVERSE.WRONG-PAIR",
              value: A.number(c - p.b),
              feedback: `The inverse of multiplying by ${p.b} is dividing by ${p.b}, not subtracting.`,
            },
          ],
          solution: [{ say: `Undo × ${p.b} by dividing: ${c} ÷ ${p.b} = ${p.a}.` }],
        });
      default: {
        const claims = [
          {
            statement: [
              "If ",
              A.math(`${c} \\div ${p.b} = ${p.a}`),
              ", then ",
              A.math(`${c} \\times ${p.a} = ${p.b}`),
              ".",
            ],
            truth: false,
            reasons: [
              {
                text: `The inverse fact is ${p.a} × ${p.b} = ${c}. Multiplying ${c} by ${p.a} gives a much bigger number.`,
                correct: true,
              },
              {
                text: "You can swap any two numbers in a division fact.",
                code: "NPV.INVERSE.WRONG-PAIR",
              },
              { text: "It is true because multiplying undoes dividing." },
            ],
          },
          {
            statement: [
              "If ",
              A.math(`${c} - ${p.b} = ${c - p.b}`),
              ", then ",
              A.math(`${c - p.b} + ${p.b} = ${c}`),
              ".",
            ],
            truth: true,
            reasons: [
              {
                text: "Addition undoes subtraction: adding back what was taken away returns to the start.",
                correct: true,
              },
              { text: `It should be ${c - p.b} − ${p.b} = ${c}.`, code: "NPV.INVERSE.WRONG-PAIR" },
              { text: "Only true for small numbers." },
            ],
          },
          {
            statement: [
              "Dividing by ",
              A.math("4"),
              " is the same as multiplying by ",
              A.math("\\frac{1}{4}"),
              ".",
            ],
            truth: true,
            reasons: [
              {
                text: "Both find a quarter of the number; ¼ is the reciprocal of 4.",
                correct: true,
              },
              {
                text: "Dividing by 4 is the same as multiplying by 4.",
                code: "NPV.INVERSE.WRONG-PAIR",
              },
              { text: "Only for numbers that divide exactly by 4." },
            ],
          },
        ];
        const cl = claims[p.claim] ?? claims[0];
        if (!cl) return reject("no claim");
        return orClaims(
          rng,
          () =>
            A.trueOrFalseWhy({
              rng,
              statement: cl.statement,
              truth: cl.truth,
              reasons: cl.reasons,
              solution: [{ say: cl.reasons[0]?.text ?? "" }],
            }),
          [
            {
              claim:
                "Multiplying by a number that is not 0, then dividing by the same number, gets you back where you started.",
              truth: "always",
              right: "Always. Dividing undoes multiplying, so the two cancel out.",
              wrong: [
                ["Sometimes. Only for whole numbers.", "NPV.INVERSE.WRONG-PAIR"],
                ["Never. You need to multiply again to get back.", "NPV.INVERSE.WRONG-PAIR"],
              ],
            },
            {
              claim: "Adding 5, then subtracting 3, gets you back where you started.",
              truth: "never",
              right:
                "Never. The inverse of adding 5 is subtracting 5; subtracting 3 leaves you 2 more than you started with.",
              wrong: [
                ["Always. Subtracting undoes adding.", "NPV.INVERSE.WRONG-PAIR"],
                ["Sometimes. If the number is big enough."],
              ],
            },
            {
              statement: `Tia says that if $${p.a} \\times ${p.b} = ${p.a * p.b}$, then $${p.a * p.b} - ${p.a} = ${p.b}$.`,
              truth: false,
              right: `False. The inverse of multiplying is dividing: ${p.a * p.b} ÷ ${p.a} = ${p.b}.`,
              wrong: [
                ["True. Subtracting undoes multiplying.", "NPV.INVERSE.WRONG-PAIR"],
                ["True. Take away the number you multiplied by."],
              ],
            },
          ],
        );
      }
    }
  },

  verify(p, question) {
    if (question.archetype === "standard") return numberAnswer(question) * p.a === p.a * p.b;
    if (question.archetype === "missing-value") return numberAnswer(question) * p.b === p.a * p.b;
    return true;
  },
});
